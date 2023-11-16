import React, { useState } from 'react';
import axios from 'axios';

function CreateHome() {
  const userId = localStorage.getItem('userId');
  const [error, setError] = useState(null);

  const handleCreateHome = () => {
    const homeName = document.getElementById('name').value;

    // Check if the length of homeName exceeds the allowed limit (10 characters)
    if (homeName.length > 10) {
      setError("Kodin nimi liian pitkä. (max 10)");
      return;
    }

    axios.post('http://localhost:3307/create-home', { userId, name: homeName })
      .then(response => {
        // handle success
        console.log('Create Home Response:', response.data);
        setError(null); // Clear any previous errors
      })
      .catch(error => {
        // handle error
        console.error('Create Home Error:', error);

        if (error.response && error.response.data && error.response.data.code === 'ER_DATA_TOO_LONG') {
          setError("Kodin nimi liian pitkä. (max 10)");
        } else {
          setError("Virhe kotia luodessa. Yritä uudelleen.");
        }
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
      <div title="Kotiapp" className="border w-25 rounded d-flex flex-column justify-content-center h-75 bg-white">
        <h4 className="text-center">Tervetuloa</h4>
        <h1 className="text-center">Kotiapp</h1>
        <div className="d-flex justify-content-center align-items-center bg-white p-3 m-3">
          <div className="bg-white p-3 rounded w-100">
            <div className="mb-5">
              <label htmlFor="name" className="visually-hidden">Kodin nimi</label>
              <input
                type="text"
                placeholder="Anna kodille nimi (max 10 merkkiä)"
                name="name"
                id="name"
                className="form-control rounded-pill"
              />
              {error && <span className="text-danger">{error}</span>}
            </div>
            <div className="mb-3">
              <button type="button" className="btn btn-dark w-100 rounded-pill" onClick={handleCreateHome}>
                <strong>Luo koti</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateHome;
