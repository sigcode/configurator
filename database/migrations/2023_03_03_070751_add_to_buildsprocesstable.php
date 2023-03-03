<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddToBuildsprocesstable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('build_processes', function (Blueprint $table) {
            $table->enum("status", ["pending", "running", "success", "failed"])->default("pending");
            $table->dateTime("started_at")->nullable();
            $table->dateTime("finished_at")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('build_processes', function (Blueprint $table) {
            //
        });
    }
}
