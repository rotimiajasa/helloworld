// Pages — Home, Shop, Product, About, Journal, Contact, Membership, Cart
const {
  useState: useStateP,
  useEffect: useEffectP,
  useMemo: useMemoP
} = React;

// =========================================================
// HOME PAGE
// =========================================================
function HomePage({
  navigate,
  addToCart,
  currency,
  openChat
}) {
  const data = window.PINNACLE_DATA;
  const featured = data.products.filter(p => p.collections.includes('bestsellers')).slice(0, 4);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '40px 0 80px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 1,
      background: 'var(--gold)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow-gold"
  }, "Issue 04 \xB7 Spring 2026")), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 'clamp(48px, 7vw, 96px)',
      marginBottom: 24
    }
  }, "Live well.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      fontWeight: 300
    }
  }, "Look"), " well.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "grad-text",
    style: {
      fontWeight: 600
    }
  }, "Be well.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 20,
      lineHeight: 1.55,
      color: 'var(--ink-soft)',
      maxWidth: 480,
      marginBottom: 36,
      fontStyle: 'italic'
    }
  }, "Holistic health, beauty and lifestyle transformation \u2014 formulated with intention, guided by Mercy Ikpe."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => navigate('shop')
  }, "Shop the Edit"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: openChat
  }, "Ask Pinnacle AI \u2726")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40
    }
  }, [{
    n: '12K+',
    l: 'Women served'
  }, {
    n: '4.9★',
    l: '1,800+ reviews'
  }, {
    n: '6 yrs',
    l: 'In practice'
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.l
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 32,
      fontWeight: 500
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-mute)',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      marginTop: 4
    }
  }, s.l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    },
    className: "fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '-20px -20px -20px 40px',
      background: 'var(--brand-gradient-soft)',
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: window.PINNACLE_ASSETS && window.PINNACLE_ASSETS.cover || "assets/mercy-cover.jpeg",
    alt: "Mercy Ikpe \u2014 Pinnacle Wellness Cover",
    style: {
      position: 'relative',
      width: '100%',
      display: 'block',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "seal",
    style: {
      position: 'absolute',
      top: -30,
      right: -30,
      zIndex: 2,
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", null, "Live", /*#__PURE__*/React.createElement("br", null), "Well", /*#__PURE__*/React.createElement("br", null), "\u2726", /*#__PURE__*/React.createElement("br", null), "2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 30,
      left: -40,
      background: 'var(--paper)',
      padding: '12px 18px',
      boxShadow: 'var(--shadow-md)',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "script",
    style: {
      fontSize: 28,
      color: 'var(--gold-deep)',
      lineHeight: 1
    }
  }, "Mercy Ikpe"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: '0.2em',
      color: 'var(--ink-mute)',
      marginTop: 2
    }
  }, "FOUNDER \xB7 WELLNESS GUIDE"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0',
      background: 'var(--paper-warm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 0
    }
  }, [{
    eyebrow: '01 — BODY',
    title: 'Nourish from within',
    body: 'Clean-formulated supplements that address what daily life actually depletes — not what trends to sell.',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
    alt: 'Fresh fruit, leafy greens and a glass of water on a marble counter'
  }, {
    eyebrow: '02 — SKIN',
    title: 'Glow with intention',
    body: 'Skincare that respects melanin, climate, and the way your skin behaves. Performance without compromise.',
    img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
    alt: 'A glowing skincare ritual — serum dropper and warm light'
  }, {
    eyebrow: '03 — SOUL',
    title: 'Live with rhythm',
    body: 'A community, a journal, and 1:1 sessions with Mercy — for the parts of wellness no bottle can fix.',
    img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=900&q=80',
    alt: 'A quiet meditation moment with candle, journal and tea'
  }].map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '40px 36px',
      borderRight: i < 2 ? '1px solid var(--line)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      aspectRatio: '4/3',
      overflow: 'hidden',
      marginBottom: 28,
      background: 'var(--line-soft)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: p.alt,
    loading: "lazy",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      filter: 'saturate(0.9)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 18
    }
  }, p.eyebrow), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      fontSize: 28,
      marginBottom: 14,
      fontStyle: 'italic',
      fontWeight: 400
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--ink-soft)'
    }
  }, p.body)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '100px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 14
    }
  }, "The Spring Edit"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 'clamp(36px, 5vw, 60px)'
    }
  }, "Most-loved by our", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "circle"))), /*#__PURE__*/React.createElement("a", {
    className: "nav-link",
    onClick: () => navigate('shop'),
    style: {
      paddingBottom: 8,
      borderBottom: '1px solid var(--ink)'
    }
  }, "Shop all \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 32
    }
  }, featured.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    product: p,
    currency: currency,
    onClick: () => navigate('product', p.id),
    addToCart: addToCart
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0',
      background: 'var(--ink)',
      color: 'var(--paper)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.18,
      background: 'var(--brand-gradient)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 18
    }
  }, "Pinnacle AI \xB7 Wellness guide"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 'clamp(36px, 5vw, 56px)',
      color: 'var(--paper)',
      marginBottom: 24
    }
  }, "A wellness expert,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--gold)'
    }
  }, "always within reach.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.65,
      color: '#c8c2b4',
      maxWidth: 520,
      marginBottom: 32
    }
  }, "Trained on Mercy's framework. Available day or night. Ask anything \u2014 from \"what should I take for stress?\" to \"what's the difference between Type I and Type II collagen?\" \u2014 and get a clear, kind answer."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-gold",
    onClick: openChat
  }, "Start a conversation \u2726")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(201,169,97,0.3)',
      padding: 28,
      backdropFilter: 'blur(8px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.08)',
      padding: '12px 16px',
      fontSize: 14,
      alignSelf: 'flex-end',
      maxWidth: '85%'
    }
  }, "I sleep terribly and my skin keeps breaking out. Help."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      color: 'var(--ink)',
      padding: '12px 16px',
      fontSize: 14,
      alignSelf: 'flex-start',
      maxWidth: '90%'
    }
  }, "Those two things are talking to each other \u2726 Cortisol from poor sleep drives breakouts. I'd start with our ", /*#__PURE__*/React.createElement("strong", null, "Deep Calm Magnesium"), " 30 min before bed, and add the ", /*#__PURE__*/React.createElement("strong", null, "Velvet Glow Vitamin C Serum"), " in the morning to fade what's already there..."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  })))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '120px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      display: 'grid',
      gridTemplateColumns: '0.85fr 1.15fr',
      gap: 80,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '-18px -18px 18px 18px',
      border: '1px solid var(--gold)',
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/mercy-portrait.jpeg",
    alt: "Mercy Ikpe \u2014 Founder of Pinnacle Home of Wellness",
    style: {
      position: 'relative',
      width: '100%',
      display: 'block',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 1,
      aspectRatio: '4/5',
      objectFit: 'cover',
      objectPosition: 'center 20%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 24,
      left: 24,
      background: 'var(--paper)',
      padding: '14px 22px',
      boxShadow: 'var(--shadow-md)',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "script",
    style: {
      fontSize: 26,
      color: 'var(--gold-deep)',
      lineHeight: 1
    }
  }, "Mercy Ikpe"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: '0.2em',
      color: 'var(--ink-mute)',
      marginTop: 4
    }
  }, "FOUNDER \xB7 WELLNESS GUIDE"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "script",
    style: {
      fontSize: 56,
      color: 'var(--gold-deep)',
      lineHeight: 1,
      marginBottom: 4
    }
  }, "\u2726"), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontSize: 'clamp(26px, 3vw, 38px)',
      fontStyle: 'italic',
      fontWeight: 400,
      lineHeight: 1.35,
      marginBottom: 32,
      color: 'var(--ink)'
    }
  }, "\"I built Pinnacle because every woman deserves a wellness practice that fits her real life \u2014 not a stranger's. We are not selling products. We are sharing rituals.\""), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--ink-mute)',
      marginBottom: 24
    }
  }, "FOUNDER \xB7 PINNACLE HOME OF WELLNESS"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate('about')
  }, "Read her story")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0',
      background: 'var(--paper-warm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Real women \xB7 Real results",
    title: "Words from the Circle",
    center: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 32
    }
  }, data.testimonials.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'white',
      padding: 36,
      border: '1px solid var(--line-soft)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 64,
      color: 'var(--gold)',
      lineHeight: 0.6,
      marginBottom: 12
    }
  }, "\""), /*#__PURE__*/React.createElement(Stars, {
    rating: 5,
    size: 14
  }), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontSize: 19,
      lineHeight: 1.5,
      fontStyle: 'italic',
      color: 'var(--ink-soft)',
      margin: '20px 0 28px'
    }
  }, t.quote), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--line)',
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 17,
      fontWeight: 600
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-mute)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginTop: 4
    }
  }, t.location, " \xB7 ", t.role))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '100px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 14
    }
  }, "The Journal"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 'clamp(36px, 5vw, 56px)'
    }
  }, "Daily wellness, ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "uncomplicated"))), /*#__PURE__*/React.createElement("a", {
    className: "nav-link",
    onClick: () => navigate('journal'),
    style: {
      paddingBottom: 8,
      borderBottom: '1px solid var(--ink)'
    }
  }, "Read more \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 36
    }
  }, data.posts.map(post => /*#__PURE__*/React.createElement("article", {
    key: post.id,
    style: {
      cursor: 'pointer'
    },
    onClick: () => navigate('journal')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/3',
      marginBottom: 20,
      overflow: 'hidden',
      background: 'var(--line-soft)'
    }
  }, post.image ? /*#__PURE__*/React.createElement("img", {
    src: post.image,
    alt: post.title,
    loading: "lazy",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "placeholder grad",
    style: {
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 18,
      fontStyle: 'italic',
      position: 'relative',
      zIndex: 1
    }
  }, post.category))), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 12
    }
  }, post.category, " \xB7 ", post.readTime), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      fontSize: 24,
      marginBottom: 12,
      lineHeight: 1.25
    }
  }, post.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--ink-mute)',
      lineHeight: 1.6,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic'
    }
  }, post.excerpt)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '100px 0',
      background: 'var(--ink)',
      color: 'var(--paper)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -100,
      right: -100,
      width: 400,
      height: 400,
      background: 'radial-gradient(circle, rgba(201,169,97,0.15), transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "container-narrow",
    style: {
      textAlign: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 20
    }
  }, "The Pinnacle Circle"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 'clamp(40px, 6vw, 72px)',
      marginBottom: 28,
      color: 'var(--paper)'
    }
  }, "For women who are", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--gold)'
    }
  }, "serious"), " about themselves."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.65,
      color: '#c8c2b4',
      maxWidth: 580,
      margin: '0 auto 40px'
    }
  }, "Premium membership. 15% off every order, monthly group call with Mercy, members-only product drops, and a private community of women on the same path."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-gold",
    onClick: () => navigate('membership')
  }, "Join the Circle \u2014 $29/mo"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: () => navigate('membership'),
    style: {
      color: 'var(--paper)',
      borderColor: 'var(--paper)'
    }
  }, "What's included")))));
}

// =========================================================
// SHOP PAGE
// =========================================================
function ShopPage({
  navigate,
  addToCart,
  currency
}) {
  const data = window.PINNACLE_DATA;
  const [filter, setFilter] = useStateP('all');
  const [sort, setSort] = useStateP('featured');
  const filtered = useMemoP(() => {
    let list = filter === 'all' ? data.products : data.products.filter(p => p.collections.includes(filter));
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.priceUSD - b.priceUSD);else if (sort === 'price-desc') list = [...list].sort((a, b) => b.priceUSD - a.priceUSD);else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [filter, sort]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '60px 0 40px',
      background: 'var(--paper-warm)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-narrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 18
    }
  }, "The Shop"), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 'clamp(48px, 7vw, 88px)',
      marginBottom: 20
    }
  }, "Wellness, ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "curated")), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontSize: 18,
      fontStyle: 'italic',
      color: 'var(--ink-mute)',
      maxWidth: 520,
      margin: '0 auto'
    }
  }, "Every product hand-selected by Mercy. Clean ingredients, third-party tested, and formulated for the way real women live."))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '40px 0',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, data.collections.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setFilter(c.id),
    className: 'pill' + (filter === c.id ? ' active' : '')
  }, c.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      fontSize: 10
    }
  }, "Sort by"), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value),
    style: {
      border: '1px solid var(--line)',
      padding: '8px 12px',
      fontFamily: 'var(--sans)',
      fontSize: 12,
      background: 'white',
      outline: 'none',
      letterSpacing: '0.05em'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "featured"
  }, "Featured"), /*#__PURE__*/React.createElement("option", {
    value: "rating"
  }, "Top Rated"), /*#__PURE__*/React.createElement("option", {
    value: "price-asc"
  }, "Price: Low \u2192 High"), /*#__PURE__*/React.createElement("option", {
    value: "price-desc"
  }, "Price: High \u2192 Low"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '64px 0 100px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24,
      fontSize: 12,
      color: 'var(--ink-mute)',
      letterSpacing: '0.1em'
    }
  }, "Showing ", filtered.length, " ", filtered.length === 1 ? 'product' : 'products'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 36,
      rowGap: 56
    }
  }, filtered.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    product: p,
    currency: currency,
    onClick: () => navigate('product', p.id),
    addToCart: addToCart
  }))))));
}

// =========================================================
// PRODUCT DETAIL
// =========================================================
function ProductPage({
  productId,
  navigate,
  addToCart,
  currency,
  openChat
}) {
  const data = window.PINNACLE_DATA;
  const product = data.products.find(p => p.id === productId);
  const [qty, setQty] = useStateP(1);
  const [tab, setTab] = useStateP('overview');
  if (!product) return /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      padding: '120px 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "serif",
    style: {
      fontSize: 32
    }
  }, "Product not found"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: () => navigate('shop'),
    style: {
      marginTop: 24
    }
  }, "Back to shop"));
  const price = currency === 'USD' ? `$${product.priceUSD}` : `₦${(product.priceNGN || Math.round(product.priceUSD * data.exchangeRate)).toLocaleString()}`;
  const compare = product.compareUSD && (currency === 'USD' ? `$${product.compareUSD}` : `₦${Math.round(product.compareUSD * data.exchangeRate).toLocaleString()}`);
  const related = data.products.filter(p => p.collection === product.collection && p.id !== product.id).slice(0, 4);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      padding: '32px 32px 0',
      fontSize: 12,
      color: 'var(--ink-mute)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => navigate('home'),
    style: {
      cursor: 'pointer',
      color: 'inherit'
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 8px'
    }
  }, "/"), /*#__PURE__*/React.createElement("a", {
    onClick: () => navigate('shop'),
    style: {
      cursor: 'pointer',
      color: 'inherit'
    }
  }, "Shop"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 8px'
    }
  }, "/"), /*#__PURE__*/React.createElement("span", null, product.name)), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '40px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 80,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(ProductImage, {
    product: product,
    ratio: "1/1"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      aspectRatio: '1/1',
      cursor: 'pointer',
      opacity: i === 0 ? 1 : 0.65
    }
  }, /*#__PURE__*/React.createElement(ProductImage, {
    product: product
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 110
    }
  }, product.badge && /*#__PURE__*/React.createElement("div", {
    className: "badge",
    style: {
      marginBottom: 16
    }
  }, "\u2726 ", product.badge), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 12
    }
  }, product.collection), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 48,
      marginBottom: 12
    }
  }, product.name), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontSize: 18,
      fontStyle: 'italic',
      color: 'var(--ink-mute)',
      marginBottom: 20
    }
  }, product.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(Stars, {
    rating: product.rating,
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)'
    }
  }, product.rating, " \xB7 ", product.reviews, " reviews")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 36,
      fontWeight: 500
    }
  }, price), compare && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      color: 'var(--ink-mute)',
      textDecoration: 'line-through'
    }
  }, compare), product.compareUSD && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--success)',
      fontWeight: 700,
      letterSpacing: '0.16em'
    }
  }, "SAVE ", Math.round((product.compareUSD - product.priceUSD) / product.compareUSD * 100), "%")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--ink-soft)',
      marginBottom: 36
    }
  }, product.shortDesc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(Math.max(1, qty - 1)),
    style: {
      width: 44,
      height: 52,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: 18
    }
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 32,
      textAlign: 'center',
      fontFamily: 'var(--serif)',
      fontSize: 18
    }
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(qty + 1),
    style: {
      width: 44,
      height: 52,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: 18
    }
  }, "+")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      flex: 1,
      padding: '14px 28px'
    },
    onClick: () => {
      for (let i = 0; i < qty; i++) addToCart(product);
    }
  }, "Add to Cart \u2014 ", price)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-grad",
    style: {
      width: '100%',
      marginBottom: 24
    },
    onClick: () => {
      for (let i = 0; i < qty; i++) addToCart(product);
      navigate('cart');
    }
  }, "Buy Now \u2726"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      padding: '20px 0',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)'
    }
  }, [{
    icon: '✦',
    t: 'Free shipping',
    s: 'Orders over $80'
  }, {
    icon: '⟳',
    t: '30-day returns',
    s: 'No questions asked'
  }, {
    icon: '◇',
    t: '3rd-party tested',
    s: 'For purity & potency'
  }, {
    icon: '✿',
    t: 'Premium 15% off',
    s: 'Always, every order'
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.t,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-deep)',
      fontSize: 16
    }
  }, p.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, p.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-mute)'
    }
  }, p.s))))), /*#__PURE__*/React.createElement("button", {
    onClick: openChat,
    style: {
      marginTop: 24,
      width: '100%',
      background: 'var(--paper-warm)',
      border: '1px solid var(--gold-soft)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '0.18em',
      color: 'var(--gold-deep)',
      fontWeight: 700,
      marginBottom: 4
    }
  }, "NOT SURE IF IT'S RIGHT FOR YOU?"), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 15,
      fontStyle: 'italic'
    }
  }, "Ask Pinnacle AI \u2014 get a personalized recommendation")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\u2192"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '60px 0',
      background: 'var(--paper-warm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      marginBottom: 48,
      borderBottom: '1px solid var(--line)'
    }
  }, [['overview', 'Benefits'], ['ingredients', 'Ingredients'], ['directions', 'How to use']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setTab(k),
    style: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '12px 0',
      fontFamily: 'var(--serif)',
      fontSize: 22,
      fontStyle: tab === k ? 'normal' : 'italic',
      fontWeight: tab === k ? 600 : 400,
      color: tab === k ? 'var(--ink)' : 'var(--ink-mute)',
      borderBottom: tab === k ? '2px solid var(--gold)' : '2px solid transparent',
      marginBottom: -1
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80
    }
  }, /*#__PURE__*/React.createElement("div", null, tab === 'overview' && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, product.benefits.map((b, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 28,
      color: 'var(--gold-deep)',
      lineHeight: 1,
      fontStyle: 'italic'
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      lineHeight: 1.6,
      paddingTop: 4
    }
  }, b)))), tab === 'ingredients' && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.8,
      fontFamily: 'var(--serif)'
    }
  }, product.ingredients), tab === 'directions' && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.8,
      fontFamily: 'var(--serif)'
    }
  }, product.directions)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'white',
      padding: 36,
      border: '1px solid var(--line-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 14
    }
  }, "From Mercy"), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontSize: 18,
      fontStyle: 'italic',
      lineHeight: 1.55,
      color: 'var(--ink-soft)'
    }
  }, "\"I formulated this for the women who message me at 11pm wondering if it's normal to feel this tired. It is. And there's something we can do about it.\""), /*#__PURE__*/React.createElement("div", {
    className: "script",
    style: {
      fontSize: 26,
      color: 'var(--gold-deep)',
      marginTop: 18
    }
  }, "\u2014 Mercy"))))), related.length > 0 && /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "You may also love",
    title: "Pairs beautifully"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 32
    }
  }, related.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    product: p,
    currency: currency,
    onClick: () => {
      navigate('product', p.id);
      window.scrollTo(0, 0);
    },
    addToCart: addToCart
  }))))));
}
window.HomePage = HomePage;
window.ShopPage = ShopPage;
window.ProductPage = ProductPage;