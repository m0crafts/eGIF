const giphy = new Giphy();
const ui = new UI();
const currentActivePage = window.location.pathname;
let offset = 0;
let receivedIds = [];
let clickedGifID = null;
let removedDups = [];
window.pageCheck = (function () {
	if (currentActivePage === '/dist/index.html') {
		ui.showLoader();
		setTimeout(() => {
			try {
				const response = giphy.getTrendingGifs(0);
				response.then((data) => {
					data.data.forEach((gif) => {
						receivedIds.push(gif.id);
					});
					ui.showGifs(data.data);
				});
			} catch (error) {
				console.log(error);
			} finally {
				ui.hideLoader();
			}
		}, 1500);
	} else if (currentActivePage === '/dist//gif.html') {
		clickedGifID = window.location.search.split('?id=')[1];

		giphy
			.getGifData(clickedGifID)
			.then((val) => {
				ui.loadGIFPage(val);
			})
			.catch((err) => {
				console.log(err);
			});
	}
})();

document.addEventListener('click', clickEvent);
window.addEventListener('scroll', _.throttle(callback, 1500), {
	passive: true,
});
function clickEvent(e) {
	// e.preventDefault();
	if (e.target.classList.contains('gif')) {
		const gifID = e.target.getAttribute('data-id');
		console.log(gifID);
		window.open(`/dist/gif.html?id=${gifID}`, '_self');
	} else {
		console.log(e.target);
	}
}

function callback() {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

	if (scrollTop + clientHeight >= scrollHeight - 5) {
		ui.showLoader();
		offset += 10;
		setTimeout(() => {
			try {
				const response = giphy.getTrendingGifs(offset);
				response.then((data) => {
					const gifs = data.data;
					gifs.forEach((gif, index) => {
						if (receivedIds.includes(gif.id)) {
							gifs.splice(index, 1);
						}
						receivedIds.push(gif.id);
					});
					console.log(gifs);
					console.log('IDs Count:', receivedIds.length);
					ui.showGifs(gifs);
				});
			} catch (error) {
				console.log(error);
			} finally {
				ui.hideLoader();
			}
		}, 1500);
	}
}
