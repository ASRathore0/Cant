<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'canteen_id',
        'order_number',
        'token_number',
        'order_type',
        'table_number',
        'customer_name',
        'customer_phone',
        'status',
        'payment_status',
        'payment_method',
        'subtotal',
        'discount',
        'tax',
        'total_amount',
        'notes',
        'billed_by',
        'source',
        'settled_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'settled_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_total',
        'formatted_subtotal',
        'status_label',
    ];

    public function getFormattedTotalAttribute(): string
    {
        return '₹' . number_format($this->total_amount, 2);
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return '₹' . number_format($this->subtotal, 2);
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Pending Approval',
            'confirmed' => 'Confirmed',
            'preparing' => 'In Kitchen',
            'ready' => 'Ready to Serve',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            default => ucfirst($this->status),
        };
    }

    public function canteen(): BelongsTo
    {
        return $this->belongsTo(Canteen::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Generate sequential human-readable invoice / bill number per canteen.
     */
    public static function generateOrderNumber(int $canteenId): string
    {
        $canteen = Canteen::find($canteenId);
        $prefix = $canteen ? strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $canteen->slug), 0, 3)) : 'ORD';
        if (strlen($prefix) < 2) $prefix = 'ORD';

        $today = date('ymd');
        $countToday = self::where('canteen_id', $canteenId)
            ->whereDate('created_at', today())
            ->count() + 1;

        return sprintf('%s-%s-%03d', $prefix, $today, $countToday);
    }

    /**
     * Generate daily running token number for kitchen / counter.
     */
    public static function generateTokenNumber(int $canteenId): string
    {
        $count = self::where('canteen_id', $canteenId)
            ->whereDate('created_at', today())
            ->count() + 1;

        return sprintf('T-%02d', $count);
    }
}

