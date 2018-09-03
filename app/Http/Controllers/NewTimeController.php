<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Time;

/**
 * This controller handles the POST request to record a new set of times.
 */
class NewTimeController extends Controller
{
    /**
     * Records the new set of times.
     *
     * @param Request           $request The request containing the data
     *
     * @return RedirectResponse
     */
    public function newTime(Request $request) {
        // Capture the data in a new model, and save it
        // $time = new Time();
        // foreach ($request->all() as $key => $value) {
        //     if ($key === "_token") continue;
        //     $time[$key] = $value;
        // }
        // $time->save();
        dd($request->all());
        return redirect()->back();
    }
}
