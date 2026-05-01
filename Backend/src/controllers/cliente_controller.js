import pool from "../connection/connection.js";

export const getClientes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cliente INNER JOIN persona ON cliente.id_persona = persona.id_persona');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron clientes' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
}

export const createCliente = async (req, res) => {
    try {
        const { nit, id_persona } = req.body;

        if (!nit || !id_persona) {
            return res.status(400).json({ message: 'Debe ingresar un nit y un id_persona' });
        }

        const existePersona = await pool.query('SELECT * FROM persona WHERE id_persona = $1', [id_persona]);
        if (existePersona.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró la persona' });
        }

        if (nit != "c/f" && nit != "C/F" && nit != "") {
            const existeNit = await pool.query('SELECT * FROM cliente WHERE nit = $1', [nit]);
            if (existeNit.rows.length > 0) {
                return res.status(400).json({ message: 'El cliente con este NIT ya existe' });
            }
        }

        const existePersonaCliente = await pool.query('SELECT * FROM cliente WHERE id_persona = $1', [id_persona]);
        if (existePersonaCliente.rows.length > 0) {
            return res.status(400).json({ message: 'Esta persona ya es cliente' });
        }

        const result = await pool.query('INSERT INTO cliente (nit, id_persona) VALUES ($1, $2) RETURNING *', [nit, id_persona]);
        res.status(201).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el cliente' });
    }
}

export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nit } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }
        if (!nit) {
            return res.status(400).json({ message: 'Debe ingresar un nit' });
        }

        if (nit != "c/f" && nit != "C/F" && nit != "") {
            const existeNit = await pool.query('SELECT * FROM cliente WHERE nit = $1', [nit]);
            if (existeNit.rows.length > 0) {
                return res.status(400).json({ message: 'El cliente con este NIT ya existe' });
            }
        }

        //Actualiza el nit del cliente
        const result = await pool.query('UPDATE cliente SET nit = $1 WHERE id_cliente = $2 RETURNING *', [nit, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró el cliente' });
        }

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
}

export const deleteCliente = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Debe ingresar un id' });
    }
    const client = await pool.connect();
    try {
        //Inicia la transacción
        await client.query('BEGIN');

        //Verifica si el cliente existe
        const cliente = await client.query(
            'SELECT id_cliente FROM cliente WHERE id_cliente = $1',
            [id]
        );

        //Si no existe el cliente, se hace rollback y se retorna error
        if (cliente.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el cliente' });
        }

        const id_cliente = cliente.rows[0].id_cliente;

        //Obtiene el id del cliente eliminado
        const clienteEliminado = await client.query(`
            SELECT id_cliente FROM cliente
            WHERE id_persona = (
                SELECT id_persona FROM persona WHERE nombre = 'Cliente Eliminado'
            )
        `);

        //Si el cliente es el cliente eliminado, se hace rollback y se retorna error
        if (clienteEliminado.rows[0].id_cliente === id) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No se puede eliminar el cliente eliminado' });
        }

        //Actualiza el id_cliente de las ventas del cliente a eliminar
        await client.query(
            'UPDATE venta SET id_cliente = $1 WHERE id_cliente = $2',
            [clienteEliminado.rows[0].id_cliente, id_cliente]
        );

        //Elimina el cliente
        const result = await client.query(
            'DELETE FROM cliente WHERE id_cliente = $1 RETURNING *',
            [id]
        );

        //Confirma la transacción
        await client.query('COMMIT');

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });

    } catch (error) {
        //Si hay un error, se hace rollback
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
    finally {
        //Libera la conexión
        client.release();
    }
}