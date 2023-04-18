from rest_framework import serializers
from .models import Register


class RegisterSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField(read_only=True)
    session = serializers.SerializerMethodField(read_only=True)
    term = serializers.SerializerMethodField(read_only=True)
    current_class = serializers.SerializerMethodField(read_only=True)
    signed_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Register
        fields = '__all__'

    def get_student(self, obj):
        return {'code': obj.student.code, 'name': obj.student.name}

    def get_session(self, obj):
        return {'_id': obj.session._id, 'name': obj.session.name}

    def get_term(self, obj):
        return {'_id': obj.term._id, 'name': obj.term.name}

    def get_current_class(self, obj):
        return {'_id': obj.current_class._id, 'name': obj.current_class.name, 'stream': obj.current_class.stream.name}

    def get_signed_by(self, obj):
        return {'code': obj.signed_by.code, 'name': obj.signed_by.name}
