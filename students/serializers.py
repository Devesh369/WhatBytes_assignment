from rest_framework import serializers
from .models import Department, Student


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name"]


class StudentSerializer(serializers.ModelSerializer):
    department_details = DepartmentSerializer(
        source="department",
        read_only=True,
    )

    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "email",
            "age",
            "department",
            "department_details",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "department_details"]

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Name must contain at least two characters."
            )
        return value.strip()

    def validate_age(self, value):
        if value < 5 or value > 100:
            raise serializers.ValidationError(
                "Age must be between 5 and 100."
            )
        return value

    def validate(self, attrs):
        email = attrs.get("email")

        if email and not email.endswith("@example.com"):
            raise serializers.ValidationError(
                {"email": "Email must use the @example.com domain."}
            )

        return attrs