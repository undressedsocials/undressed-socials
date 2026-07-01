/* ============================================================
   undressed.socials — FX engine
   cherry cursor · magnetic buttons · parallax · plate wipe
   one rAF loop; reads DOM every frame so it picks up new
   route content automatically. all effects gate on props.
   ============================================================ */
const { useEffect: useFxE, useRef: useFxR, useState: useFxS } = React;

/* A placeholder image "plate" with a left→right wipe reveal on scroll.
   Swap the inner <img> in once real photography arrives. */
function Plate({ tag = '', label = 'image', ratio = '4 / 3', src, parallax, nowipe, className = '', style }) {
  const ref = useFxR(null);
  const [shown, setShown] = useFxS(false);
  useFxE(() => {
    if (window.__revealOff) {setShown(true);return;}
    const el = ref.current;if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {if (e.isIntersecting) {setShown(true);io.unobserve(el);}});
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    const fb = setTimeout(() => {setShown(true);io.disconnect();}, 1400);
    return () => {io.disconnect();clearTimeout(fb);};
  }, []);
  return (
    <div ref={ref} className={'plate ' + (shown ? 'in ' : '') + (nowipe ? 'nowipe ' : '') + className}
    style={{ aspectRatio: ratio, ...style }}
    data-parallax={parallax}>
      {src ?
      <img src={src} alt={label} loading="lazy" decoding="async" /> :
      <div className="plate-mid"><span className="label-caps">{label}</span></div>}
      {tag && <span className="plate-tag">{tag}</span>}
    </div>);

}

function Fx({ cursor, magnetic, parallax, intensity = 50 }) {
  const curRef = useFxR(null);
  const railRef = useFxR(null);

  useEffect(() => {window.__fxIntensity = intensity;}, [intensity]);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover)').matches && window.innerWidth > 900;
    const useCursor = !!cursor && fine;
    document.body.classList.toggle('cur-on', useCursor);

    let x = window.innerWidth / 2,y = window.innerHeight / 2;
    let cx = x,cy = y,raf = 0;
    let hot = false,down = false,overChrome = false;
    const el = curRef.current;
    const k = () => (window.__fxIntensity ?? 50) / 50;

    const onMove = (e) => {
      x = e.clientX;y = e.clientY;
      const t = e.target;
      overChrome = !!(t.closest && t.closest('[data-omelette-chrome]'));
      hot = !!(t.closest && t.closest('a,button,[data-magnetic],.svc-link,.work-card,summary,input,textarea')) && !overChrome;
    };
    const onDown = () => {down = true;};
    const onUp = () => {down = false;};

    const applyMagnetic = () => {
      if (!magnetic) return;
      const list = document.querySelectorAll('[data-magnetic]');
      list.forEach((m) => {
        const r = m.getBoundingClientRect();
        if (!r.width) return;
        const mx = r.left + r.width / 2,my = r.top + r.height / 2;
        const dx = x - mx,dy = y - my;
        const dist = Math.hypot(dx, dy);
        const R = Math.max(r.width * 0.9, 130);
        if (dist < R) {
          const f = (1 - dist / R) * 0.32 * k();
          m.style.transform = `translate(${(dx * f).toFixed(1)}px,${(dy * f).toFixed(1)}px)`;
          const inner = m.querySelector('[data-magnetic-inner]');
          if (inner) { const g = f * 0.5; inner.style.transform = `translate(${(dx * g).toFixed(1)}px,${(dy * g).toFixed(1)}px)`; }
        } else if (m.style.transform) {
          m.style.transform = '';
          const inner = m.querySelector('[data-magnetic-inner]');
          if (inner) inner.style.transform = '';
        }
      });
    };

    const applyParallax = () => {
      if (!parallax) return;
      const vh = window.innerHeight;
      document.querySelectorAll('[data-parallax]').forEach((p) => {
        const sp = parseFloat(p.dataset.parallax);
        if (!sp) return;
        const r = p.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const off = (center - vh / 2) / vh; // ~ -1 .. 1
        p.style.transform = `translate3d(0, ${(-off * sp * 110 * k()).toFixed(1)}px, 0)`;
      });
    };

    // ---- global scroll tracking (always on; respects reduced-motion) ----
    const railEl = railRef.current;
    let lastY = window.scrollY, vel = 0;
    const motionOk = !window.__revealOff &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const applyScroll = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const prog = Math.min(1, Math.max(0, y / max));
      if (railEl) railEl.style.transform = 'scaleX(' + prog.toFixed(4) + ')';
      if (!motionOk) return;
      // smoothed scroll velocity → tiny kinetic skew on tagged display type
      vel += (((y - lastY)) - vel) * 0.18; lastY = y;
      const skew = Math.max(-2.4, Math.min(2.4, vel * 0.05));
      const vh = window.innerHeight;
      document.querySelectorAll('[data-scroll]').forEach((s) => {
        const r = s.getBoundingClientRect();
        // 0 as it enters the bottom → 1 as it leaves the top
        const p = (vh - r.top) / (vh + r.height);
        s.style.setProperty('--sp', Math.min(1, Math.max(0, p)).toFixed(3));
      });
      document.querySelectorAll('[data-scroll-skew]').forEach((s) => {
        s.style.transform = 'skewY(' + skew.toFixed(2) + 'deg)';
      });
      // scroll-velocity reactive type: skews + vertically stretches with scroll
      // speed, settling back to rest as the velocity decays (Codrops "velocity").
      const velo = Math.max(-1, Math.min(1, vel * 0.05));
      document.querySelectorAll('[data-scroll-velo]').forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.bottom < -240 || r.top > vh + 240) return;
        s.style.transform = 'skewY(' + (velo * 6).toFixed(2) + 'deg) scaleY(' + (1 + Math.abs(velo) * 0.16).toFixed(3) + ')';
      });
      // process steps: only the one nearest the focus line is "in focus"
      const steps = document.querySelectorAll('.proc-step');
      if (steps.length) {
        const line = vh * 0.46;
        let best = -1, bestD = Infinity;
        steps.forEach((s, i) => {
          const r = s.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - line);
          if (d < bestD) { bestD = d; best = i; }
        });
        steps.forEach((s, i) => s.classList.toggle('is-focus', i === best));
      }
    };

    const loop = () => {
      cx += (x - cx) * 0.22;cy += (y - cy) * 0.22;
      if (useCursor && el) {
        const s = down ? 0.7 : hot ? 1.8 : 1;
        el.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px) scale(${s})`;
        el.classList.toggle('hidden', overChrome);
        if (!el.classList.contains('live')) el.classList.add('live');
      }
      applyMagnetic();
      applyParallax();
      applyScroll();
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.body.classList.remove('cur-on');
      if (el) el.classList.remove('live');
      // clear any transforms we set
      document.querySelectorAll('[data-magnetic],[data-parallax]').forEach((n) => {n.style.transform = '';});
      document.querySelectorAll('[data-scroll-skew]').forEach((n) => {n.style.transform = '';});
      document.querySelectorAll('[data-scroll-velo]').forEach((n) => {n.style.transform = '';});
    };
  }, [cursor, magnetic, parallax]);

  // persistent letter-tint: once a glyph is hovered it KEEPS the accent colour
  useEffect(() => {
    const onOver = (e) => {
      const tgt = e.target;
      if (!tgt || !tgt.closest) return;
      const ch = tgt.closest('.ch');
      if (ch && ch.closest('.splithover')) ch.classList.add('lit');
    };
    document.addEventListener('mouseover', onOver, { passive: true });
    return () => document.removeEventListener('mouseover', onOver);
  }, []);

  // global scroll fade-in: every top-level content block on every page eases up
  // into view once. skips elements that already animate themselves (.reveal) and
  // pinned layers. re-scans on route changes via a MutationObserver.
  useEffect(() => {
    if (window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('r-seen'); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    const skip = (el) => el.classList.contains('reveal') || el.closest('.pin-jack-sticky') || el.classList.contains('r-up') || el.classList.contains('lh-stage');
    const scan = () => {
      document.querySelectorAll('.band .wrap > *').forEach((el) => {
        if (skip(el)) return;
        el.classList.add('r-up'); io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return (
    <React.Fragment>
      <div className="scroll-rail" ref={railRef} aria-hidden="true"></div>
      <div ref={curRef} className="cherry-cursor" aria-hidden="true"><CherryMark size="30px" /></div>
    </React.Fragment>);

}

/* ZoomReveal — a pinned image that scales from a centred, inset frame up to
   full-screen as you scroll past, then releases into the next section.
   Falls back to a static contained image when motion is off / reduced. */
function ZoomReveal({ src, label, cap, kicker, head, flat }) {
  const stageRef = useFxR(null);
  const frameRef = useFxR(null);
  const darkRef = useFxR(null);
  const introRef = useFxR(null);
  useFxE(() => {
    const stage = stageRef.current,frame = frameRef.current;
    if (!stage || !frame) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let sMax = 1;
    const measure = () => {
      const w = frame.offsetWidth,h = frame.offsetHeight;
      if (w && h) sMax = Math.max(window.innerWidth / w, window.innerHeight / h);
    };
    const onScroll = () => {
      if (window.__revealOff) {frame.style.transform = '';return;}
      const rect = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      frame.style.transform = 'scale(' + (1 + p * (sMax - 1)).toFixed(3) + ')';
      if (darkRef.current) darkRef.current.style.opacity = (Math.max(0, (p - 0.35) / 0.65) * 0.6).toFixed(3);
      if (introRef.current) {
        const ip = Math.min(1, Math.max(0, (p - 0.55) / 0.35));
        introRef.current.style.opacity = ip.toFixed(3);
        introRef.current.style.transform = 'translateY(' + ((1 - ip) * 30).toFixed(1) + 'px)';
      }
    };
    const onResize = () => {measure();onScroll();};
    measure();onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return (
    <section className="zoom-stage bleed" ref={stageRef}>
      <div className="zoom-sticky">
        <div className={'zoom-frame' + (flat ? ' zoom-flat' : '')} ref={frameRef}>
          {!flat && <img src={src} alt={label || ''} loading="lazy" decoding="async" />}
          <div className="zoom-dark" ref={darkRef}></div>
        </div>
        {cap && <div className="zoom-cap">{cap}</div>}
        {head &&
        <div className="zoom-intro" ref={introRef}>
            <div className="wrap">
              {kicker && <Kicker lead="·">{kicker}</Kicker>}
              <h2 className="h-sec">{head}</h2>
            </div>
          </div>
        }
      </div>
    </section>);

}

Object.assign(window, { Plate, Fx, ZoomReveal });

/* StripReveal — image-free "undressing" hand-off. a sticky stage where solid
   horizontal bars (in the text colour) cover the section, then slide away
   alternately left/right as you scroll — literally undressing the surface to
   reveal the kicker + headline underneath. used for "get undressed." on home.
   reduced-motion / anim-off: bars hidden, headline shown plainly. */
function StripReveal({ kicker, head, bars = 7 }) {
  const stageRef = useFxR(null);
  const barsRef = useFxR(null);
  const contentRef = useFxR(null);
  useFxE(() => {
    const stage = stageRef.current,barsEl = barsRef.current,content = contentRef.current;
    if (!stage || !barsEl) return;
    if (window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const strips = Array.from(barsEl.children);
    const onScroll = () => {
      const total = stage.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / total)) : 0;
      strips.forEach((bar, i) => {
        // each bar leaves a touch later than the one above → a peeling cascade
        const start = i * 0.055;
        const lp = Math.min(1, Math.max(0, (p - start) / (0.6 - start * 0.4)));
        const eased = 1 - Math.pow(1 - lp, 3);
        const dir = i % 2 ? 1 : -1;
        bar.style.transform = `translateX(${(dir * eased * 118).toFixed(1)}%)`;
      });
      if (content) {
        const cp = Math.min(1, Math.max(0, (p - 0.32) / 0.4));
        content.style.opacity = cp.toFixed(2);
        content.style.transform = `translateY(${((1 - cp) * 26).toFixed(1)}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section className="strip-stage bleed" ref={stageRef}>
      <div className="strip-sticky">
        <div className="wrap strip-content" ref={contentRef}>
          {kicker && <Kicker lead="·">{kicker}</Kicker>}
          <h2 className="h-sec strip-word">{head}</h2>
        </div>
        <div className="strip-bars" ref={barsRef} aria-hidden="true">
          {Array.from({ length: bars }).map((_, i) =>
          <span className="strip-bar" key={i} style={{ top: i * 100 / bars + '%', height: 100 / bars + 0.4 + '%' }}></span>
          )}
        </div>
      </div>
    </section>);

}

Object.assign(window, { Plate, Fx, ZoomReveal, StripReveal });

/* FillReveal — image-free "get undressed" hand-off. a sticky stage where a giant
   outlined word fills in with colour letter-by-letter as you scroll (the truth,
   revealed). kicker + a line under it fade in. reduced-motion: shown filled. */
function FillReveal({ kicker, pre, word, sub, subAnchor, children }) {
  const stageRef = useFxR(null);
  const headRef = useFxR(null);
  const subRef = useFxR(null);
  const letters = Array.from(word);
  useFxE(() => {
    const stage = stageRef.current,head = headRef.current,subEl = subRef.current;
    if (!stage || !head) return;
    const chars = head.querySelectorAll('.fr-ch');
    if (window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      chars.forEach((c) => c.classList.add('on'));
      if (subEl) subEl.style.opacity = 1;
      return;
    }
    const onScroll = () => {
      // drive the letter-fill over the first stretch of scrolling into the stage,
      // while the head stays pinned (sticky) and the packages scroll up beneath it
      const top = stage.getBoundingClientRect().top;
      const span = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -top / span));
      const k = Math.round(Math.min(1, p / 0.7) * chars.length);
      chars.forEach((c, i) => c.classList.toggle('on', i < k));
      if (subEl) {
        subEl.style.opacity = 1;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <section className="fill-stage" ref={stageRef}>
      <div className="fill-pin" data-comment-anchor="d5677d3c00-div-290-9">
        {kicker && <Kicker lead="·">{kicker}</Kicker>}
        <h2 className="h-sec fill-head" ref={headRef}>
          {pre ? <span className="fr-pre">{pre} </span> : null}
          {letters.map((ch, i) =>
          <span className="fr-ch" key={i}>{ch === ' ' ? '\u00a0' : ch}</span>
          )}
        </h2>
        {sub && <ScrollFadeText className="fill-sub" anchor={subAnchor}>{sub}</ScrollFadeText>}
      </div>
      {children && <div className="fill-flow">{children}</div>}
    </section>);

}

Object.assign(window, { Plate, Fx, ZoomReveal, StripReveal, FillReveal });

/* ChannelsPath — all the channels we play, strung together along a curved SVG
   path; the text slides along the curve as you scroll past (olivier-larose style).
   reduced-motion / anim-off → static centred string. */
function ChannelsPath({ items, repeat = 3 }) {
  const wrapRef = useFxR(null);
  const textRef = useFxR(null);
  const sep = '  \u2022  ';
  const phrase = items.join(sep);
  const run = (phrase + sep).repeat(repeat) + phrase;
  useFxE(() => {
    const wrap = wrapRef.current, txt = textRef.current;
    if (!wrap || !txt) return;
    if (window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      txt.setAttribute('startOffset', '50%');
      txt.style.textAnchor = 'middle';
      return;
    }
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as it enters bottom → 1 as it leaves top
      const p = (vh - r.top) / (vh + r.height);
      const off = -28 + p * 56; // slide the string left↔right along the path
      txt.setAttribute('startOffset', off.toFixed(2) + '%');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="chpath bleed" ref={wrapRef} aria-label={items.join(', ')}>
      <svg className="chpath-svg" viewBox="0 0 1000 220" preserveAspectRatio="xMidYMid meet">
        <defs>
          <path id="chArc" fill="none" d="M -40 196 Q 500 36 1040 196" />
        </defs>
        <text className="chpath-text">
          <textPath href="#chArc" startOffset="50%" ref={textRef}>{run}</textPath>
        </text>
      </svg>
    </div>
  );
}

Object.assign(window, { Plate, Fx, ZoomReveal, StripReveal, FillReveal, ChannelsPath });

/* ScrollFadeText — olivier-larose "gradient scroll opacity": words start dim and
   brighten to full as they rise through the viewport. recurses into nested
   elements (e.g. <em class="accent">) so accents keep their styling. */
function fadeWords(node, bag) {
  if (node == null || node === false) return node;
  if (typeof node === 'string' || typeof node === 'number') {
    const parts = String(node).split(/(\s+)/);
    return parts.map((part, i) => {
      if (part === '' || /^\s+$/.test(part)) return part;
      const idx = bag.n++;
      return <span className="sft-w" data-i={idx} key={'w' + idx + '-' + i}>{part}</span>;
    });
  }
  if (Array.isArray(node)) return node.map((c, i) => fadeWords(c, bag));
  if (React.isValidElement(node)) {
    return React.cloneElement(node, { key: node.key || 'e' + bag.n }, fadeWords(node.props.children, bag));
  }
  return node;
}
function ScrollFadeText({ children, className = '', style, anchor, as: Tag = 'p' }) {
  const ref = useFxR(null);
  const bag = { n: 0 };
  const content = fadeWords(children, bag);
  useFxE(() => {
    const el = ref.current; if (!el) return;
    const words = el.querySelectorAll('.sft-w');
    if (window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => { w.style.opacity = 1; });
      return;
    }
    const onScroll = () => {
      const vh = window.innerHeight;
      const start = vh * 0.86;   // word enters dim here
      const end = vh * 0.40;     // fully lit here
      words.forEach((w) => {
        const r = w.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const p = (start - mid) / (start - end);
        w.style.opacity = Math.max(0.16, Math.min(1, p)).toFixed(3);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const id = setTimeout(onScroll, 60);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(id); };
  }, []);
  return <Tag ref={ref} className={'sft ' + className} style={style} data-comment-anchor={anchor}>{content}</Tag>;
}

/* MaskStatement — olivier-larose "text mask" reveal. each word of the opener
   sits in an overflow-clip slot and slides up from behind the mask, staggered,
   when the block scrolls into view; the body slides + fades right after.
   reduced-motion / anim-off → shown plainly. */
function MaskStatement({ open, body, className = '' }) {
  const ref = useFxR(null);
  useFxE(() => {
    const el = ref.current; if (!el) return;
    if (window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('in'); return;
    }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = String(open).split(' ');
  const bodyDelay = words.length * 55 + 90;
  return (
    <p className={'bigstatement flow mask-st ' + className} ref={ref}>
      <span className="bs-open">
        {words.map((w, i) => (
          <span className="mw" key={i}>
            <span className="mw-in" style={{ transitionDelay: (i * 55) + 'ms' }}>{w + '\u00a0'}</span>
          </span>
        ))}
      </span>
      <span className="mask-body" style={{ transitionDelay: bodyDelay + 'ms' }}>{body}</span>
    </p>
  );
}

Object.assign(window, { Plate, Fx, ZoomReveal, StripReveal, FillReveal, ChannelsPath, ScrollFadeText, MaskStatement });

/* MaskHeading — GSAP-style word-mask reveal for a heading: each word sits in an
   overflow-clip slot and slides up from behind the mask, staggered, when the
   heading scrolls into view. reduced-motion / anim-off → shown plainly. */
function MaskHeading({ text, className = '', anchor, as: Tag = 'h2' }) {
  const ref = useFxR(null);
  useFxE(() => {
    const el = ref.current; if (!el) return;
    if (window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('in'); return;
    }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); } });
    }, { threshold: 0.2, rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = String(text).split(' ');
  return (
    <Tag className={'mask-st mask-head ' + className} ref={ref} data-comment-anchor={anchor}>
      {words.map((w, i) => (
        <span className="mw" key={i}>
          <span className="mw-in" style={{ transitionDelay: (i * 80) + 'ms' }}>{w + '\u00a0'}</span>
        </span>
      ))}
    </Tag>
  );
}

Object.assign(window, { MaskHeading });

/* HeroJack — the hero pins while you scroll; the full statement reveals word by
   word driven by PIN PROGRESS (not viewport, since pinned content doesn't move),
   the CTAs stay put, then the page releases on to the next section. */
function HeroJack({ opener, children, cta }) {
  const stageRef = useFxR(null);
  const paraRef = useFxR(null);
  const bag = { n: 0 };
  const content = (
    <React.Fragment>
      <span className="bs-open">{fadeWords(opener + ' ', bag)}</span>
      {fadeWords(children, bag)}
    </React.Fragment>
  );
  useFxE(() => {
    const stage = stageRef.current, para = paraRef.current;
    if (!stage || !para) return;
    const words = para.querySelectorAll('.sft-w');
    if (window.__revealOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => { w.style.opacity = 1; });
      return;
    }
    const onScroll = () => {
      const total = stage.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / total)) : 0;
      const reach = Math.min(1, p / 0.82) * words.length;
      words.forEach((w, i) => { w.style.opacity = (i < reach ? 1 : 0.16).toFixed(2); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="hero-jack" ref={stageRef}>
      <header className="band hero bigstate hero-pin" data-comment-anchor="df868533cd-header-48-7">
        <div className="wrap">
          <p className="bigstatement" ref={paraRef}>{content}</p>
          <div className="hero-cta" style={{ marginTop: 'var(--gap-5)' }}>{cta}</div>
        </div>
      </header>
    </div>
  );
}

Object.assign(window, { HeroJack });

/* ChannelApps — the channels we play as magnetic app-icon tiles. each tile opts
   into the existing [data-magnetic] system (cursor pull), and the glyph inside
   counter-moves slightly for the olivier-larose magnetic-button feel.
   Glyphs are simple original monochrome marks (not exact platform trademarks). */
const CH_GLYPHS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4v10.5a3.5 3.5 0 1 1-3.2-3.48" />
      <path d="M13 4c.4 2.6 2 4.2 4.6 4.5" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
      <path d="M6.6 10.4v7" />
      <path d="M11 17.4v-4a2.6 2.6 0 0 1 5.2 0v4" />
      <path d="M11 10.4v7" />
    </svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.4 20.5l2-7.2" />
      <path d="M8.6 11.6a3.5 3.5 0 1 1 5.4 3.2c-1.7 1-3.6.1-3.9-1.2" />
      <circle cx="12" cy="12" r="8.4" />
    </svg>
  ),
};
function ChannelApps({ items }) {
  return (
    <div className="ch-apps">
      {items.map((n, i) => (
        <Reveal as="a" href={'#/the-process/ch-' + n} key={n} delay={i * 80} className="ch-app" data-magnetic>
          <span className="ch-app-tile"><span className="ch-app-glyph" data-magnetic-inner>{CH_GLYPHS[n] || null}</span></span>
          <span className="ch-app-name">{n}</span>
        </Reveal>
      ))}
    </div>
  );
}

Object.assign(window, { Plate, Fx, ZoomReveal, StripReveal, FillReveal, ChannelsPath, ScrollFadeText, ChannelApps });

/* DisperseText — olivier-larose "text disperse": each letter scatters away from
   the cursor (with a little rotation), then springs back when the mouse leaves.
   pointer-only; reduced-motion / touch → plain heading. */
function DisperseText({ text, children, className = '', as: Tag = 'h1' }) {
  const ref = useFxR(null);
  const letters = Array.from(text != null ? String(text) : String(children));
  useFxE(() => {
    const el = ref.current; if (!el) return;
    const fine = window.matchMedia('(hover: hover)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !window.__revealOff;
    if (!fine) return;
    const chars = Array.from(el.querySelectorAll('.dt-ch'));
    const seeds = chars.map(() => ({ ang: Math.random() * Math.PI * 2, rot: (Math.random() * 2 - 1) * 28 }));
    let mx = -9999, my = -9999, raf = 0, active = false;
    const R = 130;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; if (!active) { active = true; loop(); } };
    const onLeave = () => { mx = -9999; my = -9999; };
    const loop = () => {
      let moving = false;
      chars.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = cx - mx, dy = cy - my;
        const dist = Math.hypot(dx, dy);
        let tx = 0, ty = 0, rot = 0;
        if (dist < R) {
          const f = (1 - dist / R);
          const push = f * 46;
          tx = (dx / (dist || 1)) * push;
          ty = (dy / (dist || 1)) * push;
          rot = seeds[i].rot * f;
        }
        const prev = c.__cur || { x: 0, y: 0, r: 0 };
        const nx = prev.x + (tx - prev.x) * 0.18;
        const ny = prev.y + (ty - prev.y) * 0.18;
        const nr = prev.r + (rot - prev.r) * 0.18;
        c.__cur = { x: nx, y: ny, r: nr };
        if (Math.abs(nx) > 0.1 || Math.abs(ny) > 0.1 || Math.abs(nr) > 0.1) moving = true;
        c.style.transform = `translate(${nx.toFixed(1)}px,${ny.toFixed(1)}px) rotate(${nr.toFixed(1)}deg)`;
      });
      if (moving || mx > -9000) { raf = requestAnimationFrame(loop); }
      else { active = false; }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);
  return (
    <Tag className={'disperse ' + className} ref={ref}>
      {letters.map((ch, i) => (
        <span className="dt-ch" key={i}>{ch === ' ' ? '\u00a0' : ch}</span>
      ))}
    </Tag>
  );
}

Object.assign(window, { Plate, Fx, ZoomReveal, StripReveal, FillReveal, ChannelsPath, ScrollFadeText, ChannelApps, DisperseText });

/* IntroHero — landing loader. olive field + a big Gluten tagline (or wordmark)
   + a minimal loading bar. at 100% the chrome fades in. then the scroll
   choreography, in three beats:
     1) the cherry+wordmark lockup drifts right while the wordmark fades out,
        leaving the cherry centred;
     2) the cherry grows to fill the screen;
     3) the cherry dissolves and the next section is revealed.
   Plays once per page load (window.__introSeen); skipped when motion is off. */
function IntroHero() {
  const stageRef = useFxR(null);
  const lockRef = useFxR(null);
  const cherryRef = useFxR(null);
  const wordRef = useFxR(null);
  const subRef = useFxR(null);
  const [pct, setPct] = useFxS(0);
  const [loaded, setLoaded] = useFxS(false);

  // add the chrome-hiding class before first paint to avoid a nav flash
  React.useLayoutEffect(() => {
    document.body.classList.add('intro-on');
  }, []);

  // loading bar fill + scroll lock
  useFxE(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    const dur = 1800;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      // ease-out so the bar eases into 100
      const eased = 1 - Math.pow(1 - p, 1.8);
      setPct(Math.round(eased * 100));
      if (p < 1) {raf = requestAnimationFrame(tick);} else
      {
        setLoaded(true);
        window.__introSeen = true;
        document.body.style.overflow = '';
        document.body.classList.remove('intro-on');
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      document.body.classList.remove('intro-on');
    };
  }, []);

  // three-beat scroll choreography
  useFxE(() => {
    if (!loaded) return;
    const stage = stageRef.current,lock = lockRef.current,cherry = cherryRef.current,
      word = wordRef.current,sub = subRef.current;
    if (!stage || !lock || !cherry) return;
    const clamp01 = (x) => Math.min(1, Math.max(0, x));
    // shift centres the cherry+wordmark GROUP at rest; beat 1 drives it to where
    // the cherry is centred, then the wordmark is dropped and the cherry grows.
    let shift = 0,baseH = 200,maxH = 800;
    const measure = () => {
      cherry.style.height = ''; // read the CSS base height
      baseH = cherry.offsetHeight || 200;
      if (word) word.style.display = '';
      const ml = parseFloat(getComputedStyle(word).marginLeft) || 0;
      shift = ((word ? word.offsetWidth : 0) + ml) / 2;
      maxH = Math.max(baseH * 3, window.innerHeight * 1.2);
    };
    const onScroll = () => {
      const total = stage.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp01(window.scrollY / total) : 0;
      const p1 = clamp01((p - 0.05) / 0.30); // hold, then separate + word out
      const p2 = clamp01((p - 0.35) / 0.35); // beat 2: cherry grows
      const p3 = clamp01((p - 0.70) / 0.30); // beat 3: cherry dissolves
      if (p1 < 1) {
        // group drifts right until the cherry sits dead centre; wordmark fades
        if (word) {word.style.display = '';word.style.opacity = (1 - clamp01(p1 * 1.35)).toFixed(2);}
        lock.style.transform = `translate(calc(-50% + ${(p1 * shift).toFixed(1)}px), -50%)`;
      } else {
        // wordmark gone — the cherry alone re-centres (seamless) and is free to grow
        if (word) word.style.display = 'none';
        lock.style.transform = 'translate(-50%, -50%)';
      }
      // grow via height so the SVG re-rasterises crisply at every size
      cherry.style.height = (baseH + p2 * (maxH - baseH)).toFixed(1) + 'px';
      cherry.style.opacity = (1 - p3).toFixed(2);
      if (sub) sub.style.opacity = (1 - clamp01(p1 * 1.5)).toFixed(2);
    };
    const onResize = () => {measure();onScroll();};
    measure();onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [loaded]);

  return (
    <section className="intro-stage" ref={stageRef}>
      <div className="intro-sticky">
        <div className="intro-lockup" ref={lockRef}>
          <img className="intro-cherry" ref={cherryRef} src={window.__resources.introCherry} alt="" />
          <img className="intro-word" ref={wordRef} src={window.__resources.introWord} alt="undressed.socials" />
        </div>
        <p className="intro-subline" ref={subRef}>
          scroll to see how we do <em>social media</em>.
        </p>
        <div className={'intro-load' + (loaded ? ' done' : '')}>
          <div className="intro-toprow">
            <img className="intro-mark-sm" src={window.__resources.introMarkSm} alt="undressed.socials" />
            <span>{('00' + pct).slice(-3)} %</span>
          </div>
          <div className="intro-track"><div className="intro-fill" style={{ transform: 'scaleX(' + pct / 100 + ')' }}></div></div>
        </div>
      </div>
    </section>);

}

Object.assign(window, { Plate, Fx, ZoomReveal, IntroHero });

/* MiniIntro — the SHORT return-to-home splash. once the full loader has played
   (window.__introSeen), coming back to home shows just the undressedsocials
   lockup for a beat, then fades away. no loading bar, no scroll-lock. */
function MiniIntro() {
  const [phase, setPhase] = useFxS('pre'); // pre → in → out → done
  useFxE(() => {
    document.body.classList.add('intro-on');
    const r = requestAnimationFrame(() => setPhase('in'));
    const t1 = setTimeout(() => setPhase('out'), 1000);
    const t2 = setTimeout(() => {setPhase('done');document.body.classList.remove('intro-on');}, 1600);
    return () => {
      cancelAnimationFrame(r);clearTimeout(t1);clearTimeout(t2);
      document.body.classList.remove('intro-on');
    };
  }, []);
  if (phase === 'done') return null;
  return (
    <div className={'mini-intro ' + phase} aria-hidden="true">
      <div className="mini-lockup">
        <img className="mini-cherry" src={window.__resources.introCherry} alt="" />
        <img className="mini-word" src={window.__resources.introWord} alt="undressed.socials" />
      </div>
    </div>);

}

Object.assign(window, { Plate, Fx, ZoomReveal, IntroHero, MiniIntro });