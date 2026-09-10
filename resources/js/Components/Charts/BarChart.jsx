import { useTheme } from '@/Hooks/useTheme';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ labels = [], values = [], title = 'Purchases' }) {
    const { isDark } = useTheme();

    const data = {
        labels,
        datasets: [
            {
                label: title,
                data: values,
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.75)' : 'rgba(16, 185, 129, 0.65)',
                borderColor: '#059669',
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

    return <Bar data={data} options={options} />;
}
