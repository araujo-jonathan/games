
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  pt: {
    // Onboarding
    'app.slogan': 'O Futuro Dos Jogos',
    'app.sub_slogan': 'Gerencie suas Game Coin e dinheiro em um lugar seguro.',
    'btn.create_account': 'Criar Conta',
    'btn.login': 'Entrar',
    'carousel.1.title': 'Gerencie Todos os Seus Ativos',
    'carousel.1.desc': 'Manuseie cripto e dinheiro num só lugar.',
    'carousel.2.title': 'Seguro & Assegurado',
    'carousel.2.desc': 'Suas Game Coin protegidas com segurança líder.',
    'carousel.3.title': 'Transações Instantâneas',
    'carousel.3.desc': 'Envie e receba sua moeda globalmente em segundos.',
    
    // Auth
    'auth.create_title': 'Crie sua conta',
    'auth.create_desc': 'Vamos começar. Leva apenas um minuto.',
    'auth.fullname': 'Nome Completo',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.placeholder.name': 'ex: João Silva',
    'auth.placeholder.email': 'voce@exemplo.com',
    'auth.placeholder.pass': 'Crie uma senha forte',
    'auth.terms': 'Ao criar uma conta, você concorda com nossos Termos.',
    'auth.continue': 'Continuar',
    'auth.has_account': 'Já tem uma conta?',
    
    // Dashboard
    'dash.wallet': 'Minha Carteira',
    'dash.total_balance': 'Saldo Total',
    'dash.deposit': 'Depositar',
    'dash.withdraw': 'Sacar',
    'dash.transfer': 'Transferir',
    'dash.statement': 'Extrato',
    'dash.recent': 'Transações Recentes',
    'dash.view_all': 'Ver Tudo',
    
    // Deposit
    'dep.title': 'Depositar',
    'dep.how_much': 'Quanto você quer depositar?',
    'dep.amount_label': 'Valor do depósito',
    'dep.conversion': 'Conversão automática',
    'dep.generate_pix': 'Gerar Pix',
    
    // Pix
    'pix.title': 'Deposite via Pix',
    'pix.validity': 'Válido por 10 minutos',
    'pix.copy_paste': 'Pix Copia e Cola',
    'pix.you_receive': 'Você recebe',
    'pix.step1': '1. Abra o app do seu banco e escolha a opção Pix.',
    'pix.step2': '2. Escaneie o código QR ou cole a chave acima.',
    'pix.step3': '3. Após a confirmação, o valor será creditado.',
    'pix.success_note': 'Sua transação aparecerá no extrato',
    'pix.back_home': 'Voltar para o Início',
    
    // Withdraw
    'with.title': 'Solicitar Saque',
    'with.available': 'Saldo Disponível',
    'with.how_much': 'Quanto você quer sacar? (R$)',
    'with.min_max': 'Mín: R$ 10,00 / Máx: R$ 5.000,00',
    'with.max_btn': 'Máximo',
    'with.pix_key': 'Enviar para sua chave Pix',
    'with.change': 'Alterar',
    'with.register_pix': 'Cadastrar Chave',
    'with.no_pix': 'Nenhuma chave cadastrada',
    'with.no_pix_error': 'Você precisa cadastrar uma chave Pix no perfil para sacar.',
    'with.amount': 'Valor do Saque',
    'with.fee': 'Taxa de Transação',
    'with.receive': 'Você receberá',
    'with.confirm_btn': 'Sacar',
    'with.success_msg': 'Saque realizado com sucesso!',
    'with.modal.title': 'Confirmação de Saque',
    'with.modal.amount': 'Valor:',
    'with.modal.fee': 'Taxa:',
    'with.modal.receive': 'A receber:',
    'with.modal.pix_key': 'Chave Pix:',
    'with.modal.btn_confirm': 'Confirmar Saque',
    'with.modal.btn_cancel': 'Cancelar',

    // Transfer
    'trans.title': 'Transferir GMC',
    'trans.available': 'Saldo Disponível',
    'trans.dest_label': 'Para quem enviar? (CPF)',
    'trans.amount_label': 'Valor (GMC)',
    'trans.note': 'Transferência somente entre contas GMC GameCoin.',
    'trans.confirm': 'Confirmar Transferência',
    'trans.placeholder_cpf': '000.000.000-00',
    'trans.modal.title': 'Confirmação de Transferência',
    'trans.modal.to': 'Para:',
    'trans.modal.amount': 'Valor:',
    'trans.modal.btn_confirm': 'Confirmar e Enviar',
    'trans.modal.btn_cancel': 'Cancelar',
    'trans.insufficient': 'Saldo insuficiente',
    'trans.tx_title': 'Transferência Enviada',
    'trans.user_not_found': 'Usuário não encontrado',
    'trans.invite_title': 'Convide para o GameCoin',
    'trans.invite_desc': 'Este CPF não possui uma conta GMC. Convide-o para se cadastrar!',
    'trans.copy_link': 'Copiar Link de Convite',
    
    // Statement
    'stmt.title': 'Extrato e Histórico',
    'stmt.period': 'Período',
    'stmt.type': 'Tipo',
    'stmt.last_7': 'Últimos 7 dias',
    'stmt.all': 'Todos',
    'stmt.today': 'Hoje',
    'stmt.yesterday': 'Ontem',
    'stmt.total_dep': 'Total Depósitos',
    'stmt.total_with': 'Total de Saques',
    'stmt.net_pl': 'Ganhos/Perdas',
    'stmt.filter_date': 'Data',
    'stmt.filter_dep': 'Depósitos',
    'stmt.filter_with': 'Saques',
    'stmt.tx_dep_pix': 'Depósito - Pix',
    'stmt.tx_with_pix': 'Saque - Pix',
    
    // Profile
    'prof.title': 'Meu Perfil',
    'prof.data': 'Meus Dados',
    'prof.name': 'Nome Completo',
    'prof.cpf': 'CPF',
    'prof.email': 'Email',
    'prof.pix_label': 'Chave Pix para Saques',
    'prof.pix_placeholder': 'Cadastre sua chave Pix (CPF, Email, etc)',
    'prof.warning_title': 'Atenção à Titularidade',
    'prof.warning_desc': 'A chave Pix deve pertencer ao mesmo CPF cadastrado na conta. Saques para terceiros não são permitidos.',
    'prof.save': 'Salvar Chave Pix',
    'prof.logout': 'Sair da Conta',
    'prof.success': 'Chave Pix salva com sucesso!',

    // General
    'common.back': 'Voltar',
  },
  en: {
    // Onboarding
    'app.slogan': 'The Future of Your Finances',
    'app.sub_slogan': 'Seamlessly manage your crypto and cash in one secure place.',
    'btn.create_account': 'Create Account',
    'btn.login': 'Log In',
    'carousel.1.title': 'Manage All Your Assets',
    'carousel.1.desc': 'Seamlessly handle crypto and cash in one place.',
    'carousel.2.title': 'Secure & Insured',
    'carousel.2.desc': 'Your funds are protected with industry-leading security.',
    'carousel.3.title': 'Instant Transactions',
    'carousel.3.desc': 'Send and receive money across the globe in seconds.',
    
    // Auth
    'auth.create_title': 'Create your account',
    'auth.create_desc': 'Let\'s get you started. This will only take a minute.',
    'auth.fullname': 'Full Name',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.placeholder.name': 'e.g., John Doe',
    'auth.placeholder.email': 'you@example.com',
    'auth.placeholder.pass': 'Create a strong password',
    'auth.terms': 'By creating an account, you agree to our Terms.',
    'auth.continue': 'Continue',
    'auth.has_account': 'Already have an account?',

    // Dashboard
    'dash.wallet': 'My Wallet',
    'dash.total_balance': 'Total Balance',
    'dash.deposit': 'Deposit',
    'dash.withdraw': 'Withdraw',
    'dash.transfer': 'Transfer',
    'dash.statement': 'Statement',
    'dash.recent': 'Recent Transactions',
    'dash.view_all': 'View All',

    // Deposit
    'dep.title': 'Deposit',
    'dep.how_much': 'How much do you want to deposit?',
    'dep.amount_label': 'Deposit amount',
    'dep.conversion': 'Automatic conversion',
    'dep.generate_pix': 'Generate Pix',

    // Pix
    'pix.title': 'Deposit via Pix',
    'pix.validity': 'Valid for 10 minutes',
    'pix.copy_paste': 'Pix Copy & Paste',
    'pix.you_receive': 'You receive',
    'pix.step1': '1. Open your bank app and choose Pix.',
    'pix.step2': '2. Scan the QR code or paste the key above.',
    'pix.step3': '3. After confirmation, funds will be credited.',
    'pix.success_note': 'Your transaction will appear in statement',
    'pix.back_home': 'Back to Home',

    // Withdraw
    'with.title': 'Withdraw Funds',
    'with.available': 'Available Balance',
    'with.how_much': 'How much to withdraw? (R$)',
    'with.min_max': 'Min: R$ 10.00 / Max: R$ 5,000.00',
    'with.max_btn': 'Max',
    'with.pix_key': 'Send to your Pix key',
    'with.change': 'Change',
    'with.register_pix': 'Register Key',
    'with.no_pix': 'No key registered',
    'with.no_pix_error': 'You must register a Pix key in your profile to withdraw.',
    'with.amount': 'Withdrawal Amount',
    'with.fee': 'Transaction Fee',
    'with.receive': 'You will receive',
    'with.confirm_btn': 'Withdraw',
    'with.success_msg': 'Withdrawal successful!',
    'with.modal.title': 'Withdraw Confirmation',
    'with.modal.amount': 'Amount:',
    'with.modal.fee': 'Fee:',
    'with.modal.receive': 'You receive:',
    'with.modal.pix_key': 'Pix Key:',
    'with.modal.btn_confirm': 'Confirm Withdraw',
    'with.modal.btn_cancel': 'Cancel',

    // Transfer
    'trans.title': 'Transfer GMC',
    'trans.available': 'Available Balance',
    'trans.dest_label': 'Transfer to (CPF)',
    'trans.amount_label': 'Amount (GMC)',
    'trans.note': 'Transfers only between GMC GameCoin accounts.',
    'trans.confirm': 'Confirm Transfer',
    'trans.placeholder_cpf': '000.000.000-00',
    'trans.modal.title': 'Transfer Confirmation',
    'trans.modal.to': 'To:',
    'trans.modal.amount': 'Amount:',
    'trans.modal.btn_confirm': 'Confirm & Send',
    'trans.modal.btn_cancel': 'Cancel',
    'trans.insufficient': 'Insufficient balance',
    'trans.tx_title': 'Transfer Sent',
    'trans.user_not_found': 'User not found',
    'trans.invite_title': 'Invite to GameCoin',
    'trans.invite_desc': 'This CPF does not have a GMC account. Invite them to register!',
    'trans.copy_link': 'Copy Invite Link',

    // Statement
    'stmt.title': 'History',
    'stmt.period': 'Period',
    'stmt.type': 'Type',
    'stmt.last_7': 'Last 7 days',
    'stmt.all': 'All',
    'stmt.today': 'Today',
    'stmt.yesterday': 'Yesterday',
    'stmt.total_dep': 'Total Deposits',
    'stmt.total_with': 'Total Withdrawals',
    'stmt.net_pl': 'Net P/L',
    'stmt.filter_date': 'Date',
    'stmt.filter_dep': 'Deposits',
    'stmt.filter_with': 'Withdrawals',
    'stmt.tx_dep_pix': 'Deposit - Pix',
    'stmt.tx_with_pix': 'Withdraw - Pix',

    // Profile
    'prof.title': 'My Profile',
    'prof.data': 'My Data',
    'prof.name': 'Full Name',
    'prof.cpf': 'CPF',
    'prof.email': 'Email',
    'prof.pix_label': 'Pix Key for Withdrawals',
    'prof.pix_placeholder': 'Register your Pix key (CPF, Email, etc)',
    'prof.warning_title': 'Ownership Warning',
    'prof.warning_desc': 'The Pix key must belong to the same CPF registered in the account. Withdrawals to third parties are not allowed.',
    'prof.save': 'Save Pix Key',
    'prof.logout': 'Logout',
    'prof.success': 'Pix Key saved successfully!',

    // General
    'common.back': 'Back',
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
