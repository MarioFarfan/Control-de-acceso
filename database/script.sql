--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

-- Started on 2023-02-01 21:04:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16453)
-- Name: laboratorio; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA laboratorio;


ALTER SCHEMA laboratorio OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16454)
-- Name: area; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.area (
    idarea character varying(20) NOT NULL,
    nombre character varying(45) NOT NULL,
    capacidad integer NOT NULL
);


ALTER TABLE laboratorio.area OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16457)
-- Name: carrera; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.carrera (
    idcarrera integer NOT NULL,
    alias character varying(45) NOT NULL,
    nombre character varying(100) NOT NULL,
    departamento integer NOT NULL
);


ALTER TABLE laboratorio.carrera OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16460)
-- Name: departamento; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.departamento (
    iddepto integer NOT NULL,
    departamento character varying(50) NOT NULL
);


ALTER TABLE laboratorio.departamento OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16463)
-- Name: detalle_grupo; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.detalle_grupo (
    nocontrol character varying(10) NOT NULL,
    idgrupo integer NOT NULL
);


ALTER TABLE laboratorio.detalle_grupo OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16466)
-- Name: dispositivo; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.dispositivo (
    noserie character varying(50) NOT NULL,
    nombre character varying(45) NOT NULL,
    marca character varying(45) NOT NULL,
    tipo character varying(45) NOT NULL,
    descripcion character varying(45) NOT NULL,
    noinv character varying(45) DEFAULT NULL::character varying
);


ALTER TABLE laboratorio.dispositivo OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16470)
-- Name: estudiante; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.estudiante (
    nocontrol character varying(10) NOT NULL,
    nombre character varying(45) NOT NULL,
    apellidop character varying(45) NOT NULL,
    apellidom character varying(45) NOT NULL,
    idcarrera integer NOT NULL,
    semestre integer NOT NULL,
    status character varying(45) NOT NULL
);


ALTER TABLE laboratorio.estudiante OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16473)
-- Name: grupo; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.grupo (
    idgrupo integer NOT NULL,
    grupo character varying(5) NOT NULL,
    clave character varying(12) NOT NULL,
    notarjeta integer NOT NULL,
    horario character varying(45) NOT NULL,
    noalumnos integer NOT NULL
);


ALTER TABLE laboratorio.grupo OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16476)
-- Name: insumos; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.insumos (
    noserie character varying(45) NOT NULL,
    noinv character varying(45) DEFAULT NULL::character varying,
    tipo character varying(45) NOT NULL
);


ALTER TABLE laboratorio.insumos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16480)
-- Name: materia; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.materia (
    clave character varying(12) NOT NULL,
    nombre character varying(100) NOT NULL,
    idcarrera integer NOT NULL
);


ALTER TABLE laboratorio.materia OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16483)
-- Name: mobiliario; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.mobiliario (
    idmobiliario integer NOT NULL,
    noinv character varying(45) DEFAULT NULL::character varying,
    tipo character varying(45) NOT NULL,
    descripcion character varying(45) NOT NULL,
    idarea character varying(12) NOT NULL
);


ALTER TABLE laboratorio.mobiliario OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16487)
-- Name: pc; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.pc (
    noserie character varying(50) NOT NULL,
    noinv character varying(50) DEFAULT NULL::character varying,
    marca character varying(45) NOT NULL,
    tipo character varying(15) NOT NULL,
    monitor character varying(45) NOT NULL,
    teclado character varying(45) NOT NULL,
    mouse character varying(45) NOT NULL,
    idarea character varying(45) NOT NULL
);


ALTER TABLE laboratorio.pc OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16491)
-- Name: pc_soft; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.pc_soft (
    noserie character varying(45) NOT NULL,
    idsoftware integer NOT NULL
);


ALTER TABLE laboratorio.pc_soft OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16494)
-- Name: personal; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.personal (
    notarjeta integer NOT NULL,
    nombre character varying(45) NOT NULL,
    apellidop character varying(45) NOT NULL,
    apellidom character varying(45) NOT NULL,
    iddepto integer NOT NULL,
    tipo character varying(45) NOT NULL
);


ALTER TABLE laboratorio.personal OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16497)
-- Name: practica; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.practica (
    folio integer NOT NULL,
    nombre character varying(120) NOT NULL,
    idgrupo integer NOT NULL,
    fecha date NOT NULL,
    horainicio time without time zone NOT NULL,
    duracion time without time zone,
    idarea character varying(20) NOT NULL,
    id_software integer
);


ALTER TABLE laboratorio.practica OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16500)
-- Name: practica_folio_seq; Type: SEQUENCE; Schema: laboratorio; Owner: postgres
--

CREATE SEQUENCE laboratorio.practica_folio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE laboratorio.practica_folio_seq OWNER TO postgres;

--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 228
-- Name: practica_folio_seq; Type: SEQUENCE OWNED BY; Schema: laboratorio; Owner: postgres
--

ALTER SEQUENCE laboratorio.practica_folio_seq OWNED BY laboratorio.practica.folio;


--
-- TOC entry 231 (class 1259 OID 16642)
-- Name: semestre; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.semestre (
    idsemestre integer NOT NULL,
    periodo character varying NOT NULL,
    fechainicio date NOT NULL,
    fechafinal date NOT NULL
);


ALTER TABLE laboratorio.semestre OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16641)
-- Name: semestre_idsemestre_seq; Type: SEQUENCE; Schema: laboratorio; Owner: postgres
--

CREATE SEQUENCE laboratorio.semestre_idsemestre_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE laboratorio.semestre_idsemestre_seq OWNER TO postgres;

--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 230
-- Name: semestre_idsemestre_seq; Type: SEQUENCE OWNED BY; Schema: laboratorio; Owner: postgres
--

ALTER SEQUENCE laboratorio.semestre_idsemestre_seq OWNED BY laboratorio.semestre.idsemestre;


--
-- TOC entry 229 (class 1259 OID 16501)
-- Name: software; Type: TABLE; Schema: laboratorio; Owner: postgres
--

CREATE TABLE laboratorio.software (
    id_software integer NOT NULL,
    software character varying(45) NOT NULL,
    tipolicencia character varying(45) NOT NULL,
    licencia character varying(100) DEFAULT NULL::character varying
);


ALTER TABLE laboratorio.software OWNER TO postgres;

--
-- TOC entry 3238 (class 2604 OID 16505)
-- Name: practica folio; Type: DEFAULT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.practica ALTER COLUMN folio SET DEFAULT nextval('laboratorio.practica_folio_seq'::regclass);


--
-- TOC entry 3240 (class 2604 OID 16645)
-- Name: semestre idsemestre; Type: DEFAULT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.semestre ALTER COLUMN idsemestre SET DEFAULT nextval('laboratorio.semestre_idsemestre_seq'::regclass);


--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 228
-- Name: practica_folio_seq; Type: SEQUENCE SET; Schema: laboratorio; Owner: postgres
--

SELECT pg_catalog.setval('laboratorio.practica_folio_seq', 1, false);


--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 230
-- Name: semestre_idsemestre_seq; Type: SEQUENCE SET; Schema: laboratorio; Owner: postgres
--

SELECT pg_catalog.setval('laboratorio.semestre_idsemestre_seq', 1, true);


--
-- TOC entry 3242 (class 2606 OID 16507)
-- Name: area area_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.area
    ADD CONSTRAINT area_pkey PRIMARY KEY (idarea);


--
-- TOC entry 3244 (class 2606 OID 16509)
-- Name: carrera carrera_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.carrera
    ADD CONSTRAINT carrera_pkey PRIMARY KEY (idcarrera);


--
-- TOC entry 3246 (class 2606 OID 16511)
-- Name: departamento departamento_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.departamento
    ADD CONSTRAINT departamento_pkey PRIMARY KEY (iddepto);


--
-- TOC entry 3248 (class 2606 OID 16513)
-- Name: dispositivo dispositivo_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.dispositivo
    ADD CONSTRAINT dispositivo_pkey PRIMARY KEY (noserie);


--
-- TOC entry 3250 (class 2606 OID 16515)
-- Name: estudiante estudiante_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.estudiante
    ADD CONSTRAINT estudiante_pkey PRIMARY KEY (nocontrol);


--
-- TOC entry 3252 (class 2606 OID 16517)
-- Name: grupo grupo_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.grupo
    ADD CONSTRAINT grupo_pkey PRIMARY KEY (idgrupo);


--
-- TOC entry 3254 (class 2606 OID 16519)
-- Name: insumos insumos_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.insumos
    ADD CONSTRAINT insumos_pkey PRIMARY KEY (noserie);


--
-- TOC entry 3256 (class 2606 OID 16521)
-- Name: materia materia_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.materia
    ADD CONSTRAINT materia_pkey PRIMARY KEY (clave);


--
-- TOC entry 3258 (class 2606 OID 16523)
-- Name: mobiliario mobiliario_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.mobiliario
    ADD CONSTRAINT mobiliario_pkey PRIMARY KEY (idmobiliario);


--
-- TOC entry 3262 (class 2606 OID 16525)
-- Name: personal personal_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.personal
    ADD CONSTRAINT personal_pkey PRIMARY KEY (notarjeta);


--
-- TOC entry 3260 (class 2606 OID 16527)
-- Name: pc pk_pc; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.pc
    ADD CONSTRAINT pk_pc PRIMARY KEY (noserie);


--
-- TOC entry 3264 (class 2606 OID 16529)
-- Name: practica practica_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.practica
    ADD CONSTRAINT practica_pkey PRIMARY KEY (folio);


--
-- TOC entry 3268 (class 2606 OID 16649)
-- Name: semestre semestre_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.semestre
    ADD CONSTRAINT semestre_pkey PRIMARY KEY (idsemestre);


--
-- TOC entry 3266 (class 2606 OID 16531)
-- Name: software software_pkey; Type: CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.software
    ADD CONSTRAINT software_pkey PRIMARY KEY (id_software);


--
-- TOC entry 3270 (class 2606 OID 16532)
-- Name: detalle_grupo alumnos; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.detalle_grupo
    ADD CONSTRAINT alumnos FOREIGN KEY (nocontrol) REFERENCES laboratorio.estudiante(nocontrol);


--
-- TOC entry 3282 (class 2606 OID 16537)
-- Name: practica area_id; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.practica
    ADD CONSTRAINT area_id FOREIGN KEY (idarea) REFERENCES laboratorio.area(idarea);


--
-- TOC entry 3272 (class 2606 OID 16542)
-- Name: grupo clave_mat; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.grupo
    ADD CONSTRAINT clave_mat FOREIGN KEY (clave) REFERENCES laboratorio.materia(clave) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3273 (class 2606 OID 16547)
-- Name: grupo docente_id; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.grupo
    ADD CONSTRAINT docente_id FOREIGN KEY (notarjeta) REFERENCES laboratorio.personal(notarjeta);


--
-- TOC entry 3271 (class 2606 OID 16552)
-- Name: detalle_grupo grupo; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.detalle_grupo
    ADD CONSTRAINT grupo FOREIGN KEY (idgrupo) REFERENCES laboratorio.grupo(idgrupo);


--
-- TOC entry 3269 (class 2606 OID 16621)
-- Name: carrera id_depto; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.carrera
    ADD CONSTRAINT id_depto FOREIGN KEY (departamento) REFERENCES laboratorio.departamento(iddepto) NOT VALID;


--
-- TOC entry 3283 (class 2606 OID 16557)
-- Name: practica id_grupo; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.practica
    ADD CONSTRAINT id_grupo FOREIGN KEY (idgrupo) REFERENCES laboratorio.grupo(idgrupo);


--
-- TOC entry 3284 (class 2606 OID 16562)
-- Name: practica id_software; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.practica
    ADD CONSTRAINT id_software FOREIGN KEY (id_software) REFERENCES laboratorio.software(id_software);


--
-- TOC entry 3275 (class 2606 OID 16567)
-- Name: mobiliario idarea; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.mobiliario
    ADD CONSTRAINT idarea FOREIGN KEY (idarea) REFERENCES laboratorio.area(idarea);


--
-- TOC entry 3276 (class 2606 OID 16572)
-- Name: pc idarea; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.pc
    ADD CONSTRAINT idarea FOREIGN KEY (idarea) REFERENCES laboratorio.area(idarea);


--
-- TOC entry 3274 (class 2606 OID 16577)
-- Name: materia idcarrera; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.materia
    ADD CONSTRAINT idcarrera FOREIGN KEY (idcarrera) REFERENCES laboratorio.carrera(idcarrera) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3281 (class 2606 OID 16582)
-- Name: personal iddepto; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.personal
    ADD CONSTRAINT iddepto FOREIGN KEY (iddepto) REFERENCES laboratorio.departamento(iddepto);


--
-- TOC entry 3277 (class 2606 OID 16587)
-- Name: pc mouse; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.pc
    ADD CONSTRAINT mouse FOREIGN KEY (mouse) REFERENCES laboratorio.insumos(noserie);


--
-- TOC entry 3279 (class 2606 OID 16592)
-- Name: pc_soft pc; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.pc_soft
    ADD CONSTRAINT pc FOREIGN KEY (noserie) REFERENCES laboratorio.pc(noserie);


--
-- TOC entry 3280 (class 2606 OID 16597)
-- Name: pc_soft soft; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.pc_soft
    ADD CONSTRAINT soft FOREIGN KEY (idsoftware) REFERENCES laboratorio.software(id_software);


--
-- TOC entry 3278 (class 2606 OID 16602)
-- Name: pc teclado; Type: FK CONSTRAINT; Schema: laboratorio; Owner: postgres
--

ALTER TABLE ONLY laboratorio.pc
    ADD CONSTRAINT teclado FOREIGN KEY (teclado) REFERENCES laboratorio.insumos(noserie);


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA laboratorio; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA laboratorio TO admingeneral;
GRANT USAGE ON SCHEMA laboratorio TO encargado;
GRANT USAGE ON SCHEMA laboratorio TO auxiliar;
GRANT USAGE ON SCHEMA laboratorio TO docente;


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE area; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.area TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.area TO encargado;
GRANT SELECT ON TABLE laboratorio.area TO auxiliar;
GRANT SELECT ON TABLE laboratorio.area TO docente;


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE carrera; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.carrera TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.carrera TO encargado;
GRANT SELECT ON TABLE laboratorio.carrera TO auxiliar;
GRANT SELECT ON TABLE laboratorio.carrera TO docente;


--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE departamento; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.departamento TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.departamento TO encargado;
GRANT SELECT ON TABLE laboratorio.departamento TO auxiliar;
GRANT SELECT ON TABLE laboratorio.departamento TO docente;


--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE detalle_grupo; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.detalle_grupo TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.detalle_grupo TO encargado;
GRANT SELECT ON TABLE laboratorio.detalle_grupo TO auxiliar;


--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE dispositivo; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.dispositivo TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.dispositivo TO encargado;
GRANT SELECT ON TABLE laboratorio.dispositivo TO auxiliar;


--
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE estudiante; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.estudiante TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.estudiante TO encargado;
GRANT SELECT ON TABLE laboratorio.estudiante TO auxiliar;
GRANT SELECT ON TABLE laboratorio.estudiante TO docente;


--
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE grupo; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.grupo TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.grupo TO encargado;
GRANT SELECT ON TABLE laboratorio.grupo TO auxiliar;
GRANT SELECT ON TABLE laboratorio.grupo TO docente;


--
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE insumos; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.insumos TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.insumos TO encargado;
GRANT SELECT ON TABLE laboratorio.insumos TO auxiliar;


--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE materia; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.materia TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.materia TO encargado;
GRANT SELECT ON TABLE laboratorio.materia TO auxiliar;
GRANT SELECT ON TABLE laboratorio.materia TO docente;


--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE mobiliario; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.mobiliario TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.mobiliario TO encargado;
GRANT SELECT ON TABLE laboratorio.mobiliario TO auxiliar;


--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE pc; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.pc TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.pc TO encargado;
GRANT SELECT ON TABLE laboratorio.pc TO auxiliar;


--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE pc_soft; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.pc_soft TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.pc_soft TO encargado;
GRANT SELECT ON TABLE laboratorio.pc_soft TO auxiliar;


--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE personal; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.personal TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.personal TO encargado;
GRANT SELECT ON TABLE laboratorio.personal TO auxiliar;


--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE practica; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.practica TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.practica TO encargado;
GRANT SELECT,UPDATE ON TABLE laboratorio.practica TO auxiliar;
GRANT SELECT ON TABLE laboratorio.practica TO docente;


--
-- TOC entry 3467 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE software; Type: ACL; Schema: laboratorio; Owner: postgres
--

GRANT ALL ON TABLE laboratorio.software TO admingeneral;
GRANT SELECT,INSERT,UPDATE ON TABLE laboratorio.software TO encargado;
GRANT SELECT ON TABLE laboratorio.software TO auxiliar;
