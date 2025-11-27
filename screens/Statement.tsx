
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowDownLeft, ArrowUpRight, CheckCircle, ArrowRightLeft } from 'lucide-react';
import Header from '../components/Header';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';

type FilterType = 'all' | 'deposit' | 'withdraw';

const Statement = () => {
  const { t, language } = useLanguage();
  const { transactions } = useWallet();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Calculated Totals based on ALL data
  const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((acc, curr) => acc + curr.amountFiat, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'withdraw').reduce((acc, curr) => acc + curr.amountFiat, 0);

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'all') return transactions;
    return transactions.filter(t => t.type === activeFilter);
  }, [activeFilter, transactions]);

  // Grouping Logic
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof transactions } = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    filteredTransactions.forEach(tx => {
      const txDate = tx.rawDate || new Date(tx.date);
      let dateKey = txDate.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { day: 'numeric', month: 'long' });
      
      if (txDate.toDateString() === today.toDateString()) {
        dateKey = t('stmt.today');
      } else if (txDate.toDateString() === yesterday.toDateString()) {
        dateKey = t('stmt.yesterday');
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(tx);
    });
    return groups;
  }, [filteredTransactions, language, t]);

  const getIcon = (type: string) => {
    switch(type) {
        case 'deposit': return <ArrowDownLeft className="text-green-500 w-6 h-6" />;
        case 'withdraw': return <ArrowUpRight className="text-red-500 w-6 h-6" />;
        case 'transfer': return <ArrowRightLeft className="text-blue-500 w-6 h-6" />;
        default: return <CheckCircle className="text-white w-6 h-6" />;
    }
  };

  const getBg = (type: string) => {
    switch(type) {
        case 'deposit': return 'bg-green-500/20';
        case 'withdraw': return 'bg-red-500/20';
        case 'transfer': return 'bg-blue-500/20';
        default: return 'bg-surface';
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in flex flex-col">
       {/* Sticky Header */}
       <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-white/5 shadow-sm">
            <div className="relative">
                <Header title={t('stmt.title')} onBack={() => navigate('/dashboard')} />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden"> 
                    <button className="p-2 hover:bg-white/10 rounded-full">
                        <Download className="text-white w-6 h-6" />
                    </button>
                </div>
            </div>

           {/* 3 Filters */}
           <div className="px-5 pb-4 pt-1 flex gap-3 overflow-x-auto no-scrollbar">
               <button 
                onClick={() => setActiveFilter('all')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${activeFilter === 'all' ? 'bg-primary text-background' : 'bg-surface text-text-muted border border-white/5'}`}
               >
                   {t('stmt.filter_date')}
               </button>
               <button 
                onClick={() => setActiveFilter('deposit')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${activeFilter === 'deposit' ? 'bg-primary text-background' : 'bg-surface text-text-muted border border-white/5'}`}
               >
                   {t('stmt.filter_dep')}
               </button>
               <button 
                onClick={() => setActiveFilter('withdraw')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${activeFilter === 'withdraw' ? 'bg-primary text-background' : 'bg-surface text-text-muted border border-white/5'}`}
               >
                   {t('stmt.filter_with')}
               </button>
           </div>
       </div>

       {/* Summary Cards */}
       <div className="p-5 flex gap-4">
           <div className="flex-1 bg-surface rounded-2xl p-4 border border-white/5 flex flex-col justify-between min-h-[100px]">
               <div className="flex items-start justify-between">
                   <p className="text-text-muted text-xs font-bold uppercase tracking-wider">{t('stmt.total_dep')}</p>
                   <div className="bg-green-500/20 p-1.5 rounded-lg">
                       <ArrowDownLeft className="text-green-500 w-4 h-4" />
                   </div>
               </div>
               <p className="text-white text-xl font-bold tracking-tight">R$ {totalDeposits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
           </div>
           <div className="flex-1 bg-surface rounded-2xl p-4 border border-white/5 flex flex-col justify-between min-h-[100px]">
               <div className="flex items-start justify-between">
                   <p className="text-text-muted text-xs font-bold uppercase tracking-wider">{t('stmt.total_with')}</p>
                   <div className="bg-red-500/20 p-1.5 rounded-lg">
                       <ArrowUpRight className="text-red-500 w-4 h-4" />
                   </div>
               </div>
               <p className="text-white text-xl font-bold tracking-tight">R$ {totalWithdrawals.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
           </div>
       </div>

       {/* Grouped List */}
       <div className="pb-8 flex-1">
           {Object.entries(groupedTransactions).map(([dateGroup, txs]) => (
               <div key={dateGroup} className="mb-2 animate-slide-up">
                   <h3 className="px-5 py-3 text-text-muted font-bold text-sm sticky top-[125px] bg-background/95 backdrop-blur-sm z-10">{dateGroup}</h3>
                   <div className="space-y-1">
                       {txs.map((tx) => (
                           <div key={tx.id} className="flex items-center px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shrink-0 ${getBg(tx.type)} shadow-sm`}>
                                   {getIcon(tx.type)}
                               </div>
                               <div className="flex-1 min-w-0">
                                   <p className="text-white font-bold truncate text-base">
                                     {tx.type === 'deposit' && t('stmt.tx_dep_pix')}
                                     {tx.type === 'withdraw' && t('stmt.tx_with_pix')}
                                     {tx.type === 'transfer' && t('trans.tx_title')}
                                     {!['deposit', 'withdraw', 'transfer'].includes(tx.type) && tx.title}
                                   </p>
                                   <p className="text-text-muted text-sm font-medium">
                                     {formatTime(tx.rawDate)} {tx.subtitle ? `• ${tx.subtitle}` : ''}
                                   </p>
                               </div>
                               <div className="text-right pl-2">
                                   <p className={`font-bold text-base ${tx.isGain ? 'text-green-500' : 'text-white'}`}>
                                     {tx.isGain ? '+' : '-'}R$ {tx.amountFiat.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                   </p>
                                   <p className="text-text-muted text-xs font-medium mt-0.5">
                                     {tx.isGain ? '+' : '-'}{tx.amountCrypto?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} GMC
                                   </p>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           ))}
           
           {filteredTransactions.length === 0 && (
               <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                   <p>Nenhuma transação encontrada.</p>
               </div>
           )}
       </div>
    </div>
  );
};

export default Statement;
