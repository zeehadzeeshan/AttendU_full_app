import { motion } from "framer-motion";

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}: {
    className?: string;
    children?: React.ReactNode;
    showRadialGradient?: boolean;
} & React.HTMLProps<HTMLDivElement>) => {
    return (
        <div
            className={`relative flex flex-col items-center justify-center overflow-hidden bg-zinc-950 text-slate-950 transition-bg ${className}`}
            {...props}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={`
            pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] invert filter
            will-change-transform
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,#60a5fa_10%,#e879f9_15%,#60a5fa_20%,#a78bfa_25%,#60a5fa_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
          `}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                            backgroundImage: [
                                "repeating-linear-gradient(100deg, #60a5fa 10%, #e879f9 15%, #60a5fa 20%, #a78bfa 25%, #60a5fa 30%)",
                                "repeating-linear-gradient(100deg, #3b82f6 10%, #d946ef 15%, #3b82f6 20%, #8b5cf6 25%, #3b82f6 30%)",
                            ],
                            backgroundPosition: ["350% 50%", "350% 200%"],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "linear",
                        }}
                        className="absolute inset-0 mix-blend-overlay"
                    />
                </div>
            </div>
            {children}
        </div>
    );
};
