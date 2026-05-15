import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar
} from "recharts";

const ClientesChart = ({ data }) => {

    const chartData = data.map((cliente) => ({
        nombre: cliente.nombre,
        total_ventas: Number(cliente.total_ventas)
    }));

    return (
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={chartData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="nombre"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={80}
                        stroke="#9ca3af"
                    />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                        dataKey="total_ventas"
                        name="Compras"
                        fill="#8884d8"
                        radius={[8, 8, 0, 0]}
                        animationBegin={800}
                        animationDuration={1500}
                        animationEasing="ease"
                        isAnimationActive={true}
                    />

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ClientesChart;