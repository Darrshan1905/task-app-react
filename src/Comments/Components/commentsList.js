import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../shared/context/authContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CommentsList = ({projectId, projectOwnerId, taskId}) => {
    const [comments, setComments] = useState([]);
    const [isUpdated, setIsUpdated] = useState(0);

    const auth = useContext(AuthContext);
    const token = auth.token;

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/projects/${projectId}/tasks/${taskId}/comments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                console.error(data.error);
                toast.error(data.error, toastOptions);
            } else {
                setComments(data);
            }
        } catch(err) {

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[projectId, taskId, isUpdated])

    useEffect(() => {
        fetchComments();
    },[fetchComments])

    const handleDeleteComment = async (commentId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this project?");

            if (!confirmDelete) {
                return; 
            }
            const response = await fetch(`http://localhost:5001/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,{
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
                toast.success('Comment deleted successfully', toastOptions);
                setIsUpdated((prev) => !prev);
            }
        } catch(err) {

        }
    }

    console.log(comments)

    return (
        <React.Fragment>
            {comments.map(comment => (
                <div key={comment.id} className="comment-container">
                    <div className="comment">
                        <p>
                            {comment.commenter}:&nbsp;&nbsp;{comment.body}
                        </p>
                    </div>
                    {(comment.user_id === auth.userId || projectOwnerId === auth.userId || auth.isAdmin) &&
                        (
                            <div>
                                <Link to="#" onClick={() => handleDeleteComment(comment.id)} className="icon right-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" height="30" width="30" class="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </Link>
                            </div>
                        )
                    }
                </div>
            ))}

        </React.Fragment>
        
    )
}

export default CommentsList;