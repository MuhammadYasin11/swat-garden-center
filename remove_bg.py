from PIL import Image

def make_background_transparent(image_path, output_path):
    try:
        # Open the image and convert it to RGBA (to support transparency)
        img = Image.open(image_path).convert("RGBA")
        datas = img.getdata()
        
        # We need to find the background color (likely white or very light gray)
        # Based on the user's description and the visual, the background is around RGB(245, 245, 245) or higher.
        
        new_data = []
        for item in datas:
            # Change all white / light gray (also shades of off-white) pixels to transparent
            # R, G, B are all high (e.g. > 230)
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                # replacing it with a transparent pixel
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Successfully processed {image_path} -> {output_path}")
        
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    make_background_transparent("d:/Swat_Garden_Center_AI/frontend/public/logo.png", "d:/Swat_Garden_Center_AI/frontend/public/logo_transparent.png")
