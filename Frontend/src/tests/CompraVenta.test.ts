import { vi, describe, it, expect, beforeEach } from "vitest";
// ─── Mock del módulo api ──────────────────────────────────────────────────────
// Remplazo de api.post con una función espía para inspección.
const mockPost = vi.fn();

vi.mock("../services/Api", () => ({
    api: {
        post: mockPost,
        get: vi.fn().mockResolvedValue({ data: [] }),
    },
}));

// ─── Helpers: simulan lo que hacen CompraForm y VentaForm al hacer submit ────

/**
 * Reproduce la llamada real que CompraForm hace en handleSubmit.
 */
async function submitCompra(api: any, payload: {
    encargado: number;
    forma_pago: number;
    proveedor: number;
    productos: { id_producto: number; cantidad: number }[];
}) {
    await api.post("compra_venta/compra", payload);
}

/**
 * Reproduce la llamada real que VentaForm hace en handleSubmit.
 */
async function submitVenta(api: any, payload: {
    encargado: number;
    forma_pago: number;
    cliente: number;
    productos: { id_producto: number; cantidad: number }[];
}) {
    await api.post("compra_venta/venta", payload);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("API de Compra", () => {
    beforeEach(() => {
        mockPost.mockReset();
        // Simulamos una respuesta exitosa del servidor
        mockPost.mockResolvedValue({ data: { id_compra: 1 } });
    });

    it("llama al endpoint correcto al registrar una compra", async () => {
        const { api } = await import("../services/Api");

        await submitCompra(api, {
            encargado: 10,
            forma_pago: 1,
            proveedor: 2,
            productos: [{ id_producto: 5, cantidad: 3 }],
        });

        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("compra_venta/compra", expect.objectContaining({
            encargado: 10,
            forma_pago: 1,
            proveedor: 2,
        }));
    });

    it("envía la lista de productos correctamente en la compra", async () => {
        const { api } = await import("../services/Api");

        const productos = [
            { id_producto: 1, cantidad: 2 },
            { id_producto: 3, cantidad: 5 },
        ];

        await submitCompra(api, { encargado: 10, forma_pago: 1, proveedor: 2, productos });

        const llamada = mockPost.mock.calls[0][1];
        expect(llamada.productos).toEqual(productos);
    });

    it("lanza un error si el servidor responde con fallo en compra", async () => {
        const { api } = await import("../services/Api");
        mockPost.mockRejectedValue(new Error("Error del servidor"));

        await expect(
            submitCompra(api, { encargado: 10, forma_pago: 1, proveedor: 2, productos: [] })
        ).rejects.toThrow("Error del servidor");
    });
});

describe("API de Venta", () => {
    beforeEach(() => {
        mockPost.mockReset();
        mockPost.mockResolvedValue({ data: { id_venta: 99 } });
    });

    it("llama al endpoint correcto al registrar una venta", async () => {
        const { api } = await import("../services/Api");

        await submitVenta(api, {
            encargado: 10,
            forma_pago: 2,
            cliente: 7,
            productos: [{ id_producto: 4, cantidad: 1 }],
        });

        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("compra_venta/venta", expect.objectContaining({
            encargado: 10,
            forma_pago: 2,
            cliente: 7,
        }));
    });

    it("envía la lista de productos correctamente en la venta", async () => {
        const { api } = await import("../services/Api");

        const productos = [{ id_producto: 8, cantidad: 10 }];

        await submitVenta(api, { encargado: 10, forma_pago: 2, cliente: 7, productos });

        const llamada = mockPost.mock.calls[0][1];
        expect(llamada.productos).toEqual(productos);
    });

    it("lanza un error si el servidor responde con fallo en venta", async () => {
        const { api } = await import("../services/Api");
        mockPost.mockRejectedValue(new Error("Stock insuficiente"));

        await expect(
            submitVenta(api, { encargado: 10, forma_pago: 2, cliente: 7, productos: [] })
        ).rejects.toThrow("Stock insuficiente");
    });
});