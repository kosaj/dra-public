(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const G="http://www.zus.pl/2026/KEDU_5_7";function M(e){var r;const t=new DOMParser().parseFromString(e,"application/xml"),a=t.getElementsByTagName("parsererror")[0];if(a)throw new Error(`Nieprawidłowy XML: ${((r=a.textContent)==null?void 0:r.trim())??"błąd parsowania"}`);return x(t),t}function x(e){const t=e.getElementsByTagNameNS(G,"ZUSDRA")[0];if(!t)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return t}function A(e,t){for(const a of Array.from(e.children))if(a.localName===t)return a;return null}function C(e,t,a){const r=x(e),n=A(r,t);if(!n)throw new Error(`Brak bloku ${t} w DRA`);const o=A(n,a);if(!o)throw new Error(`Brak pola ${t}/${a} w DRA`);return o}function j(e,t,a){const r=x(e),n=A(r,t);return n?A(n,a)!==null:!1}function h(e){const t=e.replace(/\s/g,"").replace(",","."),a=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(t);if(!a)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,r,n,o=""]=a,i=(o+"00").slice(0,2),s=Number(n)*100+Number(i);return r==="-"?-s:s}function w(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const t=e<0?"-":"",a=Math.abs(e),r=Math.floor(a/100),n=a%100;return`${t}${r}.${String(n).padStart(2,"0")}`}const K=" ";function p(e){const t=w(e),a=t.startsWith("-"),[r,n]=(a?t.slice(1):t).split("."),o=r.replace(/\B(?=(\d{3})+(?!\d))/g,K);return`${a?"-":""}${o},${n}`}const W=["p2","p5","p7"];function k(e,t,a){return h(C(e,t,a).textContent??"0")}function P(e,t,a,r){C(e,t,a).textContent=w(r)}function V(e,t){const a=(t.taxScale??0)+(t.flatTax??0);if(a<0)throw new Error("Kwota składki nie może być ujemna");const r=k(e,"VI","p7"),n=k(e,"IX","p2");for(const o of W)P(e,"VI",o,k(e,"VI",o)+a);return P(e,"IX","p2",n+a),q(e),{delta:a,healthBefore:r,healthAfter:k(e,"VI","p7"),totalBefore:n,totalAfter:k(e,"IX","p2")}}function q(e){const t=k(e,"IV","p37"),a=k(e,"VI","p7"),r=j(e,"VII","p3")?k(e,"VII","p3"):0,n=k(e,"IX","p2"),o=t+a+r;if(n!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${w(n)}, oczekiwano ${w(o)} (społeczne ${w(t)} + zdrowotna ${w(a)} + FP ${w(r)})`)}function O(e){const t=new XMLSerializer().serializeToString(e);return t.startsWith("<?xml")?t.endsWith(`
`)?t:t+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${t}
`}const F=.09,Z=.049,y=480600;function B(e){return Math.round(e*F)}const R=[{label:"przychód do 60 000 zł",revenueFromGr:0,revenueToGr:6e6,contributionGr:49835},{label:"przychód 60 000 – 300 000 zł",revenueFromGr:6e6,revenueToGr:3e7,contributionGr:83058},{label:"przychód powyżej 300 000 zł",revenueFromGr:3e7,revenueToGr:null,contributionGr:149504}];function J(e){return R.find(t=>e>=t.revenueFromGr&&(t.revenueToGr===null||e<=t.revenueToGr))??R[R.length-1]}function Q(e,t,a){if(!e)return 0;const r=t.trim();return r===""?a:h(r)}function Y(e,t,a){const r=Q(e,t,a);if(e&&t.trim()!==""&&r<a)throw new Error(`kwota nie może być niższa niż minimum ${p(a)} zł`);return r}function ee(e,t,a,r){const o=Math.max(0,Math.round(t*(e==="scale"?F:Z))),i=B(a)*r;return Math.max(o,i)}function te(e,t){return{dueGr:e,paidGr:t,balanceGr:e-t}}const ae={k7:/^\d{1,5}\.\d{2}$/,k8:/^\d{1,6}\.\d{2}$/,k9:/^\d{1,7}\.\d{2}$/,k10:/^\d{1,8}\.\d{2}$/,k11:/^\d{1,9}\.\d{2}$/,k12:/^\d{1,10}\.\d{2}$/,k13:/^\d{1,11}\.\d{2}$/,b:/^(true|false|0|1)$/,d:/^\d{4}-\d{2}-\d{2}$/,ym:/^\d{4}-\d{2}$/,y:/^\d{4}$/,kod4:/^\d{4}$/,dig:/^\d$/,id2:/^\d{2}$/,l6:/^\d{1,6}$/,wyp:/^\d{1,2}\.\d{2}$/};function T(e,t,a,r={}){const n={};for(let o=e;o<=t;o++)n[`p${o}`]=a;return{...n,...r}}const ne=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII"],re={I:{p1:"dig",p2:{p1:"id2",p2:"ym"},p3:"d",p4:"s20",p5:"s12"},II:{p1:"s10",p2:"s14",p3:"s11",p4:"s1",p5:"s9",p6:"s31",p7:"s31",p8:"s22",p9:"d"},III:{p1:"l6",p2:"s1",p3:"wyp"},IV:T(1,36,"k11",{p37:"k12"}),V:T(1,4,"k11",{p5:"k12"}),VI:{...T(1,5,"k11"),p6:"k10",p7:"k12"},VII:{p1:"k11",p2:"k11",p3:"k12"},VIII:{p1:"l6",p2:"l6",p3:"k12"},IX:{p1:"k13",p2:"k13"},X:{p1:{p1:"kod4",p2:"dig",p3:"dig"},p2:"k10",p3:"k10",p4:"k10",p5:"k10",p6:"s1"},XI:{p1:"b",p2:"k10",p3:"k10",p4:"k10",p5:"b",p6:"k10",p7:"k10",p8:"k10",p9:"b",p10:"k10",p11:"k10",p12:"b",p13:"k10",p14:"b",p15:"k10",p16:"k10",p17:"k10",p18:"b",p19:"k10",p20:"k10"},XII:{p1:"y",p2:"b",p3:"b",p4:"b",p5:"k11",p6:"b",p7:"k11",p8:"k11",p9:"k11",p10:"k11",p11:"k11",p12:"k11",p13:"b",p14:"k11",p15:"b",p16:"k11",p17:"k11",p18:"k11",p19:"k11",p20:"k11",p21:"b",p22:"k11",p23:"k11",p24:"k11",p25:"k11",p26:"k11",p27:"k11",p28:"k11",p29:"k11"},XIII:{p1:"d"}},oe=new Set(["identyfikacja.PL","identyfikacja.UB","naglowek.DP","cechy.DP","cechy.BL","stopka.DP"]);function ie(e,t,a,r){if(t[0]==="s"){const o=Number(t.slice(1));Number.isFinite(o)&&e.length>o&&r.push({path:a,message:`wartość za długa (max ${o} znaków)`});return}const n=ae[t];n&&(n.test(e.trim())||r.push({path:a,message:`"${e}" nie pasuje do formatu (${t})`}))}function _(e,t,a,r){for(const n of Array.from(e.children)){const o=t[n.localName];if(o===void 0){r.push({path:`${a}/${n.localName}`,message:"nieznane pole"});continue}typeof o=="object"?n.children.length&&_(n,o,`${a}/${n.localName}`,r):ie(n.textContent??"",o,`${a}/${n.localName}`,r)}}function se(e){const t=[],a=e.documentElement;if(!a||a.localName!=="KEDU")return[{path:"/",message:"brak elementu głównego KEDU"}];a.namespaceURI!==G&&t.push({path:"KEDU",message:`nieoczekiwany namespace (${a.namespaceURI??"brak"})`});const r=Array.from(a.children).filter(n=>n.localName==="ZUSDRA");if(r.length===0)return t.push({path:"KEDU",message:"brak dokumentu ZUSDRA"}),t;if(r.forEach((n,o)=>{const i=r.length>1?`ZUSDRA[${o+1}]`:"ZUSDRA";let s=-1;for(const u of Array.from(n.children)){const c=u.localName;if(oe.has(c))continue;const m=re[c];if(!m){t.push({path:`${i}/${c}`,message:"nieznany blok"});continue}const f=ne.indexOf(c);f<s&&t.push({path:`${i}/${c}`,message:"blok poza kolejnością"}),s=Math.max(s,f),_(u,m,`${i}/${c}`,t)}}),j(e,"IV","p37")&&j(e,"VI","p7")&&j(e,"IX","p2"))try{q(e)}catch(n){t.push({path:"ZUSDRA/IX/p2",message:n.message})}return t}let d=null;function z(e,t){var r;let a=x(e);for(const n of t)a=a?Array.from(a.children).find(o=>o.localName===n)??null:null;return((r=a==null?void 0:a.textContent)==null?void 0:r.trim())??""}function L(e,t,a){const r=z(e,[t,a]);return r?h(r):0}function le(e){e.innerHTML=`
    <h1>DRA — dodaj składkę zdrowotną</h1>
    <p class="lead">Wgraj DRA (ryczałt) z KEDU 5.7, dopisz składkę zdrowotną dla skali i/lub
      liniówki, pobierz gotowy plik do ZUS.</p>

    <div class="card">
      <label class="dropzone" id="drop">
        <input type="file" id="file" accept=".xml,text/xml,application/xml" />
        <span class="drop-label"><strong>Kliknij</strong> lub przeciągnij tu plik DRA (.xml)</span>
      </label>
      <div class="error hidden" id="load-error"></div>
    </div>

    <div class="card hidden" id="editor">
      <div class="meta" id="meta"></div>

      <h2>Ryczałt — składka wg progów 2026</h2>
      <table class="tbl brackets" id="brackets"></table>

      <h2>Dodaj składkę zdrowotną</h2>

      <div class="form-row wage">
        <label for="min-wage">Minimalne wynagrodzenie 2026 (zł)</label>
        <input type="text" id="min-wage" inputmode="decimal" value="${p(y)}" />
        <span class="hint">nie mniej niż ${p(y)}; wpływa na minimum składki</span>
      </div>

      <div class="form-row">
        <label class="chk"><input type="checkbox" id="tax-scale-active" /> Skala podatkowa (zł)</label>
        <input type="text" id="tax-scale-amount" inputmode="decimal" placeholder="0,00" disabled />
        <span class="hint" id="tax-scale-hint"></span>
      </div>
      <div class="form-row">
        <label class="chk"><input type="checkbox" id="flat-tax-active" /> Podatek liniowy (zł)</label>
        <input type="text" id="flat-tax-amount" inputmode="decimal" placeholder="0,00" disabled />
        <span class="hint" id="flat-tax-hint"></span>
      </div>
      <div class="error hidden" id="input-error"></div>

      <h2>Podgląd: przed → po</h2>
      <table class="tbl preview" id="preview"></table>

      <div class="schema-status" id="schema-status"></div>
      <button id="download" disabled>Pobierz zmodyfikowane DRA</button>
    </div>

    <div class="card" id="annual">
      <h2>Roczne rozliczenie zdrowotnej — kalkulator (skala / liniówka)</h2>
      <p class="hint calc-note">Liczy składkę należną za rok składkowy i dopłatę/nadpłatę.
        Na razie nie zapisuje wyniku do pliku (bloki X/XI) — to osobny krok.</p>

      <div class="form-row">
        <label for="annual-form">Forma opodatkowania</label>
        <select id="annual-form">
          <option value="scale">Skala podatkowa (9%)</option>
          <option value="flat">Podatek liniowy (4,9%)</option>
        </select>
        <span class="hint">stawka od dochodu</span>
      </div>
      <div class="form-row">
        <label for="annual-income">Roczny dochód (zł)</label>
        <input type="text" id="annual-income" inputmode="decimal" placeholder="0,00" />
        <span class="hint">przychód − koszty − skł. społeczne</span>
      </div>
      <div class="form-row">
        <label for="annual-months">Liczba miesięcy</label>
        <input type="text" id="annual-months" inputmode="numeric" value="12" />
        <span class="hint">miesiące działalności w roku składkowym (1–12)</span>
      </div>
      <div class="form-row">
        <label for="annual-minwage">Minimalne wynagrodzenie (zł)</label>
        <input type="text" id="annual-minwage" inputmode="decimal" value="${p(y)}" />
        <span class="hint">do rocznego minimum</span>
      </div>
      <div class="form-row">
        <label for="annual-paid">Wpłacone zaliczki (zł)</label>
        <input type="text" id="annual-paid" inputmode="decimal" placeholder="0,00" />
        <span class="hint">suma składek zdrowotnych za rok składkowy</span>
      </div>
      <div class="error hidden" id="annual-error"></div>
      <table class="tbl" id="annual-result"></table>
    </div>

    <div class="card info">
      <h2>Okresy i terminy płatności</h2>
      <ul class="terms">
        <li><strong>Składki miesięczne:</strong> do 20. dnia następnego miesiąca (JDG).</li>
        <li><strong>Rok składkowy (zdrowotna):</strong> luty–styczeń (przesunięty).</li>
        <li><strong>Rok kalendarzowy:</strong> składki społeczne (styczeń–grudzień).</li>
        <li><strong>Roczne rozliczenie zdrowotnej:</strong> do 20 maja, w dokumencie za kwiecień — za rok składkowy luty–styczeń.</li>
        <li><strong>Dopłata:</strong> razem ze składką za kwiecień, do 20 maja. <strong>Nadpłata:</strong> na wniosek o zwrot (ok. do 1 czerwca).</li>
      </ul>
      <p class="docs">Dokumentacja ZUS:
        <a href="https://bip.zus.pl/inne/wymagania-dla-oprogramowania-interfejsowego/dokumenty-ubezpieczeniowe" target="_blank" rel="noopener noreferrer">dokumenty ubezpieczeniowe (KEDU)</a>
        · <a href="https://bip.zus.pl/documents/493361/13983870/EWD+Elektroniczna+Wymiana+Dokument%C3%B3w.+Specyfikacja+wej%C5%9Bcia+-+wyj%C5%9Bcia.+Wersja+2.27+%5Bpdf+2%2C1+MB%5D.pdf/6f967072-4d65-3dd7-be04-00b05ebd506a?t=1776061965699" target="_blank" rel="noopener noreferrer">specyfikacja KEDU (EWD 2.27, PDF)</a>.</p>
    </div>

    <div class="card note">
      <strong>Zakres:</strong> zaznaczone składki trafiają do bloku VI (składka zdrowotna) i podnoszą
      sumę do zapłaty (blok IX). Roczne rozliczenie (bloki X/XI) pozostaje bez zmian.
      Przed wysyłką zweryfikuj wynik (np. wczytaj plik w programie Płatnik).
    </div>

    <p class="privacy">Plik jest przetwarzany wyłącznie w Twojej przeglądarce — nic nie jest wysyłane na serwer.</p>
  `;const t=e.querySelector("#file"),a=e.querySelector("#drop"),r=e.querySelector("#load-error"),n=e.querySelector("#editor");t.addEventListener("change",()=>{var s;const i=(s=t.files)==null?void 0:s[0];i&&o(i)}),["dragenter","dragover"].forEach(i=>a.addEventListener(i,s=>{s.preventDefault(),a.classList.add("drag")})),["dragleave","drop"].forEach(i=>a.addEventListener(i,s=>{s.preventDefault(),a.classList.remove("drag")})),a.addEventListener("drop",i=>{var u,c;const s=(c=(u=i.dataTransfer)==null?void 0:u.files)==null?void 0:c[0];s&&o(s)}),fe(e);async function o(i){r.classList.add("hidden");try{const s=await i.text(),u=M(s);if(x(u).namespaceURI!==G)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");const c=z(u,["XI","p13"]),m=z(u,["XI","p16"]);d={xml:s,period:z(u,["I","p2","p2"]),payerName:ce(u),social:L(u,"IV","p37"),health:L(u,"VI","p7"),laborFund:L(u,"VII","p3"),total:L(u,"IX","p2"),annual:m?h(m):null,revenue:c?h(c):null},de(e),n.classList.remove("hidden")}catch(s){d=null,n.classList.add("hidden"),r.textContent=`Nie udało się wczytać pliku: ${s.message}`,r.classList.remove("hidden")}}}function ce(e){const t=z(e,["II","p6"]),a=z(e,["II","p7"]),r=z(e,["II","p8"]);return[t,[r,a].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function de(e){if(!d)return;const t=e.querySelector("#meta");t.innerHTML=`<strong>${d.payerName||"płatnik"}</strong> · okres <strong>${d.period||"—"}</strong>`,me(e);const a=e.querySelector("#min-wage"),r=e.querySelector("#tax-scale-active"),n=e.querySelector("#tax-scale-amount"),o=e.querySelector("#tax-scale-hint"),i=e.querySelector("#flat-tax-active"),s=e.querySelector("#flat-tax-amount"),u=e.querySelector("#flat-tax-hint"),c=e.querySelector("#input-error"),m=e.querySelector("#preview"),f=e.querySelector("#download");function b(){r.checked||(n.value=""),i.checked||(s.value=""),n.disabled=!r.checked,s.disabled=!i.checked}function S(){const l=h(a.value);if(l<y)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${p(y)} zł`);return l}function g(l,I,D,N){try{return Y(l,I,N)}catch(H){throw new Error(`${D}: ${H.message}`)}}function E(){const l=B(S());return{minimumGr:l,taxScale:g(r.checked,n.value,"Skala podatkowa",l),flatTax:g(i.checked,s.value,"Podatek liniowy",l)}}function v(l){m.innerHTML="",f.disabled=!0,c.textContent=l,c.classList.remove("hidden")}function $(){if(!d)return;c.classList.add("hidden");let l;try{l=E()}catch(N){v(N.message);return}const I=`puste = minimum ${p(l.minimumGr)}`;o.textContent=I,u.textContent=I;const D=l.taxScale+l.flatTax;ue(m,D,{taxScale:r.checked?l.taxScale:null,flatTax:i.checked?l.flatTax:null}),pe(e,l.taxScale,l.flatTax),f.disabled=D===0}[r,i].forEach(l=>l.addEventListener("change",()=>{b(),$()})),[a,n,s].forEach(l=>l.addEventListener("input",$)),f.addEventListener("click",()=>{let l;try{l=E()}catch(I){v(I.message);return}ke(l.taxScale,l.flatTax)}),b(),$()}function ue(e,t,a){if(!d)return;const r=[],n=(o,i,s,u={})=>{const c=i!==s;return`<tr class="${u.total?"total":""} ${c?"chg":""}">
      <td>${o}</td>
      <td class="val">${p(i)}</td>
      <td class="arr">→</td>
      <td class="val ${c?"after":""}">${p(s)}</td>
    </tr>`};r.push('<tr class="head"><td>Pozycja</td><td class="val">przed (zł)</td><td class="arr"></td><td class="val">po (zł)</td></tr>'),a.taxScale!==null&&r.push(U("Dodano: skala",a.taxScale)),a.flatTax!==null&&r.push(U("Dodano: liniówka",a.flatTax)),r.push(n("Składki społeczne (IV)",d.social,d.social)),r.push(n("Składka zdrowotna (VI)",d.health,d.health+t)),r.push(n("Fundusz Pracy (VII)",d.laborFund,d.laborFund)),r.push(n("Suma do zapłaty (IX)",d.total,d.total+t,{total:!0})),d.annual!==null&&r.push(n("Roczne rozliczenie zdrow. (XI)",d.annual,d.annual)),e.innerHTML=r.join("")}function pe(e,t,a){if(!d)return;const r=e.querySelector("#schema-status");let n;try{const i=M(d.xml);V(i,{taxScale:t,flatTax:a}),n=se(i)}catch(i){n=[{path:"",message:i.message}]}if(n.length===0){r.className="schema-status ok",r.textContent="✓ Zgodne ze schematem KEDU 5.7";return}r.className="schema-status warn";const o=n.slice(0,5).map(i=>i.path?`${i.path}: ${i.message}`:i.message).join(" · ");r.textContent=`⚠ ${n.length} uwag względem schematu — ${o}${n.length>5?" …":""}`}function U(e,t){return`<tr class="added"><td>${e}</td><td class="val delta" colspan="3">+ ${p(t)}</td></tr>`}function me(e){if(!d)return;const t=e.querySelector("#brackets"),a=d.revenue!==null?J(d.revenue):null,r='<tr class="head"><td>Próg (roczny przychód)</td><td class="val">Składka mies. (zł)</td></tr>',n=R.map(o=>{const i=a===o;return`<tr class="${i?"sel":""}">
      <td>${o.label}${i?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${p(o.contributionGr)}</td>
    </tr>`}).join("");t.innerHTML=r+n}function fe(e){const t=e.querySelector("#annual-form"),a=e.querySelector("#annual-income"),r=e.querySelector("#annual-months"),n=e.querySelector("#annual-minwage"),o=e.querySelector("#annual-paid"),i=e.querySelector("#annual-error"),s=e.querySelector("#annual-result");function u(){i.classList.add("hidden");try{const c=a.value.trim()===""?0:h(a.value),m=h(n.value);if(m<y)throw new Error(`Minimalne wynagrodzenie nie mniej niż ${p(y)} zł`);const f=Number(r.value.trim());if(!Number.isInteger(f)||f<1||f>12)throw new Error("Liczba miesięcy musi być z zakresu 1–12");const b=o.value.trim()===""?0:h(o.value);if(b<0)throw new Error("Wpłacone zaliczki nie mogą być ujemne");const S=ee(t.value,c,m,f),g=te(S,b),E=g.balanceGr<0,v=g.balanceGr===0,$=v?"Rozliczone (saldo 0)":E?"Nadpłata (do zwrotu)":"Dopłata (do 20 maja)";s.innerHTML=`
        <tr class="head"><td>Pozycja</td><td class="val">Kwota (zł)</td></tr>
        <tr><td>Składka należna za rok składkowy</td><td class="val">${p(S)}</td></tr>
        <tr><td>Wpłacone zaliczki</td><td class="val">${p(b)}</td></tr>
        <tr class="total ${v?"":"chg"}"><td>${$}</td>
          <td class="val ${v?"":"after"}">${p(Math.abs(g.balanceGr))}</td></tr>
      `}catch(c){s.innerHTML="",i.textContent=c.message,i.classList.remove("hidden")}}[t,a,r,n,o].forEach(c=>{c.addEventListener("input",u),c.addEventListener("change",u)}),u()}function ke(e,t){if(!d)return;const a=M(d.xml);V(a,{taxScale:e,flatTax:t});const r=O(a),n=new Blob([r],{type:"application/xml"}),o=URL.createObjectURL(n),i=document.createElement("a");i.href=o;const s=d.period||"DRA";i.download=`DRA_${s}_zdrowotna.xml`,i.click(),URL.revokeObjectURL(o)}const X=document.querySelector("#app");X&&le(X);
