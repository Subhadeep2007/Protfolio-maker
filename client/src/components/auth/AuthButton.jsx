const AuthButton = ({
    children,
    type = "button",
    loading = false,
    disabled = false,
    onClick
}) => {

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className="
                group
                relative
                w-full
                overflow-hidden
                rounded-xl
                bg-cyan-400
                px-4
                py-3
                text-sm
                font-semibold
                text-slate-950
                shadow-lg
                shadow-cyan-500/10
                transition-all
                duration-200
                hover:bg-cyan-300
                hover:shadow-cyan-500/20
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
            "
        >

            {loading ? (
                <span className="flex items-center justify-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />

                    Please wait...

                </span>
            ) : (
                children
            )}

        </button>
    );
};


export default AuthButton;