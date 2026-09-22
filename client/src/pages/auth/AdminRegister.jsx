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
    registerAdmin
} from "../../api/auth.api";


const AdminRegister = () => {

    const navigate =
        useNavigate();


    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        adminSecretKey: ""
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
            !form.password ||
            !form.confirmPassword ||
            !form.adminSecretKey
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


            await registerAdmin({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                adminSecretKey:
                    form.adminSecretKey
            });


            navigate(
                "/verify-email",
                {
                    state: {
                        email:
                            form.email.trim(),
                        admin: true
                    }
                }
            );

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Admin registration failed."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <AuthLayout
            title="Admin registration"
            subtitle="Create a platform administrator account."
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
                        placeholder="Admin name"
                    />


                    <AuthInput
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="admin@example.com"
                    />


                    <AuthInput
                        label="Admin Secret Key"
                        name="adminSecretKey"
                        type="password"
                        value={form.adminSecretKey}
                        onChange={handleChange}
                        placeholder="Enter admin secret"
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
                        Create Admin
                    </AuthButton>

                </form>


                <p className="mt-6 text-center text-sm text-slate-400">

                    Already an admin?{" "}

                    <Link
                        to="/admin/login"
                        className="text-cyan-400 hover:text-cyan-300"
                    >
                        Admin Login
                    </Link>

                </p>

            </AuthCard>

        </AuthLayout>
    );
};


export default AdminRegister;