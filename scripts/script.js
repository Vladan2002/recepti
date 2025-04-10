document.addEventListener('DOMContentLoaded', async () => {
    await loadElements(true);
    await fetchData()
})

async function fetchData() {
    turnLoader(true);
    document.getElementById('content').innerHTML = '';
    const searchTerm = document.getElementById('search').value;
    const params = {
        from: '0',
        size: '20'
    };
    if (searchTerm) {
        params.q = searchTerm;
    }
    const request = buildTastyRequest("list", params);
    try {
        const partialResponse = await axios.get('/view/partials/card.hbs');
        Handlebars.registerPartial('card', partialResponse.data);
        const templateSource = document.getElementById("item-template").innerHTML;
        const template = Handlebars.compile(templateSource);
        const response = await axios.request(request);
        if (!checkResponse(response, "There are no recipes", false)) return;
        const rawResults = response.data.results;
        if (!response.data || !Array.isArray(response.data.results) || response.data.results.length == 0) {
            emptyHTML(false, "No results found.");
        }
        const preparedResults = [];
        for (let i = 0; i < rawResults.length; i++) {
            const r = rawResults[i];
            preparedResults.push({
                id: r.id,
                name: r.name,
                picture: r.thumbnail_url,
                tag: r.topics && r.topics[0] ? r.topics[0].name : "",
                time: r.total_time_minutes ? `${r.total_time_minutes} min` : ""
            });
        }
        const data = { item: preparedResults };
        const html = template(data);
        turnLoader(false);
        document.getElementById("content").innerHTML = html;
    } catch (err) {
        console.error("Error fetching data:", err);
        handleErrorStatus(err)
    }
}

function card(id) {
        window.location.href = `../single-recipe.html?id=${id}`;
}

