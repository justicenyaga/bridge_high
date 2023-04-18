from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Admin
from .serializers import AdminSerializer


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAdmins(request):
    admins = Admin.objects.all()
    serializer = AdminSerializer(admins, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAdmin(request, pk):
    admin = Admin.objects.get(_id=pk)
    serializer = AdminSerializer(admin, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createAdmin(request):
    admin = Admin.objects.create(
        name="",
    )

    admin.save()

    return Response(AdminSerializer(admin, many=False).data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateAdmin(request, pk):
    data = request.data
    admin = Admin.objects.get(_id=pk)

    user = User.objects.get(id=admin.user.id)

    user.first_name = data['name']
    user.save()

    admin.name = data['name']
    admin.emailAddress = data['emailAddress']
    admin.dob = data['dob']
    admin.nationality = data['nationality']
    admin.nationalID = data['nationalID']
    admin.phoneNumber = data['phoneNumber']
    admin.emailAddress = data['emailAddress']
    admin.gender = data['gender']
    admin.address = data['address']
    admin.isActive = data['isActive']

    admin.save()

    return Response(AdminSerializer(admin, many=False).data)


@api_view(['POST'])
def uploadPassport(request):
    data = request.data

    admin_id = data['user_id']
    admin = Admin.objects.get(_id=admin_id)

    admin.passport = request.FILES.get('image')
    admin.save()

    return Response('Image was uploaded')


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteAdmin(request, pk):
    admin = Admin.objects.get(_id=pk)

    user = User.objects.get(id=admin.user.id)
    user.delete()

    admin.delete()

    return Response(AdminSerializer(admin, many=False).data)
