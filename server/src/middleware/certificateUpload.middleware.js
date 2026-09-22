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
     * All file types are allowed.
     *
     * PDF
     * JPG
     * PNG
     * WEBP
     * DOC
     * DOCX
     * TXT
     * ZIP
     * etc.
     */

    callback(null, true);
};


// ========================================
// MULTER
// ========================================

const certificateUpload =
    multer({
        storage,

        fileFilter,

        limits: {
            fileSize: 10 * 1024 * 1024
        }
    });


export default certificateUpload;