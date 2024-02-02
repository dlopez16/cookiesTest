import React, { useState } from "react";
import "../styles/SignIn.css";
import Header from "../components/Header";
import { SIGN_IN } from "../api/authRoutes";


export default function SignIn() {

    const [signForm, setSignForm] = useState({
        email: "",
        password: ""
    });

    const [submitForm, setSubmitForm] = useState({});

    // this function will handle both inputs, by copying the singForm object, spreding it and adding the input name and value dynamically.
    function handleChange(event) {
        //this const deconstructured the event.target, to save space and readability.
        const { name, value } = event.target;

        //prevValue will take the object template on setSignForm, we will use that to plug in the new value.
        setSignForm(prevValue => {
            return {
                //...prevValue will spread the object, and will add what the user typed on the input ([name] = event.target.name, value = event.target.value)
                ...prevValue,
                [name]: value
            }
        })
    }

    async function handleClick(event) {
        event.preventDefault();
        try {
            const user = await SIGN_IN(signForm);
            console.log(user)
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div>
            <Header />
            <form className="signin-form" onSubmit={handleClick}>
                <input onChange={handleChange}
                    name="email"
                    value={signForm.email}
                    placeholder="Email"
                    type="email"
                ></input>
                <input onChange={handleChange}
                    name="password"
                    value={signForm.password}
                    placeholder="Password"
                    type="password"
                ></input>
                <button>Sign In</button>
            </form>
            <button onClick={async () => {
                try {
                    const response = await fetch("http://localhost:4800/signin", {
                        method: "GET",
                        headers: {
                            credentials: "same-page",
                            "Content-Type": "application/json",
                            // "authorization": "Bearer " + token
                        }
                    })
                    if (response.ok) {
                        // response.json() will return a json of all the products on the server side
                        response.json().then(res => {
                            console.log(res)
                        });
                    } else {
                        return Promise.reject(response);
                    }
                } catch (err) {
                    console.log(err)
                }
            }}>Get</button>
        </div>
    )
}