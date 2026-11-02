from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import connection, reset_queries
from django.utils.timezone import now

from notifications.models import DeletedPost, Post, Tag


class Command(BaseCommand):
    def show_queries(self, label):
        self.stdout.write(f"{label}: {len(connection.queries)} SQL queries")
        for query in connection.queries:
            self.stdout.write(f"  {query['sql']}")
        reset_queries()

    def handle(self, *args, **options):
        reset_queries()
        tag = Tag.objects.create(name=f"signals-{now().timestamp()}")
        post = Post.objects.create(title="Signal Driven Post", content="Demo content")
        self.stdout.write(f"Created post slug: {post.slug}")
        self.show_queries("Post creation")

        post.title = "Updated Signal Driven Post"
        post.save()
        self.stdout.write(f"Updated post slug remains: {post.slug}")
        self.show_queries("Post update")

        user = get_user_model().objects.create_user(
            username=f"signal-user-{now().timestamp()}",
            email="signals@example.com",
            password="not-used",
        )
        self.stdout.write(f"Created user: {user.email}")
        self.show_queries("User creation")

        post.tags.add(tag)
        self.show_queries("Tag add")
        post.tags.remove(tag)
        self.show_queries("Tag remove")

        post_id = post.pk
        post.delete()
        self.stdout.write(
            f"Deleted post {post_id}; backups: {DeletedPost.objects.filter(original_id=post_id).count()}"
        )
        self.show_queries("Post deletion")
