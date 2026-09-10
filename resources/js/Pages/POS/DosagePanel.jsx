import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";

export default function DosagePanel({ item, onChange }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="mt-4">
            {/* =========================================================
                DOSAGE / STICKER BUTTON
            ========================================================== */}
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20"
            >
                <span className="flex items-center gap-2">
                    <FileText size={17} />
                    Dosage / Sticker
                </span>

                <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* =========================================================
                DOSAGE INSTRUCTIONS
                Hidden until cashier clicks the button
            ========================================================== */}
            {open && (
                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="mb-4">
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                            Dosage Instructions
                        </h4>

                        <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                            Add instructions only when a dosage sticker is needed.
                        </p>
                    </div>

                    {/* DOSAGE */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-300">
                            Dosage
                        </label>

                        <select
                            value={item.dosage || ""}
                            onChange={(e) =>
                                onChange("dosage", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-emerald-900/30"
                        >
                            <option value="">Select Dosage</option>
                            <option value="1 tablet">1 tablet</option>
                            <option value="2 tablets">2 tablets</option>
                            <option value="1/2 tablet">1/2 tablet</option>
                            <option value="5 ml">5 ml</option>
                            <option value="10 ml">10 ml</option>
                            <option value="15 ml">15 ml</option>
                            <option value="1 capsule">1 capsule</option>
                            <option value="2 capsules">2 capsules</option>
                            <option value="As directed">As directed</option>
                        </select>
                    </div>

                    {/* TIME */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-300">
                            Time
                        </label>

                        <input
                            type="text"
                            value={item.time || ""}
                            onChange={(e) =>
                                onChange("time", e.target.value)
                            }
                            placeholder="e.g. Morning, Afternoon, Night"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-emerald-900/30"
                        />
                    </div>

                    {/* FOOD */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-300">
                            Food
                        </label>

                        <select
                            value={item.food || ""}
                            onChange={(e) =>
                                onChange("food", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-emerald-900/30"
                        >
                            <option value="">Select</option>
                            <option value="Before Food">Before Food</option>
                            <option value="After Food">After Food</option>
                            <option value="With Food">With Food</option>
                            <option value="Without Food">
                                Without Food
                            </option>
                        </select>
                    </div>

                    {/* DURATION */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-300">
                            Duration
                        </label>

                        <input
                            type="text"
                            value={item.duration || ""}
                            onChange={(e) =>
                                onChange("duration", e.target.value)
                            }
                            placeholder="e.g. 5 days, 1 week"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-emerald-900/30"
                        />
                    </div>

                    {/* NOTES */}
                    <div>
                        <label className="mb-2 block text-sm font-black text-slate-600 dark:text-slate-300">
                            Notes
                        </label>

                        <textarea
                            value={item.notes || ""}
                            onChange={(e) =>
                                onChange("notes", e.target.value)
                            }
                            rows={3}
                            placeholder="Additional instructions..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-emerald-900/30"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}