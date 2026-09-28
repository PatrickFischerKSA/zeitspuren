// Category selection applies to the shared corpus in every representation.
let visibleCategories=new Set(LANES.map(l=>l[0]));
function categoryVisible(e){return visibleCategories.has(e.lane||'ideas')}
/* Darstellungen sind interpretierende Modelle, keine zusätzlichen historischen Befunde. */
const REPRESENTATIONS=[['network','Denkraum','Beziehungen statt Datumsreihe'],['timeline','Zeitstrahl','Ereignisse zeitlich verorten'],['tunnel','Zeittunnel','Durch historische Spuren reisen'],['present','Augustinus · Bewusstseinsraum','Augustinus: drei Gegenwarten'],['layers','Zeitschichten','Braudel: unterschiedliche Tempi'],['direction','Richtung & Offenheit','Hegel, Harari, Koselleck'],['medieval','Mittelalterliche Geschichtsbilder','Heilsgeschichte, Kirchenjahr und Herrschaft'],['egypt','Altägyptische Geschichtsbilder','Erneuerung, Regierungsjahre und bewahrte Ordnung'],['materialism','Historischer Materialismus','Produktionsweisen, Macht und gesellschaftlicher Wandel'],['recurrence','Kreis & Spirale','Nietzsche und die Wiederholungsfrage'],['memoria','Memoria & Erinnerung','Halbwachs und Assmann: soziale Rahmen, Weitergabe und Auswahl']];
let representation='timeline',presentCase='war',directionChoice='open',repeatShape='spiral',repeatA='revolution',repeatB='haiti',podcastTime=0;
const modeState={layerCase:'roman',materialCase:'factory',materialLens:'forces',medievalLens:'ages',egyptLens:'renewal',hideKing:false};
const PODCAST_PATH='media/wiederholt-sich-die-geschichte.mp3';
const podcastSrc=()=>globalThis.ZEITSPUREN_MEDIA?.[PODCAST_PATH]||PODCAST_PATH;
const timeStamp=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function modeNote(key,label,placeholder){return `<label for="modeNote">${esc(label)}</label><textarea id="modeNote" data-note-key="${key}" placeholder="${esc(placeholder)}">${esc(state.notes[key]||'')}</textarea><p class="small">Deine Überlegungen werden im Arbeitsstand gespeichert und mit exportiert.</p>`}
function eventLink(id,label){const e=byId(id);return `<button data-explore="${esc(id)}">${esc(label||e?.title||id)} <span aria-hidden="true">↗</span></button>`}
function switchRepresentation(value){if(typeof workspaceNavigationReady!=='undefined'&&workspaceNavigationReady&&$('#workspaceDrawer').open)$('#workspaceDrawer').close();worldSheet='';if(!REPRESENTATIONS.some(r=>r[0]===value))return;stopTunnel();if(GLOBAL_LENSES[representation])worldAssumptions[representation]=worldAssumption;if(GLOBAL_LENSES[value])worldAssumption=worldAssumptions[value]??true;lensExample=false;const audio=$('#podcast');if(audio){podcastTime=audio.currentTime;audio.pause()}captureReadings();representation=value;render();}
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
function renderMode(){stopAugustine();if(periodCompare){render();return}stopTunnel();if(GLOBAL_LENSES[representation]&&!lensExample){renderLensUniverse();return}const stage=$('#modeStage');stage.innerHTML=({network:networkHtml,tunnel:tunnelHtml,present:presentHtml,layers:layersHtml,direction:directionHtml,recurrence:recurrenceHtml,materialism:materialismHtml,medieval:medievalHtml,egypt:egyptHtml})[representation]();if(GLOBAL_LENSES[representation]){stage.insertAdjacentHTML('afterbegin','<button id="returnUniverse">← Gesamten Bestand durch dieses Konzept betrachten</button>');$('#returnUniverse').onclick=()=>{lensExample=false;renderMode()}}wireMode();
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
function networkHtml(query=$('#search').value||'',own=onlyOwn){const items=lensItems(query,own),visibleIds=new Set(items.map(e=>e.id));const groups=CONCEPT_GROUPS.filter(g=>networkTopic==='all'||g.id===networkTopic);return `<section class="network-space"><div class="mode-heading"><p class="eyebrow">KEINE THEORIE IST EIN PUNKT AUF EINER FORTSCHRITTSLEITER</p><h2>Zeit denken. Beziehungen entdecken.</h2><p>Hier ordnen Fragen die Begriffe. Die Nähe zeigt gemeinsame Fragen, keine zeitliche Abfolge oder historische Abhängigkeit. Entstehungsdaten findest du weiterhin in den Popups.</p></div><div class="topic-filter" aria-label="Denkfragen filtern"><button data-topic="all" aria-pressed="${networkTopic==='all'}">Alle Fragen</button>${CONCEPT_GROUPS.map(g=>`<button data-topic="${g.id}" aria-pressed="${networkTopic===g.id}">${g.title}</button>`).join('')}</div><div class="constellation"><div class="network-core">ZEIT<br><small>erleben · ordnen · deuten</small></div><div class="concept-groups">${groups.map(g=>`<section class="concept-island" style="--group:${g.color}"><h3>${g.title}</h3><p>${g.description}</p><div class="concept-links">${g.items.filter(id=>visibleIds.has(id)).map(id=>eventLink(id)).join('')}</div><button class="enter-model" data-switch="${g.mode}">Als Darstellung erproben →</button></section>`).join('')}</div></div><div class="bridge-card"><strong>Eine Brücke zwischen den Fragen</strong><p>Bei Augustinus ist Erinnerung eine Weise gegenwärtigen Erlebens; Halbwachs fragt, wie soziale Gruppen Erinnerungen formen. Das sind verschiedene Fragen an denselben Vorgang.</p>${['augustine','halbwachs'].filter(id=>visibleIds.has(id)).map(id=>eventLink(id)).join('')}</div>${networkCorpusHtml(items)}<p class="model-limit">Die Gruppen ordnen die Begriffe nach Fragen. Darunter stehen alle ausgewählten Einträge. Eigene Verbindungen sind möglich: Halte sie über «Mit anderer Spur vergleichen» mit einer Begründung fest.</p></section>`}
function tunnelItems(query=$('#search').value||'',own=onlyOwn){return lensItems(query,own)}
// Camera position is elapsed historical time, never an event index.
let tunnelTime=1800,tunnelSpan=25,tunnelAngle=0,tunnelPlaying=false,tunnelFrame=0;
const tunnelOrdinal=y=>y<0?y+1:y;
const tunnelYear=t=>Math.round(t)<=0?Math.round(t)-1:Math.round(t);
function tunnelBounds(items){const dates=items.filter(e=>Number.isFinite(e.year)).map(e=>tunnelOrdinal(e.year));return dates.length?[Math.min(...dates)-100,Math.max(...dates)+100]:[-17000,2100]}
function tunnelProject(lane,delta){const i=LANES.findIndex(l=>l[0]===lane),angle=i/LANES.length*Math.PI*2+tunnelAngle,depth=Math.cos(angle);return {x:600+delta*190+depth*56,y:300+Math.sin(angle)*172,scale:1,depth,angle};}
function openCylinderGroup(ids){stopTunnel();const entries=ids.split(',').map(byId).filter(Boolean);show(`<h2 id="dialogTitle">${entries.length} Einträge auf dieser Bahn</h2><p class="lead">${esc(LANES.find(l=>l[0]===entries[0]?.lane)?.[1]||'Dokumente')}</p><p>Die Einträge liegen im gewählten Massstab dicht beieinander. Öffne einen Eintrag oder verkleinere den Jahresabstand, um sie im Zylinder auseinanderzuziehen.</p><div class="cylinder-group-list">${entries.map(e=>`<button data-open="${esc(e.id)}"><time>${esc(spurDate(e))}</time><strong>${esc(e.title)}</strong></button>`).join('')}</div>`,'ZEITZYLINDER');}
function wireCylinderGroups(root){root.querySelectorAll('[data-cylinder-group]').forEach(b=>b.onclick=()=>openCylinderGroup(b.dataset.cylinderGroup));}
function tunnelScene(items){
 const active=LANES.filter(l=>visibleCategories.has(l[0])),shown=items.filter(e=>Number.isFinite(e.year)).map(e=>({e,z:(tunnelOrdinal(e.year)-tunnelTime)/tunnelSpan})).filter(o=>o.z>=-2&&o.z<=2);
 const point=(lane,z)=>{const p=tunnelProject(lane,z);return `${p.x.toFixed(1)},${p.y.toFixed(1)}`};
 let html='<svg viewBox="0 0 1200 600" role="group" aria-label="Zeitzylinder in Seitenansicht: Zeit entlang der Längsachse, Kategorien auf dem Mantel"><defs><linearGradient id="cylinderSkin" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#45686e" stop-opacity=".24"/><stop offset=".5" stop-color="#547b80" stop-opacity=".55"/><stop offset="1" stop-color="#142f38" stop-opacity=".7"/></linearGradient></defs><rect width="1200" height="600" fill="#102b34"/>';
 html+='<text x="56" y="36" fill="#e9cf99" font-size="20">FRÜHER</text><text x="1144" y="36" text-anchor="end" fill="#e9cf99" font-size="20">SPÄTER →</text><path d="M220 128 L980 128 A56 172 0 0 1 980 472 L220 472 A56 172 0 0 1 220 128" fill="url(#cylinderSkin)" stroke="#709498" stroke-width="1.5"/>';
 for(const z of [-2,-1,0,1,2]){const x=600+z*190;html+=`<ellipse cx="${x}" cy="300" rx="56" ry="172" fill="none" stroke="${z===0?'#edcc87':'#81a3a5'}" stroke-width="${z===0?2.5:1}" opacity="${z===0?1:.36}"/><line x1="${x}" y1="485" x2="${x}" y2="500" stroke="#b9cccc"/><text x="${x}" y="526" text-anchor="middle" fill="${z===0?'#edcc87':'#d2e0df'}" font-size="17">${esc(yr(tunnelYear(tunnelTime+z*tunnelSpan)))}</text>`;}
 html+='<text x="600" y="553" text-anchor="middle" fill="#edcc87" font-size="14">Standjahr · goldener Querschnitt</text><text x="600" y="584" text-anchor="middle" fill="#c1d4d3" font-size="13">Ein Querschnitt = dasselbe Jahr in allen Kategorien · Längsabstände messen Jahre</text>';
 const bands=[...active].sort((a,b)=>tunnelProject(a[0],0).depth-tunnelProject(b[0],0).depth);
 for(const [id,label,,color] of bands){const front=tunnelProject(id,0).depth>=0;html+=`<path d="M${point(id,-2)} L${point(id,2)}" stroke="${color}" stroke-width="${front?5:2}" ${front?'':'stroke-dasharray="7 7"'} opacity="${front?.9:.4}"/>`;}
 for(const [id,label,,color] of bands){const p=tunnelProject(id,-2);if(p.depth<0)continue;const words=label.split(' '),middle=Math.ceil(words.length/2),lines=label.length>21?[words.slice(0,middle).join(' '),words.slice(middle).join(' ')]:[label];html+=`<text x="16" y="${p.y-7}" fill="${color}" font-size="15" font-weight="600">${lines.map((line,i)=>`<tspan x="16" dy="${i?18:0}">${esc(line)}</tspan>`).join('')}</text>`;}
 const groups=[];
 for(const [lane,label,,color] of bands){const entries=shown.filter(o=>o.e.lane===lane).sort((a,b)=>a.z-b.z);let group=null;for(const o of entries){if(!group||o.z-group.start>.84){group={lane,label,color,start:o.z,entries:[]};groups.push(group)}group.entries.push(o);}}
 for(const group of groups){const {entries,lane,label,color}=group,z=entries.reduce((sum,o)=>sum+o.z,0)/entries.length,p=tunnelProject(lane,z),front=p.depth>=0,first=entries[0].e,ids=entries.map(o=>o.e.id).join(','),date=entries.length===1?spurDate(first):yr(first.year)+' – '+yr(entries.at(-1).e.year),action=entries.length===1?`data-explore="${esc(first.id)}"`:`data-cylinder-group="${esc(ids)}"`;
 html+=`<foreignObject x="${p.x-(front?80:17)}" y="${p.y-(front?34:17)}" width="${front?160:34}" height="${front?76:34}" style="overflow:visible"><button xmlns="http://www.w3.org/1999/xhtml" class="cylinder-entry ${front?'cylinder-front':'cylinder-back'}" ${action} style="--band:${color}" aria-label="${esc(label+' · '+date+' · '+(entries.length===1?first.title:entries.length+' Einträge öffnen'))}" title="${esc(label+' · '+date+' · '+entries.map(o=>o.e.title).join(' / '))}">${front?`<small>${esc(date)}</small><strong>${esc(entries.length===1?first.title:entries.length+' Einträge')}</strong>${entries.length>1?'<span>Öffnen ↗</span>':''}`:entries.length>1?entries.length:'↗'}</button></foreignObject>`;}
 html+='</svg>';return {html,shown};
}
function tunnelHtml(items=tunnelItems()){
 const dated=items.filter(e=>Number.isFinite(e.year)),undated=items.filter(e=>!Number.isFinite(e.year)),[min,max]=tunnelBounds(items);tunnelTime=Math.max(min,Math.min(max,tunnelTime));
 return `<section class="spatial-tunnel"><div class="mode-heading"><p class="eyebrow">ZEITZYLINDER · ZEIT ENTLANG DER LÄNGSACHSE</p><h2>Geschichte auf einem drehbaren Zylinder.</h2><p>Die Zeit verläuft von links nach rechts. Jede Kategorie hat eine Bahn auf dem Zylindermantel. Ein Querschnitt verbindet dasselbe Jahr in allen Bahnen. Drehe eine Kategorie nach vorne, um ihre Einträge zu lesen.</p></div><div class="space-controls"><label>Standort <input id="tunnelDate" type="number" step="1" value="${tunnelYear(tunnelTime)}" aria-label="Jahr; negative Zahlen vor unserer Zeitrechnung"></label><button id="tunnelGo">Jahr ansteuern</button><label>Jahre zwischen Querschnitten <select id="tunnelSpan">${[25,100,200,500,2000,10000].map(n=>`<option value="${n}" ${n===tunnelSpan?'selected':''}>${n}</option>`).join('')}</select></label><button id="tunnelPlay" aria-pressed="false">▶ Zeitfahrt</button><label>Richtung <select id="tunnelDirection"><option value="1">Zur späteren Zeit</option><option value="-1">Zur früheren Zeit</option></select></label></div><div class="space-time-readout"><output id="tunnelClock">${yr(tunnelYear(tunnelTime))}</output><span id="tunnelVisible" aria-live="polite"></span></div><label for="tunnelRange">Standort stufenlos verschieben</label><input id="tunnelRange" type="range" min="${min}" max="${max}" step="any" value="${tunnelTime}"><div class="space-range-labels"><span>${yr(tunnelYear(min))}</span><span>${yr(tunnelYear(max))}</span></div><div class="cylinder-lanes" aria-label="Kategorie nach vorne drehen">${LANES.filter(l=>visibleCategories.has(l[0])).map(([id,label,,color])=>`<button data-cylinder-lane="${id}" style="--band:${color}">${esc(label)} ↻</button>`).join('')}</div><div id="spaceScene" class="space-scene" tabindex="0" aria-label="Zeitzylinder. Auf und ab bewegen durch die Zeit; links und rechts drehen den Zylinder; Plus und Minus ändern den Zeitmassstab.">${tunnelScene(items).html}</div><p class="space-help">Scrollen oder ↑ / ↓: durch die Zeit fahren. ← / → oder Regler: Zylinder drehen. Kategorienamen holen eine Bahn nach vorne. Hinten liegende Einträge bleiben als anklickbare Zeichen sichtbar; Gruppen zeigen ihre Anzahl.</p><label for="tunnelAngle">Zylinder drehen</label><input id="tunnelAngle" type="range" min="-180" max="180" value="${tunnelAngle*180/Math.PI}"><section class="space-near"><h3>Spuren im sichtbaren Zeitraum</h3><p>Alle Einträge des Zeitfensters, auch auf der Rückseite. Gruppierte Einträge lassen sich einzeln öffnen; beim Hineinzoomen über den Zeitmassstab liegen sie weiter auseinander.</p><div id="spaceNear"></div></section>${!items.length?'<p>Keine Spur in dieser Auswahl. Schalte eine Kategorie ein oder ändere die Suche.</p>':''}<details class="space-inventory"><summary>Gesamten ausgewählten Bestand öffnen (${dated.length} datierte Spuren)</summary><div>${dated.map(e=>eventLink(e.id)).join('')}</div></details>${undated.length?`<details class="space-inventory"><summary>Begriffsraum ohne zeitliche Position (${undated.length})</summary><p>Diese Begriffe haben kein gesetztes Datum und liegen deshalb ausserhalb der Zeitachse.</p><div>${undated.map(e=>eventLink(e.id)).join('')}</div></details>`:''}<p class="model-limit">Die Zylinderlänge misst Zeit, nicht Fortschritt. Die Kreisform ordnet Kategorien; sie behauptet keine Wiederholung der Geschichte. Durchgehende Bahnen liegen vorne, gestrichelte hinten. Die Einträge bleiben gleich gross. Die Anordnung der Kategorien ist eine Lesehilfe, keine Landkarte oder Rangordnung. Datierungen bleiben so genau oder ungenau wie die Quellen; ein Punkt ist kein Beweis für einen plötzlichen Wandel.</p></section>`;
}
function stopTunnel(){tunnelPlaying=false;if(tunnelFrame&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(tunnelFrame);tunnelFrame=0;const b=$('#tunnelPlay');if(b){b.textContent='▶ Zeitfahrt';b.setAttribute('aria-pressed','false')}}
function wireTunnel(){
 const items=tunnelItems(),[min,max]=tunnelBounds(items),scene=$('#spaceScene');
 const paint=()=>{const result=tunnelScene(items);scene.innerHTML=result.html;wireCylinderGroups(scene);installProfileZoom();$('#tunnelRange').value=tunnelTime;$('#tunnelDate').value=tunnelYear(tunnelTime);$('#tunnelClock').textContent=yr(tunnelYear(tunnelTime));$('#tunnelVisible').textContent=`${result.shown.length} datierte Spuren im Sichtfeld · ${items.length} im ausgewählten Bestand`;$('#spaceNear').innerHTML=result.shown.sort((a,b)=>a.e.year-b.e.year).map(({e})=>eventLink(e.id,yr(e.year)+' · '+e.title)).join('')||'<p>In diesem Zeitraum enthält die Auswahl keine datierte Spur. Du kannst trotzdem weiter durch die Zeit fahren.</p>';$$('#modeStage [data-explore]').forEach(b=>b.onclick=()=>{stopTunnel();openEvent(b.dataset.explore)})};
 const move=t=>{tunnelTime=Math.max(min,Math.min(max,t));paint();if(tunnelTime===min||tunnelTime===max)stopTunnel()};
 $('#tunnelRange').oninput=e=>{stopTunnel();move(Number(e.target.value))};
 $('#tunnelDate').onfocus=stopTunnel;const goToDate=()=>{const e={target:$('#tunnelDate')};stopTunnel();const n=Number(e.target.value);if(!Number.isFinite(n)||n===0){e.target.setCustomValidity('Bitte ein Jahr ohne Jahr null eingeben.');e.target.reportValidity();return}e.target.setCustomValidity('');move(tunnelOrdinal(n))};$('#tunnelGo').onclick=goToDate;$('#tunnelDate').onkeydown=e=>{if(e.key==='Enter')goToDate()};
 $('#tunnelSpan').onchange=e=>{tunnelSpan=Number(e.target.value);paint()};$$('[data-cylinder-lane]').forEach(b=>b.onclick=()=>{stopTunnel();tunnelAngle=-LANES.findIndex(l=>l[0]===b.dataset.cylinderLane)/LANES.length*Math.PI*2;while(tunnelAngle< -Math.PI)tunnelAngle+=Math.PI*2;$('#tunnelAngle').value=tunnelAngle*180/Math.PI;paint()});
 $('#tunnelAngle').oninput=e=>{tunnelAngle=Number(e.target.value)*Math.PI/180;paint()};
 scene.onwheel=e=>{if(e.ctrlKey||e.metaKey||!e.deltaY)return;e.preventDefault();stopTunnel();move(tunnelTime+Math.max(-120,Math.min(120,e.deltaY))*tunnelSpan/900)};
 let touchY=null;scene.onpointerdown=e=>{if(e.pointerType==='mouse'||e.target.closest('button'))return;touchY=e.clientY;scene.setPointerCapture(e.pointerId)};scene.onpointermove=e=>{if(touchY===null)return;stopTunnel();move(tunnelTime+(touchY-e.clientY)*tunnelSpan/250);touchY=e.clientY};scene.onpointerup=scene.onpointercancel=()=>touchY=null;
 scene.onkeydown=e=>{if(e.target!==scene&&!e.target.classList.contains('profile-zoom-viewport'))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','+','-'].includes(e.key)){e.preventDefault();stopTunnel();if(e.key==='ArrowUp'||e.key==='ArrowDown')move(tunnelTime+(e.key==='ArrowUp'?1:-1)*tunnelSpan/20);else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){tunnelAngle+=(e.key==='ArrowLeft'?-1:1)*.1;tunnelAngle=Math.atan2(Math.sin(tunnelAngle),Math.cos(tunnelAngle));$('#tunnelAngle').value=tunnelAngle*180/Math.PI;paint()}else{tunnelSpan=Math.max(5,Math.min(20000,tunnelSpan*(e.key==='+'?.8:1.25)));paint()}}};
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
function lensItems(query='',own=false){const q=query.toLocaleLowerCase('de');return lensCorpus().filter(e=>categoryVisible(e)&&(periodCompare||centuryVisible(e))&&(!own||e.own)&&[e.title,e.text,e.date,e.year,e.source,e.searchText].join(' ').toLocaleLowerCase('de').includes(q)).sort((a,b)=>(a.year??Infinity)-(b.year??Infinity)||a.title.localeCompare(b.title,'de'))}
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
 return `<section class="world-view"><div class="mode-heading"><p class="eyebrow">WELTGESCHEHEN AUS EINER PERSPEKTIVE BETRACHTEN</p><h2>${reading.name}</h2><p>${reading.mechanism}</p></div>${perspectiveNavigation()}<div class="world-controls"><label>Betrachtungszeit <select id="worldTime"><option value="recent" ${!worldAll?'selected':''}>Zeitfenster um mein Standjahr</option><option value="all" ${worldAll?'selected':''}>Gesamte Zeit</option></select></label><label>Standjahr <input id="worldYear" type="number" value="${worldYear}" step="1"></label><button id="worldGo">Standpunkt setzen</button><label>Zeitfenster ± Jahre <select id="worldWindow">${[25,50,130,500,2000,20000].map(n=>`<option ${n===worldWindow?'selected':''} value="${n}">${n}</option>`).join('')}</select></label><button id="worldNow">Gegenwart betrachten</button></div><label class="world-assumption"><input id="worldAssumption" type="checkbox" ${worldAssumption?'checked':''}>${reading.action}</label>${representation==='recurrence'?`<label class="world-cycle">Länge eines versuchsweisen Umlaufs <input id="worldPeriod" type="range" min="10" max="500" value="${worldPeriod}"><output>${worldPeriod} Jahre</output></label>`:''}<div id="interpretationExperiment" tabindex="-1">${randomConceptHtml()}${worldSceneHtml(items)}</div>${readingComparisonHtml(items)}<details class="board-help"><summary>Diese Ereignistafel lesen</summary>${worldReadingGuide()}</details>${concreteReadingHtml()}${perspectiveIntroduction()}<div id="interpretationSettings" tabindex="-1"></div>${profilePanelHtml()}${telosHtml()}${premiseLabHtml()}<p class="world-experiment">Gedankenexperiment: Die Bildordnung ist unsere Übertragung. Sie beschreibt nicht automatisch, wie die Beteiligten selbst dachten.</p><div class="world-consequences"><article><h3>Was dieser Blick erschliesst</h3><p>${reading.gain}</p></article><article><h3>Was er verdecken kann</h3><p>${reading.loss}</p></article></div><section class="world-workbench"><div><label for="lensFocus">Ein Ereignis in dieser Ansicht untersuchen</label><select id="lensFocus">${corpus.map(e=>`<option value="${esc(e.id)}" ${e.id===lensFocus?'selected':''}>${esc(spurDate(e))} · ${esc(e.title)}</option>`).join('')}</select><h3>${esc(focus.title)}</h3><p>${esc(focus.intro||focus.question||'Eigene Spur')}</p>${focus.image?`<img class="world-focus-image" src="${imageSrc(focus.image)}" alt="${esc(focus.title)}">`:''}<button id="lensSource">Quelle und Materialien öffnen ↗</button>${!items.some(e=>e.id===lensFocus)?'<p class="notice">Diese Spur liegt ausserhalb des aktuellen Suchfilters bzw. der Kategorienauswahl. Die Auswahl bleibt für deinen Vergleich erhalten.</p>':''}<p class="small">Quellenbefund und Deutung trennen: ${esc(focus.text||'Öffne die eigene Spur und prüfe ihre Belege.')}</p></div><div><section class="placement-editor" aria-labelledby="placementTitle"><h3 id="placementTitle">Wo möchtest du diesen Eintrag untersuchen?</h3><p>Wähle die Frage, die du an diesen Eintrag stellst. ${['direction','present'].includes(representation)?'Sie wird als dein Untersuchungsschwerpunkt gespeichert.':'In der Übersicht erscheint er dann im entsprechenden Bereich.'}</p><label for="lensPlacement">Frage für diesen Eintrag</label><select id="lensPlacement" aria-describedby="placementHint"><option value="">Noch nicht einordnen</option>${model.slots.map(([k,t,q])=>`<option value="${k}" ${assignment===k?'selected':''}>${t} · ${q}</option>`).join('')}</select><p id="placementHint">${assignment?`Gespeichert unter «${esc(model.slots.find(s=>s[0]===assignment)?.[1]||assignment)}». Du kannst die Auswahl jederzeit ändern.`:(['direction','present'].includes(representation)?'Noch keine Frage gewählt. Der Eintrag bleibt ohne Untersuchungsschwerpunkt gespeichert.':'Noch keine Frage gewählt. Der Eintrag bleibt in der Liste «Einträge zum Einordnen».')}</p><button type="button" id="placementReturn">${['direction','present'].includes(representation)?'Zur Übersicht →':'Zuordnung in der Übersicht ansehen →'}</button><small>Du wählst einen Blick auf den Eintrag. Damit ist noch keine historische Aussage bewiesen. Andere Ansichten und deine eigenen Materialien bleiben erhalten.</small></section><p class="eyebrow">MIT DIESER KONSTRUKTION ERZÄHLEN</p><h3>${reading.short}: ${esc(focus.title)}</h3><p>${reading.task}</p>${lensFocus==='paris'?`<p class="world-example"><strong>Ein möglicher Ansatz, keine historische Aussage:</strong> ${reading.paris}</p>`:''}<h4>Die Konstruktion aufbrechen</h4><p>${reading.counter}</p>${decisionEditorHtml(focus)}${modeNote(lensNoteKey(representation,lensFocus),'Deine Erzählung und ihre Gegenprüfung','Meine Erzählung unter diesem Geschichtsbild: …\nWas ich aus der Quelle belegen kann: …\nWas erst die Konstruktion hineinträgt: …\nWas ein anderer Blick sichtbar macht: …')}<label for="lensSwitch">Dasselbe Ereignis anders sehen</label><select id="lensSwitch">${perspectiveOptions(representation)}</select></div></section><details class="world-foundations"><summary>Historischer Ansatz, Quellen und Unterschiede innerhalb des Modells</summary><p>${reading.caution}</p>${lensExplanationHtml()}<p>${src}</p><button id="lensTheory">Konzept und Quellen erklären ↗</button><button id="lensExamples">${representation==='recurrence'?'Nietzsche und den Podcast öffnen ↗':'Weitere Ausprägungen und Beispiele ↗'}</button><button data-switch="network">Begriffsbeziehungen nachschlagen ↗</button></details><details class="world-register"><summary>Alle Spuren dieser Auswahl (${items.length}) – auch ausserhalb des Bildausschnitts</summary><p class="lens-count">${items.length} von ${corpus.length} Spuren im gewählten Bestand. Undatierte Begriffe werden nicht künstlich in die Grafik datiert.</p><div>${items.map(e=>corpusEntryHtml(e,'data-lens-focus')).join('')}</div></details><div class="world-compare"><label for="lensPartner">Mit einer weiteren Spur vergleichen</label><select id="lensPartner">${corpus.filter(e=>e.id!==lensFocus).map(e=>`<option value="${esc(e.id)}">${esc(e.title)}</option>`).join('')}</select><button id="lensCompare">Vergleich begründen ↗</button></div></section>`;
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
 $('#worldNow').onclick=()=>{worldYear=new Date().getFullYear();worldWindow=130;worldAll=true;lensFocus=byId('paris')?'paris':lensFocus;redraw()};
 $('#worldAssumption').onchange=e=>{worldAssumption=e.target.checked;redraw()};if($('#worldPeriod'))$('#worldPeriod').onchange=e=>{worldPeriod=Number(e.target.value);redraw()};
 $('#placementReturn').onclick=()=>{worldSheet='';$('#worldDrawer')?.close();$('.concept-stations, .goal-columns, .world-scene')?.scrollIntoView({block:'start',behavior:'smooth'})};
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
    "context": "Karl Marx (1818–1883) und Friedrich Engels (1820–1895) entwickeln ihre Geschichtsauffassung im Zusammenhang mit der kapitalistischen Industriegesellschaft und ihren Konflikten. Marx skizziert 1859, wie die materielle Produktion des Lebens gesellschaftliche Verhältnisse bedingt. Produktivkräfte können in Widerspruch zu bestehenden Produktionsverhältnissen geraten; daraus erklärt er gesellschaftliche Umbrüche. Sein Text enthält auch eine weitreichende Entwicklungsannahme. Diese ist von der konkreten Untersuchung eines einzelnen Konflikts zu unterscheiden und nicht als für jede Region notwendige Reihenfolge vorauszusetzen.",
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
        "Ein Modell des Zusammenhangs von wirtschaftlichen Verhältnissen mit Recht, Politik und Bewusstsein; im einzelnen Fall ist zu untersuchen, wie diese Bereiche zusammenwirken."
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
function concreteReadingHtml(){const d=CONCRETE_READINGS[representation],e=byId(d.event),selected=concreteChoice[representation]||0,c=d.choices[selected];return `<section class="concrete-reading" aria-labelledby="concreteTitle"><p class="eyebrow">ZUERST AN EINEM FALL VERSTEHEN</p><h3 id="concreteTitle">${esc(d.title)}</h3><div class="concrete-fact">${e.image?`<img src="${imageSrc(e.image)}" alt="Bildmaterial zur Spur: ${esc(e.title)}">`:''}<div><span class="step-label">1 · Der Befund bleibt gleich</span><p>${esc(d.fact)}</p><button data-explore="${esc(e.id)}">Spur, Quelle und Bildnachweis öffnen ↗</button></div></div><div class="concrete-choice"><span class="step-label">2 · Wechsle die ausdrücklich gesetzte Perspektive</span><div role="group" aria-label="Zwei beispielhafte Lesarten">${d.choices.map((v,i)=>`<button data-concrete-choice="${i}" aria-pressed="${selected===i}">${esc(v.label)}</button>`).join('')}</div></div><div class="concrete-result" aria-live="polite"><article><span class="step-label">Meine Voraussetzung</span><p>${esc(c.premise)}</p></article><span class="concrete-arrow" aria-label="Unter dieser Voraussetzung lese ich">↓ <small>So verändert sich die Lesart</small></span><article class="concrete-claim"><span class="step-label">3 · Die daraus entwickelte Deutung</span><p>${esc(c.claim)}</p></article><aside><strong>Was ist damit belegt – und was nicht?</strong><p>${esc(c.check)}</p></aside></div><p class="small">Zwei Beispiele mit unterschiedlichen Annahmen. Der Wechsel verändert nur dieses Beispiel; deine eigenen Entwürfe bleiben erhalten. Anschliessend kannst du jede Spur des Bestands selbst untersuchen.</p></section>`}
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
 root.append(sheet);const location=document.createElement('small');location.className='world-drawer-location';location.textContent=REPRESENTATIONS.find(r=>r[0]===representation)[1]+' · Vertiefung';$('#worldDrawerTitle').before(location);
 const groups=[['explain','Ansatz verstehen',['.perspective-intro','.world-foundations','.board-help']],['example','Beispiel erproben',['.concrete-reading','.world-consequences']],['settings','Annahmen & Entwürfe',['.reading-profiles','.telos-lab','.world-experiment']],['investigate','Spur untersuchen',['.world-workbench','.world-compare']],['compare','Entwürfe vergleichen',['.reading-comparison']],['register','Alle Spuren',['.world-register']],['perspectives','Ansatz wechseln',['.perspective-map']]];
 const open=name=>{if(name==='settings')diagramTeaching[representation]='own';worldSheet=name;sheet.querySelectorAll('[data-sheet-pane]').forEach(p=>p.hidden=p.dataset.sheetPane!==name);sheet.querySelectorAll('[data-sheet-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sheetTab===name)));$('#worldDrawerTitle').textContent=groups.find(g=>g[0]===name)?.[1]||'Arbeitsfenster';if(!sheet.open)sheet.showModal();};
 for(const [name,title,selectors] of groups){const pane=document.createElement('section');pane.dataset.sheetPane=name;pane.hidden=true;for(const selector of selectors)for(const el of [...root.querySelectorAll(selector)]){if(sheet.contains(el))continue;pane.append(el);if(el.matches('details'))el.open=true;}if(name==='compare'&&!pane.children.length)pane.innerHTML='<p>Lege unter «Annahmen & Entwürfe» einen zweiten Entwurf an und wähle dort den Vergleich aus.</p>';sheet.querySelector('.drawer-content').append(pane);{const b=document.createElement('button');b.textContent=title;b.dataset.sheetTab=name;b.onclick=()=>open(name);sheet.querySelector('.drawer-tabs').append(b)}}
 const bar=document.createElement('nav');bar.className='world-commandbar';bar.setAttribute('aria-label','Werkzeuge zur Ansicht');for(const name of ['explain','example','settings','compare','register']){const b=document.createElement('button');b.textContent=groups.find(g=>g[0]===name)[1];b.onclick=()=>open(name);bar.append(b)}root.insertBefore(bar,root.firstChild);
 $('#worldDrawerClose').onclick=()=>{worldSheet='';sheet.close()};sheet.addEventListener('cancel',()=>{worldSheet=''});
 root.querySelectorAll('a[href="#interpretationSettings"]').forEach(a=>a.onclick=e=>{e.preventDefault();open('settings')});
 root.querySelectorAll('a[href="#interpretationExperiment"]').forEach(a=>a.onclick=e=>{e.preventDefault();worldSheet='';sheet.close();$('#interpretationExperiment').scrollIntoView({block:'nearest'})});
 const board=root.querySelector('#interpretationExperiment .semantic-board');if(board&&!board.matches('.schematic-scene,.goal-overview')){
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

// A designed experience, not a reconstruction of Augustine's own spatial model.
let augustineProgress=0,augustinePlaying=false,augustineFrame=0,augustineAudio=null,augustineVoice=null,augustineLastTone=-1,augustineSound=true;
const AUGUSTINE_CHARACTERS=[
  {
    "id": "scribe",
    "year": -1900,
    "role": "Schreiber",
    "place": "Ägypten",
    "related": "scribe",
    "memory": "Mein Kollege fand gestern einen Fehler in meiner Liste. Ich hatte eine Zahl übernommen, statt selbst nachzuzählen. Jetzt fällt mir wieder ein, wie lange der Lieferant auf die Berichtigung warten musste.",
    "attention": "Die Zahl passt nicht zu meiner Liste. Ich lasse zuerst den Lieferanten noch einmal zählen. Wenn mein Kollege dazukommt, soll er sehen, dass ich die Sache bereits prüfe.",
    "expectation": "Bei der nächsten freien Stelle will ich berücksichtigt werden. Mein Kollege musste schliesslich auch einmal lernen. Noch eine öffentliche Zurechtweisung lasse ich mir nicht ohne Antwort gefallen.",
    "limit": "Konstruierter Lebenslauf: Er lernte bei einem Verwandten schreiben und erhielt durch dessen Empfehlung eine Stelle in der Getreideverwaltung. Eine fehlerhafte Abrechnung kostete ihn Ansehen; seither will er besonders genau wirken und selbst eine besser bezahlte Aufgabe erhalten. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er lernte bei einem Verwandten schreiben und erhielt durch dessen Empfehlung eine Stelle in der Getreideverwaltung. Eine fehlerhafte Abrechnung kostete ihn Ansehen; seither will er besonders genau wirken und selbst eine besser bezahlte Aufgabe erhalten.",
    "social": "Der ältere Kollege beurteilt seine Arbeit; der Lieferant kennt den Transport. Beide können dieselbe Abweichung anders erklären.",
    "practice": "Listen bewahren Mengen, aber nicht alle Umstände einer Lieferung. Mündliche Auskünfte ergänzen und korrigieren die Schrift."
  },
  {
    "id": "potter",
    "year": -450,
    "role": "Töpferin",
    "place": "Athen",
    "related": "athens",
    "memory": "Beim letzten Brand riss eine Schale, deren dünnen Rand ich besonders gelungen fand. Meine Schwester meinte, ich hätte zu schnell gearbeitet; ich vermute einen Fehler beim Trocknen.",
    "attention": "Ich glätte den Rand und lasse meine Schwester die einfacheren Stücke machen. Der Kunde will weniger zahlen. Dann soll er anderswo kaufen; meine Arbeit ist nicht schlechter, nur weil er den Unterschied nicht sieht.",
    "expectation": "Ich will herausfinden, warum die Schale sprang. Zugleich brauchen wir verkäufliche Gefässe; für einen weiteren Versuch bleibt wenig Ton übrig.",
    "limit": "Konstruierter Lebenslauf: Sie lernte das Formen von Gefässen in der Werkstatt ihrer Familie. Nach dem Tod eines Angehörigen übernahm sie mehr Arbeit, ohne über alle Einnahmen bestimmen zu können. Ihre Schwester hilft ihr, kritisiert aber ihre teuren Versuche mit neuen Formen. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie lernte das Formen von Gefässen in der Werkstatt ihrer Familie. Nach dem Tod eines Angehörigen übernahm sie mehr Arbeit, ohne über alle Einnahmen bestimmen zu können. Ihre Schwester hilft ihr, kritisiert aber ihre teuren Versuche mit neuen Formen.",
    "social": "Schwester und Kundschaft bewerten die Arbeit nach unterschiedlichen Massstäben: Haltbarkeit, Können und Preis.",
    "practice": "Handgriffe und beschädigte Gefässe vermitteln Erfahrungswissen. Kein erhaltener Gegenstand verrät von sich aus, wer welchen Arbeitsschritt ausführte."
  },
  {
    "id": "nero",
    "year": 60,
    "role": "Versklavte Frau zur Zeit Neros",
    "place": "Rom",
    "related": "rome",
    "memory": "Beim Flicken fällt mir ein Stich ein, den mir eine ältere Mitbewohnerin gezeigt hat. Seit ihrer Freilassung sehe ich sie selten. Sie hat mir erzählt, dass sie weiterhin für ihren früheren Besitzer arbeitet.",
    "attention": "Die neue Magd hat die Gewänder falsch abgelegt. Ich lasse sie alles noch einmal ordnen. Nähen kann sie nicht; solange das so bleibt, wird man mich für diese Arbeit brauchen.",
    "expectation": "Die Freigelassene soll meiner Schwester eine Nachricht bringen. Ich will wissen, ob sie noch im selben Haus ist. Wenn hier jemand freigelassen wird, hoffe ich, dass meine Arbeit mehr zählt als die Freundlichkeit der Neuen.",
    "limit": "Konstruierter Lebenslauf: Sie wuchs in einem römischen Haushalt als Versklavte auf und wurde später verkauft. Eine ältere Mitversklavte brachte ihr das Ausbessern von Kleidung bei. Durch dieses Können erhielt sie eine besondere Aufgabe; die Freilassung der Lehrerin änderte an ihrem eigenen Status nichts. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie wuchs in einem römischen Haushalt als Versklavte auf und wurde später verkauft. Eine ältere Mitversklavte brachte ihr das Ausbessern von Kleidung bei. Durch dieses Können erhielt sie eine besondere Aufgabe; die Freilassung der Lehrerin änderte an ihrem eigenen Status nichts.",
    "social": "Mitversklavte geben Wissen und Unterstützung weiter; die Hausherrin verfügt über Arbeit und Bewegungsfreiheit. Die Freigelassene verbindet beide Lebensbereiche, ohne rechtlich gleichgestellt zu sein.",
    "practice": "Ein erlernter Stich und mündliche Nachrichten halten Beziehungen gegenwärtig. Die Erinnerungen dieser Figur sind konstruiert; Inschriften und Rechtszeugnisse belegen andere einzelne Lebenslagen."
  },
  {
    "id": "chur",
    "year": 150,
    "role": "Handwerker",
    "place": "Chur",
    "related": "local-chur",
    "memory": "Ein Fuhrmann reklamierte kürzlich eine Reparatur. Ich erinnere mich an das beschädigte Teil, aber nicht mehr genau daran, welche Weiterfahrt er angekündigt hatte.",
    "attention": "Ich suche am Holz nach einer Schwachstelle. Der Kunde drängt zur Abfahrt; mein Gehilfe rät, das ganze Teil zu ersetzen. Das kostet mehr, könnte aber eine zweite Reparatur vermeiden.",
    "expectation": "Mit guter Arbeit möchte ich den Kunden behalten. Ich fürchte zugleich, dass er schon den Zeitverlust mir zurechnet, auch wenn der alte Schaden die Ursache war.",
    "limit": "Konstruierter Lebenslauf: Er kam als junger Gehilfe nach Chur und übernahm später eine kleine Werkstatt. Ein Verwandter bürgte für einen Werkzeugkauf. Seit er selbst einen Gehilfen beschäftigt, muss er nicht nur Reparaturen, sondern auch dessen Unterhalt und Reklamationen tragen. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er kam als junger Gehilfe nach Chur und übernahm später eine kleine Werkstatt. Ein Verwandter bürgte für einen Werkzeugkauf. Seit er selbst einen Gehilfen beschäftigt, muss er nicht nur Reparaturen, sondern auch dessen Unterhalt und Reklamationen tragen.",
    "social": "Reisende bringen Aufträge und Nachrichten; der Gehilfe hat eigenes Erfahrungswissen. Ihr Verhältnis ist nicht nur das von Anweisung und Ausführung.",
    "practice": "Werkstücke, Reklamationen und Erzählungen über Wege vermitteln Wissen, dessen Verlässlichkeit sich im Gebrauch erweist."
  },
  {
    "id": "rome470",
    "year": 470,
    "role": "Händlerin",
    "place": "Italien",
    "related": "romeend",
    "memory": "Bei der letzten Lieferung sagte mein Bruder, wir hätten zu lange gewartet. Ich erinnere mich dagegen vor allem an die widersprüchlichen Nachrichten über den Weg.",
    "attention": "Ein Bote meldet freie Durchfahrt. Ich frage, ob er die Strecke selbst zurückgelegt oder die Auskunft nur gehört hat. Mein Bruder möchte die Ware sofort abschicken.",
    "expectation": "Ich will den Verkauf abschliessen, ohne unsere Rücklagen aufs Spiel zu setzen. Vielleicht teilen wir die Lieferung; dann steigen allerdings die Transportkosten.",
    "limit": "Konstruierter Lebenslauf: Sie begann mit Botengängen im Handel ihrer Familie und beteiligt sich inzwischen mit eigenem Geld an Lieferungen. Nach einem Verlust besteht ihr Bruder auf Mitsprache. Sie braucht seine Mittel, hält seine Kenntnisse der Handelswege aber für schlechter als ihre eigenen. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie begann mit Botengängen im Handel ihrer Familie und beteiligt sich inzwischen mit eigenem Geld an Lieferungen. Nach einem Verlust besteht ihr Bruder auf Mitsprache. Sie braucht seine Mittel, hält seine Kenntnisse der Handelswege aber für schlechter als ihre eigenen.",
    "social": "Der Bruder trägt das finanzielle Risiko mit, bewertet Nachrichten aber anders. Ein Bote ist Vermittler, nicht automatisch Augenzeuge.",
    "practice": "Mündliche Wegnachrichten und Abrechnungen halten verschiedene Ausschnitte derselben Reise fest."
  },
  {
    "id": "china868",
    "year": 868,
    "role": "Mitarbeiter einer Druckwerkstatt",
    "place": "China",
    "related": "print",
    "memory": "Ein Leser zeigte uns eine undeutlich gedruckte Zeile. Ich hatte das Blatt für brauchbar gehalten. Erst sein Hinweis machte mir klar, welche Zeichen sich verwechseln liessen.",
    "attention": "Ich prüfe Farbe und Papier, bevor ich den nächsten Abdruck abnehme. Die Erklärung eines Besuchers zum Text höre ich nur in Bruchstücken; für die Arbeit muss ich nicht jede Auslegung kennen.",
    "expectation": "Ich möchte weniger Blätter verwerfen. Zugleich frage ich mich, ob ein deutlicher Druck genügt, wenn verschiedene Leser dieselbe Stelle unterschiedlich erklären.",
    "limit": "Konstruierter Lebenslauf: Er lernte Papier und Farbe in einer Werkstatt handhaben, bevor er selbst Abzüge herstellen durfte. Ein Auftrag für religiöse Texte sichert vorläufig seine Arbeit. Das Ansehen der Stifter wächst stärker als sein Verdienst; dennoch ist er stolz auf gute Drucke. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er lernte Papier und Farbe in einer Werkstatt handhaben, bevor er selbst Abzüge herstellen durfte. Ein Auftrag für religiöse Texte sichert vorläufig seine Arbeit. Das Ansehen der Stifter wächst stärker als sein Verdienst; dennoch ist er stolz auf gute Drucke.",
    "social": "Handwerkliche Erfahrung, religiöse Auslegung und Finanzierung liegen bei unterschiedlichen Beteiligten.",
    "practice": "Druckstöcke vervielfältigen einen Text; Vortrag und Gespräch verändern, wie er verstanden wird."
  },
  {
    "id": "custos",
    "year": 1150,
    "role": "Kustos eines Klosters",
    "place": "Mitteleuropa",
    "related": "medievalworld",
    "memory": "Als ich das Amt erhielt, sagte der Abt, auf mich sei Verlass. Daran erinnere ich den jüngeren Bruder, wenn er meine Anordnung übergeht. Dass er beim letzten Fest den fehlenden Leuchter zuerst bemerkte, macht ihn noch nicht zum Kustos.",
    "attention": "Ich teile die Dienste ein und gebe dem Jüngeren die mühsame Vorbereitung. Er soll lernen, eine Aufgabe ordentlich zu Ende zu bringen. Während des Gebets ärgere ich mich, dass er meinen Blick meidet.",
    "expectation": "Zum nächsten Fest muss alles bereit sein. Ich werde für meinen Dienst vor Gott einstehen; darum dulde ich keine Nachlässigkeit. Der Bruder soll sich an die Ordnung halten, dann können wir wieder gut miteinander auskommen.",
    "limit": "Konstruierter Lebenslauf: Er kam als Jugendlicher ins Kloster und übernahm nach Jahren untergeordneter Dienste die Sorge für Kirchengerät und Gottesdienstvorbereitung. Das Amt verschaffte ihm Vertrauen und Einfluss. Einen jüngeren Bruder, den er früher unterstützte, empfindet er inzwischen als Konkurrenten. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er kam als Jugendlicher ins Kloster und übernahm nach Jahren untergeordneter Dienste die Sorge für Kirchengerät und Gottesdienstvorbereitung. Das Amt verschaffte ihm Vertrauen und Einfluss. Einen jüngeren Bruder, den er früher unterstützte, empfindet er inzwischen als Konkurrenten.",
    "social": "Amt, Alter und gemeinsame Regel strukturieren die Beziehungen. Religiöser Anspruch und persönliche Kränkung bestehen nebeneinander.",
    "practice": "Gebetszeiten, wiederkehrende Feste und gemeinsam benutzte Gegenstände tragen Erinnerung; eine Regel beschreibt Sollvorstellungen, nicht jedes tatsächliche Verhalten."
  },
  {
    "id": "nun",
    "year": 1250,
    "role": "Nonne",
    "place": "England",
    "related": "medievalworld",
    "memory": "Meine Mitschwester fragte gestern nach einer Psalmstelle. Ich gab die Erklärung weiter, die ich selbst gelernt hatte; ihre Nachfrage konnte ich nicht beantworten.",
    "attention": "Beim gemeinsamen Gebet höre ich die vertrauten Worte und denke wieder an ihre Frage. Gleichzeitig bemerke ich, dass sie in der Zeile verrutscht, und zeige ihr die Stelle.",
    "expectation": "Ich werde die ältere Schwester um ihre Auslegung bitten, bevor ich weiter unterrichte. Nicht jede Frage lässt sich im Vorübergehen beantworten. Dass die Jüngere vor allen nachhakt, will ich ihr dennoch abgewöhnen.",
    "limit": "Konstruierter Lebenslauf: Ihre Familie brachte sie als Mädchen in den Konvent. Dort lernte sie lesen und gewann später Ansehen als Lehrende. Einen angebotenen Wechsel in ein anderes Haus lehnte sie ab; sie hängt an ihrer Gemeinschaft, obwohl sie sich über deren Rangordnung ärgert. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Ihre Familie brachte sie als Mädchen in den Konvent. Dort lernte sie lesen und gewann später Ansehen als Lehrende. Einen angebotenen Wechsel in ein anderes Haus lehnte sie ab; sie hängt an ihrer Gemeinschaft, obwohl sie sich über deren Rangordnung ärgert.",
    "social": "Lernen verläuft zwischen Schwestern verschiedener Erfahrung. Eine Lehrende kann zugleich selbst auf Hilfe angewiesen sein.",
    "practice": "Wiederholtes Sprechen, Handschrift und Auslegung verbinden eingeprägte Worte mit neuen Fragen."
  },
  {
    "id": "bridge",
    "year": 1360,
    "role": "Arbeiter am Seeübergang",
    "place": "Rapperswil–Hurden",
    "related": "local-bridge",
    "memory": "Mein Verwandter warnte mich beim letzten Einsatz vor einer glatten Stelle. Ich hatte sie übersehen. Später erzählte er anderen davon, als wäre ich grundsätzlich ungeschickt.",
    "attention": "Ich prüfe meinen Stand und reiche ihm ein Werkzeug. Diesmal entdecke ich selbst eine lockere Verbindung; ich muss ihn darauf aufmerksam machen, obwohl ich noch verärgert bin.",
    "expectation": "Ich möchte zeigen, dass ich die Arbeit beherrsche, ohne mich aus Trotz zu gefährden. Nach Feierabend will ich klären, was er weitererzählt hat.",
    "limit": "Konstruierter Lebenslauf: Er folgte einem älteren Verwandten zur Arbeit am Seeübergang. Nach mehreren Einsätzen vertraute man ihm schwierigere Aufgaben an. Eine Verletzung unterbrach seinen Verdienst; nun nimmt er wieder Arbeit an und möchte nicht länger als der unerfahrene Verwandte gelten. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er folgte einem älteren Verwandten zur Arbeit am Seeübergang. Nach mehreren Einsätzen vertraute man ihm schwierigere Aufgaben an. Eine Verletzung unterbrach seinen Verdienst; nun nimmt er wieder Arbeit an und möchte nicht länger als der unerfahrene Verwandte gelten.",
    "social": "Verwandtschaft bietet Zugang zur Arbeit, bringt aber auch Abhängigkeit und Erwartungen mit sich.",
    "practice": "Handgriffe und Erzählungen über Beinaheunfälle vermitteln Erfahrung; in ihrer Weitergabe werden Leistungen unterschiedlich gewichtet."
  },
  {
    "id": "ming",
    "year": 1370,
    "role": "Handwerker",
    "place": "China unter der frühen Ming-Dynastie",
    "related": "china",
    "memory": "Mein Vater spricht von den vergangenen Jahren vor allem als Zeit der Verluste. Mir fällt auch ein Nachbar ein, der uns damals Werkzeug lieh. Wir erzählen dieselbe Zeit unterschiedlich.",
    "attention": "Der Auftrag kommt von einem Mann der neuen Verwaltung. Mein Vater warnt mich vor solchen Verbindungen. Er hat seine Erfahrung; bezahlen muss ich das geliehene Werkzeug. Ich nehme den Auftrag an.",
    "expectation": "Ich möchte einen grösseren Auftrag annehmen. Mein Vater rät, Vorräte zurückzuhalten. Ob mehr Arbeit jetzt Sicherheit oder zusätzliche Verpflichtung bedeutet, ist für uns strittig.",
    "limit": "Konstruierter Lebenslauf: Seine Familie verlor während der Kämpfe Aufträge und Werkzeug. Er baute mit geliehenem Material eine Werkstatt auf. Unter der neuen Dynastie sucht er zahlungskräftige Auftraggeber; der Vater hält seine Bereitschaft, sich mit neuen Amtsträgern gutzustellen, für gefährlich. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Seine Familie verlor während der Kämpfe Aufträge und Werkzeug. Er baute mit geliehenem Material eine Werkstatt auf. Unter der neuen Dynastie sucht er zahlungskräftige Auftraggeber; der Vater hält seine Bereitschaft, sich mit neuen Amtsträgern gutzustellen, für gefährlich.",
    "social": "Zwei Generationen desselben Haushalts gewichten Verluste, Hilfe und Risiken unterschiedlich.",
    "practice": "Familienerzählungen und Berichte über Anordnungen vermitteln Vergangenheit und Herrschaft aus begrenzter örtlicher Sicht."
  },
  {
    "id": "mainz",
    "year": 1455,
    "role": "Geselle einer Druckwerkstatt",
    "place": "Mainz",
    "related": "gutenberg",
    "memory": "Gestern übersah ich einen vertauschten Buchstaben. Der Korrekturleser entdeckte ihn erst im Abdruck. Ich weiss noch, wie selbstverständlich mir der fehlerhafte Satz beim ersten Prüfen vorkam.",
    "attention": "Ich korrigiere den Satz, bevor der Meister ihn sieht. Dem neuen Gesellen erkläre ich nur, was er für seinen Teil braucht. Er verlangt schon jetzt denselben Lohn wie ich.",
    "expectation": "Wenn das Buch gelingt, soll der Meister sich daran erinnern, wer die schwierigen Stellen gesetzt hat. Vielleicht kann ich bessere Bedingungen verlangen. Für immer will ich nicht derjenige sein, der Fehler anderer ausbessert.",
    "limit": "Konstruierter Lebenslauf: Er begann mit Hilfsarbeiten in einer Werkstatt und lernte schrittweise das Setzen. Nach einem misslungenen Auftrag blieb ein Teil seines Verdienstes aus. Er möchte zu den verlässlichsten Gesellen zählen, behält aber nützliche Handgriffe gelegentlich für sich. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er begann mit Hilfsarbeiten in einer Werkstatt und lernte schrittweise das Setzen. Nach einem misslungenen Auftrag blieb ein Teil seines Verdienstes aus. Er möchte zu den verlässlichsten Gesellen zählen, behält aber nützliche Handgriffe gelegentlich für sich.",
    "social": "Setzer, Drucker und Leser hängen voneinander ab, erkennen Fehler aber an unterschiedlichen Stellen.",
    "practice": "Vorlage, Satz und Korrekturabdruck zeigen, dass Vervielfältigung auch Fehler vervielfältigen kann."
  },
  {
    "id": "caribbean",
    "year": 1491,
    "role": "Bäuerin",
    "place": "Karibik",
    "related": "americas1491",
    "memory": "Meine Tante zeigte mir, wie wir die Wurzeln verarbeiten. Wenn ich es heute einer Jüngeren erkläre, fallen mir ihre Worte ein, aber manche ihrer Handgriffe kann ich besser vormachen als beschreiben.",
    "attention": "Ich prüfe mit einer Verwandten, welche Pflanzen wir ernten. Sie möchte mehr stehen lassen; ich denke an das Essen für die Menschen, die uns bei der Arbeit helfen.",
    "expectation": "Für die nächste Pflanzung möchte ich genügend Material zurückbehalten. Zugleich will ich die Hilfe unserer Verwandten erwidern. Beides lässt sich nicht ohne Absprache entscheiden.",
    "limit": "Konstruierter Lebenslauf: Sie lernte Anbau und Verarbeitung von Maniok von älteren Verwandten. Später übernahm sie Verantwortung für einen Teil der gemeinsamen Arbeit. Nach einer schwachen Ernte stritt sie mit Angehörigen über die Verteilung; ihre Stellung beruht ebenso auf erwiesener Hilfe wie auf Forderungen an andere. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie lernte Anbau und Verarbeitung von Maniok von älteren Verwandten. Später übernahm sie Verantwortung für einen Teil der gemeinsamen Arbeit. Nach einer schwachen Ernte stritt sie mit Angehörigen über die Verteilung; ihre Stellung beruht ebenso auf erwiesener Hilfe wie auf Forderungen an andere.",
    "social": "Wissen, Arbeit und Verpflichtungen verbinden mehrere Angehörige; innerhalb der Gemeinschaft bestehen unterschiedliche Einschätzungen.",
    "practice": "Vormachen, gemeinsames Verarbeiten und Erzählungen vermitteln Wissen ohne die Voraussetzung schriftlicher Aufzeichnungen."
  },
  {
    "id": "timbuktu",
    "year": 1500,
    "role": "Abschreiber",
    "place": "Timbuktu",
    "related": "timbuktu",
    "memory": "Bei einer früheren Abschrift hielt ich eine Randbemerkung für einen Teil des Textes. Ein Gelehrter berichtigte mich. Seitdem frage ich genauer, welche Hand welche Worte hinzugefügt hat.",
    "attention": "Ich vergleiche eine schwer lesbare Stelle mit der Vorlage. Der Auftraggeber erwartet bald das fertige Werk; ich möchte die Unklarheit markieren, statt stillschweigend eine Lesart festzulegen.",
    "expectation": "Ich will für zuverlässige Arbeit bekannt sein. Vielleicht lässt sich eine zweite Abschrift vergleichen; wenn sie abweicht, ist die Entscheidung allerdings noch nicht getroffen.",
    "limit": "Konstruierter Lebenslauf: Er lernte Lesen und Schreiben im Umfeld eines Lehrers und begann mit einfachen Abschreibarbeiten. Ein wohlhabender Auftraggeber verschaffte ihm Zugang zu weiteren Handschriften. Er lebt von diesem Verhältnis, möchte aber auch als jemand gelten, der Texte versteht und nicht nur kopiert. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er lernte Lesen und Schreiben im Umfeld eines Lehrers und begann mit einfachen Abschreibarbeiten. Ein wohlhabender Auftraggeber verschaffte ihm Zugang zu weiteren Handschriften. Er lebt von diesem Verhältnis, möchte aber auch als jemand gelten, der Texte versteht und nicht nur kopiert.",
    "social": "Besitz, handwerkliche Arbeit und Gelehrsamkeit fallen nicht zusammen. Der Auftraggeber bestimmt den Termin, nicht jede sachliche Antwort.",
    "practice": "Haupttext, Randnotizen und mündliche Auslegung tragen unterschiedliche Schichten der Überlieferung."
  },
  {
    "id": "zurich",
    "year": 1523,
    "role": "Handwerkerin",
    "place": "Zürich",
    "related": "local-reform",
    "memory": "Meine Mutter verband ein bestimmtes Gebet mit dem Andenken an ihren Vater. Ein Nachbar nannte solche Gewohnheiten unnötig. Mich traf daran weniger sein Argument als sein Ton.",
    "attention": "Mein Bruder erzählt wieder, was der Rat beschlossen habe. Er hat die Disputation nicht gehört und spricht trotzdem, als hätte er mitentschieden. Das Gebet meiner Mutter lasse ich mir von ihm nicht verbieten.",
    "expectation": "Ich möchte verstehen, was sich ändern soll, ohne die Erinnerung meiner Mutter lächerlich zu machen. Ob wir künftig gemeinsam zum Gottesdienst gehen, ist für mich eine konkrete Sorge.",
    "limit": "Konstruierter Lebenslauf: Sie arbeitete zunächst im Haushalt ihrer Eltern und später in einer Werkstatt. Der Tod eines Angehörigen festigte ihre Bindung an vertraute Gebete. Über die neuen Predigten geriet sie mit ihrem Bruder in Streit; für ihn gehören religiöse Veränderung und ein neues öffentliches Ansehen zusammen. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie arbeitete zunächst im Haushalt ihrer Eltern und später in einer Werkstatt. Der Tod eines Angehörigen festigte ihre Bindung an vertraute Gebete. Über die neuen Predigten geriet sie mit ihrem Bruder in Streit; für ihn gehören religiöse Veränderung und ein neues öffentliches Ansehen zusammen.",
    "social": "Familiengedächtnis, Nachbarschaft und religiöse Auseinandersetzung überschneiden sich, ohne eine einheitliche Position zu ergeben.",
    "practice": "Gebete und Erzählungen bewahren familiäre Bindungen; Berichte über öffentliche Diskussionen erreichen den Haushalt vermittelt."
  },
  {
    "id": "coal",
    "year": 1784,
    "role": "Bergarbeiter",
    "place": "Käpfnach bei Horgen",
    "related": "local-coal",
    "memory": "Ein älterer Arbeiter bemerkte zuletzt eine Veränderung, die mir entgangen war. Ich erinnere mich genauer an seine Warnung als an das, was ich selbst im Arbeitsraum sah.",
    "attention": "Ich halte kurz inne und vergleiche die Stelle mit seiner Beschreibung. Mein Nachbar drängt weiterzuarbeiten. Ich muss entscheiden, ob ich nachfrage und den Ablauf unterbreche.",
    "expectation": "Ich will Erfahrung gewinnen und als verlässlich gelten. Dazu gehört für mich, eine Unsicherheit auszusprechen; ich fürchte aber, als langsam beurteilt zu werden.",
    "limit": "Konstruierter Lebenslauf: Er verdiente seinen Unterhalt zunächst mit wechselnden Arbeiten und nahm dann eine Stelle im Käpfnacher Bergbau an. Ein erfahrener Arbeiter führte ihn ein. Der regelmässigere Verdienst verschafft ihm Gewicht im Haushalt; eine Unterbrechung könnte auch diese Stellung gefährden. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er verdiente seinen Unterhalt zunächst mit wechselnden Arbeiten und nahm dann eine Stelle im Käpfnacher Bergbau an. Ein erfahrener Arbeiter führte ihn ein. Der regelmässigere Verdienst verschafft ihm Gewicht im Haushalt; eine Unterbrechung könnte auch diese Stellung gefährden.",
    "social": "Erfahrene Kollegen vermitteln Wissen. Leistungsdruck und gegenseitige Verantwortung können miteinander in Konflikt geraten.",
    "practice": "Körperliche Erfahrung und mündliche Warnungen prägen Erinnerung anders als betriebliche Förderzahlen."
  },
  {
    "id": "paris1789",
    "year": 1789,
    "role": "Wäscherin",
    "place": "Paris",
    "related": "revolution",
    "memory": "Eine Kundin versprach mir letzte Woche Bezahlung und vertröstete mich erneut. Beim Gespräch über teures Brot dachte ich deshalb nicht nur an Preise, sondern an das Geld, das mir fehlt.",
    "attention": "Ich rechne aus, was ich heute einkaufen kann. Eine Nachbarin will zu einer Versammlung, eine andere hält das für Zeitverlust. Beide brauchen ebenso dringend ihren Verdienst.",
    "expectation": "Die Kundin soll endlich bezahlen. Bei der nächsten Versammlung will ich sagen, wie Leute mit vollen Schränken uns hinhalten. Wenn sie dafür ihren guten Namen verliert, kann sie sich bei sich selbst bedanken.",
    "limit": "Konstruierter Lebenslauf: Sie lernte das Waschen bei einer Verwandten und gewann nach und nach eigene Kundschaft. Ausstehende Zahlungen brachten sie mehrfach in Schulden. In der Nachbarschaft begann sie, politische Versammlungen zu besuchen; dort wird sie eher angehört als von manchen ihrer Kunden. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie lernte das Waschen bei einer Verwandten und gewann nach und nach eigene Kundschaft. Ausstehende Zahlungen brachten sie mehrfach in Schulden. In der Nachbarschaft begann sie, politische Versammlungen zu besuchen; dort wird sie eher angehört als von manchen ihrer Kunden.",
    "social": "Kundschaft, Nachbarinnen und Haushalt verbinden wirtschaftliche Abhängigkeit mit unterschiedlichen politischen Entscheidungen.",
    "practice": "Abrechnungen, Marktgespräche und Versammlungen setzen verschiedene Prioritäten; keine davon vertritt allein alle arbeitenden Frauen."
  },
  {
    "id": "haiti1791",
    "year": 1791,
    "role": "Versklavte Arbeiterin",
    "place": "Saint-Domingue",
    "related": "haiti",
    "memory": "Meine Schwester erzählte mir bei unserem letzten Treffen von einer geplanten Flucht. Ich weiss nicht, ob sie wirklich aufbrach. Jetzt klingt das Gespräch für mich anders als damals.",
    "attention": "Ein Mitversklavter berichtet von einem Aufstand und nennt einen Treffpunkt. Ich frage, von wem er es weiss. Zu lange zu zögern kann ebenso gefährlich sein wie einer falschen Nachricht zu folgen.",
    "expectation": "Ich will fort von dieser Plantage und meine Schwester finden. Ich will auch, dass die Besitzer ihre Macht verlieren. Wenn man mir dafür verspricht, einfach nur wieder sicher arbeiten zu dürfen, ist mir das zu wenig.",
    "limit": "Konstruierter Lebenslauf: Sie wurde von ihrer Schwester getrennt und zur Feldarbeit auf einer anderen Plantage gezwungen. Heimliche Kontakte hielten die Verbindung zeitweise aufrecht. Seit Berichte über Widerstand eintreffen, sucht sie nicht nur nach Schutz, sondern nach einer Möglichkeit, die Gewalt der Besitzer zu brechen. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie wurde von ihrer Schwester getrennt und zur Feldarbeit auf einer anderen Plantage gezwungen. Heimliche Kontakte hielten die Verbindung zeitweise aufrecht. Seit Berichte über Widerstand eintreffen, sucht sie nicht nur nach Schutz, sondern nach einer Möglichkeit, die Gewalt der Besitzer zu brechen.",
    "social": "Verwandtschaft über Plantagengrenzen hinweg und Kontakte unter Versklavten eröffnen Möglichkeiten unter extremer Gewalt und ungleichem Zugang zu Nachrichten.",
    "practice": "Mündliche Nachrichten sind lebenswichtig und schwer überprüfbar. Koloniale Akten über Widerstand geben die Perspektive der Beteiligten nur vermittelt wieder."
  },
  {
    "id": "linth",
    "year": 1810,
    "role": "Arbeiter an der Linthkorrektion",
    "place": "Linthebene",
    "related": "local-linth",
    "memory": "Mein Onkel zeigte mir eine Wiese, die lange unter Wasser stand. Ein Nachbar beklagte dagegen den Zugang zu seinem Land während der Arbeiten. Wenn vom Nutzen des Kanals die Rede ist, höre ich beide Stimmen.",
    "attention": "Ich räume mit anderen Erde weg. Beim Mittagessen streiten wir darüber, wem die Arbeiten zuerst helfen. Mein Lohn ist ein unmittelbarer Vorteil; über die künftigen Felder entscheide ich nicht.",
    "expectation": "Ich wünsche mir trocknere Wege und weitere bezahlte Arbeit. Wenn die Baustelle endet, fallen diese beiden Hoffnungen vielleicht auseinander.",
    "limit": "Konstruierter Lebenslauf: Er arbeitete saisonweise auf Höfen und erhielt dann Verdienst beim Kanalbau. In der Verwandtschaft besitzen einige Land, andere leben vor allem von Lohnarbeit. Eine dauerhafte Stelle wäre für ihn wichtiger als eine Wertsteigerung der Grundstücke, die ihm nicht gehören. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er arbeitete saisonweise auf Höfen und erhielt dann Verdienst beim Kanalbau. In der Verwandtschaft besitzen einige Land, andere leben vor allem von Lohnarbeit. Eine dauerhafte Stelle wäre für ihn wichtiger als eine Wertsteigerung der Grundstücke, die ihm nicht gehören.",
    "social": "Bauarbeiter, Landbesitzer und andere Anwohner haben überlappende, aber nicht gleiche Interessen.",
    "practice": "Erinnerungen an Hochwasser und Baustellen stehen neben Plänen und Berichten, die den Eingriff anders bewerten."
  },
  {
    "id": "murg1840",
    "year": 1840,
    "role": "Spinnerin",
    "place": "Murg am Walensee",
    "related": "local-murg",
    "memory": "Bei meinem ersten gerissenen Faden half mir eine Kollegin, ohne mich blosszustellen. Nun merke ich, wie schnell ich selbst ungeduldig werde, wenn die Neue dieselbe Hilfe braucht.",
    "attention": "Die Neue lässt schon wieder einen Faden reissen. Ich helfe ihr, aber nicht jedes Mal sofort. Ich habe meine eigene Arbeit. Wenn der Aufseher fragt, soll sie selbst erklären, warum sie nicht nachkommt.",
    "expectation": "Ich möchte, dass sie sicherer wird und wir die Arbeit schaffen. Nachher brauche ich Ruhe, habe aber zu Hause noch Aufgaben. Der Lohn verschafft mir Spielraum und bindet mich zugleich an diese Arbeitszeiten.",
    "limit": "Konstruierter Lebenslauf: Sie begann als unerfahrene Arbeiterin in der Spinnerei und wurde sicherer im Umgang mit den Maschinen. Ihr Lohn hilft dem Haushalt, reicht aber nicht für einen eigenen. Die Einarbeitung neuer Kolleginnen bedeutet Anerkennung und zusätzliche Arbeit, für die sie nicht automatisch mehr erhält. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie begann als unerfahrene Arbeiterin in der Spinnerei und wurde sicherer im Umgang mit den Maschinen. Ihr Lohn hilft dem Haushalt, reicht aber nicht für einen eigenen. Die Einarbeitung neuer Kolleginnen bedeutet Anerkennung und zusätzliche Arbeit, für die sie nicht automatisch mehr erhält.",
    "social": "Kollegiale Hilfe, betriebliche Anforderungen und Pflichten im Haushalt bestimmen die Zeit unterschiedlich.",
    "practice": "Handgriffe, Zeichen und Gespräche nach der Arbeit vermitteln Erfahrungswissen, das Lohnlisten nicht erfassen."
  },
  {
    "id": "ragaz",
    "year": 1850,
    "role": "Wäscherin im Kurort",
    "place": "Ragaz",
    "related": "local-ragaz",
    "memory": "Letzte Saison nahmen wir mehr Wäsche an, als wir gut bewältigen konnten. Meine Verwandte erinnert sich vor allem an den Verdienst; mir fallen zuerst die schmerzenden Hände ein.",
    "attention": "Ich sortiere die Stücke und entdecke eine beschädigte Naht. Bevor wir waschen, will ich festhalten, dass sie schon offen war. Sonst könnten wir für den Schaden verantwortlich gemacht werden.",
    "expectation": "Zusätzliche Gäste könnten mehr Einkommen bringen. Ich möchte diesmal eine Grenze vereinbaren, auch wenn meine Verwandte das als entgangene Gelegenheit sieht.",
    "limit": "Konstruierter Lebenslauf: Sie übernahm mit einer Verwandten Waschaufträge aus dem Kurbetrieb und gewann durch Empfehlungen neue Kunden. Eine starke Saison brachte Geld, aber auch Schulden für zusätzliche Anschaffungen. Nun will die Verwandte weiter wachsen, während sie selbst die Arbeitslast begrenzen möchte. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie übernahm mit einer Verwandten Waschaufträge aus dem Kurbetrieb und gewann durch Empfehlungen neue Kunden. Eine starke Saison brachte Geld, aber auch Schulden für zusätzliche Anschaffungen. Nun will die Verwandte weiter wachsen, während sie selbst die Arbeitslast begrenzen möchte.",
    "social": "Arbeitspartnerin und Auftraggeber teilen ihr Interesse an erledigter Wäsche, nicht unbedingt an gleichen Arbeitsbedingungen.",
    "practice": "Beschädigte Textilien, Rechnungen und Saisonerinnerungen dokumentieren verschiedene Seiten des Kuraufenthalts."
  },
  {
    "id": "boat",
    "year": 1858,
    "role": "Schiffer",
    "place": "Walensee",
    "related": "local-rail",
    "memory": "Eine Fahrt, auf die ich wegen des Wetters verzichtete, nennt mein Neffe noch immer eine verlorene Gelegenheit. Ich erinnere mich vor allem an die Bedingungen draussen auf dem See.",
    "attention": "Ich verhandele einen Transportpreis. Der Kunde vergleicht mit der angekündigten Bahn, deren Nutzen mein Neffe begeistert beschreibt. Für meine Fahrt muss ich trotzdem Wetter und Ladung einschätzen.",
    "expectation": "Vielleicht braucht die Bahn unsere Zubringerfahrten. Dann sollen die Herren vernünftig bezahlen. Mein Neffe tut, als sei alles Neue besser; wenn er geht, wird er merken, dass dort auch niemand auf ihn gewartet hat.",
    "limit": "Konstruierter Lebenslauf: Er lernte das Schifferhandwerk in seiner Familie und baute Beziehungen zu regelmässigen Auftraggebern auf. Eine misslungene Fahrt kostete ihn Geld und Vertrauen. Als die Bahn näher rückt, streitet er mit einem jüngeren Angehörigen darüber, ob Erfahrung auf dem See noch eine Zukunft bietet. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er lernte das Schifferhandwerk in seiner Familie und baute Beziehungen zu regelmässigen Auftraggebern auf. Eine misslungene Fahrt kostete ihn Geld und Vertrauen. Als die Bahn näher rückt, streitet er mit einem jüngeren Angehörigen darüber, ob Erfahrung auf dem See noch eine Zukunft bietet.",
    "social": "Kundschaft, Angehörige und konkurrierende Verkehrsanbieter rechnen mit unterschiedlichen Möglichkeiten.",
    "practice": "Erinnerte Fahrten und weitergegebene Wetterkenntnis stehen neben Fahrplänen und Versprechen neuer Verbindungen."
  },
  {
    "id": "reader",
    "year": 1881,
    "role": "Junge Leserin",
    "place": "Zürich",
    "related": "local-heidi",
    "memory": "Vom letzten Bergbesuch erinnere ich mich an nasse Schuhe und einen Streit. Beim Lesen fallen mir plötzlich auch der Geruch des Heus und eine freundliche Begegnung wieder ein.",
    "attention": "Meine Freundin findet Heidis Leben beneidenswert. Ich lese eine Stelle noch einmal: Was uns frei erscheint, könnte für jemanden, der dort arbeiten muss, anders aussehen.",
    "expectation": "Ich möchte meiner Freundin das Kapitel vorlesen und ihre Meinung hören. Bei einer nächsten Reise würde ich gern genauer hinschauen, statt überall die Figuren aus dem Buch zu suchen.",
    "limit": "Konstruierter Lebenslauf: Sie besuchte die Schule in Zürich und leiht sich Bücher im Bekanntenkreis. Eine Reise in die Berge blieb ihr als Abwechslung vom Alltag in Erinnerung. Mit ihrer Freundin streitet sie darüber, welche Lebensweise glücklicher sei; von der täglichen Arbeit der Bergbevölkerung kennt sie wenig. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie besuchte die Schule in Zürich und leiht sich Bücher im Bekanntenkreis. Eine Reise in die Berge blieb ihr als Abwechslung vom Alltag in Erinnerung. Mit ihrer Freundin streitet sie darüber, welche Lebensweise glücklicher sei; von der täglichen Arbeit der Bergbevölkerung kennt sie wenig.",
    "social": "Eigene Reiseerfahrung, Freundin und literarische Darstellung prägen einander, ohne deckungsgleich zu werden.",
    "practice": "Das Buch ruft Erinnerungen hervor und ordnet sie um. Erzählte Ereignisse werden dadurch nicht selbst Erlebnisse der Leserin."
  },
  {
    "id": "war1914",
    "year": 1914,
    "role": "Angehörige eines Gefallenen",
    "place": "Deutschsprachiger Raum",
    "related": "war",
    "memory": "Beim Abschied stritten wir über eine Kleinigkeit. Jetzt erzählen die anderen vor allem von seiner Zuversicht. Ich möchte ihnen nicht widersprechen, aber unser letztes Gespräch passt schlecht dazu.",
    "attention": "Meine Mutter will «Heldentod» in der Anzeige stehen haben. Ich lasse es dabei. Den letzten Streit mit meinem Bruder erzähle ich der Nachbarin nicht; sie hat schon genug darüber geredet, was wir als Familie angeblich empfinden sollten.",
    "expectation": "Ich möchte etwas von ihm aufbewahren, das auch unsere Unstimmigkeiten zulässt. Vielleicht schreibe ich das letzte Gespräch auf; ich weiss nicht, ob ich es der Familie zeigen werde.",
    "limit": "Konstruierter Lebenslauf: Sie wuchs mit ihrem Bruder auf und blieb im Heimatort, als er eingezogen wurde. Zunächst las sie seine Briefe auch Nachbarn vor. Seit der Todesnachricht verwaltet sie mit der Mutter seine wenigen Hinterlassenschaften; über die öffentliche Erinnerung sind beide nicht immer einig. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie wuchs mit ihrem Bruder auf und blieb im Heimatort, als er eingezogen wurde. Zunächst las sie seine Briefe auch Nachbarn vor. Seit der Todesnachricht verwaltet sie mit der Mutter seine wenigen Hinterlassenschaften; über die öffentliche Erinnerung sind beide nicht immer einig.",
    "social": "Schwester, Mutter und öffentliche Trauersprache geben demselben Verlust unterschiedliche Bedeutungen.",
    "practice": "Todesanzeige, persönliches Gespräch und aufbewahrte Gegenstände erzeugen verschiedene Erinnerungsbilder."
  },
  {
    "id": "india1947",
    "year": 1947,
    "role": "Schneiderin",
    "place": "Punjab",
    "related": "india",
    "memory": "Ich denke an eine Kundin, deren unfertiges Kleid in meiner Werkstatt blieb. Ob sie noch dort ist, weiss ich nicht. In den Nachrichten über ganze Bevölkerungsgruppen finde ich unsere Gespräche kaum wieder.",
    "attention": "Ich ändere ein geliehenes Kleidungsstück und frage Neuankommende nach unserer Strasse. Die Verwandten wollen planen; ich warte auf eine Nachricht, die ihre Vorschläge wieder verändern könnte.",
    "expectation": "Ich möchte meine Arbeit wieder aufnehmen und einen vermissten Angehörigen erreichen. Zurückgehen und neu anfangen sind für mich noch keine klar getrennten Möglichkeiten.",
    "limit": "Konstruierter Lebenslauf: Sie lernte das Nähen bei einer Verwandten und baute sich im Punjab einen Kundenkreis auf. Während der Teilung verliess sie ihre Werkstatt und kam bei Angehörigen unter. Sie besitzt ihr Können weiter, muss um Material, Räume und neue Kundschaft aber erneut verhandeln. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie lernte das Nähen bei einer Verwandten und baute sich im Punjab einen Kundenkreis auf. Während der Teilung verliess sie ihre Werkstatt und kam bei Angehörigen unter. Sie besitzt ihr Können weiter, muss um Material, Räume und neue Kundschaft aber erneut verhandeln.",
    "social": "Verwandte bieten Unterkunft, haben aber eigene Grenzen. Frühere Nachbarschaft und neue politische Zugehörigkeiten fallen nicht einfach zusammen.",
    "practice": "Nachrichten über Vermisste und erinnerte Kundenbeziehungen bewahren Einzelheiten, die nationale Erzählungen leicht übergehen."
  },
  {
    "id": "vote1971",
    "year": 1971,
    "role": "Stimmbürgerin vor ihrer ersten eidgenössischen Abstimmung",
    "place": "Schweiz",
    "related": "vote",
    "memory": "Mein Mann erklärte mir früher oft, wie «wir» stimmen würden. An einer Vorlage hatten wir uns gestritten. Jetzt merke ich, dass ich seine Begründung noch immer zuerst im Kopf habe.",
    "attention": "Ich lese die Unterlagen selbst und notiere eine Frage. Meine Freundin ist anderer Meinung als ich; dass wir beide abstimmen dürfen, bedeutet nicht, dass wir dieselben Interessen vertreten.",
    "expectation": "In dieser Sache werde ich wohl gleich stimmen wie mein Mann. Meine Freundin hält das schon für ein Versagen. Das ärgert mich: Ich wollte das Stimmrecht nicht, damit nun sie mir vorschreibt, wie eine Frau zu entscheiden hat.",
    "limit": "Konstruierter Lebenslauf: Sie führte lange einen Haushalt und arbeitete zeitweise gegen Lohn. Politische Fragen besprach sie mit ihrem Mann, der auf Bundesebene allein abstimmen konnte. Nun erhält sie selbst dieses Recht; inhaltlich stimmt sie häufig mit ihm überein und will trotzdem nicht von ihm vertreten werden. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie führte lange einen Haushalt und arbeitete zeitweise gegen Lohn. Politische Fragen besprach sie mit ihrem Mann, der auf Bundesebene allein abstimmen konnte. Nun erhält sie selbst dieses Recht; inhaltlich stimmt sie häufig mit ihm überein und will trotzdem nicht von ihm vertreten werden.",
    "social": "Ehe, Freundschaft und Staatsbürgerrecht eröffnen unterschiedliche Formen der Mitsprache und des Widerspruchs.",
    "practice": "Frühere Gespräche und eigene Notizen beeinflussen den Umgang mit neuen politischen Rechten."
  },
  {
    "id": "berlin1989",
    "year": 1989,
    "role": "Student",
    "place": "Ost-Berlin, 8. November",
    "related": "wall",
    "memory": "Bei der letzten Diskussion wollte ein Freund vor allem ausreisen. Ich sprach von Veränderungen hier. Hinterher fragte ich mich, ob ich seine Gründe überhaupt angehört hatte.",
    "attention": "Wir vergleichen Meldungen über die politische Lage. Eine Freundin hofft auf eine andere DDR, ein anderer spricht von Weggehen. Ich teile ihre Unzufriedenheit, nicht jede Vorstellung danach.",
    "expectation": "Ich will reisen können und hier etwas verändern. Dass mein Freund einfach wegwill, empfinde ich als Stichlassen. Er sagt, ich könnte mir das Bleiben leichter leisten als er. Darüber will ich heute nicht weiterreden.",
    "limit": "Konstruierter Lebenslauf: Er wuchs in Ost-Berlin auf, erhielt einen Studienplatz und lernte dort seinen heutigen Freundeskreis kennen. Nach zunächst privaten Diskussionen besuchte er eine Protestveranstaltung. Er will Reformen, möchte seinen Studienplatz behalten und ist mit Freunden uneinig, die vor allem fortgehen wollen. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er wuchs in Ost-Berlin auf, erhielt einen Studienplatz und lernte dort seinen heutigen Freundeskreis kennen. Nach zunächst privaten Diskussionen besuchte er eine Protestveranstaltung. Er will Reformen, möchte seinen Studienplatz behalten und ist mit Freunden uneinig, die vor allem fortgehen wollen.",
    "social": "Freunde teilen Kritik, entwickeln daraus aber verschiedene Zukunftswünsche.",
    "practice": "Nachrichten, Protesterfahrungen und private Gespräche liefern konkurrierende Erwartungen, keine Kenntnis der folgenden Maueröffnung."
  },
  {
    "id": "murg1996",
    "year": 1996,
    "role": "Mechaniker der Spinnerei",
    "place": "Murg",
    "related": "local-murg1996",
    "memory": "An einem bestimmten Geräusch erkannte ich früher eine Störung. Ein Kollege nannte das meine besondere Fähigkeit. Jetzt fällt mir auf, wie sehr mein Ansehen an Maschinen hing, die bald stillstehen.",
    "attention": "Ich ordne Werkzeug und bespreche mit einem Kollegen, was noch zu erledigen ist. Er freut sich auf einen Wechsel. Seine Erleichterung macht meinen eigenen Verlust nicht kleiner, aber auch nicht allgemein gültig.",
    "expectation": "Ich will eine Stelle finden, an der meine Erfahrung zählt. Gleichzeitig frage ich mich, welche Fähigkeiten ich neu lernen muss und ob ich wieder Anfänger sein kann.",
    "limit": "Konstruierter Lebenslauf: Er begann als junger Arbeiter in der Spinnerei und wurde durch Reparaturerfahrung zum gefragten Mechaniker. Einen früheren Stellenwechsel schlug er aus. Mit der Schliessung verliert er deshalb nicht nur den Lohn, sondern auch eine Stellung, die er über Jahrzehnte aufgebaut hat. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Er begann als junger Arbeiter in der Spinnerei und wurde durch Reparaturerfahrung zum gefragten Mechaniker. Einen früheren Stellenwechsel schlug er aus. Mit der Schliessung verliert er deshalb nicht nur den Lohn, sondern auch eine Stellung, die er über Jahrzehnte aufgebaut hat.",
    "social": "Kollegen erleben dieselbe Schliessung verschieden; berufliches Wissen und Anerkennung lassen sich nicht vollständig in eine neue Stelle mitnehmen.",
    "practice": "Geräusche, Werkzeuge und gemeinsame Reparaturgeschichten bewahren Betriebswissen jenseits offizieller Firmengeschichte."
  },
  {
    "id": "archaeology2010",
    "year": 2010,
    "role": "Archäologin",
    "place": "Zürich, Sechseläutenplatz beim Opernhaus nahe Stadelhofen",
    "related": "local-opera",
    "memory": "Bei einer früheren Grabung hielten wir zwei Hölzer zunächst für zusammengehörig. Erst die Auswertung trennte die Bauphasen. An diese Korrektur denke ich jetzt vor jedem vorschnellen Zusammenhang.",
    "attention": "Die Holzlage passt gut zu unserer bisherigen Deutung. Mein Kollege mahnt zur Vorsicht. Ich trage die Unsicherheit ein, möchte aber nicht, dass in der Besprechung nur noch von Zweifeln die Rede ist.",
    "expectation": "Ich hoffe, dass die Datierung unsere Zuordnung bestätigt. Ein anderer Befund wäre auch ein Ergebnis, nur müssten wir vieles neu bearbeiten. Für meine nächste Bewerbung hätte ich gern etwas Abgeschlossenes vorzuweisen.",
    "limit": "Konstruierter Lebenslauf: Sie arbeitete nach dem Studium auf wechselnden Grabungen und lernte, unter Zeitdruck Befunde zu dokumentieren. Eine frühere Deutung musste sie zurücknehmen. Am Zürcher Opernhaus erhofft sie sich fachlich wichtige Ergebnisse und eine Fortsetzung ihrer Beschäftigung. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie arbeitete nach dem Studium auf wechselnden Grabungen und lernte, unter Zeitdruck Befunde zu dokumentieren. Eine frühere Deutung musste sie zurücknehmen. Am Zürcher Opernhaus erhofft sie sich fachlich wichtige Ergebnisse und eine Fortsetzung ihrer Beschäftigung.",
    "social": "Grabungsteam und spätere Spezialauswertung verfügen über unterschiedliche Ausschnitte des Befunds.",
    "practice": "Pläne, Proben und Dokumentation ermöglichen nachträgliche Korrekturen; persönliche Erinnerung allein reicht dafür nicht."
  },
  {
    "id": "paris2015",
    "year": 2015,
    "role": "Studentin",
    "place": "Paris",
    "related": "paris",
    "memory": "Mein Vater fragte bei unserer letzten Diskussion nach den Arbeitsplätzen in seiner Branche. Ich hielt das für Ausweichen. Beim Lesen des Abkommens fällt mir ein, dass ich ihm keine konkrete Antwort gab.",
    "attention": "Meine Freundin feiert das Abkommen, mein Vater fragt wieder nach den Arbeitsplätzen. Ich schicke ihm einen Artikel, den ich selbst erst überflogen habe. Heute möchte ich den Beschluss nicht schon wieder gegen seine Einwände verteidigen.",
    "expectation": "Ich möchte politisch mitarbeiten, ohne die Kosten für andere einfach wegzuerklären. Woran ich in einigen Jahren Erfolg messen würde, muss ich genauer benennen als nur mit «Abkommen erreicht».",
    "limit": "Konstruierter Lebenslauf: Sie kam zum Studium nach Paris und schloss sich einer Gruppe an, die über Klimapolitik diskutiert. Ihr Vater arbeitet in einer Branche, deren Zukunft dabei umstritten ist. Erste politische Aktivitäten verschaffen ihr Anerkennung im Freundeskreis und führen zu Streit in der Familie. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie kam zum Studium nach Paris und schloss sich einer Gruppe an, die über Klimapolitik diskutiert. Ihr Vater arbeitet in einer Branche, deren Zukunft dabei umstritten ist. Erste politische Aktivitäten verschaffen ihr Anerkennung im Freundeskreis und führen zu Streit in der Familie.",
    "social": "Freundeskreis und Familie verbinden globale Ziele mit ungleichen beruflichen und finanziellen Sorgen.",
    "practice": "Vertragstext, Berichterstattung und Familiengespräche machen verschiedene Massstäbe für denselben Beschluss sichtbar."
  },
  {
    "id": "image2023",
    "year": 2023,
    "role": "Nutzerin sozialer Medien",
    "place": "Zürich",
    "related": "ai",
    "memory": "Vor einigen Wochen teilte ich ein Bild zu schnell. Ein Freund korrigierte die Ortsangabe. Ich löschte es, schrieb aber nicht allen, die es von mir erhalten hatten.",
    "attention": "Die Aufnahme passt zu dem, was ich über den Krieg lese. Unter meinem letzten Beitrag verlangen Leute Belege. Ich suche nach einer Bestätigung; auf die erste gegenteilige Fundstelle klicke ich nicht sofort.",
    "expectation": "Ich möchte diesmal recht behalten. Wenn das Bild falsch ist, werde ich es entfernen. Eine weitere grosse Richtigstellung würde aber auch diejenigen bestärken, die meinen Beiträgen grundsätzlich misstrauen.",
    "limit": "Konstruierter Lebenslauf: Sie nutzt seit Jahren soziale Medien und wird im Bekanntenkreis oft nach Nachrichten gefragt. Ein häufig weitergeleiteter Beitrag brachte ihr Aufmerksamkeit. Nach einer öffentlich korrigierten Falschzuordnung achtet sie stärker auf Quellen, will ihren Ruf als gut informierte Person aber nicht verlieren. Lebensstationen, Beziehungen und Ich-Aussagen sind angenommen; sie sind keine überlieferte Biografie und stehen nicht für alle Menschen dieser Lebenslage.",
    "context": "Konstruierter Lebenslauf: Sie nutzt seit Jahren soziale Medien und wird im Bekanntenkreis oft nach Nachrichten gefragt. Ein häufig weitergeleiteter Beitrag brachte ihr Aufmerksamkeit. Nach einer öffentlich korrigierten Falschzuordnung achtet sie stärker auf Quellen, will ihren Ruf als gut informierte Person aber nicht verlieren.",
    "social": "Persönliches Vertrauen und Verantwortung gegenüber Empfängern wirken anders als die Reichweitenlogik einer Plattform.",
    "practice": "Chatverläufe, Bildunterschriften und frühere Veröffentlichungen ermöglichen Prüfung; auch eine Korrektur muss die ursprünglichen Empfänger erreichen."
  },
  {
    "id": "roman-sexworker",
    "year": 80,
    "role": "Prostituierte im antiken Rom",
    "place": "Rom",
    "related": "rome",
    "context": "Konstruierter Lebenslauf: Als Erwachsene aus der Sklaverei freigelassen, verdiente sie zunächst mit wechselnden Arbeiten und später mit Prostitution. Inzwischen ist sie etwa 32, mietet ein Zimmer und kennt zahlungskräftige Kunden. Einen Teil ihres Geldes gibt sie einer Verwandten; mit einer anderen Frau ist sie wegen abgeworbener Kundschaft zerstritten. Die Freilassung beendete nicht alle Abhängigkeiten.",
    "memory": "Anfangs wusste ich nicht, welcher Kunde zahlt und welcher nur verspricht. Eine ältere Frau half mir. Später kam einer ihrer besten Kunden zu mir; sie meint noch immer, ich hätte ihn ihr weggenommen. Ich habe ihn jedenfalls nicht zurückgeschickt.",
    "attention": "Ich zähle das Geld und lege mehr für mich zurück, als ich meiner Verwandten gesagt habe. Ein Stammkunde erwartet, dass ich nur für ihn da bin. Wenn er das will, soll er auch die Tage bezahlen, an denen er nicht kommt.",
    "expectation": "Mit einer Garküche hätte ich andere Arbeit, aber weniger Verdienst ist auch keine Freiheit. Vielleicht bleibe ich noch eine Weile dabei. Ich will selbst Rücklagen haben und nicht wieder von den Versprechen eines einzigen Mannes leben.",
    "social": "Kunden verfügen über Geld und können Gewalt ausüben; Vermieter und frühere Abhängigkeiten begrenzen Entscheidungen. Andere Frauen vermitteln Warnungen und Kontakte, stehen aber auch in Konkurrenz.",
    "practice": "Gerüchte und Kundenerinnerungen beeinflussen Sicherheit und Einkommen. Graffiti und literarische Darstellungen stammen oft aus einer männlichen Aussenperspektive und erschliessen keine vollständige Frauenbiografie.",
    "critical": "Gesellschaftliche Stigmatisierung ist keine persönliche Schuld. Erwerbsentscheidungen unter wirtschaftlichem Druck sind von sexueller Ausbeutung und Gewalt durch andere zu unterscheiden.",
    "counterMemory": "Die Figur ist weder ein Gegenbild moralischer Reinheit noch durch ihre Erwerbstätigkeit schuldig. Die frühere Helferin würde den Streit um Kundschaft anders erzählen. Abhängigkeiten, Stigma und mögliche Gewalt müssen neben ihren eigenen Entscheidungen untersucht werden.",
    "references": [
      [
        "Archäologischer Park Pompeji: Grabungsführer, Abschnitt Lupanar (Vergleichsort, nicht Rom)",
        "https://pompeiisites.org/wp-content/uploads/Guida-agli-scavi-di-Pompeii1.pdf"
      ],
      [
        "British Museum: Sklaverei und Freilassung im antiken Rom",
        "https://www.britishmuseum.org/exhibitions/nero-man-behind-myth/slavery-ancient-rome"
      ]
    ],
    "limit": "Konstruierter Lebenslauf: Als Erwachsene aus der Sklaverei freigelassen, verdiente sie zunächst mit wechselnden Arbeiten und später mit Prostitution. Inzwischen ist sie etwa 32, mietet ein Zimmer und kennt zahlungskräftige Kunden. Einen Teil ihres Geldes gibt sie einer Verwandten; mit einer anderen Frau ist sie wegen abgeworbener Kundschaft zerstritten. Die Freilassung beendete nicht alle Abhängigkeiten. Alle persönlichen Lebensstationen und Ich-Aussagen sind konstruiert. Die Quellen erläutern den historischen Rahmen, nicht diese Biografie."
  },
  {
    "id": "feud-knight",
    "year": 1400,
    "role": "Niederadliger Fehdeführer («Raubritter»)",
    "place": "Oberrhein",
    "related": "medievalworld",
    "context": "Konstruierter Lebenslauf: Er wuchs als jüngerer Sohn eines niederadligen Hauses auf und diente zunächst einem mächtigeren Herrn. Nach einer Erbteilung erhielt er wenig Einkommen, hielt aber an standesgemässen Ausgaben fest. Mit etwa 40 unterhält er bewaffnete Gefolgsleute, verschuldet sich und nimmt eine strittige Forderung gegen eine Stadt zum Anlass für Überfälle. «Raubritter» ist eine spätere wertende Sammelbezeichnung.",
    "memory": "Mein Vater hätte sich von diesen Kaufleuten nicht hinhalten lassen. Früher achtete man den Namen unseres Hauses. Seit wir die ersten Wagen festgesetzt haben, schickt die Stadt wenigstens jemanden, der mit mir spricht.",
    "attention": "Der Fuhrmann behauptet, mit dem Streit nichts zu tun zu haben. Seine Ladung gehört einem Bürger der Stadt, das genügt mir. Ich lasse die Forderung aufschreiben und halte ihn fest, bis jemand bezahlt. Meine Leute wollen ihren Anteil.",
    "expectation": "Ich werde nicht mit leeren Händen nachgeben. Wenn die Stadt zahlt, kann ich meine Männer halten und einen Teil der Schulden begleichen. Danach will ich eine Verbindung für meine Tochter finden, die unserem Haus wieder Gewicht gibt.",
    "social": "Familienansehen, Gefolgschaft und materielle Interessen verstärken die Gewalt. Kaufleute, Fuhrleute und bäuerliche Haushalte tragen Schäden, obwohl sie nicht selbst die Fehde begonnen haben.",
    "practice": "Fehdebriefe und Familienerzählungen begründen Ansprüche; Beschwerden und städtische Rechnungen können Überfälle, Lösegeld und Verluste aus anderer Sicht dokumentieren.",
    "critical": "Die Berufung auf Ehre oder Fehderecht rechtfertigt nicht automatisch den konkreten Überfall. Seine Selbstdarstellung verdeckt Gewalt gegen Unbeteiligte.",
    "counterMemory": "Was würden die festgehaltenen Fuhrleute über denselben Tag berichten? Zu prüfen sind Anspruch, Ankündigung, Verlauf und Schäden; «Fehde» und «Raub» dürfen nicht allein nach der Wortwahl des Adligen unterschieden werden.",
    "references": [
      [
        "Historisches Lexikon der Schweiz: Fehde, Regeln und Gewaltpraxis",
        "https://hls-dhs-dss.ch/de/articles/008606/2006-10-23/"
      ]
    ],
    "limit": "Konstruierter Lebenslauf: Er wuchs als jüngerer Sohn eines niederadligen Hauses auf und diente zunächst einem mächtigeren Herrn. Nach einer Erbteilung erhielt er wenig Einkommen, hielt aber an standesgemässen Ausgaben fest. Mit etwa 40 unterhält er bewaffnete Gefolgsleute, verschuldet sich und nimmt eine strittige Forderung gegen eine Stadt zum Anlass für Überfälle. «Raubritter» ist eine spätere wertende Sammelbezeichnung. Alle persönlichen Lebensstationen und Ich-Aussagen sind konstruiert. Die Quellen erläutern den historischen Rahmen, nicht diese Biografie."
  },
  {
    "id": "jacobin1794",
    "year": 1794,
    "role": "Anhänger des Wohlfahrtsausschusses",
    "place": "Paris, Frühjahr 1794",
    "related": "revolution",
    "context": "Konstruierter Lebenslauf: Er arbeitete als Schreiber und konnte vor der Revolution kaum auf ein öffentliches Amt hoffen. Er schloss sich einer politischen Sektion an, unterstützte die Republik und gelangte in ein lokales Überwachungskomitee. Mit etwa 35 verfügt er über Akten und Einfluss. Ein alter Zahlungsstreit mit einem Händler geht inzwischen in eine politische Beschuldigung ein. Er unterstützt den Wohlfahrtsausschuss, gehört ihm aber nicht an.",
    "memory": "Vor wenigen Jahren hätten Leute wie dieser Händler mich warten lassen. Jetzt muss er auf unsere Fragen antworten. Als ich mich für die Republik einsetzte, haben andere abgewartet. Ich sehe nicht ein, warum gerade sie heute unsere Entschlossenheit beurteilen sollen.",
    "attention": "Der Zeuge hat die Worte nicht selbst gehört. Dennoch passen sie zu allem, was wir über den Mann erfahren haben. Ich nehme die Aussage auf. Wir können nicht jede Massnahme aufschieben, bis auch der letzte Zweifler zufrieden ist.",
    "expectation": "Ich erwarte, dass die Republik sich gegen ihre Gegner behauptet. Dann wird man wissen, wer in der Gefahr standgehalten hat. Den Händler einfach freizulassen, wäre für mich ein Eingeständnis, dass wir uns von Anfang an getäuscht hätten.",
    "social": "Politische Überzeugung, örtliche Konflikte und persönliches Fortkommen wirken zusammen. Komiteekollegen belohnen Eifer; Beschuldigte und Angehörige verfügen nicht über denselben Einfluss auf die Akte.",
    "practice": "Protokolle verwandeln wechselhafte Aussagen in amtlich wirkende Gewissheit. Spätere Selbstberichte können Beteiligung verkleinern oder als notwendige Pflichterfüllung darstellen.",
    "critical": "Republikanische Ziele, Kriegsangst und Gruppendruck erklären Motive, entlasten aber nicht von der Verantwortung für verfälschte Aussagen und Verfolgung.",
    "counterMemory": "Welche Formulierungen machen aus einem Gerücht eine scheinbare Tatsache? Einwände der Beschuldigten, Entlastungszeugnisse und unterschiedliche Fassungen einer Akte müssen neben die Selbstrechtfertigung treten.",
    "references": [
      [
        "L’Histoire par l’image: lokale revolutionäre Komitees unter der Terreur",
        "https://histoire-image.org/etudes/comite-revolutionnaire-terreur"
      ]
    ],
    "limit": "Konstruierter Lebenslauf: Er arbeitete als Schreiber und konnte vor der Revolution kaum auf ein öffentliches Amt hoffen. Er schloss sich einer politischen Sektion an, unterstützte die Republik und gelangte in ein lokales Überwachungskomitee. Mit etwa 35 verfügt er über Akten und Einfluss. Ein alter Zahlungsstreit mit einem Händler geht inzwischen in eine politische Beschuldigung ein. Er unterstützt den Wohlfahrtsausschuss, gehört ihm aber nicht an. Alle persönlichen Lebensstationen und Ich-Aussagen sind konstruiert. Die Quellen erläutern den historischen Rahmen, nicht diese Biografie."
  },
  {
    "id": "java1900",
    "year": 1900,
    "role": "Nyai eines niederländischen Grossgrundbesitzers",
    "place": "Java, Niederländisch-Indien",
    "related": "materialism",
    "context": "Konstruierter Lebenslauf: Sie kam als junge Erwachsene in den Haushalt eines niederländischen Plantagen- und Grossgrundbesitzers. Daraus entstand eine unverheiratete Beziehung; sie bekam ein Kind und übernahm die Haushaltsführung. Mit etwa 30 verfügt sie über Geld für Einkäufe und erteilt Angestellten Anweisungen, wird im europäischen Bekanntenkreis aber oft übergangen. An ihrer besseren materiellen Stellung gegenüber Verwandten hält sie fest. Nyai bezeichnet hier diese koloniale Verbindung von Hausarbeit und Partnerschaft.",
    "memory": "Meine Schwester sagte, ich hätte mich an ihn verkauft. Als ihr Geld fehlte, nahm sie meine Hilfe trotzdem an. Er kann zärtlich sein; ich kenne aber auch die Abende, an denen er mich vor seinen Gästen behandelt wie eine Angestellte.",
    "attention": "Die Hausangestellte will zu ihrer Familie. Ich brauche sie heute hier und lehne ab. Mein Partner hat Besuch angekündigt; wenn etwas fehlt, fragt er mich danach. Den Gästen will ich keinen Anlass geben, über unseren Haushalt zu lachen.",
    "expectation": "Unser Kind soll eine gute Ausbildung erhalten und nicht so abhängig sein wie meine Schwester. Wenn er dafür eine Reise nach Europa plant, will ich mitentscheiden. Eine europäische Ehefrau, die eines Tages meinen Platz übernimmt, werde ich nicht freundlich willkommen heissen.",
    "social": "Zuneigung und Abhängigkeit schliessen sich nicht aus. Gegenüber dem europäischen Besitzer ist sie benachteiligt, gegenüber Hausangestellten übt sie selbst Macht aus. Koloniale Statusordnungen prägen die Familie.",
    "practice": "Familienfotos können die Mutter ausblenden, obwohl ihre Arbeit den Haushalt trägt. Briefe und Verwaltungsakten erfassen Beziehungen nach anderen Kategorien als die Beteiligten.",
    "critical": "Die Beziehung wird weder als romantische Gleichberechtigung noch als vollständige Willenlosigkeit dargestellt. Ihr begrenzter Einfluss im Haushalt hebt koloniale und geschlechtliche Abhängigkeit nicht auf.",
    "counterMemory": "Die Schwester könnte ihre Hilfe als Verpflichtung erleben, die Angestellte ihre Haushaltsführung als Zwang. Zuneigung, eigenes Vorteilsstreben und koloniale Benachteiligung bestehen nebeneinander. Die konkrete Rechtsstellung von Mutter und Kind ist nicht aus dieser Stimme abzuleiten.",
    "references": [
      [
        "Wereldmuseum Leiden: Nyai, Familienbeziehungen und koloniale Fotografie",
        "https://leiden.wereldmuseum.nl/nl/wereldverhalen/familieverbanden-in-de-koloniale-tijd-indonesie"
      ]
    ],
    "limit": "Konstruierter Lebenslauf: Sie kam als junge Erwachsene in den Haushalt eines niederländischen Plantagen- und Grossgrundbesitzers. Daraus entstand eine unverheiratete Beziehung; sie bekam ein Kind und übernahm die Haushaltsführung. Mit etwa 30 verfügt sie über Geld für Einkäufe und erteilt Angestellten Anweisungen, wird im europäischen Bekanntenkreis aber oft übergangen. An ihrer besseren materiellen Stellung gegenüber Verwandten hält sie fest. Nyai bezeichnet hier diese koloniale Verbindung von Hausarbeit und Partnerschaft. Alle persönlichen Lebensstationen und Ich-Aussagen sind konstruiert. Die Quellen erläutern den historischen Rahmen, nicht diese Biografie."
  },
  {
    "id": "pow1946",
    "year": 1946,
    "role": "Ehemaliger Wehrmacht- und Waffen-SS-Soldat in Gefangenschaft",
    "place": "Sowjetunion",
    "related": "history",
    "context": "Konstruierter Lebenslauf: Als junger Mann begrüsste er den nationalsozialistischen Aufstieg und trat später ins Heer ein. Im besetzten Osten bewachte er Zivilisten, die anschliessend ermordet wurden. Für das Modell ist 1944 ein Wechsel zur Waffen-SS angenommen; Wehrmacht und Waffen-SS waren verschiedene Organisationen. Seit 1945 ist er sowjetischer Kriegsgefangener. Mit etwa 30 erlebt er Hunger und Krankheit und hält an Teilen seines früheren Selbstbildes fest. Keine reale Person oder Einheit wird damit identifiziert.",
    "memory": "Ich war stolz auf meine Uniform und darauf, nicht zu denen zu gehören, die immer nur redeten. Bei der Absperrung standen auch Kinder. Ich hatte meinen Posten; geschossen haben andere. So habe ich es damals gesehen, und dabei bleibe ich.",
    "attention": "Im Brief schreibe ich, dass ich lebe und nach Hause will. Ein Mitgefangener fragt nach unserem Einsatz im Osten. Ich sage ihm, er solle sich um seine eigenen Angelegenheiten kümmern. Über das, was wir hier durchmachen, können wir reden.",
    "expectation": "Meine Familie soll erfahren, was die Gefangenschaft mit mir gemacht hat. Ich rechne damit, dass alte Kameraden zu mir halten. Wenn man mich nach den Erschiessungen fragt, werde ich sagen, dass ich Wache stand. Mehr sollen sie mir erst einmal nachweisen.",
    "social": "Militärische Befehle, eigene Zustimmung und Kameradschaft können Beteiligung begünstigen. In Gefangenschaft entsteht eine Leidensgemeinschaft, die individuelle Verantwortlichkeiten zugleich verdecken kann.",
    "practice": "Feldpost, Lagerbriefe, Einheitsunterlagen und Aussagen Überlebender besitzen unterschiedliche Leerstellen. Eine spätere Opfererzählung kann tatsächliches Leiden enthalten und frühere Täterschaft ausblenden.",
    "critical": "Wehrmacht und Waffen-SS waren verschiedene Organisationen; hier ist ein Wechsel modelliert. Das Leiden in Gefangenschaft hebt Verantwortung für die Mitwirkung an einem Kriegsverbrechen nicht auf.",
    "counterMemory": "«Nur Wache» ist hier eine Selbstentlastung, kein Nachweis fehlender Verantwortung. Die modellierte Beteiligung muss neben Aussagen Überlebender und Tatunterlagen stehen. Hunger und Krankheit in Gefangenschaft sind damit weder zu leugnen noch als Ausgleich für frühere Verbrechen zu verrechnen.",
    "references": [
      [
        "USHMM: Waffen-SS und ihre organisatorische Stellung",
        "https://encyclopedia.ushmm.org/content/en/article/waffen-ss"
      ],
      [
        "USHMM: Beteiligung der Wehrmacht an Verbrechen und Holocaust",
        "https://www.ushmm.org/outreach-programs/military/role-of-the-german-military"
      ],
      [
        "Deutsches Historisches Museum: Kriegsgefangenschaft",
        "https://www.dhm.de/lemo/kapitel/der-zweite-weltkrieg/kriegsverlauf/kriegsgefangenschaft"
      ]
    ],
    "limit": "Konstruierter Lebenslauf: Als junger Mann begrüsste er den nationalsozialistischen Aufstieg und trat später ins Heer ein. Im besetzten Osten bewachte er Zivilisten, die anschliessend ermordet wurden. Für das Modell ist 1944 ein Wechsel zur Waffen-SS angenommen; Wehrmacht und Waffen-SS waren verschiedene Organisationen. Seit 1945 ist er sowjetischer Kriegsgefangener. Mit etwa 30 erlebt er Hunger und Krankheit und hält an Teilen seines früheren Selbstbildes fest. Keine reale Person oder Einheit wird damit identifiziert. Alle persönlichen Lebensstationen und Ich-Aussagen sind konstruiert. Die Quellen erläutern den historischen Rahmen, nicht diese Biografie."
  },
  {
    "id": "liberia2003",
    "year": 2003,
    "role": "Als Kind rekrutierter Soldat",
    "place": "Liberia, nach dem Waffenstillstand",
    "related": "history",
    "context": "Konstruierter Lebenslauf: Mit 13 wurde er gewaltsam einer bewaffneten Gruppe angeschlossen, zunächst als Träger und Helfer, später mit einer Waffe. Er bedrohte Zivilpersonen und beteiligte sich an Plünderungen. Anerkennung durch ältere Kämpfer und Zugriff auf Lebensmittel banden ihn zusätzlich an die Gruppe. Nach dem Waffenstillstand 2003 ist er 15 und versucht, ausserhalb der Einheit zurechtzukommen. Zwang, Bindung und zeitweise genossene Macht werden zusammen modelliert.",
    "memory": "Zuerst hatte ich Angst vor allen. Später musste der Händler mir etwas geben, wenn ich kam. Die älteren Kämpfer lachten und nannten mich mutig. Ich erinnere mich gern an das Lob; an das Gesicht des Händlers nicht.",
    "attention": "Hier werde ich wieder behandelt wie ein kleiner Junge. Ich soll warten, wenn Erwachsene sprechen. Ein früherer Kamerad nimmt mich ernst und nennt mich bei meinem Kriegsnamen. Ich bin froh, ihn zu sehen, auch wenn ich nicht wieder mit ihm fortwill.",
    "expectation": "Ich will zu meiner Familie, wenn sie noch dort ist. Zur Schule gehen wäre gut, aber nicht, wenn alle über mich lachen. Ich will die Waffe nicht zurückhaben; dass niemand mehr auf mich hört, gefällt mir trotzdem nicht.",
    "social": "Erwachsene Rekrutierer und Kommandeure üben Gewalt und Kontrolle aus. Beziehungen zu anderen Kindern bieten Schutz und binden an die Gruppe. Betroffene Zivilpersonen behalten eigene Ansprüche und Erinnerungen.",
    "practice": "Kriegsnamen und Gruppenerzählungen prägen Zugehörigkeit. Gespräche bei der Reintegration können frühere Identitäten wieder zugänglich machen, dürfen aber kein erzwungenes öffentliches Geständnis verlangen.",
    "critical": "Ein zwangsrekrutiertes Kind ist besonders schutzbedürftig. Erlittener Zwang und verursachtes Leid müssen gemeinsam sichtbar bleiben, ohne seine Verantwortung mit der erwachsener Rekrutierer gleichzusetzen.",
    "counterMemory": "Die Perspektive des bedrohten Händlers widerspricht der Erinnerung an Anerkennung. Dass ein Kind zeitweise Macht erlebt oder vermisst, beseitigt weder den Rekrutierungszwang noch die Verantwortung erwachsener Kommandeure. Eine solche Reaktion darf nicht allen betroffenen Kindern zugeschrieben werden.",
    "references": [
      [
        "Human Rights Watch: Interviews und Untersuchung zum Einsatz von Kindern in Liberia (2004)",
        "https://www.hrw.org/report/2004/02/02/how-fight-how-kill/child-soldiers-liberia"
      ]
    ],
    "limit": "Konstruierter Lebenslauf: Mit 13 wurde er gewaltsam einer bewaffneten Gruppe angeschlossen, zunächst als Träger und Helfer, später mit einer Waffe. Er bedrohte Zivilpersonen und beteiligte sich an Plünderungen. Anerkennung durch ältere Kämpfer und Zugriff auf Lebensmittel banden ihn zusätzlich an die Gruppe. Nach dem Waffenstillstand 2003 ist er 15 und versucht, ausserhalb der Einheit zurechtzukommen. Zwang, Bindung und zeitweise genossene Macht werden zusammen modelliert. Alle persönlichen Lebensstationen und Ich-Aussagen sind konstruiert. Die Quellen erläutern den historischen Rahmen, nicht diese Biografie."
  },
  {
    "id": "neonazi1993",
    "year": 1993,
    "role": "Neonazi in einer ostdeutschen Kleinstadt",
    "place": "Sachsen",
    "related": "history",
    "context": "Konstruierter Lebenslauf: Schon vor der Vereinigung suchte er Anschluss an eine rechte Clique. Nach 1990 lernte er weitere Aktivisten kennen, ging zu Szenetreffen und arbeitete zeitweise regulär. Mit 22 beteiligt er sich an einem rassistischen Übergriff. Er findet Zustimmung in Teilen seines Umfelds, verliert aber einen alten Freund. Er ist weder als arbeitsloser Automatismus noch als bereits geläuterter Aussteiger angelegt.",
    "memory": "Nach dem Angriff sagten die anderen, auf mich sei Verlass. Mein alter Freund nennt mich seitdem einen Schläger. Früher kam er selbst mit uns mit; jetzt tut er, als hätte er nie dazugehört. Ich vermisse ihn, aber nachlaufen werde ich ihm nicht.",
    "attention": "Meine Schwester will wissen, was uns der Mann getan habe. Ich antworte, sie verstehe nicht, worum es gehe. Dass wir ihn wegen seiner Herkunft ausgesucht haben, bestreite ich ihr gegenüber. Bei den anderen muss ich das nicht verstecken.",
    "expectation": "Ich will in der Gruppe etwas gelten und bei den nächsten Treffen wieder dabei sein. Wegen einer Anzeige werde ich meine Ansichten nicht ändern. Vielleicht braucht mein alter Freund irgendwann selbst Hilfe; dann wird er schon wissen, wo er mich findet.",
    "social": "Cliquenanerkennung, rassistische Ideologie und Zustimmung oder Wegsehen im Umfeld stützen Gewalt. Die Schwester und der frühere Freund zeigen, dass dasselbe regionale Umfeld auch Widerspruch ermöglicht.",
    "practice": "Wiederholte Cliquenerzählungen stellen Angriffe als angebliche Abwehr dar. Aussagen Betroffener, Zeugenaussagen und Gerichtsunterlagen können diese Umdeutung widerlegen.",
    "critical": "Die Ich-Aussagen legen rassistische Auswahl und Selbstrechtfertigung offen. Sie sind keine Zustimmung zur Ideologie; die Perspektive des Angegriffenen darf nicht hinter den Sorgen des Täters verschwinden.",
    "counterMemory": "Die Clique belohnt rassistische Gewalt und die Figur hält an ihrer Zugehörigkeit fest. Freundschaft und Erwerbsarbeit widersprechen der Täterschaft nicht. Für den Angegriffenen gehören Bedrohung und eingeschränkte Bewegungsfreiheit zur Geschichte, auch wenn der Täter davon nicht sprechen will.",
    "references": [
      [
        "Bundeszentrale für politische Bildung: rechte Gewalt in Ost und West",
        "https://www.bpb.de/themen/deutschlandarchiv/270811/rechte-gewalt-in-ost-und-west/"
      ]
    ],
    "limit": "Konstruierter Lebenslauf: Schon vor der Vereinigung suchte er Anschluss an eine rechte Clique. Nach 1990 lernte er weitere Aktivisten kennen, ging zu Szenetreffen und arbeitete zeitweise regulär. Mit 22 beteiligt er sich an einem rassistischen Übergriff. Er findet Zustimmung in Teilen seines Umfelds, verliert aber einen alten Freund. Er ist weder als arbeitsloser Automatismus noch als bereits geläuterter Aussteiger angelegt. Alle persönlichen Lebensstationen und Ich-Aussagen sind konstruiert. Die Quellen erläutern den historischen Rahmen, nicht diese Biografie."
  }
];
const CHARACTER_SOCIAL_CONTEXTS=[
 'Schreiberkollegen, Auftraggeber und Angehörige','Werkstatt, Haushalt und Kundschaft','Andere versklavte Menschen und die Personen, die über ihre Arbeit verfügen','Haushalt, Werkstatt und Reisende am Alpenweg','Familie, Kundschaft und andere Händlerinnen','Werkstattgemeinschaft und Auftraggeber','Klostergemeinschaft und wiederkehrende Gottesdienste','Konvent und religiöse Texte','Andere Arbeiter und Menschen an beiden Seeufern','Werkstatt und Haushalt unter einer neuen Dynastie','Druckwerkstatt, Setzer und Auftraggeber','Haushalt und örtliche Gemeinschaft vor dem europäischen Kontakt','Schreiber, Lehrende und Besitzer von Handschriften','Haushalt, Nachbarschaft und religiöse Gemeinde','Andere Bergarbeiter und Haushalt','Haushalt, Nachbarschaft und politische Gespräche','Andere versklavte Menschen und Verwandtschaftsbeziehungen','Arbeiter am Kanal und Menschen aus der Linthebene','Arbeitskolleginnen und Haushalt','Andere Beschäftigte, Angehörige und Kurgäste','Andere Schiffer und Menschen entlang des Sees','Familie, Schule und gelesene Bücher','Angehörige, Nachbarschaft und öffentliche Todesanzeigen','Familie, Nachbarschaft und Vertriebene','Familie, Bekannte und politische Öffentlichkeit','Freundeskreis, Hochschule und staatliche Medien','Arbeitskollegen und Angehörige','Grabungsteam und wissenschaftliche Dokumentation','Freundeskreis, Nachrichten und Klimadebatten','Persönliche Kontakte, Plattformen und weitergeleitete Bilder'
];
let augustineCharacterIndex=Math.floor(Math.random()*AUGUSTINE_CHARACTERS.length),augustineExperience='person';
function characterLibrary(){return [...AUGUSTINE_CHARACTERS,...(state.avatars||[])].sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id))}
function nextAugustineCharacter(current,random=Math.random(),count=AUGUSTINE_CHARACTERS.length){return (current+1+Math.floor(Math.max(0,Math.min(.999999999,random))*(count-1)))%count}
function augustineCharacter(){return characterLibrary().find(c=>c.id===state.activeAvatar)||AUGUSTINE_CHARACTERS[augustineCharacterIndex]}
function characterPortraitId(c){if(AUGUSTINE_CHARACTERS.some(x=>x.id===c.portraitId))return c.portraitId;if(!c.own)return c.id;const hash=[...c.id].reduce((n,ch)=>(n+ch.charCodeAt(0))%AUGUSTINE_CHARACTERS.length,0);return AUGUSTINE_CHARACTERS[hash].id}
function characterPortraitHtml(c){const own=!!c.portraitData;return `<img class="character-portrait" src="${esc(own?c.portraitData:imageSrc('portrait-'+characterPortraitId(c)+'.jpg'))}" width="56" height="56" alt="${own?'Eigenes Profilbild':'KI-generierte Porträtillustration'}: ${esc(c.name||c.role)}" title="${own?'Eigenes Profilbild':'Illustration des Personenmodells · kein historisches Porträt'}" loading="lazy">`}
function openCharacterGallery(){let dialog=$('#characterGallery');if(!dialog){dialog=document.createElement('dialog');dialog.id='characterGallery';document.body.append(dialog)}dialog.innerHTML=`<header><h2>Person wählen</h2><button data-gallery-close>Schliessen ×</button></header><p>KI-generierte Porträtillustrationen der Personenmodelle, keine historischen Bildquellen. Eigene Uploads sind im Profil gekennzeichnet.</p><div class="character-gallery-grid">${characterLibrary().map(c=>`<button data-gallery-character="${esc(c.id)}" aria-pressed="${c.id===augustineCharacter().id}">${characterPortraitHtml(c)}<span><strong>${esc(c.name||c.role)}</strong><small>${yr(c.year)} · ${esc(c.place)}</small></span></button>`).join('')}</div>`;dialog.querySelector('[data-gallery-close]').onclick=()=>dialog.close();dialog.querySelectorAll('[data-gallery-character]').forEach(b=>b.onclick=()=>{dialog.close();selectCharacter(b.dataset.galleryCharacter)});dialog.showModal()}
function characterSocial(c){const i=AUGUSTINE_CHARACTERS.findIndex(x=>x.id===c.id);return c.social||(i>=0?CHARACTER_SOCIAL_CONTEXTS[i]:'Noch keine sozialen Beziehungen angegeben')}
function selectCharacter(id){const c=characterLibrary().find(x=>x.id===id);if(!c)return;stopAugustine();state.activeAvatar=id;const i=AUGUSTINE_CHARACTERS.findIndex(x=>x.id===id);if(i>=0)augustineCharacterIndex=i;augustineExperience='person';ensureReading('memoria');state.notes['premise-memoria-group']=(c.name?c.name+' · ':'')+c.role+' · '+c.place+' · '+yr(c.year);state.notes['premise-memoria-practice']=characterSocial(c)+(c.practice?' · '+c.practice:'');state.notes['premise-memoria-selection']=c.memory;captureReadings();save();render()}
function characterPickerHtml(){const c=augustineCharacter();return `${characterPortraitHtml(c)}<label>Person <select data-conscious-character aria-label="Historische Ich-Perspektive">${characterLibrary().map(v=>`<option value="${esc(v.id)}" ${v.id===c.id?'selected':''}>${yr(v.year)} · ${esc(v.name?v.name+' · '+v.role:v.role)} · ${esc(v.place)}</option>`).join('')}</select></label><button data-character-gallery>Personen mit Bildern</button><button data-conscious-random>Andere Person zufällig ↻</button><button data-avatar-new>Eigenen Avatar erstellen +</button>${c.own?'<button data-avatar-edit>Avatar bearbeiten</button>':''}`}
function augustineCharacterControls(){const c=augustineCharacter();return `<div class="conscious-character-controls"><div class="conscious-experience" role="group" aria-label="Zeiterfahrung wählen"><button data-conscious-view="person" aria-pressed="${augustineExperience==='person'}">Ich-Perspektive</button><button data-conscious-view="sound" aria-pressed="${augustineExperience==='sound'}">Klangfolge</button></div>${characterPickerHtml()}<span class="character-disclaimer">${AUGUSTINE_CHARACTERS.length} historische Personenmodelle${state.avatars?.length?' · '+state.avatars.length+' eigene Avatare':''} · Konstruierte Biografien und Ich-Stimmen · keine Quellenzitate</span></div>${augustineExperience==='person'?`<div class="conscious-character-context"><strong>${esc(c.name?c.name+' · ':'')}${esc(c.role)} · ${esc(c.place)} · ${yr(c.year)}</strong><span>${esc(c.critical||'Eine modellierte Einzelperspektive. Alle drei Bezüge vollziehen sich in ihrem Jetzt.')}</span></div>`:''}`}
function characterEvidenceHtml(c){return `${c.counterMemory?`<p><strong>Einordnung ausserhalb der Ich-Stimme:</strong> ${esc(c.counterMemory)}</p>`:''}${c.references?.length?`<ul>${c.references.map(([label,url])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a></li>`).join('')}</ul>`:''}`}
function memoryCharacterHtml(){const c=augustineCharacter();return `<section class="memory-character"><div class="conscious-character-controls">${characterPickerHtml()}</div><div class="memory-person">${characterPortraitHtml(c)}<div><h3>${esc(c.name?c.name+' · ':'')}${esc(c.role)} · ${yr(c.year)}</h3><p>${esc(c.place)} · ${esc(c.context||c.limit)}</p></div></div><div class="memory-relations"><div><strong>Was ist dieser Person erinnerlich?</strong><p>${esc(c.memory)}</p></div><div><strong>In welchen Beziehungen erinnert sie?</strong><p>${esc(characterSocial(c))}</p></div><div><strong>Wie wird Erinnerung vermittelt?</strong><p>${esc(c.practice||'Gespräche, Handlungen und überlieferte Zeugnisse dieser Lebenswelt untersuchen. Welche davon diese Person kennt, ist damit noch nicht belegt.')}</p></div></div>${c.critical?`<p class="character-critical">${esc(c.critical)}</p><details><summary>Lebenslage, Gegenperspektiven und Quellen</summary><p>${esc(c.limit)}</p>${characterEvidenceHtml(c)}</details>`:''}<p class="small"><strong>Untersuchter sozialer Rahmen:</strong> ${esc(premiseValue('memoria','group')||characterSocial(c))}</p>${c.source?`<p class="small"><strong>Quellen / Annahmen:</strong> ${esc(c.source)}</p>`:''}<p class="small">Personenmodell, keine überlieferte Biografie. Prüfe an Quellen, was aus dieser Lebenslage tatsächlich bekannt sein konnte. Spätere Ereignisse sind heutige Rückblicke, keine Erinnerungen der Person.</p></section>`}
function openAvatarEditor(edit=false){let dialog=$('#avatarEditor');if(!dialog){dialog=document.createElement('dialog');dialog.id='avatarEditor';document.body.append(dialog)}const c=edit?augustineCharacter():{};const fields=[['name','Name oder selbst gewählte Bezeichnung',true],['role','Tätigkeit / gesellschaftliche Stellung',true],['place','Ort',true],['context','Lebensumstände',true],['memory','Ich erinnere mich …',true],['attention','Ich nehme gerade wahr …',true],['expectation','Ich erwarte / hoffe / befürchte …',true],['social','Menschen und Gruppen, die mein Erinnern prägen',true],['practice','Gespräche, Texte, Bilder, Rituale oder Gegenstände',false],['source','Quellen / was bleibt angenommen?',true]];dialog.innerHTML=`<form id="avatarForm"><header><h2>${edit?'Avatar bearbeiten':'Eigenen historischen Avatar erstellen'}</h2><button type="button" data-avatar-close>Schliessen ×</button></header><p>Du bestimmst eine einzelne Person und ihre Lebenslage. Aus deinen Angaben entsteht ein gespeichertes Personenprofil mit eigenem Profilbild. Es wird keine historische Biografie automatisch behauptet.</p><label>Jahr (negative Zahl = v. u. Z.; kein Jahr 0)<input name="year" type="number" required min="-100000" max="10000" step="1" value="${c.year||''}"></label><fieldset class="avatar-picture"><legend>Profilbild</legend><div id="avatarPortraitPreview">${characterPortraitHtml(c.id?c:augustineCharacter())}</div><label>Illustration auswählen<select name="portraitId">${AUGUSTINE_CHARACTERS.map(v=>`<option value="${v.id}" ${v.id===characterPortraitId(c.id?c:augustineCharacter())?'selected':''}>${yr(v.year)} · ${esc(v.role)}</option>`).join('')}</select></label><label>Oder eigenes Bild hochladen (PNG, JPEG, WebP; bis 2 MB)<input type="file" name="portraitFile" accept="image/png,image/jpeg,image/webp"></label><label><input type="checkbox" name="replacePortrait">Bisherigen Upload durch die ausgewählte Illustration ersetzen</label><small>Die angebotenen Bilder sind KI-generierte Illustrationen. Wähle das Bild selbst; aus Beruf oder Herkunft wird kein Aussehen abgeleitet.</small></fieldset><div class="avatar-fields">${fields.map(([key,label,required])=>`<label>${label}${['name','role','place'].includes(key)?`<input name="${key}" maxlength="180" ${required?'required':''} value="${esc(c[key]||'')}">`:`<textarea name="${key}" maxlength="3000" rows="2" ${required?'required':''}>${esc(c[key]||'')}</textarea>`}</label>`).join('')}</div><p id="avatarError" role="alert"></p><button type="submit">${edit?'Änderungen speichern':'Avatar erzeugen und verwenden'}</button><p class="small">Auf diesem Gerät gespeichert; über «Eigene Arbeit & Sicherung» exportierbar. In Augustinus und Memoria wählbar.</p></form>`;dialog.querySelector('[data-avatar-close]').onclick=()=>dialog.close();dialog.querySelector('[name=portraitId]').onchange=e=>{$('#avatarPortraitPreview').innerHTML=characterPortraitHtml({id:e.target.value});dialog.querySelector('[name=replacePortrait]').checked=true};dialog.querySelector('[name=portraitFile]').onchange=e=>{const file=e.target.files?.[0];if(!file||file.size>2*1024*1024||!['image/png','image/jpeg','image/webp'].includes(file.type))return;const reader=new FileReader();reader.onload=()=>{$('#avatarPortraitPreview').innerHTML=characterPortraitHtml({id:'preview',role:'Vorschau',portraitData:reader.result})};reader.readAsDataURL(file)};dialog.querySelector('form').onsubmit=async e=>{e.preventDefault();const form=new FormData(e.target),year=Number(form.get('year'));if(!Number.isInteger(year)||year===0){$('#avatarError').textContent='Bitte ein ganzzahliges Jahr ungleich 0 angeben.';return}const avatar={id:edit?c.id:'avatar-'+crypto.randomUUID(),year,own:true,related:'history',limit:'Selbst erstelltes Personenmodell; Annahmen und Quellen im Profil prüfen.'};for(const [key] of fields)avatar[key]=String(form.get(key)||'').trim();avatar.portraitId=String(form.get('portraitId'));avatar.portraitData=form.get('replacePortrait')?'':c.portraitData||'';const file=form.get('portraitFile');if(file?.size){if(file.size>2*1024*1024||!['image/png','image/jpeg','image/webp'].includes(file.type)){$('#avatarError').textContent='Bitte PNG, JPEG oder WebP bis 2 MB wählen.';return}try{avatar.portraitData=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file)})}catch{$('#avatarError').textContent='Das Bild konnte nicht gelesen werden.';return}}state.avatars??=[];const index=state.avatars.findIndex(x=>x.id===avatar.id);if(index<0)state.avatars.push(avatar);else state.avatars[index]=avatar;dialog.close();selectCharacter(avatar.id)};dialog.showModal()}
const AUGUSTINE_TONES=[261.63,293.66,329.63,392,349.23,329.63,293.66,261.63];
function augustinePhase(index,progress){if(progress<=0)return 'expected';const phase=progress*8-index;return phase<0?'expected':phase<1?'attended':'remembered'}
function stopAugustine(){augustinePlaying=false;if(augustineFrame&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(augustineFrame);augustineFrame=0;if(augustineVoice){try{augustineVoice.stop()}catch{}augustineVoice=null}}
function augustinePaint(room){const progress=augustineProgress;room.style.setProperty('--conscious-flow',progress);room.querySelectorAll('[data-tone]').forEach(el=>{const i=Number(el.dataset.tone),phase=augustinePhase(i,progress);el.dataset.phase=phase;el.style.left=(50+(i-progress*8)*6)+'%';el.setAttribute('aria-label','Ton '+(i+1)+': '+({expected:'noch nicht erklungen',attended:'erklingt jetzt',remembered:'bereits verklungen'})[phase])});const slider=room.querySelector('[data-conscious-progress]');slider.value=String(progress);room.querySelector('[data-conscious-play]').textContent=augustinePlaying?'Ⅱ Anhalten':progress>=1?'↻ Noch einmal erleben':'▶ Klangfolge erleben';room.querySelector('[data-conscious-status]').textContent=progress===0?'Die Folge ist noch nicht erklungen. Was erwartest du?':progress>=1?'Die Folge ist verklungen. Du hörst sie nicht mehr – kannst du sie innerlich noch halten?':Math.min(8,Math.floor(progress*8)+1)+'. Ton: Die Erwartung nimmt ab, die Erinnerung wächst.';}
async function augustinePlay(room){if(augustinePlaying){stopAugustine();augustinePaint(room);return}if(augustineProgress>=1)augustineProgress=0;augustineLastTone=-1;if(augustineSound){try{augustineAudio??=new (window.AudioContext||window.webkitAudioContext)();await augustineAudio.resume()}catch{augustineSound=false;room.querySelector('[data-conscious-sound]').checked=false;room.querySelector('[data-audio-status]').textContent='Audio hier nicht verfügbar; die sichtbare Folge funktioniert weiterhin.'}}augustinePlaying=true;const start=performance.now()-augustineProgress*16000;
 const tick=now=>{if(!augustinePlaying||!room.isConnected){stopAugustine();return}augustineProgress=Math.min(1,(now-start)/16000);const index=Math.floor(augustineProgress*8);if(index<8&&index!==augustineLastTone){augustineLastTone=index;if(augustineSound&&augustineAudio){const osc=augustineAudio.createOscillator(),gain=augustineAudio.createGain(),t=augustineAudio.currentTime;osc.type='sine';osc.frequency.value=AUGUSTINE_TONES[index];gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.1,t+.04);gain.gain.exponentialRampToValueAtTime(.001,t+1.6);osc.connect(gain);gain.connect(augustineAudio.destination);osc.start(t);osc.stop(t+1.65);augustineVoice=osc}}if(augustineProgress>=1)stopAugustine();augustinePaint(room);if(augustinePlaying)augustineFrame=requestAnimationFrame(tick)};augustineFrame=requestAnimationFrame(tick);
}
function presentSceneHtml(items){const c=augustineCharacter(),person=augustineExperience==='person';return `<figure class="world-scene semantic-board schematic-scene augustine-room ${person?'person-mode':'sound-mode'}" data-conscious-room><div class="conscious-heading"><div><span>AUGUSTINUS · DISTENTIO ANIMI</span><h3>Ein Bewusstsein. Drei Weisen des Gegenwärtigseins.</h3></div><button data-eternity aria-pressed="false">Ewigkeit gegenüberstellen ↗</button></div>${augustineCharacterControls()}<div class="conscious-space"><div class="conscious-floor" aria-hidden="true"></div><div class="conscious-stretch" aria-hidden="true"></div><div class="conscious-self"><small>BEWUSSTSEIN</small><strong>${person?yr(c.year):'Jetzt'}</strong><span>${person?'Mein Jetzt · '+esc(c.place):'Die Seele hält auseinander,<br>was sie zugleich gegenwärtig hat.'}</span></div><div class="conscious-label conscious-memory"><h4>memoria</h4><p>Gegenwart des Vergangenen</p><span>${person?esc(c.memory):'Der Ton ist nicht mehr.<br>Seine Spur ist jetzt in dir.'}</span></div><div class="conscious-label conscious-attention"><h4>attentio / contuitus</h4><p>Gegenwart des Gegenwärtigen</p><span>${person?esc(c.attention):'Du hörst. Schon vergeht der Ton.'}</span></div><div class="conscious-label conscious-expectation"><h4>expectatio</h4><p>Gegenwart des Zukünftigen</p><span>${person?esc(c.expectation):'Der Ton ist noch nicht.<br>Du bist jetzt auf ihn gerichtet.'}</span></div><div class="conscious-focus" aria-hidden="true"></div><div class="conscious-score" aria-label="Acht Töne: vom Erwarteten durch die Aufmerksamkeit ins Erinnerte">${AUGUSTINE_TONES.map((_,i)=>`<span class="conscious-tone" data-tone="${i}" data-phase="expected" style="left:${50+i*6}%">♪<small>${i+1}</small></span>`).join('')}</div><div class="conscious-direction">← aus Erwartung durch Aufmerksamkeit in Erinnerung</div><aside class="conscious-eternity" hidden><span>THEOLOGISCHER GEGENBEGRIFF</span><h3>Gottes Ewigkeit</h3><strong>Kein Vorher. Kein Nachher.</strong><p>Bei Augustinus ist Gott nicht am Ende einer unendlich langen Zeitachse. Ewigkeit unterliegt keinem Nacheinander.</p><p>Die räumliche Trennung veranschaulicht den Unterschied zwischen zeitlichem Erleben und Ewigkeit.</p><button data-eternity-back>Zur menschlichen Zeiterfahrung ↩</button></aside></div><div class="conscious-player"><button data-conscious-play>▶ Klangfolge erleben</button><button data-conscious-reset aria-label="Klangfolge zurücksetzen">↺ Anfang</button><label><input type="checkbox" data-conscious-sound checked> Mit Ton</label><input type="range" min="0" max="1" step="0.001" value="${augustineProgress}" data-conscious-progress aria-label="Verlauf der Klangfolge"><output data-conscious-status aria-live="off">Die Folge ist noch nicht erklungen. Was erwartest du?</output><span data-audio-status role="status"></span></div>${person?`<details class="conscious-character-note"><summary>Lebenslage, Annahmen und Quellen dieser Person</summary><p>${esc(c.limit)}</p>${characterEvidenceHtml(c)}${c.source?`<p>Quellen / Annahmen: ${esc(c.source)}</p>`:''}<p>Die Ich-Sätze sind für diese Ansicht geschrieben. Sie beschreiben keine belegte Person und keine einheitliche Sicht ihrer Gruppe. Augustinus’ Begriffe werden hier auf eine mögliche Erfahrung übertragen; die Figur muss sie nicht selbst gekannt haben. Die Figurenwahl verändert deine Kategorie- und Zeitfilter nicht.</p>${eventLink(c.related,'Historischen Zusammenhang im vorhandenen Eintrag öffnen')}${c.id==='nero'?'<p><a href="https://www.britishmuseum.org/exhibitions/nero-man-behind-myth/slavery-ancient-rome" target="_blank" rel="noopener">British Museum: Sklaverei im antiken Rom</a></p>':''}${c.id==='custos'||c.id==='nun'?'<p><a href="https://osb.org/our-roots/the-rule/" target="_blank" rel="noopener">Benediktsregel: gemeinsames Leben, Gebet und Arbeit (Normtext, keine Biografie)</a></p>':''}${c.id==='china868'?'<p><a href="https://idp.bl.uk/discover/learning/dunhuang/collection-items/cave-17-the-library-cave/" target="_blank" rel="noopener">British Library: überlieferter Druck des Diamant-Sutra von 868</a></p>':''}</details>`:''}<details class="conscious-explain"><summary>Was erfahre ich hier – und wo endet das Bild?</summary><p>Höre die Folge, halte sie an und höre sie erneut. Beim zweiten Hören kann deine Erinnerung die Erwartung verändern. Während des Hörens wird Erwartetes gegenwärtig und geht ins Erinnern über. Erinnerung und Erwartung vollziehen sich beide jetzt.</p><p>Die «Erstreckung der Seele» bezeichnet diese Spannung. Der Raum und die wandernden Noten sind unsere Veranschaulichung, keine von Augustinus entworfene Geometrie. Die Töne bilden ein eigens erzeugtes Klangbeispiel, kein historisches Lied. Beim ersten Hören kennst du die genaue Fortsetzung noch nicht; die sichtbaren Noten zeigen nur die angekündigte Anzahl, nicht die Tonhöhen.</p><p>Augustinus fragt in <em>Confessiones</em> XI, wie Zeit sein kann, wenn Vergangenes nicht mehr und Zukünftiges noch nicht ist und Gegenwart vergeht. Seine Unterscheidung der drei Gegenwarten ist keine Behauptung dreier voneinander unabhängiger Zeiträume. Vgl. XI, 20 und 26–28.</p><ul>${sourceHtml(['augustine'])}</ul></details><details class="conscious-history"><summary>Historische Spuren in diesen Bewusstseinsraum einbringen · ${worldSelection(items).length} datierte Spuren</summary><p>Der Hörversuch ist deine eigene Zeiterfahrung. Für eine historische Person brauchst du dagegen Quellen: Was erinnerte sie, worauf achtete sie, was erwartete sie? Frühere Ereignisse werden nicht allein durch ihr Datum zu ihrer Erinnerung. Alle ausgewählten Spuren bleiben hier untersuchbar.</p>${historicalPresentSceneHtml(items)}</details><figcaption>Ein virtueller Bewusstseinsraum, keine Kugel und keine objektive Weltzeit. Erinnerung, Aufmerksamkeit und Erwartung sind gegenwärtige Vollzüge.</figcaption></figure>`}
function wireAugustine(){document.addEventListener('change',e=>{if(e.target.matches('[data-conscious-character]'))selectCharacter(e.target.value)});document.addEventListener('click',e=>{if(e.target.closest('[data-character-gallery]')){openCharacterGallery();return}if(e.target.closest('[data-avatar-new]')){openAvatarEditor();return}if(e.target.closest('[data-avatar-edit]')){openAvatarEditor(true);return}if(e.target.closest('[data-conscious-random]')){const all=characterLibrary(),i=all.findIndex(c=>c.id===augustineCharacter().id);selectCharacter(all[nextAugustineCharacter(i,Math.random(),all.length)].id);return}const room=e.target.closest('[data-conscious-room]');if(!room)return;const experience=e.target.closest('[data-conscious-view]');if(experience){stopAugustine();augustineExperience=experience.dataset.consciousView;render();return}if(e.target.closest('[data-conscious-play]'))augustinePlay(room);if(e.target.closest('[data-conscious-reset]')){stopAugustine();augustineProgress=0;augustinePaint(room)}if(e.target.closest('[data-eternity],[data-eternity-back]')){stopAugustine();const panel=room.querySelector('.conscious-eternity'),opening=panel.hidden;panel.hidden=!opening;room.classList.toggle('eternity-visible',opening);room.querySelector('[data-eternity]').setAttribute('aria-pressed',String(opening));augustinePaint(room)}});document.addEventListener('input',e=>{const room=e.target.closest('[data-conscious-room]');if(!room)return;if(e.target.matches('[data-conscious-progress]')){stopAugustine();augustineProgress=Number(e.target.value);augustinePaint(room)}if(e.target.matches('[data-conscious-sound]')){augustineSound=e.target.checked;if(!augustineSound&&augustineVoice){try{augustineVoice.stop()}catch{}augustineVoice=null}}});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAugustine()});}

function historicalPresentSceneHtml(items){
 const shown=worldSelection(items).sort((a,b)=>a.year-b.year),past=shown.filter(e=>e.year<worldYear),now=shown.filter(e=>e.year===worldYear),future=shown.filter(e=>e.year>worldYear);
 const generated=randomConceptMeta(activeReading('present'),'present'),shifted=generated&&generated.year!==worldYear;
 const person=premiseValue('present','person')||'Noch keine betrachtete Person oder Gruppe benannt',knowledge=premiseValue('present','knowledge'),expectation=premiseValue('present','expectation');
 const row=e=>{const d=readingDecision(e.id);return `<button class="present-trace" data-lens-focus="${esc(e.id)}" aria-label="${esc(spurDate(e)+' · '+e.title)}">${e.image?`<img src="${esc(imageSrc(e.image))}" alt="">`:'<span class="present-trace-mark">↗</span>'}<span><time>${esc(yr(e.year))}${e.end?'–'+esc(yr(e.end)):''}</time><strong>${esc(e.title)}</strong>${d&&!d.stale?`<small>Deine Zuordnung: ${esc(({support:'im Wissenshorizont',counter:'Gegenbefund',ambivalent:'ungewiss',outside:'nicht zugänglich'})[d.role]||d.role)}</small>`:''}</span></button>`};
 return `<figure class="world-scene semantic-board schematic-scene present-scene"><div class="diagram-topline"><span>${shown.length} datierte Spuren · Standpunkt ${yr(worldYear)}</span><a href="#interpretationSettings">Person, Wissen und Erwartung bearbeiten ↗</a></div><div class="present-standpoint"><label>Von welchem Jahr aus schaust du? <input type="number" data-present-year value="${worldYear}" min="-100000" max="10000" step="1"></label><button data-present-go>Standpunkt verschieben →</button><span class="present-year-error" role="alert"></span></div><div class="present-map">
 <section class="present-past"><h3>Was liegt schon zurück?</h3><p>Frühere Spuren sind <strong>mögliche Wissensbezüge</strong>. Ihr Datum beweist nicht, dass die Person sie kannte.</p><div class="present-traces">${past.map(row).join('')||'<p>Keine früheren Spuren in deiner Auswahl.</p>'}</div></section>
 <section class="present-vantage"><h3>Hier steht dein Blick</h3><strong class="present-date">${yr(worldYear)}</strong><p class="present-person">${esc(person)}</p>${shifted?`<p class="present-caution">Standpunkt verändert: Der erzeugte Personenentwurf bezieht sich auf ${yr(generated.year)}. Person, Wissen und Erwartung erneut prüfen.</p>`:''}<svg class="whole-form-backdrop" viewBox="0 0 260 100" aria-label="Erinnern und Erwarten gehen von derselben Gegenwart aus"><path d="M125 80V25M125 50H15M15 50l12 -9M15 50l12 9M135 50L245 15M135 50L245 85" fill="none" stroke="#789080" stroke-width="3"/><circle cx="130" cy="50" r="10" fill="#b28b49"/><text x="15" y="96">erinnern</text><text x="170" y="96">erwarten</text></svg><details><summary>Welches Wissen setzt der Entwurf voraus?</summary><p>${esc(knowledge||'Noch offen: Zeitgenössische Zeugnisse zum Wissensstand suchen.')}</p></details>${now.length?`<details><summary>${now.length} Spur(en) aus diesem Kalenderjahr</summary><div class="present-traces">${now.map(row).join('')}</div></details>`:'<p class="present-no-event">Das Standjahr muss kein Ereignisjahr sein.</p>'}</section>
 <section class="present-future"><h3>Was könnte noch kommen?</h3><p class="present-expectation">${esc(expectation||'Noch keine Erwartung formuliert. Welche Hoffnung, Befürchtung oder offene Möglichkeit wäre für diese Person damals begründbar?')}</p><p class="present-caution">Erwartung ist kein Rückblick. Diese Erwartung wurde für den Vorschlag angenommen. Was eine Person damals erwartete, muss aus ihren Zeugnissen erschlossen werden.</p><div class="present-future-fork"><span>Es könnte anders kommen.</span><span>Der Ausgang bleibt offen.</span></div><details class="present-retrospect" ${!worldAssumption?'open':''}><summary>Heutigen Rückblick öffnen · ${future.length} spätere Spuren</summary><p>Diese Ereignisse kennen wir erst rückblickend. Sie sind <strong>keine damaligen Erwartungen</strong>.</p><div class="present-traces">${future.map(row).join('')||'<p>Keine späteren Spuren in deiner Auswahl.</p>'}</div></details></section>
 </div>${undatedOverview(items)}<figcaption>Verschiebe das Standjahr: Dieselbe Spur kann vom späteren Geschehen in die Vergangenheit wechseln. Das macht sie noch nicht zum Wissen dieser Person. Die drei Bereiche übertragen Augustinus’ Unterscheidung von Erinnern, gegenwärtiger Aufmerksamkeit und Erwarten auf eine historische Untersuchung.</figcaption></figure>`;
}

// A goal is an explicit judgement criterion, never a measured upward trajectory.
function directionOverviewHtml(items){
 const shown=worldSelection(items).sort((a,b)=>a.year-b.year),goal=telosGoal('direction');
 const groups=[['open','Noch zu prüfen','Ohne Begründung bleibt die Bedeutung offen.'],['support','Spricht für das Ziel','Eine begründete Verbesserung nach diesem Massstab.'],['counter','Spricht gegen das Ziel','Ein Rückschritt oder ein Gegenbefund.'],['ambivalent','Wirkt unterschiedlich','Zum Beispiel ein Gewinn für einige, ein Verlust für andere.'],['outside','Kein belegter Bezug','Für dieses Ziel ergibt sich bisher keine Aussage.']];
 const buckets=Object.fromEntries(groups.map(([key])=>[key,[]]));
 for(const e of shown){const d=readingDecision(e.id);const key=worldAssumption&&goal&&d&&!d.stale&&buckets[d.role]?d.role:'open';buckets[key].push({e,d,key})}
 const row=({e,d,key})=>`<button class="goal-event board-role-${key}" data-lens-focus="${esc(e.id)}"><span class="goal-event-date">${esc(yr(e.year))}</span>${e.image?`<img src="${esc(imageSrc(e.image))}" alt="" loading="lazy">`:''}<span class="goal-event-body"><strong>${esc(e.title)}</strong>${key!=='open'?`<small>${esc(d.reason)}</small>`:d?.stale?'<small>Ziel oder Annahmen geändert: erneut prüfen.</small>':''}</span><span aria-hidden="true">↗</span></button>`;
 return `<figure class="world-scene semantic-board goal-overview"><header class="goal-question"><span>FORTSCHRITT – GEMESSEN WORAN?</span><h3>${esc(goal||'Zuerst ein Ziel bestimmen')}</h3><p>Dieses Ziel ist eine gesetzte Vorstellung davon, was besser wäre. Es ist kein feststehendes Ende der Geschichte.</p><a href="#interpretationSettings">Ziel und betroffene Gruppe ändern ↗</a></header><div class="goal-instructions"><span><b>1</b> Ziel lesen oder ändern</span><span><b>2</b> Ereignis öffnen und Belege prüfen</span><span><b>3</b> Wirkung begründet zuordnen</span></div>${!worldAssumption?'<p class="goal-off">Die Zieldeutung ist ausgeschaltet. Alle Ereignisse stehen deshalb ohne Wertung im Prüfbestand.</p>':''}<p class="goal-summary"><strong>${shown.length} Ereignisse · ${shown.length-buckets.open.length} eingeordnet · ${buckets.open.length} offen</strong> Die Spalten zeigen deine Urteile, keine automatisch erkannten Wirkungen. Innerhalb jeder Spalte gilt die Datumsfolge.</p><div class="goal-fork" aria-label="Ein Ziel, unterschiedliche Wirkungen"><span>↗ Verbesserung für wen?</span><span>↔ Widersprüchliche Wirkungen?</span><span>↘ Verschlechterung für wen?</span></div><div class="goal-columns">${groups.map(([key,label,help])=>`<section class="goal-column goal-${key}" aria-label="${label}"><h4>${label} <span>${buckets[key].length}</span></h4><p>${help}</p><div class="goal-events" tabindex="0" aria-label="${label}: Ereignisse, scrollbar">${buckets[key].map(row).join('')||'<p class="goal-empty">Noch keine Zuordnung. Das bedeutet nicht, dass es historisch keine solchen Wirkungen gab.</p>'}</div></section>`).join('')}</div><figcaption>Ändere das Ziel: Bereits begründete Urteile müssen neu geprüft werden. Dass ein Ereignis später stattfindet, macht es nicht zum Fortschritt. Auch viele Verbesserungen beweisen nicht, dass Geschichte notwendig auf dieses Ziel zuläuft.</figcaption>${undatedOverview(items)}</figure>`;
}

// Each overview exposes its organising relationship and keeps unassigned evidence explicit.
function conceptOverviewHtml(items){
 const mode=representation,model=GLOBAL_LENSES[mode],shown=worldSelection(items).sort((a,b)=>a.year-b.year);
 const anchor=mode==='medieval'?telosGoal(mode):premiseValue(mode,PREMISE_LABS[mode].anchor);
 const designs={
 layers:{title:'Ein Geschehen – drei Geschwindigkeiten',intro:'Oben der einzelne Vorgang, darunter Entwicklungen, darunter langsam veränderliche Bedingungen. Untersuche dieselbe Spur auf mehreren Ebenen; die Zuordnung hält deinen Schwerpunkt fest.',relation:'Ein Ereignis kann eine Entwicklung verändern. Langfristige Bedingungen ermöglichen und begrenzen beides.',labels:['Ereignis · Was geschieht?','Entwicklung · Was verändert sich über längere Zeit?','Struktur · Was besteht über viele Ereignisse hinweg?'],form:'strata',limit:'Die Bandlänge veranschaulicht unterschiedliche Dauern; sie ist keine Messung. Ein Datum allein entscheidet nicht über die Schicht.'},
 materialism:{title:'Wie Lebensbedingungen und gesellschaftliche Macht zusammenhängen',intro:'Menschen produzieren mit bestimmten Mitteln. Eigentumsverhältnisse regeln, wer darüber verfügt. Daraus entstehen Interessen und Konflikte; Recht und Politik können diese Verhältnisse sichern oder verändern.',relation:'Produktivkräfte ↔ Produktionsverhältnisse → Interessenkonflikte ↔ Recht und Politik ↺',labels:['Arbeit, Technik und Wissen','Eigentum und Verfügung','Recht und politische Macht','Interessen und Konflikte'],form:'relations',limit:'Die Verbindungen sind Untersuchungsfragen. Sie behaupten weder eine einzige Ursache noch einen zwangsläufigen Ausgang.'},
 medieval:{title:'Weltgeschichte zwischen Schöpfung und erhoffter Vollendung',intro:'In einer christlichen Heilsgeschichte erhält das zeitliche Geschehen seinen Sinn durch einen göttlichen Zusammenhang. Gedenken und Herrschaftserzählungen können daran anknüpfen; sie sind unterschiedliche Praktiken.',relation:'Schöpfung → irdisches Geschehen → erhoffte Vollendung',labels:['Geschehen als Teil einer Heilsgeschichte lesen','Vergangenes im Gedenken vergegenwärtigen','Herrschaft durch Vergangenheit begründen'],form:'horizon',limit:'Hier wird eine christliche Deutungsform erprobt, nicht das Denken aller Menschen im Mittelalter. Die Vollendung ist eine Glaubensannahme, kein berechenbarer Termin.'},
 egypt:{title:'Ordnung soll Bestand haben – und muss erneuert werden',intro:'Maʿat bezeichnet eine als richtig verstandene Ordnung. Herrschaft und Rituale beanspruchen, sie zu erhalten oder wiederherzustellen. Welche Vergangenheit bewahrt wird, gehört selbst zu dieser Ordnung.',relation:'Ordnung beanspruchen → durch Handeln und Rituale erneuern → als gültige Ordnung überliefern ↺',labels:['Erneuern · Rituale und Rhythmen','Bewahren · welche Ordnung, für wen?','Überliefern · wen zählen und erinnern?'],form:'renewal',limit:'Erneuerung ist keine identische Wiederholung der Geschichte. Eine Übertragung auf heutige Ereignisse ist ein Vergleich, keine altägyptische Selbstdeutung.'},
 memoria:{title:'Vergangenheit wird ausgewählt, weitergegeben und neu gedeutet',intro:'Menschen erinnern in sozialen Beziehungen. Im Gespräch verändert sich Erinnerung; Texte, Bilder, Orte und Rituale können sie über Generationen tragen. Andere Stimmen bleiben daneben bestehen oder werden verdrängt.',relation:'Soziale Rahmen → Gespräche und Weitergabe ↔ kulturelle Formen; Auswahl und Widerspruch wirken auf alle drei zurück.',labels:['Wer erinnert? · soziale Rahmen','Wie wird weitererzählt? · Gespräche','Was trägt Erinnerung? · Medien und Rituale','Was fehlt oder widerspricht? · andere Stimmen'],form:'memory',limit:'Halbwachs erklärt soziale Rahmen. Assmann unterscheidet kommunikatives und kulturelles Gedächtnis. Das ist keine automatische Stufenfolge; ein Eintrag im Bestand beweist keine damalige Erinnerung.'},
 recurrence:{title:'Wiederkehr prüfen: gleiche Zeitabstände sind noch keine gleichen Verläufe',intro:'Die Zeit wird versuchsweise in Umläufe gefaltet. Gleich gelegene Zeitpunkte lassen sich vergleichen. Erst Quellen zeigen, ob ein Rhythmus, eine Ähnlichkeit oder ein entscheidender Unterschied vorliegt.',relation:'Umlauf → neuer Umlauf → veränderte Bedingungen: Vergleich statt Gleichsetzung',labels:['Belegter Rhythmus','Begründete Ähnlichkeit','Entscheidender Unterschied'],form:'cycles',limit:'Die Umlauflänge ist deine Setzung, kein historisches Gesetz. Nietzsches ewige Wiederkunft ist nicht mit einer ähnlichen Ereignisfolge nachgewiesen.'}
 };
 const d=designs[mode],buckets=Object.fromEntries(model.slots.map(([key])=>[key,[]])),open=[];
 for(const e of shown){const slot=worldAssumption?lensAssignment(mode,e.id):'';if(buckets[slot])buckets[slot].push(e);else open.push(e)}
 const row=e=>{const decision=readingDecision(e.id),valid=worldAssumption&&decision&&!decision.stale;return `<button class="concept-record board-role-${valid?decision.role:'open'}" data-lens-focus="${esc(e.id)}" aria-label="${esc(spurDate(e)+' · '+e.title)}">${e.image?`<img src="${esc(imageSrc(e.image))}" alt="" loading="lazy">`:''}<span><time>${esc(spurDate(e))}</time><strong>${esc(e.title)}</strong>${valid?`<small>${esc(({support:'Spricht dafür',counter:'Spricht dagegen',ambivalent:'Mehrdeutig',outside:'Kein Bezug'})[decision.role]||decision.role)} · Gewicht ${decision.weight}: ${esc(decision.reason)}</small>`:decision?.stale?'<small>Annahmen geändert · erneut prüfen</small>':''}</span><span aria-hidden="true">↗</span></button>`};
 const section=(slot,i)=>`<section class="concept-station station-${i}"><h4>${esc(slot[1])} <span>${buckets[slot[0]].length}</span></h4><p>${esc(slot[2])}</p><div class="concept-records" tabindex="0" aria-label="${esc(slot[1])}: Einträge">${buckets[slot[0]].map(row).join('')||'<p class="concept-empty">Hier erscheinen Einträge, für die du diese Frage gewählt hast.</p>'}</div></section>`;
 const cycleRows=()=>{const groups=new Map();for(const e of open){const offset=tunnelOrdinal(e.year)-tunnelOrdinal(worldYear),cycle=Math.floor(offset/worldPeriod),phase=Math.min(3,Math.floor((offset-cycle*worldPeriod)/worldPeriod*4));if(!groups.has(cycle))groups.set(cycle,[[],[],[],[]]);groups.get(cycle)[phase].push(e)}const fromOrdinal=n=>n>=1?n:n-1;return `<div class="folded-cycles"><div class="cycle-scale"><span>Umlauf / Beginn</span>${['0–¼','¼–½','½–¾','¾–1'].map(t=>`<span>${t} des Umlaufs</span>`).join('')}</div>${[...groups].map(([cycle,phases])=>`<div class="cycle-row"><strong>${yr(fromOrdinal(tunnelOrdinal(worldYear)+cycle*worldPeriod))}<small>Umlauf ${cycle>=0?'+':''}${cycle}</small></strong>${phases.map(events=>`<div>${events.map(row).join('')||'<span class="cycle-vacant">–</span>'}</div>`).join('')}</div>`).join('')}<p>Nur Umläufe mit ausgewählten Einträgen werden gezeigt. Leere Felder bedeuten fehlende Einträge, nicht ereignislose Zeit.</p></div>`};
 const diagram=mode==='layers'?`<div class="tempo-key"><span>kurzer Vorgang <b>•</b></span><span>längerer Verlauf <b>━━━━</b></span><span>langsame Veränderung <b>━━━━━━━━━━</b></span></div>`:mode==='medieval'?`<div class="salvation-path"><span>Schöpfung<small>religiöser Ursprung</small></span><b>→</b><span>Irdische Geschichte<small>datierbare Ereignisse · offener Verlauf</small></span><b>⇢</b><span>${esc(anchor||'Vollendung noch offen')}<small>erhofftes Heil · ausserhalb des Kalenders</small></span></div>`:mode==='egypt'?`<div class="renewal-path"><span>Ordnung beanspruchen</span><b>→</b><span>Ordnung erneuern</span><b>→</b><span>Ordnung bestätigen</span><em>↶ erneut herstellen und bewahren</em></div>`:mode==='materialism'?`<div class="production-path"><span>Womit wird produziert?</span><b>↔</b><span>Wer verfügt darüber?</span><b>→</b><span>Wessen Interessen geraten in Konflikt?</span><em>↶ Recht und Politik sichern oder verändern diese Verhältnisse</em></div>`:mode==='memoria'?`<div class="memory-path"><span>Soziale Beziehungen</span><b>→</b><span>Erzählen und Weitergeben</span><b>↔</b><span>Bilder · Orte · Rituale</span><em>↶ Auswahl, Vergessen und Gegen-Erinnerungen</em></div>`:`<div class="cycle-path"><span>Umlauf A <b>→</b></span><span>Umlauf B <b>→</b></span><span>Umlauf C <b>→</b></span><em>Ein Umlauf: ${worldPeriod} Jahre · Bezug ${yr(worldYear)} · Zeitabstand ist kein Ähnlichkeitsbeleg</em></div>`;
 return `<figure class="world-scene semantic-board schematic-scene concept-overview concept-${d.form}" data-concept="${mode}"><header class="concept-heading"><div><h3>${d.title}</h3><p>${d.intro}</p></div><a href="#interpretationSettings">Annahmen ändern ↗</a></header><p class="concept-assumption"><strong>Dein Entwurf:</strong> ${esc(anchor||'Bezug noch offen')}${!worldAssumption?' · Deutung ausgeschaltet; Zuordnungen bleiben gespeichert.':''}</p>${mode==='memoria'?`<details class="concept-person"><summary>Erinnernde Person: ${esc(augustineCharacter().role)} · ${yr(augustineCharacter().year)} · Profil und andere Personen</summary>${memoryCharacterHtml()}</details>`:''}<div class="concept-relationship" role="group" aria-label="${esc(d.relation)}">${diagram}</div><div class="concept-stations">${model.slots.map(section).join('')}</div><section class="concept-pool"><header><h4>Einträge zum Einordnen <span>${open.length}</span></h4><span>${shown.length-open.length} von ${shown.length} bereits eingeordnet</span></header><p class="placement-instructions">Welche Frage möchtest du an einen Eintrag stellen? <strong>Öffne einen Titel</strong> und wähle im Fenster unter <strong>«Frage für diesen Eintrag»</strong> einen Bereich, zum Beispiel «${esc(model.slots[0][1])}». Danach erscheint der Eintrag oben in diesem Bereich. Ohne Auswahl bleibt er hier.</p>${mode==='recurrence'&&worldAssumption?cycleRows():`<div class="concept-pool-list">${open.map(row).join('')||'<p>Alle ausgewählten Einträge sind zugeordnet.</p>'}</div>`}</section>${undatedOverview(items)}<figcaption>${d.limit}</figcaption></figure>`;
}
function worldSceneHtml(items){
 if(representation==='present')return presentSceneHtml(items);
 if(representation==='direction')return directionOverviewHtml(items);
 return conceptOverviewHtml(items);
}

WORLD_READINGS.direction.action='Begründete Zieldeutung anzeigen';
WORLD_READINGS.direction.counter='Ändere den Massstab: Welche Urteile bleiben begründbar, welche müssen neu geprüft werden?';
WORLD_READINGS.direction.caution='Die Spalten ordnen Urteile nach einem gewählten Ziel. Sie bilden weder Hegels Philosophie vollständig ab noch beweisen sie einen notwendigen Verlauf.';
WORLD_READINGS.direction.mechanism='Zeitfolge und Zielbewertung sind getrennte Dimensionen: Eine spätere Spur ist nicht automatisch ein Fortschritt.';
PERSPECTIVE_INTROS.medieval.transfer='Die Gesamtform verbindet Schöpfung, irdisches Geschehen und erhoffte Vollendung. Darunter unterscheidest du Heilsgeschichte, Gedenken und Herrschaftslegitimation. Deine Zuordnung legt einen Untersuchungsaspekt fest; sie beweist keinen göttlichen Plan.';
PERSPECTIVE_INTROS.direction.transfer='Bestimme Ziel und betroffene Gruppe. Die Spalten unterscheiden offene Fragen, Verbesserungen, Gegenbefunde, widersprüchliche Wirkungen und fehlenden Bezug. Jedes Urteil braucht eine Begründung.';
PERSPECTIVE_INTROS.egypt.transfer='Die Schleife zeigt den Anspruch, Ordnung durch Erneuerung zu erhalten. Die drei Bereiche untersuchen Rituale, Ordnungsvorstellungen und ausgewählte Überlieferung. Der Zusammenhang ist keine Behauptung identischer Wiederholungen.';
PERSPECTIVE_INTROS.layers.transfer='Drei übereinanderliegende Bänder unterscheiden den einzelnen Vorgang, längerfristige Entwicklung und langsam veränderliche Bedingungen. Ordne einen untersuchten Aspekt zu. Die Bandlänge illustriert Dauer; sie misst sie nicht.';
PERSPECTIVE_INTROS.recurrence.transfer='Vergleiche aufeinanderfolgende Umläufe unter einer selbst gewählten Länge. Unterscheide belegte Rhythmen, begründete Ähnlichkeiten und Unterschiede. Zeitliche Nähe allein reicht für keine dieser Zuordnungen.';
PERSPECTIVE_INTROS.materialism.transfer='Folge den Beziehungen zwischen Produktionsmitteln, Verfügung, Interessenkonflikten und politischer Regelung. Ordne Einträge einem Untersuchungsschwerpunkt zu und belege die behaupteten Wechselwirkungen.';
PERSPECTIVE_INTROS.memoria.transfer='Die Gesamtform verbindet soziale Beziehungen, Weitererzählen und kulturelle Vermittlung. Auswahl und Gegen-Erinnerungen wirken darauf zurück. Ordne die Spur nach der Erinnerungspraxis ein, die du tatsächlich untersuchst.';
for(const key of Object.keys(CONCRETE_READINGS))CONCRETE_READINGS[key].guide=[PERSPECTIVE_INTROS[key].transfer,'Einträge sind mit Datum und Titel lesbar. Anklicken öffnet Quelle, Begründung und Zuordnung. Nicht zugeordnete Einträge bleiben im offenen Bestand.','Die Form erklärt den Ansatz. Die konkrete Zuordnung bleibt eine am Material zu begründende Deutung.'];

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
 return `<section class="instructional-diagram" aria-label="Angeleitetes Schaubild"><h3>${esc(d.question)}</h3><div class="lesson-switch"><span>1 · Perspektive setzen</span>${d.labels.map((label,i)=>`<button data-lesson-choice="${i}" aria-pressed="${choice===i}">${esc(label)}</button>`).join('')}</div><svg viewBox="0 0 900 420" role="group" aria-label="${esc(d.question)}"><g class="lesson-drawing">${drawing}</g></svg><div class="lesson-reading"><p><strong>2 · So wird der Befund gelesen:</strong> ${esc(v.claim)}</p><p><strong>3 · Hier endet der Beleg:</strong> ${esc(v.check)}</p></div><p class="lesson-status">Beispiel mit vorgegebenen Annahmen. Bilder illustrieren die verlinkte Spur und belegen die Deutung nicht selbst; Bildherkunft per Klick. Deine eigenen Entwürfe werden nicht verändert.</p></section>`;
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
 recurrence:{title:'Wiederkehr',subtitle:'Umläufe vergleichen: Ähnlichkeit und Differenz',icon:'M50 35C36 20 65 13 73 34S44 68 23 47 26 1 59 6 101 60 74 67'},
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
 return `<section class="random-heil"><div><strong>${m?'ZUFALLSENTWURF · '+esc(model.name):'Einen Heilshorizont erproben'}</strong><button id="randomHeilButton">${m?'Anderen Zufallsentwurf einsetzen ↻':'Zufallsentwurf einsetzen ↻'}</button><a href="#interpretationSettings">Entwurf bearbeiten ↗</a></div>${m?`<p>${changed||changedView?'Manuell angepasst · ursprüngliche Zufallssetzungen unten dokumentiert.':'Die folgenden Setzungen wurden zufällig zusammengestellt.'} Vorschlag zum Ausprobieren; die Annahmen sind keine historischen Belege.</p><p><strong>Erzeugter Zeitraum:</strong> ${m.all?'gesamte Zeit':yr(m.year-m.window)+' bis '+yr(m.year+m.window)} · Standjahr ${yr(m.year)} · alle Kategorien.</p><details><summary>Alle Einstellungen dieses Vorschlags</summary><dl><dt>Erstellt</dt><dd>${esc(m.generatedAt.replace('T',' · ').replace(/\.\d+Z$/,' UTC'))} · Variante ${m.revision}</dd><dt>Heilsvorstellung</dt><dd>${esc(model.goal)}</dd><dt>Perspektive</dt><dd>${esc(model.standpoint)}</dd><dt>Verlaufsannahme</dt><dd>${esc(model.necessity)}</dd><dt>Gegenprüfung</dt><dd>${esc(model.counter)}</dd><dt>Zeitraum</dt><dd>${m.all?'Gesamte Zeit: alle datierten Spuren des Bestands':yr(m.year-m.window)+' bis '+yr(m.year+m.window)} · Standjahr ${yr(m.year)} · Fenster ± ${m.window} Jahre${m.all?' (bei Gesamtsicht nicht angewendet)':''}</dd><dt>Bestand und Filter</dt><dd>Alle sechs Kategorien; vorhandene und eigene Einträge; Suchfeld leer.</dd><dt>Darstellung</dt><dd>Heilsgeschichte; Heilshorizont eingeschaltet. Zeitfolge von links nach rechts, keine proportionalen Jahresabstände. Undatierte Begriffe separat.</dd><dt>Zuordnungen</dt><dd>Keine automatisch erfundenen Ereignisdeutungen: Rollen, Gewichte und Untersuchungsschwerpunkte dieses Zufallsentwurfs sind zunächst offen.</dd></dl><p>Der nächste Klick ersetzt diesen Zufallsentwurf einschliesslich seiner Bearbeitungen. Über «Annahmen & Entwürfe» kannst du ihn vorher kopieren. Andere Entwürfe bleiben erhalten.</p></details>`:'<p>Setzt ein zusammenhängendes Unterrichtsmodell mit Zeitraum und offengelegten Annahmen ein. Bestehende eigene Entwürfe bleiben erhalten.</p>'}<p id="randomHeilStatus" role="status"></p></section>`;
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
  "memoria": AUGUSTINE_CHARACTERS.map(c=>({id:c.id,name:c.role+' · '+(c.year<0?Math.abs(c.year)+' v. u. Z.':String(c.year)),fields:{group:c.role+' · '+c.place+' · '+(c.year<0?Math.abs(c.year)+' v. u. Z.':String(c.year)),practice:characterSocial(c),selection:c.memory,counter:'Welche Aussagen sind aus zeitgenössischen Quellen belegbar, welche bleiben Annahmen dieses Personenmodells?'}}))
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
 if(representation==='memoria'){const c=augustineCharacter(),old=state.notes['premise-memoria-group'];if(!old||['Kuratorisches Team eines Ortsmuseums','Ehemalige Beschäftigte eines Industriebetriebs','Eine Familie mit unterschiedlichen Generationserfahrungen'].includes(old)){state.notes['premise-memoria-group']=c.role+' · '+c.place+' · '+yr(c.year);state.notes['premise-memoria-practice']=characterSocial(c);state.notes['premise-memoria-selection']=c.memory;state.notes['premise-memoria-counter']='Welche Erinnerungen sind belegt, welche bleiben Annahmen des Personenmodells?'}return false}
 const sharedTime={year:worldYear,window:worldWindow,all:worldAll};const restoreTime=()=>{worldYear=sharedTime.year;worldWindow=sharedTime.window;worldAll=sharedTime.all};
 const mode=representation,p=activeReading(),meta=randomConceptMeta(p);
 if(profileBucket(mode).profiles.length===1&&p.name==='Erster Entwurf'&&!Object.values(profileNotes(mode)).some(v=>v.trim())&&!Object.keys(p.decisions).length&&!Object.keys(p.assignments).length){const categories=new Set(visibleCategories),own=onlyOwn,query=$('#search').value;randomConceptDraft();visibleCategories=categories;onlyOwn=own;$('#search').value=query;$$('[data-category]').forEach(el=>el.checked=categories.has(el.dataset.category));$('#categoryStatus').textContent=categories.size+' von '+LANES.length+' Kategorien sichtbar';restoreTime();return true}
 const restored=mode==='medieval'?lastRestoredHeil:restoredRandomConcept[mode];
 if(meta&&restored!==p.id){const categories=new Set(visibleCategories),own=onlyOwn,query=$('#search').value;applyRandomConcept(meta);visibleCategories=categories;onlyOwn=own;$('#search').value=query;$$('[data-category]').forEach(el=>el.checked=categories.has(el.dataset.category));$('#categoryStatus').textContent=categories.size+' von '+LANES.length+' Kategorien sichtbar';if(mode==='medieval')lastRestoredHeil=p.id;else restoredRandomConcept[mode]=p.id}
 restoreTime();return false;
}
function randomConceptHtml(){if(representation==='memoria')return '';if(representation==='medieval')return randomHeilHtml();const mode=representation,m=randomConceptMeta(),model=m&&RANDOM_CONCEPT_MODELS[mode].find(x=>x.id===m.model),fields=mode==='direction'?TELOS_FIELDS:PREMISE_LABS[mode].fields;
 const edited=m&&(Object.entries(model.fields).some(([k,v])=>state.notes[randomFieldKey(mode,k)]!==v)||worldYear!==m.year||worldWindow!==m.window||worldAll!==m.all||!worldAssumption||visibleCategories.size!==LANES.length||onlyOwn||($('#search')?.value||'')||(mode==='recurrence'&&worldPeriod!==m.period));
 return `<section class="random-heil"><div><strong>${m?'ZUFALLSENTWURF · '+esc(model.name):'Zufallsentwurf für '+esc(WHOLE_VIEW_FORMS[mode].title)}</strong><button id="randomHeilButton">${m?'Anderen Zufallsentwurf einsetzen ↻':'Zufallsentwurf einsetzen ↻'}</button><a href="#interpretationSettings">Entwurf bearbeiten ↗</a></div>${m?`<p>${edited?'Manuell angepasst · die ursprünglichen Setzungen bleiben unten dokumentiert.':'Zufälliger Vorschlag. Die Annahmen und den Zeitraum kannst du ändern.'} Die vorgeschlagene Perspektive ist eine Annahme, keine belegte Aussage historischer Personen.</p><p><strong>Erzeugter Zeitraum:</strong> ${m.all?'gesamte Zeit':yr(m.year-m.window)+' bis '+yr(m.year+m.window)} · Standjahr ${yr(m.year)} · alle Kategorien.${mode==='recurrence'?' Umlauf: '+m.period+' Jahre.':''}</p><details><summary>Alle Einstellungen dieses Vorschlags</summary><dl><dt>Erstellt</dt><dd>${esc(m.generatedAt)} · Variante ${m.revision}</dd>${fields.map(([key,label])=>`<dt>${esc(label)}</dt><dd>${esc(model.fields[key])}</dd>`).join('')}<dt>Zeitraum</dt><dd>${m.all?'Gesamte Zeit':yr(m.year-m.window)+' bis '+yr(m.year+m.window)} · Standjahr ${yr(m.year)} · Fenster ± ${m.window} Jahre${m.all?' (nicht angewendet)':''}</dd>${mode==='recurrence'?`<dt>Versuchsweiser Umlauf</dt><dd>${m.period} Jahre; gesetzter Darstellungsparameter, kein nachgewiesener Rhythmus.</dd>`:''}<dt>Bestand und Filter</dt><dd>Alle sechs Kategorien, vorhandene und eigene Einträge, Suchfeld leer.</dd><dt>Darstellung</dt><dd>${esc(WHOLE_VIEW_FORMS[mode].title)} · Modellannahme eingeschaltet. ${esc(WHOLE_VIEW_FORMS[mode].subtitle)}. Undatierte Begriffe separat; Abstände sind keine proportionalen Jahresmessungen.</dd><dt>Einordnungen</dt><dd>Rollen, Gewichte und Untersuchungsschwerpunkte bleiben zunächst offen. Der Vorschlag erzeugt keine Belege oder Ereignisbewertungen.</dd></dl><p>Der nächste Zufallsklick ersetzt diesen Zufallsentwurf einschliesslich Bearbeitungen. Du kannst ihn unter «Annahmen & Entwürfe» vorher kopieren; andere Entwürfe bleiben erhalten.</p></details>`:'<p>Passende Voraussetzungen und Zeitraum erzeugen; eigene ausgefüllte Entwürfe bleiben erhalten.</p>'}<p id="randomHeilStatus" role="status"></p></section>`;
}

WORLD_READINGS.present.action='Heutigen Rückblick zunächst geschlossen halten';
WORLD_READINGS.present.mechanism='Wähle ein Standjahr und eine Person. Prüfe links frühere Spuren als mögliche Wissensbezüge; formuliere rechts belegbare Erwartungen. Spätere Ereignisse werden getrennt als heutiger Rückblick geöffnet.';

WORLD_READINGS.present.name='Distentio animi · Zeit im Bewusstsein';
WORLD_READINGS.present.mechanism='Erinnern, Aufmerken und Erwarten geschehen jetzt. Erprobe diese Spannung an einer Klangfolge und prüfe danach historische Zeugnisse.';

WHOLE_VIEW_FORMS.present.title='Bewusstseinsraum';
WHOLE_VIEW_FORMS.present.subtitle='Erinnern, Aufmerken und Erwarten geschehen jetzt';
WHOLE_VIEW_FORMS.present.icon='M8 35Q50 12 92 35M8 35Q50 58 92 35M50 12V60M42 35H58';
