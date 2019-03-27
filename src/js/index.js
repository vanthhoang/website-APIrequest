
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes'; 
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView'; 
import {elements, renderLoader, clearLoader} from './views/base';



///         *** SEARCH CONTROLLER *** 

const state = {}; // first state will be empty when started 

const controlSearch = async () =>{
    const query = searchView.getInput(); 
    if (query) { // if there is a query or input
        state.search = new Search(query); // save the search to global state
        searchView.clearInput(); // clear the input at the search bar
        searchView.clearResults();      // clear the previous search results before displaying the result for new search result
        renderLoader(elements.searchRes);
        try {
            await state.search.getResults (); // await b/c the result is a promise, and promise needs to be resolved
            clearLoader();
            searchView.renderResults(state.search.res); // rendering it to the UI
        } catch (error) {
            alert('Something went wrong with the search...');
            clearLoader(); 
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); 
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); 
    // Using closest method and '.btn-inline" parent class so that it doesn't matter if users click the word or the arrow
    // the page # is stored in the parent element and their child elements
    if (btn) {
        // Store in the "goto" attribute 
        // 10 here is based 10 (1 -10); if put 2 it would be binary base
        const goToPage = parseInt(btn.dataset.goto, 10);  
        searchView.clearResults();
        searchView.renderResults(state.search.res, goToPage);
    }
});

///         *** RECIPE CONTROLLER *** 

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');  // Get ID from url
    console.log(id);
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe(); // need to clear before loading b/c if we don't the previous search/result will still be there when we try to add a new one
        renderLoader(elements.recipe);

        //Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe, 
                state.likes.isLiked(id)
            );

        } catch (err) {
            alert('Error processing recipe!');
        }
    }
};
 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//          *** LIST CONTROLLER ***

const controlList = () => {
    // Create a new list if there is none yet
    if (!state.list) state.list  = new List(); 
    // Add each ingredient to the list and UI 
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item); 
    });
}

// Handling the delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid; 

    // Handling the delete button; use matches here cuz it's true or false 
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id); // delete from state
        listView.deleteItem(id);   // delele from UI 
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, value);
    } 
})

//          *** LIKES CONTROLLER ***

const controlLike = () => {
    // add a new one to the list 
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // Here the user has already liked the recipe
    if(!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
        )
        // Toggle the like button 
        likesView.toggleLikeBtn(true); 
        // Add like to UI list
        likesView.renderLike(newLike);

    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);
        // Toggle
        likesView.toggleLikeBtn(false);
        // Remove from UI
        likesView.deleteLike(currentID); 
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes()); 
}

// Restoring liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes(); 
    // Restore likes
    state.likes.readStorage(); 
    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes()); 
    // Rendering the existing likes 
    state.likes.likes.forEach(like => likesView.renderLike(like)); 
} )

// window.addEventListener('load', () => {
//     state.recipe = new Recipe(); 
//     // Restore likes
//     state.recipe.readStorageRecipe(); 
//     // Toggle like menu button
//     //recipeView.toggleLikeMenu(state.likes.getNumLikes()); 
//     // Rendering the existing likes 
//     state.recipe.recipe.forEach(recipe => recipeView.renderRecipe(recipe));
//     //.forEach(like => likesView.renderLike(like)); 
// } )




// Handling recipe button clicks 

// Should not used closest here instead use matches b/c unlike the other one where we can store in one parent element
// we need to select multiple elements here 
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
         //Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});
 
