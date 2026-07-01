/* ============================================================
   undressed.socials — pages A : home (hero + what we do / why undressed)
   home is long & scrollable; package cards deep-link into the process.
   ============================================================ */

const MANIFESTO_BODY = {
  en: 'most agencies dress brands up. we undress them — down to their values, their soul, their core truth. then we make that truth loud, strategic and beautiful, heard by the right people at the right place in the right moment. that\u2019s why we\u2019re called undressed.',
  de: 'die meisten Agenturen ziehen Marken an. wir ziehen sie aus — runter auf ihre Werte, ihre Seele, ihre Kernwahrheit. dann machen wir diese Wahrheit laut, strategisch und sch\u00f6n, geh\u00f6rt von den richtigen Menschen am richtigen Ort im richtigen Moment. genau deshalb hei\u00dfen wir undressed.'
};
const PACKAGES_INTRO = {
  en: 'everything we do comes as one of five packages \u2014 each one starts with the undress, then carries your truth as far as you need: strategy, monthly content, production or influence.',
  de: 'alles, was wir tun, gibt es als eines von f\u00fcnf Paketen \u2014 jedes beginnt mit dem Undress und tr\u00e4gt deine Wahrheit dann so weit, wie du willst: Strategie, monatlicher Content, Produktion oder Influence.'
};

/* package card — hover to undress, click to deep-dive on the process page */
function ServiceCard({ s, delay = 0 }) {
  const t = useT();
  return (
    <Reveal as="a" delay={delay} className="svc-link" href={'#/the-process/' + s.slug}>
      <div className="svc-under">
        <span className="svc-tag">{t(s.tag)}</span>
        <p className="svc-desc">{t(s.short)}</p>
        <ul className="svc-deliv">
          {s.deliv.slice(0, 4).map((d) => <li key={d}><span>{d}</span></li>)}
        </ul>
        <span className="svc-more">{t(UI.deepDive)}</span>
      </div>
      <div className="svc-cover">
        <div>
          <span className="svc-tag">{t(s.tag)}</span>
          <h3 className="svc-name" style={{ marginTop: 10 }}>{s.name}</h3>
        </div>
        <span className="svc-peek">{t(UI.whatsUnderneath)} ↑</span>
      </div>
    </Reveal>);

}

function HomePage({ nav, layout }) {
  const t = useT();
  const reduce = () => window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [showIntro] = React.useState(() => !window.__introSeen && !reduce());
  const [showMini] = React.useState(() => window.__introSeen && !reduce());
  return (
    <React.Fragment>
      {showIntro && <IntroHero />}
      {showMini && <MiniIntro />}
      <HeroJack
        opener={TAGLINES.hero}
        cta={<>
          <Button lg solid data-magnetic onClick={() => nav('contact')}>{UI.workWithUs}</Button>
          <Button lg data-magnetic onClick={() => nav('process')}>{t(K.howWeWork)} →</Button>
        </>}>
        {t({
          en: <>we do social media marketing — but not the ordinary way. we undress your brand, stripping away every layer until only the truth remains: your values, your soul, your innermost. then we carry that truth outward — strategically built, aesthetically undeniable, loud enough to reach the right people, at the right place, at the right time, with exactly the right message. we see what others can’t — because we take the time to <em className="accent">undress first</em>.</>,
          de: <>wir machen Social-Media-Marketing — aber nicht auf die gewöhnliche Art. wir ziehen deine Marke aus, Schicht für Schicht, bis nur noch die Wahrheit bleibt: deine Werte, deine Seele, dein Innerstes. dann tragen wir diese Wahrheit nach außen — strategisch gebaut, ästhetisch unbestreitbar, laut genug, um die richtigen Menschen zu erreichen, am richtigen Ort, zur richtigen Zeit, mit genau der richtigen Botschaft. wir sehen, was andere nicht sehen — weil wir uns die Zeit nehmen, <em className="accent">zuerst auszuziehen</em>.</>
        })}
      </HeroJack>

      <main className="band band-tight-top" data-comment-anchor="6431d3a18d-main-65-7">
        <div className="wrap" data-comment-anchor="83999df7d6-div-61-9">
          <WhatWeDo layout={layout} />

          {/* where we play — channels */}
          <div style={{ marginTop: 'var(--gap-6)' }}>
            <SectionHead kicker={t({ en: 'where we play', de: 'wo wir spielen' })}>we don&rsquo;t do beige.</SectionHead>
          </div>
          <Reveal delay={120}>
            <p className="sec-lead" style={{ marginTop: 'var(--gap-3)', maxWidth: '50ch' }}>
              {t({
                en: <>your truth, everywhere it counts. we don&rsquo;t spray it across every platform — we pick the channels where your people actually are, and shape the message for each one. <em className="accent">same soul, four dialects.</em></>,
                de: <>deine Wahrheit, überall wo sie zählt. wir streuen sie nicht wahllos über jede Plattform — wir wählen die Kanäle, auf denen deine Leute wirklich sind, und formen die Botschaft für jeden einzeln. <em className="accent">dieselbe Seele, vier Dialekte.</em></>
              })}
            </p>
          </Reveal>
          <div className="channels-apps-wrap" style={{ marginTop: 'var(--gap-5)' }}>
            <ChannelApps items={CHANNELS.map((c) => c.n)} />
          </div>

          {/* the packages — static heading + intro, packages flow normally */}
          <div style={{ marginTop: 'var(--gap-6)' }}>
            <Reveal><Kicker lead="·">{t({ en: 'the packages', de: 'die Pakete' })}</Kicker></Reveal>
            <Reveal delay={60}><h2 className="h-sec" style={{ marginTop: 'var(--gap-4)' }}>pick your <span className="mark">depth.</span></h2></Reveal>
          </div>
          <Reveal delay={120}>
            <p className="sec-lead" style={{ marginTop: 'var(--gap-3)', maxWidth: '46ch' }} data-comment-anchor="6106ba91c4-p-99-13">
              {t(PACKAGES_INTRO)}
            </p>
          </Reveal>
          <div className="svc-grid" style={{ marginTop: 'var(--gap-5)' }} data-comment-anchor="a4bb40d805-div-88-11">
            {SERVICES.map((s, i) => <ServiceCard key={s.slug} s={s} delay={i * 90} />)}
          </div>

          <Reveal delay={80}>
            <div style={{ marginTop: 'var(--gap-5)' }} data-comment-anchor="fc249826d3-div-95-11">
              <Button data-magnetic onClick={() => nav('process')}>{t({ en: 'see the full process →', de: 'den ganzen Prozess ansehen →' })}</Button>
            </div>
          </Reveal>
        </div>
      </main>
    </React.Fragment>);

}

Object.assign(window, { HomePage, ServiceCard });