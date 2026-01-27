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
        Schema::create('gambar_produk', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('varian_produk_id')->constrained('varian_produk')->cascadeOnDelete();
            $table->integer('posisi');
            $table->string('gambar_produk');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gambar_produk');
    }
};
