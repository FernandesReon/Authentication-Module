# -------------- Stage 1: Build the application --------------

# official maven image to build the app
FROM maven:3.8.4-openjdk-17 AS build

# a working directory
WORKDIR /app

# copy the pom.xml and install dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# copy the source code and build application
COPY src ./src
RUN mvn clean package -DskipTests

# ------------- Stage 2: Run the application -----------------
# Use official OpenJDK image to run the application
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# copy the built jar file form the build stage
COPY --from=build /app/target/auth_backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
