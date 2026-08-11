const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

const bienvenida = document.getElementById("bienvenida");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const formReserva = document.getElementById("formReserva");
const fechaInput = document.getElementById("fecha");
const canchaSelect = document.getElementById("cancha");
const horaSelect = document.getElementById("hora");
const duracionSelect = document.getElementById("duracion");
const mensaje = document.getElementById("mensaje");
const listaHorarios = document.getElementById("listaHorarios");
const tablaMisReservas = document.getElementById("tablaMisReservas");

// ==============================
// MODAL CONFIRMAR RESERVA
// ==============================
const modalConfirmacion = document.getElementById("modalConfirmacion");
const modalCancha = document.getElementById("modalCancha");
const modalFecha = document.getElementById("modalFecha");
const modalHora = document.getElementById("modalHora");
const modalDuracion = document.getElementById("modalDuracion");
const modalPrecioHora = document.getElementById("modalPrecioHora");
const modalTotal = document.getElementById("modalTotal");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const btnConfirmarModal = document.getElementById("btnConfirmarModal");

const API_URL = "http://localhost:3000";

let canchasDisponibles = [];

// ==============================
// VALIDAR SESIÓN
// ==============================
if (!usuarioLogueado) {
    window.location.href = "login.html";
} else {
    bienvenida.textContent = `Bienvenido, ${usuarioLogueado.usuario}`;
}

// ==============================
// CERRAR SESIÓN
// ==============================
btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
});

// ==============================
// CARGAR FECHA ACTUAL
// ==============================
function cargarFechaActual() {
    const hoy = new Date();

    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");

    fechaInput.value = `${year}-${month}-${day}`;
    fechaInput.min = `${year}-${month}-${day}`;
}

// ==============================
// VALIDAR HORARIOS PASADOS
// ==============================
function crearFechaHoraReserva(fecha, hora) {
    let fechaHora;

    if (hora === "00:00") {
        fechaHora = new Date(`${fecha}T00:00:00`);
        fechaHora.setDate(fechaHora.getDate() + 1);
    } else {
        fechaHora = new Date(`${fecha}T${hora}:00`);
    }

    return fechaHora;
}

function horarioYaPaso(fecha, hora) {
    const ahora = new Date();
    const fechaHoraReserva = crearFechaHoraReserva(fecha, hora);

    return fechaHoraReserva <= ahora;
}

function actualizarHorariosDisponibles() {
    const fechaSeleccionada = fechaInput.value;

    if (!fechaSeleccionada) {
        return;
    }

    const opciones = horaSelect.querySelectorAll("option");

    opciones.forEach(option => {
        if (option.value === "") {
            option.disabled = false;
            option.textContent = "Seleccione un horario";
            return;
        }

        if (horarioYaPaso(fechaSeleccionada, option.value)) {
            option.disabled = true;
            option.textContent = `${option.value} - Horario pasado`;
        } else {
            option.disabled = false;
            option.textContent = option.value;
        }
    });

    if (horaSelect.selectedOptions.length > 0 && horaSelect.selectedOptions[0].disabled) {
        horaSelect.value = "";
    }
}

// ==============================
// FORMATEAR FECHA Y HORA
// ==============================
function formatearFecha(fechaTexto) {
    const fecha = new Date(fechaTexto);

    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
}

function formatearHora(fechaTexto) {
    const fecha = new Date(fechaTexto);

    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");

    return `${horas}:${minutos}`;
}
function formatearPrecio(valor) {
    if (valor === null || valor === undefined || isNaN(valor)) {
        return "$0";
    }

    return `$${Number(valor).toLocaleString("es-AR")}`;
}
function formatearPrecio(valor) {
    if (valor === null || valor === undefined) {
        return "$0";
    }

    return `$${Number(valor).toLocaleString("es-AR")}`;
}

// ==============================
// VERIFICAR SI SE PUEDE CANCELAR
// Solo permite cancelar si falta 1 hora o más
// ==============================
function puedeCancelarReserva(inicioReserva) {
    const ahora = new Date();
    const inicio = new Date(inicioReserva);

    const diferenciaMilisegundos = inicio - ahora;
    const unaHora = 60 * 60 * 1000;

    return diferenciaMilisegundos >= unaHora;
}

// ==============================
// CARGAR CANCHAS
// ==============================
async function cargarCanchas() {
    try {
        const respuesta = await fetch(`${API_URL}/api/canchas`);
        const canchas = await respuesta.json();

        canchasDisponibles = canchas;

        canchaSelect.innerHTML = `<option value="">Seleccione una cancha</option>`;

        canchas.forEach(cancha => {
            const option = document.createElement("option");

            option.value = cancha.id_cancha;
            option.textContent = `${cancha.nombre} - ${cancha.tipo} - $${Number(cancha.precio_hora).toLocaleString("es-AR")} por hora`;

            canchaSelect.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        mensaje.textContent = "Error al cargar las canchas";
        mensaje.className = "mensaje error";
    }
}

// ==============================
// HORARIOS BASE DEL CLUB
// ==============================
function generarHorariosBase() {
    return [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
        "00:00"
    ];
}

// ==============================
// OBTENER HORA DESDE FECHA
// ==============================
function obtenerHoraDesdeFecha(fechaTexto) {
    const fecha = new Date(fechaTexto);
    return fecha.getHours();
}

function obtenerHoraFinDesdeFecha(fechaTexto) {
    const fecha = new Date(fechaTexto);
    return fecha.getHours();
}

// ==============================
// VERIFICAR SI UNA HORA ESTÁ OCUPADA
// ==============================
function horaEstaOcupada(horaTexto, reservas) {
    let horaNumero;

    if (horaTexto === "00:00") {
        horaNumero = 24;
    } else {
        horaNumero = parseInt(horaTexto.split(":")[0]);
    }

    return reservas.some(reserva => {
        let inicio = obtenerHoraDesdeFecha(reserva.inicio);
        let fin = obtenerHoraFinDesdeFecha(reserva.fin);

        if (inicio === 0) inicio = 24;
        if (fin === 0) fin = 24;
        if (fin === 1) fin = 25;

        return horaNumero >= inicio && horaNumero < fin;
    });
}

// ==============================
// CARGAR HORARIOS OCUPADOS
// ==============================
async function cargarHorariosOcupados() {
    const fecha = fechaInput.value;
    const idCancha = canchaSelect.value;

    if (!fecha || !idCancha) {
        listaHorarios.innerHTML = "Seleccioná una fecha y una cancha para ver los horarios.";
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/api/reservas/ocupadas?fecha=${fecha}&id_cancha=${idCancha}`);
        const reservas = await respuesta.json();

        const horarios = generarHorariosBase();

        listaHorarios.innerHTML = "";

        horarios.forEach(hora => {
            const pasado = horarioYaPaso(fecha, hora);
            const ocupado = horaEstaOcupada(hora, reservas);

            const div = document.createElement("div");

            if (pasado) {
                div.className = "horario ocupado";
                div.innerHTML = `
                    <span>${hora}</span>
                    <strong>Horario pasado</strong>
                `;
            } else if (ocupado) {
                div.className = "horario ocupado";
                div.innerHTML = `
                    <span>${hora}</span>
                    <strong>Ocupado</strong>
                `;
            } else {
                div.className = "horario disponible";
                div.innerHTML = `
                    <span>${hora}</span>
                    <strong>Disponible</strong>
                `;
            }

            listaHorarios.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        listaHorarios.innerHTML = "Error al cargar los horarios ocupados.";
    }
}
// ==============================
// CARGAR MIS RESERVAS
// ==============================
async function cargarMisReservas() {
    try {
        const respuesta = await fetch(`${API_URL}/api/usuarios/${usuarioLogueado.id_usuario}/reservas`);
        const reservas = await respuesta.json();

        tablaMisReservas.innerHTML = "";

        if (reservas.length === 0) {
            tablaMisReservas.innerHTML = `
                <tr>
                    <td colspan="9">No tenés reservas activas pendientes.</td>
                </tr>
            `;
            return;
        }

        reservas.forEach(reserva => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${reserva.nombre_cancha}</td>
                <td>${reserva.tipo_cancha}</td>
                <td>${formatearFecha(reserva.fecha)}</td>
                <td>${formatearHora(reserva.inicio)}</td>
                <td>${formatearHora(reserva.fin)}</td>
                <td>${reserva.duracion_horas} hora/s</td>
                <td>${formatearPrecio(reserva.total)}</td>
                <td>
                    <span class="${reserva.estado === "activa" ? "estado-activa" : "estado-cancelada"}">
                        ${reserva.estado}
                    </span>
                </td>
                <td>
                    ${
                        reserva.estado === "activa" && puedeCancelarReserva(reserva.inicio)
                        ? `<button class="btn-cancelar" onclick="cancelarMiReserva(${reserva.id_reserva})">Cancelar</button>`
                        : `<span class="sin-accion">No disponible</span>`
                    }
                </td>
            `;

            tablaMisReservas.appendChild(fila);
        });

    } catch (error) {
        console.error(error);
        tablaMisReservas.innerHTML = `
            <tr>
                <td colspan="9">Error al cargar tus reservas.</td>
            </tr>
        `;
    }
}

// ==============================
// CANCELAR MI RESERVA
// ==============================
async function cancelarMiReserva(idReserva) {
    const confirmar = confirm("¿Seguro que querés cancelar esta reserva?");

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(
            `${API_URL}/api/usuarios/${usuarioLogueado.id_usuario}/reservas/${idReserva}/cancelar`,
            {
                method: "PUT"
            }
        );

        const datos = await respuesta.json();

        if (respuesta.ok) {
            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje exito";

            cargarMisReservas();
            cargarHorariosOcupados();

        } else {
            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje error";
        }

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar con el servidor";
        mensaje.className = "mensaje error";
    }
}

// ==============================
// MOSTRAR MODAL DE CONFIRMACIÓN
// ==============================
function mostrarModalConfirmacion(datos) {
    return new Promise((resolve) => {
        modalCancha.textContent = datos.cancha;
        modalFecha.textContent = datos.fecha;
        modalHora.textContent = datos.hora;
        modalDuracion.textContent = `${datos.duracion} hora/s`;
        modalPrecioHora.textContent = formatearPrecio(datos.precioHora);
        modalTotal.textContent = formatearPrecio(datos.total);

        modalConfirmacion.classList.add("activo");

        btnConfirmarModal.onclick = () => {
            modalConfirmacion.classList.remove("activo");
            resolve(true);
        };

        btnCancelarModal.onclick = () => {
            modalConfirmacion.classList.remove("activo");
            resolve(false);
        };
    });
}

// ==============================
// CREAR RESERVA
// ==============================
formReserva.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idCancha = canchaSelect.value;
    const fecha = fechaInput.value;
    const hora = horaSelect.value;
    const duracion = duracionSelect.value;

    if (!idCancha || !fecha || !hora || !duracion) {
        mensaje.textContent = "Debe completar todos los campos";
        mensaje.className = "mensaje error";
        return;
    }

    if (horarioYaPaso(fecha, hora)) {
        mensaje.textContent = "No se puede reservar un horario que ya pasó";
        mensaje.className = "mensaje error";
        horaSelect.value = "";
        actualizarHorariosDisponibles();
        cargarHorariosOcupados();
        return;
    }

    // ==============================
    // DATOS PARA EL MODAL
    // ==============================
    const canchaTexto = canchaSelect.options[canchaSelect.selectedIndex].textContent;
    const fechaTexto = formatearFecha(fecha);

    const canchaSeleccionada = canchasDisponibles.find(cancha => {
        return Number(cancha.id_cancha) === Number(idCancha);
    });

    let precioHora = 0;
    let totalReserva = 0;

    if (canchaSeleccionada) {
        precioHora = Number(canchaSeleccionada.precio_hora);
        totalReserva = precioHora * Number(duracion);
    }

    // ==============================
    // MODAL DE CONFIRMACIÓN
    // ==============================
    const confirmar = await mostrarModalConfirmacion({
        cancha: canchaTexto,
        fecha: fechaTexto,
        hora: hora,
        duracion: duracion,
        precioHora: precioHora,
        total: totalReserva
    });

    if (!confirmar) {
        mensaje.textContent = "Reserva cancelada por el usuario";
        mensaje.className = "mensaje error";
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/api/reservas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario: usuarioLogueado.id_usuario,
                id_cancha: idCancha,
                fecha: fecha,
                hora: hora,
                duracion_horas: duracion
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje exito";

            horaSelect.value = "";
            duracionSelect.value = "";

            actualizarHorariosDisponibles();
            cargarHorariosOcupados();
            cargarMisReservas();

            if (typeof actualizarResumenPrecio === "function") {
                actualizarResumenPrecio();
            }

        } else {
            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje error";
        }

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar con el servidor";
        mensaje.className = "mensaje error";
    }
});
// ==============================
// EVENTOS
// ==============================
fechaInput.addEventListener("change", () => {
    actualizarHorariosDisponibles();
    cargarHorariosOcupados();
});

canchaSelect.addEventListener("change", () => {
    actualizarHorariosDisponibles();
    cargarHorariosOcupados();
});

// ==============================
// INICIAR
// ==============================
cargarFechaActual();
actualizarHorariosDisponibles();
cargarCanchas();
cargarMisReservas();