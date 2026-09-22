const sections = [
    [
        "showAboutSection",
        "About",
        "Your introduction and story."
    ],
    [
        "showContactSection",
        "Contact",
        "Let visitors contact you."
    ],
    [
        "showProjectsSection",
        "Projects",
        "Show your work."
    ],
    [
        "showSkillsSection",
        "Skills",
        "Display your technologies."
    ],
    [
        "showExperienceSection",
        "Experience",
        "Jobs, internships or freelance work."
    ],
    [
        "showEducationSection",
        "Education",
        "Useful for students and graduates."
    ],
    [
        "showCertificatesSection",
        "Certificates",
        "Show certifications."
    ],
    [
        "showPostsSection",
        "Posts",
        "Blogs and achievements."
    ]
];


const Toggle = ({
    enabled,
    onClick
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                enabled
                    ? "bg-cyan-400/80"
                    : "bg-slate-700"
            }`}
        >

            <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    enabled
                        ? "left-6"
                        : "left-1"
                }`}
            />

        </button>
    );
};


const SectionVisibility = ({
    form,
    onChange
}) => {

    return (

        <div className="space-y-3">

            <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">

                <p className="text-sm font-semibold">
                    Portfolio Sections
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                    Turn sections on or off.
                </p>

            </div>


            {sections.map(
                ([
                    key,
                    label,
                    description
                ]) => (

                    <div
                        key={key}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
                    >

                        <div>

                            <p className="text-sm font-semibold text-slate-300">
                                {label}
                            </p>

                            <p className="mt-1 text-[10px] leading-4 text-slate-600">
                                {description}
                            </p>

                        </div>


                        <Toggle
                            enabled={
                                form[key]
                            }
                            onClick={() =>
                                onChange(
                                    key,
                                    !form[key]
                                )
                            }
                        />

                    </div>

                )
            )}

        </div>
    );
};


export default SectionVisibility;