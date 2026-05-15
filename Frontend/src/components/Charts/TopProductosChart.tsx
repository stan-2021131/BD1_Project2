import {
    PieChart,
    Pie,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28EFF",
];

const TopProductosChart = ({ data }) => {

    const chartData = data.map((item, index) => ({
        ...item,
        total_vendido: Number(item.total_vendido),
        fill: COLORS[index % COLORS.length]
    }));

    return (
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        animationBegin={400}
                        animationDuration={1500}
                        animationEasing="ease"
                        data={chartData}
                        dataKey="total_vendido"
                        nameKey="producto"
                        outerRadius={140}
                        label
                        isAnimationActive={true}
                    />
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopProductosChart;