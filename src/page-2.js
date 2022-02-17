const urlOnlyQuizz = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/";
let id = 2408;
let question =[];
let answers = [];

// Ao clicar em um quizz na tela inicial o onclick deve chamar a função getOnlyQuizz(id) e passar o id como parametro
function getOnlyQuizz(){
    const promise = axios.get(urlOnlyQuizz + id);
    promise.then(renderizeQuizz);
}

function renderizeQuizz(load){
    let data = load.data;
    console.log(data.questions[0].answers[0]);
    const imageQuizz= document.querySelector(".image-logo");
    imageQuizz.style.backgroundImage = `url('${data.image}')`;
    const questionsQuizz = document.querySelector(".quizz-questions-container");
    questionsQuizz.innerHTML="";
    data.questions.forEach(element => {
        let text="";
        answers= [];
        element.answers.forEach(answer=>{answers.push(answer)});
        answers.sort(randonQuestions);
        console.log(answers);
        answers.forEach(item =>{
            text+=`
            <div class="image-quizz-box">
                <img src="${item.image}" alt=""/>
                <h1>${item.text}</h1>
            </div>`
        });
        questionsQuizz.innerHTML+=
        `<div class="quizz-onlyquestion-container">
            <div class="quizz-question-box"> 
                <h1>${element.title}</h1>
            </div> 
            ${text}
        </div>
        `
            text = "";     

    });
    document.querySelector(".quizz-question-box").style.background = data.questions[0].color;

}
function randonQuestions(){
    return Math.random() - 0.5; 
}
// export { getOnlyQuizz }

