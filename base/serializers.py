from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import RefreshToken
from .models import Stream, StudentClass, Session, Term, Exam, Subject, Department, GradingSystem


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField(read_only=True)
    name = serializers.SerializerMethodField(read_only=True)
    is_admin = serializers.SerializerMethodField(read_only=True)
    is_teacher = serializers.SerializerMethodField(read_only=True)
    is_sStaff = serializers.SerializerMethodField(read_only=True)
    is_student = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['_id', 'username', 'name', 'email',
                  'is_admin', 'is_teacher', 'is_sStaff', 'is_student']

    def get__id(self, obj):
        return obj.id

    def get_name(self, obj):
        name = obj.first_name

        if name == '':
            name = obj.email

        return name

    def get_is_admin(self, obj):
        return obj.is_staff

    def get_is_teacher(self, obj):
        if obj.email.endswith('@teachers.bridgehigh.com'):
            return True

        return False

    def get_is_sStaff(self, obj):
        if obj.email.endswith('@sStaff.bridgehigh.com'):
            return True

        return False

    def get_is_student(self, obj):
        if obj.email.endswith('@students.bridgehigh.com'):
            return True

        return False


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['_id', 'username', 'name', 'email',
                  'is_admin', 'is_teacher', 'is_sStaff', "is_student", 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class StreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stream
        fields = '__all__'


class StudentClassSerializer(serializers.ModelSerializer):
    stream = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentClass
        fields = '__all__'

    def get_stream(self, obj):
        if obj.stream:
            return obj.stream.name


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'


class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Term
        fields = '__all__'


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    dept = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Subject
        fields = '__all__'

    def get_dept(self, obj):
        if obj.dept:
            return obj.dept.name


class GradingSystemSerializer(serializers.ModelSerializer):
    session = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = GradingSystem
        fields = '__all__'

    def get_session(self, obj):
        if obj.session:
            return obj.session.name
