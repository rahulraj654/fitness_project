(function () {
    'use strict';

    const CONFIG = {
        API_BASE_URL: '/api'
    };

    const els = {
        logoutBtn: document.getElementById('logout-btn'),
        statsContainer: document.getElementById('stats-container')
    };

    // --- Helper: Get Cookie by Name ---
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // --- API HELPER (with CSRF token and error handling) ---
    async function apiFetch(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add CSRF token for non-GET requests
        if (options.method && options.method.toUpperCase() !== 'GET') {
            const csrfToken = getCookie('XSRF-TOKEN');
            if (csrfToken) {
                headers['X-XSRF-Token'] = csrfToken;
            } else {
                console.warn('CSRF token not found in cookies');
            }
        }

        const config = {
            ...options,
            headers,
            credentials: 'same-origin',
            method: options.method ? options.method.toUpperCase() : 'GET'
        };

        const response = await fetch(url, config);

        // Handle authentication errors
        if (response.status === 401) {
            window.location.href = '/login.html';
            throw new Error('Unauthorized');
        }

        // Handle CSRF errors
        if (response.status === 403) {
            console.error('CSRF token validation failed');
            alert('Session expired. Please refresh the page.');
            throw new Error('CSRF validation failed');
        }

        if (response.ok) {
            // Check content type before parsing json
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                return null;
            }
        }

        // Handle other errors
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
    }

    // --- Initialization ---
    async function init() {
        if (!els.statsContainer) return; // Not on dashboard

        try {
            // Fetch User Stats
            const stats = await apiFetch(`${CONFIG.API_BASE_URL}/stats`);
            renderStats(stats);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            els.statsContainer.innerHTML = '<p class="error">Failed to load data.</p>';
        }
    }

    function renderStats(stats) {
        if (!stats) return;

        els.statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-label">Workouts</div>
                <div class="stat-value">${stats.workouts}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Calories Burned</div>
                <div class="stat-value">${stats.caloriesBurned}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Current Streak</div>
                <div class="stat-value">${stats.streak} <span style="font-size:1rem">days</span></div>
            </div>
        `;
    }

    // --- Logout Interaction ---
    if (els.logoutBtn) {
        els.logoutBtn.addEventListener('click', async () => {
            try {
                els.logoutBtn.disabled = true;
                els.logoutBtn.textContent = '...';

                await apiFetch('/logout', { method: 'POST' });
                window.location.href = '/login.html';
            } catch (error) {
                console.error('Logout error:', error);
                alert('Logout failed. Please try again.');
                els.logoutBtn.disabled = false;
                els.logoutBtn.textContent = 'Sign Out';
            }
        });
    }

    // Auto-run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
