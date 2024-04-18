import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../shared/context/authContext";

const Welcome = () => {
    const auth = useContext(AuthContext);
    return(
        <React.Fragment>
            <nav className="nav-bar">
                <h1 className="project-heading">Task Management System</h1>
                <div>
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
                    {!auth.isLoggedIn && (
                        <Link to="/signup" className='nav-btn' >
                            Signup
                        </Link>
                    )}
                    {!auth.isLoggedIn && (
                        <Link to="/login" className='nav-btn'>
                            Login    
                        </Link>
                    )}             
                </div>
            </nav>
            <div className="container">
                <h3>Welcome to the task management system. Here you can create projects and have many tasks within a project. The tasks can be created, updated, deleted and listed.</h3>
                <div className="home-div">
                    <Link to = '/projects'>
                        Projects List
                    </Link>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Welcome;