import { useTheme } from '@/Hooks/useTheme';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function LineChart({ labels = [], values = [], title = 'Sales Trend' }) {
    const { isDark } = useTheme();

    const data = {
        labels,
        datasets: [
            {
                label: title,
                data: values,
                fill: true,
                tension: 0.45,
                borderWidth: 3,
                pointRadius: 5,
                borderColor: '#2563eb',
                backgroundColor: isDark ? 'rgba(37, 99, 235, 0.25)' : 'rgba(37, 99, 235, 0.15)',
                pointBackgroundColor: '#2563eb',
                pointBorderColor: isDark ? '#0f172a' : '#ffffff',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: { color: isDark ? '#e2e8f0' : '#334155' },
            },
        },
        scales: {
            x: {
                ticks: { color: isDark ? '#94a3b8' : '#64748b' },
                grid: { color: isDark ? '#334155' : '#e2e8f0' },
            },
            y: {
                beginAtZero: true,
                ticks: { color: isDark ? '#94a3b8' : '#64748b' },
                grid: { color: isDark ? '#334155' : '#e2e8f0' },
            },
        },
    };

    return <Line data={data} options={options} />;
}
