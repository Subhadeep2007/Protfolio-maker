import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";

import {
    usePortfolio
} from "../../context/PortfolioContext";

import BuilderSidebar from "../../components/BuilderSidebar";
import LivePortfolioPreview from "../../components/LivePortfolioPreview";
import ValidationSummary from "../../components/ValidationSummary";

import {
    deletePortfolio
} from "../../api/portfolio.api";

// ========================================
// INITIAL FORM
// ========================================

const createInitialForm = (user) => ({
    username: "",
    slug: "",

    title: "",
    headline: "",
    bio: "",
    profileImage: "",

    location: "",
    email: user?.email || "",
    phone: "",
    website: "",

    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    youtube: "",

    resume: {
        url: "",
        publicId: "",
        fileName: ""
    },

    theme: "dark",
    template: "modern",

    customization: {
        primaryColor: "#22d3ee",
        secondaryColor: "#3b82f6",
        font: "Inter",
        borderRadius: "medium"
    },

    showAboutSection: true,
    showContactSection: true,
    showProjectsSection: true,
    showSkillsSection: true,
    showExperienceSection: true,
    showEducationSection: true,
    showCertificatesSection: true,
    showPostsSection: true,

    seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        ogImage: ""
    }
});


// ========================================
// HELPERS
// ========================================

const trimValue = (value) => {
    return typeof value === "string"
        ? value.trim()
        : value;
};


const buildPayload = (form) => {

    return {

        username: trimValue(form.username),
        slug: trimValue(form.slug),

        title: trimValue(form.title),
        headline: trimValue(form.headline),
        bio: trimValue(form.bio),
        profileImage: trimValue(form.profileImage),

        location: trimValue(form.location),
        email: trimValue(form.email),
        phone: trimValue(form.phone),
        website: trimValue(form.website),

        github: trimValue(form.github),
        linkedin: trimValue(form.linkedin),
        twitter: trimValue(form.twitter),
        instagram: trimValue(form.instagram),
        youtube: trimValue(form.youtube),

        resume: form.resume,

        theme: form.theme,
        template: form.template,

        customization:
            form.customization,

        showAboutSection:
            form.showAboutSection,

        showContactSection:
            form.showContactSection,

        showProjectsSection:
            form.showProjectsSection,

        showSkillsSection:
            form.showSkillsSection,

        showExperienceSection:
            form.showExperienceSection,

        showEducationSection:
            form.showEducationSection,

        showCertificatesSection:
            form.showCertificatesSection,

        showPostsSection:
            form.showPostsSection,

        seo: {

            metaTitle:
                trimValue(
                    form.seo.metaTitle
                ),

            metaDescription:
                trimValue(
                    form.seo.metaDescription
                ),

            keywords:
                Array.isArray(
                    form.seo.keywords
                )
                    ? form.seo.keywords
                        .map((item) =>
                            trimValue(item)
                        )
                        .filter(Boolean)
                    : [],

            ogImage:
                trimValue(
                    form.seo.ogImage
                )
        }
    };
};


// ========================================
// VALIDATION
// ========================================

const validateForm = (form) => {

    const errors = {};


    // Username
    if (form.username.trim()) {

        if (
            form.username.trim().length < 3 ||
            form.username.trim().length > 30
        ) {

            errors.username =
                "Username must be between 3 and 30 characters.";

        } else if (
            !/^[a-zA-Z0-9_]+$/.test(
                form.username.trim()
            )
        ) {

            errors.username =
                "Username can only contain letters, numbers and underscores.";
        }
    }


    // Slug
    if (form.slug.trim()) {

        if (
            form.slug.trim().length < 3 ||
            form.slug.trim().length > 50
        ) {

            errors.slug =
                "Slug must be between 3 and 50 characters.";

        } else if (
            !/^[a-zA-Z0-9-]+$/.test(
                form.slug.trim()
            )
        ) {

            errors.slug =
                "Slug can only contain letters, numbers and hyphens.";
        }
    }


    // Max lengths
    const maxLengths = [

        [
            "title",
            100,
            "Portfolio title"
        ],

        [
            "headline",
            200,
            "Headline"
        ],

        [
            "bio",
            2000,
            "Bio"
        ],

        [
            "location",
            150,
            "Location"
        ],

        [
            "phone",
            30,
            "Phone"
        ]

    ];


    maxLengths.forEach(
        ([field, max, label]) => {

            if (
                form[field].trim().length > max
            ) {

                errors[field] =
                    `${label} cannot exceed ${max} characters.`;
            }
        }
    );


    // Email
    if (
        form.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            form.email.trim()
        )
    ) {

        errors.email =
            "Please enter a valid email address.";
    }


    // SEO
    if (
        form.seo.metaTitle.length > 160
    ) {

        errors["seo.metaTitle"] =
            "SEO title cannot exceed 160 characters.";
    }


    if (
        form.seo.metaDescription.length > 320
    ) {

        errors["seo.metaDescription"] =
            "SEO description cannot exceed 320 characters.";
    }


    return errors;
};


// ========================================
// API ERROR NORMALIZER
// ========================================

const normalizeApiErrors = (error) => {

    const responseData =
        error?.response?.data;


    if (!responseData) {

        return {
            _global:
                error?.message ||
                "Something went wrong."
        };
    }


    const result = {};


    const apiErrors =
        responseData.errors ||
        responseData.validationErrors ||
        responseData.error?.errors;


    if (Array.isArray(apiErrors)) {

        apiErrors.forEach(
            (item) => {

                const key =
                    item?.path ||
                    item?.param ||
                    item?.field;


                if (key) {

                    result[key] =
                        item?.msg ||
                        item?.message ||
                        "Invalid value.";
                }
            }
        );

    } else if (
        apiErrors &&
        typeof apiErrors === "object"
    ) {

        Object.entries(
            apiErrors
        ).forEach(
            ([key, value]) => {

                result[key] =
                    typeof value === "string"
                        ? value
                        : value?.msg ||
                          value?.message ||
                          "Invalid value.";
            }
        );
    }


    if (
        Object.keys(result).length === 0 &&
        responseData.message
    ) {

        result._global =
            responseData.message;
    }


    return Object.keys(result).length
        ? result
        : {
            _global:
                "Unable to save your portfolio."
        };
};


// ========================================
// COMPONENT
// ========================================

const PortfolioEditor = () => {

    const navigate = useNavigate();

    const {
        user
    } = useAuth();


    const {
        portfolio,
        loading,
        saving,
        error,
        save,
        publish,
        unpublish
    } = usePortfolio();


    const [
        form,
        setForm
    ] = useState(
        () => createInitialForm(user)
    );


    const [
        activeSection,
        setActiveSection
    ] = useState("basic");


    const [
        fieldErrors,
        setFieldErrors
    ] = useState({});


    const [
        message,
        setMessage
    ] = useState("");

    const [
        linkCopied,
        setLinkCopied
    ] = useState(false);

    const [
        deleting,
        setDeleting
    ] = useState(false);


    // ====================================
    // SYNC BACKEND
    // ====================================

    useEffect(() => {

        if (!portfolio) {

            setForm(
                createInitialForm(user)
            );

            return;
        }


        const defaults =
            createInitialForm(user);


        setForm({

            ...defaults,

            ...portfolio,

            username:
                portfolio.username || "",

            slug:
                portfolio.slug || "",

            title:
                portfolio.title || "",

            headline:
                portfolio.headline || "",

            bio:
                portfolio.bio || "",

            profileImage:
                portfolio.profileImage || "",

            location:
                portfolio.location || "",

            email:
                portfolio.email ||
                user?.email ||
                "",

            phone:
                portfolio.phone || "",

            website:
                portfolio.website || "",

            github:
                portfolio.github || "",

            linkedin:
                portfolio.linkedin || "",

            twitter:
                portfolio.twitter || "",

            instagram:
                portfolio.instagram || "",

            youtube:
                portfolio.youtube || "",


            resume: {

                ...defaults.resume,

                ...(portfolio.resume || {})
            },


            theme:
                portfolio.theme ||
                "dark",

            template:
                portfolio.template ||
                "modern",


            customization: {

                ...defaults.customization,

                ...(portfolio.customization || {})
            },


            showAboutSection:
                portfolio.showAboutSection ??
                true,

            showContactSection:
                portfolio.showContactSection ??
                true,

            showProjectsSection:
                portfolio.showProjectsSection ??
                true,

            showSkillsSection:
                portfolio.showSkillsSection ??
                true,

            showExperienceSection:
                portfolio.showExperienceSection ??
                true,

            showEducationSection:
                portfolio.showEducationSection ??
                true,

            showCertificatesSection:
                portfolio.showCertificatesSection ??
                true,

            showPostsSection:
                portfolio.showPostsSection ??
                true,


            seo: {

                ...defaults.seo,

                ...(portfolio.seo || {}),

                keywords:
                    Array.isArray(
                        portfolio.seo?.keywords
                    )
                        ? portfolio.seo.keywords
                        : []
            }
        });


        setFieldErrors({});
        setMessage("");

    }, [
        portfolio,
        user
    ]);


    // ====================================
    // NORMAL FIELD
    // ====================================

    const updateField = (
        name,
        value
    ) => {

        setForm(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );


        setFieldErrors(
            (previous) => {

                const next = {
                    ...previous
                };

                delete next[name];

                return next;
            }
        );


        setMessage("");
    };


    // ====================================
    // NESTED FIELD
    // ====================================

    const updateNestedField = (
        section,
        name,
        value
    ) => {

        setForm(
            (previous) => ({

                ...previous,

                [section]: {

                    ...previous[section],

                    [name]: value
                }
            })
        );


        setFieldErrors(
            (previous) => {

                const next = {
                    ...previous
                };

                delete next[
                    `${section}.${name}`
                ];

                return next;
            }
        );


        setMessage("");
    };


    // ====================================
    // SAVE
    // ====================================

    const handleSave = async () => {

        const errors =
            validateForm(form);


        if (
            Object.keys(errors).length
        ) {

            setFieldErrors(errors);
            setMessage("");

            return;
        }


        setFieldErrors({});
        setMessage("");


        try {

            const savedPortfolio =
                await save(
                    buildPayload(form)
                );

            const savedData =
                savedPortfolio && savedPortfolio.data
                    ? savedPortfolio.data
                    : savedPortfolio;

            const updatedPortfolio =
                savedData && savedData.data
                    ? savedData.data
                    : savedData;

            if (
                updatedPortfolio &&
                typeof updatedPortfolio === "object"
            ) {
                setForm((previous) => ({
                    ...previous,
                    ...updatedPortfolio,
                    customization: {
                        ...previous.customization,
                        ...(updatedPortfolio.customization || {})
                    },
                    seo: {
                        ...previous.seo,
                        ...(updatedPortfolio.seo || {})
                    }
                }));
            }

            setMessage(
                "Portfolio saved successfully."
            );

        } catch (saveError) {

            const errors =
                normalizeApiErrors(
                    saveError
                );


            setFieldErrors(errors);


            if (errors._global) {

                setMessage(
                    errors._global
                );
            }


            const firstField =
                Object.keys(errors).find(
                    (key) =>
                        key !== "_global"
                );


            // Jump to correct tab

            if (
                firstField?.startsWith(
                    "seo."
                )
            ) {

                setActiveSection("seo");

            } else if (
                [
                    "github",
                    "linkedin",
                    "twitter",
                    "instagram",
                    "youtube"
                ].includes(firstField)
            ) {

                setActiveSection(
                    "social"
                );

            } else if (
                [
                    "theme",
                    "template",
                    "customization"
                ].includes(firstField)
            ) {

                setActiveSection(
                    "appearance"
                );

            } else if (
                firstField?.startsWith(
                    "show"
                )
            ) {

                setActiveSection(
                    "sections"
                );

            } else {

                setActiveSection(
                    "basic"
                );
            }
        }
    };


    // ====================================
    // PUBLISH
    // ====================================

    const handlePublish = async () => {

        const errors =
            validateForm(form);


        if (
            Object.keys(errors).length
        ) {

            setFieldErrors(errors);

            return;
        }


        try {

            await save(
                buildPayload(form)
            );


            await publish();


            setForm(
                (previous) => ({
                    ...previous,
                    isPublished: true
                })
            );


            setMessage(
                "Portfolio published successfully."
            );

            setFieldErrors({});

        } catch (publishError) {

            const errors =
                normalizeApiErrors(
                    publishError
                );


            setFieldErrors(errors);

            setMessage(
                errors._global || ""
            );
        }
    };


    // ====================================
    // UNPUBLISH
    // ====================================

    const handleUnpublish =
        async () => {

            try {

                await unpublish();


                setForm(
                    (previous) => ({
                        ...previous,
                        isPublished: false
                    })
                );


                setMessage(
                    "Portfolio unpublished successfully."
                );

                setFieldErrors({});

            } catch (publishError) {

                const errors =
                    normalizeApiErrors(
                        publishError
                    );


                setFieldErrors(errors);

                setMessage(
                    errors._global || ""
                );
            }
        };


    // ====================================
    // DELETE PORTFOLIO
    // ====================================

    const handleDeletePortfolio = async () => {

        if (!portfolio || deleting) {
            return;
        }

        const confirmed = window.confirm(
            "Delete your portfolio permanently? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeleting(true);
            setMessage("");
            setFieldErrors({});

            await deletePortfolio();

            window.alert(
                "Portfolio deleted successfully."
            );

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        } catch (deleteError) {

            const errors =
                normalizeApiErrors(
                    deleteError
                );

            setFieldErrors(errors);

            setMessage(
                errors._global ||
                "Failed to delete portfolio."
            );

        } finally {

            setDeleting(false);
        }
    };


    // ====================================
    // GLOBAL ERROR
    // ====================================

    const combinedGlobalError =
        useMemo(
            () =>
                fieldErrors._global ||
                error ||
                "",
            [
                fieldErrors,
                error
            ]
        );


    // ====================================
    // LOADING
    // ====================================

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-[#040712] text-white">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                    <p className="mt-4 text-sm text-slate-400">
                        Loading your portfolio...
                    </p>

                </div>

            </div>
        );
    }


    // ====================================
    // UI
    // ====================================

    return (

        <div className="min-h-screen bg-[#040712] text-white">

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />

                <div className="absolute -right-40 top-[45%] h-96 w-96 rounded-full bg-blue-500/10 blur-[130px]" />

            </div>


            <div className="relative">

                {/* HEADER */}

                <header className="sticky top-0 z-50 border-b border-white/10 bg-[#040712]/90 backdrop-blur-xl">

                    <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">

                        <div className="flex items-center gap-4">

                            <Link
                                to="/dashboard"
                                className="text-sm text-slate-400 transition hover:text-cyan-300"
                            >
                                ← Dashboard
                            </Link>


                            <div className="hidden h-5 w-px bg-white/10 sm:block" />


                            <div>

                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                                    Portfolio Builder
                                </p>

                                <h1 className="text-lg font-bold sm:text-xl">
                                    Build your portfolio
                                </h1>

                            </div>

                        </div>


                        <div className="flex flex-wrap items-center gap-2">

                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">

                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                        form.isPublished
                                            ? "bg-emerald-400"
                                            : "bg-slate-600"
                                    }`}
                                />

                                {form.isPublished
                                    ? "Published"
                                    : "Draft"}

                            </span>


                            {portfolio ? (
                                <button
                                    type="button"
                                    onClick={handleDeletePortfolio}
                                    disabled={saving || deleting}
                                    className="rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-2.5 text-sm font-bold text-red-300 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : "Delete Portfolio"}
                                </button>
                            ) : null}

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving || deleting}
                                className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </div>

                </header>


                {/* MAIN */}

                <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">

                    {combinedGlobalError && (

                        <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                            {combinedGlobalError}
                        </div>

                    )}


                    {message &&
                        !combinedGlobalError && (

                            <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
                                {message}
                            </div>

                        )}


                    {form.isPublished &&
                    (form.slug.trim() ||
                        form.username.trim()) ? (

                        <section className="mb-5 overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-cyan-400/5 to-transparent p-5 shadow-[0_0_40px_rgba(16,185,129,0.06)]">

                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                <div className="min-w-0">

                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />

                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                                            Portfolio Published
                                        </p>
                                    </div>

                                    <h2 className="mt-2 text-lg font-bold text-white sm:text-xl">
                                        Your portfolio is live
                                    </h2>

                                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                                        Anyone can open this link without logging in.
                                    </p>

                                    <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                                        <p className="break-all text-xs text-slate-300 sm:text-sm">
                                            {`${window.location.origin}/portfolio/${(form.slug || form.username).trim()}`}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex flex-wrap gap-2 lg:shrink-0">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const publicSlug =
                                                (form.slug || form.username).trim();

                                            if (!publicSlug) {
                                                return;
                                            }

                                            const publicUrl =
                                                `${window.location.origin}/portfolio/${publicSlug}`;

                                            navigator.clipboard
                                                .writeText(publicUrl)
                                                .then(() => {
                                                    setLinkCopied(true);

                                                    window.setTimeout(() => {
                                                        setLinkCopied(false);
                                                    }, 1800);
                                                })
                                                .catch(() => {
                                                    setMessage(
                                                        "Unable to copy the portfolio link."
                                                    );
                                                });
                                        }}
                                        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
                                    >
                                        {linkCopied
                                            ? "Copied ✓"
                                            : "Copy Link"}
                                    </button>

                                    <a
                                        href={`/portfolio/${(form.slug || form.username).trim()}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                    >
                                        Open Portfolio ↗
                                    </a>

                                </div>

                            </div>

                        </section>

                    ) : null}


                    <ValidationSummary
                        errors={fieldErrors}
                        onSelectSection={
                            setActiveSection
                        }
                    />


                    <div className="mt-5 grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">

                        <BuilderSidebar
                            form={form}
                            activeSection={
                                activeSection
                            }
                            setActiveSection={
                                setActiveSection
                            }
                            onChange={
                                updateField
                            }
                            onNestedChange={
                                updateNestedField
                            }
                            fieldErrors={
                                fieldErrors
                            }
                            portfolio={
                                portfolio
                            }
                            saving={
                                saving
                            }
                            onSave={
                                handleSave
                            }
                            onPublish={
                                handlePublish
                            }
                            onUnpublish={
                                handleUnpublish
                            }
                        />


                        <LivePortfolioPreview
                            form={form}
                            user={user}
                        />

                    </div>

                </main>

            </div>

        </div>
    );
};


export default PortfolioEditor;