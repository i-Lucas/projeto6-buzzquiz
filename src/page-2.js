const urlOnlyQuizz = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/";
let id = 2335;


// Ao clicar em um quizz na tela inicial o onclick deve chamar a função getOnlyQuizz(id) e passar o id como parametro
function getOnlyQuizz(){
    const promise = axios.get(urlOnlyQuizz + id);
    promise.then(renderizeQuizz);
}

function renderizeQuizz(load){
    let data = load.data;
    console.log(data);
    const imageQuizz= document.querySelector(".image-logo");
    imageQuizz.style.backgroundImage = `url('${data.image}')`;
    const questionsQuizz = document.querySelector(".quizz-questions-container");

    questionsQuizz.innerHTML=
    `<div class="quizz-onlyquestion-container">
    <div class="quizz-question-box"> 
        <h1>${data.questions[0].title}</h1>
    </div>
    <div class="image-quizz-box"></div>
    <div class="image-quizz-box"></div>
    <div class="image-quizz-box"></div>
    <div class="image-quizz-box"></div>
    </div>`
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