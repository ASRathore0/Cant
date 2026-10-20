<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    /**
     * Display a listing of categories with item counts.
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('menuItems')
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'data' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(CategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        if (!isset($data['sort_order'])) {
            $data['sort_order'] = Category::max('sort_order') + 1;
        }

        $category = Category::create($data);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => new CategoryResource($category->loadCount('menuItems')),
        ], 201);
    }

    /**
     * Display the specified category.
     */
    public function show(int $id): JsonResponse
    {
        $category = Category::withCount('menuItems')->findOrFail($id);

        return response()->json([
            'data' => new CategoryResource($category),
        ]);
    }

    /**
     * Update the specified category.
     */
    public function update(CategoryRequest $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $data = $request->validated();

        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => new CategoryResource($category->fresh()->loadCount('menuItems')),
        ]);
    }

    /**
     * Remove the specified category.
     * Prevents deleting categories that still contain items.
     */
    public function destroy(int $id): JsonResponse
    {
        $category = Category::withCount('menuItems')->findOrFail($id);

        if ($category->menu_items_count > 0) {
            return response()->json([
                'message' => "Cannot delete category '{$category->name}' because it contains {$category->menu_items_count} item(s). Please reassign or delete the menu items first.",
                'items_count' => $category->menu_items_count,
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }

    /**
     * Reorder categories.
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->input('categories') as $orderData) {
            Category::where('id', $orderData['id'])->update(['sort_order' => $orderData['sort_order']]);
        }

        return response()->json([
            'message' => 'Categories reordered successfully',
        ]);
    }
}
