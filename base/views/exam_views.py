from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from base.models import Exam
from base.serializers import ExamSerializer


@api_view(['GET'])
def getExams(request):
    exams = Exam.objects.all()
    serializer = ExamSerializer(exams, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getExam(request, pk):
    exam = Exam.objects.get(_id=pk)
    serializer = ExamSerializer(exam, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createExam(request):
    exam = Exam.objects.create(
        name="",
    )
    return Response(ExamSerializer(exam, many=False).data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateExam(request, pk):
    data = request.data
    exam = Exam.objects.get(_id=pk)

    exam.name = data['name']
    exam.save()

    return Response(ExamSerializer(exam, many=False).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteExam(request, pk):
    exam = Exam.objects.get(_id=pk)
    exam.delete()
    return Response(ExamSerializer(exam, many=False).data)
