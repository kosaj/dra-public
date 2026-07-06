(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const C="http://www.zus.pl/2026/KEDU_5_7";function q(e){var r;const t=new DOMParser().parseFromString(e,"application/xml"),n=t.getElementsByTagName("parsererror")[0];if(n)throw new Error(`Nieprawidłowy XML: ${((r=n.textContent)==null?void 0:r.trim())??"błąd parsowania"}`);return N(t),t}function N(e){const t=e.getElementsByTagNameNS(C,"ZUSDRA")[0];if(!t)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return t}function G(e,t){for(const n of Array.from(e.children))if(n.localName===t)return n;return null}function O(e,t,n){const r=N(e),a=G(r,t);if(!a)throw new Error(`Brak bloku ${t} w DRA`);const o=G(a,n);if(!o)throw new Error(`Brak pola ${t}/${n} w DRA`);return o}function T(e,t,n){const r=N(e),a=G(r,t);return a?G(a,n)!==null:!1}function j(e){const t=e.replace(/\s/g,"").replace(",","."),n=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(t);if(!n)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,r,a,o=""]=n,i=(o+"00").slice(0,2),u=Number(a)*100+Number(i);return r==="-"?-u:u}function R(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const t=e<0?"-":"",n=Math.abs(e),r=Math.floor(n/100),a=n%100;return`${t}${r}.${String(a).padStart(2,"0")}`}const J=" ";function f(e){const t=R(e),n=t.startsWith("-"),[r,a]=(n?t.slice(1):t).split("."),o=r.replace(/\B(?=(\d{3})+(?!\d))/g,J);return`${n?"-":""}${o},${a}`}const Q=["p2","p5","p7"];function S(e,t,n){return j(O(e,t,n).textContent??"0")}function F(e,t,n,r){O(e,t,n).textContent=R(r)}function _(e,t){const n=(t.taxScale??0)+(t.flatTax??0);if(n<0)throw new Error("Kwota składki nie może być ujemna");const r=S(e,"VI","p7"),a=S(e,"IX","p2");for(const o of Q)F(e,"VI",o,S(e,"VI",o)+n);return F(e,"IX","p2",a+n),W(e),{delta:n,healthBefore:r,healthAfter:S(e,"VI","p7"),totalBefore:a,totalAfter:S(e,"IX","p2")}}function W(e){const t=S(e,"IV","p37"),n=S(e,"VI","p7"),r=T(e,"VII","p3")?S(e,"VII","p3"):0,a=S(e,"IX","p2"),o=t+n+r;if(a!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${R(a)}, oczekiwano ${R(o)} (społeczne ${R(t)} + zdrowotna ${R(n)} + FP ${R(r)})`)}function ee(e){const t=new XMLSerializer().serializeToString(e);return t.startsWith("<?xml")?t.endsWith(`
`)?t:t+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${t}
`}const K=.09,te=.049,M=480600;function ae(e){return Math.round(e*K)}const U={2022:{minMonthlyHealthGr:27090,minWageGr:301e3},2023:{minMonthlyHealthGr:31410,minWageGr:349e3},2024:{minMonthlyHealthGr:38178,minWageGr:424200},2025:{minMonthlyHealthGr:31496,minWageGr:466600},2026:{minMonthlyHealthGr:43254,minWageGr:480600}},V=2026;function ne(e){return(U[e]??U[V]).minMonthlyHealthGr}const E=[{label:"przychód do 60 000 zł",revenueFromGr:0,revenueToGr:6e6,contributionGr:49835},{label:"przychód 60 000 – 300 000 zł",revenueFromGr:6e6,revenueToGr:3e7,contributionGr:83058},{label:"przychód powyżej 300 000 zł",revenueFromGr:3e7,revenueToGr:null,contributionGr:149504}];function Z(e){return E.find(t=>e>=t.revenueFromGr&&(t.revenueToGr===null||e<=t.revenueToGr))??E[E.length-1]}function re(e,t,n){if(!e)return 0;const r=t.trim();return r===""?n:j(r)}function oe(e,t,n){const r=re(e,t,n);if(e&&t.trim()!==""&&r<n)throw new Error(`kwota nie może być niższa niż minimum ${f(n)} zł`);return r}function ie(e,t,n,r){const o=Math.max(0,Math.round(t*(e==="scale"?K:te))),i=n*r;return Math.max(o,i)}function H(e){return`luty ${e} – styczeń ${e+1}`}function se(e){return/^\d{4}-04$/.test(e)}function le(e,t){const n=/^(\d{4})-(\d{2})$/.exec(e);if(!n)return!1;const r=Number(n[1]),a=Number(n[2]);return a<1||a>12?!1:r===t&&a>=2||r===t+1&&a===1}function ce(e,t){return{dueGr:e,paidGr:t,balanceGr:e-t}}function de(e){const t=new Map;for(const a of e){if(!a.period)continue;const o=t.get(a.period);(!o||a.identifier>o.identifier)&&t.set(a.period,a)}const n=[...t.keys()].sort();return{totalGr:n.reduce((a,o)=>a+t.get(o).healthGr,0),months:n}}const ue={k7:/^\d{1,5}\.\d{2}$/,k8:/^\d{1,6}\.\d{2}$/,k9:/^\d{1,7}\.\d{2}$/,k10:/^\d{1,8}\.\d{2}$/,k11:/^\d{1,9}\.\d{2}$/,k12:/^\d{1,10}\.\d{2}$/,k13:/^\d{1,11}\.\d{2}$/,b:/^(true|false|0|1)$/,d:/^\d{4}-\d{2}-\d{2}$/,ym:/^\d{4}-\d{2}$/,y:/^\d{4}$/,kod4:/^\d{4}$/,dig:/^\d$/,id2:/^\d{2}$/,l6:/^\d{1,6}$/,wyp:/^\d{1,2}\.\d{2}$/};function P(e,t,n,r={}){const a={};for(let o=e;o<=t;o++)a[`p${o}`]=n;return{...a,...r}}const pe=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII"],me={I:{p1:"dig",p2:{p1:"id2",p2:"ym"},p3:"d",p4:"s20",p5:"s12"},II:{p1:"s10",p2:"s14",p3:"s11",p4:"s1",p5:"s9",p6:"s31",p7:"s31",p8:"s22",p9:"d"},III:{p1:"l6",p2:"s1",p3:"wyp"},IV:P(1,36,"k11",{p37:"k12"}),V:P(1,4,"k11",{p5:"k12"}),VI:{...P(1,5,"k11"),p6:"k10",p7:"k12"},VII:{p1:"k11",p2:"k11",p3:"k12"},VIII:{p1:"l6",p2:"l6",p3:"k12"},IX:{p1:"k13",p2:"k13"},X:{p1:{p1:"kod4",p2:"dig",p3:"dig"},p2:"k10",p3:"k10",p4:"k10",p5:"k10",p6:"s1"},XI:{p1:"b",p2:"k10",p3:"k10",p4:"k10",p5:"b",p6:"k10",p7:"k10",p8:"k10",p9:"b",p10:"k10",p11:"k10",p12:"b",p13:"k10",p14:"b",p15:"k10",p16:"k10",p17:"k10",p18:"b",p19:"k10",p20:"k10"},XII:{p1:"y",p2:"b",p3:"b",p4:"b",p5:"k11",p6:"b",p7:"k11",p8:"k11",p9:"k11",p10:"k11",p11:"k11",p12:"k11",p13:"b",p14:"k11",p15:"b",p16:"k11",p17:"k11",p18:"k11",p19:"k11",p20:"k11",p21:"b",p22:"k11",p23:"k11",p24:"k11",p25:"k11",p26:"k11",p27:"k11",p28:"k11",p29:"k11"},XIII:{p1:"d"}},fe=new Set(["identyfikacja.PL","identyfikacja.UB","naglowek.DP","cechy.DP","cechy.BL","stopka.DP"]);function he(e,t,n,r){if(t[0]==="s"){const o=Number(t.slice(1));Number.isFinite(o)&&e.length>o&&r.push({path:n,message:`wartość za długa (max ${o} znaków)`});return}const a=ue[t];a&&(a.test(e.trim())||r.push({path:n,message:`"${e}" nie pasuje do formatu (${t})`}))}function Y(e,t,n,r){for(const a of Array.from(e.children)){const o=t[a.localName];if(o===void 0){r.push({path:`${n}/${a.localName}`,message:"nieznane pole"});continue}typeof o=="object"?a.children.length&&Y(a,o,`${n}/${a.localName}`,r):he(a.textContent??"",o,`${n}/${a.localName}`,r)}}function ke(e){const t=[],n=e.documentElement;if(!n||n.localName!=="KEDU")return[{path:"/",message:"brak elementu głównego KEDU"}];n.namespaceURI!==C&&t.push({path:"KEDU",message:`nieoczekiwany namespace (${n.namespaceURI??"brak"})`});const r=Array.from(n.children).filter(a=>a.localName==="ZUSDRA");if(r.length===0)return t.push({path:"KEDU",message:"brak dokumentu ZUSDRA"}),t;if(r.forEach((a,o)=>{const i=r.length>1?`ZUSDRA[${o+1}]`:"ZUSDRA";let u=-1;for(const m of Array.from(a.children)){const h=m.localName;if(fe.has(h))continue;const c=me[h];if(!c){t.push({path:`${i}/${h}`,message:"nieznany blok"});continue}const d=pe.indexOf(h);d<u&&t.push({path:`${i}/${h}`,message:"blok poza kolejnością"}),u=Math.max(u,d),Y(m,c,`${i}/${h}`,t)}}),T(e,"IV","p37")&&T(e,"VI","p7")&&T(e,"IX","p2"))try{W(e)}catch(a){t.push({path:"ZUSDRA/IX/p2",message:a.message})}return t}let s=null;function b(e,t){var r;let n=N(e);for(const a of t)n=n?Array.from(n.children).find(o=>o.localName===a)??null:null;return((r=n==null?void 0:n.textContent)==null?void 0:r.trim())??""}function A(e,t,n){const r=b(e,[t,n]);return r?j(r):0}function ye(e){const t=Object.keys(U).map(Number).sort((c,d)=>d-c).map(c=>`<option value="${c}"${c===V?" selected":""}>${c}</option>`).join(""),n=E.map((c,d)=>`<option value="${d}">${c.label} — ${f(c.contributionGr)} zł/mies</option>`).join("");e.innerHTML=`
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

      <div class="card note april-warn hidden" id="april-warn">
        <strong>To deklaracja za kwiecień</strong> — miesiąc <strong>rocznego rozliczenia</strong> składki
        zdrowotnej (termin do 20 maja). Edycja składki miesięcznej jest tu zablokowana. Roczne rozliczenie
        (dopłata/nadpłata) zrób w zakładce obok.
        <button id="goto-annual" class="link-btn">Przejdź do rozliczenia rocznego →</button>
      </div>

      <div class="card hidden" id="editor">
        <div class="meta" id="meta"></div>

        <h2>Ryczałt — składka wg progów 2026</h2>
        <table class="tbl brackets" id="brackets"></table>

        <h2>Dodaj składkę zdrowotną (za ten miesiąc)</h2>

        <div class="form-row wage">
          <label for="min-wage">Minimalne wynagrodzenie 2026 (zł)</label>
          <input type="text" id="min-wage" inputmode="decimal" value="${f(M)}" />
          <span class="hint">nie mniej niż ${f(M)}; wpływa na minimum składki</span>
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
          <select id="proj-bracket">${n}</select>
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
          Roczne rozliczenie składasz w <strong>DRA za kwiecień</strong> (do 20 maja) — tam trafia dopłata/nadpłata.
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
  `;const r=e.querySelector("#file"),a=e.querySelector("#drop"),o=e.querySelector("#load-error"),i=e.querySelector("#editor"),u=e.querySelector("#editor-empty");function m(c){e.querySelectorAll(".tab").forEach(d=>d.classList.toggle("active",d.dataset.tab===c)),e.querySelector("#tab-monthly").classList.toggle("hidden",c!=="monthly"),e.querySelector("#tab-annual").classList.toggle("hidden",c!=="annual")}e.querySelectorAll(".tab").forEach(c=>c.addEventListener("click",()=>m(c.dataset.tab??"monthly"))),e.querySelector("#goto-annual").addEventListener("click",()=>m("annual")),r.addEventListener("change",()=>{var d;const c=(d=r.files)==null?void 0:d[0];c&&h(c)}),["dragenter","dragover"].forEach(c=>a.addEventListener(c,d=>{d.preventDefault(),a.classList.add("drag")})),["dragleave","drop"].forEach(c=>a.addEventListener(c,d=>{d.preventDefault(),a.classList.remove("drag")})),a.addEventListener("drop",c=>{var p,g;const d=(g=(p=c.dataTransfer)==null?void 0:p.files)==null?void 0:g[0];d&&h(d)}),$e(e);async function h(c){o.classList.add("hidden");try{const d=await c.text(),p=q(d);if(N(p).namespaceURI!==C)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");const g=b(p,["XI","p13"]),k=b(p,["XI","p16"]);s={xml:d,period:b(p,["I","p2","p2"]),payerName:ze(p),nip:b(p,["II","p1"]),regon:b(p,["II","p2"]),social:A(p,"IV","p37"),health:A(p,"VI","p7"),laborFund:A(p,"VII","p3"),total:A(p,"IX","p2"),annual:k?j(k):null,revenue:g?j(g):null},we(e),i.classList.remove("hidden"),u.classList.add("hidden"),m("monthly")}catch(d){s=null,i.classList.add("hidden"),u.classList.remove("hidden"),o.textContent=`Nie udało się wczytać pliku: ${d.message}`,o.classList.remove("hidden")}}}function ze(e){const t=b(e,["II","p6"]),n=b(e,["II","p7"]),r=b(e,["II","p8"]);return[t,[r,n].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function we(e){if(!s)return;const t=e.querySelector("#meta"),n=[s.nip?`NIP ${s.nip}`:"",s.regon?`REGON ${s.regon}`:"",s.period?`okres ${s.period}`:""].filter(Boolean);t.innerHTML=`
    <div class="meta-firma"><strong>${s.payerName||"płatnik"}</strong></div>
    <div class="meta-id">${n.join(" · ")}</div>
  `,Ie(e),ve(e);const r=e.querySelector("#min-wage"),a=e.querySelector("#tax-scale-active"),o=e.querySelector("#tax-scale-amount"),i=e.querySelector("#tax-scale-hint"),u=e.querySelector("#flat-tax-active"),m=e.querySelector("#flat-tax-amount"),h=e.querySelector("#flat-tax-hint"),c=e.querySelector("#input-error"),d=e.querySelector("#preview"),p=e.querySelector("#download"),g=se(s.period);if(e.querySelector("#april-warn").classList.toggle("hidden",!g),g){[a,u,o,m].forEach(l=>l.disabled=!0),d.innerHTML="",e.querySelector("#schema-status").textContent="",p.disabled=!0;return}function k(){a.checked||(o.value=""),u.checked||(m.value=""),o.disabled=!a.checked,m.disabled=!u.checked}function L(){const l=j(r.value);if(l<M)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${f(M)} zł`);return l}function I(l,y,w,$){try{return oe(l,y,$)}catch(D){throw new Error(`${w}: ${D.message}`)}}function z(){const l=ae(L());return{minimumGr:l,taxScale:I(a.checked,o.value,"Skala podatkowa",l),flatTax:I(u.checked,m.value,"Podatek liniowy",l)}}function v(l){d.innerHTML="",p.disabled=!0,c.textContent=l,c.classList.remove("hidden")}function x(){if(!s)return;c.classList.add("hidden");let l;try{l=z()}catch($){v($.message);return}const y=`puste = minimum ${f(l.minimumGr)}`;i.textContent=y,h.textContent=y;const w=l.taxScale+l.flatTax;be(d,w,{taxScale:a.checked?l.taxScale:null,flatTax:u.checked?l.flatTax:null}),ge(e,l.taxScale,l.flatTax),p.disabled=w===0}[a,u].forEach(l=>l.addEventListener("change",()=>{k(),x()})),[r,o,m].forEach(l=>l.addEventListener("input",x)),p.addEventListener("click",()=>{let l;try{l=z()}catch(y){v(y.message);return}Se(l.taxScale,l.flatTax)}),k(),x()}function be(e,t,n){if(!s)return;const r=[],a=(o,i,u,m={})=>{const h=i!==u;return`<tr class="${m.total?"total":""} ${h?"chg":""}">
      <td>${o}</td>
      <td class="val">${f(i)}</td>
      <td class="arr">→</td>
      <td class="val ${h?"after":""}">${f(u)}</td>
    </tr>`};r.push('<tr class="head"><td>Pozycja</td><td class="val">przed (zł)</td><td class="arr"></td><td class="val">po (zł)</td></tr>'),n.taxScale!==null&&r.push(X("Dodano: skala",n.taxScale)),n.flatTax!==null&&r.push(X("Dodano: liniówka",n.flatTax)),r.push(a("Składki społeczne (IV)",s.social,s.social)),r.push(a("Składka zdrowotna (VI)",s.health,s.health+t)),r.push(a("Fundusz Pracy (VII)",s.laborFund,s.laborFund)),r.push(a("Suma do zapłaty (IX)",s.total,s.total+t,{total:!0})),s.annual!==null&&r.push(a("Roczne rozliczenie zdrow. (XI)",s.annual,s.annual)),e.innerHTML=r.join("")}function ge(e,t,n){if(!s)return;const r=e.querySelector("#schema-status");let a;try{const i=q(s.xml);_(i,{taxScale:t,flatTax:n}),a=ke(i)}catch(i){a=[{path:"",message:i.message}]}if(a.length===0){r.className="schema-status ok",r.textContent="✓ Zgodne ze schematem KEDU 5.7";return}r.className="schema-status warn";const o=a.slice(0,5).map(i=>i.path?`${i.path}: ${i.message}`:i.message).join(" · ");r.textContent=`⚠ ${a.length} uwag względem schematu — ${o}${a.length>5?" …":""}`}function X(e,t){return`<tr class="added"><td>${e}</td><td class="val delta" colspan="3">+ ${f(t)}</td></tr>`}function ve(e){if(!s)return;const t=e.querySelector("#proj-bracket"),n=e.querySelector("#proj-table"),r=e.querySelector("#proj-transfer");if(s.revenue!==null){const o=Z(s.revenue);t.value=String(E.indexOf(o))}function a(){if(!s)return;const o=E[Number(t.value)]??E[1],i=o.contributionGr,u=s.social+s.laborFund+i;n.innerHTML=`
      <tr class="head"><td>Składnik</td><td class="val">Kwota (zł)</td></tr>
      <tr><td>Składki społeczne (IV)</td><td class="val">${f(s.social)}</td></tr>
      <tr><td>Fundusz Pracy (VII)</td><td class="val">${f(s.laborFund)}</td></tr>
      <tr><td>Składka zdrowotna (${o.label})</td><td class="val">${f(i)}</td></tr>
      <tr class="total"><td>Razem do przelewu</td><td class="val after">${f(u)}</td></tr>
    `;const m=s.period||"—";r.innerHTML=`
      <div class="row"><span>Kwota przelewu</span><strong>${f(u)} zł</strong></div>
      <div class="row"><span>Opis (opcjonalny)</span><span>Składki ZUS ${m}</span></div>
      <p class="hint">Przelew na Twój <strong>indywidualny rachunek składkowy (NRS)</strong> — tytuł nie jest wymagany, ZUS rozksięgowuje wg numeru konta.
        <a href="https://eskladka.pl/Home" target="_blank" rel="noopener noreferrer">Sprawdź numer rachunku ZUS</a>.</p>
    `}t.addEventListener("change",a),a()}function Ie(e){if(!s)return;const t=e.querySelector("#brackets"),n=s.revenue!==null?Z(s.revenue):null,r='<tr class="head"><td>Próg (roczny przychód)</td><td class="val">Składka mies. (zł)</td></tr>',a=E.map(o=>{const i=n===o;return`<tr class="${i?"sel":""}">
      <td>${o.label}${i?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${f(o.contributionGr)}</td>
    </tr>`}).join("");t.innerHTML=r+a}function $e(e){const t=e.querySelector("#annual-form"),n=e.querySelector("#annual-income"),r=e.querySelector("#annual-months"),a=e.querySelector("#annual-year"),o=e.querySelector("#annual-year-info"),i=e.querySelector("#annual-files"),u=e.querySelector("#annual-files-info"),m=e.querySelector("#annual-paid"),h=e.querySelector("#annual-error"),c=e.querySelector("#annual-result");function d(){return Number(a.value)||V}function p(){h.classList.add("hidden");const k=d(),L=ne(k);o.textContent=`min. ${f(L)}/mies · ${H(k)}`;try{const I=n.value.trim()===""?0:j(n.value),z=Number(r.value.trim());if(!Number.isInteger(z)||z<1||z>12)throw new Error("Liczba miesięcy musi być z zakresu 1–12");const v=m.value.trim()===""?0:j(m.value);if(v<0)throw new Error("Wpłacone zaliczki nie mogą być ujemne");const x=ie(t.value,I,L,z),l=ce(x,v),y=l.balanceGr<0,w=l.balanceGr===0,$=w?"Rozliczone (saldo 0)":y?"Nadpłata (do zwrotu)":"Dopłata (do 20 maja)";c.innerHTML=`
        <tr class="head"><td>Pozycja</td><td class="val">Kwota (zł)</td></tr>
        <tr><td>Składka należna za rok składkowy</td><td class="val">${f(x)}</td></tr>
        <tr><td>Wpłacone zaliczki</td><td class="val">${f(v)}</td></tr>
        <tr class="total ${w?"":"chg"}"><td>${$}</td>
          <td class="val ${w?"":"after"}">${f(Math.abs(l.balanceGr))}</td></tr>
      `}catch(I){c.innerHTML="",h.textContent=I.message,h.classList.remove("hidden")}}async function g(){const k=Array.from(i.files??[]);if(k.length===0)return;const L=d(),I=[];let z=0;const v=[];for(const w of k)try{const $=q(await w.text()),D=b($,["I","p2","p2"]);if(!le(D,L)){v.push(D||w.name);continue}I.push({period:D,identifier:Number(b($,["I","p2","p1"])||"0"),healthGr:A($,"VI","p7")})}catch{z+=1}const{totalGr:x,months:l}=de(I);m.value=f(x),l.length>0&&(r.value=String(l.length));const y=[];l.length&&y.push(`${l.length}/12 mies. (${H(L)})`),v.length&&y.push(`poza rokiem: ${v.join(", ")}`),z&&y.push(`${z} plik(ów) nie wczytano`),u.textContent=y.length?y.join(" · "):"nie wczytano poprawnych DRA",p()}[t,n,r,m,a].forEach(k=>{k.addEventListener("input",p),k.addEventListener("change",p)}),i.addEventListener("change",()=>void g()),p()}function Se(e,t){if(!s)return;const n=q(s.xml);_(n,{taxScale:e,flatTax:t});const r=ee(n),a=new Blob([r],{type:"application/xml"}),o=URL.createObjectURL(a),i=document.createElement("a");i.href=o;const u=s.period||"DRA";i.download=`DRA_${u}_zdrowotna.xml`,i.click(),URL.revokeObjectURL(o)}const B=document.querySelector("#app");B&&ye(B);
