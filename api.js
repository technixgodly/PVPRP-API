const cheerio = require('cheerio');
const axios = require('axios');

async function fetchPacks(filters) {
  const searchParams = new URLSearchParams({
    a: 'search',
    'search-main': filters.search || '',
    'search-page': filters.page || '1',
    resolution: filters.resolution || '',
    version: filters.version || '',
    game: filters.game || 'jav',
    sort: filters.sort || 'dd',
    'pack-tags': filters.tags || '',
    'pack-order': filters.order || '',
    'grid-amount': filters.gridAmount || '',
  });

  const response = await axios.get(`https://pvprp.com/actions/search-t.php?${searchParams}`);
  const $ = cheerio.load(response.data);

  const packs = [];
  $('.in-grid.pack-hov').each((index, el) => {
    const element = $(el);
    const packPageUrl = 'https://pvprp.com' + element.find('a').attr('href');
    const packIconUrl = element.find('.grid-banner').attr('src');
    const packName = element.find('.pack-title').text().trim();
    const resolution = element.find('h2.res').text().trim();
    const author = element.find('.tooltip.bg.bold h5').text().trim();
    const authorProfileUrl = element.find('.pack-pfp a').attr('href');
    const authorPfpUrl = element.find('.pack-pfp img').attr('src');
    const stats = element.find('.stats-grid h5.gray');
    const views = $(stats[0]).text().trim();
    const downloads = $(stats[1]).text().trim();

    packs.push({
      packName,
      author,
      resolution,
      packIconUrl,
      authorPfpUrl,
      authorProfileUrl,
      views,
      downloads,
      packPageUrl,
    });
  });

  return packs;
}

async function getDownloadLink(packPageUrl) {
  const { data: html } = await axios.get(packPageUrl);
  const match = html.match(/href"\)\s*==\s*"([^"]+\.zip[^"]*)"/);

  if (match) {
    let downloadUrl = match[1];
    if (!downloadUrl.startsWith('http')) {
      downloadUrl = 'https://pvprp.com/' + downloadUrl.replace(/^\/?/, '');
    }
    
    const rawUrl = downloadUrl;
    const [basePart, queryPart] = rawUrl.split('?');
    const prefix = basePart.substring(0, basePart.lastIndexOf('/') + 1);
    const filename = basePart.substring(basePart.lastIndexOf('/') + 1);
    const encodedFilename = encodeURIComponent(filename);
    const encodedQuery = queryPart
      ? encodeURIComponent(queryPart)
          .replace(/%3D/g, '=')
          .replace(/%26/g, '&')
      : '';
    
    return `${prefix}${encodedFilename}${encodedQuery ? '?' + encodedQuery : ''}`;
  }
  
  return null;
}

module.exports = { fetchPacks, getDownloadLink };
