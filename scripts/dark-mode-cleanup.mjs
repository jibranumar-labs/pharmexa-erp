/**
 * Cleanup pass: dedupe dark classes, fix hero CTAs, remaining components.
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

function dedupeDarkClasses(str) {
    const tokens = str.split(/\s+/).filter(Boolean);
    const seen = new Set();
    const result = [];

    for (const token of tokens) {
        if (token.startsWith('dark:')) {
            const base = token.replace(/^dark:/, '').replace(/^(hover|focus|placeholder):/, (_, p) => `${p}:`);
            const key = `dark:${base.split(':').pop()}`;
            // Keep first dark variant per utility type within same prefix group
            const group = token.match(/^dark:((?:hover:|focus:|placeholder:)?)(\w+)/);
            const groupKey = group ? `dark:${group[1]}${group[2]}` : token;
            if (seen.has(groupKey)) continue;
            seen.add(groupKey);
        }
        result.push(token);
    }
    return result.join(' ');
}

function cleanup(content) {
    let s = content;

    // Remove obvious duplicate dark text utilities
    s = s.replace(/dark:text-slate-400 dark:text-slate-500/g, 'dark:text-slate-400');
    s = s.replace(/dark:text-slate-500 dark:text-slate-400/g, 'dark:text-slate-400');

    // Hero / gradient CTA buttons: keep white in dark mode
    s = s.replace(
        /(bg-gradient-to-[\w-]+[^"']*["'][^"']*|rounded-\[2rem\] bg-gradient[^"']*["'][^"']*)[\s\S]*?className="([^"]*bg-white dark:bg-slate-900[^"]*text-blue-700)/g,
        (m) => m.replace('bg-white dark:bg-slate-900', 'bg-white dark:bg-white'),
    );
    s = s.replace(
        /className="([^"]*rounded-2xl bg-white dark:bg-slate-900 px-7[^"]*text-blue-700)/g,
        'className="$1'.replace('bg-white dark:bg-slate-900', 'bg-white dark:bg-white'),
    );
    s = s.replace(
        /rounded-2xl bg-white dark:bg-slate-900 px-7 py-4 font-black text-blue-700/g,
        'rounded-2xl bg-white px-7 py-4 font-black text-blue-700 dark:bg-white dark:text-blue-700',
    );
    s = s.replace(
        /rounded-xl bg-white dark:bg-slate-900 px-7 py-4 font-black text-blue-700/g,
        'rounded-xl bg-white px-7 py-4 font-black text-blue-700 dark:bg-white dark:text-blue-700',
    );

    // Pagination inactive links
    s = s.replace(
        /(\$\{\s*link\.active\s*\?\s*'bg-blue-700 text-white'\s*:\s*)'border'/g,
        "$1'border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'",
    );

    // thead header text
    s = s.replace(
        /<thead className="bg-slate-50 dark:bg-slate-800">/g,
        '<thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200">',
    );

    // Process class strings for dedupe
    s = s.replace(/className=\{(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\}/g, (match, quoted) => {
        const q = quoted[0];
        const inner = dedupeDarkClasses(quoted.slice(1, -1));
        return `className={${q}${inner}${q}}`;
    });
    s = s.replace(/className="([^"]*)"/g, (_, classes) => `className="${dedupeDarkClasses(classes)}"`);

    return s;
}

const manualReplacements = {
    'Components/TextInput.jsx': (c) =>
        c.replace(
            "'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 '",
            "'rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 '",
        ),
    'Components/InputLabel.jsx': (c) =>
        c.replace(
            '`block text-sm font-medium text-gray-700 `',
            '`block text-sm font-medium text-slate-600 dark:text-slate-400 `',
        ),
    'Components/SecondaryButton.jsx': (c) =>
        c.replace(
            'inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50',
            'inline-flex items-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-200 shadow-sm transition-colors duration-150 ease-in-out hover:bg-slate-50 dark:hover:bg-slate-800',
        ),
    'Components/Checkbox.jsx': (c) =>
        c.replace(
            "'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 '",
            "'rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-indigo-600 shadow-sm transition-colors focus:ring-indigo-500 '",
        ),
    'Components/NavLink.jsx': (c) =>
        c.replace(
            `'border-indigo-400 text-gray-900 focus:border-indigo-700'`,
            `'border-indigo-400 text-slate-900 dark:text-white focus:border-indigo-700'`,
        ).replace(
            `'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700'`,
            `'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200 focus:border-slate-300 dark:focus:border-slate-600 focus:text-slate-700 dark:focus:text-slate-200'`,
        ),
    'Components/DangerButton.jsx': (c) =>
        c.includes('dark:')
            ? c
            : c.replace(
                  'transition duration-150 ease-in-out',
                  'transition-colors duration-150 ease-in-out',
              ),
    'Components/InputError.jsx': (c) =>
        c.replace('text-red-600', 'text-red-600 dark:text-red-400'),
    'Components/UI/PageHeader.jsx': (c) =>
        c.replace('dark:text-slate-100', 'dark:text-white'),
    'Components/UI/StatCard.jsx': (c) =>
        c.replace('dark:text-slate-100', 'dark:text-white').replace('dark:border-slate-800', 'dark:border-slate-700'),
    'Components/Dropdown.jsx': (c) =>
        c.replace(
            "contentClasses = 'py-1 bg-white'",
            "contentClasses = 'py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'",
        ),
};

const files = walkDir(ROOT);
let changed = 0;

for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    content = cleanup(content);
    if (manualReplacements[rel]) content = manualReplacements[rel](content);
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changed++;
        console.log('Cleaned:', rel);
    }
}

console.log(`\nCleanup done. ${changed} files.`);
