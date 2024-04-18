import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { AuthContext } from "../../shared/context/authContext";

const LogIn = () => {
    const auth = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    const handleValidation = () => {
        console.log("123")
        if(email === "" || password === "") {
            toast.error("Email and password can't be blank", toastOptions);
            return false;
        }
        return true;
    }

    const loginHandler = async (event) => {
        event.preventDefault();

        if(handleValidation()) {
            try {
                console.log(email, password);
    
                const response = await fetch('http://localhost:5001/api/users/login', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, password})
                })
    
                if(!response.ok) {
                    const data = await response.json();
                    console.log(data.message);
                    toast.error(data.message, toastOptions);
                }
    
                const data = await response.json();
    
                auth.login(data.id, data.accessToken);
            } catch (err) {
                
            }
        }
    }

    return (
        <React.Fragment>
            <nav className="nav-bar">
                <h1 className="project-heading">Task Management System</h1>
            </nav>
            <div className="container">
                <h2>Login</h2>
                <form onSubmit={loginHandler}>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        
                    />
                    <br/><br/>

                    <label htmlFor="password">Password</label>
                    <input
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        
                    />
                    <br/><br/>

                    <button type="submit" className="submit-btn">Login</button>
                    <br/><br/>

                    <div className='sign-up-option'>
                        <p className='or'> Don't have an account? </p>
                        <Link to="/signup" className='auth-link' >Sign up</Link><br />
                    </div>
                </form>
                <ToastContainer>

                </ToastContainer>
            </div>
        </React.Fragment>
    )
}

export default LogIn;