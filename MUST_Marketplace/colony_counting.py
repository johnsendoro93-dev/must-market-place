import cv2
import numpy as np

def analyze_petri_dish(img_path):
    # Load the image
    img = cv2.imread(img_path)
    if img is None:
        print("Aisee, I can't find that image file!")
        return

    # Step 1: Pre-process (Grayscale & Blur)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Step 2: Thresholding (Separating colonies from agar)
    # This turns colonies white and agar black
    _, thresh = cv2.threshold(blurred, 120, 255, cv2.THRESH_BINARY)

    # Step 3: Find Contours (The shapes of the colonies)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Step 4: Filter and Count
    count = 0
    for c in contours:
        if cv2.contourArea(c) > 20: # Ignore tiny dust/noise
            count += 1
            cv2.drawContours(img, [c], -1, (0, 255, 0), 2)

    print(f"Total Colonies Counted: {count}")
    cv2.imshow("MUST Lab Analysis", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# Test it (Make sure you have an image named 'dish.jpg' in your folder!)
# analyze_petri_dish('dish.jpg')
# ... (all your existing code above) ...

# THIS PART IS CRITICAL: It tells Python to actually start!
if __name__ == "__main__":
    print("Starting the MUST Colony Counter...")
    # Replace 'dish.jpg' with the actual name of your photo
    analyze_petri_dish('dish.jpg') 
    
    # This keeps the window open so it doesn't just disappear
    print("Analysis finished. Press any key on the image window to exit.")