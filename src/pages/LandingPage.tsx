import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Hero } from "../components/Hero";
import { FeaturesGrid } from "../components/FeaturesGrid";
import { PricingTable } from "../components/PricingTable";
import { TestSessions } from "../components/TestSessions";
import { Feedback } from "../components/Feedback";
import { About } from "../components/About";
import { Partners } from "../components/Partners";
import { Testimonials } from "../components/Testimonials";
import { CTASection } from "../components/CTASection";
import { Footer } from "../components/Footer";
import { Snowfall } from "../components/Snowfall";
import { SEOHead } from "../components/SEOHead";

export interface BookingData {
    productId?: number;
    productName?: string;
    productPrice?: number;
    sessionId?: number;
    step?: 'test' | 'session' | 'payment';
}

export function LandingPage() {
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState<BookingData | null>(null);

    const handleBookTest = (data: BookingData) => {
        setBookingData(data);
        // Check if user is authenticated
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/dashboard', { state: { bookingData: data } });
        } else {
            navigate('/login', { state: { bookingData: data } });
        }
    };

    return (
        <>
            <SEOHead
                title="Pre-test.uz - Online IELTS Mock Test Platform | Practice & Improve Your English"
                description="Pre-test.uz - O'zbekistonda №1 IELTS tayyorlov platformasi. Pretest Pro, Daily Practice testlari va sobiq IELTS ekspertlaridan video feedback. Ielts reading, listening, writing va speaking ko'nikmalaringizni oshiring."
                keywords="IELTS test, IELTS mock test, IELTS practice Uzbekistan, IELTS Tashkent, IELTS preparation, IELTS exam, Pretest Pro, Daily Practice Test, speaking feedback, writing feedback, IELTS online, IELTS training Uzbekistan, IELTS ekspert, Pre-test.uz"
                canonicalUrl="https://pre-test.uz"
            />
            <Navigation />
            <Hero />
            <FeaturesGrid />
            <PricingTable />
            <TestSessions onBookTest={handleBookTest} />
            <Feedback />
            <About />
            <Partners />
            <Testimonials />
            <CTASection />
            <Footer />
            <Snowfall />
        </>
    );
}