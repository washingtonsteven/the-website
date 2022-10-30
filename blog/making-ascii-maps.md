---
layout: blogbase
title: making maps with just ascii
subtitle: something i thought too much about maybe
includehighlight: false
date: 2022-10-30T00:00:00-0400
---

## what's a map?

In creating the [explorer format](/blog/creating-twine-format), I wanted to have easy support for doing 2D, Super Metroid-style maps. In essence this is a grid, which each block on the grid showing a specific style of square or rectangle, correlating with the area the player is in.

<p class="img"><img src="/blog/images/retropixel-net-brinstar.gif" alt="Super Metroid Map of Brinstar" /></p>
<p class="caption">Super Metroid Map of Brinstar</p>

Ignoring the text labels (and elevator shafts), essentially this map shows two things:

1. Whether a grid on the map is part of the map (pink) or not (black).
2. How each grid block connects (or doesn't connect) to adjacent blocks, visualized by "walls."

## use in twine

Twine (or Twee, in this case), is basically a fancy way of reading a text file (much like how this page is a fancy way of reading a <a href="https://github.com/washingtonsteven/the-website/blob/main/blog/making-ascii-maps.md" target="_blank" rel="noopener noreferrer">Markdown file</a>). It would be great to have the map data in that text file as well, and in a fairly easy to read and write format.

That last requirement basically rules out XML (cause it isn't 2009 anymore) and JSON (I love you JSON, but visualizing a map from JSON is a nightmare).

A simple map could be done using just ASCII characters, especially if you author it in a monospace font. Here's a simple 10x10 map:

```
xxxxxxxxxx
xxxx00xxxx
xxxx00xxxx
xxx0000xxx
xxx000000x
xx00000xxx
xx00xxxxxx
xx000xxxxx
xx00000xxx
xxxxxxxxxx
```

Here `x` means "The player can't go here" and `0` means "the player can be here"

And here's how it would appear:

<p class="img"><img src="/blog/images/map-screenshot.png" alt="Screenshot of the above map on a grid" /></p>
<p class="caption">Screenshot of the above map on a grid</p>

Easy! Time to wipe our hands and call it a day, except...

## walls

So we've achieved goal #1, show where the player can be. But what about goal #2, show the connections between rooms?

Surely we'll need more than `x` and `0` to denote whether a block has walls. But how? We could use a separate piece of data to say something like "coordinate (1,0) has walls on the top and right, but not bottom and left," but that starts getting real clunky again. Is there a way we can encode that information into a single character?

## wall states

So, if we look at a single block, we can have a wall on top, right, bottom, and left, and any combination of those, which is 16 combinations:

1. no walls
2. top only
3. left only
4. bottom only
5. right only
6. top and left
7. top and bottom
8. top and right
9. left and bottom
10. left and right
11. bottom and right
12. top, left, and bottom
13. top, left, and right
14. left, bottom, and right
15. bottom, right, top
16. top, left, bottom, right (all of the walls!)

Now, this would work with any system, but 16 is a number system we see a lot, especially in web development: hexadecimal! We can attribute a character 0-9 and a-f to represent each of the 16 states above

## sorta random choice

We can pick an arbitrary mapping of hex char to wall configuration, and that'll work fine as long as it's clear in our code (i.e. a `const` somewhere). But we can do one better (or worse, depending on how much you understand of binary).

Since we have 4 walls per block, and the max number of bits a hex char would need is 4, we can do a kinda sorta bitmask to map a hex character to a wall state.

First, we do have to (arbitrarily) assign a bit to a wall. I chose to go from most significant bit to least, following the same order that things like `margin` and `border` follow in CSS: top, right, bottom, left:


|                | top | right | bottom | left | binary | decimal | hex |
| -------------- | --- | ----- | ------ | ---- | ------ | ------- | --- |
| no walls       |  0  |   0   |   0    |  0   |  0000  |    0    |  0  |
| top and bottom |  1  |   0   |   1    |  0   |  1010  |   10    |  a  |
| all walls      |  1  |   1   |   1    |  1   |  1111  |   15    |  f  |
| etc...         |     |       |        |      |        |         |     |

So now we can use a single character to determine how many walls need to be on each part of the map. Using this we can create single rooms, hallways, and corners fairly easily!

## final result

So now we can take our map from earlier, and turn each grid into a hex char that represents the walls around it:

```
xxxxxxxxxx
xxxx9cxxxx
xxxx14xxxx
xxx922cxxx
xxx1882aex
xx9022exxx
xx34xxxxxx
xx92cxxxxx
xx3a2aexxx
xxxxxxxxxx
```
(note: I did set up some of the interior walls to "double up" and show on both adjacent blocks in order to be more prominent, but how that is displayed can be up to you!)

(double note: looking back, using `x` to denote a non-space is still a little rough to read here. However, since the only valid values for a space is `[0-9a-f]`, you can use whatever other character to denote a non-space, like `-`, `_` or even ` ` (space)!)

And that comes out looking something like this:

<p class="img"><img src="/blog/images/mapwalls-screenshot.png" alt="The same Map screnshots from earlier, but with borders highlights in white"></p>
<p class="caption">The same Map screnshots from earlier, but with borders highlights in white</p>

We now have our small use case fulfilling the above criteria:

1. We know where the player can and can't be
2. We know how each block connects to the others (in this case, this is one large room with some walls the player has to go around)

## conclusion

This was my first time working directly with bit maps and bit masking. You can see the code that taskes the ascii char and converts it to drawing a border in the <a href="https://github.com/washingtonsteven/explorer-format/blob/main/src/CanvasMap.ts#L334-L385" target="_blank" rel="noopener noreferrer">explorer format source</a>. Could I have made that code nicer? Probably. There's maybe some bitshifting that can happen to make this a bit smoother, but that's for another time, I guess!
