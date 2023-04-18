from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from base.models import StudentClass, Stream
from base.serializers import StudentClassSerializer, StreamSerializer


@api_view(['GET'])
def getClasses(request):
    classes = StudentClass.objects.all()
    serializer = StudentClassSerializer(classes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getClass(request, pk):
    student_class = StudentClass.objects.get(_id=pk)
    serializer = StudentClassSerializer(student_class, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getStreams(request):
    streams = Stream.objects.all()
    serializer = StreamSerializer(streams, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getStream(request, pk):
    stream = Stream.objects.get(_id=pk)
    serializer = StreamSerializer(stream, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createStream(request):
    stream = Stream.objects.create(
        name=""
    )
    stream.save()

    return Response(StreamSerializer(stream, many=False).data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateStream(request, pk):
    data = request.data
    stream = Stream.objects.get(_id=pk)

    stream.name = data['name']

    stream.save()

    return Response(StreamSerializer(stream, many=False).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteStream(request, pk):
    stream = Stream.objects.get(_id=pk)
    stream.delete()

    return Response(StreamSerializer(stream, many=False).data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createClass(request):
    s_class = StudentClass.objects.create(
        name="",
        stream=None
    )

    s_class.save()

    return Response(StudentClassSerializer(s_class, many=False).data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateClass(request, pk):
    data = request.data

    s_class = StudentClass.objects.get(_id=pk)
    stream = Stream.objects.get(name=data['stream'])

    s_class.name = data['name']
    s_class.stream = stream

    s_class.save()

    return Response(StudentClassSerializer(s_class, many=False).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteClass(request, pk):
    s_class = StudentClass.objects.get(_id=pk)
    s_class.delete()

    return Response(StudentClassSerializer(s_class, many=False).data)
