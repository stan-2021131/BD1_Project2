import { createContext, useReducer } from "react";
import type { ReactNode } from "react";

const createCarrito = () => {
    const Context = createContext<any>(null);

    const reducer = (state: any[], action: any) => {
        switch (action.type) {
            case "AGREGAR":{
                const existing = state.find(i => i.id_producto === action.payload.id_producto);
                if (existing) {
                    const nuevaCantidad = existing.cantidad + action.payload.cantidad;
                    if (nuevaCantidad <= 0) {
                        return state.filter(i => i.id_producto !== action.payload.id_producto);
                    }
                    return state.map(i =>
                        i.id_producto === action.payload.id_producto
                            ? { ...i, cantidad: i.cantidad + action.payload.cantidad }
                            : i
                    );
                }
                return [...state, action.payload];
            }
            case "ELIMINAR": {
                return state.filter(i => i.id_producto !== action.payload);
            }
            case "LIMPIAR": {
                return [];
            }

            default:
                return state;
        }
    };

    const Provider = ({ children }: { children: ReactNode }) => {
        const [state, dispatch] = useReducer(reducer, []);

        return (
            <Context.Provider value={{ state, dispatch }}>
                {children}
            </Context.Provider>
        );
    };

    return [Context, Provider] as const;
};

export const [CarritoComprasContext, CarritoComprasProvider] = createCarrito();
export const [CarritoVentasContext, CarritoVentasProvider] = createCarrito();