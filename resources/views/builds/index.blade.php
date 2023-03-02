@extends('layout.master') @section('content')
<div class="buildsReact" data-builds="{{json_encode($builds->toArray())}}" />
@endsection
