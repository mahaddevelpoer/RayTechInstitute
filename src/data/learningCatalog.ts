import type { LearningLanguage, LearningCourse, LearningTopic } from '@/types/learning';
export const LEARNING_LANGUAGES: LearningLanguage[] = [
  {
    "id": "css",
    "slug": "css",
    "title": "CSS",
    "description": "Style responsive and accessible web pages.",
    "runtime": "css",
    "state": "published"
  },
  {
    "id": "html",
    "slug": "html",
    "title": "HTML",
    "description": "Structure web pages with semantic HTML.",
    "runtime": "html",
    "state": "published"
  },
  {
    "id": "javascript",
    "slug": "javascript",
    "title": "JavaScript",
    "description": "Add behavior to web pages with JavaScript.",
    "runtime": "javascript",
    "state": "published"
  },
  {
    "id": "php",
    "slug": "php",
    "title": "PHP",
    "description": "Learn PHP fundamentals in browser-based exercises.",
    "runtime": "php",
    "state": "published"
  },
  {
    "id": "python",
    "slug": "python",
    "title": "Python",
    "description": "Learn programming fundamentals with Python.",
    "runtime": "python",
    "state": "published"
  }
];
export const LEARNING_COURSES: LearningCourse[] = [
  {
    "id": "python",
    "slug": "python",
    "title": "Python Programming",
    "description": "Learn Python through lessons, topic quizzes and assignments.",
    "languageIds": [
      "python"
    ],
    "state": "published"
  },
  {
    "id": "web-development",
    "slug": "web-development",
    "title": "Web Development",
    "description": "Study HTML, CSS, JavaScript and PHP as individual language tracks.",
    "languageIds": [
      "html",
      "css",
      "javascript",
      "php"
    ],
    "state": "published"
  }
];
export const LEARNING_TOPICS: LearningTopic[] = [
  {
    "id": "authored-css-001",
    "languageId": "css",
    "slug": "how-css-rules-work",
    "title": "How CSS Rules Style a Page",
    "summary": "Read selectors and declarations, style the supplied sample page, and debug colour, text and spacing rules.",
    "order": 1,
    "version": 2,
    "objectives": [
      "Explain selectors, properties and values",
      "Style readable text and a visible button without external assets"
    ],
    "prerequisiteIds": [],
    "content": "## The job of a stylesheet\n\nCSS describes how HTML elements should be presented. It can change colours, text, spacing and layout without replacing the content itself. A useful first distinction is between selecting an element and styling it: the selector identifies the elements, while declarations describe the changes.\n\nA rule such as `p { color: navy; }` selects paragraphs. Inside its braces, `color` is a property, `navy` is a value and the colon separates them. The semicolon ends the declaration. Keep these punctuation marks consistent even when a short final declaration could omit its semicolon; predictable source is easier to debug.\n\nOur CSS practice editor supplies a sample page with a heading, paragraph, button and list. Enter CSS, not an HTML document, in this editor. Later lessons will explain how real project files connect HTML and CSS.\n\n## Example 1: change text and background colours\n\n```css\nbody {\n  background-color: white;\n  color: #1e293b;\n}\n\nh1 {\n  color: #0f766e;\n}\n```\n\nExpected result: the sample page has a white background, dark slate text and a teal heading. The heading has its own `color` declaration; other text can inherit the colour supplied by an ancestor. A six-digit hexadecimal colour describes red, green and blue components. You do not need to memorise colour codes to understand the rule's structure.\n\nPredict what happens if you remove the `h1` rule. Run that version before restoring it. The heading should no longer receive the explicitly supplied teal colour from this stylesheet. Notice that browsers also supply default styles, so an element can retain a default size or weight even when your CSS does not specify one.\n\n## Example 2: make a paragraph comfortable to read\n\n```css\np {\n  font-family: Arial, sans-serif;\n  font-size: 18px;\n  line-height: 1.6;\n  max-width: 60ch;\n}\n```\n\nExpected result: the paragraph uses a local sans-serif font, an 18-pixel font size and more generous line spacing. Its line length is capped at roughly sixty zero-character widths. `Arial, sans-serif` is a fallback list, not an instruction to download a font. A unitless line height scales with the element's font size.\n\nReading comfort is not the same as making every element large. Keep paragraph text legible, leave enough contrast against the background and avoid forcing readers to scan extremely long lines. Device width still matters: `max-width` sets an upper bound rather than demanding that a narrow preview become wider.\n\n## Example 3: inspect a visible box\n\n```css\nbutton {\n  padding: 12px 18px;\n  border: 2px solid #0f766e;\n  border-radius: 6px;\n  background-color: white;\n  color: #0f172a;\n}\n```\n\nExpected result: the existing sample button gets internal space, a visible teal border, slightly rounded corners and dark text. Padding lies between content and border. It does not add distance outside the border. The first padding value applies vertically and the second horizontally. We will examine the complete box model, including margin and sizing, in its own lesson.\n\n## Debug one declaration at a time\n\nIf a rule appears not to work, first confirm that the selected element exists. Next check the braces, property spelling, colon, value and semicolon. `font-size: 18;` is not the intended length: write `font-size: 18px;`. A number is not automatically a valid CSS value for every property. Different properties accept different kinds of values.\n\nAvoid changing six rules at once to guess at a problem. Disable one declaration, observe the effect and restore it. Later, browser inspection tools will help identify which rules match and which declarations win. For now, small experiments establish that CSS is a set of explicit instructions, not a collection of visual guesses.\n\n## Independent exercise\n\nStyle the sample page as a simple revision sheet. Give the heading a distinct readable colour, limit paragraph width, and give the button both padding and a border. Do not use external fonts, images or imports. Explain which selector affected each element.\n\n```hint\nWrite separate rules for body, h1, p and button. Change appearance with declarations inside braces, not by typing HTML into the CSS editor.\n```\n\n```solution\nA valid solution can combine the three worked examples. Use different readable colours if desired. Check that the paragraph remains readable in the narrow preview and that the button's text is not hidden by its background.\n```\n\n## Separate a matching rule from an inherited value\n\nInheritance and direct styling can produce similar pictures, but they are different explanations. A paragraph can inherit a body text colour while a heading gets its colour directly from a heading rule. Do not memorise the screenshot: trace the selector and property responsible for each element. In the example below, changing the heading colour does not edit the body rule. A useful experiment changes one property at a time, predicts which elements should respond, and compares that prediction with the actual preview.\n\n<PredictOutput title=\"Which colour belongs to each element?\" code=\"body { color: navy; }&#10;h1 { color: teal; }\" options=\"[&quot;The heading is teal; the paragraph inherits navy&quot;,&quot;Both become teal because h1 comes later&quot;,&quot;The heading becomes navy and the paragraph teal&quot;,&quot;Neither rule can affect text&quot;]\" answer=\"0\" explanation=\"The h1 rule directly sets the heading colour. The paragraph has no direct colour declaration here, so it inherits the body colour.\" />\n\n<CodeTrace title=\"Inspect the button box one declaration at a time\" steps=\"[{&quot;line&quot;:&quot;button { ... }&quot;,&quot;explanation&quot;:&quot;First identify the matching element in the supplied sample page.&quot;,&quot;values&quot;:&quot;Target: the sample button&quot;},{&quot;line&quot;:&quot;padding: 12px 18px;&quot;,&quot;explanation&quot;:&quot;The first value adds internal space above and below the text; the second adds internal space on its left and right.&quot;,&quot;values&quot;:&quot;Vertical padding: 12px; horizontal padding: 18px&quot;},{&quot;line&quot;:&quot;border: 2px solid teal;&quot;,&quot;explanation&quot;:&quot;The border surrounds the content and padding. Its width is not the same thing as padding.&quot;,&quot;values&quot;:&quot;Visible border: 2px, solid, teal&quot;},{&quot;line&quot;:&quot;background-color: white;&quot;,&quot;explanation&quot;:&quot;The button background is white. Choose readable text colour separately; a background declaration does not set text colour.&quot;,&quot;values&quot;:&quot;Background: white; text colour is a separate property.&quot;}]\" />\n\n<TryExample title=\"Prove which elements your rule changes\" code=\"body { color: navy; background-color: white; }&#10;h1 { color: teal; }&#10;p { font-size: 18px; line-height: 1.6; max-width: 60ch; }&#10;button { padding: 12px 18px; border: 2px solid teal; }\" task=\"Change only the heading colour, then run. Next change only the body text colour. Explain which change affects the paragraph. Finally increase button padding and describe the difference between its content, padding and border.\" />\n\n\n<Understand title=\"Understand matching, inheritance and the box model\" stages=\"[{&quot;title&quot;:&quot;Match an element&quot;,&quot;explanation&quot;:&quot;The practice page contains an h1 and a paragraph. A type selector matches its named element, not every element that appears after it.&quot;,&quot;code&quot;:&quot;h1 { color: teal; }&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Directly selected element&quot;,&quot;options&quot;:[&quot;Every paragraph&quot;,&quot;The h1&quot;,&quot;The body only&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Property being set&quot;,&quot;options&quot;:[&quot;font-size&quot;,&quot;padding&quot;,&quot;color&quot;],&quot;answer&quot;:2}],&quot;hint&quot;:&quot;Read the selector before the opening brace and the property before the colon.&quot;,&quot;success&quot;:&quot;The h1 selector directly sets the heading text colour. It does not select the paragraph.&quot;},{&quot;title&quot;:&quot;Trace inherited colour&quot;,&quot;explanation&quot;:&quot;Assume there are no other colour rules. Reconstruct the computed text colours for these two elements.&quot;,&quot;code&quot;:&quot;body { color: navy; }\\nh1 { color: teal; }&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Heading text colour&quot;,&quot;options&quot;:[&quot;navy&quot;,&quot;teal&quot;,&quot;white&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Paragraph text colour&quot;,&quot;options&quot;:[&quot;teal&quot;,&quot;white&quot;,&quot;navy&quot;],&quot;answer&quot;:2}],&quot;hint&quot;:&quot;The paragraph inherits its colour. The heading has its own directly applied declaration.&quot;,&quot;success&quot;:&quot;The heading is teal. The paragraph inherits navy from body. Inheritance is different from selecting every descendant.&quot;},{&quot;title&quot;:&quot;Build the button box&quot;,&quot;explanation&quot;:&quot;Padding adds internal space; the border surrounds the content plus padding. Match each dimension to the correct region.&quot;,&quot;code&quot;:&quot;button { padding: 12px 18px; border: 2px solid teal; }&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Top and bottom padding&quot;,&quot;options&quot;:[&quot;18px&quot;,&quot;2px&quot;,&quot;12px&quot;],&quot;answer&quot;:2},{&quot;label&quot;:&quot;Left and right padding&quot;,&quot;options&quot;:[&quot;18px&quot;,&quot;12px&quot;,&quot;2px&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Border width&quot;,&quot;options&quot;:[&quot;12px&quot;,&quot;2px&quot;,&quot;18px&quot;],&quot;answer&quot;:1}],&quot;hint&quot;:&quot;Two padding values mean vertical first and horizontal second. Border width is a separate declaration.&quot;,&quot;success&quot;:&quot;The button has 12px vertical padding, 18px horizontal padding and a separate 2px border.&quot;}]\" />\n",
    "starterCode": "body {\n  background-color: white;\n  color: #1e293b;\n}\n\nh1 {\n  color: #0f766e;\n}",
    "videoIds": [
      "RlXEdnPtPMA"
    ],
    "questions": [
      {
        "id": "q1",
        "question": "In p { color: navy; }, which part is the selector?",
        "explanation": "The selector p chooses paragraph elements.",
        "correctOptionId": "a",
        "options": [
          {
            "id": "a",
            "text": "p"
          },
          {
            "id": "b",
            "text": "color"
          },
          {
            "id": "c",
            "text": "navy"
          },
          {
            "id": "d",
            "text": ";"
          }
        ]
      },
      {
        "id": "q2",
        "question": "Which pair correctly separates a property from its value?",
        "explanation": "A CSS declaration uses a colon between its property and value.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "color = navy"
          },
          {
            "id": "b",
            "text": "color: navy"
          },
          {
            "id": "c",
            "text": "color -> navy"
          },
          {
            "id": "d",
            "text": "color, navy"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What does padding add to a button?",
        "explanation": "Padding lies between content and border.",
        "correctOptionId": "a",
        "options": [
          {
            "id": "a",
            "text": "Space inside its border"
          },
          {
            "id": "b",
            "text": "Only space outside its border"
          },
          {
            "id": "c",
            "text": "A database record"
          },
          {
            "id": "d",
            "text": "A new HTML heading"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which is the intended valid font-size declaration?",
        "explanation": "A nonzero length here needs a supported unit such as px and declaration syntax uses a colon.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "font-size: 18;"
          },
          {
            "id": "b",
            "text": "font-size: 18px;"
          },
          {
            "id": "c",
            "text": "font-size = 18px;"
          },
          {
            "id": "d",
            "text": "font-size 18px;"
          }
        ]
      },
      {
        "id": "q5",
        "question": "Why use max-width on paragraph text?",
        "explanation": "A maximum width is an upper bound, helpful for readable line lengths.",
        "correctOptionId": "a",
        "options": [
          {
            "id": "a",
            "text": "To cap line length without demanding that a narrow viewport become wider"
          },
          {
            "id": "b",
            "text": "To force every viewport to 60 pixels"
          },
          {
            "id": "c",
            "text": "To load a font"
          },
          {
            "id": "d",
            "text": "To select all buttons"
          }
        ]
      },
      {
        "id": "q6",
        "question": "What should be entered in this lesson’s CSS practice editor?",
        "explanation": "The CSS runtime already supplies sample HTML and accepts stylesheet rules.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "A complete HTML document"
          },
          {
            "id": "b",
            "text": "CSS rules for the supplied page"
          },
          {
            "id": "c",
            "text": "A database password"
          },
          {
            "id": "d",
            "text": "A PHP server configuration"
          }
        ]
      },
      {
        "id": "q7",
        "question": "What does font-family: Arial, sans-serif provide?",
        "explanation": "The browser tries the listed font choices; this rule does not request an external font.",
        "correctOptionId": "a",
        "options": [
          {
            "id": "a",
            "text": "A font fallback list"
          },
          {
            "id": "b",
            "text": "An automatic paid font download"
          },
          {
            "id": "c",
            "text": "Two new paragraphs"
          },
          {
            "id": "d",
            "text": "A CSS selector"
          }
        ]
      },
      {
        "id": "q8",
        "question": "What is a useful first debugging step for an apparently ineffective rule?",
        "explanation": "A valid declaration cannot style the intended element if the selector does not match it.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "Change every rule at once"
          },
          {
            "id": "b",
            "text": "Check that its selector matches an existing element"
          },
          {
            "id": "c",
            "text": "Remove all semicolons"
          },
          {
            "id": "d",
            "text": "Replace CSS with JavaScript"
          }
        ]
      }
    ],
    "questionsPerAttempt": 4,
    "assignment": {
      "instructions": "Style the existing practice sample page as a revision sheet. Write separate body, h1, p and button rules. Give the heading a readable colour, make paragraph text at least 18px with comfortable line-height and a maximum line length, and give the button internal padding plus a visible border. Use only local fonts and CSS declarations; do not paste an HTML document into this CSS editor.",
      "hints": [
        "Review the three worked examples before changing your own program.",
        "Run a small version first and compare its output with your prediction."
      ],
      "requiredConcepts": [
        "element selectors",
        "CSS declarations",
        "text styling",
        "padding and borders"
      ],
      "allowedConcepts": [
        "element selectors",
        "CSS declarations",
        "text styling",
        "padding and borders"
      ],
      "prohibitedConcepts": [],
      "starterCode": "body {\n  background-color: white;\n  color: #1e293b;\n}\n\nh1 {\n  color: #0f766e;\n}",
      "rubric": [
        {
          "id": "requirements",
          "description": "Meet the stated task requirements using the taught concepts.",
          "points": 40
        },
        {
          "id": "behaviour",
          "description": "Produce the required output or visible page behaviour.",
          "points": 35
        },
        {
          "id": "clarity",
          "description": "Use readable structure, meaningful names and a clear explanation.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-html-001",
    "languageId": "html",
    "slug": "your-first-web-page",
    "title": "Your First HTML Web Page",
    "summary": "Build a complete HTML document, organise headings and paragraphs, and connect a local link to its section.",
    "order": 1,
    "version": 1,
    "objectives": [
      "Separate document metadata from visible content",
      "Build nested elements and a local section link"
    ],
    "prerequisiteIds": [],
    "content": "## What HTML does\n\nHTML describes a document's content and structure. A browser reads that document and builds a page containing elements such as headings, paragraphs, links and lists. HTML is not the language that decides every colour or calculates an answer: CSS handles presentation and JavaScript adds programmable behaviour. Learning those jobs separately makes a page easier to understand and maintain.\n\nAn element normally has an opening tag, some content and a closing tag. In `<p>Welcome</p>`, `p` identifies a paragraph and `Welcome` is its text. The closing slash belongs before the tag name. Nesting means placing one element inside another. Close an inner element before closing the element that contains it.\n\n## Example 1: a complete document\n\n```html\n<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <title>My study page</title>\n  </head>\n  <body>\n    <h1>My study page</h1>\n    <p>I am learning to build accessible web pages.</p>\n  </body>\n</html>\n```\n\nExpected result: the preview displays a large heading followed by one paragraph. The title is document metadata, not another paragraph in the page. In a normal browser tab it supplies the tab title; an embedded practice preview does not need to replace the surrounding website's tab title.\n\nThe doctype selects modern HTML document processing. `lang=\"en\"` identifies the document's language. Character encoding supports text reliably, and viewport metadata lets the page use the device's available width. Content that readers interact with belongs inside `body`; document metadata belongs inside `head`.\n\n## Example 2: headings explain a page's organisation\n\n```html\n<main>\n  <h1>Weekly study plan</h1>\n  <h2>Monday</h2>\n  <p>Read the lesson and try its examples.</p>\n  <h2>Tuesday</h2>\n  <p>Review mistakes and complete the exercise.</p>\n</main>\n```\n\nExpected result: one main heading introduces two smaller section headings, each followed by a paragraph. Heading levels describe structure, not a desired font size. Use CSS later to change appearance without changing what a heading means. `main` identifies the principal content of this document.\n\nTry replacing the second paragraph's text. The rest of the structure should remain unchanged. This is a useful first debugging habit: change one thing, run again and compare the result with your prediction.\n\n## Example 3: links connect meaningful content\n\n```html\n<main>\n  <h1>Revision checklist</h1>\n  <p><a href=\"#practice\">Go to the practice section</a></p>\n  <section id=\"practice\">\n    <h2>Practice</h2>\n    <p>Write a page with a heading and two paragraphs.</p>\n  </section>\n</main>\n```\n\nExpected result: a link labelled “Go to the practice section” targets the section with `id=\"practice\"`. An attribute adds information to an opening tag. Here, `href` gives the link's destination and `id` names its target. This example needs no external network request. An anchor jump can be hard to notice when the entire short page already fits inside the preview.\n\n## Mistakes, inspection and independent practice\n\n`<p>Read this<p>` is not the explicit closing syntax we intend; write `<p>Read this</p>`. Browsers recover from many HTML mistakes, so a visible result alone does not prove that the source is well structured. Check matching tags, nesting and attribute quotes as well as appearance. Never paste passwords, tokens or private information into practice examples.\n\nBuild a study profile containing one main heading, a short introduction, two section headings and a link to the second section. Start from Example 1's document structure. Keep the source readable with indentation, but remember that indentation is for the person reading the source, not a substitute for elements.\n\n```hint\nPut an id on the second section, then use the same name after # in the link's href.\n```\n\n```solution\nOne valid arrangement is a main element containing h1, an introductory p, a link with href=\"#goals\", a first section, and a second section whose id is \"goals\". Both sections need descriptive h2 headings. There is no single required choice of personal text.\n```\n\nYou are ready to continue when you can explain what belongs in `head` and `body`, write explicitly nested elements, and match a local link to its target without copying the examples line for line.\n\n## Read the document, then test your prediction\n\nA browser does not infer a page section from the words in a link. It follows the address in href. A fragment beginning with # identifies a location in the current document. Compare that address against the target id character by character. This is different from naming a class for CSS. When a link appears to do nothing, a very short page might already show the target, or the target identifier might not exist. Check the structure before deciding that links are broken.\n\n<PredictOutput title=\"Where does this link point?\" code=\"&lt;a href=&quot;#goals&quot;&gt;Read my goals&lt;/a&gt;&#10;&lt;section id=&quot;goals&quot;&gt;&lt;h2&gt;Study goals&lt;/h2&gt;&lt;/section&gt;\" options=\"[&quot;The section whose id is goals&quot;,&quot;A class named goals&quot;,&quot;An external website automatically&quot;,&quot;Every heading on the page&quot;]\" answer=\"0\" explanation=\"The #goals fragment matches id=&quot;goals&quot; in this document. The visible link label does not determine its destination.\" />\n\n<CodeTrace title=\"Follow a small document from the outside in\" steps=\"[{&quot;line&quot;:&quot;&lt;body&gt;&quot;,&quot;explanation&quot;:&quot;The body contains the visible document content. The head and title are separate metadata.&quot;,&quot;values&quot;:&quot;Visible content begins inside body.&quot;},{&quot;line&quot;:&quot;&lt;main&gt;&quot;,&quot;explanation&quot;:&quot;The main element groups the principal content. It is nested inside body.&quot;,&quot;values&quot;:&quot;body → main&quot;},{&quot;line&quot;:&quot;&lt;h1&gt;Study plan&lt;/h1&gt;&quot;,&quot;explanation&quot;:&quot;The main heading names the page topic. Its closing tag ends the heading, not the surrounding main element.&quot;,&quot;values&quot;:&quot;body → main → h1: Study plan&quot;},{&quot;line&quot;:&quot;&lt;p&gt;Read, practise, review.&lt;/p&gt;&quot;,&quot;explanation&quot;:&quot;This paragraph is a sibling of h1 inside main, not part of the heading text.&quot;,&quot;values&quot;:&quot;main contains two elements: h1, then p.&quot;}]\" />\n\n<TryExample title=\"Build a link with a target you can inspect\" code=\"&lt;main&gt;&#10;  &lt;h1&gt;My learning plan&lt;/h1&gt;&#10;  &lt;p&gt;&lt;a href=&quot;#practice&quot;&gt;Go to practice&lt;/a&gt;&lt;/p&gt;&#10;  &lt;section id=&quot;practice&quot;&gt;&#10;    &lt;h2&gt;Practice&lt;/h2&gt;&#10;    &lt;p&gt;Write one goal here.&lt;/p&gt;&#10;  &lt;/section&gt;&#10;&lt;/main&gt;\" task=\"Open this example in Practice. Change the target from practice to revision in both necessary places. Run it, inspect the preview and explain why changing only one place breaks the intended match.\" />\n\n\n<Understand title=\"Understand document structure and local links\" stages=\"[{&quot;title&quot;:&quot;Separate page and metadata&quot;,&quot;explanation&quot;:&quot;Sort the two pieces of information into their correct roles. The document title and the visible main heading can have different text.&quot;,&quot;code&quot;:&quot;&lt;head&gt;&lt;title&gt;Study notes&lt;/title&gt;&lt;/head&gt;\\n&lt;body&gt;&lt;h1&gt;My goals&lt;/h1&gt;&lt;/body&gt;&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Normal browser tab title&quot;,&quot;options&quot;:[&quot;My goals&quot;,&quot;Study notes&quot;,&quot;body&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Visible main heading&quot;,&quot;options&quot;:[&quot;Study notes&quot;,&quot;head&quot;,&quot;My goals&quot;],&quot;answer&quot;:2}],&quot;hint&quot;:&quot;title belongs to head. h1 belongs to the visible body.&quot;,&quot;success&quot;:&quot;Study notes supplies document-title metadata; My goals is the heading in the body.&quot;},{&quot;title&quot;:&quot;Connect a target&quot;,&quot;explanation&quot;:&quot;A local fragment link needs a matching identifier. Build the destination relationship by completing both cards.&quot;,&quot;code&quot;:&quot;&lt;a href=\\&quot;#revision\\&quot;&gt;Review goals&lt;/a&gt;\\n&lt;section id=\\&quot;revision\\&quot;&gt;&lt;h2&gt;Revision&lt;/h2&gt;&lt;/section&gt;&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Link fragment&quot;,&quot;options&quot;:[&quot;#revision&quot;,&quot;.revision&quot;,&quot;Review goals&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Matching target id&quot;,&quot;options&quot;:[&quot;#revision&quot;,&quot;revision&quot;,&quot;.revision&quot;],&quot;answer&quot;:1}],&quot;hint&quot;:&quot;The # introduces the fragment in href. The id attribute itself does not include that #.&quot;,&quot;success&quot;:&quot;href=\\&quot;#revision\\&quot; targets id=\\&quot;revision\\&quot;. Visible link text does not determine the destination.&quot;},{&quot;title&quot;:&quot;Find the parent&quot;,&quot;explanation&quot;:&quot;Reconstruct the small document tree. Closing h1 ends the heading before p starts, so the paragraph is not inside h1.&quot;,&quot;code&quot;:&quot;&lt;main&gt;\\n  &lt;h1&gt;Plan&lt;/h1&gt;\\n  &lt;p&gt;Practise today.&lt;/p&gt;\\n&lt;/main&gt;&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Parent of h1&quot;,&quot;options&quot;:[&quot;p&quot;,&quot;main&quot;,&quot;title&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Parent of p&quot;,&quot;options&quot;:[&quot;h1&quot;,&quot;head&quot;,&quot;main&quot;],&quot;answer&quot;:2},{&quot;label&quot;:&quot;Relationship of h1 and p&quot;,&quot;options&quot;:[&quot;Siblings&quot;,&quot;Same element&quot;,&quot;p contains h1&quot;],&quot;answer&quot;:0}],&quot;hint&quot;:&quot;Follow the opening and closing tags, not the indentation alone.&quot;,&quot;success&quot;:&quot;Both elements are children of main. They are siblings, with different semantic roles.&quot;}]\" />\n",
    "starterCode": "<!doctype html>\n<html lang=\"en\">\n<head><meta charset=\"utf-8\"><title>Study page</title></head>\n<body>\n  <main>\n    <h1>My study page</h1>\n  </main>\n</body>\n</html>",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "Which element contains the main visible content of an HTML document?",
        "explanation": "The body contains page content. The head contains document metadata.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "head"
          },
          {
            "id": "b",
            "text": "body"
          },
          {
            "id": "c",
            "text": "title"
          },
          {
            "id": "d",
            "text": "meta"
          }
        ]
      },
      {
        "id": "q2",
        "question": "Which source explicitly closes a paragraph correctly?",
        "explanation": "The closing tag for a p element is </p>.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "<p>Hello<p>"
          },
          {
            "id": "b",
            "text": "<p>Hello</p>"
          },
          {
            "id": "c",
            "text": "</p>Hello<p>"
          },
          {
            "id": "d",
            "text": "<paragraph>Hello</paragraph>"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the role of the title element in a normal browser tab?",
        "explanation": "The title supplies metadata such as the tab title, not a visible body heading.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "It automatically inserts a visible h1"
          },
          {
            "id": "b",
            "text": "It sets document-title metadata"
          },
          {
            "id": "c",
            "text": "It changes paragraph colour"
          },
          {
            "id": "d",
            "text": "It creates a link"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which destination matches an element with id=\"goals\" in this document?",
        "explanation": "A fragment identifier begins with # and matches the target element ID.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "href=\"goals\""
          },
          {
            "id": "b",
            "text": "href=\"#goals\""
          },
          {
            "id": "c",
            "text": "href=\".goals\""
          },
          {
            "id": "d",
            "text": "href=\"@goals\""
          }
        ]
      },
      {
        "id": "q5",
        "question": "Which element best introduces a main section below the page h1?",
        "explanation": "An h2 introduces a section beneath the main h1 in the document outline.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "meta"
          },
          {
            "id": "b",
            "text": "h2"
          },
          {
            "id": "c",
            "text": "title"
          },
          {
            "id": "d",
            "text": "head"
          }
        ]
      },
      {
        "id": "q6",
        "question": "What does lang=\"en\" identify?",
        "explanation": "The lang attribute identifies the content language for browsers and assistive technology.",
        "correctOptionId": "a",
        "options": [
          {
            "id": "a",
            "text": "The document language"
          },
          {
            "id": "b",
            "text": "A JavaScript variable"
          },
          {
            "id": "c",
            "text": "The page colour"
          },
          {
            "id": "d",
            "text": "The hosting provider"
          }
        ]
      },
      {
        "id": "q7",
        "question": "Which example has explicit, correctly nested tags?",
        "explanation": "The inner strong element closes before the outer paragraph closes.",
        "correctOptionId": "a",
        "options": [
          {
            "id": "a",
            "text": "<p><strong>Study</strong></p>"
          },
          {
            "id": "b",
            "text": "<p><strong>Study</p></strong>"
          },
          {
            "id": "c",
            "text": "<p><strong>Study</p>"
          },
          {
            "id": "d",
            "text": "</strong><p>Study</p>"
          }
        ]
      },
      {
        "id": "q8",
        "question": "A browser displays a page even though its source contains mistakes. What follows?",
        "explanation": "Browsers recover from many errors. Inspect source structure as well as the visible result.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "The source must be valid"
          },
          {
            "id": "b",
            "text": "The browser may have recovered from the mistakes"
          },
          {
            "id": "c",
            "text": "Closing tags are never useful"
          },
          {
            "id": "d",
            "text": "The document cannot contain metadata"
          }
        ]
      }
    ],
    "questionsPerAttempt": 4,
    "assignment": {
      "instructions": "Build a complete English-language HTML study profile. Include a meaningful document title, one main heading, an introductory paragraph, two sections with h2 headings, and a local link to the second section. Use explicit closing tags and readable nesting. Do not add scripts, external resources or styling yet.",
      "hints": [
        "Review the three worked examples before changing your own program.",
        "Run a small version first and compare its output with your prediction."
      ],
      "requiredConcepts": [
        "HTML document structure",
        "headings and paragraphs",
        "local links and identifiers"
      ],
      "allowedConcepts": [
        "HTML document structure",
        "headings and paragraphs",
        "local links and identifiers"
      ],
      "prohibitedConcepts": [],
      "starterCode": "<!doctype html>\n<html lang=\"en\">\n<head><meta charset=\"utf-8\"><title>Study page</title></head>\n<body>\n  <main>\n    <h1>My study page</h1>\n  </main>\n</body>\n</html>",
      "rubric": [
        {
          "id": "requirements",
          "description": "Meet the stated task requirements using the taught concepts.",
          "points": 40
        },
        {
          "id": "behaviour",
          "description": "Produce the required output or visible page behaviour.",
          "points": 35
        },
        {
          "id": "clarity",
          "description": "Use readable structure, meaningful names and a clear explanation.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-javascript-001",
    "languageId": "javascript",
    "slug": "values-and-console-output",
    "title": "JavaScript Values and Console Output",
    "summary": "Print exact messages, distinguish numbers from strings, and calculate with clearly named constant values.",
    "order": 1,
    "version": 1,
    "objectives": [
      "Predict console output for strings and arithmetic",
      "Calculate a total using named constant values"
    ],
    "prerequisiteIds": [],
    "content": "## JavaScript turns instructions into behaviour\n\nJavaScript is a programming language used to calculate values, make decisions and respond to events. In a browser project, HTML supplies structure, CSS supplies presentation and JavaScript supplies programmable behaviour. The language can also run in other environments, so do not assume that every JavaScript program has a web page to manipulate.\n\nThis first lesson uses console mode. The practice runtime is isolated from the main website and prints output from `console.log`. It is not an unrestricted browser tab. Do not use external packages, network requests, `alert`, `prompt` or browser storage here. A later lesson introduces the separate Interactive DOM preview and its supported interfaces.\n\n## Example 1: print an exact message\n\n```javascript\nconsole.log(\"Ready to practise\");\nconsole.log(\"Read, predict, run, compare\");\n```\n\nExpected output:\n\n```text\nReady to practise\nRead, predict, run, compare\n```\n\nThe quoted text is a string value. Its quote characters delimit the value; they do not appear in this output. Parentheses contain the value passed to `console.log`, and the dot accesses `log` on `console`. Each call writes its message to the output panel. Here, the semicolon marks the end of an instruction. JavaScript can insert some semicolons automatically, but explicit consistent punctuation is useful while learning.\n\n## Example 2: compare numbers with numeric-looking text\n\n```javascript\nconsole.log(12 + 3);\nconsole.log(\"12\" + \"3\");\nconsole.log(12 * 3);\n```\n\nExpected output:\n\n```text\n15\n123\n36\n```\n\nThe first expression adds two numbers. The second joins two strings; quotation marks change the kind of value, even though the characters look numeric. The multiplication operator is an asterisk. Expressions are evaluated before their results are printed. Be precise about value types rather than relying on what a value looks like on screen. Later lessons cover conversion and the additional behaviours of operators in detail.\n\n## Example 3: give values useful names\n\n```javascript\nconst price = 150;\nconst quantity = 2;\nconst total = price * quantity;\n\nconsole.log(total);\n```\n\nExpected output:\n\n```text\n300\n```\n\n`const` declares a binding with a name. The equals sign supplies its initial value; it is not an equality comparison. Read the instructions from top to bottom: `price` receives 150, `quantity` receives 2, and `total` receives the calculated product. Printing a name reads the value associated with it.\n\nUse meaningful names such as `quantity`, not an unrelated label chosen only to shorten typing. JavaScript distinguishes uppercase and lowercase letters, so `Price` and `price` are different names. A `const` binding cannot be reassigned. Future lessons compare `const` with `let` and explain what this rule does and does not imply for objects.\n\n## Errors provide clues\n\nAn unmatched quote or missing closing parenthesis can produce a syntax error before the intended output appears. Reading a name that has not been declared produces a different kind of error. Neither means that you should replace the whole program. Read the message, inspect the indicated area and compare the source against the intended instruction.\n\nTry changing `quantity` to 4 in Example 3. Predict 600 before running it. Then change only the final call to `console.log(price)`. Predict 150: declaring `total` does not change the original price. This small experiment separates calculating a new value from changing an existing one.\n\n## Independent exercise\n\nWrite a program that declares a ticket price and a ticket count, calculates a total and prints it. Add a separate printed heading describing the calculation. Use only numbers, strings, `const`, multiplication and `console.log`; do not introduce input boxes or DOM operations yet.\n\n```hint\nStart with two constant declarations. Give the product its own name before printing it, so each step has a clear purpose.\n```\n\n```solution\nFor example, const ticketPrice = 200; const ticketCount = 3; const ticketTotal = ticketPrice * ticketCount; followed by console.log(\"Ticket total\"); and console.log(ticketTotal); prints a heading and then 600. Different sensible names and values are valid.\n```\n\n## Trace a value before trusting its appearance\n\nA console displays characters, but the program operates on values with types. The same digits can be a number in one expression and a string in another. Read the quotation marks in the source before predicting what + will do. Named results are also values, not live spreadsheet formulas. The program calculates the expression at the moment that instruction executes. Reading an input binding to calculate a new total does not change that input binding. Keep those ideas separate when debugging an unexpected result.\n\n<PredictOutput title=\"Will both calls print the same thing?\" code=\"console.log(100 + 20);&#10;console.log(&quot;100&quot; + &quot;20&quot;);\" options=\"[&quot;First 120, then 10020&quot;,&quot;120 on both lines&quot;,&quot;10020 on both lines&quot;,&quot;First 10020, then 120&quot;]\" answer=\"0\" explanation=\"The first expression adds numbers. The second concatenates strings. Quotation marks determine the value kind in this example.\" />\n\n<CodeTrace title=\"Follow a ticket total\" steps=\"[{&quot;line&quot;:&quot;const price = 90;&quot;,&quot;explanation&quot;:&quot;Create the price binding with a numeric value. There is no calculation of a total yet.&quot;,&quot;values&quot;:&quot;price = 90&quot;},{&quot;line&quot;:&quot;const quantity = 4;&quot;,&quot;explanation&quot;:&quot;Create a separate quantity binding. The original price remains unchanged.&quot;,&quot;values&quot;:&quot;price = 90; quantity = 4&quot;},{&quot;line&quot;:&quot;const total = price * quantity;&quot;,&quot;explanation&quot;:&quot;Read both input values and multiply them. Store the resulting number in a new binding.&quot;,&quot;values&quot;:&quot;price = 90; quantity = 4; total = 360&quot;},{&quot;line&quot;:&quot;console.log(total);&quot;,&quot;explanation&quot;:&quot;Read total and write its value to the output panel. Printing is not an assignment to price or quantity.&quot;,&quot;values&quot;:&quot;Output: 360&quot;}]\" />\n\n<TryExample title=\"Change inputs without changing the calculation\" code=\"const price = 90;&#10;const quantity = 4;&#10;const total = price * quantity;&#10;console.log(&quot;Ticket total&quot;);&#10;console.log(total);\" task=\"Predict the two output lines, then run. Change the quantity declaration to 5 and run again. Explain why the multiplication line can stay unchanged. Keep this in console mode; no DOM or external service is needed.\" />\n\n\n<Understand title=\"Understand JavaScript values and calculations\" stages=\"[{&quot;title&quot;:&quot;Separate values from their appearance&quot;,&quot;explanation&quot;:&quot;Digits can appear inside a string or inside a numeric literal. Reconstruct what each expression evaluates to before console.log prints it.&quot;,&quot;code&quot;:&quot;console.log(10 + 5);\\nconsole.log(\\&quot;10\\&quot; + \\&quot;5\\&quot;);&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;First expression value&quot;,&quot;options&quot;:[&quot;105 (string)&quot;,&quot;15 (number)&quot;,&quot;50 (number)&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Second expression value&quot;,&quot;options&quot;:[&quot;15 (number)&quot;,&quot;105 (string)&quot;,&quot;50 (number)&quot;],&quot;answer&quot;:1}],&quot;hint&quot;:&quot;For these two-number operands + adds. For these two-string operands + concatenates.&quot;,&quot;success&quot;:&quot;The first expression produces the number 15; the second produces the string \\&quot;105\\&quot;.&quot;},{&quot;title&quot;:&quot;Read the input bindings&quot;,&quot;explanation&quot;:&quot;Named constants make the calculation explicit. Reconstruct the state after these declarations.&quot;,&quot;code&quot;:&quot;const price = 90;\\nconst quantity = 4;\\nconst total = price * quantity;&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;price value&quot;,&quot;options&quot;:[&quot;360&quot;,&quot;90&quot;,&quot;4&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;quantity value&quot;,&quot;options&quot;:[&quot;4&quot;,&quot;90&quot;,&quot;360&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;total value&quot;,&quot;options&quot;:[&quot;94&quot;,&quot;904&quot;,&quot;360&quot;],&quot;answer&quot;:2}],&quot;hint&quot;:&quot;Multiplication reads the two numeric inputs. It does not replace either input.&quot;,&quot;success&quot;:&quot;price remains 90 and quantity remains 4. The product 360 is assigned to total.&quot;},{&quot;title&quot;:&quot;Print a value, not its name&quot;,&quot;explanation&quot;:&quot;A quoted word is a string literal. An unquoted identifier reads its binding. Complete the output cards.&quot;,&quot;code&quot;:&quot;const total = 360;\\nconsole.log(\\&quot;total\\&quot;);\\nconsole.log(total);&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;First printed line&quot;,&quot;options&quot;:[&quot;360&quot;,&quot;total&quot;,&quot;undefined&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Second printed line&quot;,&quot;options&quot;:[&quot;total&quot;,&quot;undefined&quot;,&quot;360&quot;],&quot;answer&quot;:2}],&quot;hint&quot;:&quot;Quotation marks are part of the source syntax; they decide whether this is a literal or a binding lookup.&quot;,&quot;success&quot;:&quot;The first line is the literal word total. The second line is the value 360 read from the binding.&quot;}]\" />\n",
    "starterCode": "const ticketPrice = 200;\nconst ticketCount = 3;\n// Calculate and print the total below.\n",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What does console.log(12 + 3) print?",
        "explanation": "Both operands are numbers, so + adds them before the result is printed.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "123"
          },
          {
            "id": "b",
            "text": "15"
          },
          {
            "id": "c",
            "text": "12 + 3"
          },
          {
            "id": "d",
            "text": "36"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What does console.log(\"12\" + \"3\") print?",
        "explanation": "Both operands are strings, so + joins them.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "15"
          },
          {
            "id": "b",
            "text": "123"
          },
          {
            "id": "c",
            "text": "36"
          },
          {
            "id": "d",
            "text": "An HTML paragraph"
          }
        ]
      },
      {
        "id": "q3",
        "question": "Which operator multiplies two numbers?",
        "explanation": "The asterisk is the multiplication operator.",
        "correctOptionId": "a",
        "options": [
          {
            "id": "a",
            "text": "*"
          },
          {
            "id": "b",
            "text": "x"
          },
          {
            "id": "c",
            "text": ":"
          },
          {
            "id": "d",
            "text": "#"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which instruction declares a named constant?",
        "explanation": "JavaScript uses const followed by a binding name and an initialiser.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "constant price: 20"
          },
          {
            "id": "b",
            "text": "const price = 20;"
          },
          {
            "id": "c",
            "text": "$price = 20;"
          },
          {
            "id": "d",
            "text": "price := 20"
          }
        ]
      },
      {
        "id": "q5",
        "question": "Are price and Price the same JavaScript name?",
        "explanation": "JavaScript names are case-sensitive.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "Always"
          },
          {
            "id": "b",
            "text": "No, letter case matters"
          },
          {
            "id": "c",
            "text": "Only inside console.log"
          },
          {
            "id": "d",
            "text": "Only when both are numbers"
          }
        ]
      },
      {
        "id": "q6",
        "question": "What does const total = 150 * 2; console.log(total); print?",
        "explanation": "The expression evaluates to 300, which is assigned to total and then printed.",
        "correctOptionId": "c",
        "options": [
          {
            "id": "a",
            "text": "150"
          },
          {
            "id": "b",
            "text": "2"
          },
          {
            "id": "c",
            "text": "300"
          },
          {
            "id": "d",
            "text": "total"
          }
        ]
      },
      {
        "id": "q7",
        "question": "Which output method is supported for these console-mode examples?",
        "explanation": "This lesson uses console.log in the isolated console runtime.",
        "correctOptionId": "c",
        "options": [
          {
            "id": "a",
            "text": "alert(\"Hi\")"
          },
          {
            "id": "b",
            "text": "prompt(\"Hi\")"
          },
          {
            "id": "c",
            "text": "console.log(\"Hi\")"
          },
          {
            "id": "d",
            "text": "A production network request"
          }
        ]
      },
      {
        "id": "q8",
        "question": "Does calculating total automatically change the original price binding?",
        "explanation": "Reading price in an expression does not assign a new value to price.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "Yes, all input bindings change"
          },
          {
            "id": "b",
            "text": "No, the expression calculates a separate result"
          },
          {
            "id": "c",
            "text": "Only on mobile"
          },
          {
            "id": "d",
            "text": "Only for multiplication"
          }
        ]
      }
    ],
    "questionsPerAttempt": 4,
    "assignment": {
      "instructions": "In console mode, declare a ticketPrice and ticketCount with const. Calculate ticketTotal using multiplication, then print a descriptive heading and the total using separate console.log calls. Choose positive numeric input values. Do not use DOM operations, external services, loops or input dialogs in this introductory exercise.",
      "hints": [
        "Review the three worked examples before changing your own program.",
        "Run a small version first and compare its output with your prediction."
      ],
      "requiredConcepts": [
        "strings and numbers",
        "const declarations",
        "multiplication",
        "console.log"
      ],
      "allowedConcepts": [
        "strings and numbers",
        "const declarations",
        "multiplication",
        "console.log"
      ],
      "prohibitedConcepts": [],
      "starterCode": "const ticketPrice = 200;\nconst ticketCount = 3;\n// Calculate and print the total below.\n",
      "rubric": [
        {
          "id": "requirements",
          "description": "Meet the stated task requirements using the taught concepts.",
          "points": 40
        },
        {
          "id": "behaviour",
          "description": "Produce the required output or visible page behaviour.",
          "points": 35
        },
        {
          "id": "clarity",
          "description": "Use readable structure, meaningful names and a clear explanation.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-php-001",
    "languageId": "php",
    "slug": "first-php-program",
    "title": "Your First PHP Program",
    "summary": "Understand browser practice versus a PHP server, print exact text, and calculate a total with named variables.",
    "order": 1,
    "version": 1,
    "objectives": [
      "Use PHP tags and echo statements correctly",
      "Calculate and print a total with initialised variables"
    ],
    "prerequisiteIds": [],
    "content": "## PHP and the environment running it\n\nPHP is a programming language commonly used on web servers. In a normal web application, a server runs the PHP program and sends its output to a browser. The browser does not run the server's PHP source merely because someone included it in an HTML file.\n\nOur practice editor uses a PHP interpreter compiled to WebAssembly, running in your browser. This lets you practise language features without renting a server. It does not create a public PHP backend, connect to a production database or reproduce every web-server feature. Later lessons distinguish portable language examples from examples that require a separate server environment. Never put production credentials into a practice program.\n\n## Example 1: produce plain text\n\n```php\n<?php\necho \"Welcome to PHP\\n\";\necho \"Run one example at a time.\\n\";\n```\n\nExpected output:\n\n```text\nWelcome to PHP\nRun one example at a time.\n```\n\n`<?php` starts PHP code. `echo` writes output, and each semicolon ends a statement. The double-quoted `\\n` escape produces a newline in this text output. In a file containing only PHP, leaving out the closing PHP tag is an established way to avoid accidentally emitting trailing material outside the program.\n\nThe output panel here displays text. In a web application, the context consuming output matters: an HTML response interprets markup and normally collapses ordinary whitespace. A newline in text output is not a universal substitute for an HTML element.\n\n## Example 2: calculate before printing\n\n```php\n<?php\necho 8 + 4;\necho \"\\n\";\necho 8 * 4;\necho \"\\n\";\n```\n\nExpected output:\n\n```text\n12\n32\n```\n\nArithmetic expressions produce values before `echo` writes them. The plus sign performs addition here, and the asterisk performs multiplication. The numbers are not quoted strings. Later lessons explain types, numeric conversion and operator precedence; for now, use deliberate simple expressions so the result is unambiguous.\n\nPredict the result after changing only the first expression to `(8 + 4) * 2`. Parentheses make that grouping explicit. It should print 24 on the first output line while the second calculation remains unchanged.\n\n## Example 3: named values make calculations readable\n\n```php\n<?php\n$price = 120;\n$quantity = 3;\n$total = $price * $quantity;\n\necho \"Total: \";\necho $total;\necho \"\\n\";\n```\n\nExpected output:\n\n```text\nTotal: 360\n```\n\nPHP variable names begin with `$`. The assignment operator associates a value with the variable. Read this example as a sequence: establish a price, establish a quantity, calculate their product, then write the label and result. Variables make it possible to change an input value without hunting for unrelated repeated numbers.\n\nVariable names are case-sensitive. `$price` and `$Price` do not identify the same variable. Use descriptive consistent names, and initialise each variable before reading it. A misspelled name can produce a diagnostic even when a similar-looking name was assigned earlier.\n\n## Debugging and boundaries\n\nStart by checking the opening tag, matching quotes, variable spelling and semicolons. A parser error near a later line can originate from an earlier missing quote or semicolon. Change one fault at a time and run the program again. Do not hide diagnostic messages to make a broken example appear successful.\n\nThis lesson needs no file reads, database connection or network request. Keeping the first programs self-contained makes their behaviour reproducible in the browser interpreter and on a suitably configured PHP installation.\n\n## Independent exercise\n\nDeclare a notebook price and a notebook quantity. Calculate a total and print a readable label followed by the total and a newline. Choose your own sensible positive values. Explain which lines set input values and which line calculates the result.\n\n```hint\nEvery reference to a PHP variable needs its dollar sign. Keep the arithmetic separate from the output statements so you can inspect each step.\n```\n\n```solution\nWith $notebookPrice = 75; and $notebookQuantity = 4;, assigning their product to $notebookTotal and echoing that value produces 300. Add an explicit text label and a newline using separate echo statements.\n```\n\n## Connect a PHP statement to its output\n\nThe interpreter runs the PHP instructions, and echo writes the output they produce. The browser practice runtime is an interpreter, not a public web server. That distinction matters when reading examples elsewhere: a form, session or database example can depend on server configuration that this isolated exercise does not supply. Here the inputs are explicit variables, so you can reproduce each calculation without hidden environment state. Follow the dollar signs, statement boundaries and output calls rather than guessing from the final text.\n\n<PredictOutput title=\"What number will echo write?\" code=\"&lt;?php&#10;$price = 75;&#10;$quantity = 4;&#10;echo $price * $quantity;\" options=\"[&quot;300&quot;,&quot;754&quot;,&quot;79&quot;,&quot;The variable name itself&quot;]\" answer=\"0\" explanation=\"Both variables contain numbers. Their product is 300, which echo writes as output.\" />\n\n<CodeTrace title=\"Follow the notebook calculation\" steps=\"[{&quot;line&quot;:&quot;$price = 120;&quot;,&quot;explanation&quot;:&quot;Initialise the variable before reading it. The dollar sign belongs to each variable reference.&quot;,&quot;values&quot;:&quot;$price = 120&quot;},{&quot;line&quot;:&quot;$quantity = 3;&quot;,&quot;explanation&quot;:&quot;Initialise the other input. These are two separate assignments.&quot;,&quot;values&quot;:&quot;$price = 120; $quantity = 3&quot;},{&quot;line&quot;:&quot;$total = $price * $quantity;&quot;,&quot;explanation&quot;:&quot;Calculate the product and assign the result. This step does not print anything.&quot;,&quot;values&quot;:&quot;$total = 360; output is still empty.&quot;},{&quot;line&quot;:&quot;echo $total;&quot;,&quot;explanation&quot;:&quot;Read the calculated value and write it to the output panel.&quot;,&quot;values&quot;:&quot;Output: 360&quot;}]\" />\n\n<TryExample title=\"Keep calculation and output separate\" code=\"&lt;?php&#10;$price = 120;&#10;$quantity = 3;&#10;$total = $price * $quantity;&#10;echo &quot;Notebook total: &quot;;&#10;echo $total;&#10;echo &quot;\\n&quot;;\" task=\"Run this self-contained example. Change the quantity to 2 and predict the new output before running again. Explain the difference between assigning total and echoing total. Do not add a database connection or file access.\" />\n\n\n<Understand title=\"Understand PHP variables, arithmetic and output\" stages=\"[{&quot;title&quot;:&quot;Name a variable&quot;,&quot;explanation&quot;:&quot;The dollar sign is part of PHP variable syntax. Reconstruct the stored value and the text produced by echo.&quot;,&quot;code&quot;:&quot;&lt;?php\\n$price = 75;\\necho $price;&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Variable name in source&quot;,&quot;options&quot;:[&quot;price&quot;,&quot;$price&quot;,&quot;#price&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Echo output&quot;,&quot;options&quot;:[&quot;$price&quot;,&quot;75&quot;,&quot;price&quot;],&quot;answer&quot;:1}],&quot;hint&quot;:&quot;echo reads the variable expression rather than printing its source spelling.&quot;,&quot;success&quot;:&quot;$price is the variable expression and echo outputs its value, 75.&quot;},{&quot;title&quot;:&quot;Calculate before echo&quot;,&quot;explanation&quot;:&quot;Evaluate the multiplication and keep its result in a separate variable. The input values remain unchanged.&quot;,&quot;code&quot;:&quot;&lt;?php\\n$price = 75;\\n$quantity = 4;\\n$total = $price * $quantity;\\necho $total;&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Final price&quot;,&quot;options&quot;:[&quot;300&quot;,&quot;75&quot;,&quot;4&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Final total&quot;,&quot;options&quot;:[&quot;754&quot;,&quot;79&quot;,&quot;300&quot;],&quot;answer&quot;:2},{&quot;label&quot;:&quot;Output&quot;,&quot;options&quot;:[&quot;300&quot;,&quot;$total&quot;,&quot;75&quot;],&quot;answer&quot;:0}],&quot;hint&quot;:&quot;The asterisk multiplies numbers. Assignment gives that result to total.&quot;,&quot;success&quot;:&quot;The product is 300. The price remains 75, and echo reads total.&quot;},{&quot;title&quot;:&quot;Notice statement order&quot;,&quot;explanation&quot;:&quot;Reassigning an input does not execute earlier calculations again. Reconstruct the final state.&quot;,&quot;code&quot;:&quot;&lt;?php\\n$quantity = 4;\\n$total = 75 * $quantity;\\n$quantity = 5;\\necho $total;&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Final quantity&quot;,&quot;options&quot;:[&quot;4&quot;,&quot;5&quot;,&quot;300&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Final total&quot;,&quot;options&quot;:[&quot;375&quot;,&quot;5&quot;,&quot;300&quot;],&quot;answer&quot;:2},{&quot;label&quot;:&quot;Output&quot;,&quot;options&quot;:[&quot;300&quot;,&quot;375&quot;,&quot;5&quot;],&quot;answer&quot;:0}],&quot;hint&quot;:&quot;There is only one total assignment, before quantity changes.&quot;,&quot;success&quot;:&quot;quantity becomes 5, but total remains 300. Recalculate total explicitly if the new quantity should affect it.&quot;}]\" />\n",
    "starterCode": "<?php\n$notebookPrice = 75;\n$notebookQuantity = 4;\n// Calculate and print the total below.\n",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "Which opening tag starts the PHP code used in this course?",
        "explanation": "The standard PHP opening tag is <?php.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "<php>"
          },
          {
            "id": "b",
            "text": "<?php"
          },
          {
            "id": "c",
            "text": "<script php>"
          },
          {
            "id": "d",
            "text": "<!php>"
          }
        ]
      },
      {
        "id": "q2",
        "question": "Which prefix identifies the variable price in PHP?",
        "explanation": "PHP variable names begin with a dollar sign.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "#price"
          },
          {
            "id": "b",
            "text": "$price"
          },
          {
            "id": "c",
            "text": "@price"
          },
          {
            "id": "d",
            "text": ".price"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What does echo 8 + 4; output?",
        "explanation": "The numeric expression evaluates to 12 before echo outputs it.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "84"
          },
          {
            "id": "b",
            "text": "12"
          },
          {
            "id": "c",
            "text": "8 + 4"
          },
          {
            "id": "d",
            "text": "32"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement explicitly ends with the required punctuation?",
        "explanation": "A semicolon ends this echo statement.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "echo \"Hi\":"
          },
          {
            "id": "b",
            "text": "echo \"Hi\";"
          },
          {
            "id": "c",
            "text": "echo \"Hi\","
          },
          {
            "id": "d",
            "text": "echo \"Hi\"."
          }
        ]
      },
      {
        "id": "q5",
        "question": "What does a double-quoted \\n represent in the text output examples?",
        "explanation": "Within a double-quoted PHP string, \\n represents a newline character.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "The letter n only"
          },
          {
            "id": "b",
            "text": "A newline"
          },
          {
            "id": "c",
            "text": "An HTML heading"
          },
          {
            "id": "d",
            "text": "A new variable"
          }
        ]
      },
      {
        "id": "q6",
        "question": "Does this browser interpreter create a public production PHP backend?",
        "explanation": "The browser interpreter is not a hosted PHP application server.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "Yes, automatically"
          },
          {
            "id": "b",
            "text": "No, it is an isolated language-practice runtime"
          },
          {
            "id": "c",
            "text": "Only when echo is used"
          },
          {
            "id": "d",
            "text": "Only with four variables"
          }
        ]
      },
      {
        "id": "q7",
        "question": "For $price = 120; $quantity = 3;, what is $price * $quantity?",
        "explanation": "Multiplying 120 by 3 gives 360.",
        "correctOptionId": "c",
        "options": [
          {
            "id": "a",
            "text": "123"
          },
          {
            "id": "b",
            "text": "40"
          },
          {
            "id": "c",
            "text": "360"
          },
          {
            "id": "d",
            "text": "1203"
          }
        ]
      },
      {
        "id": "q8",
        "question": "Are $price and $Price the same variable?",
        "explanation": "The different letter case creates distinct variable names.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "Yes"
          },
          {
            "id": "b",
            "text": "No, PHP variable names are case-sensitive"
          },
          {
            "id": "c",
            "text": "Only when echoed"
          },
          {
            "id": "d",
            "text": "Only in a browser"
          }
        ]
      }
    ],
    "questionsPerAttempt": 4,
    "assignment": {
      "instructions": "Declare a notebook price and a notebook quantity, calculate their product in a named variable, and print a descriptive label followed by the total and a newline. Use the PHP opening tag, initialise variables before reading them, and end statements with semicolons. Do not use files, databases, external services or browser-side HTML controls.",
      "hints": [
        "Review the three worked examples before changing your own program.",
        "Run a small version first and compare its output with your prediction."
      ],
      "requiredConcepts": [
        "PHP variables",
        "assignment",
        "multiplication",
        "echo statements"
      ],
      "allowedConcepts": [
        "PHP variables",
        "assignment",
        "multiplication",
        "echo statements"
      ],
      "prohibitedConcepts": [],
      "starterCode": "<?php\n$notebookPrice = 75;\n$notebookQuantity = 4;\n// Calculate and print the total below.\n",
      "rubric": [
        {
          "id": "requirements",
          "description": "Meet the stated task requirements using the taught concepts.",
          "points": 40
        },
        {
          "id": "behaviour",
          "description": "Produce the required output or visible page behaviour.",
          "points": 35
        },
        {
          "id": "clarity",
          "description": "Use readable structure, meaningful names and a clear explanation.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-001",
    "languageId": "python",
    "slug": "values-names-and-output",
    "title": "Python Values, Names and Output",
    "summary": "Predict printed output, distinguish numeric and string values, and explain assignment and execution order.",
    "order": 1,
    "version": 1,
    "objectives": [
      "Predict output from simple expressions",
      "Calculate a named result in the correct execution order"
    ],
    "prerequisiteIds": [],
    "content": "## A program is a sequence of instructions\n\nPython lets you express calculations and other operations as readable instructions. The interpreter reads and executes a program according to the language's rules. Small programs are useful because you can predict each instruction's effect and compare that prediction with the actual result.\n\nThe practice editor runs Python through Pyodide inside an isolated browser runtime. These examples need only the bundled interpreter. They do not need package installation, external network access or persistent files. Later lessons will explain the standard library and distinguish portable language exercises from programs needing additional services.\n\n## Example 1: print strings\n\n```python\nprint(\"Learning Python\")\nprint(\"Predict before you run\")\n```\n\nExpected output:\n\n```text\nLearning Python\nPredict before you run\n```\n\nThe quoted text is a string. `print` receives the value inside its parentheses and writes it to the output panel. In this example each call ends its output with a newline, so the messages occupy separate lines. The quotes identify the string in source code but are not part of the printed message.\n\nYou can use either matching single quotes or matching double quotes for these simple strings. Start and finish a string deliberately; an unmatched quote causes a syntax error. Copying a sentence from a word processor can introduce typographic quotation marks that are not the ordinary source-code delimiters shown here.\n\n## Example 2: numbers and strings are different values\n\n```python\nprint(10 + 5)\nprint(\"10\" + \"5\")\nprint(10 * 5)\n```\n\nExpected output:\n\n```text\n15\n105\n50\n```\n\nThe first line adds numbers. The second joins strings; adding quote marks changes the kind of value the program is working with. The third line multiplies numbers using `*`. Python evaluates the expression before passing its result to `print`.\n\nDo not guess a value's type merely from the characters displayed in output. A printed string containing digits can look like a printed number. Later lessons use explicit type inspection and conversion to make that distinction visible. For now, read the source and identify which values have string delimiters.\n\n## Example 3: calculate with named values\n\n```python\nprice = 90\nquantity = 4\ntotal = price * quantity\n\nprint(total)\n```\n\nExpected output:\n\n```text\n360\n```\n\nThe equals sign is assignment: it binds the name on the left to the value calculated on the right. It does not ask whether two things are equal. The first two lines establish inputs, the third calculates a result, and the final line displays that result.\n\nNames are case-sensitive. `quantity` and `Quantity` are different names. Choose clear names and use them consistently. Python does not require a dollar sign or a `const` keyword for these assignments. We will investigate names, changing values and object behaviour in more depth in subsequent lessons.\n\n## Reason about execution order\n\nIf you change `quantity` to 5 before the `total` assignment, the product becomes 450. If you add `quantity = 5` after the `total` assignment, printing the existing `total` still gives 360: the earlier calculation is not a spreadsheet formula that automatically recalculates whenever another name changes.\n\nTo calculate using the new quantity, execute the multiplication assignment again. Predict this behaviour, edit one example and verify it. Understanding execution order is more valuable than memorising the sample numbers.\n\n## Mistakes and independent practice\n\nCheck matching parentheses and quotes when a syntax error occurs. Check spelling and execution order when a name is not defined. Do not indent every line randomly: indentation has a structural role in Python, which we will study with conditional statements and loops. The top-level statements in this lesson start at the left margin.\n\nWrite a program that names a number of study days and a number of minutes per day, calculates total minutes and prints both a label and the result. Use only assignments, multiplication, strings and `print`.\n\n```hint\nCalculate total_minutes = study_days * minutes_per_day after assigning both input names.\n```\n\n```solution\nFor study_days = 5 and minutes_per_day = 30, the multiplication gives 150. A separate print(\"Planned study minutes\") call can label the number printed by print(total_minutes).\n```\n\n## A named result is not an automatically updating formula\n\nExecution order is one of the most useful mental models for a beginner. Python evaluates an assignment when it reaches that instruction. A total calculated earlier does not automatically update just because a different input name receives a new value afterwards. That behaviour is different from a spreadsheet cell that contains a continuing formula. You must execute the calculation again when you need a new result. Trace this distinction carefully before introducing loops or functions, because those later tools still rely on the same execution model.\n\n<PredictOutput title=\"Does changing quantity recalculate total?\" code=\"quantity = 4&#10;total = 90 * quantity&#10;quantity = 5&#10;print(total)\" options=\"[&quot;360&quot;,&quot;450&quot;,&quot;5&quot;,&quot;90&quot;]\" answer=\"0\" explanation=\"total was assigned the value 360 before quantity changed. The final print reads that existing total; it does not rerun the multiplication.\" />\n\n<CodeTrace title=\"Inspect the names after each instruction\" steps=\"[{&quot;line&quot;:&quot;quantity = 4&quot;,&quot;explanation&quot;:&quot;Bind quantity to the first numeric input value.&quot;,&quot;values&quot;:&quot;quantity = 4; total has not been assigned.&quot;},{&quot;line&quot;:&quot;total = 90 * quantity&quot;,&quot;explanation&quot;:&quot;Evaluate the multiplication now, using quantity equal to 4.&quot;,&quot;values&quot;:&quot;quantity = 4; total = 360&quot;},{&quot;line&quot;:&quot;quantity = 5&quot;,&quot;explanation&quot;:&quot;Rebind quantity. This instruction does not assign anything to total.&quot;,&quot;values&quot;:&quot;quantity = 5; total = 360&quot;},{&quot;line&quot;:&quot;print(total)&quot;,&quot;explanation&quot;:&quot;Read the current value of total and display it.&quot;,&quot;values&quot;:&quot;Output: 360&quot;}]\" />\n\n<TryExample title=\"Recalculate deliberately\" code=\"quantity = 4&#10;total = 90 * quantity&#10;quantity = 5&#10;print(total)&#10;total = 90 * quantity&#10;print(total)\" task=\"Predict both output lines, then run. Explain which instruction makes the second total different. Change the numeric inputs and repeat the reasoning. Use assignments and print only, not lists, loops or input calls.\" />\n\n\n<Understand title=\"Understand Python names and changing values\" experiment=\"python-bindings\" stages=\"[{&quot;title&quot;:&quot;Bind a name&quot;,&quot;explanation&quot;:&quot;Assignment evaluates the expression on the right and binds the name on the left. The cards below model name-to-value relationships, not literal physical memory boxes. Complete both cards.&quot;,&quot;code&quot;:&quot;days = 5\\nprint(days)&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;days refers to&quot;,&quot;options&quot;:[&quot;\\&quot;5\\&quot; (string)&quot;,&quot;5 (integer)&quot;,&quot;days (text)&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Printed output&quot;,&quot;options&quot;:[&quot;days&quot;,&quot;0&quot;,&quot;5&quot;],&quot;answer&quot;:2}],&quot;hint&quot;:&quot;Quotation marks create a string literal. Here the assigned literal has no quotation marks. print reads the name.&quot;,&quot;success&quot;:&quot;days refers to the integer 5. print reads that value and displays 5.&quot;},{&quot;title&quot;:&quot;Keep a calculated result&quot;,&quot;explanation&quot;:&quot;Read each line in order. A total is calculated at assignment time; it is not a spreadsheet formula that follows future changes. Use the cards to reconstruct the final state.&quot;,&quot;code&quot;:&quot;days = 5\\ntotal = days * 30\\ndays = 6\\nprint(total)&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Final days value&quot;,&quot;options&quot;:[&quot;5&quot;,&quot;6&quot;,&quot;150&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Final total value&quot;,&quot;options&quot;:[&quot;180&quot;,&quot;6&quot;,&quot;150&quot;],&quot;answer&quot;:2},{&quot;label&quot;:&quot;Printed output&quot;,&quot;options&quot;:[&quot;150&quot;,&quot;180&quot;,&quot;6&quot;],&quot;answer&quot;:0}],&quot;hint&quot;:&quot;The multiplication happens before days is rebound. No later instruction assigns a new value to total.&quot;,&quot;success&quot;:&quot;days is now 6, but total still refers to the previously calculated integer 150. Changing one binding does not rerun earlier code.&quot;},{&quot;title&quot;:&quot;Recalculate deliberately&quot;,&quot;explanation&quot;:&quot;Now explicitly calculate total again after changing days. Compare this result with the previous part and explain which extra instruction made the difference.&quot;,&quot;code&quot;:&quot;days = 5\\ntotal = days * 30\\ndays = 6\\ntotal = days * 30\\nprint(total)&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Final days value&quot;,&quot;options&quot;:[&quot;150&quot;,&quot;5&quot;,&quot;6&quot;],&quot;answer&quot;:2},{&quot;label&quot;:&quot;Final total value&quot;,&quot;options&quot;:[&quot;150&quot;,&quot;180&quot;,&quot;30&quot;],&quot;answer&quot;:1},{&quot;label&quot;:&quot;Printed output&quot;,&quot;options&quot;:[&quot;180&quot;,&quot;150&quot;,&quot;days&quot;],&quot;answer&quot;:0}],&quot;hint&quot;:&quot;On the second multiplication, days already refers to 6. Evaluate that expression using the current value.&quot;,&quot;success&quot;:&quot;The second calculation produces 180 and rebinds total. This is an explicit recalculation, not an automatic link between names.&quot;}]\" />\n",
    "starterCode": "study_days = 5\nminutes_per_day = 30\n# Calculate and print the total below.\n",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What does print(10 + 5) output?",
        "explanation": "The operands are numbers, so the expression adds them.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "105"
          },
          {
            "id": "b",
            "text": "15"
          },
          {
            "id": "c",
            "text": "50"
          },
          {
            "id": "d",
            "text": "10 + 5"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What does print(\"10\" + \"5\") output?",
        "explanation": "The + operator concatenates these two strings.",
        "correctOptionId": "c",
        "options": [
          {
            "id": "a",
            "text": "15"
          },
          {
            "id": "b",
            "text": "50"
          },
          {
            "id": "c",
            "text": "105"
          },
          {
            "id": "d",
            "text": "5"
          }
        ]
      },
      {
        "id": "q3",
        "question": "Which instruction assigns 5 to a Python name?",
        "explanation": "A simple Python assignment uses a name, equals sign and expression.",
        "correctOptionId": "c",
        "options": [
          {
            "id": "a",
            "text": "const days = 5;"
          },
          {
            "id": "b",
            "text": "$days = 5;"
          },
          {
            "id": "c",
            "text": "days = 5"
          },
          {
            "id": "d",
            "text": "days:==5"
          }
        ]
      },
      {
        "id": "q4",
        "question": "What does the equals sign do in total = price * quantity?",
        "explanation": "The right-hand expression is evaluated and its value is bound to the name on the left.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "It checks whether two values are equal"
          },
          {
            "id": "b",
            "text": "It assigns the calculated product to total"
          },
          {
            "id": "c",
            "text": "It prints total"
          },
          {
            "id": "d",
            "text": "It starts a comment"
          }
        ]
      },
      {
        "id": "q5",
        "question": "Are quantity and Quantity the same name?",
        "explanation": "Letter case matters in Python names.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "Yes"
          },
          {
            "id": "b",
            "text": "No, Python names are case-sensitive"
          },
          {
            "id": "c",
            "text": "Only in print calls"
          },
          {
            "id": "d",
            "text": "Only when both contain strings"
          }
        ]
      },
      {
        "id": "q6",
        "question": "What is printed after quantity = 4; total = 90 * quantity; quantity = 5; print(total)?",
        "explanation": "Changing quantity afterwards does not recalculate the previously assigned total.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "450"
          },
          {
            "id": "b",
            "text": "360"
          },
          {
            "id": "c",
            "text": "5"
          },
          {
            "id": "d",
            "text": "90"
          }
        ]
      },
      {
        "id": "q7",
        "question": "What normally follows each simple print call in these examples?",
        "explanation": "The default print behaviour ends each call with a newline.",
        "correctOptionId": "a",
        "options": [
          {
            "id": "a",
            "text": "A newline in the output"
          },
          {
            "id": "b",
            "text": "A new variable"
          },
          {
            "id": "c",
            "text": "A browser popup"
          },
          {
            "id": "d",
            "text": "A network request"
          }
        ]
      },
      {
        "id": "q8",
        "question": "Which environment runs the practice Python examples here?",
        "explanation": "The browser loads a Python interpreter through Pyodide for isolated practice.",
        "correctOptionId": "b",
        "options": [
          {
            "id": "a",
            "text": "An unrestricted production server"
          },
          {
            "id": "b",
            "text": "An isolated Pyodide browser runtime"
          },
          {
            "id": "c",
            "text": "A spreadsheet formula engine"
          },
          {
            "id": "d",
            "text": "The HTML parser"
          }
        ]
      }
    ],
    "questionsPerAttempt": 4,
    "assignment": {
      "instructions": "Assign a study_days value and a minutes_per_day value, calculate total_minutes, and print a descriptive heading followed by the result. Use numbers for the calculation and print calls for output. Avoid lists, loops, functions, input calls and external services in this first exercise. Explain why the inputs must be assigned before their product is calculated.",
      "hints": [
        "Review the three worked examples before changing your own program.",
        "Run a small version first and compare its output with your prediction."
      ],
      "requiredConcepts": [
        "Python assignment",
        "strings and numbers",
        "multiplication",
        "print calls"
      ],
      "allowedConcepts": [
        "Python assignment",
        "strings and numbers",
        "multiplication",
        "print calls"
      ],
      "prohibitedConcepts": [],
      "starterCode": "study_days = 5\nminutes_per_day = 30\n# Calculate and print the total below.\n",
      "rubric": [
        {
          "id": "requirements",
          "description": "Meet the stated task requirements using the taught concepts.",
          "points": 40
        },
        {
          "id": "behaviour",
          "description": "Produce the required output or visible page behaviour.",
          "points": 35
        },
        {
          "id": "clarity",
          "description": "Use readable structure, meaningful names and a clear explanation.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-002",
    "languageId": "python",
    "slug": "types-and-explicit-conversion",
    "title": "Python Types and Explicit Conversion",
    "summary": "Convert intentionally before an operation that requires a different kind of value.",
    "order": 2,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Types and Explicit Conversion",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA type describes the kind of value an operation receives, not how its output happens to look. The integer 12 and the string \"12\" print similar characters, but adding two integers calculates a sum while adding two strings joins text. Start by identifying literal syntax, then inspect type(value) when you need evidence. Do not fix every error by converting everything to a string: decide whether the next operation needs text or a number.\n\nConversion is an explicit request to construct a value of another type. int(\"12\") parses suitable integer text; str(12) constructs text; float(\"2.5\") parses a decimal representation. Conversion can fail. int(\"twelve\") raises ValueError because those characters are not integer syntax. int(2.9) truncates towards zero; it does not round to the nearest integer. Keep those operations distinct.\n\nFor a study-duration calculation, a numeric total should stay numeric until it is formatted for display. Store converted inputs under clear names rather than repeatedly converting the same text inside a long expression. This makes the point where validation belongs easier to find. Floating-point values also have finite precision, so printed decimal examples are not a promise of exact decimal arithmetic for money.\n\n## Example 1: Inspect the type\n\n```python\nvalue = \"12\"\nprint(type(value).__name__)\nprint(type(12).__name__)\n```\n\nExpected output:\n\n```text\nstr\nint\n```\n\nThe first literal has quotation marks and produces a string. The second is an integer. __name__ gives the type name without the class wrapper that type itself displays. The printed digits alone would not reveal this distinction.\n\n## Example 2: Calculate after parsing\n\n```python\ndays_text = \"5\"\ndays = int(days_text)\nprint(days * 30)\nprint(days_text * 2)\n```\n\nExpected output:\n\n```text\n150\n55\n```\n\nMultiplying the parsed integer performs arithmetic. Multiplying the original string by an integer repeats the text. The original variable is not changed by constructing another value with int.\n\n## Example 3: Format only at the boundary\n\n```python\nminutes = 150\nmessage = \"Minutes: \" + str(minutes)\nprint(message)\nprint(int(2.9))\n```\n\nExpected output:\n\n```text\nMinutes: 150\n2\n```\n\nThe total becomes text only for concatenation. The last line demonstrates truncation, which differs from rounding. Use the operation whose documented behaviour matches the problem.\n\n## Check the reasoning\n\nConvert intentionally before an operation that requires a different kind of value.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nStart with days_text = \"7\" and minutes_text = \"25\". Parse both, calculate a numeric total, then print a labelled message. Also print the type name of the total. Explain why concatenating the original strings is not the calculation.\n\n### Practice hint\n\nParse the two strings separately before multiplying. Keep the total numeric until you create the message.\n\n<PredictOutput title=\"Predict: Inspect the type\" code=\"value = &quot;12&quot;\nprint(type(value).__name__)\nprint(type(12).__name__)\" options=\"[&quot;str\\nint&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;str\\nint\\nNone&quot;]\" answer=\"0\" explanation=\"The first literal has quotation marks and produces a string. The second is an integer. __name__ gives the type name without the class wrapper that type itself displays. The printed digits alone would not reveal this distinction.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;value = \\&quot;12\\&quot;\\nprint(type(value).__name__)\\nprint(type(12).__name__)&quot;,&quot;explanation&quot;:&quot;The first literal has quotation marks and produces a string. The second is an integer. __name__ gives the type name without the class wrapper that type itself displays. The printed digits alone would not reveal this distinction.&quot;,&quot;values&quot;:&quot;Expected output:\\nstr\\nint&quot;},{&quot;line&quot;:&quot;days_text = \\&quot;5\\&quot;\\ndays = int(days_text)\\nprint(days * 30)\\nprint(days_text * 2)&quot;,&quot;explanation&quot;:&quot;Multiplying the parsed integer performs arithmetic. Multiplying the original string by an integer repeats the text. The original variable is not changed by constructing another value with int.&quot;,&quot;values&quot;:&quot;Expected output:\\n150\\n55&quot;},{&quot;line&quot;:&quot;minutes = 150\\nmessage = \\&quot;Minutes: \\&quot; + str(minutes)\\nprint(message)\\nprint(int(2.9))&quot;,&quot;explanation&quot;:&quot;The total becomes text only for concatenation. The last line demonstrates truncation, which differs from rounding. Use the operation whose documented behaviour matches the problem.&quot;,&quot;values&quot;:&quot;Expected output:\\nMinutes: 150\\n2&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"value = &quot;12&quot;\nprint(type(value).__name__)\nprint(type(12).__name__)\" task=\"Start with days_text = &quot;7&quot; and minutes_text = &quot;25&quot;. Parse both, calculate a numeric total, then print a labelled message. Also print the type name of the total. Explain why concatenating the original strings is not the calculation. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Types and Explicit Conversion\" stages=\"[{&quot;title&quot;:&quot;Inspect the type&quot;,&quot;explanation&quot;:&quot;The first literal has quotation marks and produces a string. The second is an integer. __name__ gives the type name without the class wrapper that type itself displays. The printed digits alone would not reveal this distinction.&quot;,&quot;code&quot;:&quot;value = \\&quot;12\\&quot;\\nprint(type(value).__name__)\\nprint(type(12).__name__)&quot;,&quot;hint&quot;:&quot;Parse the two strings separately before multiplying. Keep the total numeric until you create the message.&quot;,&quot;success&quot;:&quot;The expected output is str\\nint. The first literal has quotation marks and produces a string. The second is an integer. __name__ gives the type name without the class wrapper that type itself displays. The printed digits alone would not reveal this distinction.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;str\\nint&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;str\\nint\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The first literal has quotation marks and produces a string. The second is an integer. __name__ gives the type name without the class wrapper that type itself displays. The printed digits alone would not reveal this distinction.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Calculate after parsing&quot;,&quot;explanation&quot;:&quot;Multiplying the parsed integer performs arithmetic. Multiplying the original string by an integer repeats the text. The original variable is not changed by constructing another value with int.&quot;,&quot;code&quot;:&quot;days_text = \\&quot;5\\&quot;\\ndays = int(days_text)\\nprint(days * 30)\\nprint(days_text * 2)&quot;,&quot;hint&quot;:&quot;Parse the two strings separately before multiplying. Keep the total numeric until you create the message.&quot;,&quot;success&quot;:&quot;The expected output is 150\\n55. Multiplying the parsed integer performs arithmetic. Multiplying the original string by an integer repeats the text. The original variable is not changed by constructing another value with int.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;150\\n55&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;150\\n55\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Multiplying the parsed integer performs arithmetic. Multiplying the original string by an integer repeats the text. The original variable is not changed by constructing another value with int.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Format only at the boundary&quot;,&quot;explanation&quot;:&quot;The total becomes text only for concatenation. The last line demonstrates truncation, which differs from rounding. Use the operation whose documented behaviour matches the problem.&quot;,&quot;code&quot;:&quot;minutes = 150\\nmessage = \\&quot;Minutes: \\&quot; + str(minutes)\\nprint(message)\\nprint(int(2.9))&quot;,&quot;hint&quot;:&quot;Parse the two strings separately before multiplying. Keep the total numeric until you create the message.&quot;,&quot;success&quot;:&quot;The expected output is Minutes: 150\\n2. The total becomes text only for concatenation. The last line demonstrates truncation, which differs from rounding. Use the operation whose documented behaviour matches the problem.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Minutes: 150\\n2&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Minutes: 150\\n2\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The total becomes text only for concatenation. The last line demonstrates truncation, which differs from rounding. Use the operation whose documented behaviour matches the problem.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "value = \"12\"\nprint(type(value).__name__)\nprint(type(12).__name__)",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nvalue = \"12\"\nprint(type(value).__name__)\nprint(type(12).__name__)",
        "explanation": "The first literal has quotation marks and produces a string. The second is an integer. __name__ gives the type name without the class wrapper that type itself displays. The printed digits alone would not reveal this distinction.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "str\nint"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "str\nint\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\ndays_text = \"5\"\ndays = int(days_text)\nprint(days * 30)\nprint(days_text * 2)",
        "explanation": "Multiplying the parsed integer performs arithmetic. Multiplying the original string by an integer repeats the text. The original variable is not changed by constructing another value with int.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "150\n55"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "150\n55\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nminutes = 150\nmessage = \"Minutes: \" + str(minutes)\nprint(message)\nprint(int(2.9))",
        "explanation": "The total becomes text only for concatenation. The last line demonstrates truncation, which differs from rounding. Use the operation whose documented behaviour matches the problem.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Minutes: 150\n2"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Minutes: 150\n2\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Convert intentionally before an operation that requires a different kind of value.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Convert intentionally before an operation that requires a different kind of value."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Start with days_text = \"7\" and minutes_text = \"25\". Parse both, calculate a numeric total, then print a labelled message. Also print the type name of the total. Explain why concatenating the original strings is not the calculation.",
      "hints": [
        "Parse the two strings separately before multiplying. Keep the total numeric until you create the message.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Types and Explicit Conversion"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Types and Explicit Conversion"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-003",
    "languageId": "python",
    "slug": "strings-indexing-and-slicing",
    "title": "Python Strings, Indexing and Slicing",
    "summary": "A slice excludes its stop position and returns a new string.",
    "order": 3,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Strings, Indexing and Slicing",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA string is an immutable sequence of Unicode code points. Indexing chooses one position, beginning at zero. Negative indices count back from the end, so -1 selects the last character of a nonempty string. Immutability means assigning text[0] = \"X\" does not edit a character in place. Construct a new string when you want changed text.\n\nA slice describes a range using start:stop, where stop is excluded. Leaving start empty begins at the start; leaving stop empty continues to the end. Slicing is forgiving when a boundary extends beyond the string, but indexing a missing position raises IndexError. These are different operations, not inconsistent handling of the same request.\n\nMethods such as strip and lower return new strings. Assign their result when you need to keep it. strip removes leading and trailing whitespace, not every space inside a sentence. Work through a short concrete example before combining several methods. A visible character can contain multiple Unicode code points, so advanced text editing needs more care than assuming every index corresponds to one user-perceived character.\n\n## Example 1: Read positions\n\n```python\nword = \"Python\"\nprint(word[0])\nprint(word[-1])\nprint(len(word))\n```\n\nExpected output:\n\n```text\nP\nn\n6\n```\n\nP occupies index zero and n is the last character. len reports the sequence length. These ASCII characters each occupy one code point, making the index model easy to inspect.\n\n## Example 2: Take a slice\n\n```python\nword = \"Python\"\nprint(word[1:4])\nprint(word[:2])\nprint(word[4:])\n```\n\nExpected output:\n\n```text\nyth\nPy\non\n```\n\nThe first slice includes indices one, two and three, but not four. The omitted bounds in the next two slices mean start of string and end of string respectively. The original word remains unchanged.\n\n## Example 3: Keep a method result\n\n```python\nlabel = \"  Study Time  \"\nclean = label.strip().lower()\nprint(clean)\nprint(label.startswith(\"  \"))\n```\n\nExpected output:\n\n```text\nstudy time\nTrue\n```\n\nThe cleaned value is a new string. The original label still starts with spaces. lower changes letter case; strip removes only the surrounding whitespace in this example.\n\n## Check the reasoning\n\nA slice excludes its stop position and returns a new string.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nUse the string \"  Python Practice  \". Save a cleaned version, print its first six characters and its last character, and verify that the original still contains its surrounding spaces. Explain the excluded stop index.\n\n### Practice hint\n\nStore strip() in a new name. A six-character prefix uses [:6], not [:5].\n\n<PredictOutput title=\"Predict: Read positions\" code=\"word = &quot;Python&quot;\nprint(word[0])\nprint(word[-1])\nprint(len(word))\" options=\"[&quot;P\\nn\\n6&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;P\\nn\\n6\\nNone&quot;]\" answer=\"0\" explanation=\"P occupies index zero and n is the last character. len reports the sequence length. These ASCII characters each occupy one code point, making the index model easy to inspect.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;word = \\&quot;Python\\&quot;\\nprint(word[0])\\nprint(word[-1])\\nprint(len(word))&quot;,&quot;explanation&quot;:&quot;P occupies index zero and n is the last character. len reports the sequence length. These ASCII characters each occupy one code point, making the index model easy to inspect.&quot;,&quot;values&quot;:&quot;Expected output:\\nP\\nn\\n6&quot;},{&quot;line&quot;:&quot;word = \\&quot;Python\\&quot;\\nprint(word[1:4])\\nprint(word[:2])\\nprint(word[4:])&quot;,&quot;explanation&quot;:&quot;The first slice includes indices one, two and three, but not four. The omitted bounds in the next two slices mean start of string and end of string respectively. The original word remains unchanged.&quot;,&quot;values&quot;:&quot;Expected output:\\nyth\\nPy\\non&quot;},{&quot;line&quot;:&quot;label = \\&quot;  Study Time  \\&quot;\\nclean = label.strip().lower()\\nprint(clean)\\nprint(label.startswith(\\&quot;  \\&quot;))&quot;,&quot;explanation&quot;:&quot;The cleaned value is a new string. The original label still starts with spaces. lower changes letter case; strip removes only the surrounding whitespace in this example.&quot;,&quot;values&quot;:&quot;Expected output:\\nstudy time\\nTrue&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"word = &quot;Python&quot;\nprint(word[0])\nprint(word[-1])\nprint(len(word))\" task=\"Use the string &quot;  Python Practice  &quot;. Save a cleaned version, print its first six characters and its last character, and verify that the original still contains its surrounding spaces. Explain the excluded stop index. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Strings, Indexing and Slicing\" stages=\"[{&quot;title&quot;:&quot;Read positions&quot;,&quot;explanation&quot;:&quot;P occupies index zero and n is the last character. len reports the sequence length. These ASCII characters each occupy one code point, making the index model easy to inspect.&quot;,&quot;code&quot;:&quot;word = \\&quot;Python\\&quot;\\nprint(word[0])\\nprint(word[-1])\\nprint(len(word))&quot;,&quot;hint&quot;:&quot;Store strip() in a new name. A six-character prefix uses [:6], not [:5].&quot;,&quot;success&quot;:&quot;The expected output is P\\nn\\n6. P occupies index zero and n is the last character. len reports the sequence length. These ASCII characters each occupy one code point, making the index model easy to inspect.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;P\\nn\\n6&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;P\\nn\\n6\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;P occupies index zero and n is the last character. len reports the sequence length. These ASCII characters each occupy one code point, making the index model easy to inspect.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Take a slice&quot;,&quot;explanation&quot;:&quot;The first slice includes indices one, two and three, but not four. The omitted bounds in the next two slices mean start of string and end of string respectively. The original word remains unchanged.&quot;,&quot;code&quot;:&quot;word = \\&quot;Python\\&quot;\\nprint(word[1:4])\\nprint(word[:2])\\nprint(word[4:])&quot;,&quot;hint&quot;:&quot;Store strip() in a new name. A six-character prefix uses [:6], not [:5].&quot;,&quot;success&quot;:&quot;The expected output is yth\\nPy\\non. The first slice includes indices one, two and three, but not four. The omitted bounds in the next two slices mean start of string and end of string respectively. The original word remains unchanged.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;yth\\nPy\\non&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;yth\\nPy\\non\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The first slice includes indices one, two and three, but not four. The omitted bounds in the next two slices mean start of string and end of string respectively. The original word remains unchanged.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Keep a method result&quot;,&quot;explanation&quot;:&quot;The cleaned value is a new string. The original label still starts with spaces. lower changes letter case; strip removes only the surrounding whitespace in this example.&quot;,&quot;code&quot;:&quot;label = \\&quot;  Study Time  \\&quot;\\nclean = label.strip().lower()\\nprint(clean)\\nprint(label.startswith(\\&quot;  \\&quot;))&quot;,&quot;hint&quot;:&quot;Store strip() in a new name. A six-character prefix uses [:6], not [:5].&quot;,&quot;success&quot;:&quot;The expected output is study time\\nTrue. The cleaned value is a new string. The original label still starts with spaces. lower changes letter case; strip removes only the surrounding whitespace in this example.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;study time\\nTrue&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;study time\\nTrue\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The cleaned value is a new string. The original label still starts with spaces. lower changes letter case; strip removes only the surrounding whitespace in this example.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "word = \"Python\"\nprint(word[0])\nprint(word[-1])\nprint(len(word))",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nword = \"Python\"\nprint(word[0])\nprint(word[-1])\nprint(len(word))",
        "explanation": "P occupies index zero and n is the last character. len reports the sequence length. These ASCII characters each occupy one code point, making the index model easy to inspect.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "P\nn\n6"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "P\nn\n6\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nword = \"Python\"\nprint(word[1:4])\nprint(word[:2])\nprint(word[4:])",
        "explanation": "The first slice includes indices one, two and three, but not four. The omitted bounds in the next two slices mean start of string and end of string respectively. The original word remains unchanged.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "yth\nPy\non"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "yth\nPy\non\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nlabel = \"  Study Time  \"\nclean = label.strip().lower()\nprint(clean)\nprint(label.startswith(\"  \"))",
        "explanation": "The cleaned value is a new string. The original label still starts with spaces. lower changes letter case; strip removes only the surrounding whitespace in this example.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "study time\nTrue"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "study time\nTrue\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "A slice excludes its stop position and returns a new string.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "A slice excludes its stop position and returns a new string."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Use the string \"  Python Practice  \". Save a cleaned version, print its first six characters and its last character, and verify that the original still contains its surrounding spaces. Explain the excluded stop index.",
      "hints": [
        "Store strip() in a new name. A six-character prefix uses [:6], not [:5].",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Strings, Indexing and Slicing"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Strings, Indexing and Slicing"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-004",
    "languageId": "python",
    "slug": "operators-and-comparisons",
    "title": "Python Operators and Comparisons",
    "summary": "Assignment binds a name; comparison evaluates a relationship between values.",
    "order": 4,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Operators and Comparisons",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nAn operator describes an operation on operands. Arithmetic operators calculate values; comparison operators produce booleans. Assignment with = binds a name, while == compares values. Read those symbols deliberately rather than treating every equals sign as a question. Python uses ** for exponentiation; ^ is a bitwise operator, not a power symbol.\n\nFor integer operands, // computes floor division and % computes the corresponding remainder. Floor division moves towards negative infinity, which matters for negative numbers. The examples begin with positive counts so you can check the quotient and remainder against a concrete grouping problem. Parentheses make grouping explicit when an expression contains several operations.\n\nBoolean operators and, or and not combine truth tests. and and or short-circuit and actually return an operand, so avoid assuming every use constructs a bool. When you want a boolean condition, use clear comparison expressions on each side. Write a range check as 0 &lt;= score &lt;= 100 rather than accidentally checking only one boundary. Prefer a readable condition over a compressed expression that nobody can confidently trace.\n\n## Example 1: Group arithmetic explicitly\n\n```python\nprint(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(2 ** 3)\n```\n\nExpected output:\n\n```text\n14\n20\n8\n```\n\nMultiplication happens before addition in the first expression. Parentheses change the grouping in the second. The third expression calculates a power, using two asterisks.\n\n## Example 2: Count complete groups\n\n```python\nminutes = 95\nprint(minutes // 30)\nprint(minutes % 30)\n```\n\nExpected output:\n\n```text\n3\n5\n```\n\nNinety-five minutes contains three complete thirty-minute blocks and five remaining minutes. This positive example provides a concrete interpretation of quotient and remainder.\n\n## Example 3: Compare a score\n\n```python\nscore = 80\nprint(score >= 80)\nprint(0 <= score <= 100)\nprint(score == 100)\n```\n\nExpected output:\n\n```text\nTrue\nTrue\nFalse\n```\n\nThe passing boundary includes 80. The chained comparison checks both limits. Comparing with 100 is a separate question and does not modify score.\n\n## Check the reasoning\n\nAssignment binds a name; comparison evaluates a relationship between values.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nFor 137 minutes, calculate complete 25-minute sessions and remaining minutes. Then check whether a score of 79 meets an inclusive 80-point threshold. Print clear labels for each result.\n\n### Practice hint\n\nUse // and % with the same divisor. An inclusive boundary uses &gt;=, not &gt;.\n\n<PredictOutput title=\"Predict: Group arithmetic explicitly\" code=\"print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(2 ** 3)\" options=\"[&quot;14\\n20\\n8&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;14\\n20\\n8\\nNone&quot;]\" answer=\"0\" explanation=\"Multiplication happens before addition in the first expression. Parentheses change the grouping in the second. The third expression calculates a power, using two asterisks.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;print(2 + 3 * 4)\\nprint((2 + 3) * 4)\\nprint(2 ** 3)&quot;,&quot;explanation&quot;:&quot;Multiplication happens before addition in the first expression. Parentheses change the grouping in the second. The third expression calculates a power, using two asterisks.&quot;,&quot;values&quot;:&quot;Expected output:\\n14\\n20\\n8&quot;},{&quot;line&quot;:&quot;minutes = 95\\nprint(minutes // 30)\\nprint(minutes % 30)&quot;,&quot;explanation&quot;:&quot;Ninety-five minutes contains three complete thirty-minute blocks and five remaining minutes. This positive example provides a concrete interpretation of quotient and remainder.&quot;,&quot;values&quot;:&quot;Expected output:\\n3\\n5&quot;},{&quot;line&quot;:&quot;score = 80\\nprint(score &gt;= 80)\\nprint(0 &lt;= score &lt;= 100)\\nprint(score == 100)&quot;,&quot;explanation&quot;:&quot;The passing boundary includes 80. The chained comparison checks both limits. Comparing with 100 is a separate question and does not modify score.&quot;,&quot;values&quot;:&quot;Expected output:\\nTrue\\nTrue\\nFalse&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(2 ** 3)\" task=\"For 137 minutes, calculate complete 25-minute sessions and remaining minutes. Then check whether a score of 79 meets an inclusive 80-point threshold. Print clear labels for each result. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Operators and Comparisons\" stages=\"[{&quot;title&quot;:&quot;Group arithmetic explicitly&quot;,&quot;explanation&quot;:&quot;Multiplication happens before addition in the first expression. Parentheses change the grouping in the second. The third expression calculates a power, using two asterisks.&quot;,&quot;code&quot;:&quot;print(2 + 3 * 4)\\nprint((2 + 3) * 4)\\nprint(2 ** 3)&quot;,&quot;hint&quot;:&quot;Use // and % with the same divisor. An inclusive boundary uses &gt;=, not &gt;.&quot;,&quot;success&quot;:&quot;The expected output is 14\\n20\\n8. Multiplication happens before addition in the first expression. Parentheses change the grouping in the second. The third expression calculates a power, using two asterisks.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;14\\n20\\n8&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;14\\n20\\n8\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Multiplication happens before addition in the first expression. Parentheses change the grouping in the second. The third expression calculates a power, using two asterisks.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Count complete groups&quot;,&quot;explanation&quot;:&quot;Ninety-five minutes contains three complete thirty-minute blocks and five remaining minutes. This positive example provides a concrete interpretation of quotient and remainder.&quot;,&quot;code&quot;:&quot;minutes = 95\\nprint(minutes // 30)\\nprint(minutes % 30)&quot;,&quot;hint&quot;:&quot;Use // and % with the same divisor. An inclusive boundary uses &gt;=, not &gt;.&quot;,&quot;success&quot;:&quot;The expected output is 3\\n5. Ninety-five minutes contains three complete thirty-minute blocks and five remaining minutes. This positive example provides a concrete interpretation of quotient and remainder.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;3\\n5&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;3\\n5\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Ninety-five minutes contains three complete thirty-minute blocks and five remaining minutes. This positive example provides a concrete interpretation of quotient and remainder.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Compare a score&quot;,&quot;explanation&quot;:&quot;The passing boundary includes 80. The chained comparison checks both limits. Comparing with 100 is a separate question and does not modify score.&quot;,&quot;code&quot;:&quot;score = 80\\nprint(score &gt;= 80)\\nprint(0 &lt;= score &lt;= 100)\\nprint(score == 100)&quot;,&quot;hint&quot;:&quot;Use // and % with the same divisor. An inclusive boundary uses &gt;=, not &gt;.&quot;,&quot;success&quot;:&quot;The expected output is True\\nTrue\\nFalse. The passing boundary includes 80. The chained comparison checks both limits. Comparing with 100 is a separate question and does not modify score.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;True\\nTrue\\nFalse&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;True\\nTrue\\nFalse\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The passing boundary includes 80. The chained comparison checks both limits. Comparing with 100 is a separate question and does not modify score.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(2 ** 3)",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nprint(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(2 ** 3)",
        "explanation": "Multiplication happens before addition in the first expression. Parentheses change the grouping in the second. The third expression calculates a power, using two asterisks.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "14\n20\n8"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "14\n20\n8\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nminutes = 95\nprint(minutes // 30)\nprint(minutes % 30)",
        "explanation": "Ninety-five minutes contains three complete thirty-minute blocks and five remaining minutes. This positive example provides a concrete interpretation of quotient and remainder.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "3\n5"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "3\n5\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nscore = 80\nprint(score >= 80)\nprint(0 <= score <= 100)\nprint(score == 100)",
        "explanation": "The passing boundary includes 80. The chained comparison checks both limits. Comparing with 100 is a separate question and does not modify score.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "True\nTrue\nFalse"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "True\nTrue\nFalse\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Assignment binds a name; comparison evaluates a relationship between values.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Assignment binds a name; comparison evaluates a relationship between values."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "For 137 minutes, calculate complete 25-minute sessions and remaining minutes. Then check whether a score of 79 meets an inclusive 80-point threshold. Print clear labels for each result.",
      "hints": [
        "Use // and % with the same divisor. An inclusive boundary uses >=, not >.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Operators and Comparisons"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Operators and Comparisons"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-005",
    "languageId": "python",
    "slug": "conditions-and-indentation",
    "title": "Python Conditions and Indentation",
    "summary": "Only the first matching branch of one if/elif/else chain executes.",
    "order": 5,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Conditions and Indentation",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA conditional selects which suite of instructions runs. An if statement evaluates its condition; elif provides another test when earlier tests did not match; else handles the remaining case. In one if/elif/else chain, only the first matching branch runs. Separate if statements are separate decisions and may all run. Choose the structure that expresses the problem.\n\nA colon introduces each branch suite, and consistent indentation groups its statements. Four spaces per level is the conventional style used here. Indentation is syntax, not decoration. A line dedented back to the outer level runs after the decision rather than belonging to the last branch. Avoid mixing tabs and spaces.\n\nThink about boundaries before writing a condition. If 80 passes, test 79, 80 and 81. If grades are ordered from strongest to weakest, place the strongest threshold first; otherwise a high score may satisfy an earlier weaker condition. Validation is a separate concern: an impossible score such as 150 should not silently receive the highest valid grade. These small test cases expose logic defects that a single happy-path example can hide.\n\n## Example 1: Include the passing boundary\n\n```python\nscore = 80\nif score >= 80:\n    print(\"Pass\")\nelse:\n    print(\"Retry\")\nprint(\"Test finished\")\n```\n\nExpected output:\n\n```text\nPass\nTest finished\n```\n\nThe first branch includes the boundary value. The final print is outside both branches, so it runs after the decision regardless of the selected branch.\n\n## Example 2: Order thresholds\n\n```python\nscore = 92\nif score >= 90:\n    print(\"Excellent\")\nelif score >= 80:\n    print(\"Passed\")\nelse:\n    print(\"Keep practising\")\n```\n\nExpected output:\n\n```text\nExcellent\n```\n\nA score of 92 also exceeds 80, but the first branch already matched. The interpreter does not execute the elif branch in the same chain.\n\n## Example 3: Reject an invalid range\n\n```python\nscore = 105\nif not 0 <= score <= 100:\n    print(\"Invalid score\")\nelif score >= 80:\n    print(\"Pass\")\nelse:\n    print(\"Retry\")\n```\n\nExpected output:\n\n```text\nInvalid score\n```\n\nRange validation happens before grading. A large numeric value is not automatically a valid score. This is an example of checking domain constraints, not just data types.\n\n## Check the reasoning\n\nOnly the first matching branch of one if/elif/else chain executes.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nWrite a decision that rejects scores outside 0 to 100, prints Pass for scores at least 80, and Retry otherwise. Run it with 79, 80, 81 and 105. Explain why validation belongs first.\n\n### Practice hint\n\nKeep all grading branches in one chain and place the invalid-range condition first.\n\n<PredictOutput title=\"Predict: Include the passing boundary\" code=\"score = 80\nif score &gt;= 80:\n    print(&quot;Pass&quot;)\nelse:\n    print(&quot;Retry&quot;)\nprint(&quot;Test finished&quot;)\" options=\"[&quot;Pass\\nTest finished&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Pass\\nTest finished\\nNone&quot;]\" answer=\"0\" explanation=\"The first branch includes the boundary value. The final print is outside both branches, so it runs after the decision regardless of the selected branch.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;score = 80\\nif score &gt;= 80:\\n    print(\\&quot;Pass\\&quot;)\\nelse:\\n    print(\\&quot;Retry\\&quot;)\\nprint(\\&quot;Test finished\\&quot;)&quot;,&quot;explanation&quot;:&quot;The first branch includes the boundary value. The final print is outside both branches, so it runs after the decision regardless of the selected branch.&quot;,&quot;values&quot;:&quot;Expected output:\\nPass\\nTest finished&quot;},{&quot;line&quot;:&quot;score = 92\\nif score &gt;= 90:\\n    print(\\&quot;Excellent\\&quot;)\\nelif score &gt;= 80:\\n    print(\\&quot;Passed\\&quot;)\\nelse:\\n    print(\\&quot;Keep practising\\&quot;)&quot;,&quot;explanation&quot;:&quot;A score of 92 also exceeds 80, but the first branch already matched. The interpreter does not execute the elif branch in the same chain.&quot;,&quot;values&quot;:&quot;Expected output:\\nExcellent&quot;},{&quot;line&quot;:&quot;score = 105\\nif not 0 &lt;= score &lt;= 100:\\n    print(\\&quot;Invalid score\\&quot;)\\nelif score &gt;= 80:\\n    print(\\&quot;Pass\\&quot;)\\nelse:\\n    print(\\&quot;Retry\\&quot;)&quot;,&quot;explanation&quot;:&quot;Range validation happens before grading. A large numeric value is not automatically a valid score. This is an example of checking domain constraints, not just data types.&quot;,&quot;values&quot;:&quot;Expected output:\\nInvalid score&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"score = 80\nif score &gt;= 80:\n    print(&quot;Pass&quot;)\nelse:\n    print(&quot;Retry&quot;)\nprint(&quot;Test finished&quot;)\" task=\"Write a decision that rejects scores outside 0 to 100, prints Pass for scores at least 80, and Retry otherwise. Run it with 79, 80, 81 and 105. Explain why validation belongs first. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Conditions and Indentation\" stages=\"[{&quot;title&quot;:&quot;Include the passing boundary&quot;,&quot;explanation&quot;:&quot;The first branch includes the boundary value. The final print is outside both branches, so it runs after the decision regardless of the selected branch.&quot;,&quot;code&quot;:&quot;score = 80\\nif score &gt;= 80:\\n    print(\\&quot;Pass\\&quot;)\\nelse:\\n    print(\\&quot;Retry\\&quot;)\\nprint(\\&quot;Test finished\\&quot;)&quot;,&quot;hint&quot;:&quot;Keep all grading branches in one chain and place the invalid-range condition first.&quot;,&quot;success&quot;:&quot;The expected output is Pass\\nTest finished. The first branch includes the boundary value. The final print is outside both branches, so it runs after the decision regardless of the selected branch.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Pass\\nTest finished&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Pass\\nTest finished\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The first branch includes the boundary value. The final print is outside both branches, so it runs after the decision regardless of the selected branch.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Order thresholds&quot;,&quot;explanation&quot;:&quot;A score of 92 also exceeds 80, but the first branch already matched. The interpreter does not execute the elif branch in the same chain.&quot;,&quot;code&quot;:&quot;score = 92\\nif score &gt;= 90:\\n    print(\\&quot;Excellent\\&quot;)\\nelif score &gt;= 80:\\n    print(\\&quot;Passed\\&quot;)\\nelse:\\n    print(\\&quot;Keep practising\\&quot;)&quot;,&quot;hint&quot;:&quot;Keep all grading branches in one chain and place the invalid-range condition first.&quot;,&quot;success&quot;:&quot;The expected output is Excellent. A score of 92 also exceeds 80, but the first branch already matched. The interpreter does not execute the elif branch in the same chain.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Excellent&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Excellent\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;A score of 92 also exceeds 80, but the first branch already matched. The interpreter does not execute the elif branch in the same chain.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Reject an invalid range&quot;,&quot;explanation&quot;:&quot;Range validation happens before grading. A large numeric value is not automatically a valid score. This is an example of checking domain constraints, not just data types.&quot;,&quot;code&quot;:&quot;score = 105\\nif not 0 &lt;= score &lt;= 100:\\n    print(\\&quot;Invalid score\\&quot;)\\nelif score &gt;= 80:\\n    print(\\&quot;Pass\\&quot;)\\nelse:\\n    print(\\&quot;Retry\\&quot;)&quot;,&quot;hint&quot;:&quot;Keep all grading branches in one chain and place the invalid-range condition first.&quot;,&quot;success&quot;:&quot;The expected output is Invalid score. Range validation happens before grading. A large numeric value is not automatically a valid score. This is an example of checking domain constraints, not just data types.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Invalid score&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Invalid score\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Range validation happens before grading. A large numeric value is not automatically a valid score. This is an example of checking domain constraints, not just data types.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "score = 80\nif score >= 80:\n    print(\"Pass\")\nelse:\n    print(\"Retry\")\nprint(\"Test finished\")",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nscore = 80\nif score >= 80:\n    print(\"Pass\")\nelse:\n    print(\"Retry\")\nprint(\"Test finished\")",
        "explanation": "The first branch includes the boundary value. The final print is outside both branches, so it runs after the decision regardless of the selected branch.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Pass\nTest finished"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Pass\nTest finished\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nscore = 92\nif score >= 90:\n    print(\"Excellent\")\nelif score >= 80:\n    print(\"Passed\")\nelse:\n    print(\"Keep practising\")",
        "explanation": "A score of 92 also exceeds 80, but the first branch already matched. The interpreter does not execute the elif branch in the same chain.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Excellent"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Excellent\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nscore = 105\nif not 0 <= score <= 100:\n    print(\"Invalid score\")\nelif score >= 80:\n    print(\"Pass\")\nelse:\n    print(\"Retry\")",
        "explanation": "Range validation happens before grading. A large numeric value is not automatically a valid score. This is an example of checking domain constraints, not just data types.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Invalid score"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Invalid score\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Only the first matching branch of one if/elif/else chain executes.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Only the first matching branch of one if/elif/else chain executes."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Write a decision that rejects scores outside 0 to 100, prints Pass for scores at least 80, and Retry otherwise. Run it with 79, 80, 81 and 105. Explain why validation belongs first.",
      "hints": [
        "Keep all grading branches in one chain and place the invalid-range condition first.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Conditions and Indentation"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Conditions and Indentation"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-006",
    "languageId": "python",
    "slug": "loops-and-range",
    "title": "Python Loops and Range",
    "summary": "range excludes its stop value, and a running total must be initialised before iteration.",
    "order": 6,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Loops and Range",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA loop repeats instructions according to a defined iteration rule. A for loop visits items from an iterable; range supplies a sequence of integers without building a list of all of them. range(stop) begins at zero and excludes stop. range(start, stop) uses an explicit beginning and still excludes the end. This boundary convention is consistent with slicing.\n\nA while loop repeats while its condition is true. Something inside or outside the loop must eventually change that condition if the program is meant to finish. Update the controlling state deliberately and trace the smallest input before increasing the workload. The browser practice runtime stops unresponsive code, but a timeout is a safety net, not correct loop design.\n\nAn accumulator stores a running result. Initialise it before the loop, then update it on each iteration. Resetting it inside the loop discards earlier work. break exits the nearest loop; continue skips to its next iteration. Use either only when it clarifies the logic. When a loop is wrong, write down the variable values after each iteration instead of changing its start and stop numbers at random.\n\n## Example 1: Inspect range boundaries\n\n```python\nfor day in range(1, 4):\n    print(day)\n```\n\nExpected output:\n\n```text\n1\n2\n3\n```\n\nThe sequence begins at one and stops before four. Three instructions print on three iterations. A for loop gives day a new item value each time.\n\n## Example 2: Build a running total\n\n```python\ntotal = 0\nfor minutes in range(10, 31, 10):\n    total += minutes\nprint(total)\n```\n\nExpected output:\n\n```text\n60\n```\n\nThe step is ten, so the loop visits ten, twenty and thirty. The single total initialised before the loop accumulates all three values. The final print is outside the loop.\n\n## Example 3: Make a while loop terminate\n\n```python\nremaining = 3\nwhile remaining > 0:\n    print(remaining)\n    remaining -= 1\nprint(\"Done\")\n```\n\nExpected output:\n\n```text\n3\n2\n1\nDone\n```\n\nEach iteration decreases the controlling value. Once it reaches zero the condition is false, and execution moves to the final print. Omitting the update would make this example unbounded.\n\n## Check the reasoning\n\nrange excludes its stop value, and a running total must be initialised before iteration.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nUse a for loop to total five daily sessions of 20 minutes. Then write a while countdown from three to one, followed by Done. Explain why the total initialisation and countdown update belong where you placed them.\n\n### Practice hint\n\nUse range(5) for five iterations. Decrease the while control variable inside its loop.\n\n<PredictOutput title=\"Predict: Inspect range boundaries\" code=\"for day in range(1, 4):\n    print(day)\" options=\"[&quot;1\\n2\\n3&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;1\\n2\\n3\\nNone&quot;]\" answer=\"0\" explanation=\"The sequence begins at one and stops before four. Three instructions print on three iterations. A for loop gives day a new item value each time.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;for day in range(1, 4):\\n    print(day)&quot;,&quot;explanation&quot;:&quot;The sequence begins at one and stops before four. Three instructions print on three iterations. A for loop gives day a new item value each time.&quot;,&quot;values&quot;:&quot;Expected output:\\n1\\n2\\n3&quot;},{&quot;line&quot;:&quot;total = 0\\nfor minutes in range(10, 31, 10):\\n    total += minutes\\nprint(total)&quot;,&quot;explanation&quot;:&quot;The step is ten, so the loop visits ten, twenty and thirty. The single total initialised before the loop accumulates all three values. The final print is outside the loop.&quot;,&quot;values&quot;:&quot;Expected output:\\n60&quot;},{&quot;line&quot;:&quot;remaining = 3\\nwhile remaining &gt; 0:\\n    print(remaining)\\n    remaining -= 1\\nprint(\\&quot;Done\\&quot;)&quot;,&quot;explanation&quot;:&quot;Each iteration decreases the controlling value. Once it reaches zero the condition is false, and execution moves to the final print. Omitting the update would make this example unbounded.&quot;,&quot;values&quot;:&quot;Expected output:\\n3\\n2\\n1\\nDone&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"for day in range(1, 4):\n    print(day)\" task=\"Use a for loop to total five daily sessions of 20 minutes. Then write a while countdown from three to one, followed by Done. Explain why the total initialisation and countdown update belong where you placed them. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Loops and Range\" stages=\"[{&quot;title&quot;:&quot;Inspect range boundaries&quot;,&quot;explanation&quot;:&quot;The sequence begins at one and stops before four. Three instructions print on three iterations. A for loop gives day a new item value each time.&quot;,&quot;code&quot;:&quot;for day in range(1, 4):\\n    print(day)&quot;,&quot;hint&quot;:&quot;Use range(5) for five iterations. Decrease the while control variable inside its loop.&quot;,&quot;success&quot;:&quot;The expected output is 1\\n2\\n3. The sequence begins at one and stops before four. Three instructions print on three iterations. A for loop gives day a new item value each time.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;1\\n2\\n3&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;1\\n2\\n3\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The sequence begins at one and stops before four. Three instructions print on three iterations. A for loop gives day a new item value each time.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Build a running total&quot;,&quot;explanation&quot;:&quot;The step is ten, so the loop visits ten, twenty and thirty. The single total initialised before the loop accumulates all three values. The final print is outside the loop.&quot;,&quot;code&quot;:&quot;total = 0\\nfor minutes in range(10, 31, 10):\\n    total += minutes\\nprint(total)&quot;,&quot;hint&quot;:&quot;Use range(5) for five iterations. Decrease the while control variable inside its loop.&quot;,&quot;success&quot;:&quot;The expected output is 60. The step is ten, so the loop visits ten, twenty and thirty. The single total initialised before the loop accumulates all three values. The final print is outside the loop.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;60&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;60\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The step is ten, so the loop visits ten, twenty and thirty. The single total initialised before the loop accumulates all three values. The final print is outside the loop.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Make a while loop terminate&quot;,&quot;explanation&quot;:&quot;Each iteration decreases the controlling value. Once it reaches zero the condition is false, and execution moves to the final print. Omitting the update would make this example unbounded.&quot;,&quot;code&quot;:&quot;remaining = 3\\nwhile remaining &gt; 0:\\n    print(remaining)\\n    remaining -= 1\\nprint(\\&quot;Done\\&quot;)&quot;,&quot;hint&quot;:&quot;Use range(5) for five iterations. Decrease the while control variable inside its loop.&quot;,&quot;success&quot;:&quot;The expected output is 3\\n2\\n1\\nDone. Each iteration decreases the controlling value. Once it reaches zero the condition is false, and execution moves to the final print. Omitting the update would make this example unbounded.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;3\\n2\\n1\\nDone&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;3\\n2\\n1\\nDone\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Each iteration decreases the controlling value. Once it reaches zero the condition is false, and execution moves to the final print. Omitting the update would make this example unbounded.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "for day in range(1, 4):\n    print(day)",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nfor day in range(1, 4):\n    print(day)",
        "explanation": "The sequence begins at one and stops before four. Three instructions print on three iterations. A for loop gives day a new item value each time.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "1\n2\n3"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "1\n2\n3\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\ntotal = 0\nfor minutes in range(10, 31, 10):\n    total += minutes\nprint(total)",
        "explanation": "The step is ten, so the loop visits ten, twenty and thirty. The single total initialised before the loop accumulates all three values. The final print is outside the loop.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "60"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "60\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nremaining = 3\nwhile remaining > 0:\n    print(remaining)\n    remaining -= 1\nprint(\"Done\")",
        "explanation": "Each iteration decreases the controlling value. Once it reaches zero the condition is false, and execution moves to the final print. Omitting the update would make this example unbounded.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "3\n2\n1\nDone"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "3\n2\n1\nDone\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "range excludes its stop value, and a running total must be initialised before iteration.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "range excludes its stop value, and a running total must be initialised before iteration."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Use a for loop to total five daily sessions of 20 minutes. Then write a while countdown from three to one, followed by Done. Explain why the total initialisation and countdown update belong where you placed them.",
      "hints": [
        "Use range(5) for five iterations. Decrease the while control variable inside its loop.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Loops and Range"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Loops and Range"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-007",
    "languageId": "python",
    "slug": "lists-and-mutation",
    "title": "Python Lists and Mutation",
    "summary": "Assignment shares the same list reference; a shallow copy creates a separate outer list.",
    "order": 7,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Lists and Mutation",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA list stores an ordered collection of references to values. Indexing and slicing use the same zero-based, stop-excluded conventions you studied for strings. Unlike strings, lists are mutable: you can replace an element, append another one or remove an item. Mutation changes the existing list rather than necessarily constructing a new list.\n\nNames can refer to the same mutable object. Assigning alias = scores does not copy every element into an independent collection. A mutation through alias is visible through scores because both names refer to the same list. scores.copy() creates a shallow copy of the outer list. Nested mutable objects can still be shared, so do not describe shallow copying as complete recursive independence.\n\nMethods have different return contracts. append changes the list and returns None; it does not return the updated list. Write scores.append(90), then inspect scores. Assigning scores = scores.append(90) loses the original list binding by replacing it with None. When processing a collection, avoid removing items from the same list while iterating over it unless you have carefully defined the algorithm. A separate result list is usually easier for a beginner to reason about.\n\n## Example 1: Append and replace\n\n```python\nscores = [70, 80]\nscores.append(90)\nscores[0] = 75\nprint(scores)\n```\n\nExpected output:\n\n```text\n[75, 80, 90]\n```\n\nappend adds an element at the end. The indexed assignment changes the first existing element. The list keeps its order and now has three elements.\n\n## Example 2: Inspect aliasing\n\n```python\nscores = [70, 80]\nalias = scores\nalias.append(90)\nprint(scores)\nprint(alias is scores)\n```\n\nExpected output:\n\n```text\n[70, 80, 90]\nTrue\n```\n\nBoth names refer to the same object. The is comparison checks identity here; it does not merely compare the text representation of the lists.\n\n## Example 3: Copy the outer list\n\n```python\nscores = [70, 80]\ncopy = scores.copy()\ncopy.append(90)\nprint(scores)\nprint(copy)\n```\n\nExpected output:\n\n```text\n[70, 80]\n[70, 80, 90]\n```\n\nAppending to the separate outer list does not append to the original. These lists contain only integers, so the nested-sharing limitation does not complicate this particular example.\n\n## Check the reasoning\n\nAssignment shares the same list reference; a shallow copy creates a separate outer list.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nCreate a list of three study durations, copy it, append a fourth duration only to the copy, and print both lists. Then show what changes if you use an alias instead. Do not assign the return value of append back to the list.\n\n### Practice hint\n\nPrint both lists after mutation. Use is to investigate whether two names refer to the same object.\n\n<PredictOutput title=\"Predict: Append and replace\" code=\"scores = [70, 80]\nscores.append(90)\nscores[0] = 75\nprint(scores)\" options=\"[&quot;[75, 80, 90]&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;[75, 80, 90]\\nNone&quot;]\" answer=\"0\" explanation=\"append adds an element at the end. The indexed assignment changes the first existing element. The list keeps its order and now has three elements.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;scores = [70, 80]\\nscores.append(90)\\nscores[0] = 75\\nprint(scores)&quot;,&quot;explanation&quot;:&quot;append adds an element at the end. The indexed assignment changes the first existing element. The list keeps its order and now has three elements.&quot;,&quot;values&quot;:&quot;Expected output:\\n[75, 80, 90]&quot;},{&quot;line&quot;:&quot;scores = [70, 80]\\nalias = scores\\nalias.append(90)\\nprint(scores)\\nprint(alias is scores)&quot;,&quot;explanation&quot;:&quot;Both names refer to the same object. The is comparison checks identity here; it does not merely compare the text representation of the lists.&quot;,&quot;values&quot;:&quot;Expected output:\\n[70, 80, 90]\\nTrue&quot;},{&quot;line&quot;:&quot;scores = [70, 80]\\ncopy = scores.copy()\\ncopy.append(90)\\nprint(scores)\\nprint(copy)&quot;,&quot;explanation&quot;:&quot;Appending to the separate outer list does not append to the original. These lists contain only integers, so the nested-sharing limitation does not complicate this particular example.&quot;,&quot;values&quot;:&quot;Expected output:\\n[70, 80]\\n[70, 80, 90]&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"scores = [70, 80]\nscores.append(90)\nscores[0] = 75\nprint(scores)\" task=\"Create a list of three study durations, copy it, append a fourth duration only to the copy, and print both lists. Then show what changes if you use an alias instead. Do not assign the return value of append back to the list. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Lists and Mutation\" stages=\"[{&quot;title&quot;:&quot;Append and replace&quot;,&quot;explanation&quot;:&quot;append adds an element at the end. The indexed assignment changes the first existing element. The list keeps its order and now has three elements.&quot;,&quot;code&quot;:&quot;scores = [70, 80]\\nscores.append(90)\\nscores[0] = 75\\nprint(scores)&quot;,&quot;hint&quot;:&quot;Print both lists after mutation. Use is to investigate whether two names refer to the same object.&quot;,&quot;success&quot;:&quot;The expected output is [75, 80, 90]. append adds an element at the end. The indexed assignment changes the first existing element. The list keeps its order and now has three elements.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;[75, 80, 90]&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;[75, 80, 90]\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;append adds an element at the end. The indexed assignment changes the first existing element. The list keeps its order and now has three elements.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Inspect aliasing&quot;,&quot;explanation&quot;:&quot;Both names refer to the same object. The is comparison checks identity here; it does not merely compare the text representation of the lists.&quot;,&quot;code&quot;:&quot;scores = [70, 80]\\nalias = scores\\nalias.append(90)\\nprint(scores)\\nprint(alias is scores)&quot;,&quot;hint&quot;:&quot;Print both lists after mutation. Use is to investigate whether two names refer to the same object.&quot;,&quot;success&quot;:&quot;The expected output is [70, 80, 90]\\nTrue. Both names refer to the same object. The is comparison checks identity here; it does not merely compare the text representation of the lists.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;[70, 80, 90]\\nTrue&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;[70, 80, 90]\\nTrue\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Both names refer to the same object. The is comparison checks identity here; it does not merely compare the text representation of the lists.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Copy the outer list&quot;,&quot;explanation&quot;:&quot;Appending to the separate outer list does not append to the original. These lists contain only integers, so the nested-sharing limitation does not complicate this particular example.&quot;,&quot;code&quot;:&quot;scores = [70, 80]\\ncopy = scores.copy()\\ncopy.append(90)\\nprint(scores)\\nprint(copy)&quot;,&quot;hint&quot;:&quot;Print both lists after mutation. Use is to investigate whether two names refer to the same object.&quot;,&quot;success&quot;:&quot;The expected output is [70, 80]\\n[70, 80, 90]. Appending to the separate outer list does not append to the original. These lists contain only integers, so the nested-sharing limitation does not complicate this particular example.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;[70, 80]\\n[70, 80, 90]&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;[70, 80]\\n[70, 80, 90]\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Appending to the separate outer list does not append to the original. These lists contain only integers, so the nested-sharing limitation does not complicate this particular example.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "scores = [70, 80]\nscores.append(90)\nscores[0] = 75\nprint(scores)",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nscores = [70, 80]\nscores.append(90)\nscores[0] = 75\nprint(scores)",
        "explanation": "append adds an element at the end. The indexed assignment changes the first existing element. The list keeps its order and now has three elements.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "[75, 80, 90]"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "[75, 80, 90]\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nscores = [70, 80]\nalias = scores\nalias.append(90)\nprint(scores)\nprint(alias is scores)",
        "explanation": "Both names refer to the same object. The is comparison checks identity here; it does not merely compare the text representation of the lists.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "[70, 80, 90]\nTrue"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "[70, 80, 90]\nTrue\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nscores = [70, 80]\ncopy = scores.copy()\ncopy.append(90)\nprint(scores)\nprint(copy)",
        "explanation": "Appending to the separate outer list does not append to the original. These lists contain only integers, so the nested-sharing limitation does not complicate this particular example.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "[70, 80]\n[70, 80, 90]"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "[70, 80]\n[70, 80, 90]\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Assignment shares the same list reference; a shallow copy creates a separate outer list.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Assignment shares the same list reference; a shallow copy creates a separate outer list."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Create a list of three study durations, copy it, append a fourth duration only to the copy, and print both lists. Then show what changes if you use an alias instead. Do not assign the return value of append back to the list.",
      "hints": [
        "Print both lists after mutation. Use is to investigate whether two names refer to the same object.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Lists and Mutation"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Lists and Mutation"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-008",
    "languageId": "python",
    "slug": "tuples-and-unpacking",
    "title": "Python Tuples and Unpacking",
    "summary": "Tuple unpacking binds names to sequence items; a single-item tuple needs a comma.",
    "order": 8,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Tuples and Unpacking",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA tuple is an ordered sequence whose element references cannot be replaced after construction. It is useful for a small record whose positions have a stable meaning, such as a label and a duration returned together. A tuple can still contain a mutable object; immutability of the outer tuple does not freeze everything nested inside it.\n\nThe comma is what forms a tuple in a single-value expression. (5) is the integer five in grouping parentheses; (5,) is a one-element tuple. Parentheses make tuple syntax readable, especially inside other expressions. Empty parentheses form the empty tuple.\n\nUnpacking binds several names from an iterable in one assignment. The number of unstarred targets must match the number of values. A starred target can collect remaining values into a list. Choose descriptive target names because positional data otherwise becomes hard to interpret. Unpacking is not limited to tuples, but a tuple provides a clear first example. If a record develops many fields or unclear positions, a named structure may be more appropriate.\n\n## Example 1: Unpack a small record\n\n```python\nsession = (\"Python\", 30)\nsubject, minutes = session\nprint(subject)\nprint(minutes)\n```\n\nExpected output:\n\n```text\nPython\n30\n```\n\nThe first item binds to subject and the second to minutes. Unpacking does not remove items from the original tuple or change its length.\n\n## Example 2: Notice the comma\n\n```python\nsingle = (5,)\ngrouped = (5)\nprint(type(single).__name__)\nprint(type(grouped).__name__)\n```\n\nExpected output:\n\n```text\ntuple\nint\n```\n\nThe trailing comma creates a one-item tuple. Parentheses alone can group an ordinary expression and do not necessarily create a tuple.\n\n## Example 3: Collect remaining items\n\n```python\nfirst, *remaining = (10, 20, 30)\nprint(first)\nprint(remaining)\n```\n\nExpected output:\n\n```text\n10\n[20, 30]\n```\n\nThe first target receives one item. The starred target receives a list containing the remaining items, even though the source collection is a tuple.\n\n## Check the reasoning\n\nTuple unpacking binds names to sequence items; a single-item tuple needs a comma.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nRepresent one study session as a tuple containing a subject, duration and completed flag. Unpack it into meaningful names and print them. Also create and inspect a one-item tuple without accidentally constructing just a number.\n\n### Practice hint\n\nUse commas between tuple elements. Match the unpacking target count to the three values.\n\n<PredictOutput title=\"Predict: Unpack a small record\" code=\"session = (&quot;Python&quot;, 30)\nsubject, minutes = session\nprint(subject)\nprint(minutes)\" options=\"[&quot;Python\\n30&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Python\\n30\\nNone&quot;]\" answer=\"0\" explanation=\"The first item binds to subject and the second to minutes. Unpacking does not remove items from the original tuple or change its length.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;session = (\\&quot;Python\\&quot;, 30)\\nsubject, minutes = session\\nprint(subject)\\nprint(minutes)&quot;,&quot;explanation&quot;:&quot;The first item binds to subject and the second to minutes. Unpacking does not remove items from the original tuple or change its length.&quot;,&quot;values&quot;:&quot;Expected output:\\nPython\\n30&quot;},{&quot;line&quot;:&quot;single = (5,)\\ngrouped = (5)\\nprint(type(single).__name__)\\nprint(type(grouped).__name__)&quot;,&quot;explanation&quot;:&quot;The trailing comma creates a one-item tuple. Parentheses alone can group an ordinary expression and do not necessarily create a tuple.&quot;,&quot;values&quot;:&quot;Expected output:\\ntuple\\nint&quot;},{&quot;line&quot;:&quot;first, *remaining = (10, 20, 30)\\nprint(first)\\nprint(remaining)&quot;,&quot;explanation&quot;:&quot;The first target receives one item. The starred target receives a list containing the remaining items, even though the source collection is a tuple.&quot;,&quot;values&quot;:&quot;Expected output:\\n10\\n[20, 30]&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"session = (&quot;Python&quot;, 30)\nsubject, minutes = session\nprint(subject)\nprint(minutes)\" task=\"Represent one study session as a tuple containing a subject, duration and completed flag. Unpack it into meaningful names and print them. Also create and inspect a one-item tuple without accidentally constructing just a number. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Tuples and Unpacking\" stages=\"[{&quot;title&quot;:&quot;Unpack a small record&quot;,&quot;explanation&quot;:&quot;The first item binds to subject and the second to minutes. Unpacking does not remove items from the original tuple or change its length.&quot;,&quot;code&quot;:&quot;session = (\\&quot;Python\\&quot;, 30)\\nsubject, minutes = session\\nprint(subject)\\nprint(minutes)&quot;,&quot;hint&quot;:&quot;Use commas between tuple elements. Match the unpacking target count to the three values.&quot;,&quot;success&quot;:&quot;The expected output is Python\\n30. The first item binds to subject and the second to minutes. Unpacking does not remove items from the original tuple or change its length.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Python\\n30&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Python\\n30\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The first item binds to subject and the second to minutes. Unpacking does not remove items from the original tuple or change its length.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Notice the comma&quot;,&quot;explanation&quot;:&quot;The trailing comma creates a one-item tuple. Parentheses alone can group an ordinary expression and do not necessarily create a tuple.&quot;,&quot;code&quot;:&quot;single = (5,)\\ngrouped = (5)\\nprint(type(single).__name__)\\nprint(type(grouped).__name__)&quot;,&quot;hint&quot;:&quot;Use commas between tuple elements. Match the unpacking target count to the three values.&quot;,&quot;success&quot;:&quot;The expected output is tuple\\nint. The trailing comma creates a one-item tuple. Parentheses alone can group an ordinary expression and do not necessarily create a tuple.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;tuple\\nint&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;tuple\\nint\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The trailing comma creates a one-item tuple. Parentheses alone can group an ordinary expression and do not necessarily create a tuple.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Collect remaining items&quot;,&quot;explanation&quot;:&quot;The first target receives one item. The starred target receives a list containing the remaining items, even though the source collection is a tuple.&quot;,&quot;code&quot;:&quot;first, *remaining = (10, 20, 30)\\nprint(first)\\nprint(remaining)&quot;,&quot;hint&quot;:&quot;Use commas between tuple elements. Match the unpacking target count to the three values.&quot;,&quot;success&quot;:&quot;The expected output is 10\\n[20, 30]. The first target receives one item. The starred target receives a list containing the remaining items, even though the source collection is a tuple.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;10\\n[20, 30]&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;10\\n[20, 30]\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The first target receives one item. The starred target receives a list containing the remaining items, even though the source collection is a tuple.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "session = (\"Python\", 30)\nsubject, minutes = session\nprint(subject)\nprint(minutes)",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nsession = (\"Python\", 30)\nsubject, minutes = session\nprint(subject)\nprint(minutes)",
        "explanation": "The first item binds to subject and the second to minutes. Unpacking does not remove items from the original tuple or change its length.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Python\n30"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Python\n30\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nsingle = (5,)\ngrouped = (5)\nprint(type(single).__name__)\nprint(type(grouped).__name__)",
        "explanation": "The trailing comma creates a one-item tuple. Parentheses alone can group an ordinary expression and do not necessarily create a tuple.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "tuple\nint"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "tuple\nint\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nfirst, *remaining = (10, 20, 30)\nprint(first)\nprint(remaining)",
        "explanation": "The first target receives one item. The starred target receives a list containing the remaining items, even though the source collection is a tuple.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "10\n[20, 30]"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "10\n[20, 30]\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Tuple unpacking binds names to sequence items; a single-item tuple needs a comma.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Tuple unpacking binds names to sequence items; a single-item tuple needs a comma."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Represent one study session as a tuple containing a subject, duration and completed flag. Unpack it into meaningful names and print them. Also create and inspect a one-item tuple without accidentally constructing just a number.",
      "hints": [
        "Use commas between tuple elements. Match the unpacking target count to the three values.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Tuples and Unpacking"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Tuples and Unpacking"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-009",
    "languageId": "python",
    "slug": "dictionaries-and-key-lookup",
    "title": "Python Dictionaries and Key Lookup",
    "summary": "Dictionary membership checks keys, and get can supply an explicit missing-key fallback.",
    "order": 9,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Dictionaries and Key Lookup",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA dictionary associates keys with values. Use it when a descriptive lookup key expresses the relationship better than a numeric position. A subject-to-duration mapping lets you request the minutes for Python directly without remembering which list index represents Python. Keys must be hashable, and each key occurs at most once in the mapping. Assigning an existing key replaces its associated value.\n\nIndex-style lookup with mapping[key] raises KeyError if the key is missing. get(key, default) provides an explicit fallback. Do not use a fallback that hides a genuine data defect: zero minutes may be a meaningful result rather than a useful substitute for missing configuration. Decide whether absence is acceptable in this part of the program.\n\nDictionary iteration preserves insertion order in modern Python. Looping over a dictionary yields keys; items() gives key-value pairs for unpacking. Membership with in checks keys, not all stored values. Keep these contracts distinct. When displaying results, use a clear order if the domain requires sorting rather than depending accidentally on the order in which input arrived.\n\n## Example 1: Read and update a key\n\n```python\nminutes = {\"Python\": 30, \"HTML\": 20}\nminutes[\"Python\"] = 40\nprint(minutes[\"Python\"])\nprint(len(minutes))\n```\n\nExpected output:\n\n```text\n40\n2\n```\n\nThe assignment updates an existing key rather than adding a third entry. A dictionary contains one associated value for each distinct key.\n\n## Example 2: Handle a missing key\n\n```python\nminutes = {\"Python\": 30}\nprint(minutes.get(\"CSS\", 0))\nprint(\"Python\" in minutes)\nprint(30 in minutes)\n```\n\nExpected output:\n\n```text\n0\nTrue\nFalse\n```\n\nget returns the chosen default for the missing CSS key. Membership checks keys, so the stored numeric value 30 is not itself a matching key.\n\n## Example 3: Visit key-value pairs\n\n```python\nminutes = {\"Python\": 30, \"HTML\": 20}\nfor subject, duration in minutes.items():\n    print(subject, duration)\n```\n\nExpected output:\n\n```text\nPython 30\nHTML 20\n```\n\nitems provides pairs that the loop unpacks. The output follows the insertion order in this example. The dictionary is not sorted alphabetically automatically.\n\n## Check the reasoning\n\nDictionary membership checks keys, and get can supply an explicit missing-key fallback.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nBuild a subject-to-minutes dictionary for three subjects. Update one duration, print all pairs, and handle an optional fourth subject using an intentional fallback. Explain when bracket lookup would be preferable to get.\n\n### Practice hint\n\nUse items() for both parts of each entry. Check membership before requiring an optional key.\n\n<PredictOutput title=\"Predict: Read and update a key\" code=\"minutes = {&quot;Python&quot;: 30, &quot;HTML&quot;: 20}\nminutes[&quot;Python&quot;] = 40\nprint(minutes[&quot;Python&quot;])\nprint(len(minutes))\" options=\"[&quot;40\\n2&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;40\\n2\\nNone&quot;]\" answer=\"0\" explanation=\"The assignment updates an existing key rather than adding a third entry. A dictionary contains one associated value for each distinct key.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;minutes = {\\&quot;Python\\&quot;: 30, \\&quot;HTML\\&quot;: 20}\\nminutes[\\&quot;Python\\&quot;] = 40\\nprint(minutes[\\&quot;Python\\&quot;])\\nprint(len(minutes))&quot;,&quot;explanation&quot;:&quot;The assignment updates an existing key rather than adding a third entry. A dictionary contains one associated value for each distinct key.&quot;,&quot;values&quot;:&quot;Expected output:\\n40\\n2&quot;},{&quot;line&quot;:&quot;minutes = {\\&quot;Python\\&quot;: 30}\\nprint(minutes.get(\\&quot;CSS\\&quot;, 0))\\nprint(\\&quot;Python\\&quot; in minutes)\\nprint(30 in minutes)&quot;,&quot;explanation&quot;:&quot;get returns the chosen default for the missing CSS key. Membership checks keys, so the stored numeric value 30 is not itself a matching key.&quot;,&quot;values&quot;:&quot;Expected output:\\n0\\nTrue\\nFalse&quot;},{&quot;line&quot;:&quot;minutes = {\\&quot;Python\\&quot;: 30, \\&quot;HTML\\&quot;: 20}\\nfor subject, duration in minutes.items():\\n    print(subject, duration)&quot;,&quot;explanation&quot;:&quot;items provides pairs that the loop unpacks. The output follows the insertion order in this example. The dictionary is not sorted alphabetically automatically.&quot;,&quot;values&quot;:&quot;Expected output:\\nPython 30\\nHTML 20&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"minutes = {&quot;Python&quot;: 30, &quot;HTML&quot;: 20}\nminutes[&quot;Python&quot;] = 40\nprint(minutes[&quot;Python&quot;])\nprint(len(minutes))\" task=\"Build a subject-to-minutes dictionary for three subjects. Update one duration, print all pairs, and handle an optional fourth subject using an intentional fallback. Explain when bracket lookup would be preferable to get. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Dictionaries and Key Lookup\" stages=\"[{&quot;title&quot;:&quot;Read and update a key&quot;,&quot;explanation&quot;:&quot;The assignment updates an existing key rather than adding a third entry. A dictionary contains one associated value for each distinct key.&quot;,&quot;code&quot;:&quot;minutes = {\\&quot;Python\\&quot;: 30, \\&quot;HTML\\&quot;: 20}\\nminutes[\\&quot;Python\\&quot;] = 40\\nprint(minutes[\\&quot;Python\\&quot;])\\nprint(len(minutes))&quot;,&quot;hint&quot;:&quot;Use items() for both parts of each entry. Check membership before requiring an optional key.&quot;,&quot;success&quot;:&quot;The expected output is 40\\n2. The assignment updates an existing key rather than adding a third entry. A dictionary contains one associated value for each distinct key.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;40\\n2&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;40\\n2\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The assignment updates an existing key rather than adding a third entry. A dictionary contains one associated value for each distinct key.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Handle a missing key&quot;,&quot;explanation&quot;:&quot;get returns the chosen default for the missing CSS key. Membership checks keys, so the stored numeric value 30 is not itself a matching key.&quot;,&quot;code&quot;:&quot;minutes = {\\&quot;Python\\&quot;: 30}\\nprint(minutes.get(\\&quot;CSS\\&quot;, 0))\\nprint(\\&quot;Python\\&quot; in minutes)\\nprint(30 in minutes)&quot;,&quot;hint&quot;:&quot;Use items() for both parts of each entry. Check membership before requiring an optional key.&quot;,&quot;success&quot;:&quot;The expected output is 0\\nTrue\\nFalse. get returns the chosen default for the missing CSS key. Membership checks keys, so the stored numeric value 30 is not itself a matching key.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;0\\nTrue\\nFalse&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;0\\nTrue\\nFalse\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;get returns the chosen default for the missing CSS key. Membership checks keys, so the stored numeric value 30 is not itself a matching key.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Visit key-value pairs&quot;,&quot;explanation&quot;:&quot;items provides pairs that the loop unpacks. The output follows the insertion order in this example. The dictionary is not sorted alphabetically automatically.&quot;,&quot;code&quot;:&quot;minutes = {\\&quot;Python\\&quot;: 30, \\&quot;HTML\\&quot;: 20}\\nfor subject, duration in minutes.items():\\n    print(subject, duration)&quot;,&quot;hint&quot;:&quot;Use items() for both parts of each entry. Check membership before requiring an optional key.&quot;,&quot;success&quot;:&quot;The expected output is Python 30\\nHTML 20. items provides pairs that the loop unpacks. The output follows the insertion order in this example. The dictionary is not sorted alphabetically automatically.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Python 30\\nHTML 20&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Python 30\\nHTML 20\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;items provides pairs that the loop unpacks. The output follows the insertion order in this example. The dictionary is not sorted alphabetically automatically.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "minutes = {\"Python\": 30, \"HTML\": 20}\nminutes[\"Python\"] = 40\nprint(minutes[\"Python\"])\nprint(len(minutes))",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nminutes = {\"Python\": 30, \"HTML\": 20}\nminutes[\"Python\"] = 40\nprint(minutes[\"Python\"])\nprint(len(minutes))",
        "explanation": "The assignment updates an existing key rather than adding a third entry. A dictionary contains one associated value for each distinct key.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "40\n2"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "40\n2\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nminutes = {\"Python\": 30}\nprint(minutes.get(\"CSS\", 0))\nprint(\"Python\" in minutes)\nprint(30 in minutes)",
        "explanation": "get returns the chosen default for the missing CSS key. Membership checks keys, so the stored numeric value 30 is not itself a matching key.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "0\nTrue\nFalse"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "0\nTrue\nFalse\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nminutes = {\"Python\": 30, \"HTML\": 20}\nfor subject, duration in minutes.items():\n    print(subject, duration)",
        "explanation": "items provides pairs that the loop unpacks. The output follows the insertion order in this example. The dictionary is not sorted alphabetically automatically.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Python 30\nHTML 20"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Python 30\nHTML 20\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Dictionary membership checks keys, and get can supply an explicit missing-key fallback.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Dictionary membership checks keys, and get can supply an explicit missing-key fallback."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Build a subject-to-minutes dictionary for three subjects. Update one duration, print all pairs, and handle an optional fourth subject using an intentional fallback. Explain when bracket lookup would be preferable to get.",
      "hints": [
        "Use items() for both parts of each entry. Check membership before requiring an optional key.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Dictionaries and Key Lookup"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Dictionaries and Key Lookup"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-010",
    "languageId": "python",
    "slug": "sets-and-membership",
    "title": "Python Sets and Membership",
    "summary": "A set stores distinct members, not a promised display order or indexed sequence.",
    "order": 10,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Sets and Membership",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA set represents distinct hashable values with membership as a central operation. It is useful for questions such as which subjects appear in both a requested and an available collection. It does not provide a positional sequence interface and does not promise an iteration order suitable for a stable display.\n\nConstruct an empty set with set(). Empty braces create an empty dictionary instead. Repeated values collapse into a single set member. That makes a set useful for deduplication when you do not need the original ordering or duplicate count. If either matters, keep the original sequence and choose an algorithm that preserves the information you need.\n\nUnion combines members from either set; intersection keeps common members; difference keeps members from the left that are absent on the right. Those operations return new sets. For reproducible printed examples, sort the result before displaying it. remove raises KeyError for an absent member; discard tolerates its absence. Choosing the latter can be appropriate when absence is expected, but it should not silently hide a broken invariant.\n\n## Example 1: Remove duplicates intentionally\n\n```python\nsubjects = {\"Python\", \"HTML\", \"Python\"}\nprint(len(subjects))\nprint(\"Python\" in subjects)\n```\n\nExpected output:\n\n```text\n2\nTrue\n```\n\nThe repeated Python value does not create another member. The membership test asks whether that value belongs to the set, not where it appears.\n\n## Example 2: Compare two collections\n\n```python\nrequested = {\"Python\", \"CSS\"}\navailable = {\"Python\", \"HTML\"}\nprint(sorted(requested & available))\nprint(sorted(requested - available))\n```\n\nExpected output:\n\n```text\n['Python']\n['CSS']\n```\n\nIntersection identifies the available requested subject. Difference identifies what is requested but unavailable. Sorting makes the display deterministic without claiming that the set itself is ordered.\n\n## Example 3: Create and update an empty set\n\n```python\ncompleted = set()\ncompleted.add(\"HTML\")\ncompleted.add(\"HTML\")\ncompleted.discard(\"CSS\")\nprint(sorted(completed))\n```\n\nExpected output:\n\n```text\n['HTML']\n```\n\nAdding the same member again changes nothing. discard permits the absent CSS member. The empty collection is explicitly a set, not an empty dictionary.\n\n## Check the reasoning\n\nA set stores distinct members, not a promised display order or indexed sequence.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nCompare required subjects with completed subjects. Print a sorted list of remaining subjects and a sorted list of completed requirements. Include a duplicate in your source data and explain what information the set retains.\n\n### Practice hint\n\nremaining = required - completed. Sort only for display, not because set iteration has become ordered.\n\n<PredictOutput title=\"Predict: Remove duplicates intentionally\" code=\"subjects = {&quot;Python&quot;, &quot;HTML&quot;, &quot;Python&quot;}\nprint(len(subjects))\nprint(&quot;Python&quot; in subjects)\" options=\"[&quot;2\\nTrue&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;2\\nTrue\\nNone&quot;]\" answer=\"0\" explanation=\"The repeated Python value does not create another member. The membership test asks whether that value belongs to the set, not where it appears.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;subjects = {\\&quot;Python\\&quot;, \\&quot;HTML\\&quot;, \\&quot;Python\\&quot;}\\nprint(len(subjects))\\nprint(\\&quot;Python\\&quot; in subjects)&quot;,&quot;explanation&quot;:&quot;The repeated Python value does not create another member. The membership test asks whether that value belongs to the set, not where it appears.&quot;,&quot;values&quot;:&quot;Expected output:\\n2\\nTrue&quot;},{&quot;line&quot;:&quot;requested = {\\&quot;Python\\&quot;, \\&quot;CSS\\&quot;}\\navailable = {\\&quot;Python\\&quot;, \\&quot;HTML\\&quot;}\\nprint(sorted(requested &amp; available))\\nprint(sorted(requested - available))&quot;,&quot;explanation&quot;:&quot;Intersection identifies the available requested subject. Difference identifies what is requested but unavailable. Sorting makes the display deterministic without claiming that the set itself is ordered.&quot;,&quot;values&quot;:&quot;Expected output:\\n['Python']\\n['CSS']&quot;},{&quot;line&quot;:&quot;completed = set()\\ncompleted.add(\\&quot;HTML\\&quot;)\\ncompleted.add(\\&quot;HTML\\&quot;)\\ncompleted.discard(\\&quot;CSS\\&quot;)\\nprint(sorted(completed))&quot;,&quot;explanation&quot;:&quot;Adding the same member again changes nothing. discard permits the absent CSS member. The empty collection is explicitly a set, not an empty dictionary.&quot;,&quot;values&quot;:&quot;Expected output:\\n['HTML']&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"subjects = {&quot;Python&quot;, &quot;HTML&quot;, &quot;Python&quot;}\nprint(len(subjects))\nprint(&quot;Python&quot; in subjects)\" task=\"Compare required subjects with completed subjects. Print a sorted list of remaining subjects and a sorted list of completed requirements. Include a duplicate in your source data and explain what information the set retains. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Sets and Membership\" stages=\"[{&quot;title&quot;:&quot;Remove duplicates intentionally&quot;,&quot;explanation&quot;:&quot;The repeated Python value does not create another member. The membership test asks whether that value belongs to the set, not where it appears.&quot;,&quot;code&quot;:&quot;subjects = {\\&quot;Python\\&quot;, \\&quot;HTML\\&quot;, \\&quot;Python\\&quot;}\\nprint(len(subjects))\\nprint(\\&quot;Python\\&quot; in subjects)&quot;,&quot;hint&quot;:&quot;remaining = required - completed. Sort only for display, not because set iteration has become ordered.&quot;,&quot;success&quot;:&quot;The expected output is 2\\nTrue. The repeated Python value does not create another member. The membership test asks whether that value belongs to the set, not where it appears.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;2\\nTrue&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;2\\nTrue\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The repeated Python value does not create another member. The membership test asks whether that value belongs to the set, not where it appears.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Compare two collections&quot;,&quot;explanation&quot;:&quot;Intersection identifies the available requested subject. Difference identifies what is requested but unavailable. Sorting makes the display deterministic without claiming that the set itself is ordered.&quot;,&quot;code&quot;:&quot;requested = {\\&quot;Python\\&quot;, \\&quot;CSS\\&quot;}\\navailable = {\\&quot;Python\\&quot;, \\&quot;HTML\\&quot;}\\nprint(sorted(requested &amp; available))\\nprint(sorted(requested - available))&quot;,&quot;hint&quot;:&quot;remaining = required - completed. Sort only for display, not because set iteration has become ordered.&quot;,&quot;success&quot;:&quot;The expected output is ['Python']\\n['CSS']. Intersection identifies the available requested subject. Difference identifies what is requested but unavailable. Sorting makes the display deterministic without claiming that the set itself is ordered.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;['Python']\\n['CSS']&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;['Python']\\n['CSS']\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Intersection identifies the available requested subject. Difference identifies what is requested but unavailable. Sorting makes the display deterministic without claiming that the set itself is ordered.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Create and update an empty set&quot;,&quot;explanation&quot;:&quot;Adding the same member again changes nothing. discard permits the absent CSS member. The empty collection is explicitly a set, not an empty dictionary.&quot;,&quot;code&quot;:&quot;completed = set()\\ncompleted.add(\\&quot;HTML\\&quot;)\\ncompleted.add(\\&quot;HTML\\&quot;)\\ncompleted.discard(\\&quot;CSS\\&quot;)\\nprint(sorted(completed))&quot;,&quot;hint&quot;:&quot;remaining = required - completed. Sort only for display, not because set iteration has become ordered.&quot;,&quot;success&quot;:&quot;The expected output is ['HTML']. Adding the same member again changes nothing. discard permits the absent CSS member. The empty collection is explicitly a set, not an empty dictionary.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;['HTML']&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;['HTML']\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Adding the same member again changes nothing. discard permits the absent CSS member. The empty collection is explicitly a set, not an empty dictionary.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "subjects = {\"Python\", \"HTML\", \"Python\"}\nprint(len(subjects))\nprint(\"Python\" in subjects)",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nsubjects = {\"Python\", \"HTML\", \"Python\"}\nprint(len(subjects))\nprint(\"Python\" in subjects)",
        "explanation": "The repeated Python value does not create another member. The membership test asks whether that value belongs to the set, not where it appears.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "2\nTrue"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "2\nTrue\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nrequested = {\"Python\", \"CSS\"}\navailable = {\"Python\", \"HTML\"}\nprint(sorted(requested & available))\nprint(sorted(requested - available))",
        "explanation": "Intersection identifies the available requested subject. Difference identifies what is requested but unavailable. Sorting makes the display deterministic without claiming that the set itself is ordered.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "['Python']\n['CSS']"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "['Python']\n['CSS']\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\ncompleted = set()\ncompleted.add(\"HTML\")\ncompleted.add(\"HTML\")\ncompleted.discard(\"CSS\")\nprint(sorted(completed))",
        "explanation": "Adding the same member again changes nothing. discard permits the absent CSS member. The empty collection is explicitly a set, not an empty dictionary.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "['HTML']"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "['HTML']\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "A set stores distinct members, not a promised display order or indexed sequence.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "A set stores distinct members, not a promised display order or indexed sequence."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Compare required subjects with completed subjects. Print a sorted list of remaining subjects and a sorted list of completed requirements. Include a duplicate in your source data and explain what information the set retains.",
      "hints": [
        "remaining = required - completed. Sort only for display, not because set iteration has become ordered.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Sets and Membership"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Sets and Membership"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-011",
    "languageId": "python",
    "slug": "functions-and-return-values",
    "title": "Python Functions and Return Values",
    "summary": "return supplies a value to the caller; print only displays a value.",
    "order": 11,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Functions and Return Values",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA function gives a reusable operation a name. Its definition describes parameters and a body; calling it supplies arguments and executes that body. Merely defining a function does not run its calculation. Keep the purpose small enough that you can explain the input and output contract in a sentence.\n\nreturn sends a value back to the caller and exits the current function call. print writes a display side effect; it is not a replacement for returning a value that another calculation needs. A function without an explicit returned value returns None. This distinction matters when you want to combine operations instead of displaying everything immediately.\n\nLocal names created during a call are separate from the caller names that supplied values. Avoid relying on unrelated global variables when an argument would make the dependency explicit. Functions are easier to test when the same explicit input produces the same result without changing outside state. Later lessons introduce more parameter rules and scope behaviour, but a clear calculation and return is the best starting point.\n\n## Example 1: Return a calculated result\n\n```python\ndef study_total(days, minutes):\n    return days * minutes\n\nresult = study_total(5, 30)\nprint(result)\n```\n\nExpected output:\n\n```text\n150\n```\n\nThe function receives two arguments, computes their product and returns it. The caller chooses to print the returned result. No output occurs merely from defining study_total.\n\n## Example 2: Recognise an implicit None\n\n```python\ndef show_message():\n    print(\"Ready\")\n\nresult = show_message()\nprint(result)\n```\n\nExpected output:\n\n```text\nReady\nNone\n```\n\nThe function displays Ready but has no explicit return expression. The caller therefore receives None, which the final print makes visible.\n\n## Example 3: Compose returned values\n\n```python\ndef double(value):\n    return value * 2\n\nprint(double(10) + double(5))\n```\n\nExpected output:\n\n```text\n30\n```\n\nEach call returns a number. The addition combines those numbers before the outer print displays the total. This would not work the same way if double only printed its result.\n\n## Check the reasoning\n\nreturn supplies a value to the caller; print only displays a value.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nDefine a function taking daily minutes and number of days, return the total, and call it with two different inputs. Keep printing outside the function. Explain how you would test the return value without inspecting screen output.\n\n### Practice hint\n\nWrite return inside the function. Store or compare the call result before printing it.\n\n<PredictOutput title=\"Predict: Return a calculated result\" code=\"def study_total(days, minutes):\n    return days * minutes\n\nresult = study_total(5, 30)\nprint(result)\" options=\"[&quot;150&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;150\\nNone&quot;]\" answer=\"0\" explanation=\"The function receives two arguments, computes their product and returns it. The caller chooses to print the returned result. No output occurs merely from defining study_total.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;def study_total(days, minutes):\\n    return days * minutes\\n\\nresult = study_total(5, 30)\\nprint(result)&quot;,&quot;explanation&quot;:&quot;The function receives two arguments, computes their product and returns it. The caller chooses to print the returned result. No output occurs merely from defining study_total.&quot;,&quot;values&quot;:&quot;Expected output:\\n150&quot;},{&quot;line&quot;:&quot;def show_message():\\n    print(\\&quot;Ready\\&quot;)\\n\\nresult = show_message()\\nprint(result)&quot;,&quot;explanation&quot;:&quot;The function displays Ready but has no explicit return expression. The caller therefore receives None, which the final print makes visible.&quot;,&quot;values&quot;:&quot;Expected output:\\nReady\\nNone&quot;},{&quot;line&quot;:&quot;def double(value):\\n    return value * 2\\n\\nprint(double(10) + double(5))&quot;,&quot;explanation&quot;:&quot;Each call returns a number. The addition combines those numbers before the outer print displays the total. This would not work the same way if double only printed its result.&quot;,&quot;values&quot;:&quot;Expected output:\\n30&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"def study_total(days, minutes):\n    return days * minutes\n\nresult = study_total(5, 30)\nprint(result)\" task=\"Define a function taking daily minutes and number of days, return the total, and call it with two different inputs. Keep printing outside the function. Explain how you would test the return value without inspecting screen output. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Functions and Return Values\" stages=\"[{&quot;title&quot;:&quot;Return a calculated result&quot;,&quot;explanation&quot;:&quot;The function receives two arguments, computes their product and returns it. The caller chooses to print the returned result. No output occurs merely from defining study_total.&quot;,&quot;code&quot;:&quot;def study_total(days, minutes):\\n    return days * minutes\\n\\nresult = study_total(5, 30)\\nprint(result)&quot;,&quot;hint&quot;:&quot;Write return inside the function. Store or compare the call result before printing it.&quot;,&quot;success&quot;:&quot;The expected output is 150. The function receives two arguments, computes their product and returns it. The caller chooses to print the returned result. No output occurs merely from defining study_total.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;150&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;150\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The function receives two arguments, computes their product and returns it. The caller chooses to print the returned result. No output occurs merely from defining study_total.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Recognise an implicit None&quot;,&quot;explanation&quot;:&quot;The function displays Ready but has no explicit return expression. The caller therefore receives None, which the final print makes visible.&quot;,&quot;code&quot;:&quot;def show_message():\\n    print(\\&quot;Ready\\&quot;)\\n\\nresult = show_message()\\nprint(result)&quot;,&quot;hint&quot;:&quot;Write return inside the function. Store or compare the call result before printing it.&quot;,&quot;success&quot;:&quot;The expected output is Ready\\nNone. The function displays Ready but has no explicit return expression. The caller therefore receives None, which the final print makes visible.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Ready\\nNone&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Ready\\nNone\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The function displays Ready but has no explicit return expression. The caller therefore receives None, which the final print makes visible.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Compose returned values&quot;,&quot;explanation&quot;:&quot;Each call returns a number. The addition combines those numbers before the outer print displays the total. This would not work the same way if double only printed its result.&quot;,&quot;code&quot;:&quot;def double(value):\\n    return value * 2\\n\\nprint(double(10) + double(5))&quot;,&quot;hint&quot;:&quot;Write return inside the function. Store or compare the call result before printing it.&quot;,&quot;success&quot;:&quot;The expected output is 30. Each call returns a number. The addition combines those numbers before the outer print displays the total. This would not work the same way if double only printed its result.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;30&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;30\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Each call returns a number. The addition combines those numbers before the outer print displays the total. This would not work the same way if double only printed its result.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "def study_total(days, minutes):\n    return days * minutes\n\nresult = study_total(5, 30)\nprint(result)",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\ndef study_total(days, minutes):\n    return days * minutes\n\nresult = study_total(5, 30)\nprint(result)",
        "explanation": "The function receives two arguments, computes their product and returns it. The caller chooses to print the returned result. No output occurs merely from defining study_total.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "150"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "150\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\ndef show_message():\n    print(\"Ready\")\n\nresult = show_message()\nprint(result)",
        "explanation": "The function displays Ready but has no explicit return expression. The caller therefore receives None, which the final print makes visible.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Ready\nNone"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Ready\nNone\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\ndef double(value):\n    return value * 2\n\nprint(double(10) + double(5))",
        "explanation": "Each call returns a number. The addition combines those numbers before the outer print displays the total. This would not work the same way if double only printed its result.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "30"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "30\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "return supplies a value to the caller; print only displays a value.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "return supplies a value to the caller; print only displays a value."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Define a function taking daily minutes and number of days, return the total, and call it with two different inputs. Keep printing outside the function. Explain how you would test the return value without inspecting screen output.",
      "hints": [
        "Write return inside the function. Store or compare the call result before printing it.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Functions and Return Values"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Functions and Return Values"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-012",
    "languageId": "python",
    "slug": "parameters-defaults-and-scope",
    "title": "Python Parameters, Defaults and Scope",
    "summary": "Use a fresh collection inside the call instead of a mutable default shared between calls.",
    "order": 12,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Parameters, Defaults and Scope",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nParameters name the inputs a function accepts. Positional arguments are matched by position, while keyword arguments identify their parameter names explicitly. A default provides a value when the caller omits that argument. Choose defaults that make sense for the operation rather than using them to hide a required decision.\n\nDefault expressions are evaluated when the function definition executes, not freshly on every call. A mutable default such as items=[] can therefore be shared across calls. Use None as a sentinel and construct a new list inside the function when each omitted argument should mean a fresh collection. Passing an existing list intentionally still permits the function to mutate that list, so document that contract.\n\nAssignments inside a function normally create local bindings. Reading an outer value is different from assigning an outer binding. Prefer returning a new value and assigning it in the caller over reaching for global state. This keeps the source of a change visible and makes the function easier to reuse. A function parameter is a local name bound to the supplied object, not an automatic deep copy of that object.\n\n## Example 1: Use a default intentionally\n\n```python\ndef total(days, minutes=30):\n    return days * minutes\n\nprint(total(5))\nprint(total(minutes=20, days=3))\n```\n\nExpected output:\n\n```text\n150\n60\n```\n\nThe omitted minutes argument receives its default on the first call. Explicit keywords make the second call readable without depending on argument order.\n\n## Example 2: Build a fresh optional list\n\n```python\ndef record(value, items=None):\n    if items is None:\n        items = []\n    items.append(value)\n    return items\n\nprint(record(\"HTML\"))\nprint(record(\"Python\"))\n```\n\nExpected output:\n\n```text\n['HTML']\n['Python']\n```\n\nEach omitted items argument causes a new list to be constructed inside that call. The second result does not accidentally contain the first call’s subject.\n\n## Example 3: Separate local and caller bindings\n\n```python\nminutes = 30\n\ndef adjust(value):\n    minutes = value + 5\n    return minutes\n\nprint(adjust(10))\nprint(minutes)\n```\n\nExpected output:\n\n```text\n15\n30\n```\n\nThe assignment in adjust creates a local name. Returning its value does not overwrite the caller’s minutes binding. The caller can explicitly store the result if that is desired.\n\n## Check the reasoning\n\nUse a fresh collection inside the call instead of a mutable default shared between calls.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nWrite a function that returns a fresh list of revision tasks when no list is supplied. Call it twice and prove the results do not accumulate unintentionally. Add one optional keyword argument and explain its default.\n\n### Practice hint\n\nUse items=None, then test items is None inside the function.\n\n<PredictOutput title=\"Predict: Use a default intentionally\" code=\"def total(days, minutes=30):\n    return days * minutes\n\nprint(total(5))\nprint(total(minutes=20, days=3))\" options=\"[&quot;150\\n60&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;150\\n60\\nNone&quot;]\" answer=\"0\" explanation=\"The omitted minutes argument receives its default on the first call. Explicit keywords make the second call readable without depending on argument order.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;def total(days, minutes=30):\\n    return days * minutes\\n\\nprint(total(5))\\nprint(total(minutes=20, days=3))&quot;,&quot;explanation&quot;:&quot;The omitted minutes argument receives its default on the first call. Explicit keywords make the second call readable without depending on argument order.&quot;,&quot;values&quot;:&quot;Expected output:\\n150\\n60&quot;},{&quot;line&quot;:&quot;def record(value, items=None):\\n    if items is None:\\n        items = []\\n    items.append(value)\\n    return items\\n\\nprint(record(\\&quot;HTML\\&quot;))\\nprint(record(\\&quot;Python\\&quot;))&quot;,&quot;explanation&quot;:&quot;Each omitted items argument causes a new list to be constructed inside that call. The second result does not accidentally contain the first call’s subject.&quot;,&quot;values&quot;:&quot;Expected output:\\n['HTML']\\n['Python']&quot;},{&quot;line&quot;:&quot;minutes = 30\\n\\ndef adjust(value):\\n    minutes = value + 5\\n    return minutes\\n\\nprint(adjust(10))\\nprint(minutes)&quot;,&quot;explanation&quot;:&quot;The assignment in adjust creates a local name. Returning its value does not overwrite the caller’s minutes binding. The caller can explicitly store the result if that is desired.&quot;,&quot;values&quot;:&quot;Expected output:\\n15\\n30&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"def total(days, minutes=30):\n    return days * minutes\n\nprint(total(5))\nprint(total(minutes=20, days=3))\" task=\"Write a function that returns a fresh list of revision tasks when no list is supplied. Call it twice and prove the results do not accumulate unintentionally. Add one optional keyword argument and explain its default. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Parameters, Defaults and Scope\" stages=\"[{&quot;title&quot;:&quot;Use a default intentionally&quot;,&quot;explanation&quot;:&quot;The omitted minutes argument receives its default on the first call. Explicit keywords make the second call readable without depending on argument order.&quot;,&quot;code&quot;:&quot;def total(days, minutes=30):\\n    return days * minutes\\n\\nprint(total(5))\\nprint(total(minutes=20, days=3))&quot;,&quot;hint&quot;:&quot;Use items=None, then test items is None inside the function.&quot;,&quot;success&quot;:&quot;The expected output is 150\\n60. The omitted minutes argument receives its default on the first call. Explicit keywords make the second call readable without depending on argument order.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;150\\n60&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;150\\n60\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The omitted minutes argument receives its default on the first call. Explicit keywords make the second call readable without depending on argument order.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Build a fresh optional list&quot;,&quot;explanation&quot;:&quot;Each omitted items argument causes a new list to be constructed inside that call. The second result does not accidentally contain the first call’s subject.&quot;,&quot;code&quot;:&quot;def record(value, items=None):\\n    if items is None:\\n        items = []\\n    items.append(value)\\n    return items\\n\\nprint(record(\\&quot;HTML\\&quot;))\\nprint(record(\\&quot;Python\\&quot;))&quot;,&quot;hint&quot;:&quot;Use items=None, then test items is None inside the function.&quot;,&quot;success&quot;:&quot;The expected output is ['HTML']\\n['Python']. Each omitted items argument causes a new list to be constructed inside that call. The second result does not accidentally contain the first call’s subject.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;['HTML']\\n['Python']&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;['HTML']\\n['Python']\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Each omitted items argument causes a new list to be constructed inside that call. The second result does not accidentally contain the first call’s subject.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Separate local and caller bindings&quot;,&quot;explanation&quot;:&quot;The assignment in adjust creates a local name. Returning its value does not overwrite the caller’s minutes binding. The caller can explicitly store the result if that is desired.&quot;,&quot;code&quot;:&quot;minutes = 30\\n\\ndef adjust(value):\\n    minutes = value + 5\\n    return minutes\\n\\nprint(adjust(10))\\nprint(minutes)&quot;,&quot;hint&quot;:&quot;Use items=None, then test items is None inside the function.&quot;,&quot;success&quot;:&quot;The expected output is 15\\n30. The assignment in adjust creates a local name. Returning its value does not overwrite the caller’s minutes binding. The caller can explicitly store the result if that is desired.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;15\\n30&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;15\\n30\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The assignment in adjust creates a local name. Returning its value does not overwrite the caller’s minutes binding. The caller can explicitly store the result if that is desired.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "def total(days, minutes=30):\n    return days * minutes\n\nprint(total(5))\nprint(total(minutes=20, days=3))",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\ndef total(days, minutes=30):\n    return days * minutes\n\nprint(total(5))\nprint(total(minutes=20, days=3))",
        "explanation": "The omitted minutes argument receives its default on the first call. Explicit keywords make the second call readable without depending on argument order.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "150\n60"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "150\n60\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\ndef record(value, items=None):\n    if items is None:\n        items = []\n    items.append(value)\n    return items\n\nprint(record(\"HTML\"))\nprint(record(\"Python\"))",
        "explanation": "Each omitted items argument causes a new list to be constructed inside that call. The second result does not accidentally contain the first call’s subject.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "['HTML']\n['Python']"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "['HTML']\n['Python']\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nminutes = 30\n\ndef adjust(value):\n    minutes = value + 5\n    return minutes\n\nprint(adjust(10))\nprint(minutes)",
        "explanation": "The assignment in adjust creates a local name. Returning its value does not overwrite the caller’s minutes binding. The caller can explicitly store the result if that is desired.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "15\n30"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "15\n30\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Use a fresh collection inside the call instead of a mutable default shared between calls.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Use a fresh collection inside the call instead of a mutable default shared between calls."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Write a function that returns a fresh list of revision tasks when no list is supplied. Call it twice and prove the results do not accumulate unintentionally. Add one optional keyword argument and explain its default.",
      "hints": [
        "Use items=None, then test items is None inside the function.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Parameters, Defaults and Scope"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Parameters, Defaults and Scope"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-013",
    "languageId": "python",
    "slug": "comprehensions",
    "title": "Python Comprehensions",
    "summary": "The comprehension expression transforms each included item; its trailing condition filters inputs.",
    "order": 13,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Comprehensions",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA comprehension constructs a collection from an iterable using an expression and optional filtering conditions. Read a simple list comprehension as: evaluate the leading expression for each item that passes the filter. It is a compact collection-building tool, not a requirement to replace every loop.\n\nThe expression determines what enters the result; the filter determines whether an input participates. These roles are separate. An if after the iterable filters items, while a conditional expression before for chooses between output values. Start with a normal loop if the distinction is not yet clear. Name the source collection and result so the transformation can be explained.\n\nList, set and dictionary comprehensions build different collection types. A dictionary comprehension creates key-value associations, and duplicate keys overwrite earlier values just as in other dictionary construction. Avoid side effects inside a comprehension. If the code is mainly printing, updating unrelated state or handling several branches, an explicit loop usually communicates the intent better. Compact syntax is useful only when the reader can still reason about the operation.\n\n## Example 1: Transform each input\n\n```python\nminutes = [10, 20, 30]\ndoubled = [value * 2 for value in minutes]\nprint(doubled)\nprint(minutes)\n```\n\nExpected output:\n\n```text\n[20, 40, 60]\n[10, 20, 30]\n```\n\nThe expression multiplies each number before it enters the new list. The original list is not changed by this construction.\n\n## Example 2: Filter before collecting\n\n```python\nscores = [65, 80, 92]\npassed = [score for score in scores if score >= 80]\nprint(passed)\n```\n\nExpected output:\n\n```text\n[80, 92]\n```\n\nOnly values satisfying the inclusive passing condition enter the result. The leading expression is score, so the included numeric values are retained without another transformation.\n\n## Example 3: Build named associations\n\n```python\nsubjects = [\"HTML\", \"Python\"]\nlengths = {subject: len(subject) for subject in subjects}\nprint(lengths[\"HTML\"])\nprint(lengths[\"Python\"])\n```\n\nExpected output:\n\n```text\n4\n6\n```\n\nThe comprehension produces a dictionary, not a list. Each subject becomes a key associated with its character count, and the prints perform explicit key lookups.\n\n## Check the reasoning\n\nThe comprehension expression transforms each included item; its trailing condition filters inputs.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nFrom durations [10, 25, 40, 15], build a new list containing double the durations that are at least 20. Then write the equivalent ordinary loop and compare the results.\n\n### Practice hint\n\nTransform with value * 2 and filter with value &gt;= 20. Do not reverse those roles.\n\n<PredictOutput title=\"Predict: Transform each input\" code=\"minutes = [10, 20, 30]\ndoubled = [value * 2 for value in minutes]\nprint(doubled)\nprint(minutes)\" options=\"[&quot;[20, 40, 60]\\n[10, 20, 30]&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;[20, 40, 60]\\n[10, 20, 30]\\nNone&quot;]\" answer=\"0\" explanation=\"The expression multiplies each number before it enters the new list. The original list is not changed by this construction.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;minutes = [10, 20, 30]\\ndoubled = [value * 2 for value in minutes]\\nprint(doubled)\\nprint(minutes)&quot;,&quot;explanation&quot;:&quot;The expression multiplies each number before it enters the new list. The original list is not changed by this construction.&quot;,&quot;values&quot;:&quot;Expected output:\\n[20, 40, 60]\\n[10, 20, 30]&quot;},{&quot;line&quot;:&quot;scores = [65, 80, 92]\\npassed = [score for score in scores if score &gt;= 80]\\nprint(passed)&quot;,&quot;explanation&quot;:&quot;Only values satisfying the inclusive passing condition enter the result. The leading expression is score, so the included numeric values are retained without another transformation.&quot;,&quot;values&quot;:&quot;Expected output:\\n[80, 92]&quot;},{&quot;line&quot;:&quot;subjects = [\\&quot;HTML\\&quot;, \\&quot;Python\\&quot;]\\nlengths = {subject: len(subject) for subject in subjects}\\nprint(lengths[\\&quot;HTML\\&quot;])\\nprint(lengths[\\&quot;Python\\&quot;])&quot;,&quot;explanation&quot;:&quot;The comprehension produces a dictionary, not a list. Each subject becomes a key associated with its character count, and the prints perform explicit key lookups.&quot;,&quot;values&quot;:&quot;Expected output:\\n4\\n6&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"minutes = [10, 20, 30]\ndoubled = [value * 2 for value in minutes]\nprint(doubled)\nprint(minutes)\" task=\"From durations [10, 25, 40, 15], build a new list containing double the durations that are at least 20. Then write the equivalent ordinary loop and compare the results. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Comprehensions\" stages=\"[{&quot;title&quot;:&quot;Transform each input&quot;,&quot;explanation&quot;:&quot;The expression multiplies each number before it enters the new list. The original list is not changed by this construction.&quot;,&quot;code&quot;:&quot;minutes = [10, 20, 30]\\ndoubled = [value * 2 for value in minutes]\\nprint(doubled)\\nprint(minutes)&quot;,&quot;hint&quot;:&quot;Transform with value * 2 and filter with value &gt;= 20. Do not reverse those roles.&quot;,&quot;success&quot;:&quot;The expected output is [20, 40, 60]\\n[10, 20, 30]. The expression multiplies each number before it enters the new list. The original list is not changed by this construction.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;[20, 40, 60]\\n[10, 20, 30]&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;[20, 40, 60]\\n[10, 20, 30]\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The expression multiplies each number before it enters the new list. The original list is not changed by this construction.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Filter before collecting&quot;,&quot;explanation&quot;:&quot;Only values satisfying the inclusive passing condition enter the result. The leading expression is score, so the included numeric values are retained without another transformation.&quot;,&quot;code&quot;:&quot;scores = [65, 80, 92]\\npassed = [score for score in scores if score &gt;= 80]\\nprint(passed)&quot;,&quot;hint&quot;:&quot;Transform with value * 2 and filter with value &gt;= 20. Do not reverse those roles.&quot;,&quot;success&quot;:&quot;The expected output is [80, 92]. Only values satisfying the inclusive passing condition enter the result. The leading expression is score, so the included numeric values are retained without another transformation.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;[80, 92]&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;[80, 92]\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Only values satisfying the inclusive passing condition enter the result. The leading expression is score, so the included numeric values are retained without another transformation.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Build named associations&quot;,&quot;explanation&quot;:&quot;The comprehension produces a dictionary, not a list. Each subject becomes a key associated with its character count, and the prints perform explicit key lookups.&quot;,&quot;code&quot;:&quot;subjects = [\\&quot;HTML\\&quot;, \\&quot;Python\\&quot;]\\nlengths = {subject: len(subject) for subject in subjects}\\nprint(lengths[\\&quot;HTML\\&quot;])\\nprint(lengths[\\&quot;Python\\&quot;])&quot;,&quot;hint&quot;:&quot;Transform with value * 2 and filter with value &gt;= 20. Do not reverse those roles.&quot;,&quot;success&quot;:&quot;The expected output is 4\\n6. The comprehension produces a dictionary, not a list. Each subject becomes a key associated with its character count, and the prints perform explicit key lookups.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;4\\n6&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;4\\n6\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The comprehension produces a dictionary, not a list. Each subject becomes a key associated with its character count, and the prints perform explicit key lookups.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "minutes = [10, 20, 30]\ndoubled = [value * 2 for value in minutes]\nprint(doubled)\nprint(minutes)",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nminutes = [10, 20, 30]\ndoubled = [value * 2 for value in minutes]\nprint(doubled)\nprint(minutes)",
        "explanation": "The expression multiplies each number before it enters the new list. The original list is not changed by this construction.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "[20, 40, 60]\n[10, 20, 30]"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "[20, 40, 60]\n[10, 20, 30]\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nscores = [65, 80, 92]\npassed = [score for score in scores if score >= 80]\nprint(passed)",
        "explanation": "Only values satisfying the inclusive passing condition enter the result. The leading expression is score, so the included numeric values are retained without another transformation.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "[80, 92]"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "[80, 92]\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nsubjects = [\"HTML\", \"Python\"]\nlengths = {subject: len(subject) for subject in subjects}\nprint(lengths[\"HTML\"])\nprint(lengths[\"Python\"])",
        "explanation": "The comprehension produces a dictionary, not a list. Each subject becomes a key associated with its character count, and the prints perform explicit key lookups.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "4\n6"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "4\n6\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "The comprehension expression transforms each included item; its trailing condition filters inputs.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "The comprehension expression transforms each included item; its trailing condition filters inputs."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "From durations [10, 25, 40, 15], build a new list containing double the durations that are at least 20. Then write the equivalent ordinary loop and compare the results.",
      "hints": [
        "Transform with value * 2 and filter with value >= 20. Do not reverse those roles.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Comprehensions"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Comprehensions"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-014",
    "languageId": "python",
    "slug": "exceptions-and-recovery",
    "title": "Python Exceptions and Recovery",
    "summary": "Catch a specific expected failure and make recovery explicit rather than hiding unrelated errors.",
    "order": 14,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Exceptions and Recovery",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nAn exception signals that an operation could not complete normally. It interrupts the current path until an appropriate handler is found. A syntax error in your program and a ValueError while parsing external text are different problems; do not treat every failure as something to ignore and continue past.\n\nA try suite contains the operation that may fail. An except clause handles a specified exception class. Keep the protected operation small enough that the handler’s meaning stays clear. Catching Exception around the whole program can conceal unrelated bugs, such as a misspelled name in the recovery logic. Catch the failures that the program can actually recover from.\n\nThe else suite runs if the try suite completes without an exception. finally runs as execution leaves the try statement, whether the operation succeeded or failed. It is useful for cleanup, but a context manager is often clearer for resource management. A recovery value must make sense in the domain: returning zero for invalid exam data can silently convert a bad record into an apparently valid score. Prefer an explicit invalid result when that distinction matters.\n\n## Example 1: Handle invalid integer text\n\n```python\ntext = \"twelve\"\ntry:\n    value = int(text)\nexcept ValueError:\n    print(\"Enter integer digits\")\n```\n\nExpected output:\n\n```text\nEnter integer digits\n```\n\nint cannot parse this word as an integer, so ValueError selects the handler. The program displays an actionable message instead of pretending conversion succeeded.\n\n## Example 2: Separate success and cleanup\n\n```python\ntry:\n    value = int(\"12\")\nexcept ValueError:\n    print(\"Invalid\")\nelse:\n    print(value * 2)\nfinally:\n    print(\"Checked\")\n```\n\nExpected output:\n\n```text\n24\nChecked\n```\n\nConversion succeeds, so else runs. finally then runs on exit from the statement. No Invalid message is printed because the except branch was not selected.\n\n## Example 3: Raise a domain error\n\n```python\ndef checked_minutes(value):\n    if value < 0:\n        raise ValueError(\"Minutes cannot be negative\")\n    return value\n\ntry:\n    checked_minutes(-5)\nexcept ValueError as error:\n    print(str(error))\n```\n\nExpected output:\n\n```text\nMinutes cannot be negative\n```\n\nThe value is numeric but invalid for the application’s domain. Raising an explicit error distinguishes this situation from a successful duration calculation.\n\n## Check the reasoning\n\nCatch a specific expected failure and make recovery explicit rather than hiding unrelated errors.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nWrite a parser for a positive number of study minutes. Handle nonnumeric text and reject negative values. Test valid text, an invalid word and a negative number without catching every possible exception.\n\n### Practice hint\n\nKeep int conversion and domain validation visible. Catch ValueError only where recovery is intended.\n\n<PredictOutput title=\"Predict: Handle invalid integer text\" code=\"text = &quot;twelve&quot;\ntry:\n    value = int(text)\nexcept ValueError:\n    print(&quot;Enter integer digits&quot;)\" options=\"[&quot;Enter integer digits&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Enter integer digits\\nNone&quot;]\" answer=\"0\" explanation=\"int cannot parse this word as an integer, so ValueError selects the handler. The program displays an actionable message instead of pretending conversion succeeded.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;text = \\&quot;twelve\\&quot;\\ntry:\\n    value = int(text)\\nexcept ValueError:\\n    print(\\&quot;Enter integer digits\\&quot;)&quot;,&quot;explanation&quot;:&quot;int cannot parse this word as an integer, so ValueError selects the handler. The program displays an actionable message instead of pretending conversion succeeded.&quot;,&quot;values&quot;:&quot;Expected output:\\nEnter integer digits&quot;},{&quot;line&quot;:&quot;try:\\n    value = int(\\&quot;12\\&quot;)\\nexcept ValueError:\\n    print(\\&quot;Invalid\\&quot;)\\nelse:\\n    print(value * 2)\\nfinally:\\n    print(\\&quot;Checked\\&quot;)&quot;,&quot;explanation&quot;:&quot;Conversion succeeds, so else runs. finally then runs on exit from the statement. No Invalid message is printed because the except branch was not selected.&quot;,&quot;values&quot;:&quot;Expected output:\\n24\\nChecked&quot;},{&quot;line&quot;:&quot;def checked_minutes(value):\\n    if value &lt; 0:\\n        raise ValueError(\\&quot;Minutes cannot be negative\\&quot;)\\n    return value\\n\\ntry:\\n    checked_minutes(-5)\\nexcept ValueError as error:\\n    print(str(error))&quot;,&quot;explanation&quot;:&quot;The value is numeric but invalid for the application’s domain. Raising an explicit error distinguishes this situation from a successful duration calculation.&quot;,&quot;values&quot;:&quot;Expected output:\\nMinutes cannot be negative&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"text = &quot;twelve&quot;\ntry:\n    value = int(text)\nexcept ValueError:\n    print(&quot;Enter integer digits&quot;)\" task=\"Write a parser for a positive number of study minutes. Handle nonnumeric text and reject negative values. Test valid text, an invalid word and a negative number without catching every possible exception. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Exceptions and Recovery\" stages=\"[{&quot;title&quot;:&quot;Handle invalid integer text&quot;,&quot;explanation&quot;:&quot;int cannot parse this word as an integer, so ValueError selects the handler. The program displays an actionable message instead of pretending conversion succeeded.&quot;,&quot;code&quot;:&quot;text = \\&quot;twelve\\&quot;\\ntry:\\n    value = int(text)\\nexcept ValueError:\\n    print(\\&quot;Enter integer digits\\&quot;)&quot;,&quot;hint&quot;:&quot;Keep int conversion and domain validation visible. Catch ValueError only where recovery is intended.&quot;,&quot;success&quot;:&quot;The expected output is Enter integer digits. int cannot parse this word as an integer, so ValueError selects the handler. The program displays an actionable message instead of pretending conversion succeeded.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Enter integer digits&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Enter integer digits\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;int cannot parse this word as an integer, so ValueError selects the handler. The program displays an actionable message instead of pretending conversion succeeded.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Separate success and cleanup&quot;,&quot;explanation&quot;:&quot;Conversion succeeds, so else runs. finally then runs on exit from the statement. No Invalid message is printed because the except branch was not selected.&quot;,&quot;code&quot;:&quot;try:\\n    value = int(\\&quot;12\\&quot;)\\nexcept ValueError:\\n    print(\\&quot;Invalid\\&quot;)\\nelse:\\n    print(value * 2)\\nfinally:\\n    print(\\&quot;Checked\\&quot;)&quot;,&quot;hint&quot;:&quot;Keep int conversion and domain validation visible. Catch ValueError only where recovery is intended.&quot;,&quot;success&quot;:&quot;The expected output is 24\\nChecked. Conversion succeeds, so else runs. finally then runs on exit from the statement. No Invalid message is printed because the except branch was not selected.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;24\\nChecked&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;24\\nChecked\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Conversion succeeds, so else runs. finally then runs on exit from the statement. No Invalid message is printed because the except branch was not selected.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Raise a domain error&quot;,&quot;explanation&quot;:&quot;The value is numeric but invalid for the application’s domain. Raising an explicit error distinguishes this situation from a successful duration calculation.&quot;,&quot;code&quot;:&quot;def checked_minutes(value):\\n    if value &lt; 0:\\n        raise ValueError(\\&quot;Minutes cannot be negative\\&quot;)\\n    return value\\n\\ntry:\\n    checked_minutes(-5)\\nexcept ValueError as error:\\n    print(str(error))&quot;,&quot;hint&quot;:&quot;Keep int conversion and domain validation visible. Catch ValueError only where recovery is intended.&quot;,&quot;success&quot;:&quot;The expected output is Minutes cannot be negative. The value is numeric but invalid for the application’s domain. Raising an explicit error distinguishes this situation from a successful duration calculation.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Minutes cannot be negative&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Minutes cannot be negative\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The value is numeric but invalid for the application’s domain. Raising an explicit error distinguishes this situation from a successful duration calculation.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "text = \"twelve\"\ntry:\n    value = int(text)\nexcept ValueError:\n    print(\"Enter integer digits\")",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\ntext = \"twelve\"\ntry:\n    value = int(text)\nexcept ValueError:\n    print(\"Enter integer digits\")",
        "explanation": "int cannot parse this word as an integer, so ValueError selects the handler. The program displays an actionable message instead of pretending conversion succeeded.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Enter integer digits"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Enter integer digits\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\ntry:\n    value = int(\"12\")\nexcept ValueError:\n    print(\"Invalid\")\nelse:\n    print(value * 2)\nfinally:\n    print(\"Checked\")",
        "explanation": "Conversion succeeds, so else runs. finally then runs on exit from the statement. No Invalid message is printed because the except branch was not selected.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "24\nChecked"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "24\nChecked\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\ndef checked_minutes(value):\n    if value < 0:\n        raise ValueError(\"Minutes cannot be negative\")\n    return value\n\ntry:\n    checked_minutes(-5)\nexcept ValueError as error:\n    print(str(error))",
        "explanation": "The value is numeric but invalid for the application’s domain. Raising an explicit error distinguishes this situation from a successful duration calculation.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Minutes cannot be negative"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Minutes cannot be negative\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Catch a specific expected failure and make recovery explicit rather than hiding unrelated errors.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Catch a specific expected failure and make recovery explicit rather than hiding unrelated errors."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Write a parser for a positive number of study minutes. Handle nonnumeric text and reject negative values. Test valid text, an invalid word and a negative number without catching every possible exception.",
      "hints": [
        "Keep int conversion and domain validation visible. Catch ValueError only where recovery is intended.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Exceptions and Recovery"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Exceptions and Recovery"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-015",
    "languageId": "python",
    "slug": "modules-and-imports",
    "title": "Python Modules and Imports",
    "summary": "Importing a module provides a namespace; it does not make every external package or system capability available.",
    "order": 15,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Modules and Imports",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA module provides a namespace that groups related definitions. Importing a module binds a name through which you can access its members. Using math.isqrt makes both the operation and its source visible; importing one selected name can be convenient when that name remains unambiguous in the surrounding code.\n\nThe standard library ships with Python, but availability still depends on the execution environment. Browser practice is not an unrestricted operating-system shell. Do not assume that every standard-library feature can access files, spawn processes or contact networks here. Third-party packages are not automatically available just because an example on the internet imports them.\n\nAvoid wildcard imports in introductory application code because they hide where names came from and can overwrite existing bindings. Do not name your own source file math.py or json.py when you intend to import the standard-library module of that name: local naming conflicts can produce confusing behaviour. Imports can execute module-level code, so shared modules should avoid unexpected work at import time. A main guard lets a module distinguish direct execution from being imported by another program.\n\n## Example 1: Use a module namespace\n\n```python\nimport math\nprint(math.isqrt(81))\nprint(math.ceil(2.2))\n```\n\nExpected output:\n\n```text\n9\n3\n```\n\nisqrt gives the integer square root, and ceil rounds upward to an integer. Prefixing both names with math makes their origin explicit.\n\n## Example 2: Import one selected name\n\n```python\nfrom math import gcd\nprint(gcd(18, 24))\n```\n\nExpected output:\n\n```text\n6\n```\n\ngcd becomes a name in the current namespace. This is not the same spelling as importing math and then calling math.gcd, although both access the same standard-library operation.\n\n## Example 3: Inspect a familiar namespace\n\n```python\nimport string\nprint(string.ascii_lowercase[:3])\nprint(string.digits)\n```\n\nExpected output:\n\n```text\nabc\n0123456789\n```\n\nThe module also exposes useful constant values, not only functions. The slice uses the same stop-excluded rule already studied for strings.\n\n## Check the reasoning\n\nImporting a module provides a namespace; it does not make every external package or system capability available.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nUse math.isqrt on three perfect squares and math.gcd on two positive integers. Keep module-qualified names in one version, then demonstrate a selected-name import in another. Explain the naming trade-off.\n\n### Practice hint\n\nUse only the standard-library operations shown. No package installation or network access is needed.\n\n<PredictOutput title=\"Predict: Use a module namespace\" code=\"import math\nprint(math.isqrt(81))\nprint(math.ceil(2.2))\" options=\"[&quot;9\\n3&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;9\\n3\\nNone&quot;]\" answer=\"0\" explanation=\"isqrt gives the integer square root, and ceil rounds upward to an integer. Prefixing both names with math makes their origin explicit.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;import math\\nprint(math.isqrt(81))\\nprint(math.ceil(2.2))&quot;,&quot;explanation&quot;:&quot;isqrt gives the integer square root, and ceil rounds upward to an integer. Prefixing both names with math makes their origin explicit.&quot;,&quot;values&quot;:&quot;Expected output:\\n9\\n3&quot;},{&quot;line&quot;:&quot;from math import gcd\\nprint(gcd(18, 24))&quot;,&quot;explanation&quot;:&quot;gcd becomes a name in the current namespace. This is not the same spelling as importing math and then calling math.gcd, although both access the same standard-library operation.&quot;,&quot;values&quot;:&quot;Expected output:\\n6&quot;},{&quot;line&quot;:&quot;import string\\nprint(string.ascii_lowercase[:3])\\nprint(string.digits)&quot;,&quot;explanation&quot;:&quot;The module also exposes useful constant values, not only functions. The slice uses the same stop-excluded rule already studied for strings.&quot;,&quot;values&quot;:&quot;Expected output:\\nabc\\n0123456789&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"import math\nprint(math.isqrt(81))\nprint(math.ceil(2.2))\" task=\"Use math.isqrt on three perfect squares and math.gcd on two positive integers. Keep module-qualified names in one version, then demonstrate a selected-name import in another. Explain the naming trade-off. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Modules and Imports\" stages=\"[{&quot;title&quot;:&quot;Use a module namespace&quot;,&quot;explanation&quot;:&quot;isqrt gives the integer square root, and ceil rounds upward to an integer. Prefixing both names with math makes their origin explicit.&quot;,&quot;code&quot;:&quot;import math\\nprint(math.isqrt(81))\\nprint(math.ceil(2.2))&quot;,&quot;hint&quot;:&quot;Use only the standard-library operations shown. No package installation or network access is needed.&quot;,&quot;success&quot;:&quot;The expected output is 9\\n3. isqrt gives the integer square root, and ceil rounds upward to an integer. Prefixing both names with math makes their origin explicit.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;9\\n3&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;9\\n3\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;isqrt gives the integer square root, and ceil rounds upward to an integer. Prefixing both names with math makes their origin explicit.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Import one selected name&quot;,&quot;explanation&quot;:&quot;gcd becomes a name in the current namespace. This is not the same spelling as importing math and then calling math.gcd, although both access the same standard-library operation.&quot;,&quot;code&quot;:&quot;from math import gcd\\nprint(gcd(18, 24))&quot;,&quot;hint&quot;:&quot;Use only the standard-library operations shown. No package installation or network access is needed.&quot;,&quot;success&quot;:&quot;The expected output is 6. gcd becomes a name in the current namespace. This is not the same spelling as importing math and then calling math.gcd, although both access the same standard-library operation.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;6&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;6\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;gcd becomes a name in the current namespace. This is not the same spelling as importing math and then calling math.gcd, although both access the same standard-library operation.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Inspect a familiar namespace&quot;,&quot;explanation&quot;:&quot;The module also exposes useful constant values, not only functions. The slice uses the same stop-excluded rule already studied for strings.&quot;,&quot;code&quot;:&quot;import string\\nprint(string.ascii_lowercase[:3])\\nprint(string.digits)&quot;,&quot;hint&quot;:&quot;Use only the standard-library operations shown. No package installation or network access is needed.&quot;,&quot;success&quot;:&quot;The expected output is abc\\n0123456789. The module also exposes useful constant values, not only functions. The slice uses the same stop-excluded rule already studied for strings.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;abc\\n0123456789&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;abc\\n0123456789\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The module also exposes useful constant values, not only functions. The slice uses the same stop-excluded rule already studied for strings.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "import math\nprint(math.isqrt(81))\nprint(math.ceil(2.2))",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nimport math\nprint(math.isqrt(81))\nprint(math.ceil(2.2))",
        "explanation": "isqrt gives the integer square root, and ceil rounds upward to an integer. Prefixing both names with math makes their origin explicit.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "9\n3"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "9\n3\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nfrom math import gcd\nprint(gcd(18, 24))",
        "explanation": "gcd becomes a name in the current namespace. This is not the same spelling as importing math and then calling math.gcd, although both access the same standard-library operation.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "6"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "6\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nimport string\nprint(string.ascii_lowercase[:3])\nprint(string.digits)",
        "explanation": "The module also exposes useful constant values, not only functions. The slice uses the same stop-excluded rule already studied for strings.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "abc\n0123456789"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "abc\n0123456789\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Importing a module provides a namespace; it does not make every external package or system capability available.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Importing a module provides a namespace; it does not make every external package or system capability available."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Use math.isqrt on three perfect squares and math.gcd on two positive integers. Keep module-qualified names in one version, then demonstrate a selected-name import in another. Explain the naming trade-off.",
      "hints": [
        "Use only the standard-library operations shown. No package installation or network access is needed.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Modules and Imports"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Modules and Imports"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-016",
    "languageId": "python",
    "slug": "standard-library-tools",
    "title": "Practical Python Standard-Library Tools",
    "summary": "Choose a standard-library tool according to its input/output contract and preserve meaningful data.",
    "order": 16,
    "version": 1,
    "objectives": [
      "Explain and apply: Practical Python Standard-Library Tools",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nThe standard library contains focused tools that prevent unnecessary reinvention. Choose a tool by its input and output contract rather than importing a large collection of names and guessing which one might work. statistics.mean computes an arithmetic mean; collections.Counter counts occurrences; itertools can build controlled iteration patterns. Each solves a different problem.\n\nA count is not the same statistic as an average. If duplicate subjects are meaningful events, converting to a set before counting destroys useful frequency information. Likewise, an average can hide variation: two students with very different scores may have the same mean as a consistent student. Report a measure only when it answers the question you are asking.\n\nInspect edge cases before relying on an operation. An empty data collection may require an explicit decision instead of a default that looks like a valid measurement. Iterators can also be consumed; converting a tiny iterator to a list is useful for inspection, but building enormous collections defeats their purpose. These examples are deliberately bounded and deterministic, requiring no external packages or network services.\n\n## Example 1: Calculate an arithmetic mean\n\n```python\nfrom statistics import mean\nminutes = [20, 30, 40]\nprint(mean(minutes))\n```\n\nExpected output:\n\n```text\n30\n```\n\nThe sum of the three durations is ninety and the item count is three. mean computes their arithmetic average. This does not imply that each session lasted thirty minutes.\n\n## Example 2: Count repeated values\n\n```python\nfrom collections import Counter\ncounts = Counter([\"Python\", \"HTML\", \"Python\"])\nprint(counts[\"Python\"])\nprint(counts[\"CSS\"])\n```\n\nExpected output:\n\n```text\n2\n0\n```\n\nCounter retains frequency rather than discarding repeats. Its missing-member count is zero, a deliberate contract that differs from ordinary dictionary bracket lookup.\n\n## Example 3: Pair consecutive values\n\n```python\nfrom itertools import pairwise\nfor previous, current in pairwise([10, 15, 25]):\n    print(current - previous)\n```\n\nExpected output:\n\n```text\n5\n10\n```\n\npairwise yields adjacent pairs. The loop calculates successive changes without treating the first item as a change from an invented zero. It requires Python 3.10 or newer, supported by this course runtime.\n\n## Check the reasoning\n\nChoose a standard-library tool according to its input/output contract and preserve meaningful data.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nFor durations [20, 30, 20, 40], calculate the mean and count how often 20 occurs. Explain why using a set first would change the meaning of the average and lose frequency information.\n\n### Practice hint\n\nPass the original duration list to both tools. Choose mean and Counter for their different purposes.\n\n<PredictOutput title=\"Predict: Calculate an arithmetic mean\" code=\"from statistics import mean\nminutes = [20, 30, 40]\nprint(mean(minutes))\" options=\"[&quot;30&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;30\\nNone&quot;]\" answer=\"0\" explanation=\"The sum of the three durations is ninety and the item count is three. mean computes their arithmetic average. This does not imply that each session lasted thirty minutes.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;from statistics import mean\\nminutes = [20, 30, 40]\\nprint(mean(minutes))&quot;,&quot;explanation&quot;:&quot;The sum of the three durations is ninety and the item count is three. mean computes their arithmetic average. This does not imply that each session lasted thirty minutes.&quot;,&quot;values&quot;:&quot;Expected output:\\n30&quot;},{&quot;line&quot;:&quot;from collections import Counter\\ncounts = Counter([\\&quot;Python\\&quot;, \\&quot;HTML\\&quot;, \\&quot;Python\\&quot;])\\nprint(counts[\\&quot;Python\\&quot;])\\nprint(counts[\\&quot;CSS\\&quot;])&quot;,&quot;explanation&quot;:&quot;Counter retains frequency rather than discarding repeats. Its missing-member count is zero, a deliberate contract that differs from ordinary dictionary bracket lookup.&quot;,&quot;values&quot;:&quot;Expected output:\\n2\\n0&quot;},{&quot;line&quot;:&quot;from itertools import pairwise\\nfor previous, current in pairwise([10, 15, 25]):\\n    print(current - previous)&quot;,&quot;explanation&quot;:&quot;pairwise yields adjacent pairs. The loop calculates successive changes without treating the first item as a change from an invented zero. It requires Python 3.10 or newer, supported by this course runtime.&quot;,&quot;values&quot;:&quot;Expected output:\\n5\\n10&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"from statistics import mean\nminutes = [20, 30, 40]\nprint(mean(minutes))\" task=\"For durations [20, 30, 20, 40], calculate the mean and count how often 20 occurs. Explain why using a set first would change the meaning of the average and lose frequency information. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Practical Python Standard-Library Tools\" stages=\"[{&quot;title&quot;:&quot;Calculate an arithmetic mean&quot;,&quot;explanation&quot;:&quot;The sum of the three durations is ninety and the item count is three. mean computes their arithmetic average. This does not imply that each session lasted thirty minutes.&quot;,&quot;code&quot;:&quot;from statistics import mean\\nminutes = [20, 30, 40]\\nprint(mean(minutes))&quot;,&quot;hint&quot;:&quot;Pass the original duration list to both tools. Choose mean and Counter for their different purposes.&quot;,&quot;success&quot;:&quot;The expected output is 30. The sum of the three durations is ninety and the item count is three. mean computes their arithmetic average. This does not imply that each session lasted thirty minutes.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;30&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;30\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The sum of the three durations is ninety and the item count is three. mean computes their arithmetic average. This does not imply that each session lasted thirty minutes.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Count repeated values&quot;,&quot;explanation&quot;:&quot;Counter retains frequency rather than discarding repeats. Its missing-member count is zero, a deliberate contract that differs from ordinary dictionary bracket lookup.&quot;,&quot;code&quot;:&quot;from collections import Counter\\ncounts = Counter([\\&quot;Python\\&quot;, \\&quot;HTML\\&quot;, \\&quot;Python\\&quot;])\\nprint(counts[\\&quot;Python\\&quot;])\\nprint(counts[\\&quot;CSS\\&quot;])&quot;,&quot;hint&quot;:&quot;Pass the original duration list to both tools. Choose mean and Counter for their different purposes.&quot;,&quot;success&quot;:&quot;The expected output is 2\\n0. Counter retains frequency rather than discarding repeats. Its missing-member count is zero, a deliberate contract that differs from ordinary dictionary bracket lookup.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;2\\n0&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;2\\n0\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;Counter retains frequency rather than discarding repeats. Its missing-member count is zero, a deliberate contract that differs from ordinary dictionary bracket lookup.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Pair consecutive values&quot;,&quot;explanation&quot;:&quot;pairwise yields adjacent pairs. The loop calculates successive changes without treating the first item as a change from an invented zero. It requires Python 3.10 or newer, supported by this course runtime.&quot;,&quot;code&quot;:&quot;from itertools import pairwise\\nfor previous, current in pairwise([10, 15, 25]):\\n    print(current - previous)&quot;,&quot;hint&quot;:&quot;Pass the original duration list to both tools. Choose mean and Counter for their different purposes.&quot;,&quot;success&quot;:&quot;The expected output is 5\\n10. pairwise yields adjacent pairs. The loop calculates successive changes without treating the first item as a change from an invented zero. It requires Python 3.10 or newer, supported by this course runtime.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;5\\n10&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;5\\n10\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;pairwise yields adjacent pairs. The loop calculates successive changes without treating the first item as a change from an invented zero. It requires Python 3.10 or newer, supported by this course runtime.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "from statistics import mean\nminutes = [20, 30, 40]\nprint(mean(minutes))",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nfrom statistics import mean\nminutes = [20, 30, 40]\nprint(mean(minutes))",
        "explanation": "The sum of the three durations is ninety and the item count is three. mean computes their arithmetic average. This does not imply that each session lasted thirty minutes.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "30"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "30\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nfrom collections import Counter\ncounts = Counter([\"Python\", \"HTML\", \"Python\"])\nprint(counts[\"Python\"])\nprint(counts[\"CSS\"])",
        "explanation": "Counter retains frequency rather than discarding repeats. Its missing-member count is zero, a deliberate contract that differs from ordinary dictionary bracket lookup.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "2\n0"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "2\n0\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nfrom itertools import pairwise\nfor previous, current in pairwise([10, 15, 25]):\n    print(current - previous)",
        "explanation": "pairwise yields adjacent pairs. The loop calculates successive changes without treating the first item as a change from an invented zero. It requires Python 3.10 or newer, supported by this course runtime.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "5\n10"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "5\n10\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Choose a standard-library tool according to its input/output contract and preserve meaningful data.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Choose a standard-library tool according to its input/output contract and preserve meaningful data."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "For durations [20, 30, 20, 40], calculate the mean and count how often 20 occurs. Explain why using a set first would change the meaning of the average and lose frequency information.",
      "hints": [
        "Pass the original duration list to both tools. Choose mean and Counter for their different purposes.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Practical Python Standard-Library Tools"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Practical Python Standard-Library Tools"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-017",
    "languageId": "python",
    "slug": "json-and-bounded-files",
    "title": "Python JSON and Bounded File Handling",
    "summary": "JSON parsing constructs data, not executable source, and parsed records still need validation.",
    "order": 17,
    "version": 1,
    "objectives": [
      "Explain and apply: Python JSON and Bounded File Handling",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nJSON is a text data format, not executable Python source. json.loads parses JSON text into Python values; json.dumps serialises compatible values into JSON text. JSON true, false and null map to Python True, False and None. Object keys are text, and JSON does not preserve arbitrary Python object types.\n\nParsing is not complete validation. A syntactically valid JSON document can still have missing fields, unexpected types or unreasonable sizes. Check the shape and domain constraints before treating data as a trusted record. Never use eval to parse text received from a user or a remote system. The JSON parser is built for this job and does not need to execute source code.\n\nFile access also has an environment boundary. The practice interpreter uses an isolated virtual filesystem and does not promise persistence after a session or reload. To demonstrate the file interface without changing any real files, these examples use io.StringIO. Its with statement shows a context-managed text stream that is closed afterward. A production program using real paths would additionally need explicit encoding, path boundaries, size limits and an appropriate storage lifecycle.\n\n## Example 1: Read JSON data\n\n```python\nimport json\nrecord = json.loads('{\"subject\":\"Python\",\"minutes\":30,\"done\":true}')\nprint(record[\"subject\"])\nprint(record[\"done\"])\n```\n\nExpected output:\n\n```text\nPython\nTrue\n```\n\nThe JSON boolean becomes a Python bool. The parsed dictionary can be queried with normal key access, but a real application should still verify required keys and value types.\n\n## Example 2: Serialise predictably\n\n```python\nimport json\nrecord = {\"minutes\": 30, \"done\": False}\nprint(json.dumps(record, sort_keys=True))\n```\n\nExpected output:\n\n```text\n{\"done\": false, \"minutes\": 30}\n```\n\ndumps creates a JSON string. Sorting keys makes this example’s output stable; it does not change the dictionary’s meaning or add validation.\n\n## Example 3: Read a bounded text stream\n\n```python\nfrom io import StringIO\nwith StringIO(\"Python\\nHTML\\n\") as stream:\n    first = stream.readline().strip()\n    second = stream.readline().strip()\n    print(first)\n    print(second)\nprint(stream.closed)\n```\n\nExpected output:\n\n```text\nPython\nHTML\nTrue\n```\n\nThe stream contains fixed in-memory text, not a persistent external file. readline reads one line at a time, and leaving the context closes the stream.\n\n## Check the reasoning\n\nJSON parsing constructs data, not executable source, and parsed records still need validation.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nParse a small JSON revision record and check that minutes is an integer in a reasonable positive range. Serialise an updated record without executing any input as Python. Explain why the browser does not provide durable file storage here.\n\n### Practice hint\n\nUse json.loads and explicit isinstance/range checks. Keep any text-stream demonstration in StringIO.\n\n<PredictOutput title=\"Predict: Read JSON data\" code=\"import json\nrecord = json.loads('{&quot;subject&quot;:&quot;Python&quot;,&quot;minutes&quot;:30,&quot;done&quot;:true}')\nprint(record[&quot;subject&quot;])\nprint(record[&quot;done&quot;])\" options=\"[&quot;Python\\nTrue&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Python\\nTrue\\nNone&quot;]\" answer=\"0\" explanation=\"The JSON boolean becomes a Python bool. The parsed dictionary can be queried with normal key access, but a real application should still verify required keys and value types.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;import json\\nrecord = json.loads('{\\&quot;subject\\&quot;:\\&quot;Python\\&quot;,\\&quot;minutes\\&quot;:30,\\&quot;done\\&quot;:true}')\\nprint(record[\\&quot;subject\\&quot;])\\nprint(record[\\&quot;done\\&quot;])&quot;,&quot;explanation&quot;:&quot;The JSON boolean becomes a Python bool. The parsed dictionary can be queried with normal key access, but a real application should still verify required keys and value types.&quot;,&quot;values&quot;:&quot;Expected output:\\nPython\\nTrue&quot;},{&quot;line&quot;:&quot;import json\\nrecord = {\\&quot;minutes\\&quot;: 30, \\&quot;done\\&quot;: False}\\nprint(json.dumps(record, sort_keys=True))&quot;,&quot;explanation&quot;:&quot;dumps creates a JSON string. Sorting keys makes this example’s output stable; it does not change the dictionary’s meaning or add validation.&quot;,&quot;values&quot;:&quot;Expected output:\\n{\\&quot;done\\&quot;: false, \\&quot;minutes\\&quot;: 30}&quot;},{&quot;line&quot;:&quot;from io import StringIO\\nwith StringIO(\\&quot;Python\\\\nHTML\\\\n\\&quot;) as stream:\\n    first = stream.readline().strip()\\n    second = stream.readline().strip()\\n    print(first)\\n    print(second)\\nprint(stream.closed)&quot;,&quot;explanation&quot;:&quot;The stream contains fixed in-memory text, not a persistent external file. readline reads one line at a time, and leaving the context closes the stream.&quot;,&quot;values&quot;:&quot;Expected output:\\nPython\\nHTML\\nTrue&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"import json\nrecord = json.loads('{&quot;subject&quot;:&quot;Python&quot;,&quot;minutes&quot;:30,&quot;done&quot;:true}')\nprint(record[&quot;subject&quot;])\nprint(record[&quot;done&quot;])\" task=\"Parse a small JSON revision record and check that minutes is an integer in a reasonable positive range. Serialise an updated record without executing any input as Python. Explain why the browser does not provide durable file storage here. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python JSON and Bounded File Handling\" stages=\"[{&quot;title&quot;:&quot;Read JSON data&quot;,&quot;explanation&quot;:&quot;The JSON boolean becomes a Python bool. The parsed dictionary can be queried with normal key access, but a real application should still verify required keys and value types.&quot;,&quot;code&quot;:&quot;import json\\nrecord = json.loads('{\\&quot;subject\\&quot;:\\&quot;Python\\&quot;,\\&quot;minutes\\&quot;:30,\\&quot;done\\&quot;:true}')\\nprint(record[\\&quot;subject\\&quot;])\\nprint(record[\\&quot;done\\&quot;])&quot;,&quot;hint&quot;:&quot;Use json.loads and explicit isinstance/range checks. Keep any text-stream demonstration in StringIO.&quot;,&quot;success&quot;:&quot;The expected output is Python\\nTrue. The JSON boolean becomes a Python bool. The parsed dictionary can be queried with normal key access, but a real application should still verify required keys and value types.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Python\\nTrue&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Python\\nTrue\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The JSON boolean becomes a Python bool. The parsed dictionary can be queried with normal key access, but a real application should still verify required keys and value types.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Serialise predictably&quot;,&quot;explanation&quot;:&quot;dumps creates a JSON string. Sorting keys makes this example’s output stable; it does not change the dictionary’s meaning or add validation.&quot;,&quot;code&quot;:&quot;import json\\nrecord = {\\&quot;minutes\\&quot;: 30, \\&quot;done\\&quot;: False}\\nprint(json.dumps(record, sort_keys=True))&quot;,&quot;hint&quot;:&quot;Use json.loads and explicit isinstance/range checks. Keep any text-stream demonstration in StringIO.&quot;,&quot;success&quot;:&quot;The expected output is {\\&quot;done\\&quot;: false, \\&quot;minutes\\&quot;: 30}. dumps creates a JSON string. Sorting keys makes this example’s output stable; it does not change the dictionary’s meaning or add validation.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;{\\&quot;done\\&quot;: false, \\&quot;minutes\\&quot;: 30}&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;{\\&quot;done\\&quot;: false, \\&quot;minutes\\&quot;: 30}\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;dumps creates a JSON string. Sorting keys makes this example’s output stable; it does not change the dictionary’s meaning or add validation.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Read a bounded text stream&quot;,&quot;explanation&quot;:&quot;The stream contains fixed in-memory text, not a persistent external file. readline reads one line at a time, and leaving the context closes the stream.&quot;,&quot;code&quot;:&quot;from io import StringIO\\nwith StringIO(\\&quot;Python\\\\nHTML\\\\n\\&quot;) as stream:\\n    first = stream.readline().strip()\\n    second = stream.readline().strip()\\n    print(first)\\n    print(second)\\nprint(stream.closed)&quot;,&quot;hint&quot;:&quot;Use json.loads and explicit isinstance/range checks. Keep any text-stream demonstration in StringIO.&quot;,&quot;success&quot;:&quot;The expected output is Python\\nHTML\\nTrue. The stream contains fixed in-memory text, not a persistent external file. readline reads one line at a time, and leaving the context closes the stream.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Python\\nHTML\\nTrue&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Python\\nHTML\\nTrue\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The stream contains fixed in-memory text, not a persistent external file. readline reads one line at a time, and leaving the context closes the stream.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "import json\nrecord = json.loads('{\"subject\":\"Python\",\"minutes\":30,\"done\":true}')\nprint(record[\"subject\"])\nprint(record[\"done\"])",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nimport json\nrecord = json.loads('{\"subject\":\"Python\",\"minutes\":30,\"done\":true}')\nprint(record[\"subject\"])\nprint(record[\"done\"])",
        "explanation": "The JSON boolean becomes a Python bool. The parsed dictionary can be queried with normal key access, but a real application should still verify required keys and value types.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Python\nTrue"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Python\nTrue\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nimport json\nrecord = {\"minutes\": 30, \"done\": False}\nprint(json.dumps(record, sort_keys=True))",
        "explanation": "dumps creates a JSON string. Sorting keys makes this example’s output stable; it does not change the dictionary’s meaning or add validation.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "{\"done\": false, \"minutes\": 30}"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "{\"done\": false, \"minutes\": 30}\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nfrom io import StringIO\nwith StringIO(\"Python\\nHTML\\n\") as stream:\n    first = stream.readline().strip()\n    second = stream.readline().strip()\n    print(first)\n    print(second)\nprint(stream.closed)",
        "explanation": "The stream contains fixed in-memory text, not a persistent external file. readline reads one line at a time, and leaving the context closes the stream.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Python\nHTML\nTrue"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Python\nHTML\nTrue\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "JSON parsing constructs data, not executable source, and parsed records still need validation.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "JSON parsing constructs data, not executable source, and parsed records still need validation."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Parse a small JSON revision record and check that minutes is an integer in a reasonable positive range. Serialise an updated record without executing any input as Python. Explain why the browser does not provide durable file storage here.",
      "hints": [
        "Use json.loads and explicit isinstance/range checks. Keep any text-stream demonstration in StringIO.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python JSON and Bounded File Handling"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python JSON and Bounded File Handling"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-018",
    "languageId": "python",
    "slug": "classes-and-instances",
    "title": "Python Classes and Instances",
    "summary": "Instance attributes assigned through self belong to that instance rather than an implicitly shared mutable class collection.",
    "order": 18,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Classes and Instances",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA class defines a type whose instances can hold related state and behaviour. Use it when the relationship between the data and operations becomes clearer, not merely because classes look more advanced. A small dictionary and a function can be the better design for a simple one-off calculation.\n\n__init__ initialises an instance after it is created. The conventional first parameter self refers to the instance receiving the method call. Assigning self.name creates or updates an attribute on that instance. By contrast, a mutable attribute created directly in the class body can be shared across instances, which is often an unwanted surprise for beginners.\n\nA method call such as session.finish() passes the instance to its method automatically. Keep the method’s state change understandable and protect domain constraints where needed. Public attributes are not automatically validated simply because they belong to a class. The examples focus on separate instance state and a clear method contract; inheritance is not required to organise this small model.\n\n## Example 1: Create an instance\n\n```python\nclass Session:\n    def __init__(self, subject, minutes):\n        self.subject = subject\n        self.minutes = minutes\n\nsession = Session(\"Python\", 30)\nprint(session.subject)\nprint(session.minutes)\n```\n\nExpected output:\n\n```text\nPython\n30\n```\n\nThe constructor arguments initialise two attributes on the new instance. The class defines the structure; the session name refers to one concrete instance.\n\n## Example 2: Keep per-instance state separate\n\n```python\nclass Checklist:\n    def __init__(self):\n        self.items = []\n\nfirst = Checklist()\nsecond = Checklist()\nfirst.items.append(\"Read\")\nprint(first.items)\nprint(second.items)\n```\n\nExpected output:\n\n```text\n['Read']\n[]\n```\n\nA fresh list is created in each initialisation. Appending to the first instance’s items does not append to the second instance’s separate list.\n\n## Example 3: Call a state-changing method\n\n```python\nclass Session:\n    def __init__(self):\n        self.completed = False\n\n    def finish(self):\n        self.completed = True\n\nsession = Session()\nprint(session.completed)\nsession.finish()\nprint(session.completed)\n```\n\nExpected output:\n\n```text\nFalse\nTrue\n```\n\nfinish receives the instance and changes its completed attribute. The call, not the mere method definition, performs the change.\n\n## Check the reasoning\n\nInstance attributes assigned through self belong to that instance rather than an implicitly shared mutable class collection.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nCreate a StudySession class with subject, minutes and completed instance attributes. Add a finish method. Create two instances, finish only one, and demonstrate that their completion states remain independent.\n\n### Practice hint\n\nInitialise mutable state inside __init__. Access the current instance with self.\n\n<PredictOutput title=\"Predict: Create an instance\" code=\"class Session:\n    def __init__(self, subject, minutes):\n        self.subject = subject\n        self.minutes = minutes\n\nsession = Session(&quot;Python&quot;, 30)\nprint(session.subject)\nprint(session.minutes)\" options=\"[&quot;Python\\n30&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Python\\n30\\nNone&quot;]\" answer=\"0\" explanation=\"The constructor arguments initialise two attributes on the new instance. The class defines the structure; the session name refers to one concrete instance.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;class Session:\\n    def __init__(self, subject, minutes):\\n        self.subject = subject\\n        self.minutes = minutes\\n\\nsession = Session(\\&quot;Python\\&quot;, 30)\\nprint(session.subject)\\nprint(session.minutes)&quot;,&quot;explanation&quot;:&quot;The constructor arguments initialise two attributes on the new instance. The class defines the structure; the session name refers to one concrete instance.&quot;,&quot;values&quot;:&quot;Expected output:\\nPython\\n30&quot;},{&quot;line&quot;:&quot;class Checklist:\\n    def __init__(self):\\n        self.items = []\\n\\nfirst = Checklist()\\nsecond = Checklist()\\nfirst.items.append(\\&quot;Read\\&quot;)\\nprint(first.items)\\nprint(second.items)&quot;,&quot;explanation&quot;:&quot;A fresh list is created in each initialisation. Appending to the first instance’s items does not append to the second instance’s separate list.&quot;,&quot;values&quot;:&quot;Expected output:\\n['Read']\\n[]&quot;},{&quot;line&quot;:&quot;class Session:\\n    def __init__(self):\\n        self.completed = False\\n\\n    def finish(self):\\n        self.completed = True\\n\\nsession = Session()\\nprint(session.completed)\\nsession.finish()\\nprint(session.completed)&quot;,&quot;explanation&quot;:&quot;finish receives the instance and changes its completed attribute. The call, not the mere method definition, performs the change.&quot;,&quot;values&quot;:&quot;Expected output:\\nFalse\\nTrue&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"class Session:\n    def __init__(self, subject, minutes):\n        self.subject = subject\n        self.minutes = minutes\n\nsession = Session(&quot;Python&quot;, 30)\nprint(session.subject)\nprint(session.minutes)\" task=\"Create a StudySession class with subject, minutes and completed instance attributes. Add a finish method. Create two instances, finish only one, and demonstrate that their completion states remain independent. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Classes and Instances\" stages=\"[{&quot;title&quot;:&quot;Create an instance&quot;,&quot;explanation&quot;:&quot;The constructor arguments initialise two attributes on the new instance. The class defines the structure; the session name refers to one concrete instance.&quot;,&quot;code&quot;:&quot;class Session:\\n    def __init__(self, subject, minutes):\\n        self.subject = subject\\n        self.minutes = minutes\\n\\nsession = Session(\\&quot;Python\\&quot;, 30)\\nprint(session.subject)\\nprint(session.minutes)&quot;,&quot;hint&quot;:&quot;Initialise mutable state inside __init__. Access the current instance with self.&quot;,&quot;success&quot;:&quot;The expected output is Python\\n30. The constructor arguments initialise two attributes on the new instance. The class defines the structure; the session name refers to one concrete instance.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Python\\n30&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Python\\n30\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The constructor arguments initialise two attributes on the new instance. The class defines the structure; the session name refers to one concrete instance.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Keep per-instance state separate&quot;,&quot;explanation&quot;:&quot;A fresh list is created in each initialisation. Appending to the first instance’s items does not append to the second instance’s separate list.&quot;,&quot;code&quot;:&quot;class Checklist:\\n    def __init__(self):\\n        self.items = []\\n\\nfirst = Checklist()\\nsecond = Checklist()\\nfirst.items.append(\\&quot;Read\\&quot;)\\nprint(first.items)\\nprint(second.items)&quot;,&quot;hint&quot;:&quot;Initialise mutable state inside __init__. Access the current instance with self.&quot;,&quot;success&quot;:&quot;The expected output is ['Read']\\n[]. A fresh list is created in each initialisation. Appending to the first instance’s items does not append to the second instance’s separate list.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;['Read']\\n[]&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;['Read']\\n[]\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;A fresh list is created in each initialisation. Appending to the first instance’s items does not append to the second instance’s separate list.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Call a state-changing method&quot;,&quot;explanation&quot;:&quot;finish receives the instance and changes its completed attribute. The call, not the mere method definition, performs the change.&quot;,&quot;code&quot;:&quot;class Session:\\n    def __init__(self):\\n        self.completed = False\\n\\n    def finish(self):\\n        self.completed = True\\n\\nsession = Session()\\nprint(session.completed)\\nsession.finish()\\nprint(session.completed)&quot;,&quot;hint&quot;:&quot;Initialise mutable state inside __init__. Access the current instance with self.&quot;,&quot;success&quot;:&quot;The expected output is False\\nTrue. finish receives the instance and changes its completed attribute. The call, not the mere method definition, performs the change.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;False\\nTrue&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;False\\nTrue\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;finish receives the instance and changes its completed attribute. The call, not the mere method definition, performs the change.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "class Session:\n    def __init__(self, subject, minutes):\n        self.subject = subject\n        self.minutes = minutes\n\nsession = Session(\"Python\", 30)\nprint(session.subject)\nprint(session.minutes)",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nclass Session:\n    def __init__(self, subject, minutes):\n        self.subject = subject\n        self.minutes = minutes\n\nsession = Session(\"Python\", 30)\nprint(session.subject)\nprint(session.minutes)",
        "explanation": "The constructor arguments initialise two attributes on the new instance. The class defines the structure; the session name refers to one concrete instance.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Python\n30"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Python\n30\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nclass Checklist:\n    def __init__(self):\n        self.items = []\n\nfirst = Checklist()\nsecond = Checklist()\nfirst.items.append(\"Read\")\nprint(first.items)\nprint(second.items)",
        "explanation": "A fresh list is created in each initialisation. Appending to the first instance’s items does not append to the second instance’s separate list.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "['Read']\n[]"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "['Read']\n[]\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nclass Session:\n    def __init__(self):\n        self.completed = False\n\n    def finish(self):\n        self.completed = True\n\nsession = Session()\nprint(session.completed)\nsession.finish()\nprint(session.completed)",
        "explanation": "finish receives the instance and changes its completed attribute. The call, not the mere method definition, performs the change.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "False\nTrue"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "False\nTrue\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Instance attributes assigned through self belong to that instance rather than an implicitly shared mutable class collection.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Instance attributes assigned through self belong to that instance rather than an implicitly shared mutable class collection."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Create a StudySession class with subject, minutes and completed instance attributes. Add a finish method. Create two instances, finish only one, and demonstrate that their completion states remain independent.",
      "hints": [
        "Initialise mutable state inside __init__. Access the current instance with self.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Classes and Instances"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Classes and Instances"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-019",
    "languageId": "python",
    "slug": "tests-and-debugging",
    "title": "Python Tests and Debugging",
    "summary": "Test normal cases, boundaries and expected failures; a passing test does not prove all possible behaviour.",
    "order": 19,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Tests and Debugging",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nA test compares observed behaviour with an explicit expectation. It is stronger than glancing at output and deciding it looks plausible. Start with a small function whose return contract is clear, then cover a normal case, a boundary and a failure case. A passing example proves that particular check, not every possible property of the program.\n\nAssertions are convenient for small learning checks, but ordinary assert statements can be disabled when Python runs with optimisation. Do not use assert as the only protection for user input, authentication or another required production invariant. Explicit validation should raise or return an intentional failure independently of optimisation settings. unittest supplies test-case methods for a structured suite.\n\nDebugging begins with reproducing the defect. Reduce the input, locate the first point where observed state differs from the prediction, and fix the cause rather than editing the expected output until the test turns green. Keep a regression check that would have failed before the fix. A test that never calls the relevant function, or only repeats its implementation in a different spelling, can create false confidence.\n\n## Example 1: Check an exact return value\n\n```python\ndef total(days, minutes):\n    return days * minutes\n\nassert total(5, 30) == 150\nassert total(0, 30) == 0\nprint(\"Two checks passed\")\n```\n\nExpected output:\n\n```text\nTwo checks passed\n```\n\nThe second assertion tests the zero-day boundary. The message is printed only after both assertions succeed in this normal interpreter configuration.\n\n## Example 2: Check a required failure\n\n```python\ndef checked_minutes(value):\n    if value < 0:\n        raise ValueError(\"Negative duration\")\n    return value\n\ntry:\n    checked_minutes(-1)\nexcept ValueError:\n    print(\"Expected rejection\")\nelse:\n    raise RuntimeError(\"Missing rejection\")\n```\n\nExpected output:\n\n```text\nExpected rejection\n```\n\nThe else branch would fail the check if the invalid input were accepted. Merely catching an exception without an explicit no-exception failure would not prove the rejection happened.\n\n## Example 3: Use a structured test case\n\n```python\nimport unittest\n\nclass TotalChecks(unittest.TestCase):\n    def test_product(self):\n        self.assertEqual(5 * 30, 150)\n\nresult = unittest.TestResult()\nTotalChecks(\"test_product\").run(result)\nprint(result.testsRun)\nprint(result.wasSuccessful())\n```\n\nExpected output:\n\n```text\n1\nTrue\n```\n\nThe test case executes one named test and records its result without printing an environment-dependent runner banner. A real application would test its actual function rather than only this introductory arithmetic expression.\n\n## Check the reasoning\n\nTest normal cases, boundaries and expected failures; a passing test does not prove all possible behaviour.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nWrite a study-total function and checks for ordinary input, zero days and a negative-duration rejection. Deliberately introduce an off-by-one error, observe which check catches it, then fix the implementation without changing the valid expectation.\n\n### Practice hint\n\nChoose expectations from the problem statement. Ensure the expected-failure check also fails when no exception is raised.\n\n<PredictOutput title=\"Predict: Check an exact return value\" code=\"def total(days, minutes):\n    return days * minutes\n\nassert total(5, 30) == 150\nassert total(0, 30) == 0\nprint(&quot;Two checks passed&quot;)\" options=\"[&quot;Two checks passed&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Two checks passed\\nNone&quot;]\" answer=\"0\" explanation=\"The second assertion tests the zero-day boundary. The message is printed only after both assertions succeed in this normal interpreter configuration.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;def total(days, minutes):\\n    return days * minutes\\n\\nassert total(5, 30) == 150\\nassert total(0, 30) == 0\\nprint(\\&quot;Two checks passed\\&quot;)&quot;,&quot;explanation&quot;:&quot;The second assertion tests the zero-day boundary. The message is printed only after both assertions succeed in this normal interpreter configuration.&quot;,&quot;values&quot;:&quot;Expected output:\\nTwo checks passed&quot;},{&quot;line&quot;:&quot;def checked_minutes(value):\\n    if value &lt; 0:\\n        raise ValueError(\\&quot;Negative duration\\&quot;)\\n    return value\\n\\ntry:\\n    checked_minutes(-1)\\nexcept ValueError:\\n    print(\\&quot;Expected rejection\\&quot;)\\nelse:\\n    raise RuntimeError(\\&quot;Missing rejection\\&quot;)&quot;,&quot;explanation&quot;:&quot;The else branch would fail the check if the invalid input were accepted. Merely catching an exception without an explicit no-exception failure would not prove the rejection happened.&quot;,&quot;values&quot;:&quot;Expected output:\\nExpected rejection&quot;},{&quot;line&quot;:&quot;import unittest\\n\\nclass TotalChecks(unittest.TestCase):\\n    def test_product(self):\\n        self.assertEqual(5 * 30, 150)\\n\\nresult = unittest.TestResult()\\nTotalChecks(\\&quot;test_product\\&quot;).run(result)\\nprint(result.testsRun)\\nprint(result.wasSuccessful())&quot;,&quot;explanation&quot;:&quot;The test case executes one named test and records its result without printing an environment-dependent runner banner. A real application would test its actual function rather than only this introductory arithmetic expression.&quot;,&quot;values&quot;:&quot;Expected output:\\n1\\nTrue&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"def total(days, minutes):\n    return days * minutes\n\nassert total(5, 30) == 150\nassert total(0, 30) == 0\nprint(&quot;Two checks passed&quot;)\" task=\"Write a study-total function and checks for ordinary input, zero days and a negative-duration rejection. Deliberately introduce an off-by-one error, observe which check catches it, then fix the implementation without changing the valid expectation. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Tests and Debugging\" stages=\"[{&quot;title&quot;:&quot;Check an exact return value&quot;,&quot;explanation&quot;:&quot;The second assertion tests the zero-day boundary. The message is printed only after both assertions succeed in this normal interpreter configuration.&quot;,&quot;code&quot;:&quot;def total(days, minutes):\\n    return days * minutes\\n\\nassert total(5, 30) == 150\\nassert total(0, 30) == 0\\nprint(\\&quot;Two checks passed\\&quot;)&quot;,&quot;hint&quot;:&quot;Choose expectations from the problem statement. Ensure the expected-failure check also fails when no exception is raised.&quot;,&quot;success&quot;:&quot;The expected output is Two checks passed. The second assertion tests the zero-day boundary. The message is printed only after both assertions succeed in this normal interpreter configuration.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Two checks passed&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Two checks passed\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The second assertion tests the zero-day boundary. The message is printed only after both assertions succeed in this normal interpreter configuration.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Check a required failure&quot;,&quot;explanation&quot;:&quot;The else branch would fail the check if the invalid input were accepted. Merely catching an exception without an explicit no-exception failure would not prove the rejection happened.&quot;,&quot;code&quot;:&quot;def checked_minutes(value):\\n    if value &lt; 0:\\n        raise ValueError(\\&quot;Negative duration\\&quot;)\\n    return value\\n\\ntry:\\n    checked_minutes(-1)\\nexcept ValueError:\\n    print(\\&quot;Expected rejection\\&quot;)\\nelse:\\n    raise RuntimeError(\\&quot;Missing rejection\\&quot;)&quot;,&quot;hint&quot;:&quot;Choose expectations from the problem statement. Ensure the expected-failure check also fails when no exception is raised.&quot;,&quot;success&quot;:&quot;The expected output is Expected rejection. The else branch would fail the check if the invalid input were accepted. Merely catching an exception without an explicit no-exception failure would not prove the rejection happened.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Expected rejection&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Expected rejection\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The else branch would fail the check if the invalid input were accepted. Merely catching an exception without an explicit no-exception failure would not prove the rejection happened.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Use a structured test case&quot;,&quot;explanation&quot;:&quot;The test case executes one named test and records its result without printing an environment-dependent runner banner. A real application would test its actual function rather than only this introductory arithmetic expression.&quot;,&quot;code&quot;:&quot;import unittest\\n\\nclass TotalChecks(unittest.TestCase):\\n    def test_product(self):\\n        self.assertEqual(5 * 30, 150)\\n\\nresult = unittest.TestResult()\\nTotalChecks(\\&quot;test_product\\&quot;).run(result)\\nprint(result.testsRun)\\nprint(result.wasSuccessful())&quot;,&quot;hint&quot;:&quot;Choose expectations from the problem statement. Ensure the expected-failure check also fails when no exception is raised.&quot;,&quot;success&quot;:&quot;The expected output is 1\\nTrue. The test case executes one named test and records its result without printing an environment-dependent runner banner. A real application would test its actual function rather than only this introductory arithmetic expression.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;1\\nTrue&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;1\\nTrue\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The test case executes one named test and records its result without printing an environment-dependent runner banner. A real application would test its actual function rather than only this introductory arithmetic expression.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "def total(days, minutes):\n    return days * minutes\n\nassert total(5, 30) == 150\nassert total(0, 30) == 0\nprint(\"Two checks passed\")",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\ndef total(days, minutes):\n    return days * minutes\n\nassert total(5, 30) == 150\nassert total(0, 30) == 0\nprint(\"Two checks passed\")",
        "explanation": "The second assertion tests the zero-day boundary. The message is printed only after both assertions succeed in this normal interpreter configuration.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Two checks passed"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Two checks passed\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\ndef checked_minutes(value):\n    if value < 0:\n        raise ValueError(\"Negative duration\")\n    return value\n\ntry:\n    checked_minutes(-1)\nexcept ValueError:\n    print(\"Expected rejection\")\nelse:\n    raise RuntimeError(\"Missing rejection\")",
        "explanation": "The else branch would fail the check if the invalid input were accepted. Merely catching an exception without an explicit no-exception failure would not prove the rejection happened.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Expected rejection"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Expected rejection\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\nimport unittest\n\nclass TotalChecks(unittest.TestCase):\n    def test_product(self):\n        self.assertEqual(5 * 30, 150)\n\nresult = unittest.TestResult()\nTotalChecks(\"test_product\").run(result)\nprint(result.testsRun)\nprint(result.wasSuccessful())",
        "explanation": "The test case executes one named test and records its result without printing an environment-dependent runner banner. A real application would test its actual function rather than only this introductory arithmetic expression.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "1\nTrue"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "1\nTrue\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Test normal cases, boundaries and expected failures; a passing test does not prove all possible behaviour.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Test normal cases, boundaries and expected failures; a passing test does not prove all possible behaviour."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Write a study-total function and checks for ordinary input, zero days and a negative-duration rejection. Deliberately introduce an off-by-one error, observe which check catches it, then fix the implementation without changing the valid expectation.",
      "hints": [
        "Choose expectations from the problem statement. Ensure the expected-failure check also fails when no exception is raised.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Tests and Debugging"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Tests and Debugging"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  },
  {
    "id": "authored-python-020",
    "languageId": "python",
    "slug": "revision-planner-project",
    "title": "Python Project: Build a Revision Planner",
    "summary": "Validate session records and keep pure calculations separate from report formatting.",
    "order": 20,
    "version": 1,
    "objectives": [
      "Explain and apply: Python Project: Build a Revision Planner",
      "Predict exact worked-example outputs and complete the independent practice"
    ],
    "prerequisiteIds": [],
    "content": "## Understand the idea\n\nThis project combines the core tools into a small revision planner without introducing a paid service or a web framework. Its input is a bounded list of session records; its output is a readable summary of planned and completed minutes. Keep collection processing separate from display so that calculations can be tested independently.\n\nEach record needs a subject, nonnegative integer minutes and a completed boolean. Define those requirements before writing the loop. Reject bad records explicitly instead of silently converting them into zero-minute sessions. A bool is a subclass of int in Python, so type(value) is int is a useful exact-type check when True must not count as one minute. This detail illustrates why validation rules should express the domain precisely.\n\nStart with hard-coded sample data and pure functions. Add JSON import/export only after the calculations and validation pass checks. In browser practice, this means parsing and printing JSON text, not promising durable file storage. A graphical interface, database and network synchronisation are separate future projects. A clear, well-tested console tool is a complete result for this scope.\n\nWork in small checkpoints: validate one record, total two records, calculate completed minutes, then format the report. Verify empty input, all incomplete sessions, all complete sessions and one invalid duration. Keep the first project small enough that you can explain every line without relying on unexplained libraries.\n\n## Example 1: Total the planned minutes\n\n```python\nsessions = [\n    {\"subject\": \"Python\", \"minutes\": 30, \"done\": True},\n    {\"subject\": \"HTML\", \"minutes\": 20, \"done\": False},\n]\nplanned = sum(session[\"minutes\"] for session in sessions)\nprint(planned)\n```\n\nExpected output:\n\n```text\n50\n```\n\nThe generator expression supplies each duration to sum. The result is planned time, not completed time: completion status has not been used as a filter.\n\n## Example 2: Count completed minutes\n\n```python\nsessions = [\n    {\"minutes\": 30, \"done\": True},\n    {\"minutes\": 20, \"done\": False},\n]\ncompleted = sum(session[\"minutes\"] for session in sessions if session[\"done\"])\nprint(completed)\n```\n\nExpected output:\n\n```text\n30\n```\n\nThe condition includes only completed sessions. This is a minutes total, not merely the number of completed records. Keep those measures separate in the final report.\n\n## Example 3: Validate and report through a function\n\n```python\ndef report(sessions):\n    for session in sessions:\n        value = session[\"minutes\"]\n        if type(value) is not int or value < 0:\n            raise ValueError(\"Invalid duration\")\n    planned = sum(item[\"minutes\"] for item in sessions)\n    return \"Planned minutes: \" + str(planned)\n\nprint(report([{\"minutes\": 30}, {\"minutes\": 20}]))\nprint(report([]))\n```\n\nExpected output:\n\n```text\nPlanned minutes: 50\nPlanned minutes: 0\n```\n\nThis small checkpoint validates duration values and formats a total. The complete assignment additionally validates subject and done fields. The empty list produces a meaningful zero total rather than an invented session.\n\n## Check the reasoning\n\nValidate session records and keep pure calculations separate from report formatting.\n\nA matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.\n\n## Independent practice\n\nBuild a revision planner with validate_session, planned_minutes, completed_minutes and format_report functions. Validate nonempty subject strings, exact nonnegative integer minutes and boolean done fields. Demonstrate empty input, mixed completion states and invalid records. Add JSON text import/export and at least six checks. Do not require a network, real file persistence, a database or third-party packages.\n\n### Practice hint\n\nBuild and test the pure calculations first. Validate required keys before lookup, and keep JSON parsing separate from record validation.\n\n<PredictOutput title=\"Predict: Total the planned minutes\" code=\"sessions = [\n    {&quot;subject&quot;: &quot;Python&quot;, &quot;minutes&quot;: 30, &quot;done&quot;: True},\n    {&quot;subject&quot;: &quot;HTML&quot;, &quot;minutes&quot;: 20, &quot;done&quot;: False},\n]\nplanned = sum(session[&quot;minutes&quot;] for session in sessions)\nprint(planned)\" options=\"[&quot;50&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;50\\nNone&quot;]\" answer=\"0\" explanation=\"The generator expression supplies each duration to sum. The result is planned time, not completed time: completion status has not been used as a filter.\" />\n\n<CodeTrace title=\"Compare the worked programs\" steps=\"[{&quot;line&quot;:&quot;sessions = [\\n    {\\&quot;subject\\&quot;: \\&quot;Python\\&quot;, \\&quot;minutes\\&quot;: 30, \\&quot;done\\&quot;: True},\\n    {\\&quot;subject\\&quot;: \\&quot;HTML\\&quot;, \\&quot;minutes\\&quot;: 20, \\&quot;done\\&quot;: False},\\n]\\nplanned = sum(session[\\&quot;minutes\\&quot;] for session in sessions)\\nprint(planned)&quot;,&quot;explanation&quot;:&quot;The generator expression supplies each duration to sum. The result is planned time, not completed time: completion status has not been used as a filter.&quot;,&quot;values&quot;:&quot;Expected output:\\n50&quot;},{&quot;line&quot;:&quot;sessions = [\\n    {\\&quot;minutes\\&quot;: 30, \\&quot;done\\&quot;: True},\\n    {\\&quot;minutes\\&quot;: 20, \\&quot;done\\&quot;: False},\\n]\\ncompleted = sum(session[\\&quot;minutes\\&quot;] for session in sessions if session[\\&quot;done\\&quot;])\\nprint(completed)&quot;,&quot;explanation&quot;:&quot;The condition includes only completed sessions. This is a minutes total, not merely the number of completed records. Keep those measures separate in the final report.&quot;,&quot;values&quot;:&quot;Expected output:\\n30&quot;},{&quot;line&quot;:&quot;def report(sessions):\\n    for session in sessions:\\n        value = session[\\&quot;minutes\\&quot;]\\n        if type(value) is not int or value &lt; 0:\\n            raise ValueError(\\&quot;Invalid duration\\&quot;)\\n    planned = sum(item[\\&quot;minutes\\&quot;] for item in sessions)\\n    return \\&quot;Planned minutes: \\&quot; + str(planned)\\n\\nprint(report([{\\&quot;minutes\\&quot;: 30}, {\\&quot;minutes\\&quot;: 20}]))\\nprint(report([]))&quot;,&quot;explanation&quot;:&quot;This small checkpoint validates duration values and formats a total. The complete assignment additionally validates subject and done fields. The empty list produces a meaningful zero total rather than an invented session.&quot;,&quot;values&quot;:&quot;Expected output:\\nPlanned minutes: 50\\nPlanned minutes: 0&quot;}]\" />\n\n<TryExample title=\"Experiment with the first program\" code=\"sessions = [\n    {&quot;subject&quot;: &quot;Python&quot;, &quot;minutes&quot;: 30, &quot;done&quot;: True},\n    {&quot;subject&quot;: &quot;HTML&quot;, &quot;minutes&quot;: 20, &quot;done&quot;: False},\n]\nplanned = sum(session[&quot;minutes&quot;] for session in sessions)\nprint(planned)\" task=\"Build a revision planner with validate_session, planned_minutes, completed_minutes and format_report functions. Validate nonempty subject strings, exact nonnegative integer minutes and boolean done fields. Demonstrate empty input, mixed completion states and invalid records. Add JSON text import/export and at least six checks. Do not require a network, real file persistence, a database or third-party packages. Start by changing one input in this smaller example. Loading it does not execute it.\" />\n\n<Understand title=\"Understand: Python Project: Build a Revision Planner\" stages=\"[{&quot;title&quot;:&quot;Total the planned minutes&quot;,&quot;explanation&quot;:&quot;The generator expression supplies each duration to sum. The result is planned time, not completed time: completion status has not been used as a filter.&quot;,&quot;code&quot;:&quot;sessions = [\\n    {\\&quot;subject\\&quot;: \\&quot;Python\\&quot;, \\&quot;minutes\\&quot;: 30, \\&quot;done\\&quot;: True},\\n    {\\&quot;subject\\&quot;: \\&quot;HTML\\&quot;, \\&quot;minutes\\&quot;: 20, \\&quot;done\\&quot;: False},\\n]\\nplanned = sum(session[\\&quot;minutes\\&quot;] for session in sessions)\\nprint(planned)&quot;,&quot;hint&quot;:&quot;Build and test the pure calculations first. Validate required keys before lookup, and keep JSON parsing separate from record validation.&quot;,&quot;success&quot;:&quot;The expected output is 50. The generator expression supplies each duration to sum. The result is planned time, not completed time: completion status has not been used as a filter.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;50&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;50\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The generator expression supplies each duration to sum. The result is planned time, not completed time: completion status has not been used as a filter.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Count completed minutes&quot;,&quot;explanation&quot;:&quot;The condition includes only completed sessions. This is a minutes total, not merely the number of completed records. Keep those measures separate in the final report.&quot;,&quot;code&quot;:&quot;sessions = [\\n    {\\&quot;minutes\\&quot;: 30, \\&quot;done\\&quot;: True},\\n    {\\&quot;minutes\\&quot;: 20, \\&quot;done\\&quot;: False},\\n]\\ncompleted = sum(session[\\&quot;minutes\\&quot;] for session in sessions if session[\\&quot;done\\&quot;])\\nprint(completed)&quot;,&quot;hint&quot;:&quot;Build and test the pure calculations first. Validate required keys before lookup, and keep JSON parsing separate from record validation.&quot;,&quot;success&quot;:&quot;The expected output is 30. The condition includes only completed sessions. This is a minutes total, not merely the number of completed records. Keep those measures separate in the final report.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;30&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;30\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;The condition includes only completed sessions. This is a minutes total, not merely the number of completed records. Keep those measures separate in the final report.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]},{&quot;title&quot;:&quot;Validate and report through a function&quot;,&quot;explanation&quot;:&quot;This small checkpoint validates duration values and formats a total. The complete assignment additionally validates subject and done fields. The empty list produces a meaningful zero total rather than an invented session.&quot;,&quot;code&quot;:&quot;def report(sessions):\\n    for session in sessions:\\n        value = session[\\&quot;minutes\\&quot;]\\n        if type(value) is not int or value &lt; 0:\\n            raise ValueError(\\&quot;Invalid duration\\&quot;)\\n    planned = sum(item[\\&quot;minutes\\&quot;] for item in sessions)\\n    return \\&quot;Planned minutes: \\&quot; + str(planned)\\n\\nprint(report([{\\&quot;minutes\\&quot;: 30}, {\\&quot;minutes\\&quot;: 20}]))\\nprint(report([]))&quot;,&quot;hint&quot;:&quot;Build and test the pure calculations first. Validate required keys before lookup, and keep JSON parsing separate from record validation.&quot;,&quot;success&quot;:&quot;The expected output is Planned minutes: 50\\nPlanned minutes: 0. This small checkpoint validates duration values and formats a total. The complete assignment additionally validates subject and done fields. The empty list produces a meaningful zero total rather than an invented session.&quot;,&quot;slots&quot;:[{&quot;label&quot;:&quot;Exact printed output&quot;,&quot;options&quot;:[&quot;Planned minutes: 50\\nPlanned minutes: 0&quot;,&quot;No output is printed.&quot;,&quot;An exception stops the program.&quot;,&quot;Planned minutes: 50\\nPlanned minutes: 0\\nNone&quot;],&quot;answer&quot;:0},{&quot;label&quot;:&quot;Reasoning check&quot;,&quot;options&quot;:[&quot;This run proves every possible input is valid.&quot;,&quot;This small checkpoint validates duration values and formats a total. The complete assignment additionally validates subject and done fields. The empty list produces a meaningful zero total rather than an invented session.&quot;,&quot;The program prints source code without executing its instructions.&quot;],&quot;answer&quot;:1}]}]\" />\n",
    "starterCode": "sessions = [\n    {\"subject\": \"Python\", \"minutes\": 30, \"done\": True},\n    {\"subject\": \"HTML\", \"minutes\": 20, \"done\": False},\n]\nplanned = sum(session[\"minutes\"] for session in sessions)\nprint(planned)",
    "videoIds": [],
    "questions": [
      {
        "id": "q1",
        "question": "What is the exact printed output?\n\nsessions = [\n    {\"subject\": \"Python\", \"minutes\": 30, \"done\": True},\n    {\"subject\": \"HTML\", \"minutes\": 20, \"done\": False},\n]\nplanned = sum(session[\"minutes\"] for session in sessions)\nprint(planned)",
        "explanation": "The generator expression supplies each duration to sum. The result is planned time, not completed time: completion status has not been used as a filter.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "50"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "50\nNone"
          }
        ]
      },
      {
        "id": "q2",
        "question": "What is the exact printed output?\n\nsessions = [\n    {\"minutes\": 30, \"done\": True},\n    {\"minutes\": 20, \"done\": False},\n]\ncompleted = sum(session[\"minutes\"] for session in sessions if session[\"done\"])\nprint(completed)",
        "explanation": "The condition includes only completed sessions. This is a minutes total, not merely the number of completed records. Keep those measures separate in the final report.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "30"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "30\nNone"
          }
        ]
      },
      {
        "id": "q3",
        "question": "What is the exact printed output?\n\ndef report(sessions):\n    for session in sessions:\n        value = session[\"minutes\"]\n        if type(value) is not int or value < 0:\n            raise ValueError(\"Invalid duration\")\n    planned = sum(item[\"minutes\"] for item in sessions)\n    return \"Planned minutes: \" + str(planned)\n\nprint(report([{\"minutes\": 30}, {\"minutes\": 20}]))\nprint(report([]))",
        "explanation": "This small checkpoint validates duration values and formats a total. The complete assignment additionally validates subject and done fields. The empty list produces a meaningful zero total rather than an invented session.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Planned minutes: 50\nPlanned minutes: 0"
          },
          {
            "id": "o1",
            "text": "No output is printed."
          },
          {
            "id": "o2",
            "text": "An exception stops the program."
          },
          {
            "id": "o3",
            "text": "Planned minutes: 50\nPlanned minutes: 0\nNone"
          }
        ]
      },
      {
        "id": "q4",
        "question": "Which statement correctly describes this lesson's main rule?",
        "explanation": "Validate session records and keep pure calculations separate from report formatting.",
        "correctOptionId": "o0",
        "options": [
          {
            "id": "o0",
            "text": "Validate session records and keep pure calculations separate from report formatting."
          },
          {
            "id": "o1",
            "text": "Printing a value always changes the original input."
          },
          {
            "id": "o2",
            "text": "Every Python operation changes every earlier calculated result."
          },
          {
            "id": "o3",
            "text": "A successful run proves that all possible inputs are valid."
          }
        ]
      }
    ],
    "questionsPerAttempt": 3,
    "assignment": {
      "instructions": "Build a revision planner with validate_session, planned_minutes, completed_minutes and format_report functions. Validate nonempty subject strings, exact nonnegative integer minutes and boolean done fields. Demonstrate empty input, mixed completion states and invalid records. Add JSON text import/export and at least six checks. Do not require a network, real file persistence, a database or third-party packages.",
      "hints": [
        "Build and test the pure calculations first. Validate required keys before lookup, and keep JSON parsing separate from record validation.",
        "Use only the concepts introduced in this and earlier Python lessons. Explain each decision."
      ],
      "requiredConcepts": [
        "Python Project: Build a Revision Planner"
      ],
      "allowedConcepts": [
        "Earlier Python core concepts",
        "Python Project: Build a Revision Planner"
      ],
      "prohibitedConcepts": [],
      "starterCode": "# Build the independent practice solution here.\n",
      "rubric": [
        {
          "id": "behaviour",
          "description": "Meet the stated task and produce the required behaviour.",
          "points": 40
        },
        {
          "id": "reasoning",
          "description": "Explain the taught concept and predict changes rather than copying output.",
          "points": 35
        },
        {
          "id": "checks",
          "description": "Use readable names and demonstrate normal and boundary checks.",
          "points": 25
        }
      ]
    },
    "state": "published"
  }
];
