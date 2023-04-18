from rest_framework.decorators import api_view
from rest_framework.response import Response
from base.models import Session
from base.serializers import SessionSerializer


@api_view(['GET'])
def getSessions(request):
    sessions = Session.objects.all()
    serializer = SessionSerializer(sessions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getSession(request, pk):
    session = Session.objects.get(_id=pk)
    serializer = SessionSerializer(session, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def createSession(request):
    session = Session.objects.create(
        name=""
    )

    session.save()
    return Response(SessionSerializer(session, many=False).data)


@api_view(['PUT'])
def updateSession(request, pk):
    data = request.data
    session = Session.objects.get(_id=pk)

    session.name = data['name']
    session.isCurrent = data['isCurrent']

    session.save()

    return Response(SessionSerializer(session, many=False).data)


@api_view(['DELETE'])
def deleteSession(request, pk):
    session = Session.objects.get(_id=pk)
    session.delete()

    return Response(SessionSerializer(session, many=False).data)
