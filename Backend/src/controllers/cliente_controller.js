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
        await client.query('BEGIN');

        const cliente = await client.query(
            'SELECT id_cliente FROM cliente WHERE id_cliente = $1',
            [id]
        );

        if (cliente.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el cliente' });
        }

        const id_cliente = cliente.rows[0].id_cliente;

        const clienteEliminado = await client.query(`
            SELECT id_cliente FROM cliente
            WHERE id_persona = (
                SELECT id_persona FROM persona WHERE nombre = 'Cliente Eliminado'
            )
        `);

        await client.query(
            'UPDATE venta SET id_cliente = $1 WHERE id_cliente = $2',
            [clienteEliminado.rows[0].id_cliente, id_cliente]
        );

        const result = await client.query(
            'DELETE FROM cliente WHERE id_cliente = $1 RETURNING *',
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
        res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
    finally {
        client.release();
    }
}