@extends('layout.master') @section('content') @auth
<meta name="csrf-token" content="{{ csrf_token() }}">
<div class="ui two column grid" id="dashboard">
    <div class="7 wide column" style="">
        <h1>Apache Status:<span class="apacheState"><i class="play  circle icon"></i></span></h1>
        <div class="ui buttons">
            <button class="ui button blue" onclick="vhosts.apacheRestart()">Restart</button>
            <button class="ui button green" onclick="vhosts.apacheStart()">Start</button>
           <!-- <button class="ui button red" onclick="vhosts.apacheStop()">Stop</button>-->
        </div>
        <div class="leftDashboard preWrapped ui segment tertiary raised"></div>
    </div>
    <div class="7 wide column">

        <h1>Codeserver Status: <span class="codeserverState"><i class="play  circle icon"></i></span></h1>
        <div class="ui buttons">
            <button class="ui button blue" onclick="vhosts.codeserverRestart()">Restart</button>
            <button class="ui button green" onclick="vhosts.codeserverStart()">Start</button>
            <button class="ui button red" onclick="vhosts.codeserverStop()">Stop</button>
        </div>
        <div class="rightDashboard preWrapped ui segment tertiary raised"></div>
    </div>
    <div class="7 wide column">
        <h1>MySQL Status: <span class="mysqlState"><i class="play  circle icon"></i></span></h1>
        <div class="ui buttons">
            <button class="ui button blue" onclick="vhosts.mysqlRestart()">Restart</button>
            <button class="ui button green" onclick="vhosts.mysqlStart()">Start</button>
            <button class="ui button red" onclick="vhosts.confAll()">Stop</button>
        </div>
        <div class></div>
        <div class="leftDashboardSecond preWrapped ui segment tertiary raised"></div>
    </div>
    <!--
    <div class="7 wide column">
        <h1>Codesrv Conf Status (Hello Cpt. Obvious....): <span class="confState"><i class="play  circle icon"></i></span></h1>
        <div class="ui buttons">
            <button class="ui button blue" onclick="vhosts.confAll()">Restart</button>
            <button class="ui button green" onclick="vhosts.confAll()">Start</button>
            <button class="ui button red" onclick="vhosts.confAll()">Stop</button>
        </div>
        <div class="rightDashboardSecond preWrapped ui segment tertiary raised"></div>
    </div>-->
</div>
@endauth @guest Please log in .... <a href="/login"> Go Go Go</a> @endguest

<div class="ui modal">
    <i class="close icon"></i>
    <div class="header">
        ...
    </div>
    <div class="image content">
        <img src="/images/ohno.gif" style="width: 600px;" class="gimmeShadow">

    </div>
    <div class="actions">


    </div>
</div>
@endsection