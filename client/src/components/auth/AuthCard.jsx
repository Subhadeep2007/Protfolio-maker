const AuthCard = ({
    children
}) => {

    return (
        <section
            className="
                rounded-2xl
                border border-white/10
                bg-white/[0.04]
                p-5
                shadow-2xl
                shadow-black/20
                backdrop-blur-xl
                sm:p-7
            "
        >

            {children}

        </section>
    );
};


export default AuthCard;