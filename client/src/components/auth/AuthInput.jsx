import {
    useState
} from "react";

import {
    Eye,
    EyeOff
} from "lucide-react";


const AuthInput = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    autoComplete
}) => {

    const [
        showPassword,
        setShowPassword
    ] = useState(false);


    const isPassword =
        type === "password";


    return (
        <div className="space-y-2">

            <label
                htmlFor={name}
                className="block text-sm font-medium text-slate-200"
            >
                {label}
            </label>


            <div className="relative">

                <input
                    id={name}
                    name={name}
                    type={
                        isPassword && showPassword
                            ? "text"
                            : type
                    }
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className={`
                        w-full
                        rounded-xl
                        border
                        bg-white/[0.03]
                        px-4
                        py-3
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-slate-600
                        transition-all
                        duration-200

                        ${
                            isPassword
                                ? "pr-12"
                                : ""
                        }

                        ${
                            error
                                ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                                : "border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
                        }

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    `}
                />


                {isPassword && (

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(
                                (previous) =>
                                    !previous
                            )
                        }
                        disabled={disabled}
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2

                            rounded-lg
                            p-1.5

                            text-slate-500
                            transition-colors

                            hover:bg-white/5
                            hover:text-cyan-400

                            disabled:pointer-events-none
                            disabled:opacity-50
                        "
                    >

                        {showPassword ? (
                            <EyeOff
                                size={18}
                            />
                        ) : (
                            <Eye
                                size={18}
                            />
                        )}

                    </button>

                )}

            </div>


            {error && (
                <p className="text-xs text-red-400">
                    {error}
                </p>
            )}

        </div>
    );
};


export default AuthInput;