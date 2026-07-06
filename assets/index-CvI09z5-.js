(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();const b="http://www.zus.pl/2026/KEDU_5_7";function g(e){var o;const n=new DOMParser().parseFromString(e,"application/xml"),t=n.getElementsByTagName("parsererror")[0];if(t)throw new Error(`Nieprawidłowy XML: ${((o=t.textContent)==null?void 0:o.trim())??"błąd parsowania"}`);return m(n),n}function m(e){const n=e.getElementsByTagNameNS(b,"ZUSDRA")[0];if(!n)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return n}function z(e,n){for(const t of Array.from(e.children))if(t.localName===n)return t;return null}function E(e,n,t){const o=m(e),r=z(o,n);if(!r)throw new Error(`Brak bloku ${n} w DRA`);const a=z(r,t);if(!a)throw new Error(`Brak pola ${n}/${t} w DRA`);return a}function S(e,n,t){const o=m(e),r=z(o,n);return r?z(r,t)!==null:!1}function y(e){const n=e.trim().replace(",","."),t=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(n);if(!t)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,o,r,a=""]=t,i=(a+"00").slice(0,2),s=Number(r)*100+Number(i);return o==="-"?-s:s}function c(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const n=e<0?"-":"",t=Math.abs(e),o=Math.floor(t/100),r=t%100;return`${n}${o}.${String(r).padStart(2,"0")}`}const x=["p2","p5","p7"];function u(e,n,t){return y(E(e,n,t).textContent??"0")}function k(e,n,t,o){E(e,n,t).textContent=c(o)}function $(e,n){const t=(n.skala??0)+(n.liniowka??0);if(t<0)throw new Error("Kwota składki nie może być ujemna");const o=u(e,"VI","p7"),r=u(e,"IX","p2");for(const a of x)k(e,"VI",a,u(e,"VI",a)+t);return k(e,"IX","p2",r+t),D(e),{delta:t,zdrowotnaPrzed:o,zdrowotnaPo:u(e,"VI","p7"),sumaPrzed:r,sumaPo:u(e,"IX","p2")}}function D(e){const n=u(e,"IV","p37"),t=u(e,"VI","p7"),o=S(e,"VII","p3")?u(e,"VII","p3"):0,r=u(e,"IX","p2"),a=n+t+o;if(r!==a)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${c(r)}, oczekiwano ${c(a)} (społeczne ${c(n)} + zdrowotna ${c(t)} + FP ${c(o)})`)}function N(e){const n=new XMLSerializer().serializeToString(e);return n.startsWith("<?xml")?n.endsWith(`
`)?n:n+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${n}
`}let l=null;function f(e,n){var o;let t=m(e);for(const r of n)t=t?Array.from(t.children).find(a=>a.localName===r)??null:null;return((o=t==null?void 0:t.textContent)==null?void 0:o.trim())??""}function v(e,n,t){const o=f(e,[n,t]);return o?y(o):0}function P(e){e.innerHTML=`
    <h1>DRA — dodaj składkę zdrowotną</h1>
    <p class="lead">Wgraj DRA (ryczałt) z KEDU 5.7, dopisz policzoną składkę zdrowotną
      dla skali i/lub liniówki, pobierz gotowy plik do ZUS.</p>

    <div class="card">
      <label class="dropzone" id="drop">
        <input type="file" id="file" accept=".xml,text/xml,application/xml" />
        <div id="drop-label"><strong>Kliknij</strong> lub przeciągnij tu plik DRA (.xml)</div>
      </label>
      <div class="error hidden" id="load-error"></div>
    </div>

    <div class="card hidden" id="editor">
      <div class="meta" id="meta"></div>

      <div class="fields">
        <div>
          <label for="skala">Składka zdrowotna — skala
            <span class="hint">zł, np. 314,96</span></label>
          <input type="text" id="skala" inputmode="decimal" placeholder="0,00" />
        </div>
        <div>
          <label for="liniowka">Składka zdrowotna — liniówka
            <span class="hint">zł, np. 314,96</span></label>
          <input type="text" id="liniowka" inputmode="decimal" placeholder="0,00" />
        </div>
      </div>
      <div class="error hidden" id="input-error"></div>

      <div class="summary" id="summary"></div>

      <button id="download" disabled>Pobierz zmodyfikowane DRA</button>
    </div>

    <div class="card note">
      <strong>Zakres:</strong> podana kwota trafia do bloku VI (składka zdrowotna) i podnosi
      sumę do zapłaty (blok IX). Roczne rozliczenie (bloki X/XI) pozostaje bez zmian.
      Przed wysyłką zweryfikuj wynik (np. wczytaj plik w programie Płatnik).
    </div>

    <p class="privacy">Plik jest przetwarzany wyłącznie w Twojej przeglądarce — nic nie jest wysyłane na serwer.</p>
  `;const n=e.querySelector("#file"),t=e.querySelector("#drop"),o=e.querySelector("#load-error"),r=e.querySelector("#editor");n.addEventListener("change",()=>{var s;const i=(s=n.files)==null?void 0:s[0];i&&a(i)}),["dragenter","dragover"].forEach(i=>t.addEventListener(i,s=>{s.preventDefault(),t.classList.add("drag")})),["dragleave","drop"].forEach(i=>t.addEventListener(i,s=>{s.preventDefault(),t.classList.remove("drag")})),t.addEventListener("drop",i=>{var d,p;const s=(p=(d=i.dataTransfer)==null?void 0:d.files)==null?void 0:p[0];s&&a(s)});async function a(i){o.classList.add("hidden");try{const s=await i.text(),d=g(s);if(m(d).namespaceURI!==b)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");l={xml:s,period:f(d,["I","p2","p2"]),payerName:j(d),zdrowotna:v(d,"VI","p7"),suma:v(d,"IX","p2")},R(e),r.classList.remove("hidden")}catch(s){l=null,r.classList.add("hidden"),o.textContent=`Nie udało się wczytać pliku: ${s.message}`,o.classList.remove("hidden")}}}function j(e){const n=f(e,["II","p6"]),t=f(e,["II","p7"]),o=f(e,["II","p8"]);return[n,[o,t].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function R(e){if(!l)return;const n=e.querySelector("#meta");n.innerHTML=`<strong>${l.payerName||"płatnik"}</strong> · okres <strong>${l.period||"—"}</strong>`;const t=e.querySelector("#skala"),o=e.querySelector("#liniowka"),r=e.querySelector("#input-error"),a=e.querySelector("#summary"),i=e.querySelector("#download");function s(p){const w=p.value.trim();return w===""?0:y(w)}function d(){if(!l)return;r.classList.add("hidden");let p=0;try{if(p=s(t)+s(o),p<0)throw new Error("Kwota nie może być ujemna.")}catch(L){a.innerHTML="",i.disabled=!0,r.textContent=L.message,r.classList.remove("hidden");return}const w=l.zdrowotna+p,I=l.suma+p;a.innerHTML=`
      <div class="row"><span>Składka zdrowotna (VI)</span>
        <span class="val">${c(l.zdrowotna)} → <span class="after">${c(w)}</span> zł</span></div>
      <div class="row"><span>Dodawana kwota</span>
        <span class="val delta">+ ${c(p)} zł</span></div>
      <div class="row total"><span>Suma do zapłaty (IX)</span>
        <span class="val">${c(l.suma)} → <span class="after">${c(I)}</span> zł</span></div>
    `,i.disabled=!1}t.addEventListener("input",d),o.addEventListener("input",d),i.addEventListener("click",()=>A(s(t),s(o))),d()}function A(e,n){if(!l)return;const t=g(l.xml);$(t,{skala:e,liniowka:n});const o=N(t),r=new Blob([o],{type:"application/xml"}),a=URL.createObjectURL(r),i=document.createElement("a");i.href=a;const s=l.period||"DRA";i.download=`DRA_${s}_zdrowotna.xml`,i.click(),URL.revokeObjectURL(a)}const h=document.querySelector("#app");h&&P(h);
