var chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  var win = document.getElementById('chatWindow');
  var btn = document.getElementById('chatToggle');
  win.style.display = chatOpen ? 'block' : 'none';
  btn.innerHTML = chatOpen ? '&#10005;' : '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" width=\"28\" height=\"28\" fill=\"white\"><ellipse cx=\"50\" cy=\"67\" rx=\"20\" ry=\"16\"/><ellipse cx=\"27\" cy=\"47\" rx=\"9\" ry=\"12\"/><ellipse cx=\"42\" cy=\"35\" rx=\"9\" ry=\"12\"/><ellipse cx=\"58\" cy=\"35\" rx=\"9\" ry=\"12\"/><ellipse cx=\"73\" cy=\"47\" rx=\"9\" ry=\"12\"/></svg>';
  // input focus removed to prevent keyboard covering chat on mobile
}

function askQuick(question) {
  document.getElementById('chatInput').value = question;
  sendChat();
}

function addMsg(text, isUser) {
  var msgs = document.getElementById('chatMessages');
  var row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:8px;align-items:flex-start;' + (isUser ? 'flex-direction:row-reverse;' : '');

  var av = document.createElement('div');
  av.style.cssText = 'width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;font-weight:800;' + (isUser ? 'background:#1a1a2e;color:white;' : 'background:#E8630A;color:white;');
  av.textContent = isUser ? 'You' : String.fromCodePoint(128062);

  var bub = document.createElement('div');
  bub.style.cssText = 'padding:9px 13px;max-width:210px;font-size:13px;font-weight:600;line-height:1.5;' + (isUser ? 'background:#E8630A;color:white;border-radius:14px 14px 4px 14px;' : 'background:white;color:#1a1a2e;border-radius:14px 14px 14px 4px;box-shadow:0 2px 8px rgba(0,0,0,0.06);');
  bub.textContent = text;

  row.appendChild(av);
  row.appendChild(bub);
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
}


var pawhaul_history = [];

// ── CLAUDE AI CHATBOT ─────────────────────────────────────────
var PAWHAUL_API_KEY = ''; // Paste your Anthropic API key here
var chatHistory = [];

var SYSTEM_PROMPT = "You are Haul, PawHaul's friendly customer support assistant. You love dogs and want to help customers find the right gear. Be warm, concise (2-4 sentences max), and confident. Use a paw emoji occasionally but not in every message.\n\nYOUR ROLE:\n- Give confident product recommendations based on what the customer tells you\n- Ask one clarifying question if needed (dog size? lifestyle? problem they want to solve?)\n- When someone buys one product, mention a useful companion product\n- Be honest - if a product may not suit someone, say so\n\nPRODUCTS:\n\n1. Walk Kit 2-in-1 - .99 (was .99)\nHolds fresh water AND dry food separately in one bottle. Sizes: 350ml (small dogs, short walks) or 550ml (big dogs, long hikes). Colors: Pink, Blue, White. 100% leak proof, lightweight, easy to clean. Best for owners who hate carrying multiple things. Common question about leak proof - yes, the seal is tested and customers use it daily.\n\n2. Leash + Poop Bag Dispenser - .99 (was .99)\nPremium leash with bag dispenser built into the handle. Includes starter roll of bags. Reflective stitching for night safety. Sizes: Standard or Heavy Duty (strong pullers, large breeds). Colors: Black, Blue, Pink. Replacement bags are standard size, available anywhere.\n\n3. Collapsible Travel Bowl - .99 (was .99)\nBPA-free food-grade silicone bowl that folds flat to fit in any pocket. Sizes: Small (approx 8oz, toy and small breeds) or Large (approx 16oz, medium and large breeds). Colors: Orange, Blue, Green. Dishwasher safe, carabiner clip included. Pairs perfectly with the Walk Kit for a complete hydration setup.\n\n4. AirTag Dog Tag Holder - .99 (was .99)\nWaterproof silicone holder that securely attaches an Apple AirTag to any dog collar. Universal size fits all collars. Colors: Black, Orange, Pink. IMPORTANT: Apple AirTag is NOT included - customers need to buy that separately from Apple (around ). Best for iPhone users, especially with adventurous or escape-prone dogs.\n\n5. Hands-Free Running Leash - .99 (was .99)\nWaist belt leash for running, hiking, or walking completely hands-free. One size fits all with adjustable belt. Colors: Black, Orange, Blue. Bungee section absorbs sudden pulls so you are not jolted. Includes water bottle holder and phone pocket with reflective accents. Best for runners and hikers. Less ideal for dogs that lunge very unpredictably.\n\n6. Reflective Safety Collar - .99 (was .99)\n360-degree reflective strips visible up to 500 feet away in headlights. Sizes: Small (10-14 inch neck), Medium (14-18 inch), Large (18-24 inch). Colors: Orange, Blue, Pink, Black. Durable all-weather nylon. Best for early morning and evening walkers, especially important for dark-colored dogs.\n\nGOOD BUNDLES TO SUGGEST:\n- Walk Kit + Collapsible Bowl = complete hydration setup for any walk\n- Reflective Collar + Leash with Bag Dispenser = full safety and convenience combo\n- Hands-Free Leash + Walk Kit = everything a runner needs\n- AirTag Holder + Reflective Collar = complete safety combo for peace of mind\n\nPOLICIES:\n- Shipping: FREE on all orders, no minimum. 1-3 day processing then 7-14 business day delivery. Tracking number emailed when shipped.\n- Returns: 30-day returns, no questions asked. Email pawhaulsupport@gmail.com with order number.\n- Damaged items: Email with a photo within 7 days, we send a replacement immediately.\n- Lost packages: Marked delivered but not received - email within 7 days.\n- Support: pawhaulsupport@gmail.com, response within 24 hours.\n- Current sale: All products up to 30% off right now.\n\nRULES:\n- Never invent features, specs, or prices not listed above\n- Never promise a specific delivery date - always give the 7-14 business day range\n- For order issues like tracking, refunds, or damage, always direct to pawhaulsupport@gmail.com\n- Do not discuss topics completely unrelated to PawHaul products or dogs";

async function sendChatToAI(userMessage) {
  if (!PAWHAUL_API_KEY) return null;
  try {
    chatHistory.push({ role: 'user', content: userMessage });
    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PAWHAUL_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: SYSTEM_PROMPT,
        messages: chatHistory
      })
    });
    if (!response.ok) { chatHistory.pop(); return null; }
    var data = await response.json();
    var reply = data.content[0].text;
    chatHistory.push({ role: 'assistant', content: reply });
    return reply;
  } catch(e) { chatHistory.pop(); return null; }
}

function sendChat() {
  var input = document.getElementById("chatInput");
  var msg = input.value.trim();
  if (!msg) return;
  input.value = "";
  addMsg(msg, true);
  // pawhaul_history replaced by chatHistory (Claude integration)

  var msgs = document.getElementById("chatMessages");
  var typing = document.createElement("div");
  typing.id = "typing";
  typing.style.cssText = "display:flex;gap:8px;align-items:center;padding:4px 0;";
  typing.innerHTML = "<div style='width:30px;height:30px;border-radius:50%;background:#E8630A;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='16' height='16' fill='white'><ellipse cx='50' cy='67' rx='20' ry='16'/><ellipse cx='27' cy='47' rx='9' ry='12'/><ellipse cx='42' cy='35' rx='9' ry='12'/><ellipse cx='58' cy='35' rx='9' ry='12'/><ellipse cx='73' cy='47' rx='9' ry='12'/></svg></div><div style='background:white;border-radius:14px;padding:10px 14px;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;gap:4px;align-items:center;'><span style='width:7px;height:7px;background:#ddd;border-radius:50%;display:inline-block;animation:bounce 1s infinite 0s'></span><span style='width:7px;height:7px;background:#ddd;border-radius:50%;display:inline-block;animation:bounce 1s infinite 0.2s'></span><span style='width:7px;height:7px;background:#ddd;border-radius:50%;display:inline-block;animation:bounce 1s infinite 0.4s'></span></div>";
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  sendChatToAI(msg).then(function(aiReply) {
    var t = document.getElementById("typing");
    if (t) t.remove();
    var reply = aiReply || think(msg);
    addMsg(reply, false);
    msgs.scrollTop = msgs.scrollHeight;
  });
}

function think(msg) {
  var m = msg.toLowerCase().replace(/[^\w\s]/g, " ").trim();
  var words = m.split(/\s+/);

  function has() {
    for (var i=0; i<arguments.length; i++) if (m.indexOf(arguments[i])>-1) return true;
    return false;
  }
  function hasAll() {
    for (var i=0; i<arguments.length; i++) if (m.indexOf(arguments[i])===-1) return false;
    return true;
  }
  function prev() {
    var last = pawhaul_history.length > 1 ? pawhaul_history[pawhaul_history.length-2].toLowerCase() : "";
    for (var i=0; i<arguments.length; i++) if (last.indexOf(arguments[i])>-1) return true;
    return false;
  }

  // PROFANITY / KIDS BEING FUNNY
  var badWords = ["fuck","shit","ass","bitch","damn","crap","dick","cock","pussy","wtf","stfu","fck","fuk","sht","btch","fag","idiot","stupid","dumb","moron","retard","ugly"];
  for (var b=0; b<badWords.length; b++) {
    if (m.indexOf(badWords[b])>-1) return "Hey, var's keep it friendly here! This is a dog walk store 🐾 Is there something I can actually help you with?";
  }

  // TOTALLY UNRELATED STUFF
  if (has("iphone","charger","android","samsung","laptop","computer","pizza","burger","food","netflix","youtube","tiktok","instagram","snapchat","fortnite","minecraft","roblox","math","homework","school","teacher","weather","news","politics","president","celebrity","music","song","movie","tv show","game","sport","nba","nfl","nhl","covid","virus","stock","crypto","bitcoin","lottery","gun","drug","alcohol","beer","wine","cigarette","date","girlfriend","boyfriend","love","sex","relationship")) {
    return "Ha, I wish I could help with that but I only know about PawHaul walk gear! Ask me about our products, shipping, or returns and I am all yours 🐾";
  }

  // NONSENSE / GIBBERISH
  if (words.length <= 2 && !has("hi","hey","hello","bye","yes","no","ok","sure","help","leash","bowl","collar","bottle","kit","size","price","ship","return","track","color","broken","order","discount","airtag")) {
    return "I am not quite sure what you mean! Try asking something like 'how big is the bottle' or 'how long does shipping take' and I will get you a straight answer.";
  }

  // JUST RANDOM LETTERS
  if (/^[a-z]{1,4}$/.test(m) && !has("hi","hey","bye","ok","yes","no")) {
    return "Hmm that doesn't quite make sense to me! Ask me something about our walk gear and I'll get you sorted 🐾";
  }

  // YES / NO follow up
  if (m === "yes" || m === "yeah" || m === "yep" || m === "yup" || m === "sure") {
    if (prev("color","colour")) return "Which product are you asking about — the Walk Kit, leash, bowl, collar, or AirTag holder?";
    if (prev("size")) return "Which product are you asking about — the bottle, bowl, or collar?";
    return "Great! What would you like to know?";
  }
  if (m === "no" || m === "nope" || m === "nah") return "No problem! Let me know if anything else comes up.";

  // BROKEN / DEFECTIVE - BEFORE ANYTHING ELSE
  if (has("broken","defective","cracked","snapped","fell apart","stopped working","not working","doesnt work","doesn t work","isn t working","wont work","won t work","bust","busted") ||
      hasAll("supposed","broken") || hasAll("supposed","work") || hasAll("supposed","come with") ||
      hasAll("should","work") || hasAll("not","work") || hasAll("come with","iphone") ||
      hasAll("come with","charger") || hasAll("include","charger") || hasAll("come with","anything else")) {
    if (hasAll("come with") && !has("broken","defective","not working")) {
      if (has("iphone","charger","cable","adapter","bluetooth","app","wifi","remote","battery","usb")) return "No it does not come with any electronics or accessories like that. It is a physical walk gear product — just the item itself. Check the product page for exactly what is included!";
      return "Each product comes exactly as described on the product page — just the item itself, no extras unless specifically listed. Which product are you asking about?";
    }
    return "That should absolutely not happen and I am really sorry. Email pawhaulsupport@gmail.com with your order number and a photo — we will send a replacement immediately, no questions asked.";
  }

  // DOES IT COME WITH
  if (hasAll("come with") || hasAll("what is included") || hasAll("what comes") || hasAll("whats in the box") || hasAll("what s in")) {
    if (has("leash","bag","dispenser")) return "The leash comes with the bag dispenser built in plus a starter roll of poop bags. That is everything in the box.";
    if (has("bowl")) return "The collapsible bowl comes on its own with a carabiner clip attached. That is everything included.";
    if (has("collar")) return "The collar comes as is — just the collar itself, adjustable buckle and all.";
    if (has("airtag","air tag")) return "The AirTag holder comes as the silicone holder only. You need to supply your own Apple AirTag — it does not come included.";
    if (has("running","hands free","hands-free","waist")) return "The hands-free leash includes the waist belt, the bungee leash attachment, and a phone pocket. That is everything in the box.";
    return "Each product comes exactly as described. The Walk Kit includes the bottle only. The leash includes a starter bag roll. The AirTag holder does NOT include an AirTag. Which product did you want to know about specifically?";
  }

  // MISSING ORDER
  if (has("never arrived","not arrived","not received","never received","still waiting","where is my order","where is my package") ||
      hasAll("not","here") || hasAll("never","came") || hasAll("havent","received") || hasAll("haven t","received") || hasAll("didnt","receive") || hasAll("didn t","receive")) {
    return "Sorry about that! Check the tracking number in your confirmation email first. If it says delivered but you do not have it, email pawhaulsupport@gmail.com with your order number and we will investigate and fix it right away.";
  }

  // WRONG ITEM
  if (has("wrong item","wrong product","wrong color","wrong size","not what i ordered","not what i got") ||
      hasAll("sent","wrong") || hasAll("got","wrong") || hasAll("received","wrong")) {
    return "That is on us and I am sorry! Email pawhaulsupport@gmail.com with your order number and a photo of what you received. We will ship the correct item immediately.";
  }

  // NEGATIVE / COMPLAINTS
  if (has("sucks","suck","terrible","worst","awful","garbage","trash","hate","disappointed","scam","rip off","ripoff","waste","regret","not good","not happy","not satisfied","not worth","bad product","bad quality","cheap","flimsy","broke after")) {
    return "I am really sorry to hear that — that is not the experience we want for you. Can you tell me more about what went wrong? Or email pawhaulsupport@gmail.com and we will make it right within 24 hours, guaranteed.";
  }

  // COMPLIMENTS
  if (has("love it","love this","amazing","awesome","fantastic","incredible","obsessed","excellent","best purchase","so good","really good","really like","so happy","very happy","works great","works perfectly","perfect product") ||
      hasAll("my dog","loves") || hasAll("dog","love")) {
    return "That honestly makes our day! Your dog is lucky to have such a great owner. Thank you so much for the support — it means everything 🐾";
  }

  // FUNNY / JOKES
  if (has("lol","haha","lmao","lmfao","hehe","😂","😆","joke","jk","just kidding")) {
    return "Ha! I see you. Let me know if there is anything I can actually help with though 😄";
  }

  // WHO / WHAT ARE YOU
  if (has("who are you","what are you","are you a bot","are you ai","are you real","are you human","are you a robot","are you automated","are you chatgpt","are you claude")) {
    return "I am the PawHaul chat assistant — pretty smart but not perfect! For anything tricky a real human at pawhaulsupport@gmail.com has you covered and replies within 24 hours.";
  }

  // GREETINGS
  if (m === "hi" || m === "hey" || m === "hello" || m === "sup" || m === "yo" || m === "hiya" ||
      has("hi there","hey there","hello there","good morning","good afternoon","good evening","whats up","what s up")) {
    return "Hey! Welcome to PawHaul 🐾 Ask me anything about our walk gear, orders, shipping or returns.";
  }

  // GOODBYE
  if (has("bye","goodbye","see ya","see you later","gotta go","ttyl","talk later","have a good")) {
    return "Take care! Hope to see your order soon — your pup is going to love it 🐾";
  }

  // THANKS
  if (has("thank you","thanks","thx","ty","appreciate","helpful","great help")) {
    return "Of course! Let me know if anything else comes up before you order.";
  }

  // SHIPPING TIME
  if (has("how long","how many days","delivery time","shipping time","estimated","eta") ||
      hasAll("when","arrive") || hasAll("when","get here") || hasAll("when","delivered") || hasAll("take","ship") || hasAll("take","deliver")) {
    return "7 to 14 business days from when it ships. You will get a tracking number by email as soon as it is on its way. Shipping is always free.";
  }

  // TRACKING
  if (has("track","tracking number","tracking info","where is my","status of my order") || hasAll("check","order")) {
    return "Your tracking number is in the confirmation email we sent when your order shipped. Can not find it? Email pawhaulsupport@gmail.com with your order number and we will pull it up for you.";
  }

  // RETURNS / REFUNDS
  if (has("return","refund","money back","exchange","send back","give back","cancel","how do i return","want to return")) {
    return "No problem — 30 day returns, no questions asked. Email pawhaulsupport@gmail.com with your order number and we will sort a refund or replacement within 24 hours.";
  }

  // DISCOUNT
  if (has("discount","coupon","promo","promo code","deal","code","sale","cheaper","save money","get money off")) {
    return "Sign up for our email list on the homepage and get 10% off your first order! Everything is already on sale so you would be stacking discounts.";
  }

  // CONTACT
  if (has("contact","speak to","talk to","real person","human","email you","reach you","call","phone number","number")) {
    return "Email us at pawhaulsupport@gmail.com — a real person responds within 24 hours. No bots on that end!";
  }

  // FREE SHIPPING
  if (has("free shipping","shipping cost","shipping fee","how much shipping","cost to ship","pay for shipping")) {
    return "Shipping is always free on every order. No minimum, no exceptions.";
  }

  // LEAK PROOF
  if (has("leak","leakproof","leak proof","spill","waterproof","drip","wet bag")) {
    return "Yes, 100% leak proof. You can throw it in your bag without a single worry.";
  }

  // SAFE / MATERIALS
  if (has("bpa","material","safe for dog","toxic","food grade","food safe","chemical","pet safe","dog safe","is it safe")) {
    return "Everything is BPA free and completely pet safe. The bowl is food-grade silicone and the bottle is food-safe plastic — fully safe for your dog to eat and drink from directly.";
  }

  // PRICE
  if (has("price","cost","how much","expensive","cheap","affordable","total")) {
    if (has("leash") && !has("running","hands")) return "The leash with bag dispenser is $19.99, down from $27.99.";
    if (has("bowl","collapsible")) return "The collapsible bowl is $12.99, down from $17.99.";
    if (has("collar","reflective")) return "The reflective collar is $16.99, down from $21.99.";
    if (has("airtag","air tag")) return "The AirTag holder is $14.99, down from $19.99.";
    if (has("running","hands free","hands-free","waist")) return "The hands-free running leash is $22.99, down from $29.99.";
    if (has("bottle","kit","walk kit")) return "The Walk Kit 2-in-1 is $24.99, down from $34.99.";
    return "Prices go from $12.99 to $24.99 — everything is on sale right now. Free shipping on every order, no minimum.";
  }

  // SIZE - BOTTLE
  if ((has("size","how big","capacity","hold","how much water","how much food","ml","oz") && has("bottle","kit","walk kit","water","food")) || has("350","550")) {
    return "The Walk Kit comes in 350ml and 550ml. 350ml is great for short walks, 550ml is better for bigger dogs or longer hikes. Both fit easily in any bag.";
  }

  // SIZE - COLLAR
  if (has("size","what size","how big","fit","neck") && has("collar")) {
    return "The collar comes in Small, Medium and Large. The adjustable buckle gives you a bit of extra flexibility on fit for any breed.";
  }

  // SIZE - BOWL
  if (has("size","how big") && has("bowl")) {
    return "The bowl comes in Small and Large. The large holds about 350ml. Both fold completely flat to fit in any pocket.";
  }

  // COLORS
  if (has("color","colour","what colors","what colour","available in","come in","options")) {
    if (has("collar")) return "The collar comes in Orange, Blue, Pink and Black. Orange and Blue are the most visible at night.";
    if (has("leash") && !has("running","hands")) return "The leash comes in Black, Blue and Pink. All three have reflective stitching.";
    if (has("bowl")) return "The collapsible bowl comes in Orange, Blue and Green.";
    if (has("airtag")) return "The AirTag holder comes in Black, Orange and Pink.";
    if (has("running","hands free","hands-free")) return "The hands-free leash comes in Black, Orange and Blue.";
    return "The Walk Kit comes in Pink, Blue and White. Pink and Blue are the most popular — which are you leaning towards?";
  }

  // BEST PRODUCT / RECOMMENDATION
  if (has("best","most popular","recommend","should i get","what should i buy","where do i start","what do i need","good for","worth it","worth buying")) {
    return "The Walk Kit 2-in-1 is our most popular by far — water and food in one bottle so you grab one thing and you are out the door. Most customers say they use it on every single walk.";
  }

  // ALL PRODUCTS LIST
  if (has("what do you sell","what products","everything you sell","all products","what do you have","whats available","full list","show me everything")) {
    return "Six walk gear products: Walk Kit 2-in-1 ($24.99), Leash With Bag Dispenser ($19.99), Collapsible Bowl ($12.99), AirTag Holder ($14.99), Hands-Free Running Leash ($22.99), Reflective Safety Collar ($16.99). All built for walks.";
  }

  // SPECIFIC PRODUCTS
  if (has("walk kit","two in one","2 in 1","2-in-1","portable bottle","dog bottle","water bottle","food bottle")) {
    return "The Walk Kit holds water on one side and dry food on the other — one bottle, no extra bags. $24.99 in Pink, Blue or White. Two sizes available.";
  }
  if (has("leash") && has("bag","poop","dispenser") && !has("running","hands","waist")) {
    return "The leash has a poop bag dispenser built right into the handle — never forget bags again. Comes with a starter roll included. $19.99.";
  }
  if (has("collapsible","foldable","fold flat","pocket bowl") || (has("bowl") && !has("size","how big","color"))) {
    return "The bowl folds completely flat to fit in any pocket or bag. Pull it out on the walk, var your dog drink, fold it back up. $12.99 and barely weighs anything.";
  }
  if (has("airtag","air tag","apple tag","apple tracker")) {
    return "The AirTag holder clips securely onto any collar and keeps your Apple AirTag locked in place. 100% waterproof. $14.99. Note: the AirTag itself is not included.";
  }
  if (has("hands free","hands-free","running leash","waist leash","waist belt","run with","jog with","hike with")) {
    return "The hands-free leash straps around your waist so both hands stay completely free. Bungee absorbs sudden pulls and it has a phone pocket and water bottle holder built in. $22.99.";
  }
  if (has("reflective","safety collar","night collar","glow","morning walk","evening walk","early walk","dark walk") || (has("collar") && has("safe","night","dark","visible","see","glow","light"))) {
    return "The reflective collar has 360 degree strips visible from 500 feet away. Great for early morning or evening walks. $16.99 in four colors and three sizes.";
  }
  if (has("leash") && !has("bag","poop","dispenser","running","hands","waist")) {
    return "We have two leash options — the Leash With Bag Dispenser ($19.99) for everyday walks, and the Hands-Free Running Leash ($22.99) for running or hiking. Which suits you better?";
  }
  if (has("collar") && !has("reflective","night","safe","dark","visible","color","size","how big","fit")) {
    return "Our Reflective Safety Collar is $16.99 with 360 degree reflective strips visible from 500 feet. Available in Small, Medium and Large, and four colors.";
  }

  // ABOUT PAWHAUL
  if (has("what is pawhaul","about pawhaul","tell me about","your brand","your company","who made","who started")) {
    return "PawHaul is a dog walk gear brand — we make everything you need for the perfect walk. Water and food bottles, leashes, safety gear and more. All designed specifically for walks.";
  }

  // SMART FALLBACK
  return "Good question — I want to make sure I give you the right answer. Could you be a bit more specific? Or email pawhaulsupport@gmail.com and a real person will get back to you within 24 hours!";
}


var policies = {
  privacy: {
    title: "Privacy Policy",
    body: "Last updated: January 2026<br><br>This Privacy Policy describes how PawHaul collects, uses, and discloses your personal information when you visit or make a purchase from our store.<br><br><strong>Information We Collect</strong><br>We collect your name, email, billing and shipping address, and payment information when you place an order. We also collect basic browsing data to improve your experience.<br><br><strong>How We Use Your Information</strong><br>Your information is used to process and fulfill your orders, send order confirmations and tracking updates, and send marketing emails only if you have opted in. We do not sell your personal information to third parties.<br><br><strong>Sharing Your Information</strong><br>We share your information with Shopify (our store platform) and payment processors solely to fulfill your order.<br><br><strong>Your Rights</strong><br>You have the right to access, correct, or delete your personal data at any time. Email pawhaulsupport@gmail.com to make a request.<br><br><strong>Contact</strong><br>Questions? Email pawhaulsupport@gmail.com"
  },
  terms: {
    title: "Terms of Service",
    body: "Last updated: January 2026<br><br>By accessing and using PawHaul you agree to be bound by these Terms of Service.<br><br><strong>Overview</strong><br>This website is operated by PawHaul. By visiting our site and purchasing from us you agree to these terms.<br><br><strong>Eligibility</strong><br>You must be at least 18 years of age to use this site and make purchases.<br><br><strong>Products and Pricing</strong><br>All products are subject to availability. Prices are listed in USD and may change without notice.<br><br><strong>Orders</strong><br>We reserve the right to refuse or cancel any order for any reason. If your order is cancelled you will receive a full refund.<br><br><strong>Shipping</strong><br>We offer free shipping on all orders. Estimated delivery is 7-14 business days.<br><br><strong>Contact</strong><br>Questions? Email pawhaulsupport@gmail.com"
  },
  refund: {
    title: "Refund Policy",
    body: "Last updated: January 2026<br><br><strong>30 Day Return Policy</strong><br>We want you to be completely satisfied. If you are not happy for any reason you may return your item within 30 days of receiving it for a full refund.<br><br><strong>How To Start A Return</strong><br>Email pawhaulsupport@gmail.com with your order number and reason for return. We respond within 24 hours.<br><br><strong>Refunds</strong><br>Once we receive your return it will be processed within 5-7 business days back to your original payment method.<br><br><strong>Damaged Items</strong><br>If your item arrives damaged email pawhaulsupport@gmail.com with a photo within 7 days. We will send a replacement or issue a full refund.<br><br><strong>Contact</strong><br>All return requests go through pawhaulsupport@gmail.com. We always respond within 24 hours."
  },
  shipping: {
    title: "Shipping Policy",
    body: "Last updated: January 2026<br><br><strong>Free Shipping On All Orders</strong><br>PawHaul offers free standard shipping on every order with no minimum purchase required.<br><br><strong>Processing Time</strong><br>Orders are processed within 1-3 business days. You will receive a confirmation email with your tracking number once your order ships.<br><br><strong>Delivery Time</strong><br>Standard delivery takes 7-14 business days from the date your order ships.<br><br><strong>Tracking Your Order</strong><br>Once your order ships you will receive a tracking number by email. Did not receive one within 5 business days? Email pawhaulsupport@gmail.com.<br><br><strong>Lost Packages</strong><br>If your package is marked delivered but not received, contact pawhaulsupport@gmail.com within 7 days.<br><br><strong>Contact</strong><br>Shipping questions? Email pawhaulsupport@gmail.com"
  }
};

function showPolicy(type) {
  try {
    var p = policies[type];
    if (!p) return;
    var modal = document.getElementById('policyModal');
    var title = document.getElementById('policyTitle');
    var body = document.getElementById('policyBody');
    if (!modal || !title || !body) return;
    title.textContent = p.title;
    body.innerHTML = p.body;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  } catch(e) { return; }
}

function closePolicyModal() {
  try {
    var modal = document.getElementById('policyModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  } catch(e) { return; }
}

// ── BACK TO TOP ───────────────────────────────────────────────
(function() {
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var btn = document.getElementById('backToTop');
        if (btn) btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── BUNDLE SUGGESTION ─────────────────────────────────────────
var bundleMap = {
  1: [2, 3],    // Walk Kit → suggest Leash + Bowl
  2: [1, 5],    // Leash → suggest Walk Kit + Running Leash
  3: [1, 2],    // Bowl → suggest Walk Kit + Leash
  4: [6, 1],    // AirTag → suggest Collar + Walk Kit
  5: [1, 2],    // Running Leash → suggest Walk Kit + Leash
  6: [4, 2],    // Collar → suggest AirTag + Leash
};

var originalShowProduct = showProduct;
showProduct = function(id) {
  originalShowProduct(id);
  showBundle(id);
};

function showBundle(productId) {
  var bundleDiv = document.getElementById('bundleSuggestion');
  var bundleItems = document.getElementById('bundleItems');
  if (!bundleDiv || !bundleItems) return;

  var companions = bundleMap[productId] || [];
  var allIds = [productId].concat(companions);
  var total = 0;
  var html = '';

  allIds.forEach(function(bid) {
    var p = products.find(function(x) { return x.id === bid; });
    if (!p) return;
    total += p.price;
    var isMain = bid === productId;
    var imgContent = p.image ? ('<img src="' + p.image + '" alt="' + p.name + '" style="width:36px;height:36px;object-fit:cover;border-radius:8px;">') : ('<span style="font-size:28px;">' + p.emoji + '</span>');
    html += '<div style="display:flex;align-items:center;gap:12px;background:white;padding:10px 14px;border-radius:10px;">' +
      imgContent +
      '<div style="flex:1;">' +
        '<div style="font-weight:800;font-size:13px;line-height:1.4;">' + p.name +
          (isMain ? ' <span style="background:var(--orange);color:white;font-size:10px;padding:2px 7px;border-radius:50px;white-space:nowrap;">This Item</span>' : '') +
        '</div>' +
        '<div style="color:var(--orange);font-weight:800;font-size:13px;">$' + p.price.toFixed(2) + '</div>' +
      '</div>' +
      '<span style="color:var(--green);font-size:14px;font-weight:900;">&#10003;</span>' +
    '</div>';
  });

  html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-top:2px dashed #F0F0F0;margin-top:4px;">' +
    '<span style="font-weight:800;font-size:14px;">Bundle Total</span>' +
    '<span style="font-family:Fredoka One,cursive;font-size:20px;color:var(--orange);">$' + total.toFixed(2) + '</span>' +
  '</div>';

  bundleItems.innerHTML = html;
  bundleDiv.style.display = 'block';
}

function addBundleToCart() {
  var currentId = currentProduct ? currentProduct.id : null;
  if (!currentId) return;

  var companions = bundleMap[currentId] || [];
  var allIds = [currentId].concat(companions);

  allIds.forEach(function(bid) {
    var p = products.find(function(x) { return x.id === bid; });
    if (!p) return;
    var alreadyInCart = cart.some(function(c) { return c.id === bid; });
    if (!alreadyInCart) { cart.push({ ...p, qty: 1 }); }
  });

  updateCartCount();
  showToast('🐾 Bundle added to cart!');
}

// ==================== PAGE NAVIGATION HOOKS ====================
var _origShowPage = showPage;
showPage = function(page, filter) {
  _origShowPage(page, filter);
  closeMobileMenu();
  closeSearch();
};

// ==================== HAMBURGER MENU ====================
function toggleMobileMenu() {
  var menu = document.getElementById('mobMenu');
  var overlay = document.getElementById('mobMenuOverlay');
  var burger = document.getElementById('hamburger');
  if (!menu) return;
  var isOpen = menu.classList.contains('open');
  if (!isOpen) closeSearch();
  menu.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  burger.classList.toggle('open', !isOpen);
}

function closeMobileMenu() {
  var menu = document.getElementById('mobMenu');
  if (!menu) return;
  menu.classList.remove('open');
  document.getElementById('mobMenuOverlay').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// ==================== SEARCH ====================
function toggleSearch() {
  var bar = document.getElementById('navSearchBar');
  if (!bar) return;
  if (bar.classList.contains('open')) {
    closeSearch();
  } else {
    bar.classList.add('open');
    closeMobileMenu();
    setTimeout(function() {
      var inp = document.getElementById('navSearchInput');
      if (inp) inp.focus();
    }, 80);
  }
}

function closeSearch() {
  var bar = document.getElementById('navSearchBar');
  if (!bar) return;
  bar.classList.remove('open');
  var inp = document.getElementById('navSearchInput');
  if (inp) inp.value = '';
  var res = document.getElementById('searchResults');
  if (res) res.innerHTML = '';
}

function doSearch(val) {
  var res = document.getElementById('searchResults');
  if (!res) return;
  var q = (val || '').trim().toLowerCase();
  if (!q) { res.innerHTML = ''; return; }
  // Search is restricted to the 6 PawHaul products, matched by product name only.
  var list = (typeof products !== 'undefined') ? products : [];
  var matches = list.filter(function(p) {
    return p.name.toLowerCase().indexOf(q) !== -1;
  });
  if (matches.length === 0) {
    res.innerHTML = '<div class="search-no-results">No results found.</div>';
    return;
  }
  res.innerHTML = matches.map(function(p) {
    return '<div class="search-result-item" onclick="goToProduct(' + p.id + ')">' +
      '<span class="search-result-emoji">' + p.emoji + '</span>' +
      '<div class="search-result-info">' +
        '<div class="search-result-name">' + p.name + '</div>' +
        '<div class="search-result-price">$' + p.price.toFixed(2) + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ==================== CAROUSEL ====================
function initCarousel(trackId, prevId, nextId) {
  var track = document.getElementById(trackId);
  var prev = document.getElementById(prevId);
  var next = document.getElementById(nextId);
  if (!track || !prev || !next) return;

  var idx = 0;
  var touchStartX = 0;
  var touchStartLeft = 0;

  function step() {
    var card = track.children[0];
    if (!card) return 220;
    return card.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 12);
  }
  function count() { return track.children.length; }
  function maxScroll() { return Math.max(0, (count() - 1) * step()); }

  function smoothTo(target) {
    var start = track.scrollLeft;
    var dest = Math.max(0, Math.min(target, maxScroll()));
    var diff = dest - start;
    if (!diff) return;
    var t0 = null;
    (function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 300, 1);
      track.scrollLeft = start + diff * (1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  function goTo(n, instant) {
    idx = Math.max(0, Math.min(n, count() - 1));
    var target = idx * step();
    if (instant) { track.scrollLeft = target; } else { smoothTo(target); }
    prev.classList.toggle('disabled', idx === 0);
    next.classList.toggle('disabled', idx >= count() - 1);
  }

  prev.addEventListener('click', function() { goTo(idx - 1); });
  next.addEventListener('click', function() { goTo(idx + 1); });

  track.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartLeft = track.scrollLeft;
  }, { passive: true });

  track.addEventListener('touchmove', function(e) {
    var raw = touchStartLeft + (touchStartX - e.touches[0].clientX);
    track.scrollLeft = Math.max(0, Math.min(raw, maxScroll()));
  }, { passive: true });

  track.addEventListener('touchend', function(e) {
    var delta = touchStartX - e.changedTouches[0].clientX;
    goTo(Math.round((touchStartLeft + delta) / step()));
  }, { passive: true });

  goTo(0, true);
}

// ==================== DETAIL IMAGE CAROUSEL ====================
function initDetailCarousel() {
  var track = document.getElementById('detTrack');
  var prev = document.getElementById('detPrev');
  var next = document.getElementById('detNext');
  var dotsWrap = document.getElementById('detDots');
  if (!track || !prev || !next) return;

  var idx = 0;
  var total = track.children.length;
  var touchStartX = 0;
  var touchStartLeft = 0;
  if (dotsWrap) dotsWrap.innerHTML = Array.from({ length: total }, function() { return '<span class="det-dot"></span>'; }).join('');
  var dots = dotsWrap ? dotsWrap.querySelectorAll('.det-dot') : [];

  function step() { return track.offsetWidth || 300; }
  function maxScroll() { return Math.max(0, (total - 1) * step()); }

  function smoothTo(target) {
    var start = track.scrollLeft;
    var dest = Math.max(0, Math.min(target, maxScroll()));
    var diff = dest - start;
    if (!diff) return;
    var t0 = null;
    (function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 300, 1);
      track.scrollLeft = start + diff * (1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  function goTo(n, instant) {
    idx = Math.max(0, Math.min(n, total - 1));
    var target = idx * step();
    if (instant) { track.scrollLeft = target; } else { smoothTo(target); }
    prev.classList.toggle('disabled', idx === 0);
    next.classList.toggle('disabled', idx >= total - 1);
    dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
  }

  prev.addEventListener('click', function() { goTo(idx - 1); });
  next.addEventListener('click', function() { goTo(idx + 1); });

  track.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartLeft = track.scrollLeft;
  }, { passive: true });

  track.addEventListener('touchmove', function(e) {
    e.preventDefault();
    var raw = touchStartLeft + (touchStartX - e.touches[0].clientX);
    track.scrollLeft = Math.max(0, Math.min(raw, maxScroll()));
  }, { passive: false });

  track.addEventListener('touchend', function(e) {
    var delta = touchStartX - e.changedTouches[0].clientX;
    goTo(Math.round((touchStartLeft + delta) / step()));
  }, { passive: true });

  goTo(0, true);
}

// ==================== SECTION REVEAL (subtle fade-up on scroll) ====================
// The .reveal class is added by JS, so if anything fails no content is ever hidden.
// A guaranteed fallback timer also un-hides everything, so content can NEVER get stuck invisible.
document.addEventListener('DOMContentLoaded', function() {
  var sel = '.collections-section, .bestsellers, .why-section, .mission-section, .reviews-section, .faq-section, .email-section';
  var els = document.querySelectorAll(sel);
  function revealAll() { els.forEach(function(el) { el.classList.add('reveal-in'); }); }

  if (!('IntersectionObserver' in window)) { return; } // no reveal class added -> sections stay fully visible

  els.forEach(function(el) { el.classList.add('reveal'); });
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('reveal-in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(function(el) { obs.observe(el); });

  // Safety net: whatever happens, reveal everything after 1.2s so nothing can stay hidden.
  setTimeout(revealAll, 1200);

  initCarousel('revCarousel', 'revCarouselPrev', 'revCarouselNext');
});
