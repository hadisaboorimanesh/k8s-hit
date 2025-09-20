FROM docker.hasti.co/alpha/python:3.10 AS build

WORKDIR /app

ENV PATH="/venv/bin:$PATH"
RUN python -m venv /venv

COPY requirements.txt requirements.txt

RUN pip config --user set global.index-url https://nexus.frox.ir/repository/pypi/simple && \
    pip config --user set global.no-cache-dir false && \
    pip install -U pip && \
    pip install -r requirements.txt


FROM docker.hasti.co/alpha/python:3.10 AS production

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PATH="/venv/bin:$PATH"

EXPOSE 80
WORKDIR /app
COPY --from=build  /venv /venv


COPY . ./

RUN useradd -u 10001 user1 && groupadd group1  && \
        chown -R user1:group1 /app/
 
USER user1:group1

CMD uvicorn web-service.api:app --host 0.0.0.0 --port 80


