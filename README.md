# EUPHORIA

- A ChatBot powered by Google's Gemini AI API, Custom Search JSON API and various other APIs

## Features

- Modern and fully responsive UI
- Gemini AI integration
- Opening websites (use keyword '/open')
- Google Search using Custom Search JSON API (use keyword 'search')
- Fetching most relevant images (use keyword 'generate' or 'image'; example - "images of batman")
- Searching/Playing Songs on Youtube using Youtube Data Search API (use keyword 'play' or 'play on youtube')
- Telling Jokes
- Accurate calculations using math.js library
- Logging history where queries can be revisited

### Work in Progress

- Voice Recognition
- Weather information
- Real time Space information

Feel free to fork and clone it, and tweak it to your liking.

## Build Locally

1. Git clone :

https: `git clone https://github.com/plushexe351/Euphoria-ChatBot.git`
ssh : `git@github.com:plushexe351/Euphoria-ChatBot.git`

2. Change current directoty to Euphoria-ChatBot

`cd Euphoria-ChatBot`

3. Create .env file

`touch .env`

4. Populate .env file with your API keys

```
CUSTOM_SEARCH_ENGINE_ID = <your api key>
GOOGLE_API_KEY = <your api key>
GOOGLE_API_KEY_EXTRA = <your api key>
YOUTUBE_API_KEY = <your api key>
GEMINI_API_KEY = <your api key>
```

Note : Populating each key is required. You may enter duplicate key for GOOGLE_API_KEY_EXTRA

5. Install dependencies

`npm install`

or if you're using yarn

`yarn install`

6. `npm start` to listen at localhost:3000
