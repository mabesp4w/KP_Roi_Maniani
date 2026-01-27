<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pesanan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('ongkir_id')->constrained('ongkir')->cascadeOnDelete();
            $table->text('alamat');
            $table->integer('ongkir');
            $table->integer('total_harga');
            $table->integer('total_pembayaran');
            $table->text('snap_token')->nullable();
            $table->string('status'); // proses, dibayar, batal, selesai
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
