import React, { useState, useEffect, useCallback } from 'react';
import {
    CheckCircle2, History, Dumbbell, ChevronLeft, ChevronRight, Calendar,
    Award, Info, X, MessageSquare, LogOut, Settings, Flame, Target, Zap,
    TrendingUp, AlertTriangle, Play, Clock, Home, Menu, ChevronDown, ChevronUp,
    BookOpen, CheckSquare
} from 'lucide-react';

// ============================================================================
// BEGINNER-FOCUSED EXERCISE DATA
// ============================================================================

const EXERCISE_GUIDE = {
    // ... (Keep existing data, but I will put it all here for completeness)
    "Wall Pushups": {
        difficulty: "Beginner",
        equipment: "Wall",
        steps: [
            "Stand arm's length from a wall",
            "Place palms flat on wall at shoulder height",
            "Lean in, bending elbows to bring chest toward wall",
            "Push back to start position"
        ],
        mistakes: ["Standing too close to wall", "Flaring elbows out wide", "Not engaging core"],
        feel: "Chest and front shoulders working",
        easier: "Stand closer to the wall",
        harder: "Progress to incline pushups on a table",
        videoTip: "Keep your body straight like a plank"
    },
    "Incline Pushups": {
        difficulty: "Beginner",
        equipment: "Table or sturdy chair",
        steps: [
            "Place hands on table edge, shoulder-width apart",
            "Walk feet back until body is straight",
            "Lower chest toward table edge",
            "Push back up with control"
        ],
        mistakes: ["Sagging hips", "Looking up instead of neutral neck", "Going too fast"],
        feel: "Chest stretch at bottom, triceps working on push",
        easier: "Use a higher surface like a counter",
        harder: "Progress to knee pushups on floor",
        videoTip: "Keep elbows at 45° angle, not flared out"
    },
    "Knee Pushups": {
        difficulty: "Beginner",
        equipment: "Yoga mat or soft surface",
        steps: [
            "Start on hands and knees, hands slightly wider than shoulders",
            "Cross ankles and lift feet off floor",
            "Lower chest to the ground slowly (3 seconds)",
            "Push back up to start"
        ],
        mistakes: ["Hips too high in the air", "Not going low enough", "Rushing the movement"],
        feel: "Chest burning, triceps engaged",
        easier: "Reduce range of motion",
        harder: "Try 1-2 regular pushups between sets",
        videoTip: "Imagine pushing the floor away from you"
    },
    "DB Bicep Curls": {
        difficulty: "Beginner",
        equipment: "2x 2kg dumbbells",
        steps: [
            "Stand with dumbbells at sides, palms facing forward",
            "Keep elbows pinned to your ribs",
            "Curl weights up toward shoulders",
            "Lower slowly over 3 seconds (this is key!)"
        ],
        mistakes: ["Swinging body for momentum", "Moving elbows forward", "Dropping weight too fast"],
        feel: "Biceps burning, especially at the top",
        easier: "Curl one arm at a time",
        harder: "Add 2-second squeeze at top",
        videoTip: "Slow negatives = more muscle growth with light weights"
    },
    "DB Lateral Raises": {
        difficulty: "Beginner",
        equipment: "2x 2kg dumbbells",
        steps: [
            "Stand tall, dumbbells at your sides",
            "Raise arms out to sides until shoulder height",
            "Slight bend in elbows, 'pour the pitcher' at top",
            "Lower slowly with control"
        ],
        mistakes: ["Using momentum/swinging", "Shrugging shoulders up", "Lifting too high"],
        feel: "Burn in middle of shoulder cap (side delts)",
        easier: "Raise to 45° instead of 90°",
        harder: "Add 1-second pause at top",
        videoTip: "Lead with your elbows, not your hands"
    },
    "DB Overhead Press": {
        difficulty: "Beginner",
        equipment: "2x 2kg dumbbells",
        steps: [
            "Hold dumbbells at shoulder height, palms forward",
            "Press weights straight overhead",
            "Fully extend arms without locking elbows",
            "Lower back to shoulders with control"
        ],
        mistakes: ["Arching lower back", "Pressing forward instead of up", "Not full range of motion"],
        feel: "Front and side shoulders working hard",
        easier: "Seated on a chair for back support",
        harder: "Single arm press for core challenge",
        videoTip: "Brace your core like someone's about to poke your belly"
    },
    "Bodyweight Squats": {
        difficulty: "Beginner",
        equipment: "None",
        steps: [
            "Stand with feet shoulder-width apart",
            "Push hips back and bend knees",
            "Lower until thighs are parallel (or as low as comfortable)",
            "Drive through heels to stand back up"
        ],
        mistakes: ["Knees caving inward", "Coming up on toes", "Not going deep enough"],
        feel: "Quads and glutes burning",
        easier: "Squat to a chair and stand up",
        harder: "3-second lowering phase",
        videoTip: "Push your knees out over your toes, not inward"
    },
    "Glute Bridges": {
        difficulty: "Beginner",
        equipment: "Yoga mat",
        steps: [
            "Lie on back, knees bent, feet flat on floor",
            "Push through heels to lift hips toward ceiling",
            "Squeeze glutes HARD at the top for 2 seconds",
            "Lower slowly back down"
        ],
        mistakes: ["Using lower back instead of glutes", "Not squeezing at top", "Feet too far from butt"],
        feel: "Glutes firing, NOT lower back strain",
        easier: "Reduce range of motion",
        harder: "Single leg glute bridge",
        videoTip: "Imagine cracking a walnut between your butt cheeks at the top"
    },
    "Lunges": {
        difficulty: "Beginner",
        equipment: "None (use wall for balance if needed)",
        steps: [
            "Stand tall, take a big step forward",
            "Lower until both knees are at 90 degrees",
            "Front knee stays over ankle, not past toes",
            "Push through front heel to return to start"
        ],
        mistakes: ["Knee going past toes", "Leaning forward too much", "Short steps"],
        feel: "Front leg quad and glute, rear leg hip flexor stretch",
        easier: "Hold onto wall or chair for balance",
        harder: "Walking lunges or add dumbbells",
        videoTip: "Think 'down' not 'forward' - drop straight down"
    },
    "Plank": {
        difficulty: "Beginner",
        equipment: "Yoga mat",
        steps: [
            "Forearms on floor, elbows under shoulders",
            "Extend legs back, toes on floor",
            "Keep body in straight line from head to heels",
            "Hold position, breathing steadily"
        ],
        mistakes: ["Hips sagging low", "Butt too high", "Holding breath"],
        feel: "Entire core engaged - abs, obliques, lower back",
        easier: "Knees on the floor (half plank)",
        harder: "Lift one foot off the ground",
        videoTip: "Brace your abs like you're about to get punched"
    },
    "DB Rows": {
        difficulty: "Beginner",
        equipment: "2kg dumbbell + chair",
        steps: [
            "Place one hand and knee on chair for support",
            "Hold dumbbell in free hand, arm hanging down",
            "Pull dumbbell up toward hip, squeezing shoulder blade",
            "Lower slowly with control"
        ],
        mistakes: ["Rotating torso", "Using momentum", "Not pulling high enough"],
        feel: "Lats and mid-back squeezing",
        easier: "Both hands on table, row with lighter objects",
        harder: "Pause 2 seconds at top of each rep",
        videoTip: "Imagine starting a lawnmower - elbow drives back"
    },
    "Calf Raises": {
        difficulty: "Beginner",
        equipment: "Wall for balance",
        steps: [
            "Stand on flat floor, hand on wall for balance",
            "Rise up on the balls of your feet as high as possible",
            "Squeeze calves at the top for 1 second",
            "Lower slowly back down"
        ],
        mistakes: ["Not going high enough", "Rushing the movement", "Bending knees"],
        feel: "Calf muscles burning",
        easier: "Use both hands on wall for balance",
        harder: "Single leg calf raises",
        videoTip: "Pretend you're trying to see over a crowd"
    }
};

const routines = {
    1: { name: "Upper Push", subtitle: "Chest & Shoulders", icon: "💪", warmup: ["20 arm circles", "10 shoulder shrugs", "10 wall slides"], exercises: [{ id: "incline_pushups", name: "Incline Pushups", target: "3 x 10-12", type: "BW", tempo: "2-1-2", rest: 60 }, { id: "db_overhead_press", name: "DB Overhead Press", target: "3 x 12-15", type: "DB", weight: 2, tempo: "2-1-2", rest: 60 }, { id: "db_lateral_raises", name: "DB Lateral Raises", target: "3 x 12-15", type: "DB", weight: 2, tempo: "2-1-3", rest: 45 }], cooldown: ["30s chest stretch each side", "30s shoulder stretch each side"] },
    2: { name: "Lower Body", subtitle: "Legs & Glutes", icon: "🦵", warmup: ["20 leg swings each side", "10 hip circles", "10 bodyweight squats"], exercises: [{ id: "bodyweight_squats", name: "Bodyweight Squats", target: "3 x 15-20", type: "BW", tempo: "3-1-2", rest: 60 }, { id: "lunges", name: "Lunges", target: "3 x 10/leg", type: "BW", tempo: "2-1-1", rest: 60 }, { id: "glute_bridges", name: "Glute Bridges", target: "3 x 15", type: "BW", tempo: "2-2-1", rest: 45 }, { id: "calf_raises", name: "Calf Raises", target: "3 x 20", type: "BW", tempo: "2-1-2", rest: 30 }], cooldown: ["30s quad stretch each side", "30s hamstring stretch", "30s calf stretch each side"] },
    4: { name: "Upper Pull", subtitle: "Back & Biceps", icon: "🎯", warmup: ["10 cat-cow stretches", "20 arm circles", "10 scapular squeezes"], exercises: [{ id: "db_rows", name: "DB Rows", target: "3 x 12/arm", type: "DB", weight: 2, tempo: "2-1-3", rest: 60 }, { id: "db_bicep_curls", name: "DB Bicep Curls", target: "3 x 12-15", type: "DB", weight: 2, tempo: "2-1-3", rest: 45 }, { id: "plank", name: "Plank", target: "3 x 30-45s", type: "BW", rest: 45 }], cooldown: ["30s lat stretch each side", "30s bicep stretch", "30s lower back twist each side"] },
    5: { name: "Full Body", subtitle: "Compound Focus", icon: "⚡", warmup: ["Jumping jacks 30s", "Arm circles 20", "Leg swings 10 each"], exercises: [{ id: "knee_pushups", name: "Knee Pushups", target: "3 x 10-12", type: "BW", tempo: "2-1-2", rest: 60 }, { id: "bodyweight_squats2", name: "Bodyweight Squats", target: "3 x 15", type: "BW", tempo: "3-1-1", rest: 60 }, { id: "db_rows2", name: "DB Rows", target: "3 x 10/arm", type: "DB", weight: 2, tempo: "2-1-2", rest: 45 }, { id: "glute_bridges2", name: "Glute Bridges", target: "3 x 12", type: "BW", tempo: "2-2-1", rest: 45 }], cooldown: ["Full body stretch 2 minutes"] }
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ============================================================================
// REST TIMER COMPONENT
// ============================================================================
const RestTimer = ({ seconds, onComplete, onCancel }) => {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) {
            if (timeLeft <= 0) onComplete?.();
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isRunning, onComplete]);

    const circumference = 2 * Math.PI * 45;
    const progress = (timeLeft / seconds) * circumference;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm mx-4">
                <h3 className="text-lg font-bold text-slate-600 mb-4 uppercase tracking-wide">Rest Time</h3>
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-full h-full timer-ring">
                        <circle cx="64" cy="64" r="45" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                        <circle cx="64" cy="64" r="45" stroke="#39FF14" strokeWidth="8" fill="none"
                            strokeDasharray={circumference} strokeDashoffset={circumference - progress}
                            strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-black text-slate-900">{timeLeft}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setTimeLeft(t => t + 15)} className="flex-1 py-2 px-4 bg-slate-100 rounded-xl font-bold text-slate-600">+15s</button>
                    <button onClick={onCancel} className="flex-1 py-2 px-4 bg-slate-900 text-white rounded-xl font-bold">Skip</button>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// EXERCISE CARD COMPONENT
// ============================================================================
const ExerciseCard = ({ exercise, guide, history, onLog, inputValue, onInputChange, onStartRest, isCompleted }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`glass-card overflow-hidden transition-all duration-300 ${isCompleted ? 'border-neon-green bg-green-50/50 shadow-lg shadow-green-500/10' : ''}`}>
            {/* Header */}
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {guide?.difficulty === "Beginner" && (
                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">BEGINNER</span>
                            )}
                            {isCompleted && (
                                <span className="text-[10px] font-bold bg-neon-green text-slate-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle2 size={10} /> DONE
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900">{exercise.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-sm font-bold text-slate-900 bg-slate-200 px-3 py-1 rounded-full">{exercise.target}</span>
                            {exercise.tempo && <span className="text-xs text-slate-500 font-medium">Tempo: {exercise.tempo}</span>}
                        </div>
                    </div>
                    {/* Logged History / Status */}
                    <div className="text-right">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all mb-2 ml-auto
                                ${expanded ? 'bg-slate-200 text-slate-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                        >
                            <BookOpen size={14} /> {expanded ? "Hide Guide" : "Show Guide"}
                        </button>
                        <div className="bg-slate-50 px-3 py-2 rounded-xl inline-block">
                            <div className="text-[9px] font-bold text-slate-400 uppercase">Last Reps</div>
                            <div className="text-sm font-black text-slate-900">{history.lastReps || "-"}</div>
                        </div>
                    </div>
                </div>

                {/* Expanded Guide */}
                {expanded && guide && (
                    <div className="mt-4 space-y-4 animate-fade-in-up border-t border-slate-100 pt-4">
                        {/* Step by Step */}
                        <div className="bg-blue-50/80 rounded-xl p-4">
                            <h4 className="text-xs font-black text-blue-800 uppercase mb-3 flex items-center gap-2">
                                <Play size={14} /> Step-by-Step Instructions
                            </h4>
                            <ol className="space-y-3">
                                {guide.steps.map((step, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed relative">
                                        <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-800 flex-shrink-0 mt-0.5">{i + 1}</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Mistakes & Feel */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-amber-50/80 rounded-xl p-4">
                                <h4 className="text-xs font-black text-amber-800 uppercase mb-2 flex items-center gap-2">
                                    <AlertTriangle size={14} /> Avoid Mistakes
                                </h4>
                                <ul className="space-y-1">
                                    {guide.mistakes.map((m, i) => (
                                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                                            <span className="text-amber-500 text-lg leading-none">•</span> {m}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-purple-50/80 rounded-xl p-4">
                                <h4 className="text-xs font-black text-purple-800 uppercase mb-2 flex items-center gap-2">
                                    <Target size={14} /> Focus On
                                </h4>
                                <p className="text-sm text-slate-700 italic">"{guide.feel}"</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className={`p-4 md:p-6 pt-0 flex gap-3 ${isCompleted ? 'bg-green-50/50' : ''}`}>
                <input
                    type="number"
                    placeholder="Reps"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    className="flex-1 bg-white border-2 border-slate-100 rounded-xl py-3 px-4 text-slate-900 font-bold text-center text-lg focus:outline-none focus:ring-2 focus:ring-neon-green/30 focus:border-neon-green touch-target shadow-sm"
                />
                <button onClick={onLog} className={`px-6 rounded-xl font-bold transition-all active:scale-95 touch-target flex items-center gap-2 shadow-lg shadow-neon-green/20
                    ${isCompleted ? 'bg-neon-green text-slate-900 hover:bg-slate-900 hover:text-white' : 'bg-slate-900 text-white hover:bg-neon-green hover:text-slate-900'}`}>
                    <CheckCircle2 size={24} /> {isCompleted ? "Done" : "Log"}
                </button>
                {exercise.rest && (
                    <button onClick={() => onStartRest(exercise.rest)} className="px-4 bg-slate-100 text-slate-500 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-all touch-target">
                        <Clock size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN DASHBOARD
// ============================================================================
const Dashboard = ({ user, dailyLogs, workoutHistory, onUpdateFoodLog, onLogWorkout, onLogout, onOpenSettings }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [viewDate, setViewDate] = useState(new Date());
    const [inputs, setInputs] = useState({});
    const [activeTab, setActiveTab] = useState('workout');
    const [showCalendar, setShowCalendar] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [restTimer, setRestTimer] = useState(null);
    const [foodLogInput, setFoodLogInput] = useState("");
    const [isSavingFoodLog, setIsSavingFoodLog] = useState(false);

    const selDateObj = new Date(selectedDate);
    const dayOfWeek = selDateObj.getDay();
    const routine = routines[dayOfWeek];
    const isRestDay = !routine;
    const isSelectedToday = selectedDate === todayStr;

    const selectedDayLog = dailyLogs.find(l => l.date === selectedDate) || { foodLog: "", workoutCompleted: false, exercises: [] };
    const completedExercises = selectedDayLog.exercises || [];

    useEffect(() => {
        setFoodLogInput(selectedDayLog.foodLog || "");
    }, [selectedDate, selectedDayLog]);

    const calculateStreak = useCallback(() => {
        let streak = 0;
        const sorted = [...dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
        for (const log of sorted) {
            if (log.workoutCompleted) streak++;
            else break; // Break on gap? Or simple count? User data has 'streak'.
        }
        return streak;
    }, [dailyLogs]);

    const handleLog = (exercise) => {
        const val = inputs[exercise.id];
        if (!val) return;
        onLogWorkout(exercise.name, parseInt(val), exercise.weight || 0, selectedDate);
        setInputs(prev => ({ ...prev, [exercise.id]: '' }));
    };

    const handleSaveFoodLog = async () => {
        setIsSavingFoodLog(true);
        await onUpdateFoodLog(foodLogInput, selectedDate);
        setIsSavingFoodLog(false);
    };

    // Calendar & Progress Logic
    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const calendarDays = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => {
        return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
    })];

    const getDayStatus = (dateStr) => {
        if (!dateStr) return 'empty';
        const d = new Date(dateStr);
        const dayRoutine = routines[d.getDay()];
        const log = dailyLogs.find(l => l.date === dateStr);
        const isFuture = d > new Date(todayStr); // Only simple comparison needed
        const isToday = dateStr === todayStr;

        if (!dayRoutine) return 'rest'; // Rest day
        if (isFuture) return 'future';

        if (log?.workoutCompleted) return 'complete'; // Green

        // If it's today and not done, neutral/pending
        if (isToday) return 'pending';

        // If it's past and not done
        return 'missed'; // Red
    };

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans">
            {/* Rest Timer Modal */}
            {restTimer && <RestTimer seconds={restTimer} onComplete={() => setRestTimer(null)} onCancel={() => setRestTimer(null)} />}

            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-100 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">FITNESS<span className="text-neon-green">TRACKER</span></h1>
                        <p className="text-xs text-slate-500 font-medium">{isSelectedToday ? "Today" : selDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-neon-green font-black shadow-lg shadow-neon-green/20">
                            {user.streak || calculateStreak()}
                        </div>
                        <button onClick={() => setShowSidebar(true)} className="p-2"><Menu size={24} /></button>
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex-col p-6 z-50">
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">FITNESS<span className="text-neon-green">TRACKER</span></h1>
                    <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Beginner Program</p>
                </div>

                {/* Streak */}
                <div className="bg-slate-900 rounded-2xl p-5 mb-8 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-3 opacity-10"><Flame size={64} /></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-neon-green rounded-xl flex items-center justify-center text-slate-900 font-black text-2xl shadow-lg shadow-neon-green/50">
                            {user.streak || calculateStreak()}
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Current Streak</div>
                            <div className="font-bold text-lg">Days Active</div>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2"><Calendar size={18} className="text-slate-400" /> {fullMonthNames[viewMonth]} <span className="text-slate-400">{viewYear}</span></h3>
                        <div className="flex gap-1">
                            <button onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft size={18} /></button>
                            <button onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 gap-x-1 mb-2">
                        {dayNames.map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase">{d.slice(0, 2)}</div>)}
                    </div>
                    {/* Desktop Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((dateStr, idx) => {
                            if (!dateStr) return <div key={`e-${idx}`} />;
                            const status = getDayStatus(dateStr);
                            const isSelected = dateStr === selectedDate;

                            let bgClass = "bg-slate-50 text-slate-400 hover:bg-slate-100"; // Default/Future/Rest
                            if (status === 'complete') bgClass = "bg-green-100 text-green-700 font-bold border-2 border-green-200";
                            if (status === 'missed') bgClass = "bg-red-50 text-red-400 border-2 border-red-100";
                            if (status === 'pending') bgClass = "bg-slate-100 text-slate-600 border-2 border-dashed border-slate-300";
                            if (isSelected) bgClass = "bg-slate-900 text-white shadow-lg shadow-slate-900/40 transform scale-110 z-10";

                            return (
                                <button key={dateStr} onClick={() => setSelectedDate(dateStr)}
                                    className={`aspect-square rounded-xl text-xs flex items-center justify-center transition-all duration-200 ${bgClass}`}>
                                    {parseInt(dateStr.split('-')[2])}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* Mobile Calendar Modal (Simplified logic reusing desktop classes roughly) */}
            {showCalendar && (
                <div className="fixed inset-0 z-[100] md:hidden flex items-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCalendar(false)} />
                    <div className="relative bg-white rounded-t-3xl w-full p-6 pb-10 animate-fade-in-up safe-bottom">
                        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
                        {/* Calendar controls same as desktop... */}
                        <div className="grid grid-cols-7 gap-3">
                            {calendarDays.map((dateStr, idx) => {
                                if (!dateStr) return <div key={`e-${idx}`} />;
                                const status = getDayStatus(dateStr);
                                const isSelected = dateStr === selectedDate;
                                let bgClass = "bg-slate-50 text-slate-400";
                                if (status === 'complete') bgClass = "bg-green-100 text-green-700 border border-green-200";
                                if (status === 'missed') bgClass = "bg-red-50 text-red-400 border border-red-100";
                                if (status === 'pending') bgClass = "bg-white border-2 border-dashed border-slate-200";
                                if (isSelected) bgClass = "bg-slate-900 text-white shadow-xl scale-110 z-10";

                                return (
                                    <button key={dateStr} onClick={() => { setSelectedDate(dateStr); setShowCalendar(false); }}
                                        className={`aspect-square rounded-xl text-sm font-bold flex items-center justify-center ${bgClass}`}>
                                        {parseInt(dateStr.split('-')[2])}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="md:ml-72 px-4 md:px-12 py-8 md:py-12 max-w-5xl mx-auto">
                {/* Session Header */}
                <header className="mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-px w-8 bg-neon-green"></span>
                        <p className="text-xs text-neon-green font-bold uppercase tracking-widest">
                            {isSelectedToday ? "Today's Target" : selDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        {isRestDay ? "Active Recovery" : routine.name}
                        {getDayStatus(selectedDate) === 'complete' && <CheckCircle2 className="text-green-500" size={32} />}
                    </h2>
                    {!isRestDay && <p className="text-slate-500 font-medium mt-2 text-lg">{routine.subtitle}</p>}
                </header>

                {activeTab === 'workout' && (
                    <>
                        {isRestDay ? (
                            <div className="glass-card p-12 text-center border-dashed border-2 border-slate-200 bg-white/50">
                                <Award size={80} className="mx-auto text-slate-200 mb-6" />
                                <h3 className="text-2xl font-bold text-slate-400 mb-3">Rest & Grow</h3>
                                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">Your muscles repair and grow stronger while you sleep and rest. Take it easy today!</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Warmup */}
                                <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
                                    <h4 className="text-xs font-black text-orange-600 uppercase mb-4 flex items-center gap-2 tracking-wide">
                                        <Flame size={16} /> Warmup Required
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {routine.warmup.map((w, i) => (
                                            <span key={i} className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-600 shadow-sm border border-slate-100">
                                                {w}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Exercises */}
                                {routine.exercises.map((ex, idx) => {
                                    const guide = EXERCISE_GUIDE[ex.name];
                                    const history = workoutHistory[ex.name] || { lastReps: 0 };
                                    const isCompleted = completedExercises.includes(ex.name);

                                    return (
                                        <div key={ex.id} className={`stagger-${idx + 1}`} style={{ animationFillMode: 'forwards' }}>
                                            <ExerciseCard
                                                exercise={ex}
                                                guide={guide}
                                                history={history}
                                                isCompleted={isCompleted}
                                                inputValue={inputs[ex.id] || ''}
                                                onInputChange={(val) => setInputs(prev => ({ ...prev, [ex.id]: val }))}
                                                onLog={() => handleLog(ex)}
                                                onStartRest={(secs) => setRestTimer(secs)}
                                            />
                                        </div>
                                    );
                                })}

                                {/* Cooldown */}
                                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mt-8">
                                    <h4 className="text-xs font-black text-blue-600 uppercase mb-4 flex items-center gap-2 tracking-wide">
                                        <Award size={16} /> Cooldown Stretches
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {routine.cooldown.map((c, i) => (
                                            <span key={i} className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-600 shadow-sm border border-slate-100">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Nutrition Tab... (Keep simple) */}
                {activeTab === 'nutrition' && (
                    <div className="glass-card p-8">
                        {/* ... Existing Nutrition UI ... */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-orange-100 rounded-xl text-orange-600"><Flame size={24} /></div>
                            <div>
                                <h3 className="font-bold text-xl text-slate-900">Nutrition Log</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase">Fuel Your Growth</p>
                            </div>
                        </div>
                        <textarea
                            value={foodLogInput}
                            onChange={(e) => setFoodLogInput(e.target.value)}
                            placeholder="Log your meals..."
                            className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-neon-green/30 focus:border-neon-green resize-none text-lg font-medium"
                        />
                        <button onClick={handleSaveFoodLog} disabled={isSavingFoodLog}
                            className="w-full mt-4 py-4 rounded-xl font-bold bg-slate-900 text-white hover:bg-neon-green hover:text-slate-900 transition-all">
                            {isSavingFoodLog ? 'Saving...' : 'Save Nutrition Log'}
                        </button>
                    </div>
                )}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around py-1 safe-bottom z-40">
                <button onClick={() => setActiveTab('workout')} className={`flex flex-col items-center p-3 rounded-xl transition-all ${activeTab === 'workout' ? 'text-neon-green bg-slate-50' : 'text-slate-400'}`}>
                    <Dumbbell size={24} />
                </button>
                <button onClick={() => setShowCalendar(true)} className="flex flex-col items-center p-3 text-slate-400 active:scale-95 transition-transform">
                    <Calendar size={24} />
                </button>
                <button onClick={() => setActiveTab('nutrition')} className={`flex flex-col items-center p-3 rounded-xl transition-all ${activeTab === 'nutrition' ? 'text-neon-green bg-slate-50' : 'text-slate-400'}`}>
                    <Flame size={24} />
                </button>
            </nav>
        </div>
    );
};

export default Dashboard;
