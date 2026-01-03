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
    },
    "Push-up Progression": {
        difficulty: "Beginner",
        steps: ["Start at your current level (incline/knee/full)", "Lower chest with control (3s)", "Push up explosively", "Progress to harder variation when 12 reps is easy"],
        mistakes: ["Sagging hips", "Flaring elbows too wide", "Not using full range of motion"],
        feel: "Chest and triceps burning",
        easier: "Use higher incline surface",
        harder: "Decline push-ups (feet elevated)",
        videoTip: "Keep body in straight line from head to heels"
    },
    "Goblet Squats": {
        difficulty: "Beginner",
        steps: ["Hold weight at chest with both hands", "Feet shoulder-width apart", "Squat down keeping chest up", "Drive through heels to stand"],
        mistakes: ["Leaning forward", "Knees caving in", "Not going deep enough"],
        feel: "Quads, glutes, and core working",
        easier: "Bodyweight squat",
        harder: "Add more weight or pause at bottom",
        videoTip: "Elbows should touch inside of knees at bottom"
    },
    "Bulgarian Split Squats": {
        difficulty: "Intermediate",
        steps: ["Place rear foot on elevated surface behind you", "Lower until front thigh is parallel", "Keep torso upright", "Drive through front heel to stand"],
        mistakes: ["Leaning too far forward", "Front knee going past toes", "Losing balance"],
        feel: "Intense burn in front leg quad and glute",
        easier: "Lower the rear foot height",
        harder: "Hold dumbbells",
        videoTip: "Most of your weight should be on the front leg"
    },
    "Single-Leg Hip Thrust": {
        difficulty: "Intermediate",
        steps: ["Shoulders on couch/bench, one foot on floor", "Lift other leg up or hold at chest", "Drive hips up squeezing glute", "Lower with control"],
        mistakes: ["Hyperextending lower back", "Not squeezing at top", "Using momentum"],
        feel: "Intense glute activation on working leg",
        easier: "Two-leg hip thrust",
        harder: "Add weight on hips",
        videoTip: "Push through your heel, not toes"
    },
    "Single-Leg Calf Raises": {
        difficulty: "Beginner",
        steps: ["Stand on one leg, hand on wall", "Rise as high as possible on toes", "Squeeze at top for 1-2s", "Lower slowly below platform level if possible"],
        mistakes: ["Bouncing", "Not using full range", "Rushing reps"],
        feel: "Deep calf burn",
        easier: "Two-leg raises",
        harder: "Hold weight in free hand",
        videoTip: "Go slowly on the way down for more growth"
    },
    "Hammer Curls": {
        difficulty: "Beginner",
        steps: ["Hold weights with palms facing each other", "Keep elbows pinned to sides", "Curl weights to shoulders", "Lower slowly (3s)"],
        mistakes: ["Swinging body", "Moving elbows forward", "Using momentum"],
        feel: "Biceps and forearms burning",
        easier: "Alternate arms",
        harder: "Cross-body hammer curls",
        videoTip: "Palms face each other throughout - like holding hammers"
    },
    "Dead Bug + Plank": {
        difficulty: "Beginner",
        steps: ["Dead Bug: Lie on back, extend opposite arm/leg while keeping lower back flat", "Hold plank on forearms", "Keep core braced throughout", "Breathe steadily"],
        mistakes: ["Lower back arching during dead bug", "Hips sagging in plank", "Holding breath"],
        feel: "Core shaking, deep ab engagement",
        easier: "Just do plank",
        harder: "Add more dead bug reps",
        videoTip: "Press lower back into floor during dead bug"
    },
    "Push-up w/ Hold": {
        difficulty: "Beginner",
        steps: ["Lower into push-up position", "Pause at bottom for 2 seconds", "Push up with control", "Repeat maintaining the pause each rep"],
        mistakes: ["Collapsing at bottom", "Rushing the pause", "Losing form when tired"],
        feel: "Deep chest stretch and increased time under tension",
        easier: "Do on knees",
        harder: "Increase pause to 3s",
        videoTip: "The pause eliminates momentum - pure muscle work"
    },
    "Reverse Lunges": {
        difficulty: "Beginner",
        steps: ["Step backward with one leg", "Lower until both knees at 90°", "Push through front heel to stand", "Alternate legs or complete all reps on one side"],
        mistakes: ["Stepping back too short", "Front knee caving in", "Leaning forward"],
        feel: "Quads and glutes working hard",
        easier: "Hold wall for balance",
        harder: "Hold dumbbells",
        videoTip: "Step straight back, not at an angle"
    }
};

const WARMUP_GUIDE = {
    "Arm Circles": {
        steps: ["Stand tall, arms out", "Small circles forward (10x)", "Small circles backward (10x)", "Gradually increase size"],
        focus: "Shoulder mobility",
        videoTip: "Keep arms straight"
    },
    "Shoulder Shrugs": {
        steps: ["Lift shoulders to ears", "Hold for 1s", "Drop them down completely", "Repeat"],
        focus: "Release tension",
        videoTip: "Don't roll, just up/down"
    },
    "Wall Slides": {
        steps: ["Back against wall", "Arms in 'W' shape", "Slide hands up to 'Y'", "Keep elbows/wrists on wall"],
        focus: "Posture correction",
        videoTip: "Ribcage down"
    },
    "Leg Swings": {
        steps: ["Hold wall for balance", "Swing one leg forward/back", "Keep torso still", "Switch sides"],
        focus: "Hip mobility",
        videoTip: "Control the swing"
    },
    "Hip Circles": {
        steps: ["Hands on hips", "Rotate hips in big circle", "10x clockwise", "10x counter-clockwise"],
        focus: "Loosen hips/lower back",
        videoTip: "Think hula hoop"
    },
    "Cat-Cow": {
        steps: ["Hands and knees", "Arch back up (Cat)", "Sink belly down (Cow)", "Move with breath"],
        focus: "Spine flexibility",
        videoTip: "Chin to chest in Cat"
    },
    "Scapular Squeezes": {
        steps: ["Arms by sides", "Squeeze shoulder blades together", "Hold 2s", "Release"],
        focus: "Back activation",
        videoTip: "Don't shrug up"
    },
    "Jumping Jacks": {
        steps: ["Jump feet out, hands up", "Jump feet in, hands down", "Stay light on toes", "Find a rhythm"],
        focus: "Heart rate up",
        videoTip: "Soft knees on landing"
    }
};

const COOLDOWN_GUIDE = {
    "Chest Stretch": {
        steps: ["Find a doorframe or wall", "Place forearm on frame at 90 degrees", "Lean forward slightly", "Feel stretch in chest"],
        focus: "Open chest muscles",
        videoTip: "Don't force it"
    },
    "Shoulder Stretch": {
        steps: ["Bring arm across chest", "Hook with other arm", "Pull gently closer", "Keep shoulder down"],
        focus: "Rear deltoid relief",
        videoTip: "Breathe deeply"
    },
    "Quad Stretch": {
        steps: ["Stand on one leg (hold wall)", "Grab other foot behind you", "Pull heel to glute", "Keep knees close"],
        focus: "Front thigh release",
        videoTip: "Push hips forward slightly"
    },
    "Hamstring Stretch": {
        steps: ["Place heel on low surface", "Keep leg straight", "Hinge at hips firmly", "Keep back flat"],
        focus: "Back of leg flexibility",
        videoTip: "Don't round back"
    },
    "Calf Stretch": {
        steps: ["Hands on wall", "Lunge one foot back", "Keep back heel flat on floor", "Lean into wall"],
        focus: "Lower leg tightness",
        videoTip: "Straight back leg"
    },
    "Lat Stretch": {
        steps: ["Find a sturdy pole/doorframe", "Grab with one hand", "Lean hips back and away", "Feel stretch down side"],
        focus: "Back width expansion",
        videoTip: "Let weight hang"
    },
    "Bicep Stretch": {
        steps: ["Interlace fingers behind back", "Straighten arms", "Lift arms gently up", "Open chest"],
        focus: "Front arm release",
        videoTip: "Keep chest tall"
    },
    "Lower Back Twist": {
        steps: ["Lie on back", "Bring one knee to chest", "Pull across straight leg", "Look opposite way"],
        focus: "Spine rotation",
        videoTip: "Shoulders stay on ground"
    },
    "Full Body Stretch": {
        steps: ["Reach hands high overhead", "Extend legs fully", "Make yourself as tall as possible", "Deep breaths"],
        focus: "Total body release",
        videoTip: "Reach for walls"
    }
};

const QUOTES = [
    "The only bad workout is the one that didn't happen.",
    "Action is the foundational key to all success.",
    "Don't stop when you're tired. Stop when you're done.",
    "Your future is created by what you do today, not tomorrow.",
    "Sweat is just fat crying.",
    "Discipline is doing what needs to be done, even if you don't want to.",
    "A one-hour workout is only 4% of your day. No excuses.",
    "Fitness is not about being better than someone else. It's about being better than you were yesterday."
];

const routines = {
    1: {
        name: "Upper Push",
        subtitle: "Chest & Shoulders",
        icon: "💪",
        warmup: [
            { name: "Arm Circles", target: "20 reps" },
            { name: "Shoulder Shrugs", target: "10 reps" },
            { name: "Wall Slides", target: "10 reps" }
        ],
        exercises: [
            { id: "pushup_progression", name: "Push-up Progression", target: "4 x 8-12", sets: 4, reps: "8-12", type: "BW", tempo: "3-1-2", rest: 90, note: "Incline → Knee → Full → Decline as you progress" },
            { id: "db_overhead_press", name: "DB Overhead Press", target: "4 x 8-10", sets: 4, reps: "8-10", type: "DB", weight: 2, tempo: "3-1-2", rest: 90 },
            { id: "db_lateral_raises", name: "DB Lateral Raises", target: "3 x 12-15", sets: 3, reps: "12-15", type: "DB", weight: 2, tempo: "2-1-3", rest: 60 }
        ],
        cooldown: [
            { name: "Chest Stretch", target: "30s/side" },
            { name: "Shoulder Stretch", target: "30s/side" }
        ]
    },
    2: {
        name: "Lower Body",
        subtitle: "Legs & Glutes",
        icon: "🦵",
        warmup: [
            { name: "Leg Swings", target: "20/side" },
            { name: "Hip Circles", target: "10 reps" },
            { name: "Bodyweight Squats", target: "10 reps" }
        ],
        exercises: [
            { id: "goblet_squats", name: "Goblet Squats", target: "4 x 10-12", sets: 4, reps: "10-12", type: "DB", weight: 5, tempo: "3-1-2", rest: 120, note: "Hold weight at chest level" },
            { id: "bulgarian_split_squats", name: "Bulgarian Split Squats", target: "3 x 8-10/leg", sets: 3, reps: "8-10 each", type: "BW", tempo: "3-1-2", rest: 90, note: "Rear foot elevated on chair" },
            { id: "single_leg_hip_thrust", name: "Single-Leg Hip Thrust", target: "3 x 10-12/leg", sets: 3, reps: "10-12 each", type: "BW", tempo: "2-2-1", rest: 60, note: "Shoulders on couch/chair" },
            { id: "single_leg_calf_raises", name: "Single-Leg Calf Raises", target: "3 x 12-15/leg", sets: 3, reps: "12-15 each", type: "BW", tempo: "2-2-2", rest: 45 }
        ],
        cooldown: [
            { name: "Quad Stretch", target: "30s/side" },
            { name: "Hamstring Stretch", target: "30s/side" },
            { name: "Calf Stretch", target: "30s/side" }
        ]
    },
    4: {
        name: "Upper Pull",
        subtitle: "Back & Biceps",
        icon: "🎯",
        warmup: [
            { name: "Cat-Cow", target: "10 reps" },
            { name: "Arm Circles", target: "20 reps" },
            { name: "Scapular Squeezes", target: "10 reps" }
        ],
        exercises: [
            { id: "db_rows", name: "DB Rows", target: "4 x 8-10/arm", sets: 4, reps: "8-10 each", type: "DB", weight: 2, tempo: "2-1-3", rest: 90, note: "Squeeze shoulder blade at top" },
            { id: "hammer_curls", name: "Hammer Curls", target: "3 x 10-12", sets: 3, reps: "10-12", type: "DB", weight: 2, tempo: "2-1-3", rest: 60, note: "Palms facing each other" },
            { id: "db_bicep_curls", name: "DB Bicep Curls", target: "3 x 10-12", sets: 3, reps: "10-12", type: "DB", weight: 2, tempo: "2-1-3", rest: 60 },
            { id: "dead_bug", name: "Dead Bug + Plank", target: "3 x 45s", sets: 3, reps: "45s", type: "BW", rest: 45, note: "30s dead bug + 15s plank" }
        ],
        cooldown: [
            { name: "Lat Stretch", target: "30s/side" },
            { name: "Bicep Stretch", target: "30s/side" },
            { name: "Lower Back Twist", target: "30s/side" }
        ]
    },
    5: {
        name: "Full Body",
        subtitle: "Compound Focus",
        icon: "⚡",
        warmup: [
            { name: "Jumping Jacks", target: "30s" },
            { name: "Arm Circles", target: "20 reps" },
            { name: "Leg Swings", target: "10/side" }
        ],
        exercises: [
            { id: "pushup_hold", name: "Push-up w/ Hold", target: "3 x 8-10", sets: 3, reps: "8-10", type: "BW", tempo: "3-2-1", rest: 90, note: "2s pause at bottom for stretch" },
            { id: "goblet_squats2", name: "Goblet Squats", target: "3 x 12", sets: 3, reps: "12", type: "DB", weight: 5, tempo: "3-1-2", rest: 90 },
            { id: "db_rows2", name: "DB Rows", target: "3 x 10/arm", sets: 3, reps: "10 each", type: "DB", weight: 2, tempo: "2-1-2", rest: 60 },
            { id: "reverse_lunges", name: "Reverse Lunges", target: "3 x 10/leg", sets: 3, reps: "10 each", type: "BW", tempo: "2-1-2", rest: 60 }
        ],
        cooldown: [
            { name: "Full Body Stretch", target: "2 mins" }
        ]
    }
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ============================================================================
// COMPONENTS
// ============================================================================

// Weekly History Tracker - Shows workout performance over last 7 days
const WeeklyProgress = ({ dailyLogs }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate last 7 days stats
    const weekData = [];
    let workoutDaysInWeek = 0;
    let completedDays = 0;

    for (let i = 6; i >= 0; i--) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        const dayOfWeek = checkDate.getDay();
        const isWorkoutDay = routines[dayOfWeek] !== undefined;
        const log = dailyLogs.find(l => l.date === dateStr);
        const completed = log?.workoutCompleted || false;

        if (isWorkoutDay) workoutDaysInWeek++;
        if (completed) completedDays++;

        weekData.push({
            date: checkDate,
            dateStr,
            dayName: dayNames[dayOfWeek].slice(0, 1),
            isWorkoutDay,
            completed,
            isToday: i === 0
        });
    }

    const percentComplete = workoutDaysInWeek > 0 ? Math.round((completedDays / workoutDaysInWeek) * 100) : 0;
    const isOnTrack = percentComplete >= 75;
    const isBehind = percentComplete < 50;

    return (
        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp size={14} /> Weekly Progress
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isOnTrack ? 'bg-green-100 text-green-700' :
                    isBehind ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-700'
                    }`}>
                    {isOnTrack ? '✓ On Track' : isBehind ? '⚠ Behind' : '→ Catching Up'}
                </span>
            </div>

            <div className="flex justify-between gap-1 mb-3">
                {weekData.map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-[9px] font-bold ${day.isToday ? 'text-slate-900' : 'text-slate-400'}`}>
                            {day.dayName}
                        </span>
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${!day.isWorkoutDay ? 'bg-slate-100 text-slate-300' :
                            day.completed ? 'bg-emerald-500 text-white' :
                                day.isToday ? 'bg-slate-200 text-slate-500 border-2 border-dashed border-slate-300' :
                                    'bg-red-100 text-red-400'
                            }`}>
                            {!day.isWorkoutDay ? '—' : day.completed ? '✓' : day.isToday ? '?' : '✕'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${isOnTrack ? 'bg-emerald-500' : isBehind ? 'bg-red-400' : 'bg-amber-400'
                            }`}
                        style={{ width: `${percentComplete}%` }}
                    />
                </div>
                <span className="text-xs font-bold text-slate-600">{completedDays}/{workoutDaysInWeek}</span>
            </div>
        </div>
    );
};

const GlossaryModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative z-10 animate-fade-in-up shadow-2xl overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full"><X size={20} /></button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl"><BookOpen size={24} /></div>
                    <h3 className="text-xl font-black text-slate-900">Fitness Terms</h3>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {Object.entries(GLOSSARY).map(([term, def]) => (
                        <div key={term} className="bg-slate-50 p-4 rounded-2xl">
                            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {term}
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl -translate-y-10 translate-x-10" />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Today's Focus</span>
                    </div>
                    <h3 className="text-2xl font-black text-white">{briefing.focus}</h3>
                </div>
                <button onClick={onOpenGlossary} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl backdrop-blur-md transition-colors">
                    <HelpCircle size={20} className="text-emerald-400" />
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

const DailyQuote = () => {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        // Simple distinct quote based on date to avoid random jumping
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        setQuote(QUOTES[dayOfYear % QUOTES.length]);
    }, []);

    return (
        <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 rounded-r-xl mb-8 animate-fade-in-up">
            <div className="flex gap-3">
                <div className="text-emerald-500"><Lightbulb size={24} /></div>
                <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Daily Fuel</h4>
                    <p className="text-slate-700 italic font-medium leading-relaxed">"{quote}"</p>
                </div>
            </div>
        </div>
    );
};

const WarmupItem = ({ item, onClick }) => {
    const guide = WARMUP_GUIDE[item.name] || EXERCISE_GUIDE[item.name] || COOLDOWN_GUIDE[item.name];
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left transition-all ${isOpen ? 'bg-slate-800 text-white ring-2 ring-slate-800' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-100'} p-3 rounded-xl flex flex-col gap-1 shadow-sm`}>
                <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-sm">{item.name}</span>
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${isOpen ? 'bg-emerald-400 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>{item.target}</span>
                </div>
                {isOpen && guide && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 animate-fade-in text-xs space-y-2">
                        {guide.steps && (
                            <ul className="space-y-1">
                                {guide.steps.map((s, i) => <li key={i} className="flex gap-2 text-slate-300"><span className="text-emerald-400">•</span> {s}</li>)}
                            </ul>
                        )}
                        {guide.focus && <p className="text-slate-400">Focus: <span className="text-white">{guide.focus}</span></p>}
                        {guide.videoTip && <p className="text-slate-400">Tip: <span className="text-white italic">{guide.videoTip}</span></p>}
                    </div>
                )}
            </button>
        </div>
    );
};

const ExerciseCard = ({ exercise, guide, history, sets, onLog, onDeleteSet, inputValue, onInputChange, notesValue, onNotesChange, onStartRest, isCompleted, onOpenGlossary, lastSessionSets }) => {
    const [expanded, setExpanded] = useState(false);
    const [showNotes, setShowNotes] = useState(false);

    // Calculate last session stats for progressive overload comparison
    const lastSessionStats = lastSessionSets && lastSessionSets.length > 0 ? {
        totalReps: lastSessionSets.reduce((sum, s) => sum + s.reps, 0),
        setsCount: lastSessionSets.length,
        avgReps: Math.round(lastSessionSets.reduce((sum, s) => sum + s.reps, 0) / lastSessionSets.length),
        maxReps: Math.max(...lastSessionSets.map(s => s.reps))
    } : null;

    // Current session stats
    const currentStats = sets && sets.length > 0 ? {
        totalReps: sets.reduce((sum, s) => sum + s.reps, 0),
        setsCount: sets.length
    } : null;

    // Comparison
    const getComparison = () => {
        if (!lastSessionStats || !currentStats) return null;
        const diff = currentStats.totalReps - lastSessionStats.totalReps;
        if (diff > 0) return { type: 'up', diff, color: 'text-emerald-600', bg: 'bg-emerald-50' };
        if (diff < 0) return { type: 'down', diff: Math.abs(diff), color: 'text-red-500', bg: 'bg-red-50' };
        return { type: 'same', diff: 0, color: 'text-slate-500', bg: 'bg-slate-50' };
    };

    const comparison = getComparison();

    // Motivational message
    const getMotivation = () => {
        if (!lastSessionStats) return "First time! Set your baseline 💪";
        if (!currentStats || currentStats.setsCount === 0) {
            return `Last session: ${lastSessionStats.totalReps} total reps (${lastSessionStats.setsCount} sets)`;
        }
        if (currentStats.setsCount < lastSessionStats.setsCount) {
            return `${lastSessionStats.setsCount - currentStats.setsCount} more set(s) to match last time!`;
        }
        if (currentStats.totalReps < lastSessionStats.totalReps) {
            return `${lastSessionStats.totalReps - currentStats.totalReps} more reps to beat last session!`;
        }
        if (currentStats.totalReps > lastSessionStats.totalReps) {
            return "🎉 New personal best! You're getting stronger!";
        }
        return "Matched last session! Try 1 more rep next set 💪";
    };

    return (
        <div className={`glass-card overflow-hidden transition-all duration-300 ${isCompleted ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10' : ''}`}>
            {/* Header */}
            <div className="p-4 md:p-5">
                <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {guide?.difficulty === "Beginner" && <span className="badge bg-green-100 text-green-700 text-[10px] px-2 py-0.5">BEGINNER</span>}
                            {guide?.difficulty === "Intermediate" && <span className="badge bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5">INTERMEDIATE</span>}
                            {isCompleted && <span className="badge bg-emerald-400 text-slate-900 flex items-center gap-1 text-[10px] px-2 py-0.5"><CheckCircle2 size={10} /> DONE</span>}
                            {comparison && (
                                <span className={`badge ${comparison.bg} ${comparison.color} flex items-center gap-1 text-[10px] px-2 py-0.5`}>
                                    {comparison.type === 'up' && <TrendingUp size={10} />}
                                    {comparison.type === 'down' && <span className="rotate-180"><TrendingUp size={10} /></span>}
                                    {comparison.type === 'up' ? `+${comparison.diff}` : comparison.type === 'down' ? `-${comparison.diff}` : '='}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">{exercise.name}</h3>
                        {exercise.note && <p className="text-xs text-slate-500 mt-1 italic">{exercise.note}</p>}
                    </div>
                </div>

                {/* Progressive Overload - Last Session Stats */}
                {lastSessionStats && (
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-xl mb-3 border border-slate-200">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <History size={14} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Last Session</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="text-slate-600"><strong className="text-slate-900">{lastSessionStats.setsCount}</strong> sets</span>
                                <span className="text-slate-600"><strong className="text-slate-900">{lastSessionStats.totalReps}</strong> total reps</span>
                                <span className="text-slate-600">avg <strong className="text-slate-900">{lastSessionStats.avgReps}</strong>/set</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Motivation Message */}
                <div className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                    <Target size={12} className="text-emerald-500 flex-shrink-0" />
                    <span>{getMotivation()}</span>
                </div>

                {/* Target & Stats - Compact Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-center">
                        <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Goal</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-slate-900">{exercise.sets}</span>
                            <span className="text-[10px] font-bold text-slate-500">sets</span>
                            <span className="text-slate-300 mx-1">×</span>
                            <span className="text-sm font-black text-slate-900">{exercise.reps}</span>
                            <span className="text-[10px] font-bold text-slate-500">reps</span>
                        </div>
                    </div>
                    {exercise.tempo && (
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-center">
                            <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 flex items-center justify-between">
                                Tempo {onOpenGlossary && <Info size={10} className="text-slate-300 cursor-pointer" onClick={(e) => { e.stopPropagation(); onOpenGlossary(); }} />}
                            </div>
                            <div className="text-sm font-black text-slate-900">{exercise.tempo}</div>
                        </div>
                    )}
                </div>

                {/* Action Bar: Input + Log + Guide Toggle */}
                <div className="flex items-stretch gap-2 h-12">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={`px-3 rounded-xl flex items-center justify-center transition-all border
                            ${expanded
                                ? 'bg-slate-100 border-slate-200 text-slate-600'
                                : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-50'}`}
                    >
                        {expanded ? <ChevronUp size={20} /> : <HelpCircle size={20} />}
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="number"
                            placeholder={lastSessionStats ? `Beat ${lastSessionStats.avgReps}` : "Reps"}
                            value={inputValue}
                            onChange={(e) => onInputChange(e.target.value)}
                            className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 font-black text-center text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium placeholder:text-sm"
                        />
                    </div>

                    <button onClick={onLog} className={`px-4 md:px-6 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg whitespace-nowrap
                        ${isCompleted ? 'bg-emerald-400 text-slate-900 hover:bg-slate-800 hover:text-white' : 'bg-slate-900 text-white hover:bg-emerald-400 hover:text-slate-900'}`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : "Log"}
                    </button>

                    {exercise.rest && (
                        <button onClick={() => onStartRest(exercise.rest)} className="px-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-blue-100 hover:text-blue-600 transition-all">
                            <Clock size={20} />
                        </button>
                    )}

                    <button
                        onClick={() => setShowNotes(!showNotes)}
                        className={`px-3 rounded-xl transition-all ${showNotes ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-500'}`}
                        title="Add note"
                    >
                        <MessageSquare size={18} />
                    </button>
                </div>

                {/* Notes Input */}
                {showNotes && (
                    <div className="mt-3 animate-fade-in">
                        <input
                            type="text"
                            placeholder="Note: e.g., 'Shoulder felt tight, stopped early'"
                            value={notesValue}
                            onChange={(e) => onNotesChange(e.target.value)}
                            className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 placeholder:text-amber-400 placeholder:text-xs"
                        />
                    </div>
                )}

                {/* Previous Session Notes (if any) */}
                {lastSessionSets && lastSessionSets.some(s => s.notes) && (
                    <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                            <MessageSquare size={10} /> Previous Notes
                        </div>
                        <div className="space-y-1">
                            {lastSessionSets.filter(s => s.notes).map((s, i) => (
                                <p key={i} className="text-xs text-slate-600 italic">"{s.notes}"</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Guide Section */}
                {expanded && guide && (
                    <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                        {/* Step by Step */}
                        <div className="mb-4">
                            <h4 className="text-xs font-black text-slate-900 uppercase mb-2 flex items-center gap-2">
                                <Play size={12} className="text-blue-500" /> How To
                            </h4>
                            <ol className="space-y-3">
                                {guide.steps.map((step, i) => (
                                    <li key={i} className="flex gap-3 text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                                        <span className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center text-[10px] font-black text-blue-600 flex-shrink-0">{i + 1}</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        {/* Mistakes */}
                        <div className="bg-amber-50 rounded-xl p-3">
                            <h4 className="text-[10px] font-black text-amber-800 uppercase mb-2 flex items-center gap-1">
                                <AlertTriangle size={10} /> Watch Out
                            </h4>
                            <ul className="space-y-1">
                                {guide.mistakes.map((m, i) => (
                                    <li key={i} className="text-xs text-amber-900/80 flex items-start gap-2">
                                        <span className="text-amber-500">•</span> {m}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Sets List - Compact */}
            {sets && sets.length > 0 && (
                <div className="bg-slate-50/50 px-4 py-3 border-t border-slate-100">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {sets.map((set, i) => (
                            <div key={set.id || i} className="flex items-center gap-2 bg-white border border-slate-100 rounded-lg px-2 py-1.5 shadow-sm flex-shrink-0">
                                <span className="text-[10px] text-slate-400 font-bold">#{i + 1}</span>
                                <span className="text-xs font-bold text-slate-900">{set.reps} reps</span>
                                <button onClick={() => onDeleteSet(set.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// MAIN DASHBOARD
// ============================================================================

const Dashboard = ({ user, dailyLogs, workoutHistory, onUpdateFoodLog, onLogWorkout, onDeleteSet, onLogout, onOpenSettings }) => {
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
    const [notes, setNotes] = useState({});  // Notes per exercise

    const selDateObj = new Date(selectedDate);
    const dayOfWeek = selDateObj.getDay();
    const routine = routines[dayOfWeek];
    const isRestDay = !routine;
    const isSelectedToday = selectedDate === todayStr;

    const selectedDayLog = dailyLogs.find(l => l.date === selectedDate) || { foodLog: "", workoutCompleted: false, exercises: [], sets: [] };
    const completedExercises = selectedDayLog.exercises || [];
    const daySets = selectedDayLog.sets || [];

    useEffect(() => {
        setFoodLogInput(selectedDayLog.foodLog || "");
    }, [selectedDate, selectedDayLog]);

    const calculateStreak = useCallback(() => {
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check each day going backwards from today
        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];

            const dayOfWeek = checkDate.getDay();
            const isWorkoutDay = routines[dayOfWeek] !== undefined;

            if (!isWorkoutDay) continue; // Skip rest days

            const log = dailyLogs.find(l => l.date === dateStr);
            if (log?.workoutCompleted) {
                streak++;
            } else {
                // If today is a workout day and not yet completed, don't break (give chance)
                if (i === 0 && dateStr === todayStr) continue;
                break; // Streak broken
            }
        }
        return streak;
    }, [dailyLogs, todayStr]);

    const handleLog = (exercise) => {
        const val = inputs[exercise.id];
        if (!val) return;

        // Check if date is editable (within last 7 days)
        if (!isDateEditable(selectedDate)) {
            alert('Cannot log workouts for dates older than 7 days.');
            return;
        }

        const exerciseNotes = notes[exercise.id] || "";
        onLogWorkout(exercise.name, parseInt(val), exercise.weight || 0, selectedDate, exerciseNotes);
        setInputs(prev => ({ ...prev, [exercise.id]: '' }));
        setNotes(prev => ({ ...prev, [exercise.id]: '' }));  // Clear notes after logging

        // Auto-start rest timer after logging
        if (exercise.rest) {
            setRestTimer(exercise.rest);
        }
    };

    // Check if a date is within the editable window (last 7 days + today)
    const isDateEditable = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(dateStr);
        checkDate.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        return checkDate >= sevenDaysAgo && checkDate <= today;
    };

    const canEditSelectedDate = isDateEditable(selectedDate);

    // Get last session sets for an exercise (for progressive overload comparison)
    const getLastSessionSets = useCallback((exerciseName) => {
        // Find the most recent log BEFORE the currently selected date that has this exercise
        // We need to find when this exercise was last performed

        // Get all logs that have sets
        const logsWithSets = dailyLogs.filter(l => l.sets && l.sets.length > 0);

        // Filter to logs before selected date and sort by date descending
        const previousLogs = logsWithSets
            .filter(l => new Date(l.date) < new Date(selectedDate))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        // Search for this exercise in previous logs
        for (const log of previousLogs) {
            const exerciseSets = (log.sets || []).filter(s => s.exercise_name === exerciseName);
            if (exerciseSets.length > 0) {
                return exerciseSets;
            }
        }

        return null;
    }, [dailyLogs, selectedDate]);

    const handleSaveFoodLog = async () => {
        if (!canEditSelectedDate) {
            alert('Cannot update food log for dates older than 7 days.');
            return;
        }
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
        if (log?.workoutCompleted) return 'complete'; // Backend/App.jsx logic sets this if sets exist
        if (isToday) return 'pending';
        return 'missed';
    };

    return (
        <div className="min-h-screen pb-20 md:pb-0 font-sans">
            <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />
            {restTimer && <RestTimer seconds={restTimer} onComplete={() => setRestTimer(null)} onCancel={() => setRestTimer(null)} />}

            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-100 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">FITNESS<span className="text-emerald-500">TRACKER</span></h1>
                        <p className="text-xs text-slate-500 font-medium">{isSelectedToday ? "Today" : selDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowGlossary(true)} className="p-2 text-slate-400 hover:text-slate-600"><HelpCircle size={22} /></button>
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center text-emerald-400 font-black shadow-lg">
                            {user.streak || calculateStreak()}
                        </div>
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar (Left) */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex-col p-6 z-50 overflow-hidden">
                <div className="mb-6 flex-shrink-0">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">FITNESS<span className="text-emerald-500">TRACKER</span></h1>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 mb-6 text-white relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/20 rounded-full blur-2xl" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 bg-emerald-400 rounded-xl flex items-center justify-center text-slate-900 font-black text-2xl shadow-lg shadow-emerald-400/30">
                            {user.streak || calculateStreak()}
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Current Streak</div>
                            <div className="font-bold text-lg text-white">Days Active</div>
                        </div>
                    </div>
                </div>

                {/* Calendar - scrollable section */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-1">
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
                            let bgClass = "bg-slate-50 text-slate-500 hover:bg-slate-100";
                            if (status === 'complete') bgClass = "bg-emerald-100 text-emerald-700 font-bold border-2 border-emerald-200";
                            if (status === 'missed') bgClass = "bg-red-50 text-red-500 border-2 border-red-100";
                            if (status === 'pending') bgClass = "bg-amber-50 text-amber-600 border-2 border-dashed border-amber-200";
                            if (isSelected) bgClass = "bg-slate-900 text-white shadow-lg shadow-slate-900/40 transform scale-110 z-10";

                            return (
                                <button key={dateStr} onClick={() => setSelectedDate(dateStr)}
                                    className={`aspect-square rounded-xl text-xs flex items-center justify-center transition-all duration-200 ${bgClass}`}>
                                    {parseInt(dateStr.split('-')[2])}
                                </button>
                            );
                        })}
                    </div>

                    {/* Weekly History Tracker */}
                    <WeeklyProgress dailyLogs={dailyLogs} />
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 flex-shrink-0">
                    <button onClick={() => setShowGlossary(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600">
                        <BookOpen size={18} /><span className="text-sm font-bold">Fitness Terms</span>
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 border border-red-100">
                        <LogOut size={18} /><span className="text-sm font-bold">Sign Out</span>
                    </button>
                </div>
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
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-2">
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
                                {/* DAILY BRIEFING & QUOTE */}
                                <DailyQuote />
                                <DailyBriefing routineName={routine.name} briefing={DAILY_BRIEFINGS[routine.name]} onOpenGlossary={() => setShowGlossary(true)} />

                                {/* Warmup - Replaced text pills with Interactive Cards */}
                                <div className="bg-slate-900/5 rounded-3xl p-6 mb-8">
                                    <h4 className="text-xs font-black text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-wide"><Flame size={16} /> Warmup Flow</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {routine.warmup.map((w, i) => (
                                            <WarmupItem key={i} item={w} />
                                        ))}
                                    </div>
                                </div>

                                {/* Exercises */}
                                {routine.exercises.map((ex, idx) => {
                                    const guide = EXERCISE_GUIDE[ex.name];
                                    const history = workoutHistory[ex.name] || { lastReps: 0 };
                                    const isCompleted = completedExercises.includes(ex.name);
                                    const exerciseSets = daySets.filter(s => s.exercise_name === ex.name);

                                    return (
                                        <div key={ex.id} className={`stagger-${idx + 1}`} style={{ animationFillMode: 'forwards' }}>
                                            <ExerciseCard
                                                exercise={ex}
                                                guide={guide}
                                                history={history}
                                                isCompleted={isCompleted}
                                                sets={exerciseSets}
                                                lastSessionSets={getLastSessionSets(ex.name)}
                                                inputValue={inputs[ex.id] || ''}
                                                onInputChange={(val) => setInputs(prev => ({ ...prev, [ex.id]: val }))}
                                                notesValue={notes[ex.id] || ''}
                                                onNotesChange={(val) => setNotes(prev => ({ ...prev, [ex.id]: val }))}
                                                onLog={() => handleLog(ex)}
                                                onDeleteSet={(setId) => onDeleteSet(setId, selectedDate)}
                                                onStartRest={(secs) => setRestTimer(secs)}
                                                onOpenGlossary={() => setShowGlossary(true)}
                                            />
                                        </div>
                                    );
                                })}

                                {/* Cooldown */}
                                <div className="bg-blue-50/50 rounded-3xl p-6 mt-8 border border-blue-100">
                                    <h4 className="text-xs font-black text-blue-600 uppercase mb-4 flex items-center gap-2 tracking-wide"><Award size={16} /> Cooldown Recovery</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {routine.cooldown.map((c, i) => (
                                            <WarmupItem key={i} item={c} />
                                        ))}
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
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around py-1 safe-bottom z-40">
                <button onClick={() => setActiveTab('workout')} className={`p-3 rounded-xl transition-all ${activeTab === 'workout' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}><Dumbbell size={24} /></button>
                <button onClick={() => setShowCalendar(true)} className="p-3 text-slate-400 active:scale-95"><Calendar size={24} /></button>
                <button onClick={() => setActiveTab('nutrition')} className={`p-3 rounded-xl transition-all ${activeTab === 'nutrition' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}><Flame size={24} /></button>
                <button onClick={onLogout} className="p-3 text-red-400 hover:text-red-500 active:scale-95"><LogOut size={24} /></button>
            </nav>
        </div>
    );
};

export default Dashboard;
