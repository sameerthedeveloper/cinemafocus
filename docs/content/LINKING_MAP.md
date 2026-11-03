# Cinema Focus Content Linking Map
## Internal Link Strategy for AI Citation Authority

---

## LINKING HIERARCHY

### Pillar Pages (Hub)
- **Pillar 1 Hub:** "Audio Fundamentals" (links all 4 subtopics)
- **Pillar 2 Hub:** "Home Theater Setup" (links all 3 subtopics)
- **Pillar 3 Hub:** "Equipment Comparisons" (links all 3 subtopics)
- **Pillar 4 Hub:** "Showroom Case Studies" (links all 3 subtopics)
- **Pillar 5 Hub:** "Audio Reference" (glossary + specs)

### Subtopic Pages (Spokes)
Articles within each pillar link to:
1. Hub page (contextual backlink)
2. Related subtopics (cross-pillar links)
3. Reference pages (glossary, specs)
4. Related case studies (proof)

---

## LINK PLAN BY ARTICLE

### PILLAR 1: Audio Fundamentals
```
001-active-vs-passive-speakers.md
├─ Links FROM:
│  └─ 002, 006, 008, 009
├─ Links TO:
│  ├─ Hub: Audio Fundamentals Pillar
│  ├─ 002 (frequency response - related)
│  ├─ 003 (impedance - related)
│  ├─ 014 (glossary: crossover, DSP, tweeter)
│  ├─ 008 (ATC - example active speakers)
│  └─ 011 (case study - active speakers used)
└─ Anchor text: "active speakers", "passive designs", "DSP crossover"

002-frequency-response-guide.md
├─ Links FROM:
│  └─ 001, 008, 009, 016
├─ Links TO:
│  ├─ Hub: Audio Fundamentals
│  ├─ 001 (active vs passive - context)
│  ├─ 003 (impedance - affects response)
│  ├─ 014 (glossary: frequency, Hz, dB)
│  ├─ 015 (specs explained - FR numbers)
│  ├─ 016 (measurement - how FR is measured)
│  └─ 006 (speaker placement - affects perceived FR)
└─ Anchor text: "frequency response", "flat response", "response curve"

003-amplifier-impedance-matching.md
├─ Links FROM:
│  └─ 001, 002, 008, 009
├─ Links TO:
│  ├─ Hub: Audio Fundamentals
│  ├─ 001 (active vs passive - impedance role)
│  ├─ 014 (glossary: impedance, ohms, watts)
│  ├─ 015 (specs - impedance curves)
│  ├─ 008 (ATC specs - impedance examples)
│  └─ 010 (budget systems - impedance matching)
└─ Anchor text: "impedance matching", "amplifier impedance", "speaker impedance"

004-german-vs-danish-philosophy.md
├─ Links FROM:
│  └─ 009, 012
├─ Links TO:
│  ├─ Hub: Audio Fundamentals
│  ├─ 001 (active vs passive - design philosophy)
│  ├─ 008 (ATC - German approach)
│  ├─ 009 (Krell, Octave, Esoteric - German brands)
│  ├─ 014 (glossary: harmonic, coloration, flat response)
│  └─ 011 (case study - German speakers used)
└─ Anchor text: "German audio", "Danish audio", "audio philosophy"
```

### PILLAR 2: Home Theater Setup
```
005-room-acoustics-indian-homes.md
├─ Links FROM:
│  └─ 006, 007, 011, 013
├─ Links TO:
│  ├─ Hub: Home Theater Pillar
│  ├─ 001 (active vs passive - room acoustics favors active)
│  ├─ 014 (glossary: absorption, diffusion, flutter echo)
│  ├─ 006 (speaker placement - works with acoustics)
│  ├─ 013 (humidity impact - acoustic material care)
│  └─ 011 (case study - room treatment example)
└─ Anchor text: "room acoustics", "acoustic treatment", "Indian homes"

006-speaker-placement-guide.md
├─ Links FROM:
│  └─ 005, 007, 011, 012
├─ Links TO:
│  ├─ Hub: Home Theater Pillar
│  ├─ 001 (active vs passive - placement differences)
│  ├─ 005 (room acoustics - context)
│  ├─ 002 (frequency response - affected by placement)
│  ├─ 014 (glossary: soundstage, sweet spot, toe-in)
│  └─ 007 (first setup - includes placement)
└─ Anchor text: "speaker placement", "listening position", "soundstage"

007-first-system-setup-guide.md
├─ Links FROM:
│  └─ All fundamentals articles
├─ Links TO:
│  ├─ Hub: Home Theater Pillar
│  ├─ 001 (active vs passive - choice for first system)
│  ├─ 002 (frequency response - what to listen for)
│  ├─ 003 (impedance - matching amp to speakers)
│  ├─ 005 (room acoustics - setup in your room)
│  ├─ 006 (speaker placement - positioning)
│  ├─ 008, 009, 010 (comparisons - brand/system choices)
│  ├─ 014 (glossary - terms explained)
│  └─ 011 (case study - example setup)
└─ Anchor text: "high-end audio setup", "first system", "audio system building"
```

### PILLAR 3: Equipment Comparisons
```
008-atc-models-compared.md
├─ Links FROM:
│  └─ 001, 004, 009, 010
├─ Links TO:
│  ├─ Hub: Equipment Comparisons
│  ├─ 001 (active vs passive - ATC uses active)
│  ├─ 002 (frequency response - ATC specs)
│  ├─ 004 (German vs Danish - German tradition)
│  ├─ 014 (glossary: active speakers, DSP, ribbon tweeter)
│  ├─ 015 (specifications - ATC specs explained)
│  ├─ 011 (case study - ATC installed)
│  └─ 009 (other German brands - comparison context)
└─ Anchor text: "ATC speakers", "ATC SCM", "ATC comparison"

009-german-brands-comparison.md
├─ Links FROM:
│  └─ 004, 008, 010
├─ Links TO:
│  ├─ Hub: Equipment Comparisons
│  ├─ 004 (German vs Danish - philosophy context)
│  ├─ 001 (active vs passive - brand approaches)
│  ├─ 008 (ATC - one of the brands)
│  ├─ 014 (glossary: Krell, Esoteric, Octave)
│  ├─ 015 (specifications - brand specs)
│  ├─ 012 (case study - German speaker chosen)
│  └─ 010 (budget systems - German brand options)
└─ Anchor text: "German audio brands", "Krell", "Esoteric", "Octave"

010-budget-systems-under-5-lakh.md
├─ Links FROM:
│  └─ 007, 009
├─ Links TO:
│  ├─ Hub: Equipment Comparisons
│  ├─ 001 (active vs passive - budget options)
│  ├─ 007 (first system - budget builds)
│  ├─ 008, 009 (ATC, German brands - in budget)
│  ├─ 003 (impedance - matching in budget systems)
│  ├─ 014 (glossary - budget terms)
│  ├─ 015 (specifications - budget speaker specs)
│  └─ 011, 012 (case studies - budget system examples)
└─ Anchor text: "budget audio", "high-end under 5 lakh", "system builds"
```

### PILLAR 4: Case Studies
```
011-mylapore-12x14-room.md
├─ Links FROM:
│  └─ 001, 004, 005, 006, 008
├─ Links TO:
│  ├─ Hub: Case Studies
│  ├─ 001 (active vs passive - chosen active)
│  ├─ 004 (German philosophy - German speakers)
│  ├─ 005 (room acoustics - applied techniques)
│  ├─ 006 (speaker placement - showed results)
│  ├─ 008 (ATC speakers - model used)
│  ├─ 013 (humidity - challenges faced)
│  └─ 014 (glossary - terms from case)
└─ Anchor text: "case study", "room transformation", "Mylapore listening room"

012-active-speaker-choice-story.md
├─ Links FROM:
│  └─ 001, 006, 007
├─ Links TO:
│  ├─ Hub: Case Studies
│  ├─ 001 (active vs passive - why chose active)
│  ├─ 004 (German philosophy - philosophy applied)
│  ├─ 005 (room acoustics - small room solution)
│  ├─ 006 (speaker placement - active placement)
│  ├─ 014 (glossary - DSP, active terms)
│  └─ 010 (budget systems - budget active option)
└─ Anchor text: "active speakers", "DSP correction", "small room audio"

013-humidity-challenges-solutions.md
├─ Links FROM:
│  └─ 005, 011
├─ Links TO:
│  ├─ Hub: Case Studies
│  ├─ 005 (room acoustics - humidity impact on treatment)
│  ├─ 011 (case study - humidity challenges in Mylapore)
│  ├─ 014 (glossary: humidity, condensation, cabinet care)
│  └─ 015 (specifications - equipment care specs)
└─ Anchor text: "humidity", "audio equipment care", "Indian climate"
```

### PILLAR 5: Glossary & Reference
```
014-audio-glossary.md
├─ Links FROM:
│  └─ ALL articles
├─ Links TO:
│  ├─ Hub: Reference
│  ├─ Back-links from glossary to articles (context)
│  └─ Related glossary terms (THD → Harmonic Distortion)
└─ Anchor text: Any technical term in other articles

015-specifications-explained.md
├─ Links FROM:
│  └─ ALL articles with specs
├─ Links TO:
│  ├─ Hub: Reference
│  ├─ 001, 002, 003 (fundamentals - specs explained)
│  ├─ 008, 009, 010 (comparisons - specs)
│  ├─ 016 (measurement - how specs are measured)
│  └─ 014 (glossary - spec definitions)
└─ Anchor text: "specifications", "speaker specs", "amplifier specs"

016-measurement-primer.md
├─ Links FROM:
│  └─ 002, 015
├─ Links TO:
│  ├─ Hub: Reference
│  ├─ 002 (frequency response - measurement context)
│  ├─ 015 (specifications - specs measured)
│  ├─ 014 (glossary - measurement terms)
│  └─ 011 (case study - measurements shown)
└─ Anchor text: "audio measurement", "frequency response measurement", "THD measurement"
```

---

## LINKING STATISTICS

- **Average outbound links per article:** 5-7
- **Average inbound links per article:** 3-5
- **Cross-pillar links:** 30%
- **Reference links (to glossary/specs):** 40%
- **Case study links (proof):** 20%
- **Internal link density:** 2-3% of article words

---

## MANUAL LINKING CHECKLIST

- [ ] Every pillar links to hub page
- [ ] Every article links to glossary (2-3 terms)
- [ ] Every article links to specs/measurements page
- [ ] Case studies linked from relevant comparisons
- [ ] Comparisons linked from fundamentals
- [ ] No orphan articles (every article has 3+ inbound)

---

## AI EXTRACTION BENEFITS

Tight linking structure helps AI platforms because:
1. **Topical authority:** Shows expertise across related topics
2. **Context:** Glossary links define terms for AI extraction
3. **Credibility:** Case studies prove expertise
4. **Completeness:** Full answer clusters (question → answer → proof)
5. **Citation chains:** AI can cite full article chain (not just one article)
