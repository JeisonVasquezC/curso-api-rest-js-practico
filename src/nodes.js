const $ = (id) => document.querySelector(id);

const headerSection = $('#header'); // 16
const trendingPreviewSection = $('#trendingPreview'); // 27
const categoriesPreviewSection = $('#categoriesPreview'); // 36
const genericSection = $('#genericList'); // 54
const movieDetailSection = $('#movieDetail'); // 80

// List & COntainer
const searchForm = $('#searchForm'); // 21
const trendingMoviesPreviewList = $('.trendingPreview-movieList'); // 33
const categoriesPreviewList = $('.categoriesPreview-list'); // 39
const movieDetailCategoriesList = $('#movieDetail .categories-list'); // 80 - 87
const relatedMoviesContainer = $('.relatedMovies-scrollContainer'); // 104

// Element
const headerTitle = $('.header-title'); // 18
const arrowBtn = $('.header-arrow'); // 17
const headerCategoryTitle = $('.header-title--categoryView'); // 19

const searchFormInput = $('#searchForm input'); // 21
const searchFormBtn = $('#searchBtn'); // 23

const trendingBtn = $('.trendingPreview-btn'); // 81

const movieDetailTitle = $('.movieDetail-title');
const movieDetailScore = $('.movieDetail-score'); // 82
const movieDetailDescription = $('.movieDetail-description'); // 83