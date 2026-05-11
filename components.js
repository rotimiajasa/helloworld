// Shared Pinnacle components — Logo, Header, Footer, ProductCard, etc.
const {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} = React;

// ---- Logo (inline SVG version of the brand mark) ----
function PinnacleLogoMark({
  size = 36
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    fill: "none",
    "aria-label": "Pinnacle"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "pinGrad",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#6B2BB8"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#1E5BC6"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#4FB14A"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "44",
    stroke: "url(#pinGrad)",
    strokeWidth: "3",
    fill: "none",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M28 50 Q22 38, 32 30 Q42 38, 36 50 Z",
    fill: "#4FB14A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M28 58 Q20 50, 28 40 Q38 48, 32 58 Z",
    fill: "#7FC851",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40 52 L55 38 L70 52 L70 68 L40 68 Z",
    fill: "none",
    stroke: "#6B2BB8",
    strokeWidth: "3.5",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "51",
    y: "46",
    width: "8",
    height: "8",
    fill: "#6B2BB8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "59",
    y1: "46",
    x2: "59",
    y2: "54",
    stroke: "#faf7f2",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "51",
    y1: "50",
    x2: "59",
    y2: "50",
    stroke: "#faf7f2",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "62",
    cy: "62",
    r: "3",
    fill: "#1E5BC6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M62 65 Q56 70, 56 76 L68 76 Q68 70, 62 65 Z",
    fill: "#1E5BC6"
  }));
}
function PinnacleWordmark({
  height = 32
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(PinnacleLogoMark, {
    size: height + 6
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--serif)',
      fontWeight: 600,
      fontSize: height * 0.78,
      letterSpacing: '0.04em',
      color: 'var(--ink)'
    }
  }, "PINNACLE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--sans)',
      fontWeight: 600,
      fontSize: height * 0.26,
      letterSpacing: '0.18em',
      color: 'var(--gold-deep)',
      marginTop: 2
    }
  }, "HOME OF WELLNESS")));
}

// ---- Header ----
function Header({
  route,
  navigate,
  cartCount,
  openChat,
  openCart
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
  }, [route]);
  const links = [{
    id: 'home',
    label: 'Home'
  }, {
    id: 'shop',
    label: 'Shop'
  }, {
    id: 'services',
    label: 'Services'
  }, {
    id: 'journal',
    label: 'Journal'
  }, {
    id: 'about',
    label: 'About'
  }, {
    id: 'membership',
    label: 'Premium'
  }, {
    id: 'contact',
    label: 'Contact'
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ticker"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ticker-track"
  }, /*#__PURE__*/React.createElement("span", null, "\u2726 Free shipping on orders over $80"), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Premium members save 15% \u2014 every order"), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "New: Deep Calm Magnesium"), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Live well. Look well. Be well."), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "\u2726 Free shipping on orders over $80"), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "Premium members save 15% \u2014 every order"))), /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: scrolled ? 'rgba(250,247,242,0.92)' : 'var(--paper)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: '1px solid ' + (scrolled ? 'var(--line)' : 'transparent'),
      transition: 'all 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container header-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '18px 32px',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("nav", {
    className: "nav-desktop",
    style: {
      display: 'flex',
      gap: 28,
      alignItems: 'center'
    }
  }, links.slice(0, 3).map(l => /*#__PURE__*/React.createElement("a", {
    key: l.id,
    className: 'nav-link' + (route === l.id ? ' active' : ''),
    onClick: () => navigate(l.id)
  }, l.label))), /*#__PURE__*/React.createElement("button", {
    className: "nav-mobile-toggle",
    onClick: () => setMobileOpen(o => !o),
    "aria-label": "Open menu",
    style: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 8,
      display: 'none',
      alignItems: 'center',
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, mobileOpen ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("a", {
    onClick: () => navigate('home'),
    style: {
      cursor: 'pointer',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(PinnacleWordmark, {
    height: 28
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("nav", {
    className: "nav-desktop",
    style: {
      display: 'flex',
      gap: 24,
      alignItems: 'center'
    }
  }, links.slice(3).map(l => /*#__PURE__*/React.createElement("a", {
    key: l.id,
    className: 'nav-link' + (route === l.id ? ' active' : ''),
    onClick: () => navigate(l.id)
  }, l.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 18,
      background: 'var(--line)'
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: openChat,
    title: "Ask Pinnacle AI",
    style: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: openCart,
    title: "Cart",
    style: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 6,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 10a4 4 0 01-8 0"
  })), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -2,
      right: -4,
      background: 'var(--gold)',
      color: 'var(--ink)',
      fontSize: 9,
      fontWeight: 700,
      width: 16,
      height: 16,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, cartCount)))), mobileOpen && /*#__PURE__*/React.createElement("nav", {
    className: "nav-mobile-panel",
    style: {
      background: 'var(--paper)',
      borderTop: '1px solid var(--line)',
      padding: '20px 0 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.id,
    onClick: () => {
      navigate(l.id);
      setMobileOpen(false);
    },
    className: 'nav-link' + (route === l.id ? ' active' : ''),
    style: {
      padding: '14px 4px',
      borderBottom: '1px solid var(--line-soft)',
      fontSize: 15,
      letterSpacing: '0.04em'
    }
  }, l.label))))));
}

// ---- Footer ----
function Footer({
  navigate
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ink)',
      color: 'var(--paper)',
      padding: '80px 0 40px',
      marginTop: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1.2fr',
      gap: 48,
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(PinnacleLogoMark, {
    size: 42
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--serif)',
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: '0.03em'
    }
  }, "PINNACLE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      letterSpacing: '0.2em',
      color: 'var(--gold)',
      marginTop: 3
    }
  }, "HOME OF WELLNESS"))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: '#b8b1a3',
      maxWidth: 320,
      lineHeight: 1.7
    }
  }, "Live well. Look well. Be well. A trusted home for holistic health, beauty, and lifestyle transformation \u2014 built by Mercy Ikpe."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      fontSize: 11,
      letterSpacing: '0.18em',
      color: 'var(--gold)',
      textTransform: 'uppercase'
    }
  }, "pinnacleorg.com")), [{
    title: 'Shop',
    items: [{
      label: 'All Products',
      go: 'shop'
    }, {
      label: 'Supplements',
      go: 'shop'
    }, {
      label: 'Skincare',
      go: 'shop'
    }, {
      label: '1:1 Coaching',
      go: 'shop'
    }]
  }, {
    title: 'Learn',
    items: [{
      label: 'The Journal',
      go: 'journal'
    }, {
      label: 'Our Story',
      go: 'about'
    }, {
      label: 'Premium Circle',
      go: 'membership'
    }, {
      label: 'Pinnacle AI',
      go: 'home'
    }]
  }, {
    title: 'Help',
    items: [{
      label: 'Contact',
      go: 'contact'
    }, {
      label: 'Shipping',
      go: 'contact'
    }, {
      label: 'Returns',
      go: 'contact'
    }, {
      label: 'FAQ',
      go: 'contact'
    }]
  }].map(col => /*#__PURE__*/React.createElement("div", {
    key: col.title
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--sans)',
      fontSize: 11,
      letterSpacing: '0.22em',
      color: 'var(--gold)',
      textTransform: 'uppercase',
      marginBottom: 18,
      fontWeight: 700
    }
  }, col.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, col.items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.label,
    onClick: () => navigate(it.go),
    style: {
      color: '#d8d2c4',
      fontSize: 14,
      textDecoration: 'none',
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--gold)',
    onMouseLeave: e => e.currentTarget.style.color = '#d8d2c4'
  }, it.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--sans)',
      fontSize: 11,
      letterSpacing: '0.22em',
      color: 'var(--gold)',
      textTransform: 'uppercase',
      marginBottom: 18,
      fontWeight: 700
    }
  }, "Stay close"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: '#b8b1a3',
      marginBottom: 16,
      lineHeight: 1.6
    }
  }, "Weekly wellness rituals. No spam, ever."), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      alert('Subscribed ✦');
    },
    style: {
      display: 'flex',
      borderBottom: '1px solid var(--gold)',
      paddingBottom: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "your@email.com",
    required: true,
    style: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      color: 'var(--paper)',
      fontSize: 13,
      outline: 'none',
      padding: '6px 0'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    style: {
      background: 'transparent',
      border: 'none',
      color: 'var(--gold)',
      cursor: 'pointer',
      fontSize: 11,
      letterSpacing: '0.18em',
      fontWeight: 700
    }
  }, "JOIN \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: 'flex',
      gap: 14
    }
  }, [{
    label: 'Instagram',
    href: 'https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=r4fqyp',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "18",
      height: "18",
      rx: "5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "4"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "17.5",
      cy: "6.5",
      r: "0.6",
      fill: "currentColor"
    }))
  }, {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/175xgqmDme/',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.7H7.8V14h2.7v8h3z"
    }))
  }, {
    label: 'WhatsApp',
    href: 'https://whatsapp.com/channel/0029VaBYfWH4dTnJfhJD1T3k',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.5-.3-.5.3-.5.8-1.5.1-.2.1-.3 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2 3.1 4.9 4.4 1.8.8 2.5.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.5.8 3.2 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z m0 18.3c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.2.8.9-3.1-.2-.3c-.9-1.4-1.3-3-1.3-4.6 0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.7 8.6-8.1 8.6z"
    }))
  }].map(s => /*#__PURE__*/React.createElement("a", {
    key: s.label,
    href: s.href,
    target: "_blank",
    rel: "noopener",
    "aria-label": s.label,
    title: s.label,
    style: {
      width: 38,
      height: 38,
      border: '1px solid #4a443a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--paper)',
      textDecoration: 'none',
      borderRadius: '50%',
      transition: 'all .2s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--gold)';
      e.currentTarget.style.color = 'var(--gold)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = '#4a443a';
      e.currentTarget.style.color = 'var(--paper)';
    }
  }, s.icon))))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 32,
      borderTop: '1px solid #2d2820',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      color: '#7a7468',
      letterSpacing: '0.06em'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Pinnacle Org. All rights reserved."), /*#__PURE__*/React.createElement("span", null, "Made with intention in Lagos \xB7 London"))));
}

// ---- Product image ----
function ProductImage({
  product,
  ratio = '4/5'
}) {
  // Real product image — render with soft branded backdrop
  if (product.image) {
    const hueBg = {
      rose: 'linear-gradient(160deg, #f9ece2 0%, #efd6c4 100%)',
      lavender: 'linear-gradient(160deg, #ebe6f3 0%, #d8cee8 100%)',
      sage: 'linear-gradient(160deg, #e8eee0 0%, #d4dec4 100%)',
      amber: 'linear-gradient(160deg, #f7ead0 0%, #ecd5a3 100%)',
      cream: 'linear-gradient(160deg, #f6efe1 0%, #e8d9bf 100%)',
      gold: 'linear-gradient(160deg, #f9ecc8 0%, #ecd394 100%)',
      plum: 'linear-gradient(160deg, #ecdbe7 0%, #d6bcd5 100%)'
    }[product.hue] || 'linear-gradient(160deg, #f3ede2 0%, #ede4d3 100%)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        aspectRatio: ratio,
        position: 'relative',
        overflow: 'hidden',
        background: hueBg
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 14,
        border: '1px solid rgba(255,255,255,0.45)'
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: product.image,
      alt: product.name,
      loading: "lazy",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        padding: '8%',
        mixBlendMode: 'multiply'
      }
    }), product.brand && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 18,
        right: 18,
        fontFamily: 'var(--sans)',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.18em',
        color: 'rgba(26,24,20,0.55)',
        textTransform: 'uppercase',
        background: 'rgba(255,255,255,0.7)',
        padding: '4px 8px'
      }
    }, "by ", product.brand));
  }

  // Each product hue gets a unique illustrated placeholder
  const hueMap = {
    rose: {
      bg: 'linear-gradient(160deg, #f5dccd 0%, #e8b8a0 100%)',
      accent: '#a85a3a',
      shape: 'bottle'
    },
    lavender: {
      bg: 'linear-gradient(160deg, #d8d0e8 0%, #b5a8d0 100%)',
      accent: '#5a4a8a',
      shape: 'jar'
    },
    sage: {
      bg: 'linear-gradient(160deg, #d8e3cc 0%, #b8c9a3 100%)',
      accent: '#4a6238',
      shape: 'bottle'
    },
    amber: {
      bg: 'linear-gradient(160deg, #f0d8a3 0%, #d8b56a 100%)',
      accent: '#8a6a25',
      shape: 'dropper'
    },
    cream: {
      bg: 'linear-gradient(160deg, #f0e6d3 0%, #d8c8a8 100%)',
      accent: '#8a7548',
      shape: 'jar'
    },
    gold: {
      bg: 'linear-gradient(160deg, #f3e3b8 0%, #d8b96a 100%)',
      accent: '#6a5025',
      shape: 'card'
    },
    plum: {
      bg: 'linear-gradient(160deg, #d8c0d8 0%, #a888b8 100%)',
      accent: '#5a3a6a',
      shape: 'card'
    }
  };
  const h = hueMap[product.hue] || hueMap.cream;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      aspectRatio: ratio,
      background: h.bg,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 16,
      border: '1px solid rgba(255,255,255,0.4)'
    }
  }), /*#__PURE__*/React.createElement(ProductIllustration, {
    shape: h.shape,
    accent: h.accent,
    name: product.name
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 22,
      left: 22,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 11,
      color: h.accent,
      letterSpacing: '0.04em'
    }
  }, "Pinnacle \xB7 est. 2023"));
}
function ProductIllustration({
  shape,
  accent,
  name
}) {
  // SVG silhouette — bottle / jar / dropper / card
  const initials = name.split(' ').filter(w => /[A-Z]/.test(w[0])).slice(0, 2).map(w => w[0]).join('');
  if (shape === 'bottle') {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 200 260",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: `bot-${accent}`,
      x1: "0%",
      y1: "0%",
      x2: "0%",
      y2: "100%"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0%",
      stopColor: accent,
      stopOpacity: "0.95"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "100%",
      stopColor: accent,
      stopOpacity: "0.7"
    }))), /*#__PURE__*/React.createElement("rect", {
      x: "86",
      y: "40",
      width: "28",
      height: "22",
      fill: accent,
      opacity: "0.9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M70 70 L130 70 L138 110 L138 220 Q138 232 126 232 L74 232 Q62 232 62 220 L62 110 Z",
      fill: `url(#bot-${accent})`
    }), /*#__PURE__*/React.createElement("rect", {
      x: "70",
      y: "130",
      width: "60",
      height: "70",
      fill: "#faf7f2",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("text", {
      x: "100",
      y: "155",
      textAnchor: "middle",
      fontFamily: "Cormorant Garamond",
      fontSize: "11",
      fontStyle: "italic",
      fill: accent
    }, "Pinnacle"), /*#__PURE__*/React.createElement("text", {
      x: "100",
      y: "178",
      textAnchor: "middle",
      fontFamily: "Manrope",
      fontSize: "22",
      fontWeight: "700",
      fill: accent
    }, initials), /*#__PURE__*/React.createElement("line", {
      x1: "78",
      y1: "190",
      x2: "122",
      y2: "190",
      stroke: accent,
      strokeWidth: "0.5"
    }), /*#__PURE__*/React.createElement("text", {
      x: "100",
      y: "200",
      textAnchor: "middle",
      fontFamily: "Manrope",
      fontSize: "6",
      letterSpacing: "2",
      fill: accent
    }, "WELLNESS"));
  }
  if (shape === 'jar') {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 200 260",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: "100",
      cy: "80",
      rx: "60",
      ry: "10",
      fill: accent,
      opacity: "0.9"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "40",
      y: "80",
      width: "120",
      height: "20",
      fill: accent,
      opacity: "0.9"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "44",
      y: "100",
      width: "112",
      height: "130",
      fill: accent,
      opacity: "0.85",
      rx: "2"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "56",
      y: "130",
      width: "88",
      height: "74",
      fill: "#faf7f2",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("text", {
      x: "100",
      y: "158",
      textAnchor: "middle",
      fontFamily: "Cormorant Garamond",
      fontSize: "11",
      fontStyle: "italic",
      fill: accent
    }, "Pinnacle"), /*#__PURE__*/React.createElement("text", {
      x: "100",
      y: "184",
      textAnchor: "middle",
      fontFamily: "Manrope",
      fontSize: "24",
      fontWeight: "700",
      fill: accent
    }, initials), /*#__PURE__*/React.createElement("text", {
      x: "100",
      y: "198",
      textAnchor: "middle",
      fontFamily: "Manrope",
      fontSize: "5",
      letterSpacing: "2",
      fill: accent
    }, "HOME OF WELLNESS"));
  }
  if (shape === 'dropper') {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 200 260",
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: "84",
      y: "30",
      width: "32",
      height: "14",
      fill: accent,
      opacity: "0.9",
      rx: "2"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "80",
      y: "44",
      width: "40",
      height: "8",
      fill: accent,
      opacity: "0.7"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "60",
      y: "52",
      width: "80",
      height: "180",
      fill: accent,
      opacity: "0.9",
      rx: "6"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "72",
      y: "100",
      width: "56",
      height: "100",
      fill: "#faf7f2",
      opacity: "0.95"
    }), /*#__PURE__*/React.createElement("text", {
      x: "100",
      y: "128",
      textAnchor: "middle",
      fontFamily: "Cormorant Garamond",
      fontSize: "9",
      fontStyle: "italic",
      fill: accent
    }, "Pinnacle"), /*#__PURE__*/React.createElement("text", {
      x: "100",
      y: "155",
      textAnchor: "middle",
      fontFamily: "Manrope",
      fontSize: "20",
      fontWeight: "700",
      fill: accent
    }, initials), /*#__PURE__*/React.createElement("line", {
      x1: "80",
      y1: "165",
      x2: "120",
      y2: "165",
      stroke: accent,
      strokeWidth: "0.5"
    }), /*#__PURE__*/React.createElement("text", {
      x: "100",
      y: "178",
      textAnchor: "middle",
      fontFamily: "Manrope",
      fontSize: "5",
      letterSpacing: "2",
      fill: accent
    }, "SERUM 30ML"), /*#__PURE__*/React.createElement("text", {
      x: "100",
      y: "190",
      textAnchor: "middle",
      fontFamily: "Manrope",
      fontSize: "4",
      letterSpacing: "1",
      fill: accent
    }, "VITAMIN C"));
  }
  // card
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 260",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "40",
    y: "60",
    width: "120",
    height: "160",
    fill: "#faf7f2",
    stroke: accent,
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "50",
    y: "70",
    width: "100",
    height: "140",
    fill: "none",
    stroke: accent,
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: "100",
    y: "120",
    textAnchor: "middle",
    fontFamily: "Cormorant Garamond",
    fontSize: "14",
    fontStyle: "italic",
    fill: accent
  }, "Pinnacle"), /*#__PURE__*/React.createElement("text", {
    x: "100",
    y: "155",
    textAnchor: "middle",
    fontFamily: "Manrope",
    fontSize: "32",
    fontWeight: "700",
    fill: accent
  }, initials), /*#__PURE__*/React.createElement("line", {
    x1: "70",
    y1: "170",
    x2: "130",
    y2: "170",
    stroke: accent,
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: "100",
    y: "185",
    textAnchor: "middle",
    fontFamily: "Manrope",
    fontSize: "6",
    letterSpacing: "3",
    fill: accent
  }, "EXCLUSIVE"));
}

// ---- Product card ----
function ProductCard({
  product,
  onClick,
  currency,
  addToCart
}) {
  const price = currency === 'USD' ? `$${product.priceUSD}` : `₦${(product.priceNGN || Math.round(product.priceUSD * window.PINNACLE_DATA.exchangeRate)).toLocaleString()}`;
  const compare = product.compareUSD && (currency === 'USD' ? `$${product.compareUSD}` : `₦${Math.round(product.compareUSD * window.PINNACLE_DATA.exchangeRate).toLocaleString()}`);
  return /*#__PURE__*/React.createElement("div", {
    className: "product-card",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "img-wrap",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(ProductImage, {
    product: product
  }), product.badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      background: product.badge === 'Bestseller' ? 'var(--gold)' : product.badge === 'New' ? 'var(--ink)' : 'white',
      color: product.badge === 'New' ? 'var(--paper)' : 'var(--ink)',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.18em',
      padding: '6px 10px',
      textTransform: 'uppercase'
    }
  }, product.badge), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      addToCart(product);
    },
    style: {
      position: 'absolute',
      bottom: 16,
      left: 16,
      right: 16,
      background: 'rgba(26,24,20,0.92)',
      color: 'var(--paper)',
      border: 'none',
      padding: '12px',
      cursor: 'pointer',
      fontSize: 11,
      letterSpacing: '0.2em',
      fontWeight: 600,
      textTransform: 'uppercase',
      opacity: 0,
      transition: 'opacity 0.3s'
    },
    onMouseEnter: e => e.currentTarget.style.opacity = '1',
    className: "quick-add"
  }, "+ Quick Add")), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 16,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      fontSize: 9,
      marginBottom: 6
    }
  }, product.collection.toUpperCase()), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      fontSize: 20,
      marginBottom: 4,
      lineHeight: 1.2
    }
  }, product.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--ink-mute)',
      marginBottom: 10,
      fontStyle: 'italic',
      fontFamily: 'var(--serif)'
    }
  }, product.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      fontFamily: 'var(--serif)'
    }
  }, price), compare && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)',
      textDecoration: 'line-through'
    }
  }, compare))), /*#__PURE__*/React.createElement("style", null, `
        .product-card:hover .quick-add { opacity: 1 !important; }
      `));
}

// ---- Stars ----
function Stars({
  rating,
  size = 12
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 2,
      color: 'var(--gold)'
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("svg", {
    key: i,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: i <= Math.round(rating) ? 'currentColor' : 'none',
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
  }))));
}

// Section heading helper
function SectionHead({
  eyebrow,
  title,
  kicker,
  center,
  light
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: center ? 'center' : 'left',
      marginBottom: 48
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 14,
      color: light ? 'var(--gold)' : undefined
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 'clamp(36px, 5vw, 64px)',
      color: light ? 'var(--paper)' : 'var(--ink)',
      maxWidth: center ? 900 : 'unset',
      margin: center ? '0 auto' : '0'
    }
  }, title), kicker && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 20,
      fontSize: 16,
      lineHeight: 1.6,
      color: light ? '#c8c2b4' : 'var(--ink-mute)',
      maxWidth: 620,
      margin: center ? '20px auto 0' : '20px 0 0',
      fontFamily: 'var(--serif)',
      fontStyle: 'italic'
    }
  }, kicker));
}
Object.assign(window, {
  PinnacleLogoMark,
  PinnacleWordmark,
  Header,
  Footer,
  ProductImage,
  ProductCard,
  Stars,
  SectionHead
});