<?php

namespace App\Http\Controllers;

use App\Models\RecyclingRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index()
    {
        return Inertia::render('Tickets');
    }
}