const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = 3000;
const API_KEY = process.env.TMDB_API_KEY;
const REGION = 'BR';

app.get('/api/busca', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ erro: 'Falta o parâmetro "query"' });

  try {
    const searchRes = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
      params: {
        api_key: API_KEY,
        query,
        language: 'pt-BR'
      }
    });

    const results = await Promise.all(searchRes.data.results.slice(0, 8).map(async (item) => {
      const id = item.id;
      const tipo = item.media_type;

      const providerRes = await axios.get(`https://api.themoviedb.org/3/${tipo}/${id}/watch/providers`, {
        params: { api_key: API_KEY }
      });

      const providers = providerRes.data.results?.[REGION]?.flatrate || [];

      return {
        titulo: item.title || item.name,
        tipo,
        imagem: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        plataformas: providers.map(p => ({
          nome: p.provider_name,
          logo: `https://image.tmdb.org/t/p/w45${p.logo_path}`
        })),
        link: `https://www.themoviedb.org/${tipo}/${id}`
      };
    }));

    res.json({ resultados: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar dados' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});