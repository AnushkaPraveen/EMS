import axios from 'axios';
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  email: string;
  password: string;
}

export const EmployeeLogin = () => {
  const [values, setValues] = useState<FormValues>({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("clicked");
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3000/employee/employee_login', values)
      .then(result => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", "true")
          navigate('/employee_details/' + result.data.id)
        } else {
          setError(result.data.Error)
        }
      })
      .catch(err => console.log(err))
  }
  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
      <div className='p-3 rounded w-25 border loginForm'>
        <div className='text-warning'>
          {error && error}
        </div>
        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' autoComplete='off' placeholder='Enter Email' className='form-control rounded-0' onChange={(e) => setValues({ ...values, email: e.target.value })} />
          </div>
          <div className='mb-3'>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' autoComplete='off' placeholder='Enter Email' className='form-control rounded-0' onChange={(e) => setValues({ ...values, password: e.target.value })} />
          </div>
          <button className='btn btn-success w-100 rounded-0'>Submit</button>
          <div className='mb-3'>
            <input type='checkbox' name='tick' id='tick' />
            <label><strong>You are agree with terms & conditions</strong></label>
          </div>
        </form>
      </div>
    </div>
  )
}
