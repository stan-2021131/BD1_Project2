import pool from "../connection/connection.js";

export const getCompra = async (req, res) => {
    try {
        const { activo } = req.query;

        //Obtiene todas las compras de una vista dedicada a detalles esenciales de la compra
        let query = 'SELECT * FROM detalle_compra';
        let params = [];

        //Filtra por estado
        if (activo === 'true') {
            query += ' WHERE estado = $1';
            params.push('ACTIVO');
        } else if (activo === 'false') {
            query += ' WHERE estado = $1';
            params.push('INACTIVO');
        }

        //Obtiene las compras con los filtros aplicados
        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron compras' });
        }

        res.status(200).json({
            ok: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las compras' });
    }
};

export const getVenta = async (req, res) => {
    try {
        const { activo } = req.query;

        //Obtiene todas las ventas de una vista dedicada a detalles esenciales de la venta
        let query = 'SELECT * FROM detalle_venta';
        let params = [];

        //Filtra por estado
        if (activo === 'true') {
            query += ' WHERE estado = $1';
            params.push('ACTIVO');
        } else if (activo === 'false') {
            query += ' WHERE estado = $1';
            params.push('INACTIVO');
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ventas' });
        }

        res.status(200).json({
            ok: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las ventas' });
    }
};

export const detalleVenta = async (req, res) => {
    try {
        const id_transaccion = req.params.id;

        //Verifica que se haya enviado un id_transaccion
        if (!id_transaccion) {
            return res.status(400).json({ message: 'Debe ingresar un id_transaccion' });
        }

        //Verifica que la transacción exista de la vista de detalles de ventas
        const existe_transaccion = await pool.query('SELECT * FROM detalle_venta WHERE id_transaccion = $1', [id_transaccion]);
        if (existe_transaccion.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró la transacción' });
        }

        //Obtiene los productos de la transacción
        const productos = await pool.query(`
            SELECT p.id_producto, p.producto, dt.cantidad, dt.precio_unitario FROM detalle_transaccion dt
            INNER JOIN producto p ON dt.id_producto = p.id_producto
            WHERE dt.id_transaccion = $1
            `, [id_transaccion]);
        if (productos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }

        //Retorna la venta y los productos
        res.status(200).json({
            ok: true,
            data: {
                venta: existe_transaccion.rows[0],
                productos: productos.rows
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la venta' });
    }
}

export const detalleCompra = async (req, res) => {
    try {
        const id_transaccion = req.params.id;

        if (!id_transaccion) {
            return res.status(400).json({ message: 'Debe ingresar un id_transaccion' });
        }

        //Verifica que la transacción exista de la vista de detalles de compras
        const existe_transaccion = await pool.query('SELECT * FROM detalle_compra WHERE id_transaccion = $1', [id_transaccion]);
        if (existe_transaccion.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró la transacción' });
        }

        //Obtiene los productos de la transacción
        const productos = await pool.query(`
            SELECT p.id_producto, p.producto, dt.cantidad, dt.precio_unitario FROM detalle_transaccion dt
            INNER JOIN producto p ON dt.id_producto = p.id_producto
            WHERE dt.id_transaccion = $1
            `, [id_transaccion]);
        if (productos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }

        //Retorna la compra y los productos
        res.status(200).json({
            ok: true,
            data: {
                compra: existe_transaccion.rows[0],
                productos: productos.rows
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la compra' });
    }
}


export const crearCompra = async (req, res) => {
    //Obtiene los datos de la compra
    const id_encargado = Number(req.body.encargado);
    const id_forma_pago = Number(req.body.forma_pago);
    const id_proveedor = Number(req.body.proveedor);
    const productos = req.body.productos;

    //Verifica que se hayan enviado los datos necesarios
    if (isNaN(id_encargado) || isNaN(id_forma_pago) || isNaN(id_proveedor) || !productos || productos.length === 0) {
        return res.status(400).json({
            message: "Faltan parámetros",
            ejemplo: { //Ejemplo de cómo debe ser el body
                id_encargado: 1,
                id_forma_pago: 1,
                id_proveedor: 1,
                productos: [
                    { id_producto: 1, cantidad: 12 },
                    { id_producto: 2, cantidad: 21 }
                ]
            }
        })
    }

    //Inicia la transacción
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        //Verifica que el empleado exista
        const empleado = await client.query(
            'SELECT id_empleado FROM empleado WHERE id_empleado = $1',
            [id_encargado]
        );
        if (empleado.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el empleado' });
        }

        //Verifica que el proveedor exista
        const proveedor = await client.query(
            'SELECT id_proveedor FROM proveedor WHERE id_proveedor = $1',
            [id_proveedor]
        );
        if (proveedor.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el proveedor' });
        }

        //Verifica que la forma de pago exista
        const forma_pago = await client.query(
            'SELECT id_forma FROM forma_pago WHERE id_forma = $1',
            [id_forma_pago]
        );
        if (forma_pago.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró la forma de pago' });
        }

        //Crea la transacción
        const nueva_transaccion = await client.query(
            `INSERT INTO transaccion (fecha, id_encargado, id_forma_pago) VALUES (CURRENT_DATE, $1, $2) RETURNING id_transaccion`,
            [id_encargado, id_forma_pago]
        )

        //Asocia la transacción con el proveedor para crear una compra
        await client.query(
            `INSERT INTO compra (id_transaccion, id_proveedor) VALUES ($1, $2)`,
            [nueva_transaccion.rows[0].id_transaccion, id_proveedor]
        )

        //Agrega los productos a la transacción
        for (const producto of productos) {
            //Verifica que el producto exista y tenga un precio de compra
            const producto_existe = await client.query(
                'SELECT id_producto, precio_compra FROM producto WHERE id_producto = $1',
                [producto.id_producto]
            );
            //Si no existe el producto o no tiene un precio de compra o no se envio la cantidad, se hace rollback
            if (producto_existe.rows.length === 0 || !producto_existe.rows[0].precio_compra || !producto.cantidad) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'No se encontró el producto' });
            }

            //Agrega el producto a la transacción
            await client.query(
                `INSERT INTO detalle_transaccion (id_transaccion, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)`,
                [nueva_transaccion.rows[0].id_transaccion, producto.id_producto, producto.cantidad, producto_existe.rows[0].precio_compra]
            )

            //Actualiza el stock del producto
            await client.query(
                `UPDATE producto SET stock = stock + $1 WHERE id_producto = $2`, //Se suma el stock
                [producto.cantidad, producto.id_producto]
            )
        }

        //Confirma la transacción
        await client.query('COMMIT');
        res.status(200).json({ message: 'Compra creada exitosamente' });
    } catch (error) {
        //Si hay un error, se hace rollback
        if (client) await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: "Error al crear la compra" })
    }
    finally {
        //Libera la conexión
        client.release();
    }
}

export const crearVenta = async (req, res) => {
    //Obtiene los datos de la venta
    const id_encargado = Number(req.body.encargado);
    const id_forma_pago = Number(req.body.forma_pago);
    const id_cliente = Number(req.body.cliente);
    const productos = req.body.productos;

    //Verifica que se hayan enviado los datos necesarios
    if (isNaN(id_encargado) || isNaN(id_forma_pago) || isNaN(id_cliente) || !productos || productos.length === 0) {
        return res.status(400).json({
            message: "Faltan parámetros",
            ejemplo: {
                id_encargado: 1,
                id_forma_pago: 1,
                id_cliente: 1,
                productos: [
                    { id_producto: 1, cantidad: 12 },
                    { id_producto: 2, cantidad: 21 }
                ]
            }
        })
    }

    //Inicia la transacción
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        //Verifica que el empleado exista
        const empleado = await client.query(
            'SELECT id_empleado FROM empleado WHERE id_empleado = $1',
            [id_encargado]
        );
        if (empleado.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el empleado' });
        }

        //Verifica que el cliente exista
        const cliente = await client.query(
            'SELECT id_cliente FROM cliente WHERE id_cliente = $1',
            [id_cliente]
        );
        if (cliente.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el cliente' });
        }

        //Verifica que la forma de pago exista
        const forma_pago = await client.query(
            'SELECT id_forma FROM forma_pago WHERE id_forma = $1',
            [id_forma_pago]
        );
        if (forma_pago.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró la forma de pago' });
        }

        //Crea la transacción
        const nueva_transaccion = await client.query(
            `INSERT INTO transaccion (fecha, id_encargado, id_forma_pago) VALUES (CURRENT_DATE, $1, $2) RETURNING id_transaccion`,
            [id_encargado, id_forma_pago]
        )

        //Asocia la transacción con el cliente para crear una venta
        await client.query(
            `INSERT INTO venta (id_transaccion, id_cliente) VALUES ($1, $2)`,
            [nueva_transaccion.rows[0].id_transaccion, id_cliente]
        )

        //Agrega los productos a la transacción
        for (const producto of productos) {
            //Verifica que el producto exista y tenga un precio de venta
            const producto_existe = await client.query(
                'SELECT id_producto, precio_venta, stock FROM producto WHERE id_producto = $1',
                [producto.id_producto]
            );

            //Si no existe el producto o no tiene un precio de venta o no se envio la cantidad, se hace rollback
            if (producto_existe.rows.length === 0 || !producto_existe.rows[0].precio_venta || !producto.cantidad) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'No se encontró el producto' });
            }

            //Si no hay stock suficiente, se hace rollback
            if (producto_existe.rows[0].stock < producto.cantidad) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'No hay stock suficiente' });
            }

            //Agrega el producto a la transacción
            await client.query(
                `INSERT INTO detalle_transaccion (id_transaccion, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)`,
                [nueva_transaccion.rows[0].id_transaccion, producto.id_producto, producto.cantidad, producto_existe.rows[0].precio_venta]
            )

            //Actualiza el stock del producto
            const update = await client.query(
                `UPDATE producto 
                SET stock = stock - $1 -- Se resta el stock
                WHERE id_producto = $2 AND stock >= $1 -- Se verifica que haya stock suficiente
                RETURNING *`,
                [producto.cantidad, producto.id_producto]
            );

            //Si no se pudo actualizar el stock, se hace rollback
            if (update.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'No hay stock suficiente' });
            }
        }

        //Confirma la transacción
        await client.query('COMMIT');
        res.status(200).json({ message: 'Venta creada exitosamente' });
    } catch (error) {
        //Si hay un error, se hace rollback
        if (client) await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: "Error al crear la venta" })
    }
    finally {
        client.release();
    }
}

export const anularCompra = async (req, res) => {
    const id_transaccion = Number(req.params.id);
    const client = await pool.connect();
    try {
        //Inicia la transacción
        await client.query("BEGIN");

        //Verifica que la compra exista
        const compra = await client.query(
            'SELECT id_transaccion FROM compra WHERE id_transaccion = $1',
            [id_transaccion]
        );
        if (compra.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró la compra' });
        }

        //Actualiza el estado de la transacción a INACTIVO
        await client.query(
            `UPDATE transaccion SET estado = 'INACTIVO' WHERE id_transaccion = $1`,
            [id_transaccion]
        );

        //Confirma la transacción
        await client.query('COMMIT');
        res.status(200).json({ message: 'Compra anulada exitosamente' });
    } catch (error) {
        //Si hay un error, se hace rollback
        if (client) await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: "Error al anular la compra" })
    }
    finally {
        //Libera la conexión
        client.release();
    }
}

export const anularVenta = async (req, res) => {
    const id_transaccion = Number(req.params.id);
    const client = await pool.connect();
    try {
        //Inicia la transacción
        await client.query("BEGIN");

        //Verifica que la venta exista
        const venta = await client.query(
            'SELECT id_transaccion FROM venta WHERE id_transaccion = $1',
            [id_transaccion]
        );
        if (venta.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró la venta' });
        }

        //Actualiza el estado de la transacción a INACTIVO
        await client.query(
            `UPDATE transaccion SET estado = 'INACTIVO' WHERE id_transaccion = $1`,
            [id_transaccion]
        );

        //Confirma la transacción
        await client.query('COMMIT');
        res.status(200).json({ message: 'Venta anulada exitosamente' });
    } catch (error) {
        //Si hay un error, se hace rollback
        if (client) await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: "Error al anular la venta" })
    }
    finally {
        //Libera la conexión
        client.release();
    }
}