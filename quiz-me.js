

const categoryMap = new Map([
    ["General Knowledge",9],
    ["Books",10],
    ["Movies",11],
    ["Music",12],
    ["TV",14],
    ["Video Games",15],
    ["Board Games",16],
    ["Nature",17],
    ["Computer",18],
    ["Math",19],
    ["Mythology",20],
    ["Sports",21],
    ["Geography",22],
    ["History",23],
    ["Art",25],
    ["Politics",24],
    ["Animal",27],
    ["Vehicles",28],
    ["Comic",29],
    ["Cartoons",32],
    ["Anime",31],
    ["Celebrities",26],
    ["Random",0]
]);
let questions = [];
let quesCategory;
let currQuestionDetails;


function setCategories(){
    let text = ""
    for (category of categoryMap.keys()){
        text += `<div class="category">` + category + "</div>";
    }
    document.getElementById("categories").innerHTML = text;

}

function prepareQuestions(json){
    questions = json.results;
    showQuestion();
    // console.log(questions);
    
}

function getQuestions(category){
    

    if (quesCategory!=undefined && category==quesCategory && questions.length!=0){
        showQuestion();
    }
    else{
        questions = [];
        
        quesCategory = category;
        let url="https://opentdb.com/api.php?amount=20";
        if (category!=0){
            url += "&category=" + category;
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {  
            if (xhr.readyState == 4 && xhr.status == 200) {
                var jsonData = JSON.parse(xhr.responseText);
                prepareQuestions(jsonData);
                // console.log(jsonData);
            }
        };
        xhr.send();
    }


}

function showQuestion(){

    let currQuestion = questions.pop();
    currQuestionDetails = currQuestion;
    document.getElementById("questionText").innerHTML = currQuestion.question;
    let options = [];
    options.push(`<div id="correct" class="option hover"><p>` + currQuestion.correct_answer + "</p></div>");
    for (let temp of currQuestion.incorrect_answers){
        options.push(`<div class="option hover"><p>` + temp + "</p></div>");
    }
    if(options.length==2){
        document.getElementById("options").style.gridTemplateRows="100%";
    }
    else{
        document.getElementById("options").style.gridTemplateRows="50% 50%";
    }
    document.getElementById("options").innerHTML = shuffle(options).join('');
    addListenersOptions();
}
setCategories();


function addListeners(){
    const categories = document.querySelectorAll(".category:not(#current)");
    categories.forEach((cat)=>{
        cat.addEventListener("click", (e)=>{
            targCategory = e.target.innerHTML;
            getQuestions(categoryMap.get(targCategory));
            document.getElementById("question").style.display = "flex";
            document.getElementById("question").style.flexDirection = "column";
            document.getElementById("question").style.justifyContent = "space-around";
            document.getElementById("categories").style.display = "none";
            document.getElementById("current").innerHTML = targCategory;
            document.getElementById("current").style.display = "block";
            document.getElementById("header").style.justifyContent="space-around";
        })
    })

    

    document.getElementById("current").addEventListener("click", (e)=>{
        
        document.getElementById("question").style.display = "none";
        document.getElementById("questionText").innerHTML = "";
        document.getElementById("options").innerHTML = "";
        document.getElementById("categories").style.removeProperty("display");
        document.getElementById("current").style.display = "none";
        document.getElementById("header").style.justifyContent="center";
    })

    document.getElementById("next").addEventListener("click", (e)=>{
        getQuestions(quesCategory);
    })

}

function addListenersOptions(){
    const optionList = document.querySelectorAll(".option");
    optionList.forEach((opt)=>{
        opt.addEventListener("click", eventFunction)
    })
}

function eventFunction(e){
    choice = e.target.innerHTML;
    choice = choice.replace("<p>","");
    choice = choice.replace("</p>","");

    if (choice!=currQuestionDetails.correct_answer){
        e.currentTarget.style.backgroundColor = "red";
        
    }
    document.getElementById("correct").style.backgroundColor = "LimeGreen";
    removeListeners();
}

function removeListeners(){
    const optionList = document.querySelectorAll(".option");
    optionList.forEach((opt)=>{
        opt.removeEventListener("click", eventFunction)
    })
    hoverList = document.querySelectorAll(".hover");
    hoverList.forEach((opt)=>{
        opt.classList.remove("hover");
    })
}

addListeners();

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }