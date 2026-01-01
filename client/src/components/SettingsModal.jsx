import React, { useState, useEffect } from 'react';
import { X, Weight, Flame, Zap } from 'lucide-react';

const SettingsModal = ({ user, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        weight: user.weight || 70,
        calorieTarget: user.calorieTarget || 2800,
        proteinTarget: user.proteinTarget || 140
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                weight: user.weight || 70,
                calorieTarget: user.calorieTarget || 2800,
                proteinTarget: user.proteinTarget || 140
            });
        }
    }, [isOpen, user]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: Math.max(0, Number(value)) }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-dark-card border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black italic text-white tracking-tighter">SETTINGS</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                    {/* Weight Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Weight size={12} />
                            Current Weight (kg)
                        </label>
                        <input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                            min="30"
                            max="200"
                            step="0.1"
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-black text-lg focus:outline-none focus:border-neon-green/50 transition-colors"
                        />
                    </div>

                    {/* Calorie Target Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Flame size={12} />
                            Daily Calorie Target
                        </label>
                        <input
                            type="number"
                            value={formData.calorieTarget}
                            onChange={(e) => handleChange('calorieTarget', e.target.value)}
                            min="1000"
                            max="5000"
                            step="50"
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-black text-lg focus:outline-none focus:border-neon-green/50 transition-colors"
                        />
                    </div>

                    {/* Protein Target Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Zap size={12} />
                            Daily Protein Target (g)
                        </label>
                        <input
                            type="number"
                            value={formData.proteinTarget}
                            onChange={(e) => handleChange('proteinTarget', e.target.value)}
                            min="50"
                            max="300"
                            step="5"
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white font-black text-lg focus:outline-none focus:border-neon-green/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Quick Presets */}
                <div className="mt-5 pt-4 border-t border-white/10">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">Quick Calorie Presets</p>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => handleChange('calorieTarget', 2500)}
                            className="text-[10px] bg-white/5 px-3 py-2 rounded-lg font-black hover:bg-white/10 transition-colors"
                        >2500</button>
                        <button
                            onClick={() => handleChange('calorieTarget', 2800)}
                            className="text-[10px] bg-white/5 px-3 py-2 rounded-lg font-black hover:bg-white/10 transition-colors"
                        >2800</button>
                        <button
                            onClick={() => handleChange('calorieTarget', 3000)}
                            className="text-[10px] bg-white/5 px-3 py-2 rounded-lg font-black hover:bg-white/10 transition-colors"
                        >3000</button>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full mt-6 bg-neon-green text-black font-black uppercase tracking-wider py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
