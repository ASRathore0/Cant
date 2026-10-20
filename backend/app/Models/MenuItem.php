<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price_type',
        'price',
        'price_max',
        'pricing_note',
        'image_path',
        'serving_info',
        'is_available',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'price_max' => 'decimal:2',
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'formatted_price',
        'image_url',
    ];

    protected static function booted()
    {
        static::saving(function ($item) {
            if (empty($item->slug)) {
                $item->slug = Str::slug($item->name);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getFormattedPriceAttribute(): string
    {
        if ($this->price_type === 'mrp') {
            return 'MRP';
        }

        if ($this->price_type === 'range') {
            $min = (int) $this->price == $this->price ? number_format($this->price, 0) : number_format($this->price, 2);
            $max = $this->price_max !== null ? ((int) $this->price_max == $this->price_max ? number_format($this->price_max, 0) : number_format($this->price_max, 2)) : '';
            return '₹' . $min . ($max ? ' - ₹' . $max : '');
        }

        $formatted = (int) $this->price == $this->price ? number_format($this->price, 0) : number_format($this->price, 2);
        return '₹' . $formatted;
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        if (Str::startsWith($this->image_path, ['http://', 'https://'])) {
            return $this->image_path;
        }

        return url('storage/' . ltrim($this->image_path, '/'));
    }
}
