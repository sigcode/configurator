@extends('layout.master')

@section('content')
    
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <div class="ui two column grid" id="dashboard">
        <div class="7 wide column" style="">
            <h1>Apache Status:<span class="apacheState"><i class="play  circle icon"></i></span></h1>
            <div class="leftDashboard preWrapped ui segment tertiary raised"></div>
        </div>
        <div class="7 wide column">
            <h1>Codeserver Status: <span class="codeserverState"><i class="play  circle icon"></i></span></h1>
            <div class="rightDashboard preWrapped ui segment tertiary raised"></div>
        </div>
    </div>
@endsection