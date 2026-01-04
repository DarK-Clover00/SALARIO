
import React, { useState } from 'react';
import { Building, Save, AlertCircle, Percent, CheckCircle, Globe } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Company Settings</h1>
        <p className="text-slate-500">Manage global financial parameters and tax rules for your organization.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center space-x-3 text-emerald-600">
            <Building size={24} />
            <h2 className="text-xl font-bold">Financial Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Monthly Budget */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Monthly Allocation Budget ({localSettings.currency})</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  {localSettings.currency === 'INR' ? '₹' : localSettings.currency === 'USD' ? '$' : '€'}
                </div>
                <input
                  type="number"
                  value={localSettings.monthlyBudget}
                  onChange={(e) => setLocalSettings({ ...localSettings, monthlyBudget: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold"
                />
              </div>
              <p className="text-xs text-slate-400">Used for dashboard comparisons and budget surplus calculations.</p>
            </div>

            {/* Currency Preference */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Reporting Currency</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={localSettings.currency}
                  onChange={(e) => setLocalSettings({ ...localSettings, currency: e.target.value as any })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tax Rate Slider */}
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">Tax Simulation Rate (%)</label>
              <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-lg text-emerald-700 font-bold">
                <Percent size={14} />
                <span>{localSettings.taxRate}%</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <input
                type="range"
                min="0"
                max="50"
                value={localSettings.taxRate}
                onChange={(e) => setLocalSettings({ ...localSettings, taxRate: Number(e.target.value) })}
                className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <input
                type="number"
                min="0"
                max="50"
                value={localSettings.taxRate}
                onChange={(e) => setLocalSettings({ ...localSettings, taxRate: Math.min(50, Number(e.target.value)) })}
                className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-xs text-slate-400">Global rate applied for automated tax deduction estimates in payslips and analytics.</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Note:</strong> Changes to the budget will reflect immediately on the Dashboard and Analytics sections. Existing payroll historical data will not be modified.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95"
          >
            <Save size={20} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10001] animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-700">
            <CheckCircle className="text-emerald-400" size={20} />
            <span className="font-semibold">Settings updated successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
