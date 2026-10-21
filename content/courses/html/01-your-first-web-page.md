## What HTML does

HTML describes a document's content and structure. A browser reads that document and builds a page containing elements such as headings, paragraphs, links and lists. HTML is not the language that decides every colour or calculates an answer: CSS handles presentation and JavaScript adds programmable behaviour. Learning those jobs separately makes a page easier to understand and maintain.

An element normally has an opening tag, some content and a closing tag. In `<p>Welcome</p>`, `p` identifies a paragraph and `Welcome` is its text. The closing slash belongs before the tag name. Nesting means placing one element inside another. Close an inner element before closing the element that contains it.

## Example 1: a complete document

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My study page</title>
  </head>
  <body>
    <h1>My study page</h1>
    <p>I am learning to build accessible web pages.</p>
  </body>
</html>
```

Expected result: the preview displays a large heading followed by one paragraph. The title is document metadata, not another paragraph in the page. In a normal browser tab it supplies the tab title; an embedded practice preview does not need to replace the surrounding website's tab title.

The doctype selects modern HTML document processing. `lang="en"` identifies the document's language. Character encoding supports text reliably, and viewport metadata lets the page use the device's available width. Content that readers interact with belongs inside `body`; document metadata belongs inside `head`.

## Example 2: headings explain a page's organisation

```html
<main>
  <h1>Weekly study plan</h1>
  <h2>Monday</h2>
  <p>Read the lesson and try its examples.</p>
  <h2>Tuesday</h2>
  <p>Review mistakes and complete the exercise.</p>
</main>
```

Expected result: one main heading introduces two smaller section headings, each followed by a paragraph. Heading levels describe structure, not a desired font size. Use CSS later to change appearance without changing what a heading means. `main` identifies the principal content of this document.

Try replacing the second paragraph's text. The rest of the structure should remain unchanged. This is a useful first debugging habit: change one thing, run again and compare the result with your prediction.

## Example 3: links connect meaningful content

```html
<main>
  <h1>Revision checklist</h1>
  <p><a href="#practice">Go to the practice section</a></p>
  <section id="practice">
    <h2>Practice</h2>
    <p>Write a page with a heading and two paragraphs.</p>
  </section>
</main>
```

Expected result: a link labelled “Go to the practice section” targets the section with `id="practice"`. An attribute adds information to an opening tag. Here, `href` gives the link's destination and `id` names its target. This example needs no external network request. An anchor jump can be hard to notice when the entire short page already fits inside the preview.

## Mistakes, inspection and independent practice

`<p>Read this<p>` is not the explicit closing syntax we intend; write `<p>Read this</p>`. Browsers recover from many HTML mistakes, so a visible result alone does not prove that the source is well structured. Check matching tags, nesting and attribute quotes as well as appearance. Never paste passwords, tokens or private information into practice examples.

Build a study profile containing one main heading, a short introduction, two section headings and a link to the second section. Start from Example 1's document structure. Keep the source readable with indentation, but remember that indentation is for the person reading the source, not a substitute for elements.

```hint
Put an id on the second section, then use the same name after # in the link's href.
```

```solution
One valid arrangement is a main element containing h1, an introductory p, a link with href="#goals", a first section, and a second section whose id is "goals". Both sections need descriptive h2 headings. There is no single required choice of personal text.
```

You are ready to continue when you can explain what belongs in `head` and `body`, write explicitly nested elements, and match a local link to its target without copying the examples line for line.
