const CarritoItem = ({ item, editable, dispatch }) => {
    const precio = item.precio_unitario || item.precio_venta;
    const subtotal = item.cantidad * precio;

    const aumentar = () => {
        dispatch({
            type: "AGREGAR",
            payload: { ...item, cantidad: 1 }
        });
    };

    const disminuir = () => {
        if (item.cantidad <= 1) return;
        dispatch({
            type: "AGREGAR",
            payload: { ...item, cantidad: -1 }
        });
    };

    const eliminar = () => {
        dispatch({
            type: "ELIMINAR",
            payload: item.id_producto
        });
    };

    return (
        <tr>
            <td>{item.producto}</td>
            <td>{precio}</td>

            <td>
                {editable ? (
                    <>
                        <button onClick={disminuir}>-</button>
                        {item.cantidad}
                        <button onClick={aumentar}>+</button>
                    </>
                ) : (
                    item.cantidad
                )}
            </td>

            <td>{subtotal.toFixed(2)}</td>

            <td>
                {editable && (
                    <button onClick={eliminar}>Eliminar</button>
                )}
            </td>
        </tr>
    );
};

export default CarritoItem;