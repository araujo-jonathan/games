import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Globe, Wallet } from 'lucide-react';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

const Onboarding = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      id: 1,
      icon: <Wallet className="w-8 h-8 text-primary" />,
      title: t('carousel.1.title'),
      desc: t('carousel.1.desc')
    },
    {
      id: 2,
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: t('carousel.2.title'),
      desc: t('carousel.2.desc')
    },
    {
      id: 3,
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: t('carousel.3.title'),
      desc: t('carousel.3.desc')
    }
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col p-5 overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Language Toggle */}
      <button 
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
        className="absolute top-4 right-4 text-text-muted text-xs font-bold border border-white/10 px-2 py-1 rounded-md z-50"
      >
        {language.toUpperCase()}
      </button>

      {/* Logo */}
      <div className="flex flex-col items-center pt-8 pb-4">
        <img src="/logo.png" alt="Game Coin" className="w-16 h-16 mb-2" />
        <span className="text-white text-xl font-bold tracking-tight">Game Coin</span>
      </div>

      {/* Slogan */}
      <div className="text-center px-4 mb-4">
        <h1 className="text-white text-2xl font-bold leading-tight mb-2">
          {t('app.slogan')}
        </h1>
        <p className="text-text-muted text-sm">
          {t('app.sub_slogan')}
        </p>
      </div>

      {/* Carousel */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div 
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar px-2"
          onScroll={handleScroll}
        >
          {features.map((feat) => (
            <div 
              key={feat.id} 
              className="snap-center min-w-full flex flex-col items-center px-4"
            >
              <div className="w-full aspect-[4/3] max-h-[180px] rounded-2xl bg-gradient-to-br from-primary/10 to-surface flex items-center justify-center border border-white/5 mb-4">
                {feat.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-1 text-center">{feat.title}</h3>
              <p className="text-text-muted text-xs text-center max-w-[250px]">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {features.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-surface'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Buttons - Always at bottom */}
      <div className="flex flex-col gap-3 pt-4 pb-2">
        <Button onClick={() => navigate('/create-account')} fullWidth>
          {t('btn.create_account')}
        </Button>
        <Button onClick={() => navigate('/login')} variant="secondary" fullWidth>
          {t('btn.login')}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;