var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');

document.addEventListener('DOMContentLoaded', function(){
    loadElements()
    fetchCard();
})

async function fetchCard() {
    loader(true)
    if(!isEmptyId(true)){ return ;}
    const options = {
        method: 'GET',
        url: 'https://tasty.p.rapidapi.com/recipes/get-more-info', //makni a
        params: { id: id },
        headers: {
            'x-rapidapi-key': '95da5eb655msh9dc84ffae7afa48p1b51b9jsn1986d4b5c662',
            'x-rapidapi-host': 'tasty.p.rapidapi.com'
        }
    };

    try {
        var recipeResponse = await axios.get('/view/partials/recipe.hbs');
        var specsResponse = await axios.get('/view/partials/specs.hbs');

        var recipeTemplate = Handlebars.compile(recipeResponse.data);
        var specsTemplate = Handlebars.compile(specsResponse.data);

        var response = await axios.request(options);
        if(!badResponse(true,false,response)){return;}

        var data = response.data;
        var specsData = {
            title: data.name,
            calories: data.nutrition?.calories,
            carbs: data.nutrition?.carbohydrates ,
            fat: data.nutrition?.fat ,
            protein: data.nutrition?.protein ,
            sugar: data.nutrition?.sugar
        };

        var recipeData = {
            picture: data.thumbnail_url,
            recipe: data.instructions.map((instr, index) => ({
                step: index + 1,
                instruction: instr.display_text
            }))
        };

        loader(false)
        document.getElementById("specs").innerHTML = specsTemplate(specsData);
        document.getElementById("recipe").innerHTML = recipeTemplate(recipeData);

    } catch (err) {
        console.error("Error fetching recipe details:", err);
        if(!badResponse(true,true)){return;}
    }
}




