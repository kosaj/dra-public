(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const D="http://www.zus.pl/2026/KEDU_5_7",se=/KEDU_(\d+)_(\d+)/;function le(e){const t=e.documentElement;if(!t||t.localName!=="KEDU")throw new Error("To nie jest plik KEDU — brak elementu głównego <KEDU>.");if(t.namespaceURI!==D){const n=t.namespaceURI?se.exec(t.namespaceURI):null;throw n?new Error(`Plik jest w formacie KEDU ${n[1]}.${n[2]}, a program obsługuje tylko KEDU 5.7.`):new Error(`Nieobsługiwany format pliku (namespace: ${t.namespaceURI??"brak"}). Program obsługuje tylko KEDU 5.7.`)}}function P(e){var r;const t=new DOMParser().parseFromString(e,"application/xml"),n=t.getElementsByTagName("parsererror")[0];if(n)throw new Error(`Nieprawidłowy XML: ${((r=n.textContent)==null?void 0:r.trim())??"błąd parsowania"}`);return le(t),A(t),t}function A(e){const t=e.getElementsByTagNameNS(D,"ZUSDRA")[0];if(!t)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return t}function T(e,t){for(const n of Array.from(e.children))if(n.localName===t)return n;return null}function W(e,t,n){const r=A(e),a=T(r,t);if(!a)throw new Error(`Brak bloku ${t} w DRA`);const o=T(a,n);if(!o)throw new Error(`Brak pola ${t}/${n} w DRA`);return o}function M(e,t,n){const r=A(e),a=T(r,t);return a?T(a,n)!==null:!1}function L(e){const t=e.replace(/\s/g,"").replace(",","."),n=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(t);if(!n)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,r,a,o=""]=n,s=(o+"00").slice(0,2),u=Number(a)*100+Number(s);return r==="-"?-u:u}function j(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const t=e<0?"-":"",n=Math.abs(e),r=Math.floor(n/100),a=n%100;return`${t}${r}.${String(a).padStart(2,"0")}`}const ce=" ";function k(e){const t=j(e),n=t.startsWith("-"),[r,a]=(n?t.slice(1):t).split("."),o=r.replace(/\B(?=(\d{3})+(?!\d))/g,ce);return`${n?"-":""}${o},${a}`}const de=["p2","p5","p7"];function R(e,t,n){return L(W(e,t,n).textContent??"0")}function _(e,t,n,r){W(e,t,n).textContent=j(r)}function ue(e,t){const n=(t.taxScale??0)+(t.flatTax??0);if(n<0)throw new Error("Kwota składki nie może być ujemna");const r=R(e,"VI","p7"),a=R(e,"IX","p2");for(const o of de)_(e,"VI",o,R(e,"VI",o)+n);return _(e,"IX","p2",a+n),Z(e),{delta:n,healthBefore:r,healthAfter:R(e,"VI","p7"),totalBefore:a,totalAfter:R(e,"IX","p2")}}const H={scale:{flag:"p1",income:"p2",base:"p3",due:"p4"},flat:{flag:"p5",income:"p6",base:"p7",due:"p8"}};function pe(e,t){const n=[];if(t.scale&&n.push({section:H.scale,entry:t.scale}),t.flat&&n.push({section:H.flat,entry:t.flat}),n.length===0)return;const r=A(e);let a=Array.from(r.children).find(s=>s.localName==="XI")??null;if(!a){a=e.createElementNS(D,"XI");const s=Array.from(r.children).find(u=>u.localName==="XII"||u.localName==="XIII");r.insertBefore(a,s??null)}for(;a.firstChild;)a.removeChild(a.firstChild);const o=(s,u)=>{const m=e.createElementNS(D,s);m.textContent=u,a.appendChild(m)};for(const{section:s,entry:u}of n)o(s.flag,"true"),o(s.income,j(u.incomeGr)),o(s.base,j(u.podstawaGr)),o(s.due,j(u.contributionGr))}function Z(e){const t=R(e,"IV","p37"),n=R(e,"VI","p7"),r=M(e,"VII","p3")?R(e,"VII","p3"):0,a=R(e,"IX","p2"),o=t+n+r;if(a!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${j(a)}, oczekiwano ${j(o)} (społeczne ${j(t)} + zdrowotna ${j(n)} + FP ${j(r)})`)}function me(e){const t=new XMLSerializer().serializeToString(e);return t.startsWith("<?xml")?t.endsWith(`
`)?t:t+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${t}
`}const V=.09,Y=.049,C=480600;function J(e){return Math.round(e*V)}function fe(e,t,n){const r=Math.max(t,n),o=Math.max(Math.round(r*(e==="scale"?V:Y)),J(n));return{podstawaGr:r,contributionGr:o}}const q={2022:{minMonthlyHealthGr:27090,minWageGr:301e3},2023:{minMonthlyHealthGr:31410,minWageGr:349e3},2024:{minMonthlyHealthGr:38178,minWageGr:424200},2025:{minMonthlyHealthGr:31496,minWageGr:466600},2026:{minMonthlyHealthGr:43254,minWageGr:480600}},X=2026;function he(e){return(q[e]??q[X]).minMonthlyHealthGr}const N=[{label:"przychód do 60 000 zł",revenueFromGr:0,revenueToGr:6e6,contributionGr:49835},{label:"przychód 60 000 – 300 000 zł",revenueFromGr:6e6,revenueToGr:3e7,contributionGr:83058},{label:"przychód powyżej 300 000 zł",revenueFromGr:3e7,revenueToGr:null,contributionGr:149504}];function Q(e){return N.find(t=>e>=t.revenueFromGr&&(t.revenueToGr===null||e<=t.revenueToGr))??N[N.length-1]}function ke(e,t,n,r){const o=Math.max(0,Math.round(t*(e==="scale"?V:Y))),s=n*r;return Math.max(o,s)}function K(e){return`luty ${e} – styczeń ${e+1}`}function ye(e){return/^\d{4}-04$/.test(e)}function ze(e,t){const n=/^(\d{4})-(\d{2})$/.exec(e);if(!n)return!1;const r=Number(n[1]),a=Number(n[2]);return a<1||a>12?!1:r===t&&a>=2||r===t+1&&a===1}function we(e,t){return{dueGr:e,paidGr:t,balanceGr:e-t}}function be(e){const t=new Map;for(const a of e){if(!a.period)continue;const o=t.get(a.period);(!o||a.identifier>o.identifier)&&t.set(a.period,a)}const n=[...t.keys()].sort();return{totalGr:n.reduce((a,o)=>a+t.get(o).healthGr,0),months:n}}const ge={k7:/^\d{1,5}\.\d{2}$/,k8:/^\d{1,6}\.\d{2}$/,k9:/^\d{1,7}\.\d{2}$/,k10:/^\d{1,8}\.\d{2}$/,k11:/^\d{1,9}\.\d{2}$/,k12:/^\d{1,10}\.\d{2}$/,k13:/^\d{1,11}\.\d{2}$/,b:/^(true|false|0|1)$/,d:/^\d{4}-\d{2}-\d{2}$/,ym:/^\d{4}-\d{2}$/,y:/^\d{4}$/,kod4:/^\d{4}$/,dig:/^\d$/,id2:/^\d{2}$/,l6:/^\d{1,6}$/,wyp:/^\d{1,2}\.\d{2}$/};function U(e,t,n,r={}){const a={};for(let o=e;o<=t;o++)a[`p${o}`]=n;return{...a,...r}}const ve=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII"],Ie={I:{p1:"dig",p2:{p1:"id2",p2:"ym"},p3:"d",p4:"s20",p5:"s12"},II:{p1:"s10",p2:"s14",p3:"s11",p4:"s1",p5:"s9",p6:"s31",p7:"s31",p8:"s22",p9:"d"},III:{p1:"l6",p2:"s1",p3:"wyp"},IV:U(1,36,"k11",{p37:"k12"}),V:U(1,4,"k11",{p5:"k12"}),VI:{...U(1,5,"k11"),p6:"k10",p7:"k12"},VII:{p1:"k11",p2:"k11",p3:"k12"},VIII:{p1:"l6",p2:"l6",p3:"k12"},IX:{p1:"k13",p2:"k13"},X:{p1:{p1:"kod4",p2:"dig",p3:"dig"},p2:"k10",p3:"k10",p4:"k10",p5:"k10",p6:"s1"},XI:{p1:"b",p2:"k10",p3:"k10",p4:"k10",p5:"b",p6:"k10",p7:"k10",p8:"k10",p9:"b",p10:"k10",p11:"k10",p12:"b",p13:"k10",p14:"b",p15:"k10",p16:"k10",p17:"k10",p18:"b",p19:"k10",p20:"k10"},XII:{p1:"y",p2:"b",p3:"b",p4:"b",p5:"k11",p6:"b",p7:"k11",p8:"k11",p9:"k11",p10:"k11",p11:"k11",p12:"k11",p13:"b",p14:"k11",p15:"b",p16:"k11",p17:"k11",p18:"k11",p19:"k11",p20:"k11",p21:"b",p22:"k11",p23:"k11",p24:"k11",p25:"k11",p26:"k11",p27:"k11",p28:"k11",p29:"k11"},XIII:{p1:"d"}},$e=new Set(["identyfikacja.PL","identyfikacja.UB","naglowek.DP","cechy.DP","cechy.BL","stopka.DP"]);function Se(e,t,n,r){if(t[0]==="s"){const o=Number(t.slice(1));Number.isFinite(o)&&e.length>o&&r.push({path:n,message:`wartość za długa (max ${o} znaków)`});return}const a=ge[t];a&&(a.test(e.trim())||r.push({path:n,message:`"${e}" nie pasuje do formatu (${t})`}))}function ee(e,t,n,r){for(const a of Array.from(e.children)){const o=t[a.localName];if(o===void 0){r.push({path:`${n}/${a.localName}`,message:"nieznane pole"});continue}typeof o=="object"?a.children.length&&ee(a,o,`${n}/${a.localName}`,r):Se(a.textContent??"",o,`${n}/${a.localName}`,r)}}function je(e){const t=[],n=e.documentElement;if(!n||n.localName!=="KEDU")return[{path:"/",message:"brak elementu głównego KEDU"}];n.namespaceURI!==D&&t.push({path:"KEDU",message:`nieoczekiwany namespace (${n.namespaceURI??"brak"})`});const r=Array.from(n.children).filter(a=>a.localName==="ZUSDRA");if(r.length===0)return t.push({path:"KEDU",message:"brak dokumentu ZUSDRA"}),t;if(r.forEach((a,o)=>{const s=r.length>1?`ZUSDRA[${o+1}]`:"ZUSDRA";let u=-1;for(const m of Array.from(a.children)){const f=m.localName;if($e.has(f))continue;const c=Ie[f];if(!c){t.push({path:`${s}/${f}`,message:"nieznany blok"});continue}const p=ve.indexOf(f);p<u&&t.push({path:`${s}/${f}`,message:"blok poza kolejnością"}),u=Math.max(u,p),ee(m,c,`${s}/${f}`,t)}}),M(e,"IV","p37")&&M(e,"VI","p7")&&M(e,"IX","p2"))try{Z(e)}catch(a){t.push({path:"ZUSDRA/IX/p2",message:a.message})}return t}function Ee(e){return e.replace(/\s/g,"").replace(/^PL/i,"")}function xe(e){let t=0;for(const n of e)t=(t*10+(n.charCodeAt(0)-48))%97;return t}function Re(e){return/^\d{26}$/.test(e)?xe(e.slice(2)+"2521"+e.slice(0,2))===1:!1}function Ne(e,t){return/^\d{10}$/.test(t)&&e.slice(-10)===t}function B(e){const t=/^(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})$/.exec(e);return t?t.slice(1).join(" "):e}let i=null;function S(e,t){var r;let n=A(e);for(const a of t)n=n?Array.from(n.children).find(o=>o.localName===a)??null:null;return((r=n==null?void 0:n.textContent)==null?void 0:r.trim())??""}function G(e,t,n){const r=S(e,[t,n]);return r?L(r):0}function Le(e){const t=Object.keys(q).map(Number).sort((c,p)=>p-c).map(c=>`<option value="${c}"${c===X?" selected":""}>${c}</option>`).join(""),n=N.map((c,p)=>`<option value="${p}">${c.label} — ${k(c.contributionGr)} zł/mies</option>`).join("");e.innerHTML=`
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
          <input type="text" id="min-wage" inputmode="decimal" value="${k(C)}" />
          <span class="hint">nie mniej niż ${k(C)}; wpływa na minimum składki</span>
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
  `;const r=e.querySelector("#file"),a=e.querySelector("#drop"),o=e.querySelector("#load-error"),s=e.querySelector("#editor"),u=e.querySelector("#editor-empty");function m(c){e.querySelectorAll(".tab").forEach(p=>p.classList.toggle("active",p.dataset.tab===c)),e.querySelector("#tab-monthly").classList.toggle("hidden",c!=="monthly"),e.querySelector("#tab-annual").classList.toggle("hidden",c!=="annual")}e.querySelectorAll(".tab").forEach(c=>c.addEventListener("click",()=>m(c.dataset.tab??"monthly"))),e.querySelector("#goto-annual").addEventListener("click",()=>m("annual")),r.addEventListener("change",()=>{var p;const c=(p=r.files)==null?void 0:p[0];c&&f(c)}),["dragenter","dragover"].forEach(c=>a.addEventListener(c,p=>{p.preventDefault(),a.classList.add("drag")})),["dragleave","drop"].forEach(c=>a.addEventListener(c,p=>{p.preventDefault(),a.classList.remove("drag")})),a.addEventListener("drop",c=>{var h,g;const p=(g=(h=c.dataTransfer)==null?void 0:h.files)==null?void 0:g[0];p&&f(p)}),Ve(e);async function f(c){o.classList.add("hidden");try{const p=await c.text(),h=P(p),g=S(h,["XI","p13"]),z=S(h,["XI","p16"]);i={xml:p,period:S(h,["I","p2","p2"]),payerName:Ge(h),nip:S(h,["II","p1"]),regon:S(h,["II","p2"]),social:G(h,"IV","p37"),health:G(h,"VI","p7"),laborFund:G(h,"VII","p3"),total:G(h,"IX","p2"),annual:z?L(z):null,revenue:g?L(g):null},De(e),s.classList.remove("hidden"),u.classList.add("hidden"),m("monthly")}catch(p){i=null,s.classList.add("hidden"),u.classList.remove("hidden"),o.textContent=`Nie udało się wczytać pliku: ${p.message}`,o.classList.remove("hidden")}}}function Ge(e){const t=S(e,["II","p6"]),n=S(e,["II","p7"]),r=S(e,["II","p8"]);return[t,[r,n].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function te(e){var t,n;return(((t=e.scale)==null?void 0:t.contributionGr)??0)+(((n=e.flat)==null?void 0:n.contributionGr)??0)}function ne(e,t){var n,r;ue(e,{taxScale:(n=t.scale)==null?void 0:n.contributionGr,flatTax:(r=t.flat)==null?void 0:r.contributionGr}),pe(e,{scale:t.scale,flat:t.flat})}function De(e){if(!i)return;const t=e.querySelector("#meta"),n=[i.nip?`NIP ${i.nip}`:"",i.regon?`REGON ${i.regon}`:"",i.period?`okres ${i.period}`:""].filter(Boolean);t.innerHTML=`
    <div class="meta-firma"><strong>${i.payerName||"płatnik"}</strong></div>
    <div class="meta-id">${n.join(" · ")}</div>
  `,qe(e);const r=Ue(e),a=e.querySelector("#min-wage"),o=e.querySelector("#tax-scale-active"),s=e.querySelector("#tax-scale-amount"),u=e.querySelector("#tax-scale-hint"),m=e.querySelector("#flat-tax-active"),f=e.querySelector("#flat-tax-amount"),c=e.querySelector("#flat-tax-hint"),p=e.querySelector("#input-error"),h=e.querySelector("#preview"),g=e.querySelector("#download"),z=ye(i.period);if(e.querySelector("#april-warn").classList.toggle("hidden",!z),e.querySelector("#monthly-edit").classList.toggle("hidden",z),e.querySelector("#monthly-projection").classList.toggle("hidden",z),z)return;function d(){o.checked||(s.value=""),m.checked||(f.value=""),s.disabled=!o.checked,f.disabled=!m.checked}function w(){const l=L(a.value);if(l<C)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${k(C)} zł`);return l}function y(l,b,x,re){if(!l)return null;const F=b.trim()===""?0:L(b),{podstawaGr:oe,contributionGr:ie}=fe(x,F,re);return{incomeGr:F,podstawaGr:oe,contributionGr:ie}}function v(){const l=w();return{minimumGr:J(l),minWageGr:l,scale:y(o.checked,s.value,"scale",l),flat:y(m.checked,f.value,"flat",l)}}function E(l,b){if(!l)return`puste = minimum ${k(b)}`;const x=l.contributionGr===b?" (minimum)":"";return`podstawa ${k(l.podstawaGr)} → składka ${k(l.contributionGr)}${x}`}function I(l){h.innerHTML="",g.disabled=!0,p.textContent=l,p.classList.remove("hidden")}function $(){if(!i)return;p.classList.add("hidden");let l;try{l=v()}catch(x){I(x.message);return}u.textContent=E(l.scale,l.minimumGr),c.textContent=E(l.flat,l.minimumGr);const b=te(l);Ae(h,b,l),Me(e,l),r(l),g.disabled=b===0}[o,m].forEach(l=>l.addEventListener("change",()=>{d(),$()})),[a,s,f].forEach(l=>l.addEventListener("input",$)),g.addEventListener("click",()=>{let l;try{l=v()}catch(b){I(b.message);return}Xe(l)}),d(),$()}function Ae(e,t,n){if(!i)return;const r=[],a=(s,u,m,f={})=>{const c=u!==m;return`<tr class="${f.total?"total":""} ${c?"chg":""}">
      <td>${s}</td>
      <td class="val">${k(u)}</td>
      <td class="arr">→</td>
      <td class="val ${c?"after":""}">${k(m)}</td>
    </tr>`};r.push('<tr class="head"><td>Pozycja</td><td class="val">przed (zł)</td><td class="arr"></td><td class="val">po (zł)</td></tr>');const o=(s,u)=>Te(`Forma XI: ${s} ☒ (dochód ${k(u.incomeGr)} · podstawa ${k(u.podstawaGr)})`,u.contributionGr);n.scale&&r.push(o("skala",n.scale)),n.flat&&r.push(o("liniówka",n.flat)),r.push(a("Składki społeczne (IV)",i.social,i.social)),r.push(a("Składka zdrowotna (VI)",i.health,i.health+t)),r.push(a("Fundusz Pracy (VII)",i.laborFund,i.laborFund)),r.push(a("Suma do zapłaty (IX)",i.total,i.total+t,{total:!0})),i.annual!==null&&r.push(a("Roczne rozliczenie zdrow. (XI)",i.annual,i.annual)),e.innerHTML=r.join("")}function Me(e,t){if(!i)return;const n=e.querySelector("#schema-status");let r;try{const o=P(i.xml);ne(o,t),r=je(o)}catch(o){r=[{path:"",message:o.message}]}if(r.length===0){n.className="schema-status ok",n.textContent="✓ Zgodne ze schematem KEDU 5.7";return}n.className="schema-status warn";const a=r.slice(0,5).map(o=>o.path?`${o.path}: ${o.message}`:o.message).join(" · ");n.textContent=`⚠ ${r.length} uwag względem schematu — ${a}${r.length>5?" …":""}`}function Te(e,t){return`<tr class="form-xi"><td>${e}</td><td class="val" colspan="3">składka ${k(t)}</td></tr>`}const ae="dra.nrs";function Ce(){try{return localStorage.getItem(ae)??""}catch{return""}}function Pe(e){try{localStorage.setItem(ae,e)}catch{}}function Ue(e){const t=e.querySelector("#proj-bracket"),n=e.querySelector("#proj-bracket-row"),r=e.querySelector("#proj-title"),a=e.querySelector("#proj-note"),o=e.querySelector("#proj-table"),s=e.querySelector("#proj-transfer"),u=e.querySelector("#nrs-input"),m=e.querySelector("#nrs-status");if(i&&i.revenue!==null){const d=Q(i.revenue);t.value=String(N.indexOf(d))}const f=Ce();f&&!u.value&&(u.value=B(f));let c=null;function p(){const d=Ee(u.value),w=d==="",y=Re(d);return{nrb:d,valid:y,matches:y&&Ne(d,(i==null?void 0:i.nip)??""),empty:w}}function h(d){if(d&&(d.scale||d.flat)){const y=[d.scale&&"skala",d.flat&&"liniówka"].filter(Boolean).join(" + ");return{gr:te(d),label:y,form:!0}}const w=N[Number(t.value)]??N[1];return{gr:w.contributionGr,label:w.label,form:!1}}function g(){if(!i)return;const d=h(c);n.classList.toggle("hidden",d.form),r.textContent=d.form?"Prognoza przelewu (skala/liniówka)":"Prognoza przelewu (ryczałt — wyższy próg)",a.textContent=d.form?"Rzeczywisty przelew po dodaniu składki zdrowotnej za ten miesiąc (= suma do zapłaty).":"Ile zapłacisz miesięcznie, gdy wejdziesz na wyższy próg. Nie zmienia pliku — to planowanie, żeby nie zaskoczyła Cię majowa dopłata.";const w=d.form?i.health+d.gr:d.gr,y=d.form?`VI + ${d.label}`:d.label,v=i.social+i.laborFund+w;o.innerHTML=`
      <tr class="head"><td>Składnik</td><td class="val">Kwota (zł)</td></tr>
      <tr><td>Składki społeczne (IV)</td><td class="val">${k(i.social)}</td></tr>
      <tr><td>Fundusz Pracy (VII)</td><td class="val">${k(i.laborFund)}</td></tr>
      <tr><td>Składka zdrowotna (${y})</td><td class="val">${k(w)}</td></tr>
      <tr class="total"><td>Razem do przelewu</td><td class="val after">${k(v)}</td></tr>
    `;const E=i.period||"—",{nrb:I,valid:$}=p(),l=$?`<div class="row"><span>Rachunek ZUS (NRS)</span><strong>${B(I)}</strong></div>`:"";s.innerHTML=`
      <div class="row"><span>Kwota przelewu</span><strong>${k(v)} zł</strong></div>
      ${l}
      <div class="row"><span>Opis (opcjonalny)</span><span>Składki ZUS ${E}</span></div>
      <p class="hint">Przelew na Twój <strong>indywidualny rachunek składkowy (NRS)</strong> — tytuł nie jest wymagany.
        <a href="https://eskladka.pl/Home" target="_blank" rel="noopener noreferrer">Sprawdź numer rachunku dla NIP ${i.nip||"—"}</a>.</p>
    `}function z(){const{nrb:d,valid:w,matches:y,empty:v}=p();w&&Pe(d),v?m.textContent="wklej raz — zapamiętamy w przeglądarce":w?y?m.textContent="✓ poprawny, zapisany":m.textContent="⚠ ostatnie 10 cyfr ≠ NIP z pliku — sprawdź":m.textContent="⚠ niepoprawny numer (26 cyfr / cyfra kontrolna)",g()}return t.addEventListener("change",g),u.addEventListener("input",z),z(),d=>{c=d,g()}}function qe(e){if(!i)return;const t=e.querySelector("#brackets"),n=i.revenue!==null?Q(i.revenue):null,r='<tr class="head"><td>Próg (roczny przychód)</td><td class="val">Składka mies. (zł)</td></tr>',a=N.map(o=>{const s=n===o;return`<tr class="${s?"sel":""}">
      <td>${o.label}${s?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${k(o.contributionGr)}</td>
    </tr>`}).join("");t.innerHTML=r+a}function Ve(e){const t=e.querySelector("#annual-form"),n=e.querySelector("#annual-income"),r=e.querySelector("#annual-months"),a=e.querySelector("#annual-year"),o=e.querySelector("#annual-year-info"),s=e.querySelector("#annual-files"),u=e.querySelector("#annual-files-info"),m=e.querySelector("#annual-paid"),f=e.querySelector("#annual-error"),c=e.querySelector("#annual-result");function p(){return Number(a.value)||X}function h(){f.classList.add("hidden");const z=p(),d=he(z);o.textContent=`min. ${k(d)}/mies · ${K(z)}`;try{const w=n.value.trim()===""?0:L(n.value),y=Number(r.value.trim());if(!Number.isInteger(y)||y<1||y>12)throw new Error("Liczba miesięcy musi być z zakresu 1–12");const v=m.value.trim()===""?0:L(m.value);if(v<0)throw new Error("Wpłacone zaliczki nie mogą być ujemne");const E=ke(t.value,w,d,y),I=we(E,v),$=I.balanceGr<0,l=I.balanceGr===0,b=l?"Rozliczone (saldo 0)":$?"Nadpłata (do zwrotu)":"Dopłata (do 20 maja)";c.innerHTML=`
        <tr class="head"><td>Pozycja</td><td class="val">Kwota (zł)</td></tr>
        <tr><td>Składka należna za rok składkowy</td><td class="val">${k(E)}</td></tr>
        <tr><td>Wpłacone zaliczki</td><td class="val">${k(v)}</td></tr>
        <tr class="total ${l?"":"chg"}"><td>${b}</td>
          <td class="val ${l?"":"after"}">${k(Math.abs(I.balanceGr))}</td></tr>
      `}catch(w){c.innerHTML="",f.textContent=w.message,f.classList.remove("hidden")}}async function g(){const z=Array.from(s.files??[]);if(z.length===0)return;const d=p(),w=[];let y=0;const v=[];for(const l of z)try{const b=P(await l.text()),x=S(b,["I","p2","p2"]);if(!ze(x,d)){v.push(x||l.name);continue}w.push({period:x,identifier:Number(S(b,["I","p2","p1"])||"0"),healthGr:G(b,"VI","p7")})}catch{y+=1}const{totalGr:E,months:I}=be(w);m.value=k(E),I.length>0&&(r.value=String(I.length));const $=[];I.length&&$.push(`${I.length}/12 mies. (${K(d)})`),v.length&&$.push(`poza rokiem: ${v.join(", ")}`),y&&$.push(`${y} plik(ów) nie wczytano`),u.textContent=$.length?$.join(" · "):"nie wczytano poprawnych DRA",h()}[t,n,r,m,a].forEach(z=>{z.addEventListener("input",h),z.addEventListener("change",h)}),s.addEventListener("change",()=>void g()),h()}function Xe(e){if(!i)return;const t=P(i.xml);ne(t,e);const n=me(t),r=new Blob([n],{type:"application/xml"}),a=URL.createObjectURL(r),o=document.createElement("a");o.href=a;const s=i.period||"DRA";o.download=`DRA_${s}_zdrowotna.xml`,o.click(),URL.revokeObjectURL(a)}const O=document.querySelector("#app");O&&Le(O);
