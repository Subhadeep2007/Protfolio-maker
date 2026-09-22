import cloudinary from "../../config/cloudinary.js";

const uploadPortfolioResume = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("No resume received"));
            return;
        }

        const uploadStream = cloudinary.uploader.upload_stream({
                folder: "portfolio/resumes",
                resource_type: "raw",
                use_filename: true,
                unique_filename: true,
                overwrite: false
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!result) {
                    reject(new Error("Resume upload failed"));
                    return;
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    fileName: file.originalname,
                    mimeType: file.mimetype,
                    size: result.bytes || file.size || 0
                });
            }
        );

        uploadStream.end(file.buffer);
    });
};

export default uploadPortfolioResume;