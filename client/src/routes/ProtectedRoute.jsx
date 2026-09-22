import {
    Navigate,
    Outlet
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


const ProtectedRoute = () => {

    const {
        loading,
        isAuthenticated
    } = useAuth();


    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
                Loading...
            </div>
        );
    }


    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return <Outlet />;
};


export default ProtectedRoute;