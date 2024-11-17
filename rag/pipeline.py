import typing as tp
from langchain_core.documents import Document
from langchain_postgres import PGVector
from langchain_postgres.vectorstores import PGVector
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain_text_splitters import TokenTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain


EMBED_MODEL_NAME = "nomic-ai/nomic-embed-text-v1"
OLLAMA_MODEL_NAME = "llama3.2:3b-instruct-fp16"


class RAGPipeline:

    def __init__(
        self,
        pg_vector_dsn: str,
        collection_name: str,
        embeddings: HuggingFaceEmbeddings = HuggingFaceEmbeddings(
            model_name=EMBED_MODEL_NAME,
            model_kwargs={"trust_remote_code": True},
        ),
        ollama_model: OllamaLLM = OllamaLLM(
            base_url="http://localhost:11434",
            model=OLLAMA_MODEL_NAME,
        ),
        splitter=TokenTextSplitter(chunk_size=1000),
        system_prompt: str | None = None,
    ):
        self.__store: PGVector = PGVector(
            embeddings=embeddings,
            collection_name=collection_name,
            connection=pg_vector_dsn,
            use_jsonb=True,
        )
        self.__splitter: TokenTextSplitter = splitter
        self.__llm: OllamaLLM = ollama_model
        self.__retriever = self.__store.as_retriever()
        if system_prompt is None:
            self.__system_prompt = (
                "ты специалист который помогает с поиском информации по данным о заболеваниях"
                "постарайся найти информацию в текстах и максимально кратко и точно определись список симптомов и диагноз"
                "если не можешь найти информацию, то попробуй задать вопрос врачу"
                "помни, что ты не врач и не можешь диагностировать заболевания"
                "твоя задача - найти информацию и помочь пациенту"
                "постарайся найти информацию в текстах и максимально кратко и точно определись список симптомов и диагноз"
                "\n\n"
                "Тексты для поиска:"
                "{context}"
            )
        else:
            self.__system_prompt = system_prompt

        self.__prompt = ChatPromptTemplate.from_messages(
            [
                ("system", self.__system_prompt),
                ("human", "{input}"),
            ]
        )
        question_answer_chain = create_stuff_documents_chain(
            self.__llm,
            self.__prompt,
        )
        self.__rag_chain = create_retrieval_chain(
            self.__retriever,
            question_answer_chain,
        )

    def add_documents(self, texts: list[str], metadata: list[dict]):
        # split the document into chunks
        chunks = self.__splitter.create_documents(
            texts=texts,
            metadatas=metadata,
        )
        # add the chunks to the store
        self.__store.add_documents(chunks)

    def stream_query(self, query: str) -> tp.Generator[Document, None, None]:
        for chunk in self.__rag_chain.stream({"input": query}):
            yield chunk
        return None
