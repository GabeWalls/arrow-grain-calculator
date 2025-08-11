# Arrow Grain Calculator – CS499 Capstone

Live demo: 
Portfolio: https://gabewalls.github.io/#projects

## What it does
Interactive arrow builder that calculates total grains and FOC% and lets you save/update/delete builds.

## Tech
- React (ArrowSVG, hover/selection, click-away)
- Node/Express API
- MongoDB + Mongoose schema/validation
- Algorithms for shaft grains and FOC%
- Collapsible, paginated Saved Builds (10/page)

## Run locally
npm install
npm run dev  # or npm start for client / npm run server for API

## Tests / Next steps
Server-side validation, future auth/rate limiting, unit tests for FOC math.
