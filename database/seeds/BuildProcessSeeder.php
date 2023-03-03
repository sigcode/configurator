<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\BuildProcess;

class BuildProcessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        BuildProcess::factory()->count(30)->create();
    }
}
