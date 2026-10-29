<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Canteen;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    /**
     * Display a listing of categories with item counts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::withCount('menuItems');

        $user = $request->user();
        if ($user && $user->canteen_id) {
            $query->where('canteen_id', $user->canteen_id);
        } elseif ($canteenId = $request->input('canteen_id')) {
            $query->where('canteen_id', $canteenId);
        }

        $categories = $query->orderBy('sort_order', 'asc')->get();

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

        $user = $request->user();
        $targetCanteenId = null;

        if ($user && $user->canteen_id) {
            $targetCanteenId = (int) $user->canteen_id;
        } elseif ($request->filled('canteen_id')) {
            $targetCanteenId = (int) $request->input('canteen_id');
        } else {
            $targetCanteenId = Canteen::getDefault()?->id ?? 1;
        }

        $data['canteen_id'] = $targetCanteenId;

        // Auto-generate unique slug
        $baseSlug = !empty($data['slug']) ? Str::slug($data['slug']) : Str::slug($data['name']);
        if (empty($baseSlug)) {
            $baseSlug = 'category';
        }
        $slug = $baseSlug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$targetCanteenId}";
            if (Category::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$targetCanteenId}-" . ++$counter;
            }
        }
        $data['slug'] = $slug;

        if (!isset($data['sort_order']) || $data['sort_order'] === null) {
            $data['sort_order'] = (Category::where('canteen_id', $targetCanteenId)->max('sort_order') ?? 0) + 1;
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
    public function show(Request $request, int $id): JsonResponse
    {
        $category = Category::withCount('menuItems')->findOrFail($id);

        $user = $request->user();
        if ($user && $user->canteen_id && $category->canteen_id && (int) $category->canteen_id !== (int) $user->canteen_id) {
            return response()->json(['message' => 'Unauthorized access to this entity category.'], 403);
        }

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

        $user = $request->user();
        if ($user && $user->canteen_id && $category->canteen_id && (int) $category->canteen_id !== (int) $user->canteen_id) {
            return response()->json(['message' => 'Unauthorized. This category belongs to another entity.'], 403);
        }

        $data = $request->validated();

        if (isset($data['name']) && empty($data['slug'])) {
            $baseSlug = Str::slug($data['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = "{$baseSlug}-" . ($category->canteen_id ?? $counter);
                if (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                    $slug = "{$baseSlug}-" . ++$counter;
                }
            }
            $data['slug'] = $slug;
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
    public function destroy(Request $request, int $id): JsonResponse
    {
        $category = Category::withCount('menuItems')->findOrFail($id);

        $user = $request->user();
        if ($user && $user->canteen_id && $category->canteen_id && $category->canteen_id !== $user->canteen_id) {
            return response()->json(['message' => 'Unauthorized. This category belongs to another entity.'], 403);
        }

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

        $user = $request->user();
        foreach ($request->input('categories') as $orderData) {
            $q = Category::where('id', $orderData['id']);
            if ($user && $user->canteen_id) {
                $q->where('canteen_id', $user->canteen_id);
            }
            $q->update(['sort_order' => $orderData['sort_order']]);
        }

        return response()->json([
            'message' => 'Categories reordered successfully',
        ]);
    }
}
