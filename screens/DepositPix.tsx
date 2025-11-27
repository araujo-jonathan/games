import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, CheckCircle, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useWallet } from '../contexts/WalletContext';

const DepositPix = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { processDeposit } = useWallet();
  const [isChecking, setIsChecking] = useState(false);
  
  // Retrieve amount from state, default to 0 if not present
  const amountState = location.state?.amount;
  const amountValue = amountState ? parseFloat(amountState) : 0;
  const formattedAmount = amountValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  // Mock Pix Code
  const mockPixCode = "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913FinFuture Inc6008Sao Paulo62070503***63041A2B";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockPixCode);
  };

  const simulatePayment = async () => {
      if (amountValue <= 0) return;
      
      setIsChecking(true);
      try {
        // Chama diretamente a API do backend para inserir no banco
        const success = await processDeposit(amountValue);
        
        if (success) {
            // Se sucesso, volta para dashboard (o saldo estará atualizado)
            navigate('/dashboard');
        } else {
            alert("Erro ao processar depósito no servidor.");
        }
      } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
      } finally {
        setIsChecking(false);
      }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-slide-up">
      <Header title={t('dep.title')} />

      <main className="flex-1 px-5 py-4 flex flex-col items-center">
        <div className="w-full max-w-sm bg-surface p-6 rounded-2xl flex flex-col items-center mb-6 shadow-lg border border-white/5">
          <h2 className="text-xl font-bold text-white mb-1">{t('pix.title')}</h2>
          <p className="text-text-muted text-sm mb-6">{t('pix.validity')}</p>

          {/* QR Code Placeholder */}
          <div className="bg-white p-4 rounded-xl mb-6 shadow-inner">
             {/* Using a placeholder API for QR code visuals */}
            <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${mockPixCode}&color=102219`} 
                alt="Pix QR Code" 
                className="w-48 h-48"
            />
          </div>

          <p className="text-sm font-medium text-white mb-2 w-full text-left">{t('pix.copy_paste')}</p>
          <div className="flex items-center bg-white/5 rounded-lg p-1 w-full border border-white/10 mb-6">
            <p className="text-text-muted text-xs flex-1 truncate px-3 font-mono select-all">
              {mockPixCode}
            </p>
            <button 
              onClick={copyToClipboard}
              className="p-2 bg-primary/10 rounded-md text-primary hover:bg-primary/20 transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full bg-white/5 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-muted">{t('dep.amount_label')}</span>
              <span className="text-white font-bold">R$ {formattedAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{t('pix.you_receive')}</span>
              <span className="text-primary font-bold">{formattedAmount} GMC GameCoin</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3 text-sm text-text-muted mb-8">
          <p>{t('pix.step1')}</p>
          <p>{t('pix.step2')}</p>
          <p>{t('pix.step3')}</p>
        </div>
        
        {/* Botão simulador REAL conectado ao backend */}
        <div className="mb-4 w-full">
             <Button onClick={simulatePayment} variant="secondary" fullWidth disabled={isChecking}>
                {isChecking ? <RefreshCw className="animate-spin w-5 h-5" /> : "Simular Pagamento (Confirmar no Banco)"}
            </Button>
        </div>

        <div className="mt-auto flex items-center gap-2 text-primary text-sm mb-6 bg-primary/5 px-4 py-2 rounded-full">
          <CheckCircle className="w-5 h-5" />
          <span>{t('pix.success_note')}</span>
        </div>

        <Button onClick={() => navigate('/dashboard')} fullWidth>
          {t('pix.back_home')}
        </Button>
      </main>
    </div>
  );
};

export default DepositPix;