const BOT_TOKEN = "8680179449:AAHb26-jsgM-Q92zEAeBxzM0ycHbpoJkAvk"; 
const ADMIN_CHAT_ID = "6156596236";

let tg = null;
try {
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.expand();
    }
} catch (e) {
    console.log("Telegram WebApp Error");
}

const translations = {
    en: {
        langTxt: "FA", landingTitle: "Bamboo Meme 🎋", landingDesc: "Unleash your creativity!",
        startBtn: "🎨 Start Meme Maker", supportBtnTxt: "💬 Support & Collab", channelBtn: "📢 Channel",
        title: "Meme Maker 🎨", uploadBtn: "📸 Upload from Gallery", loading: "⏳ Loading...",
        searchPlc: "🔍 Search memes...", loadMoreBtn: "Load More", nextBtn: "Next Step",
        backBtn: "Back", downloadBtn: "Send to Bot 📥", shareBtn: "Share 🚀",
        backToMenuBtn: "🏠 Main Menu",
        addTextLbl: "Add Text", dir: "ltr", panelTitle: "Edit Text ✍️", fontLbl: "Font:", sizeLbl: "Size:",
        colorLbl: "Text Color", strokeLbl: "Stroke", placeholder: "Type your text here...",
        
        tabSupport: "🛠️ Support", tabCollab: "🤝 Collab",
        supTextPlc: "Describe your issue...", supAttachBtn: "📎 Attach Image (Optional)",
        colChannelPlc: "Channel ID (e.g., @channel)", colTgPlc: "Your Telegram ID", colExtraPlc: "Additional details...",
        supportSend: "Send 🚀", supportClose: "Close ❌",
        
        alertEmpty: "Please fill the required fields! 😅", 
        alertSuccessCollab: "Your request has been received! ✅",
        alertSuccessSupport: "Your message has been sent! ✅",
        alertError: "Oops! Something went wrong.",
        newTextDef: "New Text"
    },
    fa: {
        langTxt: "EN", landingTitle: "بامبو میم 🎋", landingDesc: "خلاقیتت رو رها کن!",
        startBtn: "🎨 ورود به میم‌ساز", supportBtnTxt: "پشتیبانی و همکاری", channelBtn: "📢 کانال ما",
        title: "میم‌ساز حرفه‌ای 🎨", uploadBtn: "📸 آپلود از گالری", loading: "⏳ دریافت تصاویر...",
        searchPlc: "🔍 جستجوی میم...", loadMoreBtn: "نمایش بیشتر", nextBtn: "مرحله بعد",
        backBtn: "بازگشت", downloadBtn: "ارسال به بات 📥", shareBtn: "اشتراک‌گذاری 🚀",
        backToMenuBtn: "🏠 منوی اصلی",
        addTextLbl: "افزودن متن", dir: "rtl", panelTitle: "ویرایش متن ✍️", fontLbl: "فونت:", sizeLbl: "اندازه:",
        colorLbl: "رنگ متن", strokeLbl: "حاشیه", placeholder: "متن خود را اینجا بنویسید...",
        
        tabSupport: "🛠️ پشتیبانی", tabCollab: "🤝 همکاری",
        supTextPlc: "مشکل یا سوالتون رو بنویسید...", supAttachBtn: "📎 ضمیمه عکس (اختیاری)",
        colChannelPlc: "آیدی کانال (مثال: mychannel@)", colTgPlc: "آیدی تلگرام شما", colExtraPlc: "توضیحات تکمیلی...",
        supportSend: "ارسال 🚀", supportClose: "بستن ❌",
        
        alertEmpty: "رئیس، لطفا فیلدهای لازم رو پر کن! 😅", 
        alertSuccessCollab: "درخواست شما ثبت شد! ✅",
        alertSuccessSupport: "پیام شما ارسال شد! ✅",
        alertError: "اوه! مشکلی پیش آمد.",
        newTextDef: "متن جدید"
    }
};

let currentLang = 'fa';
let fCanvas = null;
let selectedImageSrc = null;
let allMemes = [];
let filteredMemes = [];
let currentPage = 1;
const memesPerPage = 20;
let activeTab = 'support';

document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const landingPage = document.getElementById('landing-page');
    const appContainer = document.getElementById('app-container');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const templateGallery = document.getElementById('template-gallery');
    
    const supportModal = document.getElementById('support-modal');
    const tabSupportBtn = document.getElementById('tab-support-btn');
    const tabCollabBtn = document.getElementById('tab-collab-btn');
    const formSupportView = document.getElementById('form-support-view');
    const formCollabView = document.getElementById('form-collab-view');
    
    const supportText = document.getElementById('support-text');
    const supportFileUpload = document.getElementById('support-file-upload');
    const supportImgBtn = document.getElementById('support-img-btn');
    const supportFileName = document.getElementById('support-file-name');
    
    const collabChannel = document.getElementById('collab-channel');
    const collabTelegram = document.getElementById('collab-telegram');
    const collabExtra = document.getElementById('collab-extra');

    fetchTrendingMemes();

    // عبور کاملا ایمن از لودینگ
    setTimeout(function() {
        try {
            if (splashScreen) splashScreen.style.display = 'none';
            if (landingPage) landingPage.style.display = 'block';
            updateLanguage(currentLang);
        } catch (e) {
            if (splashScreen) splashScreen.style.display = 'none';
            if (landingPage) landingPage.style.display = 'block';
        }
    }, 2500);

    const startAppBtn = document.getElementById('start-app-btn');
    if (startAppBtn) {
        startAppBtn.addEventListener('click', function() {
            if (landingPage) landingPage.style.display = 'none';
            if (appContainer) appContainer.style.display = 'block';
        });
    }

    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', function() {
            if (appContainer) appContainer.style.display = 'none';
            if (landingPage) landingPage.style.display = 'block';
        });
    }

    const channelBtn = document.getElementById('channel-btn');
    if (channelBtn) channelBtn.addEventListener('click', function() { window.open('https://t.me/bamboo_network', '_blank'); });

    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', function() {
            currentLang = currentLang === 'fa' ? 'en' : 'fa';
            updateLanguage(currentLang);
        });
    }

    function safeSetText(id, text) { const el = document.getElementById(id); if (el) el.innerText = text; }
    function safeSetPlaceholder(id, text) { const el = document.getElementById(id); if (el) el.placeholder = text; }

    function updateLanguage(lang) {
        const t = translations[lang];
        const htmlTag = document.getElementById('html-tag');
        if (htmlTag) htmlTag.dir = t.dir;

        safeSetText('lang-text', t.langTxt);
        safeSetText('landing-title', t.landingTitle);
        safeSetText('landing-desc', t.landingDesc);
        safeSetText('start-app-btn', t.startBtn);
        safeSetText('channel-btn', t.channelBtn);
        safeSetText('title-text', t.title);
        safeSetText('upload-btn', t.uploadBtn);
        safeSetPlaceholder('search-input', t.searchPlc);
        safeSetText('load-more-btn', t.loadMoreBtn);
        safeSetText('next-btn', t.nextBtn);
        safeSetText('back-btn', t.backBtn);
        safeSetText('download-btn', t.downloadBtn);
        safeSetText('share-btn', t.shareBtn);
        safeSetText('back-to-menu-btn', t.backToMenuBtn);
        safeSetText('add-text-label', t.addTextLbl);
        safeSetText('panel-title', t.panelTitle);
        safeSetText('font-label', t.fontLbl);
        safeSetText('size-label', t.sizeLbl);
        safeSetText('color-lbl', t.colorLbl);
        safeSetText('stroke-lbl', t.strokeLbl);
        safeSetPlaceholder('text-input-field', t.placeholder);

        safeSetText('support-btn-txt', t.supportBtnTxt);
        safeSetText('tab-support-btn', t.tabSupport);
        safeSetText('tab-collab-btn', t.tabCollab);
        safeSetPlaceholder('support-text', t.supTextPlc);
        safeSetText('support-img-btn', t.supAttachBtn);
        safeSetPlaceholder('collab-channel', t.colChannelPlc);
        safeSetPlaceholder('collab-telegram', t.colTgPlc);
        safeSetPlaceholder('collab-extra', t.colExtraPlc);
        safeSetText('send-support-btn', t.supportSend);
        safeSetText('close-support-btn', t.supportClose);
    }

    const supportBtnMenu = document.getElementById('support-btn');
    if (supportBtnMenu) {
        supportBtnMenu.onclick = function() { if(supportModal) supportModal.style.display = 'block'; };
    }

    const closeSupportBtn = document.getElementById('close-support-btn');
    if (closeSupportBtn) {
        closeSupportBtn.onclick = function() { 
            if(supportModal) supportModal.style.display = 'none'; 
            if(supportText) supportText.value = ''; 
            if(collabChannel) collabChannel.value = '';
            if(collabTelegram) collabTelegram.value = '';
            if(collabExtra) collabExtra.value = '';
            if(supportFileUpload) supportFileUpload.value = '';
            if(supportFileName) supportFileName.style.display = 'none';
        };
    }

    if (tabSupportBtn && tabCollabBtn) {
        tabSupportBtn.onclick = function() {
            activeTab = 'support';
            tabSupportBtn.className = 'main-btn glass-btn-primary';
            tabCollabBtn.className = 'secondary-btn glass-btn-sec';
            if(formSupportView) formSupportView.style.display = 'block';
            if(formCollabView) formCollabView.style.display = 'none';
        };

        tabCollabBtn.onclick = function() {
            activeTab = 'collab';
            tabCollabBtn.className = 'main-btn glass-btn-primary';
            tabSupportBtn.className = 'secondary-btn glass-btn-sec';
            if(formSupportView) formSupportView.style.display = 'none';
            if(formCollabView) formCollabView.style.display = 'block';
        };
    }

    if (supportImgBtn && supportFileUpload) {
        supportImgBtn.onclick = function() { supportFileUpload.click(); };
        supportFileUpload.onchange = function(e) {
            if (e.target.files.length > 0 && supportFileName) {
                supportFileName.style.display = 'block';
            }
        };
    }

    const sendSupportBtn = document.getElementById('send-support-btn');
    if (sendSupportBtn) {
        sendSupportBtn.onclick = function() {
            const t = translations[currentLang];
            const originalText = sendSupportBtn.innerText;

            let senderInfo = "Web Browser";
            try {
                if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                    const u = tg.initDataUnsafe.user;
                    senderInfo = "ID: " + u.id + "\nName: " + (u.first_name || '') + " " + (u.last_name || '') + "\nUser: @" + (u.username || '');
                }
            } catch(err) {}

            if (activeTab === 'support') {
                const message = supportText ? supportText.value.trim() : "";
                const file = (supportFileUpload && supportFileUpload.files.length > 0) ? supportFileUpload.files[0] : null;

                if (!message && !file) { alert(t.alertEmpty); return; }

                sendSupportBtn.innerText = "⏳...";
                sendSupportBtn.disabled = true;

                if (file) {
                    const fd = new FormData();
                    fd.append('chat_id', ADMIN_CHAT_ID);
                    fd.append('photo', file);
                    fd.append('caption', "🛠 Support Ticket\n\n👤 Sender:\n" + senderInfo + "\n\n📝 Message:\n" + message);

                    fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendPhoto", { method: 'POST', body: fd })
                    .then(function(res) { return res.json(); }).then(function(data) {
                        if (data.ok) { alert(t.alertSuccessSupport); if(closeSupportBtn) closeSupportBtn.click(); } 
                        else { alert(t.alertError); }
                    }).catch(function() { alert(t.alertError); }).finally(function() { sendSupportBtn.innerText = originalText; sendSupportBtn.disabled = false; });
                } else {
                    const finalMsg = "🛠 Support Ticket\n\n👤 Sender:\n" + senderInfo + "\n\n📝 Message:\n" + message;
                    fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: finalMsg })
                    })
                    .then(function(res) { return res.json(); }).then(function(data) {
                        if (data.ok) { alert(t.alertSuccessSupport); if(closeSupportBtn) closeSupportBtn.click(); } 
                        else { alert(t.alertError); }
                    }).catch(function() { alert(t.alertError); }).finally(function() { sendSupportBtn.innerText = originalText; sendSupportBtn.disabled = false; });
                }

            } else if (activeTab === 'collab') {
                const ch = collabChannel ? collabChannel.value.trim() : "";
                const tgId = collabTelegram ? collabTelegram.value.trim() : "";
                const ex = collabExtra ? collabExtra.value.trim() : "";

                if (!ch && !tgId) { alert(t.alertEmpty); return; }

                sendSupportBtn.innerText = "⏳...";
                sendSupportBtn.disabled = true;

                const finalMsg = "🤝 Collab Request\n\n👤 Sender:\n" + senderInfo + "\n\n📢 Channel: " + ch + "\n👤 Admin ID: " + tgId + "\n📝 Extra:\n" + ex;

                fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: finalMsg })
                })
                .then(function(res) { return res.json(); }).then(function(data) {
                    if (data.ok) { alert(t.alertSuccessCollab); if(closeSupportBtn) closeSupportBtn.click(); } 
                    else { alert(t.alertError); }
                }).catch(function() { alert(t.alertError); }).finally(function() { sendSupportBtn.innerText = originalText; sendSupportBtn.disabled = false; });
            }
        };
    }

    function fetchTrendingMemes() {
        try {
            fetch('https://api.imgflip.com/get_memes').then(function(res) { return res.json(); }).then(function(data) {
                if (data.success) { allMemes = data.data.memes; filteredMemes = [].concat(allMemes); renderGallery(); }
            }).catch(function(e) {});
        } catch(e) {}
    }

    function renderGallery() {
        if (!templateGallery) return;
        if (currentPage === 1) templateGallery.innerHTML = '';
        const memesToShow = filteredMemes.slice((currentPage - 1) * memesPerPage, currentPage * memesPerPage);
        memesToShow.forEach(function(meme) {
            const img = document.createElement('img');
            img.src = meme.url; img.className = 'template-img'; img.crossOrigin = "anonymous";
            img.onclick = function() {
                document.querySelectorAll('.template-img').forEach(function(i) { i.classList.remove('selected'); });
                img.classList.add('selected'); selectedImageSrc = img.src;
                const nextBtn = document.getElementById('next-btn');
                if (nextBtn) nextBtn.disabled = false;
            };
            templateGallery.appendChild(img);
        });
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) loadMoreBtn.classList.toggle('hidden', (currentPage * memesPerPage) >= filteredMemes.length);
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.oninput = function(e) { filteredMemes = allMemes.filter(function(m) { return m.name.toLowerCase().includes(e.target.value.toLowerCase()); }); currentPage = 1; renderGallery(); };
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) loadMoreBtn.onclick = function() { currentPage++; renderGallery(); };

    const uploadBtn = document.getElementById('upload-btn');
    const imageUpload = document.getElementById('image-upload');
    if (uploadBtn && imageUpload) {
        uploadBtn.onclick = function() { imageUpload.click(); };
        imageUpload.onchange = function(e) {
            const file = e.target.files[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = function(ev) { selectedImageSrc = ev.target.result; goToStep2(); };
            reader.readAsDataURL(file);
        };
    }

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.onclick = goToStep2;

    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.onclick = function() { if(step2) step2.style.display = 'none'; if(step1) step1.style.display = 'block'; };

    // =====================================
    // منطق بوم و واترمارک @creat_meme_bot
    // =====================================
    function goToStep2() {
        if(step1) step1.style.display = 'none'; 
        if(step2) step2.style.display = 'block';
        initFabricCanvas(selectedImageSrc);
    }

    function initFabricCanvas(imgSrc) {
        if (fCanvas) fCanvas.dispose();
        fCanvas = new fabric.Canvas('meme-canvas');
        const canvasWrapper = document.querySelector('.canvas-wrapper');
        const containerWidth = canvasWrapper ? canvasWrapper.clientWidth : 300;
        
        fabric.Image.fromURL(imgSrc, function(img) {
            const scale = containerWidth / img.width;
            fCanvas.setWidth(containerWidth); fCanvas.setHeight(img.height * scale);
            fCanvas.setBackgroundImage(img, fCanvas.renderAll.bind(fCanvas), { scaleX: scale, scaleY: scale, originX: 'left', originY: 'top', crossOrigin: 'anonymous' });

            // اضافه کردن واترمارک
            const watermark = new fabric.Text('@creat_meme_bot', {
                left: containerWidth - 10,
                top: (img.height * scale) - 10,
                fontFamily: 'Poppins',
                fontSize: 16,
                fill: 'rgba(255, 255, 255, 0.7)',
                stroke: 'rgba(0, 0, 0, 0.9)',
                strokeWidth: 3,
                paintFirst: 'stroke',
                originX: 'right',
                originY: 'bottom',
                selectable: false,
                evented: false,
                fontWeight: 'bold',
                name: 'watermark'
            });
            fCanvas.add(watermark);

        }, { crossOrigin: 'anonymous' });

        fCanvas.on('selection:created', onTextSelected);
        fCanvas.on('selection:updated', onTextSelected);
        fCanvas.on('selection:cleared', onSelectionCleared);

        // واترمارک رو همیشه بالا نگه دار
        fCanvas.on('object:added', function(e) {
            if (e.target && e.target.name !== 'watermark') {
                const objs = fCanvas.getObjects();
                for(let i=0; i<objs.length; i++){
                    if(objs[i].name === 'watermark') { objs[i].bringToFront(); break; }
                }
            }
        });
    }

    function onTextSelected(e) {
        const activeObj = e.selected[0];
        if (activeObj && activeObj.type === 'text') {
            const addTextBtn = document.getElementById('add-text-btn');
            const editTools = document.getElementById('edit-tools');
            if(addTextBtn) addTextBtn.style.display = 'none';
            if(editTools) editTools.style.display = 'flex';
        }
    }

    function onSelectionCleared() {
        const addTextBtn = document.getElementById('add-text-btn');
        const editTools = document.getElementById('edit-tools');
        if(addTextBtn) addTextBtn.style.display = 'flex';
        if(editTools) editTools.style.display = 'none';
        closeEditPanel();
    }

    function openEditPanel() {
        const activeObj = fCanvas.getActiveObject();
        const textEditPanel = document.getElementById('text-edit-panel');
        const textInputField = document.getElementById('text-input-field');
        if (activeObj && activeObj.type === 'text' && activeObj.name !== 'watermark') {
            if (textEditPanel) textEditPanel.style.transform = 'translateY(0)';
            if (textInputField) textInputField.value = activeObj.text || '';
            if (document.getElementById('font-family')) document.getElementById('font-family').value = activeObj.fontFamily || 'Lalezar';
            if (document.getElementById('font-size')) document.getElementById('font-size').value = activeObj.fontSize || 40;
            if (document.getElementById('text-color')) document.getElementById('text-color').value = activeObj.fill || '#ffffff';
            if (document.getElementById('color-indicator')) document.getElementById('color-indicator').style.backgroundColor = activeObj.fill || '#ffffff';
            if (document.getElementById('stroke-color')) document.getElementById('stroke-color').value = activeObj.stroke || '#000000';
            if (document.getElementById('stroke-indicator')) document.getElementById('stroke-indicator').style.backgroundColor = activeObj.stroke || '#000000';
            setTimeout(function() { if(textInputField) textInputField.focus(); }, 300);
        }
    }

    const editTextBtn = document.getElementById('edit-text-btn');
    if(editTextBtn) editTextBtn.onclick = openEditPanel;

    const addTextBtn = document.getElementById('add-text-btn');
    if(addTextBtn) {
        addTextBtn.onclick = function() {
            if (!fCanvas) return;
            const t = translations[currentLang];
            const text = new fabric.Text(t.newTextDef, {
                left: fCanvas.width / 2, top: fCanvas.height / 2, fontFamily: 'Lalezar', fill: '#ffffff',
                fontSize: 40, fontWeight: 'bold', stroke: '#000000', strokeWidth: 2, originX: 'center', originY: 'center', paintFirst: 'stroke'
            });
            fCanvas.add(text).setActiveObject(text);
            const editTools = document.getElementById('edit-tools');
            if(addTextBtn) addTextBtn.style.display = 'none';
            if(editTools) editTools.style.display = 'flex';
            openEditPanel();
        };
    }

    const textInputField = document.getElementById('text-input-field');
    if(textInputField) {
        textInputField.oninput = function(e) { const active = fCanvas.getActiveObject(); if (active && active.type === 'text') { active.set('text', e.target.value); fCanvas.renderAll(); } };
    }

    if(document.getElementById('font-family')) document.getElementById('font-family').onchange = function(e) { const active = fCanvas.getActiveObject(); if (active && active.type === 'text') { active.set('fontFamily', e.target.value); fCanvas.renderAll(); } };
    if(document.getElementById('font-size')) document.getElementById('font-size').oninput = function(e) { const active = fCanvas.getActiveObject(); if (active && active.type === 'text') { active.set('fontSize', parseInt(e.target.value)); fCanvas.renderAll(); } };
    if(document.getElementById('text-color')) document.getElementById('text-color').oninput = function(e) { if(document.getElementById('color-indicator')) document.getElementById('color-indicator').style.backgroundColor = e.target.value; const active = fCanvas.getActiveObject(); if (active && active.type === 'text') { active.set('fill', e.target.value); fCanvas.renderAll(); } };
    if(document.getElementById('stroke-color')) document.getElementById('stroke-color').oninput = function(e) { if(document.getElementById('stroke-indicator')) document.getElementById('stroke-indicator').style.backgroundColor = e.target.value; const active = fCanvas.getActiveObject(); if (active && active.type === 'text') { active.set('stroke', e.target.value); fCanvas.renderAll(); } };

    function closeEditPanel() {
        const textEditPanel = document.getElementById('text-edit-panel');
        if(textEditPanel) textEditPanel.style.transform = 'translateY(120%)';
        if(textInputField) textInputField.blur();
    }
    
    const inlineCloseBtn = document.getElementById('inline-close-btn');
    if(inlineCloseBtn) inlineCloseBtn.onclick = closeEditPanel;

    const deleteTextBtn = document.getElementById('delete-text-btn');
    if(deleteTextBtn) {
        deleteTextBtn.onclick = function() { const active = fCanvas.getActiveObject(); if (active && active.name !== 'watermark') { fCanvas.remove(active); closeEditPanel(); fCanvas.discardActiveObject().renderAll(); } };
    }

    const downloadBtn = document.getElementById('download-btn');
    if(downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            let chatId = null;
            if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                chatId = tg.initDataUnsafe.user.id;
            }
            if (!chatId) return alert(currentLang === 'fa' ? "از داخل ربات تلگرام باز کنید" : "Open in bot");
            
            if (fCanvas) {
                fCanvas.discardActiveObject().renderAll();
                const dataURL = fCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 3 });
                fetch(dataURL).then(function(res) { return res.blob(); }).then(function(blob) {
                    const fd = new FormData(); fd.append('chat_id', chatId); fd.append('photo', blob, 'meme.png');
                    fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendPhoto", { method: 'POST', body: fd })
                    .then(function() { if (tg) tg.close(); });
                });
            }
        });
    }

    const shareBtn = document.getElementById('share-btn');
    if(shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (fCanvas) {
                fCanvas.discardActiveObject().renderAll();
                const dataURL = fCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 3 });
                fetch(dataURL).then(function(res) { return res.blob(); }).then(async function(blob) {
                    const file = new File([blob], "meme.png", { type: "image/png" });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file] }); }
                });
            }
        });
    }
});