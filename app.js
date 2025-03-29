const express = require('express');
const { sendWhatsappMessage } = require('./twilio');
const axios = require('axios');
const cors = require("cors");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/chat/receive', async (req, res) => {
  const { Body, From } = req.body;
  const User = From.split('+')[1];

  console.log(`📥 Mensagem recebida de: ${User}`);
  console.log(`📥 Corpo da mensagem: ${Body}`);

  try {
    const n8nResponse = await axios.post(process.env.N8N_WEBHOOK_URL, {
      session_id: User,
      message: Body,
    });

    await sendWhatsappMessage(From, n8nResponse.data);

    console.log('📤 Dados enviados para n8n com sucesso!');
    console.log('📥 Resposta do n8n:', n8nResponse.data);
  } catch (error) {
    console.error('❌ Erro ao enviar dados para n8n:', error);
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
