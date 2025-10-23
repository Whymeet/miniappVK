"""
Моковые данные офферов.
В продакшене должны загружаться из БД или внешнего API.
"""

MOCK_OFFERS = [
    {
        'id': 'offer_1',
        'partner_name': 'БыстроДеньги',
        'logo_url': 'https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=БД',
        'sum_min': 1000,
        'sum_max': 30000,
        'term_min': 7,
        'term_max': 30,
        'rate': 0.5,  # % в день
        'rate_text': '0.5% в день',
        'approval_time': '15 минут',
        'approval_probability': 'высокая',
        'features': ['Без отказа', 'Первый займ 0%', 'Онлайн'],
        'redirect_url': 'https://example.com/partner1?sub_id={sub_id}',
    },
    {
        'id': 'offer_2',
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
    },
    {
        'id': 'offer_3',
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
    },
    {
        'id': 'offer_4',
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
    },
    {
        'id': 'offer_5',
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
    },
]


def get_offers(sum_need=None, term_days=None, sort_by='rate', page=1, page_size=20):
    """
    Получить список офферов с фильтрацией и сортировкой.
    """
    offers = MOCK_OFFERS.copy()
    
    # Фильтрация по сумме
    if sum_need:
        sum_need = int(sum_need)
        offers = [o for o in offers if o['sum_min'] <= sum_need <= o['sum_max']]
    
    # Фильтрация по сроку
    if term_days:
        term_days = int(term_days)
        offers = [o for o in offers if o['term_min'] <= term_days <= o['term_max']]
    
    # Сортировка
    if sort_by == 'rate':
        offers.sort(key=lambda x: x['rate'])
    elif sort_by == 'sum':
        offers.sort(key=lambda x: x['sum_max'], reverse=True)
    elif sort_by == 'term':
        offers.sort(key=lambda x: x['term_max'], reverse=True)
    
    # Пагинация
    total = len(offers)
    start = (page - 1) * page_size
    end = start + page_size
    
    return {
        'results': offers[start:end],
        'count': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size,
    }


def get_offer_by_id(offer_id):
    """Получить оффер по ID"""
    for offer in MOCK_OFFERS:
        if offer['id'] == offer_id:
            return offer
    return None

