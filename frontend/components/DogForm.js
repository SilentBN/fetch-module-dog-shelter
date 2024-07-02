import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const initialForm = { name: "", breed: "", adopted: false };

// Use this form for both POST and PUT requests!
export default function DogForm() {
  const [values, setValues] = useState(initialForm);
  const [breeds, setBreeds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBreeds();
    if (id) {
      setIsEditing(true);
      fetchDog(id);
    }
  }, [id]);

  const fetchBreeds = () => {
    fetch("http://localhost:9009/api/dogs/breeds")
      .then((res) => res.json())
      .then((data) => setBreeds(data))
      .catch((error) => console.error("Error fetching breeds:", error));
  };

  const fetchDog = (dogId) => {
    fetch(`http://localhost:9009/api/dogs/${dogId}`)
      .then((res) => res.json())
      .then((data) => setValues(data))
      .catch((error) => console.error("Error fetching dog:", error));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const url = isEditing
      ? `http://localhost:9009/api/dogs/${id}`
      : "http://localhost:9009/api/dogs";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then(() => {
        navigate("/");
      })
      .catch((error) => console.error("Error submitting form:", error));
  };

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setValues(initialForm);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Dog" : "Create Dog"}</h2>
      <form onSubmit={onSubmit}>
        <input
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Name"
          aria-label="Dog's name"
        />
        <select
          name="breed"
          value={values.breed}
          onChange={onChange}
          aria-label="Dog's breed"
        >
          <option value="">---Select Breed---</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
        <label>
          Adopted:{" "}
          <input
            type="checkbox"
            name="adopted"
            checked={values.adopted}
            onChange={onChange}
            aria-label="Is the dog adopted?"
          />
        </label>
        <div>
          <button type="submit">
            {isEditing ? "Update Dog" : "Create Dog"}
          </button>
          <button type="button" onClick={resetForm} aria-label="Reset form">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
