import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/authContext";
import { ToastContainer, toast } from "react-toastify";

const NewProject = () => {
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const auth = useContext(AuthContext);

    const navigate = useNavigate();

    const token = auth.token;

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    const handleValidation = () => {
        if(title.length < 5) {
            toast.error("Project Title length must be greater than 4 characters", toastOptions);
            return false;
        }
        if(startDate === "") {
            toast.error("Start Date can't be empty", toastOptions);
            return false;
        }
        if(endDate === "") {
            toast.error("End date can't be empty", toastOptions);
            return false;
        }
        if(startDate > endDate) {
            toast.error("Start Date must be before End Date", toastOptions);
            return false;
        }
        return true;
    }

    const newProjectHandler = async (event) => {
        event.preventDefault();

        if(handleValidation()) {
            try {
                const response = await fetch('http://localhost:5001/api/projects/new', {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({title, start_date: startDate, end_date: endDate})
                });
    
                const data = await response.json();
                
                if(!response.ok) {
                    console.log(data.error);
                    toast.error(data.error, toastOptions);
                } else {
                    toast.success(data.message, toastOptions);
                    setTimeout(() => {
                        navigate('/projects');
                    },2000)
                }
            } catch(err) {
                
            }
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
            <div className='container'>
                <h2>Create New project</h2>
                <form onSubmit={newProjectHandler}>
                    <label htmlFor="title">Project Title</label>
                    <input 
                        type="text" 
                        id="title" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        
                    />
                    <br/><br/>

                    <label htmlFor="startDate">Project Start Date</label>
                    <input 
                        type="date" 
                        id="startDate" 
                        value={startDate === "" ? "" : startDate.toISOString().substring(0,10)} 
                        onChange={e => 
                            e.target.value === "" ? setStartDate("") : setStartDate(new Date(e.target.value))
                        } 
                        
                    />
                    <br/><br/>

                    <label htmlFor="endDate">Project End Date</label>
                    <input 
                        type="date" 
                        id="endDate" 
                        value={endDate === "" ? "" : endDate.toISOString().substring(0,10)} 
                        onChange={e => 
                            e.target.value === "" ? setEndDate("") : setEndDate(new Date(e.target.value))
                        } 
                        
                    />
                    <br/><br/>

                    <button type="submit" className="submit-btn">Create Project</button>
                    <br/><br/>
                </form>
                <ToastContainer>

                </ToastContainer>
            </div>
        </React.Fragment>
    )
}

export default NewProject;