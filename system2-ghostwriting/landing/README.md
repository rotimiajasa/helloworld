# Landing page

Single static page at `https://yourdomain.com/ghost`. Hosted on Cloudflare Pages alongside system #1, or as its own project.

## Deploy

```bash
# It's a single .html file. Either:
#  (a) Drop it as a route in your existing Astro site:
cp landing/index.html ../site/public/ghost.html
#  (b) Or deploy to Cloudflare Pages directly (point a CF Pages project at ./landing).
```

## What's on the page

- 1-line hook
- 3 outcomes (in their words)
- "Who this is for" / "Who it's not for" (qualifier)
- Pricing tiers
- 1 sample of work
- FAQ
- Single CTA: book a call

## Conversion rules

- ONE CTA on the page (Calendly link).
- No nav, no footer links — minimize escape hatches.
- Trust signals: 1 client logo or 1 testimonial. If you have neither yet, use a Loom of YOU explaining what you'd do for them, recorded in 60 seconds.
