function GetAllQuizzes() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    promise.then((response) => {
        console.log(response.data)
    })
    promise.catch((error) => {
        console.error(error)
    })
}




// exportando a função
export { GetAllQuizzes }