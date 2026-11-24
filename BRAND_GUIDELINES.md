# KwikLearn Brand Guidelines

The single authoritative reference for all KwikLearn content: website copy, articles, videos, social posts, store listings, press, outreach and AI-generated material. Last updated 2026-11-24 (permanent identity update). Do not create competing brand documents; change this file.

**Guiding principle: KwikLearn's brand identity defines its complete educational ecosystem, while its product availability register accurately reflects the features accessible at any given time. We build the product towards the brand vision; we do not keep rewriting the brand to match each development milestone.**

This file has two layers. Part A (identity) is stable and changes rarely. Part B (availability register) changes with every release. Never mix them: do not edit Part A when a feature ships, and do not describe an unreleased feature as available because it appears in Part A.

Contact addresses: info@kwiklearn.app (general and partnership enquiries), support@kwiklearn.app (support, privacy, deletion). Policy: `docs/company-contact-policy.md` in the kwiklearn-app repository.

---

# PART A: PERMANENT BRAND IDENTITY

## A1. Identity
| | |
|---|---|
| Company | **KwikLearn Technologies Ltd**, a registered Ghanaian software development company that builds mobile applications and digital solutions for individuals, businesses and organisations, as well as its own software products. (Legal description: keep as is.) |
| Brand / platform | **KwikLearn**, a comprehensive digital education platform developed by KwikLearn Technologies Ltd. |
| Slogan | **Learn. Practise. Improve. Achieve.** |
| Homepage headline | **Building a Better Future Through Digital Learning.** (retain) |
| Website | https://kwiklearn.app |

Keep the company and the platform apart: KwikLearn Technologies Ltd is the company, KwikLearn is the educational platform.

## A2. Approved permanent brand description (authoritative corporate positioning)

> KwikLearn is a comprehensive digital education platform designed to make quality education accessible, affordable, engaging and effective through technology.
>
> The KwikLearn educational ecosystem encompasses structured learning, interactive video lessons, AI-powered tutoring, examination preparation, digital study materials, personalised assessments, daily academic challenges, educational competitions, rewards, gifts and recognition for academic achievement.
>
> Designed for students, teachers, parents and educational institutions, KwikLearn promotes independent learning, academic excellence, critical thinking and continuous educational development.
>
> Our mission is to transform education through innovative technology and create meaningful learning opportunities across Ghana, Africa and beyond.
>
> **Learn. Practise. Improve. Achieve.**

Short form (about 150 characters, used in metadata): *KwikLearn is a comprehensive digital education platform for Ghana. Available now: BECE and WASSCE practice, selected study notes and progress tracking.*

## A3. Educational ecosystem (strategic scope)
Structured online learning; interactive video lessons; AI-powered tutoring; digital study materials; curriculum-aligned learning; BECE and WASSCE preparation; practice quizzes and mock examinations; personalised assessments; academic progress tracking; daily academic challenges; educational competitions; leaderboards and academic champions; educational rewards and gifts; recognition of academic achievement; teacher participation; parent engagement; institutional partnerships; educational opportunities.

This is the complete strategic scope. The brand is never defined by Mathematics, by examination preparation, or by the current Android app. Examination preparation is one component of the ecosystem.

## A4. Positioning rules
- Use confident, established language: "KwikLearn is a comprehensive digital education platform", "KwikLearn promotes academic excellence through technology", "KwikLearn's educational ecosystem is designed around learning, assessment, tutoring and student achievement".
- **Avoid temporary framing**: "KwikLearn is building a platform", "an emerging application", "our journey begins with Mathematics", "starting with Mathematics", "simply an exam-prep app", "more subjects coming soon", "growing platform". Existing legal pages and the live app may still carry such wording until separately reviewed; do not copy it into new content.
- **The one standard availability statement:** *Feature and content availability varies by platform and release.* It does not replace specific disclosure: wherever a feature is mentioned that is not available, say so (see B2).
- Mathematics is accurate wherever it describes genuinely available content. Name a subject only when stating a verified availability fact.
- KwikLearn is not an accredited school, university or educational institution. The long-term vision of a comprehensive online learning institution is a vision, never a status.

## A5. Audiences
Students and learners; teachers and academic professionals; parents and families; schools and institutions (private schools, junior and senior high schools, proprietors, headteachers and principals, academic directors, examination preparation centres, educational NGOs, other organisations).

## A6. Voice and tone
Confident, warm, encouraging, practical, credible. Plain English for Ghanaian students, parents and teachers. Assured about the mission, exact about availability. No hype ("revolutionary", "#1", "best in Ghana"), no pressure, no guarantees.

## A7. Approved descriptions
- **Corporate:** A2 above, verbatim, for company profiles, press boilerplate and about pages.
- **Company (legal):** KwikLearn Technologies Ltd is a registered Ghanaian software development company that builds mobile applications and digital solutions for individuals, businesses and organisations, as well as its own software products, including the KwikLearn digital education platform.
- **Product-bound (stores, ads, feature CTAs):** must follow B2, never A2 alone.

## A8. Website, SEO and social positioning
- Homepage title: `KwikLearn Ghana | Digital Learning, BECE & WASSCE Preparation`. H1 as in A1.
- Meta, Open Graph, Twitter and JSON-LD descriptions say the same thing as the short form in A2. Change them together.
- SEO topics (natural use, no stuffing): digital education in Ghana, online learning, educational technology, video lessons, AI-powered education, AI tutoring, digital assessments, BECE and WASSCE preparation, educational competitions, academic challenges, student rewards, school partnerships, African digital education. Use each topic in a sentence that is true: either the feature is available (B1) or the sentence says it is part of the ecosystem and not currently available (B3/B4). Never use a topic as a bare claim, a heading promising it, or a call to action ("Try our AI tutor") while it is unavailable. Keep BECE and WASSCE terms in titles and descriptions to preserve existing search visibility.
- Do not change canonical URLs, analytics, the Google Play URL or the launch-state config in `js/home.js` unless asked.
- Social bios use the A2 short form, the slogan, and the Google Play link.

## A9. Institutional partnerships
Invite conversations about potential partnerships and pilot opportunities with schools, teachers, preparation centres and educational NGOs via info@kwiklearn.app. Never claim existing partnerships, school subscriptions, school dashboards or institutional pricing unless verified in writing by the owner.

## A10. Ghanaian and African context
Ghana first, with an African ambition. British English ("practise" as a verb). Refer to JHS, SHS, BECE, WASSCE and WAEC accurately. Be sensitive to data costs and device limits. Do not claim a presence outside Ghana. Use inclusive imagery and label illustrations as illustrative.

---

# PART B: PRODUCT AVAILABILITY

## B1. Availability register (last verified 2026-11-24)
Update only this part when a feature ships or changes. Status values: **Publicly available**, **In development**, **Planned**, **Not currently available**. "Verified" means seen in the live app or the public Google Play listing; source-code evidence alone is recorded as such.

| Ecosystem component | Status | Evidence | Allowed public wording |
|---|---|---|---|
| Practice quizzes by topic (BECE and WASSCE) | **Publicly available** | Live Play listing; site copy verified by owner 10 Nov 2026 | "Practice quizzes" |
| Exam mode | **Publicly available** | Site copy verified by owner 10 Nov 2026 | "Exam mode" (do not call it "mock examinations" at scale) |
| Study notes | **Publicly available (selected topics)** | Firestore-approved notes shown in app; coverage varies by topic | "Study notes for selected topics" |
| Academic progress tracking, results, Mistake Book | **Publicly available** | Progress screen in the site's real screenshots | As stated |
| Mathematics content | **Publicly available** | Live Play listing ("starting with Mathematics") | Name Mathematics only for availability facts |
| Daily Challenge | **Publicly available (unconfirmed in the current release)** | In the app source on the Home screen; described in the published privacy policy | "A Daily Challenge on the app's Home screen". Owner to confirm. |
| Other subjects (English, Science, Social Studies, ICT, RME, French, WASSCE subjects) | **Not verified** | Content folders exist in source; per-topic availability is set by approved content | "Check the Subjects section in the app" |
| AI-powered tutoring | **In development (placeholder only)** | App shows "KwikLearn Tutor, AI Tutor - Coming Soon"; no working tutor | "Marked Coming Soon in the app". Never "available". |
| Rewards, monthly champions, leaderboards | **In development (unreleased)** | Unmerged branches: rewards-monthly-champions-programme, monthly-champions-announcement | "Part of the ecosystem, not currently available" |
| Personalised assessments | **In development (partial; release unconfirmed)** | First-session Quick Check diagnostic merged on the app's main branch | Not advertised until confirmed live |
| Interactive video lessons | **Planned** | No code evidence | "Part of the ecosystem, not currently available" |
| Educational competitions, gifts | **Planned** | No code evidence | Same |
| Teacher participation, parent engagement | **Planned** | No code evidence | Same |
| Institutional partnerships | **Not currently available** | No partnerships verified | Invitations to enquire only |
| School dashboards, institutional subscriptions | **Not currently available** | No evidence | Never mention as existing |
| Payments, paid plans | **Not currently available** | Switched off; Terms and FAQ state the app is currently free | "Currently free" |
| Accreditation as a school or university | **Not applicable** | Not an educational institution | Never claim |

Release dates are never published unless the owner provides them.

## B2. Rules for stating availability
1. **Brand identity text (Part A)** may describe the whole ecosystem, always with the standard availability statement nearby.
2. **Product-bound text** (Google Play, ads, feature-specific calls to action, app-store screenshots, promotional videos, "Download now" posts) describes only features with status Publicly available.
3. **Any page or post that names an unavailable feature** says so in the same section: "not currently available", "marked Coming Soon in the app", or "part of the ecosystem we are designing". The standard statement alone is not enough for a feature a reader could mistake for live.
4. A feature moves up a status only after verification in the live app (or the owner's written confirmation). Then update B1 and the site's "Available now" panel, and leave Part A unchanged.
5. Never fabricate feature availability, accreditation, partnerships, student or download numbers, rankings, awards or academic results. Never promise exam success.
6. Rewards, gifts and competitions involve children: never advertise prizes, eligibility or dates before the programme exists and is approved.

## B3. What the site does today
The homepage "Educational Ecosystem" section shows the full scope with two panels: "Available now (Android app)" and "Not yet available to users". Update the panels from B1 at each release.

## B4. Prohibited and misleading claims
Unverified features; user, download, school or result numbers; guaranteed exam success; "market leader"; accreditation or endorsement by WAEC, GES, NaCCA or the Ministry; named partnerships; school dashboards or subscriptions; beta or waiting-list language (the app is live on Google Play); real classrooms or users where images are illustrations (keep "Illustrative image" captions and the Android-screenshot disclaimers until screenshots are replaced).

---

# PART C: GUIDANCE FOR AI-GENERATED CONTENT

**Every AI agent must know:** KwikLearn is a comprehensive digital education brand; examination preparation is one component of the ecosystem; Mathematics never defines the brand; video lessons, AI tutoring, competitions, challenges and educational rewards are part of the strategic scope; brand identity stays consistent across development milestones; availability must always match B1; future features are not presented as operational until verified.

- **Articles:** open with the reader's need. Describe KwikLearn with A2 wording, then, if any feature is mentioned, state its availability per B2. Link to https://kwiklearn.app. No invented statistics, testimonials or quotes.
- **Promotional videos:** brand videos may present the ecosystem as strategic scope with an on-screen "Feature availability varies by release" and a spoken note for unavailable parts. Product demo videos show real app screens only. No fake testimonials, no on-screen numbers unless verified.
- **Automated social posts:** one idea per post. Vision and mission posts are fine. Feature posts only for available features. Never an unavailable-feature call to action. Include partnership invitations from A9 in rotation.
- **Product descriptions and store listings:** B2 rule 2. Play limits: short 80 characters, full 4,000.
- **Press releases and media kits:** corporate boilerplate A2; separate "What is available today" paragraph from B1; no quotes attributed to people who have not approved them.

When a conflict arises between this file and an older draft, this file wins.
