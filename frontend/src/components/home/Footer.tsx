import { Link } from "react-router-dom";
import { GraduationCap, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-zinc-950 text-slate-400">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 text-white">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-cyan-600 text-white">
                                <GraduationCap className="size-4" />
                            </div>
                            <span className="text-xl font-bold">AttendU</span>
                        </Link>
                        <p className="max-w-xs text-sm">
                            A modern, AI-powered attendance management system aimed at streamlining educational institutions.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                            Product
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="#" className="hover:text-cyan-400">Features</Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-cyan-400">Documentation</Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:text-cyan-400">Security</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                            Connect
                        </h4>
                        <div className="flex gap-4">
                            <Link to="#" className="hover:text-cyan-400">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link to="#" className="hover:text-cyan-400">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link to="#" className="hover:text-cyan-400">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} AttendU Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
