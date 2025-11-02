const express = require('express');
const cors = require('cors'); // <-- allows use in my app idk why
const { fetchPacks, getDownloadLink } = require('./api.js');

const app = express();
const port = 3000;

// allows use with apps
app.use(cors());


app.get('/fetch', async (req, res) => {
  try {
    const packs = await fetchPacks(req.query);
    res.json(packs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch packs' });
  }
});

app.get('/download', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL query parameter is required' });
  }

  try {
    const downloadUrl = await getDownloadLink(url);
    if (downloadUrl) {
      res.json({ downloadUrl });
    } else {
      res.status(404).json({ error: 'Download link not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get download link' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
