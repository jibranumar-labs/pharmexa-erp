import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Barcode,
    CheckCircle2,
    ImagePlus,
    Save,
    Tag,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Edit({
    medicine,
    categories = [],
    manufacturers = [],
    suppliers = [],
    units = [],
    canSubmitToGlobal = false,
    globalSubmission = null,
}) {
    /*
    |--------------------------------------------------------------------------
    | Existing Image
    |--------------------------------------------------------------------------
    */

    const resolveImageUrl = (image) => {
        if (!image) {
            return null;
        }

        const value = String(image).trim();

        if (!value) {
            return null;
        }

        if (
            value.startsWith('http://') ||
            value.startsWith('https://') ||
            value.startsWith('//')
        ) {
            return value;
        }

        if (value.startsWith('/')) {
            return value;
        }

        if (value.startsWith('storage/')) {
            return `/${value}`;
        }

        return `/storage/${value}`;
    };

    const existingImageUrl = resolveImageUrl(medicine?.image);

    const [imagePreview, setImagePreview] = useState(
        existingImageUrl,
    );

    const fileInputRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | Medicine Form
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | We use POST + _method=PUT because Laravel/PHP handles multipart
    | file uploads more reliably this way.
    |
    | Laravel receives:
    |
    | POST /medicines/{id}
    | _method=PUT
    |
    | and routes it to:
    |
    | PUT /medicines/{id}
    |
    |--------------------------------------------------------------------------
    */

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        _method: 'PUT',

        /*
        |--------------------------------------------------------------------------
        | Basic Information
        |--------------------------------------------------------------------------
        */

        name: medicine?.name ?? '',
        generic_name: medicine?.generic_name ?? '',
        brand_name: medicine?.brand_name ?? '',

        /*
        |--------------------------------------------------------------------------
        | Product Identity
        |--------------------------------------------------------------------------
        */

        // Barcode is OPTIONAL.
        barcode: medicine?.barcode ?? '',

        // GTIN is the primary product identifier.
        gtin: medicine?.gtin ?? '',

        // Existing SKU remains editable.
        sku: medicine?.sku ?? '',

        medicine_type: medicine?.medicine_type ?? 'Tablet',

        /*
        |--------------------------------------------------------------------------
        | Classification
        |--------------------------------------------------------------------------
        */

        category_id: medicine?.category_id ?? '',
        manufacturer_id: medicine?.manufacturer_id ?? '',
        supplier_id: medicine?.supplier_id ?? '',
        unit_id: medicine?.unit_id ?? '',

        /*
        |--------------------------------------------------------------------------
        | Pricing
        |--------------------------------------------------------------------------
        */

        purchase_price: medicine?.purchase_price ?? '',
        selling_price: medicine?.selling_price ?? '',

        // Pharmacy/product discount.
        discount_percentage:
            medicine?.discount_percentage ?? 0,

        tax_percentage: medicine?.tax_percentage ?? 0,

        /*
        |--------------------------------------------------------------------------
        | Stock
        |--------------------------------------------------------------------------
        */

        stock_quantity: medicine?.stock_quantity ?? 0,
        minimum_stock: medicine?.minimum_stock ?? 10,

        /*
        |--------------------------------------------------------------------------
        | Batch / Expiry
        |--------------------------------------------------------------------------
        */

        batch_number: medicine?.batch_number ?? '',

        expiry_date: medicine?.expiry_date
            ? String(medicine.expiry_date).substring(0, 10)
            : '',

        /*
        |--------------------------------------------------------------------------
        | Extra
        |--------------------------------------------------------------------------
        */

        description: medicine?.description ?? '',

        /*
        |--------------------------------------------------------------------------
        | Image
        |--------------------------------------------------------------------------
        */

        image: null,
        remove_image: false,

        /*
        |--------------------------------------------------------------------------
        | Serialization
        |--------------------------------------------------------------------------
        */

        is_serialized: Boolean(
            medicine?.is_serialized ?? false,
        ),

        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */

        is_active: Boolean(
            medicine?.is_active ?? true,
        ),
    });

    /*
    |--------------------------------------------------------------------------
    | Product Types
    |--------------------------------------------------------------------------
    */

    const medicineTypes = [
        'Tablet',
        'Capsule',
        'Syrup',
        'Injection',
        'Cream',
        'Drops',
        'Powder',
        'Other',
    ];

    /*
    |--------------------------------------------------------------------------
    | Discount Calculation
    |--------------------------------------------------------------------------
    */

    const sellingPrice = Number(
        data.selling_price || 0,
    );

    const discountPercentage = Math.min(
        Math.max(
            Number(data.discount_percentage || 0),
            0,
        ),
        100,
    );

    const discountAmount =
        sellingPrice * (discountPercentage / 100);

    const finalSellingPrice = Math.max(
        sellingPrice - discountAmount,
        0,
    );

    /*
    |--------------------------------------------------------------------------
    | Image Preview Synchronization
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!data.image) {
            setImagePreview(existingImageUrl);
        }
    }, [medicine?.image]);

    /*
    |--------------------------------------------------------------------------
    | Image Selection
    |--------------------------------------------------------------------------
    */

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.type)) {
            alert(
                'Please choose a JPG, JPEG, PNG or WEBP image.',
            );

            event.target.value = '';

            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert(
                'The product image must not be larger than 5 MB.',
            );

            event.target.value = '';

            return;
        }

        setData('image', file);
        setData('remove_image', false);

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Image
    |--------------------------------------------------------------------------
    */

    const removeImage = () => {
        setData('image', null);
        setData('remove_image', true);

        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const submit = (event) => {
        event.preventDefault();

        post(route('medicines.update', medicine.id), {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                setData('image', null);
                setData('remove_image', false);
            },
        });
    };

    return (
        <AppLayout title="Edit Product">
            <Head title="Edit Product | Pharmexa" />

            <div className="space-y-7">

                {/* ============================================================
                    PAGE HEADER
                ============================================================ */}

                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-7 text-white shadow-2xl lg:p-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                                <Barcode size={16} />

                                Inventory / Edit Product
                            </div>

                            <h1 className="text-4xl font-black lg:text-5xl">
                                Edit Product
                            </h1>

                            <p className="mt-3 max-w-3xl font-medium text-white/90">
                                Update product information, GTIN,
                                barcode, SKU, pricing, discount,
                                stock, supplier, batch, expiry and
                                product photo.
                            </p>
                        </div>

                        <Link
                            href={route('medicines.index')}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-5 py-3 font-black text-white backdrop-blur transition hover:bg-white hover:text-blue-700"
                        >
                            <ArrowLeft size={18} />

                            Back to Products
                        </Link>
                    </div>
                </section>

                {/* ============================================================
                    MAIN FORM
                ============================================================ */}

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:p-8">

                    {/* ========================================================
                        PRODUCT SUMMARY
                    ======================================================== */}

                    <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                    Editing Product
                                </p>

                                <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                                    {medicine?.name || 'Product'}
                                </h2>

                                <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                                    SKU:{' '}
                                    <span className="text-slate-700 dark:text-slate-200">
                                        {medicine?.sku || '—'}
                                    </span>

                                    {' • '}

                                    Barcode:{' '}
                                    <span className="text-slate-700 dark:text-slate-200">
                                        {medicine?.barcode || 'Not assigned'}
                                    </span>

                                    {' • '}

                                    GTIN:{' '}
                                    <span className="text-slate-700 dark:text-slate-200">
                                        {medicine?.gtin || 'Not assigned'}
                                    </span>
                                </p>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-black text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                                <CheckCircle2 size={17} />

                                Editing Existing Product
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-10"
                    >

                        {/* ====================================================
                            BASIC INFORMATION
                        ==================================================== */}

                        <FormSection title="Basic Information">

                            <Input
                                label="Product Name *"
                                value={data.name}
                                error={errors.name}
                                onChange={(e) =>
                                    setData(
                                        'name',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Generic Name"
                                value={data.generic_name}
                                error={errors.generic_name}
                                onChange={(e) =>
                                    setData(
                                        'generic_name',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Brand Name"
                                value={data.brand_name}
                                error={errors.brand_name}
                                onChange={(e) =>
                                    setData(
                                        'brand_name',
                                        e.target.value,
                                    )
                                }
                            />

                            {/* BARCODE OPTIONAL */}

                            <Input
                                label="Barcode (Optional)"
                                value={data.barcode}
                                error={errors.barcode}
                                placeholder="Enter barcode if available"
                                onChange={(e) =>
                                    setData(
                                        'barcode',
                                        e.target.value,
                                    )
                                }
                            />

                            {/* GTIN */}

                            <Input
                                label="GTIN"
                                value={data.gtin}
                                error={errors.gtin}
                                maxLength={14}
                                inputMode="numeric"
                                placeholder="Enter GTIN"
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

                            {/* SKU */}

                            <Input
                                label="SKU *"
                                value={data.sku}
                                error={errors.sku}
                                placeholder="Product SKU"
                                onChange={(e) =>
                                    setData(
                                        'sku',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                            />

                            <Select
                                label="Product Form *"
                                value={data.medicine_type}
                                error={errors.medicine_type}
                                onChange={(e) =>
                                    setData(
                                        'medicine_type',
                                        e.target.value,
                                    )
                                }
                            >
                                {medicineTypes.map((type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>
                                ))}
                            </Select>

                        </FormSection>

                        {/* ====================================================
                            CLASSIFICATION
                        ==================================================== */}

                        <FormSection title="Classification">

                            <Select
                                label="Category *"
                                value={data.category_id}
                                error={errors.category_id}
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
                                value={data.manufacturer_id}
                                error={errors.manufacturer_id}
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
                                value={data.supplier_id}
                                error={errors.supplier_id}
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
                                value={data.unit_id}
                                error={errors.unit_id}
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
                                value={
                                    data.is_active
                                        ? '1'
                                        : '0'
                                }
                                error={errors.is_active}
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

                        {/* ====================================================
                            PRICING & STOCK
                        ==================================================== */}

                        <FormSection title="Pricing & Stock">

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
                                        e.target.value,
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
                                        e.target.value,
                                    )
                                }
                            />

                            {/* =================================================
                                DISCOUNT
                            ================================================= */}

                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                                    <Tag size={15} />

                                    Discount %
                                </label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={
                                            data.discount_percentage
                                        }
                                        onChange={(e) => {
                                            let value =
                                                e.target.value;

                                            if (
                                                Number(value) >
                                                100
                                            ) {
                                                value = '100';
                                            }

                                            if (
                                                Number(value) <
                                                    0 &&
                                                value !== ''
                                            ) {
                                                value = '0';
                                            }

                                            setData(
                                                'discount_percentage',
                                                value,
                                            );
                                        }}
                                        placeholder="0"
                                        className="input pr-10"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                                        %
                                    </span>
                                </div>

                                {errors.discount_percentage && (
                                    <p className="mt-2 text-sm font-bold text-red-600">
                                        {
                                            errors.discount_percentage
                                        }
                                    </p>
                                )}

                                <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    Leave 0 if this product has
                                    no regular discount.
                                </p>
                            </div>

                            <Input
                                label="Tax %"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={data.tax_percentage}
                                error={errors.tax_percentage}
                                onChange={(e) =>
                                    setData(
                                        'tax_percentage',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Stock Quantity *"
                                type="number"
                                min="0"
                                step="1"
                                value={data.stock_quantity}
                                error={errors.stock_quantity}
                                onChange={(e) =>
                                    setData(
                                        'stock_quantity',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Minimum Stock *"
                                type="number"
                                min="0"
                                step="1"
                                value={data.minimum_stock}
                                error={errors.minimum_stock}
                                onChange={(e) =>
                                    setData(
                                        'minimum_stock',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Batch Number"
                                value={data.batch_number}
                                error={errors.batch_number}
                                placeholder="Enter batch number"
                                onChange={(e) =>
                                    setData(
                                        'batch_number',
                                        e.target.value,
                                    )
                                }
                            />

                            <Input
                                label="Expiry Date"
                                type="date"
                                value={data.expiry_date || ''}
                                error={errors.expiry_date}
                                onChange={(e) =>
                                    setData(
                                        'expiry_date',
                                        e.target.value,
                                    )
                                }
                            />

                        </FormSection>

                        {/* ====================================================
                            DISCOUNT PREVIEW
                        ==================================================== */}

                        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-blue-50 p-6 dark:border-emerald-900/50 dark:from-emerald-950/20 dark:to-blue-950/20">

                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                    <Tag size={19} />
                                </div>

                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white">
                                        Selling Price Preview
                                    </h3>

                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        Discount is calculated from
                                        the selling price.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">

                                <PricePreview
                                    label="Selling Price"
                                    value={`${sellingPrice.toFixed(
                                        2,
                                    )} SAR`}
                                />

                                <PricePreview
                                    label={`Discount (${discountPercentage.toFixed(
                                        2,
                                    )}%)`}
                                    value={`-${discountAmount.toFixed(
                                        2,
                                    )} SAR`}
                                />

                                <div className="rounded-2xl border border-emerald-200 bg-white p-4 dark:border-emerald-800 dark:bg-slate-900">
                                    <p className="text-xs font-black uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                                        Final Selling Price
                                    </p>

                                    <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300">
                                        {finalSellingPrice.toFixed(
                                            2,
                                        )}{' '}
                                        SAR
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* ====================================================
                            SERIALIZATION
                        ==================================================== */}

                        <FormSection title="Serialization">

                            <div className="md:col-span-2 xl:col-span-3">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/60">

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

                                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                Enable this only when
                                                the product uses unique
                                                serial numbers and needs
                                                future Saudi traceability.
                                            </p>
                                        </div>

                                    </label>

                                    {errors.is_serialized && (
                                        <p className="mt-3 text-sm font-bold text-red-600">
                                            {errors.is_serialized}
                                        </p>
                                    )}

                                </div>
                            </div>

                        </FormSection>

                        {/* ====================================================
                            DESCRIPTION
                        ==================================================== */}

                        <div>
                            <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                                Description
                            </label>

                            <textarea
                                rows={5}
                                className="input resize-y"
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

                        {/* ====================================================
                            PRODUCT IMAGE
                        ==================================================== */}

                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50">

                            <ImagePlus
                                size={42}
                                className="mx-auto text-slate-400 dark:text-slate-500"
                            />

                            <h3 className="mt-3 text-xl font-black text-slate-800 dark:text-white">
                                Product Image
                            </h3>

                            <p className="mx-auto mt-2 max-w-2xl text-sm font-medium text-slate-500 dark:text-slate-400">
                                Upload a professional product image.
                                JPG, JPEG, PNG or WEBP.
                                Maximum size: 5 MB.
                            </p>

                            {/* IMAGE PREVIEW */}

                            {imagePreview && (
                                <div className="relative mx-auto mt-6 w-fit">

                                    <div className="flex h-56 w-56 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">

                                        <img
                                            src={imagePreview}
                                            alt={
                                                medicine?.name ||
                                                'Product image'
                                            }
                                            className="h-full w-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    'none';
                                            }}
                                        />

                                    </div>

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                                        title="Remove product image"
                                    >
                                        <X size={19} />
                                    </button>

                                </div>
                            )}

                            {/* NO IMAGE */}

                            {!imagePreview && (
                                <div className="mx-auto mt-6 flex h-56 w-56 items-center justify-center rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">

                                    <div>
                                        <ImagePlus
                                            size={48}
                                            className="mx-auto text-slate-300 dark:text-slate-600"
                                        />

                                        <p className="mt-3 text-sm font-bold text-slate-400 dark:text-slate-500">
                                            No product image
                                        </p>
                                    </div>

                                </div>
                            )}

                            {/* FILE INPUT */}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="hidden"
                                onChange={handleImageChange}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 font-black text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400"
                            >
                                <ImagePlus size={20} />

                                {imagePreview
                                    ? 'Replace Product Photo'
                                    : 'Choose Product Photo'}
                            </button>

                            {data.image && (
                                <p className="mt-3 text-sm font-bold text-emerald-600">
                                    New photo selected:{' '}
                                    {data.image.name}
                                </p>
                            )}

                            {errors.image && (
                                <p className="mt-3 text-sm font-bold text-red-600">
                                    {errors.image}
                                </p>
                            )}

                        </div>

                        {/* ====================================================
                            FORM ACTIONS
                        ==================================================== */}

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-7 dark:border-slate-700 sm:flex-row sm:justify-end">

                            <Link
                                href={route('medicines.index')}
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-7 py-4 text-center font-black text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-500 px-8 py-4 font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={20} />

                                {processing
                                    ? 'Updating...'
                                    : 'Update Product'}
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
| Form Section
|--------------------------------------------------------------------------
*/

function FormSection({ title, children }) {
    return (
        <div>
            <h2 className="mb-5 text-xl font-black text-slate-950 dark:text-white">
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
| Input Component
|--------------------------------------------------------------------------
*/

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
                <p className="mt-2 text-sm font-bold text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Select Component
|--------------------------------------------------------------------------
*/

function Select({
    label,
    children,
    error,
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
                <p className="mt-2 text-sm font-bold text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Price Preview
|--------------------------------------------------------------------------
*/

function PricePreview({
    label,
    value,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                {value}
            </p>
        </div>
    );
}