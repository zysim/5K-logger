<?php

namespace App\Http\ViewComposers;

use Illuminate\View\View;

class HomeComposer
{

    /**
     * Create a new DashboardComposer.
     *
     * @param Time $times
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Bind data to the view.
     *
     * @param  View  $view
     * @return void
     */
    public function compose(View $view)
    {
        $view->with('times', \App\Time::all());
    }
}
