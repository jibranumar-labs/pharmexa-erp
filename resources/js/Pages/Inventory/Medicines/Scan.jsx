import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    ScanLine,
    Search,
    CheckCircle2,
    AlertCircle,
    Package,
    Pencil,
    Boxes,
    Link2,
    X,
    Barcode,
    RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

/*
|--------------------------------------------------------------------------
| GS1 helpers
|--------------------------------------------------------------------------
|
| Supported examples:
|
| (01)06291103730459(17)280418(10)D711(21)GHM75D37546E1
|
| 0106291103730459213GHM75D37546E11728041810D711
|
| The backend also receives the raw scan so it can perform its own
| validation/normalisation.
|
*/

const GS = "\u001d";

const cleanScanValue = (value) => {
    return String(value ?? "")
        .replace(/\r/g, "")
        .replace(/\n/g, "")
        .trim();
};

const normalizeDigits = (value) => {
    return String(value ?? "").replace(/\D/g, "");
};

const formatGs1Expiry = (value) => {
    const clean = normalizeDigits(value);

    if (!/^\d{6}$/.test(clean)) {
        return null;
    }

    const yy = Number(clean.substring(0, 2));
    const mm = Number(clean.substring(2, 4));
    const dd = Number(clean.substring(4, 6));

    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
        return null;
    }

    /*
     * GS1 YYMMDD:
     * We use 20YY for the normal pharmacy product range.
     */
    const year = 2000 + yy;

    const date = new Date(year, mm - 1, dd);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== mm - 1 ||
        date.getDate() !== dd
    ) {
        return null;
    }

    return `${year}-${String(mm).padStart(2, "0")}-${String(dd).padStart(
        2,
        "0"
    )}`;
};

const looksLikeGs1 = (value) => {
    const clean = cleanScanValue(value);

    return (
        clean.includes("(01)") ||
        clean.includes("(17)") ||
        clean.includes("(10)") ||
        clean.includes("(21)") ||
        clean.includes(GS) ||
        /^01\d{14}/.test(clean) ||
        /^01\d{14}/.test(clean.replace(/[()]/g, ""))
    );
};

/*
|--------------------------------------------------------------------------
| Parse GS1 DataMatrix
|--------------------------------------------------------------------------
|
| Supports both human-readable AI notation:
|
| (01)GTIN(17)EXPIRY(10)BATCH(21)SERIAL
|
| and scanner payload:
|
| 01 + GTIN + 17 + expiry + 10 + batch + 21 + serial
|
*/

const parseGs1DataMatrix = (input) => {
    const original = cleanScanValue(input);

    if (!original) {
        return {
            isGs1: false,
            raw: "",
            gtin: null,
            barcode: null,
            batch_number: null,
            expiry_date: null,
            serial_number: null,
        };
    }

    let value = original
        .replace(/\u001d/g, GS)
        .replace(/<GS>/gi, GS)
        .replace(/\s+\u001d/g, GS);

    const result = {
        isGs1: looksLikeGs1(value),
        raw: original,
        gtin: null,
        barcode: null,
        batch_number: null,
        expiry_date: null,
        serial_number: null,
    };

    if (!result.isGs1) {
        if (/^\d{14}$/.test(value)) {
            result.gtin = value;
        } else {
            result.barcode = value;
        }

        return result;
    }

    /*
     * First handle parenthesized AI format.
     *
     * Example:
     * (01)06291103730459(17)280418(10)D711(21)ABC123
     */
    const parenthesized = value.replace(
        /^\s*(?:\(\s*01\s*\)|01)/,
        "(01)"
    );

    const gtinMatch = parenthesized.match(
        /\(01\)\s*(\d{14})/
    );

    if (gtinMatch) {
        result.gtin = gtinMatch[1];
    }

    const expiryMatch = parenthesized.match(
        /\(17\)\s*(\d{6})/
    );

    if (expiryMatch) {
        result.expiry_date = formatGs1Expiry(expiryMatch[1]);
    }

    /*
     * Batch and serial are variable length AIs.
     * Parenthesized format gives us an easy boundary.
     */
    const batchMatch = parenthesized.match(
        /\(10\)\s*([^()]*?)(?=\(21\)|$)/
    );

    if (batchMatch) {
        result.batch_number = batchMatch[1]
            .replace(new RegExp(GS, "g"), "")
            .trim();
    }

    const serialMatch = parenthesized.match(
        /\(21\)\s*([^()]*?)(?=\(10\)|\(17\)|\(01\)|$)/
    );

    if (serialMatch) {
        result.serial_number = serialMatch[1]
            .replace(new RegExp(GS, "g"), "")
            .trim();
    }

    /*
     * Now parse the common raw GS1 scanner payload:
     *
     * 01 + 14 digit GTIN
     *
     * Followed by variable/fixed AIs.
     */
    const raw = value.replace(/[()]/g, "");

    const rawGtinMatch = raw.match(/^01(\d{14})/);

    if (rawGtinMatch) {
        result.gtin = rawGtinMatch[1];
    }

    if (result.gtin) {
        /*
         * Start after:
         * AI 01 + 14 GTIN = 16 characters
         */
        const remainder = rawGtinMatch
            ? raw.substring(16)
            : "";

        let position = 0;

        while (position < remainder.length) {
            const ai = remainder.substring(position, position + 2);

            if (ai === "17") {
                const expiryRaw = remainder.substring(
                    position + 2,
                    position + 8
                );

                if (/^\d{6}$/.test(expiryRaw)) {
                    result.expiry_date =
                        result.expiry_date ||
                        formatGs1Expiry(expiryRaw);

                    position += 8;
                    continue;
                }
            }

            if (ai === "10") {
                const batchStart = position + 2;

                let end = remainder.length;

                const separatorIndex = remainder.indexOf(
                    GS,
                    batchStart
                );

                if (separatorIndex !== -1) {
                    end = separatorIndex;
                } else {
                    /*
                     * If AI 21 follows batch without GS,
                     * use that as the boundary.
                     */
                    const serialAiIndex = remainder.indexOf(
                        "21",
                        batchStart
                    );

                    if (serialAiIndex !== -1) {
                        end = serialAiIndex;
                    }
                }

                const batch = remainder
                    .substring(batchStart, end)
                    .replace(new RegExp(GS, "g"), "")
                    .trim();

                if (batch) {
                    result.batch_number =
                        result.batch_number || batch;
                }

                if (separatorIndex !== -1) {
                    position = separatorIndex + 1;
                } else {
                    position = end;
                }

                continue;
            }

            if (ai === "21") {
                const serialStart = position + 2;

                let end = remainder.length;

                const separatorIndex = remainder.indexOf(
                    GS,
                    serialStart
                );

                if (separatorIndex !== -1) {
                    end = separatorIndex;
                }

                const serial = remainder
                    .substring(serialStart, end)
                    .replace(new RegExp(GS, "g"), "")
                    .trim();

                if (serial) {
                    result.serial_number =
                        result.serial_number || serial;
                }

                position =
                    separatorIndex !== -1
                        ? separatorIndex + 1
                        : remainder.length;

                continue;
            }

            /*
             * Unknown AI.
             * Move forward one character to avoid getting stuck.
             */
            position += 1;
        }
    }

    /*
     * If the scanner gave us a plain 14 digit GTIN,
     * preserve it as GTIN.
     */
    if (!result.gtin && /^\d{14}$/.test(raw)) {
        result.gtin = raw;
    }

    /*
     * Never use the complete GS1 payload as the ordinary barcode.
     */
    result.barcode = null;

    return result;
};

const detectScanType = (value) => {
    const clean = cleanScanValue(value);

    if (looksLikeGs1(clean)) {
        return "GS1 DataMatrix";
    }

    if (/^\d{14}$/.test(clean)) {
        return "GTIN";
    }

    if (/^[A-Za-z0-9-_]{8,}$/.test(clean)) {
        return "Serial";
    }

    return "Barcode";
};

const safeValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return null;
    }

    return value;
};

export default function Scan() {
    const inputRef = useRef(null);

    const [barcode, setBarcode] = useState("");
    const [loading, setLoading] = useState(false);
    const [medicine, setMedicine] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const [showLinkModal, setShowLinkModal] = useState(false);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [scanType, setScanType] = useState("Barcode");

    /*
     * Complete parsed scan information.
     *
     * This is kept separately from the medicine response so that
     * Create Medicine / Link Existing can still use the exact
     * scanned information even when the medicine was not found.
     */
    const [scanData, setScanData] = useState({
        isGs1: false,
        raw: "",
        gtin: null,
        barcode: null,
        batch_number: null,
        expiry_date: null,
        serial_number: null,
    });

    const focusScanner = () => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 80);
    };

    const beep = () => {
        try {
            const audio = new Audio("/sounds/allow.mp3");
            audio.volume = 1;
            audio.play().catch(() => {});
        } catch {
            // Sound is optional.
        }
    };

    useEffect(() => {
        focusScanner();

        const interval = setInterval(() => {
            if (!showLinkModal && !loading) {
                inputRef.current?.focus();
            }
        }, 800);

        return () => clearInterval(interval);
    }, [showLinkModal, loading]);

    /*
     |--------------------------------------------------------------------------
     | Scan
     |--------------------------------------------------------------------------
     */
    const handleScan = async (e) => {
        if (e.key !== "Enter") return;

        e.preventDefault();

        const value = cleanScanValue(barcode);

        if (!value || loading) {
            return;
        }

        setLoading(true);
        setMedicine(null);
        setNotFound(false);

        const detectedType = detectScanType(value);
        const parsed = parseGs1DataMatrix(value);

        setScanType(detectedType);

        /*
         * Save locally immediately.
         * This allows Create/Link to use the values even if
         * the backend does not return every scan field.
         */
        setScanData({
            ...parsed,
            raw: value,
        });

        try {
            const payload = {
                /*
                 * Keep the original value for backend parsing.
                 */
                barcode: value,

                /*
                 * Explicit raw value.
                 */
                raw_barcode: value,

                scan_type: detectedType,

                /*
                 * Clean identity fields.
                 */
                gtin: parsed.gtin || null,
                batch_number: parsed.batch_number || null,
                expiry_date: parsed.expiry_date || null,
                serial_number: parsed.serial_number || null,
            };

            const { data } = await axios.post(
                route("medicines.search-barcode"),
                payload
            );

            if (data?.found && data?.medicine) {
                beep();

                /*
                 * Backend is authoritative, but we preserve our
                 * parsed scan values as fallback.
                 */
                const backendMedicine = data.medicine;

                const mergedMedicine = {
                    ...backendMedicine,

                    gtin:
                        safeValue(backendMedicine.gtin) ||
                        parsed.gtin,

                    barcode:
                        safeValue(backendMedicine.barcode) ||
                        (
                            parsed.isGs1
                                ? null
                                : parsed.barcode
                        ),

                    batch_number:
                        safeValue(
                            backendMedicine.batch_number
                        ) ||
                        parsed.batch_number,

                    expiry_date:
                        safeValue(
                            backendMedicine.expiry_date
                        ) ||
                        parsed.expiry_date,

                    serial_number:
                        safeValue(
                            backendMedicine.serial_number
                        ) ||
                        parsed.serial_number,
                };

                setMedicine(mergedMedicine);

                /*
                 * Keep the complete scan data available for
                 * subsequent Link/Create operations.
                 */
                setScanData({
                    isGs1:
                        parsed.isGs1 ||
                        detectedType === "GS1 DataMatrix",

                    raw: value,

                    gtin:
                        safeValue(
                            data?.scan?.gtin
                        ) ||
                        safeValue(
                            mergedMedicine.gtin
                        ) ||
                        parsed.gtin,

                    barcode:
                        safeValue(
                            data?.scan?.barcode
                        ) ||
                        (
                            parsed.isGs1
                                ? null
                                : safeValue(
                                      mergedMedicine.barcode
                                  ) ||
                                  parsed.barcode
                        ),

                    batch_number:
                        safeValue(
                            data?.scan?.batch_number
                        ) ||
                        safeValue(
                            mergedMedicine.batch_number
                        ) ||
                        parsed.batch_number,

                    expiry_date:
                        safeValue(
                            data?.scan?.expiry_date
                        ) ||
                        safeValue(
                            mergedMedicine.expiry_date
                        ) ||
                        parsed.expiry_date,

                    serial_number:
                        safeValue(
                            data?.scan?.serial_number
                        ) ||
                        safeValue(
                            mergedMedicine.serial_number
                        ) ||
                        parsed.serial_number,
                });

                /*
                 * Clear scanner input immediately.
                 * The result remains visible on the page.
                 */
                setBarcode("");
                focusScanner();
            } else {
                setMedicine(null);
                setNotFound(true);

                /*
                 * Even when not found, preserve the extracted
                 * GTIN / batch / expiry / serial.
                 */
                setScanData({
                    ...parsed,
                    raw: value,
                });

                /*
                 * Keep the scanned code visible in the
                 * "Not Found" state so the user can inspect it.
                 */
                setBarcode(value);

                focusScanner();
            }
        } catch (error) {
            console.error("Medicine scan failed:", error);

            /*
             * If backend fails, we still keep the parsed data
             * locally so the user does not lose the scan.
             */
            setScanData({
                ...parsed,
                raw: value,
            });

            setMedicine(null);
            setNotFound(true);
            setBarcode(value);

            focusScanner();
        } finally {
            setLoading(false);
        }
    };

    /*
     |--------------------------------------------------------------------------
     | Existing medicine search
     |--------------------------------------------------------------------------
     */
    const searchMedicines = async (value) => {
        setSearch(value);

        if (value.length < 2) {
            setResults([]);
            return;
        }

        try {
            const { data } = await axios.get(
                route("medicines.search-existing"),
                {
                    params: {
                        search: value,
                    },
                }
            );

            setResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Medicine search failed:", error);
            setResults([]);
        }
    };

    /*
     |--------------------------------------------------------------------------
     | Link Existing Medicine
     |--------------------------------------------------------------------------
     */
    const linkMedicine = async (medicineId) => {
        try {
            const parsed = scanData || {};

            const rawValue =
                parsed.raw ||
                barcode ||
                "";

            /*
             * Never use a complete GS1 DataMatrix as a normal barcode.
             */
            const isGs1 =
                parsed.isGs1 ||
                looksLikeGs1(rawValue);

            const fallbackParsed =
                isGs1
                    ? parseGs1DataMatrix(rawValue)
                    : {
                          gtin:
                              /^\d{14}$/.test(
                                  cleanScanValue(rawValue)
                              )
                                  ? cleanScanValue(rawValue)
                                  : null,
                          barcode:
                              /^\d{14}$/.test(
                                  cleanScanValue(rawValue)
                              )
                                  ? null
                                  : cleanScanValue(rawValue),
                          batch_number: null,
                          expiry_date: null,
                          serial_number: null,
                      };

            const cleanGtin =
                parsed.gtin ||
                fallbackParsed.gtin ||
                null;

            const cleanBarcode =
                isGs1
                    ? null
                    : parsed.barcode ||
                      fallbackParsed.barcode ||
                      null;

            await axios.post(
                route("medicines.link-barcode"),
                {
                    medicine_id: medicineId,

                    /*
                     * Ordinary barcode only.
                     * GS1 payload is deliberately excluded.
                     */
                    barcode: cleanBarcode,

                    /*
                     * Clean GTIN.
                     */
                    gtin: cleanGtin,

                    /*
                     * Complete raw scan kept separately.
                     */
                    raw_barcode: rawValue,

                    /*
                     * Pharmacy inventory data.
                     */
                    batch_number:
                        parsed.batch_number ||
                        fallbackParsed.batch_number ||
                        null,

                    expiry_date:
                        parsed.expiry_date ||
                        fallbackParsed.expiry_date ||
                        null,

                    serial_number:
                        parsed.serial_number ||
                        fallbackParsed.serial_number ||
                        null,

                    scan_type: isGs1
                        ? "GS1 DataMatrix"
                        : scanType,
                }
            );

            alert("Medicine linked successfully.");

            setShowLinkModal(false);
            setSearch("");
            setResults([]);
            setNotFound(false);
            setBarcode("");
            setScanData({
                isGs1: false,
                raw: "",
                gtin: null,
                barcode: null,
                batch_number: null,
                expiry_date: null,
                serial_number: null,
            });

            focusScanner();
        } catch (error) {
            console.error(
                "Unable to link barcode:",
                error
            );

            alert(
                error?.response?.data?.message ||
                    "Unable to link medicine."
            );
        }
    };

    /*
     |--------------------------------------------------------------------------
     | New scan
     |--------------------------------------------------------------------------
     */
    const newScan = () => {
        setMedicine(null);
        setNotFound(false);
        setBarcode("");
        setScanType("Barcode");

        setScanData({
            isGs1: false,
            raw: "",
            gtin: null,
            barcode: null,
            batch_number: null,
            expiry_date: null,
            serial_number: null,
        });

        setSearch("");
        setResults([]);

        focusScanner();
    };

    /*
     |--------------------------------------------------------------------------
     | Display helper
     |--------------------------------------------------------------------------
     */
    const value = (data, fallback = "-") => {
        if (
            data === null ||
            data === undefined ||
            String(data).trim() === ""
        ) {
            return fallback;
        }

        return data;
    };

    const stock = Number(
        medicine?.stock_quantity ??
            medicine?.stock ??
            medicine?.quantity ??
            0
    );

    const price = Number(
        medicine?.selling_price ??
            medicine?.sale_price ??
            medicine?.price ??
            0
    );

    /*
     |--------------------------------------------------------------------------
     | Create Medicine data
     |--------------------------------------------------------------------------
     */
    const createMedicine = () => {
        const parsed =
            scanData?.raw
                ? scanData
                : parseGs1DataMatrix(barcode);

        const rawValue =
            parsed.raw ||
            barcode ||
            "";

        const isGs1 =
            parsed.isGs1 ||
            looksLikeGs1(rawValue);

        const cleanGtin =
            parsed.gtin ||
            (
                /^\d{14}$/.test(
                    cleanScanValue(rawValue)
                )
                    ? cleanScanValue(rawValue)
                    : null
            );

        const cleanBarcode =
            isGs1
                ? null
                : parsed.barcode ||
                  (
                      /^\d{14}$/.test(
                          cleanScanValue(rawValue)
                      )
                          ? null
                          : cleanScanValue(rawValue)
                  );

        router.visit(route("medicines.create"), {
            data: {
                /*
                 * Do NOT send GS1 payload as barcode.
                 */
                barcode: cleanBarcode,

                gtin: cleanGtin,

                batch_number:
                    parsed.batch_number || null,

                expiry_date:
                    parsed.expiry_date || null,

                serial_number:
                    parsed.serial_number || null,

                /*
                 * Useful for backend audit / scan workflow.
                 */
                raw_gs1_data:
                    isGs1
                        ? rawValue
                        : null,

                serialized:
                    Boolean(
                        parsed.serial_number
                    ),
            },
        });
    };

    return (
        <AppLayout title="Medicine Scanner">
            <Head title="Medicine Scanner | Pharmexa" />

            <div className="mx-auto w-full max-w-6xl space-y-5">
                {/* =========================================================
                    HEADER
                ========================================================== */}

                <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 p-5 text-white shadow-xl md:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                                <ScanLine size={30} />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-black md:text-3xl">
                                        Medicine Scanner
                                    </h1>

                                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black backdrop-blur">
                                        PHARMEXA
                                    </span>
                                </div>

                                <p className="mt-1 text-sm font-medium text-white/85">
                                    Scan a medicine barcode to find it instantly.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur">
                                <Barcode size={14} />
                                Barcode
                            </span>

                            <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur">
                                GTIN
                            </span>

                            <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur">
                                GS1 DataMatrix
                            </span>

                            <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur">
                                Serial
                            </span>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    SCANNER
                ========================================================== */}

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                                    <ScanLine size={19} />
                                </div>

                                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                    Scan Medicine
                                </h2>
                            </div>

                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Scan the barcode or enter it manually and press Enter.
                            </p>
                        </div>

                        <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {scanType}
                        </div>
                    </div>

                    <div className="relative">
                        <Search
                            size={22}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            ref={inputRef}
                            autoFocus
                            autoComplete="off"
                            spellCheck={false}
                            type="text"
                            value={barcode}
                            onChange={(e) => {
                                setBarcode(e.target.value);
                                setNotFound(false);
                            }}
                            onKeyDown={handleScan}
                            placeholder="Scan barcode or enter barcode / GTIN..."
                            className="h-16 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-12 pr-28 text-base font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                        />

                        {loading ? (
                            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">
                                <RefreshCw
                                    size={14}
                                    className="animate-spin"
                                />
                                Searching
                            </div>
                        ) : (
                            <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-400 shadow-sm ring-1 ring-slate-200 sm:block">
                                ENTER
                            </div>
                        )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400">
                            Scanner ready
                        </p>

                        {barcode && !loading && (
                            <button
                                type="button"
                                onClick={() => {
                                    setBarcode("");
                                    setNotFound(false);
                                    focusScanner();
                                }}
                                className="text-xs font-black text-slate-500 hover:text-red-500"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </section>

                {/* =========================================================
                    LOADING
                ========================================================== */}

                {loading && (
                    <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-black text-amber-700">
                        <RefreshCw
                            size={20}
                            className="animate-spin"
                        />
                        Searching pharmacy inventory...
                    </div>
                )}

                {/* =========================================================
                    MEDICINE FOUND
                ========================================================== */}

                {medicine && (
                    <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900/50 dark:bg-slate-900">
                        {/* SUCCESS BAR */}

                        <div className="flex flex-col gap-4 border-b border-emerald-100 bg-emerald-50/70 px-5 py-4 dark:border-emerald-900/40 dark:bg-emerald-950/20 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                                    <CheckCircle2 size={24} />
                                </div>

                                <div>
                                    <p className="text-xs font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                        Medicine Found
                                    </p>

                                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                        {scanType} scanned successfully
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={newScan}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                <RefreshCw size={16} />
                                New Scan
                            </button>
                        </div>

                        {/* MEDICINE MAIN INFO */}

                        <div className="p-5 md:p-6">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                {/* PRODUCT NAME */}

                                <div className="min-w-0">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Package
                                            size={17}
                                            className="text-blue-600"
                                        />

                                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                                            Product
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-black leading-tight text-slate-950 dark:text-white md:text-3xl">
                                        {value(
                                            medicine.name,
                                            "Medicine"
                                        )}
                                    </h2>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                            SKU:{" "}
                                            {value(
                                                medicine.sku
                                            )}
                                        </span>

                                        <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                                            Barcode:{" "}
                                            {value(
                                                medicine.barcode
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* PRICE */}

                                <div className="shrink-0 rounded-2xl bg-emerald-50 px-5 py-4 dark:bg-emerald-950/20 lg:min-w-[170px] lg:text-right">
                                    <p className="text-xs font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                        Selling Price
                                    </p>

                                    <p className="mt-1 text-2xl font-black text-emerald-600">
                                        {price.toFixed(2)} SAR
                                    </p>
                                </div>
                            </div>

                            {/* DETAILS */}

                            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                                <Info
                                    icon={<Barcode size={16} />}
                                    label="GTIN"
                                    value={
                                        medicine.gtin ||
                                        scanData.gtin
                                    }
                                />

                                <Info
                                    icon={<Package size={16} />}
                                    label="Batch"
                                    value={
                                        medicine.batch_number ||
                                        scanData.batch_number
                                    }
                                />

                                <Info
                                    label="Expiry"
                                    value={
                                        medicine.expiry_date ||
                                        scanData.expiry_date
                                    }
                                />

                                <Info
                                    label="Serial Number"
                                    value={
                                        medicine.serial_number ||
                                        scanData.serial_number
                                    }
                                />

                                <Info
                                    icon={<Boxes size={16} />}
                                    label="Current Stock"
                                    value={stock}
                                    valueClass={
                                        stock <= 0
                                            ? "text-red-600"
                                            : stock <= 5
                                            ? "text-amber-600"
                                            : "text-emerald-600"
                                    }
                                />
                            </div>

                            {/* ACTIONS */}

                            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.visit(
                                            route(
                                                "medicines.edit",
                                                medicine.id
                                            )
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                                >
                                    <Pencil size={17} />
                                    Edit Medicine
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.visit(
                                            route(
                                                "inventory.index"
                                            )
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                                >
                                    <Boxes size={17} />
                                    View Inventory
                                </button>

                                <button
                                    type="button"
                                    onClick={newScan}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                >
                                    <ScanLine size={17} />
                                    Scan Another
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* =========================================================
                    NOT FOUND
                ========================================================== */}

                {notFound && (
                    <section className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900/50 dark:bg-slate-900 md:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                                <AlertCircle size={25} />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-black text-red-600 dark:text-red-400">
                                    Medicine Not Found
                                </h2>

                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    No medicine was found for this scanned code.
                                </p>

                                {/* SCAN DATA PREVIEW */}

                                {(scanData.gtin ||
                                    scanData.batch_number ||
                                    scanData.expiry_date ||
                                    scanData.serial_number) && (
                                    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                                        <Info
                                            label="GTIN"
                                            value={
                                                scanData.gtin
                                            }
                                        />

                                        <Info
                                            label="Batch"
                                            value={
                                                scanData.batch_number
                                            }
                                        />

                                        <Info
                                            label="Expiry"
                                            value={
                                                scanData.expiry_date
                                            }
                                        />

                                        <Info
                                            label="Serial"
                                            value={
                                                scanData.serial_number
                                            }
                                        />
                                    </div>
                                )}

                                {barcode && (
                                    <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                                            Scanned Code
                                        </p>

                                        <p className="mt-1 break-all font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                                            {barcode}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                    {/* CREATE */}

                                    <button
                                        type="button"
                                        onClick={createMedicine}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                                    >
                                        <Package size={17} />
                                        Create Medicine
                                    </button>

                                    {/* LINK */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowLinkModal(
                                                true
                                            )
                                        }
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                                    >
                                        <Link2 size={17} />
                                        Link Existing Medicine
                                    </button>

                                    {/* TRY AGAIN */}

                                    <button
                                        type="button"
                                        onClick={newScan}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        <RefreshCw size={16} />
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* =========================================================
                    EMPTY / READY STATE
                ========================================================== */}

                {!medicine &&
                    !notFound &&
                    !loading && (
                        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-7 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <ScanLine size={28} />
                            </div>

                            <h2 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                                Ready to Scan
                            </h2>

                            <p className="mx-auto mt-1 max-w-md text-sm font-medium text-slate-500 dark:text-slate-400">
                                Scan a medicine barcode and its information will
                                appear here.
                            </p>
                        </section>
                    )}
            </div>

            {/* =============================================================
                LINK EXISTING MEDICINE MODAL
            ============================================================= */}

            {showLinkModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            setShowLinkModal(false);
                        }
                    }}
                >
                    <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                                    Link Existing Medicine
                                </h2>

                                <p className="mt-0.5 text-xs font-medium text-slate-500">
                                    Search for the medicine you want to link.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLinkModal(
                                        false
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* MODAL BODY */}

                        <div className="p-5">
                            {/* SCAN INFORMATION */}

                            {(scanData.gtin ||
                                scanData.batch_number ||
                                scanData.expiry_date ||
                                scanData.serial_number) && (
                                <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-3 dark:border-blue-900/40 dark:bg-blue-950/20">
                                    <p className="mb-2 text-xs font-black uppercase tracking-wide text-blue-600 dark:text-blue-400">
                                        Scan Information
                                    </p>

                                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                                GTIN
                                            </p>

                                            <p className="mt-0.5 break-all text-xs font-black text-slate-700 dark:text-slate-200">
                                                {scanData.gtin ||
                                                    "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                                Batch
                                            </p>

                                            <p className="mt-0.5 break-all text-xs font-black text-slate-700 dark:text-slate-200">
                                                {scanData.batch_number ||
                                                    "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                                Expiry
                                            </p>

                                            <p className="mt-0.5 break-all text-xs font-black text-slate-700 dark:text-slate-200">
                                                {scanData.expiry_date ||
                                                    "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                                Serial
                                            </p>

                                            <p className="mt-0.5 break-all text-xs font-black text-slate-700 dark:text-slate-200">
                                                {scanData.serial_number ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="relative">
                                <Search
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    autoFocus
                                    value={search}
                                    onChange={(e) =>
                                        searchMedicines(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search medicine name, SKU or barcode..."
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            {/* RESULTS */}

                            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
                                {results.length > 0 ? (
                                    results.map(
                                        (item) => (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-slate-700 dark:hover:bg-emerald-950/20"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                                                        {
                                                            item.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs font-semibold text-slate-500">
                                                        SKU:{" "}
                                                        {item.sku ||
                                                            "-"}
                                                        {" • "}
                                                        Barcode:{" "}
                                                        {item.barcode ||
                                                            "-"}
                                                        {item.gtin && (
                                                            <>
                                                                {" • "}
                                                                GTIN:{" "}
                                                                {
                                                                    item.gtin
                                                                }
                                                            </>
                                                        )}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        linkMedicine(
                                                            item.id
                                                        )
                                                    }
                                                    className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-700"
                                                >
                                                    Link
                                                </button>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center dark:border-slate-700">
                                        <Search
                                            size={28}
                                            className="mx-auto text-slate-300"
                                        />

                                        <p className="mt-2 text-sm font-black text-slate-500">
                                            {search
                                                ? "No medicines found"
                                                : "Search for a medicine"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* MODAL FOOTER */}

                        <div className="flex justify-end border-t border-slate-200 px-5 py-4 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowLinkModal(
                                        false
                                    );
                                    setSearch("");
                                    setResults([]);
                                    focusScanner();
                                }}
                                className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

/*
|--------------------------------------------------------------------------
| Information Box
|--------------------------------------------------------------------------
*/

function Info({
    label,
    value,
    icon = null,
    valueClass = "text-slate-900 dark:text-white",
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-400">
                {icon}
                {label}
            </div>

            <div
                className={`mt-1 truncate text-sm font-black ${valueClass}`}
                title={value || "-"}
            >
                {value || "-"}
            </div>
        </div>
    );
}