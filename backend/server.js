const express = require("express");
const cors = require("cors");
const path = require("path");
const Yup = require("yup");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 9009;
const server = express();

// Create a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply the rate limiter to all requests
server.use(limiter);
server.use(express.json());
server.use(express.static(path.join(__dirname, "../dist")));
server.use(cors());

let id = 1;
const getNextId = () => id++;
const dogBreeds = [
  "Dalmatian",
  "German Shepherd",
  "Golden Retriever",
  "Boxer",
  "Bulldog",
];
let dogs = [
  {
    id: getNextId(),
    name: "Buddy",
    breed: "Dalmatian",
    adopted: false,
  },
  {
    id: getNextId(),
    name: "Max",
    breed: "German Shepherd",
    adopted: true,
  },
  {
    id: getNextId(),
    name: "Bella",
    breed: "Boxer",
    adopted: true,
  },
];

server.get("/api/dogs/breeds", (_, res) => {
  res.json(dogBreeds);
});

server.get("/api/dogs", (_, res) => {
  res.json(dogs);
});

server.delete("/api/dogs/:id", (req, res, next) => {
  const dog = dogs.find((dg) => dg.id == req.params.id);
  if (!dog) {
    return next({ status: 404, message: "Dog not found" });
  }
  dogs = dogs.filter((dg) => dg.id != req.params.id);
  res.json(dog);
});

const putSchema = Yup.object()
  .shape({
    name: Yup.string().nullable().min(3),
    breed: Yup.string()
      .oneOf(dogBreeds, `Breed must be one of: ${dogBreeds.join(", ")}`)
      .nullable(),
    adopted: Yup.boolean().nullable(),
  })
  .test("at-least-one-field", "Provide properties to update", function (obj) {
    return obj.name != null || obj.breed != null || obj.adopted != null;
  });

server.put("/api/dogs/:id", async (req, res, next) => {
  const dog = dogs.find((dg) => dg.id == req.params.id);
  if (!dog) {
    return next({ status: 404, message: "Dog not found" });
  }
  try {
    const { name, breed, adopted } = await putSchema.validate(req.body, {
      stripUnknown: true,
    });
    if (name) dog.name = name;
    if (breed) dog.breed = breed;
    if (adopted !== undefined) dog.adopted = adopted;
    res.json(dog);
  } catch ({ message }) {
    return next({ status: 422, message });
  }
});

const postSchema = Yup.object().shape({
  name: Yup.string().required("`name` required").min(3, "Name too short"),
  breed: Yup.string()
    .required("`breed` required")
    .oneOf(dogBreeds, `Breed must be one of: ${dogBreeds.join(", ")}`),
  adopted: Yup.boolean().nullable(),
});

server.post("/api/dogs", async (req, res, next) => {
  try {
    const { name, breed, adopted } = await postSchema.validate(req.body, {
      stripUnknown: true,
    });
    const newDog = { id: getNextId(), name, breed, adopted: adopted ?? false };
    dogs.push(newDog);
    res.status(201).json(newDog);
  } catch ({ message }) {
    return next({ status: 422, message });
  }
});

server.get("*", limiter, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

server.use((req, res) => {
  res.status(404).json({
    message: `Endpoint [${req.method}] ${req.path} does not exist`,
  });
});

server.use((err, req, res, next) => {
  const message = err.message || "Unknown error happened";
  const status = err.status || 500;
  const reason = err.reason;
  const payload = { message };
  if (reason) payload.reason = reason;
  res.status(status).json(payload);
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
