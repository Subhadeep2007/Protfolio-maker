import {
    useEffect,
    useState
} from "react";

import {
    getMyPosts,
    createPost,
    updatePost,
    deletePost,
    togglePostPublished,
    togglePostFeatured,
    uploadPostMedia
} from "../../../api/posts.api";

// ========================================
// INITIAL FORM
// ========================================

const initialForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    postType: "blog",
    tags: "",
    technologies: "",
    githubUrl: "",
    demoUrl: "",
    externalUrl: "",
    isFeatured: false,
    isPublished: false,
    order: 0
};

// ========================================
// POST TYPES
// ========================================

const postTypes = [
    {
        value: "blog",
        label: "Blog"
    },
    {
        value: "project",
        label: "Project"
    },
    {
        value: "achievement",
        label: "Achievement"
    },
    {
        value: "announcement",
        label: "Announcement"
    }
];

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
// ARRAY NORMALIZER
// ========================================

function normalizeArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value;
}

// ========================================
// MEDIA TYPE FROM URL
// ========================================

function getMediaType(url) {
    if (!url) {
        return "file";
    }

    const cleanUrl = String(url)
        .split("?")[0]
        .split("#")[0]
        .toLowerCase();

    // Audio assets uploaded to Cloudinary use /video/upload/, so inspect the
    // file extension before classifying by Cloudinary resource type.
    if (/\.(mp3|wav|aac|m4a|flac|aiff|ogg|opus|wma)$/.test(cleanUrl)) {
        return "audio";
    }

    if (cleanUrl.endsWith(".pdf")) {
        return "pdf";
    }

    // Cloudinary resource type
    if (
        cleanUrl.includes("/image/upload/")
    ) {
        return "image";
    }

    if (
        cleanUrl.includes("/video/upload/")
    ) {
        return "video";
    }

    if (
        cleanUrl.includes("/raw/upload/")
    ) {
        return "file";
    }

    // Normal image extensions
    if (
        /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico|tiff|tif)$/.test(
            cleanUrl
        )
    ) {
        return "image";
    }

    // Normal video extensions
    if (
        /\.(mp4|webm|ogg|mov|avi|m4v|mkv|flv|wmv)$/.test(
            cleanUrl
        )
    ) {
        return "video";
    }

    // Normal audio extensions
    if (
        /\.(mp3|wav|aac|m4a|flac|aiff|ogg|opus|wma)$/.test(
            cleanUrl
        )
    ) {
        return "audio";
    }

    return "file";
}

// ========================================
// MEDIA ICON
// ========================================

function getMediaIcon(type) {
    switch (type) {
        case "image":
            return "🖼️";

        case "video":
            return "🎬";

        case "pdf":
            return "📄";

        case "audio":
            return "🎵";

        default:
            return "📎";
    }
}

// ========================================
// POST FORM
// ========================================

function PostForm({
    form,
    setForm,
    onSubmit,
    onCancel,
    submitting,
    editing
}) {
    const [
        uploading,
        setUploading
    ] = useState(false);

    const [
        uploadError,
        setUploadError
    ] = useState("");

    const [
        mediaType,
        setMediaType
    ] = useState(() =>
        getMediaType(form.coverImage)
    );

    // ========================================
    // ESCAPE KEY
    // ========================================

    useEffect(() => {
        function handleKeyDown(event) {
            if (
                event.key === "Escape" &&
                !submitting &&
                !uploading
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
        uploading
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

        setForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    }

    // ========================================
    // MEDIA UPLOAD
    // ========================================

    async function handleMediaUpload(event) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setUploadError("");

        // ========================================
        // MAX 50MB
        // ========================================

        if (
            file.size >
            50 * 1024 * 1024
        ) {
            setUploadError(
                "File size must be less than 50MB."
            );

            event.target.value = "";

            return;
        }

        try {
            setUploading(true);

            const uploaded =
    await uploadPostMedia(
        file
    );

if (!uploaded || !uploaded.url) {
    throw new Error(
        "Media upload failed. URL was not received."
    );
}

            setForm(
                (previous) => ({
                    ...previous,

                    coverImage:
                        uploaded.url
                })
            );

            // ========================================
            // USE BACKEND RESOURCE TYPE
            // ========================================

            if (
                uploaded.mimeType &&
                uploaded.mimeType.startsWith("audio/")
            ) {
                setMediaType("audio");
            } else if (
                uploaded.resourceType ===
                "video"
            ) {
                setMediaType("video");
            } else if (
                uploaded.resourceType ===
                "image"
            ) {
                setMediaType("image");
            } else {
                setMediaType(
                    getMediaType(
                        uploaded.url
                    )
                );
            }

            setUploadError("");
        } catch (error) {
            setUploadError(
                getErrorMessage(error)
            );
        } finally {
            setUploading(false);

            event.target.value = "";
        }
    }

    // ========================================
    // REMOVE MEDIA
    // ========================================

    function handleRemoveMedia() {
        setForm(
            (previous) => ({
                ...previous,

                coverImage: ""
            })
        );

        setMediaType("unknown");

        setUploadError("");
    }

    // ========================================
    // SUBMIT
    // ========================================

    function handleSubmit(event) {
        event.preventDefault();

        if (
            submitting ||
            uploading
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
                    !uploading
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

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-white/10
                        px-5
                        py-4
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
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
                            "
                        >
                            ✍️
                        </div>

                        <div>
                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-white
                                    sm:text-xl
                                "
                            >
                                {editing
                                    ? "Edit Post"
                                    : "Create Post"}
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                    sm:text-sm
                                "
                            >
                                Create content for your
                                portfolio.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={
                            submitting ||
                            uploading
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
                    onSubmit={handleSubmit}
                    className="
                        overflow-y-auto
                        p-5
                        sm:p-6
                    "
                >
                    <div className="space-y-5">

                        {/* TITLE + TYPE */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                md:grid-cols-2
                            "
                        >
                            <div>
                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-200
                                    "
                                >
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={200}
                                    placeholder="Building a Real-Time MERN App"
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
                                    "
                                />
                            </div>

                            <div>
                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-200
                                    "
                                >
                                    Post Type
                                </label>

                                <select
                                    name="postType"
                                    value={
                                        form.postType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-[#0b1728]
                                        px-3.5
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        focus:border-cyan-400/40
                                    "
                                >
                                    {postTypes.map(
                                        (item) => (
                                            <option
                                                key={
                                                    item.value
                                                }
                                                value={
                                                    item.value
                                                }
                                            >
                                                {
                                                    item.label
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* SLUG */}

                        <div>
                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                "
                            >
                                Slug
                            </label>

                            <input
                                type="text"
                                name="slug"
                                value={
                                    form.slug
                                }
                                onChange={
                                    handleChange
                                }
                                maxLength={250}
                                placeholder="building-a-real-time-mern-app"
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
                                "
                            />

                            <p
                                className="
                                    mt-1.5
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Leave empty to let the
                                backend handle it.
                            </p>
                        </div>

                        {/* EXCERPT */}

                        <div>
                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                "
                            >
                                Excerpt
                            </label>

                            <textarea
                                name="excerpt"
                                value={
                                    form.excerpt
                                }
                                onChange={
                                    handleChange
                                }
                                maxLength={500}
                                rows={3}
                                placeholder="Short summary of this post..."
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
                                    text-white
                                    outline-none
                                    placeholder:text-slate-500
                                    focus:border-cyan-400/40
                                "
                            />

                            <div
                                className="
                                    mt-1
                                    flex
                                    justify-end
                                "
                            >
                                <span
                                    className="
                                        text-[11px]
                                        text-slate-500
                                    "
                                >
                                    {
                                        form.excerpt
                                            .length
                                    }
                                    /500
                                </span>
                            </div>
                        </div>

                        {/* CONTENT */}

                        <div>
                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                "
                            >
                                Content
                            </label>

                            <textarea
                                name="content"
                                value={
                                    form.content
                                }
                                onChange={
                                    handleChange
                                }
                                rows={10}
                                placeholder="Write your post content..."
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
                                "
                            />
                        </div>

                        {/* MEDIA UPLOAD */}

                        <div>
                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                "
                            >
                                Post Media
                            </label>

                            <label
                                className="
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
                                    hover:border-cyan-400/40
                                "
                            >
                                <input
                                    type="file"
                                    accept="*/*"
                                    onChange={
                                        handleMediaUpload
                                    }
                                    disabled={
                                        uploading ||
                                        submitting
                                    }
                                    className="hidden"
                                />

                                {uploading ? (
                                    <>
                                        <div
                                            className="
                                                h-10
                                                w-10
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-cyan-400/20
                                                border-t-cyan-400
                                            "
                                        />

                                        <p
                                            className="
                                                mt-3
                                                text-sm
                                                text-white
                                            "
                                        >
                                            Uploading
                                            file...
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className="
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
                                            "
                                        >
                                            📎
                                        </div>

                                        <p
                                            className="
                                                mt-3
                                                text-sm
                                                font-medium
                                                text-white
                                            "
                                        >
                                            Upload File
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-500
                                            "
                                        >
                                            Image, Video,
                                            PDF, Audio or
                                            any other file
                                            · Max 50MB
                                        </p>
                                    </>
                                )}
                            </label>

                            {/* ERROR */}

                            {uploadError ? (
                                <div
                                    className="
                                        mt-3
                                        rounded-xl
                                        border
                                        border-red-400/20
                                        bg-red-400/5
                                        px-4
                                        py-3
                                        text-xs
                                        text-red-300
                                    "
                                >
                                    {uploadError}
                                </div>
                            ) : null}

                            {/* PREVIEW */}

                            {form.coverImage ? (
                                <div
                                    className="
                                        mt-4
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-black/20
                                    "
                                >
                                    {mediaType ===
                                    "video" ? (
                                        <video
                                            src={
                                                form.coverImage
                                            }
                                            controls
                                            preload="metadata"
                                            className="
                                                max-h-80
                                                w-full
                                                bg-black
                                                object-contain
                                            "
                                        />
                                    ) : mediaType ===
                                      "image" ? (
                                        <img
                                            src={
                                                form.coverImage
                                            }
                                            alt="Post media"
                                            className="
                                                max-h-80
                                                w-full
                                                object-contain
                                                bg-black
                                            "
                                        />
                                    ) : mediaType === "pdf" ? (
                                        <iframe
                                            src={form.coverImage}
                                            title="Post PDF preview"
                                            className="h-96 w-full bg-white"
                                        />
                                    ) : mediaType ===
                                      "audio" ? (
                                        <div
                                            className="
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                                gap-4
                                                bg-[#0b1728]
                                                px-5
                                                py-8
                                            "
                                        >
                                            <div
                                                className="
                                                    text-5xl
                                                "
                                            >
                                                🎵
                                            </div>

                                            <audio
                                                src={
                                                    form.coverImage
                                                }
                                                controls
                                                className="w-full"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="
                                                flex
                                                flex-col
                                                items-center
                                                justify-center
                                                gap-3
                                                bg-[#0b1728]
                                                px-5
                                                py-10
                                                text-center
                                            "
                                        >
                                            <div
                                                className="
                                                    text-5xl
                                                "
                                            >
                                                {getMediaIcon(
                                                    mediaType
                                                )}
                                            </div>

                                            <p
                                                className="
                                                    text-sm
                                                    text-slate-300
                                                "
                                            >
                                                File uploaded
                                                successfully
                                            </p>

                                            <a
                                                href={
                                                    form.coverImage
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-cyan-400/20
                                                    bg-cyan-400/10
                                                    px-4
                                                    py-2
                                                    text-xs
                                                    font-medium
                                                    text-cyan-300
                                                    hover:bg-cyan-400/20
                                                "
                                            >
                                                Open File
                                            </a>
                                        </div>
                                    )}

                                    {/* REMOVE */}

                                    <div
                                        className="
                                            border-t
                                            border-white/10
                                            p-3
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={
                                                handleRemoveMedia
                                            }
                                            disabled={
                                                uploading ||
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
                                            Remove Media
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* TAGS */}

                        <div>
                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                "
                            >
                                Tags
                            </label>

                            <input
                                type="text"
                                name="tags"
                                value={
                                    form.tags
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="mern, javascript, web-development"
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
                                "
                            />

                            <p
                                className="
                                    mt-1.5
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Separate with commas.
                            </p>
                        </div>

                        {/* TECHNOLOGIES */}

                        <div>
                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                "
                            >
                                Technologies
                            </label>

                            <input
                                type="text"
                                name="technologies"
                                value={
                                    form.technologies
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="React, Node.js, MongoDB"
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
                                "
                            />

                            <p
                                className="
                                    mt-1.5
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Separate with commas.
                            </p>
                        </div>

                        {/* LINKS */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                md:grid-cols-3
                            "
                        >
                            <div>
                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        text-slate-200
                                    "
                                >
                                    GitHub URL
                                </label>

                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={
                                        form.githubUrl
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="https://github.com/..."
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-3
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        focus:border-cyan-400/40
                                    "
                                />
                            </div>

                            <div>
                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        text-slate-200
                                    "
                                >
                                    Demo URL
                                </label>

                                <input
                                    type="url"
                                    name="demoUrl"
                                    value={
                                        form.demoUrl
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
                                        px-3
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        focus:border-cyan-400/40
                                    "
                                />
                            </div>

                            <div>
                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        text-slate-200
                                    "
                                >
                                    External URL
                                </label>

                                <input
                                    type="url"
                                    name="externalUrl"
                                    value={
                                        form.externalUrl
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
                                        px-3
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        focus:border-cyan-400/40
                                    "
                                />
                            </div>
                        </div>

                        {/* ORDER */}

                        <div>
                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                "
                            >
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
                                "
                            />
                        </div>

                        {/* FEATURED */}

                        <label
                            className="
                                flex
                                cursor-pointer
                                items-start
                                gap-3
                                rounded-2xl
                                border
                                border-cyan-400/10
                                bg-cyan-400/[0.03]
                                p-4
                            "
                        >
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={
                                    form.isFeatured
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
                                <span
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-white
                                    "
                                >
                                    Featured Post
                                </span>

                                <span
                                    className="
                                        mt-1
                                        block
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    Highlight this post
                                    on your portfolio.
                                </span>
                            </span>
                        </label>

                        {/* PUBLISHED */}

                        <label
                            className="
                                flex
                                cursor-pointer
                                items-start
                                gap-3
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.02]
                                p-4
                            "
                        >
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
                                <span
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-white
                                    "
                                >
                                    Published
                                </span>

                                <span
                                    className="
                                        mt-1
                                        block
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    Make this post visible
                                    on the public portfolio.
                                </span>
                            </span>
                        </label>
                    </div>

                    {/* ACTIONS */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-white/10
                            pt-5
                            sm:flex-row
                            sm:justify-end
                        "
                    >
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={
                                submitting ||
                                uploading
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
                                uploading
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
                                disabled:opacity-50
                            "
                        >
                            {submitting
                                ? "Saving..."
                                : editing
                                    ? "Update Post"
                                    : "Create Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ========================================
// POST CARD
// ========================================

function PostViewModal({
    post,
    onClose
}) {
    const mediaType = getMediaType(post.coverImage);
    const tags = normalizeArray(post.tags);
    const technologies = normalizeArray(post.technologies);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <article className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#07111f] shadow-[0_0_70px_rgba(0,200,255,0.12)]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-2.5 py-1 text-xs capitalize text-cyan-300">
                            {post.postType || "blog"}
                        </span>
                        <span className={`text-xs ${post.isPublished ? "text-emerald-300" : "text-slate-500"}`}>
                            {post.isPublished ? "Published" : "Draft"}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-xl text-slate-400 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                        aria-label="Close post preview"
                    >
                        ×
                    </button>
                </div>

                <div className="max-h-[80vh] overflow-y-auto p-5 sm:p-7">
                    {post.coverImage && mediaType === "image" ? (
                        <img
                            src={post.coverImage}
                            alt={post.title || "Post cover"}
                            className="mb-6 max-h-[420px] w-full rounded-xl border border-white/10 bg-[#0b1728] object-cover"
                        />
                    ) : null}

                    {post.coverImage && mediaType === "video" ? (
                        <video
                            src={post.coverImage}
                            controls
                            preload="metadata"
                            className="mb-6 max-h-[420px] w-full rounded-xl border border-white/10 bg-black"
                        />
                    ) : null}

                    {post.coverImage && mediaType === "audio" ? (
                        <audio src={post.coverImage} controls className="mb-6 w-full" />
                    ) : null}

                    {post.coverImage && mediaType === "pdf" ? (
                        <iframe
                            src={post.coverImage}
                            title={`${post.title || "Post"} PDF`}
                            className="mb-6 h-[70vh] w-full rounded-xl border border-white/10 bg-white"
                        />
                    ) : null}

                    <h2 className="break-words text-2xl font-bold text-white sm:text-3xl">
                        {post.title || "Untitled Post"}
                    </h2>

                    {post.excerpt ? (
                        <p className="mt-3 text-base leading-7 text-slate-300">
                            {post.excerpt}
                        </p>
                    ) : null}

                    {post.content ? (
                        <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-300 sm:text-base">
                            {post.content}
                        </div>
                    ) : null}

                    {tags.length > 0 ? (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span key={`${tag}-${index}`} className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    ) : null}

                    {technologies.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {technologies.map((technology, index) => (
                                <span key={`${technology}-${index}`} className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03] px-2.5 py-1 text-xs text-cyan-300">
                                    {technology}
                                </span>
                            ))}
                        </div>
                    ) : null}

                    <div className="mt-6 flex flex-wrap gap-2">
                        {post.githubUrl ? <a href={post.githubUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06]">GitHub ↗</a> : null}
                        {post.demoUrl ? <a href={post.demoUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03] px-3 py-2 text-xs text-cyan-300 hover:bg-cyan-400/10">Demo ↗</a> : null}
                        {post.externalUrl ? <a href={post.externalUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06]">External ↗</a> : null}
                        {post.coverImage && (mediaType === "file" || mediaType === "pdf") ? <a href={post.coverImage} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.06]">Open attachment ↗</a> : null}
                    </div>
                </div>
            </article>
        </div>
    );
}

function PostCard({
    post,
    onView,
    onEdit,
    onDelete,
    onPublished,
    onFeatured
}) {
    const mediaType =
        getMediaType(
            post.coverImage
        );

    const [
        mediaFailed,
        setMediaFailed
    ] = useState(false);

    const tags =
        normalizeArray(
            post.tags
        );

    const technologies =
        normalizeArray(
            post.technologies
        );

    return (
        <article
            className="
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#07111f]
                transition
                hover:border-cyan-400/30
                hover:shadow-[0_0_35px_rgba(0,200,255,0.07)]
            "
        >
            {/* MEDIA */}

    {post.coverImage ? (
        <div className="border-b border-white/10">

            {mediaFailed ? (
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        bg-[#0b1728]
                        px-4
                        py-4
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
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-cyan-400/20
                                bg-cyan-400/10
                                text-xl
                            "
                        >
                            {getMediaIcon(
                                mediaType
                            )}
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-white
                                "
                            >
                                Attached File
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    truncate
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Preview unavailable
                            </p>
                        </div>
                    </div>

                    <a
                        href={
                            post.coverImage
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="
                            shrink-0
                            rounded-lg
                            bg-cyan-400
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-slate-950
                            hover:bg-cyan-300
                        "
                    >
                        Open File ↗
                    </a>
                </div>
            ) : mediaType === "image" ? (

                <img
                    src={
                        post.coverImage
                    }
                    alt={
                        post.title ||
                        "Post"
                    }
                    className="
                        block
                        h-52
                        w-full
                        object-cover
                    "
                    onError={() => {
                        setMediaFailed(true);
                    }}
                />

            ) : mediaType === "video" ? (

                <div
                    className="
                        flex
                        h-52
                        w-full
                        items-center
                        justify-center
                        bg-black
                    "
                >
                    <video
                        src={
                            post.coverImage
                        }
                        controls
                        preload="metadata"
                        className="
                            h-52
                            w-full
                            bg-black
                            object-contain
                        "
                        onError={() => {
                            setMediaFailed(true);
                        }}
                    />
                </div>

            ) : mediaType === "audio" ? (

                <div
                    className="
                        flex
                        items-center
                        gap-4
                        bg-[#0b1728]
                        px-4
                        py-5
                    "
                >
                    <div
                        className="
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
                            text-xl
                        "
                    >
                        🎵
                    </div>

                    <audio
                        src={
                            post.coverImage
                        }
                        controls
                        className="min-w-0 flex-1"
                        onError={() => {
                            setMediaFailed(true);
                        }}
                    />

                    <a
                        href={
                            post.coverImage
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="
                            shrink-0
                            rounded-lg
                            border
                            border-white/10
                            px-3
                            py-2
                            text-xs
                            text-slate-300
                            hover:bg-white/5
                        "
                    >
                        Open ↗
                    </a>
                </div>

            ) : (

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        bg-[#0b1728]
                        px-4
                        py-4
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
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-cyan-400/20
                                bg-cyan-400/10
                                text-xl
                            "
                        >
                            📎
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-white
                                "
                            >
                                Attached File
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Click to open the file
                            </p>
                        </div>
                    </div>

                    <a
                        href={
                            post.coverImage
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="
                            shrink-0
                            rounded-lg
                            bg-cyan-400
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-slate-950
                            hover:bg-cyan-300
                        "
                    >
                        Open File ↗
                    </a>
                </div>
            )}

            {post.isFeatured ? (
                <span
                    className="
                        absolute
                        left-3
                        top-3
                        rounded-full
                        border
                        border-amber-300/20
                        bg-amber-300/10
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-amber-300
                        backdrop-blur
                    "
                >
                    ⭐ Featured
                </span>
            ) : null}
        </div>
    ) : null}

    {/* BODY */}

            <div className="p-5">
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >
                    <div className="min-w-0">
                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                            "
                        >
                            <span
                                className="
                                    rounded-lg
                                    border
                                    border-cyan-400/10
                                    bg-cyan-400/5
                                    px-2.5
                                    py-1
                                    text-[11px]
                                    capitalize
                                    text-cyan-300
                                "
                            >
                                {
                                    post.postType ||
                                    "blog"
                                }
                            </span>

                            <span
                                className={`
                                    rounded-lg
                                    border
                                    px-2.5
                                    py-1
                                    text-[11px]
                                    ${
                                        post.isPublished
                                            ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                                            : "border-slate-400/10 bg-slate-400/5 text-slate-500"
                                    }
                                `}
                            >
                                {post.isPublished
                                    ? "Published"
                                    : "Draft"}
                            </span>
                        </div>

                        <h3
                            className="
                                mt-3
                                break-words
                                text-xl
                                font-bold
                                text-white
                            "
                        >
                            {post.title ||
                                "Untitled Post"}
                        </h3>

                        {post.excerpt ? (
                            <p
                                className="
                                    mt-2
                                    line-clamp-3
                                    text-sm
                                    leading-6
                                    text-slate-400
                                "
                            >
                                {
                                    post.excerpt
                                }
                            </p>
                        ) : null}



                        {post.content ? (
    <p
        className="
            mt-3
            line-clamp-4
            whitespace-pre-line
            text-sm
            leading-6
            text-slate-400
        "
    >
        {
            post.content
        }
    </p>
) : null}
                    </div>
                </div>

                {/* TAGS */}

                {tags.length > 0 ? (
                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            gap-2
                        "
                    >
                        {tags.map(
                            (
                                tag,
                                index
                            ) => (
                                <span
                                    key={`${tag}-${index}`}
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
                                    #{tag}
                                </span>
                            )
                        )}
                    </div>
                ) : null}

                {/* TECHNOLOGIES */}

                {technologies.length > 0 ? (
                    <div
                        className="
                            mt-3
                            flex
                            flex-wrap
                            gap-2
                        "
                    >
                        {technologies.map(
                            (
                                technology,
                                index
                            ) => (
                                <span
                                    key={`${technology}-${index}`}
                                    className="
                                        rounded-lg
                                        border
                                        border-cyan-400/10
                                        bg-cyan-400/[0.03]
                                        px-2.5
                                        py-1
                                        text-xs
                                        text-cyan-300
                                    "
                                >
                                    {
                                        technology
                                    }
                                </span>
                            )
                        )}
                    </div>
                ) : null}

                {/* LINKS */}

                <div
                    className="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                    "
                >
                    {post.githubUrl ? (
                        <a
                            href={
                                post.githubUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                                rounded-lg
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-3
                                py-2
                                text-xs
                                text-slate-300
                                hover:bg-white/[0.06]
                            "
                        >
                            GitHub
                        </a>
                    ) : null}

                    {post.demoUrl ? (
                        <a
                            href={
                                post.demoUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                                rounded-lg
                                border
                                border-cyan-400/10
                                bg-cyan-400/[0.03]
                                px-3
                                py-2
                                text-xs
                                text-cyan-300
                                hover:bg-cyan-400/10
                            "
                        >
                            Demo
                        </a>
                    ) : null}

                    {post.externalUrl ? (
                        <a
                            href={
                                post.externalUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                                rounded-lg
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-3
                                py-2
                                text-xs
                                text-slate-300
                                hover:bg-white/[0.06]
                            "
                        >
                            External
                        </a>
                    ) : null}
                </div>

                

                {/* ACTIONS */}

                <div
                    className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-2
                        border-t
                        border-white/10
                        pt-4
                    "
                >
                    <button
                        type="button"
                        onClick={onView}
                        className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03] px-3 py-2.5 text-xs text-cyan-300 hover:bg-cyan-400/10"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        onClick={
                            onEdit
                        }
                        className="
                            rounded-lg
                            border
                            border-white/10
                            bg-white/[0.03]
                            px-3
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
                            onDelete
                        }
                        className="
                            rounded-lg
                            border
                            border-red-400/10
                            bg-red-400/[0.03]
                            px-3
                            py-2.5
                            text-xs
                            text-red-300
                            hover:bg-red-500/10
                        "
                    >
                        Delete
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
                            px-3
                            py-2.5
                            text-xs
                            text-cyan-300
                            hover:bg-cyan-400/10
                        "
                    >
                        {post.isPublished
                            ? "Unpublish"
                            : "Publish"}
                    </button>

                    <button
                        type="button"
                        onClick={
                            onFeatured
                        }
                        className="
                            rounded-lg
                            border
                            border-amber-400/10
                            bg-amber-400/[0.03]
                            px-3
                            py-2.5
                            text-xs
                            text-amber-300
                            hover:bg-amber-400/10
                        "
                    >
                        {post.isFeatured
                            ? "Unfeature"
                            : "Feature"}
                    </button>
                </div>
            </div>
        </article>
    );
}

// ========================================
// MAIN PAGE
// ========================================

export default function PostsPage() {
    const [
        posts,
        setPosts
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
        editingPost,
        setEditingPost
    ] = useState(null);

    const [
        viewingPost,
        setViewingPost
    ] = useState(null);

    const [
        submitting,
        setSubmitting
    ] = useState(false);

    // ========================================
    // LOAD POSTS
    // ========================================

    async function loadPosts() {
        try {
            setLoading(true);
            setError("");

            const response =
                await getMyPosts();

            setPosts(
                Array.isArray(
                    response?.data
                )
                    ? response.data
                    : []
            );
        } catch (error) {
            setError(
                getErrorMessage(
                    error
                )
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    // ========================================
    // CREATE
    // ========================================

    function handleCreate() {
        setEditingPost(null);

        setForm({
            ...initialForm
        });

        setError("");

        setShowForm(true);
    }

    // ========================================
    // EDIT
    // ========================================

    function handleEdit(post) {
        setEditingPost(post);

        setForm({
            title:
                post.title || "",

            slug:
                post.slug || "",

            excerpt:
                post.excerpt || "",

            content:
                post.content || "",

            coverImage:
                post.coverImage || "",

            postType:
                post.postType || "blog",

            tags:
                normalizeArray(
                    post.tags
                ).join(", "),

            technologies:
                normalizeArray(
                    post.technologies
                ).join(", "),

            githubUrl:
                post.githubUrl || "",

            demoUrl:
                post.demoUrl || "",

            externalUrl:
                post.externalUrl || "",

            isFeatured:
                Boolean(
                    post.isFeatured
                ),

            isPublished:
                Boolean(
                    post.isPublished
                ),

            order:
                Math.max(
                    0,
                    Number(
                        post.order || 0
                    ) || 0
                )
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

        // ========================================
        // REQUIRED TITLE CHECK
        // ========================================

        if (!form.title.trim()) {
            setError(
                "Post title is required."
            );

            return;
        }

        try {
            setSubmitting(true);
            setError("");

            // ========================================
            // TAGS
            // ========================================

            const tags =
                form.tags
                    .split(",")
                    .map(
                        (item) =>
                            item.trim()
                    )
                    .filter(Boolean);

            // ========================================
            // TECHNOLOGIES
            // ========================================

            const technologies =
                form.technologies
                    .split(",")
                    .map(
                        (item) =>
                            item.trim()
                    )
                    .filter(Boolean);

            // ========================================
            // BASE PAYLOAD
            // ========================================

            const payload = {
                title:
                    form.title.trim(),

                excerpt:
                    form.excerpt.trim(),

                content:
                    form.content,

                postType:
                    form.postType,

                tags,

                technologies,

                isFeatured:
                    Boolean(
                        form.isFeatured
                    ),

                isPublished:
                    Boolean(
                        form.isPublished
                    ),

                order:
                    Math.max(
                        0,
                        Number(
                            form.order
                        ) || 0
                    )
            };

            // ========================================
            // ONLY SEND NON-EMPTY OPTIONAL STRINGS
            // ========================================
            // IMPORTANT:
            // validator checks empty slug/url
            // strings and can return 400.

            const slug =
                form.slug.trim();

            const coverImage =
                form.coverImage.trim();

            const githubUrl =
                form.githubUrl.trim();

            const demoUrl =
                form.demoUrl.trim();

            const externalUrl =
                form.externalUrl.trim();

            if (slug) {
                payload.slug = slug;
            }

            if (coverImage) {
                payload.coverImage =
                    coverImage;
            }

            if (githubUrl) {
                payload.githubUrl =
                    githubUrl;
            }

            if (demoUrl) {
                payload.demoUrl =
                    demoUrl;
            }

            if (externalUrl) {
                payload.externalUrl =
                    externalUrl;
            }

            // ========================================
            // UPDATE
            // ========================================

            if (editingPost) {
                const response =
                    await updatePost(
                        editingPost._id,
                        payload
                    );

                const updated =
                    response?.data;

                if (!updated) {
                    throw new Error(
                        "Updated post data not received."
                    );
                }

                setPosts(
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
                    await createPost(
                        payload
                    );

                const created =
                    response?.data;

                if (!created) {
                    throw new Error(
                        "Created post data not received."
                    );
                }

                setPosts(
                    (previous) => [
                        created,
                        ...previous
                    ]
                );
            }

            // ========================================
            // RESET
            // ========================================

            setShowForm(false);

            setEditingPost(null);

            setForm({
                ...initialForm
            });
        } catch (error) {
            setError(
                getErrorMessage(
                    error
                )
            );
        } finally {
            setSubmitting(false);
        }
    }

    // ========================================
    // DELETE
    // ========================================

    async function handleDelete(post) {
        const confirmed =
            window.confirm(
                `Delete "${
                    post.title ||
                    "this post"
                }"? This action cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deletePost(
                post._id
            );

            setPosts(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item._id !==
                            post._id
                    )
            );
        } catch (error) {
            setError(
                getErrorMessage(
                    error
                )
            );
        }
    }

    // ========================================
    // PUBLISHED
    // ========================================

    async function handlePublished(post) {
        try {
            setError("");

            const response =
                await togglePostPublished(
                    post._id
                );

            const updated =
                response?.data;

            if (!updated) {
                throw new Error(
                    "Updated post data not received."
                );
            }

            setPosts(
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
                getErrorMessage(
                    error
                )
            );
        }
    }

    // ========================================
    // FEATURED
    // ========================================

    async function handleFeatured(post) {
        try {
            setError("");

            const response =
                await togglePostFeatured(
                    post._id
                );

            const updated =
                response?.data;

            if (!updated) {
                throw new Error(
                    "Updated post data not received."
                );
            }

            setPosts(
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
                getErrorMessage(
                    error
                )
            );
        }
    }

    // ========================================
    // CLOSE FORM
    // ========================================

    function handleCloseForm() {
        if (submitting) {
            return;
        }

        setShowForm(false);

        setEditingPost(null);

        setForm({
            ...initialForm
        });
    }

    // ========================================
    // LOADING
    // ========================================

    if (loading) {
        return (
            <div
                className="
                    flex
                    min-h-[500px]
                    items-center
                    justify-center
                    bg-[#020817]
                "
            >
                <div
                    className="
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-2
                        border-cyan-400/20
                        border-t-cyan-400
                    "
                />
            </div>
        );
    }

    return (
        <div
            className="
                min-h-screen
                w-full
                space-y-6
                bg-[#020817]
                px-4
                py-6
                text-white
                sm:px-6
                lg:px-8
            "
        >
            {/* HEADER */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >
                    <div
                        className="
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
                        "
                    >
                        📝
                    </div>

                    <div>
                        <h1
                            className="
                                text-2xl
                                font-bold
                                sm:text-3xl
                            "
                        >
                            Posts
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-400
                            "
                        >
                            Create and manage your
                            portfolio posts.
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
                    + Create Post
                </button>
            </div>

            {/* ERROR */}

            {error ? (
                <div
                    className="
                        rounded-xl
                        border
                        border-red-400/20
                        bg-red-400/5
                        px-4
                        py-3
                        text-sm
                        text-red-300
                    "
                >
                    ⚠ {error}
                </div>
            ) : null}

            {/* STATS */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    lg:grid-cols-4
                "
            >
                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#07111f]
                        p-4
                    "
                >
                    <p
                        className="
                            text-xs
                            text-slate-500
                        "
                    >
                        Total Posts
                    </p>

                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                        "
                    >
                        {posts.length}
                    </p>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#07111f]
                        p-4
                    "
                >
                    <p
                        className="
                            text-xs
                            text-slate-500
                        "
                    >
                        Published
                    </p>

                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-emerald-400
                        "
                    >
                        {
                            posts.filter(
                                (item) =>
                                    item.isPublished
                            ).length
                        }
                    </p>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#07111f]
                        p-4
                    "
                >
                    <p
                        className="
                            text-xs
                            text-slate-500
                        "
                    >
                        Featured
                    </p>

                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-amber-300
                        "
                    >
                        {
                            posts.filter(
                                (item) =>
                                    item.isFeatured
                            ).length
                        }
                    </p>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#07111f]
                        p-4
                    "
                >
                    <p
                        className="
                            text-xs
                            text-slate-500
                        "
                    >
                        Drafts
                    </p>

                    <p
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-slate-300
                        "
                    >
                        {
                            posts.filter(
                                (item) =>
                                    !item.isPublished
                            ).length
                        }
                    </p>
                </div>
            </div>

            {/* EMPTY STATE */}

            {posts.length === 0 ? (
                <div
                    className="
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
                    "
                >
                    <div
                        className="
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            rounded-2xl
                            bg-cyan-400/10
                            text-3xl
                        "
                    >
                        📝
                    </div>

                    <h2
                        className="
                            mt-5
                            text-xl
                            font-bold
                        "
                    >
                        No posts yet
                    </h2>

                    <p
                        className="
                            mt-2
                            max-w-md
                            text-sm
                            leading-6
                            text-slate-400
                        "
                    >
                        Create blogs, project updates,
                        achievements and announcements.
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
                        Create Your First Post
                    </button>
                </div>
            ) : (
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        xl:grid-cols-2
                    "
                >
                    {posts.map(
                        (post) => (
                            <PostCard
                                key={
                                    post._id
                                }
                                post={
                                    post
                                }
                                onView={() =>
                                    setViewingPost(post)
                                }
                                onEdit={() =>
                                    handleEdit(
                                        post
                                    )
                                }
                                onDelete={() =>
                                    handleDelete(
                                        post
                                    )
                                }
                                onPublished={() =>
                                    handlePublished(
                                        post
                                    )
                                }
                                onFeatured={() =>
                                    handleFeatured(
                                        post
                                    )
                                }
                            />
                        )
                    )}
                </div>
            )}

            {/* FORM */}

            {showForm ? (
                <PostForm
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
                    editing={
                        Boolean(
                            editingPost
                        )
                    }
                />
            ) : null}

            {viewingPost ? (
                <PostViewModal
                    post={viewingPost}
                    onClose={() =>
                        setViewingPost(null)
                    }
                />
            ) : null}
        </div>
    );
}
