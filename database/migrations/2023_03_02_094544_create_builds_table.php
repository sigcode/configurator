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
            $table->unique(['build_id']);
            $table->text("output");
            $table->boolean("success")->default(false);
            $table->boolean("finished")->default(false);
            $table->string("command");
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