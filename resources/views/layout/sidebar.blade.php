 @auth
<div class="ui vertical menu">
       
            
        
        
        <a href="/" class="teal item {{ Request::path() === "dashboard" || Request::path() === "/" ? "active" : "" }}">
            
             Dashboard
            
        </a>
        <a href="/vhosts" class="teal item {{ Request::path() === "vhosts" ? "active" : "" }}">
            Vhosts
        
        </a>
        
        
</div>

@endauth