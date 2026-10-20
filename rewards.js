/* Последовательная коллекция: 160 книг × два направления = 320 монет. */
(function(root){
  'use strict';
  const specs=[
    ['butter','Баттер-антистресс',3,'toy','Мягкий кубик масла. Нажми — он расплющится и снова станет кругленьким.','squish'],
    ['dumpling','Пельмешка-антистресс',4,'toy','Пухлая пельмешка на тарелочке: сжимается и смешно подпрыгивает.','dumpling'],
    ['capybara-charm','Брелок-капибара',5,'charm','Спокойный приятель для рюкзака Винсента. Нажми — он покачается.','swing'],
    ['heart-glasses','Очки-сердечки',6,'face','Немного любви к книгам и очень стильный взгляд.','sparkle'],
    ['clogs','Кроксы с джиббитсами',7,'feet','Удобные башмачки с маленькими косточками.','tap'],
    ['mochi-cat','Котик-моти',8,'toy','Круглый мягкий котик рядом с Винсентом. Потрогай его!','squish'],
    ['fluffy-backpack','Пушистый мини-рюкзак',9,'backpack','Здесь поместятся любимые книжки и новый брелок.','swing'],
    ['labubu-charm','Брелок Лабубу',10,'charm','Улыбчивый зубастый пушистик для книжного путешествия.','swing'],
    ['sticker-skateboard','Скейт с наклейками',11,'ride','Винсент готов показать небольшой трюк. Нажми на скейт.','skate'],
    ['hoodie','Худи оверсайз',12,'look','Уютное худи с лапкой — новый образ для книжного друга.','happy'],
    ['axolotl','Игрушечный аксолотль',12,'toy','Розовый приятель с пушистыми жабрами. Любит маленькие прыжки.','hop'],
    ['capybara-suit','Кигуруми капибары',13,'look','Винсент наряжается самым спокойным зверьком на свете.','happy'],
    ['glowing-sneakers','Светящиеся кроссовки',14,'feet','Каждый шаг Винсента оставляет маленькую искорку.','sparkle'],
    ['headphones','Беспроводные наушники',14,'head','Большие удобные наушники для самого модного читателя.','happy'],
    ['handheld-console','Портативная приставка',15,'toy','Игрушечная приставка: нажми, чтобы зажечь маленькие звёзды.','pixel'],
    ['pixel-kit','Пиксельный меч и щит',16,'toy','Книжный рыцарь готов к новым приключениям.','pixel'],
    ['holo-raincoat','Голографический дождевик',16,'look','Переливающийся дождевик для прогулок по страницам.','shimmer'],
    ['space-helmet','Космический шлем',17,'head','Винсент отправляется исследовать вселенную историй.','sparkle'],
    ['neon-scooter','Неоновый самокат',18,'ride','Нажми: Винсент прокатится и вернётся к своим книжкам.','skate'],
    ['dragon-suit','Костюм дракона',18,'look','Маленькие крылья и большой запас смелости.','dragon'],
    ['galaxy-squishy','Антистресс «Галактика»',19,'toy','Сожми шар: звёзды внутри переливаются и танцуют.','galaxy'],
    ['hoverboard','Летающий скейт',20,'ride','Парит над землёй. Нажми и взлетай вместе с Винсентом!','hover'],
    ['iphone','iPhone 18 Pro Max',23,'toy','Телефон Винсента. Нажми, чтобы сделать и сохранить его селфи.','selfie'],
    ['storykeeper','Хранитель историй',30,'look','Корона, волшебный плащ и сияющая библиотека за все 160 книг в двух направлениях.','keeper']
  ];
  const outfitAssets={hoodie:'vincent-hoodie.png','capybara-suit':'vincent-capybara.png','dragon-suit':'vincent-dragon.png',storykeeper:'vincent-keeper.png'};
  const asset=path=>root.VincentAssetMap?.[path]||path;
  let total=0;
  const catalogue=specs.map(([id,name,cost,slot,description,animation],i)=>({id,name,cost,slot,description,animation,index:i,after:total+=cost,asset:asset('./assets/rewards/'+id+'.svg'),lookAsset:outfitAssets[id]?asset('./assets/rewards/'+outfitAssets[id]):null,colors:['butter','dumpling','mochi-cat','fluffy-backpack','heart-glasses','clogs','glowing-sneakers','galaxy-squishy','iphone'].includes(id)?['original','mint','lavender']:['original']}));
  const legacy=[
    {id:'classic',name:'Любимый берет',slot:'look',asset:'./assets/vincent.png'},
    {id:'scarf',name:'Уютный шарф',slot:'look',asset:'./assets/vincent-scarf.png'},
    {id:'professor',name:'Книжный профессор',slot:'look',asset:'./assets/vincent-professor.png'},
    {id:'ball',name:'Весёлый мячик',slot:'toy',asset:'./assets/ball.svg'},
    {id:'bone',name:'Косточка',slot:'toy',asset:'./assets/bone.svg'}
  ];
  const coins=n=>n+' '+(n%100>=11&&n%100<=14?'монеток':n%10===1?'монетка':n%10>=2&&n%10<=4?'монетки':'монеток');
  const slots=['look','toy','face','feet','head','backpack','charm','ride'];
  const find=id=>catalogue.find(g=>g.id===id)||legacy.find(g=>g.id===id);
  const direction=mode=>mode==='pairs'?'forward':['shelf','recall'].includes(mode)?'reverse':null;
  function validCredits(raw={},ids=null){const allowed=ids?new Set(ids):null,out={};for(const[id,p]of Object.entries(raw&&typeof raw==='object'?raw:{}).slice(0,1000)){if(!/^[a-z0-9-]+$/i.test(id)||(allowed&&!allowed.has(id))||!p||typeof p!=='object')continue;const value={forward:p.forward===true,reverse:p.reverse===true};if(value.forward||value.reverse)out[id]=value;}return out;}
  const earned=shop=>Object.values(shop.credits).reduce((n,c)=>n+Number(c.forward)+Number(c.reverse),0);
  const spent=shop=>catalogue.slice(0,shop.bought.length).reduce((n,g)=>n+g.cost,0);
  function state(raw={},ids=null){
    raw=raw&&typeof raw==='object'?raw:{};
    const credits=validCredits(raw.credits,ids),bought=[];
    const available=Object.values(credits).reduce((n,c)=>n+Number(c.forward)+Number(c.reverse),0);let cost=0;
    for(let i=0;i<catalogue.length;i++){const g=catalogue[i];if(raw.bought?.[i]!==g.id||cost+g.cost>available)break;bought.push(g.id);cost+=g.cost;}
    const legacyOwned=[...new Set(['classic',...(Array.isArray(raw.legacyOwned)?raw.legacyOwned:[]).filter(id=>legacy.some(g=>g.id===id))])];
    const owned=new Set([...bought,...legacyOwned]),equipped={};
    for(const slot of slots){const id=raw.equipped?.[slot];equipped[slot]=owned.has(id)&&find(id)?.slot===slot?id:slot==='look'?'classic':null;}
    const colors={};for(const g of catalogue)if(owned.has(g.id)&&g.colors.includes(raw.colors?.[g.id]))colors[g.id]=raw.colors[g.id];
    return {version:1,credits,bought,legacyOwned,equipped,colors,updatedAt:Number.isFinite(raw.updatedAt)?Math.max(0,raw.updatedAt):0,migrated:!!raw.migrated};
  }
  function balance(raw){const s=state(raw);return earned(s)-spent(s);}
  function migrate(raw,progress={},old={},ids=null){
    if(raw?.version===1)return {shop:state(raw,ids),created:false,credited:0};
    const credits={};
    for(const[id,p]of Object.entries(progress||{})){if(!p||p.review||!(p.author>0&&p.meaning>0))continue;const dirs=Array.isArray(p.directions)?p.directions:[],f=dirs.includes('pairs'),r=dirs.some(d=>['shelf','recall'].includes(d));let forward=f,reverse=r;if(f&&r&&Math.min(p.author,p.meaning)<2)reverse=false;if(forward||reverse)credits[id]={forward,reverse};}
    const legacyOwned=[...new Set(['classic',...(Array.isArray(old.owned)?old.owned:[])])];
    // Honour already earned, unused old gift choices as complimentary legacy items.
    const oldGiftCount=Math.min(4,Math.floor(Math.max(0,Number(old.correct)||0)/10));for(const g of legacy.slice(1)){if(legacyOwned.length-1>=oldGiftCount)break;if(!legacyOwned.includes(g.id))legacyOwned.push(g.id);}
    const shop=state({version:1,credits,bought:[],legacyOwned,equipped:{look:old.look,toy:old.toy},migrated:true},ids);
    return {shop,created:true,credited:earned(shop)};
  }
  function hasCredit(raw,id,mode){const d=direction(mode);return !!d&&raw.credits?.[id]?.[d]===true;}
  function award(raw,id,mode,authorIndependent,meaningIndependent,ids=null){const s=state(raw,ids),d=direction(mode);if(!d||!authorIndependent||!meaningIndependent||hasCredit(s,id,mode)||(ids&&!ids.includes(id))||!/^[a-z0-9-]+$/i.test(id))return {shop:s,added:0};s.credits[id]={forward:false,reverse:false,...s.credits[id],[d]:true};s.updatedAt=Date.now();return {shop:s,added:1};}
  function next(raw){const s=state(raw);return catalogue[s.bought.length]||null;}
  function buy(raw,id,ids=null){const s=state(raw,ids),g=next(s);if(s.bought.includes(id))return {shop:s,ok:false,reason:'owned'};if(!g||g.id!==id)return {shop:s,ok:false,reason:'order'};if(balance(s)<g.cost)return {shop:s,ok:false,reason:'funds'};if(g.id==='storykeeper'&&ids&&!ids.every(id=>s.credits[id]?.forward&&s.credits[id]?.reverse))return {shop:s,ok:false,reason:'coverage'};s.bought.push(id);s.equipped[g.slot]=id;if(['capybara-suit','storykeeper'].includes(id))s.equipped.head=null;s.updatedAt=Date.now();return {shop:s,ok:true};}
  function equip(raw,id){const s=state(raw),g=find(id);if(!g||!s.bought.includes(id)&&!s.legacyOwned.includes(id))return s;s.equipped[g.slot]=id;if(['capybara-suit','storykeeper'].includes(id))s.equipped.head=null;s.updatedAt=Date.now();return s;}
  function unequip(raw,slot){const s=state(raw);if(slots.includes(slot)){s.equipped[slot]=slot==='look'?'classic':null;s.updatedAt=Date.now();}return s;}
  function color(raw,id,value){const s=state(raw),g=find(id);if(s.bought.includes(id)&&g?.colors?.includes(value)){s.colors[id]=value;s.updatedAt=Date.now();}return s;}
  function merge(left,right,ids=null){const a=state(left,ids),b=state(right,ids),credits={...a.credits};for(const[id,p]of Object.entries(b.credits))credits[id]={forward:!!credits[id]?.forward||p.forward,reverse:!!credits[id]?.reverse||p.reverse};const recent=a.updatedAt>=b.updatedAt?a:b;return state({...recent,credits,bought:a.bought.length>=b.bought.length?a.bought:b.bought,legacyOwned:[...new Set([...a.legacyOwned,...b.legacyOwned])]},ids);}
  function pending(works,raw,mode){return works.filter(w=>!hasCredit(raw,w.id,mode));}
  const api={catalogue,legacy,slots,coins,find,direction,state,migrate,earned,spent,balance,award,hasCredit,next,buy,equip,unequip,color,merge,pending};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VincentRewards=api;
})(globalThis);
