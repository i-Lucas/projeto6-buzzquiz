// importando a função

import {GetAllQuizzes} from './page-1.js'
import {getOnlyQuizz} from './page-2.js'
import {CreateNewQuizz, myQuizz} from './page-3.js'
import {testando} from './page-2.js'
// quando a página carregar chama a função que está no outro módulo
window.onload = () => {

    GetAllQuizzes();
    getOnlyQuizz();
    
    // essa função já está criando um Quizz, agora basta configurar as variáveis no myQuizz (page-2.js)
     //CreateNewQuizz(myQuizz)    
}
