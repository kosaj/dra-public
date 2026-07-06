(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();const M="http://www.zus.pl/2026/KEDU_5_7";function T(e){var r;const n=new DOMParser().parseFromString(e,"application/xml"),t=n.getElementsByTagName("parsererror")[0];if(t)throw new Error(`Nieprawidłowy XML: ${((r=t.textContent)==null?void 0:r.trim())??"błąd parsowania"}`);return y(n),n}function y(e){const n=e.getElementsByTagNameNS(M,"ZUSDRA")[0];if(!n)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return n}function v(e,n){for(const t of Array.from(e.children))if(t.localName===n)return t;return null}function O(e,n,t){const r=y(e),a=v(r,n);if(!a)throw new Error(`Brak bloku ${n} w DRA`);const o=v(a,t);if(!o)throw new Error(`Brak pola ${n}/${t} w DRA`);return o}function X(e,n,t){const r=y(e),a=v(r,n);return a?v(a,t)!==null:!1}function k(e){const n=e.trim().replace(",","."),t=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(n);if(!t)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,r,a,o=""]=t,i=(o+"00").slice(0,2),s=Number(a)*100+Number(i);return r==="-"?-s:s}function d(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const n=e<0?"-":"",t=Math.abs(e),r=Math.floor(t/100),a=t%100;return`${n}${r}.${String(a).padStart(2,"0")}`}const V=["p2","p5","p7"];function m(e,n,t){return k(O(e,n,t).textContent??"0")}function N(e,n,t,r){O(e,n,t).textContent=d(r)}function C(e,n){const t=(n.skala??0)+(n.liniowka??0);if(t<0)throw new Error("Kwota składki nie może być ujemna");const r=m(e,"VI","p7"),a=m(e,"IX","p2");for(const o of V)N(e,"VI",o,m(e,"VI",o)+t);return N(e,"IX","p2",a+t),_(e),{delta:t,zdrowotnaPrzed:r,zdrowotnaPo:m(e,"VI","p7"),sumaPrzed:a,sumaPo:m(e,"IX","p2")}}function _(e){const n=m(e,"IV","p37"),t=m(e,"VI","p7"),r=X(e,"VII","p3")?m(e,"VII","p3"):0,a=m(e,"IX","p2"),o=n+t+r;if(a!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${d(a)}, oczekiwano ${d(o)} (społeczne ${d(n)} + zdrowotna ${d(t)} + FP ${d(r)})`)}function H(e){const n=new XMLSerializer().serializeToString(e);return n.startsWith("<?xml")?n.endsWith(`
`)?n:n+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${n}
`}const B=.09,g=480600;function R(e){return Math.round(e*B)}const h=[{nazwa:"przychód do 60 000 zł",przychodOdGr:0,przychodDoGr:6e6,skladkaGr:49835},{nazwa:"przychód 60 000 – 300 000 zł",przychodOdGr:6e6,przychodDoGr:3e7,skladkaGr:83058},{nazwa:"przychód powyżej 300 000 zł",przychodOdGr:3e7,przychodDoGr:null,skladkaGr:149504}];function K(e){return h.find(n=>e>=n.przychodOdGr&&(n.przychodDoGr===null||e<=n.przychodDoGr))??h[h.length-1]}function z(e,n,t){if(!e)return 0;const r=n.trim();return r===""?t:k(r)}let l=null;function f(e,n){var r;let t=y(e);for(const a of n)t=t?Array.from(t.children).find(o=>o.localName===a)??null:null;return((r=t==null?void 0:t.textContent)==null?void 0:r.trim())??""}function j(e,n,t){const r=f(e,[n,t]);return r?k(r):0}function W(e){e.innerHTML=`
    <h1>DRA — dodaj składkę zdrowotną</h1>
    <p class="lead">Wgraj DRA (ryczałt) z KEDU 5.7, dopisz składkę zdrowotną dla skali i/lub
      liniówki, pobierz gotowy plik do ZUS.</p>

    <div class="card">
      <label class="dropzone" id="drop">
        <input type="file" id="file" accept=".xml,text/xml,application/xml" />
        <div id="drop-label"><strong>Kliknij</strong> lub przeciągnij tu plik DRA (.xml)</div>
      </label>
      <div class="error hidden" id="load-error"></div>
    </div>

    <div class="card hidden" id="editor">
      <div class="meta" id="meta"></div>

      <h2>Ryczałt — składka wg progów 2026</h2>
      <table class="progi" id="progi"></table>

      <h2>Dodaj składkę zdrowotną</h2>

      <div class="form-row wage">
        <label for="min-wage">Minimalne wynagrodzenie 2026</label>
        <input type="text" id="min-wage" inputmode="decimal" value="${d(g)}" />
        <span class="hint">zł · nie mniej niż ${d(g)}; wpływa na minimum składki</span>
      </div>

      <div class="form-row">
        <label class="chk"><input type="checkbox" id="skala-active" /> Skala podatkowa</label>
        <input type="text" id="skala-amount" inputmode="decimal" placeholder="0,00" disabled />
        <span class="hint" id="skala-hint"></span>
      </div>
      <div class="form-row">
        <label class="chk"><input type="checkbox" id="liniowka-active" /> Podatek liniowy</label>
        <input type="text" id="liniowka-amount" inputmode="decimal" placeholder="0,00" disabled />
        <span class="hint" id="liniowka-hint"></span>
      </div>
      <div class="error hidden" id="input-error"></div>

      <div class="summary" id="summary"></div>

      <button id="download" disabled>Pobierz zmodyfikowane DRA</button>
    </div>

    <div class="card note">
      <strong>Zakres:</strong> zaznaczone składki trafiają do bloku VI (składka zdrowotna) i podnoszą
      sumę do zapłaty (blok IX). Roczne rozliczenie (bloki X/XI) pozostaje bez zmian.
      Przed wysyłką zweryfikuj wynik (np. wczytaj plik w programie Płatnik).
    </div>

    <p class="privacy">Plik jest przetwarzany wyłącznie w Twojej przeglądarce — nic nie jest wysyłane na serwer.</p>
  `;const n=e.querySelector("#file"),t=e.querySelector("#drop"),r=e.querySelector("#load-error"),a=e.querySelector("#editor");n.addEventListener("change",()=>{var s;const i=(s=n.files)==null?void 0:s[0];i&&o(i)}),["dragenter","dragover"].forEach(i=>t.addEventListener(i,s=>{s.preventDefault(),t.classList.add("drag")})),["dragleave","drop"].forEach(i=>t.addEventListener(i,s=>{s.preventDefault(),t.classList.remove("drag")})),t.addEventListener("drop",i=>{var u,p;const s=(p=(u=i.dataTransfer)==null?void 0:u.files)==null?void 0:p[0];s&&o(s)});async function o(i){r.classList.add("hidden");try{const s=await i.text(),u=T(s);if(y(u).namespaceURI!==M)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");const p=f(u,["XI","p13"]);l={xml:s,period:f(u,["I","p2","p2"]),payerName:F(u),zdrowotna:j(u,"VI","p7"),suma:j(u,"IX","p2"),przychod:p?k(p):null},Z(e),a.classList.remove("hidden")}catch(s){l=null,a.classList.add("hidden"),r.textContent=`Nie udało się wczytać pliku: ${s.message}`,r.classList.remove("hidden")}}}function F(e){const n=f(e,["II","p6"]),t=f(e,["II","p7"]),r=f(e,["II","p8"]);return[n,[r,t].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function Z(e){if(!l)return;const n=e.querySelector("#meta");n.innerHTML=`<strong>${l.payerName||"płatnik"}</strong> · okres <strong>${l.period||"—"}</strong>`,Y(e);const t=e.querySelector("#min-wage"),r=e.querySelector("#skala-active"),a=e.querySelector("#skala-amount"),o=e.querySelector("#skala-hint"),i=e.querySelector("#liniowka-active"),s=e.querySelector("#liniowka-amount"),u=e.querySelector("#liniowka-hint"),p=e.querySelector("#input-error"),$=e.querySelector("#summary"),b=e.querySelector("#download");function D(){a.disabled=!r.checked,s.disabled=!i.checked}function x(){const c=k(t.value);if(c<g)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${d(g)} zł`);return c}function A(c){$.innerHTML="",b.disabled=!0,p.textContent=c,p.classList.remove("hidden")}function E(){if(!l)return;p.classList.add("hidden");let c=0,w=0,I=0;try{c=R(x()),w=z(r.checked,a.value,c),I=z(i.checked,s.value,c)}catch(U){A(U.message);return}const G=`puste = minimum ${d(c)} zł`;o.textContent=G,u.textContent=G;const S=w+I,L=[];r.checked&&L.push(P("Skala podatkowa",w)),i.checked&&L.push(P("Podatek liniowy",I)),$.innerHTML=`
      ${L.join("")}
      <div class="row"><span>Składka zdrowotna (VI)</span>
        <span class="val">${d(l.zdrowotna)} → <span class="after">${d(l.zdrowotna+S)}</span> zł</span></div>
      <div class="row total"><span>Suma do zapłaty (IX)</span>
        <span class="val">${d(l.suma)} → <span class="after">${d(l.suma+S)}</span> zł</span></div>
    `,b.disabled=S===0}[r,i].forEach(c=>c.addEventListener("change",()=>{D(),E()})),[t,a,s].forEach(c=>c.addEventListener("input",E)),b.addEventListener("click",()=>{let c;try{c=R(x())}catch(w){A(w.message);return}J(z(r.checked,a.value,c),z(i.checked,s.value,c))}),D(),E()}function P(e,n){return`<div class="row"><span>${e}</span><span class="val delta">+ ${d(n)} zł</span></div>`}function Y(e){if(!l)return;const n=e.querySelector("#progi"),t=l.przychod!==null?K(l.przychod):null;n.innerHTML=h.map(r=>{const a=t===r;return`<tr class="${a?"sel":""}">
      <td>${r.nazwa}${a?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${d(r.skladkaGr)} zł</td>
    </tr>`}).join("")}function J(e,n){if(!l)return;const t=T(l.xml);C(t,{skala:e,liniowka:n});const r=H(t),a=new Blob([r],{type:"application/xml"}),o=URL.createObjectURL(a),i=document.createElement("a");i.href=o;const s=l.period||"DRA";i.download=`DRA_${s}_zdrowotna.xml`,i.click(),URL.revokeObjectURL(o)}const q=document.querySelector("#app");q&&W(q);
