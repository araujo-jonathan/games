import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';

const Login = () => {
  const { t } = useLanguage();
  const { login } = useWallet();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
        navigate('/dashboard');
    } else {
        alert("Email ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up">
      <Header title="" onBack={() => navigate('/')} />
      
      <main className="flex-1 px-6 flex flex-col justify-center pb-20">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
          <p className="text-text-muted">Entre na sua conta para continuar.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-text-muted text-sm font-medium mb-2">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPass ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <Button type="submit" fullWidth disabled={loading}>
             {loading ? <Loader2 className="animate-spin" /> : t('btn.login')}
          </Button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-sm text-text-muted">
                Não tem uma conta? <button onClick={() => navigate('/create-account')} className="text-primary font-bold ml-1">{t('btn.create_account')}</button>
            </p>
        </div>
      </main>
    </div>
  );
};

export default Login;