<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GambarProduk extends Model
{
    use HasFactory;

    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $table = 'gambar_produk';

    protected $fillable = [
        'id',
        'varian_produk_id',
        'posisi',
        'gambar_produk',
    ];

    protected $casts = [
        'id' => 'string',
        'varian_produk_id' => 'string',
        'posisi' => 'integer',
    ];

    public function varianProduk(): BelongsTo
    {
        return $this->belongsTo(VarianProduk::class, 'varian_produk_id');
    }
}
