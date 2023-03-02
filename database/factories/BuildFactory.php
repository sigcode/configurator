<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BuildFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        //fields: repo_name, repo_url, repo_branch, deployment_path, has_submodules
        return [
            'repo_name' => $this->faker->name,
            'repo_url' => $this->faker->url,
            'repo_branch' => $this->faker->name,
            'deployment_path' => $this->faker->slug,
            'has_submodules' => $this->faker->boolean,
            'built_target' => $this->faker->name,
            'build_type' => $this->faker->randomElement(['ant', 'git']),
        ];
    }
}
