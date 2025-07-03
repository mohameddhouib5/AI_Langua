async function translateText() {
  const input = document.getElementById("input-text").value.trim();
  const langCode = document.querySelector("input[name='language']:checked").value;

  const langMap = {
    fr: "French",
    sp: "Spanish",
    jp: "Japanese"
  };
  const language = langMap[langCode];

  if (!input || !language) return;

  // Show user message
  const chatBox = document.getElementById("chat-box");
  const userMsg = document.createElement("div");
  userMsg.className = "message user-msg";
  userMsg.textContent = input;
  chatBox.appendChild(userMsg);

  // Call API
  const response = await fetch("http://localhost:3000/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input, language })
  });

  const data = await response.json();

  // Show bot response
  const botMsg = document.createElement("div");
  botMsg.className = "message bot-msg";
  botMsg.textContent = data.translated || "Translation failed.";
  chatBox.appendChild(botMsg);

  // Clear input and scroll
  document.getElementById("input-text").value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
