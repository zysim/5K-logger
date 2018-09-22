@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            @if (session('status'))
            <div class="alert alert-success" role="alert">
                {{ session('status') }}
            </div>
            @endif

            <div id="main" data-times={{ $times ?? null }}></div>
            <script defer src="{{ asset('js/app.js') }}"></script>
        </div>
    </div>
</div>
@endsection
