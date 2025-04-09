
document.addEventListener('DOMContentLoaded', async () => {
    await loadElements();
    await fetchData()
})
var empty=document.getElementById('empty');
empty.style.display="none";





async function fetchData() {

    loader(true);
    var q=document.getElementById('search').value
    const params = {
        from: '0',
        size: '20'
    };

    if (q) {
        params.q = q;
    }
    const request = {
        method: "GET",
        url: "https://tasty.p.rapidapi.com/recipes/list",
            params: params
        ,
        headers: {
            'x-rapidapi-key': '95da5eb655msh9dc84ffae7afa48p1b51b9jsn1986d4b5c662',
            'x-rapidapi-host': 'tasty.p.rapidapi.com'
        }
    };

    try {
        const partialResponse = await axios.get('/view/partials/card.hbs');
        const partialText = partialResponse.data;

        const template = Handlebars.compile(partialText);



        document.getElementById("content").innerHTML ="";

        const response = await axios.request(request);
        if(!response || response.data.results.length == 0) {
            loader(false);
            empty.style.display="flex";
            return;
        }
        empty.style.display="none";
        const results = response.data.results;

        let cardsHTML = "";


        for (let i = 0; i < results.length; i++) {
            const cardData = {
                id: results[i].id,
                name: results[i].name,
                picture: results[i].thumbnail_url,
                tag: results[i].topics?.[0]?.name || "",
                time: results[i].total_time_minutes ? `${results[i].total_time_minutes} min` : ""
            };

            cardsHTML += template(cardData);
        }
        loader(false);
        document.getElementById("content").innerHTML = cardsHTML;

    } catch (err) {
        console.error("Error fetching data:", err);
        document.getElementById("content").innerHTML = "<p>Failed to load recipes.</p>";
    }
}




function card(id) {

        window.location.href = `http://127.0.0.1:8080/card.html?id=${id}`;


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
        var headerResponse = await axios.get('/view/partials/index-header.hbs');
       var navbarResponse = await axios.get('/view/partials/navbar.hbs');

        var headerTemplate = Handlebars.compile(headerResponse.data);
        var navbarTemplate = Handlebars.compile(navbarResponse.data);
        console.log(headerTemplate);

        document.getElementById('navbar').innerHTML = navbarTemplate();
        document.getElementById('container').innerHTML = headerTemplate();


    } catch (e) {

    }
}







