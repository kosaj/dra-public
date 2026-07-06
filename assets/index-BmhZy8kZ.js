(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();const j="http://www.zus.pl/2026/KEDU_5_7";function T(e){var r;const n=new DOMParser().parseFromString(e,"application/xml"),t=n.getElementsByTagName("parsererror")[0];if(t)throw new Error(`Nieprawidłowy XML: ${((r=t.textContent)==null?void 0:r.trim())??"błąd parsowania"}`);return y(n),n}function y(e){const n=e.getElementsByTagNameNS(j,"ZUSDRA")[0];if(!n)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return n}function I(e,n){for(const t of Array.from(e.children))if(t.localName===n)return t;return null}function q(e,n,t){const r=y(e),a=I(r,n);if(!a)throw new Error(`Brak bloku ${n} w DRA`);const o=I(a,t);if(!o)throw new Error(`Brak pola ${n}/${t} w DRA`);return o}function V(e,n,t){const r=y(e),a=I(r,n);return a?I(a,t)!==null:!1}function z(e){const n=e.replace(/\s/g,"").replace(",","."),t=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(n);if(!t)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,r,a,o=""]=t,i=(o+"00").slice(0,2),s=Number(a)*100+Number(i);return r==="-"?-s:s}function w(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const n=e<0?"-":"",t=Math.abs(e),r=Math.floor(t/100),a=t%100;return`${n}${r}.${String(a).padStart(2,"0")}`}const X=" ";function f(e){const n=w(e),t=n.startsWith("-"),[r,a]=(t?n.slice(1):n).split("."),o=r.replace(/\B(?=(\d{3})+(?!\d))/g,X);return`${t?"-":""}${o},${a}`}const C=["p2","p5","p7"];function p(e,n,t){return z(q(e,n,t).textContent??"0")}function N(e,n,t,r){q(e,n,t).textContent=w(r)}function U(e,n){const t=(n.skala??0)+(n.liniowka??0);if(t<0)throw new Error("Kwota składki nie może być ujemna");const r=p(e,"VI","p7"),a=p(e,"IX","p2");for(const o of C)N(e,"VI",o,p(e,"VI",o)+t);return N(e,"IX","p2",a+t),B(e),{delta:t,zdrowotnaPrzed:r,zdrowotnaPo:p(e,"VI","p7"),sumaPrzed:a,sumaPo:p(e,"IX","p2")}}function B(e){const n=p(e,"IV","p37"),t=p(e,"VI","p7"),r=V(e,"VII","p3")?p(e,"VII","p3"):0,a=p(e,"IX","p2"),o=n+t+r;if(a!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${w(a)}, oczekiwano ${w(o)} (społeczne ${w(n)} + zdrowotna ${w(t)} + FP ${w(r)})`)}function _(e){const n=new XMLSerializer().serializeToString(e);return n.startsWith("<?xml")?n.endsWith(`
`)?n:n+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${n}
`}const F=.09,E=480600;function H(e){return Math.round(e*F)}const v=[{nazwa:"przychód do 60 000 zł",przychodOdGr:0,przychodDoGr:6e6,skladkaGr:49835},{nazwa:"przychód 60 000 – 300 000 zł",przychodOdGr:6e6,przychodDoGr:3e7,skladkaGr:83058},{nazwa:"przychód powyżej 300 000 zł",przychodOdGr:3e7,przychodDoGr:null,skladkaGr:149504}];function W(e){return v.find(n=>e>=n.przychodOdGr&&(n.przychodDoGr===null||e<=n.przychodDoGr))??v[v.length-1]}function K(e,n,t){if(!e)return 0;const r=n.trim();return r===""?t:z(r)}function Z(e,n,t){const r=K(e,n,t);if(e&&n.trim()!==""&&r<t)throw new Error(`kwota nie może być niższa niż minimum ${f(t)} zł`);return r}let c=null;function m(e,n){var r;let t=y(e);for(const a of n)t=t?Array.from(t.children).find(o=>o.localName===a)??null:null;return((r=t==null?void 0:t.textContent)==null?void 0:r.trim())??""}function b(e,n,t){const r=m(e,[n,t]);return r?z(r):0}function Y(e){e.innerHTML=`
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
        <label for="min-wage">Minimalne wynagrodzenie 2026</label>
        <input type="text" id="min-wage" inputmode="decimal" value="${f(E)}" />
        <span class="hint">zł · nie mniej niż ${f(E)}; wpływa na minimum składki</span>
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
  `;const n=e.querySelector("#file"),t=e.querySelector("#drop"),r=e.querySelector("#load-error"),a=e.querySelector("#editor");n.addEventListener("change",()=>{var s;const i=(s=n.files)==null?void 0:s[0];i&&o(i)}),["dragenter","dragover"].forEach(i=>t.addEventListener(i,s=>{s.preventDefault(),t.classList.add("drag")})),["dragleave","drop"].forEach(i=>t.addEventListener(i,s=>{s.preventDefault(),t.classList.remove("drag")})),t.addEventListener("drop",i=>{var d,u;const s=(u=(d=i.dataTransfer)==null?void 0:d.files)==null?void 0:u[0];s&&o(s)});async function o(i){r.classList.add("hidden");try{const s=await i.text(),d=T(s);if(y(d).namespaceURI!==j)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");const u=m(d,["XI","p13"]),h=m(d,["XI","p16"]);c={xml:s,period:m(d,["I","p2","p2"]),payerName:J(d),spoleczne:b(d,"IV","p37"),zdrowotna:b(d,"VI","p7"),fp:b(d,"VII","p3"),suma:b(d,"IX","p2"),roczna:h?z(h):null,przychod:u?z(u):null},Q(e),a.classList.remove("hidden")}catch(s){c=null,a.classList.add("hidden"),r.textContent=`Nie udało się wczytać pliku: ${s.message}`,r.classList.remove("hidden")}}}function J(e){const n=m(e,["II","p6"]),t=m(e,["II","p7"]),r=m(e,["II","p8"]);return[n,[r,t].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function Q(e){if(!c)return;const n=e.querySelector("#meta");n.innerHTML=`<strong>${c.payerName||"płatnik"}</strong> · okres <strong>${c.period||"—"}</strong>`,ne(e);const t=e.querySelector("#min-wage"),r=e.querySelector("#skala-active"),a=e.querySelector("#skala-amount"),o=e.querySelector("#skala-hint"),i=e.querySelector("#liniowka-active"),s=e.querySelector("#liniowka-amount"),d=e.querySelector("#liniowka-hint"),u=e.querySelector("#input-error"),h=e.querySelector("#przeglad"),S=e.querySelector("#download");function L(){a.disabled=!r.checked,s.disabled=!i.checked}function M(){const l=z(t.value);if(l<E)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${f(E)} zł`);return l}function x(l,k,g,D){try{return Z(l,k,D)}catch(O){throw new Error(`${g}: ${O.message}`)}}function P(){const l=H(M());return{minimumGr:l,skala:x(r.checked,a.value,"Skala podatkowa",l),liniowka:x(i.checked,s.value,"Podatek liniowy",l)}}function A(l){h.innerHTML="",S.disabled=!0,u.textContent=l,u.classList.remove("hidden")}function $(){if(!c)return;u.classList.add("hidden");let l;try{l=P()}catch(D){A(D.message);return}const k=`puste = minimum ${f(l.minimumGr)} zł`;o.textContent=k,d.textContent=k;const g=l.skala+l.liniowka;ee(h,g,{skala:r.checked?l.skala:null,liniowka:i.checked?l.liniowka:null}),S.disabled=g===0}[r,i].forEach(l=>l.addEventListener("change",()=>{L(),$()})),[t,a,s].forEach(l=>l.addEventListener("input",$)),S.addEventListener("click",()=>{let l;try{l=P()}catch(k){A(k.message);return}te(l.skala,l.liniowka)}),L(),$()}function ee(e,n,t){if(!c)return;const r=[],a=(o,i,s,d={})=>{const u=i!==s;return`<tr class="${d.total?"total":""} ${u?"chg":""}">
      <td>${o}</td>
      <td class="val">${f(i)}</td>
      <td class="arr">→</td>
      <td class="val ${u?"after":""}">${f(s)}</td>
    </tr>`};t.skala!==null&&r.push(R("Dodano: skala",t.skala)),t.liniowka!==null&&r.push(R("Dodano: liniówka",t.liniowka)),r.push(a("Składki społeczne (IV)",c.spoleczne,c.spoleczne)),r.push(a("Składka zdrowotna (VI)",c.zdrowotna,c.zdrowotna+n)),r.push(a("Fundusz Pracy (VII)",c.fp,c.fp)),r.push(a("Suma do zapłaty (IX)",c.suma,c.suma+n,{total:!0})),c.roczna!==null&&r.push(a("Roczne rozliczenie zdrow. (XI)",c.roczna,c.roczna)),e.innerHTML=r.join("")}function R(e,n){return`<tr class="dodana"><td>${e}</td><td class="val delta" colspan="3">+ ${f(n)} zł</td></tr>`}function ne(e){if(!c)return;const n=e.querySelector("#progi"),t=c.przychod!==null?W(c.przychod):null;n.innerHTML=v.map(r=>{const a=t===r;return`<tr class="${a?"sel":""}">
      <td>${r.nazwa}${a?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${f(r.skladkaGr)} zł</td>
    </tr>`}).join("")}function te(e,n){if(!c)return;const t=T(c.xml);U(t,{skala:e,liniowka:n});const r=_(t),a=new Blob([r],{type:"application/xml"}),o=URL.createObjectURL(a),i=document.createElement("a");i.href=o;const s=c.period||"DRA";i.download=`DRA_${s}_zdrowotna.xml`,i.click(),URL.revokeObjectURL(o)}const G=document.querySelector("#app");G&&Y(G);
