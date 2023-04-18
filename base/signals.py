from django.db.models.signals import pre_save
from .models import Session, Term


# signal to update session
def update_session(sender, instance, **kwargs):
    session = instance

    if session.isCurrent:
        Session.objects.filter(isCurrent=True).update(isCurrent=False)


pre_save.connect(update_session, sender=Session)


# signal to update term
def update_term(sender, instance, **kwargs):
    term = instance

    if term.isCurrent:
        Term.objects.filter(isCurrent=True).update(isCurrent=False)


pre_save.connect(update_term, sender=Term)
