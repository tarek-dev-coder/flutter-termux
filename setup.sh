#!/data/data/com.termux/files/usr/bin/bash
# setup.sh - one-run Termux setup for Flutter on Android.
# Usage:  bash setup.sh   (or: curl -fsSL <url> | bash)
# Does everything except device pairing (which needs your phone's IP/port).
set -e

PREFIX="${PREFIX:-/data/data/com.termux/files/usr}"

echo "==> Adding the TermuxVoid repository..."
curl -fsSL https://github.com/termuxvoid/repo/raw/main/install.sh | bash

echo "==> Installing Flutter, Android SDK, NDK, CMake, and Termux:API..."
pkg update -y
pkg install -y flutter android-sdk android-ndk android-cmake termux-api

echo "==> Configuring Flutter..."
flutter config --android-sdk "$PREFIX/opt/android-sdk"
yes | flutter doctor --android-licenses || true
flutter doctor -v

echo "==> Creating hello_world project..."
cd ~
if [ -d "hello_world" ]; then
    echo "  hello_world already exists; reusing it."
else
    flutter create hello_world
fi
cd hello_world

echo "==> Configuring Gradle for Termux..."
NDK_VER=$(grep '^Pkg.Revision' "$PREFIX/opt/android-ndk/source.properties" | awk '{print $2}')
BT_VER=$(ls "$PREFIX/opt/android-sdk/build-tools" | sort -V | tail -n 1)
CMAKE_DIR=$(ls -d "$PREFIX/opt/android-cmake"/* | sort -V | tail -n 1)

cat > android/local.properties <<EOF
sdk.dir=$PREFIX/opt/android-sdk
flutter.sdk=$PREFIX/opt/flutter
cmake.dir=$CMAKE_DIR
ndk.dir=$PREFIX/opt/android-ndk
EOF

grep -q aapt2FromMavenOverride android/gradle.properties 2>/dev/null || cat >> android/gradle.properties <<EOF
android.aapt2FromMavenOverride=$PREFIX/opt/android-sdk/build-tools/$BT_VER/aapt2
EOF

sed -i "s/ndkVersion = flutter.ndkVersion/ndkVersion = \"$NDK_VER\"/" android/app/build.gradle.kts
sed -i "s/compileSdk = flutter.compileSdkVersion/compileSdk = flutter.compileSdkVersion\n    buildToolsVersion = \"$BT_VER\"/" android/app/build.gradle.kts

echo ""
echo "========================================"
echo "  Setup complete!"
echo "========================================"
echo ""
echo "Detected versions:"
echo "  NDK:         $NDK_VER"
echo "  build-tools: $BT_VER"
echo "  CMake:       $CMAKE_DIR"
echo ""
echo "Next steps (device pairing):"
echo "  1. Enable Developer options + Wireless debugging on your phone."
echo "  2. adb pair 127.0.0.1:<pairing-port>   (use the port shown on your phone)"
echo "  3. adb connect 127.0.0.1:<main-port>"
echo "  4. adb shell settings put global settings_enable_monitor_phantom_procs false"
echo "  5. termux-wake-lock"
echo ""
echo "Then run your app:"
echo "  cd ~/hello_world && flutter run"
echo ""