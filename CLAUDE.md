# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- This project is a **Next.js** app (App Router). Do not introduce a separate static server.
- Start the dev server: `npm run dev` (serves at `http://localhost:3000`)
- Run it in the background before any browser-based verification.
- If the server is already running, do not start a second instance.
- Production build / preview: `npm run build` then `npm run start`.

## Visual Verification
- Puppeteer is installed. Capture screenshots yourself — do not ask the user.
- Make sure the dev server is running, then run `node screenshot.mjs [path] [name] [width] [height]`. Defaults: `/`, `home`, `1440`, `900`. Output goes to `screenshots/<name>.png`.
  - Examples: `node screenshot.mjs` → `screenshots/home.png`. `node screenshot.mjs /pricing pricing-mobile 390 844` → mobile shot of `/pricing`.
- Read the resulting PNG with the Read tool and compare specifically: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px".
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing.

## Output Defaults
- Build inside the Next.js App Router (`app/`). Use Server Components by default; add `"use client"` only when interactivity requires it.
- Styling: **Tailwind CSS v4** via the existing PostCSS setup — do not add the Tailwind CDN script.
- TypeScript (`.tsx`) for components, matching the existing project setup.
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT` (allowed via `next.config.ts` `images.remotePatterns` if using `next/image`).
- Mobile-first responsive.

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
