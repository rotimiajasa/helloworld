// Secondary pages — About, Journal, Contact, Membership, Cart
const {
  useState: useStateS
} = React;

// =========================================================
// ABOUT
// =========================================================
function AboutPage({
  navigate
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0 60px',
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
  }, "The Story"), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 'clamp(48px, 8vw, 96px)',
      marginBottom: 24
    }
  }, "A voice for ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "health,"), /*#__PURE__*/React.createElement("br", null), "beauty, and wellness."), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontSize: 20,
      fontStyle: 'italic',
      color: 'var(--ink-mute)',
      lineHeight: 1.5,
      maxWidth: 640,
      margin: '0 auto'
    }
  }, "Pinnacle was born from one woman's refusal to accept tired, depleted, anxious as the new normal."))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 80,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.PINNACLE_ASSETS && (window.PINNACLE_ASSETS.portrait || window.PINNACLE_ASSETS.cover) || "assets/mercy-portrait.jpeg",
    alt: "Mercy Ikpe",
    style: {
      width: '100%',
      display: 'block',
      boxShadow: 'var(--shadow-lg)',
      aspectRatio: '4/5',
      objectFit: 'cover',
      objectPosition: 'center 18%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: -30,
      right: -30,
      background: 'var(--ink)',
      color: 'var(--gold)',
      padding: '24px 32px',
      maxWidth: 240
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "script",
    style: {
      fontSize: 28,
      lineHeight: 1,
      color: 'var(--gold)'
    }
  }, "Founder"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontFamily: 'var(--serif)',
      marginTop: 8,
      color: 'var(--paper)'
    }
  }, "Mercy Ikpe"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '0.18em',
      marginTop: 8,
      color: '#c8c2b4'
    }
  }, "WELLNESS GUIDE \xB7 LAGOS"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 18
    }
  }, "Meet Mercy"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 'clamp(36px, 5vw, 56px)',
      marginBottom: 28
    }
  }, "From burnout", /*#__PURE__*/React.createElement("br", null), "to her own ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "blueprint.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      fontSize: 16,
      lineHeight: 1.75,
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("p", null, "Six years ago, Mercy was running on caffeine, four hours of sleep, and the quiet shame of looking in the mirror and not recognizing herself. She tried every protocol, every powder, every promise."), /*#__PURE__*/React.createElement("p", null, "What finally worked wasn't a single product. It was a ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'var(--serif)'
    }
  }, "system"), " \u2014 built slowly, tested honestly, refined over thousands of conversations with other women who were tired of being tired."), /*#__PURE__*/React.createElement("p", null, "Pinnacle Home of Wellness is that system, made shareable. The supplements she trusts. The skincare she uses. The rituals she has lived. Every product is one she takes daily.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => navigate('shop')
  }, "Shop her edit"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: () => navigate('contact')
  }, "Message Mercy"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '100px 0',
      background: 'var(--ink)',
      color: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "What we believe",
    title: "Wellness, our way",
    center: true,
    light: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 48,
      marginTop: 24
    }
  }, [{
    n: '01',
    t: 'Honest formulations',
    b: 'No filler ingredients, no marketing dosages. If we put it on the label, it earns its place.'
  }, {
    n: '02',
    t: 'Built for melanin',
    b: 'Skincare that respects deeper tones, hot climates, and the way Black skin actually behaves — not retrofitted.'
  }, {
    n: '03',
    t: 'Community over crowd',
    b: 'We will never be the biggest brand. We will always be the closest one to the woman who needs us.'
  }].map(v => /*#__PURE__*/React.createElement("div", {
    key: v.n
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 64,
      fontStyle: 'italic',
      color: 'var(--gold)',
      lineHeight: 1,
      marginBottom: 16
    }
  }, v.n), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      fontSize: 26,
      marginBottom: 14,
      color: 'var(--paper)'
    }
  }, v.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.7,
      color: '#c8c2b4'
    }
  }, v.b)))))));
}

// =========================================================
// JOURNAL
// =========================================================
function JournalPage({
  navigate
}) {
  const posts = window.PINNACLE_DATA.posts;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0 40px',
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
  }, "The Journal"), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 'clamp(48px, 8vw, 96px)',
      marginBottom: 20
    }
  }, "Notes on ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "living well.")), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontSize: 19,
      fontStyle: 'italic',
      color: 'var(--ink-mute)',
      maxWidth: 580,
      margin: '0 auto'
    }
  }, "Tips, rituals, and honest conversations from Mercy and the Pinnacle community."))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '60px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 48,
      marginBottom: 80,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/3',
      overflow: 'hidden',
      background: 'var(--line-soft)'
    }
  }, posts[0].image ? /*#__PURE__*/React.createElement("img", {
    src: posts[0].image,
    alt: posts[0].title,
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
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--serif)',
      fontStyle: 'italic',
      fontSize: 24,
      position: 'relative',
      zIndex: 1
    }
  }, "Featured \xB7 ", posts[0].category)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 14
    }
  }, "Editor's Pick \xB7 ", posts[0].readTime), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 'clamp(32px, 4vw, 48px)',
      marginBottom: 20
    }
  }, posts[0].title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--ink-soft)',
      marginBottom: 24,
      fontFamily: 'var(--serif)',
      fontStyle: 'italic'
    }
  }, posts[0].excerpt), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-mute)',
      letterSpacing: '0.1em'
    }
  }, "BY MERCY IKPE \xB7 ", posts[0].date), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      alignSelf: 'flex-start',
      marginTop: 20
    }
  }, "Read the piece \u2192"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 36
    }
  }, posts.map(post => /*#__PURE__*/React.createElement("article", {
    key: post.id,
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/3',
      marginBottom: 18,
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
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--serif)',
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
      fontSize: 22,
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
  }, post.excerpt)))))));
}

// =========================================================
// MEMBERSHIP
// =========================================================
function MembershipPage({
  navigate
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '100px 0',
      background: 'var(--ink)',
      color: 'var(--paper)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--brand-gradient)',
      opacity: 0.15
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "container-narrow",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'var(--gold)',
      marginBottom: 20
    }
  }, "The Pinnacle Circle"), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 'clamp(56px, 9vw, 112px)',
      color: 'var(--paper)',
      marginBottom: 28
    }
  }, "Belong to a ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--gold)'
    }
  }, "circle"), /*#__PURE__*/React.createElement("br", null), "that shows up."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      lineHeight: 1.65,
      color: '#c8c2b4',
      maxWidth: 580,
      margin: '0 auto'
    }
  }, "Premium membership for women who are done dabbling \u2014 and ready to commit to themselves."))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-narrow"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper-warm)',
      border: '1px solid var(--gold-soft)',
      padding: 64,
      textAlign: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -16,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--gold)',
      color: 'var(--ink)',
      padding: '6px 16px',
      fontSize: 10,
      letterSpacing: '0.2em',
      fontWeight: 700
    }
  }, "MEMBER FAVORITE"), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 14
    }
  }, "Monthly Membership"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 56,
      marginBottom: 12
    }
  }, "$29", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      color: 'var(--ink-mute)'
    }
  }, "/month")), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontStyle: 'italic',
      color: 'var(--ink-mute)',
      marginBottom: 36
    }
  }, "or \u20A643,500 \xB7 Cancel anytime"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      textAlign: 'left',
      marginBottom: 36
    }
  }, ['15% off every order, always', 'Live monthly group call with Mercy', 'Members-only product drops', 'Early access to new launches', 'Private community of women', 'Weekly wellness rituals delivered', 'Free shipping on every order', 'Birthday gift from Pinnacle'].map(p => /*#__PURE__*/React.createElement("div", {
    key: p,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-deep)',
      fontFamily: 'var(--serif)',
      fontSize: 18
    }
  }, "\u2726"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, p)))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-grad",
    style: {
      width: '100%',
      padding: '18px'
    }
  }, "Join the Circle \u2726"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--ink-mute)',
      marginTop: 16,
      fontStyle: 'italic',
      fontFamily: 'var(--serif)'
    }
  }, "First-month satisfaction guarantee. Cancel any time, no questions.")))));
}

// =========================================================
// CONTACT
// =========================================================
function ContactPage() {
  const [sent, setSent] = useStateS(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0 40px',
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
  }, "Stay Close"), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 'clamp(48px, 7vw, 88px)',
      marginBottom: 20
    }
  }, "Let's ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "talk.")), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontSize: 19,
      fontStyle: 'italic',
      color: 'var(--ink-mute)'
    }
  }, "We answer every message \u2014 usually within a day."))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '60px 0 100px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.2fr',
      gap: 80
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "serif",
    style: {
      fontSize: 28,
      marginBottom: 24
    }
  }, "Reach us directly"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, [{
    eyebrow: 'WHATSAPP',
    label: 'Message Mercy',
    value: '+234 806 015 2949',
    href: 'https://wa.me/2348060152949'
  }, {
    eyebrow: 'INSTAGRAM',
    label: 'Follow our journey',
    value: '@ikpe_mercy_pinnacle',
    href: 'https://www.instagram.com/'
  }, {
    eyebrow: 'FACEBOOK',
    label: 'Join the conversation',
    value: 'Pinnacle Home of Wellness',
    href: 'https://www.facebook.com/'
  }, {
    eyebrow: 'WHATSAPP CHANNEL',
    label: 'Daily wellness tips',
    value: 'Join the channel →',
    href: 'https://whatsapp.com/channel/0029VaBYfWH4dTnJfhJD1T3k'
  }].map(c => /*#__PURE__*/React.createElement("a", {
    key: c.eyebrow,
    href: c.href,
    target: "_blank",
    rel: "noopener",
    style: {
      borderTop: '1px solid var(--line)',
      paddingTop: 18,
      textDecoration: 'none',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 8
    }
  }, c.eyebrow), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 22,
      marginBottom: 4
    }
  }, c.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--ink-mute)'
    }
  }, c.value))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper-warm)',
      padding: 48
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '60px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 64,
      color: 'var(--gold-deep)',
      lineHeight: 1,
      marginBottom: 16
    }
  }, "\u2726"), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      fontSize: 32,
      marginBottom: 12
    }
  }, "Thank you"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontStyle: 'italic',
      fontFamily: 'var(--serif)',
      color: 'var(--ink-mute)'
    }
  }, "Mercy will reply personally within a day.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "serif",
    style: {
      fontSize: 28,
      marginBottom: 24
    }
  }, "Or send a note"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("input", {
    className: "input-underline",
    placeholder: "Name",
    required: true
  }), /*#__PURE__*/React.createElement("input", {
    className: "input-underline",
    placeholder: "Email",
    type: "email",
    required: true
  })), /*#__PURE__*/React.createElement("select", {
    className: "input-underline",
    defaultValue: ""
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, "What's it about?"), /*#__PURE__*/React.createElement("option", null, "Product question"), /*#__PURE__*/React.createElement("option", null, "Order help"), /*#__PURE__*/React.createElement("option", null, "Coaching enquiry"), /*#__PURE__*/React.createElement("option", null, "Press / partnerships"), /*#__PURE__*/React.createElement("option", null, "Other")), /*#__PURE__*/React.createElement("textarea", {
    className: "input-underline",
    placeholder: "Your message",
    rows: 5,
    required: true,
    style: {
      resize: 'none'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Send message")))))));
}

// =========================================================
// CART (drawer)
// =========================================================
function CartDrawer({
  open,
  onClose,
  cart,
  removeFromCart,
  updateQty,
  currency,
  navigate
}) {
  if (!open) return null;
  const data = window.PINNACLE_DATA;
  const subtotal = cart.reduce((s, item) => s + item.product.priceUSD * item.qty, 0);
  const subtotalNGN = cart.reduce((s, item) => s + (item.product.priceNGN || Math.round(item.product.priceUSD * data.exchangeRate)) * item.qty, 0);
  const subtotalDisplay = currency === 'USD' ? `$${subtotal.toFixed(2)}` : `₦${subtotalNGN.toLocaleString()}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 99,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(26,24,20,0.4)',
      backdropFilter: 'blur(4px)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(460px, 100%)',
      height: '100%',
      background: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-24px 0 60px rgba(0,0,0,0.2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 28px',
      borderBottom: '1px solid var(--line)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 4
    }
  }, "Your Cart"), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      fontSize: 22
    }
  }, cart.length, " item", cart.length !== 1 ? 's' : '')), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: 22
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "no-scrollbar",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 28
    }
  }, cart.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '60px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 64,
      color: 'var(--gold-deep)',
      marginBottom: 16,
      lineHeight: 1
    }
  }, "\u2726"), /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      fontSize: 24,
      marginBottom: 12
    }
  }, "Your cart is empty"), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontStyle: 'italic',
      color: 'var(--ink-mute)',
      marginBottom: 24
    }
  }, "Discover something beautiful"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      onClose();
      navigate('shop');
    }
  }, "Shop Now")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, cart.map(item => {
    const p = item.product;
    const ngnUnit = p.priceNGN || Math.round(p.priceUSD * data.exchangeRate);
    const itemPrice = currency === 'USD' ? `$${(p.priceUSD * item.qty).toFixed(2)}` : `₦${(ngnUnit * item.qty).toLocaleString()}`;
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      style: {
        display: 'grid',
        gridTemplateColumns: '90px 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '4/5'
      }
    }, /*#__PURE__*/React.createElement(ProductImage, {
      product: p
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "serif",
      style: {
        fontSize: 16,
        fontWeight: 600,
        marginBottom: 4
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--ink-mute)',
        fontStyle: 'italic',
        fontFamily: 'var(--serif)',
        marginBottom: 12
      }
    }, p.tagline), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid var(--line)',
        background: 'white'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => updateQty(p.id, item.qty - 1),
      style: {
        width: 28,
        height: 28,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer'
      }
    }, "\u2212"), /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 24,
        textAlign: 'center',
        fontSize: 13
      }
    }, item.qty), /*#__PURE__*/React.createElement("button", {
      onClick: () => updateQty(p.id, item.qty + 1),
      style: {
        width: 28,
        height: 28,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer'
      }
    }, "+")), /*#__PURE__*/React.createElement("span", {
      className: "serif",
      style: {
        fontSize: 16,
        fontWeight: 600
      }
    }, itemPrice)), /*#__PURE__*/React.createElement("button", {
      onClick: () => removeFromCart(p.id),
      style: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: 11,
        color: 'var(--ink-mute)',
        textDecoration: 'underline',
        marginTop: 6,
        padding: 0
      }
    }, "remove")));
  }))), cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      borderTop: '1px solid var(--line)',
      background: 'white'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 8,
      fontSize: 13,
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, subtotalDisplay)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20,
      fontSize: 13,
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Shipping"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--success)'
    }
  }, "Calculated at checkout")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingTop: 16,
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 22,
      fontWeight: 600
    }
  }, subtotalDisplay)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    style: {
      width: '100%',
      padding: 16
    }
  }, "Checkout \u2726"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      textAlign: 'center',
      color: 'var(--ink-mute)',
      marginTop: 12
    }
  }, "Secure checkout \xB7 Paystack \xB7 Stripe \xB7 PayPal"))));
}
window.AboutPage = AboutPage;
window.JournalPage = JournalPage;
window.MembershipPage = MembershipPage;
window.ContactPage = ContactPage;
window.CartDrawer = CartDrawer;

// =========================================================
// SERVICES — Nourish Kitchen (food) + Mercy Motors (autos) + concierge
// =========================================================
function ServicesPage({
  navigate
}) {
  const [active, setActive] = React.useState('kitchen');
  const services = [{
    id: 'kitchen',
    eyebrow: 'Nourish Kitchen',
    title: 'Chef-prepared wellness meals, delivered',
    lede: 'A weekly rotating menu of clean, anti-inflammatory meals — built around your goals, your allergies, and your week. Prepared by Pinnacle’s in-house chef in Lagos & Abuja, delivered fresh to your door.',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80',
    alt: 'Fresh wellness bowls with greens, grains and fruit',
    cta: 'Browse this week’s menu',
    meta: [{
      k: 'Cities',
      v: 'Lagos · Abuja · Port Harcourt'
    }, {
      k: 'Delivery',
      v: 'Mon, Wed, Fri · 7am–11am'
    }, {
      k: 'From',
      v: '₦8,500 / meal · ₦48k weekly plan'
    }]
  }, {
    id: 'motors',
    eyebrow: 'Mercy Motors',
    title: 'Wellness-grade vehicles, sourced with intention',
    lede: 'A boutique dealership of pre-owned and new SUVs, sedans and family vehicles — each one inspected, detailed and delivered ready. We handle paperwork, financing and logistics so you only handle the keys.',
    img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1400&q=80',
    alt: 'Detailed luxury SUV in soft daylight',
    cta: 'Browse current inventory',
    meta: [{
      k: 'Inventory',
      v: 'Toyota · Lexus · Mercedes-Benz · Range Rover'
    }, {
      k: 'Financing',
      v: '12 / 24 / 36-month plans, in-house'
    }, {
      k: 'Includes',
      v: 'Inspection report · 6-mo warranty · home delivery'
    }]
  }];
  const current = services.find(s => s.id === active);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0 50px',
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
  }, "Services by Pinnacle"), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 'clamp(44px, 7.5vw, 88px)',
      marginBottom: 22
    }
  }, "Beyond the bottle. ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "A lifestyle, delivered.")), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontSize: 20,
      fontStyle: 'italic',
      color: 'var(--ink-soft)',
      maxWidth: 680,
      margin: '0 auto',
      lineHeight: 1.5
    }
  }, "Wellness is not only what you swallow. It\u2019s what you eat, what you drive, who shows up at your door. We curate it all."))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '20px 0 0',
      background: 'var(--paper-warm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 4,
      borderBottom: '1px solid var(--line)',
      flexWrap: 'wrap'
    }
  }, services.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setActive(s.id),
    style: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '18px 28px',
      fontFamily: 'var(--serif)',
      fontSize: 17,
      fontStyle: active === s.id ? 'italic' : 'normal',
      color: active === s.id ? 'var(--ink)' : 'var(--ink-mute)',
      borderBottom: active === s.id ? '2px solid var(--gold-deep)' : '2px solid transparent',
      marginBottom: -1,
      letterSpacing: '0.02em'
    }
  }, s.eyebrow)))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '70px 0 90px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "services-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/3',
      overflow: 'hidden',
      background: 'var(--line-soft)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: current.img,
    alt: current.alt,
    loading: "lazy",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      filter: 'saturate(0.92)'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 16
    }
  }, current.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 'clamp(32px, 4.5vw, 52px)',
      marginBottom: 22,
      lineHeight: 1.05
    }
  }, current.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.75,
      color: 'var(--ink-soft)',
      marginBottom: 32,
      fontFamily: 'var(--serif)'
    }
  }, current.lede), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--line)',
      marginBottom: 32
    }
  }, current.meta.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      padding: '14px 0',
      borderBottom: '1px solid var(--line-soft)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow-gold",
    style: {
      alignSelf: 'center'
    }
  }, m.k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-soft)'
    }
  }, m.v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, current.cta), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate('contact')
  }, "Talk to us \u2192")))))), active === 'kitchen' ? /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0',
      background: 'var(--paper-warm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 12
    }
  }, "This Week\u2019s Menu"), /*#__PURE__*/React.createElement("h3", {
    className: "display",
    style: {
      fontSize: 'clamp(28px, 3.6vw, 40px)'
    }
  }, "Mon \u2014 Apr 28 \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "Fri \u2014 May 2"))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost"
  }, "View full menu \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "services-cards",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 32
    }
  }, [{
    name: 'Suya-spiced grain bowl',
    desc: 'Brown rice, marinated chicken, garden salad, tahini-suya drizzle.',
    price: '₦9,200',
    tag: 'High protein',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80'
  }, {
    name: 'Egusi greens & yam',
    desc: 'Lightened egusi with bitterleaf, ugu and roasted yam batons.',
    price: '₦8,500',
    tag: 'Plant-forward',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80'
  }, {
    name: 'Salmon, plantain, pepper sauce',
    desc: 'Oven-baked salmon, sweet plantain mash, scotch-bonnet relish.',
    price: '₦11,800',
    tag: 'Omega-3',
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80'
  }].map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/3',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: m.img,
    alt: m.name,
    loading: "lazy",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 10
    }
  }, m.tag), /*#__PURE__*/React.createElement("h4", {
    className: "serif",
    style: {
      fontSize: 20,
      fontStyle: 'italic',
      marginBottom: 8,
      fontWeight: 500
    }
  }, m.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--ink-mute)',
      lineHeight: 1.6,
      marginBottom: 18
    }
  }, m.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid var(--line-soft)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, m.price), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      padding: '8px 16px',
      fontSize: 12
    }
  }, "Add to box")))))))) : /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 0',
      background: 'var(--paper-warm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 40,
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 12
    }
  }, "Available Now"), /*#__PURE__*/React.createElement("h3", {
    className: "display",
    style: {
      fontSize: 'clamp(28px, 3.6vw, 40px)'
    }
  }, "Six in inventory \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "three reserved"))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost"
  }, "See full inventory \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "services-cards",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 32
    }
  }, [{
    name: '2022 Lexus RX 350',
    desc: 'Foreign-used · 24,500 km · Black on tan leather · panoramic roof.',
    price: '₦72m',
    tag: 'Just in',
    img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80'
  }, {
    name: '2020 Toyota Highlander',
    desc: 'Nigerian-used · 38,000 km · 7-seater · service records included.',
    price: '₦48m',
    tag: 'Family',
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80'
  }, {
    name: '2023 Mercedes-Benz GLE',
    desc: 'Brand new · 0 km · Obsidian black · in transit, arrives May.',
    price: '₦112m',
    tag: 'New',
    img: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80'
  }].map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/3',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: m.img,
    alt: m.name,
    loading: "lazy",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 10
    }
  }, m.tag), /*#__PURE__*/React.createElement("h4", {
    className: "serif",
    style: {
      fontSize: 20,
      fontStyle: 'italic',
      marginBottom: 8,
      fontWeight: 500
    }
  }, m.name), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--ink-mute)',
      lineHeight: 1.6,
      marginBottom: 18
    }
  }, m.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid var(--line-soft)',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "serif",
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, m.price), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      padding: '8px 16px',
      fontSize: 12
    }
  }, "Reserve")))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 12
    }
  }, "How it works"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 'clamp(32px, 4.5vw, 52px)'
    }
  }, "Tell us what you need. ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic'
    }
  }, "We handle the rest."))), /*#__PURE__*/React.createElement("div", {
    className: "services-steps",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 36
    }
  }, [{
    n: '01',
    t: 'Tell us',
    b: 'WhatsApp, call or fill the brief — your dietary goals or the kind of vehicle you’re after.'
  }, {
    n: '02',
    t: 'We curate',
    b: 'A short, personal shortlist arrives the same day. No catalog dumps, no spam.'
  }, {
    n: '03',
    t: 'You confirm',
    b: 'You pick what fits, and we schedule delivery or test drive at your convenience.'
  }, {
    n: '04',
    t: 'We deliver',
    b: 'Fresh boxes Mon-Wed-Fri, or your vehicle home-delivered with a full handover.'
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 44,
      color: 'var(--gold-deep)',
      fontStyle: 'italic',
      marginBottom: 14,
      lineHeight: 1
    }
  }, s.n), /*#__PURE__*/React.createElement("h4", {
    className: "serif",
    style: {
      fontSize: 22,
      fontStyle: 'italic',
      marginBottom: 10,
      fontWeight: 500
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.7,
      color: 'var(--ink-soft)'
    }
  }, s.b)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 0',
      background: 'var(--ink)',
      color: 'var(--paper)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-narrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-gold",
    style: {
      marginBottom: 18,
      color: 'var(--gold)'
    }
  }, "Bespoke requests"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 'clamp(36px, 5vw, 60px)',
      marginBottom: 22
    }
  }, "Need something we haven\u2019t listed?"), /*#__PURE__*/React.createElement("p", {
    className: "serif",
    style: {
      fontSize: 19,
      fontStyle: 'italic',
      color: '#cfc7b6',
      marginBottom: 36,
      maxWidth: 620,
      margin: '0 auto 36px',
      lineHeight: 1.5
    }
  }, "Corporate wellness boxes. Wedding-week meal plans. A specific car model we\u2019ll source for you. If it sits at the intersection of ", /*#__PURE__*/React.createElement("em", null, "well-lived"), " and ", /*#__PURE__*/React.createElement("em", null, "well-made"), ", we can help."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => navigate('contact')
  }, "Send us a brief \u2192"))));
}
window.ServicesPage = ServicesPage;