// Category selection applies to the shared corpus in every representation.
let visibleCategories=new Set(LANES.map(l=>l[0]));
function categoryVisible(e){return visibleCategories.has(e.lane||'ideas')}
/* Darstellungen sind interpretierende Modelle, keine zusätzlichen historischen Befunde. */
const REPRESENTATIONS=[['network','Denkraum','Beziehungen statt Datumsreihe'],['timeline','Zeitstrahl','Ereignisse zeitlich verorten'],['tunnel','Zeittunnel','Durch historische Spuren reisen'],['present','Erlebte Zeit','Augustinus: drei Gegenwarten'],['layers','Zeitschichten','Braudel: unterschiedliche Tempi'],['direction','Richtung & Offenheit','Hegel, Harari, Koselleck'],['medieval','Mittelalterliche Geschichtsbilder','Heilsgeschichte, Kirchenjahr und Herrschaft'],['egypt','Altägyptische Geschichtsbilder','Erneuerung, Regierungsjahre und bewahrte Ordnung'],['materialism','Historischer Materialismus','Produktionsweisen, Macht und gesellschaftlicher Wandel'],['recurrence','Kreis & Spirale','Nietzsche und die Wiederholungsfrage'],['memoria','Memoria & Erinnerung','Halbwachs und Assmann: soziale Rahmen, Weitergabe und Auswahl']];
let representation='timeline',presentCase='war',directionChoice='open',repeatShape='spiral',repeatA='revolution',repeatB='haiti',podcastTime=0;
const modeState={layerCase:'roman',materialCase:'factory',materialLens:'forces',medievalLens:'ages',egyptLens:'renewal',hideKing:false};
const PODCAST_PATH='media/wiederholt-sich-die-geschichte.mp3';
const podcastSrc=()=>globalThis.ZEITSPUREN_MEDIA?.[PODCAST_PATH]||PODCAST_PATH;
const timeStamp=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function modeNote(key,label,placeholder){return `<label for="modeNote">${esc(label)}</label><textarea id="modeNote" data-note-key="${key}" placeholder="${esc(placeholder)}">${esc(state.notes[key]||'')}</textarea><p class="small">Deine Überlegungen werden im Arbeitsstand gespeichert und mit exportiert.</p>`}
function eventLink(id,label){const e=byId(id);return `<button data-explore="${esc(id)}">${esc(label||e?.title||id)} <span aria-hidden="true">↗</span></button>`}
function switchRepresentation(value){worldSheet='';if(!REPRESENTATIONS.some(r=>r[0]===value))return;stopTunnel();if(GLOBAL_LENSES[representation])worldAssumptions[representation]=worldAssumption;if(GLOBAL_LENSES[value])worldAssumption=worldAssumptions[value]??true;lensExample=false;const audio=$('#podcast');if(audio){podcastTime=audio.currentTime;audio.pause()}representation=value;render();}
function prepareRepresentation(){
 document.body?.classList.toggle("world-workspace-active",!!GLOBAL_LENSES[representation]);
 $$('.representation-button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.mode===representation||(b.dataset.mode==='medieval'&&!!GLOBAL_LENSES[representation])));b.onclick=()=>switchRepresentation(b.dataset.mode)});
 const chrono=representation==='timeline';const browsing=true;
 $$('.timeline-nav,.timeline-caption,#scroll,.timeline-foot,#timelineUndated').forEach(el=>el.hidden=!chrono);
 $('.toolbar').hidden=!browsing;$('#modeStage').hidden=chrono;
 $$('.viewoptions label').forEach(el=>{if(el.querySelector('#scale,#zoom'))el.hidden=!chrono});$('#epoch').hidden=!chrono;
 const picker=$('#conceptView');if(picker){picker.innerHTML=perspectiveOptions(representation,true);picker.value=GLOBAL_LENSES[representation]?representation:'';picker.onchange=e=>{if(e.target.value)switchRepresentation(e.target.value)}}
 const memoryButton=$('#memoryView');if(memoryButton){memoryButton.onclick=()=>switchRepresentation('memoria');memoryButton.setAttribute('aria-pressed',String(representation==='memoria'))}
 $('#modeHelp').textContent=REPRESENTATIONS.find(r=>r[0]===representation)[2];
}
function wireMode(){
 $$('#modeStage [data-explore]').forEach(b=>b.onclick=()=>openEvent(b.dataset.explore));
 $$('#modeStage [data-switch]').forEach(b=>b.onclick=()=>switchRepresentation(b.dataset.switch));
 const note=$('#modeNote');if(note)note.oninput=()=>{state.notes[note.dataset.noteKey]=note.value;save()};
}
function renderMode(){if(periodCompare){render();return}stopTunnel();if(GLOBAL_LENSES[representation]&&!lensExample){renderLensUniverse();return}const stage=$('#modeStage');stage.innerHTML=({network:networkHtml,tunnel:tunnelHtml,present:presentHtml,layers:layersHtml,direction:directionHtml,recurrence:recurrenceHtml,materialism:materialismHtml,medieval:medievalHtml,egypt:egyptHtml})[representation]();if(GLOBAL_LENSES[representation]){stage.insertAdjacentHTML('afterbegin','<button id="returnUniverse">← Gesamten Bestand durch dieses Konzept betrachten</button>');$('#returnUniverse').onclick=()=>{lensExample=false;renderMode()}}wireMode();
 if(representation==='network'){$$('#modeStage [data-topic]').forEach(b=>b.onclick=()=>{networkTopic=b.dataset.topic;renderMode()})}
 if(representation==='tunnel')wireTunnel();
 if(representation==='medieval'||representation==='egypt'){$$('[data-history-lens]').forEach(b=>b.onclick=()=>{modeState[representation+'Lens']=b.dataset.historyLens;renderMode()});const k=$('#kingOmission');if(k)k.onchange=()=>{modeState.hideKing=k.checked;renderMode()}}
 if(representation==='materialism'){$('#materialCase').onchange=e=>{modeState.materialCase=e.target.value;renderMode()};$$('[data-material-lens]').forEach(b=>b.onclick=()=>{modeState.materialLens=b.dataset.materialLens;renderMode()})}
 if(representation==='present')$('#presentCase').onchange=e=>{presentCase=e.target.value;renderMode()};
 if(representation==='layers')$('#layerCase').onchange=e=>{modeState.layerCase=e.target.value;renderMode()};
 if(representation==='direction')$$('[data-direction]').forEach(b=>b.onclick=()=>{directionChoice=b.dataset.direction;renderMode()});
 if(representation==='recurrence'){
  $$('[data-shape]').forEach(b=>b.onclick=()=>{const a=$('#podcast');podcastTime=a.currentTime;repeatShape=b.dataset.shape;renderMode()});
  $('#repeatA').onchange=e=>{podcastTime=$('#podcast').currentTime;repeatA=e.target.value;renderMode()};$('#repeatB').onchange=e=>{podcastTime=$('#podcast').currentTime;repeatB=e.target.value;renderMode()};
  $('#repeatCompare').onclick=()=>openCompare(repeatA,repeatB);
  const a=$('#podcast');a.onloadedmetadata=()=>{if(podcastTime<a.duration)a.currentTime=podcastTime};a.onpause=()=>{podcastTime=a.currentTime};
  $('#audioMark').onclick=()=>{const n=$('#modeNote');n.value+=(n.value?'\n':'')+'['+timeStamp(a.currentTime)+'] ';n.dispatchEvent(new Event('input'));n.focus()};
 }
}
let networkTopic='all';
const CONCEPT_GROUPS=[
 {id:'experience',title:'Wie erleben wir Zeit?',color:'#dd9d6c',description:'Vergangenes erinnern, Gegenwärtiges wahrnehmen, Künftiges erwarten.',items:['medievalworld','egyptworld','augustine','koselleck','timeforms'],mode:'present'},
 {id:'change',title:'Hat Geschichte eine Richtung?',color:'#94b8aa',description:'Fortschritt, unterschiedliche Tempi und nicht eingeschlagene Wege.',items:['materialism','hegel','braudel','macrohistory','hararipaths','environmenthistory'],mode:'direction'},
 {id:'knowing',title:'Wie wird Vergangenheit erkennbar?',color:'#93b5d3',description:'Spuren befragen, Erklärungen prüfen, Ordnungen hinterfragen.',items:['bloch','history','period','timetable','harariorders','ai'],mode:'layers'},
 {id:'remember',title:'Wer erinnert – und wer nicht?',color:'#b6a3ce',description:'Memoria: soziale Rahmen, alltägliche Weitergabe und kulturelle Formen.',items:['halbwachs','assmann','memory'],mode:'memoria'},
 {id:'repeat',title:'Was kehrt wieder – und wozu?',color:'#c4a474',description:'Wiederkunft, Rhythmus und begründeter historischer Vergleich.',items:['nietzsche','recurrence'],mode:'recurrence'}
];
function networkHtml(query=$('#search').value||'',own=onlyOwn){const items=lensItems(query,own),visibleIds=new Set(items.map(e=>e.id));const groups=CONCEPT_GROUPS.filter(g=>networkTopic==='all'||g.id===networkTopic);return `<section class="network-space"><div class="mode-heading"><p class="eyebrow">KEINE THEORIE IST EIN PUNKT AUF EINER FORTSCHRITTSLEITER</p><h2>Zeit denken. Beziehungen entdecken.</h2><p>Hier ordnen Fragen die Begriffe. Die Nachbarschaften sind ein Gesprächsangebot, keine Behauptung, dass ein Autor den nächsten verursacht hätte. Entstehungsdaten findest du weiterhin in den Popups.</p></div><div class="topic-filter" aria-label="Denkfragen filtern"><button data-topic="all" aria-pressed="${networkTopic==='all'}">Alle Fragen</button>${CONCEPT_GROUPS.map(g=>`<button data-topic="${g.id}" aria-pressed="${networkTopic===g.id}">${g.title}</button>`).join('')}</div><div class="constellation"><div class="network-core">ZEIT<br><small>erleben · ordnen · deuten</small></div><div class="concept-groups">${groups.map(g=>`<section class="concept-island" style="--group:${g.color}"><h3>${g.title}</h3><p>${g.description}</p><div class="concept-links">${g.items.filter(id=>visibleIds.has(id)).map(id=>eventLink(id)).join('')}</div><button class="enter-model" data-switch="${g.mode}">Als Darstellung erproben →</button></section>`).join('')}</div></div><div class="bridge-card"><strong>Eine Brücke zwischen den Fragen</strong><p>Bei Augustinus ist Erinnerung eine Weise gegenwärtigen Erlebens; Halbwachs fragt, wie soziale Gruppen Erinnerungen formen. Das sind verschiedene Fragen an denselben Vorgang.</p>${['augustine','halbwachs'].filter(id=>visibleIds.has(id)).map(id=>eventLink(id)).join('')}</div>${networkCorpusHtml(items)}<p class="model-limit">Die Fragegruppen sind kuratierte Zugänge; der Bestand darunter ist vollständig. Eigene Verbindungen sind möglich: Halte sie über «Mit anderer Spur vergleichen» mit einer Begründung fest.</p></section>`}
function tunnelItems(query=$('#search').value||'',own=onlyOwn){return lensItems(query,own)}
// Camera position is elapsed historical time, never an event index.
let tunnelTime=1800,tunnelSpan=25,tunnelAngle=0,tunnelPlaying=false,tunnelFrame=0;
const tunnelOrdinal=y=>y<0?y+1:y;
const tunnelYear=t=>Math.round(t)<=0?Math.round(t)-1:Math.round(t);
function tunnelBounds(items){const dates=items.filter(e=>Number.isFinite(e.year)).map(e=>tunnelOrdinal(e.year));return dates.length?[Math.min(...dates)-100,Math.max(...dates)+100]:[-17000,2100]}
function tunnelProject(lane,delta){const i=LANES.findIndex(l=>l[0]===lane),angle=(i/ LANES.length*Math.PI*2)+tunnelAngle,scale=1/(1+delta*.55);return {x:600+Math.cos(angle)*380*scale,y:340+Math.sin(angle)*220*scale,scale}}
function tunnelScene(items){
 const active=LANES.filter(l=>visibleCategories.has(l[0]));
 const point=(lane,z)=>{const p=tunnelProject(lane,z);return `${p.x.toFixed(1)},${p.y.toFixed(1)}`};
 const planes=[-.65,0,.5,1,2,3,4];
 let html='<svg viewBox="0 0 1200 720" role="group" aria-label="Räumlicher Zeitkorridor: Kategorienachsen und gemeinsame Zeitebenen"><defs><radialGradient id="timeDepth"><stop stop-color="#345963"/><stop offset="1" stop-color="#0a2029"/></radialGradient></defs><rect width="1200" height="720" fill="url(#timeDepth)"/><circle cx="600" cy="340" r="5" fill="#dfbd7d"/>';
 for(const z of [...planes].reverse()){
  const s=1/(1+z*.55),label=yr(tunnelYear(tunnelTime+z*tunnelSpan));
  html+=`<ellipse cx="600" cy="340" rx="${380*s}" ry="${220*s}" fill="none" stroke="${z===0?'#dfbd7d':'#60808a'}" stroke-opacity="${z===0?'.85':'.3'}" stroke-width="${z===0?2:1}"/><text x="600" y="${340-220*s-8}" text-anchor="middle" fill="${z===0?'#ffe1a3':'#c4d8dc'}" font-size="${z===0?19:13}">${esc(label)}${z===0?' · Standort':''}</text>`;
 }
 for(const [id,label,,color] of active){const p=tunnelProject(id,-.8);html+=`<path d="M${point(id,-.8)} L${point(id,4)}" stroke="${color}" stroke-width="4"/><text x="${Math.max(130,Math.min(1070,p.x))}" y="${Math.max(28,Math.min(680,p.y))}" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">${esc(label)}</text>`}
 const shown=items.filter(e=>Number.isFinite(e.year)).map(e=>({e,z:(tunnelOrdinal(e.year)-tunnelTime)/tunnelSpan})).filter(o=>o.z>=-.65&&o.z<=4).sort((a,b)=>b.z-a.z);
 for(const {e,z} of shown){const p=tunnelProject(e.lane,z),w=154*p.scale,h=(e.image?106:66)*p.scale;html+=`<foreignObject x="${p.x-w/2}" y="${p.y-h/2}" width="${w}" height="${h}" style="overflow:visible"><button xmlns="http://www.w3.org/1999/xhtml" class="space-event" data-explore="${esc(e.id)}" style="width:154px;height:${e.image?106:66}px;transform:scale(${p.scale});transform-origin:top left;border-color:${LANES.find(l=>l[0]===e.lane)?.[3]||'#abc'}" aria-label="${esc(e.title+' · '+spurDate(e))}">${e.image?`<img src="${imageSrc(e.image)}" alt=""/>`:''}<span><small>${esc(yr(e.year))}</small><strong>${esc(e.title)}</strong></span></button></foreignObject>`}
 html+='</svg>';
 return {html,shown};
}
function tunnelHtml(items=tunnelItems()){
 const dated=items.filter(e=>Number.isFinite(e.year)),undated=items.filter(e=>!Number.isFinite(e.year)),[min,max]=tunnelBounds(items);tunnelTime=Math.max(min,Math.min(max,tunnelTime));
 return `<section class="spatial-tunnel"><div class="mode-heading"><p class="eyebrow">ZEIT ALS TIEFE · KATEGORIEN ALS EIGENE ACHSEN</p><h2>Durch Zeiträume reisen.</h2><p>Jede farbige Achse trägt eine Kategorie. Gleiche Daten liegen auf derselben räumlichen Zeitebene. Bewege deinen Standort auch durch Jahre ohne Eintrag; die Kategorien oben bleiben frei kombinierbar.</p></div><div class="space-controls"><label>Standort <input id="tunnelDate" type="number" step="1" value="${tunnelYear(tunnelTime)}" aria-label="Jahr; negative Zahlen vor unserer Zeitrechnung"></label><button id="tunnelGo">Jahr ansteuern</button><label>Jahre je Tiefenabschnitt <select id="tunnelSpan">${[25,100,200,500,2000,10000].map(n=>`<option value="${n}" ${n===tunnelSpan?'selected':''}>${n}</option>`).join('')}</select></label><button id="tunnelPlay" aria-pressed="false">▶ Zeitfahrt</button><label>Richtung <select id="tunnelDirection"><option value="1">Zur späteren Zeit</option><option value="-1">Zur früheren Zeit</option></select></label></div><div class="space-time-readout"><output id="tunnelClock">${yr(tunnelYear(tunnelTime))}</output><span id="tunnelVisible" aria-live="polite"></span></div><label for="tunnelRange">Standort stufenlos verschieben</label><input id="tunnelRange" type="range" min="${min}" max="${max}" step="any" value="${tunnelTime}"><div class="space-range-labels"><span>${yr(tunnelYear(min))}</span><span>${yr(tunnelYear(max))}</span></div><div id="spaceScene" class="space-scene" tabindex="0" aria-label="Zeitkorridor. Pfeiltasten bewegen durch die Zeit, Plus und Minus ändern die Tiefe.">${tunnelScene(items).html}</div><p class="space-help">Im Bild scrollen oder mit ↑ / ↓ durch die Zeit fahren. Links / rechts dreht den Blick. Auf Touchgeräten im Bild nach oben oder unten ziehen. Bilder öffnen die Quellenfenster.</p><label for="tunnelAngle">Blick um die Zeitachse drehen</label><input id="tunnelAngle" type="range" min="-180" max="180" value="${tunnelAngle*180/Math.PI}"><section class="space-near"><h3>Spuren im sichtbaren Zeitraum</h3><p>Die Liste erschliesst auch überlagerte Bilder. Räumliche Nähe allein belegt keinen historischen Zusammenhang.</p><div id="spaceNear"></div></section>${!items.length?'<p>Keine Spur in dieser Auswahl. Schalte eine Kategorie ein oder ändere die Suche.</p>':''}<details class="space-inventory"><summary>Gesamten ausgewählten Bestand öffnen (${dated.length} datierte Spuren)</summary><div>${dated.map(e=>eventLink(e.id)).join('')}</div></details>${undated.length?`<details class="space-inventory"><summary>Begriffsraum ohne zeitliche Position (${undated.length})</summary><p>Diese Begriffe haben kein gesetztes Datum und liegen deshalb ausserhalb der Zeitachse.</p><div>${undated.map(e=>eventLink(e.id)).join('')}</div></details>`:''}<p class="model-limit">Die Tiefe misst Jahre, nicht Fortschritt. Perspektive verkleinert entfernte Objekte; der gewählte Jahresmassstab bleibt gleichmässig. Die Anordnung der Kategorien ist eine Lesehilfe, keine Landkarte oder Rangordnung. Datierungen bleiben so genau oder ungenau wie die Quellen; ein Punkt ist kein Beweis für einen plötzlichen Wandel.</p></section>`;
}
function stopTunnel(){tunnelPlaying=false;if(tunnelFrame&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(tunnelFrame);tunnelFrame=0;const b=$('#tunnelPlay');if(b){b.textContent='▶ Zeitfahrt';b.setAttribute('aria-pressed','false')}}
function wireTunnel(){
 const items=tunnelItems(),[min,max]=tunnelBounds(items),scene=$('#spaceScene');
 const paint=()=>{const result=tunnelScene(items);scene.innerHTML=result.html;installProfileZoom();$('#tunnelRange').value=tunnelTime;$('#tunnelDate').value=tunnelYear(tunnelTime);$('#tunnelClock').textContent=yr(tunnelYear(tunnelTime));$('#tunnelVisible').textContent=`${result.shown.length} datierte Spuren im Sichtfeld · ${items.length} im ausgewählten Bestand`;$('#spaceNear').innerHTML=result.shown.sort((a,b)=>a.e.year-b.e.year).map(({e})=>eventLink(e.id,yr(e.year)+' · '+e.title)).join('')||'<p>In diesem Zeitraum enthält die Auswahl keine datierte Spur. Du kannst trotzdem weiter durch die Zeit fahren.</p>';$$('#modeStage [data-explore]').forEach(b=>b.onclick=()=>{stopTunnel();openEvent(b.dataset.explore)})};
 const move=t=>{tunnelTime=Math.max(min,Math.min(max,t));paint();if(tunnelTime===min||tunnelTime===max)stopTunnel()};
 $('#tunnelRange').oninput=e=>{stopTunnel();move(Number(e.target.value))};
 $('#tunnelDate').onfocus=stopTunnel;const goToDate=()=>{const e={target:$('#tunnelDate')};stopTunnel();const n=Number(e.target.value);if(!Number.isFinite(n)||n===0){e.target.setCustomValidity('Bitte ein Jahr ohne Jahr null eingeben.');e.target.reportValidity();return}e.target.setCustomValidity('');move(tunnelOrdinal(n))};$('#tunnelGo').onclick=goToDate;$('#tunnelDate').onkeydown=e=>{if(e.key==='Enter')goToDate()};
 $('#tunnelSpan').onchange=e=>{tunnelSpan=Number(e.target.value);paint()};
 $('#tunnelAngle').oninput=e=>{tunnelAngle=Number(e.target.value)*Math.PI/180;paint()};
 scene.onwheel=e=>{if(!e.deltaY)return;e.preventDefault();stopTunnel();move(tunnelTime+Math.max(-120,Math.min(120,e.deltaY))*tunnelSpan/900)};
 let touchY=null;scene.onpointerdown=e=>{if(e.pointerType==='mouse'||e.target.closest('button'))return;touchY=e.clientY;scene.setPointerCapture(e.pointerId)};scene.onpointermove=e=>{if(touchY===null)return;stopTunnel();move(tunnelTime+(touchY-e.clientY)*tunnelSpan/250);touchY=e.clientY};scene.onpointerup=scene.onpointercancel=()=>touchY=null;
 scene.onkeydown=e=>{if(e.target!==scene)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','+','-'].includes(e.key)){e.preventDefault();stopTunnel();if(e.key==='ArrowUp'||e.key==='ArrowDown')move(tunnelTime+(e.key==='ArrowUp'?1:-1)*tunnelSpan/20);else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){tunnelAngle+=(e.key==='ArrowLeft'?-1:1)*.1;$('#tunnelAngle').value=tunnelAngle*180/Math.PI;paint()}else{tunnelSpan=Math.max(5,Math.min(20000,tunnelSpan*(e.key==='+'?.8:1.25)));paint()}}};
 $('#tunnelPlay').onclick=()=>{if(tunnelPlaying){stopTunnel();return}tunnelPlaying=true;$('#tunnelPlay').textContent='Ⅱ Anhalten';$('#tunnelPlay').setAttribute('aria-pressed','true');let last=0;const frame=now=>{if(!tunnelPlaying||representation!=='tunnel'||!scene.isConnected){stopTunnel();return}if(last)move(tunnelTime+Math.min(now-last,100)/1000*tunnelSpan/8*Number($('#tunnelDirection').value));last=now;if(tunnelPlaying)tunnelFrame=requestAnimationFrame(frame)};tunnelFrame=requestAnimationFrame(frame)};
 paint();
}

const PRESENT_CASES={war:{title:'Die Todesanzeige lesen – im November 1914',memory:'Der Tod eines Feuerwehrmitglieds liegt zurück. In der Anzeige wird er benannt und als Heldentod gedeutet.',attention:'Die Anzeige wird in einer damaligen Gegenwart veröffentlicht und gelesen. Wir untersuchen heute die gedruckte Spur dieses Vorgangs.',expectation:'Das versprochene ehrende Andenken richtet sich auf eine noch offene Zukunft. Es belegt eine formulierte Erwartung, nicht deren spätere Erfüllung.',id:'war'},memory:{title:'Vor einem Stolperstein stehen – heute',memory:'Namen und Daten verweisen auf frühere Lebens- und Verfolgungsgeschichten.',attention:'Eine Person liest, hält inne oder geht weiter. Die Begegnung mit dem Zeichen findet in ihrer Gegenwart statt.',expectation:'Welche Wirkung das Erinnerungszeichen künftig haben soll, muss an Äusserungen seiner Initiator*innen untersucht werden; das Foto allein belegt sie nicht.',id:'memory'}};
function presentHtml(){const c=PRESENT_CASES[presentCase];return `<section class="present-view"><div class="mode-heading"><p class="eyebrow">AUGUSTINUS · ZEIT IM BEWUSSTSEIN</p><h2>Drei Gegenwarten. Ein Augenblick.</h2><p>Vergangenheit und Zukunft liegen hier nicht wie Orte links und rechts. Erinnern und Erwarten geschehen jetzt. Das Modell veranschaulicht Augustinus’ Analyse des Zeiterlebens; seine Frage nach göttlicher Ewigkeit reicht darüber hinaus.</p>${eventLink('augustine','Augustinus kennenlernen')}</div><label for="presentCase">Einen Fall betrachten</label><select id="presentCase">${Object.entries(PRESENT_CASES).map(([id,c])=>`<option value="${id}" ${presentCase===id?'selected':''}>${c.title}</option>`).join('')}</select><div class="present-orbit"><div class="present-now">GEGENWÄRTIGES<br><strong>Erleben</strong></div><div class="present-triad">${[['Erinnerung','Gegenwart des Vergangenen',c.memory],['Aufmerksamkeit','Gegenwart des Gegenwärtigen',c.attention],['Erwartung','Gegenwart des Künftigen',c.expectation]].map(([title,sub,t])=>`<article><small>${sub}</small><h3>${title}</h3><p>${t}</p></article>`).join('')}</div></div><div class="related">${eventLink(c.id,'Das Material untersuchen')}${eventLink('halbwachs','Wer prägt die Erinnerung?')}${eventLink('koselleck','Wie offen war die Erwartung?')}</div>${modeNote('mode-present-'+presentCase,'Wo würdest du die Grenze zwischen den drei Weisen ziehen?','Ordne eine konkrete Formulierung aus dem Material zu. Wo greifen Erinnern, Wahrnehmen und Erwarten ineinander?')}</section>`}
const LAYER_CASES={roman:{title:'Herrschaftswechsel und römische Infrastruktur',rows:[['Ereignis','476: Ein weströmischer Kaiser wird abgesetzt.','romeend',22],['Mittlere Dauer','Betrieb und Reparatur von Verkehrswegen oder Wasserleitungen: lokal zu untersuchende Prozesse.','infrastructure',62],['Lange Dauer','Landschaftliche Bedingungen von Routen: ein Untersuchungsfeld, keine unveränderliche Naturkulisse.','environmenthistory',94]]},industrial:{title:'Ein Fabrikbild und viele Veränderungsrhythmen',rows:[['Ereignis / Objekt','1872–1875: Menzel arbeitet an seinem Eisenwalzwerk. Das Bild datiert nicht den Beginn der Industrialisierung.','industry',22],['Mittlere Dauer','Veränderungen von Arbeitsorganisation, Technik und Energieversorgung verlaufen regional verschieden.','industry',62],['Lange Dauer','Landnutzung und Ressourcenabhängigkeit verbinden frühere und industrielle Lebensweisen.','environmenthistory',94]]}};
function layersHtml(){const c=LAYER_CASES[modeState.layerCase];return `<section class="layers-view"><div class="mode-heading"><p class="eyebrow">BRAUDEL · NICHT ALLES ÄNDERT SICH IM SELBEN TAKT</p><h2>Unter einem Ereignis liegen lange Geschichten.</h2><p>Eine Absetzung hat ein Datum. Wege, Arbeitsweisen und Landschaften haben andere Veränderungsrhythmen. Die Bänder zeigen unterschiedliche Betrachtungsebenen; ihre Breiten sind schematisch, keine gemessenen Dauern.</p>${eventLink('braudel','Braudels Ansatz kennenlernen')}</div><label for="layerCase">Fall wechseln</label><select id="layerCase">${Object.entries(LAYER_CASES).map(([id,c])=>`<option value="${id}" ${modeState.layerCase===id?'selected':''}>${c.title}</option>`).join('')}</select><div class="strata">${c.rows.map(([label,text,id,w],i)=>`<article style="--length:${w}%;--stratum:${i}"><div class="strata-band" aria-hidden="true"></div><div><p class="eyebrow">${label}</p><p>${text}</p>${eventLink(id,'Diese Ebene untersuchen')}</div></article>`).join('')}</div><div class="model-limit">Keine Stufenleiter: «lange Dauer» bedeutet weder älter noch wichtiger. Erst die Wechselwirkung erklärt einen konkreten Fall.</div>${modeNote('mode-layers-'+modeState.layerCase,'Wo wirken die Ebenen zusammen?','Beschreibe eine Verbindung zwischen zwei Ebenen. Was ist im Material belegt, was müsste erst untersucht werden?')}</section>`}
function directionHtml(){const teleology=directionChoice==='directed';return `<section class="direction-view"><div class="mode-heading"><p class="eyebrow">HEGEL · HARARI · KOSELLECK</p><h2>Eine Richtung – oder offene Wege?</h2><p>Der Wechsel verändert die Erzählform, nicht die historischen Tatsachen. Hegels Fortschritt im Bewusstsein der Freiheit steht dabei neben Hararis Spannung zwischen grossen Entwicklungslinien und offenen Verläufen.</p></div><div class="model-toggle"><button data-direction="directed" aria-pressed="${teleology}">Vom Ziel her erzählen</button><button data-direction="open" aria-pressed="${!teleology}">Möglichkeiten offenhalten</button></div><div class="direction-drawing"><svg viewBox="0 0 900 260" role="img" aria-label="${teleology?'Gerichtete Folge von Athen über Haiti bis zum Schweizer Frauenstimmrecht':'Drei historische Fälle, deren offene Fortsetzungen nicht auf ein gemeinsames Ende zusammenlaufen'}">${teleology?'<path d="M80 130H810l-20-12m20 12l-20 12" stroke="#d59962" stroke-width="4" fill="none"/>':'<g fill="none" stroke="#8faeaa" stroke-width="3"><path d="M100 130L250 50M100 130L250 210M400 130L550 50M400 130L550 210M700 130L850 50M700 130L850 210" stroke-dasharray="6 6"/></g>'}<g fill="#f1d4ad"><circle cx="100" cy="130" r="11"/><circle cx="400" cy="130" r="11"/><circle cx="700" cy="130" r="11"/></g><g fill="white" font-size="19" font-family="Arial"><text x="65" y="172">Athen</text><text x="365" y="172">Haiti</text><text x="638" y="172">Schweiz 1971</text></g></svg></div><div class="interpretation"><h3>${teleology?'Was die Zielerzählung verführt zu übersehen':'Offen bedeutet nicht ursachenlos'}</h3><p>${teleology?'Die Linie legt nahe, drei Fälle seien Stationen desselben Fortschritts. Dabei wechseln die betroffenen Menschen und die Bedeutung von Freiheit. Sie ist ein bewusst zugespitztes Prüfmodell, keine von Hegel verfasste Ereignisreihe.':'Die gestrichelten Äste stehen für Fragen nach damaligen Möglichkeiten, nicht für belegte alternative Ereignisse. Ursachen, Zwänge und Entscheidungen bleiben untersuchbar, auch wenn kein notwendiges Gesamtziel feststeht.'}</p></div><div class="related">${eventLink('hegel')}${eventLink('hararipaths')}${eventLink('koselleck')}${eventLink('athens')}${eventLink('haiti')}${eventLink('vote')}</div>${modeNote('mode-direction','Prüfe beide Darstellungen am selben Fall','Was legt der Pfeil nahe? Was musst du für einen offenen Ast belegen? Notiere, was jede Darstellung sichtbar macht und was sie verdeckt.')}</section>`}
function spiralSvg(kind){const circle=kind==='circle';let path='';if(circle)path='M450 85 A145 145 0 1 1 449.9 85';else {for(let i=0;i<=160;i++){const a=i/160*Math.PI*4-.5*Math.PI,r=35+i/160*165,x=450+Math.cos(a)*r,y=235+Math.sin(a)*r;path+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}}return `<svg viewBox="0 0 900 475" role="img" aria-label="${circle?'Geschlossener Kreis als Modell identischer Wiederkehr':'Offene Spirale als Modell von Ähnlichkeit bei veränderten Bedingungen'}"><path d="${path}" fill="none" stroke="#d29b62" stroke-width="4"/><circle cx="450" cy="${circle?85:200}" r="9" fill="#f7d9ad"/><circle cx="450" cy="${circle?375:35}" r="9" fill="#93b6ac"/><text x="450" y="240" text-anchor="middle" fill="white" font-family="Georgia" font-size="26">${circle?'Dasselbe noch einmal?':'Ähnlich – und verändert?'}</text><text x="450" y="273" text-anchor="middle" fill="#a9bec2" font-family="Arial" font-size="15">Denkfigur, kein historisches Gesetz</text></svg>`}
function recurrenceHtml(){const options=chosen=>all().filter(e=>e.lane!=='ideas').sort((a,b)=>a.year-b.year).map(e=>`<option value="${e.id}" ${chosen===e.id?'selected':''}>${esc(e.title)} · ${yr(e.year)}</option>`).join('');return `<section class="recurrence-view"><div class="mode-heading"><p class="eyebrow">WIEDERHOLUNG IST EINE FRAGE, KEINE ANTWORT</p><h2>Kommt alles wieder?</h2><p>Ein Rhythmus kann wiederkehren. Zwei Konflikte können sich ähneln. Das bedeutet noch nicht, dass ein Ereignis identisch zurückkehrt. Wechsle die Figur und prüfe, was sie deinem Vergleich nahelegt.</p></div><div class="model-toggle"><button data-shape="circle" aria-pressed="${repeatShape==='circle'}">Kreis · identische Wiederkehr?</button><button data-shape="spiral" aria-pressed="${repeatShape==='spiral'}">Spirale · Ähnlichkeit mit Differenz?</button></div><div class="recurrence-drawing">${spiralSvg(repeatShape)}</div><p class="model-limit">${repeatShape==='circle'?'Der geschlossene Kreis setzt ein Zurückkehren zum selben Punkt voraus. Für die Behauptung identischer historischer Wiederholung wäre das eine äusserst starke Voraussetzung.':'Die Spirale hält Ähnlichkeit und Veränderung zugleich sichtbar. Auch sie beweist keinen Verlauf und behauptet weder Fortschritt noch einen festen Rhythmus.'}</p><div class="comparegrid"><div><label for="repeatA">Erster Vergleichsfall</label><select id="repeatA">${options(repeatA)}</select></div><div><label for="repeatB">Zweiter Vergleichsfall</label><select id="repeatB">${options(repeatB)}</select></div></div><div class="recurrence-pair"><div><small>FALL A</small><h3>${esc(byId(repeatA).title)}</h3><p>${esc(byId(repeatA).intro||byId(repeatA).question||'Eigene Spur')}</p>${eventLink(repeatA,'Material öffnen')}</div><span aria-hidden="true">↔</span><div><small>FALL B</small><h3>${esc(byId(repeatB).title)}</h3><p>${esc(byId(repeatB).intro||byId(repeatB).question||'Eigene Spur')}</p>${eventLink(repeatB,'Material öffnen')}</div></div><p>Bestimme eine konkrete Ähnlichkeit. Stelle ihr einen Unterschied in Akteuren, Machtverhältnissen oder Bedingungen gegenüber. Was bleibt von «Wiederholung», wenn du diesen Unterschied ernst nimmst?</p><button id="repeatCompare" class="primary">Vergleich mit Beleg und Gegenargument speichern</button><aside class="nietzsche-note"><p class="eyebrow">NIETZSCHE · ZWEI VERSCHIEDENE FRAGEN</p><h3>Die ewige Wiederkunft ist keine Prognose des nächsten Krieges.</h3><p>In <em>Die fröhliche Wissenschaft</em>, § 341 (1882), lässt Nietzsche einen Dämon die Wiederkehr des eigenen Lebens bis in seine Einzelheiten ankündigen. Der Text fragt nach der Reaktion darauf: Könnte man dieses Leben bejahen? Hier lesen wir ihn als existenzielles Gedankenexperiment. Damit ist nicht bewiesen, dass sich historische Ereignisse regelmässig wiederholen.</p><p>Seine Schrift von 1874 stellt eine andere Frage: Welche Formen des Umgangs mit Vergangenheit dienen oder schaden dem Leben? Beide Fragen können unser historisches Denken irritieren, sind aber nicht identisch.</p><div class="related">${eventLink('recurrence','Wiederkunft genauer lesen')}${eventLink('nietzsche','Nietzsches Geschichtsgebrauch')}</div></aside><section class="podcast-panel"><p class="eyebrow">HÖREN · ANHALTEN · EINEN GEDANKEN FESTHALTEN</p><h3>Wiederholt sich die Geschichte?</h3><p>Bereitgestellter Podcast · ca. 80 Minuten. Die Hörfragen hier sind eigene Arbeitsaufträge; eine Inhaltszusammenfassung oder ein geprüftes Transkript liegt hier nicht vor. Angaben zu Sendung und Mitwirkenden können im Hörprotokoll ergänzt werden.</p><audio id="podcast" controls preload="none" src="${podcastSrc()}">Dein Browser unterstützt keine Audiowiedergabe.</audio><p><a href="${podcastSrc()}" download="wiederholt-sich-die-geschichte.mp3">Podcast als MP3 öffnen / herunterladen</a></p><p>Halte an einer Stelle an, an der «Wiederholung» erklärt oder an einem Beispiel behauptet wird. Notiere Zeitmarke, Aussage und verwendeten Vergleich. Unterscheide wörtliche Aussage, eigene Zusammenfassung und eigenen Einwand.</p><button id="audioMark">Aktuelle Zeitmarke ins Hörprotokoll übernehmen</button>${modeNote('mode-podcast','Dein Hörprotokoll','[Minute:Sekunde] Aussage / Vergleich im Podcast …\nMeine Frage: identisches Ereignis, ähnlicher Mechanismus oder wiederkehrendes Motiv?\nMein Einwand / Bezug zu Nietzsche …')}</section></section>`}

function modeNoteLabel(key){if(key===RANDOM_HEIL_KEY)return 'Zufallsentwurf · gespeicherte Ausgangsparameter';for(const [mode,lab] of Object.entries(PREMISE_LABS))for(const [field,label] of lab.fields)if(key===premiseKey(mode,field))return GLOBAL_LENSES[mode].title+' · Voraussetzung: '+label;for(const mode of ['medieval','direction'])for(const [field,label] of TELOS_FIELDS)if(key===telosKey(mode,field))return GLOBAL_LENSES[mode].title+' · Telos: '+label;const lk=parseLensNote(key);if(lk)return GLOBAL_LENSES[lk.mode].title+' · '+(byId(lk.id)?.title||lk.id);if(key.startsWith('mode-medieval-'))return 'Mittelalter: '+(MEDIEVAL_LENSES[key.slice(14)]?.title||'Geschichtsbild');if(key.startsWith('mode-egypt-'))return 'Altägypten: '+(EGYPT_LENSES[key.slice(11)]?.title||'Geschichtsbild');if(key.startsWith('mode-materialism-'))return 'Historischer Materialismus: '+(MATERIAL_CASES[key.slice(17)]?.title||'eigener Fall');if(key==='mode-podcast')return 'Hörprotokoll: Wiederholt sich die Geschichte?';if(key==='mode-direction')return 'Richtung und offene Möglichkeiten';if(key.startsWith('mode-present-'))return 'Erlebte Zeit: '+(PRESENT_CASES[key.slice(13)]?.title||'eigener Fall');if(key.startsWith('mode-layers-'))return 'Zeitschichten: '+(LAYER_CASES[key.slice(12)]?.title||'eigener Fall');return key}
function reopenModeNote(key){for(const mode of Object.keys(PREMISE_LABS))if(key.startsWith('premise-'+mode+'-')){switchRepresentation(mode);$('.premise-lab').scrollIntoView({block:'start'});return}for(const mode of ['medieval','direction'])if(key.startsWith('telos-'+mode+'-')){switchRepresentation(mode);$('.telos-lab').scrollIntoView({block:'start'});return}const lk=parseLensNote(key);if(lk){lensFocus=lk.id;switchRepresentation(lk.mode);return}if(key.startsWith('mode-medieval-')){modeState.medievalLens=MEDIEVAL_LENSES[key.slice(14)]?key.slice(14):'ages';openExampleRepresentation('medieval');return}if(key.startsWith('mode-egypt-')){modeState.egyptLens=EGYPT_LENSES[key.slice(11)]?key.slice(11):'renewal';openExampleRepresentation('egypt');return}if(key.startsWith('mode-materialism-')){modeState.materialCase=key.slice(17);openExampleRepresentation('materialism');return}if(key==='mode-podcast'){openExampleRepresentation('recurrence');return}if(key.startsWith('mode-present-')){presentCase=key.slice(13);openExampleRepresentation('present');return}if(key.startsWith('mode-layers-')){modeState.layerCase=key.slice(12);openExampleRepresentation('layers');return}openExampleRepresentation('direction')}

const MATERIAL_CASES={
 factory:{title:'Fabrikarbeit · wer gewinnt Zeit?',id:'industry',caption:'Menzels Eisenwalzwerk (1872–1875): eine künstlerische Darstellung von Arbeit. Eigentumsverträge und Löhne sind darin nicht ablesbar.',question:'Eine neue Maschine spart Arbeitszeit. Wer verfügt über die eingesparte Zeit?',context:'Gedankenexperiment zur Fabrikarbeit: Eine Maschine erlaubt dieselbe Produktion in weniger Stunden. Wir kennen zunächst weder Löhne noch Verträge. Das Bild liefert Beobachtungen zur Arbeit, aber keine Antwort auf die Verteilungsfrage.',nodes:['Arbeitskraft, Maschinen, Wissen und Zusammenarbeit','Verfügung über Betrieb und Ertrag; Verkauf der Arbeitskraft','Eigentumsrecht, Arbeitsvertrag, Arbeitszeitregeln','Unterschiedliche Interessen an Lohn, Gewinn und freier Zeit'],lenses:{forces:['Technik → Arbeitsorganisation','Eine neue Maschine verändert, was in einer Stunde hergestellt werden kann. Ob daraus kürzere Arbeit, mehr Waren oder weniger Stellen entstehen, folgt daraus noch nicht.','Markiere im Bild eine Tätigkeit. Welche zusätzliche Quelle bräuchtest du, um einen Produktivitätsgewinn dieser Tätigkeit nachzuweisen?'],relations:['Eigentum → Verteilung','Wer über die Produktionsmittel verfügt, kann über Investitionen und Erträge mitentscheiden. Die Beschäftigten sind nicht deshalb eine Klasse, weil alle gleich viel verdienen, sondern wegen ihrer Stellung im Produktionsverhältnis.','Entwirf zwei mögliche Entscheidungen über die gewonnene Zeit: eine aus Sicht der Betriebsleitung, eine aus Sicht der Beschäftigten. Welche Machtmittel wären jeweils nötig?'],politics:['Organisation und Recht → Arbeitsbedingungen','Eine vereinbarte Arbeitszeitverkürzung könnte einen technischen Gewinn in freie Zeit übersetzen. Ein solcher Ausgang wäre zu erklären: etwa durch Verhandlungen, Organisation oder Gesetzgebung.','Formuliere eine prüfbare Hypothese: Unter welcher Bedingung führt dieselbe Maschine zu kürzerer Arbeit? Nenne ein Dokument, mit dem du diese Bedingung untersuchen würdest.']},note:'Meine Wirkungskette: … → …, weil …\nAm Bild beobachtbar: …\nZusätzlicher Beleg nötig: …\nEin anderer möglicher Ausgang: …'},
 plantation:{title:'Saint-Domingue · verflochtene Ungleichzeitigkeit',id:'haiti',caption:'Die vorhandene Haiti-Spur erschliesst Revolution und Freiheit. Ihre Bildquelle ersetzt keine Untersuchung der Plantagenökonomie.',question:'Wie können Versklavung und ein auf Gewinn ausgerichteter Weltmarkt zusammengehören?',context:'Saint-Domingues Plantagenwirtschaft vor der haitianischen Unabhängigkeit ist ein Gegenstand für eine verflechtungsgeschichtliche Prüfung. «Sklaverei» und «Kapitalismus» einfach auf zwei aufeinanderfolgende Stufen zu setzen, würde die Frage nach ihrer Verbindung bereits verdecken.',nodes:['Land, Anbauwissen, Arbeitskraft und Verarbeitung','Versklavung, Verfügung über Land und Aneignung der Erträge','Koloniale Herrschaft, Eigentumsansprüche und ihre Anfechtung','Widerstand, Revolution und konkurrierende Freiheitsansprüche'],lenses:{forces:['Produktion → Verbindungen über den Atlantik','Beginne beim Produkt: Welche Arbeit, Verarbeitung, Transporte und Absatzorte wären zu rekonstruieren? Eine lokale Produktionsweise wird erst durch ihre Beziehungen verständlich.','Zeichne eine Warenkette mit drei Stationen. Kennzeichne jeden noch unbelegten Pfeil als Forschungsfrage; suche in eigenen Unterrichtsmaterialien nach einem Handels- oder Produktionsbeleg.'],relations:['Eigentum und Zwang → Aneignung','Lohnarbeit und versklavte Arbeit sind nicht dasselbe Produktionsverhältnis. Ein gemeinsamer Absatzmarkt hebt diesen Unterschied nicht auf. Er macht die Beziehungen zwischen unterschiedlichen Arbeitsverhältnissen untersuchbar.','Erkläre, weshalb «beide produzieren für einen Markt» keine ausreichende Gleichsetzung ist. Prüfe Verfügung über die eigene Arbeitskraft und Aneignung des Ertrags getrennt.'],politics:['Revolution → veränderte Herrschaft und Arbeit','Die Revolution verlangt eine Erklärung von Handlungen, Bündnissen und Freiheitsvorstellungen. Wirtschaftliche Interessen allein verraten noch nicht, wer wann welche Entscheidung trifft.','Öffne die Haiti-Spur. Welche politische Forderung lässt sich benennen? Formuliere, welche materielle Ordnung sie angreift und was du zusätzlich über die Handelnden wissen musst.']},note:'Eine Verbindung zwischen verschiedenen Arbeitsverhältnissen: …\nDafür bräuchte ich diesen Beleg: …\nDie Stufenfolge verdeckt: …\nEine politische Handlung, die gesondert erklärt werden muss: …'}
};
function materialismHtml(){const c=MATERIAL_CASES[modeState.materialCase],lens=c.lenses[modeState.materialLens],e=byId(c.id);return `<section class="materialism-view"><div class="mode-heading"><p class="eyebrow">MARX & ENGELS · GESELLSCHAFT IN BEWEGUNG</p><h2>Wer produziert? Wer verfügt? Was verändert sich?</h2><p>Historischer Materialismus fragt danach, wie Menschen ihren Lebensunterhalt herstellen und welche gesellschaftlichen Beziehungen sie dabei eingehen. «Materiell» meint hier die Bedingungen des Lebens; nicht einfach eine Vorliebe für Besitz.</p>${eventLink('materialism','Marx, Engels und den Ansatz kennenlernen')}</div><label for="materialCase">Das Wirkungsgefüge an einem Fall untersuchen</label><select id="materialCase">${Object.entries(MATERIAL_CASES).map(([id,x])=>`<option value="${id}" ${id===modeState.materialCase?'selected':''}>${x.title}</option>`).join('')}</select><div class="material-case"><figure>${e.image?`<img src="${imageSrc(e.image)}" alt="Bildquelle zur Spur ${esc(e.title)}">`:''}<figcaption>${c.caption} ${eventLink(c.id,'Bild und historische Spur öffnen')}</figcaption></figure><div><p class="eyebrow">DIE STREITFRAGE</p><h3>${c.question}</h3><p>${c.context}</p></div></div><div class="material-system"><div class="material-system-title"><span>ARBEIT UND GESELLSCHAFT</span><p>Produktionsweise: Produktivkräfte ↔ Produktionsverhältnisse</p></div><div class="material-nodes">${[['Produktivkräfte',c.nodes[0],'forces'],['Produktionsverhältnisse',c.nodes[1],'relations'],['Recht & Politik',c.nodes[2],'politics'],['Interessen & Konflikte',c.nodes[3],'conflict']].map(([title,text,key],i)=>`<button data-material-lens="${key}" aria-pressed="${modeState.materialLens===key}"><small>0${i+1}</small><strong>${title}</strong><span>${text}</span><em>Zusammenhang untersuchen ↗</em></button>${i===1?'<div class="material-connection">↕ Bedingungen und Rückwirkungen untersuchen ↕</div>':''}`).join('')}</div><p class="material-feedback">↔ Wechselwirkungen prüfen: Bedingungen begrenzen Handlungen; organisierte Handlungen können Bedingungen verändern.</p></div><div class="material-investigation" aria-live="polite"><p class="eyebrow">EINE ERKLÄRUNG ERPROBEN</p><h3>${lens[0]}</h3><p>${lens[1]}</p><p><strong>Dein Eingriff:</strong> ${lens[2]}</p></div><details class="material-limit"><summary>Warum hier keine Treppe von der «Urgesellschaft» zum Kommunismus steht</summary><p>Produktivkräfte sind die Fähigkeiten und Mittel des Produzierens: Arbeitskraft, Wissen, Technik und Kooperation. Produktionsverhältnisse bestimmen, wie Menschen dabei gesellschaftlich zueinander stehen und über Produktionsmittel und Erträge verfügen. Marx fragt, wann bestehende Verhältnisse die entwickelten Möglichkeiten hemmen und Konflikte um eine neue Ordnung entstehen.</p><p>Marx nennt 1859 verschiedene Produktionsweisen als progressive Epochen und formuliert einen Zusammenhang von Widerspruch und gesellschaftlichem Umbruch. Sein Text enthält also starke Entwicklungsannahmen. Sie verschwinden nicht dadurch, dass wir hier ein offenes Wirkungsgefüge zeichnen.</p><p>Als weltweite Pflichtabfolge wäre eine solche Treppe zu prüfen: Welche Gesellschaft wird zum Massstab? Welche verschiedenen Arbeitsverhältnisse bestehen gleichzeitig und sind miteinander verbunden? Der Fall Saint-Domingue öffnet genau diese Untersuchung. Das Gefüge ist eine didaktische Lesart, keine vollständige Darstellung aller marxistischen Geschichtstheorien.</p><p>Mit «Basis» bezeichnet Marx die ökonomische Struktur der Produktionsverhältnisse; «Überbau» umfasst rechtliche und politische Formen. Die Darstellung lädt dazu ein, die Verbindung zu erklären. Die Lage eines Feldes auf dem Bildschirm ist kein Beweis für ein einseitiges Ursache-Wirkungs-Verhältnis.</p><p>Engels betont 1890 gegenüber <strong>Joseph Bloch</strong> die Wechselwirkung von Wirtschaft, Politik und Ideen; er hält zugleich am letztlich bestimmenden Gewicht der Produktion und Reproduktion fest. Joseph Bloch ist nicht der Historiker Marc Bloch.</p></details><div class="related">${eventLink('hegel','Mit Hegels Freiheitsgeschichte vergleichen')}${eventLink('harariorders','Mit Hararis geteilten Ordnungen vergleichen')}${eventLink('period','Was wird jetzt zur Epochengrenze?')}</div>${modeNote('mode-materialism-'+modeState.materialCase,'Deine Erklärung: Zusammenhang, Beleg und Grenze',c.note)}<details><summary>Primärtexte und Einordnung</summary><ul class="source-list">${sourceHtml(['marx1859','engels1890'])}</ul></details></section>`}

MATERIAL_CASES.factory.lenses.conflict=['Gegensätzliche Interessen → gemeinsames Handeln?','Ein Interesse an höherem Lohn erzeugt noch keinen gemeinsamen Streik. Beschäftigte können unterschiedliche Risiken, Abhängigkeiten und Handlungsmöglichkeiten haben.','Verfasse zwei kurze, als erfunden gekennzeichnete Stimmen zur Arbeitszeitforderung: Eine Person will streiken, eine fürchtet den Arbeitsplatzverlust. Was müsste eine historische Quelle belegen, bevor du daraus eine Erklärung machst?'];
MATERIAL_CASES.plantation.lenses.conflict=['Herrschaft → Widerstand?','Aus Unterdrückung lässt sich nicht unmittelbar Zeitpunkt, Form und Ergebnis eines Aufstands ableiten. Wie sich Menschen verständigen und verbünden, gehört zur Erklärung.','Stelle der Aussage «Die Ausbeutung führte zur Revolution» zwei konkrete Nachfragen an die Haiti-Spur gegenüber: eine nach den Handelnden, eine nach den Bedingungen ihres Handelns. Was kann die Spur beantworten, was bleibt offen?'];

const MEDIEVAL_LENSES={
 ages:{label:'Weltenlauf',title:'Warum beginnt 476 hier kein neues Weltalter?',text:'Im christlichen Sechs-Weltalter-Schema, das Beda im frühen 8. Jahrhundert verwendet, beginnt das sechste Alter mit Christus. Es umfasst auch die eigene Gegenwart. Das Weltende ist ein Erwartungshorizont, kein hier berechenbares Datum. Ein Herrschaftswechsel muss deshalb keine Grenze des Weltenlaufs sein.',evidence:'Beda berichtet innerhalb des sechsten Weltalters von Odoakers Übernahme Roms. Die moderne Epochengrenze «476: Beginn des Mittelalters» strukturiert diesen Text nicht. Das ist eine Paraphrase der Chronik, keine Übernahme ihrer Einzelangaben als unstrittige Tatsachen.',task:'Öffne die Spur zu 476. Schreibe für dasselbe Ereignis zwei Überschriften: eine aus der Perspektive einer heutigen Epochentafel und eine, die seine Stellung in Bedas sechstem Weltalter erklärt. Welche Bedeutung gewinnt oder verliert das Ereignis?',note:'Überschrift der Epochentafel: …\nÜberschrift zu Bedas Ordnung: …\nDas unterschiedliche Kriterium: …'},
 calendar:{label:'Kirchenjahr',title:'Einmal geschehen – jedes Jahr vergegenwärtigt',text:'Ein auf Vollendung gerichteter Weltenlauf schliesst wiederkehrende Feste nicht aus. Im Kirchenjahr werden zentrale christliche Heilsgeschehnisse jährlich erinnert und liturgisch vergegenwärtigt. Der Kreis der Feiern behauptet nicht, dass Christus jedes Jahr erneut geboren wird oder die Geschichte von vorn beginnt.',evidence:'Das Rad zeigt ausgewählte Bezugspunkte des westlichen Kirchenjahres, keinen vollständigen Kalender. Festordnungen, regionale Bräuche und Berechnungen veränderten sich. Ostern fällt auch nicht auf ein festes Kalenderdatum.',task:'Eine Mitschülerin sagt: «Ein Kreis kann keine Heilsgeschichte zeigen, denn die läuft auf ein Ende zu.» Antworte ihr anhand von Weihnachten oder Ostern. Unterscheide erzähltes Geschehen, wiederkehrende Feier und die jeweilige Gegenwart der Feiernden.',note:'Das einmalige Geschehen innerhalb des Glaubens: …\nWas jährlich wiederkehrt: …\nWas sich bei jeder Feier verändern kann: …'},
 power:{label:'Weltchronik & Herrschaft',title:'Wessen Platz im göttlichen Plan?',text:'Rudolf von Ems verfasste seine Weltchronik im 13. Jahrhundert für König Konrad IV. Biblische und weltliche Stoffe verbinden sich darin. Das Werk sollte die staufische Dynastie in der Heilsgeschichte verorten, blieb aber unvollendet. Die gezeigte Handschrift entstand erst um 1400–1410: Werkentstehung und Bildherstellung sind verschiedene Zeiten.',evidence:'Die Buchmalerei zeigt die Berufung Abrahams. Sie ist eine Quelle dafür, wie eine biblische Vergangenheit um 1400 dargestellt wurde. Sie ist kein Augenzeugenbild Abrahams und beweist für sich allein noch kein vollständiges politisches Programm.',task:'Verfasse eine zweizeilige Museumslegende: zuerst «Die Darstellung zeigt …», dann «Über ihre Entstehungszeit können wir fragen …». Ergänze eine dritte Zeile dazu, weshalb ein König an einer Weltchronik interessiert sein konnte. Markiere dort deinen Schluss als Deutung.',note:'Die Darstellung zeigt: …\nZur Herstellung um 1400: …\nMein begründeter Schluss zum Auftraggeber des Textes: …'}
};
const EGYPT_LENSES={
 renewal:{label:'Erneuerung',title:'Ein neuer Morgen ist keine wiederholte Schlacht',text:'Der Skarabäus verbindet in ägyptischen religiösen Vorstellungen das Werden mit der aufgehenden Sonne. Erneuerung konnte auch Schutz und Hoffnung über den Tod hinaus ausdrücken. Eine solche Wiederkehr ist etwas anderes als die Behauptung, politische Ereignisse verliefen immer identisch.',evidence:'Das kleine Amulett besteht aus glasiertem Steatit und stammt ungefähr aus der Zeit 1300–1080 v. u. Z. Das Museum deutet seine Käferform im Zusammenhang mit Khepri und Erneuerung. Diese Bedeutung ist Kontextwissen; sie lässt sich aus der Form allein nicht vollständig ablesen.',task:'Trenne drei Sätze: Was siehst du am Gegenstand? Was erklärt der Museumstext? Was wäre eine zu weit gehende Behauptung über «die ägyptische Geschichte»? Widerlege dann den Satz «Weil die Sonne wiederkehrt, wiederholt sich jede Herrschaft».',note:'Beobachtung am Objekt: …\nDeutung mit Kontextwissen: …\nNicht durch das Objekt gedeckt: …'},
 reigns:{label:'Königszeit',title:'Eine Liste kann Ordnung herstellen – und Zeit verdecken',text:'Regierungsjahre erlaubten es, Vorgänge zeitlich zuzuordnen. Überlieferte Königslisten sind jedoch keine vollständigen neutralen Datensätze: Sie können Herrscher auslassen und gleichzeitige Dynastien hintereinander anordnen. Die Abfolge von Namen muss deshalb quellenkritisch erschlossen werden.',evidence:'Das gezeigte Beispiel ist vollständig erfunden. Alle drei Herrschaften und ihre Reihenfolge sind für diese Übung vorgegeben. Mit dem Schalter veränderst du nur die spätere Erinnerungsliste. Es ist keine Nachbildung einer konkreten ägyptischen Königsliste.',task:'Lass Herrschaft B aus der Erinnerungsliste verschwinden. Verfasse zwei Aussagen: eine über die nun sichtbare Liste und eine über die tatsächliche Abfolge im Übungsfall. Welche unabhängige Spur könnte eine Auslassung in einer realen Liste erkennbar machen?',note:'Die sichtbare Liste legt nahe: …\nIm vorgegebenen Fall bleibt dennoch wahr: …\nEin unabhängiger Beleg für eine Lücke wäre: …'},
 order:{label:'Ordnung & Dauer',title:'Wenn Veränderung als Wiederherstellung erzählt wird',text:'Maʿat bezeichnet eine richtige, gerechte Weltordnung. Im königlichen Selbstverständnis gehörte es zur Aufgabe des Herrschers, sie zu erhalten: durch Recht, Schutz, Versorgung und Rituale. Ein Anspruch auf bewahrte Ordnung ist selbst historisch wirksam; er ist kein Beweis, dass eine Gesellschaft unverändert blieb.',evidence:'Erfundener Deutungssatz für diese Übung: «Ich habe die richtige Ordnung wiederhergestellt.» Er ist kein übersetztes Pharaonenzitat. Seine Zeitordnung ist auf einen gültigen Ursprung oder früheren Idealzustand bezogen, nicht auf ein immer besseres Morgen.',task:'Lies den Übungssatz einmal als königlichen Anspruch und einmal aus Sicht von Menschen, deren Abgaben steigen. Welche Fragen stellen beide Lesarten? Formuliere abschliessend einen Befund, der den Anspruch auf Wiederherstellung stützen oder erschüttern könnte.',note:'Perspektive des Herrschers: …\nPerspektive der Abgabepflichtigen: …\nPrüfbarer Befund und benötigte Quelle: …'}
};
function worldviewTabs(kind,items){return `<div class="model-toggle" aria-label="Zugang wählen">${Object.entries(items).map(([k,v])=>`<button data-history-lens="${k}" aria-pressed="${modeState[kind+'Lens']===k}">${v.label}</button>`).join('')}</div>`}
function worldviewImage(id){const e=byId(id);return `<figure class="worldview-source"><img src="${imageSrc(e.image)}" alt="${esc(e.imageAlt)}">${id==='egyptworld'?`<details class="artifact-reverse"><summary>Unterseite mit Zeichen ansehen</summary><img src="${imageSrc('egypt-scarab.jpg')}" alt="Unterseite desselben Skarabäus mit eingeschnittenen Zeichen"></details>`:''}<figcaption>${esc(e.imageCaption)} ${eventLink(id,'Quelle, Kontext und eigene Materialien')}</figcaption></figure>`}
function calendarWheel(){return `<div class="liturgical-wheel" role="img" aria-label="Ausgewählte Feste im wiederkehrenden Kirchenjahr: Advent, Weihnachten, Ostern, Pfingsten; keine identische Wiederholung der erzählten Ereignisse"><div class="wheel-core">ERINNERN<br><strong>in neuer Gegenwart</strong></div><span class="wheel-north">Advent</span><span class="wheel-east">Weihnachten</span><span class="wheel-south">Ostern</span><span class="wheel-west">Pfingsten</span></div><p class="drawing-caption">Wiederkehr der Feier ↻ · keine Zeitabstände im Massstab</p>`}
function medievalDrawing(){if(modeState.medievalLens==='calendar')return calendarWheel();if(modeState.medievalLens==='power')return `<div class="chronicle-weave"><div><small>BIBLISCHE ERZÄHLUNG</small><strong>Abrahams Berufung</strong></div><span aria-hidden="true">↘</span><div class="weave-center"><small>CHRISTLICHE WELTCHRONIK</small><strong>Vergangenes erhält einen Zusammenhang</strong></div><span aria-hidden="true">↗</span><div><small>WELTLICHE HERRSCHAFT</small><strong>Platz einer Dynastie</strong></div></div><p class="drawing-caption">Schematisierung der Erzählabsicht · keine Behauptung einer göttlichen Legitimation</p>`;return `<div class="salvation-frame"><p class="eyebrow">SECHS WELTALTER · EIN CHRISTLICHES ORDNUNGSMODELL</p><div class="world-ages">${['Adam → Noah','Noah → Abraham','Abraham → David','David → Babylonisches Exil','Exil → Christus','Christus → Weltende'].map((t,i)=>`<div class="${i===5?'age-present':''}"><small>${i+1}. WELTALTER</small><strong>${t}</strong>${i===5?'<span>Die eigene Gegenwart – und auch 476 – liegen in diesem Alter.</span>':''}</div>`).join('')}</div><div class="salvation-horizon">Erwartete Vollendung / Gericht <strong>Zeitpunkt hier nicht festgelegt</strong></div></div><p class="drawing-caption">Biblisch-christliche Einteilung, keine heutige Datierung der Weltentstehung. Feldbreiten zeigen keine Dauer.</p>`}
function medievalHtml(){const c=MEDIEVAL_LENSES[modeState.medievalLens];return `<section class="worldview medieval-view"><div class="mode-heading"><p class="eyebrow">MITTELALTERLICHE GESCHICHTSBILDER · AUSGEWÄHLTE CHRISTLICHE PERSPEKTIVEN</p><h2>Ein Weltenlauf. Viele Wiederkehren.</h2><p>Was geschieht, kann als Teil eines göttlichen Heilsplans erzählt werden. Gleichzeitig kehren Feste wieder und Herrscher suchen ihren Platz in der Vergangenheit. Diese Ansicht untersucht solche Verknüpfungen an Beda und einer Weltchronik.</p></div>${worldviewTabs('medieval',MEDIEVAL_LENSES)}<div class="worldview-layout">${worldviewImage('medievalworld')}<div class="worldview-drawing">${medievalDrawing()}</div></div><article class="worldview-inquiry" aria-live="polite"><p class="eyebrow">${c.label}</p><h3>${c.title}</h3><p>${c.text}</p><div class="worldview-evidence"><strong>Arbeitsgrundlage</strong><p>${c.evidence}</p></div><p><strong>Deine Untersuchung:</strong> ${c.task}</p></article><div class="model-limit"><strong>Wessen Mittelalter?</strong> Ein lateinisch-christliches Weltaltermodell steht nicht für alle Menschen zwischen 500 und 1500. Jüdische, islamische und andere Geschichtstraditionen dürfen darin nicht als Abweichungen verschwinden. Auch christliche Chroniken, Annalen und lokale Erinnerungen verfolgen unterschiedliche Zwecke. Die Grenzen «Mittelalter» setzen wir rückblickend.</div><div class="related">${eventLink('romeend','476 unter einer anderen Ordnung')}${eventLink('augustine','Augustinus: Erleben und Ewigkeit')}${eventLink('timeforms','Linie und Kreis hinterfragen')}${eventLink('egyptworld','Mit altägyptischen Perspektiven vergleichen')}</div>${modeNote('mode-medieval-'+modeState.medievalLens,'Deine Untersuchung zu diesem Geschichtsbild',c.note)}<details><summary>Quellen und Bildnachweis</summary><ul class="source-list">${sourceHtml(['bedeAges','medievalAges','gettyChronicle','gettyAbraham','gettyCosmos'])}</ul></details></section>`}
function egyptDrawing(){if(modeState.egyptLens==='reigns')return `<div class="king-workshop"><p class="eyebrow">ERFUNDENER ÜBUNGSFALL · KEINE HISTORISCHE KÖNIGSLISTE</p><p>Vorgegebene Abfolge: <strong>A → B → C</strong></p><label class="king-toggle"><input type="checkbox" id="kingOmission" ${modeState.hideKing?'checked':''}> Herrschaft B aus der späteren Erinnerungsliste auslassen</label><div class="cartouches" aria-label="Spätere Erinnerungsliste">${['A',...(modeState.hideKing?[]:['B']),'C'].map(k=>`<div><small>HERRSCHAFT</small><strong>${k}</strong><span>Jahr 1 · Jahr 2 · …</span></div>`).join('<span aria-hidden="true">→</span>')}</div><p class="list-result" aria-live="polite">${modeState.hideKing?'Die Liste zeigt A → C. Die vorgegebene Herrschaft B ist dadurch nicht ungeschehen.':'Die Erinnerungsliste enthält alle drei vorgegebenen Herrschaften.'}</p></div>`;if(modeState.egyptLens==='order')return `<div class="maat-order"><span>Maʿat</span><h3>Gültige Ordnung</h3><div class="maat-pillars"><div>Recht<br>& Gerechtigkeit</div><div>Versorgung<br>& Schutz</div><div>Rituale<br>& Erhaltung</div></div><p>Anspruch des Königtums ↔ gelebte Verhältnisse</p><strong>Übereinstimmung erst untersuchen.</strong></div>`;return `<div class="solar-renewal"><div class="solar-path" aria-hidden="true"><span>☀</span></div><div class="solar-text"><small>WERDEN · VERGEHEN · ERNEUERN</small><strong>Ein neuer Morgen</strong><span>Wiederkehr als religiöse Denkfigur</span></div></div><p class="drawing-caption">Schematische Darstellung · kein originales ägyptisches Diagramm und kein Gesetz politischer Wiederholung</p>`}
function egyptHtml(){const c=EGYPT_LENSES[modeState.egyptLens];return `<section class="worldview egypt-view"><div class="mode-heading"><p class="eyebrow">ALTÄGYPTISCHE GESCHICHTSBILDER · ORDNUNG UND VERÄNDERUNG</p><h2>Was wiederkehrt. Was bleibt. Wer erinnert wird.</h2><p>Eine aufgehende Sonne, das Regierungsjahr eines Königs und der Anspruch auf dauerhafte Ordnung beantworten verschiedene Fragen. Lege diese Perspektiven nebeneinander, bevor du ein einziges «ägyptisches Zeitbild» zeichnest.</p></div>${worldviewTabs('egypt',EGYPT_LENSES)}<div class="worldview-layout">${worldviewImage('egyptworld')}<div class="worldview-drawing">${egyptDrawing()}</div></div><article class="worldview-inquiry" aria-live="polite"><p class="eyebrow">${c.label}</p><h3>${c.title}</h3><p>${c.text}</p><div class="worldview-evidence"><strong>Arbeitsgrundlage</strong><p>${c.evidence}</p></div><p><strong>Deine Untersuchung:</strong> ${c.task}</p></article><div class="model-limit"><strong>Keine zeitlose Kultur.</strong> Altägyptische Geschichte umfasst Jahrtausende mit politischen Brüchen und veränderten religiösen Vorstellungen. Tempel, Königsinschriften und Grabbeigaben erschliessen bestimmte Praktiken und Interessen. Sie erlauben keinen unmittelbaren Zugriff auf das Denken aller Menschen. «Altes», «Mittleres» und «Neues Reich» sind zudem moderne Ordnungsbegriffe.</div><div class="related">${eventLink('recurrence','Welche Wiederholung ist gemeint?')}${eventLink('assmann','Bewahren und Auswählen')}${eventLink('medievalworld','Mit christlicher Heilsgeschichte vergleichen')}${eventLink('materialism','Ordnung aus materiellen Beziehungen erklären?')}</div>${modeNote('mode-egypt-'+modeState.egyptLens,'Deine Untersuchung zu diesem Geschichtsbild',c.note)}<details><summary>Quellen und Bildnachweis</summary><ul class="source-list">${sourceHtml(['metScarab','metKings','metEgyptEducation','metMiddleKingdom'])}</ul></details></section>`}

/* A shared corpus and focus survive every change of interpretive lens. */
let lensFocus='paris',lensExample=false,lensMapOrder={};
const GLOBAL_LENSES={
 memoria:{title:'Memoria · Wie Vergangenheit gegenwärtig wird',concept:'halbwachs',intro:'Eine Erinnerung gehört jemandem und entsteht in Beziehungen. Untersuche an jeder Spur, wer erinnert, wie Erzählungen weitergegeben werden und welche Bilder, Rituale oder Institutionen sie dauerhaft präsent halten.',slots:[['social','Soziale Rahmen','Welche Familie, Gruppe oder Institution prägt die Sicht?'],['everyday','Weitererzählen','Wie zirkuliert Erinnerung im Gespräch und zwischen Generationen?'],['cultural','Kulturelle Formen','Welche Bilder, Texte, Orte oder Rituale tragen Erinnerung?'],['silence','Auswahl & Auslassung','Was bleibt unsichtbar, wer widerspricht, was wird vergessen?']],question:'Benenne eine konkrete Erinnerungspraxis: Wer erinnert wann, für wen und mit welchem Medium? Unterscheide das erinnerte Geschehen von der späteren Erinnerung daran. Belege auch, wenn du eine Auslassung behauptest.',limit:'Halbwachs erklärt soziale Rahmen des Erinnerns. Jan Assmann unterscheidet kommunikatives und kulturelles Gedächtnis. Die Felder sind Untersuchungsfragen und überschneiden sich; sie sind weder aufeinanderfolgende Epochen noch feste Eigenschaften eines Ereignisses.',shape:'memory'},
 present:{title:'Erlebte Zeit',concept:'augustine',intro:'Wähle eine historische Gegenwart. Frühere und spätere Spuren bleiben sichtbar; erst Quellen können zeigen, was die damaligen Menschen erinnerten oder erwarteten.',slots:[['memory','Erinnern','Was aus der Vergangenheit war in dieser Gegenwart präsent?'],['attention','Wahrnehmen','Was konnten die Beteiligten jetzt wahrnehmen?'],['expectation','Erwarten','Welche Möglichkeiten stellten sie sich vor?']],question:'Unterscheide dein Wissen über den späteren Verlauf vom Horizont damaliger Menschen. Welche konkrete Äusserung erschliesst Erinnerung, Wahrnehmung oder Erwartung?',limit:'Ein früheres Datum beweist keine Erinnerung; ein späteres Ereignis war keine automatisch bekannte Zukunft.',shape:'orbit'},
 layers:{title:'Zeitschichten',concept:'braudel',intro:'Untersuche jede Spur auf Ereignis, längerfristige Entwicklung und langsam veränderliche Bedingungen. Eine Datierung entscheidet noch nicht über die Dauer des untersuchten Zusammenhangs.',slots:[['event','Ereignis','Ein begrenzter Vorgang: Was passiert?'],['process','Entwicklung','Welche Veränderungen reichen darüber hinaus?'],['structure','Lange Dauer','Welche Bedingungen bestehen länger?']],question:'Bestimme zuerst, welchen Aspekt der Spur du untersuchst. Begründe seine Dauer mit Anfang, Ende oder Fortbestehen; nenne einen Zusammenhang mit einer anderen Schicht.',limit:'Eine Spur kann Aspekte mehrerer Schichten enthalten. Die Zuordnung markiert deinen derzeitigen Schwerpunkt, keine feste Eigenschaft des Eintrags.',shape:'strata'},
 direction:{title:'Richtung & Offenheit',concept:'hegel',intro:'Ordne den gesamten Bestand danach, wie eine Erzählung Fortschritt, Ausschluss oder offene Möglichkeiten sichtbar macht. Die Pfeile stellen Deutungen dar, keinen bewiesenen notwendigen Verlauf.',slots:[['advance','Fortschritt behauptet','Für wen und nach welchem Massstab?'],['exclusion','Grenze / Gegenbefund','Wer bleibt ausgeschlossen, was verschlechtert sich?'],['alternative','Offene Möglichkeit','Welche andere Zukunft war damals vorstellbar?']],question:'Formuliere einen Massstab, bevor du von Fortschritt sprichst. Stelle deiner Einordnung eine betroffene Gruppe oder damalige Möglichkeit gegenüber, die sie einschränkt.',limit:'Hegels Freiheitsgeschichte, Hararis Kontingenz und Kosellecks Erwartungshorizonte sind verschiedene Ansätze. Nutze das Begriffsfenster, um deine gewählte Lesart kenntlich zu machen.',shape:'branches'},
 medieval:{title:'Mittelalterliche Geschichtsbilder',concept:'medievalworld',intro:'Erprobe Heilsgeschichte, liturgische Wiederkehr und herrschaftliche Legitimation am gesamten Bestand. Bei fremden Zeiten und Traditionen ist die Anwendung ein heutiges Gedankenexperiment.',slots:[['salvation','Heilsgeschichtlicher Ort','Welcher Zusammenhang von Ursprung, Heil und Vollendung wird erzählt?'],['commemoration','Wiederkehrendes Gedenken','Wie wird Vergangenes erneut gegenwärtig?'],['legitimation','Herrschaft legitimieren','Welche Stellung wird durch Vergangenheit begründet?']],question:'Kennzeichne zuerst: Erschliesst deine Deutung eine belegte damalige Vorstellung oder überträgst du das Modell versuchsweise? Zeige am Material, was diese Ordnung sichtbar macht und was sie verdrängt.',limit:'Keine automatische Einordnung der Welt in christliche Weltalter. Eine Jahreszahl und eine europäische Epochengrenze belegen keine christliche Selbstdeutung.',shape:'arches'},
 egypt:{title:'Altägyptische Geschichtsbilder',concept:'egyptworld',intro:'Blicke auf Erneuerung, bewahrte Ordnung und ausgewählte Erinnerung. Diese Perspektive lässt sich vergleichend erproben; sie wird dadurch nicht zum Selbstverständnis aller dargestellten Menschen.',slots:[['renewal','Erneuerung','Was kehrt als Ritual, Rhythmus oder Erneuerungsanspruch wieder?'],['order','Ordnung bewahren','Welche richtige Ordnung soll erhalten oder wiederhergestellt werden?'],['selection','Erinnerung auswählen','Wer oder was wird gezählt, bewahrt oder ausgelassen?']],question:'Untersuche einen konkreten Anspruch auf Wiederkehr, Dauer oder Erinnerung. Trenne die Aussage der Quelle von deiner Übertragung altägyptischer Begriffe auf diesen Fall.',limit:'Maʿat ist kein zeitloses Etikett für jede Ordnung. Vergleiche verlangen auch Unterschiede in Religion, Herrschaft und Überlieferung.',shape:'solar'},
 materialism:{title:'Historischer Materialismus',concept:'materialism',intro:'Betrachte jede Spur unter den Bedingungen von Produktion, Eigentum und gesellschaftlichen Auseinandersetzungen. Die Felder sind miteinander verbunden; eine Ursache ist mit der Zuordnung noch nicht bewiesen.',slots:[['forces','Produktivkräfte','Arbeit, Technik, Wissen und Kooperation'],['relations','Produktionsverhältnisse','Verfügung über Produktionsmittel und Erträge'],['politics','Recht & Politik','Regeln, Institutionen und Rückwirkungen'],['conflicts','Interessen & Konflikte','Handlungsmöglichkeiten, Organisation und Widerstand']],question:'Formuliere eine Wirkungskette mit mindestens einem handelnden Akteur: Welche materielle Bedingung eröffnet oder begrenzt welches Handeln? Benenne den Beleg und eine andere mögliche Erklärung.',limit:'Auch Erinnerung, Bilder und Ideen gehören zum Bestand. Ihre materiellen Bedingungen zu untersuchen ersetzt nicht die Analyse ihres Inhalts.',shape:'forces'},
 recurrence:{title:'Kreis & Spirale',concept:'recurrence',intro:'Sichte den ganzen Bestand nach Rhythmen, Analogien und Unterschieden. Zwei ähnliche Spuren sind noch keine identische Wiederholung. Wähle eine zweite Spur für einen begründeten Vergleich.',slots:[['rhythm','Rhythmus','Was kehrt regelmässig wieder?'],['analogy','Ähnlichkeit','Welcher Mechanismus oder welches Motiv ähnelt sich?'],['difference','Differenz','Welche Bedingungen verhindern die Gleichsetzung?']],question:'Nenne genau, was sich wiederholen soll: Feier, Motiv, Mechanismus oder identisches Ereignis. Verbinde zwei Spuren und formuliere sowohl eine Ähnlichkeit als auch einen entscheidenden Unterschied.',limit:'Nietzsches Wiederkunft ist nicht durch eine Ereignisähnlichkeit bewiesen. Das Begriffsfenster und der Podcast bleiben als Hilfen zugänglich.',shape:'spiral'}
};
function lensNoteKey(mode,id){return 'lens-'+mode+'-'+id}
function parseLensNote(key){for(const mode of Object.keys(GLOBAL_LENSES)){const prefix='lens-'+mode+'-';if(key.startsWith(prefix))return {mode,id:key.slice(prefix.length)}}return null}
function lensCorpus(){return [...all(),...Object.values(CONCEPTS)].filter((e,i,a)=>a.findIndex(x=>x.id===e.id)===i)}
function lensItems(query='',own=false){const q=query.toLocaleLowerCase('de');return lensCorpus().filter(e=>categoryVisible(e)&&(periodCompare||centuryVisible(e))&&(!own||e.own)&&[e.title,e.text,e.date,e.year,e.source].join(' ').toLocaleLowerCase('de').includes(q)).sort((a,b)=>(a.year??Infinity)-(b.year??Infinity)||a.title.localeCompare(b.title,'de'))}
function lensAssignment(mode,id){return state.lensAssignments?.[mode]?.[id]||''}
function lensCard(e){return `<button class="lens-card ${e.id===lensFocus?'is-focus':''}" data-lens-focus="${esc(e.id)}" aria-pressed="${e.id===lensFocus}">${e.image?`<img loading="lazy" src="${imageSrc(e.image)}" alt="">`:'<span class="lens-card-symbol" aria-hidden="true">◇</span>'}<span><small>${lensMapOrder[e.id]?'#'+lensMapOrder[e.id]+' · ':''}${esc(e.date||(e.year?yr(e.year):'Begriff'))}${e.own?' · EIGEN':''}</small><strong>${esc(e.title)}</strong>${mediaBadge(e)}</span></button>`}
// These are explicit contemporary experiments with historical constructions.
// Calendar dates remain source data; interpretive positions are not historical findings.
const worldAssumptions={};
let worldYear=2026,worldWindow=130,worldAll=true,worldAssumption=true,worldPeriod=100;
const WORLD_READINGS={
 medieval:{name:'Welt unter einem Heilshorizont',short:'Heilsgeschichte',action:'Heilshorizont sichtbar',mechanism:'Die Ereignisse stehen unter einem erwarteten, nicht datierbaren Ziel. Auch 2015 oder 2026 werden so zu einer Gegenwart vor der Vollendung. Der obere Horizont ist kein Ereignis und kein berechnetes Enddatum.',gain:'Diese Sicht fragt nach Sinn, Verantwortung und dem Verhältnis begrenzter menschlicher Macht zu einem letzten Massstab.',loss:'Sie kann ein Geschehen in einen vorgegebenen Sinn einpassen. Die Absichten Andersdenkender und überprüfbare Ursachen drohen hinter einer Heilsdeutung zu verschwinden.',task:'Schreibe eine ausdrücklich erfundene Chroniknotiz zu dieser Spur: Was würde unter einem Heilshorizont als Bewährung, Hoffnung oder Grenze irdischer Macht erscheinen? Markiere danach jedes Wort, das du aus dem Modell und nicht aus der Quelle gewonnen hast.',counter:'Nimm den Heilshorizont weg. Welche Aussage deiner Chronik bleibt durch die Quelle gedeckt? Welche benötigt ein Glaubensurteil?',paris:'Das Pariser Abkommen könnte in dieser versuchsweisen Chronik als gemeinsame Verantwortung oder als Grenze menschlicher Verfügung erzählt werden. Es wäre damit weder ein nachgewiesenes Heilszeichen noch der Beginn einer letzten Weltzeit.',source:'augustineCity',caution:'Eine ausgewählte lateinisch-christliche Konstruktion mit spätantiken Wurzeln, kein einheitliches «mittelalterliches Denken». Die Übertragung auf heutige Ereignisse ist unser Experiment, kein damaliges Selbstzeugnis.'},
 egypt:{name:'Welt als Aufgabe der Erneuerung',short:'Ordnung & Erneuerung',action:'Ordnung ins Zentrum setzen',mechanism:'Die Ereignisse kreisen um die Frage nach einer gültigen Ordnung. In dieser Ansicht entscheidet nicht das spätere Datum über den Wert einer Veränderung, sondern ihr behaupteter Beitrag zu Erhaltung oder Erneuerung.',gain:'Wiederkehrende Versorgung, Rituale und die Arbeit am Erhalt einer Ordnung werden sichtbar – auch dort, wo eine Fortschrittserzählung nur Neuerungen sucht.',loss:'Wer eine Ordnung als selbstverständlich setzt, kann Hierarchien und ausgeschlossene Stimmen unsichtbar machen. Maʿat lässt sich nicht mit beliebiger heutiger Stabilität gleichsetzen.',task:'Benenne zuerst die Ordnung, die eine Person oder Institution hier bewahren will. Erzähle dann die Veränderung als Wiederherstellung. Wer müsste diesem Satz widersprechen, und weshalb?',counter:'Schalte das Zentrum aus: Was erscheint nun als umstrittene menschliche Entscheidung statt als Wiederherstellung des Richtigen?',paris:'Man könnte Klimapolitik als Sicherung von Lebensbedingungen statt als immer neues Wachstum erzählen. Diese Analogie erschliesst eine Frage nach Erhaltung; sie macht das Abkommen nicht zu einer ägyptischen Maʿat-Praxis.',source:'metKings',caution:'Ein heutiger Vergleich mit ausgewählten altägyptischen Ordnungsvorstellungen. Der Kreis ordnet hier den Bestand als Gedankenexperiment; er belegt keine historischen Zyklen.'},
 materialism:{name:'Welt aus Arbeit, Verfügung und Konflikten',short:'Materialismus',action:'Materielle Beziehungen aufspannen',mechanism:'Jedes Ereignis begegnet dir zugleich unter vier Fragen: nach Mitteln und Arbeit, Verfügung, Institutionen und Konflikten. Die Wiederholung desselben Bildes zeigt verschiedene Zugänge zu demselben Geschehen, keine vier verschiedenen Ereignisse.',gain:'Die Ansicht lenkt den Blick hinter den sichtbaren Anlass: Wer arbeitet, wer verfügt über Mittel, wer trägt Kosten, wer kann Veränderungen durchsetzen?',loss:'Ein fertiges Schema kann Motive, religiöse Überzeugungen und Zufälle voreilig aus wirtschaftlichen Verhältnissen ableiten. Die Verbindungslinien sind Fragen, noch keine bewiesenen Ursachen.',task:'Wähle zwei der vier Felder. Formuliere eine Wirkung mit benannten Akteuren: Wer kann aufgrund welcher Verfügung was tun? Ergänze eine Rückwirkung von Politik oder Ideen auf die materiellen Bedingungen.',counter:'Schalte das Gefüge aus. Welche Erklärung würde ohne Eigentum, Arbeit und Verteilung fehlen? Welche Erklärung wäre umgekehrt durch diese drei Begriffe allein noch nicht geleistet?',paris:'Am Pariser Abkommen werden Energieanlagen, Investitionen, politische Regeln und ungleich verteilte Kosten zu Untersuchungsgegenständen. Dass wirtschaftliche Interessen relevant sind, beweist noch nicht, dass sie jede Entscheidung vollständig bestimmen.',source:'marxPreface',caution:'Die vier Untersuchungsfelder sind eine didaktische Annäherung. Keine automatische Abfolge weltweit gleicher Gesellschaftsstufen und keine vorab entschiedene Ursache.'},
 recurrence:{name:'Welt in Wiederholungen und Unterschieden',short:'Wiederkunft & Vergleich',action:'Daten in Umläufe legen',mechanism:'Der einstellbare Umlauf legt Jahreszahlen auf eine Spirale. Verändere seine Länge: Andere Ereignisse geraten nebeneinander. Du erlebst unmittelbar, wie eine gewählte Ordnung Ähnlichkeit erzeugen kann.',gain:'Vergleiche werden angeregt: Wiederkehrende Probleme, Praktiken oder Erzählmuster können über grosse Zeitabstände hinweg auffallen.',loss:'Geometrische Nachbarschaft kann als Wiederholung missverstanden werden. Ein eingestellter Zeitraum erklärt kein Ereignis und bestätigt Nietzsches Wiederkunftsgedanken nicht.',task:'Wähle zwei scheinbar benachbarte Spuren. Benenne genau eine Gemeinsamkeit und einen Unterschied ihrer Ursachen oder Handlungsmöglichkeiten. Ändere dann den Umlauf: Trägt dein Vergleich noch?',counter:'Schalte die Umläufe aus. War deine Gemeinsamkeit am Material erkennbar oder nur an der vorherigen Position im Bild?',paris:'Wiederholte Klimaverhandlungen sind nicht die Wiederkehr desselben historischen Moments. Prüfe Veränderungen von Wissen, Beteiligten und Handlungsmöglichkeiten, bevor du vom «Immergleichen» sprichst.',source:'nietzsche341',caution:'Die Spirale ist eine Vergleichsanordnung. Nietzsches ewige Wiederkunft, seine Historienkritik von 1874 und empirisch beobachtete Rhythmen sind verschiedene Dinge.'},
 direction:{name:'Welt auf dem Weg zu mehr Freiheit?',short:'Fortschritt & Brüche',action:'Spätere Zeit als Aufstieg zeichnen',mechanism:'Die eingeschaltete Treppe lässt spätere Daten höher erscheinen. Diese absichtlich starke Bildbehauptung ist noch kein Freiheitsmass. Gegenbefunde lassen sich unten begründet zuordnen und aus der Treppe herauslösen.',gain:'Ein ausdrücklich benannter Massstab ermöglicht Urteile über Veränderungen, etwa politische Teilhabe oder Handlungsmöglichkeiten.',loss:'Die Leserichtung kann ein notwendiges Ziel suggerieren, Verluste überdecken und Menschen zu blossen Stufen einer fremden Erfolgsgeschichte machen.',task:'Lege einen Massstab für Freiheit und eine betroffene Gruppe fest. Prüfe am Ereignis, ob Handlungsmöglichkeiten wachsen, schwinden oder sich ungleich verändern. Nutze für einen Gegenbefund die Zuordnung «Grenze / Gegenbefund».',counter:'Nimm den Aufstieg weg. Welche Rangfolge könntest du noch mit Quellen begründen? Welche offen gewesene Möglichkeit verschwindet in der Erfolgsgeschichte?',paris:'Ein internationaler Vertrag kann als Zuwachs gemeinsamer Handlungsfähigkeit erzählt werden. Ob daraus mehr Freiheit oder Sicherheit entsteht, muss an Umsetzung und Verteilung geprüft werden; das Datum 2015 allein ist kein Erfolgsmass.',source:'hegel',caution:'Die Treppe überzeichnet eine Fortschrittsannahme zur Kritik; sie bildet Hegels Philosophie nicht vollständig ab. Kosellecks offene Zukunft und Hararis Kontingenz setzen andere Akzente.'},
 layers:{name:'Welt mit verschiedenen Geschwindigkeiten',short:'Zeitschichten',action:'Längere Zusammenhänge mitsehen',mechanism:'Dasselbe Ereignis erscheint als datierter Punkt, als Frage nach einer Entwicklung und als Frage nach länger wirksamen Bedingungen. Die unterschiedlich langen Bänder sind sichtbare Untersuchungshorizonte, keine gemessenen Prozessdauern.',gain:'Der scheinbar plötzliche Umbruch bekommt eine Vorgeschichte; Beschluss, Alltag und materielle Umwelt müssen nicht gleichzeitig wechseln.',loss:'Zu breite Schichten können Entscheidungen und Brüche verschlucken. Eine anschauliche Dauer ersetzt keine Datierung von Anfang, Ende und Fortbestehen.',task:'Beginne beim datierten Vorgang. Benenne eine Entwicklung und eine langsam veränderliche Bedingung, die dafür relevant sein könnten. Für welche Verbindung besitzt du bereits einen Beleg?',counter:'Blende die längeren Horizonte aus. Was wirkt nun plötzlich, das vorher als vorbereitet erschien? Prüfe, ob du diese Vorbereitung tatsächlich belegen kannst.',paris:'Die Annahme des Abkommens, der Umbau von Energieanlagen und langfristige Klimawirkungen haben unterschiedliche Zeiten. Die drei Bänder fordern zur Untersuchung auf; sie geben keine pauschalen Zeitdauern dieser Prozesse vor.',source:'braudel',caution:'Braudels unterschiedliche Zeitdauern sind ein Forschungszugang. Derselbe Gegenstand kann je nach Frage in mehreren Schichten untersucht werden.'},
 present:{name:'Welt von einer Gegenwart aus',short:'Augustinus · Erlebte Zeit',action:'Späteres Wissen zurückhalten',mechanism:'Dein Standjahr teilt den Bestand in vorher, jetzt und später. Hinter dem Erwartungshorizont werden spätere Ereignisse zunächst verdeckt. Sie stehen dem historischen Blickpunkt noch nicht als abgeschlossene Tatsachen zur Verfügung.',gain:'Die Ansicht unterbricht rückblickende Gewissheit: Erinnern, Wahrnehmen und Erwarten sind gegenwärtige Tätigkeiten, keine drei Behälter fertiger Ereignisse.',loss:'Ein früheres Datum beweist keine tatsächliche Erinnerung. Die Darstellung kann das Erleben konkreter Menschen ohne ihre Zeugnisse nicht rekonstruieren.',task:'Versetze den Standpunkt vor das gewählte Ereignis. Formuliere eine damals mögliche Erwartung mit Beleg. Öffne danach den Rückblick: An welcher Stelle hattest du späteres Wissen unbemerkt vorausgesetzt?',counter:'Zeige spätere Ereignisse wieder. Notiere einen Satz, den nur die rückblickende Darstellung sagen kann – und keinen damaligen Akteur sagen lassen darf.',paris:'Aus dem Jahr 2014 ist das Abkommen von 2015 kein bereits bekanntes Ergebnis. Welche Ziele oder Befürchtungen damals vorlagen, müssen zeitgenössische Aussagen zeigen, nicht der spätere Vertrag.',source:'augustine',caution:'Augustinus untersucht Zeit im Bewusstsein. Die Wissensblende ist eine didaktische Übertragung; selbst frühere Ereignisse waren nicht allen Menschen bekannt.'},
 memoria:{name:'Welt als ausgewählte Erinnerung',short:'Memoria',action:'Nur ausgewählte Erinnerungen hervorheben',mechanism:'Alle Spuren liegen zunächst gleichberechtigt im Bestand. Ordne einzelne unten einem sozialen Rahmen oder einer kulturellen Form zu. Mit eingeschalteter Erinnerungsblende treten genau diese eigenen Entscheidungen hervor; die anderen Spuren verblassen, bleiben aber erreichbar.',gain:'Die Ansicht macht erfahrbar, dass gegenwärtige Gruppen und Praktiken auswählen, welche Vergangenheit öffentlich oder persönlich präsent bleibt.',loss:'Die Auswahl in dieser Übung ist noch kein Nachweis eines wirklichen kollektiven Gedächtnisses. Auch Schweigen kann nur mit einem begründeten Vergleich als Auslassung beschrieben werden.',task:'Benenne eine konkrete erinnernde Gruppe und eine Praxis: Gespräch, Jahrestag, Museum, Schulbuch oder Denkmal. Wähle eine Spur dafür und begründe, warum diese Gruppe sie aufgreifen könnte. Was müsste für eine historische Aussage zusätzlich belegt werden?',counter:'Hebe die Erinnerungsblende auf. Welche Spuren hat deine Auswahl zurückgedrängt? Lass eine andere Gruppe dieselben Ereignisse auswählen und vergleiche.',paris:'Ein Jahrestag des Pariser Abkommens könnte einen politischen Erfolg hervorheben; eine andere Gruppe könnte unerfüllte Versprechen betonen. Erst konkrete Reden, Bilder oder Gedenkpraktiken belegen eine solche Erinnerung.',source:'assmann',caution:'Halbwachs: Soziale Beziehungen prägen Erinnern. Assmann: kommunikative Weitergabe und kulturelle Formen unterscheiden. Beides ist keine automatische Altersgrenze einer Erinnerung.'}
};
const PREMISE_LABS={
 egypt:{title:'Welche Ordnung soll eigentlich gelten?',intro:'«Erneuerung» setzt voraus, dass etwas als erhaltenswert gilt. Das ist selbst eine strittige historische Setzung. Eine stabile Ordnung kann für verschiedene Menschen sehr unterschiedliche Folgen haben.',fields:[['order','Welche konkrete Ordnung soll bewahrt oder wiederhergestellt werden?','Benenne Regeln oder Verhältnisse. «Alles soll wieder richtig sein» legt noch keinen Massstab offen.'],['authority','Wer erklärt diese Ordnung für richtig?','Nenne eine Position und eine Personengruppe, die deren Geltung bestreiten könnte.'],['change','Woran unterscheidest du Erneuerung von Veränderung?','Welcher konkrete Befund würde Kontinuität zeigen, welcher etwas Neues?'],['counter','Wo scheitert die Übertragung altägyptischer Begriffe?','Prüfe Unterschiede von Religion, Herrschaft und Quellenlage. Nicht jeder Wunsch nach Stabilität ist Maʿat.']],anchor:'order',open:'Welche Ordnung gilt, bleibt offen. Der Kreis begründet weder ihre Gerechtigkeit noch ihren historischen Bestand.',set:'Eine Ordnung ist vorgeschlagen. Dass sie richtig, allgemein anerkannt oder dauerhaft war, ist damit nicht belegt.',experiment:'Lass zwei Gruppen dieselbe Veränderung einmal als Wiederherstellung einer guten Ordnung, einmal als Festhalten an ungerechten Verhältnissen erzählen. Welche Quellen entscheiden über die tatsächlichen Folgen – und welche Wertentscheidung bleibt strittig?'},
 materialism:{title:'Was erklärt hier tatsächlich was?',intro:'Die vier Felder liefern noch keine Ursache. Erst eine konkrete Verbindung zwischen handelnden Menschen, materiellen Bedingungen und Institutionen wird zu einer prüfbaren Erklärung. «Die Wirtschaft war schuld» genügt nicht.',fields:[['actors','Wer handelt unter welchen materiellen Bedingungen?','Benenne Akteure, Arbeit, Mittel und Abhängigkeiten für die untersuchte Spur.'],['control','Wer verfügt worüber – und mit welchen Folgen?','Unterscheide Eigentum, Zugang, Entscheidungsgewalt und Erträge. Belege die behauptete Verfügung.'],['mechanism','Wie soll daraus die beobachtete Veränderung entstehen?','Formuliere einen Wirkungszusammenhang mit einem handelnden Akteur und einem überprüfbaren Zwischenschritt.'],['counter','Welche andere Erklärung müsste mitgeprüft werden?','Suche auch Rückwirkungen von Politik oder Ideen. Welcher Befund würde deine Wirkungskette schwächen?']],anchor:'mechanism',open:'Ein Wirkungszusammenhang ist noch offen. Nebeneinander gezeichnete Felder sind keine bewiesene Kausalität.',set:'Eine Wirkungskette ist formuliert. Die vier Ansichten zeigen, wo ihre Voraussetzungen und Gegenbefunde geprüft werden müssen.',experiment:'Erklärt dieselbe Entscheidung einmal aus Verfügung über Mittel und einmal aus einer belegten Überzeugung der Beteiligten. Prüft, ob die Erklärungen konkurrieren oder sich ergänzen. Eine Kombination ist nur dann mehr als eine Aufzählung, wenn ihr die Wechselwirkung zeigen könnt.'},
 recurrence:{title:'Was genau soll sich wiederholen?',intro:'Zwei Ereignisse können ähnlich aussehen und aus verschiedenen Bedingungen entstehen. Wer Wiederholung behauptet, muss zuerst entscheiden, welches Merkmal überhaupt gleich bleiben soll. Die Länge einer gezeichneten Runde beantwortet diese Frage nicht.',fields:[['criterion','Welches Merkmal vergleichst du?','Benenne ein konkretes Verhältnis, eine Praxis oder einen Ablauf. «Schon wieder eine Krise» ist noch kein Vergleichskriterium.'],['cases','Welche zwei Fälle tragen deinen Vergleich?','Nenne die Spuren und je einen Beleg. Unterscheide Ereignis, wiederkehrendes Ritual und philosophisches Gedankenexperiment.'],['difference','Welcher Unterschied könnte wichtiger sein als die Ähnlichkeit?','Prüfe Akteure, Voraussetzungen, Handlungsspielräume und Folgen.'],['counter','Wann würdest du auf die Wiederholungsbehauptung verzichten?','Ändere die Umlauflänge. Bleibt die Gemeinsamkeit am Material erkennbar, auch wenn die Bilder auseinanderwandern?']],anchor:'criterion',open:'Ein Vergleichskriterium fehlt noch. Die Spirale stellt eine Frage; sie weist keine historische Wiederkehr nach.',set:'Ein Vergleichskriterium ist benannt. Die Umläufe bleiben eine gewählte Darstellung und kein Naturgesetz der Geschichte.',experiment:'Ein Team begründet eine Wiederholung, ein anderes eine entscheidende Veränderung anhand derselben Fälle. Tauscht danach das Vergleichskriterium. Prüft, ob ihr verschiedene Antworten auf dieselbe Frage oder Antworten auf verschiedene Fragen gebt.'},
 layers:{title:'Wie lang dauert die Veränderung – und wovon?',intro:'Ein Datum ist kein Prozess, ein langes Band noch keine lange Dauer. Erst die Wahl des untersuchten Gegenstands macht Anfang, Ende und Veränderungsgeschwindigkeit diskutierbar.',fields:[['aspect','Welchen Vorgang oder Aspekt untersuchst du?','Begrenze den Gegenstand: ein Beschluss, eine Alltagspraxis, eine Infrastruktur oder etwas anderes.'],['process','Woran erkennst du die längerfristige Entwicklung?','Nenne zeitlich zuordenbare Befunde. Ein grosses Zeitfenster ist noch kein Beleg für Kontinuität.'],['structure','Welche langsam veränderliche Bedingung behauptest du?','Gib an, woran ihr Fortbestehen und eine mögliche Veränderung erkennbar wären.'],['counter','Wo würden deine Schichten einen Bruch oder eine Entscheidung verschlucken?','Prüfe auch, ob eine angeblich langsame Struktur sich für eine betroffene Gruppe plötzlich änderte.']],anchor:'aspect',open:'Der Untersuchungsgegenstand ist noch unbestimmt. Die Bänder dürfen deshalb nicht als festgestellte Dauern gelesen werden.',set:'Der Gegenstand ist benannt. Dauer und Wechselwirkung der Schichten bleiben mit datierten Befunden zu begründen.',experiment:'Untersucht dasselbe Ereignis einmal mit einem Jahr, einmal mit einem Jahrhundert Vorlauf. Welche Erklärung verändert sich? Belegt, ob die längere Vorgeschichte eine Ursache erschliesst oder nur zusätzliche Dinge gleichzeitig sichtbar macht.'},
 present:{title:'Wessen Gegenwart betreten wir?',intro:'Ein Standjahr allein versetzt uns nicht in das Bewusstsein damaliger Menschen. Verschiedene Personen hatten Zugang zu unterschiedlichen Nachrichten, Erinnerungen und Handlungsmöglichkeiten. Rückblickend bekannte Zukunft ist keine damalige Erwartung.',fields:[['person','Aus wessen Perspektive blickst du?','Benenne Person oder Gruppe, Ort und Situation. «Die Menschen damals» ist kein einheitlicher Standpunkt.'],['knowledge','Welche Informationen waren dieser Person zugänglich?','Unterscheide eine zeitgenössisch belegte Kenntnis von einer bloss denkbaren Kenntnis.'],['expectation','Welche Erwartung lässt sich aus damaligen Zeugnissen erschliessen?','Nenne den Beleg. Formuliere gegebenenfalls mehrere offene Möglichkeiten statt des später eingetretenen Ergebnisses.'],['counter','Wo schleust du späteres Wissen ein?','Öffne den Rückblick und markiere eine Aussage, die aus der damaligen Gegenwart nicht begründbar war.']],anchor:'person',open:'Der historische Standpunkt bleibt offen. Die Datumsgrenze allein rekonstruiert keine Erinnerung oder Erwartung.',set:'Ein Standpunkt ist vorgeschlagen. Was diese Person wusste, erinnerte oder erwartete, muss weiterhin quellenbezogen geprüft werden.',experiment:'Zwei Gruppen betrachten dasselbe Jahr aus unterschiedlichen sozialen Positionen. Welche Zukunft erscheint jeweils möglich? Öffnet erst danach die späteren Ereignisse. Prüft, ob ihr damalige Unsicherheit ernst genommen oder nur das Ergebnis geschickt vorweggenommen habt.'},
 memoria:{title:'Wer erinnert sich – und wer bestimmt die Auswahl?',intro:'Ein Gedächtnis gehört nicht einfach einer Epoche oder einem Land. Erst wenn erinnernde Gruppen, Medien und Anlässe benannt sind, lässt sich die Auswahl von Vergangenheit untersuchen. Auch das Behaupten von Vergessen braucht Belege.',fields:[['group','Welche konkrete Gruppe erinnert?','Benenne soziale Beziehungen oder eine Institution. Innerhalb dieser Gruppe kann die Erinnerung umstritten sein.'],['practice','Durch welche Praxis wird Vergangenheit gegenwärtig?','Nenne zum Beispiel ein belegtes Gespräch, einen Jahrestag, eine Ausstellung oder einen Text und seine Verwendung.'],['selection','Was wird hervorgehoben – und welche Stimme bleibt zurück?','Ordne unten einzelne Spuren begründet zu. Trenne deine Auswahl im Experiment von einer belegten Erinnerungspraxis.'],['counter','Woran wäre eine Auslassung oder eine andere Erinnerung erkennbar?','Fehlen in deiner Ansicht bedeutet nicht, dass sich historisch niemand erinnerte. Suche eine unabhängige Gegenüberlieferung.']],anchor:'group',open:'Die erinnernde Gruppe ist noch offen. Alle Spuren bleiben gleich sichtbar; ohne benannten Rahmen wird keine kollektive Erinnerung suggeriert.',set:'Ein Erinnerungsrahmen ist benannt. Mit der Blende werden deine Zuordnungen hervorgehoben; sie sind noch kein Befund über ein wirkliches Gruppengedächtnis.',experiment:'Wählt dieselben Spuren einmal für ein Familiengespräch, einmal für eine öffentliche Ausstellung. Begründet beide Auswahlen und prüft anschliessend, welche angenommene Gemeinsamkeit der Gruppe ihr vielleicht erst selbst hergestellt habt.'}
};
const premiseKey=(mode,field)=>'premise-'+mode+'-'+field;
function premiseValue(mode,field){return (state.notes[premiseKey(mode,field)]||'').trim()}
function premiseShort(mode,field,fallback){const v=premiseValue(mode,field);return v?esc(v.slice(0,65)+(v.length>65?'…':'')):fallback}
function premiseLabHtml(){const p=PREMISE_LABS[representation];if(!p)return '';return `<section class="premise-lab telos-lab"><p class="eyebrow">DIE VORAUSSETZUNG IST SELBST EINE FRAGE</p><h3>${p.title}</h3><p>${p.intro}</p><p class="small">Arbeitsannahmen für deine Untersuchung: Sie gelten nicht automatisch für alle Spuren. Widersprechende Fälle können Anlass sein, sie zu verändern oder auf sie zu verzichten.</p><div class="telos-fields">${p.fields.map(([key,label,hint])=>`<label>${label}<textarea data-premise="${key}" rows="3" maxlength="4000" placeholder="${hint}">${esc(state.notes[premiseKey(representation,key)]||'')}</textarea><small>${hint}</small></label>`).join('')}</div><button id="premiseApply">Arbeitsannahme in der Ansicht prüfen</button><p class="premise-status">${premiseValue(representation,p.anchor)?p.set:p.open}</p><details><summary>Dieselbe Vergangenheit – konkurrierende Konstruktionen</summary><p>${p.experiment}</p><p>Ein begründetes Offenlassen, Verändern oder Zurückweisen des Ansatzes ist möglich. Es gibt keine automatisch richtige Einordnung; entscheidend sind die Belege und die Reichweite deiner Aussage.</p></details></section>`}
function premiseSceneCaption(){const p=PREMISE_LABS[representation];if(!p)return '';const entries=p.fields.filter(([key])=>premiseValue(representation,key));return `<div class="premise-caption"><strong>${entries.length?'Deine Arbeitsannahmen – zur Prüfung':'Voraussetzung noch offen'}</strong>${entries.length?`<dl>${entries.map(([key,label])=>`<dt>${label}</dt><dd>${esc(premiseValue(representation,key))}</dd>`).join('')}</dl>`:`<p>${p.open}</p>`}</div>`}

const TELOS_FIELDS=[['goal','Worin soll das Ziel der Geschichte bestehen?','Du darfst offenlassen, ob sich überhaupt ein gemeinsames Ziel begründen lässt.'],['standpoint','Wer setzt dieses Ziel – und wer könnte widersprechen?','Eine konkrete Position oder Gruppe; nicht einfach «die Menschheit».'],['necessity','Warum sollte Geschichte darauf zulaufen?','Unterscheide: Ich wünsche es – Menschen verfolgen es – Geschichte erreicht es notwendig.'],['counter','Welcher Befund würde deine Deutung erschüttern?','Prüfe auch, ob jedes Scheitern nachträglich als Umweg zum Ziel erklärt werden könnte.']];
const telosKey=(mode,field)=>'telos-'+mode+'-'+field;
function telosGoal(mode){return (state.notes[telosKey(mode,'goal')]||'').trim()}
function telosHeading(mode){const goal=telosGoal(mode);return goal?'Vorgeschlagenes Telos: '+goal.slice(0,65)+(goal.length>65?'…':''):'Telos offen: Worauf soll Geschichte zulaufen?'}
function telosHtml(){if(!['medieval','direction'].includes(representation))return '';return `<section class="telos-lab"><p class="eyebrow">BEVOR DIE GESCHICHTE EIN ZIEL BEKOMMT</p><h3>Wohin eigentlich?</h3><p>Eine Richtung lässt sich leicht zeichnen. Ein Ziel der gesamten Geschichte lässt sich dadurch noch nicht begründen. Ein erstrebenswertes Ziel ist ausserdem etwas anderes als ein Ziel, das der geschichtliche Verlauf notwendig erreicht.</p><p>${representation==='medieval'?'Im historischen christlichen Modell ist Vollendung religiös begründet. Wenn wir dieses Modell heute übernehmen, müssen wir seine Glaubensvoraussetzung ausdrücklich mitbedenken. «Vollendung» allein erklärt noch nicht, was wir darunter verstehen.':'«Mehr Freiheit» klingt zustimmungsfähig. Offen bleibt, wessen Freiheit gemeint ist, wie sie bestimmt wird und weshalb Geschichte sie notwendig verwirklichen sollte.'}</p><div class="telos-fields">${TELOS_FIELDS.map(([key,label,hint])=>`<label>${label}<textarea data-telos="${key}" rows="3" maxlength="4000" placeholder="${hint}">${esc(state.notes[telosKey(representation,key)]||'')}</textarea><small>${hint}</small></label>`).join('')}</div><button id="telosApply">Zielvorstellung in der Ansicht prüfen</button><p class="telos-status">${telosGoal(representation)?'Eine Zielvorstellung ist formuliert. Damit sind weder ihr allgemeiner Geltungsanspruch noch die Notwendigkeit des Verlaufs begründet.':'Die Zielfrage bleibt offen. Das ist eine mögliche begründete Position, kein unvollständig ausgefüllter Auftrag.'}</p><details><summary>Gedankenexperiment: Wenn wir uns nicht auf ein Telos einigen …</summary><p>Lasst zwei Gruppen unterschiedliche Ziele für denselben Ereignisbestand formulieren. Welche Ereignisse erscheinen jeweils als Fortschritt, Rückschritt oder nebensächlich? Prüft danach, ob ihr einen ganzen Geschichtsverlauf erklärt oder nur eine eigene Hoffnung rückblickend in ihn hineinlest.</p><p>Ihr könnt auch zum Ergebnis kommen, dass sich kein gemeinsames Telos rechtfertigen lässt. Untersucht dann, ob historisches Handeln trotzdem begrenzte Ziele verfolgen und begründet beurteilt werden kann. Die Schwierigkeit der Konstruktion soll erfahrbar werden; ihr Scheitern steht nicht als richtige Antwort vorab fest.</p></details></section>`}
function worldSelection(items){return items.filter(e=>Number.isFinite(e.year)&&(centurySelection!==null||worldAll||Math.abs(tunnelOrdinal(e.year)-tunnelOrdinal(worldYear))<=worldWindow))}
function worldCard(e,x,y,w=120,dim=false,hidden=false){const layout=readingLayout(e,x,y,w);x=layout.x;y=layout.y;w=layout.w;dim=dim||layout.dim;const h=e.image?88:60;return `<foreignObject x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" style="overflow:visible"><button xmlns="http://www.w3.org/1999/xhtml" class="world-event ${layout.cls} ${e.id===lensFocus?'selected':''} ${dim?'world-muted':''}" data-lens-focus="${esc(e.id)}" style="width:${w}px;height:${h}px;border-top:4px solid ${LANES.find(l=>l[0]===e.lane)?.[3]||'#9ca'}" title="${esc(layout.title||LANES.find(l=>l[0]===e.lane)?.[1]||'Begriff')}" aria-label="${hidden?'Spätere Spur – aus dieser Gegenwart noch nicht bekannt':esc(e.title)}">${e.image&&!hidden?`<img src="${imageSrc(e.image)}" alt=""/>`:''}<small>${hidden?'Noch nicht geschehen':esc(yr(e.year))}</small><strong>${hidden?'Erwartung ist kein Rückblick':esc(e.title)}</strong></button></foreignObject>`}
function boardCard(e,hidden=false){
 const d=readingDecision(e.id),valid=d&&!d.stale&&worldAssumption,role=valid?d.role:'open';
 return `<button class="board-card reading-${role} ${d?.stale?'reading-stale':''} ${e.id===lensFocus?'selected':''}" data-lens-focus="${esc(e.id)}" aria-label="${hidden?'Spätere Spur – aus dieser Gegenwart noch nicht bekannt':esc(e.title)}">${e.image&&!hidden?`<img loading="lazy" src="${imageSrc(e.image)}" alt="">`:''}<span class="board-card-copy"><small>${hidden?'Nach dem Standjahr':esc(spurDate(e))} · ${esc(LANES.find(l=>l[0]===e.lane)?.[1]||'Begriff')}</small><strong>${hidden?'Erwartung ist kein Rückblick':esc(e.title)}</strong><span class="board-verdict">${hidden?'Ausgang verdeckt':d?.stale?'Voraussetzung geändert · erneut prüfen':valid?esc(READING_ROLES[representation][ROLE_KEYS.indexOf(role)])+' · '+['','Nebenbezug','Wichtig','Tragender Bezug'][d.weight]:'Noch keine begründete Einordnung'}</span>${valid&&!hidden?`<span class="board-reason">${esc(d.reason)}</span>`:''}<span class="board-open">Untersuchen und einordnen ↗</span></span></button>`;
}
function legacyWorldBoardHtml(items){
 const mode=representation,shown=worldSelection(items).sort((a,b)=>a.year-b.year),fresh=e=>{const d=readingDecision(e.id);return worldAssumption&&d&&!d.stale?d:null};
 const cards=(arr,hidden=false)=>arr.map(e=>boardCard(e,hidden)).join('');
 const field=(title,help,arr,cls='')=>`<section class="board-field ${cls}"><h4>${esc(title)} <span>${arr.length}</span></h4><p>${esc(help)}</p><div class="board-cards">${cards(arr)}</div>${arr.length?'':'<p class="board-empty">Hier steht noch keine begründete Zuordnung.</p>'}</section>`;
 const roles=(keys=ROLE_KEYS)=>keys.map(k=>field(READING_ROLES[mode][ROLE_KEYS.indexOf(k)],'Zuordnung aus deinem aktiven Entwurf; die Begründung steht auf der Karte.',shown.filter(e=>fresh(e)?.role===k),'board-role-'+k)).join('');
 let body='',unplaced=shown.filter(e=>!fresh(e)),heading='',caption='';
 const anchor=['medieval','direction'].includes(mode)?telosGoal(mode):premiseValue(mode,PREMISE_LABS[mode].anchor);
 if(!worldAssumption){heading='Voraussetzung ausgeschaltet';body=field('Datierte Spuren ohne diese Deutung','Die Ereignisse bleiben erhalten; deine Einordnungen werden vorübergehend nicht angewendet.',shown);unplaced=[];}
 else if(mode==='medieval'){
 heading='Heilshorizont und irdisches Geschehen';
 body=`<div class="board-telos"><span>RELIGIÖSE VORAUSSETZUNG · NICHT DATIERBAR</span><h3>${esc(anchor||'Welches Heil oder welche Vollendung wird erwartet?')}</h3><p>${anchor?'Diese Setzung gibt der folgenden Deutung ihren Horizont.':'Ohne eine benannte Vorstellung von Vollendung lässt sich keine Spur als Annäherung daran ausweisen.'}</p><a href="#interpretationSettings">Heilshorizont formulieren oder ändern ↓</a></div><div class="board-relation">↓ Von dieser Setzung aus deuten – keine nachgewiesene Ursache ↓</div><div class="board-branches">${roles(['support','counter'])}</div><div class="board-secondary">${roles(['ambivalent','outside'])}</div>`;
 caption='Keine Karte steht allein wegen ihres Datums näher am Heil. Nur deine begründete Entscheidung führt sie in ein Deutungsfeld.';
 }else if(mode==='direction'){
 heading='Fortschritt braucht einen Massstab';body=`<div class="board-telos"><span>DEIN MASSSTAB</span><h3>${esc(anchor||'Das Ziel ist noch offen')}</h3><a href="#interpretationSettings">Ziel und Standpunkt bearbeiten ↓</a></div><div class="board-scale"><span>Gegenbefund ←</span><span>Widersprüchlich</span><span>→ Beitrag zum Ziel</span></div><div class="board-three">${roles(['counter','ambivalent','support'])}</div>${roles(['outside'])}`;caption='Die Felder unterscheiden Wertungen nach deinem Massstab. Sie stellen keine zwangsläufige Aufwärtsentwicklung dar.';
 }else if(mode==='egypt'){
 heading='Welche Ordnung wird bewahrt – und auf wessen Kosten?';body=`<div class="board-order"><div class="board-telos"><span>ZU BEWAHRENDE ORDNUNG</span><h3>${esc(anchor||'Die Ordnung ist noch nicht benannt')}</h3><a href="#interpretationSettings">Ordnung und Autorität bestimmen ↓</a></div><div class="board-branches">${roles(['support','counter'])}</div><div class="board-relation">↺ Erhalten und erneuern | Infragestellen und verändern ↗</div><div class="board-secondary">${roles(['ambivalent','outside'])}</div></div>`;caption='Erhaltung und Veränderung sind Beziehungen zur gesetzten Ordnung. Ein Kreislauf sämtlicher Ereignisse wird nicht behauptet.';
 }else if(mode==='memoria'){
 heading='Erinnerung hat ein Zentrum und Auslassungen';body=`<div class="board-telos"><span>ERINNERNDE GRUPPE / PERSPEKTIVE</span><h3>${esc(anchor||'Wer erinnert? Noch offen')}</h3><a href="#interpretationSettings">Gruppe und Erinnerungspraxis bearbeiten ↓</a></div><div class="board-memory-center">${roles(['support'])}</div><div class="board-branches">${roles(['counter','ambivalent'])}</div><div class="board-memory-edge">${roles(['outside'])}</div>`;caption='Soziale Beziehungen und kulturelle Vermittlung: Überlappende Erinnerungsräume. Zentrum und Rand ergeben sich aus belegten Zuordnungen, nicht aus automatisch unterstellten Gruppenmeinungen.';
 }else if(mode==='materialism'||mode==='layers'){
 heading=mode==='layers'?'Ereignis, Entwicklung und lange Dauer':'Arbeit, Verfügung und gesellschaftlicher Konflikt';
 body=`<div class="board-telos"><span>UNTERSUCHTER ZUSAMMENHANG</span><h3>${esc(anchor||'Arbeitsannahme noch offen')}</h3><a href="#interpretationSettings">Untersuchungsfrage bearbeiten ↓</a></div><div class="${mode==='layers'?'board-strata':'board-production'}">${GLOBAL_LENSES[mode].slots.map(([key,title,help])=>field(title,help,shown.filter(e=>lensAssignment(mode,e.id)===key),'board-slot-'+key)).join('')}</div>`;
 unplaced=shown.filter(e=>!lensAssignment(mode,e.id));caption=mode==='layers'?'Jede Spur steht bei deinem gewählten Untersuchungsschwerpunkt. Die Bandhöhe misst keine Dauer; eine Laufzeit muss belegt werden.':'Die vier verbundenen Felder sind Untersuchungsfragen. Eine Wirkungskette musst du an handelnden Akteuren und Belegen erklären.';
 }else if(mode==='present'){
 heading='Eine Gegenwart mit unbekannter Zukunft';const past=shown.filter(e=>e.year<=worldYear),future=shown.filter(e=>e.year>worldYear);
 body=`<div class="board-telos"><span>STANDPUNKT ${esc(yr(worldYear))}</span><h3>${esc(anchor||'Wessen Wissen und Erwartungen?')}</h3></div><div class="board-branches">${field('Vorher und bis jetzt','Mögliche Erinnerungsbezüge. Ein früheres Datum beweist nicht, dass eine Person davon wusste.',past)}<section class="board-field board-future"><h4>Danach · Ausgang offen <span>${future.length}</span></h4><p>Aus dieser Gegenwart noch nicht als Ergebnis bekannt. Öffne eine Spur für die Untersuchung im Rückblick.</p><div class="board-cards">${cards(future,true)}</div></section></div>`;unplaced=[];caption='Links mögliche Erinnerungsbezüge, rechts verdeckte spätere Ereignisse. Erwartungen benötigen zeitgenössische Belege.';
 }else{
 heading='Wiederholung prüfen: Zeitabstand ist noch keine Ähnlichkeit';const groups=new Map();for(const e of shown){const n=Math.floor((tunnelOrdinal(e.year)-tunnelOrdinal(worldYear))/worldPeriod);if(!groups.has(n))groups.set(n,[]);groups.get(n).push(e)}
 body=`<div class="board-telos"><span>VERGLEICHSKRITERIUM</span><h3>${esc(anchor||'Was genau soll wiederkehren?')}</h3><p>Versuchsweise Zeitabschnitte: ${worldPeriod} Jahre · Bezugspunkt ${esc(yr(worldYear))}</p></div><div class="board-cycles">${[...groups].map(([n,arr])=>field('Zeitabschnitt '+(n===0?'am Bezugspunkt':n<0?Math.abs(n)+' davor':n+' danach'),'Gleiche Abschnittslänge ist eine Setzung. Die Karten belegen noch keine Wiederholung.',arr)).join('')}</div>`;unplaced=[];caption='Ändere die Abschnittslänge, um die Abhängigkeit der Gruppierung von deiner Setzung zu sehen. Vergleiche zusätzlich Ursachen, Akteure und Unterschiede.';
 }
 return `<figure class="world-scene semantic-board board-${mode}"><header><p class="eyebrow">EREIGNISTAFEL · ${esc(activeReading()?.name||'Dein Entwurf')}</p><h3>${heading}</h3><p>${shown.length} datierte Spuren im Zeitfenster · ${items.length} im gefilterten Bestand. Klicke eine Karte, um ihre Quelle und deine Deutung zu bearbeiten.</p></header>${body}${unplaced.length?field('Noch zu untersuchen','Diese Spuren sind noch keinem gültigen Deutungsfeld zugewiesen. Sie stehen hier chronologisch, ohne behauptete Beziehung zum Ziel oder zur Gruppe.',unplaced,'board-unplaced'):''}${!shown.length?'<p>Keine datierten Spuren in dieser Auswahl. Wähle «Gesamte Zeit» oder einen anderen Zeitraum.</p>':''}<figcaption>${caption}${premiseSceneCaption()}</figcaption></figure>`;
}
function lensUniverseHtml(query='',own=false){
 const model=GLOBAL_LENSES[representation],reading=WORLD_READINGS[representation],items=lensItems(query,own),corpus=lensCorpus();let focus=byId(lensFocus)||byId('paris')||corpus[0];lensFocus=focus.id;
 const assignment=lensAssignment(representation,lensFocus),source=SOURCES[reading.source],src=source?.url?`<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)}</a>`:'';
 return `<section class="world-view"><div class="mode-heading"><p class="eyebrow">WELTGESCHEHEN ANDERS SEHEN · EINE KONSTRUKTION ERPROBEN</p><h2>${reading.name}</h2><p>${reading.mechanism}</p></div>${perspectiveNavigation()}<div class="world-controls"><label>Betrachtungszeit <select id="worldTime"><option value="recent" ${!worldAll?'selected':''}>Zeitfenster um mein Standjahr</option><option value="all" ${worldAll?'selected':''}>Gesamte Zeit</option></select></label><label>Standjahr <input id="worldYear" type="number" value="${worldYear}" step="1"></label><button id="worldGo">Standpunkt setzen</button><label>Zeitfenster ± Jahre <select id="worldWindow">${[25,50,130,500,2000,20000].map(n=>`<option ${n===worldWindow?'selected':''} value="${n}">${n}</option>`).join('')}</select></label><button id="worldNow">Gegenwart betrachten</button></div><label class="world-assumption"><input id="worldAssumption" type="checkbox" ${worldAssumption?'checked':''}>${reading.action}</label>${representation==='recurrence'?`<label class="world-cycle">Länge eines versuchsweisen Umlaufs <input id="worldPeriod" type="range" min="10" max="500" value="${worldPeriod}"><output>${worldPeriod} Jahre</output></label>`:''}<div id="interpretationExperiment" tabindex="-1">${randomConceptHtml()}${worldSceneHtml(items)}</div>${readingComparisonHtml(items)}<details class="board-help"><summary>Diese Ereignistafel lesen</summary>${worldReadingGuide()}</details>${concreteReadingHtml()}${perspectiveIntroduction()}<div id="interpretationSettings" tabindex="-1"></div>${profilePanelHtml()}${telosHtml()}${premiseLabHtml()}<p class="world-experiment">Gedankenexperiment: Die Bildordnung ist unsere Übertragung. Sie beschreibt nicht automatisch, wie die Beteiligten selbst dachten.</p><div class="world-consequences"><article><h3>Was dieser Blick erschliesst</h3><p>${reading.gain}</p></article><article><h3>Was er verdecken kann</h3><p>${reading.loss}</p></article></div><section class="world-workbench"><div><label for="lensFocus">Ein Ereignis in dieser Ansicht untersuchen</label><select id="lensFocus">${corpus.map(e=>`<option value="${esc(e.id)}" ${e.id===lensFocus?'selected':''}>${esc(spurDate(e))} · ${esc(e.title)}</option>`).join('')}</select><h3>${esc(focus.title)}</h3><p>${esc(focus.intro||focus.question||'Eigene Spur')}</p>${focus.image?`<img class="world-focus-image" src="${imageSrc(focus.image)}" alt="${esc(focus.title)}">`:''}<button id="lensSource">Quelle und Materialien öffnen ↗</button>${!items.some(e=>e.id===lensFocus)?'<p class="notice">Diese Spur liegt ausserhalb des aktuellen Suchfilters bzw. der Kategorienauswahl. Die Auswahl bleibt für deinen Vergleich erhalten.</p>':''}<p class="small">Quellenbefund und Deutung trennen: ${esc(focus.text||'Öffne die eigene Spur und prüfe ihre Belege.')}</p></div><div><p class="eyebrow">MIT DIESER KONSTRUKTION ERZÄHLEN</p><h3>${reading.short}: ${esc(focus.title)}</h3><p>${reading.task}</p>${lensFocus==='paris'?`<p class="world-example"><strong>Ein möglicher Ansatz, keine historische Aussage:</strong> ${reading.paris}</p>`:''}<h4>Die Konstruktion aufbrechen</h4><p>${reading.counter}</p>${decisionEditorHtml(focus)}<label for="lensPlacement">Ergänzender Untersuchungsschwerpunkt</label><select id="lensPlacement"><option value="">Noch offen</option>${model.slots.map(([k,t])=>`<option value="${k}" ${assignment===k?'selected':''}>${t}</option>`).join('')}</select>${modeNote(lensNoteKey(representation,lensFocus),'Deine Erzählung und ihre Gegenprüfung','Meine Erzählung unter diesem Geschichtsbild: …\nWas ich aus der Quelle belegen kann: …\nWas erst die Konstruktion hineinträgt: …\nWas ein anderer Blick sichtbar macht: …')}<label for="lensSwitch">Dasselbe Ereignis anders sehen</label><select id="lensSwitch">${perspectiveOptions(representation)}</select></div></section><details class="world-foundations"><summary>Historischer Ansatz, Quellen und Unterschiede innerhalb des Modells</summary><p>${reading.caution}</p>${lensExplanationHtml()}<p>${src}</p><button id="lensTheory">Konzept und Quellen erklären ↗</button><button id="lensExamples">${representation==='recurrence'?'Nietzsche und den Podcast öffnen ↗':'Weitere Ausprägungen und Beispiele ↗'}</button><button data-switch="network">Begriffsbeziehungen nachschlagen ↗</button></details><details class="world-register"><summary>Alle Spuren dieser Auswahl (${items.length}) – auch ausserhalb des Bildausschnitts</summary><p class="lens-count">${items.length} von ${corpus.length} Spuren im gewählten Bestand. Undatierte Begriffe werden nicht künstlich in die Grafik datiert.</p><div>${items.map(e=>corpusEntryHtml(e,'data-lens-focus')).join('')}</div></details><div class="world-compare"><label for="lensPartner">Mit einer weiteren Spur vergleichen</label><select id="lensPartner">${corpus.filter(e=>e.id!==lensFocus).map(e=>`<option value="${esc(e.id)}">${esc(e.title)}</option>`).join('')}</select><button id="lensCompare">Vergleich begründen ↗</button></div></section>`;
}
function renderLensUniverse(){
 ensureReading(representation);if(prepareRandomConcept()){render();return}const stage=$('#modeStage');stage.innerHTML=lensUniverseHtml($('#search').value,onlyOwn);compactWorldWorkspace();wireMode();installProfileZoom();
 const redraw=()=>renderMode();wireReadings(redraw);if($('#randomHeilButton'))$('#randomHeilButton').onclick=()=>{try{randomConceptDraft();render();}catch(e){$('#randomHeilStatus').textContent=e.message}};$$('[data-concrete-choice]').forEach(b=>b.onclick=()=>{concreteChoice[representation]=Number(b.dataset.concreteChoice);redraw();$('.concrete-choice').scrollIntoView({block:'start'})});
 $$('[data-premise]').forEach(el=>el.oninput=()=>{state.notes[premiseKey(representation,el.dataset.premise)]=el.value;save()});if($('#premiseApply'))$('#premiseApply').onclick=()=>{worldSheet='';redraw();$('.world-scene').scrollIntoView({block:'start',behavior:'smooth'})};
 $$('[data-telos]').forEach(el=>el.oninput=()=>{state.notes[telosKey(representation,el.dataset.telos)]=el.value;save()});if($('#telosApply'))$('#telosApply').onclick=()=>{worldSheet='';redraw();$('.world-scene').scrollIntoView({block:'start',behavior:'smooth'})};
 const choose=id=>{worldSheet="investigate";lensFocus=id;const e=byId(id);if(e?.year&&!worldAll&&Math.abs(e.year-worldYear)>worldWindow)worldYear=e.year;redraw();$('.world-workbench').scrollIntoView({block:'start',behavior:'smooth'})};
 $$('[data-lens-focus]').forEach(b=>{b.onpointerenter=b.onfocus=()=>{const out=b.closest('.schematic-scene')?.querySelector('.diagram-hover-description');if(out)out.textContent=b.getAttribute('aria-label')};b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();b.onclick()}};b.onclick=()=>{const other=b.closest('[data-reading-scene]')?.dataset.readingScene;if(other)switchReading(other);choose(b.dataset.lensFocus)}});
 $$('[data-world-mode]').forEach(b=>b.onclick=()=>switchRepresentation(b.dataset.worldMode));
 $('#perspectiveExplanation').ontoggle=e=>{introductionOpen[representation]=e.target.open};$('#lensFocus').onchange=e=>choose(e.target.value);$('#lensSwitch').onchange=e=>switchRepresentation(e.target.value);
 $('#worldTime').onchange=e=>{worldAll=e.target.value==='all';redraw()};$('#worldWindow').onchange=e=>{worldWindow=Number(e.target.value);redraw()};
 const setYear=()=>{const e=$('#worldYear'),n=Number(e.value);if(!Number.isInteger(n)||n===0||n< -100000||n>10000){e.setCustomValidity('Bitte ein ganzzahliges Jahr ohne Jahr null eingeben (−100000 bis 10000).');e.reportValidity();return}e.setCustomValidity('');worldYear=n;redraw()};$('#worldGo').onclick=setYear;$('#worldYear').onkeydown=e=>{if(e.key==='Enter')setYear()};
 $('#worldNow').onclick=()=>{worldYear=new Date().getFullYear();worldWindow=130;worldAll=false;lensFocus=byId('paris')?'paris':lensFocus;redraw()};
 $('#worldAssumption').onchange=e=>{worldAssumption=e.target.checked;redraw()};if($('#worldPeriod'))$('#worldPeriod').onchange=e=>{worldPeriod=Number(e.target.value);redraw()};
 $('#lensPlacement').onchange=e=>{state.lensAssignments??={};state.lensAssignments[representation]??={};if(e.target.value)state.lensAssignments[representation][lensFocus]=e.target.value;else delete state.lensAssignments[representation][lensFocus];save();redraw()};
 $('#lensTheory').onclick=()=>{const focus=lensFocus;if(representation==='memoria')openMemoria();else openEvent(GLOBAL_LENSES[representation].concept);lensFocus=focus};
 $('#lensSource').onclick=()=>openEvent(lensFocus);$('#lensExamples').onclick=()=>{if(representation==='memoria'){openMemoria();return}lensExample=true;renderMode()};$('#lensCompare').onclick=()=>openCompare(lensFocus,$('#lensPartner').value);
}

function lensMapHtml(items){const mode=representation,model=GLOBAL_LENSES[mode],n=Math.max(1,items.length-1),focus=byId(lensFocus);let background='',caption='',points=[];const polar=(i,total,cx,cy,r)=>{const a=(i/Math.max(1,total))*Math.PI*2-Math.PI/2;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]};
 if(mode==='recurrence'||mode==='egypt'){const spiral=mode==='recurrence';let path='';for(let j=0;j<=240;j++){const a=j/240*Math.PI*(spiral?4:2)-Math.PI/2,r=spiral?95+j/240*155:230;path+=(j?'L':'M')+(500+Math.cos(a)*r).toFixed(1)+' '+(300+Math.sin(a)*r).toFixed(1)}background=`<path d="${path}" fill="none" stroke="#bca274" stroke-width="2"/><text x="500" y="300" text-anchor="middle">${spiral?'Ähnlichkeit ≠ Identität':'Erneuerung ≠ Stillstand'}</text>`;points=items.map((e,i)=>{const a=i/n*Math.PI*(spiral?4:2)-Math.PI/2,r=spiral?95+i/n*155:230;return [500+Math.cos(a)*r,300+Math.sin(a)*r]});if(!spiral)points=items.map((e,i)=>polar(i,items.length,500,300,230));caption='Alle sichtbaren Spuren in einer '+(spiral?'Spirale':'Kreisfigur')+'. Die Reihenfolge dient der Navigation; eine historische Wiederkehr wird damit zur Prüfung gestellt, nicht nachgewiesen.';
 }else if(mode==='present'){const older=items.filter(e=>e.id!==lensFocus&&e.year&&focus?.year&&e.year<focus.year),later=items.filter(e=>e.id!==lensFocus&&e.year&&focus?.year&&e.year>=focus.year),unknown=items.filter(e=>e.id!==lensFocus&&!older.includes(e)&&!later.includes(e));points=items.map(e=>e.id===lensFocus?[500,285]:older.includes(e)?polar(older.indexOf(e),older.length,240,285,180):later.includes(e)?polar(later.indexOf(e),later.length,760,285,180):[80+(unknown.indexOf(e)+.5)/Math.max(1,unknown.length)*840,555]);background='<circle cx="240" cy="285" r="180"/><circle cx="760" cy="285" r="180"/><text x="240" y="285" text-anchor="middle">Früher datierte Spuren</text><text x="760" y="285" text-anchor="middle">Später / gleich datiert</text><text x="500" y="325" text-anchor="middle">Ausgangsgegenwart</text><text x="500" y="595" text-anchor="middle">Ohne vergleichbare Datierung</text>';caption='Die gewählte Spur bildet die Mitte. Die Datumsordnung zeigt rückblickend frühere und spätere Spuren. Was damals erinnert oder erwartet wurde, muss anhand von Quellen untersucht werden.';
 }else if(mode==='layers'){const rows=[...model.slots.map(s=>s[0]),''];background=rows.map((k,j)=>`<path d="M180 ${100+j*135}H940"/><text x="25" y="${104+j*135}">${model.slots[j]?.[1]||'Noch unbestimmt'}</text>`).join('');points=items.map(e=>{const k=lensAssignment(mode,e.id),same=items.filter(x=>lensAssignment(mode,x.id)===k);return [205+(same.indexOf(e)+.5)/Math.max(1,same.length)*700,100+rows.indexOf(k)*135]});caption='Alle Spuren stehen zunächst im offenen Band. Deine begründeten Zuordnungen verschieben sie zwischen den Zeitschichten. Innerhalb eines Bandes dient die Datumsreihenfolge der Orientierung; Abstände sind keine gemessenen Dauern.';
 }else if(mode==='memoria'){
 const centers=[[275,240],[275,390],[725,240],[725,390]],open=items.filter(e=>!lensAssignment(mode,e.id));
 background='<ellipse cx="350" cy="315" rx="225" ry="200"/><ellipse cx="650" cy="315" rx="225" ry="200"/><path d="M390 315H610M400 307L390 315L400 323M600 307L610 315L600 323"/><text x="290" y="170" text-anchor="middle">Soziale Beziehungen</text><text x="710" y="170" text-anchor="middle">Kulturelle Vermittlung</text><text x="500" y="280" text-anchor="middle">Erinnern</text><text x="500" y="355" text-anchor="middle">in der Gegenwart</text><text x="500" y="40" text-anchor="middle">Noch offene Spuren</text><text x="270" y="470" text-anchor="middle">Gespräch · Generationen</text><text x="730" y="470" text-anchor="middle">Medien · Auswahl</text>';
 points=items.map(e=>{const k=lensAssignment(mode,e.id),j=model.slots.findIndex(s=>s[0]===k);if(j<0){const i=open.indexOf(e),half=Math.ceil(open.length/2);return [60+(i%half+.5)/Math.max(1,half)*880,i<half?75:565]}const same=items.filter(x=>lensAssignment(mode,x.id)===k);return polar(same.indexOf(e),same.length,...centers[j],65)});
 caption='Überlappende Erinnerungsräume statt Zeitachse: Personen erinnern in sozialen Beziehungen, während Medien und Praktiken Vergangenes vermitteln. Offene Spuren liegen zunächst am Rand. Deine begründete Zuordnung markiert einen Schwerpunkt, keine messbare Entfernung und keinen automatischen Wandel vom Gespräch zum Denkmal.';
 }else if(mode==='materialism'){const centers=[[250,170],[750,170],[250,430],[750,430]];background='<path d="M250 170H750V430H250ZM250 170L750 430M750 170L250 430"/>'+model.slots.map((s,j)=>`<text x="${centers[j][0]}" y="${centers[j][1]}" text-anchor="middle">${s[1]}</text>`).join('');points=items.map(e=>{const k=lensAssignment(mode,e.id),index=model.slots.findIndex(s=>s[0]===k),same=items.filter(x=>lensAssignment(mode,x.id)===k);return index<0?polar(same.indexOf(e),same.length,500,300,275):polar(same.indexOf(e),same.length,...centers[index],85)});caption='Offene Spuren umgeben das Wirkungsgefüge. Mit deiner Zuordnung rücken sie zu einem Untersuchungsfeld. Die Verbindungslinien bezeichnen Fragen nach Wechselwirkungen, keine belegten Kausalbeziehungen.';
 }else if(mode==='medieval'){points=items.map((e,i)=>[65+i/n*870,490-Math.sin(i/n*Math.PI)*390]);background='<path d="M65 490Q500 -290 935 490" stroke-dasharray="8 6"/><text x="80" y="545">Ursprung</text><text x="920" y="545" text-anchor="end">Erwartete Vollendung</text><text x="500" y="370" text-anchor="middle">Vergangenheit in einem Heilszusammenhang?</text>';caption='Der Bogen stellt den gesamten Bestand versuchsweise unter einen heilsgeschichtlichen Horizont. Er ist keine historische Weltchronik. Die Ordnung der datierten Spuren wird beibehalten; ihre christliche Deutung ist weder vorausgesetzt noch durch das Datum belegt.';
 }else{points=items.map((e,i)=>[60+i/n*880,300+(lensAssignment(mode,e.id)==='exclusion'?130:lensAssignment(mode,e.id)==='alternative'?-130:0)]);background='<path d="M50 300H950M930 290L950 300L930 310M300 300L420 170M550 300L670 430"/><text x="500" y="90" text-anchor="middle">Richtung, Gegenbefunde und offene Möglichkeiten</text>';caption='Der ganze Bestand bleibt in Datumsreihenfolge sichtbar. Eigene Zuordnungen zeigen Gegenbefunde und Alternativen abseits der Hauptlinie. Die Leserichtung beweist keinen Fortschritt und keine notwendige Folge.';}
 return `<figure class="lens-map"><div class="lens-map-scroll"><svg viewBox="0 0 1000 630" role="group" aria-label="Gesamter sichtbarer Bestand im Geschichtsbild ${esc(model.title)}"><g class="lens-map-lines">${background}</g>${items.map((e,i)=>`<g role="button" tabindex="0" data-lens-focus="${esc(e.id)}" aria-label="${esc(e.title)}${e.id===lensFocus?' – ausgewählt':''}" class="lens-map-node ${e.id===lensFocus?'selected':''}" transform="translate(${points[i][0].toFixed(1)} ${points[i][1].toFixed(1)})"><title>${esc(e.title)} · ${esc(e.date||(e.year?yr(e.year):'Begriff'))}</title><circle r="${e.id===lensFocus?17:mode==='layers'?Math.max(5,Math.min(15,300/Math.max(1,items.length))):mode==='direction'?9:mode==='recurrence'?10:14}"/><text text-anchor="middle" y="3" style="font-size:${mode==='layers'||mode==='direction'?8:11}px">${i+1}</text></g>`).join('')}</svg></div><figcaption>${caption} <strong>Jeder nummerierte Punkt öffnet die entsprechende Spur zur Untersuchung.</strong></figcaption></figure>`}

function openExampleRepresentation(value){switchRepresentation(value);lensExample=true;renderMode()}

function spurDate(e){return e.date||(Number.isFinite(e.year)?yr(e.year):'Ohne Datierung')}
function corpusEntryHtml(e,attribute='data-explore'){return `<button class="corpus-entry" ${attribute}="${esc(e.id)}">${e.image?`<img src="${esc(imageSrc(e.image))}" alt="" loading="lazy">`:'<span aria-hidden="true">◇</span>'}<span><small>${esc(spurDate(e))}${e.own?' · EIGENER EINTRAG':''}</small><strong>${esc(e.title)}</strong>${mediaBadge(e)}</span></button>`}
function timelineUndatedHtml(items){return `<details class="concept-index"><summary>Begriffe nachschlagen <span>${items.length}</span></summary><p class="small">Die Grundfragen findest du oben in der Bildstrecke, die Geschichtsbilder in der Perspektivwahl. Hier bleiben die Begriffsfenster zusätzlich durchsuchbar – ohne künstliche Jahreszahl.</p><div class="concept-index-links">${items.map(e=>`<button data-event="${esc(e.id)}">${esc(e.title)} ↗</button>`).join('')||'<p>Keine Begriffe in dieser Auswahl.</p>'}</div></details>`}

function networkCorpusHtml(items){const visibleIds=new Set(items.map(e=>e.id));return `<section class="network-corpus"><div class="mode-heading"><p class="eyebrow">DER VOLLSTÄNDIGE BESTAND IM DENKRAUM</p><h2>Jede Spur kann eine Verbindung eröffnen.</h2><p class="network-count" aria-live="polite">${items.length} von ${lensCorpus().length} Spuren sichtbar · Ereignisse, Theorien, Begriffe und eigene Einträge</p><p>Die Frageauswahl oben verändert nur die kuratierten Zugänge. Suche und «Meine Einträge» filtern den gesamten Bestand.</p></div><div class="corpus-grid">${items.map(e=>`<article>${corpusEntryHtml(e)}<div class="corpus-connections"><small>Verbindungen</small>${[...new Set([...(e.related||[]),...state.relations.filter(r=>r.a===e.id||r.b===e.id).map(r=>r.a===e.id?r.b:r.a)])].filter(id=>visibleIds.has(id)&&id!==e.id).map(id=>eventLink(id)).join('')||'<p>Noch keine Verbindung in dieser Auswahl. Im Quellenfenster kannst du eine begründen.</p>'}</div></article>`).join('')||'<p>Keine Spur gefunden. Passe die Suche an oder wähle «Weltspuren».</p>'}</div></section>`}

const LENS_ORIENTATIONS={
 present:['Augustinus · Erinnern, Wahrnehmen, Erwarten','Die beiden Kreise gehen von einer gewählten Gegenwart aus. Frühere Daten sind mögliche Erinnerungsbezüge, spätere Daten rückblickend bekannte Zukunft – was Menschen damals tatsächlich wussten, muss erst erschlossen werden.','M20 40a25 25 0 1 0 50 0a25 25 0 1 0-50 0M65 40a25 25 0 1 0 50 0a25 25 0 1 0-50 0'],
 layers:['Braudel · Ereignis, Entwicklung, lange Dauer','Die waagerechten Schichten trennen Zeitdauern. Eine Revolution kann ein Ereignis sein, eine Veränderung der Arbeitswelt Jahrzehnte dauern. Ordne einen Aspekt deiner Spur zu; nicht das gesamte Geschehen für immer.','M10 20H125M10 45H125M10 70H125'],
 direction:['Hegel, Koselleck, Harari · verschiedene Fragen an den Verlauf','Die Linie kann eine Fortschrittserzählung tragen, die Abzweigungen öffnen Alternativen und Gegenbefunde. Hegels Freiheitsgeschichte ist nicht dasselbe wie Kosellecks offene Erwartungshorizonte oder Hararis Hinweis auf Kontingenz.','M10 65H125M60 65L90 20M115 55L125 65L115 75'],
 medieval:['Ausgewählte lateinisch-christliche Geschichtsbilder','Der Bogen steht für einen Zusammenhang von Ursprung und erwarteter Vollendung. Heilsgeschichte ist gerichtet; das Kirchenjahr wiederholt Gedenken. Beide können nebeneinander bestehen. Das ist kein einheitliches Denken aller Menschen im Mittelalter.','M10 70Q65-35 125 70M45 60a18 18 0 1 0 36 0a18 18 0 1 0-36 0'],
 egypt:['Altägypten · Erneuerung, Ordnung, Auswahl','Der Kreis fragt nach Wiederherstellung und Erneuerung; Regierungsjahre zählen Veränderungen, Königslisten wählen Erinnerung aus. Diese Sichtweisen ergänzen sich. Ein Kreis bedeutet weder Stillstand noch ein zeitloses Ägypten.','M38 18a30 30 0 1 1-10 45M28 63L25 47M28 63L45 64M70 12V75'],
 materialism:['Marx und Engels · materielle Bedingungen und Konflikte','Das Gefüge verbindet Arbeit und Technik, Eigentumsverhältnisse, Recht und gesellschaftliche Auseinandersetzungen. Die Pfeile fragen nach Wirkungen und Rückwirkungen. Sie beweisen keinen Automatismus und keine weltweit gleiche Stufenfolge.','M20 20H110V70H20ZM20 20L110 70M110 20L20 70'],
 recurrence:['Nietzsche · Wiederkunft, Rhythmus, Analogie','Die Spirale hält Ähnlichkeit und Veränderung zusammen. Nietzsches Gedanke der ewigen Wiederkunft ist kein empirischer Beweis, dass Kriege oder Revolutionen identisch wiederkehren. Benenne, was du tatsächlich vergleichst.','M65 43c-8-13-27-5-20 10s36 12 38-8S55 7 35 26s-15 47 12 51 53-20 48-45'],
 memoria:['Halbwachs und Assmann · Erinnerungsräume','Die überlappenden Kreise zeigen, dass soziale Beziehungen und kulturelle Vermittlung zusammenwirken. Gedächtnis ist kein Behälter fertiger Vergangenheit: Gegenwärtige Fragen, Gruppen und Praktiken prägen das Erinnerte.','M10 45a35 35 0 1 0 70 0a35 35 0 1 0-70 0M55 45a35 35 0 1 0 70 0a35 35 0 1 0-70 0']
};
function lensExplanationHtml(){const o=LENS_ORIENTATIONS[representation];if(!o)return '';return `<div class="model-orientation"><svg viewBox="0 0 140 90" aria-hidden="true"><path d="${o[2]}"/></svg><div><strong>${o[0]}</strong><p>${o[1]}</p>${representation==='memoria'?`<div class="memory-theorists"><button data-explore="halbwachs">Halbwachs: soziale Rahmen ↗</button><button data-explore="assmann">Assmann: kommunikativ & kulturell ↗</button></div>`:''}</div></div>`}
// A profile holds a learner's explicit interpretation, never an inferred group opinion.
const READING_ROLES={
 medieval:['Annäherung an das Telos','Widerspruch zum Telos','Mehrdeutig','Für dieses Telos ohne Bedeutung'],
 direction:['Fortschritt nach meinem Massstab','Rückschritt / Gegenbefund','Ungleiche oder widersprüchliche Wirkung','Nach diesem Massstab nebensächlich'],
 memoria:['Im Zentrum der Erinnerung','Gegen-Erinnerung','Umstrittene Erinnerung','In dieser Auswahl ausgeblendet'],
 egypt:['Bewahrt / erneuert die benannte Ordnung','Stellt diese Ordnung infrage','Ordnung für wen? Mehrdeutig','Für diese Ordnungsfrage randständig'],
 materialism:['Stützt die vorgeschlagene Wirkungskette','Spricht gegen die Wirkungskette','Mehrere Erklärungen greifen ineinander','Für diese Erklärung nicht relevant'],
 recurrence:['Stützt den begründeten Vergleich','Entscheidender Unterschied','Ähnlichkeit und Unterschied zugleich','Für diesen Vergleich ohne Bedeutung'],
 layers:['Stützt den behaupteten Zusammenhang','Bruch / Gegenbefund','Mehrere Zeitdauern überlagern sich','Für diesen Zusammenhang randständig'],
 present:['Im belegten Wissenshorizont','Widerspricht der formulierten Erwartung','Damals ungewiss / umstritten','Aus dieser Position nicht zugänglich']
};
const ROLE_KEYS=['support','counter','ambivalent','outside'];
function profileNote(mode,key){return key.startsWith('telos-'+mode+'-')||key.startsWith('premise-'+mode+'-')||key.startsWith('lens-'+mode+'-')}
function profileNotes(mode,source=state){return Object.fromEntries(Object.entries(source.notes||{}).filter(([k])=>profileNote(mode,k)))}
function profileBucket(mode){state.interpretations??={};return state.interpretations[mode]}
function activeReading(mode=representation){const b=profileBucket(mode);return b?.profiles.find(p=>p.id===b.active)}
function captureReadings(){for(const [mode,b] of Object.entries(state.interpretations||{})){const p=b.profiles.find(p=>p.id===b.active);if(p){p.notes=profileNotes(mode);p.assignments={...state.lensAssignments[mode]}}}}
function ensureReading(mode){let b=profileBucket(mode);if(!b){const p={id:uid(),name:'Erster Entwurf',notes:profileNotes(mode),assignments:{...state.lensAssignments[mode]},decisions:{}};b=state.interpretations[mode]={active:p.id,profiles:[p]}}return b}
function loadReading(mode,id){const b=profileBucket(mode),p=b?.profiles.find(p=>p.id===id);if(!p)return;for(const k of Object.keys(state.notes))if(profileNote(mode,k))delete state.notes[k];Object.assign(state.notes,p.notes);state.lensAssignments[mode]={...p.assignments};b.active=id}
function switchReading(id){captureReadings();loadReading(representation,id);if(representation==='medieval')lastRestoredHeil='';else delete restoredRandomConcept[representation];save()}
function addReading(name,copy=false){captureReadings();const b=ensureReading(representation);if(b.profiles.length>=30)throw Error('Maximal 30 Entwürfe pro Geschichtsbild.');const old=activeReading(),p={id:uid(),name:name.trim().slice(0,100)||'Weiterer Entwurf',notes:copy?{...old.notes}:{},assignments:copy?{...old.assignments}:{},decisions:copy?JSON.parse(JSON.stringify(old.decisions)):{} };b.profiles.push(p);loadReading(representation,p.id);save();return p}
function readingBasis(mode=representation){return JSON.stringify(Object.entries(profileNotes(mode)).filter(([k])=>!k.startsWith('lens-')).sort(([a],[b])=>a.localeCompare(b)))}
function readingDecision(id,mode=representation){const d=activeReading(mode)?.decisions[id];return d?{...d,stale:d.basis!==readingBasis(mode)}:null}
function setReadingDecision(id,role,weight,reason){if(!byId(id))throw Error('Unbekannte Spur.');const p=activeReading()||ensureReading(representation).profiles[0];if(!role){delete p.decisions[id];save();return}if(!ROLE_KEYS.includes(role)||![1,2,3].includes(weight)||!reason.trim())throw Error('Bitte eine Lesart wählen und mit einem Beleg oder einer ausdrücklich offenen Belegfrage begründen.');const anchor=['medieval','direction'].includes(representation)?telosGoal(representation):premiseValue(representation,PREMISE_LABS[representation].anchor);if(!anchor)throw Error('Benenne zuerst die offene Voraussetzung oben. Du kannst auch begründen, warum sie offenbleibt.');p.decisions[id]={role,weight,reason:reason.slice(0,6000),basis:readingBasis()};save()}
function profilePanelHtml(){const b=profileBucket(representation),p=activeReading();return `<section class="reading-profiles"><h3>Deutungsentwürfe vergleichen</h3><p>Ein anderes Ziel oder eine andere Gruppe erhält einen eigenen Entwurf. Die Zuordnungen stammen von euch; aus einem Gruppennamen wird keine Meinung abgeleitet.</p><div class="reading-controls"><label>Aktiver Entwurf<select id="readingSelect">${(b?.profiles||[]).map(x=>`<option value="${x.id}" ${x.id===p?.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label><label>Name für einen weiteren Entwurf<input id="readingName" maxlength="100" placeholder="z. B. Ziel B / Gruppe B"></label><button id="readingNew">Leeren Entwurf anlegen</button><button id="readingCopy">Aktuellen Entwurf kopieren</button><button id="readingRename">Aktuellen Entwurf umbenennen</button></div><p class="small">Änderst du eine Voraussetzung, bleiben frühere Einordnungen erhalten, werden aber als «erneut prüfen» markiert und bis zur Bestätigung nicht als gültige Deutung dargestellt.</p>${b?.profiles.length>1?`<label>Vergleichen mit<select id="readingCompare"><option value="">Vergleich ausblenden</option>${b.profiles.filter(x=>x.id!==p.id).map(x=>`<option value="${x.id}" ${x.id===readingComparison?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>`:''}<p id="readingError" role="status"></p></section>`}
let readingComparison='';
function decisionEditorHtml(focus){const d=readingDecision(focus.id);return `<section class="reading-decision"><h4>Diese Spur im aktiven Entwurf einordnen</h4><p>${esc(activeReading()?.name||'Erster Entwurf')} · Die Einordnung verändert das Deutungsfeld der Karte; Begründung und Gewicht stehen direkt dabei.</p>${d?.stale?'<p class="notice">Die Voraussetzungen wurden verändert. Prüfe deine frühere Begründung und bestätige sie erneut oder ändere die Lesart.</p>':''}<label>Lesart<select id="decisionRole"><option value="">Offen / Zuordnung zurücknehmen</option>${ROLE_KEYS.map((k,i)=>`<option value="${k}" ${d?.role===k?'selected':''}>${READING_ROLES[representation][i]}</option>`).join('')}</select></label><label>Gewicht in dieser Erzählung<select id="decisionWeight">${[1,2,3].map((n,i)=>`<option value="${n}" ${d?.weight===n?'selected':''}>${['Nebenbezug','Wichtig','Tragender Bezug'][i]}</option>`).join('')}</select></label><label>Begründung, Beleg und Grenze<textarea id="decisionReason" maxlength="6000" rows="4" placeholder="Warum ergibt sich diese Lesart aus meinem Ziel oder Rahmen? Worauf stütze ich sie? Wo bleibt sie unsicher?">${esc(d?.reason||'')}</textarea></label><button id="decisionApply">Begründete Einordnung anwenden</button><p id="decisionError" role="status"></p></section>`}
function readingLegend(){return `<div class="reading-legend">${ROLE_KEYS.map((r,i)=>`<span class="reading-${r}">${READING_ROLES[representation][i]}</span>`).join('')}<span>Ohne Einordnung / erneut prüfen</span></div>`}
function readingLayout(e,x,y,w){const d=readingDecision(e.id);if(!d||d.stale||!worldAssumption)return {x,y,w,dim:false,cls:d?.stale?'reading-stale':'',title:d?.stale?'Voraussetzung verändert – erneut prüfen':''};const index=ROLE_KEYS.indexOf(d.role),mode=representation;let nx=x,ny=y;
 if(mode==='medieval'||mode==='direction'){ny=[190,510,350,620][index]+(Math.abs(e.year)%3)*20;}
 else if(mode==='memoria'||mode==='egypt'||mode==='recurrence'){const angle=Math.atan2(y-320,x-500),radius=[105,275,195,325][index];nx=500+Math.cos(angle)*radius*1.18;ny=320+Math.sin(angle)*radius*.83;}
 else if(mode==='layers'){ny+= [-22,25,0,42][index];}
 else if(mode==='present'){nx=d.role==='outside'?850:d.role==='support'?220:d.role==='counter'?700:500;ny=110+(Math.abs(e.year)%5)*92;}
 else {ny+=[-10,14,0,25][index];}
 return {x:nx,y:ny,w:w*(.85+d.weight*.12),dim:d.role==='outside',cls:'reading-'+d.role,title:READING_ROLES[mode][index]+' · '+['','Nebenbezug','Wichtig','Tragender Bezug'][d.weight]};}
function readingComparisonHtml(items){const b=profileBucket(representation),a=activeReading(),other=b?.profiles.find(p=>p.id===readingComparison);if(!a||!other||a===other)return '';captureReadings();const scene=profile=>{loadReading(representation,profile.id);try{return worldSceneHtml(items)}finally{loadReading(representation,a.id)}};const effective=(p,id)=>{const d=p.decisions[id];const basis=JSON.stringify(Object.entries(p.notes).filter(([k])=>!k.startsWith('lens-')).sort(([a],[b])=>a.localeCompare(b)));return d?(d.basis!==basis?'Erneut prüfen':READING_ROLES[representation][ROLE_KEYS.indexOf(d.role)])+' · Gewicht '+d.weight:'Offen'};
 const changed=items.filter(e=>JSON.stringify(a.decisions[e.id])!==JSON.stringify(other.decisions[e.id]));return `<section class="reading-comparison"><h3>Gleiche Quellen, unterschiedliche Entscheidungen</h3><div class="reading-compare-scenes"><article data-reading-scene="${a.id}"><h4>${esc(a.name)}</h4>${scene(a)}</article><article data-reading-scene="${other.id}"><h4>${esc(other.name)}</h4>${scene(other)}</article></div><div class="reading-table"><table><thead><tr><th>Spur</th><th>${esc(a.name)}</th><th>${esc(other.name)}</th></tr></thead><tbody>${changed.map(e=>`<tr><th>${esc(e.title)}</th>${[a,other].map(p=>`<td><strong>${esc(effective(p,e.id))}</strong><p>${esc(p.decisions[e.id]?.reason||'Noch keine begründete Einordnung.')}</p></td>`).join('')}</tr>`).join('')||'<tr><td colspan="3">Noch keine unterschiedlichen Einordnungen. Verschiedene Namen allein erzeugen keine Unterschiede.</td></tr>'}</tbody></table></div></section>`}
function wireReadings(redraw){$('#readingSelect').onchange=e=>{switchReading(e.target.value);readingComparison='';redraw()};for(const [id,copy] of [['readingNew',false],['readingCopy',true]])$('#'+id).onclick=()=>{try{addReading($('#readingName').value,copy);readingComparison='';redraw()}catch(e){$('#readingError').textContent=e.message}};$('#readingRename').onclick=()=>{const n=$('#readingName').value.trim();if(!n){$('#readingError').textContent='Bitte zuerst einen Namen eingeben.';return}activeReading().name=n.slice(0,100);save();redraw()};if($('#readingCompare'))$('#readingCompare').onchange=e=>{readingComparison=e.target.value;worldSheet=readingComparison?'compare':'settings';redraw()};$('#decisionApply').onclick=()=>{try{setReadingDecision(lensFocus,$('#decisionRole').value,Number($('#decisionWeight').value),$('#decisionReason').value);worldSheet='';redraw();$('.world-scene').scrollIntoView({block:'start'})}catch(e){$('#decisionError').textContent=e.message}};}
function validateReadings(x,out,seen){const record=v=>v&&typeof v==='object'&&!Array.isArray(v);if(!record(x.interpretations))return;for(const [mode,b] of Object.entries(x.interpretations)){if(!Object.hasOwn(GLOBAL_LENSES,mode)||!Array.isArray(b?.profiles))continue;const ids=new Set(),profiles=[];for(const p of b.profiles.slice(0,30)){if(!p||typeof p.id!=='string'||!/^[A-Za-z0-9_-]{1,100}$/.test(p.id)||['__proto__','constructor','prototype'].includes(p.id)||ids.has(p.id))continue;ids.add(p.id);const q={id:p.id,name:typeof p.name==='string'?p.name.slice(0,100):'Entwurf',notes:{},assignments:{},decisions:{}};for(const [k,v] of Object.entries(record(p.notes)?p.notes:{})){const lk=parseLensNote(k);if(profileNote(mode,k)&&(!lk||seen.has(lk.id))&&typeof v==='string')q.notes[k]=v.slice(0,30000)}for(const [id,v] of Object.entries(record(p.assignments)?p.assignments:{}))if(seen.has(id)&&GLOBAL_LENSES[mode].slots.some(s=>s[0]===v))q.assignments[id]=v;for(const [id,d] of Object.entries(record(p.decisions)?p.decisions:{}))if(seen.has(id)&&d&&ROLE_KEYS.includes(d.role)&&[1,2,3].includes(d.weight)&&typeof d.reason==='string'&&typeof d.basis==='string')q.decisions[id]={role:d.role,weight:d.weight,reason:d.reason.slice(0,6000),basis:d.basis.slice(0,200000)};profiles.push(q)}if(profiles.length)out.interpretations[mode]={active:profiles.some(p=>p.id===b.active)?b.active:profiles[0].id,profiles}}}
function mergeReadings(incoming,map,fresh,previous){for(const [mode,ib] of Object.entries(incoming.interpretations||{})){let b=state.interpretations[mode];if(!b){const p={id:uid(),name:'Bisheriger Entwurf',notes:profileNotes(mode,previous),assignments:{...previous.lensAssignments[mode]},decisions:{}};b=state.interpretations[mode]={active:p.id,profiles:fresh?[]:[p]}}let importedActive='';for(const source of ib.profiles){const p=JSON.parse(JSON.stringify(source));p.notes=Object.fromEntries(Object.entries(p.notes).map(([k,v])=>{const l=parseLensNote(k);return [l?lensNoteKey(mode,map(l.id)):k,v]}));for(const field of ['assignments','decisions'])p[field]=Object.fromEntries(Object.entries(p[field]).map(([id,v])=>[map(id),v]));const existing=b.profiles.find(x=>x.id===p.id);if(existing&&JSON.stringify(existing)===JSON.stringify(p)){if(source.id===ib.active)importedActive=existing.id;continue}if(existing){p.id=uid();p.name+=' (importiert)'}if(b.profiles.length>=30)throw Error('Zu viele Deutungsentwürfe beim Import. Bitte Arbeitsstände getrennt verwenden.');b.profiles.push(p);if(source.id===ib.active)importedActive=p.id}loadReading(mode,fresh?importedActive:b.active)}}

// Shared question-led navigation and introductions; not a chronology of theories.
const PERSPECTIVE_GROUPS=[
  {
    "title": "Weltordnung und Sinn",
    "question": "In welcher Ordnung erhält Geschehen Bedeutung?",
    "keys": [
      "egypt",
      "medieval"
    ]
  },
  {
    "title": "Richtung und Wiederkehr",
    "question": "Worauf läuft Geschichte zu – oder kehrt etwas wieder?",
    "keys": [
      "direction",
      "recurrence"
    ]
  },
  {
    "title": "Gesellschaftlichen Wandel erklären",
    "question": "Welche Bedingungen und Zeiträume erklären Veränderungen?",
    "keys": [
      "materialism",
      "layers"
    ]
  },
  {
    "title": "Zeit erfahren und Vergangenheit erinnern",
    "question": "Von welchem Standpunkt aus wird Vergangenheit gegenwärtig?",
    "keys": [
      "present",
      "memoria"
    ]
  }
];
const PERSPECTIVE_INTROS={
  "egypt": {
    "label": "Altägypten · Ordnung und Erneuerung",
    "kind": "Historische religiöse und politische Ordnungsvorstellungen",
    "lead": "Muss eine Veränderung etwas Neues schaffen, um bedeutsam zu sein? In dieser Ansicht kann gerade das Erhalten und Wiederherstellen als entscheidende Leistung erscheinen. Damit verändert sich die Frage an jedes Ereignis: Welche Ordnung soll es sichern, wer erklärt diese Ordnung für richtig und wer trägt die Arbeit dafür?",
    "context": "Altägyptische Gesellschaften bestanden über Jahrtausende; ihre Vorstellungen waren weder einheitlich noch unveränderlich. In königlichen und religiösen Darstellungen ist Maʿat zentral: ein Zusammenhang von Wahrheit, Gerechtigkeit und geordneter Welt. Das Königtum beanspruchte, diese Ordnung gegen Unordnung zu erhalten. Solche Darstellungen zeigen einen Anspruch auf legitime Herrschaft, nicht unmittelbar den Alltag oder die Zustimmung aller Menschen. Wiederkehrende religiöse Erneuerung steht neben der Zählung von Regierungsjahren und der Erinnerung an besondere Taten.",
    "terms": [
      [
        "Maʿat",
        "Eine religiös und gesellschaftlich verbindliche Weltordnung; der Begriff meint mehr als Ruhe oder politische Stabilität."
      ],
      [
        "Erneuerung",
        "Die Ordnung muss durch Handlungen erhalten werden. Wiederkehr bedeutet deshalb nicht, dass nichts geschieht."
      ],
      [
        "Herrschaftsdarstellung",
        "Wenn ein Herrscher sich als Bewahrer darstellt, ist das selbst eine politische Aussage, die geprüft werden muss."
      ]
    ],
    "example": "Erprobe den Blick an der Linthkorrektion. Du könntest sie als Wiederherstellung sicherer Lebensbedingungen erzählen. Dieselbe Massnahme lässt sich aber als tiefgreifender Eingriff in Landschaft und Nutzung verstehen. Wessen bisherige Ordnung würde in der ersten Erzählung verschwinden? Suche nach Betroffenen und nach dem Aufwand, den die neue Ordnung dauerhaft verlangt. Diese Fragen sind unsere Übertragung; sie behaupten keinen ägyptischen Einfluss auf das Linthwerk.",
    "transfer": "Das Zentrum der Grafik erhält die Ordnung, die du ausdrücklich benennst. Erst danach ordnest du einzelne Spuren mit Belegen als stützend, störend oder widersprüchlich ein. Ändere beispielsweise «verlässliche Versorgung» zu «Erhalt bestehender Besitzverhältnisse»: Du musst die Einordnungen erneut begründen. Die Software kennt die Interessen der Beteiligten nicht.",
    "limit": "Der Kreis ist ein Unterrichtsmodell für eine Frage nach Erhaltung. Er bildet weder das gesamte altägyptische Denken ab noch belegt er einen zyklischen Verlauf aller Geschichte. Der Gewinn liegt im Blick auf Bewahrung und ihre Kosten; die Grenze zeigt sich, sobald eine bestimmte Ordnung als selbstverständlich gut vorausgesetzt wird.",
    "sources": [
      "metKings",
      "metEgyptEducation",
      "metMiddleKingdom"
    ]
  },
  "medieval": {
    "label": "Mittelalter · Heilsgeschichte",
    "kind": "Historische christliche Geschichtsdeutungen",
    "lead": "Stell dir vor, der Sinn der Weltgeschichte hängt nicht davon ab, ob Menschen immer reicher oder technisch leistungsfähiger werden. Ihr Zusammenhang liegt vielmehr in Schöpfung, Erlösung und einer endgültigen Vollendung. Eine Niederlage könnte dann bedeutsam sein, ohne als Fortschritt auszusehen. Genau diesen Perspektivwechsel kannst du hier an jeder Zeit, auch der Gegenwart, erproben.",
    "context": "Christliche Heilsgeschichte deutet die Zeit zwischen Schöpfung und Vollendung im Verhältnis zu Gott. Augustinus entwickelt in der Spätantike mit dem Gottesstaat einen wichtigen Bezugspunkt späterer christlicher Geschichtsdeutung. Irdischer politischer Erfolg ist dabei nicht einfach mit dem Heil gleichzusetzen. Im europäischen Mittelalter bestanden heilsgeschichtliche Deutungen neben Chroniken, Herrschergenealogien und der wiederkehrenden Zeit des Kirchenjahres. «Mittelalterlich» bezeichnet hier einen ausgewählten christlichen Deutungsrahmen, nicht das Denken aller Menschen dieser Zeit oder aller Weltregionen.",
    "terms": [
      [
        "Heilsgeschichte",
        "Ereignisse erhalten Bedeutung innerhalb einer religiösen Erzählung von Schöpfung, Erlösung und Vollendung."
      ],
      [
        "Telos",
        "Das Ziel, von dem her ein Verlauf seinen Sinn erhält. Ein vorausgesetztes göttliches Ziel ist etwas anderes als ein menschlicher Plan."
      ],
      [
        "Vorsehung",
        "Die Annahme göttlicher Führung. Sie lässt sich nicht aus einem Ereignisdatum oder einem Erfolg unmittelbar ablesen."
      ]
    ],
    "example": "Betrachte das Pariser Klimaabkommen. Als gegenwärtige Übung könntest du es unter einen Horizont der Verantwortung für die Schöpfung stellen. Damit erhält gemeinsames Handeln eine religiöse Bedeutung. Daraus folgt aber weder, dass das Abkommen Heil bewirkt, noch dass eine Katastrophe göttliche Strafe wäre. Markiere genau die Stelle, an der deine Deutung einen Glaubenssatz benötigt, den die historische Quelle selbst nicht beweisen kann.",
    "transfer": "Benenne zuerst den Heilshorizont und die Perspektive, aus der du sprichst. Du darfst das Ziel auch offenlassen. Die Grafik hält dann die Leerstelle sichtbar. Wenn du statt Erlösung ein heutiges Ziel wie Frieden einsetzt, untersuchst du eine veränderte teleologische Konstruktion; du rekonstruierst damit nicht unverändert ein mittelalterliches Weltbild.",
    "limit": "Dieser Blick erschliesst Sinn, Hoffnung und die Bedeutung scheinbarer Niederlagen. Er wird problematisch, wenn man anderen einen gemeinsamen Glauben unterstellt oder Opfer nachträglich zu notwendigen Mitteln eines höheren Plans erklärt. Prüfe deshalb stets: Was sagt die Quelle, was glaube ich, und was ordne ich erst im Rückblick zu?",
    "sources": [
      "augustineCity",
      "augustine"
    ]
  },
  "direction": {
    "label": "Fortschritt · Ziel und offene Zukunft",
    "kind": "Geschichtsphilosophie und Kritik teleologischer Erzählungen",
    "lead": "«Es wird besser» klingt vertraut. Doch besser worin, für wen und bis wann? Erst ein Massstab macht aus zeitlichem Nacheinander eine Fortschrittserzählung. Diese Ansicht lässt dich einen solchen Massstab setzen und anschliessend erfahren, welche Ereignisse dazu passen, welche widersprechen und welche sich überhaupt nicht sinnvoll einordnen lassen.",
    "context": "Georg Wilhelm Friedrich Hegel (1770–1831) versteht Weltgeschichte als Entwicklung des Bewusstseins und der Verwirklichung von Freiheit. Gemeint ist nicht bloss eine Folge technischer Verbesserungen: Freiheit erhält eine geschichtliche Gestalt in gesellschaftlichen und politischen Ordnungen. Die philosophische Deutung schreibt dem Gesamtverlauf einen vernünftigen Zusammenhang zu. Ihre weltgeschichtliche Hierarchie ist selbst zu hinterfragen: Wer erscheint als Träger der Entwicklung, wer wird an den Rand gestellt?",
    "terms": [
      [
        "Teleologie",
        "Ein Geschehen wird von einem Ziel oder einer Vollendung her verständlich gemacht. Ein erwünschtes Ziel allein beweist noch keinen notwendigen Verlauf."
      ],
      [
        "Fortschrittsmassstab",
        "Ein bestimmtes Kriterium, etwa politische Beteiligung. Verschiedene Kriterien können zu entgegengesetzten Urteilen über dasselbe Ereignis führen."
      ],
      [
        "Offene Zukunft",
        "Menschen handelten ohne unser Wissen über den späteren Ausgang. Kosellecks Unterscheidung von Erfahrungsraum und Erwartungshorizont lenkt auf diese Differenz; sie ist keine Variante von Hegels Zielgewissheit."
      ]
    ],
    "example": "Nimm die Einführung des eidgenössischen Frauenstimmrechts 1971. Unter «gleiche politische Beteiligung» erscheint sie als Fortschritt. Daraus folgt nicht, dass sie zwangsläufig eintreten musste oder sämtliche Ungleichheiten beendete. Wechsle das Ziel zu «wirtschaftliche Gleichheit»: Nun reicht derselbe Beleg für dieselbe Wertung nicht mehr aus. Rekonstruiere ausserdem die Erwartungen vor dem Entscheid, statt das bekannte Ergebnis schon in die Vergangenheit hineinzulesen.",
    "transfer": "Schreibe ein Ziel, einen Standpunkt und deine Annahme über Notwendigkeit auf. Ohne Ziel bleibt die Richtung begründungspflichtig. Mit Ziel kannst du Spuren zuordnen und gewichten, aber jede Zuordnung verlangt einen Beleg. Zwei Entwürfe machen sichtbar, wie dieselben Daten verschiedene Erzählungen ergeben. Hararis Hinweis auf die Veränderbarkeit gegenwärtiger Ordnungen bietet dazu einen weiteren Gesprächspartner, keine Bestätigung eines vorherbestimmten Endpunkts.",
    "limit": "Die Tafel ist ein Unterrichtsmodell, keine vollständige Darstellung von Hegels Philosophie. Spätere Ereignisse sind nicht automatisch besser. Gerade eine nicht zuweisbare Spur kann zeigen, dass dein Telos zu unbestimmt ist oder verschiedene Lebensbereiche unzulässig auf einen einzigen Wert reduziert.",
    "sources": [
      "hegel",
      "koselleck"
    ]
  },
  "recurrence": {
    "label": "Wiederkehr · Nietzsche und historischer Vergleich",
    "kind": "Philosophisches Gedankenexperiment und vergleichende Untersuchung",
    "lead": "Wenn zwei Krisen ähnlich aussehen, hat sich dann Geschichte wiederholt? Vielleicht erkennen wir ein wiederkehrendes Problem; vielleicht haben wir nur alle Unterschiede weggelassen. Diese Ansicht trennt deshalb drei Dinge: ein philosophisches Gedankenexperiment, die Verwendung von Vergangenheit für das Leben und einen überprüfbaren Vergleich von Ereignissen.",
    "context": "Friedrich Nietzsche (1844–1900) fragt 1874 nach Nutzen und Schaden der Historie für das Leben. Er unterscheidet monumentales Erinnern an grosse Vorbilder, antiquarisches Bewahren und kritisches Urteilen über eine belastende Vergangenheit. Jede Haltung kann helfen und zugleich schaden. In Die fröhliche Wissenschaft, § 341 (1882), stellt er die Vorstellung vor, das eigene Leben mit allem Leid und aller Freude unendlich oft wieder leben zu müssen. Diese ewige Wiederkunft fordert eine Haltung zum Leben heraus; der Text liefert keinen Nachweis, dass sich Revolutionen in festen Abständen wiederholen.",
    "terms": [
      [
        "Ewige Wiederkunft",
        "Hier zunächst die radikale Frage nach der Bejahung des eigenen Lebens, nicht eine statistische Regel für historische Ereignisse."
      ],
      [
        "Historische Analogie",
        "Ein begrenzter Vergleich unter einem genannten Gesichtspunkt. Ähnlichkeit in einem Merkmal bedeutet keine Identität."
      ],
      [
        "Rhythmus",
        "Ein behaupteter zeitlicher Abstand. Seine Regelmässigkeit müsste an Daten geprüft werden; eine gewählte Kreisform erzeugt diesen Beleg nicht."
      ]
    ],
    "example": "Vergleiche die Französische und die Haitianische Revolution. «Kampf um Freiheit» eröffnet eine Beziehung. Wer Freiheit beansprucht, welche Rolle Versklavung spielt und gegen welche Herrschaft sich der Kampf richtet, verlangt aber getrennte Untersuchungen. Wenn du nur «Revolution» als Etikett verwendest, scheint die Wiederholung grösser, als deine Belege erlauben. Formuliere einen Unterschied, der deine erste Analogie wirklich verändert.",
    "transfer": "Lege Vergleichskriterium und Fälle fest. Verändere dann den Umlauf der Spirale: Die Nachbarschaften verschieben sich, obwohl kein historisches Datum geändert wurde. Genau das macht die Setzung sichtbar. Hör ergänzend den verlinkten Podcast «Wiederholt sich die Geschichte?» und prüfe eine seiner Aussagen an deinem Fallpaar; der Podcast ist ein Diskussionsbeitrag, kein Beweis für die Grafik.",
    "limit": "Die Spirale hilft, Ähnlichkeit und Abstand gleichzeitig zu sehen. Ihre Grenze ist erreicht, wenn optische Nähe zur Ursache oder Vorhersage erklärt wird. Eine begründete Antwort kann deshalb lauten: Ein Problem kehrt unter veränderten Bedingungen wieder; der Verlauf und sein Ausgang bleiben verschieden.",
    "sources": [
      "nietzsche",
      "nietzsche341"
    ]
  },
  "materialism": {
    "label": "Materialismus · Arbeit, Eigentum und Konflikt",
    "kind": "Gesellschafts- und Geschichtstheorie",
    "lead": "Wer arbeitet, wer verfügt über Arbeitsmittel und wer erhält die Ergebnisse? Mit diesen Fragen verändert sich der Blick auf politische Beschlüsse, technische Erfindungen und kulturelle Bilder. Eine neue Maschine ist dann nicht schon die Erklärung des Wandels: Entscheidend ist auch, in welchen sozialen Beziehungen sie eingesetzt wird.",
    "context": "Karl Marx (1818–1883) und Friedrich Engels (1820–1895) entwickeln ihre Geschichtsauffassung im Zusammenhang mit der kapitalistischen Industriegesellschaft und ihren Konflikten. Marx skizziert 1859, wie die materielle Produktion des Lebens gesellschaftliche Verhältnisse bedingt. Produktivkräfte können in Widerspruch zu bestehenden Produktionsverhältnissen geraten; daraus erklärt er gesellschaftliche Umbrüche. Sein Text enthält auch eine weitreichende Entwicklungsannahme. Diese ist von der konkreten Untersuchung eines einzelnen Konflikts zu unterscheiden und nicht als weltweit gültiger Stundenplan vorauszusetzen.",
    "terms": [
      [
        "Produktivkräfte",
        "Arbeitsvermögen, Wissen, Technik und Mittel, mit denen Menschen produzieren."
      ],
      [
        "Produktionsverhältnisse",
        "Soziale Beziehungen der Produktion: beispielsweise Eigentum, Verfügung über Arbeit und Aneignung ihrer Ergebnisse."
      ],
      [
        "Klassenkonflikt",
        "Ein Konflikt aus unterschiedlichen Stellungen in diesen Verhältnissen. Beteiligte haben deshalb nicht automatisch in jeder Frage dieselben Interessen."
      ],
      [
        "Basis und Überbau",
        "Ein Modell des Zusammenhangs von wirtschaftlichen Verhältnissen mit Recht, Politik und Bewusstsein; keine Erlaubnis, jede Idee unmittelbar auf Geld zu reduzieren."
      ]
    ],
    "example": "Untersuche die Textilproduktion in Murg. Die Fabrik lässt sich als technische Neuerung darstellen. Eine materialistische Untersuchung fragt zusätzlich nach Kapital, Arbeitszeiten, Abhängigkeiten, Absatzmärkten und Verfügung über den Ertrag. Für die spätere Schliessung reicht weder «neue Technik» noch «Profitinteresse» als unbelegtes Schlagwort. Welche konkreten Beziehungen und Veränderungen könntest du aus Quellen nachweisen?",
    "transfer": "Benenne Akteure, Verfügungsrechte und einen vermuteten Wirkungszusammenhang. Die vier Felder der Grafik sind Fragen an jede Spur, keine automatische Klassifikation von Menschen. Vergleiche zwei Erklärungsentwürfe: etwa technische Möglichkeiten und Eigentumsverhältnisse. Gewichte nur, was du begründen kannst, und halte eine Beobachtung fest, die deine Erklärung schwächen würde.",
    "limit": "Der Ansatz macht Voraussetzungen sichtbar, die in einer Geschichte grosser Persönlichkeiten leicht fehlen. Seine Anwendung verengt sich, wenn Religion, politische Entscheidungen, Geschlecht oder koloniale Herrschaft ohne Untersuchung zu blossen Nebenwirkungen erklärt werden. Eine historische Erklärung muss zeigen, wie Bedingungen im konkreten Fall wirksam werden; das Wort «materiell» ersetzt diesen Nachweis nicht.",
    "sources": [
      "marx1859"
    ]
  },
  "layers": {
    "label": "Braudel · Verschiedene Geschwindigkeiten",
    "kind": "Historiographischer Ansatz: Geschichte auf mehreren Zeitebenen",
    "lead": "Ein Vertrag wird an einem Tag unterschrieben. Die Handelswege, Abhängigkeiten und Gewohnheiten, auf die er trifft, können viel älter sein. Wer nur Ereignisdaten sammelt, sieht deshalb nicht alle Bedingungen eines Wandels. Diese Ansicht fragt, welche Prozesse gleichzeitig stattfinden, aber verschieden schnell verlaufen.",
    "context": "Fernand Braudel (1902–1985), ein Historiker der Annales-Tradition, wendet sich gegen eine Geschichte, die vor allem kurze politische Ereignisse erzählt. In seinem Aufsatz zur longue durée von 1958 rückt er langsam veränderliche Strukturen in den Blick. Zwischen kurzem Ereignis und langer Dauer liegen etwa wirtschaftliche Konjunkturen. Marc Bloch gehört zur vorausgehenden Annales-Generation: Seine Forderung, Menschen in der Zeit zu untersuchen, ist ein wichtiger Zusammenhang, aber keine blosse andere Bezeichnung für Braudels Modell.",
    "terms": [
      [
        "Ereignis",
        "Ein zeitlich enger umrissener Vorgang, etwa ein Beschluss oder eine Eröffnung."
      ],
      [
        "Konjunktur",
        "Eine Entwicklung mittlerer Dauer, beispielsweise eine wirtschaftliche Auf- oder Abschwungphase; hier nicht nur das alltagssprachliche Wort für gute Wirtschaftslage."
      ],
      [
        "Longue durée",
        "Lange Dauer: relativ beständige Bedingungen wie Verkehrsgeographien oder gesellschaftliche Ordnungen. Auch sie können sich verändern."
      ]
    ],
    "example": "Die Linthkorrektion lässt sich als Bauprojekt von 1807 bis 1823 erzählen. Auf einer anderen Ebene liegen Planung, Finanzierung und veränderte Nutzungsmöglichkeiten; auf wieder einer anderen die Landschaft und langfristige Verkehrsbeziehungen. Diese Ebenen erklären einander nicht von selbst. Untersuche, welche Beziehung du belegen kannst: Ermöglichte eine Veränderung eine andere, begrenzte sie diese oder verlief sie nur gleichzeitig?",
    "transfer": "Wähle einen Untersuchungsgegenstand und benenne ausdrücklich einen Prozess sowie eine längerfristige Bedingung. Eine Spur darf in mehreren Bändern erscheinen: Sie ist dann dieselbe Spur unter verschiedenen Fragen. Die Breite eines Bandes ist kein gemessener Zeitraum. Für eine Dauerbehauptung brauchst du Anfang, Ende oder begründete Unsicherheit aus deinen Materialien.",
    "limit": "Der Gewinn liegt darin, die vermeintliche Alleinursache eines spektakulären Ereignisses zu prüfen. Die Grenze zeigt sich, wenn «Struktur» menschliche Entscheidungen verschwinden lässt oder jede langsam verlaufende Entwicklung zur unveränderlichen Natur erklärt wird. Frage deshalb auch, wann eine Struktur bricht und für welche Gruppen sie verschieden wirksam ist.",
    "sources": [
      "braudel",
      "bloch"
    ]
  },
  "present": {
    "label": "Augustinus · Zeit im Bewusstsein",
    "kind": "Philosophisch-theologische Reflexion auf Zeiterfahrung",
    "lead": "Du erinnerst dich jetzt an gestern und erwartest jetzt etwas von morgen. Vergangenheit und Zukunft sind also nicht einfach zwei Orte, die du betreten könntest. Dieser Blick beginnt bei der Erfahrung von Zeit und fragt anschliessend, wie wir einen vergangenen Standpunkt rekonstruieren können, ohne unser späteres Wissen hineinzuschmuggeln.",
    "context": "Augustinus (354–430), Bischof von Hippo in Nordafrika, untersucht im elften Buch seiner Bekenntnisse die Zeit im Zusammenhang mit Schöpfung und Ewigkeit. Vergangenheit ist nicht mehr, Zukunft noch nicht; dennoch sprechen wir sinnvoll über beide. Er unterscheidet ihre Gegenwart im Erinnern und Erwarten von der Aufmerksamkeit auf Gegenwärtiges. Die Seele ist dabei zwischen diesen Bezügen ausgespannt. Das ist zunächst eine Reflexion auf Zeiterfahrung, keine Methode zum Sortieren historischer Ereignisse und auch nicht identisch mit seiner Heilsgeschichte.",
    "terms": [
      [
        "Erinnerung",
        "Vergangenes wird in einer gegenwärtigen Erinnerung zugänglich. Das Erinnerungsbild ist nicht das vergangene Ereignis selbst."
      ],
      [
        "Aufmerksamkeit",
        "Die Zuwendung zu dem, was gegenwärtig geschieht; auch sie ist begrenzt und perspektivisch."
      ],
      [
        "Erwartung",
        "Eine Zukunft ist schon als Erwartung wirksam, obwohl ihr tatsächlicher Verlauf noch offen ist."
      ]
    ],
    "example": "Versetze dich an einen Standpunkt vor der Abstimmung über das Frauenstimmrecht 1971. Welche früheren Erfahrungen wären einer bestimmten Person verfügbar, was könnte sie beobachten, worauf hoffen? Du kennst das Ergebnis; die Person noch nicht. Schreibe deshalb keinen inneren Monolog als vermeintliche Quelle. Halte auseinander, welche Erwartung ein zeitgenössischer Text belegt und welche du dir nur vorstellen kannst.",
    "transfer": "Setze ein Standjahr und benenne eine Person oder einen möglichst genau bestimmten Standpunkt. Die Ansicht verdeckt spätere Ereignisinformationen unter der eingeschalteten Annahme. Das ist eine Lernhilfe, keine vollständige Rekonstruktion des damaligen Wissens: Auch ein früheres Ereignis musste der Person nicht bekannt sein. Deine Wissensauswahl muss zusätzlich an Quellen geprüft werden.",
    "limit": "So lässt sich der Rückschaufehler erfahren: Was geschehen ist, erscheint uns leicht als vorhersehbar. Die Grenze der Übertragung liegt im Zugang zu fremdem Erleben. Wir können es nicht unmittelbar wiederherstellen. Augustinus hilft, die Frage zu formulieren; Quellen und historische Kontextarbeit müssen die konkrete Antwort tragen.",
    "sources": [
      "augustine"
    ]
  },
  "memoria": {
    "label": "Memoria · Soziale und kulturelle Erinnerung",
    "kind": "Soziologie und Kulturwissenschaft des Erinnerns",
    "lead": "Eine Fabrikschliessung kann für ehemalige Beschäftigte ein biographischer Bruch sein, für ein Unternehmen eine Geschäftsentscheidung und in einer Ortsgeschichte fast verschwinden. Nicht das Datum wechselt, sondern die soziale Bedeutung. Diese Ansicht untersucht, wer welche Vergangenheit gegenwärtig hält, mit welchen Mitteln und unter welchen Ausschlüssen.",
    "context": "Maurice Halbwachs (1877–1945) erklärt individuelles Erinnern aus sozialen Rahmen: Sprache, Familie, Arbeitswelt oder religiöse Gemeinschaften ermöglichen und ordnen, was Menschen erinnern. «Kollektiv» meint kein gemeinsames Gehirn und keine notwendig einheitliche Meinung. Jan und Aleida Assmann untersuchen darüber hinaus die Weitergabe von Erinnerung über Medien, Rituale und Institutionen. Die Unterscheidung von kommunikativem und kulturellem Gedächtnis hilft, alltäglichen Austausch von langfristig organisierter Erinnerung zu unterscheiden; beides kann sich überlagern.",
    "terms": [
      [
        "Soziale Rahmen",
        "Beziehungen und gemeinsame Bezugspunkte, innerhalb derer Erinnerungen verständlich werden."
      ],
      [
        "Kommunikatives Gedächtnis",
        "Erinnerung im alltäglichen Austausch, beispielsweise zwischen Menschen verschiedener Generationen; an lebende Trägerinnen und Träger gebunden."
      ],
      [
        "Kulturelles Gedächtnis",
        "Vergangenheit wird durch Texte, Bilder, Rituale, Denkmäler oder Institutionen über längere Zeit verbindlich gehalten."
      ],
      [
        "Memoria",
        "Praktiken des Erinnerns und Gedenkens. Ein Archivbestand, eine persönliche Erinnerung und ein öffentliches Denkmal sind dabei verschiedene Formen."
      ]
    ],
    "example": "Wähle die Schliessung der Textilfabrik Murg und formuliere zwei Entwürfe: ehemalige Beschäftigte und eine touristische Ortsdarstellung. Frage jeweils, welche Bilder und Zeugnisse im Zentrum stehen könnten und wer diese Auswahl tatsächlich belegen kann. «Die Beschäftigten erinnern so» wäre ohne Material selbst eine Zuschreibung. Suche deshalb auch nach unterschiedlichen Stimmen innerhalb der gewählten Gruppe.",
    "transfer": "Benenne Gruppe, Erinnerungspraktik und Auswahlprinzip. Erst deine begründeten Zuordnungen rücken Spuren ins Zentrum oder an den Rand. Ein Gruppenname erzeugt keine automatische Deutung. Vergleiche Entwürfe und prüfe anschliessend, ob die jeweils wenig sichtbaren Ereignisse vergessen, bewusst ausgeschlossen oder lediglich in deinen Quellen nicht vertreten sind.",
    "limit": "Erinnerungsbedeutung ist nicht dasselbe wie historische Wahrheit. Eine starke Erinnerung kann sachlich unzutreffend sein; eine gut belegte Tatsache kann öffentlich kaum erinnert werden. Gerade digitale Bilder können weit zirkulieren, ohne das dargestellte Ereignis zu belegen. Halte darum zwei Prüfungen offen: Wie wird erinnert, und was lässt sich über das Vergangene nachweisen?",
    "sources": [
      "halbwachs",
      "assmann",
      "assmannDigital"
    ]
  }
};

function perspectiveOptions(selected='',placeholder=false){return (placeholder?'<option value="">Ansatz nach Leitfrage wählen …</option>':'')+PERSPECTIVE_GROUPS.map(g=>`<optgroup label="${esc(g.title)}">${g.keys.map(k=>`<option value="${k}" ${k===selected?'selected':''}>${esc(PERSPECTIVE_INTROS[k].label)}</option>`).join('')}</optgroup>`).join('')}
function perspectiveNavigation(){return `<details class="perspective-map"><summary>Anderen Ansatz wählen · Übersicht nach vier Leitfragen</summary><h3 id="perspectiveMapTitle">Welche Frage möchtest du an Geschichte stellen?</h3><p>Die vier Gruppen ordnen nach Leitfragen, nicht nach einer zeitlichen Entwicklung. Religiöse Weltdeutungen, philosophische Entwürfe und Forschungsansätze leisten Unterschiedliches; ihre Fragen können sich überschneiden.</p><div class="world-switches">${PERSPECTIVE_GROUPS.map(g=>`<div class="perspective-group"><h4>${esc(g.title)}</h4><p>${esc(g.question)}</p>${g.keys.map(k=>`<button data-world-mode="${k}" aria-pressed="${k===representation}">${esc(PERSPECTIVE_INTROS[k].label)}</button>`).join('')}</div>`).join('')}</div></details>`}
let introductionOpen={};
function perspectiveIntroduction(){const d=PERSPECTIVE_INTROS[representation];return `<section class="perspective-intro" aria-labelledby="perspectiveIntroTitle"><p class="eyebrow">DEN ANSATZ VERSTEHEN · ${esc(d.kind)}</p><h3 id="perspectiveIntroTitle">${esc(d.label)}</h3><p class="intro-lead">${esc(d.lead)}</p><details id="perspectiveExplanation" ${introductionOpen[representation]!==false?'open':''}><summary>Einführung, Begriffe und ein konkretes Beispiel</summary><div class="intro-reading"><section><h4>Woher kommt dieser Blick?</h4><p>${esc(d.context)}</p><dl>${d.terms.map(([t,v])=>`<dt>${esc(t)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></section><aside class="intro-example"><p class="eyebrow">VOM ANSATZ ZUR UNTERSUCHUNG</p><h4>So verändert sich der Blick auf eine Spur</h4><p>${esc(d.example)}</p></aside><section><h4>Was du in dieser Ansicht tatsächlich veränderst</h4><p>${esc(d.transfer)}</p></section><section class="intro-boundary"><h4>Woran du die Grenze des Ansatzes erkennst</h4><p>${esc(d.limit)}</p></section><details class="intro-sources"><summary>Texte und fachliche Grundlagen</summary><ul class="source-list">${sourceHtml(d.sources)}</ul></details></div></details><a class="intro-start" href="#interpretationExperiment">Mit diesem Ansatz arbeiten ↓</a></section>`}

const CONCRETE_READINGS={
  "medieval": {
    "event": "paris",
    "title": "Dasselbe Abkommen – mit und ohne Heilsperspektive",
    "fact": "2015 wurde das Pariser Klimaabkommen angenommen. Der Vertrag formuliert Ziele; seine Annahme beweist noch nicht deren Verwirklichung.",
    "choices": [
      {
        "label": "Mit religiöser Sinnannahme",
        "premise": "Ich lese das Handeln als Verantwortung für die Schöpfung.",
        "claim": "Das Abkommen könnte als Versuch gelten, dieser Verantwortung gerecht zu werden. Ob es einem göttlichen Heilsplan entspricht, lässt sich am Vertrag nicht nachweisen.",
        "check": "Der Vertrag belegt eine politische Vereinbarung. Die religiöse Bedeutung füge ich als Perspektive hinzu. Aus dem erhofften Sinn folgt keine Gewissheit über den Ausgang."
      },
      {
        "label": "Ohne vorgegebenen Heilsplan",
        "premise": "Ich untersuche Ziele, Interessen und überprüfbare Folgen menschlichen Handelns.",
        "claim": "Das Abkommen ist ein politischer Schritt mit offenem Ausgang. Ob er wirkt, muss an Umsetzung und Folgen untersucht werden.",
        "check": "Der historische Befund bleibt derselbe. Weggefallen ist die Annahme, dass das Ereignis seinen letzten Sinn von einer göttlichen Vollendung erhält."
      }
    ],
    "guide": [
      "Der Bogen oben steht für einen angenommenen Sinnhorizont. Er ist kein Datum.",
      "Die Karten darunter sind historische Vorgänge. Ihre Nähe zum Bogen misst weder Heil noch moralischen Wert.",
      "Die gestrichelten Verbindungen stellen die Frage nach einer Deutung. Sie belegen keinen göttlichen Plan."
    ]
  },
  "egypt": {
    "event": "paris",
    "title": "Erfolg als Neuerung – oder als Bewahrung?",
    "fact": "Das Pariser Abkommen formuliert gemeinsame Klimaziele. Ob diese erreicht werden, ist eine andere Frage als die Annahme des Vertrags.",
    "choices": [
      {
        "label": "Lebensbedingungen bewahren",
        "premise": "Als erhaltenswert setze ich verlässliche Lebensbedingungen.",
        "claim": "Der Vertrag lässt sich als Versuch erzählen, Gefährdungen zu begrenzen und Bedingungen des Zusammenlebens zu bewahren. Sein Wert läge dann nicht allein darin, neu zu sein.",
        "check": "Welche Lebensbedingungen für welche Menschen gesichert werden, müsste konkret untersucht werden. Der Beschluss allein zeigt das noch nicht."
      },
      {
        "label": "Bestehende Nutzung bewahren",
        "premise": "Als erhaltenswert setze ich bestehende Formen der Energienutzung.",
        "claim": "Derselbe Vertrag kann nun als Aufforderung erscheinen, die gewählte Ordnung zu verändern. Was unter der ersten Setzung Bewahrung hiess, wird unter dieser Setzung zum Eingriff.",
        "check": "Der Wechsel legt den Interessenkonflikt offen. Keine dieser heutigen Setzungen ist mit Maʿat gleichzusetzen; die Analogie betrifft die Frage, welche Ordnung als richtig gelten soll."
      }
    ],
    "guide": [
      "Im Zentrum steht die von dir benannte Ordnung; ohne Benennung bleibt sie offen.",
      "Der Kreis sammelt Ereignisse unter dieser Frage. Die Position auf dem Kreis sagt noch nichts über ihre Bewertung.",
      "Erst deine begründete Zuordnung macht eine Spur zum Beitrag, zum Konflikt oder zum nicht passenden Fall."
    ]
  },
  "direction": {
    "event": "vote",
    "title": "1971: Fortschritt – gemessen woran?",
    "fact": "1971 wurde in der Schweiz das Frauenstimm- und Wahlrecht auf Bundesebene angenommen. Dieser Befund betrifft politische Rechte auf einer bestimmten staatlichen Ebene.",
    "choices": [
      {
        "label": "Ziel: politische Gleichberechtigung",
        "premise": "Mein Massstab ist gleichberechtigte politische Beteiligung.",
        "claim": "Der Entscheid ist ein begründbarer Fortschritt unter diesem Massstab: Er erweitert die politischen Rechte. Das Ziel war zuvor nicht erreicht; der Ausgang war nicht zwangsläufig.",
        "check": "Der Beleg reicht für dieses Urteil über politische Rechte. Er beweist keine notwendige Aufwärtsbewegung der gesamten Geschichte."
      },
      {
        "label": "Ziel: wirtschaftliche Gleichheit",
        "premise": "Mein Massstab ist gleiche wirtschaftliche Stellung.",
        "claim": "Der gleiche Entscheid reicht jetzt nicht als Beleg für Zielerreichung. Er kann relevant sein, aber seine wirtschaftlichen Folgen müssten gesondert nachgewiesen werden.",
        "check": "Die Spur wird nicht zum Rückschritt. Sie bleibt hinsichtlich dieses anderen Ziels zunächst unentschieden. Genau diese dritte Möglichkeit verhindert ein erzwungenes Gut-oder-Schlecht-Schema."
      }
    ],
    "guide": [
      "Das Ziel oben ist eine Setzung, keine aus den Daten berechnete Zukunft.",
      "Die gestrichelte Treppe zeigt die zu prüfende Vorstellung eines Aufstiegs. Ohne eigene Zuordnung stehen die Karten auf gleicher Höhe.",
      "Erst begründete Rollen verändern die Position. Die Höhe misst keine tatsächliche Menge an Freiheit oder Fortschritt."
    ]
  },
  "recurrence": {
    "event": "haiti",
    "title": "Zwei Revolutionen: ähnlich ist nicht dasselbe",
    "fact": "1789 und die Haitianische Revolution von 1791–1804 lassen sich unter der Frage nach Freiheit vergleichen. Die Unabhängigkeit Haitis wurde 1804 erklärt.",
    "choices": [
      {
        "label": "Gemeinsames Merkmal hervorheben",
        "premise": "Ich vergleiche den Anspruch, bestehende Herrschaft im Namen von Freiheit zu verändern.",
        "claim": "Unter dieser Frage entsteht eine Ähnlichkeit. «Freiheit wird beansprucht» verbindet die Fälle, ohne sie gleichzusetzen.",
        "check": "Damit ist eine Vergleichsfrage benannt. Weder Ursachen noch Beteiligte oder Ergebnisse sind dadurch identisch."
      },
      {
        "label": "Unterschied ernst nehmen",
        "premise": "Ich vergleiche die Stellung versklavter Menschen und kolonialer Herrschaft.",
        "claim": "Nun wird die Begrenzung der Analogie sichtbar: Die Haitianische Revolution lässt sich nicht als blosse Wiederholung eines europäischen Ereignisses erklären.",
        "check": "Nietzsches Frage nach ewiger Wiederkunft wird dadurch weder bewiesen noch widerlegt. Ein historischer Vergleich und sein philosophisches Gedankenexperiment prüfen verschiedene Dinge."
      }
    ],
    "guide": [
      "Der eingestellte Umlauf ordnet die Jahre räumlich. Er ist von dir gewählt.",
      "Ähnliche Winkel bedeuten rechnerische Nähe im gewählten Umlauf, keine nachgewiesene Wiederholung.",
      "Ändere die Umlauflänge: Wenn Nachbarschaften wechseln, hat sich die Darstellung geändert – nicht die Vergangenheit."
    ]
  },
  "materialism": {
    "event": "paris",
    "title": "Ein Klimaziel wird noch keine neue Produktionsweise",
    "fact": "Ein Vertrag kann gemeinsame Ziele beschliessen. Energieanlagen, Eigentum und Arbeitsverhältnisse ändern sich dadurch nicht automatisch am selben Tag.",
    "choices": [
      {
        "label": "Technische Möglichkeiten untersuchen",
        "premise": "Ich frage nach Anlagen, Wissen und Arbeit, mit denen Energie bereitgestellt wird.",
        "claim": "Der Vertrag trifft auf materielle Möglichkeiten und Grenzen. Eine Erklärung müsste zeigen, welche Produktionsmittel vorhanden sind und wie sie verändert werden können.",
        "check": "Benötigt werden konkrete Befunde zu Technik, Investitionen und Arbeit. Der Begriff «Produktivkräfte» ist eine Suchrichtung, noch keine fertige Erklärung."
      },
      {
        "label": "Verfügung und Interessen untersuchen",
        "premise": "Ich frage, wer über Anlagen und Investitionen entscheidet und wer Kosten trägt.",
        "claim": "Jetzt stehen soziale Beziehungen im Vordergrund. Eine technisch mögliche Veränderung kann an Eigentum, Macht oder gegensätzlichen Interessen auf Widerstand treffen.",
        "check": "Das ist eine zu prüfende Erklärung. Welche Akteure im konkreten Fall wie handeln, darf nicht aus dem Wort «Kapitalismus» allein abgeleitet werden."
      }
    ],
    "guide": [
      "Die vier Spalten stellen vier Fragen an denselben Vorgang. Wiederholte Karten sind keine zusätzlichen Ereignisse.",
      "Die Spalten zeigen keine automatisch nachgewiesene Kette von Technik über Recht zum Konflikt.",
      "Ein Wirkungszusammenhang entsteht erst aus deiner Erklärung und ihren Belegen."
    ]
  },
  "layers": {
    "event": "paris",
    "title": "Ein Datum – drei verschiedene Zeitprobleme",
    "fact": "Der politische Beschluss von 2015 lässt sich datieren. Die Veränderung von Infrastrukturen und die Entwicklung des Klimas folgen nicht demselben Takt.",
    "choices": [
      {
        "label": "Nur den Beschluss betrachten",
        "premise": "Ich frage: Wann wurde das Abkommen angenommen?",
        "claim": "2015 ist für diese Frage ein geeigneter Einschnitt. Eine kurze Ereignisgeschichte kann den Beschluss und seine unmittelbare Vorgeschichte untersuchen.",
        "check": "Die Antwort ist richtig, beantwortet aber noch nicht, wann Anlagen umgebaut wurden oder Klimawirkungen eintraten."
      },
      {
        "label": "Verschiedene Dauern unterscheiden",
        "premise": "Ich frage zusätzlich nach Umsetzung, Lebensdauer von Anlagen und Klimaprozessen.",
        "claim": "Ein einziges Datum reicht jetzt nicht mehr. Der Beschluss, gesellschaftliche Veränderungen und längerfristige Bedingungen benötigen unterschiedliche Zeitangaben.",
        "check": "Welche Dauer im konkreten Fall gilt, muss belegt werden. «Lange Dauer» ist kein Freipass, einen beliebig langen Balken zu zeichnen."
      }
    ],
    "guide": [
      "Oben stehen datierte Vorgänge; darunter Fragen nach Entwicklungen und längerfristigen Bedingungen.",
      "Dieselbe Karte kann auf mehreren Ebenen erscheinen, weil du verschiedene Aspekte untersuchst.",
      "Die gestrichelten Bänder sind Platzhalter für eine Untersuchung, keine gemessenen Laufzeiten."
    ]
  },
  "present": {
    "event": "vote",
    "title": "1970 wissen wir noch nicht, was 1971 geschieht",
    "fact": "Heute ist das Abstimmungsergebnis von 1971 bekannt. Von einem Standpunkt im Jahr 1970 aus gehört es noch zur offenen Zukunft.",
    "choices": [
      {
        "label": "Vom Standpunkt 1970",
        "premise": "Ich trenne damalige Informationen und Erwartungen von späterem Wissen.",
        "claim": "Eine Person konnte hoffen, zweifeln oder sich engagieren. Welche Erwartung sie tatsächlich hatte, kann nur eine zeitgenössische Quelle belegen.",
        "check": "«Es musste so kommen» wäre hier eingeschmuggeltes Rückblickswissen. Auch die frühere Erfahrung einer Person darf nicht einfach erfunden werden."
      },
      {
        "label": "Im heutigen Rückblick",
        "premise": "Ich kenne den späteren Ausgang und erzähle auf ihn hin.",
        "claim": "Frühere Handlungen können nun wie Vorstufen eines bekannten Erfolgs erscheinen. So wird die damalige Unsicherheit leicht unsichtbar.",
        "check": "Augustinus hilft, Erinnern, Aufmerksamkeit und Erwarten zu unterscheiden. Unsere historische Übung überträgt diese Unterscheidung; sie rekonstruiert kein Bewusstsein automatisch."
      }
    ],
    "guide": [
      "Das Standjahr trennt mögliche frühere Bezüge von späteren Ereignissen.",
      "Verdeckte Zukunftskarten schützen vor Rückblickswissen. Sie beweisen nicht, was eine damalige Person erwartete.",
      "Auch links sichtbare Ereignisse sind nur mögliche Erinnerungsbezüge. Ob die Person sie kannte, bleibt eine Quellenfrage."
    ]
  },
  "memoria": {
    "event": "vote",
    "title": "Dasselbe Jahr – zwei Erinnerungsfragen",
    "fact": "1971 bezeichnet die Annahme des Frauenstimmrechts auf Bundesebene. Welche Bedeutung diesem Datum gegeben wird, hängt zusätzlich von der Erinnerungsfrage ab.",
    "choices": [
      {
        "label": "Den Erfolg öffentlich erinnern",
        "premise": "Ich entwerfe eine Gedenkveranstaltung zur Erweiterung politischer Rechte.",
        "claim": "1971 rückt ins Zentrum. Bilder, Reden und Zeugnisse könnten den erkämpften Erfolg hervorheben. Das ist eine mögliche Auswahl, keine Behauptung über alle damaligen Beteiligten.",
        "check": "Untersuche eine tatsächliche Gedenkquelle: Wer spricht, welche Vorgeschichte erscheint und welche Stimmen fehlen?"
      },
      {
        "label": "Den langen Ausschluss erinnern",
        "premise": "Ich entwerfe eine Ausstellung darüber, wem Rechte lange vorenthalten wurden.",
        "claim": "Dasselbe Datum markiert nun auch die Dauer des vorausgehenden Ausschlusses. Das Ereignis bleibt wahr, erhält aber einen anderen Akzent.",
        "check": "Ein Wechsel der Erinnerungsfrage verändert Bedeutung und Auswahl, nicht den historischen Befund. Innerhalb jeder Gruppe können verschiedene Erinnerungen nebeneinander bestehen."
      }
    ],
    "guide": [
      "Zentrum und Rand zeigen Gewichtungen in deinem Erinnerungsentwurf, keine Rangliste historischer Wahrheit.",
      "Ohne benannte Gruppe und begründete Zuordnungen ist noch keine soziale Erinnerung rekonstruiert.",
      "Blasse Karten bleiben im Bestand. Aus ihrer Darstellung folgt nicht, dass eine wirkliche Gruppe sie vergessen hat."
    ]
  }
};

const concreteChoice={};
function concreteReadingHtml(){const d=CONCRETE_READINGS[representation],e=byId(d.event),selected=concreteChoice[representation]||0,c=d.choices[selected];return `<section class="concrete-reading" aria-labelledby="concreteTitle"><p class="eyebrow">ZUERST AN EINEM FALL VERSTEHEN</p><h3 id="concreteTitle">${esc(d.title)}</h3><div class="concrete-fact">${e.image?`<img src="${imageSrc(e.image)}" alt="Bildmaterial zur Spur: ${esc(e.title)}">`:''}<div><span class="step-label">1 · Der Befund bleibt gleich</span><p>${esc(d.fact)}</p><button data-explore="${esc(e.id)}">Spur, Quelle und Bildnachweis öffnen ↗</button></div></div><div class="concrete-choice"><span class="step-label">2 · Wechsle die ausdrücklich gesetzte Perspektive</span><div role="group" aria-label="Zwei beispielhafte Lesarten">${d.choices.map((v,i)=>`<button data-concrete-choice="${i}" aria-pressed="${selected===i}">${esc(v.label)}</button>`).join('')}</div></div><div class="concrete-result" aria-live="polite"><article><span class="step-label">Meine Voraussetzung</span><p>${esc(c.premise)}</p></article><span class="concrete-arrow" aria-label="Unter dieser Voraussetzung lese ich">↓ <small>So verändert sich die Lesart</small></span><article class="concrete-claim"><span class="step-label">3 · Die daraus entwickelte Deutung</span><p>${esc(c.claim)}</p></article><aside><strong>Was ist damit belegt – und was nicht?</strong><p>${esc(c.check)}</p></aside></div><p class="small">Zwei ausgearbeitete Unterrichtsbeispiele. Der Wechsel verändert nur dieses Beispiel; deine eigenen Entwürfe bleiben erhalten. Anschliessend kannst du jede Spur des Bestands selbst untersuchen.</p></section>`}
function worldReadingGuide(){const d=CONCRETE_READINGS[representation];return `<section class="world-reading-guide" aria-label="Lesehilfe zur Grafik"><h3>So liest du die folgende Darstellung</h3><ol>${d.guide.map(t=>`<li>${esc(t)}</li>`).join('')}</ol><p><strong>Eine Karte öffnen:</strong> Klicke auf ein Ereignis. Im Popup kannst du Quellen prüfen und deine Einordnung begründen. Die Farbe zeigt die gewählte Rolle, die Punktgrösse das Gewicht. Offene Spuren bleiben blau.</p></section>`}

// Reading aids refer to the new semantic boards, not the retired SVG arrangements.
const BOARD_GUIDES={
 medieval:['Oben steht der ausdrücklich benannte Heilshorizont. Er ist eine religiöse Voraussetzung, kein datiertes Ereignis.','Die Felder unterscheiden deine begründeten Lesarten: Annäherung, Widerspruch, Mehrdeutigkeit oder fehlende Bedeutung für dieses Telos.','Noch nicht eingeordnete Spuren stehen darunter. Ihr Datum begründet keine Nähe zum Heil.'],
 direction:['Das Ziel steht über der Tafel. Links liegen begründete Gegenbefunde, rechts Beiträge zum Ziel; widersprüchliche Wirkungen haben ein eigenes Feld.','Ohne Zuordnung bleibt eine Spur im Untersuchungsbestand. Später bedeutet nicht besser.','Auf jeder eingeordneten Karte stehen deine Begründung und das Gewicht im Entwurf.'],
 egypt:['Die benannte Ordnung ist der Bezugspunkt der Tafel.','Bewahrung und Infragestellung stehen einander gegenüber; mehrdeutige und randständige Fälle bleiben gesondert sichtbar.','Die Anordnung behauptet keinen wiederkehrenden Verlauf sämtlicher Ereignisse.'],
 memoria:['Im Zentrum stehen die von dir begründeten Erinnerungsbezüge; Gegen-Erinnerungen und umstrittene Erinnerungen liegen in eigenen Feldern.','Das Randfeld enthält deine bewusst ausgeblendeten Bezüge. Eine Zuordnung hier beweist kein tatsächliches Vergessen einer Gruppe.','Soziale Beziehungen und kulturelle Vermittlung müssen an Quellen untersucht werden.'],
 materialism:['Die vier Untersuchungsfelder unterscheiden Produktivkräfte, Produktionsverhältnisse, Recht und Politik sowie Konflikte.','Eine Karte erscheint bei dem ergänzenden Untersuchungsschwerpunkt, den du ihr im Arbeitsbereich zuweist.','Deine Lesart zur Wirkungskette und ihre Begründung stehen auf der Karte. Die Felder selbst behaupten noch keine Ursache.'],
 layers:['Die drei Bänder unterscheiden Ereignis, Entwicklung und lange Dauer.','Du wählst im Arbeitsbereich den Untersuchungsschwerpunkt einer Spur. Sie wird nicht automatisch auf allen Ebenen vervielfacht.','Die Bänder messen keine Laufzeiten. Die Dauer des betrachteten Aspekts muss aus Quellen begründet werden.'],
 present:['Das Standjahr teilt mögliche frühere Wissensbezüge und spätere Ereignisse.','Spätere Ereignisse sind verdeckt, solange die Annahme eingeschaltet ist.','Die linke Seite belegt noch nicht, was eine damalige Person tatsächlich wusste.'],
 recurrence:['Die Spalten bilden gleich lange, von dir gesetzte Zeitabschnitte um das Standjahr.','Ändere die Abschnittslänge: Gruppierungen verändern sich, ohne dass ein Ereignisdatum geändert wird.','Eine wiederkehrende Ursache oder ein gemeinsames Merkmal muss im Vergleich zusätzlich belegt werden.']
};
for(const [key,guide] of Object.entries(BOARD_GUIDES))CONCRETE_READINGS[key].guide=guide;
PERSPECTIVE_INTROS.medieval.transfer='Benenne zuerst den Heilshorizont und die Perspektive, aus der du sprichst. Die Ereignistafel unterscheidet danach deine begründeten Deutungen: Annäherung, Widerspruch, Mehrdeutigkeit und fehlende Bedeutung für dieses Telos. Ohne begründete Entscheidung bleibt eine Spur im Untersuchungsbestand. Wenn du statt Erlösung ein heutiges Ziel wie Frieden einsetzt, untersuchst du eine veränderte teleologische Konstruktion.';
PERSPECTIVE_INTROS.egypt.transfer='Die benannte Ordnung steht über zwei gegenüberliegenden Feldern für Bewahrung und Infragestellung. Du ordnest Spuren mit Begründungen zu; mehrdeutige Fälle erhalten ein eigenes Feld. Ändere die Setzung: Frühere Zuordnungen müssen erneut geprüft werden.';
PERSPECTIVE_INTROS.direction.limit='Die Tafel zeigt begründete Beiträge, Gegenbefunde und widersprüchliche Wirkungen nebeneinander. Sie behauptet keinen notwendigen Aufstieg. Gerade nicht zuweisbare Spuren können zeigen, dass dein Telos zu unbestimmt ist oder verschiedene Lebensbereiche unzulässig auf einen einzigen Wert reduziert.';
PERSPECTIVE_INTROS.layers.transfer='Wähle einen Untersuchungsgegenstand und ordne die Spur im Arbeitsbereich einem ergänzenden Untersuchungsschwerpunkt zu: Ereignis, Entwicklung oder lange Dauer. Die Bänder zeigen diese Entscheidung. Sie messen keine Zeiträume. Für eine Dauerbehauptung brauchst du Anfang, Ende oder begründete Unsicherheit aus deinen Materialien.';
PERSPECTIVE_INTROS.recurrence.transfer='Lege Vergleichskriterium und Fälle fest. Verändere dann die Länge der versuchsweisen Zeitabschnitte: Die Gruppierungen wechseln, obwohl kein Datum geändert wurde. Hör ergänzend den verlinkten Podcast «Wiederholt sich die Geschichte?» und prüfe eine seiner Aussagen an deinem Fallpaar.';
PERSPECTIVE_INTROS.recurrence.limit='Die Abschnittstafel macht die Setzung zeitlicher Rhythmen sichtbar. Sie belegt keine Wiederholung. Eine begründete Antwort kann lauten: Ein Problem kehrt unter veränderten Bedingungen wieder; der Verlauf und sein Ausgang bleiben verschieden.';

// A single working surface; reading and editing happen on demand in a dialog.
let worldSheet='';
const boardFieldSelection={};
function compactWorldWorkspace(){
 const root=$('.world-view');root.classList.add('compact-world');
 const sheet=document.createElement('dialog');sheet.id='worldDrawer';sheet.setAttribute('aria-labelledby','worldDrawerTitle');
 sheet.innerHTML='<div class="drawer-bar"><h2 id="worldDrawerTitle">Arbeitsfenster</h2><button type="button" id="worldDrawerClose" aria-label="Arbeitsfenster schliessen">Schliessen ×</button></div><nav class="drawer-tabs" aria-label="Arbeitsfenster"></nav><div class="drawer-content"></div>';
 root.append(sheet);
 const groups=[['explain','Ansatz verstehen',['.perspective-intro','.world-foundations','.board-help']],['example','Beispiel erproben',['.concrete-reading','.world-consequences']],['settings','Voraussetzung & Entwürfe',['.reading-profiles','.telos-lab','.world-experiment']],['investigate','Spur untersuchen',['.world-workbench','.world-compare']],['compare','Entwürfe vergleichen',['.reading-comparison']],['register','Alle Spuren',['.world-register']],['perspectives','Ansatz wechseln',['.perspective-map']]];
 const open=name=>{if(name==='settings')diagramTeaching[representation]='own';worldSheet=name;sheet.querySelectorAll('[data-sheet-pane]').forEach(p=>p.hidden=p.dataset.sheetPane!==name);sheet.querySelectorAll('[data-sheet-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sheetTab===name)));$('#worldDrawerTitle').textContent=groups.find(g=>g[0]===name)?.[1]||'Arbeitsfenster';if(!sheet.open)sheet.showModal();};
 for(const [name,title,selectors] of groups){const pane=document.createElement('section');pane.dataset.sheetPane=name;pane.hidden=true;for(const selector of selectors)for(const el of [...root.querySelectorAll(selector)]){if(sheet.contains(el))continue;pane.append(el);if(el.matches('details'))el.open=true;}if(name==='compare'&&!pane.children.length)pane.innerHTML='<p>Lege unter «Voraussetzung & Entwürfe» einen zweiten Entwurf an und wähle dort den Vergleich aus.</p>';sheet.querySelector('.drawer-content').append(pane);if(name!=='perspectives'){const b=document.createElement('button');b.textContent=title;b.dataset.sheetTab=name;b.onclick=()=>open(name);sheet.querySelector('.drawer-tabs').append(b)}}
 const bar=document.createElement('nav');bar.className='world-commandbar';bar.setAttribute('aria-label','Werkzeuge zur Ansicht');for(const name of ['explain','example','settings','compare','register']){const b=document.createElement('button');b.textContent=groups.find(g=>g[0]===name)[1];b.onclick=()=>open(name);bar.append(b)}root.insertBefore(bar,root.firstChild);
 $('#worldDrawerClose').onclick=()=>{worldSheet='';sheet.close()};sheet.addEventListener('cancel',()=>{worldSheet=''});
 root.querySelectorAll('a[href="#interpretationSettings"]').forEach(a=>a.onclick=e=>{e.preventDefault();open('settings')});
 root.querySelectorAll('a[href="#interpretationExperiment"]').forEach(a=>a.onclick=e=>{e.preventDefault();worldSheet='';sheet.close();$('#interpretationExperiment').scrollIntoView({block:'nearest'})});
 const board=root.querySelector('#interpretationExperiment .semantic-board');if(board&&!board.classList.contains('schematic-scene')){
 const fields=[...board.querySelectorAll('.board-field')],tabs=document.createElement('div'),deck=document.createElement('div');tabs.className='board-field-tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Deutungsfeld wählen');deck.className='board-deck';
 let current=boardFieldSelection[representation];if(!Number.isInteger(current)||current>=fields.length)current=Math.max(0,fields.findIndex(f=>f.querySelector('.board-card')));
 const activate=i=>{boardFieldSelection[representation]=i;fields.forEach((f,j)=>f.hidden=i!==j);[...tabs.children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));};
 fields.forEach((f,i)=>{const b=document.createElement('button');b.textContent=f.querySelector('h4').textContent;b.title=b.textContent;const shortLabels={'Annäherung an das Telos':'Annäherung','Widerspruch zum Telos':'Widerspruch','Für dieses Telos ohne Bedeutung':'Ohne Bezug','Noch zu untersuchen':'Untersuchen','Fortschritt nach meinem Massstab':'Beitrag zum Ziel','Rückschritt / Gegenbefund':'Gegenbefund','Ungleiche oder widersprüchliche Wirkung':'Widersprüchlich','Nach diesem Massstab nebensächlich':'Randständig','Bewahrt / erneuert die benannte Ordnung':'Bewahrung','Stellt diese Ordnung infrage':'Infragestellung','Für diese Ordnungsfrage randständig':'Randständig'};for(const [long,short] of Object.entries(shortLabels))b.textContent=b.textContent.replace(long,short);b.onclick=()=>activate(i);tabs.append(b);deck.append(f)});
 const header=board.querySelector(':scope > header'),anchor=board.querySelector('.board-telos'),caption=board.querySelector('figcaption');board.replaceChildren();if(header)board.append(header);if(anchor)board.append(anchor);board.append(tabs,deck);if(caption){const help=document.createElement('details');help.className='compact-caption';help.innerHTML='<summary>Was bedeutet diese Anordnung?</summary>';help.append(caption);board.append(help)}activate(current);
 const hint=document.createElement('p');hint.className='strip-hint';hint.textContent='← Bildstreifen seitlich bewegen · eine Spur anklicken →';deck.prepend(hint);
 }
 installWholeViewNavigation(root);
 if(worldSheet)open(worldSheet);
}

function presentSceneHtml(items){
 const shown=worldSelection(items).sort((a,b)=>a.year-b.year),past=shown.filter(e=>e.year<worldYear),now=shown.filter(e=>e.year===worldYear),future=shown.filter(e=>e.year>worldYear);
 const generated=randomConceptMeta(activeReading('present'),'present'),shifted=generated&&generated.year!==worldYear;
 const person=premiseValue('present','person')||'Noch keine betrachtete Person oder Gruppe benannt',knowledge=premiseValue('present','knowledge'),expectation=premiseValue('present','expectation');
 const row=e=>{const d=readingDecision(e.id);return `<button class="present-trace" data-lens-focus="${esc(e.id)}" aria-label="${esc(spurDate(e)+' · '+e.title)}">${e.image?`<img src="${esc(imageSrc(e.image))}" alt="">`:'<span class="present-trace-mark">↗</span>'}<span><time>${esc(yr(e.year))}${e.end?'–'+esc(yr(e.end)):''}</time><strong>${esc(e.title)}</strong>${d&&!d.stale?`<small>Deine Zuordnung: ${esc(({support:'im Wissenshorizont',counter:'Gegenbefund',ambivalent:'ungewiss',outside:'nicht zugänglich'})[d.role]||d.role)}</small>`:''}</span></button>`};
 return `<figure class="world-scene semantic-board schematic-scene present-scene"><div class="diagram-topline"><span>${shown.length} datierte Spuren · Standpunkt ${yr(worldYear)}</span><a href="#interpretationSettings">Person, Wissen und Erwartung bearbeiten ↗</a></div><div class="present-standpoint"><label>Von welchem Jahr aus schaust du? <input type="number" data-present-year value="${worldYear}" min="-100000" max="10000" step="1"></label><button data-present-go>Standpunkt verschieben →</button><span class="present-year-error" role="alert"></span></div><div class="present-map">
 <section class="present-past"><h3>Was liegt schon zurück?</h3><p>Frühere Spuren sind <strong>mögliche Wissensbezüge</strong>. Ihr Datum beweist nicht, dass die Person sie kannte.</p><div class="present-traces">${past.map(row).join('')||'<p>Keine früheren Spuren in deiner Auswahl.</p>'}</div></section>
 <section class="present-vantage"><h3>Hier steht dein Blick</h3><strong class="present-date">${yr(worldYear)}</strong><p class="present-person">${esc(person)}</p>${shifted?`<p class="present-caution">Standpunkt verändert: Der erzeugte Personenentwurf bezieht sich auf ${yr(generated.year)}. Person, Wissen und Erwartung erneut prüfen.</p>`:''}<svg class="whole-form-backdrop" viewBox="0 0 260 100" aria-label="Erinnern und Erwarten gehen von derselben Gegenwart aus"><path d="M125 80V25M125 50H15M15 50l12 -9M15 50l12 9M135 50L245 15M135 50L245 85" fill="none" stroke="#789080" stroke-width="3"/><circle cx="130" cy="50" r="10" fill="#b28b49"/><text x="15" y="96">erinnern</text><text x="170" y="96">erwarten</text></svg><details><summary>Welches Wissen setzt der Entwurf voraus?</summary><p>${esc(knowledge||'Noch offen: Zeitgenössische Zeugnisse zum Wissensstand suchen.')}</p></details>${now.length?`<details><summary>${now.length} Spur(en) aus diesem Kalenderjahr</summary><div class="present-traces">${now.map(row).join('')}</div></details>`:'<p class="present-no-event">Das Standjahr muss kein Ereignisjahr sein.</p>'}</section>
 <section class="present-future"><h3>Was könnte noch kommen?</h3><p class="present-expectation">${esc(expectation||'Noch keine Erwartung formuliert. Welche Hoffnung, Befürchtung oder offene Möglichkeit wäre für diese Person damals begründbar?')}</p><p class="present-caution">Erwartung ist kein Rückblick. Gesetzte Erwartung im Unterrichtsentwurf – ohne zeitgenössischen Beleg keine Aussage darüber, was jemand wirklich erwartete.</p><div class="present-future-fork"><span>Es könnte anders kommen.</span><span>Der Ausgang bleibt offen.</span></div><details class="present-retrospect" ${!worldAssumption?'open':''}><summary>Heutigen Rückblick öffnen · ${future.length} spätere Spuren</summary><p>Diese Ereignisse kennen wir erst rückblickend. Sie sind <strong>keine damaligen Erwartungen</strong>.</p><div class="present-traces">${future.map(row).join('')||'<p>Keine späteren Spuren in deiner Auswahl.</p>'}</div></details></section>
 </div>${undatedOverview(items)}<figcaption>Verschiebe das Standjahr: Dieselbe Spur kann vom späteren Geschehen in die Vergangenheit wechseln. Das macht sie noch nicht zum Wissen dieser Person. Die drei Bereiche übertragen Augustinus’ Unterscheidung von Erinnern, gegenwärtiger Aufmerksamkeit und Erwarten auf eine historische Untersuchung.</figcaption></figure>`;
}

// Spatial diagrams: the marks are events, their positions follow the stated model.
function worldSceneHtml(items){
 if(representation==='present')return presentSceneHtml(items);
 const mode=representation,shown=worldSelection(items).sort((a,b)=>a.year-b.year),n=shown.length,anchor=['medieval','direction'].includes(mode)?telosGoal(mode):premiseValue(mode,PREMISE_LABS[mode].anchor);
 const text=(x,y,t,cls='')=>`<text x="${x}" y="${y}" class="${cls}">${esc(t)}</text>`;
 const path=d=>`<path d="${d}"/>`;
 let bg='',caption='',positions=[];
 const fraction=i=>n<2?.5:i/(n-1),chron=i=>85+fraction(i)*1010;
 const role=e=>{const d=readingDecision(e.id);return worldAssumption&&d&&!d.stale?d:null};
 if(!worldAssumption){bg=path('M60 310H1130')+text(65,70,'Die datierten Spuren – ohne die gewählte Deutung');positions=shown.map((e,i)=>[chron(i),280+(i%2)*90]);caption='Nur Datumsreihenfolge. Eine Deutung ist ausgeblendet, nicht gelöscht.';}
 else if(mode==='medieval'){
 bg=path('M85 145Q590 -30 1095 145')+text(590,60,anchor||'Vollendung / Heil: noch nicht bestimmt','diagram-center diagram-goal')+text(590,91,'Glaubensvoraussetzung · kein Datum','diagram-center')+path('M85 470H1095')+text(70,513,'Irdisches Geschehen →')+path('M590 160V430')+text(610,255,'Wie wird ein Ereignis')+text(610,279,'auf dieses Heil bezogen?');
 positions=shown.map((e,i)=>[chron(i),role(e)?({support:180,counter:405,ambivalent:300,outside:475}[role(e).role]):360+(i%3)*48]);caption='Zeit läuft nach rechts. Nur begründete Zuordnungen rücken Ereignisse zum Heilshorizont oder davon weg. Ungeprüfte Spuren liegen unten.';
 }else if(mode==='direction'){
 bg=path('M70 440H1120M70 100V460')+text(75,493,'Frühere Spuren')+text(1000,493,'Spätere Spuren')+text(100,110,'Beitrag zum gewählten Ziel ↑')+path('M95 390Q560 390 1070 110')+text(670,60,anchor||'Welches Ziel wäre überhaupt begründbar?','diagram-goal')+text(420,430,'Zeitlicher Abstand ist kein Fortschrittsmass');
 positions=shown.map((e,i)=>[chron(i),role(e)?({support:175,counter:460,ambivalent:285,outside:530}[role(e).role]):340+(i%2)*48]);caption='Waagrecht: Datumsfolge. Senkrecht: deine begründete Wertung. Die gestrichelte Aufstiegskurve ist eine zu prüfende Behauptung.';
 }else if(mode==='egypt'){
 bg='<circle cx="590" cy="295" r="200"/><circle cx="590" cy="295" r="242" stroke-dasharray="3 8"/>'+text(590,270,anchor||'Welche Ordnung gilt als richtig?','diagram-center diagram-goal')+text(590,306,'Bewahren ↻ Erneuern','diagram-center')+text(590,334,'Wer bestimmt sie? Wer trägt die Kosten?','diagram-center')+text(60,80,'Erhaltung ist eine Leistung, keine Bewegungslosigkeit');
 positions=shown.map((e,i)=>{const a=-Math.PI/2+i/Math.max(1,n)*Math.PI*2,d=role(e),r=d?({support:155,counter:275,ambivalent:215,outside:300}[d.role]):240;return [590+Math.cos(a)*r*1.65,295+Math.sin(a)*r*.85]});caption='Die Ordnung bildet den Bezugspunkt. Nähe bedeutet erst nach eigener Begründung einen Beitrag zur Bewahrung. Der Kreis ist keine Behauptung identischer historischer Zyklen.';
 }else if(mode==='memoria'){
 bg='<ellipse cx="435" cy="295" rx="320" ry="205"/><ellipse cx="735" cy="295" rx="320" ry="205"/>'+text(240,70,'Soziale Beziehungen')+text(785,70,'Kulturelle Vermittlung')+text(590,275,anchor||'Wer erinnert sich?','diagram-center diagram-goal')+text(590,310,'Gespräch · Bild · Ritual · Institution','diagram-center')+text(590,545,'Überlappende Erinnerungsräume','diagram-center');
 positions=shown.map((e,i)=>{const a=i/Math.max(1,n)*Math.PI*2,d=role(e),r=d?({support:.42,counter:.92,ambivalent:.67,outside:1.12}[d.role]):1;return [590+Math.cos(a)*450*r,295+Math.sin(a)*200*r]});caption='Begründete Erinnerungsbezüge rücken ins Zentrum. Ohne benannte Gruppe bleibt die Deutung offen. Nähe bedeutet Erinnerungsbedeutung, nicht Wahrheit.';
 }else if(mode==='materialism'){
 bg=path('M235 150H935V425H235ZM235 150L935 425M935 150L235 425')+text(90,65,'Arbeit · Technik · Wissen')+text(805,65,'Eigentum · Verfügung')+text(90,515,'Recht · Institutionen')+text(805,515,'Interessen · Konflikte')+text(590,265,anchor||'Welcher Wirkungszusammenhang?','diagram-center diagram-goal')+text(590,300,'Verbindungen müssen belegt werden','diagram-center');
 const centers={forces:[235,145],relations:[935,145],politics:[235,415],conflicts:[935,415]};positions=shown.map((e,i)=>{const slot=lensAssignment(mode,e.id),c=centers[slot];if(c){const peers=shown.filter(x=>lensAssignment(mode,x.id)===slot),j=peers.indexOf(e),a=j/peers.length*Math.PI*2;return [c[0]+Math.cos(a)*105,c[1]+Math.sin(a)*65]}return [355+(i%10)*51,165+Math.floor(i/10)*58]});caption='Die Ecken sind Untersuchungsfragen, die Linien mögliche Wechselwirkungen. Eine Schwerpunktzuordnung verschiebt die Spur zur entsprechenden Frage.';
 }else if(mode==='layers'){
 bg=path('M185 145H1130M185 290H1130M185 435H1130')+text(25,110,'Ereignis')+text(25,255,'Entwicklung')+text(25,400,'Lange Dauer')+text(230,55,anchor||'Welche Prozesse verlaufen in verschiedenen Tempi?','diagram-goal');
 positions=shown.map((e,i)=>{const slot=lensAssignment(mode,e.id),row={event:140,process:285,structure:430}[slot];return [220+fraction(i)*850,(row??140)+(i%2)*52]});caption='Unzugeordnete datierte Spuren beginnen auf der Ereignisebene. Ein begründeter Untersuchungsschwerpunkt verschiebt sie zwischen den Schichten. Linien sind keine gemessenen Laufzeiten.';
 }else if(mode==='present'){
 bg=path('M590 100V490M65 320H1120')+text(80,65,'Erinnern: mögliche frühere Bezüge')+text(735,65,'Erwarten: Ausgang noch offen')+text(590,530,(anchor||'Standpunkt offen')+' · '+yr(worldYear),'diagram-center diagram-goal');
 const older=shown.filter(e=>e.year<=worldYear),later=shown.filter(e=>e.year>worldYear);positions=shown.map(e=>{const set=e.year<=worldYear?older:later,j=set.indexOf(e),x=e.year<=worldYear?80:685;return [x+(j%10)*46,150+Math.floor(j/10)*60]});caption='Die Trennlinie ist dein Standjahr. Spätere Ereignisse sind verdeckt. Ein früheres Datum beweist noch nicht, dass die betrachtete Person dieses Ereignis kannte.';
 }else{
 let d='';for(let i=0;i<=160;i++){const a=i/160*4*Math.PI,r=60+i/160*175;d+=(i?'L':'M')+(590+Math.cos(a)*r*1.8)+' '+(295+Math.sin(a)*r)}bg=path(d)+text(590,50,anchor||'Welches Merkmal soll wiederkehren?','diagram-center diagram-goal')+text(590,550,'Ein versuchsweiser Umlauf: '+worldPeriod+' Jahre','diagram-center');
 positions=shown.map((e,i)=>{const a=(tunnelOrdinal(e.year)-tunnelOrdinal(worldYear))/worldPeriod*2*Math.PI,r=95+fraction(i)*145;return [590+Math.cos(a)*r*1.8,295+Math.sin(a)*r]});caption='Winkel folgen der gewählten Umlauflänge, Abstand vom Zentrum der zeitlichen Reihenfolge. Ändere den Umlauf: optische Nähe allein beweist keine Wiederholung.';
 }
 // Resolve collisions without hiding events; displacement is only a legibility adjustment.
 for(let pass=0;pass<40;pass++)for(let i=0;i<n;i++)for(let j=0;j<i;j++){let dx=positions[i][0]-positions[j][0],dy=positions[i][1]-positions[j][1],dist=Math.hypot(dx,dy);if(dist<48){if(dist<.1){dx=1;dy=1;dist=1.414}const k=(48-dist)/2;positions[i][0]+=dx/dist*k;positions[i][1]+=dy/dist*k;positions[j][0]-=dx/dist*k;positions[j][1]-=dy/dist*k}for(const v of [positions[i],positions[j]]){v[0]=Math.max(35,Math.min(1145,v[0]));v[1]=Math.max(115,Math.min(505,v[1]))}}
 const colors={support:'#3b8d6c',counter:'#c76352',ambivalent:'#b79841',outside:'#89918c',open:'#64878e'};
 const nodes=shown.map((e,i)=>{const [x,y]=positions[i],d=role(e),hidden=worldAssumption&&mode==='present'&&e.year>worldYear,roleKey=d?.role||'open',radius=d?18+d.weight*3:23;return `<g class="diagram-event board-role-${roleKey}" role="button" tabindex="0" data-lens-focus="${esc(e.id)}" aria-label="${hidden?'Erwartung ist kein Rückblick':esc(spurDate(e)+' · '+e.title)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><title>${hidden?'Spätere Spur: noch nicht geschehen':esc(spurDate(e)+' · '+e.title+(d?' · '+d.reason:''))}</title><circle r="${radius+3}" fill="${colors[roleKey]}"/>${e.image&&!hidden?`<svg x="-${radius}" y="-${radius}" width="${radius*2}" height="${radius*2}" viewBox="0 0 60 60"><defs><clipPath id="nodeClip${i}"><circle cx="30" cy="30" r="30"/></clipPath></defs><image href="${esc(imageSrc(e.image))}" width="60" height="60" preserveAspectRatio="xMidYMid slice" clip-path="url(#nodeClip${i})"/></svg>`:`<circle r="${radius}" fill="#f4ecda"/>`}<text class="diagram-number" text-anchor="middle" y="4">${hidden?'?':i+1}</text><text class="diagram-hover" text-anchor="middle" y="-36">${hidden?'Zukunft offen':esc(e.title.length>55?e.title.slice(0,53)+'…':e.title)}</text></g>`}).join('');
 return `<figure class="world-scene semantic-board schematic-scene"><div class="diagram-topline"><span>${n} datierte Spuren${periodCompare?' · Vergleichszeitraum':centurySelection!==null?' · Jahrhundertauswahl':worldAll?' · gesamte Zeit':' · gewähltes Zeitfenster'} · ${esc(activeReading()?.name||'Erster Entwurf')}</span><a href="#interpretationSettings">${anchor?'Setzung ändern':'Ziel / Perspektive setzen'} ↗</a></div><svg viewBox="0 0 1180 580" role="group" aria-label="${esc(WORLD_READINGS[mode].short)}: räumliches Schaubild">${worldAssumption?wholeFormBackdrop(mode):''}<g class="diagram-structure">${bg}</g>${nodes}</svg>${undatedOverview(items)}<p class="diagram-hover-description" aria-live="polite">Bildpunkt berühren oder mit Tab auswählen: Titel anzeigen. Anklicken: untersuchen.</p><figcaption>${caption} <span>Bildpunkte anklicken: Quelle und Deutung. Farben: grün Beitrag, rot Gegenbefund, gold mehrdeutig, grau randständig, blau offen. Kleine Verschiebungen vermeiden Überlagerungen.</span></figcaption></figure>`;
}

WORLD_READINGS.direction.action='Begründete Zieldeutung anzeigen';
WORLD_READINGS.direction.mechanism='Zeitfolge und Zielbewertung sind getrennte Dimensionen: Eine spätere Spur ist nicht automatisch ein Fortschritt.';
PERSPECTIVE_INTROS.medieval.transfer='Der Heilshorizont steht über dem irdischen Geschehen. Ereignisse laufen in zeitlicher Reihenfolge nach rechts. Erst eine begründete Einordnung rückt eine Spur zum angenommenen Heil oder davon weg. Das räumliche Verhältnis stellt deine Deutung dar; es beweist keinen göttlichen Plan.';
PERSPECTIVE_INTROS.direction.limit='Die gestrichelte Aufstiegskurve stellt eine Behauptung zur Prüfung. Ohne begründete Einordnung steigen Ereignisse nicht mit ihrem Datum auf. Die vertikale Position ist deine Wertung nach einem Massstab, keine Messung von Freiheit.';
PERSPECTIVE_INTROS.egypt.transfer='Die benannte Ordnung steht im Zentrum. Ereignisse umgeben sie zunächst ohne Wertung. Begründete Zuordnungen verändern die Nähe zu dieser Ordnung. Die Umlaufposition dient der Übersicht und beweist keinen historischen Zyklus.';
PERSPECTIVE_INTROS.layers.transfer='Die Bildpunkte beginnen als datierte Vorgänge auf der Ereignisebene. Wähle im Popup einen ergänzenden Untersuchungsschwerpunkt: Ereignis, Entwicklung oder lange Dauer. Die Spur wechselt die Ebene. Diese Position sagt, was du untersuchst; sie misst keine Laufzeit.';
PERSPECTIVE_INTROS.recurrence.transfer='Die Spirale ordnet Winkel nach der gewählten Umlauflänge und den Abstand vom Zentrum nach der zeitlichen Reihenfolge. Verändere die Umlauflänge und beobachte die wechselnden Nachbarschaften. Prüfe dann an Quellen, ob ein gemeinsames Merkmal über die optische Nähe hinaus trägt.';
PERSPECTIVE_INTROS.recurrence.limit='Die Spirale zeigt eine zeitliche Setzung. Sie beweist weder Nietzsches ewige Wiederkunft noch ein historisches Gesetz. Ähnlichkeiten, Unterschiede und Ursachen benötigen eine eigenständige Untersuchung.';
for(const key of Object.keys(CONCRETE_READINGS))CONCRETE_READINGS[key].guide=[PERSPECTIVE_INTROS[key].transfer,'Jeder Bildpunkt öffnet eine Spur. Grün, Rot, Gold und Grau kennzeichnen begründete Beiträge, Gegenbefunde, Mehrdeutigkeit und Randständigkeit; Blau bedeutet offen.','Die Anordnung gehört zum Unterrichtsexperiment. Der Quellenbefund und deine Deutung bleiben voneinander zu unterscheiden.'];

const diagramTeaching={};
const DIAGRAM_LESSONS={
 medieval:{question:'Ist ein Klimavertrag Teil einer Heilsgeschichte?',labels:['Verantwortung für die Schöpfung','Politisches Handeln mit offenem Ausgang'],short:'Paris 2015',a:'Glaubensannahme',b:'Historischer Befund'},
 egypt:{question:'Bewahrt derselbe Vertrag eine Ordnung – oder verändert er sie?',labels:['Lebensbedingungen bewahren','Bestehende Energienutzung bewahren'],short:'Paris 2015',a:'Als erhaltenswert gesetzt',b:'Verhältnis des Vertrags dazu'},
 direction:{question:'Warum ist 1971 unter einem Ziel ein Fortschritt und unter einem anderen noch kein Beleg?',labels:['Politische Gleichberechtigung','Wirtschaftliche Gleichheit'],short:'Frauenstimmrecht 1971',a:'Gewähltes Ziel',b:'Was der Befund dazu trägt'},
 memoria:{question:'Was erzählt eine Erinnerung an 1971: den Erfolg oder den langen Ausschluss?',labels:['Den Erfolg erinnern','Den Ausschluss erinnern'],short:'Frauenstimmrecht 1971',a:'Erinnerungsfrage',b:'Bedeutung desselben Ereignisses'},
 materialism:{question:'Welche Bedingungen liegen zwischen einem Klimaziel und seiner Umsetzung?',labels:['Technische Möglichkeiten','Verfügung und Interessen'],short:'Paris 2015',a:'Gewählte Untersuchungsfrage',b:'Daran zu prüfender Zusammenhang'},
 layers:{question:'Warum hat ein Klimabeschluss ein Datum, der Wandel aber mehrere Dauern?',labels:['Beschluss datieren','Umsetzung und Bedingungen unterscheiden'],short:'Paris 2015',a:'Untersuchungsumfang',b:'Verschiedene Zeitebenen'},
 present:{question:'Was verändert sich, wenn du 1971 noch nicht kennst?',labels:['Standpunkt 1970','Heutiger Rückblick'],short:'Frauenstimmrecht 1971',a:'Standpunkt der Betrachtung',b:'Bekanntes Ergebnis oder offene Zukunft'},
 recurrence:{question:'Revolution in Frankreich und Haiti: Wiederholung oder begrenzte Ähnlichkeit?',labels:['Gemeinsamen Freiheitsanspruch suchen','Versklavung und Kolonialherrschaft prüfen'],short:'Haiti 1791–1804',a:'Vergleichskriterium',b:'Reichweite der Ähnlichkeit'}
};
function instructionalDiagramHtml(){
 const mode=representation,d=DIAGRAM_LESSONS[mode],c=CONCRETE_READINGS[mode],choice=concreteChoice[mode]||0,v=c.choices[choice],e=byId(c.event);
 const wrap=(value,x,y,width=36,cls='')=>{const words=value.split(/\s+/);let lines=[],line='';for(const w of words){if((line+' '+w).trim().length>width&&line){lines.push(line);line=w}else line=(line+' '+w).trim()}if(line)lines.push(line);return `<text x="${x}" y="${y}" class="${cls}">${lines.map((l,i)=>`<tspan x="${x}" dy="${i?'1.25em':0}">${esc(l)}</tspan>`).join('')}</text>`};
 const event=(x,y,sub=d.short)=>`<g role="button" tabindex="0" data-lesson-source="${esc(e.id)}" aria-label="${esc(e.title)} – Quelle öffnen">${e.image?`<image href="${esc(imageSrc(e.image))}" x="${x-43}" y="${y-43}" width="86" height="86" preserveAspectRatio="xMidYMid slice"/>`:`<circle cx="${x}" cy="${y}" r="35" fill="#e3dfca"/>`}${wrap(sub,x,y+64,28,'lesson-event-name')}</g>`;
 let drawing='';
 if(mode==='direction'){
 drawing='<path d="M100 335H820M120 335V110"/>'+wrap('Späteres Datum →',650,375,26)+wrap('Beitrag zum Ziel ↑',135,100,30)+wrap(d.labels[choice],460,55,40,'lesson-goal');
 drawing+=event(480,choice?290:170)+wrap(choice?'Beleg reicht für dieses Ziel noch nicht.':'Erweiterung politischer Rechte: ein belegbarer Beitrag.',670,choice?245:150,23,'lesson-annotation')+`<path class="lesson-inference" d="M535 ${choice?290:170}H650"/>`;
 }else if(mode==='medieval'){
 drawing=wrap(choice?'Offener politischer Ausgang':'Verantwortung für die Schöpfung',450,55,48,'lesson-goal')+'<path class="lesson-inference" d="M450 180V90"/>'+event(450,245)+wrap(choice?'Ziele und Folgen untersuchen; kein Heilsplan vorausgesetzt.':'Religiöse Bedeutung wird hinzugefügt. Der Vertrag beweist keinen Heilsplan.',175,160,25,'lesson-annotation')+wrap('Gestrichelt = interpretierte Beziehung, nicht belegte göttliche Führung.',665,180,25);
 }else if(mode==='egypt'){
 drawing='<ellipse cx="360" cy="230" rx="170" ry="130"/>'+wrap(d.labels[choice],360,218,24,'lesson-goal')+event(choice?760:610,235)+`<path class="lesson-inference" d="M${choice?710:560} 230H535"/>`+wrap(choice?'Veränderung dieser gesetzten Ordnung':'Versuch, diese gesetzte Ordnung zu bewahren',choice?750:620,100,26,'lesson-annotation')+wrap('Heutige Analogie zur Frage nach Ordnung; keine Gleichsetzung mit Maʿat.',70,375,86);
 }else if(mode==='memoria'){
 drawing='<ellipse cx="450" cy="220" rx="250" ry="145"/>'+wrap(choice?'Erinnerung an Ausschluss':'Erinnerung an erkämpfte Rechte',450,55,40,'lesson-goal')+event(450,220)+wrap(choice?'Der lange Zeitraum ohne diese Rechte rückt in den Vordergrund.':'Der erreichte Schritt und die handelnden Menschen rücken in den Vordergrund.',150,150,22,'lesson-annotation')+wrap('Datum unverändert. Bedeutung und Auswahl ändern sich.',750,165,22,'lesson-annotation');
 }else if(mode==='materialism'){
 drawing=event(450,100)+wrap('Politisches Ziel',450,40,24,'lesson-goal')+'<path class="lesson-inference" d="M420 180L240 275M480 180L670 275"/>'+wrap('Technik · Anlagen · Wissen',230,325,28,choice?'':'lesson-goal')+wrap('Eigentum · Entscheidungen · Kosten',680,325,26,choice?'lesson-goal':'')+wrap(choice?'Wer kann den Umbau durchsetzen – und wer trägt seine Kosten?':'Welche Mittel ermöglichen oder begrenzen den Umbau?',450,220,55,'lesson-annotation');
 }else if(mode==='layers'){
 drawing='<path d="M210 125H825M210 235H825M210 345H825"/>'+wrap('Ereignis',55,120,17)+wrap('Entwicklung',55,230,17)+wrap('Bedingungen',55,340,17)+wrap('2015: Vertrag angenommen',460,110,45,'lesson-goal');
 if(choice)drawing+=wrap('Umbau von Anlagen: konkrete Dauer untersuchen',500,218,40,'lesson-goal')+wrap('Klima und Infrastrukturen: andere Zeiträume prüfen',500,328,44,'lesson-goal');else drawing+=wrap('Diese Ebenen beantwortet das Beschlussdatum nicht.',500,270,43,'lesson-annotation');
 }else if(mode==='present'){
 drawing='<path d="M450 100V360M75 290H820"/>'+wrap(choice?'Rückblick von heute':'Standpunkt 1970',450,55,40,'lesson-goal')+wrap('Was war bekannt?',205,105,25)+wrap(choice?'Ergebnis bekannt':'Zukunft noch offen',660,105,28,'lesson-goal');
 drawing+=choice?event(660,220):wrap('1971: Ergebnis noch nicht bekannt. Hoffnung ist kein Wissen über den Ausgang.',650,195,29,'lesson-annotation');drawing+=wrap('Erwartungen einer damaligen Person müssen durch zeitgenössische Quellen belegt werden.',205,180,28);
 }else{
 drawing=wrap('Frankreich · 1789',215,105,28,'lesson-goal')+event(700,230)+wrap(choice?'Versklavung und Kolonialherrschaft unterscheiden die Kontexte.':'Freiheitsansprüche verbinden die Vergleichsfrage.',220,185,30,'lesson-annotation')+`<path ${choice?'class="lesson-inference"':''} d="M350 235H640"/>`+wrap(choice?'≠ gleicher Verlauf':'Vergleich unter einem Merkmal',480,210,27,'lesson-goal')+wrap('Kein Nachweis ewiger Wiederkunft. Ähnlichkeit erklärt noch keine gemeinsame Ursache.',450,370,82);
 }
 return `<section class="instructional-diagram" aria-label="Angeleitetes Schaubild"><h3>${esc(d.question)}</h3><div class="lesson-switch"><span>1 · Perspektive setzen</span>${d.labels.map((label,i)=>`<button data-lesson-choice="${i}" aria-pressed="${choice===i}">${esc(label)}</button>`).join('')}</div><svg viewBox="0 0 900 420" role="group" aria-label="${esc(d.question)}"><g class="lesson-drawing">${drawing}</g></svg><div class="lesson-reading"><p><strong>2 · So wird der Befund gelesen:</strong> ${esc(v.claim)}</p><p><strong>3 · Hier endet der Beleg:</strong> ${esc(v.check)}</p></div><p class="lesson-status">Ausgearbeitetes Unterrichtsbeispiel. Bilder illustrieren die verlinkte Spur und belegen die Deutung nicht selbst; Bildherkunft per Klick. Deine eigenen Entwürfe werden nicht verändert.</p></section>`;
}
function installDiagramLesson(root,open){
 const target=root.querySelector('#interpretationExperiment'),own=target.querySelector('.schematic-scene');if(!own)return;
 const mode=representation,lesson=document.createElement('div');lesson.className='diagram-lesson-host';lesson.innerHTML=instructionalDiagramHtml();target.prepend(lesson);
 const switcher=document.createElement('div');switcher.className='diagram-reading-tabs';switcher.innerHTML='<button data-diagram-view="guided">Schaubild verstehen</button><button data-diagram-view="own">Mit allen Spuren arbeiten</button>';target.prepend(switcher);
 const activate=value=>{diagramTeaching[mode]=value;const guided=value!=='own';lesson.hidden=!guided;own.hidden=guided;root.querySelectorAll('.world-controls,.world-assumption,.world-cycle').forEach(el=>el.hidden=guided);switcher.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.diagramView===value)));};
 switcher.querySelectorAll('button').forEach(b=>b.onclick=()=>activate(b.dataset.diagramView));activate(diagramTeaching[mode]||'guided');
 const wire=()=>{lesson.querySelectorAll('[data-lesson-choice]').forEach(b=>b.onclick=()=>{concreteChoice[mode]=Number(b.dataset.lessonChoice);lesson.innerHTML=instructionalDiagramHtml();wire()});lesson.querySelectorAll('[data-lesson-source]').forEach(b=>{b.onclick=()=>openEvent(b.dataset.lessonSource);b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();b.onclick()}}});};wire();
 root.querySelectorAll('a[href="#interpretationSettings"]').forEach(a=>a.onclick=e=>{e.preventDefault();activate('own');open('settings')});
}

const WHOLE_VIEW_FORMS={
 medieval:{title:'Heilsgeschichte',subtitle:'Ursprung → Weltzeit → Vollendung',icon:'M8 28H64V13L94 35 64 57V42H8Z'},
 direction:{title:'Fortschritt',subtitle:'Zielrichtung mit Gegenverläufen',icon:'M8 54Q45 54 82 13M65 14L84 11 83 30M42 43Q63 48 85 60'},
 egypt:{title:'Ordnung & Erneuerung',subtitle:'Kreislauf um eine gültige Ordnung',icon:'M80 23A30 24 0 1 0 80 48M80 23L65 23M80 23L81 8'},
 recurrence:{title:'Wiederkehr',subtitle:'Spirale: Ähnlichkeit und Differenz',icon:'M50 35C36 20 65 13 73 34S44 68 23 47 26 1 59 6 101 60 74 67'},
 layers:{title:'Zeitschichten',subtitle:'Verschiedene Dauern gleichzeitig',icon:'M8 17H92M8 35H92M8 53H92M20 11V23M42 11V23M65 11V23M18 29H53M35 47H87'},
 materialism:{title:'Materialismus',subtitle:'Produktion, Verfügung, Konflikte',icon:'M50 8L90 35 50 62 10 35ZM50 8V62M10 35H90'},
 present:{title:'Erlebte Zeit',subtitle:'Erinnern · Gegenwart · Erwarten',icon:'M30 35a20 24 0 1 0 0 .1M50 35a20 24 0 1 0 0 .1M70 35a20 24 0 1 0 0 .1'},
 memoria:{title:'Erinnerungsgefüge',subtitle:'Soziale und kulturelle Beziehungen',icon:'M37 35a25 25 0 1 0 0 .1M63 35a25 25 0 1 0 0 .1M37 35H63'}
};
function wholeFormBackdrop(mode){const shapes={
 medieval:'<path d="M65 245H890V170L1120 320 890 470V395H65Z" fill="#dfd0ad"/><path d="M1070 145V490" stroke="#967547" stroke-width="4"/><text x="1090" y="130">Vollendung?</text><text x="65" y="220">Ursprung</text>',
 direction:'<path d="M75 420Q590 440 1050 110L1040 165 1120 65 995 80 1030 103Q560 355 75 355Z" fill="#d1ddc4"/><path d="M400 350Q750 470 1100 510M400 350Q780 320 1100 300" fill="none" stroke="#c6a47a" stroke-width="7"/>',
 egypt:'<ellipse cx="590" cy="295" rx="445" ry="210" fill="#dfcf9c"/><ellipse cx="590" cy="295" rx="280" ry="125" fill="#f6f2e8"/><path d="M885 135L960 135 933 70Z" fill="#a4853c"/><path d="M295 455L220 455 247 520Z" fill="#a4853c"/>',
 memoria:'<ellipse cx="435" cy="295" rx="320" ry="205" fill="#b6ccbe" fill-opacity=".55"/><ellipse cx="735" cy="295" rx="320" ry="205" fill="#d3be97" fill-opacity=".55"/><path d="M145 295Q590 80 1035 295M145 295Q590 500 1035 295" fill="none" stroke="#8aa296" stroke-width="4"/>',
 materialism:'<path d="M235 145L590 75 935 145 1080 290 935 425 590 505 235 425 100 290Z" fill="#d6ded0"/><path d="M235 145L935 425M935 145L235 425M235 145H935V425H235Z" fill="none" stroke="#81937c" stroke-width="9"/>',
 layers:'<path d="M185 100H1130V210H185Z" fill="#dce5d5"/><path d="M185 250H1130V350H185Z" fill="#ded8b7"/><path d="M185 400H1130V500H185Z" fill="#d4b999"/>',
 present:'<ellipse cx="300" cy="295" rx="265" ry="200" fill="#c4d5c9"/><ellipse cx="590" cy="295" rx="105" ry="230" fill="#d6bd87" fill-opacity=".8"/><ellipse cx="885" cy="295" rx="250" ry="200" fill="#e2e1d4"/><path d="M80 295H1100" stroke="#9aab9c" stroke-width="5"/><text x="590" y="88" text-anchor="middle">GEGENWART</text>',
 recurrence:''};let shape=shapes[mode]||'';
 if(mode==='recurrence'){let p='';for(let i=0;i<=240;i++){const a=i/240*4.5*Math.PI,r=35+i/240*200;p+=(i?'L':'M')+(590+Math.cos(a)*r*1.9)+' '+(295+Math.sin(a)*r)}shape=`<path d="${p}" fill="none" stroke="#d1bd8d" stroke-width="28"/>`}
 return `<g class="whole-form-backdrop" aria-hidden="true">${shape}</g>`;
}
function undatedOverview(items){const entries=items.filter(e=>!Number.isFinite(e.year));return entries.length?`<div class="overview-concepts"><span>Begriffe ohne Zeitposition:</span>${entries.map(e=>`<button data-lens-focus="${esc(e.id)}">${esc(e.title)}</button>`).join('')}</div>`:''}
function installWholeViewNavigation(root){
 const nav=document.createElement('nav');nav.className='whole-view-navigation';nav.setAttribute('aria-label','Gesamtform wählen');
 nav.innerHTML=Object.entries(WHOLE_VIEW_FORMS).map(([key,d])=>`<button data-whole-view="${key}" aria-pressed="${representation===key}" title="${esc(d.subtitle)}"><svg viewBox="0 0 100 75" aria-hidden="true"><path d="${d.icon}"/></svg><span>${d.title}</span></button>`).join('');
 root.insertBefore(nav,root.querySelector('.mode-heading'));
 nav.querySelectorAll('[data-whole-view]').forEach(b=>b.onclick=()=>{worldAll=true;switchRepresentation(b.dataset.wholeView)});
 const heading=root.querySelector('.mode-heading h2');heading.textContent=WHOLE_VIEW_FORMS[representation].subtitle;
}

const RANDOM_HEIL_KEY='telos-medieval-random';
const RANDOM_HEIL_MODELS=[
 {id:'peace',name:'Vollendung als Friede',goal:'Dauerhafter Friede in einer versöhnten Schöpfung',standpoint:'Didaktisch entworfene christliche Friedensperspektive; keine Zuschreibung an alle Christinnen und Christen.',necessity:'Vollendung wird religiös erhofft. Politische Friedensschlüsse können darauf bezogen werden, garantieren sie aber nicht.',counter:'Wird jede neue Gewalt nachträglich zum notwendigen Umweg erklärt, verliert die Deutung ihre Prüfbarkeit.'},
 {id:'justice',name:'Vollendung als Gerechtigkeit',goal:'Gerechtigkeit für Lebende und Tote im göttlichen Gericht',standpoint:'Didaktische Perspektive, die vom Unrecht an Opfern ausgeht. Sie ist keine rekonstruierte Stimme einer bestimmten historischen Person.',necessity:'Das Gericht ist Glaubensannahme, kein aus historischen Erfolgen abgeleiteter Endzustand. Irdischer Sieg ist kein Beweis göttlicher Gerechtigkeit.',counter:'Prüfe, ob Leidende nur als Mittel einer Heilserzählung erscheinen und ihre eigenen Stimmen dadurch verschwinden.'},
 {id:'redemption',name:'Vollendung als Erlösung',goal:'Erlösung von Schuld, Leid und Tod',standpoint:'Didaktisch formulierte christliche Hoffnungsperspektive. Menschen ausserhalb dieses Glaubens müssen ihr Ziel nicht teilen.',necessity:'Erlösung wird als göttliches Handeln angenommen. Technischer oder wirtschaftlicher Fortschritt verwirklicht sie nicht automatisch.',counter:'Wenn das Ziel jede mögliche Ereignisfolge gleich gut erklärt, trägt es eine Sinngebung, aber keine unterscheidende historische Erklärung.'},
 {id:'resurrection',name:'Vollendung als Auferstehung',goal:'Auferstehung und ein Leben jenseits des Todes',standpoint:'Didaktische Perspektive christlichen Totengedenkens; keine Aussage darüber, was alle Trauernden glauben.',necessity:'Die erwartete Vollendung überschreitet die historische Beobachtung. Gedenken hält diese Hoffnung gegenwärtig, belegt ihre Erfüllung jedoch nicht.',counter:'Unterscheide die belegbare Erinnerungspraxis von der Glaubensaussage. Eine Quelle für die Hoffnung ist kein Beweis ihres Gegenstands.'},
 {id:'community',name:'Vollendung als Gemeinschaft',goal:'Versöhnte Gemeinschaft mit Gott und den Mitmenschen',standpoint:'Didaktische christliche Gemeinschaftsperspektive, deren Ein- und Ausschlüsse ausdrücklich zu untersuchen sind.',necessity:'Die Vollendung wird erhofft; keine Kirche und kein Staat kann allein durch seine Existenz als ihre Verwirklichung gelten.',counter:'Wer wird aus der behaupteten Gemeinschaft ausgeschlossen? Prüfe, ob institutionelle Macht vorschnell mit Heil gleichgesetzt wird.'}
];
const RANDOM_HEIL_PERIODS=[{year:2026,window:130,all:true},{year:1200,window:500,all:false},{year:1750,window:250,all:false},{year:1975,window:50,all:false}];
function generatedHeilMeta(profile=activeReading('medieval')){try{const x=JSON.parse(profile?.notes?.[RANDOM_HEIL_KEY]||'null');return x&&typeof x.generatedAt==='string'&&x.generatedAt.length<=40&&Number.isFinite(Date.parse(x.generatedAt))&&Number.isInteger(x.revision)&&x.revision>0&&RANDOM_HEIL_MODELS.some(m=>m.id===x.model)&&RANDOM_HEIL_PERIODS.some(p=>p.year===x.year&&p.window===x.window&&p.all===x.all)?x:null}catch{return null}}
function applyHeilParameters(meta){worldYear=meta.year;worldWindow=meta.window;worldAll=meta.all;worldAssumption=true;worldAssumptions.medieval=true;visibleCategories=new Set(LANES.map(l=>l[0]));onlyOwn=false;const search=$('#search');if(search)search.value='';$$('[data-category]').forEach(el=>el.checked=true);const status=$('#categoryStatus');if(status)status.textContent=LANES.length+' von '+LANES.length+' Kategorien sichtbar';$('#viewAll')?.classList?.add('active');$('#viewOwn')?.classList?.remove('active');}
let lastRestoredHeil='';
function randomHeilDraft(random=Math.random){
 if(representation!=='medieval')return;
 captureReadings();const bucket=ensureReading('medieval'),old=activeReading(),previous=generatedHeilMeta(old);
 const candidates=RANDOM_HEIL_MODELS.filter(m=>m.id!==previous?.model),model=candidates[Math.min(candidates.length-1,Math.floor(random()*candidates.length))],period=RANDOM_HEIL_PERIODS[Math.min(RANDOM_HEIL_PERIODS.length-1,Math.floor(random()*RANDOM_HEIL_PERIODS.length))];
 let p=previous?old:bucket.profiles.find(x=>generatedHeilMeta(x));
 if(!p){if(bucket.profiles.length>=30)throw Error('Der Arbeitsstand enthält bereits 30 Entwürfe. Nutze einen bestehenden Zufallsentwurf oder einen neuen Arbeitsstand.');p={id:uid(),name:'',notes:{},assignments:{},decisions:{}};bucket.profiles.push(p)}
 const meta={model:model.id,...period,generatedAt:new Date().toISOString(),revision:(generatedHeilMeta(p)?.revision||0)+1};
 p.name='Zufallsentwurf · '+model.name;p.notes={};for(const field of ['goal','standpoint','necessity','counter'])p.notes[telosKey('medieval',field)]=model[field];p.notes[RANDOM_HEIL_KEY]=JSON.stringify(meta);p.assignments={};p.decisions={};
 loadReading('medieval',p.id);applyHeilParameters(meta);lastRestoredHeil=p.id;readingComparison='';worldSheet='';save();return meta;
}
function randomHeilHtml(){if(representation!=='medieval')return '';const p=activeReading(),m=generatedHeilMeta(p),model=m&&RANDOM_HEIL_MODELS.find(x=>x.id===m.model),changed=m&&['goal','standpoint','necessity','counter'].some(f=>state.notes[telosKey('medieval',f)]!==model[f]);
 const changedView=m&&(worldYear!==m.year||worldWindow!==m.window||worldAll!==m.all||!worldAssumption||visibleCategories.size!==LANES.length||onlyOwn||($('#search')?.value||''));
 return `<section class="random-heil"><div><strong>${m?'ZUFALLSENTWURF · '+esc(model.name):'Einen Heilshorizont erproben'}</strong><button id="randomHeilButton">${m?'Anderen Zufallsentwurf einsetzen ↻':'Zufallsentwurf einsetzen ↻'}</button><a href="#interpretationSettings">Entwurf bearbeiten ↗</a></div>${m?`<p>${changed||changedView?'Manuell angepasst · ursprüngliche Zufallssetzungen unten dokumentiert.':'Die folgenden Setzungen wurden zufällig zusammengestellt.'} Didaktischer Entwurf, keine historische Quelle und keine Tatsachenbehauptung.</p><p><strong>Erzeugter Zeitraum:</strong> ${m.all?'gesamte Zeit':yr(m.year-m.window)+' bis '+yr(m.year+m.window)} · Standjahr ${yr(m.year)} · alle Kategorien.</p><details><summary>Sämtliche gesetzten Parameter anzeigen</summary><dl><dt>Erstellt</dt><dd>${esc(m.generatedAt.replace('T',' · ').replace(/\.\d+Z$/,' UTC'))} · Variante ${m.revision}</dd><dt>Heilsvorstellung</dt><dd>${esc(model.goal)}</dd><dt>Perspektive</dt><dd>${esc(model.standpoint)}</dd><dt>Verlaufsannahme</dt><dd>${esc(model.necessity)}</dd><dt>Gegenprüfung</dt><dd>${esc(model.counter)}</dd><dt>Zeitraum</dt><dd>${m.all?'Gesamte Zeit: alle datierten Spuren des Bestands':yr(m.year-m.window)+' bis '+yr(m.year+m.window)} · Standjahr ${yr(m.year)} · Fenster ± ${m.window} Jahre${m.all?' (bei Gesamtsicht nicht angewendet)':''}</dd><dt>Bestand und Filter</dt><dd>Alle sechs Kategorien; vorhandene und eigene Einträge; Suchfeld leer.</dd><dt>Darstellung</dt><dd>Heilsgeschichte; Heilshorizont eingeschaltet. Zeitfolge von links nach rechts, keine proportionalen Jahresabstände. Undatierte Begriffe separat.</dd><dt>Zuordnungen</dt><dd>Keine automatisch erfundenen Ereignisdeutungen: Rollen, Gewichte und Untersuchungsschwerpunkte dieses Zufallsentwurfs sind zunächst offen.</dd></dl><p>Der nächste Klick ersetzt diesen Zufallsentwurf einschliesslich seiner Bearbeitungen. Über «Voraussetzung & Entwürfe» kannst du ihn vorher kopieren. Andere Entwürfe bleiben erhalten.</p></details>`:'<p>Setzt ein zusammenhängendes Unterrichtsmodell mit Zeitraum und offengelegten Annahmen ein. Bestehende eigene Entwürfe bleiben erhalten.</p>'}<p id="randomHeilStatus" role="status"></p></section>`;
}

const RANDOM_CONCEPT_MODELS={
  "direction": [
    {
      "id": "participation",
      "name": "Politische Teilhabe",
      "fields": {
        "goal": "Gleichberechtigte politische Beteiligung",
        "standpoint": "Didaktische Perspektive bisher von politischen Rechten ausgeschlossener Menschen. Innerhalb dieser Gruppe sind Interessen nicht einheitlich.",
        "necessity": "Ein normativer Massstab, kein zwangsläufiger Geschichtsverlauf. Erweiterte Rechte können als Beiträge geprüft werden.",
        "counter": "Rechtliche Gleichheit kann mit tatsächlicher Ausschliessung zusammenbestehen. Prüfe beide Ebenen."
      }
    },
    {
      "id": "welfare",
      "name": "Materielle Sicherheit",
      "fields": {
        "goal": "Gesicherte Lebensgrundlagen für alle",
        "standpoint": "Didaktische Perspektive von Menschen mit unsicherer Versorgung; keine automatisch unterstellte Gruppenmeinung.",
        "necessity": "Verbesserungen sind an Versorgung, Zugang und Verteilung zu prüfen. Wachstum allein garantiert keine Sicherheit.",
        "counter": "Wessen Sicherheit wächst, wer trägt die Kosten? Prüfe Verteilungswirkungen und ökologische Folgen."
      }
    },
    {
      "id": "ecology",
      "name": "Ökologische Tragfähigkeit",
      "fields": {
        "goal": "Dauerhaft bewohnbare Lebensbedingungen",
        "standpoint": "Didaktische Perspektive, die langfristige Folgen für zukünftige Generationen mitbedenkt.",
        "necessity": "Das Ziel ist eine Setzung. Technische Neuerung bedeutet nicht automatisch weniger Ressourcenverbrauch.",
        "counter": "Eine Verbesserung an einem Ort kann Belastungen verlagern. Benenne räumliche und zeitliche Grenzen des Urteils."
      }
    }
  ],
  "egypt": [
    {
      "id": "provision",
      "name": "Verlässliche Versorgung",
      "fields": {
        "order": "Verlässliche Versorgung und gemeinsame Instandhaltung",
        "authority": "Gedankenexperiment aus Sicht einer auf Versorgung angewiesenen Gemeinschaft; Herrschaft und Betroffene können Erhaltung verschieden bewerten.",
        "change": "Reparaturen und gesicherter Zugang gelten als mögliche Erneuerung; veränderte Verfügungsrechte wären zusätzlich als Wandel zu untersuchen.",
        "counter": "Die heutige Analogie zur Ordnungserhaltung ist keine Gleichsetzung mit Maʿat. Religion und Herrschaft verlangen eigene Quellen."
      }
    },
    {
      "id": "property",
      "name": "Überlieferte Besitzordnung",
      "fields": {
        "order": "Fortbestand bestehender Besitz- und Nutzungsrechte",
        "authority": "Didaktischer Blick einer besitzenden Institution. Abhängige oder ausgeschlossene Menschen können der Ordnung widersprechen.",
        "change": "Kontinuität von Ansprüchen steht gegen Veränderungen des Zugangs. Eine neue Technik kann alte Verhältnisse stützen.",
        "counter": "Erhaltung ist nicht schon Gerechtigkeit. Der Begriff Maʿat darf bestehendes Eigentum nicht nachträglich legitimieren."
      }
    },
    {
      "id": "ritual",
      "name": "Rituelle Erneuerung",
      "fields": {
        "order": "Wiederkehrende Pflege einer religiösen Ordnung",
        "authority": "Didaktisch gesetzter Blick einer religiösen Gemeinschaft; ihre tatsächlichen Praktiken und innere Vielfalt bleiben zu belegen.",
        "change": "Wiederkehrende Handlungen können Ordnung erneuern, obwohl ihre Ausführung und Bedeutung sich wandeln.",
        "counter": "Ähnliche Rituale verschiedener Zeiten belegen weder identische Glaubensinhalte noch ein zeitloses ägyptisches Weltbild."
      }
    }
  ],
  "materialism": [
    {
      "id": "work",
      "name": "Arbeit und Verfügung",
      "fields": {
        "actors": "Arbeitende und Eigentümer unter Bedingungen industrieller Produktion",
        "control": "Zu prüfen sind Verfügungsrechte über Anlagen, Arbeitszeit und Ertrag; keine Rechte werden ohne Beleg unterstellt.",
        "mechanism": "Verfügung über Arbeitsmittel prägt Handlungsmöglichkeiten",
        "counter": "Prüfe zusätzlich Organisation, Recht und Überzeugungen. Eine materielle Bedingung erklärt noch keine einzelne Entscheidung."
      }
    },
    {
      "id": "infrastructure",
      "name": "Infrastruktur und Macht",
      "fields": {
        "actors": "Betreiber, Beschäftigte und Nutzer von Verkehrs- oder Energieanlagen",
        "control": "Wer kann investieren, Zugang gewähren und Kosten verteilen? Eigentum und tatsächliche Entscheidungsmacht getrennt prüfen.",
        "mechanism": "Infrastrukturinvestitionen verändern Abhängigkeiten",
        "counter": "Prüfe alternative Trassen, politische Entscheidungen und Widerstand. Die gebaute Lösung war nicht automatisch die einzig mögliche."
      }
    },
    {
      "id": "knowledge",
      "name": "Wissen als Produktionsmittel",
      "fields": {
        "actors": "Produzierende, Vermittler und Nutzer technischen Wissens",
        "control": "Zu untersuchen sind Ausbildung, Zugang zu Verfahren und Kontrolle ihrer wirtschaftlichen Nutzung.",
        "mechanism": "Kontrolle über Wissen beeinflusst Arbeit und Erträge",
        "counter": "Eine Erfindung beweist keine durchgesetzte Veränderung. Prüfe Anwendung, Verbreitung und mögliche Gegenwirkungen."
      }
    }
  ],
  "recurrence": [
    {
      "id": "revolutions",
      "name": "Freiheitsansprüche vergleichen",
      "fields": {
        "criterion": "Freiheitsansprüche gegen bestehende Herrschaft",
        "cases": "Französische Revolution 1789 und Haitianische Revolution 1791–1804; Quellen zu Trägern und Reichweite der Ansprüche vergleichen.",
        "difference": "Versklavung, koloniale Herrschaft und politische Rechte verlangen unterschiedliche Erklärungen.",
        "counter": "Wenn das gemeinsame Etikett Revolution entscheidende Unterschiede verdeckt, auf die Wiederholungsbehauptung verzichten."
      }
    },
    {
      "id": "media",
      "name": "Medienumbrüche vergleichen",
      "fields": {
        "criterion": "Veränderte Möglichkeiten, Wissen zu verbreiten",
        "cases": "Druck vor Gutenberg, europäischer Buchdruck und digitale Geschichtsbilder; Verfügbarkeit, Nutzung und Kontrolle jeweils belegen.",
        "difference": "Technik, Reichweite und politische Kontrolle unterscheiden sich. Ähnliche Funktionen sind keine identischen Ursachen.",
        "counter": "Die optische Gruppierung muss einem Wechsel der Umlauflänge standhalten: Gemeinsamkeiten müssen an Quellen erkennbar bleiben."
      }
    },
    {
      "id": "borders",
      "name": "Grenzen und Öffnungen",
      "fields": {
        "criterion": "Grenzen ordnen Zugehörigkeit und Handlungsspielräume",
        "cases": "Unabhängigkeit und Teilung 1947 sowie der Mauerfall 1989 als unterschiedlich gelagerte Fälle untersuchen.",
        "difference": "Staatsgründung, Teilung und Öffnung haben verschiedene Voraussetzungen und Folgen.",
        "counter": "Keine wiederkehrende Gesetzmässigkeit aus zwei Fällen ableiten. Prüfe auch Menschen, für die dieselbe Grenze etwas anderes bedeutete."
      }
    }
  ],
  "layers": [
    {
      "id": "transport",
      "name": "Verkehr in mehreren Dauern",
      "fields": {
        "aspect": "Verkehrsverbindungen zwischen See und Alpen",
        "process": "Datierte Brücken- und Bahnbauten von Veränderungen der Nutzung und Erreichbarkeit unterscheiden.",
        "structure": "Topographie und bestehende Verkehrsnetze als relativ dauerhafte Bedingungen prüfen; auch sie sind veränderlich.",
        "counter": "Ein langer Zeitraum darf die plötzlichen Folgen für einzelne Orte oder Gruppen nicht verdecken."
      }
    },
    {
      "id": "rights",
      "name": "Politische Rechte und Alltag",
      "fields": {
        "aspect": "Rechtliche Beteiligung und gelebte Teilhabe",
        "process": "Beschlussdaten mit der Entwicklung von Zugang, Organisation und tatsächlicher Beteiligung vergleichen.",
        "structure": "Soziale Normen und Institutionen als mögliche längerfristige Bedingungen untersuchen, nicht ungeprüft voraussetzen.",
        "counter": "Langsame Veränderung kann behauptet werden, obwohl ein bestimmter Entscheid für Betroffene einen unmittelbaren Bruch bedeutete."
      }
    },
    {
      "id": "climate",
      "name": "Klima, Technik und Politik",
      "fields": {
        "aspect": "Klimabeschlüsse und materielle Umsetzung",
        "process": "Vertragsdatum, Umbau von Anlagen und beobachtete Folgen gesondert datieren.",
        "structure": "Langlebige Infrastrukturen und Klimaprozesse als unterschiedliche Bedingungen prüfen.",
        "counter": "Ein politisches Ziel ist weder ein gemessener Effekt noch eine bereits abgeschlossene Entwicklung."
      }
    }
  ],
  "present": [
    {
      "id": "rights1970",
      "name": "Offene Zukunft 1970",
      "fields": {
        "person": "Befürworterin politischer Gleichberechtigung, Schweiz 1970",
        "knowledge": "Mögliche Informationen: damalige Debatten und frühere Erfahrungen. Konkretes Wissen nur anhand zeitgenössischer Zeugnisse zuschreiben.",
        "expectation": "Hoffnung auf Zustimmung und Sorge vor Ablehnung sind mögliche Erwartungen; keine davon wird einer realen Person ohne Quelle zugeschrieben.",
        "counter": "Das Ergebnis von 1971 darf nicht als damals bekanntes Wissen erscheinen."
      },
      "view": {
        "year": 1970,
        "window": 50,
        "all": false
      }
    },
    {
      "id": "climate2014",
      "name": "Offene Zukunft 2014",
      "fields": {
        "person": "An Klimaverhandlungen interessierte Person, 2014",
        "knowledge": "Zugang zu damaligen Nachrichten und Verhandlungspositionen prüfen; spätere Rückblicke davon trennen.",
        "expectation": "Mehrere mögliche Verhandlungsausgänge offenhalten. Die spätere Annahme eines Abkommens ist noch nicht bekannt.",
        "counter": "Weder der Vertrag von 2015 noch spätere Wirkungen dürfen als Gewissheit dieses Standpunkts gelten."
      },
      "view": {
        "year": 2014,
        "window": 25,
        "all": false
      }
    },
    {
      "id": "rail1850",
      "name": "Offene Zukunft 1850",
      "fields": {
        "person": "Bewohnerin eines Orts zwischen Zürich und Chur, 1850",
        "knowledge": "Welche Pläne, Nachrichten und bisherigen Verkehrswege waren ihr nachweislich bekannt? Der soziale Zugang zu Information bleibt offen.",
        "expectation": "Hoffnungen und Sorgen über neue Verkehrsverbindungen anhand damaliger Quellen suchen; keine Vorhersage des tatsächlichen Netzes.",
        "counter": "Die Bahneröffnungen von 1858–1859 und spätere wirtschaftliche Folgen gehören zum Rückblick."
      },
      "view": {
        "year": 1850,
        "window": 50,
        "all": false
      }
    }
  ],
  "memoria": [
    {
      "id": "workers",
      "name": "Erinnerung an Arbeit",
      "fields": {
        "group": "Ehemalige Beschäftigte eines Industriebetriebs",
        "practice": "Als Unterrichtsentwurf: ein Gespräch mit Fotografien und persönlichen Gegenständen. Eine tatsächlich gemeinsame Erinnerung muss erst belegt werden.",
        "selection": "Arbeitserfahrungen und betriebliche Veränderungen untersuchen; abweichende Erfahrungen innerhalb der Gruppe ausdrücklich suchen.",
        "counter": "Ein fehlendes Thema im Entwurf beweist kein Vergessen. Andere Interviews und schriftliche Überlieferungen vergleichen."
      }
    },
    {
      "id": "museum",
      "name": "Öffentliche Ortsgeschichte",
      "fields": {
        "group": "Kuratorisches Team eines Ortsmuseums",
        "practice": "Didaktischer Entwurf einer Ausstellung mit Objekten, Beschriftungen und Besucheransprache; keine Behauptung über ein bestimmtes Museum.",
        "selection": "Prüfen, wie Verkehr, Arbeit, Migration und lokale Selbstbilder ausgewählt werden könnten. Tatsächliche Auswahl an Ausstellungsquellen belegen.",
        "counter": "Wessen Überlieferung gelangt nicht ins Museum? Fehlende Repräsentation und fehlende Erinnerung sind nicht dasselbe."
      }
    },
    {
      "id": "family",
      "name": "Erinnern zwischen Generationen",
      "fields": {
        "group": "Eine Familie mit unterschiedlichen Generationserfahrungen",
        "practice": "Als Untersuchungssituation: gemeinsames Betrachten von Fotos, Erzählen und Widersprechen. Die Familie ist kein einheitliches Gedächtnis.",
        "selection": "Biographisch bedeutsame Ortswechsel und gesellschaftliche Veränderungen als mögliche Bezugspunkte prüfen.",
        "counter": "Wer besitzt Fotos, wer darf erzählen, wer widerspricht? Die angenommene Nähe einer Gruppe ersetzt keine Quellenprüfung."
      }
    }
  ]
};

const restoredRandomConcept={};
const randomConceptKey=mode=>(mode==='direction'?'telos-':'premise-')+mode+'-random';
const randomFieldKey=(mode,field)=>mode==='direction'?telosKey(mode,field):premiseKey(mode,field);
function randomConceptMeta(profile=activeReading(),mode=representation){
 if(mode==='medieval')return generatedHeilMeta(profile);
 try{const x=JSON.parse(profile?.notes?.[randomConceptKey(mode)]||'null'),model=RANDOM_CONCEPT_MODELS[mode]?.find(m=>m.id===x?.model);return model&&typeof x.generatedAt==='string'&&x.generatedAt.length<=40&&Number.isFinite(Date.parse(x.generatedAt))&&Number.isInteger(x.revision)&&x.revision>0&&Number.isInteger(x.year)&&x.year!==0&&x.year>=-100000&&x.year<=10000&&[25,50,130,250,500].includes(x.window)&&typeof x.all==='boolean'&&[25,50,100,200].includes(x.period)?x:null}catch{return null}
}
function applyRandomConcept(meta){if(representation==='medieval'){applyHeilParameters(meta);return}worldYear=meta.year;worldWindow=meta.window;worldAll=meta.all;worldPeriod=meta.period;worldAssumption=true;worldAssumptions[representation]=true;visibleCategories=new Set(LANES.map(l=>l[0]));onlyOwn=false;$('#search').value='';$$('[data-category]').forEach(el=>el.checked=true);$('#categoryStatus').textContent=LANES.length+' von '+LANES.length+' Kategorien sichtbar';$('#viewAll')?.classList?.add('active');$('#viewOwn')?.classList?.remove('active');}
function randomConceptDraft(random=Math.random){
 const mode=representation;if(mode==='medieval')return randomHeilDraft(random);
 captureReadings();const bucket=ensureReading(mode),old=activeReading(),previous=randomConceptMeta(old),pick=a=>a[Math.min(a.length-1,Math.floor(random()*a.length))],model=pick(RANDOM_CONCEPT_MODELS[mode].filter(m=>m.id!==previous?.model));
 let p=previous?old:bucket.profiles.find(x=>randomConceptMeta(x,mode));
 if(!p){if(bucket.profiles.length>=30)throw Error('Maximal 30 Entwürfe pro Ansatz. Nutze einen bestehenden Zufallsentwurf oder einen neuen Arbeitsstand.');p={id:uid(),name:'',notes:{},assignments:{},decisions:{}};bucket.profiles.push(p)}
 // Standpoint exercises require coherent dates. Other overviews use the full corpus or a modern time window.
 const view=model.view||pick([{year:2026,window:130,all:true},{year:1975,window:50,all:false}]);
 const meta={model:model.id,...view,period:pick([25,50,100,200]),generatedAt:new Date().toISOString(),revision:(randomConceptMeta(p,mode)?.revision||0)+1};
 if(mode==='recurrence')meta.all=true;
 p.name='Zufallsentwurf · '+model.name;p.notes=Object.fromEntries(Object.entries(model.fields).map(([k,v])=>[randomFieldKey(mode,k),v]));p.notes[randomConceptKey(mode)]=JSON.stringify(meta);p.assignments={};p.decisions={};loadReading(mode,p.id);applyRandomConcept(meta);restoredRandomConcept[mode]=p.id;readingComparison='';worldSheet='';save();return meta;
}
function prepareRandomConcept(){
 const mode=representation,p=activeReading(),meta=randomConceptMeta(p);
 if(profileBucket(mode).profiles.length===1&&p.name==='Erster Entwurf'&&!Object.values(profileNotes(mode)).some(v=>v.trim())&&!Object.keys(p.decisions).length&&!Object.keys(p.assignments).length){const categories=new Set(visibleCategories),own=onlyOwn,query=$('#search').value;randomConceptDraft();visibleCategories=categories;onlyOwn=own;$('#search').value=query;$$('[data-category]').forEach(el=>el.checked=categories.has(el.dataset.category));$('#categoryStatus').textContent=categories.size+' von '+LANES.length+' Kategorien sichtbar';return true}
 const restored=mode==='medieval'?lastRestoredHeil:restoredRandomConcept[mode];
 if(meta&&restored!==p.id){const categories=new Set(visibleCategories),own=onlyOwn,query=$('#search').value;applyRandomConcept(meta);visibleCategories=categories;onlyOwn=own;$('#search').value=query;$$('[data-category]').forEach(el=>el.checked=categories.has(el.dataset.category));$('#categoryStatus').textContent=categories.size+' von '+LANES.length+' Kategorien sichtbar';if(mode==='medieval')lastRestoredHeil=p.id;else restoredRandomConcept[mode]=p.id}
 return false;
}
function randomConceptHtml(){if(representation==='medieval')return randomHeilHtml();const mode=representation,m=randomConceptMeta(),model=m&&RANDOM_CONCEPT_MODELS[mode].find(x=>x.id===m.model),fields=mode==='direction'?TELOS_FIELDS:PREMISE_LABS[mode].fields;
 const edited=m&&(Object.entries(model.fields).some(([k,v])=>state.notes[randomFieldKey(mode,k)]!==v)||worldYear!==m.year||worldWindow!==m.window||worldAll!==m.all||!worldAssumption||visibleCategories.size!==LANES.length||onlyOwn||($('#search')?.value||'')||(mode==='recurrence'&&worldPeriod!==m.period));
 return `<section class="random-heil"><div><strong>${m?'ZUFALLSENTWURF · '+esc(model.name):'Zufallsentwurf für '+esc(WHOLE_VIEW_FORMS[mode].title)}</strong><button id="randomHeilButton">${m?'Anderen Zufallsentwurf einsetzen ↻':'Zufallsentwurf einsetzen ↻'}</button><a href="#interpretationSettings">Entwurf bearbeiten ↗</a></div>${m?`<p>${edited?'Manuell angepasst · die ursprünglichen Setzungen bleiben unten dokumentiert.':'Zufällig ausgewählter, zusammenhängender Unterrichtsentwurf.'} Keine historische Quelle und keine automatisch behauptete Gruppenmeinung.</p><p><strong>Erzeugter Zeitraum:</strong> ${m.all?'gesamte Zeit':yr(m.year-m.window)+' bis '+yr(m.year+m.window)} · Standjahr ${yr(m.year)} · alle Kategorien.${mode==='recurrence'?' Umlauf: '+m.period+' Jahre.':''}</p><details><summary>Sämtliche gesetzten Parameter anzeigen</summary><dl><dt>Erstellt</dt><dd>${esc(m.generatedAt)} · Variante ${m.revision}</dd>${fields.map(([key,label])=>`<dt>${esc(label)}</dt><dd>${esc(model.fields[key])}</dd>`).join('')}<dt>Zeitraum</dt><dd>${m.all?'Gesamte Zeit':yr(m.year-m.window)+' bis '+yr(m.year+m.window)} · Standjahr ${yr(m.year)} · Fenster ± ${m.window} Jahre${m.all?' (nicht angewendet)':''}</dd>${mode==='recurrence'?`<dt>Versuchsweiser Umlauf</dt><dd>${m.period} Jahre; gesetzter Darstellungsparameter, kein nachgewiesener Rhythmus.</dd>`:''}<dt>Bestand und Filter</dt><dd>Alle sechs Kategorien, vorhandene und eigene Einträge, Suchfeld leer.</dd><dt>Darstellung</dt><dd>${esc(WHOLE_VIEW_FORMS[mode].title)} · Modellannahme eingeschaltet. ${esc(WHOLE_VIEW_FORMS[mode].subtitle)}. Undatierte Begriffe separat; Abstände sind keine proportionalen Jahresmessungen.</dd><dt>Einordnungen</dt><dd>Rollen, Gewichte und Untersuchungsschwerpunkte bleiben zunächst offen. Der Vorschlag erzeugt keine Belege oder Ereignisbewertungen.</dd></dl><p>Der nächste Zufallsklick ersetzt diesen Zufallsentwurf einschliesslich Bearbeitungen. Du kannst ihn unter «Voraussetzung & Entwürfe» vorher kopieren; andere Entwürfe bleiben erhalten.</p></details>`:'<p>Passende Voraussetzungen und Zeitraum erzeugen; eigene ausgefüllte Entwürfe bleiben erhalten.</p>'}<p id="randomHeilStatus" role="status"></p></section>`;
}

WORLD_READINGS.present.action='Heutigen Rückblick zunächst geschlossen halten';
WORLD_READINGS.present.mechanism='Wähle ein Standjahr und eine Person. Prüfe links frühere Spuren als mögliche Wissensbezüge; formuliere rechts belegbare Erwartungen. Spätere Ereignisse werden getrennt als heutiger Rückblick geöffnet.';
