const SeoSettings = ({
    form,
    onNestedChange,
    fieldErrors
}) => {

    // ========================================
    // KEYWORDS SAVE
    // ========================================

    const saveKeywords = (event) => {

        const keywords = event.target.value
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean);

        onNestedChange(
            "seo",
            "keywords",
            keywords
        );

    };


    return (

        <div className="space-y-5">


            {/* ==================================
                SEO INFO
            ================================== */}

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-4">

                <p className="text-xs font-semibold text-cyan-300">
                    SEO is optional
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Add SEO details now or later.
                </p>

            </div>


            {/* ==================================
                META TITLE
            ================================== */}

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Meta Title
                </label>

                <input
                    type="text"
                    value={
                        form.seo.metaTitle
                    }
                    maxLength={160}
                    onChange={(event) =>
                        onNestedChange(
                            "seo",
                            "metaTitle",
                            event.target.value
                        )
                    }
                    placeholder="Subhadeep Garai | Full Stack Developer"
                    className={`w-full rounded-xl border bg-[#070b16] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:ring-1 ${
                        fieldErrors["seo.metaTitle"]
                            ? "border-red-400/50 focus:border-red-400/60 focus:ring-red-400/10"
                            : "border-white/10 focus:border-cyan-400/40 focus:ring-cyan-400/20"
                    }`}
                />

                <div className="mt-1.5 flex justify-between">

                    <span className="text-[10px] text-red-300">
                        {
                            fieldErrors[
                                "seo.metaTitle"
                            ] || ""
                        }
                    </span>

                    <span className="text-[10px] text-slate-600">
                        {
                            form.seo.metaTitle.length
                        }
                        /160
                    </span>

                </div>

            </div>


            {/* ==================================
                META DESCRIPTION
            ================================== */}

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Meta Description
                </label>

                <textarea
                    value={
                        form.seo.metaDescription
                    }
                    maxLength={320}
                    rows={5}
                    onChange={(event) =>
                        onNestedChange(
                            "seo",
                            "metaDescription",
                            event.target.value
                        )
                    }
                    placeholder="Describe your portfolio..."
                    className={`w-full resize-none rounded-xl border bg-[#070b16] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:ring-1 ${
                        fieldErrors[
                            "seo.metaDescription"
                        ]
                            ? "border-red-400/50 focus:border-red-400/60 focus:ring-red-400/10"
                            : "border-white/10 focus:border-cyan-400/40 focus:ring-cyan-400/20"
                    }`}
                />

                <div className="mt-1.5 flex justify-between">

                    <span className="text-[10px] text-red-300">
                        {
                            fieldErrors[
                                "seo.metaDescription"
                            ] || ""
                        }
                    </span>

                    <span className="text-[10px] text-slate-600">
                        {
                            form.seo
                                .metaDescription
                                .length
                        }
                        /320
                    </span>

                </div>

            </div>


            {/* ==================================
                KEYWORDS
            ================================== */}

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Keywords
                </label>

                <input
                    type="text"
                    value={
                        Array.isArray(form.seo.keywords)
                            ? form.seo.keywords.join(", ")
                            : ""
                    }
                    onChange={saveKeywords}
                    placeholder="react, nodejs, mongodb, express"
                    className="w-full rounded-xl border border-white/10 bg-[#070b16] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                />

                <div className="mt-2">

                    <p className="text-[11px] leading-5 text-slate-600">
                        Example: react, nodejs, mongodb
                    </p>

                </div>


                {/* ==================================
                    KEYWORD PREVIEW
                ================================== */}

                {Array.isArray(form.seo.keywords) &&
                    form.seo.keywords.length > 0 && (

                        <div className="mt-3 flex flex-wrap gap-2">

                            {form.seo.keywords.map(
                                (keyword, index) => (

                                    <span
                                        key={`${keyword}-${index}`}
                                        className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-2.5 py-1 text-[10px] text-cyan-300"
                                    >
                                        {keyword}
                                    </span>

                                )
                            )}

                        </div>

                    )}

            </div>


            {/* ==================================
                OG IMAGE
            ================================== */}

            <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Open Graph Image URL
                </label>

                <input
                    type="url"
                    value={
                        form.seo.ogImage
                    }
                    onChange={(event) =>
                        onNestedChange(
                            "seo",
                            "ogImage",
                            event.target.value
                        )
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-[#070b16] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                />

            </div>

        </div>
    );
};

export default SeoSettings;