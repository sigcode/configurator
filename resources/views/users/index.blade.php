@extends('layout.master') @section('content')
<div class="usersReact" data-users="{{json_encode($users->toArray())}}" />
@endsection
