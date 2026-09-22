import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    uploadResume
} from "../api/portfolio.api";


// ========================================
// INPUT COMPONENT
// ========================================

const Input = ({
    label,
    value,
    onChange,
    placeholder,
    error,
    type = "text"
}) => {

    return (

        <div>

            <label
                className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-300
                "
            >
                {label}
            </label>


            <input
                type={type}
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                placeholder={placeholder}
                className={`
                    w-full
                    rounded-xl
                    border
                    bg-[#070b16]
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    focus:ring-1
                    ${
                        error
                            ? "border-red-400/50 focus:border-red-400/60 focus:ring-red-400/10"
                            : "border-white/10 focus:border-cyan-400/40 focus:ring-cyan-400/20"
                    }
                `}
            />


            {error ? (

                <p
                    className="
                        mt-1.5
                        text-[11px]
                        text-red-300
                    "
                >
                    {error}
                </p>

            ) : null}

        </div>

    );
};


// ========================================
// PROFILE SETTINGS
// ========================================

const ProfileSettings = ({
    form,
    onChange,
    onNestedChange,
    fieldErrors
}) => {

    // ========================================
    // PROFILE IMAGE
    // ========================================

    const fileInputRef =
        useRef(null);


    // ========================================
    // RESUME
    // ========================================

    const resumeInputRef =
        useRef(null);


    const [
        uploadingResume,
        setUploadingResume
    ] = useState(false);


    const [
        resumeUploadError,
        setResumeUploadError
    ] = useState("");


    // ========================================
    // OPEN PROFILE IMAGE PICKER
    // ========================================

    const openFilePicker = () => {

        if (
            fileInputRef.current
        ) {

            fileInputRef.current.click();

        }

    };


    // ========================================
    // PROFILE IMAGE SELECT
    // ========================================

    const handleProfileImage =
        (event) => {

            const file =
                event.target.files &&
                event.target.files[0];


            if (!file) {

                return;

            }


            // ========================================
            // IMAGE TYPE
            // ========================================

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select an image file."
                );

                event.target.value =
                    "";

                return;

            }


            // ========================================
            // SIZE
            // ========================================

            const maxSize =
                5 *
                1024 *
                1024;


            if (
                file.size >
                maxSize
            ) {

                alert(
                    "Profile image must be less than 5MB."
                );

                event.target.value =
                    "";

                return;

            }


            // ========================================
            // FILE READER
            // ========================================

            const reader =
                new FileReader();


            reader.onload = () => {

                if (
                    typeof reader.result ===
                    "string"
                ) {

                    onChange(
                        "profileImage",
                        reader.result
                    );

                }

            };


            reader.readAsDataURL(
                file
            );

        };


    // ========================================
    // OPEN RESUME PICKER
    // ========================================

    const openResumePicker = () => {

        if (
            resumeInputRef.current
        ) {

            resumeInputRef.current.click();

        }

    };


    // ========================================
    // RESUME UPLOAD
    // ========================================

    const handleResumeUpload =
        async (event) => {

            const file =
                event.target.files &&
                event.target.files[0];


            if (!file) {

                return;

            }


            setResumeUploadError(
                ""
            );


            // ========================================
            // ALLOWED FILE TYPES
            // ========================================

            const allowedTypes = [

                "application/pdf",

                "application/msword",

                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                setResumeUploadError(
                    "Only PDF, DOC and DOCX files are allowed."
                );

                event.target.value =
                    "";

                return;

            }


            // ========================================
            // MAX 10MB
            // ========================================

            const maxSize =
                10 *
                1024 *
                1024;


            if (
                file.size >
                maxSize
            ) {

                setResumeUploadError(
                    "Resume must be less than 10MB."
                );

                event.target.value =
                    "";

                return;

            }


            try {

                setUploadingResume(
                    true
                );


                // ========================================
                // API UPLOAD
                // ========================================

                const response =
                    await uploadResume(
                        file
                    );


                const uploaded =
                    response.data;


                if (
                    !uploaded ||
                    !uploaded.url
                ) {

                    throw new Error(
                        "Resume upload failed. URL was not received."
                    );

                }


                // ========================================
                // SAVE URL
                // ========================================

                onNestedChange(
                    "resume",
                    "url",
                    uploaded.url
                );


                // ========================================
                // SAVE PUBLIC ID
                // ========================================

                onNestedChange(
                    "resume",
                    "publicId",
                    uploaded.publicId ||
                    ""
                );


                // ========================================
                // SAVE FILE NAME
                // ========================================

                onNestedChange(
                    "resume",
                    "fileName",
                    uploaded.fileName ||
                    file.name
                );


                setResumeUploadError(
                    ""
                );

            } catch (error) {

                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {

                    setResumeUploadError(
                        error.response.data.message
                    );

                } else if (
                    error.message
                ) {

                    setResumeUploadError(
                        error.message
                    );

                } else {

                    setResumeUploadError(
                        "Resume upload failed."
                    );

                }

            } finally {

                setUploadingResume(
                    false
                );

                event.target.value =
                    "";

            }

        };


    // ========================================
    // RESET FILE INPUTS
    // ========================================

    useEffect(() => {

        return () => {

            if (
                fileInputRef.current
            ) {

                fileInputRef.current.value =
                    "";

            }


            if (
                resumeInputRef.current
            ) {

                resumeInputRef.current.value =
                    "";

            }

        };

    }, []);


    return (

        <div
            className="
                space-y-5
            "
        >

            {/* ==================================
                PROFILE IMAGE
            ================================== */}

            <div
                className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-4
                "
            >

                <p
                    className="
                        text-sm
                        font-semibold
                        text-white
                    "
                >
                    Profile Image
                </p>


                <p
                    className="
                        mt-1
                        text-[11px]
                        leading-5
                        text-slate-500
                    "
                >
                    Click the image to choose a profile picture.
                </p>


                {/* HIDDEN INPUT */}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="
                        image/png,
                        image/jpeg,
                        image/webp
                    "
                    onChange={
                        handleProfileImage
                    }
                    className="hidden"
                />


                {/* IMAGE BUTTON */}

                <button
                    type="button"
                    onClick={
                        openFilePicker
                    }
                    className="
                        group
                        relative
                        mt-5
                        block
                        h-32
                        w-32
                        overflow-hidden
                        rounded-full
                        border-2
                        border-cyan-400/30
                        bg-cyan-400/5
                        text-3xl
                        font-black
                        text-cyan-300
                        transition
                        hover:border-cyan-400/60
                        hover:shadow-[0_0_40px_rgba(34,211,238,0.18)]
                    "
                >

                    {form.profileImage ? (

                        <img
                            src={
                                form.profileImage
                            }
                            alt={
                                form.title ||
                                "Profile"
                            }
                            className="
                                h-full
                                w-full
                                object-cover
                            "
                        />

                    ) : (

                        (
                            form.title ||
                            "U"
                        )
                            .charAt(0)
                            .toUpperCase()

                    )}


                    {/* HOVER */}

                    <div
                        className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            bg-black/50
                            opacity-0
                            transition
                            group-hover:opacity-100
                        "
                    >

                        <span
                            className="
                                text-[10px]
                                font-bold
                                text-white
                            "
                        >
                            Change Image
                        </span>

                    </div>

                </button>


                {/* STATUS */}

                {form.profileImage ? (

                    <p
                        className="
                            mt-3
                            text-[11px]
                            text-emerald-300
                        "
                    >
                        ✓ Profile image selected
                    </p>

                ) : (

                    <p
                        className="
                            mt-3
                            text-[11px]
                            text-slate-600
                        "
                    >
                        PNG, JPG or WEBP · Max 5MB
                    </p>

                )}

            </div>


            {/* ==================================
                LOCATION
            ================================== */}

            <Input
                label="Location"
                value={
                    form.location
                }
                onChange={(value) =>
                    onChange(
                        "location",
                        value
                    )
                }
                placeholder="India"
                error={
                    fieldErrors.location
                }
            />


            {/* ==================================
                EMAIL
            ================================== */}

            <Input
                label="Public Email"
                type="email"
                value={
                    form.email
                }
                onChange={(value) =>
                    onChange(
                        "email",
                        value
                    )
                }
                placeholder="you@example.com"
                error={
                    fieldErrors.email
                }
            />


            {/* ==================================
                PHONE
            ================================== */}

            <Input
                label="Phone"
                value={
                    form.phone
                }
                onChange={(value) =>
                    onChange(
                        "phone",
                        value
                    )
                }
                placeholder="+91..."
                error={
                    fieldErrors.phone
                }
            />


            {/* ==================================
                WEBSITE
            ================================== */}

            <Input
                label="Website"
                value={
                    form.website
                }
                onChange={(value) =>
                    onChange(
                        "website",
                        value
                    )
                }
                placeholder="https://yourwebsite.com"
            />


            {/* ==================================
                RESUME
            ================================== */}

            <div
                className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-4
                "
            >

                <p
                    className="
                        text-sm
                        font-semibold
                        text-white
                    "
                >
                    Resume
                </p>


                <p
                    className="
                        mt-1
                        text-[11px]
                        leading-5
                        text-slate-500
                    "
                >
                    Upload your resume. Visitors can open it from your portfolio.
                </p>


                {/* ==================================
                    HIDDEN RESUME INPUT
                ================================== */}

                <input
                    ref={
                        resumeInputRef
                    }
                    type="file"
                    accept="
                        .pdf,
                        .doc,
                        .docx
                    "
                    onChange={
                        handleResumeUpload
                    }
                    className="hidden"
                />


                {/* ==================================
                    UPLOAD BUTTON
                ================================== */}

                <button
                    type="button"
                    onClick={
                        openResumePicker
                    }
                    disabled={
                        uploadingResume
                    }
                    className="
                        mt-4
                        w-full
                        rounded-xl
                        border
                        border-cyan-400/20
                        bg-cyan-400/5
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-cyan-300
                        transition
                        hover:border-cyan-400/40
                        hover:bg-cyan-400/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {uploadingResume
                        ? "Uploading Resume..."
                        : "Upload Resume"}

                </button>


                {/* ==================================
                    UPLOADED RESUME
                ================================== */}

                {form.resume &&
                form.resume.url ? (

                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-xl
                            border
                            border-white/10
                            bg-[#070b16]
                            p-3
                        "
                    >

                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-cyan-400/10
                                    text-lg
                                "
                            >
                                📄
                            </div>


                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <p
                                    className="
                                        truncate
                                        text-sm
                                        font-medium
                                        text-white
                                    "
                                >
                                    {
                                        form.resume.fileName ||
                                        "Resume"
                                    }
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[10px]
                                        text-emerald-300
                                    "
                                >
                                    ✓ Resume uploaded
                                </p>

                            </div>

                        </div>


                        {/* OPEN RESUME */}

                        <a
                            href={
                                form.resume.url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                                shrink-0
                                rounded-lg
                                border
                                border-cyan-400/20
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-cyan-300
                                transition
                                hover:bg-cyan-400/10
                            "
                        >
                            Open ↗
                        </a>

                    </div>

                ) : (

                    <p
                        className="
                            mt-3
                            text-[11px]
                            text-slate-600
                        "
                    >
                        PDF, DOC or DOCX · Max 10MB
                    </p>

                )}


                {/* ==================================
                    ERROR
                ================================== */}

                {resumeUploadError ? (

                    <p
                        className="
                            mt-2
                            text-[11px]
                            text-red-300
                        "
                    >
                        {
                            resumeUploadError
                        }
                    </p>

                ) : null}

            </div>

        </div>

    );

};


export default ProfileSettings;