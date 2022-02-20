let TOTAL_USER_QUIZZ = 0

window.onload = () => {

    CheckUserLocalStorage()
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
    allquizzcontainer.innerHTML = '<div class = "all-quizz-container-p"><p>Todos os Quizzes</p></div>'

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
let GetThisQuizzID_ = undefined
let quizzUrl;
let quizzTitle;
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

        quizzTitle = document.querySelector('.user-quizz-title').value
        quizzUrl = document.querySelector('.user-quizz-url').value
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

            // ao criar um quizz, o armazenamento local do usuario tera essa informacao
            window.localStorage.setItem('UserCreateQuizz', 'true');
            GenerateUserRequestPost(numberOfQuestions, numberOfLevels)
            document.querySelector(".quizz-success-box").style.backgroundImage = `url('${quizzUrl}')`
        }
    }
    if (page === 'acess') {
        page3.classList.add('hidden')
        page2.classList.remove('hidden')

        if (GetThisQuizzID_ != undefined) {
            getOnlyQuizz(GetThisQuizzID_)
        }
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
    return true
}

let GetFormData = []

function EditThisQuestion(number) {

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
        if (CheckHexa(array[page].quizzQuestionColor)) {
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
        if (!CheckURL(array[page].quizzIncorrectAnswerURL1)) {
            return alert(`A imagem da resposta incorreta da pergunta ${page + 1} deve ter formato de URL`)
        }

        if (array[page].quizzIncorrectAnswer2 !== "") { 
            if (!CheckURL(array[page].quizzIncorrectAnswerURL2)) {
                return alert(`A imagem da resposta incorreta 2 da pergunta ${page + 1} deve ter formato de URL`)
            }
        }
        if(array[page].quizzIncorrectAnswer3 !== "" ) {
            if (!CheckURL(array[page].quizzIncorrectAnswerURL3)) {
                return alert(`A imagem da resposta incorreta 3 da pergunta ${page + 1} deve ter formato de URL`)
            }
        }
    }
    if (currentPage === numberOfQuestions) {
        // caso o usuario esteja na ultima pagina podera prosseguir
        ValidateUserQuizz = true
    }
    return true
}

const CheckHexa = (hex) => hex === '' || hex.includes('#') === false || hex.length !== 7 ? true : false

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

function CheckUserLocalStorage() {

    let check = window.localStorage.getItem('UserCreateQuizz')
    if (check === undefined || check === null || check === 'false') {
        document.querySelector('.user-quizz-container').classList.add("hidden")
        console.log('Voce nao criou um quizz ainda')
        TOTAL_USER_QUIZZ = 0
    }
    else {
        TOTAL_USER_QUIZZ = window.localStorage.getItem('TOTAL_USER_QUIZZ')
        console.log(`Voce possui um total de ${TOTAL_USER_QUIZZ} quizzes `)

        let AllUserQuizz = []
        for (let i = 1; i <= TOTAL_USER_QUIZZ; i++) {
            AllUserQuizz[i] = window.localStorage.getItem(`UserQuizzID${i}`);

            console.log(`O quizz do indice ${i} foi renderizdo`)
            RenderUserQuizz(AllUserQuizz[i])
        }
    }

    GetAllQuizzes()
}

function GenerateUserRequestPost(questions, levels) {

    let arrayQuestions = []
    let arrayLevels = []
    let userQuizzOBJ = {}
    userQuizzOBJ.title = quizzTitle;
    userQuizzOBJ.image = quizzUrl;
    for (let i = 0; i < questions; i++) {
        arrayQuestions.push(createNewQuestion(i));
    }
    for (let i = 0; i < levels; i++) {
        arrayLevels.push(createNewLevel(i));
    }

    userQuizzOBJ.levels = arrayLevels
    userQuizzOBJ.questions = arrayQuestions
    console.log(userQuizzOBJ);

    let requestUserQuizz = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', userQuizzOBJ)

    requestUserQuizz.then((response) => {
        TOTAL_USER_QUIZZ++
        window.localStorage.setItem(`UserQuizzID${TOTAL_USER_QUIZZ}`, `${response.data.id}`)
        window.localStorage.setItem('TOTAL_USER_QUIZZ', `${TOTAL_USER_QUIZZ}`)
        console.log(`voce criou o quizz id ${response.data.id} com extremo sucesso`)

        // obtendo o ID do Quizz criado pra poder acessa-lo
        GetThisQuizzID_ = response.data.id
        RenderUserQuizz(response.data.id)
        
        document.querySelector(".quizz-success-box").setAttribute('onclick', `getOnlyQuizz(${response.data.id})`)
        console.log('opa')
    })

    requestUserQuizz.catch((error) => {
        console.log('falha na criacao do quizz')
        console.log(error)
    })
}

function RenderUserQuizz(idQuizz) {

    let responseQuizz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`)
    responseQuizz.then((response) => {

        // console.log(response.data.title) ok
        let GetTitle_ = response.data.title

        document.querySelector('.user-quizz-container').classList.remove("hidden")
        document.querySelector('.create-quizz-container').classList.add("hidden")

        console.log(`quizz ${idQuizz} renderizou`)

        document.querySelector('.user-quizz-container').innerHTML += `
        <div class="all-quizz-box" id = "${idQuizz}" onclick="getOnlyQuizz(${idQuizz})")>
        <h1 class = 'title'>${GetTitle_}</h1> </div>`

        const userBox = document.getElementById(`${idQuizz}`)
        userBox.style.backgroundImage = `url('${response.data.image}')`
    })
}

function createNewQuestion(index) {
    const newDataQuestion = {
        "title": GetFormData[index].quizzQuestion,
        "color": GetFormData[index].quizzQuestionColor,
        "answers": [
            {
                "text": GetFormData[index].quizzRightAnswer,
                "image": GetFormData[index].quizzRightAnswerURL,
                "isCorrectAnswer": true
            },
            {
                "text": GetFormData[index].quizzIncorrectAnswer1,
                "image": GetFormData[index].quizzIncorrectAnswerURL1,
                "isCorrectAnswer": false
            }
        ]
    }
    if (GetFormData[index].quizzIncorrectAnswer2 != "") {
        newDataQuestion.answers.push({
            "text": GetFormData[index].quizzIncorrectAnswer2,
            "image": GetFormData[index].quizzIncorrectAnswerURL3,
            "isCorrectAnswer": false
        })
    }
    if (GetFormData[index].quizzIncorrectAnswer3 != "") {
        newDataQuestion.answers.push({
            "text": GetFormData[index].quizzIncorrectAnswer3,
            "image": GetFormData[index].quizzIncorrectAnswerURL3,
            "isCorrectAnswer": false
        })
    }
    return newDataQuestion;
}
function createNewLevel(index) {
    const newDataLevel = {
        "title": GetFormLevel[index].quizzLevel,
        "minValue": GetFormLevel[index].LevelPorcent,
        "image": GetFormLevel[index].LevelURL,
        "text": GetFormLevel[index].LevelDescription
    }
    return newDataLevel;
}