(function (root) {
  'use strict';
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
  function pairRound(works, progress = {}, size = 4, random = Math.random) {
    const sorted = shuffle(works, random).sort((a,b) => priority(a,progress) - priority(b,progress));
    const seen = new Set();
    return sorted.filter(w => { if (seen.has(w.author)) return false; seen.add(w.author); return true; }).slice(0,size);
  }
  function shelfRound(works, allWorks, progress = {}, previous = null, random = Math.random) {
    const groups = [...new Set(works.map(w=>w.author))].filter(a=>allWorks.some(w=>w.author!==a));
    if (!groups.length) return null;
    const choices = groups.filter(a=>a!==previous);
    const author = shuffle(choices.length ? choices : groups,random).sort((a,b)=>Math.min(...works.filter(w=>w.author===a).map(w=>priority(w,progress)))-Math.min(...works.filter(w=>w.author===b).map(w=>priority(w,progress))))[0];
    const targets = shuffle(works.filter(w=>w.author===author),random).slice(0,3);
    const distractors = shuffle(allWorks.filter(w=>w.author!==author),random).slice(0,Math.max(2,5-targets.length));
    return { author, targets, options: shuffle([...targets,...distractors],random) };
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
  function mastered(p) { return !!p && p.author>=2 && p.meaning>=2 && p.directions?.includes('pairs') && p.directions?.includes('shelf') && !p.review; }
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
        if (p && typeof p==='object') progress[id]={...emptyProgress(),author:Math.max(0,Number(p.author)||0),meaning:Math.max(0,Number(p.meaning)||0),assisted:Math.max(0,Number(p.assisted)||0),review:!!p.review,directions:Array.isArray(p.directions)?p.directions.filter(d=>['pairs','shelf'].includes(d)):[],last:typeof p.last==='string'?p.last:null};
      }
      return { version:1, progress, wardrobe:wardrobe(s.wardrobe), grade:[0,1,2,3,4].includes(s.grade)?s.grade:0, mode:s.mode==='shelf'?'shelf':'pairs', memory:!!s.memory, sound:!!s.sound, custom:Array.isArray(s.custom)?s.custom.filter(id=>typeof id==='string'):null };
    } catch { return null; }
  }
  const api={shuffle,pool,pairRound,shelfRound,matchesShelf,record,mastered,readState,gifts,wardrobe,giftTokens,rewardAnswer,claimGift,equipGift};
  if (typeof module!=='undefined' && module.exports) module.exports=api;
  else root.VincentEngine=api;
})(globalThis);
