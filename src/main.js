const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    Headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        'language': 'es-CO'
    },
});

const getTrendingMoviesPreview = async () => {
    // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
    // const data = await res.json();
    const { data } = await api(`/trending/movie/day`);
    
    const movies = data.results;

    // const trendingPreviewMoviesSection = document.querySelector('#trendingPreview .trendingPreview-movieList');
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`);

        movieContainer.appendChild(movieImg);
        
        trendingMoviesPreviewList.appendChild(movieContainer);
    });
};

const getCategoriesPreviuew = async () => {
    try{
        // const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`);
        // const data = await res.json();
        const { data } = await api(`genre/movie/list`);

        const categories = data.genres;
        // const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');

        categories.forEach(category => {

            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category-container');

            const categoryTitle = document.createElement('h3');
            categoryTitle.setAttribute('id', `id${category.id}`);
            categoryTitle.classList.add('category-title');

            const categoryTitleText = document.createTextNode(category.name);

            categoryTitle.appendChild(categoryTitleText);
            categoryContainer.appendChild(categoryTitle);
            categoriesPreviewList.appendChild(categoryContainer);
        });
    }catch(err){
        console.log(err);
    }
};