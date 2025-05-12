const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en";
const JOKE_API = "https://v2.jokeapi.dev/joke/Any";

// Custom word-specific jokes
const customJokes = {
  apple: "Why did the apple stop in the middle of the road? It ran out of juice!",
  book: "I'm reading a book on anti-gravity. It's impossible to put down!",
  time: "Why did the clock get promoted? It had great timing!",
  code: "Why do programmers prefer dark mode? Because light attracts bugs!",
  school: "Why did the teacher wear sunglasses? Because her students were so bright!"
};

// DOM Elements
const wordInput = document.getElementById('wordInput');
const searchBtn = document.getElementById('searchBtn');
const newJokeBtn = document.getElementById('newJokeBtn');
const wordEl = document.getElementById('word');
const definitionEl = document.getElementById('definition');
const jokeEl = document.getElementById('joke');

let currentWord = '';

// Fetch word definition
async function getDefinition(word) {
  try {
    const res = await fetch(`${DICTIONARY_API}/${word}`);
    const data = await res.json();

    if (data.title === "No Definitions Found") {
      definitionEl.innerHTML = `<p>No definition found for <strong>${word}</strong>.</p>`;
      return false;
    }

    const firstMeaning = data[0].meanings[0];
    const definition = firstMeaning.definitions[0].definition;

    wordEl.textContent = data[0].word;
    definitionEl.innerHTML = `
      <p><strong>${firstMeaning.partOfSpeech}</strong></p>
      <p>${definition}</p>
    `;

    return true;
  } catch {
    definitionEl.innerHTML = `<p>Failed to fetch definition. Try again later.</p>`;
    return false;
  }
}

// Get joke based on word
async function getJoke(word) {
  const lower = word.toLowerCase();
  if (customJokes[lower]) {
    jokeEl.innerHTML = customJokes[lower].replace(
      new RegExp(word, 'gi'),
      match => `<span class="highlight">${match}</span>`
    );
    return;
  }

  try {
    const res = await fetch(JOKE_API);
    const data = await res.json();
    const jokeText = data.type === "twopart" ? `${data.setup} ${data.delivery}` : data.joke;
    jokeEl.innerHTML = jokeText;
  } catch {
    jokeEl.textContent = "The joke service is sleeping. Try later!";
  }
}

// Event Listeners
searchBtn.addEventListener('click', async () => {
  const word = wordInput.value.trim();
  if (!word) return;
  
  currentWord = word;
  const found = await getDefinition(word);
  if (found) getJoke(word);
  else jokeEl.textContent = "";
});

newJokeBtn.addEventListener('click', () => {
  if (currentWord) getJoke(currentWord);
});

// Initial load
window.addEventListener('DOMContentLoaded', () => {
  wordInput.value = "code";
  searchBtn.click();
});
