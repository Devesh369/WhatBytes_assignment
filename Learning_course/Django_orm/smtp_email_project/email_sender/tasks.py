import logging
from email.utils import parseaddr

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def _validate_recipients(recipients):
    valid = []
    for recipient in recipients:
        address = parseaddr(recipient)[1]
        if not address or "@" not in address or address.startswith("@"):
            raise ValueError(f"Invalid recipient email: {recipient}")
        valid.append(address)
    return valid


@shared_task(
    bind=True,
    autoretry_for=(OSError, ConnectionError),
    retry_backoff=True,
    max_retries=3,
)
def send_email_task(self, recipient_email, subject, message, html_message=None):
    recipient = _validate_recipients([recipient_email])[0]
    email = EmailMultiAlternatives(
        subject=subject,
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
    )
    if html_message:
        email.attach_alternative(html_message, "text/html")

    try:
        sent = email.send(fail_silently=False)
    except Exception:
        logger.exception("Email delivery failed for %s", recipient)
        raise

    logger.info("Email delivered to %s", recipient)
    return {"status": "sent", "count": sent, "recipient": recipient}


@shared_task(
    bind=True,
    autoretry_for=(OSError, ConnectionError),
    retry_backoff=True,
    max_retries=3,
)
def send_bulk_email_task(self, recipient_list, subject, message, html_message=None):
    recipients = _validate_recipients(recipient_list)
    email = EmailMultiAlternatives(
        subject=subject,
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        bcc=recipients,
    )
    if html_message:
        email.attach_alternative(html_message, "text/html")

    try:
        sent = email.send(fail_silently=False)
    except Exception:
        logger.exception("Bulk email delivery failed for %d recipients", len(recipients))
        raise

    logger.info("Bulk email delivered to %d recipients", len(recipients))
    return {"status": "sent", "count": sent, "recipients": len(recipients)}


@shared_task(bind=True, autoretry_for=(OSError, ConnectionError), retry_backoff=True)
def send_template_email_task(
    self, recipient_email, subject, template_name, context=None, attachments=None
):
    recipient = _validate_recipients([recipient_email])[0]
    context = context or {}
    html_message = render_to_string(f"email_sender/{template_name}.html", context)
    email = EmailMessage(
        subject=subject,
        body=html_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
    )
    email.content_subtype = "html"

    for attachment in attachments or []:
        email.attach(
            attachment["filename"],
            attachment["content"],
            attachment.get("mimetype", "application/octet-stream"),
        )

    try:
        sent = email.send(fail_silently=False)
    except Exception:
        logger.exception("Template email delivery failed for %s", recipient)
        raise

    logger.info("Template email delivered to %s", recipient)
    return {"status": "sent", "count": sent, "recipient": recipient}

