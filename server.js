
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Fix for ES Module import of pg
const { Pool } = pkg;

const app = express();
const port = 3000;

// Middleware - Enable CORS for all requests
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Configuração do Banco de Dados
const dbHost = process.env.DB_HOST || 'localhost';
const isSupabase = dbHost.includes('supabase');
const isProduction = dbHost !== 'localhost' && dbHost !== '127.0.0.1';

// Supabase exige SSL real
const sslConfig = (isSupabase || isProduction) 
    ? { rejectUnauthorized: false } 
    : false;

console.log('------------------------------------------------');
console.log(`Tentando conectar ao banco de dados...`);
console.log(`Host: ${dbHost}`);
console.log(`User: ${process.env.DB_USER || 'postgres'}`);
console.log(`Port: ${process.env.DB_PORT || 5432}`);
console.log(`SSL Ativado: ${!!sslConfig}`);
console.log('------------------------------------------------');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: dbHost,
  database: process.env.DB_NAME || 'gamecoin', 
  password: process.env.DB_PASSWORD || 'postgres', 
  port: process.env.DB_PORT || 5432,
  ssl: sslConfig
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('------------------------------------------------');
    console.error('❌ ERRO CRÍTICO: Falha na conexão com o Banco de Dados.');
    console.error('Erro:', err.message);
    if (isSupabase) {
        console.error('DICA: Verifique se a senha do banco está correta no .env (não é a senha do painel Supabase).');
        console.error('DICA: Use a porta 6543 (Transaction Pooler) para melhor compatibilidade IPv4.');
    }
    console.error('------------------------------------------------');
    return;
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Erro executando query de teste:', err.stack);
    }
    console.log('✅ Conectado ao PostgreSQL com sucesso!');
    console.log(`🕒 Horário do Banco: ${result.rows[0].now}`);
  });
});

// --- ROTAS ---

app.get('/', (req, res) => {
    res.json({ status: 'Online', message: 'API GameCoin rodando com sucesso!', database: isSupabase ? 'Supabase' : 'Local' });
});

// 1. Registro
app.post('/register', async (req, res) => {
    const { name, email, password, cpf } = req.body;
    
    if (!name || !email || !password || !cpf) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const cleanCpf = cpf.replace(/\D/g, ''); 

        const userExists = await pool.query('SELECT id FROM users WHERE email = $1 OR cpf_cnpj = $2', [email, cleanCpf]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Usuário já cadastrado com este Email ou CPF.' });
        }

        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash, cpf_cnpj, balance, tipo) VALUES ($1, $2, $3, $4, 0.00, $5) RETURNING id, name, email, balance',
            [name, email, password, cleanCpf, 'usuario']
        );

        const newUser = result.rows[0];
        res.json({ success: true, user: newUser });
    } catch (err) {
        console.error('Erro no registro:', err);
        res.status(500).json({ error: 'Erro ao criar conta.' });
    }
});

// 2. Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT id, name, email, cpf_cnpj, balance, password_hash FROM users WHERE email = $1', [email]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      if (user.password_hash !== password) {
          return res.status(401).json({ error: 'Senha incorreta' });
      }
      
      delete user.password_hash;
      res.json({ success: true, user: { ...user, balance: parseFloat(user.balance) } });
    } else {
      res.status(401).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// 3. Saldo e Dados
app.get('/balance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT balance, name, email, cpf_cnpj, chave_pix FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length > 0) {
      const userData = {
          ...result.rows[0],
          balance: parseFloat(result.rows[0].balance)
      };
      res.json(userData);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao buscar saldo:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// 4. Transações
app.get('/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    
    const formatted = result.rows.map(row => ({
      id: row.id.toString(),
      type: row.type,
      title: row.description || formatTitle(row.type),
      amountFiat: parseFloat(row.amount),
      amountCrypto: parseFloat(row.amount), 
      date: new Date(row.created_at).toLocaleDateString('pt-BR'),
      rawDate: row.created_at,
      status: 'completed',
      isGain: isGainTransaction(row.type, row.description)
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

function formatTitle(type) {
    switch(type) {
        case 'deposit': return 'Depósito';
        case 'withdraw': return 'Saque';
        case 'transfer': return 'Transferência';
        default: return 'Transação';
    }
}

function isGainTransaction(type, description) {
    if (type === 'deposit') return true;
    if (type === 'transfer' && description && description.includes('Recebida')) return true;
    return false;
}

// 5. Verificar CPF
app.get('/check-user/:cpf', async (req, res) => {
    try {
        const { cpf } = req.params;
        const cleanCpf = cpf.replace(/\D/g, '');

        const result = await pool.query('SELECT id, name FROM users WHERE cpf_cnpj = $1', [cleanCpf]);
        
        if (result.rows.length > 0) {
            res.json({ exists: true, name: result.rows[0].name, id: result.rows[0].id });
        } else {
            res.json({ exists: false });
        }
    } catch (err) {
        console.error('Erro ao verificar usuário:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// 6. Depósito
app.post('/deposit', async (req, res) => {
  const { userId, amount } = req.body;
  
  if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
  }

  try {
    await pool.query('BEGIN');
    await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, userId]);
    await pool.query(
      'INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, $2, $3, $4)',
      [userId, 'deposit', amount, 'Depósito - Pix']
    );
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro no depósito' });
  }
});

// 7. Saque
app.post('/withdraw', async (req, res) => {
  const { userId, amount } = req.body;
  
  try {
    await pool.query('BEGIN');
    const user = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) throw new Error('User not found');
    
    const currentBalance = parseFloat(user.rows[0].balance);
    if (currentBalance < amount) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, userId]);
    await pool.query(
      'INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, $2, $3, $4)',
      [userId, 'withdraw', amount, 'Saque - Pix']
    );
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro no saque' });
  }
});

// 8. Transferência
app.post('/transfer', async (req, res) => {
  const { userId, amount, recipientCpf, recipientName } = req.body;
  const senderId = userId;

  try {
    await pool.query('BEGIN');

    const senderRes = await pool.query('SELECT balance, name FROM users WHERE id = $1', [senderId]);
    if (senderRes.rows.length === 0) throw new Error('Remetente não encontrado');
    
    const senderBalance = parseFloat(senderRes.rows[0].balance);
    if (senderBalance < amount) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    const cleanCpf = recipientCpf.replace(/\D/g, '');
    const recipientRes = await pool.query('SELECT id, name FROM users WHERE cpf_cnpj = $1', [cleanCpf]);
    
    if (recipientRes.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ error: 'Destinatário não encontrado.' });
    }

    const recipientId = recipientRes.rows[0].id;
    const dbRecipientName = recipientRes.rows[0].name;

    if (senderId == recipientId) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: 'Não pode transferir para si mesmo.' });
    }

    await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, senderId]);
    await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, recipientId]);
    
    await pool.query(
      'INSERT INTO transactions (user_id, type, amount, recipient_info, description) VALUES ($1, $2, $3, $4, $5)',
      [senderId, 'transfer', amount, cleanCpf, `Transf. enviada para ${dbRecipientName}`]
    );

    await pool.query(
        'INSERT INTO transactions (user_id, type, amount, recipient_info, description) VALUES ($1, $2, $3, $4, $5)',
        [recipientId, 'transfer', amount, senderRes.rows[0].name, `Transf. Recebida de ${senderRes.rows[0].name}`]
    );

    await pool.query('COMMIT');
    res.json({ success: true, recipientName: dbRecipientName });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro na transferência' });
  }
});

// 9. Atualizar Chave Pix
app.post('/update-pix', async (req, res) => {
    const { userId, pixKey } = req.body;
    try {
        await pool.query('UPDATE users SET chave_pix = $1 WHERE id = $2', [pixKey, userId]);
        res.json({ success: true });
    } catch (err) {
        console.error('Erro ao salvar chave pix:', err);
        res.status(500).json({ error: 'Erro ao salvar chave Pix' });
    }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
});
