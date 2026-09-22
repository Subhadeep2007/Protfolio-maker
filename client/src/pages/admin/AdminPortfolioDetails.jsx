import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    getAdminPortfolioDetails
} from "../../api/admin.api";

import LivePortfolioPreview
    from "../../components/LivePortfolioPreview";

const getErrorMessage = (error) => {

    if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
    ) {
        return error.response.data.message;
    }

    if (
        error &&
        error.message
    ) {
        return error.message;
    }

    return "Unable to load portfolio.";

};


const AdminPortfolioDetails = () => {

    const {
        portfolioId
    } = useParams();


    const [
        data,
        setData
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");


    const loadPortfolio =
        async() => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getAdminPortfolioDetails(
                        portfolioId
                    );


                if (
                    response &&
                    response.data
                ) {

                    setData(
                        response.data
                    );

                } else {

                    setData(null);

                }

            } catch (requestError) {

                setError(
                    getErrorMessage(
                        requestError
                    )
                );

                setData(null);

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        if (portfolioId) {
            loadPortfolio();
        }

    }, [portfolioId]);


    if (loading) {

        return (

            <div className="
                flex
                min-h-[500px]
                items-center
                justify-center
                text-sm
                text-slate-500
            ">
                Loading portfolio...
            </div>

        );

    }


    if (
        !data ||
        !data.portfolio
    ) {

        return (

            <div className="
                py-20
                text-center
            ">

                <p className="
                    text-xl
                    font-black
                    text-white
                ">
                    Portfolio not found
                </p>

                {error ? (

                    <p className="
                        mx-auto
                        mt-3
                        max-w-md
                        text-sm
                        text-red-300
                    ">
                        {error}
                    </p>

                ) : null}


                <Link
                    to="/admin/portfolios"
                    className="
                        mt-5
                        inline-flex
                        rounded-xl
                        bg-cyan-400
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-slate-950
                    "
                >
                    ← Back to Portfolios
                </Link>

            </div>

        );

    }


    const portfolio =
        data.portfolio;

    const owner =
        data.owner ||
        portfolio.owner ||
        null;


    const projects =
        Array.isArray(
            data.projects
        )
            ? data.projects
            : [];

    const skills =
        Array.isArray(
            data.skills
        )
            ? data.skills
            : [];

    const experiences =
        Array.isArray(
            data.experiences
        )
            ? data.experiences
            : [];

    const education =
        Array.isArray(
            data.education
        )
            ? data.education
            : [];

    const certificates =
        Array.isArray(
            data.certificates
        )
            ? data.certificates
            : [];

    const posts =
        Array.isArray(
            data.posts
        )
            ? data.posts
            : [];


    return (

        <div className="
            space-y-6
        ">

            {/* BACK */}

            <Link
                to="/admin/portfolios"
                className="
                    text-sm
                    text-slate-500
                    hover:text-cyan-300
                "
            >
                ← Back to Portfolios
            </Link>


            {/* HEADER */}

            <section className="
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/[0.02]
            ">

                <div className="
                    p-6
                    sm:p-8
                ">

                    <div className="
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-start
                        lg:justify-between
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            {portfolio.profileImage ? (

                                <img
                                    src={portfolio.profileImage}
                                    alt={portfolio.title || "Portfolio"}
                                    className="
                                        h-12
                                        w-12
                                        shrink-0
                                        rounded-xl
                                        object-cover
                                        ring-1
                                        ring-white/10
                                    "
                                />

                            ) : (

                                <div className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-cyan-400/10
                                    text-lg
                                    font-black
                                    text-cyan-300
                                ">
                                    {
                                        (
                                            portfolio.title ||
                                            "P"
                                        )
                                            .charAt(0)
                                            .toUpperCase()
                                    }
                                </div>

                            )}

                            <div>

                            <p className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.25em]
                                text-cyan-400
                            ">
                                Portfolio Details
                            </p>

                            <h1 className="
                                mt-2
                                text-3xl
                                font-black
                                text-white
                            ">
                                {
                                    portfolio.title ||
                                    "Untitled Portfolio"
                                }
                            </h1>

                            <p className="
                                mt-2
                                text-sm
                                text-slate-500
                            ">
                                @
                                {
                                    portfolio.username ||
                                    portfolio.slug ||
                                    "unknown"
                                }
                            </p>

                            <p className="
                                mt-2
                                text-sm
                                text-slate-400
                            ">
                                {
                                    portfolio.headline ||
                                    "No headline"
                                }
                            </p>

                            </div>

                        </div>


                        <span className={`
                            rounded-full
                            px-4
                            py-2
                            text-xs
                            font-bold
                            ${
                                portfolio.isPublished
                                    ? "bg-emerald-400/10 text-emerald-300"
                                    : "bg-amber-400/10 text-amber-300"
                            }
                        `}>
                            {
                                portfolio.isPublished
                                    ? "PUBLISHED"
                                    : "DRAFT"
                            }
                        </span>

                    </div>


                    {/* OWNER */}

                    <div className="
                        mt-7
                        rounded-2xl
                        border
                        border-cyan-400/10
                        bg-cyan-400/[0.02]
                        p-5
                    ">

                        <p className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-cyan-400
                        ">
                            Created By / Owner
                        </p>


                        <div className="
                            mt-4
                            flex
                            items-center
                            gap-4
                        ">

                            {owner &&
                            owner.profileImage ? (

                                <img
                                    src={
                                        owner.profileImage
                                    }
                                    alt={
                                        owner.name ||
                                        "Owner"
                                    }
                                    className="
                                        h-14
                                        w-14
                                        rounded-2xl
                                        object-cover
                                    "
                                />

                            ) : (

                                <div className="
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-cyan-400/10
                                    text-xl
                                    font-black
                                    text-cyan-300
                                ">
                                    {
                                        (
                                            owner &&
                                            owner.name
                                                ? owner.name
                                                : "U"
                                        )
                                            .charAt(0)
                                            .toUpperCase()
                                    }
                                </div>

                            )}


                            <div>

                                <p className="
                                    text-lg
                                    font-bold
                                    text-white
                                ">
                                    {
                                        owner &&
                                        owner.name
                                            ? owner.name
                                            : "Unknown User"
                                    }
                                </p>

                                <p className="
                                    mt-1
                                    break-all
                                    text-sm
                                    text-slate-500
                                ">
                                    {
                                        owner &&
                                        owner.email
                                            ? owner.email
                                            : "No email"
                                    }
                                </p>

                                <p className="
                                    mt-1
                                    text-xs
                                    text-slate-600
                                ">
                                    {
                                        owner &&
                                        owner.isActive
                                            ? "Account Active"
                                            : "Account Inactive"
                                    }
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* META */}

                    <div className="
                        mt-5
                        rounded-xl
                        border
                        border-white/10
                        p-4
                    ">

                        <p className="text-xs text-slate-600">
                            Created
                        </p>

                        <p className="
                            mt-2
                            text-sm
                            font-bold
                            text-white
                        ">
                            {
                                portfolio.createdAt
                                    ? new Date(
                                        portfolio.createdAt
                                    ).toLocaleDateString()
                                    : "—"
                            }
                        </p>

                    </div>

                </div>
            </section>


            {/* PUBLIC PORTFOLIO PREVIEW */}

            {portfolio.isPublished ? (

                <section className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-cyan-400/10
                    bg-black/10
                ">

                    <div className="
                        border-b
                        border-white/10
                        px-6
                        py-5
                    ">

                        <p className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-cyan-400
                        ">
                            Live Public Portfolio
                        </p>

                        <p className="
                            mt-2
                            text-sm
                            text-slate-500
                        ">
                            Same published portfolio visitors see.
                        </p>

                    </div>

                    <LivePortfolioPreview
                        form={portfolio}
                        user={{
                            name:
                                owner && owner.name
                                    ? owner.name
                                    : portfolio.title ||
                                      portfolio.username ||
                                      "Portfolio"
                        }}
                        publicData={data}
                    />

                </section>

            ) : null}


            {/* BIO */}

            <section className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.02]
                p-6
            ">

                <p className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-cyan-400
                ">
                    About
                </p>

                <p className="
                    mt-4
                    whitespace-pre-wrap
                    text-sm
                    leading-7
                    text-slate-400
                ">
                    {
                        portfolio.bio ||
                        "No bio added."
                    }
                </p>

            </section>


            {/* COUNTS */}

            <section className="
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-6
            ">

                {[
                    [
                        "Projects",
                        projects.length
                    ],
                    [
                        "Skills",
                        skills.length
                    ],
                    [
                        "Experience",
                        experiences.length
                    ],
                    [
                        "Education",
                        education.length
                    ],
                    [
                        "Certificates",
                        certificates.length
                    ],
                    [
                        "Posts",
                        posts.length
                    ]
                ].map(
                    (item) => (

                        <div
                            key={
                                item[0]
                            }
                            className="
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/[0.02]
                                p-5
                                text-center
                            "
                        >

                            <p className="
                                text-xs
                                text-slate-600
                            ">
                                {
                                    item[0]
                                }
                            </p>

                            <p className="
                                mt-2
                                text-3xl
                                font-black
                                text-cyan-300
                            ">
                                {
                                    item[1]
                                }
                            </p>

                        </div>

                    )
                )}

            </section>


            {/* CONTENT GRID */}

            <div className="
                grid
                gap-4
                lg:grid-cols-2
            ">

                {/* PROJECTS */}

                <section className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                ">

                    <p className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-cyan-400
                    ">
                        Projects
                    </p>

                    <div className="
                        mt-4
                        space-y-3
                    ">

                        {projects.length === 0 ? (

                            <p className="text-sm text-slate-600">
                                No projects.
                            </p>

                        ) : (

                            projects.map(
                                (project) => (

                                    <div
                                        key={
                                            project._id
                                        }
                                        className="
                                            rounded-xl
                                            border
                                            border-white/10
                                            p-4
                                        "
                                    >

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                        ">

                                            <p className="
                                                font-bold
                                                text-white
                                            ">
                                                {
                                                    project.title ||
                                                    "Untitled Project"
                                                }
                                            </p>

                                            <span className="
                                                text-[10px]
                                                font-semibold
                                                text-slate-500
                                            ">
                                                {
                                                    project.isPublished
                                                        ? "Published"
                                                        : "Draft"
                                                }
                                            </span>

                                        </div>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-600
                                        ">
                                            {
                                                project.description ||
                                                "No description."
                                            }
                                        </p>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>


                {/* SKILLS */}

                <section className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                ">

                    <p className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-cyan-400
                    ">
                        Skills
                    </p>

                    <div className="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                    ">

                        {skills.length === 0 ? (

                            <p className="text-sm text-slate-600">
                                No skills.
                            </p>

                        ) : (

                            skills.map(
                                (skill) => (

                                    <span
                                        key={
                                            skill._id
                                        }
                                        className="
                                            rounded-lg
                                            border
                                            border-cyan-400/10
                                            bg-cyan-400/[0.04]
                                            px-3
                                            py-2
                                            text-xs
                                            font-semibold
                                            text-cyan-300
                                        "
                                    >
                                        {
                                            skill.name ||
                                            "Skill"
                                        }
                                    </span>

                                )
                            )

                        )}

                    </div>

                </section>


                {/* EXPERIENCE */}

                <section className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                ">

                    <p className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-cyan-400
                    ">
                        Experience
                    </p>

                    <div className="
                        mt-4
                        space-y-3
                    ">

                        {experiences.length === 0 ? (

                            <p className="text-sm text-slate-600">
                                No experience.
                            </p>

                        ) : (

                            experiences.map(
                                (item) => (

                                    <div
                                        key={
                                            item._id
                                        }
                                        className="
                                            rounded-xl
                                            border
                                            border-white/10
                                            p-4
                                        "
                                    >

                                        <p className="font-bold text-white">
                                            {
                                                item.jobTitle ||
                                                item.title ||
                                                item.position ||
                                                "Experience"
                                            }
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        ">
                                            {
                                                item.company ||
                                                item.companyName ||
                                                "Company not provided"
                                            }
                                        </p>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>


                {/* EDUCATION */}

                <section className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                ">

                    <p className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-cyan-400
                    ">
                        Education
                    </p>

                    <div className="
                        mt-4
                        space-y-3
                    ">

                        {education.length === 0 ? (

                            <p className="text-sm text-slate-600">
                                No education.
                            </p>

                        ) : (

                            education.map(
                                (item) => (

                                    <div
                                        key={
                                            item._id
                                        }
                                        className="
                                            rounded-xl
                                            border
                                            border-white/10
                                            p-4
                                        "
                                    >

                                        <p className="font-bold text-white">
                                            {
                                                item.degree ||
                                                item.title ||
                                                "Education"
                                            }
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        ">
                                            {
                                                item.institution ||
                                                item.school ||
                                                "Institution not provided"
                                            }
                                        </p>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>


                {/* CERTIFICATES */}

                <section className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                ">

                    <p className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-cyan-400
                    ">
                        Certificates
                    </p>

                    <div className="
                        mt-4
                        space-y-3
                    ">

                        {certificates.length === 0 ? (

                            <p className="text-sm text-slate-600">
                                No certificates.
                            </p>

                        ) : (

                            certificates.map(
                                (item) => (

                                    <div
                                        key={
                                            item._id
                                        }
                                        className="
                                            rounded-xl
                                            border
                                            border-white/10
                                            p-4
                                        "
                                    >

                                        <p className="font-bold text-white">
                                            {
                                                item.title ||
                                                item.name ||
                                                "Certificate"
                                            }
                                        </p>

                                        <p className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                        ">
                                            {
                                                item.issuer ||
                                                item.organization ||
                                                "Issuer not provided"
                                            }
                                        </p>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>


                {/* POSTS */}

                <section className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-5
                ">

                    <p className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-cyan-400
                    ">
                        Posts
                    </p>

                    <div className="
                        mt-4
                        space-y-3
                    ">

                        {posts.length === 0 ? (

                            <p className="text-sm text-slate-600">
                                No posts.
                            </p>

                        ) : (

                            posts.map(
                                (post) => (

                                    <div
                                        key={
                                            post._id
                                        }
                                        className="
                                            rounded-xl
                                            border
                                            border-white/10
                                            p-4
                                        "
                                    >

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                        ">

                                            <p className="
                                                font-bold
                                                text-white
                                            ">
                                                {
                                                    post.title ||
                                                    "Untitled Post"
                                                }
                                            </p>

                                            <span className="
                                                text-[10px]
                                                text-slate-500
                                            ">
                                                {
                                                    post.isPublished
                                                        ? "Published"
                                                        : "Draft"
                                                }
                                            </span>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>

            </div>

        </div>

    );

};


export default AdminPortfolioDetails;