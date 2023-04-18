from rest_framework import serializers
from .models import Teacher, ClassTeacher, SubjectAllotment, SubjectClassAllotment

from base.models import Subject, StudentClass
from base.serializers import SubjectSerializer
from base.serializers import StudentClassSerializer, SessionSerializer


class SubjectAllotmentSerializer(serializers.ModelSerializer):
    subject = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SubjectAllotment
        fields = '__all__'

    def get_subject(self, obj):
        return {
            'name': obj.subject.name,
            '_id': obj.subject._id,
        }


class SubjectClassAllotmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectClassAllotment
        fields = '__all__'


class TeacherSerializer(serializers.ModelSerializer):
    code = serializers.SerializerMethodField(read_only=True)
    subjects = serializers.SerializerMethodField(read_only=True)
    dept = serializers.SerializerMethodField(read_only=True)
    subjects_class = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Teacher
        fields = '__all__'

    def get_code(self, obj):
        return obj.code

    def get_subjects(self, obj):
        subjects_alloted = obj.subjectallotment_set.all()
        subjects = []
        for subject in subjects_alloted:
            subjects.append(Subject.objects.get(_id=subject.subject_id))

        return SubjectSerializer(subjects, many=True).data

    def get_subjects_class(self, obj):
        sub_class_alloted = obj.subjectclassallotment_set.all()
        subs_class = []
        for sub_class in sub_class_alloted:
            class_name = sub_class.class_name.name
            stream = sub_class.class_name.stream.name
            sub = sub_class.subject.name

            subs_class.append({
                'class': class_name + ' ' + stream,
                'subject': sub,
            })

        return subs_class

    def get_dept(self, obj):
        if obj.dept:
            return obj.dept.name


class ClassTeacherSerializer(serializers.ModelSerializer):
    alloted_class = serializers.SerializerMethodField(read_only=True)
    teacher = serializers.SerializerMethodField(read_only=True)
    session = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ClassTeacher
        fields = '__all__'

    def get_alloted_class(self, obj):
        if obj.alloted_class:
            stream = obj.alloted_class.stream.name
            class_name = obj.alloted_class.name
            allotedClass = {
                'name': class_name + ' ' + stream,
                '_id': obj.alloted_class._id,
            }
            return allotedClass

    def get_teacher(self, obj):
        if obj.teacher:
            teacher = {
                'name': obj.teacher.name,
                'code': obj.teacher.code,
                '_id': obj.teacher._id,
            }
            return teacher

    def get_session(self, obj):
        if obj.session:
            return SessionSerializer(obj.session).data
