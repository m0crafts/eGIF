class Utilities {
	// saveFile(url, filename) {
	// 	console.log(url);
	// 	var xhr = new XMLHttpRequest();
	// 	xhr.responseType = 'blob';
	// 	xhr.onload = function () {
	// 		var a = document.getElementById('download-link');
	// 		a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
	// 		a.download = filename; // Set the file name.
	// 	};
	// 	xhr.open('GET', url);
	// 	xhr.send();
	// }
	constructor() {}
	async saveFile(url, filename) {
		await fetch(url)
			.then((result) => result.blob())
			.then((blob) => {
				const a = document.createElement('a');
				a.href = window.URL.createObjectURL(blob); // xhr.response is a blob
				a.download = filename; // Set the file name.
				a.click();
			})

			.catch((err) => {
				console.log(err);
			});
	}

	copyToClipboard(value) {
		var tempInput = document.createElement('input');
		tempInput.value = value;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand('copy');
		document.body.removeChild(tempInput);
	}
}
