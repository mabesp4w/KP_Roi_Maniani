<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VarianProduk extends Model
{
    use HasFactory;

    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $table = 'varian_produk';

    protected $fillable = [
        'id',
        'produk_id',
        'nama_atribut',
        'nama_varian',
        'harga',
        'stok',
        'deskripsi',
    ];

    protected $casts = [
        'id' => 'string',
        'produk_id' => 'string',
        'harga' => 'integer',
        'stok' => 'integer',
    ];

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'produk_id');
    }

    public function gambarProduks(): HasMany
    {
        return $this->hasMany(GambarProduk::class, 'varian_produk_id');
    }

    public function itemPesanan(): HasMany
    {
        return $this->hasMany(ItemPesanan::class, 'varian_produk_id');
    }

    public function keranjang(): HasMany
    {
        return $this->hasMany(Keranjang::class, 'varian_produk_id');
    }

    public function daftarKeinginan(): HasMany
    {
        return $this->hasMany(DaftarKeinginan::class, 'varian_produk_id');
    }

    public function ulasans(): HasMany
    {
        return $this->hasMany(Ulasan::class, 'varian_produk_id');
    }
}
