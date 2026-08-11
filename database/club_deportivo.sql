UPDATE canchas 
SET nombre = 'Cancha 1 "Cesped Azul"',
    tipo = 'Pádel',
    descripcion = 'Césped Azul, blindex profesional e iluminación LED'
WHERE id_cancha = 1;

UPDATE canchas 
SET nombre = 'Cancha 2 "Cesped Verde"',
    tipo = 'Pádel',
    descripcion = 'Césped Verde, blindex profesional e iluminación LED'
WHERE id_cancha = 2;

UPDATE canchas 
SET nombre = 'Cancha 3 "Cesped Negro"',
    tipo = 'Pádel',
    descripcion = 'Césped Negro, blindex profesional e iluminación LED'
WHERE id_cancha = 3;

UPDATE canchas 
SET nombre = 'Cancha 4 "Cesped Naranja"',
    tipo = 'Padel',
    descripcion = 'Césped Naranja, blindex profesional e iluminación LED'
WHERE id_cancha = 4;





/*DROP DATABASE IF EXISTS club_deportivo;
CREATE DATABASE club_deportivo;
USE club_deportivo;

-- ==============================
-- TABLA DE USUARIOS
-- ==============================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- TABLA DE CANCHAS
-- ==============================
CREATE TABLE canchas (
    id_cancha INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    activa BOOLEAN DEFAULT TRUE
);

-- ==============================
-- TABLA DE RESERVAS
-- ==============================
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_cancha INT NOT NULL,
    fecha DATE NOT NULL,
    inicio DATETIME NOT NULL,
    fin DATETIME NOT NULL,
    duracion_horas INT NOT NULL,
    estado ENUM('activa', 'cancelada') DEFAULT 'activa',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha)
);

-- ==============================
-- USUARIO ADMINISTRADOR
-- ==============================
INSERT INTO usuarios (usuario, password, rol) VALUES
('admin', 'admin123', 'admin');

-- ==============================
-- CANCHAS DEL CLUB
-- ==============================
INSERT INTO canchas (nombre, tipo, descripcion) VALUES
('Pádel 1', 'Pádel', 'Cancha de pádel profesional con blindex y césped sintético'),
('Pádel 2', 'Pádel', 'Cancha de pádel profesional con blindex y césped sintético'),
('Fútbol 7 - Cancha 1', 'Fútbol 7', 'Cancha profesional de fútbol 7'),
('Fútbol 7 - Cancha 2', 'Fútbol 7', 'Cancha profesional de fútbol 7');
*/