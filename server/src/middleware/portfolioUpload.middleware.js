import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        return callback(
            new Error("Only PDF, DOC and DOCX files are allowed")
        );
    }

    callback(null, true);
};

const portfolioUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

export default portfolioUpload;