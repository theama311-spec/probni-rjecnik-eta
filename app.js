const $=id=>document.getElementById(id);
const alphabet=[["Α","Α"],["Β","Β"],["Γ","Γ"],["Δ","Δ"],["Ε","Ε"],["Ζ","Ζ"],["Η","Η"],["Θ","Θ"],["Ι","Ι"],["Κ","Κ"],["Λ","Λ"],["Μ","Μ"],["Ν","Ν"],["Ξ","Ξ"],["Ο","Ο"],["Π","Π"],["Ρ","Ρ"],["Σ","Σ"],["Τ","Τ"],["Υ","Υ"],["Φ","Φ"],["Χ","Χ"],["Ψ","Ψ"],["Ω","Ω"]];
let original=[], entries=[], shown=[], currentIndex=-1, previousView="list", activeLetter="", fontSize=18;
const storageKey="probni-rjecnik-02-edits";
function normalize(s){return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("hr")}
function escapeHTML(s){return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function formatEntryText(text){
  // Format numbering markers for readability without changing the stored source text.
  const re=/(^|[\s;])(\d{1,2}\.|[a-z]\)|[α-ω]\)|[IVX]{1,4}\.)\s+/gu;
  const matches=[...text.matchAll(re)];
  if(!matches.length) return escapeHTML(text);
  const parts=[];
  const firstMarkerStart=matches[0].index+matches[0][1].length;
  const prefix=text.slice(0,firstMarkerStart).trim();
  if(prefix) parts.push(`<div class="entry-paragraph">${escapeHTML(prefix)}</div>`);
  matches.forEach((m,i)=>{
    const contentStart=m.index+m[0].length;
    const next=matches[i+1];
    const end=next?next.index+next[1].length:text.length;
    const content=text.slice(contentStart,end).trim();
    const label=m[2];
    const level=/^\d/.test(label)?1:(/^[α-ω]/u.test(label)?3:2);
    parts.push(`<div class="subentry level-${level}"><span class="subentry-marker">${escapeHTML(label)}</span><span class="subentry-content">${escapeHTML(content)}</span></div>`);
  });
  return parts.join("");
}
function letterOf(s){let c=(s||"").trim().replace(/^[^Α-ΩΆΈΉΊΌΎΏα-ωάέήίόύώ]+/u,"").charAt(0).toLocaleUpperCase("el");return c||""}
function saveLocal(){localStorage.setItem(storageKey,JSON.stringify(entries))}
function loadEntries(data){original=data;entries=JSON.parse(JSON.stringify(data));try{const edits=JSON.parse(localStorage.getItem(storageKey)||"{}");entries=entries.map(e=>edits[e.id]||e)}catch(e){}}
async function init(){try{const r=await fetch("data/entries.json");loadEntries(await r.json());renderAlphabet();renderList();route()}catch(e){$("count").textContent="Nije moguće učitati data/entries.json. Provjerite strukturu repozitorija."}}
function renderAlphabet(){$("alphabet").innerHTML="";for(const [label] of alphabet){const b=document.createElement("button");b.textContent=label;b.title="Prikaži natuknice na slovo "+label;b.onclick=()=>{activeLetter=label;$("search").value="";renderList();$("listView").scrollIntoView({behavior:"smooth"})};$("alphabet").appendChild(b)}const all=document.createElement("button");all.textContent="Sve";all.onclick=()=>{activeLetter="";$("search").value="";renderList()};$("alphabet").prepend(all)}
function renderList(){const q=normalize($("search").value);shown=entries.map((e,i)=>({...e,_i:i})).filter(e=>e.type==="section" ? (!q&&!activeLetter) : (!activeLetter||letterOf(e.headword)===activeLetter)&&(!q||normalize(e.headword+" "+e.text).includes(q)));$("count").textContent=`${shown.filter(e=>e.type!=="section").length.toLocaleString("hr")} zapisa`;const ol=$("entriesList");ol.innerHTML="";for(const e of shown){const li=document.createElement("li");if(e.type==="section"){li.className="section-row";li.textContent=e.headword}else{const a=document.createElement("a");a.href="#entry="+encodeURIComponent(e.id);a.className="entry-link";const strong=document.createElement("strong");strong.textContent=e.headword;const small=document.createElement("small");small.textContent=e.text.slice(0,140)+(e.text.length>140?"…":"");a.append(strong,small);li.appendChild(a)}ol.appendChild(li)}}
function openEntry(id){const i=entries.findIndex(e=>e.id===id);if(i<0)return;currentIndex=i;previousView="list";const e=entries[i];$("listView").hidden=true;$("entryView").hidden=false;$("entryMeta").textContent=`Zapis ${i+1} od ${entries.length} · izvorni odlomak ${e.source_paragraph||"—"}`;$("entryTitle").textContent=e.headword;$("entryText").innerHTML=formatEntryText(e.text);$("editor").hidden=true;$("entryText").hidden=false;$("editBtn").hidden=false;$("saveBtn").hidden=true;$("cancelBtn").hidden=true;$("backEntry").hidden=true;$("prevBtn").disabled=i===0;$("nextBtn").disabled=i===entries.length-1;location.hash="entry="+encodeURIComponent(e.id)}
function route(){const m=location.hash.match(/entry=([^&]+)/);if(m){openEntry(decodeURIComponent(m[1]))}else{$("entryView").hidden=true;$("listView").hidden=false}}
$("search").addEventListener("input",()=>{activeLetter="";renderList()});$("clearBtn").onclick=()=>{$("search").value="";activeLetter="";renderList();$("search").focus()};
$("backList").onclick=()=>{location.hash="";$("entryView").hidden=true;$("listView").hidden=false};$("backAlpha").onclick=()=>{$("entryView").hidden=true;$("listView").hidden=false;$("alphabet").scrollIntoView({behavior:"smooth"});location.hash=""};$("backEntry").onclick=()=>openEntry(entries[currentIndex].id);
$("prevBtn").onclick=()=>{if(currentIndex>0)openEntry(entries[currentIndex-1].id)};$("nextBtn").onclick=()=>{if(currentIndex<entries.length-1)openEntry(entries[currentIndex+1].id)};
$("editBtn").onclick=()=>{$("editor").value=entries[currentIndex].text;$("editor").hidden=false;$("entryText").hidden=true;$("saveBtn").hidden=false;$("cancelBtn").hidden=false;$("editBtn").hidden=true};
$("cancelBtn").onclick=()=>openEntry(entries[currentIndex].id);$("saveBtn").onclick=()=>{entries[currentIndex].text=$("editor").value;entries[currentIndex].headword=entries[currentIndex].headword;saveLocal();renderList();openEntry(entries[currentIndex].id)};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(entries,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="probni-rjecnik-02-entries.json";a.click();URL.revokeObjectURL(a.href)};
$("importFile").onchange=async ev=>{const f=ev.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!Array.isArray(d)||!d.every(x=>x.id&&x.text!==undefined))throw Error("Format");entries=d;saveLocal();renderAlphabet();renderList();alert("Uvoz je uspio.")}catch(e){alert("Uvoz nije uspio. Odaberite JSON izvezen iz ove aplikacije.")}ev.target.value=""};
$("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("probni-rjecnik-02-theme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("probni-rjecnik-02-theme")==="dark")document.body.classList.add("dark");
$("fontDown").onclick=()=>{fontSize=Math.max(14,fontSize-1);document.documentElement.style.fontSize=fontSize+"px"};$("fontReset").onclick=()=>{fontSize=18;document.documentElement.style.fontSize=""};$("fontUp").onclick=()=>{fontSize=Math.min(28,fontSize+1);document.documentElement.style.fontSize=fontSize+"px"};
window.addEventListener("hashchange",route);
init();