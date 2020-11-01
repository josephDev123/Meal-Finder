const search = document.getElementById('search');
const search_btn = document.getElementById('search_btn');
const randon_btn = document.getElementById('randon_btn');
const mealsEl = document.getElementById('meal_id');
const singleMealEl = document.getElementById('single_meal_id');
const search_result_heading = document.getElementById('searchResultHeadingId');


//FETCH MEAL AND VERIFY INPUT
function fetchMeal(event){
event.preventDefault();

//input value
const search_value = search.value;

 // Clear single meal
mealsEl.innerHTML = '';

 // Clear single heading
search_result_heading.innerHTML = '';

if (search_value  == '') {
    alert('input is empty');
}else{
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search_value}`)
    .then(res=> res.json())
    .then(data =>{
        const fetchData = data.meals;
        console.log(fetchData)
 
        if (fetchData == null) {
            search_result_heading.innerHTML = `"${search_value}"  is not available. try another word or keyword</h2>`;
        }else{
            search_result_heading.innerHTML = `<h2>Search results for ${search_value}</h2>`;
                 fetchData.map(item =>{
                    mealsEl.innerHTML = `<div class="meals_img_container">
                        <img src=${item.strMealThumb} alt="" >
                        <div class="single_meal_info" data-attribute=${item.idMeal}>
                            <p>${item.strMeal}</p>
                        </div>
              </div>`  
            })
            .join('');
        } 
    })
   
}
 search.value ='';

}


//GET MEAL ID FROM THE DOM
function getMealId(e){
    const path = e.path.find(item=>{
        if (item.classList) {
            return item.classList.contains('single_meal_info')
        }
    })
    const mealFromDom = path.getAttribute('data-attribute');
        getMealFromApiById(mealFromDom);
   
}


//FETCH MEALS FROM API BY MEALID generated from the dom
function getMealFromApiById(mealFromDom){
   fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealFromDom}`)
   .then(res=> res.json())
   .then(data=>{
       console.log(data.meals[0]);
       const singleMealdatails = data.meals[0];
       const ingredient = [];
       console.log(ingredient);

       for (let i = 1; i <= 20; i++) {
           if(singleMealdatails[`strIngredient${i}`]){
              ingredient.push(`${singleMealdatails[`strIngredient${i}`]} - ${singleMealdatails[`strMeasure${i}`]}`) 
           }else{
               break;
           }
           
       }


       singleMealEl.innerHTML = `<div class="single_meal_container">
            <h2>${singleMealdatails.strMeal}</h2>

            <div class="singleMealImg">
                <img src="${singleMealdatails.strMealThumb}" width="100%" alt="">
            </div>

            <div class="singleMealCategoryStrArea">
                <p>${singleMealdatails.strCategory}</p>
                <p>${singleMealdatails.strArea}</p>
            </div>

            <div class="singleMealInstruction">
                <p>${singleMealdatails.strInstructions}</p> 
            </div>

            <div class="singleMealIngredient">
                <h2>Ingredients</h2>
                <ul>
                    ${ingredient.map(item => `<li>${item}</li>`).join('')}
    
                </ul>
            </div>
       </div>`
   })

   
}

//get random meal from MEAL API
function randomMeal(){
    mealsEl.innerHTML = '';
    singleMealEl.innerHTML='';
    search_result_heading.innerHTML = '';
    
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        // console.log(data.meals[0].idMeal);
        //id from random meal object
        const randomId = data.meals[0].idMeal;
        getMealFromApiById(randomId);
    })



}

//EVENT LISTENERS
search_btn.addEventListener('click', fetchMeal);
mealsEl.addEventListener('click', getMealId)
randon_btn.addEventListener('click', randomMeal)