import {
    useEffect,
    useState
} from "react";

import {
    getMyCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    toggleCertificatePublished,
    uploadCertificateFile
} from "../../../api/certificates.api";


// ========================================
// INITIAL FORM
// ========================================

const initialForm = {
    title: "",
    issuingOrganization: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
    certificateImage: "",
    certificateFileName: "",
    description: "",
    skills: "",
    order: 0,
    isPublished: true
};


// ========================================
// ERROR MESSAGE
// ========================================

function getErrorMessage(error) {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        "Something went wrong"
    );
}


// ========================================
// DATE FORMAT
// ========================================

function formatMonthYear(value) {
    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            year: "numeric"
        }
    );
}


// ========================================
// INPUT DATE
// ========================================

function normalizeDateForInput(value) {
    if (!value) {
        return "";
    }

    return String(value).slice(
        0,
        10
    );
}


// ========================================
// ARRAY
// ========================================

function normalizeArray(value) {
    return Array.isArray(value)
        ? value
        : [];
}


// ========================================
// FILE TYPE
// ========================================

function getFileType(url) {
    if (!url) {
        return "unknown";
    }

    const cleanUrl =
        String(url)
            .split("?")[0]
            .toLowerCase();


    if (
        cleanUrl.endsWith(".pdf")
    ) {
        return "pdf";
    }


    if (
        cleanUrl.endsWith(".jpg") ||
        cleanUrl.endsWith(".jpeg") ||
        cleanUrl.endsWith(".png") ||
        cleanUrl.endsWith(".webp") ||
        cleanUrl.endsWith(".gif")
    ) {
        return "image";
    }


    if (
        cleanUrl.endsWith(".doc") ||
        cleanUrl.endsWith(".docx")
    ) {
        return "document";
    }


    if (
        cleanUrl.endsWith(".zip") ||
        cleanUrl.endsWith(".rar")
    ) {
        return "archive";
    }


    return "file";
}


// ========================================
// FILE ICON
// ========================================

function getFileIcon(type) {
    if (type === "pdf") {
        return "📕";
    }

    if (type === "image") {
        return "🖼️";
    }

    if (type === "document") {
        return "📘";
    }

    if (type === "archive") {
        return "🗜️";
    }

    return "📎";
}


// ========================================
// FORM
// ========================================

function CertificateForm({
    form,
    setForm,
    onSubmit,
    onCancel,
    submitting,
    editing
}) {
    const [
        uploadingFile,
        setUploadingFile
    ] = useState(false);

    const [
        uploadError,
        setUploadError
    ] = useState("");


    // ========================================
    // ESCAPE
    // ========================================

    useEffect(() => {
        function handleKeyDown(event) {

            if (
                event.key === "Escape" &&
                !submitting &&
                !uploadingFile
            ) {
                onCancel();
            }
        }

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        onCancel,
        submitting,
        uploadingFile
    ]);


    // ========================================
    // CHANGE
    // ========================================

    function handleChange(event) {

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        setForm(
            (previous) => ({
                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value
            })
        );
    }


    // ========================================
    // FILE UPLOAD
    // ========================================

    async function handleFileUpload(
        event
    ) {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        setUploadError("");


        // 10MB

        if (
            file.size >
            10 * 1024 * 1024
        ) {

            setUploadError(
                "File size must be less than 10MB."
            );

            event.target.value = "";

            return;
        }


        try {

            setUploadingFile(true);


            const response =
                await uploadCertificateFile(
                    file
                );


            const uploaded =
                response?.data;


            if (
                !uploaded?.url
            ) {
                throw new Error(
                    "File upload failed."
                );
            }


            setForm(
                (previous) => ({
                    ...previous,

                    certificateImage:
                        uploaded.url,

                    certificateFileName:
                        uploaded.fileName ||
                        file.name
                })
            );

        } catch (error) {

            setUploadError(
                getErrorMessage(error)
            );

        } finally {

            setUploadingFile(false);

            event.target.value = "";
        }
    }


    // ========================================
    // REMOVE FILE
    // ========================================

    function handleRemoveFile() {

        setForm(
            (previous) => ({
                ...previous,

                certificateImage: "",

                certificateFileName: ""
            })
        );

        setUploadError("");
    }


    // ========================================
    // SUBMIT
    // ========================================

    function handleSubmit(event) {

        event.preventDefault();


        if (
            submitting ||
            uploadingFile
        ) {
            return;
        }


        onSubmit();
    }


    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-black/80
                p-4
                backdrop-blur-md
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                        event.currentTarget &&
                    !submitting &&
                    !uploadingFile
                ) {
                    onCancel();
                }

            }}
        >

            <div
                className="
                    my-auto
                    flex
                    max-h-[94vh]
                    w-full
                    max-w-3xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-cyan-400/20
                    bg-[#07111f]
                    shadow-[0_0_70px_rgba(0,200,255,0.12)]
                "
                onMouseDown={(event) => {
                    event.stopPropagation();
                }}
            >

                {/* HEADER */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-white/10
                    px-5
                    py-4
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-cyan-400/20
                            bg-cyan-400/10
                            text-xl
                        ">
                            🏆
                        </div>


                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-white
                                sm:text-xl
                            ">
                                {editing
                                    ? "Edit Certificate"
                                    : "Add Certificate"}
                            </h2>

                            <p className="
                                mt-0.5
                                text-xs
                                text-slate-500
                                sm:text-sm
                            ">
                                Add your professional
                                certificate or achievement.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={
                            submitting ||
                            uploadingFile
                        }
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.03]
                            text-xl
                            text-slate-400
                            transition
                            hover:border-cyan-400/30
                            hover:bg-cyan-400/10
                            hover:text-cyan-300
                            disabled:opacity-50
                        "
                    >
                        ×
                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        overflow-y-auto
                        p-5
                        sm:p-6
                    "
                >

                    <div className="space-y-5">

                        {/* TITLE */}

                        <div className="
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        ">

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                ">
                                    Certificate Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={200}
                                    placeholder="Full Stack Development Certificate"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-3.5
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-slate-500
                                        focus:border-cyan-400/40
                                        focus:ring-4
                                        focus:ring-cyan-400/5
                                    "
                                />

                            </div>


                            {/* ISSUER */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                ">
                                    Issuing Organization
                                </label>

                                <input
                                    type="text"
                                    name="issuingOrganization"
                                    value={
                                        form.issuingOrganization
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={200}
                                    placeholder="Tata Technologies"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-3.5
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-slate-500
                                        focus:border-cyan-400/40
                                        focus:ring-4
                                        focus:ring-cyan-400/5
                                    "
                                />

                            </div>

                        </div>


                        {/* DATES */}

                        <div className="
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        ">

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                ">
                                    Issue Date
                                </label>

                                <input
                                    type="date"
                                    name="issueDate"
                                    value={
                                        form.issueDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-3.5
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        focus:border-cyan-400/40
                                        focus:ring-4
                                        focus:ring-cyan-400/5
                                    "
                                />

                            </div>


                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                ">
                                    Expiry Date
                                </label>

                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={
                                        form.expiryDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-3.5
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        focus:border-cyan-400/40
                                        focus:ring-4
                                        focus:ring-cyan-400/5
                                    "
                                />

                                <p className="
                                    mt-1.5
                                    text-xs
                                    text-slate-500
                                ">
                                    Optional
                                </p>

                            </div>

                        </div>


                        {/* CREDENTIAL */}

                        <div className="
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        ">

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                ">
                                    Credential ID
                                </label>

                                <input
                                    type="text"
                                    name="credentialId"
                                    value={
                                        form.credentialId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={150}
                                    placeholder="CERT-123456"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-3.5
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-slate-500
                                        focus:border-cyan-400/40
                                        focus:ring-4
                                        focus:ring-cyan-400/5
                                    "
                                />

                            </div>


                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                ">
                                    Verification URL
                                </label>

                                <input
                                    type="url"
                                    name="credentialUrl"
                                    value={
                                        form.credentialUrl
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="https://..."
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-3.5
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-slate-500
                                        focus:border-cyan-400/40
                                        focus:ring-4
                                        focus:ring-cyan-400/5
                                    "
                                />

                            </div>

                        </div>


                        {/* ========================================
                            FILE UPLOAD
                        ======================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-200
                            ">
                                Certificate File
                            </label>


                            <label className="
                                flex
                                cursor-pointer
                                flex-col
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-dashed
                                border-cyan-400/20
                                bg-cyan-400/[0.03]
                                px-6
                                py-8
                                text-center
                                transition
                                hover:border-cyan-400/40
                                hover:bg-cyan-400/[0.05]
                            ">

                                <input
                                    type="file"
                                    accept="*/*"
                                    onChange={
                                        handleFileUpload
                                    }
                                    disabled={
                                        uploadingFile ||
                                        submitting
                                    }
                                    className="hidden"
                                />


                                {uploadingFile ? (
                                    <>
                                        <div className="
                                            h-10
                                            w-10
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-cyan-400/20
                                            border-t-cyan-400
                                        " />

                                        <p className="
                                            mt-3
                                            text-sm
                                            font-medium
                                            text-white
                                        ">
                                            Uploading...
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            border-cyan-400/20
                                            bg-cyan-400/10
                                            text-2xl
                                        ">
                                            📎
                                        </div>

                                        <p className="
                                            mt-3
                                            text-sm
                                            font-medium
                                            text-white
                                        ">
                                            Choose Certificate File
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        ">
                                            Any file type · Maximum 10MB
                                        </p>
                                    </>
                                )}

                            </label>


                            {/* UPLOAD ERROR */}

                            {uploadError ? (
                                <div className="
                                    mt-3
                                    rounded-xl
                                    border
                                    border-red-400/20
                                    bg-red-400/5
                                    px-4
                                    py-3
                                    text-xs
                                    leading-5
                                    text-red-300
                                ">
                                    {uploadError}
                                </div>
                            ) : null}


                            {/* SELECTED FILE */}

                            {form.certificateImage ? (
                                <div className="
                                    mt-4
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/[0.02]
                                ">

                                    {getFileType(
                                        form.certificateImage
                                    ) === "image" ? (
                                        <img
                                            src={
                                                form.certificateImage
                                            }
                                            alt="Certificate"
                                            className="
                                                h-56
                                                w-full
                                                object-contain
                                                bg-black/30
                                            "
                                        />
                                    ) : getFileType(
                                        form.certificateImage
                                    ) === "pdf" ? (
                                        <iframe
                                            src={
                                                form.certificateImage
                                            }
                                            title="Certificate PDF"
                                            className="
                                                h-64
                                                w-full
                                                bg-white
                                            "
                                        />
                                    ) : (
                                        <div className="
                                            flex
                                            items-center
                                            gap-4
                                            p-5
                                        ">
                                            <div className="
                                                flex
                                                h-14
                                                w-14
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-cyan-400/10
                                                text-2xl
                                            ">
                                                {
                                                    getFileIcon(
                                                        getFileType(
                                                            form.certificateImage
                                                        )
                                                    )
                                                }
                                            </div>

                                            <div className="min-w-0">
                                                <p className="
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-white
                                                ">
                                                    {
                                                        form.certificateFileName ||
                                                        "Certificate file"
                                                    }
                                                </p>

                                                <a
                                                    href={
                                                        form.certificateImage
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="
                                                        mt-1
                                                        inline-block
                                                        text-xs
                                                        text-cyan-300
                                                    "
                                                >
                                                    Open file ↗
                                                </a>
                                            </div>
                                        </div>
                                    )}


                                    <div className="
                                        border-t
                                        border-white/10
                                        p-3
                                    ">
                                        <button
                                            type="button"
                                            onClick={
                                                handleRemoveFile
                                            }
                                            disabled={
                                                uploadingFile ||
                                                submitting
                                            }
                                            className="
                                                w-full
                                                rounded-xl
                                                border
                                                border-red-400/10
                                                bg-red-400/[0.03]
                                                px-4
                                                py-2.5
                                                text-xs
                                                font-medium
                                                text-red-300
                                                hover:bg-red-500/10
                                            "
                                        >
                                            Remove File
                                        </button>
                                    </div>

                                </div>
                            ) : null}

                        </div>


                        {/* DESCRIPTION */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-200
                            ">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                                maxLength={2000}
                                rows={6}
                                placeholder="Describe this certification..."
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    px-3.5
                                    py-3
                                    text-sm
                                    leading-6
                                    text-white
                                    outline-none
                                    placeholder:text-slate-500
                                    focus:border-cyan-400/40
                                    focus:ring-4
                                    focus:ring-cyan-400/5
                                "
                            />

                        </div>


                        {/* SKILLS */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-200
                            ">
                                Skills
                            </label>

                            <input
                                type="text"
                                name="skills"
                                value={
                                    form.skills
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="React, JavaScript, Node.js"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    px-3.5
                                    py-3
                                    text-sm
                                    text-white
                                    outline-none
                                    placeholder:text-slate-500
                                    focus:border-cyan-400/40
                                    focus:ring-4
                                    focus:ring-cyan-400/5
                                "
                            />

                        </div>


                        {/* ORDER */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-200
                            ">
                                Display Order
                            </label>

                            <input
                                type="number"
                                name="order"
                                min="0"
                                step="1"
                                value={
                                    form.order
                                }
                                onChange={
                                    handleChange
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    px-3.5
                                    py-3
                                    text-sm
                                    text-white
                                    outline-none
                                    focus:border-cyan-400/40
                                    focus:ring-4
                                    focus:ring-cyan-400/5
                                "
                            />

                        </div>


                        {/* PUBLISHED */}

                        <label className="
                            flex
                            cursor-pointer
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.02]
                            p-4
                        ">

                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={
                                    form.isPublished
                                }
                                onChange={
                                    handleChange
                                }
                                className="
                                    mt-0.5
                                    h-4
                                    w-4
                                    accent-cyan-400
                                "
                            />

                            <span>

                                <span className="
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                ">
                                    Published
                                </span>

                                <span className="
                                    mt-1
                                    block
                                    text-xs
                                    text-slate-500
                                ">
                                    Show on public portfolio.
                                </span>

                            </span>

                        </label>

                    </div>


                    {/* ACTIONS */}

                    <div className="
                        mt-6
                        flex
                        flex-col-reverse
                        gap-3
                        border-t
                        border-white/10
                        pt-5
                        sm:flex-row
                        sm:justify-end
                    ">

                        <button
                            type="button"
                            onClick={
                                onCancel
                            }
                            disabled={
                                submitting ||
                                uploadingFile
                            }
                            className="
                                rounded-xl
                                border
                                border-white/10
                                px-5
                                py-3
                                text-sm
                                text-slate-300
                                hover:bg-white/5
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                uploadingFile
                            }
                            className="
                                rounded-xl
                                bg-cyan-400
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-slate-950
                                hover:bg-cyan-300
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {submitting
                                ? "Saving..."
                                : editing
                                    ? "Update Certificate"
                                    : "Add Certificate"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}


// ========================================
// CERTIFICATE CARD
// ========================================

function CertificateCard({
    certificate,
    onEdit,
    onDelete,
    onPublished
}) {
    const fileType =
        getFileType(
            certificate.certificateImage
        );

    const skills =
        normalizeArray(
            certificate.skills
        );

    const issueDate =
        formatMonthYear(
            certificate.issueDate
        );

    const expiryDate =
        formatMonthYear(
            certificate.expiryDate
        );


    return (
        <article className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-[#07111f]
            p-5
            transition
            duration-300
            hover:border-cyan-400/30
            hover:shadow-[0_0_35px_rgba(0,200,255,0.07)]
        ">

            {/* FILE PREVIEW */}

            {certificate.certificateImage ? (

                <a
                    href={
                        certificate.certificateImage
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="
                        group
                        relative
                        block
                        overflow-hidden
                        rounded-xl
                        border
                        border-white/10
                        bg-black/20
                    "
                    title="Open certificate"
                >

                    {fileType === "image" ? (

                        <img
                            src={
                                certificate.certificateImage
                            }
                            alt={
                                certificate.title ||
                                "Certificate"
                            }
                            className="
                                h-56
                                w-full
                                object-contain
                                bg-black/20
                                transition
                                duration-300
                                group-hover:scale-[1.02]
                            "
                        />

                    ) : fileType === "pdf" ? (

                        <div
                            className="
                                relative
                                h-56
                                bg-white
                            "
                        >
                            <iframe
                                src={
                                    certificate.certificateImage
                                }
                                title={
                                    certificate.title ||
                                    "Certificate PDF"
                                }
                                className="
                                    pointer-events-none
                                    h-full
                                    w-full
                                "
                            />

                            <div className="
                                absolute
                                inset-0
                                flex
                                items-end
                                justify-center
                                bg-gradient-to-t
                                from-black/50
                                via-transparent
                                to-transparent
                                pb-4
                            ">
                                <span className="
                                    rounded-full
                                    bg-black/70
                                    px-4
                                    py-2
                                    text-xs
                                    font-medium
                                    text-white
                                    backdrop-blur
                                ">
                                    Click to open PDF ↗
                                </span>
                            </div>
                        </div>

                    ) : (

                        <div className="
                            flex
                            h-56
                            items-center
                            justify-center
                            bg-white/[0.02]
                        ">
                            <div className="
                                text-center
                            ">
                                <div className="
                                    text-5xl
                                ">
                                    {
                                        getFileIcon(
                                            fileType
                                        )
                                    }
                                </div>

                                <p className="
                                    mt-3
                                    text-sm
                                    font-medium
                                    text-white
                                ">
                                    Certificate File
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-cyan-300
                                ">
                                    Click to open ↗
                                </p>
                            </div>
                        </div>

                    )}

                </a>

            ) : (

                <div className="
                    flex
                    h-48
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-white/10
                    bg-white/[0.02]
                ">
                    <div className="
                        text-center
                    ">
                        <div className="
                            text-4xl
                        ">
                            📜
                        </div>

                        <p className="
                            mt-2
                            text-xs
                            text-slate-500
                        ">
                            No certificate file
                        </p>
                    </div>
                </div>

            )}


            {/* HEADER */}

            <div className="
                relative
                mt-5
                flex
                items-start
                justify-between
                gap-4
            ">

                <div className="
                    flex
                    min-w-0
                    items-start
                    gap-3
                ">

                    <div className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-cyan-400/20
                        bg-cyan-400/10
                        text-lg
                    ">
                        🏆
                    </div>


                    <div className="min-w-0">

                        <h3 className="
                            break-words
                            text-lg
                            font-bold
                            text-white
                        ">
                            {certificate.title ||
                                "Untitled Certificate"}
                        </h3>


                        {certificate.issuingOrganization ? (
                            <p className="
                                mt-1
                                truncate
                                text-sm
                                text-cyan-300
                            ">
                                {
                                    certificate.issuingOrganization
                                }
                            </p>
                        ) : null}

                    </div>

                </div>


                <span className={`
                    shrink-0
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-[11px]
                    ${
                        certificate.isPublished
                            ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                            : "border-slate-400/10 bg-slate-400/5 text-slate-500"
                    }
                `}>
                    {certificate.isPublished
                        ? "Published"
                        : "Hidden"}
                </span>

            </div>


            {/* FILE NAME */}

            {certificate.certificateFileName ? (
                <p className="
                    mt-3
                    truncate
                    text-xs
                    text-slate-500
                ">
                    📎{" "}
                    {certificate.certificateFileName}
                </p>
            ) : null}


            {/* DATES */}

            {issueDate ||
            expiryDate ? (
                <div className="
                    mt-4
                    flex
                    flex-wrap
                    gap-2
                ">

                    {issueDate ? (
                        <span className="
                            rounded-lg
                            border
                            border-cyan-400/10
                            bg-cyan-400/5
                            px-2.5
                            py-1
                            text-xs
                            text-cyan-300
                        ">
                            Issued {issueDate}
                        </span>
                    ) : null}


                    {expiryDate ? (
                        <span className="
                            rounded-lg
                            border
                            border-white/10
                            bg-white/[0.03]
                            px-2.5
                            py-1
                            text-xs
                            text-slate-400
                        ">
                            Expires {expiryDate}
                        </span>
                    ) : null}

                </div>
            ) : null}


            {/* CREDENTIAL */}

            {certificate.credentialId ? (
                <div className="
                    mt-4
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-3
                ">

                    <p className="
                        text-[11px]
                        uppercase
                        tracking-wider
                        text-slate-600
                    ">
                        Credential ID
                    </p>

                    <p className="
                        mt-1
                        break-all
                        text-sm
                        text-slate-300
                    ">
                        {certificate.credentialId}
                    </p>

                </div>
            ) : null}


            {/* VERIFY */}

            {certificate.credentialUrl ? (
                <a
                    href={
                        certificate.credentialUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="
                        mt-4
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-cyan-400/20
                        bg-cyan-400/5
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-cyan-300
                        hover:bg-cyan-400/10
                    "
                >
                    Verify Credential ↗
                </a>
            ) : null}


            {/* DESCRIPTION */}

            {certificate.description ? (
                <p className="
                    mt-4
                    line-clamp-4
                    text-sm
                    leading-6
                    text-slate-400
                ">
                    {
                        certificate.description
                    }
                </p>
            ) : null}


            {/* SKILLS */}

            {skills.length > 0 ? (
                <div className="
                    mt-4
                    flex
                    flex-wrap
                    gap-2
                ">

                    {skills.map(
                        (
                            skill,
                            index
                        ) => (
                            <span
                                key={
                                    `${skill}-${index}`
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    px-2.5
                                    py-1
                                    text-xs
                                    text-slate-300
                                "
                            >
                                {skill}
                            </span>
                        )
                    )}

                </div>
            ) : null}


            {/* ORDER */}

            <div className="
                mt-4
                flex
                items-center
                justify-between
                text-[11px]
                text-slate-600
            ">
                <span>
                    Display order
                </span>

                <span>
                    {certificate.order ?? 0}
                </span>
            </div>


            {/* ACTIONS */}

            <div className="
                mt-4
                grid
                grid-cols-3
                gap-2
                border-t
                border-white/10
                pt-4
            ">

                <button
                    type="button"
                    onClick={onEdit}
                    className="
                        rounded-lg
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-2
                        py-2.5
                        text-xs
                        text-slate-300
                        hover:bg-white/[0.06]
                    "
                >
                    Edit
                </button>


                <button
                    type="button"
                    onClick={
                        onPublished
                    }
                    className="
                        rounded-lg
                        border
                        border-cyan-400/10
                        bg-cyan-400/[0.03]
                        px-2
                        py-2.5
                        text-xs
                        text-cyan-300
                        hover:bg-cyan-400/10
                    "
                >
                    {certificate.isPublished
                        ? "Hide"
                        : "Publish"}
                </button>


                <button
                    type="button"
                    onClick={onDelete}
                    className="
                        rounded-lg
                        border
                        border-red-400/10
                        bg-red-400/[0.03]
                        px-2
                        py-2.5
                        text-xs
                        text-red-300
                        hover:bg-red-500/10
                    "
                >
                    Delete
                </button>

            </div>

        </article>
    );
}


// ========================================
// MAIN PAGE
// ========================================

export default function CertificatesPage() {

    const [
        certificates,
        setCertificates
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        showForm,
        setShowForm
    ] = useState(false);

    const [
        form,
        setForm
    ] = useState({
        ...initialForm
    });

    const [
        editingCertificate,
        setEditingCertificate
    ] = useState(null);

    const [
        submitting,
        setSubmitting
    ] = useState(false);


    // ========================================
    // LOAD
    // ========================================

    async function loadCertificates() {

        try {

            setLoading(true);

            setError("");

            const response =
                await getMyCertificates();

            setCertificates(
                Array.isArray(
                    response?.data
                )
                    ? response.data
                    : []
            );

        } catch (error) {

            setError(
                getErrorMessage(error)
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {
        loadCertificates();
    }, []);


    // ========================================
    // CREATE
    // ========================================

    function handleCreate() {

        setEditingCertificate(null);

        setForm({
            ...initialForm
        });

        setError("");

        setShowForm(true);
    }


    // ========================================
    // EDIT
    // ========================================

    function handleEdit(certificate) {

        setEditingCertificate(
            certificate
        );


        setForm({
            title:
                certificate.title || "",

            issuingOrganization:
                certificate.issuingOrganization ||
                "",

            issueDate:
                normalizeDateForInput(
                    certificate.issueDate
                ),

            expiryDate:
                normalizeDateForInput(
                    certificate.expiryDate
                ),

            credentialId:
                certificate.credentialId ||
                "",

            credentialUrl:
                certificate.credentialUrl ||
                "",

            certificateImage:
                certificate.certificateImage ||
                "",

            certificateFileName:
                "",

            description:
                certificate.description ||
                "",

            skills:
                normalizeArray(
                    certificate.skills
                ).join(", "),

            order:
                Math.max(
                    0,
                    Number(
                        certificate.order ??
                        0
                    ) || 0
                ),

            isPublished:
                certificate.isPublished !==
                false
        });


        setError("");

        setShowForm(true);
    }


    // ========================================
    // SUBMIT
    // ========================================

    async function handleSubmit() {

        if (submitting) {
            return;
        }


        try {

            setSubmitting(true);

            setError("");


            const skills =
                form.skills
                    .split(",")
                    .map(
                        (item) =>
                            item.trim()
                    )
                    .filter(Boolean);


            const payload = {

                title:
                    form.title.trim(),

                issuingOrganization:
                    form.issuingOrganization.trim(),

                credentialId:
                    form.credentialId.trim(),

                certificateImage:
                    form.certificateImage.trim(),

                description:
                    form.description.trim(),

                skills,

                order:
                    Math.max(
                        0,
                        Number(
                            form.order
                        ) || 0
                    ),

                isPublished:
                    Boolean(
                        form.isPublished
                    )
            };


            // ISSUE DATE

            if (form.issueDate) {

                payload.issueDate =
                    form.issueDate;
            }


            // EXPIRY DATE

            if (form.expiryDate) {

                payload.expiryDate =
                    form.expiryDate;
            }


            // CREDENTIAL URL

            if (
                form.credentialUrl.trim()
            ) {

                payload.credentialUrl =
                    form.credentialUrl.trim();
            }


            // ========================================
            // UPDATE
            // ========================================

            if (editingCertificate) {

                const response =
                    await updateCertificate(
                        editingCertificate._id,
                        payload
                    );


                const updated =
                    response?.data;


                if (!updated) {

                    throw new Error(
                        "Updated certificate data not received"
                    );
                }


                setCertificates(
                    (previous) =>
                        previous.map(
                            (item) =>
                                item._id ===
                                updated._id
                                    ? updated
                                    : item
                        )
                );
            }


            // ========================================
            // CREATE
            // ========================================

            else {

                const response =
                    await createCertificate(
                        payload
                    );


                const created =
                    response?.data;


                if (!created) {

                    throw new Error(
                        "Created certificate data not received"
                    );
                }


                setCertificates(
                    (previous) => [
                        ...previous,
                        created
                    ]
                );
            }


            setShowForm(false);

            setEditingCertificate(
                null
            );

            setForm({
                ...initialForm
            });

        } catch (error) {

            setError(
                getErrorMessage(error)
            );

        } finally {

            setSubmitting(false);
        }
    }


    // ========================================
    // DELETE
    // ========================================

    async function handleDelete(
        certificate
    ) {

        const confirmed =
            window.confirm(
                `Delete "${certificate.title || "this certificate"}"? This action cannot be undone.`
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await deleteCertificate(
                certificate._id
            );


            setCertificates(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item._id !==
                            certificate._id
                    )
            );

        } catch (error) {

            setError(
                getErrorMessage(error)
            );
        }
    }


    // ========================================
    // PUBLISHED
    // ========================================

    async function handlePublished(
        certificate
    ) {

        try {

            setError("");

            const response =
                await toggleCertificatePublished(
                    certificate._id
                );


            const updated =
                response?.data;


            if (!updated) {

                throw new Error(
                    "Updated certificate data not received"
                );
            }


            setCertificates(
                (previous) =>
                    previous.map(
                        (item) =>
                            item._id ===
                            updated._id
                                ? updated
                                : item
                    )
            );

        } catch (error) {

            setError(
                getErrorMessage(error)
            );
        }
    }


    // ========================================
    // CLOSE
    // ========================================

    function handleCloseForm() {

        if (submitting) {
            return;
        }


        setShowForm(false);

        setEditingCertificate(
            null
        );

        setForm({
            ...initialForm
        });
    }


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <div className="
                flex
                min-h-[500px]
                items-center
                justify-center
                bg-[#020817]
            ">
                <div className="
                    h-10
                    w-10
                    animate-spin
                    rounded-full
                    border-2
                    border-cyan-400/20
                    border-t-cyan-400
                " />
            </div>
        );
    }


    return (
        <div className="
            min-h-screen
            w-full
            space-y-6
            bg-[#020817]
            px-4
            py-6
            text-white
            sm:px-6
            lg:px-8
        ">

            {/* HEADER */}

            <div className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
            ">

                <div className="
                    flex
                    items-center
                    gap-3
                ">

                    <div className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-cyan-400/20
                        bg-cyan-400/10
                        text-xl
                    ">
                        🏆
                    </div>

                    <div>

                        <h1 className="
                            text-2xl
                            font-bold
                            sm:text-3xl
                        ">
                            Certificates
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-slate-400
                        ">
                            Manage your professional
                            certificates and credentials.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={
                        handleCreate
                    }
                    className="
                        rounded-xl
                        bg-cyan-400
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-slate-950
                        hover:bg-cyan-300
                    "
                >
                    + Add Certificate
                </button>

            </div>


            {/* ERROR */}

            {error ? (
                <div className="
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-400/5
                    px-4
                    py-3
                    text-sm
                    text-red-300
                ">
                    ⚠ {error}
                </div>
            ) : null}


            {/* STATS */}

            <div className="
                grid
                grid-cols-2
                gap-3
                lg:grid-cols-4
            ">

                <div className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#07111f]
                    p-4
                ">
                    <p className="
                        text-xs
                        text-slate-500
                    ">
                        Total
                    </p>

                    <p className="
                        mt-1
                        text-2xl
                        font-bold
                    ">
                        {certificates.length}
                    </p>
                </div>


                <div className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#07111f]
                    p-4
                ">
                    <p className="
                        text-xs
                        text-slate-500
                    ">
                        Published
                    </p>

                    <p className="
                        mt-1
                        text-2xl
                        font-bold
                        text-emerald-400
                    ">
                        {
                            certificates.filter(
                                (item) =>
                                    item.isPublished
                            ).length
                        }
                    </p>
                </div>


                <div className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#07111f]
                    p-4
                ">
                    <p className="
                        text-xs
                        text-slate-500
                    ">
                        With File
                    </p>

                    <p className="
                        mt-1
                        text-2xl
                        font-bold
                        text-cyan-300
                    ">
                        {
                            certificates.filter(
                                (item) =>
                                    item.certificateImage
                            ).length
                        }
                    </p>
                </div>


                <div className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#07111f]
                    p-4
                ">
                    <p className="
                        text-xs
                        text-slate-500
                    ">
                        Hidden
                    </p>

                    <p className="
                        mt-1
                        text-2xl
                        font-bold
                        text-slate-300
                    ">
                        {
                            certificates.filter(
                                (item) =>
                                    !item.isPublished
                            ).length
                        }
                    </p>
                </div>

            </div>


            {/* EMPTY */}

            {certificates.length === 0 ? (

                <div className="
                    flex
                    min-h-[430px]
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-cyan-400/20
                    bg-[#07111f]
                    px-6
                    text-center
                ">

                    <div className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-2xl
                        bg-cyan-400/10
                        text-3xl
                    ">
                        🏆
                    </div>

                    <h2 className="
                        mt-5
                        text-xl
                        font-bold
                    ">
                        No certificates added
                    </h2>

                    <p className="
                        mt-2
                        max-w-md
                        text-sm
                        leading-6
                        text-slate-400
                    ">
                        Add your Tata, college,
                        course, internship or
                        professional certificates.
                    </p>

                    <button
                        type="button"
                        onClick={
                            handleCreate
                        }
                        className="
                            mt-6
                            rounded-xl
                            bg-cyan-400
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-slate-950
                        "
                    >
                        Add Your First Certificate
                    </button>

                </div>

            ) : (

                <div className="
                    grid
                    grid-cols-1
                    gap-5
                    xl:grid-cols-2
                ">

                    {certificates.map(
                        (certificate) => (

                            <CertificateCard
                                key={
                                    certificate._id
                                }
                                certificate={
                                    certificate
                                }
                                onEdit={() =>
                                    handleEdit(
                                        certificate
                                    )
                                }
                                onDelete={() =>
                                    handleDelete(
                                        certificate
                                    )
                                }
                                onPublished={() =>
                                    handlePublished(
                                        certificate
                                    )
                                }
                            />

                        )
                    )}

                </div>
            )}


            {/* FORM */}

            {showForm ? (
                <CertificateForm
                    form={form}
                    setForm={setForm}
                    onSubmit={
                        handleSubmit
                    }
                    onCancel={
                        handleCloseForm
                    }
                    submitting={
                        submitting
                    }
                    editing={Boolean(
                        editingCertificate
                    )}
                />
            ) : null}

        </div>
    );
}