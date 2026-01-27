<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pesanan extends Model
{
    use HasFactory;

    protected $table = 'pesanan';

    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'ongkir_id',
        'alamat',
        'ongkir',
        'total_harga',
        'total_pembayaran',
        'snap_token',
        'status',
    ];

    protected $casts = [
        'id' => 'string',
        'user_id' => 'integer',
        'ongkir_id' => 'string',
        'ongkir' => 'integer',
        'total_harga' => 'integer',
        'total_pembayaran' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function ongkir(): BelongsTo
    {
        return $this->belongsTo(Ongkir::class, 'ongkir_id');
    }

    public function ongkirRelation(): BelongsTo
    {
        return $this->belongsTo(Ongkir::class, 'ongkir_id');
    }

    public function itemPesanan(): HasMany
    {
        return $this->hasMany(ItemPesanan::class, 'pesanan_id');
    }

    public function statusPengiriman(): HasMany
    {
        return $this->hasMany(StatusPengiriman::class, 'pesanan_id');
    }

    public function ulasans(): HasMany
    {
        return $this->hasMany(Ulasan::class, 'pesanan_id');
    }
}
