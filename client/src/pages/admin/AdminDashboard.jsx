import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getAdminDashboard
} from "../../api/admin.api";

import {
    useAuth
} from "../../context/AuthContext";


const initialStats = {
    users: {
        total: 0,
        active: 0,
        inactive: 0
    },

    portfolios: {
        total: 0,
        published: 0,
        unpublished: 0
    },

    projects: {
        total: 0
    },

    skills: {
        total: 0
    },

    experiences: {
        total: 0
    },

    education: {
        total: 0
    },

    certificates: {
        total: 0
    },

    posts: {
        total: 0
    }
};


const AdminDashboard = () => {

    const {
        user
    } = useAuth();

    const [
        stats,
        setStats
    ] = useState(
        initialStats
    );


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const loadDashboard =
        async() => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getAdminDashboard();

                if (
                    response &&
                    response.data
                ) {
                    setStats(
                        response.data
                    );
                }

            } catch (requestError) {

                const message =
                    requestError &&
                    requestError.response &&
                    requestError.response.data &&
                    requestError.response.data.message
                        ? requestError.response.data.message
                        : "Unable to load dashboard.";

                setError(message);

            } finally {

                setLoading(false);

            }
        };


    useEffect(() => {

        loadDashboard();

    }, []);


    const cards = [
        {
            label: "Total Users",
            value:
                stats.users.total,
            path:
                "/admin/users"
        },

        {
            label: "Active Users",
            value:
                stats.users.active,
            path:
                "/admin/users"
        },

        {
            label: "Total Portfolios",
            value:
                stats.portfolios.total,
            path:
                "/admin/portfolios"
        },

        {
            label: "Published Portfolios",
            value:
                stats.portfolios.published,
            path:
                "/admin/portfolios"
        }
    ];


    return (
        <div>

            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
                sm:justify-between
            ">

                <div>

                    <p className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-cyan-400
                    ">
                        System Overview
                    </p>

                    <h1 className="
                        mt-2
                        text-3xl
                        font-black
                    ">
                        Platform Dashboard
                    </h1>

                    <p className="
                        mt-2
                        text-sm
                        text-slate-500
                    ">
                        Monitor the complete platform.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={
                        loadDashboard
                    }
                    disabled={
                        loading
                    }
                    className="
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-slate-300
                        transition
                        hover:border-cyan-400/20
                        hover:text-cyan-300
                        disabled:opacity-50
                    "
                >
                    {
                        loading
                            ? "Refreshing..."
                            : "Refresh"
                    }
                </button>

            </div>


            {error ? (
                <div className="
                    mt-6
                    rounded-2xl
                    border
                    border-red-400/20
                    bg-red-400/[0.04]
                    p-4
                    text-sm
                    text-red-300
                ">
                    {error}
                </div>
            ) : null}




            {/* ========================================
                ADMIN PROFILE
            ======================================== */}

            <section className="
                mt-6
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-[#0b1020]/80
                p-5
                backdrop-blur-xl
                sm:p-7
            ">

                <div className="
                    flex
                    flex-col
                    gap-6
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div className="
                        flex
                        min-w-0
                        items-center
                        gap-4
                    ">

                        <div className="
                            flex
                            h-16
                            w-16
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
                        ">
                            {
                                user && user.profileImage
                                    ? (
                                        <img
                                            src={user.profileImage}
                                            alt={
                                                user && user.name
                                                    ? user.name
                                                    : "Admin"
                                            }
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />
                                    )
                                    : (
                                        user && user.name
                                            ? user.name.charAt(0).toUpperCase()
                                            : "A"
                                    )
                            }
                        </div>

                        <div className="min-w-0">

                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.22em]
                                text-cyan-400
                            ">
                                Admin Profile
                            </p>

                            <h2 className="
                                mt-1
                                truncate
                                text-xl
                                font-bold
                                text-white
                                sm:text-2xl
                            ">
                                {
                                    user && user.name
                                        ? user.name
                                        : "Admin"
                                }
                            </h2>

                            <p className="
                                mt-1
                                truncate
                                text-sm
                                text-slate-400
                            ">
                                {
                                    user && user.email
                                        ? user.email
                                        : "Admin account"
                                }
                            </p>

                            <p className="
                                mt-2
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                text-emerald-300
                            ">
                                {
                                    user && user.role
                                        ? user.role
                                        : "admin"
                                }
                            </p>

                        </div>

                    </div>

                    <div className="
                        flex
                        w-full
                        flex-col
                        gap-3
                        sm:w-auto
                        sm:min-w-[220px]
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

            <section className="
                mt-6
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            ">

                {cards.map(
                    (card) => (

                    <Link
                        key={
                            card.label
                        }
                        to={
                            card.path
                        }
                        className="
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            p-5
                            transition
                            hover:border-cyan-400/20
                            hover:bg-white/[0.05]
                        "
                    >

                        <p className="
                            text-xs
                            text-slate-500
                        ">
                            {
                                card.label
                            }
                        </p>

                        <p className="
                            mt-3
                            text-3xl
                            font-black
                        ">
                            {
                                loading
                                    ? "—"
                                    : card.value
                            }
                        </p>

                    </Link>

                ))}
            </section>


            <section className="
                mt-6
                grid
                gap-4
                lg:grid-cols-2
            ">

                <div className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-6
                ">

                    <p className="
                        text-xs
                        uppercase
                        tracking-[0.18em]
                        text-cyan-400
                    ">
                        Portfolio Status
                    </p>

                    <div className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-4
                    ">

                        <div className="
                            rounded-xl
                            border
                            border-emerald-400/10
                            bg-emerald-400/[0.03]
                            p-4
                        ">
                            <p className="text-xs text-slate-500">
                                Published
                            </p>

                            <p className="
                                mt-2
                                text-2xl
                                font-black
                                text-emerald-300
                            ">
                                {
                                    loading
                                        ? "—"
                                        : stats.portfolios.published
                                }
                            </p>
                        </div>


                        <div className="
                            rounded-xl
                            border
                            border-amber-400/10
                            bg-amber-400/[0.03]
                            p-4
                        ">
                            <p className="text-xs text-slate-500">
                                Draft
                            </p>

                            <p className="
                                mt-2
                                text-2xl
                                font-black
                                text-amber-300
                            ">
                                {
                                    loading
                                        ? "—"
                                        : stats.portfolios.unpublished
                                }
                            </p>
                        </div>

                    </div>

                </div>


                <div className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-6
                ">

                    <p className="
                        text-xs
                        uppercase
                        tracking-[0.18em]
                        text-cyan-400
                    ">
                        Content
                    </p>


                    <div className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                        sm:grid-cols-3
                    ">

                        {[
                            [
                                "Projects",
                                stats.projects.total
                            ],
                            [
                                "Skills",
                                stats.skills.total
                            ],
                            [
                                "Experience",
                                stats.experiences.total
                            ],
                            [
                                "Education",
                                stats.education.total
                            ],
                            [
                                "Certificates",
                                stats.certificates.total
                            ],
                            [
                                "Posts",
                                stats.posts.total
                            ]
                        ].map(
                            ([label, value]) => (

                            <div
                                key={label}
                                className="
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-black/10
                                    p-4
                                "
                            >

                                <p className="
                                    text-xs
                                    text-slate-500
                                ">
                                    {label}
                                </p>

                                <p className="
                                    mt-2
                                    text-xl
                                    font-bold
                                ">
                                    {
                                        loading
                                            ? "—"
                                            : value
                                    }
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

        </div>
    );
};


export default AdminDashboard;