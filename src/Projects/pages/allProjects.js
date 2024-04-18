import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/context/authContext";
import SearchProject from "../components/searchProject";
import ProjectsList from "../components/projectsList";


const AllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearched, setIsSearched] = useState(false);

    const auth = useContext(AuthContext);

    const fetchProjects = async () => {
        const token = process.env.REACT_APP_TOKEN;
        
        try {
            const response = await fetch("http://localhost:5001/api/projects", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
        
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSearch = (results) => {
        setSearchResults(results);
    }   

    return (
        <React.Fragment>
            <nav className="nav-bar">
                <h1 className="project-heading">Task Management System</h1>
                <div>
                    {auth.isLoggedIn && (
                        <Link to = '/projects/new' className="nav-btn">
                            Create a new Project
                        </Link>
                    )}
                    {auth.isLoggedIn && (
                        <Link to = '/profile' className="nav-btn">
                            Profile
                        </Link>
                    )}
                    {auth.isLoggedIn && (
                        <button onClick={auth.logout} className='nav-btn logout-btn' >
                            Logout
                        </button>  
                    )}             
                </div>
            </nav>
            <div className="welcome-msg">
                <h2 className="welcome-heading">Welcome <span className="welcome-name">guest</span> !</h2>
            </div>
            <SearchProject onSearch={handleSearch} setSearchedToTrue={setIsSearched}/>
            {!isSearched ? (
                projects.length > 0 ? (
                    <ProjectsList projects={projects}/>
                ) : (
                    <div className='tasks-container no-task'>
                        <h2>No projects yet!</h2>
                    </div>
                )
            ) : (
                searchResults.length > 0 ? (
                    <ProjectsList projects={searchResults} />
                ) : (
                    <div className='tasks-container no-task'>
                        <h2>No projects match the search query!</h2>
                    </div>
                )
            )}
        </React.Fragment>
    )
}

export default AllProjects