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

                <p className="mb-3 text-sm font-semibold text-slate-300">
                    Portfolio Template
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
                        Choose a Template
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Select the visual style for your public portfolio.
                    </p>


                    <div className="mt-5 grid grid-cols-1 gap-3">

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
                                        relative
                                        w-full
                                        rounded-2xl
                                        border
                                        p-4
                                        text-left
                                        transition
                                        duration-200
                                        ${
                                            isSelected
                                                ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.08)]"
                                                : "border-white/10 bg-[#070b16] hover:border-cyan-400/20 hover:bg-white/[0.04]"
                                        }
                                    `}
                                >

                                    <div className="flex items-center gap-3">

                                        <div
                                            className={`
                                                flex
                                                h-11
                                                w-11
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                text-sm
                                                font-bold
                                                transition
                                                ${
                                                    isSelected
                                                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                                                        : "border-white/10 bg-white/[0.03] text-slate-400 group-hover:text-cyan-300"
                                                }
                                            `}
                                        >
                                            {template.icon}
                                        </div>


                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-center justify-between gap-3">

                                                <p
                                                    className={`
                                                        text-sm
                                                        font-semibold
                                                        ${
                                                            isSelected
                                                                ? "text-cyan-300"
                                                                : "text-white"
                                                        }
                                                    `}
                                                >
                                                    {template.name}
                                                </p>


                                                {isSelected ? (

                                                    <span
                                                        className="
                                                            shrink-0
                                                            rounded-full
                                                            border
                                                            border-cyan-400/20
                                                            bg-cyan-400/10
                                                            px-2
                                                            py-1
                                                            text-[9px]
                                                            font-bold
                                                            uppercase
                                                            tracking-[0.16em]
                                                            text-cyan-300
                                                        "
                                                    >
                                                        Selected
                                                    </span>

                                                ) : null}

                                            </div>


                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                {template.description}
                                            </p>

                                        </div>

                                    </div>

                                </button>
                            );

                        })}

                    </div>

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


                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* PRIMARY COLOR */}

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

                                    <p className="text-sm font-medium text-white">
                                        Primary
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
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


                        {/* SECONDARY COLOR */}

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

                                    <p className="text-sm font-medium text-white">
                                        Secondary
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
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


                    {/* COLOR PREVIEW */}

                    <div className="mt-5">

                        <p className="mb-2 text-[11px] font-medium text-slate-400">
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

                                <p className="text-sm font-semibold text-white">
                                    Color Preview
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
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
                    <p className="text-sm font-semibold text-slate-300">
                        SEO Settings
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                        Optimize your portfolio for search engines and social sharing.
                    </p>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">

                    <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-400">
                            Meta Title
                        </label>

                        <input
                            type="text"
                            value={
                                form.seo && form.seo.metaTitle
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
                            className="w-full rounded-xl border border-white/10 bg-[#070b16] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                        />

                        <p className="mt-1 text-right text-[10px] text-slate-600">
                            {
                                form.seo && form.seo.metaTitle
                                    ? form.seo.metaTitle.length
                                    : 0
                            }/160
                        </p>
                    </div>


                    <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-400">
                            Meta Description
                        </label>

                        <textarea
                            value={
                                form.seo && form.seo.metaDescription
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
                            className="w-full resize-none rounded-xl border border-white/10 bg-[#070b16] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                        />

                        <p className="mt-1 text-right text-[10px] text-slate-600">
                            {
                                form.seo && form.seo.metaDescription
                                    ? form.seo.metaDescription.length
                                    : 0
                            }/320
                        </p>
                    </div>


                    <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-400">
                            Keywords
                        </label>

                        <input
                            type="text"
                            value={
                                form.seo && Array.isArray(form.seo.keywords)
                                    ? form.seo.keywords.join(", ")
                                    : ""
                            }
                            onChange={(event) => {
                                const keywords = event.target.value
                                    .split(",")
                                    .map((keyword) => keyword.trim())
                                    .filter(Boolean);

                                onNestedChange(
                                    "seo",
                                    "keywords",
                                    keywords
                                );
                            }}
                            placeholder="javascript, react, node.js, full stack developer"
                            className="w-full rounded-xl border border-white/10 bg-[#070b16] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                        />

                        <p className="mt-1 text-[10px] text-slate-600">
                            Separate keywords with commas.
                        </p>
                    </div>


                    <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-400">
                            Social Preview Image URL
                        </label>

                        <input
                            type="url"
                            value={
                                form.seo && form.seo.ogImage
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
                            className="w-full rounded-xl border border-white/10 bg-[#070b16] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                        />

                        <p className="mt-1 text-[10px] text-slate-600">
                            Image shown when your portfolio link is shared.
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
};


export default AppearanceSettings;