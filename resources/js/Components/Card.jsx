/**
 * ===========================================================
 * Project : Pharmexa Smart Pharmacy ERP
 * File    : Card.jsx
 * Module  : Global UI Component
 *
 * Purpose:
 * Reusable Card component for the entire application.
 *
 * Usage:
 * <Card>
 *     Your Content
 * </Card>
 *
 * Author:
 * Khan Bacha + ChatGPT
 * ===========================================================
 */

export default function Card({

    children,

    className = ""

}) {

    return (

        <div

            className={`rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${className}`}

        >

            {children}

        </div>

    );

}