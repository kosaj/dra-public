(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const M="http://www.zus.pl/2026/KEDU_5_7";function q(e){var a;const t=new DOMParser().parseFromString(e,"application/xml"),n=t.getElementsByTagName("parsererror")[0];if(n)throw new Error(`Nieprawidłowy XML: ${((a=n.textContent)==null?void 0:a.trim())??"błąd parsowania"}`);return E(t),t}function E(e){const t=e.getElementsByTagNameNS(M,"ZUSDRA")[0];if(!t)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return t}function j(e,t){for(const n of Array.from(e.children))if(n.localName===t)return n;return null}function P(e,t,n){const a=E(e),r=j(a,t);if(!r)throw new Error(`Brak bloku ${t} w DRA`);const o=j(r,n);if(!o)throw new Error(`Brak pola ${t}/${n} w DRA`);return o}function H(e,t,n){const a=E(e),r=j(a,t);return r?j(r,n)!==null:!1}function f(e){const t=e.replace(/\s/g,"").replace(",","."),n=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(t);if(!n)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,a,r,o=""]=n,i=(o+"00").slice(0,2),l=Number(r)*100+Number(i);return a==="-"?-l:l}function z(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const t=e<0?"-":"",n=Math.abs(e),a=Math.floor(n/100),r=n%100;return`${t}${a}.${String(r).padStart(2,"0")}`}const B=" ";function p(e){const t=z(e),n=t.startsWith("-"),[a,r]=(n?t.slice(1):t).split("."),o=a.replace(/\B(?=(\d{3})+(?!\d))/g,B);return`${n?"-":""}${o},${r}`}const V=["p2","p5","p7"];function m(e,t,n){return f(P(e,t,n).textContent??"0")}function D(e,t,n,a){P(e,t,n).textContent=z(a)}function U(e,t){const n=(t.taxScale??0)+(t.flatTax??0);if(n<0)throw new Error("Kwota składki nie może być ujemna");const a=m(e,"VI","p7"),r=m(e,"IX","p2");for(const o of V)D(e,"VI",o,m(e,"VI",o)+n);return D(e,"IX","p2",r+n),_(e),{delta:n,healthBefore:a,healthAfter:m(e,"VI","p7"),totalBefore:r,totalAfter:m(e,"IX","p2")}}function _(e){const t=m(e,"IV","p37"),n=m(e,"VI","p7"),a=H(e,"VII","p3")?m(e,"VII","p3"):0,r=m(e,"IX","p2"),o=t+n+a;if(r!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${z(r)}, oczekiwano ${z(o)} (społeczne ${z(t)} + zdrowotna ${z(n)} + FP ${z(a)})`)}function W(e){const t=new XMLSerializer().serializeToString(e);return t.startsWith("<?xml")?t.endsWith(`
`)?t:t+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${t}
`}const F=.09,K=.049,k=480600;function C(e){return Math.round(e*F)}const A=[{label:"przychód do 60 000 zł",revenueFromGr:0,revenueToGr:6e6,contributionGr:49835},{label:"przychód 60 000 – 300 000 zł",revenueFromGr:6e6,revenueToGr:3e7,contributionGr:83058},{label:"przychód powyżej 300 000 zł",revenueFromGr:3e7,revenueToGr:null,contributionGr:149504}];function O(e){return A.find(t=>e>=t.revenueFromGr&&(t.revenueToGr===null||e<=t.revenueToGr))??A[A.length-1]}function Z(e,t,n){if(!e)return 0;const a=t.trim();return a===""?n:f(a)}function J(e,t,n){const a=Z(e,t,n);if(e&&t.trim()!==""&&a<n)throw new Error(`kwota nie może być niższa niż minimum ${p(n)} zł`);return a}function Q(e,t,n,a){const o=Math.max(0,Math.round(t*(e==="scale"?F:K))),i=C(n)*a;return Math.max(o,i)}function Y(e,t){return{dueGr:e,paidGr:t,balanceGr:e-t}}let c=null;function y(e,t){var a;let n=E(e);for(const r of t)n=n?Array.from(n.children).find(o=>o.localName===r)??null:null;return((a=n==null?void 0:n.textContent)==null?void 0:a.trim())??""}function T(e,t,n){const a=y(e,[t,n]);return a?f(a):0}function ee(e){e.innerHTML=`
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
        <input type="text" id="min-wage" inputmode="decimal" value="${p(k)}" />
        <span class="hint">nie mniej niż ${p(k)}; wpływa na minimum składki</span>
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
        <input type="text" id="annual-minwage" inputmode="decimal" value="${p(k)}" />
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
    </div>

    <div class="card note">
      <strong>Zakres:</strong> zaznaczone składki trafiają do bloku VI (składka zdrowotna) i podnoszą
      sumę do zapłaty (blok IX). Roczne rozliczenie (bloki X/XI) pozostaje bez zmian.
      Przed wysyłką zweryfikuj wynik (np. wczytaj plik w programie Płatnik).
    </div>

    <p class="privacy">Plik jest przetwarzany wyłącznie w Twojej przeglądarce — nic nie jest wysyłane na serwer.</p>
  `;const t=e.querySelector("#file"),n=e.querySelector("#drop"),a=e.querySelector("#load-error"),r=e.querySelector("#editor");t.addEventListener("change",()=>{var l;const i=(l=t.files)==null?void 0:l[0];i&&o(i)}),["dragenter","dragover"].forEach(i=>n.addEventListener(i,l=>{l.preventDefault(),n.classList.add("drag")})),["dragleave","drop"].forEach(i=>n.addEventListener(i,l=>{l.preventDefault(),n.classList.remove("drag")})),n.addEventListener("drop",i=>{var d,u;const l=(u=(d=i.dataTransfer)==null?void 0:d.files)==null?void 0:u[0];l&&o(l)}),oe(e);async function o(i){a.classList.add("hidden");try{const l=await i.text(),d=q(l);if(E(d).namespaceURI!==M)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");const u=y(d,["XI","p13"]),h=y(d,["XI","p16"]);c={xml:l,period:y(d,["I","p2","p2"]),payerName:te(d),social:T(d,"IV","p37"),health:T(d,"VI","p7"),laborFund:T(d,"VII","p3"),total:T(d,"IX","p2"),annual:h?f(h):null,revenue:u?f(u):null},ne(e),r.classList.remove("hidden")}catch(l){c=null,r.classList.add("hidden"),a.textContent=`Nie udało się wczytać pliku: ${l.message}`,a.classList.remove("hidden")}}}function te(e){const t=y(e,["II","p6"]),n=y(e,["II","p7"]),a=y(e,["II","p8"]);return[t,[a,n].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function ne(e){if(!c)return;const t=e.querySelector("#meta");t.innerHTML=`<strong>${c.payerName||"płatnik"}</strong> · okres <strong>${c.period||"—"}</strong>`,re(e);const n=e.querySelector("#min-wage"),a=e.querySelector("#tax-scale-active"),r=e.querySelector("#tax-scale-amount"),o=e.querySelector("#tax-scale-hint"),i=e.querySelector("#flat-tax-active"),l=e.querySelector("#flat-tax-amount"),d=e.querySelector("#flat-tax-hint"),u=e.querySelector("#input-error"),h=e.querySelector("#preview"),w=e.querySelector("#download");function v(){a.checked||(r.value=""),i.checked||(l.value=""),r.disabled=!a.checked,l.disabled=!i.checked}function $(){const s=f(n.value);if(s<k)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${p(k)} zł`);return s}function b(s,x,L,R){try{return J(s,x,R)}catch(X){throw new Error(`${L}: ${X.message}`)}}function I(){const s=C($());return{minimumGr:s,taxScale:b(a.checked,r.value,"Skala podatkowa",s),flatTax:b(i.checked,l.value,"Podatek liniowy",s)}}function g(s){h.innerHTML="",w.disabled=!0,u.textContent=s,u.classList.remove("hidden")}function S(){if(!c)return;u.classList.add("hidden");let s;try{s=I()}catch(R){g(R.message);return}const x=`puste = minimum ${p(s.minimumGr)}`;o.textContent=x,d.textContent=x;const L=s.taxScale+s.flatTax;ae(h,L,{taxScale:a.checked?s.taxScale:null,flatTax:i.checked?s.flatTax:null}),w.disabled=L===0}[a,i].forEach(s=>s.addEventListener("change",()=>{v(),S()})),[n,r,l].forEach(s=>s.addEventListener("input",S)),w.addEventListener("click",()=>{let s;try{s=I()}catch(x){g(x.message);return}ie(s.taxScale,s.flatTax)}),v(),S()}function ae(e,t,n){if(!c)return;const a=[],r=(o,i,l,d={})=>{const u=i!==l;return`<tr class="${d.total?"total":""} ${u?"chg":""}">
      <td>${o}</td>
      <td class="val">${p(i)}</td>
      <td class="arr">→</td>
      <td class="val ${u?"after":""}">${p(l)}</td>
    </tr>`};a.push('<tr class="head"><td>Pozycja</td><td class="val">przed (zł)</td><td class="arr"></td><td class="val">po (zł)</td></tr>'),n.taxScale!==null&&a.push(G("Dodano: skala",n.taxScale)),n.flatTax!==null&&a.push(G("Dodano: liniówka",n.flatTax)),a.push(r("Składki społeczne (IV)",c.social,c.social)),a.push(r("Składka zdrowotna (VI)",c.health,c.health+t)),a.push(r("Fundusz Pracy (VII)",c.laborFund,c.laborFund)),a.push(r("Suma do zapłaty (IX)",c.total,c.total+t,{total:!0})),c.annual!==null&&a.push(r("Roczne rozliczenie zdrow. (XI)",c.annual,c.annual)),e.innerHTML=a.join("")}function G(e,t){return`<tr class="added"><td>${e}</td><td class="val delta" colspan="3">+ ${p(t)}</td></tr>`}function re(e){if(!c)return;const t=e.querySelector("#brackets"),n=c.revenue!==null?O(c.revenue):null,a='<tr class="head"><td>Próg (roczny przychód)</td><td class="val">Składka mies. (zł)</td></tr>',r=A.map(o=>{const i=n===o;return`<tr class="${i?"sel":""}">
      <td>${o.label}${i?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${p(o.contributionGr)}</td>
    </tr>`}).join("");t.innerHTML=a+r}function oe(e){const t=e.querySelector("#annual-form"),n=e.querySelector("#annual-income"),a=e.querySelector("#annual-months"),r=e.querySelector("#annual-minwage"),o=e.querySelector("#annual-paid"),i=e.querySelector("#annual-error"),l=e.querySelector("#annual-result");function d(){i.classList.add("hidden");try{const u=n.value.trim()===""?0:f(n.value),h=f(r.value);if(h<k)throw new Error(`Minimalne wynagrodzenie nie mniej niż ${p(k)} zł`);const w=Number(a.value.trim());if(!Number.isInteger(w)||w<1||w>12)throw new Error("Liczba miesięcy musi być z zakresu 1–12");const v=o.value.trim()===""?0:f(o.value);if(v<0)throw new Error("Wpłacone zaliczki nie mogą być ujemne");const $=Q(t.value,u,h,w),b=Y($,v),I=b.balanceGr<0,g=b.balanceGr===0,S=g?"Rozliczone (saldo 0)":I?"Nadpłata (do zwrotu)":"Dopłata (do 20 maja)";l.innerHTML=`
        <tr class="head"><td>Pozycja</td><td class="val">Kwota (zł)</td></tr>
        <tr><td>Składka należna za rok składkowy</td><td class="val">${p($)}</td></tr>
        <tr><td>Wpłacone zaliczki</td><td class="val">${p(v)}</td></tr>
        <tr class="total ${g?"":"chg"}"><td>${S}</td>
          <td class="val ${g?"":"after"}">${p(Math.abs(b.balanceGr))}</td></tr>
      `}catch(u){l.innerHTML="",i.textContent=u.message,i.classList.remove("hidden")}}[t,n,a,r,o].forEach(u=>{u.addEventListener("input",d),u.addEventListener("change",d)}),d()}function ie(e,t){if(!c)return;const n=q(c.xml);U(n,{taxScale:e,flatTax:t});const a=W(n),r=new Blob([a],{type:"application/xml"}),o=URL.createObjectURL(r),i=document.createElement("a");i.href=o;const l=c.period||"DRA";i.download=`DRA_${l}_zdrowotna.xml`,i.click(),URL.revokeObjectURL(o)}const N=document.querySelector("#app");N&&ee(N);
