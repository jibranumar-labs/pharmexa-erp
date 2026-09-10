import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Users,
    UserPlus,
    ShieldCheck,
    Stethoscope,
    ShoppingCart,
    Crown,
    Search,
    Pencil,
    Trash2,
    X,
    Mail,
    CalendarDays,
    KeyRound,
    Eye,
    EyeOff,
} from 'lucide-react';

const roles = [
    {
        value: 'admin',
        label: 'Admin',
        description: 'Administrative access to pharmacy operations.',
    },
    {
        value: 'pharmacist',
        label: 'Pharmacist',
        description: 'Pharmacy workflow and medicine operations.',
    },
    {
        value: 'cashier',
        label: 'Cashier',
        description: 'Point of sale and daily sales operations.',
    },
];

export default function Index({ members = [] }) {
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const filteredMembers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return members;
        }

        return members.filter((member) => {
            return (
                member.name?.toLowerCase().includes(query) ||
                member.email?.toLowerCase().includes(query) ||
                member.role?.toLowerCase().includes(query)
            );
        });
    }, [members, search]);

    const stats = useMemo(() => {
        return {
            total: members.length,
            admins: members.filter((member) => member.role === 'admin').length,
            pharmacists: members.filter(
                (member) => member.role === 'pharmacist'
            ).length,
            cashiers: members.filter(
                (member) => member.role === 'cashier'
            ).length,
        };
    }, [members]);

    const destroyMember = (member) => {
        if (
            confirm(
                `Remove "${member.name}" from this pharmacy team?`
            )
        ) {
            router.delete(route('team.destroy', member.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout title="Team & Access">
            <Head title="Team & Access | Pharmexa" />

            <div className="space-y-7">

                {/* HERO */}
                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white shadow-2xl">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black backdrop-blur">
                                <ShieldCheck size={17} />
                                Team & Access Management
                            </div>

                            <h1 className="mt-5 text-4xl font-black md:text-5xl">
                                Your Pharmacy Team
                            </h1>

                            <p className="mt-3 max-w-3xl leading-7 text-white/90">
                                Manage staff accounts and assign the right
                                access level to Admins, Pharmacists and
                                Cashiers from one secure workspace.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-black text-blue-700 shadow-xl transition hover:-translate-y-1"
                        >
                            <UserPlus size={20} />
                            Add Team Member
                        </button>
                    </div>
                </section>

                {/* STATS */}
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Team"
                        value={stats.total}
                        icon={Users}
                        gradient="from-blue-600 to-cyan-500"
                    />

                    <StatCard
                        title="Admins"
                        value={stats.admins}
                        icon={ShieldCheck}
                        gradient="from-purple-600 to-indigo-500"
                    />

                    <StatCard
                        title="Pharmacists"
                        value={stats.pharmacists}
                        icon={Stethoscope}
                        gradient="from-emerald-600 to-teal-500"
                    />

                    <StatCard
                        title="Cashiers"
                        value={stats.cashiers}
                        icon={ShoppingCart}
                        gradient="from-amber-500 to-orange-500"
                    />
                </section>

                {/* DIRECTORY */}
                <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                    Team Directory
                                </h2>

                                <p className="mt-1 text-slate-500 dark:text-slate-400">
                                    View and manage users connected to this pharmacy.
                                </p>
                            </div>

                            <div className="relative">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search team member..."
                                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-80"
                                />
                            </div>
                        </div>
                    </div>

                    {/* DESKTOP TABLE */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/60">
                                <tr>
                                    <th className="p-4 text-left text-sm font-black text-slate-600 dark:text-slate-300">
                                        Team Member
                                    </th>

                                    <th className="p-4 text-left text-sm font-black text-slate-600 dark:text-slate-300">
                                        Email
                                    </th>

                                    <th className="p-4 text-left text-sm font-black text-slate-600 dark:text-slate-300">
                                        Role
                                    </th>

                                    <th className="p-4 text-left text-sm font-black text-slate-600 dark:text-slate-300">
                                        Joined
                                    </th>

                                    <th className="p-4 text-center text-sm font-black text-slate-600 dark:text-slate-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <MemberRow
                                            key={member.id}
                                            member={member}
                                            onEdit={() =>
                                                setEditingMember(member)
                                            }
                                            onDelete={() =>
                                                destroyMember(member)
                                            }
                                        />
                                    ))
                                ) : (
                                    <EmptyState />
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARDS */}
                    <div className="space-y-4 p-4 md:hidden">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <MobileMemberCard
                                    key={member.id}
                                    member={member}
                                    onEdit={() =>
                                        setEditingMember(member)
                                    }
                                    onDelete={() =>
                                        destroyMember(member)
                                    }
                                />
                            ))
                        ) : (
                            <div className="py-12">
                                <EmptyContent />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 border-t border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                        <p className="font-bold text-slate-500 dark:text-slate-400">
                            {filteredMembers.length} of {members.length}{' '}
                            team members
                        </p>

                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <ShieldCheck size={15} />
                            Pharmacy Scoped Access
                        </div>
                    </div>
                </section>
            </div>

            {showCreate && (
                <MemberModal
                    mode="create"
                    onClose={() => setShowCreate(false)}
                />
            )}

            {editingMember && (
                <MemberModal
                    mode="edit"
                    member={editingMember}
                    onClose={() => setEditingMember(null)}
                />
            )}
        </AppLayout>
    );
}

function MemberRow({ member, onEdit, onDelete }) {
    const protectedAccount =
        member.role === 'owner' || member.role === 'super_owner';

    return (
        <tr className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">

            <td className="p-4">
                <div className="flex items-center gap-3">
                    <Avatar name={member.name} role={member.role} />

                    <div>
                        <p className="font-black text-slate-900 dark:text-white">
                            {member.name}
                        </p>

                        {protectedAccount && (
                            <p className="mt-1 text-xs font-bold text-slate-400">
                                Protected account
                            </p>
                        )}
                    </div>
                </div>
            </td>

            <td className="p-4">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail size={16} />
                    {member.email}
                </div>
            </td>

            <td className="p-4">
                <RoleBadge role={member.role} />
            </td>

            <td className="p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <CalendarDays size={16} />
                    {formatDate(member.created_at)}
                </div>
            </td>

            <td className="p-4">
                {protectedAccount ? (
                    <div className="flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-xs font-black text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                            <Crown size={15} />
                            Protected
                        </span>
                    </div>
                ) : (
                    <div className="flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={onEdit}
                            title="Edit member"
                            className="rounded-xl bg-blue-100 p-3 text-blue-700 transition hover:bg-blue-600 hover:text-white dark:bg-blue-950/40 dark:text-blue-400"
                        >
                            <Pencil size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={onDelete}
                            title="Remove member"
                            className="rounded-xl bg-red-100 p-3 text-red-700 transition hover:bg-red-600 hover:text-white dark:bg-red-950/40 dark:text-red-400"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}

function MobileMemberCard({
    member,
    onEdit,
    onDelete,
}) {
    const protectedAccount =
        member.role === 'owner' || member.role === 'super_owner';

    return (
        <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">

            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Avatar
                        name={member.name}
                        role={member.role}
                    />

                    <div>
                        <p className="font-black text-slate-900 dark:text-white">
                            {member.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            {member.email}
                        </p>
                    </div>
                </div>

                <RoleBadge role={member.role} />
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">

                <span className="text-xs font-bold text-slate-400">
                    Joined {formatDate(member.created_at)}
                </span>

                {!protectedAccount && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onEdit}
                            className="rounded-xl bg-blue-100 p-2.5 text-blue-700"
                        >
                            <Pencil size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={onDelete}
                            className="rounded-xl bg-red-100 p-2.5 text-red-700"
                        >
                            <Trash2 size={17} />
                        </button>
                    </div>
                )}

                {protectedAccount && (
                    <span className="inline-flex items-center gap-1 text-xs font-black text-amber-600">
                        <Crown size={14} />
                        Protected
                    </span>
                )}
            </div>
        </div>
    );
}

function MemberModal({
    mode,
    member = null,
    onClose,
}) {
    const editing = mode === 'edit';

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
    } = useForm({
        name: member?.name || '',
        email: member?.email || '',
        role: member?.role || 'pharmacist',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const submit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        };

        if (editing) {
            put(
                route('team.update', member.id),
                options
            );
        } else {
            post(route('team.store'), options);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl dark:bg-slate-900">

                <div className="flex items-start justify-between border-b border-slate-200 p-6 dark:border-slate-800">

                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
                            {editing ? (
                                <Pencil size={22} />
                            ) : (
                                <UserPlus size={22} />
                            )}
                        </div>

                        <h2 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
                            {editing
                                ? 'Edit Team Member'
                                : 'Add Team Member'}
                        </h2>

                        <p className="mt-1 text-slate-500">
                            {editing
                                ? 'Update staff information, access role or password.'
                                : 'Create a secure staff account for this pharmacy.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-slate-100 p-3 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-5 p-6"
                >
                    <Field
                        label="Full Name"
                        error={errors.name}
                    >
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) =>
                                setData(
                                    'name',
                                    e.target.value
                                )
                            }
                            placeholder="Enter staff member name"
                            className="input-style"
                            autoFocus
                        />
                    </Field>

                    <Field
                        label="Email Address"
                        error={errors.email}
                    >
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) =>
                                setData(
                                    'email',
                                    e.target.value
                                )
                            }
                            placeholder="name@example.com"
                            className="input-style"
                        />
                    </Field>

                    <Field
                        label="Access Role"
                        error={errors.role}
                    >
                        <div className="grid gap-3 sm:grid-cols-3">
                            {roles.map((role) => {
                                const selected =
                                    data.role === role.value;

                                return (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() =>
                                            setData(
                                                'role',
                                                role.value
                                            )
                                        }
                                        className={`rounded-2xl border p-4 text-left transition ${
                                            selected
                                                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100 dark:bg-blue-950/30'
                                                : 'border-slate-200 hover:border-blue-300 dark:border-slate-700'
                                        }`}
                                    >
                                        <p className="font-black text-slate-900 dark:text-white">
                                            {role.label}
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {role.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </Field>

                    <Field
                        label={
                            editing
                                ? 'New Password (Optional)'
                                : 'Password'
                        }
                        error={errors.password}
                    >
                        <div className="relative">
                            <KeyRound
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                value={data.password}
                                onChange={(e) =>
                                    setData(
                                        'password',
                                        e.target.value
                                    )
                                }
                                placeholder={
                                    editing
                                        ? 'Leave blank to keep current password'
                                        : 'Minimum 8 characters'
                                }
                                className="input-style !pl-11 !pr-12"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </Field>

                    <Field
                        label="Confirm Password"
                        error={
                            errors.password_confirmation
                        }
                    >
                        <input
                            type={
                                showPassword
                                    ? 'text'
                                    : 'password'
                            }
                            value={
                                data.password_confirmation
                            }
                            onChange={(e) =>
                                setData(
                                    'password_confirmation',
                                    e.target.value
                                )
                            }
                            placeholder="Confirm password"
                            className="input-style"
                        />
                    </Field>

                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                        <div className="flex gap-3">
                            <ShieldCheck
                                size={20}
                                className="mt-0.5 shrink-0 text-emerald-600"
                            />

                            <div>
                                <p className="font-black text-slate-900 dark:text-white">
                                    Secure pharmacy access
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    This account will be connected
                                    automatically to your pharmacy.
                                    Staff cannot choose or change the
                                    pharmacy from this form.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-6 py-3 font-black text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {editing ? (
                                <Pencil size={18} />
                            ) : (
                                <UserPlus size={18} />
                            )}

                            {processing
                                ? 'Saving...'
                                : editing
                                  ? 'Save Changes'
                                  : 'Create Team Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({
    label,
    error,
    children,
}) {
    return (
        <div>
            <label className="mb-2 block font-black text-slate-700 dark:text-slate-200">
                {label}
            </label>

            {children}

            {error && (
                <p className="mt-2 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    gradient,
}) {
    return (
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">

            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${gradient} text-white shadow-lg`}
            >
                <Icon size={26} />
            </div>

            <p className="mt-5 text-sm font-bold text-slate-500">
                {title}
            </p>

            <h2 className="mt-2 text-4xl font-black text-slate-900 dark:text-white">
                {value}
            </h2>
        </div>
    );
}

function Avatar({ name, role }) {
    const initials = (name || '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    const styles = {
        owner: 'from-amber-500 to-orange-500',
        super_owner: 'from-amber-500 to-orange-500',
        admin: 'from-purple-600 to-indigo-500',
        pharmacist: 'from-emerald-600 to-teal-500',
        cashier: 'from-blue-600 to-cyan-500',
    };

    return (
        <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
                styles[role] || 'from-slate-500 to-slate-700'
            } font-black text-white shadow-md`}
        >
            {initials}
        </div>
    );
}

function RoleBadge({ role }) {
    const config = {
        super_owner: {
            label: 'Super Owner',
            className:
                'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
            icon: Crown,
        },

        owner: {
            label: 'Owner',
            className:
                'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
            icon: Crown,
        },

        admin: {
            label: 'Admin',
            className:
                'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
            icon: ShieldCheck,
        },

        pharmacist: {
            label: 'Pharmacist',
            className:
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
            icon: Stethoscope,
        },

        cashier: {
            label: 'Cashier',
            className:
                'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
            icon: ShoppingCart,
        },
    };

    const item =
        config[role] || {
            label: role || 'Unknown',
            className:
                'bg-slate-100 text-slate-700',
            icon: Users,
        };

    const Icon = item.icon;

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${item.className}`}
        >
            <Icon size={14} />
            {item.label}
        </span>
    );
}

function EmptyState() {
    return (
        <tr>
            <td
                colSpan="5"
                className="p-12 text-center"
            >
                <EmptyContent />
            </td>
        </tr>
    );
}

function EmptyContent() {
    return (
        <>
            <Users
                size={50}
                className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
                No Team Members Found
            </h3>

            <p className="mt-2 text-slate-500">
                Add a staff member or change your search.
            </p>
        </>
    );
}

function formatDate(date) {
    if (!date) {
        return '-';
    }

    return new Intl.DateTimeFormat('en', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
}