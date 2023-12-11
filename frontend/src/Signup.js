import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';

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
    setErrors(Validation(values));

    axios.post('https://home-app-front.onrender.com/signup', values)
      .then((res) => {
        if (res.data === "EmailInUse") {
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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
      <div title='Kotiapp' className='border w-25 rounded d-flex flex-column justify-content-center h-75 bg-white'>
        <h4 className='text-center '>&nbsp;</h4>
        <h1 className='text-center'>Kotiapp</h1>
        <div className='d-flex justify-content-center align-items-center bg-white p-3 m-3'>
          <div className='bg-white p-3 rounded w-100'>
            <h4 className='text-left'>Luo tili</h4>
            <form action="" onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label htmlFor="name" className="visually-hidden">Käyttäjänimi</label>
                <input
                  type="text"
                  placeholder='Syötä käyttäjänimi'
                  name="name"
                  id="name"
                  onChange={handleInput}
                  className='form-control rounded-pill'
                />
                {errors.name && <span className='text-danger'> {errors.name}</span>}
              </div>
              <div className='mb-3'>
                <label htmlFor='email' className="visually-hidden">Sähköposti</label>
                <input
                  type='email'
                  placeholder='Syötä sähköposti'
                  name='email'
                  id='email'
                  onChange={handleInput}
                  className='form-control rounded-pill'
                />
                {errors.email && <span className='text-danger'> {errors.email}</span>}
              </div>
              <div className='mb-3'>
                <label htmlFor="password" className="visually-hidden">Salasana</label>
                <input
                  type="password"
                  placeholder='Syötä salasana'
                  name="password"
                  id="password"
                  onChange={handleInput}
                  className='form-control rounded-pill'
                />
                {errors.password && <span className='text-danger'> {errors.password}</span>}
              </div>
              <div className='mb-3'>
                <button type='submit' className='btn btn-dark w-100 rounded-pill'><strong>Luo tili</strong></button>
              </div>
              <div className="text-center">
                <p><Link to="/">Peruuta</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
