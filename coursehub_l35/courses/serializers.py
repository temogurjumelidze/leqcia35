from rest_framework import serializers
from .models import Course, CourseReview


class CourseReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseReview
        fields = ['id', 'course', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class CourseSerializer(serializers.ModelSerializer):
    reviews = CourseReviewSerializer(many=True, read_only=True)
    confirm_fee = serializers.DecimalField(max_digits=7, decimal_places=2, write_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'fee', 'is_available', 'reviews', 'instructor', 'confirm_fee']
        read_only_fields = ['id']

    def validate(self, data):
        if 'confirm_fee' in data and data['fee'] != data['confirm_fee']:
            raise serializers.ValidationError("Fee and confirm fee does not match")
        return data

    # confirm_fee veli bazashi ar migvaqvs, mxolod validaciistvis gvinda
    def create(self, validated_data):
        validated_data.pop('confirm_fee', None)
        return super().create(validated_data)
