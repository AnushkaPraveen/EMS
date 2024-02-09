import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export const EmployeeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employeeDetails, setEmployeeDetails] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/employee/detail/` + id)
            .then(result => {
                console.log(result.data[0]);

                setEmployeeDetails(result.data[0])
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const handleLogout = () => {
        axios.get('http://localhost:3000/auth/logout')
            .then(result => {
                if (result.data.Status) {
                    localStorage.removeItem("valid")
                    navigate('/')
                }
            }).catch(err => console.log(err))
    }

    if (!employeeDetails) {
        return (<div><h1>Loading</h1></div>)
    }

    return (
        <div>
            <div className="p-2 d-flex justify-content-center shadow">
                <h4>Employee Management System</h4>
            </div>
          <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
                <img src={`http://localhost:3000/Images/` + employeeDetails.image} className='emp_det_image' />
                <div className='d-flex align-items-center flex-column mt-5'>
                    <h3>Name: {employeeDetails.name}</h3>
                    <h3>Email: {employeeDetails.email}</h3>
                    <h3>Salary: ${employeeDetails.salary}</h3>
                </div>
                <div>
                    <button className='btn btn-primary me-2'>Edit</button>
                    <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}
