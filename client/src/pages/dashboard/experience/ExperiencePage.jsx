import { useEffect, useState } from "react";

import {
    getMyExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    toggleExperiencePublished
} from "../../../api/experience.api";


// ========================================
// INITIAL FORM
// ========================================

const initialForm = {
    jobTitle: "",
    company: "",
    companyUrl: "",
    location: "",
    employmentType: "full-time",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
    technologies: "",
    achievements: "",
    order: 0,
    isPublished: true
};


// ========================================
// EMPLOYMENT TYPES
// ========================================

const employmentTypes = [
    {
        value: "full-time",
        label: "Full Time"
    },
    {
        value: "part-time",
        label: "Part Time"
    },
    {
        value: "internship",
        label: "Internship"
    },
    {
        value: "freelance",
        label: "Freelance"
    },
    {
        value: "contract",
        label: "Contract"
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
// DATE FORMATTER
// ========================================

function formatMonthYear(value) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
    });
}


// ========================================
// NORMALIZE DATE FOR INPUT
// ========================================

function normalizeDateForInput(value) {
    if (!value) {
        return "";
    }

    const stringValue = String(value);

    if (stringValue.includes("T")) {
        return stringValue.slice(0, 10);
    }

    return stringValue.slice(0, 10);
}


// ========================================
// NORMALIZE ARRAY
// ========================================

function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
}


// ========================================
// EXPERIENCE FORM
// ========================================

function ExperienceForm({
    form,
    setForm,
    onSubmit,
    onCancel,
    submitting,
    editing
}) {
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
    }, [onCancel, submitting]);


    // ========================================
    // HANDLE INPUT CHANGE
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
    // CURRENTLY WORKING
    // ========================================

    function handleCurrentlyWorking(event) {
        const checked = event.target.checked;

        setForm((previous) => ({
            ...previous,
            currentlyWorking: checked,
            endDate: checked
                ? ""
                : previous.endDate
        }));
    }


    // ========================================
    // FORM SUBMIT
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
                    event.target === event.currentTarget &&
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
                            💼
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
                                    ? "Edit Experience"
                                    : "Add Experience"}
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
                                    ? "Update your professional experience"
                                    : "Add a position to your career timeline"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        aria-label="Close experience form"
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
                        {/* JOB TITLE + COMPANY */}

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
                                    Job Title
                                </label>

                                <input
                                    type="text"
                                    name="jobTitle"
                                    value={form.jobTitle}
                                    onChange={handleChange}
                                    maxLength={100}
                                    placeholder="Full Stack Developer"
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
                                        {form.jobTitle.length}/100
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
                                    Company
                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    maxLength={150}
                                    placeholder="Google"
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
                                        {form.company.length}/150
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* COMPANY URL + LOCATION */}

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
                                    Company Website
                                </label>

                                <input
                                    type="url"
                                    name="companyUrl"
                                    value={form.companyUrl}
                                    onChange={handleChange}
                                    placeholder="https://company.com"
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

                                <p className="mt-1.5 text-xs text-slate-500">
                                    Optional
                                </p>
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


                        {/* EMPLOYMENT TYPE */}

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
                                Employment Type
                            </label>

                            <select
                                name="employmentType"
                                value={form.employmentType}
                                onChange={handleChange}
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
                                    focus:ring-4
                                    focus:ring-cyan-400/5
                                "
                            >
                                {employmentTypes.map((item) => (
                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                ))}
                            </select>
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
                                        form.currentlyWorking
                                            ? ""
                                            : form.endDate
                                    }
                                    onChange={handleChange}
                                    disabled={form.currentlyWorking}
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


                        {/* CURRENTLY WORKING */}

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
                                name="currentlyWorking"
                                checked={form.currentlyWorking}
                                onChange={handleCurrentlyWorking}
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
                                    I currently work here
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
                                maxLength={3000}
                                rows={7}
                                placeholder="Describe your responsibilities, work, projects, and impact..."
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
                                    {form.description.length}/3000
                                </span>
                            </div>
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
                                value={form.technologies}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB, Express"
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

                            <p className="mt-1.5 text-xs text-slate-500">
                                Separate technologies with commas.
                            </p>

                            {form.technologies.trim() ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {form.technologies
                                        .split(",")
                                        .map((item) => item.trim())
                                        .filter(Boolean)
                                        .map(
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
                                                        bg-cyan-400/5
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        text-cyan-300
                                                    "
                                                >
                                                    {technology}
                                                </span>
                                            )
                                        )}
                                </div>
                            ) : null}
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
                                    "Led a team of 5 developers\nImproved application performance by 40%\nBuilt real-time communication features"
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
                                checked={form.isPublished}
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

                                <span className="mt-1 block text-xs text-slate-500">
                                    Show this experience on your
                                    public portfolio.
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
                                    ? "Update Experience"
                                    : "Add Experience"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// ========================================
// EXPERIENCE CARD
// ========================================

function ExperienceCard({
    experience,
    onEdit,
    onDelete,
    onPublished
}) {
    const start = formatMonthYear(
        experience.startDate
    );

    const end = experience.currentlyWorking
        ? "Present"
        : formatMonthYear(
            experience.endDate
        );

    const technologies = normalizeArray(
        experience.technologies
    );

    const achievements = normalizeArray(
        experience.achievements
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
                        "
                    >
                        💼
                    </div>

                    <div className="min-w-0">
                        <h3
                            className="
                                truncate
                                text-lg
                                font-bold
                                text-white
                            "
                        >
                            {experience.jobTitle ||
                                "Untitled Position"}
                        </h3>

                        {experience.company ? (
                            experience.companyUrl ? (
                                <a
                                    href={experience.companyUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        mt-1
                                        inline-block
                                        truncate
                                        text-sm
                                        text-cyan-300
                                        hover:text-cyan-200
                                    "
                                >
                                    {experience.company}
                                    <span className="ml-1">
                                        ↗
                                    </span>
                                </a>
                            ) : (
                                <p
                                    className="
                                        mt-1
                                        truncate
                                        text-sm
                                        text-cyan-300
                                    "
                                >
                                    {experience.company}
                                </p>
                            )
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
                            experience.isPublished
                                ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                                : "border-slate-400/10 bg-slate-400/5 text-slate-500"
                        }
                    `}
                >
                    {experience.isPublished
                        ? "Published"
                        : "Hidden"}
                </span>
            </div>


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
                <span
                    className="
                        rounded-lg
                        border
                        border-cyan-400/10
                        bg-cyan-400/5
                        px-2.5
                        py-1
                        text-xs
                        capitalize
                        text-cyan-300
                    "
                >
                    {experience.employmentType
                        ? experience.employmentType.replace(
                            "-",
                            " "
                        )
                        : "full time"}
                </span>

                {experience.location ? (
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
                        📍 {experience.location}
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


            {/* DESCRIPTION */}

            {experience.description ? (
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
                    {experience.description}
                </p>
            ) : null}


            {/* TECHNOLOGIES */}

            {technologies.length > 0 ? (
                <div
                    className="
                        relative
                        mt-4
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


            {/* CURRENT */}

            {experience.currentlyWorking ? (
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

                    Currently working
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
                    {experience.order ?? 0}
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
                    {experience.isPublished
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

export default function ExperiencePage() {
    const [experiences, setExperiences] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        ...initialForm
    });

    const [editingExperience, setEditingExperience] =
        useState(null);

    const [submitting, setSubmitting] = useState(false);


    // ========================================
    // LOAD EXPERIENCES
    // ========================================

    async function loadExperiences() {
        try {
            setLoading(true);
            setError("");

            const response =
                await getMyExperiences();

            const data = Array.isArray(
                response?.data
            )
                ? response.data
                : [];

            setExperiences(data);
        } catch (error) {
            setError(
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadExperiences();
    }, []);


    // ========================================
    // CREATE
    // ========================================

    function handleCreate() {
        setEditingExperience(null);

        setForm({
            ...initialForm
        });

        setError("");

        setShowForm(true);
    }


    // ========================================
    // EDIT
    // ========================================

    function handleEdit(experience) {
        setEditingExperience(
            experience
        );

        setForm({
            jobTitle:
                experience.jobTitle || "",

            company:
                experience.company || "",

            companyUrl:
                experience.companyUrl || "",

            location:
                experience.location || "",

            employmentType:
                employmentTypes.some(
                    (item) =>
                        item.value ===
                        experience.employmentType
                )
                    ? experience.employmentType
                    : "full-time",

            startDate:
                normalizeDateForInput(
                    experience.startDate
                ),

            endDate:
                normalizeDateForInput(
                    experience.endDate
                ),

            currentlyWorking:
                Boolean(
                    experience.currentlyWorking
                ),

            description:
                experience.description || "",

            technologies:
                normalizeArray(
                    experience.technologies
                ).join(", "),

            achievements:
                normalizeArray(
                    experience.achievements
                ).join("\n"),

            order:
                Math.max(
                    0,
                    Number(
                        experience.order ?? 0
                    ) || 0
                ),

            isPublished:
                experience.isPublished !== false
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


            // TECHNOLOGIES

            const technologies =
                form.technologies
                    .split(",")
                    .map((item) =>
                        item.trim()
                    )
                    .filter(Boolean);


            // ACHIEVEMENTS

            const achievements =
                form.achievements
                    .split("\n")
                    .map((item) =>
                        item.trim()
                    )
                    .filter(Boolean);


            // PAYLOAD

            const payload = {
                jobTitle:
                    form.jobTitle.trim(),

                company:
                    form.company.trim(),

                location:
                    form.location.trim(),

                employmentType:
                    form.employmentType,

                currentlyWorking:
                    Boolean(
                        form.currentlyWorking
                    ),

                description:
                    form.description.trim(),

                technologies,

                achievements,

                order:
                    Math.max(
                        0,
                        Number(form.order) || 0
                    ),

                isPublished:
                    Boolean(
                        form.isPublished
                    )
            };


            // OPTIONAL COMPANY URL

            if (form.companyUrl.trim()) {
                payload.companyUrl =
                    form.companyUrl.trim();
            }


            // OPTIONAL START DATE

            if (form.startDate) {
                payload.startDate =
                    form.startDate;
            }


            // OPTIONAL END DATE

            if (
                !form.currentlyWorking &&
                form.endDate
            ) {
                payload.endDate =
                    form.endDate;
            }


            // ========================================
            // UPDATE
            // ========================================

            if (editingExperience) {
                const response =
                    await updateExperience(
                        editingExperience._id,
                        payload
                    );

                const updatedExperience =
                    response?.data;

                if (!updatedExperience) {
                    throw new Error(
                        "Updated experience data not received"
                    );
                }

                setExperiences(
                    (previous) =>
                        previous.map(
                            (experience) =>
                                experience._id ===
                                updatedExperience._id
                                    ? updatedExperience
                                    : experience
                        )
                );
            }


            // ========================================
            // CREATE
            // ========================================

            else {
                const response =
                    await createExperience(
                        payload
                    );

                const createdExperience =
                    response?.data;

                if (!createdExperience) {
                    throw new Error(
                        "Created experience data not received"
                    );
                }

                setExperiences(
                    (previous) => [
                        ...previous,
                        createdExperience
                    ]
                );
            }


            // RESET

            setShowForm(false);

            setEditingExperience(null);

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

    async function handleDelete(experience) {
        const confirmed =
            window.confirm(
                `Delete "${experience.jobTitle || "this experience"}"? This action cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteExperience(
                experience._id
            );

            setExperiences(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item._id !==
                            experience._id
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

    async function handlePublished(experience) {
        try {
            setError("");

            const response =
                await toggleExperiencePublished(
                    experience._id
                );

            const updatedExperience =
                response?.data;

            if (!updatedExperience) {
                throw new Error(
                    "Updated experience data not received"
                );
            }

            setExperiences(
                (previous) =>
                    previous.map(
                        (item) =>
                            item._id ===
                            updatedExperience._id
                                ? updatedExperience
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
    // CLOSE MODAL
    // ========================================

    function handleCloseForm() {
        if (submitting) {
            return;
        }

        setShowForm(false);

        setEditingExperience(null);

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
                        Loading experience...
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
                        💼
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
                            Experience
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Build your professional career timeline.
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
                    Add Experience
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
                        Total Experience
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                        {experiences.length}
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
                            experiences.filter(
                                (experience) =>
                                    experience.isPublished
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
                        Current
                    </p>

                    <p className="mt-1 text-2xl font-bold text-cyan-300">
                        {
                            experiences.filter(
                                (experience) =>
                                    experience.currentlyWorking
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
                            experiences.filter(
                                (experience) =>
                                    !experience.isPublished
                            ).length
                        }
                    </p>
                </div>
            </div>


            {/* EMPTY STATE */}

            {experiences.length === 0 ? (
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
                        💼
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-white">
                        No experience added
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
                        Add your internships, jobs, freelance work,
                        or other professional experience.
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
                        Add Your First Experience
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
                    {experiences.map(
                        (experience) => (
                            <ExperienceCard
                                key={experience._id}
                                experience={experience}
                                onEdit={() =>
                                    handleEdit(
                                        experience
                                    )
                                }
                                onDelete={() =>
                                    handleDelete(
                                        experience
                                    )
                                }
                                onPublished={() =>
                                    handlePublished(
                                        experience
                                    )
                                }
                            />
                        )
                    )}
                </div>
            )}


            {/* MODAL */}

            {showForm ? (
                <ExperienceForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseForm}
                    submitting={submitting}
                    editing={Boolean(
                        editingExperience
                    )}
                />
            ) : null}
        </div>
    );
}