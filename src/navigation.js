let maxPages = 100;
let page = 0;
let infiniteScroll;

const creaetListLanguage = () =>{
    const arrayLanguage = [{ language: 'English', iso: 'en' }, { language: 'Spanish', iso: 'es' }, { language: 'Portuguese Br', iso: 'pt-BR' }, { language: 'French', iso: 'fr' }];

    arrayLanguage.forEach((item) => {
        const optionLanguage = document.createElement('option');
        optionLanguage.innerText = item.language
        optionLanguage.value = item.iso;
        languageUser() == [item.iso] ? optionLanguage.setAttribute('selected','') : console.log('no corresponde', item.language)
        

        selectLanguageUser.appendChild(optionLanguage);
    });
}

const navigator = () => {
    console.log({ location });

    if(infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false });
        infiniteScroll = undefined;
    }
    
    location.hash.startsWith('#trends')    ? trendsPage()       :
    location.hash.startsWith('#search=')   ? searchPage()       :
    location.hash.startsWith('#movie=')    ? movieDetailPage()  :
    location.hash.startsWith('#category=') ? categoriesPage()   :
    homePage()

    document.documentElement.scrollTop = 0;
    document.scrollTop = 0;

    if(infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive: false })
    }
};

const trendsPage = () => {
    console.log('TRENDS!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    
    getTrendingMovies();

    infiniteScroll = getPaginatedMoviesByTrending;
};

const searchPage = () => {
    console.log('SEARCH!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [, query ] = location.hash.split('=');
    getMoviesBySearch(query);

    infiniteScroll = getPaginatedMoviesBySearch(query);
};

const movieDetailPage = () => {
    console.log('MOVIE!!!');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');scrollTop = 0;
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
};

const categoriesPage = () => {
    console.log('CATEGORY!!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');

    headerCategoryTitle.innerText = decodeURI(categoryName);

    console.log(categoryId, categoryName);
    getMoviesByCategory(categoryId);

    infiniteScroll = getPaginatedMoviesByCategory(categoriesPage);
};

const homePage = () => {
    console.log('HOME');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    console.log('Trending API');
    getTrendingMoviesPreview();

    console.log('Categories API');
    getCategoriesPreviuew();

    console.log('Favorites Movies');
    getLikedMovies();
};



arrowBtn.addEventListener('click', () => {
    history.back();
    location.hash = '#home';
});
searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`;
});
trendingBtn.addEventListener('click', () => location.hash = '#trends=');

selectLanguageUser.addEventListener('change', (e) => {
    e.stopPropagation();
    // console.log(e.path[0].value);
    language();
    location.reload();
})

creaetListLanguage();
window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, { passive: false });
