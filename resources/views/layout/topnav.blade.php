<div class="ui inverted menu">
    <div class="header item"><a href="/">Kselp</a></div>

    <div class="right menu">


        @guest

        <a class="item" href="{{ route('login') }}">{{ __('Login') }}</a>

        @if ( false && Route::has('register'))
        <a class="item" href="{{ route('register') }}">{{ __('Register') }}</a>

        @endif
        @else
        <div class="ui dropdown item" tabindex="0">
            {{ Auth::user()->name }}
            <i class="dropdown icon"></i>
            <div class="menu transition hidden" tabindex="-1">

                <a class="item" href="{{ route('logout') }}" onclick="event.preventDefault();
                                                    document.getElementById('logout-form').submit();">
                    {{ __('Logout') }}
                </a>
                <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                    @csrf
                </form>

            </div>
        </div>

        @endguest
    </div>
</div>

<script>
    $(".dropdown").dropdown();
</script>
