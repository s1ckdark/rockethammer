```
.
├── README.md
├── app.properties
├── frontend
│   ├── README.md
│   ├── env.template
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico-
│   │   ├── favicon.png
│   │   ├── img
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── req.cnf
│   └── src
│       ├── App.css
│       ├── App.css.map
│       ├── App.js
│       ├── App.scss
│       ├── App.test.js
│       ├── components
│       ├── dist
│       ├── img
│       ├── index.css
│       ├── index.css.map
│       ├── index.js
│       ├── index.scss
│       ├── logo.svg
│       ├── reportWebVitals.js
│       ├── serviceWorker.js
│       ├── services
│       └── setupTests.js
├── nohup.out
└── spring-boot-security-jwt-mongodb-0.2.7-SNAPSHOT.jar
```

# Clone
>git clone https://github.com/pdev-gd/rockethammer-admin.git

# Frontend
env.template를 수정하여 환경설정 진행
> cd rockethammer-admin/frontend
> cp env.template .env
> vi .env
```
REACT_APP_API='/api'
REACT_APP_PROMETHEUS={url:port}
REACT_APP_GRAFANA={url:port}
REACT_APP_KAFAKUI={url:port}
```
```
> npm install
> npm run build
```
---

# Backend
## JAVA JDK 1.8
```
app.properties template을 수정하여 환경 설정 후 실행한다.
> cd rockethammer-admin
> cp app.properties default.properties
> vi default.properties
```
spring.data.mongodb.uri={mongodb uri}
spring.data.mongodb.database=web
spring.data.setAllowedOrigins={rockethammer server ip}

# App Properties
goodusdata.app.jwtSecret=goodusSecretKey
goodusdata.app.jwtExpirationMs=86400000

logging.level.root=INFO

```
> nohup java -jar -Dspring.config.location={/path/to/properties} spring-boot-security-jwt-mongodb-0.2.7-SNAPSHOT.jar &
```