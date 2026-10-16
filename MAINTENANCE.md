# Maintenance mode

While maintenance mode is on, every visitor to pawhaulstore.com sees the
"We're Making Improvements" page (`maintenance.html`) instead of the store.

## What it touches

Only two things:

1. **`maintenance.html`**: the page itself. It's standalone; it doesn't load
   the store's code, so no products, cart or checkout buttons can show.
2. **One route in `vercel.json`**: the entry whose `"dest"` is
   `"/maintenance.html"`. It sends every storefront address (home, shop,
   product pages, cart, wishlist, bundles, blog, about, contact, sitemap and
   the Google product feed) to the maintenance page, with HTTP status 503
   ("temporarily unavailable"), which tells search engines the closure is
   temporary.

Nothing else was changed. Products, product data, images, the Shopify
integration (`api/cart.js`, `api/shop.js`, `api/customer.js`), checkout and
the chatbot are all exactly as they were, just not reachable through the
storefront pages while this is on.

## Turn maintenance mode OFF (restore the store)

Delete this one entry from the `"routes"` list in `vercel.json`, then commit
and push to `main`. Vercel redeploys and the full store is back:

```json
{
  "src": "/(?!(?:images|fonts)/|api/(?!render|sitemap|feed)|maintenance\\.html$|favicon|apple-touch-icon\\.png$|robots\\.txt$).*",
  "dest": "/maintenance.html",
  "status": 503
},
```

You can leave `maintenance.html` in the repo; nothing links to it once the
route is gone, so it's ready if you ever need it again.

## Turn maintenance mode back ON later

Add the same entry back to `vercel.json`, directly **before** the line
`{ "src": "/shop/(.+)", "status": 301, ... }`, then commit and push. (It must
come after the two cache-header routes so the page isn't cached by browsers,
and before everything else so it wins.)

## Checking it

- On: any page, e.g. `pawhaulstore.com/shop`, shows "We're Making
  Improvements".
- Off: the home page and `/shop` show the store again. Hard-refresh if a tab
  was already open.
