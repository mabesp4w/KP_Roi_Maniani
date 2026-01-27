<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ongkir extends Model
{
    use HasFactory;

    protected $table = 'ongkir';

    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'kecamatan_id',
        'nama_desa',
        'ongkir',
    ];

    protected $casts = [
        'id' => 'string',
        'kecamatan_id' => 'string',
        'ongkir' => 'integer',
    ];

    public function kecamatan(): BelongsTo
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id');
    }

    public function pesanan(): HasMany
    {
        return $this->hasMany(Pesanan::class, 'ongkir_id');
    }

    public function infoPengguna(): HasMany
    {
        return $this->hasMany(InfoPengguna::class, 'ongkir_id');
    }
}
