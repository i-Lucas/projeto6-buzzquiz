import {getOnlyQuizz} from './page-2.js'

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
        // console.log(quizzes[i].id, quizzes[i].title, quizzes[i].image)
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

// exportando a função
export { GetAllQuizzes }


// onclick="getOnlyQuizz('${quizzes[i].id}')">