import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Globe, Wallet, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

const Onboarding = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      id: 1,
      icon: <Wallet className="w-12 h-12 text-primary mb-4" />,
      imgClass: "bg-gradient-to-br from-emerald-900 to-slate-900",
      title: t('carousel.1.title'),
      desc: t('carousel.1.desc')
    },
    {
      id: 2,
      icon: <Shield className="w-12 h-12 text-primary mb-4" />,
      imgClass: "bg-gradient-to-br from-slate-800 to-black",
      title: t('carousel.2.title'),
      desc: t('carousel.2.desc')
    },
    {
      id: 3,
      icon: <Globe className="w-12 h-12 text-primary mb-4" />,
      imgClass: "bg-gradient-to-br from-primary/20 to-slate-900",
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
    <div className="flex flex-col min-h-screen bg-background p-6 animate-fade-in relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Language Toggle (Small absolute top right) */}
      <button 
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
        className="absolute top-6 right-6 text-text-muted text-xs font-bold border border-white/10 px-2 py-1 rounded-md z-50"
      >
        {language.toUpperCase()}
      </button>

      <div className="flex-1 flex flex-col justify-center items-center mt-8">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="text-primary w-10 h-10" fill="currentColor" fillOpacity={0.2} />
          <span className="text-white text-3xl font-bold tracking-tight">Game Coin</span>
        </div>

        <h1 className="text-white text-3xl md:text-4xl font-bold text-center leading-tight mb-4 max-w-xs">
          {t('app.slogan')}
        </h1>
        <p className="text-text-muted text-center max-w-xs mb-8">
          {t('app.sub_slogan')}
        </p>

        {/* Carousel */}
        <div 
          className="flex overflow-x-auto w-full max-w-sm gap-4 snap-x snap-mandatory no-scrollbar pb-4"
          onScroll={handleScroll}
        >
          {features.map((feat) => (
            <div key={feat.id} className="snap-center min-w-full flex flex-col items-center">
              <div className={`w-full aspect-square rounded-3xl mb-6 ${feat.imgClass} flex items-center justify-center border border-white/5 shadow-2xl`}>
                {feat.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{feat.title}</h3>
              <p className="text-text-muted text-sm text-center max-w-[250px]">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex gap-2 mt-4 mb-8">
          {features.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-surface'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <Button onClick={() => navigate('/create-account')} fullWidth>{t('btn.create_account')}</Button>
        <Button onClick={() => navigate('/login')} variant="secondary" fullWidth>{t('btn.login')}</Button>
      </div>
    </div>
  );
};

export default Onboarding;