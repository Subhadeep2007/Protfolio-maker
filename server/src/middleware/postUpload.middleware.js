import multer from "multer";


// ========================================
// MEMORY STORAGE
// ========================================

const storage =
    multer.memoryStorage();


// ========================================
// ALLOW ALL FILE TYPES
// ========================================

const fileFilter = (
    req,
    file,
    callback
) => {

    /*
     * Allow every file type.
     *
     * Image
     * Video
     * PDF
     * DOC
     * DOCX
     * ZIP
     * TXT
     * etc.
     */

    callback(
        null,
        true
    );
};


// ========================================
// MULTER UPLOAD
// ========================================

const postUpload =
    multer({

        storage,

        fileFilter,

        limits: {
            fileSize: 50 * 1024 * 1024
        }

    });


export default postUpload;