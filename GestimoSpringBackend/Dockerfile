FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -DskipTests package

FROM eclipse-temurin:17-jre-jammy

RUN apt-get update \
  && apt-get install -y --no-install-recommends fontconfig fonts-dejavu-core \
  && rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash spring
WORKDIR /app
COPY --from=build /workspace/target/*.jar /app/app.jar

USER spring
EXPOSE 8287
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
