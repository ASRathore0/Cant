<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RestaurantSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'restaurant_name' => ['nullable', 'string', 'max:150'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'pure_veg_label' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:500'],
            'location_landmark' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'opening_hours' => ['nullable', 'string', 'max:255'],
            'hero_heading' => ['nullable', 'string', 'max:255'],
            'hero_subheading' => ['nullable', 'string', 'max:1000'],
            'announcement_enabled' => ['nullable', 'in:0,1,true,false'],
            'announcement_text' => ['nullable', 'string', 'max:500'],
            'army_discount_enabled' => ['nullable', 'in:0,1,true,false'],
            'army_discount_text' => ['nullable', 'string', 'max:500'],
            'qr_target_url' => ['nullable', 'url', 'max:500'],
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
