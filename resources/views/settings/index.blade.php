@extends('layout.master')

@section('content')

<div class="ui container">
  <h1 class="ui huge header" style="margin-bottom: 1em">Settings</h1>
    <div>
        <h2 class="ui dividing header">
            CodeServer
        </h2>

        <form class="ui form" method="post" action="{{ route('settings.update')}}">
            @csrf
            <div class="field">
                <label>Passwort:</label>
                <input placeholder="Passwort" type="text" name="PASSWORD" value="{{$codeServerConfig->PASSWORD}}">
            </div>
            <div class="field">
                <label>Pfad:</label>
                <input placeholder="Passwort" type="text" name="PATH" value="{{$codeServerConfig->PATH}}">
            </div>
            <button class="ui submit button" type="submit">DO IT</button>
        </form>    
    </div>


</div>

@endsection