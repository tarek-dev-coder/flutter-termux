export default {
    "docTitle": "Flutter على Termux: ابنِ تطبيقات على هاتفك",
    "changeLang": "تغيير اللغة",
    "langBtn": "🌐 AR",
    "nextBtn": "التالي",
    "prevBtn": "السابق",
    "doneBtn": "تم 🎉",
    "restartBtn": "من جديد",
    "copyText": "نسخ",
    "copiedText": "تم النسخ",
    "copyFailText": "تعذّر النسخ. حدّد الكود وانسخه.",
    "keyboardHint": "استخدم <kbd>&larr;</kbd> و <kbd>&rarr;</kbd> للتنقل",
    "doneTitle": "أحسنت!",
    "doneDesc": "بنيت وشغّلت تطبيق Flutter على هاتفك. بدون حاسوب.",
    "stepOf": "الخطوة {c} من {t}",
    "resumed": "عدنا إلى الخطوة {s}",
    "steps": [
        {
            "icon": "📥",
            "title": "1. نزّل التطبيقات",
            "desc": "لا تحتاج حاسوباً. كل شيء يعمل على هاتفك. ثبّت <strong>Termux</strong> و <strong>Termux:API</strong> من F-Droid. تحتاج أندرويد 11 أو أحدث، و8 إلى 10 غيغابايت مساحة فارغة. لا تستخدم نسخة متجر Play، فهي قديمة.",
            "images": [
                {
                    "src": "assets/screenshots/step-1/apk-files.png",
                    "alt": "ملفات APK لـ Termux و Termux:API",
                    "caption": "ملفا APK المطلوبان.",
                    "width": 682,
                    "height": 256
                }
            ],
            "links": [
                {
                    "text": "نزّل Termux",
                    "url": "https://f-droid.org/packages/com.termux/"
                },
                {
                    "text": "نزّل Termux:API",
                    "url": "https://f-droid.org/packages/com.termux.api/"
                }
            ]
        },
        {
            "icon": "📦",
            "title": "2. ثبّت الأدوات",
            "desc": "أضف مستودع <code>termuxvoid</code>. فيه نسخ جاهزة من Flutter و Android SDK و NDK و CMake.",
            "code": "pkg update && pkg upgrade -y\npkg install curl termux-api -y\ncurl -fsSL https://github.com/termuxvoid/repo/raw/main/install.sh | bash\npkg install flutter android-sdk android-ndk android-cmake -y"
        },
        {
            "icon": "📱",
            "title": "3. اقرن هاتفك",
            "desc": "فعّل <strong>التصحيح اللاسلكي</strong> من خيارات المطور. اضغط <strong>إقران الجهاز باستخدام رمز الإقران</strong>. استخدم عنوان IP ومنفذ الإقران الظاهرين على هاتفك.<br><br><strong>ملاحظة:</strong> يجب الإقران مرة واحدة (إلزامي). إذا تخطيت هذه الخطوة، فسيعرض <code>adb connect</code> رسالة <strong>\"Unauthorized\"</strong>. بعد ذلك، اتصل فقط.",
            "images": [
                {
                    "src": "assets/screenshots/step-5/ar-wireless.jpg",
                    "alt": "التصحيح اللاسلكي في أندرويد: شغّله، افتح الإقران، واحصل على الرمز",
                    "caption": "شغّل التصحيح اللاسلكي، ثم اختر إقران الجهاز باستخدام رمز الإقران.",
                    "width": 1376,
                    "height": 768
                }
            ],
            "imageLayout": "stack",
            "code": "# الإقران: استبدل 40555 بمنفذ الإقران\nadb pair 127.0.0.1:40555"
        },
        {
            "icon": "🔌",
            "title": "4. اتصل وأبقِ Termux مستيقظاً",
            "desc": "اتصل بالمنفذ <strong>الرئيسي</strong>. أوقف أندرويد عن قتل البناء، ثم أبقِ Termux مستيقظاً.<br><br><strong>نصيحة:</strong> هل قرنت من قبل؟ تخطَّ الخطوة 5 وشغّل <code>adb connect</code>. ظهرت <strong>\"Unauthorized\"</strong> أو <strong>\"Connection refused\"</strong>؟ أقرن من جديد وتحقق من المنفذ تحت <em>IP address &amp; Port</em>.",
            "images": [
                {
                    "src": "assets/screenshots/step-6/connect-stabilize.png",
                    "alt": "الطرفية تعرض adb connect وإصلاح قاتل العمليات و termux-wake-lock",
                    "caption": "اتصل، وأوقف أندرويد عن قتل البناء، وأبقِ Termux مستيقظاً.",
                    "width": 720,
                    "height": 131
                }
            ],
            "imageLayout": "stack",
            "code": "# الاتصال: استبدل 42403 بالمنفذ الرئيسي\nadb connect 127.0.0.1:42403\n\n# أوقف أندرويد عن قتل البناء\nadb shell settings put global settings_enable_monitor_phantom_procs false\n\n# أبقِ Termux مستيقظاً\ntermux-wake-lock"
        },
        {
            "icon": "⚙️",
            "title": "5. جهّز Flutter",
            "desc": "عرّف Flutter على SDK Android المثبّت في Termux واقبل التراخيص. مرة واحدة فقط. لا تحتاج إلى <code>ANDROID_HOME</code> أو <code>JAVA_HOME</code>.",
            "code": "flutter config --android-sdk \"$PREFIX/opt/android-sdk\"\nyes | flutter doctor --android-licenses\nflutter doctor -v"
        },
        {
            "icon": "🛠️",
            "title": "6. أنشئ التطبيق وجهّزه",
            "desc": "أنشئ التطبيق، ثم وجّه Gradle إلى SDK و NDK و CMake و <code>aapt2</code> الخاصة بـ Termux. هذا يمنع أخطاء <code>llvm-strip</code> و SDK. ما زلت متعثراً؟ تحقق من أن <code>ndk.dir</code> و <code>ndkVersion</code> يطابقان NDK المثبّت.",
            "code": "cd ~\nflutter create hello_world\ncd hello_world\n\n# اقرأ إصدارات TermuxVoid المثبتة\nNDK_VER=$(grep '^Pkg.Revision' \"$PREFIX/opt/android-ndk/source.properties\" | awk '{print $2}')\nBT_VER=$(ls \"$PREFIX/opt/android-sdk/build-tools\" | sort -V | tail -n 1)\nCMAKE_DIR=$(ls -d \"$PREFIX/opt/android-cmake\"/* | sort -V | tail -n 1)\necho \"Using NDK $NDK_VER, build-tools $BT_VER, CMake $CMAKE_DIR\"\n\n# وجّه Gradle إلى SDK و NDK و CMake في Termux\ncat > android/local.properties <<EOF\nsdk.dir=$PREFIX/opt/android-sdk\nflutter.sdk=$PREFIX/opt/flutter\ncmake.dir=$CMAKE_DIR\nndk.dir=$PREFIX/opt/android-ndk\nEOF\n\n# استخدم aapt2 من SDK\ngrep -q aapt2FromMavenOverride android/gradle.properties || cat >> android/gradle.properties <<EOF\nandroid.aapt2FromMavenOverride=$PREFIX/opt/android-sdk/build-tools/$BT_VER/aapt2\nEOF\n\n# استخدم NDK و build-tools من Termux\nsed -i \"s/ndkVersion = flutter.ndkVersion/ndkVersion = \\\"$NDK_VER\\\"/\" android/app/build.gradle.kts\nsed -i \"s/compileSdk = flutter.compileSdkVersion/compileSdk = flutter.compileSdkVersion\\n    buildToolsVersion = \\\"$BT_VER\\\"/\" android/app/build.gradle.kts"
        },
        {
            "icon": "🚀",
            "title": "7. شغّل hello_world",
            "desc": "التطبيق جاهز. ابنِه وشغّله على هاتفك. إذا كان لديك أكثر من جهاز، أضف <code>-d &lt;device-id&gt;</code>.",
            "images": [
                {
                    "src": "assets/screenshots/step-7/adb-devices.png",
                    "alt": "الطرفية تعرض adb devices",
                    "caption": "الأجهزة المتصلة.",
                    "width": 716,
                    "height": 269
                },
                {
                    "src": "assets/screenshots/step-7/build-install.jpg",
                    "alt": "الطرفية تعرض بناء وتثبيت Flutter بنجاح",
                    "caption": "يتم بناء التطبيق وتثبيته.",
                    "width": 2663,
                    "height": 400
                },
                {
                    "src": "assets/screenshots/step-7/app-preview.png",
                    "alt": "تطبيق Flutter الافتراضي يعمل على هاتف",
                    "portrait": true,
                    "width": 720,
                    "height": 1527
                }
            ],
            "imageLayout": "stack",
            "code": "cd ~/hello_world\nflutter devices\nflutter run"
        }
    ]
};