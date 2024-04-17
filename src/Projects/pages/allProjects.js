import React, { useState, useEffect } from "react";
import SearchProject from "../components/searchProject";
import ProjectsList from "../components/projectsList";

const AllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearched, setIsSearched] = useState(false);

    const fetchProjects = async () => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJEYXJyc2hhbiBUIEciLCJlbWFpbCI6ImRhcnJzaGFuMTkwNUBnbWFpbC5jb20iLCJpZCI6Miwicm9sZSI6Im5vcm1hbCB1c2VyIn0sImlhdCI6MTcxMzM2MzY1OCwiZXhwIjoxNzEzMzY3MjU4fQ.9630zy20xUYScC1ysvFRubncnEowFxwiz2z_dBTh8wM"
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
        console.log("123")
        setSearchResults(results);
    }   

    return (
        <React.Fragment>
            <nav className="nav-bar">
                <h1 className="project-heading">Task Management System</h1>
            </nav>
            <div className="welcome-msg">
                <h2 className="welcome-heading">Welcome <span className="welcome-name">guest</span> !</h2>
            </div>
            <SearchProject onSearch={handleSearch} setSearchedToTrue={setIsSearched}/>
            {!isSearched ? (
                <ProjectsList projects={projects}/>
            ) : (
                searchResults.length > 0 ? (
                    <ProjectsList projects={searchResults} />
                ) : (
                    <p>No results match the search query.</p>
                )
            )}
        </React.Fragment>
    )
}

export default AllProjects