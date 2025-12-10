import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { TestSession } from "../services/public.service";
import { useLanguage } from "../contexts/LanguageContext";

interface SessionCalendarProps {
  sessions: TestSession[];
  onDateSelect: (date: string | null) => void;
  selectedDate: string | null;
  compact?: boolean;
}

export function SessionCalendar({ sessions, onDateSelect, selectedDate, compact = false }: SessionCalendarProps) {
  const { t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get unique dates with sessions
  const sessionDates = useMemo(() => {
    const dates = new Set<string>();
    sessions.forEach(session => {
      dates.add(session.session_date);
    });
    return dates;
  }, [sessions]);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    const day = startDate.getDay();
    startDate.setDate(startDate.getDate() - (day === 0 ? 6 : day - 1)); // Start from Monday
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks (42 days) to ensure full calendar
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const hasSession = (date: Date): boolean => {
    return sessionDates.has(formatDateString(date));
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate === formatDateString(date);
  };

  const handleDateClick = (date: Date) => {
    if (!isCurrentMonth(date)) return;
    
    const dateStr = formatDateString(date);
    if (hasSession(date)) {
      onDateSelect(dateStr);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className={`${compact ? 'max-w-md' : 'max-w-2xl'} mx-auto`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="border-[#182966]/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-[#182966]" />
          <h3 className="text-[#182966]">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="border-[#182966]/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-[#182966]/10 p-3 sm:p-4">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs text-[#182966]/60 py-1 font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarDays.map((date, index) => {
            const dateStr = formatDateString(date);
            const hasSessionOnDate = hasSession(date);
            const isSelectedDate = isSelected(date);
            const isTodayDate = isToday(date);
            const isInCurrentMonth = isCurrentMonth(date);

            return (
              <motion.button
                key={dateStr}
                whileHover={hasSessionOnDate && isInCurrentMonth ? { scale: 1.05 } : {}}
                whileTap={hasSessionOnDate && isInCurrentMonth ? { scale: 0.95 } : {}}
                onClick={() => handleDateClick(date)}
                disabled={!hasSessionOnDate || !isInCurrentMonth}
                className={`
                  aspect-square rounded-md text-xs sm:text-sm transition-colors flex items-center justify-center font-medium
                  ${!isInCurrentMonth ? 'text-gray-300 cursor-default' : ''}
                  ${isInCurrentMonth && !hasSessionOnDate ? 'text-gray-400 cursor-not-allowed' : ''}
                  ${hasSessionOnDate && isInCurrentMonth ? 'cursor-pointer' : ''}
                  ${isSelectedDate ? 'bg-[#182966] text-white' : ''}
                  ${!isSelectedDate && hasSessionOnDate && isInCurrentMonth ? 'bg-[#182966]/10 text-[#182966] hover:bg-[#182966]/20' : ''}
                  ${isTodayDate && !isSelectedDate ? 'border-2 border-[#182966]/50' : ''}
                `}
              >
                {date.getDate()}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-xs text-[#182966]/60">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#182966]/10" />
          <span>{t.testSessions.hasSessions}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[#182966]" />
          <span>{t.testSessions.selected}</span>
        </div>
      </div>
    </div>
  );
}