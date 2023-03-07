<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;

class UserController extends Controller
{
    //
    public function index()
    {
        $users = User::all();
        return view('users.index', compact('users'));
    }


    public function destroy(Request $request)
    {
        $user = User::findOrFail($request->id);
        $user->delete();
        $users = User::all();
        return json_encode($users);
    }

    public function update(Request $request)
    {
        if ($request->id == null) {
            $user = new User();
        } else {
            $user = User::find($request->id);
        }
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->save();
        return json_encode($user);
    }

    public function all()
    {
        $users = User::all();
        return json_encode($users);
    }
}
