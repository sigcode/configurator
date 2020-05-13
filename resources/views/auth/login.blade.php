@extends('layout.master')

@section('content')

  <div class="column">
    <h2 class="ui teal image header">
      
      <div class="content">
       {{ __('Login') }}
      </div>
    </h2>
    <form class="ui large form" method="POST" action="{{ route('login') }}">
     @csrf
      <div class="ui stacked segment">
        <div class="field">
          <div class="ui left icon input">
            <i class="user icon"></i>
            <input type="text" id="email" class="@error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus placeholder="{{ __('E-Mail Address') }}" autocomplete="off" >
            @error('email')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
          </div>
        </div>
        <div class="field">
          <div class="ui left icon input">
            <i class="lock icon"></i>
            <input type="password"  id="password" name="password" class="@error('password') is-invalid @enderror" required placeholder="{{ __('Password') }}" autocomplete="off" >

            @error('password')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
          </div>
        </div>
        <div class="field">
            <input class="" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

            <label class="form-check-label" for="remember">
                {{ __('Remember Me') }}
            </label>
        </div>
    
        <button type="submit" class="ui fluid large teal submit button">
            {{ __('Login') }}
        </button>

        @if (Route::has('password.request'))
            <a class="btn btn-link" href="{{ route('password.request') }}">
                {{ __('Forgot Your Password?') }}
            </a>
        @endif
      </div>


    </form>

  
  </div>


@endsection
