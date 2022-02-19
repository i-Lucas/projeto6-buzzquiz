window.onload = () => {

    GetAllQuizzes()
}

function GetAllQuizzes() {

    const promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    promise.then((response) => {
        console.log(response.data)
        RenderAllQuizzes(response.data)
    })
    promise.catch((error) => {
        console.error(error)
    })
}

function RenderAllQuizzes(quizzes) {

    const allquizzcontainer = document.querySelector('.all-quizz-container')
    allquizzcontainer.innerHTML = ''

    for (let i = 0; i < quizzes.length; i++) {
        allquizzcontainer.innerHTML += `
            <div class="all-quizz-box" id = "${quizzes[i].id}" onclick="getOnlyQuizz(${quizzes[i].id})">
                <h1 class = 'title'>${quizzes[i].title}</h1>
            </div>
        `
        const allquizzbox = document.getElementById(`${quizzes[i].id}`)
        allquizzbox.style.backgroundImage = `url('${quizzes[i].image}')`
    }
}

let currentPage = 1
let numberOfQuestions = 0
let ValidateUserQuizz = false
let numberOfLevels = 0

function GetUserQuizzData(page) {

    const page1 = document.querySelector('.page-1')
    const page2 = document.querySelector('.page-2')
    const page3 = document.querySelector('.page-3')
    const quizzInfo = document.querySelector('.quizz-info')
    const quizzQuestions = document.querySelector('.quizz-questions')
    const quizzLevels = document.querySelector('.quizz-levels')
    const quizzSuccess = document.querySelector('.quizz-success')

    if (page === 'info') {
        page1.classList.add('hidden')
        page3.classList.remove('hidden')
        quizzInfo.classList.remove('hidden')
    }
    if (page === 'questions') {

        let quizzTitle = document.querySelector('.user-quizz-title').value
        let quizzUrl = document.querySelector('.user-quizz-url').value
        let quizzQuestionsAmount = document.querySelector('.user-quizz-questions-amount').value
        let quizzLevelsAmount = document.querySelector('.user-quizz-levels-amount').value

        quizzQuestionsAmount = parseInt(quizzQuestionsAmount)
        quizzLevelsAmount = parseInt(quizzLevelsAmount)

        if (CheckInfoQuizzData(quizzTitle, quizzUrl, quizzQuestionsAmount, quizzLevelsAmount)) {
            quizzQuestions.classList.remove('hidden')
            quizzInfo.classList.add('hidden')
            numberOfQuestions = quizzQuestionsAmount
            RenderQuestions(quizzQuestionsAmount, currentPage)
        }
    }
    if (page === 'levels') {

        if (currentPage === numberOfQuestions) {
            EditThisQuestion(numberOfQuestions)
            // caso o usuario esteja na ultima pagina de perguntas e clique no botao
            // entao verificamos se ele pode prosseguir
        }
        if (ValidateUserQuizz) {
            quizzQuestions.classList.add('hidden')
            quizzLevels.classList.remove('hidden')
            currentPage = 1
            RenderLevels(currentPage, numberOfLevels)
        }
    }
    if (page === 'success') {

        if (currentPage === numberOfLevels) {
            EditThisLevel(numberOfLevels)
        }
        if (ValidateUserQuizzLevel) {
            quizzLevels.classList.add('hidden')
            quizzSuccess.classList.remove('hidden')
            // post para obter id do quizz feito pelo usuario
        }
    }
    if (page === 'acess') {
        page3.classList.add('hidden')
        page2.classList.remove('hidden')

        // getOnlyQuizz( ID DO QUIZZ )
    }
    if (page === 'home') {
        page3.classList.add('hidden')
        quizzSuccess.classList.add('hidden')
        page1.classList.remove('hidden')
    }
}

function RenderQuestions(number, page) {

    const QuestionsInputContainer = document.querySelector('.quizz-questions-input-container')
    QuestionsInputContainer.innerHTML = `
        <div class="quizz-questions-text"><h1>Pergunta ${page}</h1></div>
        <input type="text" id = "p1" placeholder="Texto da pergunta">
        <input type="text" id = "p2" placeholder="Cor de fundo da pergunta">
        <div class="quizz-questions-text"><h1>Resposta correta</h1></div>
        <input type="text" id = "r1" placeholder="Resposta correta">
        <input type="text" id = "r2" placeholder="URL da imagem">
        <div class="quizz-questions-text"><h1>Respostas incorretas</h1></div>
        <input type="text" id = "i1" placeholder="Resposta incorreta 1">
        <input type="text" id = "i2" placeholder="URL da imagem 1">
        <input type="text" id = "ii1" placeholder="Resposta incorreta 2">
        <input type="text" id = "ii2" placeholder="URL da imagem 2">
        <input type="text" id = "iii1" placeholder="Resposta incorreta 3">
        <input type="text" id = "iii2" placeholder="URL da imagem 3">`

    for (let i = 1; i <= number; i++) {
        if (page !== i) {
            QuestionsInputContainer.innerHTML += `
                <div class="quizz-question-box" id = '${i}'>
                <div class="text"> <h1>Pergunta ${i}</h1></div>
                <div class="icon" onclick="EditThisQuestion(${i})"><ion-icon name="create-outline"></ion-icon></div>
                </div>`
        }
    }
    QuestionsInputContainer.innerHTML += `
        <div class="quizz-question-final-btn">
            <button onclick="GetUserQuizzData('levels')">Prosseguir pra criar níveis</button>
        </div>`
}

function CheckInfoQuizzData(title, url, questions, levels) {

    if (title.length < 20 || title.length > 60) {
        return alert('O título do quizz deve ter no mínimo 20 e no máximo 65 caracteres')
    }
    if (!CheckURL(url)) {
        // if (url.includes('http://') || url.includes('https://') === false) {
        return alert('A URL da imagem deve ter formato de URL')
    }
    if (questions < 3 || isNaN(questions)) {
        return alert('A quantidade de perguntas deve ser no mínimo 3')
    }
    if (levels < 2 || isNaN(levels)) {
        return alert('A quantidade de niveis deve ser no mínimo 2')
    }
    numberOfLevels = levels
    console.log(numberOfLevels)
    return true
}

let GetFormData = []

function EditThisQuestion(number) {

    // if(number === numberOfQuestions) {
    //     console.log('estou editando a ultima questao')
    // }

    let quizzQuestion = document.getElementById('p1').value
    let quizzQuestionColor = document.getElementById('p2').value

    let quizzRightAnswer = document.getElementById('r1').value
    let quizzRightAnswerURL = document.getElementById('r2').value

    let quizzIncorrectAnswer1 = document.getElementById('i1').value
    let quizzIncorrectAnswer2 = document.getElementById('ii1').value
    let quizzIncorrectAnswer3 = document.getElementById('iii1').value

    let quizzIncorrectAnswerURL1 = document.getElementById('i2').value
    let quizzIncorrectAnswerURL2 = document.getElementById('ii2').value
    let quizzIncorrectAnswerURL3 = document.getElementById('iii2').value

    GetFormData[currentPage - 1] = {
        quizzQuestion: quizzQuestion,
        quizzQuestionColor: quizzQuestionColor,
        quizzRightAnswer: quizzRightAnswer,
        quizzRightAnswerURL: quizzRightAnswerURL,
        quizzIncorrectAnswer1: quizzIncorrectAnswer1,
        quizzIncorrectAnswer2: quizzIncorrectAnswer2,
        quizzIncorrectAnswer3: quizzIncorrectAnswer3,
        quizzIncorrectAnswerURL1: quizzIncorrectAnswerURL1,
        quizzIncorrectAnswerURL2: quizzIncorrectAnswerURL2,
        quizzIncorrectAnswerURL3: quizzIncorrectAnswerURL3
    }
    // antes de editar a proxima pagina, checa se a pagina atual esta preenchida corretamente
    if (CheckQuestionsQuizzData(currentPage - 1, GetFormData)) {
        currentPage = number
        RenderQuestions(numberOfQuestions, currentPage)
    }
}

function CheckQuestionsQuizzData(page, array) {

    if (array[page] === null || array[page] === undefined) {
        alert('Voce precisa preencher as informacoes de todas as perguntas antes de continuar')
        return false
    }
    else {
        if (array[page].quizzQuestion === '' || array[page].quizzQuestion.length < 20) {
            return alert(`O texto da pergunta ${page + 1} deve ter no mínimo 20 caracteres`)
        }
        if (array[page].quizzQuestionColor === '' || array[page].quizzQuestionColor.includes('#') === false) {
            return alert(`A cor de fundo da pergunta ${page + 1} deve ser uma cor em hexadecimal comecando com #`)
        }
        if (array[page].quizzRightAnswer === '') {
            return alert(`A resposta da pergunta ${page + 1} nao pode ficar em branco`)
        }
        if (!CheckURL(array[page].quizzRightAnswerURL)) {
            return alert(`A imagem da resposta da pergunta ${page + 1} deve ter formato de URL`)
        }
        if (array[page].quizzIncorrectAnswer1 === '') {
            return alert(`A pergunta ${page + 1} deve ter no mínimo uma resposta errada`)
        }
    }
    if (currentPage === numberOfQuestions) {
        // caso o usuario esteja na ultima pagina podera prosseguir
        ValidateUserQuizz = true
    }
    return true
}

let currentLevel = 1

function RenderLevels(page, number) {

    const LevelsInputContainer = document.querySelector('.quizz-levels-input-container')
    LevelsInputContainer.innerHTML = `
    <div class="quizz-levels-text"><h1>Nivel ${currentLevel}</h1></div>
    <input type="text" id = "x1" placeholder="Título do nível">
    <input type="text" id = "x2" placeholder="% de acerto mínima">
    <input type="text" id = "x3" placeholder="URL da imagem do nível">
    <input type="text" id = "x4" placeholder="Descrição do nível">`

    for (let i = 1; i <= number; i++) {
        if (page !== i) {
            LevelsInputContainer.innerHTML += `
            <div class="quizz-levels-box" id = '${i}'>
            <div class="text"> <h1>Nivel ${i}</h1></div>
            <div class="icon" onclick="EditThisLevel(${i})"><ion-icon name="create-outline"></ion-icon></div>
            </div>`
        }
    }
    LevelsInputContainer.innerHTML += `
        <div class="quizz-levels-final-btn"><button onclick="GetUserQuizzData('success')">Finalizar Quizz</button></div>`
}

let GetFormLevel = []

function EditThisLevel(number) {
    let quizzLevel = document.getElementById('x1').value
    let LevelPorcent = document.getElementById('x2').value

    let LevelURL = document.getElementById('x3').value
    let LevelDescription = document.getElementById('x4').value

    GetFormLevel[currentPage - 1] = {
        quizzLevel: quizzLevel,
        LevelPorcent: LevelPorcent,
        LevelURL: LevelURL,
        LevelDescription: LevelDescription
    }
    // antes de editar a proxima pagina, checa se a pagina atual esta preenchida corretamente
    if (CheckLevelQuizzData(currentPage - 1, GetFormLevel)) {
        currentPage = number
        currentLevel = number
        RenderLevels(currentLevel, numberOfLevels)
    }
}

let ValidateUserQuizzLevel = false

function CheckLevelQuizzData(page, array) {
    console.log('funcao CheckLevelQuizzData call')
    if (array[page] === null || array[page] === undefined) {
        alert('Voce precisa preencher as informacoes de todas os niveis antes de continuar')
        return false
    }
    else {
        if (array[page].quizzLevel === '' || array[page].quizzLevel.length < 10) {
            return alert(`O texto do nivel ${page + 1} deve ter no mínimo 10 caracteres`)
        }
        if (array[page].LevelPorcent === '' || array[page].LevelPorcent < 0 || array[page].LevelPorcent > 100) {
            return alert(`A porcentagem de acerto minimo do nivel ${page + 1} deve ser entre 0 e 100`)
        }
        if (!CheckURL(array[page].LevelURL)) {
            return alert(`A imagem do nivel ${page + 1} deve ter formato de URL`)
        }
        if (array[page].LevelDescription === '' || array[page].LevelDescription.length < 30) {
            return alert(`A descrição do nivel ${page + 1} deve ter no mínimo 30 caracteres`)
        }
    }
    if (currentPage === numberOfLevels) {
        ValidateUserQuizzLevel = true
    }
    return true
}

const CheckURL = (url) => url.includes('http://') || url.includes('https://') ? true : false

// commit debug