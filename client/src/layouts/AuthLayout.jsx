const AuthLayout = ({
    children,
    title,
    subtitle
}) => {

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

            {/* Background Glow */}

            <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />


            {/* Grid */}

            <div
                className="
                    pointer-events-none
                    absolute inset-0
                    opacity-[0.03]
                    bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                    bg-[size:40px_40px]
                "
            />


            {/* Content */}

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">

                <div className="w-full max-w-md">

                    {/* Brand */}

                    <div className="mb-8 text-center">

                        <div className="mb-4 inline-flex items-center gap-2">

                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />

                            <span className="text-sm font-medium tracking-[0.25em] text-cyan-400">
                                PORTFOLIO
                            </span>

                        </div>


                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            {title}
                        </h1>


                        {subtitle && (
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                {subtitle}
                            </p>
                        )}

                    </div>


                    {children}


                    {/* Footer */}

                    <p className="mt-6 text-center text-xs text-slate-600">
                        Portfolio Builder
                    </p>

                </div>

            </div>

        </main>
    );
};


export default AuthLayout;