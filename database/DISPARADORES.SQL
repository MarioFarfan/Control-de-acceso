set search_path to laboratorio;
CREATE FUNCTION monitor_ocupado() RETURNS TRIGGER AS $$
BEGIN
	IF NEW.MONITOR IS NOT NULL THEN 
	BEGIN
		 UPDATE LABORATORIO.INSUMOS SET estado = 'OCUPADO'  WHERE NOSERIE = NEW.MONITOR;
	END; 
	END IF;
	return new;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER MONITORESTADO AFTER INSERT ON PC FOR EACH ROW EXECUTE PROCEDURE monitor_ocupado();

CREATE FUNCTION mouse_ocupado() RETURNS TRIGGER AS $$
BEGIN
	IF NEW.MOUSE IS NOT NULL THEN 
	BEGIN
		 UPDATE LABORATORIO.INSUMOS SET estado = 'OCUPADO'  WHERE NOSERIE = NEW.MOUSE;
	END; 
	END IF;
	return new;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER MOUSEESTADO AFTER INSERT ON PC FOR EACH ROW EXECUTE PROCEDURE mouse_ocupado();

CREATE FUNCTION teclado_ocupado() RETURNS TRIGGER AS $$
BEGIN
	IF NEW.TECLADO IS NOT NULL THEN 
	BEGIN
		 UPDATE LABORATORIO.INSUMOS SET estado = 'OCUPADO' WHERE NOSERIE = NEW.TECLADO;
	END; 
	END IF;
	return new;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TECLADOESTADO AFTER INSERT ON PC FOR EACH ROW EXECUTE PROCEDURE teclado_ocupado();