<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Build extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'repo_name', 'repo_url', 'repo_branch', 'deployment_path', 'has_submodules', 'post_command', 'build_key'
    ];

    public function buildProcesses()
    {
        return $this->hasMany(BuildProcess::class)->orderBy('created_at', 'desc');
    }
}
