
import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Pencil, Mail, Briefcase, X, CheckCircle, UserCheck } from 'lucide-react';
import { Employee } from '../types';

interface EmployeesProps {
  employees: Employee[];
  onAdd: (employee: Employee) => void;
  onUpdate: (employee: Employee) => void;
  onDelete: (id: string) => void;
  forceOpenModal?: boolean;
  onModalClose?: () => void;
  currencySymbol?: string;
}

const Employees: React.FC<EmployeesProps> = ({ 
  employees, 
  onAdd, 
  onUpdate, 
  onDelete, 
  forceOpenModal, 
  onModalClose, 
  currencySymbol = '₹' 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    position: '',
    monthlyIncome: '',
    dateJoined: new Date().toISOString().split('T')[0],
    status: 'Active' as 'Active' | 'On Leave' | 'Terminated'
  });

  useEffect(() => {
    if (forceOpenModal) {
      setIsModalOpen(true);
      setEditingEmployee(null);
    }
  }, [forceOpenModal]);

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        fullName: editingEmployee.fullName,
        email: editingEmployee.email,
        position: editingEmployee.position,
        monthlyIncome: editingEmployee.monthlyIncome.toString(),
        dateJoined: editingEmployee.dateJoined,
        status: editingEmployee.status || 'Active'
      });
      setIsModalOpen(true);
    } else {
      setFormData({
        fullName: '',
        email: '',
        position: '',
        monthlyIncome: '',
        dateJoined: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
    }
  }, [editingEmployee]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    if (onModalClose) onModalClose();
  };

  const filteredEmployees = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Number(formData.monthlyIncome) < 0) {
      alert("Salary cannot be negative.");
      return;
    }

    const employeeData: Employee = {
      id: editingEmployee ? editingEmployee.id : Math.random().toString(36).substr(2, 9),
      fullName: formData.fullName,
      email: formData.email,
      position: formData.position,
      monthlyIncome: Number(formData.monthlyIncome),
      dateJoined: formData.dateJoined,
      status: formData.status as 'Active' | 'On Leave' | 'Terminated'
    };

    if (editingEmployee) {
      onUpdate(employeeData);
    } else {
      onAdd(employeeData);
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    handleCloseModal();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'On Leave': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Terminated': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Employee Directory</h1>
          <p className="text-slate-500 text-sm md:text-base">Manage your workforce and compensation</p>
        </div>
        <button 
          onClick={() => {
            setEditingEmployee(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 h-12 md:h-auto rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          <Plus size={20} />
          <span className="font-semibold whitespace-nowrap">Add New Employee</span>
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-50">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 md:px-6 py-4 sticky left-0 bg-slate-50 z-10">Employee</th>
                <th className="px-4 md:px-6 py-4">Position</th>
                <th className="px-4 md:px-6 py-4">Monthly Income</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 md:px-6 py-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs md:text-sm">
                        {emp.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{emp.fullName}</p>
                        <p className="text-[10px] md:text-xs text-slate-500 truncate max-w-[120px]">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {emp.position}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">{currencySymbol}{emp.monthlyIncome.toLocaleString()}</p>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(emp.status)}`}>
                      {emp.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1 md:space-x-2">
                      <button 
                        onClick={() => setEditingEmployee(emp)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(emp.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white md:rounded-3xl w-full h-full md:h-auto md:max-w-lg shadow-2xl overflow-y-auto animate-in md:zoom-in-95 duration-200">
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-bold">{editingEmployee ? 'Edit Employee' : 'New Employee'}</h3>
                <p className="text-emerald-100 text-sm opacity-90">{editingEmployee ? `Update profile` : 'Add to system'}</p>
              </div>
              <button onClick={handleCloseModal} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 pb-20 md:pb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Position</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                      <select
                        required
                        value={formData.position}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                      >
                        <option value="">Select Position</option>
                        <option value="Lead Developer">Lead Developer</option>
                        <option value="Senior Engineer">Senior Engineer</option>
                        <option value="HR Manager">HR Manager</option>
                        <option value="Marketing Lead">Marketing Lead</option>
                        <option value="Designer">Designer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Income ({currencySymbol})</label>
                    <input
                      required
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                    <div className="relative">
                      <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                      <select
                        required
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Joining Date</label>
                    <input
                      required
                      type="date"
                      value={formData.dateJoined}
                      onChange={(e) => setFormData({...formData, dateJoined: e.target.value})}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 h-12 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={20} />
                  <span>{editingEmployee ? 'Update' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast - Responsive Positioning */}
      {showToast && (
        <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-[10001] animate-in slide-in-from-bottom-10 fade-in duration-300 w-[90%] md:w-auto">
          <div className="bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-center space-x-3 border border-slate-700 text-center">
            <CheckCircle className="text-emerald-400 shrink-0" size={20} />
            <span className="font-semibold text-sm">
              {editingEmployee ? 'Updated' : 'Registered'} successfully
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
