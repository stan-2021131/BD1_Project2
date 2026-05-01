import pool from "../connection/connection.js";
import bcrypt from "bcrypt";

export const getEmpleados = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuario_filtrado'); //Obtiene todos los empleados de la vista con información básica
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron empleados' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los empleados' });
    }
}

export const createEmpleado = async (req, res) => {
    try {
        const { usuario, contrasena, id_persona, id_rol } = req.body; //Obtiene los datos del empleado

        if (!usuario || !contrasena || !id_persona || !id_rol) { //Verifica que se hayan enviado los datos necesarios
            return res.status(400).json({ message: 'Debe ingresar un usuario, contraseña, id_persona y id_rol' });
        }

        const salt = bcrypt.genSaltSync(10); //Genera un salt para encriptar la contraseña
        const hash = bcrypt.hashSync(contrasena, salt); //Encripta la contraseña

        // Crea un nuevo usuario
        const result = await pool.query('INSERT INTO empleado (usuario, contrasena, id_persona, id_rol) VALUES ($1, $2, $3, $4) RETURNING *', [usuario, hash, id_persona, id_rol]); //Inserta el empleado
        res.status(201).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el empleado' });
    }
}

export const updateEmpleado = async (req, res) => {
    try {
        const { id } = req.params; //Obtiene el id del empleado
        const { usuario, contrasena, id_persona, id_rol } = req.body; //Obtiene los datos del empleado

        if (!id) { //Verifica que se haya enviado un id
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }
        if (!usuario || !id_persona || !id_rol) { //Verifica que se hayan enviado los datos necesarios
            return res.status(400).json({ message: 'Debe ingresar un usuario, id_persona y id_rol' });
        }

        let result;
        if (contrasena) {
            const salt = bcrypt.genSaltSync(10); //Genera un salt para encriptar la contraseña
            const hash = bcrypt.hashSync(contrasena, salt); //Encripta la contraseña
            result = await pool.query('UPDATE empleado SET usuario = $1, contrasena = $2, id_persona = $3, id_rol = $4 WHERE id_empleado = $5 RETURNING *', [usuario, hash, id_persona, id_rol, id]);
        } else {
            result = await pool.query('UPDATE empleado SET usuario = $1, id_persona = $2, id_rol = $3 WHERE id_empleado = $4 RETURNING *', [usuario, id_persona, id_rol, id]);
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró el empleado' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el empleado' });
    }
}

export const deleteEmpleado = async (req, res) => {
    const { id } = req.params; //Obtiene el id del empleado

    if (!id) { //Verifica que se haya enviado un id
        return res.status(400).json({ message: 'Debe ingresar un id' });
    }
    const client = await pool.connect(); //Inicia la transacción
    try {
        await client.query('BEGIN'); //Inicia la transacción

        //Verifica que el empleado exista
        const empleado = await client.query(
            'SELECT id_empleado FROM empleado WHERE id_empleado = $1',
            [id]
        );

        if (empleado.rows.length === 0) { //Verifica que el empleado exista
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el empleado' });
        }

        const id_empleado = empleado.rows[0].id_empleado; //Obtiene el id del empleado

        //Obtiene el id del empleado eliminado
        const empleadoEliminado = await client.query(`
            SELECT id_empleado FROM empleado
            WHERE id_persona = (
                SELECT id_persona FROM persona WHERE nombre = 'Empleado Eliminado'
            )
        `);

        //Verifica que el empleado no sea el empleado eliminado
        if (empleadoEliminado.rows[0].id_empleado === id) { //Verifica que el empleado no sea el empleado eliminado
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No se puede eliminar el empleado eliminado' });
        }

        //Actualiza el id_encargado de las transacciones del empleado a eliminar
        await client.query(
            'UPDATE transaccion SET id_encargado = $1 WHERE id_encargado = $2',
            [empleadoEliminado.rows[0].id_empleado, id_empleado]
        );

        //Elimina el empleado
        const result = await client.query(
            'DELETE FROM empleado WHERE id_empleado = $1 RETURNING *',
            [id]
        );

        await client.query('COMMIT');

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el empleado' });
    }
    finally {
        client.release();
    }
}

export const iniciarSesion = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body; //Obtiene los datos del empleado

        if (!usuario || !contrasena) { //Verifica que se hayan enviado los datos necesarios
            return res.status(400).json({ message: 'Debe ingresar un usuario y una contraseña' });
        }

        //Verifica que el empleado exista
        const result = await pool.query('SELECT * FROM empleado WHERE usuario = $1', [usuario]);
        if (result.rows.length === 0 || !bcrypt.compareSync(contrasena, result.rows[0].contrasena)) { //Verifica que el empleado exista
            return res.status(404).json({ message: 'Credenciales incorrectas' });
        }

        //Elimina la contraseña del resultado
        const { contrasena: _, ...userData } = result.rows[0];

        res.status(200).json({
            ok: true,
            data: userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
}