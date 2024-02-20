const express = require('express');
const compression = require('compression');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs').promises;


const port = 3000;
const expressSitemapXml = require('express-sitemap-xml');
const glob = require('glob');
const path = require('path');
const articlesDirectory = path.join(__dirname, 'public', 'articles');

const app = express();

const PORT = process.env.PORT || 3000;

// Enable compression
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));

/* Send SMS */
app.use(bodyParser.json());

app.post('/send-sms', async (req, res) => {
    const url = "https://api.gateway360.com/api/3.0/sms/send";
    const data = req.body; // Assuming the body of the request to your server contains the data for the SMS API

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        res.send(responseData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
/******************* */

/// API endpoint to list articles
app.get('/api/articles', async (req, res) => {
    try {
        const files = await fs.readdir(articlesDirectory);
        const articles = await Promise.all(files.map(async (file) => {
            const filePath = path.join(articlesDirectory, file);
            const content = await fs.readFile(filePath, 'utf8');
            return {
                title: file.replace('.html', '').replace(/_/g, ' '),
                content: content
            };
        }));
        res.json(articles);
    } catch (err) {
        console.error("Could not read the articles directory.", err);
        res.status(500).send('Server error');
    }
});

app.use(express.static('public'));

async function getUrls() {
    const urls = [
        '/',
        '/about',
        '/contact',
        // ... other URLs
    ];

    const articleFiles = glob.sync(path.join(__dirname, 'public/articles/*.html'));
    const sectionsFiles = glob.sync(path.join(__dirname, 'public/sections/*.html'));
    const articleUrls = articleFiles.map(file => `/articles/${path.basename(file, '.html')}`);
    const sectionsUrls = sectionsFiles.map(file => `/sections/${path.basename(file, '.html')}`);
    return [...urls, ...articleUrls, ...sectionsUrls];
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
app.get('/sections/newsletter', (req, res) => {
    const newsletterId = req.params.newsletterId;
    const newsletterPath = path.join(__dirname, 'public', 'sections', 'newsletter.html');
    res.sendFile(newsletterPath);
});

app.post('/sendEmailAsSMS', async (req, res) => {
    const email = req.body.email; // Assuming you have the email field in your form
    const smsBody = `Ethics Land - New subscription from: ${email}`;

    try {
        const response = await axios.post('https://api.gateway360.com/api/3.0/sms/send', {
            api_key: "8e9b359bf09d45c882896f86c38c3ac2",
            report_url: "http://yourserver.com/callback/script",
            concat: 1,
            messages: [
                {
                    from: "Ethics Land",
                    to: "34626381615", // The recipient's phone number
                    text: smsBody,
                    // Remove 'send_at' if you want to send immediately
                }
            ]
        });

        console.log(response.data);
        res.send('Email sent as SMS successfully!');
    } catch (error) {
        console.error(error);
        res.send('Failed to send Email as SMS.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});