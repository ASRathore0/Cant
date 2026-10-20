<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Canteen extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'tagline',
        'logo_url',
        'primary_color',
        'secondary_color',
        'accent_color',
        'bg_color',
        'theme_preset',
        'dietary_type',
        'pure_veg_label',
        'address',
        'location_landmark',
        'phone',
        'whatsapp',
        'opening_hours',
        'hero_heading',
        'hero_subheading',
        'hero_badge',
        'hero_trio',
        'announcement_enabled',
        'announcement_text',
        'discount_badge_enabled',
        'discount_badge_title',
        'discount_badge_text',
        'qr_target_url',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'hero_trio' => 'array',
        'announcement_enabled' => 'boolean',
        'discount_badge_enabled' => 'boolean',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    /**
     * Get the formatted full logo URL.
     */
    public function getFullLogoUrlAttribute(): string
    {
        if (!$this->logo_url) {
            return url('/logo.png');
        }

        if (Str::startsWith($this->logo_url, ['http://', 'https://'])) {
            return $this->logo_url;
        }

        return url(ltrim($this->logo_url, '/'));
    }

    /**
     * Convert canteen attributes to frontend settings dictionary.
     */
    public function toSettingsArray(): array
    {
        return [
            'id' => $this->id,
            'canteen_id' => $this->id,
            'restaurant_name' => $this->name,
            'slug' => $this->slug,
            'tagline' => $this->tagline ?? 'Good Food. Made Fresh. Served with Respect.',
            'logo_url' => $this->logo_url ?? '/logo.png',
            'full_logo_url' => $this->full_logo_url,
            'primary_color' => $this->primary_color ?? '#062D1F',
            'secondary_color' => $this->secondary_color ?? '#07402A',
            'accent_color' => $this->accent_color ?? '#E8C928',
            'bg_color' => $this->bg_color ?? '#F8F6F0',
            'theme_preset' => $this->theme_preset ?? 'emerald',
            'dietary_type' => $this->dietary_type ?? 'pure_veg',
            'pure_veg_label' => $this->pure_veg_label ?? '100% Pure Vegetarian',
            'address' => $this->address ?? '',
            'location_landmark' => $this->location_landmark ?? '',
            'phone' => $this->phone ?? '',
            'whatsapp' => $this->whatsapp ?? '',
            'opening_hours' => $this->opening_hours ?? '08:00 AM – 10:30 PM (Everyday)',
            'hero_heading' => $this->hero_heading ?? 'Freshly Cooked & Brewed Daily',
            'hero_subheading' => $this->hero_subheading ?? 'Good Food. Made Fresh. Served with Respect.',
            'hero_badge' => $this->hero_badge ?? "Today's Specials",
            'hero_trio' => $this->hero_trio,
            'announcement_enabled' => (bool) $this->announcement_enabled,
            'announcement_text' => $this->announcement_text ?? '',
            'army_discount_enabled' => (bool) $this->discount_badge_enabled,
            'discount_badge_enabled' => (bool) $this->discount_badge_enabled,
            'discount_badge_title' => $this->discount_badge_title ?? 'Armed Forces 10% Off',
            'army_discount_text' => $this->discount_badge_text ?? '10% Discount for Indian Armed Forces personnel & veterans with valid ID.',
            'discount_badge_text' => $this->discount_badge_text ?? '10% Discount for Indian Armed Forces personnel & veterans with valid ID.',
            'qr_target_url' => $this->qr_target_url ?? url("/menu?canteen={$this->slug}"),
            'is_active' => (bool) $this->is_active,
            'is_default' => (bool) $this->is_default,
        ];
    }

    /**
     * Get default active canteen.
     */
    public static function getDefault(): ?self
    {
        return static::where('is_default', true)->first()
            ?? static::where('is_active', true)->first()
            ?? static::first();
    }
}
