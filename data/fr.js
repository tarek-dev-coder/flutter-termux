export default {
    "docTitle": "Flutter sur Termux : créez des apps sur votre téléphone",
    "changeLang": "Changer de langue",
    "langBtn": "🌐 FR",
    "nextBtn": "Suivant",
    "prevBtn": "Retour",
    "doneBtn": "Terminer 🎉",
    "restartBtn": "Recommencer",
    "copyText": "Copier",
    "copiedText": "Copié",
    "copyFailText": "Copie impossible. Sélectionnez le code et copiez-le.",
    "keyboardHint": "Utilisez <kbd>&larr;</kbd> et <kbd>&rarr;</kbd> pour naviguer",
    "doneTitle": "Bien joué !",
    "doneDesc": "Vous avez créé et lancé une app Flutter sur votre téléphone. Sans PC.",
    "stepOf": "Étape {c} sur {t}",
    "resumed": "Retour à l'étape {s}",
    "steps": [
        {
            "icon": "📥",
            "title": "1. Installez les apps",
            "desc": "Pas besoin d'ordinateur. Tout se passe sur votre téléphone. Installez <strong>Termux</strong> et <strong>Termux:API</strong> depuis F-Droid. Il faut Android 11+ et 8 à 10 Go libres. Évitez le Play Store, sa version est trop vieille.",
            "images": [
                {
                    "src": "assets/screenshots/step-1/apk-files.png",
                    "alt": "APK Termux et Termux:API",
                    "caption": "Les deux APK qu'il vous faut.",
                    "width": 682,
                    "height": 256
                }
            ],
            "links": [
                {
                    "text": "Installer Termux",
                    "url": "https://f-droid.org/packages/com.termux/"
                },
                {
                    "text": "Installer Termux:API",
                    "url": "https://f-droid.org/packages/com.termux.api/"
                }
            ]
        },
        {
            "icon": "📦",
            "title": "2. Installez les outils",
            "desc": "Ajoutez le dépôt <code>termuxvoid</code>. Il contient Flutter, le SDK Android, le NDK et CMake prêts à installer.<br><br><strong>Débutant ?</strong> Vous préférez une installation en une commande ? Lancez <code>curl -fsSL https://raw.githubusercontent.com/tarek-dev-coder/flutter-termux/master/setup.sh | bash</code> dans Termux à la place des étapes ci-dessous.",
            "code": "pkg update && pkg upgrade -y\npkg install curl termux-api -y\ncurl -fsSL https://github.com/termuxvoid/repo/raw/main/install.sh | bash\npkg install flutter android-sdk android-ndk android-cmake -y"
        },
        {
            "icon": "📱",
            "title": "3. Associez votre téléphone",
            "desc": "Activez le <strong>Débogage sans fil</strong> dans les options pour les développeurs. Touchez <strong>Associer l'appareil avec un code d'association</strong>. Utilisez l'IP et le port d'association affichés sur votre téléphone.<br><br><strong>Note :</strong> Associez une fois (obligatoire). Si vous sautez cette étape, <code>adb connect</code> affiche <strong>\"Unauthorized\"</strong>. Ensuite, connectez-vous simplement.",
            "images": [
                {
                    "src": "assets/screenshots/step-5/fr-wireless.jpg",
                    "alt": "Débogage sans fil Android : activez-le, ouvrez l'association, obtenez le code",
                    "caption": "Activez le débogage sans fil, puis touchez Associer l'appareil avec un code d'association.",
                    "width": 1376,
                    "height": 768
                }
            ],
            "imageLayout": "stack",
            "code": "# Association : remplacez 40555 par le port d'association\nadb pair 127.0.0.1:40555"
        },
        {
            "icon": "🔌",
            "title": "4. Connectez et gardez Termux éveillé",
            "desc": "Connectez-vous avec le <strong>port principal</strong>. Empêchez Android de tuer la compilation, puis gardez Termux éveillé.<br><br><strong>Conseil :</strong> Déjà associé ? Sautez l'étape 5 et lancez <code>adb connect</code>. <strong>\"Unauthorized\"</strong> ou <strong>\"Connection refused\"</strong> ? Réassociez et vérifiez le port sous <em>IP address &amp; Port</em>.",
            "images": [
                {
                    "src": "assets/screenshots/step-6/connect-stabilize.png",
                    "alt": "Terminal avec adb connect, le correctif du tueur de processus et termux-wake-lock",
                    "caption": "Connectez, empêchez Android de tuer la compilation, et gardez Termux éveillé.",
                    "width": 720,
                    "height": 131
                }
            ],
            "imageLayout": "stack",
            "code": "# Connexion : remplacez 42403 par le port principal\nadb connect 127.0.0.1:42403\n\n# Empêcher Android de tuer la compilation\nadb shell settings put global settings_enable_monitor_phantom_procs false\n\n# Garder Termux éveillé\ntermux-wake-lock"
        },
        {
            "icon": "⚙️",
            "title": "5. Configurez Flutter",
            "desc": "Indiquez à Flutter où se trouve le SDK Android de Termux et acceptez les licences. Une seule fois. Pas besoin de <code>ANDROID_HOME</code> ni de <code>JAVA_HOME</code>.",
            "code": "flutter config --android-sdk \"$PREFIX/opt/android-sdk\"\nyes | flutter doctor --android-licenses\nflutter doctor -v"
        },
        {
            "icon": "🛠️",
            "title": "6. Créez et configurez l'app",
            "desc": "Créez l'app, puis indiquez à Gradle le SDK, le NDK, CMake et <code>aapt2</code> de Termux. Cela évite les erreurs <code>llvm-strip</code> et SDK. Toujours bloqué ? Vérifiez que <code>ndk.dir</code> et <code>ndkVersion</code> correspondent au NDK installé.",
            "code": "cd ~\nflutter create hello_world\ncd hello_world\n\n# Lire les versions installées par TermuxVoid\nNDK_VER=$(grep '^Pkg.Revision' \"$PREFIX/opt/android-ndk/source.properties\" | awk '{print $2}')\nBT_VER=$(ls \"$PREFIX/opt/android-sdk/build-tools\" | sort -V | tail -n 1)\nCMAKE_DIR=$(ls -d \"$PREFIX/opt/android-cmake\"/* | sort -V | tail -n 1)\necho \"Using NDK $NDK_VER, build-tools $BT_VER, CMake $CMAKE_DIR\"\n\n# Indiquer à Gradle le SDK, le NDK et CMake de Termux\ncat > android/local.properties <<EOF\nsdk.dir=$PREFIX/opt/android-sdk\nflutter.sdk=$PREFIX/opt/flutter\ncmake.dir=$CMAKE_DIR\nndk.dir=$PREFIX/opt/android-ndk\nEOF\n\n# Utiliser l'aapt2 du SDK\ngrep -q aapt2FromMavenOverride android/gradle.properties || cat >> android/gradle.properties <<EOF\nandroid.aapt2FromMavenOverride=$PREFIX/opt/android-sdk/build-tools/$BT_VER/aapt2\nEOF\n\n# Utiliser le NDK et les build-tools de Termux\nsed -i \"s/ndkVersion = flutter.ndkVersion/ndkVersion = \\\"$NDK_VER\\\"/\" android/app/build.gradle.kts\nsed -i \"s/compileSdk = flutter.compileSdkVersion/compileSdk = flutter.compileSdkVersion\\n    buildToolsVersion = \\\"$BT_VER\\\"/\" android/app/build.gradle.kts"
        },
        {
            "icon": "🚀",
            "title": "7. Lancez hello_world",
            "desc": "L'app est déjà configurée. Compilez-la et lancez-la sur votre téléphone. Si vous avez plusieurs appareils, ajoutez <code>-d &lt;device-id&gt;</code>.",
            "images": [
                {
                    "src": "assets/screenshots/step-7/adb-devices.png",
                    "alt": "Terminal affichant adb devices",
                    "caption": "Appareils connectés.",
                    "width": 716,
                    "height": 269
                },
                {
                    "src": "assets/screenshots/step-7/build-install.jpg",
                    "alt": "Terminal avec une compilation et une installation Flutter réussies",
                    "caption": "L'app se compile et s'installe.",
                    "width": 2663,
                    "height": 400
                },
                {
                    "src": "assets/screenshots/step-7/app-preview.png",
                    "alt": "L'app Flutter par défaut qui tourne sur un téléphone",
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