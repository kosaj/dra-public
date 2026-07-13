(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const G="http://www.zus.pl/2026/KEDU_5_7";function q(e){var r;const t=new DOMParser().parseFromString(e,"application/xml"),a=t.getElementsByTagName("parsererror")[0];if(a)throw new Error(`Nieprawidłowy XML: ${((r=a.textContent)==null?void 0:r.trim())??"błąd parsowania"}`);return L(t),t}function L(e){const t=e.getElementsByTagNameNS(G,"ZUSDRA")[0];if(!t)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return t}function C(e,t){for(const a of Array.from(e.children))if(a.localName===t)return a;return null}function K(e,t,a){const r=L(e),n=C(r,t);if(!n)throw new Error(`Brak bloku ${t} w DRA`);const o=C(n,a);if(!o)throw new Error(`Brak pola ${t}/${a} w DRA`);return o}function T(e,t,a){const r=L(e),n=C(r,t);return n?C(n,a)!==null:!1}function R(e){const t=e.replace(/\s/g,"").replace(",","."),a=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(t);if(!a)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,r,n,o=""]=a,l=(o+"00").slice(0,2),s=Number(n)*100+Number(l);return r==="-"?-s:s}function x(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const t=e<0?"-":"",a=Math.abs(e),r=Math.floor(a/100),n=a%100;return`${t}${r}.${String(n).padStart(2,"0")}`}const ae=" ";function f(e){const t=x(e),a=t.startsWith("-"),[r,n]=(a?t.slice(1):t).split("."),o=r.replace(/\B(?=(\d{3})+(?!\d))/g,ae);return`${a?"-":""}${o},${n}`}const re=["p2","p5","p7"];function E(e,t,a){return R(K(e,t,a).textContent??"0")}function F(e,t,a,r){K(e,t,a).textContent=x(r)}function Z(e,t){const a=(t.taxScale??0)+(t.flatTax??0);if(a<0)throw new Error("Kwota składki nie może być ujemna");const r=E(e,"VI","p7"),n=E(e,"IX","p2");for(const o of re)F(e,"VI",o,E(e,"VI",o)+a);return F(e,"IX","p2",n+a),J(e),{delta:a,healthBefore:r,healthAfter:E(e,"VI","p7"),totalBefore:n,totalAfter:E(e,"IX","p2")}}const V={scale:{flag:"p1",income:"p2",base:"p3",due:"p4"},flat:{flag:"p5",income:"p6",base:"p7",due:"p8"}};function Y(e,t){const a=[];if((t.taxScale??0)>0&&a.push({section:V.scale,due:t.taxScale}),(t.flatTax??0)>0&&a.push({section:V.flat,due:t.flatTax}),a.length===0)return;const r=L(e);let n=Array.from(r.children).find(l=>l.localName==="XI")??null;if(!n){n=e.createElementNS(G,"XI");const l=Array.from(r.children).find(s=>s.localName==="XII"||s.localName==="XIII");r.insertBefore(n,l??null)}for(;n.firstChild;)n.removeChild(n.firstChild);const o=(l,s)=>{const m=e.createElementNS(G,l);m.textContent=s,n.appendChild(m)};for(const{section:l,due:s}of a)o(l.flag,"true"),o(l.income,"0.00"),o(l.base,x(t.podstawaGr)),o(l.due,x(s))}function J(e){const t=E(e,"IV","p37"),a=E(e,"VI","p7"),r=T(e,"VII","p3")?E(e,"VII","p3"):0,n=E(e,"IX","p2"),o=t+a+r;if(n!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${x(n)}, oczekiwano ${x(o)} (społeczne ${x(t)} + zdrowotna ${x(a)} + FP ${x(r)})`)}function oe(e){const t=new XMLSerializer().serializeToString(e);return t.startsWith("<?xml")?t.endsWith(`
`)?t:t+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${t}
`}const Q=.09,ie=.049,M=480600;function se(e){return Math.round(e*Q)}const U={2022:{minMonthlyHealthGr:27090,minWageGr:301e3},2023:{minMonthlyHealthGr:31410,minWageGr:349e3},2024:{minMonthlyHealthGr:38178,minWageGr:424200},2025:{minMonthlyHealthGr:31496,minWageGr:466600},2026:{minMonthlyHealthGr:43254,minWageGr:480600}},X=2026;function le(e){return(U[e]??U[X]).minMonthlyHealthGr}const N=[{label:"przychód do 60 000 zł",revenueFromGr:0,revenueToGr:6e6,contributionGr:49835},{label:"przychód 60 000 – 300 000 zł",revenueFromGr:6e6,revenueToGr:3e7,contributionGr:83058},{label:"przychód powyżej 300 000 zł",revenueFromGr:3e7,revenueToGr:null,contributionGr:149504}];function ee(e){return N.find(t=>e>=t.revenueFromGr&&(t.revenueToGr===null||e<=t.revenueToGr))??N[N.length-1]}function ce(e,t,a){if(!e)return 0;const r=t.trim();return r===""?a:R(r)}function de(e,t,a){const r=ce(e,t,a);if(e&&t.trim()!==""&&r<a)throw new Error(`kwota nie może być niższa niż minimum ${f(a)} zł`);return r}function ue(e,t,a,r){const o=Math.max(0,Math.round(t*(e==="scale"?Q:ie))),l=a*r;return Math.max(o,l)}function H(e){return`luty ${e} – styczeń ${e+1}`}function pe(e){return/^\d{4}-04$/.test(e)}function me(e,t){const a=/^(\d{4})-(\d{2})$/.exec(e);if(!a)return!1;const r=Number(a[1]),n=Number(a[2]);return n<1||n>12?!1:r===t&&n>=2||r===t+1&&n===1}function fe(e,t){return{dueGr:e,paidGr:t,balanceGr:e-t}}function he(e){const t=new Map;for(const n of e){if(!n.period)continue;const o=t.get(n.period);(!o||n.identifier>o.identifier)&&t.set(n.period,n)}const a=[...t.keys()].sort();return{totalGr:a.reduce((n,o)=>n+t.get(o).healthGr,0),months:a}}const ke={k7:/^\d{1,5}\.\d{2}$/,k8:/^\d{1,6}\.\d{2}$/,k9:/^\d{1,7}\.\d{2}$/,k10:/^\d{1,8}\.\d{2}$/,k11:/^\d{1,9}\.\d{2}$/,k12:/^\d{1,10}\.\d{2}$/,k13:/^\d{1,11}\.\d{2}$/,b:/^(true|false|0|1)$/,d:/^\d{4}-\d{2}-\d{2}$/,ym:/^\d{4}-\d{2}$/,y:/^\d{4}$/,kod4:/^\d{4}$/,dig:/^\d$/,id2:/^\d{2}$/,l6:/^\d{1,6}$/,wyp:/^\d{1,2}\.\d{2}$/};function P(e,t,a,r={}){const n={};for(let o=e;o<=t;o++)n[`p${o}`]=a;return{...n,...r}}const ye=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII"],ze={I:{p1:"dig",p2:{p1:"id2",p2:"ym"},p3:"d",p4:"s20",p5:"s12"},II:{p1:"s10",p2:"s14",p3:"s11",p4:"s1",p5:"s9",p6:"s31",p7:"s31",p8:"s22",p9:"d"},III:{p1:"l6",p2:"s1",p3:"wyp"},IV:P(1,36,"k11",{p37:"k12"}),V:P(1,4,"k11",{p5:"k12"}),VI:{...P(1,5,"k11"),p6:"k10",p7:"k12"},VII:{p1:"k11",p2:"k11",p3:"k12"},VIII:{p1:"l6",p2:"l6",p3:"k12"},IX:{p1:"k13",p2:"k13"},X:{p1:{p1:"kod4",p2:"dig",p3:"dig"},p2:"k10",p3:"k10",p4:"k10",p5:"k10",p6:"s1"},XI:{p1:"b",p2:"k10",p3:"k10",p4:"k10",p5:"b",p6:"k10",p7:"k10",p8:"k10",p9:"b",p10:"k10",p11:"k10",p12:"b",p13:"k10",p14:"b",p15:"k10",p16:"k10",p17:"k10",p18:"b",p19:"k10",p20:"k10"},XII:{p1:"y",p2:"b",p3:"b",p4:"b",p5:"k11",p6:"b",p7:"k11",p8:"k11",p9:"k11",p10:"k11",p11:"k11",p12:"k11",p13:"b",p14:"k11",p15:"b",p16:"k11",p17:"k11",p18:"k11",p19:"k11",p20:"k11",p21:"b",p22:"k11",p23:"k11",p24:"k11",p25:"k11",p26:"k11",p27:"k11",p28:"k11",p29:"k11"},XIII:{p1:"d"}},we=new Set(["identyfikacja.PL","identyfikacja.UB","naglowek.DP","cechy.DP","cechy.BL","stopka.DP"]);function be(e,t,a,r){if(t[0]==="s"){const o=Number(t.slice(1));Number.isFinite(o)&&e.length>o&&r.push({path:a,message:`wartość za długa (max ${o} znaków)`});return}const n=ke[t];n&&(n.test(e.trim())||r.push({path:a,message:`"${e}" nie pasuje do formatu (${t})`}))}function te(e,t,a,r){for(const n of Array.from(e.children)){const o=t[n.localName];if(o===void 0){r.push({path:`${a}/${n.localName}`,message:"nieznane pole"});continue}typeof o=="object"?n.children.length&&te(n,o,`${a}/${n.localName}`,r):be(n.textContent??"",o,`${a}/${n.localName}`,r)}}function ge(e){const t=[],a=e.documentElement;if(!a||a.localName!=="KEDU")return[{path:"/",message:"brak elementu głównego KEDU"}];a.namespaceURI!==G&&t.push({path:"KEDU",message:`nieoczekiwany namespace (${a.namespaceURI??"brak"})`});const r=Array.from(a.children).filter(n=>n.localName==="ZUSDRA");if(r.length===0)return t.push({path:"KEDU",message:"brak dokumentu ZUSDRA"}),t;if(r.forEach((n,o)=>{const l=r.length>1?`ZUSDRA[${o+1}]`:"ZUSDRA";let s=-1;for(const m of Array.from(n.children)){const h=m.localName;if(we.has(h))continue;const i=ze[h];if(!i){t.push({path:`${l}/${h}`,message:"nieznany blok"});continue}const d=ye.indexOf(h);d<s&&t.push({path:`${l}/${h}`,message:"blok poza kolejnością"}),s=Math.max(s,d),te(m,i,`${l}/${h}`,t)}}),T(e,"IV","p37")&&T(e,"VI","p7")&&T(e,"IX","p2"))try{J(e)}catch(n){t.push({path:"ZUSDRA/IX/p2",message:n.message})}return t}function ve(e){return e.replace(/\s/g,"").replace(/^PL/i,"")}function Ie(e){let t=0;for(const a of e)t=(t*10+(a.charCodeAt(0)-48))%97;return t}function $e(e){return/^\d{26}$/.test(e)?Ie(e.slice(2)+"2521"+e.slice(0,2))===1:!1}function Se(e,t){return/^\d{10}$/.test(t)&&e.slice(-10)===t}function _(e){const t=/^(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})$/.exec(e);return t?t.slice(1).join(" "):e}let c=null;function v(e,t){var r;let a=L(e);for(const n of t)a=a?Array.from(a.children).find(o=>o.localName===n)??null:null;return((r=a==null?void 0:a.textContent)==null?void 0:r.trim())??""}function A(e,t,a){const r=v(e,[t,a]);return r?R(r):0}function xe(e){const t=Object.keys(U).map(Number).sort((i,d)=>d-i).map(i=>`<option value="${i}"${i===X?" selected":""}>${i}</option>`).join(""),a=N.map((i,d)=>`<option value="${d}">${i.label} — ${f(i.contributionGr)} zł/mies</option>`).join("");e.innerHTML=`
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
        </div>

        <div id="monthly-projection">
        <h2>Prognoza przelewu (ryczałt — wyższy próg)</h2>
        <p class="hint calc-note">Ile zapłacisz miesięcznie, gdy wejdziesz na wyższy próg.
          Nie zmienia pliku — to planowanie, żeby nie zaskoczyła Cię majowa dopłata.</p>
        <div class="form-row">
          <label for="proj-bracket">Przewidywany próg</label>
          <select id="proj-bracket">${a}</select>
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
        <strong>Zakres:</strong> zaznaczone składki trafiają do bloku VI (składka zdrowotna) i podnoszą
        sumę do zapłaty (blok IX), a w bloku XI zaznaczana jest <strong>forma opodatkowania</strong>
        (dochód 0, podstawa = min. wynagrodzenie, składka) — bez tego ZUS odrzuca plik. To składka
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
  `;const r=e.querySelector("#file"),n=e.querySelector("#drop"),o=e.querySelector("#load-error"),l=e.querySelector("#editor"),s=e.querySelector("#editor-empty");function m(i){e.querySelectorAll(".tab").forEach(d=>d.classList.toggle("active",d.dataset.tab===i)),e.querySelector("#tab-monthly").classList.toggle("hidden",i!=="monthly"),e.querySelector("#tab-annual").classList.toggle("hidden",i!=="annual")}e.querySelectorAll(".tab").forEach(i=>i.addEventListener("click",()=>m(i.dataset.tab??"monthly"))),e.querySelector("#goto-annual").addEventListener("click",()=>m("annual")),r.addEventListener("change",()=>{var d;const i=(d=r.files)==null?void 0:d[0];i&&h(i)}),["dragenter","dragover"].forEach(i=>n.addEventListener(i,d=>{d.preventDefault(),n.classList.add("drag")})),["dragleave","drop"].forEach(i=>n.addEventListener(i,d=>{d.preventDefault(),n.classList.remove("drag")})),n.addEventListener("drop",i=>{var p,y;const d=(y=(p=i.dataTransfer)==null?void 0:p.files)==null?void 0:y[0];d&&h(d)}),Te(e);async function h(i){o.classList.add("hidden");try{const d=await i.text(),p=q(d);if(L(p).namespaceURI!==G)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");const y=v(p,["XI","p13"]),z=v(p,["XI","p16"]);c={xml:d,period:v(p,["I","p2","p2"]),payerName:Ee(p),nip:v(p,["II","p1"]),regon:v(p,["II","p2"]),social:A(p,"IV","p37"),health:A(p,"VI","p7"),laborFund:A(p,"VII","p3"),total:A(p,"IX","p2"),annual:z?R(z):null,revenue:y?R(y):null},je(e),l.classList.remove("hidden"),s.classList.add("hidden"),m("monthly")}catch(d){c=null,l.classList.add("hidden"),s.classList.remove("hidden"),o.textContent=`Nie udało się wczytać pliku: ${d.message}`,o.classList.remove("hidden")}}}function Ee(e){const t=v(e,["II","p6"]),a=v(e,["II","p7"]),r=v(e,["II","p8"]);return[t,[r,a].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function je(e){if(!c)return;const t=e.querySelector("#meta"),a=[c.nip?`NIP ${c.nip}`:"",c.regon?`REGON ${c.regon}`:"",c.period?`okres ${c.period}`:""].filter(Boolean);t.innerHTML=`
    <div class="meta-firma"><strong>${c.payerName||"płatnik"}</strong></div>
    <div class="meta-id">${a.join(" · ")}</div>
  `,Ge(e),Ae(e);const r=e.querySelector("#min-wage"),n=e.querySelector("#tax-scale-active"),o=e.querySelector("#tax-scale-amount"),l=e.querySelector("#tax-scale-hint"),s=e.querySelector("#flat-tax-active"),m=e.querySelector("#flat-tax-amount"),h=e.querySelector("#flat-tax-hint"),i=e.querySelector("#input-error"),d=e.querySelector("#preview"),p=e.querySelector("#download"),y=pe(c.period);if(e.querySelector("#april-warn").classList.toggle("hidden",!y),e.querySelector("#monthly-edit").classList.toggle("hidden",y),e.querySelector("#monthly-projection").classList.toggle("hidden",y),y)return;function z(){n.checked||(o.value=""),s.checked||(m.value=""),o.disabled=!n.checked,m.disabled=!s.checked}function $(){const u=R(r.value);if(u<M)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${f(M)} zł`);return u}function w(u,k,g,S){try{return de(u,k,S)}catch(D){throw new Error(`${g}: ${D.message}`)}}function b(){const u=$(),k=se(u);return{minimumGr:k,minWageGr:u,taxScale:w(n.checked,o.value,"Skala podatkowa",k),flatTax:w(s.checked,m.value,"Podatek liniowy",k)}}function I(u){d.innerHTML="",p.disabled=!0,i.textContent=u,i.classList.remove("hidden")}function j(){if(!c)return;i.classList.add("hidden");let u;try{u=b()}catch(S){I(S.message);return}const k=`puste = minimum ${f(u.minimumGr)}`;l.textContent=k,h.textContent=k;const g=u.taxScale+u.flatTax;Ne(d,g,{taxScale:n.checked?u.taxScale:null,flatTax:s.checked?u.flatTax:null,podstawaGr:u.minWageGr}),Re(e,u.taxScale,u.flatTax,u.minWageGr),p.disabled=g===0}[n,s].forEach(u=>u.addEventListener("change",()=>{z(),j()})),[r,o,m].forEach(u=>u.addEventListener("input",j)),p.addEventListener("click",()=>{let u;try{u=b()}catch(k){I(k.message);return}Ce(u.taxScale,u.flatTax,u.minWageGr)}),z(),j()}function Ne(e,t,a){if(!c)return;const r=[],n=(l,s,m,h={})=>{const i=s!==m;return`<tr class="${h.total?"total":""} ${i?"chg":""}">
      <td>${l}</td>
      <td class="val">${f(s)}</td>
      <td class="arr">→</td>
      <td class="val ${i?"after":""}">${f(m)}</td>
    </tr>`};r.push('<tr class="head"><td>Pozycja</td><td class="val">przed (zł)</td><td class="arr"></td><td class="val">po (zł)</td></tr>'),a.taxScale!==null&&r.push(B("Dodano: skala",a.taxScale)),a.flatTax!==null&&r.push(B("Dodano: liniówka",a.flatTax));const o=f(a.podstawaGr);a.taxScale!==null&&r.push(O(`Forma XI: skala ☒ (dochód 0,00 · podstawa ${o})`,a.taxScale)),a.flatTax!==null&&r.push(O(`Forma XI: liniówka ☒ (dochód 0,00 · podstawa ${o})`,a.flatTax)),r.push(n("Składki społeczne (IV)",c.social,c.social)),r.push(n("Składka zdrowotna (VI)",c.health,c.health+t)),r.push(n("Fundusz Pracy (VII)",c.laborFund,c.laborFund)),r.push(n("Suma do zapłaty (IX)",c.total,c.total+t,{total:!0})),c.annual!==null&&r.push(n("Roczne rozliczenie zdrow. (XI)",c.annual,c.annual)),e.innerHTML=r.join("")}function Re(e,t,a,r){if(!c)return;const n=e.querySelector("#schema-status");let o;try{const s=q(c.xml);Z(s,{taxScale:t,flatTax:a}),Y(s,{taxScale:t,flatTax:a,podstawaGr:r}),o=ge(s)}catch(s){o=[{path:"",message:s.message}]}if(o.length===0){n.className="schema-status ok",n.textContent="✓ Zgodne ze schematem KEDU 5.7";return}n.className="schema-status warn";const l=o.slice(0,5).map(s=>s.path?`${s.path}: ${s.message}`:s.message).join(" · ");n.textContent=`⚠ ${o.length} uwag względem schematu — ${l}${o.length>5?" …":""}`}function B(e,t){return`<tr class="added"><td>${e}</td><td class="val delta" colspan="3">+ ${f(t)}</td></tr>`}function O(e,t){return`<tr class="form-xi"><td>${e}</td><td class="val" colspan="3">składka ${f(t)}</td></tr>`}const ne="dra.nrs";function Le(){try{return localStorage.getItem(ne)??""}catch{return""}}function De(e){try{localStorage.setItem(ne,e)}catch{}}function Ae(e){if(!c)return;const t=e.querySelector("#proj-bracket"),a=e.querySelector("#proj-table"),r=e.querySelector("#proj-transfer"),n=e.querySelector("#nrs-input"),o=e.querySelector("#nrs-status");if(c.revenue!==null){const i=ee(c.revenue);t.value=String(N.indexOf(i))}const l=Le();l&&!n.value&&(n.value=_(l));function s(){const i=ve(n.value),d=i==="",p=$e(i);return{nrb:i,valid:p,matches:p&&Se(i,c.nip),empty:d}}function m(){if(!c)return;const i=N[Number(t.value)]??N[1],d=i.contributionGr,p=c.social+c.laborFund+d;a.innerHTML=`
      <tr class="head"><td>Składnik</td><td class="val">Kwota (zł)</td></tr>
      <tr><td>Składki społeczne (IV)</td><td class="val">${f(c.social)}</td></tr>
      <tr><td>Fundusz Pracy (VII)</td><td class="val">${f(c.laborFund)}</td></tr>
      <tr><td>Składka zdrowotna (${i.label})</td><td class="val">${f(d)}</td></tr>
      <tr class="total"><td>Razem do przelewu</td><td class="val after">${f(p)}</td></tr>
    `;const y=c.period||"—",{nrb:z,valid:$}=s(),w=$?`<div class="row"><span>Rachunek ZUS (NRS)</span><strong>${_(z)}</strong></div>`:"";r.innerHTML=`
      <div class="row"><span>Kwota przelewu</span><strong>${f(p)} zł</strong></div>
      ${w}
      <div class="row"><span>Opis (opcjonalny)</span><span>Składki ZUS ${y}</span></div>
      <p class="hint">Przelew na Twój <strong>indywidualny rachunek składkowy (NRS)</strong> — tytuł nie jest wymagany.
        <a href="https://eskladka.pl/Home" target="_blank" rel="noopener noreferrer">Sprawdź numer rachunku dla NIP ${c.nip||"—"}</a>.</p>
    `}function h(){const{nrb:i,valid:d,matches:p,empty:y}=s();d&&De(i),y?o.textContent="wklej raz — zapamiętamy w przeglądarce":d?p?o.textContent="✓ poprawny, zapisany":o.textContent="⚠ ostatnie 10 cyfr ≠ NIP z pliku — sprawdź":o.textContent="⚠ niepoprawny numer (26 cyfr / cyfra kontrolna)",m()}t.addEventListener("change",m),n.addEventListener("input",h),h()}function Ge(e){if(!c)return;const t=e.querySelector("#brackets"),a=c.revenue!==null?ee(c.revenue):null,r='<tr class="head"><td>Próg (roczny przychód)</td><td class="val">Składka mies. (zł)</td></tr>',n=N.map(o=>{const l=a===o;return`<tr class="${l?"sel":""}">
      <td>${o.label}${l?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${f(o.contributionGr)}</td>
    </tr>`}).join("");t.innerHTML=r+n}function Te(e){const t=e.querySelector("#annual-form"),a=e.querySelector("#annual-income"),r=e.querySelector("#annual-months"),n=e.querySelector("#annual-year"),o=e.querySelector("#annual-year-info"),l=e.querySelector("#annual-files"),s=e.querySelector("#annual-files-info"),m=e.querySelector("#annual-paid"),h=e.querySelector("#annual-error"),i=e.querySelector("#annual-result");function d(){return Number(n.value)||X}function p(){h.classList.add("hidden");const z=d(),$=le(z);o.textContent=`min. ${f($)}/mies · ${H(z)}`;try{const w=a.value.trim()===""?0:R(a.value),b=Number(r.value.trim());if(!Number.isInteger(b)||b<1||b>12)throw new Error("Liczba miesięcy musi być z zakresu 1–12");const I=m.value.trim()===""?0:R(m.value);if(I<0)throw new Error("Wpłacone zaliczki nie mogą być ujemne");const j=ue(t.value,w,$,b),u=fe(j,I),k=u.balanceGr<0,g=u.balanceGr===0,S=g?"Rozliczone (saldo 0)":k?"Nadpłata (do zwrotu)":"Dopłata (do 20 maja)";i.innerHTML=`
        <tr class="head"><td>Pozycja</td><td class="val">Kwota (zł)</td></tr>
        <tr><td>Składka należna za rok składkowy</td><td class="val">${f(j)}</td></tr>
        <tr><td>Wpłacone zaliczki</td><td class="val">${f(I)}</td></tr>
        <tr class="total ${g?"":"chg"}"><td>${S}</td>
          <td class="val ${g?"":"after"}">${f(Math.abs(u.balanceGr))}</td></tr>
      `}catch(w){i.innerHTML="",h.textContent=w.message,h.classList.remove("hidden")}}async function y(){const z=Array.from(l.files??[]);if(z.length===0)return;const $=d(),w=[];let b=0;const I=[];for(const g of z)try{const S=q(await g.text()),D=v(S,["I","p2","p2"]);if(!me(D,$)){I.push(D||g.name);continue}w.push({period:D,identifier:Number(v(S,["I","p2","p1"])||"0"),healthGr:A(S,"VI","p7")})}catch{b+=1}const{totalGr:j,months:u}=he(w);m.value=f(j),u.length>0&&(r.value=String(u.length));const k=[];u.length&&k.push(`${u.length}/12 mies. (${H($)})`),I.length&&k.push(`poza rokiem: ${I.join(", ")}`),b&&k.push(`${b} plik(ów) nie wczytano`),s.textContent=k.length?k.join(" · "):"nie wczytano poprawnych DRA",p()}[t,a,r,m,n].forEach(z=>{z.addEventListener("input",p),z.addEventListener("change",p)}),l.addEventListener("change",()=>void y()),p()}function Ce(e,t,a){if(!c)return;const r=q(c.xml);Z(r,{taxScale:e,flatTax:t}),Y(r,{taxScale:e,flatTax:t,podstawaGr:a});const n=oe(r),o=new Blob([n],{type:"application/xml"}),l=URL.createObjectURL(o),s=document.createElement("a");s.href=l;const m=c.period||"DRA";s.download=`DRA_${m}_zdrowotna.xml`,s.click(),URL.revokeObjectURL(l)}const W=document.querySelector("#app");W&&xe(W);
