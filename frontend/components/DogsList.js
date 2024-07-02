import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DogsList() {
  const [dogs, setDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = () => {
    setIsLoading(true);
    setError(null);
    fetch("http://localhost:9009/api/dogs")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setDogs(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dogs:", error);
        setError("Failed to fetch dogs. Please try again later.");
        setIsLoading(false);
      });
  };

  const handleDelete = (id) => {
    setIsLoading(true);
    setError(null);
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
      .catch((error) => {
        console.error("Error deleting dog:", error);
        setError("Failed to delete dog. Please try again later.");
        setIsLoading(false);
      });
  };

  const handleEdit = (id) => {
    navigate(`/form/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Dogs Shelter</h2>
      {dogs.length === 0 ? (
        <p>No dogs available.</p>
      ) : (
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
      )}
    </div>
  );
}
