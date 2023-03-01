@extends('layout.master') @section('content')

<div class="vhostsReact" data-vhosts="{{json_encode($realVhosts)}}" data-enabled="{{json_encode($enabled)}}"></div>
@endsection
