import pool from "../connection/connection.js";

export const getCategorias = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categoria');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron categorías' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
}

export const createCategoria = async (req, res) => {
    try {
        const { categoria } = req.body;

        if (!categoria) {
            return res.status(400).json({ message: 'Debe ingresar una categoría' });
        }

        const result = await pool.query('INSERT INTO categoria (categoria) VALUES ($1) RETURNING *', [categoria]);
        res.status(201).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la categoría' });
    }
}

export const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }
        if (!categoria) {
            return res.status(400).json({ message: 'Debe ingresar una categoría' });
        }

        const result = await pool.query('UPDATE categoria SET categoria = $1 WHERE id_categoria = $2 RETURNING *', [categoria, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró la categoría' });
        }

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la categoría' });
    }
}

export const deleteCategoria = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Debe ingresar un id' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const categoriaOtros = await client.query(
            "SELECT id_categoria FROM categoria WHERE categoria = 'Otros'"
        );

        if (categoriaOtros.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(500).json({ message: 'Categoría "Otros" no configurada' });
        }

        const idOtros = categoriaOtros.rows[0].id_categoria;

        if (Number(id) === Number(idOtros)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No se puede eliminar la categoría "Otros"' });
        }

        await client.query(
            'UPDATE producto SET id_categoria = $1 WHERE id_categoria = $2',
            [idOtros, id]
        );

        const result = await client.query(
            'DELETE FROM categoria WHERE id_categoria = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró la categoría' });
        }

        await client.query('COMMIT');

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la categoría' });
    } finally {
        client.release();
    }
};