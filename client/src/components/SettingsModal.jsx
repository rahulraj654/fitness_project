import React, { useState, useEffect } from 'react';
import { X, Weight } from 'lucide-react';

const SettingsModal = ({ user, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        weight: user.weight || 70
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                weight: user.weight || 70
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
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black italic text-slate-950 tracking-tighter uppercase">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                    {/* Weight Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
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
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-950 font-black text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full mt-8 bg-emerald-500 text-white font-black uppercase tracking-wider py-4 rounded-xl hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/30"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
