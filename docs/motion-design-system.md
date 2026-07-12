# 305Fleet Motion Design System

Phase 1B Signature Motion Prototype — GSAP + Three.js

## Design Philosophy

**Premium, precise, cinematic, restrained, purposeful.**

Not bouncy, cartoonish, constantly moving, delayed, overproduced, or template-like.

## Standard Easing Curves

| Token | Value | Use |
|-------|-------|-----|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Section reveals, card entrances, headline reveals |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Hover transitions, microinteractions |
| `--ease-out` | `cubic-bezier(0.33, 1, 0.68, 1)` | UI element transitions, CTA hovers |

GSAP equivalents: `power3.out`, `power2.inOut`, `power2.out`

## Timing

| Element | Duration | Stagger | Notes |
|---------|----------|---------|-------|
| Hero label fade | 800ms | — | Delayed 200ms after page load |
| Headline line reveal | 900ms/line | 150ms | Clip-path or translateY mask |
| Subtitle fade | 700ms | — | Overlaps headline end |
| CTA entrance | 600ms | — | Overlaps subtitle |
| Fleet card entrance | 700ms/card | 100ms | Staggered by index |
| Fleet image reveal | 1200ms | — | scale 1.08 → 1 |
| Airport card entrance | 600ms/card | 150ms | Staggered by index |
| Hover lift | 400ms | — | translateY(-6px) + box-shadow |
| CTA hover gap | 300ms | — | gap 6px → 10px |
| Scroll-dot pulse | 1500ms loop | — | yoyo, subtle |

## Mobile Reductions

- Full animation durations halved when viewport < 768px where practical
- No parallax on mobile (touch-scroll conflicts)
- Fleet cards: tap-scale feedback replaces hover-lift
- Airport cards: no hover-lift on touch
- Three.js: 50% particle reduction on mobile

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* All elements visible immediately */
  .hero-label, .hero-headline .line-inner, .hero-sub, .hero-cta, .hero-scroll,
  .fleet-card, .airport-card { opacity: 1 !important; transform: none !important; }
}
```

Three.js render loop disabled entirely in reduced-motion mode.

## WebGL Fallback

- Static CSS gradient replaces WebGL airport visualization
- `no-webgl` class applied to body when WebGL unavailable
- Semantic HTML airport cards render identically with or without WebGL
- Three.js import wrapped in try/catch; failure = fallback

## Maximum Animation Density

- No more than 1 GSAP ScrollTrigger per major section
- No more than 3 simultaneous timeline tweens
- Three.js: ≤ 80 particles, ≤ 6 meshes, ≤ 2 lights
- No animation loops beyond the render loop + 1 scroll pulse
- All ScrollTriggers use `toggleActions: 'play none none none'` (play once)

## Performance Targets

| Metric | Target |
|--------|--------|
| JS bundle increase from GSAP | < 60 KB gzipped (ScrollTrigger only) |
| JS bundle increase from Three.js | < 150 KB gzipped (core only) |
| Desktop frame rate | ≥ 55 fps during animations |
| Mobile frame rate | ≥ 30 fps |
| LCP impact | < 200ms above baseline |
| Console errors | 0 |
| Total animation JS | < 10 KB (inline) |
| WebGL textures | 0 (procedural geometry only) |

## GSAP Plugins

- **ScrollTrigger** — scroll-linked reveal triggers, hero parallax
- (SplitText, Flip, MorphSVG available but unused in Phase 1B — reserved for Phase 2)

## Three.js Implementation

- 3 airport nodes (MIA/FLL/PBI) as colored spheres with emissive glow
- 2 connecting route lines (MIA→FLL, FLL→PBI)
- 80-particle ambient brand-colored field
- Ambient + point lighting
- IntersectionObserver pauses render when offscreen
- Resize handler updates canvas dimensions
- maxPixelRatio: 2

## Cleanup Protocol

- ScrollTrigger: `ScrollTrigger.killAll()` on navigation
- GSAP: `gsap.killTweensOf(...)` targets scoped by section
- Three.js: `cancelAnimationFrame()`, `renderer.dispose()`, `geometry.dispose()`, `material.dispose()`, `scene.clear()`
- Event listeners: remove resize/scroll/IntersectionObserver on page unload

## Visual Language Reference

**Brand:** #314B6E (navy), #607EA2 (blue-grey), #EA5E2D (accent), #0D141C (near-black), #F4FBFE (light tint)

**Type:** System UI sans-serif (geometric sans-serif pending designer font identification)

**Depth:** Subtle translateY(-2px to -6px), soft box-shadow diffusions, scale 1.00–1.08 range

**Color transitions:** Dark → light → dark section rhythm (hero: brand-900, fleet: white, airport: brand-900)

**Responsive:** CSS Grid auto-fit for cards, clamp() for headlines, flex-direction: column for mobile CTAs