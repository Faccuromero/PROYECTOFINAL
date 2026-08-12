// =====================================================
// TORNEOS DE PADEL - CLUB DEPORTIVO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTOS DEL HTML
    // =====================================================

    const cantidadParejasInput =
        document.getElementById("cantidadParejas");

    const parejasPorGrupoInput =
        document.getElementById("parejasPorGrupo");

    const clasificadosPorGrupoInput =
        document.getElementById("clasificadosPorGrupo");

    const mejoresTercerosInput =
        document.getElementById("mejoresTerceros");

    const formatoTorneoInput =
        document.getElementById("formatoTorneo");

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


    // =====================================================
    // VARIABLES
    // =====================================================

    let parejas = [];

    let grupos = [];

    let partidos = [];

    let cantidadParejas = 0;

    let parejasPorGrupo = 4;

    let clasificadosPorGrupo = 2;

    let mejoresTerceros = 0;

    let formatoTorneo = "9_games";

    let torneoGenerado = false;


    // =====================================================
    // NOMBRES DE GRUPOS
    // =====================================================

    const letrasGrupos = [
        "A", "B", "C", "D",
        "E", "F", "G", "H",
        "I", "J", "K", "L",
        "M", "N", "O", "P"
    ];


    // =====================================================
    // INICIALIZAR
    // =====================================================

    cargarTorneo();

    actualizarContador();


    // =====================================================
    // AGREGAR PAREJA
    // =====================================================

    if (btnAgregarPareja) {

        btnAgregarPareja.addEventListener("click", () => {

            const jugador1Nombre =
                document.getElementById("jugador1Nombre");

            const jugador1Apellido =
                document.getElementById("jugador1Apellido");

            const jugador2Nombre =
                document.getElementById("jugador2Nombre");

            const jugador2Apellido =
                document.getElementById("jugador2Apellido");


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


            const nombre1 =
                jugador1Nombre.value.trim();

            const apellido1 =
                jugador1Apellido.value.trim();

            const nombre2 =
                jugador2Nombre.value.trim();

            const apellido2 =
                jugador2Apellido.value.trim();


            if (
                !nombre1 ||
                !apellido1 ||
                !nombre2 ||
                !apellido2
            ) {

                alert(
                    "Completá nombre y apellido de los dos jugadores."
                );

                return;
            }


            const cantidadMaxima =
                parseInt(
                    cantidadParejasInput?.value
                );


            if (
                cantidadMaxima &&
                parejas.length >= cantidadMaxima
            ) {

                alert(
                    "Ya cargaste todas las parejas del torneo."
                );

                return;
            }


            const pareja = {

                id:
                    Date.now(),

                jugador1:
                    `${nombre1} ${apellido1}`,

                jugador2:
                    `${nombre2} ${apellido2}`,

                nombre:
                    `${nombre1} ${apellido1} / ${nombre2} ${apellido2}`,

                grupo:
                    null,

                posicion:
                    null
            };


            parejas.push(pareja);


            jugador1Nombre.value = "";
            jugador1Apellido.value = "";
            jugador2Nombre.value = "";
            jugador2Apellido.value = "";


            mostrarParejas();

            actualizarContador();

            guardarDatos();

        });

    }


    // =====================================================
    // MOSTRAR PAREJAS
    // =====================================================

    function mostrarParejas() {

        if (!listaParejas) {
            return;
        }


        listaParejas.innerHTML = "";


        if (parejas.length === 0) {

            listaParejas.innerHTML = `
                <div class="sin-parejas">
                    Todavía no agregaste ninguna pareja.
                </div>
            `;

            return;
        }


        parejas.forEach((pareja, index) => {

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
                </div>

                <button
                    class="btn-eliminar-pareja"
                    data-id="${pareja.id}"
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


                        mostrarParejas();

                        actualizarContador();

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


        contadorParejas.textContent =
            `${parejas.length} / ${max}`;

    }


    if (cantidadParejasInput) {

        cantidadParejasInput.addEventListener(
            "input",
            actualizarContador
        );

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


        // =================================================
        // VALIDACIONES
        // =================================================

        if (!cantidadParejas || cantidadParejas < 2) {

            alert(
                "Ingresá la cantidad de parejas."
            );

            return;
        }


        if (
            parejas.length !== cantidadParejas
        ) {

            alert(
                `Tenés que cargar exactamente ${cantidadParejas} parejas. Actualmente hay ${parejas.length}.`
            );

            return;
        }


        if (
            !parejasPorGrupo ||
            parejasPorGrupo < 2
        ) {

            alert(
                "Debe haber al menos 2 parejas por grupo."
            );

            return;
        }


        if (
            clasificadosPorGrupo < 1 ||
            clasificadosPorGrupo >= parejasPorGrupo
        ) {

            alert(
                "La cantidad de clasificados por grupo no es válida."
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


        // =================================================
        // FORMATO
        // =================================================

        const nombreFormato =
            obtenerNombreFormato(
                formatoTorneo
            );


        if (mensaje) {

            mensaje.innerHTML = `
                <strong>Torneo:</strong>
                ${nombreFormato}
            `;

        }


        // =================================================
        // CREAR GRUPOS
        // =================================================

        crearGrupos();


        // =================================================
        // MOSTRAR
        // =================================================

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


        torneoGenerado = true;


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


        // Mezclar parejas

        const mezcladas =
            mezclarArray(
                [...parejas]
            );


        let indice = 0;

        let numeroGrupo = 0;


        while (
            indice <
            mezcladas.length
        ) {

            const cantidadGrupo =
                Math.min(
                    parejasPorGrupo,
                    mezcladas.length - indice
                );


            const grupo = {

                id:
                    numeroGrupo,

                nombre:
                    `Grupo ${
                        letrasGrupos[numeroGrupo]
                        ||
                        numeroGrupo + 1
                    }`,

                parejas:
                    [],

                clasificados:
                    []

            };


            for (
                let i = 0;
                i < cantidadGrupo;
                i++
            ) {

                const pareja =
                    mezcladas[indice];


                pareja.grupo =
                    grupo.nombre;


                pareja.posicion =
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


            numeroGrupo++;

        }

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

                const parejaA =
                    grupo.parejas[i];

                const parejaB =
                    grupo.parejas[j];


                const partido = {

                    id:
                        `grupo-${grupo.id}-${parejaA.id}-${parejaB.id}`,

                    fase:
                        "grupos",

                    grupo:
                        grupo.id,

                    parejaA:
                        parejaA.id,

                    parejaB:
                        parejaB.id,

                    resultado:
                        null,

                    ganador:
                        null

                };


                const existente =
                    partidos.find(
                        p =>
                            p.id === partido.id
                    );


                if (!existente) {

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

        }

    }


    // =====================================================
    // CREAR HTML PARTIDO
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


        let resultado =
            guardado?.resultado;


        div.innerHTML = `

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


            <div class="resultado-inputs">

                <input
                    type="number"
                    min="0"
                    class="resultado-a"
                    placeholder="0"
                    value="${
                        resultado?.a ?? ""
                    }"
                >

                <span>
                    -
                </span>

                <input
                    type="number"
                    min="0"
                    class="resultado-b"
                    placeholder="0"
                    value="${
                        resultado?.b ?? ""
                    }"
                >

                <button
                    class="btn-guardar-resultado"
                >
                    Guardar
                </button>

            </div>

        `;


        const inputA =
            div.querySelector(
                ".resultado-a"
            );


        const inputB =
            div.querySelector(
                ".resultado-b"
            );


        const btn =
            div.querySelector(
                ".btn-guardar-resultado"
            );


        btn.addEventListener(
            "click",
            () => {

                const a =
                    parseInt(
                        inputA.value
                    );


                const b =
                    parseInt(
                        inputB.value
                    );


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


                guardarResultado(
                    partido.id,
                    a,
                    b
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
        resultadoA,
        resultadoB
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


        partido.resultado = {

            a:
                resultadoA,

            b:
                resultadoB

        };


        // Determinar ganador

        if (
            resultadoA >
            resultadoB
        ) {

            partido.ganador =
                partido.parejaA;

        }

        else if (
            resultadoB >
            resultadoA
        ) {

            partido.ganador =
                partido.parejaB;

        }

        else {

            partido.ganador =
                null;

        }


        // Actualizar tabla

        actualizarTablaGrupo(
            partido
        );


        guardarDatos();


        mostrarZonas();


        generarEliminacion();


        alert(
            "Resultado guardado correctamente."
        );

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


        // Reset

        grupo.parejas.forEach(
            pareja => {

                pareja.puntos = 0;

                pareja.partidosJugados =
                    0;

                pareja.diferenciaGames =
                    0;

            }
        );


        // Recorrer partidos del grupo

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
                        p.resultado.a -
                        p.resultado.b;


                    parejaB.diferenciaGames +=
                        p.resultado.b -
                        p.resultado.a;


                    if (
                        p.resultado.a >
                        p.resultado.b
                    ) {

                        parejaA.puntos += 2;

                    }

                    else if (
                        p.resultado.b >
                        p.resultado.a
                    ) {

                        parejaB.puntos += 2;

                    }

                    else {

                        parejaA.puntos += 1;

                        parejaB.puntos += 1;

                    }

                }
            );


        // Ordenar tabla

        grupo.parejas.sort(
            (a, b) => {

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
        );


        // Actualizar posiciones

        grupo.parejas.forEach(
            (pareja, index) => {

                pareja.posicion =
                    index + 1;

            }
        );

    }


    // =====================================================
    // GENERAR ELIMINACIÓN
    // =====================================================

    function generarEliminacion() {

        if (!cuadroEliminacion) {
            return;
        }


        cuadroEliminacion.innerHTML = "";


        // ================================================
        // OBTENER CLASIFICADOS
        // ================================================

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


        // ================================================
        // MEJORES TERCEROS
        // ================================================

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


        // ================================================
        // MOSTRAR CANTIDAD
        // ================================================

        if (totalClasificados) {

            totalClasificados.textContent =
                clasificados.length;

        }


        // ================================================
        // TODAVÍA NO TERMINÓ LA FASE DE GRUPOS
        // ================================================

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


        // ================================================
        // CREAR PRIMERA RONDA
        // ================================================

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
    // GENERAR LLAVE
    // =====================================================

    function generarLlaveEliminacion(
        clasificados
    ) {

        let cantidad =
            clasificados.length;


        // ================================================
        // NOMBRE DE LA RONDA
        // ================================================

        const nombreRonda =
            obtenerNombreRonda(
                cantidad
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


        // ================================================
        // CREAR PARTIDOS
        // ================================================

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

            const parejaA =
                clasificados[i];


            const parejaB =
                clasificados[i + 1];


            if (!parejaB) {
                break;
            }


            const partidoId =
                `eliminacion-${nombreRonda}-${i}`;


            let partido =
                partidos.find(
                    p =>
                        p.id ===
                        partidoId
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
                document.createElement(
                    "div"
                );


            div.className =
                "partido-card";


            div.innerHTML = `

                <div class="partido-numero">
                    Partido ${i / 2 + 1}
                </div>

                <div class="partido-jugadores">

                    <div>
                        <strong>
                            ${parejaA.pareja.nombre}
                        </strong>

                        <small>
                            ${parejaA.grupo}
                            -
                            ${parejaA.posicion}°
                        </small>
                    </div>

                    <strong>
                        VS
                    </strong>

                    <div>
                        <strong>
                            ${parejaB.pareja.nombre}
                        </strong>

                        <small>
                            ${parejaB.grupo}
                            -
                            ${parejaB.posicion}°
                        </small>
                    </div>

                </div>

                <div class="resultado-inputs">

                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        class="resultado-a"
                        value="${
                            partido.resultado?.a ??
                            ""
                        }"
                    >

                    <span>
                        -
                    </span>

                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        class="resultado-b"
                        value="${
                            partido.resultado?.b ??
                            ""
                        }"
                    >

                    <button
                        class="btn-guardar-resultado"
                    >
                        Guardar
                    </button>

                </div>

            `;


            const inputA =
                div.querySelector(
                    ".resultado-a"
                );


            const inputB =
                div.querySelector(
                    ".resultado-b"
                );


            const boton =
                div.querySelector(
                    ".btn-guardar-resultado"
                );


            boton.addEventListener(
                "click",
                () => {

                    const a =
                        parseInt(
                            inputA.value
                        );


                    const b =
                        parseInt(
                            inputB.value
                        );


                    if (
                        isNaN(a) ||
                        isNaN(b)
                    ) {

                        alert(
                            "Ingresá el resultado."
                        );

                        return;

                    }


                    if (a === b) {

                        alert(
                            "En eliminación directa tiene que haber un ganador."
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


                    guardarDatos();


                    alert(
                        "Resultado guardado."
                    );


                    generarSiguienteRonda();

                }
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
    // SIGUIENTE RONDA
    // =====================================================

    function generarSiguienteRonda() {

        const rondaActual =
            obtenerUltimaRonda();


        if (!rondaActual) {
            return;
        }


        const partidosRonda =
            partidos.filter(
                p =>
                    p.fase ===
                    rondaActual
            );


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

            return;

        }


        const siguiente =
            siguienteNombreRonda(
                rondaActual
            );


        const clasificados =
            ganadores.map(
                pareja => ({

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


            const partido = {

                id:
                    `${nombreRonda}-${Date.now()}-${i}`,

                fase:
                    nombreRonda,

                parejaA:
                    parejaA.id,

                parejaB:
                    parejaB.id,

                resultado:
                    null,

                ganador:
                    null

            };


            partidos.push(
                partido
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
    // ÚLTIMA RONDA
    // =====================================================

    function obtenerUltimaRonda() {

        const rondas = [
            "Final",
            "Semifinal",
            "Cuartos de final",
            "Octavos de final",
            "Ronda de 32"
        ];


        for (
            const ronda of rondas
        ) {

            if (
                partidos.some(
                    p =>
                        p.fase ===
                        ronda
                )
            ) {

                return ronda;

            }

        }


        return null;

    }


    // =====================================================
    // SIGUIENTE RONDA
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

            case "2_sets_super":

                return "2 sets + Super Tie-Break";

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
                "¿Querés comenzar un torneo nuevo? Se borrará el torneo actual."
            );


        if (!confirmar) {
            return;
        }


        localStorage.removeItem(
            "torneoClubDeportivo"
        );


        location.reload();

    }


    // =====================================================
    // GUARDAR
    // =====================================================

    function guardarDatos() {

        const datos = {

            cantidadParejas,

            parejasPorGrupo,

            clasificadosPorGrupo,

            mejoresTerceros,

            formatoTorneo,

            parejas,

            grupos,

            partidos,

            torneoGenerado

        };


        localStorage.setItem(
            "torneoClubDeportivo",
            JSON.stringify(datos)
        );

    }


    // =====================================================
    // CARGAR
    // =====================================================

    function cargarTorneo() {

        const datosGuardados =
            localStorage.getItem(
                "torneoClubDeportivo"
            );


        if (!datosGuardados) {

            mostrarParejas();

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


            parejas =
                datos.parejas ||
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


            // Cargar inputs

            if (
                cantidadParejasInput &&
                cantidadParejas
            ) {

                cantidadParejasInput.value =
                    cantidadParejas;

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


            mostrarParejas();


            actualizarContador();


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

            }

        }

        catch (error) {

            console.error(
                "Error cargando torneo:",
                error
            );

            localStorage.removeItem(
                "torneoClubDeportivo"
            );

        }

    }

});