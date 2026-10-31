(function(){
var KEY='sales-tracker-v1';
var S={deals:[],goal:10,name:'',month:''};
function load(){try{var r=localStorage.getItem(KEY);if(r){var o=JSON.parse(r);if(o&&o.deals)S=Object.assign(S,o);}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function $(id){return document.getElementById(id);}
function pad(n){return n<10?'0'+n:''+n;}
function today(){var d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function fu(n){return n%1?n.toFixed(1):''+n;}
function fit(){var k=document.querySelector('.kpis');if(!k)return;var els=[].slice.call(k.querySelectorAll('.big,.sub,.lbl')),cols=[4,2,1],ci,mn,caps={big:44,lbl:14,sub:14};
function kind(el){return el.classList.contains('big')?'big':el.classList.contains('lbl')?'lbl':'sub';}
function run(){var best={big:Infinity,lbl:Infinity,sub:Infinity};
els.forEach(function(el){el.style.fontSize='10px';});
els.forEach(function(el){var cs=getComputedStyle(el),avail=el.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),r=document.createRange();r.selectNodeContents(el);var w=r.getBoundingClientRect().width;if(!w||avail<=0)return;var kd=kind(el);best[kd]=Math.min(best[kd],10*avail/w*0.97);});
els.forEach(function(el){var kd=kind(el);if(isFinite(best[kd]))el.style.fontSize=Math.max(7,Math.min(caps[kd],best[kd]))+'px';});
mn=Math.min(best.lbl,best.sub);if(!isFinite(mn))mn=99;}
for(ci=0;ci<cols.length;ci++){k.style.gridTemplateColumns='repeat('+cols[ci]+',minmax(0,1fr))';run();if(mn>=11||cols[ci]===1)break;}}
function fld(l,k,t,v){return '<label class="fl">'+l+'<input type="'+t+'" data-f="'+k+'" value="'+esc(v)+'"'+(t==='number'?' min="0" step="any" inputmode="decimal"':'')+'></label>';}
function sel(l,k,o,v){return '<label class="fl">'+l+'<select data-f="'+k+'">'+o.map(function(x){var a=Array.isArray(x)?x[0]:x,b=Array.isArray(x)?x[1]:x;return '<option value="'+a+'"'+(String(v)===a?' selected':'')+'>'+b+'</option>';}).join('')+'</select></label>';}
function sumHtml(d){var st=d.st||{},nd=STEPS.filter(function(x){return st[x];}).length;
return '<td class="noprint" style="width:34px"><button type="button" class="x" data-act="tg" aria-expanded="'+(!!OPEN[d.id])+'" aria-label="Show details"><span class="chev" aria-hidden="true">&#9650;</span></button></td><td>'+d.date.slice(5).replace('-','/')+'</td><td>'+esc(d.cust)+(d.veh?'<div class="dv">'+esc(d.veh)+'</div>':'')+'</td><td>'+esc(d.stock||'-')+'</td><td><span class="pill '+(d.car==='New'?'n':'u')+'">'+d.car+'</span></td><td>'+fu(d.v)+'</td><td>'+(d.amt?money(d.amt):'-')+'</td>';}
function detHtml(d){var st=d.st||{};
return '<tr class="xr noprint" data-id="'+d.id+'"><td colspan="7"><div class="xp"><div class="fgrid">'+fld('Customer','cust','text',d.cust)+fld('Stock #','stock','text',d.stock||'')+fld('Vehicle','veh','text',d.veh||'')+fld('Sale date','date','date',d.date)+fld('Commission ($)','amt','number',d.amt||'')+sel('Car','car',['New','Used'],d.car)+sel('Deal size','v',[['1','Full (1.0)'],['0.5','Half (0.5)']],String(d.v))+sel('Deal type','type',['Finance','Cash','Lease','Outside finance'],d.type||'Finance')+'</div><div class="xbar"><button type="button" class="dbtn del" data-act="del" style="height:40px;padding:0 18px;margin-right:8px">Delete</button><button type="button" class="btn" data-act="tg">Done</button></div></div></td></tr>';}
function refreshSum(d){var tr=document.querySelector('#rows tr.mr[data-id="'+d.id+'"]');if(tr)tr.innerHTML=sumHtml(d);}
function buildReport(){var m=S.month,y=+m.slice(0,4),mo=+m.slice(5,7),L=S.deals.filter(function(d){return d.date.indexOf(m)===0;}).sort(function(a,b){return a.date<b.date?-1:a.date>b.date?1:a.id-b.id;}),tu=0,nw=0,us=0;
L.forEach(function(d){tu+=d.v;if(d.car==='New')nw+=d.v;else us+=d.v;});
$('rmonth').textContent=FM[mo-1]+' '+y;
$('rrows').innerHTML=L.length?L.map(function(d,i){return '<tr><td>'+(i+1)+'</td><td>'+d.date.slice(5,7)+'/'+d.date.slice(8,10)+'/'+d.date.slice(0,4)+'</td><td>'+esc(d.cust)+'</td><td>'+esc(d.stock||'')+'</td><td>'+esc(d.veh||'')+'</td><td>'+d.car+'</td><td>'+(d.v===1?'Full (1.0)':'Half (0.5)')+'</td><td class="r">'+d.v.toFixed(1)+'</td></tr>';}).join(''):'<tr><td colspan="8" class="rempty">No deals logged this month.</td></tr>';
$('rtot').textContent=tu.toFixed(1);$('rcnt').textContent=L.length;$('rnew').textContent=fu(nw);$('rused').textContent=fu(us);
$('rdate').textContent='Printed '+new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});}
function money(n){return '$'+Math.round(n).toLocaleString('en-US');}
function passes(d){var q=$('q').value.trim().toLowerCase(),t=$('ft').value,z=$('fd').value;
if(q&&(d.cust+' '+(d.stock||'')+' '+(d.veh||'')).toLowerCase().indexOf(q)<0)return false;
if(t&&d.car!==t)return false;if(z&&String(d.v)!==z)return false;return true;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var STEPS=['Delivered','Paperwork','Service','Registered','Inspected','Fueled'],VEH=['2025 Toyota Camry','2024 Honda CR-V','2025 Ford F-150','2023 Chevrolet Equinox','2025 Hyundai Tucson','2024 Nissan Rogue','2025 Kia Sportage','2024 Subaru Outback'],TY=['Finance','Cash','Lease'],OPEN={},KEEP=false;
function stSample(n){var o={};STEPS.forEach(function(x,i){if(i<n%7)o[x]=true;});return o;}
var NAMES=['James Carter','Maria Gonzalez','David Nguyen','Ashley Brooks','Michael Turner','Sofia Ramirez','Daniel Kim','Emily Johnson','Robert Hayes','Jessica Patel','Christopher Lee','Amanda Scott','Kevin Murphy','Laura Bennett','Brian Foster','Natalie Cruz','Tyler Morgan'];
var MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var FM=['January','February','March','April','May','June','July','August','September','October','November','December'];
function sum(list,car){var t=0;list.forEach(function(d){if(!car||d.car===car)t+=d.v;});return t;}
function render(){
var m=S.month,md=S.deals.filter(function(d){return d.date.indexOf(m)===0;});
var u=sum(md),nu=sum(md,'New'),uu=sum(md,'Used');
var py=+m.slice(0,4),pm=+m.slice(5,7),pd=new Date(py,pm-2,1),pk=pd.getFullYear()+'-'+pad(pd.getMonth()+1),ld=S.deals.filter(function(d){return d.date.indexOf(pk)===0;}),lu=sum(ld);
$('k-units').textContent=fu(u);
var ch0=lu>0?Math.round((u-lu)/lu*100):null;
var fc=md.filter(function(d){return d.v===1;}).length,hc=md.filter(function(d){return d.v===0.5;}).length;
$('k-deals').textContent=fc+' full \u00b7 '+hc+' half';
$('k-chg').innerHTML=ch0===null?'':'<b class="'+(ch0>=0?'n':'dn')+'">'+(ch0>=0?'&#9650; +':'&#9660; ')+ch0+'%</b> vs '+MN[pd.getMonth()];
$('k-new').textContent=fu(nu);$('k-used').textContent=fu(uu);
var am=0,an=0;md.forEach(function(d){if(d.amt){am+=d.amt;an++;}});
$('k-amt').textContent=money(am);$('k-amts').textContent=an?money(am/an)+' avg per deal':'Optional, per deal';
var g=S.goal>0?S.goal:10,p=Math.min(100,Math.round(u/g*100));
$('k-pct').textContent=Math.round(u/g*100)+'%';$('k-bar').style.width=p+'%';
$('k-goal').textContent=fu(u)+' of '+fu(g)+' units';
var now=new Date(),isCur=m===now.getFullYear()+'-'+pad(now.getMonth()+1),dim=new Date(py,pm,0).getDate(),pace='';
if(isCur&&u>0)pace='On pace for '+Math.round(u/now.getDate()*dim)+' units';
var st=0,q0=(u>=g||!isCur)?0:1,q;
for(q=q0;q<24;q++){var qd=new Date(py,pm-1-q,1),qk=qd.getFullYear()+'-'+pad(qd.getMonth()+1);if(sum(S.deals.filter(function(d){return d.date.indexOf(qk)===0;}))>=g)st++;else break;}
if(st>=2)pace+=(pace?' · ':'')+st+'-month goal streak';
$('k-pace').textContent=pace;
var y=+m.slice(0,4),mo=+m.slice(5,7);
$('ptitle').textContent='Sales report: '+FM[mo-1]+' '+y+(S.name?' - '+S.name:'');
// chart: last 6 months
var data=[],i,max=1;
for(i=5;i>=0;i--){var dt=new Date(y,mo-1-i,1),k=dt.getFullYear()+'-'+pad(dt.getMonth()+1);
var l=S.deals.filter(function(d){return d.date.indexOf(k)===0;});
var a=sum(l,'New'),b=sum(l,'Used');data.push({k:k,l:MN[dt.getMonth()],a:a,b:b});max=Math.max(max,a+b);}
var top=Math.max(4,Math.ceil(max/2)*2),W=600,H=230,L=34,B=28,T=18,ch=H-B-T,bw=52,gap=(W-L-6*bw)/6,s='<svg viewBox="0 0 600 230" width="100%" role="img" aria-label="Units sold, new and used">',st=S.chart||'bar';
var cx=function(j){return L+gap/2+j*(bw+gap)+bw/2;},cy=function(v){return T+ch-ch*v/top;},base=cy(0);
function tip(d){return d.l+': New '+fu(d.a)+' \u00b7 Used '+fu(d.b)+' \u00b7 Total '+fu(d.a+d.b);}
function smooth(pts){var p='M'+pts[0][0]+','+pts[0][1],k,t=0.2;
for(k=0;k<pts.length-1;k++){var p0=pts[k-1]||pts[k],p1=pts[k],p2=pts[k+1],p3=pts[k+2]||p2;
var c1y=Math.max(T,Math.min(base,p1[1]+(p2[1]-p0[1])*t)),c2y=Math.max(T,Math.min(base,p2[1]-(p3[1]-p1[1])*t));
p+=' C'+(p1[0]+(p2[0]-p0[0])*t)+','+c1y+' '+(p2[0]-(p3[0]-p1[0])*t)+','+c2y+' '+p2[0]+','+p2[1];}
return p;}
if(st==='donut'){var tot=nu+uu,R=74,C=2*Math.PI*R,X=170,Y=115,nl=tot?C*nu/tot:0,ul=tot?C*uu/tot:0;
s+='<circle cx="'+X+'" cy="'+Y+'" r="'+R+'" fill="none" stroke="var(--line)" stroke-width="26"/>';
if(tot){s+='<g transform="rotate(-90 '+X+' '+Y+')" fill="none" stroke-width="26"><circle cx="'+X+'" cy="'+Y+'" r="'+R+'" stroke="var(--new)" stroke-dasharray="'+nl+' '+(C-nl)+'"><title>New: '+fu(nu)+' units</title></circle><circle cx="'+X+'" cy="'+Y+'" r="'+R+'" stroke="var(--used)" stroke-dasharray="'+ul+' '+(C-ul)+'" stroke-dashoffset="'+(-nl)+'"><title>Used: '+fu(uu)+' units</title></circle></g>';}
s+='<text x="'+X+'" y="'+(Y+4)+'" text-anchor="middle" font-size="34" font-weight="700" fill="var(--text)">'+fu(tot)+'</text><text x="'+X+'" y="'+(Y+26)+'" text-anchor="middle" font-size="13" fill="var(--mut)">'+(tot?'units in '+MN[mo-1]:'No deals yet')+'</text>';
[['New',nu,'var(--new)',80],['Used',uu,'var(--used)',140]].forEach(function(r){s+='<circle cx="350" cy="'+r[3]+'" r="8" fill="'+r[2]+'"/><text x="368" y="'+(r[3]-2)+'" font-size="17" font-weight="700" fill="var(--text)">'+r[0]+'</text><text x="368" y="'+(r[3]+18)+'" font-size="14" fill="var(--mut)">'+fu(r[1])+' units \u00b7 '+(tot?Math.round(r[1]/tot*100):0)+'%</text>';});
}else{
for(i=0;i<=4;i++){var gv=top/4*i,gy=cy(gv);s+='<line x1="'+L+'" x2="'+W+'" y1="'+gy+'" y2="'+gy+'" stroke="var(--line)"/><text x="'+(L-8)+'" y="'+(gy+4)+'" text-anchor="end" font-size="11" fill="var(--mut)">'+fu(gv)+'</text>';}
if(st==='area'){s+='<defs><linearGradient id="gN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--new);stop-opacity:.6"/><stop offset="1" style="stop-color:var(--new);stop-opacity:.05"/></linearGradient><linearGradient id="gU" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--used);stop-opacity:.7"/><stop offset="1" style="stop-color:var(--used);stop-opacity:.08"/></linearGradient></defs>';
[['a','gN','var(--new)'],['b','gU','var(--used)']].forEach(function(sr){var pts=data.map(function(d,j){return [cx(j),cy(sr[0]==='a'?d.a+d.b:d.b)];}),ln=smooth(pts);
s+='<path d="'+ln+' L'+cx(5)+','+base+' L'+cx(0)+','+base+' Z" fill="url(#'+sr[1]+')"/><path d="'+ln+'" fill="none" stroke="'+sr[2]+'" stroke-width="3" stroke-linecap="round"/>';});
data.forEach(function(d,j){if(d.a+d.b)s+='<text x="'+cx(j)+'" y="'+(cy(d.a+d.b)-10)+'" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">'+fu(d.a+d.b)+'</text>';});}
if(st==='line'){[['b','var(--used)'],['a','var(--new)']].forEach(function(sr){s+='<path d="'+smooth(data.map(function(d,j){return [cx(j),cy(d[sr[0]])];}))+'" fill="none" stroke="'+sr[1]+'" stroke-width="3" stroke-linecap="round"/>';
data.forEach(function(d,j){s+='<circle cx="'+cx(j)+'" cy="'+cy(d[sr[0]])+'" r="5" fill="'+sr[1]+'" stroke="var(--card)" stroke-width="2"/>';if(d[sr[0]])s+='<text x="'+cx(j)+'" y="'+(cy(d[sr[0]])-11)+'" text-anchor="middle" font-size="11" font-weight="600" fill="'+sr[1]+'">'+fu(d[sr[0]])+'</text>';});});}
data.forEach(function(d,j){var x=cx(j)-bw/2,hb=ch*d.b/top,ha=ch*d.a/top,yb=base-hb,ya=yb-ha;
s+='<g><title>'+tip(d)+'</title><rect x="'+(x-8)+'" y="'+T+'" width="'+(bw+16)+'" height="'+ch+'" fill="transparent"/>';
if(st==='bar'){if(d.b)s+='<rect x="'+x+'" y="'+yb+'" width="'+bw+'" height="'+hb+'" rx="4" fill="var(--used)"/>';
if(d.a)s+='<rect x="'+x+'" y="'+ya+'" width="'+bw+'" height="'+ha+'" rx="4" fill="var(--new)"/>';
if(d.a+d.b)s+='<text x="'+cx(j)+'" y="'+(ya-6)+'" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">'+fu(d.a+d.b)+'</text>';}
s+='<text x="'+cx(j)+'" y="'+(H-8)+'" text-anchor="middle" font-size="12" fill="'+(d.k===m?'var(--text)':'var(--mut)')+'" font-weight="'+(d.k===m?600:400)+'">'+d.l+'</text></g>';});
}
$('chart').innerHTML=s+'</svg>';
var yt=0,bi=-1,bv=0,yi;for(yi=0;yi<12;yi++){var yk=y+'-'+pad(yi+1),vv=sum(S.deals.filter(function(d){return d.date.indexOf(yk)===0;}));yt+=vv;if(vv>bv){bv=vv;bi=yi;}}
$('yr').textContent=y+' total: '+fu(yt)+' units'+(bi>=0?' · Best month: '+FM[bi]+' ('+fu(bv)+')':'');
$('k-best').style.display=(u>0&&u>=bv)?'inline-block':'none';
// table
md.sort(function(a,b){return a.date<b.date?1:a.date>b.date?-1:b.id-a.id;});
var fl=md.filter(passes);
if(!KEEP)$('rows').innerHTML=fl.map(function(d){return '<tr class="mr'+(OPEN[d.id]?' open':'')+'" data-id="'+d.id+'">'+sumHtml(d)+'</tr>'+(OPEN[d.id]?detHtml(d):'');}).join('');
$('empty').style.display=md.length?'none':'block';$('nomatch').style.display=(md.length&&!fl.length)?'block':'none';
fit();
}
function init(){
load();var t=today();S.month=t.slice(0,7);
S.deals.forEach(function(d){if(!d.veh&&/^S\d{4}$/.test(d.stock||'')){var n=+d.stock.slice(1)-1000;d.veh=VEH[n%VEH.length];d.type=TY[n%3];d.plates=d.car==='New'?'New':'Transfer';d.st=stSample(n);}});
S.deals.forEach(function(d){var q=/^Sample customer (\d+)$/.exec(d.cust);if(q)d.cust=NAMES[(+q[1]-1)%NAMES.length];});save();
$('month').value=S.month;$('goal').value=S.goal;$('date').value=t;
$('month').addEventListener('change',function(){if(this.value){S.month=this.value;save();render();}});

$('goal').addEventListener('input',function(){var v=parseFloat(this.value);if(v>0){S.goal=v;save();render();}});
$('print').addEventListener('click',function(){buildReport();try{window.print();}catch(e){}});window.addEventListener('beforeprint',buildReport);
var editId=null;
window.addEventListener('resize',fit);
var realM=today().slice(0,7);setInterval(function(){var n=today().slice(0,7);if(n!==realM){realM=n;S.month=n;$('month').value=n;save();render();}},30000);try{new ResizeObserver(fit).observe(document.querySelector('.kpis'));}catch(e){}
try{document.fonts.ready.then(fit);}catch(e){}
document.querySelectorAll('input[name=cs]').forEach(function(r){r.checked=r.value===(S.chart||'bar');r.addEventListener('change',function(){S.chart=r.value;save();render();});});
['q','ft','fd'].forEach(function(id){$(id).addEventListener('input',render);$(id).addEventListener('change',render);});
function applyTheme(){if(S.theme)document.documentElement.setAttribute('data-theme',S.theme);}
applyTheme();
$('theme').addEventListener('click',function(){var cur=S.theme||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');S.theme=cur==='dark'?'light':'dark';applyTheme();save();});
function startEdit(id){var d=S.deals.filter(function(x){return x.id===id;})[0];if(!d)return;editId=id;
$('cust').value=d.cust;$('stock').value=d.stock||'';$('date').value=d.date;$('amt').value=d.amt||'';$('veh').value=d.veh||'';$('dtype').value=d.type||'Finance';
document.querySelector('input[name=car][value="'+d.car+'"]').checked=true;
document.querySelector('input[name=deal][value="'+(d.v===1?'1':'0.5')+'"]').checked=true;
$('ftitle').textContent='Edit deal';$('fsub').textContent='Save Changes';$('fcancel').style.display='block';
try{$('f').scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}$('cust').focus();}
function endEdit(){editId=null;$('ftitle').textContent='Log a deal';$('fsub').textContent='Log Deal';$('fcancel').style.display='none';
$('cust').value='';$('stock').value='';$('amt').value='';$('veh').value='';$('dtype').value='Finance';$('date').value=today();$('c1').checked=true;$('d1').checked=true;}
$('fcancel').addEventListener('click',endEdit);

$('f').addEventListener('submit',function(e){e.preventDefault();
var c=$('cust').value.trim();if(!c)return;
var dt=$('date').value||today();
var obj={id:Date.now(),date:dt,cust:c,stock:$('stock').value.trim(),veh:$('veh').value.trim(),type:$('dtype').value,amt:parseFloat($('amt').value)||0,car:document.querySelector('input[name=car]:checked').value,v:parseFloat(document.querySelector('input[name=deal]:checked').value)};
if(editId){S.deals.forEach(function(d){if(d.id===editId){obj.id=d.id;Object.assign(d,obj);}});}else{obj.st={};S.deals.push(obj);}
endEdit();
S.month=dt.slice(0,7);$('month').value=S.month;save();render();$('cust').value='';$('stock').value='';$('cust').focus();});
$('rows').addEventListener('click',function(e){if(e.target.closest('select'))return;var r=e.target.closest('tr');if(!r)return;var id=+r.getAttribute('data-id'),b=e.target.closest('[data-act]');
if(!b){if(r.classList.contains('mr')){OPEN[id]=!OPEN[id];render();}return;}
var act=b.getAttribute('data-act'),d=S.deals.filter(function(x){return x.id===id;})[0];
if(act==='tg'){OPEN[id]=!OPEN[id];render();return;}
if(act==='del'){if(b.getAttribute('data-c')!=='1'){b.setAttribute('data-c','1');b.textContent='Tap again to delete';setTimeout(function(){b.setAttribute('data-c','');b.textContent='Delete';},3000);return;}S.deals=S.deals.filter(function(x){return x.id!==id;});delete OPEN[id];save();render();return;}
if(act==='st'&&d){var k=b.getAttribute('data-s');d.st=d.st||{};d.st[k]=!d.st[k];b.classList.toggle('on',!!d.st[k]);b.setAttribute('aria-pressed',!!d.st[k]);b.innerHTML=(d.st[k]?'&#10003; ':'')+k;save();refreshSum(d);}});
$('rows').addEventListener('change',function(e){var f=e.target.getAttribute('data-f');if(!f)return;var r=e.target.closest('tr'),id=+r.getAttribute('data-id'),d=S.deals.filter(function(x){return x.id===id;})[0],v=e.target.value;if(!d)return;
if(f==='cust'){v=v.trim();if(!v){e.target.value=d.cust;return;}d.cust=v;}
else if(f==='stock'||f==='veh')d[f]=v.trim();
else if(f==='amt')d.amt=parseFloat(v)||0;
else if(f==='v')d.v=parseFloat(v);
else if(f==='date'){if(!v){e.target.value=d.date;return;}d.date=v;S.month=v.slice(0,7);$('month').value=S.month;save();render();return;}
else d[f]=v;
save();KEEP=true;render();KEEP=false;refreshSum(d);});
$('sample').addEventListener('click',seed);
window.addEventListener('storage',function(e){if(e.key!==KEY||!e.newValue)return;try{var o=JSON.parse(e.newValue);if(o&&o.deals){S.deals=o.deals;render();}}catch(err){}});
function seed(){var y=+S.month.slice(0,4),mo=+S.month.slice(5,7),n=1;
for(var m=2;m>=0;m--){var dt=new Date(y,mo-1-m,1),k=dt.getFullYear()+'-'+pad(dt.getMonth()+1),c=m===0?6:4+m;
for(var i=0;i<c;i++){S.deals.push({id:Date.now()+n,date:k+'-'+pad(2+i*3),cust:NAMES[(n-1)%NAMES.length],stock:'S'+(1000+n),car:(i+m)%3?'New':'Used',v:i%4===3?0.5:1,amt:(i%4===3?250:500)+((n*37)%5)*50,veh:VEH[n%VEH.length],type:TY[n%3],plates:(i+m)%3?'New':'Transfer',st:stSample(n)});n++;}}
save();render();}
render();
}
init();
})();
