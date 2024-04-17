import React, {useState} from "react";

const SearchProject = ({onSearch, setSearchedToTrue}) => {
    const [searchQuery, setSearchQuery] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(searchQuery);

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJEYXJyc2hhbiBUIEciLCJlbWFpbCI6ImRhcnJzaGFuMTkwNUBnbWFpbC5jb20iLCJpZCI6Miwicm9sZSI6Im5vcm1hbCB1c2VyIn0sImlhdCI6MTcxMzM2MzY1OCwiZXhwIjoxNzEzMzY3MjU4fQ.9630zy20xUYScC1ysvFRubncnEowFxwiz2z_dBTh8wM"

        let searchResults;
        await fetch(`http://localhost:5001/api/projects/search?key=${searchQuery}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            return res.json()
        }).then(data => {
            searchResults = data;
            console.log(data)
        }).catch(err => {
            console.log(err);
        })

        onSearch(searchResults)
        setSearchedToTrue(true)
    }
    
    return (
        <form role="search" onSubmit={submitHandler}>
            <div className="search">
                <input 
                    className="input-control" 
                    type="search" 
                    name="key" 
                    placeholder="Search for a project" 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    style={{paddingRight: '40px'}}
                />
                <button className="search-btn" type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#4db5ff" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                </button>
            </div>
        </form>
    )
}

export default SearchProject;