# Generated by Django 4.1.7 on 2023-04-18 10:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("base", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Student",
            fields=[
                (
                    "_id",
                    models.AutoField(editable=False, primary_key=True, serialize=False),
                ),
                ("name", models.CharField(blank=True, max_length=50, null=True)),
                (
                    "schoolEmail",
                    models.EmailField(blank=True, max_length=254, null=True),
                ),
                ("dob", models.DateField(blank=True, null=True)),
                ("passport", models.ImageField(blank=True, null=True, upload_to="")),
                (
                    "guardianName",
                    models.CharField(blank=True, max_length=50, null=True),
                ),
                (
                    "guardianNationalId",
                    models.CharField(blank=True, max_length=200, null=True),
                ),
                (
                    "guardianPhoneNumber",
                    models.CharField(blank=True, max_length=200, null=True),
                ),
                (
                    "guardianEmailAddress",
                    models.EmailField(blank=True, max_length=254, null=True),
                ),
                ("doa", models.DateField(auto_now_add=True, null=True)),
                (
                    "feeBilled",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=10, null=True
                    ),
                ),
                (
                    "feePaid",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=10, null=True
                    ),
                ),
                ("isActive", models.BooleanField(blank=True, default=True, null=True)),
                (
                    "isGraduated",
                    models.BooleanField(blank=True, default=False, null=True),
                ),
                (
                    "hasSelectedSubjects",
                    models.BooleanField(blank=True, default=False, null=True),
                ),
                (
                    "currentClass",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="base.studentclass",
                    ),
                ),
                (
                    "graduatedAt",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="graduatedAt",
                        to="base.session",
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SelectedT4",
            fields=[
                (
                    "_id",
                    models.AutoField(editable=False, primary_key=True, serialize=False),
                ),
                (
                    "student",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="students.student",
                    ),
                ),
                (
                    "t4",
                    models.ForeignKey(
                        blank=True,
                        limit_choices_to={"dept__name": "Technicals"},
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="base.subject",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SelectedSubjects",
            fields=[
                (
                    "_id",
                    models.AutoField(editable=False, primary_key=True, serialize=False),
                ),
                (
                    "h7",
                    models.ManyToManyField(
                        blank=True,
                        limit_choices_to={"dept__name": "Humanities"},
                        related_name="h7",
                        to="base.subject",
                    ),
                ),
                (
                    "s5",
                    models.ManyToManyField(
                        blank=True,
                        limit_choices_to={
                            "dept__name": "Sciences",
                            "name__in": ["Biology", "Physics"],
                        },
                        related_name="s5",
                        to="base.subject",
                    ),
                ),
                (
                    "student",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="students.student",
                    ),
                ),
                (
                    "t8",
                    models.ForeignKey(
                        blank=True,
                        limit_choices_to={"dept__name": "Technicals"},
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="base.subject",
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Selected Subjects",
            },
        ),
    ]
