<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vhost extends Model
{
    protected $fillable = ["name", "config", "description", "user_id"];

    public function path()
    {
        return route('vhosts.show', $this);
    }
}
