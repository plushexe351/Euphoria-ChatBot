const sendBtn = document.querySelector('.send');
const container = document.querySelector('.container');
const userMessage = document.querySelector('#userMessage');
const sampleQueries = document.querySelectorAll('.container > div')
const showHistoryBtn = document.querySelector('.fa-history');
const historyModal = document.querySelector('.history-modal');
const loader = document.querySelector('.loader');
const historyContainerDOM = document.querySelectorAll('.history-container');



showHistoryBtn.addEventListener('click', () => {
    historyModal.classList.toggle('active');
})

historyModal.addEventListener('click', () => {
    historyModal.classList.remove('active');
})
function showLoader() {
    loader.classList.add('show');
}

function openLink(searchInput) {
    fetch('/googleSearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchInput, formattedQuery: searchInput.replace('/open', '') }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Opening...") {
                displayMessage("Euphoria", data.message);
                setTimeout(() => {
                    window.location.href = data.result.link;
                }, 500);
            } else if (data.message === "Success") {

                // displayMessage("Euphoria", `${result.snippet}<br/>(${result.title})<br/><a target="_blank" href="${result.link}" style="color:#1377ff">Click here to view full result on Google</a>`);
                displayLinks(data.results);

            } else {
                displayMessage("Euphoria", "No results found");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('Euphoria', error);
        });
}
function googleSearch(searchInput) {
    if (searchInput.trim() === '') {
        alert('Please enter a valid search query.');
        return;
    }
    // Make a POST request to the backend
    fetch('/googleSearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchInput, formattedQuery: searchInput }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Opening...") {
                displayMessage("Euphoria", data.message);
                setTimeout(() => {
                    window.location.href = data.result.link;
                }, 500);
            } else if (data.message === "Success") {

                // displayMessage("Euphoria", `${result.snippet}<br/>(${result.title})<br/><a target="_blank" href="${result.link}" style="color:#1377ff">Click here to view full result on Google</a>`);
                displayLinks(data.results);

            } else {
                displayMessage("Euphoria", "No results found");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('Euphoria', error);
        });

}
function useGemini(searchInput) {
    showLoader();
    try {

        fetch('/geminiSearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: searchInput }),
        }).then(response => response.json())
            .then(data => {
                displayMessage("Euphoria", data.text);

                googleSearch(searchInput);

            })

            .catch(error => {
                console.error('Error:', error);
                displayMessage('Euphoria', error)
            })
    }
    catch (error) {
        displayMessage('Euphoria', error)
    }
    finally {
        console.log("Gemini search successful")

    }
}

function imageSearch(searchInput, numOfImages) {
    if (searchInput.trim() === '') {
        alert('Please enter a valid search query.');
        return;
    }
    fetch('/imageSearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchInput }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Success') {
                for (let i = 0; i < (numOfImages == 1 ? 1 : data.imageResults.length); i++) {
                    const result = data.imageResults[i];
                    displayMessage('Euphoria', `Image Result ${i + 1}<br/><img src="${result.thumbnail}" alt="${result.title}" style="border-radius:0.2rem; width:150px; margin-top:0.5rem"/><br/><a target="_blank" href="${result.link}" style="color:#1377ff;" >View full image</a>`);

                }
            } else {
                displayMessage('Euphoria', 'No image results found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
}


// Display user or chatbot message 
function searchAndPlay(query) {
    fetch('/searchAndPlay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.videoLink);
            // Redirect the user to the YouTube video link received from the backend
            setTimeout(() => {
                window.location.href = data.videoLink;
            }, 500);
            displayMessage("Euphoria", "Playing...");
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
            displayMessage("Euphoria", 'Sorry, there was an error fetching the video.');

        });
}
// ... other code ...
function displayLinks(results) {
    const linkContainer = document.createElement('section');
    linkContainer.classList.add('linkContainer')
    const title = document.createElement('p');
    const linkTitle = ["Here are some links you might like", "You might like these...", "You might wanna check these out"]
    title.textContent = "🔗 " + linkTitle[Math.floor(Math.random() * linkTitle.length)];
    title.classList.add('googleSearchResultLinksTitle');
    linkContainer.appendChild(title);


    results.forEach(result => {
        const link = document.createElement('a');
        link.textContent = result.title;
        link.href = result.link;
        link.classList.add('googleSearchResultLink');
        linkContainer.appendChild(link);
    })
    container?.appendChild(linkContainer);

}
function displayMessage(user, message) {
    const newMessage = document.createElement('div');
    newMessage.classList.add('newMessage');
    const username = document.createElement('h3');
    const timestamp = document.createElement('p');
    const messageContent = document.createElement('div');
    const time = new Date().toLocaleTimeString();
    const day = new Date().toLocaleDateString();

    timestamp.classList.add('time');
    messageContent.classList.add('message');
    username.textContent = user;
    messageContent.innerHTML = user == "You" ? message : marked.parse(message);
    timestamp.textContent = time;

    newMessage.appendChild(username);
    newMessage.appendChild(timestamp);
    newMessage.appendChild(messageContent);
    container.appendChild(newMessage);

    newMessage.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    })

    // Log History 
    if (user == "You") {
        newMessage.classList.add('userSentMsg');
        messageContent.classList.add('msgContent');

        const historyContainer = document.createElement('div');
        const historyMsg = document.createElement('p');
        const timeAdded = document.createElement('span');
        const dateAdded = document.createElement('span');
        const dateTimeContainer = document.createElement('div');

        historyContainer.classList.add('history-container');
        dateAdded.classList.add('date-added');
        timeAdded.classList.add('time-added');

        dateTimeContainer.appendChild(dateAdded);
        dateTimeContainer.appendChild(timeAdded);

        dateTimeContainer.classList.add('date-time');

        timeAdded.textContent = time;
        dateAdded.textContent = day.toString();
        historyMsg.textContent = message;

        const defaultHistoryText = document.querySelector('.btn-shine');

        defaultHistoryText?.remove();

        historyContainer.appendChild(dateTimeContainer)
        historyContainer.appendChild(historyMsg);
        historyModal.appendChild(historyContainer);
        historyContainer.addEventListener('click', () => {
            userMessage.value = historyMsg.textContent;
            historyModal.classList.remove('active');
            sendBtn.click();
        });
    }
    if (user == 'Euphoria') {
        newMessage.classList.add('highlight');
        loader?.classList.remove('show');
        setTimeout(() => {
            newMessage.classList.remove('highlight');
        }, 1000);
    }
}



// Send sample queries

sampleQueries.forEach(query => {

    query.addEventListener('click', () => {
        setTimeout(() => {
            userMessage.value = query.textContent;
            sendMessage();
        }, 300);
    })

})

// handle submit button and queries 

async function fetchDarkJoke() {
    const darkJokes = [
        'I told my wife she should embrace her mistakes. She gave me a hug.',
        `Why don't scientists trust atoms ? Because they make up everything, even the dark stuff.`,
        `I asked the librarian if the library had books on paranoia. She whispered, "They're right behind you."`,
        'I used to play piano by ear, but now I use my hands and fingers.',
        'My wife told me I should embrace my mistakes. So I gave her a hug.',
        `I only know 25 letters of the alphabet. I don’t know y and z.`,
        `I asked the doctor for something to cure my kleptomania. He gave me pills and said, "If those don’t work, get me a TV."`,
        `I'm reading a book on anti - gravity.It's impossible to put down.`,
        `I told my computer I needed a break, and now it won’t stop sending me vacation ads.`,
        `Why don’t skeletons fight each other? They don’t have the guts.`,
    ];

    const randomDarkJoke = darkJokes[Math.floor(Math.random() * darkJokes.length)];

    return randomDarkJoke;
}

function calculate(query) {
    try {
        const result = math.evaluate(query);
        return result;
    } catch (error) {
        return "Error in calculation";
    }
}

function containsMathExpression(query) {
    const mathExpressionRegex = /[+\-*/\d()]/;
    return mathExpressionRegex.test(query);
}

async function sendMessage() {
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

        if (formattedQuery.includes('who is your creator') || formattedQuery.includes('who made you') || formattedQuery.includes('who created you') || formattedQuery.includes('who are you made by') || formattedQuery.includes('who is ush') || formattedQuery.includes('who is ushnish') || (formattedQuery.includes('ushnish') && !formattedQuery.includes("image")) || formattedQuery == 'ush') {
            displayMessage("Euphoria", `☂️<a style="color:blueviolet; font-weight:300; font-size:2rem; font-family:dotty" href="https://github.com/plushexe351"> Ushnish Tapaswi</a> is my creator. Is there anything I can help you with?`);
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


// keyboard support 

document.addEventListener('keydown', (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        sendMessage();
    }
})






