# 🚨 ВАЖНО! Защита от утечки секретов в Git

## ⚡ Быстрая проверка перед коммитом

```bash
# Скопируйте и выполните эту команду перед КАЖДЫМ коммитом:
git status && echo "---" && git diff --cached --name-only | grep -E '(\.env|secret|\.key|\.pem|db\.sqlite3)' && echo "⚠️ ВНИМАНИЕ! Обнаружены чувствительные файлы!" || echo "✅ Проверка пройдена"
```

## 🔴 ТОП-5 файлов, которые НЕЛЬЗЯ коммитить

| Файл | Почему нельзя | Что делать |
|------|---------------|------------|
| `.env` | Содержит SECRET_KEY, пароли, токены | Добавить в .gitignore |
| `db.sqlite3` | База данных с реальными данными | Добавить в .gitignore |
| `*.key`, `*.pem` | SSL сертификаты и приватные ключи | Добавить в .gitignore |
| `backup/`, `*.sql` | Бэкапы могут содержать данные | Добавить в .gitignore |
| `*.log` | Логи могут содержать чувствительную информацию | Добавить в .gitignore |

## ✅ Что МОЖНО коммитить

- ✅ `.env.example` - шаблон без реальных значений
- ✅ `.gitignore` - правила игнорирования
- ✅ Исходный код (Python, TypeScript, etc)
- ✅ Конфигурационные файлы (без секретов)
- ✅ Документация (README, etc)

## 🔒 Настройка .gitignore (уже сделано!)

Файл `.gitignore` в корне проекта уже настроен и защищает:
- ✅ Все `.env` файлы
- ✅ База данных SQLite
- ✅ Ключи и сертификаты
- ✅ Логи и бэкапы
- ✅ Временные файлы

**Проверка:**
```bash
cat .gitignore | head -20
# Должны увидеть секцию "ЧУВСТВИТЕЛЬНЫЕ ДАННЫЕ"
```

## 🆘 Если уже закоммитили .env

### Вариант 1: Файл в последнем коммите (не запушили)

```bash
# Удалите из последнего коммита
git reset HEAD~1
git add .gitignore
git commit -m "Add .gitignore"

# РОТИРУЙТЕ ВСЕ СЕКРЕТЫ!
```

### Вариант 2: Файл уже запушен в GitHub

```bash
# 1. Удалите файл из Git
git rm --cached .env
git commit -m "Remove .env"
git push

# 2. Очистите историю (ОСТОРОЖНО!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (если это ваш репозиторий)
git push origin --force --all

# 4. КРИТИЧНО: Ротируйте ВСЕ секреты из .env!
```

### Вариант 3: Используйте BFG Repo Cleaner

```bash
# Установка (macOS)
brew install bfg

# Удаление файла из истории
bfg --delete-files .env

# Очистка
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

## 🔑 Что делать после утечки

1. **НЕМЕДЛЕННО ротируйте все секреты:**
   ```bash
   # Новый Django Secret Key
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

2. **Пересоздайте VK App Secret:**
   - Зайдите в настройки VK приложения
   - Пересоздайте Secret Key
   - Обновите на сервере

3. **Проверьте логи на подозрительную активность**

4. **Смените пароли БД**

5. **Уведомите команду**

## 📋 Чеклист перед каждым коммитом

```bash
# 1. Проверьте статус
git status

# 2. Посмотрите что будет закоммичено
git diff --cached

# 3. Проверьте файлы
git diff --cached --name-only

# 4. Убедитесь что нет .env
git diff --cached --name-only | grep .env
# Не должно ничего вывести!

# 5. Коммитьте
git commit -m "Your message"
```

## 🛡️ Дополнительная защита

### Pre-commit хук (автоматическая проверка)

Создайте файл `.git/hooks/pre-commit`:

```bash
#!/bin/sh

# Проверка на чувствительные файлы
if git diff --cached --name-only | grep -E '(\.env$|secret|\.key|\.pem)'; then
    echo "⚠️ ОШИБКА: Обнаружены чувствительные файлы!"
    echo "Удалите их из коммита или добавьте в .gitignore"
    exit 1
fi

echo "✅ Проверка безопасности пройдена"
exit 0
```

Сделайте исполняемым:
```bash
chmod +x .git/hooks/pre-commit
```

### GitHub Secret Scanning

GitHub автоматически сканирует публичные репозитории на секреты.
Для приватных репозиториев включите Advanced Security.

### Используйте git-secrets

```bash
# Установка
brew install git-secrets  # macOS
# или
apt-get install git-secrets  # Linux

# Настройка для проекта
git secrets --install
git secrets --register-aws  # AWS ключи
git secrets --add 'SECRET_KEY.*'
git secrets --add 'VK_APP_SECRET.*'
```

## 💡 Лучшие практики

1. **НИКОГДА** не пишите секреты напрямую в код
2. **ВСЕГДА** используйте переменные окружения
3. **ПРОВЕРЯЙТЕ** `git status` перед коммитом
4. **ИСПОЛЬЗУЙТЕ** `.env.example` как шаблон
5. **РОТИРУЙТЕ** секреты регулярно (каждые 3-6 месяцев)
6. **РАЗДЕЛЯЙТЕ** секреты для dev/staging/prod
7. **ХРАНИТЕ** production секреты в secrets manager (Vault, AWS Secrets)

## 📚 Ссылки

- [SECURITY.md](SECURITY.md) - Полный гайд по безопасности
- [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) - Детальный чеклист
- [.gitignore](.gitignore) - Файл с правилами игнорирования

---

## ⚠️ ВАЖНОЕ НАПОМИНАНИЕ

**Если секрет попал в Git, он скомпрометирован!**

Даже если вы удалите файл из последнего коммита, он остаётся в истории Git.
**ВСЕГДА ротируйте секреты после утечки!**

---

**Будьте бдительны! Безопасность - это не опция, а необходимость.**

