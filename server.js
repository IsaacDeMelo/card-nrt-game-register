
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Porta dinâmica para o Render

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do React (após o build)
app.use(express.static(path.join(__dirname, 'dist')));

// --- MONGODB CONNECTION ---
// URL Atualizada com o cluster correto (cluster0.rxemo)
const MONGO_URI = "mongodb+srv://isaachonorato41:brasil2021@cluster0.rxemo.mongodb.net/narutorpg?retryWrites=true&w=majority&appName=Cluster0";

console.log("Tentando conectar ao MongoDB...");

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Conectado com Sucesso!"))
  .catch(err => {
    console.error("❌ Erro ao conectar no MongoDB:", err);
    console.log("ℹ️  Verifique se o IP 0.0.0.0/0 está liberado no 'Network Access' do MongoDB Atlas.");
  });

// Schema do Ninja
const NinjaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  whatsapp: { type: String, required: true },
  cla: { type: String, required: true },
  quemRecrutou: { type: String, default: '' },
  dataRegistro: { type: Date, default: Date.now }
});

const Ninja = mongoose.model('Ninja', NinjaSchema);

// --- ROTAS DA API ---

app.post('/api/register', async (req, res) => {
  try {
    const { nome, whatsapp, cla, quemRecrutou } = req.body;

    if (!nome || !whatsapp || !cla) {
      return res.status(400).json({ success: false, message: "Preencha todos os campos obrigatórios." });
    }

    const novoNinja = new Ninja({
      nome,
      whatsapp,
      cla,
      quemRecrutou
    });

    await novoNinja.save();
    console.log(`🥷 Novo Ninja Cadastrado: ${nome} (Clã: ${cla})`);

    res.status(201).json({ success: true, message: "Inscrição realizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar:", error);
    res.status(500).json({ success: false, message: "Erro interno no servidor." });
  }
});

// Rota para o painel administrativo (Listar todos)
app.get('/api/admin/all-ninjas', async (req, res) => {
  try {
    const ninjas = await Ninja.find().sort({ dataRegistro: -1 }); // Mais recentes primeiro
    res.json(ninjas);
  } catch (error) {
    console.error("Erro ao buscar ninjas:", error);
    res.status(500).json({ error: "Erro ao buscar ninjas" });
  }
});

// --- ROTA CATCH-ALL ---
// Qualquer requisição que não seja para /api será tratada pelo React (Frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});
