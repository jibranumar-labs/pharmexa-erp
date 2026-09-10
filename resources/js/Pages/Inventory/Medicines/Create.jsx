import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Barcode,
    ImagePlus,
    Save,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Create({
    categories = [],
    manufacturers = [],
    suppliers = [],
    units = [],
    nextSku = '',
    scanData = {},
}) {
    const [imagePreview, setImagePreview] = useState(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        generic_name: '',
        brand_name: '',

        barcode: scanData?.barcode || '',
        gtin: scanData?.gtin || '',
        sku: nextSku || '',

        auto_generate_sku: true,

        medicine_type: 'Tablet',

        category_id: '',
        manufacturer_id: '',
        supplier_id: '',
        unit_id: '',

        purchase_price: '',
        selling_price: '',
        tax_percentage: '0',

        stock_quantity: '',
        minimum_stock: '5',

        batch_number: scanData?.batch_number || '',
        expiry_date: scanData?.expiry_date || '',

        description: '',

        image: null,

        is_serialized: Boolean(scanData?.is_serialized || scanData?.serial_number),
        is_active: true,

        // Scan metadata is submitted with the form so the backend can retain
        // the original GS1 evidence in the Super Owner contribution.
        raw_gs1_data: scanData?.raw_gs1_data || '',
        serial_number: scanData?.serial_number || '',
    });

    useEffect(() => {
        if (data.auto_generate_sku && nextSku) {
            setData('sku', nextSku);
        }
    }, [nextSku]);

    useEffect(() => {
        if (!scanData || Object.keys(scanData).length === 0) return;

        if (scanData.gtin) setData('gtin', scanData.gtin);
        if (scanData.barcode) setData('barcode', scanData.barcode);
        if (scanData.batch_number) setData('batch_number', scanData.batch_number);
        if (scanData.expiry_date) setData('expiry_date', scanData.expiry_date);
        if (scanData.raw_gs1_data) setData('raw_gs1_data', scanData.raw_gs1_data);
        if (scanData.serial_number) {
            setData('serial_number', scanData.serial_number);
            setData('is_serialized', true);
        }
    }, [scanData]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            setData('image', null);
            setImagePreview(null);
            return;
        }

        setData('image', file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);

        const input = document.getElementById('product-image');

        if (input) {
            input.value = '';
        }
    };

    const handleAutoSkuChange = (e) => {
        const checked = e.target.checked;

        setData('auto_generate_sku', checked);

        if (checked) {
            setData('sku', nextSku || '');
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('medicines.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setImagePreview(null);
            },
        });
    };

    return (
        <AppLayout title="Add Product">
            <Head title="Add Product | Pharmexa" />

            <div className="space-y-7">
                {/* -------------------------------------------------------------
                    Header
                ------------------------------------------------------------- */}

                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                                <Barcode size={16} />

                                Inventory / Add Product
                            </div>

                            <h1 className="text-4xl font-black lg:text-5xl">
                                Add Product
                            </h1>

                            <p className="mt-3 max-w-3xl font-medium text-white/90">
                                Add a medicine or pharmacy product with
                                pricing, stock, barcode, supplier and product
                                photo.
                            </p>
                        </div>

                        <Link
                            href={route('medicines.index')}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-5 py-3 font-black text-white backdrop-blur transition hover:bg-white hover:text-blue-700"
                        >
                            <ArrowLeft size={18} />
                            Back to Products
                        </Link>
                    </div>
                </section>

                {/* -------------------------------------------------------------
                    Form
                ------------------------------------------------------------- */}

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <form
                        onSubmit={submit}
                        encType="multipart/form-data"
                        className="space-y-8"
                    >
                        {/* -----------------------------------------------------
                            Basic Information
                        ----------------------------------------------------- */}

                        <FormSection title="Basic Information">
                            <Input
                                label="Product Name *"
                                error={errors.name}
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />

                            <Input
                                label="Generic Name"
                                error={errors.generic_name}
                                value={data.generic_name}
                                onChange={(e) =>
                                    setData(
                                        'generic_name',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Brand Name"
                                error={errors.brand_name}
                                value={data.brand_name}
                                onChange={(e) =>
                                    setData(
                                        'brand_name',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Barcode"
                                error={errors.barcode}
                                value={data.barcode}
                                placeholder="Optional linear barcode (EAN/UPC)"
                                onChange={(e) =>
                                    setData(
                                        'barcode',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="GTIN"
                                error={errors.gtin}
                                value={data.gtin}
                                maxLength={14}
                                inputMode="numeric"
                                placeholder="8-14 digit GTIN"
                                onChange={(e) =>
                                    setData(
                                        'gtin',
                                        e.target.value.replace(
                                            /\D/g,
                                            '',
                                        ),
                                    )
                                }
                            />

                            {/* -------------------------------------------------
                                SKU
                            ------------------------------------------------- */}

                            <div>
                                <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                                    SKU *
                                </label>

                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
                                    <label className="flex cursor-pointer items-start gap-4">
                                        <input
                                            type="checkbox"
                                            checked={
                                                data.auto_generate_sku
                                            }
                                            onChange={
                                                handleAutoSkuChange
                                            }
                                            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />

                                        <div>
                                            <h3 className="font-black text-slate-900 dark:text-white">
                                                Auto Generate SKU
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                Pharmexa automatically assigns
                                                a unique SKU for this
                                                pharmacy.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <input
                                    className="input mt-3"
                                    value={data.sku}
                                    readOnly={data.auto_generate_sku}
                                    onChange={(e) =>
                                        setData(
                                            'sku',
                                            e.target.value,
                                        )
                                    }
                                />

                                {data.auto_generate_sku &&
                                    nextSku && (
                                        <p className="mt-2 text-sm font-bold text-emerald-600">
                                            Next SKU: {nextSku}
                                        </p>
                                    )}

                                {errors.sku && (
                                    <p className="mt-2 text-sm font-bold text-red-600">
                                        {errors.sku}
                                    </p>
                                )}
                            </div>

                            {/* -------------------------------------------------
                                Product Form
                            ------------------------------------------------- */}

                            <Select
                                label="Product Form *"
                                error={errors.medicine_type}
                                value={data.medicine_type}
                                onChange={(e) =>
                                    setData(
                                        'medicine_type',
                                        e.target.value,
                                    )
                                }
                            >
                                {MEDICINE_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Select>
                        </FormSection>

                        {/* -----------------------------------------------------
                            Classification
                        ----------------------------------------------------- */}

                        <FormSection title="Classification">
                            <Select
                                label="Category *"
                                error={errors.category_id}
                                value={data.category_id}
                                onChange={(e) =>
                                    setData(
                                        'category_id',
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">
                                    Select Category
                                </option>

                                {categories.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                label="Manufacturer *"
                                error={errors.manufacturer_id}
                                value={data.manufacturer_id}
                                onChange={(e) =>
                                    setData(
                                        'manufacturer_id',
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">
                                    Select Manufacturer
                                </option>

                                {manufacturers.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                label="Supplier"
                                error={errors.supplier_id}
                                value={data.supplier_id}
                                onChange={(e) =>
                                    setData(
                                        'supplier_id',
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">
                                    Select Supplier
                                </option>

                                {suppliers.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                label="Unit *"
                                error={errors.unit_id}
                                value={data.unit_id}
                                onChange={(e) =>
                                    setData(
                                        'unit_id',
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">
                                    Select Unit
                                </option>

                                {units.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                label="Status"
                                error={errors.is_active}
                                value={data.is_active ? '1' : '0'}
                                onChange={(e) =>
                                    setData(
                                        'is_active',
                                        e.target.value === '1',
                                    )
                                }
                            >
                                <option value="1">
                                    Active
                                </option>

                                <option value="0">
                                    Inactive
                                </option>
                            </Select>
                        </FormSection>

                        {/* -----------------------------------------------------
                            Pricing & Stock
                        ----------------------------------------------------- */}

                        <FormSection title="Pricing & Stock">
                            <Input
                                label="Purchase Price *"
                                error={errors.purchase_price}
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.purchase_price}
                                onChange={(e) =>
                                    setData(
                                        'purchase_price',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Selling Price *"
                                error={errors.selling_price}
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.selling_price}
                                onChange={(e) =>
                                    setData(
                                        'selling_price',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Tax %"
                                error={errors.tax_percentage}
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={data.tax_percentage}
                                onChange={(e) =>
                                    setData(
                                        'tax_percentage',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Stock Quantity *"
                                error={errors.stock_quantity}
                                type="number"
                                min="0"
                                step="1"
                                value={data.stock_quantity}
                                onChange={(e) =>
                                    setData(
                                        'stock_quantity',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Minimum Stock *"
                                error={errors.minimum_stock}
                                type="number"
                                min="0"
                                step="1"
                                value={data.minimum_stock}
                                onChange={(e) =>
                                    setData(
                                        'minimum_stock',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Batch Number"
                                error={errors.batch_number}
                                value={data.batch_number}
                                onChange={(e) =>
                                    setData(
                                        'batch_number',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Expiry Date"
                                error={errors.expiry_date}
                                type="date"
                                value={data.expiry_date || ''}
                                onChange={(e) =>
                                    setData(
                                        'expiry_date',
                                        e.target.value,
                                    )
                                }
                            />
                        </FormSection>

                        {/* -----------------------------------------------------
                            Serialization
                        ----------------------------------------------------- */}

                        <FormSection title="Serialization">
                            <div className="md:col-span-2 xl:col-span-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
                                    <label className="flex cursor-pointer items-start gap-4">
                                        <input
                                            type="checkbox"
                                            checked={
                                                data.is_serialized
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'is_serialized',
                                                    e.target.checked,
                                                )
                                            }
                                            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />

                                        <div>
                                            <h3 className="font-black text-slate-900 dark:text-white">
                                                Serialized Product
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                Keep this setting available
                                                for future Saudi RSD
                                                traceability. Do not enable
                                                it unless the product is
                                                actually supplied with unique
                                                serial numbers.
                                            </p>
                                        </div>
                                    </label>

                                    {errors.is_serialized && (
                                        <p className="mt-2 text-sm font-bold text-red-600">
                                            {errors.is_serialized}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </FormSection>

                        {/* -----------------------------------------------------
                            Description
                        ----------------------------------------------------- */}

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                                Description
                            </label>

                            <textarea
                                rows="5"
                                className="input"
                                placeholder="Write product description..."
                                value={data.description}
                                onChange={(e) =>
                                    setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                            />

                            {errors.description && (
                                <p className="mt-2 text-sm font-bold text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* -----------------------------------------------------
                            Product Image
                        ----------------------------------------------------- */}

                        <div>
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-colors dark:border-slate-700 dark:bg-slate-800/50">
                                <ImagePlus
                                    className="mx-auto text-slate-400 dark:text-slate-500"
                                    size={42}
                                />

                                <h3 className="mt-3 text-xl font-black text-slate-800 dark:text-white">
                                    Product Image *
                                </h3>

                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Product photo is required. JPG, JPEG,
                                    PNG or WEBP, maximum size: 5 MB.
                                </p>

                                {imagePreview && (
                                    <div className="relative mx-auto mt-6 w-fit">
                                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">
                                            <img
                                                src={imagePreview}
                                                alt="Product preview"
                                                className="h-52 w-52 object-contain"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -right-3 -top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                                            title="Remove image"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}

                                <div className="mt-6">
                                    <label
                                        htmlFor="product-image"
                                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800"
                                    >
                                        <ImagePlus size={21} />

                                        {imagePreview
                                            ? 'Change Product Photo'
                                            : 'Choose Product Photo'}
                                    </label>

                                    <input
                                        id="product-image"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>

                                {errors.image && (
                                    <p className="mt-3 text-sm font-bold text-red-600">
                                        {errors.image}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* -----------------------------------------------------
                            Actions
                        ----------------------------------------------------- */}

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 dark:border-slate-700 sm:flex-row sm:justify-end">
                            <Link
                                href={route('medicines.index')}
                                className="rounded-2xl border border-slate-200 px-7 py-4 text-center font-black text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={20} />

                                {processing
                                    ? 'Saving...'
                                    : 'Save Product'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}

/*
|--------------------------------------------------------------------------
| Product Form Options
|--------------------------------------------------------------------------
*/

const MEDICINE_TYPES = [
    // Medicines
    'Tablet',
    'Capsule',
    'Syrup',
    'Injection',
    'Drops',
    'Cream',
    'Ointment',
    'Gel',
    'Powder',
    'Spray',
    'Inhaler',
    'Patch',
    'Suppository',

    // Personal Care
    'Soap',
    'Shampoo',
    'Conditioner',
    'Face Wash',
    'Body Wash',
    'Lotion',
    'Oil',
    'Toothpaste',
    'Mouthwash',

    // Baby Care
    'Baby Formula',
    'Diaper',
    'Baby Wipes',

    // Devices
    'Medical Device',

    // Nutrition
    'Supplement',

    // General
    'Cosmetic',
    'Other',
];

/*
|--------------------------------------------------------------------------
| Form Section
|--------------------------------------------------------------------------
*/

function FormSection({ title, children }) {
    return (
        <div>
            <h2 className="mb-4 text-xl font-black text-slate-950 dark:text-white">
                {title}
            </h2>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {children}
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
*/

function Input({ label, error, ...props }) {
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
                <p className="mt-2 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Select
|--------------------------------------------------------------------------
*/

function Select({ label, children, error, ...props }) {
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
                <p className="mt-2 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}