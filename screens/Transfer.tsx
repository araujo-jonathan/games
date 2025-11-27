import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, ShieldCheck, UserCircle, X, UserPlus, Copy, Loader2, Check } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';

const Transfer = () => {
  const { t } = useLanguage();
  const { balance, processTransfer, checkRecipient, userId } = useWallet();
  const navigate = useNavigate();
  const [cpf, setCpf] = useState('');
  const [amount, setAmount] = useState('');
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const [recipientName, setRecipientName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Formatting for CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(value);
  };

  const handleInitialSubmit = async () => {
      setIsLoading(true);
      const result = await checkRecipient(cpf);
      setIsLoading(false);

      if (result.exists && result.name) {
          if (result.id === userId) {
              alert("Você não pode transferir para si mesmo.");
              return;
          }
          setRecipientName(result.name);
          setShowConfirmModal(true);
      } else {
          setShowInviteModal(true);
      }
  };

  const handleFinalConfirm = async () => {
      setIsLoading(true);
      const val = parseFloat(amount);
      if (val > 0) {
          const success = await processTransfer(val, cpf, recipientName);
          if (success) {
            setShowConfirmModal(false);
            navigate('/dashboard');
          } else {
              alert(t('trans.insufficient'));
          }
      }
      setIsLoading(false);
  };

  const handleCopyLink = () => {
      navigator.clipboard.writeText("https://finfuture.app/register");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up relative">
      <Header title={t('trans.title')} onBack={() => navigate('/dashboard')} />

      <main className="flex-1 px-5 pt-2 flex flex-col gap-6">
        {/* Balance Card */}
        <div className="bg-surface p-5 rounded-xl border border-white/5">
          <p className="text-text-muted text-sm mb-1">{t('trans.available')}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-white text-3xl font-bold tracking-tight">{Math.floor(balance).toLocaleString('pt-BR')}</p>
            <p className="text-white text-sm font-bold">GMC</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-text-muted text-sm font-medium mb-2">{t('trans.dest_label')}</label>
            <input 
              type="text"
              value={cpf}
              onChange={handleCpfChange}
              className="w-full bg-surface border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder={t('trans.placeholder_cpf')}
            />
          </div>

          <div>
             <label className="block text-text-muted text-sm font-medium mb-2">{t('trans.amount_label')}</label>
             <div className="flex items-center bg-surface rounded-xl overflow-hidden border border-white/10 focus-within:border-primary transition-colors">
                <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent text-white text-xl font-bold p-4 focus:outline-none placeholder:text-text-muted/50"
                    placeholder="0.00"
                />
                <span className="pr-4 font-bold text-primary">GMC</span>
             </div>
          </div>
        </div>

        {/* Warning/Info */}
        <div className="flex items-start gap-3 bg-primary/10 p-4 rounded-xl">
            <ShieldCheck className="text-primary w-6 h-6 shrink-0" />
            <p className="text-sm text-primary/90 leading-relaxed">
                {t('trans.note')}
            </p>
        </div>

        <div className="mt-auto pb-8">
            <Button 
                fullWidth 
                onClick={handleInitialSubmit} 
                disabled={!amount || !cpf || parseFloat(amount) > balance || isLoading} 
                className={(!amount || !cpf || parseFloat(amount) > balance) ? "opacity-50 cursor-not-allowed" : ""}
            >
                {isLoading ? <Loader2 className="animate-spin" /> : t('trans.confirm')}
            </Button>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-background border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-slide-up">
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="absolute top-4 right-4 text-text-muted hover:text-white p-1 rounded-full hover:bg-white/10"
                  >
                      <X className="w-6 h-6" />
                  </button>

                  <div className="flex flex-col items-center mb-6">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                          <ArrowRightLeft className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-white text-center">{t('trans.modal.title')}</h3>
                  </div>

                  <div className="bg-surface rounded-xl p-4 space-y-4 mb-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                          <UserCircle className="text-text-muted w-8 h-8" />
                          <div>
                              <p className="text-xs text-text-muted">{t('trans.modal.to')}</p>
                              <p className="text-white font-bold">{recipientName}</p>
                              <p className="text-xs text-text-muted font-mono">{cpf}</p>
                          </div>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                          <span className="text-text-muted text-sm">{t('trans.modal.amount')}</span>
                          <span className="text-xl font-bold text-primary">{parseFloat(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} GMC</span>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <Button fullWidth onClick={handleFinalConfirm} disabled={isLoading}>
                          {isLoading ? 'Enviando...' : t('trans.modal.btn_confirm')}
                      </Button>
                      <Button fullWidth variant="ghost" onClick={() => setShowConfirmModal(false)} disabled={isLoading}>
                          {t('trans.modal.btn_cancel')}
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* Invite Modal (User Not Found) */}
      {showInviteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-background border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-slide-up">
                  <button 
                    onClick={() => setShowInviteModal(false)}
                    className="absolute top-4 right-4 text-text-muted hover:text-white p-1 rounded-full hover:bg-white/10"
                  >
                      <X className="w-6 h-6" />
                  </button>

                  <div className="flex flex-col items-center mb-6">
                      <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4 text-yellow-500">
                          <UserPlus className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-white text-center">{t('trans.invite_title')}</h3>
                  </div>

                  <div className="bg-surface rounded-xl p-4 mb-6 text-center">
                     <p className="text-white mb-2 font-medium">{t('trans.user_not_found')}</p>
                     <p className="text-text-muted text-sm leading-relaxed">
                        {t('trans.invite_desc')}
                     </p>
                  </div>

                  <div className="space-y-3">
                      <button 
                        onClick={handleCopyLink}
                        className="w-full bg-surface border border-white/10 text-white rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors active:scale-95"
                      >
                          {isCopied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
                          <span className={isCopied ? "text-primary font-bold" : "font-medium"}>
                              {isCopied ? "Link Copiado!" : t('trans.copy_link')}
                          </span>
                      </button>
                      <Button fullWidth variant="ghost" onClick={() => setShowInviteModal(false)}>
                          {t('common.back')}
                      </Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Transfer;