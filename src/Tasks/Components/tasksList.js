import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CommentsList from "../../Comments/Components/commentsList";
import { AuthContext } from "../../shared/context/authContext";

const TasksList = ({projectId, projectOwnerId, tasks, setIsUpdated, isSearched}) => {
    const auth = useContext(AuthContext);

    const token = auth.token;

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    const handleDeleteTask = async (taskId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");

        if (!confirmDelete) {
            return; 
        }
        try {
            const response = await fetch(`http://localhost:5001/api/projects/${projectId}/tasks/${taskId}`,{
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
                toast.success('Task deleted successfully', toastOptions);
                setIsUpdated((prev) => !prev);
            }
        } catch(err) {

        }
    }

    return (
        <div className='tasks-container'>
            {!isSearched ? <h2> List of all tasks </h2> : <h2> List of tasks matching the search query </h2>}
            {tasks.map(task => (
                <div key={task.id}>
                    <p>
                        <strong className='title'>Task Name: &nbsp;</strong>
                        <span className='name incr'>{task.name}</span>
                    </p>
                    <p>
                        <strong className='title'>Task Duration: &nbsp;</strong>
                        {task.duration}
                    </p>
                    <p>
                        <strong className='title'>Task Description: &nbsp;</strong>
                        {task.description}
                    </p>
                    <div className="actions">
                        <Link to={`/projects/${projectId}/tasks/${task.id}/comments/new`} className='right-btn' >Add a comment</Link><br/>
                    </div>
                    <div className="comments-container">
                        <h3 className="name">Comments</h3>
                        <CommentsList projectId={projectId} projectOwnerId={projectOwnerId} taskId={task.id} />
                    </div>
                    {(auth.userId === projectOwnerId || auth.isAdmin) && 
                        
                        <div>
                            <Link 
                            to={`/projects/${projectId}/tasks/${task.id}/edit`} 
                            state={{
                                name: task.name,
                                duration: task.duration,
                                description: task.description
                            }}
                            className='back-link' 
                            >
                                Edit Task
                            </Link>
                            <Link to='#' onClick={() => {handleDeleteTask(task.id)}} className="back-link">Delete Task</Link>
                        </div>
                    }
                    <hr/>
                </div>
            ))}
        </div>
    )
}

export default TasksList;