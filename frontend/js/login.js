const formLogin = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje");

formLogin.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (usuario === "" || password === "") {
        mensaje.textContent = "Debe completar todos los campos";
        mensaje.className = "mensaje error";
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                password: password
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            localStorage.setItem("usuarioLogueado", JSON.stringify(datos.usuario));

            mensaje.textContent = datos.mensaje;
            mensaje.className = "mensaje exito";

            setTimeout(() => {
                if (datos.usuario.rol === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "reservas.html";
                }
            }, 1000);

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