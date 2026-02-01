import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate()

    return (
        <div>
            <div className="homepage-container">
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
            <button onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button onClick={() => navigate('/home')}>Home</button>
            </div>
        </div>
    );
}