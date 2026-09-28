const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=require('path').resolve(__dirname,'..');
const ctx={document:{querySelector:()=>({})},console,crypto:require('crypto').webcrypto};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(root+'/docs/data.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(root+'/docs/editorial.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(root+'/docs/modes.js','utf8'),ctx);
const code=fs.readFileSync(root+'/docs/app.js','utf8').split("$('#close').onclick")[0];
vm.runInContext(code+';globalThis.api={validate,defaults,yearDiff,esc};globalThis.events=EVENTS;globalThis.sources=SOURCES;',ctx);
const {api,events,sources}=ctx;
assert.equal(api.yearDiff(-1,1),1);assert.equal(api.yearDiff(-10,10),19);assert.equal(api.yearDiff(1492,1804),312);
const state=api.defaults();state.own.push({id:'test-event',year:-1,end:1,lane:'eu',own:true,title:'<script>text</script>',question:'Testfrage',text:'Test',source:'Testquelle'});
state.notes['test-event']='Eigene Deutung';state.materials['test-event']=[{name:'beleg.txt',type:'text/plain',data:'data:text/plain;base64,VGVzdA==',description:'Testbeleg'}];
state.relations=[{id:'relation-1',a:'test-event',b:'haiti',type:'Vergleich',claim:'These',evidence:'Beleg',counter:'Grenze'}];
const round=api.validate(JSON.parse(JSON.stringify(state)));assert.equal(round.own[0].end,1);assert.equal(round.materials['test-event'][0].data,state.materials['test-event'][0].data);assert.equal(round.relations.length,1);assert.equal(round.notes['test-event'],'Eigene Deutung');
for(const bad of [0,1.5,10001,-100001]){const x=JSON.parse(JSON.stringify(state));x.own[0].year=bad;assert.throws(()=>api.validate(x))}
const bad=JSON.parse(JSON.stringify(state));bad.materials['test-event'][0].type='text/html';assert.throws(()=>api.validate(bad));
const duplicate=JSON.parse(JSON.stringify(state));duplicate.own[0].id='haiti';assert.throws(()=>api.validate(duplicate));
assert.equal(api.esc('<img onerror="x">'),'&lt;img onerror=&quot;x&quot;&gt;');
for(const e of events){assert(e.activity && e.tasks.length>=2,e.id+' individual activity');assert(e.activity.cards.length>0,e.id+' materials');assert(e.activity.result.length>30,e.id+' outcome');assert(e.year!==0,e.id+' year');for(const k of e.sources||[])assert(sources[k],e.id+' source '+k);for(const r of e.related||[])assert(events.some(x=>x.id===r)||['history','period','recurrence','materialism','medievalworld','egyptworld'].includes(r),e.id+' related '+r);if(e.image)assert(fs.existsSync(root+'/docs/assets/'+e.image),e.id+' image')}
vm.runInContext('globalThis.mediaTests={media:HISTORICAL_MEDIA,mediaHtml,images:IMAGE_MANIFEST}',ctx);
for(const [id,items] of Object.entries(ctx.mediaTests.media)){const e=events.find(e=>e.id===id);assert(e,id+' media event');const html=ctx.mediaTests.mediaHtml(e);assert(!html.includes('<iframe'),id+' no automatic embed');assert(!html.includes('<audio'),id+' no automatic audio load');for(const m of items){assert(m.source.startsWith('https://'));assert(m.question.length>50);assert(m.access.length>50);assert(html.includes('data-load-media="'+m.id+'"'));if(m.kind==='youtube')assert(/^[\w-]{11}$/.test(m.youtube));else assert(m.src.startsWith('https://'))}}
for(const a of ctx.mediaTests.images.filter(a=>a.filename.endsWith('-source.jpg'))){assert(a.author&&a.license&&a.source_page&&a.source_criticism);assert(fs.existsSync(root+'/docs/assets/'+a.filename));assert(!a.image_date.includes('QS:'))}
const videoBackup=api.defaults();videoBackup.materials.moon=[{name:'eigene-spur.mp4',type:'video/mp4',data:'data:video/mp4;base64,VGVzdA==',description:'Testmaterial'}];assert.equal(api.validate(videoBackup).materials.moon[0].type,'video/mp4');
console.log('PASS: Medien haben Quellen, individuelle Fragen und Alternativen; Player laden erst auf Aktion; neue Bilder haben Nachweise.');
console.log('PASS: Chronologie ohne Jahr null; Export/Import-Rundlauf mit Datei, Notiz und Relation; ungültige Daten; sichere Textausgabe; '+events.length+' Einträge mit gültigen Quellen, Beziehungen und Bilddateien.');

vm.runInContext('globalThis.modelTests={groups:CONCEPT_GROUPS,concepts:CONCEPTS,modeNoteLabel,networkHtml,presentHtml,layersHtml,directionHtml,recurrenceHtml,materialismHtml,medievalHtml,egyptHtml}',ctx);
for(const group of ctx.modelTests.groups)for(const id of group.items)assert(events.some(e=>e.id===id)||ctx.modelTests.concepts[id],id+' model link');
for(const name of ['networkHtml','presentHtml','layersHtml','directionHtml','recurrenceHtml','materialismHtml','medievalHtml','egyptHtml']){const html=ctx.modelTests[name]();assert(!html.includes('undefined'),name+' undefined content');assert(html.length>500,name+' content')}
assert(ctx.modelTests.modeNoteLabel('mode-present-war').includes('1914'));
assert(ctx.modelTests.modeNoteLabel('mode-layers-roman').includes('Infrastruktur'));
const notesState=api.defaults();notesState.notes['mode-podcast']='[03:20] Vergleich prüfen';assert.equal(api.validate(notesState).notes['mode-podcast'],notesState.notes['mode-podcast']);
console.log('PASS: Darstellungsmodelle, Konzeptverweise und Sicherung des Hörprotokolls.');

for(const which of ['factory','plantation'])for(const lens of ['forces','relations','politics','conflict']){vm.runInContext(`modeState.materialCase='${which}';modeState.materialLens='${lens}'`,ctx);const html=ctx.modelTests.materialismHtml();assert(!html.includes('undefined'));assert(html.includes('mode-materialism-'+which));assert(ctx.modelTests.modeNoteLabel('mode-materialism-'+which).length>35)}
const materialNotes=api.defaults();materialNotes.notes['mode-materialism-factory']='Maschine → Vereinbarung → Arbeitszeit';assert.equal(api.validate(materialNotes).notes['mode-materialism-factory'],materialNotes.notes['mode-materialism-factory']);
console.log('PASS: Beide Materialismusfälle, alle Perspektiven und Notizensicherung.');

for(const [mode,lenses] of [['medieval',['ages','calendar','power']],['egypt',['renewal','reigns','order']]])for(const lens of lenses){vm.runInContext(`modeState.${mode}Lens='${lens}'`,ctx);const html=ctx.modelTests[mode+'Html']();assert(!html.includes('undefined'));assert(html.includes('mode-'+mode+'-'+lens));assert(!ctx.modelTests.modeNoteLabel('mode-'+mode+'-'+lens).startsWith('mode-'));const n=api.defaults();n.notes['mode-'+mode+'-'+lens]='Eigene Quellenkritik';assert.equal(api.validate(n).notes['mode-'+mode+'-'+lens],'Eigene Quellenkritik')}
vm.runInContext("modeState.egyptLens='reigns';modeState.hideKing=false",ctx);const full=ctx.modelTests.egyptHtml();assert(full.includes('<strong>B</strong>'));vm.runInContext('modeState.hideKing=true',ctx);const omitted=ctx.modelTests.egyptHtml();assert(!omitted.includes('<strong>B</strong>'));assert(omitted.includes('nicht ungeschehen'));
for(const id of ['medievalworld','egyptworld']){const e=ctx.modelTests.concepts[id];assert(fs.existsSync(root+'/docs/assets/'+e.image));for(const k of e.sources)assert(sources[k]);for(const r of e.related)assert(events.some(x=>x.id===r)||ctx.modelTests.concepts[r]);assert(e.activity.steps.length>=2)}
console.log('PASS: Mittelalter und Ägypten: sechs Ansichten, selektive Königsliste, Quellen, Bilder und Notizensicherung.');
vm.runInContext('globalThis.universeTests={lensCorpus,lensItems,lensUniverseHtml,lensNoteKey,parseLensNote,lenses:GLOBAL_LENSES}',ctx);
const ut=ctx.universeTests;
for(const mode of Object.keys(ut.lenses)){
 vm.runInContext(`representation='${mode}';lensFocus='haiti'`,ctx);
 const html=ut.lensUniverseHtml();
 for(const e of ut.lensCorpus())assert(html.includes('data-lens-focus="'+e.id+'"'),mode+' missing corpus item '+e.id);
 assert(html.includes('lens-'+mode+'-haiti'));assert(!html.includes('undefined'));
 const fixture=api.defaults();fixture.lensAssignments[mode]={haiti:ut.lenses[mode].slots[0][0]};fixture.notes[ut.lensNoteKey(mode,'haiti')]='Deutung mit Beleg';const restored=api.validate(JSON.parse(JSON.stringify(fixture)));assert.equal(restored.lensAssignments[mode].haiti,fixture.lensAssignments[mode].haiti);assert.equal(restored.notes[ut.lensNoteKey(mode,'haiti')],'Deutung mit Beleg');
}
vm.runInContext("state.own.push({id:'universe-own',year:1900,lane:'ideas',own:true,title:'Eigene Denkspur',text:'Ein eigener Begriff'});representation='egypt';lensFocus='universe-own';state.lensAssignments.egypt={'universe-own':'order'}",ctx);
assert.equal(ut.lensItems('',true).length,1);assert.equal(ut.lensItems('eigene denkspur').length,1);assert(ut.lensUniverseHtml('',true).includes('data-lens-focus="universe-own"'));assert(ut.lensUniverseHtml('NO-MATCH').includes('ausserhalb des aktuellen Suchfilters'));
const malformed=api.defaults();malformed.lensAssignments={egypt:{haiti:'not-a-slot',invented:'order'}};assert.deepEqual(Object.keys(api.validate(malformed).lensAssignments.egypt),[]);
const legacy=api.defaults();delete legacy.lensAssignments;assert(api.validate(legacy).lensAssignments);
vm.runInContext("representation='memoria';lensFocus='memory'",ctx);const memoryHtml=ut.lensUniverseHtml();assert(memoryHtml.includes('Soziale Beziehungen'));assert(memoryHtml.includes('Halbwachs: soziale Rahmen'));assert(memoryHtml.includes('Assmann: kommunikativ'));assert(memoryHtml.includes('Überlappende Erinnerungsräume'));
const page=fs.readFileSync(root+'/docs/index.html','utf8');assert(page.indexOf('id="timelineUndated"')>page.indexOf('id="scroll"'));assert(page.includes('id="conceptView"'));assert(!page.includes('class="questions"'));
console.log('PASS: Gesamter Bestand in allen acht Konzeptansichten; eigene Begriffe; Suchfilter; Fokus; Zuordnungen und Deutungen im Sicherungsrundlauf; alte Sicherungen.');
// Exercise the actual timeline renderer and all eleven views with the same corpus.
ctx.dom={};ctx.document.querySelector=s=>ctx.dom[s]??=( {style:{},setAttribute(){},value:s==='#zoom'?'1':s==='#scale'?'focus':'',innerHTML:'',textContent:''} );ctx.document.querySelectorAll=()=>[];
vm.runInContext("state=defaults();state.own=[{id:'own-theory',year:1900,lane:'ideas',own:true,title:'Eigene Theorie',text:'Probe'},{id:'own-event',year:2000,lane:'eu',own:true,title:'Eigenes Ereignis',text:'Probe'}];globalThis.completeViews={tunnelItems,tunnelHtml,networkHtml,lensCorpus,lensUniverseHtml};",ctx);
const cv=ctx.completeViews,ids=cv.lensCorpus().map(e=>e.id);
assert.equal(ids.length,events.length+Object.keys(ctx.modelTests.concepts).length+2);
for(const mode of Object.keys(ut.lenses)){vm.runInContext(`representation='${mode}'`,ctx);const html=cv.lensUniverseHtml();for(const id of ids)assert(html.includes('data-lens-focus="'+id+'"'),mode+' missing '+id)}
vm.runInContext("representation='timeline';onlyOwn=false;render()",ctx);
const timeline=ctx.dom['#timeline'].innerHTML,undated=ctx.dom['#timelineUndated'].innerHTML;
for(const id of ids)assert((timeline+undated).includes('data-event="'+id+'"'),'timeline missing '+id);
assert(undated.includes('<details'));assert(!undated.includes('<h2>'));assert(!undated.includes('<details open'));assert(!timeline.includes('data-event="history"'));assert(undated.includes('data-event="history"'));assert(timeline.includes('data-event="augustine"'));assert(ctx.dom['#count'].textContent.startsWith(ids.length+' von '+ids.length));
const tunnel=cv.tunnelItems('',false);assert.deepEqual(Array.from(tunnel,e=>e.id).sort(),Array.from(ids).sort());
for(let i=0;i<tunnel.length;i++){const html=cv.tunnelHtml(tunnel);assert(html.includes('data-explore="'+tunnel[i].id+'"'));assert(!html.includes('NaN'));assert(!html.includes('undefined'));if(!tunnel[i].year)assert(html.includes('Begriffsraum ohne zeitliche Position'))}
assert(cv.tunnelHtml([]).includes('Keine Spur'));assert(!cv.tunnelHtml([]).includes('tunnelSelect'));
for(const id of ids)assert(cv.networkHtml('',false).includes('data-explore="'+id+'"'),'network missing '+id);
for(const topic of ['all','experience','change','knowing','remember']){vm.runInContext(`networkTopic='${topic}'`,ctx);const html=cv.networkHtml('',false);for(const id of ids)assert(html.includes('data-explore="'+id+'"'),'topic hides '+id)}
assert.equal(cv.tunnelItems('',true).length,2);assert.equal(cv.tunnelItems('Eigene Theorie',false).length,1);
const ownNetwork=cv.networkHtml('',true);assert(ownNetwork.includes('data-explore="own-theory"'));assert(ownNetwork.includes('data-explore="own-event"'));assert(!ownNetwork.includes('data-explore="augustine"'));
vm.runInContext("representation='timeline';onlyOwn=true;render()",ctx);assert(ctx.dom['#timeline'].innerHTML.includes('data-event="own-theory"'));assert(!ctx.dom['#timeline'].innerHTML.includes('data-event="augustine"'));
console.log('PASS: Alle elf Modi enthalten exakt denselben Bestand; vollständiger Ausgangsbestand plus eigene Ereignisse und Theorien; undatierte Begriffe, Suchfilter, Eigenfilter und leere Tunnel-Auswahl.');


vm.runInContext("visibleCategories=new Set(['local'])",ctx);
vm.runInContext("state=defaults();state.own=[{id:'own-local',year:2026,lane:'local',own:true,title:'Eigene Ortsgeschichte',text:'Beleg'}];onlyOwn=false;representation='timeline';render()",ctx);
const localIds=events.filter(e=>e.lane==='local').map(e=>e.id).concat('own-local');
assert.equal(localIds.length,13);assert.equal(cv.tunnelItems('',false).length,13);
for(const id of localIds){assert(ctx.dom['#timeline'].innerHTML.includes('data-event="'+id+'"'));assert(cv.networkHtml('',false).includes('data-explore="'+id+'"'))}
for(const mode of ['present','layers','direction','medieval','egypt','materialism','recurrence','memoria']){vm.runInContext(`representation='${mode}'`,ctx);const html=cv.lensUniverseHtml('',false);for(const id of localIds)assert(html.includes('data-lens-focus="'+id+'"'),mode+' local '+id)}
assert.equal(vm.runInContext('validate(JSON.parse(JSON.stringify(state))).own[0].lane',ctx),'local');
assert.equal(cv.tunnelItems('',true).length,1);assert(!ctx.dom['#timeline'].innerHTML.includes('data-event="moon"'));vm.runInContext('visibleCategories=new Set(LANES.map(l=>l[0]))',ctx);
console.log('PASS: Lokalfilter in elf Modi; eigene lokale Einträge sofort enthalten und im Backup erhalten.');

vm.runInContext("visibleCategories=new Set(['local','eu']);onlyOwn=false;representation='timeline';render()",ctx);
const combined=cv.tunnelItems('',false);assert(combined.some(e=>e.lane==='local'));assert(combined.some(e=>e.lane==='eu'));assert(combined.every(e=>['local','eu'].includes(e.lane)));
vm.runInContext('visibleCategories.clear();render()',ctx);assert.equal(cv.tunnelItems('',false).length,0);assert(cv.tunnelHtml([]).includes('Keine Spur'));assert(!ctx.dom['#timeline'].innerHTML.includes('class="event '));
vm.runInContext("visibleCategories=new Set(['ideas'])",ctx);assert(cv.tunnelItems('',false).some(e=>e.id==='history'));assert(cv.tunnelItems('',false).every(e=>!e.lane||e.lane==='ideas'));
vm.runInContext('visibleCategories=new Set(LANES.map(l=>l[0]))',ctx);
console.log('PASS: Mehrfachauswahl, leere Auswahl, erneutes Einschalten und Begriffe in der Erinnerungskategorie.');

vm.runInContext('globalThis.spatial={tunnelOrdinal,tunnelYear,tunnelProject,tunnelScene};tunnelTime=1800;tunnelSpan=200',ctx);
assert.equal(ctx.spatial.tunnelYear(ctx.spatial.tunnelOrdinal(-1)+1),1);
const pLocal=ctx.spatial.tunnelProject('local',0),pEurope=ctx.spatial.tunnelProject('eu',0);assert.notEqual(pLocal.x,pEurope.x);assert.notEqual(pLocal.y,pEurope.y);assert(ctx.spatial.tunnelProject('local',1).scale<pLocal.scale);
const before=ctx.spatial.tunnelScene(events);vm.runInContext('tunnelTime=1800.5',ctx);const after=ctx.spatial.tunnelScene(events);assert.notEqual(before.html,after.html);assert(after.shown.some(o=>o.e.id==='local-linth'));assert(!after.shown.some(o=>!Number.isFinite(o.e.year)));assert(!after.html.includes('NaN'));
console.log('PASS: Zeitfahrt zwischen Ereignisdaten; getrennte räumliche Kategorienachsen; Perspektivtiefe; kein Jahr null.');

vm.runInContext("globalThis.worldAPI={worldSelection,worldSceneHtml};worldYear=2026;worldWindow=130;worldAll=false;worldAssumption=true;state=defaults();state.own=[{id:'own-present',year:2026,lane:'local',own:true,title:'Eigene Gegenwart',text:'Beleg'}]",ctx);
for(const mode of Object.keys(ut.lenses)){vm.runInContext(`representation='${mode}';worldAssumption=true`,ctx);if(mode==='memoria')vm.runInContext("state.notes['premise-memoria-group']='Untersuchtes Stadtmuseum'",ctx);const first=ctx.worldAPI.worldSceneHtml(ut.lensItems());assert(first.includes('data-lens-focus="own-present"'));assert(first.includes('data-lens-focus="paris"'));assert(first.includes('data-lens-focus="history"'));vm.runInContext('worldAssumption=false',ctx);assert.notEqual(first,ctx.worldAPI.worldSceneHtml(ut.lensItems()),mode+' changes the visible construction')}
vm.runInContext("representation='present';worldYear=2014;worldAssumption=true",ctx);assert(ctx.worldAPI.worldSceneHtml(ut.lensItems()).includes('Erwartung ist kein Rückblick'));
vm.runInContext("representation='recurrence';worldPeriod=100",ctx);const cycle=ctx.worldAPI.worldSceneHtml(ut.lensItems());vm.runInContext('worldPeriod=73',ctx);assert.notEqual(cycle,ctx.worldAPI.worldSceneHtml(ut.lensItems()));
vm.runInContext('worldAll=true',ctx);assert.equal(ctx.worldAPI.worldSelection(ut.lensItems()).length,ut.lensItems().filter(e=>Number.isFinite(e.year)).length);
console.log('PASS: Gegenwart und eigene Ereignisse in acht Weltansichten; wirksame Annahmenschalter; offener Zukunftshorizont; veränderbare Zyklen; vollständiger Zeitraum.');

vm.runInContext("representation='medieval';state=defaults();worldAll=false;worldAssumption=true;globalThis.telosAPI={telosHtml,telosHeading,modeNoteLabel}",ctx);
assert(ctx.telosAPI.telosHtml().includes('Die Zielfrage bleibt offen'));assert(ctx.telosAPI.telosHeading('medieval').includes('Telos offen'));
vm.runInContext("state.notes['telos-medieval-goal']='Freiheit <für alle>';state.notes['telos-medieval-counter']='Ein begründeter Gegenbefund'",ctx);
assert(ctx.worldAPI.worldSceneHtml(events).includes('Freiheit &lt;für alle&gt;'));assert.equal(api.validate(JSON.parse(vm.runInContext('JSON.stringify(state)',ctx))).notes['telos-medieval-counter'],'Ein begründeter Gegenbefund');assert(ctx.telosAPI.modeNoteLabel('telos-medieval-goal').includes('Telos:'));
console.log('PASS: Offenes Telos, sichere Darstellung eigener Zielvorstellungen und gesicherte Gegenprüfung.');

vm.runInContext('globalThis.premiseAPI={labs:PREMISE_LABS,premiseLabHtml,premiseKey,modeNoteLabel};state=defaults();worldYear=2026;worldWindow=130;worldAll=false;worldAssumption=true',ctx);
for(const [mode,lab] of Object.entries(ctx.premiseAPI.labs)){
 vm.runInContext(`representation='${mode}';state=defaults()`,ctx);assert(ctx.premiseAPI.premiseLabHtml().includes(lab.open));const initial=ctx.worldAPI.worldSceneHtml(events);
 ctx.testPremiseKey=ctx.premiseAPI.premiseKey(mode,lab.anchor);vm.runInContext("state.notes[testPremiseKey]='Prüfannahme <mit Gegenargument>';",ctx);
 const changed=ctx.worldAPI.worldSceneHtml(events);assert(changed.includes('Prüfannahme &lt;mit Gegenargument&gt;'));assert.notEqual(initial,changed);assert(ctx.premiseAPI.modeNoteLabel(ctx.testPremiseKey).includes('Voraussetzung:'));assert.equal(api.validate(JSON.parse(vm.runInContext('JSON.stringify(state)',ctx))).notes[ctx.testPremiseKey],'Prüfannahme <mit Gegenargument>');
}
vm.runInContext("representation='memoria';state=defaults()",ctx);assert(!ctx.worldAPI.worldSceneHtml(events).includes('world-muted'));
vm.runInContext("state.notes['premise-memoria-group']='Familiengespräch';state.lensAssignments.memoria={paris:'social'}",ctx);assert(ctx.worldAPI.worldSceneHtml(events).includes('board-role-open'));assert(ctx.worldAPI.worldSceneHtml(events).includes('Familiengespräch'));
console.log('PASS: Sechs offene Voraussetzungen, individuell formulierte Gegenprüfungen, sichtbare Annahmen, sichere Notizen und Erinnerungsblende mit benanntem Rahmen.');

vm.runInContext("globalThis.profileAPI={ensureReading,activeReading,addReading,switchReading,setReadingDecision,readingDecision,readingLayout,captureReadings,readingComparisonHtml};state=defaults();representation='direction';worldAssumption=true;globalThis.originalSave=save;save=()=>{captureReadings();return Promise.resolve(true)}",ctx);
const pr=ctx.profileAPI;pr.ensureReading('direction');const firstId=pr.activeReading().id;
vm.runInContext("state.notes['telos-direction-goal']='Politische Teilhabe'",ctx);pr.setReadingDecision('paris','support',3,'Belegfrage: gemeinsame politische Handlungsfähigkeit.');const firstPos=pr.readingLayout(events.find(e=>e.id==='paris'),500,300,120);assert.equal(firstPos.cls,'reading-support');
const second=pr.addReading('Ziel B');assert.equal(pr.readingDecision('paris'),null);vm.runInContext("state.notes['telos-direction-goal']='Lokale Selbstbestimmung'",ctx);pr.setReadingDecision('paris','counter',2,'Belegfrage: begrenzte lokale Entscheidungsspielräume.');const secondPos=pr.readingLayout(events.find(e=>e.id==='paris'),500,300,120);assert.notEqual(firstPos.y,secondPos.y);
pr.switchReading(firstId);assert.equal(pr.readingDecision('paris').role,'support');assert(!pr.readingDecision('paris').stale);
ctx.otherReading=second.id;vm.runInContext('readingComparison=otherReading',ctx);const comparison=pr.readingComparisonHtml(events);assert(comparison.includes('Politische Teilhabe'));assert(comparison.includes('Lokale Selbstbestimmung'));assert(comparison.includes('Gleiche Quellen'));assert.equal(pr.activeReading().id,firstId);
vm.runInContext("state.notes['telos-direction-goal']='Neues Ziel'",ctx);assert(pr.readingDecision('paris').stale);assert.equal(pr.readingLayout(events.find(e=>e.id==='paris'),500,300,120).cls,'reading-stale');assert.throws(()=>pr.setReadingDecision('paris','support',2,''));
pr.captureReadings();const profileBackup=api.validate(JSON.parse(vm.runInContext('JSON.stringify(state)',ctx)));assert.equal(profileBackup.interpretations.direction.profiles.length,2);assert.equal(profileBackup.interpretations.direction.profiles[1].decisions.paris.role,'counter');assert.equal(profileBackup.interpretations.direction.profiles[0].notes['telos-direction-goal'],'Neues Ziel');
assert(api.validate({version:1,own:[],notes:{}}).interpretations);
vm.runInContext('save=originalSave;readingComparison=""',ctx);
console.log('PASS: Getrennte Zielentwürfe, tatsächliche Neupositionierung und Gewichtung, Seitenvergleich, erneute Prüfung bei geänderter Voraussetzung und Backup-Rundlauf.');

(async()=>{
 vm.runInContext("render=()=>{};save=async()=>true;toast=()=>{};state=defaults();state.own=[{id:'merge-own',year:1900,lane:'eu',own:true,title:'Lokale Fassung',text:'lokal'}];state.lensAssignments.egypt={haiti:'order'}",ctx);
 const incoming=api.defaults();incoming.own=[{id:'merge-own',year:1900,lane:'eu',own:true,title:'Andere Fassung',text:'importiert'}];incoming.lensAssignments.egypt={'merge-own':'selection',haiti:'renewal'};incoming.notes['lens-egypt-merge-own']='Importierte Interpretation';
 ctx.mergePayload=JSON.stringify(incoming);await vm.runInContext("importFile({size:mergePayload.length,text:async()=>mergePayload})",ctx);const merged=vm.runInContext('state',ctx),renamed=merged.own.find(e=>e.id!=='merge-own');assert(renamed);assert.equal(merged.lensAssignments.egypt[renamed.id],'selection');assert.equal(merged.notes['lens-egypt-'+renamed.id],'Importierte Interpretation');assert.equal(merged.lensAssignments.egypt.haiti,'order');assert(merged.notes['lens-egypt-haiti'].includes('Erneuerung'));console.log('PASS: Importkonflikte erhalten lokale Zuordnung und verbinden umbenannte eigene Spuren mit ihren Konzeptnotizen.');
 const profilesIncoming=api.defaults();profilesIncoming.own=[{id:'merge-own',year:1901,lane:'local',own:true,title:'Profilspur',text:'Import'}];profilesIncoming.interpretations.direction={active:'import-profile',profiles:[{id:'import-profile',name:'Importiertes Ziel',notes:{'telos-direction-goal':'Ziel aus Import'},assignments:{},decisions:{'merge-own':{role:'counter',weight:2,reason:'Andere Perspektive',basis:'[]'}}}]};ctx.mergePayload=JSON.stringify(profilesIncoming);await vm.runInContext("importFile({size:mergePayload.length,text:async()=>mergePayload})",ctx);const withProfiles=vm.runInContext('state',ctx),imported=withProfiles.interpretations.direction.profiles.find(p=>p.id==='import-profile'),importedEvent=withProfiles.own.find(e=>e.title==='Profilspur (importierte Fassung)');assert(importedEvent);assert(imported.decisions[importedEvent.id]);assert(!imported.decisions['merge-own']);console.log('PASS: Importierte Deutungsentwürfe folgen umbenannten eigenen Ereignissen.');

})().catch(e=>{console.error(e);process.exitCode=1});

// The three navigation surfaces share a question-led order; every perspective is explained before its controls.
vm.runInContext(`
const orderedPerspectives=PERSPECTIVE_GROUPS.flatMap(g=>g.keys);
if(new Set(orderedPerspectives).size!==8||orderedPerspectives.some(k=>!GLOBAL_LENSES[k]))throw Error('Perspective grouping loses a view');
for(const key of orderedPerspectives){
 representation=key;
 const html=lensUniverseHtml();
 if(html.indexOf('perspectiveIntroTitle')>html.indexOf('id="readingSelect"'))throw Error('Introduction follows controls');
 if(!html.includes('id="perspectiveExplanation" open'))throw Error('Introduction not initially visible');
 for(const source of PERSPECTIVE_INTROS[key].sources)if(!SOURCES[source])throw Error('Missing introduction source: '+source);
 const navigation=perspectiveOptions(key);
 if((navigation.match(/<optgroup /g)||[]).length!==4||(navigation.match(/<option /g)||[]).length!==8)throw Error('Navigation grouping mismatch');
}
`,ctx);
console.log('PASS: Vier Leitfragen, acht vollständig erreichbare Ansätze, sichtbare Einführungen vor der Arbeit und gültige Quellennachweise.');
vm.runInContext(`
for(const key of Object.keys(GLOBAL_LENSES)){
 representation=key;concreteChoice[key]=0;
 const first=concreteReadingHtml(),before=JSON.stringify(state);
 concreteChoice[key]=1;const second=concreteReadingHtml();
 if(first===second||!byId(CONCRETE_READINGS[key].event))throw Error('Worked example does not switch');
 if(before!==JSON.stringify(state))throw Error('Worked example changed student work');
 if(!worldReadingGuide().includes('<ol>'))throw Error('Missing graphic reading guide');
}
`,ctx);
console.log('PASS: Acht konkrete Beispiele wechseln ihre Lesart, ohne eigene Entwürfe zu verändern; alle Grafiken haben Lesehilfen.');

vm.runInContext(`
const boardTestState=state,boardTestMode=representation,boardTestAll=worldAll;
state=defaults();worldAll=true;worldAssumption=true;
for(const mode of Object.keys(GLOBAL_LENSES)){
 representation=mode;ensureReading(mode);
 const board=worldSceneHtml(lensItems());
 if(board.includes('<foreignObject')||!board.includes('semantic-board'))throw Error('Old clipped SVG board remains');
 for(const e of worldSelection(lensItems()))if(!board.includes('data-lens-focus="'+e.id+'"'))throw Error('Board lost '+e.id);
 const page=lensUniverseHtml();if(page.indexOf('semantic-board')>page.indexOf('concrete-reading'))throw Error('Board must precede explanation');
}
representation='medieval';state.notes['telos-medieval-goal']='Frieden';
setReadingDecision('paris','counter',2,'Konkrete Begründung');
const board=worldSceneHtml(lensItems());
if(!board.includes('board-role-counter')||!board.includes('Konkrete Begründung'))throw Error('Decision not legible on board');
state=boardTestState;representation=boardTestMode;worldAll=boardTestAll;
`,ctx);
console.log('PASS: Neue Tafeln vor allen Erklärungen; vollständige Karten ohne SVG-Clipping, alle datierten Spuren und lesbare Begründungen.');
vm.runInContext(`
const lessonOldMode=representation,lessonOldChoices={...concreteChoice};
const lessonOldState=JSON.stringify(state);
for(const mode of Object.keys(DIAGRAM_LESSONS)){
 representation=mode;concreteChoice[mode]=0;const a=instructionalDiagramHtml();concreteChoice[mode]=1;const b=instructionalDiagramHtml();
 if(a===b||!a.includes('<svg')||!b.includes('Hier endet der Beleg'))throw Error('Missing instructional contrast: '+mode);
 if(!byId(CONCRETE_READINGS[mode].event))throw Error('Missing lesson source');
}
if(JSON.stringify(state)!==lessonOldState)throw Error('Lesson modifies learner data');
representation=lessonOldMode;for(const k of Object.keys(concreteChoice))delete concreteChoice[k];Object.assign(concreteChoice,lessonOldChoices);
`,ctx);
console.log('PASS: Acht angeleitete Schaubilder mit sichtbarem Perspektivwechsel, Beleggrenzen und unveränderten eigenen Entwürfen.');
vm.runInContext(`
const overviewOldMode=representation,overviewOldAll=worldAll;worldAll=true;
const wholeItems=lensItems();
for(const mode of Object.keys(WHOLE_VIEW_FORMS)){
 representation=mode;const html=worldSceneHtml(wholeItems);
 for(const e of wholeItems)if(!html.includes('data-lens-focus="'+e.id+'"'))throw Error('Gesamtschau verliert '+e.id+' in '+mode);
 if(!html.includes(mode==='direction'?'goal-columns':'whole-form-backdrop'))throw Error('Gesamtform fehlt');
}
representation=overviewOldMode;worldAll=overviewOldAll;
`,ctx);
console.log('PASS: Acht erkennbare Gesamtformen mit dem identischen vollständigen Bestand einschliesslich undatierter Begriffe.');
vm.runInContext(`
const randomSnapshot={state,representation,worldYear,worldWindow,worldAll,worldAssumption,visibleCategories,onlyOwn,readingComparison,worldSheet,lastRestoredHeil,assumptions:{...worldAssumptions}};
try{
 state=defaults();representation='medieval';ensureReading('medieval');state.notes['telos-medieval-goal']='Eigener Entwurf bleibt';captureReadings();
 const original=activeReading(),first=randomHeilDraft(()=>0),firstId=activeReading().id;
 if(original.notes['telos-medieval-goal']!=='Eigener Entwurf bleibt')throw Error('Own draft overwritten');
 for(let i=0;i<20;i++){const old=generatedHeilMeta().model;const next=randomHeilDraft(()=>0);if(next.model===old)throw Error('Same random goal repeated');if(activeReading().id!==firstId)throw Error('Unbounded draft accumulation')}
 randomHeilDraft(()=>.99);if(worldAll||worldYear!==1975||worldWindow!==50)throw Error('Parameters not applied');
 captureReadings();const restored=validate(JSON.parse(JSON.stringify(state)));const profile=restored.interpretations.medieval.profiles.find(p=>p.id===firstId);
 if(!generatedHeilMeta(profile))throw Error('Generated parameters lost in backup');
 if(!randomHeilHtml().includes('1925 bis 2025'))throw Error('Period not disclosed');
 state.notes['telos-medieval-goal']='Bearbeitet';if(!randomHeilHtml().includes('Manuell angepasst'))throw Error('Edited provenance missing');
 if(Object.keys(activeReading().decisions).length)throw Error('Invented event interpretations');
}finally{({state,representation,worldYear,worldWindow,worldAll,worldAssumption,visibleCategories,onlyOwn,readingComparison,worldSheet,lastRestoredHeil}=randomSnapshot);for(const key of Object.keys(worldAssumptions))delete worldAssumptions[key];Object.assign(worldAssumptions,randomSnapshot.assumptions)}
`,ctx);
console.log('PASS: Zufallsentwürfe wechseln garantiert, setzen Zeitraum und Parameter, kennzeichnen Bearbeitung und überstehen Export/Import ohne eigene Entwürfe zu überschreiben.');
vm.runInContext(`
{
 const snapshot={state,representation,worldYear,worldWindow,worldAll,worldPeriod,worldAssumption,visibleCategories,onlyOwn,readingComparison,worldSheet,lastRestoredHeil,assumptions:{...worldAssumptions},restored:{...restoredRandomConcept}};
 try{
 for(const mode of Object.keys(RANDOM_CONCEPT_MODELS)){
  state=defaults();representation=mode;ensureReading(mode);
  const field=Object.keys(RANDOM_CONCEPT_MODELS[mode][0].fields)[0],key=randomFieldKey(mode,field);
  state.notes[key]='Eigener unveränderter Entwurf';captureReadings();const original=activeReading();
  randomConceptDraft(()=>0);const id=activeReading().id;
  for(let i=0;i<8;i++){const before=randomConceptMeta().model;randomConceptDraft(()=>i%2?.99:0);if(randomConceptMeta().model===before)throw Error('Wiederholung: '+mode);if(activeReading().id!==id)throw Error('Neue Profile ohne Grenze')}
  if(original.notes[key]!=='Eigener unveränderter Entwurf')throw Error('Eigener Entwurf überschrieben');
  const meta=randomConceptMeta(),model=RANDOM_CONCEPT_MODELS[mode].find(m=>m.id===meta.model);
  for(const [field,value] of Object.entries(model.fields))if(state.notes[randomFieldKey(mode,field)]!==value)throw Error('Parameter fehlt: '+mode+field);
  if(worldYear!==meta.year||worldAll!==meta.all||worldPeriod!==meta.period)throw Error('Ansicht nicht angewendet');
  if(mode==='present'&&worldYear!==model.view.year)throw Error('Inkohärenter Wissensstand');
  if(!randomConceptHtml().includes('Erzeugter Zeitraum:'))throw Error('Zeitraum fehlt');
  captureReadings();const copy=validate(JSON.parse(JSON.stringify(state))).interpretations[mode].profiles.find(p=>p.id===id);
  if(!randomConceptMeta(copy,mode))throw Error('Backup verliert Zufallsparameter');
  state.notes[key]='Manuell geändert';if(!randomConceptHtml().includes('Manuell angepasst'))throw Error('Änderung nicht kenntlich');
  if(Object.keys(activeReading().decisions).length)throw Error('Erfundene Ereignisbewertung');
 }
 }finally{({state,representation,worldYear,worldWindow,worldAll,worldPeriod,worldAssumption,visibleCategories,onlyOwn,readingComparison,worldSheet,lastRestoredHeil}=snapshot);for(const k of Object.keys(worldAssumptions))delete worldAssumptions[k];Object.assign(worldAssumptions,snapshot.assumptions);for(const k of Object.keys(restoredRandomConcept))delete restoredRandomConcept[k];Object.assign(restoredRandomConcept,snapshot.restored)}
}
`,ctx);
console.log('PASS: Alle sieben weiteren Ansätze mit wechselnden, kohärenten, editierbaren Zufallsparametern und verlustfreiem Backup; eigene Profile bleiben erhalten.');
vm.runInContext(`{
 const oldSize=centurySize,oldSelection=centurySelection;
 try{
 for(const size of [200,500,1000]){
 centurySize=size;const groups=centuryGroups();
 for(let i=1;i<groups.length;i++){const a=groups[i-1],b=groups[i];if(astronomical(b.from)!==astronomical(a.to)+1)throw Error('Lücke zwischen Jahrhundertgruppen');if(b.to-b.from+1!==size)throw Error('Ungleiche numerische Gruppen')}
 }
 centurySize=200;centurySelection=new Set(['1801']);
 if(!centuryVisible({year:1790,end:1820})||centuryVisible({year:1800})||!centuryVisible({year:2000})||centuryVisible({year:2001}))throw Error('Zeitgrenzen oder Überlappung falsch');
 if(!centuryVisible({title:'Undatiert'}))throw Error('Undatierte Begriffe verloren');
 if(JSON.stringify(centuryDomain())!==JSON.stringify([1801,2000]))throw Error('Falscher Ausschnitt');
 centurySelection=new Set();if(centuryVisible({year:1900}))throw Error('Leere Auswahl ignoriert');
 centurySelection=null;if(!centuryVisible({year:-17000}))throw Error('Gesamtbestand fehlt');
 }finally{centurySize=oldSize;centurySelection=oldSelection}
}`,ctx);
console.log('PASS: Numerisch gleichmässige Jahrhundertgruppen ohne Jahr null; Überlappungen, leere Auswahl und vollständiger Bestand.');
vm.runInContext(`{
 const old=comparePeriods;
 try{
 comparePeriods=[{from:1701,to:1800},{from:1901,to:2100}];
 if(periodPosition(1751,comparePeriods[0],2600)!==periodPosition(1951,comparePeriods[1],2600))throw Error('Ungleicher Massstab');
 if(periodPosition(1800,comparePeriods[0],2600)>=periodPosition(2100,comparePeriods[1],2600))throw Error('Ungleiche Dauern gestreckt');
 if(!periodContains({year:1690,end:1720},comparePeriods[0])||periodContains({year:1801},comparePeriods[0])||periodContains({},comparePeriods[0]))throw Error('Falsche Vergleichsauswahl');
 if(periodDuration({from:-1,to:1})!==1)throw Error('Jahr null im Vergleich');
 }finally{comparePeriods=old}
}`,ctx);
console.log('PASS: Zeitvergleich mit gemeinsamem proportionalem Massstab, unterschiedlichen Dauern, Intervallüberlappung und ohne Jahr null.');
vm.runInContext(`{
 const snapshot={representation,centurySelection,centurySize,periodCompare,visibleCategories,worldAll,state,tunnelTime,tunnelSpan};
 try{
 state=defaults();centurySize=200;centurySelection=new Set(['1801']);visibleCategories=new Set(['local']);periodCompare=false;
 for(const mode of REPRESENTATIONS.map(r=>r[0])){representation=mode;const items=lensItems();if(items.some(e=>e.lane!=='local'||!centuryVisible(e)))throw Error('Profil ignoriert Filter: '+mode);if(items.length!==6)throw Error('Unterschiedlicher Bestand: '+mode)}
 periodCompare=true;const p={from:1801,to:1900};
 for(const mode of Object.keys(GLOBAL_LENSES)){
 representation=mode;ensureReading(mode);const items=lensItems().filter(e=>periodContains(e,p)),before=JSON.stringify(state),oldAll=worldAll;
 const html=profileComparisonScene(items,p,0);for(const e of items)if(!html.includes('data-lens-focus="'+e.id+'"'))throw Error('Vergleich verliert Spur '+mode);
 if(before!==JSON.stringify(state)||worldAll!==oldAll)throw Error('Vergleich verändert Entwurf');
 }
 representation='tunnel';const t=tunnelTime,span=tunnelSpan;profileComparisonScene(lensItems().filter(e=>periodContains(e,p)),p,0);if(t!==tunnelTime||span!==tunnelSpan)throw Error('Vergleich verändert Zeitfahrt');
 }finally{({representation,centurySelection,centurySize,periodCompare,visibleCategories,worldAll,state,tunnelTime,tunnelSpan}=snapshot)}
}`,ctx);
console.log('PASS: Gemeinsame Kategorie- und Zeitfilter in elf Profilen; acht native Vergleichsformen ohne Veränderung der Deutungen oder Tunnelparameter.');
vm.runInContext(`{
 const snapshot={representation,worldYear,worldAll,worldAssumption};
 try{representation='present';worldAll=true;worldAssumption=true;worldYear=1850;
 const items=[{id:'test-before',year:1800,title:'Frühere Spur'},{id:'test-after',year:1900,title:'Spätere Spur'}];
 let html=worldSceneHtml(items);
 if(!html.includes('present-retrospect" >')||!html.includes('keine damaligen Erwartungen')||html.includes('Erwarten: Ausgang noch offen'))throw Error('Rückblick nicht sauber getrennt');
 if(html.indexOf('data-lens-focus="test-after"')<html.indexOf('present-retrospect'))throw Error('Zukunft als damalige Erwartung gezeigt');
 worldYear=1950;html=worldSceneHtml(items);if(html.indexOf('data-lens-focus="test-after"')>html.indexOf('present-retrospect'))throw Error('Standjahr verschiebt Spur nicht');
 }finally{({representation,worldYear,worldAll,worldAssumption}=snapshot)}
}`,ctx);
console.log('PASS: Erlebte Zeit trennt Erwartungen vom geschlossenen Rückblick und verschiebt datierte Spuren mit dem Standjahr.');
vm.runInContext(`{
 for(let i=0;i<8;i++){if(augustinePhase(i,0)!=='expected'||augustinePhase(i,1)!=='remembered')throw Error('Anfang/Ende des Klangversuchs falsch')}
 if(augustinePhase(0,.2)!=='remembered'||augustinePhase(1,.2)!=='attended'||augustinePhase(2,.2)!=='expected')throw Error('Drei Vollzüge im Verlauf fehlen');
 const html=presentSceneHtml([]);if(!html.includes('conscious-eternity" hidden')||!html.includes('keinem Nacheinander')||!html.includes('kein historisches Lied'))throw Error('Ewigkeit/Modellgrenze nicht ausgewiesen');
}`,ctx);
console.log('PASS: Klangfolge wandert von Erwartung über Aufmerksamkeit in Erinnerung; Ewigkeit und didaktischer Modellstatus ausdrücklich getrennt.');

// Character drafts remain separate from historical entries and filter state.
vm.runInContext('globalThis.characterTests={characters:AUGUSTINE_CHARACTERS,next:nextAugustineCharacter};',ctx);
const ct=ctx.characterTests;
assert.equal(ct.characters.length,30);
assert.equal(new Set(ct.characters.map(c=>c.id)).size,30);
for(let i=0;i<30;i++){
 const c=ct.characters[i];assert(Number.isInteger(c.year)&&c.year!==0);assert(events.some(e=>e.id===c.related)||ctx.modelTests.concepts[c.related]);
 for(const field of ['memory','attention','expectation','limit'])assert(c[field].length>35,c.id+' '+field);
 for(const value of [0,.01,.5,.99,.99999999]){const next=ct.next(i,value);assert(next>=0&&next<30);assert.notEqual(next,i);}
}
assert(ct.characters.some(c=>c.id==='nero'&&c.year===60));assert(ct.characters.some(c=>c.id==='custos'&&c.year===1150));
console.log('PASS: 30 distinct historical first-person drafts, complete perspectives, existing context links and random change without immediate repetition.');
vm.runInContext(`
const goalTestPrevious={state,representation,worldAll,worldAssumption};
state=defaults();representation='direction';worldAll=true;worldAssumption=true;ensureReading('direction');state.notes['telos-direction-goal']='Politische Gleichberechtigung';
setReadingDecision('vote','support',2,'1971 wurde das eidgenössische Stimmrecht auf Schweizer Frauen erweitert.');
let overview=directionOverviewHtml(lensItems());
if(!overview.includes('goal-event board-role-support')||!overview.includes('1971 wurde'))throw Error('Begründetes Urteil fehlt');
if(overview.includes('diagram-number')||!overview.includes('Wann beginnt politische Gleichheit?'))throw Error('Unlesbare Ereignisse');
state.notes['telos-direction-goal']='Anderes Ziel';overview=directionOverviewHtml(lensItems());
if(overview.includes('goal-event board-role-support')||!overview.includes('erneut prüfen'))throw Error('Zielwechsel muss Urteile öffnen');
state=goalTestPrevious.state;representation=goalTestPrevious.representation;worldAll=goalTestPrevious.worldAll;worldAssumption=goalTestPrevious.worldAssumption;
`,ctx);
console.log('PASS: Zielübersicht zeigt benannte Ereignisse, begründete Urteile und erneute Prüfung nach Zielwechsel.');
