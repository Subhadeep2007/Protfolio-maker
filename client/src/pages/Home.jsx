import {
    Link
} from "react-router-dom";

const Home = () => {
    return (
        <div className="
            min-h-screen
            overflow-hidden
            bg-[#040712]
            text-white
        ">

            {/* ========================================
                BACKGROUND
            ======================================== */}

            <div className="
                pointer-events-none
                fixed
                inset-0
                overflow-hidden
            ">
                <div className="
                    absolute
                    -left-40
                    -top-32
                    h-[520px]
                    w-[520px]
                    rounded-full
                    bg-cyan-500/10
                    blur-[140px]
                " />

                <div className="
                    absolute
                    -right-40
                    top-40
                    h-[520px]
                    w-[520px]
                    rounded-full
                    bg-blue-600/10
                    blur-[140px]
                " />

                <div className="
                    absolute
                    bottom-[-250px]
                    left-1/2
                    h-[500px]
                    w-[500px]
                    -translate-x-1/2
                    rounded-full
                    bg-cyan-400/5
                    blur-[130px]
                " />

                <div className="
                    absolute
                    inset-0
                    bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
                    bg-[size:55px_55px]
                    [mask-image:linear-gradient(to_bottom,black_0%,transparent_75%)]
                " />
            </div>


            {/* ========================================
                NAVBAR
            ======================================== */}

            <header className="
                relative
                z-20
                border-b
                border-white/5
                bg-[#040712]/70
                backdrop-blur-xl
            ">
                <div className="
                    mx-auto
                    flex
                    max-w-7xl
                    items-center
                    justify-between
                    px-6
                    py-5
                    lg:px-8
                ">

                    {/* LOGO */}

                    <Link
                        to="/"
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-cyan-400/20
                            bg-cyan-400/10
                            text-lg
                            shadow-[0_0_25px_rgba(34,211,238,0.08)]
                        ">
                            ✦
                        </div>

                        <div>
                            <p className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.28em]
                                text-cyan-400
                            ">
                                Portfolio Builder
                            </p>

                            <p className="
                                text-sm
                                font-bold
                                text-white
                            ">
                                Create your presence
                            </p>
                        </div>
                    </Link>


                    {/* NAV LINKS */}

                    <nav className="
                        hidden
                        items-center
                        gap-8
                        md:flex
                    ">

                        <a
                            href="#features"
                            className="
                                text-sm
                                text-slate-400
                                transition
                                hover:text-white
                            "
                        >
                            Features
                        </a>

                        <a
                            href="#how-it-works"
                            className="
                                text-sm
                                text-slate-400
                                transition
                                hover:text-white
                            "
                        >
                            How it works
                        </a>

                        <a
                            href="#create"
                            className="
                                text-sm
                                text-slate-400
                                transition
                                hover:text-white
                            "
                        >
                            Create
                        </a>

                    </nav>


                    {/* ACTIONS */}

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <Link
                            to="/login"
                            className="
                                hidden
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
                                hover:text-white
                                sm:block
                            "
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="
                                rounded-xl
                                bg-cyan-400
                                px-4
                                py-2.5
                                text-sm
                                font-bold
                                text-slate-950
                                shadow-[0_0_30px_rgba(34,211,238,0.14)]
                                transition
                                hover:bg-cyan-300
                            "
                        >
                            Get Started
                        </Link>

                    </div>

                </div>
            </header>


            {/* ========================================
                HERO
            ======================================== */}

            <main className="
                relative
                z-10
            ">

                <section className="
                    px-6
                    pb-24
                    pt-20
                    lg:px-8
                    lg:pb-32
                    lg:pt-28
                ">

                    <div className="
                        mx-auto
                        max-w-7xl
                    ">

                        <div className="
                            grid
                            items-center
                            gap-16
                            lg:grid-cols-[1.05fr_0.95fr]
                        ">

                            {/* LEFT */}

                            <div>

                                <div className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-cyan-400/15
                                    bg-cyan-400/[0.05]
                                    px-3
                                    py-2
                                ">
                                    <span className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-cyan-400
                                        shadow-[0_0_12px_rgba(34,211,238,0.8)]
                                    " />

                                    <span className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-cyan-300
                                    ">
                                        Build. Publish. Share.
                                    </span>
                                </div>


                                <h1 className="
                                    mt-7
                                    max-w-4xl
                                    text-5xl
                                    font-black
                                    leading-[1.02]
                                    tracking-tight
                                    sm:text-6xl
                                    lg:text-7xl
                                ">

                                    Your work
                                    <span className="
                                        block
                                        text-cyan-400
                                        [text-shadow:0_0_35px_rgba(34,211,238,0.16)]
                                    ">
                                        deserves a home.
                                    </span>

                                </h1>


                                <p className="
                                    mt-7
                                    max-w-2xl
                                    text-base
                                    leading-8
                                    text-slate-400
                                    sm:text-lg
                                ">
                                    Create a professional portfolio,
                                    add your projects, skills, experience
                                    and achievements, customize your
                                    colors, then publish it with a
                                    shareable link.
                                </p>


                                {/* HERO BUTTONS */}

                                <div className="
                                    mt-9
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                ">

                                    <Link
                                        to="/register"
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-cyan-400
                                            px-6
                                            py-3.5
                                            text-sm
                                            font-bold
                                            text-slate-950
                                            shadow-[0_0_35px_rgba(34,211,238,0.16)]
                                            transition
                                            hover:-translate-y-0.5
                                            hover:bg-cyan-300
                                        "
                                    >
                                        Create Portfolio
                                        <span className="ml-2">
                                            →
                                        </span>
                                    </Link>

                                    <a
                                        href="#features"
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-6
                                            py-3.5
                                            text-sm
                                            font-semibold
                                            text-slate-300
                                            transition
                                            hover:border-cyan-400/20
                                            hover:bg-white/[0.05]
                                            hover:text-white
                                        "
                                    >
                                        Explore Features
                                    </a>

                                </div>


                                {/* TRUST */}

                                <div className="
                                    mt-10
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-6
                                    gap-y-3
                                    text-xs
                                    text-slate-500
                                ">

                                    <span>
                                        No design setup required
                                    </span>

                                    <span className="
                                        hidden
                                        h-1
                                        w-1
                                        rounded-full
                                        bg-slate-700
                                        sm:block
                                    " />

                                    <span>
                                        Responsive on every device
                                    </span>

                                    <span className="
                                        hidden
                                        h-1
                                        w-1
                                        rounded-full
                                        bg-slate-700
                                        sm:block
                                    " />

                                    <span>
                                        Publish instantly
                                    </span>

                                </div>

                            </div>


                            {/* RIGHT - PRODUCT MOCKUP */}

                            <div className="relative">

                                <div className="
                                    absolute
                                    -inset-8
                                    rounded-[40px]
                                    bg-cyan-400/[0.03]
                                    blur-3xl
                                " />

                                <div className="
                                    relative
                                    overflow-hidden
                                    rounded-[30px]
                                    border
                                    border-white/10
                                    bg-[#08101f]/90
                                    shadow-[0_25px_100px_rgba(0,0,0,0.45)]
                                    backdrop-blur-xl
                                ">

                                    {/* MOCKUP HEADER */}

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-white/5
                                        px-5
                                        py-4
                                    ">

                                        <div className="
                                            flex
                                            items-center
                                            gap-2
                                        ">
                                            <span className="
                                                h-2.5
                                                w-2.5
                                                rounded-full
                                                bg-red-400/70
                                            " />

                                            <span className="
                                                h-2.5
                                                w-2.5
                                                rounded-full
                                                bg-yellow-400/70
                                            " />

                                            <span className="
                                                h-2.5
                                                w-2.5
                                                rounded-full
                                                bg-green-400/70
                                            " />
                                        </div>

                                        <span className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.2em]
                                            text-slate-600
                                        ">
                                            Live Preview
                                        </span>

                                    </div>


                                    {/* MOCKUP BODY */}

                                    <div className="
                                        p-5
                                        sm:p-7
                                    ">

                                        <div className="
                                            rounded-[24px]
                                            border
                                            border-white/10
                                            bg-[#040712]
                                            p-6
                                        ">

                                            <div className="
                                                flex
                                                flex-col
                                                gap-6
                                                sm:flex-row
                                                sm:items-center
                                            ">

                                                <div className="
                                                    h-20
                                                    w-20
                                                    shrink-0
                                                    rounded-full
                                                    border-2
                                                    border-cyan-400/40
                                                    bg-cyan-400/10
                                                    shadow-[0_0_30px_rgba(34,211,238,0.08)]
                                                " />

                                                <div>
                                                    <div className="
                                                        h-3
                                                        w-28
                                                        rounded-full
                                                        bg-cyan-400/20
                                                    " />

                                                    <div className="
                                                        mt-3
                                                        h-7
                                                        w-56
                                                        rounded-lg
                                                        bg-white/10
                                                    " />

                                                    <div className="
                                                        mt-3
                                                        h-3
                                                        w-40
                                                        rounded-full
                                                        bg-white/5
                                                    " />
                                                </div>

                                            </div>


                                            {/* ABOUT */}

                                            <div className="
                                                mt-8
                                                rounded-2xl
                                                border
                                                border-white/5
                                                bg-white/[0.02]
                                                p-5
                                            ">

                                                <div className="
                                                    h-2.5
                                                    w-20
                                                    rounded-full
                                                    bg-cyan-400/30
                                                " />

                                                <div className="
                                                    mt-4
                                                    h-2
                                                    w-full
                                                    rounded-full
                                                    bg-white/5
                                                " />

                                                <div className="
                                                    mt-2
                                                    h-2
                                                    w-10/12
                                                    rounded-full
                                                    bg-white/5
                                                " />

                                                <div className="
                                                    mt-2
                                                    h-2
                                                    w-8/12
                                                    rounded-full
                                                    bg-white/5
                                                " />

                                            </div>


                                            {/* PROJECTS */}

                                            <div className="
                                                mt-6
                                                grid
                                                gap-4
                                                sm:grid-cols-2
                                            ">

                                                <div className="
                                                    rounded-2xl
                                                    border
                                                    border-white/5
                                                    bg-white/[0.025]
                                                    p-4
                                                ">
                                                    <div className="
                                                        h-20
                                                        rounded-xl
                                                        bg-cyan-400/10
                                                    " />

                                                    <div className="
                                                        mt-4
                                                        h-2.5
                                                        w-24
                                                        rounded-full
                                                        bg-white/10
                                                    " />

                                                    <div className="
                                                        mt-2
                                                        h-2
                                                        w-32
                                                        rounded-full
                                                        bg-white/5
                                                    " />
                                                </div>


                                                <div className="
                                                    rounded-2xl
                                                    border
                                                    border-white/5
                                                    bg-white/[0.025]
                                                    p-4
                                                ">
                                                    <div className="
                                                        h-20
                                                        rounded-xl
                                                        bg-blue-400/10
                                                    " />

                                                    <div className="
                                                        mt-4
                                                        h-2.5
                                                        w-24
                                                        rounded-full
                                                        bg-white/10
                                                    " />

                                                    <div className="
                                                        mt-2
                                                        h-2
                                                        w-32
                                                        rounded-full
                                                        bg-white/5
                                                    " />
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ========================================
                    FEATURES
                ======================================== */}

                <section
                    id="features"
                    className="
                        border-y
                        border-white/5
                        bg-white/[0.015]
                        px-6
                        py-20
                        lg:px-8
                    "
                >

                    <div className="
                        mx-auto
                        max-w-7xl
                    ">

                        <div className="
                            max-w-2xl
                        ">

                            <p className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.22em]
                                text-cyan-400
                            ">
                                Everything in one place
                            </p>

                            <h2 className="
                                mt-3
                                text-3xl
                                font-black
                                sm:text-4xl
                            ">
                                Build your professional identity.
                            </h2>

                            <p className="
                                mt-4
                                text-sm
                                leading-7
                                text-slate-500
                            ">
                                Keep your portfolio content organized
                                and turn it into one professional public
                                profile.
                            </p>

                        </div>


                        <div className="
                            mt-12
                            grid
                            gap-5
                            sm:grid-cols-2
                            lg:grid-cols-4
                        ">

                            <FeatureCard
                                icon="◈"
                                title="Your Profile"
                                text="Add your introduction, contact details, profile photo and social links."
                            />

                            <FeatureCard
                                icon="⌘"
                                title="Projects"
                                text="Showcase the work you have built with technologies and useful links."
                            />

                            <FeatureCard
                                icon="✦"
                                title="Your Colors"
                                text="Customize the visual colors of your portfolio and make it feel personal."
                            />

                            <FeatureCard
                                icon="↗"
                                title="Publish & Share"
                                text="Publish your portfolio and share one simple public link anywhere."
                            />

                        </div>

                    </div>

                </section>


                {/* ========================================
                    HOW IT WORKS
                ======================================== */}

                <section
                    id="how-it-works"
                    className="
                        px-6
                        py-24
                        lg:px-8
                    "
                >

                    <div className="
                        mx-auto
                        max-w-7xl
                    ">

                        <div className="
                            text-center
                        ">

                            <p className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.22em]
                                text-cyan-400
                            ">
                                Simple workflow
                            </p>

                            <h2 className="
                                mt-3
                                text-3xl
                                font-black
                                sm:text-4xl
                            ">
                                From profile to public portfolio.
                            </h2>

                        </div>


                        <div className="
                            mt-14
                            grid
                            gap-5
                            md:grid-cols-3
                        ">

                            <StepCard
                                number="01"
                                title="Create your profile"
                                text="Add your basic information, introduction and professional links."
                            />

                            <StepCard
                                number="02"
                                title="Add your work"
                                text="Add projects, skills, experience, education, certificates and posts."
                            />

                            <StepCard
                                number="03"
                                title="Publish"
                                text="Save your portfolio, publish it and share the generated public link."
                            />

                        </div>

                    </div>

                </section>


                {/* ========================================
                    CTA
                ======================================== */}

                <section
                    id="create"
                    className="
                        px-6
                        pb-24
                        lg:px-8
                    "
                >

                    <div className="
                        mx-auto
                        max-w-5xl
                    ">

                        <div className="
                            relative
                            overflow-hidden
                            rounded-[32px]
                            border
                            border-cyan-400/15
                            bg-cyan-400/[0.04]
                            px-6
                            py-14
                            text-center
                            sm:px-12
                        ">

                            <div className="
                                pointer-events-none
                                absolute
                                left-1/2
                                top-0
                                h-48
                                w-72
                                -translate-x-1/2
                                rounded-full
                                bg-cyan-400/10
                                blur-[90px]
                            " />

                            <div className="
                                relative
                            ">

                                <p className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.22em]
                                    text-cyan-400
                                ">
                                    Ready to build?
                                </p>

                                <h2 className="
                                    mt-4
                                    text-3xl
                                    font-black
                                    sm:text-5xl
                                ">
                                    Turn your work into a portfolio.
                                </h2>

                                <p className="
                                    mx-auto
                                    mt-5
                                    max-w-2xl
                                    text-sm
                                    leading-7
                                    text-slate-400
                                    sm:text-base
                                ">
                                    Start adding your information,
                                    projects and experience today.
                                </p>

                                <Link
                                    to="/register"
                                    className="
                                        mt-8
                                        inline-flex
                                        items-center
                                        rounded-2xl
                                        bg-cyan-400
                                        px-7
                                        py-3.5
                                        text-sm
                                        font-bold
                                        text-slate-950
                                        shadow-[0_0_35px_rgba(34,211,238,0.16)]
                                        transition
                                        hover:bg-cyan-300
                                    "
                                >
                                    Start Building
                                    <span className="ml-2">
                                        →
                                    </span>
                                </Link>

                            </div>

                        </div>

                    </div>

                </section>

            </main>


            {/* ========================================
                FOOTER
            ======================================== */}

            <footer className="
                relative
                z-10
                border-t
                border-white/5
                px-6
                py-8
                lg:px-8
            ">

                <div className="
                    mx-auto
                    flex
                    max-w-7xl
                    flex-col
                    gap-4
                    text-center
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:text-left
                ">

                    <p className="
                        text-xs
                        text-slate-600
                    ">
                        Built with Portfolio Builder
                    </p>

                    <p className="
                        text-xs
                        text-slate-600
                    ">
                        Build your presence. Share your work.
                    </p>

                </div>

            </footer>

        </div>
    );
};


/* ========================================
   FEATURE CARD
======================================== */

const FeatureCard = ({
    icon,
    title,
    text
}) => {
    return (
        <div className="
            group
            rounded-2xl
            border
            border-white/8
            bg-white/[0.025]
            p-6
            transition
            hover:-translate-y-1
            hover:border-cyan-400/20
            hover:bg-white/[0.04]
        ">

            <div className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-cyan-400/15
                bg-cyan-400/[0.06]
                text-lg
                text-cyan-300
                transition
                group-hover:bg-cyan-400/10
            ">
                {icon}
            </div>

            <h3 className="
                mt-5
                text-base
                font-bold
                text-white
            ">
                {title}
            </h3>

            <p className="
                mt-3
                text-sm
                leading-6
                text-slate-500
            ">
                {text}
            </p>

        </div>
    );
};


/* ========================================
   STEP CARD
======================================== */

const StepCard = ({
    number,
    title,
    text
}) => {
    return (
        <div className="
            rounded-2xl
            border
            border-white/8
            bg-white/[0.02]
            p-7
        ">

            <span className="
                text-sm
                font-black
                tracking-[0.2em]
                text-cyan-400
            ">
                {number}
            </span>

            <h3 className="
                mt-5
                text-xl
                font-black
            ">
                {title}
            </h3>

            <p className="
                mt-3
                text-sm
                leading-7
                text-slate-500
            ">
                {text}
            </p>

        </div>
    );
};


export default Home;