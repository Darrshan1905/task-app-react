import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../shared/context/authContext";
import SearchTasks from "../../Tasks/Components/searchTasks";
import TasksList from "../../Tasks/Components/tasksList";

const ShowProject = () => {
    const {pid} = useParams();

    const [projectInfo, setProjectInfo] = useState({});
    const [tasks, setTasks] = useState([])
    const [searchResults, setSearchResults] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [isUpdated ,setIsUpdated] = useState(false);

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

    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };

    const formatDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
    };

    const fetchProjectInfo = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/projects/${pid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log(data);

            if(!response.ok) {
                console.error(data.error);
                toast.error(data.error, toastOptions);
            } else {
                setProjectInfo(data)
            }

        } catch(err) {

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid, token, isUpdated])

    const fetchTasks = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/projects/${pid}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.error);
                toast.error(data.error, toastOptions);
            } else {
                setTasks(data);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid, token, isUpdated])

    const fetchProjectInfoAndTasks = useCallback(async () => {
        await fetchProjectInfo();
        await fetchTasks()
    },[fetchProjectInfo, fetchTasks])
    
    useEffect(() => {
        fetchProjectInfoAndTasks();
    },[fetchProjectInfoAndTasks])

    const handleSearch = (results) => {
        setSearchResults(results);
    }

    const handleDeleteProject = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");

        if (!confirmDelete) {
            return; 
        }
        try {
            const response = await fetch(`http://localhost:5001/api/projects/${projectInfo.id}`,{
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json();

            if(!response.ok) {
                console.log(data.error);
                toast.error(data.error, toastOptions);
            } else {
                toast.success('Project deleted successfully', toastOptions);
                setTimeout(() => {
                    navigate('/projects')
                }, 2000);
            }
        } catch(err) {

        }
    }

    return (
        <React.Fragment>
            <nav className="nav-bar">
                <h1 className="project-heading">Task Management System</h1>
                <div>
                    {(auth.userId === projectInfo.user_id || auth.isAdmin) && 
                        <Link 
                        to = {`/projects/${pid}/tasks/new`}  
                        className="nav-btn"
                        >
                            Add a task
                        </Link>
                    }
                    {(auth.userId === projectInfo.user_id || auth.isAdmin) && 
                        <Link 
                        to = {`/projects/${pid}/edit`}  
                        state={{
                                id: projectInfo.id,
                                title: projectInfo.title, 
                                startDate: projectInfo.start_date, 
                                endDate: projectInfo.end_date
                            }} 
                        className="nav-btn"
                        >
                            Edit Project
                        </Link>
                    }
                    {(auth.userId === projectInfo.user_id || auth.isAdmin) &&
                        <Link 
                        to = '#' 
                        onClick={() => handleDeleteProject()}
                        className="nav-btn"
                        >
                            Delete project
                        </Link>
                    }
                    <Link to="/projects" className="nav-btn">
                        Back to all projects page
                    </Link>
                </div>
            </nav>
             <div className='project-details'> 
                <p>
                    <strong className='title'>Project Title:{' '}</strong>
                    <span className='name incr'>{projectInfo.title}</span>
                </p>

                <p>
                    <strong className='title'>Project Owner:{' '}</strong>
                    <span className='name incr'>{projectInfo.project_owner}</span>
                </p>

                <p>
                    <strong className='title'>Start Date: {' '}</strong>
                    {projectInfo.start_date && formatDate(new Date(projectInfo.start_date).toLocaleString('en-IN', options).substring(0,10))}
                </p>

                <p>
                    <strong className='title'>End Date: {' '}</strong>
                    {projectInfo.end_date && formatDate(new Date(projectInfo.end_date).toLocaleString('en-IN', options).substring(0,10))}
                </p>
            </div>
            <SearchTasks projectId={pid} onSearch={handleSearch} setSearchedToTrue={setIsSearched}></SearchTasks>
            {!isSearched ? 
                (
                    tasks.length > 0 ? (
                        <TasksList projectId={pid} projectOwnerId={projectInfo.user_id} tasks={tasks} setIsUpdated={setIsUpdated} isSearched={isSearched}/>
                    ) : (
                        <div className='tasks-container no-task'>
                            <h2>No tasks yet!</h2>
                        </div>
                    ) 
                ) : (
                    searchResults.length > 0 ? (
                        <TasksList projectId={pid} projectOwnerId={projectInfo.user_id} tasks={searchResults} setIsUpdated={setIsUpdated} isSearched={isSearched}/>
                    ) : (
                        <div className='tasks-container no-task'>
                            <h2>No tasks match the search query!</h2>
                        </div>
                    )
                )   
            }
            <ToastContainer>

            </ToastContainer>
        </React.Fragment>
    )
}

export default ShowProject