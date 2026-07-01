/* ============================================================
   undressed.socials — home "what we do" layout proposals
   10 formations of: section heading + 4 pillars + the usp.
   switch live via the Layout tweak. each has its own entrance.
   ============================================================ */

const HOME_LAYOUTS = [
{ value: 'cards', label: '01 · cards' },
{ value: 'ledger', label: '02 · index' },
{ value: 'split', label: '03 · split' },
{ value: 'rows', label: '04 · rows' },
{ value: 'poster', label: '05 · poster' },
{ value: 'ticker', label: '06 · ticker' },
{ value: 'quad', label: '07 · quad' },
{ value: 'statement', label: '08 · statement' },
{ value: 'zigzag', label: '09 · zigzag' },
{ value: 'minimal', label: '10 · minimal' },
{ value: 'stack', label: '11 · stack' }];


/* shared bits ------------------------------------------------ */
function SectionHead({ kicker, children, sub, center }) {
  return (
    <React.Fragment>
      <Reveal><Kicker lead="·" style={center ? { justifyContent: 'center' } : null}>{kicker}</Kicker></Reveal>
      <Reveal className="rv-head" delay={60}><h2 className="h-sec" data-scroll style={{ marginTop: 'var(--gap-4)' }}>{children}</h2></Reveal>
      {sub && <Reveal delay={120}><p className="h-sub" style={{ marginTop: 'var(--gap-3)' }}>{sub}</p></Reveal>}
    </React.Fragment>);

}
function WwdHead({ t, center }) {
  return <SectionHead kicker={t(K.whatWeDo)} center={center}>we see what others can&rsquo;t.</SectionHead>;
}
function UspBig({ t, hero }) {
  return <MaskStatement open={t(USP.open)} body={t(USP.body)} className={hero ? 'is-hero' : ''} />;
}
function UspLead({ t, style }) {
  return (
    <p className="lead usp-lead" style={style}>
      <span className="usp-open">{t(USP.open)} </span>{t(USP.body)}
    </p>);

}
function pcards(t) {return PILLARS.map((p, i) => ({ p, i, n: '0' + (i + 1) }));}

/* 01 · cards ------------------------------------------------- */
function L_cards(t) {
  return (
    <React.Fragment>
      <WwdHead t={t} />
      <Reveal delay={110}><div style={{ marginTop: 'var(--gap-4)' }}><UspBig t={t} /></div></Reveal>
      <div className="wwd-cards-grid">
        {pcards(t).map(({ p, i, n }) =>
        <Reveal key={p.n} delay={i * 90} className="wwd-card">
            <span className="wwd-idx">{n}</span>
            <h4>{p.n}.</h4>
            <p>{t(p.d)}</p>
          </Reveal>
        )}
      </div>
    </React.Fragment>);

}

/* 02 · index / ledger --------------------------------------- */
function L_ledger(t) {
  return (
    <React.Fragment>
      <WwdHead t={t} />
      <div className="wwd-ledger">
        {pcards(t).map(({ p, i, n }) =>
        <Reveal key={p.n} delay={i * 80} className="wwd-led-row">
            <span className="wwd-led-n">{n}</span>
            <span className="wwd-led-name">{p.n}</span>
            <span className="wwd-led-desc">{t(p.d)}</span>
          </Reveal>
        )}
      </div>
      <Reveal delay={120}><div className="wwd-usp-close"><UspBig t={t} /></div></Reveal>
    </React.Fragment>);

}

/* 03 · split ------------------------------------------------- */
function L_split(t) {
  return (
    <div className="wwd-split">
      <div className="wwd-split-left">
        <WwdHead t={t} />
        <Reveal delay={120}><div style={{ marginTop: 'var(--gap-4)' }}><UspLead t={t} /></div></Reveal>
      </div>
      <div className="wwd-split-right">
        {pcards(t).map(({ p, i }) =>
        <Reveal key={p.n} delay={i * 90} className="wwd-split-item">
            <h4>{p.n}.</h4><p>{t(p.d)}</p>
          </Reveal>
        )}
      </div>
    </div>);

}

/* 04 · rows -------------------------------------------------- */
function L_rows(t) {
  return (
    <React.Fragment>
      <WwdHead t={t} />
      <Reveal delay={110}><div style={{ marginTop: 'var(--gap-4)' }}><UspBig t={t} /></div></Reveal>
      <div className="wwd-rows">
        {pcards(t).map(({ p, i }) =>
        <Reveal key={p.n} delay={i * 80} className="wwd-row">
            <span className="wwd-row-name">{p.n}</span>
            <p className="wwd-row-desc">{t(p.d)}</p>
          </Reveal>
        )}
      </div>
    </React.Fragment>);

}

/* 05 · poster ------------------------------------------------ */
function L_poster(t) {
  return (
    <div className="wwd-poster">
      <WwdHead t={t} center />
      <div className="wwd-poster-grid">
        {pcards(t).map(({ p, i }) =>
        <Reveal key={p.n} delay={i * 90} className="wwd-poster-cell">
            <h4>{p.n}.</h4><p>{t(p.d)}</p>
          </Reveal>
        )}
      </div>
      <Reveal delay={120}><div className="wwd-poster-usp"><UspLead t={t} /></div></Reveal>
    </div>);

}

/* 06 · ticker ------------------------------------------------ */
function L_ticker(t) {
  return (
    <React.Fragment>
      <WwdHead t={t} />
      <Reveal delay={110}><div style={{ marginTop: 'var(--gap-4)', marginBottom: 'var(--gap-3)' }}><UspLead t={t} /></div></Reveal>
      <div className="wwd-ticker">
        {pcards(t).map(({ p, i }) =>
        <Reveal key={p.n} delay={i * 70} className="wwd-tick">
            <span className="wwd-tick-name">{p.n}.</span>
            <span className="wwd-tick-desc">{t(p.d)}</span>
          </Reveal>
        )}
      </div>
    </React.Fragment>);

}

/* 07 · quad -------------------------------------------------- */
function L_quad(t) {
  return (
    <React.Fragment>
      <WwdHead t={t} />
      <Reveal delay={110}><div style={{ margin: 'var(--gap-4) 0 0' }}><UspLead t={t} /></div></Reveal>
      <div className="wwd-quad">
        {pcards(t).map(({ p, i, n }) =>
        <Reveal key={p.n} delay={i * 100} className="wwd-quad-cell">
            <span className="wwd-idx">{n}</span>
            <h4>{p.n}.</h4><p>{t(p.d)}</p>
          </Reveal>
        )}
      </div>
    </React.Fragment>);

}

/* 08 · statement -------------------------------------------- */
function L_statement(t) {
  return (
    <div className="wwd-statement">
      <Reveal><Kicker lead="·">{t(K.whatWeDo)}</Kicker></Reveal>
      <Reveal delay={60}><div style={{ marginTop: 'var(--gap-3)' }}><UspBig t={t} hero /></div></Reveal>
      <div className="wwd-caps">
        {pcards(t).map(({ p, i }) =>
        <Reveal key={p.n} delay={i * 70} className="wwd-cap">
            <span className="wwd-cap-name">{p.n}</span>
            <span className="wwd-cap-desc">{t(p.d)}</span>
          </Reveal>
        )}
      </div>
    </div>);

}

/* 09 · zigzag ------------------------------------------------ */
function L_zigzag(t) {
  return (
    <React.Fragment>
      <WwdHead t={t} />
      <div className="wwd-zig">
        {pcards(t).map(({ p, i }) =>
        <Reveal key={p.n} delay={i * 80} className={'wwd-zig-item ' + (i % 2 ? 'right' : 'left')}>
            <h4>{p.n}.</h4><p>{t(p.d)}</p>
          </Reveal>
        )}
      </div>
      <Reveal delay={120}><div className="wwd-zig-usp"><UspLead t={t} /></div></Reveal>
    </React.Fragment>);

}

/* 10 · minimal ---------------------------------------------- */
function L_minimal(t) {
  return (
    <React.Fragment>
      <WwdHead t={t} />
      <Reveal delay={100}><div style={{ marginTop: 'var(--gap-4)' }}><UspLead t={t} /></div></Reveal>
      <ul className="wwd-min">
        {pcards(t).map(({ p, i }) =>
        <Reveal as="li" key={p.n} delay={i * 70} className="wwd-min-item">
            <span className="wwd-min-name">{p.n}</span>
            <span className="wwd-min-desc">{t(p.d)}</span>
          </Reveal>
        )}
      </ul>
    </React.Fragment>);

}

/* 11 · stack — swiss-ordered ruled list + kinetic oversized words.
   number gutter · giant word · quiet descriptor that lights on hover.
   the descriptors no longer crowd the words → calm, ordered, still big. */
function L_stack(t) {
  const fills = ['solid', 'muted', 'outline', 'soft'];
  return (
    <React.Fragment>
      <WwdHead t={t} />
      <Reveal delay={70}>
        <div style={{ marginTop: 'var(--gap-4)', marginBottom: 'var(--gap-5)' }}><UspBig t={t} /></div>
      </Reveal>
      <div className="wwd-stack">
        {pcards(t).map(({ p, i, n }) =>
        <Reveal key={p.n} delay={i * 90} className="wwd-stack-row">
            <span className="wwd-stack-num">{n}</span>
            <span className={'wwd-stack-word fill-' + fills[i % 4]}>{p.n}.</span>
            <span className="wwd-stack-desc">{t(p.d)}</span>
          </Reveal>
        )}
      </div>
    </React.Fragment>);

}

const WWD_FN = {
  cards: L_cards, ledger: L_ledger, split: L_split, rows: L_rows, poster: L_poster,
  ticker: L_ticker, quad: L_quad, statement: L_statement, zigzag: L_zigzag, minimal: L_minimal,
  stack: L_stack
};

function WhatWeDo({ layout = 'cards' }) {
  const t = useT();
  const fn = WWD_FN[layout] || L_cards;
  return <section className={'wwd wwd-' + layout} data-comment-anchor="357d611575-section-260-10">{fn(t)}</section>;
}

Object.assign(window, { WhatWeDo, HOME_LAYOUTS, SectionHead });