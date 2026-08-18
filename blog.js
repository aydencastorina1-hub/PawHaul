// ==================== BLOG DATA ====================
// SEO content posts. This file is loaded BOTH by the browser (renders the
// /blog index and each post) and by the server-side renderer (api/_seo.js
// extracts this array literal by text-matching `var blogPosts = [` and
// evaluating it) so a post's <title>/description/Article schema and its
// crawlable body HTML all come from this one source. Consequences:
//
//   1. This array must stay PURE DATA — no DOM access, no function calls at
//      the top level. The server evaluates the literal in a bare context
//      with no `window`/`document`.
//   2. Bodies use plain template literals. Do NOT put ${...} interpolation
//      in them — the extractor scans for the closing backtick and does not
//      evaluate expressions.
//   3. `body` is raw HTML injected with innerHTML on the client and printed
//      verbatim by the server. Only hand-written content goes here.
//
// Hero images are deliberately reused from the home hero slideshow rather
// than new Unsplash IDs: those four URLs are already known-good and warmed
// in the CDN. Swap them for original photography when there is any.
var blogPosts = [
  {
    slug: 'how-to-stop-a-dog-pulling-on-the-leash',
    title: 'How to Stop a Dog From Pulling on the Leash',
    metaTitle: 'How to Stop a Dog From Pulling on the Leash (7 Steps That Work)',
    metaDescription: 'A step-by-step guide to stopping leash pulling — why dogs pull, the training method that actually works, and the gear that makes it easier.',
    excerpt: 'Pulling is the single most common walk complaint dog owners have. Here is why it happens, and the training approach that fixes it without hurting your dog.',
    date: '2026-07-14',
    updated: '2026-07-14',
    readMins: 7,
    image: 'https://images.unsplash.com/photo-1518056914555-de1d7f0b3967?fm=jpg&fit=crop&q=75&w=1200',
    imageAlt: 'A dog walking calmly on a loose leash beside its owner',
    tags: ['Training', 'Leashes'],
    body: `
<p>If your dog drags you down the street, you are not doing anything wrong as an owner — you are up against basic dog physics. Dogs walk at roughly twice our pace, and when a dog pulls and the walk continues anyway, the pulling gets rewarded. Every single time. Most dogs have had that lesson reinforced hundreds of times before anyone tries to fix it.</p>
<p>The good news is that leash pulling is one of the most fixable dog behaviours there is. It does not require a specialist, a shock collar, or months of work. It requires understanding one rule and applying it consistently for about two weeks.</p>

<h2>Why dogs pull on the leash</h2>
<p>There are three reasons, and they stack:</p>
<ul>
  <li><strong>Pulling works.</strong> The dog pulls toward a smell, you follow, the dog reaches the smell. From the dog's point of view, pulling is a reliable technique for getting places.</li>
  <li><strong>The opposition reflex.</strong> Dogs — like people — instinctively push back against steady pressure. When you brace against a pulling dog, you are physically triggering the dog to pull harder. This is why a tug-of-war on the leash never resolves.</li>
  <li><strong>Walks are overstimulating.</strong> For a dog that gets one walk a day, that walk is the entire day's worth of novelty compressed into thirty minutes. Excitement expresses itself as forward pressure.</li>
</ul>
<p>Notice that none of these are dominance, stubbornness, or a bad dog. They are all mechanical. That matters, because it means the fix is mechanical too.</p>

<h2>The one rule: a tight leash means the walk stops</h2>
<p>This is the whole method. When the leash goes tight, you stop moving. Not a correction, not a yank — you simply become a tree. The moment the leash softens, even slightly, you walk again.</p>
<p>What you are teaching is a single clean association: <em>loose leash makes the world move, tight leash makes the world freeze.</em> Dogs work this out startlingly fast when the rule is applied without exceptions.</p>
<p>Two things make or break it:</p>
<ul>
  <li><strong>Consistency beats intensity.</strong> One walk where you let the pulling slide teaches the dog the rule is negotiable, and negotiable rules get tested forever.</li>
  <li><strong>Your timing has to be immediate.</strong> Stop the instant the leash tightens, restart the instant it loosens. A two-second delay and the dog cannot tell what you are responding to.</li>
</ul>

<h2>The seven-step routine</h2>
<ol>
  <li><strong>Start indoors or in the yard.</strong> A hallway with no squirrels is a fair place to introduce a new rule. The street is an exam, not a lesson.</li>
  <li><strong>Pick your side and stay on it.</strong> Left or right does not matter; switching does. A consistent side gives the dog a position to find.</li>
  <li><strong>Hold the leash with slack in it.</strong> If you walk with a permanently taut leash, there is no "loose" state for the dog to discover.</li>
  <li><strong>Stop dead the moment it tightens.</strong> Say nothing. Do not pull back. Just stop.</li>
  <li><strong>Wait for slack.</strong> The dog will eventually look back, step back, or sit. The instant the line softens, say "yes" and walk on.</li>
  <li><strong>Reward the position, not just the absence of pulling.</strong> When the dog is walking near your leg on a loose line, that is the behaviour you want to see more of — mark it and treat it. Punishing pulling teaches what not to do; rewarding position teaches what to do instead.</li>
  <li><strong>Add distraction slowly.</strong> Quiet street, then busier street, then the park. If the dog fails at a level, you moved up too fast — go back one.</li>
</ol>
<p>Expect ten to fifteen minutes of extremely slow walking for the first few sessions. This is normal and it is the actual work. By day four or five most dogs have connected the dots, and by two weeks a loose leash is the default.</p>

<h2>Where the gear comes in</h2>
<p>No piece of equipment trains a dog. What good gear does is remove the friction that makes people quit the training halfway through.</p>
<p>The single biggest hardware factor is leash control. A leash that jams, or that has no way to shorten it quickly, forces you into exactly the bracing tug-of-war that triggers the opposition reflex. A retractable leash with a genuine one-touch lock lets you give a well-behaved dog room to sniff and then shorten the line instantly when a distraction appears — and locking the line short is a very different action from hauling on it.</p>
<div class="blog-cta">
  <p><strong>Gear that helps:</strong> the <a href="/product/retractable-dog-leash">Retractable Dog Leash</a> has a one-touch lock button and a jam-free mechanism, in 10ft and 16ft lengths. Being able to fix the length in one thumb press is what makes the stop-and-go method practical on a real street.</p>
</div>

<h2>Free your hands</h2>
<p>The second friction point is more mundane: you cannot train a dog while juggling. Loose-leash work needs one hand on the leash and one hand free for treats and for marking good position. If one hand is permanently occupied by a bag of waste, the training simply does not happen.</p>
<p>This is worth solving properly. A <a href="/product/poop-bag-clip">hands-free poop bag clip</a> takes the used bag off your hand and onto the leash, and a <a href="/product/poop-bag-holder">bag holder</a> keeps the unused roll where you can reach it without stopping and searching your pockets. Small things — but they are the difference between doing the routine and skipping it.</p>

<h2>What not to do</h2>
<ul>
  <li><strong>Do not yank the leash.</strong> It triggers the opposition reflex, it can hurt the dog's neck and trachea, and it teaches nothing because the dog cannot tell what the yank refers to.</li>
  <li><strong>Do not switch methods every few days.</strong> Most "this doesn't work" reports are actually three different methods applied for four days each.</li>
  <li><strong>Do not train on the walk your dog has waited all day for.</strong> A dog at peak excitement cannot learn. Take the edge off with five minutes in the yard first.</li>
  <li><strong>Do not expect a straight line of progress.</strong> Dogs regress after a good week. That is normal learning, not failure.</li>
</ul>

<h2>How long it should take</h2>
<p>For a young dog with a consistent handler: noticeable improvement in three to five days, a reliable loose leash in two to three weeks. For an older dog with years of successful pulling behind it, double that. The variable is almost never the dog — it is how consistently the rule gets applied by every person who walks it.</p>
<p>Get everyone in the household on the same rule before you start. One family member who lets the dog pull will hold the whole process back indefinitely.</p>
`
  },
  {
    slug: 'how-to-keep-your-dog-visible-at-night',
    title: 'How to Keep Your Dog Visible on Night Walks',
    metaTitle: 'How to Keep Your Dog Visible at Night: A Safety Guide for Walks',
    metaDescription: 'Drivers need far more stopping distance than most owners realise. Here is how far away your dog is actually visible at night, and how to fix it.',
    excerpt: 'A driver at 30mph needs about 75 feet to stop. An unlit dog on a dark road is visible from about 55. Here is how to close that gap.',
    date: '2026-07-24',
    updated: '2026-07-24',
    readMins: 6,
    image: 'https://images.unsplash.com/photo-1597330223703-9b11c4dba2bd?fm=jpg&fit=crop&q=75&w=1200',
    imageAlt: 'A dog on an evening walk in low light',
    tags: ['Safety', 'Night Walks'],
    body: `
<p>Most dog owners think about night visibility in terms of whether <em>they</em> can see. That is the wrong question. The question that matters is how far away a driver can see your dog, and the honest answer is: much less far than you would guess.</p>

<h2>The numbers that actually matter</h2>
<p>A car travelling at 30mph covers roughly 44 feet every second. Add human reaction time — about 1.5 seconds for an alert driver, longer for a tired one — and the total stopping distance lands around 75 to 90 feet.</p>
<p>Against that, here is roughly how far away you are detectable on an unlit road:</p>
<ul>
  <li><strong>Dark clothing and a dark dog:</strong> around 55 feet. That is inside the stopping distance. The driver physically cannot stop in time.</li>
  <li><strong>Reflective strips:</strong> around 500 feet — but <em>only</em> when a headlight is pointed at them. Reflective material produces no light of its own. At a junction, when a car is turning, or when you are approached from an angle, reflective gear can be effectively invisible.</li>
  <li><strong>Active light (LED):</strong> visible from around 1,000 feet, from any angle, with or without headlights on you.</li>
</ul>
<p>That distinction between reflective and active light is the single most important thing in this article. Reflective gear is a good second layer. It is not a primary safety system, because it depends entirely on someone else's light source hitting it at the right angle.</p>

<h2>Why dogs are harder to see than people</h2>
<p>Three things work against a dog specifically:</p>
<ul>
  <li><strong>They are low to the ground</strong>, below the brightest part of most headlight beams and below a driver's natural eye line.</li>
  <li><strong>They are often ahead of or beside you</strong> — sometimes several feet into the road on a long line — so the dog enters a driver's path before you do.</li>
  <li><strong>Dark fur absorbs light.</strong> A black dog at night is genuinely close to invisible; owners of black dogs consistently overestimate how visible their dog is, because they know where the dog is.</li>
</ul>

<h2>Build visibility in layers</h2>
<p>Aim for three independent layers, so that no single failure leaves you dark.</p>
<h3>Layer one: active light on the dog</h3>
<p>This is the one that does the heavy lifting. A lit collar puts a light source at the dog's neck, which is the highest point of the dog and the part most likely to enter the road first.</p>
<p>Look for three things when choosing one: <strong>USB rechargeable</strong> (coin-cell versions die without warning and get abandoned), <strong>multiple modes</strong>, and a <strong>proper fit for your dog's neck size</strong>. On mode: a steady glow is easier for a driver to track and judge distance against, while a blink is more attention-grabbing in busy traffic. Fast blink on roads, steady glow on paths is a reasonable default.</p>
<div class="blog-cta">
  <p><strong>Gear that helps:</strong> the <a href="/product/light-up-dog-collar">Light Up Dog Collar</a> is USB rechargeable with three modes — fast blink, slow blink and steady glow — and comes in four neck sizes from 13 to 22 inches. It's detachable, so it goes over the collar your dog already wears rather than replacing it.</p>
</div>

<h3>Layer two: light on you</h3>
<p>A driver who sees a person and then spots movement at ground level will slow down. A driver who sees nothing will not. Clip a light to your jacket or carry one — a phone torch pointed down and slightly ahead is better than nothing, though it ruins your own night vision if you point it too far out.</p>

<h3>Layer three: findability if the worst happens</h3>
<p>Visibility gear stops accidents. It does nothing once a spooked dog has slipped its collar and bolted into the dark — and fireworks, thunder and a car backfiring all cause exactly that. A Bluetooth tracker on the collar means the difference between searching and knowing.</p>
<p>The weak point of tracker setups is almost always the attachment. A tag that swings on a split ring works loose over months of movement. A waterproof tracker holder with a twist-lock closure keeps the tracker fixed to the collar and sealed against rain and puddles — the two things that actually kill tracker setups.</p>

<h2>Route choices matter as much as gear</h2>
<ul>
  <li><strong>Walk facing traffic</strong> where there is no pavement, so you can see cars coming and react rather than being approached from behind.</li>
  <li><strong>Keep the dog on the side away from the road.</strong> If you are facing traffic, the dog should be on your left, with your body between the dog and the cars.</li>
  <li><strong>Shorten the leash near roads and junctions.</strong> A dog on 16 feet of line at a junction can be in the road while you are still on the pavement. This is exactly what a leash lock button is for.</li>
  <li><strong>Assume you have not been seen</strong> at every crossing until a car has visibly slowed.</li>
</ul>

<h2>The gear people forget in winter</h2>
<p>Night walks in winter are also cold walks, and cold weather quietly changes what your dog needs. Dogs still dehydrate in the cold — they just do not look like they are panting for it, so owners skip water. On longer evening walks, carry it. A <a href="/product/2-in-1-dog-water-bottle">bottle with a flip-out spout</a> or a <a href="/product/collapsible-dog-bowl">collapsible bowl</a> takes ten seconds to use and removes any reason to cut a walk short.</p>

<h2>A quick pre-walk check</h2>
<p>It takes fifteen seconds and it catches almost everything:</p>
<ul>
  <li>Is the collar light charged and switched on?</li>
  <li>Is the tracker attached and seated in its holder?</li>
  <li>Does the collar fit — two fingers under it, no more?</li>
  <li>Do you have a light on you as well as on the dog?</li>
  <li>Is the leash lock working?</li>
</ul>
<p>The most common failure is not missing gear. It is a collar light that ran flat two walks ago and nobody noticed. Charge it on the same day each week and the problem disappears.</p>
`
  },
  {
    slug: 'what-to-bring-on-a-dog-walk-checklist',
    title: 'What to Bring on a Dog Walk: The Complete Checklist',
    metaTitle: 'What to Bring on a Dog Walk: Complete Checklist (2026)',
    metaDescription: 'Everything worth carrying on a dog walk, sorted by walk length — the five essentials, what to add past 30 minutes, and what you can safely leave home.',
    excerpt: 'Sorted by how long you are actually going out for, from a ten-minute block loop to a half-day hike. Plus the items people carry that they do not need.',
    date: '2026-08-01',
    updated: '2026-08-01',
    readMins: 8,
    image: 'https://images.unsplash.com/photo-1648304887391-a6c2cf2228e4?fm=jpg&fit=crop&q=75&w=1200',
    imageAlt: 'A dog and owner setting out on a walk',
    tags: ['Checklists', 'Walk Gear'],
    body: `
<p>Most dog walk checklists are the same undifferentiated list of twenty items, which is useless — you do not need the same kit for a ten-minute block loop as for a three-hour trail. This one is sorted by how long you are actually going out for.</p>

<h2>The five essentials (every walk, no exceptions)</h2>
<p>If you carry nothing else, carry these.</p>
<ol>
  <li><strong>A leash you trust.</strong> Check the clip. Leash hardware fails at the clip, almost always, and almost always after a period of getting stiff and stickier to open. If yours is showing that, replace it now rather than after the incident.</li>
  <li><strong>ID on the collar.</strong> Microchips are excellent and require someone to catch your dog and take it to a vet or shelter first. A physical tag gets your dog home from a neighbour in twenty minutes.</li>
  <li><strong>Waste bags — more than one.</strong> Two is the minimum. Dogs go twice more often than people plan for, and the second time is invariably the walk you brought exactly one bag.</li>
  <li><strong>A way to carry the used bag.</strong> Genuinely a core item, not a luxury. Otherwise you spend the rest of the walk one-handed, which means no phone, no treats, no real leash control.</li>
  <li><strong>Your phone.</strong> Not for scrolling — for the vet's number, a torch, and a photo of your dog if you ever have to show someone what you are looking for.</li>
</ol>
<div class="blog-cta">
  <p><strong>Solving number four properly:</strong> the <a href="/product/poop-bag-clip">Poop Bag Clip</a> holds a tied-off bag on the leash so both your hands stay free, and the <a href="/product/poop-bag-holder">Poop Bag Holder</a> carries the unused roll on a carabiner so you are never searching your pockets one-handed with a dog pulling.</p>
</div>

<h2>Walks over 30 minutes: add water</h2>
<p>Thirty minutes is roughly the line where water stops being optional, and it moves a lot earlier in heat — over about 24°C, take water on any walk at all.</p>
<p>Dogs cool themselves by panting, which means they lose water much faster than we do while showing far fewer obvious signs. By the time a dog is visibly struggling, it has been dehydrated for a while.</p>
<p>You have two sensible options:</p>
<ul>
  <li>An <strong>all-in-one bottle</strong> with a flip-out drinking trough. Best for street and park walks — one item, one hand, nothing to assemble. The <a href="/product/2-in-1-dog-water-bottle">2-in-1 Dog Water Bottle</a> also seals a dry food compartment into the same body, which covers the longer outings where a meal lands mid-walk.</li>
  <li>A <strong>collapsible bowl</strong> plus whatever bottle you are already carrying for yourself. Best when you are bringing your own water anyway and would rather not carry two bottles. A <a href="/product/collapsible-dog-bowl">silicone bowl</a> folds flat, clips to a belt loop with its carabiner, and weighs almost nothing.</li>
</ul>
<p>Both work. Which suits you comes down to whether you would rather carry one combined item or clip a flat disc to your bag.</p>

<h2>Evening and early-morning walks: add light</h2>
<p>From autumn onward most weekday walks happen in the dark at one end or the other. The rule is that reflective strips are a supplement and an active light is the actual safety item — reflective material only works when a headlight is aimed at it, which is exactly not the case at junctions and turns.</p>
<p>A <a href="/product/light-up-dog-collar">rechargeable LED collar</a> puts a light source on the dog that works from any angle and does not depend on anyone else's headlights. Charge it weekly on a fixed day; the usual failure mode is a flat light nobody noticed.</p>

<h2>Off-leash areas: add a tracker</h2>
<p>If your dog goes off leash anywhere, a Bluetooth tracker is the highest-value thing you can add. The attachment is the part that matters — a tag on a split ring works loose over months, and a soaked tracker is a dead tracker. A waterproof holder with a twist-lock handles both.</p>

<h2>Long walks and hikes (90+ minutes)</h2>
<ul>
  <li><strong>More water than you think.</strong> Plan for roughly 30ml per kilogram of dog per hour in warm weather, more for a working breed.</li>
  <li><strong>Food.</strong> Either the sealed compartment on a 2-in-1 bottle or a small pouch of kibble. A dog that has burned through its energy two hours from the car is a serious problem.</li>
  <li><strong>A basic first aid kit:</strong> vet wrap, gauze, tweezers for thorns and ticks, and a tick remover. Paw injuries are by far the most common trail issue.</li>
  <li><strong>Paw protection or at least a paw check.</strong> Hot tarmac in summer and grit salt in winter both do real damage.</li>
  <li><strong>A spare leash or a length of cord.</strong> Redundancy for the one failure that actually strands you.</li>
</ul>

<h2>Weather-specific additions</h2>
<h3>Hot weather</h3>
<p>Walk early or late; do the seven-second test on tarmac with the back of your hand before setting out. Carry more water than feels necessary and offer it every fifteen to twenty minutes rather than waiting for the dog to ask.</p>
<h3>Cold weather</h3>
<p>Short-coated and small dogs lose heat fast. Dogs still dehydrate in the cold — they just do not look like it, so water gets skipped. Rinse salt off paws when you get home.</p>
<h3>Rain</h3>
<p>Check that whatever electronics you have on the collar are actually waterproof rather than "water resistant". Trackers and lights are the two items that quietly die over a wet winter.</p>

<h2>What you can leave at home</h2>
<p>For an ordinary walk, most of the things sold as walk essentials are not:</p>
<ul>
  <li><strong>A full first aid kit</strong> on a twenty-minute street walk. You are minutes from home.</li>
  <li><strong>Multiple toys.</strong> One, if you are going somewhere they will actually be used.</li>
  <li><strong>A second leash</strong> for anything short of a hike.</li>
  <li><strong>Bulky treat pouches</strong> — a handful in a pocket does the job unless you are running a training session.</li>
</ul>
<p>The failure mode with dog gear is not owning too little. It is owning so much that you stop taking any of it, and end up walking out with a leash and one bag because assembling the kit became a chore. Keep the everyday set small enough that it lives by the door and goes with you automatically.</p>

<h2>The by-the-door test</h2>
<p>Everything on the essentials list should live in one place near the door and require zero decisions. Bags in the holder on the leash, light on the collar, bottle filled and ready. If getting out of the house takes more than about fifteen seconds of preparation, the gear will gradually stop coming with you — and gear you leave at home protects nobody.</p>
`
  },
  {
    slug: 'how-much-water-does-a-dog-need-on-a-walk',
    title: 'How Much Water Does a Dog Need on a Walk?',
    metaTitle: 'How Much Water Does a Dog Need on a Walk? (Simple Formula)',
    metaDescription: 'A simple formula for how much water to carry, when to offer it, and the early signs of dehydration most owners miss until it is well advanced.',
    excerpt: 'A simple formula by dog weight and walk length, when to offer water, and the early dehydration signs most owners miss.',
    date: '2026-08-08',
    updated: '2026-08-08',
    readMins: 6,
    image: 'https://images.unsplash.com/photo-1618946019619-9d7b7d86b48f?fm=jpg&fit=crop&q=75&w=1200',
    imageAlt: 'A dog drinking water during a walk',
    tags: ['Health', 'Hydration'],
    body: `
<p>Dogs are much worse at regulating hydration than people are, and much better at hiding that anything is wrong. They cannot sweat meaningfully, they cool almost entirely by panting, and panting is itself a significant route of water loss. By the time a dog looks like it needs water, it has needed water for a while.</p>

<h2>The baseline: how much a dog drinks in a day</h2>
<p>The standard veterinary figure is roughly <strong>50ml of water per kilogram of body weight per day</strong> — about 1 fluid ounce per pound. For common sizes:</p>
<ul>
  <li><strong>5kg / 11lb</strong> (small terrier): about 250ml a day</li>
  <li><strong>10kg / 22lb</strong> (French bulldog): about 500ml a day</li>
  <li><strong>20kg / 44lb</strong> (border collie): about 1 litre a day</li>
  <li><strong>30kg / 66lb</strong> (labrador): about 1.5 litres a day</li>
  <li><strong>40kg / 88lb</strong> (german shepherd): about 2 litres a day</li>
</ul>
<p>That is a resting baseline in mild weather. Exercise and heat both push it up substantially.</p>

<h2>The walk formula</h2>
<p>For working out what to carry, this is close enough and easy to remember:</p>
<p><strong>Mild weather (under about 20°C): 15ml per kg of dog, per hour of walking.</strong><br>
<strong>Warm weather (over about 25°C): 30ml per kg of dog, per hour.</strong></p>
<p>So a 20kg dog on a one-hour summer walk wants roughly 600ml available. A 10kg dog on a 30-minute mild walk wants around 75ml — a couple of mouthfuls, which is why a full bottle is rarely necessary for short walks.</p>
<p>Two adjustments worth making: add roughly 50% for a flat-faced breed (pugs, bulldogs, boxers — they pant far less efficiently and overheat much faster), and add roughly 50% for a dog that is actually running rather than walking.</p>

<h2>When to offer it</h2>
<p>Little and often beats one large drink. A dog that gulps a lot of water at once after hard exercise is at risk of vomiting it straight back up, and in deep-chested breeds a large volume plus exertion is a bloat risk factor.</p>
<ul>
  <li><strong>Under 30 minutes, mild weather:</strong> generally not needed. Water at home before and after is fine.</li>
  <li><strong>30 to 60 minutes:</strong> offer once, roughly halfway.</li>
  <li><strong>Over an hour:</strong> offer every 20 minutes or so.</li>
  <li><strong>Hot weather or hard exercise:</strong> every 15 minutes, small amounts, and rest in shade while they drink.</li>
</ul>
<p>Offer, do not force. A dog that turns water down twice in a row in mild weather is genuinely fine. A dog that refuses water while panting heavily in the heat is a warning sign, not reassurance.</p>

<h2>The early signs of dehydration</h2>
<p>Most owners know the late signs and miss the early ones. In rough order of appearance:</p>
<ol>
  <li><strong>Thick, ropey saliva.</strong> Usually the first thing you can actually observe.</li>
  <li><strong>Panting that does not settle</strong> within a few minutes of stopping.</li>
  <li><strong>Dry or tacky gums.</strong> Press a finger to the gum — the colour should return within about two seconds.</li>
  <li><strong>Loss of skin elasticity.</strong> Gently lift the skin between the shoulder blades. It should drop straight back; a slow return means dehydration is already well established.</li>
  <li><strong>Sunken-looking eyes and lethargy.</strong> Late signs. At this point the walk ends and you head for shade and a vet call.</li>
</ol>
<p>The gum test is the one worth practising on a healthy dog, so you know what normal feels like on your dog before you ever need the comparison.</p>

<h2>Carrying it without the hassle</h2>
<p>The reason dogs go without water on walks is almost never that owners do not care. It is that the setup is annoying — a human bottle you have to cup your hand under, or a bowl at the bottom of a bag, and the walk is short so you skip it.</p>
<p>Two setups remove that friction:</p>
<ul>
  <li><strong>An integrated bottle</strong> with a flip-out trough. One hand, no assembly, nothing to hold. The <a href="/product/2-in-1-dog-water-bottle">2-in-1 Dog Water Bottle</a> comes in 350ml and 550ml — use the formula above to pick. A 20kg dog on hour-long summer walks wants the 550ml; a small dog on 30-minute walks is well covered by the 350ml. It also seals a dry food compartment in the same body, which matters on longer outings.</li>
  <li><strong>A collapsible bowl</strong> with whatever bottle you already carry. The <a href="/product/collapsible-dog-bowl">silicone bowl</a> folds flat, clips on with a carabiner, and pops open in a second. It also holds a lot more than a cupped hand, which makes a real difference for a big dog.</li>
</ul>

<h2>Puddles, streams, and other people's bowls</h2>
<p>Standing water is worth avoiding where you reasonably can. Puddles, ponds and communal bowls carry giardia, leptospirosis and blue-green algae — the last of which is genuinely lethal and blooms in warm, still water in summer. Rivers and fast-moving streams are lower risk but not zero.</p>
<p>Carrying your own water is not fussiness; it is the straightforward way to remove that category of risk entirely.</p>

<h2>Water in cold weather</h2>
<p>The most commonly skipped case. Dogs still lose water through panting in winter — cold air is very dry, and a dog working hard in the cold pants just as much. Because neither of you feels hot, the water stays at home. On winter walks over an hour, take it anyway.</p>

<h2>The short version</h2>
<ul>
  <li>15ml per kg per hour in mild weather, 30ml per kg per hour when it is warm.</li>
  <li>Small amounts often, not one big drink.</li>
  <li>Under 30 minutes in mild weather, you can skip it.</li>
  <li>Learn the gum test before you need it.</li>
  <li>Whatever you carry, it has to be easy — or it stays home.</li>
</ul>
<p class="blog-note">This article is general guidance, not veterinary advice. If you are worried about your dog's hydration or it is showing any of the later signs above, contact your vet.</p>
`
  }
];

// Browser-only export shim: the server-side extractor never runs this file,
// it only evaluates the array literal above (see the header comment).
if (typeof window !== 'undefined') { window.blogPosts = blogPosts; }
