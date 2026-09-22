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
    verifyEmail,
    resendVerificationOTP
} from "../../api/auth.api";


const VerifyEmail = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    const email =
        location.state?.email || "";


    const [otp, setOtp] =
        useState("");

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [resending, setResending] =
        useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");


        if (!email) {

            setError(
                "Email is missing. Please register or login again."
            );

            return;
        }


        if (!otp.trim()) {

            setError(
                "Please enter the OTP."
            );

            return;
        }


        if (!/^\d{6}$/.test(otp)) {

            setError(
                "OTP must contain 6 digits."
            );

            return;
        }


        try {

            setLoading(true);

            await verifyEmail({
                email,
                otp
            });


            navigate(
                location.state?.admin
                    ? "/admin/login"
                    : "/login",
                {
                    replace: true
                }
            );

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Verification failed."
            );

        } finally {

            setLoading(false);
        }
    };


    const handleResend = async () => {

        setError("");
        setMessage("");


        try {

            setResending(true);

            await resendVerificationOTP(
                email
            );

            setMessage(
                "A new OTP has been sent."
            );

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Unable to resend OTP."
            );

        } finally {

            setResending(false);
        }
    };


    return (
        <AuthLayout
            title="Verify your email"
            subtitle={`Enter the OTP sent to ${email}`}
        >

            <AuthCard>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <AuthInput
                        label="Verification OTP"
                        name="otp"
                        type="text"
                        value={otp}
                        onChange={(event) =>
                            setOtp(
                                event.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6)
                            )
                        }
                        placeholder="Enter 6-digit OTP"
                        error={error}
                        autoComplete="one-time-code"
                    />


                    {message && (
                        <p className="text-sm text-emerald-400">
                            {message}
                        </p>
                    )}


                    <AuthButton
                        type="submit"
                        loading={loading}
                    >
                        Verify Email
                    </AuthButton>


                    <button
                        type="button"
                        disabled={resending}
                        onClick={handleResend}
                        className="w-full text-sm text-cyan-400 transition hover:text-cyan-300 disabled:opacity-50"
                    >
                        {resending
                            ? "Sending..."
                            : "Resend OTP"}
                    </button>

                </form>

            </AuthCard>

        </AuthLayout>
    );
};


export default VerifyEmail;