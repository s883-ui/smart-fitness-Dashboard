/* =====================================================================
   data.js — "الذاكرة" بتاعة الـ dashboard
   ---------------------------------------------------------------------
   1) State: الوضع الحالي (اللغة، الصفحة المفتوحة، البحث والفلاتر لكل جدول...)
   2) Helpers: functions صغيرة بنستخدمها في كل حتة
   3) Fake data: كل الأسماء والأرقام اللي بتظهر في الصفحات
   لما الـ backend يجهز، الجزء رقم 3 بس هو اللي هيتشال ويتبدل بـ API.
   ===================================================================== */

// S = State. S.L فيها حالة كل جدول/قايمة (البحث، الـ tab، الفلاتر، رقم الصفحة، شكل العرض)
const S={lang:'ar',page:'dashboard',L:{},hidden:{},sync:'error',open:{reports:false},chat:null,
  calc:{sex:'m',age:28,weight:82,height:178,act:'1.55',goal:'cut'}};
try{const l=localStorage.getItem('sfn-lang'); if(l==='en'||l==='ar') S.lang=l;}catch(e){}

// ===== Helpers =====
const L=(a,e)=>S.lang==='ar'?a:e;                         // نص حسب اللغة
const T=o=>o?(S.lang==='ar'?o.ar:o.en):'';                 // نفس الفكرة لـ {ar,en}
const ic=(n,c='')=>`<span class="ms ${c}">${n}</span>`;   // أيقونة Material Symbols
const fmt=n=>Number(n).toLocaleString(S.lang==='ar'?'ar-EG':'en-US');
const cur=n=>S.lang==='ar'?`${fmt(n)} ج.م`:`EGP ${fmt(n)}`;
const initials=s=>s.replace(/^(د\.|Dr\.|كابتن|Coach)\s*/,'').split(' ').slice(0,2).map(w=>w[0]).join(S.lang==='ar'?' ':'');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// تاريخ بعد/قبل عدد أيام من النهارده (12 أكتوبر 2026)
const TODAY=new Date(2026,9,12);
const dateIn=d=>new Date(TODAY.getFullYear(),TODAY.getMonth(),TODAY.getDate()+d).toLocaleDateString(S.lang==='ar'?'ar-EG':'en-US',{day:'numeric',month:'short',year:'numeric'});
const ago=h=>h<1?L('دلوقتي','just now'):h<24?L(`منذ ${fmt(h)} ساعة`,`${h} h ago`):L(`منذ ${fmt(Math.round(h/24))} يوم`,`${Math.round(h/24)} d ago`);

const USER={name:{ar:'كابتن حازم رشدي',en:'Coach Hazem Roshdy'},role:{ar:'مدير الصالة الرياضية',en:'Gym Admin'}};

// ===== مولّد أرقام ثابت =====
// بيطلع نفس الأرقام "العشوائية" كل مرة، عشان البيانات الوهمية متتغيرش مع كل refresh
let _seed=20261012;
const rnd=()=>(_seed=(_seed*16807)%2147483647)/2147483647;
const pick=a=>a[Math.floor(rnd()*a.length)];
const rint=(a,b)=>a+Math.floor(rnd()*(b-a+1));

const NAMES_M=[['عمر خالد','Omar Khaled'],['محمود فتحي','Mahmoud Fathy'],['يوسف إبراهيم','Youssef Ibrahim'],['كريم عادل','Karim Adel'],['أحمد مصطفى','Ahmed Moustafa'],['طارق محمود','Tarek Mahmoud'],['مصطفى حسين','Mostafa Hussein'],['زياد شريف','Ziad Sherif'],['حسن رمضان','Hassan Ramadan'],['إسلام جمال','Eslam Gamal'],['مازن وليد','Mazen Walid'],['شادي نبيل','Shady Nabil'],['علي حمدي','Ali Hamdy'],['خالد سعيد','Khaled Saeed']];
const NAMES_F=[['سارة ناصر','Sara Nasser'],['مريم طارق','Mariam Tarek'],['نور حسن','Nour Hassan'],['هدى عبد العزيز','Hoda Abdelaziz'],['ملك سمير','Malak Samir'],['ياسمين علي','Yasmin Ali'],['دينا فاروق','Dina Farouk'],['رنا مجدي','Rana Magdy'],['لينا أشرف','Lina Ashraf'],['فرح عماد','Farah Emad'],['منة أحمد','Menna Ahmed'],['جنى كريم','Jana Karim']];

/* ===================== الكادر: مدربين وأخصائيو تغذية ===================== */
// كل تخصص ليه: النوع (t = مدرب، n = تغذية)، الاسم، المسمى الوظيفي، نبذة، وtags
const SPEC={
 bb:{kind:'t',ar:'لياقة وبناء أجسام',en:'Fitness & bodybuilding',title:{ar:'مدرب بناء أجسام ولياقة',en:'Bodybuilding & fitness coach'},bio:{ar:'متخصص في الضخامة العضلية وبرامج اللياقة المتقدمة.',en:'Hypertrophy and advanced conditioning programs.'},tags:['#Hypertrophy','#EliteFit']},
 str:{kind:'t',ar:'قوة بدنية وباورلفتنج',en:'Strength & powerlifting',title:{ar:'مدرب القوة البدنية',en:'Strength & powerlifting coach'},bio:{ar:'تطوير أرقام السكوات والبنش والديدلفت بأمان.',en:'Safe progress on squat, bench and deadlift.'},tags:['#Strength','#1RM']},
 rehab:{kind:'t',ar:'علاج طبيعي وتأهيل',en:'Physio & rehab',title:{ar:'أخصائي تأهيل وإصابات ملاعب',en:'Rehab & sports injury specialist'},bio:{ar:'بروتوكولات الرباط الصليبي والكتف وأسفل الظهر.',en:'ACL, shoulder and lower-back protocols.'},tags:['#Rehab','#Mobility']},
 cal:{kind:'t',ar:'كاليستنكس ومرونة',en:'Calisthenics & mobility',title:{ar:'مدرب لياقة وظيفية وكاليستنكس',en:'Functional & calisthenics coach'},bio:{ar:'التدريب بوزن الجسم والمرونة والتوازن.',en:'Bodyweight training, mobility and balance.'},tags:['#Calisthenics','#Flexibility']},
 hiit:{kind:'t',ar:'كارديو وHIIT',en:'Cardio & HIIT',title:{ar:'مدرب كارديو وحرق دهون',en:'Cardio & fat-burn coach'},bio:{ar:'جلسات HIIT وتحسين اللياقة القلبية.',en:'HIIT sessions and cardiovascular fitness.'},tags:['#HIIT','#FatLoss']},
 clin:{kind:'n',ar:'تغذية علاجية',en:'Clinical nutrition',title:{ar:'استشاري تغذية علاجية',en:'Clinical nutrition consultant'},bio:{ar:'الأنظمة الهرمونية والأيضية والحالات الخاصة.',en:'Hormonal, metabolic and special-case diets.'},tags:['#ClinicalNutrition','#Metabolic']},
 sport:{kind:'n',ar:'تغذية رياضية',en:'Sports nutrition',title:{ar:'أخصائي تغذية رياضية',en:'Sports nutritionist'},bio:{ar:'توقيت الوجبات والمكملات حسب الأداء.',en:'Meal timing and supplements for performance.'},tags:['#Performance','#CarbCycling']},
 loss:{kind:'n',ar:'إنقاص الوزن',en:'Weight loss',title:{ar:'أخصائي تغذية وإنقاص وزن',en:'Weight-loss nutritionist'},bio:{ar:'عجز سعرات آمن وعادات أكل مستدامة.',en:'Safe calorie deficits and lasting habits.'},tags:['#FatLoss','#Habits']},
 diab:{kind:'n',ar:'سكري وأمراض مزمنة',en:'Diabetes & chronic',title:{ar:'أخصائي تغذية للأمراض المزمنة',en:'Chronic-condition nutritionist'},bio:{ar:'أنظمة متوازنة لمرضى السكري والضغط.',en:'Balanced plans for diabetes and blood pressure.'},tags:['#Diabetes','#LowGI']},
 veg:{kind:'n',ar:'نباتي وبدائل',en:'Plant-based',title:{ar:'أخصائي تغذية نباتية',en:'Plant-based nutritionist'},bio:{ar:'بروتين نباتي كامل وبدائل الحساسية.',en:'Complete plant protein and allergy swaps.'},tags:['#PlantBased','#AllergySafe']},
};
// [الكود، الاسم عربي، الاسم إنجليزي، التخصص، سنين الخبرة، عدد المتدربين، التقييم، الحالة، نسبة السعة]
const STAFF=[
 ['C-101','كابتن أحمد سامي','Coach Ahmed Samy','bb',12,142,4.98,'avail',88],
 ['C-109','د. طارق الحازمي','Dr. Tarek El-Hazmy','rehab',11,65,4.92,'avail',65],
 ['C-112','كابتن عمر الدسوقي','Coach Omar El-Desouky','str',8,95,4.89,'avail',72],
 ['C-120','كابتن رامي كمال','Coach Ramy Kamal','cal',7,45,4.88,'leave',0],
 ['C-123','كابتن محمد الشناوي','Coach Mohamed El-Shennawy','bb',9,118,4.86,'full',97],
 ['C-127','كابتن نادين فؤاد','Coach Nadine Fouad','hiit',6,84,4.9,'avail',70],
 ['C-131','كابتن هشام عزت','Coach Hesham Ezzat','str',14,76,4.93,'full',96],
 ['C-134','كابتن ريم حمدي','Coach Reem Hamdy','cal',5,52,4.84,'avail',58],
 ['C-138','د. وليد عبد الله','Dr. Walid Abdallah','rehab',10,47,4.95,'avail',61],
 ['C-142','كابتن آدم رأفت','Coach Adam Raafat','hiit',4,63,4.81,'avail',66],
 ['C-145','كابتن شريف منير','Coach Sherif Mounir','bb',7,101,4.87,'avail',79],
 ['N-104','د. سارة المنصور','Dr. Sara El-Mansour','clin',9,120,4.95,'full',98],
 ['N-115','د. مريم النجار','Dr. Mariam El-Naggar','sport',6,78,4.91,'avail',55],
 ['N-118','د. أحمد الجندي','Dr. Ahmed El-Gendy','loss',8,96,4.9,'avail',74],
 ['N-121','د. هبة صلاح','Dr. Heba Salah','diab',12,64,4.96,'avail',62],
 ['N-125','د. كريم الشاذلي','Dr. Karim El-Shazly','sport',5,88,4.85,'avail',80],
 ['N-129','د. ندى عصام','Dr. Nada Essam','veg',4,41,4.83,'avail',45],
 ['N-133','د. محمد رجب','Dr. Mohamed Ragab','clin',15,110,4.97,'full',99],
 ['N-136','د. إيمان سعد','Dr. Eman Saad','loss',7,72,4.88,'leave',0],
 ['N-140','د. عمرو الفقي','Dr. Amr El-Feki','diab',10,58,4.92,'avail',57],
].map(([id,ar,en,spec,years,members,rating,status,cap])=>({id,name:{ar,en},spec,kind:SPEC[spec].kind,years,members,rating,status,cap,k1:rint(80,97),k2:rint(8,46)}));
const TRAINERS=STAFF.filter(s=>s.kind==='t'), NUTS=STAFF.filter(s=>s.kind==='n');
const staffOf=id=>STAFF.find(s=>s.id===id);
const STAFF_ST={avail:['ok',{ar:'متاح',en:'Available'}],full:['warn',{ar:'مكتمل السعة',en:'At capacity'}],leave:['info',{ar:'إجازة',en:'On leave'}]};

/* ===================== المتدربين ===================== */
const GOALS=[{k:'cut',ar:'تنشيف وخسارة دهون',en:'Fat loss'},{k:'mass',ar:'تضخيم وبناء عضل',en:'Muscle gain'},{k:'fit',ar:'لياقة عامة',en:'General fitness'},{k:'rehab',ar:'تأهيل إصابة',en:'Injury rehab'},{k:'med',ar:'تغذية علاجية',en:'Therapeutic nutrition'}];
const PKGS=[{k:'plat',ar:'سنوي بلاتيني',en:'Platinum annual',price:9600,cycle:{ar:'سنوي',en:'Yearly'}},{k:'vip',ar:'VIP ربع سنوي',en:'VIP quarterly',price:3200,cycle:{ar:'ربع سنوي',en:'Quarterly'}},{k:'pro',ar:'احتراف نصف سنوي',en:'Pro semi-annual',price:5400,cycle:{ar:'نصف سنوي',en:'Semi-annual'}},{k:'basic',ar:'أساسية 3 شهور',en:'Basic 3 months',price:1800,cycle:{ar:'ربع سنوي',en:'Quarterly'}},{k:'med',ar:'الباقة الطبية',en:'Medical plan',price:1400,cycle:{ar:'شهري',en:'Monthly'}},{k:'month',ar:'شهرية',en:'Monthly',price:750,cycle:{ar:'شهري',en:'Monthly'}}];
const BRANCHES=[{k:'dq',ar:'فرع الدقي',en:'Dokki'},{k:'ns',ar:'فرع مدينة نصر',en:'Nasr City'},{k:'oc',ar:'فرع أكتوبر',en:'6th of October'}];
const PLANS={cut:['2,100 kcal / Shred','1,850 kcal / High Protein'],mass:['3,100 kcal / Hypertrophy','2,850 kcal / Clean Bulk'],fit:['2,200 kcal / Balanced'],rehab:['2,000 kcal / Anti-inflammatory'],med:['1,950 kcal / Gluten-free']};
const ACTS=[{ar:'سجّل وجبة الغدا',en:'logged lunch'},{ar:'خلّص تمرين الرجل',en:'finished leg day'},{ar:'حدّث الوزن',en:'updated weight'},{ar:'حضر جلسة كارديو',en:'attended cardio'},{ar:'مسجّلش تمارين',en:'no workouts logged'},{ar:'فوّت وجبة',en:'skipped a meal'}];
const WHEN=[{ar:'منذ 15 دقيقة',en:'15 min ago'},{ar:'منذ ساعتين',en:'2 h ago'},{ar:'النهارده 9:15 ص',en:'Today 9:15 AM'},{ar:'امبارح',en:'Yesterday'},{ar:'منذ يومين',en:'2 days ago'},{ar:'منذ 5 أيام',en:'5 days ago'}];
const TRAINEES=Array.from({length:26},(_,i)=>{
 const f=i%2===1, n=f?NAMES_F[(i>>1)%NAMES_F.length]:NAMES_M[(i>>1)%NAMES_M.length], g=pick(GOALS);
 const status=pick(['active','active','active','active','follow','follow','paused','expired']);
 const adh=status==='expired'?0:status==='follow'?rint(30,64):status==='paused'?rint(38,55):rint(72,98);
 const tr=g.k==='rehab'?pick(TRAINERS.filter(t=>t.spec==='rehab')):pick(TRAINERS), nu=pick(NUTS);
 const w=(status==='follow'||status==='paused')?pick(WHEN.slice(3)):pick(WHEN.slice(0,4));
 const a=status==='follow'?pick(ACTS.slice(4)):pick(ACTS.slice(0,4));
 return {id:'SF-'+(1040+i*13),name:{ar:n[0],en:n[1]},gender:f?'f':'m',age:rint(19,46),goal:g,coach:tr.id,nut:nu.id,
  plan:pick(PLANS[g.k]),adh,status,last:{ar:`${w.ar}، ${a.ar}`,en:`${w.en}, ${a.en}`},pkg:pick(PKGS),
  left:status==='expired'?-rint(3,20):rint(2,160),upd:rnd()<.4,branch:pick(BRANCHES)};
});
const trOf=id=>TRAINEES.find(t=>t.id===id);
const STATUS={active:['ok',{ar:'نشط وملتزم',en:'Active'}],follow:['warn',{ar:'يحتاج متابعة',en:'Needs follow-up'}],paused:['info',{ar:'متوقف مؤقتاً',en:'Paused'}],expired:['bad',{ar:'اشتراك منتهي',en:'Expired'}]};
const chip=k=>`<span class="chip ${STATUS[k][0]}">${T(STATUS[k][1])}</span>`;

/* ===================== البرامج التدريبية ===================== */
const LVL={beg:{ar:'مبتدئ',en:'Beginner'},int:{ar:'متوسط',en:'Intermediate'},adv:{ar:'متقدم',en:'Advanced'},elite:{ar:'محترف',en:'Elite'},rehab:{ar:'تأهيلي',en:'Rehab'}};
const PROG_CATS=[['mass',{ar:'بناء وضخامة عضلية',en:'Muscle gain'},'fitness_center'],['cut',{ar:'تنشيف وخسارة دهون',en:'Fat loss'},'local_fire_department'],['rehab',{ar:'تأهيل وإصابات ملاعب',en:'Rehab'},'healing'],['str',{ar:'قوة بدنية ولياقة',en:'Strength & fitness'},'exercise']];
const progCat=k=>PROG_CATS.find(c=>c[0]===k);
// صور البرامج التدريبية (متوزعة عشوائي على الصفحتين)
const PROG_IMG={'PRG-HYP-01':'images/prog-3.jpg','PRG-SHR-04':'images/prog-6.jpg','PRG-RHB-02':'images/prog-1.jpg','PRG-STR-09':'images/prog-4.jpg','PRG-BGN-03':'images/prog-2.jpg','PRG-CAL-06':'images/prog-5.jpg','PRG-HYP-07':'images/prog-8.jpg','PRG-CUT-05':'images/prog-9.jpg','PRG-CUT-08':'images/prog-7.jpg','PRG-RHB-05':'images/prog-12.jpg','PRG-STR-11':'images/prog-11.jpg','PRG-BGN-10':'images/prog-10.jpg'};
const PROGRAMS=[
 ['PRG-HYP-01','mass',{ar:'برنامج التضخيم المتقدم',en:'Advanced Hypertrophy'},{ar:'تقسيم Push/Pull/Legs بأوزان متصاعدة لتحفيز نمو العضلات.',en:'Push/Pull/Legs split with progressive overload.'},5,12,'adv','C-101',340,92],
 ['PRG-SHR-04','cut',{ar:'التنشيف السريع',en:'Lean Shred'},{ar:'مقاومة مركبة مع جلسات HIIT لرفع معدل الحرق.',en:'Compound resistance plus HIIT to raise calorie burn.'},4,8,'int','C-127',415,89],
 ['PRG-RHB-02','rehab',{ar:'استقرار الركبة وأسفل الظهر',en:'Knee & Core Rehab'},{ar:'توازن ديناميكي وتقوية العضلات المساندة بعد الإصابات.',en:'Dynamic balance and support-muscle strengthening after injury.'},3,6,'rehab','C-109',88,96],
 ['PRG-STR-09','str',{ar:'القوة القصوى 5×5',en:'Max Power 5×5'},{ar:'زيادة أرقام السكوات والبنش والديدلفت بحساب 1RM.',en:'Grow squat, bench and deadlift numbers with 1RM tracking.'},4,10,'elite','C-112',210,84],
 ['PRG-BGN-03','str',{ar:'التأسيس الشامل للجسم',en:'Full Body Foundation'},{ar:'إتقان التمارين الأساسية وتهيئة المفاصل للأحمال.',en:'Master the basics and prepare joints for heavier loads.'},3,4,'beg','C-101',520,91],
 ['PRG-CAL-06','mass',{ar:'مهارات وزن الجسم',en:'Calisthenics Pro'},{ar:'تدرّج نحو العقلة المتقدمة والوقوف على اليدين.',en:'Progress toward muscle-ups and handstands.'},4,8,'int','C-134',147,82],
 ['PRG-HYP-07','mass',{ar:'تضخيم الجزء العلوي',en:'Upper Body Mass'},{ar:'تركيز على الصدر والظهر والأكتاف بحجم تدريبي عالي.',en:'Chest, back and shoulders with high training volume.'},4,8,'int','C-123',198,87],
 ['PRG-CUT-05','cut',{ar:'حرق الدهون بالكارديو',en:'Cardio Burn'},{ar:'كارديو منخفض الشدة مع مقاومة خفيفة للمبتدئين.',en:'Low-intensity cardio with light resistance for beginners.'},3,6,'beg','C-127',265,90],
 ['PRG-CUT-08','cut',{ar:'HIIT المكثف',en:'Intense HIIT'},{ar:'جلسات متقطعة عالية الشدة 30 دقيقة.',en:'30-minute high-intensity interval sessions.'},5,6,'adv','C-142',176,79],
 ['PRG-RHB-05','rehab',{ar:'تأهيل الكتف',en:'Shoulder Rehab'},{ar:'استعادة مدى الحركة وتقوية الكفة المدورة.',en:'Restore range of motion and strengthen the rotator cuff.'},3,8,'rehab','C-138',54,94],
 ['PRG-STR-11','str',{ar:'القوة الوظيفية',en:'Functional Strength'},{ar:'حركات مركبة تخدم الحياة اليومية والرياضة.',en:'Compound movements for daily life and sport.'},3,8,'int','C-131',132,86],
 ['PRG-BGN-10','str',{ar:'بداية لياقة للسيدات',en:"Women's Fitness Start"},{ar:'برنامج تأسيسي بأوزان خفيفة وتمارين مرونة.',en:'Foundation program with light loads and mobility.'},3,6,'beg','C-134',230,93],
].map(([id,cat,name,desc,days,weeks,lvl,coach,members,adh])=>({id,cat,name,desc,days,weeks,lvl,coach,members,adh,img:PROG_IMG[id]}));

/* ===================== الأنظمة الغذائية ===================== */
const DIET_CATS=[['cut',{ar:'تنشيف',en:'Fat loss'}],['bulk',{ar:'ضخامة',en:'Bulking'}],['keto',{ar:'كيتو',en:'Keto'}],['med',{ar:'علاجية',en:'Therapeutic'}],['flex',{ar:'مرنة',en:'Flexible'}],['veg',{ar:'نباتية',en:'Plant-based'}]];
const DIETS=[
 ['NUT-CUT-01','cut',{ar:'تنشيف عالي البروتين',en:'High-Protein Lean Cut'},1850,180,140,40,4,'N-104',412,92],
 ['NUT-BLK-04','bulk',{ar:'التضخيم النظيف',en:'Clean Bulk'},2850,195,350,65,5,'N-115',325,89],
 ['NUT-CYC-02','cut',{ar:'تدوير الكربوهيدرات',en:'Carb Cycling'},2050,175,200,45,4,'N-125',280,85],
 ['NUT-MED-06','flex',{ar:'الحمية المتوسطية للرياضيين',en:'Athletic Mediterranean'},2200,150,240,65,3,'N-104',195,94],
 ['NUT-KTO-08','keto',{ar:'كيتو رياضي',en:'Targeted Keto'},2050,145,30,155,3,'N-133',140,81],
 ['NUT-HYP-11','med',{ar:'خالي من الجلوتين واللاكتوز',en:'Gluten & Lactose Free'},1950,160,200,55,4,'N-129',238,91],
 ['NUT-CUT-03','cut',{ar:'تنشيف للسيدات',en:"Women's Lean"},1600,150,140,45,4,'N-118',264,88],
 ['NUT-BLK-05','bulk',{ar:'تضخيم للمبتدئين',en:'Beginner Bulk'},2600,170,320,70,5,'N-125',187,86],
 ['NUT-MED-09','med',{ar:'نظام صديق لمرضى السكري',en:'Diabetic Friendly'},1900,140,160,70,4,'N-121',121,95],
 ['NUT-VEG-02','veg',{ar:'نباتي عالي البروتين',en:'High-Protein Plant'},2100,140,250,60,4,'N-129',96,84],
 ['NUT-KTO-10','keto',{ar:'كيتو للتنشيف',en:'Keto Cut'},1800,140,25,135,3,'N-133',158,80],
 ['NUT-FLX-07','flex',{ar:'المرن IIFYM',en:'Flexible IIFYM'},2300,160,250,70,4,'N-118',203,87],
].map(([id,cat,name,kcal,p,c,f,meals,by,members,adh])=>({id,cat,name,kcal,p,c,f,meals,by,members,adh}));

/* ===================== الوصفات ===================== */
const MEAL_T={bf:{ar:'فطار',en:'Breakfast'},lu:{ar:'غدا',en:'Lunch'},di:{ar:'عشا',en:'Dinner'},sn:{ar:'سناك',en:'Snack'}};
const RECIPES=[
 {id:'RCP-01',mt:'bf',emoji:'🥣',img:'images/oats.jpg',type:{ar:'فطار',en:'Breakfast'},name:{ar:'شوفان بالموز وزبدة الفول السوداني',en:'Banana Peanut Butter Oats'},desc:{ar:'فطار مشبع وسريع، طاقة ثابتة قبل التمرين.',en:'A filling, quick breakfast with steady pre-workout energy.'},time:10,kcal:410,p:18,c:56,f:13,
  ing:{ar:['60 جم شوفان','250 مل لبن خالي الدسم','1 موزة متوسطة','1 معلقة كبيرة زبدة فول سوداني','رشة قرفة'],en:['60 g rolled oats','250 ml skim milk','1 medium banana','1 tbsp peanut butter','Pinch of cinnamon']},
  steps:{ar:['سخّن اللبن واضف الشوفان وقلّب 5 دقايق على نار هادية.','قطّع الموزة شرايح.','حط الشوفان في طبق وفوقه الموز وزبدة الفول السوداني والقرفة.'],en:['Warm the milk, add oats and stir for 5 minutes on low heat.','Slice the banana.','Top the oats with banana, peanut butter and cinnamon.']}},
 {id:'RCP-02',mt:'lu',emoji:'🥗',img:'images/chicken-bowl.jpg',type:{ar:'غدا',en:'Lunch'},name:{ar:'بولة فراخ مشوية بالكينوا',en:'Grilled Chicken Quinoa Bowl'},desc:{ar:'بروتين عالي وكارب معقد، مناسب بعد التمرين.',en:'High protein with complex carbs, great post-workout.'},time:25,kcal:520,p:42,c:48,f:16,
  ing:{ar:['150 جم صدر فراخ','70 جم كينوا (قبل الطبخ)','خيار وطماطم وخس','نص أفوكادو صغيرة','عصير ليمونة ومعلقة زيت زيتون'],en:['150 g chicken breast','70 g quinoa (dry)','Cucumber, tomato and lettuce','½ small avocado','Juice of 1 lemon + 1 tsp olive oil']},
  steps:{ar:['تبّل الفراخ بالملح والفلفل والبابريكا واشويها 6 دقايق كل ناحية.','اسلق الكينوا في ضعف كميتها مية 15 دقيقة.','قطّع الخضار والأفوكادو.','جمّع الكل في بول وضيف الليمون وزيت الزيتون.'],en:['Season chicken with salt, pepper and paprika; grill 6 minutes per side.','Simmer quinoa in twice its volume of water for 15 minutes.','Chop the vegetables and avocado.','Assemble in a bowl and dress with lemon and olive oil.']}},
 {id:'RCP-03',mt:'di',emoji:'🐟',img:'images/salmon.jpg',type:{ar:'عشا',en:'Dinner'},name:{ar:'سلمون بالفرن مع بطاطا',en:'Baked Salmon & Sweet Potato'},desc:{ar:'أوميجا 3 وكارب بطيء الهضم لعشا متوازن.',en:'Omega-3 and slow carbs for a balanced dinner.'},time:35,kcal:560,p:38,c:42,f:24,
  ing:{ar:['150 جم فيليه سلمون','200 جم بطاطا','كوب بروكلي','ليمون وثوم وشبت','معلقة صغيرة زيت زيتون'],en:['150 g salmon fillet','200 g sweet potato','1 cup broccoli','Lemon, garlic and dill','1 tsp olive oil']},
  steps:{ar:['سخّن الفرن على 200 درجة.','قطّع البطاطا مكعبات وادخلها الفرن 15 دقيقة.','ضيف السلمون والبروكلي متبلين بالليمون والثوم والشبت.','سيبهم 15 دقيقة كمان لحد ما السلمون يستوي.'],en:['Preheat the oven to 200°C.','Cube the sweet potato and roast for 15 minutes.','Add salmon and broccoli seasoned with lemon, garlic and dill.','Roast 15 more minutes until the salmon is cooked through.']}},
 {id:'RCP-04',mt:'bf',emoji:'🍳',name:{ar:'أومليت بياض البيض بالسبانخ',en:'Egg-White Spinach Omelette'},desc:{ar:'بروتين عالي وسعرات قليلة لبداية يوم خفيفة.',en:'High protein and low calories for a light start.'},time:8,kcal:260,p:30,c:10,f:11,
  ing:{ar:['5 بياض بيض + 1 بيضة كاملة','كوب سبانخ','ربع كوب جبنة قريش','شريحة توست أسمر'],en:['5 egg whites + 1 whole egg','1 cup spinach','¼ cup cottage cheese','1 slice wholegrain toast']},
  steps:{ar:['شوّح السبانخ دقيقة في طاسة مدهونة خفيف.','اضرب البيض وصبه فوق السبانخ.','ضيف الجبنة واقفل الأومليت وقدمه مع التوست.'],en:['Wilt the spinach for a minute in a lightly oiled pan.','Whisk the eggs and pour over the spinach.','Add the cheese, fold, and serve with toast.']}},
 {id:'RCP-05',mt:'sn',emoji:'🫐',name:{ar:'زبادي يوناني بالتوت والجرانولا',en:'Greek Yogurt Berry Parfait'},desc:{ar:'سناك سريع غني بالبروتين بعد التمرين.',en:'Quick protein-rich post-workout snack.'},time:5,kcal:290,p:22,c:34,f:7,
  ing:{ar:['200 جم زبادي يوناني','نص كوب توت مشكل','2 معلقة جرانولا','معلقة صغيرة عسل'],en:['200 g Greek yogurt','½ cup mixed berries','2 tbsp granola','1 tsp honey']},
  steps:{ar:['حط نص الزبادي في كوباية.','ضيف طبقة توت وجرانولا.','كرر الطبقات وزوّد العسل فوق.'],en:['Spoon half the yogurt into a glass.','Add a layer of berries and granola.','Repeat and drizzle honey on top.']}},
 {id:'RCP-06',mt:'lu',emoji:'🥙',name:{ar:'سلطة تونة بالحمص',en:'Tuna Chickpea Salad'},desc:{ar:'غدا سريع مشبع من غير طبخ.',en:'A filling no-cook lunch.'},time:12,kcal:430,p:36,c:38,f:14,
  ing:{ar:['علبة تونة مصفاة','نص كوب حمص مسلوق','خيار وطماطم وبصل أخضر','عصير ليمونة ومعلقة زيت زيتون'],en:['1 can tuna, drained','½ cup cooked chickpeas','Cucumber, tomato and spring onion','Juice of 1 lemon + 1 tsp olive oil']},
  steps:{ar:['قطّع الخضار مكعبات صغيرة.','اخلط التونة والحمص مع الخضار.','تبّل بالليمون والزيت والملح والكمون.'],en:['Dice the vegetables.','Mix tuna and chickpeas with the vegetables.','Season with lemon, oil, salt and cumin.']}},
 {id:'RCP-07',mt:'di',emoji:'🍲',name:{ar:'شوربة عدس بالخضار',en:'Lentil Vegetable Soup'},desc:{ar:'عشا دافي غني بالألياف والبروتين النباتي.',en:'Warm dinner rich in fibre and plant protein.'},time:30,kcal:360,p:20,c:52,f:7,
  ing:{ar:['كوب عدس أصفر','جزرة وبصلة وفص توم','لتر شوربة خضار','كمون وكركم'],en:['1 cup yellow lentils','1 carrot, 1 onion, 1 garlic clove','1 L vegetable stock','Cumin and turmeric']},
  steps:{ar:['شوّح البصل والتوم والجزر 3 دقايق.','ضيف العدس والشوربة وسيبه 20 دقيقة.','اضربه في الخلاط وتبّله.'],en:['Sauté onion, garlic and carrot for 3 minutes.','Add lentils and stock; simmer 20 minutes.','Blend and season.']}},
 {id:'RCP-08',mt:'sn',emoji:'🥤',name:{ar:'سموذي البروتين الأخضر',en:'Green Protein Smoothie'},desc:{ar:'مشروب سريع للاستشفاء بعد التمرين.',en:'Quick post-workout recovery drink.'},time:5,kcal:310,p:28,c:36,f:6,
  ing:{ar:['سكوب بروتين فانيليا','كوب سبانخ','موزة صغيرة','كوب لبن لوز'],en:['1 scoop vanilla protein','1 cup spinach','1 small banana','1 cup almond milk']},
  steps:{ar:['حط كل المكونات في الخلاط.','اضربهم دقيقة لحد ما يبقوا ناعمين.','اشربه على طول.'],en:['Add everything to the blender.','Blend for a minute until smooth.','Drink right away.']}},
 {id:'RCP-09',mt:'di',emoji:'🌯',name:{ar:'بول فاهيتا لحم بالفلفل',en:'Lean Beef Fajita Bowl'},desc:{ar:'عشا عالي البروتين لأيام التمرين التقيلة.',en:'High-protein dinner for heavy training days.'},time:25,kcal:540,p:44,c:46,f:18,
  ing:{ar:['150 جم لحم قليل الدهن شرايح','فلفل ألوان وبصل','نص كوب رز بني','صوص سالسا'],en:['150 g lean beef strips','Mixed peppers and onion','½ cup brown rice','Salsa']},
  steps:{ar:['تبّل اللحم بالبابريكا والكمون.','شوّحه على نار عالية 5 دقايق مع الفلفل.','قدمه فوق الرز مع السالسا.'],en:['Season beef with paprika and cumin.','Stir-fry 5 minutes on high heat with the peppers.','Serve over rice with salsa.']}},
];

/* ===================== الاشتراكات ===================== */
const METHODS=[{k:'visa',ar:'فيزا',en:'Visa',ic:'credit_card'},{k:'meeza',ar:'ميزة',en:'Meeza',ic:'credit_card'},{k:'insta',ar:'إنستاباي',en:'InstaPay',ic:'account_balance'},{k:'vf',ar:'فودافون كاش',en:'Vodafone Cash',ic:'smartphone'},{k:'cash',ar:'كاش',en:'Cash',ic:'payments'}];
const SUBS=TRAINEES.map((t,i)=>{const st=t.status==='expired'?'expired':(i%9===4?'failed':t.left<=10?'due':'paid');
 return {id:'SUB-'+(5200+i*7),m:t.id,pkg:t.pkg,method:st==='failed'?METHODS[0]:pick(METHODS),st,left:t.left};});
const SUB_ST={paid:['ok',{ar:'مدفوع',en:'Paid'}],due:['warn',{ar:'تجديد قريب',en:'Renewal due'}],failed:['bad',{ar:'دفع متعثر',en:'Payment failed'}],expired:['bad',{ar:'منتهي',en:'Expired'}]};

/* ===================== طلبات التسجيل (مدربين وأخصائيين) ===================== */
const CERTS={t:['NASM-CPT','ISSA','ACE','ACSM'],n:[{ar:'بكالوريوس تغذية',en:'BSc Nutrition'},{ar:'ماجستير تغذية علاجية',en:'MSc Clinical Nutrition'},{ar:'دبلومة تغذية رياضية',en:'Sports Nutrition Diploma'}]};
const REQUESTS=Array.from({length:15},(_,i)=>{const role=i%3===1?'n':'t',f=i%2===0,n=f?NAMES_F[(i+3)%NAMES_F.length]:NAMES_M[(i+5)%NAMES_M.length];
 const specs=Object.keys(SPEC).filter(k=>SPEC[k].kind===role), st=i<6?'pending':pick(['approved','approved','rejected','pending']);
 const c=pick(CERTS[role]);
 return {id:'REQ-'+(3100+i*7),name:{ar:(role==='n'?'د. ':'كابتن ')+n[0],en:(role==='n'?'Dr. ':'Coach ')+n[1]},role,spec:pick(specs),years:rint(1,13),
  docs:st==='rejected'?rint(1,2):rint(2,3),cert:typeof c==='string'?{ar:c,en:c}:c,days:rint(0,20),status:st,phone:'01'+rint(0,2)+rint(10000000,99999999)};});
const REQ_ST={pending:['warn',{ar:'قيد المراجعة',en:'Pending'}],approved:['ok',{ar:'مقبول',en:'Approved'}],rejected:['bad',{ar:'مرفوض',en:'Rejected'}]};

/* ===================== الجيمات المتعاقدة ===================== */
const CITIES=[{k:'cai',ar:'القاهرة',en:'Cairo'},{k:'giz',ar:'الجيزة',en:'Giza'},{k:'alx',ar:'الإسكندرية',en:'Alexandria'},{k:'man',ar:'المنصورة',en:'Mansoura'},{k:'tan',ar:'طنطا',en:'Tanta'}];
const TIERS={basic:{ar:'أساسي',en:'Basic'},pro:{ar:'احترافي',en:'Pro'},ent:{ar:'مؤسسي',en:'Enterprise'}};
const GYMS=[['باور زون','Power Zone'],['آيرون فيت','Iron Fit'],['جولدن بودي','Golden Body'],['فلكس جيم','Flex Gym'],['بيك فيتنس','Peak Fitness'],['أوكسجين جيم','Oxygen Gym'],['تيتان أرينا','Titan Arena'],['بلس كلوب','Pulse Club'],['فيتال سبورت','Vital Sport'],['كور ستوديو','Core Studio'],['ستيل هاوس','Steel House'],['موف لاب','Move Lab']]
 .map(([ar,en],i)=>{const tier=pick(['basic','pro','pro','ent']);const st=i===4?'susp':i%5===2?'renew':'active';
  return {id:'GYM-'+String(i+1).padStart(3,'0'),name:{ar,en},city:CITIES[i%CITIES.length],branches:tier==='ent'?rint(4,9):rint(1,3),members:rint(180,1400),tier,end:st==='renew'?rint(5,25):rint(60,330),rating:(4.4+rnd()*0.55).toFixed(1),status:st,comm:tier==='ent'?8:tier==='pro'?10:12};});
const GYM_ST={active:['ok',{ar:'تعاقد نشط',en:'Active'}],renew:['warn',{ar:'تجديد قريب',en:'Renewal due'}],susp:['bad',{ar:'موقوف مؤقتاً',en:'Suspended'}]};

/* ===================== تذاكر الدعم ===================== */
const AGENTS=[{ar:'منى عادل',en:'Mona Adel'},{ar:'حسام فاروق',en:'Hossam Farouk'},{ar:'ريهام نبيل',en:'Reham Nabil'}];
const TCK_CAT={booking:{ar:'الحجوزات',en:'Booking'},billing:{ar:'الدفع والفواتير',en:'Billing'},plans:{ar:'الخطط',en:'Plans'},coach:{ar:'المدربين',en:'Coaches'},device:{ar:'الأجهزة',en:'Devices'},tech:{ar:'مشكلة تقنية',en:'Technical'}};
const PRIO={urgent:['bad',{ar:'عاجل',en:'Urgent'}],high:['warn',{ar:'عالي',en:'High'}],med:['info',{ar:'متوسط',en:'Medium'}],low:['',{ar:'منخفض',en:'Low'}]};
const TCK_ST={open:['warn',{ar:'مفتوحة',en:'Open'}],progress:['info',{ar:'قيد المعالجة',en:'In progress'}],resolved:['ok',{ar:'تم الحل',en:'Resolved'}],closed:['',{ar:'مغلقة',en:'Closed'}]};
const TCK_SUBJ=[['booking',{ar:'مش قادر أحجز جلسة مع المدرب',en:"Can't book a session with my coach"}],['billing',{ar:'الفلوس اتخصمت مرتين في التجديد',en:'Charged twice for my renewal'}],['plans',{ar:'خطة التغذية مش ظاهرة في التطبيق',en:'Diet plan not showing in the app'}],['coach',{ar:'عايز أغيّر المدرب',en:'Request to change coach'}],['device',{ar:'الميزان الذكي مش بيعمل مزامنة',en:'Smart scale not syncing'}],['billing',{ar:'طلب استرداد مبلغ',en:'Refund request'}],['tech',{ar:'التطبيق بيقفل لوحده',en:'App keeps crashing'}],['billing',{ar:'استفسار عن الباقة الطبية',en:'Question about the medical plan'}],['plans',{ar:'الخطة الجديدة صعبة عليّا',en:'New workout plan feels too hard'}]];
const TICKETS=Array.from({length:18},(_,i)=>{const [cat,subj]=TCK_SUBJ[i%TCK_SUBJ.length], t=TRAINEES[(i*5+2)%TRAINEES.length];
 const status=i<5?'open':pick(['progress','progress','resolved','closed','open']); const agent=status==='open'&&i%2?null:pick(AGENTS);
 const msgs=[{from:'m',text:subj,h:rint(2,70)}]; if(status!=='open') msgs.push({from:'a',text:{ar:'أهلاً بحضرتك، استلمنا طلبك وبنراجعه دلوقتي.',en:"Hi, we've received your request and are looking into it."},h:msgs[0].h-1});
 if(status==='resolved'||status==='closed') msgs.push({from:'a',text:{ar:'تم حل المشكلة، ولو لسه فيه حاجة ابعتلنا.',en:"This is now fixed; let us know if anything's still off."},h:Math.max(0,msgs[0].h-6)});
 return {id:'TCK-'+(1040+i*3),cat,subj,m:t.id,prio:pick(['urgent','high','med','med','low']),status,agent,h:msgs[msgs.length-1].h,msgs};});

/* ===================== متابعة المحادثات ===================== */
const CHAT_T={t:[[['m',{ar:'كابتن، الركبة بتوجعني شوية بعد تمرين امبارح',en:"Coach, my knee hurts a bit after yesterday's session"}],['s',{ar:'سلامتك. خفّف السكوات النهارده وابعتلي فيديو للحركة',en:'Take it easy, skip heavy squats today and send me a video'}],['m',{ar:'تمام، هبعته بالليل',en:"OK, I'll send it tonight"}]],
 [['m',{ar:'ينفع أبدّل تمرين الخميس للجمعة؟',en:'Can I move Thursday’s session to Friday?'}],['s',{ar:'أكيد، هعدّل الجدول دلوقتي',en:"Sure, I'll update the schedule now"}],['m',{ar:'شكراً يا كابتن',en:'Thanks coach'}]],
 [['m',{ar:'وصلت لـ 100 كيلو في البنش 💪',en:'Hit 100 kg on bench 💪'}],['s',{ar:'ممتاز! الأسبوع الجاي هنزوّد 2.5 كيلو',en:"Great! We'll add 2.5 kg next week"}]],
 [['m',{ar:'كابتن، مش هقدر أحضر الأسبوع ده، تعبان',en:"Coach, I can't make it this week, I'm unwell"}]]],
 n:[[['m',{ar:'دكتور، ينفع آكل رز بالليل؟',en:'Can I eat rice at night?'}],['s',{ar:'ينفع نص كوب مع البروتين، بس قبل 9',en:'Half a cup with protein is fine, before 9 PM'}],['m',{ar:'تمام 👍',en:'Got it 👍'}]],
 [['m',{ar:'الوزن ثابت من أسبوعين',en:'My weight has been flat for two weeks'}],['s',{ar:'هنعمل يوم refeed السبت ونراجع الأرقام الإثنين',en:"We'll do a refeed on Saturday and review on Monday"}]],
 [['m',{ar:'ممكن بديل للتونة؟ عندي حساسية',en:"Is there a swap for tuna? I'm allergic"}],['s',{ar:'استخدم صدور فراخ أو بيض، وهحدّث الخطة',en:"Use chicken breast or eggs; I'll update the plan"}]],
 [['m',{ar:'ممكن تبعتلي رقمك الشخصي نكمل برا التطبيق؟',en:'Can you send your personal number so we talk outside the app?'}],['s',{ar:'الأفضل نكمل هنا عشان المتابعة تفضل متسجلة',en:"Better to keep it here so everything stays on record"}]]]};
const CHATS=Array.from({length:14},(_,i)=>{const type=i%2?'n':'t', tpl=CHAT_T[type][Math.floor(i/2)%CHAT_T[type].length], t=TRAINEES[(i*3+1)%TRAINEES.length];
 const staff=type==='t'?t.coach:t.nut, h=rint(1,60);
 const policy=tpl[0][1].en.includes('personal number'), late=tpl[tpl.length-1][0]==='m'&&!policy&&h>24;
 return {id:'CH-'+(700+i*11),type,m:t.id,s:staff,h,unread:tpl[tpl.length-1][0]==='m'?rint(1,3):0,flag:policy?'policy':late?'late':'',reviewed:false,msgs:tpl.map(([from,text],j)=>({from,text,h:h+(tpl.length-1-j)*2}))};});
