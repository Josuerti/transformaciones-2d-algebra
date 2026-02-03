// TRANSFORMACIONES LINEALES 2D - SISTEMA PROFESIONAL CON ASISTENTE IA

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let figuraOriginal = [];
let figuraActual = [];
let animando = false;

const ESCALA = 40;
const ORIGEN_X = canvas.width / 2;
const ORIGEN_Y = canvas.height / 2;

// GENERADORES DE FIGURAS
function generarEstrella(nPuntas = 5, R = 5, r = 2.3) {
    const puntos = [];
    for (let i = 0; i < nPuntas * 2; i++) {
        const angulo = (i * 2 * Math.PI) / (nPuntas * 2);
        const radio = i % 2 === 0 ? R : r;
        puntos.push([radio * Math.cos(angulo), radio * Math.sin(angulo), 1]);
    }
    return puntos;
}

function generarPoligonoRegular(n, r = 5) {
    const puntos = [];
    for (let i = 0; i < n; i++) {
        const ang = (i * 2 * Math.PI) / n;
        puntos.push([r * Math.cos(ang), r * Math.sin(ang), 1]);
    }
    return puntos;
}

function generarTriangulo() {
    return [[0, 4, 1], [4, -2, 1], [-4, -2, 1]];
}

function generarRectangulo() {
    return [[-4, -2, 1], [4, -2, 1], [4, 2, 1], [-4, 2, 1]];
}

function generarFlecha() {
    return [[0, 5, 1], [2, 3, 1], [2, 1, 1], [4, 1, 1], [0, -3, 1], [-4, 1, 1], [-2, 1, 1], [-2, 3, 1]];
}

function generarCorazon() {
    const puntos = [];
    for (let i = 0; i < 100; i++) {
        const t = (i / 100) * 2 * Math.PI;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        puntos.push([x/5, y/5, 1]);
    }
    return puntos;
}

function generarLetra() {
    const puntos = [];
    for (let i = 0; i <= 10; i++) puntos.push([-3 + 0.3*i, -3 + 0.6*i, 1]);
    for (let i = 0; i <= 10; i++) puntos.push([0.3*i, 3 - 0.6*i, 1]);
    for (let i = 0; i <= 10; i++) puntos.push([-1.5 + 0.3*i, 0, 1]);
    return puntos;
}

// MATRICES
function matrizRotacion(theta) {
    const rad = theta * Math.PI / 180;
    const c = Math.cos(rad), s = Math.sin(rad);
    return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
}

function matrizEscalamiento(sx, sy) {
    return [[sx, 0, 0], [0, sy, 0], [0, 0, 1]];
}

function matrizShearX(k) {
    return [[1, k, 0], [0, 1, 0], [0, 0, 1]];
}

function matrizTraslacion(dx, dy) {
    return [[1, 0, dx], [0, 1, dy], [0, 0, 1]];
}

function matrizReflexionX() {
    return [[1, 0, 0], [0, -1, 0], [0, 0, 1]];
}

function matrizReflexionY() {
    return [[-1, 0, 0], [0, 1, 0], [0, 0, 1]];
}

function multiplicarMatrices(A, B) {
    const R = [[0,0,0],[0,0,0],[0,0,0]];
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            for (let k = 0; k < 3; k++)
                R[i][j] += A[i][k] * B[k][j];
    return R;
}

function aplicarMatriz(M, p) {
    return [
        M[0][0]*p[0] + M[0][1]*p[1] + M[0][2]*p[2],
        M[1][0]*p[0] + M[1][1]*p[1] + M[1][2]*p[2],
        M[2][0]*p[0] + M[2][1]*p[1] + M[2][2]*p[2]
    ];
}

function aplicarTransformacion(puntos, M) {
    return puntos.map(p => aplicarMatriz(M, p));
}

function calcularDeterminante(M) {
    return M[0][0]*(M[1][1]*M[2][2] - M[1][2]*M[2][1]) -
           M[0][1]*(M[1][0]*M[2][2] - M[1][2]*M[2][0]) +
           M[0][2]*(M[1][0]*M[2][1] - M[1][1]*M[2][0]);
}

// DIBUJO
function limpiar() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

function dibujarGrid() {
    if (!document.getElementById('checkGrid').checked) return;
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += ESCALA/2) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += ESCALA/2) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
    ctx.strokeStyle = '#d3d3d3';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += ESCALA) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += ESCALA) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
}

function dibujarEjes() {
    if (!document.getElementById('checkEjes').checked) return;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, ORIGEN_Y); ctx.lineTo(canvas.width, ORIGEN_Y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ORIGEN_X, 0); ctx.lineTo(ORIGEN_X, canvas.height); ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Inter';
    ctx.fillText('X', canvas.width - 20, ORIGEN_Y - 8);
    ctx.fillText('Y', ORIGEN_X + 8, 15);
}

function dibujarNumeros() {
    if (!document.getElementById('checkNumeros').checked) return;
    ctx.fillStyle = '#666';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    for (let i = -10; i <= 10; i++) {
        if (i === 0) continue;
        ctx.fillText(i, ORIGEN_X + i*ESCALA, ORIGEN_Y + 12);
    }
    ctx.textAlign = 'right';
    for (let i = -10; i <= 10; i++) {
        if (i === 0) continue;
        ctx.fillText(i, ORIGEN_X - 5, ORIGEN_Y - i*ESCALA + 3);
    }
}

function toCanvas(p) {
    return { x: ORIGEN_X + p[0]*ESCALA, y: ORIGEN_Y - p[1]*ESCALA };
}

function dibujarFigura(puntos, color, grosor, relleno, alpha) {
    if (puntos.length === 0) return;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = grosor;
    ctx.beginPath();
    const p0 = toCanvas(puntos[0]);
    ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < puntos.length; i++) {
        const p = toCanvas(puntos[i]);
        ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    if (relleno) ctx.fill();
    ctx.stroke();
    puntos.forEach(punto => {
        const p = toCanvas(punto);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, 2*Math.PI);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function dibujarTodo() {
    limpiar();
    dibujarGrid();
    dibujarEjes();
    dibujarNumeros();
    if (document.getElementById('checkOriginal').checked && figuraOriginal.length > 0) {
        dibujarFigura(figuraOriginal, '#2563eb', 2, true, 0.15);
    }
    if (figuraActual.length > 0) {
        dibujarFigura(figuraActual, '#ef4444', 2.5, true, 0.20);
    }
}

// LÓGICA
function obtenerMatrizCompuesta() {
    let M = [[1,0,0],[0,1,0],[0,0,1]];
    const pasos = [];
    
    if (document.getElementById('checkRotacion').checked) {
        const t = parseFloat(document.getElementById('inputRotacion').value);
        M = multiplicarMatrices(M, matrizRotacion(t));
        pasos.push(`Rotación (θ = ${t}°)`);
    }
    if (document.getElementById('checkEscala').checked) {
        const sx = parseFloat(document.getElementById('inputEscalaX').value);
        const sy = parseFloat(document.getElementById('inputEscalaY').value);
        M = multiplicarMatrices(M, matrizEscalamiento(sx, sy));
        pasos.push(`Escalamiento (${sx}, ${sy})`);
    }
    if (document.getElementById('checkShear').checked) {
        const k = parseFloat(document.getElementById('inputShear').value);
        M = multiplicarMatrices(M, matrizShearX(k));
        pasos.push(`Shear (k=${k})`);
    }
    if (document.getElementById('checkReflexionX').checked) {
        M = multiplicarMatrices(M, matrizReflexionX());
        pasos.push('Reflexión X');
    }
    if (document.getElementById('checkReflexionY').checked) {
        M = multiplicarMatrices(M, matrizReflexionY());
        pasos.push('Reflexión Y');
    }
    if (document.getElementById('checkTraslacion').checked) {
        const dx = parseFloat(document.getElementById('inputTraslacionX').value) / ESCALA;
        const dy = parseFloat(document.getElementById('inputTraslacionY').value) / ESCALA;
        M = multiplicarMatrices(M, matrizTraslacion(dx, dy));
        pasos.push(`Traslación (${dx.toFixed(2)}, ${dy.toFixed(2)})`);
    }
    
    return { matriz: M, pasos };
}

function mostrarMatriz(M, pasos) {
    const div = document.getElementById('matrizDisplay');
    if (pasos.length === 0) {
        div.innerHTML = '<p class="placeholder">Active una transformación</p>';
        document.getElementById('determinante').textContent = '—';
        document.getElementById('propOrient').textContent = '—';
        document.getElementById('propArea').textContent = '—';
        document.getElementById('propTipo').textContent = '—';
        document.getElementById('pasos').innerHTML = '<p class="placeholder">Sin transformaciones</p>';
        return;
    }
    
    div.innerHTML = `
        <div class="matrix-wrapper">
            <span class="matrix-bracket">⎡</span>
            <div class="matrix-values">
                <div class="matrix-row">
                    <span class="matrix-cell">${M[0][0].toFixed(4)}</span>
                    <span class="matrix-cell">${M[0][1].toFixed(4)}</span>
                    <span class="matrix-cell">${M[0][2].toFixed(4)}</span>
                </div>
                <div class="matrix-row">
                    <span class="matrix-cell">${M[1][0].toFixed(4)}</span>
                    <span class="matrix-cell">${M[1][1].toFixed(4)}</span>
                    <span class="matrix-cell">${M[1][2].toFixed(4)}</span>
                </div>
                <div class="matrix-row">
                    <span class="matrix-cell">${M[2][0].toFixed(4)}</span>
                    <span class="matrix-cell">${M[2][1].toFixed(4)}</span>
                    <span class="matrix-cell">${M[2][2].toFixed(4)}</span>
                </div>
            </div>
            <span class="matrix-bracket">⎤</span>
        </div>
    `;
    
    const det = calcularDeterminante(M);
    document.getElementById('determinante').textContent = `det(M) = ${det.toFixed(6)}`;
    document.getElementById('propOrient').textContent = det > 0 ? 'Preservada' : 'Invertida';
    document.getElementById('propArea').textContent = `${Math.abs(det).toFixed(4)}×`;
    document.getElementById('propTipo').textContent = Math.abs(det - 1) < 0.001 ? 'Isometría' : 'General';
    
    const pasosHTML = pasos.map((p, i) => `
        <div class="step-item">
            <span class="step-number">${i+1}</span>
            <span>${p}</span>
        </div>
    `).join('');
    document.getElementById('pasos').innerHTML = pasosHTML;
}

function aplicar() {
    if (figuraOriginal.length === 0) {
        alert('Genere primero una figura');
        return;
    }
    const { matriz, pasos } = obtenerMatrizCompuesta();
    figuraActual = aplicarTransformacion(figuraOriginal, matriz);
    mostrarMatriz(matriz, pasos);
    dibujarTodo();
    explicarAccion('aplicar', { transformaciones: pasos.length, det: calcularDeterminante(matriz) });
}

function animar() {
    if (figuraOriginal.length === 0 || animando) return;
    animando = true;
    const btn = document.getElementById('btnAnimacion');
    btn.textContent = 'Animando...';
    btn.disabled = true;
    
    const { matriz: MF } = obtenerMatrizCompuesta();
    let paso = 0;
    const total = 60;
    
    const int = setInterval(() => {
        paso++;
        const t = paso / total;
        const M = [
            [1 + (MF[0][0]-1)*t, MF[0][1]*t, MF[0][2]*t],
            [MF[1][0]*t, 1 + (MF[1][1]-1)*t, MF[1][2]*t],
            [0, 0, 1]
        ];
        figuraActual = aplicarTransformacion(figuraOriginal, M);
        dibujarTodo();
        if (paso >= total) {
            clearInterval(int);
            animando = false;
            btn.textContent = 'Animar';
            btn.disabled = false;
        }
    }, 1000/60);
    
    explicarAccion('animar', {});
}

function inicializar() {
    const sel = document.getElementById('figuraSelector').value;
    const figs = {
        estrella: generarEstrella(),
        pentagono: generarPoligonoRegular(5),
        hexagono: generarPoligonoRegular(6),
        triangulo: generarTriangulo(),
        rectangulo: generarRectangulo(),
        flecha: generarFlecha(),
        corazon: generarCorazon(),
        letra: generarLetra()
    };
    figuraOriginal = figs[sel] || generarEstrella();
    figuraActual = [...figuraOriginal];
    dibujarTodo();
    explicarAccion('generar', { figura: sel, vertices: figuraOriginal.length });
}

function resetear() {
    figuraActual = [...figuraOriginal];
    document.getElementById('inputRotacion').value = 0;
    document.getElementById('rangeRotacion').value = 0;
    document.getElementById('inputEscalaX').value = 1;
    document.getElementById('rangeEscalaX').value = 1;
    document.getElementById('inputEscalaY').value = 1;
    document.getElementById('rangeEscalaY').value = 1;
    document.getElementById('inputShear').value = 0;
    document.getElementById('rangeShear').value = 0;
    document.getElementById('inputTraslacionX').value = 0;
    document.getElementById('rangeTraslacionX').value = 0;
    document.getElementById('inputTraslacionY').value = 0;
    document.getElementById('rangeTraslacionY').value = 0;
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (['checkOriginal', 'checkEjes', 'checkGrid', 'checkNumeros'].includes(cb.id)) return;
        cb.checked = false;
    });
    dibujarTodo();
    mostrarMatriz([[1,0,0],[0,1,0],[0,0,1]], []);
    explicarAccion('reset', {});
}

// ASISTENTE IA
const aiKnowledge = {
    "explicar-matriz": `LECTURA DE MATRICES

⎡ a  b  tx ⎤
⎢ c  d  ty ⎥
⎣ 0  0  1  ⎦

• a, d: Escalamiento
• b, c: Rotación/Shear
• tx, ty: Traslación
• [0,0,1]: Fila homogénea

Ejemplo: Si a=0.707, b=-0.707, indica rotación 45°`,

    "explicar-det": `DETERMINANTE

det = 1 → Área preservada
det > 1 → Área aumenta
0 < det < 1 → Área disminuye
det = 0 → Colapso
det < 0 → Inversión orientación

Ejemplo: det=2 → área se duplica`,

    "explicar-composicion": `COMPOSICIÓN

C = T · H · S · R

Orden: DERECHA → IZQUIERDA
1° R (rotación)
2° S (escalamiento)
3° H (shear)
4° T (traslación)

El orden importa: AB ≠ BA`
};

let aiVisible = false;

function toggleAI() {
    const panel = document.getElementById('aiPanel');
    aiVisible = !aiVisible;
    panel.classList.toggle('hidden', !aiVisible);
    if (aiVisible) {
        mostrarMensajeIA('Hola, soy tu asistente. ¿Qué deseas saber?', false);
    }
}

function mostrarMensajeIA(msg, user) {
    const div = document.getElementById('aiMessages');
    const m = document.createElement('div');
    m.className = 'ai-message' + (user ? '' : ' assistant');
    m.textContent = msg;
    div.appendChild(m);
    div.scrollTop = div.scrollHeight;
}

function explicarConcepto(action) {
    if (aiKnowledge[action]) {
        mostrarMensajeIA(aiKnowledge[action], false);
    }
}

function explicarAccion(tipo, d) {
    if (!aiVisible) return;
    let msg = '';
    switch(tipo) {
        case 'generar':
            msg = `Generé un ${d.figura} con ${d.vertices} vértices.`;
            break;
        case 'aplicar':
            if (d.transformaciones === 0) {
                msg = 'No hay transformaciones activas.';
            } else {
                msg = `Apliqué ${d.transformaciones} transformación(es). Det=${d.det.toFixed(4)} → el área ${Math.abs(d.det - 1) < 0.01 ? 'se preservó' : d.det > 1 ? 'aumentó' : 'disminuyó'}.`;
            }
            break;
        case 'animar':
            msg = 'Iniciando animación suave de 60 FPS.';
            break;
        case 'reset':
            msg = 'Sistema restablecido a valores iniciales.';
            break;
    }
    if (msg) mostrarMensajeIA(msg, false);
}

// EVENT LISTENERS
function sync(rid, iid) {
    const r = document.getElementById(rid);
    const i = document.getElementById(iid);
    r.addEventListener('input', () => i.value = r.value);
    i.addEventListener('input', () => r.value = i.value);
}

sync('rangeRotacion', 'inputRotacion');
sync('rangeEscalaX', 'inputEscalaX');
sync('rangeEscalaY', 'inputEscalaY');
sync('rangeShear', 'inputShear');
sync('rangeTraslacionX', 'inputTraslacionX');
sync('rangeTraslacionY', 'inputTraslacionY');

document.getElementById('btnDibujar').addEventListener('click', inicializar);
document.getElementById('btnAplicar').addEventListener('click', aplicar);
document.getElementById('btnAnimacion').addEventListener('click', animar);
document.getElementById('btnReset').addEventListener('click', resetear);

document.getElementById('checkOriginal').addEventListener('change', dibujarTodo);
document.getElementById('checkEjes').addEventListener('change', dibujarTodo);
document.getElementById('checkGrid').addEventListener('change', dibujarTodo);
document.getElementById('checkNumeros').addEventListener('change', dibujarTodo);

document.getElementById('btnAyuda').addEventListener('click', toggleAI);
document.getElementById('btnCerrarAI').addEventListener('click', toggleAI);

document.querySelectorAll('.ai-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
        explicarConcepto(btn.getAttribute('data-action'));
    });
});

// INICIALIZACIÓN
window.addEventListener('load', () => {
    inicializar();
    mostrarMatriz([[1,0,0],[0,1,0],[0,0,1]], []);
    console.log('Sistema cargado correctamente');
});
