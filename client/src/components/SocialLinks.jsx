const fields = [
    [
        "github",
        "GitHub",
        "https://github.com/username"
    ],
    [
        "linkedin",
        "LinkedIn",
        "https://linkedin.com/in/username"
    ],
    [
        "twitter",
        "Twitter / X",
        "https://x.com/username"
    ],
    [
        "instagram",
        "Instagram",
        "https://instagram.com/username"
    ],
    [
        "youtube",
        "YouTube",
        "https://youtube.com/@username"
    ]
];


const SocialLinks = ({
    form,
    onChange
}) => {

    return (

        <div className="space-y-5">

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">

                <p className="text-sm font-semibold">
                    Social profiles
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Add only the platforms you use. Everything is optional.
                </p>

            </div>


            {fields.map(
                ([
                    name,
                    label,
                    placeholder
                ]) => (

                    <div key={name}>

                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            {label}
                        </label>

                        <input
                            type="url"
                            value={
                                form[name]
                            }
                            onChange={(event) =>
                                onChange(
                                    name,
                                    event.target.value
                                )
                            }
                            placeholder={
                                placeholder
                            }
                            className="w-full rounded-xl border border-white/10 bg-[#070b16] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
                        />

                    </div>

                )
            )}

        </div>
    );
};


export default SocialLinks;