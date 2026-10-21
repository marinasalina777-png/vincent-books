/* Общие правки каталога и изолированные черновики редактора. Без ключей доступа. */
(function(root){
  'use strict';
  const DRAFT_KEY='catalogue-draft', DB_NAME='vincent-editor-v1';
  const CONFIG={owner:'marinasalina777-png',repo:'vincent-books',branch:'main',path:'overrides.json'};
  function empty(){return {version:1,works:{}};}
  function safeURL(value,image=false){
    if(typeof value!=='string'||value.length>(image?500000:2000))return '';
    if(image&&/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value))return value;
    if(image&&/^\.\/assets\/covers\/[a-zA-Z0-9._-]+\.(?:jpg|jpeg|png|webp)$/.test(value))return value;
    try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}
  }
  function sanitize(raw,data,{draft=false}={}){
    if(!raw||raw.version!==1||!raw.works||typeof raw.works!=='object'||Array.isArray(raw.works))throw Error('Не удалось прочитать файл карточек. Нужен экспорт из редактора.');
    const result=empty();if(typeof raw.updatedAt==='string')result.updatedAt=raw.updatedAt;
    for(const w of data.works){const p=Object.prototype.hasOwnProperty.call(raw.works,w.id)?raw.works[w.id]:null;if(!p||typeof p!=='object')continue;const out={};
      if(typeof p.summary==='string'&&p.summary.trim()&&p.summary.length<=4000)out.summary=p.summary.trim();
      if(p.cover==='')out.cover='';else if(p.cover){const url=safeURL(p.cover,true);if(!url||(!draft&&url.startsWith('data:')))throw Error('Некорректная обложка: '+w.title);out.cover=url;}
      if(p.audioLink===null)out.audioLink=null;
      else if(p.audioLink?.url){const url=safeURL(p.audioLink.url);if(!url)throw Error('Нужна полная HTTPS-ссылка на аудиокнигу: '+w.title);out.audioLink={url,label:String(p.audioLink.label||'Слушать аудиокнигу').slice(0,100),credit:String(p.audioLink.credit||'').slice(0,300)};}
      if(Array.isArray(p.answerAliases))out.answerAliases=[...new Set(p.answerAliases.filter(a=>typeof a==='string').map(a=>a.trim()).filter(a=>a&&a.length<=300))].slice(0,20);
      if(Object.keys(out).length)result.works[w.id]=out;
    }
    return result;
  }
  function apply(data,overrides){return {...data,works:data.works.map(w=>({...w,...(overrides.works[w.id]||{})}))};}
  function editable(w){return {summary:w.summary,cover:w.cover||'',audioLink:w.audioLink?{url:w.audioLink.url,label:w.audioLink.label||'Слушать аудиокнигу',credit:w.audioLink.credit||''}:null,answerAliases:w.answerAliases||[]};}
  let dbPromise;
  function database(){return dbPromise||=(new Promise((resolve,reject)=>{const request=indexedDB.open(DB_NAME,1);request.onupgradeneeded=()=>request.result.createObjectStore('drafts');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(Error('Браузер запретил сохранение черновиков. Скачайте копию правок.'));}));}
  async function readDraft(){const db=await database();return new Promise((resolve,reject)=>{const req=db.transaction('drafts').objectStore('drafts').get(DRAFT_KEY);req.onsuccess=()=>resolve(req.result||{version:1,entries:{}});req.onerror=()=>reject(req.error);});}
  async function writeDraft(draft){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('drafts','readwrite');tx.objectStore('drafts').put(draft,DRAFT_KEY);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(Error('Не удалось сохранить черновик. Скачайте копию правок.'));});}
  function draftOverrides(published,draft){const out={...published,works:{...published.works}};for(const [id,entry] of Object.entries(draft.entries||{}))out.works[id]={...out.works[id],...entry.value};return out;}
  async function published(data){
    if(root.VincentPublishedContent)return sanitize(root.VincentPublishedContent,data);
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
    try{
      const response=await fetch('./overrides.json',{cache:'no-store',signal:controller.signal});
      if(!response.ok)throw Error('Не удалось загрузить правки каталога. Проверьте подключение и обновите страницу.');
      return sanitize(await response.json(),data);
    }finally{clearTimeout(timer);}
  }
  async function load(data){let shared,error=null;try{shared=await published(data);}catch(e){shared=empty();error=e.message;}
    const preview=new URLSearchParams(location.search).get('preview')==='1';let effective=shared;
    if(preview){try{effective=sanitize(draftOverrides(shared,await readDraft()),data,{draft:true});}catch(e){error=e.message;}}
    return {published:shared,effective,preview,error};
  }
  const api={CONFIG,empty,safeURL,sanitize,apply,editable,readDraft,writeDraft,draftOverrides,published,load};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VincentContent=api;
})(globalThis);
