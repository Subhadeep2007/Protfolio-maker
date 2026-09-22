import {
    useState
} from "react";

import {
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
    forgotPassword
} from "../../api/auth.api";


const ForgotPassword = () => {

    const navigate =
        useNavigate();


    const [email, setEmail] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        if (!email.trim()) {

            setError(
                "Email is required."
            );

            return;
        }


        try {

            setLoading(true);

            await forgotPassword(email);


            navigate(
                "/reset-password",
                {
                    state: {
                        email
                    }
                }
            );

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Unable to process request."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <AuthLayout
            title="Forgot password?"
            subtitle="We'll send you an OTP to reset your password."
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
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        placeholder="you@example.com"
                        error={error}
                    />


                    <AuthButton
                        type="submit"
                        loading={loading}
                    >
                        Send OTP
                    </AuthButton>

                </form>

            </AuthCard>

        </AuthLayout>
    );
};


export default ForgotPassword;