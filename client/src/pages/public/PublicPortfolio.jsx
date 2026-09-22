import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import api from "../../api/axios";

import LivePortfolioPreview
    from "../../components/LivePortfolioPreview";


const emptyList = [];


const toArray = (value) => {
    return Array.isArray(value)
        ? value
        : emptyList;
};


const setMetaTag = (
    selector,
    attributes,
    content
) => {
    let element = document.head.querySelector(selector);

    if (!element) {
        element = document.createElement("meta");

        Object.entries(attributes).forEach(
            ([name, value]) => {
                element.setAttribute(name, value);
            }
        );

        document.head.appendChild(element);
    }

    element.setAttribute("content", content);
};


const normalizePortfolio = (value) => {

    const portfolio = value || {};

    return {
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
            portfolio.email || "",

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

        resume:
            portfolio.resume || {
                url: "",
                publicId: "",
                fileName: ""
            },

        theme:
            portfolio.theme || "dark",

        template:
            portfolio.template || "modern",

        customization:
            portfolio.customization || {
                primaryColor: "#22d3ee",
                secondaryColor: "#3b82f6",
                font: "Inter",
                borderRadius: "medium"
            },

        seo:
            portfolio.seo || {
                metaTitle: "",
                metaDescription: "",
                keywords: [],
                ogImage: ""
            },

        isPublished:
            Boolean(portfolio.isPublished),

        showAboutSection:
            portfolio.showAboutSection !== false,

        showContactSection:
            portfolio.showContactSection !== false,

        showProjectsSection:
            portfolio.showProjectsSection !== false,

        showSkillsSection:
            portfolio.showSkillsSection !== false,

        showExperienceSection:
            portfolio.showExperienceSection !== false,

        showEducationSection:
            portfolio.showEducationSection !== false,

        showCertificatesSection:
            portfolio.showCertificatesSection !== false,

        showPostsSection:
            portfolio.showPostsSection !== false
    };
};


const PublicPortfolio = () => {

    const {
        slug
    } = useParams();


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        let active = true;


        const loadPublicPortfolio = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(
                    `/portfolio/public/${slug}`
                );

                if (!active) {
                    return;
                }

                const body =
                    response && response.data
                        ? response.data
                        : {};

                const payload =
                    body && body.data
                        ? body.data
                        : body;

                const portfolio = normalizePortfolio(
                    payload && payload.portfolio
                        ? payload.portfolio
                        : payload
                );

                if (!portfolio.isPublished) {
                    throw new Error(
                        "This portfolio is not published."
                    );
                }

                setData({
                    portfolio,
                    projects: toArray(
                        payload.projects
                    ),
                    skills: toArray(
                        payload.skills
                    ),
                    experiences: toArray(
                        payload.experiences
                    ),
                    education: toArray(
                        payload.education
                    ),
                    certificates: toArray(
                        payload.certificates
                    ),
                    posts: toArray(
                        payload.posts
                    )
                });

            } catch (requestError) {

                if (!active) {
                    return;
                }

                const responseData =
                    requestError &&
                    requestError.response &&
                    requestError.response.data
                        ? requestError.response.data
                        : {};

                const message =
                    responseData.message ||
                    requestError.message ||
                    "Portfolio not found.";

                setError(message);
                setData(null);

            } finally {

                if (active) {
                    setLoading(false);
                }
            }
        };


        if (!slug) {
            setError("Portfolio slug is missing.");
            setLoading(false);
            return () => {
                active = false;
            };
        }


        loadPublicPortfolio();


        return () => {
            active = false;
        };

    }, [slug]);


    useEffect(() => {
        if (!data) {
            return undefined;
        }

        const portfolio = data.portfolio || {};
        const seo = portfolio.seo || {};
        const title = seo.metaTitle || portfolio.title || portfolio.username || "Portfolio";
        const description = seo.metaDescription || portfolio.headline || portfolio.bio || "";
        const keywords = Array.isArray(seo.keywords)
            ? seo.keywords.join(", ")
            : "";

        const previousTitle = document.title;

        document.title = title;

        setMetaTag(
            'meta[name="description"]',
            { name: "description" },
            description
        );

        setMetaTag(
            'meta[name="keywords"]',
            { name: "keywords" },
            keywords
        );

        setMetaTag(
            'meta[property="og:title"]',
            { property: "og:title" },
            title
        );

        setMetaTag(
            'meta[property="og:description"]',
            { property: "og:description" },
            description
        );

        setMetaTag(
            'meta[property="og:image"]',
            { property: "og:image" },
            seo.ogImage || ""
        );

        return () => {
            document.title = previousTitle;
        };
    }, [data]);


    if (loading) {

        return (
            <main className="flex min-h-screen items-center justify-center bg-[#040712] px-6 text-white">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                    <p className="mt-4 text-sm text-slate-400">
                        Loading portfolio...
                    </p>

                </div>

            </main>
        );
    }


    if (error || !data) {

        return (
            <main className="flex min-h-screen items-center justify-center bg-[#040712] px-6 text-white">

                <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl">

                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-300">
                        404
                    </p>

                    <h1 className="mt-3 text-3xl font-black">
                        Portfolio Not Found
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-slate-400">
                        {error ||
                            "This portfolio is unavailable."}
                    </p>

                </div>

            </main>
        );
    }


    const portfolio = data.portfolio;


    return (
        <main className="min-h-screen bg-[#040712]">

            <LivePortfolioPreview
                form={portfolio}
                user={{
                    name:
                        portfolio.title ||
                        portfolio.username ||
                        "Portfolio"
                }}
                publicData={data}
                isPublic={true}
            />

        </main>
    );
};


export default PublicPortfolio;
