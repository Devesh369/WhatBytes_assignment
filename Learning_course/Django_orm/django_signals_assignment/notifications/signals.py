import logging

from django.contrib.auth import get_user_model
from django.db.models.signals import m2m_changed, post_delete, post_save, pre_delete, pre_save
from django.dispatch import receiver
from django.utils.text import slugify
from django.utils.timezone import now

from .models import DeletedPost, Post

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=Post)
def create_post_slug(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = slugify(instance.title)


def send_welcome_email(user_email):
    print(f"Welcome notification sent to {user_email}")


@receiver(post_save, sender=get_user_model())
def notify_new_user(sender, instance, created, **kwargs):
    if created:
        send_welcome_email(instance.email)


@receiver(pre_delete, sender=Post)
def backup_deleted_post(sender, instance, **kwargs):
    DeletedPost.objects.create(
        title=instance.title,
        slug=instance.slug,
        content=instance.content,
        original_id=instance.pk,
        deleted_at=now(),
    )


@receiver(post_delete, sender=Post)
def log_post_deletion(sender, instance, **kwargs):
    logger.info("Post %s was deleted at %s", instance.pk, now())


def track_tag_changes(sender, instance, action, pk_set, **kwargs):
    if action in {"pre_add", "post_remove"}:
        logger.info(
            "Post %s tags action=%s pk_set=%s at %s",
            instance.pk,
            action,
            sorted(pk_set or set()),
            now(),
        )


m2m_changed.connect(track_tag_changes, sender=Post.tags.through)
