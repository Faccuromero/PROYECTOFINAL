/* =========================================================
   GESTIÓN DE TORNEOS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "club_deportivo_torneo";

    let estado = {
        paso: 1,

        nombre: "",
        categoria: "",
        modalidad: "",

        cantidadParejas: 0,
        parejas: [],

        cantidadZonas: 0,
        clasificadosPorZona: 0,
        mejoresTerceros: 0,
        distribucion: [],

        zonas: [],
        partidos: [],

        clasificados: [],

        rondas: [],
        campeon: null
    };

    let parejaEditando = null;


    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const $ = id => document.getElementById(id);

    const nombreTorneo = $("nombreTorneo");
    const categoriaTorneo = $("categoriaTorneo");
    const tipoTorneo = $("tipoTorneo");

    const cantidadParejas = $("cantidadParejas");

    const categoriaPareja = $("categoriaPareja");
    const jugador1NombreCompleto = $("jugador1NombreCompleto");
    const jugador2NombreCompleto = $("jugador2NombreCompleto");

    const cantidadGrupos = $("cantidadGrupos");
    const clasificadosPorGrupo = $("clasificadosPorGrupo");
    const cantidadMejoresTerceros = $("cantidadMejoresTerceros");

    const listaParejas = $("listaParejas");
    const contenedorConfiguracionZonas =
        $("contenedorConfiguracionZonas");

    const mensaje = $("mensaje");


    /* =====================================================
       UTILIDADES
    ====================================================== */

    function mostrarMensaje(texto, tipo = "info") {

        if (!mensaje) return;

        mensaje.textContent = texto;
        mensaje.className = "mensaje visible " + tipo;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        clearTimeout(mostrarMensaje.timer);

        mostrarMensaje.timer = setTimeout(() => {
            mensaje.className = "mensaje";
            mensaje.textContent = "";
        }, 4500);
    }


    function guardar() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(estado)
        );
    }


    function cargar() {

        const guardado =
            localStorage.getItem(STORAGE_KEY);

        if (!guardado) return;

        try {

            const datos =
                JSON.parse(guardado);

            estado = {
                ...estado,
                ...datos
            };

        } catch (error) {

            console.error(error);

            localStorage.removeItem(STORAGE_KEY);
        }
    }


    function escapeHTML(texto) {

        const div =
            document.createElement("div");

        div.textContent = texto ?? "";

        return div.innerHTML;
    }


    function nombreCategoria(valor) {

        const categorias = {

            primera: "Primera categoría",
            segunda: "Segunda categoría",
            tercera: "Tercera categoría",
            cuarta: "Cuarta categoría",
            quinta: "Quinta categoría",
            sexta: "Sexta categoría",
            septima: "Séptima categoría",
            octava: "Octava categoría"

        };

        return categorias[valor] || valor;
    }


    function nombreModalidad(valor) {

        const modalidades = {

            "9_games":
                "Partido a 9 games",

            "2_sets_supertiebreak":
                "2 sets + Super Tie-Break",

            "partido_completo":
                "Partido completo - 3er set"

        };

        return modalidades[valor] || valor;
    }


    function crearId(prefijo = "id") {

        return prefijo + "_" +
            Date.now().toString(36) +
            Math.random()
                .toString(36)
                .substring(2, 8);
    }


    function parejaNombre(pareja) {

        if (!pareja) return "Pareja desconocida";

        return `${pareja.jugador1} / ${pareja.jugador2}`;
    }


    /* =====================================================
       RESULTADOS
    ====================================================== */

    function normalizarResultado(resultado) {

        if (!resultado) {

            return {
                games1: null,
                set1: null,
                set2: null,
                set3: null
            };
        }

        if (typeof resultado === "number") {

            return {
                games1: resultado,
                set1: null,
                set2: null,
                set3: null
            };
        }

        return {

            games1:
                resultado.games1 !== undefined &&
                resultado.games1 !== null
                    ? Number(resultado.games1)
                    : null,

            set1:
                resultado.set1 !== undefined &&
                resultado.set1 !== null
                    ? Number(resultado.set1)
                    : null,

            set2:
                resultado.set2 !== undefined &&
                resultado.set2 !== null
                    ? Number(resultado.set2)
                    : null,

            set3:
                resultado.set3 !== undefined &&
                resultado.set3 !== null
                    ? Number(resultado.set3)
                    : null
        };
    }


    function esModalidadSets() {

        return (
            estado.modalidad ===
            "2_sets_supertiebreak" ||

            estado.modalidad ===
            "partido_completo"
        );
    }


    function textoTercerResultado() {

        return estado.modalidad ===
            "2_sets_supertiebreak"
                ? "Super Tie-Break"
                : "3er Set";
    }


    /* =====================================================
       VALIDACIÓN DE SETS
       
       RESULTADOS VÁLIDOS:

       6-0
       6-1
       6-2
       6-3
       6-4
       7-5
       7-6

       NO VÁLIDOS:

       6-6
       7-7
       8-7
       5-6
       4-6 -> sí es válido si gana el otro
    ====================================================== */

    function validarSetNormal(a, b) {

        if (
            a === null ||
            b === null ||
            a === undefined ||
            b === undefined
        ) {

            return {
                valido: false,
                mensaje: "Falta completar el resultado del set."
            };
        }


        a = Number(a);
        b = Number(b);


        if (
            !Number.isInteger(a) ||
            !Number.isInteger(b)
        ) {

            return {
                valido: false,
                mensaje: "Los games deben ser números enteros."
            };
        }


        if (a < 0 || b < 0) {

            return {
                valido: false,
                mensaje: "Los games no pueden ser negativos."
            };
        }


        if (a === b) {

            return {
                valido: false,
                mensaje: "Un set no puede terminar empatado."
            };
        }


        /*
            Nadie puede superar 7 games
            en un set tradicional.
        */

        if (a > 7 || b > 7) {

            return {
                valido: false,
                mensaje: "Un set tradicional no puede superar los 7 games."
            };
        }


        const ganador =
            Math.max(a, b);

        const perdedor =
            Math.min(a, b);


        /*
            Victoria 6-0 hasta 6-4
        */

        if (
            ganador === 6 &&
            perdedor >= 0 &&
            perdedor <= 4
        ) {

            return {
                valido: true
            };
        }


        /*
            Victoria 7-5
        */

        if (
            ganador === 7 &&
            perdedor === 5
        ) {

            return {
                valido: true
            };
        }


        /*
            Victoria 7-6
        */

        if (
            ganador === 7 &&
            perdedor === 6
        ) {

            return {
                valido: true
            };
        }


        return {
            valido: false,
            mensaje:
                `Resultado de set imposible: ${a}-${b}. ` +
                `Usá resultados como 6-3, 6-4, 7-5 o 7-6.`
        };
    }


    /* =====================================================
       VALIDAR SUPER TIE-BREAK

       Se juega a 10 puntos como mínimo
       y debe ganarse por diferencia de 2.

       Válidos:
       10-0
       10-8
       10-9 ❌
       11-9
       12-10
       15-13

       No válidos:
       9-8
       10-9
       10-10
    ====================================================== */

    function validarSuperTieBreak(a, b) {

        if (
            a === null ||
            b === null
        ) {

            return {
                valido: false,
                mensaje:
                    "Ingresá el resultado del Super Tie-Break."
            };
        }


        a = Number(a);
        b = Number(b);


        if (
            !Number.isInteger(a) ||
            !Number.isInteger(b)
        ) {

            return {
                valido: false,
                mensaje:
                    "El Super Tie-Break debe contener números enteros."
            };
        }


        if (a < 0 || b < 0) {

            return {
                valido: false,
                mensaje:
                    "Los puntos no pueden ser negativos."
            };
        }


        if (a === b) {

            return {
                valido: false,
                mensaje:
                    "El Super Tie-Break no puede terminar empatado."
            };
        }


        const ganador =
            Math.max(a, b);

        const diferencia =
            Math.abs(a - b);


        if (
            ganador < 10
        ) {

            return {
                valido: false,
                mensaje:
                    "El Super Tie-Break debe llegar como mínimo a 10 puntos."
            };
        }


        if (
            diferencia < 2
        ) {

            return {
                valido: false,
                mensaje:
                    "El Super Tie-Break debe ganarse por 2 puntos de diferencia."
            };
        }


        return {
            valido: true
        };
    }


    /* =====================================================
       DETERMINAR GANADOR
    ====================================================== */

    function calcularGanadorResultado(
        resultado1,
        resultado2
    ) {

        const r1 =
            normalizarResultado(
                resultado1
            );

        const r2 =
            normalizarResultado(
                resultado2
            );


        /* =================================================
           9 GAMES
        ================================================= */

        if (
            estado.modalidad ===
            "9_games"
        ) {

            if (
                r1.games1 === null ||
                r2.games1 === null
            ) {

                return null;
            }


            if (
                r1.games1 >
                r2.games1
            ) {

                return 1;
            }


            if (
                r2.games1 >
                r1.games1
            ) {

                return 2;
            }


            return null;
        }


        /* =================================================
           SETS
        ================================================= */

        let sets1 = 0;
        let sets2 = 0;


        if (
            r1.set1 !== null &&
            r2.set1 !== null
        ) {

            if (
                r1.set1 >
                r2.set1
            ) {

                sets1++;

            } else {

                sets2++;
            }
        }


        if (
            r1.set2 !== null &&
            r2.set2 !== null
        ) {

            if (
                r1.set2 >
                r2.set2
            ) {

                sets1++;

            } else {

                sets2++;
            }
        }


        if (sets1 === 2) {
            return 1;
        }


        if (sets2 === 2) {
            return 2;
        }


        /*
            Si quedaron 1-1,
            se necesita el tercer resultado.
        */

        if (
            sets1 === 1 &&
            sets2 === 1
        ) {

            if (
                r1.set3 === null ||
                r2.set3 === null
            ) {

                return null;
            }


            if (
                r1.set3 >
                r2.set3
            ) {

                return 1;
            }


            if (
                r2.set3 >
                r1.set3
            ) {

                return 2;
            }
        }


        return null;
    }


    /* =====================================================
       VALIDAR RESULTADO COMPLETO
    ====================================================== */

    function validarResultado(
        resultado1,
        resultado2
    ) {

        const r1 =
            normalizarResultado(
                resultado1
            );

        const r2 =
            normalizarResultado(
                resultado2
            );


        /* =================================================
           9 GAMES
        ================================================= */

        if (
            estado.modalidad ===
            "9_games"
        ) {

            if (
                r1.games1 === null ||
                r2.games1 === null
            ) {

                return {
                    valido: false,
                    mensaje:
                        "Ingresá el resultado de las dos parejas."
                };
            }


            if (
                r1.games1 < 0 ||
                r2.games1 < 0
            ) {

                return {
                    valido: false,
                    mensaje:
                        "Los games no pueden ser negativos."
                };
            }


            if (
                r1.games1 ===
                r2.games1
            ) {

                return {
                    valido: false,
                    mensaje:
                        "Un partido no puede terminar empatado."
                };
            }


            if (
                Math.max(
                    r1.games1,
                    r2.games1
                ) !== 9
            ) {

                return {
                    valido: false,
                    mensaje:
                        "En la modalidad a 9 games, el ganador debe llegar exactamente a 9. Ejemplo: 9-6."
                };
            }


            return {
                valido: true
            };
        }


        /* =================================================
           SET 1
        ================================================= */

        const set1 =
            validarSetNormal(
                r1.set1,
                r2.set1
            );


        if (!set1.valido) {

            return {
                valido: false,
                mensaje:
                    "Set 1: " +
                    set1.mensaje
            };
        }


        /* =================================================
           SET 2
        ================================================= */

        const set2 =
            validarSetNormal(
                r1.set2,
                r2.set2
            );


        if (!set2.valido) {

            return {
                valido: false,
                mensaje:
                    "Set 2: " +
                    set2.mensaje
            };
        }


        let sets1 = 0;
        let sets2 = 0;


        if (
            r1.set1 >
            r2.set1
        ) {

            sets1++;

        } else {

            sets2++;
        }


        if (
            r1.set2 >
            r2.set2
        ) {

            sets1++;

        } else {

            sets2++;
        }


        /* =================================================
           PARTIDO 2-0
        ================================================= */

        if (
            sets1 === 2 ||
            sets2 === 2
        ) {

            if (
                r1.set3 !== null ||
                r2.set3 !== null
            ) {

                return {
                    valido: false,
                    mensaje:
                        "El tercer set/Super Tie-Break no corresponde porque el partido terminó 2-0."
                };
            }


            return {
                valido: true
            };
        }


        /* =================================================
           PARTIDO 1-1
        ================================================= */

        if (
            r1.set3 === null ||
            r2.set3 === null
        ) {

            return {
                valido: false,
                mensaje:
                    estado.modalidad ===
                    "2_sets_supertiebreak"

                        ? "El partido quedó 1-1. Debés cargar el Super Tie-Break."

                        : "El partido quedó 1-1. Debés cargar el tercer set."
            };
        }


        /* =================================================
           TERCER RESULTADO
        ================================================= */

        if (
            estado.modalidad ===
            "2_sets_supertiebreak"
        ) {

            const superTB =
                validarSuperTieBreak(
                    r1.set3,
                    r2.set3
                );


            if (!superTB.valido) {

                return {
                    valido: false,
                    mensaje:
                        superTB.mensaje
                };
            }

        } else {

            const set3 =
                validarSetNormal(
                    r1.set3,
                    r2.set3
                );


            if (!set3.valido) {

                return {
                    valido: false,
                    mensaje:
                        "3er Set: " +
                        set3.mensaje
                };
            }
        }


        return {
            valido: true
        };
    }


    /* =====================================================
       RESULTADO TERCER SET NECESARIO
    ====================================================== */

    function resultadoTercerSetNecesario(
        r1,
        r2
    ) {

        if (
            estado.modalidad ===
            "9_games"
        ) {

            return false;
        }


        if (
            r1.set1 === null ||
            r2.set1 === null ||
            r1.set2 === null ||
            r2.set2 === null
        ) {

            return false;
        }


        let sets1 = 0;
        let sets2 = 0;


        if (
            r1.set1 >
            r2.set1
        ) {

            sets1++;

        } else {

            sets2++;
        }


        if (
            r1.set2 >
            r2.set2
        ) {

            sets1++;

        } else {

            sets2++;
        }


        return (
            sets1 === 1 &&
            sets2 === 1
        );
    }


    /* =====================================================
       PASOS
    ====================================================== */

    function mostrarPaso(numero) {

        estado.paso = numero;

        const pasos = [

            $("pasoDatos"),
            $("pasoParejas"),
            $("pasoZonas"),
            $("pasoConfirmar")

        ];


        pasos.forEach((panel, index) => {

            if (panel) {

                panel.classList.toggle(
                    "oculto",
                    index + 1 !== numero
                );
            }
        });


        for (
            let i = 1;
            i <= 4;
            i++
        ) {

            const indicador =
                $("indicadorPaso" + i);

            if (!indicador) continue;

            indicador.classList.remove(
                "activo",
                "completado"
            );


            if (i < numero) {

                indicador.classList.add(
                    "completado"
                );
            }


            if (i === numero) {

                indicador.classList.add(
                    "activo"
                );
            }
        }


        guardar();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    /* =====================================================
       PASO 1
    ====================================================== */

    tipoTorneo.addEventListener(
        "change",
        () => {

            const descripciones = {

                "9_games":
                    "Los partidos se juegan a 9 games. Ejemplo: 9-6.",

                "2_sets_supertiebreak":
                    "Se juegan 2 sets. Si quedan 1-1, se define con Super Tie-Break.",

                "partido_completo":
                    "Partido tradicional al mejor de 3 sets. Si quedan 1-1, se juega un tercer set."
            };


            $("descripcionTipoTorneo").textContent =
                descripciones[
                    tipoTorneo.value
                ] ||
                "Seleccioná una modalidad para conocer el formato.";
        }
    );


    $("btnContinuarDatos")
        .addEventListener(
            "click",
            () => {

                const nombre =
                    nombreTorneo.value.trim();

                const categoria =
                    categoriaTorneo.value;

                const modalidad =
                    tipoTorneo.value;


                if (!nombre) {

                    mostrarMensaje(
                        "Ingresá el nombre del torneo.",
                        "error"
                    );

                    nombreTorneo.focus();

                    return;
                }


                if (!categoria) {

                    mostrarMensaje(
                        "Seleccioná una categoría.",
                        "error"
                    );

                    categoriaTorneo.focus();

                    return;
                }


                if (!modalidad) {

                    mostrarMensaje(
                        "Seleccioná una modalidad.",
                        "error"
                    );

                    tipoTorneo.focus();

                    return;
                }


                estado.nombre =
                    nombre;

                estado.categoria =
                    categoria;

                estado.modalidad =
                    modalidad;


                categoriaPareja.value =
                    categoria;


                estado.paso = 2;

                guardar();

                actualizarFormulario();

                mostrarPaso(2);
            }
        );


    /* =====================================================
       PASO 2
    ====================================================== */

    cantidadParejas.addEventListener(
        "input",
        () => {

            let cantidad =
                parseInt(
                    cantidadParejas.value
                );


            if (isNaN(cantidad)) {
                cantidad = 0;
            }


            if (cantidad > 128) {

                cantidad = 128;

                cantidadParejas.value =
                    cantidad;
            }


            if (
                cantidad > 0 &&
                cantidad <
                estado.parejas.length
            ) {

                cantidad =
                    estado.parejas.length;

                cantidadParejas.value =
                    cantidad;


                mostrarMensaje(
                    `No podés establecer ${
                        cantidad - 1
                    } parejas porque ya hay ${
                        estado.parejas.length
                    } inscriptas.`,
                    "error"
                );
            }


            estado.cantidadParejas =
                cantidad;


            actualizarContador();

            guardar();
        }
    );


    function actualizarContador() {

        const total =
            estado.cantidadParejas || 0;

        const inscriptas =
            estado.parejas.length;


        $("contadorParejas").textContent =
            `${inscriptas} / ${total}`;


        const porcentaje =
            total > 0
                ? Math.min(
                    (inscriptas / total) * 100,
                    100
                )
                : 0;


        $("progresoParejas").style.width =
            porcentaje + "%";


        const estadoCupo =
            $("estadoCupo");


        if (!total) {

            estadoCupo.textContent =
                "Configurá primero el cupo.";

        } else if (
            inscriptas < total
        ) {

            estadoCupo.textContent =
                `Faltan ${
                    total - inscriptas
                } pareja(s) para completar el torneo.`;

        } else {

            estadoCupo.textContent =
                "✓ Cupo completo. No se pueden agregar más parejas.";
        }


        const boton =
            $("btnAgregarPareja");


        if (
            parejaEditando !== null
        ) {

            boton.disabled = false;

            boton.textContent =
                "✓ Guardar cambios";

        } else {

            boton.disabled =
                !total ||
                inscriptas >= total;

            boton.textContent =
                inscriptas >= total
                    ? "✓ Cupo completo"
                    : "+ Agregar pareja";
        }
    }


    /* =====================================================
       AGREGAR / EDITAR PAREJA
    ====================================================== */

    $("btnAgregarPareja")
        .addEventListener(
            "click",
            () => {

                if (
                    !estado.cantidadParejas
                ) {

                    mostrarMensaje(
                        "Primero indicá cuántas parejas participarán.",
                        "error"
                    );

                    cantidadParejas.focus();

                    return;
                }


                const categoria =
                    categoriaPareja.value;

                const jugador1 =
                    jugador1NombreCompleto.value.trim();

                const jugador2 =
                    jugador2NombreCompleto.value.trim();


                if (!categoria) {

                    mostrarMensaje(
                        "Seleccioná la categoría de la pareja.",
                        "error"
                    );

                    return;
                }


                if (
                    categoria !==
                    estado.categoria
                ) {

                    mostrarMensaje(
                        `La pareja debe pertenecer a ${
                            nombreCategoria(
                                estado.categoria
                            )
                        }.`,
                        "error"
                    );

                    categoriaPareja.value =
                        estado.categoria;

                    return;
                }


                if (
                    !jugador1 ||
                    !jugador2
                ) {

                    mostrarMensaje(
                        "Completá el nombre de los dos jugadores.",
                        "error"
                    );

                    return;
                }


                if (
                    jugador1.toLowerCase() ===
                    jugador2.toLowerCase()
                ) {

                    mostrarMensaje(
                        "Los dos jugadores de una pareja deben ser diferentes.",
                        "error"
                    );

                    return;
                }


                const jugadoresExistentes =
                    estado.parejas.filter(
                        pareja =>
                            pareja.id !==
                            parejaEditando
                    );


                const jugadorRepetido =
                    jugadoresExistentes.some(
                        pareja => {

                            const j1 =
                                pareja.jugador1
                                    .toLowerCase();

                            const j2 =
                                pareja.jugador2
                                    .toLowerCase();


                            return (
                                j1 === jugador1.toLowerCase() ||
                                j2 === jugador1.toLowerCase() ||
                                j1 === jugador2.toLowerCase() ||
                                j2 === jugador2.toLowerCase()
                            );
                        }
                    );


                if (jugadorRepetido) {

                    mostrarMensaje(
                        "Uno de los jugadores ya está inscripto en otra pareja.",
                        "error"
                    );

                    return;
                }


                if (
                    parejaEditando !== null
                ) {

                    const pareja =
                        estado.parejas.find(
                            p =>
                                p.id ===
                                parejaEditando
                        );


                    if (!pareja) {

                        cancelarEdicion();

                        return;
                    }


                    pareja.categoria =
                        categoria;

                    pareja.jugador1 =
                        jugador1;

                    pareja.jugador2 =
                        jugador2;


                    mostrarMensaje(
                        "Pareja modificada correctamente.",
                        "exito"
                    );


                    cancelarEdicion();

                    renderParejas();

                    guardar();

                    return;
                }


                if (
                    estado.parejas.length >=
                    estado.cantidadParejas
                ) {

                    mostrarMensaje(
                        "Ya alcanzaste el máximo de parejas permitido.",
                        "error"
                    );

                    return;
                }


                estado.parejas.push({

                    id:
                        crearId("pareja"),

                    numero:
                        estado.parejas.length + 1,

                    categoria,

                    jugador1,

                    jugador2

                });


                renderParejas();

                actualizarContador();

                limpiarFormularioPareja();

                guardar();


                if (
                    estado.parejas.length ===
                    estado.cantidadParejas
                ) {

                    mostrarMensaje(
                        "✓ Cupo completo. Ya podés continuar al siguiente paso.",
                        "exito"
                    );
                }
            }
        );


    function limpiarFormularioPareja() {

        categoriaPareja.value =
            estado.categoria || "";

        jugador1NombreCompleto.value =
            "";

        jugador2NombreCompleto.value =
            "";
    }


    function renderParejas() {

        if (!estado.parejas.length) {

            listaParejas.innerHTML = `
                <div class="sin-parejas">
                    👥 Todavía no agregaste ninguna pareja.
                </div>
            `;

            return;
        }


        listaParejas.innerHTML =
            estado.parejas.map(
                (pareja, index) => {

                    return `
                        <div class="pareja-card">

                            <div class="numero-pareja">
                                ${index + 1}
                            </div>

                            <div class="datos-pareja">

                                <strong>
                                    ${escapeHTML(
                                        pareja.jugador1
                                    )}
                                    /
                                    ${escapeHTML(
                                        pareja.jugador2
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        nombreCategoria(
                                            pareja.categoria
                                        )
                                    )}
                                </span>

                            </div>

                            <div class="acciones-card">

                                <button
                                    class="btn-editar"
                                    type="button"
                                    data-editar="${pareja.id}">
                                    ✏️ Editar
                                </button>

                                <button
                                    class="btn-eliminar"
                                    type="button"
                                    data-eliminar="${pareja.id}">
                                    🗑️ Eliminar
                                </button>

                            </div>

                        </div>
                    `;
                }
            ).join("");


        document
            .querySelectorAll("[data-editar]")
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        editarPareja(
                            btn.dataset.editar
                        );
                    }
                );
            });


        document
            .querySelectorAll("[data-eliminar]")
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        eliminarPareja(
                            btn.dataset.eliminar
                        );
                    }
                );
            });
    }


    function editarPareja(id) {

        const pareja =
            estado.parejas.find(
                p => p.id === id
            );

        if (!pareja) return;


        parejaEditando = id;


        categoriaPareja.value =
            pareja.categoria;

        jugador1NombreCompleto.value =
            pareja.jugador1;

        jugador2NombreCompleto.value =
            pareja.jugador2;


        $("btnAgregarPareja").textContent =
            "✓ Guardar cambios";


        $("btnCancelarEdicion")
            .classList.remove("oculto");


        actualizarContador();


        document
            .querySelector(".formulario-pareja")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
    }


    function cancelarEdicion() {

        parejaEditando = null;


        $("btnCancelarEdicion")
            .classList.add("oculto");


        $("btnAgregarPareja").textContent =
            "+ Agregar pareja";


        limpiarFormularioPareja();

        actualizarContador();
    }


    $("btnCancelarEdicion")
        .addEventListener(
            "click",
            cancelarEdicion
        );


    function eliminarPareja(id) {

        const pareja =
            estado.parejas.find(
                p => p.id === id
            );

        if (!pareja) return;


        const confirmar =
            confirm(
                `¿Eliminar la pareja "${parejaNombre(
                    pareja
                )}"?`
            );


        if (!confirmar) return;


        estado.parejas =
            estado.parejas.filter(
                p => p.id !== id
            );


        estado.parejas.forEach(
            (p, index) => {

                p.numero =
                    index + 1;
            }
        );


        if (
            parejaEditando === id
        ) {

            cancelarEdicion();
        }


        renderParejas();

        actualizarContador();

        guardar();


        mostrarMensaje(
            "Pareja eliminada correctamente.",
            "exito"
        );
    }


    /* =====================================================
       CONTINUAR PAREJAS
    ====================================================== */

    $("btnContinuarParejas")
        .addEventListener(
            "click",
            () => {

                if (
                    !estado.cantidadParejas
                ) {

                    mostrarMensaje(
                        "Indicá la cantidad de parejas.",
                        "error"
                    );

                    return;
                }


                if (
                    estado.parejas.length !==
                    estado.cantidadParejas
                ) {

                    mostrarMensaje(
                        `Debés completar las ${
                            estado.cantidadParejas
                        } parejas. Actualmente hay ${
                            estado.parejas.length
                        }.`,
                        "error"
                    );

                    return;
                }


                cancelarEdicion();

                estado.cantidadZonas =
                    estado.cantidadZonas || 1;


                mostrarPaso(3);

                actualizarConfiguracionZonas();
            }
        );


    $("btnVolverDatos")
        .addEventListener(
            "click",
            () => mostrarPaso(1)
        );


    /* =====================================================
       PASO 3 - ZONAS
    ====================================================== */

    cantidadGrupos.addEventListener(
        "input",
        actualizarConfiguracionZonas
    );


    clasificadosPorGrupo.addEventListener(
        "input",
        () => {

            estado.clasificadosPorZona =
                parseInt(
                    clasificadosPorGrupo.value
                ) || 0;

            guardar();
        }
    );


    cantidadMejoresTerceros.addEventListener(
        "input",
        () => {

            estado.mejoresTerceros =
                parseInt(
                    cantidadMejoresTerceros.value
                ) || 0;

            guardar();
        }
    );


    function actualizarConfiguracionZonas() {

        let cantidad =
            parseInt(
                cantidadGrupos.value
            ) || 0;


        if (cantidad < 1) {

            contenedorConfiguracionZonas.innerHTML = `
                <div class="sin-parejas">
                    Ingresá la cantidad de zonas.
                </div>
            `;


            $("resumenDistribucion").textContent =
                "0 / " +
                estado.parejas.length +
                " parejas";

            return;
        }


        if (
            cantidad >
            estado.parejas.length
        ) {

            cantidad =
                estado.parejas.length;

            cantidadGrupos.value =
                cantidad;


            mostrarMensaje(
                "No podés crear más zonas que parejas.",
                "error"
            );
        }


        estado.cantidadZonas =
            cantidad;


        const base =
            Math.floor(
                estado.parejas.length /
                cantidad
            );


        const resto =
            estado.parejas.length %
            cantidad;


        estado.distribucion =
            Array.from(
                {
                    length:
                        cantidad
                },
                (_, index) =>
                    base +
                    (
                        index < resto
                            ? 1
                            : 0
                    )
            );


        renderConfiguracionZonas();

        guardar();
    }


    function renderConfiguracionZonas() {

        if (
            !estado.cantidadZonas
        ) return;


        contenedorConfiguracionZonas.innerHTML =
            estado.distribucion.map(
                (cantidad, index) => {

                    return `
                        <div class="zona-configuracion">

                            <h4>
                                🏟️ Zona ${index + 1}
                            </h4>

                            <input
                                type="number"
                                min="1"
                                max="${estado.parejas.length}"
                                value="${cantidad}"
                                data-zona="${index}">

                            <small>
                                Parejas en esta zona
                            </small>

                        </div>
                    `;
                }
            ).join("");


        document
            .querySelectorAll("[data-zona]")
            .forEach(input => {

                input.addEventListener(
                    "input",
                    () => {

                        const index =
                            parseInt(
                                input.dataset.zona
                            );


                        estado.distribucion[index] =
                            parseInt(
                                input.value
                            ) || 0;


                        actualizarResumenDistribucion();

                        guardar();
                    }
                );
            });


        actualizarResumenDistribucion();
    }


    function actualizarResumenDistribucion() {

        const total =
            estado.distribucion.reduce(
                (sum, valor) =>
                    sum +
                    Number(
                        valor || 0
                    ),
                0
            );


        const objetivo =
            estado.parejas.length;


        const elemento =
            $("resumenDistribucion");


        elemento.textContent =
            `${total} / ${objetivo} parejas`;


        elemento.classList.remove(
            "correcto",
            "error"
        );


        if (
            total === objetivo
        ) {

            elemento.classList.add(
                "correcto"
            );

        } else {

            elemento.classList.add(
                "error"
            );
        }
    }


    function validarZonas() {

        const cantidad =
            parseInt(
                cantidadGrupos.value
            ) || 0;


        const clasificados =
            parseInt(
                clasificadosPorGrupo.value
            ) || 0;


        const terceros =
            parseInt(
                cantidadMejoresTerceros.value
            ) || 0;


        if (cantidad < 1) {

            mostrarMensaje(
                "Indicá la cantidad de zonas.",
                "error"
            );

            return false;
        }


        if (
            cantidad >
            estado.parejas.length
        ) {

            mostrarMensaje(
                "No podés tener más zonas que parejas.",
                "error"
            );

            return false;
        }


        if (clasificados < 1) {

            mostrarMensaje(
                "Indicá cuántas parejas clasifican de cada zona.",
                "error"
            );

            return false;
        }


        const totalDistribuido =
            estado.distribucion.reduce(
                (sum, value) =>
                    sum +
                    Number(
                        value || 0
                    ),
                0
            );


        if (
            totalDistribuido !==
            estado.parejas.length
        ) {

            mostrarMensaje(
                `La distribución debe sumar exactamente ${
                    estado.parejas.length
                } parejas.`,
                "error"
            );

            return false;
        }


        const zonaDemasiadoChica =
            estado.distribucion.some(
                cantidadZona =>
                    cantidadZona <
                    clasificados
            );


        if (zonaDemasiadoChica) {

            mostrarMensaje(
                "Una zona no puede tener menos parejas que clasificados.",
                "error"
            );

            return false;
        }


        if (
            terceros > 0 &&
            clasificados >= 3
        ) {

            mostrarMensaje(
                "No podés usar mejores terceros si ya clasifican 3 o más parejas por zona.",
                "error"
            );

            return false;
        }


        const totalClasificados =
            cantidad *
            clasificados +
            terceros;


        if (
            totalClasificados >
            estado.parejas.length
        ) {

            mostrarMensaje(
                "La cantidad de clasificados supera la cantidad de parejas.",
                "error"
            );

            return false;
        }


        estado.cantidadZonas =
            cantidad;

        estado.clasificadosPorZona =
            clasificados;

        estado.mejoresTerceros =
            terceros;


        return true;
    }


    $("btnContinuarZonas")
        .addEventListener(
            "click",
            () => {

                if (!validarZonas())
                    return;

                prepararResumen();

                mostrarPaso(4);
            }
        );


    $("btnVolverParejas")
        .addEventListener(
            "click",
            () => mostrarPaso(2)
        );


    /* =====================================================
       RESUMEN
    ====================================================== */

    function prepararResumen() {

        $("resumenNombreTorneo").textContent =
            estado.nombre;

        $("resumenCategoria").textContent =
            nombreCategoria(
                estado.categoria
            );

        $("resumenFormato").textContent =
            nombreModalidad(
                estado.modalidad
            );

        $("resumenParejas").textContent =
            estado.parejas.length;

        $("resumenZonas").textContent =
            estado.cantidadZonas;

        $("resumenClasificados").textContent =
            estado.clasificadosPorZona;

        $("resumenTerceros").textContent =
            estado.mejoresTerceros;
    }


    $("btnVolverZonas")
        .addEventListener(
            "click",
            () => mostrarPaso(3)
        );


    /* =====================================================
       GENERAR TORNEO
    ====================================================== */

    $("btnGenerar")
        .addEventListener(
            "click",
            generarTorneo
        );


    function generarTorneo() {

        if (!validarZonas()) {

            mostrarPaso(3);

            return;
        }


        const boton =
            $("btnGenerar");


        boton.disabled = true;

        boton.textContent =
            "⏳ GENERANDO...";


        setTimeout(() => {

            try {

                crearTorneo();

                mostrarResultadoInicial();

                guardar();


                mostrarMensaje(
                    "🏆 Torneo generado correctamente.",
                    "exito"
                );

            } catch (error) {

                console.error(error);


                mostrarMensaje(
                    "Ocurrió un error al generar el torneo.",
                    "error"
                );

            } finally {

                boton.disabled = false;

                boton.textContent =
                    "🎲 GENERAR TORNEO";
            }

        }, 400);
    }


    function crearTorneo() {

        const parejas =
            [...estado.parejas]
                .sort(
                    () =>
                        Math.random() - .5
                );


        estado.zonas = [];

        let posicion = 0;


        for (
            let i = 0;
            i < estado.cantidadZonas;
            i++
        ) {

            const cantidad =
                estado.distribucion[i];


            const parejasZona =
                parejas.slice(
                    posicion,
                    posicion + cantidad
                );


            posicion += cantidad;


            estado.zonas.push({

                id:
                    crearId("zona"),

                numero:
                    i + 1,

                parejas:
                    parejasZona.map(
                        pareja =>
                            pareja.id
                    )
            });
        }


        generarPartidos();


        estado.clasificados = [];

        estado.rondas = [];

        estado.campeon = null;
    }


    /* =====================================================
       PARTIDOS
    ====================================================== */

    function crearResultadoVacio() {

        return {
            games1: null,
            set1: null,
            set2: null,
            set3: null
        };
    }


    function generarPartidos() {

        estado.partidos = [];


        estado.zonas.forEach(
            zona => {

                const parejasZona =
                    zona.parejas;


                for (
                    let i = 0;
                    i < parejasZona.length;
                    i++
                ) {

                    for (
                        let j = i + 1;
                        j < parejasZona.length;
                        j++
                    ) {

                        estado.partidos.push({

                            id:
                                crearId("partido"),

                            zonaId:
                                zona.id,

                            pareja1:
                                parejasZona[i],

                            pareja2:
                                parejasZona[j],

                            resultado1:
                                crearResultadoVacio(),

                            resultado2:
                                crearResultadoVacio(),

                            jugado:
                                false
                        });
                    }
                }
            }
        );
    }


    function obtenerPareja(id) {

        return estado.parejas.find(
            pareja =>
                pareja.id === id
        );
    }


    /* =====================================================
       MOSTRAR TORNEO
    ====================================================== */

    function mostrarResultadoInicial() {

        $("pasoConfirmar")
            .classList.add("oculto");


        $("informacionTorneo")
            .classList.remove("oculto");


        $("contenedorZonas").innerHTML = "";


        $("seccionResultados")
            .classList.remove("oculto");


        $("seccionTablas")
            .classList.remove("oculto");


        $("seccionClasificados")
            .classList.remove("oculto");


        $("seccionEliminacion")
            .classList.remove("oculto");


        renderInformacion();

        renderZonas();

        renderPartidos();

        renderTablas();

        actualizarClasificados();

        renderEliminacion();
    }


    function renderInformacion() {

        $("nombreFormatoTorneo").textContent =
            "🏆 " + estado.nombre;


        $("totalParejas").textContent =
            estado.parejas.length;


        $("totalGrupos").textContent =
            estado.zonas.length;


        $("totalClasificados").textContent =
            calcularCantidadClasificados();
    }


    function calcularCantidadClasificados() {

        return (
            estado.cantidadZonas *
            estado.clasificadosPorZona +
            estado.mejoresTerceros
        );
    }


    function renderZonas() {

        const contenedor =
            $("contenedorZonas");


        contenedor.innerHTML =
            estado.zonas.map(
                zona => {

                    return `
                        <div class="zona-generada">

                            <div class="zona-header">

                                <h3>
                                    🏟️ Zona ${zona.numero}
                                </h3>

                                <span>
                                    ${zona.parejas.length} parejas
                                </span>

                            </div>

                            <div class="zona-parejas">

                                ${zona.parejas.map(
                                    (id, index) => {

                                        const pareja =
                                            obtenerPareja(id);

                                        return `
                                            <div class="pareja-zona">

                                                <div class="pareja-zona-numero">
                                                    ${index + 1}
                                                </div>

                                                <strong>
                                                    ${escapeHTML(
                                                        parejaNombre(
                                                            pareja
                                                        )
                                                    )}
                                                </strong>

                                            </div>
                                        `;
                                    }
                                ).join("")}

                            </div>

                        </div>
                    `;
                }
            ).join("");
    }


    /* =====================================================
       RESULTADOS - RENDER
    ====================================================== */

    function renderPartidos() {

        const contenedor =
            $("contenedorPartidos");


        if (!estado.partidos.length) {

            contenedor.innerHTML = `
                <div class="sin-parejas">
                    No hay partidos para generar.
                </div>
            `;

            return;
        }


        contenedor.innerHTML =
            estado.partidos.map(
                (partido, index) => {

                    const p1 =
                        obtenerPareja(
                            partido.pareja1
                        );

                    const p2 =
                        obtenerPareja(
                            partido.pareja2
                        );


                    if (!p1 || !p2)
                        return "";


                    const r1 =
                        normalizarResultado(
                            partido.resultado1
                        );

                    const r2 =
                        normalizarResultado(
                            partido.resultado2
                        );


                    const nombreFormato =
                        estado.modalidad ===
                            "9_games"

                            ? "9 GAMES"

                            : estado.modalidad ===
                                "2_sets_supertiebreak"

                                ? "2 SETS + SUPER TIE-BREAK"

                                : "PARTIDO COMPLETO - 3ER SET";


                    const tercerNecesario =
                        resultadoTercerSetNecesario(
                            r1,
                            r2
                        );


                    const tercerClase =
                        tercerNecesario
                            ? ""
                            : "oculto";


                    return `
                        <div class="partido-card">

                            <div class="partido-cabecera">

                                <span>
                                    PARTIDO ${index + 1}
                                </span>

                                <span>
                                    Zona ${obtenerZonaPartido(
                                        partido
                                    )}
                                </span>

                            </div>


                            <div class="partido-formato">
                                ${nombreFormato}
                            </div>


                            <div class="partido-jugadores">

                                <div class="equipo">

                                    <strong>
                                        ${escapeHTML(
                                            parejaNombre(p1)
                                        )}
                                    </strong>

                                </div>


                                <div class="sets-inputs">

                                    ${
                                        estado.modalidad ===
                                        "9_games"

                                            ? `
                                                <input
                                                    class="resultado-input"
                                                    type="number"
                                                    min="0"
                                                    max="9"
                                                    data-resultado="${partido.id}"
                                                    data-equipo="1"
                                                    data-tipo="games"
                                                    value="${
                                                        r1.games1 ??
                                                        ""
                                                    }"
                                                    placeholder="Games">
                                            `

                                            :

                                            `
                                                <input
                                                    class="resultado-input"
                                                    type="number"
                                                    min="0"
                                                    max="7"
                                                    data-resultado="${partido.id}"
                                                    data-equipo="1"
                                                    data-tipo="set1"
                                                    value="${
                                                        r1.set1 ??
                                                        ""
                                                    }"
                                                    placeholder="Set 1">

                                                <input
                                                    class="resultado-input"
                                                    type="number"
                                                    min="0"
                                                    max="7"
                                                    data-resultado="${partido.id}"
                                                    data-equipo="1"
                                                    data-tipo="set2"
                                                    value="${
                                                        r1.set2 ??
                                                        ""
                                                    }"
                                                    placeholder="Set 2">

                                                <input
                                                    class="resultado-input ${tercerClase}"
                                                    type="number"
                                                    min="0"
                                                    ${
                                                        estado.modalidad ===
                                                        "2_sets_supertiebreak"
                                                            ? 'max="100"'
                                                            : 'max="7"'
                                                    }
                                                    data-resultado="${partido.id}"
                                                    data-equipo="1"
                                                    data-tipo="set3"
                                                    value="${
                                                        r1.set3 ??
                                                        ""
                                                    }"
                                                    placeholder="${
                                                        estado.modalidad ===
                                                        "2_sets_supertiebreak"
                                                            ? "Super TB"
                                                            : "Set 3"
                                                    }">
                                            `
                                    }

                                </div>

                            </div>


                            <div class="partido-vs">
                                VS
                            </div>


                            <div class="partido-jugadores">

                                <div class="equipo">

                                    <strong>
                                        ${escapeHTML(
                                            parejaNombre(p2)
                                        )}
                                    </strong>

                                </div>


                                <div class="sets-inputs">

                                    ${
                                        estado.modalidad ===
                                        "9_games"

                                            ? `
                                                <input
                                                    class="resultado-input"
                                                    type="number"
                                                    min="0"
                                                    max="9"
                                                    data-resultado="${partido.id}"
                                                    data-equipo="2"
                                                    data-tipo="games"
                                                    value="${
                                                        r2.games1 ??
                                                        ""
                                                    }"
                                                    placeholder="Games">
                                            `

                                            :

                                            `
                                                <input
                                                    class="resultado-input"
                                                    type="number"
                                                    min="0"
                                                    max="7"
                                                    data-resultado="${partido.id}"
                                                    data-equipo="2"
                                                    data-tipo="set1"
                                                    value="${
                                                        r2.set1 ??
                                                        ""
                                                    }"
                                                    placeholder="Set 1">

                                                <input
                                                    class="resultado-input"
                                                    type="number"
                                                    min="0"
                                                    max="7"
                                                    data-resultado="${partido.id}"
                                                    data-equipo="2"
                                                    data-tipo="set2"
                                                    value="${
                                                        r2.set2 ??
                                                        ""
                                                    }"
                                                    placeholder="Set 2">

                                                <input
                                                    class="resultado-input ${tercerClase}"
                                                    type="number"
                                                    min="0"
                                                    ${
                                                        estado.modalidad ===
                                                        "2_sets_supertiebreak"
                                                            ? 'max="100"'
                                                            : 'max="7"'
                                                    }
                                                    data-resultado="${partido.id}"
                                                    data-equipo="2"
                                                    data-tipo="set3"
                                                    value="${
                                                        r2.set3 ??
                                                        ""
                                                    }"
                                                    placeholder="${
                                                        estado.modalidad ===
                                                        "2_sets_supertiebreak"
                                                            ? "Super TB"
                                                            : "Set 3"
                                                    }">
                                            `
                                    }

                                </div>

                            </div>


                            <button
                                class="btn-guardar-resultado"
                                data-guardar-partido="${partido.id}"
                                type="button">

                                ${
                                    partido.jugado
                                        ? "✓ Resultado guardado"
                                        : "Guardar resultado"
                                }

                            </button>

                        </div>
                    `;
                }
            ).join("");


        document
            .querySelectorAll(
                "[data-guardar-partido]"
            )
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        guardarResultado(
                            btn.dataset
                                .guardarPartido
                        );

                    }
                );

            });


        /*
            Detectar cambios de set 1 y set 2
            para mostrar/ocultar el tercer resultado.
        */

        document
            .querySelectorAll(
                ".resultado-input"
            )
            .forEach(input => {

                input.addEventListener(
                    "input",
                    () => {

                        actualizarCamposTercerResultado();
                    }
                );
            });


        actualizarCamposTercerResultado();
    }


    /* =====================================================
       ACTUALIZAR CAMPOS DEL TERCER RESULTADO
    ====================================================== */

    function actualizarCamposTercerResultado() {

        if (
            estado.modalidad ===
            "9_games"
        ) {
            return;
        }


        estado.partidos.forEach(
            partido => {

                const r1 =
                    leerResultadoDOM(
                        partido.id,
                        1
                    );

                const r2 =
                    leerResultadoDOM(
                        partido.id,
                        2
                    );


                const necesario =
                    resultadoTercerSetNecesario(
                        r1,
                        r2
                    );


                document
                    .querySelectorAll(
                        `[data-resultado="${partido.id}"][data-tipo="set3"]`
                    )
                    .forEach(input => {

                        input.classList.toggle(
                            "oculto",
                            !necesario
                        );

                        /*
                            Si deja de corresponder,
                            limpiamos visualmente el campo.
                        */

                        if (!necesario) {
                            input.value = "";
                        }
                    });
            }
        );
    }


    /* =====================================================
       LEER RESULTADO DEL DOM
    ====================================================== */

    function leerResultadoDOM(
        id,
        equipo
    ) {

        const obtener =
            tipo => {

                const input =
                    document.querySelector(
                        `[data-resultado="${id}"][data-equipo="${equipo}"][data-tipo="${tipo}"]`
                    );


                if (!input)
                    return null;


                const valor =
                    input.value.trim();


                if (
                    valor === ""
                ) {

                    return null;
                }


                const numero =
                    Number(valor);


                return Number.isInteger(numero)
                    ? numero
                    : null;
            };


        return {

            games1:
                obtener("games"),

            set1:
                obtener("set1"),

            set2:
                obtener("set2"),

            set3:
                obtener("set3")
        };
    }


    function obtenerZonaPartido(
        partido
    ) {

        const zona =
            estado.zonas.find(
                z =>
                    z.id ===
                    partido.zonaId
            );


        return zona
            ? zona.numero
            : "?";
    }


    /* =====================================================
       GUARDAR RESULTADO
    ====================================================== */

    function guardarResultado(id) {

        const partido =
            estado.partidos.find(
                p =>
                    p.id === id
            );


        if (!partido)
            return;


        const resultado1 =
            leerResultadoDOM(
                id,
                1
            );


        const resultado2 =
            leerResultadoDOM(
                id,
                2
            );


        const validacion =
            validarResultado(
                resultado1,
                resultado2
            );


        if (!validacion.valido) {

            mostrarMensaje(
                validacion.mensaje,
                "error"
            );

            return;
        }


        const ganador =
            calcularGanadorResultado(
                resultado1,
                resultado2
            );


        if (!ganador) {

            mostrarMensaje(
                "No se pudo determinar el ganador del partido.",
                "error"
            );

            return;
        }


        /*
            GUARDAMOS EL RESULTADO
            EN EL LUGAR CORRECTO.
        */

        partido.resultado1 = {
            ...resultado1
        };

        partido.resultado2 = {
            ...resultado2
        };

        partido.jugado = true;


        guardar();


        /*
            ACTUALIZAMOS TODO
            INMEDIATAMENTE.
        */

        renderPartidos();

        renderTablas();

        actualizarClasificados();

        renderEliminacion();


        mostrarMensaje(
            `Resultado guardado. Ganó ${
                ganador === 1
                    ? parejaNombre(
                        obtenerPareja(
                            partido.pareja1
                        )
                    )
                    : parejaNombre(
                        obtenerPareja(
                            partido.pareja2
                        )
                    )
            }.`,
            "exito"
        );
    }


    /* =====================================================
       TABLAS
    ====================================================== */

    function calcularTabla(zona) {

        const tabla =
            zona.parejas.map(
                id => {

                    const pareja =
                        obtenerPareja(id);


                    return {

                        id,

                        nombre:
                            parejaNombre(
                                pareja
                            ),

                        pj: 0,

                        pg: 0,

                        pp: 0,

                        gf: 0,

                        gc: 0,

                        dg: 0,

                        puntos: 0
                    };
                }
            );


        const buscar =
            id =>
                tabla.find(
                    pareja =>
                        pareja.id === id
                );


        estado.partidos
            .filter(
                partido =>
                    partido.zonaId ===
                    zona.id &&
                    partido.jugado
            )
            .forEach(
                partido => {

                    const p1 =
                        buscar(
                            partido.pareja1
                        );

                    const p2 =
                        buscar(
                            partido.pareja2
                        );


                    if (!p1 || !p2)
                        return;


                    p1.pj++;
                    p2.pj++;


                    const r1 =
                        normalizarResultado(
                            partido.resultado1
                        );

                    const r2 =
                        normalizarResultado(
                            partido.resultado2
                        );


                    /*
                        GF / GC
                    */

                    let gf1 = 0;
                    let gf2 = 0;


                    if (
                        estado.modalidad ===
                        "9_games"
                    ) {

                        gf1 =
                            r1.games1 ?? 0;

                        gf2 =
                            r2.games1 ?? 0;

                    } else {

                        gf1 =
                            (r1.set1 ?? 0) +
                            (r1.set2 ?? 0);

                        gf2 =
                            (r2.set1 ?? 0) +
                            (r2.set2 ?? 0);


                        /*
                            IMPORTANTE:

                            En Super Tie-Break
                            NO lo contamos como games.

                            Solamente sirve para
                            determinar quién ganó.
                        */

                        if (
                            estado.modalidad ===
                            "partido_completo"
                        ) {

                            gf1 +=
                                r1.set3 ?? 0;

                            gf2 +=
                                r2.set3 ?? 0;
                        }
                    }


                    p1.gf += gf1;
                    p1.gc += gf2;

                    p2.gf += gf2;
                    p2.gc += gf1;


                    const ganador =
                        calcularGanadorResultado(
                            r1,
                            r2
                        );


                    if (
                        ganador === 1
                    ) {

                        p1.pg++;
                        p2.pp++;

                        p1.puntos += 3;

                    } else if (
                        ganador === 2
                    ) {

                        p2.pg++;
                        p1.pp++;

                        p2.puntos += 3;
                    }
                }
            );


        tabla.forEach(
            pareja => {

                pareja.dg =
                    pareja.gf -
                    pareja.gc;
            }
        );


        /*
            ORDEN DE TABLA

            1. Puntos
            2. Diferencia de games
            3. Games a favor
            4. Nombre
        */

        tabla.sort(
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


                if (
                    b.dg !==
                    a.dg
                ) {

                    return (
                        b.dg -
                        a.dg
                    );
                }


                if (
                    b.gf !==
                    a.gf
                ) {

                    return (
                        b.gf -
                        a.gf
                    );
                }


                return a.nombre.localeCompare(
                    b.nombre
                );
            }
        );


        tabla.forEach(
            (pareja, index) => {

                pareja.posicion =
                    index + 1;
            }
        );


        return tabla;
    }


    function renderTablas() {

        const contenedor =
            $("contenedorTablas");


        contenedor.innerHTML =
            estado.zonas.map(
                zona => {

                    const tabla =
                        calcularTabla(
                            zona
                        );


                    return `
                        <div class="tabla-zona">

                            <h3>
                                🏟️ Zona ${zona.numero}
                            </h3>

                            <table>

                                <thead>

                                    <tr>
                                        <th>#</th>
                                        <th>Pareja</th>
                                        <th>PJ</th>
                                        <th>PG</th>
                                        <th>PP</th>
                                        <th>DG</th>
                                        <th>Pts</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    ${tabla.map(
                                        p => {

                                            return `
                                                <tr>

                                                    <td>
                                                        ${p.posicion}
                                                    </td>

                                                    <td>
                                                        ${escapeHTML(
                                                            p.nombre
                                                        )}
                                                    </td>

                                                    <td>
                                                        ${p.pj}
                                                    </td>

                                                    <td>
                                                        ${p.pg}
                                                    </td>

                                                    <td>
                                                        ${p.pp}
                                                    </td>

                                                    <td>
                                                        ${p.dg}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            ${p.puntos}
                                                        </strong>
                                                    </td>

                                                </tr>
                                            `;
                                        }
                                    ).join("")}

                                </tbody>

                            </table>

                        </div>
                    `;
                }
            ).join("");
    }


    /* =====================================================
       CLASIFICADOS
    ====================================================== */

    function actualizarClasificados() {

        const todasLasTablas =
            estado.zonas.map(
                zona => ({

                    zona,

                    tabla:
                        calcularTabla(
                            zona
                        )
                })
            );


        const clasificados = [];


        todasLasTablas.forEach(
            ({ zona, tabla }) => {

                tabla
                    .slice(
                        0,
                        estado.clasificadosPorZona
                    )
                    .forEach(
                        (pareja, index) => {

                            clasificados.push({

                                parejaId:
                                    pareja.id,

                                nombre:
                                    pareja.nombre,

                                origen:
                                    `Zona ${zona.numero} - ${
                                        index + 1
                                    }°`,

                                prioridad:
                                    index + 1,

                                puntos:
                                    pareja.puntos,

                                dg:
                                    pareja.dg,

                                gf:
                                    pareja.gf
                            });
                        }
                    );
            }
        );


        /* =================================================
           MEJORES TERCEROS
        ================================================== */

        if (
            estado.mejoresTerceros > 0
        ) {

            const terceros =
                todasLasTablas
                    .map(
                        ({ zona, tabla }) => {

                            const tercero =
                                tabla[2];


                            if (!tercero)
                                return null;


                            return {

                                parejaId:
                                    tercero.id,

                                nombre:
                                    tercero.nombre,

                                origen:
                                    `Mejor 3° - Zona ${
                                        zona.numero
                                    }`,

                                puntos:
                                    tercero.puntos,

                                dg:
                                    tercero.dg,

                                gf:
                                    tercero.gf
                            };
                        }
                    )
                    .filter(Boolean)
                    .sort(
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


                            if (
                                b.dg !==
                                a.dg
                            ) {

                                return (
                                    b.dg -
                                    a.dg
                                );
                            }


                            return (
                                b.gf -
                                a.gf
                            );
                        }
                    );


            terceros
                .slice(
                    0,
                    estado.mejoresTerceros
                )
                .forEach(
                    tercero => {

                        /*
                            Evitamos duplicados
                            por seguridad.
                        */

                        const yaExiste =
                            clasificados.some(
                                c =>
                                    c.parejaId ===
                                    tercero.parejaId
                            );


                        if (
                            !yaExiste
                        ) {

                            clasificados.push({

                                parejaId:
                                    tercero.parejaId,

                                nombre:
                                    tercero.nombre,

                                origen:
                                    tercero.origen,

                                prioridad:
                                    3,

                                puntos:
                                    tercero.puntos,

                                dg:
                                    tercero.dg,

                                gf:
                                    tercero.gf
                            });
                        }
                    }
                );
        }


        estado.clasificados =
            clasificados;


        renderClasificados();

        prepararEliminacionSiCorresponde();

        renderEliminacion();

        renderInformacion();

        guardar();
    }


    function renderClasificados() {

        const contenedor =
            $("listaClasificados");


        if (
            !estado.clasificados.length
        ) {

            contenedor.innerHTML = `
                <div class="sin-parejas">
                    Todavía no hay clasificados.
                    Completá los partidos.
                </div>
            `;

            return;
        }


        contenedor.innerHTML =
            estado.clasificados.map(
                (pareja, index) => {

                    return `
                        <div class="clasificado-card">

                            <strong>
                                ${index + 1}.
                                ${escapeHTML(
                                    pareja.nombre
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    pareja.origen
                                )}
                            </span>

                        </div>
                    `;
                }
            ).join("");
    }


    /* =====================================================
       ELIMINACIÓN
    ====================================================== */

    function prepararEliminacionSiCorresponde() {

        if (
            estado.clasificados.length <
            2
        ) return;


        const todosLosPartidos =
            estado.partidos.length > 0 &&
            estado.partidos.every(
                partido =>
                    partido.jugado
            );


        if (!todosLosPartidos)
            return;


        const ids =
            estado.clasificados.map(
                p =>
                    p.parejaId
            );


        const cantidad =
            ids.length;


        const potencia =
            Math.pow(
                2,
                Math.ceil(
                    Math.log2(
                        cantidad
                    )
                )
            );


        const participantes =
            [...ids];


        while (
            participantes.length <
            potencia
        ) {

            participantes.push(null);
        }


        /*
            Si ya existe un cuadro,
            no lo volvemos a crear.
        */

        if (
            estado.rondas.length &&
            estado.rondas[0].length
        ) return;


        crearRondasEliminacion(
            participantes
        );


        guardar();
    }


    function crearRondasEliminacion(
        participantes
    ) {

        const primeraRonda = [];


        for (
            let i = 0;
            i < participantes.length;
            i += 2
        ) {

            primeraRonda.push({

                id:
                    crearId("cruce"),

                pareja1:
                    participantes[i],

                pareja2:
                    participantes[i + 1],

                resultado1: null,

                resultado2: null,

                ganador: null
            });
        }


        estado.rondas = [
            primeraRonda
        ];


        let cantidad =
            primeraRonda.length;


        while (
            cantidad > 1
        ) {

            cantidad =
                Math.ceil(
                    cantidad / 2
                );


            const ronda = [];


            for (
                let i = 0;
                i < cantidad;
                i++
            ) {

                ronda.push({

                    id:
                        crearId("cruce"),

                    pareja1:
                        null,

                    pareja2:
                        null,

                    resultado1:
                        null,

                    resultado2:
                        null,

                    ganador:
                        null
                });
            }


            estado.rondas.push(
                ronda
            );
        }
    }


    function nombreRonda(index) {

        const total =
            estado.rondas.length;


        const numeroDesdeFinal =
            total - index;


        const nombres = {

            1:
                "Final",

            2:
                "Semifinal",

            3:
                "Cuartos de final",

            4:
                "Octavos de final"
        };


        if (
            nombres[
                numeroDesdeFinal
            ]
        ) {

            return nombres[
                numeroDesdeFinal
            ];
        }


        return `Ronda ${
            index + 1
        }`;
    }


    function renderEliminacion() {

        const contenedor =
            $("cuadroEliminacion");


        if (
            estado.rondas.length === 0
        ) {

            contenedor.innerHTML = `
                <div class="sin-parejas">
                    🕒 La eliminación directa se habilitará
                    cuando se completen todos los partidos
                    de la fase de grupos.
                </div>
            `;

            return;
        }


        contenedor.innerHTML =
            estado.rondas.map(
                (ronda, rondaIndex) => {

                    return `
                        <div>

                            <div class="nombre-ronda">
                                ${nombreRonda(
                                    rondaIndex
                                )}
                            </div>

                            <div class="ronda-eliminacion">

                                ${ronda.map(
                                    (
                                        cruce,
                                        cruceIndex
                                    ) =>
                                        renderCruce(
                                            cruce,
                                            rondaIndex,
                                            cruceIndex
                                        )
                                ).join("")}

                            </div>

                        </div>
                    `;
                }
            ).join("");


        document
            .querySelectorAll(
                "[data-guardar-cruce]"
            )
            .forEach(btn => {

                btn.addEventListener(
                    "click",
                    () => {

                        guardarCruce(

                            Number(
                                btn.dataset.ronda
                            ),

                            Number(
                                btn.dataset.cruce
                            )
                        );
                    }
                );
            });
    }


    /* =====================================================
       ELIMINACIÓN - CRUCE
    ====================================================== */

    function renderCruce(
        cruce,
        rondaIndex,
        cruceIndex
    ) {

        const pareja1 =
            cruce.pareja1
                ? obtenerPareja(
                    cruce.pareja1
                )
                : null;


        const pareja2 =
            cruce.pareja2
                ? obtenerPareja(
                    cruce.pareja2
                )
                : null;


        const esLibre =
            (
                pareja1 &&
                !pareja2
            ) ||
            (
                !pareja1 &&
                pareja2
            );


        return `
            <div class="cruce">

                <div class="cruce-equipo ${
                    cruce.ganador ===
                    cruce.pareja1
                        ? "ganador"
                        : ""
                }">

                    <span>
                        ${
                            pareja1
                                ? escapeHTML(
                                    parejaNombre(
                                        pareja1
                                    )
                                )
                                : "BYE"
                        }
                    </span>

                    <strong>
                        ${
                            cruce.ganador ===
                            cruce.pareja1
                                ? "✓"
                                : ""
                        }
                    </strong>

                </div>


                <div class="cruce-equipo ${
                    cruce.ganador ===
                    cruce.pareja2
                        ? "ganador"
                        : ""
                }">

                    <span>
                        ${
                            pareja2
                                ? escapeHTML(
                                    parejaNombre(
                                        pareja2
                                    )
                                )
                                : "BYE"
                        }
                    </span>

                    <strong>
                        ${
                            cruce.ganador ===
                            cruce.pareja2
                                ? "✓"
                                : ""
                        }
                    </strong>

                </div>


                ${
                    pareja1 &&
                    pareja2 &&
                    !cruce.ganador

                        ? renderInputsCruce(
                            cruce,
                            rondaIndex,
                            cruceIndex
                        )

                        : ""
                }


                ${
                    esLibre &&
                    !cruce.ganador

                        ? `
                            <button
                                type="button"
                                data-bye
                                data-ronda="${rondaIndex}"
                                data-cruce="${cruceIndex}">
                                Avanzar automáticamente
                            </button>
                        `

                        : ""
                }

            </div>
        `;
    }


    function renderInputsCruce(
        cruce,
        rondaIndex,
        cruceIndex
    ) {

        const r1 =
            normalizarResultado(
                cruce.resultado1
            );

        const r2 =
            normalizarResultado(
                cruce.resultado2
            );


        if (
            estado.modalidad ===
            "9_games"
        ) {

            return `
                <div class="cruce-inputs">

                    <input
                        type="number"
                        min="0"
                        max="9"
                        placeholder="Games"
                        data-cruce-input="${cruce.id}"
                        data-equipo="1"
                        data-tipo="games"
                        value="${
                            r1.games1 ??
                            ""
                        }">

                    <input
                        type="number"
                        min="0"
                        max="9"
                        placeholder="Games"
                        data-cruce-input="${cruce.id}"
                        data-equipo="2"
                        data-tipo="games"
                        value="${
                            r2.games1 ??
                            ""
                        }">

                </div>

                <button
                    type="button"
                    data-guardar-cruce
                    data-ronda="${rondaIndex}"
                    data-cruce="${cruceIndex}">
                    Guardar ganador
                </button>
            `;
        }


        const necesitaTercer =
            resultadoTercerSetNecesario(
                r1,
                r2
            );


        return `
            <div class="cruce-inputs">

                <div>
                    <small>Set 1</small>

                    <input
                        type="number"
                        min="0"
                        max="7"
                        placeholder="0"
                        data-cruce-input="${cruce.id}"
                        data-equipo="1"
                        data-tipo="set1"
                        value="${
                            r1.set1 ??
                            ""
                        }">

                    <input
                        type="number"
                        min="0"
                        max="7"
                        placeholder="0"
                        data-cruce-input="${cruce.id}"
                        data-equipo="2"
                        data-tipo="set1"
                        value="${
                            r2.set1 ??
                            ""
                        }">
                </div>


                <div>
                    <small>Set 2</small>

                    <input
                        type="number"
                        min="0"
                        max="7"
                        placeholder="0"
                        data-cruce-input="${cruce.id}"
                        data-equipo="1"
                        data-tipo="set2"
                        value="${
                            r1.set2 ??
                            ""
                        }">

                    <input
                        type="number"
                        min="0"
                        max="7"
                        placeholder="0"
                        data-cruce-input="${cruce.id}"
                        data-equipo="2"
                        data-tipo="set2"
                        value="${
                            r2.set2 ??
                            ""
                        }">
                </div>


                <div class="${
                    necesitaTercer
                        ? ""
                        : "oculto"
                }">

                    <small>
                        ${textoTercerResultado()}
                    </small>

                    <input
                        type="number"
                        min="0"
                        ${
                            estado.modalidad ===
                            "2_sets_supertiebreak"
                                ? 'max="100"'
                                : 'max="7"'
                        }
                        placeholder="0"
                        data-cruce-input="${cruce.id}"
                        data-equipo="1"
                        data-tipo="set3"
                        value="${
                            r1.set3 ??
                            ""
                        }">

                    <input
                        type="number"
                        min="0"
                        ${
                            estado.modalidad ===
                            "2_sets_supertiebreak"
                                ? 'max="100"'
                                : 'max="7"'
                        }
                        placeholder="0"
                        data-cruce-input="${cruce.id}"
                        data-equipo="2"
                        data-tipo="set3"
                        value="${
                            r2.set3 ??
                            ""
                        }">

                </div>

            </div>


            <button
                type="button"
                data-guardar-cruce
                data-ronda="${rondaIndex}"
                data-cruce="${cruceIndex}">
                Guardar ganador
            </button>
        `;
    }


    /* =====================================================
       GUARDAR CRUCE
    ====================================================== */

    function guardarCruce(
        rondaIndex,
        cruceIndex
    ) {

        const ronda =
            estado.rondas[
                rondaIndex
            ];


        const cruce =
            ronda?.[cruceIndex];


        if (!cruce)
            return;


        if (
            !cruce.pareja1 ||
            !cruce.pareja2
        ) return;


        const leer =
            equipo => {

                const obtener =
                    tipo => {

                        const input =
                            document.querySelector(
                                `[data-cruce-input="${cruce.id}"][data-equipo="${equipo}"][data-tipo="${tipo}"]`
                            );


                        if (!input)
                            return null;


                        const valor =
                            input.value.trim();


                        if (
                            valor === ""
                        ) {

                            return null;
                        }


                        const numero =
                            Number(valor);


                        return Number.isInteger(
                            numero
                        )
                            ? numero
                            : null;
                    };


                return {

                    games1:
                        obtener("games"),

                    set1:
                        obtener("set1"),

                    set2:
                        obtener("set2"),

                    set3:
                        obtener("set3")
                };
            };


        const resultado1 =
            leer(1);

        const resultado2 =
            leer(2);


        const validacion =
            validarResultado(
                resultado1,
                resultado2
            );


        if (!validacion.valido) {

            mostrarMensaje(
                validacion.mensaje,
                "error"
            );

            return;
        }


        const ganador =
            calcularGanadorResultado(
                resultado1,
                resultado2
            );


        if (!ganador) {

            mostrarMensaje(
                "No se pudo determinar el ganador.",
                "error"
            );

            return;
        }


        cruce.resultado1 =
            {
                ...resultado1
            };

        cruce.resultado2 =
            {
                ...resultado2
            };


        cruce.ganador =
            ganador === 1
                ? cruce.pareja1
                : cruce.pareja2;


        avanzarGanador(
            rondaIndex,
            cruceIndex,
            cruce.ganador
        );


        guardar();

        renderEliminacion();

        verificarCampeon();


        mostrarMensaje(
            "Resultado de eliminación guardado.",
            "exito"
        );
    }


    function avanzarGanador(
        rondaIndex,
        cruceIndex,
        ganador
    ) {

        const siguiente =
            estado.rondas[
                rondaIndex + 1
            ];


        if (!siguiente)
            return;


        const siguienteIndex =
            Math.floor(
                cruceIndex / 2
            );


        const cruceSiguiente =
            siguiente[
                siguienteIndex
            ];


        if (!cruceSiguiente)
            return;


        if (
            cruceIndex % 2 === 0
        ) {

            cruceSiguiente.pareja1 =
                ganador;

        } else {

            cruceSiguiente.pareja2 =
                ganador;
        }
    }


    function verificarCampeon() {

        const final =
            estado.rondas[
                estado.rondas.length - 1
            ]?.[0];


        if (
            final &&
            final.ganador
        ) {

            estado.campeon =
                final.ganador;


            const pareja =
                obtenerPareja(
                    estado.campeon
                );


            $("nombreCampeon").textContent =
                parejaNombre(
                    pareja
                );


            $("seccionCampeon")
                .classList.remove(
                    "oculto"
                );


            guardar();
        }
    }


    /* =====================================================
       BYE
    ====================================================== */

    document.addEventListener(
        "click",
        event => {

            const boton =
                event.target.closest(
                    "[data-bye]"
                );


            if (!boton) return;


            const ronda =
                Number(
                    boton.dataset.ronda
                );


            const cruce =
                Number(
                    boton.dataset.cruce
                );


            const partido =
                estado.rondas[
                    ronda
                ][cruce];


            const ganador =
                partido.pareja1 ||
                partido.pareja2;


            if (!ganador) return;


            partido.ganador =
                ganador;


            avanzarGanador(
                ronda,
                cruce,
                ganador
            );


            guardar();

            renderEliminacion();

            verificarCampeon();
        }
    );


    /* =====================================================
       NUEVO TORNEO
    ====================================================== */

    function abrirModal() {

        $("modalNuevoTorneo")
            .classList.add(
                "activo"
            );
    }


    function cerrarModal() {

        $("modalNuevoTorneo")
            .classList.remove(
                "activo"
            );
    }


    $("btnNuevoTorneo")
        .addEventListener(
            "click",
            abrirModal
        );


    $("btnNuevoTorneoFinal")
        .addEventListener(
            "click",
            abrirModal
        );


    $("btnCancelarNuevoTorneo")
        .addEventListener(
            "click",
            cerrarModal
        );


    $("btnConfirmarNuevoTorneo")
        .addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    STORAGE_KEY
                );

                location.reload();
            }
        );


    $("modalNuevoTorneo")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("modalNuevoTorneo")
                ) {

                    cerrarModal();
                }
            }
        );


    /* =====================================================
       ADMINISTRADOR
    ====================================================== */

    $("btnVolverAdmin")
        .addEventListener(
            "click",
            () => {

                window.location.href =
                    "admin.html";
            }
        );


    /* =====================================================
       ACTUALIZAR FORMULARIO
    ====================================================== */

    function actualizarFormulario() {

        nombreTorneo.value =
            estado.nombre || "";


        categoriaTorneo.value =
            estado.categoria || "";


        tipoTorneo.value =
            estado.modalidad || "";


        cantidadParejas.value =
            estado.cantidadParejas || "";


        categoriaPareja.value =
            estado.categoria || "";


        cantidadGrupos.value =
            estado.cantidadZonas || "";


        clasificadosPorGrupo.value =
            estado.clasificadosPorZona || "";


        cantidadMejoresTerceros.value =
            estado.mejoresTerceros ?? 0;


        tipoTorneo.dispatchEvent(
            new Event("change")
        );


        actualizarContador();

        renderParejas();


        if (
            estado.cantidadZonas
        ) {

            renderConfiguracionZonas();
        }
    }


    /* =====================================================
       RECUPERAR DATOS
    ====================================================== */

    cargar();


    /*
        Normalizamos partidos viejos.
    */

    estado.partidos =
        (estado.partidos || [])
            .map(partido => {

                return {

                    ...partido,

                    resultado1:
                        normalizarResultado(
                            partido.resultado1
                        ),

                    resultado2:
                        normalizarResultado(
                            partido.resultado2
                        )
                };
            });


    /*
        Normalizamos rondas viejas.
    */

    estado.rondas =
        (estado.rondas || [])
            .map(ronda =>
                ronda.map(cruce => {

                    return {

                        ...cruce,

                        resultado1:
                            cruce.resultado1
                                ? normalizarResultado(
                                    cruce.resultado1
                                )
                                : null,

                        resultado2:
                            cruce.resultado2
                                ? normalizarResultado(
                                    cruce.resultado2
                                )
                                : null
                    };
                })
            );


    actualizarFormulario();


    mostrarPaso(
        estado.paso || 1
    );


    /* =====================================================
       SI YA HAY TORNEO GENERADO
    ====================================================== */

    if (
        estado.zonas &&
        estado.zonas.length
    ) {

        mostrarResultadoInicial();
    }

});