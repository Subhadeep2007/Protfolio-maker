import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getAdminPortfolios
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

    return "Unable to load portfolios.";

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


const AdminPortfolios = () => {

    const [
        portfolios,
        setPortfolios
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
        error,
        setError
    ] = useState("");


    const loadPortfolios =
        async() => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getAdminPortfolios();

                setPortfolios(
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

        loadPortfolios();

    }, []);


    const filtered =
        useMemo(
            () => {

                const query =
                    search
                        .trim()
                        .toLowerCase();


                return portfolios.filter(
                    (portfolio) => {

                        const owner =
                            portfolio.owner ||
                            {};

                        const title =
                            portfolio.title
                                ? portfolio.title.toLowerCase()
                                : "";

                        const username =
                            portfolio.username
                                ? portfolio.username.toLowerCase()
                                : "";

                        const ownerName =
                            owner.name
                                ? owner.name.toLowerCase()
                                : "";

                        const ownerEmail =
                            owner.email
                                ? owner.email.toLowerCase()
                                : "";


                        const matchesSearch =
                            !query ||
                            title.includes(query) ||
                            username.includes(query) ||
                            ownerName.includes(query) ||
                            ownerEmail.includes(query);


                        const matchesFilter =
                            filter === "all" ||
                            (
                                filter === "published" &&
                                portfolio.isPublished === true
                            ) ||
                            (
                                filter === "draft" &&
                                portfolio.isPublished !== true
                            );


                        return (
                            matchesSearch &&
                            matchesFilter
                        );

                    }
                );

            },
            [
                portfolios,
                search,
                filter
            ]
        );


    return (

        <div className="
            space-y-6
        ">

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
                        Portfolio Management
                    </p>

                    <h1 className="
                        mt-2
                        text-3xl
                        font-black
                        text-white
                    ">
                        All Portfolios
                    </h1>

                    <p className="
                        mt-2
                        text-sm
                        text-slate-500
                    ">
                        See which user created and published each portfolio.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={
                        loadPortfolios
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
                        hover:border-cyan-400/30
                        hover:text-cyan-300
                    "
                >
                    Refresh
                </button>

            </div>


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


            <div className="
                grid
                gap-3
                md:grid-cols-[1fr_auto]
            ">

                <input
                    value={
                        search
                    }
                    onChange={
                        (event) =>
                            setSearch(
                                event.target.value
                            )
                    }
                    placeholder="
                        Search portfolio or owner...
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
                    value={
                        filter
                    }
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
                        All portfolios
                    </option>

                    <option value="published">
                        Published
                    </option>

                    <option value="draft">
                        Draft
                    </option>

                </select>

            </div>


            {loading ? (

                <div className="
                    py-20
                    text-center
                    text-sm
                    text-slate-500
                ">
                    Loading portfolios...
                </div>

            ) : filtered.length === 0 ? (

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
                        No portfolios found
                    </p>

                </div>

            ) : (

                <div className="
                    grid
                    gap-4
                    lg:grid-cols-2
                ">

                    {filtered.map(
                        (portfolio) => {

                            const owner =
                                portfolio.owner ||
                                {};


                            return (

                                <article
                                    key={
                                        portfolio._id
                                    }
                                    className="
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.02]
                                        transition
                                        hover:border-cyan-400/20
                                    "
                                >
                                    <div className="
                                        p-5
                                    ">

                                        <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        ">

                                            <div className="
                                                flex
                                                min-w-0
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

                                                <div className="min-w-0">

                                                <p className="
                                                    text-xs
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.18em]
                                                    text-cyan-400
                                                ">
                                                    Portfolio
                                                </p>

                                                <h2 className="
                                                    mt-2
                                                    text-xl
                                                    font-black
                                                    text-white
                                                ">
                                                    {
                                                        portfolio.title ||
                                                        "Untitled Portfolio"
                                                    }
                                                </h2>

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

                                                </div>

                                            </div>


                                            <span
                                                className={`
                                                    shrink-0
                                                    rounded-full
                                                    px-3
                                                    py-1.5
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

                                        </div>


                                        {/* OWNER */}

                                        <div className="
                                            mt-5
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-black/10
                                            p-4
                                        ">

                                            {owner.profileImage ? (

                                                <img
                                                    src={
                                                        owner.profileImage
                                                    }
                                                    alt={
                                                        owner.name ||
                                                        "Owner"
                                                    }
                                                    className="
                                                        h-11
                                                        w-11
                                                        rounded-xl
                                                        object-cover
                                                    "
                                                />

                                            ) : (

                                                <div className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-cyan-400/10
                                                    font-bold
                                                    text-cyan-300
                                                ">
                                                    {
                                                        (
                                                            owner.name ||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    }
                                                </div>

                                            )}


                                            <div className="
                                                min-w-0
                                            ">

                                                <p className="
                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.18em]
                                                    text-slate-600
                                                ">
                                                    Created by
                                                </p>

                                                <p className="
                                                    truncate
                                                    text-sm
                                                    font-bold
                                                    text-white
                                                ">
                                                    {
                                                        owner.name ||
                                                        "Unknown user"
                                                    }
                                                </p>

                                                <p className="
                                                    truncate
                                                    text-xs
                                                    text-slate-600
                                                ">
                                                    {
                                                        owner.email ||
                                                        "No email"
                                                    }
                                                </p>

                                            </div>

                                        </div>
                                        {/* META */}

                                        <div className="
                                            mt-4
                                            rounded-xl
                                            border
                                            border-white/10
                                            p-3
                                        ">

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

<Link
                                            to={
                                                `/admin/portfolios/${portfolio._id}`
                                            }
                                            className="
                                                mt-4
                                                flex
                                                w-full
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-cyan-400
                                                px-4
                                                py-2.5
                                                text-sm
                                                font-bold
                                                text-slate-950
                                                transition
                                                hover:bg-cyan-300
                                            "
                                        >
                                            View Full Portfolio
                                        </Link>

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


export default AdminPortfolios;