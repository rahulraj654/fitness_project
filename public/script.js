(function () {
    'use strict';

    const CONFIG = {
        API_BASE_URL: '/api'
    };

    const els = {
        logoutBtn: document.getElementById('logout-btn'),
        activityList: document.getElementById('activity-list'),
        logForm: document.getElementById('log-form'),
        stats: {
            workouts: document.getElementById('stat-workouts'),
            calories: document.getElementById('stat-calories'),
            streak: document.getElementById('stat-streak'),
            active: document.getElementById('stat-active')
        }
    };

    // --- Helper: Get Cookie by Name ---
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // --- API HELPER ---
    async function apiFetch(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'X-XSRF-Token': getCookie('XSRF-TOKEN') || '',
            ...options.headers
        };

        const config = {
            ...options,
            headers,
            credentials: 'same-origin',
            method: options.method ? options.method.toUpperCase() : 'GET'
        };

        const response = await fetch(url, config);

        if (response.status === 401) {
            window.location.href = '/login.html';
            throw new Error('Unauthorized');
        }

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
            return null;
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
    }

    // --- Initialization ---
    async function init() {
        if (!els.activityList) return;

        try {
            await Promise.all([
                fetchStats(),
                fetchActivities()
            ]);
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    async function fetchStats() {
        const stats = await apiFetch(`${CONFIG.API_BASE_URL}/stats`);
        if (stats) {
            els.stats.workouts.textContent = stats.workouts;
            els.stats.calories.textContent = stats.caloriesBurned;
            els.stats.streak.textContent = stats.streak;
            els.stats.active.textContent = stats.activeMinutes;
        }
    }

    async function fetchActivities() {
        const activities = await apiFetch(`${CONFIG.API_BASE_URL}/activities`);
        renderActivities(activities);
    }

    function renderActivities(list) {
        if (!list || list.length === 0) {
            els.activityList.innerHTML = '<div class="empty">No activities logged yet.</div>';
            return;
        }

        els.activityList.innerHTML = list.map(item => `
            <div class="activity-item">
                <div class="act-info">
                    <span class="act-type">${item.type}</span>
                    <span class="act-date">${item.date}</span>
                </div>
                <div class="act-right">
                    <span class="act-dur">${item.duration}</span>
                    <span class="act-cal">${item.calories} cal</span>
                </div>
            </div>
        `).join('');
    }

    // --- Add Activity ---
    if (els.logForm) {
        els.logForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            btn.disabled = true;

            try {
                const payload = {
                    type: document.getElementById('log-type').value,
                    duration: document.getElementById('log-duration').value,
                    calories: parseInt(document.getElementById('log-calories').value) || 0
                };

                await apiFetch(`${CONFIG.API_BASE_URL}/activities`, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                els.logForm.reset();
                await Promise.all([fetchStats(), fetchActivities()]);
            } catch (error) {
                alert('Failed to log activity: ' + error.message);
            } finally {
                btn.disabled = false;
            }
        });
    }

    // --- Logout ---
    if (els.logoutBtn) {
        els.logoutBtn.addEventListener('click', async () => {
            try {
                await apiFetch('/logout', { method: 'POST' });
                window.location.href = '/login.html';
            } catch (error) {
                alert('Logout failed');
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
