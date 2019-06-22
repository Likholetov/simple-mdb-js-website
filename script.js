const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = "https://image.tmdb.org/t/p/w500";

// Введите ваш API Key MDB
const apiKey = "YOUR_KEY_HERE";

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('#search-input').value;

    if (searchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        return;
    }

    const server = 'https://api.themoviedb.org/3/search/multi?api_key=' + apiKey + '&language=ru&query=' + searchText;
    movie.innerHTML = '<div class="spinner"></div>';

    fetch(server)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then((output) => {
            let inner = '';
            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let dateItem = item.first_air_date || item.release_date;
                const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.jpg';
                let dataInfo = '';
                if (item.media_type !== 'person') {
                    dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                }
                inner += `
                <div class="col-12 col-md-4 col-xl-3 item">
                    <img class="img_poster" width=100% src="${poster}" alt="${nameItem}" ${dataInfo}> <br> 
                    <h5 class="text-center">${nameItem}</h5>
                    <h6 class="text-center">${dateItem}</h6>
                </div>
                `;
            });

            movie.innerHTML = inner;

            addEventMedia();
        })
        .catch((reason) => {
            movie.innerHTML = '<h2 class="col-12 text-center text-danger">Упс, что-то пошло не так!</h2>';
                console.log('error: ' + reason.status);
                return;
        });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach(elem => {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    });
}

function showFullInfo() {
    let url = '';
    if (this.dataset.type === 'movie') {
        url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=${apiKey}&language=ru`;
    } else if (this.dataset.type === 'tv') {
        url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=${apiKey}&language=ru`;
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка</h2>';
    }

    fetch(url)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then((output) => {
            const poster = output.poster_path ? urlPoster + output.poster_path : './img/noposter.jpg';
            movie.innerHTML = `
                <h2 class="col-12 text-center text-info">${output.name || output.title}</h2>
                <div class="col-6">
                    <img src="${poster}" alt="${output.name || output.title}">
                    ${(output.homepage) ? `<p class='text-center'><a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
                    ${(output.imdb_id) ? `<p class='text-center'><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB</a></p>` : ''}
                </div>
                <div class="col-6">
                    <p> Рейтинг: ${output.vote_average}</p>
                    <p> Статус: ${output.status}</p>
                    <p> Премьера: ${output.first_air_date || output.release_date}</p>
                    <p> Описание: ${output.overview}</p>
                </div>
            `;
        })
        .catch((reason) => {
            movie.innerHTML = '<h2 class="col-12 text-center text-danger">Упс, что-то пошло не так!</h2>';
                console.log('error: ' + reason.status);
                return;
        });
    }

document.addEventListener('DOMContentLoaded', () => {
    fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=ru`)
    .then((value) => {
        if (value.status !== 200) {
            return Promise.reject(value);
        }
        return value.json();
    })
    .then((output) => {
        let inner = '<h2 class="col-12 text-center text-info mb-5">Популярное за неделю</h2>';
        if (output.results.length === 0) {
            inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
        }
        output.results.forEach(function (item) {
            let nameItem = item.name || item.title;
            let mediaType = item.title ? 'movie' : 'tv';
            const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.jpg';
            let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
            inner += `
            <div class="col-12 col-md-4 col-xl-3 item">
                <img class="img_poster" width=100% src="${poster}" alt="${nameItem}" ${dataInfo}> <br> 
                <h5 class="text-center">${nameItem}</h5>
            </div>
            `;
        });

        movie.innerHTML = inner;

        addEventMedia();
    })
    .catch((reason) => {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Упс, что-то пошло не так!</h2>';
            console.log('error: ' + reason.status);
            return;
    });
});