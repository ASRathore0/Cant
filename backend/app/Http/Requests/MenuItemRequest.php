<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'canteen_id' => ['nullable', 'integer', 'exists:canteens,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price_type' => ['required', 'in:fixed,range,mrp'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'price_max' => ['nullable', 'numeric', 'min:0'],
            'pricing_note' => ['nullable', 'string', 'max:255'],
            'serving_info' => ['nullable', 'string', 'max:100'],
            'is_available' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'image_path' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.exists' => 'The selected category is invalid.',
            'price.min' => 'The price cannot be negative.',
            'price_max.gte' => 'The maximum price must be greater than or equal to the base price.',
            'image.mimes' => 'Food image must be a JPG, PNG, or WebP file.',
            'image.max' => 'Food image file size must not exceed 5MB.',
        ];
    }
}
