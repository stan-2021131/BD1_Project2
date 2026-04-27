import pool from "../connection/connection.js";

export const getPersonas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM persona');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron personas' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener a las personas' })
    }
}

export const createPersona = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: 'Debe ingresar un nombre' });
        }

        const result = await pool.query('INSERT INTO persona (nombre) VALUES ($1) RETURNING *', [nombre]);
        res.status(201).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear a la persona' });
    }
}

export const updatePersona = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }
        if (!nombre) {
            return res.status(400).json({ message: 'Debe ingresar un nombre' });
        }

        const result = await pool.query('UPDATE persona SET nombre = $1 WHERE id_persona = $2 RETURNING *', [nombre, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró a la persona' });
        }

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar a la persona' });
    }
}

export const deletePersona = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Debe ingresar un id' });
    }

    const client = await pool.connect();

    try {
        // Inicia la transacción
        await client.query('BEGIN');

        //Obtiene el id de la persona eliminada
        const empleadoEliminado = await client.query(`
            SELECT id_persona FROM persona
            WHERE nombre = 'Empleado Eliminado'
        `);

        //Obtiene el id de la persona eliminada
        const clienteEliminado = await client.query(`
            SELECT id_persona FROM persona
            WHERE nombre = 'Cliente Eliminado'
        `);

        //Verifica que la persona no sea la persona eliminada
        if (empleadoEliminado.rows[0].id_persona === id || clienteEliminado.rows[0].id_persona === id) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No se puede eliminar la persona eliminada' });
        }

        //Obtiene el id del cliente
        const cliente = await client.query(
            'SELECT id_cliente FROM cliente WHERE id_persona = $1',
            [id]
        );

        //Verifica que el cliente exista
        if (cliente.rows.length > 0) {
            const id_cliente = cliente.rows[0].id_cliente;

            //Obtiene el id del cliente eliminado
            const clienteEliminado = await client.query(`
                SELECT id_cliente FROM cliente
                WHERE id_persona = (
                    SELECT id_persona FROM persona WHERE nombre = 'Cliente Eliminado'
                )
            `);

            //Actualiza el id_cliente de las ventas del cliente a eliminar
            await client.query(
                'UPDATE venta SET id_cliente = $1 WHERE id_cliente = $2',
                [clienteEliminado.rows[0].id_cliente, id_cliente]
            );

            //Elimina el cliente
            await client.query(
                'DELETE FROM cliente WHERE id_persona = $1',
                [id]
            );
        }

        //Obtiene el id del empleado
        const empleado = await client.query(
            'SELECT id_empleado FROM empleado WHERE id_persona = $1',
            [id]
        );

        //Verifica que el empleado exista
        if (empleado.rows.length > 0) {
            const id_empleado = empleado.rows[0].id_empleado;

            //Obtiene el id del empleado eliminado
            const empleadoEliminado = await client.query(`
                SELECT id_empleado FROM empleado
                WHERE id_persona = (
                    SELECT id_persona FROM persona WHERE nombre = 'Empleado Eliminado'
                )
            `);

            //Actualiza el id_encargado de las transacciones del empleado a eliminar
            await client.query(
                'UPDATE transaccion SET id_encargado = $1 WHERE id_encargado = $2',
                [empleadoEliminado.rows[0].id_empleado, id_empleado]
            );

            //Elimina el empleado
            await client.query(
                'DELETE FROM empleado WHERE id_persona = $1',
                [id]
            );
        }

        //Elimina la persona
        const result = await client.query(
            'DELETE FROM persona WHERE id_persona = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró la persona' });
        }

        //Confirma la transacción
        await client.query('COMMIT');

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });

    } catch (error) {
        //Revierte la transacción si hay un error
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar a la persona' });
    } finally {
        //Libera la conexión
        client.release();
    }
};