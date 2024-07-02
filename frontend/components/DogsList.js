import React from 'react'

export default function DogsList() {
  return (
    <div>
      <h2>Dogs Shelter</h2>
      <ul>
        <li>
          Fido, Bulldog, NOT adopted
          <div>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </li>
      </ul>
    </div>
  )
}
