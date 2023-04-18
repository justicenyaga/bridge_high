from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Result
from students.models import Student
from base.models import StudentClass, Term, Exam, Session, Subject

from .serializers import ResultSerializer, SubjectResultsSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getResults(request):
    results = Result.objects.all()
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getResult(request, pk):
    result = Result.objects.get(_id=pk)
    serializer = ResultSerializer(result, many=False)
    return Response(serializer.data)


def getStudentExamResults(pk, cls, tm, em):
    results = Result.objects.filter(
        student=pk, currentClass=cls, term=tm, exam=em)

    serializer = SubjectResultsSerializer(results, many=False)
    return serializer.data


def getStudentSnExamResults(pk, sn, cls, tm, em):
    results = Result.objects.filter(
        student=pk, session=sn, currentClass=cls, term=tm, exam=em)

    serializer = SubjectResultsSerializer(results, many=False)
    return serializer.data


@api_view(['GET'])
def getStudentTermResults(request, pk, cls, tm):
    exams = Exam.objects.all()

    results = []

    for exam in exams:
        result = getStudentExamResults(
            pk, cls, tm, exam)
        results.append(result)

    return Response(results)


@api_view(['GET'])
def getStudentYearResults(request, pk, cls):
    terms = Term.objects.all()
    exams = Exam.objects.all()

    results = []

    for term in terms:
        for exam in exams:
            result = getStudentExamResults(
                pk, cls, term, exam)
            results.append(result)

    return Response(results)


@api_view(['GET'])
def getStudentResults(request, pk):
    classes = StudentClass.objects.all()
    terms = Term.objects.all()
    exams = Exam.objects.all()

    results = []

    for s_class in classes:
        for term in terms:
            for exam in exams:
                result = getStudentExamResults(
                    pk, s_class, term, exam)
                results.append(result)
    return Response(results)


# get students results for a particular class
def getClassExamResults(cls, sn, tm, em):
    students = Student.objects.filter(currentClass=cls)
    results = []

    for student in students:
        result = getStudentSnExamResults(
            student._id, sn, cls, tm, em)
        results.append(result)

    return results


@api_view(['GET'])
def getClassResults(request, pk, sn):
    s_class = StudentClass.objects.get(_id=pk)
    terms = Term.objects.all()
    exams = Exam.objects.all()

    results = []

    for term in terms:
        for exam in exams:
            result = getClassExamResults(
                s_class, sn, term, exam)
            results.append(result)

    return Response(results)


@api_view(['GET'])
def getSchoolResults(request):
    sessions = Session.objects.all()
    classes = StudentClass.objects.all()
    terms = Term.objects.all()
    exams = Exam.objects.all()

    results = []

    for session in sessions:
        for s_class in classes:
            for term in terms:
                for exam in exams:
                    result = getClassExamResults(
                        s_class, session, term, exam)
                    results.append(result)

    return Response(results)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createResult(request):
    data = request.data

    result = Result.objects.create(
        student=Student.objects.get(_id=data['student']),
        session=Session.objects.get(_id=data['session']),
        currentClass=StudentClass.objects.get(_id=data['currentClass']),
        term=Term.objects.get(_id=data['term']),
        exam=Exam.objects.get(_id=data['exam']),
        subject=Subject.objects.get(_id=data['subject']),
        score=data['score']
    )

    result.save()

    serializer = ResultSerializer(result, many=False)

    return Response(serializer.data)
