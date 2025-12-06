// Mock data for development and fallback

import { Product, TestSession } from '../services/public.service';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Daily Practice Test',
    product_type: 'daily',
    price: 29.00,
    has_reading: true,
    has_listening: true,
    has_writing: false,
    has_speaking: false,
    has_invigilator: false,
  },
  {
    id: 2,
    name: 'Pretest Pro',
    product_type: 'full',
    price: 89.00,
    has_reading: true,
    has_listening: true,
    has_writing: true,
    has_speaking: true,
    has_invigilator: true,
  },
];

export const MOCK_SESSIONS: TestSession[] = [
  {
    id: 1,
    product: MOCK_PRODUCTS[1],
    session_date: '2024-12-15',
    session_time: '09:00:00',
    max_participants: 20,
    available_slots: 5,
  },
  {
    id: 2,
    product: MOCK_PRODUCTS[1],
    session_date: '2024-12-16',
    session_time: '14:00:00',
    max_participants: 20,
    available_slots: 12,
  },
  {
    id: 3,
    product: MOCK_PRODUCTS[0],
    session_date: '2024-12-17',
    session_time: '10:00:00',
    max_participants: 15,
    available_slots: 8,
  },
  {
    id: 4,
    product: MOCK_PRODUCTS[0],
    session_date: '2024-12-18',
    session_time: '16:00:00',
    max_participants: 15,
    available_slots: 3,
  },
  {
    id: 5,
    product: MOCK_PRODUCTS[1],
    session_date: '2024-12-20',
    session_time: '09:00:00',
    max_participants: 20,
    available_slots: 15,
  },
  {
    id: 6,
    product: MOCK_PRODUCTS[0],
    session_date: '2024-12-21',
    session_time: '11:00:00',
    max_participants: 15,
    available_slots: 0,
  },
];

export const MOCK_FEEDBACK_OPTIONS = [
  {
    id: 1,
    name: 'Writing Task 1 Feedback',
    price: '15.00',
  },
  {
    id: 2,
    name: 'Writing Task 2 Feedback',
    price: '20.00',
  },
  {
    id: 3,
    name: 'Speaking Practice Feedback',
    price: '25.00',
  },
  {
    id: 4,
    name: 'Complete Writing Feedback',
    price: '30.00',
  },
];

export const MOCK_ABOUT_CARDS = [
  {
    id: 1,
    title: 'Expert IELTS Examiners',
    description: 'All our mock tests are evaluated by certified IELTS examiners with 10+ years of experience.',
    icon: 'Award',
  },
  {
    id: 2,
    title: 'Real Exam Conditions',
    description: 'Experience the actual IELTS test environment with strict timing and professional invigilators.',
    icon: 'Clock',
  },
  {
    id: 3,
    title: 'Detailed Video Feedback',
    description: 'Get personalized video feedback on your writing and speaking from expert tutors.',
    icon: 'Video',
  },
  {
    id: 4,
    title: 'Official Test Format',
    description: 'Our tests follow the exact IELTS format including all four modules and official scoring criteria.',
    icon: 'FileText',
  },
];

export const MOCK_TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Chief IELTS Examiner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: '15 years of IELTS examining experience',
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    role: 'Speaking Specialist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Former IELTS Speaking examiner',
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Writing Expert',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Specialized in Academic Writing',
  },
];

export const MOCK_INSTITUTIONS = [
  {
    id: 1,
    name: 'British Council',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
  },
  {
    id: 2,
    name: 'Cambridge Assessment',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
  },
  {
    id: 3,
    name: 'IDP Education',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200',
  },
];

export const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name: 'Jasur Karimov',
    score: 8.5,
    text: 'Pretest helped me achieve my target score! The mock tests were incredibly realistic and the video feedback was invaluable.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    date: '2024-11-15',
  },
  {
    id: 2,
    name: 'Dilnoza Rashidova',
    score: 7.5,
    text: 'The expert feedback on my writing improved my band score by 1.5 points. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    date: '2024-11-10',
  },
  {
    id: 3,
    name: 'Bekzod Aliyev',
    score: 8.0,
    text: 'Professional service and accurate scoring. The full simulation tests prepared me perfectly for the real exam.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    date: '2024-11-05',
  },
];

export const MOCK_FOOTER_INFO = {
  contact: {
    email: 'info@pretest.uz',
    phone: '+998 90 123 45 67',
    address: 'Tashkent, Uzbekistan'
  },
  socialMedia: [
    { 
      id: '1',
      platform: 'Telegram', 
      icon: 'telegram',
      url: 'https://t.me/pretest',
      order: 1
    },
    { 
      id: '2',
      platform: 'Instagram', 
      icon: 'instagram',
      url: 'https://instagram.com/pretest',
      order: 2
    },
    { 
      id: '3',
      platform: 'Facebook', 
      icon: 'facebook',
      url: 'https://facebook.com/pretest',
      order: 3
    },
    { 
      id: '4',
      platform: 'Youtube', 
      icon: 'youtube',
      url: 'https://youtube.com/@pretest',
      order: 4
    },
  ]
};