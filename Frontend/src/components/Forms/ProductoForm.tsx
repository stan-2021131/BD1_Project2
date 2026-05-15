import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import FormError from "../FormError/FormError";
import type { ProductoFormValues, ProductoFormErrors } from "../../utils/FormTypes";
import { validateProductoForm } from "../../utils/ValidateForms";
import "./style.css";

const ProductoForm = ({ selected, clear, refresh, onSuccess, onError, onClear }: any) => {
    const initialForm: ProductoFormValues = {
        producto: "",
        descripcion: "",
        stock: 0,
        precio_compra: 0,
        precio_venta: 0,
        id_categoria: 1,
    };

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<ProductoFormErrors>({});
    const [categorias, setCategorias] = useState([]);

    // cargar categorías
    useEffect(() => {
        const fetchCategorias = async () => {
            const res = await api.get("categoria");
            setCategorias(res.data);
        };
        fetchCategorias();
    }, []);

    // cargar producto seleccionado
    useEffect(() => {
        if (selected) {
            setForm({
                ...selected,
                id_categoria: Number(selected.id_categoria)
            });
        }
    }, [selected]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "id_categoria" ? Number(value) : value
        });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validateErrors = validateProductoForm(form);

        if (Object.keys(validateErrors).length > 0) {
            setErrors(validateErrors);
            return;
        }

        setErrors({});
        onClear();

        if (selected) {
            try {
                await api.put(`producto/${selected.id_producto}`, form);
                onSuccess("Producto actualizado");
            } catch (error: any) {
                console.error(error);
                const message = error.message || "Error desconocido"
                onError(`Error al actualizar el producto: ${message}`);
            }
        } else {
            try {
                await api.post("producto", form);
                onSuccess("Producto creado");
            } catch (error: any) {
                console.error(error);
                const message = error.message || "Error desconocido"
                onError(`Error al crear el producto: ${message}`);
            }
        }
        clear();
        refresh();
    };

    return (
        <div className="form-container">
            <h3 className="form-title">{selected ? "Editar" : "Crear"} Producto</h3>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className={`form-input ${errors.producto ? "form-input-error" : ""}`} name="producto" placeholder="Nombre" value={form.producto} onChange={handleChange} />
                    <FormError message={errors.producto} />
                </div>
                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <input className={`form-input ${errors.descripcion ? "form-input-error" : ""}`} name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
                    <FormError message={errors.descripcion} />
                </div>
                <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input className={`form-input ${errors.stock ? "form-input-error" : ""}`} name="stock" type="number" value={form.stock} onChange={handleChange} />
                    <FormError message={errors.stock} />
                </div>
                <div className="form-group">
                    <label className="form-label">Precio compra</label>
                    <input className={`form-input ${errors.precio_compra ? "form-input-error" : ""}`} name="precio_compra" type="number" step="0.01" value={form.precio_compra} onChange={handleChange} />
                    <FormError message={errors.precio_compra} />
                </div>
                <div className="form-group">
                    <label className="form-label">Precio venta</label>
                    <input className={`form-input ${errors.precio_venta ? "form-input-error" : ""}`} name="precio_venta" type="number" step="0.01" value={form.precio_venta} onChange={handleChange} />
                    <FormError message={errors.precio_venta} />
                </div>
                <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <select className="form-select" name="id_categoria" value={form.id_categoria} onChange={handleChange}>
                        {categorias.map((cat) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.categoria}
                            </option>
                        ))}
                    </select>
                    <FormError message={errors.id_categoria} />
                </div>
                <div className="form-actions">
                    <button className="form-btn" type="submit">
                        {selected ? "Actualizar" : "Crear"}
                    </button>

                    {selected && (
                        <button className="form-btn cancel" type="button" onClick={clear}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductoForm;