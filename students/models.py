from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField()
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="students",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name