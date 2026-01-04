
import React from 'react';
import { FileDown, CheckCircle2, Clock } from 'lucide-react';
import { Employee, AppSettings } from '../types';
import { generatePayslip } from '../utils/pdfGenerator';

interface PayrollProps {
  employees: Employee[];
  settings: AppSettings;
  currencySymbol: string;
}

const Payroll: React.FC<PayrollProps> = ({ employees, settings, currencySymbol }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Payroll Management</h1>
        <p className="text-slate-500 text-sm md:text-base">Review salaries and generate official payslips</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4 sticky left-0 bg-slate-50 z-10">Employee</th>
                <th className="px-6 py-4">Gross Income</th>
                <th className="px-6 py-4">Deductions ({settings.taxRate}%)</th>
                <th className="px-6 py-4">Net Payable</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Statement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.map((emp) => {
                const taxRateDecimal = settings.taxRate / 100;
                const tax = emp.monthlyIncome * taxRateDecimal;
                const net = emp.monthlyIncome - tax;
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{emp.fullName}</p>
                          <p className="text-[10px] text-slate-500">{emp.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{currencySymbol}{emp.monthlyIncome.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-red-600">-{currencySymbol}{tax.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-emerald-600">{currencySymbol}{net.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 size={12} />
                        <span>Ready</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => generatePayslip(emp, settings)}
                        className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors group"
                      >
                        <FileDown size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                        <span className="whitespace-nowrap">Download PDF</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <Clock className="w-12 h-12 text-slate-200 mb-4" />
                      <p>No payroll data found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
