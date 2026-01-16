import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Grid Background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(100, 100, 100, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 100, 100, 0.15) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Main Content - Centered with bottom padding for footer */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 pb-24 sm:px-6 sm:pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    {/* Headline */}
                    <h1 className="mb-6 text-4xl font-black uppercase leading-tight tracking-tight text-white sm:mb-8 sm:text-5xl md:mb-10 md:text-7xl lg:mb-12 lg:text-8xl xl:text-9xl">
                        Face Recognition
                        <br />
                        Attendance System
                    </h1>

                    {/* Description */}
                    <p className="mx-auto mb-6 max-w-3xl px-2 text-sm leading-relaxed text-gray-400 sm:mb-8 sm:px-4 sm:text-base md:mb-10 md:text-lg lg:mb-12 lg:text-xl lg:leading-relaxed">
                        AI-powered biometric attendance tracking. Instant verification, zero manual entries, complete automation for educational institutions.
                    </p>

                    {/* CTA Button */}
                    <Link to="/role-selection" className="mt-2 inline-block sm:mt-3 md:mt-4 lg:mt-6">
                        <Button
                            size="lg"
                            className="h-11 px-6 text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 sm:h-12 sm:px-8 sm:text-sm md:h-14 md:px-10 md:text-base lg:h-16 lg:px-12 lg:text-lg"
                        >
                            Get Started
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Footer - Integrated */}
            <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/50 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    {/* Left - Copyright */}
                    <p className="text-xs text-gray-500 sm:text-sm">
                        © {new Date().getFullYear()} AttendU. All rights reserved.
                    </p>

                    {/* Right - Social Links */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <a href="#" className="text-gray-500 transition-colors hover:text-white">
                            <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                        </a>
                        <a href="#" className="text-gray-500 transition-colors hover:text-white">
                            <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                        </a>
                        <a href="#" className="text-gray-500 transition-colors hover:text-white">
                            <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
