const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

// Введите ваш API Key MDB
const apiKey = "YOUR_KEY_HERE";

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('#search-input').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=' + apiKey + '&language=ru&query=' + searchText;
    requestApi('GET', server);
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(method, url) {
    const request = new XMLHttpRequest();
    request.open(method, url);
    request.send();
    request.addEventListener('readystatechange', () => {
            if (request.readyState !== 4) {
                return;
            }

            if (request.status !== 200) {
                console.log('error: ' + request.status);
                return;
            }

            const output = JSON.parse(request.responseText);

            let inner = '';

            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let dateItem = item.first_air_date || item.release_date;
                inner += `<div class="col-3"> ${nameItem} <br> ${dateItem}</div>`;
            });

            movie.innerHTML = inner;
        }
    );
}