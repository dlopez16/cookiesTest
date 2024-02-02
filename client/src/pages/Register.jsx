import React, { useState } from "react";
import { REGISTER } from "../api/authRoutes"

export default function Register() {


    const [registerForm, setRegisterForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [submit, setSubmit] = useState({})


    function handleChange(event) {
        const { name, value } = event.target;
        setRegisterForm(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        })
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const newUser = await REGISTER(registerForm)
        console.log(newUser)
    }




    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} type="text" name="firstName" placeholder="First Name" value={registerForm.firstName} />First Name
                <input onChange={handleChange} type="text" name="lastName" placeholder="Last Name" value={registerForm.lastName} />Last Name
                <input onChange={handleChange} type="email" name="email" placeholder="Email" value={registerForm.email} />Email
                <input onChange={handleChange} type="password" name="password" placeholder="Password" value={registerForm.password} />Password
                <button>Register</button>
            </form>
        </div>
    )
}