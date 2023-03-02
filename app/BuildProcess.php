<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuildProcess extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'build_id', 'command', 'output', 'status', 'started_at', 'finished_at',
    ];


    public function build()
    {
        return $this->belongsTo(Build::class);
    }
}
