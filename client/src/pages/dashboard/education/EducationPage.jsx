import {
    useEffect,
    useState
} from "react";

import {
    getMyEducation,
    createEducation,
    updateEducation,
    deleteEducation,
    toggleEducationPublished
} from "../../../api/education.api";


// ========================================
// INITIAL FORM
// ========================================

const initialForm = {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false,
    grade: "",
    description: "",
    achievements: "",
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

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
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
// DATE INPUT NORMALIZER
// ========================================

function normalizeDateForInput(value) {
    if (!value) {
        return "";
    }

    return String(value).slice(0, 10);
}


// ========================================
// ARRAY NORMALIZER
// ========================================

function normalizeArray(value) {
    return Array.isArray(value)
        ? value
        : [];
}


// ========================================
// EDUCATION FORM
// ========================================

function EducationForm({
    form,
    setForm,
    onSubmit,
    onCancel,
    submitting,
    editing
}) {
    // ========================================
    // ESCAPE
    // ========================================

    useEffect(() => {
        function handleKeyDown(event) {
            if (
                event.key === "Escape" &&
                !submitting
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
        submitting
    ]);


    // ========================================
    // HANDLE CHANGE
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
    // CURRENTLY STUDYING
    // ========================================

    function handleCurrentlyStudying(
        event
    ) {
        const checked =
            event.target.checked;

        setForm((previous) => ({
            ...previous,
            currentlyStudying:
                checked,

            endDate:
                checked
                    ? ""
                    : previous.endDate
        }));
    }


    // ========================================
    // SUBMIT
    // ========================================

    function handleSubmit(event) {
        event.preventDefault();

        if (submitting) {
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
                    !submitting
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
                    <div className="flex items-center gap-3">
                        <div
                            className="
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
                                text-xl
                            "
                        >
                            🎓
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
                                    ? "Edit Education"
                                    : "Add Education"}
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500
                                    sm:text-sm
                                "
                            >
                                {editing
                                    ? "Update your academic information"
                                    : "Add your academic background"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        aria-label="Close education form"
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
                        {/* INSTITUTION + DEGREE */}

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
                                    Institution
                                </label>

                                <input
                                    type="text"
                                    name="institution"
                                    value={form.institution}
                                    onChange={handleChange}
                                    maxLength={200}
                                    placeholder="Jadavpur University"
                                    required
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

                                <div className="mt-1.5 flex justify-end">
                                    <span className="text-[11px] text-slate-500">
                                        {form.institution.length}/200
                                    </span>
                                </div>
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
                                    Degree
                                </label>

                                <input
                                    type="text"
                                    name="degree"
                                    value={form.degree}
                                    onChange={handleChange}
                                    maxLength={150}
                                    placeholder="B.Tech"
                                    required
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

                                <div className="mt-1.5 flex justify-end">
                                    <span className="text-[11px] text-slate-500">
                                        {form.degree.length}/150
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* FIELD + LOCATION */}

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
                                    Field of Study
                                </label>

                                <input
                                    type="text"
                                    name="fieldOfStudy"
                                    value={form.fieldOfStudy}
                                    onChange={handleChange}
                                    maxLength={150}
                                    placeholder="Computer Science and Engineering"
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

                                <div className="mt-1.5 flex justify-end">
                                    <span className="text-[11px] text-slate-500">
                                        {form.fieldOfStudy.length}/150
                                    </span>
                                </div>
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
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    maxLength={100}
                                    placeholder="Kolkata, India"
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

                                <div className="mt-1.5 flex justify-end">
                                    <span className="text-[11px] text-slate-500">
                                        {form.location.length}/100
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* DATES */}

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
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    required
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
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={
                                        form.currentlyStudying
                                            ? ""
                                            : form.endDate
                                    }
                                    onChange={handleChange}
                                    disabled={
                                        form.currentlyStudying
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
                                        transition
                                        focus:border-cyan-400/40
                                        focus:ring-4
                                        focus:ring-cyan-400/5
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                />
                            </div>
                        </div>


                        {/* CURRENTLY STUDYING */}

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
                                transition
                                hover:bg-cyan-400/[0.05]
                            "
                        >
                            <input
                                type="checkbox"
                                name="currentlyStudying"
                                checked={
                                    form.currentlyStudying
                                }
                                onChange={
                                    handleCurrentlyStudying
                                }
                                className="
                                    mt-0.5
                                    h-4
                                    w-4
                                    shrink-0
                                    accent-cyan-400
                                "
                            />

                            <span>
                                <span
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-200
                                    "
                                >
                                    I am currently studying here
                                </span>

                                <span
                                    className="
                                        mt-1
                                        block
                                        text-xs
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    End date will be ignored while
                                    this is enabled.
                                </span>
                            </span>
                        </label>


                        {/* GRADE */}

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
                                Grade / CGPA
                            </label>

                            <input
                                type="text"
                                name="grade"
                                value={form.grade}
                                onChange={handleChange}
                                maxLength={50}
                                placeholder="8.7 CGPA / 85%"
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

                            <div className="mt-1.5 flex justify-end">
                                <span className="text-[11px] text-slate-500">
                                    {form.grade.length}/50
                                </span>
                            </div>
                        </div>


                        {/* DESCRIPTION */}

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
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                maxLength={2000}
                                rows={6}
                                placeholder="Describe your academic journey, coursework, projects, etc..."
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

                            <div className="mt-1.5 flex justify-end">
                                <span className="text-[11px] text-slate-500">
                                    {form.description.length}/2000
                                </span>
                            </div>
                        </div>


                        {/* ACHIEVEMENTS */}

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
                                Achievements
                            </label>

                            <textarea
                                name="achievements"
                                value={form.achievements}
                                onChange={handleChange}
                                rows={5}
                                placeholder={
                                    "Dean's List\nHackathon Winner\nAcademic Excellence Award"
                                }
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

                            <p className="mt-1.5 text-xs text-slate-500">
                                Write one achievement per line.
                            </p>
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
                                value={form.order}
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

                            <p className="mt-1.5 text-xs text-slate-500">
                                Smaller number appears first.
                            </p>
                        </div>


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
                                onChange={handleChange}
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
                                        text-slate-200
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
                                    Show this education on
                                    your public portfolio.
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
                                transition
                                hover:bg-cyan-300
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {submitting
                                ? "Saving..."
                                : editing
                                    ? "Update Education"
                                    : "Add Education"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// ========================================
// EDUCATION CARD
// ========================================

function EducationCard({
    education,
    onEdit,
    onDelete,
    onPublished
}) {
    const start =
        formatMonthYear(
            education.startDate
        );

    const end =
        education.currentlyStudying
            ? "Present"
            : formatMonthYear(
                education.endDate
            );

    const achievements =
        normalizeArray(
            education.achievements
        );


    return (
        <article
            className="
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
            "
        >
            {/* GLOW */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-32
                    w-32
                    rounded-full
                    bg-cyan-400/5
                    blur-3xl
                "
            />


            {/* HEADER */}

            <div
                className="
                    relative
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            h-12
                            w-12
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
                        🎓
                    </div>

                    <div className="min-w-0">
                        <h3
                            className="
                                text-lg
                                font-bold
                                text-white
                            "
                        >
                            {education.degree ||
                                "Untitled Degree"}
                        </h3>

                        {education.institution ? (
                            <p
                                className="
                                    mt-1
                                    truncate
                                    text-sm
                                    text-cyan-300
                                "
                            >
                                {education.institution}
                            </p>
                        ) : null}
                    </div>
                </div>


                <span
                    className={`
                        shrink-0
                        rounded-full
                        border
                        px-2.5
                        py-1
                        text-[11px]
                        font-medium
                        ${
                            education.isPublished
                                ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                                : "border-slate-400/10 bg-slate-400/5 text-slate-500"
                        }
                    `}
                >
                    {education.isPublished
                        ? "Published"
                        : "Hidden"}
                </span>
            </div>


            {/* FIELD */}

            {education.fieldOfStudy ? (
                <div
                    className="
                        relative
                        mt-4
                        rounded-xl
                        border
                        border-cyan-400/10
                        bg-cyan-400/[0.03]
                        px-3
                        py-2.5
                    "
                >
                    <p className="text-xs text-slate-500">
                        Field of Study
                    </p>

                    <p className="mt-1 text-sm text-slate-200">
                        {education.fieldOfStudy}
                    </p>
                </div>
            ) : null}


            {/* META */}

            <div
                className="
                    relative
                    mt-4
                    flex
                    flex-wrap
                    gap-2
                "
            >
                {education.location ? (
                    <span
                        className="
                            rounded-lg
                            border
                            border-white/10
                            bg-white/[0.03]
                            px-2.5
                            py-1
                            text-xs
                            text-slate-400
                        "
                    >
                        📍 {education.location}
                    </span>
                ) : null}

                {education.grade ? (
                    <span
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
                        ⭐ {education.grade}
                    </span>
                ) : null}
            </div>


            {/* DATE */}

            {start || end ? (
                <div
                    className="
                        relative
                        mt-4
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-slate-300
                    "
                >
                    <span className="text-cyan-400">
                        ●
                    </span>

                    <span>
                        {start || "Start date"}
                        {" — "}
                        {end || "Present"}
                    </span>
                </div>
            ) : null}


            {/* CURRENT STUDYING */}

            {education.currentlyStudying ? (
                <div
                    className="
                        relative
                        mt-4
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-emerald-400/20
                        bg-emerald-400/5
                        px-3
                        py-1.5
                        text-xs
                        text-emerald-300
                    "
                >
                    <span
                        className="
                            h-2
                            w-2
                            rounded-full
                            bg-emerald-400
                        "
                    />

                    Currently studying
                </div>
            ) : null}


            {/* DESCRIPTION */}

            {education.description ? (
                <p
                    className="
                        relative
                        mt-4
                        line-clamp-4
                        text-sm
                        leading-6
                        text-slate-400
                    "
                >
                    {education.description}
                </p>
            ) : null}


            {/* ACHIEVEMENTS */}

            {achievements.length > 0 ? (
                <div
                    className="
                        relative
                        mt-5
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.02]
                        p-4
                    "
                >
                    <p
                        className="
                            mb-2
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                            text-cyan-300
                        "
                    >
                        Achievements
                    </p>

                    <ul className="space-y-2">
                        {achievements
                            .slice(0, 4)
                            .map(
                                (
                                    achievement,
                                    index
                                ) => (
                                    <li
                                        key={`${achievement}-${index}`}
                                        className="
                                            flex
                                            gap-2
                                            text-xs
                                            leading-5
                                            text-slate-400
                                        "
                                    >
                                        <span className="mt-1 text-cyan-400">
                                            •
                                        </span>

                                        <span>
                                            {achievement}
                                        </span>
                                    </li>
                                )
                            )}
                    </ul>

                    {achievements.length > 4 ? (
                        <p className="mt-2 text-[11px] text-slate-600">
                            +{achievements.length - 4} more
                        </p>
                    ) : null}
                </div>
            ) : null}


            {/* ORDER */}

            <div
                className="
                    relative
                    mt-4
                    flex
                    items-center
                    justify-between
                    text-[11px]
                    text-slate-600
                "
            >
                <span>
                    Display order
                </span>

                <span>
                    {education.order ?? 0}
                </span>
            </div>


            {/* ACTIONS */}

            <div
                className="
                    relative
                    mt-4
                    grid
                    grid-cols-3
                    gap-2
                    border-t
                    border-white/10
                    pt-4
                "
            >
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
                    onClick={onPublished}
                    className="
                        rounded-lg
                        border
                        border-cyan-400/10
                        bg-cyan-400/[0.03]
                        px-2
                        py-2.5
                        text-xs
                        font-medium
                        text-cyan-300
                        transition
                        hover:bg-cyan-400/10
                    "
                >
                    {education.isPublished
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
                        font-medium
                        text-red-300
                        transition
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

export default function EducationPage() {
    const [
        education,
        setEducation
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
        editingEducation,
        setEditingEducation
    ] = useState(null);

    const [
        submitting,
        setSubmitting
    ] = useState(false);


    // ========================================
    // LOAD
    // ========================================

    async function loadEducation() {
        try {
            setLoading(true);
            setError("");

            const response =
                await getMyEducation();

            const data =
                Array.isArray(
                    response?.data
                )
                    ? response.data
                    : [];

            setEducation(data);
        } catch (error) {
            setError(
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadEducation();
    }, []);


    // ========================================
    // CREATE
    // ========================================

    function handleCreate() {
        setEditingEducation(null);

        setForm({
            ...initialForm
        });

        setError("");

        setShowForm(true);
    }


    // ========================================
    // EDIT
    // ========================================

    function handleEdit(item) {
        setEditingEducation(item);

        setForm({
            institution:
                item.institution || "",

            degree:
                item.degree || "",

            fieldOfStudy:
                item.fieldOfStudy || "",

            location:
                item.location || "",

            startDate:
                normalizeDateForInput(
                    item.startDate
                ),

            endDate:
                normalizeDateForInput(
                    item.endDate
                ),

            currentlyStudying:
                Boolean(
                    item.currentlyStudying
                ),

            grade:
                item.grade || "",

            description:
                item.description || "",

            achievements:
                normalizeArray(
                    item.achievements
                ).join("\n"),

            order:
                Math.max(
                    0,
                    Number(
                        item.order ?? 0
                    ) || 0
                ),

            isPublished:
                item.isPublished !== false
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


            // ACHIEVEMENTS

            const achievements =
                form.achievements
                    .split("\n")
                    .map(
                        (item) =>
                            item.trim()
                    )
                    .filter(Boolean);


            // REQUIRED CHECK

            if (!form.institution.trim()) {
                throw new Error(
                    "Institution is required"
                );
            }

            if (!form.degree.trim()) {
                throw new Error(
                    "Degree is required"
                );
            }

            if (!form.startDate) {
                throw new Error(
                    "Start date is required"
                );
            }


            // PAYLOAD

            const payload = {
                institution:
                    form.institution.trim(),

                degree:
                    form.degree.trim(),

                fieldOfStudy:
                    form.fieldOfStudy.trim(),

                location:
                    form.location.trim(),

                startDate:
                    form.startDate,

                currentlyStudying:
                    Boolean(
                        form.currentlyStudying
                    ),

                grade:
                    form.grade.trim(),

                description:
                    form.description.trim(),

                achievements,

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


            // END DATE ONLY WHEN NOT STUDYING

            if (
                !form.currentlyStudying &&
                form.endDate
            ) {
                payload.endDate =
                    form.endDate;
            }


            // ========================================
            // UPDATE
            // ========================================

            if (editingEducation) {
                const response =
                    await updateEducation(
                        editingEducation._id,
                        payload
                    );

                const updatedEducation =
                    response?.data;

                if (!updatedEducation) {
                    throw new Error(
                        "Updated education data not received"
                    );
                }

                setEducation(
                    (previous) =>
                        previous.map(
                            (item) =>
                                item._id ===
                                updatedEducation._id
                                    ? updatedEducation
                                    : item
                        )
                );
            }


            // ========================================
            // CREATE
            // ========================================

            else {
                const response =
                    await createEducation(
                        payload
                    );

                const createdEducation =
                    response?.data;

                if (!createdEducation) {
                    throw new Error(
                        "Created education data not received"
                    );
                }

                setEducation(
                    (previous) => [
                        ...previous,
                        createdEducation
                    ]
                );
            }


            // RESET

            setShowForm(false);

            setEditingEducation(null);

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

    async function handleDelete(item) {
        const confirmed =
            window.confirm(
                `Delete "${item.degree || "this education"}"? This action cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteEducation(
                item._id
            );

            setEducation(
                (previous) =>
                    previous.filter(
                        (educationItem) =>
                            educationItem._id !==
                            item._id
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

    async function handlePublished(item) {
        try {
            setError("");

            const response =
                await toggleEducationPublished(
                    item._id
                );

            const updatedEducation =
                response?.data;

            if (!updatedEducation) {
                throw new Error(
                    "Updated education data not received"
                );
            }

            setEducation(
                (previous) =>
                    previous.map(
                        (educationItem) =>
                            educationItem._id ===
                            updatedEducation._id
                                ? updatedEducation
                                : educationItem
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

        setEditingEducation(null);

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
                        flex
                        flex-col
                        items-center
                        gap-4
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

                    <p className="text-sm text-slate-500">
                        Loading education...
                    </p>
                </div>
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
                <div className="flex items-center gap-3">
                    <div
                        className="
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
                        "
                    >
                        🎓
                    </div>

                    <div>
                        <h1
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-white
                                sm:text-3xl
                            "
                        >
                            Education
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Build your academic timeline.
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
                    <span>+</span>
                    Add Education
                </button>
            </div>


            {/* ERROR */}

            {error ? (
                <div
                    className="
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
                    "
                >
                    <span>⚠</span>

                    <span>
                        {error}
                    </span>
                </div>
            ) : null}


            {/* STATS */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:gap-4
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
                    <p className="text-xs text-slate-500">
                        Total Education
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                        {education.length}
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
                    <p className="text-xs text-slate-500">
                        Published
                    </p>

                    <p className="mt-1 text-2xl font-bold text-emerald-400">
                        {
                            education.filter(
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
                    <p className="text-xs text-slate-500">
                        Currently Studying
                    </p>

                    <p className="mt-1 text-2xl font-bold text-cyan-300">
                        {
                            education.filter(
                                (item) =>
                                    item.currentlyStudying
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
                    <p className="text-xs text-slate-500">
                        Hidden
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-300">
                        {
                            education.filter(
                                (item) =>
                                    !item.isPublished
                            ).length
                        }
                    </p>
                </div>
            </div>


            {/* EMPTY STATE */}

            {education.length === 0 ? (
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
                            border
                            border-cyan-400/20
                            bg-cyan-400/10
                            text-3xl
                        "
                    >
                        🎓
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-white">
                        No education added
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
                        Add your school, college, university,
                        degree, or other academic achievements.
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
                        Add Your First Education
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
                    {education.map(
                        (item) => (
                            <EducationCard
                                key={item._id}
                                education={item}
                                onEdit={() =>
                                    handleEdit(item)
                                }
                                onDelete={() =>
                                    handleDelete(item)
                                }
                                onPublished={() =>
                                    handlePublished(item)
                                }
                            />
                        )
                    )}
                </div>
            )}


            {/* MODAL */}

            {showForm ? (
                <EducationForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseForm}
                    submitting={submitting}
                    editing={Boolean(
                        editingEducation
                    )}
                />
            ) : null}
        </div>
    );
}