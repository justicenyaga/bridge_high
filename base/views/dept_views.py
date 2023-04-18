from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from base.models import Department
from base.serializers import DepartmentSerializer


@api_view(['GET'])
def getDepartments(request):
    departments = Department.objects.all()
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getDepartment(request, pk):
    department = Department.objects.get(_id=pk)
    serializer = DepartmentSerializer(department, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createDepartment(request):
    dept = Department.objects.create(
        name="",
    )
    return Response(DepartmentSerializer(dept, many=False).data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateDepartment(request, pk):
    data = request.data
    dept = Department.objects.get(_id=pk)

    dept.name = data['name']
    dept.save()

    return Response(DepartmentSerializer(dept, many=False).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteDepartment(request, pk):
    dept = Department.objects.get(_id=pk)
    dept.delete()
    return Response(DepartmentSerializer(dept, many=False).data)
