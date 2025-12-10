import { motion } from "motion/react";
import { 
  Users, Award, TrendingUp, Target, CheckCircle, 
  Globe, Clock, Shield, BookOpen, Zap 
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { publicService } from "../services/public.service";
import { landingService, TeamMember as ApiTeamMember } from "../services/landing.service";
import { MOCK_ABOUT_CARDS, MOCK_TEAM_MEMBERS } from "../data/mock-data";
import { useLanguage } from "../contexts/LanguageContext";
import { fadeInUp, staggerItem } from "../utils/animations";

// Icon mapping for dynamic icons from backend
const iconMap: Record<string, any> = {
  'users': Users,
  'award': Award,
  'trending-up': TrendingUp,
  'target': Target,
  'check-circle': CheckCircle,
  'globe': Globe,
  'clock': Clock,
  'shield': Shield,
  'book-open': BookOpen,
  'zap': Zap,
};

interface AboutCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  experience: string;
  specialization: string[];
  order: number;
}

export function About() {
  const [aboutCards, setAboutCards] = useState<AboutCard[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      setIsLoading(true);
      
      // Load about cards and team members in parallel
      const [cardsResponse, apiTeamMembers] = await Promise.all([
        publicService.getAboutCards(),
        landingService.getTeamMembers(),
      ]);
      
      if (cardsResponse.success && cardsResponse.data) {
        const sortedCards = cardsResponse.data.sort((a: AboutCard, b: AboutCard) => a.order - b.order);
        setAboutCards(sortedCards);
      }
      
      // Convert API team members to our format
      if (apiTeamMembers && apiTeamMembers.length > 0) {
        const convertedTeam: TeamMember[] = apiTeamMembers.map((member: ApiTeamMember) => ({
          id: member.id.toString(),
          name: member.full_name,
          role: member.job,
          bio: '', // API doesn't have bio field
          imageUrl: member.image,
          experience: member.experience,
          specialization: [], // API doesn't have specialization field
          order: member.id, // Use id as order
        }));
        setTeamMembers(convertedTeam);
      }
    } catch (error) {
      console.error('Failed to load about data:', error);
      // Use mock data on error
      const mockCards: AboutCard[] = MOCK_ABOUT_CARDS.map((card) => ({
        id: card.id.toString(),
        title: card.title,
        description: card.description,
        icon: card.icon.toLowerCase().replace(/ /g, '-'),
        color: '#182966',
        order: card.id,
      }));
      setAboutCards(mockCards);
      
      const mockTeam: TeamMember[] = MOCK_TEAM_MEMBERS.map((member) => ({
        id: member.id.toString(),
        name: member.name,
        role: member.role,
        bio: member.bio,
        imageUrl: member.image,
        experience: member.bio,
        specialization: [],
        order: member.id,
      }));
      setTeamMembers(mockTeam);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || CheckCircle;
  };

  if (isLoading) {
    return (
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[#182966]">{t.about.aboutPretest}</h2>
            <p className="max-w-3xl mx-auto text-[#182966]/70">{t.about.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-[#182966]">{t.about.aboutPretest}</h2>
          <p className="max-w-3xl mx-auto text-[#182966]/70 mb-8">
            {t.about.mission}
          </p>
        </motion.div>

        {/* About Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {aboutCards.map((card, index) => {
            const Icon = getIcon(card.icon);
            
            return (
              <motion.div
                key={card.id}
                {...staggerItem(index, 0.05)}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-[#182966]/5 to-[#182966]/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
              >
                <div className="w-12 h-12 bg-[#182966] text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-[#182966] mb-1">{card.title}</div>
                <div className="text-[#182966]/60 text-sm">{card.description}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Team */}
        {teamMembers.length > 0 && (
          <motion.div
            {...fadeInUp}
            className="mb-12"
          >
            <h3 className="text-center mb-12 text-[#182966]">{t.about.meetTeam}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  {...staggerItem(index, 0.05)}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="relative mb-4 overflow-hidden rounded-2xl shadow-lg">
                    <ImageWithFallback
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#182966]/90 via-[#182966]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="text-sm uppercase tracking-wider opacity-80 mb-1">{t.about.experience}</div>
                      <div className="text-lg mb-3">{member.experience}</div>
                      {member.specialization && member.specialization.length > 0 && (
                        <>
                          <div className="text-sm uppercase tracking-wider opacity-80 mb-1">{t.about.specialization}</div>
                          <div className="text-sm opacity-90">{member.specialization.join(', ')}</div>
                        </>
                      )}
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <h4 className="mb-2 text-[#182966]">{member.name}</h4>
                    <p className="text-[#182966]/70 mb-2">{member.role}</p>
                    {member.bio && (
                      <p className="text-[#182966]/50 text-sm leading-relaxed">{member.bio}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}