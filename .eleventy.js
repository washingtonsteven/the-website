module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("things/**/*.{css,js}");
}