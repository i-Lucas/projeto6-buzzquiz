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
            <div class="all-quizz-box" id = "${quizzes[i].id}" onclick="testes(${quizzes[i].id})">
                <h1 class = 'title'>${quizzes[i].title}</h1>
            </div>
        `
        const allquizzbox = document.getElementById(`${quizzes[i].id}`)
        allquizzbox.style.backgroundImage = `url('${quizzes[i].image}')`
    }
}

function testes(id) {
    alert(id)
}

let currentPage = 1
let numberOfQuestions = 0

let ValidateUserQuizz = false

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
            // console.log('numero de perguntas ' + numberOfQuestions)
            RenderQuestions(quizzQuestionsAmount, currentPage)
        }
    }
    if (page === 'levels') {

        if(currentPage === numberOfQuestions ) {
            EditThisQuestion(numberOfQuestions)
            console.log('Estou na ultima pagina e cliquei no botao')
        }

        if (ValidateUserQuizz) {
            quizzQuestions.classList.add('hidden')
            quizzLevels.classList.remove('hidden')
        }
    }
    if (page === 'success') {
        quizzLevels.classList.add('hidden')
        quizzSuccess.classList.remove('hidden')
    }
    if (page === 'acess') {
        page3.classList.add('hidden')
        page2.classList.remove('hidden')

        // getOnlyQuizz(myQuizz)
    }
    if (page === 'home') {
        page3.classList.add('hidden')
        quizzSuccess.classList.add('hidden')
        page1.classList.remove('hidden')
    }
}

function RenderQuestions(number, page) {

    // console.log(`RenderQuestions? number of questions: ${number} current page: ${page}`)

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

const CheckImageFormat = (url) => url.includes('png') || url.includes('jpg') || url.includes('gif') || url.includes('http') ? true : false

function CheckInfoQuizzData(title, url, questions, levels) {

    if (title.length < 5) {
        return alert('O titulo precisa ter no minimo 5 caracteres')
    }

    if (!CheckImageFormat(url)) {
        return alert('Formato de imagem da url nao aceito')
    }

    if (questions < 3 || isNaN(questions)) {
        return alert('A quantidade minima de perguntas e 3')
    }

    if (levels < 3 || isNaN(levels)) {
        return alert('A quantidade minima de niveis e 3')
    }

    return true
}

let GetFormData = []

function EditThisQuestion(number) {

    if(number === numberOfQuestions) {
        console.log('estou editando a ultima questao')
    }

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

    // console.log(currentPage)

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
    };

    // antes de editar a proxima pagina, checa se a pagina atual esta preenchida corretamente
    if (CheckQuestionsQuizzData(currentPage - 1, GetFormData)) {

        console.log(GetFormData)
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

        if (array[page].quizzQuestion === '') {
            return alert(`Voce precisa preencher o titulo da pergunta ${page + 1} para prosseguir`)
        }
        if (array[page].quizzQuestionColor === '') {
            return alert(`Voce precisa definir a cor da pergunta ${page + 1} para prosseguir`)
        }
    }

    if(currentPage === numberOfQuestions ) {
        console.log('Estou na ultima pagina e validei o quizz como true')
        ValidateUserQuizz = true
    }

    return true
}

// onclick="CheckUserAllQuestionsData()"