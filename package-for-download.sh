#!/bin/bash

# Create a temporary directory
mkdir -p temp_download

# Copy all required files
cp -r client temp_download/
cp -r server temp_download/
cp -r shared temp_download/
cp components.json temp_download/
cp drizzle.config.ts temp_download/
cp package.json temp_download/
cp package-lock.json temp_download/
cp postcss.config.js temp_download/
cp tailwind.config.ts temp_download/
cp tsconfig.json temp_download/
cp vite.config.ts temp_download/
cp README.md temp_download/

# Create a zip file
zip -r party-bus-booking-manager.zip temp_download

# Clean up
rm -rf temp_download

echo "Created party-bus-booking-manager.zip ready for download"