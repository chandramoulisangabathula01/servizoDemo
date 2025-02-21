document.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookieConsent');
    const cookiePreferences = document.getElementById('cookiePreferences');
    const sessionId = generateSessionId();

    // Check if cookie preferences exist
    const existingPreferences = getCookie('cookie_preferences');
    
    if (!existingPreferences) {
        cookieConsent.classList.remove('hidden');
    }

    // Event listeners
    document.getElementById('acceptCookies').addEventListener('click', () => {
        savePreferences({ accepted: true, preferences: { necessary: true, analytics: true, marketing: true } });
        cookieConsent.classList.add('hidden');
    });

    // document.getElementById('rejectCookies').addEventListener('click', () => {
    //     savePreferences({ accepted: false, preferences: { necessary: true, analytics: false, marketing: false } });
    //     cookieConsent.classList.add('hidden');
    // });

    document.getElementById('rejectCookies').addEventListener('click', () => {
        savePreferences({ accepted: false, preferences: { necessary: true, analytics: false, marketing: false } });
        cookieConsent.classList.add('hidden');
        disableGoogleAds(); // Add this line
    });

    document.getElementById('customizeCookies').addEventListener('click', () => {
        cookiePreferences.classList.remove('hidden');
    });

    document.getElementById('closePreferences').addEventListener('click', () => {
        cookiePreferences.classList.add('hidden');
    });

    document.getElementById('savePreferences').addEventListener('click', () => {
        const preferences = {
            necessary: true,
            analytics: document.getElementById('analyticsCookies').checked,
            marketing: document.getElementById('marketingCookies').checked
        };
        savePreferences({ accepted: true, preferences });
        cookiePreferences.classList.add('hidden');
        cookieConsent.classList.add('hidden');
    });

    function savePreferences(preferences) {
        console.log('Saving preferences:', preferences);
        fetch('https://servizobackend.onrender.com/api/cookies/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId,
                accepted: preferences.accepted,
                preferences: preferences.preferences
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from server:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function disableGoogleAds() {
        // Opt out of Google Ads personalization
        if (window.google_optimize !== undefined) {
            window['ga-disable-UA-XXXXX-Y'] = true; // Replace with your Google Analytics ID
        }
        
        // Clear existing Google Ads cookies
        const googleCookies = ['_ga', '_gid', '_gat', '_gcl_au'];
        googleCookies.forEach(cookie => {
            document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });
        
        // If using Google Tag Manager
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'cookie_preferences',
                'marketing_cookies': false
            });
        }
    }

    function generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});