import multer from 'multer';
import path from 'path';

// Настраиваем, куда сохранять файлы и как их называть
const storage = multer.diskStorage({
  // Указываем папку для сохранения
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // Генерируем уникальное имя файла, чтобы избежать конфликтов
  filename: (req, file, cb) => {
    // Формат имени: user-[id_пользователя]-[текущее_время].[расширение_файла]
    // Например: user-42-1677619200000.jpg
    const uniqueSuffix = `user-${req.userId}-${Date.now()}`;
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

// Фильтр файлов, чтобы разрешать загрузку только изображений
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Принять файл
  } else {
    cb(new Error('Можно загружать только изображения!'), false); // Отклонить файл
  }
};

// Создаем и экспортируем настроенный экземпляр multer
export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Ограничение размера файла в 5 МБ
  }
});