const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './images';
const outputDir = './images';

// Создаем выходную директорию, если она не существует
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Получаем список всех jpg файлов
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Ошибка чтения директории:', err);
        return;
    }

    // Фильтруем только jpg файлы
    const jpgFiles = files.filter(file =>
        file.toLowerCase().endsWith('.jpg') ||
        file.toLowerCase().endsWith('.jpeg')
    );

    // Конвертируем каждый файл
    jpgFiles.forEach(file => {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, `${path.parse(file).name}.webp`);

        sharp(inputPath)
            .webp({ quality: 80 }) // Качество WebP (0-100)
            .toFile(outputPath)
            .then(info => {
                console.log(`Успешно конвертирован ${file} -> ${path.parse(file).name}.webp`);
                console.log(`Размер уменьшен с ${fs.statSync(inputPath).size} до ${info.size} байт`);
            })
            .catch(err => {
                console.error(`Ошибка при конвертации ${file}:`, err);
            });
    });
}); 