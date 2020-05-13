
   


<div class="ui inverted menu">
  <div class="header item">Codesrv - Conf</div>
  
  <div class="right menu">
    <div class="item">
      <div class="ui transparent inverted icon input">
        <i class="search icon"></i>
        <input type="text" placeholder="Search">
      </div>
    </div>
    
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
      
        <a class="item" href="{{ route('logout') }}"
                                    onclick="event.preventDefault();
                                                    document.getElementById('logout-form').submit();">
                                    {{ __('Logout') }}
                                </a>
        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
            @csrf
        </form>
      
      <!--<div class="item">Another Action</div>
      <div class="item">Something else here</div>
      <div class="divider"></div>
      <div class="item">Separated Link</div>
      <div class="divider"></div>
      <div class="item">One more separated link</div>-->
    </div>
       </div>
            
        @endguest
  </div>
</div>

<script>
$(".dropdown").dropdown();
</script>