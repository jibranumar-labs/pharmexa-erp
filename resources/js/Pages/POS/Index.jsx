import axios from "axios";
import AppLayout from "@/Layouts/AppLayout";
import DosagePanel from "./DosagePanel";
import CheckoutPanel from "./CheckoutPanel";
import SaleSuccessModal from "./SaleSuccessModal";

import { Head, router, usePage } from "@inertiajs/react";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Barcode,
    Minus,
    Plus,
    Search,
    ShoppingCart,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
} from "lucide-react";

export default function Index({
    medicines = [],
    customers = [],
}) {
    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);

    // Keeps the exact product that was just scanned/selected visible
    // even after the scanner input is cleared.
    const [scannedProducts, setScannedProducts] = useState([]);

    // Used when a barcode lookup returns a product that is not in the
    // initially loaded medicines array.
    const [remoteMedicine, setRemoteMedicine] = useState(null);

    const { flash } = usePage().props;

    const [showSuccessModal, setShowSuccessModal] = useState(
        Boolean(flash?.sale)
    );

    const [completedSale, setCompletedSale] = useState(
        flash?.sale ?? null
    );

    const barcodeInputRef = useRef(null);
    const scannerTimerRef = useRef(null);
    const scannerProcessingRef = useRef(false);

    /*
    |--------------------------------------------------------------------------
    | Products Visibility
    |--------------------------------------------------------------------------
    */

    const [showProducts, setShowProducts] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const ITEMS_PER_PAGE = 24;

    const [currentPage, setCurrentPage] = useState(1);

    /*
    |--------------------------------------------------------------------------
    | Prevent duplicate automatic add
    |--------------------------------------------------------------------------
    */

    const lastAutoAddedValue = useRef("");

    /*
    |--------------------------------------------------------------------------
    | Beep
    |--------------------------------------------------------------------------
    */

    const beep = () => {
        const audio = new Audio("/sounds/allow.mp3");

        audio.volume = 1;

        audio.play().catch((error) => {
            console.error("Unable to play beep:", error);
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Focus Scanner / Search
    |--------------------------------------------------------------------------
    */

    const focusSearch = (delay = 50, selectText = false) => {
        setTimeout(() => {
            const input = barcodeInputRef.current;
            input?.focus();
            if (selectText) {
                input?.select();
            }
        }, delay);
    };

    /*
    |--------------------------------------------------------------------------
    | Search Helpers
    |--------------------------------------------------------------------------
    */

    const normalizeSearchValue = (value) =>
        String(value ?? "")
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();

    const getMedicineGtin = (medicine) =>
        medicine?.gtin ??
        medicine?.gtin_number ??
        medicine?.gtin_code ??
        medicine?.GTIN ??
        "";

    /*
    |--------------------------------------------------------------------------
    | Filter Products
    |--------------------------------------------------------------------------
    |
    | Search supports:
    | - Product name
    | - SKU
    | - Barcode
    | - GTIN
    |
    */

    const filteredMedicines = useMemo(() => {
        const keyword = normalizeSearchValue(search);

        if (!keyword) {
            return medicines;
        }

        return medicines.filter((medicine) => {
            const name = normalizeSearchValue(
                medicine.name
            );

            const barcode = normalizeSearchValue(
                medicine.barcode
            );

            const sku = normalizeSearchValue(
                medicine.sku
            );

            const gtin = normalizeSearchValue(
                getMedicineGtin(medicine)
            );

            return (
                name.includes(keyword) ||
                barcode.includes(keyword) ||
                sku.includes(keyword) ||
                gtin.includes(keyword)
            );
        });
    }, [medicines, search]);

    /*
    |--------------------------------------------------------------------------
    | Pagination Calculations
    |--------------------------------------------------------------------------
    */

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredMedicines.length /
                ITEMS_PER_PAGE
        )
    );

    const paginatedMedicines = useMemo(() => {
        const startIndex =
            (currentPage - 1) *
            ITEMS_PER_PAGE;

        return filteredMedicines.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
        );
    }, [
        filteredMedicines,
        currentPage,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Product display list
    |--------------------------------------------------------------------------
    |
    | If the backend finds a product that was not included in the initial
    | medicines prop, still show that product immediately after the search.
    |--------------------------------------------------------------------------
    */

    const displayedMedicines = useMemo(() => {
        // POS scanner mode: show every UNIQUE product scanned during the
        // current sale. Never fall back to the complete medicine catalogue.
        if (!showProducts && !search.trim() && scannedProducts.length > 0) {
            return scannedProducts;
        }

        // Explicit "Show Products" mode: show the normal catalogue.
        if (showProducts) {
            return paginatedMedicines;
        }

        // Manual searching is still allowed while the catalogue is hidden.
        if (search.trim()) {
            if (paginatedMedicines.length > 0) {
                return paginatedMedicines;
            }

            return remoteMedicine ? [remoteMedicine] : [];
        }

        return [];
    }, [
        search,
        showProducts,
        paginatedMedicines,
        scannedProducts,
        remoteMedicine,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Keep page valid
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [
        currentPage,
        totalPages,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Reset pagination when searching
    |--------------------------------------------------------------------------
    */

    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
        setRemoteMedicine(null);

        // Typing a new search temporarily switches the product area to search results.
        // Keep scannedProducts intact so the scanned products return after the
        // search is cleared.
        

        // A new value is a new search cycle.
        if (normalizeSearchValue(value) !== lastAutoAddedValue.current) {
            lastAutoAddedValue.current = "";
        }
    };

    /*
    |--------------------------------------------------------------------------
    | POS Totals
    |--------------------------------------------------------------------------
    |
    | Selling price is before VAT.
    | Customer total = subtotal + VAT.
    |
    */

    const subtotal = useMemo(() => {
        return cart.reduce(
            (sum, item) => {
                return (
                    sum +
                    Number(
                        item.selling_price || 0
                    ) *
                        Number(
                            item.quantity || 0
                        )
                );
            },
            0
        );
    }, [cart]);

    const tax = useMemo(() => {
        return cart.reduce(
            (sum, item) => {
                const price = Number(
                    item.selling_price || 0
                );

                const quantity = Number(
                    item.quantity || 0
                );

                const taxPercentage = Number(
                    item.tax_percentage || 0
                );

                return (
                    sum +
                    price *
                        quantity *
                        (taxPercentage / 100)
                );
            },
            0
        );
    }, [cart]);

    const total = useMemo(() => {
        return subtotal + tax;
    }, [subtotal, tax]);

    /*
    |--------------------------------------------------------------------------
    | Add Product To Cart
    |--------------------------------------------------------------------------
    */

    const addToCart = (medicine) => {
        if (
            Number(
                medicine.stock_quantity || 0
            ) <= 0
        ) {
            alert(
                "This product is out of stock."
            );

            return;
        }

        // Keep every product scanned/added during this sale visible in the
        // POS product area. Do not replace the previous scanned product.
        setScannedProducts((current) => {
            const exists = current.some((item) => item.id === medicine.id);
            return exists ? current : [...current, medicine];
        });
        setRemoteMedicine(medicine);

        setCart((current) => {
            const existing = current.find(
                (item) =>
                    item.id === medicine.id
            );

            /*
            |--------------------------------------------------------------------------
            | Already in cart
            |--------------------------------------------------------------------------
            */

            if (existing) {
                if (
                    existing.quantity >=
                    Number(
                        medicine.stock_quantity ||
                            0
                    )
                ) {
                    alert(
                        "Not enough stock available."
                    );

                    return current;
                }

                return current.map(
                    (item) =>
                        item.id === medicine.id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity +
                                      1,
                              }
                            : item
                );
            }

            /*
            |--------------------------------------------------------------------------
            | New cart item
            |--------------------------------------------------------------------------
            */

            return [
                ...current,
                {
                    ...medicine,
                    gtin: getMedicineGtin(medicine),

                    quantity: 1,

                    dosage: "",
                    time: "",
                    food: "",
                    duration: "",
                    notes: "",
                },
            ];
        });

        beep();
    };

    /*
    |--------------------------------------------------------------------------
    | Find Product Locally
    |--------------------------------------------------------------------------
    |
    | Exact matching:
    | - Name
    | - Barcode
    | - GTIN
    | - SKU
    |
    */

    const findExactMedicine = (value) => {
        const keyword = normalizeSearchValue(value);

        if (!keyword) {
            return null;
        }

        return (
            medicines.find((medicine) => {
                const name = normalizeSearchValue(
                    medicine.name
                );
                const barcode = normalizeSearchValue(
                    medicine.barcode
                );
                const gtin = normalizeSearchValue(
                    getMedicineGtin(medicine)
                );
                const sku = normalizeSearchValue(
                    medicine.sku
                );

                return (
                    name === keyword ||
                    barcode === keyword ||
                    gtin === keyword ||
                    sku === keyword
                );
            }) || null
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Barcode / GTIN / Product Search
    |--------------------------------------------------------------------------
    */

    const extractGTINFromGS1 = (value) => {
        const raw = String(value ?? "")
            .replace(/[\r\n]/g, "")
            .trim();

        if (!raw) return "";

        // GS1 with parentheses: (01)06285128000307...
        const parenthesized = raw.match(/\(01\)\s*(\d{14})/);
        if (parenthesized) {
            return parenthesized[1];
        }

        // GS1 scanner data with a group separator before AI 01.
        const separatorMatch = raw.match(/(?:^|\x1D)01(\d{14})/);
        if (separatorMatch) {
            return separatorMatch[1];
        }

        // Common GS1 DataMatrix/2D scanner output:
        // 01 + 14-digit GTIN + lot/expiry/serial information.
        if (/^01\d{14}/.test(raw)) {
            return raw.substring(2, 16);
        }

        // Ordinary barcode / GTIN.
        return raw;
    };

    const finishSuccessfulScan = (medicine) => {
        // Scanning another product adds it to the same sale instead of replacing
        // the product card from the previous scan.
        setShowProducts(false);
        setSearch("");
        setCurrentPage(1);
        lastAutoAddedValue.current = "";
        addToCart(medicine);
        focusSearch(100);
    };

    const handleBarcodeSearch = (value) => {
        handleSearchChange(value);

        // Some USB/Bluetooth scanners are configured without an Enter suffix.
        // Detect numeric GS1/barcode input and process it after the scanner stops
        // sending characters. Manual product-name searching remains normal.
        if (scannerTimerRef.current) {
            window.clearTimeout(scannerTimerRef.current);
        }

        const raw = String(value ?? "").trim();
        const looksLikeGS1 = /^01\d{14}/.test(raw);
        const looksLikeNumericBarcode = /^\d{8,}$/.test(raw);

        if (raw && (looksLikeGS1 || looksLikeNumericBarcode)) {
            scannerTimerRef.current = window.setTimeout(() => {
                if (!scannerProcessingRef.current) {
                    handleBarcodeEnter(raw);
                }
            }, looksLikeGS1 ? 180 : 300);
        }
    };

    const handleBarcodeEnter = async (inputValue = search) => {
        const rawValue = String(inputValue ?? "").trim();

        if (!rawValue || scannerProcessingRef.current) {
            return;
        }

        if (scannerTimerRef.current) {
            window.clearTimeout(scannerTimerRef.current);
            scannerTimerRef.current = null;
        }

        // Prevent a normal GTIN/barcode from being added twice when the
        // automatic exact-match timer and the scanner timer overlap.
        const normalizedRawValue = normalizeSearchValue(rawValue);
        if (lastAutoAddedValue.current === normalizedRawValue) {
            setSearch("");
            setShowProducts(false);
            focusSearch(50);
            return;
        }

        scannerProcessingRef.current = true;

        const value = extractGTINFromGS1(rawValue);

        try {
            /*
            |--------------------------------------------------------------------------
            | Exact local match
            |--------------------------------------------------------------------------
            */
            const exactMedicine = findExactMedicine(value) || findExactMedicine(rawValue);

            if (exactMedicine) {
                finishSuccessfulScan(exactMedicine);
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Partial text search
            |--------------------------------------------------------------------------
            */
            if (!/^\d+$/.test(rawValue) && filteredMedicines.length > 0) {
                focusSearch(50, true);
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Backend barcode / GTIN lookup
            |--------------------------------------------------------------------------
            | Send both the extracted GTIN and the original scanner value.
            | The backend receives the clean GTIN in `barcode`, while the original
            | value remains available as `raw_barcode` if the controller supports it.
            */
            const { data } = await axios.post(
                route("medicines.search-barcode"),
                {
                    barcode: value,
                    gtin: value,
                    raw_barcode: rawValue,
                }
            );

            if (!data?.found || !data?.medicine) {
                alert("Product not found.");
                setSearch("");
                setRemoteMedicine(null);
                lastAutoAddedValue.current = "";
                focusSearch(80);
                return;
            }

            finishSuccessfulScan(data.medicine);
        } catch (error) {
            console.error("Product scan/search failed:", error);

            alert(
                error.response?.data?.message ||
                    "Unable to search for this product."
            );

            setSearch("");
            focusSearch(100);
        } finally {
            scannerProcessingRef.current = false;
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Automatic exact product detection
    |--------------------------------------------------------------------------
    |
    | Exact product names / SKU / barcode / GTIN typed into the POS are
    | automatically added after a short pause. Partial searches remain
    | normal search results.
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const value = search.trim();

        if (!value) {
            return;
        }

        const exactMedicine = findExactMedicine(value);

        if (!exactMedicine) {
            return;
        }

        const normalizedValue = normalizeSearchValue(value);

        if (lastAutoAddedValue.current === normalizedValue) {
            return;
        }

        const timer = window.setTimeout(() => {
            addToCart(exactMedicine);
            lastAutoAddedValue.current = normalizedValue;

            // Clear the POS input after successful automatic add.
            setSearch("");
            setCurrentPage(1);
            focusSearch(80);
        }, 250);

        return () => window.clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        return () => {
            if (scannerTimerRef.current) {
                window.clearTimeout(scannerTimerRef.current);
            }
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Scanner behavior
    |--------------------------------------------------------------------------
    |
    | Product lookup is intentionally performed on Enter. USB/Bluetooth
    | barcode scanners normally send the barcode followed by Enter.
    | This avoids React onChange race conditions while the scanner is still
    | typing a long GS1/DataMatrix value.
    |
    | Successful scans clear `search` and `scannedProducts` keeps the
    | actual product visible in the POS product area.
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Quantity +1
    |--------------------------------------------------------------------------
    */

    const increaseQty = (id) => {
        setCart((current) =>
            current.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                if (
                    item.quantity >=
                    Number(
                        item.stock_quantity ||
                            0
                    )
                ) {
                    alert(
                        "Not enough stock available."
                    );

                    return item;
                }

                beep();

                return {
                    ...item,
                    quantity:
                        item.quantity + 1,
                };
            })
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Quantity -1
    |--------------------------------------------------------------------------
    */

    const decreaseQty = (id) => {
        setCart((current) =>
            current
                .map((item) => {
                    if (item.id !== id) {
                        return item;
                    }

                    return {
                        ...item,
                        quantity:
                            item.quantity - 1,
                    };
                })
                .filter(
                    (item) =>
                        item.quantity > 0
                )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Cart Item
    |--------------------------------------------------------------------------
    */

    const removeItem = (id) => {
        setCart((current) =>
            current.filter(
                (item) =>
                    item.id !== id
            )
        );

        // Start a fresh scanner cycle when an item is removed.
        lastAutoAddedValue.current = "";

        if (scannerTimerRef.current) {
            window.clearTimeout(scannerTimerRef.current);
            scannerTimerRef.current = null;
        }

        scannerProcessingRef.current = false;

        setSearch("");
        setRemoteMedicine(null);
        setScannedProducts([]);
        setCurrentPage(1);

        focusSearch(80);
    };

    /*
    |--------------------------------------------------------------------------
    | Reset Scanner When Cart Becomes Empty
    |--------------------------------------------------------------------------
    |
    | When the last cart item is removed, reset all scanner state so the
    | next barcode can be scanned immediately without refreshing the page.
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        if (cart.length !== 0) {
            return;
        }

        lastAutoAddedValue.current = "";

        if (scannerTimerRef.current) {
            window.clearTimeout(scannerTimerRef.current);
            scannerTimerRef.current = null;
        }

        scannerProcessingRef.current = false;

        const timer = window.setTimeout(() => {
            barcodeInputRef.current?.focus();
        }, 80);

        return () => window.clearTimeout(timer);
    }, [cart.length]);

    /*
    |--------------------------------------------------------------------------
    | Dosage
    |--------------------------------------------------------------------------
    */

    const updateDosage = (
        id,
        field,
        value
    ) => {
        setCart((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          [field]:
                              value,
                      }
                    : item
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Complete Sale
    |--------------------------------------------------------------------------
    */

    const completeSale = ({
        customerType,
        customerId,
        paymentMethod,
        paid_amount,
    }) => {
        if (!cart.length) {
            alert(
                "Cart is empty."
            );

            return;
        }

        router.post(
            route("pos.store"),
            {
                customer_id:
                    customerType ===
                    "registered"
                        ? customerId
                        : null,

                customer_name:
                    customerType ===
                    "walkin"
                        ? "Walk-in Customer"
                        : null,

                customer_phone: "",

                payment_method:
                    paymentMethod,

                paid_amount:
                    paid_amount,

                items: cart.map(
                    (item) => ({
                        id: item.id,

                        quantity:
                            item.quantity,

                        dosage:
                            item.dosage,

                        time:
                            item.time,

                        food:
                            item.food,

                        duration:
                            item.duration,

                        notes:
                            item.notes,
                    })
                ),
            },
            {
                preserveScroll: true,

                onSuccess: (page) => {
                    /*
                    |--------------------------------------------------------------------------
                    | Sale Success Modal
                    |--------------------------------------------------------------------------
                    */

                    if (
                        page.props.flash
                            ?.sale
                    ) {
                        setCompletedSale(
                            page.props.flash
                                .sale
                        );

                        setShowSuccessModal(
                            true
                        );
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Clear POS
                    |--------------------------------------------------------------------------
                    */

                    setCart([]);

                    setSearch("");
                    setRemoteMedicine(null);
                    setScannedProducts([]);
                    lastAutoAddedValue.current = "";

                    setCurrentPage(1);

                    beep();

                    /*
                    |--------------------------------------------------------------------------
                    | Refresh Inventory
                    |--------------------------------------------------------------------------
                    */

                    router.reload({
                        only: [
                            "medicines",
                            "customers",
                        ],

                        preserveScroll:
                            true,

                        preserveState:
                            true,
                    });

                    focusSearch(200);
                },

                onError: (errors) => {
                    console.error(
                        errors
                    );

                    alert(
                        "Unable to complete the sale."
                    );

                    focusSearch(100);
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Pagination Controls
    |--------------------------------------------------------------------------
    */

    const goToPreviousPage = () => {
        setCurrentPage(
            (page) =>
                Math.max(
                    1,
                    page - 1
                )
        );

        focusSearch(50);
    };

    const goToNextPage = () => {
        setCurrentPage(
            (page) =>
                Math.min(
                    totalPages,
                    page + 1
                )
        );

        focusSearch(50);
    };

    /*
    |--------------------------------------------------------------------------
    | Page Range
    |--------------------------------------------------------------------------
    */

    const pageStart =
        filteredMedicines.length === 0
            ? 0
            : (currentPage - 1) *
                  ITEMS_PER_PAGE +
              1;

    const pageEnd = Math.min(
        currentPage *
            ITEMS_PER_PAGE,
        filteredMedicines.length
    );

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <AppLayout title="POS">
            <Head title="POS | Pharmexa" />

            <div className="space-y-6">

                {/* =========================================================
                    POS HEADER
                ========================================================== */}

                <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-8 text-white shadow-2xl">

                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                        <div>

                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">

                                <Barcode size={16} />

                                POS Ready

                            </div>

                            <h1 className="text-4xl font-black lg:text-5xl">
                                Point Of Sale
                            </h1>

                            <p className="mt-2 text-white/90">
                                Search or scan a product to add it to the cart and complete the sale quickly.
                            </p>

                        </div>

                        <div className="rounded-3xl border border-white/20 bg-white/15 p-5 text-center backdrop-blur">

                            <p className="text-sm font-bold">
                                Cart Total
                            </p>

                            <p className="mt-2 text-3xl font-black">
                                {total.toFixed(2)} SAR
                            </p>

                        </div>

                    </div>

                </section>

                {/* =========================================================
                    MAIN POS
                ========================================================== */}

                <section className="grid gap-6 xl:grid-cols-3">

                    {/* =====================================================
                        PRODUCTS
                    ====================================================== */}

                    <div className="rounded-[2rem] bg-white p-6 shadow-sm transition-colors dark:bg-slate-900 xl:col-span-2">

                        {/* Header */}

                        <div className="mb-5 flex items-center justify-between gap-4">

                            <div>

                                <h2 className="text-2xl font-black">
                                    POS Scanner
                                </h2>

                                <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                                    Scan or search a medicine to add it to the cart.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowProducts((value) => {
                                        const next = !value;

                                        if (next) {
                                            // Explicitly showing products returns to the full product list.
                                            setScannedProducts([]);
                                            setRemoteMedicine(null);
                                            setSearch("");
                                            setCurrentPage(1);
                                        }

                                        return next;
                                    });

                                    focusSearch(50);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-black transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                            >
                                {showProducts ? (
                                    <>
                                        <EyeOff
                                            size={18}
                                        />
                                        Hide Products
                                    </>
                                ) : (
                                    <>
                                        <Eye
                                            size={18}
                                        />
                                        Show Products
                                    </>
                                )}
                            </button>

                        </div>

                        {/* =================================================
                            SEARCH
                        ================================================== */}

                        <div className="relative mb-6">

                            <Search
                                size={20}
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                ref={
                                    barcodeInputRef
                                }
                                autoFocus
                                type="text"
                                placeholder="Search product name, barcode, GTIN or SKU..."
                                value={search}
                                onChange={(e) =>
                                    handleBarcodeSearch(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key ===
                                        "Enter"
                                    ) {
                                        e.preventDefault();

                                        handleBarcodeEnter();
                                    }
                                }}
                                className="w-full rounded-2xl border border-emerald-300 bg-white p-5 pl-14 text-lg font-bold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900"
                            />

                        </div>

                        {/* =================================================
                            PRODUCTS
                        ================================================== */}

                        {(showProducts || search.trim() || scannedProducts.length > 0) && (
                            <>
                                {displayedMedicines.length ? (
                                    <div className="grid gap-4 md:grid-cols-2">

                                        {displayedMedicines.map(
                                            (
                                                medicine
                                            ) => {
                                                const inCart =
                                                    cart.find(
                                                        (
                                                            item
                                                        ) =>
                                                            item.id ===
                                                            medicine.id
                                                    );

                                                const sellingPrice =
                                                    Number(
                                                        medicine.selling_price ||
                                                            0
                                                    );

                                                const taxPercentage =
                                                    Number(
                                                        medicine.tax_percentage ||
                                                            0
                                                    );

                                                const vatAmount =
                                                    sellingPrice *
                                                    (taxPercentage /
                                                        100);

                                                const customerPrice =
                                                    sellingPrice +
                                                    vatAmount;

                                                return (
                                                    <div
                                                        key={
                                                            medicine.id
                                                        }
                                                        className={`group rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-xl ${
                                                            inCart
                                                                ? "border-emerald-300 bg-emerald-50/40"
                                                                : "border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                                                        }`}
                                                    >

                                                        <h3 className="line-clamp-2 font-black text-slate-950 dark:text-white">
                                                            {
                                                                medicine.name
                                                            }
                                                        </h3>

                                                        <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                                                            SKU:{" "}
                                                            {medicine.sku ||
                                                                "-"}
                                                        </p>

                                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                                            GTIN:{" "}
                                                            {medicine.gtin ||
                                                                "-"}
                                                        </p>

                                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                                            Barcode:{" "}
                                                            {medicine.barcode ||
                                                                "-"}
                                                        </p>

                                                        <div className="mt-4 flex items-end justify-between gap-3">

                                                            <div>

                                                                <p
                                                                    className={`text-sm font-bold ${
                                                                        Number(
                                                                            medicine.stock_quantity
                                                                        ) <=
                                                                        5
                                                                            ? "text-red-600"
                                                                            : "text-slate-500 dark:text-slate-400"
                                                                    }`}
                                                                >
                                                                    Stock:{" "}
                                                                    {
                                                                        medicine.stock_quantity
                                                                    }
                                                                </p>

                                                                <p className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">
                                                                    {customerPrice.toFixed(
                                                                        2
                                                                    )}{" "}
                                                                    SAR
                                                                </p>

                                                                <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">

                                                                    {taxPercentage >
                                                                    0
                                                                        ? `${sellingPrice.toFixed(
                                                                              2
                                                                          )} SAR + ${taxPercentage}% VAT`
                                                                        : "VAT 0%"}

                                                                </p>

                                                            </div>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    Number(
                                                                        medicine.stock_quantity ||
                                                                            0
                                                                    ) <=
                                                                    0
                                                                }
                                                                onClick={() =>
                                                                    addToCart(
                                                                        medicine
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >

                                                                <ShoppingCart
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                                Add

                                                            </button>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">

                                        <Search
                                            size={42}
                                            className="mx-auto text-slate-400"
                                        />

                                        <p className="mt-4 text-xl font-black">
                                            No product found
                                        </p>

                                        <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                                            Try product name, SKU, barcode or GTIN.
                                        </p>

                                    </div>
                                )}

                                {/* =================================================
                                    PAGINATION
                                ================================================== */}

                                {filteredMedicines.length >
                                    ITEMS_PER_PAGE && (
                                    <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="text-sm font-bold text-slate-500 dark:text-slate-400">

                                            Showing{" "}
                                            <span className="text-slate-900 dark:text-white">
                                                {pageStart}
                                            </span>{" "}
                                            -{" "}
                                            <span className="text-slate-900 dark:text-white">
                                                {pageEnd}
                                            </span>{" "}
                                            of{" "}
                                            <span className="text-slate-900 dark:text-white">
                                                {
                                                    filteredMedicines.length
                                                }
                                            </span>{" "}
                                            products

                                        </div>

                                        <div className="flex items-center gap-2">

                                            <button
                                                type="button"
                                                onClick={
                                                    goToPreviousPage
                                                }
                                                disabled={
                                                    currentPage ===
                                                    1
                                                }
                                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                                            >
                                                <ChevronLeft
                                                    size={
                                                        17
                                                    }
                                                />
                                                Previous
                                            </button>

                                            <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black dark:bg-slate-800">
                                                Page{" "}
                                                {
                                                    currentPage
                                                }{" "}
                                                of{" "}
                                                {
                                                    totalPages
                                                }
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    goToNextPage
                                                }
                                                disabled={
                                                    currentPage ===
                                                    totalPages
                                                }
                                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                                            >
                                                Next
                                                <ChevronRight
                                                    size={
                                                        17
                                                    }
                                                />
                                            </button>

                                        </div>

                                    </div>
                                )}
                            </>
                        )}

                    </div>

                    {/* =====================================================
                        CART
                    ====================================================== */}

                    <div className="rounded-[2rem] bg-white p-6 shadow-sm transition-colors dark:bg-slate-900">

                        <div className="mb-5 flex items-center justify-between">

                            <h2 className="text-2xl font-black">
                                Cart
                            </h2>

                            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                {cart.length} Items
                            </span>

                        </div>

                        {cart.length ? (
                            <div className="space-y-4">

                                {cart.map(
                                    (item) => (
                                        <div
                                            key={
                                                item.id
                                            }
                                            className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
                                        >

                                            {/* Product information */}

                                            <div className="flex justify-between gap-3">

                                                <div>

                                                    <h3 className="line-clamp-2 font-black text-slate-950 dark:text-white">
                                                        {
                                                            item.name
                                                        }
                                                    </h3>

                                                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                                                        {
                                                            item.selling_price
                                                        }{" "}
                                                        SAR each
                                                    </p>

                                                    {/* GTIN */}

                                                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                                                        GTIN:{" "}
                                                        <span className="text-slate-700 dark:text-slate-300">
                                                            {
                                                                item.gtin ||
                                                                "-"
                                                            }
                                                        </span>
                                                    </p>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(
                                                            item.id
                                                        )
                                                    }
                                                    className="h-fit text-red-500 transition hover:text-red-700"
                                                >
                                                    <Trash2
                                                        size={
                                                            19
                                                        }
                                                    />
                                                </button>

                                            </div>

                                            {/* Quantity */}

                                            <div className="mt-4 flex items-center justify-between">

                                                <div className="flex items-center gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            decreaseQty(
                                                                item.id
                                                            )
                                                        }
                                                        className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                                                    >
                                                        <Minus
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                    <span className="min-w-8 text-center font-black">
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            increaseQty(
                                                                item.id
                                                            )
                                                        }
                                                        className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                                                    >
                                                        <Plus
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                </div>

                                                <p className="font-black text-emerald-600 dark:text-emerald-400">

                                                    {(
                                                        Number(
                                                            item.selling_price ||
                                                                0
                                                        ) *
                                                        Number(
                                                            item.quantity ||
                                                                0
                                                        )
                                                    ).toFixed(
                                                        2
                                                    )}{" "}
                                                    SAR

                                                </p>

                                            </div>

                                            {/* =================================================
                                                DOSAGE
                                            ================================================== */}

                                            <DosagePanel
                                                item={
                                                    item
                                                }
                                                onChange={(
                                                    field,
                                                    value
                                                ) =>
                                                    updateDosage(
                                                        item.id,
                                                        field,
                                                        value
                                                    )
                                                }
                                            />

                                        </div>
                                    )
                                )}

                                {/* =================================================
                                    CHECKOUT
                                ================================================== */}

                                <CheckoutPanel
                                    subtotal={
                                        total
                                    }
                                    customers={
                                        customers
                                    }
                                    onCompleteSale={
                                        completeSale
                                    }
                                />

                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">

                                <ShoppingCart
                                    className="mx-auto text-slate-400 dark:text-slate-500"
                                    size={42}
                                />

                                <p className="mt-4 text-xl font-black text-slate-700 dark:text-slate-200">
                                    Cart is empty
                                </p>

                                <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                                    Scan or search a medicine to start billing.
                                </p>

                            </div>
                        )}

                    </div>

                </section>

            </div>

            {/* =============================================================
                SALE SUCCESS MODAL

                IMPORTANT:
                A4 is NOT controlled from this Index.
                SaleSuccessModal should contain only:
                - Thermal Receipt
                - Dosage Stickers
            ============================================================== */}

            <SaleSuccessModal
                open={
                    showSuccessModal
                }
                sale={
                    completedSale
                }
                onClose={() => {
                    setShowSuccessModal(
                        false
                    );

                    focusSearch(100);
                }}
                onNewSale={() => {
                    setShowSuccessModal(
                        false
                    );

                    setCompletedSale(
                        null
                    );

                    setCart([]);

                    setSearch("");
                    setRemoteMedicine(null);
                    setScannedProducts([]);
                    lastAutoAddedValue.current = "";

                    setCurrentPage(1);

                    beep();

                    router.reload({
                        only: [
                            "medicines",
                            "customers",
                        ],

                        preserveScroll:
                            true,

                        preserveState:
                            true,
                    });

                    focusSearch(200);
                }}
            />

        </AppLayout>
    );
}