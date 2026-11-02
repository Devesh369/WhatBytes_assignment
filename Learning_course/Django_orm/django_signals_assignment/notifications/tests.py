from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import DeletedPost, Post, Tag


class SignalTests(TestCase):
    def test_slug_is_created_without_save_recursion(self):
        post = Post.objects.create(title="A Useful Signal", content="Text")
        self.assertEqual(post.slug, "a-useful-signal")

        post.title = "Changed Title"
        post.save()
        self.assertEqual(post.slug, "a-useful-signal")

    @patch("notifications.signals.send_welcome_email")
    def test_user_welcome_only_runs_on_create(self, send_welcome_email):
        user = get_user_model().objects.create_user(
            username="signal-user",
            email="user@example.com",
            password="password",
        )
        user.first_name = "Updated"
        user.save()
        send_welcome_email.assert_called_once_with("user@example.com")

    def test_delete_creates_backup(self):
        post = Post.objects.create(title="To Delete", content="Archive this")
        post_id = post.pk
        post.delete()

        backup = DeletedPost.objects.get(original_id=post_id)
        self.assertEqual(backup.title, "To Delete")

    @patch("notifications.signals.logger.info")
    def test_many_to_many_actions_are_logged(self, log):
        post = Post.objects.create(title="Tagged", content="Text")
        tag = Tag.objects.create(name="django")
        post.tags.add(tag)
        post.tags.remove(tag)

        actions = [call.args[2] for call in log.call_args_list]
        self.assertIn("pre_add", actions)
        self.assertIn("post_remove", actions)
