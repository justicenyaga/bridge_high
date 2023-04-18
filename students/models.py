from django.db import models
from django.contrib.auth.models import User
from base.models import StudentClass, Subject, Session


class Student(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)

    @property
    def code(self):
        id = str(self._id)

        if len(id) < 4:
            id = id.zfill(4)

        return id

    name = models.CharField(max_length=50, null=True, blank=True)
    currentClass = models.ForeignKey(
        StudentClass, on_delete=models.SET_NULL, null=True, blank=True)
    schoolEmail = models.EmailField(null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    passport = models.ImageField(null=True, blank=True)
    guardianName = models.CharField(max_length=50, null=True, blank=True)
    guardianNationalId = models.CharField(
        max_length=200, null=True, blank=True)
    guardianPhoneNumber = models.CharField(
        max_length=200, null=True, blank=True)
    guardianEmailAddress = models.EmailField(null=True, blank=True)
    doa = models.DateField(auto_now_add=True, null=True, blank=True)
    feeBilled = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    feePaid = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    isActive = models.BooleanField(default=True, null=True, blank=True)
    isGraduated = models.BooleanField(default=False, null=True, blank=True)
    graduatedAt = models.ForeignKey(
        Session, on_delete=models.SET_NULL, null=True, blank=True, related_name='graduatedAt')
    hasSelectedSubjects = models.BooleanField(
        default=False, null=True, blank=True)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name


class SelectedT4(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    student = models.OneToOneField(
        Student, on_delete=models.CASCADE, null=True, blank=True)
    t4 = models.ForeignKey(Subject, on_delete=models.SET_NULL, limit_choices_to={
                           'dept__name': 'Technicals'}, null=True, blank=True)

    def __str__(self):
        return self.student.name + " - " + self.t4.name


class SelectedSubjects(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    student = models.OneToOneField(
        Student, on_delete=models.CASCADE, blank=True, null=True)

    t8 = models.ForeignKey(Subject, blank=True, null=True, on_delete=models.CASCADE,
                           limit_choices_to={'dept__name': 'Technicals'})
    s5 = models.ManyToManyField(Subject, related_name='s5', limit_choices_to={
                                'dept__name': 'Sciences', 'name__in': ['Biology', 'Physics']}, blank=True)
    h7 = models.ManyToManyField(Subject, related_name='h7', limit_choices_to={
                                'dept__name': 'Humanities'}, blank=True)

    class Meta:
        verbose_name_plural = "Selected Subjects"

    def __str__(self):
        return self.student.name
