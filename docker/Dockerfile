FROM mcr.microsoft.com/playwright:v1.46.0-noble AS production

WORKDIR "/var/e2e"
COPY . /var/e2e

FROM production AS development

RUN npm install
