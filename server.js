const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());


const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const googleApiKey = process.env.GOOGLE_API_KEY;
const googleApiKeyFallback = process.env.GOOGLE_API_KEY_EXTRA;
const customSearchEngineId = process.env.CUSTOM_SEARCH_ENGINE_ID;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const { GoogleGenerativeAI } = require('@google/generative-ai')

app.post('/geminiSearch', async (req, res) => {
    const genAI = new GoogleGenerativeAI("AIzaSyBM4VjictreZGjd4NplDnb06ETrImsAKxU");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let query = req.body.query;
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: `you're a chatbot here to assist me. Say "use /open" when I ask you to open something and if i use"/open", then say nothing` }],
            },
            {
                role: "model",
                parts: [{ text: `Great to meet you. Sure, i will direct you to use "use /open" to open webpages when you need. How can I help you today?` }],
            },
        ],
        generationConfig: {
            maxOutputTokens: 1000,
        },

    });

    const msg = query;
    const result = await chat.sendMessageStream(msg);

    let text = '';
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        text += chunkText;
    }
    res.json({
        text
    })
});


app.post('/searchAndPlay', async (req, res) => {
    const apiKey = youtubeApiKey;
    const searchInput = req.body.query;

    if (!searchInput || searchInput.trim() === '') {
        return res.status(400).json({ error: 'Please provide a valid search query.' });
    }

    try {
        // Use node-fetch for making HTTP requests
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(searchInput)}&part=snippet&key=${apiKey}`);
        const data = await response.json();

        const videoId = data.items[0].id.videoId;
        const videoLink = `https://www.youtube.com/watch?v=${videoId}`;

        res.json({ videoLink });
    } catch (error) {
        console.error('Error fetching data from YouTube API:', error);
        res.status(500).json({ error: 'An error occurred while fetching data. Please try again later.' });
    }
});



app.post('/googleSearch', async (req, res) => {
    const googleSearchApiKey = googleApiKeyFallback;
    const cx = customSearchEngineId;
    const query = req.body.query;

    const googleSearchApiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(req.body.formattedQuery)}&key=${googleApiKeyFallback}&cx=${cx}`;

    try {
        const response = await fetch(googleSearchApiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const results = data.items.slice(0, 5).map(result => ({
                title: result.title,
                snippet: result.snippet,
                link: result.link
            }));

            if (req.body.query.includes('/open')) {
                res.json({ message: "Opening...", result: results[0] });
                return;
            }

            res.json({ message: "Success", results });
        } else {
            res.json({ message: "No results found" });
        }
    } catch (error) {
        console.error('Error fetching search results from Google:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data. Please try again later.' });
    }
});

app.post('/imageSearch', async (req, res) => {
    const query = req.body.query;

    if (!query) {
        return res.status(400).json({ error: 'Please provide a search query' });
    }

    const googleSearchApiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${googleApiKeyFallback}&cx=${customSearchEngineId}&searchType=image`;

    try {
        const response = await fetch(googleSearchApiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const imageResults = data.items.slice(0, 3).map(item => ({
                title: item.title,
                link: item.link,
                thumbnail: item.image.thumbnailLink,
            }));

            res.json({ message: 'Success', imageResults });
        } else {
            res.json({ message: 'No image results found' });
        }
    } catch (error) {
        console.error('Error fetching image search results from Google:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data. Please try again later.' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
