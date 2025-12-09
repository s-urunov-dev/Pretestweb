import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Calendar, Clock, Users } from "lucide-react";
import { publicService, TestSession } from "../services/public.service";
import { authService } from "../services/auth.service";
import { MOCK_SESSIONS } from "../data/mock-data";
import { useLanguage } from "../contexts/LanguageContext";
import { SessionCalendar } from "./SessionCalendar";

export function TestSessions() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // null = show all sessions
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [allSessions, setAllSessions] = useState<TestSession[]>([]); // Store all sessions for type detection
  const [isLoading, setIsLoading] = useState(true);
  const [availableTestTypes, setAvailableTestTypes] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBookTest = (bookingData: { sessionId: number; productId: number; productName: string; productPrice: number; step: 'payment' }) => {
    if (authService.isAuthenticated()) {
      // Save booking data and navigate to dashboard
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/dashboard');
    } else {
      // Save booking data and navigate to login
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/login');
    }
  };

  // Load all sessions once to detect available types
  useEffect(() => {
    const loadAllSessions = async () => {
      try {
        const response = await publicService.getTestSessions();
        if (response.success && response.data) {
          setAllSessions(response.data);
          const types = new Set(response.data.map(session => session.product.product_type));
          setAvailableTestTypes(types);
          
          // If only one type exists, auto-select it
          if (types.size === 1) {
            const singleType = Array.from(types)[0];
            setSelectedType(singleType === 'full' ? 'full-simulation' : 'daily-practice');
          }
        }
      } catch (error) {
        console.error('Failed to load all sessions:', error);
        // Use mock data on error
        setAllSessions(MOCK_SESSIONS);
        const types = new Set(MOCK_SESSIONS.map(session => session.product.product_type));
        setAvailableTestTypes(types);
      }
    };
    
    loadAllSessions();
  }, []);

  const loadTestSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const testType = selectedType === "all" ? undefined : selectedType;
      const response = await publicService.getTestSessions(testType);
      
      if (response.success && response.data) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error('Failed to load test sessions:', error);
      // Use mock data on error
      const filteredSessions = selectedType === "all" 
        ? MOCK_SESSIONS 
        : MOCK_SESSIONS.filter(s => {
            if (selectedType === 'full-simulation') return s.product.product_type === 'full';
            if (selectedType === 'daily-practice') return s.product.product_type === 'daily';
            return true;
          });
      setSessions(filteredSessions);
    } finally {
      setIsLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    loadTestSessions();
  }, [loadTestSessions]);

  // Format date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format time
  const formatTime = (timeStr: string): string => {
    const time = new Date(`2000-01-01T${timeStr}`);
    return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Get day name
  const getDayName = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Calculate progress percentage
  const getProgressPercentage = (session: TestSession): number => {
    if (session.max_participants === 0) return 0;
    const booked = session.max_participants - session.available_slots;
    return (booked / session.max_participants) * 100;
  };

  // Get filtered sessions
  const filteredSessions = selectedDate
    ? sessions.filter(session => session.session_date === selectedDate)
    : [];

  if (isLoading) {
    return (
      <section id="sessions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-[#182966]">{t.testSessions.availableSessions}</h2>
            <p className="max-w-2xl mx-auto text-[#182966]/70">{t.common.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sessions" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-[#182966]">{t.testSessions.availableSessions}</h2>
          <p className="max-w-2xl mx-auto text-[#182966]/70">
            {t.testSessions.availableDesc}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        {availableTestTypes.size > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-12 px-4"
          >
            {[
              { id: "all", label: "All Sessions", show: availableTestTypes.size > 1 },
              { id: "full-simulation", label: "Pretest Pro", show: availableTestTypes.has('full') },
              { id: "daily-practice", label: "Pretest Lite", show: availableTestTypes.has('daily') },
            ]
              .filter(tab => tab.show)
              .map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  variant={selectedType === tab.id ? "default" : "outline"}
                  className={`w-full sm:w-auto ${
                    selectedType === tab.id
                      ? "bg-[#182966] hover:bg-[#182966]/90 text-white"
                      : "border-[#182966]/30 text-[#182966] hover:bg-[#182966]/5"
                  }`}
                >
                  {tab.label}
                </Button>
              ))
            }
          </motion.div>
        )}

        {/* Date Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-8 px-4"
        >
          <SessionCalendar
            sessions={sessions}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </motion.div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {!selectedDate ? (
            <div className="col-span-2 text-center py-12">
              <Calendar className="h-16 w-16 text-[#182966]/30 mx-auto mb-4" />
              <p className="text-[#182966]/70 text-lg mb-2">{t.testSessions.pleaseSelectDate}</p>
              <p className="text-[#182966]/50 text-sm">{t.testSessions.chooseDateWithSessions}</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-[#182966]/70">
              {t.testSessions.noSessionsForSelectedDate}
            </div>
          ) : (
            filteredSessions.map((session, index) => {
              const progressPercentage = getProgressPercentage(session);
              const isFullSimulation = session.product.product_type === 'full';
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredId(session.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  whileHover={{ scale: 1.02 }}
                  className={`border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all cursor-pointer ${
                    isFullSimulation
                      ? "bg-[#182966] border-[#182966]"
                      : "bg-[#FFF8F0] border-gray-100 hover:border-[#182966]/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className={`h-5 w-5 ${isFullSimulation ? "text-white" : "text-[#182966]"}`} />
                        <span className={isFullSimulation ? "text-white" : "text-[#182966]"}>{formatDate(session.session_date)}</span>
                      </div>
                      <div className={`text-sm ${isFullSimulation ? "text-white/80" : "text-[#182966]/60"}`}>{getDayName(session.session_date)}</div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        isFullSimulation
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-[#182966]/70"
                      }`}
                    >
                      {isFullSimulation ? t.testSessions.fullTest : "Practice"}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className={isFullSimulation ? "text-white" : "text-[#182966]"}>{session.product.name}</h4>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className={`flex items-center gap-2 ${isFullSimulation ? "text-white/80" : "text-[#182966]/70"}`}>
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatTime(session.session_time)}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isFullSimulation ? "text-white/80" : "text-[#182966]/70"}`}>
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {session.available_slots} {t.common.of} {session.max_participants} {t.products.seatsAvailable}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className={`w-full rounded-full h-2 overflow-hidden ${isFullSimulation ? "bg-white/20" : "bg-gray-100"}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progressPercentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-full rounded-full ${isFullSimulation ? "bg-white" : "bg-[#182966]"}`}
                      />
                    </div>
                  </div>

                  <Button
                    className={`w-full transition-all ${
                      isFullSimulation
                        ? "bg-white text-[#182966] hover:bg-white/90"
                        : "bg-[#182966] text-white hover:bg-[#182966]/90"
                    }`}
                    disabled={session.available_slots === 0}
                    onClick={() => {
                      if (session.available_slots > 0) {
                        handleBookTest({
                          sessionId: session.id,
                          productId: session.product.id,
                          productName: session.product.name,
                          productPrice: session.product.price,
                          step: 'payment'
                        });
                      }
                    }}
                  >
                    {session.available_slots === 0 ? 'Fully Booked' : t.products.bookSession}
                  </Button>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}