var globalMovieList = [];
var globalFavMovieList = [];
var errorMsg = `Movie is already added to favourites`;
var movieAPI_url = 'http://localhost:3000/movies';
var favuoriteAPI_url = 'http://localhost:3000/favourites';

function getMovies() {

	let movieDataPromise = fetch(movieAPI_url, {
		method: 'get'
	}).then(response => response.json());

	movieDataPromise
		.then(parseListOfAllMovies)
		.catch(parseError);

	return movieDataPromise;
}

function parseError(error) {
	//console.log('Error occured');
	console.log(error.message);
}

function parseListOfAllMovies(listOfMovies) {

	if (Array.isArray(listOfMovies)) {

		globalMovieList = [];
		globalMovieList = listOfMovies;

		listOfMovies.forEach(element => {

			let innerContent = `
				<li id='${element.id}'>
					<span>${element.title}</span>
					<button id='addMovieButton' type='button' class='btn btn-link' onclick="addFavourite(${element.id})">
						Add to Fav
					</button>
				</li>
			`;

			document.getElementById('moviesList').innerHTML += innerContent;
		})
	}
}

function getFavourites() {

	let favDataPromise = fetch(favuoriteAPI_url, {
		method: 'get'
	}).then(response => response.json());

	favDataPromise
		.then(parseListOfAllFavourites)
		.catch(parseError);

	return favDataPromise;

}

function parseListOfAllFavourites(listOfFavs) {

	document.getElementById('favouritesList').innerHTML = '';
	globalFavMovieList = [];

	if (Array.isArray(listOfFavs)) {
		//console.log(`get all favs - count - ${listOfFavs.length}`);
		listOfFavs.forEach(element => {
			//console.log(`movie id in fav - ${element.id} and Name - ${element.title}`)
			globalFavMovieList.push(element);
		})
	}

	displayFavourites();
}

function displayFavourites() {

	document.getElementById('favouritesList').innerHTML = '';
	if (Array.isArray(globalFavMovieList)) {
		globalFavMovieList.forEach(element => {

			let innerContent = `
				<li id='${element.id}'>
					<span>${element.title}</span>
					<button id='removeMovieButton' type='button' class='btn btn-link' value='${element.id}'>Remove</button>
				</li>
			`;

			document.getElementById('favouritesList').innerHTML += innerContent;
		})
	}
}

function addFavourite(movieID) {
	//console.log(`Movie ID = ${movieID}`);

	let selectedMovie;

	if (movieID) {
		selectedMovie = globalMovieList.find(element => {
			return element.id === movieID;
		});

		// if (selectedMovie) {
		// 	console.log(`adding movie to fav`)
		// 	console.log(selectedMovie.id)
		// }
	}

	// fetch(`${favuoriteAPI_url}/?id=${movieID}`,{
	// 	method : 'GET'
	// })
	// .then(response => response.json())
	// .then((favData) => {console.log('getfavdata');console.log(favData)})
	// .catch(parseError);

	let isAlreadyPresent = false;

	if (globalFavMovieList) {
		let foundElement = globalFavMovieList.find(element => {
			return element.id === movieID;
		});

		if (foundElement) {
			isAlreadyPresent = true;
		}

	}

	if (isAlreadyPresent) {
		return Promise.reject(new Error(errorMsg));
	}

	let favDataAddPromise = fetch(favuoriteAPI_url, {
		mode: 'cors',
		method: 'POST',
		body: JSON.stringify(selectedMovie),
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((favItem) => {

			globalFavMovieList.push(favItem);
			displayFavourites();
			return globalFavMovieList;
		})
		.catch((error) => {
			console.log(errorMsg);
			Promise.reject(new Error(errorMsg));
		});

	return favDataAddPromise;
}

module.exports = {
	getMovies,
	getFavourites,
	addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution
