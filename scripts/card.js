var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');

var empty=document.getElementById('empty');
empty.style.display="none";


document.addEventListener('DOMContentLoaded', function(){
    loadElements()
    fetchCard();
})

async function fetchCard() {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');

    loader(true)

    if (!id) {
        document.getElementById("recipe").innerHTML = "<p>No recipe ID provided.</p>";
        return;
    }

    const options = {
        method: 'GET',
        url: 'https://tasty.p.rapidapi.com/recipeas/get-more-info', //makni a
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
        if(!response || !response.data){
            loader(false);
            empty.style.display="flex";
            return;
        }
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
        document.getElementById("specs").innerHTML ="";
        document.getElementById("recipe").innerHTML = "";
        loader(false);
        empty.style.display="flex";
    }
}

function loader(boolean) {

    if (boolean) {
        document.getElementById('loader').style.display = 'flex';
    }else{
        document.getElementById('loader').style.display = 'none';
    }

}




async function loadElements() {
    try {
        var navbarResponse = await axios.get('/view/partials/navbar.hbs');

        var navbarTemplate = Handlebars.compile(navbarResponse.data);

        document.getElementById('navbar').innerHTML = navbarTemplate();


    } catch (e) {

    }
}
