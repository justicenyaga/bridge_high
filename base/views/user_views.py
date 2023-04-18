from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from base.serializers import UserSerializer, UserSerializerWithToken

from students.models import Student
from teachers.models import Teacher
from staffs.models import Admin

from students.serializers import StudentSerializer
from teachers.serializers import TeacherSerializer
from staffs.serializers import AdminSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )

        serializer = UserSerializerWithToken(user, many=False)

        return Response(serializer.data)
    except:
        message = {'detail': 'User with that email already exists'}

        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data

    serializer = UserSerializerWithToken(user, many=False)

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != "":
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userToDelete = User.objects.get(id=pk)
    userToDelete.delete()

    serializer = UserSerializer(userToDelete, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


# update reset user password - check if current password is correct
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def resetPassword(request):
    user = request.user
    data = request.data

    if user.check_password(data['current_password']):
        user.password = make_password(data['new_password'])
        user.save()

        return Response({'detail': 'Password updated successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['is_admin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserDetails(request, pk):
    user = User.objects.get(id=pk)

    userRole = user.email.split('@')[1].split('.')[0]

    if userRole == 'teachers':
        teacher = Teacher.objects.get(user=user)
        serializer = TeacherSerializer(teacher, many=False)
        return Response(serializer.data)
    elif userRole == 'students':
        student = Student.objects.get(user=user)
        serializer = StudentSerializer(student, many=False)
        return Response(serializer.data)
    elif userRole == 'admin':
        admin = Admin.objects.get(user=user)
        serializer = AdminSerializer(admin, many=False)
        return Response(serializer.data)
