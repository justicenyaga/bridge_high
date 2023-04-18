from django.db import models
from students.models import Student
from teachers.models import Teacher
from base.models import Session, StudentClass, Term


class Register(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, blank=True, null=True)
    session = models.ForeignKey(
        Session, on_delete=models.CASCADE, blank=True, null=True)
    term = models.ForeignKey(
        Term, on_delete=models.CASCADE, blank=True, null=True)
    current_class = models.ForeignKey(
        StudentClass, on_delete=models.CASCADE, blank=True, null=True)
    signed_on = models.DateField(blank=True, null=True)
    isPresent = models.BooleanField(default=False, blank=True, null=True)
    signed_by = models.ForeignKey(
        Teacher, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.student.name + " -> " + str(self.signed_on.strftime("%d-%m-%Y"))
