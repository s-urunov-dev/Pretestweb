import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DashboardLayout } from './DashboardLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { User, Phone, Lock, CheckCircle2, CreditCard } from "lucide-react";
import { authService } from "../services/auth.service";
import { useLanguage } from "../contexts/LanguageContext";

export function ProfilePage() {
  const { t } = useLanguage();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileMessageType, setProfileMessageType] = useState<"success" | "error">("success");

  const [profileData, setProfileData] = useState({
    full_name: "",
    phone_number: "",
    passport_serial: "",
    passport_serial_number: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading user data from API...');
      
      // Always fetch fresh data from API
      const user = await authService.fetchUserInfo();
      console.log('✅ User data loaded:', user);

      if (user) {
        setProfileData({
          full_name: user.full_name || "",
          phone_number: user.phone_number || "",
          passport_serial: user.passport_serial || "",
          passport_serial_number: user.passport_serial_number || "",
        });
      } else {
        console.error('❌ No user data returned from API');
      }
    } catch (error) {
      console.error("❌ Failed to load user data:", error);
      
      // Fallback to localStorage if API fails
      const cachedUser = authService.getCurrentUser();
      if (cachedUser) {
        console.log('📦 Using cached user data:', cachedUser);
        setProfileData({
          full_name: cachedUser.full_name || "",
          phone_number: cachedUser.phone_number || "",
          passport_serial: cachedUser.passport_serial || "",
          passport_serial_number: cachedUser.passport_serial_number || "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = async () => {
    console.log('💾 Saving profile...');
    
    // Validation
    const errors: string[] = [];
    
    // Full Name validation - only letters and spaces
    if (!profileData.full_name.trim()) {
      errors.push("Full name is required");
    } else if (!/^[A-Za-z\s]+$/.test(profileData.full_name)) {
      errors.push("Full name can only contain letters and spaces");
    }
    
    // Passport Serial validation - exactly 2 uppercase letters
    if (!profileData.passport_serial.trim()) {
      errors.push("Passport serial is required");
    } else if (!/^[A-Z]{2}$/.test(profileData.passport_serial)) {
      errors.push("Passport serial must be exactly 2 uppercase letters (e.g., AA, AB)");
    }
    
    // Passport Serial Number validation - exactly 7 digits
    if (!profileData.passport_serial_number.trim()) {
      errors.push("Passport number is required");
    } else if (!/^\d{7}$/.test(profileData.passport_serial_number)) {
      errors.push("Passport number must be exactly 7 digits");
    }
    
    // Show validation errors
    if (errors.length > 0) {
      setProfileMessage(errors.join(". ") + ".");
      setProfileMessageType("error");
      return;
    }
    
    setIsProfileSaving(true);
    setProfileMessage("");

    try {
      await authService.updateProfile({
        full_name: profileData.full_name.trim(),
        passport_serial: profileData.passport_serial.trim().toUpperCase(),
        passport_serial_number: profileData.passport_serial_number.trim(),
      });

      setProfileMessage("Profile updated successfully!");
      setProfileMessageType("success");
      setIsEditingProfile(false);
      
      console.log('✅ Profile saved successfully');
    } catch (error: any) {
      console.error("❌ Failed to save profile:", error);
      setProfileMessage(error.message || "Failed to update profile. Please try again.");
      setProfileMessageType("error");
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (!passwordData.currentPassword) {
      alert("Please enter your current password");
      return;
    }
    
    try {
      console.log('🔐 Updating password...');
      
      // Call API to update password
      await authService.updatePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      console.log('✅ Password updated successfully');
    } catch (error: any) {
      console.error('❌ Failed to update password:', error);
      alert(error?.data?.message || error?.message || 'Failed to update password. Please check your current password and try again.');
    }
  };

  return (
    <DashboardLayout currentPage="profile">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl sm:text-3xl mb-2 text-[#182966]">{t.profile.profileSettings}</h1>
          <p className="text-sm sm:text-base text-gray-600">{t.profile.manageAccount}</p>
        </motion.div>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Changes saved successfully!</span>
          </motion.div>
        )}

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-[#182966] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </Card>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
                  <h2 className="text-lg sm:text-xl text-[#182966]">Personal Information</h2>
                  {!isEditingProfile && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(true);
                        setProfileMessage("");
                      }}
                      className="border-[#182966] text-[#182966] w-full sm:w-auto"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>

                {/* Validation Message */}
                {profileMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-lg border ${
                      profileMessageType === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {profileMessageType === "success" ? (
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-sm">{profileMessage}</span>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => {
                          // Allow only letters and spaces
                          const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                          setProfileData({ ...profileData, full_name: value });
                        }}
                        className="pl-10"
                        disabled={!isEditingProfile}
                        placeholder="e.g., John Doe"
                      />
                    </div>
                    {isEditingProfile && (
                      <p className="text-xs text-gray-500 mt-1">Only letters and spaces allowed</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone_number}
                        className="pl-10 bg-gray-50 cursor-not-allowed"
                        disabled={true}
                        title="Phone number cannot be changed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed for security reasons</p>
                  </div>

                  <div>
                    <Label htmlFor="passport_serial">Passport Serial</Label>
                    <div className="relative mt-2">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="passport_serial"
                        type="text"
                        value={profileData.passport_serial}
                        onChange={(e) => {
                          // Allow only uppercase letters, max 2 characters
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z]/g, '')
                            .slice(0, 2);
                          setProfileData({ ...profileData, passport_serial: value });
                        }}
                        className="pl-10 uppercase"
                        disabled={!isEditingProfile}
                        placeholder="AA"
                        maxLength={2}
                      />
                    </div>
                    {isEditingProfile && (
                      <p className="text-xs text-gray-500 mt-1">Exactly 2 uppercase letters (e.g., AA, AB, AC)</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="passport_serial_number">Passport Number</Label>
                    <div className="relative mt-2">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="passport_serial_number"
                        type="text"
                        value={profileData.passport_serial_number}
                        onChange={(e) => {
                          // Allow only numbers, max 7 digits
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 7);
                          setProfileData({ ...profileData, passport_serial_number: value });
                        }}
                        className="pl-10"
                        disabled={!isEditingProfile}
                        placeholder="1234567"
                        maxLength={7}
                      />
                    </div>
                    {isEditingProfile && (
                      <p className="text-xs text-gray-500 mt-1">Exactly 7 digits</p>
                    )}
                  </div>

                  {isEditingProfile && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileMessage("");
                          loadUserData(); // Reset to original data
                        }} 
                        className="flex-1 w-full"
                        disabled={isProfileSaving}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleProfileSave} 
                        className="flex-1 w-full bg-[#182966] hover:bg-[#182966]/90"
                        disabled={isProfileSaving}
                      >
                        {isProfileSaving ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
                  <h2 className="text-lg sm:text-xl text-[#182966]">Password</h2>
                  {!isChangingPassword && (
                    <Button
                      variant="outline"
                      onClick={() => setIsChangingPassword(true)}
                      className="border-[#182966] text-[#182966] w-full sm:w-auto"
                    >
                      Change Password
                    </Button>
                  )}
                </div>

                {isChangingPassword ? (
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="••••••••"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="••••••••"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handlePasswordChange} className="flex-1 bg-[#182966] hover:bg-[#182966]/90">
                        Update Password
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Keep your account secure by using a strong password</p>
                )}
              </Card>
            </motion.div>

            {/* Account Statistics - Temporarily disabled, will be implemented later */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="text-xl mb-4 text-[#182966]">Account Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                    <p className="text-lg text-[#182966]">Oct 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tests Taken</p>
                    <p className="text-lg text-[#182966]">5</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Feedback Received</p>
                    <p className="text-lg text-[#182966]">9</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hours Practiced</p>
                    <p className="text-lg text-[#182966]">24</p>
                  </div>
                </div>
              </Card>
            </motion.div> */}

            {/* Danger Zone - Temporarily disabled, will be implemented later */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6 border-red-200">
                <h2 className="text-xl mb-2 text-red-600">Danger Zone</h2>
                <p className="text-gray-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Delete Account
                </Button>
              </Card>
            </motion.div> */}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}