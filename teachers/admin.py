from django.contrib import admin
from .models import Teacher, ClassTeacher, SubjectAllotment, SubjectClassAllotment


admin.site.register(Teacher)
admin.site.register(ClassTeacher)
admin.site.register(SubjectAllotment)
admin.site.register(SubjectClassAllotment)
