import grpc
from concurrent import futures
import time

import rag_service_pb2
import rag_service_pb2_grpc
from pipeline import (
    RAGPipeline,
)  # Ensure pipeline.py is in the same directory or adjust the import accordingly


class RAGServiceServicer(rag_service_pb2_grpc.RAGServiceServicer):
    def __init__(self, pipeline: RAGPipeline):
        self.pipeline = pipeline

    def AddDocuments(self, request, context):
        try:
            texts = list(request.texts)
            metadata = [dict(m.fields) for m in request.metadata]
            self.pipeline.add_documents(texts, metadata)
            return rag_service_pb2.AddDocumentsResponse(
                status="Documents added successfully."
            )
        except Exception as e:
            context.set_details(str(e))
            context.set_code(grpc.StatusCode.INTERNAL)
            return rag_service_pb2.AddDocumentsResponse()

    def StreamQuery(self, request, context):
        try:
            for doc in self.pipeline.stream_query(request.query):
                print("type(doc):", type(doc), doc)
                if "input" in doc:
                    yield rag_service_pb2.StreamQueryResponse(content="", metadata={})
                yield rag_service_pb2.StreamQueryResponse(
                    content=doc.page_content, metadata=doc.metadata
                )
        except Exception as e:
            context.set_details(str(e))
            context.set_code(grpc.StatusCode.INTERNAL)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    rag_service_pb2_grpc.add_RAGServiceServicer_to_server(
        RAGServiceServicer(
            RAGPipeline(
                pg_vector_dsn="postgresql+psycopg://pg-user:pg-password@localhost:5432/tula-dev",
                collection_name="disease_docs",
            )
        ),
        server,
    )
    server.add_insecure_port("[::]:50051")
    server.start()
    print("gRPC server is running on port 50051...")
    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == "__main__":
    serve()
