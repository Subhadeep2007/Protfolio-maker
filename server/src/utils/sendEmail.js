import nodemailer from "nodemailer";


// ========================================
// CHECK EMAIL CONFIG
// ========================================

if (!process.env.EMAIL) {

    console.error(
        "❌ EMAIL environment variable is missing"
    );

}

if (!process.env.PASS) {

    console.error(
        "❌ PASS environment variable is missing"
    );

}


// ========================================
// EMAIL TRANSPORTER
// ========================================

const transporter =
    nodemailer.createTransport({

        service: "gmail",

        auth: {

            user: process.env.EMAIL,

            pass: process.env.PASS

        }

    });


// ========================================
// VERIFY TRANSPORTER
// ========================================

const verifyEmailTransporter =
    async() => {

        try {

            await transporter.verify();

            console.log(
                "✅ Gmail SMTP connected successfully"
            );

        } catch (error) {

            console.error(
                "❌ Gmail SMTP connection failed:",
                error.message
            );

        }

    };


// ========================================
// SEND EMAIL
// ========================================

const sendEmail = async({
    to,
    subject,
    html
}) => {

    if (!process.env.EMAIL) {

        throw new Error(
            "EMAIL environment variable is missing"
        );

    }


    if (!process.env.PASS) {

        throw new Error(
            "PASS environment variable is missing"
        );

    }


    const mailOptions = {

        from: `"Portfolio Builder" <${process.env.EMAIL}>`,

        to,

        subject,

        html

    };


    const info =
        await transporter.sendMail(
            mailOptions
        );


    console.log(
        "✅ Email sent:",
        info.messageId
    );


    return info;

};


export {
    sendEmail,
    verifyEmailTransporter
};


export default sendEmail;