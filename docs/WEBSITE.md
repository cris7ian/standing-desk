# Product website

The static site lives in `app-store-release-prep/web/`.

## Local preview

Run `python3 -m http.server 8765 --bind 127.0.0.1 --directory app-store-release-prep/web` from the repository root.
Open `http://127.0.0.1:8765`.

## Effects

`effects.js` adds spring-based pointer tilt and one-time section reveals.
CSS adds the phone entrance, trail reveal, sparkle animation, underline shimmer, and button feedback.
The website does not use Bluetooth, invoke native helpers, or send movement commands.

Reduced motion disables decorative travel. Animations pause when hidden or outside the viewport.
Content remains readable without JavaScript.

## Verification

Check desktop and narrow mobile layouts, keyboard focus, reduced motion, and disabled JavaScript.
Check the browser console and asset requests. Run the repository verification commands before delivery.

## Deployment

Changes to `app-store-release-prep/web/` on `main` trigger `.github/workflows/deploy-app-store-site.yml`.
The workflow publishes the static files and invalidates the CloudFront cache.
