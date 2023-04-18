from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from .models import Register
from students.models import Student
from teachers.models import Teacher
from base.models import Session, Term, StudentClass
from .serializers import RegisterSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRegisters(request):
    registers = Register.objects.all()
    serializer = RegisterSerializer(registers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRegister(request, pk):
    register = Register.objects.get(_id=pk)
    serializer = RegisterSerializer(register, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRegistersByStudent(request, pk):
    registers = Register.objects.filter(student=pk)
    serializer = RegisterSerializer(registers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRegistersBySession(request, pk):
    registers = Register.objects.filter(session=pk)
    serializer = RegisterSerializer(registers, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createRegister(request):
    register = Register.objects.create()
    register.save()
    serializer = RegisterSerializer(register, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateRegister(request, pk):
    data = request.data

    register = Register.objects.get(_id=pk)
    register.student = Student.objects.get(_id=data['student'])
    register.session = Session.objects.get(_id=data['session'])
    register.term = Term.objects.get(_id=data['term'])
    register.studentClass = StudentClass.objects.get(_id=data['studentClass'])
    register.signed_on = data['signed_on']
    register.isPresent = data['isPresent']
    register.signed_by = Teacher.objects.get(_id=data['signed_by'])

    register.save()
    serializer = RegisterSerializer(register, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteRegister(request, pk):
    register = Register.objects.get(_id=pk)
    register.delete()
    return Response(RegisterSerializer(register, many=False).data)
