from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Department, Student
from .serializers import DepartmentSerializer, StudentSerializer


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def student_list(request):
    if request.method == "GET":
        students = Student.objects.select_related("department")
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    serializer = StudentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([AllowAny])
def student_detail(request, pk):
    try:
        student = Student.objects.select_related("department").get(pk=pk)
    except Student.DoesNotExist:
        return Response(
            {"detail": "Student not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        return Response(StudentSerializer(student).data)

    if request.method in ["PUT", "PATCH"]:
        serializer = StudentSerializer(
            student,
            data=request.data,
            partial=request.method == "PATCH",
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    student.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class StudentAPIView(generics.ListCreateAPIView):
    queryset = Student.objects.select_related("department")
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]


class StudentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.select_related("department")
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]