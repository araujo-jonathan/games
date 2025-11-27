import React from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showLangToggle?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true, showLangToggle = false, onBack }) => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const toggleLang = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-background z-20">
      <div className="w-10 flex items-center">
        {showBack && (
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="text-white w-6 h-6" />
          </button>
        )}
      </div>
      
      <h1 className="text-white text-lg font-bold flex-1 text-center">
        {title}
      </h1>

      <div className="w-10 flex justify-end">
        {showLangToggle && (
          <button 
            onClick={toggleLang}
            className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors text-xs font-bold text-primary flex items-center gap-1"
          >
            {language.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;