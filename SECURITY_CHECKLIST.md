# ✅ Чеклист безопасности

## 🚨 Перед первым коммитом

```bash
# 1. Проверьте что .env НЕ будет закоммичен
git status | grep .env
# Не должно ничего показать!

# 2. Проверьте .gitignore
cat .gitignore | grep "^\.env"
# Должно показать: .env

# 3. Проверьте что нет чувствительных файлов
git ls-files | grep -E '\.(env|key|pem|secret|sql)$'
# Не должно ничего найти!

# 4. Проверьте историю Git (если уже коммитили)
git log --all --full-history -- .env
# Не должно показывать коммитов с .env
```

## 🔒 Перед деплоем в Production

### Backend
- [ ] `DJANGO_DEBUG=False` в .env
- [ ] Уникальный `DJANGO_SECRET_KEY` генерирован
- [ ] `ALLOWED_HOSTS` содержит только продакшен домены
- [ ] `VK_APP_SECRET` настроен реальный (из VK)
- [ ] PostgreSQL настроен (не SQLite)
- [ ] HTTPS/SSL сертификаты установлены
- [ ] CORS настроен только для нужных доменов
- [ ] Rate limiting добавлен

### Frontend
- [ ] `VITE_API_BASE` указывает на production API
- [ ] Source maps отключены или защищены
- [ ] CSP headers настроены в nginx

### Infrastructure
- [ ] Бэкапы БД настроены
- [ ] Мониторинг (Sentry) подключён
- [ ] Логирование работает
- [ ] Firewall настроен

## ⚠️ НИКОГДА не коммитить в Git:

```
❌ .env
❌ .env.local
❌ .env.production
❌ db.sqlite3
❌ *.key
❌ *.pem
❌ secrets/
❌ backups/
❌ *.log (могут содержать данные)
```

## ✅ Безопасно коммитить:

```
✅ .env.example
✅ .env.template
✅ .gitignore
✅ README.md
✅ Исходный код (без секретов)
```

## 🔑 Генерация секретов

```bash
# Django Secret Key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Или через OpenSSL
openssl rand -base64 50
```

## 🆘 Если .env уже в Git

```bash
# 1. Удалите из индекса (но не с диска!)
git rm --cached .env

# 2. Убедитесь что в .gitignore
echo ".env" >> .gitignore

# 3. Закоммитьте удаление
git commit -m "Remove .env from git tracking"

# 4. РОТИРУЙТЕ ВСЕ СЕКРЕТЫ!
# Все ключи из .env теперь скомпрометированы!
```

## 📞 Дополнительная информация

См. [SECURITY.md](SECURITY.md) для полного гайда по безопасности.

