<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="/css/app.css">
    <link rel="stylesheet" data-name="vs/editor/editor.main" href="/js/vs/editor/editor.main.css">
    <link rel="stylesheet" type="text/css" href="/Semantic-UI-CSS-master/semantic.min.css">
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="/Semantic-UI-CSS-master/semantic.min.js"></script>
    <script src="/js/app.js"></script>
    <title>Codesrv Conf</title>
</head>

<body>
    @include('layout.topnav')

    <div class="ui two column grid">

        <div class="three wide column">
            @include('layout.sidebar')
        </div>

        <div class="twelve wide column">
            @yield('content')

        </div>
    </div>



</body>

</html>