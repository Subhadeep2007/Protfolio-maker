import {
    useState
} from "react";

import {
    useLocation,
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
    resetPassword
} from "../../api/auth.api";


const ResetPassword = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    const email =
        location.state?.email || "";


    const [form, setForm] = useState({
        otp: "",
        newPassword: "",
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


        if (!email) {

            setError(
                "Email is missing."
            );

            return;
        }


        if (
            !form.otp ||
            !form.newPassword
        ) {

            setError(
                "Please fill all required fields."
            );

            return;
        }


        if (
            form.newPassword !==
            form.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            await resetPassword({
                email,
                otp: form.otp,
                newPassword:
                    form.newPassword
            });


            navigate(
                "/login",
                {
                    replace: true
                }
            );

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Password reset failed."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <AuthLayout
            title="Reset password"
            subtitle={`Reset password for ${email}`}
        >

            <AuthCard>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <AuthInput
                        label="OTP"
                        name="otp"
                        value={form.otp}
                        onChange={handleChange}
                        placeholder="Enter OTP"
                    />


                    <AuthInput
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={form.newPassword}
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
                        Reset Password
                    </AuthButton>

                </form>

            </AuthCard>

        </AuthLayout>
    );
};


export default ResetPassword;