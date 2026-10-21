# CarConf — X90 configurator

Веб-конфигуратор автомобиля **X90**.

В сцене используется одна модель:

**`public/models/car.glb`** — glTF Binary (GLB) кузова X90, около 17 МБ.  
Сайт загружает её по адресу `/models/car.glb`.

FBX-исходники в проект не входят. Если нужно заменить модель — положите новый файл с тем же именем `public/models/car.glb`.

## Запуск локально

Нужны Node.js 20.19+ и npm.

```bash
npm install
npm run dev
```

Откройте http://localhost:5173/

Сборка:

```bash
npm run build
npm run preview
```

## Как загрузить проект на GitHub

Ниже — полный путь с нуля. Команды выполняйте в папке проекта  
`C:\Users\MDL\OneDrive\Рабочий стол\carConf`  
(или откройте эту папку в терминале Cursor / PowerShell).

### 1. Установите Git (если ещё нет)

Скачайте [git-scm.com](https://git-scm.com/download/win), установите, перезапустите терминал. Проверка:

```bash
git --version
```

### 2. Аккаунт GitHub

1. Зайдите на [github.com](https://github.com) и войдите (или зарегистрируйтесь).
2. Справа сверху **+** → **New repository**.
3. **Repository name**: например `carConf`.
4. Сделайте репозиторий **Private**, если модель нельзя выкладывать публично.
5. **Не** ставьте галочки «Add a README», «.gitignore», «license» — папка проекта уже есть.
6. Нажмите **Create repository**.

GitHub покажет URL вида:

`https://github.com/ВАШ_ЛОГИН/carConf.git`

### 3. Первый коммит в этой папке

В PowerShell:

```powershell
cd "C:\Users\MDL\OneDrive\Рабочий стол\carConf"

git init
git add .
git status
```

В `git status` не должно быть `node_modules` и `dist`. Должны быть `src`, `public/models/car.glb`, `package.json`, `README.md`.

Если Git спросит имя и почту (один раз на компьютер):

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "you@example.com"
```

Коммит:

```bash
git commit -m "Initial commit: X90 car configurator"
```

Ветка `main`:

```bash
git branch -M main
```

### 4. Привязка к GitHub и отправка

Подставьте свой URL:

```bash
git remote add origin https://github.com/ВАШ_ЛОГИН/carConf.git
git push -u origin main
```

GitHub попросит войти. Удобнее **Personal Access Token**, а не пароль от аккаунта:

1. GitHub → фото профиля → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
2. **Generate new token**, права как минимум `repo`.
3. Скопируйте токен и вставьте его вместо пароля при `git push`.

Через SSH (если ключ уже добавлен в GitHub):

```bash
git remote add origin git@github.com:ВАШ_ЛОГИН/carConf.git
git push -u origin main
```

Если `remote origin already exists`:

```bash
git remote set-url origin https://github.com/ВАШ_ЛОГИН/carConf.git
git push -u origin main
```

### 5. Что не попадёт в Git

Это уже прописано в `.gitignore`:

- `node_modules` — зависимости, ставятся через `npm install`
- `dist` — результат сборки
- логи, `.env`, служебные файлы редактора

Модель `public/models/car.glb` **нужно** закоммитить: без неё сайт не покажет машину. Размер около 17 МБ, лимит GitHub — 100 МБ на файл.

### 6. Дальнейшие обновления

После правок:

```bash
git add .
git commit -m "Кратко, что изменилось"
git push
```

### 7. Клонирование на другой компьютер

```bash
git clone https://github.com/ВАШ_ЛОГИН/carConf.git
cd carConf
npm install
npm run dev
```
