import torch
import cv2
import os
import pytesseract


class ObjectDetector:
    def __init__(self, model_path, conf_threshold=0.2):
        """
        Initialize the Object Detector using a YOLOv5 model.
        :param model_path: Path to the trained YOLOv5 model.
        :param conf_threshold: Confidence threshold for predictions.
        """
        self.model_path = model_path
        self.conf_threshold = conf_threshold
        self.model = self.load_model()

    def load_model(self):
        """
        Loads the YOLOv5 model.
        :return: Loaded YOLOv5 model.
        """
        print(f"Loading model from: {self.model_path}")
        model = torch.hub.load('ultralytics/yolov5', 'custom', path=self.model_path)
        model.conf = self.conf_threshold  # Set confidence threshold
        return model

    def predict(self, image_path):
        """
        Runs predictions on the input image.
        :param image_path: Path to the input image.
        :return: Prediction results.
        """
        print(f"Running prediction on image: {image_path}")
        results = self.model(image_path)
        results.print()
        return results

    def visualize(self, results, save_dir="results"):
        """
        Visualizes and saves prediction results.
        :param results: Prediction results.
        :param save_dir: Directory to save visualizations.
        """
        results.show()
        results.save(save_dir=save_dir)  # Save results
        print(f"Results saved in directory: {save_dir}")

    def get_detections(self, results):
        """
        Extracts detections as a DataFrame.
        :param results: Prediction results.
        :return: DataFrame of detections.
        """
        detections = results.pandas().xyxy[0]
        print("Detections:")
        print(detections)
        return detections

    def crop_objects(self, image_path, results, output_dir="cropped_predictions"):
        """
        Crops objects from the image based on detections and saves them.
        :param image_path: Path to the input image.
        :param results: Prediction results.
        :param output_dir: Directory to save cropped objects.
        :return: List of paths to cropped images.
        """
        os.makedirs(output_dir, exist_ok=True)
        image = cv2.imread(image_path)
        if image is None:
            print(f"Failed to load image: {image_path}")
            return []

        detections = self.get_detections(results)
        cropped_paths = []
        for i, row in detections.iterrows():
            x1, y1, x2, y2 = map(int, [row['xmin'], row['ymin'], row['xmax'], row['ymax']])
            confidence = row['confidence']
            cls = int(row['class'])
            label = row['name']

            cropped_object = image[y1:y2, x1:x2]

            cropped_image_name = f"{os.path.splitext(os.path.basename(image_path))[0]}_class{cls}_conf{confidence:.2f}_obj{i}.jpg"
            cropped_image_path = os.path.join(output_dir, cropped_image_name)
            cv2.imwrite(cropped_image_path, cropped_object)
            cropped_paths.append(cropped_image_path)
            print(f"Saved object: {cropped_image_path}")
        return cropped_paths


def perform_ocr(image_path):
    """
    Perform OCR on a given image to extract digits.
    :param image_path: Path to the image for OCR.
    :return: Extracted digits as a string.
    """
    image = cv2.imread(image_path)
    if image is None:
        print(f"Failed to load image for OCR: {image_path}")
        return ""

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    custom_config = r'--oem 3 --psm 6 outputbase digits'

    extracted_text = pytesseract.image_to_string(rgb_image, config=custom_config)

    digits = ''.join(filter(str.isdigit, extracted_text))
    return digits


def main_pipeline(model_path, image_path, conf_threshold=0.25):
    detector = ObjectDetector(model_path=model_path, conf_threshold=conf_threshold)

    results = detector.predict(image_path)

    detector.visualize(results, save_dir="output_results")

    cropped_paths = detector.crop_objects(image_path, results, output_dir="cropped_predictions")

    for cropped_image_path in cropped_paths:
        digits = perform_ocr(cropped_image_path)
        return digits


if __name__ == "__main__":
    model_path = 'yolov5/runs/train/exp4/weights/best.pt'
    image_path = 'photo_2024-11-16_10-25-20.jpg'

    print(main_pipeline(model_path, image_path, conf_threshold=0.2))
