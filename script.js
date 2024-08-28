const flipCards = document.querySelectorAll('.flip-card'); 
let currentCardIndex = 0;
const words = [
    { word: "apple", translation: "яблоко", example: "I eat an apple." },
    { word: "banana", translation: "банан", example: "She likes banana." },
    { word: "orange", translation: "апельсин", example: "He eats an orange." },
    { word: "grape", translation: "виноград", example: "They grow grapes." },
    { word: "strawberry", translation: "клубника", example: "Strawberries are sweet." },
    { word: "pineapple", translation: "ананас", example: "Pineapple is very healthy."}
];

const backButton = document.querySelector('#back');
const nextButton = document.querySelector('#next');
const cardFront = document.querySelector('#card-front h1');
const cardBack = document.querySelector('#card-back h1'); 
const cardBackExample = document.querySelector('#card-back span'); 

function updateActiveCard() {
    const activeCard = words[currentCardIndex];
    cardFront.textContent = activeCard.word;
    cardBack.textContent = activeCard.translation;
    cardBackExample.textContent = activeCard.example;
    backButton.disabled = currentCardIndex === 0;
    nextButton.disabled = currentCardIndex === words.length - 1;

    const currentWordElement = document.querySelector('#current-word');
    currentWordElement.textContent = `${currentCardIndex + 1}`;
}

flipCards.forEach((card) => {
    card.addEventListener('click', () => {
        card.classList.toggle('active');
    });
});

backButton.addEventListener('click', () => {
    if (currentCardIndex > 0) {
        currentCardIndex--; 
        updateActiveCard();
    }
});

nextButton.addEventListener('click', () => {
    if (currentCardIndex < words.length - 1) {
        currentCardIndex++; 
        updateActiveCard();
    }
});

updateActiveCard();

const examButton = document.querySelector('#exam');
const sliderCard = document.querySelector('.slider');
const timerElements = document.querySelector('#timer'); 
let timerInterval; 
let elapsedTime = 0; 

examButton.addEventListener('click', startExam);


function startExam() {
    const studyModeElement = document.querySelector('#study-mode');
    const examModeElement = document.querySelector('#exam-mode');
    const contentElement = document.querySelector('#exam-cards');

    studyModeElement.classList.add('hidden');
    examModeElement.classList.remove('hidden');
    backButton.classList.add('hidden');
    nextButton.classList.add('hidden');
    examButton.classList.add('hidden');
    sliderCard.classList.add('hidden');
     elapsedTime = 0;
     timerElements.innerText = '00:00';
     timerInterval = setInterval(updateTimer, 1000);

    const randomCards = [...words];
    randomCards.sort(() => Math.random() - 0.5);

    const fragment = document.createDocumentFragment();

    randomCards.forEach((card) => {
        const cardWordElement = createCardElement(card.translation, card.word);
        const cardTranslateElement = createCardElement(card.word, card.translation);
        fragment.append(cardWordElement);
        fragment.append(cardTranslateElement);
    });
    contentElement.append(fragment);

function updateTimer() {
    elapsedTime++;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerElements.innerText = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
}

function createCardElement(word, translation) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const wordElement = document.createElement('div');
    wordElement.classList.add('card-word');
    wordElement.textContent = word;

    const translationElement = document.createElement('div');
    translationElement.classList.add('card-translation');
    translationElement.textContent = translation;

    cardElement.append(wordElement);
    cardElement.append(translationElement);
    translationElement.classList.add('hidden');

    const contentElement = document.querySelector('#exam-cards');
    let firstClickedCard = null;
    let correctAnswersCount = 0;

    contentElement.addEventListener('click', function(event) {
        const cardElement = event.target.closest('.card');

        if (cardElement) {
            if (firstClickedCard === null) {
                firstClickedCard = cardElement;
                firstClickedCard.classList.add('correct');
            } else {
                const firstCardWord = firstClickedCard.querySelector('.card-word').textContent;
                const secondCardWord = cardElement.querySelector('.card-word').textContent;
                const firstCardTranslation = firstClickedCard.querySelector('.card-translation').textContent;
                const secondCardTranslation = cardElement.querySelector('.card-translation').textContent;

                if (
                    (firstCardWord === secondCardTranslation && firstCardTranslation === secondCardWord) ||
                    (firstCardTranslation === secondCardWord && firstCardWord === secondCardTranslation)
                ) {
                    cardElement.classList.add('correct');
                    firstClickedCard.classList.add('fade-out');
                    cardElement.classList.add('fade-out');

                    firstClickedCard = null;
                    correctAnswersCount++;
                } else {
                    cardElement.classList.add('wrong');

                    setTimeout(() => {
                        cardElement.classList.remove('wrong');
                        firstClickedCard.classList.remove('correct');
                        firstClickedCard = null;
                    }, 500);
                }
            }
        }
      
        if (correctAnswersCount === words.length) {
            clearInterval(timerInterval); 
            setTimeout(() => { 
                alert(`Поздравляю! Тестирование завершено! Время: ${timerElements.innerText}`); 
            }, 500);
        }
    });
     return cardElement;
}