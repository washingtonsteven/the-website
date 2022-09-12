module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("things/**/*.{css,js}");
	eleventyConfig.addCollection("posts", function(collectionApi) {
		const postsCollection = collectionApi.getFilteredByGlob("blog/**/*.md").filter((item) => {
			return !item.data.draft;
		});
		console.log(postsCollection);
		return postsCollection;
	});
}