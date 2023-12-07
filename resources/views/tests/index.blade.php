@extends('layout.master') @section('content')
<div class="testsReact" data-tests="{{json_encode($tests->toArray())}}" />
@endsection
