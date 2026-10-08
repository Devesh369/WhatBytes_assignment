from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
    
        fields = "__all__"
        read_only_fields = ("created_by",)
        
    def validate_age(self,value):
        if value > 120:
            raise serializers.ValidationError("Age cannot be greater than 120.")
        return value
