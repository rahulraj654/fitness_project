import React from 'react';
import { Plus, Flame, Zap, Weight } from 'lucide-react';

const Dashboard = ({ user, todayStats, onUpdateNutrition }) => {
    const calTarget = 2800;
    const protTarget = 140;

    const calPercent = Math.min((todayStats.calories / calTarget) * 100, 100);
    const protPercent = Math.min((todayStats.protein / protTarget) * 100, 100);

    // Day of transformation calculation
    const startDate = new Date(user.startDate);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero */}
            <section className="text-center py-4">
                <h2 className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mb-1">Current Journey</h2>
                <div className="text-5xl font-black text-white italic">
                    DAY <span className="text-neon-green">{diffDays}</span>
                </div>
            </section>

            {/* Fuel Gauges */}
            <section className="space-y-6">
                <div className="glass-card p-6 neon-border">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="flex items-center gap-2 text-neon-green text-xs font-black uppercase tracking-widest mb-1">
                                <Flame size={14} /> Calories
                            </div>
                            <div className="text-3xl font-black italic">{todayStats.calories} <span className="text-gray-500 text-lg">/ {calTarget}</span></div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onUpdateNutrition(200, 0)}
                                className="btn-secondary py-1 px-3 text-xs flex items-center gap-1"
                            >
                                <Plus size={12} /> 200
                            </button>
                            <button
                                onClick={() => onUpdateNutrition(500, 0)}
                                className="btn-secondary py-1 px-3 text-xs flex items-center gap-1"
                            >
                                <Plus size={12} /> 500
                            </button>
                        </div>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-neon-green transition-all duration-1000 ease-out"
                            style={{ width: `${calPercent}%` }}
                        ></div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest mb-1">
                                <Zap size={14} /> Protein
                            </div>
                            <div className="text-3xl font-black italic">{todayStats.protein}g <span className="text-gray-500 text-lg">/ {protTarget}g</span></div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onUpdateNutrition(0, 10)}
                                className="btn-secondary py-1 px-3 text-xs flex items-center gap-1"
                            >
                                <Plus size={12} /> 10g
                            </button>
                            <button
                                onClick={() => onUpdateNutrition(0, 25)}
                                className="btn-secondary py-1 px-3 text-xs flex items-center gap-1"
                            >
                                <Plus size={12} /> 25g
                            </button>
                        </div>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                            style={{ width: `${protPercent}%` }}
                        ></div>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-neon-green">
                        <Weight size={24} />
                    </div>
                    <div>
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Weight</div>
                        <div className="text-xl font-black italic">{user.weight} KG</div>
                    </div>
                </div>
                <div className="glass-card p-4 flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-orange-400">
                        <Flame size={24} />
                    </div>
                    <div>
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Metabolism</div>
                        <div className="text-xl font-black italic">HIGH</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
