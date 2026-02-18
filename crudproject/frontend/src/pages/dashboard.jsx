import { useAuth } from "../js/authContext";
import { useState, useEffect } from "react";
import api from "../js/api";

export default function Dashboard() {
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false)
    const [editingNote, setEditingNote] = useState(null)

    useEffect(() => {
        const getNotes = async() => {
            try {
                const response = await api.get('/notes')
                setNotes(response)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }

        getNotes()
    }, [])

    async function deleteNote(id) {
        console.log(id)
        try {
            await api.delete(`/notes/${id}`)
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
            console.log('Note deleted:', id) // debug
        } catch (err) {
            console.log(err)
        }
    }

    const editNote = (id) => {
        const note = notes.find(n => n.id === id);
        setEditingNote(note);
        setIsOpen(true);
    }

    const saveNote = async () => {
        const { id, title, content } = editingNote

        console.log(editingNote)

        api.put('/notes', { title, content, id })


        setNotes(notes.map(n => 
            n.id === editingNote.id ? editingNote : n
        ));

        setIsOpen(false);
        setEditingNote(null);
    }
 
    async function createNote(e) {
        e.preventDefault()

        try {
            await api.post('/notes', { user, title, content })
            const response = await api.get('/notes');
            setNotes(response);
            setTitle('');
            setContent('');
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
                    <ul>
                        {notes.map(note => (
                            <li key={note.id}>
                                <h3>{note.title}</h3>
                                <p>{note.content}</p>
                                <button onClick={() => deleteNote(note.id)}>Delete</button>
                                <button onClick={() => editNote(note.id)}>Edit</button>
                            </li>
                        ))}
                    </ul>
            </div>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Note</h2>
                        <input
                            type="text"
                            value={editingNote.title}
                            onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                            placeholder="Title"
                        />
                        <textarea
                            value={editingNote.content}
                            onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                            rows={10}
                            placeholder="Content"
                        />
                        <button onClick={saveNote}>Save</button>
                        <button onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
         </div>
        </>
    )
}