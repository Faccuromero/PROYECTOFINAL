// ============================================================
// TORNEOS DE PADEL - CLUB DEPORTIVO
// VERSION COMPLETA
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // ELEMENTOS
    // ========================================================

    const nombreTorneoInput = document.getElementById("nombreTorneo");
    const categoriaTorneoInput = document.getElementById("categoriaTorneo");
    const tipoTorneoInput = document.getElementById("tipoTorneo");

    const cantidadParejasInput = document.getElementById("cantidadParejas");
    const cantidadGruposInput = document.getElementById("cantidadGrupos");
    const clasificadosInput = document.getElementById("clasificadosPorGrupo");
    const mejoresTercerosInput = document.getElementById("cantidadMejoresTerceros");

    const categoriaParejaInput = document.getElementById("categoriaPareja");
    const jugador1Input = document.getElementById("jugador1NombreCompleto");
    const jugador2Input = document.getElementById("jugador2NombreCompleto");

    const btnContinuarDatos = document.getElementById("btnContinuarDatos");
    const btnContinuarParejas = document.getElementById("btnContinuarParejas");
    const btnContinuarZonas = document.getElementById("btnContinuarZonas");

    const btnVolverDatos = document.getElementById("btnVolverDatos");
    const btnVolverParejas = document.getElementById("btnVolverParejas");
    const btnVolverZonas = document.getElementById("btnVolverZonas");

    const btnAgregarPareja = document.getElementById("btnAgregarPareja");
    const btnGenerar = document.getElementById("btnGenerar");

    const btnNuevoTorneo = document.getElementById("btnNuevoTorneo");
    const btnNuevoTorneoFinal = document.getElementById("btnNuevoTorneoFinal");

    const modalNuevoTorneo = document.getElementById("modalNuevoTorneo");
    const btnCancelarNuevoTorneo = document.getElementById("btnCancelarNuevoTorneo");
    const btnConfirmarNuevoTorneo = document.getElementById("btnConfirmarNuevoTorneo");

    const mensaje = document.getElementById("mensaje");

    // PASOS
    const pasos = {
        1: document.getElementById("pasoDatos"),
        2: document.getElementById("pasoParejas"),
        3: document.getElementById("pasoZonas"),
        4: document.getElementById("pasoConfirmar")
    };

    const indicadores = {
        1: document.getElementById("indicadorPaso1"),
        2: document.getElementById("indicadorPaso2"),
        3: document.getElementById("indicadorPaso3"),
        4: document.getElementById("indicadorPaso4")
    };

    // CONFIGURACIÓN DE ZONAS
    const contenedorConfiguracionZonas =
        document.getElementById("contenedorConfiguracionZonas");

    const resumenDistribucion =
        document.getElementById("resumenDistribucion");

    // LISTA PAREJAS
    const listaParejas = document.getElementById("listaParejas");
    const contadorParejas = document.getElementById("contadorParejas");
    const progresoParejas = document.getElementById("progresoParejas");

    // DESCRIPCIÓN MODALIDAD
    const descripcionTipoTorneo =
        document.getElementById("descripcionTipoTorneo");

    // RESUMEN
    const resumenNombreTorneo =
        document.getElementById("resumenNombreTorneo");

    const resumenCategoria =
        document.getElementById("resumenCategoria");

    const resumenFormato =
        document.getElementById("resumenFormato");

    const resumenParejas =
        document.getElementById("resumenParejas");

    const resumenZonas =
        document.getElementById("resumenZonas");

    const resumenClasificados =
        document.getElementById("resumenClasificados");

    const resumenTerceros =
        document.getElementById("resumenTerceros");

    // TORNEO GENERADO
    const informacionTorneo =
        document.getElementById("informacionTorneo");

    const totalParejas =
        document.getElementById("totalParejas");

    const totalGrupos =
        document.getElementById("totalGrupos");

    const totalClasificados =
        document.getElementById("totalClasificados");

    // ZONAS
    const contenedorZonas =
        document.getElementById("contenedorZonas");

    // RESULTADOS
    const seccionResultados =
        document.getElementById("seccionResultados");

    const contenedorPartidos =
        document.getElementById("contenedorPartidos");

    // TABLAS
    const seccionTablas =
        document.getElementById("seccionTablas");

    const contenedorTablas =
        document.getElementById("contenedorTablas");

    // CLASIFICADOS
    const seccionClasificados =
        document.getElementById("seccionClasificados");

    const listaClasificados =
        document.getElementById("listaClasificados");

    // ELIMINACIÓN
    const seccionEliminacion =
        document.getElementById("seccionEliminacion");

    const cuadroEliminacion =
        document.getElementById("cuadroEliminacion");

    // CAMPEÓN
    const seccionCampeon =
        document.getElementById("seccionCampeon");

    const nombreCampeon =
        document.getElementById("nombreCampeon");

    // ========================================================
    // VARIABLES
    // ========================================================

    let parejas = JSON.parse(
        localStorage.getItem("parejasClubDeportivo")
    ) || [];

    let torneoActual = null;

    let grupos = [];
    let partidos = [];

    let canchas = [];

    let pasoActual = 1;

    // ========================================================
    // INICIO
    // ========================================================

    iniciar();

    async function iniciar() {

        configurarEventos();

        cargarCanchas();

        cargarUltimoTorneo();

        sincronizarCategoriaPareja();

        actualizarDescripcionModalidad();

        actualizarContador();

        actualizarResumen();

        mostrarPaso(1);
    }

    // ========================================================
    // EVENTOS
    // ========================================================

    function configurarEventos() {

        // --------------------------------------------
        // CONTINUAR DATOS
        // --------------------------------------------

        btnContinuarDatos?.addEventListener("click", () => {

            if (!validarDatosTorneo()) {
                return;
            }

            sincronizarCategoriaPareja();

            actualizarContador();

            mostrarPaso(2);
        });


        // --------------------------------------------
        // VOLVER DATOS
        // --------------------------------------------

        btnVolverDatos?.addEventListener("click", () => {
            mostrarPaso(1);
        });


        // --------------------------------------------
        // CONTINUAR PAREJAS
        // --------------------------------------------

        btnContinuarParejas?.addEventListener("click", () => {

            if (!validarParejas()) {
                return;
            }

            actualizarConfiguracionZonas();

            mostrarPaso(3);
        });


        // --------------------------------------------
        // VOLVER PAREJAS
        // --------------------------------------------

        btnVolverParejas?.addEventListener("click", () => {
            mostrarPaso(2);
        });


        // --------------------------------------------
        // CONTINUAR ZONAS
        // --------------------------------------------

        btnContinuarZonas?.addEventListener("click", () => {

            if (!validarZonas()) {
                return;
            }

            actualizarResumen();

            mostrarPaso(4);
        });


        // --------------------------------------------
        // VOLVER ZONAS
        // --------------------------------------------

        btnVolverZonas?.addEventListener("click", () => {
            mostrarPaso(3);
        });


        // --------------------------------------------
        // CATEGORIA TORNEO
        // --------------------------------------------

        categoriaTorneoInput?.addEventListener("change", () => {

            sincronizarCategoriaPareja();

            actualizarContador();

            mostrarParejas();

            actualizarResumen();
        });


        // --------------------------------------------
        // CATEGORIA PAREJA
        // --------------------------------------------

        categoriaParejaInput?.addEventListener("change", () => {
            mostrarParejas();
        });


        // --------------------------------------------
        // MODALIDAD
        // --------------------------------------------

        tipoTorneoInput?.addEventListener("change", () => {
            actualizarDescripcionModalidad();
            actualizarResumen();
        });


        // --------------------------------------------
        // CANTIDAD PAREJAS
        // --------------------------------------------

        cantidadParejasInput?.addEventListener("input", () => {

            actualizarContador();

            actualizarResumen();
        });


        // --------------------------------------------
        // CANTIDAD ZONAS
        // --------------------------------------------

        cantidadGruposInput?.addEventListener("input", () => {

            actualizarConfiguracionZonas();

            actualizarResumen();
        });


        // --------------------------------------------
        // CLASIFICADOS
        // --------------------------------------------

        clasificadosInput?.addEventListener("input", () => {

            actualizarConfiguracionZonas();

            actualizarResumen();
        });


        // --------------------------------------------
        // MEJORES TERCEROS
        // --------------------------------------------

        mejoresTercerosInput?.addEventListener("input", () => {
            actualizarResumen();
        });


        // --------------------------------------------
        // AGREGAR PAREJA
        // --------------------------------------------

        btnAgregarPareja?.addEventListener(
            "click",
            agregarPareja
        );


        // --------------------------------------------
        // GENERAR TORNEO
        // --------------------------------------------

        btnGenerar?.addEventListener(
            "click",
            generarTorneo
        );


        // --------------------------------------------
        // NUEVO TORNEO
        // --------------------------------------------

        btnNuevoTorneo?.addEventListener(
            "click",
            abrirModalNuevoTorneo
        );

        btnNuevoTorneoFinal?.addEventListener(
            "click",
            abrirModalNuevoTorneo
        );


        // --------------------------------------------
        // MODAL
        // --------------------------------------------

        btnCancelarNuevoTorneo?.addEventListener(
            "click",
            cerrarModalNuevoTorneo
        );

        btnConfirmarNuevoTorneo?.addEventListener(
            "click",
            crearNuevoTorneo
        );


        modalNuevoTorneo?.addEventListener("click", (e) => {

            if (e.target === modalNuevoTorneo) {
                cerrarModalNuevoTorneo();
            }

        });

    }

    // ========================================================
    // PASOS
    // ========================================================

    function mostrarPaso(numero) {

        pasoActual = numero;

        Object.keys(pasos).forEach(num => {

            const elemento = pasos[num];

            if (!elemento) return;

            if (Number(num) === numero) {
                elemento.classList.remove("oculto");
                elemento.style.display = "";
            } else {
                elemento.classList.add("oculto");
                elemento.style.display = "none";
            }

        });


        Object.keys(indicadores).forEach(num => {

            const indicador = indicadores[num];

            if (!indicador) return;

            indicador.classList.toggle(
                "activo",
                Number(num) === numero
            );

            if (Number(num) < numero) {
                indicador.classList.add("completado");
            } else {
                indicador.classList.remove("completado");
            }

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // ========================================================
    // VALIDAR DATOS
    // ========================================================

    function validarDatosTorneo() {

        const nombre =
            nombreTorneoInput?.value.trim();

        const categoria =
            categoriaTorneoInput?.value;

        const modalidad =
            tipoTorneoInput?.value;


        if (!nombre) {

            mostrarMensaje(
                "Ingresá un nombre para el torneo.",
                "error"
            );

            nombreTorneoInput?.focus();

            return false;
        }


        if (!categoria) {

            mostrarMensaje(
                "Seleccioná una categoría.",
                "error"
            );

            categoriaTorneoInput?.focus();

            return false;
        }


        if (!modalidad) {

            mostrarMensaje(
                "Seleccioná una modalidad de juego.",
                "error"
            );

            tipoTorneoInput?.focus();

            return false;
        }


        return true;
    }

    // ========================================================
    // VALIDAR PAREJAS
    // ========================================================

    function validarParejas() {

        const cantidad =
            Number(cantidadParejasInput?.value);

        const categoria =
            categoriaTorneoInput?.value;

        if (!cantidad || cantidad < 4) {

            mostrarMensaje(
                "El torneo debe tener al menos 4 parejas.",
                "error"
            );

            return false;
        }


        const parejasCategoria =
            obtenerParejasCategoria(categoria);


        if (parejasCategoria.length !== cantidad) {

            mostrarMensaje(
                `Necesitás exactamente ${cantidad} parejas de ${nombreCategoria(categoria)}. Actualmente hay ${parejasCategoria.length}.`,
                "error"
            );

            return false;
        }


        return true;
    }

    // ========================================================
    // VALIDAR ZONAS
    // ========================================================

    function validarZonas() {

        const cantidadParejas =
            Number(cantidadParejasInput?.value);

        const cantidadZonas =
            Number(cantidadGruposInput?.value);

        const clasificados =
            Number(clasificadosInput?.value);

        const mejoresTerceros =
            Number(mejoresTercerosInput?.value) || 0;


        if (!cantidadZonas || cantidadZonas < 1) {

            mostrarMensaje(
                "Ingresá la cantidad de zonas.",
                "error"
            );

            return false;
        }


        if (cantidadZonas > cantidadParejas) {

            mostrarMensaje(
                "No podés tener más zonas que parejas.",
                "error"
            );

            return false;
        }


        if (!clasificados || clasificados < 1) {

            mostrarMensaje(
                "Ingresá cuántas parejas clasifican por zona.",
                "error"
            );

            return false;
        }


        // Máximo de 4 parejas por zona
        const minimoPorZona =
            Math.floor(cantidadParejas / cantidadZonas);

        const maximoPorZona =
            Math.ceil(cantidadParejas / cantidadZonas);


        if (
            minimoPorZona < 3 ||
            maximoPorZona > 4
        ) {

            mostrarMensaje(
                "Para este sistema las zonas deben quedar de 3 o 4 parejas. Modificá la cantidad de zonas.",
                "error"
            );

            return false;
        }


        if (clasificados >= maximoPorZona) {

            mostrarMensaje(
                "No puede clasificar toda la zona. Tiene que quedar al menos una pareja eliminada.",
                "error"
            );

            return false;
        }


        if (mejoresTerceros > 0 && clasificados > 2) {

            mostrarMensaje(
                "Los mejores terceros solo tienen sentido cuando clasifican 2 parejas por zona.",
                "error"
            );

            return false;
        }


        const totalClasificados =
            cantidadZonas * clasificados + mejoresTerceros;


        if (totalClasificados < 2) {

            mostrarMensaje(
                "Tiene que haber al menos 2 clasificados para jugar eliminación.",
                "error"
            );

            return false;
        }


        return true;
    }

    // ========================================================
    // CATEGORIAS
    // ========================================================

    function nombreCategoria(categoria) {

        const nombres = {

            primera: "Primera categoría",
            segunda: "Segunda categoría",
            tercera: "Tercera categoría",
            cuarta: "Cuarta categoría",
            quinta: "Quinta categoría",
            sexta: "Sexta categoría",
            septima: "Séptima categoría",
            octava: "Octava categoría"

        };

        return nombres[categoria] || "-";
    }


    function sincronizarCategoriaPareja() {

        if (!categoriaParejaInput) return;

        categoriaParejaInput.value =
            categoriaTorneoInput?.value || "";

        categoriaParejaInput.disabled = true;
    }


    function obtenerParejasCategoria(categoria) {

        return parejas.filter(
            pareja => pareja.categoria === categoria
        );
    }

    // ========================================================
    // PAREJAS
    // ========================================================

    function agregarPareja() {

        const categoria =
            categoriaTorneoInput?.value;

        const jugador1 =
            jugador1Input?.value.trim();

        const jugador2 =
            jugador2Input?.value.trim();


        if (!categoria) {

            mostrarMensaje(
                "Primero seleccioná la categoría del torneo.",
                "error"
            );

            return;
        }


        if (!jugador1 || !jugador2) {

            mostrarMensaje(
                "Completá el nombre de los dos jugadores.",
                "error"
            );

            return;
        }


        const yaExisteJugador =
            parejas.some(p =>

                p.jugador1.toLowerCase() === jugador1.toLowerCase() ||
                p.jugador2.toLowerCase() === jugador1.toLowerCase() ||
                p.jugador1.toLowerCase() === jugador2.toLowerCase() ||
                p.jugador2.toLowerCase() === jugador2.toLowerCase()

            );


        if (yaExisteJugador) {

            mostrarMensaje(
                "Uno de esos jugadores ya está inscripto en otra pareja.",
                "error"
            );

            return;
        }


        const nuevaPareja = {

            id: Date.now() + Math.floor(Math.random() * 1000),

            jugador1,
            jugador2,

            nombre:
                `${jugador1} / ${jugador2}`,

            categoria,

            grupo: null,

            puntos: 0,
            pj: 0,
            dg: 0,

            createdAt:
                new Date().toISOString()

        };


        parejas.push(nuevaPareja);

        guardarParejas();


        jugador1Input.value = "";
        jugador2Input.value = "";


        mostrarParejas();

        actualizarContador();


        mostrarMensaje(
            "Pareja agregada correctamente.",
            "success"
        );
    }


    function mostrarParejas() {

        if (!listaParejas) return;

        listaParejas.innerHTML = "";


        const categoria =
            categoriaTorneoInput?.value || "";


        const lista =
            obtenerParejasCategoria(categoria);


        if (!lista.length) {

            listaParejas.innerHTML = `
                <div class="sin-parejas">
                    👥 Todavía no agregaste ninguna pareja.
                </div>
            `;

            return;
        }


        lista.forEach((pareja, index) => {

            const div =
                document.createElement("div");

            div.className =
                "pareja-cargada";


            div.innerHTML = `

                <div>

                    <strong>
                        Pareja ${index + 1}
                    </strong>

                    <span>
                        ${escapeHTML(pareja.nombre)}
                    </span>

                    <small>
                        ${nombreCategoria(pareja.categoria)}
                    </small>

                </div>

                <button
                    type="button"
                    class="btn-eliminar-pareja"
                    data-id="${pareja.id}"
                >
                    🗑️
                </button>

            `;


            listaParejas.appendChild(div);

        });


        listaParejas
            .querySelectorAll(".btn-eliminar-pareja")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    const id =
                        Number(btn.dataset.id);


                    const tieneTorneo =
                        torneoActual &&
                        grupos.some(g =>
                            g.parejas.some(p =>
                                p.id === id
                            )
                        );


                    if (tieneTorneo) {

                        mostrarMensaje(
                            "No podés eliminar una pareja que ya participa del torneo actual.",
                            "error"
                        );

                        return;
                    }


                    parejas =
                        parejas.filter(
                            p => p.id !== id
                        );


                    guardarParejas();

                    mostrarParejas();

                    actualizarContador();

                });

            });
    }


    function guardarParejas() {

        localStorage.setItem(
            "parejasClubDeportivo",
            JSON.stringify(parejas)
        );
    }

    // ========================================================
    // CONTADOR
    // ========================================================

    function actualizarContador() {

        const categoria =
            categoriaTorneoInput?.value || "";

        const cantidad =
            Number(cantidadParejasInput?.value) || 0;

        const cantidadActual =
            obtenerParejasCategoria(categoria).length;


        if (contadorParejas) {

            contadorParejas.textContent =
                `${cantidadActual} / ${cantidad}`;

        }


        if (progresoParejas) {

            const porcentaje =
                cantidad > 0
                    ? Math.min(
                        100,
                        (cantidadActual / cantidad) * 100
                    )
                    : 0;

            progresoParejas.style.width =
                `${porcentaje}%`;

        }
    }

    // ========================================================
    // MODALIDADES
    // ========================================================

    function actualizarDescripcionModalidad() {

        if (!descripcionTipoTorneo) return;

        const modalidad =
            tipoTorneoInput?.value;


        const textos = {

            "9_games": `
                <strong>🎾 Partido a 9 games</strong>
                <p>
                    Gana la pareja que llegue primero a 9 games.
                    Ejemplo válido: 9-7, 9-4 o 9-0.
                    Un resultado 8-7 todavía NO termina el partido.
                </p>
            `,

            "2_sets_supertiebreak": `
                <strong>🎾 2 sets + Super Tie-Break</strong>
                <p>
                    Se juegan hasta 2 sets. Si quedan 1-1,
                    se define mediante Super Tie-Break.
                </p>
            `,

            "partido_completo": `
                <strong>🎾 Partido completo</strong>
                <p>
                    Se juegan hasta 3 sets. Gana la pareja
                    que consiga 2 sets.
                </p>
            `

        };


        descripcionTipoTorneo.innerHTML =
            textos[modalidad] ||
            "Seleccioná una modalidad para conocer cómo se jugarán los partidos.";
    }

    // ========================================================
    // CONFIGURACION DE ZONAS
    // ========================================================

    function actualizarConfiguracionZonas() {

        if (!contenedorConfiguracionZonas) return;


        const cantidadParejas =
            Number(cantidadParejasInput?.value) || 0;

        const cantidadZonas =
            Number(cantidadGruposInput?.value) || 0;


        contenedorConfiguracionZonas.innerHTML = "";


        if (!cantidadZonas) {

            contenedorConfiguracionZonas.innerHTML = `
                <div class="sin-parejas">
                    Ingresá primero la cantidad de zonas.
                </div>
            `;

            if (resumenDistribucion) {
                resumenDistribucion.textContent =
                    `0 / ${cantidadParejas} parejas`;
            }

            return;
        }


        if (cantidadZonas > cantidadParejas) {

            contenedorConfiguracionZonas.innerHTML = `
                <div class="sin-parejas">
                    ⚠️ La cantidad de zonas no puede ser mayor que la cantidad de parejas.
                </div>
            `;

            return;
        }


        const base =
            Math.floor(cantidadParejas / cantidadZonas);

        const resto =
            cantidadParejas % cantidadZonas;


        let total = 0;


        for (let i = 0; i < cantidadZonas; i++) {

            const cantidadZona =
                base + (i < resto ? 1 : 0);


            total += cantidadZona;


            const div =
                document.createElement("div");

            div.className =
                "configuracion-zona-item";


            div.innerHTML = `

                <div>

                    <strong>
                        Zona ${String.fromCharCode(65 + i)}
                    </strong>

                    <span>
                        ${cantidadZona} parejas
                    </span>

                </div>

                <div class="zona-distribucion">
                    ${crearCirculosParejas(cantidadZona)}
                </div>

            `;


            contenedorConfiguracionZonas.appendChild(div);
        }


        if (resumenDistribucion) {

            resumenDistribucion.textContent =
                `${total} / ${cantidadParejas} parejas`;

        }
    }


    function crearCirculosParejas(cantidad) {

        let html = "";

        for (let i = 0; i < cantidad; i++) {
            html += `<span class="circulo-pareja">${i + 1}</span>`;
        }

        return html;
    }

    // ========================================================
    // RESUMEN
    // ========================================================

    function actualizarResumen() {

        const nombre =
            nombreTorneoInput?.value.trim() || "-";

        const categoria =
            categoriaTorneoInput?.value || "";

        const modalidad =
            tipoTorneoInput?.value || "";

        const cantidad =
            Number(cantidadParejasInput?.value) || 0;

        const zonas =
            Number(cantidadGruposInput?.value) || 0;

        const clasificados =
            Number(clasificadosInput?.value) || 0;

        const terceros =
            Number(mejoresTercerosInput?.value) || 0;


        if (resumenNombreTorneo) {
            resumenNombreTorneo.textContent = nombre;
        }


        if (resumenCategoria) {

            resumenCategoria.textContent =
                nombreCategoria(categoria);

        }


        if (resumenFormato) {

            resumenFormato.textContent =
                nombreModalidad(modalidad);

        }


        if (resumenParejas) {

            const cantidadActual =
                obtenerParejasCategoria(categoria).length;

            resumenParejas.textContent =
                `${cantidadActual} / ${cantidad} parejas`;

        }


        if (resumenZonas) {

            resumenZonas.textContent =
                zonas
                    ? `${zonas} zonas`
                    : "-";

        }


        if (resumenClasificados) {

            resumenClasificados.textContent =
                clasificados || "-";

        }


        if (resumenTerceros) {

            resumenTerceros.textContent =
                terceros;

        }
    }


    function nombreModalidad(modalidad) {

        const nombres = {

            "9_games":
                "Partido a 9 games",

            "2_sets_supertiebreak":
                "2 sets + Super Tie-Break",

            "partido_completo":
                "Partido completo - 3er set"

        };

        return nombres[modalidad] || "-";
    }

    // ========================================================
    // CARGAR CANCHAS
    // ========================================================

    async function cargarCanchas() {

        try {

            const respuesta =
                await fetch(
                    "http://localhost:3000/api/canchas"
                );


            if (!respuesta.ok) {
                throw new Error(
                    "No se pudieron cargar las canchas."
                );
            }


            canchas =
                await respuesta.json();


        } catch (error) {

            console.error(
                "Error cargando canchas:",
                error
            );

            canchas = [];

        }
    }

    // ========================================================
    // GENERAR TORNEO
    // ========================================================

    function generarTorneo() {

        if (!validarDatosTorneo()) return;

        if (!validarParejas()) return;

        if (!validarZonas()) return;


        const nombre =
            nombreTorneoInput.value.trim();

        const categoria =
            categoriaTorneoInput.value;

        const modalidad =
            tipoTorneoInput.value;

        const cantidad =
            Number(cantidadParejasInput.value);

        const zonasCantidad =
            Number(cantidadGruposInput.value);

        const clasificados =
            Number(clasificadosInput.value);

        const mejoresTerceros =
            Number(mejoresTercerosInput.value) || 0;


        const parejasCategoria =
            obtenerParejasCategoria(categoria);


        // -----------------------------------------
        // NUEVO TORNEO
        // -----------------------------------------

        const idTorneo =
            `torneo_${Date.now()}`;


        torneoActual = {

            id: idTorneo,

            nombre,

            categoria,

            modalidad,

            cantidadParejas: cantidad,

            cantidadZonas: zonasCantidad,

            clasificadosPorZona: clasificados,

            mejoresTerceros,

            creado:
                new Date().toISOString(),

            estado: "fase_grupos"

        };


        // -----------------------------------------
        // MEZCLAR PAREJAS
        // -----------------------------------------

        const mezcladas =
            [...parejasCategoria]
                .sort(
                    () => Math.random() - 0.5
                )
                .slice(0, cantidad);


        // -----------------------------------------
        // CREAR ZONAS
        // -----------------------------------------

        grupos = [];


        const base =
            Math.floor(
                cantidad / zonasCantidad
            );

        const resto =
            cantidad % zonasCantidad;


        let indicePareja = 0;


        for (
            let i = 0;
            i < zonasCantidad;
            i++
        ) {

            const cantidadZona =
                base +
                (i < resto ? 1 : 0);


            const grupo = {

                id: i,

                nombre:
                    `Zona ${String.fromCharCode(65 + i)}`,

                parejas: []

            };


            for (
                let j = 0;
                j < cantidadZona;
                j++
            ) {

                const pareja =
                    mezcladas[indicePareja++];


                pareja.grupo =
                    grupo.nombre;

                pareja.puntos = 0;
                pareja.pj = 0;
                pareja.dg = 0;


                grupo.parejas.push(pareja);
            }


            grupos.push(grupo);
        }


        // -----------------------------------------
        // GENERAR PARTIDOS
        // -----------------------------------------

        generarPartidosZona();


        // -----------------------------------------
        // GUARDAR
        // -----------------------------------------

        guardarTorneoActual();


        // -----------------------------------------
        // MOSTRAR
        // -----------------------------------------

        mostrarTorneoGenerado();


        mostrarMensaje(
            "¡Torneo generado correctamente!",
            "success"
        );


        document
            .getElementById("informacionTorneo")
            ?.scrollIntoView({
                behavior: "smooth"
            });
    }

    // ========================================================
    // PARTIDOS DE ZONA
    // ========================================================

    function generarPartidosZona() {

        partidos = [];


        grupos.forEach(grupo => {

            for (
                let i = 0;
                i < grupo.parejas.length;
                i++
            ) {

                for (
                    let j = i + 1;
                    j < grupo.parejas.length;
                    j++
                ) {

                    partidos.push({

                        id:
                            `grupo_${grupo.id}_${grupo.parejas[i].id}_${grupo.parejas[j].id}`,

                        fase: "grupos",

                        grupoId: grupo.id,

                        parejaA:
                            grupo.parejas[i].id,

                        parejaB:
                            grupo.parejas[j].id,

                        cancha: null,

                        resultado: null,

                        ganador: null

                    });

                }
            }
        });
    }

    // ========================================================
    // MOSTRAR TORNEO GENERADO
    // ========================================================

    function mostrarTorneoGenerado() {

        if (informacionTorneo) {
            informacionTorneo.classList.remove("oculto");
        }

        if (seccionResultados) {
            seccionResultados.classList.remove("oculto");
        }

        if (seccionTablas) {
            seccionTablas.classList.remove("oculto");
        }

        if (seccionClasificados) {
            seccionClasificados.classList.remove("oculto");
        }

        if (seccionEliminacion) {
            seccionEliminacion.classList.remove("oculto");
        }


        mostrarZonas();

        mostrarPartidos();

        actualizarTablas();

        mostrarClasificados();

        mostrarEliminacion();

        actualizarEstadisticas();
    }

    // ========================================================
    // MOSTRAR ZONAS
    // ========================================================

    function mostrarZonas() {

        if (!contenedorZonas) return;

        contenedorZonas.innerHTML = "";


        grupos.forEach(grupo => {

            ordenarGrupo(grupo);


            const zona =
                document.createElement("div");

            zona.className = "zona";


            zona.innerHTML = `

                <div class="zona-header">

                    <div>

                        <span>ZONA</span>

                        <h2>
                            ${grupo.nombre}
                        </h2>

                        <small>
                            ${grupo.parejas.length} parejas
                        </small>

                    </div>

                    <div class="clasifican">
                        Clasifican
                        ${torneoActual?.clasificadosPorZona || 0}
                    </div>

                </div>

                <div class="tabla-zona">

                    <div class="fila encabezado">

                        <span>#</span>
                        <span>Pareja</span>
                        <span>PJ</span>
                        <span>PTS</span>
                        <span>DG</span>

                    </div>

                    ${grupo.parejas.map((pareja, index) => `

                        <div class="fila">

                            <span>
                                ${index + 1}
                            </span>

                            <span>
                                ${escapeHTML(pareja.nombre)}
                            </span>

                            <span>
                                ${pareja.pj || 0}
                            </span>

                            <span>
                                ${pareja.puntos || 0}
                            </span>

                            <span>
                                ${pareja.dg || 0}
                            </span>

                        </div>

                    `).join("")}

                </div>

            `;


            contenedorZonas.appendChild(zona);

        });
    }

    // ========================================================
    // MOSTRAR PARTIDOS
    // ========================================================

    function mostrarPartidos() {

        if (!contenedorPartidos) return;

        contenedorPartidos.innerHTML = "";


        grupos.forEach(grupo => {

            const titulo =
                document.createElement("h3");

            titulo.textContent =
                grupo.nombre;


            contenedorPartidos.appendChild(titulo);


            const partidosGrupo =
                partidos.filter(
                    partido =>
                        partido.fase === "grupos" &&
                        partido.grupoId === grupo.id
                );


            partidosGrupo.forEach(partido => {

                crearTarjetaPartido(
                    partido,
                    contenedorPartidos
                );

            });

        });
    }

    // ========================================================
    // CREAR TARJETA PARTIDO
    // ========================================================

    function crearTarjetaPartido(
        partido,
        contenedor
    ) {

        const parejaA =
            buscarPareja(partido.parejaA);

        const parejaB =
            buscarPareja(partido.parejaB);


        if (!parejaA || !parejaB) {
            return;
        }


        const div =
            document.createElement("div");

        div.className =
            "partido-card";


        const resultado =
            partido.resultado;


        const opcionesCanchas =
            canchas.map(cancha => {

                const idCancha =
                    cancha.id_cancha ??
                    cancha.id ??
                    cancha.idCancha;

                const nombreCancha =
                    cancha.nombre ??
                    cancha.nombre_cancha ??
                    `Cancha ${idCancha}`;


                return `

                    <option
                        value="${idCancha}"
                        ${Number(partido.cancha) === Number(idCancha)
                            ? "selected"
                            : ""}
                    >
                        ${escapeHTML(nombreCancha)}
                    </option>

                `;

            }).join("");


        div.innerHTML = `

            <div class="partido-encabezado-cancha">

                <div class="partido-info">

                    <span>
                        ${escapeHTML(parejaA.nombre)}
                    </span>

                    <strong>
                        VS
                    </strong>

                    <span>
                        ${escapeHTML(parejaB.nombre)}
                    </span>

                </div>


                <div class="selector-cancha-partido">

                    <label>
                        Cancha
                    </label>

                    <select class="cancha">

                        <option value="">
                            Seleccionar cancha
                        </option>

                        ${opcionesCanchas}

                    </select>

                </div>

            </div>


            <div class="resultado-inputs">

                <input
                    type="number"
                    min="0"
                    class="resultado-a"
                    placeholder="0"
                    value="${resultado?.a ?? ""}"
                    ${resultado ? "disabled" : ""}
                >

                <span>
                    -
                </span>

                <input
                    type="number"
                    min="0"
                    class="resultado-b"
                    placeholder="0"
                    value="${resultado?.b ?? ""}"
                    ${resultado ? "disabled" : ""}
                >

                <button
                    type="button"
                    class="btn-guardar-resultado"
                    ${resultado ? "disabled" : ""}
                >
                    ${
                        resultado
                            ? "Resultado cargado"
                            : "Guardar"
                    }
                </button>

            </div>

        `;


        // CANCHA

        const selectCancha =
            div.querySelector(".cancha");


        selectCancha?.addEventListener(
            "change",
            () => {

                partido.cancha =
                    selectCancha.value
                        ? Number(selectCancha.value)
                        : null;


                guardarTorneoActual();

            }
        );


        // RESULTADO

        const boton =
            div.querySelector(
                ".btn-guardar-resultado"
            );


        boton?.addEventListener(
            "click",
            () => {

                const inputA =
                    div.querySelector(".resultado-a");

                const inputB =
                    div.querySelector(".resultado-b");


                const a =
                    Number(inputA.value);

                const b =
                    Number(inputB.value);


                if (!partido.cancha) {

                    mostrarMensaje(
                        "Seleccioná una cancha.",
                        "error"
                    );

                    return;
                }


                if (
                    !Number.isInteger(a) ||
                    !Number.isInteger(b)
                ) {

                    mostrarMensaje(
                        "Ingresá games/sets válidos.",
                        "error"
                    );

                    return;
                }


                const validacion =
                    validarResultado(
                        a,
                        b,
                        torneoActual.modalidad
                    );


                if (!validacion.valido) {

                    mostrarMensaje(
                        validacion.mensaje,
                        "error"
                    );

                    return;
                }


                guardarResultadoPartido(
                    partido,
                    a,
                    b
                );

            }
        );


        contenedor.appendChild(div);
    }

    // ========================================================
    // VALIDAR RESULTADO
    // ========================================================

    function validarResultado(
        a,
        b,
        modalidad
    ) {

        // ==============================================
        // 9 GAMES
        // ==============================================

        if (modalidad === "9_games") {

            if (a < 0 || b < 0) {

                return {
                    valido: false,
                    mensaje: "Los games no pueden ser negativos."
                };
            }


            // UNO TIENE QUE LLEGAR A 9

            if (a !== 9 && b !== 9) {

                return {
                    valido: false,
                    mensaje:
                        "El partido a 9 games termina cuando una pareja llega a 9. Ejemplo válido: 9-7."
                };
            }


            // No puede ser 9-9

            if (a === 9 && b === 9) {

                return {
                    valido: false,
                    mensaje:
                        "El resultado 9-9 no es válido."
                };
            }


            // El rival no puede tener más de 8

            if (
                (a === 9 && b > 8) ||
                (b === 9 && a > 8)
            ) {

                return {
                    valido: false,
                    mensaje:
                        "Si una pareja llega a 9, la otra debe tener como máximo 8."
                };
            }


            return {
                valido: true
            };
        }


        // ==============================================
        // 2 SETS + SUPER TIE BREAK
        // ==============================================

        if (
            modalidad ===
            "2_sets_supertiebreak"
        ) {

            return validarFormatoSets(a, b);
        }


        // ==============================================
        // PARTIDO COMPLETO
        // ==============================================

        if (
            modalidad ===
            "partido_completo"
        ) {

            return validarFormatoSets(a, b);
        }


        return {
            valido: false,
            mensaje: "Modalidad de torneo inválida."
        };
    }

    // ========================================================
    // VALIDAR SETS
    // ========================================================

    function validarFormatoSets(a, b) {

        /*
         * Para las modalidades con sets,
         * se espera:
         *
         * 2-0
         * 2-1
         * 0-2
         * 1-2
         */

        if (
            !Number.isInteger(a) ||
            !Number.isInteger(b)
        ) {

            return {
                valido: false,
                mensaje: "Ingresá sets completos."
            };
        }


        if (a < 0 || b < 0) {

            return {
                valido: false,
                mensaje: "Los sets no pueden ser negativos."
            };
        }


        if (a === b) {

            return {
                valido: false,
                mensaje:
                    "Un partido no puede terminar empatado."
            };
        }


        if (
            a > 2 ||
            b > 2
        ) {

            return {
                valido: false,
                mensaje:
                    "El máximo de sets ganados es 2."
            };
        }


        if (
            a === 2 &&
            b === 2
        ) {

            return {
                valido: false,
                mensaje:
                    "2-2 no es un resultado final."
            };
        }


        if (
            a === 1 &&
            b === 0
        ) {

            return {
                valido: false,
                mensaje:
                    "1-0 no es un partido terminado. Falta definir el segundo set."
            };
        }


        if (
            a === 0 &&
            b === 1
        ) {

            return {
                valido: false,
                mensaje:
                    "0-1 no es un partido terminado. Falta definir el segundo set."
            };
        }


        return {
            valido: true
        };
    }

    // ========================================================
    // GUARDAR RESULTADO
    // ========================================================

    function guardarResultadoPartido(
        partido,
        a,
        b
    ) {

        partido.resultado = {
            a,
            b
        };


        partido.ganador =
            a > b
                ? partido.parejaA
                : partido.parejaB;


        actualizarTablas();

        guardarTorneoActual();

        mostrarTorneoGenerado();


        mostrarMensaje(
            "Resultado guardado correctamente.",
            "success"
        );
    }

    // ========================================================
    // TABLAS
    // ========================================================

    function actualizarTablas() {

        grupos.forEach(grupo => {

            grupo.parejas.forEach(pareja => {

                pareja.puntos = 0;
                pareja.pj = 0;
                pareja.dg = 0;

            });

        });


        partidos
            .filter(
                partido =>
                    partido.fase === "grupos" &&
                    partido.resultado
            )
            .forEach(partido => {

                const parejaA =
                    buscarPareja(
                        partido.parejaA
                    );

                const parejaB =
                    buscarPareja(
                        partido.parejaB
                    );


                if (!parejaA || !parejaB) {
                    return;
                }


                parejaA.pj++;
                parejaB.pj++;


                const a =
                    partido.resultado.a;

                const b =
                    partido.resultado.b;


                parejaA.dg +=
                    a - b;

                parejaB.dg +=
                    b - a;


                if (a > b) {

                    parejaA.puntos += 2;

                } else {

                    parejaB.puntos += 2;

                }

            });


        grupos.forEach(
            ordenarGrupo
        );


        mostrarZonas();

        mostrarTablas();

        mostrarClasificados();

        mostrarEliminacion();

        actualizarEstadisticas();

        guardarTorneoActual();
    }

    // ========================================================
    // ORDENAR GRUPO
    // ========================================================

    function ordenarGrupo(grupo) {

        grupo.parejas.sort(
            (a, b) => {

                // PUNTOS

                if (
                    b.puntos !==
                    a.puntos
                ) {

                    return (
                        b.puntos -
                        a.puntos
                    );
                }


                // DIFERENCIA

                if (
                    b.dg !==
                    a.dg
                ) {

                    return (
                        b.dg -
                        a.dg
                    );
                }


                // PARTIDOS GANADOS
                // como último criterio

                return (
                    b.pj -
                    a.pj
                );

            }
        );
    }

    // ========================================================
    // MOSTRAR TABLAS
    // ========================================================

    function mostrarTablas() {

        if (!contenedorTablas) return;

        contenedorTablas.innerHTML = "";


        grupos.forEach(grupo => {

            ordenarGrupo(grupo);


            const tabla =
                document.createElement("div");

            tabla.className =
                "tabla-posicion";


            tabla.innerHTML = `

                <div class="tabla-posicion-header">

                    <h3>
                        ${grupo.nombre}
                    </h3>

                </div>

                <div class="tabla-posicion-fila encabezado">

                    <span>#</span>
                    <span>Pareja</span>
                    <span>PJ</span>
                    <span>PTS</span>
                    <span>DG</span>

                </div>

                ${grupo.parejas.map((pareja, index) => `

                    <div class="tabla-posicion-fila">

                        <span>
                            ${index + 1}
                        </span>

                        <span>
                            ${escapeHTML(pareja.nombre)}
                        </span>

                        <span>
                            ${pareja.pj || 0}
                        </span>

                        <span>
                            ${pareja.puntos || 0}
                        </span>

                        <span>
                            ${pareja.dg || 0}
                        </span>

                    </div>

                `).join("")}

            `;


            contenedorTablas.appendChild(tabla);

        });
    }

    // ========================================================
    // CLASIFICADOS
    // ========================================================

    function obtenerClasificados() {

        if (!torneoActual) {
            return [];
        }


        const clasificados = [];


        grupos.forEach(grupo => {

            ordenarGrupo(grupo);


            grupo.parejas
                .slice(
                    0,
                    torneoActual.clasificadosPorZona
                )
                .forEach((pareja, index) => {

                    clasificados.push({

                        pareja,

                        posicion: index + 1,

                        zona: grupo.nombre

                    });

                });

        });


        // ============================================
        // MEJORES TERCEROS
        // ============================================

        if (
            torneoActual.mejoresTerceros > 0
        ) {

            const terceros = [];


            grupos.forEach(grupo => {

                const tercero =
                    grupo.parejas[2];


                if (tercero) {

                    terceros.push({

                        pareja: tercero,

                        posicion: 3,

                        zona: grupo.nombre

                    });

                }

            });


            terceros.sort(
                (a, b) => {

                    if (
                        b.pareja.puntos !==
                        a.pareja.puntos
                    ) {

                        return (
                            b.pareja.puntos -
                            a.pareja.puntos
                        );
                    }


                    return (
                        b.pareja.dg -
                        a.pareja.dg
                    );

                }
            );


            terceros
                .slice(
                    0,
                    torneoActual.mejoresTerceros
                )
                .forEach(
                    tercero =>
                        clasificados.push(
                            tercero
                        )
                );

        }


        return clasificados;
    }

    // ========================================================
    // MOSTRAR CLASIFICADOS
    // ========================================================

    function mostrarClasificados() {

        if (!listaClasificados) return;


        const clasificados =
            obtenerClasificados();


        listaClasificados.innerHTML = "";


        if (!clasificados.length) {

            listaClasificados.innerHTML = `
                <div class="sin-parejas">
                    Todavía no hay clasificados.
                </div>
            `;

            return;
        }


        clasificados.forEach(
            (item, index) => {

                const div =
                    document.createElement("div");

                div.className =
                    "clasificado-item";


                div.innerHTML = `

                    <div>

                        <strong>
                            ${index + 1}°
                        </strong>

                        <span>
                            ${escapeHTML(
                                item.pareja.nombre
                            )}
                        </span>

                    </div>

                    <small>
                        ${item.zona}
                        -
                        ${item.posicion}°
                    </small>

                `;


                listaClasificados.appendChild(div);

            }
        );
    }

    // ========================================================
    // ELIMINACION
    // ========================================================

    function mostrarEliminacion() {

        if (!cuadroEliminacion) return;


        cuadroEliminacion.innerHTML = "";


        if (!torneoActual) return;


        const pendientes =
            partidos.filter(
                partido =>
                    partido.fase === "grupos" &&
                    !partido.resultado
            );


        if (pendientes.length > 0) {

            cuadroEliminacion.innerHTML = `

                <div class="aviso-eliminacion">

                    <h3>
                        🕐 Fase de grupos en curso
                    </h3>

                    <p>
                        Faltan
                        <strong>
                            ${pendientes.length}
                        </strong>
                        partidos.
                    </p>

                    <p>
                        Cuando terminen todos los partidos,
                        se habilitarán los cruces.
                    </p>

                </div>

            `;

            return;
        }


        const clasificados =
            obtenerClasificados();


        if (clasificados.length < 2) {

            cuadroEliminacion.innerHTML = `
                <div class="aviso-eliminacion">
                    No hay suficientes clasificados.
                </div>
            `;

            return;
        }


        totalClasificados.textContent =
            clasificados.length;


        generarPrimeraRonda(
            clasificados
        );
    }

    // ========================================================
    // GENERAR PRIMERA RONDA
    // ========================================================

    function generarPrimeraRonda(
        clasificados
    ) {

        const cantidad =
            clasificados.length;


        const ronda =
            obtenerNombreRonda(cantidad);


        const partidosRonda =
            obtenerPartidosRonda(ronda);


        // Si todavía no existen
        // crear cruces

        if (!partidosRonda.length) {

            const cruces =
                crearCrucesIniciales(
                    clasificados
                );


            cruces.forEach(cruce => {

                partidos.push({

                    id:
                        `eliminacion_${ronda}_${cruce.a.id}_${cruce.b.id}`,

                    fase:
                        ronda,

                    parejaA:
                        cruce.a.id,

                    parejaB:
                        cruce.b.id,

                    cancha: null,

                    resultado: null,

                    ganador: null

                });

            });


            guardarTorneoActual();

        }


        mostrarTodasLasRondas();
    }

    // ========================================================
    // CREAR CRUCES
    // ========================================================

    function crearCrucesIniciales(
        clasificados
    ) {

        const cruces = [];


        /*
         * Intentamos enfrentar:
         *
         * 1° de una zona
         * contra
         * 2° de otra zona
         *
         * evitando, cuando sea posible,
         * que sean de la misma zona.
         */


        const usados =
            new Set();


        for (
            let i = 0;
            i < clasificados.length;
            i++
        ) {

            if (usados.has(i)) {
                continue;
            }


            let encontrado = -1;


            for (
                let j = i + 1;
                j < clasificados.length;
                j++
            ) {

                if (usados.has(j)) {
                    continue;
                }


                if (
                    clasificados[i].zona !==
                    clasificados[j].zona
                ) {

                    encontrado = j;

                    break;
                }

            }


            if (encontrado === -1) {

                for (
                    let j = i + 1;
                    j < clasificados.length;
                    j++
                ) {

                    if (!usados.has(j)) {

                        encontrado = j;

                        break;
                    }

                }

            }


            if (encontrado !== -1) {

                cruces.push({

                    a:
                        clasificados[i].pareja,

                    b:
                        clasificados[encontrado].pareja

                });


                usados.add(i);
                usados.add(encontrado);

            }

        }


        return cruces;
    }

    // ========================================================
    // MOSTRAR TODAS LAS RONDAS
    // ========================================================

    function mostrarTodasLasRondas() {

        if (!cuadroEliminacion) return;


        cuadroEliminacion.innerHTML = "";


        const orden = [

            "Ronda de 32",
            "Octavos de final",
            "Cuartos de final",
            "Semifinal",
            "Final"

        ];


        orden.forEach(ronda => {

            const lista =
                partidos.filter(
                    partido =>
                        partido.fase === ronda
                );


            if (!lista.length) {
                return;
            }


            const titulo =
                document.createElement("h3");

            titulo.textContent =
                ronda;


            const contenedor =
                document.createElement("div");

            contenedor.className =
                "cruces";


            lista.forEach(
                (partido, index) => {

                    const numero =
                        document.createElement(
                            "div"
                        );

                    numero.className =
                        "partido-numero";

                    numero.textContent =
                        `Partido ${index + 1}`;


                    contenedor.appendChild(
                        numero
                    );


                    crearPartidoEliminacion(
                        partido,
                        contenedor
                    );

                }
            );


            cuadroEliminacion.appendChild(
                titulo
            );

            cuadroEliminacion.appendChild(
                contenedor
            );

        });


        comprobarCampeon();
    }

    // ========================================================
    // PARTIDO ELIMINACION
    // ========================================================

    function crearPartidoEliminacion(
        partido,
        contenedor
    ) {

        const parejaA =
            buscarPareja(
                partido.parejaA
            );

        const parejaB =
            buscarPareja(
                partido.parejaB
            );


        if (!parejaA || !parejaB) {
            return;
        }


        const div =
            document.createElement("div");

        div.className =
            "partido-card";


        div.innerHTML = `

            <div class="partido-info">

                <span>
                    ${escapeHTML(parejaA.nombre)}
                </span>

                <strong>
                    VS
                </strong>

                <span>
                    ${escapeHTML(parejaB.nombre)}
                </span>

            </div>


            <div class="selector-cancha-partido">

                <label>
                    Cancha
                </label>

                <select class="cancha">

                    <option value="">
                        Seleccionar cancha
                    </option>

                    ${canchas.map(cancha => {

                        const id =
                            cancha.id_cancha ??
                            cancha.id ??
                            cancha.idCancha;

                        const nombre =
                            cancha.nombre ??
                            cancha.nombre_cancha ??
                            `Cancha ${id}`;

                        return `

                            <option
                                value="${id}"
                                ${Number(partido.cancha) === Number(id)
                                    ? "selected"
                                    : ""}
                            >
                                ${escapeHTML(nombre)}
                            </option>

                        `;

                    }).join("")}

                </select>

            </div>


            <div class="resultado-inputs">

                <input
                    type="number"
                    min="0"
                    class="resultado-a"
                    value="${partido.resultado?.a ?? ""}"
                    ${partido.resultado ? "disabled" : ""}
                >

                <span>
                    -
                </span>

                <input
                    type="number"
                    min="0"
                    class="resultado-b"
                    value="${partido.resultado?.b ?? ""}"
                    ${partido.resultado ? "disabled" : ""}
                >

                <button
                    type="button"
                    ${partido.resultado ? "disabled" : ""}
                >
                    ${
                        partido.resultado
                            ? "Resultado cargado"
                            : "Guardar"
                    }
                </button>

            </div>

        `;


        const select =
            div.querySelector(".cancha");


        select?.addEventListener(
            "change",
            () => {

                partido.cancha =
                    select.value
                        ? Number(select.value)
                        : null;

                guardarTorneoActual();

            }
        );


        const boton =
            div.querySelector("button");


        boton?.addEventListener(
            "click",
            () => {

                const a =
                    Number(
                        div.querySelector(
                            ".resultado-a"
                        ).value
                    );

                const b =
                    Number(
                        div.querySelector(
                            ".resultado-b"
                        ).value
                    );


                if (!partido.cancha) {

                    mostrarMensaje(
                        "Seleccioná una cancha.",
                        "error"
                    );

                    return;
                }


                const validacion =
                    validarResultado(
                        a,
                        b,
                        torneoActual.modalidad
                    );


                if (!validacion.valido) {

                    mostrarMensaje(
                        validacion.mensaje,
                        "error"
                    );

                    return;
                }


                partido.resultado = {
                    a,
                    b
                };


                partido.ganador =
                    a > b
                        ? partido.parejaA
                        : partido.parejaB;


                guardarTorneoActual();


                avanzarEliminacion(
                    partido
                );

            }
        );


        contenedor.appendChild(div);
    }

    // ========================================================
    // AVANZAR ELIMINACION
    // ========================================================

    function avanzarEliminacion(
        partido
    ) {

        const ronda =
            partido.fase;


        const partidosRonda =
            obtenerPartidosRonda(
                ronda
            );


        const todosTerminados =
            partidosRonda.length > 0 &&
            partidosRonda.every(
                p =>
                    p.resultado &&
                    p.ganador
            );


        if (!todosTerminados) {

            guardarTorneoActual();

            mostrarTodasLasRondas();

            return;
        }


        const ganadores =
            partidosRonda
                .map(
                    p =>
                        buscarPareja(
                            p.ganador
                        )
                )
                .filter(Boolean);


        // ==========================================
        // CAMPEÓN
        // ==========================================

        if (ganadores.length === 1) {

            torneoActual.estado =
                "finalizado";

            torneoActual.campeon =
                ganadores[0].id;


            guardarTorneoActual();

            mostrarCampeon(
                ganadores[0]
            );

            return;
        }


        const siguiente =
            siguienteRonda(
                ronda
            );


        // Si ya hay siguiente ronda,
        // no duplicarla

        const existentes =
            obtenerPartidosRonda(
                siguiente
            );


        if (!existentes.length) {

            for (
                let i = 0;
                i < ganadores.length;
                i += 2
            ) {

                const a =
                    ganadores[i];

                const b =
                    ganadores[i + 1];


                if (!a || !b) {
                    continue;
                }


                partidos.push({

                    id:
                        `eliminacion_${siguiente}_${a.id}_${b.id}_${Date.now()}`,

                    fase:
                        siguiente,

                    parejaA:
                        a.id,

                    parejaB:
                        b.id,

                    cancha:
                        null,

                    resultado:
                        null,

                    ganador:
                        null

                });

            }

        }


        guardarTorneoActual();


        mostrarTodasLasRondas();
    }

    // ========================================================
    // RONDAS
    // ========================================================

    function obtenerNombreRonda(
        cantidad
    ) {

        if (cantidad <= 2) {
            return "Final";
        }

        if (cantidad <= 4) {
            return "Semifinal";
        }

        if (cantidad <= 8) {
            return "Cuartos de final";
        }

        if (cantidad <= 16) {
            return "Octavos de final";
        }

        return "Ronda de 32";
    }


    function siguienteRonda(
        ronda
    ) {

        const mapa = {

            "Ronda de 32":
                "Octavos de final",

            "Octavos de final":
                "Cuartos de final",

            "Cuartos de final":
                "Semifinal",

            "Semifinal":
                "Final"

        };


        return mapa[ronda] || "Final";
    }


    function obtenerPartidosRonda(
        ronda
    ) {

        return partidos.filter(
            partido =>
                partido.fase === ronda
        );
    }

    // ========================================================
    // CAMPEÓN
    // ========================================================

    function comprobarCampeon() {

        if (!torneoActual?.campeon) {
            return;
        }


        const pareja =
            buscarPareja(
                torneoActual.campeon
            );


        if (!pareja) {
            return;
        }


        mostrarCampeon(pareja);
    }


    function mostrarCampeon(
        pareja
    ) {

        if (!seccionCampeon) return;


        seccionCampeon.classList.remove(
            "oculto"
        );


        if (nombreCampeon) {

            nombreCampeon.textContent =
                pareja.nombre;

        }


        seccionCampeon.scrollIntoView({
            behavior: "smooth"
        });
    }

    // ========================================================
    // BUSCAR PAREJA
    // ========================================================

    function buscarPareja(id) {

        return parejas.find(
            pareja =>
                Number(pareja.id) ===
                Number(id)
        );
    }

    // ========================================================
    // GUARDAR TORNEO
    // ========================================================

    function obtenerClaveTorneo() {

        if (!torneoActual?.id) {
            return null;
        }


        return `clubDeportivo_torneo_${torneoActual.id}`;
    }


    function guardarTorneoActual() {

        if (!torneoActual) {
            return;
        }


        const clave =
            obtenerClaveTorneo();


        if (!clave) return;


        const datos = {

            torneo: torneoActual,

            grupos,

            partidos

        };


        localStorage.setItem(
            clave,
            JSON.stringify(datos)
        );


        // Guardar como último torneo
        localStorage.setItem(
            "clubDeportivo_ultimoTorneo",
            torneoActual.id
        );


        // Guardar índice
        const indice =
            JSON.parse(
                localStorage.getItem(
                    "clubDeportivo_torneos"
                )
            ) || [];


        const existe =
            indice.some(
                torneo =>
                    torneo.id ===
                    torneoActual.id
            );


        if (!existe) {

            indice.push({

                id:
                    torneoActual.id,

                nombre:
                    torneoActual.nombre,

                categoria:
                    torneoActual.categoria,

                modalidad:
                    torneoActual.modalidad,

                creado:
                    torneoActual.creado,

                estado:
                    torneoActual.estado

            });


            localStorage.setItem(
                "clubDeportivo_torneos",
                JSON.stringify(indice)
            );

        }
    }

    // ========================================================
    // CARGAR ÚLTIMO TORNEO
    // ========================================================

    function cargarUltimoTorneo() {

        const ultimo =
            localStorage.getItem(
                "clubDeportivo_ultimoTorneo"
            );


        if (!ultimo) {

            mostrarParejas();

            return;
        }


        const datos =
            localStorage.getItem(
                `clubDeportivo_torneo_${ultimo}`
            );


        if (!datos) {

            mostrarParejas();

            return;
        }


        try {

            const guardado =
                JSON.parse(datos);


            torneoActual =
                guardado.torneo;


            grupos =
                guardado.grupos || [];


            partidos =
                guardado.partidos || [];


            // Cargar datos del formulario

            nombreTorneoInput.value =
                torneoActual.nombre || "";


            categoriaTorneoInput.value =
                torneoActual.categoria || "";


            tipoTorneoInput.value =
                torneoActual.modalidad || "";


            cantidadParejasInput.value =
                torneoActual.cantidadParejas || "";


            cantidadGruposInput.value =
                torneoActual.cantidadZonas || "";


            clasificadosInput.value =
                torneoActual.clasificadosPorZona || 2;


            mejoresTercerosInput.value =
                torneoActual.mejoresTerceros || 0;


            sincronizarCategoriaPareja();

            actualizarDescripcionModalidad();

            actualizarContador();

            actualizarConfiguracionZonas();

            actualizarResumen();


            if (grupos.length) {

                mostrarTorneoGenerado();

            } else {

                mostrarPaso(1);

            }


        } catch (error) {

            console.error(
                "Error cargando torneo:",
                error
            );

        }


        mostrarParejas();
    }

    // ========================================================
    // NUEVO TORNEO
    // ========================================================

    function abrirModalNuevoTorneo() {

        if (!modalNuevoTorneo) return;

        modalNuevoTorneo.classList.add("activo");

        modalNuevoTorneo.style.display = "flex";
    }


    function cerrarModalNuevoTorneo() {

        if (!modalNuevoTorneo) return;

        modalNuevoTorneo.classList.remove("activo");

        modalNuevoTorneo.style.display = "none";
    }


    function crearNuevoTorneo() {

        cerrarModalNuevoTorneo();


        torneoActual = null;

        grupos = [];

        partidos = [];


        // Limpiar formulario

        nombreTorneoInput.value = "";

        categoriaTorneoInput.value = "";

        tipoTorneoInput.value = "";

        cantidadParejasInput.value = "";

        cantidadGruposInput.value = "";

        clasificadosInput.value = "";

        mejoresTercerosInput.value = "0";


        sincronizarCategoriaPareja();


        if (jugador1Input) {
            jugador1Input.value = "";
        }

        if (jugador2Input) {
            jugador2Input.value = "";
        }


        // Ocultar torneo generado

        [
            informacionTorneo,
            seccionResultados,
            seccionTablas,
            seccionClasificados,
            seccionEliminacion,
            seccionCampeon
        ].forEach(elemento => {

            elemento?.classList.add(
                "oculto"
            );

        });


        if (contenedorZonas) {
            contenedorZonas.innerHTML = "";
        }


        if (contenedorPartidos) {
            contenedorPartidos.innerHTML = "";
        }


        if (contenedorTablas) {
            contenedorTablas.innerHTML = "";
        }


        if (listaClasificados) {
            listaClasificados.innerHTML = "";
        }


        if (cuadroEliminacion) {
            cuadroEliminacion.innerHTML = "";
        }


        actualizarDescripcionModalidad();

        actualizarContador();

        actualizarConfiguracionZonas();

        actualizarResumen();

        mostrarPaso(1);


        mostrarMensaje(
            "Configuración lista para crear un nuevo torneo.",
            "success"
        );
    }

    // ========================================================
    // ESTADISTICAS
    // ========================================================

    function actualizarEstadisticas() {

        if (!torneoActual) return;


        if (totalParejas) {

            totalParejas.textContent =
                torneoActual.cantidadParejas;

        }


        if (totalGrupos) {

            totalGrupos.textContent =
                grupos.length;

        }


        if (totalClasificados) {

            totalClasificados.textContent =
                obtenerClasificados().length;

        }
    }

    // ========================================================
    // MENSAJES
    // ========================================================

    function mostrarMensaje(
        texto,
        tipo = "info"
    ) {

        if (!mensaje) {

            alert(texto);

            return;
        }


        mensaje.textContent =
            texto;


        mensaje.className =
            `mensaje ${tipo}`;


        mensaje.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });


        setTimeout(() => {

            mensaje.textContent = "";

            mensaje.className =
                "mensaje";

        }, 5000);
    }

    // ========================================================
    // SEGURIDAD HTML
    // ========================================================

    function escapeHTML(texto) {

        if (texto === null ||
            texto === undefined) {

            return "";
        }


        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ========================================================
    // FINAL
    // ========================================================

    mostrarParejas();

});