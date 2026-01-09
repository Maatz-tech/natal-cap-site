#!/bin/bash

# =============================================================================
# Image Optimization Script for Natal Cap
# =============================================================================
# This script converts PNG/JPG images to WebP format and compresses them
#
# Prerequisites:
#   - Install cwebp: brew install webp
#   - Install imagemagick (optional, for resizing): brew install imagemagick
#
# Usage: ./optimize-images.sh
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Natal Cap Image Optimization ===${NC}"
echo ""

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo -e "${RED}Error: cwebp is not installed.${NC}"
    echo "Install it with: brew install webp"
    exit 1
fi

# Directory containing images
IMAGE_DIR="images"

# Quality settings
QUALITY=80  # WebP quality (0-100)

# Create backup directory
BACKUP_DIR="images_backup_$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}Creating backup in ${BACKUP_DIR}...${NC}"
cp -r "$IMAGE_DIR" "$BACKUP_DIR"

# Counter for processed images
PROCESSED=0
SAVED_BYTES=0

# Function to convert and optimize images
optimize_image() {
    local file="$1"
    local filename=$(basename "$file")
    local dirname=$(dirname "$file")
    local extension="${filename##*.}"
    local basename="${filename%.*}"
    local webp_file="${dirname}/${basename}.webp"

    # Get original file size
    local original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)

    # Convert to WebP
    if cwebp -q $QUALITY "$file" -o "$webp_file" 2>/dev/null; then
        local new_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
        local saved=$((original_size - new_size))
        SAVED_BYTES=$((SAVED_BYTES + saved))

        # Calculate percentage saved
        local percent=$((100 * saved / original_size))

        echo -e "${GREEN}✓${NC} $file"
        echo "   Original: $(numfmt --to=iec-i --suffix=B $original_size 2>/dev/null || echo "${original_size} bytes")"
        echo "   WebP:     $(numfmt --to=iec-i --suffix=B $new_size 2>/dev/null || echo "${new_size} bytes") (${percent}% smaller)"

        ((PROCESSED++))
    else
        echo -e "${RED}✗${NC} Failed to convert: $file"
    fi
}

# Find and process all PNG and JPG files
echo ""
echo -e "${YELLOW}Converting images to WebP...${NC}"
echo ""

# Process PNG files
while IFS= read -r -d '' file; do
    optimize_image "$file"
done < <(find "$IMAGE_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo ""
echo -e "${YELLOW}=== Summary ===${NC}"
echo "Images processed: $PROCESSED"
echo "Total space saved: $(numfmt --to=iec-i --suffix=B $SAVED_BYTES 2>/dev/null || echo "${SAVED_BYTES} bytes")"
echo ""
echo -e "${YELLOW}=== Next Steps ===${NC}"
echo "1. Update your HTML files to use .webp images with fallbacks:"
echo ""
echo '   <picture>'
echo '     <source srcset="image.webp" type="image/webp">'
echo '     <img src="image.png" alt="Description">'
echo '   </picture>'
echo ""
echo "2. Or use CSS background images with WebP:"
echo ""
echo '   .hero {'
echo '     background-image: url("image.webp");'
echo '   }'
echo ""
echo -e "${GREEN}Backup saved to: ${BACKUP_DIR}${NC}"
echo ""

# List the largest files that should be prioritized
echo -e "${YELLOW}=== Priority Files (Largest) ===${NC}"
find "$IMAGE_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -exec ls -lh {} \; | sort -k5 -h -r | head -10
