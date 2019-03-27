
export const proxyFix = 'https://damp-brook-63821.herokuapp.com/';
//const proxyFix = 'https://cors-anywhere.herokuapp.com/'; 
export const key = 'cf543e5616dc6106a95414f5fa4abe64'; // primary
//export const key = '3fea10d007873159ccfaf53f932f74c8';  // backup cuz of 50 calls limit per day


// When cors-anywhere is down (e.g. service unavailable 503 error), you need to create and deloy your own proxy and deloy it to Heroku 
// In general it's better to create your own proxy so you don't have to worry ab it