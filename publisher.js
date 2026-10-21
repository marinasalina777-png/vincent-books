/* Публикация карточек в один известный репозиторий. Ключ живёт только в запросе. */
(function(root){
  'use strict';
  const C=typeof module!=='undefined'&&module.exports?require('./content.js'):root.VincentContent;
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function bytes64(bytes){let value='';for(let i=0;i<bytes.length;i+=8192)value+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(value);}
  const text64=text=>bytes64(new TextEncoder().encode(text));
  function decode64(text){return new TextDecoder().decode(Uint8Array.from(atob(text.replace(/\s/g,'')),c=>c.charCodeAt(0)));}
  class PublishError extends Error{constructor(status){super(status===401?'Ключ не принят GitHub. Проверьте его или создайте новый.':status===403?'У ключа нет права записи в vincent-books, истёк срок действия или GitHub временно ограничил запросы. Проверьте Contents → Read and write.':status===404?'Репозиторий недоступен этому ключу. Выберите для ключа репозиторий vincent-books.':[409,422].includes(status)?'Библиотека уже изменилась. Скачайте копию черновиков, обновите редактор и повторите публикацию.':'GitHub пока не принял правки. Черновики сохранены. Попробуйте позже.');}}
  function apiClient(key){return async(path,options={})=>{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);try{const r=await fetch('https://api.github.com/repos/'+C.CONFIG.owner+'/'+C.CONFIG.repo+'/'+path,{...options,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2026-03-10',Authorization:'Bearer '+key,...(options.body?{'Content-Type':'application/json'}:{}),...options.headers},signal:controller.signal,credentials:'omit',redirect:'error'});if(!r.ok){if(options.allowMissing&&r.status===404)return null;throw new PublishError(r.status);}return options.raw?await r.text():await r.json();}finally{clearTimeout(timer);}};}
  async function remoteFile(api,path){return api('contents/'+path+'?ref='+encodeURIComponent(C.CONFIG.branch),{allowMissing:true});}
  async function readRemote(api,D){const file=await remoteFile(api,C.CONFIG.path);if(!file)return {content:C.empty(),sha:null};const text=file.encoding==='base64'&&file.content?decode64(file.content):await api('contents/'+C.CONFIG.path+'?ref='+encodeURIComponent(C.CONFIG.branch),{headers:{Accept:'application/vnd.github.raw+json'},raw:true});return {content:C.sanitize(JSON.parse(text),D),sha:file.sha};}
  async function uploadCover(api,id,dataURL){const bytes=Uint8Array.from(atob(dataURL.split(',')[1]),c=>c.charCodeAt(0));const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,16);const path='assets/covers/'+id+'-'+hash+'.jpg';if(!await remoteFile(api,path))await api('contents/'+path,{method:'PUT',body:JSON.stringify({message:'Add cover for '+id,content:bytes64(bytes),branch:C.CONFIG.branch})});return './'+path;}
  async function publishContent(key,data,changes,onStatus=()=>{}){const D=data,draft=changes,original=id=>D.works.find(w=>w.id===id),api=apiClient(key),remote=await readRemote(api,D),next={...remote.content,works:{...remote.content.works}},entries=Object.entries(draft.entries).filter(([id])=>original(id));
    // Compare each changed card against its editing baseline before uploading anything.
    for(const[id,entry]of entries){const latest=C.editable({...original(id),...(remote.content.works[id]||{})});if(!same(latest,entry.base)&&!same(latest,entry.value))throw Error('Карточка «'+original(id).title+'» была изменена после начала редактирования. Скачайте копию, обновите страницу и сверьте эту карточку. Ваш черновик сохранён.');}
    for(let i=0;i<entries.length;i++){const[id,entry]=entries[i],value={...entry.value};onStatus('Подготавливаем карточки: '+(i+1)+' из '+entries.length+'…');if(value.cover.startsWith('data:'))value.cover=await uploadCover(api,id,value.cover);next.works[id]={...next.works[id],...value};}
    next.version=1;next.updatedAt=new Date().toISOString();const clean=C.sanitize(next,D);onStatus('Сохраняем общую библиотеку…');let result;
    try{result=await api('contents/'+C.CONFIG.path,{method:'PUT',body:JSON.stringify({message:'Update '+entries.length+' book cards from Vincent editor',content:text64(JSON.stringify(clean,null,2)+'\n'),branch:C.CONFIG.branch,...(remote.sha?{sha:remote.sha}:{})})});}
    catch(error){
      // A timed-out PUT may have committed. Read back before offering a retry.
      try{const check=await readRemote(api,D);if(same(check.content,clean))result={commit:{sha:'verified'}};else throw error;}catch{throw error;}
    }
    return {content:clean,commit:result.commit};
  }
  const api={publishContent};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VincentPublisher=api;
})(globalThis);
