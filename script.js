// ==========================================
// ۱. تنظیمات ربات و ادمین (درخواست اسپانسری)
// ==========================================
const BOT_TOKEN = "8680179449:AAHb26-jsgM-Q92zEAeBxzM0ycHbpoJkAvk"; 
const ADMIN_CHAT_ID = "6156596236";

// ==========================================
// ۲. مدیریت صفحات و دکمه‌های رابط کاربری
// ==========================================
const landingPage = document.getElementById('landing-page');
const appContainer = document.getElementById('app-container');
const startAppBtn = document.getElementById('start-app-btn');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const backBtn = document.getElementById('back-btn');

// ورود به برنامه اصلی
if (startAppBtn) {
    startAppBtn.addEventListener('click', () => {
        landingPage.style.display = 'none';
        appContainer.style.display = 'block';
    });
}

// دکمه بازگشت به مرحله انتخاب عکس
if (backBtn) {
    backBtn.addEventListener('click', () => {
        step2.style.display = 'none';
        step1.style.display = 'block';
        if (canvas) canvas.clear(); // پاک کردن بوم قبلی
    });
}

// ==========================================
// ۳. سیستم درخواست اسپانسری (ارسال به تلگرام)
// ==========================================
const sponsorBtn = document.getElementById('sponsor-btn');
const sponsorModal = document.getElementById('sponsor-modal');
const closeSponsorBtn = document.getElementById('close-sponsor-btn');
const sendSponsorBtn = document.getElementById('send-sponsor-btn');
const sponsorText = document.getElementById('sponsor-text');

// باز کردن پاپ‌آپ اسپانسر
if (sponsorBtn) {
    sponsorBtn.addEventListener('click', () => {
        sponsorModal.style.display = 'block';
    });
}

// بستن پاپ‌آپ اسپانسر
if (closeSponsorBtn) {
    closeSponsorBtn.addEventListener('click', () => {
        sponsorModal.style.display = 'none';
        sponsorText.value = ''; 
    });
}

// ارسال پیام به پی‌وی ادمین
if (sendSponsorBtn) {
    sendSponsorBtn.addEventListener('click', () => {
        const message = sponsorText.value.trim();
        
        if (!message) {
            alert("رئیس، لطفا اول پیامت رو بنویس! 😅");
            return;
        }

        const originalBtnText = sendSponsorBtn.innerHTML;
        sendSponsorBtn.innerHTML = "⏳ در حال ارسال...";
        sendSponsorBtn.disabled = true;

        const finalMessage = 🌟 <b>درخواست اسپانسری جدید (بامبو میم)</b>\n\n💬 متن پیام:\n${message};

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text: finalMessage,
                parse_mode: "HTML"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("پیام شما با موفقیت برای مدیریت ارسال شد! ✅");
                sponsorModal.style.display = 'none';
                sponsorText.value = '';
            } else {
                alert("اوه! یه مشکلی پیش اومد. لطفا دوباره امتحان کن.");
            }
        })
        .catch(err => {
            alert("خطا در ارتباط با سرور!");
            console.error(err);
        })
        .finally(() => {
            sendSponsorBtn.innerHTML = originalBtnText;
            sendSponsorBtn.disabled = false;
        });
    });
}

// ==========================================
// ۴. هسته اصلی ادیتور میم (Fabric.js)
// ==========================================
let canvas;
const uploadBtn = document.getElementById('upload-btn');
const imageUpload = document.getElementById('image-upload');
const addTextBtn = document.getElementById('add-text-btn');
const deleteTextBtn = document.getElementById('delete-text-btn');
const downloadBtn = document.getElementById('download-btn');
const editTools = document.getElementById('edit-tools');

// راه‌اندازی بوم نقاشی (Canvas)
function initCanvas(imageUrl) {
    if (!canvas) {// تنظیم ابعاد بوم بر اساس صفحه گوشی
        const canvasWidth = window.innerWidth > 400 ? 350 : window.innerWidth - 60;
        canvas = new fabric.Canvas('meme-canvas', {
            width: canvasWidth,
            height: canvasWidth // فعلا بوم رو مربع در نظر می‌گیریم
        });

        // نمایش ابزارهای ویرایش وقتی روی متنی کلیک میشه
        canvas.on('selection:created', () => editTools.style.display = 'flex');
        canvas.on('selection:updated', () => editTools.style.display = 'flex');
        canvas.on('selection:cleared', () => editTools.style.display = 'none');
    }

    // لود کردن عکس روی بوم
    fabric.Image.fromURL(imageUrl, function(img) {
        // تنظیم سایز عکس برای فیت شدن در بوم
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        img.set({
            scaleX: scale,
            scaleY: scale,
            originX: 'center',
            originY: 'center',
            left: canvas.width / 2,
            top: canvas.height / 2,
            selectable: false // عکس بک‌گراند نباید تکون بخوره
        });
        
        canvas.clear();
        canvas.add(img);
        canvas.sendToBack(img);
    });
}

// کلیک روی دکمه آپلود -> باز شدن گالری گوشی
if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        imageUpload.click();
    });
}

// وقتی کاربر عکس رو انتخاب کرد
if (imageUpload) {
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(f) {
            // رفتن به مرحله ادیتور
            step1.style.display = 'none';
            step2.style.display = 'block';
            
            // راه‌اندازی بوم با عکس انتخاب شده
            initCanvas(f.target.result);
        };
        reader.readAsDataURL(file);
    });
}

// اضافه کردن متن به میم
if (addTextBtn) {
    addTextBtn.addEventListener('click', () => {
        if (!canvas) return;
        
        const text = new fabric.IText('متن خود را بنویسید', {
            left: canvas.width / 2,
            top: canvas.height / 2,
            fontFamily: 'Lalezar', // فونت خفن و ضخیم برای میم
            fill: '#ffffff',
            stroke: '#000000', // حاشیه مشکی برای خوانایی بهتر
            strokeWidth: 2,
            fontSize: 40,
            originX: 'center',
            originY: 'center',
            direction: 'rtl',
            textAlign: 'center',
            transparentCorners: false,
            cornerColor: '#4ade80',
            cornerStrokeColor: '#0a0f0c',
            borderColor: '#4ade80',
            cornerSize: 12
        });
        
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
    });
}

// حذف متن انتخاب شده
if (deleteTextBtn) {
    deleteTextBtn.addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            canvas.discardActiveObject();
        }
    });
}

// خروجی گرفتن و دانلود عکس
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        if (!canvas) return;
        
        // خارج کردن متن از حالت انتخاب که کادر دورش نیفته تو عکس
        canvas.discardActiveObject();
        canvas.renderAll();

        // تبدیل بوم به عکس با کیفیت
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });

        // دانلود مستقیم عکس روی گوشی کاربر
        const link = document.createElement('a');
        link.download = 'bamboo-meme.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert("بوم! 💥 میم شما با موفقیت ذخیره شد.");
    });
}