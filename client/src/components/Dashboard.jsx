import React, { useState, useEffect, useCallback } from 'react';
import {
    CheckCircle2, History, Dumbbell, ChevronLeft, ChevronRight, Calendar,
    Award, Info, X, MessageSquare, LogOut, Settings, Flame, Target, Zap,
    TrendingUp, AlertTriangle, Play, Clock, Home, Menu, ChevronDown, ChevronUp
} from 'lucide-react';

// ============================================================================
// BEGINNER-FOCUSED EXERCISE DATA
// ============================================================================

const EXERCISE_GUIDE = {
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

// 3-Month Progressive Program
const PROGRAM_PHASES = {
    1: { name: "Foundation", focus: "Learn proper form", reps: "12-15", weeks: "1-4" },
    2: { name: "Growth", focus: "Build volume", reps: "10-12", weeks: "5-8" },
    3: { name: "Intensity", focus: "Maximize tension", reps: "8-10", weeks: "9-12" }
};

const routines = {
    1: {
        name: "Upper Push",
        subtitle: "Chest & Shoulders",
        icon: "💪",
        warmup: ["20 arm circles", "10 shoulder shrugs", "10 wall slides"],
        exercises: [
            { id: "incline_pushups", name: "Incline Pushups", target: "3 x 10-12", type: "BW", tempo: "2-1-2", rest: 60 },
            { id: "db_overhead_press", name: "DB Overhead Press", target: "3 x 12-15", type: "DB", weight: 2, tempo: "2-1-2", rest: 60 },
            { id: "db_lateral_raises", name: "DB Lateral Raises", target: "3 x 12-15", type: "DB", weight: 2, tempo: "2-1-3", rest: 45 },
        ],
        cooldown: ["30s chest stretch each side", "30s shoulder stretch each side"]
    },
    2: {
        name: "Lower Body",
        subtitle: "Legs & Glutes",
        icon: "🦵",
        warmup: ["20 leg swings each side", "10 hip circles", "10 bodyweight squats"],
        exercises: [
            { id: "bodyweight_squats", name: "Bodyweight Squats", target: "3 x 15-20", type: "BW", tempo: "3-1-2", rest: 60 },
            { id: "lunges", name: "Lunges", target: "3 x 10/leg", type: "BW", tempo: "2-1-1", rest: 60 },
            { id: "glute_bridges", name: "Glute Bridges", target: "3 x 15", type: "BW", tempo: "2-2-1", rest: 45 },
            { id: "calf_raises", name: "Calf Raises", target: "3 x 20", type: "BW", tempo: "2-1-2", rest: 30 },
        ],
        cooldown: ["30s quad stretch each side", "30s hamstring stretch", "30s calf stretch each side"]
    },
    4: {
        name: "Upper Pull",
        subtitle: "Back & Biceps",
        icon: "🎯",
        warmup: ["10 cat-cow stretches", "20 arm circles", "10 scapular squeezes"],
        exercises: [
            { id: "db_rows", name: "DB Rows", target: "3 x 12/arm", type: "DB", weight: 2, tempo: "2-1-3", rest: 60 },
            { id: "db_bicep_curls", name: "DB Bicep Curls", target: "3 x 12-15", type: "DB", weight: 2, tempo: "2-1-3", rest: 45 },
            { id: "plank", name: "Plank", target: "3 x 30-45s", type: "BW", rest: 45 },
        ],
        cooldown: ["30s lat stretch each side", "30s bicep stretch", "30s lower back twist each side"]
    },
    5: {
        name: "Full Body",
        subtitle: "Compound Focus",
        icon: "⚡",
        warmup: ["Jumping jacks 30s", "Arm circles 20", "Leg swings 10 each"],
        exercises: [
            { id: "knee_pushups", name: "Knee Pushups", target: "3 x 10-12", type: "BW", tempo: "2-1-2", rest: 60 },
            { id: "bodyweight_squats2", name: "Bodyweight Squats", target: "3 x 15", type: "BW", tempo: "3-1-1", rest: 60 },
            { id: "db_rows2", name: "DB Rows", target: "3 x 10/arm", type: "DB", weight: 2, tempo: "2-1-2", rest: 45 },
            { id: "glute_bridges2", name: "Glute Bridges", target: "3 x 12", type: "BW", tempo: "2-2-1", rest: 45 },
        ],
        cooldown: ["Full body stretch 2 minutes"]
    }
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
                <p className="text-slate-500 text-sm mb-4">Get ready for the next set!</p>
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

const ExerciseCard = ({ exercise, guide, history, onLog, inputValue, onInputChange, onStartRest }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="glass-card overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {guide?.difficulty === "Beginner" && (
                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">BEGINNER</span>
                            )}
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{exercise.type === "DB" ? "2kg DBs" : "Bodyweight"}</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900">{exercise.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-sm font-bold text-neon-green bg-neon-green/10 px-3 py-1 rounded-full">{exercise.target}</span>
                            {exercise.tempo && <span className="text-xs text-slate-500 font-medium">Tempo: {exercise.tempo}</span>}
                        </div>
                    </div>
                    <div className="text-right bg-slate-50 px-3 py-2 rounded-xl">
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Last</div>
                        <div className="text-sm font-black text-slate-900">{history.lastReps || "-"}</div>
                    </div>
                </div>

                {/* Expand/Collapse Guide */}
                <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl mt-3 touch-target">
                    <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
                        <Info size={14} /> How to do this exercise
                    </span>
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {/* Expanded Guide */}
                {expanded && guide && (
                    <div className="mt-4 space-y-4 animate-fade-in-up">
                        {/* Step by Step */}
                        <div className="bg-blue-50 rounded-xl p-4">
                            <h4 className="text-xs font-black text-blue-800 uppercase mb-2 flex items-center gap-2">
                                <Play size={12} /> Step-by-Step
                            </h4>
                            <ol className="space-y-2">
                                {guide.steps.map((step, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                                        <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 flex-shrink-0">{i + 1}</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Common Mistakes */}
                        <div className="bg-amber-50 rounded-xl p-4">
                            <h4 className="text-xs font-black text-amber-800 uppercase mb-2 flex items-center gap-2">
                                <AlertTriangle size={12} /> Common Mistakes
                            </h4>
                            <ul className="space-y-1">
                                {guide.mistakes.map((m, i) => (
                                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                        <span className="text-amber-500">•</span> {m}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* What You Should Feel */}
                        <div className="bg-purple-50 rounded-xl p-4">
                            <h4 className="text-xs font-black text-purple-800 uppercase mb-2 flex items-center gap-2">
                                <Target size={12} /> What You Should Feel
                            </h4>
                            <p className="text-sm text-slate-700">{guide.feel}</p>
                        </div>

                        {/* Easier/Harder */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-green-50 rounded-xl p-3">
                                <h4 className="text-[10px] font-black text-green-700 uppercase mb-1">📉 Too Hard?</h4>
                                <p className="text-xs text-slate-600">{guide.easier}</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-3">
                                <h4 className="text-[10px] font-black text-red-700 uppercase mb-1">📈 Too Easy?</h4>
                                <p className="text-xs text-slate-600">{guide.harder}</p>
                            </div>
                        </div>

                        {/* Pro Tip */}
                        <div className="bg-slate-100 rounded-xl p-3 flex items-start gap-2">
                            <Zap size={14} className="text-neon-green flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-600"><strong>Pro Tip:</strong> {guide.videoTip}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className="p-4 md:p-6 pt-0 flex gap-3">
                <input
                    type="number"
                    placeholder="Reps done"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 text-slate-900 font-bold text-center text-lg focus:outline-none focus:ring-2 focus:ring-neon-green/30 focus:border-neon-green touch-target"
                />
                <button onClick={onLog} className="px-5 bg-slate-900 text-white rounded-xl hover:bg-neon-green hover:text-black transition-all active:scale-95 touch-target">
                    <CheckCircle2 size={24} />
                </button>
                {exercise.rest && (
                    <button onClick={() => onStartRest(exercise.rest)} className="px-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all touch-target">
                        <Clock size={20} />
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

    const selectedDayLog = dailyLogs.find(l => l.date === selectedDate) || { foodLog: "", workoutCompleted: false };

    useEffect(() => {
        setFoodLogInput(selectedDayLog.foodLog || "");
    }, [selectedDate, selectedDayLog.foodLog]);

    const calculateStreak = useCallback(() => {
        let streak = 0;
        const sorted = [...dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
        for (const log of sorted) {
            if (log.workoutCompleted) streak++;
            else break;
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

    // Calendar
    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const calendarDays = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => {
        return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
    })];

    const workoutsThisMonth = dailyLogs.filter(log => {
        const d = new Date(log.date);
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth && log.workoutCompleted;
    }).length;

    return (
        <div className="min-h-screen pb-20 md:pb-0">
            {/* Rest Timer Modal */}
            {restTimer && <RestTimer seconds={restTimer} onComplete={() => setRestTimer(null)} onCancel={() => setRestTimer(null)} />}

            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-100 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-black text-slate-900">Fitness Tracker</h1>
                        <p className="text-xs text-slate-500">{isSelectedToday ? "Today" : selDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center text-neon-green font-black">
                            {user.streak || calculateStreak()}
                        </div>
                        <button onClick={() => setShowSidebar(true)} className="p-2"><Menu size={24} /></button>
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex-col p-5 z-50">
                <div className="mb-6">
                    <h1 className="text-xl font-black text-slate-900">Personal<br /><span className="text-neon-green">Fitness Tracker</span></h1>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">3-Month Home Program</p>
                </div>

                {/* Streak */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 mb-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-neon-green rounded-full flex items-center justify-center text-slate-900 font-black text-2xl">
                            {user.streak || calculateStreak()}
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 uppercase">Current Streak</div>
                            <div className="font-bold">Days Active</div>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex-grow overflow-auto">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2"><Calendar size={16} className="text-neon-green" />{fullMonthNames[viewMonth]}</h3>
                        <div className="flex gap-1">
                            <button onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))} className="p-1 hover:bg-white rounded"><ChevronLeft size={16} /></button>
                            <button onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))} className="p-1 hover:bg-white rounded"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-slate-400 mb-2">
                        {dayNames.map(d => <div key={d}>{d[0]}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((dateStr, idx) => {
                            if (!dateStr) return <div key={`e-${idx}`} />;
                            const isSelected = dateStr === selectedDate;
                            const isToday = dateStr === todayStr;
                            const hasWorkout = dailyLogs.find(l => l.date === dateStr)?.workoutCompleted;
                            return (
                                <button key={dateStr} onClick={() => setSelectedDate(dateStr)}
                                    className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all
                                        ${isSelected ? 'bg-slate-900 text-white' : isToday ? 'bg-neon-green text-slate-900' : hasWorkout ? 'bg-neon-green/20' : 'hover:bg-white'}`}>
                                    {parseInt(dateStr.split('-')[2])}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-slate-500 mt-3 text-center">{workoutsThisMonth} workouts this month</p>
                </div>

                {/* Nav */}
                <div className="space-y-2 mt-auto">
                    <button onClick={onOpenSettings} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-500">
                        <Settings size={18} /><span className="text-sm font-bold">Settings</span>
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600">
                        <LogOut size={18} /><span className="text-sm font-bold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {showSidebar && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
                    <div className="absolute right-0 top-0 h-full w-72 bg-white p-5 animate-slide-in-right">
                        <button onClick={() => setShowSidebar(false)} className="absolute top-4 right-4"><X size={24} /></button>
                        <h2 className="text-lg font-bold mb-6 mt-8">Menu</h2>
                        <div className="space-y-3">
                            <button onClick={() => { setShowCalendar(true); setShowSidebar(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
                                <Calendar size={18} /><span className="font-bold">Calendar</span>
                            </button>
                            <button onClick={onOpenSettings} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50">
                                <Settings size={18} /><span className="font-bold">Settings</span>
                            </button>
                            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600">
                                <LogOut size={18} /><span className="font-bold">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Calendar Modal */}
            {showCalendar && (
                <div className="fixed inset-0 z-[100] md:hidden flex items-end">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCalendar(false)} />
                    <div className="relative bg-white rounded-t-3xl w-full p-6 pb-10 animate-fade-in-up safe-bottom">
                        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">{fullMonthNames[viewMonth]} {viewYear}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))} className="p-2 bg-slate-100 rounded-lg"><ChevronLeft size={18} /></button>
                                <button onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))} className="p-2 bg-slate-100 rounded-lg"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
                            {dayNames.map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((dateStr, idx) => {
                                if (!dateStr) return <div key={`e-${idx}`} />;
                                const isSelected = dateStr === selectedDate;
                                const isToday = dateStr === todayStr;
                                const hasWorkout = dailyLogs.find(l => l.date === dateStr)?.workoutCompleted;
                                return (
                                    <button key={dateStr} onClick={() => { setSelectedDate(dateStr); setShowCalendar(false); }}
                                        className={`aspect-square rounded-xl text-sm font-bold flex items-center justify-center
                                            ${isSelected ? 'bg-slate-900 text-white' : isToday ? 'bg-neon-green text-slate-900' : hasWorkout ? 'bg-neon-green/20' : 'bg-slate-50'}`}>
                                        {parseInt(dateStr.split('-')[2])}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="md:ml-72 px-4 md:px-8 py-6">
                <div className="max-w-3xl mx-auto">
                    {/* Session Header */}
                    <header className="mb-8">
                        <p className="text-sm text-neon-green font-bold uppercase tracking-wide mb-1">
                            {isSelectedToday ? "Today's Workout" : selDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
                            {isRestDay ? "🧘 Recovery Day" : `${routine.icon} ${routine.name}`}
                        </h2>
                        {!isRestDay && <p className="text-slate-500 font-medium mt-1">{routine.subtitle}</p>}
                    </header>

                    {activeTab === 'workout' && (
                        <>
                            {isRestDay ? (
                                <div className="glass-card p-8 md:p-12 text-center">
                                    <Award size={64} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-2xl font-bold text-slate-400 mb-2">Rest & Recover</h3>
                                    <p className="text-slate-500 max-w-md mx-auto">Your muscles grow during rest! Focus on sleep, nutrition, and light stretching today.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Warmup */}
                                    <div className="glass-card p-4">
                                        <h4 className="text-xs font-black text-orange-600 uppercase mb-2 flex items-center gap-2"><Flame size={14} /> Warmup (2-3 min)</h4>
                                        <ul className="text-sm text-slate-600 space-y-1">
                                            {routine.warmup.map((w, i) => <li key={i}>• {w}</li>)}
                                        </ul>
                                    </div>

                                    {/* Exercises */}
                                    {routine.exercises.map((ex, idx) => {
                                        const guide = EXERCISE_GUIDE[ex.name];
                                        const history = workoutHistory[ex.name] || { lastReps: 0 };
                                        return (
                                            <div key={ex.id} className={`stagger-${idx + 1}`} style={{ opacity: 0, animationFillMode: 'forwards' }}>
                                                <ExerciseCard
                                                    exercise={ex}
                                                    guide={guide}
                                                    history={history}
                                                    inputValue={inputs[ex.id] || ''}
                                                    onInputChange={(val) => setInputs(prev => ({ ...prev, [ex.id]: val }))}
                                                    onLog={() => handleLog(ex)}
                                                    onStartRest={(secs) => setRestTimer(secs)}
                                                />
                                            </div>
                                        );
                                    })}

                                    {/* Cooldown */}
                                    <div className="glass-card p-4">
                                        <h4 className="text-xs font-black text-blue-600 uppercase mb-2 flex items-center gap-2"><Award size={14} /> Cooldown Stretches</h4>
                                        <ul className="text-sm text-slate-600 space-y-1">
                                            {routine.cooldown.map((c, i) => <li key={i}>• {c}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'nutrition' && (
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Flame className="text-orange-500" /> Nutrition Log</h3>
                            <textarea
                                value={foodLogInput}
                                onChange={(e) => setFoodLogInput(e.target.value)}
                                placeholder="Log your meals today... (aim for 1.6-2.2g protein per kg bodyweight)"
                                className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-neon-green/30 focus:border-neon-green resize-none"
                            />
                            <button onClick={handleSaveFoodLog} disabled={isSavingFoodLog}
                                className={`w-full mt-4 py-3 rounded-xl font-bold transition-all ${isSavingFoodLog ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-neon-green hover:text-slate-900'}`}>
                                {isSavingFoodLog ? 'Saving...' : 'Save Log'}
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around py-2 safe-bottom z-40">
                <button onClick={() => setActiveTab('workout')} className={`flex flex-col items-center p-2 ${activeTab === 'workout' ? 'text-neon-green' : 'text-slate-400'}`}>
                    <Dumbbell size={22} /><span className="text-[10px] font-bold mt-1">Workout</span>
                </button>
                <button onClick={() => setShowCalendar(true)} className="flex flex-col items-center p-2 text-slate-400">
                    <Calendar size={22} /><span className="text-[10px] font-bold mt-1">Calendar</span>
                </button>
                <button onClick={() => setActiveTab('nutrition')} className={`flex flex-col items-center p-2 ${activeTab === 'nutrition' ? 'text-neon-green' : 'text-slate-400'}`}>
                    <Flame size={22} /><span className="text-[10px] font-bold mt-1">Nutrition</span>
                </button>
                <button onClick={() => setShowSidebar(true)} className="flex flex-col items-center p-2 text-slate-400">
                    <Settings size={22} /><span className="text-[10px] font-bold mt-1">More</span>
                </button>
            </nav>
        </div>
    );
};

export default Dashboard;
