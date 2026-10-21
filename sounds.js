/* Тихие звуки игры: файлы из assets/sounds (Pixabay), Web Audio и запасной синтез. */
(function(root){
  'use strict';
  const volume={correct:.8,wrong:.6,coin:.75,'round-complete':.75,'grand-finale':.75,purchase:.75,page:.55,tap:.5};
  const fallback={correct:[523,659,784],wrong:[392,349,330]};
  const data={},buffers={},last={};
  let ctx=null,master=null,fetching=null,decoding=null;
  function preload(){if(fetching||typeof fetch!=='function')return fetching;fetching=Promise.all(Object.keys(volume).map(name=>fetch('./assets/sounds/'+name+'.mp3?v=1').then(r=>r.ok?r.arrayBuffer():null).then(b=>{if(b)data[name]=b;}).catch(()=>{})));return fetching;}
  function context(){if(ctx)return ctx;const A=root.AudioContext||root.webkitAudioContext;if(!A)return null;ctx=new A();master=ctx.createGain();master.gain.value=.7;master.connect(ctx.destination);return ctx;}
  function decode(){if(decoding)return decoding;const c=context();if(!c)return Promise.resolve();decoding=(preload()||Promise.resolve()).then(()=>Promise.all(Object.keys(data).map(name=>new Promise(done=>c.decodeAudioData(data[name].slice(0),b=>{buffers[name]=b;done();},()=>done())))));return decoding;}
  function start(name){const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=buffers[name];g.gain.value=volume[name];s.connect(g);g.connect(master);s.start();}
  function chime(name){const notes=fallback[name];if(!notes)return;const t=ctx.currentTime;notes.forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t+i*.09);g.gain.linearRampToValueAtTime(.035,t+i*.09+.02);g.gain.exponentialRampToValueAtTime(.001,t+i*.09+.23);o.connect(g);g.connect(master);o.start(t+i*.09);o.stop(t+i*.09+.25);});}
  function play(name){if(!(name in volume))return;try{const c=context();if(!c)return;if(c.state==='suspended')c.resume().catch(()=>{});const asked=performance.now();if(asked-(last[name]||-1e4)<120)return;last[name]=asked;if(buffers[name]){start(name);return;}decode().then(()=>{if(performance.now()-asked>400)return;if(buffers[name])start(name);else chime(name);});}catch{}}
  root.VincentSounds={preload,play};
})(globalThis);
