from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from .models import Student, SelectedT4, SelectedSubjects
from base.models import Subject, StudentClass, Stream
from .serializers import StudentSerializer, SelectedSubjectsSerializer, SelectedT4Serializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getStudents(request):
    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getStudent(request, pk):
    student = Student.objects.get(_id=pk)
    serializer = StudentSerializer(student, many=False)
    return Response(serializer.data)


# update student
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateStudent(request, pk):
    student = Student.objects.get(_id=pk)
    data = request.data
    user = User.objects.get(id=student.user.id)

    user.first_name = data['name']
    user.save()

    stream = data['currentClass']['stream']
    s_class = data['currentClass']['name']
    currentClass = StudentClass.objects.get(
        stream=Stream.objects.get(name=stream), name=s_class)

    student.user = user
    student.name = data['name']
    student.currentClass = currentClass
    student.guardianName = data['guardianName']
    student.guardianNationalId = data['guardianNationalId']
    student.guardianPhoneNumber = data['guardianPhoneNumber']
    student.guardianEmailAddress = data['guardianEmailAddress']
    student.isActive = data['isActive']
    student.dob = data['dob']
    student.doa = data['doa']

    student.save()

    serializer = StudentSerializer(student, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def uploadPassport(request):
    data = request.data

    student_id = data['user_id']
    student = Student.objects.get(_id=student_id)

    student.passport = request.FILES.get('image')
    student.save()

    return Response('Image was uploaded')


# create student
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createStudent(request):
    student = Student.objects.create(
        name='',
        guardianName='',
        guardianNationalId='',
        guardianPhoneNumber='',
        guardianEmailAddress='',
    )

    student.save()

    serializer = StudentSerializer(student, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteStudent(request, pk):
    student = Student.objects.get(_id=pk)
    student.delete()
    user = User.objects.get(id=student.user.id)
    user.delete()
    return Response(StudentSerializer(student, many=False).data)


@api_view(['GET'])
def getSelectedT4(request, pk):
    student = Student.objects.get(_id=pk)
    selected_t4 = SelectedT4.objects.get(student=student)
    serializer = SelectedT4Serializer(selected_t4, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getSelectedT4Class(request, pk):
    s_class = StudentClass.objects.get(_id=pk)
    students = Student.objects.filter(currentClass=s_class)
    selected_t4 = []

    for student in students:
        try:
            selected_t4.append(SelectedT4.objects.get(student=student._id))
        except:
            selected_t4.append(None)

    serializer = SelectedT4Serializer(selected_t4, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getAllStudentsSelectedT4(request):
    selected_t4 = []

    students = Student.objects.all()

    for student in students:
        try:
            selected_t4.append(SelectedT4.objects.get(student=student._id))
        except:
            selected_t4.append(None)

    serializer = SelectedT4Serializer(selected_t4, many=True)
    return Response(serializer.data)


#  View to select t4
@api_view(['POST'])
def selectT4(request, pk):
    student = Student.objects.get(_id=pk)
    selectedT4 = request.data['selected_t4']

    if SelectedT4.objects.filter(student=student).exists():
        selected_t4 = SelectedT4.objects.get(student=student)
        selected_t4.t4 = Subject.objects.get(_id=selectedT4)
        selected_t4.save()
    else:
        selected_t4 = SelectedT4.objects.create(student=student)
        selected_t4.t4 = Subject.objects.get(_id=selectedT4)
        selected_t4.save()

    return Response({'detail': 'T4 Selected Successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getSelectedSubjects(request, pk):
    student = Student.objects.get(_id=pk)
    selected_subjects = SelectedSubjects.objects.get(student=student)
    serializer = SelectedSubjectsSerializer(selected_subjects, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getSelectedSubjectsClass(request, pk):
    s_class = StudentClass.objects.get(_id=pk)
    students = Student.objects.filter(currentClass=s_class)
    selected_subjects = []

    for student in students:
        try:
            selected_subjects.append(
                SelectedSubjects.objects.get(student=student._id))
        except:
            selected_subjects.append(None)

    serializer = SelectedSubjectsSerializer(selected_subjects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getAllStudentsSelectedSubjects(request):
    selected_subjects = []

    students = Student.objects.all()

    for student in students:
        try:
            selected_subjects.append(
                SelectedSubjects.objects.get(student=student._id))
        except:
            selected_subjects.append(None)

    serializer = SelectedSubjectsSerializer(selected_subjects, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def dropSubjects(request, pk):
    student = Student.objects.get(_id=pk)
    selectedSubjects = request.data['selected_subjects']
    selected_T4 = SelectedT4.objects.get(student=student)

    # Check Sciences selection
    if len(selectedSubjects['sciences']) < 2:
        return Response({'detail': 'Student must select at least two Sciences, Chemistry and Any other Science'}, status=status.HTTP_400_BAD_REQUEST)

    # Check technical selection and ensure that the selected technical is either the same as the selected t4 or is 'Business Studies'
    if len(selectedSubjects['technicals']) > 1:
        return Response({'detail': 'Student can only select one Technical subject'}, status=status.HTTP_400_BAD_REQUEST)
    elif len(selectedSubjects['technicals']) == 0:
        return Response({'detail': 'Student must select one Technical subject'}, status=status.HTTP_400_BAD_REQUEST)

    if selectedSubjects['technicals'][0] != selected_T4.t4._id and selectedSubjects['technicals'][0] != Subject.objects.get(name='Business Studies')._id:
        return Response({'detail': 'Student can only choose between their selected T4 and Business Studies'}, status=status.HTTP_400_BAD_REQUEST)

    # Check Humanities selection
    if len(selectedSubjects['sciences']) == 3:
        if len(selectedSubjects['humanities']) > 1:
            return Response({'detail': 'Student can only select one Humanities subject if they take three Sciences'}, status=status.HTTP_400_BAD_REQUEST)
        elif len(selectedSubjects['humanities']) == 0:
            return Response({'detail': 'Student must select one Humanities subject if they take three Sciences'}, status=status.HTTP_400_BAD_REQUEST)
    elif len(selectedSubjects['sciences']) == 2:
        if len(selectedSubjects['humanities']) > 2:
            return Response({'detail': 'Student can only select two Humanities subjects if they take two Sciences'}, status=status.HTTP_400_BAD_REQUEST)
        elif len(selectedSubjects['humanities']) < 2:
            return Response({'detail': 'Student must select two Humanities subjects if they take two Sciences'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the current student has already made subject selections
    selected_subjects = {}
    sciences = []
    humanities = []

    if SelectedSubjects.objects.filter(student=student).exists():
        selected_subjects = SelectedSubjects.objects.get(student=student)
    else:
        selected_subjects = SelectedSubjects.objects.create(student=student)

    selected_subjects.t8 = (Subject.objects.get(
        _id=selectedSubjects['technicals'][0]))

    for sci in selectedSubjects['sciences']:
        sciences.append(Subject.objects.get(_id=sci))
        selected_subjects.s5.set(sciences)

    for hum in selectedSubjects['humanities']:
        humanities.append(Subject.objects.get(_id=hum))
        selected_subjects.h7.set(humanities)

    selected_subjects.save()

    serializer = SelectedSubjectsSerializer(selected_subjects, many=False)
    return Response(serializer.data)
