const languageUser = () => { 
    const item = localStorage.getItem('language_user');
    let language;

    if(item){
        language = item;
    }else{
        language = '';
    }

    return language;
}

const language = () => {
    userLanguage = languageUser();

    if(userLanguage != selectLanguageUser.value){
        localStorage.setItem('language_user', (selectLanguageUser.value));
    }
}

// Data
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        'language': languageUser(),
    },
});


const likedMoviesList = () =>{
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if(item){
        movies = item;
    }else{
        movies = {}
    }

    return movies;
}

const likeMovie = (movie) => {
    const likedMovies = likedMoviesList();
    
    if (likedMovies[movie.id]){
        // Remover permita del locastorage
        console.log('La pelicula ya estaba en LS, por ende se eliminará');
        likedMovies[movie.id] = undefined;
    }else{
        // Agrega pelicula de localstorage
        console.log('La pelicula no esta en LS, por ende se agrega');
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

    getLikedMovies();
};

// Utils
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // console.log(entry.target.getAttribute);

        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-src');
            entry.target.setAttribute('src', url)
        }
        
    });
});

const createMovies = (movies, container, { lazyLoad = false, clean = true } = {}) => {
    if(clean) {
        container.innerHTML = '';
    }
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);

        movieImg.setAttribute( lazyLoad ? 'data-src' : 'src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOMUez6DwAD8AIIOhah/wAAAABJRU5ErkJggg==`)
            const movieImgTitleSpan = document.createElement('span');
            const movieImgTitle  = document.createTextNode(movie.title);
            movieContainer.appendChild(movieImgTitleSpan);
            movieImgTitleSpan.appendChild(movieImgTitle);
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Forma de evitar la propagacion de eventos es usando el evento ‘stopPropagation’ en el addEventListener del boton de like (movieBtn), con esto no tendriamos que mover el evento del contenedor a la imagen
            movieBtn.classList.toggle('movie-btn--liked');
            
            likeMovie(movie);
        })

        if(lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);
    });
};

const createCategories = (categories, container) => {
    container.innerHTML = '';
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
    createMovies(movies, trendingMoviesPreviewList, { lazyLoad: true });
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
    // res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}?with_genres=${id}`);
    // data = await res.json();
    const { data } = await api(`discover/movie`,{
        params: {
            'with_genres': id,
        },
    });

    const movies = data.results;

    page = 1;
    createMovies(movies, genericSection, { lazyLoad: true });

};

const getPaginatedMoviesByCategory = (id) => {
    return async function(){
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 20;
        const pageIsNotMax = page < maxPages;
        
        if(scrollIsBottom && pageIsNotMax){
            page++;
            console.log(page);
            // const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
            // const data = await res.json();
            const { data } = await api(`discover/movie`,{
                params: {
                    'with_genres': id,
                    page,
                },
            });

            const movies = data.results;
            maxPages = data.total_pages;

            // page === 1 ? isCleaning = true : isCleaning = false;
            createMovies(movies,genericSection, { lazyLoad: true, clean: false });
        }
    };
};

const getMoviesBySearch = async (query) => {
    const { data } = await api('search/movie',{
        params: {
            query,
        },
    });

    const movies = data.results;
    maxPages = data.total_pages;
    console.log(maxPages);

    page = 1;
    createMovies(movies,genericSection, { lazyLoad: true });
};

const getPaginatedMoviesBySearch = (query) => {
    return async function(){
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 20;
        const pageIsNotMax = page < maxPages;
        
        if(scrollIsBottom && pageIsNotMax){
            page++;
            console.log(page);
            // const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
            // const data = await res.json();
            const { data } = await api('search/movie',{
                params: {
                    query,
                    page,
                },
            });

            const movies = data.results;
            maxPages = data.total_pages;

            // page === 1 ? isCleaning = true : isCleaning = false;
            createMovies(movies,genericSection, { lazyLoad: true, clean: false });
        }
    };
};

const getTrendingMovies = async () => {
    const { data } = await api('trending/movie/day');

    const movies = data.results;
    maxPages = data.total_pages;

    headerCategoryTitle.innerText = 'Tendencias';
    
    createMovies(movies, genericSection, { lazyLoad: true });

    /* const btnLoadMore = document.createElement('button');
    btnLoadMore.innerText = 'Cargar Más';
    genericSection.appendChild(btnLoadMore);
    
    btnLoadMore.addEventListener('click', () => {
        getTrendingMovies(page + 1);
        btnLoadMore.remove();
    }); */
}

const getPaginatedMoviesByTrending = async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight - 20;
    const pageIsNotMax = page < maxPages;
    
    if(scrollIsBottom && pageIsNotMax){
        page++;
        console.log(page);
        // const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
        // const data = await res.json();
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        });

        const movies = data.results;
        maxPages = data.total_pages;

        // page === 1 ? isCleaning = true : isCleaning = false;
        createMovies(movies,genericSection, { lazyLoad: true, clean: false });
    }
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

    createMovies(relatedMovies, relatedMoviesContainer);
};

const getLikedMovies = () => {
    const likedMovies = likedMoviesList();
    
    const moviesArray = Object.values(likedMovies);
    createMovies(moviesArray, likedMoviesContainer, { lazyLoad: true });
};