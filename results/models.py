from django.db import models
from students.models import Student
from base.models import Session, Term, StudentClass, Subject, Exam
from teachers.models import Teacher


class Result(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, null=True, blank=True)
    session = models.ForeignKey(
        Session, on_delete=models.CASCADE, null=True, blank=True)
    term = models.ForeignKey(
        Term, on_delete=models.CASCADE, null=True, blank=True)
    currentClass = models.ForeignKey(
        StudentClass, on_delete=models.CASCADE, null=True, blank=True)
    exam = models.ForeignKey(
        Exam, on_delete=models.CASCADE, null=True, blank=True)
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    date_created = models.DateTimeField(
        auto_now_add=True, null=True, blank=True)
    date_modified = models.DateTimeField(auto_now=True, null=True, blank=True)
    createdBy = models.ForeignKey(
        Teacher, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.student.name + ', ' + self.subject.name + ' - ' + self.session.name + ' - Term ' + self.term.name
