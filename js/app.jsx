/* ============================================================
   undressed.socials — app shell · hash router · lang · tweaks · fx
   home = hero + "what we do / why undressed" (long, scrollable).
   the process = the 3 steps + every package deep dive (anchored).
   one colour pair per subpage. bilingual (EN/DE).
   ============================================================ */
const { useState: useApp, useEffect: useAppE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "animations": true,
  "siteDir": "dir-4",
  "homeLayout": "stack",
  "pkgStyle": "tabs",
  "headMotion": "wipe",
  "cherryCursor": true,
  "magnetic": true,
  "parallax": true,
  "intensity": 40
} /*EDITMODE-END*/;

const ROUTE_META = {
  home: { slug: '', pair: 2, logo: 'blood', title: 'undressed.socials — social media, but different.' },
  process: { slug: 'the-process', pair: 4, logo: 'blush', title: 'the process — undressed.socials' },
  work: { slug: 'the-strip', pair: 3, logo: 'flame', title: 'the strip — undressed.socials' },
  about: { slug: 'meet-linda', pair: 3, logo: 'flame', title: 'meet linda — undressed.socials' },
  contact: { slug: 'lets-talk', pair: 1, logo: 'sun', title: 'let\u2019s talk — undressed.socials' },
  imprint: { slug: 'impressum', pair: 5, logo: 'mint', title: 'impressum' }
};
const PAIR_SURFACE = { 1: '#87000C', 2: '#C6DCFF', 3: '#FBCDE0', 4: '#58621E', 5: '#1E5B62' };
const SLUG_TO_KEY = Object.fromEntries(Object.entries(ROUTE_META).map(([k, v]) => [v.slug, k]));

function routeFromHash() {
  const raw = (window.location.hash || '').replace(/^#\/?/, '').replace(/\/$/, '');
  if (raw === 'the-process' || raw.indexOf('the-process/') === 0) {
    const slug = raw.indexOf('/') > -1 ? raw.split('/')[1] : '';
    return { key: 'process', slug };
  }
  return { key: SLUG_TO_KEY[raw] || 'home' };
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [parsed, setParsed] = useApp(routeFromHash());
  const [menuOpen, setMenuOpen] = useApp(false);
  const [lang, setLangState] = useApp(() => {
    try {return localStorage.getItem('us_lang') || 'en';} catch (e) {return 'en';}
  });
  const setLang = (l) => {setLangState(l);try {localStorage.setItem('us_lang', l);} catch (e) {}};

  useAppE(() => {
    const onHash = () => setParsed(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const meta = ROUTE_META[parsed.key] || ROUTE_META.home;

  useAppE(() => {
    document.title = meta.title;
    document.body.style.background = PAIR_SURFACE[meta.pair];
    setMenuOpen(false);
    // don't jump to top when deep-linking a package — the page scrolls to it.
    // use an INSTANT reset (not the page's smooth scroll) so a new subpage simply
    // starts at the top instead of animating the old content all the way up.
    if (!(parsed.key === 'process' && parsed.slug)) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [parsed.key, parsed.slug]);

  useAppE(() => {
    window.__revealOff = !t.animations;
    document.body.classList.toggle('anim-off', !t.animations);
  }, [t.animations]);

  useAppE(() => {
    document.body.classList.remove('hm-wipe', 'hm-rise', 'hm-fade');
    document.body.classList.add('hm-' + (t.headMotion || 'wipe'));
  }, [t.headMotion]);

  useAppE(() => {
    for (let i = 1; i <= 10; i++) document.body.classList.remove('dir-' + i);
    document.body.classList.add(t.siteDir || 'dir-1');
  }, [t.siteDir]);

  useAppE(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  // sticky-footer reveal: measure the footer and reserve that much scroll space
  // below the content, so the fixed footer is uncovered only at the very end.
  useAppE(() => {
    const f = document.querySelector('.site-foot');
    if (!f) return;
    const set = () => document.documentElement.style.setProperty('--foot-h', f.offsetHeight + 'px');
    set();
    const ro = new ResizeObserver(set);
    ro.observe(f);
    window.addEventListener('resize', set);
    return () => { ro.disconnect(); window.removeEventListener('resize', set); };
  }, [parsed.key, parsed.slug, lang]);

  const nav = (k) => {
    const slug = ROUTE_META[k] ? ROUTE_META[k].slug : '';
    window.location.hash = slug ? '#/' + slug : '#/';
  };

  let page;
  if (parsed.key === 'process') page = <ProcessPage nav={nav} focus={parsed.slug} pkgStyle={t.pkgStyle} data-comment-anchor="52b878f366-span-399-14" />;else
  if (parsed.key === 'work') page = <WorkPage nav={nav} />;else
  if (parsed.key === 'about') page = <AboutPage nav={nav} data-comment-anchor="8ac9fdec54-span-153-34" />;else
  if (parsed.key === 'contact') page = <ContactPage nav={nav} />;else
  if (parsed.key === 'imprint') page = <ImprintPage nav={nav} />;else
  page = <HomePage nav={nav} layout={t.homeLayout} />;

  const fxOn = t.animations;

  return (
    <LangCtx.Provider value={lang}>
      <div className={'site pair-' + meta.pair} key={lang}>
        <div className="site-content">
          <SiteNav route={parsed.key} logo={meta.logo} nav={nav}
          lang={lang} setLang={setLang} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          {page}
        </div>
        <SiteFooter nav={nav} />

        <Fx cursor={fxOn && t.cherryCursor} magnetic={fxOn && t.magnetic}
        parallax={fxOn && t.parallax} intensity={t.intensity} />

        <TweaksPanel>
          <TweakSection label="Design direction" data-comment-anchor="56e3caeecc-div-80-5" />
          <TweakSelect label="Direction" value={t.siteDir} options={[
          { value: 'dir-1', label: '01 · poster' },
          { value: 'dir-2', label: '02 · editorial' },
          { value: 'dir-3', label: '03 · brutalist' },
          { value: 'dir-4', label: '04 · swiss (default)' },
          { value: 'dir-5', label: '05 · maximal' },
          { value: 'dir-6', label: '06 · mono' },
          { value: 'dir-7', label: '07 · outline' },
          { value: 'dir-8', label: '08 · ledger' },
          { value: 'dir-9', label: '09 · centered' },
          { value: 'dir-10', label: '10 · zine' }]
          } onChange={(v) => setTweak('siteDir', v)} />
          <TweakSection label="Home layout" />
          <TweakSelect label="Formation" value={t.homeLayout} options={HOME_LAYOUTS}
          onChange={(v) => setTweak('homeLayout', v)} />
          <TweakRadio label="Heading motion" value={t.headMotion} options={['wipe', 'rise', 'fade']}
          onChange={(v) => setTweak('headMotion', v)} />
          <TweakSection label="Process packages" />
          <TweakRadio label="Package style" value={t.pkgStyle} options={['tabs', 'accordion']}
          onChange={(v) => setTweak('pkgStyle', v)} />
          <TweakSection label="Motion" />
          <TweakToggle label="Animations" value={t.animations} onChange={(v) => setTweak('animations', v)} />
          <TweakToggle label="Cherry cursor" value={t.cherryCursor} onChange={(v) => setTweak('cherryCursor', v)} />
          <TweakToggle label="Magnetic buttons" value={t.magnetic} onChange={(v) => setTweak('magnetic', v)} />
          <TweakToggle label="Parallax" value={t.parallax} onChange={(v) => setTweak('parallax', v)} />
          <TweakSlider label="Intensity" value={t.intensity} min={0} max={100} step={5}
          onChange={(v) => setTweak('intensity', v)} />
          <TweakSection label="Language" />
          <TweakRadio label="Language" value={lang} options={['en', 'de']} onChange={setLang} />
        </TweaksPanel>
      </div>
    </LangCtx.Provider>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);