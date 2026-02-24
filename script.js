const BOT_TOKEN = "8680179449:AAHb26-jsgM-Q92zEAeBxzM0ycHbpoJkAvk"; 
const ADMIN_CHAT_ID = "6156596236";

let tg = null;
try {
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.expand();
    }
} catch (e) {
    console.log("Telegram WebApp error", e);
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
        supportTitle: "Contact Admin 💎", supportDesc: "Write your request for support or collaboration.",
        supportPlc: "Your message...", supportSend: "Send 🚀", supportClose: "Close ❌",
        alertEmpty: "Please write a message first! 😅", alertSuccess: "Message sent successfully! ✅", alertError: "Oops! Something went wrong."
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
        supportTitle: "ارتباط با مدیریت 💎", supportDesc: "درخواست همکاری، اسپانسری یا مشکل خود را بنویسید.",
        supportPlc: "پیام شما...", supportSend: "ارسال 🚀", supportClose: "بستن ❌",
        alertEmpty: "رئیس، لطفا اول پیامت رو بنویس! 😅", alertSuccess: "پیام شما با موفقیت ارسال شد! ✅", alertError: "اوه! مشکلی پیش آمد."
    }
};

let currentLang = 'fa';
let fCanvas = null;
let selectedImageSrc = null;
let allMemes = [];
let filteredMemes = [];
let currentPage = 1;
const memesPerPage = 20;

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const landingPage = document.getElementById('landing-page');
    const appContainer = document.getElementById('app-container');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const templateGallery = document.getElementById('template-gallery');
    
    const textEditPanel = document.getElementById('text-edit-panel');
    const addTextBtn = document.getElementById('add-text-btn');
    const editTools = document.getElementById('edit-tools');
    const editTextBtn = document.getElementById('edit-text-btn');
    const deleteTextBtn = document.getElementById('delete-text-btn');
    const textInputField = document.getElementById('text-input-field');
    const inlineCloseBtn = document.getElementById('inline-close-btn');

    const supportBtn = document.getElementById('support-btn');
    const supportModal = document.getElementById('support-modal');
    const closeSupportBtn = document.getElementById('close-support-btn');
    const sendSupportBtn = document.getElementById('send-support-btn');
    const supportText = document.getElementById('support-text');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');

    fetchTrendingMemes();

    setTimeout(() => {
        try {
            if (splashScreen) splashScreen.style.display = 'none';if (landingPage) landingPage.style.display = 'block';
            updateLanguage(currentLang);
        } catch (error) {
            console.error(error);
            if (splashScreen) splashScreen.style.display = 'none';
            if (landingPage) landingPage.style.display = 'block';
        }
    }, 2500);

    const startAppBtn = document.getElementById('start-app-btn');
    if (startAppBtn) {
        startAppBtn.addEventListener('click', () => {
            if (landingPage) landingPage.style.display = 'none';
            if (appContainer) appContainer.style.display = 'block';
        });
    }

    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
            if (appContainer) appContainer.style.display = 'none';
            if (landingPage) landingPage.style.display = 'block';
        });
    }

    const channelBtn = document.getElementById('channel-btn');
    if (channelBtn) {
        channelBtn.addEventListener('click', () => window.open('https://t.me/bamboo_network', '_blank'));
    }

    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'fa' ? 'en' : 'fa';
            updateLanguage(currentLang);
        });
    }

    function safeSetText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    }

    function safeSetPlaceholder(id, text) {
        const el = document.getElementById(id);
        if (el) el.placeholder = text;
    }

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
        safeSetText('support-title', t.supportTitle);
        safeSetText('support-desc', t.supportDesc);
        safeSetPlaceholder('support-text', t.supportPlc);
        safeSetText('send-support-btn', t.supportSend);
        safeSetText('close-support-btn', t.supportClose);
    }

    if (supportBtn && supportModal) {
        supportBtn.onclick = () => { supportModal.style.display = 'block'; };
    }

    if (closeSupportBtn && supportModal) {
        closeSupportBtn.onclick = () => { 
            supportModal.style.display = 'none'; 
            if(supportText) supportText.value = ''; 
        };
    }

    if (sendSupportBtn) {
        sendSupportBtn.onclick = () => {
            const message = supportText ? supportText.value.trim() : "";
            const t = translations[currentLang];
            
            if (!message) { alert(t.alertEmpty); return; }
            
            const originalText = sendSupportBtn.innerText;
            sendSupportBtn.innerText = "⏳...";
            sendSupportBtn.disabled = true;

            const finalMessage = "🌟 <b>پشتیبانی و همکاری (بامبو میم)</b>\n\n💬 پیام:\n" + message;

            fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: finalMessage, parse_mode: "HTML" })
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    alert(t.alertSuccess);
                    if (supportModal) supportModal.style.display = 'none';
                    if (supportText) supportText.value = '';
                } else { 
                    alert(t.alertError); 
                }
            })
            .catch(() => alert(t.alertError))
            .finally(() => {
                sendSupportBtn.innerText = originalText;
                sendSupportBtn.disabled = false;
            });
        };
    }

    function fetchTrendingMemes() {
        try {
            fetch('https://api.imgflip.com/get_memes').then(res => res.json()).then(data => {
                if (data.success) { 
                    allMemes = data.data.memes; 
                    filteredMemes = [...allMemes]; 
                    renderGallery(); 
                }
            }).catch(e => console.log(e));
        } catch(e) {}
    }

    function renderGallery() {
        if (!templateGallery) return;
        if (currentPage === 1) templateGallery.innerHTML = '';
        const memesToShow = filteredMemes.slice((currentPage - 1) * memesPerPage, currentPage * memesPerPage);
        memesToShow.forEach(meme => {
            const img = document.createElement('img');
            img.src = meme.url; 
            img.className = 'template-img'; 
            img.crossOrigin = "anonymous";
            img.onclick = () => {
                document.querySelectorAll('.template-img').forEach(i => i.classList.remove('selected'));
                img.classList.add('selected'); 
                selectedImageSrc = img.src;
                const nextBtn = document.getElementById('next-btn');
                if (nextBtn) nextBtn.disabled = false;
            };
            templateGallery.appendChild(img);
        });
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.classList.toggle('hidden', (currentPage * memesPerPage) >= filteredMemes.length);
        }
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.oninput = (e) => {
            filteredMemes = allMemes.filter(m => m.name.toLowerCase().includes(e.target.value.toLowerCase()));
            currentPage = 1; 
            renderGallery();
        };
    }
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.onclick = () => { currentPage++; renderGallery(); };
    }

    const uploadBtn = document.getElementById('upload-btn');
    const imageUpload = document.getElementById('image-upload');
    if (uploadBtn && imageUpload) {
        uploadBtn.onclick = () => imageUpload.click();
        imageUpload.onchange = (e) => {
            const file = e.target.files[0]; 
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => { 
                selectedImageSrc = ev.target.result; 
                goToStep2(); 
            };
            reader.readAsDataURL(file);
        };
    }

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.onclick = goToStep2;

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.onclick = () => { 
            if(step2) step2.style.display = 'none'; 
            if(step1) step1.style.display = 'block'; 
        };
    }

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
        
        fabric.Image.fromURL(imgSrc, (img) => {
            const scale = containerWidth / img.width;
            fCanvas.setWidth(containerWidth); 
            fCanvas.setHeight(img.height * scale);
            fCanvas.setBackgroundImage(img, fCanvas.renderAll.bind(fCanvas), {
                scaleX: scale, scaleY: scale, originX: 'left', originY: 'top', crossOrigin: 'anonymous'
            });
        }, { crossOrigin: 'anonymous' });

        fCanvas.on('selection:created', onTextSelected);
        fCanvas.on('selection:updated', onTextSelected);
        fCanvas.on('selection:cleared', onSelectionCleared);
    }

    function onTextSelected(e) {
        const activeObj = e.selected[0];
        if (activeObj && activeObj.type === 'text') {
            if(addTextBtn) addTextBtn.style.display = 'none';
            if(editTools) editTools.style.display = 'flex';
        }
    }

    function onSelectionCleared() {
        if(addTextBtn) addTextBtn.style.display = 'flex';
        if(editTools) editTools.style.display = 'none';
        closeEditPanel();
    }

    function openEditPanel() {
        const activeObj = fCanvas.getActiveObject();
        if (activeObj && activeObj.type === 'text') {
            if (textEditPanel) textEditPanel.style.transform = 'translateY(0)';
            
            if (textInputField) textInputField.value = activeObj.text || '';
            const fontFamilySel = document.getElementById('font-family');
            if (fontFamilySel) fontFamilySel.value = activeObj.fontFamily || 'Lalezar';
            
            const fontSizeRange = document.getElementById('font-size');
            if (fontSizeRange) fontSizeRange.value = activeObj.fontSize || 40;
            
            const textColor = document.getElementById('text-color');
            if (textColor) textColor.value = activeObj.fill || '#ffffff';
            
            const colorIndicator = document.getElementById('color-indicator');
            if (colorIndicator) colorIndicator.style.backgroundColor = activeObj.fill || '#ffffff';
            
            const strokeColor = document.getElementById('stroke-color');
            if (strokeColor) strokeColor.value = activeObj.stroke || '#000000';
            
            const strokeIndicator = document.getElementById('stroke-indicator');
            if (strokeIndicator) strokeIndicator.style.backgroundColor = activeObj.stroke || '#000000';
            
            setTimeout(() => { if(textInputField) textInputField.focus(); }, 300);
        }
    }

    if(editTextBtn) editTextBtn.onclick = openEditPanel;

    if(addTextBtn) {
        addTextBtn.onclick = () => {
            if (!fCanvas) return;
            const initialText = currentLang === 'fa' ? 'متن جدید' : 'New Text';
            const text = new fabric.Text(initialText, {
                left: fCanvas.width / 2, top: fCanvas.height / 2, 
                fontFamily: 'Lalezar', fill: '#ffffff',
                fontSize: 40, fontWeight: 'bold', stroke: '#000000', strokeWidth: 2,
                originX: 'center', originY: 'center', paintFirst: 'stroke'
            });
            fCanvas.add(text).setActiveObject(text);
            
            if(addTextBtn) addTextBtn.style.display = 'none';
            if(editTools) editTools.style.display = 'flex';
            openEditPanel();
        };
    }

    if(textInputField) {
        textInputField.oninput = (e) => {
            const active = fCanvas.getActiveObject();
            if (active && active.type === 'text') { active.set('text', e.target.value); fCanvas.renderAll(); }
        };
    }

    const fontFamilySel = document.getElementById('font-family');
    if(fontFamilySel) {
        fontFamilySel.onchange = (e) => { 
            const active = fCanvas.getActiveObject(); 
            if (active && active.type === 'text') { active.set('fontFamily', e.target.value); fCanvas.renderAll(); } 
        };
    }
    
    const fontSizeRange = document.getElementById('font-size');
    if(fontSizeRange) {
        fontSizeRange.oninput = (e) => { 
            const active = fCanvas.getActiveObject(); 
            if (active && active.type === 'text') { active.set('fontSize', parseInt(e.target.value)); fCanvas.renderAll(); } 
        };
    }
    
    const textColor = document.getElementById('text-color');
    if(textColor) {
        textColor.oninput = (e) => { 
            const colorIndicator = document.getElementById('color-indicator');
            if(colorIndicator) colorIndicator.style.backgroundColor = e.target.value; 
            const active = fCanvas.getActiveObject(); 
            if (active && active.type === 'text') { active.set('fill', e.target.value); fCanvas.renderAll(); } 
        };
    }
    
    const strokeColor = document.getElementById('stroke-color');
    if(strokeColor) {
        strokeColor.oninput = (e) => { 
            const strokeIndicator = document.getElementById('stroke-indicator');
            if(strokeIndicator) strokeIndicator.style.backgroundColor = e.target.value; 
            const active = fCanvas.getActiveObject(); 
            if (active && active.type === 'text') { active.set('stroke', e.target.value); fCanvas.renderAll(); } 
        };
    }

    function closeEditPanel() {
        if(textEditPanel) textEditPanel.style.transform = 'translateY(120%)';
        if(textInputField) textInputField.blur();
    }
    
    if(inlineCloseBtn) inlineCloseBtn.onclick = closeEditPanel;

    if(deleteTextBtn) {
        deleteTextBtn.onclick = () => {
            const active = fCanvas.getActiveObject();
            if (active) { 
                fCanvas.remove(active); 
                closeEditPanel(); 
                fCanvas.discardActiveObject().renderAll(); 
            }
        };
    }

    const downloadBtn = document.getElementById('download-btn');
    if(downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const chatId = tg?.initDataUnsafe?.user?.id;
            if (!chatId) return alert(currentLang === 'fa' ? "از داخل ربات تلگرام باز کنید" : "Open in bot");
            if (fCanvas) {
                fCanvas.discardActiveObject().renderAll();
                const dataURL = fCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 3 });
                fetch(dataURL).then(res => res.blob()).then(blob => {
                    const fd = new FormData(); 
                    fd.append('chat_id', chatId); 
                    fd.append('photo', blob, 'meme.png');
                    fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendPhoto", { method: 'POST', body: fd })
                    .then(() => { if (tg) tg.close(); });
                });
            }
        });
    }

    const shareBtn = document.getElementById('share-btn');
    if(shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (fCanvas) {
                fCanvas.discardActiveObject().renderAll();
                const dataURL = fCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 3 });
                fetch(dataURL).then(res => res.blob()).then(async blob => {
                    const file = new File([blob], "meme.png", { type: "image/png" });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        navigator.share({ files: [file] });
                    }
                });
            }
        });
    }
});