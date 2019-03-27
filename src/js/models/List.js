
import uniqid from 'uniqid'; 

export default class List {
    constructor () {
        this.items = [];
    }
    // For each item we need to have an unique ID for them so that we can identify them later when we need to update or delete them
    // Include a small library that will create unique IDs for us -> uniqid 
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count, 
            unit, 
            ingredient
        }
        this.items.push(item); 
        return item;
    }
    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id); 
        this.items.splice(index, 1)         
        // Splice: passing in a start index and then how many positions we want to take; this mutates original array
        // vs slice: passing start and end index ; this doesn't mutate the original array 
        // Ex: [1,2,3] splice(1,2) will return [2,3], and original array is [1]
        // Ex: [1,2,3] slice(1,2) will return 2, but original array is [1,2,3]
    }
    updateCount (id, newCount) {
        this.items.find(el => el.id).count= newCount;
    }
}

