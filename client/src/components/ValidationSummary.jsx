const fieldToSection = {

    username: "basic",
    slug: "basic",
    title: "basic",
    headline: "basic",
    bio: "basic",

    profileImage: "profile",
    location: "profile",
    email: "profile",
    phone: "profile",
    website: "profile",

    github: "social",
    linkedin: "social",
    twitter: "social",
    instagram: "social",
    youtube: "social",

    theme: "appearance",
    template: "appearance",

    "seo.metaTitle": "seo",
    "seo.metaDescription": "seo",
    "seo.keywords": "seo",
    "seo.ogImage": "seo"
};


const labels = {

    username: "Username",
    slug: "Portfolio Slug",
    title: "Portfolio Title",
    headline: "Headline",
    bio: "Bio",

    profileImage: "Profile Image",
    location: "Location",
    email: "Public Email",
    phone: "Phone",
    website: "Website",

    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "Twitter / X",
    instagram: "Instagram",
    youtube: "YouTube",

    theme: "Theme",
    template: "Template",

    "seo.metaTitle": "SEO Meta Title",
    "seo.metaDescription":
        "SEO Meta Description",
    "seo.keywords": "SEO Keywords",
    "seo.ogImage": "SEO Image"
};


const ValidationSummary = ({
    errors,
    onSelectSection
}) => {

    const visibleErrors =
        Object.entries(errors)
            .filter(
                ([key, value]) =>
                    key !== "_global" &&
                    value
            );


    if (
        visibleErrors.length === 0
    ) {
        return null;
    }


    return (

        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-4">

            <div className="flex items-start justify-between gap-4">

                <div>

                    <p className="text-sm font-semibold text-red-200">
                        Please fix these fields
                    </p>

                    <p className="mt-1 text-[11px] text-red-300/70">
                        {visibleErrors.length} issue
                        {visibleErrors.length > 1
                            ? "s"
                            : ""} found.
                    </p>

                </div>


                <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-[10px] font-bold text-red-300">
                    {visibleErrors.length}
                </span>

            </div>


            <div className="mt-3 grid gap-2 md:grid-cols-2">

                {visibleErrors.map(
                    ([key, value]) => (

                        <button
                            key={key}
                            type="button"
                            onClick={() =>
                                onSelectSection(
                                    fieldToSection[
                                        key
                                    ] || "basic"
                                )
                            }
                            className="rounded-xl border border-red-400/10 bg-red-400/[0.03] px-3 py-2 text-left transition hover:border-red-400/20"
                        >

                            <p className="text-xs font-semibold text-red-200">
                                {
                                    labels[key] ||
                                    key
                                }
                            </p>

                            <p className="mt-1 text-[10px] leading-4 text-red-300/70">
                                {value}
                            </p>

                        </button>

                    )
                )}

            </div>

        </div>
    );
};


export default ValidationSummary;