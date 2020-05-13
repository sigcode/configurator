<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Vhost;
use Faker\Generator as Faker;

$factory->define(Vhost::class, function (Faker $faker) {
    return [
        'user_id' => factory(\App\User::class),
        'name' => $faker->name,
        'config' => $faker->paragraph,
        'description' => $faker->sentence,
        
    ];
});
