import CarritoItem from "../CartElement/CartElement";

const Carrito = ({ items, editable = false, dispatch }) => {

    const total = items.reduce(
        (acc, item) => acc + item.cantidad * (item.precio_unitario || item.precio_venta || item.precio_compra),
        0
    );

    return (
        <div>
            <table border={1} width="100%">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        {editable && <th>Acciones</th>}
                    </tr>
                </thead>

                <tbody>
                    {items.map((item: any) => (
                        <CarritoItem
                            key={item.id_producto}
                            item={item}
                            editable={editable}
                            dispatch={dispatch}
                        />
                    ))}
                </tbody>
            </table>

            <h3>Total: {total.toFixed(2)}</h3>
        </div>
    );
};

export default Carrito;