@extends('layout.master')

@section('content')
    <h3>Edit Vhost {{$name}}</h1>
     
    <form id="MyForm" action="{{ route('vhosts.show', ["vhost" => $name])}}" method="POST">
        @csrf
        @method("PUT")
            <textarea id="vhostTextArea" style="display:none">{{$content}}</textarea>
            <input type="hidden" name="content" id="test"/>
            <div id="vhostTextAreaDiv" style="min-height: 800px"></div>
            <button class="btn btn-secondary" onclick="setupFormPost()" type="submit">Submit</button>
    </form>
    <script>var require = { paths: { 'vs': '/js/vs' } };</script>
    <script src="/js/vs/loader.js"></script>
    <script src="/js/vs/editor/editor.main.nls.js"></script>
    <script src="/js/vs/editor/editor.main.js"></script>

    <script>
    
    var content = document.getElementById("vhostTextArea").value;
    
        let editor = monaco.editor.create(document.getElementById("vhostTextAreaDiv"), {
        value: 
			content,
		theme: 'vs-dark',
            //model: monaco.editor.createModel("# Sample markdown", "markdown"),
            wordWrap: 'on',
            automaticLayout: true,
            
            scrollbar: {
                vertical: 'auto'
            },
        language: "xml"
    });

    function setupFormPost() {
        var value = editor.getValue()
        $("#test").val(value);
        
    }
    

    </script>
     
@endsection