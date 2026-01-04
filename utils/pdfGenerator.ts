
import { jsPDF } from 'jspdf';
import { Employee, AppSettings } from '../types';

export const generatePayslip = (employee: Employee, settings: AppSettings) => {
  const doc = new jsPDF();
  const taxRateDecimal = settings.taxRate / 100;
  const taxAmount = employee.monthlyIncome * taxRateDecimal;
  const netPay = employee.monthlyIncome - taxAmount;
  
  const currencySymbol = settings.currency === 'USD' ? '$' : settings.currency === 'EUR' ? '€' : '₹';

  // Header
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('SALARIO', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Official Payroll Statement', 105, 30, { align: 'center' });

  // Employee Details
  doc.setTextColor(51, 65, 85); // Slate 700
  doc.setFontSize(12);
  doc.text('Employee Details:', 20, 55);
  doc.setFontSize(10);
  doc.text(`Name: ${employee.fullName}`, 20, 65);
  doc.text(`Position: ${employee.position}`, 20, 72);
  doc.text(`Email: ${employee.email}`, 20, 79);
  doc.text(`Date of Joining: ${employee.dateJoined}`, 20, 86);

  // Divider
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.line(20, 95, 190, 95);

  // Breakdown Table
  doc.setFontSize(12);
  doc.text('Income Breakdown', 20, 110);
  
  doc.setFontSize(10);
  doc.text('Description', 20, 120);
  doc.text(`Amount (${currencySymbol})`, 170, 120, { align: 'right' });
  doc.line(20, 122, 190, 122);

  doc.text('Basic Salary', 20, 130);
  doc.text(employee.monthlyIncome.toLocaleString(), 170, 130, { align: 'right' });

  doc.text(`Deductions (Income Tax ${settings.taxRate}%)`, 20, 140);
  doc.setTextColor(220, 38, 38); // Red 600
  doc.text(`- ${taxAmount.toLocaleString()}`, 170, 140, { align: 'right' });

  // Total
  doc.setTextColor(51, 65, 85);
  doc.setDrawColor(51, 65, 85);
  doc.line(20, 150, 190, 150);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Net Pay:', 20, 165);
  doc.text(`${currencySymbol}${netPay.toLocaleString()}`, 170, 165, { align: 'right' });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('This is a computer generated document and does not require a signature.', 105, 280, { align: 'center' });

  doc.save(`payslip_${employee.fullName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};
