(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const G="http://www.zus.pl/2026/KEDU_5_7";function P(e){var r;const t=new DOMParser().parseFromString(e,"application/xml"),n=t.getElementsByTagName("parsererror")[0];if(n)throw new Error(`Nieprawidłowy XML: ${((r=n.textContent)==null?void 0:r.trim())??"błąd parsowania"}`);return z(t),t}function z(e){const t=e.getElementsByTagNameNS(G,"ZUSDRA")[0];if(!t)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return t}function x(e,t){for(const n of Array.from(e.children))if(n.localName===t)return n;return null}function F(e,t,n){const r=z(e),a=x(r,t);if(!a)throw new Error(`Brak bloku ${t} w DRA`);const o=x(a,n);if(!o)throw new Error(`Brak pola ${t}/${n} w DRA`);return o}function C(e,t,n){const r=z(e),a=x(r,t);return a?x(a,n)!==null:!1}function y(e){const t=e.replace(/\s/g,"").replace(",","."),n=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(t);if(!n)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,r,a,o=""]=n,i=(o+"00").slice(0,2),l=Number(a)*100+Number(i);return r==="-"?-l:l}function m(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const t=e<0?"-":"",n=Math.abs(e),r=Math.floor(n/100),a=n%100;return`${t}${r}.${String(a).padStart(2,"0")}`}const B=" ";function f(e){const t=m(e),n=t.startsWith("-"),[r,a]=(n?t.slice(1):t).split("."),o=r.replace(/\B(?=(\d{3})+(?!\d))/g,B);return`${n?"-":""}${o},${a}`}const V=["p2","p5","p7"];function p(e,t,n){return y(F(e,t,n).textContent??"0")}function R(e,t,n,r){F(e,t,n).textContent=m(r)}function U(e,t){const n=(t.taxScale??0)+(t.flatTax??0);if(n<0)throw new Error("Kwota składki nie może być ujemna");const r=p(e,"VI","p7"),a=p(e,"IX","p2");for(const o of V)R(e,"VI",o,p(e,"VI",o)+n);return R(e,"IX","p2",a+n),X(e),{delta:n,healthBefore:r,healthAfter:p(e,"VI","p7"),totalBefore:a,totalAfter:p(e,"IX","p2")}}function X(e){const t=p(e,"IV","p37"),n=p(e,"VI","p7"),r=C(e,"VII","p3")?p(e,"VII","p3"):0,a=p(e,"IX","p2"),o=t+n+r;if(a!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${m(a)}, oczekiwano ${m(o)} (społeczne ${m(t)} + zdrowotna ${m(n)} + FP ${m(r)})`)}function H(e){const t=new XMLSerializer().serializeToString(e);return t.startsWith("<?xml")?t.endsWith(`
`)?t:t+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${t}
`}const _=.09,S=480600;function K(e){return Math.round(e*_)}const g=[{label:"przychód do 60 000 zł",revenueFromGr:0,revenueToGr:6e6,contributionGr:49835},{label:"przychód 60 000 – 300 000 zł",revenueFromGr:6e6,revenueToGr:3e7,contributionGr:83058},{label:"przychód powyżej 300 000 zł",revenueFromGr:3e7,revenueToGr:null,contributionGr:149504}];function O(e){return g.find(t=>e>=t.revenueFromGr&&(t.revenueToGr===null||e<=t.revenueToGr))??g[g.length-1]}function W(e,t,n){if(!e)return 0;const r=t.trim();return r===""?n:y(r)}function Z(e,t,n){const r=W(e,t,n);if(e&&t.trim()!==""&&r<n)throw new Error(`kwota nie może być niższa niż minimum ${f(n)} zł`);return r}let c=null;function h(e,t){var r;let n=z(e);for(const a of t)n=n?Array.from(n.children).find(o=>o.localName===a)??null:null;return((r=n==null?void 0:n.textContent)==null?void 0:r.trim())??""}function b(e,t,n){const r=h(e,[t,n]);return r?y(r):0}function J(e){e.innerHTML=`
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
      <table class="tbl progi" id="progi"></table>

      <h2>Dodaj składkę zdrowotną</h2>

      <div class="form-row wage">
        <label for="min-wage">Minimalne wynagrodzenie 2026 (zł)</label>
        <input type="text" id="min-wage" inputmode="decimal" value="${f(S)}" />
        <span class="hint">nie mniej niż ${f(S)}; wpływa na minimum składki</span>
      </div>

      <div class="form-row">
        <label class="chk"><input type="checkbox" id="skala-active" /> Skala podatkowa (zł)</label>
        <input type="text" id="skala-amount" inputmode="decimal" placeholder="0,00" disabled />
        <span class="hint" id="skala-hint"></span>
      </div>
      <div class="form-row">
        <label class="chk"><input type="checkbox" id="liniowka-active" /> Podatek liniowy (zł)</label>
        <input type="text" id="liniowka-amount" inputmode="decimal" placeholder="0,00" disabled />
        <span class="hint" id="liniowka-hint"></span>
      </div>
      <div class="error hidden" id="input-error"></div>

      <h2>Podgląd: przed → po</h2>
      <table class="tbl przeglad" id="przeglad"></table>

      <button id="download" disabled>Pobierz zmodyfikowane DRA</button>
    </div>

    <div class="card note">
      <strong>Zakres:</strong> zaznaczone składki trafiają do bloku VI (składka zdrowotna) i podnoszą
      sumę do zapłaty (blok IX). Roczne rozliczenie (bloki X/XI) pozostaje bez zmian.
      Przed wysyłką zweryfikuj wynik (np. wczytaj plik w programie Płatnik).
    </div>

    <p class="privacy">Plik jest przetwarzany wyłącznie w Twojej przeglądarce — nic nie jest wysyłane na serwer.</p>
  `;const t=e.querySelector("#file"),n=e.querySelector("#drop"),r=e.querySelector("#load-error"),a=e.querySelector("#editor");t.addEventListener("change",()=>{var l;const i=(l=t.files)==null?void 0:l[0];i&&o(i)}),["dragenter","dragover"].forEach(i=>n.addEventListener(i,l=>{l.preventDefault(),n.classList.add("drag")})),["dragleave","drop"].forEach(i=>n.addEventListener(i,l=>{l.preventDefault(),n.classList.remove("drag")})),n.addEventListener("drop",i=>{var d,u;const l=(u=(d=i.dataTransfer)==null?void 0:d.files)==null?void 0:u[0];l&&o(l)});async function o(i){r.classList.add("hidden");try{const l=await i.text(),d=P(l);if(z(d).namespaceURI!==G)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");const u=h(d,["XI","p13"]),k=h(d,["XI","p16"]);c={xml:l,period:h(d,["I","p2","p2"]),payerName:Q(d),social:b(d,"IV","p37"),health:b(d,"VI","p7"),laborFund:b(d,"VII","p3"),total:b(d,"IX","p2"),annual:k?y(k):null,revenue:u?y(u):null},Y(e),a.classList.remove("hidden")}catch(l){c=null,a.classList.add("hidden"),r.textContent=`Nie udało się wczytać pliku: ${l.message}`,r.classList.remove("hidden")}}}function Q(e){const t=h(e,["II","p6"]),n=h(e,["II","p7"]),r=h(e,["II","p8"]);return[t,[r,n].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function Y(e){if(!c)return;const t=e.querySelector("#meta");t.innerHTML=`<strong>${c.payerName||"płatnik"}</strong> · okres <strong>${c.period||"—"}</strong>`,te(e);const n=e.querySelector("#min-wage"),r=e.querySelector("#skala-active"),a=e.querySelector("#skala-amount"),o=e.querySelector("#skala-hint"),i=e.querySelector("#liniowka-active"),l=e.querySelector("#liniowka-amount"),d=e.querySelector("#liniowka-hint"),u=e.querySelector("#input-error"),k=e.querySelector("#przeglad"),E=e.querySelector("#download");function L(){r.checked||(a.value=""),i.checked||(l.value=""),a.disabled=!r.checked,l.disabled=!i.checked}function M(){const s=y(n.value);if(s<S)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${f(S)} zł`);return s}function T(s,w,v,$){try{return Z(s,w,$)}catch(q){throw new Error(`${v}: ${q.message}`)}}function A(){const s=K(M());return{minimumGr:s,taxScale:T(r.checked,a.value,"Skala podatkowa",s),flatTax:T(i.checked,l.value,"Podatek liniowy",s)}}function D(s){k.innerHTML="",E.disabled=!0,u.textContent=s,u.classList.remove("hidden")}function I(){if(!c)return;u.classList.add("hidden");let s;try{s=A()}catch($){D($.message);return}const w=`puste = minimum ${f(s.minimumGr)}`;o.textContent=w,d.textContent=w;const v=s.taxScale+s.flatTax;ee(k,v,{taxScale:r.checked?s.taxScale:null,flatTax:i.checked?s.flatTax:null}),E.disabled=v===0}[r,i].forEach(s=>s.addEventListener("change",()=>{L(),I()})),[n,a,l].forEach(s=>s.addEventListener("input",I)),E.addEventListener("click",()=>{let s;try{s=A()}catch(w){D(w.message);return}ne(s.taxScale,s.flatTax)}),L(),I()}function ee(e,t,n){if(!c)return;const r=[],a=(o,i,l,d={})=>{const u=i!==l;return`<tr class="${d.total?"total":""} ${u?"chg":""}">
      <td>${o}</td>
      <td class="val">${f(i)}</td>
      <td class="arr">→</td>
      <td class="val ${u?"after":""}">${f(l)}</td>
    </tr>`};r.push('<tr class="head"><td>Pozycja</td><td class="val">przed (zł)</td><td class="arr"></td><td class="val">po (zł)</td></tr>'),n.taxScale!==null&&r.push(j("Dodano: skala",n.taxScale)),n.flatTax!==null&&r.push(j("Dodano: liniówka",n.flatTax)),r.push(a("Składki społeczne (IV)",c.social,c.social)),r.push(a("Składka zdrowotna (VI)",c.health,c.health+t)),r.push(a("Fundusz Pracy (VII)",c.laborFund,c.laborFund)),r.push(a("Suma do zapłaty (IX)",c.total,c.total+t,{total:!0})),c.annual!==null&&r.push(a("Roczne rozliczenie zdrow. (XI)",c.annual,c.annual)),e.innerHTML=r.join("")}function j(e,t){return`<tr class="dodana"><td>${e}</td><td class="val delta" colspan="3">+ ${f(t)}</td></tr>`}function te(e){if(!c)return;const t=e.querySelector("#progi"),n=c.revenue!==null?O(c.revenue):null,r='<tr class="head"><td>Próg (roczny przychód)</td><td class="val">Składka mies. (zł)</td></tr>',a=g.map(o=>{const i=n===o;return`<tr class="${i?"sel":""}">
      <td>${o.label}${i?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${f(o.contributionGr)}</td>
    </tr>`}).join("");t.innerHTML=r+a}function ne(e,t){if(!c)return;const n=P(c.xml);U(n,{taxScale:e,flatTax:t});const r=H(n),a=new Blob([r],{type:"application/xml"}),o=URL.createObjectURL(a),i=document.createElement("a");i.href=o;const l=c.period||"DRA";i.download=`DRA_${l}_zdrowotna.xml`,i.click(),URL.revokeObjectURL(o)}const N=document.querySelector("#app");N&&J(N);
