<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestProcess extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'test_id', 'command', 'output', 'status', 'started_at', 'finished_at',
    ];


    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}
