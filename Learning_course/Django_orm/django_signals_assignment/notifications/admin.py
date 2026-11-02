from django.contrib import admin

from .models import DeletedPost, Post, Tag


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "created_at", "updated_at")
    filter_horizontal = ("tags",)
    search_fields = ("title", "slug")


@admin.register(DeletedPost)
class DeletedPostAdmin(admin.ModelAdmin):
    list_display = ("title", "original_id", "deleted_at")
    search_fields = ("title", "slug")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    search_fields = ("name",)
