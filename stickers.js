/* Authored vignette art for the album: one illustration per sticker, drawn on a 100×100 grid.
   The category colour is the printed ground (set by CSS); art uses ink, white and gold only. */
(() => {
  'use strict';
  const I = '#14110b'; const W = '#fff6e2'; const G = '#f2c14e';
  const svg = (body) => `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g fill="none" stroke="${I}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
  const t = (x, y, s, txt) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${s}" font-weight="800" fill="${I}" stroke="none" font-family="Outfit, system-ui, sans-serif">${txt}</text>`;
  const star = (cx, cy, r, fill = G) => {
    const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5; const rr = i % 2 ? r * 0.45 : r; p.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`); }
    return `<polygon points="${p.join(' ')}" fill="${fill}"/>`;
  };
  const flame = (x, y, s, fill = G) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 30c-11 0-19-7-19-17 0-9 7-14 9-24 6 4 9 10 9 16 3-3 4-6 4-10 7 6 16 12 16 19 0 9-8 16-19 16z" fill="${fill}"/>`;

  window.NA_ART = {
    s1: svg(`<path d="M8 56h10M4 64h12M10 72h8"/><path d="M22 66c0-6 4-10 10-10h8l9-11c3-3 7-3 9 0l6 8c5 6 11 8 17 9 5 1 7 4 7 8v4H22z" fill="${W}"/><path d="M22 74h66v6H22z" fill="${G}"/><path d="M50 50l6 4M54 46l6 4"/>`),
    s2: svg(`<rect x="12" y="54" width="25" height="30" fill="${W}"/><rect x="37" y="36" width="26" height="48" fill="${G}"/><rect x="63" y="62" width="25" height="22" fill="${W}"/>${t(50, 60, 18, '1')}${t(24.5, 74, 15, '2')}${t(75.5, 78, 13, '3')}${star(50, 22, 9)}`),
    s3: svg(`<path d="M30 8h14l10 28H40z" fill="${W}"/><path d="M70 8H56L46 36h14z" fill="${W}"/><circle cx="50" cy="62" r="25" fill="${G}"/><circle cx="50" cy="62" r="18"/>${t(50, 70, 21, '10')}`),
    s4: svg(`<path d="M50 80S20 62 20 40a15 15 0 0 1 30-6 15 15 0 0 1 30 6c0 22-30 40-30 40z" fill="${W}"/><path d="M6 54h22l6-12 8 24 6-14 5 8h41" stroke-width="4"/>`),
    s5: svg(`<path d="M50 10l32 11v23c0 21-15 36-32 46C33 80 18 65 18 44V21z" fill="${W}"/><path d="M50 66S34 56 34 45a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 11-16 21-16 21z" fill="${G}"/>`),
    s6: svg(`<rect x="16" y="20" width="68" height="62" rx="8" fill="${W}"/><path d="M16 36h68" /><path d="M16 28a8 8 0 0 1 8-8h52a8 8 0 0 1 8 8v8H16z" fill="${G}"/><path d="M32 12v14M68 12v14"/><path d="M24 50l4 4 6-7M43 50l4 4 6-7M62 50l4 4 6-7M24 68l4 4 6-7M43 68l4 4 6-7M62 68l4 4 6-7"/>`),
    s7: svg(`<path d="M36 34c-6-14 6-24 18-20"/><circle cx="38" cy="56" r="20" fill="${W}"/><path d="M50 40h34v16H56" fill="${W}"/><circle cx="38" cy="56" r="7" fill="${G}"/><path d="M90 30l6-6M92 40h6M88 20l2-8"/>`),
    s8: svg(`<circle cx="64" cy="20" r="8" fill="${W}"/><path d="M62 30l-8 22M54 52l20 24M54 52l-22 12-4 14M60 38l20 6M60 38l-22-6" stroke-width="6"/><path d="M14 86h72"/>`),
    n1: svg(`<path d="M30 48a20 20 0 0 1 40 0" fill="${G}"/><path d="M50 14v8M26 24l6 6M74 24l-6 6M16 42h8M76 42h8"/><path d="M14 50h72a36 30 0 0 1-72 0z" fill="${W}"/><path d="M40 60c4 4 16 4 20 0"/>`),
    n2: svg(`${[18, 34, 50, 66, 82].map((x, i) => `<circle cx="${x}" cy="36" r="7" fill="${i % 2 ? W : G}"/>`).join('')}<path d="M10 52h80"/>${t(50, 84, 30, '×5')}`),
    n3: svg(`<path d="M40 12h20v10l7 9v51a6 6 0 0 1-6 6H39a6 6 0 0 1-6-6V31l7-9z" fill="${W}"/><path d="M33 48h34v16H33z" fill="${G}"/><path d="M40 22h20"/><path d="M76 30c4 5 4 9 0 12M84 26c6 8 6 14 0 20" stroke-width="3"/>`),
    n4: svg(`<path d="M50 10s20 22 20 38a20 20 0 0 1-40 0c0-16 20-38 20-38z" fill="${W}"/><path d="M42 50a9 9 0 0 0 8 9"/><path d="M18 30s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12zM82 34s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z" fill="${G}"/><path d="M8 84c7 0 7-5 14-5s7 5 14 5 7-5 14-5 7 5 14 5 7-5 14-5 7 5 14 5"/>`),
    n5: svg(`<path d="M30 20v22a7 7 0 0 0 14 0V20M37 20v66" /><ellipse cx="66" cy="34" rx="10" ry="14" fill="${W}"/><path d="M66 48v38"/>${star(50, 14, 9)}<path d="M18 86h64"/>`),
    n6: svg(`<path d="M24 26h52l-7 60H31z" fill="${W}"/><rect x="34" y="50" width="13" height="13" rx="3" fill="${G}" transform="rotate(-12 40 56)"/><rect x="52" y="58" width="13" height="13" rx="3" fill="${G}" transform="rotate(10 58 64)"/><circle cx="72" cy="24" r="14" fill="${G}"/><path d="M72 10v28M58 24h28M62 14l20 20M82 14L62 34" stroke-width="2.5"/>`),
    r1: svg(`${flame(50, 50, 1.25)}${t(50, 78, 22, '3')}`),
    r2: svg(`${flame(36, 54, 0.95, W)}${flame(58, 48, 1.3)}${t(58, 76, 20, '7')}`),
    r3: svg(`<path d="M50 10c14 10 20 26 18 44l-8 10H40l-8-10c-2-18 4-34 18-44z" fill="${W}"/><circle cx="50" cy="38" r="8" fill="${G}"/><path d="M32 54l-10 14 14-2M68 54l10 14-14-2"/><path d="M42 68c0 10 8 20 8 20s8-10 8-20" fill="${G}"/>`),
    a1: svg(`<path d="M10 50l78-32-24 66-14-24z" fill="${W}"/><path d="M50 60l38-42M50 60v18l10-12" /><path d="M8 72h12M14 82h10" stroke-width="3"/>`),
    a2: svg(`<path d="M8 40h22a12 12 0 0 1 0 24H8z" fill="${W}"/><path d="M92 40H70a12 12 0 0 0 0 24h22z" fill="${W}"/><path d="M18 40v-4M26 40v-5M74 40v-5M82 40v-4"/>${star(50, 52, 12)}<path d="M50 20v8M50 76v8M36 26l4 6M64 26l-4 6" stroke-width="3"/>`),
    a3: svg(`<path d="M10 52l10-8v24l-10-8M90 52l-10-8v24l10-8" fill="${G}"/><path d="M20 40h60v32H20z" fill="${W}"/>${star(32, 56, 9)}${star(50, 56, 9)}${star(68, 56, 9)}<path d="M50 16v12M36 20l4 8M64 20l-4 8" stroke-width="3"/>`),
    a4: svg(`<path d="M16 42h14l36-20v56L30 58H16z" fill="${W}"/><path d="M30 42v16"/><path d="M24 58l6 20h10l-4-20" fill="${G}"/><path d="M76 38c5 4 5 20 0 24M84 30c9 8 9 32 0 40"/>`),
  };

  /* Enamel pin badges for ranks: a flat metal ground, ink outline, star count by rank. */
  const METAL = { bronze: '#d9915a', argent: '#c9d2de', or: '#ffc93c', platine: '#86e1ea' };
  const STARS = { bronze: 1, argent: 2, or: 3, platine: 3 };
  window.NA_BADGE = (rang, owned) => {
    const fill = owned ? METAL[rang] : 'transparent';
    const n = STARS[rang];
    const xs = n === 1 ? [50] : n === 2 ? [40, 60] : [34, 50, 66];
    const crown = rang === 'platine' ? `<path d="M34 34l6 8 10-12 10 12 6-8v14H34z" fill="${owned ? W : 'none'}"/>` : '';
    return `<svg viewBox="0 0 100 110" aria-hidden="true" focusable="false"><g stroke="${owned ? I : '#7d6c48'}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"${owned ? '' : ' stroke-dasharray="6 5"'}>
      <path d="M50 6l38 12v34c0 26-18 44-38 52C30 96 12 78 12 52V18z" fill="${fill}"/>
      ${owned ? `<path d="M50 16l28 9v27c0 20-13 34-28 41-15-7-28-21-28-41V25z" fill="none" stroke-width="2.5"/>` : ''}
      ${crown}
      ${xs.map((x) => star(x, rang === 'platine' ? 62 : 54, 8, owned ? W : 'none')).join('')}
    </g></svg>`;
  };
})();
