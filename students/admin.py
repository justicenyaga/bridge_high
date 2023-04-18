from django.contrib import admin
from .models import Student, SelectedT4, SelectedSubjects

# Register your models here.
admin.site.register(Student)
admin.site.register(SelectedT4)
admin.site.register(SelectedSubjects)
