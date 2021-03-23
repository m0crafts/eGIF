class Giphy {
	constructor() {
		this.key = 'm4zkfIxMn0AzwPvD6tcIhkVCdJjzUGY6';
		this.limit = 10;
		this.rating = 'g';
	}

	async getTrendingGifs(offset) {
		const response = await fetch(
			`https://api.giphy.com/v1/gifs/trending?api_key=${this.key}&limit=${this.limit}&rating=${this.rating}&offset=${offset}`,
		);
		return response.json();
	}

	async getGifData(id) {
		const gifData = await fetch(`https://api.giphy.com/v1/gifs/${id}?api_key=${this.key}`);
		return gifData.json();
	}

	// hasMoreGifs(page, total) {
	// 	const startIndex = (page - 1) * this.limit + 1;
	// 	return total === 0 || startIndex < total;
	// }
}
