from django.shortcuts import render
from rest_framework import viewsets
from .models import Doctor
from .permissions import IsCreatorOrReadOnly
from .serializers import DoctorSerializer
# Create your views here.


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsCreatorOrReadOnly]

    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)