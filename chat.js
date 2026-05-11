// AI Chat Assistant for Pinnacle
const {
  useState: useStateChat,
  useEffect: useEffectChat,
  useRef: useRefChat
} = React;
function PinnacleChat({
  open,
  onClose,
  navigate,
  addToCart
}) {
  const [messages, setMessages] = useStateChat([{
    role: 'assistant',
    content: "Hello, beautiful — I'm your Pinnacle wellness guide ✦\n\nI can help you find the right products for your goals, explain ingredients, check on an order, book a session with Mercy, or just answer any wellness question on your mind.\n\nWhat would you like to talk about today?"
  }]);
  const [input, setInput] = useStateChat('');
  const [loading, setLoading] = useStateChat(false);
  const scrollRef = useRefChat(null);
  useEffectChat(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);
  const quickPrompts = ['Recommend a product for stress', 'Best for glowing skin?', 'How do I become a Premium member?', 'Book a 1:1 with Mercy', 'Track my order'];
  const productContext = window.PINNACLE_DATA.products.map(p => `- ${p.name} ($${p.priceUSD}) — ${p.tagline}. ${p.shortDesc}`).join('\n');
  const systemPrompt = `You are Pinnacle's AI wellness guide — warm, knowledgeable, and grounded.
You represent Pinnacle Home of Wellness, founded by Mercy Ikpe in Nigeria. Tagline: "Live well. Look well. Be well."

PERSONALITY: Warm and encouraging like a wise older sister. Direct, practical, never preachy. Use occasional ✦ but don't overdo it. Keep responses to 3–5 short paragraphs max.

WHAT YOU CAN DO:
1. Recommend products from this catalog based on user goals
2. Explain ingredients, benefits, directions
3. Help with order tracking (ask for order # — say "I'll pull that up" then provide a friendly mock status)
4. Onboard new Premium members (mention $29/mo, 15% off, monthly call with Mercy)
5. Help book a 1:1 with Mercy ($180, 60 min Zoom — direct them to the Coaching product)
6. Answer general wellness questions (sleep, stress, skin, gut, hormones)

CATALOG:
${productContext}

When recommending a product, name it clearly so we can show it visually.
For medical questions, gently remind users to consult a doctor for diagnoses.
Keep replies concise. Bullet points for benefits, otherwise prose.`;
  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const newMessages = [...messages, {
      role: 'user',
      content: trimmed
    }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      let reply;
      // 1) Try host-provided window.claude.complete (works inside design env)
      if (window.claude && typeof window.claude.complete === 'function') {
        reply = await window.claude.complete({
          messages: [{
            role: 'user',
            content: `${systemPrompt}\n\nConversation:\n${newMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}\n\nReply as ASSISTANT:`
          }]
        });
      }
      // 2) Otherwise call Anthropic API directly with key from window.PINNACLE_AI_KEY or localStorage
      else {
        const apiKey = window.PINNACLE_AI_KEY || localStorage.getItem('pinnacle_ai_key');
        if (!apiKey) {
          throw new Error('No API key configured');
        }
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5',
            max_tokens: 1024,
            system: systemPrompt,
            messages: newMessages.map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content
            }))
          })
        });
        if (!res.ok) throw new Error('API call failed: ' + res.status);
        const data = await res.json();
        reply = data.content?.[0]?.text || 'I had trouble generating a reply.';
      }
      setMessages([...newMessages, {
        role: 'assistant',
        content: reply
      }]);
    } catch (e) {
      const apiKey = window.PINNACLE_AI_KEY || typeof localStorage !== 'undefined' && localStorage.getItem('pinnacle_ai_key');
      const msg = !apiKey ? "Hi! To enable live AI replies on this site, the site owner needs to add a Claude API key. In the meantime, you can browse our shop or message Mercy directly on WhatsApp at +234 806 015 2949 — she replies personally ✦" : "I'm having trouble reaching the cloud right now. Please try again in a moment, or message Mercy on WhatsApp at +234 806 015 2949 — she replies personally.";
      setMessages([...newMessages, {
        role: 'assistant',
        content: msg
      }]);
    } finally {
      setLoading(false);
    }
  }

  // Detect mentioned products in last AI message and surface a card
  const lastAi = [...messages].reverse().find(m => m.role === 'assistant');
  const mentionedProducts = lastAi ? window.PINNACLE_DATA.products.filter(p => lastAi.content.toLowerCase().includes(p.name.toLowerCase()) || lastAi.content.toLowerCase().includes(p.name.split(' ')[0].toLowerCase() + ' ' + (p.name.split(' ')[1] || '').toLowerCase())).slice(0, 2) : [];
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(26,24,20,0.4)',
      backdropFilter: 'blur(4px)',
      animation: 'fadeUp 0.3s ease'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(480px, 100%)',
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
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'white'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      borderRadius: '50%',
      background: 'var(--brand-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'var(--serif)',
      fontSize: 20,
      fontWeight: 600
    }
  }, "P"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--serif)',
      fontSize: 18,
      fontWeight: 600
    }
  }, "Pinnacle AI"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--success)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      background: 'var(--success)',
      borderRadius: '50%'
    }
  }), "Online \xB7 Wellness guide"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 8,
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    className: "no-scrollbar",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, messages.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `chat-bubble ${m.role === 'assistant' ? 'ai' : 'user'}`
  }, m.content)), !loading && mentionedProducts.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      alignSelf: 'flex-start',
      maxWidth: '95%'
    }
  }, mentionedProducts.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      background: 'white',
      border: '1px solid var(--line)',
      padding: 12,
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      cursor: 'pointer'
    },
    onClick: () => {
      navigate('product', p.id);
      onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(ProductImage, {
    product: p
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-mute)',
      fontStyle: 'italic'
    }
  }, p.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      marginTop: 4
    }
  }, "$", p.priceUSD)), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      addToCart(p);
    },
    style: {
      background: 'var(--ink)',
      color: 'var(--paper)',
      border: 'none',
      padding: '8px 12px',
      fontSize: 10,
      letterSpacing: '0.16em',
      fontWeight: 600,
      cursor: 'pointer',
      textTransform: 'uppercase'
    }
  }, "Add")))), loading && /*#__PURE__*/React.createElement("div", {
    className: "chat-bubble ai",
    style: {
      background: 'white'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "typing-dot"
  }))), messages.length <= 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 28px 16px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, quickPrompts.map(q => /*#__PURE__*/React.createElement("button", {
    key: q,
    onClick: () => send(q),
    className: "pill",
    style: {
      fontSize: 11,
      padding: '6px 12px'
    }
  }, q))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      send(input);
    },
    style: {
      padding: '20px 28px',
      borderTop: '1px solid var(--line)',
      background: 'white',
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: input,
    onChange: e => setInput(e.target.value),
    placeholder: "Ask about products, wellness, your order...",
    style: {
      flex: 1,
      border: '1px solid var(--line)',
      padding: '12px 16px',
      fontSize: 14,
      outline: 'none',
      fontFamily: 'var(--sans)'
    },
    disabled: loading
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading || !input.trim(),
    style: {
      background: input.trim() && !loading ? 'var(--brand-gradient)' : 'var(--line)',
      color: 'white',
      border: 'none',
      padding: '0 20px',
      cursor: loading ? 'wait' : 'pointer',
      fontSize: 11,
      letterSpacing: '0.16em',
      fontWeight: 700,
      textTransform: 'uppercase'
    }
  }, "Send")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 28px 16px',
      fontSize: 10,
      color: 'var(--ink-mute)',
      textAlign: 'center',
      letterSpacing: '0.06em'
    }
  }, "AI guidance is informational. For medical concerns, consult a healthcare provider.")));
}
window.PinnacleChat = PinnacleChat;