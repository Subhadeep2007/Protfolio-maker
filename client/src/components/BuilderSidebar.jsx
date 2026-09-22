import BasicInformation
    from "./BasicInformation";

import ProfileSettings
    from "./ProfileSettings";

import SocialLinks
    from "./SocialLinks";

import AppearanceSettings
    from "./AppearanceSettings";

import SeoSettings
    from "./SeoSettings";

import SectionVisibility
    from "./SectionVisibility";


const tabs = [
    {
        id: "basic",
        label: "Basic"
    },
    {
        id: "profile",
        label: "Profile"
    },
    {
        id: "social",
        label: "Social"
    },
    {
        id: "appearance",
        label: "Design"
    },
    {
        id: "seo",
        label: "SEO"
    },
    {
        id: "sections",
        label: "Sections"
    }
];


const BuilderSidebar = ({
    form,
    activeSection,
    setActiveSection,
    onChange,
    onNestedChange,
    fieldErrors,
    portfolio,
    saving,
    onSave,
    onPublish,
    onUnpublish
}) => {

    return (

        <aside className="h-fit overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]/95 shadow-2xl backdrop-blur-xl xl:sticky xl:top-24">

            <div className="border-b border-white/10 p-5">

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                    Portfolio Settings
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                    Edit your details
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    Fill only what you need. Every section is optional.
                </p>

            </div>


            <div className="grid grid-cols-2 gap-2 border-b border-white/10 p-3 sm:grid-cols-3 xl:grid-cols-2">

                {tabs.map((tab) => (

                    <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                            setActiveSection(
                                tab.id
                            )
                        }
                        className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                            activeSection === tab.id
                                ? "bg-cyan-400/10 text-cyan-300"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                        {tab.label}
                    </button>

                ))}

            </div>


            <div className="max-h-[calc(100vh-210px)] overflow-y-auto p-5">

                {activeSection === "basic" && (

                    <BasicInformation
                        form={form}
                        onChange={onChange}
                        fieldErrors={
                            fieldErrors
                        }
                    />

                )}


                {activeSection === "profile" && (

                    <ProfileSettings
                        form={form}
                        onChange={onChange}
                        onNestedChange={
                            onNestedChange
                        }
                        fieldErrors={
                            fieldErrors
                        }
                    />

                )}


                {activeSection === "social" && (

                    <SocialLinks
                        form={form}
                        onChange={onChange}
                    />

                )}


                {activeSection === "appearance" && (

                    <AppearanceSettings
                        form={form}
                        onChange={onChange}
                        onNestedChange={
                            onNestedChange
                        }
                    />

                )}


                {activeSection === "seo" && (

                    <SeoSettings
                        form={form}
                        onNestedChange={
                            onNestedChange
                        }
                        fieldErrors={
                            fieldErrors
                        }
                    />

                )}


                {activeSection === "sections" && (

                    <SectionVisibility
                        form={form}
                        onChange={onChange}
                    />

                )}

            </div>


            <div className="border-t border-white/10 p-4">

                <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving
                        ? "Saving..."
                        : "Save Changes"}
                </button>


                {portfolio ? (

                    form.isPublished ? (

                        <button
                            type="button"
                            onClick={onUnpublish}
                            disabled={saving}
                            className="mt-2 w-full rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/10 disabled:opacity-50"
                        >
                            Unpublish Portfolio
                        </button>

                    ) : (

                        <button
                            type="button"
                            onClick={onPublish}
                            disabled={saving}
                            className="mt-2 w-full rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:opacity-50"
                        >
                            Publish Portfolio
                        </button>

                    )

                ) : (

                    <p className="mt-2 text-center text-[11px] leading-5 text-slate-600">
                        Save once to create your portfolio.
                    </p>

                )}

            </div>

        </aside>
    );
};


export default BuilderSidebar;