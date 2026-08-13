# WELCOME10 email sequence — paste-ready copy

Three emails, sent automatically to anyone who submits the email popup or the
home-page offer box. Everything below is written to be pasted straight into
Shopify's email editor. Click path and settings are in `MARKETING-SETUP.md`
(step 5) — this file is only the words.

**Why this is copy and not code:** Shopify Messaging automations are built in
the admin UI. There is no public API for creating an email automation or an
email template, and Shopify Flow has no create-workflow endpoint either — so
the sequence itself cannot be scripted from this repo, and neither can the
WELCOME10 discount code. What the repo *does* handle automatically is the part
that triggers all of it: `api/customer.js` creates the Shopify customer with
`acceptsMarketing: true`, which is what puts them in the "subscribed" state the
automation listens for.

**Send schedule**

| # | When | Purpose |
|---|------|---------|
| 1 | Immediately | Deliver the code. This is the only email they are actually waiting for. |
| 2 | 3 days later | Best sellers. Shown only to people who have not ordered. |
| 3 | 7 days after signup | Last reminder before the code stops feeling relevant. |

Emails 2 and 3 must be conditioned on **"Customer has not placed an order"**,
or you will email a discount reminder to somebody who already bought. That
condition is a step you add in the automation editor, not something in the copy.

---

## Email 1 — sent immediately

**Subject:** Here's your 10% off 🐾
**Preview text:** Your code is inside — plus the three things worth buying first.

**Headline:** Welcome to PawHaul

**Body:**

> Thanks for signing up. Here's the 10% off you came for:
>
> **WELCOME10**
>
> Use it at checkout on anything in the shop. Free shipping is already included
> on every order, so the discount comes off the top.
>
> We make one kind of thing: gear for the walk. Leashes that don't jam, bottles
> that don't leak in a bag, collars you can actually see from down the street.
> No dog beds, no toys, no filler.

**Button:** Shop walk gear → `https://pawhaul.vercel.app/shop`

**Footer line:** Questions about an order? Just reply, or email
pawhaulsupport@gmail.com — we answer within 24 hours.

---

## Email 2 — 3 days later (skip if they've ordered)

**Subject:** The three we sell the most of
**Preview text:** Still 10% off with WELCOME10.

**Headline:** What most people start with

**Body:**

> If you're not sure where to begin, these three are the ones that move:
>
> **Retractable Dog Leash — from $17.99**
> One-touch lock, anti-slip grip, 10ft and 16ft. The jam-free braking is the
> whole point — cheap retractables stick, and you find out at the worst moment.
>
> **2-in-1 Dog Water Bottle — from $19.99**
> Water and dry food in one leak-proof bottle with a flip-out drinking spout.
> 350ml for neighbourhood loops, 550ml for real distance.
>
> **Light Up Dog Collar — from $19.99**
> USB rechargeable, three light modes, four neck sizes. If you walk after dark
> at all, this is the one that actually changes something.
>
> **WELCOME10** still works — 10% off, free shipping.

**Button:** See all seven → `https://pawhaul.vercel.app/shop`

---

## Email 3 — 7 days after signup (skip if they've ordered)

**Subject:** What to bring on a dog walk (short list)
**Preview text:** Last call on your 10% off.

**Headline:** The walk checklist

**Body:**

> We wrote this because we kept answering it: here's what's actually worth
> carrying on a walk, sorted by how long you're going out for.
>
> **[Read: What to Bring on a Dog Walk →](https://pawhaul.vercel.app/blog/what-to-bring-on-a-dog-walk-checklist)**
>
> Two more that answer the questions we get most:
> • [How much water does a dog need on a walk?](https://pawhaul.vercel.app/blog/how-much-water-does-a-dog-need-on-a-walk)
> • [How to stop a dog pulling on the leash](https://pawhaul.vercel.app/blog/how-to-stop-a-dog-pulling-on-the-leash)
>
> And if you still want it: **WELCOME10** takes 10% off anything in the shop.

**Button:** Shop walk gear → `https://pawhaul.vercel.app/shop`

---

## Before you turn it on

1. **The WELCOME10 code has to exist in Shopify.** The site has been showing
   this code in the popup and the home-page offer box the whole time — if it
   was never created as a real discount, every one of these emails sends a dead
   code. Check: Shopify admin → **Discounts** → search `WELCOME10`. If it isn't
   there: **Create discount** → *Amount off order* → code `WELCOME10` → 10% →
   all products → limit **one use per customer**.

2. **Check that popup signups are landing as "Subscribed".** This is the
   linchpin — if they land as "Not subscribed", the automation never fires and
   nothing above ever sends. Sign up with a throwaway address on the live site,
   then look at Shopify admin → **Customers** → that address → the *Email
   subscription* status should read **Subscribed**.

3. **If it reads "Pending" instead, double opt-in is on.** Shopify then waits
   for the customer to click a confirmation email before the welcome automation
   runs, which will quietly cost you most of the sequence. Turn it off under
   the email subscriber settings, or accept the confirmation step and say so in
   the popup copy.

4. **Send a test of each email to yourself** before turning the automation on
   (**Send test** in the editor). Check it on a phone — that is where nearly
   all of it gets read.
