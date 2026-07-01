/* ============================================================
   undressed.socials — content (bilingual EN / DE)
   Rule: big headlines, signature taglines and CTAs stay ENGLISH
   in both languages (that's the brand voice). Body copy, kickers
   and explanatory labels translate. Values shaped {en, de} or
   plain strings (= same in both).
   ============================================================ */
const LangCtx = React.createContext('en');
function useT() {
  const lang = React.useContext(LangCtx);
  return (o) => (o && typeof o === 'object' && !Array.isArray(o) && 'en' in o) ? (o[lang] || o.en) : o;
}

/* ---- signature taglines (English, per the board's mapping) ---- */
const TAGLINES = {
  hero: 'truth has never looked this good.',
  manifesto: 'we see through you. that\u2019s a compliment.',
  services: 'we strip what\u2019s fake. we build what\u2019s real.',
  process: 'stop hiding. start working.',
  work: 'what happens when brands go bare.',
  footer: 'the most powerful thing a brand can wear is nothing.',
};

/* ---- the core idea, long form ---- */
const GRUNDIDEE = {
  en: 'we do social media marketing — but not the ordinary way. we undress your brand, stripping away every layer until only the truth remains: your values, your soul, your innermost. then we carry that truth outward — strategically built, aesthetically undeniable, loud enough to reach the right people, at the right place, at the right time, with exactly the right message. we see what others can\u2019t — because we take the time to undress first.',
  de: 'wir machen Social-Media-Marketing — aber nicht auf die gew\u00f6hnliche Art. wir ziehen deine Marke aus, Schicht f\u00fcr Schicht, bis nur noch die Wahrheit bleibt: deine Werte, deine Seele, dein Innerstes. dann tragen wir diese Wahrheit nach au\u00dfen — strategisch gebaut, \u00e4sthetisch unbestreitbar, laut genug, um die richtigen Menschen zu erreichen, am richtigen Ort, zur richtigen Zeit, mit genau der richtigen Botschaft. wir sehen, was andere nicht sehen — weil wir uns die Zeit nehmen, zuerst auszuziehen.',
};

/* ---- five core values ---- */
const VALUES = [
  { name: { en: 'individuality', de: 'individualität' }, p: { en: 'no template ever fits a soul. everything is built for you, only you.', de: 'kein Template passt je auf eine Seele. alles wird f\u00fcr dich gebaut, nur f\u00fcr dich.' } },
  { name: { en: 'creativity', de: 'kreativität' }, p: { en: 'the idea before the post. we make truth beautiful, never beige.', de: 'die Idee vor dem Post. wir machen Wahrheit sch\u00f6n, nie beige.' } },
  { name: { en: 'curiosity', de: 'neugier' }, p: { en: 'we ask the uncomfortable questions until the real answer shows up.', de: 'wir stellen die unbequemen Fragen, bis die echte Antwort auftaucht.' } },
  { name: { en: 'confidence', de: 'selbstbewusstsein' }, p: { en: 'bold on purpose. we\u2019d rather be remembered than safe.', de: 'bewusst bold. lieber in Erinnerung als auf Nummer sicher.' } },
  { name: { en: 'growth', de: 'wachstum' }, p: { en: 'built to compound — strategy that gets sharper every quarter.', de: 'auf Wachstum gebaut — Strategie, die jedes Quartal sch\u00e4rfer wird.' } },
];

/* ---- kickers / eyebrows ---- */
const K = {
  home: { en: 'social media, but different', de: 'social media, aber anders' },
  whatWeDo: { en: 'what we do', de: 'was wir tun' },
  howWeWork: { en: 'how we work', de: 'wie wir arbeiten' },
  selectedWork: { en: 'selected work', de: 'ausgew\u00e4hlte Arbeiten' },
  aboutLinda: { en: 'the woman who undresses brands', de: 'die Frau, die Marken auszieht' },
  contact: { en: 'reach out. we\u2019ll take it from there.', de: 'melde dich. den Rest \u00fcbernehmen wir.' },
  values: { en: 'values · character', de: 'Werte · Charakter' },
  theFoundation: { en: 'the mandatory first step', de: 'der verpflichtende erste Schritt' },
};

/* ---- services (overview + detail) ---- */
const SERVICES = [
  {
    slug: 'the-undress', name: 'the undress', pair: 1, logo: 'sun',
    tag: { en: 'once · mandatory · before everything', de: 'einmalig · verpflichtend · vor allem anderen' },
    peek: 'the foundation',
    short: { en: 'the strategic groundwork. before a single post.', de: 'der strategische Grundstein. vor dem ersten Post.' },
    desc: {
      en: 'the strategic foundation. before a single post goes out, we go deep — stripping your brand back to its values, its soul, its core truth, and mapping exactly how that truth reaches the right people. nothing else starts without it.',
      de: 'der strategische Grundstein. bevor ein einziger Post rausgeht, gehen wir in die Tiefe — wir ziehen deine Marke runter auf ihre Werte, ihre Seele, ihre Kernwahrheit und planen genau, wie diese Wahrheit die richtigen Menschen erreicht. nichts anderes startet ohne ihn.',
    },
    who: { en: 'every new client. no retainer begins without it.', de: 'jeder neue Kunde. kein Retainer beginnt ohne ihn.' },
    deliv: ['Brand Deep Dive', 'Zielgruppenanalyse', 'Positionierung', 'Roadmap 12 Monate', 'KPI-Framework', '2 Strategie-Meetings', 'Annual Review inkl.'],
    faq: [
      { q: { en: 'why is it mandatory?', de: 'warum ist er verpflichtend?' }, a: { en: 'because content without a truth underneath is just noise. the undress is what makes everything after it land.', de: 'weil Content ohne Wahrheit darunter nur L\u00e4rm ist. der Undress ist das, was alles danach treffen l\u00e4sst.' } },
      { q: { en: 'how long does it take?', de: 'wie lange dauert er?' }, a: { en: 'typically three to four weeks, including two strategy sessions with Linda directly.', de: 'meist drei bis vier Wochen, inklusive zwei Strategie-Sessions direkt mit Linda.' } },
    ],
  },
  {
    slug: 'bare-feed', name: 'bare feed retainer', pair: 5, logo: 'mint',
    tag: { en: 'monthly · from 6 months', de: 'monatlich · ab 6 Monate' },
    peek: 'fully run',
    short: { en: 'your channels, fully taken over.', de: 'deine Kan\u00e4le, vollst\u00e4ndig \u00fcbernommen.' },
    desc: {
      en: 'your channels, fully taken over. we run the whole thing — planned, written, designed, published, managed, measured. you show up; we make it look effortless, month after month.',
      de: 'deine Kan\u00e4le, vollst\u00e4ndig \u00fcbernommen. wir machen das ganze Ding — geplant, geschrieben, gestaltet, ver\u00f6ffentlicht, gemanagt, gemessen. du bist da; wir lassen es m\u00fchelos aussehen, Monat f\u00fcr Monat.',
    },
    who: { en: 'brands ready to commit. the core of what we do.', de: 'Marken, die sich committen. das Herzst\u00fcck unserer Arbeit.' },
    deliv: ['Contentplan', 'Copywriting', 'Layout & Design', 'Publishing', 'Community Management', 'Monatliches Reporting'],
    faq: [
      { q: { en: 'why six months minimum?', de: 'warum mindestens sechs Monate?' }, a: { en: 'social compounds. three months proves nothing; six is where the strategy starts paying off.', de: 'Social wirkt kumulativ. drei Monate beweisen nichts; ab sechs zahlt die Strategie ein.' } },
      { q: { en: 'which channels?', de: 'welche Kan\u00e4le?' }, a: { en: 'instagram first, tiktok and linkedin where they fit your audience.', de: 'Instagram zuerst, TikTok und LinkedIn dort, wo sie zu deiner Zielgruppe passen.' } },
    ],
  },
  {
    slug: 'creative-production', name: 'creative production', pair: 3, logo: 'flame',
    tag: { en: 'retainer or one-off', de: 'Retainer oder Einzelbuchung' },
    peek: 'shot by linda',
    short: { en: 'shot by Linda, directed by us.', de: 'shot by Linda, directed by us.' },
    desc: {
      en: 'shot by Linda, directed by us. shooting days, creative direction, camera + phone-native content, fully edited — content that looks like your brand, not a stock library.',
      de: 'shot by Linda, directed by us. Shooting-Tage, Creative Direction, Kamera- und Handy-Content, voll bearbeitet — Content, der nach deiner Marke aussieht, nicht nach Stockbibliothek.',
    },
    who: { en: 'brands that need real, original footage.', de: 'Marken, die echtes, eigenes Material brauchen.' },
    deliv: ['Shooting-Tage', 'Creative Direction', 'Kamera-Foto-Content', 'Handy-Video-Content', 'Nachbearbeitung'],
    faq: [
      { q: { en: 'can we book just a shoot?', de: 'k\u00f6nnen wir nur ein Shooting buchen?' }, a: { en: 'yes — as a one-off, or built into a retainer at a better rate.', de: 'ja — als Einzelbuchung, oder im Retainer zu besseren Konditionen.' } },
    ],
  },
  {
    slug: 'redressed', name: 'redressed', pair: 4, logo: 'blush',
    tag: { en: 'once · add-on', de: 'einmalig · Add-on' },
    peek: '15 templates',
    short: { en: '15 custom templates. once.', de: '15 custom Templates. einmalig.' },
    desc: {
      en: '15 custom templates. once. a complete, on-brand kit you run yourself between retainers — feed, stories, reels, highlights, all built to your undress.',
      de: '15 custom Templates. einmalig. ein komplettes, markengerechtes Kit, das du selbst bespielst — Feed, Stories, Reels, Highlights, alles auf deinen Undress gebaut.',
    },
    who: { en: 'brands handling content in-house who want it on-brand.', de: 'Marken, die Content selbst machen, aber on-brand wollen.' },
    deliv: ['5 Feed Posts', '4 Stories', '3 Reels', '3 Highlight-Cover'],
    faq: [
      { q: { en: 'do we need the undress first?', de: 'brauchen wir zuerst den Undress?' }, a: { en: 'yes — templates only work when they sit on a real positioning.', de: 'ja — Templates funktionieren nur auf einer echten Positionierung.' } },
    ],
  },
  {
    slug: 'bare-influence', name: 'bare (not bad) influence', pair: 2, logo: 'blood',
    tag: { en: 'campaign-based', de: 'kampagnenbasiert' },
    peek: 'right voices',
    short: { en: 'quality over follower count.', de: 'Qualit\u00e4t \u00fcber Followerzahl.' },
    desc: {
      en: 'quality over follower count. we find the right voices — not the loudest — handle outreach and briefing, run the campaign and report on what actually moved.',
      de: 'Qualit\u00e4t \u00fcber Followerzahl. wir finden die richtigen Stimmen — nicht die lautesten — \u00fcbernehmen Outreach und Briefing, begleiten die Kampagne und reporten, was wirklich bewegt hat.',
    },
    who: { en: 'brands who want real influence, not vanity reach.', de: 'Marken, die echte Wirkung wollen, keine Vanity-Reichweite.' },
    deliv: ['Creator-Selektion', 'Outreach', 'Briefing', 'Kampagnenbegleitung', 'Reporting'],
    faq: [
      { q: { en: 'how do you pick creators?', de: 'wie w\u00e4hlt ihr Creator aus?' }, a: { en: 'fit and trust over follower count — voices your audience already believes.', de: 'Fit und Vertrauen vor Followerzahl — Stimmen, denen deine Zielgruppe schon glaubt.' } },
    ],
  },
];
const SERVICE_BY_SLUG = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));

/* ---- the process (deep dive) ---- */
const PROCESS = [
  {
    n: '01', t: 'the undress', tag: { en: 'always first. always mandatory.', de: 'immer zuerst. immer verpflichtend.' },
    d: {
      en: 'we strip your brand back to its truth — values, soul, audience, positioning — and build the roadmap before anything goes public.',
      de: 'wir ziehen deine Marke runter auf ihre Wahrheit — Werte, Seele, Zielgruppe, Positionierung — und bauen die Roadmap, bevor irgendetwas \u00f6ffentlich wird.',
    },
    points: ['Brand Deep Dive', { en: 'audience & positioning', de: 'Zielgruppe & Positionierung' }, { en: '12-month roadmap + KPIs', de: '12-Monats-Roadmap + KPIs' }],
  },
  {
    n: '02', t: 'build the truth', tag: { en: 'your retainer begins. monthly, strategic, scalable.', de: 'dein Retainer beginnt. monatlich, strategisch, skalierbar.' },
    d: {
      en: 'content gets planned, written, designed and published — your channels, fully run, on a rhythm that compounds.',
      de: 'Content wird geplant, geschrieben, gestaltet und ver\u00f6ffentlicht — deine Kan\u00e4le, vollst\u00e4ndig betreut, in einem Rhythmus, der sich aufbaut.',
    },
    points: [{ en: 'content plan & copy', de: 'Contentplan & Copy' }, { en: 'design & production', de: 'Design & Produktion' }, { en: 'publishing & community', de: 'Publishing & Community' }],
  },
  {
    n: '03', t: 'carry it outward', tag: { en: 'reach grows. content delivers.', de: 'Reichweite w\u00e4chst. Content liefert.' },
    d: {
      en: 'we push the truth outward — creator campaigns, paid where it counts — and review every quarter so it keeps getting sharper.',
      de: 'wir tragen die Wahrheit nach au\u00dfen — Creator-Kampagnen, Paid wo es z\u00e4hlt — und reviewen jedes Quartal, damit es sch\u00e4rfer wird.',
    },
    points: [{ en: 'influence & reach', de: 'Influence & Reichweite' }, 'Reporting', { en: 'quarterly review', de: 'Quarterly Review' }],
  },
];

/* ---- selected work ---- */
const CASES = [
  {
    client: 'atelier nord', tags: ['interior', 'strategy', 'content'],
    num: '+214%', cap: { en: 'engaged reach in 90 days', de: 'engagierte Reichweite in 90 Tagen' },
    detail: { en: 'we undressed a quiet design studio down to one idea — \u201cspace as a feeling\u201d — and rebuilt the whole feed around it.', de: 'wir haben ein leises Designstudio auf eine Idee runtergezogen — \u201eRaum als Gef\u00fchl\u201c — und den ganzen Feed darum neu gebaut.' },
  },
  {
    client: 'feld & flora', tags: ['hospitality', 'retainer', 'production'],
    num: '3.1×', cap: { en: 'inbound bookings', de: 'Buchungsanfragen' },
    detail: { en: 'shot on location, directed end-to-end. a farm-table brand that finally looks like it tastes.', de: 'vor Ort gedreht, end-to-end inszeniert. eine Farm-to-Table-Marke, die endlich so aussieht, wie sie schmeckt.' },
  },
  {
    client: 'studio hild', tags: ['beauty', 'influence', 'reach'],
    num: '+9.4k', cap: { en: 'real followers, zero ads', de: 'echte Follower, null Ads' },
    detail: { en: 'creator-led, quality over follower count. the right voices, not the loudest ones.', de: 'creator-getrieben, Qualit\u00e4t \u00fcber Followerzahl. die richtigen Stimmen, nicht die lautesten.' },
  },
];

/* ---- misc UI strings ---- */
const UI = {
  workWithUs: 'work with us \u2192',
  seeWhatWeDo: 'see what we do \u2192',
  deepDive: { en: 'deep dive \u2192', de: 'mehr erfahren \u2192' },
  allServices: { en: 'all services', de: 'alle Services' },
  whatsUnderneath: { en: 'what\u2019s underneath', de: 'was steckt darunter' },
  deliverables: { en: 'deliverables', de: 'Leistungen' },
  whoItsFor: { en: 'who it\u2019s for', de: 'f\u00fcr wen' },
  faq: 'faq',
  next: { en: 'next', de: 'weiter' },
  prev: { en: 'before', de: 'zur\u00fcck' },
  formBrand: { en: 'your brand', de: 'deine Marke' },
  formEmail: { en: 'email', de: 'E-Mail' },
  formMsg: { en: 'what\u2019s underneath?', de: 'was steckt darunter?' },
  formMsgPh: { en: 'tell us in one breath\u2026', de: 'erz\u00e4hl es uns in einem Atemzug\u2026' },
  send: 'send \u2192',
  studio: { en: 'studio', de: 'Studio' },
};

/* ---- the four pillars (what we do) ---- */
const PILLARS = [
  { n: 'strategy',  d: { en: 'the thinking before the posting. every move planned before a single thing goes out.', de: 'das Denken vor dem Posten. jeder Schritt geplant, bevor irgendetwas rausgeht.' } },
  { n: 'content',   d: { en: 'everything looks exactly like it should — on brand, on purpose, every time.', de: 'alles sieht genau so aus, wie es soll — markentreu, mit Absicht, jedes Mal.' } },
  { n: 'reach',     d: { en: 'your truth, louder. the right people, the right place, the right moment.', de: 'deine Wahrheit, lauter. die richtigen Menschen, der richtige Ort, der richtige Moment.' } },
  { n: 'community', d: { en: 'the part most brands forget — turning followers into people who actually care.', de: 'der Teil, den die meisten vergessen — aus Followern Menschen machen, die wirklich mitfühlen.' } },
];

/* ---- our usp: trend-aware, soul-led ---- */
const USP = {
  open: { en: 'social media moves like fast fashion.', de: 'social media bewegt sich wie fast fashion.' },
  body: {
    en: <>trends spike, algorithms rewrite themselves overnight, and most brands chase both until they all sound the same. we work the other way around: every month we plan, create and release new ideas — built on your strategy, not on the feed&rsquo;s mood. <em className="accent">trend-aware, never trend-led.</em> loud on the surface, and always true to the soul underneath.</>,
    de: <>trends flammen auf, algorithmen schreiben sich über nacht neu, und die meisten marken jagen beidem hinterher, bis alle gleich klingen. wir machen es andersherum: jeden monat planen, gestalten und veröffentlichen wir neue ideen — gebaut auf deiner strategie, nicht auf der laune des feeds. <em className="accent">trendbewusst, nie trendgetrieben.</em> laut an der oberfläche, und immer treu zur seele darunter.</>,
  },
};

/* ---- interim moodboard imagery (swap for Linda's own shoots) ---- */
const MOOD = [
  'assets/mood/m01.jpg', 'assets/mood/m02.jpg', 'assets/mood/m03.jpg', 'assets/mood/m04.jpg',
  'assets/mood/m05.jpg', 'assets/mood/m06.jpg', 'assets/mood/m07.jpg', 'assets/mood/m08.jpg',
  'assets/mood/m09.jpg', 'assets/mood/m10.jpg', 'assets/mood/m11.jpg', 'assets/mood/m12.jpg',
];

/* ---- channels we play ---- */
const CHANNELS = [
  { n: 'instagram', slug: 'instagram',
    who: { en: 'reach 25–45, visual-first, discovery + loyalty in one place.', de: 'Zielgruppe 25–45, visuell-first, Entdeckung + Bindung an einem Ort.' },
    best: { en: 'brand identity, product worlds, behind-the-scenes, community.', de: 'Markenidentität, Produktwelten, Behind-the-Scenes, Community.' },
    d: { en: 'the home base — feed, stories, reels, the full identity in one place. where most brands live, and where we make sure yours actually looks alive instead of just present.', de: 'die Homebase — Feed, Stories, Reels, die ganze Identität an einem Ort. wo die meisten Marken leben, und wo wir dafür sorgen, dass deine wirklich lebendig wirkt statt nur vorhanden.' } },
  { n: 'tiktok', slug: 'tiktok',
    who: { en: 'reach 16–34, trend-native, hungry for the real and unpolished.', de: 'Zielgruppe 16–34, trend-nativ, hungrig auf Echtes und Ungeschliffenes.' },
    best: { en: 'reach, virality, founder voice, fast cultural relevance.', de: 'Reichweite, Viralität, Gründer-Stimme, schnelle kulturelle Relevanz.' },
    d: { en: 'short-form that travels. native, fast, unpolished on purpose — built to be watched and shared, never scrolled past. this is where reach is earned, not bought.', de: 'Short-Form, die sich verbreitet. nativ, schnell, bewusst ungeschliffen — gemacht zum Anschauen und Teilen, nicht zum Wegscrollen. hier wird Reichweite verdient, nicht gekauft.' } },
  { n: 'linkedin', slug: 'linkedin',
    who: { en: 'reach decision-makers, founders, b2b buyers and future hires.', de: 'erreicht Entscheider:innen, Gründer:innen, B2B-Käufer:innen und künftige Mitarbeitende.' },
    best: { en: 'authority, thought leadership, hiring, b2b trust-building.', de: 'Autorität, Thought Leadership, Recruiting, B2B-Vertrauensaufbau.' },
    d: { en: 'the b2b truth — credibility without the corporate cosplay. your expertise made human, so the right people trust you before they ever meet you.', de: 'die B2B-Wahrheit — Glaubwürdigkeit ohne Corporate-Kostüm. deine Expertise, menschlich gemacht, damit die richtigen Leute dir vertrauen, bevor sie dich treffen.' } },
  { n: 'pinterest', slug: 'pinterest',
    who: { en: 'reach planners and buyers in research mode — high intent, female-leaning.', de: 'erreicht Planer:innen und Käufer:innen im Recherche-Modus — hohe Kaufabsicht, eher weiblich.' },
    best: { en: 'aesthetic discovery, evergreen reach, traffic that compounds.', de: 'ästhetische Entdeckung, Evergreen-Reichweite, Traffic der sich aufbaut.' },
    d: { en: 'the mood engine. where your aesthetic gets discovered and saved long after a post goes quiet — quietly compounding reach while everything else expires.', de: 'die Mood-Maschine. wo deine Ästhetik entdeckt und gespeichert wird, lange nachdem ein Post verstummt ist — leise wachsende Reichweite, während alles andere verfällt.' } },
];
const CHANNEL_BY_SLUG = Object.fromEntries(CHANNELS.map((c) => [c.slug, c]));

/* ---- references (text wordmarks until real logos arrive) ---- */
const REFERENCES = ['skinfit international', 'lieblingsglas', 'everdrop', 'jonnyandlinda', 'uniqa', 'vetain'];

/* ---- privacy policy sections (GDPR / DSGVO) ---- */
const PRIVACY = [
  {
    q: { en: 'who is responsible', de: 'wer ist verantwortlich' },
    a: { en: 'the controller for data processing on this site is Linda Hiller, undressed.socials, [ address ], Dornbirn, Austria — linda@undressedsocials.com. reach us any time with privacy questions.',
         de: 'verantwortlich für die Datenverarbeitung auf dieser Seite ist Linda Hiller, undressed.socials, [ Adresse ], Dornbirn, Österreich — linda@undressedsocials.com. melde dich jederzeit mit Datenschutzfragen.' },
  },
  {
    q: { en: 'what we collect', de: 'welche Daten wir erheben' },
    a: { en: 'contact form & email: the brand name, email address and message you send us. server log files: your provider, browser, time of access and IP (collected automatically by the host). we use no tracking pixels and no advertising cookies.',
         de: 'Kontaktformular & E-Mail: der Markenname, die E-Mail-Adresse und die Nachricht, die du uns sendest. Server-Logfiles: dein Provider, Browser, Zugriffszeit und IP (automatisch vom Hoster erfasst). wir setzen keine Tracking-Pixel und keine Werbe-Cookies.' },
  },
  {
    q: { en: 'purpose & legal basis', de: 'Zweck & Rechtsgrundlage' },
    a: { en: 'we process your enquiry to answer it and, where it leads to a project, to prepare a contract — Art 6(1)(b) GDPR. log files are kept for security and operation on our legitimate interest — Art 6(1)(f) GDPR.',
         de: 'wir verarbeiten deine Anfrage, um sie zu beantworten und — falls sie zu einem Projekt führt — zur Vertragsanbahnung — Art 6 Abs 1 lit b DSGVO. Logfiles werden zu Sicherheit und Betrieb auf Basis unseres berechtigten Interesses gespeichert — Art 6 Abs 1 lit f DSGVO.' },
  },
  {
    q: { en: 'hosting', de: 'Hosting' },
    a: { en: 'this site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, delivered via its global edge network (including EU servers). Vercel processes the above log data on our behalf under a data-processing agreement (Art 28 GDPR); transfers to the USA are safeguarded by the EU standard contractual clauses (Art 46 GDPR).',
         de: 'diese Seite wird von Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA gehostet und über deren globales Edge-Netzwerk (inkl. EU-Servern) ausgeliefert. Vercel verarbeitet die genannten Logdaten in unserem Auftrag auf Grundlage eines Auftragsverarbeitungsvertrags (Art 28 DSGVO); Übermittlungen in die USA sind durch die EU-Standardvertragsklauseln (Art 46 DSGVO) abgesichert.' },
  },
  {
    q: { en: 'cookies & local storage', de: 'Cookies & lokaler Speicher' },
    a: { en: 'we set no marketing cookies. the site stores two small preferences in your browser\u2019s local storage — your language choice and whether you\u2019ve seen the intro — so it behaves nicely on return. these never leave your device.',
         de: 'wir setzen keine Marketing-Cookies. die Seite speichert zwei kleine Einstellungen im lokalen Speicher deines Browsers — deine Sprachwahl und ob du das Intro schon gesehen hast — damit sie sich beim Wiederkommen angenehm verhält. diese verlassen dein Gerät nie.' },
  },
  {
    q: { en: 'social media', de: 'Social Media' },
    a: { en: 'links to our Instagram (@undressedsocials) only open the platform — no data is shared until you click. on the platform, the provider\u2019s own privacy terms apply.',
         de: 'Links zu unserem Instagram (@undressedsocials) öffnen lediglich die Plattform — es werden keine Daten übertragen, bevor du klickst. auf der Plattform gelten die Datenschutzbestimmungen des Anbieters.' },
  },
  {
    q: { en: 'how long we keep it', de: 'Speicherdauer' },
    a: { en: 'enquiry data is kept as long as needed to answer you and to meet legal retention duties (e.g. accounting), then deleted. log files are deleted by the host after 30 days at the latest.',
         de: 'Anfragedaten werden so lange gespeichert, wie es zur Beantwortung und zur Erfüllung gesetzlicher Aufbewahrungspflichten (z. B. Buchhaltung) nötig ist, danach gelöscht. Logfiles werden vom Hoster spätestens nach 30 Tagen gelöscht.' },
  },
  {
    q: { en: 'your rights', de: 'deine Rechte' },
    a: { en: 'you have the right to access, rectification, erasure, restriction, data portability and objection. you may also lodge a complaint with the Austrian Data Protection Authority (dsb.gv.at). just email linda@undressedsocials.com to exercise any of these.',
         de: 'du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. du kannst dich außerdem bei der österreichischen Datenschutzbehörde (dsb.gv.at) beschweren. schreib einfach an linda@undressedsocials.com, um eines dieser Rechte auszuüben.' },
  },
];

Object.assign(window, {
  LangCtx, useT, TAGLINES, GRUNDIDEE, VALUES, K, SERVICES, SERVICE_BY_SLUG, PROCESS, CASES, UI,
  MOOD, CHANNELS, CHANNEL_BY_SLUG, REFERENCES, PRIVACY, PILLARS, USP,
});
