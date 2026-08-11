const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

const bienvenida = document.getElementById("bienvenida");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const mensaje = document.getElementById("mensaje");

// Modal cancelar reserva admin
let modalCancelarReservaAdmin = document.getElementById("modalCancelarReservaAdmin");
let btnCerrarModalCancelarAdmin = document.getElementById("btnCerrarModalCancelarAdmin");
let btnConfirmarCancelacionAdmin = document.getElementById("btnConfirmarCancelacionAdmin");

// Tabla de reservas
const tablaReservasAdmin =
    document.getElementById("tablaReservasAdmin") ||
    document.getElementById("tablaReservas");

// Filtros
const contadorReservas = document.getElementById("contadorReservas");
const buscarReserva = document.getElementById("buscarReserva");
const filtroFecha = document.getElementById("filtroFecha");
const filtroEstado = document.getElementById("filtroEstado");
const filtroTipo = document.getElementById("filtroTipo");
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");

// Resumen administrador
const totalReservasAdmin = document.getElementById("totalReservasAdmin");
const reservasActivasAdmin = document.getElementById("reservasActivasAdmin");
const reservasCanceladasAdmin = document.getElementById("reservasCanceladasAdmin");
const reservasHoyAdmin = document.getElementById("reservasHoyAdmin");
const ingresosTotalesAdmin = document.getElementById("ingresosTotalesAdmin");
const ingresosHoyAdmin = document.getElementById("ingresosHoyAdmin");
const ingresosMesAdmin = document.getElementById("ingresosMesAdmin");
const canchaMasReservadaAdmin = document.getElementById("canchaMasReservadaAdmin");

const API_URL = "http://localhost:3000";

let reservasOriginales = [];

// ==============================
// CREAR MODAL SI NO EXISTE
// ==============================
function prepararModalCancelarAdmin() {
    if (!modalCancelarReservaAdmin) {
        const modal = document.createElement("div");

        modal.id = "modalCancelarReservaAdmin";
        modal.className = "modal-admin-overlay";

        modal.innerHTML = `
            <div class="modal-admin-contenido">
                <h2>Cancelar reserva</h2>

                <p class="modal-admin-texto">
                    ¿Estás seguro de que querés cancelar esta reserva?
                </p>

                <p class="modal-admin-aviso">
                    Esta acción cambiará el estado de la reserva a <strong>cancelada</strong>.
                </p>

                <div class="modal-admin-acciones">
                    <button type="button" id="btnCerrarModalCancelarAdmin" class="btn-modal-volver">
                        Volver
                    </button>

                    <button type="button" id="btnConfirmarCancelacionAdmin" class="btn-modal-eliminar">
                        Cancelar reserva
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modalCancelarReservaAdmin = document.getElementById("modalCancelarReservaAdmin");
        btnCerrarModalCancelarAdmin = document.getElementById("btnCerrarModalCancelarAdmin");
        btnConfirmarCancelacionAdmin = document.getElementById("btnConfirmarCancelacionAdmin");
    }
}

// ==============================
// VALIDAR ADMIN
// ==============================
if (!usuarioLogueado) {
    window.location.href = "login.html";
} else if (usuarioLogueado.rol !== "admin") {
    window.location.href = "reservas.html";
} else {
    if (bienvenida) {
        bienvenida.textContent = `Panel administrador - ${usuarioLogueado.usuario}`;
    }
}

// ==============================
// CERRAR SESIÓN
// ==============================
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogueado");
        window.location.href = "login.html";
    });
}

// ==============================
// FORMATEAR FECHA
// ==============================
function formatearFecha(fechaTexto) {
    if (!fechaTexto) return "";

    const fechaLimpia = String(fechaTexto).substring(0, 10);
    const partes = fechaLimpia.split("-");

    if (partes.length === 3) {
        const [anio, mes, dia] = partes;
        return `${dia}/${mes}/${anio}`;
    }

    return fechaTexto;
}

// ==============================
// FORMATEAR HORA
// ==============================
function formatearHora(fechaTexto) {
    if (!fechaTexto) return "";

    const fecha = new Date(fechaTexto);

    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");

    return `${horas}:${minutos}`;
}

// ==============================
// FORMATEAR PRECIO
// ==============================
function formatearPrecioAdmin(valor) {
    if (valor === null || valor === undefined || isNaN(valor)) {
        return "$0";
    }

    return `$${Number(valor).toLocaleString("es-AR")}`;
}

// ==============================
// OBTENER FECHA PARA FILTRO
// ==============================
function obtenerFechaParaFiltro(fechaTexto) {
    if (!fechaTexto) return "";
    return String(fechaTexto).substring(0, 10);
}

// ==============================
// VERIFICAR SI LA RESERVA YA PASÓ
// ==============================
function reservaYaPaso(finReserva) {
    const ahora = new Date();
    const fin = new Date(finReserva);

    return fin <= ahora;
}

// ==============================
// OBTENER ESTADO REAL PARA MOSTRAR
// ==============================
function obtenerEstadoReserva(reserva) {
    const yaPaso = reservaYaPaso(reserva.fin);

    if (reserva.estado === "activa" && yaPaso) {
        return {
            texto: "finalizada",
            clase: "estado-finalizada",
            puedeCancelar: false
        };
    }

    if (reserva.estado === "activa") {
        return {
            texto: "activa",
            clase: "estado-activa",
            puedeCancelar: true
        };
    }

    return {
        texto: "cancelada",
        clase: "estado-cancelada",
        puedeCancelar: false
    };
}

// ==============================
// CARGAR RESUMEN ADMIN
// ==============================
async function cargarResumenAdmin() {
    try {
        const respuesta = await fetch(`${API_URL}/api/admin/resumen`);
        const resumen = await respuesta.json();

        if (!respuesta.ok) {
            console.log(resumen);
            return;
        }

        if (totalReservasAdmin) {
            totalReservasAdmin.textContent = resumen.total_reservas || 0;
        }

        if (reservasActivasAdmin) {
            reservasActivasAdmin.textContent = resumen.reservas_activas || 0;
        }

        if (reservasCanceladasAdmin) {
            reservasCanceladasAdmin.textContent = resumen.reservas_canceladas || 0;
        }

        if (reservasHoyAdmin) {
            reservasHoyAdmin.textContent = resumen.reservas_hoy || 0;
        }

        if (ingresosTotalesAdmin) {
            ingresosTotalesAdmin.textContent = formatearPrecioAdmin(resumen.ingresos_totales);
        }

        if (ingresosHoyAdmin) {
            ingresosHoyAdmin.textContent = formatearPrecioAdmin(resumen.ingresos_hoy);
        }

        if (ingresosMesAdmin) {
            ingresosMesAdmin.textContent = formatearPrecioAdmin(resumen.ingresos_mes);
        }

        if (canchaMasReservadaAdmin) {
            canchaMasReservadaAdmin.textContent = resumen.cancha_mas_reservada || "Sin datos";
        }

    } catch (error) {
        console.error("Error al cargar resumen admin:", error);
    }
}

// ==============================
// CARGAR RESERVAS ADMIN
// ==============================
async function cargarReservasAdmin() {
    try {
        const respuesta = await fetch(`${API_URL}/api/admin/reservas`);
        const reservas = await respuesta.json();

        if (!respuesta.ok) {
            console.log(reservas);

            if (tablaReservasAdmin) {
                tablaReservasAdmin.innerHTML = `
                    <tr>
                        <td colspan="13">Error al cargar las reservas.</td>
                    </tr>
                `;
            }

            return;
        }

        reservasOriginales = reservas;
        aplicarFiltros();

    } catch (error) {
        console.error(error);

        if (tablaReservasAdmin) {
            tablaReservasAdmin.innerHTML = `
                <tr>
                    <td colspan="13">No se pudo conectar con el servidor.</td>
                </tr>
            `;
        }
    }
}

// ==============================
// MOSTRAR RESERVAS EN TABLA
// ==============================
function mostrarReservasAdmin(reservas) {
    if (!tablaReservasAdmin) {
        console.log("No se encontró la tabla de reservas del administrador");
        return;
    }

    tablaReservasAdmin.innerHTML = "";

    if (contadorReservas) {
        contadorReservas.textContent = `Reservas encontradas: ${reservas.length}`;
    }

    if (reservas.length === 0) {
        tablaReservasAdmin.innerHTML = `
            <tr>
                <td colspan="13">No se encontraron reservas.</td>
            </tr>
        `;
        return;
    }

    reservas.forEach(reserva => {
        const fila = document.createElement("tr");
        const estadoReserva = obtenerEstadoReserva(reserva);

        fila.innerHTML = `
            <td>${reserva.nombre_usuario || "Sin usuario"}</td>
            <td>${reserva.nombre_completo || "Sin cargar"}</td>
            <td>${reserva.dni || "Sin cargar"}</td>
            <td>${reserva.telefono || "Sin cargar"}</td>
            <td>${reserva.nombre_cancha || "Sin cancha"}</td>
            <td>${reserva.tipo_cancha || "Sin tipo"}</td>
            <td>${formatearFecha(reserva.fecha)}</td>
            <td>${formatearHora(reserva.inicio)}</td>
            <td>${formatearHora(reserva.fin)}</td>
            <td>${reserva.duracion_horas} hora/s</td>
            <td>${formatearPrecioAdmin(reserva.total)}</td>
            <td>
                <span class="${estadoReserva.clase}">
                    ${estadoReserva.texto}
                </span>
            </td>
            <td>
                ${
                    estadoReserva.puedeCancelar
                    ? `<button class="btn-cancelar" onclick="cancelarReservaAdmin(${reserva.id_reserva})">Cancelar</button>`
                    : `<span class="sin-accion">No disponible</span>`
                }
            </td>
        `;

        tablaReservasAdmin.appendChild(fila);
    });
}

// ==============================
// APLICAR FILTROS
// ==============================
function aplicarFiltros() {
    const texto = buscarReserva ? buscarReserva.value.trim().toLowerCase() : "";
    const fecha = filtroFecha ? filtroFecha.value : "";
    const estado = filtroEstado ? filtroEstado.value : "";
    const tipo = filtroTipo ? filtroTipo.value : "";

    const reservasFiltradas = reservasOriginales.filter(reserva => {
        const estadoReserva = obtenerEstadoReserva(reserva);

        const textoReserva = `
            ${reserva.nombre_usuario || ""}
            ${reserva.nombre_completo || ""}
            ${reserva.dni || ""}
            ${reserva.telefono || ""}
            ${reserva.nombre_cancha || ""}
            ${reserva.tipo_cancha || ""}
            ${estadoReserva.texto || ""}
        `.toLowerCase();

        const fechaReserva = obtenerFechaParaFiltro(reserva.fecha);

        const coincideTexto = texto === "" || textoReserva.includes(texto);
        const coincideFecha = fecha === "" || fechaReserva === fecha;
        const coincideEstado = estado === "" || estadoReserva.texto === estado;
        const coincideTipo = tipo === "" || reserva.tipo_cancha === tipo;

        return coincideTexto && coincideFecha && coincideEstado && coincideTipo;
    });

    mostrarReservasAdmin(reservasFiltradas);
}

// ==============================
// LIMPIAR FILTROS
// ==============================
function limpiarFiltros() {
    if (buscarReserva) buscarReserva.value = "";
    if (filtroFecha) filtroFecha.value = "";
    if (filtroEstado) filtroEstado.value = "";
    if (filtroTipo) filtroTipo.value = "";

    aplicarFiltros();
}

// ==============================
// MODAL PARA CANCELAR RESERVA
// ==============================
function mostrarModalCancelarAdmin() {
    prepararModalCancelarAdmin();

    return new Promise((resolve) => {
        modalCancelarReservaAdmin.classList.add("activo");

        btnConfirmarCancelacionAdmin.onclick = () => {
            modalCancelarReservaAdmin.classList.remove("activo");
            resolve(true);
        };

        btnCerrarModalCancelarAdmin.onclick = () => {
            modalCancelarReservaAdmin.classList.remove("activo");
            resolve(false);
        };

        modalCancelarReservaAdmin.onclick = (e) => {
            if (e.target === modalCancelarReservaAdmin) {
                modalCancelarReservaAdmin.classList.remove("activo");
                resolve(false);
            }
        };
    });
}

// ==============================
// CANCELAR RESERVA ADMIN
// ==============================
async function cancelarReservaAdmin(idReserva) {
    const confirmar = await mostrarModalCancelarAdmin();

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/api/admin/reservas/${idReserva}/cancelar`, {
            method: "PUT"
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            if (mensaje) {
                mensaje.textContent = datos.mensaje || "Reserva cancelada correctamente";
                mensaje.className = "mensaje exito";
            }

            cargarReservasAdmin();
            cargarResumenAdmin();

        } else {
            if (mensaje) {
                mensaje.textContent = datos.mensaje || "No se pudo cancelar la reserva";
                mensaje.className = "mensaje error";
            }
        }

    } catch (error) {
        console.error(error);

        if (mensaje) {
            mensaje.textContent = "No se pudo conectar con el servidor";
            mensaje.className = "mensaje error";
        }
    }
}

// ==============================
// EVENTOS FILTROS
// ==============================
if (buscarReserva) {
    buscarReserva.addEventListener("input", aplicarFiltros);
}

if (filtroFecha) {
    filtroFecha.addEventListener("change", aplicarFiltros);
}

if (filtroEstado) {
    filtroEstado.addEventListener("change", aplicarFiltros);
}

if (filtroTipo) {
    filtroTipo.addEventListener("change", aplicarFiltros);
}

if (btnLimpiarFiltros) {
    btnLimpiarFiltros.addEventListener("click", limpiarFiltros);
}

// ==============================
// INICIAR ADMIN
// ==============================
prepararModalCancelarAdmin();
cargarReservasAdmin();
cargarResumenAdmin();