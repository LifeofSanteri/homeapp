import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: [event.target.value] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));

axios.post('http://localhost:3307/login', values)
  .then((res) => {
    const status = res.data.status;
    const userId = res.data.userId;

    if (status === "Success") {
      // Save the user ID in localStorage
      localStorage.setItem('userId', userId);

      navigate('/home');
      console.log('ID:', userId);
    } else if (status === "NoUser") {
      alert('Sinulla ei ole käyttäjää. Luo tili');
    } else if (status === "NoHome") {
      // Save the user ID in localStorage
      localStorage.setItem('userId', userId);

      console.log('ID:', userId);
      navigate('/joc');
    } else {
      alert("Kirjautuminen epäonnistui. Tarkista tiedot ja yritä uudelleen.");
    }
  })
  .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
      <div title="Kotiapp" className="border w-25 rounded d-flex flex-column justify-content-center h-75 bg-white">
        <h4 className="text-center ">Tervetuloa</h4>
        <h1 className="text-center">Kotiapp</h1>
        <div className="d-flex justify-content-center align-items-center bg-white p-3 m-3">
          <div className="bg-white p-3 rounded w-100">
            <h4 className="text-left">Kirjaudu</h4>
            <form action="" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="visually-hidden">Sähköposti</label>
                <input
                  type="email"
                  placeholder="Syötä sähköposti"
                  name="email"
                  id="email"
                  onChange={handleInput}
                  className="form-control rounded-pill"
                />
                {errors.email && <span className="text-danger"> {errors.email}</span>}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="visually-hidden">Salasana</label>
                <input
                  type="password"
                  placeholder="Syötä salasana"
                  name="password"
                  id="password"
                  onChange={handleInput}
                  className="form-control rounded-pill"
                />
                {errors.password && <span className="text-danger"> {errors.password}</span>}
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-dark w-100 rounded-pill">
                  <strong>Kirjaudu</strong>
                </button>
              </div>
              <div className="text-center">
                <p>
                  Eikö sinulla ole tiliä? <Link to="/signup">Luo tili</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
