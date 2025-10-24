# Generated migration for BrandConfig model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_offer_alter_clicklog_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='BrandConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('brand_key', models.CharField(help_text='Например: kokos, kubyshka', max_length=50, unique=True, verbose_name='Ключ бренда')),
                ('name', models.CharField(max_length=200, verbose_name='Название бренда')),
                ('logo_url', models.URLField(max_length=500, verbose_name='URL логотипа')),
                ('color_primary', models.CharField(default='#FF6B35', help_text='Hex формат: #FF6B35', max_length=7, verbose_name='Основной цвет')),
                ('color_secondary', models.CharField(default='#FFB800', max_length=7, verbose_name='Вторичный цвет')),
                ('color_background', models.CharField(default='#FFFFFF', max_length=7, verbose_name='Цвет фона')),
                ('color_surface', models.CharField(default='#F5F5F5', max_length=7, verbose_name='Цвет поверхности')),
                ('color_text', models.CharField(default='#000000', max_length=7, verbose_name='Цвет текста')),
                ('color_text_secondary', models.CharField(default='#666666', max_length=7, verbose_name='Цвет вторичного текста')),
                ('color_accent', models.CharField(default='#FF6B35', max_length=7, verbose_name='Акцентный цвет')),
                ('color_error', models.CharField(default='#E63946', max_length=7, verbose_name='Цвет ошибки')),
                ('color_success', models.CharField(default='#06D6A0', max_length=7, verbose_name='Цвет успеха')),
                ('subtitle', models.CharField(default='Быстрые займы онлайн', max_length=200, verbose_name='Подзаголовок')),
                ('cta_text', models.CharField(default='Получить деньги', max_length=100, verbose_name='Текст кнопки CTA')),
                ('disclaimer', models.TextField(default='Сервис не является кредитором.', verbose_name='Дисклеймер')),
                ('default_sort', models.CharField(choices=[('rate', 'По ставке'), ('sum', 'По сумме'), ('term', 'По сроку')], default='rate', max_length=10, verbose_name='Сортировка по умолчанию')),
                ('show_filters', models.BooleanField(default=True, verbose_name='Показывать фильтры')),
                ('show_disclaimer', models.BooleanField(default=True, verbose_name='Показывать дисклеймер')),
                ('enable_messages', models.BooleanField(default=True, verbose_name='Включить уведомления')),
                ('is_active', models.BooleanField(default=True, verbose_name='Активен')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Обновлён')),
            ],
            options={
                'verbose_name': 'Конфигурация бренда',
                'verbose_name_plural': 'Конфигурации брендов',
                'db_table': 'brand_configs',
                'ordering': ['brand_key'],
            },
        ),
    ]

