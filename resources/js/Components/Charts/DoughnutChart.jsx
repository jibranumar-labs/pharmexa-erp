import { useTheme } from '@/Hooks/useTheme';
import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ labels = [], values = [], title = 'Inventory' }) {
    const { isDark } = useTheme();

    const data = {
        labels,
        datasets: [
            {
                label: title,
                data: values,
                borderWidth: 3,
                backgroundColor: ['#2563eb', '#ef4444', '#f97316', '#10b981'],
                borderColor: isDark ? '#0f172a' : '#ffffff',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: isDark ? '#e2e8f0' : '#334155' },
            },
        },
    };

    return <Doughnut data={data} options={options} />;
}
