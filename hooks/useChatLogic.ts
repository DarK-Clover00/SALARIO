
import { useState, useCallback } from 'react';
import { ChatMessage, Employee, User } from '../types';
import { geminiService } from '../services/geminiService';

interface ChatActions {
  onOpenAddEmployee: () => void;
  onNavigate: (tab: string) => void;
}

export const useChatLogic = (user: User, employees: Employee[], actions: ChatActions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: `Hello ${user.username}! I see you are the Administrator. How can I help you with payroll today?` 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const processMessage = useCallback(async (input: string) => {
    const query = input.toLowerCase();
    let responseText = '';
    let shouldCallAI = false;

    // Smart Local Scenarios
    if (query.includes('savings')) {
      responseText = "Your current savings margin is **₹165,000**, which is 12% above the projected budget.";
    } else if (query.includes('efficiency') || query.includes('utilization')) {
      responseText = "The Efficiency Ratio is currently at **67.0%**. Would you like to see the detailed report?";
    } else if (query.includes('payslip') || query.includes('download')) {
      responseText = "I can help with that. Please go to the 'Employees' tab to select a specific employee, or click here to generate the latest batch.";
      // Note: We could enhance this with a custom component injection if needed
    } else if (query.includes('add employee') || query.includes('new employee') || query.includes('register')) {
      responseText = "Opening the registration form for you...";
      actions.onNavigate('employees');
      actions.onOpenAddEmployee();
    } else {
      shouldCallAI = true;
    }

    if (shouldCallAI) {
      setIsLoading(true);
      try {
        const aiResponse = await geminiService.getChatResponse(input, employees);
        responseText = aiResponse;
      } catch (err) {
        responseText = "I am currently in training mode. I can help with Savings, Efficiency stats, and Navigation. Please try one of those topics!";
      }
      setIsLoading(false);
    }

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
  }, [user, employees, actions]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    await processMessage(text);
  };

  return {
    messages,
    sendMessage,
    isLoading
  };
};
