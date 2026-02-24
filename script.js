var BOT_TOKEN = "8680179449:AAHb26-jsgM-Q92zEAeBxzM0ycHbpoJkAvk"; 
var ADMIN_CHAT_ID = "6156596236";

var tg = null;
try {
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        tg.expand();
    }
} catch (e) {}

var translations = {
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
        newTextDef: "New Text",
        
        storeTitle: "Stars Store ⭐",
        storeDescText: "Current Balance:",
        confirmPurchase: "Do you want to purchase {amount} Stars?",
        processing: "⏳ Processing...",
        purchaseSuccess: "Payment successful! Your wallet has been charged. ✅",
        storeTermsTitle: "Terms & Conditions ⚠️",
        storeTermsDesc: "All purchases are at your own risk. Due to Telegram's rules, refund requests are not possible. Please proceed with caution.",
        
        // ترجمه‌های جدید جوین اجباری
        joinTitle: "Mandatory Join 🚨",
        joinDesc: "To use the app, please join our channel first.",
        joinBtn: "📢 Join Channel",
        checkJoinBtn: "🔄 I Joined (Check)",
        closeJoinBtn: "❌ Close",
        notJoinedAlert: "You haven't joined yet! 😅"
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
        newTextDef: "متن جدید",
        
        storeTitle: "فروشگاه استارز ⭐",
        storeDescText: "موجودی فعلی شما:",
        confirmPurchase: "آیا از خرید {amount} استارز مطمئن هستید؟",
        processing: "⏳ در حال پردازش...",
        purchaseSuccess: "پرداخت موفقیت‌آمیز بود! کیف پول شما شارژ شد. ✅",
        storeTermsTitle: "قوانین و مقررات ⚠️",
        storeTermsDesc: "خریدهای شما با مسئولیت خودتون هستش و بخاطر شرایط و محدودیت‌های تلگرام درخواست برگشت وجه مقدور نمی‌باشد. لطفاً در خرید خود دقت کنید.",
        
        // ترجمه‌های جدید جوین اجباری
        joinTitle: "عضویت اجباری 🚨",
        joinDesc: "برای استفاده از ربات لطفا ابتدا در کانال ما عضو شوید.",
        joinBtn: "📢 عضویت در کانال",
        checkJoinBtn: "🔄 عضو شدم (بررسی)",
        closeJoinBtn: "❌ بستن",
        notJoinedAlert: "هنوز عضو نشدید رئیس! 😅"
    }
};

var currentLang = 'fa';
var fCanvas = null;
var selectedImageSrc = null;
var allMemes = [];
var filteredMemes = [];
var currentPage = 1;
var memesPerPage = 20;

var activeTab = 'support';
var userStars = 0; 
var previousScreen = null; 

document.addEventListener('DOMContentLoaded', function() {
    var splashScreen = document.getElementById('splash-screen');
    var landingPage = document.getElementById('landing-page');
    var appContainer = document.getElementById('app-container');
    var step1 = document.getElementById('step-1');
    var step2 = document.getElementById('step-2');
    var templateGallery = document.getElementById('template-gallery');
    
    // المان‌های جدید برای جوین اجباری
    var forceJoinModal = document.getElementById('force-join-modal');
    var joinChannelBtn = document.getElementById('join-channel-btn');
    var checkJoinBtn = document.getElementById('check-join-btn');
    var closeJoinBtn = document.getElementById('close-join-btn');

    var supportModal = document.getElementById('support-modal');
    var tabSupportBtn = document.getElementById('tab-support-btn');
    var tabCollabBtn = document.getElementById('tab-collab-btn');
    var formSupportView = document.getElementById('form-support-view');
    var formCollabView = document.getElementById('form-collab-view');
    var supportText = document.getElementById('support-text');
    var supportFileUpload = document.getElementById('support-file-upload');
    var supportImgBtn = document.getElementById('support-img-btn');
    var supportFileName = document.getElementById('support-file-name');
    var collabChannel = document.getElementById('collab-channel');
    var collabTelegram = document.getElementById('collab-telegram');
    var collabExtra = document.getElementById('collab-extra');

    var walletBtn = document.getElementById('wallet-btn');
    var walletBalance = document.getElementById('wallet-balance');
    var storePage = document.getElementById('store-page');
    var storeBalanceText = document.getElementById('store-balance-text');
    var backFromStoreBtn = document.getElementById('back-from-store-btn');
    var buyButtons = document.querySelectorAll('.buy-stars-btn');

    fetchTrendingMemes();

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

    function safeSetText(id, text) { var el = document.getElementById(id); if (el) el.innerText = text; }
    function safeSetPlaceholder(id, text) { var el = document.getElementById(id); if (el) el.placeholder = text; }

    function updateLanguage(lang) {
        var t = translations[lang];
        var htmlTag = document.getElementById('html-tag');
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
        
        safeSetText('store-title', t.storeTitle);
        safeSetText('store-desc-text', t.storeDescText);
        safeSetText('back-from-store-btn', "⬅️ " + t.backBtn);
        safeSetText('store-terms-title', t.storeTermsTitle);
        safeSetText('store-terms-desc', t.storeTermsDesc);

        // آپدیت متن‌های جوین اجباری
        safeSetText('join-title', t.joinTitle);
        safeSetText('join-desc', t.joinDesc);
        safeSetText('join-channel-btn', t.joinBtn);
        safeSetText('check-join-btn', t.checkJoinBtn);
        safeSetText('close-join-btn', t.closeJoinBtn);
    }

    var langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.onclick = function() {
            currentLang = currentLang === 'fa' ? 'en' : 'fa';
            updateLanguage(currentLang);
        };
    }

    // =====================================
    // منطق بررسی عضویت (جوین اجباری)
    // =====================================
    function checkMembership(callback) {
        var userId = null;
        try {
            if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                userId = tg.initDataUnsafe.user.id;
            }
        } catch(e) {}

        // اگر کاربر از مرورگر وب (خارج از تلگرام) اومد، برای تست ردش می‌کنیم بره
        if (!userId) {
            callback(true);
            return;
        }

        fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/getChatMember?chat_id=@bamboo_network&user_id=" + userId)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.ok) {
                var status = data.result.status;
                if (status === 'member' || status === 'administrator' || status === 'creator') {
                    callback(true);
                } else {
                    callback(false);
                }
            } else {
                // اگر ربات ادمین کانال نباشه ارور میده، اینجا می‌ذاریم موقتاً رد بشه تا برنامه قفل نشه
                console.log("Bot is not admin in channel or error occurred.");
                callback(false);
            }
        }).catch(function() { callback(false); });
    }

    var startAppBtn = document.getElementById('start-app-btn');
    if (startAppBtn) {
        startAppBtn.onclick = function() {
            var origTxt = startAppBtn.innerText;
            startAppBtn.innerText = "⏳...";
            checkMembership(function(isMember) {
                startAppBtn.innerText = origTxt;
                if (isMember) {
                    if (landingPage) landingPage.style.display = 'none';
                    if (appContainer) appContainer.style.display = 'block';
                } else {
                    if (forceJoinModal) forceJoinModal.style.display = 'block';
                }
            });
        };
    }

    if (joinChannelBtn) {
        joinChannelBtn.onclick = function() { window.open('https://t.me/bamboo_network', '_blank'); };
    }

    if (closeJoinBtn) {
        closeJoinBtn.onclick = function() { if (forceJoinModal) forceJoinModal.style.display = 'none'; };
    }

    if (checkJoinBtn) {
        checkJoinBtn.onclick = function() {
            var t = translations[currentLang];
            var origTxt = checkJoinBtn.innerText;
            checkJoinBtn.innerText = "⏳...";
            checkMembership(function(isMember) {
                checkJoinBtn.innerText = origTxt;
                if (isMember) {
                    if (forceJoinModal) forceJoinModal.style.display = 'none';
                    if (landingPage) landingPage.style.display = 'none';
                    if (appContainer) appContainer.style.display = 'block';
                } else {
                    alert(t.notJoinedAlert);
                }
            });
        };
    }

    // =====================================
    // بقیه دکمه‌های ناوبری (مخفی کردن کیف پول تو صفحه ادیت)
    // =====================================
    var backToMenuBtn = document.getElementById('back-to-menu-btn');
    if (backToMenuBtn) {
        backToMenuBtn.onclick = function() {
            if (appContainer) appContainer.style.display = 'none';
            if (landingPage) landingPage.style.display = 'block';
            if (walletBtn) walletBtn.style.display = 'flex'; // نشون دادن کیف پول در منو
        };
    }

    var channelBtn = document.getElementById('channel-btn');
    if (channelBtn) channelBtn.onclick = function() { window.open('https://t.me/bamboo_network', '_blank'); };

    if (walletBtn) {
        walletBtn.onclick = function() {
            if (landingPage && landingPage.style.display !== 'none') {
                previousScreen = landingPage;
            } else if (appContainer && appContainer.style.display !== 'none') {
                previousScreen = appContainer;
            }
            
            if (landingPage) landingPage.style.display = 'none';
            if (appContainer) appContainer.style.display = 'none';
            if (storePage) storePage.style.display = 'block';
            if (storeBalanceText) storeBalanceText.innerText = userStars;
            if (walletBtn) walletBtn.style.display = 'none'; // مخفی کردن کیف پول تو صفحه فروشگاه
        };
    }

    if (backFromStoreBtn) {
        backFromStoreBtn.onclick = function() {
            if (storePage) storePage.style.display = 'none';
            if (previousScreen) {
                previousScreen.style.display = 'block';
            } else if (landingPage) {
                landingPage.style.display = 'block';
            }
            if (walletBtn) walletBtn.style.display = 'flex'; // برگردوندن کیف پول
        };
    }

    for (var i = 0; i < buyButtons.length; i++) {
        buyButtons[i].onclick = function() {
            var amount = parseInt(this.getAttribute('data-amount'));
            var t = translations[currentLang];
            
            if (confirm(t.confirmPurchase.replace('{amount}', amount))) {
                var originalHTML = this.innerHTML;
                this.innerHTML = t.processing;
                this.disabled = true;
                
                var btnElement = this;

                setTimeout(function() {
                    userStars += amount; 
                    if (walletBalance) walletBalance.innerText = userStars;
                    if (storeBalanceText) storeBalanceText.innerText = userStars;
                    alert(t.purchaseSuccess);
                    btnElement.innerHTML = originalHTML;
                    btnElement.disabled = false;
                }, 2000);
            }
        };
    }

    // =====================================
    // منطق پشتیبانی و همکاری
    // =====================================
    var supportBtnMenu = document.getElementById('support-btn');
    if (supportBtnMenu) {
        supportBtnMenu.onclick = function() { if(supportModal) supportModal.style.display = 'block'; };
    }

    var closeSupportBtn = document.getElementById('close-support-btn');
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

    var sendSupportBtn = document.getElementById('send-support-btn');
    if (sendSupportBtn) {
        sendSupportBtn.onclick = function() {
            var t = translations[currentLang];
            var originalText = sendSupportBtn.innerText;

            var senderInfo = "Web Browser";
            try {
                if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                    var u = tg.initDataUnsafe.user;
                    senderInfo = "ID: " + u.id + "\nName: " + (u.first_name || '') + " " + (u.last_name || '') + "\nUser: @" + (u.username || '');
                }
            } catch(err) {}

            if (activeTab === 'support') {
                var message = supportText ? supportText.value.trim() : "";
                var file = (supportFileUpload && supportFileUpload.files.length > 0) ? supportFileUpload.files[0] : null;

                if (!message && !file) { alert(t.alertEmpty); return; }

                sendSupportBtn.innerText = "⏳...";
                sendSupportBtn.disabled = true;

                if (file) {
                    var fd = new FormData();
                    fd.append('chat_id', ADMIN_CHAT_ID);
                    fd.append('photo', file);
                    fd.append('caption', "🛠 Support Ticket\n\n👤 Sender:\n" + senderInfo + "\n\n📝 Message:\n" + message);

                    fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendPhoto", { method: 'POST', body: fd })
                    .then(function(res) { return res.json(); }).then(function(data) {
                        if (data.ok) { alert(t.alertSuccessSupport); if(closeSupportBtn) closeSupportBtn.click(); } 
                        else { alert(t.alertError); }
                    }).catch(function() { alert(t.alertError); }).finally(function() { sendSupportBtn.innerText = originalText; sendSupportBtn.disabled = false; });
                } else {
                    var finalMsg = "🛠 Support Ticket\n\n👤 Sender:\n" + senderInfo + "\n\n📝 Message:\n" + message;
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
                var ch = collabChannel ? collabChannel.value.trim() : "";
                var tgId = collabTelegram ? collabTelegram.value.trim() : "";
                var ex = collabExtra ? collabExtra.value.trim() : "";

                if (!ch && !tgId) { alert(t.alertEmpty); return; }

                sendSupportBtn.innerText = "⏳...";
                sendSupportBtn.disabled = true;

                var finalMsg2 = "🤝 Collab Request\n\n👤 Sender:\n" + senderInfo + "\n\n📢 Channel: " + ch + "\n👤 Admin ID: " + tgId + "\n📝 Extra:\n" + ex;

                fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: finalMsg2 })
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
            }).catch(function() {});
        } catch(e) {}
    }

    function renderGallery() {
        if (!templateGallery) return;
        if (currentPage === 1) templateGallery.innerHTML = '';
        var memesToShow = filteredMemes.slice((currentPage - 1) * memesPerPage, currentPage * memesPerPage);
        memesToShow.forEach(function(meme) {
            var img = document.createElement('img');
            img.src = meme.url; img.className = 'template-img'; img.crossOrigin = "anonymous";
            img.onclick = function() {
                var allImgs = document.querySelectorAll('.template-img');
                for(var i=0; i<allImgs.length; i++) { allImgs[i].classList.remove('selected'); }
                img.classList.add('selected'); selectedImageSrc = img.src;
                var nextBtn = document.getElementById('next-btn');
                if (nextBtn) nextBtn.disabled = false;
            };
            templateGallery.appendChild(img);
        });
        var loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) loadMoreBtn.classList.toggle('hidden', (currentPage * memesPerPage) >= filteredMemes.length);
    }

    var searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.oninput = function(e) { 
        filteredMemes = allMemes.filter(function(m) { return m.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1; }); 
        currentPage = 1; renderGallery(); 
    };
    
    var loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) loadMoreBtn.onclick = function() { currentPage++; renderGallery(); };

    var uploadBtn = document.getElementById('upload-btn');
    var imageUpload = document.getElementById('image-upload');
    if (uploadBtn && imageUpload) {
        uploadBtn.onclick = function() { imageUpload.click(); };
        imageUpload.onchange = function(e) {
            var file = e.target.files[0]; if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) { selectedImageSrc = ev.target.result; goToStep2(); };
            reader.readAsDataURL(file);
        };
    }

    var nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.onclick = goToStep2;

    var backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.onclick = function() { 
        if(step2) step2.style.display = 'none'; 
        if(step1) step1.style.display = 'block'; 
        if(walletBtn) walletBtn.style.display = 'flex'; // نشون دادن کیف پول موقع برگشت
    };

    // =====================================
    // منطق بوم و واترمارک @creat_meme_bot
    // =====================================
    function goToStep2() {
        if(step1) step1.style.display = 'none'; 
        if(step2) step2.style.display = 'block';
        if(walletBtn) walletBtn.style.display = 'none'; // مخفی کردن کیف پول در زمان ویرایش
        initFabricCanvas(selectedImageSrc);
    }

    function initFabricCanvas(imgSrc) {
        if (fCanvas) fCanvas.dispose();
        fCanvas = new fabric.Canvas('meme-canvas');
        var canvasWrapper = document.querySelector('.canvas-wrapper');
        var containerWidth = canvasWrapper ? canvasWrapper.clientWidth : 300;
        
        fabric.Image.fromURL(imgSrc, function(img) {
            var scale = containerWidth / img.width;
            fCanvas.setWidth(containerWidth); fCanvas.setHeight(img.height * scale);
            fCanvas.setBackgroundImage(img, fCanvas.renderAll.bind(fCanvas), { scaleX: scale, scaleY: scale, originX: 'left', originY: 'top', crossOrigin: 'anonymous' });

            var watermark = new fabric.Text('@creat_meme_bot', {
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

        fCanvas.on('object:added', function(e) {
            if (e.target && e.target.name !== 'watermark') {
                var objs = fCanvas.getObjects();
                for(var i=0; i<objs.length; i++){
                    if(objs[i].name === 'watermark') { objs[i].bringToFront(); break; }
                }
            }
        });
    }

    function onTextSelected(e) {
        var activeObj = e.selected[0];
        if (activeObj && activeObj.type === 'text') {
            var addTextBtn = document.getElementById('add-text-btn');
            var editTools = document.getElementById('edit-tools');
            if(addTextBtn) addTextBtn.style.display = 'none';
            if(editTools) editTools.style.display = 'flex';
        }
    }

    function onSelectionCleared() {
        var addTextBtn = document.getElementById('add-text-btn');
        var editTools = document.getElementById('edit-tools');
        if(addTextBtn) addTextBtn.style.display = 'flex';
        if(editTools) editTools.style.display = 'none';
        closeEditPanel();
    }

    function openEditPanel() {
        var activeObj = fCanvas.getActiveObject();
        var textEditPanel = document.getElementById('text-edit-panel');
        var textInputField = document.getElementById('text-input-field');
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

    var editTextBtn = document.getElementById('edit-text-btn');
    if(editTextBtn) editTextBtn.onclick = openEditPanel;

    var addTextBtn = document.getElementById('add-text-btn');
    if(addTextBtn) {
        addTextBtn.onclick = function() {
            if (!fCanvas) return;
            var t = translations[currentLang];
            var text = new fabric.Text(t.newTextDef, {
                left: fCanvas.width / 2, top: fCanvas.height / 2, fontFamily: 'Lalezar', fill: '#ffffff',
                fontSize: 40, fontWeight: 'bold', stroke: '#000000', strokeWidth: 2, originX: 'center', originY: 'center', paintFirst: 'stroke'
            });
            fCanvas.add(text).setActiveObject(text);
            var editTools = document.getElementById('edit-tools');
            if(addTextBtn) addTextBtn.style.display = 'none';
            if(editTools) editTools.style.display = 'flex';
            openEditPanel();
        };
    }

    var textInputField = document.getElementById('text-input-field');
    if(textInputField) {
        textInputField.oninput = function(e) { var active = fCanvas.getActiveObject(); if (active && active.type === 'text') { active.set('text', e.target.value); fCanvas.renderAll(); } };
    }

    if(document.getElementById('font-family')) document.getElementById('font-family').onchange = function(e) { var active = fCanvas.getActiveObject(); if (active && active.type === 'text') { active.set('fontFamily', e.target.value); fCanvas.renderAll(); } };
    if(document.getElementById('font-size')) document.getElementById('font-size').oninput = function(e) { var active = fCanvas.getActiveObject(); if (active && active.type === 'text') { active.set('fontSize', parseInt(e.target.value)); fCanvas.renderAll(); } };
    if(document.getElementById('text-color')) document.getElementById('text-color').oninput = function(e) { if(document.getElementById('color-indicator')) document.getElementById('color-indicator').style.backgroundColor = e.target.value; var active = fCanvas.getActiveObject(); if (active && active.type === 'text') { active.set('fill', e.target.value); fCanvas.renderAll(); } };
    if(document.getElementById('stroke-color')) document.getElementById('stroke-color').oninput = function(e) { if(document.getElementById('stroke-indicator')) document.getElementById('stroke-indicator').style.backgroundColor = e.target.value; var active = fCanvas.getActiveObject(); if (active && active.type === 'text') { active.set('stroke', e.target.value); fCanvas.renderAll(); } };

    function closeEditPanel() {
        var textEditPanel = document.getElementById('text-edit-panel');
        if(textEditPanel) textEditPanel.style.transform = 'translateY(120%)';
        if(textInputField) textInputField.blur();
    }
    
    var inlineCloseBtn = document.getElementById('inline-close-btn');
    if(inlineCloseBtn) inlineCloseBtn.onclick = closeEditPanel;

    var deleteTextBtn = document.getElementById('delete-text-btn');
    if(deleteTextBtn) {
        deleteTextBtn.onclick = function() { var active = fCanvas.getActiveObject(); if (active && active.name !== 'watermark') { fCanvas.remove(active); closeEditPanel(); fCanvas.discardActiveObject().renderAll(); } };
    }

    var downloadBtn = document.getElementById('download-btn');
    if(downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            var chatId = null;
            if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
                chatId = tg.initDataUnsafe.user.id;
            }
            if (!chatId) return alert(currentLang === 'fa' ? "از داخل ربات تلگرام باز کنید" : "Open in bot");
            
            if (fCanvas) {
                fCanvas.discardActiveObject().renderAll();
                var dataURL = fCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 3 });
                fetch(dataURL).then(function(res) { return res.blob(); }).then(function(blob) {
                    var fd = new FormData(); fd.append('chat_id', chatId); fd.append('photo', blob, 'meme.png');
                    fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendPhoto", { method: 'POST', body: fd })
                    .then(function() { if (tg) tg.close(); });
                });
            }
        });
    }

    var shareBtn = document.getElementById('share-btn');
    if(shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (fCanvas) {
                fCanvas.discardActiveObject().renderAll();
                var dataURL = fCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 3 });
                fetch(dataURL).then(function(res) { return res.blob(); }).then(async function(blob) {
                    var file = new File([blob], "meme.png", { type: "image/png" });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file] }); }
                });
            }
        });
    }
});