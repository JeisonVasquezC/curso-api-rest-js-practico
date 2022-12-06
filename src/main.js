const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        'language': 'es-CO',
    },
});

// Utils
const createMovies = (movies, container) => {
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`;
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

        movieContainer.appendChild(movieImg);
        
        container.appendChild(movieContainer);
    });
};

const createCategories = (categories, container) => {
    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.setAttribute('id', `id${category.id}`);
        categoryTitle.classList.add('category-title');
        categoryTitle.addEventListener('click', () => location.hash = `#category=${category.id}-${category.name}`);

        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
};

// Llamados a la API
const getTrendingMoviesPreview = async () => {
    // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
    // const data = await res.json();
    const { data } = await api(`trending/movie/day`);
    
    const movies = data.results;

    // const trendingPreviewMoviesSection = document.querySelector('#trendingPreview .trendingPreview-movieList');
    createMovies(movies, trendingMoviesPreviewList);
};

const getCategoriesPreviuew = async () => {
    try{
        // const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`);
        // const data = await res.json();
        const { data } = await api(`genre/movie/list`);

        const categories = data.genres;
        // const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');
        createCategories(categories, categoriesPreviewList);
    }catch(err){
        console.log(err);
    }
};

const getMoviesByCategory = async (id) => {
    console.log(id);
    // res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}?with_genres=${id}`);
    // data = await res.json();
    const { data } = await api(`discover/movie`,{
        params: {
            'with_genres': id,
        },
    });

    const movies = data.results;

    genericSection.innerHTML = '';
    createMovies(movies, genericSection)

};

const getMoviesBySearch = async (query) => {
    // const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
    // const data = await res.json();
    const { data } = await api('search/movie',{
        params: {
            'query': query,
        },
    });

    const movies = data.results;

    genericSection.innerHTML = '';
    createMovies(movies,genericSection)
};

const getTrendingMovies = async () => {
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    genericSection.innerHTML = '';
    headerCategoryTitle.innerText = 'Tendencias';
    createMovies(movies, genericSection)
};

const getMovieById = async (id) => {
    // const res = await fetch(`https://api.themoviedb.org/3/movie/736526?api_key=${API_KEY}`);
    // const movie = await res.json();
    const { data: movie } = await api(`movie/${id}`);

    const movieImgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    headerSection.style.background = `
        linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35) 19.27%,
            rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgUrl})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesId(id)
};

const getRelatedMoviesId = async (id) => {
    // const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`);
    // const data = await res.json();
    const { data } = await api(`movie/${id}/similar`);

    const relatedMovies = data.results;

    relatedMoviesContainer.innerHTML = '';
    createMovies(relatedMovies, relatedMoviesContainer);
}