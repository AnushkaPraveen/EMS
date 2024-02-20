import React, { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
interface Employee {
  name: string;
  email: string;
  salary: string;
  address: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

export const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee>({
    name: "",
    email: "",
    salary: "",
    address: "",
    category_id: "",
  });
  const [category, setCategory] = useState<Category[]>()
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios.get(`http://localhost:3000/auth/employee/` + id)
      .then(result => {
        setEmployee({
          ...employee, name: result.data.Result[0].name,
          email: result.data.Result[0].email,
          salary: result.data.Result[0].salary,
          address: result.data.Result[0].address,
          category_id: result.data.Result[0].category_id
        })
      }).catch(err => console.log(err)
      )
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    axios.put('http://localhost:3000/auth/edit_employee/' + id, employee)
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/employee')
        } else {
          alert(result.data.Error)
        }
      })
      .catch(err => console.log(err))
  }

  if (!category) {
    return (<div><h1>Loading</h1></div>)
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              value={employee.email}
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              value={employee.salary}
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              value={employee.address}
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              Category
            </label>
            <select name="category" id="category" className="form-select"
              onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}>
              {category.map(c => {
                return <option value={c.id}>{c.name}</option>
              })}
            </select>
          </div>
          <div className="col-12 mb-3">
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
