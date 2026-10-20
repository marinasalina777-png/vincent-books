(function (root) {
  'use strict';
  const Rewards=typeof module!=='undefined'&&module.exports?require('./rewards.js'):root.VincentRewards;
  function shuffle(items, random = Math.random) {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function pool(data, grade, custom) {
    return data.works.filter(w => (!grade || w.grades.includes(Number(grade))) && (!custom || custom.includes(w.id)));
  }
  function priority(work, progress) {
    const p = progress[work.id];
    return !p ? 1 : p.review ? 0 : mastered(p) ? 3 : 2;
  }
  function times(counts,id){const value=Number(counts?.[id]);return Number.isFinite(value)?Math.max(0,value):0;}
  function rotation(raw={}){
    const cleanCounts=counts=>Object.fromEntries(Object.entries(counts&&typeof counts==='object'?counts:{}).filter(([id,n])=>/^[a-z0-9-]+$/i.test(id)&&Number.isFinite(Number(n))&&Number(n)>=0).slice(0,1000).map(([id,n])=>[id,Math.min(1000000,Math.floor(Number(n)))]));
    return Object.fromEntries(['pairs','shelf','recall'].map(mode=>{const h=raw?.[mode]||{};return [mode,{works:cleanCounts(h.works),authors:cleanCounts(h.authors),lastAuthors:Array.isArray(h.lastAuthors)?h.lastAuthors.filter(a=>typeof a==='string').slice(0,160):[]}];}));
  }
  function orderedAuthors(works,progress,history,random,previous=null){
    const authors=[...new Set(works.map(w=>w.author))],last=previous?[previous]:(history.lastAuthors||[]);
    const priorityByAuthor=new Map(authors.map(a=>[a,Math.min(...works.filter(w=>w.author===a).map(w=>priority(w,progress)))]));
    // Exposure comes first so a review card can never monopolize every round.
    return shuffle(authors,random).sort((a,b)=>times(history.authors,a)-times(history.authors,b)||Number(last.includes(a))-Number(last.includes(b))||priorityByAuthor.get(a)-priorityByAuthor.get(b));
  }
  function orderedWorks(works,progress,history,random){return shuffle(works,random).sort((a,b)=>times(history.works,a.id)-times(history.works,b.id)||priority(a,progress)-priority(b,progress));}
  function pairRound(works, progress = {}, size = 4, random = Math.random, history = {}) {
    return orderedAuthors(works,progress,history,random).slice(0,size).map(author=>orderedWorks(works.filter(w=>w.author===author),progress,history,random)[0]);
  }
  function shelfRound(works, allWorks, progress = {}, previous = null, random = Math.random, history = {}) {
    const eligible=works.filter(w=>allWorks.some(other=>other.author!==w.author));
    const author=orderedAuthors(eligible,progress,history,random,previous)[0];
    if(!author)return null;
    const targets=orderedWorks(works.filter(w=>w.author===author),progress,history,random).slice(0,3);
    const distractors=shuffle(allWorks.filter(w=>w.author!==author),random).slice(0,Math.max(2,5-targets.length));
    return {author,targets,options:shuffle([...targets,...distractors],random)};
  }
  function recallRound(works, previous = null, random = Math.random, history = {}) {
    const author=orderedAuthors(works,{},history,random,previous)[0];
    return author ? {author,targets:works.filter(w=>w.author===author)} : null;
  }
  function recordRound(raw,mode,works){
    const next=rotation(raw);if(!next[mode])return next;
    const h=next[mode],ids=[...new Set(works.map(w=>w.id))],authors=[...new Set(works.map(w=>w.author))];
    for(const id of ids)h.works[id]=times(h.works,id)+1;
    for(const author of authors)h.authors[author]=times(h.authors,author)+1;
    h.lastAuthors=authors;return next;
  }
  function normalizeTitle(text) {
    return String(text).toLocaleLowerCase('ru').replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/g,' ').trim().replace(/\s+/g,' ');
  }
  const commonAliases = {
    saltan:['Сказка о царе Салтане, о сыне его славном и могучем богатыре князе Гвидоне Салтановиче и о прекрасной царевне Лебеди','Царь Салтан'],
    rybak:['О рыбаке и рыбке'], north:['Вот север тучи нагоняя'],
    'lunin-chudo':['Я видела чудо'],
    'tyoma-zhuchka':['Детство Тёмы','Тёма и Жучка'],
    'dead-princess':['Сказка о мёртвой царевне','Мёртвая царевна и семь богатырей'],
    'tom-sawyer':['Приключения Тома Сойера']
  };
  function titleVariants(w) {
    return [...new Set([w.title,w.title.replace(/\s*\([^)]*\)/g,''),...(commonAliases[w.id]||[]),...(w.answerAliases||[])].map(normalizeTitle).filter(Boolean))];
  }
  function editDistance(a,b) {
    let row=Array.from({length:b.length+1},(_,i)=>i);
    for(let i=1;i<=a.length;i++){const next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1));row=next;}
    return row[b.length];
  }
  function matchTitle(input, works) {
    const title=normalizeTitle(input);if(!title||title.length>300)return null;
    const exact=works.filter(w=>titleVariants(w).includes(title));
    if(exact.length===1)return {work:exact[0],typo:false};
    if(exact.length>1)return {ambiguous:true};
    if(title.length<5)return null;
    const matches=works.map(work=>({work,distance:Math.min(...titleVariants(work).map(v=>Math.abs(v.length-title.length)>2?Infinity:editDistance(title,v)))})).filter(m=>m.distance<=(title.length>=10?2:1)&&m.distance/title.length<=.2).sort((a,b)=>a.distance-b.distance);
    if(!matches.length)return null;
    if(matches[1]?.distance===matches[0].distance)return {ambiguous:true};
    return {work:matches[0].work,typo:true};
  }
  function matchesShelf(selected, targets) {
    return selected.length === targets.length && new Set(selected).size === targets.length && targets.every(w=>selected.includes(w.id));
  }
  function emptyProgress() { return { author:0, meaning:0, directions:[], assisted:0, review:false, last:null }; }
  function record(progress, id, mode, authorIndependent, meaningIndependent, date = new Date().toISOString()) {
    const p = { ...emptyProgress(), ...progress[id] };
    p.directions = [...new Set([...(p.directions||[]), mode])];
    p.author += authorIndependent ? 1 : 0;
    p.meaning += meaningIndependent ? 1 : 0;
    p.assisted += (!authorIndependent || !meaningIndependent) ? 1 : 0;
    p.review = !authorIndependent || !meaningIndependent;
    p.last = date;
    return { ...progress, [id]:p };
  }
  function mastered(p) { return !!p && p.author>=2 && p.meaning>=2 && p.directions?.includes('pairs') && (p.directions?.includes('shelf')||p.directions?.includes('recall')) && !p.review; }
  const gifts=[
    {id:'classic',name:'Любимый берет',kind:'look',asset:'./assets/vincent.png',description:'Винсент, каким мы познакомились. Этот образ уже твой.'},
    {id:'scarf',name:'Уютный шарф',kind:'look',asset:'./assets/vincent-scarf.png',description:'Красный шарф для зимних стихов и тёплых историй.'},
    {id:'professor',name:'Книжный профессор',kind:'look',asset:'./assets/vincent-professor.png',description:'Круглые очки и зелёная бабочка для любознательного читателя.'},
    {id:'ball',name:'Весёлый мячик',kind:'toy',asset:'./assets/ball.svg',description:'После хорошей истории можно немного поиграть!'},
    {id:'bone',name:'Косточка',kind:'toy',asset:'./assets/bone.svg',description:'Маленькая игрушечная косточка для большого друга.'}
  ];
  function wardrobe(raw={}) {
    const owned=[...new Set(['classic',...(Array.isArray(raw?.owned)?raw.owned:[]).filter(id=>gifts.some(g=>g.id===id))])];
    const valid=Number(raw?.correct);
    return {correct:Number.isFinite(valid)?Math.max(0,Math.floor(valid)):0,owned,look:owned.includes(raw?.look)&&gifts.some(g=>g.id===raw.look&&g.kind==='look')?raw.look:'classic',toy:owned.includes(raw?.toy)&&gifts.some(g=>g.id===raw.toy&&g.kind==='toy')?raw.toy:null};
  }
  function giftTokens(raw){const w=wardrobe(raw);return Math.max(0,Math.floor(w.correct/10)-(w.owned.length-1));}
  function rewardAnswer(raw){const w=wardrobe(raw);return {...w,correct:w.correct+1};}
  function claimGift(raw,id){const w=wardrobe(raw),g=gifts.find(g=>g.id===id);if(!g||w.owned.includes(id)||giftTokens(w)<1)return w;return {...w,owned:[...w.owned,id],[g.kind==='look'?'look':'toy']:id};}
  function equipGift(raw,id){const w=wardrobe(raw);if(id==='no-toy')return {...w,toy:null};const g=gifts.find(g=>g.id===id);return g&&w.owned.includes(id)?{...w,[g.kind==='look'?'look':'toy']:id}:w;}
  function readState(storage) {
    try {
      const s=JSON.parse(storage.getItem('vincent-books-v1'));
      if (!s || s.version!==1) return null;
      const progress = {};
      for (const [id,p] of Object.entries(s.progress||{})) {
        if (p && typeof p==='object') progress[id]={...emptyProgress(),author:Math.max(0,Number(p.author)||0),meaning:Math.max(0,Number(p.meaning)||0),assisted:Math.max(0,Number(p.assisted)||0),review:!!p.review,directions:Array.isArray(p.directions)?p.directions.filter(d=>['pairs','shelf','recall'].includes(d)):[],last:typeof p.last==='string'?p.last:null};
      }
      return { version:1, progress, shop:s.shop?.version===1?Rewards.state(s.shop):null, quest:!!s.quest, rotation:rotation(s.rotation), wardrobe:wardrobe(s.wardrobe), grade:[0,1,2,3,4].includes(s.grade)?s.grade:0, mode:['pairs','shelf','recall'].includes(s.mode)?s.mode:'pairs', memory:!!s.memory, sound:!!s.sound, custom:Array.isArray(s.custom)?s.custom.filter(id=>typeof id==='string'):null };
    } catch { return null; }
  }
  const api={shuffle,pool,rotation,recordRound,recallRound,normalizeTitle,matchTitle,pairRound,shelfRound,matchesShelf,record,mastered,readState,gifts,wardrobe,giftTokens,rewardAnswer,claimGift,equipGift};
  if (typeof module!=='undefined' && module.exports) module.exports=api;
  else root.VincentEngine=api;
})(globalThis);
