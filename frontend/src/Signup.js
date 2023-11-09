import React, { useState } from "react";
import { Link } from "react-router-dom";
import Validation from "./SignupValidation";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    setErrors(Validation(values));

    // Perform error check after setting errors
    axios.post('http://localhost:3307/signup', values)
      .then((res) => {
        // Check for errors here, and navigate if there are none
        if (res.data === "EmailInUse") {

          // Show an alert for duplicate email
          alert("Sähköpostiosoite on jo käytössä.");

        } else if (res.data === "Error") {

          alert("Tilin luonti epäonnistui. Tarkista tiedot ja yritä uudelleen.");
        } else {
          navigate('/');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2 className='text-center'>Luo tili</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="name">Käyttäjänimi</label>
            <input type="text" placeholder='Syötä käyttäjänimi' name="name" id="name"
              onChange={handleInput} className='form-control rounded-15' />
            {errors.name && <span className='text-danger'> {errors.name}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='email'>Sähköposti</label>
            <input type='email' placeholder='Syötä sähköposti' name='email' id='email'
              onChange={handleInput} className='form-control rounded-15' />
            {errors.email && <span className='text-danger'> {errors.email}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor="password">Salasana</label>
            <input type="password" placeholder='Syötä salasana' name="password" id="password"
              onChange={handleInput} className='form-control rounded-15' />
            {errors.password && <span className='text-danger'> {errors.password}</span>}
          </div>
          <button type='submit' className='btn btn-primary w-100'><strong>Luo tili</strong></button>
          <div className="text-center">
            <p><Link to="/">Peruuta</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
