(() => {
const KEY='gymtracker-beta-data';
const library=[
['Presse à cuisses','Jambes'],['Squat','Jambes'],['Squat guidé (Smith)','Jambes'],['Hack squat','Jambes'],['Presse horizontale','Jambes'],['Fentes','Jambes'],['Fentes bulgares','Jambes'],['Soulevé de terre','Jambes'],['Soulevé de terre jambes tendues','Jambes'],['Hip thrust','Jambes'],['Leg extension','Jambes'],['Leg curl assis','Jambes'],['Leg curl couché','Jambes'],['Adducteurs machine','Jambes'],['Abducteurs machine','Jambes'],['Mollets debout','Jambes'],['Mollets assis','Jambes'],
['Développé couché','Pectoraux'],['Développé couché incliné','Pectoraux'],['Développé couché décliné','Pectoraux'],['Développé haltères','Pectoraux'],['Développé incliné haltères','Pectoraux'],['Chest press','Pectoraux'],['Butterfly','Pectoraux'],['Pec deck','Pectoraux'],['Écartés à la poulie','Pectoraux'],['Écartés haltères','Pectoraux'],['Pompes','Pectoraux'],['Dips','Pectoraux'],
['Tirage vertical','Dos'],['Tirage vertical prise serrée','Dos'],['Tirage horizontal','Dos'],['Rowing haltère','Dos'],['Rowing barre','Dos'],['Rowing T-bar','Dos'],['Rowing assis poulie','Dos'],['Tractions','Dos'],['Soulevé de terre','Dos'],['Pull-over poulie','Dos'],['Extensions lombaires','Dos'],
['Développé épaules','Épaules'],['Développé militaire','Épaules'],['Développé Arnold','Épaules'],['Élévations latérales','Épaules'],['Élévations latérales à la poulie','Épaules'],['Élévations frontales','Épaules'],['Oiseau (arrière épaules)','Épaules'],['Reverse pec deck','Épaules'],['Shrugs (haussements d’épaules)','Épaules'],
['Curl biceps','Bras'],['Curl marteau','Bras'],['Curl pupitre','Bras'],['Curl incliné haltères','Bras'],['Curl poulie','Bras'],['Extension triceps poulie','Bras'],['Extension triceps corde','Bras'],['Barre au front','Bras'],['Extension triceps au-dessus de la tête','Bras'],['Développé serré','Bras'],
['Crunch','Abdos'],['Crunch poulie','Abdos'],['Relevés de jambes','Abdos'],['Gainage','Abdos'],['Gainage latéral','Abdos'],['Russian twists','Abdos'],['Abdos machine','Abdos'],
['Développé couché prise serrée','Haut du corps'],['Farmer walk','Haut du corps']
].map((x,i)=>({id:'lib'+i,name:x[0],category:x[1]}));
let data;try{data=JSON.parse(localStorage.getItem(KEY))||{}}catch{data={}}
data.workouts=data.workouts||[];
data.programs=Array.isArray(data.programs)?data.programs:[];
data.trackedExercises=data.trackedExercises||[];
data.progressHistory=Array.isArray(data.progressHistory)?data.progressHistory:[];
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
 <div class="row-between"><h2 class="section-heading">Ma progression</h2><div class="progress-actions"><span class="pill">${rows.length} exercice${rows.length>1?'s':''}</span><button class="add-icon-btn" data-action="open-add" aria-label="Ajouter un exercice" title="Ajouter un exercice">＋</button></div></div>
 ${rows.length?`<div class="tracked-list">${rows.map((x,i)=>`<article class="tracked-card">
  <div class="row-between"><div class="exercise-title"><span class="mini-icon">✦</span><div><strong>${esc(x.name)}</strong><small>${esc(x.category||'Exercice personnalisé')}</small></div></div><div class="exercise-card-actions"><button class="move-btn" aria-label="Monter ${esc(x.name)}" data-action="move-up" data-index="${i}" ${i===0?"disabled":""}>↑</button><button class="move-btn" aria-label="Descendre ${esc(x.name)}" data-action="move-down" data-index="${i}" ${i===rows.length-1?"disabled":""}>↓</button><button class="remove-btn" aria-label="Supprimer ${esc(x.name)}" data-action="remove" data-index="${i}">×</button></div></div>
  <div class="current-weight-panel">
   <span class="current-label">POIDS ACTUEL</span>
   <div class="current-controls"><button class="step-btn" aria-label="Diminuer de 1 kg" data-action="step" data-delta="-1" data-index="${i}">−</button><strong>${Number(x.current).toLocaleString('fr-FR',{maximumFractionDigits:1})}<small>kg</small></strong><button class="step-btn" aria-label="Augmenter de 1 kg" data-action="step" data-delta="1" data-index="${i}">+</button></div>
  </div>
  <div class="initial-compact"><span>Poids initial</span><label><input aria-label="Poids initial de ${esc(x.name)}" type="number" min="0" step="0.5" value="${x.initial}" data-field="initial" data-index="${i}"><b>kg</b></label></div>
  <div class="progress-note">${Number(x.current)>=Number(x.initial)?`+${(Number(x.current)-Number(x.initial)).toLocaleString('fr-FR',{maximumFractionDigits:1})} kg depuis le départ`:`${(Number(x.current)-Number(x.initial)).toLocaleString('fr-FR',{maximumFractionDigits:1})} kg depuis le départ`}</div>
 </article>`).join('')}</div>`:`<div class="empty-state"><span class="mini-icon">✦</span><b>Pas encore d'exercice suivi</b><span>Appuie sur le + pour ajouter tes premiers exercices.</span></div>`}
 <dialog id="addExerciseDialog" class="app-dialog">
  <div class="dialog-head"><h2>Ajouter un exercice</h2><button class="icon-button" data-action="close-add" aria-label="Fermer">✕</button></div>
  <div class="field exercise-search-field">Rechercher un exercice
   <input id="exerciseSearch" type="text" autocomplete="off" placeholder="Tape le nom de l’exercice…" aria-label="Rechercher un exercice">
   <div id="exerciseSuggestions" class="exercise-suggestions"><span class="suggestion-hint">Commence à taper pour voir les suggestions.</span></div>
   <select id="addExerciseSelect" hidden><option value="">Sélectionner...</option>${library.map((x,i)=>`<option value="${i}">${esc(x.name)} · ${esc(x.category)}</option>`).join('')}</select>
  </div>
  <div class="form-grid">
   <label class="field">Poids initial (kg)<input id="newInitial" type="number" min="0" step="0.5" placeholder="Ex. 20"></label>
   <label class="field">Poids actuel (kg)<input id="newCurrent" type="number" min="0" step="0.5" placeholder="Ex. 35"></label>
  </div>
  <button class="primary-button full" data-action="add">Ajouter à ma page</button>
 </dialog>
 <button class="history-link full" data-page="sessions">Créer mes programmes hebdomadaires →</button>
 </section>`;
}

function programExerciseCard(x){
 const initial=Number(x.initial)||0, current=Number(x.current)||0, delta=current-initial;
 const gain=(delta>=0?'+':'')+delta.toLocaleString('fr-FR',{maximumFractionDigits:1})+' kg';
 return `<div class="program-exercise-progress">
  <div class="progress-weight"><span>Poids initial</span><strong>${initial.toLocaleString('fr-FR',{maximumFractionDigits:1})}<small> kg</small></strong></div>
  <div class="progress-curve"><span class="gain-chip">${gain}</span><svg viewBox="0 0 120 54" preserveAspectRatio="none" aria-hidden="true"><path class="curve-fill" d="M4 45 C38 46 64 29 116 7 L116 54 L4 54 Z"/><path class="curve-line" d="M4 45 C38 46 64 29 116 7"/><circle cx="4" cy="45" r="3.5"/><circle cx="116" cy="7" r="3.5"/></svg></div>
  <div class="progress-weight current"><span>Poids actuel</span><strong>${current.toLocaleString('fr-FR',{maximumFractionDigits:1})}<small> kg</small></strong></div>
 </div>`;
}

function sessions(){
 const days=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
 const programs=data.programs||[];
 const cards=programs.length?`<div class="stack">${programs.map((p,i)=>`<article class="panel workout-card">
  <div class="row-between"><strong>${esc(p.name)}</strong><button class="remove-btn" data-action="delete-program" data-index="${i}" aria-label="Supprimer ${esc(p.name)}">×</button></div>
  <div class="program-days">${(p.days||[]).map(d=>`<span class="day-chip">${esc(d)}</span>`).join('')}</div>
  <div class="program-exercises">${(p.exerciseIds||[]).map(id=>data.trackedExercises.find(x=>x.id===id)).filter(Boolean).map(x=>`<div class="program-exercise-item"><strong>${esc(x.name)}</strong><span class="program-category">${esc(x.category||'Exercice')}</span>${programExerciseCard(x)}</div>`).join('')}</div>
  <button class="text-button" data-action="edit-program" data-index="${i}">Modifier le programme</button>
 </article>`).join('')}</div>`:`<div class="empty-state"><span class="mini-icon">✦</span><b>Aucun programme pour le moment</b><span>Crée tes séances hebdomadaires à partir de tes exercices enregistrés.</span></div>`;
 return `<section class="page">${heading('TON PLANNING','Séances','Organise tes programmes de la semaine.')}
 <button class="primary-button full" data-action="open-program">＋ Créer un programme</button>${cards}
 <dialog id="programDialog" class="app-dialog">
  <div class="dialog-head"><h2 id="programDialogTitle">Nouveau programme</h2><button class="icon-button" data-action="close-program" aria-label="Fermer">✕</button></div>
  <label class="field">Nom du programme<input id="programName" type="text" placeholder="Ex. Haut du corps" maxlength="50"></label>
  <div class="field"><b>Jours de la semaine</b><div class="day-options">${days.map(d=>`<label class="day-option"><input type="checkbox" name="programDay" value="${d}"><span>${d}</span></label>`).join('')}</div></div>
  <div class="field"><b>Exercices</b><div class="program-exercise-options">${data.trackedExercises.length?data.trackedExercises.map(x=>`<label class="exercise-option"><input type="checkbox" name="programExercise" value="${esc(x.id)}"><span>${esc(x.name)}</span></label>`).join(''):'<p class="muted">Ajoute d’abord des exercices dans « Mes exercices ».</p>'}</div></div>
  <button class="primary-button full" data-action="save-program">Enregistrer le programme</button>
 </dialog></section>`;
}

function render(){app.innerHTML=page==='home'?home():sessions();document.querySelectorAll('.bottom-nav button[data-page]').forEach(nav=>nav.classList.toggle('active',nav.dataset.page===page));}
let editingProgram=-1;

document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.page){
  page=b.dataset.page;
  render();
  document.querySelectorAll('.bottom-nav button[data-page]').forEach(nav=>nav.classList.toggle('active',nav.dataset.page===page));
  window.scrollTo(0,0);
  return;
 }
 const a=b.dataset.action;
 if(a==='open-program'){editingProgram=-1;const dlg=document.getElementById('programDialog');if(!dlg)return;document.getElementById('programDialogTitle').textContent='Nouveau programme';document.getElementById('programName').value='';dlg.querySelectorAll('input[type="checkbox"]').forEach(x=>x.checked=false);dlg.showModal();return}
 if(a==='close-program'){document.getElementById('programDialog')?.close();return}
 if(a==='edit-program'){editingProgram=Number(b.dataset.index);const p=data.programs[editingProgram],dlg=document.getElementById('programDialog');document.getElementById('programDialogTitle').textContent='Modifier le programme';document.getElementById('programName').value=p.name||'';dlg.querySelectorAll('input[name="programDay"]').forEach(x=>x.checked=(p.days||[]).includes(x.value));dlg.querySelectorAll('input[name="programExercise"]').forEach(x=>x.checked=(p.exerciseIds||[]).includes(x.value));dlg.showModal();return}
 if(a==='save-program'){const name=document.getElementById('programName').value.trim();const days=[...document.querySelectorAll('input[name="programDay"]:checked')].map(x=>x.value);const exerciseIds=[...document.querySelectorAll('input[name="programExercise"]:checked')].map(x=>x.value);if(!name){alert('Donne un nom à ton programme.');return}if(!days.length){alert('Choisis au moins un jour.');return}if(!exerciseIds.length){alert('Choisis au moins un exercice.');return}const item={name,days,exerciseIds};if(editingProgram>=0)data.programs[editingProgram]=item;else data.programs.push(item);save();document.getElementById('programDialog').close();render();return}
 if(a==='delete-program'){if(confirm('Supprimer ce programme ?')){data.programs.splice(Number(b.dataset.index),1);save();render()}return}
 if(a==='move-up'||a==='move-down'){
  const i=Number(b.dataset.index),j=a==='move-up'?i-1:i+1;
  if(j>=0&&j<data.trackedExercises.length){[data.trackedExercises[i],data.trackedExercises[j]]=[data.trackedExercises[j],data.trackedExercises[i]];save();render();}
  return;
 }
 if(a==='choose-custom'){
  const search=document.getElementById('exerciseSearch'),list=document.getElementById('exerciseSuggestions'),sel=document.getElementById('addExerciseSelect');
  if(sel)sel.value='';if(list)list.innerHTML=`<button type="button" class="suggestion selected" disabled>✓ Exercice personnalisé : ${esc(search?.value.trim())}</button>`;
  return;
 }
 if(a==='choose-exercise'){
  const idx=Number(b.dataset.index),sel=document.getElementById('addExerciseSelect'),search=document.getElementById('exerciseSearch');
  if(sel)sel.value=String(idx);if(search)search.value=library[idx].name;
  const list=document.getElementById('exerciseSuggestions');if(list)list.innerHTML=`<button type="button" class="suggestion selected" disabled>✓ ${esc(library[idx].name)} <small>${esc(library[idx].category)}</small></button>`;
  return;
 }
 if(a==='open-add'){const dlg=document.getElementById('addExerciseDialog');const search=document.getElementById('exerciseSearch');const sel=document.getElementById('addExerciseSelect');const list=document.getElementById('exerciseSuggestions');if(search)search.value='';if(sel)sel.value='';if(list)list.innerHTML='<span class="suggestion-hint">Commence à taper pour voir les suggestions.</span>';dlg?.showModal();return}
 if(a==='close-add'){document.getElementById('addExerciseDialog')?.close();return}
 if(a==='add'){
  const select=document.getElementById('addExerciseSelect'),n=Number(select?.value);
  const searchInput=document.getElementById('exerciseSearch');
  const typedName=searchInput?.value.trim()||'';
  const ex=select&&select.value!==''?library[n]:(typedName?{name:typedName,category:'Personnalisé'}:null);
  if(!ex){alert('Choisis ou saisis le nom d’un exercice.');return}
  const initialInput=document.getElementById('newInitial'),currentInput=document.getElementById('newCurrent');
  const initial=Number(initialInput?.value),current=Number(currentInput?.value);
  if(!Number.isFinite(initial)||!Number.isFinite(current)||initialInput.value===''||currentInput.value===''||initial<0||current<0){alert('Renseigne les deux poids (initial et actuel).');return}
  if(data.trackedExercises.some(x=>x.name.trim().toLocaleLowerCase('fr')===ex.name.trim().toLocaleLowerCase('fr'))){alert('Cet exercice est déjà dans ta liste.');return}
  const newId='track-'+Date.now();data.trackedExercises.push({id:newId,exerciseId:ex.id,name:ex.name,category:ex.category,initial,current});
  save();document.getElementById('addExerciseDialog')?.close();render();return;
 }
 if(a==='step'){const x=data.trackedExercises[Number(b.dataset.index)];if(!x)return;x.current=Math.max(0,Math.round((Number(x.current)+Number(b.dataset.delta))*10)/10);save();render();return}
 if(a==='remove'){if(confirm('Retirer cet exercice de ta page ?')){data.trackedExercises.splice(Number(b.dataset.index),1);save();render()}return}
});
document.addEventListener('input',e=>{
 if(e.target.id!=='exerciseSearch')return;
 const q=e.target.value.trim().toLocaleLowerCase('fr');
 const list=document.getElementById('exerciseSuggestions');
 const select=document.getElementById('addExerciseSelect');
 if(!list||!select)return;
 select.value='';
 if(!q){list.innerHTML='<span class="suggestion-hint">Commence à taper pour voir les suggestions.</span>';return}
 const matches=library.map((x,i)=>({...x,index:i})).filter(x=>x.name.toLocaleLowerCase('fr').includes(q)||x.category.toLocaleLowerCase('fr').includes(q)).slice(0,12);
 list.innerHTML=matches.length?matches.map(x=>`<button type="button" class="suggestion" data-action="choose-exercise" data-index="${x.index}"><span>${esc(x.name)}</span><small>${esc(x.category)}</small></button>`).join(''):`<button type="button" class="suggestion custom-suggestion" data-action="choose-custom"><span>＋ Ajouter « ${esc(e.target.value.trim())} »</span><small>Exercice personnalisé</small></button>`;
});
app.addEventListener('change',e=>{
 if(e.target.matches('[data-field="initial"]')){const i=Number(e.target.dataset.index),v=Number(e.target.value);if(Number.isFinite(v)&&v>=0){data.trackedExercises[i].initial=v;save();render()}}
});
document.getElementById('settingsBtn')?.addEventListener('click',()=>document.getElementById('settingsDialog').showModal());
document.getElementById('closeSettings')?.addEventListener('click',()=>document.getElementById('settingsDialog').close());
document.getElementById('exportBtn')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='gymtracker-sauvegarde.json';a.click();URL.revokeObjectURL(url)});
document.getElementById('importFile')?.addEventListener('change',async e=>{try{const v=JSON.parse(await e.target.files[0].text());if(!Array.isArray(v.trackedExercises)&&!Array.isArray(v.workouts))throw Error();data=v;data.trackedExercises=data.trackedExercises||[];
data.progressHistory=Array.isArray(data.progressHistory)?data.progressHistory:[];data.workouts=data.workouts||[];
data.programs=Array.isArray(data.programs)?data.programs:[];save();render();alert('Sauvegarde importée.')}catch{alert('Fichier invalide.')}});
document.getElementById('clearBtn')?.addEventListener('click',()=>{if(confirm('Effacer toutes les données ?')){data={workouts:[],trackedExercises:[]};save();render();document.getElementById('settingsDialog').close()}});
render();
})();