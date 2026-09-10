/**
 * ===========================================================
 * Project : Pharmexa Smart Pharmacy ERP
 * File    : PrimaryButton.jsx
 * Module  : Global UI Component
 *
 * Purpose:
 * Reusable primary button used throughout the application.
 *
 * Benefits:
 * - Consistent design
 * - Easy maintenance
 * - Easy future updates
 *
 * Author  : Khan Bacha + ChatGPT
 * ===========================================================
 */

export default function PrimaryButton({

    children,

    type = "button",

    disabled = false,

    className = "",

    ...props

}) {

    return (

        <button

            type={type}

            disabled={disabled}

            {...props}

            className={`w-full rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3.5 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >

            {children}

        </button>

    );

}