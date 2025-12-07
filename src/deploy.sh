#!/bin/bash

# Pretest Frontend Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on any error

echo "🚀 Starting Pretest Frontend Deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/pretest/frontend"
BUILD_DIR="$PROJECT_DIR/build"
NGINX_CONFIG="/etc/nginx/sites-available/pretest-web.conf"
BACKUP_DIR="/var/backups/pretest-frontend"

# Step 1: Backup existing build
echo -e "${YELLOW}📦 Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
if [ -d "$BUILD_DIR" ]; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    tar -czf "$BACKUP_DIR/build_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR" build
    echo -e "${GREEN}✅ Backup created: build_$TIMESTAMP.tar.gz${NC}"
else
    echo -e "${YELLOW}⚠️  No existing build to backup${NC}"
fi

# Step 2: Pull latest code
echo -e "${YELLOW}📥 Pulling latest code from git...${NC}"
cd "$PROJECT_DIR"
git pull origin main || git pull origin master

# Step 3: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --production=false

# Step 4: Build project
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

# Check if build was successful
if [ ! -d "$BUILD_DIR" ] && [ ! -d "$PROJECT_DIR/dist" ]; then
    echo -e "${RED}❌ Build failed! No build directory found.${NC}"
    exit 1
fi

# Vite builds to 'dist' by default, rename to 'build' if needed
if [ -d "$PROJECT_DIR/dist" ] && [ ! -d "$BUILD_DIR" ]; then
    echo -e "${YELLOW}📁 Renaming dist to build...${NC}"
    mv "$PROJECT_DIR/dist" "$BUILD_DIR"
fi

# Step 5: Verify images directory
echo -e "${YELLOW}🖼️  Checking images directory...${NC}"
if [ ! -d "$BUILD_DIR/images" ]; then
    echo -e "${RED}⚠️  WARNING: images/ directory not found in build!${NC}"
    echo -e "${YELLOW}Creating images directory...${NC}"
    mkdir -p "$BUILD_DIR/images"
    
    # Copy from public if exists
    if [ -d "$PROJECT_DIR/public/images" ]; then
        echo -e "${YELLOW}Copying images from public/images...${NC}"
        cp -r "$PROJECT_DIR/public/images/"* "$BUILD_DIR/images/"
        echo -e "${GREEN}✅ Images copied${NC}"
    else
        echo -e "${YELLOW}⚠️  No public/images directory found${NC}"
        echo -e "${YELLOW}Please add images manually to: $BUILD_DIR/images/${NC}"
    fi
else
    echo -e "${GREEN}✅ Images directory exists${NC}"
    ls -lh "$BUILD_DIR/images/"
fi

# Step 6: Set permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
chown -R www-data:www-data "$BUILD_DIR"
chmod -R 755 "$BUILD_DIR"

# Step 7: Update Nginx config (optional)
echo -e "${YELLOW}🔧 Checking Nginx config...${NC}"
if [ -f "$NGINX_CONFIG" ]; then
    # Test nginx config
    nginx -t
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Nginx config is valid${NC}"
    else
        echo -e "${RED}❌ Nginx config has errors!${NC}"
        exit 1
    fi
else
    echo -e "${RED}⚠️  Nginx config not found at $NGINX_CONFIG${NC}"
fi

# Step 8: Reload Nginx
echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
systemctl reload nginx

# Step 9: Verify deployment
echo -e "${YELLOW}✅ Verifying deployment...${NC}"
echo ""
echo "📋 Build Summary:"
echo "  - Build directory: $BUILD_DIR"
echo "  - Build size: $(du -sh $BUILD_DIR | cut -f1)"
echo "  - Images: $(find $BUILD_DIR/images -type f 2>/dev/null | wc -l) files"
echo ""

# Check if images exist
if [ -d "$BUILD_DIR/images" ]; then
    echo -e "${GREEN}✅ Images directory found:${NC}"
    ls -lh "$BUILD_DIR/images/" | grep -v '^total'
else
    echo -e "${RED}❌ Images directory NOT found!${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo "🌐 Test URLs:"
echo "  - https://pre-test.uz"
echo "  - https://pre-test.uz/images/hero-image.png"
echo ""
echo "📝 Next steps:"
echo "  1. Check browser console for errors"
echo "  2. Test image loading: curl -I https://pre-test.uz/images/hero-image.png"
echo "  3. Clear browser cache: Ctrl+Shift+R"
echo ""
