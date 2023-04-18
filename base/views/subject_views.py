from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from base.models import Subject, Department
from base.serializers import SubjectSerializer


@api_view(['GET'])
def getSubjects(request):
    subjects = Subject.objects.all()
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getSubject(request, pk):
    subject = Subject.objects.get(_id=pk)
    serializer = SubjectSerializer(subject, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createSubject(request):
    subject = Subject.objects.create(
        name="",
        dept=None,
    )
    subject.save()

    return Response(SubjectSerializer(subject, many=False).data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateSubject(request, pk):
    data = request.data
    subject = Subject.objects.get(_id=pk)

    dept = Department.objects.get(name=data['dept'])

    subject.name = data['name']
    subject.abbr = data['abbr']
    subject.dept = dept
    subject.isCompulsory = data['isCompulsory']

    subject.save()

    return Response(SubjectSerializer(subject, many=False).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteSubject(request, pk):
    subject = Subject.objects.get(_id=pk)
    subject.delete()

    return Response(SubjectSerializer(subject, many=False).data)
