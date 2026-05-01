import { useEffect, useState } from "react";
import { api } from "../../services/Api";

const ProductoForm = ({ selected, clear, refresh }) => {
    const [form, setForm] = useState({
        producto: "",
        descripcion: "",
        stock: 0,
        precio_compra: 0,
        precio_venta: 0,
        id_categoria: 1,
    });

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selected) {
            await api.put(`producto/${selected.id_producto}`, form);
        } else {
            await api.post("producto", form);
        }

        clear();
        refresh();
    };

    return (
        <div>
            <h3>{selected ? "Editar" : "Crear"} Producto</h3>

            <form onSubmit={handleSubmit}>
                <input name="producto" placeholder="Nombre" value={form.producto} onChange={handleChange} />
                <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
                <input name="stock" type="number" value={form.stock} onChange={handleChange} />
                <input name="precio_compra" type="number" step="0.01" value={form.precio_compra} onChange={handleChange} />
                <input name="precio_venta" type="number" step="0.01" value={form.precio_venta} onChange={handleChange} />

                <select name="id_categoria" value={form.id_categoria} onChange={handleChange}>
                    {categorias.map((cat) => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>
                            {cat.categoria}
                        </option>
                    ))}
                </select>

                <button type="submit">
                    {selected ? "Actualizar" : "Crear"}
                </button>

                {selected && (
                    <button type="button" onClick={clear}>
                        Cancelar
                    </button>
                )}
            </form>
        </div>
    );
};

export default ProductoForm;