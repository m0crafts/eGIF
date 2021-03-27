class UI {
	constructor() {
		this.pageCount = 0;
		this.dataDir = 'prev';
		this.defaultImage = './img/default-image.png';
		this._pages = 0;
		this.toggleBackground = function (element, status) {
			if (status === 0) {
				element.style.backgroundColor = 'rgb(87, 87, 87)';
				element.style.opacity = 0.8;
				element.style.cursor = 'no-drop';
				element.style.pointerEvents = 'none';
			} else if (status === 1) {
				element.style.opacity = 1;
				element.style.cursor = 'pointer';
				element.style.pointerEvents = 'all';
				element.style.backgroundColor = 'rgb(218, 165, 32)';
			}
		};
		// this.gifIds = [];
	}
	showGifs(gifs, string) {
		let output = '';
		let username = '';
		let avatar = '';

		gifs.forEach(function (gif) {
			const uri = gif.images.original.webp;

			if (gif.username !== '') {
				username = gif.user.display_name;
				if (username.length >= 18) {
					username = username.substring(0, 18);
					username += '...';
				}

				avatar = gif.user.avatar_url;
			} else {
				username = 'Some User';
				avatar = './img/default-image.png';
			}
			// if (!_.includes(gifIds, gif.id) && gif.uri !== '') {
			// this.gifIds.push(gif.id);
			output = output.concat(`
		<a href="gif.html?id=${gif.id}">
      <figure data-id="${gif.id}" data-views="" class="gif">
				<img src="${uri}" alt=""/>
				
				<div class="overlay">
					<div class="gif-cap">
						<img src="${avatar}" />
						<p>${username}</p>
					</div>
				</div>
      </figure>
		</a>`);
		});
		// console.log(gifIds);
		// Output gifs
		if (string === 'index') {
			document.getElementById('gifs').innerHTML += output;
		} else if (string === 'search') {
			document.getElementById('searched-gifs').innerHTML += output;
		} else if (string === 'gif') {
			document.getElementById('related-gif-list').innerHTML += output;
		}
	}

	loadGIFPage(allData) {
		let username = '';
		let avatar = '';
		let profileURL = '';
		const utilities = new Utilities();

		const gifContainer = document.getElementById('gif-section');
		const gifTitle = allData.data.title;
		const gifSrc = allData.data.images.original.webp;
		const gifSize = parseFloat(allData.data.images.original.webp_size / 1000)
			.toFixed(2)
			.toString();
		console.log(allData);
		const gifWidth = allData.data.images.original.width;
		const gifHeight = allData.data.images.original.height;
		const gifCreateTime = allData.data.import_datetime;
		const gifFrames = allData.data.images.original.frames;
		const gifUploader = allData.data.user;
		const gifID = allData.data.id;
		let viewsCount =
			localStorage.getItem(gifID) !== null ? JSON.parse(localStorage.getItem(gifID)) : 0;
		console.log(viewsCount);

		const gifShortURL = allData.data.bitly_url;
		const urlEncoded = encodeURIComponent(gifShortURL);
		const titleEncoded = encodeURIComponent(gifTitle);
		if (allData.data.username !== '') {
			username = gifUploader.display_name;

			profileURL = gifUploader.profile_url;

			avatar = gifUploader.avatar_url;
		} else {
			username = 'Some User';
			avatar = this.defaultImage;
		}
		let output = `
		
					<!-- Title -->
					<h2 class="gif-title">${gifTitle}</h2>
					<!-- GIF -->
					<div class="view-container">
						<img 
							style="width:${gifWidth}px; height:${gifHeight}px;"
							src="${gifSrc}"
							alt=""
						/>
					</div>
					<div class="gif-details-container">
						<div class="gif-actions">
							<div class="profile-info">
								<a href="${profileURL}">
									<img
										src="${avatar}"
										alt=""
									/>
								</a>
								<a href="${profileURL}">${username}</a>
							</div>
							<div class="controls">
								<a id='download-link'>
									<i class="fas fa-download"></i>
								</a>
							</div>
						</div>
						<div class='big-flexer'>
							<div class="share-buttons">
								<a id="facebook-btn" href="https://www.facebook.com/sharer.php?u=${urlEncoded}" target='_blank' class="share-button"><i class="fab fa-facebook-square fa-2x"></i></a>
								<a id="twitter-btn" target='_blank' href="https://twitter.com/intent/tweet?url=${urlEncoded}&text=${titleEncoded}" class="share-button"><i class="fab fa-twitter-square fa-2x"></i></a>
								<a id="reddit-btn" target='_blank' href="https://www.reddit.com/submit?url=${urlEncoded}&amp;title=${titleEncoded}&amp;video_poster_url=${urlEncoded}" class="share-button"><i class="fab fa-reddit-square fa-2x"></i></a>
								<a id="tumblr-btn" target='_blank' href="http://tumblr.com/widgets/share/tool?canonicalUrl=${urlEncoded}" class="share-button"><i class="fab fa-tumblr-square fa-2x"></i></a>
								<span id="copy-btn" class="copy-button-container">
									<div class="Tooltip"><span id="popup-text" class="content">Copy link to clipboard.</span></div>
									<img src="https://tenor.com/assets/img/icons/link.svg" alt="" />
								</span>
							</div>
							<div id="views-container">
								<i class="fas fa-eye"></i>
								<span id="views-count" >&nbsp;${viewsCount}&nbsp;Views</span>
								</div>
						</div>
						<div class="gif-details">
							<h3>Details</h3>
							<dl>
								<dd>File Size:&nbsp;${gifSize}KB</dd>
								<dd>Frames:&nbsp;${gifFrames}</dd>
								<dd>Dimensions:&nbsp;${gifWidth}x${gifHeight}</dd>
								<dd>Created:&nbsp;${gifCreateTime}</dd>
							</dl>
						</div>
					</div>
		
		`;
		viewsCount++;
		localStorage.setItem(gifID, viewsCount);
		let relatedOutput = [];
		let totalHeight = 0;
		console.log(allData);
		let i = 0;
		// get related gifs using the current gif name
		giphy.getGifs(gifTitle, 0, 100).then((gifs) => {
			gifs.data.forEach((gif) => {
				i++;
				const gifHeight = parseInt(gif.images.original.height);
				if (
					gif.id !== gifID &&
					totalHeight < 1200 &&
					gifHeight + totalHeight < 1200 &&
					gif.username !== '' &&
					gifHeight <= 1000
				) {
					relatedOutput.push(gif);
					totalHeight += gifHeight;
				}
			});

			this.showGifs(relatedOutput, 'gif');

			console.log(relatedOutput);
			console.log(totalHeight);
		});
		gifContainer.innerHTML = output;
		const elDownloadBtn = document.getElementById('download-link');
		elDownloadBtn.onclick = function () {
			utilities.saveFile(gifSrc, gifTitle);
		};

		const copyToClipboard = document.getElementById('copy-btn');
		copyToClipboard.onclick = function () {
			const popup = document.getElementById('popup-text');
			popup.style.color = 'green';
			popup.innerText = 'Copied to clipboard!';
			setTimeout(() => {
				popup.style.color = '#2b2b2b';
				popup.innerText = 'Copy link to clipboard.';
			}, 1000);

			utilities.copyToClipboard(gifShortURL);
		};
		username = '';
		avatar = '';
		profileURL = '';
	}

	loadSearchPage(data, queryString) {
		console.log(data);
		const gifs = data.data;
		let users = [];

		let output = [];
		let pages = [];
		let verifiedUsers = [];
		const totalGifs = data.pagination.total_count;
		const elNumberOfGifs = document.getElementById('number-display');
		elNumberOfGifs.setAttribute('data-gif-count', totalGifs);
		const elQueryString = document.getElementById('search-display');
		const queryWords = queryString.split('-');
		let finalString = '';
		queryWords.forEach((word) => {
			finalString += word + ' ';
		});
		finalString = finalString.trim();
		elQueryString.innerText = finalString;
		const elNumberOfChannels = document.getElementById('number-of-channels');

		gifs.forEach((gif) => {
			if (gif.username !== '') {
				users.push(gif.user);

				if (gif.user.is_verified) {
					verifiedUsers.push(gif.user);
				}
			}
		});
		const elChannelsContainer = document.getElementById('channels-container');

		const uniqueUsersArr = _.uniqBy(users, 'username');
		const uniqueVerifiedUsersArr = _.uniqBy(verifiedUsers, 'username');
		elNumberOfChannels.setAttribute('data-channel-count', uniqueVerifiedUsersArr.length);
		const elVerifiedIcon = `<div id="verified-icon" class="verified-icon"><svg viewBox="-1 0 18 18" version="1.1"><g  stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g  transform="translate(-324.000000\, -132.000000)" fill="#15CDFF"><g id="Group-3" transform="translate(323.000000\, 132.000000)"><polygon points="8.95093746 16.1755971 6.18494567 16.8455287 4.34519872 14.6949378 1.70947694 13.628319 1.49869564 10.8185214 2.85993451e-13 8.42276436 1.49869564 6.02700728 1.70947694 3.21720971 4.34519872 2.1505909 6.18494567 4.92383911e-14 8.95093746 0.669931593 11.7169293 4.82947016e-14 13.5566762 2.1505909 16.192398 3.21720971 16.4031793 6.02700728 17.9018749 8.42276436 16.4031793 10.8185214 16.192398 13.628319 13.5566762 14.6949378 11.7169293 16.8455287"	></polygon><path d="M9.32727273\,9.44126709 L9.32727273\,3.03016561 L6.55027155\,3.03016561 L6.55027155\,10.8150746 L6.55027155\,12.188882 L12.1042739\,12.188882 L12.1042739\,9.44126709 L9.32727273\,9.44126709 Z" fill="#121212" transform="translate(9.327273\, 7.609524) scale(-1\, 1) rotate(-45.000000) translate(-9.327273\, -7.609524) " ></path></g></g></g></svg></div>`;
		const totalPageCount = Math.ceil(uniqueVerifiedUsersArr.length / 4);
		this.pageCount = totalPageCount;

		// console.log(pageAttr);
		const carouselBtns = document.getElementById('carousel-buttons');
		// let dataDir = carouselBtns.getAttribute('data-dir');
		carouselBtns.setAttribute('data-total', this.pageCount);
		if (totalPageCount > 1) {
			carouselBtns.style.display = 'flex';
		} else {
			carouselBtns.style.display = 'none';
		}

		uniqueVerifiedUsersArr.forEach((user) => {
			const channel = `<div class="channel"><div class="profile-img"><a><img src="${
				user.avatar_url ? user.avatar_url : this.defaultImage
			}"/></a></div><div class="channel-details"><a href="" class="channel-display-name">${
				user.username
			}</a><div class="channel-username"><a href="${user.profile_url}">@${user.username}</a>${
				user.is_verified ? elVerifiedIcon : ``
			}</div></div></div>`;

			output.push(channel);
		});

		pages = _.chunk(output, 4);
		// console.log(pages.length);
		this._pages = pages;
		const elPrevBtn = document.querySelector('#prev-btn');
		const elNextBtn = document.querySelector('#next-btn');
		this.toggleBackground(elPrevBtn, 0);
		document.querySelector('#prev-btn').disabled = true;
		this.toggleBackground(elNextBtn, 1);
		document.querySelector('#next-btn').disabled = false;

		elChannelsContainer.setAttribute('data-page', 0);
		console.log();
		if (pages.length) {
			elChannelsContainer.innerHTML = pages[0].join('');
		}

		// Show gifs

		this.showGifs(gifs, 'search');
	}

	getPrev(currentPos) {
		const elChannelsContainer = document.getElementById('channels-container');
		const elPrevBtn = document.querySelector('#prev-btn');
		const elNextBtn = document.querySelector('#next-btn');
		this.toggleBackground(elNextBtn, 1);
		elNextBtn.disabled = false;
		// Start position
		if (currentPos === 0) {
			this.toggleBackground(elPrevBtn, 0);
			elPrevBtn.disabled = true;
		} else {
			currentPos--;
			this.toggleBackground(elPrevBtn, 1);
			elPrevBtn.disabled = false;
			elChannelsContainer.innerHTML = this._pages[currentPos].join('');
		}
		// console.log(this.pageCount);
		elChannelsContainer.setAttribute('data-page', currentPos);
		console.log('Page count', this.pageCount);
		console.log('Current position ', currentPos);
		return currentPos;
	}

	getNext(currentPos) {
		const elChannelsContainer = document.getElementById('channels-container');
		const elPrevBtn = document.querySelector('#prev-btn');
		const elNextBtn = document.querySelector('#next-btn');
		// End position
		this.toggleBackground(elPrevBtn, 1);
		elPrevBtn.disabled = false;
		if (currentPos === this.pageCount - 1) {
			this.toggleBackground(elNextBtn, 0);
			elNextBtn.disabled = true;
		} else {
			currentPos++;
			// this.toggleBackground(elNextBtn, 1);
			// elNextBtn.disabled = false;

			elChannelsContainer.innerHTML = this._pages[currentPos].join('');
		}
		elChannelsContainer.setAttribute('data-page', currentPos);
		// console.log(this.pageCount);
		console.log('Page count', this.pageCount);
		console.log('Current position ', currentPos);
		return currentPos;
	}

	hideLoader() {
		document.getElementById('loader').style.display = 'none';
	}

	showLoader() {
		document.getElementById('loader').style.display = 'flex';
	}
}
