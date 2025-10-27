"""
Функции для работы с офферами из базы данных.
"""
from .models import Offer


def serialize_offer(offer):
    """Сериализация модели Offer в словарь для API"""
    return {
        'id': offer.id,
        'partner_name': offer.partner_name,
        'logo_url': offer.logo_url,
        'sum_min': offer.sum_min,
        'sum_max': offer.sum_max,
        'term_min': offer.term_min,
        'term_max': offer.term_max,
        'rate': offer.rate,
        'rate_text': offer.rate_text,
        'approval_time': offer.approval_time,
        'approval_probability': offer.approval_probability,
        'features': offer.features,
        'redirect_url': offer.redirect_url,
    }


def get_offers(sum_need=None, term_days=None, sort_by='rate', page=1, page_size=20):
    """
    Получить список офферов с фильтрацией и сортировкой из БД.
    """
    # Базовый queryset - только активные офферы
    queryset = Offer.objects.filter(is_active=True)
    
    # Фильтрация по сумме
    if sum_need:
        sum_need = int(sum_need)
        queryset = queryset.filter(sum_min__lte=sum_need, sum_max__gte=sum_need)
    
    # Фильтрация по сроку
    if term_days:
        term_days = int(term_days)
        queryset = queryset.filter(term_min__lte=term_days, term_max__gte=term_days)
    
    # Сортировка
    if sort_by == 'rate':
        queryset = queryset.order_by('rate', '-priority')
    elif sort_by == 'sum':
        queryset = queryset.order_by('-sum_max', '-priority')
    elif sort_by == 'term':
        queryset = queryset.order_by('-term_max', '-priority')
    else:
        # По умолчанию сортируем по приоритету
        queryset = queryset.order_by('-priority', 'rate')
    
    # Подсчёт общего количества
    total = queryset.count()
    
    # Пагинация
    start = (page - 1) * page_size
    end = start + page_size
    offers = queryset[start:end]
    
    return {
        'results': [serialize_offer(offer) for offer in offers],
        'count': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size if total > 0 else 0,
    }


def get_offer_by_id(offer_id):
    """Получить оффер по ID из БД"""
    try:
        offer = Offer.objects.get(id=offer_id, is_active=True)
        return serialize_offer(offer)
    except Offer.DoesNotExist:
        return None

