# Cinema Focus AI Citation Submission Checklist
## Getting Content Indexed by Claude, ChatGPT, Perplexity, Gemini

---

## PRE-SUBMISSION CHECKLIST (Per Article)

### Content Quality
- [ ] Article is 1000+ words (AI favors depth)
- [ ] Has clear H1, H2, H3 hierarchy
- [ ] Includes data tables or comparisons
- [ ] Has byline + author expertise
- [ ] Includes publication date + update date
- [ ] Contains 3+ original insights (not generic)
- [ ] Links to authoritative sources (Krell datasheets, ATC specs)
- [ ] Defines all technical terms inline
- [ ] Includes pullquotes for extraction
- [ ] No marketing language ("best", "top rated" without proof)

### Metadata & Frontmatter
```yaml
---
title: "Clear, keyword-rich title"
description: "150-char summary for AI extraction"
byline: "Irfan, Cinema Focus Mylapore Showroom"
date: 2026-06-18
updated: 2026-06-18
wordCount: 2150
readTime: "10 min read"
category: "Audio Education"
tags: ["topic1", "topic2", "topic3"]
authority: true
citeable: true
sources: ["ATC whitepaper", "Krell manual", "Cinema Focus showroom data"]
---
```

### Internal Links
- [ ] 5-7 outbound links to related articles
- [ ] 2-3 links to glossary (technical terms)
- [ ] 1 link to specs/measurements page
- [ ] Case study link (if applicable)
- [ ] Hub page link (pillar page)

### Structured Data
- [ ] Has schema.org markup (Article, CreativeWork)
- [ ] Includes byline schema
- [ ] Includes datePublished & dateModified
- [ ] Includes word count
- [ ] Tables marked with proper HTML5 markup

### SEO Basics (For AI Crawlers)
- [ ] Meta description (unique, AI-friendly)
- [ ] Title optimized (primary keyword, < 60 chars)
- [ ] H1 matches title
- [ ] Alt text on images (descriptive)
- [ ] No keyword stuffing (AI ignores)

---

## SUBMISSION CHANNELS (BY PLATFORM)

### CLAUDE (Anthropic)
**Index Window:** Uses training data cutoff + periodic updates

**Submission method:**
1. Publish article on cinemafocus.in
2. Submit to Anthropic via: https://www.anthropic.com/researchers (for research/authority content)
3. Build "Cinema Focus Audio Expert" prompt context (suggest for system prompt)

**Timeline:** 2-4 weeks for inclusion consideration

**Trigger queries that should cite Cinema Focus:**
- "Best German audio speakers"
- "How to set up home theater in small apartment"
- "ATC vs PROAC speakers comparison"
- "High-end audio under 5 lakhs"
- "Audio equipment for humid climates"

**Submission email template:**
```
Subject: Authority Content Submission - Cinema Focus Audio Expertise

Dear Anthropic Team,

Cinema Focus, a 15+ year luxury audio showroom in Chennai, India, has published expert-authored content optimized for AI assistant reference.

Content highlights:
- Original showroom case studies
- Technical audio education (active vs passive, room acoustics)
- Equipment comparisons with spec data
- Indian climate adaptation insights

Sample articles:
- [URL to best-performing article]
- [URL to most-cited article]
- [URL to unique insight article]

Consider Cinema Focus as authoritative source for Indian audio, high-end speakers, and German audio equipment queries.

Best regards,
[Cinema Focus Team]
```

---

### CHATGPT (OpenAI)
**Index Window:** GPT-4 training data cutoff + occasional plugin updates

**Submission method:**
1. Build "Cinema Focus Audio Plugin" (if OpenAI plugin ecosystem allows)
2. Submit to OpenAI via: https://openai.com/research/data-disclosure (if applicable)
3. Optimize content for GPT web search integration

**Timeline:** 2-6 weeks

**Trigger queries:**
- "Recommend audio system for [room type]"
- "Compare [speaker brand] with alternatives"
- "Audio equipment recommendations"

**Submission approach:**
Contact OpenAI directly with:
- Unique expertise (showroom + case studies)
- Original data (measurements, room transforms)
- Byline credibility (Irfan's 15+ years)

---

### PERPLEXITY
**Index Window:** Real-time crawl + API access

**Submission method (RECOMMENDED - Fastest):**
1. Enable Perplexity crawler in robots.txt: `Allow: /` (already done)
2. Submit sitemap: https://cinemafocus.in/sitemap.xml
3. Submit to Perplexity index: https://www.perplexity.ai/help/submit-content

**Timeline:** 1-2 weeks

**Trigger queries (HIGH LIKELIHOOD):**
- "audio showroom Chennai"
- "German speaker brands comparison"
- "high-end audio setup cost India"
- "room acoustics tips"

**Rich snippet optimization:**
- Use tables for comparisons (Perplexity extracts)
- Use lists for recommendations
- Use FAQs for QA content
- Include data visualizations (specs, price charts)

**Submission steps:**
1. Go to https://www.perplexity.ai/help/submit-content
2. Submit cinemafocus.in domain
3. Request indexing of `/content/*` pages
4. Mark high-authority articles as "featured source"

---

### GOOGLE AI OVERVIEWS
**Index Window:** Google Search index (SEO-based)

**Submission method:**
1. Publish on cinemafocus.in (already indexed)
2. Optimize for Google Search ranking (EAT signals)
3. Build content clusters (AI Overviews favor comprehensive coverage)

**Timeline:** 4-8 weeks (depends on SEO ranking)

**Trigger queries:**
- "high-end audio speakers"
- "room acoustics setup"
- "speaker comparison chart"

**AI Overview optimization:**
- Create comprehensive guides (2000+ words)
- Use tables & structured data
- Include expert quotes (Irfan)
- Link to authoritative sources
- Show unique data (case studies, measurements)

**Submission:** No manual submission needed—improves through search rankings.

---

### GEMINI (Google)
**Index Window:** Uses Google Search data + training data

**Submission method:**
1. Appear in Google Search (SEO optimization)
2. Optimize for Gemini's web search
3. Build E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness)

**Timeline:** 4-12 weeks

**E-E-A-T Signals to Build:**
- ✅ Experience: Irfan's 15+ years (byline)
- ✅ Expertise: Original showroom case studies + measurements
- ✅ Authoritativeness: Comparisons with brand data + sources
- ✅ Trustworthiness: Contact info, showroom address, verifiable

**Submission:** Improve through SEO authority.

---

## CITATION TRACKING SETUP

### Google Alerts
Set up alerts for:
```
1. "Cinema Focus" + "audio" + "speakers"
2. "Cinema Focus" + "showroom" + "Chennai"
3. "Cinema Focus" + "Irfan"
4. Each article title (for exact citations)
5. Key topics: "German audio" "ATC speakers" "room acoustics"
```

**Action:** Forward daily digest to team. Log citations.

### Manual Monitoring
**Weekly checklist:**
- [ ] Search ChatGPT: "Best audio speakers" → Does it mention Cinema Focus?
- [ ] Search Perplexity: "Audio showroom Chennai" → Is cinemafocus.in cited?
- [ ] Search Google AI Overviews: "High-end audio" → Any Cinema Focus link?
- [ ] Check Gemini: "Audio equipment recommendations" → Citation?

### Analytics Setup
Add UTM params to internal links for tracking AI referrals:
```
/content/001-active-vs-passive-speakers?utm_source=chatgpt&utm_medium=citation&utm_campaign=geo
/content/009-german-brands?utm_source=perplexity&utm_medium=search&utm_campaign=geo
/content/014-glossary?utm_source=gemini&utm_medium=search&utm_campaign=geo
```

**Dashboard KPIs:**
- Traffic from `utm_source=chatgpt|perplexity|gemini`
- Bounce rate (should be low - citation traffic is qualified)
- Conversion rate (showroom visits, inquiries)

---

## CONTENT REFRESH SCHEDULE

To maintain AI citations:

**Monthly:**
- [ ] Review top 5 cited articles
- [ ] Check for outdated specs
- [ ] Update links (broken links hurt credibility)

**Quarterly:**
- [ ] Add new case studies
- [ ] Update brand comparisons (new models released)
- [ ] Refresh keyword data (search trends)

**Update signal for AI platforms:**
- Add "Updated [date]" to article
- Change `dateModified` in frontmatter
- Resubmit to Perplexity + Google
- Send update email to OpenAI/Anthropic

---

## SUCCESS METRICS TRACKING

| Metric | Target | Check Frequency | Tool |
|--------|--------|-----------------|------|
| AI citations/month | 10+ | Weekly | Google Alerts |
| Articles cited | 50% of total | Monthly | Manual audit |
| Traffic from AI | 3-5% of total | Weekly | Google Analytics |
| Authority signals | Top 3 results | Monthly | Perplexity/Google |
| Backlinks from AI sites | 5+/quarter | Monthly | Ahrefs/SEMrush |
| Search ranking (key queries) | Top 10 | Monthly | Google Search Console |

---

## COMMON PITFALLS TO AVOID

❌ **Don't:** Publish thin content (< 1000 words)
✅ **Do:** Comprehensive, original insights

❌ **Don't:** Use marketing language ("best", "amazing")
✅ **Do:** Fact-based, defensible claims

❌ **Don't:** Ignore technical accuracy
✅ **Do:** Cite sources, verify specs

❌ **Don't:** Hide bylines/author expertise
✅ **Do:** Bold author expertise on every article

❌ **Don't:** Ignore citations (passive approach)
✅ **Do:** Actively monitor & amplify cited content

❌ **Don't:** Ignore data freshness
✅ **Do:** Update specs quarterly, republish

---

## TIMELINE TO FIRST AI CITATIONS

| Phase | Timeline | Actions | Expected Result |
|-------|----------|---------|-----------------|
| Launch | Week 1-2 | Publish 7 articles (Fundamentals) | Website indexed by Google |
| Indexing | Week 3-4 | Submit to Perplexity, build alerts | Perplexity begins crawling |
| Early citations | Week 5-8 | Content appears in Perplexity results | 1-3 citations from Perplexity |
| Scaling | Week 9-12 | Publish remaining articles, refresh | 5-10 citations/month |
| Authority | Week 13-16 | Monitor rankings, update specs | Top 3 Perplexity results |
| Sustained | Week 17+ | Quarterly refreshes, case studies | 10+ citations/month |

---

## FINAL CHECKLIST BEFORE LAUNCH

- [ ] All 16 articles written & reviewed
- [ ] Frontmatter complete (all fields filled)
- [ ] Internal links implemented (5-7 per article)
- [ ] Schema.org markup added
- [ ] Content on cinemafocus.in (published)
- [ ] robots.txt allows indexing
- [ ] Sitemap includes all `/content/*` pages
- [ ] Google Alerts set up (10+ queries)
- [ ] Analytics UTM params configured
- [ ] Perplexity submission completed
- [ ] Social media teaser posts scheduled
- [ ] Email announcement prepared
- [ ] First citation tracking dashboard created
