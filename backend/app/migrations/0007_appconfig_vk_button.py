# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_appconfig_gradient'),
    ]

    operations = [
        migrations.AddField(
            model_name='appconfig',
            name='vk_group_url',
            field=models.URLField(blank=True, help_text='Например: https://vk.com/kubyshkazaim', max_length=500, verbose_name='Ссылка на группу ВК'),
        ),
        migrations.AddField(
            model_name='appconfig',
            name='vk_button_color',
            field=models.CharField(default='#0077FF', max_length=7, verbose_name='Цвет кнопки "МЫ В ВК"'),
        ),
    ]

