import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './LoginValidation';
import axios from 'axios';

function Login() {
        const [values, setValues] = useState({
            email: '',
            password: ''
        })
        const navigate = useNavigate();

        const [errors, setErrors] = useState({})
        const handleInput = (event) => {
            setValues((prev) => ({ ...prev, [event.target.name]: [event.target.value] }));
        }
        const handleSumbit = (event) => {
            event.preventDefault();
            console.log(values);
            setErrors(Validation(values)); // Set errors state
          
            axios.post('http://localhost:3307/login', values)
              .then((res) => {
                // Check for errors here, and navigate if there are no errors
                if (res.data === "Success") {
                  navigate('/home');
                } else if (res.data === "NoUser") {
                    alert('Sinulla ei ole käyttäjää. Luo tili');
                } else {
                  alert("Kirjautuminen epäonnistui. Tarkista tiedot ja yritä uudelleen.");
                }
              })
              .catch((err) => console.log(err));
          };
        
     
        
        
    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
            <h2 className='text-center'>Kirjaudu</h2>
                <form action="" onSubmit={handleSumbit}>
                    <div className='mb-3'>
                        <label htmlFor="email">Sähköposti</label>
                        <input type="email" placeholder='Syötä sähköposti' name='email' id='email'
                        onChange={handleInput} className='form-control rounded-15'/>
                        {errors.email && <span className='text-danger'> {errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password">Salasana</label>
                        <input type="password" placeholder='Syötä salasana' name='password' id='password'
                        onChange={handleInput} className='form-control rounded-15'/>
                        {errors.password && <span className='text-danger'> {errors.password}</span>}
                    </div>
                    <button type='submit' className='btn btn-primary w-100'><strong>Kirjaudu</strong></button>
                    <div className="text-center">
                    <p>Eikö sinulla ole tiliä? <Link to="/signup">Luo tili</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Login