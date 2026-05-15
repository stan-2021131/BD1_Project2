import { useEffect, useState, useContext } from "react";
import { api } from "../../services/Api";
import { CarritoComprasContext } from "../../context/CarritoContext";
import CarritoTable from "../Cart/Cart";
import { useUser } from "../../context/UserContext";
import { validateCompraForm } from "../../utils/ValidateForms";
import FormError from "../FormError/FormError";
import type { CompraFormValues, CompraFormErrors } from "../../utils/FormTypes";
import "./style.css";

const CompraForm = ({ close, refresh, onSuccess, onError }) => {
    const { state, dispatch } = useContext(CarritoComprasContext);
    const { user } = useUser();

    const initialFormState: CompraFormValues = {
        forma_pago: 0,
        proveedor: 0
    };

    const [form, setForm] = useState<CompraFormValues>(initialFormState);
    const [errors, setErrors] = useState<CompraFormErrors>({});


    const [proveedores, setProveedores] = useState([]);
    const [formasPago, setFormasPago] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const p = await api.get("proveedor");
            const f = await api.get("forma_pago");

            setProveedores(p.data);
            setFormasPago(f.data);
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: Number(value),
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validateErrors = validateCompraForm(form, state);

        if (Object.keys(validateErrors).length > 0) {
            setErrors(validateErrors);
            return;
        }

        setErrors({});

        try {
            await api.post("compra_venta/compra", {
                encargado: user.id_empleado,
                forma_pago: Number(form.forma_pago),
                proveedor: Number(form.proveedor),
                productos: state.map((p) => ({
                    id_producto: p.id_producto,
                    cantidad: p.cantidad,
                })),
            });

            onSuccess(`Compra realizada exitosamente`);
            dispatch({ type: "LIMPIAR" });
            refresh();
            setTimeout(() => {
                close();
            }, 1500);
        } catch (error) {
            console.error(error);
            onError(`Error al realizar la compra: ${error.message}`);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h3 className="form-title">Nueva Compra</h3>

            <div className="form-split">
                <div className="form-left">
                    <div className="form-group">
                        <label className="form-label">Proveedor</label>
                        <select className="form-select" onChange={handleChange} name="proveedor" value={form.proveedor}>
                            <option value={0} disabled>Seleccione</option>
                            {proveedores.map((p) => (
                                <option key={p.id_proveedor} value={p.id_proveedor}>
                                    {p.proveedor} - {p.contacto}
                                </option>
                            ))}
                        </select>
                        <FormError message={errors.proveedor} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Forma de Pago</label>
                        <select className="form-select" onChange={handleChange} name="forma_pago" value={form.forma_pago}>
                            <option value={0} disabled>Seleccione</option>
                            {formasPago.map((f) => (
                                <option key={f.id_forma} value={f.id_forma}>
                                    {f.forma_pago}
                                </option>
                            ))}
                        </select>
                        <FormError message={errors.forma_pago} />
                    </div>
                </div>

                {/* CARRITO */}
                <div className="form-right">
                    <CarritoTable items={state} editable={true} dispatch={dispatch} />
                    <FormError message={errors.productos} />
                </div>
            </div>
            <div className="form-actions">
                <button className="form-btn" type="submit">Confirmar compra</button>
                <button className="form-btn cancel" onClick={close}>Cancelar</button>
            </div>
        </form>
    );
};

export default CompraForm;