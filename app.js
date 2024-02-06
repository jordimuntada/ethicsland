const express = require('express');
const app = express();
const expressSitemapXml = require('express-sitemap-xml');
const glob = require('glob');
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

async function getUrls() {
    const urls = [
        '/',
        '/about',
        '/contact',
        // ... other URLs
    ];

    const articleFiles = glob.sync(path.join(__dirname, 'public/articles/*.html'));
    const articleUrls = articleFiles.map(file => `/articles/${path.basename(file, '.html')}`);
    return [...urls, ...articleUrls];
}

app.use(expressSitemapXml(getUrls, 'https://ethics.land'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/articles/:articleId', (req, res) => {
    const articleId = req.params.articleId;
    const articlePath = path.join(__dirname, 'public', 'articles', `${articleId}.html`);
    res.sendFile(articlePath);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});