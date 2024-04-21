import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    const handleValidation = () => {
        if(email === "") {
            toast.error("Email can't be blank", toastOptions);
            return false;
        }
        if(password === "") {
            toast.error("Password can't be blank", toastOptions);
            return false;
        }
        else if(password.length < 6) {
            toast.error("Password length must be greater than 5 characters", toastOptions);
            return false;
        }
        if(name === "") {
            toast.error("Name can't be blank", toastOptions);
            return false;
        }
        if(name.length < 3) {
            toast.error("Name length must be greater than 2 characters", toastOptions);
            return false;
        }
        if(confirmPassword === "") {
            toast.error("Confirm Password can't be blank", toastOptions);
            return false;
        }
        if(confirmPassword !== password) {
            toast.error("Password and Confrim password don't match", toastOptions);
            return false;
        }
        return true;
    }

    const signupHandler = async (event) => {
        event.preventDefault();

        if(handleValidation()) {
            try {
                const response = await fetch('http://localhost:5001/api/users/signup', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, password, name})
                })
    
                if(!response.ok) {
                    const data = await response.json();
                    console.log(data.error);
                    toast.error(data.error, toastOptions);
                }
                else {
                    navigate('/login');
                }
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
                <h2>Sign Up</h2>
                <form onSubmit={signupHandler}>
                    <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            
                        />
                    <br/><br/>

                    <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            
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

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password" 
                        id="confirmPassword" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        
                    />
                    <br/><br/>

                    <button type="submit" className="submit-btn">Sign up</button>
                    <br/><br/>

                    <div className='sign-up-option'>
                        <p className='or'> Already have an account? </p>
                        <Link to="/login" className='auth-link' >Login</Link><br />
                    </div>
                </form>
                <ToastContainer>

                </ToastContainer>
            </div>
        </React.Fragment>
    )
}

export default SignUp;