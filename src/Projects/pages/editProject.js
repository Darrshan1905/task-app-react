import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../shared/context/authContext";

const EditProject = () => {
    const location = useLocation();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const token = auth.token;

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    };

    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };

    const formatDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    };

    const [title, setTitle] = useState(location.state.title);
    const startDateStr = new Date(location.state.startDate).toLocaleString('en-IN', options).substring(0, 10);
    const endDateStr = new Date(location.state.endDate).toLocaleString('en-IN', options).substring(0, 10);

    const [startDate, setStartDate] = useState(formatDate(startDateStr));
    const [endDate, setEndDate] = useState(formatDate(endDateStr));

    console.log(startDate, endDate)

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
    };

    const editProjectHandler = async (event) => {
        event.preventDefault();

        if(handleValidation()) {
            try {
                const response = await fetch(`http://localhost:5001/api/projects/${location.state.id}/update`, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({title, start_date: startDate, end_date: endDate})
                });
    
                const data = await response.json();
                
                if(!response.ok) {
                    toast.error(data.error, toastOptions);
                } else {
                    toast.success("Updated project successfully", toastOptions);
                    setTimeout(() => {
                        navigate('/projects');
                    },2000);
                }
            } catch(err) {
                console.log(err);
            }
        }
    };

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
                <h2>Update project</h2>
                <form onSubmit={editProjectHandler}>
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
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                    />
                    <br/><br/>

                    <label htmlFor="endDate">Project End Date</label>
                    <input 
                        type="date" 
                        id="endDate" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                    />
                    <br/><br/>

                    <button type="submit" className="submit-btn">Update Project</button>
                    <br/><br/>
                </form>
                <ToastContainer />
            </div>
        </React.Fragment>
    );
};

export default EditProject;
