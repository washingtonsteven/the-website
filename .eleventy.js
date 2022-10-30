
const pluginTOC = require('eleventy-plugin-toc');
const markdownItAnchor = require("markdown-it-anchor");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("things/**/*.{css,js,png,jpg,gif,svg}");
	eleventyConfig.addPassthroughCopy("blog/**/*.{png,jpg,gif,svg}");
	eleventyConfig.addCollection("posts", function(collectionApi) {
		const postsCollection = collectionApi.getFilteredByGlob("blog/**/*.md").filter((item) => {
			return !item.data.draft;
		}).sort((a, b) => {
			return (new Date(b.data.date).getTime()) - (new Date(a.data.date).getTime());
		});
		return postsCollection;
	});
	eleventyConfig.addFilter("prettydate", function(value) {
		let theDate = value;
		if (!(value instanceof Date)) {
			theDate = new Date(value);
		}

		return theDate.toLocaleDateString();
	});

	eleventyConfig.setLibrary("md", markdownIt({ html: true }).use(markdownItAnchor));
	eleventyConfig.addPlugin(pluginTOC);
}