 @auth
<div class="ui vertical menu">
       
            
        
        
        <a href="/" class="teal item {{ Request::path() === "dashboard" || Request::path() === "/" ? "active" : "" }}">
            
             Dashboard
            
        </a>
        <a href="/vhosts" class="teal item {{ Request::path() === "vhosts" ? "active" : "" }}">
            Vhosts
        
        </a>

        <a href="/settings" class="teal item {{ Request::path() === "settings" ? "active" : "" }}">
            Settings
        </a>
        
        
</div>

@endauth