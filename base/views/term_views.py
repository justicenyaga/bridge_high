from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from base.models import Term
from base.serializers import TermSerializer


@api_view(['GET'])
def getTerms(request):
    terms = Term.objects.all()
    serializer = TermSerializer(terms, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getTerm(request, pk):
    term = Term.objects.get(_id=pk)
    serializer = TermSerializer(term, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createTerm(request):
    term = Term.objects.create(
        name=""
    )
    term.save()

    return Response(TermSerializer(term, many=False).data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateTerm(request, pk):
    term = Term.objects.get(_id=pk)
    data = request.data

    term.name = data['name']
    term.isCurrent = data['isCurrent']
    term.save()

    return Response(TermSerializer(term, many=False).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteTerm(request, pk):
    term = Term.objects.get(_id=pk)
    term.delete()

    return Response(TermSerializer(term, many=False).data)
