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
    registerUser
} from "../../api/auth.api";


const Register = () => {

    const navigate =
        useNavigate();


    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
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
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password
        ) {

            setError(
                "Please fill all required fields."
            );

            return;
        }


        if (
            form.password !==
            form.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            await registerUser({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password
            });


            navigate(
                "/verify-email",
                {
                    state: {
                        email: form.email.trim()
                    }
                }
            );

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <AuthLayout
            title="Create your portfolio"
            subtitle="Start building your professional presence."
        >

            <AuthCard>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <AuthInput
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                    />

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
                    />

                    <AuthInput
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        error={error}
                    />

                    <AuthButton
                        type="submit"
                        loading={loading}
                    >
                        Create Account
                    </AuthButton>

                </form>


                <p className="mt-6 text-center text-sm text-slate-400">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-cyan-400 hover:text-cyan-300"
                    >
                        Login
                    </Link>

                </p>

            </AuthCard>

        </AuthLayout>
    );
};


export default Register;