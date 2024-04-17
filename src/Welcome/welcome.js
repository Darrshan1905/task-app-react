import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
    return(
        <React.Fragment>
            <nav className="nav-bar">
                <h1 class="project-heading">Task Management System</h1>
            </nav>
            <div className="container">
                <h3>Welcome to the task management system. Here you can create projects and have many tasks within a project. The tasks can be created, updated, deleted and listed.</h3>
                <div class="home-div">
                    <Link to = '/projects'>
                        Projects List
                    </Link>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Welcome;