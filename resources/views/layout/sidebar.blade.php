 @auth
 <div class="ui vertical menu">




     <a href="/" class="teal item {{ Request::path() === "dashboard" || Request::path() === "/" ? "active" : "" }}">

         Dashboard

     </a>

     <a href="/vhostsReact" class="teal item {{ Request::path() === "vhostsReact" ? "active" : "" }}">
         Vhosts

     </a>
     <a href="/builds" class="teal item {{ Request::path() === "builds" ? "active" : "" }}">
         Builds

     </a>
     <a href="/tests" class="teal item {{ Request::path() === "tests" ? "active" : "" }}">
         Tests

     </a>
     <a href="/users" class="teal item {{ Request::path() === "users" ? "active" : "" }}">
         Users

     </a>
     <a href="/settings" class="teal item {{ Request::path() === "settings" ? "active" : "" }}">
         Settings
     </a>




 </div>

 <div class="ui vertical menu">
     <a href="/logout" class="teal item">
         Logout
     </a>
 </div>
 @endauth
