const formCorreo = document.getElementById("formCorreo");
const formCambiarPassword = document.getElementById("formCambiarPassword");

const correo = document.getElementById("correo");
const codigo = document.getElementById("codigo");
const nuevaPassword = document.getElementById("nuevaPassword");
const confirmarPassword = document.getElementById("confirmarPassword");

const mensaje = document.getElementById("mensaje");

const btnEnviarCodigo = document.getElementById("btnEnviarCodigo");
const btnCambiarPassword = document.getElementById("btnCambiarPassword");

const API_URL = "http://localhost:3000";

let correoGuardado = "";

// ==============================
// PASO 1: SOLICITAR CÓDIGO
// ==============================
formCorreo.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correoIngresado = correo.value.trim().toLowerCase();

    if (!correoIngresado) {
        mensaje.textContent = "Debe ingresar su correo electrónico";
        mensaje.className = "mensaje error";
        return;
    }

    try {
        btnEnviarCodigo.disabled = true;
        btnEnviarCodigo.textContent = "Enviando...";

        const respuesta = await fetch(`${API_URL}/api/solicitar-recuperacion`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correoIngresado
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            correoGuardado = correoIngresado;

            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje exito";

            formCorreo.classList.add("oculto");
            formCambiarPassword.classList.remove("oculto");

        } else {
            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje error";
        }

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar con el servidor";
        mensaje.className = "mensaje error";

    } finally {
        btnEnviarCodigo.disabled = false;
        btnEnviarCodigo.textContent = "Enviar código";
    }
});

// ==============================
// PASO 2: CAMBIAR CONTRASEÑA
// ==============================
formCambiarPassword.addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigoIngresado = codigo.value.trim();
    const passwordNueva = nuevaPassword.value.trim();
    const passwordConfirmada = confirmarPassword.value.trim();

    if (!codigoIngresado || !passwordNueva || !passwordConfirmada) {
        mensaje.textContent = "Debe completar todos los campos";
        mensaje.className = "mensaje error";
        return;
    }

    if (passwordNueva !== passwordConfirmada) {
        mensaje.textContent = "Las contraseñas no coinciden";
        mensaje.className = "mensaje error";
        return;
    }

    try {
        btnCambiarPassword.disabled = true;
        btnCambiarPassword.textContent = "Cambiando...";

        const respuesta = await fetch(`${API_URL}/api/cambiar-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correoGuardado,
                codigo: codigoIngresado,
                nuevaPassword: passwordNueva
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje exito";

            formCambiarPassword.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);

        } else {
            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje error";
        }

    } catch (error) {
        console.error(error);
        mensaje.textContent = "No se pudo conectar con el servidor";
        mensaje.className = "mensaje error";

    } finally {
        btnCambiarPassword.disabled = false;
        btnCambiarPassword.textContent = "Cambiar contraseña";
    }
});