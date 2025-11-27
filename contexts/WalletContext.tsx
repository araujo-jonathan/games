
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Transaction } from '../types';

// Use 127.0.0.1 to avoid "localhost" resolution issues on some systems (Mac/Node v18+)
const API_URL = 'http://127.0.0.1:3000';

interface WalletContextProps {
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  userCpf: string | null;
  userPixKey: string | null;
  balance: number;
  transactions: Transaction[];
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, cpf: string) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  deductBalance: (amount: number) => Promise<boolean>;
  processDeposit: (amount: number) => Promise<boolean>;
  processTransfer: (amount: number, recipientCpf: string, recipientName: string) => Promise<boolean>;
  checkRecipient: (cpf: string) => Promise<{ exists: boolean, name?: string, id?: number }>;
  savePixKey: (key: string) => Promise<boolean>;
  refreshData: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCpf, setUserCpf] = useState<string | null>(null);
  const [userPixKey, setUserPixKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Tentar recuperar sessão salva
  useEffect(() => {
    const savedId = localStorage.getItem('gmc_userId');
    const savedName = localStorage.getItem('gmc_userName');
    if (savedId) {
        setUserId(parseInt(savedId));
        setUserName(savedName);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
        console.log(`Buscando dados em ${API_URL}/balance/${userId}...`);
        
        // Buscar Saldo e Dados do Perfil
        const balanceRes = await fetch(`${API_URL}/balance/${userId}`);
        if (!balanceRes.ok) throw new Error(`Falha ao buscar dados: ${balanceRes.status}`);
        const balanceData = await balanceRes.json();
        
        if (balanceData.balance !== undefined) {
            setBalance(Number(balanceData.balance));
            setUserEmail(balanceData.email);
            setUserCpf(balanceData.cpf_cnpj);
            setUserPixKey(balanceData.chave_pix || '');
        }

        // Buscar Transações
        const txRes = await fetch(`${API_URL}/transactions/${userId}`);
        if (!txRes.ok) throw new Error(`Falha ao buscar transações: ${txRes.status}`);
        const txData = await txRes.json();
        
        // Converter datas string para objetos Date para ordenação correta
        const parsedTx = txData.map((tx: any) => ({
            ...tx,
            rawDate: new Date(tx.rawDate),
            date: new Date(tx.rawDate).toLocaleDateString('pt-BR')
        }));
        setTransactions(parsedTx);
        console.log("Dados atualizados com sucesso.");
    } catch (error) {
        console.error("ERRO DE CONEXÃO COM O BACKEND:");
        console.error(error);
        console.warn(`Verifique se o servidor backend está rodando em ${API_URL} (node server.js)`);
    }
  }, [userId]);

  // Carregar dados quando houver usuário logado
  useEffect(() => {
    if (userId) {
        fetchData();
        // Polling para atualizar a cada 5s
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }
  }, [userId, fetchData]);

  const login = async (email: string, pass: string): Promise<boolean> => {
      try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });
        
        const data = await res.json();
        if (res.ok && data.success) {
            setUserId(data.user.id);
            setUserName(data.user.name);
            setBalance(Number(data.user.balance));
            
            // Persistir sessão simples
            localStorage.setItem('gmc_userId', data.user.id.toString());
            localStorage.setItem('gmc_userName', data.user.name);
            return true;
        }
        return false;
      } catch (error) {
          console.error("Erro no login:", error);
          alert("Erro de conexão com o servidor. Verifique o terminal do backend.");
          return false;
      }
  };

  const register = async (name: string, email: string, pass: string, cpf: string): Promise<{success: boolean, error?: string}> => {
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass, cpf })
        });
        
        const data = await res.json();
        if (res.ok && data.success) {
            setUserId(data.user.id);
            setUserName(data.user.name);
            setBalance(Number(data.user.balance));
            
            localStorage.setItem('gmc_userId', data.user.id.toString());
            localStorage.setItem('gmc_userName', data.user.name);
            return { success: true };
        }
        return { success: false, error: data.error || 'Falha ao registrar' };
    } catch (error) {
        console.error("Erro no registro:", error);
        return { success: false, error: 'Erro de conexão' };
    }
  };

  const logout = () => {
      setUserId(null);
      setUserName(null);
      setUserEmail(null);
      setUserCpf(null);
      setUserPixKey(null);
      setBalance(0);
      setTransactions([]);
      localStorage.removeItem('gmc_userId');
      localStorage.removeItem('gmc_userName');
  };

  const refreshData = () => {
      fetchData();
  };

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  const processDeposit = async (amount: number): Promise<boolean> => {
    if (!userId) return false;
    try {
        const res = await fetch(`${API_URL}/deposit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount })
        });
        if (res.ok) {
            await fetchData(); // Atualiza saldo e extrato imediatamente
            return true;
        }
        return false;
    } catch (e) {
        console.error("Erro no depósito:", e);
        return false;
    }
  };

  const deductBalance = async (amount: number): Promise<boolean> => {
    if (!userId) return false;
    try {
        const res = await fetch(`${API_URL}/withdraw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount })
        });
        
        if (res.ok) {
            await fetchData();
            return true;
        }
        const err = await res.json();
        if (err.error) alert(err.error);
        return false;
    } catch (e) {
        console.error("Erro no saque:", e);
        return false;
    }
  };

  const checkRecipient = async (cpf: string): Promise<{ exists: boolean, name?: string, id?: number }> => {
    try {
        const res = await fetch(`${API_URL}/check-user/${cpf}`);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error("Erro ao verificar usuário:", e);
        return { exists: false };
    }
  };

  const processTransfer = async (amount: number, recipientCpf: string, recipientName: string): Promise<boolean> => {
    if (!userId) return false;
    try {
        const res = await fetch(`${API_URL}/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, amount, recipientCpf, recipientName })
        });
        
        if (res.ok) {
            await fetchData();
            return true;
        }
        const err = await res.json();
        if (err.error) alert(err.error);
        return false;
    } catch (e) {
        console.error("Erro na transferência:", e);
        return false;
    }
  };

  const savePixKey = async (key: string): Promise<boolean> => {
    if (!userId) return false;
    try {
        const res = await fetch(`${API_URL}/update-pix`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, pixKey: key })
        });
        
        if (res.ok) {
            setUserPixKey(key);
            return true;
        }
        return false;
    } catch (e) {
        console.error("Erro ao salvar pix:", e);
        return false;
    }
  };

  return (
    <WalletContext.Provider value={{ 
        userId,
        userName,
        userEmail,
        userCpf,
        userPixKey,
        balance, 
        transactions, 
        login,
        register,
        logout,
        updateBalance, 
        deductBalance, 
        processDeposit,
        processTransfer,
        checkRecipient,
        savePixKey,
        refreshData 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
