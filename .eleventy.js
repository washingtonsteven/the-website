const pluginTOC = require("eleventy-plugin-toc");
const markdownItAnchor = require("markdown-it-anchor");
const markdownIt = require("markdown-it");
const fs = require("fs");
const path = require("path");

const isDev = Boolean(process.env.NODE_ENV === "development");

module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy("assets"); // css, js, fonts
	eleventyConfig.addPassthroughCopy("things"); // random things
	eleventyConfig.addPassthroughCopy("blog/images"); // blog images
	eleventyConfig.addCollection("posts", function (collectionApi) {
		const postsCollection = collectionApi
			.getFilteredByGlob("blog/**/*.md")
			.filter((item) => {
				return isDev || !item.data.draft;
			})
			.sort((a, b) => {
				return (
					new Date(b.data.date).getTime() -
					new Date(a.data.date).getTime()
				);
			});
		return postsCollection;
	});
	eleventyConfig.addFilter("prettydate", function (value) {
		let theDate = value;
		if (!(value instanceof Date)) {
			theDate = new Date(value);
		}

		return theDate.toLocaleDateString();
	});

	eleventyConfig.setLibrary(
		"md",
		markdownIt({ html: true }).use(markdownItAnchor)
	);
	eleventyConfig.addPlugin(pluginTOC);

	eleventyConfig.addGlobalData(
		"buster",
		Math.floor(Math.random() * new Date().getTime())
	);

	const formatFile = path.resolve(
		__dirname,
		"things/explorer-format/format.js"
	);
	if (fs.existsSync(formatFile)) {
		const stats = fs.statSync(formatFile);
		if (stats && stats.size) {
			const sizeInMB = stats.size / Math.pow(1024, 2);
			eleventyConfig.addGlobalData(
				"explorerFormatSize",
				`${sizeInMB.toFixed(2)}MB`
			);
		}
	}
};
