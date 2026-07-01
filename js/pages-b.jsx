/* ============================================================
   undressed.socials — pages B : the strip · meet linda · let's talk
   serif italic only INLINE for emphasis; cherry used only as cursor/logo.
   ============================================================ */
const { useState: usePB, useEffect: usePBe, useRef: usePBr } = React;

/* ---------------- MEET LINDA · horizontal scroll (olivier-larose) ----------------
   three slides slide right→left as you scroll the pinned section:
   1) hi, i'm linda + portrait · 2) big Gluten "you work with me. always." ·
   3) ...but here are some extra helping hands + photo.
   mobile / reduced-motion fall back to a normal vertical stack. */
function LindaHScroll({ t }) {
  const stageRef = usePBr(null);
  const trackRef = usePBr(null);
  usePBe(() => {
    const stage = stageRef.current,track = trackRef.current;
    if (!stage || !track) return;
    const small = () => window.matchMedia('(max-width: 860px)').matches;
    const reduce = () => window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const STEP = () => window.innerHeight * 1.15; // scroll distance per slide-snap
    const DWELL0 = () => window.innerHeight * 0.5; // hold at first slide
    const DWELL1 = () => window.innerHeight * 1.1; // longer hold at last slide
    const layout = () => {
      if (reduce() || small()) {stage.style.height = '';track.style.transform = '';[...track.children].forEach((p) => p.style.width = '');return;}
      const w = stage.clientWidth;
      [...track.children].forEach((p) => {p.style.width = w + 'px';});
      const n = track.children.length;
      // extra scroll runway at each end so the first & last slides "dwell"
      // briefly before the page continues / reverses out of the section.
      stage.style.height = window.innerHeight + (n - 1) * STEP() + DWELL0() + DWELL1() + 'px';
      onScroll();
    };
    const onScroll = () => {
      if (reduce() || small()) {track.style.transform = '';return;}
      const n = track.children.length;
      const scrolled = -stage.getBoundingClientRect().top;
      const d0 = DWELL0();
      // hold idx=0 through the first `d0` px, hold idx=n-1 through the last
      // `DWELL1` px, and snap between slides across the middle of the runway.
      const travel = Math.max(1, (n - 1) * STEP());
      const p = Math.min(1, Math.max(0, (scrolled - d0) / travel));
      const idx = Math.round(p * (n - 1)); // snap to a whole slide
      const w = stage.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.style.transform = 'translate3d(' + (-(idx * (w + gap))).toFixed(1) + 'px,0,0)';
    };
    let raf = 0;
    const onResize = () => {cancelAnimationFrame(raf);raf = requestAnimationFrame(layout);};
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const t0 = setTimeout(layout, 60),t1 = setTimeout(layout, 400);
    layout();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);clearTimeout(t0);clearTimeout(t1);
    };
  }, []);
  return (
    <div className="lh-stage" ref={stageRef}>
      <div className="lh-sticky">
        <div className="lh-track" ref={trackRef}>

          {/* slide 1 — hi, i'm linda + portrait */}
          <section className="lh-panel lh-linda">
            <div className="lh-portrait">
              <Plate nowipe ratio="4 / 5" src={window.__resources.linda} label="Linda Hiller" />
              <div className="cap">linda hiller &middot; dornbirn, austria</div>
            </div>
            <div className="lh-linda-copy">
              <h2 className="about-hi">hi, i&rsquo;m <span className="mark">linda.</span></h2>
              <p className="lead">
                {t({
                  en: <>i&rsquo;m Linda, based in Vorarlberg, Austria. i started undressed.socials after years of watching brands with real <em className="accent">soul</em> get flattened into the same beige templates &mdash; copy-paste content that could belong to anyone. i kept thinking: there has to be a deeper way to do this.</>,
                  de: <>ich bin Linda, zuhause in Vorarlberg, Österreich. ich habe undressed.socials gegründet, nachdem ich jahrelang zugesehen habe, wie Marken mit echter <em className="accent">Seele</em> in dieselben beigen Templates gepresst wurden &mdash; Copy-Paste-Content, der zu irgendwem gehören könnte. ich dachte immer: es muss einen tieferen Weg geben.</>
                })}
              </p>
              <p className="lead" style={{ marginTop: 'var(--gap-3)' }}>
                {t({
                  en: <>so i built the agency i wished existed — one that <em className="accent">undresses</em> a brand first: its values, its story, the truth underneath. only then do we carry it outward, strategically and beautifully. for me this was never about going viral; it was about brands finally sounding like themselves. that&rsquo;s the whole reason undressed has a name at all.</>,
                  de: <>also baute ich die Agentur, die ich mir gewünscht hätte — eine, die eine Marke zuerst <em className="accent">auszieht</em>: ihre Werte, ihre Geschichte, die Wahrheit darunter. erst dann tragen wir sie nach außen, strategisch und schön. für mich ging es nie ums Viralgehen, sondern darum, dass Marken endlich nach sich selbst klingen. genau deshalb heißt undressed überhaupt undressed.</>
                })}
              </p>
            </div>
          </section>

          {/* slide 2 — the big statement */}
          <section className="lh-panel lh-quote">
            <h1 className="hl">you work with me. <span className="mark">always.</span></h1>
          </section>

          {/* slide 3 — the circle / helping hands + photo */}
          <section className="lh-panel lh-hands" data-comment-anchor="9835bcc038-section-93-11">
            <div className="lh-hands-copy">
              <Kicker lead="·">{t({ en: 'the circle', de: 'der Kreis' })}</Kicker>
              <h2 className="h-sec" style={{ marginTop: 'var(--gap-4)' }}>&hellip;but here are some extra <span className="mark">helping hands.</span></h2>
              <p className="lead placeholder-copy" style={{ marginTop: 'var(--gap-4)' }}>
                {t({
                  en: '[ placeholder — introduce your trusted circle of specialists here: the people you pull in per project for production, design, motion or paid. ]',
                  de: '[ Platzhalter — stell hier deinen vertrauten Kreis aus Spezialist:innen vor: die Menschen, die du pro Projekt für Produktion, Design, Motion oder Paid dazuholst. ]'
                })}
              </p>
              <p className="lead" style={{ marginTop: 'var(--gap-3)' }}>
                {t({
                  en: <>the work scales when it needs to; the <em className="accent">bureaucracy never does</em>.</>,
                  de: <>die Arbeit skaliert, wenn es nötig ist; die <em className="accent">Bürokratie nie</em>.</>
                })}
              </p>
            </div>
            <div className="lh-hands-photo">
              <Plate nowipe ratio="4 / 5" src={window.__resources.teamHands} label="the circle" />
            </div>
          </section>

        </div>
      </div>
      <div className="lh-hint" aria-hidden="true">scroll &rarr;</div>
    </div>);

}

/* ---------------- THE STRIP (selected work) ---------------- */
function WorkCard({ c }) {
  const t = useT();
  return (
    <Reveal className="work-card" tabIndex={0}>
      <Plate className="work-thumb" ratio="4 / 3" label={c.client} tag={c.tags[0]} />
      <div className="work-body">
        <div className="work-client">{c.client}</div>
        <div className="work-tags">{c.tags.map((tg) => <span key={tg}>{tg}</span>)}</div>
        <div className="work-result">
          <div className="num">{c.num}</div>
          <div className="cap">{t(c.cap)}</div>
        </div>
      </div>
      <div className="work-detail">
        <Kicker lead="·">the naked truth</Kicker>
        <p>{t(c.detail)}</p>
        <div className="num" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px,3vw,44px)', lineHeight: 1 }}>{c.num}</div>
        <div className="cap" style={{ fontSize: 13, opacity: .85 }}>{t(c.cap)}</div>
      </div>
    </Reveal>);

}

function WorkPage({ nav }) {
  const t = useT();
  return (
    <main className="band">
      <div className="wrap">
        <Reveal><Kicker lead="·">{t(K.selectedWork)}</Kicker></Reveal>
        <Reveal delay={60}><h1 className="hl" style={{ marginTop: 'var(--gap-4)' }}>the naked <span className="mark">truth.</span></h1></Reveal>
        <Reveal delay={120}>
          <BigStatement className="flow" open="what happens when brands go bare." style={{ marginTop: 'var(--gap-4)' }}>
            {t({ en: 'real numbers, real reach — the receipts of going undressed.', de: 'echte Zahlen, echte Reichweite — die Belege fürs Ausziehen.' })}
          </BigStatement>
        </Reveal>
        <div className="work-grid">
          {CASES.map((c) => <WorkCard key={c.client} c={c} />)}
        </div>

        {/* bildwelt teaser — wipe-reveal plates (swap in real photography) */}
        <Reveal delay={40} style={{ display: 'block', marginTop: 'var(--gap-5)' }}>
          <p className="subhead">the bildwelt.</p>
          <p className="lead" style={{ marginTop: 12, maxWidth: '42ch' }}>
            {t({ en: 'editorial, filmic, unafraid — a taste of how brands look once they\u2019re undressed.', de: 'editorial, filmisch, furchtlos — ein Vorgeschmack, wie Marken aussehen, sobald sie ausgezogen sind.' })}
          </p>
        </Reveal>
        <div className="plate-row">
          <Plate ratio="3 / 4" label="editorial" tag="01" />
          <Plate ratio="3 / 4" label="campaign" tag="02" />
          <Plate ratio="3 / 4" label="behind the scenes" tag="03" />
          <Plate ratio="3 / 4" label="reel still" tag="04" />
        </div>

        <Reveal delay={120}>
          <div style={{ marginTop: 'var(--gap-5)' }}>
            <Button data-magnetic onClick={() => nav('contact')}>{UI.workWithUs}</Button>
          </div>
        </Reveal>
      </div>
    </main>);

}

/* ---------------- MEET LINDA ---------------- */
function AboutPage({ nav }) {
  const t = useT();
  return (
    <main className="band" data-comment-anchor="2adb1aebdc-main-75-5">
      <div className="wrap" data-comment-anchor="8e310bf31e-div-76-7">
        <Reveal><Kicker lead="·">{t(K.aboutLinda)}</Kicker></Reveal>
        <Reveal delay={60}><h1 className="hl" style={{ marginTop: 'var(--gap-4)' }}>the <span className="mark">workaholic</span> behind it.</h1></Reveal>
        <Reveal delay={110}>
          <BigStatement className="flow" open="this part is personal." style={{ marginTop: 'var(--gap-3)' }}>
            {t({ en: 'the short version of why undressed exists.', de: 'die kurze Version, warum undressed existiert.' })}
          </BigStatement>
        </Reveal>

        <LindaHScroll t={t} />

        <Reveal delay={40}>
          <BigStatement className="flow" open="we stay young." style={{ marginTop: 'var(--gap-4)' }}>
            {t({
              en: <>curious, a little restless, allergic to beige &mdash; and we protect that <em className="accent">on purpose</em>. it&rsquo;s what keeps the work honest.</>,
              de: <>neugierig, ein bisschen rastlos, allergisch gegen beige &mdash; und das schützen wir <em className="accent">ganz bewusst</em>. genau das hält die Arbeit ehrlich.</>
            })}
          </BigStatement>
        </Reveal>
        <Reveal delay={80}>
          <div style={{ marginTop: 'var(--gap-5)' }}>
            <Button data-magnetic onClick={() => nav('contact')}>{UI.workWithUs}</Button>
          </div>
        </Reveal>
      </div>
    </main>);

}

/* ---------------- LET'S TALK (contact + form) ---------------- */
/* form backend: FormSubmit.co AJAX endpoint. The path segment is the activated
   random alias for linda@undressedsocials.com (keeps the address out of the
   markup so scrapers can't harvest it). Activated 2026-07-01. */
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/5af2da801006622209cb1915c35794da';

function ContactPage() {
  const t = useT();
  const [sent, setSent] = usePB(false);
  const [sending, setSending] = usePB(false);
  const [error, setError] = usePB(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (sending) return;
    const f = e.target;
    if (f._honey && f._honey.value) return; // bot filled the honeypot — drop silently
    setSending(true);
    setError(false);
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        brand: f.brand.value,
        email: f.email.value,
        message: f.message.value,
        _subject: 'undressedsocials.com — neue Anfrage von ' + f.brand.value,
        _template: 'table',
      }),
    }).
    then((r) => r.json()).
    then((d) => {
      if (d.success === 'true' || d.success === true) setSent(true);else
      throw new Error(d.message || 'send failed');
    }).
    catch(() => setError(true)).
    finally(() => setSending(false));
  };
  return (
    <main className="band contact">
      <div className="wrap">
        <Reveal><Kicker lead="·">{t(K.contact)}</Kicker></Reveal>
        <Reveal delay={60}>
          <h1 className="hl" style={{ marginTop: 'var(--gap-4)' }}>
            let&rsquo;s start with the <span className="mark">undress.</span>
          </h1>
        </Reveal>
        <Reveal delay={110} style={{ display: 'block', marginTop: 'var(--gap-4)' }}>
          <p className="bigstatement flow">
            <span className="bs-open">stop hiding. start working. </span>
            {t({ en: <>tell us what&rsquo;s underneath. we&rsquo;ll take it from <em className="accent">there</em>.</>, de: <>erzähl uns, was darunter steckt. den <em className="accent">Rest</em> übernehmen wir.</> })}
          </p>
        </Reveal>

        {/* contact details — a clean bordered band */}
        <Reveal delay={130} style={{ display: 'block' }}>
          <div className="contact-meta">
            <div>
              <span className="lbl">{t(UI.formEmail)}</span>
              <a href="mailto:linda@undressedsocials.com"><DisperseText as="span" text="linda@undressedsocials.com" /></a>
            </div>
            <div>
              <span className="lbl">instagram</span>
              <a href="https://instagram.com/undressedsocials" target="_blank" rel="noopener"><DisperseText as="span" text="@undressedsocials" /></a>
            </div>
            <div>
              <span className="lbl">{t({ en: 'phone', de: 'Telefon' })}</span>
              <a href="tel:+436706590073"><DisperseText as="span" text="+43 670 6590073" /></a>
            </div>
          </div>
        </Reveal>

        {/* the form */}
        <Reveal delay={160} className="contact-form-wrap">
          {!sent ?
          <form onSubmit={onSubmit}>
              <div className="field-row">
                <div className="field"><label>{t(UI.formBrand)}</label><input name="brand" required placeholder={t({ en: 'brand name', de: 'Markenname' })} /></div>
                <div className="field"><label>{t(UI.formEmail)}</label><input name="email" required type="email" placeholder="you@brand.com" /></div>
              </div>
              <div className="field"><label>{t(UI.formMsg)}</label><textarea name="message" rows="3" placeholder={t(UI.formMsgPh)}></textarea></div>
              {/* honeypot — invisible to humans, bots fill it and get dropped */}
              <input type="text" name="_honey" tabIndex="-1" autoComplete="off" aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              <Button solid type="submit" data-magnetic disabled={sending}>
                {sending ? t({ en: 'sending…', de: 'wird gesendet…' }) : UI.send}
              </Button>
              {error &&
            <p className="lead" role="alert" style={{ marginTop: 12 }}>
                  {t({
                en: <>hm, that didn&rsquo;t go through. try again — or email us directly at <a href="mailto:linda@undressedsocials.com">linda@undressedsocials.com</a>.</>,
                de: <>hm, das hat nicht geklappt. versuch&rsquo;s nochmal — oder schreib uns direkt an <a href="mailto:linda@undressedsocials.com">linda@undressedsocials.com</a>.</>
              })}
                </p>
            }
            </form> :

          <div className="sent">
              <h3 className="subhead">we&rsquo;ll be in touch.</h3>
              <p className="lead" style={{ marginTop: 8 }}>{t({ en: 'the strip starts soon. stay bare.', de: 'der Strip beginnt bald. bleib bare.' })}</p>
            </div>
          }
        </Reveal>
      </div>
    </main>);

}

/* ---------------- IMPRESSUM / LEGAL (teal · mint) ---------------- */
function ImprintPage({ nav }) {
  const t = useT();
  const blocks = [
  {
    label: { en: 'media owner & publisher', de: 'Medieninhaberin & Herausgeberin' },
    lines: ['Linda Hiller', 'undressed.socials', 'Schulgasse 58', '6850 Dornbirn, Austria']
  },
  {
    label: { en: 'contact', de: 'Kontakt' },
    lines: ['linda@undressedsocials.com', '+43 670 6590073', '@undressedsocials']
  },
  {
    label: { en: 'business details', de: 'Unternehmensdaten' },
    lines: [
      t({ en: 'sole proprietorship (Einzelunternehmen)', de: 'Einzelunternehmen' }),
      t({ en: 'trade: advertising agency', de: 'Gewerbe: Werbeagentur' })]
  },
  {
    label: { en: 'authority & chamber', de: 'Behörde & Kammer' },
    lines: [
      t({ en: 'trade authority: District Authority Dornbirn', de: 'Gewerbebehörde: Bezirkshauptmannschaft Dornbirn' }),
      t({ en: 'member of the Austrian Chamber of Commerce (WKO Vorarlberg)', de: 'Mitglied der Wirtschaftskammer Österreich (WKO Vorarlberg)' }),
      t({ en: 'trade regulations: Gewerbeordnung (ris.bka.gv.at)', de: 'gewerberechtliche Vorschriften: Gewerbeordnung (ris.bka.gv.at)' })]
  }];

  return (
    <main className="band imprint">
      <div className="wrap">
        <Reveal><Kicker lead="·">{t({ en: 'the fine print', de: 'das Kleingedruckte' })}</Kicker></Reveal>
        <Reveal delay={60}><h1 className="hl">the <span className="mark">legal</span> bits.</h1></Reveal>
        <Reveal delay={100}>
          <BigStatement className="flow" open="even honesty has paperwork.">
            {t({ en: 'imprint & data protection, per §5 ECG and §25 MedienG.', de: 'Impressum & Datenschutz, gemäß §5 ECG und §25 MedienG.' })}
          </BigStatement>
        </Reveal>

        <div className="imprint-grid">
          {blocks.map((b, i) =>
          <Reveal key={i} delay={i * 70} className="imprint-block">
              <span className="sd-label">{t(b.label)}</span>
              <div className="imprint-lines">
                {b.lines.map((l, j) => <span key={j}>{l}</span>)}
              </div>
            </Reveal>
          )}
        </div>

        {/* ---- DATENSCHUTZ / privacy ---- */}
        <Reveal delay={40} style={{ display: 'block', marginTop: 'var(--gap-6)' }} id="datenschutz">
          <Kicker lead="·">{t({ en: 'data protection', de: 'Datenschutz' })}</Kicker>
          <h2 className="h-sec freeline">your data, <span className="mark">undressed.</span></h2>
        </Reveal>
        <Reveal delay={80}>
          <BigStatement className="flow">
            {t({
              en: <>we collect as little as possible, use it only to answer you, and <em className="accent">never sell or share it</em>. the detail, per GDPR / DSGVO:</>,
              de: <>wir erheben so wenig wie möglich, nutzen es nur, um dir zu antworten, und <em className="accent">verkaufen oder teilen es nie</em>. die Details, gemäß DSGVO:</>
            })}
          </BigStatement>
        </Reveal>

        <div className="sd-faq" style={{ marginTop: 'var(--gap-5)' }}>
          {PRIVACY.map((p, i) =>
          <details key={i} open={i === 0}>
              <summary>{t(p.q)}</summary>
              <div className="privacy-body">{t(p.a)}</div>
            </details>
          )}
        </div>

        <Reveal delay={60} style={{ display: 'block', marginTop: 'var(--gap-5)' }}>
          <p className="lead" style={{ opacity: .8, fontStyle: 'italic' }}>
            {t({
              en: 'last updated: July 2026.',
              de: 'Stand: Juli 2026.'
            })}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div style={{ marginTop: 'var(--gap-5)' }}>
            <Button data-magnetic onClick={() => nav('home')}>← {t({ en: 'back home', de: 'zur Startseite' })}</Button>
          </div>
        </Reveal>
      </div>
    </main>);

}

Object.assign(window, { WorkPage, AboutPage, ContactPage, ImprintPage, WorkCard });