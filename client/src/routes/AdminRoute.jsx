import {
    Navigate,
    Outlet
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


const AdminRoute = () => {

    const {
        loading,
        isAuthenticated,
        isAdmin
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
                to="/admin/login"
                replace
            />
        );
    }


    if (!isAdmin) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }


    return <Outlet />;
};


export default AdminRoute;