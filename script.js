const $=s=>document.querySelector(s);
const R=8,C=12,rows="ABCDEFGH";
// الأفلام من قائمة "What's On" في VOX Cinemas مصر
const MOVIES=[
 {t:"Hadoota",r:"G",g:"أحمد حلمي · أمينة خليل",e:"🕵️",u:"hadoota-arabic",c:["#ff9f1c","#c1121f"]},
 {t:"Godzilla Minus Zero",r:"12+",g:"أكشن · ياباني",e:"🦖",u:"godzilla-minus-zero-japanese",c:["#2ec4b6","#0b2545"]},
 {t:"Wala Kan Ala El-Bal",r:"G",g:"كوميدي رومانسي",e:"🏺",u:"wala-kan-ala-el-bal-arabic",c:["#f4a261","#e76f51"]},
 {t:"The Cat In The Hat",r:"PG",g:"أنيميشن · عائلي",e:"🎩",u:"the-cat-in-the-hat",c:["#ef476f","#118ab2"]},
 {t:"Matloub 3a2eleyain",r:"12+",g:"كوميدي · كريم عبد العزيز",e:"🛒",u:"matloub-3a2eleyain-arabic",c:["#90be6d","#277da1"]},
 {t:"Clayface",r:"18+",g:"إثارة · خيال علمي",e:"🧟",u:"clayface",c:["#6d597a","#14080e"]},
 {t:"Whalefall",r:"16+",g:"إثارة · مغامرة",e:"🐋",u:"whalefall",c:["#0096c7","#03045e"]},
 {t:"Naseeb",r:"12+",g:"دراما رومانسية",e:"🏖️",u:"naseeb-arabic",c:["#ffb703","#fb5607"]},
 {t:"Dune: Part Three",r:"18TC",g:"خيال علمي",e:"🏜️",u:"dune-part-three",c:["#e09f3e","#3d1c02"]},
 {t:"Avengers: Doomsday (Infinity Vision)",r:"18TC",g:"أبطال خارقين",e:"🦸",u:"avengers-doomsday-infinity-vision",c:["#7b2cbf","#10002b"]}
];
const CINS=["برج الفاتح – الخرطوم، السودان"];
const PO={"Hadoota":"P_HO00013755_1793793510180","Godzilla Minus Zero":"P_HO00013634_1789645703698","Wala Kan Ala El-Bal":"P_HO00013648_1792992542800","The Cat In The Hat":"P_HO00012362_1793613218305","Matloub 3a2eleyain":"P_HO00013664_1791446223943","Clayface":"P_HO00013587_1792992609492","Whalefall":"P_HO00013581_1787744273942","Naseeb":"P_HO00013764_1792133076768","Dune: Part Three":"P_HO00013132_1777639610268","Avengers: Doomsday (Infinity Vision)":"P_HO00013676_1790601922411"};
const pimg=m=>PO[m.t]?`<img class="pi" alt="" loading="lazy" referrerpolicy="no-referrer" src="https://assets.voxcinemas.com/posters/${PO[m.t]}.jpg" onerror="this.remove()">`:"";
const SHOWS=[{t:"4:00 م",h:"صالة 1",p:5000},{t:"7:00 م",h:"صالة 2",p:5000},{t:"9:30 م",h:"صالة VIP",p:8000},{t:"12:00 ص",h:"صالة 1",p:4000}];
const DAYS=[...Array(5)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return(i==0?"اليوم":i==1?"بكرة":d.toLocaleDateString("ar-EG",{weekday:"long"}))+" · "+d.toLocaleDateString("ar-EG",{day:"numeric",month:"short"})});
const S={step:0,m:null,cin:0,d:0,t:null,n:2,sel:new Set()};
const taken={};
const kEy=()=>S.m+"|"+S.cin+"|"+S.d+"|"+S.t;
function booked(){const k=kEy();if(!taken[k]){let s=1;for(const ch of k)s=(s*31+ch.charCodeAt(0))%100000;const set=new Set();for(let r=0;r<R;r++)for(let c=0;c<C;c++){s=(s*9301+49297)%233280;if(s/233280<.28)set.add(r+"-"+c)}taken[k]=set}return taken[k]}
const price=()=>SHOWS[S.t].p;
const seatName=(r,c)=>rows[r]+(c+1);

/* ---------- steps ---------- */
const NAMES=["الفيلم","اليوم والوقت","عدد الأشخاص","الكراسي","الدفع","التذكرة"];
function go(n){S.step=n;render()}
function render(){
  $("#prog").innerHTML=NAMES.map((n,i)=>`<span class="${i==S.step?"on":i<S.step?"done":""}">${n}</span>`).join("");
  const a=$("#app");
  if(S.step==0){
    a.innerHTML=`<h2>اختار الفيلم</h2><div class="movies">${MOVIES.map((m,i)=>`<button class="mv" onclick="S.m=${i};go(1)"><div class="po" style="background:linear-gradient(135deg,${m.c[0]},${m.c[1]})"><span>${m.e}</span>${pimg(m)}<b class="rt">${m.r}</b></div><div class="t"><b><bdi>${m.t}</bdi></b><small>${m.g}</small></div></button>`).join("")}</div>`;
  }else if(S.step==1){
    const m=MOVIES[S.m];
    a.innerHTML=`<h2>${m.e} <bdi>${m.t}</bdi> – اختار السينما واليوم والوقت</h2><p class="hint">${m.g} · <a href="https://egy.voxcinemas.com/movies/${m.u}" target="_blank" rel="noopener" style="color:var(--ac)">صفحة الفيلم في VOX ↗</a></p><div class="chips">${CINS.map((x,i)=>`<button class="chip ${i==S.cin?"on":""}" onclick="S.cin=${i};render()">${x}</button>`).join("")}</div>
    <div class="chips">${DAYS.map((d,i)=>`<button class="chip ${i==S.d?"on":""}" onclick="S.d=${i};render()">${d}</button>`).join("")}</div>
    <div class="shows">${SHOWS.map((s,i)=>{S.t=i;const free=R*C-booked().size;return`<button class="sh" onclick="S.t=${i};S.sel.clear();go(2)"><b>${s.t}</b>${s.h} · ${s.p} جنيه<br><small>متاح ${free} كرسي</small></button>`}).join("")}</div>
    <div class="row2"><button class="ghost" onclick="go(0)">رجوع</button></div>`;
    S.t=null;
  }else if(S.step==2){
    a.innerHTML=`<div class="card center"><h2>كم شخص جاييين؟</h2>
    <div class="cnt"><button onclick="cn(-1)" aria-label="أقل">−</button><output id="no">${S.n}</output><button onclick="cn(1)" aria-label="أكتر">+</button></div>
    <p class="hint" id="np"></p>
    <div class="row2" style="justify-content:center"><button class="ghost" onclick="go(1)">رجوع</button><button class="go" onclick="S.sel.clear();go(3)">اختار الكراسي</button></div></div>`;cn(0);
  }else if(S.step==3){
    a.innerHTML=`<h2>اختار ${S.n} ${S.n>2?"كراسي":"كرسي"} <small class="hint">· اضغط أي كرسي وادخل القاعة</small></h2>
    <div class="card"><div class="hallmap"><div class="screenbar"></div><div class="sl">الشاشة</div><div id="hall"></div></div>
    <div class="leg"><span><i style="background:#5b4a73"></i>متاح</span><span><i style="background:var(--ok)"></i>مختار</span><span><i style="background:var(--bk)"></i>محجوز</span></div>
    <div class="row2"><div>تم اختيار <b id="sc">0</b> من ${S.n} · <b id="sm">0</b> جنيه</div><div><button class="ghost" onclick="go(2)">رجوع</button> <button class="go" id="ok" disabled onclick="confirmB()">تأكيد الحجز</button></div></div></div>`;
    buildSeats();
  }else if(S.step==4){
    const sh=SHOWS[S.t],tot=S.n*sh.p;
    a.innerHTML=`<div class="card"><h2>الدفع</h2>
    <div class="bank"><div class="bk-h"><span class="bk-ic">🏦</span><div><b>بنكك – Bankak</b><small>بنك الخرطوم</small></div></div>
    <ol><li>افتح تطبيق <b>بنكك</b> واختار "تحويل".</li><li>حوّل <b>${tot} جنيه</b> للحساب: <b class="acc">0000000</b> (حساب تجريبي)</li><li>اكتب رقم العملية اللي ظهر ليك في الخانة تحت.</li></ol></div>
    <label class="hint" for="ref">رقم العملية</label><input id="ref" inputmode="numeric" placeholder="مثال: 123456789" autocomplete="off">
    <p class="hint" id="pe" style="color:var(--ac);margin:0"></p>
    <div class="row2"><div>⏳ الكراسي محجوزة ليك <b id="hold">10:00</b></div><div><button class="ghost" onclick="stopHold();go(3)">رجوع</button> <button class="go" id="pb" onclick="payNow()">تأكيد الدفع</button></div></div>
    <p class="hint">ده تجريبي: ما بيتصل ببنكك الحقيقي.</p></div>`;startHold();
  }else{
    const m=MOVIES[S.m],sh=SHOWS[S.t],list=[...S.sel].map(k=>{const[r,c]=k.split("-");return seatName(+r,+c)}).join("، ");
    a.innerHTML=`<div class="stage"><div class="machine"><div class="mbody"><div class="mscr" id="ms">🖨️ جاري طباعة التذكرة…</div><div class="slot"></div><div class="out"><div class="ticket prn"><div class="top" style="background:linear-gradient(135deg,${m.c[0]},${m.c[1]})">${m.e}</div><div class="body"><h2 class="center">${m.t}</h2>
    <p><span>اليوم</span><b>${DAYS[S.d]}</b></p><p><span>الوقت</span><b>${sh.t}</b></p><p><span>القاعة</span><b>${sh.h}</b></p><p><span>الكراسي</span><b>${list}</b></p><p><span>المكان</span><b>${CINS[S.cin]}</b></p><p><span>الدفع</span><b>بنكك ✓ #${S.ref}</b></p><p><span>الإجمالي</span><b>${S.n*sh.p} جنيه</b></p><div class="bar"></div></div></div></div></div></div><div class="pop" aria-hidden="true"><div class="bucket"></div>${[...Array(9)].map((_,i)=>`<i style="--x:${(i-4)*14}px;--d:${(i*.23).toFixed(2)}s;left:${14+i*9}%"></i>`).join("")}</div></div>
    <div class="row2" style="justify-content:center"><button class="go" onclick="S.sel.clear();S.m=null;go(0)">حجز جديد</button></div>`;setTimeout(()=>{const e=$("#ms");if(e)e.textContent="✅ تفضل تذكرتك! وفشارك جاهز 🍿"},3300);
  }
}
function cn(d){S.n=Math.min(8,Math.max(1,S.n+d));$("#no").textContent=S.n;$("#np").textContent="الإجمالي التقريبي: "+S.n*SHOWS[S.t].p+" جنيه"}
function buildSeats(){
  const h=$("#hall");h.innerHTML="";const bk=booked();
  for(let r=0;r<R;r++){
    const row=document.createElement("div");row.className="row";row.innerHTML=`<span class="rl">${rows[r]}</span>`;
    for(let c=0;c<C;c++){
      if(c==C/2){const g=document.createElement("span");g.className="gap";row.appendChild(g)}
      const b=document.createElement("button");const k=r+"-"+c;
      b.className="s"+(bk.has(k)?" bk":"")+(S.sel.has(k)?" sel":"");b.title=seatName(r,c);b.setAttribute("aria-label","كرسي "+seatName(r,c));
      b.onclick=()=>{if(!bk.has(k))openV(r,c)};row.appendChild(b);
    }
    h.appendChild(row);
  }
  sumUp();
}
function sumUp(){$("#sc")&&($("#sc").textContent=S.sel.size,$("#sm").textContent=S.sel.size*price(),$("#ok").disabled=S.sel.size!=S.n)}
function confirmB(){go(4)}
let holdT=null;
function stopHold(){clearInterval(holdT)}
function startHold(){stopHold();let s=600;holdT=setInterval(()=>{s--;const e=$("#hold");if(e)e.textContent=Math.floor(s/60)+":"+String(s%60).padStart(2,"0");if(s<=0){stopHold();S.sel.clear();go(3)}},1000)}
function payNow(){
  const v=$("#ref").value.trim();
  if(!/^\d{6,}$/.test(v)){$("#pe").textContent="اكتب رقم العملية (6 أرقام على الأقل).";return}
  $("#pe").textContent="";const b=$("#pb");b.disabled=true;b.textContent="جاري التحقق من العملية…";
  setTimeout(()=>{stopHold();const bk=booked();S.sel.forEach(k=>bk.add(k));S.ref=v;go(5)},1800);
}

/* ---------- 3D viewer ---------- */
const cv=$("#cv"),ctx=cv.getContext("2d"),W=cv.width,H=cv.height,F=W*.62;
const seatX=c=>(c-(C-1)/2)*.62+(c<C/2?-.25:.25),seatZ=r=>4+r*1.2,seatY=r=>.3*r;
const OV={x:0,y:13,z:15,p:-.95};
const cam={...OV};let V=null,anim=0;
function seatCam(r,c){const y=seatY(r)+1.15,z=seatZ(r);return{x:seatX(c),y,z,p:Math.min(.6,Math.atan((4.35-y)/z)*.8)}}
function c3(X,Y,Z){const dx=X-cam.x,dy=Y-cam.y,dz=Z-cam.z,s=Math.sin(cam.p),k=Math.cos(cam.p);return[dx,dy*k+dz*s,dy*s-dz*k]}
function poly(pts,fill){
  const cs=pts.map(p=>c3(...p)),o=[],N=.3;
  for(let i=0;i<cs.length;i++){const a=cs[i],b=cs[(i+1)%cs.length],ai=a[2]>=N,bi=b[2]>=N;
    if(ai)o.push(a);
    if(ai!==bi){const t=(N-a[2])/(b[2]-a[2]);o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,N])}}
  if(o.length<3)return;
  ctx.beginPath();o.forEach((q,i)=>{const x=W/2+F*q[0]/q[2],y=H/2-F*q[1]/q[2];i?ctx.lineTo(x,y):ctx.moveTo(x,y)});
  ctx.closePath();ctx.fillStyle=fill;ctx.fill();
}
function scr(X,Y,Z){const q=c3(X,Y,Z);return q[2]>.3?[W/2+F*q[0]/q[2],H/2-F*q[1]/q[2]]:null}
function draw(){
  const m=MOVIES[S.m],bk=booked(),HW=6.6,CE=8,ZB=14;
  ctx.fillStyle="#07050a";ctx.fillRect(0,0,W,H);
  poly([[-HW,0,0],[HW,0,0],[HW,0,3.4],[-HW,0,3.4]],"#150f1c");
  poly([[-HW,0,0],[HW,0,0],[HW,CE,0],[-HW,CE,0]],"#100b16");
  poly([[-HW,0,0],[-HW,CE,0],[-HW,CE,ZB],[-HW,0,ZB]],"#1b1424");
  poly([[HW,0,0],[HW,CE,0],[HW,CE,ZB],[HW,0,ZB]],"#1b1424");
  poly([[-HW,CE,0],[HW,CE,0],[HW,CE,ZB],[-HW,CE,ZB]],"#0d0a12");
  poly([[-HW,0,ZB],[HW,0,ZB],[HW,CE,ZB],[-HW,CE,ZB]],"#140e1b");
  const a=scr(-4.5,6.6,.02),b=scr(4.5,2.1,.02);
  if(a&&b){const g=ctx.createLinearGradient(a[0],a[1],b[0],b[1]);g.addColorStop(0,m.c[0]);g.addColorStop(1,m.c[1]);
    ctx.shadowColor=m.c[1];ctx.shadowBlur=40;ctx.fillStyle=g;ctx.fillRect(a[0],a[1],b[0]-a[0],b[1]-a[1]);ctx.shadowBlur=0;
    ctx.fillStyle="rgba(255,255,255,.92)";ctx.textAlign="center";const w=b[0]-a[0];
    ctx.font="bold "+Math.max(8,w/Math.max(9,m.t.length*.6))+"px system-ui";ctx.fillText(m.t,(a[0]+b[0])/2,(a[1]+b[1])/2+w/30);
    ctx.font=Math.max(7,w/22)+"px system-ui";ctx.fillText(m.e,(a[0]+b[0])/2,(a[1]+b[1])/2-w/12)}
  for(let r=0;r<R;r++){
    const z=seatZ(r),y0=seatY(r);
    if(r)poly([[-HW,y0-.3,z-.6],[HW,y0-.3,z-.6],[HW,y0,z-.6],[-HW,y0,z-.6]],"#110c18");
    poly([[-HW,y0,z-.6],[HW,y0,z-.6],[HW,y0,z+.6],[-HW,y0,z+.6]],r%2?"#1d1527":"#22192d");
    for(let c=0;c<C;c++){
      const k=r+"-"+c,x=seatX(c),isB=bk.has(k),isL=V&&V.r==r&&V.c==c;
      let col=isB?"#2a2333":S.sel.has(k)?"#2fb87c":"#5b4a73";if(isL)col="#ff4d5e";
      poly([[x-.25,y0+.45,z-.25],[x+.25,y0+.45,z-.25],[x+.25,y0+.45,z+.2],[x-.25,y0+.45,z+.2]],isB?"#352c40":S.sel.has(k)?"#3ecf8e":"#7a63a0");
      poly([[x-.25,y0+.45,z+.2],[x+.25,y0+.45,z+.2],[x+.25,y0+1,z+.2],[x-.25,y0+1,z+.2]],col);
      if(isB){const q=c3(x,y0+1.18,z+.1);if(q[2]>.5){const sx=W/2+F*q[0]/q[2],sy=H/2-F*q[1]/q[2];ctx.fillStyle="#0c0910";ctx.beginPath();ctx.arc(sx,sy,F*.13/q[2],0,7);ctx.fill()}}
    }
  }
  if(a&&b){const q=scr(0,4.3,0);if(q){ctx.globalCompositeOperation="screen";const g=ctx.createRadialGradient(q[0],q[1],10,q[0],q[1],W*.7);g.addColorStop(0,m.c[1]+"55");g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation="source-over"}}
}
function tween(to,dur,done){
  const id=++anim,from={...cam},t0=performance.now();
  (function f(n){if(id!=anim)return;let k=Math.min(1,(n-t0)/dur);k=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
    for(const q of["x","y","z","p"])cam[q]=from[q]+(to[q]-from[q])*k;
    draw();k<1?requestAnimationFrame(f):done&&done()})(t0);
}
function info(){
  const{r,c}=V,sc=seatCam(r,c),off=Math.abs(sc.x),ang=Math.round(Math.atan(off/sc.z)*180/Math.PI),score=Math.abs(r-4.5)+off*.9;
  $("#vSeat").textContent="الكرسي "+seatName(r,c);
  $("#vDist").textContent="البعد "+sc.z.toFixed(1)+" م · زاوية "+ang+"°";
  const t=$("#vRate");t.textContent=score<2.2?"⭐ مكان ممتاز":score<4.2?"مكان كويس":r<3?"قريب شديد":"بعيد أو جانبي";t.className="tag"+(score<2.2?" best":"");
  $("#vTog").textContent=S.sel.has(r+"-"+c)?"✕ إلغاء الكرسي":"✓ اختار الكرسي";
}
function openV(r,c){V={r,c};Object.assign(cam,OV);$("#vw").hidden=false;$("#vMsg").textContent="";draw();info();tween(seatCam(r,c),2000)}
function mv(dr,dc){
  let r=V.r,c=V.c;const bk=booked();
  do{r+=dr;c+=dc}while(r>=0&&r<R&&c>=0&&c<C&&bk.has(r+"-"+c));
  if(r<0||r>=R||c<0||c>=C)return;
  V={r,c};info();tween(seatCam(r,c),800);
}
function tog(){
  const k=V.r+"-"+V.c;
  if(S.sel.has(k))S.sel.delete(k);
  else if(S.sel.size>=S.n){$("#vMsg").textContent="اخترت العدد كله ("+S.n+"). ألغِ كرسي عشان تغيّر.";return}
  else S.sel.add(k);
  $("#vMsg").textContent="";info();draw();
}
function closeV(){tween(OV,900,()=>{$("#vw").hidden=true;V=null;buildSeats()})}
document.addEventListener("keydown",e=>{if($("#vw").hidden)return;
  ({ArrowLeft:()=>mv(0,-1),ArrowRight:()=>mv(0,1),ArrowUp:()=>mv(-1,0),ArrowDown:()=>mv(1,0),Enter:tog,Escape:closeV})[e.key]?.()});
render();
