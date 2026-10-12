/* =====================================================================
   pages.js — الصفحات نفسها
   ---------------------------------------------------------------------
   P = object فيه كل الصفحات. كل صفحة function بترجّع الـ HTML بتاعها.
   الاسم بعد P. لازم يبقى نفس الـ id اللي في القايمة (NAV في data.js)
   مثلاً P.trainees هي اللي بتتعرض لما اللينك يبقى #trainees

   كل صفحة بتمشي بنفس الترتيب:
   1) تفلتر البيانات حسب الـ State (البحث، الـ tab المختار...)
   2) ترجّع: head(...) + كروت kpi + محتوى الصفحة
   3) الـ charts بترسمها جوه setTimeout، عشان لازم الـ <canvas> يكون اتحط في الصفحة الأول
   ===================================================================== */
const P={};
// ===================== 1) لوحة التحكم =====================
P.dashboard=()=>{
 const d=S.dash; const days=S.lang==='ar'?['السبت','الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة']:['Sat','Sun','Mon','Tue','Wed','Thu','Fri'];

 // فلترة الجدول حسب الـ tab المختار ثم حسب البحث
 let rows=TRAINEES.filter(t=>d.tab==='all'||(d.tab==='follow'&&t.status==='follow')||(d.tab==='upd'&&t.upd)||(d.tab==='exp'&&t.left>=0&&t.left<=10));
 if(d.q) rows=rows.filter(t=>(t.name.ar+t.name.en+t.id).toLowerCase().includes(d.q.toLowerCase()));

 // تقسيم الصفوف لصفحات: 5 في كل صفحة
 const per=5,total=rows.length; if((d.p-1)*per>=total) d.p=1; const pageRows=rows.slice((d.p-1)*per,d.p*per);
 const cnt=k=>TRAINEES.filter(t=>k==='follow'?t.status==='follow':k==='upd'?t.upd:t.left>=0&&t.left<=10).length;

 // رسم الـ charts بعد ما الصفحة تتحط
 setTimeout(()=>{
  const o=baseOpts();o.scales.x.stacked=true;o.scales.y.stacked=true;
  mk('weekChart',{type:'bar',data:{labels:days,datasets:[
   {label:L('تمارين القوة','Strength'),data:[52,61,58,70,74,66,48],backgroundColor:PAL()[0],borderRadius:6,maxBarThickness:34},
   {label:L('التغذية والماكروز','Nutrition'),data:[40,45,43,52,55,50,38],backgroundColor:PAL()[1],borderRadius:6,maxBarThickness:34},
   {label:L('الكارديو','Cardio'),data:[22,25,24,30,31,28,20],backgroundColor:PAL()[2],borderRadius:6,maxBarThickness:34}]},options:o});
  const g=baseOpts();delete g.scales;g.cutout='72%';
  mk('goalChart',{type:'doughnut',data:{labels:[L('خسارة دهون','Fat loss'),L('زيادة عضل','Muscle gain'),L('لياقة وتأهيل','Fitness & rehab'),L('تغذية علاجية','Therapeutic')],datasets:[{data:[48,32,14,6],backgroundColor:PAL(),borderWidth:0}]},options:g});
 });
 const goals=[[L('خسارة دهون وبناء عضل','Fat loss & muscle'),48],[L('زيادة الكتلة العضلية','Muscle gain'),32],[L('لياقة وتأهيل حركي','Fitness & rehab'),14],[L('تغذية علاجية','Therapeutic nutrition'),6]];
 return head([L('الرئيسية','Home'),L('لوحة التحكم','Dashboard')],L('نظرة عامة على الصالة','Gym overview'),L('متابعة المتدربين والالتزام بالخطط الغذائية والتدريب اليومي.','Track trainees, diet adherence and today\'s training activity.'),
   btn('download',L('تصدير التقرير','Export report'))+btn('add',L('إضافة مشترك','Add member'),'primary'))+
 `<div class="grid g4 mb">
  ${kpi({hero:1,label:L('المشتركين النشطين','Active members'),icon:'how_to_reg',val:fmt(1842),trend:'+12.4%',foot:L('هذا الشهر، 142 تسجيل جديد','this month, 142 new sign-ups')})}
  ${kpi({label:L('الالتزام بالخطط الغذائية','Diet plan adherence'),icon:'restaurant',val:'89.2%',trend:'+3.8%',foot:L('1,240 وجبة مسجلة اليوم','1,240 meals logged today')})}
  ${kpi({label:L('الجلسات المكتملة اليوم','Sessions completed today'),icon:'fitness_center',val:fmt(428),unit:L('/ 450','/ 450'),foot:L('95% من المستهدف','95% of today\'s target')})}
  ${kpi({label:L('تنبيهات المتابعة','Follow-up alerts'),icon:'warning',val:fmt(14),unit:L('حالة','cases'),down:1,trend:L('مراجعة خلال 24 ساعة','review within 24h')})}
 </div>
 ${aiBanner('dash',L('توصية اليوم','Today\'s recommendation'),L('استجابة المشتركين لخطط التنشيف منخفضة الكارب تحسنت <b>18%</b> في آخر 14 يوم. يُفضّل تطبيق التعديل التلقائي على <b>28 مشترك</b> لتجنب ثبات الوزن.','Response to low-carb cutting plans improved by <b>18%</b> over the last 14 days. Apply the automatic adjustment to <b>28 members</b> to avoid a weight plateau.'),L('مراجعة التوصيات (28)','Review suggestions (28)'))}
 <div class="grid g-main mb">
  <div class="card"><div class="card-head"><div><h2>${L('النشاط والالتزام الأسبوعي','Weekly activity & adherence')}</h2><div class="sub">${L('الجلسات المنجزة حسب نوع النشاط','Completed sessions by activity type')}</div></div></div>
   <div class="legend mb"><span><i style="background:var(--lime)"></i>${L('تمارين القوة','Strength')} 45%</span><span><i style="background:var(--lime40)"></i>${L('التغذية والماكروز','Nutrition')} 35%</span><span><i style="background:var(--muted)"></i>${L('الكارديو','Cardio')} 20%</span></div>
   <div class="chart-box"><canvas id="weekChart" aria-label="weekly chart"></canvas></div>
   <div class="note">${ic('verified')}${L('أعلى التزام كان يوم الأربعاء بنسبة 94.2%.','Wednesday had the highest adherence at 94.2%.')}</div></div>
  <div class="card"><div class="card-head"><div><h2>${L('توزيع الأهداف','Goals breakdown')}</h2><div class="sub">${L('تصنيف المشتركين حسب الهدف','Members by goal')}</div></div></div>
   <div class="chart-box sm"><canvas id="goalChart" aria-label="goals chart"></canvas></div>
   <div class="goal-list">${goals.map((g,i)=>`<div class="goal-row"><span class="dot" style="background:${['var(--lime)','var(--lime40)','var(--muted)','var(--border)'][i]}"></span>${g[0]}<b>${g[1]}%</b></div>`).join('')}</div>
   <div class="stat-pair"><div><b>${L('6.4 شهور','6.4 mo')}</b><span>${L('متوسط مدة الاشتراك','Avg. membership length')}</span></div><div><b>82%</b><span>${L('نسبة الاستبقاء','Retention')}</span></div></div></div>
 </div>
 <div class="card"><div class="card-head"><div><h2>${L('أحدث تفاعلات المتدربين','Latest trainee activity')}</h2><div class="sub">${L('الأكثر نشاطاً أو اللي محتاجين تدخل المدرب','Most active, or needing a coach to step in')}</div></div></div>
  <div class="toolbar">${tabs([['all',L('الكل','All'),TRAINEES.length],['follow',L('يحتاج متابعة','Needs follow-up'),cnt('follow')],['upd',L('برامج محدثة','Updated plans'),cnt('upd')],['exp',L('قريب الانتهاء','Expiring soon'),cnt('exp')]],d.tab,'setDashTab')}
   <label class="field">${ic('search')}<input id="dashQ" value="${esc(d.q)}" placeholder="${L('ابحث بالاسم أو الكود','Search name or ID')}" oninput="setDashQ(this.value)"></label></div>
  ${total?`<div class="table-wrap"><table><thead><tr><th>${L('المشترك','Member')}</th><th>${L('المدرب','Coach')}</th><th>${L('الخطة الغذائية','Diet plan')}</th><th>${L('الالتزام','Adherence')}</th><th>${L('الحالة','Status')}</th><th>${L('آخر نشاط','Last activity')}</th><th></th></tr></thead><tbody>
   ${pageRows.map(t=>`<tr><td>${person(T(t.name),`#${t.id} • ${T(t.goal)}`)}</td><td>${T(coachOf(t.coach).name)}</td><td class="small" dir="ltr" style="text-align:start">${t.plan}</td><td>${adhBar(t.adh)}</td><td>${chip(t.status)}</td><td class="small muted">${T(t.last)}</td><td><button class="btn sm ghost">${L('عرض الملف','View profile')}</button></td></tr>`).join('')}
   </tbody></table></div>${pager(total,per,d.p,'setDashPage')}`
   :emptyState(L('مفيش نتايج','No matching trainees'),L('جرّب اسم أو كود تاني، أو امسح البحث.','Try a different name or ID, or clear the search.'),btn('restart_alt',L('مسح البحث','Clear search'),'sm',"setDashQ('',true)"))}
 </div>`;
};

// ===================== 2) المتدربين =====================
// فيها فلتر بالحالة + فلتر بالمدرب + بحث + تبديل بين جدول وكروت (f.view)
P.trainees=()=>{
 const f=S.tr; let rows=TRAINEES.filter(t=>(f.status==='all'||t.status===f.status)&&(f.coach==='all'||t.coach===f.coach));
 if(f.q) rows=rows.filter(t=>(t.name.ar+t.name.en+t.id).toLowerCase().includes(f.q.toLowerCase()));
 const c=k=>TRAINEES.filter(t=>t.status===k).length;
 const body=!rows.length?emptyState(L('مفيش متدربين بالفلاتر دي','No trainees match these filters'),L('غيّر الحالة أو المدرب، أو ارجع للإعدادات الافتراضية.','Change the status or coach, or reset the filters.'),btn('restart_alt',L('إعادة الضبط','Reset filters'),'sm','resetTr()')):
  f.view==='table'?`<div class="table-wrap"><table><thead><tr><th>${L('المتدرب','Trainee')}</th><th>${L('الحالة','Status')}</th><th>${L('البرنامج والهدف','Plan & goal')}</th><th>${L('المدرب','Coach')}</th><th>${L('الالتزام','Adherence')}</th><th>${L('آخر نشاط','Last activity')}</th><th>${L('الباقة','Package')}</th><th></th></tr></thead><tbody>
   ${rows.map(t=>`<tr><td>${person(T(t.name),'#'+t.id)}</td><td>${chip(t.status)}</td><td><b class="small">${T(t.goal)}</b><div class="small muted" dir="ltr" style="text-align:start">${t.plan}</div></td><td class="small">${T(coachOf(t.coach).name)}</td><td>${adhBar(t.adh)}</td><td class="small muted">${T(t.last)}</td><td class="small"><b>${T(t.pkg)}</b><div class="${t.left<0?'':'muted'}" style="${t.left>=0&&t.left<=10?'color:var(--warn)':t.left<0?'color:var(--danger)':''}">${t.left<0?L(`منتهي منذ ${-t.left} يوم`,`Expired ${-t.left} days ago`):L(`متبقي ${t.left} يوم`,`${t.left} days left`)}</div></td><td style="white-space:nowrap"><button class="icon-btn" style="display:inline-grid;width:34px;height:34px" aria-label="view">${ic('visibility')}</button> <button class="icon-btn" style="display:inline-grid;width:34px;height:34px" aria-label="edit">${ic('edit_note')}</button></td></tr>`).join('')}
   </tbody></table></div>`:
  `<div class="grid g3">${rows.map(t=>`<div class="card pcard" style="background:var(--surface2)">${person(T(t.name),'#'+t.id)}<div class="pcard-top">${chip(t.status)}<span class="small muted">${T(t.pkg)}</span></div><div class="small">${T(t.goal)} • ${T(coachOf(t.coach).name)}</div>${adhBar(t.adh)}<div class="small muted">${T(t.last)}</div></div>`).join('')}</div>`;
 return head([L('الرئيسية','Home'),L('المتدربين','Trainees')],L('سجل المتدربين','Trainee records'),L('متابعة المؤشرات الصحية ونسب الالتزام وإدارة اشتراكات المتدربين.','Monitor health indicators, adherence and trainee memberships.'),
  btn('checklist',L('إجراءات جماعية','Bulk actions'),'ghost')+btn('download',L('تصدير البيانات','Export data'))+btn('person_add',L('إضافة متدرب','Add trainee'),'primary'))+
 `<div class="grid g4 mb">${kpi({hero:1,label:L('النشطين حالياً','Currently active'),icon:'groups',val:fmt(1842),trend:'+12.4%',foot:L('هذا الشهر','this month')})}
  ${kpi({label:L('عضويات تنتهي خلال 7 أيام','Memberships ending in 7 days'),icon:'event_repeat',val:fmt(28),foot:L('تحتاج تذكير واتساب','need a WhatsApp reminder')})}
  ${kpi({label:L('حالات تحتاج تدخل','Cases needing action'),icon:'assignment_late',val:fmt(14),down:1,trend:L('انخفاض التزام حاد','sharp adherence drop')})}
  ${kpi({label:L('متوسط الالتزام العام','Average adherence'),icon:'speed',val:'84.6%',trend:L('معدل ممتاز','excellent')})}</div>
 ${aiBanner('tr',L('تحليل سلوك المتدربين','Trainee behaviour insight'),L('التزام متدربي <b>باقة القوة المسائية</b> نزل 11% في الويك إند. يُقترح إرسال رسائل تشجيعية وتعديل مواعيد التذكير.','Adherence in the <b>evening strength group</b> dropped 11% over the weekend. Send encouragement messages and adjust reminder times.'),L('تطبيق الإجراء','Apply action'))}
 <div class="card"><div class="toolbar">
  ${tabs([['all',L('الكل','All'),TRAINEES.length],['active',L('نشط','Active'),c('active')],['follow',L('يحتاج متابعة','Follow-up'),c('follow')],['paused',L('متوقف','Paused'),c('paused')],['expired',L('منتهي','Expired'),c('expired')]],f.status,'setTrStatus')}
  <div class="actions"><label class="field">${ic('search')}<input id="trQ" value="${esc(f.q)}" placeholder="${L('ابحث عن متدرب','Search trainees')}" oninput="setTrQ(this.value)"></label>
  <label class="field">${ic('sports')}<select onchange="setTrCoach(this.value)"><option value="all">${L('كل المدربين','All coaches')}</option>${COACHES.map(c=>`<option value="${c.id}" ${f.coach===c.id?'selected':''}>${T(c.name)}</option>`).join('')}</select></label>
  <div class="seg" style="width:auto"><button class="${f.view==='table'?'on':''}" onclick="setTrView('table')" aria-label="table">${ic('table_rows')}</button><button class="${f.view==='grid'?'on':''}" onclick="setTrView('grid')" aria-label="grid">${ic('grid_view')}</button></div></div></div>
  ${body}</div>`;
};

// ===================== 3) البرامج التدريبية =====================
P.programs=()=>{
 const rows=PROGRAMS.filter(p=>S.prog.cat==='all'||p.cat===S.prog.cat);
 return head([L('الرئيسية','Home'),L('البرامج التدريبية','Training programs')],L('مكتبة البرامج التدريبية','Training program library'),L('تصميم وإدارة البرامج الرياضية وتخصيص الجداول للمتدربين.','Design, manage and assign training programs to trainees.'),
  btn('neurology',L('توليد خطة بالـ AI','Generate with AI'),'ghost')+btn('fitness_center',L('مكتبة التمارين (450+)','Exercise library (450+)'))+btn('add',L('برنامج جديد','New program'),'primary'))+
 `<div class="grid g4 mb">${kpi({hero:1,label:L('البرامج النشطة','Active programs'),icon:'inventory_2',val:fmt(64),trend:'+6',foot:L('هذا الشهر','this month')})}
  ${kpi({label:L('المتدربين المسجلين','Enrolled trainees'),icon:'groups',val:fmt(1720),foot:L('93.4% من النشطين','93.4% of active members')})}
  ${kpi({label:L('إتمام التمارين الأسبوعي','Weekly completion'),icon:'check_circle',val:'87.8%',trend:L('أداء ممتاز','excellent')})}
  ${kpi({label:L('برامج تحتاج مراجعة','Programs to review'),icon:'priority_high',val:fmt(5),down:1,trend:L('عدّت 90 يوم','over 90 days old')})}</div>
 ${aiBanner('prog',L('محلل الأحمال التدريبية','Training load analyzer'),L('مؤشر الإجهاد العضلي عالي عند <b>18 متدرب</b> في برنامج القوة. يُنصح بأسبوع استشفاء (Deload) فوري لتجنب الإصابات.','Muscle fatigue is high for <b>18 trainees</b> in the strength program. A deload week is recommended to prevent injuries.'),L('تطبيق أسبوع الاستشفاء','Apply deload week'))}
 <div class="toolbar">${tabs(PROG_CATS.map(([k,t])=>[k,T(t),k==='all'?PROGRAMS.length:PROGRAMS.filter(p=>p.cat===k).length]),S.prog.cat,'setProgCat')}</div>
 <div class="grid g3">${rows.map(p=>`<div class="card pcard"><div class="pcard-top"><span style="font-size:30px">${p.icon}</span><span class="chip">#${p.id}</span></div>
  <h3>${T(p.name)}</h3><p>${T(p.desc)}</p>
  <div class="meta"><span>${ic('calendar_month')}${L(`${p.days} أيام/أسبوع • ${p.weeks} أسبوع`,`${p.days} days/wk • ${p.weeks} weeks`)}</span><span>${ic('bolt')}${T(p.lvl)}</span></div>
  <div class="small muted">${ic('person')} ${T(coachOf(p.coach).name)}</div>
  <div class="mini-stats"><div><b>${fmt(p.members)}</b>${L('متدرب','trainees')}</div><div><b>${p.adh}%</b>${L('الالتزام','adherence')}</div></div>
  <div class="pcard-foot">${btn('person_add',L('تعيين لمتدرب','Assign'),'sm')}<button class="icon-btn" aria-label="edit">${ic('edit_note')}</button></div></div>`).join('')}</div>`;
};

// ===================== 4) الأنظمة الغذائية =====================
// شريط الماكروز: بنحوّل الجرامات لسعرات (بروتين وكارب ×4، دهون ×9) ونطلع النسبة
P.nutrition=()=>{
 const rows=DIETS.filter(p=>S.nut.cat==='all'||p.cat===S.nut.cat);
 return head([L('الرئيسية','Home'),L('التغذية','Nutrition'),L('الأنظمة الغذائية','Diet plans')],L('مكتبة الأنظمة الغذائية','Diet plan library'),L('إدارة الأنظمة الغذائية وضبط توزيع الماكروز والسعرات لكل متدرب.','Manage diet plans and fine-tune macros and calories for each trainee.'),
  btn('menu_book',L('قاعدة الأغذية (2,400+)','Food database (2,400+)'),'ghost')+btn('auto_awesome',L('خطة ماكروز بالـ AI','AI macro plan'))+btn('add',L('نظام غذائي جديد','New diet plan'),'primary'))+
 `<div class="grid g4 mb">${kpi({hero:1,label:L('الأنظمة النشطة','Active diet plans'),icon:'restaurant_menu',val:fmt(48),trend:'+4',foot:L('هذا الشهر','this month')})}
  ${kpi({label:L('الملتزمين بالحميات','Trainees on diets'),icon:'verified',val:fmt(1590),trend:'86.3%',foot:L('نسبة الالتزام','adherence')})}
  ${kpi({label:L('متوسط العجز اليومي','Avg. daily deficit'),icon:'local_fire_department',val:'-420',unit:'kcal',foot:L('ضمن النطاق الآمن','within the safe range')})}
  ${kpi({label:L('تنبيهات حساسية','Allergy alerts'),icon:'warning',val:fmt(8),down:1,trend:L('جلوتين / لاكتوز','gluten / lactose')})}</div>
 ${aiBanner('nut',L('تنبيه ثبات الوزن','Weight plateau alert'),L('<b>23 متدرب</b> على تدوير الكارب وزنهم ثابت أكتر من أسبوعين. يُقترح يوم Refeed أو تعديل الماكروز 5%.','<b>23 trainees</b> on carb cycling have plateaued for over two weeks. Schedule a refeed day or adjust macros by 5%.'),L('مراجعة المقترحات (23)','Review suggestions (23)'))}
 <div class="toolbar">${tabs(DIET_CATS.map(([k,t])=>[k,T(t),k==='all'?DIETS.length:DIETS.filter(p=>p.cat===k).length]),S.nut.cat,'setNutCat')}</div>
 ${rows.length?`<div class="grid g3">${rows.map(p=>{const tot=p.p*4+p.c*4+p.f*9;const pp=Math.round(p.p*400/tot),pc=Math.round(p.c*400/tot),pf=100-pp-pc;return `<div class="card pcard"><div class="pcard-top"><span class="chip ok">#${p.id}</span><span class="small muted">${T(p.meals)}</span></div>
  <h3>${T(p.name)}</h3><div><span class="kpi-val" style="font-size:26px">${p.kcal}</span> <span class="muted small">${L('سعرة / يوم','kcal / day')}</span></div>
  <div class="macro-bar"><i style="width:${pp}%;background:var(--lime)"></i><i style="width:${pc}%;background:var(--lime40)"></i><i style="width:${pf}%;background:var(--muted)"></i></div>
  <div class="legend"><span><i style="background:var(--lime)"></i>${L('بروتين','Protein')} ${p.p}${L('جم','g')}</span><span><i style="background:var(--lime40)"></i>${L('كارب','Carbs')} ${p.c}${L('جم','g')}</span><span><i style="background:var(--muted)"></i>${L('دهون','Fat')} ${p.f}${L('جم','g')}</span></div>
  <div class="small muted">${ic('verified_user')} ${T(coachOf(p.by).name)}</div>
  <div class="pcard-foot"><span class="small">${fmt(p.members)} ${L('مشترك','members')} • <b style="color:var(--accent-text)">${p.adh}%</b></span>${btn('person_add',L('تعيين','Assign'),'sm')}</div></div>`}).join('')}</div>`
  :`<div class="card">${emptyState(L('مفيش أنظمة في التصنيف ده','No diet plans in this category'),L('اختار تصنيف تاني أو اعمل نظام جديد.','Pick another category or create a new plan.'),btn('add',L('نظام غذائي جديد','New diet plan'),'primary sm'))}</div>`}`;
};


// ===================== 5) حاسبة السعرات (جديدة) =====================
// الصفحة فيها الفورم بس، والنتيجة بتترسم في calcResult() تحت
// عشان لما المستخدم يكتب رقم نحدّث النتيجة من غير ما نرسم الفورم من جديد (فالكتابة متقطعش)
P.calories=()=>{
 const c=S.calc;
 return head([L('الرئيسية','Home'),L('التغذية','Nutrition'),L('حاسبة السعرات','Calorie calculator')],L('حاسبة السعرات والماكروز','Calorie & macro calculator'),L('احسب احتياج المتدرب اليومي من السعرات وتوزيع البروتين والكارب والدهون حسب هدفه.','Work out a trainee\'s daily calories and protein, carb and fat split for their goal.'),'')+
 `<div class="grid g2">
 <div class="card"><div class="card-head"><div><h2>${L('بيانات المتدرب','Trainee details')}</h2><div class="sub">${L('النتايج بتتحدث أول ما تغيّر أي رقم','Results update as you type')}</div></div></div>
  <div class="form-grid">
   <label class="full">${L('النوع','Sex')}<div class="seg"><button class="${c.sex==='m'?'on':''}" onclick="setCalc('sex','m',1)">${L('ذكر','Male')}</button><button class="${c.sex==='f'?'on':''}" onclick="setCalc('sex','f',1)">${L('أنثى','Female')}</button></div></label>
   <label>${L('السن (سنة)','Age (years)')}<input type="number" inputmode="numeric" min="14" max="90" value="${c.age}" oninput="setCalc('age',this.value)"></label>
   <label>${L('الوزن (كجم)','Weight (kg)')}<input type="number" inputmode="decimal" min="35" max="250" value="${c.weight}" oninput="setCalc('weight',this.value)"></label>
   <label>${L('الطول (سم)','Height (cm)')}<input type="number" inputmode="numeric" min="130" max="230" value="${c.height}" oninput="setCalc('height',this.value)"></label>
   <label>${L('مستوى النشاط','Activity level')}<select onchange="setCalc('act',this.value)">
    ${[['1.2',L('قليل الحركة','Sedentary')],['1.375',L('خفيف (1-3 أيام)','Light (1–3 days)')],['1.55',L('متوسط (3-5 أيام)','Moderate (3–5 days)')],['1.725',L('عالي (6-7 أيام)','High (6–7 days)')],['1.9',L('رياضي محترف','Athlete')]].map(([v,t])=>`<option value="${v}" ${c.act===v?'selected':''}>${t}</option>`).join('')}</select></label>
   <label class="full">${L('الهدف','Goal')}<div class="seg"><button class="${c.goal==='cut'?'on':''}" onclick="setCalc('goal','cut',1)">${L('تنشيف','Lose fat')}</button><button class="${c.goal==='keep'?'on':''}" onclick="setCalc('goal','keep',1)">${L('ثبات','Maintain')}</button><button class="${c.goal==='bulk'?'on':''}" onclick="setCalc('goal','bulk',1)">${L('تضخيم','Gain muscle')}</button></div></label>
  </div></div>
 <div class="card" id="calcOut"></div></div>`;
};
// الحساب بمعادلة Mifflin-St Jeor:
//   BMR (الحرق وانت مرتاح) = 10×الوزن + 6.25×الطول − 5×السن + 5 للراجل (أو −161 للست)
//   TDEE (الحرق الكلي) = BMR × معامل النشاط
//   الهدف: تنشيف −500، ثبات 0، تضخيم +300
//   البروتين 2 جم لكل كيلو، الدهون 25% من السعرات، والكارب هو الباقي
// ولو الأرقام غلط بنعرض حالة Error بدل النتيجة
function calcResult(){
 const c=S.calc,a=+c.age,w=+c.weight,h=+c.height,box=document.getElementById('calcOut'); if(!box) return;
 killCharts();
 if(!(a>=14&&a<=90&&w>=35&&w<=250&&h>=130&&h<=230)){box.innerHTML=`<div class="error">${ic('error')}<b>${L('الأرقام دي خارج النطاق','These values are out of range')}</b><p>${L('السن من 14 لـ 90، الوزن من 35 لـ 250 كجم، والطول من 130 لـ 230 سم.','Age 14–90, weight 35–250 kg, height 130–230 cm.')}</p></div>`;return}
 const bmr=10*w+6.25*h-5*a+(c.sex==='m'?5:-161), tdee=bmr*(+c.act), adj={cut:-500,keep:0,bulk:300}[c.goal], kcal=Math.round((tdee+adj)/10)*10;
 const p=Math.round(w*(c.goal==='keep'?1.6:2)), f=Math.round(kcal*0.25/9), cb=Math.max(0,Math.round((kcal-p*4-f*9)/4)), bmi=(w/((h/100)**2)).toFixed(1);
 box.innerHTML=`<div class="card-head"><div><h2>${L('الاحتياج اليومي','Daily target')}</h2><div class="sub">${L('معادلة Mifflin-St Jeor','Mifflin-St Jeor equation')}</div></div><span class="chip ok">BMI ${bmi}</span></div>
  <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap"><div style="flex:1;min-width:180px"><div class="big-num">${fmt(kcal)}</div><div class="muted">${L('سعرة في اليوم','kcal per day')}</div>
   <div class="mini-stats" style="margin-top:14px"><div><b>${fmt(Math.round(bmr))}</b>${L('معدل الحرق الأساسي','BMR')}</div><div><b>${fmt(Math.round(tdee))}</b>${L('الحرق الكلي','TDEE')}</div></div></div>
   <div class="chart-box sm" style="width:180px;height:180px"><canvas id="macroChart" aria-label="macros"></canvas></div></div>
  <div class="res-grid"><div><b style="color:var(--accent-text)">${p} ${L('جم','g')}</b><span>${L('بروتين','Protein')} • ${fmt(p*4)} kcal</span></div><div><b>${cb} ${L('جم','g')}</b><span>${L('كربوهيدرات','Carbs')} • ${fmt(cb*4)} kcal</span></div><div><b>${f} ${L('جم','g')}</b><span>${L('دهون','Fat')} • ${fmt(f*9)} kcal</span></div></div>
  <div class="note">${ic('info')}${L('الأرقام تقديرية للتخطيط، وأخصائي التغذية بيراجعها قبل اعتماد الخطة.','Estimates for planning; a nutritionist reviews them before the plan is approved.')}</div>
  <div class="actions" style="margin-top:14px">${btn('save',L('حفظ في ملف المتدرب','Save to trainee profile'),'primary sm')}${btn('restaurant',L('إنشاء نظام غذائي','Create diet plan'),'sm')}</div>`;
 const o=baseOpts();delete o.scales;o.cutout='68%';
 mk('macroChart',{type:'doughnut',data:{labels:[L('بروتين','Protein'),L('كارب','Carbs'),L('دهون','Fat')],datasets:[{data:[p*4,cb*4,f*9],backgroundColor:[css('--lime'),css('--lime40'),css('--muted')],borderWidth:0}]},options:o});
}

// ===================== 6) الوصفات الصحية (جديدة) =====================
P.recipes=()=>head([L('الرئيسية','Home'),L('التغذية','Nutrition'),L('وصفات صحية','Healthy recipes')],L('وصفات صحية جاهزة','Healthy ready recipes'),L('وجبات متوازنة بمكونات سهلة ومحسوبة السعرات، تقدر تضيفها لخطة أي متدرب.','Balanced, calorie-counted meals with simple ingredients, ready to add to any trainee\'s plan.'),btn('add',L('وصفة جديدة','New recipe'),'primary'))+
 `<div class="grid g3">${RECIPES.map(r=>`<article class="card rcard"><div class="r-hero">${r.img?`<img src="${r.img}" alt="${esc(T(r.name))}">`:`<span aria-hidden="true">${r.emoji}</span>`}<span class="chip">${T(r.type)}</span></div>
  <div class="r-body"><h3>${T(r.name)}</h3><p class="muted small" style="margin:0">${T(r.desc)}</p>
  <div class="macros4"><div><b>${r.kcal}</b>kcal</div><div><b>${r.p}${L('جم','g')}</b>${L('بروتين','Protein')}</div><div><b>${r.c}${L('جم','g')}</b>${L('كارب','Carbs')}</div><div><b>${r.f}${L('جم','g')}</b>${L('دهون','Fat')}</div></div>
  <div class="meta"><span>${ic('schedule')}${L(`${r.time} دقيقة`,`${r.time} min`)}</span><span>${ic('restaurant')}${L('حصة واحدة','1 serving')}</span></div>
  <div class="pcard-foot">${btn('menu_book',L('عرض الوصفة','View recipe'),'primary sm',`openRecipe('${r.id}')`)}${btn('playlist_add',L('إضافة لخطة','Add to plan'),'sm ghost')}</div></div></article>`).join('')}</div>`;
// فتح نافذة الوصفة (Modal): بنحط الـ HTML جوه modal-root، وclose بتفضّيه
function openRecipe(id){const r=RECIPES.find(x=>x.id===id);
 document.getElementById('modal-root').innerHTML=`<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(T(r.name))}">
  <div class="card-head"><div><span class="chip ok">${T(r.type)}</span><h2 style="margin-top:8px">${r.emoji} ${T(r.name)}</h2></div><button class="icon-btn" onclick="closeModal()" aria-label="close">${ic('close')}</button></div>
  ${r.img?`<img class="modal-img" src="${r.img}" alt="">`:''}<div class="macros4"><div><b>${r.kcal}</b>kcal</div><div><b>${r.p}${L('جم','g')}</b>${L('بروتين','Protein')}</div><div><b>${r.c}${L('جم','g')}</b>${L('كارب','Carbs')}</div><div><b>${r.f}${L('جم','g')}</b>${L('دهون','Fat')}</div></div>
  <h4>${L('المكونات','Ingredients')}</h4><ul>${T(r.ing).map(i=>`<li>${i}</li>`).join('')}</ul>
  <h4>${L('طريقة التحضير','Method')}</h4><ol>${T(r.steps).map(i=>`<li>${i}</li>`).join('')}</ol></div></div>`;
 document.querySelector('.modal .icon-btn').focus();}
function closeModal(){document.getElementById('modal-root').innerHTML=''}

// ===================== 7) المدربين =====================
P.coaches=()=>{
 const st={avail:['ok',L('متاح','Available')],full:['warn',L('مكتمل السعة','At capacity')],leave:['info',L('إجازة','On leave')]};
 const rows=COACHES.filter(c=>S.coach.cat==='all'||c.cat===S.coach.cat);
 return head([L('الرئيسية','Home'),L('المدربين والخبراء','Coaches & staff')],L('سجل المدربين والخبراء','Coaches & experts'),L('إدارة المدربين وأخصائيي التغذية والتأهيل، وتوزيع المتدربين عليهم.','Manage coaches, nutritionists and rehab specialists, and how trainees are assigned.'),
  btn('calendar_month',L('جدولة المناوبات','Schedule shifts'),'ghost')+btn('download',L('تصدير السجل','Export list'))+btn('person_add',L('إضافة مدرب','Add coach'),'primary'))+
 `<div class="grid g4 mb">${kpi({hero:1,label:L('إجمالي الكادر','Total staff'),icon:'badge',val:fmt(28),trend:'+3',foot:L('هذا الربع','this quarter')})}
  ${kpi({label:L('الطاقة الاستيعابية','Staff capacity'),icon:'group',val:'1,842',unit:'/ 2,200',foot:L('83.7% إشغال','83.7% utilised')})}
  ${kpi({label:L('متوسط التقييم','Average rating'),icon:'star',val:'4.92',unit:'/ 5',foot:L('من 1,410 تقييم','from 1,410 ratings')})}
  ${kpi({label:L('طلبات معلقة','Pending requests'),icon:'pending_actions',val:fmt(6),down:1,trend:L('تحتاج اعتماد','need approval')})}</div>
 ${aiBanner('coach',L('توزيع الأحمال على المدربين','Coach workload balance'),L('<b>3 مدربين</b> عدّوا 95% من سعتهم، وعند كادر التغذية مكان فاضي. يُقترح نقل <b>24 متدرب جديد</b> لتوازن الشغل.','<b>3 coaches</b> are above 95% capacity while the nutrition team has room. Move <b>24 new trainees</b> to balance the load.'),L('مراجعة التوزيع المقترح','Review proposed split'))}
 <div class="toolbar">${tabs([['all',L('الكل','All'),COACHES.length],['fit',L('لياقة وبناء أجسام','Fitness & bodybuilding'),2],['nut',L('أخصائيو تغذية','Nutritionists'),2],['rehab',L('علاج طبيعي','Physio'),1],['cal',L('كاليستنكس','Calisthenics'),1]],S.coach.cat,'setCoachCat')}</div>
 <div class="grid g3">${rows.map(c=>`<div class="card pcard"><div class="pcard-top"><span class="chip ${st[c.status][0]}">${st[c.status][1]}${c.status!=='leave'?` • ${c.cap}%`:''}</span><span class="small muted">#${c.id}</span></div>
  ${person(T(c.name),T(c.title))}<p>${T(c.bio)}</p>
  <div class="mini-stats"><div><b>${fmt(c.members)}</b>${L('متدرب','trainees')}</div><div><b>${L(`${c.years} سنة`,`${c.years} yrs`)}</b>${L('الخبرة','experience')}</div><div><b>${c.rating} ★</b>${L('التقييم','rating')}</div><div><b>${c.kpi}%</b>${L('التزام المتدربين','trainee adherence')}</div></div>
  <div class="tags" dir="ltr">${c.tags.map(t=>`<span class="chip">${t}</span>`).join('')}</div>
  <div class="pcard-foot">${btn('visibility',L('عرض الملف','View profile'),'sm')}<button class="icon-btn" aria-label="more">${ic('more_vert')}</button></div></div>`).join('')}</div>`;
};

// ===================== 8) الاشتراكات =====================
P.subscriptions=()=>{
 const tr=id=>TRAINEES.find(t=>t.id===id);
 let rows=SUBS.filter(s=>S.sub.tab==='all'||s.st===S.sub.tab);
 if(S.sub.q) rows=rows.filter(s=>{const t=tr(s.m);return (t.name.ar+t.name.en+t.id).toLowerCase().includes(S.sub.q.toLowerCase())});
 setTimeout(()=>{const o=baseOpts();delete o.scales;o.cutout='70%';mk('revChart',{type:'doughnut',data:{labels:[L('VIP والنخبة','VIP & elite'),L('السنوية','Annual'),L('ربع سنوية','Quarterly'),L('الشهرية','Monthly')],datasets:[{data:[42,31,18,9],backgroundColor:PAL(),borderWidth:0}]},options:o})});
 return head([L('الرئيسية','Home'),L('الاشتراكات والفواتير','Subscriptions & billing')],L('إدارة الاشتراكات والفواتير','Subscriptions & billing'),L('متابعة الاشتراكات النشطة والتجديدات وعمليات الدفع.','Track active memberships, renewals and payments.'),
  btn('receipt_long',L('سجل المعاملات','Transactions'),'ghost')+btn('download',L('تقرير مالي','Financial report'))+btn('add_circle',L('اشتراك جديد','New subscription'),'primary'))+
 `<div class="grid g4 mb">${kpi({hero:1,label:L('الإيراد الشهري (MRR)','Monthly revenue (MRR)'),icon:'payments',val:cur(485200),trend:'+14.8%',foot:L('عن الشهر اللي فات','vs last month')})}
  ${kpi({label:L('الاشتراكات النشطة','Active subscriptions'),icon:'card_membership',val:fmt(1842),foot:L('متوسط العمر 6.4 شهور','avg. lifetime 6.4 months')})}
  ${kpi({label:L('تستحق خلال 7 أيام','Due in 7 days'),icon:'event_repeat',val:fmt(138),foot:L('تحتاج تذكير','need a reminder')})}
  ${kpi({label:L('مدفوعات متعثرة','Failed payments'),icon:'credit_card_off',val:fmt(12),down:1,trend:cur(14800)})}</div>
 <div class="grid g-main"><div class="card"><div class="toolbar">${tabs([['all',L('الكل','All'),SUBS.length],['paid',L('مدفوع','Paid'),3],['due',L('تجديد قريب','Renewal due'),1],['failed',L('متعثر','Failed'),1],['expired',L('منتهي','Expired'),1]],S.sub.tab,'setSubTab')}
  <label class="field">${ic('search')}<input id="subQ" value="${esc(S.sub.q)}" placeholder="${L('ابحث عن مشترك','Search members')}" oninput="setSubQ(this.value)"></label></div>
  ${rows.length?`<div class="table-wrap"><table><thead><tr><th>${L('المشترك','Member')}</th><th>${L('الباقة','Package')}</th><th>${L('القيمة','Amount')}</th><th>${L('التجديد القادم','Next renewal')}</th><th>${L('وسيلة الدفع','Payment')}</th><th>${L('الحالة','Status')}</th></tr></thead><tbody>
   ${rows.map(s=>{const t=tr(s.m);return `<tr><td>${person(T(t.name),'#'+t.id)}</td><td class="small"><b>${T(s.pkg)}</b></td><td class="small"><b>${cur(s.price)}</b><div class="muted">${T(s.cycle)}</div></td><td class="small">${T(s.next)}</td><td class="small">${ic(s.payIc)} ${T(s.pay)}</td><td><span class="chip ${SUB_ST[s.st][0]}">${T(SUB_ST[s.st][1])}</span></td></tr>`}).join('')}</tbody></table></div>`
  :emptyState(L('مفيش اشتراكات مطابقة','No matching subscriptions'),L('جرّب اسم تاني أو اختار "الكل".','Try another name or choose "All".'),btn('restart_alt',L('مسح البحث','Clear search'),'sm',"setSubQ('',true)"))}</div>
  <div class="card"><div class="card-head"><div><h2>${L('توزيع الإيرادات','Revenue split')}</h2><div class="sub">${L('حسب نوع الباقة','By package type')}</div></div></div>
   <div class="chart-box sm"><canvas id="revChart" aria-label="revenue"></canvas></div>
   <div class="goal-list">${[[L('VIP والنخبة','VIP & elite'),42,203784],[L('السنوية','Annual'),31,150412],[L('ربع سنوية','Quarterly'),18,87336],[L('الشهرية','Monthly'),9,43668]].map((g,i)=>`<div class="goal-row"><span class="dot" style="background:${['var(--lime)','var(--lime40)','var(--muted)','var(--border)'][i]}"></span>${g[0]}<b>${g[1]}%</b></div><div class="small muted" style="margin-top:-8px;padding-inline-start:18px">${cur(g[2])}</div>`).join('')}</div></div></div>`;
};

// ===================== 9) تحليلات الذكاء الاصطناعي =====================
// كارت InBody بيوضح حالة Error: S.sync بيبدأ 'error'، ولما تدوس إعادة المحاولة
// بيبقى 'loading' (skeleton) لمدة ثانية، وبعدين 'ok' (البيانات)
P.ai=()=>{
 const risk=[[TRAINEES[2],1.72,L('خطر تمزق عضلي','Muscle strain risk'),L('انخفاض HRV بنسبة 32%','HRV down 32%'),L('تقليل حجم التمرين 35% لمدة 5 أيام','Cut training volume 35% for 5 days')],
  [TRAINEES[7],1.48,L('إجهاد عصبي','CNS fatigue'),L('نوم عميق 3.8 ساعة فقط','Only 3.8 h deep sleep'),L('تحويل تمرين بكرة لكارديو Zone 2','Switch tomorrow to Zone 2 cardio')],
  [TRAINEES[6],1.65,L('حمل أوتار مفرط','Tendon overload'),L('زيادة الحمل الأسبوعي 48%','Weekly load +48%'),L('استبدال الجري بالسباحة 7 أيام','Swap running for swimming for 7 days')]];
 const stream=[['fitness_center',L('تعديل تلقائي لجدول التمارين','Workout auto-adjusted'),L('تم تقليل أوزان الديدلفت والسكوات 20% لكريم عادل.','Deadlift and squat loads cut 20% for Karim Adel.'),L('منذ 15 دقيقة','15 min ago'),'ok',L('تم التطبيق','Applied')],
  ['restaurant_menu',L('اقتراح يوم Refeed','Refeed day proposed'),L('زيادة 60 جم كارب لنور حسن بعد ثبات وزن 12 يوم.','Add 60 g carbs for Nour Hassan after a 12-day plateau.'),L('منذ 42 دقيقة','42 min ago'),'warn',L('بانتظار الأخصائي','Awaiting nutritionist')],
  ['outgoing_mail',L('رسالة تحفيزية','Motivation message'),L('اتبعتت لـ 12 متدرب ماسجلوش حضور من 4 أيام.','Sent to 12 trainees with no check-in for 4 days.'),L('منذ ساعتين','2 h ago'),'ok',L('اتبعتت','Sent')]];
 let sync='';
 if(S.sync==='loading') sync=`<div class="skel" style="height:22px;width:60%;margin-bottom:10px"></div><div class="skel" style="height:14px;width:90%;margin-bottom:8px"></div><div class="skel" style="height:14px;width:75%"></div>`;
 else if(S.sync==='error') sync=`<div class="error" style="padding:16px 8px">${ic('sync_problem')}<b>${L('فشل الاتصال بموازين InBody','Couldn\'t reach the InBody scales')}</b><p>${L('آخر قراءات من الأجهزة مش متاحة. اتأكد إن الأجهزة متصلة بالشبكة وحاول تاني.','Latest device readings are unavailable. Check the devices are online and try again.')}</p>${btn('refresh',L('إعادة المحاولة','Try again'),'primary sm','retrySync()')}</div>`;
 else sync=`<div class="mini-stats"><div><b>38</b>${L('حالة ثبات وزن','weight plateaus')}</div><div><b>88.4%</b>${L('دقة الالتزام بالماكروز','macro accuracy')}</div><div><b>92%</b>${L('نجاح تدوير الكارب','carb-cycling success')}</div><div><b>84%</b>${L('تغطية المغذيات','micronutrient coverage')}</div></div><div class="note">${ic('check_circle')}${L('تمت المزامنة دلوقتي','Synced just now')}</div>`;
 return head([L('الرئيسية','Home'),L('تحليلات الذكاء الاصطناعي','AI insights')],L('تحليلات الذكاء الاصطناعي','AI insights'),L('توقع مخاطر الإجهاد والإصابات، ومتابعة الاستبقاء، وتوصيات تلقائية للتمرين والتغذية. الـ AI بيقترح بس، والقرار للمتخصص.','Fatigue and injury risk, retention forecasts and automatic suggestions. AI only suggests; a professional makes the call.'),
  btn('ios_share',L('تصدير PDF','Export PDF'),'ghost')+btn('auto_mode',L('تشغيل التحليل الآن','Run analysis now'),'primary'))+
 `<div class="grid g4 mb">${kpi({hero:1,label:L('دقة النماذج','Model accuracy'),icon:'psychology',val:'96.4%',trend:'+2.1%',foot:L('على 42,850 جلسة','on 42,850 sessions')})}
  ${kpi({label:L('انقطاعات تم منعها','Cancellations prevented'),icon:'verified_user',val:fmt(84),foot:L('إيراد محمي ','revenue protected ')+cur(168000)})}
  ${kpi({label:L('مؤشر مخاطر الإصابة','Injury risk index'),icon:'ecg_heart',val:'1.2%',foot:L('18 متدرب في منطقة التحذير','18 trainees in the warning zone')})}
  ${kpi({label:L('خطط اتولدت','Plans generated'),icon:'model_training',val:fmt(412),foot:L('94% اتعتمدت من غير تعديل','94% approved without edits')})}</div>
 <div class="card mb"><div class="card-head"><div><h2>${L('حالات تحتاج مراجعة المتخصص','Cases needing professional review')}</h2><div class="sub">${L('مؤشر الحمل التدريبي ACWR فوق 1.3','Training load ratio (ACWR) above 1.3')}</div></div><span class="chip bad">${L('3 حالات','3 cases')}</span></div>
  <div class="table-wrap"><table><thead><tr><th>${L('المتدرب','Trainee')}</th><th>ACWR</th><th>${L('المؤشر المقلق','Warning sign')}</th><th>${L('توصية الـ AI','AI suggestion')}</th><th></th></tr></thead><tbody>
  ${risk.map(r=>`<tr><td>${person(T(r[0].name),'#'+r[0].id)}</td><td><b style="color:${r[1]>1.5?'var(--danger)':'var(--warn)'}">${r[1]}</b><div class="small muted">${r[2]}</div></td><td class="small">${r[3]}</td><td class="small muted">${r[4]}</td><td>${btn('',L('إرسال للمدرب','Send to coach'),'sm')}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="grid g2"><div class="card"><div class="card-head"><div><h2>${L('سجل إجراءات الـ AI','AI action log')}</h2><div class="sub">${L('آخر القرارات والاقتراحات','Latest decisions and suggestions')}</div></div></div>
  ${stream.map(s=>`<div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)"><span class="kpi-ico">${ic(s[0])}</span><div style="flex:1"><div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><b class="small">${s[1]}</b><span class="chip ${s[4]}">${s[5]}</span></div><div class="small muted">${s[2]}</div><div class="small muted">${s[3]}</div></div></div>`).join('')}</div>
  <div class="card"><div class="card-head"><div><h2>${L('الالتزام الغذائي والاستجابة الأيضية','Diet adherence & metabolism')}</h2><div class="sub">${L('بيانات موازين InBody','InBody scale data')}</div></div></div>${sync}</div></div>`;
};
// زرار إعادة المحاولة
function retrySync(){S.sync='loading';render(true);setTimeout(()=>{S.sync='ok';render(true)},1200)}

// ===================== 10) التقارير =====================
P.reports=()=>{
 setTimeout(()=>{const o=baseOpts();mk('revLine',{type:'line',data:{labels:S.lang==='ar'?['مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر']:['May','Jun','Jul','Aug','Sep','Oct'],datasets:[{label:L('الإيراد (ألف ج.م)','Revenue (k EGP)'),data:[198,215,228,241,264,285],borderColor:css('--lime'),backgroundColor:css('--lime-soft'),fill:true,tension:.35,pointRadius:4,pointBackgroundColor:css('--lime')}]},options:o})});
 const coh=[[L('مايو','May'),340,[100,93.5,89.2,86.1,84.0,82.3]],[L('يونيو','Jun'),385,[100,94.8,90.4,87.5,85.2]],[L('يوليو','Jul'),412,[100,95.1,91.8,88.6]],[L('أغسطس','Aug'),460,[100,96.0,93.2]]];
 const reps=[['picture_as_pdf',L('التقرير المالي الموحد Q3','Q3 consolidated financial report'),L('مالي','Finance'),'2026-09-30'],['table_view',L('مستحقات المدربين والعمولات','Coach payouts & commissions'),L('موارد بشرية','HR'),'2026-09-28'],['psychology',L('تقرير التنبؤ بالانقطاع','Churn prediction report'),L('ذكاء تشغيلي','Operations AI'),'2026-09-25']];
 return head([L('الرئيسية','Home'),L('التقارير','Reports')],L('التقارير والإحصائيات','Reports & statistics'),L('مؤشرات الربحية وكفاءة الكادر واستبقاء المتدربين.','Profitability, staff efficiency and trainee retention.'),
  btn('calendar_today',L('الربع الثالث 2026','Q3 2026'),'ghost')+btn('download',L('تصدير التقرير','Export report'),'primary'))+
 `<div class="grid g4 mb">${kpi({hero:1,label:L('صافي الإيراد المتكرر','Net recurring revenue'),icon:'payments',val:cur(485200),trend:'+14.8%',foot:L('عن الربع اللي فات','vs last quarter')})}
  ${kpi({label:'LTV / CAC',icon:'pie_chart',val:'5.8x',foot:L('نمو مستدام','sustainable growth')})}
  ${kpi({label:L('الاستبقاء الشهري','Monthly retention'),icon:'all_inclusive',val:'88.6%',trend:'+3.2%'})}
  ${kpi({label:L('كفاءة الكادر','Staff utilisation'),icon:'sports',val:'83.7%',foot:L('28 مدرب وأخصائي','28 coaches & specialists')})}</div>
 <div class="grid g-main mb"><div class="card"><div class="card-head"><div><h2>${L('اتجاه الإيرادات','Revenue trend')}</h2><div class="sub">${L('آخر 6 شهور، بالألف جنيه','Last 6 months, in thousands EGP')}</div></div></div><div class="chart-box"><canvas id="revLine" aria-label="revenue trend"></canvas></div></div>
 <div class="card"><div class="card-head"><div><h2>${L('أداء الأقسام','Department performance')}</h2></div></div>
  ${[['fitness_center',L('بناء الأجسام واللياقة','Bodybuilding & fitness'),95,4.95],['restaurant',L('التغذية الإكلينيكية','Clinical nutrition'),82,4.93],['healing',L('العلاج الطبيعي','Physiotherapy'),76,4.9]].map(d=>`<div style="padding:12px 0;border-bottom:1px solid var(--border)"><div class="goal-row">${ic(d[0])}${d[1]}<b>★ ${d[3]}</b></div><div class="adh" style="margin-top:8px"><div class="bar"><i style="width:${d[2]}%"></i></div><span class="small">${d[2]}%</span></div></div>`).join('')}</div></div>
 <div class="card mb"><div class="card-head"><div><h2>${L('استبقاء الدفعات','Cohort retention')}</h2><div class="sub">${L('نسبة اللي كملوا من كل دفعة شهرية','Share of each monthly cohort still active')}</div></div></div>
  <div class="table-wrap"><table><thead><tr><th>${L('الدفعة','Cohort')}</th><th>${L('العدد','Size')}</th>${[1,2,3,4,5,6].map(i=>`<th>${L('شهر','M')} ${i}</th>`).join('')}</tr></thead><tbody>
  ${coh.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td>${[0,1,2,3,4,5].map(i=>r[2][i]!=null?`<td><span class="chip" style="background:rgba(182,255,0,${((r[2][i]-75)/25*.55).toFixed(2)});color:var(--text)">${r[2][i]}%</span></td>`:'<td class="muted">—</td>').join('')}</tr>`).join('')}</tbody></table></div></div>
 <div class="card"><div class="card-head"><div><h2>${L('أحدث التقارير','Latest reports')}</h2></div></div>
  <div class="table-wrap"><table><thead><tr><th>${L('التقرير','Report')}</th><th>${L('الفئة','Category')}</th><th>${L('التاريخ','Date')}</th><th>${L('الحالة','Status')}</th><th></th></tr></thead><tbody>
  ${reps.map(r=>`<tr><td><div class="person"><span class="kpi-ico">${ic(r[0])}</span><b>${r[1]}</b></div></td><td class="small">${r[2]}</td><td class="small" dir="ltr" style="text-align:start">${r[3]}</td><td><span class="chip ok">${L('معتمد','Approved')}</span></td><td>${btn('download',L('تحميل','Download'),'sm')}</td></tr>`).join('')}</tbody></table></div></div>`;
};

// ===================== 11) الإعدادات (قيد التطوير زي الـ example) =====================
P.settings=()=>head([L('الرئيسية','Home'),L('الإعدادات','Settings')],L('الإعدادات','Settings'),L('إعدادات الصالة وصلاحيات الوصول والربط التقني.','Gym settings, access permissions and integrations.'),'')+
 `<div class="card wip">${ic('construction')}<h2 style="margin:12px 0 6px">${L('صفحة الإعدادات قيد التطوير','Settings are under development')}</h2><p class="muted" style="margin:0 0 16px">${L('تقدر تتصفح باقي الأقسام من القائمة الجانبية.','You can browse the other sections from the sidebar.')}</p>${btn('grid_view',L('الرجوع للوحة التحكم','Back to dashboard'),'primary',"go('dashboard')")}</div>`;
