from rest_framework import serializers
from .models import Student, SelectedSubjects, SelectedT4
from base.serializers import StudentClassSerializer, SubjectSerializer


class StudentSerializer(serializers.ModelSerializer):
    code = serializers.SerializerMethodField(read_only=True)
    currentClass = serializers.SerializerMethodField(read_only=True)
    graduatedAt = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Student
        fields = '__all__'

    def get_code(self, obj):
        return obj.code

    def get_currentClass(self, obj):
        return StudentClassSerializer(obj.currentClass).data

    def get_graduatedAt(self, obj):
        if obj.graduatedAt:
            return obj.graduatedAt.name


class SelectedT4Serializer(serializers.ModelSerializer):
    t4 = serializers.SerializerMethodField(read_only=True)
    s_class = serializers.SerializerMethodField(read_only=True)
    student = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SelectedT4
        fields = '__all__'

    def get_t4(self, obj):
        return SubjectSerializer(obj.t4, many=False).data

    def get_s_class(self, obj):
        if obj.student.currentClass:
            return {
                '_id': obj.student.currentClass._id,
                'name': obj.student.currentClass.name,
                'stream': obj.student.currentClass.stream.name
            }

    def get_student(self, obj):
        return {
            'code': obj.student.code,
            'name': obj.student.name,
            'isActive': obj.student.isActive,
            'isGraduated': obj.student.isGraduated,
            'graduatedAt': obj.student.graduatedAt.name if obj.student.graduatedAt else None,
            'user': obj.student.user.id,
        }


class SelectedSubjectsSerializer(serializers.ModelSerializer):
    s_class = serializers.SerializerMethodField(read_only=True)
    t8 = serializers.SerializerMethodField(read_only=True)
    s5 = serializers.SerializerMethodField(read_only=True)
    h7 = serializers.SerializerMethodField(read_only=True)
    student = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SelectedSubjects
        fields = '__all__'

    def get_s_class(self, obj):
        if obj.student.currentClass:
            return {
                '_id': obj.student.currentClass._id,
                'name': obj.student.currentClass.name,
                'stream': obj.student.currentClass.stream.name
            }

    def get_t8(self, obj):
        return SubjectSerializer(obj.t8, many=False).data

    def get_s5(self, obj):
        return SubjectSerializer(obj.s5, many=True).data

    def get_h7(self, obj):
        return SubjectSerializer(obj.h7, many=True).data

    def get_student(self, obj):
        return {
            'code': obj.student.code,
            'name': obj.student.name,
            'isActive': obj.student.isActive,
            'isGraduated': obj.student.isGraduated,
            'graduatedAt': obj.student.graduatedAt.name if obj.student.graduatedAt else None,
            'user': obj.student.user.id,
        }
