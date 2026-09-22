import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    loginUser as loginUserApi,
    loginAdmin as loginAdminApi,
    refreshToken as refreshTokenApi,
    logout as logoutApi
} from "../api/auth.api";

import {
    setAccessToken
} from "../api/axios";


const AuthContext = createContext(null);


export const AuthProvider = ({
    children
}) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] =
        useState(true);


    // ==================================
    // RESTORE LOGIN
    // ==================================

    const restoreSession = async () => {

        try {

            const response =
                await refreshTokenApi();

            const token =
                response?.data?.accessToken;

            if (token) {

                setAccessToken(token);

                setUser(
                    response?.data?.user || null
                );
            }

        } catch (error) {

            setAccessToken(null);
            setUser(null);

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        restoreSession();

    }, []);


    // ==================================
    // USER LOGIN
    // ==================================

    const loginUser = async (data) => {

        const response =
            await loginUserApi(data);

        if (
            response?.data
                ?.requiresEmailVerification
        ) {

            return response;
        }

        const token =
            response?.data?.accessToken;

        if (token) {

            setAccessToken(token);

            setUser(
                response?.data?.user
            );
        }

        return response;
    };


    // ==================================
    // ADMIN LOGIN
    // ==================================

    const loginAdmin = async (data) => {

        const response =
            await loginAdminApi(data);

        if (
            response?.data
                ?.requiresEmailVerification
        ) {

            return response;
        }

        const token =
            response?.data?.accessToken;

        if (token) {

            setAccessToken(token);

            setUser(
                response?.data?.user
            );
        }

        return response;
    };


    // ==================================
    // LOGOUT
    // ==================================

    const logout = async () => {

        try {

            await logoutApi();

        } finally {

            setAccessToken(null);

            setUser(null);
        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loginUser,
                loginAdmin,
                logout,
                isAuthenticated: !!user,
                isAdmin:
                    user?.role === "admin"
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};