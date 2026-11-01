export default {
    "docTitle": "Flutter on Termux: build apps on your phone",
    "changeLang": "Change language",
    "langBtn": "🌐 EN",
    "nextBtn": "Next",
    "prevBtn": "Back",
    "doneBtn": "Done 🎉",
    "restartBtn": "Start over",
    "copyText": "Copy",
    "copiedText": "Copied",
    "copyFailText": "Couldn't copy. Select the code and copy it.",
    "keyboardHint": "Use <kbd>&larr;</kbd> and <kbd>&rarr;</kbd> to move",
    "doneTitle": "Nice work!",
    "doneDesc": "You built and ran a Flutter app on your phone. No PC needed.",
    "stepOf": "Step {c} of {t}",
    "resumed": "Back at step {s}",
    "steps": [
        {
            "icon": "📥",
            "title": "1. Get the apps",
            "desc": "No PC needed. Everything runs on your phone. Install <strong>Termux</strong> and <strong>Termux:API</strong> from F-Droid. Use Android 11+ and keep 8 to 10 GB free. Skip the Play Store version, it's too old.",
            "images": [
                {
                    "src": "assets/screenshots/step-1/apk-files.png",
                    "alt": "Termux and Termux:API APKs",
                    "caption": "The two APKs you need.",
                    "width": 682,
                    "height": 256
                }
            ],
            "links": [
                {
                    "text": "Get Termux",
                    "url": "https://f-droid.org/packages/com.termux/"
                },
                {
                    "text": "Get Termux:API",
                    "url": "https://f-droid.org/packages/com.termux.api/"
                }
            ]
        },
        {
            "icon": "📦",
            "title": "2. Install the tools",
            "desc": "Add the <code>termuxvoid</code> repo. It has ready-made Flutter, Android SDK, NDK, and CMake builds.<br><br><strong>Ultra beginner?</strong> Ultra beginner? Prefer a one-run setup? Run the command below in Termux instead of the steps below.",
            "code": "pkg update && pkg upgrade -y\npkg install curl termux-api -y\ncurl -fsSL https://github.com/termuxvoid/repo/raw/main/install.sh | bash\npkg install flutter android-sdk android-ndk android-cmake -y",
            "extraCode": "curl -fsSL https://raw.githubusercontent.com/tarek-dev-coder/flutter-termux/master/setup.sh | bash"
        },
        {
            "icon": "📱",
            "title": "3. Pair your phone",
            "desc": "Turn on <strong>Wireless debugging</strong> in Developer options. Tap <strong>Pair device with pairing code</strong>. Use the IP and pairing port shown on your phone.<br><br><strong>Note:</strong> Pair once (required). If you skip it, <code>adb connect</code> shows <strong>\"Unauthorized\"</strong>. After that, just connect.",
            "images": [
                {
                    "src": "assets/screenshots/step-5/en-wireless.jpg",
                    "alt": "Android wireless debugging: turn it on, open pairing, get the code",
                    "caption": "Turn on Wireless debugging, then pick Pair device with pairing code.",
                    "width": 1339,
                    "height": 800
                }
            ],
            "imageLayout": "stack",
            "code": "# Pair: replace 40555 with the pairing port\nadb pair 127.0.0.1:40555"
        },
        {
            "icon": "🔌",
            "title": "4. Connect and keep Termux awake",
            "desc": "Connect with the <strong>main</strong> port. Stop Android from killing the build, then keep Termux awake.<br><br><strong>Tip:</strong> Already paired? Skip step 3 and run <code>adb connect</code>. Seeing <strong>\"Unauthorized\"</strong> or <strong>\"Connection refused\"</strong>? Pair again and check the port under <em>IP address &amp; Port</em>.",
            "images": [
                {
                    "src": "assets/screenshots/step-6/connect-stabilize.png",
                    "alt": "Terminal showing adb connect, the process killer fix, and termux-wake-lock",
                    "caption": "Connect, stop Android killing the build, and keep Termux awake.",
                    "width": 720,
                    "height": 131
                }
            ],
            "imageLayout": "stack",
            "code": "# Connect: replace 42403 with the main port\nadb connect 127.0.0.1:42403\n\n# Stop Android from killing the build\nadb shell settings put global settings_enable_monitor_phantom_procs false\n\n# Keep Termux awake\ntermux-wake-lock"
        },
        {
            "icon": "⚙️",
            "title": "5. Set up Flutter",
            "desc": "Point Flutter at the Termux SDK and accept the Android licenses. Do this once. You don't need <code>ANDROID_HOME</code> or <code>JAVA_HOME</code>.",
            "code": "flutter config --android-sdk \"$PREFIX/opt/android-sdk\"\nyes | flutter doctor --android-licenses\nflutter doctor -v"
        },
        {
            "icon": "🛠️",
            "title": "6. Create and configure the app",
            "desc": "Create the app, then point Gradle at Termux's SDK, NDK, CMake, and <code>aapt2</code>. This prevents the <code>llvm-strip</code> and SDK errors. Still stuck? Check that <code>ndk.dir</code> and <code>ndkVersion</code> match the installed NDK.",
            "code": "cd ~\nflutter create hello_world\ncd hello_world\n\n# Read the installed TermuxVoid versions\nNDK_VER=$(grep '^Pkg.Revision' \"$PREFIX/opt/android-ndk/source.properties\" | awk '{print $2}')\nBT_VER=$(ls \"$PREFIX/opt/android-sdk/build-tools\" | sort -V | tail -n 1)\nCMAKE_DIR=$(ls -d \"$PREFIX/opt/android-cmake\"/* | sort -V | tail -n 1)\necho \"Using NDK $NDK_VER, build-tools $BT_VER, CMake $CMAKE_DIR\"\n\n# Point Gradle at the Termux SDK, NDK, and CMake\ncat > android/local.properties <<EOF\nsdk.dir=$PREFIX/opt/android-sdk\nflutter.sdk=$PREFIX/opt/flutter\ncmake.dir=$CMAKE_DIR\nndk.dir=$PREFIX/opt/android-ndk\nEOF\n\n# Use the SDK's aapt2\ngrep -q aapt2FromMavenOverride android/gradle.properties || cat >> android/gradle.properties <<EOF\nandroid.aapt2FromMavenOverride=$PREFIX/opt/android-sdk/build-tools/$BT_VER/aapt2\nEOF\n\n# Use the Termux NDK and build-tools\nsed -i \"s/ndkVersion = flutter.ndkVersion/ndkVersion = \\\"$NDK_VER\\\"/\" android/app/build.gradle.kts\nsed -i \"s/compileSdk = flutter.compileSdkVersion/compileSdk = flutter.compileSdkVersion\\n    buildToolsVersion = \\\"$BT_VER\\\"/\" android/app/build.gradle.kts"
        },
        {
            "icon": "🚀",
            "title": "7. Run hello_world",
            "desc": "The app is already configured. Build it and run it on your phone. If you have more than one device, add <code>-d &lt;device-id&gt;</code>.",
            "images": [
                {
                    "src": "assets/screenshots/step-7/adb-devices.png",
                    "alt": "Terminal showing adb devices",
                    "caption": "Connected devices.",
                    "width": 716,
                    "height": 269
                },
                {
                    "src": "assets/screenshots/step-7/build-install.jpg",
                    "alt": "Terminal showing a Flutter build and install",
                    "caption": "The app builds and installs.",
                    "width": 2663,
                    "height": 400
                },
                {
                    "src": "assets/screenshots/step-7/app-preview.png",
                    "alt": "The default Flutter app running on a phone",
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