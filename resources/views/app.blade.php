<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- =========================
         PHARMEXA PAGE TITLE
    ========================== --}}
    <title inertia>{{ config('app.name', 'Pharmexa') }}</title>


    {{-- =========================
         PHARMEXA FAVICON
    ========================== --}}

    <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="{{ asset('images/pharmexa-logo.png') }}?v=3"
    >

    <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="{{ asset('images/pharmexa-logo.png') }}?v=3"
    >

    <link
        rel="shortcut icon"
        type="image/png"
        href="{{ asset('images/pharmexa-logo.png') }}?v=3"
    >

    <link
        rel="apple-touch-icon"
        href="{{ asset('images/pharmexa-logo.png') }}?v=3"
    >


    {{-- =========================
         FONTS
    ========================== --}}

    <link rel="preconnect" href="https://fonts.bunny.net">

    <link
        href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap"
        rel="stylesheet"
    >


    {{-- =========================
         PHARMEXA THEME
    ========================== --}}

    <script>
        (function () {
            const stored = localStorage.getItem('pharmexa-theme');

            const prefersDark =
                window.matchMedia('(prefers-color-scheme: dark)').matches;

            const theme =
                stored ?? (prefersDark ? 'dark' : 'light');

            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>


    {{-- =========================
         LARAVEL / INERTIA
    ========================== --}}

    @routes

    @viteReactRefresh

    @vite([
        'resources/js/app.jsx',
        "resources/js/Pages/{$page['component']}.jsx"
    ])

    @inertiaHead

</head>


<body class="font-sans antialiased">

    @inertia

</body>

</html>