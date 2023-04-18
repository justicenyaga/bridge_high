from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Teacher, ClassTeacher, SubjectAllotment
from base.models import Department, StudentClass, Session
from .serializers import TeacherSerializer, ClassTeacherSerializer, SubjectAllotmentSerializer


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getTeachers(request):
    teachers = Teacher.objects.all()
    serializer = TeacherSerializer(teachers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTeacher(request, pk):
    teacher = Teacher.objects.get(_id=pk)
    serializer = TeacherSerializer(teacher, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createTeacher(request):
    teacher = Teacher.objects.create(
        name='',
        dept=None,
    )

    teacher.save()

    serializer = TeacherSerializer(teacher, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateTeacher(request, pk):
    data = request.data
    teacher = Teacher.objects.get(_id=pk)

    user = User.objects.get(id=teacher.user.id)
    dept = Department.objects.get(name=data['dept'])

    user.first_name = data['name']
    user.save()

    teacher.name = data['name']
    teacher.dob = data['dob']
    teacher.nationality = data['nationality']
    teacher.nationalID = data['nationalID']
    teacher.phoneNumber = data['phoneNumber']
    teacher.emailAddress = data['emailAddress']
    teacher.gender = data['gender']
    teacher.address = data['address']
    teacher.dept = dept
    teacher.isActive = data['isActive']
    teacher.doa = data['doa']

    teacher.save()

    return Response(TeacherSerializer(teacher, many=False).data)


@api_view(['POST'])
def uploadPassport(request):
    data = request.data

    teacher_id = data['user_id']
    teacher = Teacher.objects.get(_id=teacher_id)

    teacher.passport = request.FILES.get('image')
    teacher.save()

    return Response('Image was uploaded')


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteTeacher(request, pk):
    teacher = Teacher.objects.get(_id=pk)
    user = User.objects.get(id=teacher.user.id)
    user.delete()

    teacher.delete()

    return Response(TeacherSerializer(teacher, many=False).data)


@api_view(['GET'])
def getClassTeachers(request):
    classTeachers = ClassTeacher.objects.all()
    serializer = ClassTeacherSerializer(classTeachers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getClassTeacher(request, pk):
    classTeacher = ClassTeacher.objects.get(_id=pk)
    serializer = ClassTeacherSerializer(classTeacher, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getClassTeacherByTeacherId(request, pk):
    teacher = Teacher.objects.get(_id=pk)
    classTeacher = ClassTeacher.objects.get(teacher=teacher, is_active=True)
    serializer = ClassTeacherSerializer(classTeacher, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createClassTeacher(request):
    classTeacher = ClassTeacher.objects.create(
        teacher=None,
        alloted_class=None,
        session=None,
    )
    classTeacher.save()

    serializer = ClassTeacherSerializer(classTeacher, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateClassTeacher(request, pk):
    data = request.data

    teacher = Teacher.objects.get(_id=data['teacher'])
    alloted_class = StudentClass.objects.get(_id=data['alloted_class'])
    session = Session.objects.get(_id=data['session'])

    classTeacher = ClassTeacher.objects.get(_id=pk)

    classTeacher.teacher = teacher
    classTeacher.alloted_class = alloted_class
    classTeacher.is_active = data['is_active']
    classTeacher.session = session

    classTeacher.save()

    return Response(ClassTeacherSerializer(classTeacher, many=False).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteClassTeacher(request, pk):
    classTeacher = ClassTeacher.objects.get(_id=pk)
    classTeacher.delete()

    return Response(ClassTeacherSerializer(classTeacher, many=False).data)


@api_view(['GET'])
def getSubjectsAssignedToTeacher(request, pk):
    teacher = Teacher.objects.get(_id=pk)
    subjectAllotments = SubjectAllotment.objects.filter(teacher=teacher)
    serializer = SubjectAllotmentSerializer(subjectAllotments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def assignSubjectToTeacher(request):
    pass
