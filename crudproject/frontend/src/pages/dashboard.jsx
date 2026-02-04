import { useAuth } from "../js/authContext";
import { useState } from "react";
import api from "../js/api";

export default function Dashboard() {
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
 
    async function createNote(e) {
        e.preventDefault()

        try {
            await api.createNote(user, title, content)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
         <div className="dashboard-container">
            <h1>Hello {user} </h1>
            <form id="createNoteForm" onSubmit={createNote}>
                <input 
                id="title" 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}></input>

                <input 
                id="content" 
                type="text" 
                value={content}
                onChange={(e) => setContent(e.target.value)}></input>

                <input type='submit' value="Create Note"/>
            </form>
         </div>
        </>
    )
}