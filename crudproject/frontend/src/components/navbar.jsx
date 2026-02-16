import { useNavigate } from 'react-router-dom';
import { useAuth } from '../js/authContext';
import api from '../js/api';

export default function Navbar() {
    const navigate = useNavigate()
    const { accessToken } = useAuth()

    async function handleLogout() {
        try {
            await api.get('/logout')

            window.location.href = '/login';
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="navbar-container">
            <div className="navbar-left">
                Crud Project :D
            </div>
            <div className="navbar-right">
                <button onClick={() => navigate('/home')}>Home</button>
                <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                {!accessToken && (
                    <>
                        <button onClick={() => navigate('/login')}>Login</button>
                        <button onClick={() => navigate('/register')}>Register</button>
                    </>
                )}
                {accessToken && (
                    <button onClick={handleLogout}>Logout</button>
                )}
            </div>
        </div>
    );
}