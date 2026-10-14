/* ============================================================
   undressed.socials — scrollfx : the GSAP + Lenis motion layer
   kota-grade scroll craft: inertia scrolling, stacked panels,
   line-mask type reveals, velocity marquee, WebGL gradient field.
   Loads AFTER vendor gsap/ScrollTrigger/SplitText/lenis UMDs.
   Every piece degrades gracefully: reduced-motion / anim-off /
   missing WebGL simply render the static layout.
   ============================================================ */
const { useEffect: useSfxE, useRef: useSfxR } = React;

function sfxReduced() {
  return !!window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function sfxReady() {
  return !!(window.gsap && window.ScrollTrigger) && !sfxReduced();
}

/* ---------- boot: Lenis inertia scroll wired into ScrollTrigger ---------- */
let __sfxRegistered = false;
function ScrollFxBoot({ active = true }) {
  useSfxE(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (!__sfxRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      if (window.SplitText) gsap.registerPlugin(SplitText);
      __sfxRegistered = true;
    }
    /* trigger positions are measured in fallback fonts; re-measure once the
       real display faces (Gluten etc.) have landed. */
    let fontsDone = false;
    document.fonts.ready.then(() => {
      if (!fontsDone) { fontsDone = true; if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }
    });
    if (!active || sfxReduced() || !window.Lenis) return;
    const lenis = new Lenis({ lerp: 0.115, smoothWheel: true, wheelMultiplier: 1 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); /* restore the default we zeroed */
      lenis.destroy();
      window.__lenis = null;
    };
  }, [active]);
  return null;
}

/* ---------- MotionToggle — the visible pause switch (WCAG 2.2.2).
   Flips the same body.anim-off / __revealOff plumbing the site
   already respects everywhere. ---------- */
function MotionToggle({ on, onToggle }) {
  const t = useT();
  return (
    <button type="button" className="motion-toggle" aria-pressed={!on}
      onClick={() => onToggle(!on)}>
      {on ? t({ en: 'motion: on', de: 'Bewegung: an' }) : t({ en: 'motion: off', de: 'Bewegung: aus' })}
    </button>);
}

/* ---------- PanelStack — kota signature: rounded panels that pile up.
   Each panel is sticky (with a per-depth peek offset); as each successor
   lands, every panel already down recedes one more step — cumulative
   scale + a brand-tinted veil, so the deck visibly "deals". ---------- */
function PanelStack({ children }) {
  const ref = useSfxR(null);
  useSfxE(() => {
    const host = ref.current;
    if (!host || !sfxReady()) return;
    const panels = Array.prototype.slice.call(host.querySelectorAll(':scope > .pnl'));
    const made = [];
    const SC = 0.035, DIM = 0.14, SC_FLOOR = 0.86, DIM_CAP = 0.42;
    panels.forEach((p, k) => {
      if (k === 0) return;
      /* transition k: panel k slides over panels 0..k-1 — each of them
         steps one recede level deeper (older cards sit deeper). */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: p, start: 'top bottom', end: 'top 10%', scrub: true }
      });
      for (let j = 0; j < k; j++) {
        const before = k - 1 - j, after = k - j; // recede depth before/after this hand-off
        const veil = panels[j].querySelector('.pnl-veil');
        tl.fromTo(panels[j],
          { scale: Math.max(SC_FLOOR, 1 - SC * before) },
          { scale: Math.max(SC_FLOOR, 1 - SC * after), transformOrigin: 'center top', ease: 'none' }, 0);
        if (veil) tl.fromTo(veil,
          { autoAlpha: Math.min(DIM_CAP, DIM * before) },
          { autoAlpha: Math.min(DIM_CAP, DIM * after), ease: 'none' }, 0);
      }
      /* the incoming card's content settles after the card lands */
      const inner = p.querySelector('.pnl-in');
      if (inner) {
        made.push(gsap.from(inner, {
          y: 56, ease: 'none',
          scrollTrigger: { trigger: p, start: 'top 90%', end: 'top 30%', scrub: true }
        }));
      }
      made.push(tl);
    });
    return () => made.forEach((tl) => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill(); });
  }, []);
  return <div className="pnl-stage" ref={ref}>{children}</div>;
}

/* one stacked service panel — colour pair straight from the brand system */
function ServicePanel({ s, i }) {
  const t = useT();
  return (
    <article className={'pnl pair-' + s.pair} style={{ '--pi': i }}>
      <div className="pnl-veil" aria-hidden="true"></div>
      <div className="pnl-in">
        <div className="pnl-top">
          <span className="pnl-num">{'0' + (i + 1)}</span>
          <span className="pnl-tag">{t(s.tag)}</span>
        </div>
        <SplitLines as="h3" className="pnl-name">{s.name}</SplitLines>
        <p className="pnl-desc">{t(s.short)}</p>
        <ul className="pnl-chips">
          {s.deliv.slice(0, 4).map((d) => <li key={d}>{d}</li>)}
        </ul>
        <a className="pnl-cta" data-magnetic href={'#/the-process/' + s.slug}>{t(UI.deepDive)}</a>
      </div>
    </article>);
}

/* ---------- SplitLines — masked line-by-line type reveal (SplitText).
   Waits for fonts so the line breaks are true, re-splits on resize. ---------- */
function SplitLines({ as: Tag = 'h3', className = '', children, stagger = 0.08 }) {
  const r = useSfxR(null);
  useSfxE(() => {
    const el = r.current;
    if (!el) return;
    if (!sfxReady() || !window.SplitText) { el.style.visibility = 'visible'; return; }
    let split = null, dead = false;
    /* don't hold the text hostage if a font never resolves */
    const ready = Promise.race([document.fonts.ready, new Promise((res) => setTimeout(res, 900))]);
    ready.then(() => {
      if (dead) return;
      el.style.visibility = 'visible';
      split = SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 115, duration: 0.85, stagger, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        })
      });
    });
    return () => { dead = true; if (split) split.revert(); };
  }, []);
  const hide = sfxReady() && !!window.SplitText;
  return <Tag ref={r} className={className} style={hide ? { visibility: 'hidden' } : null}>{children}</Tag>;
}

/* ---------- VeloMarquee — infinite strip that drifts left and shears
   with your scroll velocity (signed: scrolling up pushes it back).
   Ticks only while on screen. aria-hidden: pure decoration. ---------- */
function VeloMarquee({ text, count = 4, className = '' }) {
  const wrapR = useSfxR(null);
  useSfxE(() => {
    const el = wrapR.current;
    if (!el || !sfxReady()) return;
    const track = el.querySelector('.vmq-track');
    let x = 0, skew = 0, vel = 0, half = 0, dead = false;
    const measure = () => { if (!dead) half = track.scrollWidth / 2; };
    measure();
    document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);
    const tick = (t, dtMs) => {
      if (document.body.classList.contains('anim-off')) return;
      const dt = Math.min(dtMs, 64) / 1000;
      /* sample Lenis velocity per frame — Lenis may boot after us, and its
         own lerp decays the value to rest, so no subscription is needed */
      const l = window.__lenis;
      if (l) vel = l.velocity || 0;else vel *= 0.94;
      /* base drift left; the signed velocity term pushes with the scroll */
      const push = Math.max(-620, Math.min(620, vel * 30));
      x -= (76 + push) * dt;
      if (half > 0) { x = x % half; if (x > 0) x -= half; }
      const target = Math.max(-4.5, Math.min(4.5, vel * 0.32));
      skew += (target - skew) * 0.09;
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0) skewX(' + skew.toFixed(2) + 'deg)';
    };
    /* only tick while the strip is anywhere near the viewport */
    let ticking = false;
    const setTick = (on) => {
      if (on && !ticking) { ticking = true; gsap.ticker.add(tick); }
      if (!on && ticking) { ticking = false; gsap.ticker.remove(tick); }
    };
    const io = new IntersectionObserver((es) => {
      setTick(!!(es.length && es[es.length - 1].isIntersecting));
    }, { rootMargin: '80px 0px' });
    io.observe(el);
    return () => { dead = true; setTick(false); io.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  const items = [];
  for (let i = 0; i < count * 2; i++) items.push(<span className="vmq-item" key={i}>{text}<span className="vmq-dot">·</span></span>);
  return (
    <div className={'vmq ' + className} ref={wrapR} aria-hidden="true">
      <div className="vmq-track">{items}</div>
    </div>);
}

/* ---------- GradientField — the kota-style living background.
   Tiny hand-rolled WebGL2 shader (no three.js): brand-tinted blobs
   drifting on lissajous paths, hash-dithered against banding.
   ~30fps cap, renders at half resolution, pauses offscreen and on
   hidden tabs, survives context loss. Falls back to the flat surface. ---------- */
const SFX_FRAG = [
  '#version 300 es',
  'precision highp float;',
  'uniform vec2 uRes; uniform float uT;',
  'out vec4 o;',
  'vec3 blob(vec2 uv, vec2 c, vec3 col, float r){ float d = length(uv - c); return col * exp(-(d*d)/(r*r)); }',
  'float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }',
  'void main(){',
  '  vec2 uv = gl_FragCoord.xy / uRes;',
  '  uv.x *= uRes.x / uRes.y;',
  '  vec3 base = vec3(0.776, 0.863, 1.0);',
  '  vec3 c = base;',
  '  c += blob(uv, vec2(0.30 + 0.17*sin(uT*0.21), 0.70 + 0.13*cos(uT*0.17)), vec3(1.0, 0.918, 0.949) - base, 0.46);',
  '  c += blob(uv, vec2(0.85 + 0.15*cos(uT*0.13 + 2.1), 0.28 + 0.17*sin(uT*0.19 + 1.2)), vec3(0.984, 0.804, 0.878) - base, 0.40);',
  '  c += blob(uv, vec2(0.55 + 0.22*sin(uT*0.11 + 4.0), 0.88 + 0.10*cos(uT*0.23 + 3.3)), (vec3(0.984, 0.804, 0.878) - base) * 0.6, 0.52);',
  '  c += blob(uv, vec2(0.12 + 0.10*cos(uT*0.16 + 5.2), 0.16 + 0.12*sin(uT*0.14 + 0.6)), vec3(0.529, 0.0, 0.047) - base, 0.34) * 0.22;',
  '  c += (hash(gl_FragCoord.xy) - 0.5) / 128.0;',
  '  o = vec4(c, 1.0);',
  '}'].join('\n');

function GradientField({ className = '' }) {
  const cR = useSfxR(null);
  useSfxE(() => {
    const canvas = cR.current;
    if (!canvas || sfxReduced()) return;
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, '#version 300 es\nvoid main(){ vec2 p = vec2((gl_VertexID<<1 & 2), (gl_VertexID & 2)); gl_Position = vec4(p*2.0-1.0, 0.0, 1.0); }');
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, SFX_FRAG);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uT = gl.getUniformLocation(prog, 'uT');
    let w = 0, h = 0, raf = 0, running = false, inView = true, lost = false, last = 0;
    const DPR = 0.5, FRAME_MS = 33; /* ~30fps is plenty for a slow drift */
    const size = () => {
      const bw = Math.max(2, Math.round(canvas.clientWidth * DPR));
      const bh = Math.max(2, Math.round(canvas.clientHeight * DPR));
      if (bw !== w || bh !== h) { w = bw; h = bh; canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    size();
    const t0 = performance.now();
    const frame = (now) => {
      raf = 0;
      if (!running || lost) return;
      if (now - last >= FRAME_MS) {
        last = now;
        gl.uniform2f(uRes, w, h);
        gl.uniform1f(uT, (now - t0) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      raf = requestAnimationFrame(frame);
    };
    const play = () => { if (!running && inView && !lost && !document.hidden && !document.body.classList.contains('anim-off')) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    const io = new IntersectionObserver((es) => {
      inView = !!(es.length && es[es.length - 1].isIntersecting);
      inView ? play() : stop();
    });
    io.observe(canvas);
    const onVis = () => { document.hidden ? stop() : play(); };
    document.addEventListener('visibilitychange', onVis);
    const onLost = (e) => { e.preventDefault(); lost = true; stop(); };
    const onRestored = () => { lost = false; size(); play(); };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    play();
    return () => {
      stop(); io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      /* release the GL context — browsers cap live contexts per page */
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    };
  }, []);
  return <canvas className={'gradient-field ' + className} ref={cR} aria-hidden="true" />;
}

Object.assign(window, { ScrollFxBoot, MotionToggle, PanelStack, ServicePanel, SplitLines, VeloMarquee, GradientField });
