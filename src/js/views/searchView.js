import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = ''; // this will clear the input that was just submit from the Search bar
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = ''; // this will simply clear the HTML so nothing will be displayed
    elements.searchResultPages.innerHTML = ''; // near the page button 
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');  // remmove before selecting another active hovering so they are not all active (gray hover)
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => { // 17 is the sweet spot without having the ... go to the next line
    // This whole function will reduce the title to the limit without cutting letters in word 
    // Rather not include the word at all if including it will pass the limit
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            // use reduce method here b/c reduce has accumulator built in 
            if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;
        }, 0);

        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    // Copying this from index.html 
    // In order to print the results to the UI, need to replace the statiic data with 
    // dynamic data coming from the API
    const markup = `
        <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeEnd', markup);
};

const createButton = (page, buttonType) => `
    <button class="btn-inline results__btn--${buttonType}" data-goto=${buttonType === 'prev' ? page - 1 : page +1}>
        <span>Page ${buttonType === 'prev' ? page - 1 : page +1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${buttonType === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;
 
const renderButtons = (page, numResults, resultPerPage) =>{
    const pages = Math.ceil(numResults/resultPerPage);
    let button;
    if (page === 1 && pages > 1){
        button = createButton(page, 'next');
    } else if (page < pages) {
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `
    }
    else if (page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }
    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);

};

export const renderResults = (recipes, page = 1, resultPerPage = 10)  => {
    // Rendering the results of the current page
    const start = (page - 1) * resultPerPage;
    const end = page * resultPerPage;
    // getting an array of recipes need to loop through it
    recipes.slice(start,end).forEach(renderRecipe);  // slice method includes up to the end value but not including the end value
    // Rendering the page buttons
    renderButtons(page, recipes.length, resultPerPage)

};

