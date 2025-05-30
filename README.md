## CLIENT

### Запуск и настройка проекта

1. Установите зависимости, учитывая несовместимости версий:

```bash
npm install
```

2. Запустите проект в режиме разработки:

```bash
npm run dev
```

---

### Настройка Google OAuth

Для активации `GOOGLE_CLIENT_ID` выполните следующие шаги:

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/).
2. Создайте новый проект.
3. В разделе **APIs & Services** откройте **Credentials**.
4. Нажмите **Create Credentials** → **OAuth client ID**.
5. Выберите тип приложения и заполните необходимые данные.
6. Скопируйте полученный **Client ID** и добавьте его в переменные окружения вашего проекта как `GOOGLE_CLIENT_ID`.

## SERVER

### Запуск и настройка проекта

1. Установите зависимости, учитывая несовместимости версий:

```bash
npm install
```

2. Запустите контейнеры Docker в фоновом режиме:

```bash
docker-compose up -d
```

3. Выполните деплой в режиме разработки:

```bash
npm run deploy:dev
```

4. Запустите проект в режиме разработки:

```bash
npm run dev
```

---

### Настройка Google OAuth

Для активации `GOOGLE_CLIENT_ID` выполните следующие шаги:

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/).
2. Создайте новый проект.
3. В разделе **APIs & Services** откройте **Credentials**.
4. Нажмите **Create Credentials** → **OAuth client ID**.
5. Выберите тип приложения и заполните необходимые данные.
6. Скопируйте полученный **Client ID** и добавьте его в переменные окружения вашего проекта как `GOOGLE_CLIENT_ID`.
