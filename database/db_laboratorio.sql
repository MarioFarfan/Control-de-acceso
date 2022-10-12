-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-10-2022 a las 01:57:04
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `laboratorio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno`
--

CREATE TABLE `alumno` (
  `IDPERSONA` int(11) NOT NULL,
  `NOCONTROL` varchar(9) DEFAULT NULL,
  `IDDEPTO` int(6) DEFAULT NULL,
  `IDCARRERA` varchar(6) DEFAULT NULL,
  `SEMESTRE` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area`
--

CREATE TABLE `area` (
  `IDAREA` int(11) NOT NULL,
  `ALIASAREA` varchar(15) DEFAULT NULL,
  `CAPACIDAD` int(11) DEFAULT NULL,
  `DESCRIPCION` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrera`
--

CREATE TABLE `carrera` (
  `IDDEPTO` int(11) NOT NULL,
  `IDCARRERA` varchar(6) NOT NULL,
  `NOMBRE` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `IDDEPTO` int(6) NOT NULL,
  `NOMBRE` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallegrupo`
--

CREATE TABLE `detallegrupo` (
  `CLAVEGRUPO` varchar(15) DEFAULT NULL,
  `IDPERSONA` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente`
--

CREATE TABLE `docente` (
  `IDPERSONA` int(11) NOT NULL,
  `NOTARJETA` varchar(9) DEFAULT NULL,
  `IDDEPTO` int(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE `equipo` (
  `FOLIOINV` varchar(40) DEFAULT NULL,
  `NOSERIE` int(30) DEFAULT NULL,
  `MARCA` varchar(30) DEFAULT NULL,
  `TIPO` varchar(30) DEFAULT NULL,
  `FOLIOCPU` varchar(40) DEFAULT NULL,
  `IDAREA` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo`
--

CREATE TABLE `grupo` (
  `CLAVEGRUPO` varchar(15) NOT NULL,
  `CLAVE` varchar(10) DEFAULT NULL,
  `DOCENTE` int(11) DEFAULT NULL,
  `NOALUMNOS` int(11) DEFAULT NULL,
  `HORA` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial`
--

CREATE TABLE `historial` (
  `FOLIOHIST` int(11) NOT NULL,
  `FOLIOPRACTICA` int(11) DEFAULT NULL,
  `TIPO` varchar(20) DEFAULT NULL CHECK (`TIPO` in ('ALTA','ACTUALIZACION','BAJA')),
  `FECHA` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `IDINV` int(11) NOT NULL,
  `FOLIOINV` int(11) DEFAULT NULL,
  `TIPO` varchar(20) DEFAULT NULL CHECK (`TIPO` in ('ALTA','ACTUALIZACION','BAJA')),
  `FECHA` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materia`
--

CREATE TABLE `materia` (
  `CLAVE` varchar(10) NOT NULL,
  `IDDEPTO` int(6) DEFAULT NULL,
  `IDCARRERA` varchar(5) DEFAULT NULL,
  `RETICULA` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `IDPERSONA` int(11) NOT NULL,
  `NOMBRE` varchar(20) NOT NULL,
  `AP_PA` varchar(20) NOT NULL,
  `AP_MA` varchar(20) NOT NULL,
  `ESTADO` varchar(20) DEFAULT NULL CHECK (`ESTADO` in ('ALTA','BAJA')),
  `FECHA_ALTA` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal`
--

CREATE TABLE `personal` (
  `IDPERSONA` int(11) NOT NULL,
  `NOTARJETA` varchar(9) DEFAULT NULL,
  `IDDEPTO` int(6) DEFAULT NULL,
  `PUESTO` varchar(20) DEFAULT NULL CHECK (`PUESTO` in ('ENCARGADO','AUXILIAR')),
  `TURNO` varchar(20) DEFAULT NULL CHECK (`TURNO` in ('MATUTINO','VESPERTINO','MIXTO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `practica`
--

CREATE TABLE `practica` (
  `FOLIOPRACTICA` int(11) NOT NULL,
  `NOM_PRACTICA` varchar(30) DEFAULT NULL,
  `FECHA` date DEFAULT NULL,
  `DURACION` int(11) DEFAULT NULL,
  `CLAVE` varchar(10) DEFAULT NULL,
  `CLAVEGRUPO` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `software`
--

CREATE TABLE `software` (
  `IDSOFTWARE` int(11) NOT NULL,
  `SOFTWARE` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `IDUSUARIO` int(11) NOT NULL,
  `USUARIO` varchar(9) DEFAULT NULL,
  `CONTRASENIA` varbinary(20) DEFAULT NULL,
  `ROL` varchar(20) DEFAULT NULL CHECK (`ROL` in ('DOCENTE','ADMINISTRADOR','AUXILIAR')),
  `IDPERSONA` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumno`
--
ALTER TABLE `alumno`
  ADD PRIMARY KEY (`IDPERSONA`),
  ADD KEY `IDDEPTO` (`IDDEPTO`,`IDCARRERA`);

--
-- Indices de la tabla `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`IDAREA`);

--
-- Indices de la tabla `carrera`
--
ALTER TABLE `carrera`
  ADD PRIMARY KEY (`IDDEPTO`,`IDCARRERA`);

--
-- Indices de la tabla `departamento`
--
ALTER TABLE `departamento`
  ADD PRIMARY KEY (`IDDEPTO`);

--
-- Indices de la tabla `docente`
--
ALTER TABLE `docente`
  ADD PRIMARY KEY (`IDPERSONA`),
  ADD KEY `IDDEPTO` (`IDDEPTO`);

--
-- Indices de la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`CLAVEGRUPO`);

--
-- Indices de la tabla `historial`
--
ALTER TABLE `historial`
  ADD PRIMARY KEY (`FOLIOHIST`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`IDINV`);

--
-- Indices de la tabla `materia`
--
ALTER TABLE `materia`
  ADD PRIMARY KEY (`CLAVE`),
  ADD KEY `IDDEPTO` (`IDDEPTO`,`IDCARRERA`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`IDPERSONA`);

--
-- Indices de la tabla `personal`
--
ALTER TABLE `personal`
  ADD PRIMARY KEY (`IDPERSONA`);

--
-- Indices de la tabla `practica`
--
ALTER TABLE `practica`
  ADD PRIMARY KEY (`FOLIOPRACTICA`);

--
-- Indices de la tabla `software`
--
ALTER TABLE `software`
  ADD PRIMARY KEY (`IDSOFTWARE`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`IDUSUARIO`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `area`
--
ALTER TABLE `area`
  MODIFY `IDAREA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `IDDEPTO` int(6) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial`
--
ALTER TABLE `historial`
  MODIFY `FOLIOHIST` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `IDINV` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `IDPERSONA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `practica`
--
ALTER TABLE `practica`
  MODIFY `FOLIOPRACTICA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `IDUSUARIO` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alumno`
--
ALTER TABLE `alumno`
  ADD CONSTRAINT `alumno_ibfk_1` FOREIGN KEY (`IDDEPTO`,`IDCARRERA`) REFERENCES `carrera` (`IDDEPTO`, `IDCARRERA`);

--
-- Filtros para la tabla `docente`
--
ALTER TABLE `docente`
  ADD CONSTRAINT `docente_ibfk_1` FOREIGN KEY (`IDDEPTO`) REFERENCES `departamento` (`IDDEPTO`);

--
-- Filtros para la tabla `materia`
--
ALTER TABLE `materia`
  ADD CONSTRAINT `materia_ibfk_1` FOREIGN KEY (`IDDEPTO`,`IDCARRERA`) REFERENCES `carrera` (`IDDEPTO`, `IDCARRERA`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;