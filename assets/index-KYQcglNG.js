(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const D="http://www.zus.pl/2026/KEDU_5_7";function q(e){var r;const t=new DOMParser().parseFromString(e,"application/xml"),n=t.getElementsByTagName("parsererror")[0];if(n)throw new Error(`Nieprawidłowy XML: ${((r=n.textContent)==null?void 0:r.trim())??"błąd parsowania"}`);return G(t),t}function G(e){const t=e.getElementsByTagNameNS(D,"ZUSDRA")[0];if(!t)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return t}function M(e,t){for(const n of Array.from(e.children))if(n.localName===t)return n;return null}function W(e,t,n){const r=G(e),a=M(r,t);if(!a)throw new Error(`Brak bloku ${t} w DRA`);const o=M(a,n);if(!o)throw new Error(`Brak pola ${t}/${n} w DRA`);return o}function C(e,t,n){const r=G(e),a=M(r,t);return a?M(a,n)!==null:!1}function R(e){const t=e.replace(/\s/g,"").replace(",","."),n=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(t);if(!n)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,r,a,o=""]=n,s=(o+"00").slice(0,2),d=Number(a)*100+Number(s);return r==="-"?-d:d}function j(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const t=e<0?"-":"",n=Math.abs(e),r=Math.floor(n/100),a=n%100;return`${t}${r}.${String(a).padStart(2,"0")}`}const se=" ";function k(e){const t=j(e),n=t.startsWith("-"),[r,a]=(n?t.slice(1):t).split("."),o=r.replace(/\B(?=(\d{3})+(?!\d))/g,se);return`${n?"-":""}${o},${a}`}const le=["p2","p5","p7"];function E(e,t,n){return R(W(e,t,n).textContent??"0")}function H(e,t,n,r){W(e,t,n).textContent=j(r)}function ce(e,t){const n=(t.taxScale??0)+(t.flatTax??0);if(n<0)throw new Error("Kwota składki nie może być ujemna");const r=E(e,"VI","p7"),a=E(e,"IX","p2");for(const o of le)H(e,"VI",o,E(e,"VI",o)+n);return H(e,"IX","p2",a+n),Z(e),{delta:n,healthBefore:r,healthAfter:E(e,"VI","p7"),totalBefore:a,totalAfter:E(e,"IX","p2")}}const B={scale:{flag:"p1",income:"p2",base:"p3",due:"p4"},flat:{flag:"p5",income:"p6",base:"p7",due:"p8"}};function de(e,t){const n=[];if(t.scale&&n.push({section:B.scale,entry:t.scale}),t.flat&&n.push({section:B.flat,entry:t.flat}),n.length===0)return;const r=G(e);let a=Array.from(r.children).find(s=>s.localName==="XI")??null;if(!a){a=e.createElementNS(D,"XI");const s=Array.from(r.children).find(d=>d.localName==="XII"||d.localName==="XIII");r.insertBefore(a,s??null)}for(;a.firstChild;)a.removeChild(a.firstChild);const o=(s,d)=>{const m=e.createElementNS(D,s);m.textContent=d,a.appendChild(m)};for(const{section:s,entry:d}of n)o(s.flag,"true"),o(s.income,j(d.incomeGr)),o(s.base,j(d.podstawaGr)),o(s.due,j(d.contributionGr))}function Z(e){const t=E(e,"IV","p37"),n=E(e,"VI","p7"),r=C(e,"VII","p3")?E(e,"VII","p3"):0,a=E(e,"IX","p2"),o=t+n+r;if(a!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${j(a)}, oczekiwano ${j(o)} (społeczne ${j(t)} + zdrowotna ${j(n)} + FP ${j(r)})`)}function ue(e){const t=new XMLSerializer().serializeToString(e);return t.startsWith("<?xml")?t.endsWith(`
`)?t:t+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${t}
`}const X=.09,Y=.049,T=480600;function J(e){return Math.round(e*X)}function pe(e,t,n){const r=Math.max(t,n),o=Math.max(Math.round(r*(e==="scale"?X:Y)),J(n));return{podstawaGr:r,contributionGr:o}}const U={2022:{minMonthlyHealthGr:27090,minWageGr:301e3},2023:{minMonthlyHealthGr:31410,minWageGr:349e3},2024:{minMonthlyHealthGr:38178,minWageGr:424200},2025:{minMonthlyHealthGr:31496,minWageGr:466600},2026:{minMonthlyHealthGr:43254,minWageGr:480600}},V=2026;function me(e){return(U[e]??U[V]).minMonthlyHealthGr}const N=[{label:"przychód do 60 000 zł",revenueFromGr:0,revenueToGr:6e6,contributionGr:49835},{label:"przychód 60 000 – 300 000 zł",revenueFromGr:6e6,revenueToGr:3e7,contributionGr:83058},{label:"przychód powyżej 300 000 zł",revenueFromGr:3e7,revenueToGr:null,contributionGr:149504}];function Q(e){return N.find(t=>e>=t.revenueFromGr&&(t.revenueToGr===null||e<=t.revenueToGr))??N[N.length-1]}function fe(e,t,n,r){const o=Math.max(0,Math.round(t*(e==="scale"?X:Y))),s=n*r;return Math.max(o,s)}function _(e){return`luty ${e} – styczeń ${e+1}`}function he(e){return/^\d{4}-04$/.test(e)}function ke(e,t){const n=/^(\d{4})-(\d{2})$/.exec(e);if(!n)return!1;const r=Number(n[1]),a=Number(n[2]);return a<1||a>12?!1:r===t&&a>=2||r===t+1&&a===1}function ye(e,t){return{dueGr:e,paidGr:t,balanceGr:e-t}}function ze(e){const t=new Map;for(const a of e){if(!a.period)continue;const o=t.get(a.period);(!o||a.identifier>o.identifier)&&t.set(a.period,a)}const n=[...t.keys()].sort();return{totalGr:n.reduce((a,o)=>a+t.get(o).healthGr,0),months:n}}const we={k7:/^\d{1,5}\.\d{2}$/,k8:/^\d{1,6}\.\d{2}$/,k9:/^\d{1,7}\.\d{2}$/,k10:/^\d{1,8}\.\d{2}$/,k11:/^\d{1,9}\.\d{2}$/,k12:/^\d{1,10}\.\d{2}$/,k13:/^\d{1,11}\.\d{2}$/,b:/^(true|false|0|1)$/,d:/^\d{4}-\d{2}-\d{2}$/,ym:/^\d{4}-\d{2}$/,y:/^\d{4}$/,kod4:/^\d{4}$/,dig:/^\d$/,id2:/^\d{2}$/,l6:/^\d{1,6}$/,wyp:/^\d{1,2}\.\d{2}$/};function P(e,t,n,r={}){const a={};for(let o=e;o<=t;o++)a[`p${o}`]=n;return{...a,...r}}const be=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII"],ge={I:{p1:"dig",p2:{p1:"id2",p2:"ym"},p3:"d",p4:"s20",p5:"s12"},II:{p1:"s10",p2:"s14",p3:"s11",p4:"s1",p5:"s9",p6:"s31",p7:"s31",p8:"s22",p9:"d"},III:{p1:"l6",p2:"s1",p3:"wyp"},IV:P(1,36,"k11",{p37:"k12"}),V:P(1,4,"k11",{p5:"k12"}),VI:{...P(1,5,"k11"),p6:"k10",p7:"k12"},VII:{p1:"k11",p2:"k11",p3:"k12"},VIII:{p1:"l6",p2:"l6",p3:"k12"},IX:{p1:"k13",p2:"k13"},X:{p1:{p1:"kod4",p2:"dig",p3:"dig"},p2:"k10",p3:"k10",p4:"k10",p5:"k10",p6:"s1"},XI:{p1:"b",p2:"k10",p3:"k10",p4:"k10",p5:"b",p6:"k10",p7:"k10",p8:"k10",p9:"b",p10:"k10",p11:"k10",p12:"b",p13:"k10",p14:"b",p15:"k10",p16:"k10",p17:"k10",p18:"b",p19:"k10",p20:"k10"},XII:{p1:"y",p2:"b",p3:"b",p4:"b",p5:"k11",p6:"b",p7:"k11",p8:"k11",p9:"k11",p10:"k11",p11:"k11",p12:"k11",p13:"b",p14:"k11",p15:"b",p16:"k11",p17:"k11",p18:"k11",p19:"k11",p20:"k11",p21:"b",p22:"k11",p23:"k11",p24:"k11",p25:"k11",p26:"k11",p27:"k11",p28:"k11",p29:"k11"},XIII:{p1:"d"}},ve=new Set(["identyfikacja.PL","identyfikacja.UB","naglowek.DP","cechy.DP","cechy.BL","stopka.DP"]);function Ie(e,t,n,r){if(t[0]==="s"){const o=Number(t.slice(1));Number.isFinite(o)&&e.length>o&&r.push({path:n,message:`wartość za długa (max ${o} znaków)`});return}const a=we[t];a&&(a.test(e.trim())||r.push({path:n,message:`"${e}" nie pasuje do formatu (${t})`}))}function ee(e,t,n,r){for(const a of Array.from(e.children)){const o=t[a.localName];if(o===void 0){r.push({path:`${n}/${a.localName}`,message:"nieznane pole"});continue}typeof o=="object"?a.children.length&&ee(a,o,`${n}/${a.localName}`,r):Ie(a.textContent??"",o,`${n}/${a.localName}`,r)}}function $e(e){const t=[],n=e.documentElement;if(!n||n.localName!=="KEDU")return[{path:"/",message:"brak elementu głównego KEDU"}];n.namespaceURI!==D&&t.push({path:"KEDU",message:`nieoczekiwany namespace (${n.namespaceURI??"brak"})`});const r=Array.from(n.children).filter(a=>a.localName==="ZUSDRA");if(r.length===0)return t.push({path:"KEDU",message:"brak dokumentu ZUSDRA"}),t;if(r.forEach((a,o)=>{const s=r.length>1?`ZUSDRA[${o+1}]`:"ZUSDRA";let d=-1;for(const m of Array.from(a.children)){const h=m.localName;if(ve.has(h))continue;const l=ge[h];if(!l){t.push({path:`${s}/${h}`,message:"nieznany blok"});continue}const u=be.indexOf(h);u<d&&t.push({path:`${s}/${h}`,message:"blok poza kolejnością"}),d=Math.max(d,u),ee(m,l,`${s}/${h}`,t)}}),C(e,"IV","p37")&&C(e,"VI","p7")&&C(e,"IX","p2"))try{Z(e)}catch(a){t.push({path:"ZUSDRA/IX/p2",message:a.message})}return t}function Se(e){return e.replace(/\s/g,"").replace(/^PL/i,"")}function je(e){let t=0;for(const n of e)t=(t*10+(n.charCodeAt(0)-48))%97;return t}function xe(e){return/^\d{26}$/.test(e)?je(e.slice(2)+"2521"+e.slice(0,2))===1:!1}function Ee(e,t){return/^\d{10}$/.test(t)&&e.slice(-10)===t}function O(e){const t=/^(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})$/.exec(e);return t?t.slice(1).join(" "):e}let i=null;function S(e,t){var r;let n=G(e);for(const a of t)n=n?Array.from(n.children).find(o=>o.localName===a)??null:null;return((r=n==null?void 0:n.textContent)==null?void 0:r.trim())??""}function A(e,t,n){const r=S(e,[t,n]);return r?R(r):0}function Ne(e){const t=Object.keys(U).map(Number).sort((l,u)=>u-l).map(l=>`<option value="${l}"${l===V?" selected":""}>${l}</option>`).join(""),n=N.map((l,u)=>`<option value="${u}">${l.label} — ${k(l.contributionGr)} zł/mies</option>`).join("");e.innerHTML=`
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

        <div id="monthly-edit">
        <h2>Dodaj składkę zdrowotną (za ten miesiąc)</h2>

        <div class="form-row wage">
          <label for="min-wage">Minimalne wynagrodzenie 2026 (zł)</label>
          <input type="text" id="min-wage" inputmode="decimal" value="${k(T)}" />
          <span class="hint">nie mniej niż ${k(T)}; wpływa na minimum składki</span>
        </div>

        <p class="hint calc-note">Podaj <strong>kwotę dochodu</strong> za miesiąc poprzedni — podstawę
          (nie mniej niż min. wynagrodzenie) i należną składkę policzymy sami. Puste = dochód 0 → minimum.</p>
        <div class="form-row">
          <label class="chk"><input type="checkbox" id="tax-scale-active" /> Skala podatkowa (9%)</label>
          <input type="text" id="tax-scale-amount" inputmode="decimal" placeholder="dochód (zł)" disabled />
          <span class="hint" id="tax-scale-hint"></span>
        </div>
        <div class="form-row">
          <label class="chk"><input type="checkbox" id="flat-tax-active" /> Podatek liniowy (4,9%)</label>
          <input type="text" id="flat-tax-amount" inputmode="decimal" placeholder="dochód (zł)" disabled />
          <span class="hint" id="flat-tax-hint"></span>
        </div>
        <div class="error hidden" id="input-error"></div>

        <h2>Podgląd: przed → po</h2>
        <table class="tbl preview" id="preview"></table>

        <div class="schema-status" id="schema-status"></div>
        <button id="download" disabled>Pobierz zmodyfikowane DRA</button>
        </div>

        <div id="monthly-projection">
        <h2 id="proj-title">Prognoza przelewu (ryczałt — wyższy próg)</h2>
        <p class="hint calc-note" id="proj-note">Ile zapłacisz miesięcznie, gdy wejdziesz na wyższy próg.
          Nie zmienia pliku — to planowanie, żeby nie zaskoczyła Cię majowa dopłata.</p>
        <div class="form-row" id="proj-bracket-row">
          <label for="proj-bracket">Przewidywany próg</label>
          <select id="proj-bracket">${n}</select>
          <span class="hint">próg wg rocznego przychodu</span>
        </div>
        <div class="form-row">
          <label for="nrs-input">Twój rachunek ZUS (NRS)</label>
          <input type="text" id="nrs-input" inputmode="numeric" placeholder="26 cyfr — wklej raz, zapamiętamy" />
          <span class="hint" id="nrs-status"></span>
        </div>
        <table class="tbl" id="proj-table"></table>
        <div class="proj-transfer" id="proj-transfer"></div>
        </div>
      </div>

      <div class="card note">
        <strong>Zakres:</strong> z podanego dochodu liczymy podstawę (≥ min. wynagrodzenie) i składkę,
        wpisujemy je do bloku VI (składka zdrowotna), podnosimy sumę do zapłaty (blok IX) i zaznaczamy
        <strong>formę opodatkowania</strong> w bloku XI — bez tego ZUS odrzuca plik. To składka
        <strong>za ten miesiąc</strong>. Kwoty roczne policz w zakładce „Rozliczenie roczne".
        Przed wysyłką zweryfikuj wynik (np. w programie Płatnik).
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
  `;const r=e.querySelector("#file"),a=e.querySelector("#drop"),o=e.querySelector("#load-error"),s=e.querySelector("#editor"),d=e.querySelector("#editor-empty");function m(l){e.querySelectorAll(".tab").forEach(u=>u.classList.toggle("active",u.dataset.tab===l)),e.querySelector("#tab-monthly").classList.toggle("hidden",l!=="monthly"),e.querySelector("#tab-annual").classList.toggle("hidden",l!=="annual")}e.querySelectorAll(".tab").forEach(l=>l.addEventListener("click",()=>m(l.dataset.tab??"monthly"))),e.querySelector("#goto-annual").addEventListener("click",()=>m("annual")),r.addEventListener("change",()=>{var u;const l=(u=r.files)==null?void 0:u[0];l&&h(l)}),["dragenter","dragover"].forEach(l=>a.addEventListener(l,u=>{u.preventDefault(),a.classList.add("drag")})),["dragleave","drop"].forEach(l=>a.addEventListener(l,u=>{u.preventDefault(),a.classList.remove("drag")})),a.addEventListener("drop",l=>{var f,b;const u=(b=(f=l.dataTransfer)==null?void 0:f.files)==null?void 0:b[0];u&&h(u)}),Pe(e);async function h(l){o.classList.add("hidden");try{const u=await l.text(),f=q(u);if(G(f).namespaceURI!==D)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");const b=S(f,["XI","p13"]),z=S(f,["XI","p16"]);i={xml:u,period:S(f,["I","p2","p2"]),payerName:Re(f),nip:S(f,["II","p1"]),regon:S(f,["II","p2"]),social:A(f,"IV","p37"),health:A(f,"VI","p7"),laborFund:A(f,"VII","p3"),total:A(f,"IX","p2"),annual:z?R(z):null,revenue:b?R(b):null},Le(e),s.classList.remove("hidden"),d.classList.add("hidden"),m("monthly")}catch(u){i=null,s.classList.add("hidden"),d.classList.remove("hidden"),o.textContent=`Nie udało się wczytać pliku: ${u.message}`,o.classList.remove("hidden")}}}function Re(e){const t=S(e,["II","p6"]),n=S(e,["II","p7"]),r=S(e,["II","p8"]);return[t,[r,n].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function te(e){var t,n;return(((t=e.scale)==null?void 0:t.contributionGr)??0)+(((n=e.flat)==null?void 0:n.contributionGr)??0)}function ne(e,t){var n,r;ce(e,{taxScale:(n=t.scale)==null?void 0:n.contributionGr,flatTax:(r=t.flat)==null?void 0:r.contributionGr}),de(e,{scale:t.scale,flat:t.flat})}function Le(e){if(!i)return;const t=e.querySelector("#meta"),n=[i.nip?`NIP ${i.nip}`:"",i.regon?`REGON ${i.regon}`:"",i.period?`okres ${i.period}`:""].filter(Boolean);t.innerHTML=`
    <div class="meta-firma"><strong>${i.payerName||"płatnik"}</strong></div>
    <div class="meta-id">${n.join(" · ")}</div>
  `,qe(e);const r=Te(e),a=e.querySelector("#min-wage"),o=e.querySelector("#tax-scale-active"),s=e.querySelector("#tax-scale-amount"),d=e.querySelector("#tax-scale-hint"),m=e.querySelector("#flat-tax-active"),h=e.querySelector("#flat-tax-amount"),l=e.querySelector("#flat-tax-hint"),u=e.querySelector("#input-error"),f=e.querySelector("#preview"),b=e.querySelector("#download"),z=he(i.period);if(e.querySelector("#april-warn").classList.toggle("hidden",!z),e.querySelector("#monthly-edit").classList.toggle("hidden",z),e.querySelector("#monthly-projection").classList.toggle("hidden",z),z)return;function p(){o.checked||(s.value=""),m.checked||(h.value=""),s.disabled=!o.checked,h.disabled=!m.checked}function w(){const c=R(a.value);if(c<T)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${k(T)} zł`);return c}function y(c,g,L,re){if(!c)return null;const F=g.trim()===""?0:R(g),{podstawaGr:oe,contributionGr:ie}=pe(L,F,re);return{incomeGr:F,podstawaGr:oe,contributionGr:ie}}function v(){const c=w();return{minimumGr:J(c),minWageGr:c,scale:y(o.checked,s.value,"scale",c),flat:y(m.checked,h.value,"flat",c)}}function x(c,g){return c?`podstawa ${k(c.podstawaGr)} → składka ${k(c.contributionGr)}`:`puste = minimum ${k(g)}`}function I(c){f.innerHTML="",b.disabled=!0,u.textContent=c,u.classList.remove("hidden")}function $(){if(!i)return;u.classList.add("hidden");let c;try{c=v()}catch(L){I(L.message);return}d.textContent=x(c.scale,c.minimumGr),l.textContent=x(c.flat,c.minimumGr);const g=te(c);Ge(f,g,c),Ae(e,c),r(c),b.disabled=g===0}[o,m].forEach(c=>c.addEventListener("change",()=>{p(),$()})),[a,s,h].forEach(c=>c.addEventListener("input",$)),b.addEventListener("click",()=>{let c;try{c=v()}catch(g){I(g.message);return}Ue(c)}),p(),$()}function Ge(e,t,n){if(!i)return;const r=[],a=(s,d,m,h={})=>{const l=d!==m;return`<tr class="${h.total?"total":""} ${l?"chg":""}">
      <td>${s}</td>
      <td class="val">${k(d)}</td>
      <td class="arr">→</td>
      <td class="val ${l?"after":""}">${k(m)}</td>
    </tr>`};r.push('<tr class="head"><td>Pozycja</td><td class="val">przed (zł)</td><td class="arr"></td><td class="val">po (zł)</td></tr>');const o=(s,d)=>De(`Forma XI: ${s} ☒ (dochód ${k(d.incomeGr)} · podstawa ${k(d.podstawaGr)})`,d.contributionGr);n.scale&&r.push(o("skala",n.scale)),n.flat&&r.push(o("liniówka",n.flat)),r.push(a("Składki społeczne (IV)",i.social,i.social)),r.push(a("Składka zdrowotna (VI)",i.health,i.health+t)),r.push(a("Fundusz Pracy (VII)",i.laborFund,i.laborFund)),r.push(a("Suma do zapłaty (IX)",i.total,i.total+t,{total:!0})),i.annual!==null&&r.push(a("Roczne rozliczenie zdrow. (XI)",i.annual,i.annual)),e.innerHTML=r.join("")}function Ae(e,t){if(!i)return;const n=e.querySelector("#schema-status");let r;try{const o=q(i.xml);ne(o,t),r=$e(o)}catch(o){r=[{path:"",message:o.message}]}if(r.length===0){n.className="schema-status ok",n.textContent="✓ Zgodne ze schematem KEDU 5.7";return}n.className="schema-status warn";const a=r.slice(0,5).map(o=>o.path?`${o.path}: ${o.message}`:o.message).join(" · ");n.textContent=`⚠ ${r.length} uwag względem schematu — ${a}${r.length>5?" …":""}`}function De(e,t){return`<tr class="form-xi"><td>${e}</td><td class="val" colspan="3">składka ${k(t)}</td></tr>`}const ae="dra.nrs";function Ce(){try{return localStorage.getItem(ae)??""}catch{return""}}function Me(e){try{localStorage.setItem(ae,e)}catch{}}function Te(e){const t=e.querySelector("#proj-bracket"),n=e.querySelector("#proj-bracket-row"),r=e.querySelector("#proj-title"),a=e.querySelector("#proj-note"),o=e.querySelector("#proj-table"),s=e.querySelector("#proj-transfer"),d=e.querySelector("#nrs-input"),m=e.querySelector("#nrs-status");if(i&&i.revenue!==null){const p=Q(i.revenue);t.value=String(N.indexOf(p))}const h=Ce();h&&!d.value&&(d.value=O(h));let l=null;function u(){const p=Se(d.value),w=p==="",y=xe(p);return{nrb:p,valid:y,matches:y&&Ee(p,(i==null?void 0:i.nip)??""),empty:w}}function f(p){if(p&&(p.scale||p.flat)){const y=[p.scale&&"skala",p.flat&&"liniówka"].filter(Boolean).join(" + ");return{gr:te(p),label:y,form:!0}}const w=N[Number(t.value)]??N[1];return{gr:w.contributionGr,label:w.label,form:!1}}function b(){if(!i)return;const p=f(l);n.classList.toggle("hidden",p.form),r.textContent=p.form?"Prognoza przelewu (skala/liniówka)":"Prognoza przelewu (ryczałt — wyższy próg)",a.textContent=p.form?"Składka zdrowotna wg zaznaczonej formy i dochodu powyżej. Nie zmienia pliku — to planowanie.":"Ile zapłacisz miesięcznie, gdy wejdziesz na wyższy próg. Nie zmienia pliku — to planowanie, żeby nie zaskoczyła Cię majowa dopłata.";const w=i.social+i.laborFund+p.gr;o.innerHTML=`
      <tr class="head"><td>Składnik</td><td class="val">Kwota (zł)</td></tr>
      <tr><td>Składki społeczne (IV)</td><td class="val">${k(i.social)}</td></tr>
      <tr><td>Fundusz Pracy (VII)</td><td class="val">${k(i.laborFund)}</td></tr>
      <tr><td>Składka zdrowotna (${p.label})</td><td class="val">${k(p.gr)}</td></tr>
      <tr class="total"><td>Razem do przelewu</td><td class="val after">${k(w)}</td></tr>
    `;const y=i.period||"—",{nrb:v,valid:x}=u(),I=x?`<div class="row"><span>Rachunek ZUS (NRS)</span><strong>${O(v)}</strong></div>`:"";s.innerHTML=`
      <div class="row"><span>Kwota przelewu</span><strong>${k(w)} zł</strong></div>
      ${I}
      <div class="row"><span>Opis (opcjonalny)</span><span>Składki ZUS ${y}</span></div>
      <p class="hint">Przelew na Twój <strong>indywidualny rachunek składkowy (NRS)</strong> — tytuł nie jest wymagany.
        <a href="https://eskladka.pl/Home" target="_blank" rel="noopener noreferrer">Sprawdź numer rachunku dla NIP ${i.nip||"—"}</a>.</p>
    `}function z(){const{nrb:p,valid:w,matches:y,empty:v}=u();w&&Me(p),v?m.textContent="wklej raz — zapamiętamy w przeglądarce":w?y?m.textContent="✓ poprawny, zapisany":m.textContent="⚠ ostatnie 10 cyfr ≠ NIP z pliku — sprawdź":m.textContent="⚠ niepoprawny numer (26 cyfr / cyfra kontrolna)",b()}return t.addEventListener("change",b),d.addEventListener("input",z),z(),p=>{l=p,b()}}function qe(e){if(!i)return;const t=e.querySelector("#brackets"),n=i.revenue!==null?Q(i.revenue):null,r='<tr class="head"><td>Próg (roczny przychód)</td><td class="val">Składka mies. (zł)</td></tr>',a=N.map(o=>{const s=n===o;return`<tr class="${s?"sel":""}">
      <td>${o.label}${s?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${k(o.contributionGr)}</td>
    </tr>`}).join("");t.innerHTML=r+a}function Pe(e){const t=e.querySelector("#annual-form"),n=e.querySelector("#annual-income"),r=e.querySelector("#annual-months"),a=e.querySelector("#annual-year"),o=e.querySelector("#annual-year-info"),s=e.querySelector("#annual-files"),d=e.querySelector("#annual-files-info"),m=e.querySelector("#annual-paid"),h=e.querySelector("#annual-error"),l=e.querySelector("#annual-result");function u(){return Number(a.value)||V}function f(){h.classList.add("hidden");const z=u(),p=me(z);o.textContent=`min. ${k(p)}/mies · ${_(z)}`;try{const w=n.value.trim()===""?0:R(n.value),y=Number(r.value.trim());if(!Number.isInteger(y)||y<1||y>12)throw new Error("Liczba miesięcy musi być z zakresu 1–12");const v=m.value.trim()===""?0:R(m.value);if(v<0)throw new Error("Wpłacone zaliczki nie mogą być ujemne");const x=fe(t.value,w,p,y),I=ye(x,v),$=I.balanceGr<0,c=I.balanceGr===0,g=c?"Rozliczone (saldo 0)":$?"Nadpłata (do zwrotu)":"Dopłata (do 20 maja)";l.innerHTML=`
        <tr class="head"><td>Pozycja</td><td class="val">Kwota (zł)</td></tr>
        <tr><td>Składka należna za rok składkowy</td><td class="val">${k(x)}</td></tr>
        <tr><td>Wpłacone zaliczki</td><td class="val">${k(v)}</td></tr>
        <tr class="total ${c?"":"chg"}"><td>${g}</td>
          <td class="val ${c?"":"after"}">${k(Math.abs(I.balanceGr))}</td></tr>
      `}catch(w){l.innerHTML="",h.textContent=w.message,h.classList.remove("hidden")}}async function b(){const z=Array.from(s.files??[]);if(z.length===0)return;const p=u(),w=[];let y=0;const v=[];for(const c of z)try{const g=q(await c.text()),L=S(g,["I","p2","p2"]);if(!ke(L,p)){v.push(L||c.name);continue}w.push({period:L,identifier:Number(S(g,["I","p2","p1"])||"0"),healthGr:A(g,"VI","p7")})}catch{y+=1}const{totalGr:x,months:I}=ze(w);m.value=k(x),I.length>0&&(r.value=String(I.length));const $=[];I.length&&$.push(`${I.length}/12 mies. (${_(p)})`),v.length&&$.push(`poza rokiem: ${v.join(", ")}`),y&&$.push(`${y} plik(ów) nie wczytano`),d.textContent=$.length?$.join(" · "):"nie wczytano poprawnych DRA",f()}[t,n,r,m,a].forEach(z=>{z.addEventListener("input",f),z.addEventListener("change",f)}),s.addEventListener("change",()=>void b()),f()}function Ue(e){if(!i)return;const t=q(i.xml);ne(t,e);const n=ue(t),r=new Blob([n],{type:"application/xml"}),a=URL.createObjectURL(r),o=document.createElement("a");o.href=a;const s=i.period||"DRA";o.download=`DRA_${s}_zdrowotna.xml`,o.click(),URL.revokeObjectURL(a)}const K=document.querySelector("#app");K&&Ne(K);
