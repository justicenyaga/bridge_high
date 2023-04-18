from rest_framework import serializers
from .models import Admin


class AdminSerializer(serializers.ModelSerializer):
    code = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Admin
        fields = '__all__'

    def get_code(self, obj):
        return obj.code
