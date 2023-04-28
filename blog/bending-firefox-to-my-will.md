---
layout: blogbase
title: bending firefox to my will
subtitle: for when you want to shake things up
includehighlight: false
date: 2023-04-28T00:00:00-0400
---

so i've been using the newfangled [Arc Browser](https://arc.net/) on my work laptop and been enjoying it, but since my personal computer is windows, i can't use it everywhere (they're expecting a windows port in Nov or so, which to me means "2024" at least).

ever since, i've been trying to distill the things i like about Arc (which isn't everything), and see if i can replicate things somewhat in Firefox.

turns out, my main things are a) sidebar tabs and b) bookmarks as tabs (i.e. a bookmark looks like a tab, mostly so i don't keep opening the same site in multiple tabs)

Firefox ended up being much more extensible than i thought! there are definitely extensions that add tabs to the side, using the built-in sidebar (i'm using [Tab Center Reborn](https://addons.mozilla.org/en-US/firefox/addon/tabcenter-reborn/)). but then i found out about `userChrome.css`

with userChrome.css, i can style the browser like its a webpage. there's even a set of tools like the Inspector that let me live-edit the goddamn browser. this feels like power i should not have and will not be responsible with. ([instructions on how to do that](https://www.reddit.com/r/FirefoxCSS/comments/73dvty/tutorial_how_to_create_and_livedebug_userchromecss/))

anyways, i [stole a setup from reddit](https://www.reddit.com/r/FirefoxCSS/comments/obw2wm/edgestyle_vertical_tabs_for_firefox_with_tab/) and have collapsing side tabs now, with no tabs on top of the window.

i still need to figure out how i can do "bookmarks-as-tabs," which isn't even something i think i'm explaining right, never mind know how to find without a standard name for it.

---

edit: lmao turns out there's a limit to how much data an extension can store (particularly data that can be sync'd between computers) and i have too much css for it to save.

i really don't want to have to minify the css but i may have to.

> this was [originally on cohost](https://cohost.org/esaevian/post/1410575-lmao-turns-out-there)
