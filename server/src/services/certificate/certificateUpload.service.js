import cloudinary from "../../config/cloudinary.js";
import { randomUUID } from "node:crypto";
import path from "node:path";


// ========================================
// UPLOAD CERTIFICATE FILE
// ========================================

const uploadCertificateFile = (
    file
) => {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            if (!file) {
                reject(
                    new Error(
                        "No certificate file received"
                    )
                );

                return;
            }


            // Cloudinary raw assets need the file extension in their public ID.
            // Without it, generated URLs often have no extension and browsers
            // cannot identify PDFs or other downloadable files correctly.
            const originalName =
                path.basename(file.originalname || "certificate-file");
            const extension =
                path.extname(originalName).toLowerCase();
            const fileStem =
                path.basename(originalName, path.extname(originalName))
                    .normalize("NFKD")
                    .replace(/[^a-zA-Z0-9_-]+/g, "-")
                    .replace(/^-+|-+$/g, "") || "certificate";

            const uploadStream =
                cloudinary.uploader.upload_stream({
                        folder: "portfolio/certificates",
                        resource_type: "raw",
                        public_id: `${fileStem}-${randomUUID()}${extension}`,
                        use_filename: true,
                        unique_filename: false,
                        overwrite: false
                    },
                    (
                        error,
                        result
                    ) => {

                        if (error) {
                            reject(error);

                            return;
                        }

                        if (!result) {
                            reject(
                                new Error(
                                    "Cloudinary upload failed"
                                )
                            );

                            return;
                        }

                        resolve(result);
                    }
                );


            uploadStream.end(
                file.buffer
            );
        }
    );
};


export default uploadCertificateFile;
