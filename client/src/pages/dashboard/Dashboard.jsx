import {
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";

import {
    usePortfolio
} from "../../context/PortfolioContext";


const Dashboard = () => {

    const {
        user,
        logout
    } = useAuth();

    const {
        portfolio,
        loading: portfolioLoading
    } = usePortfolio();


    const [loggingOut, setLoggingOut] =
        useState(false);


    const handleLogout = async () => {

        try {

            setLoggingOut(true);

            await logout();

        } finally {

            setLoggingOut(false);
        }
    };


    const menuItems = [
        {
            title: "Portfolio",
            description:
                "Build and customize your personal portfolio.",
            path: "/dashboard/portfolio",
            icon: "✦"
        },
        {
            title: "Projects",
            description:
                "Add and manage your featured projects.",
            path: "/dashboard/projects",
            icon: "◈"
        },
        {
            title: "Skills",
            description:
                "Showcase your technical and professional skills.",
            path: "/dashboard/skills",
            icon: "⚡"
        },
        {
            title: "Experience",
            description:
                "Manage your work experience and achievements.",
            path: "/dashboard/experience",
            icon: "◉"
        },
        {
            title: "Education",
            description:
                "Add your education and academic details.",
            path: "/dashboard/education",
            icon: "◇"
        },
        {
            title: "Certificates",
            description:
                "Showcase your certifications and credentials.",
            path: "/dashboard/certificates",
            icon: "▣"
        },
        {
            title: "Posts",
            description:
                "Write blogs, achievements and announcements.",
            path: "/dashboard/posts",
            icon: "✎"
        }
    ];


    return (
        <div className="min-h-screen bg-[#040712] text-white">

            {/* BACKGROUND EFFECTS */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div
                    className="
                        absolute
                        -left-40
                        top-20
                        h-96
                        w-96
                        rounded-full
                        bg-cyan-500/10
                        blur-[120px]
                    "
                />

                <div
                    className="
                        absolute
                        -right-40
                        top-80
                        h-96
                        w-96
                        rounded-full
                        bg-blue-500/10
                        blur-[120px]
                    "
                />

                <div
                    className="
                        absolute
                        inset-0
                        bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
                        bg-[size:50px_50px]
                        mask-[linear-gradient(to_bottom,black,transparent)]
                    "
                />

            </div>


            {/* PAGE */}

            <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* HEADER */}

                <header
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                mb-2
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.25em]
                                text-cyan-400
                            "
                        >
                            User Dashboard
                        </p>


                        <h1
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                sm:text-4xl
                            "
                        >
                            Welcome{" "}

                            <span className="text-cyan-400">
                                {user?.name || "Developer"}
                            </span>
                        </h1>


                        <p
                            className="
                                mt-2
                                max-w-2xl
                                text-sm
                                text-slate-400
                                sm:text-base
                            "
                        >
                            Manage your portfolio, projects,
                            skills and professional content
                            from one place.
                        </p>

                    </div>


                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="
                                rounded-xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-200
                                transition
                                hover:border-red-400/30
                                hover:bg-red-400/5
                                hover:text-red-300
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loggingOut
                                ? "Logging out..."
                                : "Logout"}
                        </button>

                    </div>

                </header>


                {/* ========================================
                    USER PROFILE
                ======================================== */}

                <section
                    className="
                        mb-10
                        overflow-hidden
                        rounded-3xl
                        border
                        border-white/10
                        bg-[#0b1020]/80
                        backdrop-blur-xl
                        shadow-[0_0_60px_rgba(0,200,255,0.04)]
                    "
                >
                    <div
                        className="
                            relative
                            overflow-hidden
                            p-5
                            sm:p-7
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-24
                                -top-24
                                h-64
                                w-64
                                rounded-full
                                bg-cyan-400/10
                                blur-3xl
                            "
                        />

                        <div
                            className="
                                relative
                                flex
                                flex-col
                                gap-6
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-20
                                        w-20
                                        shrink-0
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-cyan-400/20
                                        bg-cyan-400/5
                                        text-2xl
                                        font-black
                                        text-cyan-300
                                        shadow-[0_0_35px_rgba(34,211,238,0.08)]
                                    "
                                >
                                    {portfolio && portfolio.profileImage ? (
                                        <img
                                            src={portfolio.profileImage}
                                            alt={
                                                portfolio.title ||
                                                user.name ||
                                                "Profile"
                                            }
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />
                                    ) : (
                                        (
                                            portfolio && portfolio.title
                                                ? portfolio.title
                                                : user && user.name
                                                    ? user.name
                                                    : "U"
                                        )
                                            .charAt(0)
                                            .toUpperCase()
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.22em]
                                            text-cyan-400
                                        "
                                    >
                                        User Profile
                                    </p>

                                    <h2
                                        className="
                                            mt-1
                                            truncate
                                            text-xl
                                            font-bold
                                            text-white
                                            sm:text-2xl
                                        "
                                    >
                                        {
                                            portfolio && portfolio.title
                                                ? portfolio.title
                                                : user && user.name
                                                    ? user.name
                                                    : "Your Profile"
                                        }
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            truncate
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        {
                                            portfolio && portfolio.headline
                                                ? portfolio.headline
                                                : user && user.email
                                                    ? user.email
                                                    : "Complete your profile"
                                        }
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/dashboard/portfolio"
                                className="
                                    inline-flex
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-cyan-400/20
                                    bg-cyan-400/5
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-cyan-300
                                    transition
                                    hover:border-cyan-400/40
                                    hover:bg-cyan-400/10
                                "
                            >
                                Edit Profile →
                            </Link>
                        </div>
                    </div>

                    <div
                        className="
                            grid
                            border-t
                            border-white/10
                            sm:grid-cols-2
                            lg:grid-cols-4
                        "
                    >
                        <div
                            className="
                                border-b
                                border-white/10
                                p-5
                                sm:border-r
                                lg:border-b-0
                            "
                        >
                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-600
                                "
                            >
                                Location
                            </p>

                            <p className="mt-2 text-sm text-slate-300">
                                {
                                    portfolio && portfolio.location
                                        ? portfolio.location
                                        : "Not added"
                                }
                            </p>
                        </div>

                        <div
                            className="
                                border-b
                                border-white/10
                                p-5
                                lg:border-r
                                lg:border-b-0
                            "
                        >
                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-600
                                "
                            >
                                Email
                            </p>

                            <p className="mt-2 break-all text-sm text-slate-300">
                                {
                                    portfolio && portfolio.email
                                        ? portfolio.email
                                        : user && user.email
                                            ? user.email
                                            : "Not added"
                                }
                            </p>
                        </div>

                        <div
                            className="
                                border-b
                                border-white/10
                                p-5
                                sm:border-r
                                sm:border-b-0
                            "
                        >
                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-600
                                "
                            >
                                Phone
                            </p>

                            <p className="mt-2 text-sm text-slate-300">
                                {
                                    portfolio && portfolio.phone
                                        ? portfolio.phone
                                        : "Not added"
                                }
                            </p>
                        </div>

                        <div className="p-5">
                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-600
                                "
                            >
                                Resume
                            </p>

                            {portfolio &&
                            portfolio.resume &&
                            portfolio.resume.url ? (
                                <a
                                    href={portfolio.resume.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        mt-2
                                        inline-flex
                                        text-sm
                                        font-semibold
                                        text-cyan-300
                                        hover:text-cyan-200
                                    "
                                >
                                    {portfolio.resume.fileName || "Open Resume"} ↗
                                </a>
                            ) : (
                                <p className="mt-2 text-sm text-slate-500">
                                    Not added
                                </p>
                            )}
                        </div>
                    </div>

                    {portfolio && (
                        <div
                            className="
                                border-t
                                border-white/10
                                px-5
                                py-4
                                sm:px-7
                            "
                        >
                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-5
                                    gap-y-2
                                "
                            >
                                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                                    Profile source:
                                    <span className="ml-2 text-emerald-300">
                                        Portfolio
                                    </span>
                                </p>

                                <p className="text-[10px] text-slate-600">
                                    The same portfolio profile image is used here and in the public portfolio.
                                </p>

                                {portfolio.website ? (
                                    <a
                                        href={portfolio.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-slate-400 hover:text-cyan-300"
                                    >
                                        Website ↗
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    )}

                    {portfolioLoading ? (
                        <div
                            className="
                                border-t
                                border-white/10
                                px-5
                                py-2
                                text-[10px]
                                text-slate-600
                            "
                        >
                            Syncing profile...
                        </div>
                    ) : null}
                </section>




                {/* ========================================
                    PASSWORD ACTIONS
                ======================================== */}

                <section className="
                    mb-10
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#0b1020]/80
                    p-5
                    backdrop-blur-xl
                ">

                    <div className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">

                        <div>

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.2em]
                                text-cyan-400
                            ">
                                Account Security
                            </p>

                            <h2 className="
                                mt-1
                                text-lg
                                font-semibold
                                text-white
                            ">
                                Password Management
                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">
                                Manage your account password.
                            </p>

                        </div>

                        <div className="
                            flex
                            w-full
                            flex-col
                            gap-3
                            sm:w-auto
                            sm:flex-row
                        ">

                            <Link
                                to="/forgot-password"
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-cyan-400/20
                                    bg-cyan-400/5
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-cyan-300
                                    transition
                                    hover:border-cyan-400/40
                                    hover:bg-cyan-400/10
                                "
                            >
                                Forgot Password
                            </Link>

                            <Link
                                to="/reset-password"
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-slate-200
                                    transition
                                    hover:border-white/20
                                    hover:bg-white/[0.06]
                                    hover:text-white
                                "
                            >
                                Reset Password
                            </Link>

                        </div>

                    </div>

                </section>


                                {/* QUICK ACTIONS */}

                <section className="mb-10">

                    <div
                        className="
                            mb-5
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >

                        <div>

                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                Workspace
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                Build your portfolio
                            </h2>

                        </div>


                        <p className="text-sm text-slate-500">
                            Everything you need to showcase your work.
                        </p>

                    </div>


                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >

                        {menuItems.map((item) => (

                            <Link
                                key={item.title}
                                to={item.path}
                                className="
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-[#0b1020]/80
                                    p-5
                                    backdrop-blur-xl
                                    transition
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-cyan-400/30
                                    hover:bg-[#0d1428]
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        -right-10
                                        -top-10
                                        h-28
                                        w-28
                                        rounded-full
                                        bg-cyan-400/5
                                        blur-2xl
                                        transition
                                        group-hover:bg-cyan-400/10
                                    "
                                />


                                <div className="relative">

                                    <div className="mb-5 flex items-center justify-between">

                                        <div
                                            className="
                                                flex
                                                h-11
                                                w-11
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-cyan-400/20
                                                bg-cyan-400/5
                                                text-lg
                                                text-cyan-300
                                            "
                                        >
                                            {item.icon}
                                        </div>


                                        <span
                                            className="
                                                text-lg
                                                text-slate-600
                                                transition
                                                group-hover:translate-x-1
                                                group-hover:text-cyan-400
                                            "
                                        >
                                            →
                                        </span>

                                    </div>


                                    <h3
                                        className="
                                            text-base
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        {item.title}
                                    </h3>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-slate-400
                                        "
                                    >
                                        {item.description}
                                    </p>

                                </div>

                            </Link>

                        ))}

                    </div>

                </section>


                {/* MAIN CTA */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-3xl
                        border
                        border-cyan-400/20
                        bg-gradient-to-br
                        from-cyan-400/10
                        via-blue-500/5
                        to-transparent
                        p-6
                        sm:p-8
                    "
                >

                    <div
                        className="
                            absolute
                            -right-20
                            -top-20
                            h-56
                            w-56
                            rounded-full
                            bg-cyan-400/10
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            flex-col
                            gap-6
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >

                        <div className="max-w-2xl">

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.22em]
                                    text-cyan-400
                                "
                            >
                                Next Step
                            </p>


                            <h2
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                    sm:text-3xl
                                "
                            >
                                Create your developer portfolio.
                            </h2>


                            <p
                                className="
                                    mt-3
                                    text-sm
                                    leading-6
                                    text-slate-400
                                    sm:text-base
                                "
                            >
                                Add your personal information,
                                projects, skills and experience,
                                then preview your portfolio
                                before publishing it.
                            </p>

                        </div>


                        <Link
                            to="/dashboard/portfolio"
                            className="
                                inline-flex
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-cyan-400
                                px-5
                                py-3
                                text-sm
                                font-bold
                                text-slate-950
                                shadow-[0_0_30px_rgba(34,211,238,0.2)]
                                transition
                                hover:bg-cyan-300
                                hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]
                            "
                        >
                            Start Building
                            <span className="ml-2">
                                →
                            </span>
                        </Link>

                    </div>

                </section>

            </div>

        </div>
    );
};


export default Dashboard;