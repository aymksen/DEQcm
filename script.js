document.addEventListener('DOMContentLoaded', () => {
  createLevelButtons();
});

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
let currentLevel;
let score = 0;
let shuffledQuestions = [];
let wrongAnswers = [];

function createLevelButtons() {
  const levelButtonsContainer = document.getElementById('levelButtons');

  levels.forEach(level => {
    const button = document.createElement('button');
    button.innerText = level;
    button.addEventListener('click', () => selectLevel(level));
    levelButtonsContainer.appendChild(button);
  });
}

function selectLevel(level) {
  currentLevel = level;
  document.getElementById('levelSelection').style.display = 'none';
  document.getElementById('questions').style.display = 'block';
  document.getElementById('levelTitle').innerText = `Level ${currentLevel}`;
  loadQuestion();
}

function loadQuestion() {
  const questionContainer = document.getElementById('questionContainer');
  questionContainer.innerHTML = '';

  // Shuffle the questions for the selected level
  shuffledQuestions = shuffleArray(questions[currentLevel]);

  for (let i = 1; i <= 10; i++) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `
      <p>${i}. ${shuffledQuestions[i - 1].question}</p>
      ${generateOptions(i, shuffledQuestions[i - 1])}
    `;
    questionContainer.appendChild(questionDiv);

    // Triggering reflow to apply styles and initiate animation
    questionDiv.offsetHeight;
    questionDiv.classList.add('fade-in');
  }
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateOptions(questionNumber, question) {
  const options = question.options;
  let optionsHTML = '';

  options.forEach(option => {
    optionsHTML += `
      <label>
        <input type="radio" name="q${questionNumber}" value="${option}">
        ${option}
      </label><br>
    `;
  });

  return optionsHTML;
}

function submitTest() {
  wrongAnswers = [];
  score = 0;

  const answerElements = document.querySelectorAll(`input[name^="q"]`);
  answerElements.forEach(element => {
    if (element.checked) {
      const questionNumber = parseInt(element.name.slice(1), 10);
      const correctAnswer = shuffledQuestions[questionNumber - 1].correctAnswer;

      if (element.value === correctAnswer) {
        score++;
      } else {
        wrongAnswers.push(questionNumber);
      }
    }
  });

  document.getElementById('questions').style.display = 'none';
  document.getElementById('results').style.display = 'block';

  displayResults();
}

function displayResults() {
  const scoreElement = document.getElementById('score');
  const resultsElement = document.getElementById('results');
  const resultsContainer = document.getElementById('resultsContainer');

  scoreElement.innerText = `You scored ${score}/10`;
  resultsContainer.innerHTML = '<p>Results:</p>';

  for (let i = 1; i <= 10; i++) {

    console.log(shuffledQuestions)
    const question = shuffledQuestions[i - 1];
    const selectedAnswer = document.querySelector(`input[name="q${i}"]:checked`);

    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';

    resultItem.innerHTML = `
      <p>${i}. ${question.question}</p>
      ${selectedAnswer
        ? (selectedAnswer.value !== question.correctAnswer
          ? `<p><span class="your-answer wrong-answer">Your Answer: ${selectedAnswer.value}</span></p>`
          : `<p><span class="your-answer correct-answer">Your Answer: ${selectedAnswer.value}</span></p>`)
        : '<p><span class="your-answer not-answered">Not answered</span></p>'}
      <p><span class="correct-answer">Correct Answer: ${question.correctAnswer}</span></p>
    `;

    if (selectedAnswer) {
      if (selectedAnswer.value === question.correctAnswer) {
        resultItem.classList.add('correct-question');
      } else {
        resultItem.classList.add('wrong-question');
      }
    }

    resultsContainer.appendChild(resultItem);
    
  }

  // resultsElement.innerHTML = ''; // Clear the default message

  if (score === 10) {
    resultsElement.innerHTML += '<p>Congratulations! You got all answers correct!</p>';
  }

  resultsElement.style.display = 'block';
}

function goBackHome() {
  document.getElementById('questions').style.display = 'none';
  document.getElementById('results').style.display = 'none';
  document.getElementById('levelSelection').style.display = 'block';
  resetTest();
}


function resetTest() {
  currentLevel = null;
  score = 0;
  wrongAnswers = [];
  clearRadioButtons();
}

function clearRadioButtons() {
  const answerElements = document.querySelectorAll('input[type="radio"]');
  answerElements.forEach(element => {
    element.checked = false;
  });
}