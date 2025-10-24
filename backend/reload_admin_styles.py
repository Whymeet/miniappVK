#!/usr/bin/env python
"""
Скрипт для проверки и перезагрузки стилей админки Django
"""

import os
import sys
from pathlib import Path

# Цвета для вывода в консоль
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'

def check_file(path, description):
    """Проверяет наличие файла"""
    if path.exists():
        print(f"{GREEN}✓{RESET} {description}: {path}")
        return True
    else:
        print(f"{RED}✗{RESET} {description}: {RED}НЕ НАЙДЕН{RESET} - {path}")
        return False

def main():
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}  Проверка стилей админки Django{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    # Определяем базовую директорию
    base_dir = Path(__file__).resolve().parent
    app_dir = base_dir / 'app'
    
    # Проверяем файлы
    checks = [
        (app_dir / 'static' / 'admin' / 'css' / 'custom_admin.css', 
         'Полные стили админки'),
        (app_dir / 'static' / 'admin' / 'css' / 'color-config.css', 
         'Упрощенная настройка цветов'),
        (app_dir / 'templates' / 'admin' / 'base_site.html', 
         'Шаблон админки'),
    ]
    
    all_ok = True
    for path, desc in checks:
        if not check_file(path, desc):
            all_ok = False
    
    print()
    
    if all_ok:
        print(f"{GREEN}{'='*60}{RESET}")
        print(f"{GREEN}  ✓ Все файлы на месте!{RESET}")
        print(f"{GREEN}{'='*60}{RESET}\n")
        
        print(f"{YELLOW}📝 Следующие шаги:{RESET}\n")
        print(f"1. Откройте файл для редактирования:")
        print(f"   {BLUE}{app_dir / 'static' / 'admin' / 'css' / 'color-config.css'}{RESET}\n")
        
        print(f"2. Измените цвета в блоке :root\n")
        
        print(f"3. Перезапустите Django сервер:")
        print(f"   {BLUE}docker-compose restart backend{RESET}")
        print(f"   или")
        print(f"   {BLUE}python manage.py runserver{RESET}\n")
        
        print(f"4. Обновите браузер: {BLUE}Ctrl+Shift+R{RESET}\n")
        
        print(f"{YELLOW}📚 Документация:{RESET}")
        print(f"   • Быстрая инструкция: {base_dir / 'QUICK_COLOR_CHANGE.md'}")
        print(f"   • Полная документация: {base_dir / 'ADMIN_COLORS.md'}\n")
        
        # Показываем текущие цвета
        color_config_path = app_dir / 'static' / 'admin' / 'css' / 'color-config.css'
        try:
            with open(color_config_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if '--main-color:' in content:
                    print(f"{YELLOW}🎨 Текущие цвета:{RESET}")
                    for line in content.split('\n'):
                        if '--main-color' in line or '--accent-color' in line or '--link-color' in line:
                            if not line.strip().startswith('/*'):
                                print(f"   {line.strip()}")
        except Exception as e:
            pass
        
    else:
        print(f"{RED}{'='*60}{RESET}")
        print(f"{RED}  ✗ Некоторые файлы не найдены!{RESET}")
        print(f"{RED}{'='*60}{RESET}\n")
        print(f"{YELLOW}Пожалуйста, проверьте структуру файлов.{RESET}\n")
    
    print()

if __name__ == '__main__':
    main()

