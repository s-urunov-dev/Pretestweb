import { motion } from "motion/react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { landingService, SiteInfo } from "../services/landing.service";
import { MOCK_FOOTER_INFO } from "../data/mock-data";
import { useLanguage } from "../contexts/LanguageContext";
import { fadeInUp, staggerItem } from "../utils/animations";

// Icon mapping for social media
const iconMap: Record<string, any> = {
  'facebook': Facebook,
  'twitter': Twitter,
  'instagram': Instagram,
  'linkedin': Linkedin,
  'youtube': Youtube,
  'telegram': Send, // Using Send icon for Telegram
};

interface SocialMedia {
  id: string;
  platform: string;
  icon: string;
  url: string;
  order: number;
}

export function Footer() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    loadFooterInfo();
  }, []);

  const loadFooterInfo = async () => {
    try {
      const data = await landingService.getSiteInfo();
      if (data) {
        setSiteInfo(data);
      }
    } catch (error) {
      console.error('Failed to load site info:', error);
      // Use mock data on error
      setSiteInfo({
        email: MOCK_FOOTER_INFO.contact.email,
        phone_number: MOCK_FOOTER_INFO.contact.phone,
        address: MOCK_FOOTER_INFO.contact.address,
        social_media: MOCK_FOOTER_INFO.socialMedia.map(sm => ({
          id: parseInt(sm.id),
          platform: sm.platform,
          icon: sm.icon,
          url: sm.url,
          order: sm.order,
        })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName.toLowerCase()] || Facebook;
  };

  // Use backend data if available, otherwise use defaults
  const contactEmail = siteInfo?.email || "info@pretest.com";
  const contactPhone = siteInfo?.phone_number || "+998 (77) 101-69-00";
  const contactAddress = siteInfo?.address || t.footer.address;
  const locationUrl = siteInfo?.location || "#";
  const description = siteInfo?.description || t.footer.description;
  
  // Build social media links from site info
  const socialLinks: SocialMedia[] = [];
  if (siteInfo) {
    if (siteInfo.facebook) socialLinks.push({ id: '1', platform: 'Facebook', icon: 'facebook', url: siteInfo.facebook, order: 1 });
    if (siteInfo.instagram) socialLinks.push({ id: '2', platform: 'Instagram', icon: 'instagram', url: siteInfo.instagram, order: 2 });
    if (siteInfo.telegram) socialLinks.push({ id: '3', platform: 'Telegram', icon: 'telegram', url: siteInfo.telegram, order: 3 });
    if (siteInfo.youtube) socialLinks.push({ id: '4', platform: 'YouTube', icon: 'youtube', url: siteInfo.youtube, order: 4 });
    if (siteInfo.linkedin) socialLinks.push({ id: '5', platform: 'LinkedIn', icon: 'linkedin', url: siteInfo.linkedin, order: 5 });
    if (siteInfo.twitter) socialLinks.push({ id: '6', platform: 'Twitter', icon: 'twitter', url: siteInfo.twitter || '#', order: 6 });
  }

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div {...fadeInUp}>
              <div className="text-[#182966] mb-4">Pretest</div>
              <p className="text-[#182966]/70 mb-6 max-w-xs">
                {description}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-[#182966]/70">
                  <Mail className="h-4 w-4 mt-0.5" />
                  <a href={`mailto:${contactEmail}`} className="hover:text-[#182966]">
                    {contactEmail}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-[#182966]/70">
                  <Phone className="h-4 w-4 mt-0.5" />
                  <a href={`tel:${contactPhone.replace(/\\s/g, '')}`} className="hover:text-[#182966]">
                    {contactPhone}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-[#182966]/70">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <a 
                    href={locationUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#182966] transition-colors cursor-pointer"
                  >
                    {contactAddress}
                  </a>
                </div>
              </div>

              {/* Location Note for SEO */}
              <p className="mt-4 text-xs text-[#182966]/60 italic max-w-xs">
                {t.footer.locationNote}
              </p>
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div {...staggerItem(0, 0.05)}>
            <h4 className="mb-4 text-[#182966]">{t.footer.product}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.pricing}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.videoFeedback}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div {...staggerItem(1, 0.05)}>
            <h4 className="mb-4 text-[#182966]">{t.footer.company}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.aboutUs}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.ourTeam}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.contact}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div {...staggerItem(2, 0.05)}>
            <h4 className="mb-4 text-[#182966]">{t.footer.resources}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.ieltsGuide}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.blog}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.faqs}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.successStories}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div {...staggerItem(3, 0.05)}>
            <h4 className="mb-4 text-[#182966]">{t.footer.legal}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.terms}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.cookiePolicy}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                  {t.footer.refundPolicy}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#182966]/60">
            {t.footer.copyright}
          </p>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = getIcon(social.icon);
                return (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-[#182966]/5 hover:bg-[#182966]/10 flex items-center justify-center text-[#182966] transition-colors"
                    aria-label={social.platform}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
