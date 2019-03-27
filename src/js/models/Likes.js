export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like); 
        this.persistData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id ===id);
        this.likes.splice(index,1); 
        this.persistData();
    }
    // useful for the display to see if it's already liked; and to unlike from it if wanted 
    isLiked(id){ 
        return this.likes.findIndex (el => el.id ===id ) !== -1;
    }

    getNumLikes () {
        return this.likes.length; 
    }

    persistData () {
        localStorage.setItem('likes', JSON.stringify(this.likes)); 
    }
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes')); // this will return null if there is no likes
        if (storage) this.likes = storage;  // restore likes from the localStorage 
    }
}
