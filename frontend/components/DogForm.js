import React, { useState } from 'react'

const initialForm = { name: '', breed: '', adopted: false }

// Use this form for both POST and PUT requests!
export default function DogForm() {
  const [values, setValues] = useState(initialForm)
  const onSubmit = (event) => {
    event.preventDefault()
  }
  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setValues({
      ...values, [name]: type === 'checkbox' ? checked : value
    })
  }
  return (
    <div>
      <h2>
        Create Dog
      </h2>
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
          {/* Populate this dropdown using data obtained from the API */}
        </select>
        <label>
          Adopted: <input
            type="checkbox"
            name="adopted"
            checked={values.adopted}
            onChange={onChange}
            aria-label="Is the dog adopted?"
          />
        </label>
        <div>
          <button type="submit">
            Create Dog
          </button>
          <button aria-label="Reset form">Reset</button>
        </div>
      </form>
    </div>
  )
}
