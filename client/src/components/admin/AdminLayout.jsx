import {
    Link,
    NavLink,
    Outlet,
    useLocation
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";


const navigation = [
    {
        label: "Overview",
        path: "/admin"
    },
    {
        label: "Users",
        path: "/admin/users"
    },
    {
        label: "Portfolios",
        path: "/admin/portfolios"
    }
];


const AdminLayout = () => {

    const {
        user,
        logout
    } = useAuth();

    const location =
        useLocation();

    const isRoot =
        location.pathname === "/admin";


    return (
        <div className="
            min-h-screen
            bg-[#030712]
            text-white
        ">

            <div className="
                pointer-events-none
                fixed
                inset-0
                overflow-hidden
            ">
                <div className="
                    absolute
                    -left-40
                    top-20
                    h-96
                    w-96
                    rounded-full
                    bg-cyan-500/10
                    blur-[130px]
                " />

                <div className="
                    absolute
                    -right-40
                    top-[45%]
                    h-96
                    w-96
                    rounded-full
                    bg-blue-500/10
                    blur-[130px]
                " />
            </div>


            <div className="
                relative
                flex
                min-h-screen
            ">

                {/* SIDEBAR */}

                <aside className="
                    hidden
                    w-64
                    shrink-0
                    border-r
                    border-white/10
                    bg-[#050816]/90
                    backdrop-blur-xl
                    lg:flex
                    lg:flex-col
                ">

                    <div className="
                        border-b
                        border-white/10
                        p-6
                    ">

                        <p className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.25em]
                            text-cyan-400
                        ">
                            Admin Console
                        </p>

                        <h1 className="
                            mt-2
                            text-xl
                            font-black
                        ">
                            Portfolio Platform
                        </h1>

                    </div>


                    <nav className="
                        flex-1
                        p-4
                    ">

                        <div className="
                            space-y-2
                        ">

                            {navigation.map(
                                (item) => (

                                <NavLink
                                    key={
                                        item.path
                                    }
                                    to={
                                        item.path
                                    }
                                    end={
                                        item.path ===
                                        "/admin"
                                    }
                                    className={({
                                        isActive
                                    }) => `
                                        block
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        transition
                                        ${
                                            isActive
                                                ? "bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20"
                                                : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                        }
                                    `}
                                >
                                    {
                                        item.label
                                    }
                                </NavLink>

                            ))}

                        </div>

                    </nav>


                    <div className="
                        border-t
                        border-white/10
                        p-4
                    ">

                        <div className="
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            p-4
                        ">

                            <p className="
                                truncate
                                text-sm
                                font-semibold
                            ">
                                {
                                    user &&
                                    user.name
                                        ? user.name
                                        : "Administrator"
                                }
                            </p>

                            <p className="
                                mt-1
                                truncate
                                text-xs
                                text-slate-500
                            ">
                                {
                                    user &&
                                    user.email
                                        ? user.email
                                        : "Admin account"
                                }
                            </p>


                            <button
                                type="button"
                                onClick={
                                    logout
                                }
                                className="
                                    mt-4
                                    w-full
                                    rounded-xl
                                    border
                                    border-red-400/10
                                    bg-red-400/[0.03]
                                    px-3
                                    py-2.5
                                    text-xs
                                    font-semibold
                                    text-red-300
                                    transition
                                    hover:bg-red-400/10
                                "
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </aside>


                {/* MAIN */}

                <main className="
                    min-w-0
                    flex-1
                ">

                    <header className="
                        sticky
                        top-0
                        z-40
                        border-b
                        border-white/10
                        bg-[#030712]/90
                        px-4
                        py-4
                        backdrop-blur-xl
                        sm:px-6
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        ">

                            <div>

                                <p className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.22em]
                                    text-cyan-400
                                ">
                                    Admin Panel
                                </p>

                                <p className="
                                    mt-1
                                    text-sm
                                    font-semibold
                                ">
                                    {
                                        isRoot
                                            ? "Platform Overview"
                                            : "Management Console"
                                    }
                                </p>

                            </div>


                            <Link
                                to="/dashboard"
                                className="
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-white/[0.03]
                                    px-3
                                    py-2
                                    text-xs
                                    font-medium
                                    text-slate-300
                                    transition
                                    hover:border-cyan-400/20
                                    hover:text-cyan-300
                                "
                            >
                                User Dashboard
                            </Link>

                        </div>


                        {/* MOBILE NAV */}

                        <div className="
                            mt-4
                            flex
                            gap-2
                            overflow-x-auto
                            lg:hidden
                        ">

                            {navigation.map(
                                (item) => (

                                <NavLink
                                    key={
                                        item.path
                                    }
                                    to={
                                        item.path
                                    }
                                    end={
                                        item.path ===
                                        "/admin"
                                    }
                                    className={({
                                        isActive
                                    }) => `
                                        shrink-0
                                        rounded-xl
                                        px-3
                                        py-2
                                        text-xs
                                        font-medium
                                        ${
                                            isActive
                                                ? "bg-cyan-400/10 text-cyan-300"
                                                : "bg-white/[0.03] text-slate-400"
                                        }
                                    `}
                                >
                                    {
                                        item.label
                                    }
                                </NavLink>

                            ))}

                        </div>

                    </header>


                    <div className="
                        relative
                        mx-auto
                        w-full
                        max-w-[1600px]
                        p-4
                        sm:p-6
                        lg:p-8
                    ">
                        <Outlet />
                    </div>

                </main>

            </div>

        </div>
    );
};


export default AdminLayout;