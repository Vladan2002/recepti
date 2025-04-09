var empty=document.getElementById('empty');
empty.style.display="none";


function showErrorMessage(message) {
    const source = document.getElementById("error-template").innerHTML;
    const template = Handlebars.compile(source);
    const html = template({ text: message });
    empty.innerHTML = html;
    empty.style.display = "flex";
}


function isEmptyId(card = false) {
    if (card && !id) {
        loader(false);
        document.getElementById("specs").innerHTML = "";
        document.getElementById("recipe").innerHTML = "";
        showErrorMessage("No recipe ID provided.");
        return false;
    }
    empty.style.display = 'none';
    return true;
}


function badResponse(card = false, crash = false, response) {

    if (crash && card === true) {
        loader(false);
        document.getElementById("specs").innerHTML = "";
        document.getElementById("recipe").innerHTML = "";
        showErrorMessage("No recipe at the moment");
        console.log("crashed");
        return false;
    }
    else if (crash && card === false) {
        loader(false);
        document.getElementById("content").innerHTML = "";
        showErrorMessage("There is no recipes at the moment");
        console.log("crashed");
        return false;
    }

    if (card) {
        if (!response || !response.data) {
            loader(false);
            document.getElementById("specs").innerHTML = "";
            document.getElementById("recipe").innerHTML = "";
            showErrorMessage("No recipe at the moment");
            console.log("no crashed");
            return false;
        }
    } else {
        if (!response || !response.data || !response.data.results || response.data.results.length === 0) {
            loader(false);
            document.getElementById("content").innerHTML = "";
            showErrorMessage("There is no recipes at the moment");
            console.log("no crashed");
            return false;
        }
    }

    empty.style.display = 'none';
    return true;
}



function loader(boolean) {

    if (boolean) {
        document.getElementById('loader').style.display = 'flex';
    }else{
        document.getElementById('loader').style.display = 'none';
    }

}

async function loadElements(card=false) {
    try {
        var navbarResponse = await axios.get('/view/partials/navbar.hbs');
        var navbarTemplate = Handlebars.compile(navbarResponse.data);
        document.getElementById('navbar').innerHTML = navbarTemplate();
        if(card){
            var headerResponse = await axios.get('/view/partials/index-header.hbs');
            var headerTemplate = Handlebars.compile(headerResponse.data);
            document.getElementById('container').innerHTML = headerTemplate();
        }
    } catch (e) {

    }
}