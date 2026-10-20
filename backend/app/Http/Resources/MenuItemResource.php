<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category_name' => $this->whenLoaded('category', fn() => $this->category?->name),
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price_type' => $this->price_type,
            'price' => (float) $this->price,
            'price_max' => $this->price_max !== null ? (float) $this->price_max : null,
            'formatted_price' => $this->formatted_price,
            'pricing_note' => $this->pricing_note,
            'image_path' => $this->image_path,
            'image_url' => $this->image_url,
            'serving_info' => $this->serving_info,
            'is_available' => (bool) $this->is_available,
            'is_featured' => (bool) $this->is_featured,
            'sort_order' => (int) $this->sort_order,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
