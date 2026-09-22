import cloudinary from "../../config/cloudinary.js";


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


            const uploadStream =
                cloudinary.uploader.upload_stream({
                        folder: "portfolio/certificates",
                        resource_type: "raw"
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