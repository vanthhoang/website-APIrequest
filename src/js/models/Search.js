
import axios from 'axios'; 
import {key, proxyFix} from '../config';

export default class Search {
    constructor(query) {
        this.query = query; 
    }
    
    async getResults(query) {
        try {
        // Doing ajax call here. This will return a promise 
        const results = await axios(`${proxyFix}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`); 
        this.res = results.data.recipes;
        //console.log(this.res);
    } catch (error) {
            alert(error); 
        }
    }
}
