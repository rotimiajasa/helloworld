# Troan Digital — Cybersecurity Managed Services website

A standalone, animated marketing website for **www.troandigital.net**, a cybersecurity
managed service provider. Built with plain HTML, CSS and vanilla JavaScript — no build
step, no framework, no dependencies.

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
cd troandigital
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure & all sections |
| `styles.css` | Design system, layout, animations |
| `data.js`    | All editable content (services, plans, team, FAQs, etc.) |
| `app.js`     | Rendering, scroll animations, counters, live threat feed, particle background, form |

## Sections

Hero (animated SOC dashboard + live threat feed) · Stats (animated counters) ·
Services · How it works · Pricing · About / Team · Testimonials · Insights · FAQ ·
Contact form · Footer.

## Editing content

All copy lives in `data.js` under `window.TROAN`. Change text, prices, team members,
services or FAQs there — no need to touch the HTML.

## Animations

- Particle "node network" canvas background
- Scroll-reveal with staggered cards (IntersectionObserver)
- Animated number counters
- Live, rotating SOC threat feed + scanline + equaliser bars
- Scroll-spy navigation, sticky header, animated mobile menu

All motion respects `prefers-reduced-motion`.

> This site is independent of the Pinnacle Wellness site in the repository root.
