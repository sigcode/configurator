<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Build;

class BuildSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Build::factory()->count(10)->create();
    }
}
