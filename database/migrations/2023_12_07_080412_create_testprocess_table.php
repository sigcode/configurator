<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestprocessTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('testprocess');
        Schema::dropIfExists('testprocesses');
        Schema::create('test_processes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->enum("status", ["pending", "running", "success", "failed", "queued"])->default("pending");
            $table->dateTime("started_at")->nullable();
            $table->dateTime("finished_at")->nullable();
            $table->unsignedBigInteger('test_id');
            $table->text("output")->nullable();
            $table->string("command")->nullable();
            $table->foreign('test_id')->references('id')->on('tests')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('test_process');
    }
}
