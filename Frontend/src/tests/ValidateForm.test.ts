import { describe, it, expect } from "vitest";

import {
    validateCompraForm,
    validateVentaForm,
} from "../utils/ValidateForms";

// ─── validateCompraForm ───────────────────────────────────────────────────────

describe("validateCompraForm", () => {
    const formValido = { forma_pago: 1, proveedor: 2 };
    const productosValidos = [{ id_producto: 1, cantidad: 3 }];

    it("no devuelve errores cuando el formulario es válido", () => {
        const errores = validateCompraForm(formValido, productosValidos);
        expect(Object.keys(errores)).toHaveLength(0);
    });

    it("devuelve error si no hay productos en el carrito", () => {
        const errores = validateCompraForm(formValido, []);
        expect(errores.productos).toBeDefined();
    });

    it("devuelve error si no se seleccionó proveedor (valor 0)", () => {
        const errores = validateCompraForm({ ...formValido, proveedor: 0 }, productosValidos);
        expect(errores.proveedor).toBeDefined();
    });

    it("devuelve error si no se seleccionó forma de pago (valor 0)", () => {
        const errores = validateCompraForm({ ...formValido, forma_pago: 0 }, productosValidos);
        expect(errores.forma_pago).toBeDefined();
    });

    it("devuelve múltiples errores cuando el formulario está completamente vacío", () => {
        const errores = validateCompraForm({ forma_pago: 0, proveedor: 0 }, []);
        expect(errores.forma_pago).toBeDefined();
        expect(errores.proveedor).toBeDefined();
        expect(errores.productos).toBeDefined();
    });
});

// ─── validateVentaForm ────────────────────────────────────────────────────────

describe("validateVentaForm", () => {
    const formValido = { forma_pago: 1, cliente: 3 };
    const productosValidos = [{ id_producto: 2, cantidad: 1 }];

    it("no devuelve errores cuando el formulario es válido", () => {
        const errores = validateVentaForm(formValido, productosValidos);
        expect(Object.keys(errores)).toHaveLength(0);
    });

    it("devuelve error si no hay productos en el carrito", () => {
        const errores = validateVentaForm(formValido, []);
        expect(errores.productos).toBeDefined();
    });

    it("devuelve error si no se seleccionó cliente (valor 0)", () => {
        const errores = validateVentaForm({ ...formValido, cliente: 0 }, productosValidos);
        expect(errores.cliente).toBeDefined();
    });

    it("devuelve error si no se seleccionó forma de pago (valor 0)", () => {
        const errores = validateVentaForm({ ...formValido, forma_pago: 0 }, productosValidos);
        expect(errores.forma_pago).toBeDefined();
    });

    it("devuelve múltiples errores cuando el formulario está completamente vacío", () => {
        const errores = validateVentaForm({ forma_pago: 0, cliente: 0 }, []);
        expect(errores.forma_pago).toBeDefined();
        expect(errores.cliente).toBeDefined();
        expect(errores.productos).toBeDefined();
    });
});