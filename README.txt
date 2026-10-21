ASTYG website - overhauled pages (Oct 2026)

HOW TO PUT IT LIVE
1. Open your website's GitHub repository (the one that hosts astyg.com).
2. Upload everything in this folder to the top level of the repo, replacing the old files.
   KEEP your existing "images" folder (astyg-shield.png, astyg-wordmark.png, og-image.png) - the pages use it.
   Keep your CNAME file if you have one.
3. Commit. GitHub Pages updates astyg.com in about a minute. Press Ctrl+F5 to see the new version.

PAGES
index.html            Home - "Not sure who to call for your building? Call us." + problem picker
services.html         All services, each with "Call us if..."
mep-services.html, hvac.html, plumbing.html, fire-protection.html,
pumps.html, lifts.html, gensets.html   One page per system (black strip links here)
projects.html, training.html, tools.html, contact.html
css/site.css, js/site.js   Shared design and scripts
sitemap.xml, robots.txt    For Google

CONTACT FORM
The form opens the visitor's email app addressed to info@astyg.com.
If you use Formspree (or similar), put its URL in contact.html:  data-endpoint="https://formspree.io/f/XXXX"
