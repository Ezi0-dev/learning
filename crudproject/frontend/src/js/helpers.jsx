import { useAuth } from "./authContext"
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { user, loading, accessToken } = useAuth()

    if (loading) return <LoadingSpinner />;

    if (!accessToken || !user) {
        return <Navigate to="/login" state={{ error: 'You need to be logged in to access the dashboard!' }} replace />;
    }

    return children
}