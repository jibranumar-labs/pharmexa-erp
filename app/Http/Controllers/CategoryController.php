<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Inventory/Categories/Index', [
            'categories' => Category::latest()->paginate(10),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Inventory/Categories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
        ]);

        $validated['is_active'] = true;

        $category = Category::create($validated);

        ActivityLog::record(
            'Categories',
            'Created',
            $category->name,
            'Category created successfully.'
        );

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Inventory/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $category->update($validated);

        ActivityLog::record(
            'Categories',
            'Updated',
            $category->name,
            'Category updated successfully.'
        );

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $name = $category->name;

        $category->delete();

        ActivityLog::record(
            'Categories',
            'Deleted',
            $name,
            'Category deleted successfully.'
        );

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}