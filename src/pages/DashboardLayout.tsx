import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { LayoutDashboard, MessageSquare, User, LogOut, Menu, X, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { locales } from "../locales";
import { PretestLogo } from "../components/PretestLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'feedback' | 'profile';
}

export function DashboardLayout({
  children,
  currentPage,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const { t, locale, setLocale } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t.dashboard.myTests, icon: LayoutDashboard, path: '/dashboard' },
    { id: 'feedback', label: t.nav.feedback, icon: MessageSquare, path: '/feedback' },
    { id: 'profile', label: t.nav.profile, icon: User, path: '/profile' },
  ];

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setShowLogoutDialog(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => navigate('/')}
                className="hover:opacity-70 transition-opacity"
              >
                <PretestLogo className="h-24 sm:h-28 lg:h-32 w-auto" />
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'text-white bg-[#182966]'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Desktop Logout */}
            <div className="hidden md:flex items-center gap-2">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#182966] hover:text-[#182966]/70 gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="hidden lg:inline">
                      {locales.find((loc) => loc.code === locale)?.flag}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-gray-200">
                  {locales.map((loc) => (
                    <DropdownMenuItem
                      key={loc.code}
                      onClick={() => setLocale(loc.code)}
                      className={`cursor-pointer gap-2 ${
                        locale === loc.code ? "bg-[#182966]/10" : ""
                      }`}
                    >
                      <span>{loc.flag}</span>
                      <span>{loc.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                onClick={handleLogoutClick}
                className="flex items-center gap-2 text-[#182966]"
              >
                <LogOut className="h-5 w-5" />
                {t.nav.logout}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#182966] z-50 relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors w-full ${
                        isActive
                          ? 'text-white bg-[#182966]'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
                <motion.button
                  onClick={() => {
                    handleLogoutClick();
                    setIsMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg transition-colors w-full text-gray-600 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t.nav.logout}</span>
                </motion.button>
                
                {/* Mobile Language Switcher */}
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600 px-4 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Til / Language / Язык
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {locales.map((loc) => (
                      <Button
                        key={loc.code}
                        onClick={() => {
                          setLocale(loc.code);
                          setIsMobileMenuOpen(false);
                        }}
                        variant={locale === loc.code ? "default" : "outline"}
                        size="sm"
                        className={`${
                          locale === loc.code
                            ? "bg-[#182966] text-white"
                            : "border-[#182966] text-[#182966]"
                        }`}
                      >
                        <span className="mr-1">{loc.flag}</span>
                        {loc.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to login again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              className="bg-[#182966] hover:bg-[#182966]/90"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}