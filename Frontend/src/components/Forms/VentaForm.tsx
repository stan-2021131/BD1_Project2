import { useEffect, useState, useContext } from "react";
import { api } from "../../services/Api";
import { CarritoVentasContext } from "../../context/CarritoContext";
import CarritoTable from "../Cart/Cart";
import { useUser } from "../../context/UserContext";
import type { VentaFormValues, VentaFormErrors } from "../../utils/FormTypes";
import { validateVentaForm } from "../../utils/ValidateForms";
import FormError from "../FormError/FormError";
import "./style.css";

const VentaForm = ({ close, refresh, onSuccess, onError, onClear }: { close: () => void, refresh: () => void, onSuccess: (msg: string) => void, onError: (msg: string) => void, onClear: () => void }) => {
    const { state, dispatch } = useContext(CarritoVentasContext);
    const { user } = useUser();

    const initialForm: VentaFormValues = {
        cliente: 0,
        forma_pago: 0,
    };

    const [form, setForm] = useState<VentaFormValues>(initialForm);
    const [errors, setErrors] = useState<VentaFormErrors>({});

    const [clientes, setClientes] = useState([]);
    const [formasPago, setFormasPago] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const c = await api.get("cliente");
            const f = await api.get("forma_pago");

            setClientes(c.data);
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
        onClear();
        const validateErrors = validateVentaForm(form, state);

        if (Object.keys(validateErrors).length > 0) {
            setErrors(validateErrors);
            return;
        }

        setErrors({});

        try {
            await api.post("compra_venta/venta", {
                encargado: user.id_empleado,
                forma_pago: Number(form.forma_pago),
                cliente: Number(form.cliente),
                productos: state.map((p) => ({
                    id_producto: p.id_producto,
                    cantidad: p.cantidad,
                })),
            });

            onSuccess("Venta realizada exitosamente");
            dispatch({ type: "LIMPIAR" });
            refresh();
            close();
        } catch (error) {
            console.error(error);
            const message = error.message || "Error desconocido";
            onError(`Error al realizar la venta: ${message}`);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h3 className="form-title">Nueva Venta</h3>

            <div className="form-split">

                {/* IZQUIERDA */}
                <div className="form-left">
                    <div className="form-group">
                        <label className="form-label">Cliente</label>
                        <select className="form-select" name="cliente" onChange={handleChange} value={form.cliente}>
                            <option value={0}>Seleccione</option>
                            {clientes.map((c) => (
                                <option key={c.id_cliente} value={c.id_cliente}>
                                    {c.nombre} - {c.nit}
                                </option>
                            ))}
                        </select>
                        <FormError message={errors.cliente} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Forma de Pago</label>
                        <select className="form-select" name="forma_pago" onChange={handleChange} value={form.forma_pago}>
                            <option value={0}>Seleccione</option>
                            {formasPago.map((f) => (
                                <option key={f.id_forma} value={f.id_forma}>
                                    {f.forma_pago}
                                </option>
                            ))}
                        </select>
                        <FormError message={errors.forma_pago} />
                    </div>
                </div>

                {/* DERECHA */}
                <div className="form-right">
                    <CarritoTable items={state} editable={true} dispatch={dispatch} />
                    <FormError message={errors.productos} />
                </div>

            </div>

            <div className="form-actions">
                <button className="form-btn" type="submit">Confirmar venta</button>
                <button className="form-btn cancel" onClick={close}>Cancelar</button>
            </div>
        </form>
    );
};

export default VentaForm;