class Giphy {
	constructor() {
		this.key = 'm4zkfIxMn0AzwPvD6tcIhkVCdJjzUGY6';
		this.limit = 25;
		this.rating = 'g';
		this.lang = 'en';
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

	async getGifs(query, offset, limit) {
		const res = await fetch(
			`https://api.giphy.com/v1/gifs/search?api_key=${this.key}&q=${query}&limit=${limit}&offset=${offset}&rating=${this.rating}&lang=${this.lang}`,
		);
		return res.json();
	}
}
