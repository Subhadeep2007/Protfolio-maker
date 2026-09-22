import "dotenv/config";

import app from "./app.js";

import connectDB
from "./src/config/db.js";


const PORT =
    process.env.PORT || 8080;


console.log(
    "ADMIN_SECRET_KEY loaded:",
    process.env.ADMIN_SECRET_KEY ?
    "YES" :
    "NO"
);


// ========================================
// START SERVER
// ========================================

const startServer = async() => {

    try {

        await connectDB();

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running on port ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);

    }

};


startServer();