const Field = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    helper,
    error
}) => {

    return (

        <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </label>


            <input
                value={value}
                onChange={(event) =>
                    onChange(
                        name,
                        event.target.value
                    )
                }
                placeholder={placeholder}
                className={`w-full rounded-xl border bg-[#070b16] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:ring-1 ${
                    error
                        ? "border-red-400/50 focus:border-red-400/60 focus:ring-red-400/10"
                        : "border-white/10 focus:border-cyan-400/40 focus:ring-cyan-400/20"
                }`}
            />


            {error ? (

                <p className="mt-1.5 text-[11px] text-red-300">
                    {error}
                </p>

            ) : helper ? (

                <p className="mt-1.5 text-[11px] leading-5 text-slate-600">
                    {helper}
                </p>

            ) : null}

        </div>
    );
};


const BasicInformation = ({
    form,
    onChange,
    fieldErrors
}) => {

    return (

        <div className="space-y-5">

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-4">

                <p className="text-xs font-semibold text-cyan-300">
                    Start simple
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Student, fresher or experienced developer — fill only the fields you need.
                </p>

            </div>


            <Field
                label="Username"
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="subhadeep"
                helper="Optional. Backend generates one if empty."
                error={fieldErrors.username}
            />


            <Field
                label="Portfolio Slug"
                name="slug"
                value={form.slug}
                onChange={onChange}
                placeholder="subhadeep-garai"
                helper="Optional. Backend generates one if empty."
                error={fieldErrors.slug}
            />


            <Field
                label="Portfolio Title"
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="Subhadeep Garai"
                error={fieldErrors.title}
            />


            <Field
                label="Headline"
                name="headline"
                value={form.headline}
                onChange={onChange}
                placeholder="Full Stack Developer"
                error={fieldErrors.headline}
            />


            <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Bio
                </label>

                <textarea
                    value={form.bio}
                    onChange={(event) =>
                        onChange(
                            "bio",
                            event.target.value
                        )
                    }
                    rows={6}
                    placeholder="Tell visitors about yourself..."
                    className={`w-full resize-none rounded-xl border bg-[#070b16] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:ring-1 ${
                        fieldErrors.bio
                            ? "border-red-400/50 focus:border-red-400/60 focus:ring-red-400/10"
                            : "border-white/10 focus:border-cyan-400/40 focus:ring-cyan-400/20"
                    }`}
                />


                <div className="mt-1.5 flex items-center justify-between">

                    <p className="text-[11px] text-slate-600">
                        Optional
                    </p>

                    <p className="text-[10px] text-slate-600">
                        {form.bio.length}/2000
                    </p>

                </div>


                {fieldErrors.bio && (

                    <p className="mt-1 text-[11px] text-red-300">
                        {fieldErrors.bio}
                    </p>

                )}

            </div>

        </div>
    );
};


export default BasicInformation;