import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

const Deposit = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');

  const handlePreset = (val: string) => {
    setAmount(val);
  };

  const handleNext = () => {
    navigate('/deposit-pix', { state: { amount } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up">
      <Header title={t('dep.title')} onBack={() => navigate('/dashboard')} />

      <main className="flex-1 px-5 pt-6 pb-8 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-6">{t('dep.how_much')}</h2>

        {/* Input */}
        <div className="mb-6">
          <p className="text-white font-medium mb-2">{t('dep.amount_label')}</p>
          <div className="flex items-center bg-white/5 rounded-xl overflow-hidden border border-white/5 focus-within:border-primary transition-colors">
            <div className="pl-4 pr-2 py-4 text-text-muted font-bold text-lg">R$</div>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-white text-2xl font-bold p-4 pl-1 focus:outline-none placeholder:text-text-muted/50"
              placeholder="0,00"
              autoFocus
            />
          </div>
        </div>

        {/* Chips */}
        <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar">
          {['50', '100', '200'].map((val) => (
            <button 
              key={val}
              onClick={() => handlePreset(val)}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-colors whitespace-nowrap font-medium"
            >
              R$ {val}
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 text-text-muted mb-auto">
          <ArrowLeftRight className="text-primary w-5 h-5" />
          <span className="text-sm">{t('dep.conversion')}: R$ 1.00 = 1.00 GMC GameCoin</span>
        </div>

        <Button 
          onClick={handleNext} 
          fullWidth
          disabled={!amount}
          className={!amount ? "opacity-50 cursor-not-allowed" : ""}
        >
          {t('dep.generate_pix')}
        </Button>
      </main>
    </div>
  );
};

export default Deposit;