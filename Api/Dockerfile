FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0-focal AS build
WORKDIR /src
COPY ["Api/Api.csproj", "Api/"]
COPY ["Tests/Tests.csproj", "Tests/"]
RUN dotnet restore "Api/Api.csproj"
RUN dotnet restore "Tests/Tests.csproj"
COPY ["Api/", "Api/"]
COPY ["Tests/", "Tests/"]
WORKDIR "/src/Api"
RUN dotnet build "Api.csproj" -c Release -o /app/build
WORKDIR "/src/Tests"
RUN dotnet test "Tests.csproj"

FROM build AS publish
WORKDIR "/src/Api"
RUN dotnet publish "Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]