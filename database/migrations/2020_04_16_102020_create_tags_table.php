<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->timestamps();
        });

        Schema::create('tag_vhost', function( Blueprint $table) {
            $table->bigIncrements("id");
            $table->unsignedBigInteger('vhost_id');
            $table->unsignedBigInteger('tag_id');
            $table->timestamps();
            $table->unique(['vhost_id', 'tag_id']);

            $table->foreign('vhost_id')->references('id')->on('vhosts')->onDelete('cascade');
            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
        });
    }
    

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tags');
    }
}
