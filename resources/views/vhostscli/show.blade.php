@extends('layout.master')

@section('content')
    <h1>{{ $vhost->name }}</h1>
    <p>{{$vhost->description}}</p>
    <p>{{$vhost->config}}</p>
    <a href="{{ route('vhosts.show', $vhost)}}/edit">Edit me</a>
        
    <p>
        @foreach ($vhost->tags as $tag)
            <a href="{{ route('vhosts.index' , ["tag" => $tag->name])}}"><span class="badge badge-secondary">{{ $tag->name }}</span></a>
        @endforeach
    </p>
@endsection