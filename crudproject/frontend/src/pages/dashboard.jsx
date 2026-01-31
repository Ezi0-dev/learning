import { useAuth } from "../js/authContext";

export default function Dashboard() {
    const { user } = useAuth()

    return (
        <>
         <div className="register-container">
            <h1>Hello {user} </h1>

         </div>
        </>
    )
}