from django.db import models
from django.contrib.auth.models import User


class Admin(models.Model):
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
    isActive = models.BooleanField(default=True, null=True, blank=True)
    passport = models.ImageField(null=True, blank=True)
    user = models.OneToOneField(
        User, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
