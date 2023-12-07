<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'repo_name', 'repo_url', 'repo_branch', 'deployment_path',  'post_command', 'test_key', "test_command"
    ];

    public function testProcesses()
    {
        return $this->hasMany(TestProcess::class)->orderBy('created_at', 'desc');
    }
}
