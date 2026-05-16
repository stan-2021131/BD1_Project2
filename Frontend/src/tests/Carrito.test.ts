import { describe, it, expect } from "vitest";
// ─── Tipo mínimo para un producto del carrito ───────────────────────────────
type ProductoCarrito = {
    id_producto: number;
    nombre: string;
    cantidad: number;
};

// ─── Copia de reducer de CarritoContext  ─────────────────────
const reducer = (state: ProductoCarrito[], action: { type: string; payload?: any }) => {
    switch (action.type) {
        case "AGREGAR": {
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
        case "ELIMINAR":
            return state.filter(i => i.id_producto !== action.payload);
        case "LIMPIAR":
            return [];
        default:
            return state;
    }
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Carrito - reducer", () => {
    const productoA: ProductoCarrito = { id_producto: 1, nombre: "Producto A", cantidad: 2 };
    const productoB: ProductoCarrito = { id_producto: 2, nombre: "Producto B", cantidad: 1 };

    // --- AGREGAR ---

    it("agrega un producto nuevo al carrito vacío", () => {
        const resultado = reducer([], { type: "AGREGAR", payload: productoA });
        expect(resultado).toHaveLength(1);
        expect(resultado[0]).toEqual(productoA);
    });

    it("aumenta la cantidad si el producto ya existe en el carrito", () => {
        const estado = [productoA]; // cantidad: 2
        const resultado = reducer(estado, {
            type: "AGREGAR",
            payload: { id_producto: 1, nombre: "Producto A", cantidad: 3 },
        });
        expect(resultado).toHaveLength(1);
        expect(resultado[0].cantidad).toBe(5); // 2 + 3
    });

    it("elimina el producto si la cantidad resultante es 0 o menor", () => {
        const estado = [productoA]; // cantidad: 2
        const resultado = reducer(estado, {
            type: "AGREGAR",
            payload: { id_producto: 1, nombre: "Producto A", cantidad: -2 },
        });
        expect(resultado).toHaveLength(0);
    });

    // --- ELIMINAR ---

    it("elimina un producto del carrito por id_producto", () => {
        const estado = [productoA, productoB];
        const resultado = reducer(estado, { type: "ELIMINAR", payload: productoA.id_producto });
        expect(resultado).toHaveLength(1);
        expect(resultado[0].id_producto).toBe(productoB.id_producto);
    });

    it("no modifica el carrito si el id_producto a eliminar no existe", () => {
        const estado = [productoA];
        const resultado = reducer(estado, { type: "ELIMINAR", payload: 999 });
        expect(resultado).toHaveLength(1);
    });

    // --- LIMPIAR ---

    it("vacía el carrito con la acción LIMPIAR", () => {
        const estado = [productoA, productoB];
        const resultado = reducer(estado, { type: "LIMPIAR" });
        expect(resultado).toHaveLength(0);
    });
});