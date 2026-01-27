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
        Schema::create('ongkir', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('kecamatan_id')->constrained('kecamatan')->cascadeOnDelete();
            $table->string('nama_desa');
            $table->integer('ongkir');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ongkir');
    }
};
