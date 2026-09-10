/**
 * Adds dark mode Tailwind classes across resources/js JSX files.
 * Skips tokens that already have a matching dark: variant in the same class string.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'resources', 'js');

function walkDir(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walkDir(full, files);
        else if (entry.name.endsWith('.jsx')) files.push(full);
    }
    return files;
}

function hasDarkVariant(classStr, darkPrefix) {
    return classStr.includes(darkPrefix);
}

/** Apply light->dark pairs only when dark counterpart is missing in this class string. */
function migrateClasses(classStr) {
    if (!classStr || typeof classStr !== 'string') return classStr;

    let s = classStr;

    const pairs = [
        // Cards & surfaces
        ['bg-white', 'dark:bg-slate-900', /\bbg-white\b(?!\/)/],
        ['border-slate-200', 'dark:border-slate-700'],
        ['border-slate-100', 'dark:border-slate-700'],
        ['border-slate-300', 'dark:border-slate-700'],
        ['border-gray-300', 'dark:border-slate-700'],
        ['border-gray-200', 'dark:border-slate-700'],
        ['divide-slate-100', 'dark:divide-slate-700'],
        ['divide-slate-200', 'dark:divide-slate-700'],
        ['divide-gray-200', 'dark:divide-slate-700'],

        // Headings & body text
        ['text-slate-950', 'dark:text-white'],
        ['text-slate-900', 'dark:text-white'],
        ['text-gray-900', 'dark:text-white'],
        ['text-slate-800', 'dark:text-slate-100'],
        ['text-slate-700', 'dark:text-slate-200'],
        ['text-gray-700', 'dark:text-slate-200'],
        ['text-slate-600', 'dark:text-slate-400'],
        ['text-gray-600', 'dark:text-slate-400'],
        ['text-slate-500', 'dark:text-slate-400'],
        ['text-gray-500', 'dark:text-slate-400'],
        ['text-slate-400', 'dark:text-slate-500'],

        // Table / list backgrounds
        ['bg-slate-50', 'dark:bg-slate-800'],
        ['bg-gray-50', 'dark:bg-slate-800'],
        ['hover:bg-slate-50', 'dark:hover:bg-slate-800'],
        ['hover:bg-slate-100', 'dark:hover:bg-slate-800'],
        ['hover:bg-gray-50', 'dark:hover:bg-slate-800'],
        ['focus:bg-slate-100', 'dark:focus:bg-slate-800'],

        // Inputs (when border present, add bg/text if missing)
        ['placeholder:text-slate-400', 'dark:placeholder:text-slate-500'],

        // Icons / muted
        ['text-slate-300', 'dark:text-slate-600'],

        // Modal overlay
        ['bg-gray-500/75', 'dark:bg-black/70'],

        // Secondary surfaces
        ['bg-slate-100', 'dark:bg-slate-800'],
        ['hover:bg-emerald-50', 'dark:hover:bg-emerald-950/30'],
        ['hover:border-emerald-200', 'dark:hover:border-emerald-800'],

        // Status badges
        ['bg-emerald-100', 'dark:bg-emerald-900/40'],
        ['text-emerald-700', 'dark:text-emerald-300'],
        ['text-emerald-600', 'dark:text-emerald-400'],
        ['bg-red-100', 'dark:bg-red-900/40'],
        ['text-red-700', 'dark:text-red-300'],
        ['bg-amber-100', 'dark:bg-amber-900/40'],
        ['text-amber-700', 'dark:text-amber-300'],
        ['text-amber-900', 'dark:text-amber-200'],
        ['bg-amber-50', 'dark:bg-amber-950/30'],
        ['border-amber-200', 'dark:border-amber-800'],
        ['text-amber-800', 'dark:text-amber-200'],
        ['text-amber-600', 'dark:text-amber-400'],
        ['bg-blue-100', 'dark:bg-blue-900/40'],
        ['text-blue-700', 'dark:text-blue-300'],
        ['bg-purple-100', 'dark:bg-purple-900/40'],
        ['text-purple-700', 'dark:text-purple-300'],

        // Pagination inactive
        ["'border'", "border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-900"],
    ];

    for (const [light, dark, pattern] of pairs) {
        const re = pattern ?? new RegExp(`\\b${light.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
        if (!re.test(s)) continue;
        if (hasDarkVariant(s, dark.split(' ')[0])) continue;
        s = s.replace(re, (match) => `${match} ${dark}`);
    }

    // Standalone `border` in ternary pagination — handled above only for exact 'border'

    // Inputs: ensure bg, text, placeholder when border-slate-300 or border-gray-300 present
    if (/\bborder-slate-300\b|\bborder-gray-300\b/.test(s)) {
        if (!hasDarkVariant(s, 'dark:bg-slate-900') && !/\bbg-white\b/.test(s) && !/\bbg-/.test(s)) {
            s += ' bg-white dark:bg-slate-900';
        }
        if (!hasDarkVariant(s, 'dark:text-white') && !/\btext-/.test(s)) {
            s += ' text-slate-900 dark:text-white';
        }
        if (!/\bplaceholder:/.test(s)) {
            s += ' placeholder:text-slate-400 dark:placeholder:text-slate-500';
        }
        if (!/\btransition/.test(s)) {
            s += ' transition-colors';
        }
    }

    // border-b / border-t without slate color
    if (/\bborder-b\b/.test(s) && !/\bborder-slate-/.test(s) && !/\bborder-gray-/.test(s) && !hasDarkVariant(s, 'dark:border-slate-700')) {
        s = s.replace(/\bborder-b\b/, 'border-b border-slate-200 dark:border-slate-700');
    }
    if (/\bborder-t\b/.test(s) && !/\bborder-slate-/.test(s) && !/\bborder-gray-/.test(s) && !hasDarkVariant(s, 'dark:border-slate-700')) {
        s = s.replace(/\bborder-t\b/, 'border-t border-slate-200 dark:border-slate-700');
    }

    // thead text in th without explicit color
    // Cards: add transition-colors
    if (/\bbg-white\b/.test(s) && !/\btransition-colors\b/.test(s) && !/\btransition-all\b/.test(s) && !/\btransition\b/.test(s)) {
        s += ' transition-colors';
    }

    return s.replace(/\s{2,}/g, ' ').trim();
}

function migrateFileContent(content) {
    // Process quoted class strings and template literals in className=
    return content.replace(
        /className=\{(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\}/g,
        (match, quoted) => {
            const quote = quoted[0];
            const inner = quoted.slice(1, -1);
            const migrated = migrateClasses(inner);
            if (migrated === inner) return match;
            return `className={${quote}${migrated}${quote}}`;
        },
    ).replace(
        /className="([^"]*)"/g,
        (match, classes) => {
            const migrated = migrateClasses(classes);
            return migrated === classes ? match : `className="${migrated}"`;
        },
    ).replace(
        /className='([^']*)'/g,
        (match, classes) => {
            const migrated = migrateClasses(classes);
            return migrated === classes ? match : `className='${migrated}'`;
        },
    ).replace(
        /contentClasses\s*=\s*'([^']*)'/g,
        (match, classes) => {
            const migrated = migrateClasses(classes);
            return migrated === classes ? match : `contentClasses='${migrated}'`;
        },
    );
}

const files = walkDir(ROOT);
let changed = 0;

for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const updated = migrateFileContent(original);
    if (updated !== original) {
        fs.writeFileSync(file, updated, 'utf8');
        changed++;
        console.log('Updated:', path.relative(ROOT, file));
    }
}

console.log(`\nDone. ${changed} of ${files.length} files updated.`);
