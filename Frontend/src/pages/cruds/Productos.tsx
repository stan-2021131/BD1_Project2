import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import ProductoRow from "../../components/Rows/ProductoRow";
import ProductoForm from "../../components/Forms/ProductoForm";
import { useUser } from "../../context/UserContext";

const Productos = () => {
    const [productos, setProductos] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<any>(null);

    const fetchProductos = async () => {
        const res = await api.get("producto");
        setProductos(res.data);
    };

    const filteredProductos = productos.filter((p) =>
        p.producto.toLowerCase().includes(search.toLowerCase())
    );

    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    useEffect(() => {
        fetchProductos();
    }, []);

    return (
        <div style={{ display: "flex", gap: "20px" }}>

            <div style={{ flex: 1 }}>
                <h2>Productos</h2>

                <input
                    type="text"
                    placeholder="Buscar producto..."
                    className="input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table border={1} width="100%">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Stock</th>
                            <th>Venta</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProductos.map((p) => (
                            <ProductoRow
                                key={p.id_producto}
                                producto={p}
                                onSelect={setSelected}
                                refresh={fetchProductos}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FORM SOLO ADMIN */}
            {isAdmin && (
                <div style={{ flex: 1 }}>
                    <ProductoForm
                        selected={selected}
                        clear={() => setSelected(null)}
                        refresh={fetchProductos}
                    />
                </div>
            )}
        </div>
    );
};

export default Productos;