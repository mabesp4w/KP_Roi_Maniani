// Bootstrap file for Laravel Breeze
// This file is required by app.jsx

import { Ziggy } from './ziggy';
import { route } from 'ziggy-js';

// Setup Ziggy
if (typeof window !== 'undefined') {
    window.Ziggy = Ziggy;
}

// Make route helper available globally
window.route = route;

