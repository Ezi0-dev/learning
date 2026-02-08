import { useAuth } from "../js/authContext";
import { useState, useEffect } from "react";
import api from "../js/api";

export default function Dashboard() {
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [ntoes, setNotes] = useState([])

    useEffect(() => {
    const getNotes = async() => {
        try {
            const response = api.getNotes()

            setNotes(response)
            } catch (err) {
                console.log(err)
            }
        }

        getNotes()
    }, [])
 
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
            <div className="noteform-container">
                <h2>Create a note</h2>
                <form id="createNoteForm" onSubmit={createNote}>
                    <input 
                    id="title" 
                    type="text" 
                    placeholder="Title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}></input>

                    <input 
                    id="content" 
                    type="text"
                    placeholder="Content" 
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}></input>

                    <input type='submit' value="Create Note"/>
                </form>
            </div>
            <div className="notes-container">
                <h2>Notes:</h2>
                <li>

                </li>
            </div>
         </div>
        </>
    )
}