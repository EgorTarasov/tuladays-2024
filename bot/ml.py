from models import HeartData
from PIL import Image
import os
import cv2
import torch
import easyocr


class ObjectDetector:
    def __init__(self, model_path: str, conf_threshold=0.25):
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
        model = torch.hub.load("ultralytics/yolov5", "custom", path=self.model_path)
        model.conf = self.conf_threshold  # Set confidence threshold
        return model

    def predict(self, image_path):
        """
        Runs predictions on the input image.
        :param image_path: Path to the input image.
        :return: Prediction results (DataFrame).
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
        :param results: Prediction results (DataFrame).
        :param output_dir: Directory to save cropped objects.
        """
        os.makedirs(output_dir, exist_ok=True)
        image = cv2.imread(image_path)
        if image is None:
            print(f"Failed to load image: {image_path}")
            return

        detections = self.get_detections(results)
        cropped_paths = []
        for i, row in detections.iterrows():
            # Extract bounding box coordinates
            x1, y1, x2, y2 = map(
                int, [row["xmin"], row["ymin"], row["xmax"], row["ymax"]]
            )
            confidence = row["confidence"]
            cls = int(row["class"])
            label = row["name"]

            # Crop object
            cropped_object = image[y1:y2, x1:x2]

            # Save cropped object
            cropped_image_name = f"{os.path.splitext(os.path.basename(image_path))[0]}_class{cls}_conf{confidence:.2f}_obj{i}.jpg"
            cropped_image_path = os.path.join(output_dir, cropped_image_name)
            cv2.imwrite(cropped_image_path, cropped_object)
            cropped_paths.append(cropped_image_path)
            print(f"Saved object: {cropped_image_path}")
        return cropped_paths


class TextExtractor:
    def __init__(self, languages=["en"]):
        """
        Initialize the EasyOCR reader.
        :param languages: List of languages to support. Defaults to English.
        """
        self.reader = easyocr.Reader(
            languages, gpu=True
        )  # Set gpu=False if GPU is not available

    def extract_numbers(self, image_path):
        """
        Extracts numbers from the input image using EasyOCR.
        :param image_path: Path to the input image.
        :return: List of extracted numbers.
        """
        # Perform OCR on the image
        results = self.reader.readtext(image_path, detail=0, paragraph=False)

        # Regular expression to find numbers
        number_pattern = re.compile(r"\d+")

        extracted_numbers = []

        for result in results:
            numbers = number_pattern.findall(result)
            extracted_numbers.extend(numbers)

        # Convert extracted numbers to integers and ensure uniqueness
        unique_numbers = list(set(int(num) for num in extracted_numbers))

        # Limit to 3 numbers as per the original requirement
        return unique_numbers[:3]


def process(image_path, user_id, model_path="best.pt", conf_threshold=0.25):
    detector = ObjectDetector(model_path=model_path, conf_threshold=conf_threshold)

    results = detector.predict(image_path)

    detector.visualize(results, save_dir="output_results")

    cropped_paths = detector.crop_objects(
        image_path, results, output_dir="cropped_predictions"
    )
    print(cropped_paths)
    text_extractor = TextExtractor()

    for cropped_image in cropped_paths:
        numbers = text_extractor.extract_numbers(cropped_image)

    return HeartData(
        user_id=user_id,
        heart_rate=numbers[0],
        systolic_pressure=numbers[1],
        diastolic_pressure=numbers[2],
    )


if __name__ == "__main__":
    model_path = "yolov5/runs/train/exp4/weights/best.pt"
    image_path = "photo_2024-11-16_10-25-20.jpg"

    print(main_pipeline(model_path, image_path, conf_threshold=0.2))
