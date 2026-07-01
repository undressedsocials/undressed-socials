/* ============================================================
   undressed.socials — shared primitives
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* The cherry mark — real two-berry geometry, tints via currentColor */
function CherryMark({ size = '1em', style, className = '' }) {
  return (
    <svg
      className={'cherry-mark ' + className}
      viewBox="0 0 152 187"
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <path d="M60.1646 97.9903C63.7198 78.4367 72.1634 64.6603 85.4954 56.6611" stroke="currentColor" strokeWidth="7.9992" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M92.1616 100.657C88.6064 81.1031 86.3844 66.4379 85.4956 56.6611" stroke="currentColor" strokeWidth="7.9992" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M85.4956 56.6606C95.2724 47.7726 104.16 45.995 112.16 51.3278C105.938 60.2158 97.05 62.4378 85.4956 57.9938" fill="currentColor" />
      <path d="M60.1648 135.32C70.4731 135.32 78.8296 126.963 78.8296 116.655C78.8296 106.347 70.4731 97.9902 60.1648 97.9902C49.8565 97.9902 41.5 106.347 41.5 116.655C41.5 126.963 49.8565 135.32 60.1648 135.32Z" fill="currentColor" />
      <path d="M92.1614 137.986C102.47 137.986 110.826 129.629 110.826 119.321C110.826 109.013 102.47 100.656 92.1614 100.656C81.8531 100.656 73.4966 109.013 73.4966 119.321C73.4966 129.629 81.8531 137.986 92.1614 137.986Z" fill="currentColor" />
    </svg>
  );
}

/* Spaced-caps kicker label, optional leading/trailing arrow */
function Kicker({ children, lead, trail, style }) {
  return (
    <div className="kicker" style={style}>
      {lead && <span className="arr">{lead}</span>}
      <span>{children}</span>
      {trail && <span className="arr">{trail}</span>}
    </div>
  );
}

/* Button — outline (default) or solid; inverts on hover via CSS */
function Button({ children, solid, lg, onClick, type = 'button', style, className = '', ...rest }) {
  return (
    <button
      type={type}
      className={'btn' + (solid ? ' solid' : '') + (lg ? ' lg' : '') + (className ? ' ' + className : '')}
      onClick={onClick}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}

/* Reveal-on-scroll wrapper — the "undressing" gesture.
   Honours a global intensity flag (window.__revealOff). */
function Reveal({ children, as: Tag = 'div', delay = 0, eager = false, className = '', style, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (window.__revealOff) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    // already in view on mount (e.g. above-the-fold after a page switch) →
    // reveal promptly so navigation never lands on a blank screen.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      const id = setTimeout(() => setShown(true), Math.min(delay, 220));
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          io.unobserve(el);
        }
      });
      // eager: fire as soon as the element nears the fold (earlier fade-in)
    }, { threshold: 0, rootMargin: eager ? '0px 0px 55% 0px' : '0px 0px -10% 0px' });
    io.observe(el);
    const fallback = setTimeout(() => { setShown(true); io.disconnect(); }, 1200);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, [delay]);
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}

Object.assign(window, { CherryMark, Kicker, Button, Reveal });

/* SplitText — wraps each character in its own <span class="ch"> so hover can
   tint single letters (words stay intact for clean line-wrapping). Recurses
   into nested elements (e.g. <em class="accent">) and preserves whitespace. */
function splitNode(node, key) {
  if (node == null || node === false) return node;
  if (typeof node === 'string' || typeof node === 'number') {
    const parts = String(node).split(/(\s+)/);
    return parts.map((part, i) => {
      if (part === '' || /^\s+$/.test(part)) return part;
      return (
        <span className="w" key={key + '-' + i}>
          {Array.from(part).map((c, j) => <span className="ch" key={j}>{c}</span>)}
        </span>
      );
    });
  }
  if (Array.isArray(node)) return node.map((n, i) => splitNode(n, key + '-' + i));
  if (React.isValidElement(node)) {
    return React.cloneElement(node, { key: node.key || key }, splitNode(node.props.children, key + 'c'));
  }
  return node;
}
function SplitText({ children }) { return <React.Fragment>{splitNode(children, 's')}</React.Fragment>; }

/* BigStatement — the signature large lead paragraph used as each page's intro.
   An italic-serif opener (the whispered accent) leads a Space-Grotesk statement;
   letters tint to the page's accent colour on hover (per-letter, not whole line).
   Use className="flow" for the slightly smaller sub-page variant. */
function BigStatement({ open, children, className = '', style }) {
  return (
    <p className={'bigstatement splithover' + (className ? ' ' + className : '')} style={style}>
      {open ? <span className="bs-open"><SplitText>{open + ' '}</SplitText></span> : null}
      <SplitText>{children}</SplitText>
    </p>
  );
}

Object.assign(window, { BigStatement, SplitText });

/* Kinetic headline — words rise + fade in with a stagger on mount.
   Base state is the VISIBLE end-state under reduced-motion / anim-off,
   so it never gets stuck hidden. Pass `lines` = array of strings. */
function Kinetic({ lines, className = '', as: Tag = 'h1', style, mark }) {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (window.__revealOff) { setPlay(true); return; }
    const id = setTimeout(() => setPlay(true), 80);
    return () => clearTimeout(id);
  }, []);
  let i = 0;
  return (
    <Tag className={'kinetic ' + (play ? 'play ' : '') + className} style={style}>
      {lines.map((line, li) => (
        <span className="kline" key={li}>
          {line.split(' ').map((w, wi) => {
            const d = i * 55; i += 1;
            const isMark = mark && w === mark;
            return (
              <React.Fragment key={wi}>
                <span className={'w' + (isMark ? ' mark' : '')} style={{ transitionDelay: d + 'ms' }}>{w}</span>{' '}
              </React.Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

Object.assign(window, { Kinetic });
