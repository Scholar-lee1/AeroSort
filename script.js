const streams=[
 {name:"Food",icon:"♧",weight:4.8,color:"#e9ad58"},
 {name:"Plastic",icon:"♙",weight:2.7,color:"#47c9ed"},
 {name:"Paper",icon:"▤",weight:4.2,color:"#9aaef7"},
 {name:"Aluminium",icon:"♜",weight:1.6,color:"#a9bacb"},
 {name:"Liquids",icon:"◈",weight:3.0,color:"#46b8c8"},
 {name:"Residual",icon:"▤",weight:1.7,color:"#93a4b8"}
];
const flights=[
 {date:"11 Oct 2026",flight:"NG 301",route:"LOS → ABV",total:84.2},
 {date:"10 Oct 2026",flight:"NG 205",route:"LOS → PHC",total:76.4},
 {date:"09 Oct 2026",flight:"NG 118",route:"ABV → PHC",total:91.3},
 {date:"08 Oct 2026",flight:"NG 402",route:"LOS → ABV",total:84.6}
];
const categories=[
 {name:"Food",value:79.0,color:"#e9ad58"},
 {name:"Plastic",value:42.4,color:"#47c9ed"},
 {name:"Paper",value:58.6,color:"#9aaef7"},
 {name:"Aluminium",value:24.5,color:"#a9bacb"},
 {name:"Liquids",value:93.7,color:"#46b8c8"},
 {name:"Residual",value:38.3,color:"#93a4b8"}
];
const routes=[{name:"LOS → ABV",value:84.4},{name:"LOS → PHC",value:76.4},{name:"ABV → PHC",value:91.3},{name:"LOS → KAN",value:69.8}];
let simStep=0;
const $=id=>document.getElementById(id);
function fmt(n){return n.toLocaleString("en-NG",{minimumFractionDigits:1,maximumFractionDigits:1})}
function renderStreams(){
 const total=streams.reduce((s,x)=>s+x.weight,0);
 $("crewTotal").textContent=fmt(total)+" kg";
 $("streams").innerHTML=streams.map(s=>`<article class="stream"><div class="stream-top"><span class="stream-name">${s.name}</span><span class="stream-symbol" style="color:${s.color}">${s.icon}</span></div><div class="stream-weight">${fmt(s.weight)} <small>kg</small></div><div class="stream-meta"><span>${(s.weight/total*100).toFixed(1)}% of total</span><span>Demo</span></div><div class="bar"><span style="width:${Math.max(7,s.weight/Math.max(...streams.map(x=>x.weight))*100)}%;background:${s.color}"></span></div><div class="stream-foot"><span class="tiny"></span> Module represented</div></article>`).join("");
 $("moduleGrid").innerHTML=streams.map(s=>`<div class="module"><span>${s.name}</span><span class="ok">● Ready</span></div>`).join("");
}
function renderTable(target){$(target).innerHTML=flights.map(f=>`<tr><td>${f.date}</td><td><strong>${f.flight}</strong></td><td>${f.route}</td><td>${fmt(f.total)} kg</td><td class="status">Demo record</td></tr>`).join("")}
function renderReport(){
 const total=flights.reduce((a,f)=>a+f.total,0);
 $("flightCount").textContent=flights.length;
 $("reportTotal").textContent=fmt(total)+" kg";
 $("averageFlight").textContent=fmt(total/flights.length)+" kg";
 const top=categories.reduce((a,b)=>a.value>b.value?a:b);
 $("topStream").textContent=top.name;
 const catTotal=categories.reduce((a,c)=>a+c.value,0);
 $("categoryBars").innerHTML=categories.map(c=>`<div class="bar-row"><span>${c.name}</span><div class="bar"><span style="width:${c.value/Math.max(...categories.map(x=>x.value))*100}%;background:${c.color}"></span></div><strong>${fmt(c.value)} kg</strong></div>`).join("")+`<div class="detail-row"><span>Category total (separate illustrative sample)</span><strong>${fmt(catTotal)} kg</strong></div>`;
 $("routeBars").innerHTML=routes.map(r=>`<div class="route-bar"><span>${r.name}</span><div class="bar"><span style="width:${r.value/Math.max(...routes.map(x=>x.value))*100}%"></span></div><strong>${fmt(r.value)}</strong></div>`).join("");
 renderTable("flightTable");renderTable("flightTable2");
}
function showToast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function showPage(page){
 ["crew","report","flights"].forEach(p=>$(p+"Page").classList.toggle("hidden",p!==page));
 document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 $("sidebar").classList.remove("open");
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav button").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
$("menuBtn").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("simulateBtn").addEventListener("click",()=>{
 simStep++;
 streams.forEach((s,i)=>s.weight=+(Math.min(14,s.weight+[.4,.25,.3,.15,.2,.2][i]).toFixed(1)));
 renderStreams();$("collectState").textContent="Simulation updated";showToast("Demo collection updated — no real sensor data used.");
});
$("resetBtn").addEventListener("click",()=>{[4.8,2.7,4.2,1.6,3.0,1.7].forEach((v,i)=>streams[i].weight=v);simStep=0;renderStreams();$("collectState").textContent="Demo ready";showToast("Demo values reset.")});
$("periodFilter").addEventListener("change",e=>{if(e.target.value==="recent"){const recent=flights.slice(0,2);const total=recent.reduce((s,f)=>s+f.total,0);$("flightCount").textContent=recent.length;$("reportTotal").textContent=fmt(total)+" kg";$("averageFlight").textContent=fmt(total/recent.length)+" kg";$("flightTable").innerHTML=recent.map(f=>`<tr><td>${f.date}</td><td><strong>${f.flight}</strong></td><td>${f.route}</td><td>${fmt(f.total)} kg</td><td class="status">Demo record</td></tr>`).join("");}else renderReport()});
function exportCSV(){const rows=[["Date","Flight","Route","Total waste (kg)","Status"],...flights.map(f=>[f.date,f.flight,f.route,f.total,"Simulated"])];const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\r\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="aerosort-demo-flight-records.csv";a.click();URL.revokeObjectURL(a.href);showToast("Demo report exported as CSV.")}
$("exportBtn").addEventListener("click",exportCSV);$("flightExportBtn").addEventListener("click",exportCSV);
renderStreams();renderReport();
