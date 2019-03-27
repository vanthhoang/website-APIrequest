# website-APIrequest

Some requirements for creating this website: 

1. Need to get an API key. The website is hiting a food API called http://food2folk.com/. The free subscription allows 50 hits/day.
2. In order to fix the proxy issue with CORS, need to add https://cors-anywhere.herokuapp.com/ infront of the request. This solution works but sometimes there might be an issue when cors-anywhere is down (e.g. service unavailable 503 error). To fix this, you need to create and deloy your own proxy and deloy it to Heroku. In general it's better to create your own proxy so you don't have to worry about it.

Here is the step to creating your own proxy server: 
1. git clone https://github.com/Rob--W/cors-anywhere.git
2. cd cors-anywhere/
3. npm install
4. heroku create (here need to create an account with heroku on its website and have heroku intstalled (brew install           heroku))
5. git push heroku master 
-> The result should be something like this: https://damp-brook-63821.herokuapp.com/ | https://git.heroku.com/damp-brook-6382

