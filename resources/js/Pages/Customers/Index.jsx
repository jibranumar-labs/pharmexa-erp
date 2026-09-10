import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Eye,
    Pencil,
    Trash2,
    Plus,
    Search,
    Users,
    UserCheck,
    UserX,
    Phone,
    Mail,
    CreditCard,
    MapPin,
} from 'lucide-react';

export default function Index({
    customers,
    filters = {},
    stats = {},
}) {
    const [search, setSearch] = useState(filters.search || '');

    const searchCustomers = (e) => {
        e.preventDefault();

        router.get(
            route('customers.index'),
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const destroyCustomer = (customer) => {
        if (
            confirm(
                `Delete customer "${customer.name}" ?`
            )
        ) {
            router.delete(
                route('customers.destroy', customer.id)
            );
        }
    };

    return (
        <AppLayout title="Customers">
            <Head title="Customers | Pharmexa" />

            <div className="space-y-7">

                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white shadow-2xl">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black backdrop-blur transition-colors">

                                <Users size={16} />

                                Customer Management

                            </div>

                            <h1 className="mt-5 text-5xl font-black">

                                Customers

                            </h1>

                            <p className="mt-3 max-w-3xl text-white/90 leading-7">

                                Manage pharmacy customers, contact
                                information, balances and loyalty
                                records.

                            </p>

                        </div>

                        <Link
                            href={route('customers.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white px-7 py-4 font-black text-blue-700 dark:text-blue-300 shadow-xl transition hover:-translate-y-1"
                        >

                            <Plus size={20} />

                            Add Customer

                        </Link>

                    </div>

                </section>

                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Total Customers"
                        value={stats.total || 0}
                        color="blue"
                        icon={Users}
                    />

                    <StatCard
                        title="Active"
                        value={stats.active || 0}
                        color="emerald"
                        icon={UserCheck}
                    />

                    <StatCard
                        title="Inactive"
                        value={stats.inactive || 0}
                        color="red"
                        icon={UserX}
                    />

                    <StatCard
                        title="Registered"
                        value={customers.total || 0}
                        color="purple"
                        icon={CreditCard}
                    />

                </section>

                <section className="rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm transition-colors">

                    <div className="border-b border-slate-200 dark:border-slate-700 p-6">

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            <div>

                                <h2 className="text-2xl font-black">

                                    Customer Directory

                                </h2>

                                <p className="mt-1 text-slate-500 dark:text-slate-400">

                                    Search and manage all customers.

                                </p>

                            </div>

                            <form
                                onSubmit={searchCustomers}
                                className="flex gap-3"
                            >

                                <div className="relative">

                                    <Search
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                    />

                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Search customer..."
                                        className="w-72 rounded-xl border border-slate-300 dark:border-slate-700 py-3 pl-11 pr-4 font-medium outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                                    />

                                </div>

                                <button
                                    className="rounded-xl bg-blue-700 px-6 font-black text-white"
                                >
                                    Search
                                </button>

                            </form>

                        </div>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200">

                                <tr>

                                    <th className="p-4 text-left">
                                        Code
                                    </th>

                                    <th className="p-4 text-left">
                                        Customer
                                    </th>

                                    <th className="p-4 text-left">
                                        Contact
                                    </th>

                                    <th className="p-4 text-left">
                                        City
                                    </th>

                                    <th className="p-4 text-left">
                                        Balance
                                    </th>

                                    <th className="p-4 text-center">
                                        Status
                                    </th>

                                    <th className="p-4 text-center">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>
                                {customers.data.length > 0 ? (
    customers.data.map((customer) => (
        <tr
            key={customer.id}
            className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition"
        >
            <td className="p-4 font-black text-blue-700 dark:text-blue-300">
                {customer.customer_code}
            </td>

            <td className="p-4">
                <div>
                    <p className="font-black text-slate-900 dark:text-white">
                        {customer.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {customer.gender}
                    </p>
                </div>
            </td>

            <td className="p-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} />
                        {customer.phone || '-'}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Mail size={14} />
                        {customer.email || '-'}
                    </div>
                </div>
            </td>

            <td className="p-4">
                <div className="flex items-center gap-2">
                    <MapPin size={15} />
                    {customer.city || '-'}
                </div>
            </td>

            <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">
                {Number(customer.current_balance).toFixed(2)} SAR
            </td>

            <td className="p-4 text-center">
                {customer.is_active ? (
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-4 py-2 text-xs font-black text-emerald-700 dark:text-emerald-300">
                        Active
                    </span>
                ) : (
                    <span className="rounded-full bg-red-100 dark:bg-red-900/40 px-4 py-2 text-xs font-black text-red-700 dark:text-red-300">
                        Inactive
                    </span>
                )}
            </td>

            <td className="p-4">
                <div className="flex justify-center gap-2">

                    <Link
                        href={route('customers.show', customer.id)}
                        className="rounded-xl bg-blue-100 dark:bg-blue-900/40 p-3 text-blue-700 dark:text-blue-300 transition hover:bg-blue-600 hover:text-white"
                    >
                        <Eye size={18} />
                    </Link>

                    <Link
                        href={route('customers.edit', customer.id)}
                        className="rounded-xl bg-amber-100 dark:bg-amber-900/40 p-3 text-amber-700 dark:text-amber-300 transition hover:bg-amber-500 hover:text-white"
                    >
                        <Pencil size={18} />
                    </Link>

                    <button
                        onClick={() => destroyCustomer(customer)}
                        className="rounded-xl bg-red-100 dark:bg-red-900/40 p-3 text-red-700 dark:text-red-300 transition hover:bg-red-600 hover:text-white"
                    >
                        <Trash2 size={18} />
                    </button>

                </div>
            </td>
        </tr>
    ))
) : (
    <tr>
        <td
            colSpan="7"
            className="p-12 text-center"
        >
            <Users
                size={50}
                className="mx-auto text-slate-300 dark:text-slate-600"
            />

            <h3 className="mt-4 text-2xl font-black">
                No Customers Found
            </h3>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
                Click "Add Customer" to create your first customer.
            </p>
        </td>
    </tr>
)}

</tbody>

</table>

</div>

<div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 p-6">

    <p className="font-bold text-slate-500 dark:text-slate-400">
        Showing {customers.from || 0} to {customers.to || 0}
        {' '}of{' '}
        {customers.total}
    </p>

    <div className="flex gap-2">

        {customers.links.map((link, index) => (
            <Link
                key={index}
                href={link.url || '#'}
                dangerouslySetInnerHTML={{
                    __html: link.label,
                }}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${ link.active ? 'bg-blue-700 text-white' : 'border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300' } ${ !link.url ? 'pointer-events-none opacity-50' : '' }`}
            />
        ))}

    </div>

</div>

</section>

</div>

</AppLayout>
);
}

function StatCard({
    title,
    value,
    color,
    icon: Icon,
}) {
    const colors = {
        blue: 'from-blue-600 to-cyan-500',
        emerald: 'from-emerald-600 to-teal-500',
        red: 'from-red-500 to-rose-500',
        purple: 'from-purple-600 to-indigo-500',
    };

    return (
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${colors[color]} text-white`}
            >
                <Icon size={26} />
            </div>

            <p className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                {title}
            </p>

            <h2 className="mt-2 text-4xl font-black">
                {value}
            </h2>
        </div>
    );
}