# Generated migration for sort button colors

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_appconfig'),
    ]

    operations = [
        migrations.AddField(
            model_name='appconfig',
            name='sort_button_rate_color',
            field=models.CharField(default='#ac6d3a', max_length=7, verbose_name='Цвет кнопки "По ставке"'),
        ),
        migrations.AddField(
            model_name='appconfig',
            name='sort_button_sum_color',
            field=models.CharField(default='#d4a574', max_length=7, verbose_name='Цвет кнопки "По сумме"'),
        ),
        migrations.AddField(
            model_name='appconfig',
            name='sort_button_term_color',
            field=models.CharField(default='#8d5628', max_length=7, verbose_name='Цвет кнопки "По сроку"'),
        ),
    ]

