#!/bin/bash

# Quick Image Check Script
# Usage: ./check-server-images.sh

echo "🔍 Checking server images..."
echo ""

# Configuration
BUILD_DIR="/var/www/pretest/frontend/build"
PUBLIC_DIR="/var/www/pretest/frontend/public"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check build directory
echo "📁 Build directory: $BUILD_DIR"
if [ -d "$BUILD_DIR" ]; then
    echo -e "${GREEN}✅ Build directory exists${NC}"
    echo "   Size: $(du -sh $BUILD_DIR | cut -f1)"
else
    echo -e "${RED}❌ Build directory NOT found!${NC}"
    exit 1
fi

echo ""

# Check images in build
echo "🖼️  Images in build/images/:"
if [ -d "$BUILD_DIR/images" ]; then
    echo -e "${GREEN}✅ images/ directory exists${NC}"
    echo ""
    ls -lh "$BUILD_DIR/images/" | grep -v '^total'
    echo ""
    echo "   Total images: $(find $BUILD_DIR/images -type f 2>/dev/null | wc -l)"
else
    echo -e "${RED}❌ images/ directory NOT found in build!${NC}"
    echo ""
fi

# Check specific required images
echo ""
echo "📋 Required images:"
REQUIRED_IMAGES=(
    "hero-image.png"
    "click-logo.png"
    "feedback-image.png"
    "westminster-bigben.png"
)

for img in "${REQUIRED_IMAGES[@]}"; do
    if [ -f "$BUILD_DIR/images/$img" ]; then
        SIZE=$(du -h "$BUILD_DIR/images/$img" | cut -f1)
        echo -e "  ${GREEN}✅${NC} $img ($SIZE)"
    else
        echo -e "  ${RED}❌${NC} $img - MISSING!"
    fi
done

echo ""

# Check public/images (source)
echo "📦 Source images (public/images/):"
if [ -d "$PUBLIC_DIR/images" ]; then
    echo -e "${GREEN}✅ public/images/ exists${NC}"
    echo ""
    ls -lh "$PUBLIC_DIR/images/" | grep -v '^total'
    echo ""
else
    echo -e "${YELLOW}⚠️  public/images/ not found${NC}"
    echo "   This is okay if images are already in build/"
fi

echo ""

# Test image URLs
echo "🌐 Testing image URLs:"
DOMAIN="https://pre-test.uz"

for img in "${REQUIRED_IMAGES[@]}"; do
    echo -n "  Testing $DOMAIN/images/$img ... "
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/images/$img" --max-time 5)
    
    if [ "$HTTP_CODE" == "200" ]; then
        echo -e "${GREEN}✅ $HTTP_CODE${NC}"
    elif [ "$HTTP_CODE" == "404" ]; then
        echo -e "${RED}❌ $HTTP_CODE - Not Found${NC}"
    else
        echo -e "${YELLOW}⚠️  $HTTP_CODE${NC}"
    fi
done

echo ""

# Nginx status
echo "🔧 Nginx status:"
systemctl is-active nginx &>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
else
    echo -e "${RED}❌ Nginx is NOT running!${NC}"
fi

echo ""

# Summary
echo "📊 Summary:"
if [ -d "$BUILD_DIR/images" ]; then
    FOUND=$(find "$BUILD_DIR/images" -type f 2>/dev/null | wc -l)
    REQUIRED=${#REQUIRED_IMAGES[@]}
    
    if [ "$FOUND" -ge "$REQUIRED" ]; then
        echo -e "${GREEN}✅ All checks passed!${NC}"
    else
        echo -e "${YELLOW}⚠️  Some images are missing${NC}"
        echo ""
        echo "💡 Solution:"
        echo "   1. Add images to public/images/"
        echo "   2. Run: npm run build"
        echo "   3. Or run: ./deploy.sh"
    fi
else
    echo -e "${RED}❌ Images directory not found in build${NC}"
    echo ""
    echo "💡 Solution:"
    echo "   1. Create: mkdir -p $BUILD_DIR/images"
    echo "   2. Copy from public: cp -r $PUBLIC_DIR/images/* $BUILD_DIR/images/"
    echo "   3. Or run: ./deploy.sh"
fi

echo ""
