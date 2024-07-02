import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DogsList() {
  const [dogs, setDogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = () => {
    fetch("http://localhost:9009/api/dogs")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setDogs(data))
      .catch((error) => console.error("Error fetching dogs:", error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:9009/api/dogs/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        fetchDogs(); // Refresh the list after deletion
      })
      .catch((error) => console.error("Error deleting dog:", error));
  };

  const handleEdit = (id) => {
    navigate(`/form/${id}`);
  };

  return (
    <div>
      <h2>Dogs Shelter</h2>
      <ul>
        {dogs.map((dog) => (
          <li key={dog.id}>
            {dog.name}, {dog.breed}, {dog.adopted ? "Adopted" : "NOT adopted"}
            <div>
              <button onClick={() => handleEdit(dog.id)}>Edit</button>
              <button onClick={() => handleDelete(dog.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
