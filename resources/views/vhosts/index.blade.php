@extends('layout.master')

@section('content')
    <h1>VHost</h1>
   
  @forelse ($realVhosts as $key => $vhost  )
     @foreach ($vhost as $name => $content)
         <h1>{{$name}}</h1>
         <div class="form-group">
            <label for="my-textarea-{{$name}}"></label>
             <textarea id="my-textarea-{{$name}}" class="form-control myVhosts" name="">{{$content}}</textarea>
         </div>
         <script>
            let elem{{$key}} = document.getElementById("my-textarea-{{$name}}");
            var myCodeMirror = CodeMirror.fromTextArea(elem{{$key}});
        </script>
     @endforeach
  @empty

    <p>no relevant vhosts found</p>


  @endforelse
    

@endsection