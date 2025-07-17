
window.GCLIDUtils = (function() {
    'use strict';

    const CONFIG = {
        GCLID_PARAM: 'gclid',
        STORAGE_KEY: 'actavora_gclid',
        TIMESTAMP_KEY: 'actavora_gclid_timestamp',
        EXPIRY_DAYS: 90 
    };

    /**
   
     * @returns {string} 
     */
    function getGCLIDFromURL() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(CONFIG.GCLID_PARAM) || '';
        } catch (error) {
            console.warn('Error getting GCLID from URL:', error);
            return '';
        }
    }

    /**
     * @param {string} gclid 
     */
    function saveGCLID(gclid) {
        if (!gclid) return;
        
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, gclid);
            localStorage.setItem(CONFIG.TIMESTAMP_KEY, new Date().toISOString());
            console.log('GCLID saved:', gclid);
        } catch (error) {
            console.error('Error saving GCLID:', error);
        }
    }

    /**
     * @returns {object} 
     */
    function getSavedGCLID() {
        try {
            const gclid = localStorage.getItem(CONFIG.STORAGE_KEY) || '';
            const timestamp = localStorage.getItem(CONFIG.TIMESTAMP_KEY) || '';
            
            if (gclid && timestamp) {
                const savedDate = new Date(timestamp);
                const currentDate = new Date();
                const daysDiff = (currentDate - savedDate) / (1000 * 60 * 60 * 24);
                
                if (daysDiff > CONFIG.EXPIRY_DAYS) {
                    clearGCLID();
                    return { gclid: '', timestamp: '' };
                }
            }
            
            return { gclid, timestamp };
        } catch (error) {
            console.error('Error getting saved GCLID:', error);
            return { gclid: '', timestamp: '' };
        }
    }

   
    function clearGCLID() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            localStorage.removeItem(CONFIG.TIMESTAMP_KEY);
        } catch (error) {
            console.error('Error clearing GCLID:', error);
        }
    }

   
    function init() {
        const gclid = getGCLIDFromURL();
        if (gclid) {
            saveGCLID(gclid);
        }
    }

    /**
     * @param {object} formData 
     * @returns {object} 
     */
    function addGCLIDToFormData(formData) {
        const { gclid, timestamp } = getSavedGCLID();
        
        return {
            ...formData,
            gclid: gclid,
            gclid_timestamp: timestamp,
            gclid_valid: !!gclid
        };
    }

    /**
     * @returns {object} 
     */
    function getGCLIDInfo() {
        const urlGclid = getGCLIDFromURL();
        const { gclid, timestamp } = getSavedGCLID();
        
        return {
            url_gclid: urlGclid,
            saved_gclid: gclid,
            saved_timestamp: timestamp,
            has_current_gclid: !!urlGclid,
            has_saved_gclid: !!gclid
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init: init,
        getGCLIDFromURL: getGCLIDFromURL,
        saveGCLID: saveGCLID,
        getSavedGCLID: getSavedGCLID,
        clearGCLID: clearGCLID,
        addGCLIDToFormData: addGCLIDToFormData,
        getGCLIDInfo: getGCLIDInfo
    };
})();

window.debugGCLID = function() {
    console.log('GCLID Info:', window.GCLIDUtils.getGCLIDInfo());
};
