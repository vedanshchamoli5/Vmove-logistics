import React from 'react';
import { HeroSection } from '../components/website/HeroSection';
import { ServicesSection } from '../components/website/ServicesSection';
import { WhyChooseSection } from '../components/website/WhyChooseSection';
import { HowItWorksSection } from '../components/website/HowItWorksSection';
import { NetworkSection } from '../components/website/NetworkSection';
import { ContactCTASection } from '../components/website/ContactCTASection';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <main>
      <HeroSection onNavigate={onNavigate} />
      <ServicesSection onNavigate={onNavigate} />
      <WhyChooseSection />
      <HowItWorksSection />
      <NetworkSection onNavigate={onNavigate} />
      <ContactCTASection onNavigate={onNavigate} />
    </main>
  );
};
