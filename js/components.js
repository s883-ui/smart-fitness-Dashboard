/* =====================================================================
   components.js — القطع اللي بتتكرر (Reusable components)
   ---------------------------------------------------------------------
   كل function هنا بترجّع "نص HTML". بدل ما نكتب كارت الأرقام 30 مرة،
   بنكتبه مرة واحدة هنا وننادي kpi({...}) في أي صفحة.
   علامة ` ` (backtick) بتخلينا نكتب HTML ونحط جواه قيم بـ ${...}
   ===================================================================== */

// كارت رقم: label = العنوان، val = الرقم، trend = نسبة التغيير، hero = لو عايزه الكارت الأخضر
function kpi(o){return `<div class="card kpi ${o.hero?'hero':''}">
  <div class="kpi-top"><span>${o.label}</span><span class="kpi-ico">${ic(o.icon)}</span></div>
  <div class="kpi-val">${o.val}${o.unit?`<small>${o.unit}</small>`:''}</div>
  <div class="kpi-foot">${o.trend?`<span class="trend ${o.down?'down':''}">${ic(o.down?'trending_down':'trending_up')}${o.trend}</span> `:''}${o.foot||''}</div></div>`}
// المسار الصغير فوق العنوان: الرئيسية > المتدربين
function crumbs(parts){return `<div class="crumbs">${parts.map((p,i)=>i?`${ic('chevron_right','flip')}${p}`:p).join('')}</div>`}
// رأس الصفحة: المسار + العنوان + الوصف + الزراير
function head(cr,title,lead,actions){return `${crumbs(cr)}<div class="page-head"><div><h1>${title}</h1><p class="lead">${lead}</p></div><div class="actions">${actions||''}</div></div>`}
// زرار. on = الكود اللي يشتغل لما يتداس (لو فاضي الزرار مش بيعمل حاجة، زي الـ example)
const btn=(icon,label,cls='',on='')=>`<button class="btn ${cls}" ${on?`onclick="${on}"`:''}>${icon?ic(icon):''}${label}</button>`;
// شريط توصية الـ AI. لو المستخدم داس "تجاهل" بنسجل ده في S.hidden فميرجعش يظهر
function aiBanner(key,title,text,cta){ if(S.hidden[key]) return '';
 return `<div class="ai mb"><div class="ai-ico">${ic('neurology')}</div><div class="ai-body">
  <div class="ai-title">${title}<span class="chip ok">FitPulse AI</span></div><p>${text}</p>
  <div class="actions">${btn('auto_fix_high',cta,'primary sm')}${btn('',L('تجاهل','Dismiss'),'ghost sm',`hideBanner('${key}')`)}</div></div></div>`}
// حالة Empty: رسالة + زرار لما مفيش نتايج
function emptyState(title,text,action){return `<div class="empty">${ic('search_off')}<b>${title}</b><p>${text}</p>${action||''}</div>`}
// شريط الالتزام الملون
function adhBar(v){const cls=v<50?'lo':v<75?'mid':'';return `<div class="adh ${cls}"><div class="bar"><i style="width:${v}%"></i></div><b>${v}%</b></div>`}
// صورة دايرية بأول حرفين + الاسم + سطر صغير تحته
function person(name,sub){return `<div class="person"><span class="avatar sm">${initials(name)}</span><div><b>${name}</b><span>${sub}</span></div></div>`}
// الـ tabs: list = [[المفتاح، الاسم، العدد], ...]، cur = المختار، fn = اسم الـ function اللي تتنادى
function tabs(list,cur,fn){return `<div class="tabs">${list.map(([k,label,n])=>`<button class="tab ${k===cur?'on':''}" onclick="${fn}('${k}')">${label}${n!=null?` <b>${n}</b>`:''}</button>`).join('')}</div>`}
// أرقام الصفحات تحت الجدول. per = عدد الصفوف في الصفحة
function pager(total,per,p,fn){const pages=Math.max(1,Math.ceil(total/per));let b='';for(let i=1;i<=pages;i++)b+=`<button class="${i===p?'on':''}" onclick="${fn}(${i})">${fmt(i)}</button>`;
 const from=total?(p-1)*per+1:0,to=Math.min(total,p*per);
 return `<div class="pager"><span>${L(`عرض ${fmt(from)} - ${fmt(to)} من ${fmt(total)}`,`Showing ${from}–${to} of ${total}`)}</span><div class="pages">
  <button ${p<=1?'disabled':''} onclick="${fn}(${p-1})" aria-label="prev">${ic('chevron_left','flip')}</button>${b}
  <button ${p>=pages?'disabled':''} onclick="${fn}(${p+1})" aria-label="next">${ic('chevron_right','flip')}</button></div></div>`}


// ===== Charts =====
// بنستخدم مكتبة Chart.js (متضافة في index.html). charts بتحفظ كل الـ charts المرسومة
// عشان نمسحها (killCharts) قبل ما نرسم صفحة جديدة، وإلا هتتراكم في الذاكرة.
let charts=[];
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function killCharts(){charts.forEach(c=>c.destroy());charts=[]}
// الإعدادات المشتركة لكل الـ charts: الألوان من CSS، وفي العربي المحور بيتقلب (reverse)
function baseOpts(){if(typeof Chart==='undefined')return {scales:{x:{},y:{}},plugins:{}};const t=css('--muted'),g=css('--border');Chart.defaults.font.family="'Readex Pro',system-ui,sans-serif";Chart.defaults.color=t;
 return {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{rtl:S.lang==='ar',backgroundColor:css('--surface2'),titleColor:css('--text'),bodyColor:css('--text'),borderColor:g,borderWidth:1,padding:10}},
  scales:{x:{reverse:S.lang==='ar',grid:{display:false},border:{color:g}},y:{position:S.lang==='ar'?'right':'left',grid:{color:g},border:{display:false}}}}}
// mk('id', إعدادات) بترسم chart جوه الـ <canvas> اللي ليه الـ id ده
function mk(id,cfg){const el=document.getElementById(id);if(!el||typeof Chart==='undefined')return;charts.push(new Chart(el,cfg))}
const PAL=()=>[css('--lime'),css('--lime40'),css('--muted'),css('--border')];
