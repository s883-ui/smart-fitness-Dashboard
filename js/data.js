/* =====================================================================
   data.js — "الذاكرة" بتاعة الـ dashboard
   ---------------------------------------------------------------------
   فيه 3 حاجات:
   1) State: الوضع الحالي (اللغة، الصفحة المفتوحة، المكتوب في البحث...)
   2) Helpers: functions صغيرة بنستخدمها في كل حتة
   3) Fake data: كل الأسماء والأرقام اللي بتظهر في الصفحات
   لما الـ backend يجهز، الجزء رقم 3 بس هو اللي هيتشال ويتبدل بـ API.
   ===================================================================== */

// S = State. أي حاجة المستخدم بيغيّرها (tab، بحث، فلتر) بتتسجل هنا،
// وبعدين بنرسم الصفحة من جديد حسب القيم دي. ده أهم مبدأ في الـ dashboard كله.
const S={lang:'ar',page:'dashboard',loading:false,
  dash:{tab:'all',q:'',p:1}, tr:{status:'all',coach:'all',q:'',view:'table'},
  prog:{cat:'all'}, nut:{cat:'all'}, coach:{cat:'all'}, sub:{tab:'all',q:''},
  hidden:{}, sync:'error',
  calc:{sex:'m',age:28,weight:82,height:178,act:'1.55',goal:'cut'}};
// بنفتكر اللغة اللي المستخدم اختارها آخر مرة (محفوظة في المتصفح)
try{const l=localStorage.getItem('sfn-lang'); if(l==='en'||l==='ar') S.lang=l;}catch(e){}
// ===== Helpers =====
// L('عربي','English') بترجّع النص حسب اللغة الحالية. كل نص في الـ dashboard مكتوب كده.
const L=(a,e)=>S.lang==='ar'?a:e;
// T({ar:'...',en:'...'}) نفس فكرة L بس للبيانات المكتوبة كـ object
const T=o=>o?(S.lang==='ar'?o.ar:o.en):'';
// ic('search') بتعمل أيقونة. الاسم من مكتبة Google Material Symbols
const ic=(n,c='')=>`<span class="ms ${c}">${n}</span>`;
// fmt بتكتب الرقم بالشكل الصح للغة (1,842)، وcur بتضيف العملة (ج.م / EGP)
const fmt=n=>Number(n).toLocaleString(S.lang==='ar'?'ar-EG':'en-US');
const cur=n=>S.lang==='ar'?`${fmt(n)} ج.م`:`EGP ${fmt(n)}`;
// initials: أول حرفين من الاسم عشان الدايرة اللي مكان الصورة. esc: بتأمّن النص قبل ما نحطه في HTML
const initials=s=>s.split(' ').slice(0,2).map(w=>w[0]).join(S.lang==='ar'?' ':'');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// المستخدم الوهمي اللي فاتح الـ dashboard
const USER={name:{ar:'كابتن حازم رشدي',en:'Coach Hazem Roshdy'},role:{ar:'مدير الصالة الرياضية',en:'Gym Admin'}};

// ===== Fake data =====
// كل عنصر في القايمة object فيه بياناته. النصوص اللي بتتترجم مكتوبة {ar, en}.
// coach:'C-101' معناها إن المتدرب ده تبع المدرب اللي الكود بتاعه C-101 (ده "الربط" بين القوايم).
const COACHES=[
 {id:'C-101',name:{ar:'كابتن أحمد سامي',en:'Coach Ahmed Samy'},title:{ar:'رئيس المدربين',en:'Head Coach'},bio:{ar:'ماجستير علوم الرياضة، متخصص كمال أجسام ولياقة متقدمة.',en:'MSc Sports Science, bodybuilding and advanced conditioning.'},cat:'fit',members:142,years:12,rating:4.9,kpi:92,cap:88,status:'avail',tags:['#Hypertrophy','#Powerlifting']},
 {id:'C-104',name:{ar:'د. سارة المنصور',en:'Dr. Sara El-Mansour'},title:{ar:'استشارية تغذية علاجية',en:'Clinical Nutrition Consultant'},bio:{ar:'دكتوراه تغذية إكلينيكية رياضية، متخصصة في الأنظمة الهرمونية.',en:'PhD clinical sports nutrition, hormonal & metabolic diets.'},cat:'nut',members:120,years:9,rating:4.95,kpi:94,cap:98,status:'full',tags:['#ClinicalNutrition','#Keto']},
 {id:'C-109',name:{ar:'د. طارق الحازمي',en:'Dr. Tarek El-Hazmy'},title:{ar:'أخصائي تأهيل وإصابات ملاعب',en:'Rehab & Sports Injury Specialist'},bio:{ar:'استشاري علاج طبيعي، بروتوكولات الرباط الصليبي وأسفل الظهر.',en:'Physiotherapist, ACL and lower-back protocols.'},cat:'rehab',members:65,years:11,rating:4.92,kpi:96,cap:65,status:'avail',tags:['#Rehab','#Mobility']},
 {id:'C-112',name:{ar:'كابتن عمر الدسوقي',en:'Coach Omar El-Desouky'},title:{ar:'مدرب قوة بدنية وباورلفتنج',en:'Strength & Powerlifting Coach'},bio:{ar:'بطل جمهورية سابق، متخصص في الرفعات الثلاث.',en:'Former national champion, squat/bench/deadlift specialist.'},cat:'fit',members:95,years:8,rating:4.89,kpi:84,cap:72,status:'avail',tags:['#Strength','#Conditioning']},
 {id:'C-115',name:{ar:'د. مريم النجار',en:'Dr. Mariam El-Naggar'},title:{ar:'أخصائية تغذية رياضية',en:'Sports Nutritionist'},bio:{ar:'متخصصة في الحميات الخالية من مسببات الحساسية وتدوير الكارب.',en:'Allergy-safe diets and carb cycling.'},cat:'nut',members:78,years:6,rating:4.91,kpi:91,cap:55,status:'avail',tags:['#CarbCycling','#FatLoss']},
 {id:'C-120',name:{ar:'كابتن رامي كمال',en:'Coach Ramy Kamal'},title:{ar:'مدرب لياقة وظيفية وكاليستنكس',en:'Functional & Calisthenics Coach'},bio:{ar:'خبير التدريب بوزن الجسم والمرونة والتوازن.',en:'Bodyweight training, mobility and balance.'},cat:'cal',members:45,years:7,rating:4.88,kpi:100,cap:0,status:'leave',tags:['#Calisthenics','#HIIT']},
];
const TRAINEES=[
 {id:'SF-1082',name:{ar:'عمر خالد',en:'Omar Khaled'},goal:{ar:'تنشيف وبناء عضل',en:'Cut & build muscle'},coach:'C-101',plan:'2,400 kcal / High Protein',adh:94,status:'active',last:{ar:'منذ 15 دقيقة، سجّل الغداء',en:'15 min ago, logged lunch'},pkg:{ar:'سنوي بلاتيني',en:'Platinum annual'},left:142,upd:false},
 {id:'SF-1094',name:{ar:'سارة ناصر',en:'Sara Nasser'},goal:{ar:'لياقة وتوازن غذائي',en:'Fitness & balanced diet'},coach:'C-104',plan:'1,850 kcal / Balanced Keto',adh:62,status:'follow',last:{ar:'منذ يومين، لم تسجل تمارين',en:'2 days ago, no workouts logged'},pkg:{ar:'VIP ربع سنوي',en:'VIP quarterly'},left:5,upd:true},
 {id:'SF-0985',name:{ar:'محمود فتحي',en:'Mahmoud Fathy'},goal:{ar:'تضخيم وقوة',en:'Mass & strength'},coach:'C-112',plan:'3,100 kcal / Hypertrophy',adh:88,status:'active',last:{ar:'منذ ساعتين، تمرين أرجل',en:'2 h ago, leg day done'},pkg:{ar:'احتراف نصف سنوي',en:'Pro semi-annual'},left:78,upd:true},
 {id:'SF-1120',name:{ar:'مريم طارق',en:'Mariam Tarek'},goal:{ar:'تأهيل إصابة ركبة',en:'Knee injury rehab'},coach:'C-109',plan:'2,000 kcal / Anti-inflammatory',adh:78,status:'active',last:{ar:'اليوم 11:30 ص، جلسة علاج',en:'Today 11:30 AM, rehab session'},pkg:{ar:'الباقة الطبية',en:'Medical plan'},left:94,upd:false},
 {id:'SF-0841',name:{ar:'يوسف إبراهيم',en:'Youssef Ibrahim'},goal:{ar:'خسارة وزن مكثفة',en:'Intensive weight loss'},coach:'C-115',plan:'1,700 kcal / Low Carb',adh:45,status:'paused',last:{ar:'منذ 4 أيام، طلب إجازة',en:'4 days ago, requested a break'},pkg:{ar:'أساسية 3 شهور',en:'Basic 3 months'},left:22,upd:false},
 {id:'SF-1203',name:{ar:'نور حسن',en:'Nour Hassan'},goal:{ar:'تحسين القوام',en:'Body recomposition'},coach:'C-104',plan:'1,850 kcal / Balanced',adh:91,status:'active',last:{ar:'اليوم 9:15 ص، سجلت الفطار',en:'Today 9:15 AM, logged breakfast'},pkg:{ar:'ذهبية',en:'Gold'},left:110,upd:true},
 {id:'SF-1150',name:{ar:'كريم عادل',en:'Karim Adel'},goal:{ar:'قوة بدنية',en:'Powerlifting'},coach:'C-112',plan:'3,000 kcal / Strength',adh:83,status:'active',last:{ar:'منذ 4 ساعات، حدّث أوزان الرفعة',en:'4 h ago, updated lift weights'},pkg:{ar:'احتراف نصف سنوي',en:'Pro semi-annual'},left:61,upd:false},
 {id:'SF-1104',name:{ar:'هدى عبد العزيز',en:'Hoda Abdelaziz'},goal:{ar:'لياقة ومرونة',en:'Fitness & mobility'},coach:'C-120',plan:'1,700 kcal / Pilates',adh:34,status:'follow',last:{ar:'منذ 6 أيام، لم تسجل حضور',en:'6 days ago, no check-in'},pkg:{ar:'أساسية 3 شهور',en:'Basic 3 months'},left:6,upd:false},
 {id:'SF-1311',name:{ar:'أحمد مصطفى',en:'Ahmed Moustafa'},goal:{ar:'تنشيف',en:'Fat loss'},coach:'C-101',plan:'2,100 kcal / Shred',adh:76,status:'active',last:{ar:'أمس 8:30 م، كارديو',en:'Yesterday 8:30 PM, cardio'},pkg:{ar:'VIP ربع سنوي',en:'VIP quarterly'},left:3,upd:true},
 {id:'SF-1290',name:{ar:'ملك سمير',en:'Malak Samir'},goal:{ar:'تغذية علاجية',en:'Therapeutic nutrition'},coach:'C-115',plan:'1,950 kcal / Gluten-free',adh:89,status:'active',last:{ar:'منذ 30 دقيقة، سجلت سناك',en:'30 min ago, logged a snack'},pkg:{ar:'الباقة الطبية',en:'Medical plan'},left:47,upd:false},
 {id:'SF-0712',name:{ar:'طارق محمود',en:'Tarek Mahmoud'},goal:{ar:'تنشيف متقدم',en:'Advanced shred'},coach:'C-101',plan:'2,100 kcal / Shred Pro',adh:0,status:'expired',last:{ar:'منذ أسبوعين، انتهى الاشتراك',en:'2 weeks ago, plan expired'},pkg:{ar:'فضية',en:'Silver'},left:-14,upd:false},
 {id:'SF-1342',name:{ar:'ياسمين علي',en:'Yasmin Ali'},goal:{ar:'لياقة عامة',en:'General fitness'},coach:'C-120',plan:'1,800 kcal / Balanced',adh:58,status:'follow',last:{ar:'أمس، تخطت وجبة العشاء',en:'Yesterday, skipped dinner'},pkg:{ar:'شهرية',en:'Monthly'},left:9,upd:true},
];
// coachOf بتجيب بيانات المدرب من الكود بتاعه
const coachOf=id=>COACHES.find(c=>c.id===id);
// شكل ولون كل حالة متدرب، وchip بترسمها
const STATUS={active:['ok',{ar:'نشط وملتزم',en:'Active'}],follow:['warn',{ar:'يحتاج متابعة',en:'Needs follow-up'}],paused:['info',{ar:'متوقف مؤقتاً',en:'Paused'}],expired:['bad',{ar:'اشتراك منتهي',en:'Expired'}]};
const chip=(k)=>`<span class="chip ${STATUS[k][0]}">${T(STATUS[k][1])}</span>`;

// البرامج التدريبية + التصنيفات بتاعتها (للـ tabs)
const PROGRAMS=[
 {id:'PRG-HYP-01',cat:'mass',icon:'💪',name:{ar:'برنامج التضخيم المتقدم',en:'Advanced Hypertrophy'},desc:{ar:'تقسيم Push/Pull/Legs بأوزان متصاعدة لتحفيز نمو العضلات.',en:'Push/Pull/Legs split with progressive overload.'},days:5,weeks:12,lvl:{ar:'متقدم',en:'Advanced'},coach:'C-101',members:340,adh:92},
 {id:'PRG-SHR-04',cat:'cut',icon:'🔥',name:{ar:'التنشيف السريع',en:'Lean Shred'},desc:{ar:'مقاومة مركبة مع جلسات HIIT لرفع معدل الحرق.',en:'Compound resistance plus HIIT to raise calorie burn.'},days:4,weeks:8,lvl:{ar:'متوسط',en:'Intermediate'},coach:'C-115',members:415,adh:89},
 {id:'PRG-RHB-02',cat:'rehab',icon:'🦵',name:{ar:'استقرار الركبة وأسفل الظهر',en:'Knee & Core Rehab'},desc:{ar:'توازن ديناميكي وتقوية العضلات المساندة بعد الإصابات.',en:'Dynamic balance and support-muscle strengthening after injury.'},days:3,weeks:6,lvl:{ar:'تأهيلي',en:'Rehab'},coach:'C-109',members:88,adh:96},
 {id:'PRG-STR-09',cat:'str',icon:'🏋️',name:{ar:'القوة القصوى 5×5',en:'Max Power 5×5'},desc:{ar:'زيادة أرقام السكوات والبنش والديدلفت بحساب 1RM.',en:'Grow squat, bench and deadlift numbers with 1RM tracking.'},days:4,weeks:10,lvl:{ar:'محترف',en:'Elite'},coach:'C-112',members:210,adh:84},
 {id:'PRG-BGN-03',cat:'str',icon:'🧱',name:{ar:'التأسيس الشامل للجسم',en:'Full Body Foundation'},desc:{ar:'إتقان التمارين الأساسية وتهيئة المفاصل للأحمال.',en:'Master the basics and prepare joints for heavier loads.'},days:3,weeks:4,lvl:{ar:'مبتدئ',en:'Beginner'},coach:'C-101',members:520,adh:91},
 {id:'PRG-CAL-06',cat:'mass',icon:'🤸',name:{ar:'مهارات وزن الجسم',en:'Calisthenics Pro'},desc:{ar:'تدرّج نحو العقلة المتقدمة والوقوف على اليدين.',en:'Progress toward muscle-ups and handstands.'},days:4,weeks:8,lvl:{ar:'متوسط',en:'Intermediate'},coach:'C-120',members:147,adh:82},
];
const PROG_CATS=[['all',{ar:'كل البرامج',en:'All programs'}],['mass',{ar:'بناء وضخامة',en:'Muscle gain'}],['cut',{ar:'تنشيف',en:'Fat loss'}],['rehab',{ar:'تأهيل',en:'Rehab'}],['str',{ar:'قوة ولياقة',en:'Strength'}]];

// الأنظمة الغذائية: p = بروتين، c = كارب، f = دهون (بالجرام)
const DIETS=[
 {id:'NUT-CUT-01',cat:'cut',name:{ar:'تنشيف عالي البروتين',en:'High-Protein Lean Cut'},kcal:'1,850',p:180,c:140,f:40,meals:{ar:'4 وجبات + سناك',en:'4 meals + snack'},by:'C-104',members:412,adh:92},
 {id:'NUT-BLK-04',cat:'bulk',name:{ar:'التضخيم النظيف',en:'Clean Bulk'},kcal:'2,850',p:195,c:350,f:65,meals:{ar:'5 وجبات + مشروب استشفاء',en:'5 meals + recovery shake'},by:'C-115',members:325,adh:89},
 {id:'NUT-CYC-02',cat:'cut',name:{ar:'تدوير الكربوهيدرات',en:'Carb Cycling'},kcal:'1,700–2,400',p:175,c:200,f:45,meals:{ar:'4 وجبات حسب يوم التمرين',en:'4 meals by training day'},by:'C-115',members:280,adh:85},
 {id:'NUT-MED-06',cat:'flex',name:{ar:'الحمية المتوسطية للرياضيين',en:'Athletic Mediterranean'},kcal:'2,200',p:150,c:240,f:65,meals:{ar:'3 وجبات + سناك',en:'3 meals + snack'},by:'C-104',members:195,adh:94},
 {id:'NUT-KTO-08',cat:'keto',name:{ar:'كيتو رياضي',en:'Targeted Keto'},kcal:'2,050',p:145,c:30,f:155,meals:{ar:'3 وجبات + إلكترولايت',en:'3 meals + electrolytes'},by:'C-104',members:140,adh:81},
 {id:'NUT-HYP-11',cat:'med',name:{ar:'خالي من الجلوتين واللاكتوز',en:'Gluten & Lactose Free'},kcal:'1,950',p:160,c:200,f:55,meals:{ar:'4 وجبات آمنة',en:'4 safe meals'},by:'C-115',members:238,adh:91},
];
const DIET_CATS=[['all',{ar:'كل الأنظمة',en:'All diets'}],['cut',{ar:'تنشيف',en:'Fat loss'}],['bulk',{ar:'ضخامة',en:'Bulking'}],['keto',{ar:'كيتو',en:'Keto'}],['med',{ar:'علاجية',en:'Therapeutic'}],['flex',{ar:'مرنة',en:'Flexible'}]];

// الاشتراكات: m = كود المتدرب، st = حالة الدفع
const SUBS=[
 {m:'SF-1082',pkg:{ar:'السنوي البلاتيني',en:'Platinum annual'},price:9600,cycle:{ar:'سنوي',en:'Yearly'},next:{ar:'12 يناير 2027',en:'Jan 12, 2027'},pay:{ar:'فيزا •••• 4102',en:'Visa •••• 4102'},payIc:'credit_card',st:'paid'},
 {m:'SF-1094',pkg:{ar:'VIP الشاملة',en:'VIP all-in'},price:3200,cycle:{ar:'ربع سنوي',en:'Quarterly'},next:{ar:'17 أكتوبر 2026',en:'Oct 17, 2026'},pay:{ar:'إنستاباي',en:'InstaPay'},payIc:'account_balance',st:'due'},
 {m:'SF-0985',pkg:{ar:'الاحتراف',en:'Pro'},price:5400,cycle:{ar:'نصف سنوي',en:'Semi-annual'},next:{ar:'29 ديسمبر 2026',en:'Dec 29, 2026'},pay:{ar:'ميزة',en:'Meeza'},payIc:'credit_card',st:'paid'},
 {m:'SF-1104',pkg:{ar:'الأساسية',en:'Basic'},price:1800,cycle:{ar:'ربع سنوي',en:'Quarterly'},next:{ar:'18 أكتوبر 2026',en:'Oct 18, 2026'},pay:{ar:'بطاقة (فشلت)',en:'Card (failed)'},payIc:'error',st:'failed'},
 {m:'SF-1120',pkg:{ar:'الطبية الرياضية',en:'Medical sports'},price:1400,cycle:{ar:'شهري',en:'Monthly'},next:{ar:'15 نوفمبر 2026',en:'Nov 15, 2026'},pay:{ar:'فودافون كاش',en:'Vodafone Cash'},payIc:'smartphone',st:'paid'},
 {m:'SF-0712',pkg:{ar:'الفضية',en:'Silver'},price:2100,cycle:{ar:'ربع سنوي',en:'Quarterly'},next:{ar:'منتهي',en:'Expired'},pay:{ar:'كاش',en:'Cash'},payIc:'payments',st:'expired'},
];
const SUB_ST={paid:['ok',{ar:'نشط، تم الدفع',en:'Active, paid'}],due:['warn',{ar:'تجديد قريب',en:'Renewal due'}],failed:['bad',{ar:'دفع متعثر',en:'Payment failed'}],expired:['bad',{ar:'منتهي',en:'Expired'}]};

// الوصفات التلاتة. img = مسار الصورة جوه فولدر images
const RECIPES=[
 {id:'r1',emoji:'🥣',img:'images/oats.jpg',type:{ar:'فطار',en:'Breakfast'},name:{ar:'شوفان بالموز وزبدة الفول السوداني',en:'Banana Peanut Butter Oats'},desc:{ar:'فطار مشبع وسريع، طاقة ثابتة قبل التمرين.',en:'A filling, quick breakfast with steady pre-workout energy.'},time:10,kcal:410,p:18,c:56,f:13,
  ing:{ar:['60 جم شوفان','250 مل لبن خالي الدسم','1 موزة متوسطة','1 معلقة كبيرة زبدة فول سوداني','رشة قرفة'],en:['60 g rolled oats','250 ml skim milk','1 medium banana','1 tbsp peanut butter','Pinch of cinnamon']},
  steps:{ar:['سخّن اللبن واضف الشوفان وقلّب 5 دقايق على نار هادية.','قطّع الموزة شرايح.','حط الشوفان في طبق وفوقه الموز وزبدة الفول السوداني والقرفة.'],en:['Warm the milk, add oats and stir for 5 minutes on low heat.','Slice the banana.','Top the oats with banana, peanut butter and cinnamon.']}},
 {id:'r2',emoji:'🥗',img:'images/chicken-bowl.jpg',type:{ar:'غدا',en:'Lunch'},name:{ar:'بولة فراخ مشوية بالكينوا',en:'Grilled Chicken Quinoa Bowl'},desc:{ar:'بروتين عالي وكارب معقد، مناسب بعد التمرين.',en:'High protein with complex carbs, great post-workout.'},time:25,kcal:520,p:42,c:48,f:16,
  ing:{ar:['150 جم صدر فراخ','70 جم كينوا (قبل الطبخ)','خيار وطماطم وخس','نص أفوكادو صغيرة','عصير ليمونة ومعلقة زيت زيتون'],en:['150 g chicken breast','70 g quinoa (dry)','Cucumber, tomato and lettuce','½ small avocado','Juice of 1 lemon + 1 tsp olive oil']},
  steps:{ar:['تبّل الفراخ بالملح والفلفل والبابريكا واشويها 6 دقايق كل ناحية.','اسلق الكينوا في ضعف كميتها مية 15 دقيقة.','قطّع الخضار والأفوكادو.','جمّع الكل في بول وضيف الليمون وزيت الزيتون.'],en:['Season chicken with salt, pepper and paprika; grill 6 minutes per side.','Simmer quinoa in twice its volume of water for 15 minutes.','Chop the vegetables and avocado.','Assemble in a bowl and dress with lemon and olive oil.']}},
 {id:'r3',emoji:'🐟',img:'images/salmon.jpg',type:{ar:'عشا',en:'Dinner'},name:{ar:'سلمون بالفرن مع بطاطا',en:'Baked Salmon & Sweet Potato'},desc:{ar:'أوميجا 3 وكارب بطيء الهضم لعشا متوازن.',en:'Omega-3 and slow carbs for a balanced dinner.'},time:35,kcal:560,p:38,c:42,f:24,
  ing:{ar:['150 جم فيليه سلمون','200 جم بطاطا','كوب بروكلي','ليمون وثوم وشبت','معلقة صغيرة زيت زيتون'],en:['150 g salmon fillet','200 g sweet potato','1 cup broccoli','Lemon, garlic and dill','1 tsp olive oil']},
  steps:{ar:['سخّن الفرن على 200 درجة.','قطّع البطاطا مكعبات وادخلها الفرن 15 دقيقة.','ضيف السلمون والبروكلي متبلين بالليمون والثوم والشبت.','سيبهم 15 دقيقة كمان لحد ما السلمون يستوي.'],en:['Preheat the oven to 200°C.','Cube the sweet potato and roast for 15 minutes.','Add salmon and broccoli seasoned with lemon, garlic and dill.','Roast 15 more minutes until the salmon is cooked through.']}},
];

// ===== القايمة الجانبية =====
// كل عنصر فيه id = اسم الصفحة (هو نفسه اللي بيظهر بعد # في اللينك)
// العناصر اللي فيها g بس هي عناوين المجموعات (الرئيسية / التغذية / الإدارة)
const NAV=[
 {g:{ar:'الرئيسية',en:'Main'}},
 {id:'dashboard',ic:'grid_view',t:{ar:'لوحة التحكم',en:'Dashboard'}},
 {id:'trainees',ic:'group',t:{ar:'المتدربين',en:'Trainees'},badge:'1,842'},
 {id:'programs',ic:'exercise',t:{ar:'البرامج التدريبية',en:'Training programs'}},
 {g:{ar:'التغذية',en:'Nutrition'}},
 {id:'nutrition',ic:'restaurant',t:{ar:'الأنظمة الغذائية',en:'Diet plans'}},
 {id:'calories',ic:'calculate',t:{ar:'حاسبة السعرات',en:'Calorie calculator'},isNew:1},
 {id:'recipes',ic:'menu_book',t:{ar:'وصفات صحية جاهزة',en:'Healthy recipes'},isNew:1},
 {g:{ar:'الإدارة',en:'Management'}},
 {id:'coaches',ic:'badge',t:{ar:'المدربين والخبراء',en:'Coaches & staff'}},
 {id:'subscriptions',ic:'credit_card',t:{ar:'الاشتراكات والفواتير',en:'Subscriptions & billing'}},
 {id:'ai',ic:'neurology',t:{ar:'تحليلات الذكاء الاصطناعي',en:'AI insights'}},
 {id:'reports',ic:'monitoring',t:{ar:'التقارير',en:'Reports'}},
 {id:'settings',ic:'settings',t:{ar:'الإعدادات',en:'Settings'}},
];
