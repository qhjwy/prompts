# Lecture slides
## Layout
```
Analyze the attached lecture slides. Write brief storytelling notes that make the connections between topics clear. Do not list slides one by one.
Group slides that belong to the same topic. For each group, label it as one of:
- Essential core concept
- Example / Case
- Context / Background
- Admin / Logistics
Identify section divider slides.
For each Essential core concept, add a one-sentence “Why this matters” explanation.
Show the conceptual flow: what problem or question each part addresses, and how it leads into the next part. Keep it concise but explanatory, like a guided narrative — start with the big picture, then narrow into the core models, then show extensions and practical implications.
At the end, state which parts are essential for exam prep and which are just context.
Use headings, short paragraphs, and tables where helpful. The goal is for the reader to understand how the topics fit together as a coherent story, not just a map of slide numbers.
```
## Storytelling markdown notes [star]
```
PROMPT
---
You are an expert teaching assistant in logistics and supply chain management.
I will attach a lecture file: [LECTURE FILE].

Your job is to turn it into STUDY NOTES that read like a guided story, not a slide dump.
Output must be a SINGLE markdown document, delivered inside one ```markdown code block
so I can save it directly as a .md file.

────────────────────────────────────────
## 1. OPENING: THE STORY SPINE
────────────────────────────────────────
Start with a section titled "The big picture" (one short paragraph, no bullets).
State the central question or trade-off the whole lecture is about, why it matters,
and name the two or three inputs everything else depends on.
Then add one bolded sentence labeled "Conceptual flow:" that traces the lecture
as a chain: A → B → C → D. This must be a logical chain, not a slide list.

────────────────────────────────────────
## 2. GROUPED TOPICS TABLE
────────────────────────────────────────
Do NOT go slide by slide. Cluster slides that serve the same idea into one topic group.
Present a table with columns: Topic group | Slides | Label | Role / Why this matters.

Label every group with exactly one of:
- Essential core concept
- Example / Case
- Context / Background
- Admin / Logistics

Rules:
- Model/formula/definition groups are "Essential core concept".
- Numerical or company illustrations are "Example / Case" (keep them separate rows
  from the theory they illustrate).
- Taxonomy, history, motivation, model-positioning material is "Context / Background".
- Title pages, grading, deadlines are "Admin / Logistics" (say "none" if there are none).
- For every "Essential core concept" row, the Role column must include a one-sentence
  italicized "Why this matters:" explanation of the practical consequence.
- Use exact slide numbers/ranges in the Slides column.

────────────────────────────────────────
## 3. SECTION DIVIDER SLIDES
────────────────────────────────────────
Add a short bulleted list titled "Section divider slides" identifying slides that act
as topic pivots or section headers (not every slide — only true dividers).
If there are none, say so explicitly.

────────────────────────────────────────
## 4. THE NARRATIVE BODY (most important part)
────────────────────────────────────────
Write one `###` subsection per topic group, in CONCEPTUAL order (which is usually but not
always slide order). Each section is 2–6 short paragraphs.

Mandatory style rules:

(a) PROSE, NOT BULLETS. The body is explanatory paragraphs. Use bullets only for
    genuine lists (e.g., two competing definitions, a set of levers).

(b) EVERY FORMULA IS INTRODUCED BY STORY. Never drop a formula cold.
    Before each formula, write the question it answers or the reason we need it,
    in plain language. Then display the formula in LaTeX block form.
    After it, say what the symbols mean and what the result tells you.
    Bad: "ss = F^-1(CSL) σ_L"
    Good: "If we want a target CSL, we invert the probability statement: we ask what
    reorder point makes the probability of not stocking out equal CSL. That gives
    [formula]. The first factor converts a service target into a number of standard
    deviations; the second converts that into units."

(c) REPRODUCE THE LECTURE'S WORKED EXAMPLES AS CALCULATIONS.
    If the lecture solves a numerical example, walk through it with the numbers
    substituted, line by line, in the same paragraph flow. Label them like:
    **Example — <company/product>:** <one sentence of setup>, then the arithmetic.

(d) EXPLAIN THE INTUITION BEHIND EACH RESULT. After a formula or example, add one
    sentence on what it means managerially (e.g., "uncertainty grows with the square
    root of time, which is why long lead times need disproportionately more stock").

(e) CONNECT SECTIONS. Each section's first or last sentence should link back to the
    previous idea and forward to the next ("Once we can measure uncertainty, we need
    a target—which brings us to CSL versus fill rate").

(f) USE LATEX for all math, with THESE delimiters only:
    - inline math: $ ... $
    - display math: $$ ... $$ (on their own lines)
    NEVER use \( \) or \[ \] — they will not render for me.
    Use \sqrt{}, subscripts, \sum, \Phi, \phi, \rho, \sigma, etc.
    Keep Excel function names (NORM.DIST, NORM.INV, NORMSINV, GOAL SEEK) in plain text.
    Inside the output's ```markdown fence, do not escape the $ signs.

(g) IGNORE corrupted or nonsensical slide content (e.g., slides containing only noise
    characters or tables of stray numbers). Do not mention them and do not let them
    break the narrative. If a key figure's data is missing, describe the result in words.

(h) BE CONCISE BUT EXPLANATORY. No filler, no restating the obvious, no "this slide
    shows...". Aim for the density of a good textbook summary: every sentence teaches.

────────────────────────────────────────
## 5 HIERARCHICAL SECTION MARKS
────────────────────────────────────────
Before writing, organize every section into named top-level groups lettered A, B, C, ...
and number the sections inside each group 1, 2, 3, ...

- Group heading: `## A. Orientation and framing` (one `##` per group, lettered, short title)
- Section heading: `### 1. The big picture` (one `###` per section, numbered, short title)
- Separate groups with `---`, not sections.
- The narrative body's topic groups from the table are `###` subsections, NOT `##` sections.
- Adapt the group letters and titles to the actual lecture content; do not copy the template verbatim.

Suggested group skeleton (rename to fit the lecture):
- `## A. Orientation and framing` → big picture, grouped topics table, section divider slides
- `## B. Motivation and model setup` → sequential vs global, newsvendor stage, event sequence
- `## C. Expected quantities and the benchmark` → loss functions, expected sales/inventory/lost sales, profit functions, first-best order
- `## D. Contract types` → wholesale price, buyback, revenue sharing
- `## E. Worked example` → Matilda's Market / Jeffrey's Bakery numerical comparison
- `## F. Synthesis` → how the parts connect
- `## G. Exam and administrative frame` → exam prep vs context, exam logistics, review questions

────────────────────────────────────────
## 6. HOW THE PARTS CONNECT
────────────────────────────────────────
As a numbered subsection under group F (e.g., `### 12. How the parts connect`), add a
numbered list titled "How the parts connect" that reduces the whole lecture to a 5–8 step
logical chain in plain sentences (no formulas).

────────────────────────────────────────
## 7. EXAM PREP VS CONTEXT
────────────────────────────────────────
As a numbered subsection under group G (e.g., `### 13. Exam prep vs context`), add the
section titled "Exam prep vs context" containing three bolded parts:

**Essential for exam prep:** a bulleted list of the specific formulas, definitions,
decision rules, and calculation types that must be memorized/practiced. Include the
formulas themselves in LaTeX, not just their names.

**Context / background only:** what is conceptually useful but unlikely to be
calculated (taxonomies, company history, long data tables, optional forecasting detail).

**Admin / Logistics:** anything procedural, or "none beyond the title slide."

────────────────────────────────────────
## 8. HARD CONSTRAINTS
────────────────────────────────────────
- Output exactly one markdown document inside one ```markdown code block. No preamble,
  no closing commentary outside the block.
- Use `#` for the title, `##` for lettered group headings (A, B, C...), `###` for
  numbered subsections, and `---` to separate groups.
- Do not enumerate slides in the body. Slide numbers appear only in the table and the
  divider list.
- Do not invent formulas, examples, or numbers not supported by the lecture. If the
  lecture states a formula loosely or with a typo, give the corrected standard form and
  note the correction in one short parenthetical.
- Preserve the lecture's own notation (D, σ_D, L, Q, ROP, ss, CSL, fr, ESC, C_o, C_u, etc.).
```