
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, FileText, QrCode, AlertTriangle, LogOut, Check } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';

const Profile = () => {
  const { t } = useLanguage();
  const { userName, userEmail, userCpf, userPixKey, savePixKey, logout } = useWallet();
  const navigate = useNavigate();
  
  const [pixKey, setPixKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
      if (userPixKey) setPixKey(userPixKey);
  }, [userPixKey]);

  const handleSave = async () => {
      setIsSaving(true);
      const success = await savePixKey(pixKey);
      setIsSaving(false);
      
      if (success) {
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 3000);
      } else {
          alert('Erro ao salvar.');
      }
  };

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up">
      <Header title={t('prof.title')} onBack={() => navigate('/dashboard')} />

      <main className="flex-1 px-5 pt-6 pb-8 flex flex-col gap-6">
        
        {/* User Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-surface rounded-2xl border border-white/5">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white text-center">{userName}</h2>
            <p className="text-text-muted text-sm">{t('prof.data')}</p>
        </div>

        {/* Read Only Fields */}
        <div className="space-y-4">
            <div>
                <label className="block text-text-muted text-sm font-medium mb-2">{t('prof.email')}</label>
                <div className="flex items-center bg-white/5 rounded-xl px-4 py-3 border border-white/5 opacity-70">
                    <Mail className="w-5 h-5 text-text-muted mr-3" />
                    <span className="text-white truncate">{userEmail}</span>
                </div>
            </div>

            <div>
                <label className="block text-text-muted text-sm font-medium mb-2">{t('prof.cpf')}</label>
                <div className="flex items-center bg-white/5 rounded-xl px-4 py-3 border border-white/5 opacity-70">
                    <FileText className="w-5 h-5 text-text-muted mr-3" />
                    <span className="text-white font-mono">{userCpf}</span>
                </div>
            </div>
        </div>

        {/* Editable Pix Key */}
        <div className="pt-2">
            <label className="block text-primary text-sm font-bold mb-2 flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                {t('prof.pix_label')}
            </label>
            <input 
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={t('prof.pix_placeholder')}
            />
        </div>

        {/* Warning */}
        <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 flex gap-3">
            <AlertTriangle className="text-yellow-500 w-6 h-6 shrink-0" />
            <div>
                <p className="text-yellow-500 font-bold text-sm mb-1">{t('prof.warning_title')}</p>
                <p className="text-yellow-500/80 text-xs leading-relaxed">{t('prof.warning_desc')}</p>
            </div>
        </div>

        <div className="mt-auto space-y-3">
            <Button onClick={handleSave} fullWidth disabled={isSaving || isSuccess}>
                {isSuccess ? <span className="flex items-center gap-2"><Check className="w-5 h-5" /> {t('prof.success')}</span> : (isSaving ? '...' : t('prof.save'))}
            </Button>
            
            <Button onClick={handleLogout} variant="ghost" fullWidth className="text-red-500 hover:bg-red-500/10 hover:text-red-400">
                <LogOut className="w-5 h-5" />
                {t('prof.logout')}
            </Button>
        </div>

      </main>
    </div>
  );
};

export default Profile;
