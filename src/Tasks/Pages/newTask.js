import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../shared/context/authContext";

const NewTask = () => {
    const {pid} = useParams();

    const auth = useContext(AuthContext);

    const navigate = useNavigate();

    const token = auth.token;

    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    const handleValidation = () => {
        if(name === "") {
            toast.error("Task name can't be blank", toastOptions);
            return false;
        }
        if(duration === "") {
            toast.error("Task duration can't be blank", toastOptions);
            return false;
        }
        return true;
    }

    const newTaskHandler = async (event) => {
        event.preventDefault();

        if(handleValidation()) {
            try {
                const response = await fetch(`http://localhost:5001/api/projects/${pid}/tasks/new`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({name, duration, description})
                });

                const data = await response.json();
                console.log(data)
                    
                if(!response.ok) {
                    console.log(data.error);
                    toast.error(data.error, toastOptions);
                } else {
                    toast.success(data.message, toastOptions);
                    setTimeout(() => {
                        navigate(`/projects/${pid}`);
                    },2000)
                }
            } catch(err) {
                toast.error(err, toastOptions)
                console.error(err);
            }
        }
    }

    return (
        <React.Fragment>
            <nav className="nav-bar">
                <h1 className="project-heading">Task Management System</h1>
            </nav>
            <div className='container'>
                <h2>Create new task</h2>
                <form onSubmit={newTaskHandler}>
                <label htmlFor="name">Task Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        
                    />
                    <br/><br/>

                    <label htmlFor="duration">Task Duration</label>
                    <input 
                        type="text" 
                        id="duration" 
                        value={duration} 
                        onChange={e => setDuration(e.target.value)} 
                        
                    />
                    <br/><br/>

                    <label htmlFor="description">Task Description</label>
                    <input 
                        type="text" 
                        id="description" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        
                    />
                    <br/><br/>

                    <button type="submit" className="submit-btn">Create Task</button>
                    <br/><br/>
                </form>
                <ToastContainer>

                </ToastContainer>
            </div>
        </React.Fragment>
    )
}

export default NewTask;