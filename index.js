const express = require('express');
const cors = require('cors');
const { fetchPacks, getDownloadLink } = require('./api.js');

const app = express();
const port = 3000;

// Allow CORS for external use
app.use(cors());

// options
const allowedParams = ['search', 'page', 'resolution', 'version', 'game', 'sort', 'tags'];

const validResolutions = ['16', '32', '64', '128', '256', '512'];
const validVersions = [
  '1.7', '1.8', '1.9', '1.10', '1.11', '1.12', '1.13', '1.14', '1.15',
  '1.16', '1.17', '1.18', '1.19', '1.20'
];
const validGames = ['jav', 'bed'];
const validSorts = ['newol', 'olnew', 'az', 'za', 'dd', 'da'];

function validateFetchQuery(query) {
  const errors = [];

  // parameters
  Object.keys(query).forEach((key) => {
    if (!allowedParams.includes(key)) {
      errors.push(`Invalid parameter "${key}"`);
    }
  });

  // resolution
  if (query.resolution) {
    const resList = query.resolution.split(',');
    const invalid = resList.filter(r => !validResolutions.includes(r.trim()));
    if (invalid.length)
      errors.push(`Invalid resolution(s): ${invalid.join(', ')}. Allowed: ${validResolutions.join(', ')}`);
  }

  // version 
  if (query.version) {
    const verList = query.version.split(',');
    const invalid = verList.filter(v => !validVersions.includes(v.trim()));
    if (invalid.length)
      errors.push(`Invalid version(s): ${invalid.join(', ')}. Allowed: ${validVersions.join(', ')}`);
  }

  // Validate
  if (query.game && !validGames.includes(query.game))
    errors.push(`Invalid game value "${query.game}". Allowed: ${validGames.join(', ')}`);

  // validate
  if (query.sort && !validSorts.includes(query.sort))
    errors.push(`Invalid sort value "${query.sort}". Allowed: ${validSorts.join(', ')}`);

  return errors;
}





// /fetch endpoint
app.get('/fetch', async (req, res) => {
  const errors = validateFetchQuery(req.query);

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid query parameters.',
      details: errors,
      hint: {
        allowedParams,
        validResolutions,
        validVersions,
        validGames,
        validSorts
      }
    });
  }

  try {
    const packs = await fetchPacks(req.query);
    res.json(packs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch packs' });
  }
});




// /download endpoint
app.get('/download', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({
      error: 'URL query parameter is required.',
      hint: 'Example: /download?url=https://pvprp.com/pack/faithful-32x'
    });
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
  console.log(`✅ Server is running on http://localhost:${port}`);
});
