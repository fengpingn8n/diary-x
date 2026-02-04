from PIL import Image, ImageDraw, ImageFont, ImageColor
import os

def create_icon(size, text="DX", output_path="icon.png"):
    # Create a new image with a gradient background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Gradient colors (Soft Blue to White-ish Blue)
    top_color = (66, 135, 245) # #4287f5
    bottom_color = (138, 185, 255) # #8ab9ff
    
    # Draw rounded rectangle (simulated by drawing a big one and masking or just a circle/squircle)
    # For simplicity, we fill background with gradient
    for y in range(size):
        r = int(top_color[0] + (bottom_color[0] - top_color[0]) * y / size)
        g = int(top_color[1] + (bottom_color[1] - top_color[1]) * y / size)
        b = int(top_color[2] + (bottom_color[2] - top_color[2]) * y / size)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
        
    # Draw simple "book" shape (white rectangle)
    margin = int(size * 0.25)
    book_w = size - 2 * margin
    book_h = int(size * 0.6)
    book_x = margin
    book_y = int(size * 0.2)
    
    # Draw Text centered
    # Try to load a nice font, otherwise default
    try:
        font = ImageFont.truetype("arial.ttf", int(size * 0.5))
    except:
        font = ImageFont.load_default()
        
    draw.text((size//2, size//2), text, fill="white", anchor="mm", font=font)
    
    img.save(output_path)
    print(f"Created {output_path}")

# Output directory
output_dir = r"C:\Users\hohei\Documents\EverythingCode\diary-x\public"
os.makedirs(output_dir, exist_ok=True)

create_icon(192, "DX", os.path.join(output_dir, "pwa-192x192.png"))
create_icon(512, "DX", os.path.join(output_dir, "pwa-512x512.png"))
create_icon(180, "DX", os.path.join(output_dir, "apple-touch-icon.png"))
