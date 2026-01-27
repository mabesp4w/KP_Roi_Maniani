<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Keranjang extends Model
{
    use HasFactory;

    protected $table = 'keranjang';

    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'varian_produk_id',
        'user_id',
        'kuantitas',
    ];

    protected $casts = [
        'id' => 'string',
        'varian_produk_id' => 'string',
        'user_id' => 'integer',
        'kuantitas' => 'integer',
    ];

    public function varianProduk(): BelongsTo
    {
        return $this->belongsTo(VarianProduk::class, 'varian_produk_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
