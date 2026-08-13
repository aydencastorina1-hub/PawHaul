# PawHaul marketing setup — what needs you

Everything that could be built in code is built and deployed. What is left is
the part no code can do: proving to Google, Bing, Pinterest and Meta that you
own this business. Those are account actions, and they need you.

This file lists every one of them, in the order worth doing them, with what
each unlocks and roughly what it costs you in time. Nothing here costs money.

**Read this first if you read nothing else:** items **1–4** take about an hour
total and are where essentially all of the value is. Items 7 and 8 are weeks of
platform review for a maybe. Do them last, or not at all.

---

## Already done — no action needed

| | Where |
|---|---|
| Per-page titles, descriptions, canonicals | `api/_seo.js` → served by `api/render.js` |
| Open Graph + Twitter cards on every URL (link previews) | same |
| Product / Article / Organization / Breadcrumb JSON-LD | same |
| `sitemap.xml`, generated live from products + posts | `api/sitemap.js` |
| `robots.txt` | `robots.txt` |
| Merchant Center product feed at `/feed.xml` | `api/feed.js` |
| Blog + 4 articles, server-rendered so they're indexable without JS | `blog.js` |
| Analytics code (inert until you switch it on — items 1 and 6) | `index.html` |
| QR codes for print | `marketing/pawhaul-qr*.png/svg` |
| Pinterest + Meta posting scripts (inert until authorised — items 7, 8) | `scripts/social/` |

The site renders its own SEO markup per request, so **adding a product or a
blog post updates the titles, the sitemap and the feed automatically.** There
is no build step to remember and nothing to regenerate.

### How to paste a code into the site

Items 2, 3 and 6 end with "paste this string somewhere". Two files take them:

* **Verification codes** → `api/_seo.js`, the `SITE_VERIFICATION` block near
  the top. Paste **only the value** from the tag's `content="..."`, not the
  whole tag.
* **GA4 measurement ID** → `index.html`, `window.GA4_ID = ''` near the bottom.

Then deploy — the change is live in about a minute:

```bash
git add -A && git commit -m "Add <service> verification" && git push
```

Vercel auto-deploys from `main`. Verify only *after* the deploy finishes, or
the service will look for a code that isn't there yet and fail you.

---

## 1. Turn on Vercel Analytics — 2 minutes

**Unlocks:** page views, referrers and Core Web Vitals from real visitors. No
cookie banner needed. The tracking scripts are already in the page; until you
flip these switches they 404 harmlessly and record nothing.

1. [vercel.com](https://vercel.com) → project **pawhaul** → **Analytics** tab →
   **Enable**.
2. Same project → **Speed Insights** tab → **Enable**.

That's the whole thing. Data starts appearing on the next visit.

---

## 2. Google Search Console — 15 minutes, then wait

**Unlocks:** the only reliable view of what people search before they land
here, which pages Google has actually indexed, and any indexing problems. This
is the single most useful account on the list.

1. [search.google.com/search-console](https://search.google.com/search-console)
   → **Add property** → **URL prefix** → `https://pawhaul.vercel.app`
2. Choose the **HTML tag** verification method. Copy the value out of
   `content="..."`.
3. Paste it into `SITE_VERIFICATION.google` in `api/_seo.js`, push, wait for
   the deploy.
4. Back in Search Console → **Verify**.
5. Left sidebar → **Sitemaps** → enter `sitemap.xml` → **Submit**.
6. Left sidebar → **URL inspection** → paste `https://pawhaul.vercel.app/` →
   **Request indexing**. Repeat for `/shop` and each blog post. This is the
   fastest way to get first crawled.

**Expect to wait.** New sites typically take 3–10 days to start appearing, and
ranking for anything competitive takes months. The blog posts will index faster
than the product pages, which is normal and is part of why they exist.

---

## 3. Bing Webmaster Tools — 3 minutes

**Unlocks:** Bing + DuckDuckGo + ChatGPT search, which is a small slice of
traffic but a genuinely free one. Bing also renders JavaScript unreliably,
which is exactly why the server-rendered meta matters here.

Do this **after** item 2 and take the shortcut:

1. [bing.com/webmasters](https://www.bing.com/webmasters) → **Import from
   Google Search Console** → authorise → select the property.

That carries the verification *and* the sitemap across in one click. Only if
the import fails: verify manually via **HTML Meta Tag**, paste the value into
`SITE_VERIFICATION.bing` in `api/_seo.js`, push, verify.

---

## 4. Google Merchant Center — free product listings — 45 minutes

**Unlocks:** the seven products appearing in the Google Shopping tab and in
free product results on Search. This is the **free listings** path — no card,
no budget, no campaign. Shopping *ads* are a separate opt-in that requires a
linked Google Ads account; nothing here creates one, and you should not create
one unless you decide to spend money.

1. [merchants.google.com](https://merchants.google.com) → create an account for
   PawHaul.
2. **Business info** → website `https://pawhaul.vercel.app`. It should verify
   instantly via the Search Console property from item 2 — another reason to do
   that one first.
3. **Shipping**: add a US shipping service at **$0.00**. This must match the
   free shipping the site and the feed both claim, or items get disapproved for
   a mismatch.
4. **Returns**: 30 days, return by mail — matching the published policy.
5. **Products** → **Add product source** → **Scheduled fetch**:
   * Feed URL: `https://pawhaul.vercel.app/feed.xml`
   * Country: United States · Language: English · Frequency: daily
6. Fetch it once manually and read the results.

**What to expect:** some items will flag warnings for a missing GTIN. That is
expected and correct — these are generic goods with no barcode, and the feed
declares `identifier_exists: no` rather than inventing one. Warnings are fine;
watch for *disapprovals*, which usually mean a price mismatch between the feed
and the landing page.

**The feed is generated live from `products.js`**, so a price change on the
site is in the feed the same day. Nothing to re-upload, ever.

*(The same feed URL also works for Microsoft Merchant Center and for
Pinterest's catalogue ingestion, if you get that far.)*

---

## 5. WELCOME10 welcome email sequence — 30 minutes

**Unlocks:** the automated welcome + 2 follow-ups for everyone who submits the
email popup. Shopify Messaging sends the first 10,000 emails a month free.

**This one genuinely cannot be scripted.** Shopify Messaging automations are
built in the admin UI, there is no public API for creating an automation or an
email template, and Shopify Flow has no create-workflow endpoint. What the repo
already does is the trigger: `api/customer.js` creates each signup with
`acceptsMarketing: true`, which is the "subscribed" event the automation fires
on.

1. **Confirm `WELCOME10` exists as a real discount** — Shopify admin →
   **Discounts**. The site has been showing this code all along; if it was
   never created, these emails send a dead code.
2. Shopify admin → **Apps** → **Messaging** → **Automations** → **Create
   automation** → **"Welcome new subscribers with a discount series"**.
   *Desktop browser only — Shopify does not allow this on mobile.*
3. **Edit email** and paste in the copy from
   [`marketing/welcome-email-sequence.md`](marketing/welcome-email-sequence.md)
   — subject lines, preview text, body and buttons for all three emails, plus
   the wait steps and the "has not ordered" conditions.
4. **Send test** to yourself, check it on a phone, then **Turn on**.
5. **Then verify the trigger actually fires**: sign up on the live site with a
   throwaway address and check Shopify → **Customers** → status reads
   **Subscribed**. If it reads *Pending*, double opt-in is on and the sequence
   will not send until people confirm — turn it off or plan around it.

---

## 6. Google Analytics 4 — 10 minutes — optional

**Unlocks:** behaviour reporting Vercel Analytics doesn't do, and the only way
to attribute a Shopify checkout back to the traffic source that produced it.
Skip it if item 1 is enough for you; it does add a cookie banner obligation in
some jurisdictions, which Vercel Analytics does not.

1. [analytics.google.com](https://analytics.google.com) → create a property →
   **Admin** → **Data Streams** → **Web** → `https://pawhaul.vercel.app`.
2. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. Paste into `window.GA4_ID = ''` in `index.html`, push.

Route changes, add-to-cart and checkout are already wired to GA4's standard
ecommerce event shape (`trackPageView` / `trackAddToCart` in `app.js`), so the
Monetisation reports populate on their own once the ID is in.

---

## 7. Pinterest auto-pinning — ~1 hour of work, 1–3 weeks of review

**Unlocks:** automated product pins. Worth more than it sounds: Pinterest is a
search engine, pins keep pulling clicks for months, and it is the one visual
network that permits programmatic promotional posting. Dog-gear content also
performs unusually well there.

`scripts/social/pinterest-pin.js` is written and ready. What it needs from you:

1. A **Pinterest Business account**, then **claim the website** — Settings →
   Claimed accounts → Claim website → HTML tag → paste the value into
   `SITE_VERIFICATION.pinterest` in `api/_seo.js`, push, then confirm.
   Claiming is what attributes pins back to your profile.
2. [developers.pinterest.com](https://developers.pinterest.com) → create an app
   → request **Trial access** → generate a token with `boards:read`,
   `pins:read`, `pins:write`.
3. `cp env.example .env`, fill in `PINTEREST_ACCESS_TOKEN`, then:
   ```bash
   node scripts/social/pinterest-pin.js --check      # lists your board IDs
   # put the board id in .env, then:
   node scripts/social/pinterest-pin.js --all        # dry run, posts nothing
   node scripts/social/pinterest-pin.js --all --live # actually pins
   ```

**The trap to know about up front:** on **Trial** access the API returns real
pin IDs but **the pins are invisible to the public**, and tokens expire every
24 hours. It is only good for proving the integration works. Public pins need
**Standard** access, a second review, and they want a screen recording of this
script creating a pin. So the order is: Trial → run `--live` → record that →
apply for Standard.

---

## 8. Facebook + Instagram Reels auto-posting — 2–4 weeks, uncertain

**Unlocks:** publishing a video as a Reel to both platforms from one command.
`scripts/social/meta-reel.js` is written; `scripts/social/fetch-video.js`
downloads a TikTok/Reels URL into `marketing/video/` to feed it.

**This is the heaviest item on the list and the least likely to pay off.** Meta
requires, all one-time, all manual, none of it automatable:

1. A Facebook **Page** for PawHaul.
2. An Instagram account converted to **Professional/Business** and linked to
   that Page. *Creator accounts cannot publish via the API.*
3. A **Meta Business Portfolio** with **Business Verification** completed —
   this asks for real business documentation.
4. A developer app at [developers.facebook.com](https://developers.facebook.com)
   with `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`,
   `instagram_basic` and `instagram_content_publish` approved through **App
   Review** — each needs a screencast. Budget 2–4 weeks.
5. A long-lived Page access token → `.env` as `META_PAGE_TOKEN`, then
   `node scripts/social/meta-reel.js --check` to find your `META_IG_USER_ID`.

Two things that will bite you regardless of approval:

* **Instagram will not accept a file upload** — it needs a public HTTPS URL it
  can fetch itself. Commit the video to `marketing/video/`, push, and Vercel
  serves it at a URL you can pass to `--video-url`. Facebook, inconsistently,
  wants the local file. The script handles both; you supply both.
* **Watermarked reposts get demoted, heavily.** A video scraped from TikTok
  carries a TikTok watermark and both platforms suppress it. Export
  watermark-free from the original editor instead.

**And only post videos you own.** Re-posting someone else's clip as PawHaul
content is copyright infringement and a ToS violation on every platform
involved, credited or not.

**My honest read:** posting two Reels a week by hand takes less total effort
than this approval process, and gets the same result. Do items 1–5 first, and
come back to this only if Reels turn out to be a channel that works for you.

---

## 9. QR codes — done

`marketing/pawhaul-qr.png` (plain), `pawhaul-qr-logo.png` (paw badge in the
centre), `pawhaul-qr.svg` (vector — this is the one to hand a printer). All
point at `https://pawhaul.vercel.app`.

Regenerate any time with `python scripts/make_qr.py`.

Print rules that actually matter: never smaller than 2cm × 2cm, never crop the
white border in, and never invert it to light-on-dark — that last one breaks a
lot of phone scanners.

---

## What I could not do, and why

| | Why not |
|---|---|
| Verify the site with Google / Bing / Pinterest | Each requires a logged-in account only you can create. The code paths are ready; they need the codes. |
| Create the Merchant Center account | Same — account creation and business identity. |
| Build the email automation in Shopify | No public API exists for creating automations or email templates. Copy and click-path are written instead. |
| Create the `WELCOME10` discount | Needs Shopify Admin API access, which this site does not have — it only holds a Storefront token. |
| Post to Pinterest / Meta | Both need OAuth tokens issued to your accounts after platform review. |
| Turn on Vercel Analytics | Dashboard toggle on your account. |
