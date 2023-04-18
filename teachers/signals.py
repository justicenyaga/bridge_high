from django.db.models.signals import post_save, pre_save
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from teachers.models import Teacher, ClassTeacher


# signal to create a teacher user when a teacher  is created
def user_creation(sender, instance, created, **kwargs):
    if created:
        password = instance.code
        password = str(password) + '@734ch3r5'

        user = User.objects.create(
            username=instance.code,
            email=instance.code + '@teachers.bridgehigh.com',
            first_name=instance.name,
            password=make_password(password)
        )
        user.save()

        instance.user = user
        instance.save()


post_save.connect(user_creation, sender=Teacher)


# signal to update teacher's school email which is the teacher code appended with @teachers.bridgehigh.com
def teacher_email(sender, instance, created, **kwargs):
    if created:
        email = instance.code + '@teachers.bridgehigh.com'
        instance.schoolEmail = email
        instance.save()


post_save.connect(teacher_email, sender=Teacher)


# signal to update username
def update_user(sender, instance, **kwargs):
    user = instance

    if user.email != '':
        user.username = user.email


pre_save.connect(update_user, sender=User)


# signal to update isClassTeacher field when a class teacher is created
def update_isClassTeacher(sender, instance, **kwargs):
    if instance.teacher:
        teacher = instance.teacher
        teacher.isClassTeacher = True
        teacher.save()


pre_save.connect(update_isClassTeacher, sender=ClassTeacher)
# post_save.connect(update_isClassTeacher, sender=ClassTeacher)
