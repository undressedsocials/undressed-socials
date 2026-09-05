# The Milanote build prompt

Paste everything below the line into a Claude Code session **once Milanote access exists**
(browser control, a Milanote MCP server, or an export/import route — the prompt handles
all three). The session must have the `undressed-socials` repo attached, because the full
note text lives in `strategy/milanote/*.md` and the prompt tells the agent to read it
rather than reinvent it.

If you'd rather have the board built by hand, the same prompt works as a build brief for
a person — it is written as instructions, not as code.

---

## PROMPT — copy from here

You have access to my Milanote account. I want you to extend an **existing** board called
`moodporn undressed` into a complete content operating system for undressed.socials.

**Read this entire brief before touching the board.**

### 0 · What this is

undressed.socials is a boutique social media studio (Linda Hiller, Austria). The Milanote
board currently holds moodboard references and some early ideas. It is inspiration. I want
it to become a working operating system: the thing the team opens before writing any post.

The full content for every board has already been written and lives in the repo at
`strategy/milanote/`. **Read all twelve files there first.** They are the source of truth
for wording. Do not paraphrase them, do not "improve" the copy, and do not summarise —
the language is the brand voice and it has been calibrated against the site's CI
(`css/colors_and_type.css`, `js/data.jsx`).

- `README.md` — the file→board convention and the three decisions taken
- `00-board-map.md` … `10-first-12-posts.md` — one file per board

### 1 · The rules, in priority order

**1. Additive only. Never delete anything.**
Everything currently on that board is Linda's. You do not have permission to remove,
overwrite, or empty a single item. If something needs to move, *move* it — don't recreate
and delete. If you think something should go, put it in a column called
`⚠︎ to review — proposed for removal` and leave the decision to Linda.

**2. Audit before you build.**
First action: inventory the existing board. Report back a list of what's there —
every board, column, note, image and link, with a one-line description of each — and
**stop for my confirmation before creating anything.** I want to see your reading of the
board before you change it.

**3. Existing references get regrouped, not replaced.**
Board `07 visual world` is the destination for everything already on the moodboard. The
whole point of that board is that references are filed **by visual principle**, not left in
one pile. Six principles are defined in `07-visual-world.md`. Every existing image gets
assigned to one primary principle. If an image genuinely fits none of the six, put it in a
column called `unfiled — needs a principle` rather than forcing it.

**4. Existing ideas get absorbed into the layer system.**
Any loose post ideas, notes or fragments already on the board get sorted into
DESIRE / THINKING / MAKING and dropped into `09 content bank` as new rows, tagged the same
way as the 50 that are already written. Keep Linda's original wording for those. Mark them
`[existing]` so it's obvious which ideas predate this build.

**5. Ask, don't guess.**
If a note on the board contradicts something in the strategy files, flag it and ask.
Do not silently resolve it. There are exactly three known tensions and they're documented
in `strategy/milanote/README.md` — anything beyond those is new information and I want to
hear about it.

### 2 · The structure to build

Ten sub-boards inside `moodporn undressed`, in this order:

```
moodporn undressed
├── 01 · north star
├── 02 · content architecture
├── 03 · DESIRE
├── 04 · THINKING
├── 05 · MAKING
├── 06 · recurring series
├── 07 · visual world        ← existing references land here
├── 08 · tone of voice
├── 09 · content bank        ← existing ideas land here
└── 10 · first 12 posts
```

The mapping from the markdown files is mechanical:

| in the file | in Milanote |
| --- | --- |
| `# Heading` | the board name |
| `## Heading` | a **column** on that board |
| `### Heading` | one **note**, titled with that heading |
| body under a `###` | that note's content |
| `> quoted line` | a note set in large display type — a headline card, not body copy |
| a markdown table | one note containing the table, or a Milanote table if the account supports it |

Board `09 content bank` is the exception: its three bank columns are tables of 50 ideas.
Build each as a single note first. Then, if the Milanote API/UI allows it cheaply, split the
rows into individual notes so they can be dragged onto a monthly planning board. If that's
expensive, leave them as tables and tell me — it's a nice-to-have, not a blocker.

### 3 · Visual treatment inside Milanote

Use the brand's five colour pairs for note colours so the boards are readable at a glance.
The pairs are in `07-visual-world.md`; the hex values are in `css/colors_and_type.css`.

- board `01` and all headline/`>` cards → **blood `#87000C`**
- DESIRE (`03`) → **candy `#FBCDE0`**
- THINKING (`04`) → **sun `#F4ED57`**
- MAKING (`05`) → **teal `#1E5B62`**
- process, structure and instruction notes (`00`, `02`, `08`) → **sky `#C6DCFF`**
- `07 visual world` → leave notes uncoloured so the imagery carries

One pair per board. Never a rainbow inside one board — that's a brand rule, not a
preference (`css/colors_and_type.css`: *"Always work colour on colour. One family per
piece. Never a rainbow."*).

### 4 · Order of work

Do it in this sequence and **check in with me after each of steps 1, 2 and 4**:

1. **Audit** the existing board. Report. Stop.
2. **Create the ten empty sub-boards** with their columns only, no notes. Show me the
   skeleton. Stop.
3. **Fill boards 01, 02, 06, 08, 10** — these are pure new content, no interaction with
   existing material. Straight transcription from the files.
4. **Build board 07** — this is the delicate one. Create the six principle columns, then
   move every existing reference into the right column. Show me the assignments before
   you move anything irreversible. Stop.
5. **Fill boards 03, 04, 05** — the layer boards.
6. **Build board 09** — the content bank, then absorb Linda's existing loose ideas into it
   tagged `[existing]`.
7. **Final pass** — check every cross-reference between boards still resolves (the files
   reference each other by number a lot), and give me a short written summary of what you
   built, what you moved, and what you flagged.

### 5 · Reference material already in the repo

`assets/mood/m01.jpg` … `m12.jpg` are the twelve references currently in the website build.
`strategy/milanote/07-visual-world.md` contains a written audit of all twelve — which
principle each belongs to, what it proves, and where it gets used. If those same images
are on the Milanote board, use that audit to place them; don't re-derive it.

That file also lists four gaps in the reference library (texture macro, true still life,
type-in-the-world, night). Put those in a column on board `07` called `to shoot`.

### 6 · What done looks like

- Every one of the ten boards exists, with its columns and notes, matching the files.
- Nothing that was on the board before has been deleted. Everything has a home.
- Every existing image sits under a named visual principle.
- Every existing idea sits in the content bank, tagged and marked `[existing]`.
- Board `09` has at least 50 ideas and none of the columns is empty.
- You've given me a written list of anything you flagged, moved, or couldn't place.

### 7 · If you can't reach Milanote directly

If you have no browser control and no Milanote integration, **say so immediately** —
don't work around it silently or claim the board was updated. Then do this instead:

- Produce a single import file (Milanote accepts pasted plain text and splits it into
  separate notes on line breaks) — one file per board, formatted so that pasting it onto an
  empty board produces the right notes in one go.
- Give me the exact click sequence for each board, in order.
- Flag the parts I'll have to do by hand: column creation, note colours, and moving the
  existing references into their principle columns (that last one needs a human eye anyway).

Never tell me a board was built if you did not build it.

## PROMPT — copy to here
