import "./style.css";

const CarritoItem = ({ item, editable, dispatch }) => {
    const precio = item.precio_unitario || item.precio_venta || item.precio_compra;
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
        <div className="cart-item">
            <div className="cart-item-info">
                <span className="cart-name">{item.producto}</span>
                <span className="cart-price">Q {precio}</span>
            </div>

            <div className="cart-item-actions">
                {editable ? (
                    <>
                        <button onClick={disminuir}>-</button>
                        <span>{item.cantidad}</span>
                        <button onClick={aumentar}>+</button>
                    </>
                ) : (
                    <span>{item.cantidad}</span>
                )}
            </div>

            <div className="cart-subtotal">
                Q {subtotal.toFixed(2)}
            </div>

            {editable && (
                <button className="cart-delete" onClick={eliminar}>
                    ✕
                </button>
            )}
        </div>
    );
};

export default CarritoItem;