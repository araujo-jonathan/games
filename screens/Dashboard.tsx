
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowDown, ArrowUp, Receipt, ArrowDownLeft, ArrowUpRight, ShoppingCart, ArrowRightLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const { balance, transactions } = useWallet();
  const navigate = useNavigate();

  // Get last 3 transactions
  const recentTransactions = transactions.slice(0, 3);

  const formattedBalance = Math.floor(balance).toLocaleString('pt-BR');
  const fiatValue = balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const getIcon = (type: string) => {
    switch(type) {
        case 'deposit': return <ArrowDownLeft className="w-5 h-5" />;
        case 'withdraw': return <ArrowUpRight className="w-5 h-5" />;
        case 'transfer': return <ArrowRightLeft className="w-5 h-5" />;
        case 'purchase': return <ShoppingCart className="w-5 h-5" />;
        default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getColors = (type: string) => {
      if (type === 'deposit') return 'bg-green-500/20 text-green-500';
      if (type === 'withdraw') return 'bg-red-500/20 text-red-500';
      if (type === 'transfer') return 'bg-blue-500/20 text-blue-500';
      return 'bg-blue-500/20 text-blue-500';
  };

  return (
    <div className="min-h-screen bg-background pb-8 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-5">
        <h2 className="text-white text-lg font-bold">{t('dash.wallet')}</h2>
        <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 bg-surface rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors"
        >
          <User className="text-white w-5 h-5" />
        </button>
      </div>

      {/* Balance */}
      <div className="flex flex-col items-center py-6 animate-slide-up">
        <p className="text-text-muted text-sm">{t('dash.total_balance')}</p>
        <div className="flex items-baseline gap-1 mt-2">
          <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight">{formattedBalance}</h1>
          <span className="text-lg font-bold text-white">GMC</span>
        </div>
        <p className="text-gray-400 text-lg mt-2">≈ R$ {fiatValue}</p>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-3 px-5 mb-8">
        <button 
          onClick={() => navigate('/deposit')}
          className="h-16 bg-primary rounded-xl flex items-center justify-center gap-2 text-background font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10"
        >
          <ArrowDown className="w-5 h-5" />
          {t('dash.deposit')}
        </button>
        <button 
          onClick={() => navigate('/withdraw')}
          className="h-16 bg-primary/10 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-base hover:bg-primary/20 transition-colors border border-primary/20"
        >
          <ArrowUp className="w-5 h-5" />
          {t('dash.withdraw')}
        </button>
        <button 
          onClick={() => navigate('/transfer')}
          className="h-16 bg-surface rounded-xl flex items-center justify-center gap-2 text-white font-bold text-base hover:bg-white/10 transition-colors border border-white/5"
        >
          <ArrowRightLeft className="w-5 h-5 text-primary" />
          {t('dash.transfer')}
        </button>
        <button 
          onClick={() => navigate('/statement')}
          className="h-16 bg-surface rounded-xl flex items-center justify-center gap-2 text-white font-bold text-base hover:bg-white/10 transition-colors border border-white/5"
        >
          <Receipt className="w-5 h-5 text-text-muted" />
          {t('dash.statement')}
        </button>
      </div>

      {/* Transactions */}
      <div className="px-5 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">{t('dash.recent')}</h3>
          <button onClick={() => navigate('/statement')} className="text-primary text-sm font-bold hover:text-primary/80">{t('dash.view_all')}</button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((tx, idx) => (
            <div key={tx.id} className="flex items-center p-4 bg-surface rounded-xl hover:bg-white/5 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 ${getColors(tx.type)}`}>
                {getIcon(tx.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">
                    {tx.type === 'deposit' && t('stmt.tx_dep_pix')}
                    {tx.type === 'withdraw' && t('stmt.tx_with_pix')}
                    {tx.type === 'transfer' && t('trans.tx_title')}
                    {!['deposit', 'withdraw', 'transfer'].includes(tx.type) && tx.title}
                </p>
                <p className="text-text-muted text-sm">
                    {tx.rawDate ? tx.rawDate.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'}) : tx.date}
                </p>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className={`font-bold whitespace-nowrap ${tx.isGain ? 'text-green-500' : 'text-white'}`}>
                  {tx.isGain ? '+' : '-'}{tx.amountCrypto?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} GMC
                </p>
                <p className="text-text-muted text-sm whitespace-nowrap">≈ R${tx.amountFiat.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
