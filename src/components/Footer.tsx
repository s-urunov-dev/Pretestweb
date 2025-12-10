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

interface FooterInfo {
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  socialMedia: SocialMedia[];
}

const footerLinks = {
  product: [
    { name: "Daily Practice Test", href: "#" },
    { name: "Pretest Pro", href: "#" },
    { name: "Video Feedback", href: "#" },
    { name: "Pricing", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Our Team", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  resources: [
    { name: "IELTS Guide", href: "#" },
    { name: "Blog", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Success Stories", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Refund Policy", href: "#" },
  ],
};

export function Footer() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

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
  const contactPhone = siteInfo?.phone || "+998 (77) 101-69-00";
  const contactAddress = siteInfo?.address || "London, United Kingdom";
  const locationUrl = siteInfo?.location || "#";
  const description = siteInfo?.description || "Your trusted partner for authentic IELTS mock tests and personalized feedback from expert examiners.";
  
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
                <div className="flex items-center gap-2 text-[#182966]/70">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${contactEmail}`} className="hover:text-[#182966]">
                    {contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[#182966]/70">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="hover:text-[#182966]">
                    {contactPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[#182966]/70">
                  <MapPin className="h-4 w-4" />
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
            </motion.div>
          </div>

          {/* Links Columns */}
          <motion.div {...staggerItem(0, 0.05)}>
            <h4 className="mb-4 text-[#182966]">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...staggerItem(1, 0.05)}>
            <h4 className="mb-4 text-[#182966]">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...staggerItem(2, 0.05)}>
            <h4 className="mb-4 text-[#182966]">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...staggerItem(3, 0.05)}>
            <h4 className="mb-4 text-[#182966]">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-[#182966]/70 hover:text-[#182966] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#182966]/60">
            © {new Date().getFullYear()} Pretest. All rights reserved.
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