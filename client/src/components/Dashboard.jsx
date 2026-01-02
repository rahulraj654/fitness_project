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
    Flame,
    Target,
    Zap,
    TrendingUp
} from 'lucide-react';

// Enhanced Exercise Guide with hypertrophy-focused instructions
const EXERCISE_GUIDE = {
    // Upper Body A
    "Pushups": {
        instruction: "Hands shoulder-width apart. Keep body in a straight line. Lower chest to floor with control.",
        progress: "Too easy? Elevate your feet on a chair or add a 3-second pause at the bottom.",
        feel: "Feel the stretch across your chest and tension in your triceps."
    },
    "Door Rows": {
        instruction: "Wrap towel around doorknob or hold frame. Lean back, pull chest to door, squeeze back muscles.",
        progress: "Increase the angle (lean back more) or use one arm at a time.",
        feel: "Feel your shoulder blades squeeze together and lats engage."
    },
    "DB Lateral Raises": {
        instruction: "Stand tall. Lift weights out to sides until shoulder height. 'Pour the pitcher' at the top.",
        progress: "Slow down the negative (3 seconds down) or add a pause at the top.",
        feel: "Feel the burn in the middle of your shoulder cap (medial deltoid)."
    },
    "DB Bicep Curls": {
        instruction: "Elbows pinned to your sides. Curl weight up, lower SLOWLY (3 seconds down).",
        progress: "Add a 2-second squeeze at the top or switch to alternating arms.",
        feel: "Feel the bicep peak contract hard at the top of each rep."
    },
    // Lower Body A
    "Bulgarian Split Squats": {
        instruction: "One foot on chair behind you. Hop front foot forward. Lower until front thigh is parallel.",
        progress: "Hold water jugs or a loaded backpack. Add deficit under front foot.",
        feel: "Feel deep stretch in rear hip flexor and quad burn in front leg."
    },
    "Bodyweight Squats": {
        instruction: "Feet shoulder-width. Sit back like sitting in a chair. Keep chest up, go below parallel.",
        progress: "Slow the tempo to 4 seconds down, or try 1.5 rep squats (down, half up, down, full up).",
        feel: "Feel your quads burning and glutes activating as you drive up."
    },
    "DB Calf Raises": {
        instruction: "Stand on edge of step (optional). Lift heels as high as possible. Squeeze hard at top.",
        progress: "Single-leg calf raises or add a 3-second hold at the top.",
        feel: "Feel the calf muscle fully contract and stretch through full range."
    },
    "Plank": {
        instruction: "Forearms on floor. Body in straight line. Brace abs like bracing for a punch.",
        progress: "Add weight on your back or try body saw (shift forward/backward).",
        feel: "Feel your entire core working - abs, obliques, and lower back."
    },
    // Upper Body B
    "Pike Pushups": {
        instruction: "Downward dog position (V-shape). Lower top of head toward floor. Press back up.",
        progress: "Elevate feet on a chair for more shoulder emphasis.",
        feel: "Feel the front of your shoulders (anterior deltoids) doing the work."
    },
    "Diamond Pushups": {
        instruction: "Hands together forming diamond shape. Lower chest to hands. Keep elbows tucked.",
        progress: "Add a pause at the bottom or elevate feet.",
        feel: "Feel the inner chest and triceps working intensely."
    },
    "DB Front Raises": {
        instruction: "Arms straight, raise weight to eye level. Control the descent.",
        progress: "Alternate arms or add a pause at the top.",
        feel: "Feel the front of your shoulder burning through the movement."
    },
    "DB Overhead Extensions": {
        instruction: "Hold weight overhead, lower behind head, extend back up. Keep elbows pointed up.",
        progress: "Slow the negative to 4 seconds or use a heavier object.",
        feel: "Feel the long head of your triceps stretch and contract."
    },
    // Lower Body B - HYPERTROPHY FOCUSED
    "Single-Leg Hip Thrusts": {
        instruction: "Back on couch/chair for support. One leg extended. Drive through heel, squeeze glute at top.",
        progress: "Add a 3-second hold at the top or place a heavy book on your hip.",
        feel: "Feel the burn in your glute, NOT your lower back or hamstring."
    },
    "Deficit Bulgarian Split Squats": {
        instruction: "Front foot on a book/platform for deficit. Rear foot on chair. Focus on 3-second controlled descent.",
        progress: "Hold water jugs, wear a loaded backpack, or increase the deficit height.",
        feel: "Feel deep quad stretch and intense glute activation on the working leg."
    },
    "Sliding Hamstring Curls": {
        instruction: "Lie on back, heels on towel/socks on smooth floor. Lift hips, slide heels toward glutes.",
        progress: "Single-leg variation or add a pause when fully contracted.",
        feel: "Feel your hamstrings cramping as they curl - this is the posterior chain working."
    },
    "Lying Leg Lifts w/ Hip Lift": {
        instruction: "Legs straight up. Lower slowly, then at the top, add a hip thrust toward ceiling.",
        progress: "Slower tempo or add ankle weights. Hold something overhead for stability.",
        feel: "Feel your lower abs compress and hip flexors engage. Core should be on fire."
    }
};

const routines = {
    1: {
        name: "Upper Body A",
        subtitle: "Push & Pull Foundation",
        exercises: [
            { id: "pushups", name: "Pushups", target: "3 x 8-12", type: "BW", tempo: "3-1-2" },
            { id: "door_rows", name: "Door Rows", target: "3 x 10-12", type: "BW", tempo: "2-1-3" },
            { id: "lateral_raises", name: "DB Lateral Raises", target: "4 x 12-15", type: "DB", weight: 2, tempo: "2-1-2" },
            { id: "bicep_curls", name: "DB Bicep Curls", target: "3 x 10-12", type: "DB", weight: 2, tempo: "2-1-3" },
        ]
    },
    2: {
        name: "Lower Body A",
        subtitle: "Quad Dominant",
        exercises: [
            { id: "split_squats", name: "Bulgarian Split Squats", target: "3 x 8-10/leg", type: "BW", tempo: "3-1-2" },
            { id: "bw_squats", name: "Bodyweight Squats", target: "3 x 15-20", type: "BW", tempo: "3-1-1" },
            { id: "calf_raises", name: "DB Calf Raises", target: "4 x 15-20", type: "DB", weight: 2, tempo: "2-2-2" },
            { id: "plank", name: "Plank", target: "3 x 45-60s", type: "BW" },
        ]
    },
    4: {
        name: "Upper Body B",
        subtitle: "Shoulder & Arm Focus",
        exercises: [
            { id: "pike_pushups", name: "Pike Pushups", target: "3 x 8-10", type: "BW", tempo: "3-1-2" },
            { id: "diamond_pushups", name: "Diamond Pushups", target: "3 x 8-12", type: "BW", tempo: "3-1-1" },
            { id: "front_raises", name: "DB Front Raises", target: "3 x 12-15", type: "DB", weight: 2, tempo: "2-1-2" },
            { id: "overhead_extensions", name: "DB Overhead Extensions", target: "3 x 10-12", type: "DB", weight: 2, tempo: "2-1-3" },
        ]
    },
    5: {
        name: "Lower Body B",
        subtitle: "Glute & Hamstring Hypertrophy",
        exercises: [
            { id: "single_leg_hip_thrusts", name: "Single-Leg Hip Thrusts", target: "3 x 10-12/leg", type: "BW", tempo: "2-2-1" },
            { id: "deficit_bulgarian_split_squats", name: "Deficit Bulgarian Split Squats", target: "3 x 8-10/leg", type: "BW", tempo: "3-1-1" },
            { id: "sliding_hamstring_curls", name: "Sliding Hamstring Curls", target: "3 x 8-12", type: "BW", tempo: "2-1-3" },
            { id: "lying_leg_lifts_hip_lift", name: "Lying Leg Lifts w/ Hip Lift", target: "3 x 10-12", type: "BW", tempo: "2-1-2" },
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

    // Calculate streak
    const calculateStreak = () => {
        let streak = 0;
        const sortedLogs = [...dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
        for (const log of sortedLogs) {
            if (log.workoutCompleted) streak++;
            else break;
        }
        return streak;
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

    // Count workouts this month
    const workoutsThisMonth = dailyLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getFullYear() === viewYear && logDate.getMonth() === viewMonth && log.workoutCompleted;
    }).length;

    return (
        <div className="flex min-h-screen">
            {/* Left Sidebar - Fixed/Persistent */}
            <aside className="w-72 bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 h-screen z-50 shadow-sm">
                <div className="flex flex-col h-full p-5">
                    {/* Brand Header */}
                    <div className="mb-6 pt-2">
                        <h1 className="text-lg font-black tracking-tight text-slate-950 uppercase leading-tight">
                            Personal<br />
                            <span className="text-neon-green text-xl">Fitness Tracker</span>
                        </h1>
                        <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400 mt-2 uppercase">Home Hypertrophy Guide</p>
                    </div>

                    {/* Streak Badge */}
                    <div className="mb-6 p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-neon-green flex items-center justify-center text-slate-950 font-black text-xl">
                                {user.streak || calculateStreak()}
                            </div>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Streak</div>
                                <div className="text-sm font-black uppercase tracking-wide">Days Active</div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Calendar */}
                    <div className="flex-grow">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-wide text-slate-950 flex items-center gap-2">
                                        <Calendar size={16} className="text-neon-green" />
                                        {fullMonthNames[viewMonth]}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{viewYear} • {workoutsThisMonth} workouts</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-950 transition-all">
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-950 transition-all">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {dayNames.map(d => (
                                    <div key={d} className="text-[9px] font-black uppercase text-slate-400 text-center py-1">
                                        {d[0]}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((dateStr, idx) => {
                                    if (!dateStr) return <div key={`empty-${idx}`} className="aspect-square" />;

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
                                                aspect-square flex flex-col items-center justify-center transition-all relative rounded-lg text-xs font-bold
                                                ${isSelected
                                                    ? 'bg-slate-950 text-white ring-2 ring-neon-green ring-offset-1'
                                                    : isToday
                                                        ? 'bg-neon-green text-slate-950 font-black'
                                                        : hasWorkout
                                                            ? 'bg-neon-green/20 text-slate-900 hover:bg-neon-green/30'
                                                            : isHighlightedWeek
                                                                ? 'bg-white text-slate-700 hover:bg-slate-100'
                                                                : 'bg-transparent text-slate-400 hover:bg-white'
                                                }
                                            `}
                                        >
                                            <span>{parseInt(d)}</span>
                                            {hasWorkout && !isSelected && (
                                                <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-neon-green" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-200">
                                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold">
                                    <div className="w-2.5 h-2.5 rounded-full bg-neon-green"></div>
                                    <span>Workout Done</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold">
                                    <div className="w-2.5 h-2.5 rounded bg-slate-950"></div>
                                    <span>Selected</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
                        <button
                            onClick={onOpenSettings}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-950 transition-all group"
                        >
                            <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                            <span className="text-xs font-bold uppercase tracking-wider">Settings</span>
                        </button>

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                        >
                            <LogOut size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 ml-72 transition-all duration-500 ${isFuelLogOpen ? 'mr-[380px]' : ''}`}>
                <div className="max-w-4xl mx-auto px-8 py-8">
                    {/* Session Header */}
                    <header className="mb-10 pb-6 border-b border-slate-100">
                        <div className={`text-xs font-bold uppercase tracking-[0.2em] mb-2 ${isSelectedToday ? 'text-slate-400' : 'text-neon-green'}`}>
                            {isSelectedToday ? 'Today\'s Session' : `Session: ${selDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
                        </div>
                        <h2 className="text-5xl font-black text-slate-950 tracking-tight uppercase leading-none mb-2">
                            {isRestDay ? "Recovery Day" : routine.name}
                        </h2>
                        {!isRestDay && (
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{routine.subtitle}</p>
                        )}
                    </header>

                    {/* Training Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-950 rounded-lg">
                                <Dumbbell size={18} className="text-neon-green" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">Structural Loading</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Progressive Overload Protocol</p>
                            </div>
                        </div>

                        {isRestDay ? (
                            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-16 border border-slate-100 text-center">
                                <Award size={56} className="mx-auto text-slate-200 mb-6" />
                                <h4 className="text-2xl font-black text-slate-400 mb-3 uppercase tracking-tight">Growth Happens in Rest</h4>
                                <p className="text-slate-400 text-sm font-medium max-w-md mx-auto">
                                    Your muscles are rebuilding. Focus on nutrition, sleep, and light mobility today.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {routine.exercises.map((ex) => {
                                    const history = workoutHistory[ex.name] || { lastReps: 0, lastWeight: 0 };
                                    const guide = EXERCISE_GUIDE[ex.name];

                                    return (
                                        <div key={ex.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                                            {/* Exercise Header */}
                                            <div className="p-6 pb-0">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight mb-2">{ex.name}</h3>
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <span className="text-neon-green text-[11px] font-black uppercase tracking-wide bg-neon-green/10 px-2.5 py-1 rounded-full">
                                                                {ex.target}
                                                            </span>
                                                            {ex.tempo && (
                                                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wide bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                                    <Zap size={10} />
                                                                    Tempo: {ex.tempo}
                                                                </span>
                                                            )}
                                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{ex.type} Load</span>
                                                        </div>
                                                    </div>
                                                    {/* Previous Best */}
                                                    <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 flex items-center gap-3">
                                                        <History size={14} className="text-slate-300" />
                                                        <div className="text-right">
                                                            <div className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-0.5">Last Session</div>
                                                            <div className="text-sm font-black text-slate-950">
                                                                {history.lastReps} <span className="text-slate-400 text-[9px]">reps</span>
                                                                {history.lastWeight > 0 ? ` @ ${history.lastWeight}kg` : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Exercise Guide */}
                                            {guide && (
                                                <div className="mx-6 mb-4 p-4 bg-slate-50 rounded-xl border-l-4 border-slate-900">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Info size={12} className="text-slate-500" />
                                                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Exercise Guide</span>
                                                    </div>

                                                    <p className="text-slate-700 text-sm font-medium mb-3">{guide.instruction}</p>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                                                        {/* How to Progress */}
                                                        <div className="flex items-start gap-2">
                                                            <div className="p-1 bg-neon-green/20 rounded">
                                                                <TrendingUp size={10} className="text-neon-green" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[9px] font-black uppercase text-neon-green tracking-wide mb-0.5">How to Progress</div>
                                                                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{guide.progress}</p>
                                                            </div>
                                                        </div>

                                                        {/* Mind-Muscle Connection */}
                                                        <div className="flex items-start gap-2">
                                                            <div className="p-1 bg-purple-100 rounded">
                                                                <Target size={10} className="text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[9px] font-black uppercase text-purple-600 tracking-wide mb-0.5">Mind-Muscle Cue</div>
                                                                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{guide.feel}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Input Section */}
                                            <div className="p-6 pt-2 flex gap-3">
                                                <div className="flex-1">
                                                    <input
                                                        type="number"
                                                        placeholder="Enter reps completed"
                                                        value={inputs[ex.id] || ''}
                                                        onChange={(e) => handleInputChange(ex.id, e.target.value)}
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-4 px-5 text-slate-950 font-bold text-base focus:outline-none focus:ring-2 focus:ring-neon-green/30 focus:border-neon-green transition-all placeholder:text-slate-300"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleLog(ex)}
                                                    className="px-6 bg-slate-950 text-white flex items-center justify-center rounded-xl hover:bg-neon-green hover:text-black transition-all shadow-lg active:scale-95 group"
                                                >
                                                    <CheckCircle2 size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
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
                    <span className="tracking-widest py-2">Nutrition Log</span>
                    <Flame size={12} className={isFuelLogOpen ? 'text-neon-green' : 'text-orange-500 group-hover:animate-pulse'} />
                </button>

                {/* Drawer Content */}
                {isFuelLogOpen && (
                    <div className="p-8 h-full flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <MessageSquare size={20} className="text-slate-950" />
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">Nutrition Log</h3>
                            </div>
                            <button onClick={() => setIsFuelLogOpen(false)} className="text-slate-300 hover:text-slate-950 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow flex flex-col gap-6">
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex-grow flex flex-col">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Daily Food Intake</div>
                                <textarea
                                    placeholder="Log your meals, protein intake, supplements..."
                                    value={foodLogInput}
                                    onChange={(e) => setFoodLogInput(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-100 rounded-xl p-4 text-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-neon-green/20 focus:border-neon-green transition-all flex-grow resize-none mb-4 leading-relaxed font-medium placeholder:text-slate-300"
                                />
                                <button
                                    onClick={handleSaveFoodLog}
                                    disabled={isSavingFoodLog}
                                    className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] ${isSavingFoodLog
                                        ? 'bg-slate-100 text-slate-300'
                                        : 'bg-slate-950 text-white hover:bg-neon-green hover:text-slate-950'
                                        }`}
                                >
                                    {isSavingFoodLog ? 'Saving...' : 'Save Log'}
                                </button>
                            </div>

                            <div className="px-4 text-slate-400 text-xs font-medium leading-relaxed border-l-2 border-slate-200 py-2">
                                <span className="font-bold text-slate-600">Tip:</span> For hypertrophy, aim for 1.6-2.2g protein per kg bodyweight daily.
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
