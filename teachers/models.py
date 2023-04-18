from django.db import models
from django.contrib.auth.models import User
from base.models import StudentClass, Department, Subject, Session


class Teacher(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)

    @property
    def code(self):
        id = str(self._id)

        if len(id) < 4:
            id = id.zfill(4)

        return id

    name = models.CharField(max_length=50, null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    nationality = models.CharField(
        max_length=200, null=True, blank=True)
    nationalID = models.CharField(
        max_length=200, null=True, blank=True)
    phoneNumber = models.CharField(
        max_length=200, null=True, blank=True)
    emailAddress = models.EmailField(null=True, blank=True)
    gender = models.CharField(max_length=200, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    doa = models.DateField(auto_now_add=True, null=True, blank=True)
    schoolEmail = models.EmailField(null=True, blank=True)
    dept = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True)
    isActive = models.BooleanField(default=True, null=True, blank=True)
    passport = models.ImageField(null=True, blank=True)
    isClassTeacher = models.BooleanField(default=False, null=True, blank=True)
    user = models.OneToOneField(
        User, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class ClassTeacher(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    teacher = models.ForeignKey(
        Teacher, on_delete=models.SET_NULL, null=True, blank=True)
    alloted_class = models.ForeignKey(
        StudentClass, on_delete=models.SET_NULL, null=True, blank=True)
    session = models.ForeignKey(
        Session, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True, null=True, blank=True)

    def __str__(self):
        return self.alloted_class.name + " " + self.alloted_class.stream.name + " -> " + self.teacher.name


class SubjectAllotment(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    teacher = models.ForeignKey(
        Teacher, on_delete=models.SET_NULL, null=True, blank=True)
    subject = models.ForeignKey(
        Subject, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.teacher.name + " -> " + self.subject.name


class SubjectClassAllotment(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    subject = models.ForeignKey(
        Subject, on_delete=models.SET_NULL, null=True, blank=True)
    class_name = models.ForeignKey(
        StudentClass, on_delete=models.SET_NULL, null=True, blank=True)
    teacher = models.ForeignKey(
        Teacher, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.class_name.name + " " + self.class_name.stream.name + " -> " + self.subject.name + " -> " + self.teacher.name
