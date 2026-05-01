import CarritoItem from "../CartElement/CartElement";
import "./style.css";

const Carrito = ({ items, editable = false, dispatch }) => {

    const total = items.reduce(
        (acc, item) =>
            acc + item.cantidad * (item.precio_unitario || item.precio_venta || item.precio_compra),
        0
    );

    return (
        <div className="cart-container">

            <div className="cart-list">
                {items.map((item: any) => (
                    <CarritoItem
                        key={item.id_producto}
                        item={item}
                        editable={editable}
                        dispatch={dispatch}
                    />
                ))}
            </div>

            <div className="cart-total">
                Total: Q {total.toFixed(2)}
            </div>
        </div>
    );
};

export default Carrito;