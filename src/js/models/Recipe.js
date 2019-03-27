
import axios from 'axios';
import {key, proxyFix} from '../config';

export default class Recipe {
    constructor (id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            //const result = await axios(`${proxyFix}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`); 
            const res = await axios(`${proxyFix}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert('Something went wrong :('); 
        }
    }
    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients () {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];  // destructuring the unitsShort and separate it into its own components 

        const newIngredients = this.ingredients.map( el => {
            // Making uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach ((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]); 
            });  
            // Removing parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); 
            // Parsing ingredients into count, unit, and ingredients 
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(elemt => units.includes(elemt)); // find the index that has the unit part 
            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                const arrCount = arrIng.slice(0, unitIndex);    // Ex: 5 1/2 cups, arrCount is [5, 1/2] 
                let count; 
                if (arrCount.length ===1) {
                    count = eval(arrIng[0].replace('-', '+')); // doing eval here for the case of unit 1-1/3  
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));     // eval would do this: eval("5 + 1/2") -> 5.5 
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit but 1st element is a number (base 10)
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '', 
                    ingredient: arrIng.slice(1).join(' ') // the rest except the first index but is the count, so start at position 1 to the end
                }
            }
            else if (unitIndex === -1) {
                // There is no unit and no number in the 1st position 
                objIng = {
                    count: 1,    // e.g. if we need tomato but no unit, put 1 in front 
                    unit: '',
                    ingredient
                }
            }
            return objIng; 

        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }

    // persistDataRecipe () {
    //     localStorage.setItem('recipe', JSON.stringify(this.recipe)); 
    // }
    // readStorageRecipe() {
    //     const storage = JSON.parse(localStorage.getItem('recipe')); // this will return null if there is no likes
    //     if (storage) this.recipe = storage;  // restore likes from the localStorage 
    // }
}
