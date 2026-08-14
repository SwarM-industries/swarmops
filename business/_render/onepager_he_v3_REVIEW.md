# Hebrew one-pager (V3) — text of record

Every Hebrew string from `onepager_he_v3.html`, in document order, with the English source
underneath. **This reflects the Hebrew currently shipped** — Tony's rewrite of 2026-08-14,
applied wholesale, with four things restored on top of it:

1. the 7 October passage keeps its closing clause (*כזו שיכלה להציל חיים ולקדם את המשימה*),
2. the sources block, translated rather than dropped,
3. DroneDeploy explicitly marked *אינו מתחרה*,
4. the contact line and the Discharged Combat Veterans Program line.

**Note:** HE and EN are no longer literal translations of each other. The Hebrew is more formal
and more declarative; the English argues its way to the same conclusions. That is deliberate —
the registers suit different readers — but don't assume a change to one lands in the other.

**To correct the Hebrew:** edit the `HE:` lines here and hand the file back. Don't edit the PDF;
the HTML is the source.

**Terms deliberately left in English** (per `README.md`): AWS, MAVLink, VRPTW, BVLOS, Pre-Seed,
Seed, Multi-Tenant, On-Premise, Commodity, Edge Nodes, Docker/K8s, CI/CD, KPIs, DJI, Autel,
Remote ID, ARR, GNSS, IATA, SDK, DevOps, C4I, UGV, USV, ConTech, Subscription.

---

### 1
**HE:** SwarmOps | Swarm Industries

> *EN:* SwarmOps | Swarm Industries

### 2
**HE:** פלטפורמת שליטה ואופטימיזציה בזמן אמת לצי רחפנים אוטונומי

> *EN:* Real-time control and optimization platform for autonomous drone fleets

### 3
**HE:** עמוד אחד | אוגוסט 2026פותח במסגרת התוכנית ללוחמים משוחררים

> *EN:* One page | August 2026Discharged Combat Veterans Program

### 4
**HE:** 01תקציר מנהליםExecutive Summary

> *EN:* Built, deployed and running on AWS today

### 5
**HE:** המערכת בנויה, פרוסה ופועלת כבר היום על גבי AWS

> *EN:* SwarmOps decides, in real time, which drone flies which mission

### 6
**HE:** SwarmOps מקבלת החלטות בזמן אמת:

> *EN:* Built by four combat veterans, three of them former IDF drone operators

### 7
**HE:** נבנתה על ידי ארבעה לוחמים משוחררים, שלושה מהם מפעילי רחפנים לשעבר בצה"ל

> *EN:* 02The Challenge Nobody sees the whole airspace. Every drone flies on its own controller. No screen anywhere shows everything currently airborne - who is flying it, and what it is tasked to. The fleet-level questions simply go unanswered: who covers what, who already swept it, whose report is current. This is not a fleet-size problem. It is a coordination problem. Ten people flying one drone each in the same sector are a swarm with no brain. Nobody owns a fleet; each operator is doing their job correctly - the failure sits in the space between them, which no single-operator tool has reason to look at. The IDF has tendered for 12,000 FPV aircraft, one operator each, with nothing above them. Nobody sells the layer above. Every tool in this market is bought by, installed by and scoped to a single operator - manufacturer software included, whose job is to make their aircraft fly well. A layer serving several independent operators is a different product with a different buyer: the person accountable for the airspace, who may own none of the aircraft. That is not an oversight anyone corrects by accident. The cost in the field: wasted flight time, duplicate coverage, needless airframe wear - and worst of all, an operational picture nobody can fully trust.

### 8
**HE:** 02האתגרThe Challenge אף אחד לא רואה את המרחב האווירי בשלמותו. כל רחפן מופעל באמצעות השלט שלו. אין כיום מסך אחד שמציג את כל הכלים שבאוויר - מי מטיס אותם ולאיזו משימה שובצו. השאלות ברמת הצי נותרות ללא מענה: מי מכסה איזה תא שטח, מי כבר ביצע סריקה, ואיזה דיווח הוא העדכני ביותר. זו אינה בעיה של גודל צי, אלא בעיית תיאום. עשרה מפעילים שמטיסים רחפן בודד באותה גזרה פועלים כנחיל ללא תיאום מרכזי. אף גורם אינו מנהל את הצי כמשאב אחד; כל מפעיל מבצע את תפקידו כראוי, אך הכשל נוצר במפתח שביניהם - אזור שאינו מכוסה על ידי שום תוכנה המיועדת למפעיל בודד. צה"ל פרסם מכרז ל-12,000 כלי FPV (מפעיל בודד לכל כלי), ללא שכבת ניהול מרכזית מעליהם. כיום אין מוצר בשוק המציע את השכבה הזו. כל תוכנה בשוק נרכשת, מותקנת ומוגדרת עבור מפעיל יחיד - כולל תוכנות היצרנים, שתפקידן להתמקד בהטסת הכלי הבודד. שכבה המשרתת מספר מפעילים עצמאיים היא מוצר שונה בעל פרופיל קונה שונה: הגורם האחראי על המרחב האווירי, שלא פעם אינו הבעלים של הכלים עצמם. זהו פער מבני בשוק. המחיר בשטח: בזבוז זמן טיסה, כפילויות סריקה, שחיקת כלים מיותרת - והחמור מכל, תמונה מבצעית שלא ניתן לסמוך עליה באופן מלא.

> *EN:* 03The Solution & ProductVendor-Neutral Layer A vendor-neutral coordination and optimization layer Assignment & routing engine (VRPTW): computes optimal routes, allocates missions automatically, and folds charging or battery-swap stops into the plan in real time - maximum air time, minimum risk. Dynamic re-planning: live telemetry and field events update the mission board within seconds of a technical fault, an abnormal battery drain, loss of signal, or an urgent shift in operational priorities. Unified control room: one live operational picture - every aircraft, mission, planned route and restricted zone on a single map, plus the live camera feed from any drone the commander selects, tied to that aircraft's identity and current mission - and dashboards tracking mission status, readiness and remaining air time. All drones stream concurrently; the commander chooses which to watch. Hardware agnostic - specifically: professional aircraft speak MAVLink; DJI and Autel are closed but publish SDKs. Each becomes a thin adapter normalizing telemetry into one format and routing that aircraft's video into the existing feed relay. A mixed fleet appears as one fleet, not three consoles. Deploys where the customer operates: cloud, on local servers in closed networks (on-premise), or on edge nodes in the field - containerized, with automated delivery pipelines and full observability.

### 9
**HE:** 03הפתרון והמוצרThe SolutionVENDOR-NEUTRAL LAYER שכבת תיאום ואופטימיזציה ניטרלית (Vendor-Neutral) מנוע שיבוץ וניתוב (VRPTW): מחשב מסלולים אופטימליים, מקצה משימות באופן אוטומטי ומשלב עצירות טעינה או החלפת סוללה בזמן אמת - למקסימום זמן אוויר במינימום סיכון. תכנון-מחדש דינמי: נתוני טלמטריה חיים ואירועי שטח מעדכנים את לוח המשימות תוך שניות - במקרה של תקלה טכנית, התרוקנות סוללה חריגה, אובדן תקשורת (Loss of Signal) או שינוי דחוף בסדרי העדיפויות המבצעיים. חמ"ל אחוד: תמונה מבצעית חיה וקואורדינטיבית - כל כלי הטיס, המשימות, המסלולים המתוכננים והאזורים האסורים בטיסה על מפה אחת. כולל וידאו חי מהרחפן הנבחר המקושר לזהות הכלי ולמשימתו, לצד דשבורדים למעקב אחר סטטוס, כשירות וזמן אוויר נותר. כל הרחפנים משדרים במקביל; המפקד בוחר באיזה פיד לצפות. עצמאות יצרן (Hardware Agnostic): כלי טיס מקצועיים תומכים בפרוטוקול MAVLink; יצרנים סגורים כגון DJI ו-Autel מספקים SDK. המערכת עושה שימוש במתאמים ייעודיים המנרמלים את הטלמטריה לפורמט אחיד ומנתבים את הווידאו למערכת המרכזית. צי מעורב מנוהל ממסך אחד, ולא משלוש קונסולות נפרדות. גמישות פריסה: ענן, שרתים מקומיים ברשתות סגורות (On-Premise), או רכיבי קצה בשטח (Edge Nodes) - במארזי קונטיינרים (Docker/K8s), עם צנרת הפצה אוטומטית (CI/CD) ונראות מלאה.

> *EN:* 04Applications & Market PotentialDual-Use Why now: the IDF has tendered for 12,000 FPV aircraft and is building its own line - hardware is commoditising, coordination is not. Israel has run nationwide BVLOS trials since 2020, years ahead of the US rule. Israeli defense-tech took ~30% of all local private investment in H1 2026. Defense, emergency & C4IOne unified operational picture across separately-controlled aircraft, coordinated sweeps and rapid response; intelligent fleet logistics (battery and airframe health); a learning layer over flight history for after-action review and sector-specific optimization (future). Construction & infrastructure (ConTech)Autonomous mapping keyed to project milestones: earthwork volume calculation, progress verification for releasing lender funds, as-built comparison against engineering plans (BIM), and defensible documentation for disputes. Infrastructure & energyRecurring monitoring, defect detection and preventive maintenance across power lines, oil & gas pipelines, national assets and solar farms. Precision agricultureCoordinated multispectral surveys for pest detection, and scheduled autonomous spraying at scale. Logistics & deliveryAutonomous site-to-site transport and last-mile optimization across the supply chain.

### 10
**HE:** 04יישומים ופוטנציאל שוקDual-Use למה עכשיו: צה"ל פרסם מכרז ל-12,000 כלי FPV ומקים קו ייצור עצמאי - החומרה הופכת למוצר מדף (Commodity), בעוד תיאום הצי נותר האתגר המרכזי. ישראל מנהלת ניסויי BVLOS (טיסה מעבר לטווח ראייה) ארציים מאז 2020, שנים לפני הרגולציה המקבילה בארה"ב. תחום ה-Defense-Tech בישראל ריכז כ-30% מסך ההשקעות הפרטיות במחצית הראשונה של 2026. ביטחון, חירום ושליטה ובקרה (C4I)תמונה מבצעית אחודה לכלים בשליטה נפרדת, סריקות מתואמות ותגובה מהירה; לוגיסטיקת צי חכמה (ניטור בריאות סוללה ושלד הכלי); שכבת למידה על בסיס היסטוריית הטיסות לתחקור מבצעי ואופטימיזציה גזרתית (עתידי). בנייה ותשתיות (ConTech)מיפוי אוטונומי המתוזמן לפי אבני דרך בפרויקט: חישובי נפחי עפר, אימות התקדמות לשחרור כספי מלווים, השוואת תצורת מצב-בפועל מול תוכניות הנדסיות (BIM), ותיעוד משפטי תקף למחלוקות. תשתיות ואנרגיהניטור תקופתי, איתור תקלות ותחזוקה מונעת של קווי מתח, צנרות גז ונפט, נכסים לאומיים וחוות סולאריות. חקלאות מדויקתסקרים מרובי-ספקטרליים לאיתור מזיקים וריסוס אוטונומי מתוזמן בהיקף נרחב. לוגיסטיקה ומשלוחיםשינוע אוטונומי בין אתרים ואופטימיזציית "המייל האחרון" בשרשרת האספקה.

> *EN:* 05Roadmap - 12 Months Months 0–3Connect real aircraft (DJI and Autel SDKs; MAVLink for custom airframes), run first field trials, begin engagement with the Civil Aviation Authority.

### 11
**HE:** 05מפת דרכים - 12 חודשיםRoadmap חודשים 0–3חיבור כלי טיס אמיתיים (DJI/Autel SDK, MAVLink לכלים מותאמים אישית), ביצוע ניסויי שטח ראשונים והתנעת תהליכים מול רת"א.

> *EN:* Months 3–6First pilot with a strategic partner or design customer, proving out agreed success metrics.

### 12
**HE:** חודשים 3–6פיילוט ראשון מול שותף אסטרטגי / לקוח מוביל, להוכחת מדדי הצלחה (KPIs) מוגדרים מראש.

> *EN:* Months 6–12Multi-Tenant product, commercial pricing, and a Pre-Seed / Seed round.

### 13
**HE:** חודשים 6–12השקת מוצר במודל Multi-Tenant, גיבוש תמחור מסחרי וגיוס סבב Pre-Seed / Seed.

> *EN:* 06Team Four co-founders, all engineers and combat veterans, three of them former IDF drone operators - we are the users this product is built for. Tony Verin | Guy Peres | Harel Valfish designed, built and operate the entire system end to end: algorithms, cloud architecture, user interfaces and infrastructure. Amir Shacham - DevOps engineer, business and economics at Reichman University - owns commercial strategy, pricing and fundraising.

### 14
**HE:** 06הצוותTeam ארבעה מייסדים-שותפים, כולם מהנדסים ולוחמים משוחררים, שלושה מהם מפעילי רחפנים לשעבר בצה"ל - אנחנו המשתמשים שעבורם המוצר נבנה. טוני ורין | גיא פרס | הראל ולפיש: תכננו, בנו ומפעילים את המערכת מקצה לקצה - אלגוריתמיקה, ארכיטקטורת ענן, ממשקי משתמש ותשתיות. אמיר שחם: מהנדס DevOps, בוגר מנהל עסקים וכלכלה באוניברסיטת רייכמן - מוביל את האסטרטגיה המסחרית, התמחור והגיוס.

> *EN:* This is not a theoretical scenario for us.

### 15
**HE:** עבורנו, לא מדובר בתרחיש תיאורטי.

> *EN:* That is the problem SwarmOps was built to solve.

### 16
**HE:** זו בדיוק הבעיה ש-SwarmOps נבנתה לפתור.

> *EN:* 07The AskFunding a milestone, not a runway $12K min

### 17
**HE:** 07הבקשהThe Askמימון ממוקד אבן-דרך 12 אלף $ מינימום

> *EN:* Three aircraft, a Remote ID receiver, cloud, incorporation, CAAI licensing and insurance. Buys one milestone in ~4 months: three separately-controlled aircraft flying at once, all visible in one live picture - the coordination problem above, on real hardware. The integration surface already exists; a real drone connects as a new data producer, not a rebuild.

### 18
**HE:** רכישת 3 כלי טיס, מקלט Remote ID, משאבי ענן, התאגדות משפטית, רישוי רת"א וביטוח. השקעה זו תאפשר להגיע לאבן דרך קריטית בתוך כ-4 חודשים: הפעלה בו-זמנית של 3 כלי טיס בשליטה נפרדת הנצפים בתמונה מבצעית חיה אחת - הוכחת פתרון בעיית התיאום על גבי חומרה פיזית. תשתית האינטגרציה כבר קיימת; רחפן פיזי מתחבר כמקור נתונים חדש, ללא צורך בבנייה מחדש.

> *EN:* Pre-Seed, after that milestone

### 19
**HE:** סבב Pre-Seed - לאחר אבן הדרך

> *EN:* 12 months with the founders full-time - the round is for salaries and a first paid design partner, not hardware. We would rather raise against a flying aircraft than a slide of one, which is why the first number is deliberately small.

### 20
**HE:** מימון ל-12 חודשי עבודה של המייסדים במשרה מלאה - הסבב מיועד לשכר ולעבודה מול שותף אסטרטגי ראשון, ולא לרכישת חומרה. אנחנו מעדיפים לגייס על בסיס מוצר עובד באוויר ולא על בסיס מצגת שקפים, ולכן סכום הבקשה הראשוני צנוע וממוקד.

> *EN:* What helps most besides money

### 21
**HE:** חיבור לשותף אסטרטגי אחד המפעיל 3 כלי טיס ומעלה (חברת אבטחה, חברת תשתיות או יחידה מבצעית) לצורך הרצת פיילוט מוגדר עם מדדי הצלחה מוסכמים. שותפות כזו שווה עבורנו יותר מהצ'ק הראשוני.

> *EN:* One design partner operating 3+ aircraft - a security operator, an infrastructure company, or a unit - to run a scoped pilot with success criteria agreed up front. That introduction is worth more to us than the first cheque.

### 22
**HE:** פותח במסגרת התוכנית ללוחמים משוחררים. הדגמה חיה זמינה לפי בקשה.

> *EN:* Developed under the Discharged Combat Veterans Program. Live demonstration available on request.

### 23
**HE:** יצירת קשר: טוני ורין | דוא"ל: toniv7891@gmail.com | טלפון: 052-4328627 * הדגמה חיה זמינה לפי בקשה

> *EN:* Contact: Tony Verin | Email: toniv7891@gmail.com | Phone: +972-52-4328627 * Live demo available on request

### 24
**HE:** SwarmOps | ניתוח שוק והזדמנות עסקית

> *EN:* SwarmOps | Market & Opportunity

### 25
**HE:** פילוח הכנסות, מתודולוגיית אומדן ונושאים לתיקוף

> *EN:* Where the money is, how we sized it, and what we still need to verify

### 26
**HE:** עמודים 2–3 | אוגוסט 2026המקורות מפורטים למטה

> *EN:* Pages 2–3 | August 2026Sources listed below

### 27
**HE:** שוק תוכנות הניטור והתפעול לצי רחפנים (2026), בצמיחה של כ-18% בשנה. הקטגוריה כוללת גם תוכנות עיבוד תצלומים ורישום טיסות; שכבת התיאום והאופטימיזציה ש-SwarmOps מציעה מהווה להערכתנו כ-10%–20% מתוכו (כ-250–780 מיליון $). איננו סופרים כלי טיס: שוק חומרת הרחפנים (96 מיליארד $) אינו השוק שלנו.

> *EN:* TAMThe category we sell into

### 28
**HE:** 300–800 ארגונים בישראל המנהלים צי של 3 כלים ומעלה, בעלות משוערת של 20–25 אלף $ לשנה לארגון. השווקים באירופה ובארה"ב מוסיפים פוטנציאל מוערך של 320–800 מיליון $. נתון זה אינו כולל מתקנים וגזרות משותפות שבהם טסים מספר גורמים שונים במקביל - סגמנט המהווה להערכתנו חלק משמעותי מהשוק, ואשר ייבחן בפיילוט.

> *EN:* Global drone fleet operations software, 2026, growing ~18% a year. That category also covers flight logging and photo processing; the coordination layer we sell is an estimated 10–20% of it - some $250–780M, not tracked separately by any analyst. We do not count aircraft: the $96B drone market is hardware we neither build nor sell.

### 29
**HE:** SOMיעד הכנסות חוזרות (ARR)

> *EN:* SAMWho we can actually sell to

### 30
**HE:** 0.6–1.5 מיליון $ ARR · שנה 3

> *EN:* 300–800 Israeli organizations coordinating 3+ aircraft, at $20–25K each per year (est.). Europe and the US add an estimated $320–800M. Not counted in either figure: shared sites and sectors where several independently-controlled drones fly at once - possibly the larger half of the market, and the first thing we intend to measure.

### 31
**HE:** הכנסה שנתית חוזרת מבוססת מנוי - 20–40 לקוחות, מתוכם 2–3 לקוחות ביטחוניים / On-Premise, המהווים כ-5%–15% מהשוק הישראלי. היעד מוגבל ביכולת הביצוע של הצוות ולא בגודל השוק: כל שורה במסלול ההרחבה שלהלן מתורגמת ללקוחות נוספים, ומה שחוסם אותן הוא ארבעה אנשים שצריכים לבחור מה לבנות אחר כך.

> *EN:* Annual recurring revenue, not a one-off sale - 20–40 subscribing customers, of which 2–3 defense or on-premise (est.), roughly 5–15% of the Israeli market. This figure is limited by our headcount, not by the market: every row of the expansion track below converts into more addressable customers, and what blocks them is four people choosing what to build next.

### 32
**HE:** למה ישראל קודםWhy Israel Firstראש גשר, לא תקרה מפעילים בישראל מגיעים להיקפי צי משמעותיים לפני מקביליהם בארה"ב, בעיקר הודות לטיסות BVLOS. בעוד הרגולציה בארה"ב מעכבת פריסה נרחבת, המיזם הלאומי לרחפנים בישראל מריץ ניסויי BVLOS במרחב מנוהל מאז 2020 - כולל בתנאי חסימת GPS. התנאים בישראל ייחודיים: מרחב אווירי אזרחי-צבאי מעורב, מגבלות פתאומיות, ומפגע נרחב של שיבושי ניווט לווייני (GNSS) שעל פי דיווחי IATA זינקו ב-193% - כשמזרח הים התיכון מהאזורים הנפגעים ביותר בעולם. תחום ה-Defense-Tech הישראלי מרכז גיוסי הון בהיקף נרחב - כ-3 מיליארד $ במחצית הראשונה של 2026, קרוב ל-30% מכלל ההשקעה הפרטית בהיי-טק הישראלי. מסלולי רשות החדשנות מעניקים מענה מדויק לשלבים אלו - עד 2 מיליון ₪ ב-Pre-Seed ו-6 מיליון ₪ ב-Seed, לצד חממות חדשות בתחומי רובוטיקה ודיפנס-טק. החומרה הופכת למוצר מדף מוזל - רכש של אלפי רחפנים מוזלים (5,000 בכ-3,500 ₪; ועוד 12,000 ב-20–25 אלף ₪) לצד ייצור עצמי. החומרה ניתנת להחלפה - שכבת התוכנה והתיאום מעליה לא. שליטה בשוק המקומי היא תנאי לזינוק לשוק הבינלאומי. שום דבר כאן לא סוגר את אירופה או ארה"ב - פלטפורמה שהוכיחה את עצמה במרחב האווירי התובעני ביותר שקיים היא בדיוק מה שהופך אותה לניתנת למכירה בחו"ל.

> *EN:* Why Israel FirstBeachhead, not a limit Israeli operators reach fleet scale before American ones. BVLOS - flying beyond visual line of sight - is what makes fleets grow. The US rule is still unpublished; Israel's National Drone Initiative has run nationwide managed-airspace BVLOS trials since 2020, including flights in GPS-denied conditions. Israel's requirements are genuinely different, not a translation job: mixed civil/military airspace, restrictions declared at short notice, thin route margins - and satellite-navigation interference as a standing condition. IATA reports GNSS interference up 193% in 2025 against 2023, with the Eastern Mediterranean among the worst-affected regions worldwide. The timing in this sector is unusual. Israeli defense-tech companies raised roughly $3B in the first half of 2026 - close to 30% of all private investment in Israeli high-tech. National funding tracks fit this stage. The Israel Innovation Authority's deep-tech track runs to NIS 2M at Pre-Seed and NIS 6M at Seed, plus new incubators covering robotics and defense-tech. The aircraft are being commoditised in front of us. Not in the primes' expensive precision systems - those are low-volume and unit-selective - but in cheap drones bought in thousands (5,000 at ~₪3,500; a further 12,000 at ₪20–25K), plus in-house production to cut cost further. Hardware is becoming the replaceable part; the layer above it is not. Israel is the market we win; export makes it large. Nothing here closes off Europe or the US - a platform proven in the hardest airspace anyone operates in is what makes it sellable abroad.

### 33
**HE:** מה השוק הזה כבר משלםComparablesמודל הכנסה חוזר כל הנתונים מייצגים הכנסות מנוי חוזרות (Subscription). אף אחד מהמוצרים שלהלן אינו עושה את מה ש-SwarmOps עושה - הם מראים את נכונות הלקוחות לשלם על תוכנת ניהול. תמחור מקובל בענף (מדריכי ענף, לא גופי מחקר)50–500 $ לכלי טיס / חודש DroneDeploy - אינו מתחרה: כלי מיפוי בלבד (עיבוד תצלומים שלאחר טיסה), עבודה אחרת לגמרי. מצוטט כשם המוכר בקטגוריה, ומשום שתכנון הטיסה שלו מוגבל ל-DJI בלבד - בדיוק נעילת היצרן שאנחנו קיימים כדי להסיר329–599 $ למשתמש / שנהמדרגות מפורסמות; מחירי צוות ו-Enterprise בהצעה פרטנית נקודת תמחור ייחוס של SwarmOps150 $ לכלי טיס / חודש לקוח אזרחי עם 10 כליםכ-20 אלף $ לשנה, חוזר לקוח ביטחוני/תשתיות (התקנת On-Premise באתר)100–300 אלף $ לשנה, חוזר ביטחוני ברמת הכוח - תוכנית הצטיידות, לא מנוי. פוטנציאל, לא תוכנית עבודה1–5 מיליון $ לשנה (אומדן)

> *EN:* What This Market Already PaysRecurring, not one-off All figures are subscription revenue - paid for as long as the customer operates, not one-time sales. None of the products below does what SwarmOps does; they show what this buyer already pays for drone software. Industry pricing band (trade guides, not research firms)$50–500 per aircraft / month DroneDeploy - not a competitor: post-flight mapping from drone photos, a different job entirely. Cited as the category's best-known name, and because its automated flight planning works with DJI aircraft only - the vendor lock we exist to remove$329–599 per user / yearpublished tiers; team and enterprise quoted privately Our working price point (est.)$150 per aircraft / month Customer with 10 aircraft~$20K / year, recurring Defense, per site or formation (on-premise)$100–300K / year, recurring Defense, force level - a program, not a subscription. Upside, not plan$1–5M / year (est.)

### 34
**HE:** למה הפער הזה עדיין פתוחThe Structural Gap כל כלי תוכנה קיים מיועד ומותאם למפעיל יחיד. שכבה המנהלת מספר מפעילים שונים דורשת מוצר שונה וקונה שונה - מנהל המרחב האווירי. יצרניות הרחפנים אינן בנויות לכך מבנית, שכן התוכנה שלהן מיועדת לקדם את מכירת החומרה שלהן בלבד. זהו פער מבני בשוק ש-SwarmOps נכנסת אליו.

> *EN:* Why This Gap Is Still OpenAnd how we would stay ahead Every tool in this market is bought by, installed by, and scoped to a single operator. A layer that sits above several independent operators is a different product with a different buyer - the person accountable for the airspace, who may own none of the aircraft. Manufacturers have not built it and are structurally not placed to: their software's job is to make their aircraft fly well. This is not an oversight anyone corrects by accident - it is a structural gap, and it is the one we occupy.

### 35
**HE:** יתרון ארוך טווח. המערכת אוגרת כל תוכנית טיסה ודיווח טלמטריה. ככל שהשימוש גדל, האלגוריתם מתכנן מסלולים בהתבסס על ביצועי אמת של הכלי בשטח ולא לפי מפרט יצרן תיאורטי. הצטברות המידע המבצעי מייצרת חסם כניסה גבוה למתחרים חדשים. הנתונים נצברים כבר היום; המידול עצמו טרם נבנה.

> *EN:* And once we are in, the product compounds. Every plan the system issues and every position report it receives is already stored. A version that plans from what an airframe actually achieves in a given sector and season - rather than from its specification - gets measurably better with each month a customer uses it. That is the honest answer to how a software company without hardware stays hard to replace: not a patent, but an operating record no newcomer has. The data is accumulating today; the modelling is not built.

### 36
**HE:** מסלול ההרחבה - טווח קרובExpansion Track לא ממומן ולא מובטח. מסודר לפי הסדר שבו נבצע - כל שלב הוא הכסף הקל ביותר שזמין באותה נקודה, ונשען על זה שלפניו. שנה 2 — הרחבת הכנסה מלקוחות קיימיםניטור חוזה כשלים ברחפן; עדכון אזורים אסורים בזמן אמתגידול של 15%–30% בהכנסה מלקוח. ללא חיפוש לקוחות חדשים וללא כניסה לשוק חדש שנה 2 (מחצית שנייה) — מכירה למנהל המרחב האווירימתן שירות למספר גופים במקביל באותו תא שטחהיום אנחנו יכולים למכור רק למי שהרחפנים בבעלותו. זה מאפשר למכור למפקד או למנהל האתר שאחראי על כל מי שטס שם - קונה שמוצרים המיועדים למפעיל בודד לא נבנו לשרת. הפיתוח נכנס בתוך תוכנית 12 החודשים; מה שחוסם את המכירה הוא לקוח התייחסות, לא קוד שנה 2–3 — פתיחת השוק הביטחוניהתקנה מקומית (On-Premise) ללא חיבור לאינטרנט; עמידות בתנאי חסימת קשר ו-GPSבלי זה לקוחות ביטחוניים פשוט לא יכולים לרכוש מאיתנו. תנאי כניסה, לא שיפור

> *EN:* Expansion TrackNear term Not funded, not promised. Listed in the order we would do it - each step is the easiest money available at that point, and builds on the one before. Yr 2 — sell more to existing customersWarn which drones are about to fail; live restricted-zone updatesExisting customers pay 15–30% more. No new customers to find, no new market to enter Yr 2, second half — sell to the airspace ownerOne system serving several separate units or companies at onceToday we can only sell to whoever owns the drones. This lets us sell to the commander or site manager responsible for everyone flying there - a buyer that products scoped to a single operator are not built to serve. The engineering lands inside the 12-month plan; what gates the sale is a reference customer, not code Yr 2–3 — open the defense marketRuns on the customer's own servers, offline; survives GPS/comms jammingWithout this, defense customers cannot buy from us at all. An entry requirement, not an improvement

### 37
**HE:** מסלול ההרחבה - טווח ארוךExpansion Track שנה 3+ — מעבר לרחפניםתמיכה ברובוטים קרקעיים (UGV), ציי מחסנים וכלי שיט אוטונומיים (USV)אותה ליבת תוכנה, שוק נרחב בהרבה. הושאר לסוף בכוונה: מיקוד הוא מה שמנצח את הלקוחות הראשונים שנה 3+ — נחיתה על עצם בתנועהיכולת טיסה ונחיתה על רכב, ספינה או נגרר בתנועהמערכות תכנון מניחות שרחפן חוזר לבסיס קבוע. לכוח שנע אין בסיס כזה. בעיית מחקר קשה, לא הגדרה חזון טווח ארוך — שכבה לאומיתאספקת תמונה אווירית אחודה לכלל הכלים הפועלים במדינת ישראללא מערכת אחת לכל ארגון, אלא שכבה שכל מפעיל ישראלי מתחבר אליה - בנויה סביב התנאים של ישראל ולא מותאמת ממוצר זר. ישראל קטנה מספיק כדי שזה יהיה אפשרי, והגוף שיכנס אותה כבר קיים. שאיפה, לא תוכנית העיקרון: למכור יותר ללקוחות שכבר יש לנו לפני שרודפים אחרי חדשים, ולהיכנס לשוק בעל הערך הגבוה ביותר רק כשנוכל לעמוד בדרישותיו.

> *EN:* Expansion Track, continuedLonger horizon Yr 3+ — beyond dronesSupport for other vehicle typesThe software does not care that it is flying. Ground robots, warehouse fleets and unmanned boats have the same problem - a much larger market, same core. Left for last on purpose: focus is what wins the first customers Yr 3+ — moving-vehicle recoveryLanding on a moving truck, ship or trailerPlanning systems assume a drone comes back to a fixed base. A force that moves does not have one. A hard research problem, not a setting Long horizon — a national layerOne picture of everything airborne in IsraelNot one system per organization, but a layer every Israeli operator connects to - built around Israel's own conditions rather than adapted from a foreign product. Israel is small enough for this to be possible, and the body that would convene it already exists. An ambition, not a plan The principle: sell more to the customers we already have before chasing new ones, and enter the most valuable market only once we can meet its requirements.

### 38
**HE:** מתודולוגיהMethod מתודולוגיית תמחור. תמחור לפי כלי טיס מתאים לצי רחפנים רב-פעמיים. עבור רחפנים חד-פעמיים (כגון חימוש משוטט / FPV), מודל התמחור מבוסס על גזרה, אתר או תוכנית הצטיידות כוללת - ולא לפי יחידת קצה. החלת מנוי לפי כלי על מלאי של 12,000 רחפנים מייצרת מספר בעשרות מיליונים, ולכן איננו מצטטים אותו.

> *EN:* How We Built These FiguresMethod A note on how we would charge. Per-aircraft pricing fits reusable inspection and patrol drones. It does not fit an aircraft consumed in a single flight - there the billable unit is per formation, per site or per program. Applying a per-aircraft subscription to a 12,000-drone holding produces a number in the tens of millions, which is why we do not quote one.

### 39
**HE:** איך נבנו המספרים. נתונים ממקור מגיעים מגופי מחקר ומרגולטורים בשמם. נתונים המסומנים אומדן הם הערכות שלנו מלמטה למעלה על בסיס אותם מקורות, כשההנחות מתועדות וזמינות במלואן לבקשה. הערכות מפורסמות בקטגוריה זו נבדלות מהותית בהגדרתן, ולכן ניתנים טווחים ולא מספר בודד - ומצוין מה מקורו של כל נתון.

> *EN:* How these figures were built. Sourced figures come from named research firms and regulators. Figures marked est. are our own bottom-up estimates from those inputs, with the assumptions written down and available in full. Published estimates for this category vary widely by definition, so we give ranges rather than single numbers - and we say which is which.

### 40
**HE:** נושאים פתוחים לתיקוףOpen Questions מיפוי כמות האתרים המנוהלים שבהם פועלים מספר מפעילים שונים במקביל. אין מקור ציבורי הסופר אותם - ובדיוק לכן בכוונתנו למפות אותם. ייתכן שזהו החלק המשמעותי יותר של השוק, והוא אינו נכלל באף נתון לעיל. תיקוף נכונות המחיר עבור שכבת התיאום בלבד, להבדיל משאר מחסנית התוכנה, מול מציאות השוק בפיילוט הראשון. האם מפעילים רואים בכך בעיה שראוי לממן - או פשוט את הדרך שבה העבודה תמיד נעשתה. זו השאלה שהפיילוט הראשון נועד לענות עליה, ואנחנו מעדיפים לגלות מוקדם מאשר להניח.

> *EN:* What We Still Need To VerifyStated up front How many shared operating areas there are. No public source counts sites and sectors where several separately-controlled drones fly at once - which is exactly why we intend to count them. It may be the larger half of our market, and it is not in any figure above. What a buyer pays for coordination specifically, as distinct from the rest of a drone software stack. Answered the first time we price a real deal. Whether operators see this as a problem to fund - or as simply how the work has always been done. This is the question the first pilot is designed to answer, and we would rather find out early than assume.

### 41
**HE:** מקורות. גודל שוק: Fact.MR; Market Growth Reports; Grand View Research; MarketsandMarkets (שוק ה-UAV הישראלי). רישומי מפעילים: FAA (דצמבר 2025); EASA. תמחור: מדרגות DroneDeploy דרך Capterra; טווח המחיר לכלי טיס ממדריכי ענף (Dronedesk, DroneBundle) ולא מגופי מחקר. פרוטוקולי אינטגרציה לכלי טיס: תיעוד רשמי של MAVLink, DJI Payload/Mobile SDK ו-Autel Enterprise SDK. שיבושי GNSS: דיווחי בטיחות של IATA כפי שסוקרו בעיתונות התעופה. ניסויי BVLOS בישראל: המיזם הלאומי לרחפנים / C4IR / רשות החדשנות. רכש רחפנים בצה"ל: ג'רוזלם פוסט; טיימס אוף ישראל; Militarnyi. השקעות דיפנס-טק: פורום ה-DefenseTech בחיפה (מחצית ראשונה 2026). מתודולוגיה. נתונים המסומנים אומדן הם הערכות שלנו מלמטה למעלה על בסיס המקורות לעיל, ואינם נתוני שוק מפורסמים; ההנחות מתועדות במלואן וזמינות לבקשה. הערכות מפורסמות בקטגוריה זו נבדלות מהותית בהגדרתן, ולכן ניתנים טווחים ולא מספר בודד.

> *EN:* Sources. Market size: Fact.MR; Market Growth Reports; Grand View Research; MarketsandMarkets (Israel UAV). Registrations: FAA (Dec 2025); EASA. Pricing: DroneDeploy tiers via Capterra; per-aircraft band from trade guides (Dronedesk, DroneBundle) rather than research firms. Aircraft-integration protocols: published MAVLink, DJI Payload/Mobile SDK and Autel Enterprise SDK documentation. GNSS interference: IATA safety reporting as covered by aviation press. Israeli BVLOS trials: National Drone Initiative / C4IR / Israel Innovation Authority. IDF drone procurement: Jerusalem Post; Times of Israel; Militarnyi. Defense-tech investment: Haifa DefenseTech Forum (H1 2026). Method. Figures marked est. are our own bottom-up estimates from those inputs, not published market data; assumptions available in full on request. Published estimates for this category vary by definition, so ranges are given rather than single figures.
