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
    MessageSquare,
    LogOut,
    Settings,
    ChevronRight as ChevronRightIcon,
    ChevronLeft as ChevronLeftIcon,
    Flame
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

const Dashboard = ({ user, dailyLogs, workoutHistory, onUpdateFoodLog, onLogWorkout, onLogout, onOpenSettings }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);

    // Calendar view state
    const [viewDate, setViewDate] = useState(new Date());
    const [inputs, setInputs] = useState({});
    const [foodLogInput, setFoodLogInput] = useState("");
    const [isSavingFoodLog, setIsSavingFoodLog] = useState(false);
    const [isFuelLogOpen, setIsFuelLogOpen] = useState(false);

    const selDateObj = new Date(selectedDate);
    const dayOfWeek = selDateObj.getDay();
    const routine = routines[dayOfWeek];
    const isRestDay = !routine;
    const isSelectedToday = selectedDate === todayStr;

    // Week calculation for highlighting
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
        <div className="relative flex flex-col lg:grid lg:grid-cols-[240px_1fr] gap-10 min-h-screen animate-in fade-in duration-500 pb-32 overflow-x-hidden">
            {/* Sidebar: Navigation & Controls */}
            <aside className="lg:border-r lg:border-slate-100 lg:pr-8">
                <div className="lg:sticky lg:top-8 flex flex-col h-full min-h-[calc(100vh-80px)]">
                    {/* Brand */}
                    <div className="mb-10 pt-2 text-center lg:text-left">
                        <h1 className="text-3xl font-black italic tracking-tighter text-slate-950 uppercase leading-none">
                            TITAN <span className="text-neon-green">GAINZ</span>
                        </h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-slate-300 mt-2 uppercase">Evolution Engine</p>
                    </div>

                    {/* Compact Calendar */}
                    <div className="glass-card mb-8 p-3 bg-white/50 border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center mb-3 text-slate-900">
                            <h3 className="text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={12} className="text-neon-green" />
                                {fullMonthNames[viewMonth]}
                            </h3>
                            <div className="flex gap-0.5">
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-md text-slate-400">
                                    <ChevronLeft size={12} />
                                </button>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-md text-slate-400">
                                    <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                            {dayNames.map(d => (
                                <div key={d} className="bg-white text-[8px] font-black uppercase text-slate-300 text-center py-2">
                                    {d[0]}
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
                                                ? 'bg-slate-950 text-white z-10'
                                                : isToday
                                                    ? 'bg-neon-green text-slate-950 font-black'
                                                    : isHighlightedWeek
                                                        ? 'bg-neon-green/10 text-slate-900'
                                                        : 'bg-white text-slate-400 hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <span>{parseInt(d)}</span>
                                        {hasWorkout && (
                                            <div className={`w-0.5 h-0.5 rounded-full mt-0.5 ${isSelected ? 'bg-neon-green' : 'bg-neon-green/60'}`} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col gap-2 flex-grow">
                        <button
                            onClick={onOpenSettings}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-950 transition-all group"
                        >
                            <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                            <span className="text-xs font-black uppercase tracking-widest">Settings</span>
                        </button>

                        <button
                            onClick={onLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all mt-auto mb-10"
                        >
                            <LogOut size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">System Exit</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`max-w-5xl transition-all duration-500 ${isFuelLogOpen ? 'lg:pr-[380px]' : ''}`}>
                {/* Header Info */}
                <header className="mb-12 border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white font-black italic text-lg shadow-lg">
                            {user.streak}
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">Global Streak Score</div>
                            <div className="text-xs font-black text-slate-950 uppercase tracking-widest">Active Phase: Persistence</div>
                        </div>
                    </div>
                    <div className={`text-xs font-black uppercase tracking-[0.2em] mb-3 ${isSelectedToday ? 'text-slate-400' : 'text-neon-green'}`}>
                        {isSelectedToday ? 'SESSION: TODAY' : `SESSION: ${selDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
                    </div>
                    <h2 className="text-6xl font-black text-slate-950 italic tracking-tighter uppercase leading-none">
                        {isRestDay ? "Internal Reset" : routine.name}
                    </h2>
                </header>

                <div className="max-w-4xl mx-auto xl:mx-0">
                    {/* Training Session */}
                    <div className="space-y-8">
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Dumbbell size={20} className="text-slate-950" />
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-950">Structural Loading</h3>
                            </div>

                            {isRestDay ? (
                                <div className="glass-card p-20 border-slate-200 text-center bg-slate-50/30">
                                    <Award size={48} className="mx-auto text-slate-200 mb-6" />
                                    <h4 className="text-2xl font-black text-slate-400 italic mb-3 uppercase tracking-tighter">Growth happens in rest</h4>
                                    <p className="text-slate-400 text-sm italic font-medium">Focus on total recovery, cellular repair, and mental clarity today.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {routine.exercises.map((ex) => {
                                        const history = workoutHistory[ex.name] || { lastReps: 0, lastWeight: 0 };
                                        const guideText = EXERCISE_GUIDE[ex.name];

                                        return (
                                            <div key={ex.id} className="glass-card border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white/80">
                                                <div className="p-8">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <div>
                                                            <h3 className="text-2xl font-black italic text-slate-950 uppercase tracking-tight">{ex.name}</h3>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <span className="text-neon-green text-[11px] font-black uppercase tracking-[0.2em] bg-neon-green/10 px-2 py-0.5 rounded">{ex.target}</span>
                                                                <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{ex.type} LOAD</span>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                                                            <History size={16} className="text-slate-300" />
                                                            <div className="text-right">
                                                                <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Previous Best</div>
                                                                <div className="text-sm font-black text-slate-950">{history.lastReps} <span className="text-slate-400 text-[10px]">REPS</span> {history.lastWeight > 0 ? `@ ${history.lastWeight}kg` : ''}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {guideText && (
                                                        <div className="mb-8 p-5 bg-slate-50/50 border-l-8 border-slate-900 rounded-r-2xl">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Info size={14} className="text-slate-400" />
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Titan Optimization</span>
                                                            </div>
                                                            <p className="text-slate-700 text-sm leading-relaxed italic font-bold">{guideText}</p>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-4">
                                                        <div className="flex-1 relative">
                                                            <input
                                                                type="number"
                                                                placeholder="REPS PERFORMED"
                                                                value={inputs[ex.id] || ''}
                                                                onChange={(e) => handleInputChange(ex.id, e.target.value)}
                                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 text-slate-950 font-black text-lg focus:outline-none focus:ring-4 focus:ring-neon-green/10 focus:border-neon-green transition-all"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => handleLog(ex)}
                                                            className="aspect-square bg-slate-950 text-white flex items-center justify-center rounded-2xl hover:bg-neon-green hover:text-black transition-all px-6 shadow-xl active:scale-95 group"
                                                        >
                                                            <CheckCircle2 size={32} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
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
                </div>
            </main>

            {/* Collapsible Fuel Log Drawer (Far Right) */}
            <div
                className={`fixed top-0 right-0 h-full bg-white border-l border-slate-100 shadow-2xl transition-all duration-500 z-[100] ${isFuelLogOpen ? 'w-full lg:w-[380px]' : 'w-0'}`}
            >
                {/* Drawer Tab / Toggle */}
                <button
                    onClick={() => setIsFuelLogOpen(!isFuelLogOpen)}
                    className="absolute top-1/2 -left-12 -translate-y-1/2 bg-slate-950 text-white p-4 rounded-l-2xl shadow-xl hover:bg-neon-green hover:text-black transition-all flex flex-col items-center gap-2 uppercase text-[9px] font-black vertical-text group"
                >
                    {isFuelLogOpen ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={16} />}
                    <span className="tracking-widest py-2">Metabolic Fuel</span>
                    <Flame size={12} className={isFuelLogOpen ? 'text-neon-green' : 'text-orange-500 group-hover:animate-pulse'} />
                </button>

                {/* Drawer Content */}
                {isFuelLogOpen && (
                    <div className="p-8 h-full flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <MessageSquare size={20} className="text-slate-950" />
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-950">Metabolic Fuel</h3>
                            </div>
                            <button onClick={() => setIsFuelLogOpen(false)} className="text-slate-300 hover:text-slate-950 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow flex flex-col gap-6">
                            <div className="glass-card p-8 border-slate-200 bg-slate-50/50 shadow-inner flex-grow flex flex-col">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Bio-Data Intake Log</div>
                                <textarea
                                    placeholder="Enter meals, nutrients, or system notes..."
                                    value={foodLogInput}
                                    onChange={(e) => setFoodLogInput(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-100 rounded-3xl p-6 text-slate-950 text-base focus:outline-none focus:ring-4 focus:ring-neon-green/5 focus:border-neon-green transition-all flex-grow resize-none mb-6 leading-relaxed font-bold placeholder:italic"
                                />
                                <button
                                    onClick={handleSaveFoodLog}
                                    disabled={isSavingFoodLog}
                                    className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl active:scale-[0.98] ${isSavingFoodLog
                                        ? 'bg-slate-100 text-slate-300'
                                        : 'bg-slate-950 text-white hover:bg-neon-green hover:text-slate-950'
                                        }`}
                                >
                                    {isSavingFoodLog ? 'Syncing...' : 'Log Nutrition'}
                                </button>
                            </div>

                            <div className="px-6 italic text-slate-400 text-sm font-medium leading-relaxed border-l-4 border-slate-100 py-2">
                                "The Titan does not bargain with fatigue. Nutrition is the reinforcement for the coming war."
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS for Vertical Text */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    transform: rotate(180deg);
                }
            `}} />
        </div>
    );
};

export default Dashboard;
