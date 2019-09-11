# Generated by Django 2.2.5 on 2019-09-11 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('summary', models.TextField(max_length=2500)),
                ('previous_name', models.CharField(max_length=100)),
                ('site_location', models.CharField(max_length=100)),
                ('postcode', models.CharField(max_length=10)),
                ('type_of_site', models.CharField(max_length=50)),
                ('date', models.CharField(max_length=30)),
                ('designer', models.CharField(max_length=50)),
                ('listed_structures', models.CharField(max_length=150)),
                ('borough', models.CharField(max_length=30)),
                ('site_ownership', models.CharField(max_length=50)),
                ('site_management', models.CharField(max_length=50)),
                ('open_to_public', models.CharField(max_length=10)),
                ('opening_times', models.CharField(max_length=30)),
                ('special_conditions', models.CharField(max_length=250)),
                ('facilities', models.CharField(max_length=250)),
                ('public_transportation', models.CharField(max_length=200)),
                ('lon_lat', models.FloatField()),
                ('lon', models.FloatField()),
                ('lat', models.FloatField()),
                ('grid_reference', models.CharField(max_length=30)),
                ('size_in_hectares', models.CharField(max_length=100)),
                ('image', models.CharField(max_length=250)),
                ('fuller_information', models.TextField(max_length=10000)),
                ('sources_consulted', models.TextField(max_length=1000)),
            ],
        ),
    ]
