import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Calendar, Users, CheckCircle, Clock, MapPin, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TeacherDashboard = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [stats, setStats] = useState({
        assignedCount: 0,
        todayCount: 0,
        attendanceTaken: 0
    });
    const [todayClasses, setTodayClasses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        if (!user?.teacher_id) {
            console.warn('⚠️ Dashboard: No teacher_id found in user context');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = days[new Date().getDay()];

            // 1. Get Teacher Assignments & Routine
            const [myRoutines, allAssignments] = await Promise.all([
                api.getRoutines({ teacher_id: user.teacher_id, day: today }),
                api.getTeacherAssignments(user.teacher_id)
            ]);

            setTodayClasses(myRoutines || []);
            setStats({
                assignedCount: allAssignments?.length || 0,
                todayCount: myRoutines?.length || 0,
                attendanceTaken: 0 // Will implement detailed stats later
            });
        } catch (error) {
            console.error("Dashboard fetch error", error);
            toast({ title: "Error", description: "Failed to load dashboard data", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.teacher_id]);

    const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, delay }: any) => (
        <Card className={`border-none shadow-sm bg-white rounded-3xl group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5`} style={{ animationDelay: delay }}>
            <div className="p-6">
                <div className={`w-12 h-12 ${bgClass} rounded-2xl flex items-center justify-center mb-4 ring-4 ring-white shadow-sm transition-transform group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                </div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
                <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
            </div>
        </Card>
    );

    return (
        <div className="space-y-8 pb-6">
            {/* Header / Banner */}
            <div className="relative overflow-hidden group rounded-[2.5rem]">
                <div className="absolute inset-0 bg-primary/5 -z-10 transition-colors group-hover:bg-primary/10" />
                <div className="px-8 py-10 sm:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-3">
                        <Badge className="bg-primary text-white hover:bg-primary border-none text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                            Academic Session 2024
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                            Instructor Dashboard
                        </h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                            Welcome back, <span className="text-slate-900 font-bold">{user?.name}</span>. You have <span className="font-black text-primary">{stats.todayCount} classes</span> scheduled for today.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200 rotate-3 transition-transform group-hover:rotate-6">
                            <TrendingUp className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Classes"
                    value={stats.assignedCount}
                    icon={Users}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50"
                    delay="0ms"
                />
                <StatCard
                    title="Scheduled Today"
                    value={stats.todayCount}
                    icon={Calendar}
                    colorClass="text-purple-600"
                    bgClass="bg-purple-50"
                    delay="100ms"
                />
                <StatCard
                    title="Sessions Taken"
                    value={stats.attendanceTaken}
                    icon={CheckCircle}
                    colorClass="text-green-600"
                    bgClass="bg-green-50"
                    delay="200ms"
                />
            </div>

            {/* Today's Schedule */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-primary" />
                        Today's Schedule
                    </h2>
                    <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-500 uppercase tracking-wide">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                </div>

                <div className="grid gap-4">
                    {!isLoading ? (
                        todayClasses.length > 0 ? (
                            todayClasses.map((routine, i) => (
                                <div
                                    key={routine.id}
                                    className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300 cursor-default"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    {/* Time Block */}
                                    <div className="flex flex-col items-center justify-center min-w-[90px] bg-slate-50 rounded-2xl p-3 border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                                        <span className="text-xl font-black text-slate-900">{routine.start_time?.slice(0, 5)}</span>
                                        <div className="h-0.5 w-4 bg-slate-200 my-1 group-hover:bg-primary/20" />
                                        <span className="text-sm font-bold text-slate-500">{routine.end_time?.slice(0, 5)}</span>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                                                {routine.course_catalog?.subject_code}
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                            {routine.course_catalog?.subject_name}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Users className="w-4 h-4" />
                                                {routine.section?.batch?.name}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-slate-700">Section {routine.section?.name}</span>
                                        </div>
                                    </div>

                                    {routine.room_id && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-600 font-bold border border-slate-100">
                                            <MapPin className="w-4 h-4 text-red-500" />
                                            <span>{routine.room_id}</span>
                                        </div>
                                    )}

                                    <div className="hidden sm:flex items-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                        <Button size="icon" className="rounded-full h-10 w-10">
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-white border-2 border-dashed border-slate-100 rounded-[3rem]">
                                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                    <Sparkles className="w-10 h-10 text-slate-300" />
                                </div>
                                <p className="text-slate-400 font-bold text-lg">No classes scheduled for today.</p>
                                <p className="text-slate-400 text-sm mt-1">Enjoy your free time!</p>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col gap-4">
                            {[1, 2].map(i => (
                                <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl" />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
