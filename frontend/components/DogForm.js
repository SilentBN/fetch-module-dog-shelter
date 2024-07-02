import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const initialForm = { name: "", breed: "", adopted: false };

// Use this form for both POST and PUT requests!
export default function DogForm() {
  const [values, setValues] = useState(initialForm);
  const [breeds, setBreeds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBreeds();
    if (id) {
      setIsEditing(true);
      fetchDog(id);
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const fetchBreeds = () => {
    fetch("http://localhost:9009/api/dogs/breeds")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setBreeds(data))
      .catch((error) => {
        console.error("Error fetching breeds:", error);
        setError("Failed to fetch breeds. Please try again later.");
      });
  };

  const fetchDog = (dogId) => {
    fetch(`http://localhost:9009/api/dogs/${dogId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setValues(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dog:", error);
        setError("Failed to fetch dog details. Please try again later.");
        setIsLoading(false);
      });
  };

  const validateForm = () => {
    const errors = {};
    if (!values.name.trim()) errors.name = "Name is required";
    if (!values.breed) errors.breed = "Breed is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

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
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        setError("Failed to save dog. Please try again later.");
        setIsLoading(false);
      });
  };

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear the error for this field when the user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const resetForm = () => {
    setValues(initialForm);
    setFormErrors({});
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>{isEditing ? "Edit Dog" : "Create Dog"}</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            name="name"
            value={values.name}
            onChange={onChange}
            placeholder="Name"
            aria-label="Dog's name"
          />
          {formErrors.name && (
            <span style={{ color: "red" }}>{formErrors.name}</span>
          )}
        </div>
        <div>
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
          {formErrors.breed && (
            <span style={{ color: "red" }}>{formErrors.breed}</span>
          )}
        </div>
        <div>
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
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
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
