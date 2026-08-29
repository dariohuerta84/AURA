// Visor 360: convierte las fotos sueltas en un giro continuo.
// Cada foto es una capa; la actual y la siguiente se funden y giran a la vez,
// asi el salto entre angulos deja de verse como un corte.
// Detecta solo las imagenes numeradas (1, 2, 3...), agrega mas y funciona igual.

document.addEventListener('DOMContentLoaded', function() {

    const EXTENSIONES   = ['png', 'webp', 'jpg', 'jpeg'];
    const MAX_FRAMES    = 180;   // tope al buscar imagenes
    const INCLINACION   = 20;    // grados que gira cada capa (sensacion de volumen)
    const PX_POR_VUELTA = 620;   // pixeles de arrastre para dar una vuelta entera
    const AUTO_VEL      = 0.42;  // velocidad del giro automatico (grados por cuadro)
    const FRICCION      = 0.94;  // cuanto se frena el impulso al soltar
    const ESPERA_AUTO   = 2600;  // ms quieto antes de retomar el giro solo

    const visor  = document.getElementById('visor');
    const pila   = document.getElementById('pila');
    const sombra = document.getElementById('sombra');
    const carga  = document.getElementById('carga');
    const prog   = document.getElementById('progreso');
    const barra  = document.getElementById('barra');
    const aguja  = document.getElementById('aguja');
    const hint   = document.getElementById('hint');

    let capas = [];        // los <img> ya montados
    let paso = 90;         // grados entre foto y foto
    let angulo = 0;        // angulo actual, continuo
    let velocidad = 0;     // impulso al soltar
    let arrastrando = false;
    let ultimoX = 0;
    let quietoDesde = 0;
    let interactuado = false;

    iniciar();

    // ########## CARGA ##########

    function cargarImagen(src) {                     // no revienta si el archivo no existe
        return new Promise(function(resolve) {
            const prueba = new Image();
            prueba.onload  = function() { resolve(src); };
            prueba.onerror = function() { resolve(null); };
            prueba.src = src;
        });
    }

    async function buscarFrame(carpeta, numero, extPreferida) {
        const orden = extPreferida                   // prueba primero la extension que ya funciono
            ? [extPreferida].concat(EXTENSIONES.filter(function(e) { return e !== extPreferida; }))
            : EXTENSIONES;
        for (const ext of orden) {
            const src = await cargarImagen(carpeta + '/' + numero + '.' + ext);
            if (src) return { src: src, ext: ext };
        }
        return null;
    }

    async function listar(carpeta) {                 // busca 1, 2, 3... hasta que falte uno
        const rutas = [];
        let ext = null;
        for (let i = 1; i <= MAX_FRAMES; i++) {
            const frame = await buscarFrame(carpeta, i, ext);
            if (!frame) break;
            ext = frame.ext;
            rutas.push(frame.src);
            prog.textContent = rutas.length + ' fotos';
        }
        return rutas;
    }

    async function iniciar() {
        let rutas = await listar(visor.dataset.carpeta);
        if (!rutas.length && visor.dataset.respaldo) {   // aun sin recortar: usa las originales
            rutas = await listar(visor.dataset.respaldo);
        }

        if (!rutas.length) {
            mostrarAviso();
            return;
        }

        paso = 360 / rutas.length;
        for (let i = 0; i < rutas.length; i++) {
            const img = document.createElement('img');
            img.src = rutas[i];
            img.alt = 'Personaje, vista ' + (i + 1);
            img.draggable = false;
            pila.appendChild(img);
            capas.push(img);
            prog.textContent = Math.round(100 * (i + 1) / rutas.length) + '%';
        }

        carga.classList.add('oculto');
        setTimeout(function() { carga.remove(); }, 400);   // fuera del DOM: no estorba al personaje
        barra.classList.add('visible');
        conectarEventos();
        quietoDesde = performance.now();
        requestAnimationFrame(bucle);
    }

    function mostrarAviso() {
        carga.classList.add('oculto');
        hint.remove();
        const aviso = document.createElement('div');
        aviso.className = 'aviso';
        aviso.innerHTML = 'Pon las fotos en <strong>' + visor.dataset.carpeta + '/</strong><br>' +
                          'con nombres <strong>1, 2, 3...</strong> (.png, .jpg o .webp)';
        visor.appendChild(aviso);
    }

    // ########## PINTADO ##########

    // Con pocas fotos el cruce se ve como doble exposicion, asi que lo concentramos
    // en la mitad del tramo: casi siempre miras una foto limpia y la mezcla dura poco.
    function cruce(t) {
        const x = Math.min(1, Math.max(0, (t - 0.28) / 0.44));
        return x * x * (3 - 2 * x);
    }

    function pintar() {
        const n = capas.length;
        const vuelta = ((angulo % 360) + 360) % 360;
        const pos = vuelta / paso;
        const i0  = Math.floor(pos) % n;             // foto que manda ahora
        const i1  = (i0 + 1) % n;                    // la que entra
        const t   = pos - Math.floor(pos);           // 0 = i0 pura, 1 = i1 pura

        for (let i = 0; i < n; i++) {
            const capa = capas[i];
            if (i !== i0 && i !== i1) {
                if (capa.style.opacity !== '0') capa.style.opacity = '0';
                continue;
            }
            // La que manda gira alejandose; la que entra llega girando hasta quedar de frente.
            const giro = (i === i0 ? t : t - 1) * INCLINACION;
            capa.style.opacity   = i === i0 ? 1 : cruce(t);
            capa.style.zIndex    = i === i0 ? 1 : 2;
            capa.style.transform = 'rotateY(' + giro.toFixed(2) + 'deg)';
        }

        // La sombra se ensancha de frente y se afina de perfil
        const rad = vuelta * Math.PI / 180;
        sombra.style.width = (33 + 13 * Math.abs(Math.cos(rad))).toFixed(1) + '%';
        aguja.style.left = (vuelta / 360 * 100).toFixed(2) + '%';
    }

    // ########## MOVIMIENTO ##########

    function bucle(ahora) {
        if (!arrastrando) {
            if (Math.abs(velocidad) > 0.02) {
                angulo += velocidad;                 // sigue el impulso del ultimo tiron
                velocidad *= FRICCION;
                quietoDesde = ahora;
            } else if (ahora - quietoDesde > ESPERA_AUTO) {
                angulo += AUTO_VEL;                  // nadie toca: gira solo
            }
        }
        pintar();
        requestAnimationFrame(bucle);
    }

    function conectarEventos() {

        visor.addEventListener('pointerdown', function(e) {
            arrastrando = true;
            ultimoX = e.clientX;
            velocidad = 0;
            visor.classList.add('arrastrando');
            visor.setPointerCapture(e.pointerId);
            if (!interactuado) {
                interactuado = true;
                hint.classList.add('oculto');
            }
        });

        visor.addEventListener('pointermove', function(e) {
            if (!arrastrando) return;
            const dx = e.clientX - ultimoX;
            ultimoX = e.clientX;
            const giro = -dx * 360 / PX_POR_VUELTA;  // arrastras a la derecha, el personaje gira hacia ti
            angulo += giro;
            velocidad = giro;                        // guarda el ultimo tiron como impulso
        });

        function soltar(e) {
            if (!arrastrando) return;
            arrastrando = false;
            quietoDesde = performance.now();
            visor.classList.remove('arrastrando');
            if (e.pointerId !== undefined && visor.hasPointerCapture(e.pointerId)) {
                visor.releasePointerCapture(e.pointerId);
            }
        }

        visor.addEventListener('pointerup', soltar);
        visor.addEventListener('pointercancel', soltar);
        visor.addEventListener('dragstart', function(e) { e.preventDefault(); });

        // Flechas del teclado: avanza una foto por pulsacion
        window.addEventListener('keydown', function(e) {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            velocidad = 0;
            quietoDesde = performance.now();
            angulo += (e.key === 'ArrowRight' ? paso : -paso);
            if (!interactuado) { interactuado = true; hint.classList.add('oculto'); }
        });
    }
});
