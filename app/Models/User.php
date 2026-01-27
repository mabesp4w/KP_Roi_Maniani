<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function pesanan(): HasMany
    {
        return $this->hasMany(Pesanan::class, 'user_id');
    }

    public function itemPesanan(): HasMany
    {
        return $this->hasMany(ItemPesanan::class, 'user_id');
    }

    public function keranjang(): HasMany
    {
        return $this->hasMany(Keranjang::class, 'user_id');
    }

    public function daftarKeinginan(): HasMany
    {
        return $this->hasMany(DaftarKeinginan::class, 'user_id');
    }

    public function statusPengiriman(): HasMany
    {
        return $this->hasMany(StatusPengiriman::class, 'user_id');
    }

    public function infoPengguna(): HasMany
    {
        return $this->hasMany(InfoPengguna::class, 'user_id');
    }

    public function ulasans(): HasMany
    {
        return $this->hasMany(Ulasan::class, 'user_id');
    }
}
