import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { BrainCircuit, Lock, Smartphone, Zap } from "lucide-react";

const chartData = [
    { value: 30 }, { value: 60 }, { value: 45 }, { value: 80 }, { value: 65 }, { value: 95 }, { value: 85 }
];

export default function Features() {
    return (
        <section className="bg-zinc-950 py-24 text-white">
            <div className="container mx-auto px-4">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-left bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
                        Engineered for <span className="text-cyan-400">Performance</span>
                    </h2>
                    <p className="mt-4 text-lg text-slate-400 text-left">
                        A complete ecosystem ensuring data integrity and operational efficiency at scale.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">

                    {/* Large Card: Real-time Analytics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="col-span-1 md:col-span-4 md:row-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 group backdrop-blur-sm"
                    >
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold">Real-time Analytics</h3>
                                <p className="mt-2 max-w-sm text-slate-400">
                                    Monitor attendance trends as they happen. Our dashboard processes thousands of records with zero latency.
                                </p>
                            </div>

                            {/* Embedded Graph Viz */}
                            <div className="mt-8 h-48 w-full rounded-xl border border-white/5 bg-black/20 p-4 shadow-sm backdrop-blur-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-400">Live Attendance Rate</span>
                                    <span className="text-xs font-bold text-green-400">+12.5%</span>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="value" stroke="#22d3ee" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Decorative Gradient */}
                        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px] group-hover:bg-cyan-500/20 transition-colors" />
                    </motion.div>

                    {/* Medium Card: AI Core */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="col-span-1 md:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-purple-500/10 p-2 text-purple-400">
                                <BrainCircuit className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold">Neural Engine</h3>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">
                            Local-first processing ensures privacy while delivering identification speeds under 200ms.
                        </p>
                    </motion.div>

                    {/* Small Card: Security */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="col-span-1 md:col-span-1 relative overflow-hidden rounded-3xl border border-white/10 bg-indigo-950/50 p-6 text-white backdrop-blur-sm"
                    >
                        <Lock className="h-8 w-8 mb-4 opacity-80 text-indigo-400" />
                        <h3 className="font-bold">Encrypted</h3>
                        <p className="mt-2 text-xs opacity-70">AES-256 bit data protection standard.</p>
                    </motion.div>

                    {/* Small Card: Mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="col-span-1 md:col-span-1 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                    >
                        <Smartphone className="h-8 w-8 mb-4 text-cyan-400" />
                        <h3 className="font-bold">Mobile First</h3>
                        <p className="mt-2 text-xs text-slate-400">Responsive design for all devices.</p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
