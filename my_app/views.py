from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from kafka import KafkaProducer
import json
import base64
import logging

@api_view(['POST'])
def upload_file(request):
    if 'file' not in request.FILES:
        return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

    file = request.FILES['file']
    file_content = file.read()
    encoded_file = base64.b64encode(file_content).decode('utf-8')

    producer = KafkaProducer(
        bootstrap_servers='localhost:9092',
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )

    message = {
        'filename': file.name,
        'file_content': encoded_file
    }


    topics = ['OCR', 'Extraction', 'Embedding','PostgreSQL','Solr','Elastic']
    for topic in topics:
        producer.send(topic, value=message)
        print(f"Message sent to {topic}: {message}")

    producer.flush()
    producer.close()
    
    return Response({"message": "File uploaded successfully!", "filename": file.name}, status=status.HTTP_201_CREATED)
