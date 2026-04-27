import pool from "../connection/connection.js";
import bcrypt from "bcrypt";

export const getEmpleados = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuario_filtrado');
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
        const { usuario, contrasena, id_persona, id_rol } = req.body;

        if (!usuario || !contrasena || !id_persona || !id_rol) {
            return res.status(400).json({ message: 'Debe ingresar un usuario, contraseña, id_persona y id_rol' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(contrasena, salt);

        const result = await pool.query('INSERT INTO empleado (usuario, contrasena, id_persona, id_rol) VALUES ($1, $2, $3, $4) RETURNING *', [usuario, hash, id_persona, id_rol]);
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
        const { id } = req.params;
        const { usuario, contrasena, id_persona, id_rol } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }
        if (!usuario || !contrasena || !id_persona || !id_rol) {
            return res.status(400).json({ message: 'Debe ingresar un usuario, contraseña, id_persona y id_rol' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(contrasena, salt);

        const result = await pool.query('UPDATE empleado SET usuario = $1, contrasena = $2, id_persona = $3, id_rol = $4 WHERE id_empleado = $5 RETURNING *', [usuario, hash, id_persona, id_rol, id]);
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
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Debe ingresar un id' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const empleado = await client.query(
            'SELECT id_empleado FROM empleado WHERE id_empleado = $1',
            [id]
        );

        if (empleado.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el empleado' });
        }

        const id_empleado = empleado.rows[0].id_empleado;

        const empleadoEliminado = await client.query(`
            SELECT id_empleado FROM empleado
            WHERE id_persona = (
                SELECT id_persona FROM persona WHERE nombre = 'Empleado Eliminado'
            )
        `);

        if (empleadoEliminado.rows[0].id_empleado === id) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No se puede eliminar el empleado eliminado' });
        }

        await client.query(
            'UPDATE transaccion SET id_encargado = $1 WHERE id_encargado = $2',
            [empleadoEliminado.rows[0].id_empleado, id_empleado]
        );

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
        const { usuario, contrasena } = req.body;

        if (!usuario || !contrasena) {
            return res.status(400).json({ message: 'Debe ingresar un usuario y una contraseña' });
        }

        const result = await pool.query('SELECT * FROM empleado WHERE usuario = $1', [usuario]);
        if (result.rows.length === 0 || !bcrypt.compareSync(contrasena, result.rows[0].contrasena)) {
            return res.status(404).json({ message: 'Credenciales incorrectas' });
        }

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