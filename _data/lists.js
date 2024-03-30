module.exports = function (configData) {
	const explorerFormatSize = configData.explorerFormatSize;

	const stuffList = {
		title: "stuff i made",
		items: [
			{
				name: "explorer format",
				tags: ["writing", "interactive-fiction", "game-dev"],
				desc: "custom twine story format for a future version of starchaser",
				links: [
					{
						title: `format file${
							explorerFormatSize ? ` (${explorerFormatSize})` : ""
						}`,
						link: "/things/explorer-format/format.js",
					},
					{
						title: "source",
						link: "https://github.com/washingtonsteven/explorer-format",
					},
				],
			},
			{
				name: "starchaser",
				tags: ["writing", "twine", "game-dev"],
				desc: "a game/story/universe built around discovering ancient galactic secrets. something will be released soon.",
			},
			{
				name: "genmo (v2)",
				tags: ["writing", "js"],
				desc: "js framework for programatically navigating a Twine story",
				links: [
					{
						title: "source",
						link: "https://github.com/washingtonsteven/genmo-v2",
					},
					{
						title: "demo (genmo-view)",
						link: "https://genmo-game-test.netlify.app/",
					},
				],
			},
			{
				name: "for the mania",
				tags: ["animation", "web-toy"],
				desc: "sonic mania title screen generator (cw: demo has <strong>flashing colors</strong> that animate over the whole screen)",
				links: [
					{
						title: "source (glitch.com)",
						link: "https://glitch.com/edit/#!/for-the-mania",
						external: true,
					},
					{ title: "demo", link: "/things/for-the-mania" },
				],
			},
			{
				name: "react-vn",
				tags: ["writing", "interactive-fiction"],
				desc: "react-based interactive fiction player/authoring tool",
				links: [
					{
						title: "source",
						link: "https://github.com/washingtonsteven/react-vn",
					},
					{ title: "demo", link: "https://react-vn.netlify.app" },
				],
			},
			{
				name: "demandpad",
				tags: ["tool"],
				desc: "quick notetaking using localStorage",
				links: [
					{
						title: "source",
						link: "https://github.com/washingtonsteven/demandpad",
					},
					{
						title: "demo",
						link: "https://relaxed-torvalds-97ac55.netlify.app/",
					},
				],
			},
			{
				name: "pabo (place, action, being, object)",
				tags: ["writing", "story-generation"],
				desc: 'not-smart toy that strings sentences into "stories"',
				links: [
					{
						title: "source",
						link: "https://github.com/washingtonsteven/pabo",
					},
				],
			},
		],
	};

	const socialsList = {
		title: "elsewhere on the web",
		items: [
			{
				name: "cohost",
				link: "https://cohost.org/esaevian",
				external: true,
				desc: "eggbug!",
			},
			{
				name: "tumblr",
				link: "https://esaevian.tumblr.com",
				external: true,
				desc: "mostly reblogs of silly stuff + destiny",
			},
			{
				name: "bluesky",
				link: "https://bsky.app/profile/esaevian.bsky.app",
				external: true,
				desc: "mostly reshares (skeets?) of possums and birds and wolves",
			},
			{
				name: "github",
				link: "https://github.com/washingtonsteven",
				external: true,
				desc: "return to the source"
			},
			{
				name: "twitch",
				link: "https://twitch.tv/esaevian",
				external: true,
				desc: "not very often.",
			},
		],
	};

	return [socialsList, stuffList];
};
