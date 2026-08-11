const formRegistro = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");
const botonRegistro = formRegistro.querySelector("button");

formRegistro.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre_completo = document.getElementById("nombre_completo").value.trim();
    const dni = document.getElementById("dni").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const usuario = document.getElementById("usuario").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    const nombreValido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{3,100}$/;
    const dniValido = /^[0-9]{7,8}$/;
    const telefonoValido = /^[0-9]{8,15}$/;
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const usuarioValido = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9_]{6,20}$/;
    const passwordValida = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,20}$/;

    if (
        nombre_completo === "" ||
        dni === "" ||
        telefono === "" ||
        correo === "" ||
        usuario === "" ||
        password === ""
    ) {
        mensaje.textContent = "Debe completar todos los campos";
        mensaje.className = "mensaje error";
        return;
    }

    if (!nombreValido.test(nombre_completo)) {
        mensaje.textContent = "El nombre completo solo debe contener letras y espacios";
        mensaje.className = "mensaje error";
        return;
    }

    if (!dniValido.test(dni)) {
        mensaje.textContent = "El DNI debe tener 7 u 8 números";
        mensaje.className = "mensaje error";
        return;
    }

    if (!telefonoValido.test(telefono)) {
        mensaje.textContent = "El teléfono debe contener solo números, entre 8 y 15 dígitos";
        mensaje.className = "mensaje error";
        return;
    }

    if (!correoValido.test(correo)) {
        mensaje.textContent = "Ingrese un correo electrónico válido. Ejemplo: usuario@gmail.com";
        mensaje.className = "mensaje error";
        return;
    }

    if (!usuarioValido.test(usuario)) {
        mensaje.textContent = "El usuario debe tener entre 6 y 20 caracteres, incluir letras y números, y no tener espacios. Ejemplo: facundo123";
        mensaje.className = "mensaje error";
        return;
    }

    if (!passwordValida.test(password)) {
        mensaje.textContent = "La contraseña debe tener entre 8 y 20 caracteres, incluir letras y números, y no tener espacios. Ejemplo: clave1234";
        mensaje.className = "mensaje error";
        return;
    }

    try {
        botonRegistro.disabled = true;
        botonRegistro.textContent = "Registrando...";

        const respuesta = await fetch("http://localhost:3000/api/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre_completo: nombre_completo,
                dni: dni,
                telefono: telefono,
                correo: correo,
                usuario: usuario,
                password: password
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje exito";

            formRegistro.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje error";
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        mensaje.textContent = "No se pudo conectar con el servidor. Revisá que Node esté corriendo en el puerto 3000.";
        mensaje.className = "mensaje error";
    } finally {
        botonRegistro.disabled = false;
        botonRegistro.textContent = "Registrarme";
    }
});