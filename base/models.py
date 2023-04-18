from django.db import models


class Department(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name


class Stream(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name


class StudentClass(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50, null=True, blank=True)
    stream = models.ForeignKey(
        Stream, on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name_plural = "Student Classes"

    def __str__(self):
        return self.name + " - " + self.stream.name


class Session(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50, null=True, blank=True)
    isCurrent = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return self.name


class Term(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50, null=True, blank=True)
    isCurrent = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return self.name


class Subject(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50, null=True, blank=True)
    abbr = models.CharField(max_length=10, null=True, blank=True)
    dept = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True
    )
    isCompulsory = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return self.name


class Exam(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name


class GradingSystem(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    session = models.ForeignKey(
        Session, on_delete=models.SET_NULL, null=True, blank=True
    )
    A = models.IntegerField(null=True, blank=True)
    A_minus = models.IntegerField(null=True, blank=True)
    B_plus = models.IntegerField(null=True, blank=True)
    B = models.IntegerField(null=True, blank=True)
    B_minus = models.IntegerField(null=True, blank=True)
    C_plus = models.IntegerField(null=True, blank=True)
    C = models.IntegerField(null=True, blank=True)
    C_minus = models.IntegerField(null=True, blank=True)
    D_plus = models.IntegerField(null=True, blank=True)
    D = models.IntegerField(null=True, blank=True)
    D_minus = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.session.name
