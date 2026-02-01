import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate()

    return (
        <>
            <h1>This is the home page! :D</h1>
        </>
        );
}