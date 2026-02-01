import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate()

    return (
        <div className="navbar-container">
            <div className="navbar-left">
                Crud Project :D
            </div>
            <div className="navbar-right">
                <button onClick={() => navigate('/home')}>Home</button>
                <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/register')}>Register</button>
            </div>
        </div>
    );
}