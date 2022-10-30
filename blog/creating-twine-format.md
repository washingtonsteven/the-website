---
layout: blogbase
title: creating a twine story format
subtitle: you probably don't need to do this
includehighlight: true
date: 2022-09-12T00:00:00-0400
---
{% comment %}
with 11ty, markdown is processed through liquid. which is a problem if you want to output literal braces (like you're writing about handlebars or twine). wrapping the whole post in "raw" prevents the liquid processing, and everything happens in handlebars
{% endcomment %}
{% raw %}
## what?

First. [Twine.](https://twinery.org) Twine is a piece of software that let's you write nonlinear stories. It keeps track of chunks of story (so-called "passages") and the links between them (well, not really, but we'll get there maybe). Basically it keeps track of a graph of nodes.

Second. [Story Formats.](https://twinery.org/cookbook/starting/twine2/storyformat.html) Story Formats are blobs of javascript that take the graph data that Twine has and displays it on a web page.

A Twine Story Format mainly provides three things

1. The HTML markup for the page
2. Where Twine (or tweego or whatever compiler you are using) should dump the story data
3. Actually there isn't a third thing, gotcha.*

<small>_* Actually the third thing is metadata** about the story format itself but that's not terribly exciting_</small>

<small>_** I never meta data i didn't like_</small>

There are several popular ones out there: Harlowe is the default for the Twine application, Sugarcube and Chapbook provide alternate UI experiences, and there's [Snowman](https://videlais.github.io/snowman/#/). Snowman is a bare-bones kind of story format where you have to implement a lot of the features (like macros, styling, etc) yourself. In retrospect, it's open enough that you probably don't need to write a story format of your own if you are planning on publishing your story to the web*. But then you don't learn the joys of making a story format! Anyway.

<small>_* You can use the Twine story data pretty much anywhere you can process XML._</small>

## why?

Three reasons:

1. Cause I thought it'd be fun.
2. I wanted some first-class features in the format (like using a `<canvas>` element to draw a map for the game)
3. I really didn't want to use jQuery, and a lot (maybe all? Need to check) of the existing formats rely on jQuery. Or at the very least they load it for writers to use. Which is fine! I'd just rather leave it behind. Let the past die. Kill it if you have to.

Reason #2 is why I called the format "Explorer." Kind of giving a sense that you can write a "dungeon" that you can explore. Or crawl through. Maybe I should call it "Crawler." It's not too late.

## how?

[Check out my commits if you just want to go through that way](https://github.com/washingtonsteven/explorer-format/commits/main)

The ultimate goal is to create a file (`format.js`) that looks something like:

```js
window.storyFormat({
	name: "Story Format Name",
	version: "1.0.0",
	author: "Author McAuthorson",
	image: "loss.jpg",
	url: "https://hell.site",
	license: "MIT",
	proofing: false,
	source: ""
})
```

This file is a thing called [JSONP](https://en.wikipedia.org/wiki/JSONP),  which is a way to provide data via a JS (i.e. you can load it in a `<script>` tag). In this case, Twine has a `window.storyFormat` function that I just fed my format data into.

Most of those fields are fairly boilerplate, except for `source` (and `proofing` which we won't talk about right now). `source` is where we will dump our HTML. 

In fact, a very simple story format, that does absolutely nothing would look like this:


```js
window.storyFormat({
	name: "Story Format Name",
	version: "1.0.0",
	author: "Author McAuthorson",
	image: "loss.jpg",
	url: "https://hell.site",
	license: "MIT",
	proofing: false,
	source: "<html><head><title>{{STORY_NAME}}</title></head>"+
	        "<body>{{STORY_DATA}}</body></html>"
})
```


Publish a story with this format and you'll see...nothing. Unless you look at the source for your page. Twine replaced `{{STORY_NAME}}` with the name of your story, and `{{STORY_DATA}}` with what is basically an XML representation of your story.

### inserting your javascript

Now that you have HTML and `STORY_DATA`, your story format will need some JS to convert that `STORY_DATA` to something the user can see. That JS can get included directly in the `source` property:

```js
window.storyFormat({
	name: "Story Format Name",
	version: "1.0.0",
	author: "Author McAuthorson",
	image: "loss.jpg",
	url: "https://hell.site",
	license: "MIT",
	proofing: false,
	source: "<html><head><title>{{STORY_NAME}}</title></head>"+
	        "<body>{{STORY_DATA}}"+
	        "<script type=\"text/javascript\">"+
	        "//STORY FORMAT JAVASCRIPT HERE"+
	        "</script>"+
	        "</body></html>"
})
```

You may be starting to see a problem, writing HTML and Javascript within a string is a pain. So we turn to builds scripts to put it all together for us.

### building the format json

I ended up writing a script that takes the story format javascript I wrote (in `index.js`), a handlebars template for the page body, and mashes them together to make the format you see above:

`index.hbs` 
```handlebars
<html>
	<head>
		<title>\{{STORY_NAME}}</title>
	</head>
	<body>
		\{{STORY_DATA}}
		<script type="text/javascript">
			{{{ format_js }}}
		</script>
	</body>
</html>
```
<small>_Note the `\` before STORY_NAME and STORY_DATA, this is to prevent handlebars from trying to interpolate values for them, that's Twine's job! You can use a different template system (or a different delimiter in handlebars) to avoid this, if you like._</small>

<small>_Oh also, `format_js` has triple braces so Handlebars won't try to safe-escape any of the text inside (i.e. turning `&` into `&amp;`, etc.)._</small>

`build-format.js`
```js
#!/usr/bin/env node
const Handlebars = require("handlebars");

const storyJSON = {
	name: "Story Format Name",
	version: "1.0.0",
	author: "Author McAuthorson",
	// ...etc.
}

const format_js = fs.readFileSync("index.js");
const html_template = fs.readFileSync("index.hbs");
storyJSON.source = Handlebars.compile(html_template)({
	format_js
});

fs.writeFileSync(
	"format.js", 
	`window.storyFormat(${JSON.stringify(storyJSON)})`
);
```

Boom! We have a gnarly looking `format.js`, but we are no longer directly editing that file, so that's fine!

### side note: building js

In reality, I'm also not directly editing `index.js` to add my Story Format javascript. Instead I'm using [Parcel](https://parceljs.org/) to build `index.ts` (whoo Typescript!) and minify it to `index.js`, which then follows the process above. This is really nice for working with TS and ES6 modules, though using sourcemaps is wonky (since the JS is added to the page via the source string rather than directly). You can use any build system you want here (or none!).

### getting your story data: tw-storydata

The `<tw-storydata>` node has all the information you need to load the data about your story:

```html
<tw-storydata
	name="Story Name"
	startnode="1"
	format="Story Format Name"
	format-version="1.0.0"
>
<!-- passage data here, we'll get there -->
</tw-storydata>
```

You can get this information with a simple: 

```js
const storydataNode = document.querySelector("tw-storydata");
``` 

(placed in your `index.js` file that we added to the format above), and then get the global story data with something like: 

```js
storydataNode.getAttribute("name"); //returns "Story Name"`. 
```

Rinse and repeat to get all of the data about the story

### getting your passage data: tw-passagedata

All of your passages will show up as individual `<tw-passagedata>` nodes, which you can get with:

```js
document.querySelectorAll("tw-passagedata")
```

And here's what the passage node looks like:

```html
<tw-passagedata
	pid="1"
	name="Passage Name"
	tags="",
	size="100,100",
	position="0,0"
>
This is the Passage Content!
[[Another Passage Name]]
</tw-passagedata>
```

<small>_Note: `size` and `position` are attributes that represent where the passage lies on the canvas within the Twine program. This isn't as important for standard stories, but working that information into a non-linear narrative would be cool! Near as I can tell, the main use of this is to decompile an HTML file with this story data into Twine to edit, and preserve the passage size/location in Twine so they aren't all bunched up in the top left._</small>

Similarly to the story data, you can get the attributes with `passageNode.getAttribute("pid")`. And you'll get the passage content with `passageNode.innerHTML`

You'll probably save this data in an array to access later. In my case it looks something like this:

```js
const passages = [
	{
		pid: "1",
		name: "Passage Name",
		// Other attributes here, like tags, size, and position
		content: "This is the Passage Content!\n[[Another Passage Name]]"
	},
	{
		pid: "2",
		name: "Another Passage Name",
		//more attributes
		content: "This is the Second Passage!"
	},
	// ...etc.
]
```

### side note: what about links?

Remember when I said Twine only \*sorta\* keeps track of links between passages? If you look at the data that's output, there is no information on links between passages! While Twine understands wiki-style links in the program itself, it's up to you, dear story format developer, to create those links yourself.

The main way to do this is to search through your content for something that looks like a `[[link]]`, and parse that, usually with regular expressions (I'm so, so sorry).

You can see how I did it [here](https://github.com/washingtonsteven/explorer-format/blob/e71745be79ece886c05cc2687312c9ab5fe96cc1/src/util.ts#L5-L20).

For the above passages, this will convert that first passage into something like:

```js
{
	pid: "1",
	name: "Passage Name",
	// Other attributes here, like tags, size, and position
	content: "This is the Passage Content!\n<a data-passage-name=\"Another Passage Name\">Another Passage Name</a>"
},
```

### side note: user scripts and user styles

Within `tw-storydata` and along side your `tw-passagedata` nodes, there will be a `script` and a `style` node. These will contain the story author's JS and CSS that they added via Twine (or in a specially tagged passage, depending on your compiler). You can take the contents of these nodes, and place them in the page in new `<style>` and `<script>` tags.

Here's an example with a user script:
```js
const scriptElem = document.createElement("script");
scriptElem.setAttribute("type", "text/javascript");
scriptElem.innerHTML = storyDataNode.querySelector("script#twine-user-script").innerHTML;
document.body.appendChild(scriptElem);
```

### showing the first passage

This is fairly easy. But first we'll have to add a place to put the passage content in our HTML template:

```handlebars
<html>
	<head>
		<title>\{{STORY_NAME}}</title>
	</head>
	<body>
		\{{STORY_DATA}}
		 <!-- Right here! ↓ -->
		<div id="passage-container"></div>
		<script type="text/javascript">
			{{{format_js}}}
		</script>
	</body>
</html>
```

We can now take a passage (any passage), and put its content into `#passage-container`.

```js
const passageContainer = document.querySelector("#passage-container");
```

For starters, let's get the first passage. We'll be looking at `startnode` in the story data to find which passage is first. `startnode` has the `pid` of the passage we want. Now we can look through our array of passages to get the one we want:

```js
/** 
 * See the above section on tw-passagedata 
 * to see how `passages` is setup
 */

const startnode = storydataNode.getAttribute("startnode");
const firstPassage = passages.find((passage) => {
	return passage.pid === startnode;
})
```

Then we put the content in the passage container

```js
passageContainer.innerHTML = firstPassage.content;
```

Now you should be seeing your first passage!

### clicky clicky links

Now that we have a passage on the screen, the user can click a link to go to the next one. But clicking the link doesn't do anything.

What will have to happen is that when a link is clicked, we listen for that `click` event, find out what link was clicked (by looking at `data-passage-name`) and find that passage. Once we have the passage, we display it just like before.

One thing that makes this easier is [event bubbling](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture). We can listen for a click on the `passageContainer`, check that we clicked a link, and go from there. No need to add and remove click listeners every time the passage changes.

```js
passageContainer.addEventListener("click", (e) => {
	// check to make sure we clicked on:
	// 1. an <a> tag with 
	// 2. "data-passage-name" set to something
	if (
		event.target.tagName.toLowerCase() === "a" && 
		event.target.dataset.passageName
	) {
		const passagename = event.target.dataset.passageName;
		const passage = passages.find((passage) => {
			return passage.name === passagename;
		});
		if (passage) {
			passageContainer.innerHTML = passage.content;
		}
	}
})
```

That's pretty much it. Every time you click an `<a data-passage-name="something">` tag, it should replace the `passageContainer` with the content of the new passage!

## done!

At this point we have a pretty workable story format (I think, I wrote this whole thing as a sort of fever dream). It looks ugly now, but we can make it better with:

1. Adding some CSS to the handlebars template
   1. You can inline it in a similar way we inlined the javascript in our [build script](#building-the-format-json))
2. Adding more interactivity with JS
   1. For example, adding macros to simulate typing, extracting links to display in a separate panel, playing audio or a video, pretty much anything your little JS heart desires!

Maybe I'll write about those later. But for now, do what you will with this information. 

{% endraw %}