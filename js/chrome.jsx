/* ============================================================
   undressed.socials — shared chrome : nav + footer
   nav labels stay English (brand voice). lang toggle flips body copy.
   ============================================================ */
const { useState: useCh, useEffect: useChE } = React;

const NAV_ITEMS = [
{ key: 'process', label: 'the process' },
{ key: 'about', label: 'meet linda' },
{ key: 'contact', label: 'let\u2019s talk' }];


function LangToggle({ lang, setLang, big }) {
  return (
    <div className={'lang-toggle' + (big ? ' big' : '')}>
      <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}><span>EN</span></button>
      <button className={lang === 'de' ? 'on' : ''} onClick={() => setLang('de')}><span>DE</span></button>
    </div>);

}

function SiteNav({ route, logo, nav, lang, setLang, menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useCh(false);
  useChE(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const go = (k) => {setMenuOpen(false);nav(k);};
  const navStyle = {
    background: scrolled ? 'var(--surface)' : 'transparent',
    boxShadow: scrolled ? '0 1px 0 color-mix(in srgb, currentColor 22%, transparent)' : 'none'
  };
  // active also when on a service detail page (its parent is services)
  const isActive = (k) => route === k;
  return (
    <React.Fragment>
      <nav className="nav" style={navStyle} data-comment-anchor="ea2c906430-nav-39-7">
        <div className="lock" data-magnetic onClick={() => go('home')} aria-label="undressed.socials — home">
          <img src={window.__resources['wmc_' + logo]} alt="undressedsocials" />
        </div>
        <div className="nav-links">
          {NAV_ITEMS.map((it) =>
          <a key={it.key} className={isActive(it.key) ? 'active' : ''} onClick={() => go(it.key)}>{it.label}</a>
          )}
          <LangToggle lang={lang} setLang={setLang} />
          <Button data-magnetic onClick={() => go('contact')}>work with us →</Button>
        </div>
        <button
          className={'nav-burger' + (menuOpen ? ' open' : '')}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="menu">
          
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={'drawer' + (menuOpen ? ' open' : '')}>
        {NAV_ITEMS.map((it) =>
        <a key={it.key} className={isActive(it.key) ? 'active' : ''} onClick={() => go(it.key)}>{it.label}</a>
        )}
        <Button onClick={() => go('contact')}>work with us →</Button>
        <LangToggle lang={lang} setLang={setLang} big />
        <div className="drawer-foot">
          <Kicker lead="·">the naked truth</Kicker>
        </div>
      </div>
    </React.Fragment>);

}

function SiteFooter({ nav }) {
  const t = useT();
  return (
    <footer className="site-foot" data-comment-anchor="ed0f928ea0-footer-75-5">
      <div className="wrap foot-top" data-comment-anchor="a38295110f-div-77-7">
        <div className="foot-brand">
          <span className="foot-wordmark" data-comment-anchor="8df72a6eb7-span-79-11">undressedsocials</span>
          <p className="foot-tagline">{TAGLINES.footer}</p>
        </div>
        <div className="foot-col" data-comment-anchor="dc6f41a04f-div-84-11">
          <span className="foot-h">{t({ en: 'contact', de: 'Kontakt' })}</span>
          <a href="mailto:linda@undressedsocials.com" data-magnetic>linda@undressedsocials.com</a>
          <a href="https://instagram.com/undressedsocials" target="_blank" rel="noopener" data-magnetic>@undressedsocials</a>
          <a href="tel:+436706590073">+43 670 6590073</a>
        </div>
        <div className="foot-col">
          <span className="foot-h">{t({ en: 'legal', de: 'Rechtliches' })}</span>
          <a href="#/impressum">Impressum</a>
          <a href="#/impressum">Datenschutz</a>
          <span className="foot-loc">Dornbirn, Austria</span>
        </div>
      </div>
      <div className="wrap foot-bar">
        <span>© 2026 undressed.socials &middot; Linda Hiller</span>
        <span className="foot-bar-tag">stay bare.</span>
      </div>
    </footer>);

}

Object.assign(window, { SiteNav, SiteFooter, LangToggle });