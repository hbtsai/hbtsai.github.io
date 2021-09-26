# Quick Start Guide

Mobile webpage for an installation guide for a Verdigris system.

Hosted on Github Pages. [See Github's guide for instructions on hosting locally.](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/)

# Changing Copy, Embeds, Pages, and Page Order

Copy lives in the `.yml` files within the [`_data`](/_data) directory. Color names and values are defined in [`_data/colors.yml`](_data/colors.yml) and page content, including page order, copy, and embeds, lives in [`_data/pages.yml`](_data/pages.yml). The initial state of the page is in [`_data/state.yml`](_data/state.yml), though there is some duplication in `pages.yml` (e.g. selected for `row-select` and `stepper` components).

[See jekyll's documentation for data files](https://jekyllrb.com/docs/datafiles/)

# Pages

Pages are defined in [`_data/pages.yml`](_data/pages.yml). Each page is composed of a group of components that makeup the page. The exception is the start/landing page.

Each page is defined by:
- type: either `start` or `content`
- content: the list of components that compose the page; the start page only contains the `start` component
  - source: every component has a source, which points to a template in the [`_includes`](_includes) directory

## Start Page

The start page receives some content from `pages.yml`:
- landing_image: defines the path to the background image for the page
- logo: path to the logo image in the banner
- title: copy for the banner
- version: copy for the version in the banner
- scroll_text: copy for the scroll indicator at the bottom of the page
- scroll_image: path to the image for the scroll indicator

## Content Pages

Unlike the start page, which only consists of `start.html`, the `content` pages include lists of many components. For example:
```
- type: content
  content:
    - source: component-a.html
      attr-1: this
      attr-2: that
    - source: component-b.html
      attr-a: some
      attr-b: thing
```
This content page has two components, a and b, that each have their own attributes, which are used to populate their respective templates. All content pages begin with a title and page-note.

# Components

Components are used across pages for similar parts of the guide. The list of components are:
- Color Picker
- Embed
- End
- List
- Page Note
- Row Select
- Stepper
- Switch
- Text
- Title
- Warning

Some of these components only appear once (e.g. Switch, End) but could theoretically be reused for additional page content.

The templates for components live in the [`_includes`](_includes) directory, and SCSS lives in the [`_sass/components`](_sass/components) directory.

## Components each have a set of possible attributes.

### Color Picker
- none (all content is dynamically generated from the colors in `colors.yml` and `cables` in `state.yml`)

### Embed

- embed: the path to the content to be included
- type: image (img), svg (object), or none (iframe)
- height: content height (iframes only)
- title: text above the embed (optional)
- caption: text below the embed (optional)
- caption_style: light (smaller, gray text) (optional)

### End

- text: the copy in the end section
- network: the copy for the network line in the end section
- closing_image: the image at the bottom of the end section

### List

- title: the list title (optional)
- icon: the icon that precedes the list title (optional, requires title)
- type: numbered (optional, defaults to dash/dashed)
- items: the items in the list
  - text: the text for the list item

### Page Note

- page_number: the number of the page

### Row Select

- id: the unique id for this component corresponding to `selections` in the `selectModule`
- rows: the row items for the row select
  - title: the row text
  - id: the unique id (and value if selected) for this row item
  - selected: whether or not this row is selected by default (optional, defaults to `false`)
  - content: the content of this row, which is only visible when selected; it can be a list of components (optional)

### Stepper

- id: the unique id for this component corresponding to `selections` in the `selectModule`
- items: the stepper items for the stepper (there should be exactly 2)
  - text: the text for this step
  - id: the unique id (and value if selected) for this step
  - selected: whether or not this step is selected by default (optional, defaults to `false`)

### Switch

- id: the unique id for this component corresponding to `selections` in the `selectModule`
- text: the copy to the left of the switch
- content: the content of this switch, which is only visible when checked; it can be a list of components (optional)

### Text

- title: bolder copy before the main text (optional)
- text: regular block of copy (optional)

### Title

- title: the copy for the page title

### Warning

- text: the copy for the warning

### Classes

Some components can also have classes passed to them as an attribute. This is useful for passing classes into components that determin the visibility of those components. Currently the components that support classes are:
- embed
- list
  - items
- text

# Embeds (images, dynamic SVGs, animations)

## Dynamic SVGs

Update stroke and fill values of dynamic SVGs to match defaults for 3-phase and split-phase panels.

Add classes to dynamic elements indicating which cable they represent (e.g. `class="cable B fill"`, `class="cable N stroke"`).

## Animations

Remove CSS rule `top: 25%;` and h1 tags from animations.

Set the height of embedded iframes to match the content.

## Animated Dynamic SVGs

The page for installing and connecting CTs had an animated SVG that needed dynamic recoloring. To make it dynamic, the SVG was converted from a CSS background to an object tag and the corresponding animation was updated from changing the background position of the splash to changing the absolute positioning of the object. Additional JS was added to target the content of the object, which was inside the content of an iframe.
