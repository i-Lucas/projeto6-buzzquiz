const urlOnlyQuizz = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/";
let id = 2483   ;
let answers = [];
let data=[];
let point= 0;
let range =0, conter =0;
// Ao clicar em um quizz na tela inicial o onclick deve chamar a função getOnlyQuizz(id) e passar o id como parametro
function getOnlyQuizz(){
    const promise = axios.get(urlOnlyQuizz + id);
    promise.then(renderizeQuizz);
}

function renderizeQuizz(load){
    data = load.data;
    const imageQuizz= document.querySelector(".image-logo");
    imageQuizz.style.backgroundImage = `url('${data.image}')`;
    const questionsQuizz = document.querySelector(".quizz-questions-container");
    range = data.questions.length;
    console.log(range); 
    questionsQuizz.innerHTML="";
    data.questions.forEach((element, questionIndex) => {
        let text="";
        answers= [];
        console.log(element.color); 
        element.answers.forEach(answer=>{answers.push(answer)});
        answers.sort(randonQuestions);
        answers.forEach((iten ,answerIndex)=>{
            text+=`
            <div id="A${answerIndex}" class="image-quizz-box unset" data-answer="${iten.isCorrectAnswer}" onclick ="selectAnswer(this, ${questionIndex}, ${answers.length},${iten.isCorrectAnswer})">
                <img src="${iten.image}" alt=""/>
                <h1>${iten.text}</h1>
            </div>`
        });
        questionsQuizz.innerHTML+=
        `<div id="Q${questionIndex}" class="quizz-onlyquestion-container">
            <div class="quizz-question-title" style="background : ${element.color};"> 
                <h1>${element.title}</h1>
            </div> 
            ${text}
        </div>
        `
            text = "";    
            

    });
    // document.querySelector(".quizz-question-title").style.background = data.questions[0].color;

}
function randonQuestions(){
    return Math.random() - 0.5; 
}
function selectAnswer(element, question,length,answer){
   
    let image= document.querySelector(`#Q${question}`);
    for(let i =0; i < length; i++){ 
        let image= document.querySelector(`#Q${question} #A${i}`);
        image.removeAttribute("onclick");
        if(image.dataset.answer== "true"){
            image.querySelector("h1").style="color: green;";
        }else{image.querySelector("h1").style="color: red;";}
        if(image != element){
            image.style.opacity = '0.2';
        }
    }
    conter++;
    if(answer){
      point++;
    }
    if(conter == range){
        setEndPage();
    } 
    setTimeout(() =>{
        if(document.querySelector(`#Q${question+1}`)!=null){
        document.querySelector(`#Q${question+1}`).scrollIntoView(false)  }
    }, 2000);
    
    console.log(conter);  
}

function setEndPage(){
    let calc =  Math.round((point*100)/range);
    console.log(calc);
}

getOnlyQuizz()
// export { getOnlyQuizz}

