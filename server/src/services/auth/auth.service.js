import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../../models/user.model.js";
import sendEmail from "../../utils/sendEmail.js";

/* =========================================================
   COMMON HELPERS
========================================================= */

const createError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

/* =========================================================
   OTP
========================================================= */

const generateOTP = () => {
    return crypto
        .randomInt(100000, 1000000)
        .toString();
};

/* =========================================================
   ADMIN SECRET CHECK
========================================================= */

const isValidAdminSecret = (providedSecret) => {
    const expectedSecret = process.env.ADMIN_SECRET_KEY;

    if (!providedSecret || !expectedSecret) {
        return false;
    }

    const providedBuffer = Buffer.from(providedSecret);
    const expectedBuffer = Buffer.from(expectedSecret);

    if (providedBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        providedBuffer,
        expectedBuffer
    );
};

/* =========================================================
   EMAIL HELPERS
========================================================= */

const sendVerificationOTP = async(email, otp) => {
    return sendEmail({
        to: email,
        subject: "Verify Your Portfolio Builder Account",
        html: `
            <div style="
                font-family: Arial, sans-serif;
                background:#07111f;
                color:#ffffff;
                padding:40px;
                max-width:600px;
                margin:auto;
                border-radius:16px;
            ">
                <h2 style="
                    color:#22d3ee;
                    margin-bottom:20px;
                ">
                    Portfolio Builder
                </h2>

                <p style="font-size:16px;">
                    Your email verification OTP is:
                </p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    color:#22d3ee;
                    background:#0f1d30;
                    padding:18px;
                    text-align:center;
                    border-radius:12px;
                    margin:25px 0;
                ">
                    ${otp}
                </div>

                <p style="color:#cbd5e1;">
                    This OTP is valid for 10 minutes.
                </p>

                <p style="
                    color:#64748b;
                    font-size:13px;
                    margin-top:30px;
                ">
                    If you did not create this account, you can safely ignore this email.
                </p>
            </div>
        `
    });
};

const sendPasswordResetOTP = async(email, otp) => {
    return sendEmail({
        to: email,
        subject: "Portfolio Builder Password Reset OTP",
        html: `
            <div style="
                font-family: Arial, sans-serif;
                background:#07111f;
                color:#ffffff;
                padding:40px;
                max-width:600px;
                margin:auto;
                border-radius:16px;
            ">
                <h2 style="
                    color:#22d3ee;
                    margin-bottom:20px;
                ">
                    Portfolio Builder
                </h2>

                <p style="font-size:16px;">
                    Use the OTP below to reset your password:
                </p>

                <div style="
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    color:#22d3ee;
                    background:#0f1d30;
                    padding:18px;
                    text-align:center;
                    border-radius:12px;
                    margin:25px 0;
                ">
                    ${otp}
                </div>

                <p style="color:#cbd5e1;">
                    This OTP is valid for 10 minutes.
                </p>

                <p style="
                    color:#64748b;
                    font-size:13px;
                    margin-top:30px;
                ">
                    If you did not request a password reset, ignore this email.
                </p>
            </div>
        `
    });
};

/* =========================================================
   TOKEN HELPERS
========================================================= */

const generateAccessToken = (user) => {
    return jwt.sign({
            userId: user._id.toString(),
            role: user.role
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || "1d"
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign({
            userId: user._id.toString(),
            role: user.role
        },
        process.env.JWT_SECRET, {
            expiresIn: "7d"
        }
    );
};

/* =========================================================
   SAFE USER RESPONSE
========================================================= */

const getSafeUser = (user) => {
    return {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive
    };
};

/* =========================================================
   REGISTER USER
========================================================= */

const registerUser = async({
    name,
    email,
    password
}) => {
    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        throw createError(
            "User already exists with this email",
            409
        );
    }

    const hashedPassword = await bcrypt.hash(
        password,
        12
    );

    const otp = generateOTP();

    const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user",
        isEmailVerified: false,
        emailVerificationOTP: otp,
        emailVerificationOTPExpire: new Date(Date.now() + 10 * 60 * 1000),
        isActive: true
    });

    try {
        await sendVerificationOTP(
            normalizedEmail,
            otp
        );
    } catch (error) {
        console.error(
            "Verification email failed:",
            error.message
        );

        // Keep account so resend verification can still work.
        // Do not expose SMTP details to client.
        throw createError(
            "Account created but verification email could not be sent. Please resend OTP.",
            500
        );
    }

    return {
        message: "Registration successful. Please verify your email.",
        user: getSafeUser(user)
    };
};

/* =========================================================
   REGISTER ADMIN
========================================================= */

const registerAdmin = async({
    name,
    email,
    password,
    adminSecretKey
}) => {
    if (!process.env.ADMIN_SECRET_KEY) {
        throw createError(
            "Admin secret key is not configured on server",
            500
        );
    }

    if (!isValidAdminSecret(adminSecretKey)) {
        throw createError(
            "Invalid admin secret key",
            401
        );
    }

    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        throw createError(
            "User already exists with this email",
            409
        );
    }

    const existingAdmin = await User.findOne({
        role: "admin"
    });

    if (existingAdmin) {
        throw createError(
            "Admin account already exists",
            409
        );
    }

    const hashedPassword = await bcrypt.hash(
        password,
        12
    );

    const otp = generateOTP();

    const admin = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "admin",
        isEmailVerified: false,
        emailVerificationOTP: otp,
        emailVerificationOTPExpire: new Date(Date.now() + 10 * 60 * 1000),
        isActive: true
    });

    try {
        await sendVerificationOTP(
            normalizedEmail,
            otp
        );
    } catch (error) {
        console.error(
            "Admin verification email failed:",
            error.message
        );

        throw createError(
            "Admin account created but verification email could not be sent. Please resend OTP.",
            500
        );
    }

    return {
        message: "Admin registration successful. Please verify your email.",
        user: getSafeUser(admin)
    };
};

/* =========================================================
   VERIFY EMAIL
========================================================= */

const verifyEmail = async({
    email,
    otp
}) => {
    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        throw createError(
            "User not found",
            404
        );
    }

    if (user.isEmailVerified) {
        throw createError(
            "Email is already verified",
            400
        );
    }

    if (!user.emailVerificationOTP) {
        throw createError(
            "No verification OTP found. Please request a new OTP.",
            400
        );
    }

    if (!user.emailVerificationOTPExpire ||
        user.emailVerificationOTPExpire < new Date()
    ) {
        throw createError(
            "OTP has expired. Please request a new OTP.",
            400
        );
    }

    if (
        user.emailVerificationOTP !==
        otp
    ) {
        throw createError(
            "Invalid OTP",
            400
        );
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = null;
    user.emailVerificationOTPExpire = null;

    await user.save();

    return {
        message: "Email verified successfully.",
        user: getSafeUser(user)
    };
};

/* =========================================================
   RESEND VERIFICATION OTP
========================================================= */

const resendVerificationOTP = async(
    email
) => {
    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        throw createError(
            "User not found",
            404
        );
    }

    if (user.isEmailVerified) {
        throw createError(
            "Email is already verified",
            400
        );
    }

    const otp = generateOTP();

    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpire =
        new Date(
            Date.now() + 10 * 60 * 1000
        );

    await user.save();

    await sendVerificationOTP(
        normalizedEmail,
        otp
    );

    return {
        message: "Verification OTP sent successfully."
    };
};

/* =========================================================
   USER LOGIN
========================================================= */

const loginUser = async({
    email,
    password
}) => {
    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail,
        role: "user"
    });

    if (!user) {
        throw createError(
            "Invalid email or password",
            401
        );
    }

    if (!user.isActive) {
        throw createError(
            "Your account has been deactivated",
            403
        );
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordValid) {
        throw createError(
            "Invalid email or password",
            401
        );
    }

    /*
       User registered but did not verify email.
       Generate fresh OTP and ask frontend to verify.
    */

    if (!user.isEmailVerified) {
        const otp = generateOTP();

        user.emailVerificationOTP = otp;
        user.emailVerificationOTPExpire =
            new Date(
                Date.now() + 10 * 60 * 1000
            );

        await user.save();

        try {
            await sendVerificationOTP(
                normalizedEmail,
                otp
            );
        } catch (error) {
            console.error(
                "Login verification email failed:",
                error.message
            );
        }

        return {
            requiresEmailVerification: true,
            email: normalizedEmail
        };
    }

    const accessToken =
        generateAccessToken(user);

    const refreshToken =
        generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save();

    return {
        message: "Login successful.",
        user: getSafeUser(user),
        accessToken,
        refreshToken
    };
};

/* =========================================================
   ADMIN LOGIN
========================================================= */

const loginAdmin = async({
    email,
    password,
    adminSecretKey
}) => {
    if (!process.env.ADMIN_SECRET_KEY) {
        throw createError(
            "Admin secret key is not configured on server",
            500
        );
    }

    if (!isValidAdminSecret(adminSecretKey)) {
        throw createError(
            "Invalid admin secret key",
            401
        );
    }

    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const admin = await User.findOne({
        email: normalizedEmail,
        role: "admin"
    });

    if (!admin) {
        throw createError(
            "Invalid admin credentials",
            401
        );
    }

    if (!admin.isActive) {
        throw createError(
            "Admin account is deactivated",
            403
        );
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            admin.password
        );

    if (!isPasswordValid) {
        throw createError(
            "Invalid admin credentials",
            401
        );
    }

    /*
       Admin is registered but email is not verified.
    */

    if (!admin.isEmailVerified) {
        const otp = generateOTP();

        admin.emailVerificationOTP = otp;
        admin.emailVerificationOTPExpire =
            new Date(
                Date.now() + 10 * 60 * 1000
            );

        await admin.save();

        try {
            await sendVerificationOTP(
                normalizedEmail,
                otp
            );
        } catch (error) {
            console.error(
                "Admin login verification email failed:",
                error.message
            );
        }

        return {
            requiresEmailVerification: true,
            email: normalizedEmail
        };
    }

    const accessToken =
        generateAccessToken(admin);

    const refreshToken =
        generateRefreshToken(admin);

    admin.refreshToken = refreshToken;

    await admin.save();

    return {
        message: "Admin login successful.",
        user: getSafeUser(admin),
        accessToken,
        refreshToken
    };
};

/* =========================================================
   REFRESH ACCESS TOKEN
========================================================= */

const refreshAccessToken = async(
    refreshToken
) => {
    if (!refreshToken) {
        throw createError(
            "Refresh token missing",
            401
        );
    }

    let decoded;

    try {
        decoded = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET
        );
    } catch (error) {
        throw createError(
            "Invalid or expired refresh token",
            401
        );
    }

    const user = await User.findById(
        decoded.userId
    );

    if (!user) {
        throw createError(
            "User not found",
            401
        );
    }

    if (!user.isActive) {
        throw createError(
            "Your account has been deactivated",
            403
        );
    }

    if (!user.refreshToken) {
        throw createError(
            "Refresh session not found",
            401
        );
    }

    if (
        user.refreshToken !==
        refreshToken
    ) {
        throw createError(
            "Invalid refresh token",
            401
        );
    }

    const accessToken =
        generateAccessToken(user);

    return {
        accessToken,
        user: getSafeUser(user)
    };
};

/* =========================================================
   LOGOUT
========================================================= */

const logoutUser = async(
    refreshToken
) => {
    if (!refreshToken) {
        return {
            message: "Logged out successfully."
        };
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET
        );

        await User.findByIdAndUpdate(
            decoded.userId, {
                $set: {
                    refreshToken: null
                }
            }
        );
    } catch (error) {
        /*
           Even if token is already invalid/expired,
           logout should still succeed on frontend.
        */
        console.log(
            "Logout token cleanup skipped:",
            error.message
        );
    }

    return {
        message: "Logged out successfully."
    };
};

/* =========================================================
   FORGOT PASSWORD
========================================================= */

const forgotPassword = async(
    email
) => {
    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        throw createError(
            "No account found with this email",
            404
        );
    }

    if (!user.isActive) {
        throw createError(
            "Your account has been deactivated",
            403
        );
    }

    const otp = generateOTP();

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpire =
        new Date(
            Date.now() + 10 * 60 * 1000
        );

    await user.save();

    await sendPasswordResetOTP(
        normalizedEmail,
        otp
    );

    return {
        message: "Password reset OTP sent successfully."
    };
};

/* =========================================================
   RESET PASSWORD
========================================================= */

const resetPassword = async({
    email,
    otp,
    newPassword
}) => {
    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail
    });

    if (!user) {
        throw createError(
            "User not found",
            404
        );
    }

    if (!user.resetPasswordOTP) {
        throw createError(
            "No password reset OTP found",
            400
        );
    }

    if (!user.resetPasswordOTPExpire ||
        user.resetPasswordOTPExpire < new Date()
    ) {
        throw createError(
            "OTP has expired. Please request a new one.",
            400
        );
    }

    if (
        user.resetPasswordOTP !==
        otp
    ) {
        throw createError(
            "Invalid OTP",
            400
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            12
        );

    user.password = hashedPassword;

    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpire = null;

    /*
       Force all existing sessions to logout
       after password reset.
    */
    user.refreshToken = null;

    await user.save();

    return {
        message: "Password reset successfully. Please login again."
    };
};

/* =========================================================
   CHANGE PASSWORD
========================================================= */

const changePassword = async({
    userId,
    currentPassword,
    newPassword
}) => {
    const user = await User.findById(
        userId
    );

    if (!user) {
        throw createError(
            "User not found",
            404
        );
    }

    if (!user.isActive) {
        throw createError(
            "Your account has been deactivated",
            403
        );
    }

    const isCurrentPasswordValid =
        await bcrypt.compare(
            currentPassword,
            user.password
        );

    if (!isCurrentPasswordValid) {
        throw createError(
            "Current password is incorrect",
            401
        );
    }

    if (
        currentPassword === newPassword
    ) {
        throw createError(
            "New password must be different from current password",
            400
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            12
        );

    user.password = hashedPassword;

    /*
       Invalidate old refresh session
       after password change.
    */
    user.refreshToken = null;

    await user.save();

    return {
        message: "Password changed successfully. Please login again."
    };
};

/* =========================================================
   EXPORTS
========================================================= */

export {
    registerUser,
    registerAdmin,
    verifyEmail,
    resendVerificationOTP,
    loginUser,
    loginAdmin,
    refreshAccessToken,
    logoutUser,
    forgotPassword,
    resetPassword,
    changePassword
};