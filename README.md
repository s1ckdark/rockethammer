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
└── spring-boot-security-jwt-mongodb.jar
```

# Clone

> git clone https://github.com/pdev-gd/rockethammer-admin.git

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
PUBLIC_URL="http://{IP}"
# key-value 형태로 터미널 정보를 넣어준다
REACT_APP_TERMINAL= {"vm01":"10.20.19.92:7681", "vm02":"10.20.19.93:7681", "vm03":"10.20.19.94:7681", "vm04":"10.20.19.95:7681", "vm05":"10.20.19.96:7681", "vm06":"10.20.19.97:7681", "vm07":"10.20.19.98:7681", "vm08":"10.20.19.99:7681", "vm09":"10.20.19.100:7681", "vm10":"10.20.19.101:7681", "vm11":"10.20.19.102:7681", "vm12":"10.20.19.103:7681"}
# 정보가 없다면 빈 object를 넣어놓는다. 이럴 경우에 네비게이션에 터미널 메뉴가 사라진다
REACT_APP_TERMINAL= {}

```

```
> npm i --force
> npm run build
```

---

# Backend

## JAVA JDK 1.17

```
app.properties template을 수정하여 환경 설정 후 실행한다.
> cd rockethammer-admin
> vi app.properties
```

spring.data.mongodb.uri={mongodb uri}
spring.data.mongodb.database=web
spring.data.setAllowedOrigins={rockethammer server ip}
server.port= 8085
spring.data.kafka.bootstrap_servers={kafka uri:port}

# App Properties

goodusdata.app.jwtSecret=goodusSecretKey
goodusdata.app.jwtExpirationMs=86400000

logging.level.root=INFO

```
> nohup java -jar -Dspring.config.location=app.properties spring-boot-security-jwt-mongodb.jar &
```
