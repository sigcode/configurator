@extends('layout.master') @section('content')
<div class="ui two column grid">
    <div class="six wide column">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <div class="ui two column grid">
            <div class="three wide column"></div>
            <div class="four wide column">
                <div class="">
                    <img  class="importantInfo gimmeShadow" src="/images/you-broke-it-you-fix-it.png"/>
                </div>
            </div>
        </div>
        <h1>VHosts available <span class="newVhost"><i class="plus green circle icon"></i></span></h1>
        <div class="ui celled list">
            @forelse ($realVhosts as $key => $vhost ) @foreach ($vhost as $name => $content)
            <div class="item" id="{{$name}}">
                <div class="ui two column grid">
                    <div class="four wide column">
                        <div class="middle aligned content">
                            <div class="vhostStatusLabel ui {{ in_array($name, $enabled) ? " green ": "red " }}  label">{{ in_array($name, $enabled) ? "Active": "Inactive" }}</div>
                        </div>
                    </div>
                    <div class="ten wide column">
                        <div class="content">
                            <div class="ui large header">
                                <span class="headerName">{{$name}}</span> @if(!in_array($name, $enabled)) <i class="pencil icon grey editPencilVHost" style=""></i>@endif
                            </div>
                            <div class="meta">
                                <a href="{{ route('vhosts.edit' , ["vhost" => $name])}}"><span class="ui blue label">Edit</span></a>
                                @if (!in_array($name, $enabled)) 
                                    <span  data-name="{{$name}}" class="ui label red deleteVhost">
                                            <i class="minus white circle icon"></i> 
                                                delete
                                    </span>
                                @endif
                                <span data-name="{{$name}}" class="ui label {{ in_array($name, $enabled) ? " stop": "start" }}Vhost">
                                            <i class="{{ in_array($name, $enabled) ? "stop": "play" }} icon"></i> 
                                                {{ in_array($name, $enabled) ? "deactivate": "activate" }}
                                        </span>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            @endforeach @empty nothing to see here @endforelse
        </div>

       
    </div>
    <div class="eight wide column">
        <div class="ui two column grid">
            <div class="seven wide column">
                <div class="ui button blue restartApache">Restart Apache</div>
            </div>
            <div class="seven wide column">
                <div class=" ui button orange apacheConfigtest">Apache Configtest</div>
            </div>
            <!--
            <div class="five wide column">
                <div class=" ui button green startApache" style="width:100%">Start<br> Apache </div>
            </div>
            <div class="four wide column">
                <div class=" ui button red stopApache" style="width:100%">Stop<br> Apache </div>
            </div>-->
        </div>
    <div class="eight wide column">
        <div class="ui three column grid">
            <div class="five wide column">
                <div class="ui two column grid">
                    <div class="seven wide column">
                        <div class="ui fitted toggle checkbox">
                            <input type="checkbox" class="cbphp"  {{ (substr(phpversion(), 0, 3) == "7.2") ? "checked='checked'" : "" }} id="cbphp72" data-php-version="72">
                            <label></label>
                        </div>
                    </div>
                    <div class="eight wide column">
                        <div class="labelCheckbox">PHP 7.2</div>
                    </div>
                </div>
            </div>
            <div class="five wide column">
                <div class="ui two column grid">
                    <div class="seven wide column">
                        <div class="ui fitted toggle checkbox">
                            <input type="checkbox" class="cbphp" {{ (substr(phpversion(), 0, 3) == "7.3") ? "checked='checked'" : "" }} id="cbphp73"  data-php-version="73">
                            <label></label>
                        </div>
                    </div>
                    <div class="eight wide column">
                        <div class="labelCheckbox">PHP 7.3</div>
                    </div>
                </div>
            </div>
            <div class="five wide column">
                <div class="ui two column grid">
                    <div class="seven wide column">
                        <div class="ui fitted toggle checkbox" >
                            <input type="checkbox" class="cbphp" id="cbphp74"  {{ (substr(phpversion(), 0, 3) == "7.4") ? "checked='checked'" : "" }}  data-php-version="74">
                            <label></label>
                        </div>
                    </div>
                    <div class="eight wide column">
                        <div class="labelCheckbox">PHP 7.4</div>
                    </div>
                </div>
            </div>
         

        </div>
        </div>
        <div class="ui black message compact floating" id="consoleWrapper" style="width:100%">
            <pre id="console">
            </pre>
        </div>
    </div>
</div>

<div class="ui modal">
  <i class="close icon"></i>
  <div class="header">
    New Vhost
  </div>
  <div class="image content">
  <div class="ui input">
    <input type="text" class="newVhostName" placeholder="example.conf"/>
  </div>
    <div class="ui left pointing red basic label fileendingIncorrect hidden">
          Invalid Vhost Config Fileending. Trottel!
        </div>
        
  </div>
  <div class="actions">
    <div class="ui red button">Cancel</div>
    <div class="ui green button submitNewVhost">OK</div>
  </div>
</div>
@endsection