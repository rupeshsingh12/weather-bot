const messages = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = 'message ' + sender;
  msg.textContent = (sender === 'user' ? 'You: ' : 'Bot: ') + text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function fetchWeather(city) {
  fetch('/get_weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city: city })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        addMessage(data.error, 'bot');
      } else {
        const reply = `In ${data.city}, it's ${data.temp}°C with ${data.desc}. Humidity: ${data.humidity}%.`;
        addMessage(reply, 'bot');
      }
    })
    .catch(() => addMessage("Couldn't get weather info right now.", 'bot'));
}

function handleUserInput() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';

  const match = text.match(/weather in (.+)/i);
  if (match && match[1]) {
    const city = match[1].trim();
    fetchWeather(city);
  } else {
    addMessage("Ask like: 'What's the weather in Tokyo?'", 'bot');
  }
}

sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleUserInput();
});
