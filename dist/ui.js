class UI {
	showGifs(gifs) {
		let output = '';
		let username = '';
		let avatar = '';
		const defaultImage = '../img/default-image.png';
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
				avatar = defaultImage;
			}
			output += `
		<a href="gif.html?id=${gif.id}">
      <figure data-id="${gif.id}" class="gif">
				<img src="${uri}" alt=""/>
				
				<div class="overlay">
					<div class="gif-cap">
						<img src="${avatar}" />
						<p>${username}</p>
					</div>
				</div>
      </figure>
		</a>`;
		});

		// Output gifs
		document.getElementById('gifs').innerHTML += output;
	}

	loadGIFPage(allData) {
		let username = '';
		let avatar = '';
		let profileURL = '';
		const utilities = new Utilities();
		const defaultImage = './img/default-image.png';
		const gifContainer = document.getElementById('gif-section');
		const gifTitle = allData.data.title;
		const gifSrc = allData.data.images.original.webp;
		const gifSize = parseFloat(allData.data.images.original.webp_size / 1000)
			.toFixed(2)
			.toString();

		const gifWidth = allData.data.images.original.width;
		const gifHeight = allData.data.images.original.height;
		const gifCreateTime = allData.data.import_datetime;
		const gifFrames = allData.data.images.original.frames;
		const gifUploader = allData.data.user;
		const gifID = allData.data.id;
		const gifShortURL = allData.data.bitly_url;
		const urlEncoded = encodeURIComponent(gifShortURL);
		const titleEncoded = encodeURIComponent(gifTitle);
		if (allData.data.username !== '') {
			username = gifUploader.display_name;

			profileURL = gifUploader.profile_url;

			avatar = gifUploader.avatar_url;
		} else {
			username = 'Some User';
			avatar = defaultImage;
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

		console.log(allData);
		gifContainer.innerHTML = output;
		document.getElementById('download-link').onclick = function () {
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
	hideLoader() {
		document.getElementById('loader').style.display = 'none';
	}

	showLoader() {
		document.getElementById('loader').style.display = 'flex';
		console.log('added');
	}
}
