
class CookieConsent {
    constructor() {
        this.storageKey = 'actavora_cookie_consent';
        this.dateKey = 'actavora_cookie_consent_date';
        this.banner = null;
        this.acceptBtn = null;
        this.declineBtn = null;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.createBanner();
        this.bindEvents();
        this.checkAndShow();
    }
    
    createBanner() {
        if (!document.getElementById('cookieConsentBanner')) {
            const bannerHTML = `
                <div id="cookieConsentBanner" class="cookie-consent-banner">
                    <div class="cookie-consent-content">
                        <div class="cookie-consent-text">
                            <h5>🍪 Wir verwenden Cookies</h5>
                            <p>
                                Wir nutzen Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten. 
                                Durch die weitere Nutzung stimmen Sie unserer 
                                <a href="privacy-policy.html" target="_blank">Datenschutzerklärung</a> zu.
                            </p>
                        </div>
                        <div class="cookie-consent-buttons">
                            <button id="acceptCookies" class="cookie-btn cookie-btn-accept">
                                Akzeptieren
                            </button>
                            <button id="declineCookies" class="cookie-btn cookie-btn-decline">
                                Ablehnen
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', bannerHTML);
        }
        
        // Получаем элементы
        this.banner = document.getElementById('cookieConsentBanner');
        this.acceptBtn = document.getElementById('acceptCookies');
        this.declineBtn = document.getElementById('declineCookies');
    }
    
    bindEvents() {
        if (this.acceptBtn) {
            this.acceptBtn.addEventListener('click', () => this.acceptCookies());
        }
        
        if (this.declineBtn) {
            this.declineBtn.addEventListener('click', () => this.declineCookies());
        }
    }
    
    checkAndShow() {
        const consent = this.getConsent();
        console.log('Cookie consent status:', consent);
        
        if (!consent) {
            setTimeout(() => this.showBanner(), 1000);
            
            setTimeout(() => {
                if (this.banner && this.banner.classList.contains('show')) {
                    console.log('Auto-accepting cookies after 30 seconds');
                    this.acceptCookies('auto');
                }
            }, 30000);
        }
    }
    
    showBanner() {
        if (this.banner) {
            console.log('Showing cookie banner');
            this.banner.classList.add('show');
        }
    }
    
    hideBanner() {
        if (this.banner) {
            console.log('Hiding cookie banner');
            this.banner.classList.remove('show');
            setTimeout(() => {
                this.banner.style.display = 'none';
            }, 300);
        }
    }
    
    acceptCookies(type = 'manual') {
        const timestamp = new Date().toISOString();
        const consentData = {
            status: 'accepted',
            type: type,
            timestamp: timestamp,
            version: '1.0'
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(consentData));
        localStorage.setItem(this.dateKey, timestamp);
        
        console.log('Cookies accepted:', consentData);
        console.log('localStorage data:', {
            consent: localStorage.getItem(this.storageKey),
            date: localStorage.getItem(this.dateKey)
        });
        
        this.hideBanner();
        this.enableAnalytics();
    }
    
    declineCookies() {
        const timestamp = new Date().toISOString();
        const consentData = {
            status: 'declined',
            type: 'manual',
            timestamp: timestamp,
            version: '1.0'
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(consentData));
        localStorage.setItem(this.dateKey, timestamp);
        
        console.log('Cookies declined:', consentData);
        console.log('localStorage data:', {
            consent: localStorage.getItem(this.storageKey),
            date: localStorage.getItem(this.dateKey)
        });
        
        this.hideBanner();
        this.disableAnalytics();
    }
    
    getConsent() {
        try {
            const consent = localStorage.getItem(this.storageKey);
            return consent ? JSON.parse(consent) : null;
        } catch (e) {
            console.error('Error reading cookie consent:', e);
            return null;
        }
    }
    
    enableAnalytics() {
        console.log('Analytics enabled - готов для подключения Google Analytics, Facebook Pixel и др.');
       
    }
    
    disableAnalytics() {
        console.log('Analytics disabled - все трекинг скрипты отключены');
       
    }
    
    resetConsent() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.dateKey);
        console.log('Cookie consent reset');
        this.checkAndShow();
    }
    
    getConsentStatus() {
        const consent = this.getConsent();
        return consent ? consent.status : null;
    }
}

const actavoraCookieConsent = new CookieConsent();

window.actavoraCookieConsent = actavoraCookieConsent;
