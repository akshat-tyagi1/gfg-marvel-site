# DESIGN.md — Protocol: Doom (GFG Student Chapter, Bennett University)

This is the full design specification for the event landing page. Read this
alongside AGENTS.md (build rules) and CONTEXT.md (event facts) before
building any section. Do not deviate from the color, type, or motion system
below without asking — consistency across sections is the point.

---

## 1. Design Philosophy

The site is not "Marvel-themed decoration" — it is Doctor Doom's actual
visual language applied with discipline: a Latverian royal-decree aesthetic
fused with engraved-metal texture. Every section should feel like a
continuation of the same object (a sealed dossier / decree from Doom), not
six independently-designed blocks stitched together.

Avoid, deliberately: neon glow-everywhere, glassmorphism, centered-symmetry
default layouts, podium gold/silver/bronze coloring, generic fade-up-on-
scroll as the only motion, floating particle effects, and rounded-pill
buttons with a drop shadow. These are the default outputs of "cinematic
hero" prompts and will read as generic to anyone who has seen more than one
AI-generated site today.

---

## 2. Color System

| Token | Hex | Use |
|---|---|---|
| `bg-base` | `#0A100D` | Page background — near-black with green undertone |
| `surface` | `#122019` | Card/panel backgrounds, deep emerald-black |
| `accent-emerald` | `#2C6E52` | Primary accent — desaturated, not vivid |
| `accent-gunmetal` | `#4A4F4E` | Borders, dividers, secondary UI, collapsed states |
| `accent-brass` | `#B08D57` | Highlight accent ONLY — CTA, sigil edges, hover/active states. Never a base fill color. |
| `text-primary` | `#EDE6DA` | Warm off-white body/heading text — never pure white |
| `text-secondary` | `#8FA69A` | Muted sage-gray — captions, metadata, labels |

Rule: brass (`accent-brass`) is a scarce resource. If more than ~10% of any
section's visible area is brass, pull it back — it should read as a detail
you notice, not a dominant color.

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display headline | **Cinzel Decorative** (Google Fonts) | Hero headline, CTA headline only — it's ornamental, use sparingly |
| Section titles / subheadings | **Cinzel** (Google Fonts) | Regular weight of same family, used everywhere else a "title" appears |
| Body text | **Inter** or **Work Sans** (Google Fonts) | All paragraph/description text — must stay clean against the ornamental headings |
| Metadata / labels / numbers | **JetBrains Mono** (Google Fonts) | Countdown, decree line-item labels, prize amounts, footer copyright, timeline times |

Small-caps + letter-spacing (~0.05em) on all monospace labels to reinforce
the "stamped document" feel.

## 4. Spacing & Layout Scale

- Desktop section vertical padding: ~120px top/bottom
- Tablet: ~90px
- Mobile: ~60px (do not simply shrink font sizes and keep desktop spacing —
  mobile needs proportionally tighter spacing or it feels like a zoomed-out
  desktop page)
- Base root font-size: 16px desktop/tablet, 14–15px mobile (scale via root,
  not per-element)
- Minimum touch target size: 44px × 44px for any interactive element on
  mobile (buttons, accordion headers, links)

## 5. Motion Principles (apply across all sections)

- Every section should have a **distinct** entrance motion — no copy-pasting
  the same fade-up everywhere. Motion is part of how each section's
  personality reads.
- General easing: ease-out-expo for reveals, nothing linear.
- Hover-only interactions (brass pulse, crack effects) MUST have a touch/tap
  equivalent for mobile — never let an interaction silently do nothing on
  touch devices.
- Respect `prefers-reduced-motion` — fall back to simple opacity fades, no
  clip-path/transform choreography, for users who request it.

---

## 6. Section Specifications

### 6.1 Hero

**Layout**
- Desktop: asymmetric split — headline + metadata in left third, large-scale
  Doom sigil/mask (etched line-art style, NOT a glowing 3D render) occupying
  right two-thirds
- Tablet: same split, sigil scales down, headline drops one font-size step
- Mobile: stacks vertically — sigil above, smaller, centered; headline
  becomes centered too (asymmetry doesn't work in a single narrow column)

**Content**
- Event name + "Edition I" tag
- Headline: something like "The Trial Begins" or equivalent, in Cinzel
  Decorative
- Tagline line in body font
- Countdown to October 24, 2026, styled as a stamped/bordered document box
  (NOT a glassmorphic digital clock) — numbers in JetBrains Mono
- GFG BU logo credited small, header or corner placement

**Motion**
- Headline reveals via clip-path wipe, staggered word-by-word (~600ms/word,
  ease-out-expo) — like a decree unsealing
- Sigil's eye-slits have a slow glow pulse (3–4s cycle) — slow reads as
  ominous, fast reads as a notification badge, avoid fast pulsing
- Subtle grain/noise overlay across the whole hero background (CSS-generated,
  not a photo) for texture depth

**Interaction**
- Cursor-reactive: sigil's eyes subtly track cursor within a small radius
  (a few degrees of rotation, not full tracking) — desktop/tablet only,
  disable entirely on touch devices (no cursor = don't ship the JS)

---

### 6.2 Event Info — "Doom's Decree"

**Layout**
- Desktop/Tablet: two-column — left holds a smaller stamped/embossed Doom
  sigil variant + section title; right holds info as a vertical list of
  decree line-items
- Mobile: sigil shrinks, moves above the list, centered; line-items stay
  full-width single column (naturally mobile-friendly)

**Content — each row is a label (monospace, small caps, sage) + value
(Cinzel, cream):**
```
DATE OF SUMMONS        October 24–25, 2026
BATTLEGROUND            The battlefield will be revealed soon
DURATION                24 hours, non-stop
ASSEMBLY SIZE           2–4 per team
TRIBUTE REQUIRED        None — free entry
DEADLINE OF ENTRY       October 14, 2026
```
Thin brass-gold horizontal divider between each row.

**Motion**
- Rows reveal one at a time, top to bottom, ~80ms stagger, each sliding in
  from the left slightly — mimics a document being stamped/typed line by
  line. Shorten stagger timing slightly on mobile (less scroll distance to
  trigger).

**Interaction**
- Hovering (or tapping, on mobile) a row briefly flashes its label
  brass-gold — small reward for engagement, not persistent glow

---

### 6.3 Trials — "The Trials of Doom" (Tracks section)

**Layout**
- Desktop/Tablet: horizontal accordion — four vertical panels side by side.
  Collapsed panels show only the trial name rotated 90° (reading top-to-
  bottom) + small sigil icon. Clicking/hovering expands one panel while
  others compress. Only one open at a time.
- **The Sentience Trial is expanded by default on page load** — this
  previews the interaction pattern for free rather than requiring a visitor
  to discover it by chance.
- Mobile: switches to a **vertical accordion** — full-width panels stacked,
  tap to expand one at a time, others collapse. This is a genuine layout
  change, not just a resize of the desktop version.

**Content per track (expanded state):**
- Trial name in Cinzel Decorative (e.g. "The Sentience Trial")
- Domain subtitle in monospace small caps (e.g. "AI / MACHINE LEARNING")
- 1–2 line description of the track
- Thin brass rule, then "Enter this Trial" label (decorative, or optionally
  deep-linked to the CTA section)

**Tracks:**
1. The Sentience Trial — AI/ML
2. The Construct Trial — Web/App Dev
3. The Fortress Trial — Cybersecurity & Blockchain
4. The Wildcard Trial — Open Innovation

**Visual states**
- Collapsed: dark gunmetal panel, sigil icon faint emerald glow
- Expanded: background shifts to emerald surface color, sigil brightens to
  brass-gold, rotated text straightens via clip-path wipe (same technique as
  hero headline — reinforces consistency)

**Motion**
- Width transition ~450ms ease-out-expo on expand/collapse
- Content fades/wipes in ~100ms after width settles (staggered, not
  simultaneous)

---

### 6.4 Prizes — "The Spoils of Doom"

**Layout**
- Top three prizes: single horizontal row, **unequal panel widths signal
  rank** (Doom Protocol widest, Latverian Grant narrower, Iron Legacy
  narrowest) — NOT gold/silver/bronze coloring or a podium height pattern
- Secondary awards (4 track winners + 2 specials): smaller, uniform flat
  tag/pill row below the top three — simple, no plaque treatment, no
  border-trace animation. This keeps visual focus on the top three.

**Content — top three panels:**
- Relic name in Cinzel Decorative
- Amount in JetBrains Mono, large
- Reward line below in small-caps sage text

```
1st — The Doom Protocol   — ₹8,000 + GFG hoodie + goodie hamper + featured on GFG chapter socials
2nd — The Latverian Grant — ₹5,000 + GFG hoodie + goodies
3rd — The Iron Legacy     — ₹3,000 + GFG T-shirt + goodies
```

**Secondary row (flat tags, monospace label + small brass icon marker):**
```
Trial Master ×4 (per track) — GFG merch kit + certificate
The Herald's Choice (Best UI/Design) — GFG merch
First Summons (Best Freshman Team) — GFG merch
```

**Motion**
- Top three panels reveal left-to-right with a **border-trace animation**
  (stroke-dasharray SVG technique, brass border draws itself in), ~800ms per
  panel, ~150ms stagger — ties to the "engraved metal" motif from the hero.
  Deliberately slower/more ceremonial than other sections.
- Secondary row: simple group fade-in on scroll, no individual choreography

**Interaction**
- Hovering (or tapping) a top-three panel triggers a single bright flash
  pulse along the traced brass border — one-time, not persistent

**Mobile**
- Top three stack vertically using decreasing max-width (~100% / 90% / 80%,
  centered) — preserves the hierarchy signal instead of flattening to
  identical-width cards
- Secondary tag row wraps naturally, no changes needed

---

### 6.5 Registration / CTA — "Sign the Pact"

**Layout**
- Centered panel (emerald surface, brass border) containing:
  - Headline in Cinzel Decorative: "The Trial Awaits. Will You Answer?"
  - A brief recap line restating dates + deadline (so visitors who scroll
    straight here don't need to scroll back up)
  - The seal-button: a circular brass emblem bearing the Doom sigil,
    slightly raised/embossed, label "Sign the Pact" curved along its inner
    edge in small-caps monospace

**Motion on scroll-in**
- Panel unrolls via clip-path reveal from vertical center outward (~700ms,
  ease-out) — like a scroll unfurling. Distinct from every other section's
  motion, marks this as the deliberate close of the page.

**Interaction (signature moment of the page)**
- Hover: faint brass-gold cracks of light appear along the seal's edges
- Click: seal presses down (scale 0.92, ~150ms), then snaps back with a
  brief flash before opening the modal
- Touch equivalent: trigger the crack effect on `:active` state for mobile

**"Coming Soon" modal (opens on click)**
- Styled consistently — emerald surface panel, brass border, NOT a default
  white/gray browser-style modal
- Headline in Cinzel: "The Pact Is Not Yet Open"
- Body line: "Registrations open closer to the event. Follow [GFG BU
  Instagram handle] for the summons."
- Small brass-gold sigil above the text, subtle fade-in only — calm, not
  another spectacle
- Close via small "×" or outside-click, styled to match, no default browser
  modal chrome

---

### 6.6 Footer

**Content**
- GFG BU logo (small, left-aligned) + "GeeksforGeeks Student Chapter,
  Bennett University"
- "Protocol: Doom — Edition I"
- Social links as monospace small-caps text labels — "INSTAGRAM" / "EMAIL"
  (no icon set — keeps one less inconsistent visual language on the page)
- One-line thematic sign-off in italic Cinzel — e.g. "Doom is watching."
- Copyright line in monospace, muted — "© 2026 GFG Student Chapter, Bennett
  University"

**Layout**
- Desktop: three-column flex (org block — social links — flavor line +
  copyright)
- Mobile: stacks to centered blocks

**Motion**
- None, or at most a simple fade-in on scroll — no choreographed reveal.
  Footers aren't lingered on; don't over-invest design effort here.

---

## 7. Responsive Breakpoints (global)

| Tier | Range |
|---|---|
| Mobile | < 640px |
| Tablet | 640px – 1024px |
| Desktop | > 1024px |

Test at 375px width minimum as the baseline smallest-phone case — if a
section holds up there, it holds up everywhere above it.

General rules:
- Scale spacing and font-size via root-level tokens, not per-element overrides
- Any section with a fundamentally different interaction shape at mobile
  (Trials accordion: horizontal → vertical) is a deliberate layout change,
  not a shrink — build it as such
- Every hover-only interaction needs a working tap/`:active` equivalent

---

## 8. Build Order (for Antigravity prompts)

Build and verify one section at a time, in this order, checking the
rendered screenshot before moving to the next:

1. Hero
2. Event Info
3. Trials
4. Prizes
5. Registration/CTA + modal
6. Footer
7. Full-page responsive pass across all sections at 375px, 768px, 1440px