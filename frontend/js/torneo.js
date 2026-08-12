// =====================================================
// TORNEOS DE PADEL - CLUB DEPORTIVO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTOS DEL HTML
    // =====================================================

    const cantidadParejasInput =
        document.getElementById("cantidadParejas");

    const cantidadGruposInput =
        document.getElementById("cantidadGrupos");

    const contenedorConfiguracionZonas =
        document.getElementById("contenedorConfiguracionZonas");

    const parejasPorGrupoInput =
        document.getElementById("parejasPorGrupo");

    const clasificadosPorGrupoInput =
        document.getElementById("clasificadosPorGrupo");

    const mejoresTercerosInput =
        document.getElementById("cantidadMejoresTerceros") ||
        document.getElementById("mejoresTerceros");

    const formatoTorneoInput =
        document.getElementById("tipoTorneo") ||
        document.getElementById("formatoTorneo");

    const categoriaTorneoInput =
        document.getElementById("categoriaTorneo");

    const categoriaParejaInput =
        document.getElementById("categoriaPareja");

    const btnAgregarPareja =
        document.getElementById("btnAgregarPareja");

    const btnGenerar =
        document.getElementById("btnGenerar");

    const btnNuevoTorneo =
        document.getElementById("btnNuevoTorneo");

    const listaParejas =
        document.getElementById("listaParejas");

    const contadorParejas =
        document.getElementById("contadorParejas");

    const contenedorZonas =
        document.getElementById("contenedorZonas");

    const cuadroEliminacion =
        document.getElementById("cuadroEliminacion");

    const informacionTorneo =
        document.getElementById("informacionTorneo");

    const seccionEliminacion =
        document.getElementById("seccionEliminacion");

    const totalParejas =
        document.getElementById("totalParejas");

    const totalGrupos =
        document.getElementById("totalGrupos");

    const totalClasificados =
        document.getElementById("totalClasificados");

    const mensaje =
        document.getElementById("mensaje");

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

    const nombreFormatoTorneo =
        document.getElementById("nombreFormatoTorneo");


    // =====================================================
    // VARIABLES
    // =====================================================

    let parejas = [];

    let grupos = [];

    let partidos = [];

    let cantidadParejas = 0;

    let cantidadGrupos = 0;

    let parejasPorGrupo = 4;

    let clasificadosPorGrupo = 2;

    let mejoresTerceros = 0;

    let formatoTorneo = "9_games";

    let categoriaTorneo = "";

    let parejasTorneoActual = [];

    let torneoGenerado = false;

    let zonasPersonalizadas = [];

    let canchas = [];


    // =====================================================
    // CLAVES DE LOCALSTORAGE
    // =====================================================

    const CLAVE_PAREJAS =
        "parejasClubDeportivo";

    const CLAVE_TORNEO_GENERAL =
        "torneoClubDeportivo";


    // =====================================================
    // NOMBRES DE GRUPOS
    // =====================================================

    const letrasGrupos = [
        "A", "B", "C", "D",
        "E", "F", "G", "H",
        "I", "J", "K", "L",
        "M", "N", "O", "P",
        "Q", "R", "S", "T",
        "U", "V", "W", "X",
        "Y", "Z"
    ];


    // =====================================================
    // INICIALIZAR
    // =====================================================

    cargarParejasGlobales();

    cargarCanchas().then(() => {

        cargarTorneo();

        actualizarContador();

        actualizarResumen();

    });


    // =====================================================
    // EVENTOS DE CONFIGURACIÓN
    // =====================================================

    if (categoriaTorneoInput) {

        categoriaTorneoInput.addEventListener("change", () => {

            cargarTorneoPorCategoria();

        });

    }


    if (categoriaParejaInput) {

        categoriaParejaInput.addEventListener("change", () => {

            mostrarParejas();

        });

    }


    if (cantidadParejasInput) {

        cantidadParejasInput.addEventListener("input", () => {

            actualizarContador();

            actualizarResumen();

            guardarDatos();

        });

    }


    if (cantidadGruposInput) {

        cantidadGruposInput.addEventListener("input", () => {

            crearConfiguracionZonas(true);

            actualizarResumen();

            guardarDatos();

        });

    }


    if (clasificadosPorGrupoInput) {

        clasificadosPorGrupoInput.addEventListener("input", () => {

            actualizarResumen();

            guardarDatos();

        });

    }


    if (mejoresTercerosInput) {

        mejoresTercerosInput.addEventListener("input", () => {

            actualizarResumen();

            guardarDatos();

        });

    }


    if (formatoTorneoInput) {

        formatoTorneoInput.addEventListener("change", () => {

            actualizarResumen();

            guardarDatos();

        });

    }


    // =====================================================
    // CARGAR CANCHAS DESDE LA BASE DE DATOS
    // =====================================================

    async function cargarCanchas() {

        try {

            const respuesta =
                await fetch("http://localhost:3000/api/canchas");


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudieron cargar las canchas"
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


    // =====================================================
    // CONFIGURAR ZONAS PERSONALIZADAS
    // =====================================================

    function crearConfiguracionZonas(recrear) {

        if (!contenedorConfiguracionZonas || !cantidadGruposInput) {
            return;
        }


        const nuevaCantidad =
            parseInt(cantidadGruposInput.value) || 0;


        contenedorConfiguracionZonas.innerHTML = "";


        if (nuevaCantidad <= 0) {

            zonasPersonalizadas = [];


            contenedorConfiguracionZonas.innerHTML = `
                <div class="sin-parejas">
                    Ingresá la cantidad de zonas para configurarlas.
                </div>
            `;


            return;

        }


        if (
            recrear ||
            zonasPersonalizadas.length !== nuevaCantidad
        ) {

            const zonasAnteriores =
                [...zonasPersonalizadas];


            zonasPersonalizadas = [];


            for (let i = 0; i < nuevaCantidad; i++) {

                const nombreZona =
                    `Grupo ${letrasGrupos[i] || i + 1}`;


                zonasPersonalizadas.push({

                    nombre:
                        nombreZona,

                    cantidad:
                        zonasAnteriores[i]?.cantidad || 3

                });

            }

        }


        zonasPersonalizadas.forEach((zona, index) => {

            const div =
                document.createElement("div");


            div.className =
                "zona-config";


            div.innerHTML = `

                <label>
                    ${zona.nombre}
                </label>

                <select class="select-zona-personalizada" data-index="${index}">
                    <option value="3" ${zona.cantidad === 3 ? "selected" : ""}>
                        3 parejas
                    </option>

                    <option value="4" ${zona.cantidad === 4 ? "selected" : ""}>
                        4 parejas
                    </option>
                </select>

            `;


            contenedorConfiguracionZonas.appendChild(div);

        });


        document
            .querySelectorAll(".select-zona-personalizada")
            .forEach(select => {

                select.addEventListener("change", () => {

                    const index =
                        parseInt(select.dataset.index);


                    zonasPersonalizadas[index].cantidad =
                        parseInt(select.value);


                    actualizarResumen();

                    guardarDatos();

                });

            });

    }


    function obtenerTotalParejasZonas() {

        return zonasPersonalizadas.reduce(
            (total, zona) => total + zona.cantidad,
            0
        );

    }


    function validarZonasPersonalizadas() {

        if (!zonasPersonalizadas || zonasPersonalizadas.length === 0) {

            alert("Primero configurá las zonas del torneo.");

            return false;

        }


        const totalZonas =
            obtenerTotalParejasZonas();


        if (totalZonas !== cantidadParejas) {

            alert(
                `La suma de parejas por zona no coincide con el total del torneo.\n\nTotal de parejas del torneo: ${cantidadParejas}\nParejas asignadas en zonas: ${totalZonas}`
            );

            return false;

        }


        return true;

    }


    // =====================================================
    // RESUMEN
    // =====================================================

    function actualizarResumen() {

        const cantidadActual =
            parseInt(cantidadParejasInput?.value) || 0;

        const gruposActuales =
            parseInt(cantidadGruposInput?.value) || 0;

        const clasificadosActuales =
            parseInt(clasificadosPorGrupoInput?.value) || 0;

        const formatoActual =
            formatoTorneoInput?.value || "9_games";

        const categoriaActual =
            categoriaTorneoInput?.value || "";


        if (resumenCategoria) {

            resumenCategoria.textContent =
                obtenerNombreCategoria(categoriaActual);

        }


        if (resumenFormato) {

            resumenFormato.textContent =
                obtenerNombreFormato(formatoActual);

        }


        if (resumenParejas) {

            const parejasCategoria =
                obtenerParejasPorCategoria(categoriaActual);


            if (categoriaActual) {

                resumenParejas.textContent =
                    `${parejasCategoria.length} cargadas / ${cantidadActual || 0} necesarias`;

            } else {

                resumenParejas.textContent =
                    cantidadActual || "-";

            }

        }


        if (resumenZonas) {

            const totalAsignado =
                obtenerTotalParejasZonas();


            if (gruposActuales > 0) {

                resumenZonas.textContent =
                    `${gruposActuales} zonas / ${totalAsignado} parejas asignadas`;

            } else {

                resumenZonas.textContent =
                    "-";

            }

        }


        if (resumenClasificados) {

            resumenClasificados.textContent =
                clasificadosActuales || "-";

        }

    }


    // =====================================================
    // AGREGAR PAREJA
    // =====================================================

    if (btnAgregarPareja) {

        btnAgregarPareja.addEventListener("click", () => {

            const categoriaPareja =
                categoriaParejaInput?.value || "";


            if (!categoriaPareja) {

                alert(
                    "Seleccioná la categoría de la pareja."
                );

                return;

            }


            const jugador1NombreCompleto =
                document.getElementById("jugador1NombreCompleto");

            const jugador2NombreCompleto =
                document.getElementById("jugador2NombreCompleto");


            const jugador1Nombre =
                document.getElementById("jugador1Nombre");

            const jugador1Apellido =
                document.getElementById("jugador1Apellido");

            const jugador2Nombre =
                document.getElementById("jugador2Nombre");

            const jugador2Apellido =
                document.getElementById("jugador2Apellido");


            let nombreCompleto1 = "";

            let nombreCompleto2 = "";


            if (
                jugador1NombreCompleto &&
                jugador2NombreCompleto
            ) {

                nombreCompleto1 =
                    jugador1NombreCompleto.value.trim();

                nombreCompleto2 =
                    jugador2NombreCompleto.value.trim();

            } else {

                if (
                    !jugador1Nombre ||
                    !jugador1Apellido ||
                    !jugador2Nombre ||
                    !jugador2Apellido
                ) {

                    alert(
                        "No se encontraron los campos de los jugadores."
                    );

                    return;

                }


                nombreCompleto1 =
                    `${jugador1Nombre.value.trim()} ${jugador1Apellido.value.trim()}`.trim();

                nombreCompleto2 =
                    `${jugador2Nombre.value.trim()} ${jugador2Apellido.value.trim()}`.trim();

            }


            if (
                !nombreCompleto1 ||
                !nombreCompleto2
            ) {

                alert(
                    "Completá nombre y apellido de los dos jugadores."
                );

                return;

            }


            const pareja = {

                id:
                    Date.now(),

                jugador1:
                    nombreCompleto1,

                jugador2:
                    nombreCompleto2,

                nombre:
                    `${nombreCompleto1} / ${nombreCompleto2}`,

                categoria:
                    categoriaPareja,

                grupo:
                    null,

                posicion:
                    null,

                ordenZona:
                    null,

                puntos:
                    0,

                partidosJugados:
                    0,

                diferenciaGames:
                    0

            };


            parejas.push(pareja);


            if (
                jugador1NombreCompleto &&
                jugador2NombreCompleto
            ) {

                jugador1NombreCompleto.value = "";
                jugador2NombreCompleto.value = "";

            } else {

                jugador1Nombre.value = "";
                jugador1Apellido.value = "";
                jugador2Nombre.value = "";
                jugador2Apellido.value = "";

            }


            guardarParejasGlobales();

            mostrarParejas();

            actualizarContador();

            actualizarResumen();

            guardarDatos();

        });

    }


    // =====================================================
    // MOSTRAR PAREJAS FILTRADAS POR CATEGORÍA
    // =====================================================

    function mostrarParejas() {

        if (!listaParejas) {
            return;
        }


        listaParejas.innerHTML = "";


        let parejasParaMostrar =
            [...parejas];


        const categoriaSeleccionada =
            categoriaParejaInput?.value || "";


        if (categoriaSeleccionada) {

            parejasParaMostrar =
                parejas.filter(
                    pareja =>
                        pareja.categoria === categoriaSeleccionada
                );

        }


        if (parejasParaMostrar.length === 0) {

            if (categoriaSeleccionada) {

                listaParejas.innerHTML = `
                    <div class="sin-parejas">
                        Todavía no hay parejas cargadas en ${obtenerNombreCategoria(categoriaSeleccionada)}.
                    </div>
                `;

            } else {

                listaParejas.innerHTML = `
                    <div class="sin-parejas">
                        Seleccioná una categoría para ver las parejas inscriptas.
                    </div>
                `;

            }

            return;

        }


        parejasParaMostrar.forEach((pareja, index) => {

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
                        ${pareja.nombre}
                    </span>

                    <small class="categoria-pareja">
                        ${obtenerNombreCategoria(pareja.categoria)}
                    </small>
                </div>

                <button
                    class="btn-eliminar-pareja"
                    data-id="${pareja.id}"
                    type="button"
                >
                    🗑️
                </button>

            `;


            listaParejas.appendChild(div);

        });


        document
            .querySelectorAll(".btn-eliminar-pareja")
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                btn.dataset.id
                            );


                        parejas =
                            parejas.filter(
                                p => p.id !== id
                            );


                        guardarParejasGlobales();

                        mostrarParejas();

                        actualizarContador();

                        actualizarResumen();

                        guardarDatos();

                    }
                );

            });

    }


    // =====================================================
    // CONTADOR
    // =====================================================

    function actualizarContador() {

        if (!contadorParejas) {
            return;
        }


        const max =
            cantidadParejasInput?.value || 0;


        const categoriaActual =
            categoriaTorneoInput?.value || "";


        if (categoriaActual) {

            const parejasCategoria =
                obtenerParejasPorCategoria(categoriaActual);


            contadorParejas.textContent =
                `${parejasCategoria.length} / ${max}`;

        } else {

            contadorParejas.textContent =
                `${parejas.length} cargadas`;

        }

    }


    // =====================================================
    // GENERAR TORNEO
    // =====================================================

    if (btnGenerar) {

        btnGenerar.addEventListener(
            "click",
            generarTorneo
        );

    }


    function generarTorneo() {

        cantidadParejas =
            parseInt(
                cantidadParejasInput?.value
            );


        cantidadGrupos =
            parseInt(
                cantidadGruposInput?.value
            ) || 0;


        parejasPorGrupo =
            parseInt(
                parejasPorGrupoInput?.value
            ) || 4;


        clasificadosPorGrupo =
            parseInt(
                clasificadosPorGrupoInput?.value
            ) || 2;


        mejoresTerceros =
            parseInt(
                mejoresTercerosInput?.value
            ) || 0;


        formatoTorneo =
            formatoTorneoInput?.value ||
            "9_games";


        categoriaTorneo =
            categoriaTorneoInput?.value ||
            "";


        if (!categoriaTorneo) {

            alert(
                "Seleccioná la categoría del torneo."
            );

            return;

        }


        if (!cantidadParejas || cantidadParejas < 2) {

            alert(
                "Ingresá la cantidad de parejas."
            );

            return;

        }


        parejasTorneoActual =
            obtenerParejasPorCategoria(
                categoriaTorneo
            );


        if (
            parejasTorneoActual.length !== cantidadParejas
        ) {

            alert(
                `Para ${obtenerNombreCategoria(categoriaTorneo)} tenés que cargar exactamente ${cantidadParejas} parejas.\nActualmente hay ${parejasTorneoActual.length} parejas cargadas en esa categoría.`
            );

            return;

        }


        if (!cantidadGrupos || cantidadGrupos < 1) {

            alert(
                "Ingresá la cantidad de zonas."
            );

            return;

        }


        if (
            clasificadosPorGrupo < 1
        ) {

            alert(
                "La cantidad de clasificados por zona no es válida."
            );

            return;

        }


        if (
            mejoresTerceros < 0
        ) {

            alert(
                "La cantidad de mejores terceros no puede ser negativa."
            );

            return;

        }


        if (!validarZonasPersonalizadas()) {
            return;
        }


        grupos = [];

        partidos = [];


        parejasTorneoActual.forEach(pareja => {

            pareja.grupo =
                null;

            pareja.posicion =
                null;

            pareja.ordenZona =
                null;

            pareja.puntos =
                0;

            pareja.partidosJugados =
                0;

            pareja.diferenciaGames =
                0;

        });


        const nombreFormato =
            obtenerNombreFormato(
                formatoTorneo
            );


        const nombreCategoria =
            obtenerNombreCategoria(
                categoriaTorneo
            );


        if (mensaje) {

            mensaje.innerHTML = `
                <strong>Torneo:</strong>
                ${nombreCategoria} - ${nombreFormato}
            `;

        }


        if (nombreFormatoTorneo) {

            nombreFormatoTorneo.textContent =
                `${nombreCategoria} - ${nombreFormato}`;

        }


        crearGrupos();

        mostrarZonas();


        if (informacionTorneo) {

            informacionTorneo.classList.remove(
                "oculto"
            );

        }


        if (seccionEliminacion) {

            seccionEliminacion.classList.remove(
                "oculto"
            );

        }


        if (totalParejas) {

            totalParejas.textContent =
                cantidadParejas;

        }


        if (totalGrupos) {

            totalGrupos.textContent =
                grupos.length;

        }


        torneoGenerado =
            true;


        actualizarResumen();

        guardarDatos();


        if (contenedorZonas) {

            contenedorZonas.scrollIntoView({
                behavior: "smooth"
            });

        }

    }


    // =====================================================
    // CREAR GRUPOS
    // =====================================================

    function crearGrupos() {

        grupos = [];


        const baseParejas =
            parejasTorneoActual.length > 0
                ? parejasTorneoActual
                : obtenerParejasPorCategoria(categoriaTorneo);


        const mezcladas =
            mezclarArray(
                [...baseParejas]
            );


        let indice = 0;


        zonasPersonalizadas.forEach((zonaConfig, numeroGrupo) => {

            const grupo = {

                id:
                    numeroGrupo,

                nombre:
                    zonaConfig.nombre,

                parejas:
                    [],

                clasificados:
                    [],

                tipoZona:
                    zonaConfig.cantidad === 4
                        ? "zona_4"
                        : "zona_3"

            };


            for (
                let i = 0;
                i < zonaConfig.cantidad;
                i++
            ) {

                const pareja =
                    mezcladas[indice];


                if (!pareja) {
                    break;
                }


                pareja.grupo =
                    grupo.nombre;


                pareja.posicion =
                    i + 1;


                pareja.ordenZona =
                    i + 1;


                pareja.puntos =
                    0;


                pareja.partidosJugados =
                    0;


                pareja.diferenciaGames =
                    0;


                grupo.parejas.push(
                    pareja
                );


                indice++;

            }


            grupos.push(
                grupo
            );

        });

    }


    // =====================================================
    // MOSTRAR ZONAS
    // =====================================================

    function mostrarZonas() {

        if (!contenedorZonas) {
            return;
        }


        contenedorZonas.innerHTML = "";


        grupos.forEach(
            grupo => {

                const zona =
                    document.createElement(
                        "div"
                    );


                zona.className =
                    "zona";


                let html = `

                    <div class="zona-header">

                        <div>

                            <span>
                                ZONA
                            </span>

                            <h2>
                                ${grupo.nombre}
                            </h2>

                            <small>
                                ${grupo.tipoZona === "zona_4"
                                    ? "Zona de 4 parejas"
                                    : "Zona de 3 parejas"}
                            </small>

                        </div>

                        <div class="clasifican">
                            Clasifican
                            ${clasificadosPorGrupo}
                        </div>

                    </div>

                    <div class="tabla-zona">

                        <div class="fila encabezado">

                            <span>
                                #
                            </span>

                            <span>
                                Pareja
                            </span>

                            <span>
                                PJ
                            </span>

                            <span>
                                PTS
                            </span>

                            <span>
                                DG
                            </span>

                        </div>

                `;


                grupo.parejas.forEach(
                    (pareja, index) => {

                        html += `

                            <div
                                class="fila"
                                data-pareja="${pareja.id}"
                            >

                                <span>
                                    ${index + 1}
                                </span>

                                <span>
                                    ${pareja.nombre}
                                </span>

                                <span>
                                    ${pareja.partidosJugados || 0}
                                </span>

                                <span>
                                    ${pareja.puntos || 0}
                                </span>

                                <span>
                                    ${pareja.diferenciaGames || 0}
                                </span>

                            </div>

                        `;

                    }
                );


                html += `
                    </div>

                    <div class="partidos-zona">

                        <h3>
                            Partidos
                        </h3>

                        <div
                            id="partidos-${grupo.id}"
                        >
                        </div>

                    </div>
                `;


                zona.innerHTML =
                    html;


                contenedorZonas.appendChild(
                    zona
                );


                generarPartidosZona(
                    grupo
                );

            }
        );

    }


    // =====================================================
    // GENERAR PARTIDOS DE GRUPO
    // =====================================================

    function generarPartidosZona(
        grupo
    ) {

        const contenedor =
            document.getElementById(
                `partidos-${grupo.id}`
            );


        if (!contenedor) {
            return;
        }


        contenedor.innerHTML = "";


        if (grupo.parejas.length === 3) {

            generarTodosContraTodosZona(
                grupo,
                contenedor
            );

            return;

        }


        if (grupo.parejas.length === 4) {

            generarZonaDeCuatro(
                grupo,
                contenedor
            );

            return;

        }


        contenedor.innerHTML = `
            <div class="sin-parejas">
                Esta zona debe tener 3 o 4 parejas.
            </div>
        `;

    }


    // =====================================================
    // ID ÚNICO PARA PARTIDOS DE GRUPO
    // =====================================================

    function crearIdPartidoGrupo(
        grupoId,
        parejaAId,
        parejaBId
    ) {

        const ids =
            [
                parejaAId,
                parejaBId
            ].sort(
                (a, b) => a - b
            );


        return `grupo-${grupoId}-${ids[0]}-${ids[1]}`;

    }


    // =====================================================
    // ZONA DE 3 - TODOS CONTRA TODOS
    // =====================================================

    function generarTodosContraTodosZona(
        grupo,
        contenedor
    ) {

        const parejasOrdenadas =
            [...grupo.parejas].sort(
                (a, b) =>
                    (a.ordenZona || a.posicion) -
                    (b.ordenZona || b.posicion)
            );


        for (
            let i = 0;
            i < parejasOrdenadas.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < parejasOrdenadas.length;
                j++
            ) {

                const parejaA =
                    parejasOrdenadas[i];

                const parejaB =
                    parejasOrdenadas[j];


                const partido = {

                    id:
                        crearIdPartidoGrupo(
                            grupo.id,
                            parejaA.id,
                            parejaB.id
                        ),

                    fase:
                        "grupos",

                    grupo:
                        grupo.id,

                    parejaA:
                        parejaA.id,

                    parejaB:
                        parejaB.id,

                    id_cancha:
                        null,

                    resultado:
                        null,

                    ganador:
                        null

                };


                let partidoGuardado =
                    partidos.find(
                        p =>
                            p.id === partido.id
                    );


                if (!partidoGuardado) {

                    partidos.push(
                        partido
                    );

                    partidoGuardado =
                        partido;

                }


                const div =
                    crearPartidoHTML(
                        partidoGuardado,
                        parejaA,
                        parejaB
                    );


                contenedor.appendChild(
                    div
                );

            }

        }

    }


    // =====================================================
    // ZONA DE 4 - FORMATO ESPECIAL
    // =====================================================

    function generarZonaDeCuatro(
        grupo,
        contenedor
    ) {

        const parejasOrdenadas =
            [...grupo.parejas].sort(
                (a, b) =>
                    (a.ordenZona || a.posicion) -
                    (b.ordenZona || b.posicion)
            );


        const pareja1 =
            parejasOrdenadas[0];

        const pareja2 =
            parejasOrdenadas[1];

        const pareja3 =
            parejasOrdenadas[2];

        const pareja4 =
            parejasOrdenadas[3];


        crearPartidoZona4(
            grupo,
            contenedor,
            `zona4-${grupo.id}-p1`,
            pareja1,
            pareja2,
            "Partido 1"
        );


        crearPartidoZona4(
            grupo,
            contenedor,
            `zona4-${grupo.id}-p2`,
            pareja3,
            pareja4,
            "Partido 2"
        );


        const partido1 =
            partidos.find(
                p =>
                    p.id === `zona4-${grupo.id}-p1`
            );


        const partido2 =
            partidos.find(
                p =>
                    p.id === `zona4-${grupo.id}-p2`
            );


        if (
            partido1 &&
            partido2 &&
            partido1.resultado &&
            partido2.resultado &&
            partido1.ganador &&
            partido2.ganador
        ) {

            const ganador1 =
                obtenerPareja(
                    partido1.ganador
                );


            const perdedor1 =
                obtenerPareja(
                    partido1.ganador === partido1.parejaA
                        ? partido1.parejaB
                        : partido1.parejaA
                );


            const ganador2 =
                obtenerPareja(
                    partido2.ganador
                );


            const perdedor2 =
                obtenerPareja(
                    partido2.ganador === partido2.parejaA
                        ? partido2.parejaB
                        : partido2.parejaA
                );


            crearPartidoZona4(
                grupo,
                contenedor,
                `zona4-${grupo.id}-p3`,
                ganador1,
                perdedor2,
                "Partido 3 - Ganador P1 vs Perdedor P2"
            );


            crearPartidoZona4(
                grupo,
                contenedor,
                `zona4-${grupo.id}-p4`,
                ganador2,
                perdedor1,
                "Partido 4 - Ganador P2 vs Perdedor P1"
            );

        } else {

            partidos =
                partidos.filter(
                    p =>
                        p.id !== `zona4-${grupo.id}-p3` &&
                        p.id !== `zona4-${grupo.id}-p4`
                );


            const aviso =
                document.createElement(
                    "div"
                );


            aviso.className =
                "sin-parejas";


            aviso.innerHTML = `
                Guardá los resultados del Partido 1 y Partido 2
                para que se generen los partidos 3 y 4.
            `;


            contenedor.appendChild(
                aviso
            );

        }

    }


    function crearPartidoZona4(
        grupo,
        contenedor,
        partidoId,
        parejaA,
        parejaB,
        tituloPartido
    ) {

        if (
            !parejaA ||
            !parejaB
        ) {
            return;
        }


        let partido =
            partidos.find(
                p =>
                    p.id === partidoId
            );


        if (!partido) {

            partido = {

                id:
                    partidoId,

                fase:
                    "grupos",

                grupo:
                    grupo.id,

                parejaA:
                    parejaA.id,

                parejaB:
                    parejaB.id,

                id_cancha:
                    null,

                resultado:
                    null,

                ganador:
                    null

            };


            partidos.push(
                partido
            );

        }


        if (
            partido.parejaA !== parejaA.id ||
            partido.parejaB !== parejaB.id
        ) {

            partido.parejaA =
                parejaA.id;

            partido.parejaB =
                parejaB.id;

            partido.id_cancha =
                null;

            partido.resultado =
                null;

            partido.ganador =
                null;

        }


        const titulo =
            document.createElement(
                "div"
            );


        titulo.className =
            "partido-numero";


        titulo.textContent =
            tituloPartido;


        contenedor.appendChild(
            titulo
        );


        const div =
            crearPartidoHTML(
                partido,
                parejaA,
                parejaB
            );


        contenedor.appendChild(
            div
        );

    }


    // =====================================================
    // CREAR HTML PARTIDO CON CANCHA AL LADO
    // =====================================================

    function crearPartidoHTML(
        partido,
        parejaA,
        parejaB
    ) {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "partido-card";


        const guardado =
            partidos.find(
                p =>
                    p.id === partido.id
            );


        const resultado =
            guardado?.resultado;


        const yaJugado =
            resultado !== null &&
            resultado !== undefined;


        const canchaSeleccionada =
            guardado?.id_cancha ||
            partido.id_cancha ||
            "";


        let opcionesCanchas = `
            <option value="">
                Seleccionar cancha
            </option>
        `;


        if (canchas.length === 0) {

            opcionesCanchas += `
                <option value="" disabled>
                    No hay canchas cargadas
                </option>
            `;

        } else {

            canchas.forEach(cancha => {

                opcionesCanchas += `
                    <option 
                        value="${cancha.id_cancha}"
                        ${Number(canchaSeleccionada) === Number(cancha.id_cancha) ? "selected" : ""}
                    >
                        ${cancha.nombre}
                    </option>
                `;

            });

        }


        let htmlResultado = "";


        if (formatoTorneo === "9_games") {

            htmlResultado = `

                <div class="resultado-inputs">

                    <input
                        type="number"
                        min="0"
                        class="resultado-a"
                        placeholder="0"
                        value="${resultado?.a ?? ""}"
                        ${yaJugado ? "disabled" : ""}
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
                        ${yaJugado ? "disabled" : ""}
                    >

                    <button
                        class="btn-guardar-resultado"
                        type="button"
                        ${yaJugado ? "disabled" : ""}
                    >
                        ${yaJugado ? "Resultado cargado" : "Guardar"}
                    </button>

                </div>

            `;

        } else {

            htmlResultado = `

                <div class="resultado-sets">

                    <div class="set-input">

                        <span>
                            Set 1
                        </span>

                        <input
                            type="number"
                            min="0"
                            class="set1-a"
                            placeholder="0"
                            value="${resultado?.sets?.[0]?.a ?? ""}"
                            ${yaJugado ? "disabled" : ""}
                        >

                        <strong>
                            -
                        </strong>

                        <input
                            type="number"
                            min="0"
                            class="set1-b"
                            placeholder="0"
                            value="${resultado?.sets?.[0]?.b ?? ""}"
                            ${yaJugado ? "disabled" : ""}
                        >

                    </div>


                    <div class="set-input">

                        <span>
                            Set 2
                        </span>

                        <input
                            type="number"
                            min="0"
                            class="set2-a"
                            placeholder="0"
                            value="${resultado?.sets?.[1]?.a ?? ""}"
                            ${yaJugado ? "disabled" : ""}
                        >

                        <strong>
                            -
                        </strong>

                        <input
                            type="number"
                            min="0"
                            class="set2-b"
                            placeholder="0"
                            value="${resultado?.sets?.[1]?.b ?? ""}"
                            ${yaJugado ? "disabled" : ""}
                        >

                    </div>


                    <div class="set-input">

                        <span>
                            ${formatoTorneo === "2_sets_supertiebreak" || formatoTorneo === "2_sets_super"
                                ? "Super TB"
                                : "Set 3"}
                        </span>

                        <input
                            type="number"
                            min="0"
                            class="set3-a"
                            placeholder="0"
                            value="${resultado?.sets?.[2]?.a ?? ""}"
                            ${yaJugado ? "disabled" : ""}
                        >

                        <strong>
                            -
                        </strong>

                        <input
                            type="number"
                            min="0"
                            class="set3-b"
                            placeholder="0"
                            value="${resultado?.sets?.[2]?.b ?? ""}"
                            ${yaJugado ? "disabled" : ""}
                        >

                    </div>


                    <button
                        class="btn-guardar-resultado"
                        type="button"
                        ${yaJugado ? "disabled" : ""}
                    >
                        ${yaJugado ? "Resultado cargado" : "Guardar resultado"}
                    </button>

                </div>

            `;

        }


        div.innerHTML = `

            <div class="partido-encabezado-cancha">

                <div class="partido-info">

                    <span>
                        ${parejaA.nombre}
                    </span>

                    <strong>
                        VS
                    </strong>

                    <span>
                        ${parejaB.nombre}
                    </span>

                </div>


                <div class="selector-cancha-partido">

                    <label>
                        Cancha
                    </label>

                    <select class="select-cancha-partido">
                        ${opcionesCanchas}
                    </select>

                </div>

            </div>

            ${htmlResultado}

        `;


        const selectCancha =
            div.querySelector(".select-cancha-partido");


        if (selectCancha) {

            selectCancha.addEventListener("change", () => {

                partido.id_cancha =
                    selectCancha.value
                        ? Number(selectCancha.value)
                        : null;


                const partidoGuardado =
                    partidos.find(
                        p =>
                            p.id === partido.id
                    );


                if (partidoGuardado) {

                    partidoGuardado.id_cancha =
                        partido.id_cancha;

                }


                guardarDatos();

            });

        }


        const btn =
            div.querySelector(
                ".btn-guardar-resultado"
            );


        if (!btn || yaJugado) {
            return div;
        }


        btn.addEventListener(
            "click",
            () => {

                const partidoActual =
                    partidos.find(
                        p =>
                            p.id === partido.id
                    );


                const idCanchaElegida =
                    partidoActual?.id_cancha ||
                    partido.id_cancha ||
                    null;


                if (!idCanchaElegida) {

                    alert(
                        "Seleccioná la cancha donde se juega este partido."
                    );

                    return;

                }


                if (partido.resultado) {

                    alert(
                        "Este partido ya tiene resultado cargado."
                    );

                    return;

                }


                if (formatoTorneo === "9_games") {

                    const inputA =
                        div.querySelector(".resultado-a");

                    const inputB =
                        div.querySelector(".resultado-b");


                    const a =
                        parseInt(inputA.value);

                    const b =
                        parseInt(inputB.value);


                    if (
                        isNaN(a) ||
                        isNaN(b)
                    ) {

                        alert(
                            "Ingresá ambos resultados."
                        );

                        return;

                    }


                    if (
                        a < 0 ||
                        b < 0
                    ) {

                        alert(
                            "Los resultados no pueden ser negativos."
                        );

                        return;

                    }


                    if (
                        a === b
                    ) {

                        alert(
                            "El partido no puede terminar empatado."
                        );

                        return;

                    }


                    if (
                        a < 9 &&
                        b < 9
                    ) {

                        alert(
                            "En partido a 9 games, una pareja debe llegar al menos a 9."
                        );

                        return;

                    }


                    guardarResultado(
                        partido.id,
                        {
                            tipo:
                                "9_games",

                            a:
                                a,

                            b:
                                b
                        }
                    );

                    return;

                }


                const set1A =
                    parseInt(
                        div.querySelector(".set1-a").value
                    );

                const set1B =
                    parseInt(
                        div.querySelector(".set1-b").value
                    );

                const set2A =
                    parseInt(
                        div.querySelector(".set2-a").value
                    );

                const set2B =
                    parseInt(
                        div.querySelector(".set2-b").value
                    );


                const set3AInput =
                    div.querySelector(".set3-a").value;

                const set3BInput =
                    div.querySelector(".set3-b").value;


                const set3A =
                    set3AInput === ""
                        ? null
                        : parseInt(set3AInput);


                const set3B =
                    set3BInput === ""
                        ? null
                        : parseInt(set3BInput);


                const resultadoSets =
                    validarResultadoSets(
                        set1A,
                        set1B,
                        set2A,
                        set2B,
                        set3A,
                        set3B
                    );


                if (!resultadoSets.valido) {

                    alert(
                        resultadoSets.mensaje
                    );

                    return;

                }


                guardarResultado(
                    partido.id,
                    resultadoSets.resultado
                );

            }
        );


        return div;

    }


    // =====================================================
    // GUARDAR RESULTADO
    // =====================================================

    function guardarResultado(
        partidoId,
        resultado
    ) {

        const partido =
            partidos.find(
                p =>
                    p.id === partidoId
            );


        if (!partido) {

            console.error(
                "Partido no encontrado."
            );

            return;

        }


        if (partido.resultado) {

            alert(
                "Este partido ya tiene resultado cargado."
            );

            return;

        }


        partido.resultado =
            resultado;


        if (
            resultado.tipo === "9_games"
        ) {

            partido.ganador =
                resultado.a > resultado.b
                    ? partido.parejaA
                    : partido.parejaB;

        } else {

            partido.ganador =
                resultado.setsGanadosA > resultado.setsGanadosB
                    ? partido.parejaA
                    : partido.parejaB;

        }


        if (
            partido.fase === "grupos"
        ) {

            actualizarTablaGrupo(
                partido
            );


            guardarDatos();


            mostrarZonas();


            generarEliminacion();

        } else {

            guardarDatos();


            generarSiguienteRonda(
                partido.fase
            );


            mostrarRondasEliminacionGuardadas();

        }


        alert(
            "Resultado guardado correctamente."
        );

    }


    // =====================================================
    // VALIDAR RESULTADO POR SETS
    // =====================================================

    function validarResultadoSets(
        set1A,
        set1B,
        set2A,
        set2B,
        set3A,
        set3B
    ) {

        if (
            isNaN(set1A) ||
            isNaN(set1B) ||
            isNaN(set2A) ||
            isNaN(set2B)
        ) {

            return {
                valido:
                    false,

                mensaje:
                    "Tenés que cargar el Set 1 y el Set 2."
            };

        }


        if (
            set1A < 0 ||
            set1B < 0 ||
            set2A < 0 ||
            set2B < 0
        ) {

            return {
                valido:
                    false,

                mensaje:
                    "Los resultados no pueden ser negativos."
            };

        }


        if (
            set1A === set1B ||
            set2A === set2B
        ) {

            return {
                valido:
                    false,

                mensaje:
                    "Un set no puede terminar empatado."
            };

        }


        let setsGanadosA = 0;

        let setsGanadosB = 0;


        if (set1A > set1B) {
            setsGanadosA++;
        } else {
            setsGanadosB++;
        }


        if (set2A > set2B) {
            setsGanadosA++;
        } else {
            setsGanadosB++;
        }


        const necesitaTercero =
            setsGanadosA === 1 &&
            setsGanadosB === 1;


        const sets = [
            {
                a:
                    set1A,

                b:
                    set1B
            },
            {
                a:
                    set2A,

                b:
                    set2B
            }
        ];


        if (necesitaTercero) {

            if (
                set3A === null ||
                set3B === null ||
                isNaN(set3A) ||
                isNaN(set3B)
            ) {

                return {
                    valido:
                        false,

                    mensaje:
                        formatoTorneo === "2_sets_supertiebreak" ||
                        formatoTorneo === "2_sets_super"
                            ? "Como cada pareja ganó un set, tenés que cargar el Super Tie-Break."
                            : "Como cada pareja ganó un set, tenés que cargar el tercer set."
                };

            }


            if (
                set3A < 0 ||
                set3B < 0
            ) {

                return {
                    valido:
                        false,

                    mensaje:
                        "El tercer resultado no puede ser negativo."
                };

            }


            if (
                set3A === set3B
            ) {

                return {
                    valido:
                        false,

                    mensaje:
                        formatoTorneo === "2_sets_supertiebreak" ||
                        formatoTorneo === "2_sets_super"
                            ? "El Super Tie-Break no puede terminar empatado."
                            : "El tercer set no puede terminar empatado."
                };

            }


            if (set3A > set3B) {
                setsGanadosA++;
            } else {
                setsGanadosB++;
            }


            sets.push({
                a:
                    set3A,

                b:
                    set3B
            });

        }


        return {
            valido:
                true,

            resultado:
                {
                    tipo:
                        formatoTorneo,

                    sets:
                        sets,

                    setsGanadosA:
                        setsGanadosA,

                    setsGanadosB:
                        setsGanadosB
                }
        };

    }


    // =====================================================
    // DIFERENCIA DE GAMES
    // =====================================================

    function obtenerDiferenciaGamesResultado(
        resultado,
        esParejaA
    ) {

        if (!resultado) {
            return 0;
        }


        if (resultado.tipo === "9_games") {

            return esParejaA
                ? resultado.a - resultado.b
                : resultado.b - resultado.a;

        }


        let diferencia = 0;


        resultado.sets.forEach(set => {

            diferencia += esParejaA
                ? set.a - set.b
                : set.b - set.a;

        });


        return diferencia;

    }


    // =====================================================
    // ACTUALIZAR TABLA DE GRUPO
    // =====================================================

    function actualizarTablaGrupo(
        partido
    ) {

        if (
            partido.fase !==
            "grupos"
        ) {

            return;

        }


        const grupo =
            grupos.find(
                g =>
                    g.id === partido.grupo
            );


        if (!grupo) {
            return;
        }


        grupo.parejas.forEach(
            pareja => {

                pareja.puntos = 0;

                pareja.partidosJugados =
                    0;

                pareja.diferenciaGames =
                    0;

            }
        );


        partidos
            .filter(
                p =>
                    p.grupo === grupo.id &&
                    p.resultado &&
                    p.fase === "grupos"
            )
            .forEach(
                p => {

                    const parejaA =
                        grupo.parejas.find(
                            x =>
                                x.id ===
                                p.parejaA
                        );


                    const parejaB =
                        grupo.parejas.find(
                            x =>
                                x.id ===
                                p.parejaB
                        );


                    if (
                        !parejaA ||
                        !parejaB
                    ) {
                        return;
                    }


                    parejaA.partidosJugados++;

                    parejaB.partidosJugados++;


                    parejaA.diferenciaGames +=
                        obtenerDiferenciaGamesResultado(
                            p.resultado,
                            true
                        );


                    parejaB.diferenciaGames +=
                        obtenerDiferenciaGamesResultado(
                            p.resultado,
                            false
                        );


                    if (
                        p.ganador === parejaA.id
                    ) {

                        parejaA.puntos += 2;

                    }

                    else if (
                        p.ganador === parejaB.id
                    ) {

                        parejaB.puntos += 2;

                    }

                }
            );


        grupo.parejas.sort(
            ordenarParejas
        );


        grupo.parejas.forEach(
            (pareja, index) => {

                pareja.posicion =
                    index + 1;

            }
        );

    }


    // =====================================================
    // LIMPIAR PARTIDOS INVÁLIDOS
    // =====================================================

    function limpiarPartidosInvalidos() {

        const idsValidos =
            [];


        grupos.forEach(grupo => {

            const parejasOrdenadas =
                [...grupo.parejas].sort(
                    (a, b) =>
                        (a.ordenZona || a.posicion) -
                        (b.ordenZona || b.posicion)
                );


            if (grupo.parejas.length === 3) {

                for (
                    let i = 0;
                    i < parejasOrdenadas.length;
                    i++
                ) {

                    for (
                        let j = i + 1;
                        j < parejasOrdenadas.length;
                        j++
                    ) {

                        idsValidos.push(
                            crearIdPartidoGrupo(
                                grupo.id,
                                parejasOrdenadas[i].id,
                                parejasOrdenadas[j].id
                            )
                        );

                    }

                }

            }


            if (grupo.parejas.length === 4) {

                idsValidos.push(
                    `zona4-${grupo.id}-p1`
                );

                idsValidos.push(
                    `zona4-${grupo.id}-p2`
                );


                const partido1 =
                    partidos.find(
                        p =>
                            p.id === `zona4-${grupo.id}-p1`
                    );


                const partido2 =
                    partidos.find(
                        p =>
                            p.id === `zona4-${grupo.id}-p2`
                    );


                if (
                    partido1 &&
                    partido2 &&
                    partido1.resultado &&
                    partido2.resultado &&
                    partido1.ganador &&
                    partido2.ganador
                ) {

                    idsValidos.push(
                        `zona4-${grupo.id}-p3`
                    );

                    idsValidos.push(
                        `zona4-${grupo.id}-p4`
                    );

                }

            }

        });


        partidos =
            partidos.filter(partido => {

                if (partido.fase !== "grupos") {
                    return true;
                }


                return idsValidos.includes(
                    partido.id
                );

            });

    }


    // =====================================================
    // GENERAR ELIMINACIÓN
    // =====================================================

    function generarEliminacion() {

        if (!cuadroEliminacion) {
            return;
        }


        limpiarPartidosInvalidos();


        cuadroEliminacion.innerHTML = "";


        let clasificados = [];


        grupos.forEach(
            grupo => {

                grupo.parejas.sort(
                    ordenarParejas
                );


                const directos =
                    grupo.parejas.slice(
                        0,
                        clasificadosPorGrupo
                    );


                directos.forEach(
                    pareja => {

                        clasificados.push({

                            pareja:
                                pareja,

                            grupo:
                                grupo.nombre,

                            posicion:
                                pareja.posicion

                        });

                    }
                );

            }
        );


        if (
            mejoresTerceros > 0
        ) {

            let terceros = [];


            grupos.forEach(
                grupo => {

                    const tercero =
                        grupo.parejas[2];


                    if (tercero) {

                        terceros.push({

                            pareja:
                                tercero,

                            grupo:
                                grupo.nombre,

                            posicion:
                                3

                        });

                    }

                }
            );


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
                        b.pareja.diferenciaGames -
                        a.pareja.diferenciaGames
                    );

                }
            );


            terceros =
                terceros.slice(
                    0,
                    mejoresTerceros
                );


            clasificados.push(
                ...terceros
            );

        }


        if (totalClasificados) {

            totalClasificados.textContent =
                clasificados.length;

        }


        const partidosGrupo =
            partidos.filter(
                p =>
                    p.fase === "grupos"
            );


        const partidosSinResultado =
            partidosGrupo.filter(
                p =>
                    !p.resultado
            );


        if (
            partidosSinResultado.length >
            0
        ) {

            cuadroEliminacion.innerHTML = `

                <div class="aviso-eliminacion">

                    <h3>
                        🕐 Fase de grupos en curso
                    </h3>

                    <p>
                        Faltan
                        <strong>
                            ${partidosSinResultado.length}
                        </strong>
                        partidos por jugar.
                    </p>

                    <p>
                        Cuando se completen los resultados,
                        se generarán automáticamente
                        los cruces.
                    </p>

                </div>

            `;


            return;

        }


        if (
            clasificados.length < 2
        ) {

            cuadroEliminacion.innerHTML = `

                <div class="aviso-eliminacion">

                    <h3>
                        Clasificación pendiente
                    </h3>

                    <p>
                        Todavía no hay suficientes
                        clasificados.
                    </p>

                </div>

            `;

            return;

        }


        generarLlaveEliminacion(
            clasificados
        );


        mostrarRondasEliminacionGuardadas();

    }


    // =====================================================
    // ORDENAR PAREJAS
    // =====================================================

    function ordenarParejas(
        a,
        b
    ) {

        if (
            b.puntos !==
            a.puntos
        ) {

            return (
                b.puntos -
                a.puntos
            );

        }


        return (
            b.diferenciaGames -
            a.diferenciaGames
        );

    }


    // =====================================================
    // ARMAR CRUCES INTELIGENTES
    // =====================================================

    function armarCrucesInteligentes(
        clasificados
    ) {

        const primeros =
            clasificados.filter(
                c => c.posicion === 1
            );


        const segundos =
            clasificados.filter(
                c => c.posicion === 2
            );


        let cruces = [];


        if (
            primeros.length > 0 &&
            primeros.length === segundos.length
        ) {

            const cantidadZonas =
                primeros.length;


            const salto =
                Math.ceil(
                    cantidadZonas / 2
                );


            primeros.forEach(
                (primero, index) => {

                    let rival =
                        segundos[
                            (index + salto) %
                            cantidadZonas
                        ];


                    if (
                        rival &&
                        rival.grupo === primero.grupo
                    ) {

                        rival =
                            segundos.find(
                                segundo =>
                                    segundo.grupo !== primero.grupo &&
                                    !cruces.some(
                                        cruce =>
                                            cruce.parejaA === segundo ||
                                            cruce.parejaB === segundo
                                    )
                            );

                    }


                    if (rival) {

                        cruces.push({
                            parejaA:
                                primero,

                            parejaB:
                                rival
                        });

                    }

                }
            );


            const usados =
                new Set();


            cruces.forEach(cruce => {

                usados.add(
                    cruce.parejaA
                );

                usados.add(
                    cruce.parejaB
                );

            });


            const sobrantes =
                clasificados.filter(
                    c =>
                        !usados.has(c)
                );


            for (
                let i = 0;
                i < sobrantes.length;
                i += 2
            ) {

                if (
                    sobrantes[i] &&
                    sobrantes[i + 1]
                ) {

                    cruces.push({
                        parejaA:
                            sobrantes[i],

                        parejaB:
                            sobrantes[i + 1]
                    });

                }

            }


            return cruces;

        }


        if (
            primeros.length === clasificados.length
        ) {

            const cantidad =
                primeros.length;


            const salto =
                Math.ceil(
                    cantidad / 2
                );


            const usados =
                new Set();


            primeros.forEach(
                (primero, index) => {

                    if (
                        usados.has(primero)
                    ) {
                        return;
                    }


                    const rival =
                        primeros[
                            (index + salto) %
                            cantidad
                        ];


                    if (
                        rival &&
                        rival !== primero &&
                        !usados.has(rival)
                    ) {

                        cruces.push({
                            parejaA:
                                primero,

                            parejaB:
                                rival
                        });


                        usados.add(
                            primero
                        );


                        usados.add(
                            rival
                        );

                    }

                }
            );


            return cruces;

        }


        let disponibles =
            [...clasificados];


        while (
            disponibles.length >= 2
        ) {

            const parejaA =
                disponibles.shift();


            let indiceRival =
                disponibles.findIndex(
                    p =>
                        p.grupo !== parejaA.grupo
                );


            if (
                indiceRival === -1
            ) {

                indiceRival = 0;

            }


            const parejaB =
                disponibles.splice(
                    indiceRival,
                    1
                )[0];


            cruces.push({
                parejaA:
                    parejaA,

                parejaB:
                    parejaB
            });

        }


        return cruces;

    }


    // =====================================================
    // GENERAR LLAVE
    // =====================================================

    function generarLlaveEliminacion(
        clasificados
    ) {

        const cantidad =
            clasificados.length;


        const nombreRonda =
            obtenerNombreRonda(
                cantidad
            );


        const cruces =
            armarCrucesInteligentes(
                clasificados
            );


        const titulo =
            document.createElement(
                "h3"
            );


        titulo.textContent =
            nombreRonda;


        cuadroEliminacion.appendChild(
            titulo
        );


        const contenedor =
            document.createElement(
                "div"
            );


        contenedor.className =
            "cruces";


        cruces.forEach(
            (cruce, index) => {

                const parejaA =
                    cruce.parejaA;


                const parejaB =
                    cruce.parejaB;


                if (
                    !parejaA ||
                    !parejaB
                ) {
                    return;
                }


                const partidoId =
                    `eliminacion-${nombreRonda}-${parejaA.pareja.id}-${parejaB.pareja.id}`;


                let partido =
                    partidos.find(
                        p =>
                            p.id === partidoId
                    );


                if (!partido) {

                    partido = {

                        id:
                            partidoId,

                        fase:
                            nombreRonda,

                        parejaA:
                            parejaA.pareja.id,

                        parejaB:
                            parejaB.pareja.id,

                        id_cancha:
                            null,

                        resultado:
                            null,

                        ganador:
                            null

                    };


                    partidos.push(
                        partido
                    );

                }


                const subtitulo =
                    document.createElement(
                        "div"
                    );


                subtitulo.className =
                    "partido-numero";


                subtitulo.textContent =
                    `Partido ${index + 1} - ${parejaA.grupo} ${parejaA.posicion}° vs ${parejaB.grupo} ${parejaB.posicion}°`;


                contenedor.appendChild(
                    subtitulo
                );


                const div =
                    crearPartidoHTML(
                        partido,
                        parejaA.pareja,
                        parejaB.pareja
                    );


                contenedor.appendChild(
                    div
                );

            }
        );


        cuadroEliminacion.appendChild(
            contenedor
        );

    }


    // =====================================================
    // MOSTRAR RONDAS GUARDADAS
    // =====================================================

    function mostrarRondasEliminacionGuardadas() {

        if (!cuadroEliminacion) {
            return;
        }


        const rondas = [
            "Ronda de 32",
            "Octavos de final",
            "Cuartos de final",
            "Semifinal",
            "Final"
        ];


        rondas.forEach(ronda => {

            const partidosRonda =
                partidos.filter(
                    p =>
                        p.fase === ronda
                );


            if (
                partidosRonda.length === 0
            ) {
                return;
            }


            const yaEstaDibujada =
                Array.from(
                    cuadroEliminacion.querySelectorAll("h3")
                ).some(
                    titulo =>
                        titulo.textContent.trim() === ronda
                );


            if (
                yaEstaDibujada
            ) {
                return;
            }


            const titulo =
                document.createElement("h3");


            titulo.textContent =
                ronda;


            cuadroEliminacion.appendChild(
                titulo
            );


            const contenedor =
                document.createElement("div");


            contenedor.className =
                "cruces";


            partidosRonda.forEach((partido, index) => {

                const parejaA =
                    obtenerPareja(
                        partido.parejaA
                    );


                const parejaB =
                    obtenerPareja(
                        partido.parejaB
                    );


                if (
                    !parejaA ||
                    !parejaB
                ) {
                    return;
                }


                const subtitulo =
                    document.createElement("div");


                subtitulo.className =
                    "partido-numero";


                subtitulo.textContent =
                    `Partido ${index + 1}`;


                contenedor.appendChild(
                    subtitulo
                );


                const div =
                    crearPartidoHTML(
                        partido,
                        parejaA,
                        parejaB
                    );


                contenedor.appendChild(
                    div
                );

            });


            cuadroEliminacion.appendChild(
                contenedor
            );

        });

    }


    // =====================================================
    // SIGUIENTE RONDA
    // =====================================================

    function generarSiguienteRonda(
        rondaActual
    ) {

        if (!rondaActual) {
            return;
        }


        const partidosRonda =
            partidos.filter(
                p =>
                    p.fase === rondaActual
            );


        if (
            partidosRonda.length === 0
        ) {
            return;
        }


        const todosJugados =
            partidosRonda.every(
                p =>
                    p.resultado &&
                    p.ganador
            );


        if (!todosJugados) {
            return;
        }


        const ganadores =
            partidosRonda.map(
                p =>
                    obtenerPareja(
                        p.ganador
                    )
            );


        if (
            ganadores.length === 1
        ) {

            mostrarCampeon(
                ganadores[0]
            );

            guardarDatos();

            return;

        }


        const siguiente =
            siguienteNombreRonda(
                rondaActual
            );


        const yaExisteSiguiente =
            partidos.some(
                p =>
                    p.fase === siguiente
            );


        if (
            yaExisteSiguiente
        ) {

            mostrarRondasEliminacionGuardadas();

            return;

        }


        const clasificados =
            ganadores.map(
                pareja => ({

                    pareja:
                        pareja,

                    grupo:
                        pareja.grupo ||
                        "",

                    posicion:
                        pareja.posicion ||
                        ""

                })
            );


        generarRondaManual(
            siguiente,
            clasificados
        );


        guardarDatos();

    }


    // =====================================================
    // GENERAR RONDA POSTERIOR
    // =====================================================

    function generarRondaManual(
        nombreRonda,
        clasificados
    ) {

        if (!cuadroEliminacion) {
            return;
        }


        const titulo =
            document.createElement(
                "h3"
            );


        titulo.textContent =
            nombreRonda;


        cuadroEliminacion.appendChild(
            titulo
        );


        const contenedor =
            document.createElement(
                "div"
            );


        contenedor.className =
            "cruces";


        for (
            let i = 0;
            i < clasificados.length;
            i += 2
        ) {

            if (
                !clasificados[i + 1]
            ) {
                continue;
            }


            const parejaA =
                clasificados[i].pareja;


            const parejaB =
                clasificados[i + 1].pareja;


            const partidoId =
                `${nombreRonda}-${parejaA.id}-${parejaB.id}`;


            let partido =
                partidos.find(
                    p =>
                        p.id === partidoId
                );


            if (!partido) {

                partido = {

                    id:
                        partidoId,

                    fase:
                        nombreRonda,

                    parejaA:
                        parejaA.id,

                    parejaB:
                        parejaB.id,

                    id_cancha:
                        null,

                    resultado:
                        null,

                    ganador:
                        null

                };


                partidos.push(
                    partido
                );

            }


            const div =
                crearPartidoHTML(
                    partido,
                    parejaA,
                    parejaB
                );


            contenedor.appendChild(
                div
            );

        }


        cuadroEliminacion.appendChild(
            contenedor
        );

    }


    // =====================================================
    // CAMPEÓN
    // =====================================================

    function mostrarCampeon(
        pareja
    ) {

        if (!cuadroEliminacion) {
            return;
        }


        const yaHayCampeon =
            cuadroEliminacion.querySelector(
                ".campeon-torneo"
            );


        if (
            yaHayCampeon
        ) {
            return;
        }


        const campeon =
            document.createElement(
                "div"
            );


        campeon.className =
            "campeon-torneo";


        campeon.innerHTML = `

            <div>
                🏆
            </div>

            <h2>
                ¡CAMPEONES!
            </h2>

            <p>
                ${pareja.nombre}
            </p>

            <button
                id="btnNuevoTorneoFinal"
                type="button"
            >
                🆕 Generar nuevo torneo
            </button>

        `;


        cuadroEliminacion.appendChild(
            campeon
        );


        const boton =
            document.getElementById(
                "btnNuevoTorneoFinal"
            );


        if (boton) {

            boton.addEventListener(
                "click",
                nuevoTorneo
            );

        }

    }


    // =====================================================
    // OBTENER PAREJA
    // =====================================================

    function obtenerPareja(
        id
    ) {

        return parejas.find(
            p =>
                p.id === id
        );

    }


    // =====================================================
    // CATEGORÍAS
    // =====================================================

    function obtenerParejasPorCategoria(
        categoria
    ) {

        if (!categoria) {
            return [];
        }


        return parejas.filter(
            pareja =>
                pareja.categoria === categoria
        );

    }


    function obtenerNombreCategoria(
        categoria
    ) {

        switch (categoria) {

            case "primera":
                return "Primera categoría";

            case "segunda":
                return "Segunda categoría";

            case "tercera":
                return "Tercera categoría";

            case "cuarta":
                return "Cuarta categoría";

            case "quinta":
                return "Quinta categoría";

            case "sexta":
                return "Sexta categoría";

            case "septima":
                return "Séptima categoría";

            case "octava":
                return "Octava categoría";

            default:
                return "-";

        }

    }


    // =====================================================
    // SIGUIENTE NOMBRE DE RONDA
    // =====================================================

    function siguienteNombreRonda(
        actual
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


        return mapa[actual] ||
            "Final";

    }


    // =====================================================
    // NOMBRE DE RONDA
    // =====================================================

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


    // =====================================================
    // FORMATO DEL TORNEO
    // =====================================================

    function obtenerNombreFormato(
        formato
    ) {

        switch (formato) {

            case "9_games":

                return "Partido a 9 games";

            case "2_sets_supertiebreak":

                return "Mejor de 2 sets + Super Tie-Break";

            case "2_sets_super":

                return "2 sets + Super Tie-Break";

            case "partido_completo":

                return "Partido completo - 3er set";

            case "completo":

                return "Partido completo";

            default:

                return "Partido de pádel";

        }

    }


    // =====================================================
    // MEZCLAR
    // =====================================================

    function mezclarArray(
        array
    ) {

        const copia =
            [...array];


        for (
            let i =
                copia.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                copia[i],
                copia[j]
            ] = [
                copia[j],
                copia[i]
            ];

        }


        return copia;

    }


    // =====================================================
    // LOCALSTORAGE POR CATEGORÍA
    // =====================================================

    function obtenerClaveTorneo() {

        const categoriaActual =
            categoriaTorneoInput?.value ||
            categoriaTorneo ||
            "";


        if (!categoriaActual) {
            return CLAVE_TORNEO_GENERAL;
        }


        return `${CLAVE_TORNEO_GENERAL}_${categoriaActual}`;

    }


    function guardarParejasGlobales() {

        localStorage.setItem(
            CLAVE_PAREJAS,
            JSON.stringify(parejas)
        );

    }


    function cargarParejasGlobales() {

        const parejasGuardadas =
            localStorage.getItem(CLAVE_PAREJAS);


        if (!parejasGuardadas) {
            return;
        }


        try {

            parejas =
                JSON.parse(parejasGuardadas) || [];

        } catch (error) {

            console.error(
                "Error cargando parejas:",
                error
            );

            parejas = [];

        }

    }


    function cargarTorneoPorCategoria() {

        const categoriaSeleccionada =
            categoriaTorneoInput?.value || "";


        if (!categoriaSeleccionada) {
            return;
        }


        categoriaTorneo =
            categoriaSeleccionada;


        if (categoriaParejaInput) {
            categoriaParejaInput.value = categoriaSeleccionada;
        }


        const datosGuardados =
            localStorage.getItem(
                `${CLAVE_TORNEO_GENERAL}_${categoriaSeleccionada}`
            );


        grupos = [];

        partidos = [];

        zonasPersonalizadas = [];

        torneoGenerado = false;


        parejasTorneoActual =
            obtenerParejasPorCategoria(
                categoriaTorneo
            );


        if (!datosGuardados) {

            if (cantidadParejasInput) {
                cantidadParejasInput.value = "";
            }

            if (cantidadGruposInput) {
                cantidadGruposInput.value = "";
            }

            if (clasificadosPorGrupoInput) {
                clasificadosPorGrupoInput.value = "";
            }

            if (mejoresTercerosInput) {
                mejoresTercerosInput.value = 0;
            }

            if (formatoTorneoInput) {
                formatoTorneoInput.value = "";
            }

            if (contenedorZonas) {
                contenedorZonas.innerHTML = "";
            }

            if (cuadroEliminacion) {
                cuadroEliminacion.innerHTML = "";
            }

            if (informacionTorneo) {
                informacionTorneo.classList.add("oculto");
            }

            if (seccionEliminacion) {
                seccionEliminacion.classList.add("oculto");
            }


            crearConfiguracionZonas(true);

            mostrarParejas();

            actualizarContador();

            actualizarResumen();

            return;

        }


        try {

            const datos =
                JSON.parse(
                    datosGuardados
                );


            cantidadParejas =
                datos.cantidadParejas ||
                0;

            cantidadGrupos =
                datos.cantidadGrupos ||
                0;

            parejasPorGrupo =
                datos.parejasPorGrupo ||
                4;

            clasificadosPorGrupo =
                datos.clasificadosPorGrupo ||
                2;

            mejoresTerceros =
                datos.mejoresTerceros ||
                0;

            formatoTorneo =
                datos.formatoTorneo ||
                "9_games";

            categoriaTorneo =
                datos.categoriaTorneo ||
                categoriaSeleccionada;

            zonasPersonalizadas =
                datos.zonasPersonalizadas ||
                [];

            grupos =
                datos.grupos ||
                [];

            partidos =
                datos.partidos ||
                [];

            torneoGenerado =
                datos.torneoGenerado ||
                false;


            parejasTorneoActual =
                obtenerParejasPorCategoria(
                    categoriaTorneo
                );


            if (cantidadParejasInput) {
                cantidadParejasInput.value = cantidadParejas;
            }

            if (cantidadGruposInput) {
                cantidadGruposInput.value = cantidadGrupos;
            }

            if (clasificadosPorGrupoInput) {
                clasificadosPorGrupoInput.value = clasificadosPorGrupo;
            }

            if (mejoresTercerosInput) {
                mejoresTercerosInput.value = mejoresTerceros;
            }

            if (formatoTorneoInput) {
                formatoTorneoInput.value = formatoTorneo;
            }


            crearConfiguracionZonas(false);

            mostrarParejas();

            actualizarContador();

            actualizarResumen();


            if (
                torneoGenerado &&
                grupos.length > 0
            ) {

                mostrarZonas();

                generarEliminacion();

                if (informacionTorneo) {
                    informacionTorneo.classList.remove("oculto");
                }

                if (seccionEliminacion) {
                    seccionEliminacion.classList.remove("oculto");
                }

                if (totalParejas) {
                    totalParejas.textContent = cantidadParejas;
                }

                if (totalGrupos) {
                    totalGrupos.textContent = grupos.length;
                }

                if (nombreFormatoTorneo) {

                    nombreFormatoTorneo.textContent =
                        `${obtenerNombreCategoria(categoriaTorneo)} - ${obtenerNombreFormato(formatoTorneo)}`;

                }

            }

        } catch (error) {

            console.error(
                "Error cargando torneo por categoría:",
                error
            );

        }

    }


    // =====================================================
    // NUEVO TORNEO
    // =====================================================

    if (btnNuevoTorneo) {

        btnNuevoTorneo.addEventListener(
            "click",
            nuevoTorneo
        );

    }


    function nuevoTorneo() {

        const confirmar =
            confirm(
                "¿Querés comenzar un torneo nuevo? Se borrará solo el torneo de la categoría seleccionada."
            );


        if (!confirmar) {
            return;
        }


        localStorage.removeItem(
            obtenerClaveTorneo()
        );


        grupos = [];

        partidos = [];

        zonasPersonalizadas = [];

        torneoGenerado = false;


        if (contenedorZonas) {
            contenedorZonas.innerHTML = "";
        }

        if (cuadroEliminacion) {
            cuadroEliminacion.innerHTML = "";
        }

        if (informacionTorneo) {
            informacionTorneo.classList.add("oculto");
        }

        if (seccionEliminacion) {
            seccionEliminacion.classList.add("oculto");
        }


        crearConfiguracionZonas(true);

        actualizarContador();

        actualizarResumen();

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    function guardarDatos() {

        cantidadParejas =
            parseInt(
                cantidadParejasInput?.value
            ) ||
            cantidadParejas ||
            0;


        cantidadGrupos =
            parseInt(
                cantidadGruposInput?.value
            ) ||
            cantidadGrupos ||
            0;


        parejasPorGrupo =
            parseInt(
                parejasPorGrupoInput?.value
            ) ||
            parejasPorGrupo ||
            4;


        clasificadosPorGrupo =
            parseInt(
                clasificadosPorGrupoInput?.value
            ) ||
            clasificadosPorGrupo ||
            2;


        mejoresTerceros =
            parseInt(
                mejoresTercerosInput?.value
            ) ||
            mejoresTerceros ||
            0;


        formatoTorneo =
            formatoTorneoInput?.value ||
            formatoTorneo ||
            "9_games";


        categoriaTorneo =
            categoriaTorneoInput?.value ||
            categoriaTorneo ||
            "";


        guardarParejasGlobales();


        const datos = {

            cantidadParejas,

            cantidadGrupos,

            parejasPorGrupo,

            clasificadosPorGrupo,

            mejoresTerceros,

            formatoTorneo,

            categoriaTorneo,

            zonasPersonalizadas,

            grupos,

            partidos,

            torneoGenerado

        };


        localStorage.setItem(
            obtenerClaveTorneo(),
            JSON.stringify(datos)
        );

    }


    // =====================================================
    // CARGAR
    // =====================================================

    function cargarTorneo() {

        const categoriaSeleccionada =
            categoriaTorneoInput?.value || "";


        if (categoriaSeleccionada) {

            cargarTorneoPorCategoria();

            return;

        }


        const datosGuardados =
            localStorage.getItem(
                CLAVE_TORNEO_GENERAL
            );


        if (!datosGuardados) {

            mostrarParejas();

            crearConfiguracionZonas(false);

            return;

        }


        try {

            const datos =
                JSON.parse(
                    datosGuardados
                );


            cantidadParejas =
                datos.cantidadParejas ||
                0;


            cantidadGrupos =
                datos.cantidadGrupos ||
                0;


            parejasPorGrupo =
                datos.parejasPorGrupo ||
                4;


            clasificadosPorGrupo =
                datos.clasificadosPorGrupo ||
                2;


            mejoresTerceros =
                datos.mejoresTerceros ||
                0;


            formatoTorneo =
                datos.formatoTorneo ||
                "9_games";


            categoriaTorneo =
                datos.categoriaTorneo ||
                "";


            zonasPersonalizadas =
                datos.zonasPersonalizadas ||
                [];


            grupos =
                datos.grupos ||
                [];


            partidos =
                datos.partidos ||
                [];


            torneoGenerado =
                datos.torneoGenerado ||
                false;


            parejasTorneoActual =
                obtenerParejasPorCategoria(
                    categoriaTorneo
                );


            if (
                categoriaTorneoInput
            ) {

                categoriaTorneoInput.value =
                    categoriaTorneo;

            }


            if (
                categoriaParejaInput &&
                categoriaTorneo
            ) {

                categoriaParejaInput.value =
                    categoriaTorneo;

            }


            if (
                cantidadParejasInput &&
                cantidadParejas
            ) {

                cantidadParejasInput.value =
                    cantidadParejas;

            }


            if (
                cantidadGruposInput &&
                cantidadGrupos
            ) {

                cantidadGruposInput.value =
                    cantidadGrupos;

            }


            if (
                parejasPorGrupoInput
            ) {

                parejasPorGrupoInput.value =
                    parejasPorGrupo;

            }


            if (
                clasificadosPorGrupoInput
            ) {

                clasificadosPorGrupoInput.value =
                    clasificadosPorGrupo;

            }


            if (
                mejoresTercerosInput
            ) {

                mejoresTercerosInput.value =
                    mejoresTerceros;

            }


            if (
                formatoTorneoInput
            ) {

                formatoTorneoInput.value =
                    formatoTorneo;

            }


            crearConfiguracionZonas(false);


            mostrarParejas();


            actualizarContador();


            actualizarResumen();


            if (
                torneoGenerado &&
                grupos.length > 0
            ) {

                mostrarZonas();

                generarEliminacion();

                if (informacionTorneo) {

                    informacionTorneo.classList.remove(
                        "oculto"
                    );

                }

                if (seccionEliminacion) {

                    seccionEliminacion.classList.remove(
                        "oculto"
                    );

                }


                if (totalParejas) {

                    totalParejas.textContent =
                        cantidadParejas;

                }


                if (totalGrupos) {

                    totalGrupos.textContent =
                        grupos.length;

                }


                if (nombreFormatoTorneo) {

                    nombreFormatoTorneo.textContent =
                        `${obtenerNombreCategoria(categoriaTorneo)} - ${obtenerNombreFormato(formatoTorneo)}`;

                }

            }

        }

        catch (error) {

            console.error(
                "Error cargando torneo:",
                error
            );

            localStorage.removeItem(
                CLAVE_TORNEO_GENERAL
            );

        }

    }

});