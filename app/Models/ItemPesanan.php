<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemPesanan extends Model
{
    use HasFactory;

    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $table = 'item_pesanan';

    protected $fillable = [
        'id',
        'pesanan_id',
        'varian_produk_id',
        'user_id',
        'kuantitas',
        'deskripsi',
    ];

    protected $casts = [
        'id' => 'string',
        'pesanan_id' => 'string',
        'varian_produk_id' => 'string',
        'user_id' => 'integer',
        'kuantitas' => 'integer',
    ];

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }

    public function varianProduk(): BelongsTo
    {
        return $this->belongsTo(VarianProduk::class, 'varian_produk_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
