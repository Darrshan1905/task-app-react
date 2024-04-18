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
        console.log("123")
        if(email === "") {
            toast.error("Email can't be blank", toastOptions);
            return false;
        }
        if(password === "") {
            toast.error("Password can't be blank", toastOptions);
            return false;
        }
        if(name === "") {
            toast.error("Name can't be blank", toastOptions);
            return false;
        }
        if(confirmPassword === "") {
            toast.error("Confirm Password can't be blank", toastOptions);
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
                    body: JSON.stringify({email, password, name, confirmPassword})
                })
    
                if(!response.ok) {
                    const data = await response.json();
                    console.log(data.message);
                    toast.error(data.message, toastOptions);
                }
                else {
                    navigate('/login');
                }
            } catch (err) {
                
            }
        }
    }

    return (
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
    )
}

export default SignUp;