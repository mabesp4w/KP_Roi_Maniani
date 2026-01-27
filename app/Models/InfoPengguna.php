<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InfoPengguna extends Model
{
    use HasFactory;

    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $table = 'info_pengguna';

    protected $fillable = [
        'id',
        'user_id',
        'ongkir_id',
        'nama_pengguna',
        'nomor_telepon',
        'alamat',
        'aktif',
    ];

    protected $casts = [
        'id' => 'string',
        'user_id' => 'integer',
        'ongkir_id' => 'string',
        'aktif' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function ongkir(): BelongsTo
    {
        return $this->belongsTo(Ongkir::class, 'ongkir_id');
    }
}
