const words = [
    { word: "apple", translation: "яблоко", example: "I eat an apple." },
    { word: "banana", translation: "банан", example: "She likes banana." },
    { word: "orange", translation: "апельсин", example: "He eats an orange." },
    { word: "grape", translation: "виноград", example: "They grow grapes." },
    { word: "strawberry", translation: "клубника", example: "Strawberries are sweet." },
    { word: "pineapple", translation: "ананас", example: "Pineapple is very healthy."}
];

let currentIndex = 0;
let examMode = false;
let selectedCards = [];
let correctCount = 0;

function updateWord() {
    const currentWordElement = document.querySelector('#card-front h1');
    const currentBackElement = document.querySelector('#card-back h1');
    const currentExampleElement = document.querySelector('#card-back span');
    const totalWordElement = document.querySelector('#total-word');

    currentWordElement.innerText = words[currentIndex].word;
    currentBackElement.innerText = words[currentIndex].translation;
    currentExampleElement.innerText = words[currentIndex].example;

    document.querySelector('#current-word').innerText = currentIndex + 1;
    totalWordElement.innerText = words.length;

    document.getElementById('back').disabled = currentIndex === 0;
    document.getElementById('next').disabled = currentIndex === words.length - 1;
}

document.querySelector('.flip-card').addEventListener('click', () => {
    document.querySelector('.flip-card').classList.toggle('active');
});

document.getElementById('next').addEventListener('click', () => {
    if (currentIndex < words.length - 1) {
        currentIndex++;
        updateWord();
    }
});

document.getElementById('back').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateWord();
    }
});

document.getElementById('exam').addEventListener('click', startExam);

function startExam() {
    examMode = true;
    document.querySelector('#study-mode').classList.add('hidden');
    document.querySelector('#exam-mode').classList.remove('hidden');
    document.querySelector('#exam-cards').innerHTML = '';

    const shuffledWords = words.sort(() => Math.random() - 0.5);
    shuffledWords.forEach(word => {
        const card = document.createElement('div');
        card.classList.add('flip-card');
        card.innerHTML = `
            <div class="flip-card-inner" data-translation="${word.translation}">
                <div class="flip-card-front"><h1>${word.word}</h1></div>
                <div class="flip-card-back"><h1>${word.translation}</h1><p><b>Пример:</b> <span>${word.example}</span></p></div>
            </div>
        `;
        document.querySelector('#exam-cards').appendChild(card);
    });

    startSelection();
}

function startSelection() {
    const examCards = document.querySelectorAll('#exam-cards .flip-card');
    examCards.forEach(card => {
        card.addEventListener('click', () => selectCard(card));
    });
}

function selectCard(card) {
    if (selectedCards.length < 2) {
        const flipCardInner = card.querySelector('.flip-card-inner');
        flipCardInner.classList.toggle('active'); 
        selectedCards.push(card);

        if (selectedCards.length === 2) {
            checkPair();
        }
    }
}

function checkPair() {
    const firstTranslation = selectedCards[0].querySelector('.flip-card-inner').getAttribute('data-translation');
    const secondTranslation = selectedCards[1].querySelector('.flip-card-inner').getAttribute('data-translation');

    if (firstTranslation === secondTranslation) {
        selectedCards.forEach(card => {
            card.classList.add('fade-out');
            setTimeout(() => {
                card.remove();
            }, 500);
        });
        correctCount++;
        resetSelection();
        checkCompletion();
    } else {
        selectedCards[1].classList.add('wrong');
        setTimeout(() => {
            selectedCards[1].classList.remove('wrong');
            resetSelection();
        }, 1000);
    }
}

function resetSelection() {
    selectedCards = [];
}

function checkCompletion() {
    const remainingCards = document.querySelectorAll('#exam-cards .flip-card');
    if (remainingCards.length === 0) {
        alert(`Тестирование завершено! Вы правильно ответили на ${correctCount} из ${words.length}.`);
        initializeStudyMode();
    } else {
        const correctPercent = (correctCount / words.length * 100).toFixed(2);
        document.querySelector('#correct-percent').innerText = `${correctPercent}%`;
        document.querySelector('#exam-progress').value = correctCount;
    }
}

function initializeStudyMode() {
    examMode = false;
    currentIndex = 0;
    updateWord();
    document.querySelector('#study-mode').classList.remove('hidden');
    document.querySelector('#exam-mode').classList.add('hidden');
}
 updateWord();