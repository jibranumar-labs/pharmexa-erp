import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Barcode,
    Building2,
    Package,
    Pill,
    Save,
} from 'lucide-react';

export default function Edit({
    medicine,
    categories = [],
    manufacturers = [],
    suppliers = [],
    units = [],
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: medicine.name ?? '',
        generic_name: medicine.generic_name ?? '',
        brand_name: medicine.brand_name ?? '',

        barcode: medicine.barcode ?? '',
        sku: medicine.sku ?? '',

        medicine_type: medicine.medicine_type ?? 'Tablet',

        category_id: medicine.category_id ?? '',
        manufacturer_id: medicine.manufacturer_id ?? '',
        supplier_id: medicine.supplier_id ?? '',
        unit_id: medicine.unit_id ?? '',

        purchase_price: medicine.purchase_price ?? 0,
        selling_price: medicine.selling_price ?? 0,
        tax_percentage: medicine.tax_percentage ?? 0,

        stock_quantity: medicine.stock_quantity ?? 0,
        minimum_stock: medicine.minimum_stock ?? 10,

        batch_number: medicine.batch_number ?? '',
        expiry_date: medicine.expiry_date
            ? String(medicine.expiry_date).slice(0, 10)
            : '',

        description: medicine.description ?? '',
        image: medicine.image ?? '',

        is_active: Boolean(medicine.is_active),
    });

    const submit = (e) => {
        e.preventDefault();

        put(
            route('platform.medicines.update', medicine.id),
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout title="Edit Global Product">
            <Head title={`Edit ${medicine.name} | Pharmexa`} />

            <div className="space-y-7">
                {/* Hero */}
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                                <Package size={16} />
                                Platform / Global Catalogue
                            </div>

                            <h1 className="text-3xl font-black tracking-tight lg:text-5xl">
                                Edit Global Product
                            </h1>

                            <p className="mt-3 max-w-3xl font-medium leading-7 text-white/90">
                                Update the master catalogue information
                                for {medicine.name}.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={route(
                                    'platform.medicines.show',
                                    medicine.id
                                )}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-5 py-3 font-black text-white backdrop-blur transition hover:bg-white hover:text-blue-700"
                            >
                                <ArrowLeft size={18} />
                                Back to Product
                            </Link>
                        </div>
                    </div>
                </section>

                <form
                    onSubmit={submit}
                    className="space-y-7"
                >
                    {/* Basic Information */}
                    <Section
                        title="Basic Information"
                        description="Main information stored in the global Pharmexa catalogue."
                        icon={Pill}
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <Input
                                label="Product Name *"
                                value={data.name}
                                error={errors.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Product name"
                            />

                            <Select
                                label="Medicine Type *"
                                value={data.medicine_type}
                                error={errors.medicine_type}
                                onChange={(e) =>
                                    setData(
                                        'medicine_type',
                                        e.target.value
                                    )
                                }
                            >
                                {[
                                    'Tablet',
                                    'Capsule',
                                    'Syrup',
                                    'Injection',
                                    'Cream',
                                    'Drops',
                                    'Powder',
                                    'Other',
                                ].map((type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>
                                ))}
                            </Select>

                            <Input
                                label="Generic Name"
                                value={data.generic_name}
                                error={errors.generic_name}
                                onChange={(e) =>
                                    setData(
                                        'generic_name',
                                        e.target.value
                                    )
                                }
                                placeholder="Generic name"
                            />

                            <Input
                                label="Brand Name"
                                value={data.brand_name}
                                error={errors.brand_name}
                                onChange={(e) =>
                                    setData(
                                        'brand_name',
                                        e.target.value
                                    )
                                }
                                placeholder="Brand name"
                            />
                        </div>
                    </Section>

                    {/* Identification */}
                    <Section
                        title="Product Identification"
                        description="Barcode and SKU used to identify this global product."
                        icon={Barcode}
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <Input
                                label="Barcode *"
                                value={data.barcode}
                                error={errors.barcode}
                                onChange={(e) =>
                                    setData(
                                        'barcode',
                                        e.target.value
                                    )
                                }
                                placeholder="Barcode"
                            />

                            <Input
                                label="SKU *"
                                value={data.sku}
                                error={errors.sku}
                                onChange={(e) =>
                                    setData(
                                        'sku',
                                        e.target.value
                                    )
                                }
                                placeholder="MED-000001"
                            />
                        </div>
                    </Section>

                    {/* Classification */}
                    <Section
                        title="Classification"
                        description="Category, manufacturer, supplier and unit."
                        icon={Building2}
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <Select
                                label="Category *"
                                value={data.category_id}
                                error={errors.category_id}
                                onChange={(e) =>
                                    setData(
                                        'category_id',
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                label="Manufacturer *"
                                value={data.manufacturer_id}
                                error={errors.manufacturer_id}
                                onChange={(e) =>
                                    setData(
                                        'manufacturer_id',
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Select manufacturer
                                </option>

                                {manufacturers.map(
                                    (manufacturer) => (
                                        <option
                                            key={manufacturer.id}
                                            value={manufacturer.id}
                                        >
                                            {manufacturer.name}
                                        </option>
                                    )
                                )}
                            </Select>

                            <Select
                                label="Supplier *"
                                value={data.supplier_id}
                                error={errors.supplier_id}
                                onChange={(e) =>
                                    setData(
                                        'supplier_id',
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Select supplier
                                </option>

                                {suppliers.map((supplier) => (
                                    <option
                                        key={supplier.id}
                                        value={supplier.id}
                                    >
                                        {supplier.name}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                label="Unit *"
                                value={data.unit_id}
                                error={errors.unit_id}
                                onChange={(e) =>
                                    setData(
                                        'unit_id',
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Select unit
                                </option>

                                {units.map((unit) => (
                                    <option
                                        key={unit.id}
                                        value={unit.id}
                                    >
                                        {unit.name}
                                        {unit.short_name
                                            ? ` (${unit.short_name})`
                                            : ''}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </Section>

                    {/* Pricing */}
                    <Section
                        title="Master Pricing"
                        description="Default pricing information for the master catalogue."
                        icon={Package}
                    >
                        <div className="grid gap-5 md:grid-cols-3">
                            <Input
                                label="Purchase Price *"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.purchase_price}
                                error={errors.purchase_price}
                                onChange={(e) =>
                                    setData(
                                        'purchase_price',
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                label="Selling Price *"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.selling_price}
                                error={errors.selling_price}
                                onChange={(e) =>
                                    setData(
                                        'selling_price',
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                label="Tax Percentage"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={data.tax_percentage}
                                error={errors.tax_percentage}
                                onChange={(e) =>
                                    setData(
                                        'tax_percentage',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </Section>

                    {/* Defaults */}
                    <Section
                        title="Master Defaults"
                        description="Default catalogue values. Actual pharmacy inventory remains pharmacy-specific."
                        icon={Package}
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <Input
                                label="Master Stock"
                                type="number"
                                min="0"
                                value={data.stock_quantity}
                                error={errors.stock_quantity}
                                onChange={(e) =>
                                    setData(
                                        'stock_quantity',
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                label="Minimum Stock *"
                                type="number"
                                min="0"
                                value={data.minimum_stock}
                                error={errors.minimum_stock}
                                onChange={(e) =>
                                    setData(
                                        'minimum_stock',
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                label="Batch Number"
                                value={data.batch_number}
                                error={errors.batch_number}
                                onChange={(e) =>
                                    setData(
                                        'batch_number',
                                        e.target.value
                                    )
                                }
                                placeholder="Batch number"
                            />

                            <Input
                                label="Expiry Date"
                                type="date"
                                value={data.expiry_date}
                                error={errors.expiry_date}
                                onChange={(e) =>
                                    setData(
                                        'expiry_date',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </Section>

                    {/* Description / Status */}
                    <Section
                        title="Additional Information"
                        description="Description and catalogue status."
                        icon={Pill}
                    >
                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                                    Description
                                </label>

                                <textarea
                                    rows="5"
                                    className="input"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData(
                                            'description',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Product description..."
                                />

                                {errors.description && (
                                    <ErrorMessage>
                                        {errors.description}
                                    </ErrorMessage>
                                )}
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
                                <label className="flex cursor-pointer items-center justify-between gap-4">
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white">
                                            Active Product
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Control whether this
                                            product is active in the
                                            global catalogue.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                'is_active',
                                                e.target.checked
                                            )
                                        }
                                        className="h-5 w-5 rounded border-slate-300"
                                    />
                                </label>

                                {errors.is_active && (
                                    <ErrorMessage>
                                        {errors.is_active}
                                    </ErrorMessage>
                                )}
                            </div>
                        </div>
                    </Section>

                    {/* Save */}
                    <section className="flex flex-col-reverse gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:justify-end">
                        <Link
                            href={route(
                                'platform.medicines.show',
                                medicine.id
                            )}
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-7 py-4 font-black text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={20} />

                            {processing
                                ? 'Saving...'
                                : 'Save Changes'}
                        </button>
                    </section>
                </form>
            </div>
        </AppLayout>
    );
}

function Section({
    title,
    description,
    icon: Icon,
    children,
}) {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:p-8">
            <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg">
                    <Icon size={22} />
                </div>

                <div>
                    <h2 className="text-xl font-black text-slate-950 dark:text-white">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </section>
    );
}

function Input({
    label,
    error,
    ...props
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                {label}
            </label>

            <input
                className="input"
                {...props}
            />

            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}
        </div>
    );
}

function Select({
    label,
    error,
    children,
    ...props
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                {label}
            </label>

            <select
                className="input"
                {...props}
            >
                {children}
            </select>

            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}
        </div>
    );
}

function ErrorMessage({ children }) {
    return (
        <p className="mt-2 text-sm font-bold text-red-600 dark:text-red-400">
            {children}
        </p>
    );
}