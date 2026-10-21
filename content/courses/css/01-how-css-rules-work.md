## The job of a stylesheet

CSS describes how HTML elements should be presented. It can change colours, text, spacing and layout without replacing the content itself. A useful first distinction is between selecting an element and styling it: the selector identifies the elements, while declarations describe the changes.

A rule such as `p { color: navy; }` selects paragraphs. Inside its braces, `color` is a property, `navy` is a value and the colon separates them. The semicolon ends the declaration. Keep these punctuation marks consistent even when a short final declaration could omit its semicolon; predictable source is easier to debug.

Our CSS practice editor supplies a sample page with a heading, paragraph, button and list. Enter CSS, not an HTML document, in this editor. Later lessons will explain how real project files connect HTML and CSS.

## Example 1: change text and background colours

```css
body {
  background-color: white;
  color: #1e293b;
}

h1 {
  color: #0f766e;
}
```

Expected result: the sample page has a white background, dark slate text and a teal heading. The heading has its own `color` declaration; other text can inherit the colour supplied by an ancestor. A six-digit hexadecimal colour describes red, green and blue components. You do not need to memorise colour codes to understand the rule's structure.

Predict what happens if you remove the `h1` rule. Run that version before restoring it. The heading should no longer receive the explicitly supplied teal colour from this stylesheet. Notice that browsers also supply default styles, so an element can retain a default size or weight even when your CSS does not specify one.

## Example 2: make a paragraph comfortable to read

```css
p {
  font-family: Arial, sans-serif;
  font-size: 18px;
  line-height: 1.6;
  max-width: 60ch;
}
```

Expected result: the paragraph uses a local sans-serif font, an 18-pixel font size and more generous line spacing. Its line length is capped at roughly sixty zero-character widths. `Arial, sans-serif` is a fallback list, not an instruction to download a font. A unitless line height scales with the element's font size.

Reading comfort is not the same as making every element large. Keep paragraph text legible, leave enough contrast against the background and avoid forcing readers to scan extremely long lines. Device width still matters: `max-width` sets an upper bound rather than demanding that a narrow preview become wider.

## Example 3: inspect a visible box

```css
button {
  padding: 12px 18px;
  border: 2px solid #0f766e;
  border-radius: 6px;
  background-color: white;
  color: #0f172a;
}
```

Expected result: the existing sample button gets internal space, a visible teal border, slightly rounded corners and dark text. Padding lies between content and border. It does not add distance outside the border. The first padding value applies vertically and the second horizontally. We will examine the complete box model, including margin and sizing, in its own lesson.

## Debug one declaration at a time

If a rule appears not to work, first confirm that the selected element exists. Next check the braces, property spelling, colon, value and semicolon. `font-size: 18;` is not the intended length: write `font-size: 18px;`. A number is not automatically a valid CSS value for every property. Different properties accept different kinds of values.

Avoid changing six rules at once to guess at a problem. Disable one declaration, observe the effect and restore it. Later, browser inspection tools will help identify which rules match and which declarations win. For now, small experiments establish that CSS is a set of explicit instructions, not a collection of visual guesses.

## Independent exercise

Style the sample page as a simple revision sheet. Give the heading a distinct readable colour, limit paragraph width, and give the button both padding and a border. Do not use external fonts, images or imports. Explain which selector affected each element.

```hint
Write separate rules for body, h1, p and button. Change appearance with declarations inside braces, not by typing HTML into the CSS editor.
```

```solution
A valid solution can combine the three worked examples. Use different readable colours if desired. Check that the paragraph remains readable in the narrow preview and that the button's text is not hidden by its background.
```
