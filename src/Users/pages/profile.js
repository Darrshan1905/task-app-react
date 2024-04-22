import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../shared/context/authContext";

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = useContext(AuthContext);

    const navigate = useNavigate();

    const token = auth.token;

    const fetchUserInfo = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/users/profile", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if(!response.ok) {
                const data = await response.json();
                console.log(data.message);
                toast.error(data.message, toastOptions);
            } else {
                const data = await response.json();
                console.log(data);
                setName(data.name);
                setEmail(data.email);
            }
        } catch (err) {
            console.error("Error fetching user info:", err);
        }
    }

    useEffect(() => {
        fetchUserInfo();
    },[])

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
        if(name === "") {
            toast.error("Name can't be blank", toastOptions);
            return false;
        }
        if(name.length < 3) {
            toast.error("Name length must be greater than 2 characters", toastOptions);
            return false;
        }
        if(password !== "") {
            if(password.length < 6) {
                toast.error("Password length must be greater than 5 characters", toastOptions);
                return false;
            }
            if(confirmPassword !== password) {
                toast.error("Password and Confrim password don't match", toastOptions);
                return false;
            }
            return true;
        }
        if(confirmPassword !== "") {
            toast.error("Enter password first before confirming it!", toastOptions);
            return false;
        } 
        return true;
    }

    const editProfileHandler = async (event) => {
        event.preventDefault();

        if(handleValidation()) {
            try {
                const response = await fetch('http://localhost:5001/api/users/update', {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, password, name})
                })

                const data = await response.json();
                console.log(data);

                if(!response.ok) {
                    console.log(data.error);
                    toast.error(data.error, toastOptions);
                } else {
                    auth.login(data.id, data.accessToken, data.name, auth.isAdmin);
                    navigate('/projects');
                }
            } catch (err) {

            }
        }
    }

    const handleCancelAccount = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/api/users/destroy', {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json();
            console.log(data);

            if(!response.ok) {
                console.log(data.error);
                toast.error(data.error, toastOptions);
            } else {
                toast.success('Account deleted successfully', toastOptions);
                setTimeout(() => {
                    auth.logout();
                }, 2000)
            }
        } catch(error) {

        }
    }

    return (
        <React.Fragment>
            <nav className="nav-bar">
                <h1 className="project-heading">Task Management System</h1>
                <div>
                    <Link to="/projects" className="nav-btn">
                        Back to all projects page
                    </Link>
                </div>
            </nav>
            <div className="container">
                <h2>Edit Profile</h2>
                <form onSubmit={editProfileHandler}>
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

                    <button type="submit" className="submit-btn">Update</button>
                    <br/><br/>

                    <hr/>
                    <h3 style={{"textAlign": "center"}}>Cancel my account</h3>

                    <div className='sign-up-option'>
                        <p className='or'> Unhappy? </p>
                        <Link to="#" onClick= {handleCancelAccount} className='auth-link' >Cancel my account</Link><br />
                    </div>
                 </form>
                 <ToastContainer>

                </ToastContainer>
            </div>
        </React.Fragment>
    )
}

export default Profile;