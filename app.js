(() => {
const KEY='gymtracker-beta-data';
const library=[
['Presse à cuisses','Jambes'],['Leg extension','Jambes'],['Leg curl','Jambes'],['Squat','Jambes'],['Fentes','Jambes'],
['Développé couché','Pectoraux'],['Chest press','Pectoraux'],['Écartés à la poulie','Pectoraux'],
['Tirage vertical','Dos'],['Tirage horizontal','Dos'],['Rowing haltère','Dos'],
['Développé épaules','Épaules'],['Élévations latérales','Épaules'],
['Curl biceps','Bras'],['Extension triceps','Bras'],['Crunch','Abdos'],['Gainage','Abdos']
].map((x,i)=>({id:'lib'+i,name:x[0],category:x[1]}));
let data;try{data=JSON.parse(localStorage.getItem(KEY))||{}}catch{data={}}
data.workouts=data.workouts||[];
data.trackedExercises=data.trackedExercises||[];
// Bring across exercises entered in the previous "point de départ" screen.
if(!data.trackedExercises.length && data.baseline?.performances?.length){
 data.trackedExercises=data.baseline.performances.map((p,i)=>({id:'tracked-'+i,exerciseId:p.exerciseId,name:p.exerciseName,initial:Number(p.weight)||0,current:Number(p.weight)||0,category:'À classer'}));
}
if(!data.trackedExercises.length && data.baseline?.performances?.length===0) data.trackedExercises=[];
const app=document.getElementById('app');
let page='home';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
const heading=(small,title,sub)=>`<header class="simple-heading"><p class="eyebrow">${small}</p><h1>${title}</h1><p class="muted">${sub}</p></header>`;
function home(){
 const rows=data.trackedExercises;
 return `<section class="page">
 ${heading('SUIVI DE PROGRESSION','Mes exercices','Tes poids de départ et tes poids actuels, au même endroit.')}
 <div class="row-between"><h2 class="section-heading">Ma progression</h2><span class="pill">${rows.length} exercice${rows.length>1?'s':''}</span></div>
 ${rows.length?`<div class="tracked-list">${rows.map((x,i)=>`<article class="tracked-card">
  <div class="row-between"><div class="exercise-title"><span class="mini-icon">✦</span><div><strong>${esc(x.name)}</strong><small>${esc(x.category||'Exercice personnalisé')}</small></div></div><button class="remove-btn" aria-label="Supprimer ${esc(x.name)}" data-action="remove" data-index="${i}">×</button></div>
  <div class="current-weight-panel">
   <span class="current-label">POIDS ACTUEL</span>
   <div class="current-controls"><button class="step-btn" aria-label="Diminuer de 5 kg" data-action="step" data-delta="-5" data-index="${i}">−</button><strong>${Number(x.current).toLocaleString('fr-FR',{maximumFractionDigits:1})}<small>kg</small></strong><button class="step-btn" aria-label="Augmenter de 5 kg" data-action="step" data-delta="5" data-index="${i}">+</button></div>
  </div>
  <div class="initial-compact"><span>Poids initial</span><label><input aria-label="Poids initial de ${esc(x.name)}" type="number" min="0" step="0.5" value="${x.initial}" data-field="initial" data-index="${i}"><b>kg</b></label></div>
  <div class="progress-note">${Number(x.current)>=Number(x.initial)?`+${(Number(x.current)-Number(x.initial)).toLocaleString('fr-FR',{maximumFractionDigits:1})} kg depuis le départ`:`${(Number(x.current)-Number(x.initial)).toLocaleString('fr-FR',{maximumFractionDigits:1})} kg depuis le départ`}</div>
 </article>`).join('')}</div>`:`<div class="empty-state"><span class="mini-icon">✦</span><b>Pas encore d'exercice suivi</b><span>Ajoute tes exercices ci-dessous pour comparer ton poids initial et ton poids actuel.</span></div>`}
 <div class="panel add-panel"><h2 class="section-heading">＋ Ajouter un exercice</h2>
  <label class="field">Choisir un exercice<select id="addExerciseSelect"><option value="">Sélectionner...</option>${library.map((x,i)=>`<option value="${i}">${esc(x.name)} · ${esc(x.category)}</option>`).join('')}</select></label>
  <div class="form-grid">
   <label class="field">Poids initial (kg)<input id="newInitial" type="number" min="0" step="0.5" placeholder="Ex. 20"></label>
   <label class="field">Poids actuel (kg)<input id="newCurrent" type="number" min="0" step="0.5" placeholder="Ex. 35"></label>
  </div>
  <button class="primary-button full" data-action="add">Ajouter à ma page</button>
 </div>
 <button class="history-link full" data-page="history">Voir mon historique de séances →</button>
 </section>`;
}
function history(){
 return `<section class="page">${heading('MES ENTRAÎNEMENTS','Historique','Les séances enregistrées sur cet appareil.')}
 ${data.workouts.length?`<div class="stack">${[...data.workouts].reverse().map(w=>`<article class="panel workout-card"><div class="row-between"><strong>${esc(w.name||'Séance')}</strong><small>${new Date(w.date).toLocaleDateString('fr-FR')}</small></div>${(w.exercises||[]).map(e=>`<div class="row-between"><span>${esc(e.exerciseName)}</span><small>${e.sets?.length||0} séries</small></div>`).join('')}</article>`).join('')}</div>`:`<div class="empty-state">Tu n'as pas encore de séance enregistrée.</div>`}
 <button class="secondary-button full" data-page="home">← Retour à mes exercices</button></section>`;
}
function render(){app.innerHTML=page==='home'?home():history();}
app.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.page){page=b.dataset.page;render();window.scrollTo(0,0);return}
 const a=b.dataset.action;
 if(a==='add'){
  const select=document.getElementById('addExerciseSelect'),n=Number(select.value);
  if(select.value===''){alert('Choisis un exercice.');return}
  const ex=library[n],initial=Number(document.getElementById('newInitial').value),current=Number(document.getElementById('newCurrent').value);
  if(!Number.isFinite(initial)||!Number.isFinite(current)||document.getElementById('newInitial').value===''||document.getElementById('newCurrent').value===''||initial<0||current<0){alert('Renseigne les deux poids (initial et actuel).');return}
  if(data.trackedExercises.some(x=>x.name===ex.name)){alert('Cet exercice est déjà dans ta liste.');return}
  data.trackedExercises.push({id:'track-'+Date.now(),exerciseId:ex.id,name:ex.name,category:ex.category,initial,current});save();render();
 }
 if(a==='step'){const x=data.trackedExercises[Number(b.dataset.index)];x.current=Math.max(0,Math.round((Number(x.current)+Number(b.dataset.delta))*10)/10);save();render()}
 if(a==='remove'){if(confirm('Retirer cet exercice de ta page ?')){data.trackedExercises.splice(Number(b.dataset.index),1);save();render()}}
});
app.addEventListener('change',e=>{
 if(e.target.matches('[data-field="initial"]')){const i=Number(e.target.dataset.index),v=Number(e.target.value);if(Number.isFinite(v)&&v>=0){data.trackedExercises[i].initial=v;save();render()}}
});
document.getElementById('settingsBtn')?.addEventListener('click',()=>document.getElementById('settingsDialog').showModal());
document.getElementById('closeSettings')?.addEventListener('click',()=>document.getElementById('settingsDialog').close());
document.getElementById('exportBtn')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='gymtracker-sauvegarde.json';a.click();URL.revokeObjectURL(url)});
document.getElementById('importFile')?.addEventListener('change',async e=>{try{const v=JSON.parse(await e.target.files[0].text());if(!Array.isArray(v.trackedExercises)&&!Array.isArray(v.workouts))throw Error();data=v;data.trackedExercises=data.trackedExercises||[];data.workouts=data.workouts||[];save();render();alert('Sauvegarde importée.')}catch{alert('Fichier invalide.')}});
document.getElementById('clearBtn')?.addEventListener('click',()=>{if(confirm('Effacer toutes les données ?')){data={workouts:[],trackedExercises:[]};save();render();document.getElementById('settingsDialog').close()}});
render();
})();