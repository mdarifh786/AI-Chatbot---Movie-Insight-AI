let msgList = [];
let defaultQuery = 'You are a movie expert chatbot. I will give you the name of a movie, webseries, or tv series. Provide a detailed analysis of the movie in the following format:🎬 Movie Analysis: *[Movie Name]* (Year)📝 Summary  - Give a brief 3-5 sentence summary of the movie plot.⭐ Ratings  - IMDb rating out of 10  - Rotten Tomatoes score in %  - Metacritic score out of 100👥 Cast & Crew  - Director  - Main cast (3-5 actors)  - Writer  - Production company🎭 Genres  - List of genres🧠 Themes & Analysis  - Mention the central themes of the movie  - Include deeper meanings or interpretations🏆 Awards & Nominations  - List major awards won or nominated for💬 Audience Reactions  - 2-3 sample audience reactions or review quotes📈 Box Office  - Budget  - Worldwide gross earnings🔍 Fun Facts  - Include 1-3 interesting trivia or behind-the-scenes factsMovie name: ________________ and dont reply to this prompt also give output without **_____** after every topic.And also dont reply to anything else or display Please enter a valid movie title. 🎬 if movie is not found, Reply to greetings only with Hi! I’m your Movie Insight AI 🤖Drop a movie name and I’ll give you ratings, cast, themes, fun facts and more!';

function createQuery() {
    let q = `${defaultQuery}\n`;
    for (let i = 0; i < msgList.length; i++) {
        if (i === msgList.length - 1) {
            q += '\nNow: ';
        } else if (i % 2 === 0) {
            q += 'I replied:\n';
        } else {
            q += '\nThen you replied:\n';
        }
        q += msgList[i];
    }
    return q;
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userText = input.value.trim();

    if (userText === '') return;

    msgList.push(userText);

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user-message';
    userMsg.textContent = userText;
    chatBox.appendChild(userMsg);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    const botMsg = document.createElement('div');
    botMsg.className = 'chat-message bot-message typing';
    botMsg.textContent = "Typing...";
    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    let queryText = createQuery();
    const reply = await getBotReply(queryText);
    msgList.push(reply);

    botMsg.classList.remove('typing');
    botMsg.innerHTML = '';

    // Typing animation with correct line break rendering
    let i = 0;
    const formattedReply = reply.replace(/\n/g, '\u0001'); // Placeholder for line breaks

    function typeReply() {
        if (i < formattedReply.length) {
            const char = formattedReply.charAt(i);
            if (char === '\u0001') {
                botMsg.innerHTML += '<br>';
            } else {
                botMsg.innerHTML += char;
            }
            i++;
            chatBox.scrollTop = chatBox.scrollHeight;
            setTimeout(typeReply, 20);
        }
    }

    typeReply();
}

const API_KEY = "AIzaSyCrF1q3tgYFp60opxTm5GsAHPpGAONM7KU"; // Replace with your key
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function getBotReply(userInput) {
    try {
        const response = await axios.post(
            `${ENDPOINT}?key=${API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: userInput }]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        return text;
    } catch (error) {
        console.error("Error calling Gemini API:", error.response?.data || error.message);
        return "Sorry, something went wrong.";
    }
}

document.getElementById('user-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

function refreshPage() {
    window.location.reload();
}
