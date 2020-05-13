@extends('layout.master')

@section('content')
    <h3>Edit Vhost</h1>
    
    <form action="{{ route('vhosts.show', $vhost)}}" method="POST">
        @csrf
        @method("PUT")
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">Name</span>
            </div>
            <input class="form-control" type="text" name="name" placeholder="Vhost Name" aria-label="Vhost Name" value="{{$vhost->name}}">
        </div>
        @error('name')
            <p class="alert alert-danger">{{$errors->first("name") }}</p>
        @enderror
         <div class="form-group">
                <label for="my-textarea">Description</label>
                <textarea id="my-textarea" class="form-control" name="description" rows="3">{{$vhost->description}}</textarea>
            </div>
              @error('description')
            <p class="alert alert-danger">{{$errors->first("description") }}</p>
        @enderror
            <div class="form-group">
                <label for="config">Config</label>
                <textarea id="config" class="form-control" name="config" rows=10">{{$vhost->config}}</textarea>
            </div>
             @error('config')
            <p class="alert alert-danger">{{$errors->first("config") }}</p>
        @enderror
         <div class="form-group">
            <label for="my-select">Tags</label>
            <select id="my-select" class="form-control" name="tags[]" multiple>
                @foreach ($tags as $tag)
                    <option value="{{$tag->id }}" {{in_array($tag->id, $vhost->tags->pluck('id')->toArray()) ? "selected='selected'" : "" }}>{{$tag->name}}</option>
                @endforeach
            </select>
        </div>
       
          @error('tags')
            <p class="alert alert-danger">{{ $message }}</p>
        @enderror
            <button class="btn btn-secondary" type="submit">Submit</button>
    </form>
@endsection