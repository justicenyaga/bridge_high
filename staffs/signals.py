from django.db.models.signals import post_save, pre_save
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import Admin


# signal to create a admin user when Admin is created
def user_creation(sender, instance, created, **kwargs):
    if created:
        password = instance.code
        password = str(password) + '@46m1n157r4t0r'

        user = User.objects.create(
            username=instance.code,
            email=instance.code + '@admin.bridgehigh.com',
            first_name=instance.name,
            is_staff=True,
            password=make_password(password)
        )
        user.save()

        instance.user = user
        instance.save()


post_save.connect(user_creation, sender=Admin)


# # signal to update admin's school email which is the admin code appended with @admin.bridgehigh.com
def admin_email(sender, instance, created, **kwargs):
    if created:
        email = instance.code + '@admin.bridgehigh.com'
        instance.schoolEmail = email
        instance.save()


post_save.connect(admin_email, sender=Admin)


# signal to update user's username to email
def update_user(sender, instance, **kwargs):
    user = instance

    if user.email != '':
        user.username = user.email


pre_save.connect(update_user, sender=User)
