from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from base.models import GradingSystem, Session
from base.serializers import GradingSystemSerializer


@api_view(['GET'])
def getGradingSystems(request):
    gradingSystems = GradingSystem.objects.all()
    serializer = GradingSystemSerializer(gradingSystems, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getGradingSystem(request, pk):
    gradingSystem = GradingSystem.objects.get(_id=pk)
    serializer = GradingSystemSerializer(gradingSystem, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createGradingSystem(request):
    gradingSystem = GradingSystem.objects.create(
        session=None
    )

    return Response(GradingSystemSerializer(gradingSystem, many=False).data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateGradingSystem(request, pk):
    data = request.data

    session = Session.objects.get(name=data['session'])

    gradingSystem = GradingSystem.objects.get(_id=pk)

    gradingSystem.session = session
    gradingSystem.A = data['A']
    gradingSystem.A_minus = data['A_minus']
    gradingSystem.B_plus = data['B_plus']
    gradingSystem.B = data['B']
    gradingSystem.B_minus = data['B_minus']
    gradingSystem.C_plus = data['C_plus']
    gradingSystem.C = data['C']
    gradingSystem.C_minus = data['C_minus']
    gradingSystem.D_plus = data['D_plus']
    gradingSystem.D = data['D']
    gradingSystem.D_minus = data['D_minus']

    gradingSystem.save()

    return Response(GradingSystemSerializer(gradingSystem, many=False).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteGradingSystem(request, pk):
    gradingSystem = GradingSystem.objects.get(_id=pk)
    gradingSystem.delete()
    return Response(GradingSystemSerializer(gradingSystem, many=False).data)
