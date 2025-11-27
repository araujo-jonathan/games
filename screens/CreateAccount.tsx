import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, FileText, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';

const CreateAccount = () => {
  const { t } = useLanguage();
  const { register } = useWallet();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'cpf') {
        // Simple CPF Mask
        let v = value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        setFormData(prev => ({ ...prev, [id]: v }));
    } else {
        setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.cpf || !formData.password) {
        alert("Preencha todos os campos");
        return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.cpf);
    setLoading(false);

    if (result.success) {
        navigate('/dashboard');
    } else {
        alert(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up">
      <Header title="" onBack={() => navigate('/')} />
      
      <main className="flex-1 px-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{t('auth.create_title')}</h1>
          <p className="text-text-muted">{t('auth.create_desc')}</p>
        </div>

        <form className="space-y-4 flex-1" onSubmit={handleSubmit}>
          <div>
            <label className="block text-text-muted text-sm font-medium mb-2">{t('auth.fullname')}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input 
                id="name"
                type="text" 
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={t('auth.placeholder.name')}
              />
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-sm font-medium mb-2">CPF</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input 
                id="cpf"
                type="text" 
                value={formData.cpf}
                onChange={handleChange}
                className="w-full bg-surface border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-sm font-medium mb-2">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input 
                id="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={t('auth.placeholder.email')}
              />
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-sm font-medium mb-2">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input 
                id="password"
                type={showPass ? "text" : "password"} 
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-surface border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={t('auth.placeholder.pass')}
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="py-4">
            <p className="text-xs text-text-muted text-center mb-4 leading-relaxed">
                {t('auth.terms')}
            </p>
            <Button type="submit" fullWidth disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : t('auth.continue')}
            </Button>
            <p className="text-center mt-4 text-sm text-text-muted">
                {t('auth.has_account')} <button type="button" onClick={() => navigate('/login')} className="text-primary font-bold ml-1">{t('btn.login')}</button>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateAccount;