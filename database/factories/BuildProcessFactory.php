<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BuildProcessFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        //fields build_id, command, output, status, started_at, finished_at
        return [
            'build_id' => $this->faker->numberBetween(1, 10),
            'command' => $this->faker->name,
            'output' => $this->faker->text,
            'status' => $this->faker->randomElement(['success', 'failed', 'running']),
            'started_at' => $this->faker->dateTime,
            'finished_at' => $this->faker->dateTime,
        ];
    }
}
