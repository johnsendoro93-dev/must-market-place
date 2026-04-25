import cv2
import numpy as np

def run_colony_counter(image_path):
    # 1. LOAD & PREPROCESS
    img = cv2.imread(image_path)
    if img is None:
        print("Error: Could not find the image. Check the file name!")
        return

    # Convert to gray and fix lighting/glare
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray)
    
    # Smooth out agar scratches
    blurred = cv2.GaussianBlur(enhanced, (5, 5), 0)

    # 2. SEGMENTATION (Find the colonies)
    # Thresholding: Everything darker than 'X' becomes Black, lighter becomes White
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # 3. WATERSHED (Separate touching colonies)
    kernel = np.ones((3,3), np.uint8)
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=2)
    dist_transform = cv2.distanceTransform(opening, cv2.DIST_L2, 5)
    _, sure_fg = cv2.threshold(dist_transform, 0.4 * dist_transform.max(), 255, 0)
    
    # 4. COUNTING CONTOURS
    sure_fg = np.uint8(sure_fg)
    contours, _ = cv2.findContours(sure_fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # 5. DRAW & DISPLAY
    count = 0
    for i, cnt in enumerate(contours):
        area = cv2.contourArea(cnt)
        if area > 20:  # Filter out tiny dust/noise
            count += 1
            cv2.drawContours(img, [cnt], -1, (0, 255, 0), 2)
            # Label the number next to the colony
            x, y, w, h = cv2.boundingRect(cnt)
            cv2.putText(img, str(count), (x, y-5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

    print(f"Success! Total Colonies Counted: {count}")
    cv2.imshow("MUST Microbiology Lab - Result", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# HOW TO USE: 
# Put your image in the same folder and type its name below:
# run_colony_counter("dish_sample.jpg")