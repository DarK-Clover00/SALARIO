
import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Wallet, TrendingUp, Users, ArrowUpRight, 
  Activity, Clock
} from 'lucide-react';
import { AppSettings } from '../types';

interface AnalyticsProps {
  user?: any;
  settings: AppSettings;
  currencySymbol: string;
}

const mockAnalyticsData = {
  payrollTrends: [
    { name: 'Jan', current: 210000, previous: 180000 },
    { name: 'Feb', current: 235000, previous: 195000 },
    { name: 'Mar', current: 220000, previous: 210000 },
    { name: 'Apr', current: 280000, previous: 225000 },
    { name: 'May', current: 310000, previous: 240000 },
    { name: 'Jun', current: 335000, previous: 260000 },
  ],
  departmentCosts: [
    { name: 'Lead Designer', value: 120000, color: '#10b981' },
    { name: 'Senior Engineer', value: 250000, color: '#059669' },
    { name: 'HR Manager', value: 85000, color: '#34d399' },
    { name: 'Marketing Lead', value: 95000, color: '#6ee7b7' },
  ],
  overtimeCosts: [
    { name: 'Week 1', cost: 12000 },
    { name: 'Week 2', cost: 18000 },
    { name: 'Week 3', cost: 15000 },
    { name: 'Week 4', cost: 22000 },
  ]
};

const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ settings, currencySymbol }) => {
  const budgetValue = settings.monthlyBudget;
  
  // Update mock data to reflect current budget limit for visualization
  const savingsAnalysis = mockAnalyticsData.payrollTrends.map(trend => ({
    name: trend.name,
    actual: trend.current,
    budget: budgetValue
  }));

  const totalActual = mockAnalyticsData.payrollTrends[5].current;
  const savingsAmount = Math.max(0, budgetValue - totalActual);
  const utilization = ((totalActual / budgetValue) * 100).toFixed(1);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg shadow-emerald-100">
            S
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Welcome back, Subarno!</h1>
            <div className="flex items-center space-x-2 text-slate-500 text-xs md:text-sm mt-0.5">
              <span className="font-medium text-emerald-600">Administrator</span>
              <span>•</span>
              <span className="hidden sm:inline">subarno@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 hidden sm:block">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Session Active</p>
          <p className="text-sm font-bold text-slate-700">Q2 Financial Review</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Wallet size={24} />
            </div>
            <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">+12%</span>
          </div>
          <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">{currencySymbol}{savingsAmount.toLocaleString()}</p>
          <p className="text-slate-800 font-bold mt-1">Saved</p>
          <p className="text-slate-400 text-[10px] md:text-xs mt-2 leading-relaxed">Based on current active payroll vs allocated budget</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <Activity size={24} />
            </div>
            <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded-lg text-xs font-bold">{utilization}%</span>
          </div>
          <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">{utilization}%</p>
          <p className="text-slate-800 font-bold mt-1">Utilization</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${utilization}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl bg-violet-50 text-violet-600">
              <Users size={24} />
            </div>
            <div className="flex items-center text-emerald-500 text-xs font-bold">
              <ArrowUpRight size={14} className="mr-1" />
              2.4%
            </div>
          </div>
          <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">{currencySymbol}{(67000).toLocaleString()}</p>
          <p className="text-slate-800 font-bold mt-1">Avg. Salary / Employee</p>
          <p className="text-slate-400 text-[10px] md:text-xs mt-2 leading-relaxed">2.4% from last quarter review</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        <div className="lg:col-span-3 bg-white p-5 md:p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex flex-col mb-8">
            <h3 className="text-lg md:text-xl font-bold text-slate-800">Payroll Trends</h3>
            <p className="text-slate-500 text-xs md:text-sm">6-month expenditure growth analysis</p>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAnalyticsData.payrollTrends}>
                <defs>
                  <linearGradient id="colorCurr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} width={45} domain={[0, Math.max(340000, budgetValue)]} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  formatter={(val: number) => `${currencySymbol}${val.toLocaleString()}`}
                />
                <Area type="monotone" dataKey="current" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCurr)" name="Year 2024" />
                <Area type="monotone" dataKey="previous" stroke="#94a3b8" strokeWidth={2} fill="transparent" strokeDasharray="5 5" name="Year 2023" />
                <Legend iconType="circle" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-5 md:p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex flex-col mb-8">
            <h3 className="text-lg md:text-xl font-bold text-slate-800">Savings Analysis</h3>
            <p className="text-slate-500 text-xs md:text-sm">Budgeted vs Actual Monthly Expenditure</p>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsAnalysis}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} width={45} domain={[0, Math.max(600000, budgetValue * 1.2)]} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  formatter={(val: number) => `${currencySymbol}${val.toLocaleString()}`}
                />
                <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual Payroll" />
                <Bar dataKey="budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Budget Limit" />
                <Legend iconType="circle" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
