#!/bin/bash

# SDA Master Guid APK Build Script
# Builds a fully functional APK with mock data (no backend required)

set -e  # Exit on error

echo "🏗️  SDA Master Guid - APK Build Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    print_success "Node.js: $(node --version)"
    
    # Check Java
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed. Please install JDK 17."
        exit 1
    fi
    print_success "Java: $(java -version 2>&1 | head -n 1)"
    
    # Check ANDROID_HOME
    if [ -z "$ANDROID_HOME" ]; then
        print_warning "ANDROID_HOME not set. Attempting to find Android SDK..."
        
        # Try common locations
        if [ -d "$HOME/Library/Android/sdk" ]; then
            export ANDROID_HOME="$HOME/Library/Android/sdk"
            print_success "Found Android SDK at: $ANDROID_HOME"
        elif [ -d "$HOME/Android/Sdk" ]; then
            export ANDROID_HOME="$HOME/Android/Sdk"
            print_success "Found Android SDK at: $ANDROID_HOME"
        else
            print_error "Android SDK not found. Please set ANDROID_HOME."
            exit 1
        fi
    else
        print_success "ANDROID_HOME: $ANDROID_HOME"
    fi
    
    echo ""
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
    echo ""
}

# Prebuild (if needed)
run_prebuild() {
    if [ ! -d "android" ]; then
        print_info "Running expo prebuild..."
        npx expo prebuild --platform android
        print_success "Prebuild complete"
    else
        print_info "Android folder exists, skipping prebuild"
    fi
    echo ""
}

# Build APK
build_apk() {
    local build_type=$1
    
    print_info "Building $build_type APK..."
    cd android
    
    if [ "$build_type" == "release" ]; then
        ./gradlew clean assembleRelease
        APK_PATH="app/build/outputs/apk/release/app-release.apk"
    else
        ./gradlew clean assembleDebug
        APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    fi
    
    cd ..
    
    if [ -f "android/$APK_PATH" ]; then
        print_success "APK built successfully!"
        echo ""
        print_info "APK Location: android/$APK_PATH"
        
        # Get APK size
        APK_SIZE=$(du -h "android/$APK_PATH" | cut -f1)
        print_info "APK Size: $APK_SIZE"
    else
        print_error "APK build failed!"
        exit 1
    fi
    
    echo ""
}

# Copy APK to convenient location
copy_apk() {
    local build_type=$1
    
    if [ "$build_type" == "release" ]; then
        APK_NAME="sda-master-guid-release.apk"
        APK_SOURCE="android/app/build/outputs/apk/release/app-release.apk"
    else
        APK_NAME="sda-master-guid-debug.apk"
        APK_SOURCE="android/app/build/outputs/apk/debug/app-debug.apk"
    fi
    
    if [ -f "$APK_SOURCE" ]; then
        cp "$APK_SOURCE" "./$APK_NAME"
        print_success "APK copied to: ./$APK_NAME"
        echo ""
    fi
}

# Install APK on connected device
install_on_device() {
    local apk_path=$1
    
    print_info "Checking for connected devices..."
    
    if ! command -v adb &> /dev/null; then
        print_warning "ADB not found. Cannot install automatically."
        return
    fi
    
    # Check if device is connected
    DEVICE_COUNT=$(adb devices | grep -c "device$")
    
    if [ "$DEVICE_COUNT" -eq 0 ]; then
        print_warning "No devices connected. Skipping installation."
        return
    fi
    
    print_info "Found $DEVICE_COUNT device(s)"
    echo ""
    
    read -p "Install APK on connected device? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installing APK..."
        adb install -r "$apk_path"
        print_success "APK installed successfully!"
    fi
    
    echo ""
}

# Show summary
show_summary() {
    local build_type=$1
    
    echo ""
    echo "======================================"
    print_success "Build Complete!"
    echo "======================================"
    echo ""
    echo "📱 Next Steps:"
    echo ""
    echo "1. Transfer APK to your Android device"
    if [ "$build_type" == "release" ]; then
        echo "   Location: ./sda-master-guid-release.apk"
    else
        echo "   Location: ./sda-master-guid-debug.apk"
    fi
    echo ""
    echo "2. Install on device:"
    echo "   - Enable 'Install from Unknown Sources'"
    echo "   - Open APK file and install"
    echo ""
    echo "3. Test with mock data:"
    echo "   - Login: admin@sda.com (any password)"
    echo "   - Or: clubadmin@sda.com (any password)"
    echo "   - Or: user@sda.com (any password)"
    echo ""
    echo "📚 Documentation:"
    echo "   - BUILD_APK_GUIDE.md - Complete build guide"
    echo "   - MOCK_DATA_REFERENCE.md - Test data reference"
    echo ""
    echo "🔧 Install via ADB:"
    if [ "$build_type" == "release" ]; then
        echo "   adb install ./sda-master-guid-release.apk"
    else
        echo "   adb install ./sda-master-guid-debug.apk"
    fi
    echo ""
}

# Main script
main() {
    # Parse arguments
    BUILD_TYPE="release"
    
    if [ "$1" == "debug" ] || [ "$1" == "--debug" ] || [ "$1" == "-d" ]; then
        BUILD_TYPE="debug"
    fi
    
    print_info "Build Type: $BUILD_TYPE"
    echo ""
    
    # Run build steps
    check_prerequisites
    install_dependencies
    run_prebuild
    build_apk "$BUILD_TYPE"
    copy_apk "$BUILD_TYPE"
    
    # Offer to install
    if [ "$BUILD_TYPE" == "release" ]; then
        install_on_device "./sda-master-guid-release.apk"
    else
        install_on_device "./sda-master-guid-debug.apk"
    fi
    
    show_summary "$BUILD_TYPE"
}

# Show help
show_help() {
    echo "Usage: ./build-apk.sh [OPTIONS]"
    echo ""
    echo "Build a fully functional APK with mock data (no backend required)"
    echo ""
    echo "Options:"
    echo "  (none)          Build release APK (default)"
    echo "  debug, -d       Build debug APK"
    echo "  --help, -h      Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./build-apk.sh              # Build release APK"
    echo "  ./build-apk.sh debug        # Build debug APK"
    echo ""
}

# Check for help flag
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    show_help
    exit 0
fi

# Run main
main "$@"

