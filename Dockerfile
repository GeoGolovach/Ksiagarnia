# Используем официальный образ Node.js
FROM node:14

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Устанавливаем переменную окружения
ENV PORT=3000

# Открываем порт
EXPOSE 3000

# Команда для запуска приложения
CMD ["node", "app.js"] 