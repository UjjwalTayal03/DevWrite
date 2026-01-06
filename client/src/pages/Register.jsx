import { useState } from "react";
import {useNavigate} from "react-router-dom"
import api from "../services/api.js";
import React from 'react'

const Register = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [error, setError] = useState("")

    const handleChange = (e)=>{
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            await api.post("/auth/register", form)
            navigate("/login")
        } catch (error) {
            setError(error.response?.data?.message || "Registration Failed")
        }
    }


  return (
    <div>
        <h1>Register</h1>

        <form action="" onSubmit={handleSubmit}>
            <input type="text" name="name" id="" placeholder="Name" value={form.name} onChange={handleChange} required />

            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required/>

            <button type="submit">Register</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

    </div>
  )
}

export default Register