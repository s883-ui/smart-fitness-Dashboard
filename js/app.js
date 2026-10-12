/* =====================================================================
   app.js — "المحرك": بيربط كل حاجة ببعض
   ---------------------------------------------------------------------
   - skeleton: شكل الـ Loading
   - renderSide / renderTop: بيرسموا القايمة الجانبية والشريط اللي فوق
   - render: بيرسم الصفحة الحالية
   - route: الـ Router، بيقرا اللي بعد # في اللينك ويفتح الصفحة المناسبة
   - toggleLang / toggleTheme: زرار اللغة وزرار المظهر
   - Handlers: الـ functions اللي الزراير والبحث بينادوها
   ===================================================================== */

function skeleton(){return `<div class="skel" style="height:16px;width:180px;margin-bottom:12px"></div><div class="skel" style="height:32px;width:min(420px,80%);margin-bottom:24px"></div>
 <div class="grid g4 mb">${'<div class="skel" style="height:128px;border-radius:18px"></div>'.repeat(4)}</div>
 <div class="grid g-main"><div class="skel" style="height:320px;border-radius:18px"></div><div class="skel" style="height:320px;border-radius:18px"></div></div>`}

// ===== القايمة الجانبية =====
// بنلف على NAV ونعمل لينك لكل صفحة. href="#id" هو اللي بيغيّر اللينك فوق،
// والصفحة المفتوحة (S.page) بتاخد class="active"
function renderSide(){
 document.getElementById('side').innerHTML=`<div class="brand"><div class="brand-mark">${ic('exercise')}</div><div><div class="brand-name" dir="ltr" style="text-align:start">Smart Fitness<br>&amp; Nutrition</div><div class="brand-sub">${L('منصة الصالات الرياضية','Gym management platform')}</div></div></div>
 <nav class="nav" aria-label="main">${NAV.map(n=>n.g?`<div class="nav-group">${T(n.g)}</div>`:`<a href="#${n.id}" class="${S.page===n.id?'active':''}" ${S.page===n.id?'aria-current="page"':''} onclick="toggleNav(false);go('${n.id}');return false;">${ic(n.ic)}<span>${T(n.t)}</span>${n.badge?`<span class="badge">${n.badge}</span>`:n.isNew?`<span class="new">${L('جديد','New')}</span>`:''}</a>`).join('')}</nav>
 <div class="side-foot"><div class="cap"><div class="cap-row"><span>${L('سعة الصالة الآن','Gym capacity now')}</span><b>78%</b></div><div class="bar"><i style="width:78%"></i></div></div>
 <div class="cap"><div class="cap-row" style="margin:0"><span>${L('مزامنة الأجهزة','Device sync')}</span><span class="small"><span class="dot"></span> ${L('متصل','Online')}</span></div></div>
 <div class="side-links"><button>${ic('help_outline')}${L('المساعدة','Help')}</button><button>${ic('logout')}${L('خروج','Log out')}</button></div></div>`;
}
// ===== الشريط اللي فوق: زرار ☰ للموبايل، البحث، اللغة، المظهر، الإشعارات، المستخدم =====
function renderTop(){
 const th=document.documentElement.getAttribute('data-theme');
 document.getElementById('top').innerHTML=`<button class="icon-btn menu-btn" onclick="toggleNav(true)" aria-label="${L('القائمة','Menu')}">${ic('menu')}</button>
 <label class="search">${ic('search')}<input placeholder="${L('ابحث عن متدرب أو خطة أو مدرب','Search trainees, plans or coaches')}"></label>
 <div class="top-actions"><button class="lang-btn" onclick="toggleLang()" aria-label="${L('تغيير اللغة','Change language')}">${ic('translate')}${S.lang==='ar'?'EN':'ع'}</button>
 <button class="icon-btn" onclick="toggleTheme()" aria-label="${L('تغيير المظهر','Toggle theme')}">${ic(th==='dark'?'light_mode':'dark_mode')}</button>
 <button class="icon-btn" aria-label="${L('الإشعارات','Notifications')}">${ic('notifications')}<span class="pip"></span></button>
 <div class="user"><span class="avatar">${initials(T(USER.name).replace(/^(كابتن|Coach) /,''))}</span><div class="user-txt"><div class="user-name">${T(USER.name)}</div><div class="user-role">${T(USER.role)}</div></div></div></div>`;
}
// ===== رسم الصفحة الحالية =====
// try/catch: لو حصل أي خطأ وإحنا بنرسم، بنعرض حالة Error بدل ما الصفحة تبقى بيضا
function render(keepScroll){
 killCharts(); const el=document.getElementById('content');
 try{ el.innerHTML=(P[S.page]||P.dashboard)(); if(S.page==='calories') calcResult(); }
 catch(err){ console.error(err); el.innerHTML=`<div class="card error">${ic('error')}<b>${L('حصلت مشكلة في تحميل الصفحة','This page failed to load')}</b><p>${L('اعمل تحديث للصفحة، ولو المشكلة استمرت كلم الدعم الفني.','Reload the page; if it keeps happening, contact support.')}</p>${btn('refresh',L('إعادة التحميل','Reload'),'primary sm','render()')}</div>`; }
 if(!keepScroll) window.scrollTo(0,0);
}
// go('dashboard') بتنقلك لصفحة من الكود
function go(id){
 // بنفتح الصفحة مباشرة من غير ما نعتمد على تغيير اللينك، عشان تشتغل في أي مكان (حتى جوه معاينة الملفات)
 try{ if(location.hash!=='#'+id) history.pushState(null,'','#'+id) }catch(e){}
 openPage(id);
}
// ===== الـ Router =====
// 1) يقرا الـ hash (مثلاً #trainees) ولو مش موجود يفتح dashboard
// 2) يعرض الـ skeleton (Loading)
// 3) بعد 450ms يرسم الصفحة الحقيقية
function route(){ openPage((location.hash||'#dashboard').slice(1)) }
function openPage(id){
 S.page=P[id]?id:'dashboard';
 renderSide(); closeModal(); killCharts();
 document.getElementById('content').innerHTML=skeleton(); window.scrollTo(0,0);
 clearTimeout(route.t); route.t=setTimeout(()=>render(),450);
}
// ===== اللغة =====
// applyLang بتغيّر lang و dir للصفحة كلها: rtl للعربي، ltr للإنجليزي
// toggleLang بتبدّل اللغة، تحفظها في المتصفح، وترسم كل حاجة من جديد
function applyLang(){document.documentElement.lang=S.lang;document.documentElement.dir=S.lang==='ar'?'rtl':'ltr';document.title='Smart Fitness & Nutrition'}
function toggleLang(){S.lang=S.lang==='ar'?'en':'ar';try{localStorage.setItem('sfn-lang',S.lang)}catch(e){};applyLang();renderSide();renderTop();render(true)}
// زرار المظهر: بيحط data-theme="dark" أو "light" والـ CSS بيغيّر الألوان لوحده
function toggleTheme(){const r=document.documentElement;const cur=r.getAttribute('data-theme')||'light';r.setAttribute('data-theme',cur==='light'?'dark':'light');try{localStorage.setItem('sfn-theme2',r.getAttribute('data-theme'))}catch(e){};renderTop();render(true)}
// فتح وقفل الـ sidebar على الموبايل
function toggleNav(open){document.body.classList.toggle('nav-open',open)}

// ===== Handlers =====
// كلهم نفس الفكرة: غيّر قيمة في S، وبعدين render(true)
// (true معناها متطلعش لأول الصفحة). refocus بترجّع المؤشر لخانة البحث بعد الرسم
function refocus(id){const i=document.getElementById(id);if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}
function setDashTab(k){S.dash.tab=k;S.dash.p=1;render(true)}
function setDashQ(v,clear){S.dash.q=v;S.dash.p=1;render(true);if(!clear)refocus('dashQ')}
function setDashPage(p){S.dash.p=p;render(true)}
function setTrStatus(k){S.tr.status=k;render(true)}
function setTrCoach(v){S.tr.coach=v;render(true)}
function setTrQ(v){S.tr.q=v;render(true);refocus('trQ')}
function setTrView(v){S.tr.view=v;render(true)}
function resetTr(){S.tr={status:'all',coach:'all',q:'',view:S.tr.view};render(true)}
function setProgCat(k){S.prog.cat=k;render(true)}
function setNutCat(k){S.nut.cat=k;render(true)}
function setCoachCat(k){S.coach.cat=k;render(true)}
function setSubTab(k){S.sub.tab=k;render(true)}
function setSubQ(v,clear){S.sub.q=v;render(true);if(!clear)refocus('subQ')}
function hideBanner(k){S.hidden[k]=1;render(true)}
function setCalc(k,v,rerender){S.calc[k]=v;if(rerender)render(true);else calcResult()}
// زرار Esc يقفل نافذة الوصفة أو القايمة
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();toggleNav(false)}});

// ===== Init: أول حاجة بتشتغل لما الصفحة تفتح =====
// ترجّع المظهر المحفوظ، تظبط اللغة، ترسم الشريط اللي فوق،
// تسمع لأي تغيير في اللينك (hashchange)، وتفتح أول صفحة
try{const t=localStorage.getItem('sfn-theme2');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}
applyLang(); renderTop(); window.addEventListener('hashchange',route); window.addEventListener('popstate',route); route();
