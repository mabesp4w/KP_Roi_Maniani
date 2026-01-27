<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kecamatan extends Model
{
    use HasFactory;

    protected $table = 'kecamatan';

    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'nama_kecamatan',
    ];

    protected $casts = [
        'id' => 'string',
    ];

    public function ongkir(): HasMany
    {
        return $this->hasMany(Ongkir::class, 'kecamatan_id');
    }
}
