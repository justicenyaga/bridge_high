from rest_framework import serializers
from .models import Result
from base.models import Subject, GradingSystem
from base.serializers import (
    SessionSerializer,
    TermSerializer,
    StudentClassSerializer,
    SubjectSerializer,
    ExamSerializer)


class ResultSerializer(serializers.ModelSerializer):
    session = serializers.SerializerMethodField(read_only=True)
    term = serializers.SerializerMethodField(read_only=True)
    subject = serializers.SerializerMethodField(read_only=True)
    exam = serializers.SerializerMethodField(read_only=True)
    currentClass = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Result
        fields = '__all__'

    def get_session(self, obj):
        return SessionSerializer(obj.session).data

    def get_term(self, obj):
        return TermSerializer(obj.term).data

    def get_subject(self, obj):
        return SubjectSerializer(obj.subject).data

    def get_exam(self, obj):
        return ExamSerializer(obj.exam).data

    def get_currentClass(self, obj):
        return StudentClassSerializer(obj.currentClass).data


class SubjectResultsSerializer(serializers.Serializer):
    student = serializers.SerializerMethodField(read_only=True)
    session = serializers.SerializerMethodField(read_only=True)
    term = serializers.SerializerMethodField(read_only=True)
    exam = serializers.SerializerMethodField(read_only=True)
    currentClass = serializers.SerializerMethodField(read_only=True)
    subject_results = serializers.SerializerMethodField()

    class Meta:
        model = Result
        fields = [
            'student', 'session', 'term', 'exam', 'subject_results'
        ]

    def get_subject_results(self, obj):
        subject_results = {}
        results = obj.filter().values_list('subject', 'score')
        total = 0
        mean = 0

        # append grades to subject_results

        grading = GradingSystem.objects.get(_id=1)

        for result in results:
            subject = result[0]
            score = result[1]

            grade = ''

            if score >= grading.A:
                grade = 'A'
            elif score >= grading.A_minus:
                grade = 'A-'
            elif score >= grading.B_plus:
                grade = 'B+'
            elif score >= grading.B:
                grade = 'B'
            elif score >= grading.B_minus:
                grade = 'B-'
            elif score >= grading.C_plus:
                grade = 'C+'
            elif score >= grading.C:
                grade = 'C'
            elif score >= grading.C_minus:
                grade = 'C-'
            elif score >= grading.D_plus:
                grade = 'D+'
            elif score >= grading.D:
                grade = 'D'
            elif score >= grading.D_minus:
                grade = 'D-'
            elif score < grading.D_minus and score >= 0:
                grade = 'E'

            if subject not in subject_results:
                subject_abbr = SubjectSerializer(
                    Subject.objects.get(_id=subject)).data['abbr']
                subject_results[subject_abbr] = score
                subject_results[subject_abbr + '_grade'] = grade

            total += score

        if len(results) > 0:
            mean = round(total / len(results), 2)  # 2 decimal places

            if mean >= grading.A:
                subject_results['mean_grade'] = 'A'
            elif mean >= grading.A_minus:
                subject_results['mean_grade'] = 'A-'
            elif mean >= grading.B_plus:
                subject_results['mean_grade'] = 'B+'
            elif mean >= grading.B:
                subject_results['mean_grade'] = 'B'
            elif mean >= grading.B_minus:
                subject_results['mean_grade'] = 'B-'
            elif mean >= grading.C_plus:
                subject_results['mean_grade'] = 'C+'
            elif mean >= grading.C:
                subject_results['mean_grade'] = 'C'
            elif mean >= grading.C_minus:
                subject_results['mean_grade'] = 'C-'
            elif mean >= grading.D_plus:
                subject_results['mean_grade'] = 'D+'
            elif mean >= grading.D:
                subject_results['mean_grade'] = 'D'
            elif mean >= grading.D_minus:
                subject_results['mean_grade'] = 'D-'
            elif mean < grading.D_minus and mean >= 0:
                subject_results['mean_grade'] = 'E'

        subject_results['total'] = total
        subject_results['mean'] = mean

        return subject_results

    def get_student(self, obj):
        student_obj = {}

        if obj:
            student_obj['_id'] = obj[0].student._id
            student_obj['name'] = obj[0].student.name
            student_obj['regNo'] = obj[0].student.code
            student_obj['user_id'] = obj[0].student.user.id

        return student_obj

    def get_session(self, obj):
        if obj:
            return obj[0].session.name

    def get_term(self, obj):
        if obj:
            return obj[0].term.name

    def get_currentClass(self, obj):
        if obj:
            return StudentClassSerializer(obj[0].currentClass).data

    def get_exam(self, obj):
        if obj:
            return obj[0].exam.name
