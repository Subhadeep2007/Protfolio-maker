import {
    useEffect,
    useState
} from "react";

import {
    getMyProjects,
    createProject,
    updateProject,
    deleteProject,
    toggleProjectFeatured,
    toggleProjectPublished
} from "../../../api/projects.api";


// ========================================
// INITIAL FORM
// ========================================

const initialForm = {
    title: "",
    description: "",
    image: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    category: "",
    featured: false,
    order: 0,
    isPublished: true
};


// ========================================
// ERROR MESSAGE
// ========================================

const getErrorMessage = (error) => {

    return (
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        error?.message ||
        "Something went wrong"
    );

};


// ========================================
// PROJECT FORM
// ========================================

function ProjectForm({
    form,
    setForm,
    onSubmit,
    onCancel,
    submitting,
    editing
}) {

    // ========================================
    // ESC CLOSE
    // ========================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (
                event.key === "Escape" &&
                !submitting
            ) {
                onCancel();
            }

        };

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

    }, [onCancel, submitting]);


    // ========================================
    // CHANGE
    // ========================================

    const handleChange = (event) => {

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

    };


    // ========================================
    // IMAGE CHANGE
    // ========================================

    const handleImageChange = (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert("Please select a valid image file.");

            event.target.value = "";

            return;
        }

        if (file.size > 2 * 1024 * 1024) {

            alert("Image size must be less than 2MB.");

            event.target.value = "";

            return;
        }

        const reader = new FileReader();

        reader.onload = () => {

            setForm((previous) => ({
                ...previous,
                image: reader.result
            }));

        };

        reader.onerror = () => {

            alert("Unable to read the selected image.");

        };

        reader.readAsDataURL(file);

    };


    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = (event) => {

        event.preventDefault();

        onSubmit();

    };


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
                bg-black/75
                p-4
                backdrop-blur-md
            "
            onMouseDown={(event) => {

                if (
                    event.target === event.currentTarget &&
                    !submitting
                ) {
                    onCancel();
                }

            }}
        >

            <div
                className="
                    relative
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

                {/* ========================================
                    HEADER
                ======================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-white/10
                        bg-[#07111f]
                        px-5
                        py-4
                    "
                >

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-cyan-400/20
                            bg-cyan-400/10
                            text-cyan-300
                        ">
                            ◈
                        </div>

                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-white
                                sm:text-xl
                            ">
                                {editing
                                    ? "Edit Project"
                                    : "Create Project"}
                            </h2>

                            <p className="
                                mt-0.5
                                text-xs
                                text-slate-500
                                sm:text-sm
                            ">
                                {editing
                                    ? "Update your project details"
                                    : "Add a new project to your portfolio"}
                            </p>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        aria-label="Close"
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.03]
                            text-xl
                            leading-none
                            text-slate-400
                            transition
                            hover:border-cyan-400/30
                            hover:bg-cyan-400/10
                            hover:text-cyan-300
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        ×
                    </button>

                </div>


                {/* ========================================
                    FORM BODY
                ======================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        overflow-y-auto
                        p-5
                        sm:p-6
                    "
                >

                    <div className="space-y-5">

                        {/* ========================================
                            TITLE
                        ======================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-200
                            ">
                                Project Title
                                <span className="
                                    ml-1
                                    text-cyan-400
                                ">
                                    *
                                </span>
                            </label>


                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                maxLength={100}
                                required
                                autoFocus
                                placeholder="Meeting Room"
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
                                    transition
                                    placeholder:text-slate-500
                                    focus:border-cyan-400/40
                                    focus:ring-4
                                    focus:ring-cyan-400/5
                                "
                            />


                            <div className="
                                mt-1.5
                                flex
                                justify-end
                            ">
                                <span className="
                                    text-[11px]
                                    text-slate-500
                                ">
                                    {form.title.length}/100
                                </span>
                            </div>

                        </div>


                        {/* ========================================
                            DESCRIPTION
                        ======================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-200
                            ">
                                Project Description
                                <span className="
                                    ml-1
                                    text-cyan-400
                                ">
                                    *
                                </span>
                            </label>


                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                maxLength={2000}
                                required
                                rows={7}
                                placeholder="Describe what the project does, what problem it solves, and the technologies you used..."
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
                                    transition
                                    placeholder:text-slate-500
                                    focus:border-cyan-400/40
                                    focus:ring-4
                                    focus:ring-cyan-400/5
                                "
                            />


                            <div className="
                                mt-1.5
                                flex
                                justify-end
                            ">
                                <span className="
                                    text-[11px]
                                    text-slate-500
                                ">
                                    {form.description.length}/2000
                                </span>
                            </div>

                        </div>


                        {/* ========================================
                            PROJECT IMAGE
                        ======================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-200
                            ">
                                Project Image
                            </label>


                            <label className="
                                flex
                                min-h-40
                                cursor-pointer
                                flex-col
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-2xl
                                border
                                border-dashed
                                border-cyan-400/20
                                bg-cyan-400/[0.02]
                                px-5
                                py-6
                                text-center
                                transition
                                hover:border-cyan-400/40
                                hover:bg-cyan-400/[0.05]
                            ">

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />


                                {form.image ? (

                                    <div className="w-full">

                                        <img
                                            src={form.image}
                                            alt="Project preview"
                                            className="
                                                mx-auto
                                                h-48
                                                w-full
                                                rounded-xl
                                                border
                                                border-white/10
                                                object-cover
                                            "
                                        />


                                        <div className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            text-sm
                                            font-medium
                                            text-cyan-300
                                        ">
                                            <span>
                                                Change image
                                            </span>

                                            <span>
                                                ↗
                                            </span>
                                        </div>

                                    </div>

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
                                            text-cyan-300
                                        ">
                                            ↑
                                        </div>


                                        <p className="
                                            mt-4
                                            text-sm
                                            font-medium
                                            text-slate-200
                                        ">
                                            Upload project image
                                        </p>


                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        ">
                                            PNG, JPG, JPEG, WEBP · Max 2MB
                                        </p>

                                    </>

                                )}

                            </label>


                            <p className="
                                mt-2
                                text-xs
                                leading-5
                                text-slate-500
                            ">
                                Select a clear screenshot or cover image
                                of your project.
                            </p>

                        </div>


                        {/* ========================================
                            CATEGORY + ORDER
                        ======================================== */}

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
                                    Category
                                </label>


                                <input
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    maxLength={50}
                                    placeholder="MERN Stack"
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
                                        transition
                                        placeholder:text-slate-500
                                        focus:border-cyan-400/40
                                        focus:ring-4
                                        focus:ring-cyan-400/5
                                    "
                                />


                                <div className="
                                    mt-1.5
                                    flex
                                    justify-end
                                ">
                                    <span className="
                                        text-[11px]
                                        text-slate-500
                                    ">
                                        {form.category.length}/50
                                    </span>
                                </div>

                            </div>


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
                                    value={form.order}
                                    min="0"
                                    step="1"
                                    onChange={handleChange}
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
                                        transition
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
                                    Smaller number appears first.
                                </p>

                            </div>

                        </div>


                        {/* ========================================
                            TECHNOLOGIES
                        ======================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-200
                            ">
                                Technologies
                            </label>


                            <input
                                name="technologies"
                                value={form.technologies}
                                onChange={handleChange}
                                placeholder="React, Node.js, Express, MongoDB"
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
                                    transition
                                    placeholder:text-slate-500
                                    focus:border-cyan-400/40
                                    focus:ring-4
                                    focus:ring-cyan-400/5
                                "
                            />


                            <p className="
                                mt-1.5
                                text-xs
                                leading-5
                                text-slate-500
                            ">
                                Separate each technology with a comma.
                            </p>


                            {form.technologies ? (
                                <div className="
                                    mt-3
                                    flex
                                    flex-wrap
                                    gap-2
                                ">

                                    {form.technologies
                                        .split(",")
                                        .map((item) => item.trim())
                                        .filter(Boolean)
                                        .map((technology, index) => (
                                            <span
                                                key={`${technology}-${index}`}
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-cyan-400/10
                                                    bg-cyan-400/5
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    text-cyan-300
                                                "
                                            >
                                                {technology}
                                            </span>
                                        ))
                                    }

                                </div>
                            ) : null}

                        </div>


                        {/* ========================================
                            URLs
                        ======================================== */}

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
                                    GitHub URL
                                </label>


                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={form.githubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username/project"
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
                                        transition
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
                                    Live Demo URL
                                </label>


                                <input
                                    type="url"
                                    name="liveUrl"
                                    value={form.liveUrl}
                                    onChange={handleChange}
                                    placeholder="https://my-project.com"
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
                                        transition
                                        placeholder:text-slate-500
                                        focus:border-cyan-400/40
                                        focus:ring-4
                                        focus:ring-cyan-400/5
                                    "
                                />

                            </div>

                        </div>


                        {/* ========================================
                            SETTINGS
                        ======================================== */}

                        <div className="
                            grid
                            grid-cols-1
                            gap-3
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.02]
                            p-4
                            sm:grid-cols-2
                        ">

                            <label className="
                                flex
                                cursor-pointer
                                items-center
                                gap-3
                                rounded-xl
                                p-2
                                hover:bg-white/[0.03]
                            ">

                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={form.featured}
                                    onChange={handleChange}
                                    className="
                                        h-4
                                        w-4
                                        shrink-0
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
                                        Featured Project
                                    </span>


                                    <span className="
                                        mt-0.5
                                        block
                                        text-xs
                                        text-slate-500
                                    ">
                                        Highlight this project
                                    </span>

                                </span>

                            </label>


                            <label className="
                                flex
                                cursor-pointer
                                items-center
                                gap-3
                                rounded-xl
                                p-2
                                hover:bg-white/[0.03]
                            ">

                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    checked={form.isPublished}
                                    onChange={handleChange}
                                    className="
                                        h-4
                                        w-4
                                        shrink-0
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
                                        mt-0.5
                                        block
                                        text-xs
                                        text-slate-500
                                    ">
                                        Show this project publicly
                                    </span>

                                </span>

                            </label>

                        </div>

                    </div>


                    {/* ========================================
                        ACTIONS
                    ======================================== */}

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
                            onClick={onCancel}
                            disabled={submitting}
                            className="
                                rounded-xl
                                border
                                border-white/10
                                px-5
                                py-3
                                text-sm
                                font-medium
                                text-slate-300
                                transition
                                hover:border-white/20
                                hover:bg-white/5
                                hover:text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={submitting}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-xl
                                bg-cyan-400
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-slate-950
                                shadow-[0_0_25px_rgba(0,220,255,0.1)]
                                transition
                                hover:bg-cyan-300
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {submitting
                                ? "Saving..."
                                : editing
                                    ? "Update Project"
                                    : "Create Project"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );

}


// ========================================
// PROJECT CARD
// ========================================

function ProjectCard({
    project,
    onEdit,
    onDelete,
    onFeatured,
    onPublished
}) {

    return (
        <article className="
            group
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-[#07111f]
            shadow-[0_0_30px_rgba(0,0,0,0.2)]
            transition
            duration-300
            hover:-translate-y-1
            hover:border-cyan-400/30
        ">

            {/* IMAGE */}

            <div className="
                relative
                h-52
                overflow-hidden
                bg-slate-950
            ">

                {project.image ? (
                    <img
                        src={project.image}
                        alt={project.title}
                        className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                        "
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        bg-[radial-gradient(circle_at_center,_rgba(0,220,255,0.12),_transparent_60%)]
                    ">
                        <div className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-cyan-400/20
                            bg-cyan-400/5
                            text-2xl
                            text-cyan-300/50
                        ">
                            ◈
                        </div>
                    </div>
                )}


                {/* OVERLAY */}

                <div className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-20
                    bg-gradient-to-t
                    from-black/50
                    to-transparent
                " />


                {/* CATEGORY */}

                {project.category ? (
                    <span className="
                        absolute
                        left-3
                        top-3
                        max-w-[70%]
                        truncate
                        rounded-full
                        border
                        border-cyan-300/20
                        bg-black/60
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-cyan-300
                        backdrop-blur
                    ">
                        {project.category}
                    </span>
                ) : null}


                {/* FEATURED */}

                {project.featured ? (
                    <span className="
                        absolute
                        right-3
                        top-3
                        rounded-full
                        border
                        border-yellow-400/20
                        bg-black/60
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-yellow-300
                        backdrop-blur
                    ">
                        ★ Featured
                    </span>
                ) : null}

            </div>


            {/* CONTENT */}

            <div className="p-5">

                <div className="min-h-[165px]">

                    <h3 className="
                        line-clamp-1
                        text-lg
                        font-bold
                        text-white
                    ">
                        {project.title}
                    </h3>


                    <p className="
                        mt-2
                        line-clamp-4
                        text-sm
                        leading-6
                        text-slate-400
                    ">
                        {project.description}
                    </p>


                    {/* TECHNOLOGIES */}

                    {project.technologies?.length > 0 ? (
                        <div className="
                            mt-4
                            flex
                            flex-wrap
                            gap-2
                        ">

                            {project.technologies.map(
                                (technology, index) => (
                                    <span
                                        key={`${technology}-${index}`}
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
                                        {technology}
                                    </span>
                                )
                            )}

                        </div>
                    ) : null}

                </div>


                {/* LINKS */}

                <div className="
                    mt-5
                    flex
                    min-h-[38px]
                    flex-wrap
                    gap-2
                ">

                    {project.githubUrl ? (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-lg
                                border
                                border-white/10
                                bg-white/[0.02]
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-slate-300
                                transition
                                hover:border-cyan-400/30
                                hover:bg-cyan-400/5
                                hover:text-cyan-300
                            "
                        >
                            GitHub
                            <span>↗</span>
                        </a>
                    ) : null}


                    {project.liveUrl ? (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-lg
                                border
                                border-cyan-400/20
                                bg-cyan-400/5
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-cyan-300
                                transition
                                hover:bg-cyan-400/10
                            "
                        >
                            Live Demo
                            <span>↗</span>
                        </a>
                    ) : null}

                </div>


                {/* STATUS */}

                <div className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    px-3
                    py-2.5
                ">

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <span
                            className={`
                                h-2
                                w-2
                                rounded-full
                                ${
                                    project.isPublished
                                        ? "bg-emerald-400"
                                        : "bg-slate-600"
                                }
                            `}
                        />

                        <span className="
                            text-xs
                            text-slate-400
                        ">
                            {project.isPublished
                                ? "Published"
                                : "Hidden"}
                        </span>

                    </div>


                    <span className="
                        text-[11px]
                        text-slate-600
                    ">
                        Order {project.order ?? 0}
                    </span>

                </div>


                {/* CONTROLS */}

                <div className="
                    mt-4
                    grid
                    grid-cols-2
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
                            px-3
                            py-2.5
                            text-xs
                            font-medium
                            text-slate-300
                            transition
                            hover:bg-white/[0.06]
                            hover:text-white
                        "
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        onClick={onFeatured}
                        className="
                            rounded-lg
                            border
                            border-yellow-400/10
                            bg-yellow-400/[0.03]
                            px-3
                            py-2.5
                            text-xs
                            font-medium
                            text-yellow-300
                            transition
                            hover:bg-yellow-400/10
                        "
                    >
                        {project.featured
                            ? "Unfeature"
                            : "Feature"}
                    </button>


                    <button
                        type="button"
                        onClick={onPublished}
                        className="
                            rounded-lg
                            border
                            border-cyan-400/10
                            bg-cyan-400/[0.03]
                            px-3
                            py-2.5
                            text-xs
                            font-medium
                            text-cyan-300
                            transition
                            hover:bg-cyan-400/10
                        "
                    >
                        {project.isPublished
                            ? "Unpublish"
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
                            px-3
                            py-2.5
                            text-xs
                            font-medium
                            text-red-300
                            transition
                            hover:bg-red-500/10
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>

        </article>
    );

}


// ========================================
// MAIN PAGE
// ========================================

export default function ProjectsPage() {

    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        ...initialForm
    });

    const [editingProject, setEditingProject] = useState(null);

    const [submitting, setSubmitting] = useState(false);


    // ========================================
    // LOAD
    // ========================================

    const loadProjects = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await getMyProjects();

            setProjects(
                Array.isArray(response?.data)
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

    };


    useEffect(() => {

        loadProjects();

    }, []);


    // ========================================
    // CREATE
    // ========================================

    const handleCreate = () => {

        setEditingProject(null);

        setForm({
            ...initialForm
        });

        setError("");

        setShowForm(true);

    };


    // ========================================
    // EDIT
    // ========================================

    const handleEdit = (project) => {

        setEditingProject(project);

        setForm({

            title: project.title || "",

            description:
                project.description || "",

            image:
                project.image || "",

            technologies:
                Array.isArray(project.technologies)
                    ? project.technologies.join(", ")
                    : "",

            githubUrl:
                project.githubUrl || "",

            liveUrl:
                project.liveUrl || "",

            category:
                project.category || "",

            featured:
                Boolean(project.featured),

            order:
                Number(project.order ?? 0),

            isPublished:
                project.isPublished !== false

        });

        setError("");

        setShowForm(true);

    };


    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = async () => {

        try {

            setSubmitting(true);

            setError("");


            const technologies =
                form.technologies
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);


            const payload = {

                title:
                    form.title.trim(),

                description:
                    form.description.trim(),

                image:
                    form.image.trim(),

                technologies,

                githubUrl:
                    form.githubUrl.trim(),

                liveUrl:
                    form.liveUrl.trim(),

                category:
                    form.category.trim(),

                featured:
                    Boolean(form.featured),

                order:
                    Math.max(
                        0,
                        Number(form.order) || 0
                    ),

                isPublished:
                    Boolean(form.isPublished)

            };


            // ========================================
            // UPDATE
            // ========================================

            if (editingProject) {

                const response =
                    await updateProject(
                        editingProject._id,
                        payload
                    );


                const updatedProject =
                    response?.data;


                if (!updatedProject) {

                    throw new Error(
                        "Updated project data not received"
                    );

                }


                setProjects((previous) =>
                    previous.map((project) =>
                        project._id ===
                        updatedProject._id
                            ? updatedProject
                            : project
                    )
                );

            }

            // ========================================
            // CREATE
            // ========================================

            else {

                const response =
                    await createProject(
                        payload
                    );


                const createdProject =
                    response?.data;


                if (!createdProject) {

                    throw new Error(
                        "Created project data not received"
                    );

                }


                setProjects((previous) => [
                    createdProject,
                    ...previous
                ]);

            }


            setShowForm(false);

            setEditingProject(null);

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

    };


    // ========================================
    // DELETE
    // ========================================

    const handleDelete = async (project) => {

        const confirmed =
            window.confirm(
                `Delete "${project.title}"? This action cannot be undone.`
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");


            await deleteProject(
                project._id
            );


            setProjects((previous) =>
                previous.filter(
                    (item) =>
                        item._id !==
                        project._id
                )
            );

        } catch (error) {

            setError(
                getErrorMessage(error)
            );

        }

    };


    // ========================================
    // FEATURED
    // ========================================

    const handleFeatured =
        async (project) => {

            try {

                setError("");


                const response =
                    await toggleProjectFeatured(
                        project._id
                    );


                const updatedProject =
                    response?.data;


                if (!updatedProject) {

                    throw new Error(
                        "Updated project data not received"
                    );

                }


                setProjects((previous) =>
                    previous.map((item) =>
                        item._id ===
                        updatedProject._id
                            ? updatedProject
                            : item
                    )
                );

            } catch (error) {

                setError(
                    getErrorMessage(error)
                );

            }

        };


    // ========================================
    // PUBLISHED
    // ========================================

    const handlePublished =
        async (project) => {

            try {

                setError("");


                const response =
                    await toggleProjectPublished(
                        project._id
                    );


                const updatedProject =
                    response?.data;


                if (!updatedProject) {

                    throw new Error(
                        "Updated project data not received"
                    );

                }


                setProjects((previous) =>
                    previous.map((item) =>
                        item._id ===
                        updatedProject._id
                            ? updatedProject
                            : item
                    )
                );

            } catch (error) {

                setError(
                    getErrorMessage(error)
                );

            }

        };


    // ========================================
    // CLOSE FORM
    // ========================================

    const handleCloseForm = () => {

        if (submitting) {
            return;
        }


        setShowForm(false);

        setEditingProject(null);

        setForm({
            ...initialForm
        });

    };


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
            ">

                <div className="
                    flex
                    flex-col
                    items-center
                    gap-4
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

                    <p className="
                        text-sm
                        text-slate-500
                    ">
                        Loading projects...
                    </p>

                </div>

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

            {/* ========================================
                HEADER
            ======================================== */}

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
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-cyan-400/20
                        bg-cyan-400/10
                        text-xl
                        text-cyan-300
                    ">
                        ◈
                    </div>


                    <div>

                        <h1 className="
                            text-2xl
                            font-bold
                            tracking-tight
                            text-white
                            sm:text-3xl
                        ">
                            Projects
                        </h1>


                        <p className="
                            mt-1
                            text-sm
                            text-slate-400
                        ">
                            Manage and showcase your best work.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={handleCreate}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-cyan-400
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-slate-950
                        shadow-[0_0_25px_rgba(0,220,255,0.12)]
                        transition
                        hover:bg-cyan-300
                    "
                >
                    <span className="text-base">
                        +
                    </span>

                    Add Project
                </button>

            </div>


            {/* ========================================
                ERROR
            ======================================== */}

            {error ? (
                <div className="
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-400/5
                    px-4
                    py-3
                    text-sm
                    text-red-300
                ">

                    <span>⚠</span>

                    <span>
                        {error}
                    </span>

                </div>
            ) : null}


            {/* ========================================
                STATS
            ======================================== */}

            <div className="
                grid
                grid-cols-2
                gap-3
                sm:gap-4
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
                        Total Projects
                    </p>

                    <p className="
                        mt-1
                        text-2xl
                        font-bold
                        text-white
                    ">
                        {projects.length}
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
                            projects.filter(
                                (project) =>
                                    project.isPublished
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
                        Featured
                    </p>

                    <p className="
                        mt-1
                        text-2xl
                        font-bold
                        text-yellow-300
                    ">
                        {
                            projects.filter(
                                (project) =>
                                    project.featured
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
                            projects.filter(
                                (project) =>
                                    !project.isPublished
                            ).length
                        }
                    </p>
                </div>

            </div>


            {/* ========================================
                PROJECTS
            ======================================== */}

            {projects.length === 0 ? (

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
                        border
                        border-cyan-400/20
                        bg-cyan-400/10
                        text-3xl
                        text-cyan-300
                    ">
                        ◈
                    </div>


                    <h2 className="
                        mt-5
                        text-xl
                        font-bold
                        text-white
                    ">
                        No projects yet
                    </h2>


                    <p className="
                        mt-2
                        max-w-md
                        text-sm
                        leading-6
                        text-slate-400
                    ">
                        Start building your portfolio by adding
                        your first project.
                    </p>


                    <button
                        type="button"
                        onClick={handleCreate}
                        className="
                            mt-6
                            rounded-xl
                            bg-cyan-400
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-slate-950
                            transition
                            hover:bg-cyan-300
                        "
                    >
                        Create Your First Project
                    </button>

                </div>

            ) : (

                <div className="
                    grid
                    grid-cols-1
                    gap-5
                    xl:grid-cols-2
                ">

                    {projects.map((project) => (

                        <ProjectCard
                            key={project._id}
                            project={project}
                            onEdit={() =>
                                handleEdit(project)
                            }
                            onDelete={() =>
                                handleDelete(project)
                            }
                            onFeatured={() =>
                                handleFeatured(project)
                            }
                            onPublished={() =>
                                handlePublished(project)
                            }
                        />

                    ))}

                </div>

            )}


            {/* ========================================
                MODAL
            ======================================== */}

            {showForm ? (

                <ProjectForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseForm}
                    submitting={submitting}
                    editing={Boolean(editingProject)}
                />

            ) : null}

        </div>
    );

}