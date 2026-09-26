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
console.log('PASS: Gesamter Bestand in allen sieben Konzeptansichten; eigene Begriffe; Suchfilter; Fokus; Zuordnungen und Deutungen im Sicherungsrundlauf; alte Sicherungen.');
(async()=>{
 vm.runInContext("render=()=>{};save=async()=>true;toast=()=>{};state=defaults();state.own=[{id:'merge-own',year:1900,lane:'eu',own:true,title:'Lokale Fassung',text:'lokal'}];state.lensAssignments.egypt={haiti:'order'}",ctx);
 const incoming=api.defaults();incoming.own=[{id:'merge-own',year:1900,lane:'eu',own:true,title:'Andere Fassung',text:'importiert'}];incoming.lensAssignments.egypt={'merge-own':'selection',haiti:'renewal'};incoming.notes['lens-egypt-merge-own']='Importierte Interpretation';
 ctx.mergePayload=JSON.stringify(incoming);await vm.runInContext("importFile({size:mergePayload.length,text:async()=>mergePayload})",ctx);const merged=vm.runInContext('state',ctx),renamed=merged.own.find(e=>e.id!=='merge-own');assert(renamed);assert.equal(merged.lensAssignments.egypt[renamed.id],'selection');assert.equal(merged.notes['lens-egypt-'+renamed.id],'Importierte Interpretation');assert.equal(merged.lensAssignments.egypt.haiti,'order');assert(merged.notes['lens-egypt-haiti'].includes('Erneuerung'));console.log('PASS: Importkonflikte erhalten lokale Zuordnung und verbinden umbenannte eigene Spuren mit ihren Konzeptnotizen.');
})().catch(e=>{console.error(e);process.exitCode=1});
