const BOT_TOKEN = "8680179449:AAHb26-jsgM-Q92zEAeBxzM0ycHbpoJkAvk"; 
const ADMIN_CHAT_ID = "6156596236"; // آیدی تو اضافه شد

let tg = null;
if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.expand();
}

const translations = {
    en: {
        langTxt: "FA", landingTitle: "Bamboo Meme 🎋", landingDesc: "Unleash your creativity!",
        startBtn: "🎨 Start Meme Maker", supportBtn: "💬 Support", channelBtn: "📢 Channel",
        title: "Meme Maker 🎨", uploadBtn: "📸 Upload from Gallery", loading: "⏳ Loading...",
        searchPlc: "🔍 Search memes...", loadMoreBtn: "⬇️ Load More", nextBtn: "Next Step ➡️",
        backBtn: "⬅️ Back", downloadBtn: "⬇️ Send to Bot", shareBtn: "🚀 Share",
        addTextLbl: "Add Text", dir: "ltr", panelTitle: "Edit Text ✍️", fontLbl: "Font:", sizeLbl: "Size:",
        colorLbl: "Text Color", strokeLbl: "Stroke", placeholder: "Type your text here...",
        // ترجمه‌های جدید برای بخش اسپانسر:
        sponsorBtnTxt: "Sponsorship", sponsorTitle: "Sponsorship Request 💎", sponsorDesc: "Write your details to send directly to the admin.",
        sponsorPlc: "Hi, I would like to request...", sponsorSend: "🚀 Send", sponsorClose: "❌ Close",
        alertEmpty: "Please write a message first! 😅", alertSuccess: "Message sent successfully! ✅", alertError: "Oops! Something went wrong."
    },
    fa: {
        langTxt: "EN", landingTitle: "بامبو میم 🎋", landingDesc: "خلاقیتت رو رها کن!",
        startBtn: "🎨 ورود به میم‌ساز", supportBtn: "💬 پشتیبانی", channelBtn: "📢 کانال ما",
        title: "میم‌ساز حرفه‌ای 🎨", uploadBtn: "📸 آپلود از گالری", loading: "⏳ دریافت تصاویر...",
        searchPlc: "🔍 جستجوی میم...", loadMoreBtn: "⬇️ نمایش بیشتر", nextBtn: "مرحله بعد ⬅️",
        backBtn: "➡️ بازگشت", downloadBtn: "⬇️ ارسال به بات", shareBtn: "🚀 اشتراک‌گذاری",
        addTextLbl: "افزودن متن", dir: "rtl", panelTitle: "ویرایش متن ✍️", fontLbl: "فونت:", sizeLbl: "اندازه:",
        colorLbl: "رنگ متن", strokeLbl: "حاشیه", placeholder: "متن خود را اینجا بنویسید...",
        // ترجمه‌های جدید برای بخش اسپانسر:
        sponsorBtnTxt: "درخواست اسپانسری", sponsorTitle: "درخواست اسپانسری 💎", sponsorDesc: "مشخصات و درخواست خود را بنویسید تا به مدیریت ارسال شود.",
        sponsorPlc: "سلام، من مدیر کانال...", sponsorSend: "🚀 ارسال پیام", sponsorClose: "❌ بستن",
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

    // === المان‌های مربوط به اسپانسر ===
    const sponsorModal = document.getElementById('sponsor-modal');
    const sponsorText = document.getElementById('sponsor-text');

    fetchTrendingMemes();

    setTimeout(() => {
        if (splashScreen && landingPage) {
            splashScreen.style.display = 'none';
            landingPage.style.display = 'block';
            updateLanguage(currentLang);
        }
    }, 2500);

    document.getElementById('start-app-btn')?.addEventListener('click', () => {landingPage.style.display = 'none';
        appContainer.style.display = 'block';
    });

    document.getElementById('support-btn')?.addEventListener('click', () => window.open('https://t.me/blo_old', '_blank'));
    document.getElementById('channel-btn')?.addEventListener('click', () => window.open('https://t.me/bamboo_network', '_blank'));

    document.getElementById('lang-btn')?.addEventListener('click', () => {
        currentLang = currentLang === 'fa' ? 'en' : 'fa';
        updateLanguage(currentLang);
    });

    function updateLanguage(lang) {
        const t = translations[lang];
        document.getElementById('html-tag').dir = t.dir;
        document.getElementById('lang-text').innerText = t.langTxt;
        document.getElementById('landing-title').innerText = t.landingTitle;
        document.getElementById('landing-desc').innerText = t.landingDesc;
        document.getElementById('start-app-btn').innerText = t.startBtn;
        document.getElementById('support-btn').innerText = t.supportBtn;
        document.getElementById('channel-btn').innerText = t.channelBtn;
        document.getElementById('title-text').innerText = t.title;
        document.getElementById('upload-btn').innerText = t.uploadBtn;
        document.getElementById('search-input').placeholder = t.searchPlc;
        document.getElementById('load-more-btn').innerText = t.loadMoreBtn;
        document.getElementById('next-btn').innerText = t.nextBtn;
        document.getElementById('back-btn').innerText = t.backBtn;
        document.getElementById('download-btn').innerText = t.downloadBtn;
        document.getElementById('share-btn').innerText = t.shareBtn;
        document.getElementById('add-text-label').innerText = t.addTextLbl;
        document.getElementById('panel-title').innerText = t.panelTitle;
        document.getElementById('font-label').innerText = t.fontLbl;
        document.getElementById('size-label').innerText = t.sizeLbl;
        document.getElementById('color-lbl').innerText = t.colorLbl;
        document.getElementById('stroke-lbl').innerText = t.strokeLbl;
        textInputField.placeholder = t.placeholder;

        // ترجمه‌های دکمه اسپانسر
        if(document.getElementById('sponsor-btn-txt')) document.getElementById('sponsor-btn-txt').innerText = t.sponsorBtnTxt;
        if(document.getElementById('sponsor-title')) document.getElementById('sponsor-title').innerText = t.sponsorTitle;
        if(document.getElementById('sponsor-desc')) document.getElementById('sponsor-desc').innerText = t.sponsorDesc;
        if(document.getElementById('sponsor-text')) document.getElementById('sponsor-text').placeholder = t.sponsorPlc;
        if(document.getElementById('send-sponsor-btn')) document.getElementById('send-sponsor-btn').innerText = t.sponsorSend;
        if(document.getElementById('close-sponsor-btn')) document.getElementById('close-sponsor-btn').innerText = t.sponsorClose;
    }

    // === منطق باز و بسته شدن و ارسال اسپانسر ===
    document.getElementById('sponsor-btn')?.addEventListener('click', () => {
        sponsorModal.style.display = 'block';
    });

    document.getElementById('close-sponsor-btn')?.addEventListener('click', () => {
        sponsorModal.style.display = 'none';
        sponsorText.value = '';
    });

    document.getElementById('send-sponsor-btn')?.addEventListener('click', () => {
        const message = sponsorText.value.trim();
        const t = translations[currentLang];
        
        if (!message) return alert(t.alertEmpty);
        
        const btn = document.getElementById('send-sponsor-btn');
        const originalText = btn.innerText;
        btn.innerText = "⏳...";
        btn.disabled = true;

        const finalMessage = 🌟 <b>درخواست اسپانسری (بامبو میم)</b>\n\n💬 پیام:\n${message};

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: finalMessage, parse_mode: "HTML" })
        })
        .then(res => res.json())
        .then(data => {
            if (data.ok) {
                alert(t.alertSuccess);
                sponsorModal.style.display = 'none';
                sponsorText.value = '';
            } else {
                alert(t.alertError);
            }
        })
        .catch(() => alert(t.alertError))
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
    });

    function fetchTrendingMemes() {
        fetch('https://api.imgflip.com/get_memes').then(res => res.json()).then(data => {
            if (data.success) { allMemes = data.data.memes; filteredMemes = [...allMemes]; renderGallery(); }
        });
    }

    function renderGallery() {
        if (!templateGallery) return;
        if (currentPage === 1) templateGallery.innerHTML = '';
        const memesToShow = filteredMemes.slice((currentPage - 1) * memesPerPage, currentPage * memesPerPage);
        memesToShow.forEach(meme => {
            const img = document.createElement('img');
            img.src = meme.url; img.className = 'template-img'; img.crossOrigin = "anonymous";
            img.onclick = () => {
                document.querySelectorAll('.template-img').forEach(i => i.classList.remove('selected'));
                img.classList.add('selected'); selectedImageSrc = img.src;
                document.getElementById('next-btn').disabled = false;
            };
            templateGallery.appendChild(img);
        });
        document.getElementById('load-more-btn')?.classList.toggle('hidden', (currentPage * memesPerPage) >= filteredMemes.length);
    }

    document.getElementById('search-input').oninput = (e) => {
        filteredMemes = allMemes.filter(m => m.name.toLowerCase().includes(e.target.value.toLowerCase()));
        currentPage = 1; renderGallery();
    };
    document.getElementById('load-more-btn').onclick = () => { currentPage++; renderGallery(); };

    document.getElementById('upload-btn').onclick = () => document.getElementById('image-upload').click();
    document.getElementById('image-upload').onchange = (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => { selectedImageSrc = ev.target.result; goToStep2(); };
        reader.readAsDataURL(file);
    };

    document.getElementById('next-btn').onclick = goToStep2;
    document.getElementById('back-btn').onclick = () => { step2.style.display = 'none'; step1.style.display = 'block'; };

    function goToStep2() {
        step1.style.display = 'none'; step2.style.display = 'block';
        initFabricCanvas(selectedImageSrc);
    }

    function initFabricCanvas(imgSrc) {
        if (fCanvas) fCanvas.dispose();
        fCanvas = new fabric.Canvas('meme-canvas');
        const containerWidth = document.querySelector('.canvas-wrapper').clientWidth;
        
        fabric.Image.fromURL(imgSrc, (img) => {
            const scale = containerWidth / img.width;
            fCanvas.setWidth(containerWidth); fCanvas.setHeight(img.height * scale);
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
            addTextBtn.style.display = 'none';
            editTools.style.display = 'flex';
        }
    }

    function onSelectionCleared() {
        addTextBtn.style.display = 'flex';
        editTools.style.display = 'none';
        closeEditPanel();
    }

    function openEditPanel() {
        const activeObj = fCanvas.getActiveObject();
        if (activeObj && activeObj.type === 'text') {
            textEditPanel.style.transform = 'translateY(0)';
            
            textInputField.value = activeObj.text || '';
            document.getElementById('font-family').value = activeObj.fontFamily || 'Lalezar';
            document.getElementById('font-size').value = activeObj.fontSize || 40;
            document.getElementById('text-color').value = activeObj.fill || '#ffffff';
            document.getElementById('color-indicator').style.backgroundColor = activeObj.fill || '#ffffff';
            document.getElementById('stroke-color').value = activeObj.stroke || '#000000';
            document.getElementById('stroke-indicator').style.backgroundColor = activeObj.stroke || '#000000';
            
            setTimeout(() => textInputField.focus(), 300);
        }
    }

    editTextBtn.onclick = openEditPanel;

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
        
        addTextBtn.style.display = 'none';
        editTools.style.display = 'flex';
        openEditPanel();
    };

    textInputField.oninput = (e) => {
        const active = fCanvas.getActiveObject();
        if (active && active.type === 'text') { active.set('text', e.target.value); fCanvas.renderAll(); }
    };

    document.getElementById('font-family').onchange = (e) => {
        const active = fCanvas.getActiveObject();
        if (active && active.type === 'text') { active.set('fontFamily', e.target.value); fCanvas.renderAll(); }
    };
    document.getElementById('font-size').oninput = (e) => {
        const active = fCanvas.getActiveObject();
        if (active && active.type === 'text') { active.set('fontSize', parseInt(e.target.value)); fCanvas.renderAll(); }
    };
    document.getElementById('text-color').oninput = (e) => {
        document.getElementById('color-indicator').style.backgroundColor = e.target.value;
        const active = fCanvas.getActiveObject();
        if (active && active.type === 'text') { active.set('fill', e.target.value); fCanvas.renderAll(); }
    };
    document.getElementById('stroke-color').oninput = (e) => {
        document.getElementById('stroke-indicator').style.backgroundColor = e.target.value;
        const active = fCanvas.getActiveObject();
        if (active && active.type === 'text') { active.set('stroke', e.target.value); fCanvas.renderAll(); }
    };

    function closeEditPanel() {
        textEditPanel.style.transform = 'translateY(120%)';
        textInputField.blur();
    }
    
    inlineCloseBtn.onclick = closeEditPanel;

    deleteTextBtn.onclick = () => {
        const active = fCanvas.getActiveObject();
        if (active) { 
            fCanvas.remove(active); 
            closeEditPanel();
            fCanvas.discardActiveObject().renderAll();
        }
    };

    document.getElementById('download-btn')?.addEventListener('click', () => {
        const chatId = tg?.initDataUnsafe?.user?.id;if (!chatId) return alert(currentLang === 'fa' ? "از داخل ربات تلگرام باز کنید" : "Open in bot");
        fCanvas.discardActiveObject().renderAll();
        
        const dataURL = fCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 3 });
        
        fetch(dataURL).then(res => res.blob()).then(blob => {
            const fd = new FormData(); fd.append('chat_id', chatId); fd.append('photo', blob, 'meme.png');
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: 'POST', body: fd }).then(() => tg.close());
        });
    });

    document.getElementById('share-btn')?.addEventListener('click', () => {
        fCanvas.discardActiveObject().renderAll();
        
        const dataURL = fCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 3 });
        
        fetch(dataURL).then(res => res.blob()).then(async blob => {
            const file = new File([blob], "meme.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file] });
        });
    });
});