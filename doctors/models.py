from django.db import models
from django.conf import settings
# Create your models here.

class Doctor (models.Model):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="doctors")
    name = models.CharField(max_length=50, blank=False)
    specialization = models.CharField(max_length=70, blank=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["name"]
        
    def __str__(self):
        return f"{self.name}"
    