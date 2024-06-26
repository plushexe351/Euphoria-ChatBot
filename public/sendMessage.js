export async function sendMessage() {
    if (userMessage.value != "") {

        if (!container.classList.contains('chat-mode')) {
            container.innerHTML = "";
        }

        let query;
        let formattedQuery;
        let response;

        container.classList.add('chat-mode')
        query = userMessage.value;
        formattedQuery = query.toLowerCase().trim();
        userMessage.value = "";

        displayMessage("You", query);

        if (formattedQuery == ("hello") || formattedQuery == ("hey") || formattedQuery == ("hi")) {
            response = "Hello, how may I help you today ?";
            displayMessage("Euphoria", response);
            return;
        }

        if (containsMathExpression(query) && (query.toLowerCase().includes("what is") || query.toLowerCase().includes("calculate") || query.toLowerCase().includes("Evaluate"))) {
            const mathQuery = query.toLowerCase().replace("what is", "").replace("calculate", "").replace("evaluate", "");
            const mathResult = calculate(mathQuery);
            displayMessage("Euphoria", `${mathQuery} = ${mathResult}`)
            console.log(mathResult);
            return;
        }

        if (query.toLowerCase().includes('tell me a joke') || (query.toLowerCase().includes('jokes') && query.toLowerCase().includes('say')) || ((query.toLowerCase().includes('jokes') || query.toLowerCase().includes('joke')) && query.toLowerCase().includes('tell'))) {
            const joke = await fetchDarkJoke();
            displayMessage('Euphoria', joke);
            return;
        }

        if (query.toLowerCase().includes('play') || (query.toLowerCase().includes('play') && query.toLowerCase().includes('youtube')) || (query.toLowerCase().includes('search') && query.toLowerCase().includes('youtube'))) {
            searchAndPlay(formattedQuery);
            return;
        }
        if (formattedQuery.includes('search') || formattedQuery.includes('google')) {
            query = query.replace("search", "").replace("for", "").replace("on", "").replace("google", "");
            displayMessage("Euphoria", `Searching "${query}"...`);
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            setTimeout(() => {
                window.location.href = googleSearchUrl;
            }, 700);
            return;
        }

        if (formattedQuery.includes('how are you')) {
            displayMessage('Euphoria', `I'm doing well. What can I help you with?`);
            return;
        }
        if (formattedQuery.includes('who are you') || formattedQuery.includes('introduce yourself') || formattedQuery.includes('your introduction')) {
            displayMessage('Euphoria', `I'm Euphoria, a chatBot powered by Google's Gemini AI and various other APIs. Is there anything I can help you with ?`);
            return;
        }

        if (formattedQuery.includes('your name') && formattedQuery.includes('what')) {
            displayMessage("Euphoria", `I'm Euphoria. Is there anything I can help you with?`);
            return;
        }

        if (formattedQuery.includes('who is your creator') || formattedQuery.includes('who made you') || formattedQuery.includes('who are you made by') || formattedQuery.includes('who is ush') || formattedQuery.includes('who is ushnish') || (formattedQuery.includes('ushnish') && !formattedQuery.includes("image")) || formattedQuery == 'ush') {
            displayMessage("Euphoria", `<a style="color:blueviolet;" href="https://github.com/plushexe351">Ushnish Tapaswi</a> is my creator. Is there anything I can help you with?`);
            return;
        }

        if (formattedQuery == "clear") {
            container.innerHTML = "";
            return;
        }
        if (formattedQuery.includes("image") && (formattedQuery.includes("of") || formattedQuery.includes("generate") || formattedQuery.inclues("show") || formattedQuery.includes("display"))) {
            let numOfImagesToDisplay = (!formattedQuery.includes("images")) ? "is an image" : "are few images";
            displayMessage("Euphoria", `Here ${numOfImagesToDisplay} matching your query - ${formattedQuery} :`)
            setTimeout(() => {
                numOfImagesToDisplay == "are few images" ? imageSearch(formattedQuery, 0) : imageSearch(formattedQuery, 1);
            }, 700);
            return;
        }

        if (formattedQuery.includes('/open')) {
            openLink(formattedQuery);
        }
        useGemini(formattedQuery);


    }
}