-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: laboratorio
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alumno`
--

DROP TABLE IF EXISTS `alumno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumno` (
  `nocontrol` int NOT NULL,
  `nombre_al` varchar(30) NOT NULL,
  `ap_pat` varchar(25) NOT NULL,
  `ap_mat` varchar(25) NOT NULL,
  `idcarrera` varchar(3) NOT NULL,
  `semestre` int NOT NULL,
  `status` varchar(45) DEFAULT 'ALTA',
  PRIMARY KEY (`nocontrol`),
  KEY `carrera_alumno_idx` (`idcarrera`),
  CONSTRAINT `carrera_alumno` FOREIGN KEY (`idcarrera`) REFERENCES `carrera` (`idcarrera`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumno`
--

LOCK TABLES `alumno` WRITE;
/*!40000 ALTER TABLE `alumno` DISABLE KEYS */;
INSERT INTO `alumno` VALUES (17171171,'DANIEL','MARTINEZ','LEON','ISC',11,'ALTA');
/*!40000 ALTER TABLE `alumno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `area`
--

DROP TABLE IF EXISTS `area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `area` (
  `idarea` varchar(10) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `capacidad` int NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idarea`),
  UNIQUE KEY `idarea_UNIQUE` (`idarea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area`
--

LOCK TABLES `area` WRITE;
/*!40000 ALTER TABLE `area` DISABLE KEYS */;
INSERT INTO `area` VALUES ('USUARIOS1','LABORATORIO USUARIOS 1',25,'...');
/*!40000 ALTER TABLE `area` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrera`
--

DROP TABLE IF EXISTS `carrera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrera` (
  `idcarrera` varchar(3) NOT NULL,
  `carrera` varchar(50) NOT NULL,
  `iddepto` int NOT NULL,
  PRIMARY KEY (`idcarrera`),
  UNIQUE KEY `idcarrera_UNIQUE` (`idcarrera`),
  KEY `carr_dpto_idx` (`iddepto`),
  CONSTRAINT `carr_dpto` FOREIGN KEY (`iddepto`) REFERENCES `departamento` (`iddepto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrera`
--

LOCK TABLES `carrera` WRITE;
/*!40000 ALTER TABLE `carrera` DISABLE KEYS */;
INSERT INTO `carrera` VALUES ('ISC','INGENIERIA EN SISTEMAS COMPUTACIONALES',1);
/*!40000 ALTER TABLE `carrera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamento`
--

DROP TABLE IF EXISTS `departamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamento` (
  `iddepto` int NOT NULL AUTO_INCREMENT,
  `alias` varchar(30) NOT NULL,
  `departamento` varchar(45) NOT NULL,
  PRIMARY KEY (`iddepto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamento`
--

LOCK TABLES `departamento` WRITE;
/*!40000 ALTER TABLE `departamento` DISABLE KEYS */;
INSERT INTO `departamento` VALUES (1,'SISTEMAS','DEPARTAMENTO DE SISTEMAS Y COMPUTACIÓN'),(2,'QUIM Y BIO','DEPARTAMENTO DE QUIMICA Y BIOQUIMICA');
/*!40000 ALTER TABLE `departamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_grupo`
--

DROP TABLE IF EXISTS `detalle_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_grupo` (
  `grupo` varchar(15) NOT NULL,
  `idalumno` int NOT NULL,
  KEY `detalle_gr_al_idx` (`idalumno`),
  KEY `gpo_al_idx` (`grupo`),
  CONSTRAINT `al_gpo` FOREIGN KEY (`idalumno`) REFERENCES `alumno` (`nocontrol`),
  CONSTRAINT `gpo_al` FOREIGN KEY (`grupo`) REFERENCES `grupo` (`grupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_grupo`
--

LOCK TABLES `detalle_grupo` WRITE;
/*!40000 ALTER TABLE `detalle_grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispositivo`
--

DROP TABLE IF EXISTS `dispositivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dispositivo` (
  `noserie` varchar(45) NOT NULL,
  `nofolio` varchar(100) DEFAULT NULL,
  `marca` varchar(45) NOT NULL,
  `modelo` varchar(40) NOT NULL,
  `tipo` varchar(45) NOT NULL,
  `descripcion` varchar(120) NOT NULL,
  PRIMARY KEY (`noserie`),
  UNIQUE KEY `noserie_UNIQUE` (`noserie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispositivo`
--

LOCK TABLES `dispositivo` WRITE;
/*!40000 ALTER TABLE `dispositivo` DISABLE KEYS */;
INSERT INTO `dispositivo` VALUES ('951TTT','XD','SONY','123456789','PROYECTOR','COLOR NEGRO, SIN ENTRADA VGA'),('952AAT','DX','CISCO','QSXWDC','ROUTER','DOBLE ANTENA '),('953PLOK','IJ','TPLINK','EDRFTG56','SWITCH','24 PUERTOS');
/*!40000 ALTER TABLE `dispositivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docentes`
--

DROP TABLE IF EXISTS `docentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docentes` (
  `notarjeta` int NOT NULL,
  `nombre_pr` varchar(30) NOT NULL,
  `appat_pr` varchar(25) NOT NULL,
  `apmat_pr` varchar(25) NOT NULL,
  `iddepto` int NOT NULL,
  `user` varchar(20) NOT NULL,
  PRIMARY KEY (`notarjeta`),
  KEY `depto_docente_idx` (`iddepto`),
  KEY `user_docente_idx` (`user`),
  CONSTRAINT `depto_docente` FOREIGN KEY (`iddepto`) REFERENCES `departamento` (`iddepto`),
  CONSTRAINT `user_docente` FOREIGN KEY (`user`) REFERENCES `usuario` (`user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docentes`
--

LOCK TABLES `docentes` WRITE;
/*!40000 ALTER TABLE `docentes` DISABLE KEYS */;
/*!40000 ALTER TABLE `docentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupo`
--

DROP TABLE IF EXISTS `grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo` (
  `grupo` varchar(15) NOT NULL,
  `idmateria` varchar(7) NOT NULL,
  `notarjeta` int NOT NULL,
  `noalumnos` int NOT NULL,
  `horario` varchar(15) NOT NULL,
  PRIMARY KEY (`grupo`),
  KEY `grupo_mat_idx` (`idmateria`),
  CONSTRAINT `grupo_mat` FOREIGN KEY (`idmateria`) REFERENCES `materia` (`clavemateria`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo`
--

LOCK TABLES `grupo` WRITE;
/*!40000 ALTER TABLE `grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materia`
--

DROP TABLE IF EXISTS `materia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materia` (
  `clavemateria` varchar(7) NOT NULL,
  `nombremat` varchar(50) NOT NULL,
  `idcarrera` varchar(3) DEFAULT NULL,
  `reticula` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`clavemateria`),
  KEY `carrera_mat_idx` (`idcarrera`),
  CONSTRAINT `carrera_mat` FOREIGN KEY (`idcarrera`) REFERENCES `carrera` (`idcarrera`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materia`
--

LOCK TABLES `materia` WRITE;
/*!40000 ALTER TABLE `materia` DISABLE KEYS */;
INSERT INTO `materia` VALUES ('SCD1015','LENGUAJES Y AUTOMATAS I','ISC','ISIE-TSE-2019-01');
/*!40000 ALTER TABLE `materia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mobiliario`
--

DROP TABLE IF EXISTS `mobiliario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mobiliario` (
  `folioinv` varchar(40) NOT NULL,
  `material` varchar(40) NOT NULL,
  `modelo` varchar(20) NOT NULL,
  `idarea` varchar(10) NOT NULL,
  PRIMARY KEY (`folioinv`),
  KEY `area_mob_idx` (`idarea`),
  CONSTRAINT `area_mob` FOREIGN KEY (`idarea`) REFERENCES `area` (`idarea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mobiliario`
--

LOCK TABLES `mobiliario` WRITE;
/*!40000 ALTER TABLE `mobiliario` DISABLE KEYS */;
/*!40000 ALTER TABLE `mobiliario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pc`
--

DROP TABLE IF EXISTS `pc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pc` (
  `noserie` varchar(100) NOT NULL,
  `marca` varchar(45) NOT NULL,
  `tipo` varchar(45) NOT NULL,
  `noinventario` varchar(45) DEFAULT NULL,
  `monitor` varchar(45) DEFAULT NULL,
  `teclado` varchar(45) DEFAULT NULL,
  `mouse` varchar(45) DEFAULT NULL,
  `idarea` varchar(10) NOT NULL,
  PRIMARY KEY (`noserie`),
  KEY `monitor_key_idx` (`monitor`),
  KEY `mouse_key_idx` (`mouse`),
  KEY `teclado_key_idx` (`teclado`),
  KEY `area_pc_idx` (`idarea`),
  CONSTRAINT `area_pc` FOREIGN KEY (`idarea`) REFERENCES `area` (`idarea`),
  CONSTRAINT `monitor_key` FOREIGN KEY (`monitor`) REFERENCES `periferico` (`noserieper`),
  CONSTRAINT `mouse_key` FOREIGN KEY (`mouse`) REFERENCES `periferico` (`noserieper`),
  CONSTRAINT `teclado_key` FOREIGN KEY (`teclado`) REFERENCES `periferico` (`noserieper`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pc`
--

LOCK TABLES `pc` WRITE;
/*!40000 ALTER TABLE `pc` DISABLE KEYS */;
INSERT INTO `pc` VALUES ('12345678','ASUS','ALL IN ONE','QSWDEFRG','ASDF1234',NULL,NULL,'USUARIOS1');
/*!40000 ALTER TABLE `pc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pc_software`
--

DROP TABLE IF EXISTS `pc_software`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pc_software` (
  `noserie` varchar(100) NOT NULL,
  `id_software` int NOT NULL,
  KEY `soft_key_idx` (`id_software`),
  KEY `pc_key_idx` (`noserie`),
  CONSTRAINT `pc_key` FOREIGN KEY (`noserie`) REFERENCES `pc` (`noserie`),
  CONSTRAINT `soft_key` FOREIGN KEY (`id_software`) REFERENCES `software` (`idsoftware`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pc_software`
--

LOCK TABLES `pc_software` WRITE;
/*!40000 ALTER TABLE `pc_software` DISABLE KEYS */;
/*!40000 ALTER TABLE `pc_software` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `periferico`
--

DROP TABLE IF EXISTS `periferico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periferico` (
  `noserieper` varchar(100) NOT NULL,
  `marca` varchar(45) NOT NULL,
  `estado` varchar(45) NOT NULL,
  `tipo` varchar(45) NOT NULL,
  PRIMARY KEY (`noserieper`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periferico`
--

LOCK TABLES `periferico` WRITE;
/*!40000 ALTER TABLE `periferico` DISABLE KEYS */;
INSERT INTO `periferico` VALUES ('ASDF1234','LENOVO','EN USO','MOUSE'),('POIU0987','LENOVO','EN USO','TECLADO'),('YHBT0965','LENOVO','LIBRE','MONITOR');
/*!40000 ALTER TABLE `periferico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal`
--

DROP TABLE IF EXISTS `personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal` (
  `notarjetap` int NOT NULL,
  `nombre_per` varchar(30) NOT NULL,
  `appat_per` varchar(25) NOT NULL,
  `apmat_per` varchar(45) NOT NULL,
  `puesto` varchar(15) NOT NULL,
  `turno` varchar(20) NOT NULL,
  `user` varchar(20) NOT NULL,
  PRIMARY KEY (`notarjetap`),
  KEY `user_personal_idx` (`user`),
  CONSTRAINT `user_personal` FOREIGN KEY (`user`) REFERENCES `usuario` (`user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal`
--

LOCK TABLES `personal` WRITE;
/*!40000 ALTER TABLE `personal` DISABLE KEYS */;
INSERT INTO `personal` VALUES (111,'KEY','GLZ','LUIS','Encargado','Matutino','111');
/*!40000 ALTER TABLE `personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `practica`
--

DROP TABLE IF EXISTS `practica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `practica` (
  `foliopractica` int NOT NULL AUTO_INCREMENT,
  `nombre_practica` varchar(45) NOT NULL,
  `fecha` date NOT NULL,
  `duracionhr` int NOT NULL,
  `grupo` varchar(15) NOT NULL,
  `idarea` varchar(10) NOT NULL,
  `notarjetap` int NOT NULL,
  PRIMARY KEY (`foliopractica`),
  UNIQUE KEY `foliopractica_UNIQUE` (`foliopractica`),
  KEY `area_pract_idx` (`idarea`),
  KEY `grupo_pract_idx` (`grupo`),
  KEY `personal_pract_idx` (`notarjetap`),
  CONSTRAINT `area_pract` FOREIGN KEY (`idarea`) REFERENCES `area` (`idarea`),
  CONSTRAINT `grupo_pract` FOREIGN KEY (`grupo`) REFERENCES `grupo` (`grupo`),
  CONSTRAINT `personal_pract` FOREIGN KEY (`notarjetap`) REFERENCES `personal` (`notarjetap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `practica`
--

LOCK TABLES `practica` WRITE;
/*!40000 ALTER TABLE `practica` DISABLE KEYS */;
/*!40000 ALTER TABLE `practica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(100) NOT NULL,
  `data` varchar(500) DEFAULT NULL,
  `expires` varchar(45) NOT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('HWR509xf4WuFFlaktOwlRkMXRbwR0in1','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"111\"},\"flash\":{}}','1670459946'),('SRke7Ojy1onfjpcuMTBvc9Z1jScgv0vV','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":\"111\"},\"flash\":{}}','1670638545');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `software`
--

DROP TABLE IF EXISTS `software`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `software` (
  `idsoftware` int NOT NULL,
  `software` varchar(30) NOT NULL,
  `tipolicencia` varchar(15) NOT NULL,
  `licencia` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`idsoftware`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `software`
--

LOCK TABLES `software` WRITE;
/*!40000 ALTER TABLE `software` DISABLE KEYS */;
/*!40000 ALTER TABLE `software` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `user` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `sesion` varchar(10) DEFAULT NULL,
  `rol` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('111','$2a$10$ybRT7UUH9PPLCv11LYPxDOFUKlFIPHUVG4fWribKM2f5fswLtmcRu',NULL,'Auxiliar'),('17160000','\'$2a$10$wVTRxnIW1JHhfIu5tIrIV.SGXbunHU/uWtsDyC0jpPFyTkStoquGK\'',NULL,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-08 20:20:31
