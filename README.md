# Foster 3D Tours website

Static site (plain HTML/CSS/JS, no build step), hosted on Cloudflare Pages.

## Quick edits (top of `main.js`)
- `WEB3FORMS_KEY`: free key from web3forms.com so quote requests land in foster3dtours@gmail.com. Without it, the form opens the visitor's email app.
- `TOURS`: the portfolio. Each entry is a Matterport model ID (the part after `?m=` in a tour link), a title and a type.

## Cloudflare Pages settings
- Framework preset: None
- Build command: (leave empty)
- Build output directory: `/`
