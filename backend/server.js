const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// PRUEBA PARA VER SI CARGA EL .env
console.log("Correo cargado:", process.env.GMAIL_USER || "NO CARGADO");
console.log("Clave cargada:", process.env.GMAIL_APP_PASSWORD ? "SI" : "NO");
// ==============================
// CONEXIÓN A MYSQL
// ==============================
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "club_deportivo",
    port: 3307
});

// Si tu MySQL usa 3306, cambiá:
// port: 3307
// por:
// port: 3306

db.connect((error) => {
    if (error) {
        console.log("Error al conectar con la base de datos:");
        console.log(error);
    } else {
        console.log("Conectado correctamente a la base de datos club_deportivo");
    }
});

// ==============================
// CONFIGURACIÓN DE CORREO
// ==============================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// ==============================
// ENVIAR CORREO
// ==============================
function enviarCorreo(destinatario, asunto, contenidoHtml) {
    return transporter.sendMail({
        from: `"" Famailla Padel Club - Famailla - Tucuman "" <${process.env.GMAIL_USER}>`,
        to: destinatario,
        subject: asunto,
        html: contenidoHtml
    });
}
// ==============================
// FUNCIONES AUXILIARES
// ==============================
function formatearFechaHora(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function crearFechaHora(fecha, hora) {
    let fechaHora;

    if (hora === "00:00") {
        fechaHora = new Date(`${fecha}T00:00:00`);
        fechaHora.setDate(fechaHora.getDate() + 1);
    } else {
        fechaHora = new Date(`${fecha}T${hora}:00`);
    }

    return fechaHora;
}

// ==============================
// RUTAS DE PRUEBA
// ==============================
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

app.get("/api/prueba", (req, res) => {
    res.json({
        mensaje: "La API está funcionando correctamente"
    });
});

// ==============================
// REGISTRO DE USUARIOS
// ==============================
app.post("/api/registro", (req, res) => {
    let { nombre_completo, dni, telefono, correo, usuario, password } = req.body;

    if (!nombre_completo || !dni || !telefono || !correo || !usuario || !password) {
        return res.status(400).json({
            mensaje: "Debe completar todos los campos"
        });
    }

    nombre_completo = nombre_completo.trim();
    dni = dni.trim();
    telefono = telefono.trim();
    correo = correo.trim().toLowerCase();
    usuario = usuario.trim().toLowerCase();
    password = password.trim();

    const nombreValido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{3,100}$/;
    const dniValido = /^[0-9]{7,8}$/;
    const telefonoValido = /^[0-9]{8,15}$/;
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usuarioValido = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9_]{6,20}$/;
    const passwordValida = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,20}$/;

    if (!nombreValido.test(nombre_completo)) {
        return res.status(400).json({
            mensaje: "El nombre completo solo debe contener letras y espacios"
        });
    }

    if (!dniValido.test(dni)) {
        return res.status(400).json({
            mensaje: "El DNI debe tener 7 u 8 números"
        });
    }

    if (!telefonoValido.test(telefono)) {
        return res.status(400).json({
            mensaje: "El teléfono debe contener solo números, entre 8 y 15 dígitos"
        });
    }

    if (!correoValido.test(correo)) {
        return res.status(400).json({
            mensaje: "Debe ingresar un correo electrónico válido. Ejemplo: usuario@gmail.com"
        });
    }

    if (!usuarioValido.test(usuario)) {
        return res.status(400).json({
            mensaje: "El usuario debe tener entre 6 y 20 caracteres, incluir letras y números, y no tener espacios"
        });
    }

    if (!passwordValida.test(password)) {
        return res.status(400).json({
            mensaje: "La contraseña debe tener entre 8 y 20 caracteres, incluir letras y números, y no tener espacios"
        });
    }

    const verificarUsuario = `
        SELECT * 
        FROM usuarios 
        WHERE usuario = ? OR dni = ? OR correo = ?
    `;

    db.query(verificarUsuario, [usuario, dni, correo], (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error al verificar el usuario"
            });
        }

        if (resultado.length > 0) {
            return res.status(400).json({
                mensaje: "Ya existe un usuario registrado con ese usuario, DNI o correo electrónico"
            });
        }

        const insertarUsuario = `
            INSERT INTO usuarios 
            (nombre_completo, dni, telefono, correo, usuario, password, rol)
            VALUES (?, ?, ?, ?, ?, ?, 'usuario')
        `;

        db.query(
            insertarUsuario,
            [nombre_completo, dni, telefono, correo, usuario, password],
            (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        mensaje: "Error al registrar el usuario"
                    });
                }

                res.json({
                    mensaje: "Usuario registrado correctamente"
                });
            }
        );
    });
});
// ==============================
// LOGIN DE USUARIOS Y ADMIN
// ==============================
app.post("/api/login", (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({
            mensaje: "Debe completar usuario y contraseña"
        });
    }

    const consulta = `
        SELECT id_usuario, usuario, rol
        FROM usuarios
        WHERE usuario = ? AND password = ?
    `;

    db.query(consulta, [usuario, password], (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error al iniciar sesión"
            });
        }

        if (resultado.length === 0) {
            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });
        }

        res.json({
            mensaje: "Inicio de sesión correcto",
            usuario: resultado[0]
        });
    });
});

// ==============================
// SOLICITAR CÓDIGO DE RECUPERACIÓN
// ==============================
app.post("/api/solicitar-recuperacion", (req, res) => {
    let { correo } = req.body;

    if (!correo) {
        return res.status(400).json({
            mensaje: "Debe ingresar su correo electrónico"
        });
    }

    correo = correo.trim().toLowerCase();

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    const consulta = `
        UPDATE usuarios
        SET codigo_recuperacion = ?,
            codigo_expira = DATE_ADD(NOW(), INTERVAL 10 MINUTE)
        WHERE correo = ?
    `;

    db.query(consulta, [codigo, correo], async (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error al generar el código de recuperación"
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "No existe un usuario registrado con ese correo"
            });
        }

        const contenidoHtml = `
            <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 25px;">
                <div style="max-width: 500px; margin: auto; background: white; padding: 25px; border-radius: 14px; border: 1px solid #e5e7eb;">
                    <h2 style="color: #064e3b;">Recuperación de contraseña</h2>

                    <p style="color: #334155;">
                        Recibimos una solicitud para recuperar la contraseña de tu cuenta.
                    </p>

                    <p style="color: #334155;">
                        Tu código de recuperación es:
                    </p>

                    <div style="font-size: 32px; font-weight: bold; color: #059669; letter-spacing: 4px; text-align: center; margin: 25px 0;">
                        ${codigo}
                    </div>

                    <p style="color: #64748b;">
                        Este código vence en 10 minutos.
                    </p>

                    <p style="color: #991b1b;">
                        Si no solicitaste este cambio, podés ignorar este correo.
                    </p>
                </div>
            </div>
        `;

        try {
            await enviarCorreo(
                correo,
                "Código de recuperación - Club de Pádel",
                contenidoHtml
            );

            res.json({
                mensaje: "Te enviamos un código de recuperación a tu correo electrónico"
            });

        } catch (errorCorreo) {
            console.log("Error al enviar correo:");
            console.log(errorCorreo);

            return res.status(500).json({
                mensaje: "No se pudo enviar el correo de recuperación"
            });
        }
    });
});

// ==============================
// CAMBIAR CONTRASEÑA CON CÓDIGO
// ==============================
app.post("/api/cambiar-password", (req, res) => {
    let { correo, codigo, nuevaPassword } = req.body;

    if (!correo || !codigo || !nuevaPassword) {
        return res.status(400).json({
            mensaje: "Debe completar correo, código y nueva contraseña"
        });
    }

    correo = correo.trim().toLowerCase();
    codigo = codigo.trim();
    nuevaPassword = nuevaPassword.trim();

    const passwordValida = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,20}$/;

    if (!passwordValida.test(nuevaPassword)) {
        return res.status(400).json({
            mensaje: "La contraseña debe tener entre 8 y 20 caracteres, incluir letras y números, y no tener espacios"
        });
    }

    const verificarCodigo = `
        SELECT *
        FROM usuarios
        WHERE correo = ?
        AND codigo_recuperacion = ?
        AND codigo_expira > NOW()
    `;

    db.query(verificarCodigo, [correo, codigo], (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error al verificar el código"
            });
        }

        if (resultado.length === 0) {
            return res.status(400).json({
                mensaje: "El código es incorrecto o ya expiró"
            });
        }

        const actualizarPassword = `
            UPDATE usuarios
            SET password = ?,
                codigo_recuperacion = NULL,
                codigo_expira = NULL
            WHERE correo = ?
        `;

        db.query(actualizarPassword, [nuevaPassword, correo], (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    mensaje: "Error al cambiar la contraseña"
                });
            }

            res.json({
                mensaje: "Contraseña actualizada correctamente"
            });
        });
    });
});
// ==============================
// OBTENER CANCHAS
// ==============================
app.get("/api/canchas", (req, res) => {
    const consulta = `
        SELECT 
            id_cancha, 
            nombre, 
            tipo, 
            descripcion, 
            precio_hora
        FROM canchas
        WHERE activa = 1
        ORDER BY id_cancha ASC
    `;

    db.query(consulta, (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error al obtener las canchas"
            });
        }

        res.json(resultado);
    });
});

// ==============================
// OBTENER RESERVAS OCUPADAS
// ==============================
app.get("/api/reservas/ocupadas", (req, res) => {
    const { fecha, id_cancha } = req.query;

    if (!fecha || !id_cancha) {
        return res.status(400).json({
            mensaje: "Debe enviar fecha e id_cancha"
        });
    }

    const consulta = `
        SELECT id_reserva, id_cancha, fecha, inicio, fin, duracion_horas
        FROM reservas
        WHERE fecha = ?
        AND id_cancha = ?
        AND estado = 'activa'
        ORDER BY inicio ASC
    `;

    db.query(consulta, [fecha, id_cancha], (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error al obtener las reservas ocupadas"
            });
        }

        res.json(resultado);
    });
});

// ==============================
// CREAR RESERVA
// ==============================
app.post("/api/reservas", (req, res) => {
    const { id_usuario, id_cancha, fecha, hora, duracion_horas } = req.body;

    if (!id_usuario || !id_cancha || !fecha || !hora || !duracion_horas) {
        return res.status(400).json({
            mensaje: "Debe completar todos los datos de la reserva"
        });
    }

    const duracion = parseInt(duracion_horas);

    if (duracion < 1 || duracion > 5) {
        return res.status(400).json({
            mensaje: "La duración debe ser entre 1 y 5 horas"
        });
    }

    const inicioReserva = crearFechaHora(fecha, hora);
    const finReserva = new Date(inicioReserva);

    finReserva.setHours(finReserva.getHours() + duracion);

    const ahora = new Date();

    if (inicioReserva <= ahora) {
        return res.status(400).json({
            mensaje: "No se puede reservar un horario que ya pasó"
        });
    }

    const apertura = new Date(`${fecha}T08:00:00`);
    const cierre = new Date(`${fecha}T01:00:00`);
    cierre.setDate(cierre.getDate() + 1);

    if (inicioReserva < apertura || finReserva > cierre) {
        return res.status(400).json({
            mensaje: "El club está abierto desde las 08:00 hasta la 01:00"
        });
    }

    const inicioTexto = formatearFechaHora(inicioReserva);
    const finTexto = formatearFechaHora(finReserva);

    const verificarReserva = `
        SELECT *
        FROM reservas
        WHERE id_cancha = ?
        AND estado = 'activa'
        AND inicio < ?
        AND fin > ?
    `;

    db.query(verificarReserva, [id_cancha, finTexto, inicioTexto], (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error al verificar disponibilidad"
            });
        }

        if (resultado.length > 0) {
            return res.status(400).json({
                mensaje: "Ese horario ya está ocupado para esta cancha"
            });
        }

        // Obtener datos de cancha y usuario para calcular total y enviar correo
        const obtenerDatos = `
            SELECT 
                canchas.nombre AS nombre_cancha,
                canchas.tipo AS tipo_cancha,
                canchas.precio_hora,
                usuarios.nombre_completo,
                usuarios.usuario,
                usuarios.correo
            FROM canchas
            INNER JOIN usuarios ON usuarios.id_usuario = ?
            WHERE canchas.id_cancha = ?
        `;

        db.query(obtenerDatos, [id_usuario, id_cancha], (error, datosResultado) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    mensaje: "Error al obtener datos de la reserva"
                });
            }

            if (datosResultado.length === 0) {
                return res.status(404).json({
                    mensaje: "No se encontró el usuario o la cancha seleccionada"
                });
            }

            const datosReserva = datosResultado[0];

            const precioHora = Number(datosReserva.precio_hora);
            const total = precioHora * duracion;

            const insertarReserva = `
                INSERT INTO reservas 
                (id_usuario, id_cancha, fecha, inicio, fin, duracion_horas, total, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'activa')
            `;

            db.query(
                insertarReserva,
                [id_usuario, id_cancha, fecha, inicioTexto, finTexto, duracion, total],
                async (error) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({
                            mensaje: "Error al crear la reserva"
                        });
                    }

                    // ==============================
                    // ENVIAR CORREO DE CONFIRMACIÓN
                    // ==============================
                    if (datosReserva.correo) {
                        const fechaMostrar = fecha.split("-").reverse().join("/");
                        const horaInicioMostrar = String(hora).substring(0, 5);

                        const horaFinMostrar = `${String(finReserva.getHours()).padStart(2, "0")}:${String(finReserva.getMinutes()).padStart(2, "0")}`;

                        const totalMostrar = `$${Number(total).toLocaleString("es-AR")}`;
                        const precioHoraMostrar = `$${Number(precioHora).toLocaleString("es-AR")}`;

                        const contenidoHtml = `
                            <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 25px;">
                                <div style="max-width: 550px; margin: auto; background: white; padding: 25px; border-radius: 16px; border: 1px solid #e5e7eb;">
                                    
                                    <h2 style="color: #064e3b; margin-bottom: 10px;">
                                        Reserva confirmada
                                    </h2>

                                    <p style="color: #334155;">
                                        Hola <strong>${datosReserva.nombre_completo || datosReserva.usuario}</strong>, tu reserva fue registrada correctamente.
                                    </p>

                                    <div style="background: #ecfdf5; border: 1px solid #86efac; border-radius: 14px; padding: 18px; margin: 20px 0;">
                                        <p style="margin: 8px 0; color: #064e3b;">
                                            <strong>Cancha:</strong> ${datosReserva.nombre_cancha}
                                        </p>

                                        <p style="margin: 8px 0; color: #064e3b;">
                                            <strong>Tipo:</strong> ${datosReserva.tipo_cancha}
                                        </p>

                                        <p style="margin: 8px 0; color: #064e3b;">
                                            <strong>Fecha:</strong> ${fechaMostrar}
                                        </p>

                                        <p style="margin: 8px 0; color: #064e3b;">
                                            <strong>Horario:</strong> ${horaInicioMostrar} a ${horaFinMostrar} hs
                                        </p>

                                        <p style="margin: 8px 0; color: #064e3b;">
                                            <strong>Duración:</strong> ${duracion} hora/s
                                        </p>

                                        <p style="margin: 8px 0; color: #064e3b;">
                                            <strong>Precio por hora:</strong> ${precioHoraMostrar}
                                        </p>

                                        <p style="margin: 14px 0 0; font-size: 20px; color: #059669;">
                                            <strong>Total:</strong> ${totalMostrar}
                                        </p>
                                    </div>

                                    <p style="color: #64748b;">
                                        Te esperamos en el club. Recordá llegar unos minutos antes de tu turno.
                                    </p>

                                    <p style="color: #991b1b;">
                                        Si necesitás cancelar, ingresá al sistema con tu usuario.
                                    </p>
                                </div>
                            </div>
                        `;

                        try {
                            await enviarCorreo(
                                datosReserva.correo,
                                "Confirmación de reserva - Club de Pádel",
                                contenidoHtml
                            );

                            console.log("Correo de reserva enviado a:", datosReserva.correo);

                        } catch (errorCorreo) {
                            console.log("La reserva se creó, pero no se pudo enviar el correo:");
                            console.log(errorCorreo);
                        }
                    }

                    res.json({
                        mensaje: "Reserva realizada correctamente",
                        total: total
                    });
                }
            );
        });
    });
});

// ==============================
// ==============================
// USUARIO - VER SUS RESERVAS ACTIVAS FUTURAS
// ==============================
app.get("/api/usuarios/:id_usuario/reservas", (req, res) => {
    const idUsuario = req.params.id_usuario;

    const consulta = `
        SELECT 
            reservas.id_reserva,
            reservas.fecha,
            reservas.inicio,
            reservas.fin,
            reservas.duracion_horas,
            reservas.total,
            reservas.estado,
            canchas.nombre AS nombre_cancha,
            canchas.tipo AS tipo_cancha,
            canchas.descripcion AS descripcion_cancha
        FROM reservas
        INNER JOIN canchas ON reservas.id_cancha = canchas.id_cancha
        WHERE reservas.id_usuario = ?
        AND reservas.estado = 'activa'
        AND reservas.fin > NOW()
        ORDER BY reservas.inicio ASC
    `;

    db.query(consulta, [idUsuario], (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error al obtener las reservas del usuario"
            });
        }

        res.json(resultado);
    });
});

// ==============================
// USUARIO - CANCELAR MI RESERVA
// ==============================
app.put("/api/usuarios/:id_usuario/reservas/:id_reserva/cancelar", (req, res) => {
    const idUsuario = req.params.id_usuario;
    const idReserva = req.params.id_reserva;

    const obtenerReserva = `
        SELECT 
            reservas.id_reserva,
            reservas.fecha,
            reservas.inicio,
            reservas.fin,
            reservas.duracion_horas,
            reservas.total,

            DATE_FORMAT(reservas.fecha, '%d/%m/%Y') AS fecha_formateada,
            DATE_FORMAT(reservas.inicio, '%H:%i') AS hora_inicio,
            DATE_FORMAT(reservas.fin, '%H:%i') AS hora_fin,

            usuarios.nombre_completo,
            usuarios.usuario,
            usuarios.correo,

            canchas.nombre AS nombre_cancha,
            canchas.tipo AS tipo_cancha
        FROM reservas
        INNER JOIN usuarios ON reservas.id_usuario = usuarios.id_usuario
        INNER JOIN canchas ON reservas.id_cancha = canchas.id_cancha
        WHERE reservas.id_reserva = ?
        AND reservas.id_usuario = ?
        AND reservas.estado = 'activa'
        AND reservas.inicio >= DATE_ADD(NOW(), INTERVAL 1 HOUR)
    `;

    db.query(obtenerReserva, [idReserva, idUsuario], (error, resultado) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                mensaje: "Error al buscar la reserva"
            });
        }

        if (resultado.length === 0) {
            return res.status(400).json({
                mensaje: "Solo se puede cancelar una reserva hasta 1 hora antes del turno"
            });
        }

        const reserva = resultado[0];

        const cancelarReserva = `
            UPDATE reservas
            SET estado = 'cancelada'
            WHERE id_reserva = ?
            AND id_usuario = ?
            AND estado = 'activa'
        `;

        db.query(cancelarReserva, [idReserva, idUsuario], async (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    mensaje: "Error al cancelar la reserva"
                });
            }

            // ==============================
            // ENVIAR CORREO DE CANCELACIÓN
            // ==============================
            if (reserva.correo) {
                const totalMostrar = `$${Number(reserva.total).toLocaleString("es-AR")}`;

                const contenidoHtml = `
                    <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 25px;">
                        <div style="max-width: 550px; margin: auto; background: white; padding: 25px; border-radius: 16px; border: 1px solid #e5e7eb;">
                            
                            <h2 style="color: #991b1b; margin-bottom: 10px;">
                                Reserva cancelada
                            </h2>

                            <p style="color: #334155;">
                                Hola <strong>${reserva.nombre_completo || reserva.usuario}</strong>, tu reserva fue cancelada correctamente.
                            </p>

                            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 14px; padding: 18px; margin: 20px 0;">
                                <p style="margin: 8px 0; color: #7f1d1d;">
                                    <strong>Cancha:</strong> ${reserva.nombre_cancha}
                                </p>

                                <p style="margin: 8px 0; color: #7f1d1d;">
                                    <strong>Tipo:</strong> ${reserva.tipo_cancha}
                                </p>

                                <p style="margin: 8px 0; color: #7f1d1d;">
                                    <strong>Fecha:</strong> ${reserva.fecha_formateada}
                                </p>

                                <p style="margin: 8px 0; color: #7f1d1d;">
                                    <strong>Horario:</strong> ${reserva.hora_inicio} a ${reserva.hora_fin} hs
                                </p>

                                <p style="margin: 8px 0; color: #7f1d1d;">
                                    <strong>Duración:</strong> ${reserva.duracion_horas} hora/s
                                </p>

                                <p style="margin: 14px 0 0; font-size: 20px; color: #991b1b;">
                                    <strong>Total de la reserva:</strong> ${totalMostrar}
                                </p>
                            </div>

                            <p style="color: #64748b;">
                                Esta reserva ya no se encuentra activa en el sistema.
                            </p>
                        </div>
                    </div>
                `;

                try {
                    await enviarCorreo(
                        reserva.correo,
                        "Cancelación de reserva - Club de Pádel",
                        contenidoHtml
                    );

                    console.log("Correo de cancelación enviado a:", reserva.correo);

                } catch (errorCorreo) {
                    console.log("La reserva se canceló, pero no se pudo enviar el correo:");
                    console.log(errorCorreo);
                }
            }

            res.json({
                mensaje: "Reserva cancelada correctamente"
            });
        });
    });
});
// ==============================
// PANEL ADMIN - VER TODAS LAS RESERVAS
// ==============================
app.get("/api/admin/reservas", (req, res) => {
    const consulta = `
        SELECT 
            reservas.id_reserva,
            reservas.fecha,
            reservas.inicio,
            reservas.fin,
            reservas.duracion_horas,
            reservas.total,
            reservas.estado,

            usuarios.usuario AS nombre_usuario,
            usuarios.nombre_completo,
            usuarios.dni,
            usuarios.telefono,

            canchas.nombre AS nombre_cancha,
            canchas.tipo AS tipo_cancha
        FROM reservas
        INNER JOIN usuarios ON reservas.id_usuario = usuarios.id_usuario
        INNER JOIN canchas ON reservas.id_cancha = canchas.id_cancha
        ORDER BY reservas.inicio DESC
    `;

    db.query(consulta, (error, resultado) => {
        if (error) {
            console.log("Error en /api/admin/reservas:");
            console.log(error);

            return res.status(500).json({
                mensaje: "Error al obtener las reservas del administrador",
                error: error.sqlMessage
            });
        }

        res.json(resultado);
    });
});


// ==============================
// ADMIN - RESUMEN GENERAL
// ==============================
app.get("/api/admin/resumen", (req, res) => {
    const consulta = `
        SELECT
            (SELECT COUNT(*) FROM reservas) AS total_reservas,

            (SELECT COUNT(*) 
             FROM reservas 
             WHERE estado = 'activa') AS reservas_activas,

            (SELECT COUNT(*) 
             FROM reservas 
             WHERE estado = 'cancelada') AS reservas_canceladas,

            (SELECT COUNT(*) 
             FROM reservas 
             WHERE DATE(inicio) = CURDATE()
             AND estado = 'activa') AS reservas_hoy,

            (SELECT COALESCE(SUM(total), 0)
             FROM reservas 
             WHERE estado = 'activa') AS ingresos_totales,

            (SELECT COALESCE(SUM(total), 0)
             FROM reservas 
             WHERE DATE(inicio) = CURDATE()
             AND estado = 'activa') AS ingresos_hoy,

            (SELECT COALESCE(SUM(total), 0)
             FROM reservas 
             WHERE MONTH(inicio) = MONTH(CURDATE())
             AND YEAR(inicio) = YEAR(CURDATE())
             AND estado = 'activa') AS ingresos_mes,

            (
                SELECT canchas.nombre
                FROM reservas
                INNER JOIN canchas ON reservas.id_cancha = canchas.id_cancha
                WHERE reservas.estado = 'activa'
                GROUP BY canchas.id_cancha, canchas.nombre
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ) AS cancha_mas_reservada
    `;

    db.query(consulta, (error, resultado) => {
        if (error) {
            console.log("Error en /api/admin/resumen:");
            console.log(error);

            return res.status(500).json({
                mensaje: "Error al obtener el resumen del administrador",
                error: error.sqlMessage
            });
        }

        res.json(resultado[0]);
    });
});

// ==============================
// ADMIN - CANCELAR RESERVA
// ==============================
app.put("/api/admin/reservas/:id/cancelar", (req, res) => {
    const idReserva = req.params.id;

    const obtenerReserva = `
        SELECT 
            reservas.id_reserva,
            reservas.fecha,
            reservas.inicio,
            reservas.fin,
            reservas.duracion_horas,
            reservas.total,

            DATE_FORMAT(reservas.fecha, '%d/%m/%Y') AS fecha_formateada,
            DATE_FORMAT(reservas.inicio, '%H:%i') AS hora_inicio,
            DATE_FORMAT(reservas.fin, '%H:%i') AS hora_fin,

            usuarios.nombre_completo,
            usuarios.usuario,
            usuarios.correo,

            canchas.nombre AS nombre_cancha,
            canchas.tipo AS tipo_cancha
        FROM reservas
        INNER JOIN usuarios ON reservas.id_usuario = usuarios.id_usuario
        INNER JOIN canchas ON reservas.id_cancha = canchas.id_cancha
        WHERE reservas.id_reserva = ?
        AND reservas.estado = 'activa'
        AND reservas.inicio > NOW()
    `;

    db.query(obtenerReserva, [idReserva], (error, resultado) => {
        if (error) {
            console.log("Error al buscar reserva admin:");
            console.log(error);

            return res.status(500).json({
                mensaje: "Error al buscar la reserva"
            });
        }

        if (resultado.length === 0) {
            return res.status(400).json({
                mensaje: "No se puede cancelar una reserva pasada o ya cancelada"
            });
        }

        const reserva = resultado[0];

        const cancelarReserva = `
            UPDATE reservas
            SET estado = 'cancelada'
            WHERE id_reserva = ?
            AND estado = 'activa'
        `;

        db.query(cancelarReserva, [idReserva], async (error) => {
            if (error) {
                console.log("Error al cancelar reserva admin:");
                console.log(error);

                return res.status(500).json({
                    mensaje: "Error al cancelar la reserva"
                });
            }

            // ==============================
            // ENVIAR CORREO DE CANCELACIÓN
            // ==============================
            if (reserva.correo) {
                const totalMostrar = `$${Number(reserva.total).toLocaleString("es-AR")}`;

                const contenidoHtml = `
                    <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 25px;">
                        <div style="max-width: 550px; margin: auto; background: white; padding: 25px; border-radius: 16px; border: 1px solid #e5e7eb;">
                            
                            <h2 style="color: #991b1b; margin-bottom: 10px;">
                                Reserva cancelada
                            </h2>

                            <p style="color: #334155;">
                                Hola <strong>${reserva.nombre_completo || reserva.usuario}</strong>, tu reserva fue cancelada por el administrador del club.
                            </p>

                            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 14px; padding: 18px; margin: 20px 0;">
                                <p style="margin: 8px 0; color: #7f1d1d;">
                                    <strong>Cancha:</strong> ${reserva.nombre_cancha}
                                </p>

                                <p style="margin: 8px 0; color: #7f1d1d;">
                                    <strong>Tipo:</strong> ${reserva.tipo_cancha}
                                </p>

                                <p style="margin: 8px 0; color: #7f1d1d;">
                                    <strong>Fecha:</strong> ${reserva.fecha_formateada}
                                </p>

                                <p style="margin: 8px 0; color: #7f1d1d;">
                                    <strong>Horario:</strong> ${reserva.hora_inicio} a ${reserva.hora_fin} hs
                                </p>

                                <p style="margin: 8px 0; color: #7f1d1d;">
                                    <strong>Duración:</strong> ${reserva.duracion_horas} hora/s
                                </p>

                                <p style="margin: 14px 0 0; font-size: 20px; color: #991b1b;">
                                    <strong>Total de la reserva:</strong> ${totalMostrar}
                                </p>
                            </div>

                            <p style="color: #64748b;">
                                Esta reserva ya no se encuentra activa en el sistema.
                            </p>

                            <p style="color: #991b1b;">
                                Si tenés dudas, comunicate con el club.
                            </p>
                        </div>
                    </div>
                `;

                try {
                    await enviarCorreo(
                        reserva.correo,
                        "Cancelación de reserva - Club de Pádel",
                        contenidoHtml
                    );

                    console.log("Correo de cancelación enviado a:", reserva.correo);

                } catch (errorCorreo) {
                    console.log("La reserva se canceló, pero no se pudo enviar el correo:");
                    console.log(errorCorreo);
                }
            }

            res.json({
                mensaje: "Reserva cancelada correctamente"
            });
        });
    });
});
// ==============================
// INICIAR SERVIDOR
// ==============================
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
    console.log("Ruta prueba: GET http://localhost:3000/api/prueba");
    console.log("Ruta registro: POST http://localhost:3000/api/registro");
    console.log("Ruta login: POST http://localhost:3000/api/login");
    console.log("Ruta canchas: GET http://localhost:3000/api/canchas");
    console.log("Ruta reservas: POST http://localhost:3000/api/reservas");
    console.log("Ruta mis reservas: GET http://localhost:3000/api/usuarios/:id_usuario/reservas");
    console.log("Ruta admin reservas: GET http://localhost:3000/api/admin/reservas");
});