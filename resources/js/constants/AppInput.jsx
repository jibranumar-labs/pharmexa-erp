/**
 * ===========================================================
 * Project : Pharmexa Smart Pharmacy ERP
 * File    : AppInput.jsx
 * Module  : Global UI Component
 *
 * Purpose:
 * Reusable input field for the entire application.
 *
 * Author:
 * Khan Bacha + ChatGPT
 *
 * ===========================================================
 */

export default function AppInput({

    type = "text",

    placeholder = "",

    value,

    onChange,

    className = "",

    ...props

}) {

    return (

        <input

            type={type}

            value={value}

            onChange={onChange}

            placeholder={placeholder}

            className={`w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors duration-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 ${className}`}

            {...props}

        />

    );

}