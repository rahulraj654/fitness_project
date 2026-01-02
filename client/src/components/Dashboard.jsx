import React, { useState, useEffect, useCallback } from 'react';
import {
    CheckCircle2, History, Dumbbell, ChevronLeft, ChevronRight, Calendar,
    Award, Info, X, MessageSquare, LogOut, Settings, Flame, Target, Zap,
    TrendingUp, AlertTriangle, Play, Clock, Home, Menu, ChevronDown, ChevronUp,
    BookOpen, CheckSquare, HelpCircle, Lightbulb
} from 'lucide-react';

// ============================================================================
// DATA & CONTENT
// ============================================================================

const GLOSSARY = {
    "Reps": "Repetitions. One complete movement of an exercise (e.g., one pushup).",
    "Sets": "A group of reps performed back-to-back without resting.",
    "Tempo": "The speed of movement. '3-1-1' means: 3s lowering, 1s pause at bottom, 1s lifting.",
    "Rest": "Time spent recovering between sets to allow muscles to recharge.",
    "Failure": "The point where you cannot complete another rep with good form.",
    "Hypertrophy": "Muscle growth. Best achieved with controlled reps and feeling the burn.",
    "Compound": "Exercises that use multiple joints/muscles (e.g., Squats).",
    "Isolation": "Exercises that focus on one muscle (e.g., Bicep Curls)."
};

const DAILY_BRIEFINGS = {
    "Upper Push": {
        focus: "Control & Chest Tension",
        do: ["Keep your shoulders down (away from ears)", "Control the 'down' phase (3 seconds)", "Squeeze your chest at the top"],
        dont: ["Don't rush the reps", "Don't flare your elbows out wide", "Don't arch your lower back excessively"]
    },
    "Lower Body": {
        focus: "Leg Power & Stability",
        do: ["Push through your heels", "Keep your knees in line with your toes", "Brace your core before every rep"],
        dont: ["Don't let knees cave inward", "Don't lift your heels off the ground", "Don't round your back"]
    },
    "Upper Pull": {
        focus: "Back Squeeze & Posture",
        do: ["Lead with your elbows", "Squeeze your shoulder blades together", "Keep your chest proud"],
        dont: ["Don't shrug your shoulders", "Don't swing your body to lift weights", "Don't just use your arms"]
    },
    "Full Body": {
        focus: "Efficiency & Total Body",
        do: ["Move smoothly from one exercise to next", "Maintain perfect form even when tired", "Breathe rhythmically"],
        dont: ["Don't hold your breath", "Don't skip the rest periods", "Don't sacrifice form for speed"]
    }
};

const EXERCISE_GUIDE = {
    "Wall Pushups": {
        difficulty: "Beginner",
        steps: ["Stand arm's length from a wall", "Place palms flat on wall at shoulder height", "Lean in, bending elbows", "Push back to start"],
        mistakes: ["Standing too close to wall", "Flaring elbows out wide", "Not engaging core"],
        feel: "Chest and front shoulders working",
        easier: "Stand closer to the wall",
        harder: "Progress to incline pushups",
        videoTip: "Keep body straight like a plank"
    },
    "Incline Pushups": {
        difficulty: "Beginner",
        steps: ["Hands on table edge, shoulder-width", "Walk feet back for straight body", "Lower chest to edge", "Push back up"],
        mistakes: ["Sagging hips", "Looking up/down (keep neutral)", "Rushing"],
        feel: "Chest stretch at bottom, triceps on push",
        easier: "Use a higher surface",
        harder: "Knee pushups on floor",
        videoTip: "Elbows at 45° angle, not flared"
    },
    "Knee Pushups": {
        difficulty: "Beginner",
        steps: ["Hands and knees on mat", "Cross ankles, lift feet", "Lower chest slowly (3s)", "Push up"],
        mistakes: ["Hips too high", "Not going low enough", "Rushing"],
        feel: "Chest burning, triceps engaged",
        easier: "Reduce range of motion",
        harder: "Try regular pushups",
        videoTip: "Push the floor away from you"
    },
    "DB Bicep Curls": {
        difficulty: "Beginner",
        steps: ["Stand, dumbbells at sides", "Elbows pinned to ribs", "Curl weights to shoulders", "Lower slowly (3s)"],
        mistakes: ["Swinging body", "Moving elbows forward", "Dropping weight fast"],
        feel: "Biceps burning at top",
        easier: "One arm at a time",
        harder: "Squeeze 2s at top",
        videoTip: "Slow negatives = growth"
    },
    "DB Lateral Raises": {
        difficulty: "Beginner",
        steps: ["Stand tall, weights at sides", "Raise arms to sides (shoulder height)", "Slight elbow bend", "Lower slowly"],
        mistakes: ["Swinging", "Shrugging shoulders", "Lifting too high"],
        feel: "Available in side shoulders",
        easier: "Raise to 45°",
        harder: "Pause 1s at top",
        videoTip: "Lead with elbows, pour the pitcher"
    },
    "DB Overhead Press": {
        difficulty: "Beginner",
        steps: ["Weights at shoulder height", "Press straight up", "Extend arms fully", "Lower with control"],
        mistakes: ["Arching back", "Pressing forward", "Half range"],
        feel: "Shoulders working hard",
        easier: "Seated support",
        harder: "Single arm press",
        videoTip: "Brace core tight"
    },
    "Bodyweight Squats": {
        difficulty: "Beginner",
        steps: ["Feet shoulder-width", "Push hips back, bend knees", "Lower until thighs parallel", "Drive up through heels"],
        mistakes: ["Knees caving in", "Heels lifting", "Not deep enough"],
        feel: "Quads and glutes",
        easier: "Squat to chair",
        harder: "3s lowering phase",
        videoTip: "Knees out over toes"
    },
    "Glute Bridges": {
        difficulty: "Beginner",
        steps: ["Lie on back, knees bent", "Lift hips high", "Squeeze glutes 2s", "Lower slowly"],
        mistakes: ["Using lower back", "Not squeezing", "Feet position"],
        feel: "Glutes firing",
        easier: "Smaller range",
        harder: "Single leg bridge",
        videoTip: "Crack a walnut w/ glutes"
    },
    "Lunges": {
        difficulty: "Beginner",
        steps: ["Step forward big step", "Lower both knees to 90°", "Keep torso upright", "Push back to start"],
        mistakes: ["Knee past toes", "Leaning forward", "Short step"],
        feel: "Legs burning",
        easier: "Hold wall for balance",
        harder: "Walking lunges",
        videoTip: "Drop straight down"
    },
    "Plank": {
        difficulty: "Beginner",
        steps: ["Forearms on floor", "Legs straight back", "Straight line head to heels", "Hold and breathe"],
        mistakes: ["Hips sagging", "Butt high", "Holding breath"],
        feel: "Core shaking/working",
        easier: "Knees on floor",
        harder: "Lift one foot",
        videoTip: "Brace for a punch"
    },
    "DB Rows": {
        difficulty: "Beginner",
        steps: ["Hand/knee on chair", "Other hand holds weight", "Pull weight to hip", "Lower slowly"],
        mistakes: ["Rotating torso", "Momentum", "Pulling too high"],
        feel: "Back muscles",
        easier: "Lighter weight object",
        harder: "Pause at top",
        videoTip: "Elbow drives back"
    },
    "Calf Raises": {
        difficulty: "Beginner",
        steps: ["Stand, hand on wall", "Rise high on toes", "Squeeze 1s", "Lower slowly"],
        mistakes: ["Bouncing", "Not high enough", "Bent knees"],
        feel: "Calves burning",
        easier: "Two hands on wall",
        harder: "Single leg",
        videoTip: "See over a crowd"
    }
};

const routines = {
    1: { name: "Upper Push", subtitle: "Chest & Shoulders", icon: "💪", warmup: ["20 arm circles", "10 shoulder shrugs", "10 wall slides"], exercises: [{ id: "incline_pushups", name: "Incline Pushups", target: "3 x 10-12", sets: 3, reps: "10-12", type: "BW", tempo: "2-1-2", rest: 60 }, { id: "db_overhead_press", name: "DB Overhead Press", target: "3 x 12-15", sets: 3, reps: "12-15", type: "DB", weight: 2, tempo: "2-1-2", rest: 60 }, { id: "db_lateral_raises", name: "DB Lateral Raises", target: "3 x 12-15", sets: 3, reps: "12-15", type: "DB", weight: 2, tempo: "2-1-3", rest: 45 }], cooldown: ["30s chest stretch each side", "30s shoulder stretch each side"] },
    2: { name: "Lower Body", subtitle: "Legs & Glutes", icon: "🦵", warmup: ["20 leg swings each side", "10 hip circles", "10 bodyweight squats"], exercises: [{ id: "bodyweight_squats", name: "Bodyweight Squats", target: "3 x 15-20", sets: 3, reps: "15-20", type: "BW", tempo: "3-1-2", rest: 60 }, { id: "lunges", name: "Lunges", target: "3 x 10/leg", sets: 3, reps: "10 each", type: "BW", tempo: "2-1-1", rest: 60 }, { id: "glute_bridges", name: "Glute Bridges", target: "3 x 15", sets: 3, reps: "15", type: "BW", tempo: "2-2-1", rest: 45 }, { id: "calf_raises", name: "Calf Raises", target: "3 x 20", sets: 3, reps: "20", type: "BW", tempo: "2-1-2", rest: 30 }], cooldown: ["30s quad stretch each side", "30s hamstring stretch", "30s calf stretch each side"] },
    4: { name: "Upper Pull", subtitle: "Back & Biceps", icon: "🎯", warmup: ["10 cat-cow stretches", "20 arm circles", "10 scapular squeezes"], exercises: [{ id: "db_rows", name: "DB Rows", target: "3 x 12/arm", sets: 3, reps: "12 each", type: "DB", weight: 2, tempo: "2-1-3", rest: 60 }, { id: "db_bicep_curls", name: "DB Bicep Curls", target: "3 x 12-15", sets: 3, reps: "12-15", type: "DB", weight: 2, tempo: "2-1-3", rest: 45 }, { id: "plank", name: "Plank", target: "3 x 30-45s", sets: 3, reps: "30-45s", type: "BW", rest: 45 }], cooldown: ["30s lat stretch each side", "30s bicep stretch", "30s lower back twist each side"] },
    5: { name: "Full Body", subtitle: "Compound Focus", icon: "⚡", warmup: ["Jumping jacks 30s", "Arm circles 20", "Leg swings 10 each"], exercises: [{ id: "knee_pushups", name: "Knee Pushups", target: "3 x 10-12", sets: 3, reps: "10-12", type: "BW", tempo: "2-1-2", rest: 60 }, { id: "bodyweight_squats2", name: "Bodyweight Squats", target: "3 x 15", sets: 3, reps: "15", type: "BW", tempo: "3-1-1", rest: 60 }, { id: "db_rows2", name: "DB Rows", target: "3 x 10/arm", sets: 3, reps: "10 each", type: "DB", weight: 2, tempo: "2-1-2", rest: 45 }, { id: "glute_bridges2", name: "Glute Bridges", target: "3 x 12", sets: 3, reps: "12", type: "BW", tempo: "2-2-1", rest: 45 }], cooldown: ["Full body stretch 2 minutes"] }
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ============================================================================
// COMPONENTS
// ============================================================================

const GlossaryModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative z-10 animate-fade-in-up shadow-2xl overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full"><X size={20} /></button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-neon-green/20 text-green-700 rounded-xl"><BookOpen size={24} /></div>
                    <h3 className="text-xl font-black text-slate-900">Fitness Terms</h3>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {Object.entries(GLOSSARY).map(([term, def]) => (
                        <div key={term} className="bg-slate-50 p-4 rounded-2xl">
                            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-neon-green rounded-full" /> {term}
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{def}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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

const DailyBriefing = ({ routineName, briefing, onOpenGlossary }) => {
    if (!briefing) return null;
    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/10 rounded-full blur-3xl -translate-y-10 translate-x-10" />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-neon-green text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Today's Focus</span>
                    </div>
                    <h3 className="text-2xl font-black text-white">{briefing.focus}</h3>
                </div>
                <button onClick={onOpenGlossary} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl backdrop-blur-md transition-colors">
                    <HelpCircle size={20} className="text-neon-green" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h4 className="text-xs font-black text-green-400 uppercase mb-3 flex items-center gap-2"><CheckCircle2 size={14} /> Do This</h4>
                    <ul className="space-y-2">
                        {briefing.do.map((d, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><span className="text-green-500">•</span> {d}</li>)}
                    </ul>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h4 className="text-xs font-black text-red-400 uppercase mb-3 flex items-center gap-2"><X size={14} /> Avoid This</h4>
                    <ul className="space-y-2">
                        {briefing.dont.map((d, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><span className="text-red-500">•</span> {d}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ExerciseCard = ({ exercise, guide, history, onLog, inputValue, onInputChange, onStartRest, isCompleted, onOpenGlossary }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`glass-card overflow-hidden transition-all duration-300 ${isCompleted ? 'border-neon-green bg-green-50/50 shadow-lg shadow-green-500/10' : ''}`}>
            {/* Header */}
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {guide?.difficulty === "Beginner" && <span className="badge bg-green-100 text-green-700">BEGINNER</span>}
                            {isCompleted && <span className="badge bg-neon-green text-slate-900 flex items-center gap-1"><CheckCircle2 size={10} /> DONE</span>}
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{exercise.name}</h3>
                    </div>
                </div>

                {/* Target & Stats - Simplified for Beginners */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center justify-between">
                            Get This Done {onOpenGlossary && <Info size={12} className="text-slate-300 cursor-pointer" onClick={(e) => { e.stopPropagation(); onOpenGlossary(); }} />}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-slate-900">{exercise.sets}</span>
                            <span className="text-xs font-bold text-slate-500">sets</span>
                            <span className="text-slate-300 mx-1">×</span>
                            <span className="text-lg font-black text-slate-900">{exercise.reps}</span>
                            <span className="text-xs font-bold text-slate-500">reps</span>
                        </div>
                    </div>
                    {exercise.tempo && (
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center justify-between">
                                Tempo {onOpenGlossary && <Info size={12} className="text-slate-300 cursor-pointer" onClick={(e) => { e.stopPropagation(); onOpenGlossary(); }} />}
                            </div>
                            <div className="text-lg font-black text-slate-900">{exercise.tempo}</div>
                        </div>
                    )}
                </div>

                {/* Guide Button - MORE PROMINENT */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-2
                        ${expanded
                            ? 'bg-slate-100 border-slate-200 text-slate-600'
                            : 'bg-white border-blue-100 text-blue-600 shadow-sm hover:border-blue-200 hover:bg-blue-50'}`}
                >
                    {expanded ? "Close Guide" : "Show How-To Guide"}  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Expanded Guide */}
                {expanded && guide && (
                    <div className="mt-4 space-y-4 animate-fade-in-up">
                        {/* Step by Step */}
                        <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-100">
                            <h4 className="text-sm font-black text-blue-800 uppercase mb-4 flex items-center gap-2">
                                <Play size={16} /> Steps
                            </h4>
                            <ol className="space-y-4">
                                {guide.steps.map((step, i) => (
                                    <li key={i} className="flex gap-4 text-sm text-slate-700 leading-relaxed font-medium">
                                        <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-black text-blue-600 shadow-sm flex-shrink-0 border border-blue-100">{i + 1}</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        {/* Mistakes & Feel */}
                        <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-100">
                            <h4 className="text-sm font-black text-amber-800 uppercase mb-3 flex items-center gap-2">
                                <AlertTriangle size={16} /> Watch Out
                            </h4>
                            <ul className="space-y-2">
                                {guide.mistakes.map((m, i) => (
                                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                        <span className="text-amber-500 font-bold">•</span> {m}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className={`p-4 md:p-6 pt-0 flex gap-3 ${isCompleted ? 'bg-green-50/50' : ''}`}>
                <input
                    type="number"
                    placeholder="Reps done"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    className="flex-1 bg-white border-2 border-slate-100 rounded-xl py-3 px-4 text-slate-900 font-bold text-center text-lg focus:outline-none focus:ring-2 focus:ring-neon-green/30 focus:border-neon-green touch-target shadow-sm"
                />
                <button onClick={onLog} className={`px-6 rounded-xl font-bold transition-all active:scale-95 touch-target flex items-center gap-2 shadow-lg shadow-neon-green/20
                    ${isCompleted ? 'bg-neon-green text-slate-900 hover:bg-slate-900 hover:text-white' : 'bg-slate-900 text-white hover:bg-neon-green hover:text-slate-900'}`}>
                    <CheckCircle2 size={24} /> {isCompleted ? "Done" : "Log Set"}
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
    const [showGlossary, setShowGlossary] = useState(false);
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

    const getDayStatus = (dateStr) => {
        if (!dateStr) return 'empty';
        const d = new Date(dateStr);
        const dayRoutine = routines[d.getDay()];
        const log = dailyLogs.find(l => l.date === dateStr);
        const isFuture = d > new Date(todayStr); // Approx check
        const isToday = dateStr === todayStr;

        if (!dayRoutine) return 'rest';
        if (isFuture) return 'future';
        if (log?.workoutCompleted) return 'complete';
        if (isToday) return 'pending';
        return 'missed';
    };

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans">
            <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
            {restTimer && <RestTimer seconds={restTimer} onComplete={() => setRestTimer(null)} onCancel={() => setRestTimer(null)} />}

            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-100 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">FITNESS<span className="text-neon-green">TRACKER</span></h1>
                        <p className="text-xs text-slate-500 font-medium">{isSelectedToday ? "Today" : selDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowGlossary(true)} className="p-2 text-slate-400"><HelpCircle size={24} /></button>
                        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-neon-green font-black shadow-lg shadow-neon-green/20">
                            {user.streak || calculateStreak()}
                        </div>
                        <button onClick={() => setShowSidebar(true)} className="p-2"><Menu size={24} /></button>
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar (Left) */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex-col p-6 z-50">
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">FITNESS<span className="text-neon-green">TRACKER</span></h1>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 mb-8 text-white relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-neon-green rounded-xl flex items-center justify-center text-slate-900 font-black text-2xl">
                            {user.streak || calculateStreak()}
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Streak</div>
                            <div className="font-bold text-lg">Days Active</div>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">{fullMonthNames[viewMonth]} <span className="text-slate-400">{viewYear}</span></h3>
                        <div className="flex gap-1">
                            <button onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))} className="p-1 hover:bg-slate-100 rounded-lg"><ChevronLeft size={18} /></button>
                            <button onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))} className="p-1 hover:bg-slate-100 rounded-lg"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 gap-x-1 mb-2">
                        {dayNames.map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase">{d.slice(0, 2)}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((dateStr, idx) => {
                            if (!dateStr) return <div key={`e-${idx}`} />;
                            const status = getDayStatus(dateStr);
                            const isSelected = dateStr === selectedDate;
                            let bgClass = "bg-slate-50 text-slate-400 hover:bg-slate-100";
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

                <button onClick={() => setShowGlossary(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-500 mt-4">
                    <BookOpen size={18} /><span className="text-sm font-bold">Fitness Terms</span>
                </button>
            </aside>

            {/* Mobile Calendar Modal */}
            {showCalendar && (
                <div className="fixed inset-0 z-[100] md:hidden flex items-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCalendar(false)} />
                    <div className="relative bg-white rounded-t-3xl w-full p-6 pb-10 animate-fade-in-up safe-bottom">
                        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
                        {/* Controls ... */}
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
            <main className="md:ml-72 px-4 md:px-12 py-8 max-w-5xl mx-auto">
                {/* Header */}
                <header className="mb-8 animate-fade-in-up">
                    <p className="text-xs text-neon-green font-bold uppercase tracking-widest mb-2">
                        {isSelectedToday ? "Today's Plan" : selDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-4">
                        {isRestDay ? "Active Recovery" : routine.name}
                        {getDayStatus(selectedDate) === 'complete' && <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={14} /> Complete</span>}
                    </h2>
                </header>

                {activeTab === 'workout' && (
                    <>
                        {isRestDay ? (
                            <div className="glass-card p-12 text-center border-dashed border-2 border-slate-200 bg-white/50">
                                <Award size={80} className="mx-auto text-slate-200 mb-6" />
                                <h3 className="text-2xl font-bold text-slate-400 mb-3">Rest & Grow</h3>
                                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">No workout today.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* DAILY BRIEFING */}
                                <DailyBriefing routineName={routine.name} briefing={DAILY_BRIEFINGS[routine.name]} onOpenGlossary={() => setShowGlossary(true)} />

                                {/* Warmup */}
                                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                                    <h4 className="text-xs font-black text-orange-600 uppercase mb-4 flex items-center gap-2 tracking-wide"><Flame size={16} /> Warmup</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {routine.warmup.map((w, i) => (<span key={i} className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-100">{w}</span>))}
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
                                                onOpenGlossary={() => setShowGlossary(true)}
                                            />
                                        </div>
                                    );
                                })}

                                {/* Cooldown */}
                                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mt-8">
                                    <h4 className="text-xs font-black text-blue-600 uppercase mb-4 flex items-center gap-2 tracking-wide"><Award size={16} /> Cooldown</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {routine.cooldown.map((c, i) => (<span key={i} className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-100">{c}</span>))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Nutrition Tab... */}
                {activeTab === 'nutrition' && (
                    <div className="glass-card p-6">
                        <textarea
                            value={foodLogInput} onChange={(e) => setFoodLogInput(e.target.value)}
                            placeholder="Log meals..."
                            className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-xl p-4 resize-none"
                        />
                        <button onClick={handleSaveFoodLog} className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold">Save Log</button>
                    </div>
                )}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around py-1 safe-bottom z-40">
                <button onClick={() => setActiveTab('workout')} className={`p-3 rounded-xl transition-all ${activeTab === 'workout' ? 'text-neon-green bg-slate-50' : 'text-slate-400'}`}><Dumbbell size={24} /></button>
                <button onClick={() => setShowCalendar(true)} className="p-3 text-slate-400 active:scale-95"><Calendar size={24} /></button>
                <button onClick={() => setActiveTab('nutrition')} className={`p-3 rounded-xl transition-all ${activeTab === 'nutrition' ? 'text-neon-green bg-slate-50' : 'text-slate-400'}`}><Flame size={24} /></button>
            </nav>
        </div>
    );
};

export default Dashboard;
