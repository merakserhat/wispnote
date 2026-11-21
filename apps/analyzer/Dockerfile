# syntax=docker/dockerfile:1

FROM eclipse-temurin:21-jdk AS build
WORKDIR /build
COPY . .
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw -B -q -pl infrastructure -am package -DskipTests

FROM eclipse-temurin:21-jre
RUN useradd --system --uid 10001 wispnote
WORKDIR /app
COPY --from=build /build/infrastructure/target/wispnote-analyzer.jar app.jar
USER 10001
ENV SERVER_PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
