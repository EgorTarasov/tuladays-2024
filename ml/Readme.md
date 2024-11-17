
# Подготовка и обучение модели YOLOv5

Данный проект включает код для подготовки данных и обучения модели YOLOv5 на пользовательском датасете.

---

## Описание проекта

YOLOv5 — это одна из современных моделей детекции объектов. Она может быть эффективно обучена на пользовательских данных для различных задач, связанных с обнаружением объектов. Этот проект автоматизирует процесс подготовки данных, создания структуры папок, конфигурационного файла и запуска обучения модели.

---

## Код проекта

### Подготовка данных и обучение модели
```python
import os
import random
import shutil

# Путь к извлеченному датасету
dataset_path = 'project-1-at-2024-11-15-15-42-5a714ca5'
images_path = os.path.join(dataset_path, 'images')
labels_path = os.path.join(dataset_path, 'labels')

# Папка для подготовки данных
prepared_dataset_path = 'prepared_dataset'
os.makedirs(prepared_dataset_path, exist_ok=True)

# Создаем структуру папок
for folder in ['images/train', 'images/val', 'labels/train', 'labels/val']:
    os.makedirs(os.path.join(prepared_dataset_path, folder), exist_ok=True)

# Разделение данных на train и val (80% train, 20% val)
image_files = [f for f in os.listdir(images_path) if f.endswith('.jpg')]
random.shuffle(image_files)
split_idx = int(0.8 * len(image_files))

train_images = image_files[:split_idx]
val_images = image_files[split_idx:]

# Копируем файлы в соответствующие папки
def copy_files(image_list, subset):
    for image in image_list:
        # Копируем изображение
        shutil.copy(os.path.join(images_path, image), os.path.join(prepared_dataset_path, f'images/{subset}', image))
        # Копируем соответствующую разметку
        label_file = image.replace('.jpg', '.txt')
        shutil.copy(os.path.join(labels_path, label_file), os.path.join(prepared_dataset_path, f'labels/{subset}', label_file))

copy_files(train_images, 'train')
copy_files(val_images, 'val')

# Создаем конфигурационный файл для YOLOv5
yaml_content = f"""
train: {prepared_dataset_path}/images/train
val: {prepared_dataset_path}/images/val

nc: {len(open(os.path.join(dataset_path, 'classes.txt')).readlines())}  # Количество классов
names: {open(os.path.join(dataset_path, 'classes.txt')).read().splitlines()}  # Имена классов
"""

yaml_path = os.path.join(prepared_dataset_path, 'dataset.yaml')
with open(yaml_path, 'w') as yaml_file:
    yaml_file.write(yaml_content)

# Устанавливаем YOLOv5 и запускаем обучение
os.system("git clone https://github.com/ultralytics/yolov5 yolov5")
os.system("pip install -r yolov5/requirements.txt")

# Запуск обучения
train_command = f"python yolov5/train.py --img 640 --batch 16 --epochs 50 --data {yaml_path} --weights yolov5s.pt"
os.system(train_command)
```

---

## Инструкция по использованию

### Шаг 1: Подготовка данных
1. Поместите папки с изображениями и аннотациями в директорию `project-1-at-<дата>`:
   - Изображения (`.jpg`) — в папку `images`.
   - Аннотации (`.txt`) — в папку `labels`.

2. Убедитесь, что файл `classes.txt` находится в корневой директории (`project-1-at-<дата>`). Этот файл должен содержать список классов.

---

### Шаг 2: Запуск подготовки данных
Запустите скрипт для подготовки данных:
```bash
python prepare_and_train.py
```

---

### Шаг 3: Проверка структуры данных
После выполнения скрипта папка `prepared_dataset` будет содержать:
```
prepared_dataset/
├── images/
│   ├── train/
│   └── val/
├── labels/
│   ├── train/
│   └── val/
├── dataset.yaml
```

---

### Шаг 4: Установка YOLOv5
Если YOLOv5 ещё не установлена, выполните:
```bash
git clone https://github.com/ultralytics/yolov5 yolov5
pip install -r yolov5/requirements.txt
```

---

### Шаг 5: Запуск обучения
Для обучения модели выполните:
```bash
python yolov5/train.py --img 640 --batch 16 --epochs 50 --data prepared_dataset/dataset.yaml --weights yolov5s.pt
```

---

## Результаты

После завершения обучения YOLOv5 создаёт папку `runs/train/exp` (или `expX` для последующих запусков), где сохраняются:
- **Метрики**: графики потерь, точности и полноты.
- **Модельные веса**: файлы `best.pt` и `last.pt`.
- **Примеры детекций**: изображения с предсказаниями.

---
![Alt text](path_to_image "Optional Title")


# Инструкция по использованию скрипта для предсказаний (Inference)

Этот скрипт выполняет детекцию объектов на изображении с помощью обученной модели YOLOv5, обрезает детектированные объекты и выполняет OCR (распознавание текста) для извлечения цифр.

---

## Шаги для использования

### 1. Установите зависимости
Убедитесь, что все необходимые библиотеки установлены. Для этого выполните:
```bash
pip install torch torchvision opencv-python pytesseract
```

Также убедитесь, что у вас установлен [Tesseract OCR](https://github.com/tesseract-ocr/tesseract).

---

### 2. Подготовьте обученную модель
Поместите обученную модель YOLOv5 (например, `best.pt`) в указанный путь:
```
yolov5/runs/train/exp4/weights/best.pt
```

---

### 3. Подготовьте изображение для предсказания
Разместите изображение, которое нужно обработать, в директорию проекта. Укажите путь к изображению в переменной `image_path` внутри файла `main_pipeline`.

---

### 4. Запустите скрипт
Выполните скрипт для выполнения предсказания:
```bash
python main_pipeline.py
```

---

### 5. Результаты
- **Детектированные объекты**:
  Обрезанные изображения сохраняются в папке `cropped_predictions/`.
- **Извлеченные цифры**:
  Извлеченные цифры будут напечатаны в консоли.

---

## Пример использования

### Пример вызова:
```python
if __name__ == "__main__":
    model_path = 'yolov5/runs/train/exp4/weights/best.pt'
    image_path = 'photo_2024-11-16_10-25-20.jpg'

    digits = main_pipeline(model_path, image_path, conf_threshold=0.2)
    print(f"Извлеченные цифры: {digits}")
```


