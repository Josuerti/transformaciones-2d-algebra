const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const elements = new Map();
const noop = ()=>{};
const context2d = new Proxy({}, {get:()=>noop, set:()=>true});
function element(id){
 if(!elements.has(id)) elements.set(id,{value:'0',checked:false,width:700,height:700,textContent:'',innerHTML:'',style:{},addEventListener:noop,getContext:()=>context2d});
 return elements.get(id);
}
let pending;
const ctx = vm.createContext({console, alert:noop, document:{getElementById:element,querySelectorAll:()=>[]},window:{addEventListener:noop},setInterval:fn=>(pending=fn,1),clearInterval:()=>{pending=null;}});
vm.runInContext(fs.readFileSync(__dirname+'/script.js','utf8'),ctx);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
element('checkRotacion').checked=true; element('inputRotacion').value='90';
element('checkEscala').checked=true; element('inputEscalaX').value='2';element('inputEscalaY').value='1';
element('checkTraslacion').checked=true; element('inputTraslacionX').value='40';element('inputTraslacionY').value='80';
const m=ctx.obtenerMatrizCompuesta().matriz;
const p=ctx.aplicarMatriz(m,[1,0,1]); near(p[0],1);near(p[1],3);
assert.equal(ctx.esIsometria(ctx.matrizShearX(1)),false);
assert.equal(ctx.esIsometria(ctx.matrizEscalamiento(2,0.5)),false);
assert.equal(ctx.esIsometria(ctx.matrizReflexionX()),true);
assert.equal(ctx.esIsometria(ctx.matrizRotacion(37)),true);
ctx.mostrarMatriz(ctx.matrizEscalamiento(0,1),['Colapso']);assert.equal(element('propOrient').textContent,'Colapsada');
ctx.inicializar();ctx.animar();assert.ok(pending);ctx.resetear();assert.equal(pending,null);assert.equal(element('btnAnimacion').disabled,false);
console.log('Composición, isometrías, orientación y cancelación de animación: OK');
