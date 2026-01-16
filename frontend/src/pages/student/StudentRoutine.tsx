import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CalendarRange } from "lucide-react";
import { toast } from "sonner";

const StudentRoutine = () => {
    const { user, loading: authLoading } = useAuth();
    const [routines, setRoutines] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        const student = user as any;
        if (!authLoading && student?.section_id) {
            fetchRoutine(student.section_id);
        } else if (!authLoading) {
            setIsLoading(false);
        }
    }, [authLoading, user]);

    const fetchRoutine = async (sectionId: string) => {
        setIsLoading(true);
        try {
            const data = await api.getRoutines({ section_id: sectionId });
            setRoutines(data || []);
        } catch (e: any) {
            toast.error(`Failed to load routine: ${e.message || "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const routinesByDay = days.map(day => ({
        day,
        items: routines
            .filter(r => r.day_of_week === day)
            .sort((a, b) => {
                if (!a.start_time) return -1;
                if (!b.start_time) return 1;
                return a.start_time.localeCompare(b.start_time);
            })
    })).filter(group => group.items.length > 0);

    return (
        <div className="space-y-6 pb-6 animate-in fade-in duration-700">
            <div className="px-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Class Routine</h1>
                <p className="text-sm text-slate-500 mt-1">Your weekly academic schedule</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loading Routine...</p>
                </div>
            ) : routinesByDay.length > 0 ? (
                <div className="grid gap-6">
                    {routinesByDay.map(({ day, items }) => (
                        <Card key={day} className="border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                            <CardHeader className="bg-white/80 border-b border-slate-100 py-4">
                                <CardTitle className="flex items-center justify-between text-lg text-slate-800">
                                    <span className="flex items-center gap-2">
                                        <CalendarRange className="w-5 h-5 text-primary" />
                                        {day}
                                    </span>
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 font-bold">
                                        {items.length} {items.length === 1 ? 'Class' : 'Classes'}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="grid gap-3">
                                    {items.map((routine) => (
                                        <div key={routine.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-slate-800 text-base mb-1">{routine.course_catalog?.subject_name}</div>
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                    <span>{routine.course_catalog?.subject_code}</span>
                                                    <span>•</span>
                                                    <span>{routine.teachers?.profiles?.name || 'TBA'}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {routine.start_time ? (
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs py-1 px-3 rounded-lg flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                                        {routine.start_time.slice(0, 5)} - {routine.end_time?.slice(0, 5)}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-500 italic border-slate-200 text-xs py-1 px-3 rounded-lg">
                                                        Time TBA
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs py-1 px-3 rounded-lg flex items-center gap-2">
                                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                                    Room {routine.room_id}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardContent className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <CalendarRange className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg text-slate-800">No Routine Found</h3>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                    Your class schedule hasn't been set yet. Please check back later or contact your department.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default StudentRoutine;
