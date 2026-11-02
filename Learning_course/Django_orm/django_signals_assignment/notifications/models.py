from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    content = models.TextField()
    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class DeletedPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220)
    content = models.TextField()
    original_id = models.PositiveBigIntegerField()
    deleted_at = models.DateTimeField()

    def __str__(self):
        return f"{self.title} ({self.original_id})"

