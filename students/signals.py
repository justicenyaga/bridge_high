from django.db.models.signals import post_save, pre_save
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from students.models import Student, SelectedSubjects


# signal to create a student user when a student  is created
def create_user(sender, instance, created, **kwargs):
    if created:
        password = instance.code
        password = str(password) + '@57u93n75'

        user = User.objects.create(
            username=instance.code,
            email=instance.code + '@students.bridgehigh.com',
            first_name=instance.name,
            password=make_password(password)
        )

        user.save()

        instance.user = user
        instance.save()


post_save.connect(create_user, sender=Student)


# signal to update student email which is the regNo appended with @student.bridgehigh.com
def student_email(sender, instance, created, **kwargs):
    if created:
        email = instance.code + '@students.bridgehigh.com'
        instance.schoolEmail = email
        instance.save()


post_save.connect(student_email, sender=Student)


# signal to update username
def update_user(sender, instance, **kwargs):
    user = instance

    if user.email != '':
        user.username = user.email


pre_save.connect(update_user, sender=User)


# signal to update student hasSelectedSubjects field
def update_hasSelectedSubjects(sender, instance, created, **kwargs):
    if created:
        student = instance.student
        student.hasSelectedSubjects = True
        student.save()


post_save.connect(update_hasSelectedSubjects, sender=SelectedSubjects)
