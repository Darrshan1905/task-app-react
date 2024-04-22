import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/context/authContext";
import { ToastContainer, toast } from "react-toastify";

const ProjectsList = ({projects, setIsUpdated, isSearched}) => {
    console.log(isSearched)
    const auth = useContext(AuthContext);

    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };

    const formatDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    };

    const token = auth.token;

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    const validUser = (projectOwnerId) => {
        if(auth.userId !== projectOwnerId && !auth.isAdmin) {
            toast.error('Not authorized to delete this project', toastOptions);
            return false;
        }
        return true;
    }

    const handleDeleteProject = async (projectId, projectOwnerId) => {
        if(validUser(projectOwnerId)) {
            try {
                const response = await fetch(`http://localhost:5001/api/projects/${projectId}`,{
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
                    toast.success('Project deleted successfully', toastOptions);
                    setIsUpdated((prev) => !prev);
                }
            } catch(err) {
    
            }
        }
    }

    return (
        <div className='projects-container'>
            {!isSearched ? <h2> List of all projects </h2> : <h2> List of projects matching the search query </h2>}
            <table>
                <tbody>
                <tr>
                    <th> Project Title </th>
                    <th> Start Date </th>
                    <th> End Date </th>
                        <th colSpan="2">Actions</th>
                   
                </tr>
                {projects.map(project => (
                    <tr key={project.id}>
                        <td>
                            <Link to={`/projects/${project.id}`} className="icon">
                                {project.title}
                            </Link>
                        </td>
                        <td>{formatDate(new Date(project.start_date).toLocaleString('en-IN', options).substring(0,10))}</td>
                        <td>{formatDate(new Date(project.end_date).toLocaleString('en-IN', options).substring(0,10))}</td>      
                        <td>
                            <Link 
                            to={`/projects/${project.id}/edit`} 
                            onClick={
                             (e) => {
                                if(project.user_id !== auth.userId && !auth.isAdmin) {
                                    e.preventDefault();
                                    toast.error('Not authorized to edit this project', toastOptions);
                                }
                             } 
                            }
                            state={{
                                id: project.id,
                                title: project.title, 
                                startDate: project.start_date, 
                                endDate: project.end_date
                            }} 
                            className="icon"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                </svg>
                            </Link>
                        </td>
                        <td>
                            <Link to='#' onClick={() => {handleDeleteProject(project.id, project.user_id)}} className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" height="30" width="30" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                </svg>
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ToastContainer>

            </ToastContainer>
        </div>
    )
}

export default ProjectsList;

