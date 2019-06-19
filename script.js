const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

// Введите ваш API Key MDB
const apiKey = "YOUR_KEY_HERE";

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('#search-input').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=' + apiKey + '&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка';

    fetch(server)
        .then((value) => {
            return value.json();
        })
        .then((output) => {
            let inner = '';

            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let dateItem = item.first_air_date || item.release_date;
                inner += `<div class="col-3"> ${nameItem} <br> ${dateItem}</div>`;
            });

            movie.innerHTML = inner;
        })
        .catch((reason) => {
            movie.innerHTML = 'Упс, что-то пошло не так!';
                console.log('error: ' + reason);
                return;
        })
        ;
}

searchForm.addEventListener('submit', apiSearch);