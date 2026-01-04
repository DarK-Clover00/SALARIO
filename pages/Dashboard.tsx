
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';
import { DollarSign, Users, TrendingUp, Wallet } from 'lucide-react';
import { Employee, AppSettings } from '../types';

interface DashboardProps {
  employees: Employee[];
  settings: AppSettings;
  currencySymbol: string;
}

const Dashboard: React.FC<DashboardProps> = ({ employees, settings, currencySymbol }) => {
  const companyBudget = settings.monthlyBudget;
  const totalExpenditure = employees.reduce((sum, emp) => sum + emp.monthlyIncome, 0);
  const remainingBudget = Math.max(0, companyBudget - totalExpenditure);
  const averageSalary = employees.length > 0 ? totalExpenditure / employees.length : 0;

  const chartData = employees.slice(0, 6).map(emp => ({
    name: emp.fullName.split(' ')[0],
    salary: emp.monthlyIncome
  }));

  const pieData = [
    { name: 'Used Budget', value: totalExpenditure, color: '#10b981' },
    { name: 'Remaining', value: remainingBudget, color: '#e2e8f0' }
  ];

  const stats = [
    { label: 'Monthly Payroll', value: `${currencySymbol}${totalExpenditure.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
    { label: 'Total Employees', value: employees.length, icon: Users, color: 'blue' },
    { label: 'Avg Salary', value: `${currencySymbol}${averageSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: TrendingUp, color: 'violet' },
    { label: 'Budget Surplus', value: `${currencySymbol}${remainingBudget.toLocaleString()}`, icon: Wallet, color: 'amber' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Financial Overview</h1>
        <p className="text-slate-500 text-sm md:text-base">Real-time payroll analytics and budget monitoring</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`text-${stat.color}-600 w-5 h-5`} />
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <p className="text-xl md:text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-5 md:p-8 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Salary Distribution (Sample)</h3>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} width={45} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, 'Salary']}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="salary" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#059669'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 w-full">Budget Allocation</h3>
          <div className="h-56 md:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">Utilization Rate</p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-600">
              {((totalExpenditure / companyBudget) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
