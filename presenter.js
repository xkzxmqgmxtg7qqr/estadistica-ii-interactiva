(function(){
'use strict';
const stages=['Portada','Inicio · planteamiento','Razonamiento progresivo','Laboratorio gráfico','Simulación Monte Carlo','Interpretación empresarial','Cierre · evaluación'];
const notes=[
[
['Inicio','Solicitar una predicción: ¿que un promedio muestral supere el histórico demuestra un aumento real?','No. Se necesita un modelo del error muestral y una regla de decisión.'],
['Hipótesis y parámetros','Distinguir variables cuantitativas y proporciones. Preguntar cuál es el parámetro poblacional.','Media: H₀: μ=100; H₁: μ>100 (en miles de $). Proporción: H₀: p=0,5; H₁: p>0,5.'],
['Curva y valor p','Modificar el promedio o n. Interpretar el área sombreada: calculada suponiendo H₀.','Con n=64, x̄=104 y s=16: z=2; p≈0,0228. No mide la probabilidad de H₀ ni prueba causalidad.'],
['Error de tipo I','Antes de simular pedir predicción al estudiantado. Contrastar tasa empírica y α.','Con α=0,05, la frecuencia de rechazo bajo H₀ se aproxima a 5% al crecer las réplicas.'],
['Decisión comercial','Pedir una recomendación que distinga inferencia y rentabilidad.','Evidencia compatible con gasto medio >100, pero hacen falta costos y un diseño apropiado para evaluar efecto causal.'],
['Comprobación','Usar respuestas individuales antes de revelar retroalimentación.','La interpretación válida del p es condicional en H₀ y en los supuestos de la prueba.']],
[
['Inicio','Comparar dos sucursales, verificando si las observaciones son independientes.','Los clientes de A y B no están emparejados.'],
['Modelo','Contrastar igualdad de medias con Welch, sin imponer igualdad de varianzas.','H₀: μA−μB=0; H₁: μA−μB≠0.'],
['Gráfico','Variar las desviaciones estándar y observar el estadístico y el intervalo.','Datos iniciales: diferencia=6 mil pesos, t≈2,14, gl≈85,1, p bilateral≈0,035.'],
['Simulación','Aclarar que las dos medias poblacionales simuladas son iguales.','En muestras independientes generadas bajo H₀, cerca de α de las pruebas rechaza cuando los supuestos se cumplen.'],
['Gerencia','Pedir que interpreten tanto significancia como magnitud práctica.','IC95% aproximado: [0,42;11,58] miles de pesos para μA−μB.'],
['Síntesis','Verificar selección de la prueba correcta y límites de interpretación.','Un valor p significativo no acredita que la sucursal sea la causa de mayor consumo.']],
[
['Inicio','Preguntar qué cambia si se mide a los mismos vendedores dos veces.','Se trata de pares; cada trabajador produce una diferencia.'],
['Diferencias','Enfatizar que la variable analizada es D=después−antes.','H₀: μD=0; H₁: μD>0. Normalidad relevante: distribución de las diferencias.'],
['Prueba pareada','Usar la gráfica y variar el cambio medio.','Con n=12, d̄=4, sD=5: t≈2,77, gl=11, p≈0,009.'],
['Simulación','Generar diferencias con media 0 y comparar tasas de rechazo.','La simulación preserva el diseño pareado: genera una sola muestra de diferencias bajo H₀.'],
['Causalidad y dispersión','Distinguir cambio temporal y efecto causal; mencionar que varianzas es otro contraste.','El cociente 144/64=2,25 describe varianzas muestrales, pero no equivale a una prueba F completa.'],
['Cierre','Pedir escenarios que requieran Welch o t pareada.','La selección depende del emparejamiento, no del número de columnas.']],
[
['Inicio','Identificar dos variables categóricas: edad y canal de compra.','La hipótesis de interés es independencia poblacional.'],
['Esperados','Explicar cómo se obtienen Eij mediante marginales.','Cada frecuencia esperada es 50 en la tabla inicial.'],
['Chi-cuadrado','Explorar cambios en las proporciones con los controles.','Tabla inicial: χ²=8, gl=1, p≈0,0047; V de Cramér=0,20.'],
['Monte Carlo','Simular tablas bajo una probabilidad común de compra online.','La frecuencia de rechazo se aproxima a α, si la aproximación chi-cuadrado es válida.'],
['Segmentación','Contrastar asociación con causalidad y significancia con fuerza de relación.','60% frente a 40% de compra online por grupo. Esto describe asociación, no prueba efecto causal de edad.'],
['Cierre','Responder qué es una frecuencia esperada y qué significa independencia.','Independencia implica distribución condicional del canal igual en los grupos; rechazar no identifica un mecanismo causal.']]
];
const latex=[
  String.raw`\[Z\approx\frac{\bar X-\mu_0}{S/\sqrt{n}},\qquad Z_p=\frac{\hat p-p_0}{\sqrt{p_0(1-p_0)/n}}\]`,
  String.raw`\[t=\frac{\bar X_A-\bar X_B}{\sqrt{S_A^2/n_A+S_B^2/n_B}}\]`,
  String.raw`\[D_i=X_{i,\mathrm{despu\acute es}}-X_{i,\mathrm{antes}},\quad t=\frac{\bar D}{S_D/\sqrt n}\]`,
  String.raw`\[E_{ij}=\frac{n_{i\cdot}n_{\cdot j}}{n},\qquad\chi^2=\sum_{i,j}\frac{(O_{ij}-E_{ij})^2}{E_{ij}}\]`
];
let active=false,stage=0,visibleNote=false,solution=false;
const $=s=>document.querySelector(s);
function ensureUI(){
 if($('#teacherStart'))return;
 const top=$('.top');const btn=document.createElement('button');btn.id='teacherStart';btn.className='teacher-launch';btn.type='button';btn.textContent='Modo docente · proyectar';btn.addEventListener('click',enter);top.append(btn);
 const bar=document.createElement('div');bar.className='presenter-toolbar';bar.id='presenterToolbar';bar.innerHTML='<div class="controls-left"><button type="button" id="teacherPrev" aria-label="Pantalla anterior">← Anterior</button><button type="button" id="teacherNext" aria-label="Pantalla siguiente">Siguiente →</button></div><div class="presenter-position" id="teacherPosition" aria-live="polite"></div><div class="controls-right"><button type="button" id="teacherReveal" aria-label="Revelar paso">Revelar paso</button><button type="button" id="teacherNotes">Pauta docente</button><button type="button" id="teacherExit" class="exit">Salir</button></div>';document.body.append(bar);
 $('#teacherPrev').addEventListener('click',()=>go(-1));$('#teacherNext').addEventListener('click',()=>go(1));$('#teacherReveal').addEventListener('click',reveal);$('#teacherNotes').addEventListener('click',()=>{visibleNote=!visibleNote;solution=false;refresh()});$('#teacherExit').addEventListener('click',exit);
}
function ensureSlides(){const app=$('#app');if(!app)return;let cover=app.querySelector('.presenter-slide-cover');if(!cover){cover=document.createElement('section');cover.className='section presenter-slide-cover';cover.innerHTML=`<span class="eyebrow">ESTADÍSTICA II · INGENIERÍA COMERCIAL</span><h2>${lessons[current].title}</h2><p>Unidad 2 · 80 minutos · Exploremos la evidencia estadística</p><p class="grid-note">Inicio 10 min · Desarrollo 60 min · Cierre 10 min</p>`;app.prepend(cover)}let sections=[cover,...app.querySelectorAll(':scope > section.section:not(.presenter-slide-cover)')];sections.forEach((el,i)=>{el.classList.toggle('onstage',i===stage)});let notesEl=$('#teacherNotePanel');if(notesEl)notesEl.remove();let chosen=sections[stage];if(chosen){let x=document.createElement('aside');x.className='teacher-notes'+(visibleNote?' show':'');x.id='teacherNotePanel';const n=notes[current][Math.max(0,stage-1)]||['Portada','Presenta el objetivo central y pide una predicción inicial.','No revelar conclusiones antes de explorar.'];x.innerHTML=`<h3>Orientaciones del expositor · ${n[0]}</h3><p>${n[1]}</p>${stage===2||stage===3?`<div class="mathline" id="teacherLatex">${latex[current]}</div>`:''}<button type="button" class="reveal" id="teacherSolutionToggle">${solution?'Ocultar':'Revelar'} solución orientativa</button><div class="teacher-solution" id="teacherSolution" ${solution?'':'hidden'}>${n[2]}</div>`;chosen.append(x);if(window.MathJax?.typesetPromise&&$('#teacherLatex'))window.MathJax.typesetPromise([$('#teacherLatex')]).catch(()=>{});$('#teacherSolutionToggle').addEventListener('click',()=>{solution=!solution;$('#teacherSolution').hidden=!solution;$('#teacherSolutionToggle').textContent=solution?'Ocultar solución orientativa':'Revelar solución orientativa'})}}
function refresh(){if(!active)return;document.body.classList.add('presenter');ensureSlides();$('#teacherPosition').textContent=`Clase ${current+1}/4 · ${stage+1}/7 · ${stages[stage]}`;$('#teacherPrev').disabled=current===0&&stage===0;$('#teacherNext').disabled=current===3&&stage===6;$('#teacherNotes').textContent=visibleNote?'Ocultar pauta':'Pauta docente';$('#teacherReveal').textContent=stage===2?'Revelar paso':'Revelar solución';window.scrollTo(0,0)}
function showLesson(index){stage=0;visibleNote=false;solution=false;render(index);refresh()}
function go(delta){let next=stage+delta;if(next>6){if(current<3)showLesson(current+1);return}if(next<0){if(current>0){showLesson(current-1);stage=6;refresh()}return}stage=next;solution=false;refresh()}
function reveal(){if(stage===2){step=(step+1)%5;updateStep();return}visibleNote=true;solution=!solution;refresh()}
async function enter(){active=true;stage=0;visibleNote=false;solution=false;refresh();try{await document.documentElement.requestFullscreen?.()}catch(e){/* La presentación ampliada sigue disponible */}}
async function exit(){active=false;document.body.classList.remove('presenter');document.querySelectorAll('.onstage').forEach(e=>e.classList.remove('onstage'));try{if(document.fullscreenElement)await document.exitFullscreen()}catch(e){}window.scrollTo(0,0)}
const renderBase=render;render=function(i){renderBase(i);if(active){stage=0;refresh()}};
document.addEventListener('keydown',e=>{if(!active||['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();go(1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(-1)}if(e.key===' '){e.preventDefault();reveal()}if(e.key.toLowerCase()==='n'){visibleNote=!visibleNote;refresh()}if(e.key==='Escape'&&active){exit()}});
ensureUI();
})();
