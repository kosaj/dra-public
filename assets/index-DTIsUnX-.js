(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const P="http://www.zus.pl/2026/KEDU_5_7";function M(e){var r;const t=new DOMParser().parseFromString(e,"application/xml"),a=t.getElementsByTagName("parsererror")[0];if(a)throw new Error(`Nieprawidłowy XML: ${((r=a.textContent)==null?void 0:r.trim())??"błąd parsowania"}`);return A(t),t}function A(e){const t=e.getElementsByTagNameNS(P,"ZUSDRA")[0];if(!t)throw new Error("W pliku nie ma elementu ZUSDRA — czy to na pewno DRA (KEDU 5.7)?");return t}function G(e,t){for(const a of Array.from(e.children))if(a.localName===t)return a;return null}function _(e,t,a){const r=A(e),n=G(r,t);if(!n)throw new Error(`Brak bloku ${t} w DRA`);const o=G(n,a);if(!o)throw new Error(`Brak pola ${t}/${a} w DRA`);return o}function j(e,t,a){const r=A(e),n=G(r,t);return n?G(n,a)!==null:!1}function S(e){const t=e.replace(/\s/g,"").replace(",","."),a=/^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(t);if(!a)throw new Error(`Nieprawidłowa kwota: "${e}"`);const[,r,n,o=""]=a,i=(o+"00").slice(0,2),p=Number(n)*100+Number(i);return r==="-"?-p:p}function E(e){if(!Number.isInteger(e))throw new Error(`Grosze muszą być liczbą całkowitą: ${e}`);const t=e<0?"-":"",a=Math.abs(e),r=Math.floor(a/100),n=a%100;return`${t}${r}.${String(n).padStart(2,"0")}`}const Y=" ";function f(e){const t=E(e),a=t.startsWith("-"),[r,n]=(a?t.slice(1):t).split("."),o=r.replace(/\B(?=(\d{3})+(?!\d))/g,Y);return`${a?"-":""}${o},${n}`}const J=["p2","p5","p7"];function v(e,t,a){return S(_(e,t,a).textContent??"0")}function X(e,t,a,r){_(e,t,a).textContent=E(r)}function W(e,t){const a=(t.taxScale??0)+(t.flatTax??0);if(a<0)throw new Error("Kwota składki nie może być ujemna");const r=v(e,"VI","p7"),n=v(e,"IX","p2");for(const o of J)X(e,"VI",o,v(e,"VI",o)+a);return X(e,"IX","p2",n+a),O(e),{delta:a,healthBefore:r,healthAfter:v(e,"VI","p7"),totalBefore:n,totalAfter:v(e,"IX","p2")}}function O(e){const t=v(e,"IV","p37"),a=v(e,"VI","p7"),r=j(e,"VII","p3")?v(e,"VII","p3"):0,n=v(e,"IX","p2"),o=t+a+r;if(n!==o)throw new Error(`Niespójna suma do zapłaty IX/p2 = ${E(n)}, oczekiwano ${E(o)} (społeczne ${E(t)} + zdrowotna ${E(a)} + FP ${E(r)})`)}function Q(e){const t=new XMLSerializer().serializeToString(e);return t.startsWith("<?xml")?t.endsWith(`
`)?t:t+`
`:`<?xml version="1.0" encoding="UTF-8"?>
${t}
`}const K=.09,ee=.049,T=480600;function te(e){return Math.round(e*K)}const U={2022:{minMonthlyHealthGr:27090,minWageGr:301e3},2023:{minMonthlyHealthGr:31410,minWageGr:349e3},2024:{minMonthlyHealthGr:38178,minWageGr:424200},2025:{minMonthlyHealthGr:31496,minWageGr:466600},2026:{minMonthlyHealthGr:43254,minWageGr:480600}},V=2026;function ne(e){return(U[e]??U[V]).minMonthlyHealthGr}const N=[{label:"przychód do 60 000 zł",revenueFromGr:0,revenueToGr:6e6,contributionGr:49835},{label:"przychód 60 000 – 300 000 zł",revenueFromGr:6e6,revenueToGr:3e7,contributionGr:83058},{label:"przychód powyżej 300 000 zł",revenueFromGr:3e7,revenueToGr:null,contributionGr:149504}];function ae(e){return N.find(t=>e>=t.revenueFromGr&&(t.revenueToGr===null||e<=t.revenueToGr))??N[N.length-1]}function re(e,t,a){if(!e)return 0;const r=t.trim();return r===""?a:S(r)}function oe(e,t,a){const r=re(e,t,a);if(e&&t.trim()!==""&&r<a)throw new Error(`kwota nie może być niższa niż minimum ${f(a)} zł`);return r}function ie(e,t,a,r){const o=Math.max(0,Math.round(t*(e==="scale"?K:ee))),i=a*r;return Math.max(o,i)}function F(e){return`luty ${e} – styczeń ${e+1}`}function se(e,t){const a=/^(\d{4})-(\d{2})$/.exec(e);if(!a)return!1;const r=Number(a[1]),n=Number(a[2]);return n<1||n>12?!1:r===t&&n>=2||r===t+1&&n===1}function le(e,t){return{dueGr:e,paidGr:t,balanceGr:e-t}}function ce(e){const t=new Map;for(const n of e){if(!n.period)continue;const o=t.get(n.period);(!o||n.identifier>o.identifier)&&t.set(n.period,n)}const a=[...t.keys()].sort();return{totalGr:a.reduce((n,o)=>n+t.get(o).healthGr,0),months:a}}const de={k7:/^\d{1,5}\.\d{2}$/,k8:/^\d{1,6}\.\d{2}$/,k9:/^\d{1,7}\.\d{2}$/,k10:/^\d{1,8}\.\d{2}$/,k11:/^\d{1,9}\.\d{2}$/,k12:/^\d{1,10}\.\d{2}$/,k13:/^\d{1,11}\.\d{2}$/,b:/^(true|false|0|1)$/,d:/^\d{4}-\d{2}-\d{2}$/,ym:/^\d{4}-\d{2}$/,y:/^\d{4}$/,kod4:/^\d{4}$/,dig:/^\d$/,id2:/^\d{2}$/,l6:/^\d{1,6}$/,wyp:/^\d{1,2}\.\d{2}$/};function C(e,t,a,r={}){const n={};for(let o=e;o<=t;o++)n[`p${o}`]=a;return{...n,...r}}const ue=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII"],pe={I:{p1:"dig",p2:{p1:"id2",p2:"ym"},p3:"d",p4:"s20",p5:"s12"},II:{p1:"s10",p2:"s14",p3:"s11",p4:"s1",p5:"s9",p6:"s31",p7:"s31",p8:"s22",p9:"d"},III:{p1:"l6",p2:"s1",p3:"wyp"},IV:C(1,36,"k11",{p37:"k12"}),V:C(1,4,"k11",{p5:"k12"}),VI:{...C(1,5,"k11"),p6:"k10",p7:"k12"},VII:{p1:"k11",p2:"k11",p3:"k12"},VIII:{p1:"l6",p2:"l6",p3:"k12"},IX:{p1:"k13",p2:"k13"},X:{p1:{p1:"kod4",p2:"dig",p3:"dig"},p2:"k10",p3:"k10",p4:"k10",p5:"k10",p6:"s1"},XI:{p1:"b",p2:"k10",p3:"k10",p4:"k10",p5:"b",p6:"k10",p7:"k10",p8:"k10",p9:"b",p10:"k10",p11:"k10",p12:"b",p13:"k10",p14:"b",p15:"k10",p16:"k10",p17:"k10",p18:"b",p19:"k10",p20:"k10"},XII:{p1:"y",p2:"b",p3:"b",p4:"b",p5:"k11",p6:"b",p7:"k11",p8:"k11",p9:"k11",p10:"k11",p11:"k11",p12:"k11",p13:"b",p14:"k11",p15:"b",p16:"k11",p17:"k11",p18:"k11",p19:"k11",p20:"k11",p21:"b",p22:"k11",p23:"k11",p24:"k11",p25:"k11",p26:"k11",p27:"k11",p28:"k11",p29:"k11"},XIII:{p1:"d"}},me=new Set(["identyfikacja.PL","identyfikacja.UB","naglowek.DP","cechy.DP","cechy.BL","stopka.DP"]);function fe(e,t,a,r){if(t[0]==="s"){const o=Number(t.slice(1));Number.isFinite(o)&&e.length>o&&r.push({path:a,message:`wartość za długa (max ${o} znaków)`});return}const n=de[t];n&&(n.test(e.trim())||r.push({path:a,message:`"${e}" nie pasuje do formatu (${t})`}))}function Z(e,t,a,r){for(const n of Array.from(e.children)){const o=t[n.localName];if(o===void 0){r.push({path:`${a}/${n.localName}`,message:"nieznane pole"});continue}typeof o=="object"?n.children.length&&Z(n,o,`${a}/${n.localName}`,r):fe(n.textContent??"",o,`${a}/${n.localName}`,r)}}function he(e){const t=[],a=e.documentElement;if(!a||a.localName!=="KEDU")return[{path:"/",message:"brak elementu głównego KEDU"}];a.namespaceURI!==P&&t.push({path:"KEDU",message:`nieoczekiwany namespace (${a.namespaceURI??"brak"})`});const r=Array.from(a.children).filter(n=>n.localName==="ZUSDRA");if(r.length===0)return t.push({path:"KEDU",message:"brak dokumentu ZUSDRA"}),t;if(r.forEach((n,o)=>{const i=r.length>1?`ZUSDRA[${o+1}]`:"ZUSDRA";let p=-1;for(const m of Array.from(n.children)){const s=m.localName;if(me.has(s))continue;const c=pe[s];if(!c){t.push({path:`${i}/${s}`,message:"nieznany blok"});continue}const u=ue.indexOf(s);u<p&&t.push({path:`${i}/${s}`,message:"blok poza kolejnością"}),p=Math.max(p,u),Z(m,c,`${i}/${s}`,t)}}),j(e,"IV","p37")&&j(e,"VI","p7")&&j(e,"IX","p2"))try{O(e)}catch(n){t.push({path:"ZUSDRA/IX/p2",message:n.message})}return t}let d=null;function I(e,t){var r;let a=A(e);for(const n of t)a=a?Array.from(a.children).find(o=>o.localName===n)??null:null;return((r=a==null?void 0:a.textContent)==null?void 0:r.trim())??""}function R(e,t,a){const r=I(e,[t,a]);return r?S(r):0}function ke(e){const t=Object.keys(U).map(Number).sort((s,c)=>c-s).map(s=>`<option value="${s}"${s===V?" selected":""}>${s}</option>`).join("");e.innerHTML=`
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
          <input type="text" id="min-wage" inputmode="decimal" value="${f(T)}" />
          <span class="hint">nie mniej niż ${f(T)}; wpływa na minimum składki</span>
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
  `;const a=e.querySelector("#file"),r=e.querySelector("#drop"),n=e.querySelector("#load-error"),o=e.querySelector("#editor"),i=e.querySelector("#editor-empty");function p(s){e.querySelectorAll(".tab").forEach(c=>c.classList.toggle("active",c.dataset.tab===s)),e.querySelector("#tab-monthly").classList.toggle("hidden",s!=="monthly"),e.querySelector("#tab-annual").classList.toggle("hidden",s!=="annual")}e.querySelectorAll(".tab").forEach(s=>s.addEventListener("click",()=>p(s.dataset.tab??"monthly"))),a.addEventListener("change",()=>{var c;const s=(c=a.files)==null?void 0:c[0];s&&m(s)}),["dragenter","dragover"].forEach(s=>r.addEventListener(s,c=>{c.preventDefault(),r.classList.add("drag")})),["dragleave","drop"].forEach(s=>r.addEventListener(s,c=>{c.preventDefault(),r.classList.remove("drag")})),r.addEventListener("drop",s=>{var u,h;const c=(h=(u=s.dataTransfer)==null?void 0:u.files)==null?void 0:h[0];c&&m(c)}),ve(e);async function m(s){n.classList.add("hidden");try{const c=await s.text(),u=M(c);if(A(u).namespaceURI!==P)throw new Error("Nieoczekiwany namespace — spodziewano się KEDU 5.7.");const h=I(u,["XI","p13"]),D=I(u,["XI","p16"]);d={xml:c,period:I(u,["I","p2","p2"]),payerName:ye(u),social:R(u,"IV","p37"),health:R(u,"VI","p7"),laborFund:R(u,"VII","p3"),total:R(u,"IX","p2"),annual:D?S(D):null,revenue:h?S(h):null},be(e),o.classList.remove("hidden"),i.classList.add("hidden"),p("monthly")}catch(c){d=null,o.classList.add("hidden"),i.classList.remove("hidden"),n.textContent=`Nie udało się wczytać pliku: ${c.message}`,n.classList.remove("hidden")}}}function ye(e){const t=I(e,["II","p6"]),a=I(e,["II","p7"]),r=I(e,["II","p8"]);return[t,[r,a].filter(Boolean).join(" ")].filter(Boolean).join(", ")}function be(e){if(!d)return;const t=e.querySelector("#meta");t.innerHTML=`<strong>${d.payerName||"płatnik"}</strong> · okres <strong>${d.period||"—"}</strong>`,ge(e);const a=e.querySelector("#min-wage"),r=e.querySelector("#tax-scale-active"),n=e.querySelector("#tax-scale-amount"),o=e.querySelector("#tax-scale-hint"),i=e.querySelector("#flat-tax-active"),p=e.querySelector("#flat-tax-amount"),m=e.querySelector("#flat-tax-hint"),s=e.querySelector("#input-error"),c=e.querySelector("#preview"),u=e.querySelector("#download");function h(){r.checked||(n.value=""),i.checked||(p.value=""),n.disabled=!r.checked,p.disabled=!i.checked}function D(){const l=S(a.value);if(l<T)throw new Error(`Minimalne wynagrodzenie nie może być mniejsze niż ${f(T)} zł`);return l}function b(l,w,k,z){try{return oe(l,w,z)}catch(x){throw new Error(`${k}: ${x.message}`)}}function $(){const l=te(D());return{minimumGr:l,taxScale:b(r.checked,n.value,"Skala podatkowa",l),flatTax:b(i.checked,p.value,"Podatek liniowy",l)}}function g(l){c.innerHTML="",u.disabled=!0,s.textContent=l,s.classList.remove("hidden")}function y(){if(!d)return;s.classList.add("hidden");let l;try{l=$()}catch(z){g(z.message);return}const w=`puste = minimum ${f(l.minimumGr)}`;o.textContent=w,m.textContent=w;const k=l.taxScale+l.flatTax;we(c,k,{taxScale:r.checked?l.taxScale:null,flatTax:i.checked?l.flatTax:null}),ze(e,l.taxScale,l.flatTax),u.disabled=k===0}[r,i].forEach(l=>l.addEventListener("change",()=>{h(),y()})),[a,n,p].forEach(l=>l.addEventListener("input",y)),u.addEventListener("click",()=>{let l;try{l=$()}catch(w){g(w.message);return}Ie(l.taxScale,l.flatTax)}),h(),y()}function we(e,t,a){if(!d)return;const r=[],n=(o,i,p,m={})=>{const s=i!==p;return`<tr class="${m.total?"total":""} ${s?"chg":""}">
      <td>${o}</td>
      <td class="val">${f(i)}</td>
      <td class="arr">→</td>
      <td class="val ${s?"after":""}">${f(p)}</td>
    </tr>`};r.push('<tr class="head"><td>Pozycja</td><td class="val">przed (zł)</td><td class="arr"></td><td class="val">po (zł)</td></tr>'),a.taxScale!==null&&r.push(H("Dodano: skala",a.taxScale)),a.flatTax!==null&&r.push(H("Dodano: liniówka",a.flatTax)),r.push(n("Składki społeczne (IV)",d.social,d.social)),r.push(n("Składka zdrowotna (VI)",d.health,d.health+t)),r.push(n("Fundusz Pracy (VII)",d.laborFund,d.laborFund)),r.push(n("Suma do zapłaty (IX)",d.total,d.total+t,{total:!0})),d.annual!==null&&r.push(n("Roczne rozliczenie zdrow. (XI)",d.annual,d.annual)),e.innerHTML=r.join("")}function ze(e,t,a){if(!d)return;const r=e.querySelector("#schema-status");let n;try{const i=M(d.xml);W(i,{taxScale:t,flatTax:a}),n=he(i)}catch(i){n=[{path:"",message:i.message}]}if(n.length===0){r.className="schema-status ok",r.textContent="✓ Zgodne ze schematem KEDU 5.7";return}r.className="schema-status warn";const o=n.slice(0,5).map(i=>i.path?`${i.path}: ${i.message}`:i.message).join(" · ");r.textContent=`⚠ ${n.length} uwag względem schematu — ${o}${n.length>5?" …":""}`}function H(e,t){return`<tr class="added"><td>${e}</td><td class="val delta" colspan="3">+ ${f(t)}</td></tr>`}function ge(e){if(!d)return;const t=e.querySelector("#brackets"),a=d.revenue!==null?ae(d.revenue):null,r='<tr class="head"><td>Próg (roczny przychód)</td><td class="val">Składka mies. (zł)</td></tr>',n=N.map(o=>{const i=a===o;return`<tr class="${i?"sel":""}">
      <td>${o.label}${i?' <span class="badge">ten DRA</span>':""}</td>
      <td class="val">${f(o.contributionGr)}</td>
    </tr>`}).join("");t.innerHTML=r+n}function ve(e){const t=e.querySelector("#annual-form"),a=e.querySelector("#annual-income"),r=e.querySelector("#annual-months"),n=e.querySelector("#annual-year"),o=e.querySelector("#annual-year-info"),i=e.querySelector("#annual-files"),p=e.querySelector("#annual-files-info"),m=e.querySelector("#annual-paid"),s=e.querySelector("#annual-error"),c=e.querySelector("#annual-result");function u(){return Number(n.value)||V}function h(){s.classList.add("hidden");const b=u(),$=ne(b);o.textContent=`min. ${f($)}/mies · ${F(b)}`;try{const g=a.value.trim()===""?0:S(a.value),y=Number(r.value.trim());if(!Number.isInteger(y)||y<1||y>12)throw new Error("Liczba miesięcy musi być z zakresu 1–12");const l=m.value.trim()===""?0:S(m.value);if(l<0)throw new Error("Wpłacone zaliczki nie mogą być ujemne");const w=ie(t.value,g,$,y),k=le(w,l),z=k.balanceGr<0,x=k.balanceGr===0,L=x?"Rozliczone (saldo 0)":z?"Nadpłata (do zwrotu)":"Dopłata (do 20 maja)";c.innerHTML=`
        <tr class="head"><td>Pozycja</td><td class="val">Kwota (zł)</td></tr>
        <tr><td>Składka należna za rok składkowy</td><td class="val">${f(w)}</td></tr>
        <tr><td>Wpłacone zaliczki</td><td class="val">${f(l)}</td></tr>
        <tr class="total ${x?"":"chg"}"><td>${L}</td>
          <td class="val ${x?"":"after"}">${f(Math.abs(k.balanceGr))}</td></tr>
      `}catch(g){c.innerHTML="",s.textContent=g.message,s.classList.remove("hidden")}}async function D(){const b=Array.from(i.files??[]);if(b.length===0)return;const $=u(),g=[];let y=0;const l=[];for(const x of b)try{const L=M(await x.text()),q=I(L,["I","p2","p2"]);if(!se(q,$)){l.push(q||x.name);continue}g.push({period:q,identifier:Number(I(L,["I","p2","p1"])||"0"),healthGr:R(L,"VI","p7")})}catch{y+=1}const{totalGr:w,months:k}=ce(g);m.value=f(w),k.length>0&&(r.value=String(k.length));const z=[];k.length&&z.push(`${k.length}/12 mies. (${F($)})`),l.length&&z.push(`poza rokiem: ${l.join(", ")}`),y&&z.push(`${y} plik(ów) nie wczytano`),p.textContent=z.length?z.join(" · "):"nie wczytano poprawnych DRA",h()}[t,a,r,m,n].forEach(b=>{b.addEventListener("input",h),b.addEventListener("change",h)}),i.addEventListener("change",()=>void D()),h()}function Ie(e,t){if(!d)return;const a=M(d.xml);W(a,{taxScale:e,flatTax:t});const r=Q(a),n=new Blob([r],{type:"application/xml"}),o=URL.createObjectURL(n),i=document.createElement("a");i.href=o;const p=d.period||"DRA";i.download=`DRA_${p}_zdrowotna.xml`,i.click(),URL.revokeObjectURL(o)}const B=document.querySelector("#app");B&&ke(B);
