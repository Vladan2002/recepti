var empty = document.getElementById('empty');
empty.style.display = "none";

function showErrorMessage(message) {
    const source = document.getElementById("error-template").innerHTML;
    const template = Handlebars.compile(source);
    const html = template({text: message});
    empty.innerHTML = html;
    empty.style.display = "flex";
}

function isEmptyId(card = false) {
    if (card && !id) {
        emptyHTML(true, "No id is provided")
        return false;
    }
    empty.style.display = 'none';
    return true;
}

function checkResponse(response, message,page=false) {
        if (!response || !response.data) {
            emptyHTML(page, message);
            console.log("no crashed");
            return false;
        }
    empty.style.display = 'none';
    return true;
}


function emptyHTML(boolean, message) {
    turnLoader(false);
    if (boolean) {
        document.getElementById("specs").innerHTML = "";
        document.getElementById("recipe").innerHTML = "";
    } else {
        document.getElementById("content").innerHTML = "";
    }
    showErrorMessage(message);

}

function turnLoader(boolean) {
    if (boolean) {
        document.getElementById('loader').style.display = 'flex';
    } else {
        document.getElementById('loader').style.display = 'none';
    }
}

async function loadElements(card = false) {
    try {
        var navbarResponse = await axios.get('/view/layout/navbar.hbs');
        var navbarTemplate = Handlebars.compile(navbarResponse.data);
        document.getElementById('navbar').innerHTML = navbarTemplate();
        if (card) {
            var headerResponse = await axios.get('/view/partials/index-header.hbs');
            var headerTemplate = Handlebars.compile(headerResponse.data);
            document.getElementById('container').innerHTML = headerTemplate();
        }
    } catch (e) {
        console.error("Error loading elements:", e);
        document.getElementById('navbar').innerHTML = 'Error loading navbar. Please try again later.';
        if (card) {
            document.getElementById('container').innerHTML = 'Error loading content. Please try again later.';
        }
    }
}


function buildTastyRequest(endpoint, params = {}) {
    const baseUrl = "https://tasty.p.rapidapi.com/recipes/";
    return {
        method: "GET",
        url: baseUrl + endpoint,
        params: params,
        headers: {
            'x-rapidapi-key': '95da5eb655msh9dc84ffae7afa48p1b51b9jsn1986d4b5c662',
            'x-rapidapi-host': 'tasty.p.rapidapi.com'
        }
    };
}

function handleErrorStatus(error) {
    let message = '';
    let status = error.response?.status;

    switch(status) {
        case 400:
            message = 'Bad request. Please check the input data.';
            break;
        case 401:
            message = 'Unauthorized. Please log in.';
            break;
        case 403:
            message = 'Access forbidden.';
            break;
        case 404:
            message = 'Recipe not found.';
            break;
        case 500:
            message = 'Server error. Please try again later.';
            break;
        case 503:
            message = 'Service is currently unavailable.';
            break;
        default:
            message = 'An error occurred. Please try again.';
    }

    turnLoader(false);
    showErrorMessage(message);
}
