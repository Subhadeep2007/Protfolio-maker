import cloudinary
from "../../config/cloudinary.js";

// ========================================
// UPLOAD POST MEDIA
// ========================================

const uploadPostMedia = (
    file
) => {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            // ========================================
            // FILE CHECK
            // ========================================

            if (!file) {

                reject(
                    new Error(
                        "No post media received"
                    )
                );

                return;
            }


            // ========================================
            // MIME TYPE
            // ========================================

            const mimeType =
                file.mimetype || "";

            const originalName =
                (file.originalname || "").toLowerCase();

            const isAudio =
                mimeType.startsWith("audio/") ||
                /\.(mp3|wav|aac|m4a|flac|aiff|ogg|opus|wma)$/.test(originalName);


            // ========================================
            // RESOURCE TYPE
            // ========================================

            let resourceType =
                "raw";

            // Cloudinary serves raw PDFs as attachments. Store PDFs as image
            // assets so browsers can render them in a tab or an iframe.
            if (
                isAudio
            ) {
                // Cloudinary stores audio under its video resource type, but
                // the delivered URL keeps the audio extension for <audio>.
                resourceType = "video";
            }
            else if (
                mimeType === "application/pdf" ||
                originalName.endsWith(".pdf")
            ) {
                resourceType = "image";
            }


            // ========================================
            // IMAGE
            // ========================================

            else if (
                mimeType.startsWith(
                    "image/"
                )
            ) {

                resourceType =
                    "image";
            }


            // ========================================
            // VIDEO
            // ========================================
            else if (
                mimeType.startsWith(
                    "video/"
                )
            ) {

                resourceType =
                    "video";
            }


            // ========================================
            // UPLOAD STREAM
            // ========================================

            const uploadStream =
                cloudinary.uploader.upload_stream(

                    {
                        folder: "portfolio/posts",

                        resource_type: resourceType,

                        use_filename: true,

                        unique_filename: true,

                        overwrite: false
                    },

                    (
                        error,
                        result
                    ) => {

                        // ========================================
                        // CLOUDINARY ERROR
                        // ========================================

                        if (error) {

                            reject(error);

                            return;
                        }


                        // ========================================
                        // RESULT CHECK
                        // ========================================

                        if (!result) {

                            reject(
                                new Error(
                                    "Post media upload failed"
                                )
                            );

                            return;
                        }


                        // ========================================
                        // RESPONSE
                        // ========================================

                        resolve({

                            url: result.secure_url,

                            publicId: result.public_id,

                            resourceType: result.resource_type,

                            format: result.format,

                            originalName: file.originalname,

                            mimeType: file.mimetype,

                            size: result.bytes ||
                                file.size ||
                                0,

                            width: result.width ||
                                null,

                            height: result.height ||
                                null,

                            duration: result.duration ||
                                null

                        });

                    }
                );


            // ========================================
            // SEND BUFFER
            // ========================================

            uploadStream.end(
                file.buffer
            );

        }
    );
};


// ========================================
// EXPORT
// ========================================

export default uploadPostMedia;
