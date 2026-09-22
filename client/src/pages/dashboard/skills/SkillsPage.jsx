import {
    useEffect,
    useState
} from "react";

import {
    getMySkills,
    createSkill,
    updateSkill,
    deleteSkill,
    toggleSkillPublished
} from "../../../api/skills.api";


// ========================================
// INITIAL FORM
// ========================================

const initialForm = {
    name: "",
    category: "",
    level: "beginner",
    percentage: 0,
    icon: "",
    description: "",
    order: 0,
    isPublished: true
};


// ========================================
// LEVEL OPTIONS
// ========================================

const levelOptions = [
    "beginner",
    "intermediate",
    "advanced",
    "expert"
];


// ========================================
// ERROR MESSAGE
// ========================================

const getErrorMessage = (
    error
) => {

    return (
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        error?.message ||
        "Something went wrong"
    );

};


// ========================================
// SKILL FORM
// ========================================

function SkillForm({
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

        const handleKeyDown = (
            event
        ) => {

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

    }, [
        onCancel,
        submitting
    ]);


    // ========================================
    // CHANGE
    // ========================================

    const handleChange = (
        event
    ) => {

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

    };


    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = (
        event
    ) => {

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
            onMouseDown={(
                event
            ) => {

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
                    relative
                    my-auto
                    flex
                    max-h-[94vh]
                    w-full
                    max-w-2xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-cyan-400/20
                    bg-[#07111f]
                    shadow-[0_0_70px_rgba(0,200,255,0.12)]
                "
                onMouseDown={(
                    event
                ) => {

                    event.stopPropagation();

                }}
            >

                {/* ========================================
                    HEADER
                ======================================== */}

                <div className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-white/10
                    bg-[#07111f]
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
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-cyan-400/20
                            bg-cyan-400/10
                            text-xl
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
                                    ? "Edit Skill"
                                    : "Create Skill"}
                            </h2>


                            <p className="
                                mt-0.5
                                text-xs
                                text-slate-500
                                sm:text-sm
                            ">
                                {editing
                                    ? "Update your skill details"
                                    : "Add a new skill to your portfolio"}
                            </p>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        aria-label="Close skill form"
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
                    FORM
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
                            NAME
                        ======================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-200
                            ">
                                Skill Name
                            </label>


                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                maxLength={100}
                                placeholder="React.js"
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
                                    {form.name.length}/100
                                </span>
                            </div>

                        </div>


                        {/* ========================================
                            CATEGORY + LEVEL
                        ======================================== */}

                        <div className="
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-2
                        ">

                            {/* CATEGORY */}

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
                                    maxLength={100}
                                    placeholder="Frontend"
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
                                        {form.category.length}/100
                                    </span>
                                </div>

                            </div>


                            {/* LEVEL */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-200
                                ">
                                    Skill Level
                                </label>


                                <select
                                    name="level"
                                    value={form.level}
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
                                        transition
                                        focus:border-cyan-400/40
                                        focus:ring-4
                                        focus:ring-cyan-400/5
                                    "
                                >

                                    {levelOptions.map(
                                        (level) => (

                                            <option
                                                key={level}
                                                value={level}
                                            >
                                                {level
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    level.slice(1)}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* ========================================
                            PERCENTAGE
                        ======================================== */}

                        <div>

                            <div className="
                                mb-2
                                flex
                                items-center
                                justify-between
                            ">

                                <label className="
                                    text-sm
                                    font-medium
                                    text-slate-200
                                ">
                                    Skill Percentage
                                </label>


                                <span className="
                                    rounded-full
                                    border
                                    border-cyan-400/20
                                    bg-cyan-400/10
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-cyan-300
                                ">
                                    {form.percentage}%
                                </span>

                            </div>


                            <input
                                type="range"
                                name="percentage"
                                min="0"
                                max="100"
                                value={form.percentage}
                                onChange={handleChange}
                                className="
                                    h-2
                                    w-full
                                    cursor-pointer
                                    appearance-none
                                    rounded-full
                                    bg-white/10
                                    accent-cyan-400
                                "
                            />


                            <div className="
                                mt-2
                                flex
                                justify-between
                                text-[11px]
                                text-slate-600
                            ">

                                <span>
                                    0%
                                </span>

                                <span>
                                    50%
                                </span>

                                <span>
                                    100%
                                </span>

                            </div>

                        </div>


                        {/* ========================================
                            ICON
                        ======================================== */}

                        <div>

                            <label className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-200
                            ">
                                Skill Icon
                            </label>


                            <div className="
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                            ">

                                <div className="
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
                                    text-cyan-300
                                ">
                                    {form.icon || "★"}
                                </div>


                                <input
                                    name="icon"
                                    value={form.icon}
                                    onChange={handleChange}
                                    maxLength={500}
                                    placeholder="⚛️"
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


                            <p className="
                                mt-1.5
                                text-xs
                                leading-5
                                text-slate-500
                            ">
                                You can use an emoji, text symbol,
                                or icon value.
                            </p>

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
                                Description
                            </label>


                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                maxLength={500}
                                rows={5}
                                placeholder="Briefly describe your experience or knowledge with this skill..."
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
                                    {form.description.length}/500
                                </span>
                            </div>

                        </div>


                        {/* ========================================
                            ORDER
                        ======================================== */}

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


                            <p className="
                                mt-1.5
                                text-xs
                                text-slate-500
                            ">
                                Smaller number appears first.
                            </p>

                        </div>


                        {/* ========================================
                            PUBLISHED
                        ======================================== */}

                        <label className="
                            flex
                            cursor-pointer
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.02]
                            p-4
                            transition
                            hover:bg-white/[0.04]
                        ">

                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={form.isPublished}
                                onChange={handleChange}
                                className="
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
                                    mt-0.5
                                    block
                                    text-xs
                                    text-slate-500
                                ">
                                    Make this skill visible on
                                    the public portfolio.
                                </span>

                            </span>

                        </label>

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
                                    ? "Update Skill"
                                    : "Create Skill"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


// ========================================
// SKILL CARD
// ========================================

function SkillCard({
    skill,
    onEdit,
    onDelete,
    onPublished
}) {

    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                Number(skill.percentage) || 0
            )
        );


    const level =
        skill.level || "beginner";


    return (

        <article className="
            group
            rounded-2xl
            border
            border-white/10
            bg-[#07111f]
            p-5
            transition
            duration-300
            hover:-translate-y-1
            hover:border-cyan-400/30
            hover:shadow-[0_0_35px_rgba(0,200,255,0.08)]
        ">

            {/* ========================================
                TOP
            ======================================== */}

            <div className="
                flex
                items-start
                justify-between
                gap-4
            ">

                <div className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                ">

                    {/* ICON */}

                    <div className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-xl
                        border
                        border-cyan-400/20
                        bg-cyan-400/10
                        text-xl
                        font-semibold
                        text-cyan-300
                    ">

                        {skill.icon || "★"}

                    </div>


                    <div className="min-w-0">

                        <h3 className="
                            truncate
                            text-base
                            font-bold
                            text-white
                            sm:text-lg
                        ">
                            {skill.name || "Unnamed Skill"}
                        </h3>


                        {skill.category ? (
                            <p className="
                                mt-0.5
                                truncate
                                text-xs
                                text-slate-500
                            ">
                                {skill.category}
                            </p>
                        ) : null}

                    </div>

                </div>


                {/* STATUS */}

                <span className={`
                    shrink-0
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-[11px]
                    font-medium
                    ${
                        skill.isPublished
                            ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                            : "border-slate-400/10 bg-slate-400/5 text-slate-500"
                    }
                `}>
                    {skill.isPublished
                        ? "Published"
                        : "Hidden"}
                </span>

            </div>


            {/* ========================================
                LEVEL
            ======================================== */}

            <div className="
                mt-5
                flex
                items-center
                justify-between
            ">

                <span className="
                    rounded-full
                    border
                    border-cyan-400/10
                    bg-cyan-400/5
                    px-2.5
                    py-1
                    text-xs
                    capitalize
                    text-cyan-300
                ">
                    {level}
                </span>


                <span className="
                    text-sm
                    font-semibold
                    text-white
                ">
                    {percentage}%
                </span>

            </div>


            {/* ========================================
                PROGRESS
            ======================================== */}

            <div className="
                mt-3
                h-2
                overflow-hidden
                rounded-full
                bg-white/10
            ">

                <div
                    className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-cyan-500
                        to-cyan-300
                        transition-all
                        duration-500
                    "
                    style={{
                        width: `${percentage}%`
                    }}
                />

            </div>


            {/* ========================================
                DESCRIPTION
            ======================================== */}

            {skill.description ? (
                <p className="
                    mt-4
                    line-clamp-3
                    text-sm
                    leading-6
                    text-slate-400
                ">
                    {skill.description}
                </p>
            ) : null}


            {/* ========================================
                ORDER
            ======================================== */}

            <div className="
                mt-4
                flex
                items-center
                justify-between
                text-[11px]
                text-slate-600
            ">

                <span>
                    Skill order
                </span>

                <span>
                    {skill.order ?? 0}
                </span>

            </div>


            {/* ========================================
                ACTIONS
            ======================================== */}

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
                    {skill.isPublished
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

export default function SkillsPage() {

    const [
        skills,
        setSkills
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
        editingSkill,
        setEditingSkill
    ] = useState(null);


    const [
        submitting,
        setSubmitting
    ] = useState(false);


    // ========================================
    // LOAD SKILLS
    // ========================================

    const loadSkills = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getMySkills();


            setSkills(
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

        loadSkills();

    }, []);


    // ========================================
    // CREATE
    // ========================================

    const handleCreate = () => {

        setEditingSkill(null);

        setForm({
            ...initialForm
        });

        setError("");

        setShowForm(true);

    };


    // ========================================
    // EDIT
    // ========================================

    const handleEdit = (
        skill
    ) => {

        setEditingSkill(skill);

        setForm({

            name:
                skill.name || "",

            category:
                skill.category || "",

            level:
                skill.level || "beginner",

            percentage:
                Number(
                    skill.percentage ?? 0
                ),

            icon:
                skill.icon || "",

            description:
                skill.description || "",

            order:
                Number(
                    skill.order ?? 0
                ),

            isPublished:
                skill.isPublished !== false

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


            const payload = {

                name:
                    form.name.trim(),

                category:
                    form.category.trim(),

                level:
                    form.level,

                percentage:
                    Math.min(
                        100,
                        Math.max(
                            0,
                            Number(
                                form.percentage
                            ) || 0
                        )
                    ),

                icon:
                    form.icon.trim(),

                description:
                    form.description.trim(),

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


            // ========================================
            // UPDATE
            // ========================================

            if (editingSkill) {

                const response =
                    await updateSkill(

                        editingSkill._id,

                        payload

                    );


                const updatedSkill =
                    response?.data;


                if (!updatedSkill) {

                    throw new Error(
                        "Updated skill data not received"
                    );

                }


                setSkills(
                    (previous) =>
                        previous.map(
                            (skill) =>
                                skill._id ===
                                updatedSkill._id
                                    ? updatedSkill
                                    : skill
                        )
                );

            }


            // ========================================
            // CREATE
            // ========================================

            else {

                const response =
                    await createSkill(
                        payload
                    );


                const createdSkill =
                    response?.data;


                if (!createdSkill) {

                    throw new Error(
                        "Created skill data not received"
                    );

                }


                setSkills(
                    (previous) => [

                        createdSkill,

                        ...previous

                    ]
                );

            }


            setShowForm(false);

            setEditingSkill(null);

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

    const handleDelete = async (
        skill
    ) => {

        const confirmed =
            window.confirm(
                `Delete "${skill.name || "this skill"}"? This action cannot be undone.`
            );


        if (!confirmed) {

            return;

        }


        try {

            setError("");


            await deleteSkill(
                skill._id
            );


            setSkills(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item._id !==
                            skill._id
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

    const handlePublished = async (
        skill
    ) => {

        try {

            setError("");


            const response =
                await toggleSkillPublished(
                    skill._id
                );


            const updatedSkill =
                response?.data;


            if (!updatedSkill) {

                throw new Error(
                    "Updated skill data not received"
                );

            }


            setSkills(
                (previous) =>
                    previous.map(
                        (item) =>
                            item._id ===
                            updatedSkill._id
                                ? updatedSkill
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
    // CLOSE
    // ========================================

    const handleCloseForm = () => {

        if (submitting) {

            return;

        }


        setShowForm(false);

        setEditingSkill(null);

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
                bg-[#020817]
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
                        Loading skills...
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
                        ⚡
                    </div>


                    <div>

                        <h1 className="
                            text-2xl
                            font-bold
                            tracking-tight
                            text-white
                            sm:text-3xl
                        ">
                            Skills
                        </h1>


                        <p className="
                            mt-1
                            text-sm
                            text-slate-400
                        ">
                            Manage your technical skills and expertise.
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

                    <span>
                        +
                    </span>

                    Add Skill

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

                    <span>
                        ⚠
                    </span>


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

                {/* TOTAL */}

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
                        Total Skills
                    </p>


                    <p className="
                        mt-1
                        text-2xl
                        font-bold
                        text-white
                    ">
                        {skills.length}
                    </p>

                </div>


                {/* PUBLISHED */}

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
                            skills.filter(
                                (skill) =>
                                    skill.isPublished
                            ).length
                        }
                    </p>

                </div>


                {/* HIDDEN */}

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
                            skills.filter(
                                (skill) =>
                                    !skill.isPublished
                            ).length
                        }
                    </p>

                </div>


                {/* EXPERT */}

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
                        Expert Level
                    </p>


                    <p className="
                        mt-1
                        text-2xl
                        font-bold
                        text-cyan-300
                    ">
                        {
                            skills.filter(
                                (skill) =>
                                    skill.level ===
                                    "expert"
                            ).length
                        }
                    </p>

                </div>

            </div>


            {/* ========================================
                EMPTY
            ======================================== */}

            {skills.length === 0 ? (

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
                        ⚡
                    </div>


                    <h2 className="
                        mt-5
                        text-xl
                        font-bold
                        text-white
                    ">
                        No skills yet
                    </h2>


                    <p className="
                        mt-2
                        max-w-md
                        text-sm
                        leading-6
                        text-slate-400
                    ">
                        Add your technical skills and show
                        your expertise on your portfolio.
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
                        Add Your First Skill
                    </button>

                </div>

            ) : (

                /* ========================================
                   SKILL GRID
                ======================================== */

                <div className="
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-2
                    xl:grid-cols-3
                ">

                    {skills.map(
                        (skill) => (

                            <SkillCard
                                key={skill._id}
                                skill={skill}
                                onEdit={() =>
                                    handleEdit(skill)
                                }
                                onDelete={() =>
                                    handleDelete(skill)
                                }
                                onPublished={() =>
                                    handlePublished(skill)
                                }
                            />

                        )
                    )}

                </div>

            )}


            {/* ========================================
                MODAL
            ======================================== */}

            {showForm ? (

                <SkillForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseForm}
                    submitting={submitting}
                    editing={Boolean(editingSkill)}
                />

            ) : null}

        </div>

    );

}