import os
import random
import shutil

dataset_path = 'project-1-at-2024-11-15-15-42-5a714ca5'
images_path = os.path.join(dataset_path, 'images')
labels_path = os.path.join(dataset_path, 'labels')

prepared_dataset_path = 'prepared_dataset'
os.makedirs(prepared_dataset_path, exist_ok=True)

for folder in ['images/train', 'images/val', 'labels/train', 'labels/val']:
    os.makedirs(os.path.join(prepared_dataset_path, folder), exist_ok=True)

image_files = [f for f in os.listdir(images_path) if f.endswith('.jpg')]
random.shuffle(image_files)
split_idx = int(0.8 * len(image_files))

train_images = image_files[:split_idx]
val_images = image_files[split_idx:]

def copy_files(image_list, subset):
    for image in image_list:
        shutil.copy(os.path.join(images_path, image), os.path.join(prepared_dataset_path, f'images/{subset}', image))
        label_file = image.replace('.jpg', '.txt')
        shutil.copy(os.path.join(labels_path, label_file), os.path.join(prepared_dataset_path, f'labels/{subset}', label_file))

copy_files(train_images, 'train')
copy_files(val_images, 'val')

yaml_content = f"""
train: {os.path.join(prepared_dataset_path, 'images/train')}
val: {os.path.join(prepared_dataset_path, 'images/val')}

nc: {len(open(os.path.join(dataset_path, 'classes.txt')).readlines())}  # Количество классов
names: {open(os.path.join(dataset_path, 'classes.txt')).read().splitlines()}  # Имена классов
"""

yaml_path = os.path.join(prepared_dataset_path, 'dataset.yaml')
with open(yaml_path, 'w') as yaml_file:
    yaml_file.write(yaml_content)

os.system("git clone https://github.com/ultralytics/yolov5 yolov5")
os.system("pip install -r yolov5/requirements.txt")

train_command = f"python yolov5/train.py --img 640 --batch 16 --epochs 50 --data {yaml_path} --weights yolov5s.pt"
os.system(train_command)
