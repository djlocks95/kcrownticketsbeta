#!/bin/bash

# Package files for download for local installation
echo "Creating downloadable package for Party Bus Booking Manager..."

# Create temp directory
mkdir -p temp_package

# Copy necessary files and folders
cp -r client temp_package/
cp -r server temp_package/
cp -r shared temp_package/
cp package.json temp_package/
cp package-lock.json temp_package/
cp README.md temp_package/
cp start-unix.sh temp_package/
cp start-windows.bat temp_package/
cp -r components.json temp_package/
cp -r drizzle.config.ts temp_package/
cp -r postcss.config.js temp_package/
cp -r tailwind.config.ts temp_package/
cp -r tsconfig.json temp_package/
cp -r vite.config.ts temp_package/

# Make start scripts executable
chmod +x temp_package/start-unix.sh

# Zip the package
zip -r party-bus-booking-manager.zip temp_package

# Clean up
rm -rf temp_package

echo "Package created: party-bus-booking-manager.zip"
echo "Distribute this ZIP file to users for local installation."