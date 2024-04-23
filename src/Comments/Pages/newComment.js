import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../shared/context/authContext";
import { useNavigate, useParams } from "react-router-dom";

const NewComment = () => {
    const {pid, tid} = useParams();
    const [description, setDescription] = useState('');

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const token  = auth.token;

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    const handleValidation = () => {
        if(auth.name === "") {
            toast.error("Commenter name can't be blank", toastOptions);
            return false;
        }
        if(description === "") {
            toast.error("Comment description can't be blank", toastOptions);
            return false;
        }
        return true;
    }

    const newCommentHandler = async (event) => {
        event.preventDefault();

        if(handleValidation()) {
            try {
                const response = await fetch(`http://localhost:5001/api/projects/${pid}/tasks/${tid}/comments/new`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: auth.name, description})
                });

                const data = await response.json();
                console.log(data)
                    
                if(!response.ok) {
                    console.log(data.error);
                    toast.error(data.error, toastOptions);
                } else {
                    toast.success(data.message, toastOptions);
                    setTimeout(() => {
                        navigate(-1);
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
            </nav>
            <div className='container'>
                <h2>Add a comment</h2>
                <form onSubmit={newCommentHandler}>
                <label htmlFor="commenter">Commenter</label>
                    <input 
                        type="text" 
                        id="commenter" 
                        value={auth.name} 
                        disabled={true}
                    />
                    <br/><br/>

                    <label htmlFor="commentDescription">Description</label>
                    <input 
                        type="text" 
                        id="commentDescription" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        
                    />
                    <br/><br/>

                    <button type="submit" className="submit-btn">Create Comment</button>
                    <br/><br/>
                </form>
                <ToastContainer>

                </ToastContainer>
            </div>
        </React.Fragment>
    )
}

export default NewComment;