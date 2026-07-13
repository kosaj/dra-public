(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();const A="http://www.zus.pl/2026/KEDU_5_7",ue=/KEDU_(\d+)_(\d+)/;function pe(e){const t=e.documentElement;if(!t||t.localName!=="KEDU")throw new Error("To nie jest plik KEDU — brak elementu głównego <KEDU>.");if(t.namespaceURI!==A){const n=t.namespaceURI?ue.exec(t.namespaceURI):null;throw n?new Error(`Plik jest w formacie KEDU ${n[1]}.${n[2]}, a program obsługuje tylko KEDU 5.7.`):new Error(`Nieobsługiwany format pliku (namespace: ${t.namespaceURI??"brak"}). Program obsługuje tylko KEDU 5.7.`)}}function U(e){var o;const t=new DOMParser().parseFromString(e,"application/xml"),n=t.getElementsByTagName("parsererror")[0];if(n)throw new Error(`Nieprawidłowy XML: ${((o=n.textContent)==null?void 0:o.trim())??"błąd parsowania"}`);return pe(t),M(t),t}function M(e){const t=e.getElementsByTagNameNS(A,"ZUSDRA")[0];if(!t)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return t}function C(e,t){for(const n of Array.from(e.children))if(n.localName===t)return n;return null}function Y(e,t,n){const o=M(e),a=C(o,t);if(!a)throw new Error(`Brak bloku ${t} w DRA`);const r=C(a,n);if(!r)throw new Error(`Brak pola ${t}/${n} w DRA`);return r}function L(e,t,n){const o=M(e),a=C(o,t);return a?C(a,n)!==null:!1}function N(e){const t=e.replace(/\s/g,"").replace(",","."),n=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(t);if(!n)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,o,a,r=""]=n,i=(r+"00").slice(0,2),p=Number(a)*100+Number(i);return o==="-"?-p:p}function G(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const t=e<0?"-":"",n=Math.abs(e),o=Math.floor(n/100),a=n%100;return`${t}${o}.${String(a).padStart(2,"0")}`}const me=" ";function k(e){const t=G(e),n=t.startsWith("-"),[o,a]=(n?t.slice(1):t).split("."),r=o.replace(/\B(?=(\d{3})+(?!\d))/g,me);return`${n?"-":""}${r},${a}`}function E(e,t,n){return N(Y(e,t,n).textContent??"0")}function q(e,t,n){return L(e,t,n)?E(e,t,n):0}function T(e,t,n,o){Y(e,t,n).textContent=G(o)}function J(e){const t=E(e,"IV","p37"),n=E(e,"VI","p7"),o=q(e,"VII","p3"),a=q(e,"VIII","p3"),r=q(e,"V","p5");return t+n+o+a-r}function fe(e,t){if(t.healthGr<0||t.podstawaGr<0)throw new Error("Kwota składki i podstawa nie mogą być ujemne");const n=E(e,"VI","p7"),o=E(e,"IX","p2");for(const r of["p2","p5","p7"])T(e,"VI",r,E(e,"VI",r)+t.healthGr);L(e,"X","p5")&&T(e,"X","p5",E(e,"X","p5")+t.podstawaGr);const a=J(e);return T(e,"IX","p2",a),Q(e),{delta:a-o,healthBefore:n,healthAfter:E(e,"VI","p7"),totalBefore:o,totalAfter:a}}const K={scale:{flag:"p1",income:"p2",base:"p3",due:"p4"},flat:{flag:"p5",income:"p6",base:"p7",due:"p8"}},he=Array.from({length:20},(e,t)=>`p${t+1}`);function ke(e,t){const n=[];if(t.scale&&n.push([K.scale,t.scale]),t.flat&&n.push([K.flat,t.flat]),n.length===0)return;const o=M(e);let a=Array.from(o.children).find(i=>i.localName==="XI")??null;if(!a){a=e.createElementNS(A,"XI");const i=Array.from(o.children).find(p=>p.localName==="XII"||p.localName==="XIII");o.insertBefore(a,i??null)}const r=new Map;for(const i of Array.from(a.children))r.set(i.localName,i.textContent??"");for(const[i,p]of n)r.set(i.flag,"true"),r.set(i.income,G(p.incomeGr)),r.set(i.base,G(p.podstawaGr)),r.set(i.due,G(p.contributionGr));for(;a.firstChild;)a.removeChild(a.firstChild);for(const i of he){if(!r.has(i))continue;const p=e.createElementNS(A,i);p.textContent=r.get(i),a.appendChild(p)}}function Q(e){const t=E(e,"IX","p2"),n=J(e);if(t!==n)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${G(t)}, oczekiwano ${G(n)} (IV/p37 + VI/p7 + VII/p3 + VIII/p3 − V/p5)`)}function ye(e){const t=new XMLSerializer().serializeToString(e);return t.startsWith("<?xml")?t.endsWith(`
`)?t:t+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${t}
`}const F=.09,ee=.049,P=480600;function te(e){return Math.round(e*F)}function we(e,t,n){const o=Math.max(t,n),r=Math.max(Math.round(o*(e==="scale"?F:ee)),te(n));return{podstawaGr:o,contributionGr:r}}const X={2022:{minMonthlyHealthGr:27090,minWageGr:301e3},2023:{minMonthlyHealthGr:31410,minWageGr:349e3},2024:{minMonthlyHealthGr:38178,minWageGr:424200},2025:{minMonthlyHealthGr:31496,minWageGr:466600},2026:{minMonthlyHealthGr:43254,minWageGr:480600}},_=2026;function ze(e){return(X[e]??X[_]).minMonthlyHealthGr}const x=[{label:"przychód do 60 000 zł",revenueFromGr:0,revenueToGr:6e6,contributionGr:49835},{label:"przychód 60 000 – 300 000 zł",revenueFromGr:6e6,revenueToGr:3e7,contributionGr:83058},{label:"przychód powyżej 300 000 zł",revenueFromGr:3e7,revenueToGr:null,contributionGr:149504}];function ne(e){return x.find(t=>e>=t.revenueFromGr&&(t.revenueToGr===null||e<=t.revenueToGr))??x[x.length-1]}function be(e,t,n,o){const r=Math.max(0,Math.round(t*(e==="scale"?F:ee))),i=n*o;return Math.max(r,i)}function O(e){return`luty ${e} – styczeń ${e+1}`}function ge(e){return/^\d{4}-04$/.test(e)}function ve(e,t){const n=/^(\d{4})-(\d{2})$/.exec(e);if(!n)return!1;const o=Number(n[1]),a=Number(n[2]);return a<1||a>12?!1:o===t&&a>=2||o===t+1&&a===1}function Ie(e,t){return{dueGr:e,paidGr:t,balanceGr:e-t}}function $e(e){const t=new Map;for(const a of e){if(!a.period)continue;const r=t.get(a.period);(!r||a.identifier>r.identifier)&&t.set(a.period,a)}const n=[...t.keys()].sort();return{totalGr:n.reduce((a,r)=>a+t.get(r).healthGr,0),months:n}}const Se={k7:/^\d{1,5}\.\d{2}$/,k8:/^\d{1,6}\.\d{2}$/,k9:/^\d{1,7}\.\d{2}$/,k10:/^\d{1,8}\.\d{2}$/,k11:/^\d{1,9}\.\d{2}$/,k12:/^\d{1,10}\.\d{2}$/,k13:/^\d{1,11}\.\d{2}$/,b:/^(true|false|0|1)$/,d:/^\d{4}-\d{2}-\d{2}$/,ym:/^\d{4}-\d{2}$/,y:/^\d{4}$/,kod4:/^\d{4}$/,dig:/^\d$/,id2:/^\d{2}$/,l6:/^\d{1,6}$/,wyp:/^\d{1,2}\.\d{2}$/};function V(e,t,n,o={}){const a={};for(let r=e;r<=t;r++)a[`p${r}`]=n;return{...a,...o}}const je=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII"],Ee={I:{p1:"dig",p2:{p1:"id2",p2:"ym"},p3:"d",p4:"s20",p5:"s12"},II:{p1:"s10",p2:"s14",p3:"s11",p4:"s1",p5:"s9",p6:"s31",p7:"s31",p8:"s22",p9:"d"},III:{p1:"l6",p2:"s1",p3:"wyp"},IV:V(1,36,"k11",{p37:"k12"}),V:V(1,4,"k11",{p5:"k12"}),VI:{...V(1,5,"k11"),p6:"k10",p7:"k12"},VII:{p1:"k11",p2:"k11",p3:"k12"},VIII:{p1:"l6",p2:"l6",p3:"k12"},IX:{p1:"k13",p2:"k13"},X:{p1:{p1:"kod4",p2:"dig",p3:"dig"},p2:"k10",p3:"k10",p4:"k10",p5:"k10",p6:"s1"},XI:{p1:"b",p2:"k10",p3:"k10",p4:"k10",p5:"b",p6:"k10",p7:"k10",p8:"k10",p9:"b",p10:"k10",p11:"k10",p12:"b",p13:"k10",p14:"b",p15:"k10",p16:"k10",p17:"k10",p18:"b",p19:"k10",p20:"k10"},XII:{p1:"y",p2:"b",p3:"b",p4:"b",p5:"k11",p6:"b",p7:"k11",p8:"k11",p9:"k11",p10:"k11",p11:"k11",p12:"k11",p13:"b",p14:"k11",p15:"b",p16:"k11",p17:"k11",p18:"k11",p19:"k11",p20:"k11",p21:"b",p22:"k11",p23:"k11",p24:"k11",p25:"k11",p26:"k11",p27:"k11",p28:"k11",p29:"k11"},XIII:{p1:"d"}},xe=new Set(["identyfikacja.PL","identyfikacja.UB","naglowek.DP","cechy.DP","cechy.BL","stopka.DP"]);function Re(e,t,n,o){if(t[0]==="s"){const r=Number(t.slice(1));Number.isFinite(r)&&e.length>r&&o.push({path:n,message:`wartość za długa (max ${r} znaków)`});return}const a=Se[t];a&&(a.test(e.trim())||o.push({path:n,message:`"${e}" nie pasuje do formatu (${t})`}))}function ae(e,t,n,o){for(const a of Array.from(e.children)){const r=t[a.localName];if(r===void 0){o.push({path:`${n}/${a.localName}`,message:"nieznane pole"});continue}typeof r=="object"?a.children.length&&ae(a,r,`${n}/${a.localName}`,o):Re(a.textContent??"",r,`${n}/${a.localName}`,o)}}function Ge(e){const t=[],n=e.documentElement;if(!n||n.localName!=="KEDU")return[{path:"/",message:"brak elementu głównego KEDU"}];n.namespaceURI!==A&&t.push({path:"KEDU",message:`nieoczekiwany namespace (${n.namespaceURI??"brak"})`});const o=Array.from(n.children).filter(a=>a.localName==="ZUSDRA");if(o.length===0)return t.push({path:"KEDU",message:"brak dokumentu ZUSDRA"}),t;if(o.forEach((a,r)=>{const i=o.length>1?`ZUSDRA[${r+1}]`:"ZUSDRA";let p=-1;for(const h of Array.from(a.children)){const f=h.localName;if(xe.has(f))continue;const c=Ee[f];if(!c){t.push({path:`${i}/${f}`,message:"nieznany blok"});continue}const d=je.indexOf(f);d<p&&t.push({path:`${i}/${f}`,message:"blok poza kolejnością"}),p=Math.max(p,d),ae(h,c,`${i}/${f}`,t)}}),L(e,"IV","p37")&&L(e,"VI","p7")&&L(e,"IX","p2"))try{Q(e)}catch(a){t.push({path:"ZUSDRA/IX/p2",message:a.message})}return t}function Ne(e){return e.replace(/\s/g,"").replace(/^PL/i,"")}function De(e){let t=0;for(const n of e)t=(t*10+(n.charCodeAt(0)-48))%97;return t}function Le(e){return/^\d{26}$/.test(e)?De(e.slice(2)+"2521"+e.slice(0,2))===1:!1}function Ae(e,t){return/^\d{10}$/.test(t)&&e.slice(-10)===t}function W(e){const t=/^(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})$/.exec(e);return t?t.slice(1).join(" "):e}let s=null;function S(e,t){var o;let n=M(e);for(const a of t)n=n?Array.from(n.children).find(r=>r.localName===a)??null:null;return((o=n==null?void 0:n.textContent)==null?void 0:o.trim())??""}function D(e,t,n){const o=S(e,[t,n]);return o?N(o):0}function Me(e){const t=Object.keys(X).map(Number).sort((c,d)=>d-c).map(c=>`<option value="${c}"${c===_?" selected":""}>${c}</option>`).join(""),n=x.map((c,d)=>`<option value="${d}">${c.label} — ${k(c.contributionGr)} zł/mies</option>`).join("");e.innerHTML=`
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
          <input type="text" id="min-wage" inputmode="decimal" value="${k(P)}" />
          <span class="hint">nie mniej niż ${k(P)}; wpływa na minimum składki</span>
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
        <strong>Zakres:</strong> bazowe DRA (ryczałt) zostaje bez zmian, a z podanego dochodu liczymy
        podstawę (≥ min. wynagrodzenie) i składkę drugiej działalności/spółki na zasadach ogólnych i
        <strong>dokładamy</strong> je do składki zdrowotnej (blok VI) oraz podstawy (blok X/05), podnosimy
        sumę do zapłaty (blok IX) i dopisujemy <strong>formę opodatkowania</strong> do bloku XI
        (obok ryczałtu). To składka <strong>za ten miesiąc</strong>. Kwoty roczne policz w zakładce
        „Rozliczenie roczne". Przed wysyłką zweryfikuj wynik (np. w programie Płatnik).
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
  `;const o=e.querySelector("#file"),a=e.querySelector("#drop"),r=e.querySelector("#load-error"),i=e.querySelector("#editor"),p=e.querySelector("#editor-empty");function h(c){e.querySelectorAll(".tab").forEach(d=>d.classList.toggle("active",d.dataset.tab===c)),e.querySelector("#tab-monthly").classList.toggle("hidden",c!=="monthly"),e.querySelector("#tab-annual").classList.toggle("hidden",c!=="annual")}e.querySelectorAll(".tab").forEach(c=>c.addEventListener("click",()=>h(c.dataset.tab??"monthly"))),e.querySelector("#goto-annual").addEventListener("click",()=>h("annual")),o.addEventListener("change",()=>{var d;const c=(d=o.files)==null?void 0:d[0];c&&f(c)}),["dragenter","dragover"].forEach(c=>a.addEventListener(c,d=>{d.preventDefault(),a.classList.add("drag")})),["dragleave","drop"].forEach(c=>a.addEventListener(c,d=>{d.preventDefault(),a.classList.remove("drag")})),a.addEventListener("drop",c=>{var m,b;const d=(b=(m=c.dataTransfer)==null?void 0:m.files)==null?void 0:b[0];d&&f(d)}),Be(e);async function f(c){r.classList.add("hidden");try{const d=await c.text(),m=U(d),b=S(m,["XI","p13"]);s={xml:d,period:S(m,["I","p2","p2"]),payerName:Ce(m),nip:S(m,["II","p1"]),regon:S(m,["II","p2"]),social:D(m,"IV","p37"),health:D(m,"VI","p7"),healthBase:D(m,"X","p5"),laborFund:D(m,"VII","p3"),total:D(m,"IX","p2"),revenue:b?N(b):null},Pe(e),i.classList.remove("hidden"),p.classList.add("hidden"),h("monthly")}catch(d){s=null,i.classList.add("hidden"),p.classList.remove("hidden"),r.textContent=`Nie udało się wczytać pliku: ${d.message}`,r.classList.remove("hidden")}}}function Ce(e){const t=S(e,["II","p6"]),n=S(e,["II","p7"]),o=S(e,["II","p8"]);return[t,[o,n].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function B(e){var t,n;return(((t=e.scale)==null?void 0:t.contributionGr)??0)+(((n=e.flat)==null?void 0:n.contributionGr)??0)}function re(e){var t,n;return(((t=e.scale)==null?void 0:t.podstawaGr)??0)+(((n=e.flat)==null?void 0:n.podstawaGr)??0)}function oe(e){return e.scale!==null||e.flat!==null}function ie(e,t){oe(t)&&(fe(e,{healthGr:B(t),podstawaGr:re(t)}),ke(e,{scale:t.scale,flat:t.flat}))}function Pe(e){if(!s)return;const t=e.querySelector("#meta"),n=[s.nip?`NIP ${s.nip}`:"",s.regon?`REGON ${s.regon}`:"",s.period?`okres ${s.period}`:""].filter(Boolean);t.innerHTML=`
    <div class="meta-firma"><strong>${s.payerName||"płatnik"}</strong></div>
    <div class="meta-id">${n.join(" · ")}</div>
  `,_e(e);const o=Fe(e),a=e.querySelector("#min-wage"),r=e.querySelector("#tax-scale-active"),i=e.querySelector("#tax-scale-amount"),p=e.querySelector("#tax-scale-hint"),h=e.querySelector("#flat-tax-active"),f=e.querySelector("#flat-tax-amount"),c=e.querySelector("#flat-tax-hint"),d=e.querySelector("#input-error"),m=e.querySelector("#preview"),b=e.querySelector("#download"),w=ge(s.period);if(e.querySelector("#april-warn").classList.toggle("hidden",!w),e.querySelector("#monthly-edit").classList.toggle("hidden",w),e.querySelector("#monthly-projection").classList.toggle("hidden",w),w)return;function u(){r.checked||(i.value=""),h.checked||(f.value=""),i.disabled=!r.checked,f.disabled=!h.checked}function z(){const l=N(a.value);if(l<P)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${k(P)} zł`);return l}function y(l,v,R,le){if(!l)return null;const H=v.trim()===""?0:N(v),{podstawaGr:ce,contributionGr:de}=we(R,H,le);return{incomeGr:H,podstawaGr:ce,contributionGr:de}}function g(){const l=z();return{minimumGr:te(l),minWageGr:l,scale:y(r.checked,i.value,"scale",l),flat:y(h.checked,f.value,"flat",l)}}function j(l,v){if(!l)return`puste = minimum ${k(v)}`;const R=l.contributionGr===v?" (minimum)":"";return`podstawa ${k(l.podstawaGr)} → składka ${k(l.contributionGr)}${R}`}function I(l){m.innerHTML="",b.disabled=!0,d.textContent=l,d.classList.remove("hidden")}function $(){if(!s)return;d.classList.add("hidden");let l;try{l=g()}catch(v){I(v.message);return}p.textContent=j(l.scale,l.minimumGr),c.textContent=j(l.flat,l.minimumGr),Ue(m,l),qe(e,l),o(l),b.disabled=!oe(l)}[r,h].forEach(l=>l.addEventListener("change",()=>{u(),$()})),[a,i,f].forEach(l=>l.addEventListener("input",$)),b.addEventListener("click",()=>{let l;try{l=g()}catch(v){I(v.message);return}He(l)}),u(),$()}function Ue(e,t){if(!s)return;const n=[],o=(c,d,m,b={})=>{const w=d!==m;return`<tr class="${b.total?"total":""} ${w?"chg":""}">
      <td>${c}</td>
      <td class="val">${k(d)}</td>
      <td class="arr">→</td>
      <td class="val ${w?"after":""}">${k(m)}</td>
    </tr>`},a=B(t),r=re(t),i=s.health+a,p=s.healthBase+r,h=s.total+a;n.push('<tr class="head"><td>Pozycja</td><td class="val">przed (zł)</td><td class="arr"></td><td class="val">po (zł)</td></tr>');const f=(c,d)=>Te(`Forma XI: ${c} ☒ (dochód ${k(d.incomeGr)} · podstawa ${k(d.podstawaGr)})`,d.contributionGr);t.scale&&n.push(f("skala",t.scale)),t.flat&&n.push(f("liniówka",t.flat)),n.push(o("Składki społeczne (IV)",s.social,s.social)),n.push(o("Podstawa zdrowotna (X/05)",s.healthBase,p)),n.push(o("Składka zdrowotna (VI)",s.health,i)),n.push(o("Fundusz Pracy (VII)",s.laborFund,s.laborFund)),n.push(o("Suma do zapłaty (IX)",s.total,h,{total:!0})),e.innerHTML=n.join("")}function qe(e,t){if(!s)return;const n=e.querySelector("#schema-status");let o;try{const r=U(s.xml);ie(r,t),o=Ge(r)}catch(r){o=[{path:"",message:r.message}]}if(o.length===0){n.className="schema-status ok",n.textContent="✓ Zgodne ze schematem KEDU 5.7";return}n.className="schema-status warn";const a=o.slice(0,5).map(r=>r.path?`${r.path}: ${r.message}`:r.message).join(" · ");n.textContent=`⚠ ${o.length} uwag względem schematu — ${a}${o.length>5?" …":""}`}function Te(e,t){return`<tr class="form-xi"><td>${e}</td><td class="val" colspan="3">składka ${k(t)}</td></tr>`}const se="dra.nrs";function Ve(){try{return localStorage.getItem(se)??""}catch{return""}}function Xe(e){try{localStorage.setItem(se,e)}catch{}}function Fe(e){const t=e.querySelector("#proj-bracket"),n=e.querySelector("#proj-bracket-row"),o=e.querySelector("#proj-title"),a=e.querySelector("#proj-note"),r=e.querySelector("#proj-table"),i=e.querySelector("#proj-transfer"),p=e.querySelector("#nrs-input"),h=e.querySelector("#nrs-status");if(s&&s.revenue!==null){const u=ne(s.revenue);t.value=String(x.indexOf(u))}const f=Ve();f&&!p.value&&(p.value=W(f));let c=null;function d(){const u=Ne(p.value),z=u==="",y=Le(u);return{nrb:u,valid:y,matches:y&&Ae(u,(s==null?void 0:s.nip)??""),empty:z}}function m(u){if(u&&(u.scale||u.flat)){const y=[u.scale&&"skala",u.flat&&"liniówka"].filter(Boolean).join(" + ");return{gr:B(u),label:y,form:!0}}const z=x[Number(t.value)]??x[1];return{gr:z.contributionGr,label:z.label,form:!1}}function b(){if(!s)return;const u=m(c);n.classList.toggle("hidden",u.form),o.textContent=u.form?"Prognoza przelewu (skala/liniówka)":"Prognoza przelewu (ryczałt — wyższy próg)",a.textContent=u.form?"Rzeczywisty przelew: składka zdrowotna z pliku (ryczałt) + dołożona skala/liniówka (= suma do zapłaty).":"Ile zapłacisz miesięcznie, gdy wejdziesz na wyższy próg. Nie zmienia pliku — to planowanie, żeby nie zaskoczyła Cię majowa dopłata.";const z=u.form?s.health+u.gr:u.gr,y=u.form?`ryczałt + ${u.label}`:u.label,g=s.social+s.laborFund+z;r.innerHTML=`
      <tr class="head"><td>Składnik</td><td class="val">Kwota (zł)</td></tr>
      <tr><td>Składki społeczne (IV)</td><td class="val">${k(s.social)}</td></tr>
      <tr><td>Fundusz Pracy (VII)</td><td class="val">${k(s.laborFund)}</td></tr>
      <tr><td>Składka zdrowotna (${y})</td><td class="val">${k(z)}</td></tr>
      <tr class="total"><td>Razem do przelewu</td><td class="val after">${k(g)}</td></tr>
    `;const j=s.period||"—",{nrb:I,valid:$}=d(),l=$?`<div class="row"><span>Rachunek ZUS (NRS)</span><strong>${W(I)}</strong></div>`:"";i.innerHTML=`
      <div class="row"><span>Kwota przelewu</span><strong>${k(g)} zł</strong></div>
      ${l}
      <div class="row"><span>Opis (opcjonalny)</span><span>Składki ZUS ${j}</span></div>
      <p class="hint">Przelew na Twój <strong>indywidualny rachunek składkowy (NRS)</strong> — tytuł nie jest wymagany.
        <a href="https://eskladka.pl/Home" target="_blank" rel="noopener noreferrer">Sprawdź numer rachunku dla NIP ${s.nip||"—"}</a>.</p>
    `}function w(){const{nrb:u,valid:z,matches:y,empty:g}=d();z&&Xe(u),g?h.textContent="wklej raz — zapamiętamy w przeglądarce":z?y?h.textContent="✓ poprawny, zapisany":h.textContent="⚠ ostatnie 10 cyfr ≠ NIP z pliku — sprawdź":h.textContent="⚠ niepoprawny numer (26 cyfr / cyfra kontrolna)",b()}return t.addEventListener("change",b),p.addEventListener("input",w),w(),u=>{c=u,b()}}function _e(e){if(!s)return;const t=e.querySelector("#brackets"),n=s.revenue!==null?ne(s.revenue):null,o='<tr class="head"><td>Próg (roczny przychód)</td><td class="val">Składka mies. (zł)</td></tr>',a=x.map(r=>{const i=n===r;return`<tr class="${i?"sel":""}">
      <td>${r.label}${i?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${k(r.contributionGr)}</td>
    </tr>`}).join("");t.innerHTML=o+a}function Be(e){const t=e.querySelector("#annual-form"),n=e.querySelector("#annual-income"),o=e.querySelector("#annual-months"),a=e.querySelector("#annual-year"),r=e.querySelector("#annual-year-info"),i=e.querySelector("#annual-files"),p=e.querySelector("#annual-files-info"),h=e.querySelector("#annual-paid"),f=e.querySelector("#annual-error"),c=e.querySelector("#annual-result");function d(){return Number(a.value)||_}function m(){f.classList.add("hidden");const w=d(),u=ze(w);r.textContent=`min. ${k(u)}/mies · ${O(w)}`;try{const z=n.value.trim()===""?0:N(n.value),y=Number(o.value.trim());if(!Number.isInteger(y)||y<1||y>12)throw new Error("Liczba miesięcy musi być z zakresu 1–12");const g=h.value.trim()===""?0:N(h.value);if(g<0)throw new Error("Wpłacone zaliczki nie mogą być ujemne");const j=be(t.value,z,u,y),I=Ie(j,g),$=I.balanceGr<0,l=I.balanceGr===0,v=l?"Rozliczone (saldo 0)":$?"Nadpłata (do zwrotu)":"Dopłata (do 20 maja)";c.innerHTML=`
        <tr class="head"><td>Pozycja</td><td class="val">Kwota (zł)</td></tr>
        <tr><td>Składka należna za rok składkowy</td><td class="val">${k(j)}</td></tr>
        <tr><td>Wpłacone zaliczki</td><td class="val">${k(g)}</td></tr>
        <tr class="total ${l?"":"chg"}"><td>${v}</td>
          <td class="val ${l?"":"after"}">${k(Math.abs(I.balanceGr))}</td></tr>
      `}catch(z){c.innerHTML="",f.textContent=z.message,f.classList.remove("hidden")}}async function b(){const w=Array.from(i.files??[]);if(w.length===0)return;const u=d(),z=[];let y=0;const g=[];for(const l of w)try{const v=U(await l.text()),R=S(v,["I","p2","p2"]);if(!ve(R,u)){g.push(R||l.name);continue}z.push({period:R,identifier:Number(S(v,["I","p2","p1"])||"0"),healthGr:D(v,"VI","p7")})}catch{y+=1}const{totalGr:j,months:I}=$e(z);h.value=k(j),I.length>0&&(o.value=String(I.length));const $=[];I.length&&$.push(`${I.length}/12 mies. (${O(u)})`),g.length&&$.push(`poza rokiem: ${g.join(", ")}`),y&&$.push(`${y} plik(ów) nie wczytano`),p.textContent=$.length?$.join(" · "):"nie wczytano poprawnych DRA",m()}[t,n,o,h,a].forEach(w=>{w.addEventListener("input",m),w.addEventListener("change",m)}),i.addEventListener("change",()=>void b()),m()}function He(e){if(!s)return;const t=U(s.xml);ie(t,e);const n=ye(t),o=new Blob([n],{type:"application/xml"}),a=URL.createObjectURL(o),r=document.createElement("a");r.href=a;const i=s.period||"DRA";r.download=`DRA_${i}_zdrowotna.xml`,r.click(),URL.revokeObjectURL(a)}const Z=document.querySelector("#app");Z&&Me(Z);
