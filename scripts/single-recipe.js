var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');

document.addEventListener('DOMContentLoaded', function(){
    loadElements()
    fetchCard();
})

async function fetchCard() {
    turnLoader(true)
    if(!isEmptyId(true)){ return ;}
    const options = buildTastyRequest("get-more-info", { id: id });
    try {
        var recipeResponse = await axios.get('/view/partials/recipe.hbs');
        var specsResponse = await axios.get('/view/partials/specs.hbs');
        var recipeTemplate = Handlebars.compile(recipeResponse.data);
        var specsTemplate = Handlebars.compile(specsResponse.data);
        var response = await axios.request(options);
        if(!checkResponse(response,"There is no data for this recipe",true)){return;}
        var data = response.data;
        var specsData = {
            title: data.name,
            calories: data.nutrition?.calories,
            carbs: data.nutrition?.carbohydrates ,
            fat: data.nutrition?.fat ,
            protein: data.nutrition?.protein ,
            sugar: data.nutrition?.sugar
        };
        let recipeSteps = [{step:0,instruction:"There are no instructions for this recipe"}];
        if (Array.isArray(data.instructions)) {
            recipeSteps = data.instructions.map((instr, index) => ({
                step: index + 1,
                instruction: instr.display_text
            }));
        }
        const recipeData = {
            picture: data.thumbnail_url ? data.thumbnail_url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png',
            recipe: recipeSteps
        };
        turnLoader(false)
        document.getElementById("specs").innerHTML = specsTemplate(specsData);
        document.getElementById("recipe").innerHTML = recipeTemplate(recipeData);
    } catch (err) {
        console.error("Error fetching recipe details:", err);
        handleErrorStatus(err)
    }
}















