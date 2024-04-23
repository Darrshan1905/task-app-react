import React, { useContext, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../shared/context/authContext";
import { ToastContainer, toast } from "react-toastify";

const EditTask = () => {
    const {pid, tid} = useParams();

    const auth = useContext(AuthContext);

    const navigate = useNavigate();

    const location = useLocation();

    const token = auth.token;

    const [name, setName] = useState(location.state.name);
    const [duration, setDuration] = useState(location.state.duration);
    const [description, setDescription] = useState(location.state.description);

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

    const editTaskHandler = async (event) => {
        event.preventDefault();

        if(handleValidation()) {
            try {
                const response = await fetch(`http://localhost:5001/api/projects/${pid}/tasks/${tid}/update`, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({name, duration, description})
                });
    
                const data = await response.json();
                
                if(!response.ok) {
                    toast.error(data.error, toastOptions);
                } else {
                    toast.success("Updated task successfully", toastOptions);
                    setTimeout(() => {
                        navigate(-1);
                    },2000);
                }
            } catch(err) {
                
            }
        }
    }

    return (
        <React.Fragment>
            <nav className="nav-bar">
                <h1 className="project-heading">Task Management System</h1>
            </nav>
            <div className='container'>
                <h2>Update Task</h2>
                <form onSubmit={editTaskHandler}>
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

                    <button type="submit" className="submit-btn">Update Task</button>
                    <br/><br/>
                </form>
                <ToastContainer>

                </ToastContainer>
            </div>
        </React.Fragment>
    )
}

export default EditTask;