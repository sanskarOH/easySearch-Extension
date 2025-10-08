import { generateDork } from "./dork-builder.js"

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (evt) => evt.waitUntil(clients.claim()));

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) =>{
    ( async() => {
        try{
            if(!msg || !msg.action){
                sendResponse({ok : false, reason: 'No action'});
                return;

            }

            if( msg.action == 'generateAndOpen') {
                const options = msg.options || {};
                const dork = generateDork(options);
                if(!dork){
                    sendResponse({ ok: false, reason : "Empty dork generated"});
                    return;
                }

                const url = 'https://www.google.com/search?q='+ encodeURIComponent(dork);
                
                chrome.tabs.create({url}, (tab)=> {

                    // sendResponse({ ok: true, dork, url, tabId: tab?.id});
                })

                return;
            }
        }catch(err){
            console.error("Unknown handler error", err);
            sendResponse({ ok: false, reason: 'internal error' });
        }

    })();
    return true;
});
