
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowUpRight } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';

const Withdraw = () => {
  const { t } = useLanguage();
  const { balance, deductBalance, userPixKey } = useWallet();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('500,00');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMax = () => {
    setAmount(balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleInitialSubmit = () => {
    if (!userPixKey) {
        alert(t('with.no_pix_error'));
        navigate('/profile');
        return;
    }

    const numAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (numAmount > 0 && numAmount <= balance) {
      setShowModal(true);
    } else if (numAmount > balance) {
      alert(t('trans.insufficient'));
    }
  };

  const handleFinalConfirm = async () => {
    setIsLoading(true);
    // Parse amount string back to number
    const numAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    
    if (numAmount > 0) {
      const success = await deductBalance(numAmount);
      if (success) {
        setShowModal(false);
        navigate('/dashboard');
      } else {
        alert("Erro ao processar saque. Verifique saldo ou conexão.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up relative">
      <Header title={t('with.title')} onBack={() => navigate('/dashboard')} />

      <main className="flex-1 px-5 pt-2 flex flex-col gap-6">
        {/* Balance Card */}
        <div className="bg-surface p-5 rounded-xl border border-white/5">
          <p className="text-text-muted text-sm mb-1">{t('with.available')}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-white text-3xl font-bold tracking-tight">{balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-white text-sm font-bold">GMC</p>
          </div>
          <p className="text-text-muted text-sm mt-2 border-t border-white/5 pt-2 inline-block">
            Conversion: 1 GMC = R$ 1.00
          </p>
        </div>

        {/* Input */}
        <div>
          <h3 className="text-white text-xl font-bold mb-3">{t('with.how_much')}</h3>
          <div className="flex items-center bg-surface rounded-xl overflow-hidden border border-white/5 focus-within:border-primary transition-colors">
            <input 
              type="text"
              value={`R$ ${amount}`}
              onChange={(e) => {
                const val = e.target.value.replace('R$ ', '');
                setAmount(val);
              }}
              className="w-full bg-transparent text-white text-2xl font-bold p-4 focus:outline-none placeholder:text-text-muted/50"
            />
            <button 
              onClick={handleMax}
              className="mr-4 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
            >
              {t('with.max_btn')}
            </button>
          </div>
          <p className="text-text-muted text-sm mt-2">{t('with.min_max')}</p>
        </div>

        {/* Pix Key */}
        <div className="bg-surface p-4 rounded-xl border border-white/5 flex justify-between items-center">
          <div className="flex-1 min-w-0 mr-2">
            <p className="text-text-muted text-sm mb-1">{t('with.pix_key')}</p>
            {userPixKey ? (
                <p className="text-white font-medium truncate">{userPixKey}</p>
            ) : (
                <p className="text-yellow-500 font-medium text-sm">{t('with.no_pix')}</p>
            )}
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="text-primary text-sm font-bold hover:text-white transition-colors whitespace-nowrap"
          >
            {userPixKey ? t('with.change') : t('with.register_pix')}
          </button>
        </div>

        {/* Summary */}
        <div className="bg-background border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-text-muted">{t('with.amount')}</p>
            <p className="text-white font-medium">R$ {amount}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-text-muted">{t('with.fee')}</p>
            <p className="text-white font-medium">R$ 0,00</p>
          </div>
          <div className="h-px bg-white/10 my-1 border-t border-dashed border-white/20" />
          <div className="flex justify-between items-center">
            <p className="text-text-muted font-bold">{t('with.receive')}</p>
            <p className="text-primary font-bold">R$ {amount}</p>
          </div>
        </div>

        <div className="mt-auto pb-8">
            <Button fullWidth onClick={handleInitialSubmit}>
                {t('with.confirm_btn')} R$ {amount}
            </Button>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-background border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-slide-up">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-text-muted hover:text-white p-1 rounded-full hover:bg-white/10"
                  >
                      <X className="w-6 h-6" />
                  </button>

                  <div className="flex flex-col items-center mb-6">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                          <ArrowUpRight className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-white text-center">{t('with.modal.title')}</h3>
                  </div>

                  <div className="bg-surface rounded-xl p-4 space-y-4 mb-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                          <div className="w-full">
                              <p className="text-xs text-text-muted">{t('with.modal.pix_key')}</p>
                              <p className="text-white font-bold truncate">{userPixKey}</p>
                          </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-text-muted text-sm">{t('with.modal.amount')}</span>
                            <span className="text-white font-bold">R$ {amount}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <span className="text-text-muted text-sm font-bold">{t('with.modal.receive')}</span>
                            <span className="text-xl font-bold text-primary">R$ {amount}</span>
                        </div>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <Button fullWidth onClick={handleFinalConfirm} disabled={isLoading}>
                          {isLoading ? 'Processando...' : t('with.modal.btn_confirm')}
                      </Button>
                      <Button fullWidth variant="ghost" onClick={() => setShowModal(false)} disabled={isLoading}>
                          {t('with.modal.btn_cancel')}
                      </Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Withdraw;
