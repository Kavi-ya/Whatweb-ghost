(function() {
    'use strict';
    
    if (window.__GHOST_INJECTED) {
        return;
    }
    window.__GHOST_INJECTED = true;
    window.__GHOST_MODE_ENABLED = true;
    
    console.log("👻 GHOST MODE: Bulletproof & Reversible v8.0");
    
    createToggleButton();
    overrideVisibilityAPI();
    preventReadDetection();
    
    function createToggleButton() {
        const checkBody = setInterval(() => {
            if (document.body) {
                clearInterval(checkBody);
                
                const btn = document.createElement('div');
                btn.id = 'wsp-ghost-toggle';
                btn.innerText = '👻 Ghost Mode: ON';
                
                Object.assign(btn.style, {
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    zIndex: '999999',
                    padding: '10px 16px',
                    background: '#00c853',
                    color: '#000',
                    borderRadius: '24px',
                    fontFamily: 'Segoe UI, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    userSelect: 'none',
                    transition: 'all 0.3s ease'
                });

                btn.onclick = () => {
                    window.__GHOST_MODE_ENABLED = !window.__GHOST_MODE_ENABLED;
                    
                    if (window.__GHOST_MODE_ENABLED) {
                        // Turned ON
                        btn.innerText = '👻 Ghost Mode: ON';
                        btn.style.background = '#00c853';
                        btn.style.color = '#000';
                        console.log("Ghost Mode: ENABLED");
                        
                        window.dispatchEvent(new Event('blur'));
                    } else {
                        // Turned OFF
                        btn.innerText = '👻 Ghost Mode: OFF';
                        btn.style.background = '#d32f2f';
                        btn.style.color = '#fff';
                        console.log("Ghost Mode: DISABLED");
                        
                        // Wake up the window
                        window.dispatchEvent(new Event('focus'));
                        document.dispatchEvent(new Event('visibilitychange'));
                        
                        // Force a tiny scroll in the chat area to wake up WhatsApp's read-detector
                        const mainPanel = document.querySelector('#main');
                        if (mainPanel) {
                            // Find the scrollable container inside the main chat
                            const scrollNodes = mainPanel.querySelectorAll('[role="application"], .os-host-overflow, [data-testid="conversation-panel-messages"]');
                            scrollNodes.forEach(node => {
                                let p = node;
                                // Go up the tree to find the actual scrollable element
                                while(p && p !== document.body) {
                                    if (p.scrollHeight > p.clientHeight) {
                                        p.scrollTop += 1; // Scroll down 1 pixel
                                        setTimeout(() => { p.scrollTop -= 1; }, 50); // Scroll back instantly
                                        break;
                                    }
                                    p = p.parentElement;
                                }
                            });
                        }
                    }
                };

                document.body.appendChild(btn);
            }
        }, 100);
    }

    function overrideVisibilityAPI() {
        const realVisibility = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState')?.get || (() => 'visible');
        const realHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden')?.get || (() => false);
        const realHasFocus = document.hasFocus;
        
        Object.defineProperty(document, 'visibilityState', {
            get: () => window.__GHOST_MODE_ENABLED ? 'hidden' : realVisibility.call(document),
            configurable: true
        });
        
        Object.defineProperty(document, 'hidden', {
            get: () => window.__GHOST_MODE_ENABLED ? true : realHidden.call(document),
            configurable: true
        });
        
        document.hasFocus = function() {
            return window.__GHOST_MODE_ENABLED ? false : realHasFocus.call(document);
        };

        const blockEventIfEnabled = (e) => {
            if (window.__GHOST_MODE_ENABLED && e.isTrusted) {
                e.stopImmediatePropagation();
            }
        };

        document.addEventListener('visibilitychange', blockEventIfEnabled, true);
        window.addEventListener('focus', blockEventIfEnabled, true);
        window.addEventListener('blur', blockEventIfEnabled, true);
    }

    function preventReadDetection() {
        // 1. Intercept IntersectionObserver (Prevents WA from knowing you scrolled down to a message)
        if (window.IntersectionObserver) {
            const OriginalIntersectionObserver = window.IntersectionObserver;
            window.IntersectionObserver = function(callback, options) {
                const modifiedCallback = function(entries, observer) {
                    // If OFF, act completely normal
                    if (!window.__GHOST_MODE_ENABLED) {
                        return callback.call(this, entries, observer);
                    }

                    // If ON, hide the messages from the observer
                    const filteredEntries = entries.filter(entry => {
                        const t = entry.target;
                        if (!t) return true;
                        
                        // Check if the element is a WhatsApp message
                        if (t.hasAttribute && t.hasAttribute('data-id')) return false;
                        if (t.classList && (t.classList.contains('message-in') || t.classList.contains('message-out'))) return false;
                        if (t.closest && t.closest('[data-id], .message-in, .message-out, [role="row"]')) return false;
                        
                        return true;
                    });
                    
                    if (filteredEntries.length > 0) {
                        return callback.call(this, filteredEntries, observer);
                    }
                };
                return new OriginalIntersectionObserver(modifiedCallback, options);
            };
        }

        // 2. Block focus events inside the chat window
        document.addEventListener('focus', function(e) {
            if (!window.__GHOST_MODE_ENABLED) return;
            
            if (e.target && e.target.closest && e.target.closest('#main')) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }, true);
    }

})();