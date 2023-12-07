<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuildsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('builds', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("repo_name");
            $table->string("repo_url");
            $table->string("repo_branch");
            $table->string("deployment_path");
            $table->boolean("has_submodules")->default(false);
        });
        Schema::create('build_processes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('build_id');
            $table->integer('build_id');
            $table->text("output")->nullable();
            $table->string("command")->nullable();
            $table->foreign('build_id')->references('id')->on('builds')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('builds');
    }
}
