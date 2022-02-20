let dataId=[];
let dataKey=[];
let responseQuizz;
// CreateNewQuizz(myQuizz)
let newQuizz={};
let NewQuestion = [];
let NewLevel = [];
function CreateNewQuizz(){
    
    newQuizz.title = quizzTitle;
    newQuizz.image = quizzUrl;
    for(let i = 0; i<numberOfQuestions;i++){
        NewQuestion.push(createNewQuestion(i));
    }
    for(let i =0; i< numberOfLevels;i++ ){
        NewLevel.push(createNewLevel(i));
    }
    newQuizz.questions = NewQuestion;
    newQuizz.levels = NewLevel;
    console.log(newQuizz);
    postQuizz(newQuizz);
    
 }
 
function createNewQuestion(index){
    const newDataQuestion= {
        "title":GetFormData[index].quizzQuestion,
        "color":GetFormData[index].quizzQuestionColor,
        "answers": [
            {
                "text":GetFormData[index].quizzRightAnswer,
                "image":GetFormData[index].quizzRightAnswerURL,
                "isCorrectAnswer": true
            },
            {
                "text":GetFormData[index].quizzIncorrectAnswer1,
                "image":GetFormData[index].quizzIncorrectAnswerURL1,
                "isCorrectAnswer": false
            }
        ]
    }
    if(GetFormData[index].quizzIncorrectAnswer2 != ""){
    newDataQuestion.answers.push({
        "text":GetFormData[index].quizzIncorrectAnswer2,
        "image":GetFormData[index].quizzIncorrectAnswerURL3,
        "isCorrectAnswer": false
    })
    }
    if(GetFormData[index].quizzIncorrectAnswer3 != ""){
        newDataQuestion.answers.push({
            "text":GetFormData[index].quizzIncorrectAnswer3,
            "image":GetFormData[index].quizzIncorrectAnswerURL3,
            "isCorrectAnswer": false
        })
    }
    return newDataQuestion;
} 
function createNewLevel(index){
    const newDataLevel = {
        "title": GetFormLevel[index].quizzLevel,
        "minValue":GetFormLevel[index].LevelPorcent,
        "image":GetFormLevel[index].LevelURL,
        "text":GetFormLevel[index].LevelDescription
    }
    return newDataLevel;
}

function postQuizz(quizz) {
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizz)
    promise.then((response) => {
        console.warn(response);
        saveDataQuizz(response);
    })
    promise.catch((error) => {
        console.error(error)
    })
}
function saveDataQuizz(load){
    responseQuizz=load.data;
    id=responseQuizz.id;
    dataId.push(responseQuizz.id);
    dataKey.push(responseQuizz.key);
    const idReadyToSend = JSON.stringify(dataId);
    const keyReadyToSend = JSON.stringify(dataKey);
    localStorage.setItem("id", idReadyToSend);
    localStorage.setItem("key", keyReadyToSend);
    setImageQuizz();
    getDataQuizz();
}
function getDataQuizz(){
    dataId= ""
    dataKey = "";
    const dataIdString = localStorage.getItem("id");
    dataId = JSON.parse(dataIdString);
    const dataKeyString = localStorage.getItem("key");
    dataKey = JSON.parse(dataKeyString);
    if(dataId.length != 0){
        document.querySelector('.user-quizz-container').classList.remove("hidden");
        document.querySelector('.userQuizzTitle').classList.remove("hidden");
        document.querySelector('.buttonQuizzTitle').classList.remove("hidden");
        document.querySelector('.create-quizz-container').classList.add("hidden");
        RenderUserQuizz(dataId);
    }else{
        document.querySelector('.user-quizz-container').classList.add("hidden");
        document.querySelector('.userQuizzTitle').classList.add("hidden");
        document.querySelector('.buttonQuizzTitle').classList.add("hidden");
        document.querySelector('.create-quizz-container').classList.remove("hidden");  
    }
    
    GetAllQuizzes()
}
function setImageQuizz(){
    const element = document.querySelector(".quizz-success-box").style.backgroundImage = `url('${quizzUrl}')`;
}

function RenderUserQuizz(idQuizz) {
    const userQuizzContainer = document.querySelector('.user-quizz-container')
    userQuizzContainer.innerHTML = ''
    for(let i=0; i < dataId.length; i++) {
        const promise = axios.get(urlOnlyQuizz + dataId[i]);
    promise.then((response) => {
        userQuizzContainer.innerHTML += `
        
        <div class="all-quizz-box" id = "${dataId[i]}" onclick="getOnlyQuizz(${dataId[i]})" style="url('${response.data.image}')">
            <h1 class = 'title'>${response.data.title}</h1>
        </div>
    `});
    }
}
