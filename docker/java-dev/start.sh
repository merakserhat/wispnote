#!/usr/bin/env bash
set -e
mvn -q -o install -DskipTests 2>/dev/null || mvn -q install -DskipTests
exec mvn -pl infrastructure spring-boot:run -Dspring-boot.run.profiles=local
