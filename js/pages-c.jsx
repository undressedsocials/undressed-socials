/* ============================================================
   undressed.socials — pages C : the process
   the 3 steps + packages as a tidy accordion (declutters the page).
   deep links (#/the-process/<slug>) open + scroll to the right package.
   ============================================================ */
const { useEffect: usePC, useState: usePCs, useRef: usePCr } = React;

/* one package = a numbered, ruled row; click opens the detail panel */
function PackageItem({ s, n, open, onToggle, nav }) {
  const t = useT();
  return (
    <div className={'pkg-item' + (open ? ' open' : '')} id={'pkg-' + s.slug}>
      <button className="pkg-row" onClick={onToggle} aria-expanded={open}>
        <span className="pkg-num">{n}</span>
        <span className="pkg-name">{s.name}</span>
        <span className="pkg-tag">{t(s.tag)}</span>
        <span className="pkg-ind" aria-hidden="true"></span>
      </button>
      {open &&
      <div className="pkg-panel">
          <div className="pkg-panel-inner">
            <div className="pkg-panel-main">
              <p className="lead">{t(s.desc)}</p>
              <span className="sd-label" style={{ marginTop: 'var(--gap-4)' }}>{t(UI.deliverables)}</span>
              <ul className="sd-deliv">
                {s.deliv.slice(0, 4).map((d) => <li key={d}><span>{d}</span></li>)}
              </ul>
            </div>
            <div className="pkg-panel-aside">
              <span className="sd-label">{t(UI.whoItsFor)}</span>
              <p className="lead" style={{ margin: '6px 0 var(--gap-4)' }}>{t(s.who)}</p>
              <Button solid data-magnetic onClick={() => nav('contact')}>{UI.workWithUs}</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}

/* tabs variant — numbered package list on the left, detail panel on the right */
function PackageTabs({ sel, setSel, nav }) {
  const t = useT();
  const s = SERVICES[sel];
  return (
    <div className="pkg-tabs">
      <div className="pkg-tablist" role="tablist">
        {SERVICES.map((p, i) =>
        <button key={p.slug} className={'pkg-tab' + (i === sel ? ' on' : '')}
        role="tab" aria-selected={i === sel} onClick={() => setSel(i)}>
            <span className="pkg-tab-n">{'0' + (i + 1)}</span>
            <span className="pkg-tab-nm">{p.name}</span>
          </button>
        )}
      </div>
      <div className="pkg-tabpanel" key={s.slug}>
        <span className="svc-tag">{t(s.tag)}</span>
        <h3 className="pkg-tab-head" data-comment-anchor="88a439c432-h3-58-9">{s.name}</h3>
        <p className="lead">{t(s.desc)}</p>
        <div className="pkg-tab-cols">
          <div>
            <span className="sd-label">{t(UI.deliverables)}</span>
            <ul className="sd-deliv">{s.deliv.slice(0, 4).map((d) => <li key={d}><span>{d}</span></li>)}</ul>
          </div>
          <div>
            <span className="sd-label">{t(UI.whoItsFor)}</span>
            <p className="lead" style={{ margin: '6px 0 var(--gap-4)' }}>{t(s.who)}</p>
            <Button solid data-magnetic onClick={() => nav('contact')}>{UI.workWithUs}</Button>
          </div>
        </div>
      </div>
    </div>);

}

/* packages as a scroll-driven carousel — the row of cards slides right→left
   into view as you scroll the pinned section. mobile / reduced-motion fall back
   to a normal swipeable row. */
function PackageCarousel({ nav }) {
  const t = useT();
  const stageRef = usePCr(null);
  const trackRef = usePCr(null);
  usePC(() => {
    const stage = stageRef.current,track = trackRef.current;
    if (!stage || !track) return;
    const small = () => window.matchMedia('(max-width: 820px)').matches;
    const reduce = () => window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const layout = () => {
      if (reduce() || small()) {stage.style.height = '';track.style.transform = '';return;}
      const dist = Math.max(0, track.scrollWidth - stage.clientWidth);
      stage.style.height = window.innerHeight + dist + 'px';
      onScroll();
    };
    const onScroll = () => {
      if (reduce() || small()) {track.style.transform = '';return;}
      const dist = Math.max(0, track.scrollWidth - stage.clientWidth);
      const total = stage.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / total)) : 0;
      track.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
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
    <div className="pkg-carousel" ref={stageRef}>
      <div className="pkg-carousel-sticky" data-comment-anchor="2c135b8716-div-115-7">
        <div className="pkg-track" ref={trackRef}>
          {SERVICES.map((s, i) =>
          <div className="pkg-card" key={s.slug} id={'pkg-' + s.slug}>
              <div className="pkg-card-top">
                <span className="pkg-card-n">{'0' + (i + 1)}</span>
                <span className="svc-tag">{t(s.tag)}</span>
              </div>
              <h3 className="pkg-card-name">{s.name}</h3>
              <p className="pkg-card-desc">{t(s.desc)}</p>
              <div className="pkg-card-foot">
                <span className="sd-label">{t(UI.deliverables)}</span>
                <ul className="sd-deliv">{s.deliv.slice(0, 4).map((d) => <li key={d}><span>{d}</span></li>)}</ul>
                <Button solid data-magnetic onClick={() => nav('contact')}>{UI.workWithUs}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}

function ProcessPage({ nav, focus, pkgStyle }) {
  const t = useT();
  const startIdx = Math.max(0, SERVICES.findIndex((x) => x.slug === focus));
  const [openSlug, setOpenSlug] = usePCs(focus || SERVICES[0].slug);
  const [tab, setTab] = usePCs(startIdx);

  usePC(() => {
    if (!focus) return;
    const isCh = focus.indexOf('ch-') === 0;
    if (!isCh) setOpenSlug(focus);
    const id = setTimeout(() => {
      const el = document.getElementById(isCh ? focus : 'pkg-' + focus);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top: y, behavior: 'auto' });
      }
    }, 90);
    return () => clearTimeout(id);
  }, [focus]);

  return (
    <main className="band">
      <div className="wrap" data-comment-anchor="c95afa9637-div-160-7">
        <Reveal><Kicker lead="·">{t(K.howWeWork)}</Kicker></Reveal>
        <Reveal delay={60}><h1 className="hl">we go <span className="mark">deep.</span></h1></Reveal>
        <Reveal delay={110}>
          <BigStatement className="flow" open="stop hiding. start working." style={{ marginTop: 'var(--gap-4)' }}>
            {t({
              en: 'three moves, always in order. the undress is mandatory and comes first — then the work begins and the reach follows. no shortcuts, because shortcuts are how brands end up looking like everyone else.',
              de: 'drei Schritte, immer in dieser Reihenfolge. der Undress ist verpflichtend und kommt zuerst — dann beginnt die Arbeit und die Reichweite folgt. keine Abkürzungen, denn Abkürzungen sind der Grund, warum Marken am Ende aussehen wie alle anderen.'
            })}
          </BigStatement>
        </Reveal>

        <div className="proc" data-comment-anchor="0e2b4b030a-div-172-9">
          {PROCESS.map((p, i) =>
          <Reveal key={p.n} delay={i * 90} className="proc-step">
              <div className="proc-num">{p.n}</div>
              <div>
                <h3>{p.t}</h3>
                <p className="label-caps" style={{ opacity: .7, marginBottom: 12 }}>{t(p.tag)}</p>
                <p className="lead">{t(p.d)}</p>
                <ul className="proc-points">
                  {p.points.map((pt, j) => <li key={j}><span>{t(pt)}</span></li>)}
                </ul>
              </div>
            </Reveal>
          )}
        </div>

        {/* packages — accordion or tabs, switchable */}
        <Reveal delay={40} style={{ display: 'block', marginTop: 'var(--gap-6)' }}>
          <Kicker lead="·">{t({ en: 'the packages', de: 'die Pakete' })}</Kicker>
          <h2 className="h-sec freeline">strip down to <span className="mark">five.</span></h2>
          <p className="sec-lead" style={{ marginTop: 'var(--gap-3)', maxWidth: '52ch' }}>
            {t({
              en: <>every brand starts with <em className="accent">the undress</em> — the strategic foundation no feed gets built without. from there, four ways to keep going: a monthly retainer, production, templates, or influence. you pick the depth; the truth underneath stays the same.</>,
              de: <>jede Marke startet mit <em className="accent">dem Undress</em> — dem strategischen Fundament, ohne das kein Feed gebaut wird. ab da vier Wege weiterzugehen: monatlicher Retainer, Produktion, Templates oder Influence. du wählst die Tiefe; die Wahrheit darunter bleibt dieselbe.</>
            })}
          </p>
        </Reveal>
        <PackageCarousel nav={nav} />

        {/* where we play — channel detail + audiences (deep-linked from home tiles) */}
        <Reveal delay={40} style={{ display: 'block', marginTop: 'var(--gap-4)' }}>
          <Kicker lead="·">{t({ en: 'where we play', de: 'wo wir spielen' })}</Kicker>
          <h2 className="h-sec freeline">the right <span className="mark">rooms.</span></h2>
          <p className="sec-lead" style={{ marginTop: 'var(--gap-3)', maxWidth: '52ch' }}>
            {t({ en: 'we don\u2019t spray your truth across every platform — we pick the rooms where your people actually are, and speak each one\u2019s language.', de: 'wir streuen deine Wahrheit nicht über jede Plattform — wir wählen die Räume, in denen deine Leute wirklich sind, und sprechen die Sprache jedes einzelnen.' })}
          </p>
        </Reveal>
        <div className="ch-cards">
          {CHANNELS.map((c, i) =>
          <Reveal key={c.slug} delay={i * 70} className="ch-card" id={'ch-' + c.slug}>
              <div className="ch-card-top">
                <span className="ch-card-num">{('0' + (i + 1)).slice(-2)}</span>
                <h3 className="ch-card-name">{c.n}</h3>
              </div>
              <p className="ch-card-desc">{t(c.d)}</p>
              <div className="ch-card-meta">
                <div><span className="sd-label">{t({ en: 'who you reach', de: 'wen du erreichst' })}</span><p>{t(c.who)}</p></div>
                <div><span className="sd-label">{t({ en: 'best for', de: 'am besten für' })}</span><p>{t(c.best)}</p></div>
              </div>
            </Reveal>
          )}
        </div>

        {/* brand character — the five values */}
        <Reveal delay={40} style={{ display: 'block', marginTop: 'var(--gap-6)' }}>
          <Kicker lead="·">{t(K.values)}</Kicker>
          <h2 className="h-sec freeline">this is <span className="mark">us.</span></h2>
        </Reveal>
        <div className="values">
          {VALUES.map((v, i) =>
          <Reveal key={v.name.en} delay={i * 70} className="value">
              <span className="vn">{v.name.de}</span>
              <span className="vn-en">{v.name.en}</span>
              <p>{t(v.p)}</p>
            </Reveal>
          )}
        </div>

        <Reveal delay={80}>
          <div style={{ marginTop: 'var(--gap-5)' }}>
            <Button solid data-magnetic onClick={() => nav('contact')}>{UI.workWithUs}</Button>
          </div>
        </Reveal>
      </div>
    </main>);

}

Object.assign(window, { ProcessPage, PackageItem });