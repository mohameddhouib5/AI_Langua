async function translateText() {
  const input = document.getElementById("input-text").value.trim();
  const langCode = document.querySelector("input[name='language']:checked").value;

  const langMap = {
    fr: "French",
    sp: "Spanish",
    jp: "Japanese"
  };

  const language = langMap[langCode];

  if (!input || !language) return alert("Please complete all fields.");

  const response = await fetch("http://localhost:3000/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input, language })
  });

  const data = await response.json();

  if (data.translated) {
    document.getElementById("original-text").textContent = input;
    document.getElementById("translated-text").textContent = data.translated;
    document.getElementById("form-view").style.display = "none";
    document.getElementById("result-view").style.display = "block";
  } else {
    alert("Translation failed.");
  }
}
function startOver() {
  document.getElementById("input-text").value = "";
  document.getElementById("form-view").style.display = "block";
  document.getElementById("result-view").style.display = "none";
}
const content = [
  `<div style="line-height: 1.6; font-size: 14px;">
     <strong>GPT-4o-mini Integration:</strong><br>
     In this project, I integrated <strong>OpenAI's GPT-4o-mini</strong> model to power real-time translations.<br>
     The model is securely accessed via a <strong>Node.js backend</strong> using the <strong>Azure OpenAI API</strong>.<br>
     It provides fast and accurate responses through a dynamic chat interface.
   </div>`,

  `<div style="line-height:1.6; font-size:14px;">
     <h3 style="color:#007bff;">Overview: How the OpenAI API Works</h3>
     <p>Each request to the API includes two main components:<br>
     <strong>1)</strong> a <strong>model</strong> and 
     <strong>2)</strong> an <strong>array of messages</strong>, along with optional parameters (explained later).</p>

     <h3 style="color:#007bff;">1. What is the Model?</h3>
     <p>A model is a large language algorithm trained to recognize patterns and make predictions or decisions.</p>
     <ul>
       <li>Text generation models</li>
       <li>Speech generation models</li>
       <li>Voice generation models</li>
     </ul>
     <p>Our selected model: <strong>GPT-4o-mini</strong></p>

     <h3 style="color:#007bff;">2. The Array of Messages</h3>
     <p>The message array includes several parts:</p>
     <p><strong>System Message:</strong> Instructs the model how to behave. For example:</p>
     <code>You are a translator from English to 'LANG'. Don't be very creative. Translate the sentence as it is. If it's unrecognizable, return it unchanged.</code>
     <p><strong>User Message:</strong> For example: <code>"Good morning"</code> with French selected.</p>
     <p>The OpenAI API returns the assistant's message: <code>"Bonjour."</code></p>
   </div>`,

  `<div style="line-height:1.6; font-size:14px;">
     <h3 style="color:#007bff;">Prompt Engineering</h3>
     <p>
       Prompt engineering is the art of designing effective inputs for generative AI models like ChatGPT to get optimal outputs.
       In this part, we mainly focus on the <strong>system</strong> message of the request.
     </p>
     <p>
       For example, in our case, we can write a system prompt like this:
     </p>
     <code style="display:block; margin:10px 0; background:#f0f0f0; padding:10px; border-radius:5px;">
       You are the most powerful translator on Earth. You know everything about translation.<br>
       Your answers are always funny. Users usually translate sentences shorter than 50 words.<br>
       If the input is too long, kindly reply: "Your sentence is too long to translate."
     </code>
     <p>
       This gives our AI a defined behavior and personality, making it more consistent and helpful to users.
     </p>
   </div>`,
     `<div style="line-height:1.6; font-size:14px;">
     <h3 style="color:#007bff;">Tokens</h3>
     <p>
       In OpenAI models, a <strong>token</strong> is not exactly a character or a word. It’s a chunk of text of variable length.
       On average, 1 token ≈ 4 characters of English text.
     </p>
     <p>
       When we log the response from the API, we get useful metadata in the <code>usage</code> section:
     </p>
     <code style="display:block; margin:10px 0; background:#f9f9f9; padding:10px; border-radius:5px;">
       usage: { prompt_tokens: 44, completion_tokens: 56, total_tokens: 100 }
     </code>
     <ul>
       <li><strong>44</strong>: Tokens used in the prompt (user + system message)</li>
       <li><strong>56</strong>: Tokens used in the assistant's response</li>
       <li><strong>Total</strong>: What you pay for in usage/credits</li>
     </ul>
     <h4 style="margin-top:15px; color:#555;">Why it matters</h4>
     <ul>
       <li>Tokens cost money — API usage is billed based on token count</li>
       <li>More tokens = more processing = slower responses</li>
     </ul>

     <h4 style="margin-top:15px; color:#555;">What we can do</h4>
     <p>
       You can use the <code>max_tokens</code> parameter to limit the size of the output:
     </p>
     <ul>
       <li><strong>It limits only the output</strong> — not the size of your input</li>
       <li><strong>Downside:</strong> It may cut responses mid-way if set too low</li>
     </ul>
     <p>
       To detect this, check <code>finish_reason</code> in the response:
     </p>
     <ul>
       <li><code>"stop"</code> means response ended normally</li>
       <li><code>"length"</code> means it stopped due to max_tokens limit</li>
     </ul>
     <p><strong style="color:#d9534f;">Be sure to allow enough tokens for a complete response!</strong></p>
   </div>`,
     `<div style="line-height:1.6; font-size:14px;">
    <h3 style="color:#007bff;">Temperature</h3>
    <p><strong>What is it?</strong><br>
    Temperature controls how <em>daring</em> or creative the AI's response is. It's a value from <strong>0 to 2</strong> (default: <strong>1</strong>).</p>

    <ul>
      <li><strong>Lower Temperature (e.g., 0.2)</strong> – Less daring, more predictable. Best for factual or consistent outputs.</li>
      <li><strong>Higher Temperature (e.g., 1.8)</strong> – More daring, more random. Good for creative tasks like storytelling or brainstorming.</li>
    </ul>

    <p><strong>In real use:</strong><br>
    Just like humans don’t write the exact same thing twice, the AI behaves similarly. With higher temperature, the same prompt can produce different responses each time.</p>

    <h4 style="color:#007bff; margin-top:20px;">Few-Shot Prompting</h4>
    <p>This is where we give the AI examples (like an array of messages) to guide it toward better answers.</p>
    <ul>
      <li><strong>Pro:</strong> It improves response consistency by showing patterns.</li>
      <li><strong>Con:</strong> Expensive (uses many tokens) and may reduce performance.</li>
    </ul>

    <h4 style="color:#007bff; margin-top:20px;">Stop Sequences</h4>
    <p><strong>What are they?</strong><br>
    Stop sequences tell the model when to stop generating text. It's a list (max 4 items) of strings that, when encountered, halt the output.</p>

    <p>Why use them?</p>
    <ul>
      <li>The model finishes either because it:</li>
      <ul>
        <li>Reached the end of its task</li>
        <li>Hit the token limit</li>
        <li>Encountered a <strong>stop sequence</strong></li>
      </ul>
    </ul>

    <p><strong>Example:</strong><br>
    If we ask the model to generate translation alternatives and don’t want it to go beyond 2 options, we can add:
    </p>
    <code style="display:block; background:#f9f9f9; padding:8px; margin:10px 0; border-radius:5px;">stop: ["3."]</code>
    <p>This tells the model to stop before generating a third option.</p>
  </div>`,
   `<div style="line-height:1.6; font-size:14px;">
    <h3 style="color:#007bff;">Presence & Frequency Penalties</h3>

    <p>These parameters help control how <strong>repetitive</strong> or <strong>diverse</strong> the AI's output is—so it doesn't sound robotic or overly repetitive.</p>

    <h4 style="margin-top:15px; color:#333;">🟢 Presence Penalty</h4>
    <ul>
      <li>Value: <strong>-2 to 2</strong> (default: <strong>0</strong>)</li>
      <li>Encourages or discourages discussing <strong>new topics</strong></li>
      <li><strong>Higher values → more diverse, off-topic ideas</strong></li>
    </ul>
    <p><strong>Example:</strong><br>
    <em>Prompt:</em> "Give me some news"<br>
    <strong>Low presence penalty:</strong> "Today is hot."<br>
    <strong>High presence penalty:</strong> "Today is hot, I bought a new phone, my wife broke up with me..."</p>

    <h4 style="margin-top:15px; color:#333;"> 🟡 Frequency Penalty</h4>
    <ul>
      <li>Value: <strong>-2 to 2</strong> (default: <strong>0</strong>)</li>
      <li>Controls how often the model repeats <strong>the same phrases</strong></li>
      <li><strong>Higher values → less repetition</strong></li>
    </ul>
    <p><strong>Example:</strong><br>
    <em>Prompt:</em> "How was your week?"<br>
    <strong>Low frequency penalty:</strong> "Literally... literally... literally..." 😣<br>
    <strong>High frequency penalty:</strong> "It was productive. I worked, read, and relaxed."</p>

    <p><strong>Note:</strong> These settings are most impactful in <strong>long-form outputs</strong>.</p>
  </div>`,
    `<div style="line-height:1.6; font-size:14px;">
    <h3 style="color:#007bff;" Fine-Tuning</h3>
    <p><strong>Fine-tuning</strong> means taking a standard pretrained model and training it on your own <strong>custom dataset</strong> to make it better at a specific task.</p>

    <h4 style="margin-top:15px; color:#333;"> Use Cases:</h4>
    <ul>
      <li><strong>Tone & Style:</strong> Teach the model how you want it to sound.</li>
      <li><strong>Format:</strong> Generate output in a strict structure (e.g., JSON).</li>
      <li><strong>Function Calling:</strong> Improve reliability of triggering specific behaviors.</li>
      <li><strong>Cost Efficiency:</strong> Reduce need for long few-shot prompts (saves tokens!).</li>
    </ul>

    <h4 style="margin-top:15px; color:#333;">Fine-Tuning Requirements:</h4>
    <ul>
      <li>Minimum <strong>50 examples</strong> (more = better, but not infinite).</li>
      <li>All data should be <strong>human-checked</strong> for quality.</li>
      <li>Format: <strong>JSONL</strong> (JSON Lines).</li>
      <li>Each example should include all 3 roles: <code>system</code>, <code>user</code>, and <code>assistant</code>.</li>
    </ul>

    <p>This lets you build a <strong>custom model</strong> that’s tailored to your subject or domain.</p>
  </div>`
];



function showContent(index) {
  document.getElementById("content-area").innerHTML = content[index];
}
