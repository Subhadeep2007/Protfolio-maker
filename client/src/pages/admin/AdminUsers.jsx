import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    activateAdminUser,
    deactivateAdminUser,
    deleteAdminUser,
    getAdminUsers
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

    return "Something went wrong.";

};


const getList = (response) => {

    if (
        response &&
        Array.isArray(
            response.data
        )
    ) {
        return response.data;
    }

    return [];

};


const AdminUsers = () => {

    const [
        users,
        setUsers
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        search,
        setSearch
    ] = useState("");

    const [
        filter,
        setFilter
    ] = useState("all");

    const [
        actionId,
        setActionId
    ] = useState("");

    const [
        error,
        setError
    ] = useState("");


    const loadUsers = async() => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAdminUsers();

            setUsers(
                getList(response)
            );

        } catch (requestError) {

            setError(
                getErrorMessage(
                    requestError
                )
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadUsers();

    }, []);


    const filteredUsers =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            return users.filter(
                (user) => {

                    const name =
                        user.name
                            ? user.name.toLowerCase()
                            : "";

                    const email =
                        user.email
                            ? user.email.toLowerCase()
                            : "";

                    const username =
                        user.portfolio &&
                        user.portfolio.username
                            ? user.portfolio.username.toLowerCase()
                            : "";


                    const matchesSearch =
                        !query ||
                        name.includes(query) ||
                        email.includes(query) ||
                        username.includes(query);


                    const matchesFilter =
                        filter === "all" ||
                        (
                            filter === "active" &&
                            user.isActive === true
                        ) ||
                        (
                            filter === "inactive" &&
                            user.isActive === false
                        );


                    return (
                        matchesSearch &&
                        matchesFilter
                    );

                }
            );

        }, [
            users,
            search,
            filter
        ]);


    const handleStatus =
        async(user) => {

            if (!user || !user._id) {
                return;
            }


            try {

                setActionId(
                    user._id
                );

                setError("");


                if (
                    user.isActive
                ) {

                    await deactivateAdminUser(
                        user._id
                    );

                } else {

                    await activateAdminUser(
                        user._id
                    );

                }


                await loadUsers();

            } catch (requestError) {

                setError(
                    getErrorMessage(
                        requestError
                    )
                );

            } finally {

                setActionId("");

            }

        };


    const handleDelete =
        async(user) => {

            if (
                !user ||
                !user._id
            ) {
                return;
            }


            const confirmed =
                window.confirm(
                    `Delete ${user.name || "this user"} permanently?`
                );


            if (!confirmed) {
                return;
            }


            try {

                setActionId(
                    user._id
                );

                setError("");


                await deleteAdminUser(
                    user._id
                );


                await loadUsers();

            } catch (requestError) {

                setError(
                    getErrorMessage(
                        requestError
                    )
                );

            } finally {

                setActionId("");

            }

        };


    return (

        <div className="
            space-y-6
        ">

            {/* HEADER */}

            <div className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-end
                lg:justify-between
            ">

                <div>

                    <p className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.25em]
                        text-cyan-400
                    ">
                        Platform Users
                    </p>

                    <h1 className="
                        mt-2
                        text-3xl
                        font-black
                        text-white
                    ">
                        All Users
                    </h1>

                    <p className="
                        mt-2
                        text-sm
                        text-slate-500
                    ">
                        View every registered user and their portfolio.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={loadUsers}
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
                        hover:border-cyan-400/30
                        hover:text-cyan-300
                    "
                >
                    Refresh
                </button>

            </div>


            {/* ERROR */}

            {error ? (

                <div className="
                    rounded-2xl
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


            {/* SEARCH */}

            <div className="
                grid
                gap-3
                md:grid-cols-[1fr_auto]
            ">

                <input
                    value={search}
                    onChange={
                        (event) =>
                            setSearch(
                                event.target.value
                            )
                    }
                    placeholder="
                        Search name, email or username...
                    "
                    className="
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-slate-600
                        focus:border-cyan-400/30
                    "
                />


                <select
                    value={filter}
                    onChange={
                        (event) =>
                            setFilter(
                                event.target.value
                            )
                    }
                    className="
                        rounded-xl
                        border
                        border-white/10
                        bg-[#07101d]
                        px-4
                        py-3
                        text-sm
                        text-slate-300
                        outline-none
                    "
                >

                    <option value="all">
                        All users
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>

                </select>

            </div>


            {/* USERS */}

            {loading ? (

                <div className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    px-6
                    py-20
                    text-center
                    text-sm
                    text-slate-500
                ">
                    Loading users...
                </div>

            ) : filteredUsers.length === 0 ? (

                <div className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    px-6
                    py-20
                    text-center
                ">

                    <p className="
                        text-lg
                        font-bold
                        text-white
                    ">
                        No users found
                    </p>

                    <p className="
                        mt-2
                        text-sm
                        text-slate-600
                    ">
                        No user matched your search.
                    </p>

                </div>

            ) : (

                <div className="
                    grid
                    gap-4
                    xl:grid-cols-2
                ">

                    {filteredUsers.map(
                        (user) => {

                            const portfolio =
                                user.portfolio ||
                                null;

                            const profileImage =
                                portfolio &&
                                portfolio.profileImage
                                    ? portfolio.profileImage
                                    : user.profileImage;


                            return (

                                <article
                                    key={
                                        user._id
                                    }
                                    className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.02]
                                        p-5
                                        transition
                                        hover:border-cyan-400/20
                                        hover:bg-white/[0.03]
                                    "
                                >

                                    {/* USER */}

                                    <div className="
                                        flex
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
                                                    h-16
                                                    w-16
                                                    shrink-0
                                                    rounded-2xl
                                                    object-cover
                                                    ring-1
                                                    ring-white/10
                                                "
                                            />

                                        ) : (

                                            <div className="
                                                flex
                                                h-16
                                                w-16
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-2xl
                                                bg-cyan-400/10
                                                text-2xl
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


                                        <div className="
                                            min-w-0
                                            flex-1
                                        ">

                                            <div className="
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-2
                                            ">

                                                <h2 className="
                                                    text-lg
                                                    font-bold
                                                    text-white
                                                ">
                                                    {
                                                        user.name ||
                                                        "Unnamed User"
                                                    }
                                                </h2>


                                                <span
                                                    className={`
                                                        rounded-full
                                                        px-2.5
                                                        py-1
                                                        text-[10px]
                                                        font-bold
                                                        ${
                                                            user.isActive
                                                                ? "bg-emerald-400/10 text-emerald-300"
                                                                : "bg-red-400/10 text-red-300"
                                                        }
                                                    `}
                                                >
                                                    {
                                                        user.isActive
                                                            ? "ACTIVE"
                                                            : "INACTIVE"
                                                    }
                                                </span>

                                            </div>


                                            <p className="
                                                mt-1
                                                break-all
                                                text-sm
                                                text-slate-500
                                            ">
                                                {
                                                    user.email
                                                }
                                            </p>


                                            <p className="
                                                mt-1
                                                text-xs
                                                text-slate-600
                                            ">
                                                {
                                                    user.isEmailVerified
                                                        ? "Email verified"
                                                        : "Email not verified"
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* PORTFOLIO */}

                                    <div className="
                                        mt-5
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-black/10
                                        p-4
                                    ">

                                        <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        ">

                                            <div>

                                                <p className="
                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.2em]
                                                    text-cyan-400
                                                ">
                                                    Portfolio
                                                </p>

                                                <h3 className="
                                                    mt-2
                                                    font-bold
                                                    text-white
                                                ">
                                                    {
                                                        portfolio
                                                            ? (
                                                                portfolio.title ||
                                                                "Untitled Portfolio"
                                                            )
                                                            : "No portfolio created"
                                                    }
                                                </h3>

                                                {portfolio ? (

                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-slate-600
                                                    ">
                                                        @
                                                        {
                                                            portfolio.username ||
                                                            portfolio.slug ||
                                                            "unknown"
                                                        }
                                                    </p>

                                                ) : null}

                                            </div>


                                            {portfolio ? (

                                                <span
                                                    className={`
                                                        rounded-full
                                                        px-2.5
                                                        py-1
                                                        text-[10px]
                                                        font-bold
                                                        ${
                                                            portfolio.isPublished
                                                                ? "bg-emerald-400/10 text-emerald-300"
                                                                : "bg-amber-400/10 text-amber-300"
                                                        }
                                                    `}
                                                >
                                                    {
                                                        portfolio.isPublished
                                                            ? "PUBLISHED"
                                                            : "DRAFT"
                                                    }
                                                </span>

                                            ) : null}

                                        </div>


                                        {portfolio ? (

                                            <div className="
                                                mt-4
                                                grid
                                                gap-2
                                            ">

                                                <div>
                                                    <p className="
                                                        text-[10px]
                                                        text-slate-600
                                                    ">
                                                        Created
                                                    </p>

                                                    <p className="
                                                        mt-1
                                                        text-xs
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

                                        ) : (

                                            <p className="
                                                mt-3
                                                text-xs
                                                text-slate-600
                                            ">
                                                This user has not created a portfolio yet.
                                            </p>

                                        )}

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        gap-2
                                    ">

                                        <Link
                                            to={
                                                `/admin/users/${user._id}`
                                            }
                                            className="
                                                rounded-lg
                                                bg-cyan-400
                                                px-4
                                                py-2
                                                text-xs
                                                font-bold
                                                text-slate-950
                                                hover:bg-cyan-300
                                            "
                                        >
                                            View Profile
                                        </Link>


                                        <button
                                            type="button"
                                            disabled={
                                                actionId ===
                                                user._id
                                            }
                                            onClick={
                                                () =>
                                                    handleStatus(
                                                        user
                                                    )
                                            }
                                            className="
                                                rounded-lg
                                                border
                                                border-white/10
                                                px-4
                                                py-2
                                                text-xs
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
                                                actionId ===
                                                user._id
                                            }
                                            onClick={
                                                () =>
                                                    handleDelete(
                                                        user
                                                    )
                                            }
                                            className="
                                                rounded-lg
                                                border
                                                border-red-400/10
                                                px-4
                                                py-2
                                                text-xs
                                                font-semibold
                                                text-red-300
                                                hover:bg-red-500/10
                                                disabled:opacity-50
                                            "
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </article>

                            );

                        }
                    )}

                </div>

            )}

        </div>

    );

};


export default AdminUsers;