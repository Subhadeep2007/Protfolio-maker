import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import AuthLayout
    from "../../layouts/AuthLayout";

import AuthCard
    from "../../components/auth/AuthCard";

import AuthInput
    from "../../components/auth/AuthInput";

import AuthButton
    from "../../components/auth/AuthButton";

import {
    useAuth
} from "../../context/AuthContext";


const Login = () => {

    const navigate =
        useNavigate();

    const {
        loginUser
    } = useAuth();


    const [form, setForm] = useState({
        email: "",
        password: ""
    });


    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleChange = (event) => {

        setForm({
            ...form,
            [event.target.name]:
                event.target.value
        });
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        if (
            !form.email.trim() ||
            !form.password
        ) {

            setError(
                "Email and password are required."
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await loginUser(form);


            if (
                response?.data
                    ?.requiresEmailVerification
            ) {

                navigate(
                    "/verify-email",
                    {
                        state: {
                            email:
                                response.data.email
                        }
                    }
                );

                return;
            }


            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Login to continue building your portfolio."
        >

            <AuthCard>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <AuthInput
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                    />


                    <AuthInput
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        error={error}
                    />


                    <div className="text-right">

                        <Link
                            to="/forgot-password"
                            className="text-sm text-cyan-400 hover:text-cyan-300"
                        >
                            Forgot password?
                        </Link>

                    </div>


                    <AuthButton
                        type="submit"
                        loading={loading}
                    >
                        Login
                    </AuthButton>

                </form>


                <p className="mt-6 text-center text-sm text-slate-400">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="text-cyan-400 hover:text-cyan-300"
                    >
                        Create one
                    </Link>

                </p>

            </AuthCard>

        </AuthLayout>
    );
};


export default Login;