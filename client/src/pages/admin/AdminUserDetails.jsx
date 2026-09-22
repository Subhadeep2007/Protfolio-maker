import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    activateAdminUser,
    deactivateAdminUser,
    deleteAdminUser,
    getAdminUserDetails
} from "../../api/admin.api";


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

    return "Unable to load user.";

};


const countItems = (
    value
) => {

    return Array.isArray(value)
        ? value.length
        : 0;

};


const AdminUserDetails = () => {

    const {
        userId
    } = useParams();

    const navigate =
        useNavigate();


    const [
        data,
        setData
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        actionLoading,
        setActionLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");


    const loadUser =
        async() => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getAdminUserDetails(
                        userId
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

        if (userId) {
            loadUser();
        }

    }, [userId]);


    const handleStatus =
        async() => {

            if (
                !data ||
                !data.user
            ) {
                return;
            }


            try {

                setActionLoading(true);
                setError("");


                if (
                    data.user.isActive
                ) {

                    await deactivateAdminUser(
                        data.user._id
                    );

                } else {

                    await activateAdminUser(
                        data.user._id
                    );

                }


                await loadUser();

            } catch (requestError) {

                setError(
                    getErrorMessage(
                        requestError
                    )
                );

            } finally {

                setActionLoading(false);

            }

        };


    const handleDelete =
        async() => {

            if (
                !data ||
                !data.user
            ) {
                return;
            }


            const confirmed =
                window.confirm(
                    `Delete ${data.user.name || "this user"} permanently?`
                );


            if (!confirmed) {
                return;
            }


            try {

                setActionLoading(true);
                setError("");


                await deleteAdminUser(
                    data.user._id
                );


                navigate(
                    "/admin/users",
                    {
                        replace: true
                    }
                );

            } catch (requestError) {

                setError(
                    getErrorMessage(
                        requestError
                    )
                );

            } finally {

                setActionLoading(false);

            }

        };


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
                Loading user profile...
            </div>

        );

    }


    if (!data || !data.user) {

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
                    User not found
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
                    to="/admin/users"
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
                    ← Back to Users
                </Link>

            </div>

        );

    }


    const user =
        data.user;

    const portfolio =
        data.portfolio;

    const profileImage =
        portfolio &&
        portfolio.profileImage
            ? portfolio.profileImage
            : user.profileImage;


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

            {/* HEADER */}

            <div>

                <Link
                    to="/admin/users"
                    className="
                        text-sm
                        text-slate-500
                        hover:text-cyan-300
                    "
                >
                    ← Back to Users
                </Link>


                <div className="
                    mt-5
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                ">

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        {profileImage ? (

                            <img
                                src={
                                    profileImage
                                }
                                alt={
                                    user.name ||
                                    "User"
                                }
                                className="
                                    h-20
                                    w-20
                                    rounded-3xl
                                    object-cover
                                    ring-1
                                    ring-cyan-400/20
                                "
                            />

                        ) : (

                            <div className="
                                flex
                                h-20
                                w-20
                                items-center
                                justify-center
                                rounded-3xl
                                bg-cyan-400/10
                                text-3xl
                                font-black
                                text-cyan-300
                            ">
                                {
                                    (
                                        user.name ||
                                        "U"
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
                                User Profile
                            </p>

                            <h1 className="
                                mt-2
                                text-3xl
                                font-black
                                text-white
                            ">
                                {
                                    user.name ||
                                    "Unnamed User"
                                }
                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                            ">
                                {
                                    user.email
                                }
                            </p>

                        </div>

                    </div>


                    <div className="
                        flex
                        flex-wrap
                        gap-2
                    ">

                        <button
                            type="button"
                            disabled={
                                actionLoading
                            }
                            onClick={
                                handleStatus
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
                                hover:bg-white/5
                                disabled:opacity-50
                            "
                        >
                            {
                                user.isActive
                                    ? "Deactivate"
                                    : "Activate"
                            }
                        </button>


                        <button
                            type="button"
                            disabled={
                                actionLoading
                            }
                            onClick={
                                handleDelete
                            }
                            className="
                                rounded-xl
                                bg-red-500/10
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-red-300
                                hover:bg-red-500/20
                                disabled:opacity-50
                            "
                        >
                            Delete User
                        </button>

                    </div>

                </div>

            </div>


            {/* ERROR */}

            {error ? (

                <div className="
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-400/[0.05]
                    px-4
                    py-3
                    text-sm
                    text-red-300
                ">
                    {error}
                </div>

            ) : null}


            {/* USER PROFILE */}

            <section className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.02]
                p-6
            ">

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                ">

                    <div>

                        <p className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-cyan-400
                        ">
                            Account Information
                        </p>

                        <h2 className="
                            mt-2
                            text-xl
                            font-black
                            text-white
                        ">
                            Complete Profile
                        </h2>

                    </div>


                    <span className={`
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        ${
                            user.isActive
                                ? "bg-emerald-400/10 text-emerald-300"
                                : "bg-red-400/10 text-red-300"
                        }
                    `}>
                        {
                            user.isActive
                                ? "ACTIVE"
                                : "INACTIVE"
                        }
                    </span>

                </div>


                <div className="
                    mt-6
                    grid
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-4
                ">

                    <div className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/10
                        p-4
                    ">
                        <p className="text-xs text-slate-600">
                            Name
                        </p>

                        <p className="
                            mt-2
                            text-sm
                            font-bold
                            text-white
                        ">
                            {
                                user.name ||
                                "—"
                            }
                        </p>
                    </div>


                    <div className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/10
                        p-4
                    ">
                        <p className="text-xs text-slate-600">
                            Email
                        </p>

                        <p className="
                            mt-2
                            break-all
                            text-sm
                            font-bold
                            text-white
                        ">
                            {
                                user.email ||
                                "—"
                            }
                        </p>
                    </div>


                    <div className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/10
                        p-4
                    ">
                        <p className="text-xs text-slate-600">
                            Email Status
                        </p>

                        <p className="
                            mt-2
                            text-sm
                            font-bold
                            text-white
                        ">
                            {
                                user.isEmailVerified
                                    ? "Verified"
                                    : "Not verified"
                            }
                        </p>
                    </div>


                    <div className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/10
                        p-4
                    ">
                        <p className="text-xs text-slate-600">
                            Joined
                        </p>

                        <p className="
                            mt-2
                            text-sm
                            font-bold
                            text-white
                        ">
                            {
                                user.createdAt
                                    ? new Date(
                                        user.createdAt
                                    ).toLocaleString()
                                    : "—"
                            }
                        </p>
                    </div>

                </div>

            </section>


            {/* PORTFOLIO */}

            <section className="
                rounded-2xl
                border
                border-cyan-400/10
                bg-cyan-400/[0.02]
                p-6
            ">

                <div className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div>

                        <p className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-cyan-400
                        ">
                            Portfolio
                        </p>

                        <h2 className="
                            mt-2
                            text-2xl
                            font-black
                            text-white
                        ">
                            {
                                portfolio
                                    ? (
                                        portfolio.title ||
                                        "Untitled Portfolio"
                                    )
                                    : "No Portfolio"
                            }
                        </h2>

                    </div>


                    {portfolio ? (

                        <span className={`
                            rounded-full
                            px-3
                            py-1.5
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

                    ) : null}

                </div>


                {!portfolio ? (

                    <p className="
                        mt-5
                        text-sm
                        text-slate-600
                    ">
                        This user has not created a portfolio.
                    </p>

                ) : (

                    <>

                        <div className="
                            mt-6
                            grid
                            gap-4
                            md:grid-cols-2
                            xl:grid-cols-3
                        ">

                            <div className="
                                rounded-xl
                                border
                                border-white/10
                                bg-black/10
                                p-4
                            ">
                                <p className="text-xs text-slate-600">
                                    Username
                                </p>

                                <p className="
                                    mt-2
                                    text-sm
                                    font-bold
                                    text-cyan-300
                                ">
                                    @
                                    {
                                        portfolio.username ||
                                        portfolio.slug ||
                                        "unknown"
                                    }
                                </p>
                            </div>


                            <div className="
                                rounded-xl
                                border
                                border-white/10
                                bg-black/10
                                p-4
                            ">
                                <p className="text-xs text-slate-600">
                                    Template
                                </p>

                                <p className="
                                    mt-2
                                    text-sm
                                    font-bold
                                    text-white
                                ">
                                    {
                                        portfolio.template ||
                                        "—"
                                    }
                                </p>
                            </div>


                            <div className="
                                rounded-xl
                                border
                                border-white/10
                                bg-black/10
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
                                            ).toLocaleString()
                                            : "—"
                                    }
                                </p>
                            </div>

                        </div>


                        <div className="
                            mt-5
                            grid
                            gap-3
                            sm:grid-cols-3
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
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-black/10
                                            p-4
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
                                            text-2xl
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

                        </div>

                    </>

                )}

            </section>


            {/* CONTENT */}

            {portfolio ? (

                <div className="
                    grid
                    gap-4
                    lg:grid-cols-2
                ">

                    <div className="
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
                            space-y-2
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
                                                bg-black/10
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
                                                    font-semibold
                                                    text-white
                                                ">
                                                    {
                                                        project.title ||
                                                        "Untitled Project"
                                                    }
                                                </p>

                                                <span className="
                                                    text-[10px]
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
                                                    "No description"
                                                }
                                            </p>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </div>


                    <div className="
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

                    </div>


                    <div className="
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

                        <div className="mt-4 space-y-3">

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

                                            <p className="font-semibold text-white">
                                                {
                                                    item.jobTitle ||
                                                    item.title ||
                                                    item.position ||
                                                    "Experience"
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
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

                    </div>


                    <div className="
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

                        <div className="mt-4 space-y-3">

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

                                            <p className="font-semibold text-white">
                                                {
                                                    item.degree ||
                                                    item.title ||
                                                    "Education"
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
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

                    </div>


                    <div className="
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

                        <div className="mt-4 space-y-3">

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

                                            <p className="font-semibold text-white">
                                                {
                                                    item.title ||
                                                    item.name ||
                                                    "Certificate"
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
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

                    </div>


                    <div className="
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

                        <div className="mt-4 space-y-3">

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

                                                <p className="font-semibold text-white">
                                                    {
                                                        post.title ||
                                                        "Untitled Post"
                                                    }
                                                </p>

                                                <span className="text-[10px] text-slate-500">
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

                    </div>

                </div>

            ) : null}

        </div>

    );

};


export default AdminUserDetails;