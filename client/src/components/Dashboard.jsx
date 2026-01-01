import React, { useState } from 'react';
import {
    CheckCircle2,
    History,
    Dumbbell,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Award,
    Info,
    X,
    MessageSquare
} from 'lucide-react';

const EXERCISE_GUIDE = {
    "Pushups": "Hands shoulder-width apart. Keep body in a straight line (plank). Lower chest to floor.",
    "Door Rows": "Wrap towel around doorknob or hold frame. Lean back. Pull chest to door. Squeeze back muscles.",
    "DB Lateral Raises": "Stand tall. Lift 2kg DBs out to sides until shoulder height. Pour the pitcher motion.",
    "DB Bicep Curls": "Elbows pinned to side. Curl weight up. Lower SLOWLY (3 seconds down).",
    "Bulgarian Split Squats": "One foot on chair behind you. Hop front foot forward. Lower hips until front thigh is parallel.",
    "Bodyweight Squats": "Feet shoulder-width. Sit back like sitting in a chair. Keep chest up.",
    "DB Calf Raises": "Stand on edge of step (optional). Lift heels as high as possible. Squeeze at top.",
    "Pike Pushups": "Downward dog position (V-shape). Lower top of head to floor. Press back up.",
    "Diamond Pushups": "Hands together in diamond shape. Lower chest to hands. Keep elbows tucked.",
    "Glute Bridges": "Lie on back, knees bent. Drive hips to ceiling. Squeeze glutes hard at top.",
    "Plank": "Forearms on floor. Body straight. Tighten abs like someone is about to punch you."
};

const routines = {
    1: {
        name: "Upper Body A",
        exercises: [
            { id: "pushups", name: "Pushups", target: "Failure", type: "BW" },
            { id: "door_rows", name: "Door Rows", target: "3 x 12", type: "BW" },
            { id: "lateral_raises", name: "DB Lateral Raises", target: "4 x 25", type: "DB", weight: 2 },
            { id: "bicep_curls", name: "DB Bicep Curls", target: "3 x 25", type: "DB", weight: 2 },
        ]
    },
    2: {
        name: "Lower Body A",
        exercises: [
            { id: "split_squats", name: "Bulgarian Split Squats", target: "3 x 10/leg", type: "BW" },
            { id: "bw_squats", name: "Bodyweight Squats", target: "3 x 30", type: "BW" },
            { id: "calf_raises", name: "DB Calf Raises", target: "4 x 40", type: "DB", weight: 2 },
            { id: "plank", name: "Plank", target: "3 x 60s", type: "BW" },
        ]
    },
    4: {
        name: "Upper Body B",
        exercises: [
            { id: "pike_pushups", name: "Pike Pushups", target: "3 x 8-12", type: "BW" },
            { id: "diamond_pushups", name: "Diamond Pushups", target: "3 x Failure", type: "BW" },
            { id: "front_raises", name: "DB Front Raises", target: "3 x 20", type: "DB", weight: 2 },
            { id: "overhead_extensions", name: "DB Overhead Extensions", target: "3 x 20", type: "DB", weight: 2 },
        ]
    },
    5: {
        name: "Lower Body B",
        exercises: [
            { id: "glute_bridges", name: "Glute Bridges", target: "3 x 15", type: "BW" },
            { id: "reverse_lunges", name: "Reverse Lunges", target: "3 x 15/leg", type: "BW" },
            { id: "side_lunges", name: "Side Lunges", target: "3 x 12/leg", type: "BW" },
            { id: "leg_raises", name: "Leg Raises", target: "3 x 15", type: "BW" },
        ]
    },
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullMonthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Dashboard = ({ user, dailyLogs, workoutHistory, onUpdateFoodLog, onLogWorkout }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);

    // Calendar view state
    const [viewDate, setViewDate] = useState(new Date());
    const [inputs, setInputs] = useState({});
    const [foodLogInput, setFoodLogInput] = useState("");
    const [isSavingFoodLog, setIsSavingFoodLog] = useState(false);

    const selDateObj = new Date(selectedDate);
    const dayOfWeek = selDateObj.getDay();
    const routine = routines[dayOfWeek];
    const isRestDay = !routine;
    const isSelectedToday = selectedDate === todayStr;

    // Week calculation for highlighting
    // We want to highlight the week containing the selected date
    const startOfWeek = new Date(selDateObj);
    startOfWeek.setDate(selDateObj.getDate() - selDateObj.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const isInSelectedWeek = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return d >= startOfWeek && d <= endOfWeek;
    };

    // Daily log for selected date
    const selectedDayLog = dailyLogs.find(l => l.date === selectedDate) || { foodLog: "", workoutCompleted: false };

    // Sync food log input when selected date changes
    React.useEffect(() => {
        setFoodLogInput(selectedDayLog.foodLog || "");
    }, [selectedDate, selectedDayLog.foodLog]);

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
        setInputs({});
    };

    const handleInputChange = (id, val) => {
        setInputs(prev => ({ ...prev, [id]: val }));
    };

    const handleLog = (exercise) => {
        const val = inputs[exercise.id];
        if (!val) return;
        onLogWorkout(exercise.name, parseInt(val), exercise.weight || 0, selectedDate);
    };

    const handleSaveFoodLog = async () => {
        setIsSavingFoodLog(true);
        await onUpdateFoodLog(foodLogInput, selectedDate);
        setIsSavingFoodLog(false);
    };

    // Calendar generation
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        calendarDays.push(dateStr);
    }

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-8 min-h-[calc(100vh-140px)] animate-in fade-in duration-500 pb-32">
            {/* Sidebar: Calendar */}
            <aside className="space-y-6">
                <div className="lg:sticky lg:top-8">
                    <div className="glass-card p-3 border-slate-200 shadow-sm overflow-hidden bg-white/80">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                                <Calendar size={12} className="text-neon-green" />
                                {fullMonthNames[viewMonth]} <span className="text-slate-400 font-bold">{viewYear}</span>
                            </h3>
                            <div className="flex gap-0.5">
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-900 transition-colors">
                                    <ChevronLeft size={12} />
                                </button>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-900 transition-colors">
                                    <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Sheet Grid */}
                        <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                            {dayNames.map(d => (
                                <div key={d} className="bg-white text-[8px] font-black uppercase text-slate-400 text-center py-2 border-b border-slate-50">
                                    {d}
                                </div>
                            ))}
                            {calendarDays.map((dateStr, idx) => {
                                if (!dateStr) return <div key={`empty-${idx}`} className="bg-white" />;

                                const isSelected = dateStr === selectedDate;
                                const isToday = dateStr === todayStr;
                                const isHighlightedWeek = isInSelectedWeek(dateStr);
                                const d = dateStr.split('-')[2];
                                const log = dailyLogs.find(l => l.date === dateStr);
                                const hasWorkout = log?.workoutCompleted;

                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => handleDateClick(dateStr)}
                                        className={`
                                            aspect-square flex flex-col items-center justify-center transition-all relative text-[9px] font-bold
                                            ${isSelected
                                                ? 'bg-slate-950 text-white z-10 shadow-inner'
                                                : isToday
                                                    ? 'bg-neon-green/30 text-slate-950 font-black'
                                                    : isHighlightedWeek
                                                        ? 'bg-neon-green/5 text-slate-900'
                                                        : 'bg-white text-slate-400 hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <span>{parseInt(d)}</span>
                                        {hasWorkout && (
                                            <div className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-neon-green' : 'bg-neon-green/60'}`} />
                                        )}
                                        {isHighlightedWeek && !isSelected && (
                                            <div className="absolute inset-0 border-y border-neon-green/10 pointer-events-none" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Stats in Sidebar */}
                    <div className="mt-4 px-1 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Training Streak</span>
                            <span className="text-slate-900">{user.streak} Days</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-neon-green h-full" style={{ width: `${Math.min(100, (user.streak / 30) * 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main>
                {/* Header Info */}
                <header className="mb-8">
                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${isSelectedToday ? 'text-slate-400' : 'text-neon-green'}`}>
                        {isSelectedToday ? 'TRACKING TODAY' : 'VIEWING DATE'} — {selDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h2 className="text-4xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                        {isRestDay ? "Active Recovery" : routine.name}
                    </h2>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
                    {/* Left Col: Exercises */}
                    <div className="space-y-6">
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Dumbbell size={16} className="text-slate-400" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Training Session</h3>
                            </div>

                            {isRestDay ? (
                                <div className="glass-card p-12 border-slate-200 text-center bg-slate-50/50">
                                    <Award size={40} className="mx-auto text-slate-200 mb-4" />
                                    <h4 className="text-lg font-black text-slate-400 italic mb-2 uppercase tracking-tighter">Growth happens in rest</h4>
                                    <p className="text-slate-400 text-xs italic">Focus on mobility, hydration, and quality sleep today.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {routine.exercises.map((ex) => {
                                        const history = workoutHistory[ex.name] || { lastReps: 0, lastWeight: 0 };
                                        const guideText = EXERCISE_GUIDE[ex.name];

                                        return (
                                            <div key={ex.id} className="glass-card border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-5">
                                                        <div>
                                                            <h3 className="text-xl font-black italic text-slate-950 uppercase tracking-tight">{ex.name}</h3>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-neon-green text-[10px] font-black uppercase tracking-widest">{ex.target}</span>
                                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{ex.type}</span>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-[10px] font-black uppercase flex items-center gap-2">
                                                            <History size={12} className="text-slate-400" />
                                                            <span className="text-slate-500">PB:</span>
                                                            <span className="text-slate-950 font-black">{history.lastReps} {history.lastWeight > 0 ? `@ ${history.lastWeight}kg` : 'REPS'}</span>
                                                        </div>
                                                    </div>

                                                    {guideText && (
                                                        <div className="mb-6 p-4 bg-slate-50/80 border-l-4 border-neon-green/30 rounded-r-xl">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Info size={14} className="text-slate-400" />
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Technique Guide</span>
                                                            </div>
                                                            <p className="text-slate-600 text-[11px] leading-relaxed italic font-medium">{guideText}</p>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-3">
                                                        <div className="flex-1 relative">
                                                            <input
                                                                type="number"
                                                                placeholder="REPS PERFORMED"
                                                                value={inputs[ex.id] || ''}
                                                                onChange={(e) => handleInputChange(ex.id, e.target.value)}
                                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-5 text-slate-950 font-black text-sm focus:outline-none focus:ring-2 focus:ring-neon-green/20 focus:border-neon-green transition-all"
                                                            />
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">Input</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleLog(ex)}
                                                            className="aspect-square bg-slate-950 text-white flex items-center justify-center rounded-xl hover:bg-neon-green hover:text-black transition-all px-5 shadow-lg active:scale-95"
                                                        >
                                                            <CheckCircle2 size={24} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Col: Food Log */}
                    <div className="space-y-6">
                        <section className="lg:sticky lg:top-8">
                            <div className="flex items-center gap-2 mb-4">
                                <MessageSquare size={16} className="text-slate-400" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Fuel Log</h3>
                            </div>
                            <div className="glass-card p-6 border-slate-200">
                                <textarea
                                    placeholder="Enter meals, macros, or notes for this date..."
                                    value={foodLogInput}
                                    onChange={(e) => setFoodLogInput(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-neon-green/10 focus:border-neon-green transition-all min-h-[200px] xl:min-h-[400px] resize-none mb-4 leading-relaxed font-medium"
                                />
                                <button
                                    onClick={handleSaveFoodLog}
                                    disabled={isSavingFoodLog}
                                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-sm ${isSavingFoodLog
                                        ? 'bg-slate-50 text-slate-300'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-950 hover:text-white hover:border-slate-950'
                                        }`}
                                >
                                    {isSavingFoodLog ? 'Syncing...' : 'Log Nutrition'}
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
