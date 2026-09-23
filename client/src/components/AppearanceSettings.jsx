const AppearanceSettings = ({
    form,
    onChange,
    onNestedChange
}) => {

    const templates = [
        {
            id: "modern",
            name: "Modern",
            description: "Clean, premium and balanced",
            icon: "✦"
        },
        {
            id: "minimal",
            name: "Minimal",
            description: "Simple, elegant and focused",
            icon: "◌"
        },
        {
            id: "developer",
            name: "Developer",
            description: "Code-inspired developer style",
            icon: "</>"
        },
        {
            id: "creative",
            name: "Creative",
            description: "Bold, expressive and artistic",
            icon: "✧"
        }
    ];


    return (
        <div className="space-y-6">

            {/* ========================================
                TEMPLATE SELECTOR
            ======================================== */}

            <div>

                <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-300">
                        Portfolio Template
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Choose a visual style for your public portfolio.
                    </p>
                </div>


                <div className="
                    grid
                    grid-cols-1
                    gap-4
                    xl:grid-cols-2
                ">

                    {templates.map((template) => {

                        const isSelected =
                            form.template === template.id;


                        return (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() =>
                                    onChange(
                                        "template",
                                        template.id
                                    )
                                }
                                className={`
                                    group
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    text-left
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    ${
                                        isSelected
                                            ? "border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                                            : "border-white/10 hover:border-white/20"
                                    }
                                `}
                            >

                                {/* ========================================
                                    MINI TEMPLATE PREVIEW
                                ======================================== */}

                                <div
                                    className={`
                                        relative
                                        h-44
                                        overflow-hidden
                                        ${
                                            template.id === "modern"
                                                ? "bg-[#050a14]"
                                                : template.id === "minimal"
                                                    ? "bg-slate-100"
                                                    : template.id === "developer"
                                                        ? "bg-[#09090b]"
                                                        : "bg-gradient-to-br from-fuchsia-500 via-purple-500 to-cyan-400"
                                        }
                                    `}
                                >

                                    {/* ================= MODERN ================= */}

                                    {template.id === "modern" ? (

                                        <div className="h-full p-3">

                                            {/* NAVBAR */}

                                            <div className="
                                                flex
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                border-cyan-400/20
                                                bg-white/[0.04]
                                                px-3
                                                py-2
                                            ">

                                                <div className="
                                                    h-2
                                                    w-16
                                                    rounded-full
                                                    bg-cyan-300/70
                                                " />


                                                <div className="flex gap-2">

                                                    <span className="
                                                        h-2
                                                        w-8
                                                        rounded-full
                                                        bg-white/10
                                                    " />

                                                    <span className="
                                                        h-2
                                                        w-8
                                                        rounded-full
                                                        bg-white/10
                                                    " />

                                                    <span className="
                                                        h-2
                                                        w-8
                                                        rounded-full
                                                        bg-white/10
                                                    " />

                                                </div>

                                            </div>


                                            {/* HERO */}

                                            <div className="
                                                mt-3
                                                grid
                                                grid-cols-5
                                                gap-3
                                            ">

                                                <div className="
                                                    col-span-3
                                                    rounded-xl
                                                    border
                                                    border-cyan-400/10
                                                    bg-white/[0.04]
                                                    p-3
                                                ">

                                                    <div className="
                                                        h-2
                                                        w-20
                                                        rounded-full
                                                        bg-cyan-300/70
                                                    " />

                                                    <div className="
                                                        mt-2
                                                        h-3
                                                        w-32
                                                        rounded-full
                                                        bg-white/80
                                                    " />

                                                    <div className="
                                                        mt-3
                                                        h-2
                                                        w-full
                                                        rounded-full
                                                        bg-white/10
                                                    " />

                                                    <div className="
                                                        mt-2
                                                        h-2
                                                        w-4/5
                                                        rounded-full
                                                        bg-white/10
                                                    " />

                                                    <div className="
                                                        mt-4
                                                        h-6
                                                        w-20
                                                        rounded-lg
                                                        bg-cyan-400/70
                                                    " />

                                                </div>


                                                <div className="
                                                    col-span-2
                                                    rounded-xl
                                                    border
                                                    border-white/10
                                                    bg-gradient-to-br
                                                    from-cyan-400/20
                                                    to-blue-500/10
                                                " />

                                            </div>


                                            {/* STATS */}

                                            <div className="
                                                mt-3
                                                grid
                                                grid-cols-4
                                                gap-2
                                            ">

                                                <div className="
                                                    h-7
                                                    rounded-lg
                                                    border
                                                    border-cyan-400/10
                                                    bg-white/[0.03]
                                                " />

                                                <div className="
                                                    h-7
                                                    rounded-lg
                                                    border
                                                    border-cyan-400/10
                                                    bg-white/[0.03]
                                                " />

                                                <div className="
                                                    h-7
                                                    rounded-lg
                                                    border
                                                    border-cyan-400/10
                                                    bg-white/[0.03]
                                                " />

                                                <div className="
                                                    h-7
                                                    rounded-lg
                                                    border
                                                    border-cyan-400/10
                                                    bg-white/[0.03]
                                                " />

                                            </div>

                                        </div>

                                    ) : null}



                                    {/* ================= MINIMAL ================= */}

                                    {template.id === "minimal" ? (

                                        <div className="h-full p-4">

                                            {/* TOP */}

                                            <div className="
                                                flex
                                                items-center
                                                justify-between
                                            ">

                                                <div className="
                                                    h-2
                                                    w-20
                                                    rounded-full
                                                    bg-slate-800
                                                " />

                                                <div className="
                                                    flex
                                                    gap-2
                                                ">

                                                    <span className="
                                                        h-1.5
                                                        w-6
                                                        rounded-full
                                                        bg-slate-300
                                                    " />

                                                    <span className="
                                                        h-1.5
                                                        w-6
                                                        rounded-full
                                                        bg-slate-300
                                                    " />

                                                    <span className="
                                                        h-1.5
                                                        w-6
                                                        rounded-full
                                                        bg-slate-300
                                                    " />

                                                </div>

                                            </div>


                                            {/* HERO */}

                                            <div className="
                                                mt-6
                                                grid
                                                grid-cols-5
                                                gap-4
                                            ">

                                                <div className="col-span-3">

                                                    <div className="
                                                        h-3
                                                        w-36
                                                        rounded-full
                                                        bg-slate-900
                                                    " />

                                                    <div className="
                                                        mt-2
                                                        h-2
                                                        w-28
                                                        rounded-full
                                                        bg-slate-400
                                                    " />

                                                    <div className="
                                                        mt-4
                                                        h-2
                                                        w-full
                                                        rounded-full
                                                        bg-slate-300
                                                    " />

                                                    <div className="
                                                        mt-2
                                                        h-2
                                                        w-4/5
                                                        rounded-full
                                                        bg-slate-300
                                                    " />

                                                    <div className="
                                                        mt-4
                                                        h-6
                                                        w-20
                                                        rounded-lg
                                                        bg-slate-900
                                                    " />

                                                </div>


                                                <div className="
                                                    col-span-2
                                                    rounded-xl
                                                    bg-white
                                                    shadow-sm
                                                    ring-1
                                                    ring-slate-200
                                                " />

                                            </div>


                                            {/* CARDS */}

                                            <div className="
                                                mt-5
                                                grid
                                                grid-cols-3
                                                gap-2
                                            ">

                                                <div className="
                                                    h-10
                                                    rounded-lg
                                                    bg-white
                                                    shadow-sm
                                                    ring-1
                                                    ring-slate-200
                                                " />

                                                <div className="
                                                    h-10
                                                    rounded-lg
                                                    bg-white
                                                    shadow-sm
                                                    ring-1
                                                    ring-slate-200
                                                " />

                                                <div className="
                                                    h-10
                                                    rounded-lg
                                                    bg-white
                                                    shadow-sm
                                                    ring-1
                                                    ring-slate-200
                                                " />

                                            </div>

                                        </div>

                                    ) : null}



                                    {/* ================= DEVELOPER ================= */}

                                    {template.id === "developer" ? (

                                        <div className="
                                            h-full
                                            bg-[#09090b]
                                            p-3
                                            font-mono
                                        ">

                                            {/* TERMINAL BAR */}

                                            <div className="
                                                flex
                                                items-center
                                                gap-1.5
                                                border-b
                                                border-white/10
                                                pb-2
                                            ">

                                                <span className="
                                                    h-2.5
                                                    w-2.5
                                                    rounded-full
                                                    bg-red-400/70
                                                " />

                                                <span className="
                                                    h-2.5
                                                    w-2.5
                                                    rounded-full
                                                    bg-yellow-400/70
                                                " />

                                                <span className="
                                                    h-2.5
                                                    w-2.5
                                                    rounded-full
                                                    bg-green-400/70
                                                " />

                                            </div>


                                            {/* TERMINAL CONTENT */}

                                            <div className="
                                                mt-4
                                                text-[9px]
                                                leading-5
                                            ">

                                                <p className="text-emerald-400">
                                                    $ portfolio.init()
                                                </p>

                                                <p className="text-slate-500">
                                                    loading developer profile...
                                                </p>

                                                <p className="text-cyan-400">
                                                    const name = "Developer";
                                                </p>

                                                <p className="text-purple-400">
                                                    npm run build
                                                </p>


                                                <div className="
                                                    mt-3
                                                    h-2
                                                    w-24
                                                    rounded-full
                                                    bg-emerald-400/50
                                                " />

                                                <div className="
                                                    mt-2
                                                    h-2
                                                    w-40
                                                    rounded-full
                                                    bg-white/10
                                                " />

                                                <div className="
                                                    mt-2
                                                    h-2
                                                    w-32
                                                    rounded-full
                                                    bg-white/10
                                                " />

                                            </div>


                                            {/* STATUS */}

                                            <div className="
                                                mt-4
                                                flex
                                                items-center
                                                justify-between
                                                border-t
                                                border-white/10
                                                pt-2
                                                text-[8px]
                                            ">

                                                <span className="text-emerald-400">
                                                    ● Ready
                                                </span>

                                                <span className="text-slate-600">
                                                    portfolio.dev
                                                </span>

                                            </div>

                                        </div>

                                    ) : null}



                                    {/* ================= CREATIVE ================= */}

                                    {template.id === "creative" ? (

                                        <div className="
                                            relative
                                            h-full
                                            overflow-hidden
                                            p-3
                                        ">

                                            {/* GLOW */}

                                            <div className="
                                                absolute
                                                -right-8
                                                -top-8
                                                h-28
                                                w-28
                                                rounded-full
                                                bg-white/25
                                                blur-2xl
                                            " />

                                            <div className="
                                                absolute
                                                -bottom-10
                                                -left-8
                                                h-32
                                                w-32
                                                rounded-full
                                                bg-cyan-300/30
                                                blur-2xl
                                            " />


                                            {/* HEADER */}

                                            <div className="
                                                relative
                                                flex
                                                items-center
                                                justify-between
                                            ">

                                                <div className="
                                                    rounded-full
                                                    bg-white/20
                                                    px-3
                                                    py-1
                                                    text-[8px]
                                                    font-bold
                                                    text-white
                                                    backdrop-blur-md
                                                ">
                                                    CREATIVE
                                                </div>


                                                <div className="
                                                    h-7
                                                    w-7
                                                    rounded-full
                                                    border
                                                    border-white/40
                                                    bg-white/20
                                                " />

                                            </div>


                                            {/* HERO CARD */}

                                            <div className="
                                                relative
                                                mt-5
                                                rounded-2xl
                                                border
                                                border-white/20
                                                bg-white/15
                                                p-3
                                                backdrop-blur-md
                                            ">

                                                <div className="
                                                    h-3
                                                    w-28
                                                    rounded-full
                                                    bg-white
                                                " />

                                                <div className="
                                                    mt-2
                                                    h-2
                                                    w-20
                                                    rounded-full
                                                    bg-white/60
                                                " />


                                                <div className="
                                                    mt-4
                                                    flex
                                                    gap-2
                                                ">

                                                    <span className="
                                                        h-7
                                                        w-7
                                                        rounded-lg
                                                        bg-white/30
                                                    " />

                                                    <span className="
                                                        h-7
                                                        flex-1
                                                        rounded-lg
                                                        bg-white/20
                                                    " />

                                                </div>

                                            </div>


                                            {/* BOTTOM SHAPES */}

                                            <div className="
                                                relative
                                                mt-3
                                                flex
                                                gap-2
                                            ">

                                                <span className="
                                                    h-2
                                                    w-16
                                                    rounded-full
                                                    bg-white/50
                                                " />

                                                <span className="
                                                    h-2
                                                    w-10
                                                    rounded-full
                                                    bg-white/30
                                                " />

                                            </div>

                                        </div>

                                    ) : null}



                                    {/* ========================================
                                        SELECTED BORDER
                                    ======================================== */}

                                    {isSelected ? (

                                        <div className="
                                            absolute
                                            inset-0
                                            ring-2
                                            ring-inset
                                            ring-cyan-300/60
                                        " />

                                    ) : null}

                                </div>



                                {/* ========================================
                                    TEMPLATE INFO
                                ======================================== */}

                                <div className="
                                    border-t
                                    border-white/10
                                    bg-[#07111f]
                                    p-4
                                ">

                                    <div className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-3
                                    ">

                                        <div className="min-w-0">

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                            ">

                                                <span className="
                                                    text-base
                                                    text-cyan-300
                                                ">
                                                    {template.icon}
                                                </span>

                                                <p className={`
                                                    text-sm
                                                    font-bold
                                                    ${
                                                        isSelected
                                                            ? "text-cyan-300"
                                                            : "text-white"
                                                    }
                                                `}>
                                                    {template.name}
                                                </p>

                                            </div>


                                            <p className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-slate-500
                                            ">
                                                {template.description}
                                            </p>

                                        </div>


                                        {isSelected ? (

                                            <span className="
                                                shrink-0
                                                rounded-full
                                                border
                                                border-cyan-400/20
                                                bg-cyan-400/10
                                                px-2.5
                                                py-1
                                                text-[9px]
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-cyan-300
                                            ">
                                                Selected
                                            </span>

                                        ) : (

                                            <span className="
                                                shrink-0
                                                rounded-full
                                                border
                                                border-white/10
                                                bg-white/[0.03]
                                                px-2.5
                                                py-1
                                                text-[9px]
                                                font-medium
                                                text-slate-500
                                                opacity-0
                                                transition
                                                group-hover:opacity-100
                                            ">
                                                Select
                                            </span>

                                        )}

                                    </div>

                                </div>

                            </button>
                        );

                    })}

                </div>

            </div>


            {/* ========================================
                CUSTOM COLORS
            ======================================== */}

            <div>

                <p className="mb-3 text-sm font-semibold text-slate-300">
                    Portfolio Colors
                </p>


                <div
                    className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.02]
                        p-4
                    "
                >

                    <p className="text-sm font-semibold text-white">
                        Customize Colors
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Choose the primary and secondary colors
                        for your portfolio.
                    </p>


                    <div className="
                        mt-5
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                    ">

                        {/* ========================================
                            PRIMARY COLOR
                        ======================================== */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-[11px]
                                    font-medium
                                    text-slate-400
                                "
                            >
                                Primary Color
                            </label>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-[#070b16]
                                    p-3
                                "
                            >

                                <input
                                    type="color"
                                    value={
                                        form.customization.primaryColor ||
                                        "#22d3ee"
                                    }
                                    onChange={(event) =>
                                        onNestedChange(
                                            "customization",
                                            "primaryColor",
                                            event.target.value
                                        )
                                    }
                                    className="
                                        h-10
                                        w-10
                                        cursor-pointer
                                        rounded-lg
                                        border-0
                                        bg-transparent
                                    "
                                />


                                <div className="min-w-0">

                                    <p className="
                                        text-sm
                                        font-medium
                                        text-white
                                    ">
                                        Primary
                                    </p>

                                    <p className="
                                        mt-0.5
                                        text-xs
                                        text-slate-500
                                    ">
                                        Main accent color
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            font-mono
                                        "
                                        style={{
                                            color:
                                                form.customization.primaryColor ||
                                                "#22d3ee"
                                        }}
                                    >
                                        {
                                            form.customization.primaryColor ||
                                            "#22d3ee"
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>



                        {/* ========================================
                            SECONDARY COLOR
                        ======================================== */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-[11px]
                                    font-medium
                                    text-slate-400
                                "
                            >
                                Secondary Color
                            </label>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-[#070b16]
                                    p-3
                                "
                            >

                                <input
                                    type="color"
                                    value={
                                        form.customization.secondaryColor ||
                                        "#3b82f6"
                                    }
                                    onChange={(event) =>
                                        onNestedChange(
                                            "customization",
                                            "secondaryColor",
                                            event.target.value
                                        )
                                    }
                                    className="
                                        h-10
                                        w-10
                                        cursor-pointer
                                        rounded-lg
                                        border-0
                                        bg-transparent
                                    "
                                />


                                <div className="min-w-0">

                                    <p className="
                                        text-sm
                                        font-medium
                                        text-white
                                    ">
                                        Secondary
                                    </p>

                                    <p className="
                                        mt-0.5
                                        text-xs
                                        text-slate-500
                                    ">
                                        Supporting accent color
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            font-mono
                                        "
                                        style={{
                                            color:
                                                form.customization.secondaryColor ||
                                                "#3b82f6"
                                        }}
                                    >
                                        {
                                            form.customization.secondaryColor ||
                                            "#3b82f6"
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>



                    {/* ========================================
                        COLOR PREVIEW
                    ======================================== */}

                    <div className="mt-5">

                        <p className="
                            mb-2
                            text-[11px]
                            font-medium
                            text-slate-400
                        ">
                            Preview
                        </p>


                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-white/10
                                bg-[#070b16]
                                p-4
                            "
                        >

                            <div
                                className="
                                    h-10
                                    w-10
                                    rounded-xl
                                    border
                                    border-white/10
                                "
                                style={{
                                    backgroundColor:
                                        form.customization.primaryColor ||
                                        "#22d3ee"
                                }}
                            />


                            <div
                                className="
                                    h-10
                                    w-10
                                    rounded-xl
                                    border
                                    border-white/10
                                "
                                style={{
                                    backgroundColor:
                                        form.customization.secondaryColor ||
                                        "#3b82f6"
                                }}
                            />


                            <div className="ml-2">

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-white
                                ">
                                    Color Preview
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                ">
                                    These colors will be used across
                                    your portfolio.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ========================================
                SEO SETTINGS
            ======================================== */}

            <div>

                <div className="mb-3">

                    <p className="
                        text-sm
                        font-semibold
                        text-slate-300
                    ">
                        SEO Settings
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-slate-600
                    ">
                        Optimize your portfolio for search engines
                        and social sharing.
                    </p>

                </div>


                <div className="
                    space-y-4
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-4
                ">

                    {/* ========================================
                        META TITLE
                    ======================================== */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-[11px]
                            font-medium
                            text-slate-400
                        ">
                            Meta Title
                        </label>


                        <input
                            type="text"
                            value={
                                form.seo &&
                                form.seo.metaTitle
                                    ? form.seo.metaTitle
                                    : ""
                            }
                            onChange={(event) =>
                                onNestedChange(
                                    "seo",
                                    "metaTitle",
                                    event.target.value
                                )
                            }
                            placeholder="Your Name | Full Stack Developer"
                            maxLength={160}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-[#070b16]
                                px-4
                                py-3
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-slate-600
                                focus:border-cyan-400/30
                            "
                        />


                        <p className="
                            mt-1
                            text-right
                            text-[10px]
                            text-slate-600
                        ">
                            {
                                form.seo &&
                                form.seo.metaTitle
                                    ? form.seo.metaTitle.length
                                    : 0
                            }/160
                        </p>

                    </div>



                    {/* ========================================
                        META DESCRIPTION
                    ======================================== */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-[11px]
                            font-medium
                            text-slate-400
                        ">
                            Meta Description
                        </label>


                        <textarea
                            value={
                                form.seo &&
                                form.seo.metaDescription
                                    ? form.seo.metaDescription
                                    : ""
                            }
                            onChange={(event) =>
                                onNestedChange(
                                    "seo",
                                    "metaDescription",
                                    event.target.value
                                )
                            }
                            placeholder="A short description of your portfolio..."
                            maxLength={320}
                            rows={4}
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-white/10
                                bg-[#070b16]
                                px-4
                                py-3
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-slate-600
                                focus:border-cyan-400/30
                            "
                        />


                        <p className="
                            mt-1
                            text-right
                            text-[10px]
                            text-slate-600
                        ">
                            {
                                form.seo &&
                                form.seo.metaDescription
                                    ? form.seo.metaDescription.length
                                    : 0
                            }/320
                        </p>

                    </div>



                    {/* ========================================
                        KEYWORDS
                    ======================================== */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-[11px]
                            font-medium
                            text-slate-400
                        ">
                            Keywords
                        </label>


                        <input
                            type="text"
                            value={
                                form.seo &&
                                Array.isArray(
                                    form.seo.keywords
                                )
                                    ? form.seo.keywords.join(
                                        ", "
                                    )
                                    : ""
                            }
                            onChange={(event) => {

                                const keywords =
                                    event.target.value
                                        .split(",")
                                        .map(
                                            (keyword) =>
                                                keyword.trim()
                                        )
                                        .filter(Boolean);


                                onNestedChange(
                                    "seo",
                                    "keywords",
                                    keywords
                                );

                            }}
                            placeholder="javascript, react, node.js, full stack developer"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-[#070b16]
                                px-4
                                py-3
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-slate-600
                                focus:border-cyan-400/30
                            "
                        />


                        <p className="
                            mt-1
                            text-[10px]
                            text-slate-600
                        ">
                            Separate keywords with commas.
                        </p>

                    </div>



                    {/* ========================================
                        SOCIAL PREVIEW IMAGE
                    ======================================== */}

                    <div>

                        <label className="
                            mb-2
                            block
                            text-[11px]
                            font-medium
                            text-slate-400
                        ">
                            Social Preview Image URL
                        </label>


                        <input
                            type="url"
                            value={
                                form.seo &&
                                form.seo.ogImage
                                    ? form.seo.ogImage
                                    : ""
                            }
                            onChange={(event) =>
                                onNestedChange(
                                    "seo",
                                    "ogImage",
                                    event.target.value
                                )
                            }
                            placeholder="https://example.com/og-image.png"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-[#070b16]
                                px-4
                                py-3
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-slate-600
                                focus:border-cyan-400/30
                            "
                        />


                        <p className="
                            mt-1
                            text-[10px]
                            text-slate-600
                        ">
                            Image shown when your portfolio link is shared.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default AppearanceSettings;