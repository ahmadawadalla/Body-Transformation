import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function Charts({ series }: { series: Array<any> }) {
    return (
        <div className="lg:col-span-2 grid gap-3">
            <ChartCard title="Weight (lb)">
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                        <XAxis dataKey="day" /><YAxis /><Tooltip /><Legend />
                        <Line type="monotone" dataKey="weight_lb" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Body Fat % (estimated)">
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                        <XAxis dataKey="day" /><YAxis /><Tooltip /><Legend />
                        <Line type="monotone" dataKey="bf" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Lean Mass (lb)">
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                        <XAxis dataKey="day" /><YAxis /><Tooltip /><Legend />
                        <Line type="monotone" dataKey="lean_lb" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-xl border bg-white p-3">
            <h3 className="font-semibold text-sm mb-2">{title}</h3>
            {children}
        </section>
    );
}
