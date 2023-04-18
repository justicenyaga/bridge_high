from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorageS3Boto3Storage(S3Boto3Storage):
    location = 'images'
    file_overwrite = False  # prevent overwriting existing files with the same name
