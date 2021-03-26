const giphy = new Giphy();
const ui = new UI();

const currentActivePage = window.location.pathname;
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const carouselBtns = document.getElementById('carousel-buttons');
let dataPageAttr = 0;
let offset = 0;
let receivedIds = [];
let clickedGifID = null;
let query = null;
let elChannelsContainer;

window.pageCheck = (function () {
	if (currentActivePage === '/dist/index.html' || currentActivePage === '/') {
		ui.showLoader();
		let newOutput = [];
		setTimeout(() => {
			try {
				const response = giphy.getTrendingGifs(0);
				response.then((data) => {
					data.data.forEach((gif, index) => {
						if (!_.includes(receivedIds, gif.id) && gif.uri !== '') {
							receivedIds.push(gif.id);
							newOutput.push(gif);
						}
					});
					ui.showGifs(newOutput, 'index');
				});
			} catch (error) {
				console.log(error);
			} finally {
				ui.hideLoader();
			}
		}, 1500);
	} else if (currentActivePage === '/dist/gif.html' || currentActivePage === '/gif.html') {
		clickedGifID = window.location.search.split('?id=')[1];

		giphy
			.getGifData(clickedGifID)
			.then((val) => {
				ui.loadGIFPage(val);
			})
			.catch((err) => {
				console.log(err);
			});
	} else if (currentActivePage === '/dist/search.html' || currentActivePage === '/search.html') {
		elChannelsContainer = document.getElementById('channels-container');
		dataPageAttr = elChannelsContainer.getAttribute('data-page');
		query = window.location.search.split('?q=')[1];
		// console.log(query);
		if (query !== null && query !== undefined) {
			try {
				const response = giphy.getGifs(query, 0);
				response.then((gifs) => {
					ui.loadSearchPage(gifs, query);
				});
			} catch (error) {
				console.log(error);
			}
		} else {
			window.open(`/dist/index.html`, '_self');
		}
	}
})();

document.addEventListener('click', clickEvent);
// document.addEventListener('keypress', )
window.addEventListener('scroll', _.throttle(callback, 1500), {
	passive: true,
});

function clickEvent(e) {
	// e.preventDefault();
	if (e.target.classList.contains('gif')) {
		const gifID = e.target.getAttribute('data-id');
		console.log(gifID);
		window.open(`/gif.html?id=${gifID}`, '_self');
	} else if (e.target.id === 'search-btn') {
		const query = searchInput.value.trim();

		if (query !== '') {
			const queryWords = _.words(query);
			let finalString = '';
			queryWords.forEach((word) => {
				finalString += word + '-';
			});
			finalString = _.trimEnd(finalString, '-');
			console.warn(finalString);
			window.open(`/search.html?q=${finalString}`, '_self');
		} else {
			//Load home page
			window.open(`/index.html`, '_self');
		}
	} else if (e.target.id === 'prev-btn') {
		dataPageAttr = elChannelsContainer.getAttribute('data-page');
		const newPageAttr = ui.getPrev(parseInt(dataPageAttr));
		elChannelsContainer.setAttribute('data-page', newPageAttr);
		ui.toggleBackground(e.target, newPageAttr ? 1 : 0);
		console.warn(newPageAttr);
	} else if (e.target.id === 'next-btn') {
		dataPageAttr = elChannelsContainer.getAttribute('data-page');
		const newPageAttr = ui.getNext(parseInt(dataPageAttr));
		elChannelsContainer.setAttribute('data-page', newPageAttr);
		const dataTotal = carouselBtns.getAttribute('data-total');
		ui.toggleBackground(e.target, newPageAttr === dataTotal - 1 ? 0 : 1);
	}
}

function callback() {
	if (currentActivePage === '/dist/index.html' || currentActivePage === '/') {
		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

		if (scrollTop + clientHeight >= scrollHeight - 20) {
			ui.showLoader();
			let newOutput = [];
			offset += 25;
			setTimeout(() => {
				try {
					const response = giphy.getTrendingGifs(offset);
					response.then((data) => {
						const gifs = data.data;
						gifs.forEach((gif, index) => {
							if (!_.includes(receivedIds, gif.id) && gif.uri !== '') {
								receivedIds.push(gif.id);
								newOutput.push(gif);
							}
						});
						console.log(gifs);
						console.log('IDs Count:', receivedIds.length);
						ui.showGifs(newOutput, 'index');
					});
				} catch (error) {
					console.log(error);
				} finally {
					ui.hideLoader();
				}
			}, 1500);
		}
	} else if (currentActivePage === '/dist/search.html' || currentActivePage === '/search.html') {
		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

		if (scrollTop + clientHeight >= scrollHeight - 5) {
			ui.showLoader();
			offset += 50;
			let newOutput = [];
			setTimeout(() => {
				try {
					const response = giphy.getGifs(query, offset);
					response.then((data) => {
						const gifs = data.data;
						gifs.forEach((gif, index) => {
							if (!_.includes(receivedIds, gif.id) && gif.uri !== '') {
								receivedIds.push(gif.id);
								newOutput.push(gif);
							}
						});

						console.log(newOutput);
						console.log('IDs Count:', receivedIds.length);
						ui.showGifs(newOutput, 'search');
					});
				} catch (error) {
					console.log(error);
				} finally {
					ui.hideLoader();
				}
			}, 1500);
		}
	}
}
