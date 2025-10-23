"""
Скрипт для загрузки тестовых офферов в базу данных.
Запуск: python manage.py shell < load_test_offers.py
или: docker-compose exec backend python manage.py shell < load_test_offers.py
"""

from app.models import Offer

# Удаляем все существующие офферы (опционально)
# Offer.objects.all().delete()

# Создаём тестовые офферы
test_offers = [
    {
        'partner_name': 'БыстроДеньги',
        'logo_url': 'https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=БД',
        'sum_min': 1000,
        'sum_max': 30000,
        'term_min': 7,
        'term_max': 30,
        'rate': 0.5,
        'rate_text': '0.5% в день',
        'approval_time': '15 минут',
        'approval_probability': 'высокая',
        'features': ['Без отказа', 'Первый займ 0%', 'Онлайн'],
        'redirect_url': 'https://example.com/partner1?sub_id={sub_id}',
        'is_active': True,
        'priority': 10,
    },
    {
        'partner_name': 'МигКредит',
        'logo_url': 'https://via.placeholder.com/80x80/4A90E2/FFFFFF?text=МК',
        'sum_min': 5000,
        'sum_max': 100000,
        'term_min': 10,
        'term_max': 365,
        'rate': 1.0,
        'rate_text': '1% в день',
        'approval_time': '30 минут',
        'approval_probability': 'средняя',
        'features': ['До 100 000₽', 'На карту', 'Без справок'],
        'redirect_url': 'https://example.com/partner2?sub_id={sub_id}',
        'is_active': True,
        'priority': 8,
    },
    {
        'partner_name': 'ДеньгиСразу',
        'logo_url': 'https://via.placeholder.com/80x80/50C878/FFFFFF?text=ДС',
        'sum_min': 2000,
        'sum_max': 50000,
        'term_min': 5,
        'term_max': 60,
        'rate': 0.8,
        'rate_text': '0.8% в день',
        'approval_time': '10 минут',
        'approval_probability': 'высокая',
        'features': ['Моментально', '0% переплата', 'Без проверок'],
        'redirect_url': 'https://example.com/partner3?sub_id={sub_id}',
        'is_active': True,
        'priority': 9,
    },
    {
        'partner_name': 'ЛайтМани',
        'logo_url': 'https://via.placeholder.com/80x80/FFB800/FFFFFF?text=ЛМ',
        'sum_min': 3000,
        'sum_max': 70000,
        'term_min': 14,
        'term_max': 180,
        'rate': 1.2,
        'rate_text': '1.2% в день',
        'approval_time': '20 минут',
        'approval_probability': 'средняя',
        'features': ['Любая КИ', 'На карту/счёт', 'Онлайн'],
        'redirect_url': 'https://example.com/partner4?sub_id={sub_id}',
        'is_active': True,
        'priority': 7,
    },
    {
        'partner_name': 'ВебЗайм',
        'logo_url': 'https://via.placeholder.com/80x80/E63946/FFFFFF?text=ВЗ',
        'sum_min': 1000,
        'sum_max': 40000,
        'term_min': 7,
        'term_max': 90,
        'rate': 0.6,
        'rate_text': '0.6% в день',
        'approval_time': '25 минут',
        'approval_probability': 'высокая',
        'features': ['Для всех', 'Быстро', 'Удобно'],
        'redirect_url': 'https://example.com/partner5?sub_id={sub_id}',
        'is_active': True,
        'priority': 6,
    },
]

created_count = 0
for offer_data in test_offers:
    offer, created = Offer.objects.get_or_create(
        partner_name=offer_data['partner_name'],
        defaults=offer_data
    )
    if created:
        created_count += 1
        print(f"✅ Создан оффер: {offer.partner_name}")
    else:
        print(f"⏭️  Уже существует: {offer.partner_name}")

print(f"\n🎉 Готово! Создано {created_count} новых офферов из {len(test_offers)}")
print(f"📊 Всего офферов в базе: {Offer.objects.count()}")

