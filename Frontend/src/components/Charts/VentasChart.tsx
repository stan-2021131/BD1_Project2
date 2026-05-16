import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line
} from "recharts";

const VentasChart = ({ data }) => {

    const chartData = data.map((venta) => ({
        mes: new Date(venta.mes)
            .toLocaleDateString("es-GT", {
                month: "short"
            }),
        total: Number(venta.total)
    }));

    return (
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={chartData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="mes" />

                    <YAxis />

                    <Tooltip />

                    <Legend wrapperStyle={{fontSize: "12px"}} />

                    <Line
                        type="monotone"
                        dataKey="total"
                        name="Ventas"
                        stroke="#82ca9d"
                        strokeWidth={3}
                        animationBegin={800}
                        animationDuration={1500}
                        animationEasing="ease"
                        isAnimationActive={true}
                    />

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VentasChart;