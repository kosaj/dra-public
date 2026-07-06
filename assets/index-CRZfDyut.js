(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const C="http://www.zus.pl/2026/KEDU_5_7";function M(e){var r;const t=new DOMParser().parseFromString(e,"application/xml"),a=t.getElementsByTagName("parsererror")[0];if(a)throw new Error(`Nieprawidłowy XML: ${((r=a.textContent)==null?void 0:r.trim())??"błąd parsowania"}`);return A(t),t}function A(e){const t=e.getElementsByTagNameNS(C,"ZUSDRA")[0];if(!t)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return t}function G(e,t){for(const a of Array.from(e.children))if(a.localName===t)return a;return null}function O(e,t,a){const r=A(e),n=G(r,t);if(!n)throw new Error(`Brak bloku ${t} w DRA`);const o=G(n,a);if(!o)throw new Error(`Brak pola ${t}/${a} w DRA`);return o}function N(e,t,a){const r=A(e),n=G(r,t);return n?G(n,a)!==null:!1}function j(e){const t=e.replace(/\s/g,"").replace(",","."),a=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(t);if(!a)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,r,n,o=""]=a,i=(o+"00").slice(0,2),u=Number(n)*100+Number(i);return r==="-"?-u:u}function D(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const t=e<0?"-":"",a=Math.abs(e),r=Math.floor(a/100),n=a%100;return`${t}${r}.${String(n).padStart(2,"0")}`}const J=" ";function m(e){const t=D(e),a=t.startsWith("-"),[r,n]=(a?t.slice(1):t).split("."),o=r.replace(/\B(?=(\d{3})+(?!\d))/g,J);return`${a?"-":""}${o},${n}`}const Q=["p2","p5","p7"];function S(e,t,a){return j(O(e,t,a).textContent??"0")}function F(e,t,a,r){O(e,t,a).textContent=D(r)}function _(e,t){const a=(t.taxScale??0)+(t.flatTax??0);if(a<0)throw new Error("Kwota składki nie może być ujemna");const r=S(e,"VI","p7"),n=S(e,"IX","p2");for(const o of Q)F(e,"VI",o,S(e,"VI",o)+a);return F(e,"IX","p2",n+a),W(e),{delta:a,healthBefore:r,healthAfter:S(e,"VI","p7"),totalBefore:n,totalAfter:S(e,"IX","p2")}}function W(e){const t=S(e,"IV","p37"),a=S(e,"VI","p7"),r=N(e,"VII","p3")?S(e,"VII","p3"):0,n=S(e,"IX","p2"),o=t+a+r;if(n!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${D(n)}, oczekiwano ${D(o)} (społeczne ${D(t)} + zdrowotna ${D(a)} + FP ${D(r)})`)}function ee(e){const t=new XMLSerializer().serializeToString(e);return t.startsWith("<?xml")?t.endsWith(`
`)?t:t+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${t}
`}const K=.09,te=.049,T=480600;function ne(e){return Math.round(e*K)}const U={2022:{minMonthlyHealthGr:27090,minWageGr:301e3},2023:{minMonthlyHealthGr:31410,minWageGr:349e3},2024:{minMonthlyHealthGr:38178,minWageGr:424200},2025:{minMonthlyHealthGr:31496,minWageGr:466600},2026:{minMonthlyHealthGr:43254,minWageGr:480600}},V=2026;function ae(e){return(U[e]??U[V]).minMonthlyHealthGr}const E=[{label:"przychód do 60 000 zł",revenueFromGr:0,revenueToGr:6e6,contributionGr:49835},{label:"przychód 60 000 – 300 000 zł",revenueFromGr:6e6,revenueToGr:3e7,contributionGr:83058},{label:"przychód powyżej 300 000 zł",revenueFromGr:3e7,revenueToGr:null,contributionGr:149504}];function Z(e){return E.find(t=>e>=t.revenueFromGr&&(t.revenueToGr===null||e<=t.revenueToGr))??E[E.length-1]}function re(e,t,a){if(!e)return 0;const r=t.trim();return r===""?a:j(r)}function oe(e,t,a){const r=re(e,t,a);if(e&&t.trim()!==""&&r<a)throw new Error(`kwota nie może być niższa niż minimum ${m(a)} zł`);return r}function ie(e,t,a,r){const o=Math.max(0,Math.round(t*(e==="scale"?K:te))),i=a*r;return Math.max(o,i)}function H(e){return`luty ${e} – styczeń ${e+1}`}function se(e,t){const a=/^(\d{4})-(\d{2})$/.exec(e);if(!a)return!1;const r=Number(a[1]),n=Number(a[2]);return n<1||n>12?!1:r===t&&n>=2||r===t+1&&n===1}function le(e,t){return{dueGr:e,paidGr:t,balanceGr:e-t}}function ce(e){const t=new Map;for(const n of e){if(!n.period)continue;const o=t.get(n.period);(!o||n.identifier>o.identifier)&&t.set(n.period,n)}const a=[...t.keys()].sort();return{totalGr:a.reduce((n,o)=>n+t.get(o).healthGr,0),months:a}}const de={k7:/^\d{1,5}\.\d{2}$/,k8:/^\d{1,6}\.\d{2}$/,k9:/^\d{1,7}\.\d{2}$/,k10:/^\d{1,8}\.\d{2}$/,k11:/^\d{1,9}\.\d{2}$/,k12:/^\d{1,10}\.\d{2}$/,k13:/^\d{1,11}\.\d{2}$/,b:/^(true|false|0|1)$/,d:/^\d{4}-\d{2}-\d{2}$/,ym:/^\d{4}-\d{2}$/,y:/^\d{4}$/,kod4:/^\d{4}$/,dig:/^\d$/,id2:/^\d{2}$/,l6:/^\d{1,6}$/,wyp:/^\d{1,2}\.\d{2}$/};function q(e,t,a,r={}){const n={};for(let o=e;o<=t;o++)n[`p${o}`]=a;return{...n,...r}}const ue=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII"],pe={I:{p1:"dig",p2:{p1:"id2",p2:"ym"},p3:"d",p4:"s20",p5:"s12"},II:{p1:"s10",p2:"s14",p3:"s11",p4:"s1",p5:"s9",p6:"s31",p7:"s31",p8:"s22",p9:"d"},III:{p1:"l6",p2:"s1",p3:"wyp"},IV:q(1,36,"k11",{p37:"k12"}),V:q(1,4,"k11",{p5:"k12"}),VI:{...q(1,5,"k11"),p6:"k10",p7:"k12"},VII:{p1:"k11",p2:"k11",p3:"k12"},VIII:{p1:"l6",p2:"l6",p3:"k12"},IX:{p1:"k13",p2:"k13"},X:{p1:{p1:"kod4",p2:"dig",p3:"dig"},p2:"k10",p3:"k10",p4:"k10",p5:"k10",p6:"s1"},XI:{p1:"b",p2:"k10",p3:"k10",p4:"k10",p5:"b",p6:"k10",p7:"k10",p8:"k10",p9:"b",p10:"k10",p11:"k10",p12:"b",p13:"k10",p14:"b",p15:"k10",p16:"k10",p17:"k10",p18:"b",p19:"k10",p20:"k10"},XII:{p1:"y",p2:"b",p3:"b",p4:"b",p5:"k11",p6:"b",p7:"k11",p8:"k11",p9:"k11",p10:"k11",p11:"k11",p12:"k11",p13:"b",p14:"k11",p15:"b",p16:"k11",p17:"k11",p18:"k11",p19:"k11",p20:"k11",p21:"b",p22:"k11",p23:"k11",p24:"k11",p25:"k11",p26:"k11",p27:"k11",p28:"k11",p29:"k11"},XIII:{p1:"d"}},me=new Set(["identyfikacja.PL","identyfikacja.UB","naglowek.DP","cechy.DP","cechy.BL","stopka.DP"]);function fe(e,t,a,r){if(t[0]==="s"){const o=Number(t.slice(1));Number.isFinite(o)&&e.length>o&&r.push({path:a,message:`wartość za długa (max ${o} znaków)`});return}const n=de[t];n&&(n.test(e.trim())||r.push({path:a,message:`"${e}" nie pasuje do formatu (${t})`}))}function Y(e,t,a,r){for(const n of Array.from(e.children)){const o=t[n.localName];if(o===void 0){r.push({path:`${a}/${n.localName}`,message:"nieznane pole"});continue}typeof o=="object"?n.children.length&&Y(n,o,`${a}/${n.localName}`,r):fe(n.textContent??"",o,`${a}/${n.localName}`,r)}}function he(e){const t=[],a=e.documentElement;if(!a||a.localName!=="KEDU")return[{path:"/",message:"brak elementu głównego KEDU"}];a.namespaceURI!==C&&t.push({path:"KEDU",message:`nieoczekiwany namespace (${a.namespaceURI??"brak"})`});const r=Array.from(a.children).filter(n=>n.localName==="ZUSDRA");if(r.length===0)return t.push({path:"KEDU",message:"brak dokumentu ZUSDRA"}),t;if(r.forEach((n,o)=>{const i=r.length>1?`ZUSDRA[${o+1}]`:"ZUSDRA";let u=-1;for(const f of Array.from(n.children)){const h=f.localName;if(me.has(h))continue;const l=pe[h];if(!l){t.push({path:`${i}/${h}`,message:"nieznany blok"});continue}const d=ue.indexOf(h);d<u&&t.push({path:`${i}/${h}`,message:"blok poza kolejnością"}),u=Math.max(u,d),Y(f,l,`${i}/${h}`,t)}}),N(e,"IV","p37")&&N(e,"VI","p7")&&N(e,"IX","p2"))try{W(e)}catch(n){t.push({path:"ZUSDRA/IX/p2",message:n.message})}return t}let s=null;function g(e,t){var r;let a=A(e);for(const n of t)a=a?Array.from(a.children).find(o=>o.localName===n)??null:null;return((r=a==null?void 0:a.textContent)==null?void 0:r.trim())??""}function R(e,t,a){const r=g(e,[t,a]);return r?j(r):0}function ke(e){const t=Object.keys(U).map(Number).sort((l,d)=>d-l).map(l=>`<option value="${l}"${l===V?" selected":""}>${l}</option>`).join(""),a=E.map((l,d)=>`<option value="${d}">${l.label} — ${m(l.contributionGr)} zł/mies</option>`).join("");e.innerHTML=`
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

    <div class="tabs" role="tablist">
      <button class="tab active" id="tabbtn-monthly" data-tab="monthly">Rozliczenie miesięczne</button>
      <button class="tab" id="tabbtn-annual" data-tab="annual">Rozliczenie roczne</button>
    </div>

    <div class="tab-panel" id="tab-monthly">
      <div class="card" id="editor-empty">Wgraj plik DRA powyżej, aby dodać składkę do rozliczenia miesięcznego (bloki VI + IX).</div>

      <div class="card hidden" id="editor">
        <div class="meta" id="meta"></div>

        <h2>Ryczałt — składka wg progów 2026</h2>
        <table class="tbl brackets" id="brackets"></table>

        <h2>Dodaj składkę zdrowotną (za ten miesiąc)</h2>

        <div class="form-row wage">
          <label for="min-wage">Minimalne wynagrodzenie 2026 (zł)</label>
          <input type="text" id="min-wage" inputmode="decimal" value="${m(T)}" />
          <span class="hint">nie mniej niż ${m(T)}; wpływa na minimum składki</span>
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

        <h2>Prognoza przelewu (ryczałt — wyższy próg)</h2>
        <p class="hint calc-note">Ile zapłacisz miesięcznie, gdy wejdziesz na wyższy próg.
          Nie zmienia pliku — to planowanie, żeby nie zaskoczyła Cię majowa dopłata.</p>
        <div class="form-row">
          <label for="proj-bracket">Przewidywany próg</label>
          <select id="proj-bracket">${a}</select>
          <span class="hint">próg wg rocznego przychodu</span>
        </div>
        <table class="tbl" id="proj-table"></table>
        <div class="proj-transfer" id="proj-transfer"></div>
      </div>

      <div class="card note">
        <strong>Zakres:</strong> zaznaczone składki trafiają do bloku VI (składka zdrowotna) i podnoszą
        sumę do zapłaty (blok IX) — to składka <strong>za ten miesiąc</strong>. Kwoty roczne policz
        w zakładce „Rozliczenie roczne". Przed wysyłką zweryfikuj wynik (np. w programie Płatnik).
      </div>
    </div>

    <div class="tab-panel hidden" id="tab-annual">
      <div class="card" id="annual">
        <h2>Roczne rozliczenie zdrowotnej — kalkulator (skala / liniówka)</h2>
        <p class="hint calc-note">Liczy składkę należną za rok składkowy i dopłatę/nadpłatę.
          Na razie nie zapisuje wyniku do pliku (blok XII) — to osobny krok.</p>

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
          <label for="annual-year">Rok składkowy</label>
          <select id="annual-year">${t}</select>
          <span class="hint" id="annual-year-info"></span>
        </div>
        <div class="form-row">
          <label for="annual-files">Miesięczne DRA (auto-suma)</label>
          <input type="file" id="annual-files" accept=".xml,text/xml,application/xml" multiple />
          <span class="hint" id="annual-files-info">wgraj DRA luty–styczeń → zsumujemy VI/p7 (korekty: bierzemy najnowszą)</span>
        </div>
        <div class="form-row">
          <label for="annual-paid">Wpłacone zaliczki (zł)</label>
          <input type="text" id="annual-paid" inputmode="decimal" placeholder="0,00" />
          <span class="hint">auto z wgranych plików; można poprawić ręcznie</span>
        </div>
        <div class="error hidden" id="annual-error"></div>
        <table class="tbl" id="annual-result"></table>
      </div>
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

    <p class="privacy">Plik jest przetwarzany wyłącznie w Twojej przeglądarce — nic nie jest wysyłane na serwer.</p>
  `;const r=e.querySelector("#file"),n=e.querySelector("#drop"),o=e.querySelector("#load-error"),i=e.querySelector("#editor"),u=e.querySelector("#editor-empty");function f(l){e.querySelectorAll(".tab").forEach(d=>d.classList.toggle("active",d.dataset.tab===l)),e.querySelector("#tab-monthly").classList.toggle("hidden",l!=="monthly"),e.querySelector("#tab-annual").classList.toggle("hidden",l!=="annual")}e.querySelectorAll(".tab").forEach(l=>l.addEventListener("click",()=>f(l.dataset.tab??"monthly"))),r.addEventListener("change",()=>{var d;const l=(d=r.files)==null?void 0:d[0];l&&h(l)}),["dragenter","dragover"].forEach(l=>n.addEventListener(l,d=>{d.preventDefault(),n.classList.add("drag")})),["dragleave","drop"].forEach(l=>n.addEventListener(l,d=>{d.preventDefault(),n.classList.remove("drag")})),n.addEventListener("drop",l=>{var p,v;const d=(v=(p=l.dataTransfer)==null?void 0:p.files)==null?void 0:v[0];d&&h(d)}),Ie(e);async function h(l){o.classList.add("hidden");try{const d=await l.text(),p=M(d);if(A(p).namespaceURI!==C)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");const v=g(p,["XI","p13"]),y=g(p,["XI","p16"]);s={xml:d,period:g(p,["I","p2","p2"]),payerName:ye(p),nip:g(p,["II","p1"]),regon:g(p,["II","p2"]),social:R(p,"IV","p37"),health:R(p,"VI","p7"),laborFund:R(p,"VII","p3"),total:R(p,"IX","p2"),annual:y?j(y):null,revenue:v?j(v):null},we(e),i.classList.remove("hidden"),u.classList.add("hidden"),f("monthly")}catch(d){s=null,i.classList.add("hidden"),u.classList.remove("hidden"),o.textContent=`Nie udało się wczytać pliku: ${d.message}`,o.classList.remove("hidden")}}}function ye(e){const t=g(e,["II","p6"]),a=g(e,["II","p7"]),r=g(e,["II","p8"]);return[t,[r,a].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function we(e){if(!s)return;const t=e.querySelector("#meta"),a=[s.nip?`NIP ${s.nip}`:"",s.regon?`REGON ${s.regon}`:"",s.period?`okres ${s.period}`:""].filter(Boolean);t.innerHTML=`
    <div class="meta-firma"><strong>${s.payerName||"płatnik"}</strong></div>
    <div class="meta-id">${a.join(" · ")}</div>
  `,ve(e),ge(e);const r=e.querySelector("#min-wage"),n=e.querySelector("#tax-scale-active"),o=e.querySelector("#tax-scale-amount"),i=e.querySelector("#tax-scale-hint"),u=e.querySelector("#flat-tax-active"),f=e.querySelector("#flat-tax-amount"),h=e.querySelector("#flat-tax-hint"),l=e.querySelector("#input-error"),d=e.querySelector("#preview"),p=e.querySelector("#download");function v(){n.checked||(o.value=""),u.checked||(f.value=""),o.disabled=!n.checked,f.disabled=!u.checked}function y(){const c=j(r.value);if(c<T)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${m(T)} zł`);return c}function x(c,k,w,I){try{return oe(c,k,I)}catch(L){throw new Error(`${w}: ${L.message}`)}}function $(){const c=ne(y());return{minimumGr:c,taxScale:x(n.checked,o.value,"Skala podatkowa",c),flatTax:x(u.checked,f.value,"Podatek liniowy",c)}}function z(c){d.innerHTML="",p.disabled=!0,l.textContent=c,l.classList.remove("hidden")}function b(){if(!s)return;l.classList.add("hidden");let c;try{c=$()}catch(I){z(I.message);return}const k=`puste = minimum ${m(c.minimumGr)}`;i.textContent=k,h.textContent=k;const w=c.taxScale+c.flatTax;ze(d,w,{taxScale:n.checked?c.taxScale:null,flatTax:u.checked?c.flatTax:null}),be(e,c.taxScale,c.flatTax),p.disabled=w===0}[n,u].forEach(c=>c.addEventListener("change",()=>{v(),b()})),[r,o,f].forEach(c=>c.addEventListener("input",b)),p.addEventListener("click",()=>{let c;try{c=$()}catch(k){z(k.message);return}$e(c.taxScale,c.flatTax)}),v(),b()}function ze(e,t,a){if(!s)return;const r=[],n=(o,i,u,f={})=>{const h=i!==u;return`<tr class="${f.total?"total":""} ${h?"chg":""}">
      <td>${o}</td>
      <td class="val">${m(i)}</td>
      <td class="arr">→</td>
      <td class="val ${h?"after":""}">${m(u)}</td>
    </tr>`};r.push('<tr class="head"><td>Pozycja</td><td class="val">przed (zł)</td><td class="arr"></td><td class="val">po (zł)</td></tr>'),a.taxScale!==null&&r.push(X("Dodano: skala",a.taxScale)),a.flatTax!==null&&r.push(X("Dodano: liniówka",a.flatTax)),r.push(n("Składki społeczne (IV)",s.social,s.social)),r.push(n("Składka zdrowotna (VI)",s.health,s.health+t)),r.push(n("Fundusz Pracy (VII)",s.laborFund,s.laborFund)),r.push(n("Suma do zapłaty (IX)",s.total,s.total+t,{total:!0})),s.annual!==null&&r.push(n("Roczne rozliczenie zdrow. (XI)",s.annual,s.annual)),e.innerHTML=r.join("")}function be(e,t,a){if(!s)return;const r=e.querySelector("#schema-status");let n;try{const i=M(s.xml);_(i,{taxScale:t,flatTax:a}),n=he(i)}catch(i){n=[{path:"",message:i.message}]}if(n.length===0){r.className="schema-status ok",r.textContent="✓ Zgodne ze schematem KEDU 5.7";return}r.className="schema-status warn";const o=n.slice(0,5).map(i=>i.path?`${i.path}: ${i.message}`:i.message).join(" · ");r.textContent=`⚠ ${n.length} uwag względem schematu — ${o}${n.length>5?" …":""}`}function X(e,t){return`<tr class="added"><td>${e}</td><td class="val delta" colspan="3">+ ${m(t)}</td></tr>`}function ge(e){if(!s)return;const t=e.querySelector("#proj-bracket"),a=e.querySelector("#proj-table"),r=e.querySelector("#proj-transfer");if(s.revenue!==null){const o=Z(s.revenue);t.value=String(E.indexOf(o))}function n(){if(!s)return;const o=E[Number(t.value)]??E[1],i=o.contributionGr,u=s.social+s.laborFund+i;a.innerHTML=`
      <tr class="head"><td>Składnik</td><td class="val">Kwota (zł)</td></tr>
      <tr><td>Składki społeczne (IV)</td><td class="val">${m(s.social)}</td></tr>
      <tr><td>Fundusz Pracy (VII)</td><td class="val">${m(s.laborFund)}</td></tr>
      <tr><td>Składka zdrowotna (${o.label})</td><td class="val">${m(i)}</td></tr>
      <tr class="total"><td>Razem do przelewu</td><td class="val after">${m(u)}</td></tr>
    `;const f=s.period||"—";r.innerHTML=`
      <div class="row"><span>Kwota przelewu</span><strong>${m(u)} zł</strong></div>
      <div class="row"><span>Opis (opcjonalny)</span><span>Składki ZUS ${f}</span></div>
      <p class="hint">Przelew na Twój <strong>indywidualny rachunek składkowy (NRS)</strong> — tytuł nie jest wymagany, ZUS rozksięgowuje wg numeru konta.
        <a href="https://eskladka.pl/Home" target="_blank" rel="noopener noreferrer">Sprawdź numer rachunku ZUS</a>.</p>
    `}t.addEventListener("change",n),n()}function ve(e){if(!s)return;const t=e.querySelector("#brackets"),a=s.revenue!==null?Z(s.revenue):null,r='<tr class="head"><td>Próg (roczny przychód)</td><td class="val">Składka mies. (zł)</td></tr>',n=E.map(o=>{const i=a===o;return`<tr class="${i?"sel":""}">
      <td>${o.label}${i?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${m(o.contributionGr)}</td>
    </tr>`}).join("");t.innerHTML=r+n}function Ie(e){const t=e.querySelector("#annual-form"),a=e.querySelector("#annual-income"),r=e.querySelector("#annual-months"),n=e.querySelector("#annual-year"),o=e.querySelector("#annual-year-info"),i=e.querySelector("#annual-files"),u=e.querySelector("#annual-files-info"),f=e.querySelector("#annual-paid"),h=e.querySelector("#annual-error"),l=e.querySelector("#annual-result");function d(){return Number(n.value)||V}function p(){h.classList.add("hidden");const y=d(),x=ae(y);o.textContent=`min. ${m(x)}/mies · ${H(y)}`;try{const $=a.value.trim()===""?0:j(a.value),z=Number(r.value.trim());if(!Number.isInteger(z)||z<1||z>12)throw new Error("Liczba miesięcy musi być z zakresu 1–12");const b=f.value.trim()===""?0:j(f.value);if(b<0)throw new Error("Wpłacone zaliczki nie mogą być ujemne");const c=ie(t.value,$,x,z),k=le(c,b),w=k.balanceGr<0,I=k.balanceGr===0,L=I?"Rozliczone (saldo 0)":w?"Nadpłata (do zwrotu)":"Dopłata (do 20 maja)";l.innerHTML=`
        <tr class="head"><td>Pozycja</td><td class="val">Kwota (zł)</td></tr>
        <tr><td>Składka należna za rok składkowy</td><td class="val">${m(c)}</td></tr>
        <tr><td>Wpłacone zaliczki</td><td class="val">${m(b)}</td></tr>
        <tr class="total ${I?"":"chg"}"><td>${L}</td>
          <td class="val ${I?"":"after"}">${m(Math.abs(k.balanceGr))}</td></tr>
      `}catch($){l.innerHTML="",h.textContent=$.message,h.classList.remove("hidden")}}async function v(){const y=Array.from(i.files??[]);if(y.length===0)return;const x=d(),$=[];let z=0;const b=[];for(const I of y)try{const L=M(await I.text()),P=g(L,["I","p2","p2"]);if(!se(P,x)){b.push(P||I.name);continue}$.push({period:P,identifier:Number(g(L,["I","p2","p1"])||"0"),healthGr:R(L,"VI","p7")})}catch{z+=1}const{totalGr:c,months:k}=ce($);f.value=m(c),k.length>0&&(r.value=String(k.length));const w=[];k.length&&w.push(`${k.length}/12 mies. (${H(x)})`),b.length&&w.push(`poza rokiem: ${b.join(", ")}`),z&&w.push(`${z} plik(ów) nie wczytano`),u.textContent=w.length?w.join(" · "):"nie wczytano poprawnych DRA",p()}[t,a,r,f,n].forEach(y=>{y.addEventListener("input",p),y.addEventListener("change",p)}),i.addEventListener("change",()=>void v()),p()}function $e(e,t){if(!s)return;const a=M(s.xml);_(a,{taxScale:e,flatTax:t});const r=ee(a),n=new Blob([r],{type:"application/xml"}),o=URL.createObjectURL(n),i=document.createElement("a");i.href=o;const u=s.period||"DRA";i.download=`DRA_${u}_zdrowotna.xml`,i.click(),URL.revokeObjectURL(o)}const B=document.querySelector("#app");B&&ke(B);
