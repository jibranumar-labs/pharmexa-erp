import { useEffect, useMemo, useState } from "react";

import {
    User,
    CreditCard,
    Wallet,
    CheckCircle2,
    Tag,
    ChevronDown,
    ChevronUp,
    X,
} from "lucide-react";

export default function CheckoutPanel({
    subtotal,
    customers = [],
    onCompleteSale,
}) {
    /*
    |--------------------------------------------------------------------------
    | Base Total
    |--------------------------------------------------------------------------
    */

    const baseTotal = Number(subtotal || 0);

    /*
    |--------------------------------------------------------------------------
    | Customer
    |--------------------------------------------------------------------------
    */

    const [customerType, setCustomerType] =
        useState("walkin");

    const [customerId, setCustomerId] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Payment
    |--------------------------------------------------------------------------
    */

    const [paymentMethod, setPaymentMethod] =
        useState("cash");

    const [paidAmount, setPaidAmount] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | DISCOUNT
    |--------------------------------------------------------------------------
    */

    const [showDiscount, setShowDiscount] =
        useState(false);

    const [discountType, setDiscountType] =
        useState("percentage");

    const [discountValue, setDiscountValue] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Discount Calculation
    |--------------------------------------------------------------------------
    */

    const discountAmount = useMemo(() => {
        const value = Number(
            discountValue || 0
        );

        if (value <= 0 || baseTotal <= 0) {
            return 0;
        }

        if (discountType === "percentage") {
            return Math.min(
                baseTotal,
                baseTotal * (value / 100)
            );
        }

        return Math.min(
            baseTotal,
            value
        );
    }, [
        baseTotal,
        discountValue,
        discountType,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Final Total
    |--------------------------------------------------------------------------
    */

    const total = useMemo(() => {
        return Math.max(
            baseTotal - discountAmount,
            0
        );
    }, [
        baseTotal,
        discountAmount,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Payment Amount
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (paymentMethod !== "cash") {
            setPaidAmount(
                total.toFixed(2)
            );
        } else {
            setPaidAmount("");
        }
    }, [
        total,
        paymentMethod,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Payment Calculations
    |--------------------------------------------------------------------------
    */

    const paid = Number(
        paidAmount || 0
    );

    const due = Math.max(
        total - paid,
        0
    );

    const change = Math.max(
        paid - total,
        0
    );

    /*
    |--------------------------------------------------------------------------
    | Discount Percentage Display
    |--------------------------------------------------------------------------
    */

    const discountPercentage =
        discountType === "percentage"
            ? Number(
                  discountValue || 0
              )
            : baseTotal > 0
              ? (
                    (discountAmount /
                        baseTotal) *
                    100
                )
              : 0;

    /*
    |--------------------------------------------------------------------------
    | Clear Discount
    |--------------------------------------------------------------------------
    */

    const clearDiscount = () => {
        setDiscountValue("");
    };

    /*
    |--------------------------------------------------------------------------
    | Complete Sale
    |--------------------------------------------------------------------------
    */

    const complete = () => {
        if (total <= 0) {
            alert(
                "Sale total must be greater than 0."
            );

            return;
        }

        if (
            customerType ===
                "registered" &&
            !customerId
        ) {
            alert(
                "Please select a customer."
            );

            return;
        }

        if (
            paymentMethod === "cash" &&
            paid <= 0
        ) {
            alert(
                "Please enter the amount received from the customer."
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Send Sale Data To Index.jsx
        |--------------------------------------------------------------------------
        */

        onCompleteSale({
            customerType,
            customerId,
            paymentMethod,

            paid_amount: paid,

            /*
            | Discount information
            */
            discount_type:
                discountType,

            discount_value:
                Number(
                    discountValue || 0
                ),

            discount_amount:
                Number(
                    discountAmount.toFixed(2)
                ),

            subtotal:
                Number(
                    baseTotal.toFixed(2)
                ),

            total:
                Number(
                    total.toFixed(2)
                ),
        });
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">

            {/* =========================================================
                HEADER
            ========================================================== */}

            <div className="border-b border-slate-200 p-6 dark:border-slate-700">

                <h2 className="flex items-center gap-2 text-2xl font-black text-slate-900 dark:text-white">

                    <Wallet
                        className="text-emerald-600 dark:text-emerald-400"
                    />

                    Checkout

                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Complete the current sale.
                </p>

            </div>

            <div className="space-y-6 p-6">

                {/* =====================================================
                    CUSTOMER
                ====================================================== */}

                <div>

                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">

                        <User size={16} />

                        Customer

                    </label>

                    <select
                        value={customerType}
                        onChange={(e) =>
                            setCustomerType(
                                e.target.value
                            )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 font-medium text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    >

                        <option value="walkin">
                            Walk-in Customer
                        </option>

                        <option value="registered">
                            Registered Customer
                        </option>

                    </select>

                </div>

                {/* =====================================================
                    REGISTERED CUSTOMER
                ====================================================== */}

                {customerType ===
                    "registered" && (
                    <div>

                        <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
                            Select Customer
                        </label>

                        <select
                            value={customerId}
                            onChange={(e) =>
                                setCustomerId(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        >

                            <option value="">
                                Choose Customer
                            </option>

                            {customers.map(
                                (customer) => (
                                    <option
                                        key={
                                            customer.id
                                        }
                                        value={
                                            customer.id
                                        }
                                    >
                                        {
                                            customer.name
                                        }
                                    </option>
                                )
                            )}

                        </select>

                    </div>
                )}

                {/* =====================================================
                    PAYMENT METHOD
                ====================================================== */}

                <div>

                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">

                        <CreditCard
                            size={16}
                        />

                        Payment Method

                    </label>

                    <select
                        value={paymentMethod}
                        onChange={(e) =>
                            setPaymentMethod(
                                e.target.value
                            )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    >

                        <option value="cash">
                            💵 Cash
                        </option>

                        <option value="mada">
                            💳 Mada
                        </option>

                        <option value="visa">
                            💳 Visa
                        </option>

                        <option value="mastercard">
                            💳 Mastercard
                        </option>

                        <option value="applepay">
                            🍎 Apple Pay
                        </option>

                        <option value="stcpay">
                            📱 STC Pay
                        </option>

                    </select>

                </div>

                {/* =====================================================
                    DISCOUNT BUTTON
                ====================================================== */}

                <div>

                    {!showDiscount ? (

                        <button
                            type="button"
                            onClick={() =>
                                setShowDiscount(
                                    true
                                )
                            }
                            className="flex w-full items-center justify-between rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-left transition hover:border-emerald-500 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40"
                        >

                            <span className="flex items-center gap-2 font-black text-emerald-700 dark:text-emerald-400">

                                <Tag
                                    size={18}
                                />

                                Add Discount

                            </span>

                            <ChevronDown
                                size={18}
                                className="text-emerald-600"
                            />

                        </button>

                    ) : (

                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">

                            {/* Discount Header */}

                            <div className="mb-4 flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                    <Tag
                                        size={18}
                                        className="text-emerald-600"
                                    />

                                    <span className="font-black text-slate-900 dark:text-white">
                                        Discount
                                    </span>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDiscount(
                                            false
                                        )
                                    }
                                    className="rounded-lg p-1 text-slate-500 transition hover:bg-white hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                                    title="Hide Discount"
                                >

                                    <ChevronUp
                                        size={18}
                                    />

                                </button>

                            </div>

                            {/* Discount Type */}

                            <div className="mb-3">

                                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                    Discount Type
                                </label>

                                <select
                                    value={
                                        discountType
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        setDiscountType(
                                            e.target
                                                .value
                                        );

                                        setDiscountValue(
                                            ""
                                        );
                                    }}
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 font-bold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                >

                                    <option value="percentage">
                                        Percentage (%)
                                    </option>

                                    <option value="fixed">
                                        Fixed Amount (SAR)
                                    </option>

                                </select>

                            </div>

                            {/* Discount Value */}

                            <div>

                                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">

                                    {discountType ===
                                    "percentage"
                                        ? "Discount Percentage"
                                        : "Discount Amount"}

                                </label>

                                <div className="relative">

                                    <input
                                        type="number"
                                        min="0"
                                        max={
                                            discountType ===
                                            "percentage"
                                                ? 100
                                                : undefined
                                        }
                                        step="0.01"
                                        value={
                                            discountValue
                                        }
                                        onChange={(
                                            e
                                        ) => {
                                            let value =
                                                e
                                                    .target
                                                    .value;

                                            if (
                                                discountType ===
                                                    "percentage" &&
                                                Number(
                                                    value
                                                ) >
                                                    100
                                            ) {
                                                value =
                                                    "100";
                                            }

                                            setDiscountValue(
                                                value
                                            );
                                        }}
                                        placeholder={
                                            discountType ===
                                            "percentage"
                                                ? "Enter %"
                                                : "Enter SAR"
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white p-3 pr-16 text-lg font-black text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">

                                        {discountType ===
                                        "percentage"
                                            ? "%"
                                            : "SAR"}

                                    </span>

                                </div>

                            </div>

                            {/* Discount Result */}

                            {discountAmount >
                                0 && (
                                <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-3 dark:bg-slate-900">

                                    <div>

                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                            Discount Applied
                                        </p>

                                        <p className="font-black text-emerald-600 dark:text-emerald-400">

                                            {discountPercentage.toFixed(
                                                2
                                            )}
                                            %

                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                            Saving
                                        </p>

                                        <p className="font-black text-red-600">

                                            -
                                            {discountAmount.toFixed(
                                                2
                                            )}{" "}
                                            SAR

                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            clearDiscount
                                        }
                                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                                        title="Remove Discount"
                                    >

                                        <X
                                            size={17}
                                        />

                                    </button>

                                </div>
                            )}

                        </div>

                    )}

                </div>

                {/* =====================================================
                    TOTAL
                ====================================================== */}

                <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 p-5 dark:from-emerald-950/30 dark:to-blue-950/30">

                    <div className="space-y-3">

                        {/* Subtotal */}

                        <div className="flex items-center justify-between">

                            <span className="font-semibold text-slate-600 dark:text-slate-400">
                                Subtotal
                            </span>

                            <span className="font-bold text-slate-900 dark:text-white">
                                {baseTotal.toFixed(
                                    2
                                )}{" "}
                                SAR
                            </span>

                        </div>

                        {/* Discount */}

                        {discountAmount >
                            0 && (
                            <div className="flex items-center justify-between">

                                <span className="font-semibold text-red-600 dark:text-red-400">
                                    Discount
                                </span>

                                <span className="font-black text-red-600 dark:text-red-400">
                                    -
                                    {discountAmount.toFixed(
                                        2
                                    )}{" "}
                                    SAR
                                </span>

                            </div>
                        )}

                        {/* Final Total */}

                        <div className="border-t border-slate-200 pt-3 dark:border-slate-700">

                            <div className="flex items-center justify-between gap-4">

                                <span className="font-semibold text-slate-600 dark:text-slate-400">
                                    Total
                                </span>

                                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                    {total.toFixed(
                                        2
                                    )}{" "}
                                    SAR
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    CUSTOMER PAID
                ====================================================== */}

                <div>

                    <label className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                        Customer Paid
                    </label>

                    <div className="relative">

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                                paidAmount
                            }
                            onChange={(e) =>
                                setPaidAmount(
                                    e.target.value
                                )
                            }
                            disabled={
                                paymentMethod !==
                                "cash"
                            }
                            placeholder="Enter amount received"
                            className="w-full rounded-xl border border-slate-300 bg-white p-4 pr-16 text-xl font-black text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                            SAR
                        </span>

                    </div>

                    {paymentMethod !==
                        "cash" && (
                        <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Digital payment is automatically treated as fully paid.
                        </p>
                    )}

                </div>

                {/* =====================================================
                    DUE / CHANGE
                ====================================================== */}

                <div className="grid gap-3 sm:grid-cols-2">

                    {/* Due */}

                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">

                        <div className="text-sm font-bold text-amber-700 dark:text-amber-400">
                            Due
                        </div>

                        <div className="mt-1 text-2xl font-black text-amber-800 dark:text-amber-300">
                            {due.toFixed(
                                2
                            )}{" "}
                            SAR
                        </div>

                    </div>

                    {/* Change */}

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">

                        <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                            Change
                        </div>

                        <div className="mt-1 text-2xl font-black text-emerald-800 dark:text-emerald-300">
                            {change.toFixed(
                                2
                            )}{" "}
                            SAR
                        </div>

                    </div>

                </div>

                {/* =====================================================
                    PAYMENT STATUS
                ====================================================== */}

                {paymentMethod ===
                    "cash" &&
                    paid > 0 && (
                        <div
                            className={`rounded-2xl p-4 text-center text-sm font-black ${
                                due > 0
                                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                            }`}
                        >

                            {due > 0
                                ? `Customer still owes ${due.toFixed(
                                      2
                                  )} SAR`
                                : change > 0
                                  ? `Give customer ${change.toFixed(
                                        2
                                    )} SAR change`
                                  : "Exact payment received"}

                        </div>
                    )}

                {/* =====================================================
                    COMPLETE SALE
                ====================================================== */}

                <button
                    type="button"
                    disabled={
                        total <= 0 ||
                        (paymentMethod ===
                            "cash" &&
                            paid <= 0)
                    }
                    onClick={complete}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 to-emerald-600 px-6 py-4 text-lg font-black text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >

                    <CheckCircle2
                        size={22}
                    />

                    Complete Sale

                </button>

            </div>
        </div>
    );
}