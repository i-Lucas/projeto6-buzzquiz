const urlOnlyQuizz = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/";
let id = 2335;


// Ao clicar em um quizz na tela inicial o onclick deve chamar a função getOnlyQuizz(id) e passar o id como parametro
function getOnlyQuizz(dado){
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
        element.answers.forEach(answer=>{
            text+=`
            <div class="image-quizz-box">
                <img src="${answer.image}" alt=""/>
                <h1>${answer.text}</h1>
            </div>`
            });
        questionsQuizz.innerHTML+=
        `<div class="quizz-onlyquestion-container">
            <div class="quizz-question-box"> 
                <h1>${element.title}</h1>
            </div> 
            ${text}
        </div>`
            text = "";
         
           

    });
    // questionsQuizz.innerHTML=
    // `<div class="quizz-onlyquestion-container">
    // <div class="quizz-question-box"> 
    //     <h1>${data.questions[0].title}</h1>
    // </div>

    // <div class="image-quizz-box">
    //     <img src="${data.questions[0].answers[0].image}" alt=""/>
    //     <h1>${data.questions[0].answers[0].text}</h1>
    // </div>
    // <div class="image-quizz-box">
    //     <img src="${data.questions[0].answers[1].image}" alt="" />
    //     <h1>${data.questions[0].answers[1].text}</h1>
    // </div>`
    document.querySelector(".quizz-question-box").style.background = data.questions[0].color;

}
export { getOnlyQuizz }

{/* <section class="quizz-questions-container">
<div class="quizz-onlyquestion-container">
    <div class="quizz-question-box"> 
        <h1>A questão será escrita aqui!</h1>
    </div>
    <div class="image-quizz-box"></div>
    <div class="image-quizz-box"></div>
    <div class="image-quizz-box"></div>
    <div class="image-quizz-box"></div>
</div>

</section> */}