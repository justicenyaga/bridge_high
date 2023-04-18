from django.contrib import admin
from .models import Department, StudentClass, Stream, Session, Term, Subject, Exam, GradingSystem


admin.site.register(Department)
admin.site.register(StudentClass)
admin.site.register(Stream)
admin.site.register(Session)
admin.site.register(Term)
admin.site.register(Subject)
admin.site.register(Exam)
admin.site.register(GradingSystem)
